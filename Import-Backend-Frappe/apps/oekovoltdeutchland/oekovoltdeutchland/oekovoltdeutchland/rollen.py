# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# Rollenprüfung für die neuen AT-Methoden (Produktseiten, Hersteller, Heatmap) –
# gleiches Muster wie nur_webformular() in rueckruf/api.py.

import frappe
from frappe import _

ROLLE_WEBSITE_API = "Website API"
ROLLE_MARKETING = "Marketing"


def nur_rollen(*rollen):
	"""Bricht mit PermissionError ab, wenn der Aufrufer keine der Rollen (oder System Manager) hat."""
	erlaubt = set(rollen) | {"System Manager"}
	if not erlaubt.intersection(frappe.get_roles()):
		frappe.throw(_("Nicht berechtigt"), frappe.PermissionError)


def nur_website_api():
	"""Nur der API-User der Website (Rolle „Website API“) bzw. System Manager."""
	nur_rollen(ROLLE_WEBSITE_API)


def oeffentlich(daten):
	"""Entfernt Benutzerkennungen (E-Mail-Adressen der Bearbeiter) aus einem as_dict()-Ergebnis,
	auch in Kindtabellen. Inhalte und „modified“ (für die Sitemap) bleiben erhalten."""
	if isinstance(daten, dict):
		return {k: oeffentlich(v) for k, v in daten.items() if k not in ("owner", "modified_by")}
	if isinstance(daten, list):
		return [oeffentlich(v) for v in daten]
	return daten
