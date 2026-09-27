# Copyright (c) 2026, ÖKOVOLT GmbH Solartechnik
#
# Whitelisted API der Online-Terminbuchung.
# Pfad: oekovoltdeutchland/oekovoltdeutchland/doctype/beratungstermin/api.py
#
# Belegung = gebuchte Beratungstermine + blockierende Kalendereinträge (Event)
# der Nutzer mit Rolle "Terminberatung" – z. B. per Google-Kalender-Sync von Frappe.

from datetime import timedelta

import frappe
from frappe import _
from frappe.utils import add_to_date, escape_html, format_datetime, get_datetime, now_datetime

from oekovoltdeutchland.oekovoltdeutchland.doctype.rueckruf.api import (
	herkunft_felder,
	lokal_zu_iso,
	neue_referenz,
	nur_webformular,
	team_benachrichtigen,
	text,
	utc_zu_lokal,
)

ROLLE_BERATUNG = "Terminberatung"
ARTEN = {"Telefonische Beratung", "Video-Beratung", "Vor-Ort-Termin"}
AKTIV = ("Gebucht", "Bestätigt", "Verschoben")

# Kapazität: wie viele Termine dürfen sich gleichzeitig überschneiden?
# Telefon und Video teilen sich die Berater im Büro, Vor-Ort-Termine laufen über den Außendienst.
POOL = {"Telefonische Beratung": "buero", "Video-Beratung": "buero", "Vor-Ort-Termin": "aussendienst"}
KAPAZITAET = {"buero": 1, "aussendienst": 1}
# Fahrzeitpuffer vor und nach Vor-Ort-Terminen
PUFFER_MINUTEN = {"buero": 0, "aussendienst": 45}


class TerminBelegt(frappe.ValidationError):
	http_status_code = 409


def _pool_arten(art):
	pool = POOL.get(art, "buero")
	return pool, [a for a, p in POOL.items() if p == pool]


def _art_aus_id(wert):
	return {"telefon": "Telefonische Beratung", "video": "Video-Beratung", "vor-ort": "Vor-Ort-Termin"}.get(wert, wert)


def _belegungen(art, von, bis):
	"""Liste (start, ende) naiver Systemzeiten inkl. Puffer, für den Pool der Art."""
	pool, arten = _pool_arten(art)
	puffer = timedelta(minutes=PUFFER_MINUTEN[pool])
	termine = frappe.get_all(
		"Beratungstermin",
		filters={"art": ["in", arten], "status": ["in", AKTIV], "ende": [">", von], "start": ["<", bis]},
		fields=["start", "ende"],
	)
	zeiten = [(get_datetime(t.start) - puffer, get_datetime(t.ende) + puffer) for t in termine]

	# Blockierende Kalendereinträge der Beraterinnen und Berater
	berater = frappe.get_all("Has Role", filters={"role": ROLLE_BERATUNG, "parenttype": "User"}, pluck="parent")
	if berater:
		events = frappe.get_all(
			"Event",
			filters={"owner": ["in", berater], "status": "Open", "starts_on": ["<", bis], "ends_on": [">", von]},
			fields=["starts_on", "ends_on", "all_day"],
		)
		for e in events:
			start = get_datetime(e.starts_on)
			ende = get_datetime(e.ends_on) if e.ends_on else start + timedelta(hours=1)
			if e.all_day:
				start = start.replace(hour=0, minute=0)
				ende = ende.replace(hour=23, minute=59)
			# Einträge, die aus Buchungen stammen, sind schon oben enthalten
			zeiten.append((start, ende))
	return zeiten


def _frei(art, start, ende):
	pool = _pool_arten(art)[0]
	ueberschneidungen = sum(1 for s, e in _belegungen(art, start - timedelta(hours=2), ende + timedelta(hours=2)) if s < ende and start < e)
	return ueberschneidungen < KAPAZITAET[pool]


