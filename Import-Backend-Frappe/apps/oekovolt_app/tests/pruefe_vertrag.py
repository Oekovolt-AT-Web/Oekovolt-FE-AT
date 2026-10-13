#!/usr/bin/env python3
# Copyright (c) 2026, ÖKOVOLT
#
# Vertragsprüfung OHNE Frappe-Installation:
#   python tests/pruefe_vertrag.py        (aus apps/oekovolt_app)
#
# Prüft gegen docs/FRAPPE-AT-API-SPEZIFIKATION.md (Abschnitte 0–3, 7):
#   - Antwortformen von get_projekte / get_projekt / get_referenzkarte (format.py, mit Beispieldaten)
#   - Eingabeprüfung der Formulare (Honeypot, Pflichtfelder, PLZ 4–5 Ziffern, PDF)
#   - Herkunftszeile: im Datensatz, aber nicht in der Kunden-Mail
#   - DocType-JSONs: Felder laut Spezifikation, Berechtigungen, jedes gespeicherte Feld existiert
#   - Whitelist-Methoden unter den exakten Pfaden, jeweils mit Rollenprüfung
#   - Welle A11 (Abschnitt „Vertrieb“, #17–#19): Lead-Scoring, Bundesland aus PLZ, Anrede-Härtung, Rechnernamen,
#     Kundenmails ohne Freitext, Kernschema in allen fünf Lead-DocTypes, Anonymisierung, Double-Opt-in-Token

import ast
import json
import math
import re
import sys
from pathlib import Path

APP = Path(__file__).resolve().parents[1]
PAKET = APP / "oekovolt_app"
DOCTYPES = PAKET / "oekovolt_app" / "doctype"
sys.path.insert(0, str(APP))
# Windows-Konsole (cp1252) kennt „≥“ und Pfeile nicht -> Ausgabe immer als UTF-8
for _strom in (sys.stdout, sys.stderr):
	if hasattr(_strom, "reconfigure"):
		_strom.reconfigure(encoding="utf-8", errors="replace")

from oekovolt_app.website_api import format as fmt  # noqa: E402

FEHLER = []
ANZAHL = 0


def pruefe(bedingung, text):
	global ANZAHL
	ANZAHL += 1
	if bedingung:
		print(f"  ok    {text}")
	else:
		print(f"  FEHLT {text}")
		FEHLER.append(text)


def wirft(funktion, *args, enthaelt=""):
	try:
		funktion(*args)
	except fmt.EingabeFehler as e:
		return enthaelt.lower() in str(e).lower()
	return False


def url(pfad):
	return "https://backoffice.oekovolt.com" + pfad


# Schlüssel laut Spezifikation (bewusst hier abgeschrieben, nicht aus format.py übernommen)
SPEZ_LISTE = {
	"projekt_name", "projekt_website_name", "leistung", "leistung_label", "jahr", "ort", "land", "objekt", "dach",
	"bild_url", "bild_alt", "modified",
	"website_url", "branche",  # Kundenbühne (Ergänzung Koordinator)
}
SPEZ_SOCIAL = {"linkedin", "instagram", "facebook", "youtube", "xing", "tiktok", "x"}
SPEZ_DETAIL = SPEZ_LISTE | {"bilder", "plz", "modul", "wechselrichter", "speicher", "ertrag", "latitude", "longitude"} | SPEZ_SOCIAL | {
	"portraet", "portraet_quellen", "zitat", "zitat_person", "logo_url"}
SPEZ_KARTE = {"firmensitz", "orte", "umkreis_km", "anzahl_im_umkreis"}
SPEZ_FIRMENSITZ = {"name", "latitude", "longitude", "beschreibung"}
SPEZ_ORT = {"ort", "plz", "latitude", "longitude", "land", "entfernung_km", "im_umkreis", "anzahl_projekte", "projekte"}
SPEZ_ORT_PROJEKT = {"projekt_name", "projekt_website_name", "leistung_label"}

PROJEKTE = [
	{"name": "PRJ-00001", "projekt_name": "Haydu 2", "projekt_website_name": "haydu-2", "veroeffentlicht": 1, "leistung": 314.5,
	 "leistung_label": "", "jahr": 2024, "ort": "Salzburg", "plz": "5020", "land": "Österreich", "objekt": "Gewerbe",
	 "dach": "Flachdach", "bild": "/files/haydu 2.jpg", "bild_alt": "PV-Anlage Haydu", "modified": "2026-09-01 10:00:00.123456",
	 "latitude": 47.8, "longitude": 13.04},
	{"name": "PRJ-00002", "projekt_name": "Salzburg Lehen", "projekt_website_name": "salzburg-lehen", "veroeffentlicht": 1,
	 "leistung": 12, "leistung_label": "12 kWp", "jahr": 2023, "ort": "salzburg", "plz": "", "land": "Österreich",
	 "objekt": "Einfamilienhaus", "dach": "Ziegeldach", "bild": "/private/files/geheim.jpg", "bild_alt": "", "modified": None,
	 "latitude": 47.81, "longitude": 13.03},
	{"name": "PRJ-00003", "projekt_name": "Nicht öffentlich", "projekt_website_name": "entwurf", "veroeffentlicht": 0,
	 "leistung": 99, "ort": "Linz", "latitude": 48.3, "longitude": 14.29},
	{"name": "PRJ-00004", "projekt_name": "Ostermiething Halle", "projekt_website_name": "", "veroeffentlicht": 1,
	 "leistung": 50.25, "jahr": 0, "ort": "Ostermiething", "objekt": "Landwirtschaft", "bild": "", "latitude": 48.04, "longitude": 12.84},
	{"name": "PRJ-00005", "projekt_name": "Wien Simmering", "projekt_website_name": "wien-simmering", "veroeffentlicht": 1,
	 "leistung": 1000, "jahr": 2025, "ort": "Wien", "objekt": "Gewerbe", "bild": "https://cdn.example.at/x.jpg",
	 "latitude": 48.17, "longitude": 16.42},
	{"name": "PRJ-00006", "projekt_name": "Ohne Koordinaten", "projekt_website_name": "ohne-koordinaten", "veroeffentlicht": 1,
	 "leistung": 0, "ort": "Hallein", "latitude": 0, "longitude": 0},
]


def teste_projekte():
	print("\n#1 get_projekte")
	antwort = fmt.projekte_antwort(PROJEKTE, url)
	pruefe(set(antwort) == {"projekte", "anzahl", "summe_kwp"}, "message = {projekte, anzahl, summe_kwp}")
	namen = [p["projekt_name"] for p in antwort["projekte"]]
	pruefe("Nicht öffentlich" not in namen and len(namen) == 5, "nur veröffentlichte Projekte (5 von 6)")
	pruefe(antwort["anzahl"] == 5, "anzahl = 5")
	pruefe(math.isclose(antwort["summe_kwp"], 314.5 + 12 + 50.25 + 1000), f"summe_kwp = {antwort['summe_kwp']}")
	pruefe(all(set(p) == SPEZ_LISTE for p in antwort["projekte"]), "jeder Eintrag hat genau die Schlüssel der Spezifikation")
	haydu = antwort["projekte"][0]
	pruefe(haydu["leistung_label"] == "314,5 kWp", f"leistung_label berechnet: {haydu['leistung_label']!r}")
	pruefe(haydu["bild_url"] == "https://backoffice.oekovolt.com/files/haydu 2.jpg", "bild_url absolut (Host backoffice.oekovolt.com)")
	pruefe(haydu["modified"] == "2026-09-01 10:00:00", "modified als „YYYY-MM-DD HH:MM:SS“")
	pruefe(isinstance(haydu["leistung"], float) and haydu["jahr"] == 2024, "leistung als Zahl, jahr als Ganzzahl")
	lehen = antwort["projekte"][1]
	pruefe(lehen["bild_url"] is None, "privates Bild wird nicht ausgeliefert")
	pruefe(lehen["leistung_label"] == "12 kWp", "gepflegter leistung_label hat Vorrang")
	halle = antwort["projekte"][2]
	pruefe(halle["projekt_website_name"] is None and halle["jahr"] is None and halle["bild_url"] is None, "leere Felder -> null")
	wien = antwort["projekte"][3]
	pruefe(wien["leistung_label"] == "1.000 kWp", f"Tausenderpunkt: {wien['leistung_label']!r}")
	pruefe(wien["bild_url"] == "https://cdn.example.at/x.jpg", "bereits absolute URL bleibt unverändert")
	json.dumps(antwort)
	pruefe(True, "Antwort ist JSON-serialisierbar")


def teste_projekt():
	print("\n#2 get_projekt")
	bilder = [
		{"bild": "/files/b2.jpg", "bild_alt": "", "idx": 2},
		{"bild": "/files/b1.jpg", "bild_alt": "Wechselrichter", "idx": 1},
		{"bild": "/files/haydu 2.jpg", "bild_alt": "doppelt", "idx": 3},
		{"bild": "/private/files/p.jpg", "bild_alt": "", "idx": 4},
	]
	row = {**PROJEKTE[0], "modul": "Trina 445 W", "wechselrichter": "Fronius Tauro", "speicher": "", "ertrag": 0}
	p = fmt.projekt_detail(row, bilder, url)
	pruefe(set(p) == SPEZ_DETAIL, "Schlüssel = Liste + bilder, plz, modul, wechselrichter, speicher, ertrag, latitude, longitude")
	pruefe(p["projekt_website_name"] == "haydu-2", "projekt_website_name vorhanden (sonst verwirft die Website die Antwort)")
	urls = [b["bild_url"] for b in p["bilder"]]
	pruefe(urls == [url("/files/haydu 2.jpg"), url("/files/b1.jpg"), url("/files/b2.jpg")], "bilder[]: Titelbild zuerst, nach idx, ohne Duplikat/privat")
	pruefe(all(set(b) == {"bild_url", "bild_alt"} for b in p["bilder"]), "bilder[] = {bild_url, bild_alt}")
	pruefe(p["ertrag"] is None, "ertrag 0 -> null (Website rechnet kWp × 1050)")
	pruefe(p["latitude"] == 47.8 and p["longitude"] == 13.04 and p["plz"] == "5020", "Koordinaten und PLZ")
	pruefe(p["speicher"] is None and p["modul"] == "Trina 445 W", "Technikfelder")


