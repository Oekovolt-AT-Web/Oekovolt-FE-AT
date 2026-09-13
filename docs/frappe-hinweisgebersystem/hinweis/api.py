# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik
#
# Whitelisted API des Hinweisgebersystems (HinSchG).
# Pfad im Frappe-App-Code:
#   oekovoltdeutchland/oekovoltdeutchland/doctype/hinweis/api.py
#
# Aufgerufen ausschließlich serverseitig von der Next.js-Website
# (src/lib/hinweisApi.js). Die IP-Adresse der meldenden Person erreicht Frappe
# dadurch nie – Frappe sieht nur den Website-Server.
#
# Sicherheitsprinzipien
#  - Aufrufer braucht die Rolle "Hinweis Webformular" (eigener API-User).
#    Diese Rolle hat KEINE Leserechte auf den DocType "Hinweis"; Datensätze
#    werden nur innerhalb dieser Methoden mit ignore_permissions geschrieben.
#  - Der Zugangsschlüssel wird nur als PBKDF2-Hash gespeichert.
#  - Keine Meldungsinhalte in Logs oder Fehlermeldungen.
#  - Unbekannte Fall-Nummer und falscher Schlüssel sind nicht unterscheidbar.

import hashlib
import hmac
import secrets

import frappe
from frappe import _
from frappe.utils import cint, cstr, now_datetime, add_to_date

ROLLE_WEB = "Hinweis Webformular"
ROLLE_MELDESTELLE = "Hinweis Meldestelle"
ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # ohne 0/O und 1/I
ITERATIONEN = 200_000

KATEGORIEN = {
	"Straftat", "Ordnungswidrigkeit", "Arbeitssicherheit", "Umwelt", "Datenschutz",
	"Produktsicherheit", "Wettbewerb", "Diskriminierung", "Sonstiges",
}


# ---------------------------------------------------------------- Helfer

def _nur_webformular():
	roles = frappe.get_roles()
	if ROLLE_WEB not in roles and "System Manager" not in roles:
		frappe.throw(_("Nicht berechtigt"), frappe.PermissionError)


def _text(wert, maximal):
	return cstr(wert).strip()[:maximal]


def _zufall(laenge):
	return "".join(secrets.choice(ALPHABET) for _ in range(laenge))


def _neue_referenz():
	for _ in range(20):
		ref = f"HW-{_zufall(4)}-{_zufall(4)}"
		if not frappe.db.exists("Hinweis", {"referenz": ref}):
			return ref
	frappe.throw(_("Referenz konnte nicht erzeugt werden"))


def _neuer_schluessel():
	roh = _zufall(24)
	return "-".join(roh[i : i + 6] for i in range(0, 24, 6))


def _hash(schluessel, salt_hex=None):
	salt_hex = salt_hex or secrets.token_hex(16)
	digest = hashlib.pbkdf2_hmac("sha256", schluessel.upper().encode(), bytes.fromhex(salt_hex), ITERATIONEN).hex()
	return f"pbkdf2_sha256${salt_hex}${digest}"


def _schluessel_ok(schluessel, gespeichert):
	try:
		_, salt_hex, digest = cstr(gespeichert).split("$")
	except ValueError:
		return False
	vergleich = _hash(schluessel, salt_hex).split("$")[2]
	return hmac.compare_digest(vergleich, digest)


def _fall_laden(referenz, schluessel):
	"""Liefert den Namen des Hinweises oder None – immer mit gleichem Rechenaufwand."""
	referenz = _text(referenz, 20).upper()
	schluessel = _text(schluessel, 80)
	treffer = frappe.db.get_value("Hinweis", {"referenz": referenz}, ["name", "zugang_hash"], as_dict=True)
	if not treffer:
		_hash(schluessel or "x")  # gleiche Laufzeit wie ein echter Vergleich
		return None
	return treffer.name if _schluessel_ok(schluessel, treffer.zugang_hash) else None


def _meldestelle_benachrichtigen(referenz, anlass):
	"""Benachrichtigt die Meldestelle OHNE Inhalte der Meldung."""
	try:
		empfaenger = frappe.get_all(
			"Has Role",
			filters={"role": ROLLE_MELDESTELLE, "parenttype": "User"},
			pluck="parent",
		)
		empfaenger = [u for u in set(empfaenger) if u not in ("Administrator", "Guest")]
		if not empfaenger:
			return
		frappe.sendmail(
			recipients=empfaenger,
			subject=f"Hinweisgebersystem: {anlass} ({referenz})",
			message=(
				f"<p>Im Hinweisgebersystem gibt es eine Aktualisierung: <b>{anlass}</b>.</p>"
				f"<p>Fall-Nummer: {referenz}</p>"
				"<p>Aus Gründen der Vertraulichkeit enthält diese E-Mail keine Inhalte. "
				"Bitte melden Sie sich im Backoffice an.</p>"
			),
			now=False,
		)
	except Exception:
		# Benachrichtigung darf die Meldung nie verhindern – und nichts loggen.
		pass


