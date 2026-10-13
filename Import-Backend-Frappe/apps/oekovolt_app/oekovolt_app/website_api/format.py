# Copyright (c) 2026, ÖKOVOLT
#
# Reine Funktionen OHNE Frappe-Import:
#   - Antwortformen der Projekt-API (get_projekte, get_projekt, get_referenzkarte)
#   - Eingabeprüfung der Formulare (Kontakt, Angebot, Solarrechner, Rechner Lead, Termin-Zusatzfelder)
#   - Vertrieb (Welle A11): Lead-Scoring, Bundesland aus PLZ, Lead-Schlüssel, E.164, Double-Opt-in-Token
#   - Texte der Benachrichtigungs- und Bestätigungs-E-Mails (Kundenmails ohne Freitext der Anfrage)
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


MAX_QUELLE = 255  # Website erlaubt 200 Zeichen; DocType-Feld „quelle“ ist Small Text


def seitenpfad(wert):
	"""Nur einen Seitenpfad wie „/kontakt“ zulassen (max. 255 Zeichen)."""
	text = sauber(wert, MAX_QUELLE)
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
	"""Gemeinsame Regel mit Website und Termin-Teil: nur Nummern, die sich nach E.164 normalisieren lassen."""
	return len(wert or "") <= 40 and telefon_e164(wert) is not None


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


def _name_email_telefon(d, telefon_pflicht=True):
	vorname = _pflicht(d, "vorname", 80, "Bitte geben Sie Ihren Vornamen an.", "Der Vorname ist zu lang (max. 80 Zeichen).")
	nachname = _pflicht(d, "nachname", 80, "Bitte geben Sie Ihren Nachnamen an.", "Der Nachname ist zu lang (max. 80 Zeichen).")
	return (vorname, nachname, _email(d), _telefon(d, telefon_pflicht))


def _email(d):
	email = sauber(d.get("email"), 200).lower()
	if not email:
		raise EingabeFehler("Bitte geben Sie Ihre E-Mail-Adresse an.")
	if not email_gueltig(email):
		raise EingabeFehler("Bitte geben Sie eine gültige E-Mail-Adresse an.")
	return email


def _telefon(d, pflicht=True):
	"""Telefon -> E.164 (gleiche Regeln wie die Website). Leer nur erlaubt, wenn nicht Pflicht."""
	telefon = sauber(d.get("telefon"), 60)
	if not telefon:
		if pflicht:
			raise EingabeFehler("Bitte geben Sie eine Telefonnummer für Rückfragen an.")
		return ""
	e164 = telefon_e164(telefon) if len(telefon) <= 40 else None
	if not e164:
		raise EingabeFehler("Bitte prüfen Sie die Telefonnummer.")
	return e164


