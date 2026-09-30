# Copyright (c) 2026, ÖKOVOLT
#
# Angelegt über oekovolt_app.website_api (Rolle „Website API“, nur create).
# Bearbeitung im Desk durch Vertrieb / System Manager.

import frappe
from frappe.model.document import Document


class Angebotsanfrage(Document):
	def validate(self):
		# Wer den Status aus „Neu“ herausnimmt, wird zuständig (falls noch niemand eingetragen ist)
		if self.status and self.status != "Neu" and not self.zustaendig and frappe.session.user not in ("Guest", "Administrator"):
			self.zustaendig = frappe.session.user
