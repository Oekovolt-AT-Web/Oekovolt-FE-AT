# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik
#
# Whitelisted API der Ausspielkanäle – aufgerufen ausschließlich serverseitig von der Website
# (src/lib/kanaele/frappe.js). Pfad: oekovoltdeutchland/oekovoltdeutchland/doctype/veroeffentlichung/api.py
#
# Der API-User der Website braucht die Rolle "Kanal Webservice" (ohne Desk-Zugriff).

import hashlib
import json

import frappe
import requests
from frappe import _
from frappe.utils import cint, cstr, now_datetime

ROLLE_WEB = "Kanal Webservice"
KONTEN = ("oekovolt", "ratgeber")
THEMEN = ("news", "ratgeber", "foerderung", "aktionen", "jobs")

FELDER_OEFFENTLICH = [
	"slug", "titel", "kategorie", "veroeffentlicht_am", "modified", "ort", "teaser", "inhalt", "bild", "bild_alt",
	"hashtags", "anhang", "anhang_name", "auf_website", "im_rss_feed", "im_fediverse", "auf_tv",
	"tv_dauer_sekunden", "tv_prioritaet", "tv_hervorhebung", "tv_anzeigen_bis", "tv_standorte", "tv_qr_link",
]
KANAL_FELD = {"website": "auf_website", "rss": "im_rss_feed", "tv": "auf_tv", "fediverse": "im_fediverse"}


def _nur_web():
	roles = frappe.get_roles()
	if ROLLE_WEB not in roles and "System Manager" not in roles:
		frappe.throw(_("Nicht berechtigt"), frappe.PermissionError)


def _hash(endpoint):
	return hashlib.sha256(cstr(endpoint).encode()).hexdigest()


def website_anstossen():
	"""Ruft den Verteil-Webhook der Website auf (Cache leeren, Push senden, Fediverse zustellen).
	site_config.json: "oekovolt_kanal_webhook": "https://www.oekovolt.com/api/kanaele/verteilen",
	                  "oekovolt_kanal_secret": "<KANAL_WEBHOOK_SECRET>"
	"""
	url = frappe.conf.get("oekovolt_kanal_webhook")
	secret = frappe.conf.get("oekovolt_kanal_secret")
	if not url or not secret:
		return
	try:
		requests.post(url, headers={"X-Kanal-Secret": secret}, timeout=280)
	except Exception:
		frappe.log_error(title="Website-Webhook (Kanäle) nicht erreichbar")


def nach_speichern(doc, method=None):
	"""doc_events-Hook für Veroeffentlichung: bei Veröffentlichung/Änderung Website anstoßen."""
	if doc.status in ("Veröffentlicht", "Archiviert"):
		frappe.enqueue(website_anstossen, queue="short", enqueue_after_commit=True)


# ---------------------------------------------------------------- Veröffentlichungen

@frappe.whitelist(methods=["POST"])
def liste(**kwargs):
	_nur_web()
	d = frappe.form_dict
	feld = KANAL_FELD.get(d.get("kanal"), "auf_website")
	filters = {"status": "Veröffentlicht", feld: 1, "veroeffentlicht_am": ["<=", now_datetime()]}
	if d.get("kategorie"):
		filters["kategorie"] = d.get("kategorie")
	return frappe.get_all(
		"Veroeffentlichung",
		filters=filters,
		fields=FELDER_OEFFENTLICH,
		order_by="veroeffentlicht_am desc",
		limit_page_length=min(cint(d.get("limit")) or 50, 100),
	)


@frappe.whitelist(methods=["POST"])
def detail(**kwargs):
	_nur_web()
	slug = cstr(frappe.form_dict.get("slug"))[:100]
	treffer = frappe.get_all(
		"Veroeffentlichung",
		filters={"slug": slug, "status": "Veröffentlicht", "veroeffentlicht_am": ["<=", now_datetime()]},
		fields=FELDER_OEFFENTLICH,
		limit_page_length=1,
	)
	return treffer[0] if treffer else None


# ---------------------------------------------------------------- Push

