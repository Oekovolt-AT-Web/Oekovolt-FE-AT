# Copyright (c) 2026, ÖKOVOLT
#
# Reine Funktionen OHNE Frappe-Import:
#   - Antwortformen der Projekt-API (get_projekte, get_projekt, get_referenzkarte)
#   - Eingabeprüfung der Formulare (Kontakt, Angebot, Solarrechner)
#   - Texte der Benachrichtigungs- und Bestätigungs-E-Mails
#
# Bewusst aus den Whitelist-Methoden herausgelöst, damit tests/pruefe_vertrag.py
# den Vertrag aus docs/FRAPPE-AT-API-SPEZIFIKATION.md ohne Frappe-Installation prüfen kann.
# Die Whitelist-Methoden übersetzen EingabeFehler in frappe.throw(...) – die Website
# zeigt diesen Text dem Besucher an (HTTP 422), deshalb sind alle Meldungen deutsch.

import html
import ipaddress
import json
import math
import os
import re
import unicodedata
from datetime import date, datetime


class EingabeFehler(Exception):
	"""Ungültige Eingabe. Der Text wird dem Website-Besucher angezeigt."""


# ================================================================ Grundfunktionen

_STEUER_MEHRZEILIG = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
_STEUER_EINZEILIG = re.compile(r"[\x00-\x1f\x7f]")
_PFAD = re.compile(r"^/[\w\-/.%~]*$")


def sauber(wert, maximal, mehrzeilig=False):
	"""Text säubern: Steuerzeichen raus, trimmen, auf `maximal` Zeichen kürzen."""
	if wert is None or isinstance(wert, (dict, list, tuple, set, bytes)):
		return ""
	text = str(wert)
	if mehrzeilig:
		text = _STEUER_MEHRZEILIG.sub("", text.replace("\r\n", "\n").replace("\r", "\n"))
	else:
		text = re.sub(r"\s+", " ", _STEUER_EINZEILIG.sub(" ", text))
	return text.strip()[:maximal]


def zahl(wert):
	"""float oder None. Akzeptiert Zahlen und Texte wie „1.234,5“ oder „314,5 kWp“."""
	if wert is None or isinstance(wert, bool):
		return None
	if isinstance(wert, (int, float)):
		return float(wert) if math.isfinite(wert) else None
	text = re.sub(r"[^\d,.\-]", "", str(wert))
	if not text:
		return None
	if "," in text:
		text = text.replace(".", "").replace(",", ".")
	try:
		z = float(text)
	except ValueError:
		return None
	return z if math.isfinite(z) else None


def positiv(wert):
	"""Zahl > 0 oder None (Frappe speichert leere Float-Felder als 0)."""
	z = zahl(wert)
	return z if z is not None and z > 0 else None


def ganzzahl(wert):
	z = zahl(wert)
	return int(z) if z else None


def koordinate(wert, grenze):
	"""Breite (grenze=90) bzw. Länge (grenze=180) oder None. 0 gilt als „nicht gepflegt“."""
	z = zahl(wert)
	if z is None or z == 0 or abs(z) > grenze:
		return None
	return round(z, 6)


def text_oder_none(wert, maximal=500):
	return sauber(wert, maximal) or None


def zahl_de(wert, max_stellen=0, min_stellen=0):
	"""Deutsches Zahlenformat: 1234.5 -> „1.234,5“ (Nachkommastellen ohne Endnullen)."""
	z = zahl(wert)
	if z is None:
		return ""
	roh = f"{z:,.{max_stellen}f}"
	ganz, _punkt, dezimal = roh.partition(".")
	dezimal = dezimal.rstrip("0").ljust(min_stellen, "0")
	ganz = ganz.replace(",", ".")
	if ganz in ("-0", "-0.0"):
		ganz = "0"
	return f"{ganz},{dezimal}" if dezimal else ganz


def leistung_label(kwp):
	"""314.5 -> „314,5 kWp“, 1000 -> „1.000 kWp“, leer/0 -> „“."""
	z = positiv(kwp)
	return f"{zahl_de(z, 2)} kWp" if z is not None else ""


def slug(titel):
	"""Wie generateSlug() der Website (src/lib/slugify.js): „Mindelheim 2“ -> „mindelheim-2“."""
	s = str(titel or "").lower()
	for alt, neu in (("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss")):
		s = s.replace(alt, neu)
	s = unicodedata.normalize("NFD", s)
	s = re.sub(r"[̀-ͯ]", "", s)
	s = re.sub(r"[\s–—]+", "-", s)
	s = s.replace("/", "-")
	s = re.sub(r"[^a-z0-9-]", "", s)
	s = re.sub(r"-+", "-", s)
	return s.strip("-")


def datum_text(wert):
	"""datetime/Text -> „YYYY-MM-DD HH:MM:SS“ (ohne Mikrosekunden)."""
	if not wert:
		return None
	if isinstance(wert, datetime):
		return wert.strftime("%Y-%m-%d %H:%M:%S")
	if isinstance(wert, date):
		return wert.strftime("%Y-%m-%d 00:00:00")
	return str(wert)[:19]


def ist_oeffentlich(pfad):
	return bool(pfad) and not str(pfad).startswith(("/private/", "private/"))


def absolute_url(pfad, url_fn):
	"""/files/x.jpg -> https://<host>/files/x.jpg. Private Dateien werden nie ausgeliefert."""
	pfad = str(pfad or "").strip()
	if not pfad or not ist_oeffentlich(pfad):
		return None
	if pfad.startswith(("http://", "https://")):
		return pfad
	if not pfad.startswith("/"):
		pfad = "/" + pfad
	return url_fn(pfad)


