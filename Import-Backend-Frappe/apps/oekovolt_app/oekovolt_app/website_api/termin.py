# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# Website-API Termine und Rückruf für www.oekovolt.com (Österreich).
# Vertrag: docs/FRAPPE-AT-API-SPEZIFIKATION.md, Abschnitt 4 (#6, #7).
#
#   GET  /api/method/oekovolt_app.website_api.termin.get_kalender   (Token, Rolle „Website API“)
#   POST /api/method/oekovolt_app.website_api.termin.buche_termin   (Gast – die Website sendet KEINEN Token)
#
# Aufrufer: src/lib/terminKalender.js, src/app/api/termin/route.js, src/app/api/rueckruf/route.js.
# Reine Logik (Feiertage, Slots, Status, .ics) in termin_logik.py – ohne Frappe testbar.
#
# Fehlerverhalten (src/lib/backendFehler.js):
#   frappe.throw(...)  -> exc_type ValidationError -> Website zeigt den Text (422);
#   Text mit „nicht mehr verfügbar“ -> Website antwortet 409 und lädt neue Slots.
#   Deshalb KEINE eigene Exception-Klasse für „belegt“ (exc_type muss „ValidationError“ enthalten).

from datetime import datetime, timedelta, timezone

import frappe
from frappe.rate_limiter import rate_limit
from frappe.utils import cstr, escape_html, get_system_timezone, get_url_to_form, getdate, now_datetime

from oekovolt_app.website_api import termin_logik as L

ROLLE_API = "Website API"
ROLLE_BERATUNG = "Terminberatung"
DOCTYPE = "Website Termin"
EINSTELLUNGEN = "Termin Einstellungen"

CACHE_PREFIX = "oekovolt_termin_kalender"
CACHE_SEKUNDEN = 60

NICHT_VERFUEGBAR = "Dieser Termin ist leider nicht mehr verfügbar. Bitte wählen Sie eine andere Uhrzeit."

# Rate-Limit: Die Website ruft buche_termin serverseitig (Next.js) auf – alle Besucher kommen also von
# derselben IP. Deshalb zwei Stufen:
#   1. @rate_limit je aufrufender IP (Next-Server bzw. direkter Angreifer) als Sicherheitsnetz,
#   2. je Besucher-IP (Feld `ip_adresse`, vom Next-Server gesetzt) 5 Buchungen je 10 Minuten.
LIMIT_JE_SERVER_IP = 60
LIMIT_JE_BESUCHER = 5
LIMIT_SEKUNDEN = 600


# ---------------------------------------------------------------- Helfer


def _nur_rollen(*rollen):
	vorhanden = set(frappe.get_roles())
	if not vorhanden.intersection(set(rollen) | {"System Manager"}):
		frappe.throw("Nicht berechtigt", frappe.PermissionError)


def _einstellungen():
	"""Termin Einstellungen als geprüftes dict (fehlt der DocType/Datensatz -> Standardwerte)."""
	try:
		doc = frappe.get_cached_doc(EINSTELLUNGEN)
	except Exception:
		doc = None
	return L.einstellungen_normalisieren(doc)


def _system_ist_wien():
	return (get_system_timezone() or L.ZEITZONE) == L.ZEITZONE


def wien_zu_system(dt):
	"""Naive Wiener Zeit -> naive Systemzeit (für Datetime-Felder). Identisch, wenn System = Europe/Vienna."""
	if dt is None or _system_ist_wien():
		return dt
	from zoneinfo import ZoneInfo

	return L.wien_zu_utc(dt).astimezone(ZoneInfo(get_system_timezone())).replace(tzinfo=None)


def system_zu_wien(dt):
	"""Naive Systemzeit (aus Datetime-Feldern) -> naive Wiener Zeit."""
	if dt is None or _system_ist_wien():
		return dt
	from zoneinfo import ZoneInfo

	return L.utc_zu_wien(dt.replace(tzinfo=ZoneInfo(get_system_timezone())))


def cache_leeren():
	"""Kalender-Cache verwerfen (nach Buchung, Änderung eines Termins oder der Einstellungen)."""
	try:
		frappe.cache.delete_keys(CACHE_PREFIX)
	except Exception:
		frappe.log_error(title="Termin: Kalender-Cache konnte nicht geleert werden")