def teste_kundenbuehne():
	print("\nKundenbühne (get_projekt / get_projekte)")
	kunde = {
		**PROJEKTE[0], "website_url": "https://www.haydu.at", "branche": "Lebensmittelhandel",
		"linkedin": "https://www.linkedin.com/company/haydu", "instagram": "http://instagram.com/haydu", "x": "",
		"portraet": "Familienbetrieb seit 1962.",
		"portraet_quellen": "https://www.haydu.at/ueber-uns\n\nhttps://firmen.wko.at/haydu\nhttps://www.haydu.at/ueber-uns",
		"zitat": "Der Strom vom Dach deckt unsere Kühlung.", "zitat_person": "Karl Haydu, Geschäftsführer",
		"freigabe_zitat": 0, "logo": "/files/haydu-logo.png", "freigabe_logo": 0,
	}
	liste = fmt.projekte_antwort([kunde], url)["projekte"][0]
	pruefe(liste["website_url"] == "https://www.haydu.at" and liste["branche"] == "Lebensmittelhandel" and liste["jahr"] == 2024,
		"get_projekte liefert website_url, branche, jahr")
	pruefe("zitat" not in liste and "logo_url" not in liste, "get_projekte ohne Zitat/Logo")
	p = fmt.projekt_detail(kunde, [], url)
	pruefe(p["zitat"] is None and p["zitat_person"] is None, "Zitat ohne freigabe_zitat -> null")
	pruefe(p["logo_url"] is None, "Logo ohne freigabe_logo -> null")
	pruefe(p["linkedin"] == "https://www.linkedin.com/company/haydu" and p["x"] is None, "Social-Profile als https-URL, leer -> null")
	pruefe(p["instagram"] is None, "http:// (ohne s) wird nicht ausgeliefert")
	pruefe(p["portraet_quellen"] == ["https://www.haydu.at/ueber-uns", "https://firmen.wko.at/haydu"],
		"portraet_quellen: Liste, eine URL pro Zeile, ohne Leerzeilen/Duplikate")
	frei = fmt.projekt_detail({**kunde, "freigabe_zitat": 1, "freigabe_logo": 1}, [], url)
	pruefe(frei["zitat"] == kunde["zitat"] and frei["zitat_person"] == "Karl Haydu, Geschäftsführer", "Zitat mit Freigabe")
	pruefe(frei["logo_url"] == "https://backoffice.oekovolt.com/files/haydu-logo.png", "logo_url absolut mit Freigabe")
	pruefe(fmt.projekt_detail({**kunde, "freigabe_logo": 1, "logo": "/private/files/l.png"}, [], url)["logo_url"] is None,
		"privates Logo nie ausgeliefert")
	pruefe("https://" in (fmt.projekt_url_fehler(kunde) or ""), "Validierung: http:// -> Meldung")
	pruefe(fmt.projekt_url_fehler({**kunde, "instagram": "https://instagram.com/haydu"}) is None, "Validierung: alle https:// -> ok")
	pruefe(fmt.projekt_url_fehler({"website_url": "www.haydu.at"}) is not None, "Validierung: ohne https:// -> Meldung")
	pruefe("Zeile 2" in (fmt.projekt_url_fehler({"portraet_quellen": "https://a.at\nhaydu.at"}) or ""), "Validierung: Porträt-Quellen je Zeile")


def teste_referenzkarte():
	print("\n#3 get_referenzkarte")
	pruefe(abs(fmt.haversine_km(0, 0, 0, 1) - 111.19) < 0.01, "Haversine: 1° am Äquator = 111,19 km")
	e = {"firmensitz_name": "Ostermiething", "latitude": "48.0428", "longitude": "12.8417", "beschreibung": "", "umkreis_km": None}
	k = fmt.referenzkarte_antwort(PROJEKTE, e)
	pruefe(set(k) == SPEZ_KARTE, "message = {firmensitz, orte, umkreis_km, anzahl_im_umkreis}")
	pruefe(set(k["firmensitz"]) == SPEZ_FIRMENSITZ and k["firmensitz"]["latitude"] == 48.0428, "firmensitz aus Einstellungen (Text -> Zahl)")
	pruefe(k["firmensitz"]["beschreibung"] == "Planung, Montage & Service", "leere Beschreibung -> Standardtext")
	pruefe(k["umkreis_km"] == 100, "umkreis_km Standard 100")
	orte = {o["ort"]: o for o in k["orte"]}
	pruefe(all(set(o) == SPEZ_ORT for o in k["orte"]), "jeder Ort hat die Schlüssel der Spezifikation")
	pruefe(set(orte) == {"Salzburg", "Wien", "Hallein"}, f"Gruppierung nach ort, ohne Firmensitz und Unveröffentlichtes: {sorted(orte)}")
	sbg = orte["Salzburg"]
	pruefe(sbg["anzahl_projekte"] == 2 and len(sbg["projekte"]) == 2, "„Salzburg“ und „salzburg“ = ein Ort mit 2 Projekten")
	pruefe(all(set(x) == SPEZ_ORT_PROJEKT for x in sbg["projekte"]), "orte[].projekte[] = {projekt_name, projekt_website_name, leistung_label}")
	pruefe(sbg["plz"] == "5020" and sbg["land"] == "Österreich", "plz/land aus dem ersten gepflegten Projekt")
	pruefe(25 < sbg["entfernung_km"] < 40 and sbg["im_umkreis"], f"Salzburg {sbg['entfernung_km']} km, im Umkreis")
	pruefe(orte["Wien"]["entfernung_km"] > 200 and not orte["Wien"]["im_umkreis"], f"Wien {orte['Wien']['entfernung_km']} km, außerhalb")
	pruefe(orte["Hallein"]["latitude"] is None and orte["Hallein"]["entfernung_km"] is None, "Ort ohne Koordinaten: null, nicht im Umkreis")
	pruefe(k["anzahl_im_umkreis"] == 1, "anzahl_im_umkreis zählt Orte im Umkreis")
	pruefe(k["orte"][0]["ort"] == "Salzburg" and k["orte"][-1]["ort"] == "Hallein", "sortiert nach Entfernung, ohne Koordinaten zuletzt")
	leer = fmt.referenzkarte_antwort([], {})
	pruefe(leer["firmensitz"]["name"] == "Ostermiething" and leer["orte"] == [], "ohne Einstellungen: Standard-Firmensitz")


def teste_format():
	print("\nFormate")
	faelle = {
		"Mindelheim 2": "mindelheim-2",
		"ALPLA Werke Alwin Lehner GmbH & Co KG": "alpla-werke-alwin-lehner-gmbh-co-kg",
		"Bad Wörishofen 3": "bad-woerishofen-3",
		"Straß im Attergau – Halle/Dach": "strass-im-attergau-halle-dach",
	}
	for titel, erwartet in faelle.items():
		pruefe(fmt.slug(titel) == erwartet, f"slug({titel!r}) = {fmt.slug(titel)!r}")
	for kwp, erwartet in ((314.5, "314,5 kWp"), (9.86, "9,86 kWp"), (1000, "1.000 kWp"), (12345.5, "12.345,5 kWp"), (0, ""), (None, "")):
		pruefe(fmt.leistung_label(kwp) == erwartet, f"leistung_label({kwp}) = {fmt.leistung_label(kwp)!r}")
	pruefe(fmt.ip_sauber("203.0.113.9, 10.0.0.1") == "203.0.113.9" and fmt.ip_sauber("<script>") == "", "ip_adresse wird geprüft")
	pruefe(fmt.seitenpfad("/kontakt") == "/kontakt" and fmt.seitenpfad("https://x.at") == "", "quelle nur als Seitenpfad")


KONTAKT = {
	"thema": "Gewerbe & Industrie",
	"vorname": "Anna",
	"nachname": "Huber",
	"email": "Anna.Huber@Example.at",
	"telefon": "+43 664 1234567",
	"strasse_hausnummer": "Hauptstraße 1",
	"plz": "5121",
	"ort": "Ostermiething",
	"nachricht": "Unternehmen/Organisation: Huber GmbH\n\nBitte um Rückruf.\n\n—\n[Herkunft] Kanal: Anzeige · Quelle: google · Kampagne: pv-herbst · Einstieg: /photovoltaik/salzburg · Seite: /kontakt",
	"einwilligung": 1,
	"quelle": "/kontakt",
	"website": "",
	"ip_adresse": "203.0.113.9",
}