@frappe.whitelist(methods=["POST"])
def push_abo_speichern(**kwargs):
	_nur_web()
	d = frappe.form_dict
	endpoint = cstr(d.get("endpoint"))[:1000]
	themen = ",".join(t for t in cstr(d.get("themen")).split(",") if t in THEMEN)
	if not endpoint.startswith("https://") or not themen:
		frappe.throw(_("Ungültiges Abo"))
	h = _hash(endpoint)
	name = frappe.db.get_value("Push Abonnement", {"endpoint_hash": h})
	werte = {"p256dh": cstr(d.get("p256dh"))[:200], "auth": cstr(d.get("auth"))[:60], "themen": themen}
	if name:
		frappe.db.set_value("Push Abonnement", name, werte)
	else:
		frappe.get_doc({"doctype": "Push Abonnement", "endpoint": endpoint, "endpoint_hash": h, "erstellt_am": now_datetime(), **werte}).insert(ignore_permissions=True)
	frappe.db.commit()
	return True


@frappe.whitelist(methods=["POST"])
def push_abo_loeschen(**kwargs):
	_nur_web()
	frappe.db.delete("Push Abonnement", {"endpoint_hash": _hash(frappe.form_dict.get("endpoint"))})
	frappe.db.commit()
	return True


@frappe.whitelist(methods=["POST"])
def push_abo_ersetzen(**kwargs):
	_nur_web()
	d = frappe.form_dict
	name = frappe.db.get_value("Push Abonnement", {"endpoint_hash": _hash(d.get("alt"))})
	if not name:
		return False
	frappe.db.set_value("Push Abonnement", name, {
		"endpoint": cstr(d.get("endpoint"))[:1000],
		"endpoint_hash": _hash(d.get("endpoint")),
		"p256dh": cstr(d.get("p256dh"))[:200],
		"auth": cstr(d.get("auth"))[:60],
	})
	frappe.db.commit()
	return True


@frappe.whitelist(methods=["POST"])
def push_abos(**kwargs):
	_nur_web()
	d = frappe.form_dict
	thema = cstr(d.get("thema"))
	limit = min(cint(d.get("limit")) or 500, 1000)
	filters = {} if thema in ("", "Alle Abonnenten") else {"themen": ["like", f"%{thema}%"]}
	return frappe.get_all(
		"Push Abonnement",
		filters=filters,
		fields=["endpoint", "p256dh", "auth"],
		order_by="creation asc",
		limit_start=cint(d.get("seite")) * limit,
		limit_page_length=limit,
	)


@frappe.whitelist(methods=["POST"])
def push_abos_entfernen(**kwargs):
	_nur_web()
	endpoints = frappe.form_dict.get("endpoints") or []
	if isinstance(endpoints, str):
		endpoints = json.loads(endpoints)
	for e in endpoints[:5000]:
		frappe.db.delete("Push Abonnement", {"endpoint_hash": _hash(e)})
	frappe.db.commit()
	return len(endpoints)


@frappe.whitelist(methods=["POST"])
def faellige_push(**kwargs):
	"""Fällige Nachrichten atomar auf „Wird gesendet“ setzen und zurückgeben."""
	_nur_web()
	jetzt = now_datetime()
	namen = frappe.db.sql(
		"""select name from `tabPush Nachricht`
		   where status = 'Jetzt senden' or (status = 'Geplant' and senden_am <= %s)
		   order by creation limit 10 for update""",
		(jetzt,),
		pluck=True,
	)
	ergebnis = []
	for name in namen:
		frappe.db.set_value("Push Nachricht", name, "status", "Wird gesendet", update_modified=False)
		n = frappe.db.get_value("Push Nachricht", name, ["name", "titel", "text", "link", "bild", "thema"], as_dict=True)
		n["thema"] = "" if n.thema == "Alle Abonnenten" else n.thema
		ergebnis.append(n)
	frappe.db.commit()
	return ergebnis


@frappe.whitelist(methods=["POST"])
def push_gesendet(**kwargs):
	_nur_web()
	d = frappe.form_dict
	frappe.db.set_value("Push Nachricht", d.get("name"), {
		"status": "Fehler" if d.get("fehler") else "Gesendet",
		"gesendet_am": now_datetime(),
		"erfolgreich": cint(d.get("erfolgreich")),
		"fehlgeschlagen": cint(d.get("fehlgeschlagen")),
		"entfernt": cint(d.get("entfernt")),
		"fehler": cstr(d.get("fehler"))[:140],
	})
	frappe.db.commit()
	return True