def _postfach(name):
	doc = frappe.get_doc("Hinweis", name)
	return {
		"referenz": doc.referenz,
		"status": doc.status,
		"eingegangen_am": cstr(doc.eingegangen_am),
		"nachrichten": [
			{"absender": n.absender, "nachricht": n.nachricht, "zeitpunkt": cstr(n.zeitpunkt)}
			for n in (doc.nachrichten or [])
			if not cint(n.intern)
		],
	}


# ---------------------------------------------------------------- API

@frappe.whitelist(methods=["POST"])
def create_hinweis(**kwargs):
	_nur_webformular()
	d = frappe.form_dict

	betreff = _text(d.get("betreff"), 140)
	beschreibung = _text(d.get("beschreibung"), 20000)
	if len(betreff) < 5 or len(beschreibung) < 30:
		frappe.throw(_("Unvollständige Meldung"))

	anonym = 1 if cint(d.get("anonym")) else 0
	kategorie = d.get("kategorie") if d.get("kategorie") in KATEGORIEN else "Sonstiges"
	schluessel = _neuer_schluessel()

	doc = frappe.get_doc({
		"doctype": "Hinweis",
		"referenz": _neue_referenz(),
		"zugang_hash": _hash(schluessel),
		"kategorie": kategorie,
		"beziehung": _text(d.get("beziehung"), 140),
		"betreff": betreff,
		"beschreibung": beschreibung,
		"zeitraum": _text(d.get("zeitraum"), 140),
		"ort": _text(d.get("ort"), 140),
		"beteiligte": _text(d.get("beteiligte"), 2000),
		"bereits_gemeldet": _text(d.get("bereits_gemeldet"), 140),
		"anonym": anonym,
		"name_meldende": "" if anonym else _text(d.get("name_meldende"), 140),
		"email": "" if anonym else _text(d.get("email"), 140),
		"telefon": "" if anonym else _text(d.get("telefon"), 60),
		"quelle": "Website",
	})
	doc.insert(ignore_permissions=True)
	frappe.db.commit()

	_meldestelle_benachrichtigen(doc.referenz, "Neue Meldung eingegangen")
	return {"referenz": doc.referenz, "zugangsschluessel": schluessel}


@frappe.whitelist(methods=["POST"])
def get_postfach(**kwargs):
	_nur_webformular()
	name = _fall_laden(frappe.form_dict.get("referenz"), frappe.form_dict.get("schluessel"))
	if not name:
		return None
	return _postfach(name)


@frappe.whitelist(methods=["POST"])
def add_nachricht(**kwargs):
	_nur_webformular()
	name = _fall_laden(frappe.form_dict.get("referenz"), frappe.form_dict.get("schluessel"))
	if not name:
		return None

	text = _text(frappe.form_dict.get("nachricht"), 10000)
	if len(text) < 2:
		frappe.throw(_("Nachricht fehlt"))

	doc = frappe.get_doc("Hinweis", name)
	if doc.status == "Abgeschlossen":
		frappe.throw(_("Das Verfahren ist abgeschlossen"))

	doc.append("nachrichten", {
		"absender": "Meldende Person",
		"nachricht": text,
		"zeitpunkt": now_datetime(),
		"intern": 0,
	})
	doc.ungelesen = 1
	doc.save(ignore_permissions=True)
	frappe.db.commit()

	_meldestelle_benachrichtigen(doc.referenz, "Neue Nachricht der meldenden Person")
	return _postfach(name)


# ---------------------------------------------------------------- Löschfrist

def loesche_abgelaufene_hinweise():
	"""Täglicher Scheduler-Job (hooks.py): löscht Fälle nach Ablauf der Frist
	aus § 11 Abs. 5 HinSchG (3 Jahre nach Abschluss), sofern nicht gesperrt."""
	heute = now_datetime().date()
	faellig = frappe.get_all(
		"Hinweis",
		filters={"status": "Abgeschlossen", "loeschung_faellig": ["<=", heute], "aufbewahrung_verlaengert": 0},
		pluck="name",
	)
	for name in faellig:
		frappe.delete_doc("Hinweis", name, ignore_permissions=True, force=True)
		# Versionshistorie mit Inhalten ebenfalls entfernen
		frappe.db.delete("Version", {"ref_doctype": "Hinweis", "docname": name})
	if faellig:
		frappe.db.commit()
