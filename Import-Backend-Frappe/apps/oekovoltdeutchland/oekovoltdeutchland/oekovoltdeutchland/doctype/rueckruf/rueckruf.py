# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik

import frappe
from frappe.model.document import Document
from frappe.utils import add_days, now_datetime


class Rueckruf(Document):
	def validate(self):
		if self.status in ("Erledigt", "Erreicht", "Nicht erreicht") and not self.erledigt_am:
			self.erledigt_am = now_datetime()
			self.loeschung_faellig = add_days(now_datetime().date(), 90)
		if self.status in ("Neu", "In Bearbeitung"):
			self.erledigt_am = None
			self.loeschung_faellig = None
		if not self.zustaendig and self.status == "In Bearbeitung":
			self.zustaendig = frappe.session.user
