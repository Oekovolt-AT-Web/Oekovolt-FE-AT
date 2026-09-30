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
	pruefe("Bitte um Rückruf." in html and "Huber GmbH" in html, "Kunden-Mail enthält die Nachricht")
	pruefe(not re.search(r"—\s*</td>", html), "Trennlinie „—“ vor der Herkunft fällt in der Kunden-Mail weg")
	_b, team = fmt.team_mail_kontakt(d, "https://backoffice.oekovolt.com/app/kontaktanfrage/KA-2026-00001")
	pruefe("pv-herbst" in team and "Im Backoffice öffnen" in team, "Team-Mail enthält Herkunft und Link")
	x = fmt.pruefe_kontakt({**KONTAKT, "nachricht": "<b>Hallo</b>"})
	pruefe("&lt;b&gt;" in fmt.kunden_mail_kontakt(x)[1], "HTML in Eingaben wird in Mails escaped")

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
	_b, html = fmt.kunden_mail_angebot(fmt.pruefe_angebot(privat))
	pruefe("18.000 – 23.000 €" in html and "9,4 Jahre" in html, "Kunden-Mail zeigt Richtwerte im deutschen Format")
	pruefe("[Herkunft]" not in html and "Suchmaschine" not in html, "Kunden-Mail OHNE Herkunftszeile")
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
	_b, html = fmt.kunden_mail_solarrechner({**d, "analyse_referenz": "PVA-2026-3F9A1C"})
	pruefe("PVA-2026-3F9A1C" in html and "Guten Tag Eva Maier," in html, "Kunden-Mail mit Referenz und Anrede")


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
	):
		gespeichert = set(pruef(beispiel)) | {"status", "ip_adresse"}
		if ordner == "solarrechner_anfrage":
			gespeichert |= {"analyse_referenz", "pdf"}
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
	ordner_von = {"Kontaktanfrage": "kontaktanfrage", "Angebotsanfrage": "angebotsanfrage", "Solarrechner Anfrage": "solarrechner_anfrage"}
	pruefe(set(fmt.ANONYMISIEREN) == set(ordner_von), "Löschfrist gilt für alle drei Anfrage-DocTypes")
	for dt_name, felder_leer in fmt.ANONYMISIEREN.items():
		fd = felder(ordner_von[dt_name])
		fehlend = set(felder_leer) - set(fd)
		pruefe(not fehlend, f"{dt_name}: alle zu leerenden Felder existieren {sorted(fehlend) if fehlend else ''}")
		pruefe(fd["anonymisiert"]["fieldtype"] == "Check" and all(st in fd["status"]["options"].split("\n") for st in fmt.BEHALTEN_STATUS),
			f"{dt_name}: Feld anonymisiert, Status „Angebot erstellt“/„Gewonnen“ vorhanden")
		pruefe(felder_leer.get("anonymisiert") == 1 and felder_leer.get("email") == "" and felder_leer.get("telefon") == "",
			f"{dt_name}: E-Mail/Telefon geleert, anonymisiert=1")
	pruefe(set(fmt.ANONYMISIEREN["Solarrechner Anfrage"]) >= {"kunden_name", "email", "telefon", "pdf"}, "Solarrechner: Name, E-Mail, Telefon, PDF")
	pruefe(set(fmt.ANONYMISIEREN["Kontaktanfrage"]) >= {"vorname", "nachname", "email", "telefon", "strasse_hausnummer", "nachricht"},
		"Kontakt: Name, E-Mail, Telefon, Straße, Nachricht")
	helfer_text = (PAKET / "website_api" / "helfer.py").read_text(encoding="utf-8")
	pruefe("def anfragen_aufraeumen(" in helfer_text and '"File"' in helfer_text and "oekovolt_loeschfrist_monate" in helfer_text
		and "BEHALTEN_STATUS" in helfer_text, "helfer.anfragen_aufraeumen: Status-Ausnahme, löscht Anhänge, Frist aus site_config")

	print("\nBerechtigungen (Spezifikation Abschnitt 7)")
	for o in ("kontaktanfrage", "angebotsanfrage", "solarrechner_anfrage"):
		pruefe(rechte(dts[o], "Website API") == {"create"}, f"{dts[o]['name']}: Website API nur create")
	for o in ("projekt", "referenzkarte_einstellungen"):
		pruefe(rechte(dts[o], "Website API") == {"read"}, f"{dts[o]['name']}: Website API nur read")
	for o in ("projekt", "kontaktanfrage", "angebotsanfrage", "solarrechner_anfrage", "referenzkarte_einstellungen"):
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
	teste_doctypes()
	teste_methoden()
	print(f"\n{ANZAHL - len(FEHLER)}/{ANZAHL} Prüfungen bestanden.")
	if FEHLER:
		print("Fehlgeschlagen:\n  - " + "\n  - ".join(FEHLER))
		sys.exit(1)
