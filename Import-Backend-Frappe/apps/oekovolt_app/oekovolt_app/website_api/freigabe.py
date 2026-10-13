# Copyright (c) 2026, ÖKOVOLT
#
# Referenz-Freigabe per Einmal-Link (Welle A07). Vertrag: docs/frappe-referenzfreigabe/README.md
#
#   POST /api/method/oekovolt_app.website_api.freigabe.freigabe_lesen      (Gast, rate_limit)  {token}
#   POST /api/method/oekovolt_app.website_api.freigabe.freigabe_speichern  (Gast, rate_limit)  {token, auswahl}
#   POST /api/method/oekovolt_app.website_api.freigabe.widerrufen          (Gast, rate_limit)  {token}
#   GET  /api/method/oekovolt_app.website_api.freigabe.get_freigaben       (Rolle „Website API“)
#   POST /api/method/oekovolt_app.website_api.freigabe.neuer_link          (Rollen Vertrieb/Marketing) {name}
#
# Die Website (src/lib/kundenbuehneServer.js) ruft die Gast-Methoden serverseitig OHNE API-Token auf
# und schickt die Besucher-IP als ip_adresse mit. Deshalb zwei Drosselstufen wie bei buche_termin:
# @rate_limit je aufrufender IP (Next-Server) und ein Zähler je Besucher-IP bzw. je Token.
# Whitelisted Methoden brauchen keinen Hook. Reine Logik in doctype/referenz_freigabe/freigabe_logik.py.

import frappe
from frappe import _
from frappe.rate_limiter import rate_limit
from frappe.utils import cstr, get_url_to_form, now_datetime

from oekovolt_app.oekovolt_app.doctype.referenz_freigabe import freigabe_logik as L
from oekovolt_app.oekovolt_app.doctype.referenz_freigabe.referenz_freigabe import CACHE_PRAEFIX, cache_leeren, website_basis
from oekovolt_app.website_api import format as fmt
from oekovolt_app.website_api.helfer import kunde_bestaetigen, nur_website_api, team_benachrichtigen

DOCTYPE = "Referenz Freigabe"
ROLLEN_DESK = ("Vertrieb", "Marketing")
CACHE_SEKUNDEN = 600

LIMIT_JE_SERVER_IP = 120
LIMIT_JE_BESUCHER = 10
LIMIT_SEKUNDEN = 600

UNGUELTIG = "Dieser Link ist nicht gültig oder bereits verbraucht."


# ---------------------------------------------------------------- Helfer


def _besucher_limit(bereich, schluessel):
	"""Höchstens LIMIT_JE_BESUCHER Aufrufe je Besucher-IP (bzw. je Token) in LIMIT_SEKUNDEN."""
	if not schluessel:
		return
	key = frappe.cache().make_key(f"oekovolt_freigabe_rl:{bereich}:{schluessel}")
	anzahl = frappe.cache().incrby(key, 1)
	if anzahl == 1:
		frappe.cache().expire(key, LIMIT_SEKUNDEN)
	if anzahl > LIMIT_JE_BESUCHER:
		frappe.throw(
			_("Zu viele Anfragen in kurzer Zeit – bitte versuchen Sie es in einigen Minuten erneut."),
			frappe.RateLimitExceededError,
		)


def _token_aus(form):
	token = cstr(form.get("token")).strip()
	if not L.token_gueltig(token):
		frappe.throw(UNGUELTIG, frappe.DoesNotExistError)
	return token


def _doc_zu_hash(feld, token):
	name = frappe.db.get_value(DOCTYPE, {feld: L.token_hash(token)}, "name")
	if not name:
		frappe.throw(UNGUELTIG, frappe.DoesNotExistError)
	return frappe.get_doc(DOCTYPE, name)


def _projekt(name):
	if not name:
		return {}
	return frappe.db.get_value(
		"Projekt", name, ["projekt_name", "projekt_website_name", "ort", "jahr", "leistung"], as_dict=True
	) or {}


def _nur_rollen(*rollen):
	vorhanden = set(frappe.get_roles())
	if not vorhanden.intersection(set(rollen) | {"System Manager"}):
		frappe.throw(_("Nicht berechtigt"), frappe.PermissionError)


# ---------------------------------------------------------------- Gast-Methoden (Website)


@frappe.whitelist(allow_guest=True, methods=["POST"])
@rate_limit(limit=LIMIT_JE_SERVER_IP, seconds=LIMIT_SEKUNDEN)
def freigabe_lesen(token=None, ip_adresse=None):
	"""Daten für die Freigabeseite – ohne E-Mail, ohne Hash. Liest nur, verbraucht den Link nicht."""
	d = frappe.form_dict
	_besucher_limit("lesen", fmt.ip_sauber(d.get("ip_adresse")))
	token = _token_aus(d)
	doc = _doc_zu_hash("token_hash", token)
	return L.fuer_seite(doc, _projekt(doc.projekt), now_datetime())


