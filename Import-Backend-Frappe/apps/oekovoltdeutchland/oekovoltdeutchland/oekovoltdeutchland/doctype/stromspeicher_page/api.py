# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# GET oekovoltdeutchland.oekovoltdeutchland.doctype.stromspeicher_page.api.get_strom_page_with_keywords
# Aufrufer: Website (API_KEY/API_SECRET, Rolle „Website API“) – src/app/produkte/stromspeicher/…, sitemap.js
# Rückgabe: message = Single „Stromspeicher Page“ als dict inkl. strom_second_card_table (je Zeile mit modified).

import frappe

from oekovoltdeutchland.oekovoltdeutchland.rollen import nur_website_api, oeffentlich


@frappe.whitelist(methods=["GET"])
def get_strom_page_with_keywords(**kwargs):
	nur_website_api()
	return oeffentlich(frappe.get_single("Stromspeicher Page").as_dict())
