# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik
#
# QR-Handshake „Unterlagen per Smartphone“ – whitelisted API für die Website.
# Pfad: oekovoltdeutchland/oekovoltdeutchland/doctype/solar_lead/api.py
#
# Die Website übergibt NIE das Token selbst, sondern nur dessen SHA-256-Hash.
# Aufrufer: API-User mit Rolle "Kontakt Webformular" (keine Leserechte auf Solar Lead).

import base64
import re

import frappe
from frappe import _
from frappe.utils import add_months, add_to_date, cint, cstr, flt, get_datetime, now_datetime

from oekovoltdeutchland.oekovoltdeutchland.doctype.rueckruf.api import herkunft_felder, nur_webformular, team_benachrichtigen, text

FELDER = {
	"zaehler": "zaehler_foto",
	"rechnung": "rechnung_foto",
	"rechnung_2": "rechnung_foto_2",
	"schaltschrank": "schaltschrank_foto",
	"dach": "dach_foto",
}
ENDUNG = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic", "application/pdf": "pdf"}
MAX_BYTES = 8 * 1024 * 1024


def _lead(token_hash, sperren=False):
	token_hash = cstr(token_hash)
	if not re.fullmatch(r"[0-9a-f]{64}", token_hash):
		return None
	name = frappe.db.get_value("Solar Lead", {"token_hash": token_hash}, "name", for_update=sperren)
	return frappe.get_doc("Solar Lead", name) if name else None


def _gueltig(doc):
	return doc.phase == "eingegangen" or (doc.gueltig_bis and get_datetime(doc.gueltig_bis) > now_datetime())


# ---------------------------------------------------------------- API

@frappe.whitelist(methods=["POST"])
def sitzung_starten(**kwargs):
	nur_webformular()
	d = frappe.form_dict
	token_hash = cstr(d.get("token_hash"))
	if not re.fullmatch(r"[0-9a-f]{64}", token_hash):
		frappe.throw(_("Ungültig"))
	minuten = min(max(cint(d.get("gueltig_minuten")) or 45, 5), 120)
	doc = frappe.get_doc({
		"doctype": "Solar Lead",
		"token_hash": token_hash,
		"status": "Wartet auf Unterlagen",
		"phase": "offen",
		"gueltig_bis": add_to_date(now_datetime(), minutes=minuten),
		"kontakt_name": text(d.get("name"), 120),
		"email": text(d.get("email"), 190),
		"telefon": text(d.get("telefon"), 20),
		"plz": text(d.get("plz"), 10),
		"quelle": text(d.get("quelle"), 40),
		"seite": text(d.get("seite"), 300),
		"kwp": flt(d.get("kwp")),
		"verbrauch_rechner": cint(d.get("verbrauch")),
		"speicher_kwh": flt(d.get("speicher_kwh")),
		"ausrichtung": text(d.get("ausrichtung"), 20),
		"neigung": text(d.get("neigung"), 20),
		**herkunft_felder(d),
		"loeschung_faellig": add_months(now_datetime().date(), 12),
	})
	doc.insert(ignore_permissions=True)
	frappe.db.commit()
	return {"ok": True}


@frappe.whitelist(methods=["POST"])
def sitzung_status(**kwargs):
	nur_webformular()
	doc = _lead(frappe.form_dict.get("token_hash"))
	if not doc:
		return None
	ki = {"status": doc.ki_status or "keine"}
	if doc.ki_status == "fertig":
		ki.update({"jahresverbrauch": doc.jahresverbrauch or None, "arbeitspreis_ct": doc.arbeitspreis_ct or None, "anbieter": doc.anbieter or None})
	return {
		"gueltig": bool(_gueltig(doc)),
		"phase": doc.phase,
		"fotos": {k: bool(doc.get(f)) for k, f in FELDER.items()},
		"ki": ki,
	}


@frappe.whitelist(methods=["POST"])
def sitzung_verbunden(**kwargs):
	nur_webformular()
	doc = _lead(frappe.form_dict.get("token_hash"))
	if not doc or not _gueltig(doc):
		return False
	if doc.phase == "offen":
		frappe.db.set_value("Solar Lead", doc.name, "phase", "verbunden", update_modified=False)
		frappe.db.commit()
	return True


