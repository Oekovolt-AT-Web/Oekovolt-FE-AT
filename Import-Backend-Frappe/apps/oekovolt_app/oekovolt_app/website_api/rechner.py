# Copyright (c) 2026, ÖKOVOLT
#
# Lead-Gate der Website (Welle A11, Spezifikation #17–#19) -> DocType „Rechner Lead“, mit E-Mail-Bestätigung.
#
#   POST /api/method/oekovolt_app.website_api.rechner.submit_rechner_lead   (JSON, Rolle „Website API“)
#   POST /api/method/oekovolt_app.website_api.rechner.sende_bestaetigung    (JSON, Gast – „Erneut senden“)
#   POST /api/method/oekovolt_app.website_api.rechner.bestaetige_lead       (JSON, Gast – Link aus der Mail)
#
# Ablauf Double-Opt-in (bestaetigung = „double-opt-in“ oder „email“):
#   1. submit_rechner_lead legt den Lead an und schickt die Mail mit https://<website>/freischalten?token=…
#      (Token 24 h gültig, einmal verwendbar; gespeichert wird nur der sha256-Hash).
#   2. Die Website (A09: /freischalten, /api/lead-gate/bestaetigen) ruft bestaetige_lead(token) auf,
#      setzt bei {ok: true} ihr signiertes Freischalt-Cookie und leitet auf `rueckkehr` zurück.
#   3. Erst danach geht die Ergebnis-Mail (Ergebnis-Link) an den Kunden; unbestätigte Leads löscht
#      unbestaetigte_loeschen() nach 30 Tagen (täglicher Job, Eintrag in hooks.py – Übergabe A06).
# Ohne Bestätigungsmodus wird die Ergebnis-Mail sofort verschickt (Lead-Gate Stufe 1 ohne Double-Opt-in).
#
# Lead-Gate ohne Kopplung: Pflicht sind nur Vorname, Nachname, E-Mail (Art. 6 Abs. 1 lit. b DSGVO). Telefon nur mit
# dem freiwilligen Häkchen kontakt_ok. Keine Werbe-Einwilligung, kein Newsletter.
# Die Team-Mail kommt aus lead_eingang.after_insert (A06). Bei Double-Opt-in setzt dieses Modul das Flag
# `lead_eingang_aufschieben`; unterstützt lead_eingang das (AUFSCHUB_UNTERSTUETZT), wird der Eingang erst nach der
# Bestätigung verarbeitet – sonst wie bei allen anderen Leads sofort.

from datetime import timedelta

import frappe
from frappe.rate_limiter import rate_limit
from frappe.utils import add_days, cint, now_datetime

from oekovolt_app.website_api import format as fmt
from oekovolt_app.website_api.helfer import drosseln, kunde_bestaetigen, nur_website_api, pruefen

DOCTYPE = "Rechner Lead"
_LEAD_NAME = r"^RL-\d{4}-\d{5,6}$"

# Gastmethoden: Sicherheitsnetz je aufrufender IP (alle Besucher kommen über den Next-Server)
LIMIT_JE_SERVER_IP = 120
LIMIT_SEKUNDEN = 600


def _basis():
	return fmt.website_basis(frappe.conf.get("oekovolt_website_url"))


def _mail_drossel_schluessel(email):
	"""Drossel je E-Mail ohne Klartext im Redis-Schlüssel."""
	return fmt.token_hash(fmt.lead_schluessel(email) or email)[:32]


def _bestaetigung_senden(doc, token):
	"""Bestätigungsmail (Link mit Token). Ohne Kundenmails (oekovolt_keine_kundenmail) im Entwicklermodus nur ins Log."""
	link = fmt.bestaetigungs_link(token, _basis())
	if frappe.conf.get("oekovolt_keine_kundenmail"):
		if frappe.conf.get("developer_mode"):
			frappe.logger("oekovolt_app").info(f"Rechner Lead {doc.name}: Bestätigungslink (nur Entwicklung) {link}")
		return False
	betreff, html = fmt.kunden_mail_bestaetigung(doc.as_dict(), link)
	kunde_bestaetigen(doc.email, betreff, html, DOCTYPE, doc.name)
	return True


def _ergebnis_senden(doc):
	betreff, html = fmt.kunden_mail_rechner(doc.as_dict(), doc.name, _basis())
	kunde_bestaetigen(doc.email, betreff, html, DOCTYPE, doc.name)