# ---------------------------------------------------------------- Fediverse

@frappe.whitelist(methods=["POST"])
def ap_follower_speichern(**kwargs):
	_nur_web()
	d = frappe.form_dict
	konto = d.get("konto")
	actor_url = cstr(d.get("actor_url"))[:500]
	if konto not in KONTEN or not actor_url.startswith("https://"):
		frappe.throw(_("Ungültig"))
	name = frappe.db.get_value("Fediverse Follower", {"konto": konto, "actor_url": actor_url})
	werte = {
		"inbox": cstr(d.get("inbox"))[:500],
		"shared_inbox": cstr(d.get("shared_inbox"))[:500],
		"handle": cstr(d.get("handle"))[:200],
		"anzeigename": cstr(d.get("name"))[:140],
	}
	if name:
		frappe.db.set_value("Fediverse Follower", name, werte)
	else:
		frappe.get_doc({"doctype": "Fediverse Follower", "konto": konto, "actor_url": actor_url, "seit": now_datetime(), **werte}).insert(ignore_permissions=True)
	frappe.db.commit()
	return True


@frappe.whitelist(methods=["POST"])
def ap_follower_loeschen(**kwargs):
	_nur_web()
	d = frappe.form_dict
	filters = {"actor_url": cstr(d.get("actor_url"))}
	if d.get("konto"):
		filters["konto"] = d.get("konto")
	frappe.db.delete("Fediverse Follower", filters)
	frappe.db.commit()
	return True


@frappe.whitelist(methods=["POST"])
def ap_followers(**kwargs):
	_nur_web()
	d = frappe.form_dict
	limit = min(cint(d.get("limit")) or 500, 1000)
	return frappe.get_all(
		"Fediverse Follower",
		filters={"konto": d.get("konto")},
		fields=["inbox", "shared_inbox"],
		order_by="creation asc",
		limit_start=cint(d.get("seite")) * limit,
		limit_page_length=limit,
	)


@frappe.whitelist(methods=["POST"])
def ap_follower_anzahl(**kwargs):
	_nur_web()
	return frappe.db.count("Fediverse Follower", {"konto": frappe.form_dict.get("konto")})


# ---------------------------------------------------------------- Verteilprotokoll

@frappe.whitelist(methods=["POST"])
def verteilt_pruefen(**kwargs):
	_nur_web()
	ids = frappe.form_dict.get("objekt_ids") or []
	if isinstance(ids, str):
		ids = json.loads(ids)
	if not ids:
		return []
	return frappe.get_all("Verteilprotokoll", filters={"objekt_id": ["in", ids[:200]]}, pluck="objekt_id")


@frappe.whitelist(methods=["POST"])
def verteilt_reservieren(**kwargs):
	"""Legt den Protokolleintrag an. False, wenn schon vorhanden (Eindeutigkeit über objekt_id)."""
	_nur_web()
	d = frappe.form_dict
	try:
		frappe.get_doc({
			"doctype": "Verteilprotokoll",
			"kanal": d.get("kanal") if d.get("kanal") in ("Fediverse", "Push") else "Fediverse",
			"objekt_id": cstr(d.get("objekt_id"))[:140],
			"status": "Reserviert",
			"zeitpunkt": now_datetime(),
		}).insert(ignore_permissions=True)
		frappe.db.commit()
		return True
	except frappe.DuplicateEntryError:
		frappe.db.rollback()
		return False


@frappe.whitelist(methods=["POST"])
def verteilt_abschliessen(**kwargs):
	_nur_web()
	d = frappe.form_dict
	name = frappe.db.get_value("Verteilprotokoll", {"objekt_id": cstr(d.get("objekt_id"))})
	if name:
		frappe.db.set_value("Verteilprotokoll", name, {
			"status": "Fehler" if d.get("fehler") else "Verteilt",
			"empfaenger": cint(d.get("empfaenger")),
			"erfolgreich": cint(d.get("erfolgreich")),
			"fehlgeschlagen": cint(d.get("fehlgeschlagen")),
			"fehler": cstr(d.get("fehler"))[:140],
		})
		frappe.db.commit()
	return True