def teste_kontakt():
	print("\n#4 submit_kontakt")
	d = fmt.pruefe_kontakt(KONTAKT)
	pruefe(d["email"] == "anna.huber@example.at", "E-Mail klein geschrieben")
	pruefe("[Herkunft]" in d["nachricht"], "Datensatz behält die Herkunftszeile in nachricht")
	pruefe(d["herkunft"].startswith("Kanal: Anzeige"), "Feld herkunft befüllt")
	pruefe(d["herkunft_kanal"] == "Anzeige" and d["utm_source"] == "google" and d["utm_campaign"] == "pv-herbst", "Herkunft in Kanal/UTM-Felder zerlegt")
	pruefe(d["einstiegsseite"] == "/photovoltaik/salzburg", "Einstiegsseite übernommen")
	pruefe("ip_adresse" not in d and "website" not in d, "Honeypot/IP nicht aus pruefe_kontakt (IP setzt die Methode geprüft)")
	betreff, html = fmt.kunden_mail_kontakt(d)
	pruefe("[Herkunft]" not in html and "pv-herbst" not in html and "Anzeige" not in html, "Kunden-Mail OHNE Herkunftszeile")
	pruefe("Bitte um Rückruf." not in html and "Huber GmbH" not in html and "Hauptstraße" not in html,
		"Kunden-Mail OHNE Freitext (Nachricht, Firma, Adresse)")
	pruefe("So geht es weiter" in html and "Zählpunktnummer" in html and "/netzanmeldung/checkliste" in html,
		"Kunden-Mail Gewerbe: „So geht es weiter“ und Unterlagen-Checkliste")
	pruefe(not re.search(r"\b\d+\s*(Stunden|Werktag|Minuten)", html), "„So geht es weiter“ ohne Zeitzusage")
	betreff, _h = fmt.kunden_mail_kontakt(d, "KA-2026-00042")
	pruefe("KA-2026-00042" in betreff, "Referenz im Betreff der Kunden-Mail")
	pruefe("KA-2026" not in fmt.kunden_mail_kontakt(d, "<script>")[0], "nur gültige Referenz im Betreff")
	_b, team = fmt.team_mail_kontakt(d, "https://backoffice.oekovolt.com/app/kontaktanfrage/KA-2026-00001")
	pruefe("pv-herbst" in team and "Im Backoffice öffnen" in team, "Team-Mail enthält Herkunft und Link")
	x = fmt.pruefe_kontakt({**KONTAKT, "nachricht": "<b>Hallo</b>"})
	pruefe("&lt;b&gt;" in fmt.team_mail_kontakt(x, "https://x")[1] and "<b>Hallo" not in fmt.kunden_mail_kontakt(x)[1],
		"HTML in Eingaben: Team-Mail escaped, Kunden-Mail ohne Nachricht")
	spam = fmt.pruefe_kontakt({**KONTAKT, "vorname": "Gewinn", "nachname": "jetzt auf www.betrug.example"})
	pruefe("Guten Tag," in fmt.kunden_mail_kontakt(spam)[1] and "betrug" not in fmt.kunden_mail_kontakt(spam)[1],
		"Anrede-Härtung: Domain im Namen -> „Guten Tag,“")
	pruefe(d["telefon"] == "+436641234567", "Telefon als E.164 gespeichert")
	ohne = fmt.pruefe_kontakt({**KONTAKT, "telefon": ""})
	pruefe(ohne["telefon"] == "", "Telefon optional (Kontaktformular, A08)")
	pruefe(wirft(fmt.pruefe_kontakt, {**KONTAKT, "telefon": "", "rueckruf_ok": 1}, enthaelt="Telefonnummer"),
		"mit Rückrufwunsch ist Telefon Pflicht")
	pruefe(wirft(fmt.pruefe_kontakt, {**KONTAKT, "telefon": "------"}, enthaelt="Telefon"), "„------“ ist keine Telefonnummer")
	info = fmt.pruefe_kontakt({**KONTAKT, "einwilligung": 0, "einwilligung_id": "kontakt-info", "einwilligung_version": "1"})
	pruefe(info["einwilligung"] == 1 and info["einwilligung_id"] == "kontakt-info" and info["einwilligung_text_version"] == "1",
		"Hinweistext (…-info, lit. b) ersetzt das Pflicht-Häkchen; Kennung und Version gespeichert")
	z = fmt.pruefe_kontakt({**KONTAKT, "firma": "Huber GmbH", "zeitplan": "So bald wie möglich", "jahresverbrauch": "100–500 MWh",
		"rueckruf_ok": 1, "rolle": "Hacker", "segment": "gewerbe"})
	pruefe(z["firma"] == "Huber GmbH" and z["zeitplan"] == "So bald wie möglich" and z["jahresverbrauch"] == "100–500 MWh"
		and z["rueckruf_ok"] == 1 and z["rolle"] == "" and z["segment"] == "Gewerbe & Industrie",
		"Vertriebsfelder nach Whitelist (unbekannte Rolle verworfen, Segment-Schlüssel übersetzt)")
	pruefe(fmt.pruefe_kontakt({**KONTAKT, "quelle": "/" + "a" * 230})["quelle"] == "/" + "a" * 230, "quelle bis 255 Zeichen (Website 200)")

	pruefe(fmt.ist_honeypot({**KONTAKT, "website": "http://spam"}), "Honeypot „website“ erkannt")
	pruefe(not fmt.ist_honeypot(KONTAKT), "leerer Honeypot = echte Anfrage")
	pruefe(fmt.pruefe_kontakt({**KONTAKT, "plz": "86842"})["plz"] == "86842", "PLZ 5-stellig erlaubt")
	pruefe(fmt.pruefe_kontakt({**KONTAKT, "plz": "", "strasse_hausnummer": ""})["plz"] == "", "PLZ/Straße leer erlaubt (Award, Sponsoring)")
	pruefe(wirft(fmt.pruefe_kontakt, {**KONTAKT, "plz": "512"}, enthaelt="Postleitzahl"), "PLZ 3-stellig -> Meldung")
	pruefe(wirft(fmt.pruefe_kontakt, {**KONTAKT, "plz": "A-5121"}, enthaelt="Postleitzahl"), "PLZ mit Buchstaben -> Meldung")
	pruefe(wirft(fmt.pruefe_kontakt, {**KONTAKT, "vorname": " "}, enthaelt="Vornamen"), "Vorname Pflicht")
	pruefe(wirft(fmt.pruefe_kontakt, {**KONTAKT, "email": "anna@"}, enthaelt="E-Mail"), "ungültige E-Mail -> Meldung")
	pruefe(wirft(fmt.pruefe_kontakt, {**KONTAKT, "telefon": "123"}, enthaelt="Telefon"), "Telefon zu kurz -> Meldung")
	pruefe(wirft(fmt.pruefe_kontakt, {**KONTAKT, "einwilligung": 0}, enthaelt="Datenschutz"), "Einwilligung Pflicht")
	pruefe(wirft(fmt.pruefe_kontakt, {**KONTAKT, "nachname": "x" * 81}, enthaelt="zu lang"), "Nachname > 80 Zeichen -> Meldung")
	lang = "a" * 8000 + "\n\n—\n[Herkunft] Kanal: Direkt"
	pruefe(fmt.pruefe_kontakt({**KONTAKT, "nachricht": lang})["herkunft_kanal"] == "Direkt", "8.000 Zeichen + Herkunftszeile erlaubt")
	pruefe(wirft(fmt.pruefe_kontakt, {**KONTAKT, "nachricht": "a" * 8001}, enthaelt="zu lang"), "Nachricht > 8.000 Zeichen -> Meldung")


ANGEBOT = {
	"vorhaben": ["pv", "speicher", "unbekannt"],
	"gebaeudetyp": "Gewerbe / Industrie",
	"eigentuemer": "Eigentümer",
	"dachform": "flach",
	"dachausrichtung": "Ost-West",
	"jahresverbrauch_kwh": 120000,
	"startzeitpunkt": "In 3–6 Monaten",
	"vorname": "Max",
	"nachname": "Berger",
	"email": "max@berger.at",
	"telefon": "0664/1234567",
	"plz": "4020",
	"ort": "Linz",
	"einwilligung": 1,
	"ergebnis": {
		"berechnungsbasis_kwh": 120000, "anlagengroesse_kwp": 99.5, "speicher_kwh": 0, "jahresertrag_kwh": 104475,
		"autarkie_prozent": None, "vorteil_pro_jahr": None, "investition_von": None, "investition_bis": None,
		"amortisation_jahre": None, "angaben": "Objekt: Gewerbe\n\n—\n[Herkunft] Kanal: Suchmaschine · Quelle: google",
	},
	"nachricht": "Objekt: Gewerbe\n\n—\n[Herkunft] Kanal: Suchmaschine · Quelle: google",
	"website": "",
	"ip_adresse": "2001:db8::1",
}


def teste_angebot():
	print("\n#5 submit_angebot")
	d = fmt.pruefe_angebot(ANGEBOT)
	pruefe(json.loads(d["vorhaben"]) == ["pv", "speicher"], "vorhaben als JSON, nur erlaubte Werte")
	pruefe(d["anlagengroesse_kwp"] == 99.5 and d["autarkie_prozent"] is None, "ergebnis-Felder einzeln, null bleibt null")
	pruefe(json.loads(d["ergebnis_json"])["investition_von"] is None, "ergebnis_json behält null (Gewerbe)")
	pruefe(d["jahresverbrauch_kwh"] == 120000.0, "jahresverbrauch_kwh als Zahl")
	pruefe(d["herkunft_kanal"] == "Suchmaschine", "Herkunft aus nachricht")
	pruefe(fmt.pruefe_angebot({**ANGEBOT, "vorhaben": '["wallbox"]'})["vorhaben"] == '["wallbox"]', "vorhaben auch als JSON-Text")
	pruefe(wirft(fmt.pruefe_angebot, {**ANGEBOT, "vorhaben": []}, enthaelt="Vorhaben"), "ohne Vorhaben -> Meldung")
	pruefe(wirft(fmt.pruefe_angebot, {**ANGEBOT, "plz": ""}, enthaelt="Postleitzahl"), "PLZ Pflicht im Konfigurator")
	pruefe(wirft(fmt.pruefe_angebot, {**ANGEBOT, "ort": ""}, enthaelt="Ort"), "Ort Pflicht im Konfigurator")
	privat = {**ANGEBOT, "ergebnis": {**ANGEBOT["ergebnis"], "investition_von": 18000, "investition_bis": 23000, "amortisation_jahre": 9.4}}
	betreff, html = fmt.kunden_mail_angebot(fmt.pruefe_angebot(privat), "AA-2026-00042")
	pruefe("18.000 – 23.000 €" in html and "9,4 Jahre" in html, "Kunden-Mail zeigt Richtwerte im deutschen Format")
	pruefe("[Herkunft]" not in html and "Suchmaschine" not in html, "Kunden-Mail OHNE Herkunftszeile")
	pruefe(betreff == "Ihre Angebotsanfrage AA-2026-00042", "Betreff „Ihre Angebotsanfrage AA-2026-00042“")
	pruefe("Linz" not in html and "Gewerbe / Industrie" not in html and "So geht es weiter" in html,
		"Kunden-Mail ohne Freitext (Ort, Gebäudetyp-Text), mit „So geht es weiter“")
	g = fmt.pruefe_angebot({**ANGEBOT, "objekt": "gewerbe", "netzebene": "5", "lastgang": "ja", "flaeche_m2": 2500, "kwp_wunsch": 400,
		"zeitplan": "In den nächsten 3 Monaten", "rolle": "Finanzen", "gremium": ["Hausbank", "Erfunden", "Hausbank"], "zweck": "angebot",
		"thema": "lastgang", "bezug": "ak-20261011-7f3k", "firma": "Berger GmbH", "telefon": "", "rueckruf_ok": 0,
		"lastgang_kennzahlen": {"jahresverbrauch_kwh": 820000, "grundlast_kw": 40, "monatsspitzen_kw": [210] * 14, "rohdaten": [1, 2]}})
	pruefe(g["segment"] == "Gewerbe & Industrie" and g["objekt"] == "gewerbe" and g["netzebene"] == "5" and g["lastgang_vorhanden"] == 1,
		"Angebot: Segment aus objekt, Netzebene, Lastgang")
	pruefe(g["flaeche_m2"] == 2500.0 and g["kwp_wunsch"] == 400.0 and g["gremium"] == "Hausbank" and g["bezug"] == "AK-20261011-7F3K",
		"Angebot: Fläche/kWp als Zahl, Gremium nach Whitelist ohne Duplikate, bezug geprüft")
	kz = json.loads(g["lastgang_kennzahlen"])
	pruefe(kz["jahresverbrauch_kwh"] == 820000 and len(kz["monatsspitzen_kw"]) == 12 and "rohdaten" not in kz,
		"Lastgang-Kennzahlen: nur bekannte Kennzahlen, 12 Monatsspitzen, keine Rohdaten")
	pruefe(g["telefon"] == "", "Angebot: Telefon optional (Variante ohne Telefon)")
	pruefe(fmt.pruefe_angebot(ANGEBOT)["zeitplan"] == "In 3–12 Monaten", "Zeitplan aus startzeitpunkt-Klartext („In 3–6 Monaten“)")
	gb, gh = fmt.kunden_mail_angebot(g, "AA-2026-00043")
	pruefe("Zählpunktnummer" in gh and "Berger GmbH" not in gh, "Angebot Gewerbe: Unterlagen-Checkliste, Firma nicht gespiegelt")
	_b, team = fmt.team_mail_angebot(d, "https://x/app/angebotsanfrage/AA-2026-00001")
	pruefe("Photovoltaik-Anlage, Stromspeicher" in team and "Suchmaschine" in team, "Team-Mail mit Vorhaben-Labels und Herkunft")


