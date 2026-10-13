# Copyright (c) 2026, ÖKOVOLT
#
# Speed-to-Lead II (Welle A06) – SLA, Erstreaktion und Eskalation.
#   hooks.py: on_update der Lead-DocTypes -> erstreaktion_setzen(doc, method)
#             after_insert Communication    -> communication_angelegt(doc, method)
#             scheduler cron */5 * * * *    -> pruefen()
#   Desk-Knopf „Angerufen“ (Client Script, fixtures/client_script.json) -> angerufen(doctype, name)
#
# SLA-Fristen (Geschäftsminuten, Europe/Vienna, Zeitfenster/Feiertage/Sperrtage NUR aus termin_logik.py):
#   A: 60 Geschäftsminuten · B: 4 Geschäftsstunden · C: nächster Werktag 10:00
# Eskalation A-Leads ohne Erstreaktion: 15 Geschäftsminuten -> Vertretung + Vertriebsleitung,
#   60 Geschäftsminuten -> Geschäftsführung (site_config oekovolt_eskalation_an). Jede Stufe nur einmal
#   (Marker: Kommentar „Eskalation Stufe n“ am Lead).
#
# Reine Funktionen (ohne Frappe) stehen oben – tests/test_lead_routing.py.

import re
from datetime import datetime, time, timedelta

try:
	import frappe
except ImportError:  # Tests ohne Bench
	frappe = None

from oekovolt_app.website_api import termin_logik as L

SLA_MINUTEN = {"A": 60, "B": 4 * 60}  # Geschäftsminuten; C = nächster Werktag 10:00
SLA_C_UHRZEIT = time(10, 0)

# (Geschäftsminuten ohne Erstreaktion, Stufe)
ESKALATION = ((15, 1), (60, 2))
ESKALATION_MARKER = "Eskalation Stufe"
_MARKER_RE = re.compile(rf"{ESKALATION_MARKER}\s+(\d)")

STATUS_NEU = "Neu"
STATUS_OHNE_REAKTION = ("Neu", "Spam")  # Wechsel auf Spam ist keine Reaktion an den Kunden
STATUS_KONTAKTVERSUCH = "Kontaktversuch"

MAX_TAGE = 400  # Schleifenschutz


# ================================================================ Reine Funktionen (ohne Frappe)


def standard_einstellungen():
	"""Zeitfenster Mo–Do 08–16, Fr 08–13, Feiertage AT inkl. 24./31.12. – aus termin_logik.py."""
	return L.einstellungen_normalisieren(None)


def _fenster(tag, e):
	"""[(beginn, ende)] in Minuten des Tages – leer an Wochenende, Feiertag, Sperrtag."""
	return L.zeitfenster_am(tag, "Alle", e)


def ist_werktag(tag, e=None):
	return bool(_fenster(tag, e or standard_einstellungen()))


def naechster_werktag(tag, e=None):
	"""Erster Werktag NACH `tag`."""
	e = e or standard_einstellungen()
	t = tag + timedelta(days=1)
	for _ in range(MAX_TAGE):
		if _fenster(t, e):
			return t
		t += timedelta(days=1)
	raise ValueError("Kein Werktag gefunden")


def geschaeftsminuten_addieren(start, minuten, e=None):
	"""
	Naive Wiener Zeit `start` + `minuten` Geschäftsminuten -> naive Wiener Zeit.
	Außerhalb der Zeitfenster läuft keine Zeit; vor Öffnung beginnt die Frist bei Öffnung.
	Beispiel (Fr 08–13): Freitag 12:30 + 60 -> Montag 08:30.
	"""
	e = e or standard_einstellungen()
	rest = max(int(minuten), 0)
	tag = start.date()
	zeit = start.hour * 60 + start.minute
	for _ in range(MAX_TAGE):
		for beginn, ende in _fenster(tag, e):
			if zeit >= ende:
				continue
			von = max(zeit, beginn)
			verfuegbar = ende - von
			if rest <= verfuegbar:
				return datetime.combine(tag, time(0)) + timedelta(minutes=von + rest)
			rest -= verfuegbar
		tag += timedelta(days=1)
		zeit = 0
	raise ValueError("Frist nicht berechenbar")


