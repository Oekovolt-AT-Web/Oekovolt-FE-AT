# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik
#
# Whitelisted API für Rückrufwünsche von der Website.
# Pfad: oekovoltdeutchland/oekovoltdeutchland/doctype/rueckruf/api.py
#
# Aufruf ausschließlich serverseitig durch Next.js (src/lib/rueckrufApi.js).
# Der aufrufende API-User braucht die Rolle "Kontakt Webformular" (ohne Leserechte).

import secrets
from zoneinfo import ZoneInfo

import frappe
from frappe import _
from frappe.utils import cstr, get_datetime, get_system_timezone, now_datetime

ROLLE_WEB = "Kontakt Webformular"
ROLLE_TEAM = "Rückruf Team"
ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


# ---------------------------------------------------------------- gemeinsame Helfer (auch von beratungstermin/api.py genutzt)

def nur_webformular():
	roles = frappe.get_roles()
	if ROLLE_WEB not in roles and "System Manager" not in roles:
		frappe.throw(_("Nicht berechtigt"), frappe.PermissionError)


def text(wert, maximal):
	return cstr(wert).strip()[:maximal]


def neue_referenz(doctype, praefix):
	for _versuch in range(20):
		ref = f"{praefix}-" + "".join(secrets.choice(ALPHABET) for _stelle in range(6))
		if not frappe.db.exists(doctype, {"referenz": ref}):
			return ref
	frappe.throw(_("Referenz konnte nicht erzeugt werden"))


def utc_zu_lokal(iso):
	"""ISO-Zeitpunkt (UTC, z. B. 2026-09-15T08:00:00.000Z) -> naive Systemzeit für Datetime-Felder."""
	if not iso:
		return None
	dt = get_datetime(cstr(iso).replace("Z", "+00:00"))
	if dt.tzinfo is None:
		return dt
	return dt.astimezone(ZoneInfo(get_system_timezone())).replace(tzinfo=None)


def lokal_zu_iso(dt):
	"""Naive Systemzeit -> ISO mit Zeitzone (für die Website)."""
	return get_datetime(dt).replace(tzinfo=ZoneInfo(get_system_timezone())).isoformat()


def team_benachrichtigen(rolle, betreff, html, doctype, name):
	"""E-Mail + Glocke im Desk für alle Nutzer einer Rolle. Darf die Anfrage nie verhindern."""
	try:
		nutzer = frappe.get_all("Has Role", filters={"role": rolle, "parenttype": "User"}, pluck="parent")
		nutzer = [u for u in set(nutzer) if u not in ("Administrator", "Guest") and frappe.db.get_value("User", u, "enabled")]
		if not nutzer:
			return
		frappe.sendmail(recipients=nutzer, subject=betreff, message=html, reference_doctype=doctype, reference_name=name, now=True)
		for u in nutzer:
			frappe.get_doc({
				"doctype": "Notification Log",
				"for_user": u,
				"type": "Alert",
				"document_type": doctype,
				"document_name": name,
				"subject": betreff,
				"email_content": html,
			}).insert(ignore_permissions=True)
			frappe.publish_realtime("msgprint", {"message": betreff, "indicator": "green", "title": "Website"}, user=u)
	except Exception:
		frappe.log_error(title=f"Benachrichtigung {doctype} {name} fehlgeschlagen")


# ---------------------------------------------------------------- API

@frappe.whitelist(methods=["POST"])
def create_rueckruf(**kwargs):
	nur_webformular()
	d = frappe.form_dict

	telefon = text(d.get("telefon"), 20)
	if not telefon.startswith("+") or len(telefon) < 10:
		frappe.throw(_("Ungültige Telefonnummer"))

	modus = d.get("modus") if d.get("modus") in ("Sofort", "Wunschzeit", "CloudTalk automatisch") else "Sofort"
	wunschzeit = utc_zu_lokal(d.get("wunschzeit")) if d.get("wunschzeit") else None

	doc = frappe.get_doc({
		"doctype": "Rueckruf",
		"referenz": neue_referenz("Rueckruf", "RR"),
		"status": "In Bearbeitung" if modus == "CloudTalk automatisch" else "Neu",
		"modus": modus,
		"wunschzeit": wunschzeit,
		"eingegangen_am": now_datetime(),
		"telefon": telefon,
		"kontakt_name": text(d.get("name"), 140),
		"thema": text(d.get("thema"), 60),
		"seite": text(d.get("seite"), 300),
		"cloudtalk_agent": text(d.get("cloudtalk_agent"), 40),
	})
	doc.insert(ignore_permissions=True)
	frappe.db.commit()

	if modus != "CloudTalk automatisch":
		wann = f"Wunschzeit: <b>{frappe.utils.format_datetime(wunschzeit, 'EEE dd.MM.yyyy HH:mm')} Uhr</b>" if wunschzeit else "<b>Bitte so schnell wie möglich zurückrufen.</b>"
		team_benachrichtigen(
			ROLLE_TEAM,
			f"Rückruf: {doc.kontakt_name or telefon}" + (" (Wunschzeit)" if wunschzeit else " – SOFORT"),
			f"<p>{wann}</p><p>Telefon: <a href='tel:{telefon}'>{telefon}</a><br>Name: {frappe.utils.escape_html(doc.kontakt_name or '–')}<br>"
			f"Thema: {frappe.utils.escape_html(doc.thema or '–')}<br>Seite: {frappe.utils.escape_html(doc.seite or '–')}</p>"
			f"<p><a href='{frappe.utils.get_url_to_form('Rueckruf', doc.name)}'>Im Backoffice öffnen</a></p>",
			"Rueckruf",
			doc.name,
		)

	return {"referenz": doc.referenz}


# ---------------------------------------------------------------- Löschfrist

def loesche_erledigte_rueckrufe():
	"""Täglicher Scheduler-Job: erledigte Rückrufe nach 90 Tagen löschen (Art. 5 Abs. 1 lit. e DSGVO)."""
	faellig = frappe.get_all("Rueckruf", filters={"loeschung_faellig": ["<=", now_datetime().date()]}, pluck="name")
	for name in faellig:
		frappe.delete_doc("Rueckruf", name, ignore_permissions=True, force=True)
		frappe.db.delete("Version", {"ref_doctype": "Rueckruf", "docname": name})
	if faellig:
		frappe.db.commit()
