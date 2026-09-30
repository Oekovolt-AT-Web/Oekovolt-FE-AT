# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik
#
# QR-Handshake „Unterlagen per Smartphone“ – whitelisted API für die Website.
# Pfad: oekovoltdeutchland/oekovoltdeutchland/doctype/solar_lead/api.py
#
# Die Website übergibt NIE das Token selbst, sondern nur dessen SHA-256-Hash.
# Aufrufer: API-User mit Rolle "Kontakt Webformular" (keine Leserechte auf Solar Lead).

import base64
import hashlib
import re
import secrets

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


# ---------------------------------------------------------------- Erinnerung & Fortsetzen
#
# Fehlen die Unterlagen 2 Stunden nach dem Start noch, geht EINMAL eine E-Mail mit einem
# Fortsetzen-Link raus. Das Link-Token (32 Byte) steht nur in der E-Mail; gespeichert wird
# sein SHA-256-Hash. Der Link ist 72 Stunden gültig und ändert beim Öffnen nichts –
# erst der Klick auf „Weiter“ erzeugt einen neuen Handy-Code (Schutz vor Link-Scannern
# in E-Mail-Programmen, die Links vorab aufrufen).

ERINNERUNG_NACH_STUNDEN = 2
ERINNERUNG_BIS_STUNDEN = 24
FORTSETZEN_STUNDEN = 72
FORTSETZEN_MAX = 10


def _fortsetzen_lead(fortsetzen_hash, sperren=False):
	fortsetzen_hash = cstr(fortsetzen_hash)
	if not re.fullmatch(r"[0-9a-f]{64}", fortsetzen_hash):
		return None
	name = frappe.db.get_value("Solar Lead", {"fortsetzen_hash": fortsetzen_hash}, "name", for_update=sperren)
	if not name:
		return None
	doc = frappe.get_doc("Solar Lead", name)
	if doc.phase == "eingegangen" or not doc.fortsetzen_bis or get_datetime(doc.fortsetzen_bis) < now_datetime():
		return None
	return doc


@frappe.whitelist(methods=["POST"])
def fortsetzen_info(**kwargs):
	"""Nur lesend: Daten für die Fortsetzen-Seite (Vorname, Rechnerwerte, vorhandene Fotos)."""
	nur_webformular()
	doc = _fortsetzen_lead(frappe.form_dict.get("fortsetzen_hash"))
	if not doc:
		return None
	return {
		"vorname": (doc.kontakt_name or "").split(" ")[0][:40],
		"kwp": doc.kwp or None,
		"verbrauch": doc.verbrauch_rechner or None,
		"speicher_kwh": doc.speicher_kwh or None,
		"fotos": {k: bool(doc.get(f)) for k, f in FELDER.items()},
	}


@frappe.whitelist(methods=["POST"])
def fortsetzen_starten(**kwargs):
	"""Neuen Handy-Code für eine offene Sitzung setzen (alter Code wird damit ungültig)."""
	nur_webformular()
	d = frappe.form_dict
	doc = _fortsetzen_lead(d.get("fortsetzen_hash"), sperren=True)
	token_hash = cstr(d.get("token_hash"))
	if not doc or not re.fullmatch(r"[0-9a-f]{64}", token_hash) or cint(doc.fortsetzen_anzahl) >= FORTSETZEN_MAX:
		return False
	minuten = min(max(cint(d.get("gueltig_minuten")) or 45, 5), 120)
	frappe.db.set_value(
		"Solar Lead",
		doc.name,
		{
			"token_hash": token_hash,
			"gueltig_bis": add_to_date(now_datetime(), minutes=minuten),
			"ueber_erinnerung": 1,
			"fortsetzen_anzahl": cint(doc.fortsetzen_anzahl) + 1,
		},
		update_modified=False,
	)
	frappe.db.commit()
	return True


