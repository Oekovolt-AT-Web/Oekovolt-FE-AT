# Copyright (c) 2026, ÖKOVOLT
#
# Lead aus dem Lead-Gate der Website (Welle A11, Spezifikation #17–#19).
# Angelegt über oekovolt_app.website_api.rechner.submit_rechner_lead (Rolle „Website API“, nur create);
# Bestätigung per Link (rechner.bestaetige_lead). Bearbeitung im Desk durch Vertrieb / System Manager.

import frappe
from frappe.model.document import Document


class RechnerLead(Document):
	def validate(self):
		# Wer den Status aus „Neu“ herausnimmt, wird zuständig (falls noch niemand eingetragen ist)
		if self.status and self.status != "Neu" and not self.zustaendig and frappe.session.user not in ("Guest", "Administrator"):
			self.zustaendig = frappe.session.user
		# Von der Website: Telefon nur mit freiwilligem Häkchen „Kontakt erwünscht“ (Lead-Gate ohne Kopplung)
		if self.is_new() and self.flags.von_website and self.telefon and not self.kontakt_ok and not self.rueckruf_ok:
			self.telefon = ""