def ja(wert):
	"""Checkbox-Wert aus JSON oder Formular."""
	if isinstance(wert, bool):
		return wert
	return str(wert).strip().lower() in ("1", "true", "on", "ja", "yes")


def ip_sauber(wert):
	"""Nur eine gültige IPv4/IPv6-Adresse, sonst „“."""
	text = sauber(wert, 64).split(",")[0].strip()
	try:
		return str(ipaddress.ip_address(text))
	except ValueError:
		return ""


def ist_honeypot(d):
	"""Feld „website“ ausgefüllt -> Bot. Anfrage still verwerfen."""
	return bool(sauber((d or {}).get("website"), 500))


def seitenpfad(wert):
	"""Nur einen Seitenpfad wie „/kontakt“ zulassen."""
	text = sauber(wert, 200)
	return text if _PFAD.match(text) else ""


# ================================================================ Projekte (#1–#3)

LISTEN_SCHLUESSEL = (
	"projekt_name", "projekt_website_name", "leistung", "leistung_label", "jahr", "ort", "land",
	"objekt", "dach", "bild_url", "bild_alt", "modified",
	"website_url", "branche",
)
# Kundenbühne: Social-Media-Profile des Kunden (Data, URL, nur https://)
SOCIAL_FELDER = ("linkedin", "instagram", "facebook", "youtube", "xing", "tiktok", "x")
URL_FELDER = ("website_url",) + SOCIAL_FELDER
DETAIL_ZUSATZ = (
	"bilder", "plz", "modul", "wechselrichter", "speicher", "ertrag", "latitude", "longitude",
	*SOCIAL_FELDER, "portraet", "portraet_quellen", "zitat", "zitat_person", "logo_url",
)

# Felder, die projekte.py aus der Datenbank liest
DB_FELDER_LISTE = (
	"name", "projekt_name", "projekt_website_name", "veroeffentlicht", "leistung", "leistung_label", "jahr",
	"ort", "plz", "land", "objekt", "dach", "bild", "bild_alt", "modified", "website_url", "branche",
)
DB_FELDER_DETAIL = DB_FELDER_LISTE + (
	"modul", "wechselrichter", "speicher", "ertrag", "latitude", "longitude",
	*SOCIAL_FELDER, "portraet", "portraet_quellen", "zitat", "zitat_person", "freigabe_zitat", "freigabe_logo", "logo",
)
DB_FELDER_KARTE = ("projekt_name", "projekt_website_name", "veroeffentlicht", "leistung", "leistung_label", "ort", "plz", "land", "latitude", "longitude")

OBJEKTE = ("Gewerbe", "Landwirtschaft", "Einfamilienhaus")


def veroeffentlicht(row):
	return ja((row or {}).get("veroeffentlicht") or 0)


_HTTPS_URL = re.compile(r"^https://[^\s/?#<>\"'`]+\.[^\s/?#<>\"'`]+(?:[/?#][^\s<>\"'`]*)?$", re.IGNORECASE)


def https_url(wert):
	"""Nur vollständige https://-Adressen (ohne Leerzeichen/HTML-Zeichen), sonst „“."""
	text = sauber(wert, 500)
	return text if _HTTPS_URL.match(text) else ""


def quellen_liste(wert):
	"""Small Text mit einer URL pro Zeile -> Liste gültiger https://-Adressen (ohne Duplikate)."""
	liste = []
	for zeile in str(wert or "").replace("\r", "\n").split("\n"):
		url = https_url(zeile)
		if url and url not in liste:
			liste.append(url)
	return liste


def projekt_url_fehler(row):
	"""Validierung für den Projekt-Controller: deutsche Meldung oder None."""
	for feld in URL_FELDER:
		wert = sauber(row.get(feld), 1000)
		if wert and not https_url(wert):
			return f"„{feld}“ muss eine vollständige Adresse sein, die mit https:// beginnt (z. B. https://www.beispiel.at)."
	for nr, zeile in enumerate(str(row.get("portraet_quellen") or "").replace("\r", "\n").split("\n"), start=1):
		if zeile.strip() and not https_url(zeile):
			return f"Porträt-Quellen, Zeile {nr}: bitte genau eine Adresse pro Zeile, beginnend mit https://."
	return None


def projekt_eintrag(row, url_fn):
	"""Ein Eintrag von get_projekte (Spezifikation Abschnitt 2, #1)."""
	leistung = positiv(row.get("leistung"))
	objekt = sauber(row.get("objekt"), 40)
	return {
		"projekt_name": sauber(row.get("projekt_name"), 140),
		"projekt_website_name": text_oder_none(row.get("projekt_website_name"), 140),
		"leistung": leistung,
		"leistung_label": sauber(row.get("leistung_label"), 40) or leistung_label(leistung) or None,
		"jahr": ganzzahl(row.get("jahr")),
		"ort": text_oder_none(row.get("ort"), 140),
		"land": text_oder_none(row.get("land"), 80),
		"objekt": objekt if objekt in OBJEKTE else None,
		"dach": text_oder_none(row.get("dach"), 140),
		"bild_url": absolute_url(row.get("bild"), url_fn),
		"bild_alt": text_oder_none(row.get("bild_alt"), 300),
		"modified": datum_text(row.get("modified")),
		"website_url": https_url(row.get("website_url")) or None,
		"branche": text_oder_none(row.get("branche"), 140),
	}


