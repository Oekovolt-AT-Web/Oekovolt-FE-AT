# Copyright (c) 2026, ÖKOVOLT

import frappe
from frappe import _
from frappe.model.document import Document


class ReferenzkarteEinstellungen(Document):
	def validate(self):
		if not -90 <= (self.latitude or 0) <= 90 or not self.latitude:
			frappe.throw(_("Bitte einen gültigen Breitengrad für den Firmensitz angeben (z. B. 48.0428)."))
		if not -180 <= (self.longitude or 0) <= 180 or not self.longitude:
			frappe.throw(_("Bitte einen gültigen Längengrad für den Firmensitz angeben (z. B. 12.8417)."))
		if (self.umkreis_km or 0) <= 0:
			self.umkreis_km = 100

	def on_update(self):
		from oekovolt_app.website_api.projekte import cache_leeren

		cache_leeren()