def _rueckruf_gewuenscht(d):
	"""Kontakt/Angebot: Telefon ist optional – mit Rückrufwunsch (rueckruf_ok = 1) aber Pflicht."""
	return _flagge(d.get("rueckruf_ok")) == 1


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
	"""Häkchen „Datenschutzhinweise“ ODER angezeigter Hinweistext (einwilligung_id „…-info“, Art. 6 Abs. 1 lit. b)."""
	if not ja(d.get("einwilligung")) and not hinweis_angezeigt(d):
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

	PLZ und Straße dürfen leer sein (Award, Sponsoring); ist die PLZ gesetzt, 4–5 Ziffern.
	Telefon optional (mit rueckruf_ok Pflicht), gespeichert als E.164. Vertriebsfelder optional (pruefe_vertrieb)."""
	d = d or {}
	vorname, nachname, email, telefon = _name_email_telefon(d, telefon_pflicht=_rueckruf_gewuenscht(d))
	nachricht, herkunft = _nachricht(d.get("nachricht"))
	return {
		**pruefe_vertrieb(d),
		"jahresverbrauch": _eine(d.get("jahresverbrauch"), JAHRESVERBRAUCH_WERTE),
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


def vorbelegte_felder(wert):
	"""`vorbelegt` (Liste oder Komma-Text) -> Menge der Felder aus VORBELEGBAR, die der Kunde nicht angefasst hat."""
	return {f for f in (sauber(x, 40) for x in _als_objekt(wert, list)) if f in VORBELEGBAR}


def _bereich(wert, maximal):
	"""Zahl > 0 und <= maximal (auf 0,1 gerundet), sonst None."""
	z = positiv(wert)
	return round(z, 1) if z is not None and z <= maximal else None


def pruefe_angebot(d):
	"""submit_angebot (#5) -> Felder für DocType „Angebotsanfrage“.

	Telefon optional (mit rueckruf_ok Pflicht), E.164. Strukturierte Konfigurator-Felder (objekt, netzebene, lastgang,
	flaeche_m2, kwp_wunsch, zeitplan, rolle, gremium, zweck, thema, bezug) nur nach Whitelist – alle optional."""
	d = d or {}
	vorhaben = []
	for v in _als_objekt(d.get("vorhaben"), list):
		v = sauber(v, 40).lower()
		if v in VORHABEN and v not in vorhaben:
			vorhaben.append(v)
	if not vorhaben:
		raise EingabeFehler("Bitte wählen Sie mindestens ein Vorhaben.")

	vorbelegt = vorbelegte_felder(d.get("vorbelegt"))
	if vorbelegt:
		# Vom Kunden nicht gewählte Startwerte nicht als Angabe übernehmen (verzerren sonst das Scoring)
		d = {k: v for k, v in d.items() if k not in vorbelegt}
	verbrauch = zahl(d.get("jahresverbrauch_kwh"))
	if verbrauch is not None and not 0 <= verbrauch <= 1_000_000_000:
		raise EingabeFehler("Bitte prüfen Sie den Jahresverbrauch.")

	vorname, nachname, email, telefon = _name_email_telefon(d, telefon_pflicht=_rueckruf_gewuenscht(d))
	plz = _plz(d, pflicht=True)
	ort = _pflicht(d, "ort", 100, "Bitte geben Sie Ihren Ort an.", "Der Ort ist zu lang (max. 100 Zeichen).")
	einwilligung = _einwilligung(d)

	ergebnis_roh = _als_objekt(d.get("ergebnis"), dict)
	ergebnis = {k: zahl(ergebnis_roh.get(k)) for k in ERGEBNIS_ZAHLEN}
	angaben = sauber(ergebnis_roh.get("angaben"), MAX_NACHRICHT_GESAMT, mehrzeilig=True)
	nachricht, herkunft = _nachricht(d.get("nachricht") or angaben)
	if not herkunft:
		herkunft = herkunft_trennen(angaben)[1]

	vertrieb = pruefe_vertrieb(d)
	objekt = _eine(d.get("objekt"), OBJEKT_WERTE, 40)
	if not vertrieb["segment"] and objekt:
		vertrieb["segment"] = SEGMENT_SCHLUESSEL.get(objekt, "")
	if not vertrieb["zeitplan"]:
		vertrieb["zeitplan"] = _zeitplan({"startzeitpunkt": d.get("startzeitpunkt")})
	lastgang = _eine(d.get("lastgang"), LASTGANG_WERTE, 20)
	kennzahlen = lastgang_kennzahlen(d.get("lastgang_kennzahlen"))
	return {
		**vertrieb,
		"objekt": objekt,
		"netzebene": _eine(d.get("netzebene"), NETZEBENE_WERTE, 20),
		"lastgang_vorhanden": 1 if lastgang == "ja" or kennzahlen else 0,
		"lastgang_kennzahlen": kennzahlen,
		"flaeche_m2": _bereich(d.get("flaeche_m2"), 10_000_000),
		"kwp_wunsch": _bereich(d.get("kwp_wunsch"), 100_000),
		"zweck": _eine(d.get("zweck"), ZWECK_WERTE, 40),
		"thema": _eine(d.get("thema"), THEMA_WERTE, 40),
		"bezug": bezug_wert(d.get("bezug")),
		"quelle": seitenpfad(d.get("quelle")),
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
	"""submit_solarrechner (#8), Formularfelder -> Felder für DocType „Solarrechner Anfrage“.

	Optional: `herkunft` („[Herkunft] Kanal: … · Quelle: …“) und die Vertriebsfelder (firma, segment, …)."""
	d = d or {}
	name = _pflicht(d, "kunden_name", 120, "Bitte geben Sie Ihren Namen an.", "Der Name ist zu lang (max. 120 Zeichen).")
	if len(name) < 2:
		raise EingabeFehler("Bitte geben Sie Ihren Namen an.")
	herkunft = sauber(d.get("herkunft"), 1000)
	herkunft = herkunft_trennen(herkunft)[1] or herkunft
	return {
		"kunden_name": name,
		"email": _email(d),
		"telefon": _telefon(d),
		"plz": _plz(d, pflicht=True),
		"quelle": seitenpfad(d.get("quelle")),
		**pruefe_vertrieb(d),
		**_herkunft(herkunft),
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


# ================================================================ Vertrieb (Welle A11, Speed-to-Lead I)
#
# Kernschema „Vertrieb“ der fünf Lead-DocTypes (Kontaktanfrage, Angebotsanfrage, Rechner Lead,
# Solarrechner Anfrage, Website Termin), Lead-Scoring, Bundesland aus PLZ, Lead-Schlüssel und E.164.
# lead_eingang.py (A06) ruft lead_score/bundesland_aus_plz/lead_schluessel/telefon_e164 nach dem Anlegen auf.
# Alle Vertriebsfelder sind optional: Fehlen sie im Website-Body, bleibt alles wie bisher.

SEGMENTE = (
	"Gewerbe & Industrie", "Landwirtschaft", "Freifläche/Agri-PV", "Hotellerie & Tourismus",
	"Gemeinde & öffentliche Hand", "Chalet & Premium", "Privat", "Service", "Partner", "Bewerbung", "Presse", "Sonstiges",
)
SEGMENTE_B2B = ("Gewerbe & Industrie", "Landwirtschaft", "Freifläche/Agri-PV", "Hotellerie & Tourismus", "Gemeinde & öffentliche Hand")
# eigene Spuren (A06: Rollen Service, Personal, Marketing) – kein Vertriebs-Scoring
SEGMENTE_EIGENE_SPUR = ("Service", "Bewerbung", "Presse")
# Schlüssel der Website (src/data/leadRechner.js SEGMENTE, objekt im Konfigurator) -> Auswahlwert im Backoffice
SEGMENT_SCHLUESSEL = {
	"gewerbe": "Gewerbe & Industrie",
	"industrie": "Gewerbe & Industrie",
	"landwirtschaft": "Landwirtschaft",
	"freiflaeche": "Freifläche/Agri-PV",
	"agri": "Freifläche/Agri-PV",
	"hotellerie": "Hotellerie & Tourismus",
	"gemeinde": "Gemeinde & öffentliche Hand",
	"chalet": "Chalet & Premium",
	"privat": "Privat",
	"service": "Service",
	"partner": "Partner",
	"sonstiges": "Sonstiges",
}
LEAD_KLASSEN = ("A", "B", "C")
VERLUSTGRUENDE = (
	"Preis", "Mitbewerber", "Netzzusage/Netzebene", "Kein Budget/verschoben", "Nicht erreichbar",
	"Dach/Fläche ungeeignet", "Kein Bedarf", "Sonstiges",
)
# Status-Pipeline der Anfragen; „In Bearbeitung“ bleibt als Altwert gültig (bestehende Datensätze)
STATUS_PIPELINE = (
	"Neu", "Kontaktversuch", "Qualifiziert", "Termin vereinbart", "Angebot erstellt", "Verhandlung",
	"Gewonnen", "Verloren", "Erledigt", "Spam",
)
STATUS_ALT = ("In Bearbeitung",)
BUNDESLAENDER = (
	"Burgenland", "Kärnten", "Niederösterreich", "Oberösterreich", "Salzburg", "Steiermark", "Tirol", "Vorarlberg", "Wien",
)
# gleiche Werte wie die Website (src/lib/api/contact/create_contact.js, src/lib/api/anfrage/create_anfrage.js)
ZEITPLAN_WERTE = ("So bald wie möglich", "In den nächsten 3 Monaten", "In 3–12 Monaten", "Später / Budgetplanung")
JAHRESVERBRAUCH_WERTE = ("unter 100 MWh", "100–500 MWh", "500–2.000 MWh", "über 2.000 MWh", "weiß nicht")
ROLLEN = ("Geschäftsführung/Inhaber", "Finanzen", "Technik/Facility", "Einkauf", "Gemeinde/Verwaltung", "Landwirt/Eigentümer", "Sonstiges")
GREMIEN = ("Geschäftsführung", "Finanzen", "Technik", "Eigentümer/Vermieter", "Hausbank", "Gemeinderat")
# „Für wen ist der Bericht?“ (Lead-Gate, A09)
MAPPE_ROLLEN = ("Geschäftsführung", "Finanzen/CFO", "Technik/Facility", "Bank", "ESG/Betriebsrat", "Gemeinderat")
# Kennungen, die die Website sendet (src/data/argumentarien.js MAPPE_ROLLEN[].id) -> Anzeigename
MAPPE_ROLLEN_KENNUNGEN = {
	"gf": "Geschäftsführung", "cfo": "Finanzen/CFO", "technik": "Technik/Facility",
	"bank": "Bank", "esg": "ESG/Betriebsrat", "gemeinderat": "Gemeinderat",
}
# Konfigurator-Felder, die mit Startwerten vorbelegt sein können. Stehen sie in `vorbelegt` (vom Kunden nicht
# angefasst), zählen sie nicht im Lead-Scoring und werden nicht als Kundenangabe gespeichert.
VORBELEGBAR = ("zeitplan", "startzeitpunkt", "eigentuemer", "jahresverbrauch_kwh")
OBJEKT_WERTE = ("gewerbe", "landwirtschaft", "freiflaeche", "hotellerie", "gemeinde", "chalet", "privat", "sonstiges")
NETZEBENE_WERTE = ("7", "6", "5", "4", "unbekannt")
LASTGANG_WERTE = ("ja", "nein", "unbekannt")
THEMA_WERTE = (
	"netzanmeldung", "beschlussvorlage", "lastgang", "speicher", "ladeinfrastruktur", "notstrom", "repowering",
	"wartung", "foerderung", "finanzierung", "zweitmeinung",
)
ZWECK_WERTE = ("angebot", "beschlussvorlage", "zweitmeinung", "foerderung", "finanzierung", "netzanmeldung", "wartung", "ausschreibung")
_KENNUNG = re.compile(r"^[a-z0-9-]{2,40}$")
_VERSION = re.compile(r"^\d{1,4}$")
# Website-Referenz einer Anfrage („AK-20261011-7F3K“) oder Backoffice-Referenz („AA-2026-00042“)
_BEZUG = re.compile(r"^[A-Z]{1,3}-\d{4,8}-[A-Z0-9]{4,8}$")

# Gewichte des Lead-Scorings – die Vertriebsleitung passt NUR diese Konstante an (Teilsummen werden gekappt).
SCORE_GEWICHTE = {
	"fit_max": 50,
	"absicht_max": 35,
	"engagement_max": 15,
	"segment_b2b": 20,
	"segment": {"Chalet & Premium": 12, "Privat": 5},
	"verbrauch_mwh": ((500, 15), (100, 10), (30, 5)),  # (ab MWh, Punkte), absteigend
	"netzebene": {"5": 8, "6": 8},
	"eigentuemer": 5,
	"zeitplan": {"So bald wie möglich": 15, "In den nächsten 3 Monaten": 12, "In 3–12 Monaten": 6, "Später / Budgetplanung": 2},
	"lastgang": 5,
	"firma": 5,
	"quelle": {"termin": 10, "scan": 10, "konfigurator": 8, "pdf-analyse": 6, "rechner": 4, "kontakt": 4},
	"rolle_entscheider": 5,
	"rollen_entscheider": ("Geschäftsführung/Inhaber", "Finanzen"),
	"wiederkehr": 5,  # weitere Anfrage mit gleichem Schlüssel in 90 Tagen (A06 zählt: fruehere_anfragen_anzahl)
	"gewerbe_rechner": 5,
	"zielgruppen_einstieg": 5,
	"klasse_a": 70,
	"klasse_b": 45,
}
# Einstieg über eine Zielgruppenseite (Pfad oder Unterseite davon)
ZIELGRUPPEN_SEITEN = (
	"/gewerbe", "/industrie", "/landwirtschaft", "/agri-pv", "/freiflaechen-photovoltaik", "/hotellerie-tourismus",
	"/kommunen", "/chalets", "/energiegemeinschaften", "/gewerbespeicher", "/grossspeicher-epc", "/einspeisung-gewerbe",
	"/ladeinfrastruktur", "/solarcarport",
)

# Anzeigenamen der Werkzeuge (= src/data/leadRechner.js). Unbekannte, aber formal gültige Kennungen erscheinen
# in Mails als „Ihr Rechenergebnis“ – nie als Freitext aus der Anfrage.
RECHNER_NAMEN = {
	"gewerbe-pv": "Gewerbe-PV-Rechner",
	"peak-shaving": "Peak-Shaving-Rechner",
	"co2-esg": "CO₂- & ESG-Rechner",
	"energiegemeinschaft": "Energiegemeinschafts-Rechner",
	"e-flotte": "E-Flotte-Rechner",
	"blackout": "Blackout-Rechner",
	"ladeinfrastruktur": "Ladeinfrastruktur-Planer",
	"freiflaeche-pacht": "Freiflächen- & Pacht-Rechner",
	"agri-pv": "Agri-PV-Rechner",
	"finanzierung": "Finanzierungsvergleich",
	"investitionsantrag": "Investitionsantrag",
	"peer-to-peer": "Peer-to-Peer-Rechner",
	"fachplaner-paket": "Fachplaner-Paket Parkregler",
	"solarrechner": "Solarrechner",
	"stromspeicher": "Stromspeicher-Rechner",
	"standort-check": "Standort-Check",
	"foerdercheck": "Förder-Check",
	"gemeinderat-vorlage": "Amtsvortrag für den Gemeinderat",
	"liegenschafts-check": "Liegenschafts-Check",
	"lastgang-analyse": "Lastgang-Analyse",
	"lastgang-zwilling": "Energie-Zwilling (Lastgang 2.0)",
	"hallendach-planer": "Hallendach-Planer",
	"dossier": "Business-Case-Dossier",
	"anlagen-check": "Anlagen-Check",
	"angebot-pruefen": "Angebots-Zweitmeinung",
}
RECHNER_UNBEKANNT = "Ihr Rechenergebnis"
# Segment-Schlüssel je Kennung (wie leadRechner.js); unbekannt -> Segment bleibt leer (A06 leitet ab)
RECHNER_SEGMENT = {
	**{k: "gewerbe" for k in (
		"gewerbe-pv", "peak-shaving", "co2-esg", "energiegemeinschaft", "e-flotte", "blackout", "ladeinfrastruktur",
		"finanzierung", "investitionsantrag", "peer-to-peer", "fachplaner-paket", "lastgang-analyse", "lastgang-zwilling",
		"hallendach-planer", "dossier")},
	"freiflaeche-pacht": "landwirtschaft",
	"agri-pv": "landwirtschaft",
	"solarrechner": "privat",
	"stromspeicher": "privat",
	"gemeinderat-vorlage": "gemeinde",
	"liegenschafts-check": "gemeinde",
	"anlagen-check": "service",
}
# Werkzeuge, die als „Gewerbe-Rechner“ zählen (Engagement +5)
GEWERBE_RECHNER = tuple(k for k, s in RECHNER_SEGMENT.items() if s in ("gewerbe", "landwirtschaft", "gemeinde"))
GATE_AKTIONEN = ("pdf", "download", "export", "link", "auswertung", "senden", "druck", "mail")


def rechner_kennung(wert):
	"""Kennung nur im Format ^[a-z0-9-]{2,40}$, sonst „“."""
	text = sauber(wert, 41).lower()
	return text if _KENNUNG.match(text) else ""


def rechner_name(kennung):
	"""Anzeigename für Mails/Backoffice. Unbekannte Kennung -> „Ihr Rechenergebnis“ (nie Freitext)."""
	return RECHNER_NAMEN.get(rechner_kennung(kennung), RECHNER_UNBEKANNT)


def segment_wert(wert):
	"""Segment aus Auswahlwert („Gewerbe & Industrie“) oder Website-Schlüssel („gewerbe“); sonst „“."""
	text = sauber(wert, 60)
	if text in SEGMENTE:
		return text
	return SEGMENT_SCHLUESSEL.get(text.lower(), "")


def _eine(wert, erlaubt, maximal=80):
	text = sauber(wert, maximal)
	return text if text in erlaubt else ""


def _mehrere(wert, erlaubt, kennungen=None):
	"""Liste oder Komma-Text -> erlaubte Werte ohne Duplikate, als Zeilen-Text (Small Text).

	`kennungen` bildet Kurz-Kennungen der Website (z. B. „gf“) auf die erlaubten Anzeigenamen ab."""
	liste = wert if isinstance(wert, list) else _als_objekt(wert, list)
	gewaehlt = []
	for w in liste:
		w = sauber(w, 80)
		if kennungen and w.lower() in kennungen:
			w = kennungen[w.lower()]
		if w in erlaubt and w not in gewaehlt:
			gewaehlt.append(w)
	return "\n".join(gewaehlt)


def _flagge(wert):
	return 1 if wert is not None and ja(wert) else 0


def einwilligung_felder(d):
	"""einwilligung_id (Format wie Kennung) und Textversion -> {einwilligung_id, einwilligung_text_version}.

	Die Website sendet `einwilligung_version`; im DocType heißt das Feld `einwilligung_text_version`."""
	kennung = rechner_kennung((d or {}).get("einwilligung_id"))
	if not kennung:
		return {"einwilligung_id": "", "einwilligung_text_version": ""}
	version = sauber(d.get("einwilligung_version") or d.get("einwilligung_text_version"), 8)
	return {"einwilligung_id": kennung, "einwilligung_text_version": version if _VERSION.match(version) else ""}


def hinweis_angezeigt(d):
	"""Hinweistext (Art. 6 Abs. 1 lit. b DSGVO) statt Einwilligungs-Häkchen angezeigt? (Kennung „…-info“)."""
	return einwilligung_felder(d)["einwilligung_id"].endswith("-info")


def bezug_wert(wert):
	"""Referenz einer verknüpften Anfrage („AK-20261011-7F3K“, „AA-2026-00042“) oder „“."""
	text = sauber(wert, 24).upper()
	return text if _BEZUG.match(text) else ""


def pruefe_vertrieb(d):
	"""Gemeinsame, optionale Vertriebsfelder aus dem Website-Body (nur Whitelist-Werte, Längen begrenzt)."""
	d = d or {}
	return {
		"segment": segment_wert(d.get("segment")),
		"firma": sauber(d.get("firma"), 140),
		"rolle": _eine(d.get("rolle"), ROLLEN),
		"gremium": _mehrere(d.get("gremium"), GREMIEN),
		"zeitplan": _eine(d.get("zeitplan"), ZEITPLAN_WERTE),
		"rueckruf_ok": _flagge(d.get("rueckruf_ok")),
		"kontakt_ok": _flagge(d.get("kontakt_ok")),
		**einwilligung_felder(d),
	}


# ---------------------------------------------------------------- Telefon, Lead-Schlüssel

_INTERNATIONAL = re.compile(r"^\+[1-9]\d{7,14}$")


def telefon_e164(tel):
	"""Telefonnummer -> E.164 oder None.

	AT/DE/CH nach denselben Regeln wie Website und Termin-Teil (termin_logik.telefon_normalisieren, inkl.
	gesperrter Mehrwertnummern); andere Länder nur mit Ländervorwahl (+ oder 00) und 8–15 Ziffern.
	„------“, „123“ oder Buchstaben ergeben None."""
	from oekovolt_app.website_api.termin_logik import telefon_normalisieren

	roh = sauber(tel, 60)
	if not roh or re.search(r"[^\d\s+\-/().]", roh):
		return None
	e164 = telefon_normalisieren(roh)
	if e164:
		return e164
	t = re.sub(r"[\s\-/().]", "", roh.replace("(0)", ""))
	if t.startswith("00"):
		t = "+" + t[2:]
	if _INTERNATIONAL.match(t) and not t.startswith(("+43", "+49", "+41")):
		return t
	return None


def lead_schluessel(email):
	"""Lead-Schlüssel = E-Mail klein und getrimmt (bei Gmail ohne Punkte und „+…“); ungültig -> None.

	Erkennt dieselbe Person über mehrere Anfragen (Dubletten, Engagement); A06 vergleicht nur diesen Wert."""
	text = sauber(email, 200).lower()
	if not text or not email_gueltig(text):
		return None
	lokal, _at, domain = text.rpartition("@")
	if domain in ("gmail.com", "googlemail.com"):
		lokal = lokal.split("+", 1)[0].replace(".", "")
		domain = "gmail.com"
	return f"{lokal}@{domain}"


# ---------------------------------------------------------------- Bundesland aus PLZ

# Österreichische PLZ-Bereiche (von, bis, Bundesland), erste Übereinstimmung gilt: erst die Ausnahmen,
# dann die Grundbereiche. Die erste Ziffer allein reicht NICHT (5121 Ostermiething = Oberösterreich,
# 1300 Flughafen Wien = NÖ, 3335 Weyer = OÖ, 9900 Lienz = Tirol). Grenzfälle sind Richtwerte fürs Routing.
PLZ_BEREICHE = (
	# --- Ausnahmen
	(1300, 1300, "Niederösterreich"),  # Flughafen Wien-Schwechat
	(2413, 2413, "Burgenland"),
	(2421, 2425, "Burgenland"),        # Kittsee … Nickelsdorf
	(2443, 2443, "Burgenland"),        # Leithaprodersdorf
	(2473, 2475, "Burgenland"),        # Potzneusiedl, Gattendorf, Neudorf
	(2491, 2491, "Burgenland"),        # Neufeld an der Leitha
	(3334, 3335, "Oberösterreich"),    # Gaflenz, Weyer
	(4300, 4303, "Niederösterreich"),  # St. Valentin, St. Pantaleon-Erla
	(4392, 4392, "Niederösterreich"),
	(4431, 4432, "Niederösterreich"),
	(4441, 4441, "Niederösterreich"),
	(4482, 4482, "Niederösterreich"),  # Ennsdorf
	(5100, 5114, "Salzburg"),          # Bergheim … Göming
	(5151, 5165, "Salzburg"),          # Nußdorf … Berndorf
	(5200, 5205, "Salzburg"),          # Seekirchen … Schleedorf
	(5120, 5299, "Oberösterreich"),    # Innviertel: Ostermiething, Braunau, Mattighofen …
	(5310, 5311, "Oberösterreich"),    # Mondsee, Innerschwand
	(5360, 5360, "Oberösterreich"),    # St. Wolfgang im Salzkammergut
	(6691, 6691, "Tirol"),             # Jungholz
	(8293, 8293, "Burgenland"),        # Wörterberg
	(8380, 8385, "Burgenland"),        # Jennersdorf
	(9900, 9999, "Tirol"),             # Osttirol
	# --- Grundbereiche
	(1000, 1999, "Wien"),
	(2000, 3999, "Niederösterreich"),
	(4000, 4999, "Oberösterreich"),
	(5000, 5999, "Salzburg"),
	(6000, 6699, "Tirol"),
	(6700, 6999, "Vorarlberg"),
	(7000, 7999, "Burgenland"),
	(8000, 8999, "Steiermark"),
	(9000, 9899, "Kärnten"),
)


def bundesland_aus_plz(plz):
	"""4-stellige österreichische PLZ -> Bundesland; 5-stellig (DE) oder ungültig -> None."""
	text = sauber(plz, 10).replace(" ", "").upper()
	if text.startswith("A-"):
		text = text[2:]
	if not re.fullmatch(r"\d{4}", text):
		return None
	nummer = int(text)
	for von, bis, land in PLZ_BEREICHE:
		if von <= nummer <= bis:
			return land
	return None


# ---------------------------------------------------------------- Lead-Scoring

def _verbrauch_mwh(daten):
	"""Jahresverbrauch in MWh aus Zahl (kWh), Lastgang-Kennzahlen (JSON) oder Kontakt-Chip; unbekannt -> None."""
	kwh = positiv(daten.get("jahresverbrauch_kwh"))
	if kwh is None:
		kwh = positiv(_als_objekt(daten.get("lastgang_kennzahlen"), dict).get("jahresverbrauch_kwh"))
	if kwh is not None:
		return kwh / 1000
	chip = sauber(daten.get("jahresverbrauch"), 40)
	return {"100–500 MWh": 100, "500–2.000 MWh": 500, "über 2.000 MWh": 2000}.get(chip)


def _zeitplan(daten):
	"""Zeitplan aus dem Feld `zeitplan` oder dem Klartext `startzeitpunkt` (Konfigurator) -> Listenwert oder „“."""
	wert = sauber(daten.get("zeitplan"), 80)
	if wert in ZEITPLAN_WERTE:
		return wert
	text = sauber(daten.get("startzeitpunkt"), 140).lower()
	for z in ZEITPLAN_WERTE:
		if text == z.lower():
			return z
	if not text:
		return ""
	if "so bald" in text or "sofort" in text:
		return ZEITPLAN_WERTE[0]
	if re.search(r"3\s*[–-]\s*(6|12)", text):
		return ZEITPLAN_WERTE[2]
	if "3 monat" in text:
		return ZEITPLAN_WERTE[1]
	if "später" in text or "budget" in text:
		return ZEITPLAN_WERTE[3]
	return ""


def _ist_eigentuemer(daten):
	text = sauber(daten.get("eigentuemer"), 140).lower()
	if text and not text.startswith(("nein", "no")) and ("eigentümer" in text or text in ("ja", "yes", "1")):
		return True
	return sauber(daten.get("rolle"), 80) == "Landwirt/Eigentümer"


def _hat_lastgang(daten):
	if ja(daten.get("lastgang_vorhanden") or 0) or sauber(daten.get("lastgang"), 20).lower() == "ja":
		return True
	return bool(_als_objekt(daten.get("lastgang_kennzahlen"), dict))


def _zielgruppen_einstieg(daten):
	for feld in ("einstiegsseite", "quelle"):
		pfad = seitenpfad(daten.get(feld)).lower().rstrip("/")
		if pfad and any(pfad == s or pfad.startswith(s + "/") for s in ZIELGRUPPEN_SEITEN):
			return True
	return False


def lead_klasse(score):
	g = SCORE_GEWICHTE
	return "A" if score >= g["klasse_a"] else "B" if score >= g["klasse_b"] else "C"


def lead_score(daten, quelle):
	"""Lead-Bewertung -> (score 0–100, klasse „A“/„B“/„C“, gruende[]) nach SCORE_GEWICHTE.

	FIT (max. 50): Segment, Jahresverbrauch, Netzebene 5/6, Eigentümer.
	ABSICHT (max. 35): Zeitplan, Lastgang, Firma, Quelle (Termin/Scan, Konfigurator, PDF-Analyse, Rechner/Kontakt),
	Rolle Geschäftsführung/Finanzen.
	ENGAGEMENT (max. 15): weitere Anfrage in 90 Tagen (daten["fruehere_anfragen_anzahl"], von A06 gezählt),
	Gewerbe-Rechner, Einstieg über eine Zielgruppenseite.
	Klassen: A ≥ 70, B 45–69, C < 45. Service, Bewerbung und Presse laufen in einer eigenen Spur (0 Punkte, C).
	Reine Priorisierung im Vertrieb – keine automatisierte Entscheidung gegenüber der Person (Art. 22 DSGVO)."""
	daten = daten or {}
	vorbelegt = vorbelegte_felder(daten.get("vorbelegt"))
	if vorbelegt:
		# vorbelegte Startwerte sind keine Kundenangabe -> zählen weder als Fit noch als Absicht
		daten = {k: v for k, v in daten.items() if k not in vorbelegt}
	g = SCORE_GEWICHTE
	segment = segment_wert(daten.get("segment"))
	if segment in SEGMENTE_EIGENE_SPUR:
		return 0, "C", [f"Eigene Spur {segment} – kein Vertriebs-Scoring"]

	gruende = []

	def plus(teil, punkte, grund):
		if punkte:
			gruende.append(f"{grund} +{punkte}")
		return teil + punkte

	# FIT
	fit = 0
	if segment in SEGMENTE_B2B:
		fit = plus(fit, g["segment_b2b"], f"Segment {segment} (B2B)")
	elif segment in g["segment"]:
		fit = plus(fit, g["segment"][segment], f"Segment {segment}")
	mwh = _verbrauch_mwh(daten)
	if mwh is not None:
		for ab, punkte in g["verbrauch_mwh"]:
			if mwh >= ab:
				fit = plus(fit, punkte, f"Jahresverbrauch ab {zahl_de(ab)} MWh")
				break
	netzebene = sauber(daten.get("netzebene"), 20)
	fit = plus(fit, g["netzebene"].get(netzebene, 0), f"Netzebene {netzebene}")
	if _ist_eigentuemer(daten):
		fit = plus(fit, g["eigentuemer"], "Eigentümer")
	fit = min(fit, g["fit_max"])

	# ABSICHT
	absicht = 0
	zeitplan = _zeitplan(daten)
	absicht = plus(absicht, g["zeitplan"].get(zeitplan, 0), f"Zeitplan „{zeitplan}“")
	if _hat_lastgang(daten):
		absicht = plus(absicht, g["lastgang"], "Lastgang vorhanden")
	if sauber(daten.get("firma"), 140):
		absicht = plus(absicht, g["firma"], "Firma angegeben")
	q = sauber(quelle, 40).lower()
	if q == "rechner" and rechner_kennung(daten.get("rechner")).startswith("scan"):
		q = "scan"
	absicht = plus(absicht, g["quelle"].get(q, 0), f"Quelle {q}")
	rolle = sauber(daten.get("rolle"), 80)
	if rolle in g["rollen_entscheider"]:
		absicht = plus(absicht, g["rolle_entscheider"], f"Rolle {rolle}")
	absicht = min(absicht, g["absicht_max"])

	# ENGAGEMENT
	engagement = 0
	if (ganzzahl(daten.get("fruehere_anfragen_anzahl")) or 0) > 0:
		engagement = plus(engagement, g["wiederkehr"], "weitere Anfrage in 90 Tagen")
	if rechner_kennung(daten.get("rechner")) in GEWERBE_RECHNER:
		engagement = plus(engagement, g["gewerbe_rechner"], "Gewerbe-Rechner genutzt")
	if _zielgruppen_einstieg(daten):
		engagement = plus(engagement, g["zielgruppen_einstieg"], "Einstieg über Zielgruppenseite")
	engagement = min(engagement, g["engagement_max"])

	score = max(0, min(100, fit + absicht + engagement))
	gruende.append(f"Summe {score} (Fit {fit}, Absicht {absicht}, Engagement {engagement})")
	return score, lead_klasse(score), gruende


# ---------------------------------------------------------------- Anrede-Härtung (Kundenmails)

_ANREDE_ERLAUBT = re.compile(r"^[^\W\d_](?:[^\W\d_]|[ \-'’])*$")
_DOMAIN_HINWEIS = re.compile(r"(https?|www|://|@|\.[a-z]{2,})", re.IGNORECASE)
ANREDE_MAX = 60


def anrede_name(*teile):
	"""Name für die Anrede: nur Buchstaben, Leerzeichen, Bindestrich und Apostroph, höchstens 60 Zeichen,
	keine Domains oder Links. Sonst „“ – die Mail beginnt dann mit „Guten Tag,“."""
	name = re.sub(r"\s+", " ", " ".join(sauber(t, 200) for t in teile if t)).strip()
	if not name or len(name) > ANREDE_MAX or _DOMAIN_HINWEIS.search(name) or not _ANREDE_ERLAUBT.match(name):
		return ""
	return name


# ---------------------------------------------------------------- Double-Opt-in (Rechner Lead, #17–#19)

TOKEN_GUELTIG_STUNDEN = 24
UNBESTAETIGT_LOESCHEN_TAGE = 30
ERNEUT_SENDEN_AB_SEKUNDEN = 60
BESTAETIGUNG_MAX_MAILS = 5
BESTAETIGUNG_MODI = ("double-opt-in", "email")
_TOKEN = re.compile(r"^[A-Za-z0-9_-]{32,96}$")
TOKEN_MELDUNGEN = {
	"verwendet": "Dieser Bestätigungslink wurde bereits verwendet.",
	"abgelaufen": "Dieser Bestätigungslink ist abgelaufen (24 Stunden gültig). Bitte fordern Sie auf der Seite einen neuen Link an.",
	"ungueltig": "Dieser Bestätigungslink ist ungültig. Bitte fordern Sie auf der Seite einen neuen Link an.",
}


def token_erzeugen():
	"""-> (token für den Link, sha256-Hash für die Datenbank). Gespeichert wird nur der Hash."""
	import secrets

	token = secrets.token_urlsafe(32)
	return token, token_hash(token)


def token_hash(token):
	import hashlib

	return hashlib.sha256(str(token or "").encode("utf-8")).hexdigest()


# Signierter Token der Website (src/lib/leadGateServer.js tokenErzeugen: <base64url>.<HMAC hex>). Die Website
# erzeugt ihn, übergibt den Link an submit_rechner_lead und prüft die Signatur selbst; hier zählt nur der Hash.
_TOKEN_WEB = re.compile(r"^[A-Za-z0-9_-]{16,2000}\.[0-9a-f]{64}$")
TOKEN_MAX_LAENGE = 2400


def token_format_gueltig(token):
	text = str(token or "")
	return bool(_TOKEN.match(text) or _TOKEN_WEB.match(text))


def website_token_aus_link(link):
	"""Token aus dem von der Website mitgelieferten Bestätigungslink (…/freischalten?token=…) oder "".

	Nur das Token wird übernommen; der Link in der Mail wird immer mit oekovolt_website_url neu gebaut."""
	m = re.search(r"/freischalten\?token=([^&#\s]+)$", str(link or "")[:TOKEN_MAX_LAENGE + 200])
	if not m:
		return ""
	from urllib.parse import unquote

	token = unquote(m.group(1))
	return token if _TOKEN_WEB.match(token) else ""


def _als_datetime(wert):
	if isinstance(wert, datetime):
		return wert
	if isinstance(wert, str) and wert.strip():
		try:
			return datetime.fromisoformat(wert.strip()[:19])
		except ValueError:
			return None
	return None


def token_pruefen(lead, jetzt):
	"""Zustand eines Leads zum Bestätigungslink -> „ok“ | „verwendet“ | „abgelaufen“ | „ungueltig“.

	`lead` = dict mit bestaetigt, token_gueltig_bis; `jetzt` = naive Systemzeit (wie die Datetime-Felder)."""
	if not lead:
		return "ungueltig"
	if ja(lead.get("bestaetigt") or 0):
		return "verwendet"
	bis = _als_datetime(lead.get("token_gueltig_bis"))
	if bis is None:
		return "ungueltig"
	return "ok" if jetzt <= bis else "abgelaufen"


def erneut_senden_erlaubt(gesendet_am, jetzt, anzahl):
	"""„Erneut senden“ frühestens nach 60 s und höchstens BESTAETIGUNG_MAX_MAILS Mails je Lead."""
	if (ganzzahl(anzahl) or 0) >= BESTAETIGUNG_MAX_MAILS:
		return False
	gesendet = _als_datetime(gesendet_am)
	return gesendet is None or (jetzt - gesendet).total_seconds() >= ERNEUT_SENDEN_AB_SEKUNDEN


def website_basis(wert=None):
	"""Basis-URL der Website für Links in Kundenmails (site_config „oekovolt_website_url“, nur https://)."""
	url = https_url(wert)
	if not url or re.search(r"[?#]", url):
		return FIRMA["website"]
	return url.rstrip("/")


def bestaetigungs_link(token, basis=None):
	return f"{website_basis(basis)}/freischalten?token={token}"


def ergebnis_pfad(wert):
	"""Ergebnis-/Rückkehr-Link nur als Pfad auf der eigenen Website (z. B. „/rechner/gewerbe-pv?r=…“).

	Erlaubt: Pfad + Query aus sicheren Zeichen, max. 500 Zeichen. Absolute URLs, „//“, HTML-Zeichen -> „“."""
	text = sauber(wert, 501)
	if len(text) > 500 or not text.startswith("/") or text.startswith("//"):
		return ""
	return text if re.fullmatch(r"/[A-Za-z0-9\-._~/%?=&+,:;]*", text) else ""


# ---------------------------------------------------------------- Rechner Lead (#17)

LASTGANG_KENNZAHLEN = (
	"jahresverbrauch_kwh", "grundlast_kw", "spitzenlast_kw", "wochenendanteil_prozent", "deckungsgrad_prozent",
	"volllaststunden", "messintervall_min", "tage",
)
MAX_ERGEBNIS_TEXT = 4000
MAX_ERGEBNIS_JSON = 20000


def lastgang_kennzahlen(wert):
	"""Nur bekannte Kennzahlen (Zahlen) und bis zu 12 Monatsspitzen – nie Rohdaten. -> JSON-Text oder „“."""
	roh = _als_objekt(wert, dict)
	k = {f: zahl(roh.get(f)) for f in LASTGANG_KENNZAHLEN if zahl(roh.get(f)) is not None}
	spitzen = roh.get("monatsspitzen_kw")
	if isinstance(spitzen, list):
		werte = [zahl(s) for s in spitzen[:12]]
		if any(w is not None for w in werte):
			k["monatsspitzen_kw"] = werte
	return json.dumps(k, ensure_ascii=False) if k else ""


def _ergebnis_json(wert):
	"""Ergebnisobjekt des Rechners -> kompakter JSON-Text (max. 20.000 Zeichen) oder „“. Nur intern gespeichert."""
	obj = _als_objekt(wert, dict)
	if not obj:
		return ""
	text = json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
	if len(text) > MAX_ERGEBNIS_JSON:
		raise EingabeFehler("Das Rechenergebnis ist zu umfangreich.")
	return text


def pruefe_rechner_lead(d):
	"""submit_rechner_lead (#17) -> Felder für DocType „Rechner Lead“.

	Pflicht: kennung (Format ^[a-z0-9-]{2,40}$), Vorname, Nachname, E-Mail (Art. 6 Abs. 1 lit. b DSGVO).
	Telefon optional und nur mit kontakt_ok gespeichert (dann geprüft, E.164). Keine Pflicht-Einwilligung,
	kein Newsletter. `ergebnis` = Text (Zusammenfassung) oder Objekt; Objekte landen in `ergebnis_json`."""
	d = d or {}
	kennung = rechner_kennung(d.get("kennung") or d.get("rechner"))
	if not kennung:
		raise EingabeFehler("Unbekanntes Werkzeug.")
	vorname = _pflicht(d, "vorname", 80, "Bitte geben Sie Ihren Vornamen an.", "Der Vorname ist zu lang (max. 80 Zeichen).")
	nachname = _pflicht(d, "nachname", 80, "Bitte geben Sie Ihren Nachnamen an.", "Der Nachname ist zu lang (max. 80 Zeichen).")
	email = _email(d)
	vertrieb = pruefe_vertrieb(d)
	telefon = ""
	if vertrieb["kontakt_ok"] and sauber(d.get("telefon"), 60):
		telefon = telefon_e164(d.get("telefon")) or ""
		if not telefon:
			raise EingabeFehler("Bitte prüfen Sie die Telefonnummer oder lassen Sie das Feld leer.")

	roh = d.get("ergebnis")
	text = roh if isinstance(roh, str) and roh.strip()[:1] not in ("{", "[") else d.get("ergebnis_text")
	ergebnis = sauber(text, MAX_ERGEBNIS_TEXT + 1, mehrzeilig=True)
	if len(ergebnis) > MAX_ERGEBNIS_TEXT:
		raise EingabeFehler("Das Rechenergebnis ist zu lang.")
	objekt = roh if isinstance(roh, dict) or (isinstance(roh, str) and roh.strip()[:1] == "{") else d.get("ergebnis_json")

	herkunft = d.get("herkunft") if isinstance(d.get("herkunft"), str) else ""
	_rest, zeile = herkunft_trennen(herkunft)
	felder = {
		"rechner": kennung,
		"rechner_name": rechner_name(kennung),
		"aktion": _eine(d.get("aktion"), GATE_AKTIONEN, 20),
		"vorname": vorname,
		"nachname": nachname,
		"email": email,
		"telefon": telefon,
		"plz": _plz(d, pflicht=False),
		"mappe_rollen": _mehrere(d.get("mappe_rollen"), MAPPE_ROLLEN, MAPPE_ROLLEN_KENNUNGEN),
		"ergebnis": ergebnis,
		"ergebnis_json": _ergebnis_json(objekt),
		"ergebnis_link": ergebnis_pfad(d.get("ergebnis_link")),
		"rueckkehr": ergebnis_pfad(d.get("rueckkehr")),
		"jahresverbrauch_kwh": positiv(d.get("jahresverbrauch_kwh")),
		"lastgang_kennzahlen": lastgang_kennzahlen(d.get("lastgang_kennzahlen")),
		"bestaetigung_erforderlich": 1 if sauber(d.get("bestaetigung"), 20).lower() in BESTAETIGUNG_MODI else 0,
		"quelle": seitenpfad(d.get("quelle")),
		"utm_content": sauber(d.get("utm_content"), 100),
		**vertrieb,
		**_herkunft(zeile or herkunft),
	}
	if not felder["segment"]:
		felder["segment"] = SEGMENT_SCHLUESSEL.get(RECHNER_SEGMENT.get(kennung, ""), "")
	return felder


# ================================================================ Löschfrist (Datenschutz)

LOESCHFRIST_MONATE = 24  # überschreibbar per site_config „oekovolt_loeschfrist_monate“
# Anfragen mit diesem Status bleiben (laufende Kundenbeziehung, Aufbewahrung über Angebot/Auftrag)
BEHALTEN_STATUS = ("Termin vereinbart", "Angebot erstellt", "Verhandlung", "Gewonnen")
_ANONYM = "Anonymisiert"
# Vertriebsfelder mit Personenbezug (Welle A11) – in allen Lead-DocTypes geleert
_VERTRIEB_ANONYM = {"firma": "", "lead_schluessel": "", "gremium": "", "fruehere_anfragen": ""}
# Je DocType: Felder -> Wert beim Anonymisieren. PLZ, Ort, Thema, Richtwerte und Kampagnen-Felder bleiben für die Statistik.
ANONYMISIEREN = {
	"Kontaktanfrage": {
		"vorname": "", "nachname": _ANONYM, "email": "", "telefon": "", "strasse_hausnummer": "",
		"nachricht": "", "notiz": "", "herkunft": "", "ip_adresse": "", "anonymisiert": 1,
		**_VERTRIEB_ANONYM,
	},
	"Angebotsanfrage": {
		"vorname": "", "nachname": _ANONYM, "email": "", "telefon": "", "nachricht": "", "ergebnis_angaben": "",
		"ergebnis_json": "", "notiz": "", "herkunft": "", "ip_adresse": "", "anonymisiert": 1,
		**_VERTRIEB_ANONYM,
	},
	"Solarrechner Anfrage": {
		"kunden_name": _ANONYM, "email": "", "telefon": "", "notiz": "", "ip_adresse": "", "pdf": "", "anonymisiert": 1,
		"herkunft": "", **_VERTRIEB_ANONYM,
	},
	# Ergebnis und JSON enthalten Firmennamen (z. B. CO₂-Untertitel) – werden mit geleert
	"Rechner Lead": {
		"vorname": "", "nachname": _ANONYM, "email": "", "telefon": "", "notiz": "", "herkunft": "", "ip_adresse": "",
		"ergebnis": "", "ergebnis_json": "", "ergebnis_link": "", "rueckkehr": "", "mappe_rollen": "",
		"bestaetigungs_token": "", "anonymisiert": 1, **_VERTRIEB_ANONYM,
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
	"email": "office@oekovolt.at",
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


def _anrede(vorname, nachname=""):
	"""„Guten Tag Anna Huber,“ – nur mit gehärtetem Namen (anrede_name), sonst „Guten Tag,“."""
	name = anrede_name(vorname, nachname)
	return f"Guten Tag {name}," if name else "Guten Tag,"


# Kundenmails enthalten KEINE Freitexte aus der Anfrage (Nachricht, Thema-Freitext, Firma, Ort, Adresse):
# nur gehärtete Anrede, feste Texte, geprüfte Listenwerte und Zahlen. So lässt sich das Formular nicht
# als Spam-Verteiler missbrauchen. Die Team-Mails (intern) zeigen alles.

UNTERLAGEN_GEWERBE = (
	"Lastgang mit 15-Minuten-Werten aus dem Online-Portal Ihres Netzbetreibers (letzte 12 Monate)",
	"letzte Stromrechnung",
	"Zählpunktnummer (steht auf der Stromrechnung)",
	"Dachplan bzw. Statik der Halle (falls vorhanden)",
)
KONTAKT_THEMEN = (
	"Gewerbe & Industrie", "Freifläche & Agri-PV", "Landwirtschaft", "Gemeinde", "Speicher & Laden", "Energiegemeinschaft",
	"Service & Wartung", "Störung an bestehender Anlage", "Laufendes Projekt", "Rechnung/Buchhaltung", "Lieferant/Partner",
	"Presse", "Datenschutz-Anfrage", "Sonstiges", "Photovoltaik", "Stromspeicher",
)
_GEWERBE_THEMEN = ("Gewerbe & Industrie", "Freifläche & Agri-PV", "Landwirtschaft", "Gemeinde", "Speicher & Laden", "Energiegemeinschaft")
_REFERENZ = re.compile(r"^[A-Z]{1,3}-\d{4}-\d{5,6}$")


def _referenz(wert):
	"""Backoffice-Referenz („AA-2026-00042“, „T-2026-000123“) für den Betreff – sonst „“."""
	text = sauber(wert, 20)
	return text if _REFERENZ.match(text) else ""


def _ist_gewerbe(daten):
	segment = segment_wert(daten.get("segment"))
	if segment:
		return segment in SEGMENTE_B2B
	return sauber(daten.get("thema"), 140) in _GEWERBE_THEMEN or _eine(daten.get("objekt"), OBJEKT_WERTE, 40) in (
		"gewerbe", "landwirtschaft", "freiflaeche", "hotellerie", "gemeinde")


def _link(pfad, basis=None):
	return f"{website_basis(basis)}{pfad}"


def _so_geht_es_weiter(schritte):
	"""Block „So geht es weiter“ – ohne Zeitzusage."""
	punkte = "".join(f"<li>{s}</li>" for s in schritte)
	return f"<b>So geht es weiter</b><ol style='margin:6px 0 0 18px;padding:0'>{punkte}</ol>"


def _unterlagen_gewerbe(basis=None):
	punkte = "".join(f"<li>{_e(u)}</li>" for u in UNTERLAGEN_GEWERBE)
	return (
		"<b>Diese Unterlagen helfen uns bei Gewerbeprojekten</b>"
		f"<ul style='margin:6px 0 0 18px;padding:0'>{punkte}</ul>"
		f"Eine ausführliche Liste finden Sie hier: <a href='{_e(_link('/netzanmeldung/checkliste', basis))}'>Checkliste Netzanmeldung</a>."
	)


def _schritte_standard(telefon_ok):
	return [
		"Wir sichten Ihre Angaben und ordnen Ihre Anfrage einer festen Ansprechperson zu.",
		"Wir melden uns per E-Mail" + (" oder telefonisch, wie von Ihnen gewünscht." if telefon_ok else "."),
		"Gemeinsam klären wir die offenen Punkte – erst danach erstellen wir ein verbindliches Angebot.",
	]


def _adresse(daten):
	ort = " ".join(t for t in (daten.get("plz"), daten.get("ort")) if t)
	return ", ".join(t for t in (daten.get("strasse_hausnummer"), ort) if t)


def kunden_mail_kontakt(daten, referenz=None, basis=None):
	"""Eingangsbestätigung an den Kunden – ohne Freitext der Anfrage (keine Nachricht, keine Adresse, keine Herkunft)."""
	ref = _referenz(referenz)
	thema = sauber(daten.get("thema"), 140)
	absaetze = [
		"vielen Dank für Ihre Nachricht. Ihre Anfrage ist bei uns eingegangen"
		+ (f" (Referenz {_e(ref)})" if ref else "")
		+ (f" – Thema: {_e(thema)}" if thema in KONTAKT_THEMEN else "") + ".",
		_so_geht_es_weiter(_schritte_standard(bool(daten.get("telefon")) and _flagge(daten.get("rueckruf_ok")))),
	]
	if _ist_gewerbe(daten):
		absaetze.append(_unterlagen_gewerbe(basis))
	absaetze.append(_kontakt_hinweis())
	betreff = f"Ihre Anfrage {ref} bei Ökovolt ist eingegangen" if ref else "Ihre Anfrage bei Ökovolt ist eingegangen"
	return betreff, _kunden_rahmen(_anrede(daten.get("vorname"), daten.get("nachname")), absaetze)


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


OBJEKT_LABELS = {
	"gewerbe": "Gewerbe & Industrie", "landwirtschaft": "Landwirtschaft", "freiflaeche": "Freifläche / Agri-PV",
	"hotellerie": "Hotellerie & Tourismus", "gemeinde": "Gemeinde & öffentliche Hand", "chalet": "Chalet & Premium",
	"privat": "Privathaus", "sonstiges": "Sonstiges",
}


def kunden_mail_angebot(daten, referenz=None, basis=None):
	"""Eingangsbestätigung an den Kunden – nur Listenwerte und Zahlen, kein Freitext (Ort, Firma, Angaben, Herkunft)."""
	ref = _referenz(referenz)
	plz = sauber(daten.get("plz"), 10)
	angaben = _tabelle([
		("Vorhaben", _vorhaben_text(daten.get("vorhaben"))),
		("Objekt", OBJEKT_LABELS.get(_eine(daten.get("objekt"), OBJEKT_WERTE, 40), "")),
		("Jahresverbrauch", f"{zahl_de(daten.get('jahresverbrauch_kwh'))} kWh" if positiv(daten.get("jahresverbrauch_kwh")) else ""),
		("PLZ", plz if plz_gueltig(plz) else ""),
		("Telefon", telefon_e164(daten.get("telefon")) or ""),
	])
	absaetze = [
		"vielen Dank für Ihre Angebotsanfrage" + (f" {_e(ref)}" if ref else "") + ". Ihre Angaben sind bei uns eingegangen.",
		"Ihre Angaben:<br>" + angaben,
	]
	richtwerte = [(l, w) for l, w in _angebot_richtwerte(daten) if w]
	if richtwerte:
		absaetze.append(
			"Ihre Ersteinschätzung aus dem Online-Konfigurator:<br>" + _tabelle(richtwerte)
			+ "<br><span style='font-size:13px;color:#555'>Unverbindliche Richtwerte. Das verbindliche Angebot erstellen wir "
			"nach Prüfung von Dach, Verbrauch und Netzanschluss.</span>"
		)
	absaetze.append(_so_geht_es_weiter(_schritte_standard(bool(daten.get("telefon")))))
	if _ist_gewerbe(daten):
		absaetze.append(_unterlagen_gewerbe(basis))
	absaetze.append(_kontakt_hinweis())
	betreff = f"Ihre Angebotsanfrage {ref}" if ref else "Ihre Angebotsanfrage bei Ökovolt"
	return betreff, _kunden_rahmen(_anrede(daten.get("vorname"), daten.get("nachname")), absaetze)


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


def kunden_mail_solarrechner(daten, referenz=None, basis=None):
	"""PV-Analyse (PDF im Anhang). Referenz = Analyse-Referenz aus dem Dateinamen (PVA-2026-XXXXXX), geprüft."""
	analyse = analyse_referenz(daten.get("analyse_referenz"))
	absaetze = [
		"vielen Dank für Ihr Interesse. Im Anhang finden Sie Ihre persönliche PV-Analyse als PDF"
		+ (f" (Referenz {_e(analyse)})" if analyse else "") + ".",
		"Die Analyse ist eine erste Einschätzung auf Basis Ihrer Angaben – kein Angebot.",
		f"Rückfragen? <a href='{_e(_link('/termin?utm_source=pdf-analyse&utm_medium=email', basis))}'>Termin wählen</a>",
		_kontakt_hinweis(),
	]
	betreff = f"Ihre PV-Analyse {analyse} von Ökovolt" if analyse else "Ihre PV-Analyse von Ökovolt"
	return betreff, _kunden_rahmen(_anrede(daten.get("kunden_name")), absaetze)


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


# ---------------------------------------------------------------- Rechner Lead (#17–#19)

def kunden_mail_bestaetigung(daten, link):
	"""Double-Opt-in: Bitte E-Mail-Adresse bestätigen. Werkzeugname nur aus RECHNER_NAMEN, nie Freitext."""
	werkzeug = rechner_name(daten.get("rechner"))
	was = "Ihr Rechenergebnis" if werkzeug == RECHNER_UNBEKANNT else f"Ihr Ergebnis aus dem Werkzeug „{werkzeug}“"
	absaetze = [
		f"Sie haben auf www.oekovolt.com {_e(was)} angefordert. Bitte bestätigen Sie Ihre E-Mail-Adresse – "
		"danach schalten wir das Ergebnis für Sie frei:",
		f"<a href='{_e(link)}' style='display:inline-block;background:#4d7a26;color:#ffffff;padding:10px 18px;"
		"border-radius:6px;text-decoration:none;font-weight:bold'>E-Mail-Adresse bestätigen</a>",
		"Der Link ist 24 Stunden gültig und nur einmal verwendbar. Wenn Sie nichts angefordert haben, ignorieren Sie "
		"diese E-Mail: Dann wird nichts freigeschaltet und Ihre Angaben werden nach 30 Tagen gelöscht.",
		"Wir nutzen Ihre Adresse nur für dieses Ergebnis und Ihre Rückfragen – kein Newsletter "
		f"(<a href='{_e(_link('/datenschutz#rechner-export'))}'>Datenschutz</a>).",
	]
	return "Bitte bestätigen Sie Ihre E-Mail-Adresse – Ökovolt", _kunden_rahmen(_anrede(daten.get("vorname"), daten.get("nachname")), absaetze)


def kunden_mail_rechner(daten, referenz=None, basis=None):
	"""Ergebnis-Mail des Lead-Gates: Werkzeugname aus RECHNER_NAMEN, Ergebnis-Link (nur Pfad der eigenen Website),
	„So geht es weiter“, bei Gewerbe die Unterlagen-Checkliste und ein neutraler Terminlink. Kein Freitext."""
	ref = _referenz(referenz)
	werkzeug = rechner_name(daten.get("rechner"))
	pfad = ergebnis_pfad(daten.get("ergebnis_link"))
	absaetze = [
		"vielen Dank für Ihr Interesse"
		+ ("." if werkzeug == RECHNER_UNBEKANNT else f" am {_e(werkzeug)}.")
		+ (f" Ihre Referenz: {_e(ref)}." if ref else ""),
	]
	if pfad:
		absaetze.append(f"Ihr Ergebnis können Sie jederzeit wieder aufrufen: <a href='{_e(_link(pfad, basis))}'>Ergebnis öffnen</a>")
	absaetze.append("Alle Werte sind Richtwerte auf Basis Ihrer Eingaben – kein Angebot.")
	kontakt = _flagge(daten.get("kontakt_ok")) == 1
	absaetze.append(_so_geht_es_weiter([
		"Sie haben uns erlaubt, Sie zu diesem Ergebnis zu kontaktieren – eine Ansprechperson meldet sich bei Ihnen."
		if kontakt else
		"Wir melden uns nur, wenn Sie uns schreiben oder einen Termin wählen. Kein Newsletter.",
		"Auf Wunsch rechnen wir das Ergebnis mit Ihren echten Verbrauchs- und Dachdaten nach.",
	]))
	if _ist_gewerbe(daten):
		absaetze.append(_unterlagen_gewerbe(basis))
	absaetze.append(f"Rückfragen? <a href='{_e(_link('/termin', basis))}'>Termin wählen</a>")
	absaetze.append(_kontakt_hinweis())
	titel = "Ihr Rechenergebnis von Ökovolt" if werkzeug == RECHNER_UNBEKANNT else f"Ihr Ergebnis: {werkzeug}"
	betreff = f"{titel} ({ref})" if ref else titel
	return betreff, _kunden_rahmen(_anrede(daten.get("vorname"), daten.get("nachname")), absaetze)


def team_mail_rechner(daten, link):
	"""Team-Mail für einen Rechner Lead (intern, mit allen Angaben)."""
	name = f"{daten.get('vorname', '')} {daten.get('nachname', '')}".strip()
	werkzeug = rechner_name(daten.get("rechner"))
	betreff = f"Rechner-Lead: {werkzeug} – {name}" + (f", {daten.get('firma')}" if daten.get("firma") else "")
	status = "bestätigt" if ja(daten.get("bestaetigt") or 0) else ("Bestätigung ausstehend" if ja(daten.get("bestaetigung_erforderlich") or 0) else "ohne Bestätigung")
	return betreff, _team_rahmen("Neuer Lead aus dem Lead-Gate der Website:", [
		("Werkzeug", f"{werkzeug} ({sauber(daten.get('rechner'), 40)})"),
		("Aktion", daten.get("aktion")),
		("E-Mail-Bestätigung", status),
		("Name", name),
		("Firma", daten.get("firma")),
		("E-Mail", daten.get("email")),
		("Telefon", daten.get("telefon")),
		("Kontakt erwünscht", "ja" if ja(daten.get("kontakt_ok") or 0) else "nein – nur Rückfragen beantworten"),
		("PLZ", daten.get("plz")),
		("Rolle", daten.get("rolle")),
		("Bericht für", daten.get("mappe_rollen")),
		("Ergebnis", daten.get("ergebnis")),
		("Ergebnis-Link", daten.get("ergebnis_link")),
		("Seite", daten.get("quelle")),
		("Herkunft", daten.get("herkunft")),
	], link)


def team_mail_termin(daten, link):
	"""Team-Mail für einen Website-Termin (lead_eingang.py nutzt sie automatisch)."""
	art = "Rückruf" if daten.get("anfrageart") == "Rückruf" else (daten.get("terminart") or "Termin")
	start = daten.get("start")
	wann = start.strftime("%d.%m.%Y %H:%M") if isinstance(start, datetime) else f"{daten.get('datum') or ''} {daten.get('uhrzeit') or ''}".strip()
	betreff = f"Neu: {art} am {wann} – {daten.get('name_komplett', '')}".strip(" –")
	return betreff, _team_rahmen(f"Neuer {art} über die Website:", [
		("Buchungsnummer", daten.get("referenz") or daten.get("name")),
		("Termin", wann),
		("Name", daten.get("name_komplett")),
		("Firma", daten.get("firma")),
		("E-Mail", daten.get("email")),
		("Telefon", daten.get("telefon")),
		("PLZ", daten.get("plz")),
		("Adresse", daten.get("adresse")),
		("Thema", daten.get("thema")),
		("Nachricht", daten.get("nachricht")),
		("Bezug", daten.get("bezug")),
		("Seite", daten.get("quelle")),
		("Herkunft", daten.get("herkunft")),
	], link)


def termin_zusatz(d, buchung):
	"""Zusatzfelder für buche_termin (#6): bezug, Herkunft zerlegt, Hinweistext-Kennung, Rückrufwunsch.

	`buchung` = Ergebnis von termin_logik.buchung_pruefen (dort steht die Herkunftszeile in „herkunft“)."""
	d = d or {}
	telefonisch = bool(buchung.get("rueckruf")) or buchung.get("terminart") == "Telefonische Beratung"
	return {
		"bezug": bezug_wert(d.get("bezug")),
		**herkunft_felder(buchung.get("herkunft")),
		**einwilligung_felder(d),
		"segment": segment_wert(d.get("segment")),
		"rueckruf_ok": 1 if telefonisch or _flagge(d.get("rueckruf_ok")) else 0,
	}