def projekt_detail(row, bilder, url_fn):
	"""Antwort von get_projekt (#2): Listeneintrag + Detailfelder.

	`bilder` = Zeilen der Tabelle „Projekt Bild“ ({bild, bild_alt, idx}). Das Titelbild steht
	als erstes Bild in `bilder[]`, damit die Galerie der Detailseite es nicht verliert."""
	eintrag = projekt_eintrag(row, url_fn)
	liste, gesehen = [], set()
	kandidaten = [{"bild": row.get("bild"), "bild_alt": row.get("bild_alt")}]
	kandidaten += sorted(bilder or [], key=lambda b: ganzzahl(b.get("idx")) or 0)
	for b in kandidaten:
		pfad = str(b.get("bild") or "").strip()
		url = absolute_url(pfad, url_fn)
		if not url or pfad in gesehen:
			continue
		gesehen.add(pfad)
		liste.append({"bild_url": url, "bild_alt": text_oder_none(b.get("bild_alt"), 300) or eintrag["bild_alt"]})
	eintrag.update({
		"bilder": liste,
		"plz": text_oder_none(row.get("plz"), 10),
		"modul": text_oder_none(row.get("modul"), 140),
		"wechselrichter": text_oder_none(row.get("wechselrichter"), 140),
		"speicher": text_oder_none(row.get("speicher"), 140),
		"ertrag": positiv(row.get("ertrag")),
		"latitude": koordinate(row.get("latitude"), 90),
		"longitude": koordinate(row.get("longitude"), 180),
	})
	# Kundenbühne – Zitat und Logo nur mit Freigabe des Kunden
	zitat_frei = ja(row.get("freigabe_zitat") or 0)
	logo_frei = ja(row.get("freigabe_logo") or 0)
	eintrag.update({f: https_url(row.get(f)) or None for f in SOCIAL_FELDER})
	eintrag.update({
		"portraet": sauber(row.get("portraet"), 5000, mehrzeilig=True) or None,
		"portraet_quellen": quellen_liste(row.get("portraet_quellen")),
		"zitat": (sauber(row.get("zitat"), 2000, mehrzeilig=True) or None) if zitat_frei else None,
		"zitat_person": text_oder_none(row.get("zitat_person"), 140) if zitat_frei else None,
		"logo_url": absolute_url(row.get("logo"), url_fn) if logo_frei else None,
	})
	return eintrag


def projekte_antwort(rows, url_fn):
	"""Antwort von get_projekte: {projekte, anzahl, summe_kwp} – nur veröffentlichte Projekte."""
	projekte = [projekt_eintrag(r, url_fn) for r in rows or [] if veroeffentlicht(r)]
	summe = sum(p["leistung"] or 0 for p in projekte)
	return {"projekte": projekte, "anzahl": len(projekte), "summe_kwp": round(summe, 2)}


FIRMENSITZ_STANDARD = {
	"name": "Ostermiething",
	"latitude": 48.0428,
	"longitude": 12.8417,
	"beschreibung": "Planung, Montage & Service",
}
UMKREIS_STANDARD = 100


def haversine_km(lat1, lon1, lat2, lon2):
	"""Luftlinie in km (Erdradius 6371 km)."""
	r = 6371.0
	p1, p2 = math.radians(lat1), math.radians(lat2)
	dp = math.radians(lat2 - lat1)
	dl = math.radians(lon2 - lon1)
	a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
	return 2 * r * math.asin(min(1.0, math.sqrt(a)))


def ort_schluessel(ort):
	return re.sub(r"\s+", " ", str(ort or "")).strip().casefold()


def ort_passt(ort, name):
	"""Wie ortPasst() der Website: „Ostermiething 2“ passt zu „Ostermiething“."""
	p, n = ort_schluessel(ort), ort_schluessel(name)
	return bool(p) and bool(n) and (p == n or p.startswith(n + " ") or p.startswith(n + ","))


def referenzkarte_antwort(rows, einstellungen):
	"""Antwort von get_referenzkarte (#3).

	Veröffentlichte Projekte nach `ort` gruppiert, Entfernung per Haversine zum Firmensitz.
	Projekte am Firmensitz selbst zeigt die Website am Firmensitz-Marker – sie stehen
	deshalb nicht in `orte` (sonst doppelter Marker)."""
	e = einstellungen or {}
	lat, lon = koordinate(e.get("latitude"), 90), koordinate(e.get("longitude"), 180)
	if lat is None or lon is None:
		lat, lon = FIRMENSITZ_STANDARD["latitude"], FIRMENSITZ_STANDARD["longitude"]
	firmensitz = {
		"name": sauber(e.get("firmensitz_name"), 140) or FIRMENSITZ_STANDARD["name"],
		"latitude": lat,
		"longitude": lon,
		"beschreibung": sauber(e.get("beschreibung"), 300) or FIRMENSITZ_STANDARD["beschreibung"],
	}
	umkreis = positiv(e.get("umkreis_km")) or UMKREIS_STANDARD
	umkreis = int(umkreis) if float(umkreis).is_integer() else round(umkreis, 1)

	gruppen = {}
	for r in rows or []:
		if not veroeffentlicht(r):
			continue
		ort = sauber(r.get("ort"), 140)
		if not ort or ort_passt(ort, firmensitz["name"]):
			continue
		g = gruppen.setdefault(ort_schluessel(ort), {"ort": ort, "plz": None, "land": None, "lat": [], "lon": [], "projekte": []})
		g["plz"] = g["plz"] or text_oder_none(r.get("plz"), 10)
		g["land"] = g["land"] or text_oder_none(r.get("land"), 80)
		p_lat, p_lon = koordinate(r.get("latitude"), 90), koordinate(r.get("longitude"), 180)
		if p_lat is not None and p_lon is not None:
			g["lat"].append(p_lat)
			g["lon"].append(p_lon)
		g["projekte"].append({
			"projekt_name": sauber(r.get("projekt_name"), 140),
			"projekt_website_name": text_oder_none(r.get("projekt_website_name"), 140),
			"leistung_label": sauber(r.get("leistung_label"), 40) or leistung_label(r.get("leistung")) or None,
		})

	orte = []
	for g in gruppen.values():
		o_lat = round(sum(g["lat"]) / len(g["lat"]), 6) if g["lat"] else None
		o_lon = round(sum(g["lon"]) / len(g["lon"]), 6) if g["lon"] else None
		km = round(haversine_km(lat, lon, o_lat, o_lon), 1) if o_lat is not None else None
		orte.append({
			"ort": g["ort"],
			"plz": g["plz"],
			"latitude": o_lat,
			"longitude": o_lon,
			"land": g["land"],
			"entfernung_km": km,
			"im_umkreis": km is not None and km <= umkreis,
			"anzahl_projekte": len(g["projekte"]),
			"projekte": g["projekte"],
		})
	orte.sort(key=lambda o: (o["entfernung_km"] is None, o["entfernung_km"] or 0, o["ort"].casefold()))
	return {
		"firmensitz": firmensitz,
		"orte": orte,
		"umkreis_km": umkreis,
		"anzahl_im_umkreis": sum(1 for o in orte if o["im_umkreis"]),
	}


