# Copyright (c) 2026, ÖKOVOLT
#
# „Lead Routing Regel“ – wer übernimmt einen neuen Website-Lead? (Speed-to-Lead II, Welle A06)
# Die Auswahl der Regel und die Vertretungslogik liegen als reine Funktionen in
# website_api/lead_eingang.py (regel_waehlen, zustaendige_bestimmen) – ohne Frappe testbar.

import re

import frappe
from frappe import _
from frappe.model.document import Document

_PLZ = re.compile(r"^\d{4}$")


class LeadRoutingRegel(Document):
	def validate(self):
		self.bezeichnung = (self.bezeichnung or "").strip()
		self.plz_von = (self.plz_von or "").strip()
		self.plz_bis = (self.plz_bis or "").strip()

		if bool(self.plz_von) != bool(self.plz_bis):
			frappe.throw(_("„PLZ von“ und „PLZ bis“ bitte gemeinsam angeben (oder beide leer lassen)."))
		if self.plz_von and not (_PLZ.match(self.plz_von) and _PLZ.match(self.plz_bis)):
			frappe.throw(_("Postleitzahlen bitte vierstellig angeben (z. B. 5000 bis 5999)."))
		if self.plz_von and int(self.plz_von) > int(self.plz_bis):
			frappe.throw(_("„PLZ von“ darf nicht größer als „PLZ bis“ sein."))

		if not (self.benutzer or self.rolle_fallback):
			frappe.throw(_("Bitte einen zuständigen Benutzer oder eine Fallback-Rolle angeben."))
		if self.benutzer and self.vertretung and self.benutzer == self.vertretung:
			frappe.throw(_("Vertretung und Zuständiger dürfen nicht dieselbe Person sein."))
		for feld in ("benutzer", "vertretung"):
			nutzer = self.get(feld)
			if nutzer and not frappe.db.get_value("User", nutzer, "enabled"):
				frappe.throw(_("Der Benutzer {0} ist deaktiviert.").format(nutzer))

		if self.reihenfolge is None:
			self.reihenfolge = 100
		# Kein Cache: lead_eingang liest die aktiven Regeln je Lead aus der Datenbank – Änderungen greifen sofort.
