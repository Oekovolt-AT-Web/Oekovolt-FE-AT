# Copyright (c) 2026, ÖKOVOLT
#
# Reine Logik der Referenz-Freigabe (Welle A07) – ohne Frappe, per Python testbar:
#   python oekovolt_app/oekovolt_app/doctype/referenz_freigabe/test_freigabe_logik.py
#
# Einmal-Token: 32 Byte base64url (43 Zeichen), nur im Link. Gespeichert wird ausschließlich der
# SHA-256-Hash. Nach dem Speichern der Auswahl ist der Token verbraucht; der Widerruf läuft über
# einen zweiten Token aus der Bestätigungsmail.

import hashlib
import html
import ipaddress
import json
import re
import secrets
from datetime import datetime, timedelta


class EingabeFehler(Exception):
	"""Ungültige Eingabe. Der Text wird dem Kunden angezeigt."""


GUELTIG_TAGE = 30
TOKEN_BYTES = 32
_TOKEN = re.compile(r"^[A-Za-z0-9_-]{43}$")
_STEUER = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
_EMAIL = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")

# Schalter in der Reihenfolge der Freigabeseite – alle standardmäßig 0, nie vorangekreuzt
SCHALTER = (
	"freigabe_name",
	"freigabe_logo",
	"freigabe_zitat",
	"freigabe_fotos_anlage",
	"freigabe_plakette",
	"freigabe_livedaten",
	"freigabe_messwerte",
)
# Schlüssel, wie die Website sie sendet (auswahl-JSON) -> Feld im DocType
AUSWAHL_SCHLUESSEL = {
	"name": "freigabe_name",
	"logo": "freigabe_logo",
	"zitat": "freigabe_zitat",
	"fotos_anlage": "freigabe_fotos_anlage",
	"plakette": "freigabe_plakette",
	"livedaten": "freigabe_livedaten",
	"messwerte": "freigabe_messwerte",
}
MAX_ZITAT = 600
MAX_PERSON = 160
MAX_TEXT_VERSION = 40

STATUS_OFFEN = "Offen"
STATUS_FREIGEGEBEN = "Freigegeben"
STATUS_WIDERRUFEN = "Widerrufen"
STATUS_ABGELAUFEN = "Abgelaufen"
STATUS_EINGELOEST = "Link verbraucht"

# Felder, die get_freigaben an die Website liefert – bewusst OHNE email, token_hash, ip_kuerzel
OEFFENTLICHE_FELDER = SCHALTER + ("zitat_text", "zitat_person_funktion", "freigegeben_am", "text_version")


# ---------------------------------------------------------------- Token


def token_erzeugen():
	"""Neuer Einmal-Token (43 Zeichen base64url, 256 Bit Zufall)."""
	return secrets.token_urlsafe(TOKEN_BYTES)


def token_hash(token):
	return hashlib.sha256(str(token or "").encode("utf-8")).hexdigest()


def token_gueltig(token):
	return bool(_TOKEN.match(str(token or "")))


def gueltig_bis(jetzt, tage=GUELTIG_TAGE):
	return jetzt + timedelta(days=tage)


def freigabe_url(basis, token):
	return f"{str(basis or '').rstrip('/')}/referenzen/freigabe/{token}"


def widerruf_url(basis, token):
	return f"{str(basis or '').rstrip('/')}/referenzen/freigabe/{token}?widerruf=1"


# ---------------------------------------------------------------- Eingaben


def sauber(wert, maximal, mehrzeilig=False):
	if wert is None or isinstance(wert, (dict, list, tuple, set, bytes)):
		return ""
	text = str(wert).replace("\r\n", "\n").replace("\r", "\n")
	text = _STEUER.sub("", text)
	if not mehrzeilig:
		text = re.sub(r"\s+", " ", text)
	return text.strip()[:maximal]


def ja(wert):
	if isinstance(wert, bool):
		return wert
	if isinstance(wert, (int, float)):
		return wert == 1
	return str(wert).strip().lower() in ("1", "true", "on", "ja", "yes")


def email_gueltig(wert):
	wert = str(wert or "").strip()
	return 5 <= len(wert) <= 190 and bool(_EMAIL.match(wert))


def ip_kuerzel(ip):
	"""IP-Adresse gekürzt für den Nachweis (IPv4: letztes Oktett 0, IPv6: nur die ersten drei Gruppen)."""
	text = str(ip or "").split(",")[0].strip()
	try:
		adresse = ipaddress.ip_address(text)
	except ValueError:
		return ""
	if adresse.version == 4:
		teile = text.split(".")
		return ".".join(teile[:3] + ["0"])
	voll = adresse.exploded.split(":")
	return ":".join(voll[:3]) + "::"