# ================================================================ Herkunft (Kampagnen-Zeile)

_HERKUNFT = re.compile(r"^\s*\[Herkunft\]\s*(.*)$")
_TRENNER = {"—", "–", "-", "--", "---"}
HERKUNFT_KANAELE = ("Anzeige", "Social Media", "E-Mail", "Offline/QR", "Kampagne", "Suchmaschine", "KI-Assistent", "Verweis", "Direkt")
_HERKUNFT_SCHLUESSEL = {
	"Kanal": ("herkunft_kanal", 40),
	"Quelle": ("utm_source", 100),
	"Medium": ("utm_medium", 100),
	"Kampagne": ("utm_campaign", 100),
	"Keyword": ("utm_term", 100),
	"Verweis": ("herkunft_referrer", 120),
	"Einstieg": ("einstiegsseite", 200),
}
HERKUNFT_FELDER = tuple(f for f, _m in _HERKUNFT_SCHLUESSEL.values())


def herkunft_trennen(nachricht):
	"""Trennt die interne Zeile „[Herkunft] …“ (von der Website angehängt) von der Nachricht.

	-> (nachricht_ohne_herkunft, herkunft_text). Die Trennlinie „—“ davor fällt mit weg.
	Der Datensatz behält die Originalnachricht; die Kunden-Mail bekommt nur den ersten Teil."""
	behalten, herkunft = [], []
	for zeile in str(nachricht or "").replace("\r\n", "\n").split("\n"):
		m = _HERKUNFT.match(zeile)
		if not m:
			behalten.append(zeile)
			continue
		herkunft.append(m.group(1).strip())
		while behalten and not behalten[-1].strip():
			behalten.pop()
		if behalten and behalten[-1].strip() in _TRENNER:
			behalten.pop()
		while behalten and not behalten[-1].strip():
			behalten.pop()
	return "\n".join(behalten).strip(), " | ".join(h for h in herkunft if h)


def herkunft_felder(herkunft):
	"""„Kanal: Anzeige · Quelle: google · Einstieg: /x“ -> Felder wie im Rueckruf-DocType."""
	felder = {f: "" for f in HERKUNFT_FELDER}
	for teil in str(herkunft or "").split("·"):
		name, _sep, wert = teil.partition(":")
		ziel = _HERKUNFT_SCHLUESSEL.get(name.strip())
		if not ziel or felder[ziel[0]]:
			continue
		feld, maximal = ziel
		wert = sauber(wert.split("|")[0], maximal)
		if feld == "herkunft_kanal" and wert not in HERKUNFT_KANAELE:
			wert = ""
		if feld == "einstiegsseite" and not _PFAD.match(wert):
			wert = ""
		felder[feld] = wert
	return felder


# ================================================================ Eingabeprüfung

# wie frappe.utils.validate_email_address – sonst käme eine englische Frappe-Meldung
_EMAIL = re.compile(
	r"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*"
	r"@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
)
MAX_NACHRICHT = 8000        # sichtbarer Text laut Spezifikation
MAX_NACHRICHT_GESAMT = 10000  # inkl. angehängter Herkunftszeile


def email_gueltig(wert):
	return len(wert) <= 190 and bool(_EMAIL.match(wert)) and "." in wert.rsplit("@", 1)[-1]


def telefon_gueltig(wert):
	ziffern = re.sub(r"\D", "", wert)
	return len(wert) <= 40 and 6 <= len(ziffern) <= 20


def plz_gueltig(wert):
	return bool(re.fullmatch(r"\d{4,5}", wert or ""))


def _pflicht(d, feld, maximal, leer, zu_lang):
	wert = sauber(d.get(feld), maximal + 1)
	if not wert:
		raise EingabeFehler(leer)
	if len(wert) > maximal:
		raise EingabeFehler(zu_lang)
	return wert


def _optional(d, feld, maximal, zu_lang):
	wert = sauber(d.get(feld), maximal + 1)
	if len(wert) > maximal:
		raise EingabeFehler(zu_lang)
	return wert


