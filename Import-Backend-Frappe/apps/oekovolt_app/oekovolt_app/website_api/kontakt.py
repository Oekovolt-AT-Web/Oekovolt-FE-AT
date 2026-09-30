# Copyright (c) 2026, ÖKOVOLT
#
# Kontaktformular der Website (Spezifikation #4) -> DocType „Kontaktanfrage“.
#   POST /api/method/oekovolt_app.website_api.kontakt.submit_kontakt   (JSON)
#
# Genutzt von /kontakt, den Service-Seiten, PV Award, Sponsoring und Partner-Registrierung.
# Aufrufer: API-User mit Rolle „Website API“. Antwort wird von der Website nicht gelesen (2xx = Erfolg).

import frappe
from frappe.utils import get_url_to_form

from oekovolt_app.website_api import format as fmt
from oekovolt_app.website_api.helfer import (
	drosseln,
	kunde_bestaetigen,
	nur_website_api,
	pruefen,
	team_benachrichtigen,
)

DOCTYPE = "Kontaktanfrage"


@frappe.whitelist(methods=["POST"])
def submit_kontakt(**kwargs):
	nur_website_api()
	d = frappe.form_dict
	if fmt.ist_honeypot(d):
		return {"ok": True}

	ip = fmt.ip_sauber(d.get("ip_adresse"))
	drosseln("kontakt", ip)
	daten = pruefen(fmt.pruefe_kontakt, d)

	doc = frappe.get_doc({"doctype": DOCTYPE, "status": "Neu", "ip_adresse": ip, **daten})
	doc.insert(ignore_permissions=True)
	frappe.db.commit()

	betreff, html = fmt.team_mail_kontakt(daten, get_url_to_form(DOCTYPE, doc.name))
	team_benachrichtigen(betreff, html, DOCTYPE, doc.name, reply_to=daten["email"])
	betreff, html = fmt.kunden_mail_kontakt(daten)
	kunde_bestaetigen(daten["email"], betreff, html, DOCTYPE, doc.name)
	return {"ok": True}