def auswahl_pruefen(roh):
	"""
	Auswahl der Freigabeseite prüfen (JSON-Text oder dict). Rückgabe: dict mit den DocType-Feldern.
	Pflicht: vertretungsbefugnis_bestaetigt. Zitat nur mit Text. Nichts ist vorangekreuzt – auch
	„nichts freigegeben“ ist eine gültige, dokumentierte Antwort.
	"""
	if isinstance(roh, str):
		try:
			roh = json.loads(roh or "{}")
		except ValueError:
			raise EingabeFehler("Die Auswahl konnte nicht gelesen werden.")
	if not isinstance(roh, dict):
		raise EingabeFehler("Die Auswahl konnte nicht gelesen werden.")

	if not ja(roh.get("vertretungsbefugnis_bestaetigt")):
		raise EingabeFehler("Bitte bestätigen Sie, dass Sie diese Erklärung für das Unternehmen abgeben dürfen.")

	daten = {feld: 1 if ja(roh.get(schluessel)) else 0 for schluessel, feld in AUSWAHL_SCHLUESSEL.items()}
	daten["vertretungsbefugnis_bestaetigt"] = 1

	zitat = sauber(roh.get("zitat_text"), MAX_ZITAT, mehrzeilig=True)
	person = sauber(roh.get("zitat_person_funktion"), MAX_PERSON)
	if daten["freigabe_zitat"]:
		if len(zitat) < 10:
			raise EingabeFehler("Bitte tragen Sie den Wortlaut des Zitats ein (mindestens 10 Zeichen) oder nehmen Sie das Häkchen beim Zitat heraus.")
		if not person:
			raise EingabeFehler("Bitte geben Sie Name und Funktion der zitierten Person an.")
		daten["zitat_text"] = zitat
		daten["zitat_person_funktion"] = person
	else:
		daten["zitat_text"] = ""
		daten["zitat_person_funktion"] = ""

	daten["text_version"] = sauber(roh.get("text_version"), MAX_TEXT_VERSION)
	return daten


# ---------------------------------------------------------------- Status


def _als_datetime(wert):
	if wert is None or wert == "":
		return None
	if isinstance(wert, datetime):
		return wert
	try:
		return datetime.fromisoformat(str(wert).replace("Z", ""))
	except ValueError:
		return None


def status(doc, jetzt):
	"""Status aus den Zeitstempeln: Widerrufen > Freigegeben > Link verbraucht > Abgelaufen > Offen."""
	d = doc if isinstance(doc, dict) else getattr(doc, "as_dict", lambda: doc.__dict__)()
	if _als_datetime(d.get("widerrufen_am")):
		return STATUS_WIDERRUFEN
	if _als_datetime(d.get("freigegeben_am")):
		return STATUS_FREIGEGEBEN
	if not d.get("token_hash"):
		return STATUS_EINGELOEST
	bis = _als_datetime(d.get("gueltig_bis"))
	if bis and bis < jetzt:
		return STATUS_ABGELAUFEN
	return STATUS_OFFEN


def link_offen(doc, jetzt):
	"""Darf der Einmal-Link noch benutzt werden?"""
	return status(doc, jetzt) == STATUS_OFFEN


def ist_wirksam(doc, jetzt):
	"""Zählt die Freigabe für die Website? (freigegeben und nicht widerrufen)"""
	return status(doc, jetzt) == STATUS_FREIGEGEBEN


# ---------------------------------------------------------------- Antworten


def fuer_seite(doc, projekt, jetzt):
	"""Antwort von freigabe_lesen – ohne E-Mail, ohne Hash, ohne IP."""
	d = doc if isinstance(doc, dict) else doc.as_dict()
	p = projekt or {}
	bis = _als_datetime(d.get("gueltig_bis"))
	return {
		"status": status(d, jetzt).lower().replace(" ", "_"),
		"kunde_firma": d.get("kunde_firma") or "",
		"ansprechperson": d.get("ansprechperson") or "",
		"funktion": d.get("funktion") or "",
		"gueltig_bis": bis.strftime("%Y-%m-%d") if bis else None,
		"text_version": d.get("text_version") or "",
		"projekt": {
			"titel": p.get("projekt_name") or "",
			"ort": p.get("ort") or "",
			"jahr": int(p["jahr"]) if p.get("jahr") else None,
			"kwp": float(p["leistung"]) if p.get("leistung") else None,
			"slug": p.get("projekt_website_name") or "",
		},
	}


