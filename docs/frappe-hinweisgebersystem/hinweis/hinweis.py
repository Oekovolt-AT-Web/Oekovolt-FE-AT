# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik
# Controller des DocTypes "Hinweis" – setzt die Fristen des HinSchG automatisch.

import frappe
from frappe.model.document import Document
from frappe.utils import add_days, add_months, add_years, getdate, now_datetime


class Hinweis(Document):
	def before_insert(self):
		jetzt = now_datetime()
		self.eingegangen_am = jetzt
		self.status = self.status or "Eingegangen"
		# § 17 Abs. 1 Nr. 1 HinSchG: Eingangsbestätigung spätestens nach 7 Tagen
		self.bestaetigung_faellig = add_days(getdate(jetzt), 7)
		# § 17 Abs. 2 HinSchG: Rückmeldung spätestens 3 Monate nach Bestätigung,
		# ohne Bestätigung 3 Monate und 7 Tage nach Eingang
		self.rueckmeldung_faellig = add_days(add_months(getdate(jetzt), 3), 7)

	def validate(self):
		jetzt = now_datetime()

		if self.status != "Eingegangen" and not self.eingang_bestaetigt_am:
			self.eingang_bestaetigt_am = jetzt
			self.rueckmeldung_faellig = add_months(getdate(jetzt), 3)

		if self.status == "Abgeschlossen":
			if not self.abgeschlossen_am:
				self.abgeschlossen_am = jetzt
			# § 11 Abs. 5 HinSchG: Löschung 3 Jahre nach Abschluss
			self.loeschung_faellig = add_years(getdate(self.abgeschlossen_am), 3)

		# Nachrichten der Meldestelle ohne Zeitstempel ergänzen
		for n in self.nachrichten or []:
			if not n.zeitpunkt:
				n.zeitpunkt = jetzt
			if not n.absender:
				n.absender = "Meldestelle"
			if n.absender == "Meldestelle" and not n.intern:
				self.ungelesen = 0