def geschaeftsminuten_zwischen(von, bis, e=None):
	"""Geschäftsminuten zwischen zwei naiven Wiener Zeitpunkten (0, wenn bis <= von)."""
	if bis <= von:
		return 0
	e = e or standard_einstellungen()
	gesamt = 0
	tag = von.date()
	for _ in range(MAX_TAGE):
		if tag > bis.date():
			break
		start_min = von.hour * 60 + von.minute if tag == von.date() else 0
		ende_min = bis.hour * 60 + bis.minute if tag == bis.date() else 24 * 60
		for beginn, ende in _fenster(tag, e):
			a, b = max(beginn, start_min), min(ende, ende_min)
			if b > a:
				gesamt += b - a
		tag += timedelta(days=1)
	return gesamt


def sla_frist(klasse, eingang, e=None):
	"""Erstreaktion bis (naive Wiener Zeit): A 60 Geschäftsminuten, B 4 Geschäftsstunden, C nächster Werktag 10:00."""
	e = e or standard_einstellungen()
	minuten = SLA_MINUTEN.get(str(klasse or "").strip().upper())
	if minuten:
		return geschaeftsminuten_addieren(eingang, minuten, e)
	return datetime.combine(naechster_werktag(eingang.date(), e), SLA_C_UHRZEIT)


def eskalationsstufe(geschaeftsminuten):
	"""0 = keine, 1 = Vertretung + Vertriebsleitung (ab 15 Min.), 2 = Geschäftsführung (ab 60 Min.)."""
	stufe = 0
	for grenze, s in ESKALATION:
		if geschaeftsminuten >= grenze:
			stufe = s
	return stufe


def eskaliert_bis(kommentare):
	"""Höchste bereits gemeldete Stufe aus den Kommentartexten („Eskalation Stufe n …“)."""
	stufen = [int(m.group(1)) for text in kommentare for m in [_MARKER_RE.search(str(text or ""))] if m]
	return max(stufen) if stufen else 0


def faellige_stufen(geschaeftsminuten, kommentare):
	"""Stufen, die jetzt zu melden sind (jede nur einmal)."""
	erreicht = eskalationsstufe(geschaeftsminuten)
	return list(range(eskaliert_bis(kommentare) + 1, erreicht + 1))


def erstreaktion_erkannt(alter_status, neuer_status):
	"""Erster Statuswechsel weg von „Neu“ (nicht auf „Spam“) gilt als Erstreaktion."""
	return (alter_status or STATUS_NEU) == STATUS_NEU and (neuer_status or STATUS_NEU) not in STATUS_OHNE_REAKTION


def reaktionszeit(eingang, reaktion, e=None):
	"""reaktionszeit_min: Geschäftsminuten zwischen Eingang und Erstreaktion (naive Wiener Zeiten)."""
	return geschaeftsminuten_zwischen(eingang, reaktion, e)


# ================================================================ Frappe-Anbindung


def _lead_doctypes():
	from oekovolt_app.website_api.lead_eingang import LEAD_DOCTYPES

	return LEAD_DOCTYPES


def _einstellungen():
	try:
		return L.einstellungen_normalisieren(frappe.get_cached_doc("Termin Einstellungen"))
	except Exception:
		return standard_einstellungen()


def _wien(dt):
	from frappe.utils import get_datetime

	from oekovolt_app.website_api.termin import system_zu_wien

	return system_zu_wien(get_datetime(dt)) if dt else None


def _erstreaktion_speichern(doctype, name, eingang_am, jetzt=None, hinweis=None):
	"""erstreaktion_am und reaktionszeit_min setzen (nur beim ersten Mal, ohne modified zu ändern)."""
	from frappe.utils import now_datetime

	meta = frappe.get_meta(doctype)
	if not meta.has_field("erstreaktion_am"):
		return None
	if frappe.db.get_value(doctype, name, "erstreaktion_am"):
		return None
	jetzt = jetzt or now_datetime()
	werte = {"erstreaktion_am": jetzt}
	if meta.has_field("reaktionszeit_min"):
		von, bis = _wien(eingang_am), _wien(jetzt)
		werte["reaktionszeit_min"] = reaktionszeit(von, bis, _einstellungen()) if von and bis else 0
	frappe.db.set_value(doctype, name, werte, update_modified=False)
	if hinweis:
		try:
			frappe.get_doc({
				"doctype": "Comment", "comment_type": "Info", "reference_doctype": doctype, "reference_name": name,
				"content": hinweis,
			}).insert(ignore_permissions=True)
		except Exception:
			frappe.log_error(title=f"Erstreaktion-Kommentar {doctype} {name} fehlgeschlagen")
	return werte