def _token_setzen(doc_name, jetzt, token=None):
	"""Token erzeugen (oder das der Website übernehmen), Hash + Ablauf speichern -> Klartext-Token (nur für den Link)."""
	if token:
		hashwert = fmt.token_hash(token)
	else:
		token, hashwert = fmt.token_erzeugen()
	anzahl = cint(frappe.db.get_value(DOCTYPE, doc_name, "bestaetigung_anzahl")) + 1
	frappe.db.set_value(DOCTYPE, doc_name, {
		"bestaetigungs_token": hashwert,
		"token_gueltig_bis": jetzt + timedelta(hours=fmt.TOKEN_GUELTIG_STUNDEN),
		"bestaetigung_gesendet_am": jetzt,
		"bestaetigung_anzahl": anzahl,
	}, update_modified=False)
	return token


def _lead_eingang_nachholen(doc):
	"""Nach der Bestätigung: Scoring/Routing/Team-Mail nachholen, falls lead_eingang den Aufschub unterstützt."""
	try:
		from oekovolt_app.website_api import lead_eingang

		if getattr(lead_eingang, "AUFSCHUB_UNTERSTUETZT", False):
			lead_eingang.after_insert(doc, "bestaetigt")
	except Exception:
		frappe.log_error(title=f"Rechner Lead {doc.name}: Eingang nach Bestätigung fehlgeschlagen")


# ---------------------------------------------------------------- #17 submit_rechner_lead


@frappe.whitelist(methods=["POST"])
def submit_rechner_lead(**kwargs):
	nur_website_api()
	d = frappe.form_dict
	if fmt.ist_honeypot(d):
		return {"ok": True, "lead_id": None, "bestaetigung": "nicht_noetig"}

	daten = pruefen(fmt.pruefe_rechner_lead, d)
	# Drossel zählt nur gültige Anfragen: je Besucher-IP und zusätzlich je E-Mail (Firmen-IP mit vielen Mitarbeitenden)
	ip = fmt.ip_sauber(d.get("ip_adresse"))
	drosseln("rechner", ip)
	drosseln("rechner-mail", _mail_drossel_schluessel(daten["email"]))

	jetzt = now_datetime()
	doc = frappe.get_doc({"doctype": DOCTYPE, "status": "Neu", "ip_adresse": ip, **daten})
	doc.flags.von_website = True
	doi = bool(daten["bestaetigung_erforderlich"])
	if doi:
		doc.flags.lead_eingang_aufschieben = True
	doc.insert(ignore_permissions=True)

	# Die Website signiert ihren eigenen Token und prüft ihn auf /freischalten – deshalb muss die Mail genau
	# diesen Token enthalten (sonst lehnt die Website den Link ab). Ohne Website-Link: eigenes Token.
	token = _token_setzen(doc.name, jetzt, fmt.website_token_aus_link(d.get("bestaetigungs_link"))) if doi else None
	frappe.db.commit()

	if doi:
		doc.reload()
		gesendet = _bestaetigung_senden(doc, token)
		return {"ok": True, "lead_id": doc.name, "bestaetigung": "gesendet" if gesendet else "aus"}
	_ergebnis_senden(doc)
	return {"ok": True, "lead_id": doc.name, "bestaetigung": "nicht_noetig"}


# ---------------------------------------------------------------- #18 sende_bestaetigung („Erneut senden“)


@frappe.whitelist(allow_guest=True, methods=["POST"])
@rate_limit(limit=LIMIT_JE_SERVER_IP, seconds=LIMIT_SEKUNDEN)
def sende_bestaetigung(**kwargs):
	"""Bestätigungsmail erneut senden: lead (RL-…) + email müssen zusammenpassen.

	Antwort immer {ok: true, gesendet: bool} – ob es den Lead gibt, verrät sie nicht. Frühestens 60 s nach der
	letzten Mail, höchstens 5 Mails je Lead; Drossel je Besucher-IP und je E-Mail."""
	import re

	d = frappe.form_dict
	if fmt.ist_honeypot(d):
		return {"ok": True, "gesendet": False}
	drosseln("bestaetigung", fmt.ip_sauber(d.get("ip_adresse")))
	lead = fmt.sauber(d.get("lead"), 20)
	email = fmt.sauber(d.get("email"), 200).lower()
	if not re.match(_LEAD_NAME, lead) or not fmt.email_gueltig(email):
		return {"ok": True, "gesendet": False}
	drosseln("bestaetigung-mail", _mail_drossel_schluessel(email))

	row = frappe.db.get_value(
		DOCTYPE, lead,
		["name", "email", "bestaetigt", "bestaetigung_erforderlich", "bestaetigung_gesendet_am", "bestaetigung_anzahl"],
		as_dict=True,
	)
	if not row or (row.email or "").lower() != email or not cint(row.bestaetigung_erforderlich):
		return {"ok": True, "gesendet": False}
	if cint(row.bestaetigt):
		return {"ok": True, "gesendet": False, "bestaetigt": True}
	jetzt = now_datetime()
	if not fmt.erneut_senden_erlaubt(row.bestaetigung_gesendet_am, jetzt, row.bestaetigung_anzahl):
		return {"ok": True, "gesendet": False}

	token = _token_setzen(row.name, jetzt)
	frappe.db.commit()
	doc = frappe.get_doc(DOCTYPE, row.name)
	return {"ok": True, "gesendet": _bestaetigung_senden(doc, token)}