def _name_email_telefon(d):
	vorname = _pflicht(d, "vorname", 80, "Bitte geben Sie Ihren Vornamen an.", "Der Vorname ist zu lang (max. 80 Zeichen).")
	nachname = _pflicht(d, "nachname", 80, "Bitte geben Sie Ihren Nachnamen an.", "Der Nachname ist zu lang (max. 80 Zeichen).")
	return (vorname, nachname, _email(d), _telefon(d))


def _email(d):
	email = sauber(d.get("email"), 200).lower()
	if not email:
		raise EingabeFehler("Bitte geben Sie Ihre E-Mail-Adresse an.")
	if not email_gueltig(email):
		raise EingabeFehler("Bitte geben Sie eine gültige E-Mail-Adresse an.")
	return email


def _telefon(d):
	telefon = sauber(d.get("telefon"), 60)
	if not telefon:
		raise EingabeFehler("Bitte geben Sie eine Telefonnummer für Rückfragen an.")
	if not telefon_gueltig(telefon):
		raise EingabeFehler("Bitte prüfen Sie die Telefonnummer.")
	return telefon


def _plz(d, pflicht):
	plz = sauber(d.get("plz"), 20).replace(" ", "")
	if not plz and not pflicht:
		return ""
	if not plz:
		raise EingabeFehler("Bitte geben Sie Ihre Postleitzahl an.")
	if not plz_gueltig(plz):
		raise EingabeFehler("Bitte geben Sie eine gültige Postleitzahl an (4 oder 5 Ziffern).")
	return plz


def _einwilligung(d):
	if not ja(d.get("einwilligung")):
		raise EingabeFehler("Bitte bestätigen Sie die Datenschutzhinweise.")
	return 1


def _nachricht(wert):
	"""Nachricht prüfen -> (nachricht, herkunft_text). Herkunftszeile zählt nicht zur Längengrenze."""
	nachricht = sauber(wert, MAX_NACHRICHT_GESAMT * 3, mehrzeilig=True)
	sichtbar, herkunft = herkunft_trennen(nachricht)
	if len(sichtbar) > MAX_NACHRICHT:
		raise EingabeFehler("Ihre Nachricht ist zu lang (max. 8.000 Zeichen).")
	return nachricht[:MAX_NACHRICHT_GESAMT], herkunft


def _herkunft(herkunft):
	return {"herkunft": sauber(herkunft, 1000), **herkunft_felder(herkunft)}


def pruefe_kontakt(d):
	"""submit_kontakt (#4) -> Felder für DocType „Kontaktanfrage“.

	PLZ und Straße dürfen leer sein (Award, Sponsoring); ist die PLZ gesetzt, 4–5 Ziffern."""
	d = d or {}
	vorname, nachname, email, telefon = _name_email_telefon(d)
	nachricht, herkunft = _nachricht(d.get("nachricht"))
	return {
		"thema": sauber(d.get("thema"), 140),
		"vorname": vorname,
		"nachname": nachname,
		"email": email,
		"telefon": telefon,
		"strasse_hausnummer": _optional(d, "strasse_hausnummer", 140, "Die Straße ist zu lang (max. 140 Zeichen)."),
		"plz": _plz(d, pflicht=False),
		"ort": _optional(d, "ort", 100, "Der Ort ist zu lang (max. 100 Zeichen)."),
		"nachricht": nachricht,
		"einwilligung": _einwilligung(d),
		"quelle": seitenpfad(d.get("quelle")),
		**_herkunft(herkunft),
	}


VORHABEN = {
	"pv": "Photovoltaik-Anlage",
	"freiflaeche": "Freiflächen- / Agri-PV",
	"speicher": "Stromspeicher",
	"wallbox": "Ladeinfrastruktur",
	"waermepumpe": "Wärmepumpe",
	"notstrom": "Notstrom",
	"service": "Wartung & Prüfung",
}
ERGEBNIS_ZAHLEN = (
	"berechnungsbasis_kwh", "anlagengroesse_kwp", "speicher_kwh", "jahresertrag_kwh", "autarkie_prozent",
	"vorteil_pro_jahr", "investition_von", "investition_bis", "amortisation_jahre",
)


def _als_objekt(wert, typ):
	"""JSON-Wert (bereits geparst oder als Text) -> list/dict, sonst leerer Wert."""
	if isinstance(wert, str) and wert.strip()[:1] in ("[", "{"):
		try:
			wert = json.loads(wert)
		except ValueError:
			return typ()
	if typ is list and isinstance(wert, str):
		return [t for t in (x.strip() for x in wert.split(",")) if t]
	return wert if isinstance(wert, typ) else typ()