def _berater():
	"""Aktive Nutzer mit Rolle „Terminberatung“ (leer, wenn es die Rolle nicht gibt)."""
	if not frappe.db.exists("Role", ROLLE_BERATUNG):
		return []
	nutzer = frappe.get_all("Has Role", filters={"role": ROLLE_BERATUNG, "parenttype": "User"}, pluck="parent")
	return [
		u
		for u in set(nutzer)
		if u not in ("Administrator", "Guest") and frappe.db.get_value("User", u, "enabled")
	]


def _belegungen(von, bis):
	"""
	Belegte Zeiträume (naive Wiener Zeit) zwischen den Tagen von..bis:
	  - Website Termine (Status nicht „Abgesagt“), Pool nach Terminart,
	  - offene Kalendereinträge (Event) der Nutzer mit Rolle „Terminberatung“ (blockieren alle Pools).
	Es werden nur Zeiten ermittelt – keine personenbezogenen Daten.
	"""
	start = wien_zu_system(datetime.combine(von - timedelta(days=1), datetime.min.time()))
	ende = wien_zu_system(datetime.combine(bis + timedelta(days=2), datetime.min.time()))
	belegt = []

	for t in frappe.get_all(
		DOCTYPE,
		filters={"status": ["!=", "Abgesagt"], "start": ["<", ende], "ende": [">", start]},
		fields=["start", "ende", "terminart"],
	):
		if t.start and t.ende and t.terminart in L.POOL:
			belegt.append({"start": system_zu_wien(t.start), "ende": system_zu_wien(t.ende), "pool": L.POOL[t.terminart]})

	berater = _berater()
	if berater:
		for ev in frappe.get_all(
			"Event",
			filters={
				"owner": ["in", berater],
				"status": "Open",
				"starts_on": ["between", [start - timedelta(days=7), ende]],
			},
			fields=["starts_on", "ends_on", "all_day"],
		):
			s = frappe.utils.get_datetime(ev.starts_on)
			e = frappe.utils.get_datetime(ev.ends_on) if ev.ends_on else s + timedelta(hours=1)
			if ev.all_day:
				s = s.replace(hour=0, minute=0, second=0)
				e = e.replace(hour=23, minute=59, second=59)
			if e > start and s < ende:
				belegt.append({"start": system_zu_wien(s), "ende": system_zu_wien(e), "pool": None})
	return belegt


# ---------------------------------------------------------------- #7 get_kalender


@frappe.whitelist(methods=["GET"])
def get_kalender(terminart=None, von=None, bis=None):
	"""
	Ein Eintrag je Tag im Bereich (höchstens 60 Tage), auch geschlossene Tage:
	[{datum, label, status (frei|teilweise|ausgebucht|geschlossen), freie_slots, belegte_slots}]
	"""
	_nur_rollen(ROLLE_API)

	terminart = cstr(terminart).strip()
	if terminart not in L.TERMINARTEN:
		frappe.throw("Unbekannte Terminart")
	try:
		von_d, bis_d = L.bereich_begrenzen(L.datum_parsen(von), L.datum_parsen(bis))
	except ValueError:
		frappe.throw("Ungültiger Zeitraum (von/bis als YYYY-MM-DD, von <= bis)")

	schluessel = f"{CACHE_PREFIX}:{terminart}:{von_d.isoformat()}:{bis_d.isoformat()}"
	zwischengespeichert = frappe.cache.get_value(schluessel)
	if zwischengespeichert is not None:
		return zwischengespeichert

	tage = L.kalender(terminart, von_d, bis_d, _einstellungen(), _belegungen(von_d, bis_d), L.jetzt_wien())
	frappe.cache.set_value(schluessel, tage, expires_in_sec=CACHE_SEKUNDEN)
	return tage


# ---------------------------------------------------------------- #6 buche_termin


def _besucher_limit(ip):
	"""Höchstens LIMIT_JE_BESUCHER Buchungen je Besucher-IP in LIMIT_SEKUNDEN."""
	if not ip:
		return
	schluessel = frappe.cache.make_key(f"oekovolt_termin_rl:{ip}")
	anzahl = frappe.cache.incrby(schluessel, 1)
	if anzahl == 1:
		frappe.cache.expire(schluessel, LIMIT_SEKUNDEN)
	if anzahl > LIMIT_JE_BESUCHER:
		frappe.throw(
			"Zu viele Anfragen in kurzer Zeit – bitte versuchen Sie es in einigen Minuten erneut.",
			frappe.RateLimitExceededError,
		)