# ---------------------------------------------------------------- #19 bestaetige_lead (Link aus der Mail)


@frappe.whitelist(allow_guest=True, methods=["POST"])
@rate_limit(limit=LIMIT_JE_SERVER_IP, seconds=LIMIT_SEKUNDEN)
def bestaetige_lead(**kwargs):
	"""Token prüfen (Hash + Ablauf + einmalig) und den Lead bestätigen.

	-> {ok: true, lead_id, kennung, rueckkehr} oder {ok: false, grund: verwendet|abgelaufen|ungueltig, meldung}.
	Bei „verwendet“ kommen kennung und rueckkehr mit, damit die Website zurückverlinken kann. Keine Personendaten."""
	d = frappe.form_dict
	drosseln("bestaetigung", fmt.ip_sauber(d.get("ip_adresse")))
	token = fmt.sauber(d.get("token"), fmt.TOKEN_MAX_LAENGE)
	if not fmt.token_format_gueltig(token):
		return {"ok": False, "grund": "ungueltig", "meldung": fmt.TOKEN_MELDUNGEN["ungueltig"]}

	treffer = frappe.get_all(
		DOCTYPE,
		filters={"bestaetigungs_token": fmt.token_hash(token)},
		fields=["name", "bestaetigt", "token_gueltig_bis", "rechner", "rueckkehr"],
		limit=1,
	)
	row = treffer[0] if treffer else None
	zustand = fmt.token_pruefen(row, now_datetime())
	if zustand != "ok":
		antwort = {"ok": False, "grund": zustand, "meldung": fmt.TOKEN_MELDUNGEN[zustand]}
		if zustand == "verwendet":
			antwort.update({"lead_id": row.name, "kennung": row.rechner, "rueckkehr": row.rueckkehr or ""})
		return antwort

	frappe.db.set_value(DOCTYPE, row.name, {
		"bestaetigt": 1,
		"bestaetigt_am": now_datetime(),
		"token_gueltig_bis": None,  # Hash bleibt, damit ein zweiter Klick als „verwendet“ erkannt wird
	}, update_modified=False)
	frappe.db.commit()

	doc = frappe.get_doc(DOCTYPE, row.name)
	_ergebnis_senden(doc)
	_lead_eingang_nachholen(doc)
	return {"ok": True, "lead_id": doc.name, "kennung": doc.rechner, "rueckkehr": doc.rueckkehr or ""}


# ---------------------------------------------------------------- Aufräumen (scheduler_events daily)


def unbestaetigte_loeschen():
	"""Täglich: Rechner Leads mit Double-Opt-in, die nach 30 Tagen nicht bestätigt sind, endgültig löschen
	(inkl. E-Mail-Warteschlange, Kommentare, Versionen, Benachrichtigungen). Eintrag in hooks.py: Übergabe A06."""
	stichtag = add_days(now_datetime(), -fmt.UNBESTAETIGT_LOESCHEN_TAGE)
	namen = frappe.get_all(
		DOCTYPE,
		filters={"bestaetigung_erforderlich": 1, "bestaetigt": 0, "creation": ["<", stichtag]},
		pluck="name",
		limit=5000,
	)
	if not namen:
		return
	try:
		queue = frappe.get_all("Email Queue", filters={"reference_doctype": DOCTYPE, "reference_name": ["in", namen]}, pluck="name")
		if queue:
			frappe.db.delete("Email Queue Recipient", {"parent": ["in", queue]})
			frappe.db.delete("Email Queue", {"name": ["in", queue]})
		frappe.db.delete("Comment", {"reference_doctype": DOCTYPE, "reference_name": ["in", namen]})
		frappe.db.delete("Version", {"ref_doctype": DOCTYPE, "docname": ["in", namen]})
		frappe.db.delete("Notification Log", {"document_type": DOCTYPE, "document_name": ["in", namen]})
		for name in namen:
			frappe.delete_doc(DOCTYPE, name, ignore_permissions=True, force=True, delete_permanently=True)
		frappe.db.commit()
	except Exception:
		frappe.db.rollback()
		frappe.log_error(title="Rechner Lead: unbestätigte Leads konnten nicht gelöscht werden")
