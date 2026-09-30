# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# Standardwerte (entsprechen src/data/erreichbarkeit.js bzw. FIRMA.oeffnungszeiten der Website):
#   Raster 30 Min., Vorlauf 2 h, Vor-Ort frühestens übermorgen, buchbar 60 Tage im Voraus,
#   Zeitfenster für alle Terminarten: Mo–Do 08:00–16:00, Fr 08:00–13:00,
#   24.12./31.12. geschlossen, Feiertage Österreich automatisch.
# Vorbelegen: bench --site <site> execute oekovolt_app.website_api.termin.einstellungen_vorbelegen

import frappe
from frappe.model.document import Document

from oekovolt_app.website_api import termin_logik as L


class TerminEinstellungen(Document):
	def validate(self):
		if self.slot_minuten and not 5 <= int(self.slot_minuten) <= 240:
			frappe.throw("Das Raster muss zwischen 5 und 240 Minuten liegen.")
		if self.max_tage and int(self.max_tage) > 365:
			frappe.throw("Höchstens 365 Tage im Voraus.")

		for z in self.get("zeitfenster") or []:
			if not L.wochentag_nummer(z.wochentag):
				frappe.throw(f"Zeitfenster Zeile {z.idx}: Wochentag fehlt.")
			try:
				beginn, ende = L.zeit_zu_minuten(z.beginn), L.zeit_zu_minuten(z.ende)
			except ValueError:
				frappe.throw(f"Zeitfenster Zeile {z.idx}: Beginn und Ende als Uhrzeit angeben.")
			if ende <= beginn:
				frappe.throw(f"Zeitfenster Zeile {z.idx}: Das Ende muss nach dem Beginn liegen.")

		for s in self.get("sperrtage") or []:
			if s.bis and s.datum and str(s.bis) < str(s.datum):
				frappe.throw(f"Sperrtag Zeile {s.idx}: „bis“ liegt vor dem Datum.")

	def on_update(self):
		from oekovolt_app.website_api.termin import cache_leeren

		cache_leeren()
