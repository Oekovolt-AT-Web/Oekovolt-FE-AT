# Copyright (c) 2026, Ökovolt Deutschland
# Script Report „Anfragen nach Herkunft“
#
# Führt alle Website-Anfragen zusammen und gruppiert sie nach Kanal, Quelle,
# Kampagne, Einstiegsseite oder Anfrageart:
#   Rückruf · Beratungstermin · PV Analyse · Solar Lead (Foto-Upload) · Kontakt · Angebot · Termin
# Kontaktanfragen (Kontaktformular, Konfigurator, Übergangslösungen) haben keine
# eigenen Felder – dort wird die Zeile „[Herkunft] Kanal: … · Quelle: …“ aus der
# Nachricht gelesen.

import re

import frappe
from frappe import _
from frappe.utils import add_days, getdate, nowdate

QUELLEN = [
	# (DocType, Anzeigename, Status-Feld, „gewonnen“-Werte)
	("Rueckruf", "Rückruf", "ergebnis", ("Termin vereinbart", "Angebot angefordert")),
	("Beratungstermin", "Beratungstermin", "status", ("Durchgeführt",)),
	("PV Analyse", "PDF-Analyse", "status", ("Angebot erstellt", "Gewonnen")),
	("Solar Lead", "Foto-Upload", "status", ("Angebot erstellt", "Gewonnen")),
]
# AT: Anfragen ohne eigene Herkunft-Felder – die Website hängt „[Herkunft] …“ an die Nachricht an.
# (DocType, Anzeigename, Nachrichtenfeld). Fehlt ein DocType/Feld, wird die Quelle übersprungen.
NACHRICHT_QUELLEN = [
	("Kontaktanfrage", "Kontakt", "nachricht"),  # oekovolt_app …kontakt.submit_kontakt
	("Angebotsanfrage", "Angebot", "nachricht"),  # oekovolt_app …angebot.submit_angebot
	("Website Termin", "Termin", "nachricht"),  # oekovolt_app …termin.buche_termin
	("Kontakt", "Kontakt", "ihre_nachricht"),  # bisheriger DE-DocType, falls vorhanden
]
NACHRICHT_ARTEN = list(dict.fromkeys(art for _dt, art, _feld in NACHRICHT_QUELLEN))
FELDER = ["herkunft_kanal", "utm_source", "utm_medium", "utm_campaign", "einstiegsseite"]
GRUPPIERUNG = {
	"Kanal": "herkunft_kanal",
	"Quelle": "utm_source",
	"Kampagne": "utm_campaign",
	"Medium": "utm_medium",
	"Einstiegsseite": "einstiegsseite",
	"Anfrageart": "art",
}
ZEILE = re.compile(r"\[Herkunft\]\s*(.+)")
SCHLUESSEL = {"Kanal": "herkunft_kanal", "Quelle": "utm_source", "Medium": "utm_medium", "Kampagne": "utm_campaign", "Einstieg": "einstiegsseite"}


def execute(filters=None):
	filters = frappe._dict(filters or {})
	von = getdate(filters.get("von") or add_days(nowdate(), -90))
	bis = getdate(filters.get("bis") or nowdate())
	nach = filters.get("gruppierung") or "Kanal"
	feld = GRUPPIERUNG.get(nach, "herkunft_kanal")

	zeilen = _anfragen(von, bis)
	if filters.get("kanal"):
		zeilen = [z for z in zeilen if z["herkunft_kanal"] == filters.kanal]

	gruppen = {}
	for z in zeilen:
		schluessel = z.get(feld) or _("(ohne Angabe)")
		g = gruppen.setdefault(schluessel, {"gruppe": schluessel, "gesamt": 0, "gewonnen": 0, **{art: 0 for _dt, art, _f, _w in QUELLEN}, **{art: 0 for art in NACHRICHT_ARTEN}})
		g["gesamt"] += 1
		g[z["art"]] += 1
		g["gewonnen"] += 1 if z["gewonnen"] else 0

	data = sorted(gruppen.values(), key=lambda g: g["gesamt"], reverse=True)
	for g in data:
		g["quote"] = round(100 * g["gewonnen"] / g["gesamt"], 1) if g["gesamt"] else 0

	columns = [
		{"fieldname": "gruppe", "label": _(nach), "fieldtype": "Data", "width": 220},
		{"fieldname": "gesamt", "label": _("Anfragen"), "fieldtype": "Int", "width": 100},
		*[{"fieldname": art, "label": _(art), "fieldtype": "Int", "width": 120} for _dt, art, _f, _w in QUELLEN],
		*[{"fieldname": art, "label": _(art), "fieldtype": "Int", "width": 100} for art in NACHRICHT_ARTEN],
		{"fieldname": "gewonnen", "label": _("Weiter qualifiziert"), "fieldtype": "Int", "width": 140},
		{"fieldname": "quote", "label": _("Quote %"), "fieldtype": "Percent", "width": 100},
	]

	oben = data[:10]
	chart = {
		"data": {"labels": [g["gruppe"] for g in oben], "datasets": [{"name": _("Anfragen"), "values": [g["gesamt"] for g in oben]}]},
		"type": "bar",
		"colors": ["#16a34a"],
	}
	gesamt = len(zeilen)
	mit_kampagne = sum(1 for z in zeilen if z["utm_campaign"])
	summary = [
		{"label": _("Anfragen"), "value": gesamt, "indicator": "Blue", "datatype": "Int"},
		{"label": _("davon mit Kampagne"), "value": mit_kampagne, "indicator": "Green", "datatype": "Int"},
		{"label": _("Weiter qualifiziert"), "value": sum(1 for z in zeilen if z["gewonnen"]), "indicator": "Green", "datatype": "Int"},
	]
	return columns, data, None, chart, summary


def _anfragen(von, bis):
	zeitraum = ["between", [von, bis]]
	zeilen = []
	for doctype, art, status_feld, gewonnen in QUELLEN:
		if not frappe.db.exists("DocType", doctype):
			continue
		bedingungen = {"creation": zeitraum}
		if doctype == "Solar Lead":
			# Nur Sitzungen, in denen tatsächlich Unterlagen eingegangen sind
			bedingungen["status"] = ["!=", "Wartet auf Unterlagen"]
		for d in frappe.get_all(doctype, filters=bedingungen, fields=[*FELDER, status_feld]):
			zeilen.append({**{f: d.get(f) or "" for f in FELDER}, "art": art, "gewonnen": d.get(status_feld) in gewonnen})

	for doctype, art, feld in NACHRICHT_QUELLEN:
		if not frappe.db.exists("DocType", doctype) or not frappe.get_meta(doctype).has_field(feld):
			continue
		for d in frappe.get_all(doctype, filters={"creation": zeitraum}, fields=[feld]):
			zeilen.append({**_aus_nachricht(d.get(feld)), "art": art, "gewonnen": False})
	return zeilen


def _aus_nachricht(nachricht):
	werte = {f: "" for f in FELDER}
	treffer = ZEILE.search(nachricht or "")
	if not treffer:
		return werte
	for teil in treffer.group(1).split("·"):
		name, _sep, wert = teil.partition(":")
		feld = SCHLUESSEL.get(name.strip())
		if feld:
			werte[feld] = wert.strip()[:100]
	return werte