class _Sperre:
	"""Redis-Sperre je Pool und Tag (serialisiert Buchungen, die sich gegenseitig belegen könnten)."""

	def __init__(self, name):
		self.lock = frappe.cache.lock(frappe.cache.make_key(f"oekovolt_termin_sperre:{name}"), timeout=30, blocking_timeout=15)
		self.aktiv = False

	def __enter__(self):
		self.aktiv = self.lock.acquire()
		if not self.aktiv:
			frappe.throw("Gerade werden viele Termine gebucht. Bitte versuchen Sie es in einem Moment erneut.")
		return self

	def __exit__(self, *args):
		if self.aktiv:
			try:
				self.lock.release()
			except Exception:
				pass  # abgelaufen – die DB-Sperre (FOR UPDATE) hat trotzdem geschützt
		return False


@frappe.whitelist(allow_guest=True, methods=["POST"])
@rate_limit(limit=LIMIT_JE_SERVER_IP, seconds=LIMIT_SEKUNDEN)
def buche_termin(**kwargs):
	"""
	Termin oder Rückruf buchen. Body siehe Vertrag #6; Antwort {"referenz": "T-2026-000123"}.
	Rückruf-Widget und /termin senden denselben Body – Rückruf = „Telefonische Beratung“ außerhalb
	von /termin (termin_logik.ist_rueckruf), gespeichert mit anfrageart „Rückruf“.
	"""
	d = frappe.form_dict

	# Honeypot: still verwerfen, Erfolg vortäuschen, nichts speichern
	if cstr(d.get("website")).strip():
		return {"referenz": None}

	try:
		b = L.buchung_pruefen(d)
	except L.EingabeFehler as fehler:
		frappe.throw(str(fehler))

	_besucher_limit(b["ip_adresse"])

	pool = L.POOL[b["terminart"]]
	with _Sperre(f"{pool}:{b['datum'].isoformat()}"):
		# zweite Schutzlinie: Zeilen des Tages in der DB sperren (auch bei mehreren Workern/Servern)
		frappe.db.sql(
			"select name from `tabWebsite Termin` where datum between %s and %s and status != 'Abgesagt' for update",
			(b["datum"] - timedelta(days=1), b["datum"] + timedelta(days=1)),
		)

		e = _einstellungen()
		tag = L.tag_berechnen(b["datum"], b["terminart"], e, _belegungen(b["datum"], b["datum"]), L.jetzt_wien())
		if b["uhrzeit"] not in tag["freie_slots"]:
			im_raster = L.zeit_zu_minuten(b["uhrzeit"]) in L.raster(
				L.zeitfenster_am(b["datum"], b["terminart"], e), e["slot_minuten"], L.DAUER_MINUTEN[b["terminart"]]
			)
			if tag["status"] != L.STATUS_GESCHLOSSEN and not im_raster and b["uhrzeit"] not in tag["belegte_slots"]:
				frappe.throw("Bitte wählen Sie eine gültige Uhrzeit aus dem Kalender.")
			frappe.throw(NICHT_VERFUEGBAR)

		doc = frappe.get_doc(
			{
				"doctype": DOCTYPE,
				"status": "Neu",
				"anfrageart": b["anfrageart"],
				"terminart": b["terminart"],
				"datum": b["datum"],
				"uhrzeit": b["uhrzeit"],
				"start": wien_zu_system(b["start"]),
				"ende": wien_zu_system(b["ende"]),
				"name_komplett": b["name_komplett"],
				"email": b["email"],
				"telefon": b["telefon"],
				"plz": b["plz"],
				"adresse": b["adresse"],
				"firma": b["firma"],
				"thema": b["thema"],
				"nachricht": b["nachricht"],
				"einwilligung": 1,
				"einwilligung_am": now_datetime(),
				"quelle": b["quelle"],
				"herkunft": b["herkunft"],
				"ip_adresse": b["ip_adresse"],
			}
		)
		doc.flags.von_website = True
		doc.insert(ignore_permissions=True)
		# vor dem Freigeben der Sperre festschreiben, sonst sieht die nächste Buchung den Termin nicht
		frappe.db.commit()

	cache_leeren()
	kunde_bestaetigen(doc)
	berater_benachrichtigen(doc)
	return {"referenz": doc.referenz}


