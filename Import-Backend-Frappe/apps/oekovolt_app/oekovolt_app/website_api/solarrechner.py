# Copyright (c) 2026, ÖKOVOLT
#
# PV-Analyse aus dem Solarrechner (Spezifikation #8) -> DocType „Solarrechner Anfrage“.
#   POST /api/method/oekovolt_app.website_api.solarrechner.submit_solarrechner   (multipart/form-data)
#
# Formularfelder: kunden_name, email, telefon, plz, ip_adresse, quelle; Datei: pdf (application/pdf, max. 10 MB).
# Das PDF wird PRIVAT angehängt (is_private=1) und dem Kunden als Kopie per E-Mail geschickt.
# Aufrufer: API-User mit Rolle „Website API“ (src/app/api/analyse/pdf/route.js). Antwort wird nicht gelesen.

import frappe
from frappe import _
from frappe.utils import get_url_to_form

from oekovolt_app.website_api import format as fmt
from oekovolt_app.website_api.helfer import (
	drosseln,
	kunde_bestaetigen,
	nur_website_api,
	pruefen,
	team_benachrichtigen,
)

DOCTYPE = "Solarrechner Anfrage"


def _pdf_lesen():
	"""-> (dateiname, inhalt) aus frappe.request.files["pdf"]; höchstens 10 MB + 1 Byte lesen."""
	dateien = getattr(frappe.request, "files", None) if frappe.request else None
	datei = dateien.get("pdf") if dateien else None
	if not datei:
		frappe.throw(_("Die PDF-Datei fehlt."))
	inhalt = datei.stream.read(fmt.PDF_MAX_BYTES + 1)
	dateiname = pruefen(fmt.pruefe_pdf, datei.filename, datei.mimetype, inhalt)
	return dateiname, inhalt


@frappe.whitelist(methods=["POST"])
def submit_solarrechner(**kwargs):
	nur_website_api()
	d = frappe.form_dict
	if fmt.ist_honeypot(d):
		return {"ok": True}

	ip = fmt.ip_sauber(d.get("ip_adresse"))
	drosseln("solarrechner", ip)
	daten = pruefen(fmt.pruefe_solarrechner, d)
	dateiname, inhalt = _pdf_lesen()
	daten["analyse_referenz"] = fmt.analyse_referenz(dateiname)

	doc = frappe.get_doc({"doctype": DOCTYPE, "status": "Neu", "ip_adresse": ip, **daten})
	doc.insert(ignore_permissions=True)
	datei = frappe.get_doc({
		"doctype": "File",
		"file_name": dateiname,
		"attached_to_doctype": DOCTYPE,
		"attached_to_name": doc.name,
		"attached_to_field": "pdf",
		"is_private": 1,
		"content": inhalt,
	}).insert(ignore_permissions=True)
	doc.db_set("pdf", datei.file_url, update_modified=False)
	frappe.db.commit()

	betreff, html = fmt.team_mail_solarrechner(daten, get_url_to_form(DOCTYPE, doc.name))
	team_benachrichtigen(betreff, html, DOCTYPE, doc.name, reply_to=daten["email"])
	betreff, html = fmt.kunden_mail_solarrechner(daten)
	kunde_bestaetigen(
		daten["email"], betreff, html, DOCTYPE, doc.name,
		attachments=[{"fname": dateiname, "fcontent": inhalt}],
	)
	return {"ok": True}