def _ics(doc):
	fmt = lambda dt: get_datetime(dt).strftime("%Y%m%dT%H%M%S")
	tz = frappe.utils.get_system_timezone()
	ort = doc.adresse if doc.art == "Vor-Ort-Termin" else ("Video – Link folgt" if doc.art == "Video-Beratung" else "Telefon")
	ort = (ort or "").replace(",", "\\,").replace("\n", " ")
	return "\r\n".join([
		"BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Oekovolt//Beratungstermin//DE", "METHOD:REQUEST",
		"BEGIN:VEVENT",
		f"UID:{doc.referenz}@oekovolt.de",
		f"DTSTAMP:{now_datetime().strftime('%Y%m%dT%H%M%S')}",
		f"DTSTART;TZID={tz}:{fmt(doc.start)}",
		f"DTEND;TZID={tz}:{fmt(doc.ende)}",
		f"SUMMARY:Ökovolt: {doc.art}",
		f"LOCATION:{ort}",
		"DESCRIPTION:Fragen oder Terminänderung: 08245 96 788 0 · office@oekovolt.de",
		f"STATUS:{'CANCELLED' if doc.status == 'Abgesagt' else 'CONFIRMED'}",
		"END:VEVENT", "END:VCALENDAR",
	])


def kunde_informieren(doc):
	"""Bestätigung / Verschiebung / Absage an den Kunden – mit Kalenderdatei."""
	try:
		wann = format_datetime(doc.start, "EEEE, d. MMMM yyyy 'um' HH:mm")
		if doc.status == "Abgesagt":
			betreff, kopf = f"Ihr Termin am {wann} Uhr wurde abgesagt", "Ihr Termin wurde leider abgesagt."
		elif doc.status == "Verschoben":
			betreff, kopf = f"Neuer Termin: {wann} Uhr", "Ihr Termin wurde verschoben."
		else:
			betreff, kopf = f"Terminbestätigung: {doc.art} am {wann} Uhr", "vielen Dank – Ihr Termin ist bestätigt."

		video = ""
		if doc.art == "Video-Beratung":
			video = f"<p>Video-Link: <a href='{escape_html(doc.video_link)}'>{escape_html(doc.video_link)}</a></p>" if doc.video_link else "<p>Den Link zur Video-Beratung senden wir Ihnen rechtzeitig vor dem Termin.</p>"
		ort = f"<p>Adresse: {escape_html(doc.adresse)}</p>" if doc.art == "Vor-Ort-Termin" else ""

		frappe.sendmail(
			recipients=[doc.email],
			subject=betreff,
			message=(
				f"<p>Guten Tag {escape_html(doc.kontakt_name)},</p><p>{kopf}</p>"
				f"<p><b>{escape_html(doc.art)}</b><br>{wann} Uhr</p>{video}{ort}"
				f"<p>Buchungsnummer: {doc.referenz}</p>"
				"<p>Sie möchten den Termin ändern? Antworten Sie einfach auf diese E-Mail oder rufen Sie uns an: 08245 96 788 0.</p>"
				"<p>Viele Grüße<br>Ihr Ökovolt-Team</p>"
			),
			attachments=[{"fname": "oekovolt-termin.ics", "fcontent": _ics(doc)}],
			reference_doctype="Beratungstermin",
			reference_name=doc.name,
			now=True,
		)
	except Exception:
		frappe.log_error(title=f"Terminmail {doc.name} fehlgeschlagen")


# ---------------------------------------------------------------- API

@frappe.whitelist(methods=["POST"])
def belegte_zeiten(**kwargs):
	"""Belegte Zeiträume der nächsten 30 Tage als ISO – ohne personenbezogene Daten."""
	nur_webformular()
	art = _art_aus_id(frappe.form_dict.get("art"))
	if art not in ARTEN:
		frappe.throw(_("Unbekannte Terminart"))
	pool = _pool_arten(art)[0]
	von = now_datetime()
	bis = add_to_date(von, days=30)

	# Zeitfenster ausgeben, in denen die Kapazität erschöpft ist
	zeiten = sorted(_belegungen(art, von, bis))
	if KAPAZITAET[pool] <= 1:
		return [{"von": lokal_zu_iso(s), "bis": lokal_zu_iso(e)} for s, e in zeiten]
	voll = []
	for s, e in zeiten:
		gleichzeitig = sum(1 for s2, e2 in zeiten if s2 < e and s < e2)
		if gleichzeitig >= KAPAZITAET[pool]:
			voll.append({"von": lokal_zu_iso(s), "bis": lokal_zu_iso(e)})
	return voll


