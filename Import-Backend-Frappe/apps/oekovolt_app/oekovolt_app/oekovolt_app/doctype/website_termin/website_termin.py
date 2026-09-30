# Copyright (c) 2026, Ökovolt Solartechnik GmbH

from datetime import datetime, time, timedelta

import frappe
from frappe.model.document import Document
from frappe.utils import get_datetime, getdate

from oekovolt_app.website_api import termin_logik as L


class WebsiteTermin(Document):
	def validate(self):
		# Buchungsnummer = Name aus der Naming Series (T-.YYYY.-.######)
		if not self.referenz:
			self.referenz = self.name

		try:
			minuten = L.zeit_zu_minuten(self.uhrzeit)
		except ValueError:
			frappe.throw("Uhrzeit bitte als HH:MM angeben, z. B. 09:30.")
		self.uhrzeit = L.hhmm(minuten)
		self._zeiten_setzen(minuten)

	def _zeiten_setzen(self, minuten):
		"""Beginn/Ende aus Datum + Uhrzeit (Wiener Zeit). Dauer bleibt erhalten, außer die Terminart ändert sich."""
		from oekovolt_app.website_api.termin import wien_zu_system

		if self.start and self.ende and not self.has_value_changed("terminart"):
			dauer = get_datetime(self.ende) - get_datetime(self.start)
		elif self.anfrageart == L.ANFRAGEART_RUECKRUF:
			dauer = timedelta(minutes=L.RUECKRUF_DAUER_MINUTEN)
		else:
			dauer = timedelta(minutes=L.DAUER_MINUTEN.get(self.terminart, 30))
		if dauer <= timedelta(0):
			dauer = timedelta(minutes=L.DAUER_MINUTEN.get(self.terminart, 30))

		start = wien_zu_system(datetime.combine(getdate(self.datum), time(minuten // 60, minuten % 60)))
		self.start = start
		self.ende = start + dauer

	def on_update(self):
		from oekovolt_app.website_api.termin import cache_leeren

		cache_leeren()

	def on_trash(self):
		from oekovolt_app.website_api.termin import cache_leeren

		cache_leeren()
