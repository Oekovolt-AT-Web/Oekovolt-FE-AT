# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# GET oekovoltdeutchland.oekovoltdeutchland.doctype.waermepumpe_page.api.get_waermepumpe_page_with_keywords
# Aufrufer: Website (API_KEY/API_SECRET, Rolle „Website API“) – src/app/produkte/warmepumpe/[slug], sitemap.js
# Rückgabe: message = Single „Waermepumpe Page“ als dict inkl. warmepumpe_third_card_options_table
# (je Zeile mit modified). Leere Tabelle → alle /produkte/warmepumpe/<slug> liefern 404.

import frappe

from oekovoltdeutchland.oekovoltdeutchland.rollen import nur_website_api, oeffentlich


@frappe.whitelist(methods=["GET"])
def get_waermepumpe_page_with_keywords(**kwargs):
	nur_website_api()
	return oeffentlich(frappe.get_single("Waermepumpe Page").as_dict())