def erinnerungen_senden():
	"""Scheduler (alle 15 Minuten): einmalige Erinnerung für abgebrochene Uploads."""
	jetzt = now_datetime()
	kandidaten = frappe.get_all(
		"Solar Lead",
		filters={
			"phase": ["!=", "eingegangen"],
			"erinnerung_gesendet_am": ["is", "not set"],
			"email": ["is", "set"],
			"creation": ["between", [add_to_date(jetzt, hours=-ERINNERUNG_BIS_STUNDEN), add_to_date(jetzt, hours=-ERINNERUNG_NACH_STUNDEN)]],
		},
		fields=["name", "kontakt_name", "email", "creation"],
		limit=50,
	)
	basis = (frappe.conf.get("website_url") or "https://www.oekovolt.com").rstrip("/")
	for lead in kandidaten:
		# Inzwischen eine neue Anfrage mit derselben Adresse abgeschlossen? Dann keine Erinnerung.
		erledigt = frappe.db.exists("Solar Lead", {"email": lead.email, "phase": "eingegangen", "creation": [">=", lead.creation]})
		token = secrets.token_urlsafe(32)
		felder = {"erinnerung_gesendet_am": jetzt}
		if not erledigt:
			felder.update({"fortsetzen_hash": hashlib.sha256(token.encode()).hexdigest(), "fortsetzen_bis": add_to_date(jetzt, hours=FORTSETZEN_STUNDEN), "fortsetzen_anzahl": 0})
		frappe.db.set_value("Solar Lead", lead.name, felder, update_modified=False)
		frappe.db.commit()
		if erledigt:
			continue
		vorname = frappe.utils.escape_html((lead.kontakt_name or "").split(" ")[0])
		link = f"{basis}/fortsetzen/{token}"
		try:
			frappe.sendmail(
				recipients=[lead.email],
				subject="Ihre Solaranfrage ist fast fertig",
				message=(
					f"<p>Hallo {vorname},</p>"
					"<p>Sie haben auf oekovolt.com begonnen, Fotos von Stromzähler und Stromrechnung für ein genaues Angebot zu senden – "
					"die Übermittlung wurde aber nicht abgeschlossen.</p>"
					"<p>Mit diesem Link machen Sie genau dort weiter, Ihre Angaben aus dem Solarrechner sind schon hinterlegt:</p>"
					f"<p><a href='{link}' style='display:inline-block;padding:12px 22px;border-radius:999px;background:#5d8f2e;color:#fff;font-weight:600;text-decoration:none'>Unterlagen jetzt senden</a></p>"
					f"<p style='color:#555;font-size:13px'>Der Link ist {FORTSETZEN_STUNDEN} Stunden gültig. Sie erhalten zu dieser Anfrage keine weitere Erinnerung. "
					"Kein Interesse mehr? Dann müssen Sie nichts tun – nicht abgeschlossene Anfragen löschen wir automatisch.</p>"
					"<p>Lieber telefonisch? +43 6278 71030 (Mo–Do 8–16 Uhr, Fr 8–13 Uhr)</p>"
					"<p>Ihr Ökovolt-Team</p>"
				),
				reference_doctype="Solar Lead",
				reference_name=lead.name,
				now=True,
			)
		except Exception:
			frappe.log_error(title="Solar Lead: Erinnerung fehlgeschlagen", reference_doctype="Solar Lead", reference_name=lead.name)


# ---------------------------------------------------------------- Aufräumen

def aufraeumen():
	"""Täglicher Scheduler-Job:
	- nicht abgeschlossene Sitzungen 24 h nach Ablauf (QR-Code bzw. Fortsetzen-Link) samt Fotos löschen
	- Leads ohne Fortschritt nach 12 Monaten löschen"""
	jetzt = now_datetime()
	grenze = add_to_date(jetzt, hours=-24)
	offen = [
		l.name
		for l in frappe.get_all("Solar Lead", filters={"phase": ["!=", "eingegangen"], "gueltig_bis": ["<", grenze]}, fields=["name", "fortsetzen_bis"])
		if not l.fortsetzen_bis or get_datetime(l.fortsetzen_bis) < grenze
	]
	alt = frappe.get_all("Solar Lead", filters={"loeschung_faellig": ["<=", jetzt.date()], "status": ["in", ["Neu", "In Prüfung", "Verloren"]]}, pluck="name")
	for name in set(offen + alt):
		for f in frappe.get_all("File", filters={"attached_to_doctype": "Solar Lead", "attached_to_name": name}, pluck="name"):
			frappe.delete_doc("File", f, ignore_permissions=True, force=True)
		frappe.delete_doc("Solar Lead", name, ignore_permissions=True, force=True, delete_permanently=True)
		frappe.db.delete("Version", {"ref_doctype": "Solar Lead", "docname": name})
	if offen or alt:
		frappe.db.commit()