def teste_solarrechner():
	print("\n#8 submit_solarrechner")
	form = {"kunden_name": "Eva Maier", "email": "eva@maier.at", "telefon": "+43 660 7654321", "plz": "5121",
		"ip_adresse": "203.0.113.20", "quelle": "/solarrechner"}
	d = fmt.pruefe_solarrechner(form)
	pruefe(d["quelle"] == "/solarrechner" and d["plz"] == "5121", "Formularfelder übernommen, PLZ 4-stellig ok")
	pruefe(wirft(fmt.pruefe_solarrechner, {**form, "plz": "512"}, enthaelt="Postleitzahl"), "PLZ ungültig -> Meldung")
	pruefe(wirft(fmt.pruefe_solarrechner, {**form, "kunden_name": "E"}, enthaelt="Namen"), "Name Pflicht (min. 2 Zeichen)")
	pdf = b"%PDF-1.7\n" + b"0" * 100
	name = fmt.pruefe_pdf("Oekovolt-PV-Analyse-PVA-2026-3F9A1C.pdf", "application/pdf", pdf)
	pruefe(name == "Oekovolt-PV-Analyse-PVA-2026-3F9A1C.pdf", "Dateiname bleibt erhalten")
	pruefe(fmt.analyse_referenz(name) == "PVA-2026-3F9A1C", "Analyse-Referenz aus Dateiname")
	pruefe(fmt.pruefe_pdf("../../etc/passwd", "application/pdf", pdf) == "passwd.pdf", "Pfadanteile im Dateinamen entfernt")
	pruefe(wirft(fmt.pruefe_pdf, "a.pdf", "image/png", pdf, enthaelt="nur PDF"), "nur application/pdf")
	pruefe(wirft(fmt.pruefe_pdf, "a.pdf", "application/pdf", b"GIF89a", enthaelt="kein gültiges PDF"), "Inhalt muss mit %PDF- beginnen")
	pruefe(wirft(fmt.pruefe_pdf, "a.pdf", "application/pdf", b"%PDF-" + b"0" * (10 * 1024 * 1024), enthaelt="zu groß"), "max. 10 MB")
	pruefe(wirft(fmt.pruefe_pdf, "a.pdf", "application/pdf", b"", enthaelt="fehlt"), "leere Datei -> Meldung")
	betreff, html = fmt.kunden_mail_solarrechner({**d, "analyse_referenz": "PVA-2026-3F9A1C"})
	pruefe("PVA-2026-3F9A1C" in html and "Guten Tag Eva Maier," in html, "Kunden-Mail mit Referenz und Anrede")
	pruefe("PVA-2026-3F9A1C" in betreff and "Termin wählen" in html, "Referenz im Betreff, neutraler Terminlink")
	pruefe(d["telefon"] == "+436607654321", "Solarrechner: Telefon als E.164")
	h = fmt.pruefe_solarrechner({**form, "herkunft": "[Herkunft] Kanal: Anzeige · Quelle: google · Einstieg: /gewerbe"})
	pruefe(h["herkunft_kanal"] == "Anzeige" and h["utm_source"] == "google" and h["einstiegsseite"] == "/gewerbe",
		"Solarrechner: herkunft_felder aus der Herkunftszeile")


RECHNER_LEAD = {
	"kennung": "gewerbe-pv",
	"aktion": "pdf",
	"vorname": "Lena",
	"nachname": "Gruber",
	"email": "Lena.Gruber@Example.at",
	"telefon": "0664 1112223",
	"kontakt_ok": 0,
	"plz": "5121",
	"firma": "Gruber Metall GmbH",
	"rolle": "Geschäftsführung/Inhaber",
	"mappe_rollen": ["Bank", "Geschäftsführung", "Unsinn"],
	"einwilligung_id": "leadgate-info",
	"einwilligung_version": "1",
	"ergebnis": {"kwp": 420, "untertitel": "CO₂-Bilanz Gruber Metall GmbH"},
	"ergebnis_text": "420 kWp, Eigenverbrauch 78 %",
	"ergebnis_link": "/rechner/gewerbe-pv?r=abc123",
	"rueckkehr": "/rechner/gewerbe-pv",
	"bestaetigung": "double-opt-in",
	"quelle": "/rechner/gewerbe-pv",
	"herkunft": "[Herkunft] Kanal: Suchmaschine · Quelle: google · Einstieg: /gewerbe",
	"utm_content": "anzeige-a",
	"website": "",
	"ip_adresse": "203.0.113.30",
}