def erstreaktion_setzen(doc, method=None):
	"""on_update: erster Statuswechsel weg von „Neu“ -> Erstreaktion. Darf das Speichern nie verhindern."""
	if doc.doctype not in _lead_doctypes():
		return
	try:
		if doc.get("erstreaktion_am"):
			return
		vorher = doc.get_doc_before_save()
		alt = vorher.get("status") if vorher else None
		if vorher is None or not erstreaktion_erkannt(alt, doc.get("status")):
			return
		werte = _erstreaktion_speichern(doc.doctype, doc.name, doc.get("eingang_am") or doc.creation)
		if werte:
			doc.update(werte)
	except Exception:
		frappe.log_error(title=f"Erstreaktion {doc.doctype} {doc.name} fehlgeschlagen")


def communication_angelegt(doc, method=None):
	"""after_insert Communication: erste ausgehende E-Mail zum Lead -> Erstreaktion."""
	try:
		if doc.get("sent_or_received") != "Sent" or doc.get("communication_type") != "Communication":
			return
		if doc.get("reference_doctype") not in _lead_doctypes() or not doc.get("reference_name"):
			return
		eingang = frappe.db.get_value(doc.reference_doctype, doc.reference_name, "eingang_am") if frappe.get_meta(
			doc.reference_doctype
		).has_field("eingang_am") else None
		_erstreaktion_speichern(doc.reference_doctype, doc.reference_name, eingang or frappe.db.get_value(
			doc.reference_doctype, doc.reference_name, "creation"
		))
	except Exception:
		frappe.log_error(title=f"Erstreaktion aus Communication {doc.name} fehlgeschlagen")


@frappe.whitelist() if frappe else (lambda f: f)
def angerufen(doctype, name):
	"""Desk-Knopf „Angerufen“: Erstreaktion jetzt, Status „Neu“ -> „Kontaktversuch“ (falls vorhanden), Kommentar."""
	from frappe import _

	if doctype not in _lead_doctypes():
		frappe.throw(_("Unbekannte Anfrageart"))
	if not frappe.has_permission(doctype, "write", name):
		frappe.throw(_("Nicht berechtigt"), frappe.PermissionError)
	eingang = frappe.db.get_value(doctype, name, "eingang_am") if frappe.get_meta(doctype).has_field("eingang_am") else None
	werte = _erstreaktion_speichern(
		doctype, name, eingang or frappe.db.get_value(doctype, name, "creation"),
		hinweis=f"Angerufen (Erstreaktion) – {frappe.utils.escape_html(frappe.session.user)}",
	)
	status = frappe.db.get_value(doctype, name, "status")
	if status == STATUS_NEU:
		optionen = (frappe.get_meta(doctype).get_field("status").options or "").split("\n")
		if STATUS_KONTAKTVERSUCH in optionen:
			frappe.db.set_value(doctype, name, "status", STATUS_KONTAKTVERSUCH)
	return werte or {"erstreaktion_am": frappe.db.get_value(doctype, name, "erstreaktion_am")}


def _vertriebsleitung():
	from oekovolt_app.website_api.helfer import _empfaenger

	return _empfaenger("Vertriebsleitung")[0]


def _vertretung_fuer(doctype, zeile):
	"""Vertretung laut passender Routing-Regel (ohne Zuweisung – nur zum Informieren)."""
	from oekovolt_app.website_api.lead_eingang import _regeln, regel_waehlen

	regel = regel_waehlen(_regeln(), {
		"doctype": doctype, "segment": zeile.get("segment"), "bundesland": zeile.get("bundesland"),
		"plz": zeile.get("plz"), "lead_klasse": zeile.get("lead_klasse"),
	})
	return regel.get("vertretung") if regel else None