# ---------------------------------------------------------------- E-Mails


def _termin_dict(doc):
	return {
		"referenz": doc.referenz,
		"terminart": doc.terminart,
		"rueckruf": doc.anfrageart == L.ANFRAGEART_RUECKRUF,
		"start": system_zu_wien(frappe.utils.get_datetime(doc.start)),
		"ende": system_zu_wien(frappe.utils.get_datetime(doc.ende)),
		"telefon": doc.telefon,
		"plz": doc.plz,
		"adresse": doc.adresse,
		"thema": doc.thema,
		"nachricht": doc.nachricht,
	}


def kunde_bestaetigen(doc):
	"""Bestätigungs-E-Mail mit .ics an den Kunden. Darf die Buchung nie verhindern."""
	try:
		t = _termin_dict(doc)
		wann = L.datum_lang(t["start"])
		name = escape_html(doc.name_komplett or "")
		if t["rueckruf"]:
			betreff = f"Ihr Rückruf von {L.FIRMA['kurz']}: {wann}"
			kopf = f"vielen Dank für Ihre Anfrage – wir rufen Sie am <b>{wann}</b> unter {escape_html(doc.telefon)} an."
		else:
			betreff = f"Terminbestätigung: {doc.terminart} am {wann}"
			kopf = f"vielen Dank für Ihre Buchung. Ihr Termin: <b>{escape_html(doc.terminart)}</b> am <b>{wann}</b>."

		zusatz = ""
		if doc.terminart == L.VIDEO:
			zusatz = "<p>Den Link zur Video-Beratung senden wir Ihnen rechtzeitig vor dem Termin.</p>"
		elif doc.terminart == L.VOR_ORT:
			ort = escape_html(doc.adresse or f"PLZ {doc.plz}")
			zusatz = f"<p>Wir kommen zu Ihnen: {ort}. Wir melden uns vorab zur Abstimmung.</p>"
		elif not t["rueckruf"]:
			zusatz = f"<p>Wir rufen Sie zum Termin unter {escape_html(doc.telefon)} an.</p>"

		frappe.sendmail(
			recipients=[doc.email],
			subject=betreff,
			message=(
				f"<p>Guten Tag {name},</p><p>{kopf}</p>{zusatz}"
				f"<p>Buchungsnummer: <b>{escape_html(doc.referenz)}</b></p>"
				"<p>Die angehängte Kalenderdatei (.ics) können Sie in Outlook, Google oder Apple Kalender übernehmen.</p>"
				f"<p>Sie möchten den Termin ändern oder absagen? Antworten Sie einfach auf diese E-Mail oder rufen Sie uns an: "
				f"{L.FIRMA['telefon']}.</p>"
				f"<p>Freundliche Grüße<br>Ihr {L.FIRMA['kurz']}-Team<br>{L.FIRMA['name']} · {L.FIRMA['web']}</p>"
			),
			attachments=[{"fname": "oekovolt-termin.ics", "fcontent": L.termin_ics(t, datetime.now(timezone.utc))}],
			reference_doctype=DOCTYPE,
			reference_name=doc.name,
		)
	except Exception:
		frappe.log_error(title=f"Termin {doc.name}: Bestätigung an Kunden fehlgeschlagen")


