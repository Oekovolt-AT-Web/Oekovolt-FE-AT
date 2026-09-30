# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik

import frappe
from frappe.model.document import Document


class PushNachricht(Document):
	def validate(self):
		if len(self.titel or "") > 60:
			frappe.throw("Der Titel darf höchstens 60 Zeichen lang sein.")
		if len(self.text or "") > 160:
			frappe.throw("Der Text darf höchstens 160 Zeichen lang sein.")
		if self.link and not (self.link.startswith("/") or self.link.startswith("https://www.oekovolt.com")):
			frappe.throw("Der Link muss auf die eigene Website zeigen (z. B. /presse/…).")
		if self.status == "Geplant" and not self.senden_am:
			frappe.throw("Für „Geplant“ bitte „Senden am“ angeben.")
		if self.has_value_changed("status") and self.get_doc_before_save() and self.get_doc_before_save().status == "Gesendet":
			frappe.throw("Eine gesendete Nachricht kann nicht erneut gesendet werden – bitte duplizieren.")

	def on_update(self):
		if self.status == "Jetzt senden" and self.has_value_changed("status"):
			from oekovoltdeutchland.oekovoltdeutchland.doctype.veroeffentlichung.api import website_anstossen

			frappe.enqueue(website_anstossen, queue="short", enqueue_after_commit=True)