def _eskalieren(doctype, zeile, stufe, minuten):
	from frappe.utils import get_url_to_form

	from oekovolt_app.website_api.helfer import team_benachrichtigen
	from oekovolt_app.website_api.lead_eingang import bezirk_text

	if stufe == 1:
		empfaenger = [zeile.get("zustaendig"), _vertretung_fuer(doctype, zeile), *_vertriebsleitung()]
		wer = "Vertretung und Vertriebsleitung"
	else:
		gf = frappe.conf.get("oekovolt_eskalation_an") or []
		if isinstance(gf, str):
			gf = [gf]
		empfaenger = [*gf, *_vertriebsleitung()]
		wer = "Geschäftsführung"
	empfaenger = [e for e in dict.fromkeys(empfaenger) if e]
	link = get_url_to_form(doctype, zeile["name"])
	bezirk = bezirk_text(zeile.get("bundesland"), zeile.get("plz"))
	betreff = f"[A] Eskalation Stufe {stufe}: {doctype} {zeile['name']} ohne Erstreaktion seit {minuten} Geschäftsminuten"
	html = (
		"<div style='font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5'>"
		f"<p>Ein A-Lead wartet seit <b>{minuten} Geschäftsminuten</b> auf die Erstreaktion.</p>"
		f"<p>Segment: {frappe.utils.escape_html(zeile.get('segment') or '–')}<br>Region: {frappe.utils.escape_html(bezirk)}<br>"
		f"Zuständig: {frappe.utils.escape_html(zeile.get('zustaendig') or 'nicht zugewiesen')}</p>"
		f"<p><a href='{frappe.utils.escape_html(link)}'>Im Backoffice öffnen</a></p></div>"
	)
	if empfaenger:
		team_benachrichtigen(betreff, html, doctype, zeile["name"], empfaenger=empfaenger)
	frappe.get_doc({
		"doctype": "Comment", "comment_type": "Info", "reference_doctype": doctype, "reference_name": zeile["name"],
		"content": f"{ESKALATION_MARKER} {stufe}: {minuten} Geschäftsminuten ohne Erstreaktion – gemeldet an {wer}.",
	}).insert(ignore_permissions=True)


def pruefen():
	"""Alle 5 Minuten: A-Leads der Vertriebsspur ohne Erstreaktion eskalieren (Stufe 1 ab 15, Stufe 2 ab 60 Geschäftsminuten)."""
	from frappe.utils import add_days, now_datetime

	from oekovolt_app.website_api.lead_eingang import eigene_spur
	from oekovolt_app.website_api.termin import system_zu_wien

	jetzt = now_datetime()
	jetzt_wien = system_zu_wien(jetzt)
	e = _einstellungen()
	for doctype in _lead_doctypes():
		if not frappe.db.exists("DocType", doctype):
			continue
		meta = frappe.get_meta(doctype)
		if not all(meta.has_field(f) for f in ("lead_klasse", "erstreaktion_am", "eingang_am")):
			continue
		felder = ["name", "eingang_am", "status"] + [
			f for f in ("segment", "zustaendig", "bundesland", "plz", "lead_klasse") if meta.has_field(f)
		]
		zeilen = frappe.get_all(
			doctype,
			filters={
				"lead_klasse": "A",
				"status": STATUS_NEU,
				"erstreaktion_am": ["is", "not set"],
				"eingang_am": ["is", "set"],
				"creation": [">=", add_days(jetzt, -14)],
			},
			fields=felder,
			limit=500,
		)
		for zeile in zeilen:
			try:
				if eigene_spur(zeile.get("segment")):
					continue
				minuten = geschaeftsminuten_zwischen(system_zu_wien(zeile["eingang_am"]), jetzt_wien, e)
				kommentare = frappe.get_all(
					"Comment",
					filters={"reference_doctype": doctype, "reference_name": zeile["name"], "comment_type": "Info",
						"content": ["like", f"{ESKALATION_MARKER}%"]},
					pluck="content",
				)
				for stufe in faellige_stufen(minuten, kommentare):
					_eskalieren(doctype, zeile, stufe, minuten)
				frappe.db.commit()
			except Exception:
				frappe.db.rollback()
				frappe.log_error(title=f"SLA-Prüfung {doctype} {zeile.get('name')} fehlgeschlagen")