def pruefe_angebot(d):
	"""submit_angebot (#5) -> Felder für DocType „Angebotsanfrage“."""
	d = d or {}
	vorhaben = []
	for v in _als_objekt(d.get("vorhaben"), list):
		v = sauber(v, 40).lower()
		if v in VORHABEN and v not in vorhaben:
			vorhaben.append(v)
	if not vorhaben:
		raise EingabeFehler("Bitte wählen Sie mindestens ein Vorhaben.")

	verbrauch = zahl(d.get("jahresverbrauch_kwh"))
	if verbrauch is not None and not 0 <= verbrauch <= 1_000_000_000:
		raise EingabeFehler("Bitte prüfen Sie den Jahresverbrauch.")

	vorname, nachname, email, telefon = _name_email_telefon(d)
	plz = _plz(d, pflicht=True)
	ort = _pflicht(d, "ort", 100, "Bitte geben Sie Ihren Ort an.", "Der Ort ist zu lang (max. 100 Zeichen).")
	einwilligung = _einwilligung(d)

	ergebnis_roh = _als_objekt(d.get("ergebnis"), dict)
	ergebnis = {k: zahl(ergebnis_roh.get(k)) for k in ERGEBNIS_ZAHLEN}
	angaben = sauber(ergebnis_roh.get("angaben"), MAX_NACHRICHT_GESAMT, mehrzeilig=True)
	nachricht, herkunft = _nachricht(d.get("nachricht") or angaben)
	if not herkunft:
		herkunft = herkunft_trennen(angaben)[1]

	return {
		"vorhaben": json.dumps(vorhaben),
		"gebaeudetyp": sauber(d.get("gebaeudetyp"), 140),
		"eigentuemer": sauber(d.get("eigentuemer"), 140),
		"dachform": sauber(d.get("dachform"), 140),
		"dachausrichtung": sauber(d.get("dachausrichtung"), 140),
		"startzeitpunkt": sauber(d.get("startzeitpunkt"), 140),
		"jahresverbrauch_kwh": verbrauch,
		"vorname": vorname,
		"nachname": nachname,
		"email": email,
		"telefon": telefon,
		"plz": plz,
		"ort": ort,
		"einwilligung": einwilligung,
		**ergebnis,
		"ergebnis_angaben": angaben,
		"ergebnis_json": json.dumps({**ergebnis, "angaben": angaben}, ensure_ascii=False, indent=1),
		"nachricht": nachricht,
		**_herkunft(herkunft),
	}


def pruefe_solarrechner(d):
	"""submit_solarrechner (#8), Formularfelder -> Felder für DocType „Solarrechner Anfrage“."""
	d = d or {}
	name = _pflicht(d, "kunden_name", 120, "Bitte geben Sie Ihren Namen an.", "Der Name ist zu lang (max. 120 Zeichen).")
	if len(name) < 2:
		raise EingabeFehler("Bitte geben Sie Ihren Namen an.")
	return {
		"kunden_name": name,
		"email": _email(d),
		"telefon": _telefon(d),
		"plz": _plz(d, pflicht=True),
		"quelle": seitenpfad(d.get("quelle")),
	}


PDF_MAX_BYTES = 10 * 1024 * 1024
_ANALYSE_REFERENZ = re.compile(r"PVA-\d{4}-[A-Z0-9]{6}")


def pruefe_pdf(dateiname, mimetype, inhalt):
	"""PDF aus dem Upload prüfen -> sicherer Dateiname."""
	if not inhalt:
		raise EingabeFehler("Die PDF-Datei fehlt.")
	if len(inhalt) > PDF_MAX_BYTES:
		raise EingabeFehler("Die PDF-Datei ist zu groß (max. 10 MB).")
	if str(mimetype or "").split(";")[0].strip().lower() != "application/pdf":
		raise EingabeFehler("Es sind nur PDF-Dateien erlaubt.")
	if not bytes(inhalt[:5]) == b"%PDF-":
		raise EingabeFehler("Die Datei ist kein gültiges PDF.")
	name = os.path.basename(str(dateiname or "").replace("\\", "/"))
	name = re.sub(r"[^A-Za-z0-9._-]", "-", name).strip(".-")[:120]
	if not name.lower().endswith(".pdf"):
		name = (name or "PV-Analyse") + ".pdf"
	return name


def analyse_referenz(dateiname):
	"""„Oekovolt-PV-Analyse-PVA-2026-3F9A1C.pdf“ -> „PVA-2026-3F9A1C“."""
	m = _ANALYSE_REFERENZ.search(str(dateiname or ""))
	return m.group(0) if m else ""


# ================================================================ Löschfrist (Datenschutz)

LOESCHFRIST_MONATE = 24  # überschreibbar per site_config „oekovolt_loeschfrist_monate“
# Anfragen mit diesem Status bleiben (laufende Kundenbeziehung, Aufbewahrung über Angebot/Auftrag)
BEHALTEN_STATUS = ("Angebot erstellt", "Gewonnen")
_ANONYM = "Anonymisiert"
# Je DocType: Felder -> Wert beim Anonymisieren. PLZ, Ort, Thema, Richtwerte und Kampagnen-Felder bleiben für die Statistik.
ANONYMISIEREN = {
	"Kontaktanfrage": {
		"vorname": "", "nachname": _ANONYM, "email": "", "telefon": "", "strasse_hausnummer": "",
		"nachricht": "", "notiz": "", "herkunft": "", "ip_adresse": "", "anonymisiert": 1,
	},
	"Angebotsanfrage": {
		"vorname": "", "nachname": _ANONYM, "email": "", "telefon": "", "nachricht": "", "ergebnis_angaben": "",
		"ergebnis_json": "", "notiz": "", "herkunft": "", "ip_adresse": "", "anonymisiert": 1,
	},
	"Solarrechner Anfrage": {
		"kunden_name": _ANONYM, "email": "", "telefon": "", "notiz": "", "ip_adresse": "", "pdf": "", "anonymisiert": 1,
	},
}


def loeschfrist_monate(wert):
	"""site_config-Wert -> ganze Monate (mind. 1), sonst Standard 24."""
	z = zahl(wert)
	return int(z) if z is not None and z >= 1 else LOESCHFRIST_MONATE