@frappe.whitelist(methods=["POST"])
def foto_speichern(**kwargs):
	nur_webformular()
	d = frappe.form_dict
	doc = _lead(d.get("token_hash"), sperren=True)
	if not doc or not _gueltig(doc) or doc.phase == "eingegangen":
		frappe.throw(_("Sitzung abgelaufen"), frappe.ValidationError)
	feld = FELDER.get(cstr(d.get("feld")))
	mime = cstr(d.get("mime"))
	if not feld or mime not in ENDUNG or (mime == "application/pdf" and not feld.startswith("rechnung")):
		frappe.throw(_("Ungültige Datei"))
	inhalt = base64.b64decode(cstr(d.get("datei_base64")), validate=True)
	if not inhalt or len(inhalt) > MAX_BYTES:
		frappe.throw(_("Ungültige Datei"))

	# Vorheriges Foto dieses Feldes ersetzen
	alt = doc.get(feld)
	if alt:
		for f in frappe.get_all("File", filters={"attached_to_doctype": "Solar Lead", "attached_to_name": doc.name, "file_url": alt}, pluck="name"):
			frappe.delete_doc("File", f, ignore_permissions=True, force=True)

	datei = frappe.get_doc({
		"doctype": "File",
		"file_name": f"{doc.name}-{cstr(d.get('feld'))}.{ENDUNG[mime]}",
		"attached_to_doctype": "Solar Lead",
		"attached_to_name": doc.name,
		"attached_to_field": feld,
		"is_private": 1,
		"content": inhalt,
	}).insert(ignore_permissions=True)
	frappe.db.set_value("Solar Lead", doc.name, {feld: datei.file_url, "phase": "fotos"}, update_modified=False)
	frappe.db.commit()
	return True


@frappe.whitelist(methods=["POST"])
def sitzung_abschliessen(**kwargs):
	nur_webformular()
	d = frappe.form_dict
	doc = _lead(d.get("token_hash"), sperren=True)
	if not doc or not _gueltig(doc):
		frappe.throw(_("Sitzung abgelaufen"), frappe.ValidationError)
	if not (doc.zaehler_foto and doc.rechnung_foto):
		frappe.throw(_("Pflichtfotos fehlen"))
	if doc.phase == "eingegangen":
		return True

	ki = 1 if cint(d.get("ki_einwilligung")) else 0
	doc.update({
		"phase": "eingegangen",
		"status": "Neu",
		"eingegangen_am": now_datetime(),
		"zaehlerstand": flt(d.get("zaehlerstand")) or None,
		"zaehlerstand_ocr": text(d.get("zaehlerstand_ocr"), 40),
		"ki_einwilligung": ki,
		"ki_status": "wartet" if ki and frappe.conf.get("anthropic_api_key") else "keine",
	})
	doc.save(ignore_permissions=True)
	frappe.db.commit()

	if doc.ki_status == "wartet":
		frappe.enqueue(
			"oekovoltdeutchland.oekovoltdeutchland.doctype.solar_lead.ki.analysieren",
			queue="long",
			timeout=300,
			name=doc.name,
			enqueue_after_commit=True,
		)

	fotos = [label for label, feld in [("Zähler", "zaehler_foto"), ("Rechnung", "rechnung_foto"), ("Zählerschrank", "schaltschrank_foto"), ("Dach", "dach_foto")] if doc.get(feld)]
	team_benachrichtigen(
		"Vertrieb",
		f"Neue Anfrage mit Unterlagen: {doc.kontakt_name} · PLZ {doc.plz or '–'}",
		f"<p><b>{frappe.utils.escape_html(doc.kontakt_name)}</b> · {frappe.utils.escape_html(doc.email)} · {frappe.utils.escape_html(doc.telefon or '–')}</p>"
		f"<p>Unterlagen: {', '.join(fotos)}<br>Rechner: {doc.kwp or '–'} kWp · {doc.verbrauch_rechner or '–'} kWh · Speicher {doc.speicher_kwh or 0} kWh"
		f"<br>Zählerstand: {doc.zaehlerstand or '–'} · KI-Auswertung: {'ja' if ki else 'nein'}</p>"
		f"<p><a href='{frappe.utils.get_url_to_form('Solar Lead', doc.name)}'>Im Backoffice öffnen</a></p>",
		"Solar Lead",
		doc.name,
	)
	return True


# ---------------------------------------------------------------- Aufräumen

def aufraeumen():
	"""Täglicher Scheduler-Job:
	- nicht abgeschlossene Sitzungen 24 h nach Ablauf samt Fotos löschen
	- Leads ohne Fortschritt nach 12 Monaten löschen"""
	jetzt = now_datetime()
	offen = frappe.get_all("Solar Lead", filters={"phase": ["!=", "eingegangen"], "gueltig_bis": ["<", add_to_date(jetzt, hours=-24)]}, pluck="name")
	alt = frappe.get_all("Solar Lead", filters={"loeschung_faellig": ["<=", jetzt.date()], "status": ["in", ["Neu", "In Prüfung", "Verloren"]]}, pluck="name")
	for name in set(offen + alt):
		for f in frappe.get_all("File", filters={"attached_to_doctype": "Solar Lead", "attached_to_name": name}, pluck="name"):
			frappe.delete_doc("File", f, ignore_permissions=True, force=True)
		frappe.delete_doc("Solar Lead", name, ignore_permissions=True, force=True, delete_permanently=True)
		frappe.db.delete("Version", {"ref_doctype": "Solar Lead", "docname": name})
	if offen or alt:
		frappe.db.commit()