@frappe.whitelist(methods=["POST"])
def create_termin(**kwargs):
	nur_webformular()
	d = frappe.form_dict

	art = d.get("art")
	if art not in ARTEN:
		frappe.throw(_("Unbekannte Terminart"))
	start = utc_zu_lokal(d.get("start"))
	ende = utc_zu_lokal(d.get("ende"))
	if not start or not ende or ende <= start or start < now_datetime():
		frappe.throw(_("Ungültiger Termin"))

	# Doppelbuchungen verhindern: Sperre auf die Termine des Tages
	frappe.db.sql(
		"select name from `tabBeratungstermin` where start between %s and %s for update",
		(start.replace(hour=0, minute=0), start.replace(hour=23, minute=59)),
	)
	if not _frei(art, start, ende):
		raise TerminBelegt(_("Dieser Termin ist leider nicht mehr frei."))

	doc = frappe.get_doc({
		"doctype": "Beratungstermin",
		"referenz": neue_referenz("Beratungstermin", "BT"),
		"status": "Bestätigt",
		"art": art,
		"start": start,
		"ende": ende,
		"kontakt_name": text(d.get("name"), 140),
		"email": text(d.get("email"), 190),
		"telefon": text(d.get("telefon"), 20),
		"plz": text(d.get("plz"), 10),
		"adresse": text(d.get("adresse"), 300),
		"thema": text(d.get("thema"), 60),
		"nachricht": text(d.get("nachricht"), 2000),
		"seite": text(d.get("seite"), 300),
		**herkunft_felder(d),
	})
	doc.insert(ignore_permissions=True)

	# Kalendereintrag (erscheint im Frappe-Kalender, optional Google-Sync)
	event = frappe.get_doc({
		"doctype": "Event",
		"subject": f"{art}: {doc.kontakt_name} ({doc.plz})",
		"starts_on": start,
		"ends_on": ende,
		"event_type": "Private",
		"event_category": "Meeting",
		"status": "Open",
		"description": f"Buchung {doc.referenz} – Details im Beratungstermin {doc.name}",
	}).insert(ignore_permissions=True)
	doc.db_set("event", event.name, update_modified=False)
	frappe.db.commit()

	team_benachrichtigen(
		ROLLE_BERATUNG,
		f"Neuer Termin: {art} am {format_datetime(start, 'dd.MM. HH:mm')} Uhr – {doc.kontakt_name}",
		f"<p><b>{escape_html(art)}</b> am {format_datetime(start, 'EEEE, dd.MM.yyyy HH:mm')} Uhr</p>"
		f"<p>{escape_html(doc.kontakt_name)}<br>{escape_html(doc.email)} · <a href='tel:{doc.telefon}'>{doc.telefon}</a><br>PLZ {escape_html(doc.plz)} {escape_html(doc.adresse or '')}</p>"
		f"<p>Thema: {escape_html(doc.thema or '–')}<br>{escape_html(doc.nachricht or '')}</p>"
		f"<p><a href='{frappe.utils.get_url_to_form('Beratungstermin', doc.name)}'>Im Backoffice öffnen</a></p>",
		"Beratungstermin",
		doc.name,
	)
	return {"referenz": doc.referenz}


# ---------------------------------------------------------------- Löschfrist

def loesche_alte_termine():
	"""Täglicher Scheduler-Job: Termine 12 Monate nach Termin löschen."""
	faellig = frappe.get_all("Beratungstermin", filters={"loeschung_faellig": ["<=", now_datetime().date()]}, fields=["name", "event"])
	for t in faellig:
		if t.event and frappe.db.exists("Event", t.event):
			frappe.delete_doc("Event", t.event, ignore_permissions=True, force=True)
		frappe.delete_doc("Beratungstermin", t.name, ignore_permissions=True, force=True)
		frappe.db.delete("Version", {"ref_doctype": "Beratungstermin", "docname": t.name})
	if faellig:
		frappe.db.commit()