def loeschstichtag(heute, monate):
	"""Datum `monate` Monate vor `heute` (Monatsende wird begrenzt: 31.03. - 1 Monat = 28./29.02.)."""
	jahr, monat = divmod(heute.year * 12 + heute.month - 1 - monate, 12)
	monat += 1
	tage = [31, 29 if (jahr % 4 == 0 and (jahr % 100 != 0 or jahr % 400 == 0)) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	return date(jahr, monat, min(heute.day, tage[monat - 1]))


# ================================================================ E-Mails

FIRMA = {
	"name": "Ökovolt Solartechnik GmbH",
	"adresse": "Gewerbegebiet 10, 5121 Ostermiething",
	"telefon": "+43 6278 71030",
	"telefon_href": "tel:+43627871030",
	"email": "office@oekovolt.com",
	"website": "https://www.oekovolt.com",
}


def _e(wert):
	return html.escape(str(wert if wert is not None else ""))


def _mehrzeilig(wert):
	return _e(wert).replace("\n", "<br>")


def _tabelle(zeilen):
	"""[(Label, Wert)] -> HTML-Tabelle; leere Werte fallen weg. Werte werden escaped."""
	tr = "".join(
		f"<tr><td style='padding:4px 12px 4px 0;color:#555;vertical-align:top;white-space:nowrap'>{_e(label)}</td>"
		f"<td style='padding:4px 0;vertical-align:top'>{_mehrzeilig(wert)}</td></tr>"
		for label, wert in zeilen
		if wert not in (None, "")
	)
	return f"<table style='border-collapse:collapse;font-size:14px'>{tr}</table>"


def _kunden_rahmen(anrede, absaetze):
	"""Bestätigungs-Mail an Kunden. `absaetze` sind fertiges HTML (Werte bereits escaped)."""
	inhalt = "".join(f"<p>{a}</p>" for a in absaetze)
	return (
		"<div style='font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#03122b;max-width:640px'>"
		f"<p>{_e(anrede)}</p>{inhalt}"
		"<p>Freundliche Grüße<br>Ihr Ökovolt-Team</p>"
		"<hr style='border:none;border-top:1px solid #ddd;margin:24px 0 12px'>"
		f"<p style='font-size:12px;color:#666'>{_e(FIRMA['name'])} · {_e(FIRMA['adresse'])}<br>"
		f"Telefon <a href='{FIRMA['telefon_href']}'>{_e(FIRMA['telefon'])}</a> · "
		f"<a href='mailto:{FIRMA['email']}'>{_e(FIRMA['email'])}</a> · "
		f"<a href='{FIRMA['website']}'>www.oekovolt.com</a><br>"
		"Diese E-Mail wurde automatisch erstellt.</p></div>"
	)


def _team_rahmen(einleitung, zeilen, link):
	return (
		"<div style='font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5'>"
		f"<p>{_e(einleitung)}</p>{_tabelle(zeilen)}"
		f"<p><a href='{_e(link)}'>Im Backoffice öffnen</a></p></div>"
	)


def _kontakt_hinweis():
	return (
		f"Möchten Sie etwas ergänzen? Schreiben Sie uns an <a href='mailto:{FIRMA['email']}'>{_e(FIRMA['email'])}</a> "
		f"oder rufen Sie uns an: <a href='{FIRMA['telefon_href']}'>{_e(FIRMA['telefon'])}</a>."
	)


def _anrede(vorname, nachname):
	name = " ".join(t for t in (vorname, nachname) if t)
	return f"Guten Tag {name}," if name else "Guten Tag,"


def _adresse(daten):
	ort = " ".join(t for t in (daten.get("plz"), daten.get("ort")) if t)
	return ", ".join(t for t in (daten.get("strasse_hausnummer"), ort) if t)


def kunden_mail_kontakt(daten):
	"""Bestätigung an den Kunden – OHNE die interne Zeile „[Herkunft] …“."""
	nachricht = herkunft_trennen(daten.get("nachricht"))[0]
	angaben = _tabelle([
		("Thema", daten.get("thema")),
		("Name", f"{daten.get('vorname', '')} {daten.get('nachname', '')}".strip()),
		("E-Mail", daten.get("email")),
		("Telefon", daten.get("telefon")),
		("Adresse", _adresse(daten)),
		("Nachricht", nachricht),
	])
	html_text = _kunden_rahmen(_anrede(daten.get("vorname"), daten.get("nachname")), [
		"vielen Dank für Ihre Nachricht. Ihre Anfrage ist bei uns eingegangen – wir melden uns so rasch wie möglich bei Ihnen.",
		"Zur Kontrolle Ihre Angaben:<br>" + angaben,
		_kontakt_hinweis(),
	])
	return "Ihre Anfrage bei Ökovolt ist eingegangen", html_text


def team_mail_kontakt(daten, link):
	nachricht, herkunft = herkunft_trennen(daten.get("nachricht"))
	name = f"{daten.get('vorname', '')} {daten.get('nachname', '')}".strip()
	betreff = f"Kontaktanfrage: {daten.get('thema') or 'ohne Thema'} – {name}"
	return betreff, _team_rahmen("Neue Kontaktanfrage von der Website:", [
		("Thema", daten.get("thema") or "–"),
		("Name", name),
		("E-Mail", daten.get("email")),
		("Telefon", daten.get("telefon")),
		("Adresse", _adresse(daten)),
		("Nachricht", nachricht),
		("Seite", daten.get("quelle")),
		("Herkunft", herkunft),
	], link)


def _vorhaben_text(vorhaben_json):
	try:
		liste = json.loads(vorhaben_json or "[]")
	except ValueError:
		liste = []
	return ", ".join(VORHABEN.get(v, v) for v in liste if isinstance(v, str))


def _angebot_richtwerte(daten):
	von, bis = daten.get("investition_von"), daten.get("investition_bis")
	amort = daten.get("amortisation_jahre")
	return [
		("Anlagengröße", f"ca. {zahl_de(daten.get('anlagengroesse_kwp'), 1)} kWp" if daten.get("anlagengroesse_kwp") else ""),
		("Stromspeicher", f"ca. {zahl_de(daten.get('speicher_kwh'), 1)} kWh" if daten.get("speicher_kwh") else ""),
		("Jahresertrag", f"ca. {zahl_de(daten.get('jahresertrag_kwh'))} kWh" if daten.get("jahresertrag_kwh") else ""),
		("Eigenversorgung", f"ca. {zahl_de(daten.get('autarkie_prozent'))} %" if daten.get("autarkie_prozent") else ""),
		("Vorteil pro Jahr", f"ca. {zahl_de(daten.get('vorteil_pro_jahr'))} €" if daten.get("vorteil_pro_jahr") else ""),
		("Investition", f"ca. {zahl_de(von)} – {zahl_de(bis)} €" if von and bis else ""),
		("Amortisation", f"ca. {zahl_de(amort, 1)} Jahre" if amort else ""),
	]


def kunden_mail_angebot(daten):
	"""Bestätigung an den Kunden – OHNE die interne Zeile „[Herkunft] …“."""
	angaben = _tabelle([
		("Vorhaben", _vorhaben_text(daten.get("vorhaben"))),
		("Objekt", daten.get("gebaeudetyp")),
		("Jahresverbrauch", f"{zahl_de(daten.get('jahresverbrauch_kwh'))} kWh" if daten.get("jahresverbrauch_kwh") else ""),
		("Standort", " ".join(t for t in (daten.get("plz"), daten.get("ort")) if t)),
		("Telefon", daten.get("telefon")),
	])
	absaetze = [
		"vielen Dank für Ihre Angebotsanfrage. Wir prüfen Ihre Angaben und melden uns mit den nächsten Schritten bei Ihnen.",
		"Ihre Angaben:<br>" + angaben,
	]
	richtwerte = [(l, w) for l, w in _angebot_richtwerte(daten) if w]
	if richtwerte:
		absaetze.append(
			"Ihre Ersteinschätzung aus dem Online-Konfigurator:<br>" + _tabelle(richtwerte)
			+ "<br><span style='font-size:13px;color:#555'>Unverbindliche Richtwerte. Das verbindliche Angebot erstellen wir "
			"nach Prüfung von Dach, Verbrauch und Netzanschluss.</span>"
		)
	absaetze.append(_kontakt_hinweis())
	return "Ihre Angebotsanfrage bei Ökovolt", _kunden_rahmen(_anrede(daten.get("vorname"), daten.get("nachname")), absaetze)


def team_mail_angebot(daten, link):
	nachricht, herkunft = herkunft_trennen(daten.get("nachricht"))
	name = f"{daten.get('vorname', '')} {daten.get('nachname', '')}".strip()
	vorhaben = _vorhaben_text(daten.get("vorhaben"))
	betreff = f"Angebotsanfrage: {vorhaben or 'Konfigurator'} – {name}, {daten.get('plz', '')} {daten.get('ort', '')}".strip()
	return betreff, _team_rahmen("Neue Angebotsanfrage aus dem Konfigurator:", [
		("Name", name),
		("E-Mail", daten.get("email")),
		("Telefon", daten.get("telefon")),
		("Standort", " ".join(t for t in (daten.get("plz"), daten.get("ort")) if t)),
		("Vorhaben", vorhaben),
		("Objekt", daten.get("gebaeudetyp")),
		("Eigentümer", daten.get("eigentuemer")),
		("Dachform", daten.get("dachform")),
		("Ausrichtung", daten.get("dachausrichtung")),
		("Start", daten.get("startzeitpunkt")),
		("Jahresverbrauch", f"{zahl_de(daten.get('jahresverbrauch_kwh'))} kWh" if daten.get("jahresverbrauch_kwh") else ""),
		*[(l, w) for l, w in _angebot_richtwerte(daten) if w],
		("Angaben", nachricht),
		("Herkunft", herkunft),
	], link)


def kunden_mail_solarrechner(daten):
	referenz = daten.get("analyse_referenz")
	absaetze = [
		"vielen Dank für Ihr Interesse. Im Anhang finden Sie Ihre persönliche PV-Analyse als PDF"
		+ (f" (Referenz {_e(referenz)})" if referenz else "") + ".",
		"Die Analyse ist eine erste Einschätzung auf Basis Ihrer Angaben. Gerne besprechen wir die Ergebnisse mit Ihnen – "
		f"<a href='{FIRMA['website']}/termin?utm_source=pdf-analyse&amp;utm_medium=email'>Beratungstermin online buchen</a>.",
		_kontakt_hinweis(),
	]
	return "Ihre PV-Analyse von Ökovolt", _kunden_rahmen(_anrede(daten.get("kunden_name"), ""), absaetze)


def team_mail_solarrechner(daten, link):
	betreff = f"PV-Analyse (Solarrechner): {daten.get('kunden_name', '')}, PLZ {daten.get('plz', '')}"
	return betreff, _team_rahmen("Neue PV-Analyse aus dem Solarrechner:", [
		("Referenz", daten.get("analyse_referenz")),
		("Name", daten.get("kunden_name")),
		("E-Mail", daten.get("email")),
		("Telefon", daten.get("telefon")),
		("PLZ", daten.get("plz")),
		("Seite", daten.get("quelle")),
	], link)