def berater_benachrichtigen(doc):
	"""E-Mail + Glocke im Desk an alle Nutzer mit Rolle „Terminberatung“. Darf die Buchung nie verhindern."""
	try:
		nutzer = _berater()
		if not nutzer:
			return
		t = _termin_dict(doc)
		art = "Rückruf" if t["rueckruf"] else doc.terminart
		betreff = f"Neu: {art} am {t['start'].strftime('%d.%m. %H:%M')} Uhr – {doc.name_komplett}"
		html = (
			f"<p><b>{escape_html(art)}</b> am {L.datum_lang(t['start'])} ({escape_html(doc.referenz)})</p>"
			f"<p>{escape_html(doc.name_komplett)}"
			+ (f" · {escape_html(doc.firma)}" if doc.firma else "")
			+ f"<br>{escape_html(doc.email)} · <a href='tel:{escape_html(doc.telefon)}'>{escape_html(doc.telefon)}</a>"
			f"<br>PLZ {escape_html(doc.plz or '')}"
			+ (f" · {escape_html(doc.adresse)}" if doc.adresse else "")
			+ "</p>"
			f"<p>Thema: {escape_html(doc.thema or '–')}</p>"
			+ (f"<p>{escape_html(doc.nachricht).replace(chr(10), '<br>')}</p>" if doc.nachricht else "")
			+ f"<p style='color:#666'>Seite: {escape_html(doc.quelle or '–')}"
			+ (f"<br>Herkunft: {escape_html(doc.herkunft)}" if doc.herkunft else "")
			+ "</p>"
			f"<p><a href='{get_url_to_form(DOCTYPE, doc.name)}'>Im Backoffice öffnen</a></p>"
		)
		frappe.sendmail(recipients=nutzer, subject=betreff, message=html, reference_doctype=DOCTYPE, reference_name=doc.name)
		for u in nutzer:
			frappe.get_doc(
				{
					"doctype": "Notification Log",
					"for_user": u,
					"type": "Alert",
					"document_type": DOCTYPE,
					"document_name": doc.name,
					"subject": betreff,
				}
			).insert(ignore_permissions=True)
	except Exception:
		frappe.log_error(title=f"Termin {doc.name}: Benachrichtigung Terminberatung fehlgeschlagen")


# ---------------------------------------------------------------- Löschfrist (scheduler_events daily)


def loesche_alte_termine():
	"""
	Täglich: Termine, deren Datum mehr als 24 Monate zurückliegt, anonymisieren
	(Name, Kontakt, Adresse, Nachricht, Notiz, IP). Terminart, Datum, PLZ, Thema, Quelle und Herkunft
	bleiben für die Statistik. Versionen, Benachrichtigungen und E-Mail-Warteschlange werden gelöscht.
	"""
	stichtag = L.loeschstichtag(getdate())
	namen = frappe.get_all(DOCTYPE, filters={"datum": ["<", stichtag], "anonymisiert": 0}, pluck="name", limit=5000)
	if not namen:
		return
	leer = {
		"name_komplett": "Anonymisiert",
		"email": "",
		"telefon": "",
		"adresse": "",
		"firma": "",
		"nachricht": "",
		"notiz": "",
		"ip_adresse": "",
		"berater": None,
		"anonymisiert": 1,
	}
	for name in namen:
		frappe.db.set_value(DOCTYPE, name, leer, update_modified=False)
	frappe.db.delete("Version", {"ref_doctype": DOCTYPE, "docname": ["in", namen]})
	frappe.db.delete("Notification Log", {"document_type": DOCTYPE, "document_name": ["in", namen]})
	frappe.db.delete("Comment", {"reference_doctype": DOCTYPE, "reference_name": ["in", namen]})
	queue = frappe.get_all("Email Queue", filters={"reference_doctype": DOCTYPE, "reference_name": ["in", namen]}, pluck="name")
	if queue:
		frappe.db.delete("Email Queue Recipient", {"parent": ["in", queue]})
		frappe.db.delete("Email Queue", {"name": ["in", queue]})
	frappe.db.commit()


# ---------------------------------------------------------------- Einrichtung


def einstellungen_vorbelegen():
	"""
	Termin Einstellungen mit Standardwerten füllen, falls noch keine Zeitfenster gepflegt sind
	(Mo–Do 08:00–16:00, Fr 08:00–13:00 für alle Terminarten, Raster 30 Min., Vorlauf 2 h).
	Aufruf: after_install oder `bench --site <site> execute oekovolt_app.website_api.termin.einstellungen_vorbelegen`
	"""
	doc = frappe.get_single(EINSTELLUNGEN)
	if doc.get("zeitfenster"):
		return
	for feld, wert in L.STANDARD.items():
		if doc.get(feld) in (None, ""):
			doc.set(feld, wert)
	for art, tag, beginn, ende in L.STANDARD_ZEITFENSTER:
		doc.append("zeitfenster", {"terminart": art, "wochentag": L.WOCHENTAGE[tag], "beginn": L.hhmm(beginn) + ":00", "ende": L.hhmm(ende) + ":00"})
	doc.save(ignore_permissions=True)
	frappe.db.commit()
