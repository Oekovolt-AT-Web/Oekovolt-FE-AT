# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik

import frappe
from frappe.model.document import Document
from frappe.utils import add_months, get_datetime


class Beratungstermin(Document):
	def validate(self):
		if get_datetime(self.ende) <= get_datetime(self.start):
			frappe.throw("Das Ende muss nach dem Beginn liegen.")
		self.loeschung_faellig = add_months(get_datetime(self.start).date(), 12)

	def on_update(self):
		# Kalendereintrag mitführen (Verschiebung/Absage)
		if self.event and frappe.db.exists("Event", self.event):
			frappe.db.set_value(
				"Event",
				self.event,
				{
					"starts_on": self.start,
					"ends_on": self.ende,
					"status": "Cancelled" if self.status == "Abgesagt" else "Open",
				},
			)
		if self.has_value_changed("status") and self.status in ("Bestätigt", "Verschoben", "Abgesagt"):
			from oekovoltdeutchland.oekovoltdeutchland.doctype.beratungstermin.api import kunde_informieren

			kunde_informieren(self)