def fuer_website(doc, projekt_website_name):
	"""Eintrag der get_freigaben-Liste – nur Schalter, Zitat, Datum, Textversion."""
	d = doc if isinstance(doc, dict) else doc.as_dict()
	eintrag = {"projekt_website_name": projekt_website_name or ""}
	for feld in OEFFENTLICHE_FELDER:
		wert = d.get(feld)
		if feld in SCHALTER:
			wert = 1 if ja(wert) else 0
		elif isinstance(wert, datetime):
			wert = wert.strftime("%Y-%m-%d")
		eintrag[feld] = wert if wert not in (None, "") else ("" if feld in ("zitat_text", "zitat_person_funktion", "text_version") else None)
	if not eintrag["freigabe_zitat"]:
		eintrag["zitat_text"] = ""
		eintrag["zitat_person_funktion"] = ""
	assert "email" not in eintrag and "token_hash" not in eintrag
	return eintrag


# ---------------------------------------------------------------- E-Mails

BEZEICHNUNG = {
	"freigabe_name": "Nennung des Firmennamens",
	"freigabe_logo": "Firmenlogo",
	"freigabe_zitat": "Zitat",
	"freigabe_fotos_anlage": "Fotos der Anlage (ohne erkennbare Personen)",
	"freigabe_plakette": "Projekt-Plakette zum Einbau auf Ihrer Website",
	"freigabe_livedaten": "Live-Daten der Anlage",
	"freigabe_messwerte": "Messwerte (Ertrag) der Anlage",
}


def _zeilen(daten):
	zeilen = []
	for feld in SCHALTER:
		zeilen.append(f"<li>{html.escape(BEZEICHNUNG[feld])}: <b>{'ja' if ja(daten.get(feld)) else 'nein'}</b></li>")
	if ja(daten.get("freigabe_zitat")) and daten.get("zitat_text"):
		zeilen.append(
			f"<li>Wortlaut: „{html.escape(daten['zitat_text'])}“ – {html.escape(daten.get('zitat_person_funktion') or '')}</li>"
		)
	return "".join(zeilen)


def bestaetigung_mail(daten, widerruf_link, projekt_titel, firma_absender="Ökovolt Solartechnik GmbH"):
	"""Bestätigung an den Kunden mit Kopie der Erklärung und Widerrufslink."""
	name = html.escape(daten.get("ansprechperson") or "")
	betreff = f"Ihre Referenz-Freigabe für {projekt_titel}"
	body = (
		f"<p>Guten Tag {name},</p>"
		f"<p>vielen Dank. Sie haben für das Referenzprojekt <b>{html.escape(projekt_titel)}</b> folgende Angaben "
		f"freigegeben (Erklärung vom {html.escape(str(daten.get('freigegeben_am') or ''))}, Textfassung "
		f"{html.escape(daten.get('text_version') or '–')}):</p>"
		f"<ul>{_zeilen(daten)}</ul>"
		"<p>Die Freigabe ist freiwillig und erfolgt ohne Gegenleistung. Sie können sie jederzeit ganz oder teilweise "
		"widerrufen – mit diesem Link oder formlos per E-Mail:</p>"
		f"<p><a href=\"{html.escape(widerruf_link)}\">{html.escape(widerruf_link)}</a></p>"
		"<p>Nach einem Widerruf entfernen wir die betroffenen Inhalte innerhalb weniger Werktage von unserer Website.</p>"
		f"<p>Freundliche Grüße<br>{html.escape(firma_absender)}</p>"
	)
	return betreff, body


def team_mail(daten, projekt_titel, link_desk):
	betreff = f"Referenz-Freigabe eingegangen: {projekt_titel}"
	body = (
		f"<p>{html.escape(daten.get('kunde_firma') or '')} ({html.escape(daten.get('ansprechperson') or '')}, "
		f"{html.escape(daten.get('funktion') or '')}) hat für <b>{html.escape(projekt_titel)}</b> geantwortet:</p>"
		f"<ul>{_zeilen(daten)}</ul>"
		f"<p><a href=\"{html.escape(link_desk)}\">Datensatz im Backoffice öffnen</a></p>"
	)
	return betreff, body


def widerruf_mail(daten, projekt_titel, link_desk):
	betreff = f"Referenz-Freigabe WIDERRUFEN: {projekt_titel}"
	body = (
		f"<p>{html.escape(daten.get('kunde_firma') or '')} hat die Freigabe für <b>{html.escape(projekt_titel)}</b> "
		"widerrufen. Bitte Zitat, Logo, Plakette, Fotos und Messwerte von der Website nehmen (Cache 10 Minuten) und "
		"den Eintrag in src/data/kunden.js prüfen.</p>"
		f"<p><a href=\"{html.escape(link_desk)}\">Datensatz im Backoffice öffnen</a></p>"
	)
	return betreff, body
