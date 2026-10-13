# Copyright (c) 2026, ÖKOVOLT
#
# Kontaktformular der Website (Spezifikation #4) -> DocType „Kontaktanfrage“.
#   POST /api/method/oekovolt_app.website_api.kontakt.submit_kontakt   (JSON)
#
# Genutzt von /kontakt, den Service-Seiten, PV Award, Sponsoring und Partner-Registrierung.
# Aufrufer: API-User mit Rolle „Website API“. Antwort wird von der Website nicht gelesen (2xx = Erfolg).
#
# Welle A11: Die Team-Mail kommt aus lead_eingang.after_insert (A06, Routing/Score/SLA); hier nur die
# Eingangsbestätigung an den Kunden (Referenz im Betreff, kein Freitext; Schalter oekovolt_keine_kundenmail).

import frappe

from oekovolt_app.website_api import format as fmt
from oekovolt_app.website_api.helfer import (
	drosseln,
	kunde_bestaetigen,
	nur_website_api,
	pruefen,
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

	betreff, html = fmt.kunden_mail_kontakt(daten, doc.name, frappe.conf.get("oekovolt_website_url"))
	kunde_bestaetigen(daten["email"], betreff, html, DOCTYPE, doc.name)
	return {"ok": True}
