# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik
#
# PDF-Analyse von der Website speichern, an Kunde und Vertrieb senden.
# Pfad: oekovoltdeutchland/oekovoltdeutchland/doctype/pv_analyse/api.py
# Aufrufer: API-User mit Rolle "Kontakt Webformular" (siehe docs/frappe-rueckruf-termin).

import base64

import frappe
from frappe import _
from frappe.utils import add_months, cint, cstr, escape_html, flt, now_datetime

from oekovoltdeutchland.oekovoltdeutchland.doctype.rueckruf.api import herkunft_felder, nur_webformular, team_benachrichtigen, text

ROLLE_VERTRIEB = "Vertrieb"
MAX_PDF_BYTES = 3 * 1024 * 1024


@frappe.whitelist(methods=["POST"])
def create_analyse(**kwargs):
	nur_webformular()
	d = frappe.form_dict

	referenz = text(d.get("referenz"), 20)
	if not referenz.startswith("PVA-") or frappe.db.exists("PV Analyse", referenz):
		frappe.throw(_("Ungültige Referenz"))
	try:
		pdf = base64.b64decode(cstr(d.get("pdf_base64")), validate=True)
	except Exception:
		frappe.throw(_("Ungültige Datei"))
	if not pdf.startswith(b"%PDF") or len(pdf) > MAX_PDF_BYTES:
		frappe.throw(_("Ungültige Datei"))

	doc = frappe.get_doc({
		"doctype": "PV Analyse",
		"referenz": referenz,
		"kontakt_name": text(d.get("name"), 120),
		"email": text(d.get("email"), 190),
		"telefon": text(d.get("telefon"), 40),
		"plz": text(d.get("plz"), 10),
		"kwp": flt(d.get("kwp")),
		"ausrichtung": text(d.get("ausrichtung"), 20),
		"neigung": text(d.get("neigung"), 20),
		"verbrauch": cint(d.get("verbrauch")),
		"speicher_kwh": flt(d.get("speicher_kwh")),
		"jahresertrag": cint(d.get("jahresertrag")),
		"autarkie": cint(d.get("autarkie")),
		"investition": flt(d.get("investition")),
		"amortisation": flt(d.get("amortisation")),
		"seite": text(d.get("seite"), 300),
		**herkunft_felder(d),
		"loeschung_faellig": add_months(now_datetime().date(), 12),
	})
	doc.insert(ignore_permissions=True)

	datei = frappe.get_doc({
		"doctype": "File",
		"file_name": f"Oekovolt-PV-Analyse-{referenz}.pdf",
		"attached_to_doctype": "PV Analyse",
		"attached_to_name": doc.name,
		"attached_to_field": "pdf",
		"is_private": 1,
		"content": pdf,
	}).insert(ignore_permissions=True)
	doc.db_set("pdf", datei.file_url, update_modified=False)
	frappe.db.commit()

	anhang = [{"fname": f"Oekovolt-PV-Analyse-{referenz}.pdf", "fcontent": pdf}]
	name = escape_html(doc.kontakt_name)

	# Kopie an den Kunden
	try:
		frappe.sendmail(
			recipients=[doc.email],
			subject=f"Ihre Photovoltaik-Analyse ({referenz})",
			message=(
				f"<p>Guten Tag {name},</p>"
				"<p>vielen Dank für Ihr Interesse. Anbei erhalten Sie Ihre persönliche Photovoltaik-Analyse als PDF.</p>"
				"<p>Möchten Sie die Zahlen mit einem Fachberater durchgehen? Buchen Sie einfach einen kostenlosen Termin unter "
				"<a href='https://www.oekovolt.com/termin'>www.oekovolt.com/termin</a> oder rufen Sie uns an: +43 6278 71030.</p>"
				"<p>Viele Grüße<br>Ihr Ökovolt-Team</p>"
			),
			attachments=anhang,
			reference_doctype="PV Analyse",
			reference_name=doc.name,
			now=True,
		)
	except Exception:
		frappe.log_error(title=f"PV-Analyse {referenz}: Kundenmail fehlgeschlagen")

	# Vertrieb informieren (E-Mail mit PDF + Glocke)
	team_benachrichtigen(
		ROLLE_VERTRIEB,
		f"Neue PV-Analyse: {doc.kontakt_name} · {doc.kwp} kWp · PLZ {doc.plz or '–'}",
		f"<p><b>{name}</b> · {escape_html(doc.email)} · {escape_html(doc.telefon or '–')} · PLZ {escape_html(doc.plz or '–')}</p>"
		f"<p>{doc.kwp} kWp · {doc.ausrichtung}/{doc.neigung} · Verbrauch {doc.verbrauch} kWh · Speicher {doc.speicher_kwh} kWh<br>"
		f"Ertrag {doc.jahresertrag} kWh · Autarkie {doc.autarkie} % · Investition {doc.investition:,.0f} € · Amortisation {doc.amortisation} Jahre</p>"
		f"<p><a href='{frappe.utils.get_url_to_form('PV Analyse', doc.name)}'>Im Backoffice öffnen</a></p>",
		"PV Analyse",
		doc.name,
	)
	return {"referenz": referenz}


def loesche_alte_analysen():
	"""Täglicher Scheduler-Job: Analysen ohne Fortschritt nach 12 Monaten löschen."""
	faellig = frappe.get_all(
		"PV Analyse",
		filters={"loeschung_faellig": ["<=", now_datetime().date()], "status": ["in", ["Neu", "Kontaktiert", "Verloren"]]},
		pluck="name",
	)
	for name in faellig:
		frappe.delete_doc("PV Analyse", name, ignore_permissions=True, force=True, delete_permanently=True)
	if faellig:
		frappe.db.commit()
