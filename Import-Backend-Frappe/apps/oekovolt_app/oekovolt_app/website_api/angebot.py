# Copyright (c) 2026, ÖKOVOLT
#
# Angebots-Konfigurator /angebot (Spezifikation #5) -> DocType „Angebotsanfrage“.
#   POST /api/method/oekovolt_app.website_api.angebot.submit_angebot   (JSON)
#
# `vorhaben` kommt als Array, `ergebnis` als Objekt (Werte können null sein – Gewerbe).
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

DOCTYPE = "Angebotsanfrage"


@frappe.whitelist(methods=["POST"])
def submit_angebot(**kwargs):
	nur_website_api()
	d = frappe.form_dict
	if fmt.ist_honeypot(d):
		return {"ok": True}

	ip = fmt.ip_sauber(d.get("ip_adresse"))
	drosseln("angebot", ip)
	daten = pruefen(fmt.pruefe_angebot, d)

	doc = frappe.get_doc({"doctype": DOCTYPE, "status": "Neu", "ip_adresse": ip, **daten})
	doc.insert(ignore_permissions=True)
	frappe.db.commit()

	betreff, html = fmt.team_mail_angebot(daten, get_url_to_form(DOCTYPE, doc.name))
	team_benachrichtigen(betreff, html, DOCTYPE, doc.name, reply_to=daten["email"])
	betreff, html = fmt.kunden_mail_angebot(daten)
	kunde_bestaetigen(daten["email"], betreff, html, DOCTYPE, doc.name)
	return {"ok": True}
