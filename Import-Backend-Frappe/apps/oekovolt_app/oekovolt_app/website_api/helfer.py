# Copyright (c) 2026, ÖKOVOLT
#
# Gemeinsame Frappe-Helfer der Website-API: Rollenprüfung, Drosselung, Benachrichtigungen.
# Reine Formatierung/Prüfung liegt in format.py (ohne Frappe, testbar).

import frappe
from frappe import _
from frappe.utils import cint, getdate

from oekovolt_app.website_api.format import EingabeFehler

ROLLE_WEB = "Website API"
ROLLE_VERTRIEB = "Vertrieb"

# Anfragen je IP-Adresse und Stunde (Überschreiben per site_config: "oekovolt_drossel": {"kontakt": 10})
DROSSEL_JE_STUNDE = {"kontakt": 5, "angebot": 5, "solarrechner": 10}
# Obergrenze je Formular und Stunde, wenn die Website keine IP-Adresse mitschickt
DROSSEL_OHNE_IP = 200


def nur_website_api():
	"""Nur der API-User der Website (Rolle „Website API“) oder ein System Manager."""
	rollen = frappe.get_roles()
	if ROLLE_WEB not in rollen and "System Manager" not in rollen:
		frappe.throw(_("Nicht berechtigt"), frappe.PermissionError)


def pruefen(funktion, *args):
	"""Ruft eine Prüffunktion aus format.py auf und übersetzt EingabeFehler in frappe.throw."""
	try:
		return funktion(*args)
	except EingabeFehler as fehler:
		frappe.throw(str(fehler), title=_("Bitte Eingaben prüfen"))


def drosseln(bereich, ip):
	"""Einfache Drosselung je IP-Adresse (Zähler im Redis-Cache, Fenster 1 Stunde) -> HTTP 429."""
	grenzen = {**DROSSEL_JE_STUNDE, **(frappe.conf.get("oekovolt_drossel") or {})}
	grenze = cint(grenzen.get(bereich)) or 5
	if not ip:
		ip, grenze = "ohne-ip", DROSSEL_OHNE_IP
	cache = frappe.cache()
	schluessel = cache.make_key(f"oekovolt_app:drossel:{bereich}:{ip}")
	anzahl = cache.incr(schluessel)
	if anzahl == 1:
		cache.expire(schluessel, 3600)
	if anzahl > grenze:
		frappe.throw(
			_("Zu viele Anfragen in kurzer Zeit – bitte versuchen Sie es später erneut."),
			frappe.TooManyRequestsError,
		)


def _empfaenger(rolle):
	nutzer = frappe.get_all("Has Role", filters={"role": rolle, "parenttype": "User"}, pluck="parent")
	nutzer = [
		u for u in set(nutzer)
		if u not in ("Administrator", "Guest") and frappe.db.get_value("User", u, "enabled")
	]
	# zusätzliche Adressen (z. B. Sammelpostfach) per site_config: "oekovolt_benachrichtigung_an": ["vertrieb@…"]
	extra = frappe.conf.get("oekovolt_benachrichtigung_an") or []
	if isinstance(extra, str):
		extra = [extra]
	return sorted(nutzer), [e for e in extra if e]


def team_benachrichtigen(betreff, html, doctype, name, reply_to=None, rolle=ROLLE_VERTRIEB):
	"""E-Mail + Glocke (Notification Log) für alle Nutzer der Rolle. Darf die Anfrage nie verhindern."""
	try:
		nutzer, extra = _empfaenger(rolle)
		empfaenger = nutzer + [e for e in extra if e not in nutzer]
		if empfaenger:
			frappe.sendmail(
				recipients=empfaenger,
				subject=betreff,
				message=html,
				reply_to=reply_to,
				reference_doctype=doctype,
				reference_name=name,
			)
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
	except Exception:
		frappe.log_error(title=f"Benachrichtigung {doctype} {name} fehlgeschlagen")


def kunde_bestaetigen(email, betreff, html, doctype, name, attachments=None):
	"""Bestätigungs-E-Mail an den Kunden (über die Email Queue). Darf die Anfrage nie verhindern."""
	if not email or frappe.conf.get("oekovolt_keine_kundenmail"):
		return
	try:
		frappe.sendmail(
			recipients=[email],
			subject=betreff,
			message=html,
			reference_doctype=doctype,
			reference_name=name,
			attachments=attachments or None,
		)
	except Exception:
		frappe.log_error(title=f"Bestätigungs-E-Mail {doctype} {name} fehlgeschlagen")


# ---------------------------------------------------------------- Löschfrist (scheduler_events daily)

def anfragen_aufraeumen():
	"""Täglich: Kontakt-, Angebots- und Solarrechner-Anfragen nach Ablauf der Löschfrist anonymisieren.

	Frist ab Anlage: 24 Monate (site_config „oekovolt_loeschfrist_monate“). Ausgenommen sind Anfragen mit Status
	„Angebot erstellt“ oder „Gewonnen“. Name, E-Mail, Telefon, Straße, Nachricht, Notiz und IP werden geleert,
	PDFs der Solarrechner-Anfragen gelöscht, dazu Versionen, Kommentare, Benachrichtigungen und E-Mail-Warteschlange.
	PLZ, Ort, Thema, Richtwerte und Kampagnen-Felder bleiben für die Statistik."""
	from oekovolt_app.website_api.format import ANONYMISIEREN, BEHALTEN_STATUS, loeschfrist_monate, loeschstichtag

	stichtag = loeschstichtag(getdate(), loeschfrist_monate(frappe.conf.get("oekovolt_loeschfrist_monate")))
	for doctype, leer in ANONYMISIEREN.items():
		try:
			namen = frappe.get_all(
				doctype,
				filters={"creation": ["<", stichtag], "anonymisiert": 0, "status": ["not in", list(BEHALTEN_STATUS)]},
				pluck="name",
				limit=2000,
			)
			if not namen:
				continue
			for name in namen:
				frappe.db.set_value(doctype, name, leer, update_modified=False)
			dateien = frappe.get_all("File", filters={"attached_to_doctype": doctype, "attached_to_name": ["in", namen]}, pluck="name")
			for datei in dateien:
				frappe.delete_doc("File", datei, ignore_permissions=True, force=True)
			frappe.db.delete("Version", {"ref_doctype": doctype, "docname": ["in", namen]})
			frappe.db.delete("Comment", {"reference_doctype": doctype, "reference_name": ["in", namen]})
			frappe.db.delete("Notification Log", {"document_type": doctype, "document_name": ["in", namen]})
			queue = frappe.get_all("Email Queue", filters={"reference_doctype": doctype, "reference_name": ["in", namen]}, pluck="name")
			if queue:
				frappe.db.delete("Email Queue Recipient", {"parent": ["in", queue]})
				frappe.db.delete("Email Queue", {"name": ["in", queue]})
			frappe.db.commit()
		except Exception:
			frappe.db.rollback()
			frappe.log_error(title=f"Löschfrist {doctype} fehlgeschlagen")
