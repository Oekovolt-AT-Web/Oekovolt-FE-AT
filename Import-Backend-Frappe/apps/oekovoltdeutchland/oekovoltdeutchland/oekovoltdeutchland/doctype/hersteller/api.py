# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# GET oekovoltdeutchland.oekovoltdeutchland.doctype.hersteller.api.get_hesteller_by_name?name=<title>
# Der Tippfehler „hesteller“ ist Absicht – die Website ruft genau diesen Pfad auf.
# Aufrufer: Website (API_KEY/API_SECRET, Rolle „Website API“).
# Rückgabe: message = Hersteller als dict (inkl. {n}_product_options = [{options}]),
#           nicht gefunden → leeres dict (kein Fehler).

import frappe
from frappe.utils import cstr

from oekovoltdeutchland.oekovoltdeutchland.rollen import nur_website_api, oeffentlich


@frappe.whitelist(methods=["GET"])
def get_hesteller_by_name(name=None, **kwargs):
	nur_website_api()
	titel = cstr(name).strip()[:140]
	if not titel:
		return {}
	docname = frappe.db.get_value("Hersteller", {"title": titel}, "name") or (
		titel if frappe.db.exists("Hersteller", titel) else None
	)
	if not docname:
		return {}
	return oeffentlich(frappe.get_doc("Hersteller", docname).as_dict())