@frappe.whitelist(allow_guest=True, methods=["POST"])
@rate_limit(limit=LIMIT_JE_SERVER_IP, seconds=LIMIT_SEKUNDEN)
def freigabe_speichern(token=None, auswahl=None, ip_adresse=None):
	"""
	Auswahl des Kunden speichern. Der Einmal-Token wird dabei verbraucht (token_hash geleert);
	der Widerruf läuft über einen zweiten Token in der Bestätigungsmail.
	Antwort: {"status": "freigegeben", "freigegeben_am": "…"}.
	"""
	d = frappe.form_dict
	ip = fmt.ip_sauber(d.get("ip_adresse"))
	_besucher_limit("speichern", ip)
	token = _token_aus(d)
	_besucher_limit("token", L.token_hash(token)[:16])

	try:
		daten = L.auswahl_pruefen(d.get("auswahl"))
	except L.EingabeFehler as fehler:
		frappe.throw(str(fehler), title=_("Bitte Eingaben prüfen"))

	# Zeile sperren, damit zwei gleichzeitige Aufrufe den Link nicht doppelt verbrauchen
	hash_wert = L.token_hash(token)
	zeile = frappe.db.sql(
		f"select name from `tab{DOCTYPE}` where token_hash = %s for update", (hash_wert,), as_dict=True
	)
	if not zeile:
		frappe.throw(UNGUELTIG, frappe.DoesNotExistError)
	doc = frappe.get_doc(DOCTYPE, zeile[0].name)
	jetzt = now_datetime()
	if not L.link_offen(doc.as_dict(), jetzt):
		frappe.throw(UNGUELTIG, frappe.DoesNotExistError)

	widerruf_token = L.token_erzeugen()
	for feld, wert in daten.items():
		doc.set(feld, wert)
	doc.freigegeben_am = jetzt
	doc.ip_kuerzel = L.ip_kuerzel(ip)
	doc.token_hash = None  # Einmal-Link verbraucht
	doc.widerruf_token_hash = L.token_hash(widerruf_token)
	doc.flags.ignore_permissions = True
	doc.save(ignore_permissions=True)
	frappe.db.commit()
	cache_leeren()

	projekt = _projekt(doc.projekt)
	titel = projekt.get("projekt_name") or doc.kunde_firma
	werte = doc.as_dict()
	betreff, html = L.bestaetigung_mail(werte, L.widerruf_url(website_basis(), widerruf_token), titel)
	kunde_bestaetigen(doc.email, betreff, html, DOCTYPE, doc.name)
	betreff, html = L.team_mail(werte, titel, get_url_to_form(DOCTYPE, doc.name))
	team_benachrichtigen(betreff, html, DOCTYPE, doc.name, reply_to=doc.email)
	return {"status": "freigegeben", "freigegeben_am": jetzt.strftime("%Y-%m-%d %H:%M")}


@frappe.whitelist(allow_guest=True, methods=["POST"])
@rate_limit(limit=LIMIT_JE_SERVER_IP, seconds=LIMIT_SEKUNDEN)
def widerrufen(token=None, ip_adresse=None):
	"""Widerruf über den Link der Bestätigungsmail: alle Freigaben auf 0, widerrufen_am gesetzt."""
	d = frappe.form_dict
	_besucher_limit("widerruf", fmt.ip_sauber(d.get("ip_adresse")))
	token = _token_aus(d)
	doc = _doc_zu_hash("widerruf_token_hash", token)
	if not doc.widerrufen_am:
		doc.widerrufen_am = now_datetime()
		for feld in L.SCHALTER:
			doc.set(feld, 0)
		doc.save(ignore_permissions=True)
		frappe.db.commit()
		cache_leeren()
		projekt = _projekt(doc.projekt)
		betreff, html = L.widerruf_mail(doc.as_dict(), projekt.get("projekt_name") or doc.kunde_firma, get_url_to_form(DOCTYPE, doc.name))
		team_benachrichtigen(betreff, html, DOCTYPE, doc.name, reply_to=doc.email)
	return {"status": "widerrufen", "widerrufen_am": doc.widerrufen_am.strftime("%Y-%m-%d %H:%M")}


# ---------------------------------------------------------------- Website-API (Token, Rolle „Website API“)


@frappe.whitelist(methods=["GET"])
def get_freigaben():
	"""Nur gültige (freigegebene, nicht widerrufene) Freigaben, ohne E-Mail: [{projekt_website_name, freigabe_*, zitat_text, …}]."""
	nur_website_api()
	cache = frappe.cache()
	key = CACHE_PRAEFIX + "liste"
	liste = cache.get_value(key)
	if liste is None:
		liste = _freigaben_laden()
		cache.set_value(key, liste, expires_in_sec=CACHE_SEKUNDEN)
	return liste


def _freigaben_laden():
	jetzt = now_datetime()
	rows = frappe.get_all(
		DOCTYPE,
		filters={"freigegeben_am": ["is", "set"], "widerrufen_am": ["is", "not set"]},
		fields=["name", "projekt"] + list(L.OEFFENTLICHE_FELDER) + ["widerrufen_am", "token_hash"],
		order_by="freigegeben_am desc",
	)
	ergebnis = {}
	for row in rows:
		if not L.ist_wirksam(row, jetzt):
			continue
		slug = frappe.db.get_value("Projekt", row.projekt, "projekt_website_name") if row.projekt else None
		if not slug or slug in ergebnis:
			continue  # je Projekt zählt die jüngste wirksame Freigabe
		ergebnis[slug] = L.fuer_website(row, slug)
	return list(ergebnis.values())


# ---------------------------------------------------------------- Desk (Vertrieb/Marketing)


@frappe.whitelist(methods=["POST"])
def neuer_link(name=None):
	"""Neuen Einmal-Link für einen bestehenden Datensatz erzeugen (alter Link wird ungültig)."""
	_nur_rollen(*ROLLEN_DESK)
	doc = frappe.get_doc(DOCTYPE, cstr(name))
	if doc.widerrufen_am:
		frappe.throw(_("Diese Freigabe wurde widerrufen – bitte einen neuen Datensatz anlegen."))
	link = doc.neuen_link_erzeugen()
	frappe.db.commit()
	return {"link": link, "gueltig_bis": cstr(doc.gueltig_bis)}