def teste_vertrieb():
	print("\nVertrieb (A11): Scoring, PLZ, Schlüssel, Telefon, Anrede, Rechnernamen")
	g = fmt.SCORE_GEWICHTE
	pruefe(g["fit_max"] == 50 and g["absicht_max"] == 35 and g["engagement_max"] == 15 and g["klasse_a"] == 70 and g["klasse_b"] == 45,
		"SCORE_GEWICHTE: Fit 50, Absicht 35, Engagement 15, A ≥ 70, B ≥ 45 (eine Konstante)")
	top = {"segment": "Gewerbe & Industrie", "jahresverbrauch_kwh": 800_000, "netzebene": "5", "eigentuemer": "Ja, Eigentümer",
		"zeitplan": "So bald wie möglich", "lastgang_vorhanden": 1, "firma": "X GmbH", "rolle": "Geschäftsführung/Inhaber",
		"fruehere_anfragen_anzahl": 1, "rechner": "gewerbe-pv", "einstiegsseite": "/gewerbe/hallendach"}
	score, klasse, gruende = fmt.lead_score(top, "termin")
	pruefe(score == 98 and klasse == "A", f"Maximal-Lead -> 48 + 35 + 15 = 98 Punkte, Klasse A (ist {score}/{klasse})")
	pruefe(any("Fit 48" in x and "Absicht 35" in x and "Engagement 15" in x for x in gruende), "Absicht auf 35 gekappt (40 Rohpunkte), Teilsummen begründet")
	score, klasse, _g = fmt.lead_score({"segment": "Gewerbe & Industrie", "jahresverbrauch_kwh": 600_000, "zeitplan": "So bald wie möglich",
		"firma": "X", "netzebene": "6"}, "konfigurator")
	pruefe(score == 20 + 15 + 8 + 15 + 5 + 8 and klasse == "A", f"B2B 20 + ≥500 MWh 15 + NE6 8 + ASAP 15 + Firma 5 + Konfigurator 8 = 71 -> A (ist {score})")
	score, klasse, _g = fmt.lead_score({"segment": "Gewerbe & Industrie", "jahresverbrauch_kwh": 150_000, "zeitplan": "In 3–12 Monaten"}, "kontakt")
	pruefe(score == 20 + 10 + 6 + 4 and klasse == "C", f"100–500 MWh 10, 3–12 Monate 6, Kontakt 4 -> 40 = C (ist {score})")
	score, klasse, _g = fmt.lead_score({"segment": "Chalet & Premium", "zeitplan": "In den nächsten 3 Monaten", "fruehere_anfragen_anzahl": 2,
		"einstiegsseite": "/chalets"}, "termin")
	pruefe(score == 44 and klasse == "C", f"Chalet 12 + ≤3 Monate 12 + Termin 10 + Wiederkehr 5 + Zielgruppenseite 5 = 44 -> C (ist {score}/{klasse})")
	score, klasse, _g = fmt.lead_score({"segment": "Privat", "zeitplan": "Später / Budgetplanung"}, "rechner")
	pruefe(score == 5 + 2 + 4 and klasse == "C", f"Privat 5 + später 2 + Rechner 4 = 11 -> C (ist {score})")
	pruefe(fmt.lead_score({"jahresverbrauch": "500–2.000 MWh", "segment": "landwirtschaft"}, "kontakt")[0] == 20 + 15 + 4,
		"Kontakt-Chip „500–2.000 MWh“ zählt 15, Segment-Schlüssel „landwirtschaft“ = B2B")
	pruefe(fmt.lead_score({"lastgang_kennzahlen": json.dumps({"jahresverbrauch_kwh": 120_000})}, "rechner")[0] == 10 + 5 + 4,
		"Verbrauch aus Lastgang-Kennzahlen (10) + Lastgang (5) + Rechner (4)")
	pruefe(fmt.lead_score({"startzeitpunkt": "So bald wie möglich"}, "konfigurator")[0] == 15 + 8, "Zeitplan auch aus startzeitpunkt")
	pruefe(fmt.lead_score({"eigentuemer": "Nein – Miete oder Pacht"}, "kontakt")[0] == 4, "„Nein – Miete oder Pacht“ ist kein Eigentümer")
	vorbelegt = {"zeitplan": "In den nächsten 3 Monaten", "startzeitpunkt": "In den nächsten 3 Monaten",
		"eigentuemer": "Ja, Eigentümer", "jahresverbrauch_kwh": 250000}
	pruefe(fmt.lead_score(vorbelegt, "konfigurator")[0] == 12 + 5 + 10 + 8, "Kundenangaben Zeitplan/Eigentümer/Verbrauch zählen")
	pruefe(fmt.lead_score({**vorbelegt, "vorbelegt": ["zeitplan", "startzeitpunkt", "eigentuemer", "jahresverbrauch_kwh"]},
		"konfigurator")[0] == 8, "vorbelegte Startwerte (Feld `vorbelegt`) zählen nicht im Scoring")
	ohne = fmt.pruefe_angebot({**ANGEBOT, **vorbelegt, "vorbelegt": "zeitplan,startzeitpunkt,eigentuemer,jahresverbrauch_kwh,email"})
	pruefe(ohne["zeitplan"] == "" and ohne["startzeitpunkt"] == "" and ohne["eigentuemer"] == "" and ohne["jahresverbrauch_kwh"] is None
		and bool(ohne["email"]), "submit_angebot: vorbelegte Felder nicht gespeichert, andere Felder (email) nicht abwählbar")
	pruefe(fmt.lead_score({"rolle": "Finanzen"}, "pdf-analyse")[0] == 5 + 6, "Rolle Finanzen +5, PDF-Analyse 6")
	pruefe(fmt.lead_score({"rechner": "scan-dach"}, "rechner")[0] == 10, "Rechner-Kennung „scan…“ zählt als Scan (10)")
	pruefe(fmt.lead_score({"einstiegsseite": "/gewerbespeicher"}, "x")[0] == 5 and fmt.lead_score({"einstiegsseite": "/gewerbe-irgendwas"}, "x")[0] == 0,
		"Zielgruppenseite nur exakt bzw. als Unterseite")
	pruefe(fmt.lead_score({"rechner": "solarrechner"}, "rechner")[0] == 4, "Solarrechner ist kein Gewerbe-Rechner")
	for spur in ("Service", "Bewerbung", "Presse"):
		s_, k_, gr = fmt.lead_score({"segment": spur, "jahresverbrauch_kwh": 900_000, "zeitplan": "So bald wie möglich"}, "termin")
		pruefe(s_ == 0 and k_ == "C" and "Eigene Spur" in gr[0], f"Segment {spur}: eigene Spur, kein Scoring")
	pruefe(fmt.lead_score({}, "unbekannt") == (0, "C", ["Summe 0 (Fit 0, Absicht 0, Engagement 0)"]), "leere Daten -> 0 Punkte, C")
	pruefe(fmt.lead_klasse(70) == "A" and fmt.lead_klasse(69) == "B" and fmt.lead_klasse(45) == "B" and fmt.lead_klasse(44) == "C", "Klassengrenzen 70/45")

	plz = {
		"5121": "Oberösterreich", "5020": "Salzburg", "5280": "Oberösterreich", "5101": "Salzburg", "5162": "Salzburg",
		"5166": "Oberösterreich", "5202": "Salzburg", "5230": "Oberösterreich", "5310": "Oberösterreich", "5360": "Oberösterreich",
		"5340": "Salzburg", "1010": "Wien", "1300": "Niederösterreich", "2340": "Niederösterreich", "2425": "Burgenland",
		"3335": "Oberösterreich", "3100": "Niederösterreich", "4020": "Oberösterreich", "4300": "Niederösterreich",
		"6020": "Tirol", "6900": "Vorarlberg", "6691": "Tirol", "7000": "Burgenland", "8010": "Steiermark", "8380": "Burgenland",
		"9020": "Kärnten", "9900": "Tirol", "A-5121": "Oberösterreich",
	}
	falsch = {k: (fmt.bundesland_aus_plz(k), v) for k, v in plz.items() if fmt.bundesland_aus_plz(k) != v}
	pruefe(not falsch, f"bundesland_aus_plz: Bereichstabelle statt erster Ziffer (5121 Ostermiething = OÖ) {falsch or ''}")
	pruefe(fmt.bundesland_aus_plz("86842") is None and fmt.bundesland_aus_plz("") is None and fmt.bundesland_aus_plz("51a1") is None,
		"5-stellige (DE) oder ungültige PLZ -> None")
	pruefe(set(v for _a, _b, v in fmt.PLZ_BEREICHE) == set(fmt.BUNDESLAENDER), "PLZ-Tabelle nutzt genau die neun Bundesländer")

	pruefe(fmt.lead_schluessel(" Anna.Huber@Example.AT ") == "anna.huber@example.at", "lead_schluessel: klein, getrimmt")
	pruefe(fmt.lead_schluessel("a.n.na+pv@googlemail.com") == "anna@gmail.com", "lead_schluessel: Gmail ohne Punkte/+Zusatz")
	pruefe(fmt.lead_schluessel("kein-mail") is None and fmt.lead_schluessel(None) is None, "lead_schluessel: ungültig -> None")
	tel = {"0664 1234567": "+436641234567", "+43 (0) 6278 71030": "+43627871030", "0049 89 1234567": "+49891234567",
		"+39 0471 123456": "+390471123456", "------": None, "123": None, "0664abc1234": None, "": None, "0900 123456": None}
	falsch = {k: fmt.telefon_e164(k) for k, v in tel.items() if fmt.telefon_e164(k) != v}
	pruefe(not falsch, f"telefon_e164: AT/DE/CH wie Website, Ausland mit Vorwahl, Müll/Mehrwert -> None {falsch or ''}")

	anrede = {("Anna", "Huber"): "Anna Huber", ("Jean-Luc", "O'Neill"): "Jean-Luc O'Neill", ("Zoë", "Müller-Lüdenscheidt"): "Zoë Müller-Lüdenscheidt",
		("Max", "www.spam.example"): "", ("Klick", "https://x.y"): "", ("Max", "Muster.at"): "", ("<b>Max</b>", ""): "",
		("Max", "Mustermann 2"): "", ("A" * 40, "B" * 25): "", ("", ""): ""}
	falsch = {k: fmt.anrede_name(*k) for k, v in anrede.items() if fmt.anrede_name(*k) != v}
	pruefe(not falsch, f"Anrede-Härtung: Buchstaben/Leerzeichen/Bindestrich/Apostroph, ≤ 60, keine Domains {falsch or ''}")
	pruefe(fmt._anrede("Max", "Muster.at") == "Guten Tag," and fmt._anrede("Anna", "Huber") == "Guten Tag Anna Huber,", "Fallback „Guten Tag,“")

	pruefe(fmt.rechner_name("gewerbe-pv") == "Gewerbe-PV-Rechner" and fmt.rechner_name("neu-2027") == "Ihr Rechenergebnis"
		and fmt.rechner_name("<script>") == "Ihr Rechenergebnis" and fmt.rechner_kennung("Gewerbe PV") == "",
		"RECHNER_NAMEN: bekannte Kennung -> Name, unbekannte (^[a-z0-9-]{2,40}$) -> „Ihr Rechenergebnis“, nie Freitext")
	leadrechner = (APP.parents[2] / "src" / "data" / "leadRechner.js")
	if leadrechner.exists():
		js = set(re.findall(r'kennung: "([a-z0-9-]+)"', leadrechner.read_text(encoding="utf-8")))
		pruefe(js <= set(fmt.RECHNER_NAMEN), f"RECHNER_NAMEN deckt alle Kennungen aus src/data/leadRechner.js ab {sorted(js - set(fmt.RECHNER_NAMEN)) or ''}")


