# Copyright (c) 2026, Ökovolt Solartechnik GmbH
# Script Report „Heatmap Auswertung“
#
# Filter: Pfad, Gerät (leer = alle), Von/Bis Monat (JJJJ-MM).
# Tabelle: meistgeklickte Elemente (Selektor, Klicks, Klicks je 100 Aufrufe).
# Diagramm: Scroll-Kurve (Anteil der Aufrufe, die mindestens 10 … 100 % erreichten).
# Kennzahlen: Aufrufe, Klicks. Hinweis oben: Link zur visuellen Ansicht auf der Website
# (nur System Manager / Marketing, Token aus site_config „oekovolt_heatmap_token“).

import frappe
from frappe import _
from frappe.utils import getdate, nowdate

from oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle import heatmap_logik as L
from oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.api import (
	ansicht_hinweis_html,
	aufrufe_laden,
	elemente_laden,
	scroll_laden,
)


def _spalten():
	return [
		{"fieldname": "selektor", "label": _("Element (Selektor)"), "fieldtype": "Data", "width": 460},
		{"fieldname": "klicks", "label": _("Klicks"), "fieldtype": "Int", "width": 110},
		{"fieldname": "anteil", "label": _("Anteil an Aufrufen"), "fieldtype": "Percent", "width": 160},
	]


def execute(filters=None):
	filters = frappe._dict(filters or {})
	pfad = L.pfad_pruefen(filters.get("pfad") or "")
	if not pfad:
		return _spalten(), [], _("Bitte einen Pfad wählen, z. B. /gewerbe"), None, []

	geraet = L.geraet_pruefen(filters.get("geraet"))  # None = alle Geräte
	heute = getdate(nowdate())
	bis = L.monat_pruefen(filters.get("bis_monat")) or L.monat_von(heute)
	von = L.monat_pruefen(filters.get("von_monat")) or L.monat_verschieben(bis, -1)
	if von > bis:
		von, bis = bis, von

	aufrufe = aufrufe_laden(pfad, geraet, von, bis)
	data = L.top_elemente(elemente_laden(pfad, geraet, von, bis), aufrufe)
	kumuliert = scroll_laden(pfad, geraet, von, bis)

	chart = {
		"data": {
			"labels": [f"{z['tiefe']} %" for z in kumuliert],
			"datasets": [{"name": _("Aufrufe mit mind. dieser Scrolltiefe (%)"), "values": L.scroll_anteile(kumuliert, aufrufe)}],
		},
		"type": "line",
		"colors": ["#16a34a"],
		"lineOptions": {"regionFill": 1},
		"axisOptions": {"xIsSeries": 1},
	}
	summary = [
		{"label": _("Aufrufe"), "value": aufrufe, "indicator": "Blue", "datatype": "Int"},
		{"label": _("Klicks (Top-Elemente)"), "value": sum(z["klicks"] for z in data), "indicator": "Green", "datatype": "Int"},
		{"label": _("Zeitraum"), "value": f"{von} – {bis}", "indicator": "Gray", "datatype": "Data"},
		{"label": _("Gerät"), "value": geraet or _("alle"), "indicator": "Gray", "datatype": "Data"},
	]
	return _spalten(), data, ansicht_hinweis_html(pfad, geraet) or None, chart, summary