def teste_rechner_lead():
	print("\n#17–#19 Rechner Lead und Double-Opt-in")
	from datetime import datetime, timedelta
	d = fmt.pruefe_rechner_lead(RECHNER_LEAD)
	pruefe(d["rechner"] == "gewerbe-pv" and d["rechner_name"] == "Gewerbe-PV-Rechner" and d["aktion"] == "pdf", "Kennung, Werkzeugname, Aktion")
	pruefe(d["email"] == "lena.gruber@example.at" and d["telefon"] == "", "Telefon ohne Häkchen kontakt_ok NICHT gespeichert")
	mit = fmt.pruefe_rechner_lead({**RECHNER_LEAD, "kontakt_ok": 1})
	pruefe(mit["telefon"] == "+436641112223" and mit["kontakt_ok"] == 1, "mit kontakt_ok: Telefon als E.164")
	pruefe(wirft(fmt.pruefe_rechner_lead, {**RECHNER_LEAD, "kontakt_ok": 1, "telefon": "------"}, enthaelt="Telefon"), "ungültiges Telefon mit Häkchen -> Meldung")
	pruefe(fmt.pruefe_rechner_lead({**RECHNER_LEAD, "kontakt_ok": 1, "telefon": ""})["telefon"] == "", "Telefon bleibt optional, auch mit Häkchen")
	pruefe(wirft(fmt.pruefe_rechner_lead, {**RECHNER_LEAD, "kennung": "Gewerbe PV!"}, enthaelt="Werkzeug"), "Kennung im falschen Format -> Meldung")
	pruefe(wirft(fmt.pruefe_rechner_lead, {**RECHNER_LEAD, "email": ""}, enthaelt="E-Mail") and wirft(fmt.pruefe_rechner_lead, {**RECHNER_LEAD, "nachname": ""}, enthaelt="Nachnamen"),
		"Pflicht: Name und E-Mail")
	pruefe("einwilligung" not in d and d["einwilligung_id"] == "leadgate-info", "keine Pflicht-Einwilligung; Hinweistext-Kennung gespeichert")
	pruefe(d["mappe_rollen"] == "Bank\nGeschäftsführung" and d["segment"] == "Gewerbe & Industrie", "Bericht-Rollen nach Whitelist, Segment aus Kennung")
	kennungen = fmt.pruefe_rechner_lead({**RECHNER_LEAD, "mappe_rollen": "gf, cfo, technik, bank, esg"})["mappe_rollen"]
	pruefe(kennungen == "Geschäftsführung\nFinanzen/CFO\nTechnik/Facility\nBank\nESG/Betriebsrat",
		"Bericht-Rollen als Website-Kennungen (gf, cfo …, Komma-Text) -> Anzeigenamen")
	pruefe(fmt.pruefe_rechner_lead({**RECHNER_LEAD, "mappe_rollen": ["gemeinderat", "Gemeinderat", "x"]})["mappe_rollen"] == "Gemeinderat",
		"Kennung und Name gemischt: ohne Duplikate, Unbekanntes verworfen")
	pruefe(json.loads(d["ergebnis_json"])["kwp"] == 420 and d["ergebnis"] == "420 kWp, Eigenverbrauch 78 %", "Ergebnis als Objekt (JSON) und Text")
	pruefe(d["ergebnis_link"] == "/rechner/gewerbe-pv?r=abc123" and fmt.ergebnis_pfad("https://evil.example/x") == ""
		and fmt.ergebnis_pfad("//evil.example") == "" and fmt.ergebnis_pfad("/x'><script>") == "", "Ergebnis-/Rückkehr-Link nur als eigener Pfad")
	pruefe(d["bestaetigung_erforderlich"] == 1 and fmt.pruefe_rechner_lead({**RECHNER_LEAD, "bestaetigung": ""})["bestaetigung_erforderlich"] == 0,
		"bestaetigung „double-opt-in“ -> Bestätigung erforderlich")
	pruefe(d["herkunft_kanal"] == "Suchmaschine" and d["einstiegsseite"] == "/gewerbe" and d["utm_content"] == "anzeige-a", "Herkunft + utm_content")
	pruefe(wirft(fmt.pruefe_rechner_lead, {**RECHNER_LEAD, "ergebnis_text": "x" * 4001}, enthaelt="zu lang"), "Ergebnistext max. 4.000 Zeichen")

	# Kundenmails: kein Freitext, kein frei wählbarer Rechnername
	gefaehrlich = {**d, "rechner": "<a href=//evil>", "vorname": "Hallo", "nachname": "besuchen Sie evil.example", "firma": "Gratis-Kredit www.evil.example",
		"ergebnis": "Klicken Sie https://evil.example", "ergebnis_link": "https://evil.example"}
	for name, (betreff, html) in {
		"Bestätigung": fmt.kunden_mail_bestaetigung(gefaehrlich, fmt.bestaetigungs_link("T" * 43)),
		"Ergebnis": fmt.kunden_mail_rechner(gefaehrlich, "RL-2026-00001"),
	}.items():
		pruefe("evil" not in html and "evil" not in betreff and "Gratis-Kredit" not in html and "<a href=//" not in html,
			f"Kunden-Mail {name}: kein Freitext, kein frei wählbarer Rechnername/Link")
		pruefe("Guten Tag," in html and "Ihr Rechenergebnis" in (betreff + html), f"Kunden-Mail {name}: „Guten Tag,“ und „Ihr Rechenergebnis“")
	betreff, html = fmt.kunden_mail_rechner(d, "RL-2026-00042")
	pruefe(betreff == "Ihr Ergebnis: Gewerbe-PV-Rechner (RL-2026-00042)" and "https://www.oekovolt.com/rechner/gewerbe-pv?r=abc123" in html,
		"Ergebnis-Mail: Referenz und Werkzeug im Betreff, Ergebnis-Link")
	pruefe("Termin wählen" in html and "Zählpunktnummer" in html and "Kein Newsletter" in html and "Gruber Metall" not in html,
		"Ergebnis-Mail: neutraler Terminlink, Gewerbe-Checkliste, ohne kontakt_ok kein Vertriebskontakt, Firma nicht gespiegelt")
	pruefe("eine Ansprechperson meldet sich" in fmt.kunden_mail_rechner(mit, "RL-2026-00043")[1], "mit kontakt_ok: Ansprechperson meldet sich")
	_b, html = fmt.kunden_mail_bestaetigung(d, fmt.bestaetigungs_link("abc_DEF-123" * 4, "https://www.oekovolt.com/"))
	pruefe("https://www.oekovolt.com/freischalten?token=abc_DEF-123" in html and "24 Stunden" in html and "30 Tagen" in html
		and "/datenschutz#rechner-export" in html, "Bestätigungsmail: Link /freischalten?token=…, 24 h, Löschung nach 30 Tagen, Datenschutz")
	pruefe(fmt.website_basis("javascript:alert(1)") == "https://www.oekovolt.com" and fmt.website_basis("https://staging.oekovolt.com/") == "https://staging.oekovolt.com",
		"Website-Basis nur https://, sonst www.oekovolt.com")
	_b, team = fmt.team_mail_rechner({**d, "bestaetigt": 0}, "https://x/app/rechner-lead/RL-2026-00001")
	pruefe("Gruber Metall GmbH" in team and "Bestätigung ausstehend" in team and "Gewerbe-PV-Rechner" in team, "Team-Mail Rechner Lead (intern, mit Firma und Status)")

	# Token
	token, hashwert = fmt.token_erzeugen()
	token2, _h2 = fmt.token_erzeugen()
	pruefe(fmt.token_format_gueltig(token) and token != token2 and len(hashwert) == 64 and token not in hashwert,
		"Token: zufällig, URL-sicher; gespeichert wird nur der sha256-Hash")
	pruefe(fmt.token_hash(token) == hashwert and not fmt.token_format_gueltig("abc") and not fmt.token_format_gueltig("x' OR 1=1 --" * 4),
		"Token-Format geprüft, Hash reproduzierbar")
	jetzt = datetime(2026, 10, 12, 10, 0)
	bis = jetzt + timedelta(hours=fmt.TOKEN_GUELTIG_STUNDEN)
	pruefe(fmt.token_pruefen({"bestaetigt": 0, "token_gueltig_bis": bis}, jetzt) == "ok", "Token gültig innerhalb 24 h")
	pruefe(fmt.token_pruefen({"bestaetigt": 0, "token_gueltig_bis": str(bis)}, bis + timedelta(seconds=1)) == "abgelaufen", "Token nach 24 h abgelaufen")
	pruefe(fmt.token_pruefen({"bestaetigt": 1, "token_gueltig_bis": None}, jetzt) == "verwendet", "Token nur einmal verwendbar")
	pruefe(fmt.token_pruefen(None, jetzt) == "ungueltig" and fmt.token_pruefen({"bestaetigt": 0}, jetzt) == "ungueltig", "unbekanntes Token -> ungültig")
	pruefe(set(fmt.TOKEN_MELDUNGEN) == {"verwendet", "abgelaufen", "ungueltig"}, "Meldungen für alle Fehlzustände")
	pruefe(not fmt.erneut_senden_erlaubt(jetzt - timedelta(seconds=59), jetzt, 1) and fmt.erneut_senden_erlaubt(jetzt - timedelta(seconds=60), jetzt, 1),
		"Erneut senden frühestens nach 60 s")
	pruefe(not fmt.erneut_senden_erlaubt(None, jetzt, fmt.BESTAETIGUNG_MAX_MAILS) and fmt.erneut_senden_erlaubt(None, jetzt, 0),
		"höchstens 5 Bestätigungsmails je Lead")
	pruefe(fmt.UNBESTAETIGT_LOESCHEN_TAGE == 30, "unbestätigte Leads nach 30 Tagen löschen")
	quelle = (PAKET / "website_api" / "rechner.py").read_text(encoding="utf-8")
	pruefe("def unbestaetigte_loeschen(" in quelle and "UNBESTAETIGT_LOESCHEN_TAGE" in quelle and "token_hash(token)" in quelle
		and "token_pruefen(" in quelle and '"bestaetigt": 1' in quelle, "rechner.py: Hash-Abgleich, Ablaufprüfung, Bestätigung, Löschjob")

	# Termin-Zusatzfelder
	z = fmt.termin_zusatz({"bezug": "ak-20261011-7f3k", "einwilligung_id": "termin-info", "einwilligung_version": "1"},
		{"herkunft": "Kanal: Anzeige · Quelle: google · Einstieg: /gewerbe", "rueckruf": False, "terminart": "Video-Beratung"})
	pruefe(z["bezug"] == "AK-20261011-7F3K" and z["herkunft_kanal"] == "Anzeige" and z["einstiegsseite"] == "/gewerbe"
		and z["einwilligung_id"] == "termin-info" and z["rueckruf_ok"] == 0, "Termin: bezug, herkunft_felder, Hinweistext-Kennung")
	pruefe(fmt.termin_zusatz({"bezug": "<x>"}, {"rueckruf": True})["bezug"] == "" and fmt.termin_zusatz({}, {"rueckruf": True})["rueckruf_ok"] == 1,
		"Termin: ungültiger bezug verworfen; Rückruf = Anruf erwünscht")


def teste_kernschema():
	print("\nKernschema „Vertrieb“ in allen fünf Lead-DocTypes")
	kern = {
		"segment": "Select", "firma": "Data", "bundesland": "Select", "plz": "Data", "lead_score": "Int", "lead_klasse": "Select",
		"score_gruende": "Small Text", "eingang_am": "Datetime", "erstreaktion_am": "Datetime", "reaktionszeit_min": "Int",
		"sla_bis": "Datetime", "zustaendig": "Link", "lead_schluessel": "Data", "fruehere_anfragen": "Small Text", "rueckruf_ok": "Check",
		"kontakt_ok": "Check", "einwilligung_id": "Data", "einwilligung_text_version": "Data", "rolle": "Select", "gremium": "Small Text",
		"zeitplan": "Select", "verlustgrund": "Select",
	}
	for ordner in ("kontaktanfrage", "angebotsanfrage", "rechner_lead", "solarrechner_anfrage", "website_termin"):
		dt = lade_doctype(ordner)
		fd = {f["fieldname"]: f for f in dt["fields"]}
		falsch = {k: (fd.get(k) or {}).get("fieldtype") for k, t in kern.items() if (fd.get(k) or {}).get("fieldtype") != t}
		pruefe(not falsch, f"{dt['name']}: alle Kernfelder mit richtigem Typ {falsch or ''}")
		pruefe(fd["segment"]["options"].split("\n")[1:] == list(fmt.SEGMENTE) and fd["verlustgrund"]["options"].split("\n")[1:] == list(fmt.VERLUSTGRUENDE)
			and fd["lead_klasse"]["options"].split("\n")[1:] == ["A", "B", "C"], f"{dt['name']}: Segment-, Verlustgrund-, Klassen-Optionen")
		pruefe(fd["bundesland"]["options"].split("\n")[1:] == list(fmt.BUNDESLAENDER), f"{dt['name']}: Bundesland-Optionen = PLZ-Tabelle")
		pruefe(not any(fd[k].get("reqd") for k in kern if k != "plz"), f"{dt['name']}: alle neuen Felder optional (Website-Fallbacks kompatibel)")
		pruefe(all(fd[k].get("read_only") for k in ("lead_score", "lead_klasse", "score_gruende", "eingang_am", "sla_bis", "reaktionszeit_min")),
			f"{dt['name']}: Score/SLA-Felder schreibgeschützt")
		status = fd["status"]["options"].split("\n")
		pruefe({"Neu", "Kontaktversuch", "Qualifiziert", "Angebot erstellt", "Verhandlung", "Gewonnen", "Verloren", "Erledigt", "Spam"} <= set(status),
			f"{dt['name']}: Status-Pipeline Neu → Kontaktversuch → … → Gewonnen/Verloren/Erledigt/Spam")
		pruefe(fd["quelle"].get("length") == 255, f"{dt['name']}: quelle mit Länge 255")
		pruefe(fd["verlustgrund"].get("depends_on") == "eval:doc.status=='Verloren'", f"{dt['name']}: Verlustgrund nur bei „Verloren“")
		pruefe(dt["modified"] >= "2026-10-12", f"{dt['name']}: modified angehoben (bench migrate übernimmt das Schema)")
	for ordner in ("kontaktanfrage", "angebotsanfrage", "solarrechner_anfrage"):
		status = {f["fieldname"]: f for f in lade_doctype(ordner)["fields"]}["status"]["options"].split("\n")
		pruefe("In Bearbeitung" in status and "Termin vereinbart" in status, f"{ordner}: Altwert „In Bearbeitung“ bleibt gültig, „Termin vereinbart“ neu")
	termin = {f["fieldname"]: f for f in lade_doctype("website_termin")["fields"]}
	pruefe(set(fmt.HERKUNFT_FELDER) | {"bezug"} <= set(termin) and "Bestätigt" in termin["status"]["options"] and "Abgesagt" in termin["status"]["options"],
		"Website Termin: HERKUNFT_FELDER, bezug, Status Bestätigt/Abgesagt bleiben")
	pruefe(rechte(lade_doctype("website_termin"), "Vertrieb") >= {"read", "write", "report"}, "Website Termin: Rolle Vertrieb read/write/report")
	solar = {f["fieldname"] for f in lade_doctype("solarrechner_anfrage")["fields"]}
	pruefe(set(fmt.HERKUNFT_FELDER) | {"herkunft"} <= solar, "Solarrechner Anfrage: Herkunftsfelder")
	angebot = {f["fieldname"]: f for f in lade_doctype("angebotsanfrage")["fields"]}
	zusatz = {"objekt": "Select", "netzebene": "Select", "lastgang_vorhanden": "Check", "flaeche_m2": "Float", "kwp_wunsch": "Float", "zweck": "Select",
		"lastgang_kennzahlen": "Code"}
	pruefe(all(angebot.get(k, {}).get("fieldtype") == t for k, t in zusatz.items()), "Angebotsanfrage: objekt, netzebene, lastgang_vorhanden, flaeche_m2, kwp_wunsch, zweck, lastgang_kennzahlen")
	rl = {f["fieldname"]: f for f in lade_doctype("rechner_lead")["fields"]}
	pruefe({"bestaetigt", "bestaetigt_am", "bestaetigungs_token", "token_gueltig_bis", "utm_content"} <= set(rl)
		and rl["bestaetigungs_token"].get("hidden") == 1 and rl["bestaetigungs_token"].get("length") == 64,
		"Rechner Lead: Double-Opt-in-Felder (Token nur als versteckter Hash), utm_content")
	pruefe(lade_doctype("rechner_lead")["autoname"] == "format:RL-{YYYY}-{#####}", "Rechner Lead: Referenz RL-YYYY-#####")
	spez = (APP.parents[2] / "docs" / "FRAPPE-AT-API-SPEZIFIKATION.md").read_text(encoding="utf-8")
	fehlend = [k for k in list(kern) + ["bestaetige_lead", "sende_bestaetigung", "submit_rechner_lead", "lead_score", "bundesland_aus_plz",
		"docs/frappe-lead-routing/README.md", "docs/frappe-referenzfreigabe/README.md"] if k not in spez]
	pruefe(not fehlend, f"Spezifikation beschreibt alle neuen Felder und Methoden {fehlend or ''}")


# ---------------------------------------------------------------- statische Prüfung der App

def lade_doctype(ordner):
	return json.loads((DOCTYPES / ordner / f"{ordner}.json").read_text(encoding="utf-8"))


def rechte(dt, rolle):
	for p in dt["permissions"]:
		if p["role"] == rolle:
			return {k for k, v in p.items() if k != "role" and v}
	return set()


def teste_doctypes():
	print("\nDocTypes")
	namen = {
		"projekt": ("Projekt", "Projekt"),
		"projekt_bild": ("Projekt Bild", "ProjektBild"),
		"referenzkarte_einstellungen": ("Referenzkarte Einstellungen", "ReferenzkarteEinstellungen"),
		"kontaktanfrage": ("Kontaktanfrage", "Kontaktanfrage"),
		"angebotsanfrage": ("Angebotsanfrage", "Angebotsanfrage"),
		"solarrechner_anfrage": ("Solarrechner Anfrage", "SolarrechnerAnfrage"),
		"rechner_lead": ("Rechner Lead", "RechnerLead"),
	}
	dts = {}
	for ordner, (name, klasse) in namen.items():
		dt = lade_doctype(ordner)
		dts[ordner] = dt
		feldnamen = [f["fieldname"] for f in dt["fields"]]
		ok = (
			dt["name"] == name and dt["module"] == "Oekovolt App" and dt["field_order"] == feldnamen
			and len(set(feldnamen)) == len(feldnamen) and (DOCTYPES / ordner / "__init__.py").exists()
			and f"class {klasse}(Document)" in (DOCTYPES / ordner / f"{ordner}.py").read_text(encoding="utf-8")
		)
		pruefe(ok, f"{name}: Modul, field_order, Controller-Klasse {klasse}, __init__.py")

	felder = lambda o: {f["fieldname"]: f for f in dts[o]["fields"]}  # noqa: E731
	p = felder("projekt")
	spez_projekt = {"projekt_name", "projekt_website_name", "veroeffentlicht", "leistung", "leistung_label", "jahr", "ort", "plz",
		"land", "objekt", "dach", "bild", "bild_alt", "bilder", "modul", "wechselrichter", "speicher", "ertrag", "latitude", "longitude"}
	pruefe(spez_projekt <= set(p), "Projekt hat alle Felder aus Spezifikation Abschnitt 2")
	pruefe(set(fmt.DB_FELDER_DETAIL) - {"name", "modified"} <= set(p), "alle von projekte.py gelesenen Felder existieren")
	pruefe(p["projekt_website_name"].get("unique") == 1 and p["projekt_name"].get("reqd") == 1, "projekt_website_name eindeutig, projekt_name Pflicht")
	pruefe(p["objekt"]["options"].split("\n")[1:] == ["Gewerbe", "Landwirtschaft", "Einfamilienhaus"], "objekt: Gewerbe/Landwirtschaft/Einfamilienhaus")
	pruefe(p["bild"]["fieldtype"] == "Attach Image" and p["bilder"]["options"] == "Projekt Bild", "bild Attach Image, bilder -> Projekt Bild")
	kunde = {"website_url", "branche", "portraet", "portraet_quellen", "zitat", "zitat_person", "freigabe_zitat", "freigabe_logo", "logo"} | SPEZ_SOCIAL
	pruefe(kunde <= set(p), "Projekt hat die Kundenbühnen-Felder")
	pruefe(all(p[u].get("options") == "URL" for u in {"website_url"} | SPEZ_SOCIAL), "URL-Felder mit options=URL")
	pruefe(p["logo"]["fieldtype"] == "Attach Image" and p["freigabe_logo"]["fieldtype"] == "Check" and p["freigabe_zitat"]["fieldtype"] == "Check",
		"logo Attach Image, Freigaben als Check")
	pruefe(dts["projekt"].get("make_attachments_public") == 1, "Projekt-Anhänge öffentlich (make_attachments_public)")
	pruefe(dts["projekt_bild"].get("istable") == 1 and felder("projekt_bild")["bild"]["fieldtype"] == "Attach Image", "Projekt Bild ist Tabelle mit Attach Image")
	e = felder("referenzkarte_einstellungen")
	pruefe(dts["referenzkarte_einstellungen"].get("issingle") == 1
		and {"firmensitz_name", "latitude", "longitude", "beschreibung", "umkreis_km"} <= set(e)
		and e["umkreis_km"].get("default") == "100", "Referenzkarte Einstellungen: Single, Felder, umkreis_km Standard 100")

	for ordner, pruef, beispiel in (
		("kontaktanfrage", fmt.pruefe_kontakt, KONTAKT),
		("angebotsanfrage", fmt.pruefe_angebot, ANGEBOT),
		("solarrechner_anfrage", fmt.pruefe_solarrechner, {"kunden_name": "Eva", "email": "e@x.at", "telefon": "0664123456", "plz": "5121"}),
		("rechner_lead", fmt.pruefe_rechner_lead, RECHNER_LEAD),
	):
		gespeichert = set(pruef(beispiel)) | {"status", "ip_adresse"}
		if ordner == "solarrechner_anfrage":
			gespeichert |= {"analyse_referenz", "pdf"}
		if ordner == "rechner_lead":
			gespeichert |= {"bestaetigungs_token", "token_gueltig_bis", "bestaetigung_gesendet_am", "bestaetigung_anzahl", "bestaetigt", "bestaetigt_am"}
		fehlend = gespeichert - set(felder(ordner))
		pruefe(not fehlend, f"{dts[ordner]['name']}: jedes gespeicherte Feld existiert {sorted(fehlend) if fehlend else ''}")
	pruefe(felder("solarrechner_anfrage")["pdf"]["fieldtype"] == "Attach", "Solarrechner Anfrage: pdf als Anhang")
	pruefe(felder("angebotsanfrage")["ergebnis_json"]["fieldtype"] == "Code", "Angebotsanfrage: ergebnis_json")

	print("\nLöschfrist (Datenschutz)")
	from datetime import date
	pruefe(fmt.loeschstichtag(date(2026, 9, 30), 24) == date(2024, 9, 30), "Stichtag 24 Monate")
	pruefe(fmt.loeschstichtag(date(2026, 3, 31), 1) == date(2026, 2, 28) and fmt.loeschstichtag(date(2024, 3, 31), 1) == date(2024, 2, 29),
		"Stichtag am Monatsende (Schaltjahr)")
	pruefe(fmt.loeschfrist_monate(None) == 24 and fmt.loeschfrist_monate("36") == 36 and fmt.loeschfrist_monate(0) == 24,
		"Frist per site_config überschreibbar, Standard 24")
	ordner_von = {"Kontaktanfrage": "kontaktanfrage", "Angebotsanfrage": "angebotsanfrage", "Solarrechner Anfrage": "solarrechner_anfrage",
		"Rechner Lead": "rechner_lead"}
	pruefe(set(fmt.ANONYMISIEREN) == set(ordner_von), "Löschfrist gilt für alle vier Anfrage-DocTypes (inkl. Rechner Lead)")
	for dt_name, felder_leer in fmt.ANONYMISIEREN.items():
		fd = felder(ordner_von[dt_name])
		fehlend = set(felder_leer) - set(fd)
		pruefe(not fehlend, f"{dt_name}: alle zu leerenden Felder existieren {sorted(fehlend) if fehlend else ''}")
		pruefe(fd["anonymisiert"]["fieldtype"] == "Check" and all(st in fd["status"]["options"].split("\n") for st in fmt.BEHALTEN_STATUS),
			f"{dt_name}: Feld anonymisiert, alle BEHALTEN_STATUS als Status-Option vorhanden")
		pruefe({"firma", "lead_schluessel", "gremium"} <= set(felder_leer), f"{dt_name}: Firma, Lead-Schlüssel, Gremium werden geleert")
		pruefe(felder_leer.get("anonymisiert") == 1 and felder_leer.get("email") == "" and felder_leer.get("telefon") == "",
			f"{dt_name}: E-Mail/Telefon geleert, anonymisiert=1")
	pruefe(set(fmt.ANONYMISIEREN["Solarrechner Anfrage"]) >= {"kunden_name", "email", "telefon", "pdf"}, "Solarrechner: Name, E-Mail, Telefon, PDF")
	pruefe(set(fmt.ANONYMISIEREN["Rechner Lead"]) >= {"ergebnis", "ergebnis_json", "firma", "lead_schluessel", "gremium", "email"},
		"Rechner Lead: Ergebnis und JSON (enthalten Firmennamen, z. B. CO₂-Untertitel) werden geleert")
	pruefe(set(fmt.ANONYMISIEREN["Angebotsanfrage"]) >= {"ergebnis_json", "firma", "lead_schluessel", "gremium"},
		"Angebotsanfrage: ergebnis_json, Firma, Lead-Schlüssel, Gremium werden geleert")
	pruefe({"Termin vereinbart", "Verhandlung"} <= set(fmt.BEHALTEN_STATUS), "BEHALTEN_STATUS um „Termin vereinbart“ und „Verhandlung“ ergänzt")
	termin_text = (PAKET / "website_api" / "termin.py").read_text(encoding="utf-8")
	pruefe('"lead_schluessel": ""' in termin_text and '"gremium": ""' in termin_text, "Website Termin: Vertriebsfelder in der Termin-Löschfrist")
	pruefe(set(fmt.ANONYMISIEREN["Kontaktanfrage"]) >= {"vorname", "nachname", "email", "telefon", "strasse_hausnummer", "nachricht"},
		"Kontakt: Name, E-Mail, Telefon, Straße, Nachricht")
	helfer_text = (PAKET / "website_api" / "helfer.py").read_text(encoding="utf-8")
	pruefe("def anfragen_aufraeumen(" in helfer_text and '"File"' in helfer_text and "oekovolt_loeschfrist_monate" in helfer_text
		and "BEHALTEN_STATUS" in helfer_text, "helfer.anfragen_aufraeumen: Status-Ausnahme, löscht Anhänge, Frist aus site_config")

	print("\nBerechtigungen (Spezifikation Abschnitt 7)")
	for o in ("kontaktanfrage", "angebotsanfrage", "solarrechner_anfrage", "rechner_lead"):
		pruefe(rechte(dts[o], "Website API") == {"create"}, f"{dts[o]['name']}: Website API nur create")
	for o in ("projekt", "referenzkarte_einstellungen"):
		pruefe(rechte(dts[o], "Website API") == {"read"}, f"{dts[o]['name']}: Website API nur read")
	for o in ("projekt", "kontaktanfrage", "angebotsanfrage", "solarrechner_anfrage", "rechner_lead", "referenzkarte_einstellungen"):
		for rolle in ("Vertrieb", "System Manager"):
			pruefe({"read", "write", "create", "delete"} <= rechte(dts[o], rolle), f"{dts[o]['name']}: {rolle} voll")


def dekoratoren(fn):
	return [ast.unparse(d) for d in fn.decorator_list]


def teste_methoden():
	print("\nWhitelist-Methoden (exakte Pfade laut Spezifikation Abschnitt 1)")
	methoden = {
		"oekovolt_app.website_api.projekte.get_projekte": "GET",
		"oekovolt_app.website_api.projekte.get_projekt": "GET",
		"oekovolt_app.website_api.projekte.get_referenzkarte": "GET",
		"oekovolt_app.website_api.kontakt.submit_kontakt": "POST",
		"oekovolt_app.website_api.angebot.submit_angebot": "POST",
		"oekovolt_app.website_api.solarrechner.submit_solarrechner": "POST",
		"oekovolt_app.website_api.rechner.submit_rechner_lead": "POST",
	}
	for pfad, methode in methoden.items():
		modul, _p, name = pfad.rpartition(".")
		datei = APP / (modul.replace(".", "/") + ".py")
		baum = ast.parse(datei.read_text(encoding="utf-8"))
		fn = next((n for n in baum.body if isinstance(n, ast.FunctionDef) and n.name == name), None)
		ok = fn is not None
		if ok:
			deko = " ".join(dekoratoren(fn))
			erster = ast.unparse(fn.body[1] if isinstance(fn.body[0], ast.Expr) and isinstance(fn.body[0].value, ast.Constant) else fn.body[0])
			ok = f"frappe.whitelist(methods=['{methode}'])" in deko and "allow_guest" not in deko and erster == "nur_website_api()"
		pruefe(ok, f"{pfad} ({methode}, Rollenprüfung als erste Anweisung, kein Gastzugriff)")
	rechner = ast.parse((PAKET / "website_api" / "rechner.py").read_text(encoding="utf-8"))
	for name in ("sende_bestaetigung", "bestaetige_lead"):
		fn = next((n for n in rechner.body if isinstance(n, ast.FunctionDef) and n.name == name), None)
		deko = " ".join(dekoratoren(fn)) if fn else ""
		pruefe("allow_guest=True" in deko and "methods=['POST']" in deko and "rate_limit(" in deko,
			f"oekovolt_app.website_api.rechner.{name} (Gast, POST, rate_limit)")
	for modul in ("kontakt", "angebot", "solarrechner", "rechner"):
		text = (PAKET / "website_api" / f"{modul}.py").read_text(encoding="utf-8")
		pruefe("team_benachrichtigen" not in text, f"{modul}.py: keine direkte Team-Mail (kommt aus lead_eingang.after_insert, A06)")
	termin = (PAKET / "website_api" / "termin.py").read_text(encoding="utf-8")
	buchung = termin.split("def buche_termin", 1)[1].split("\ndef ", 1)[0]
	pruefe("berater_benachrichtigen(doc)" not in buchung and "fmt.termin_zusatz(d, b)" in buchung,
		"termin.buche_termin: keine Doppelmail an die Terminberatung, Zusatzfelder (bezug, Herkunft)")
	pruefe("oekovolt_keine_kundenmail" in termin, "termin.kunde_bestaetigen: Schalter oekovolt_keine_kundenmail")
	helfer = (PAKET / "website_api" / "helfer.py").read_text(encoding="utf-8")
	pruefe('ROLLE_WEB = "Website API"' in helfer and '"System Manager"' in helfer, "Rollenprüfung: Website API oder System Manager")
	projekte = (PAKET / "website_api" / "projekte.py").read_text(encoding="utf-8")
	pruefe("CACHE_SEKUNDEN = 600" in projekte and "delete_keys" in projekte, "Projekt-API: Cache 10 Minuten, Invalidierung")
	controller = (DOCTYPES / "projekt" / "projekt.py").read_text(encoding="utf-8")
	pruefe(all(f"def {m}(" in controller for m in ("on_update", "on_trash")), "Projekt: Cache leeren bei on_update/on_trash")

	print("\nApp-Gerüst")
	hooks = (PAKET / "hooks.py").read_text(encoding="utf-8")
	ns = {}
	exec(compile(hooks, "hooks.py", "exec"), ns)  # hooks.py hat keine Imports
	pruefe(ns.get("app_name") == "oekovolt_app" and ns.get("app_publisher") == "ÖKOVOLT" and ns.get("required_apps") == ["frappe"], "hooks.py: app_name, app_publisher, required_apps")
	rollen = json.loads((PAKET / "fixtures" / "role.json").read_text(encoding="utf-8"))
	web = next((r for r in rollen if r["name"] == "Website API"), {})
	pruefe(web.get("desk_access") == 0, "Fixture: Rolle „Website API“ ohne Desk-Zugriff")
	pruefe(any("Role" == f.get("dt") for f in ns.get("fixtures", [])), "hooks.py: fixtures für Role")
	pruefe("# Termin (siehe website_api/termin.py)" in hooks, "hooks.py: markierter Termin-Block")
	taeglich = ns.get("scheduler_events", {}).get("daily", [])
	pruefe(hooks.count("scheduler_events") == 1 and "oekovolt_app.website_api.helfer.anfragen_aufraeumen" in taeglich
		and "oekovolt_app.website_api.termin.loesche_alte_termine" in taeglich, "hooks.py: ein scheduler_events daily mit Termin- und Anfrage-Löschfrist")
	pruefe((PAKET / "modules.txt").read_text(encoding="utf-8").strip() == "Oekovolt App", "modules.txt = Oekovolt App")
	for init in ("__init__.py", "website_api/__init__.py", "oekovolt_app/__init__.py", "oekovolt_app/doctype/__init__.py", "config/__init__.py"):
		pruefe((PAKET / init).exists(), f"oekovolt_app/{init} vorhanden")
	pruefe(re.search(r'__version__\s*=\s*"\d+\.\d+\.\d+"', (PAKET / "__init__.py").read_text(encoding="utf-8")) is not None, "__version__ gesetzt")
	pruefe("frappe" not in sys.modules, "format.py kommt ohne Frappe aus")


if __name__ == "__main__":
	teste_format()
	teste_projekte()
	teste_projekt()
	teste_kundenbuehne()
	teste_referenzkarte()
	teste_kontakt()
	teste_angebot()
	teste_solarrechner()
	teste_vertrieb()
	teste_rechner_lead()
	teste_doctypes()
	teste_kernschema()
	teste_methoden()
	print(f"\n{ANZAHL - len(FEHLER)}/{ANZAHL} Prüfungen bestanden.")
	if FEHLER:
		print("Fehlgeschlagen:\n  - " + "\n  - ".join(FEHLER))
		sys.exit(1)
