# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# Reine Termin-Logik für oekovolt.com (Österreich) – OHNE Frappe-Import, damit sie
# ohne Bench testbar ist (tests/test_termin_logik.py).
#
#   Feiertage Österreich, Zeitzone Europe/Vienna, Zeitfenster/Slots, Tagesstatus,
#   Eingabeprüfung der Buchung, Herkunftszeile, .ics-Datei, Löschfrist.
#
# Die Frappe-Anbindung (Datenbank, Cache, Sperre, E-Mail) liegt in termin.py.
# Die Regeln spiegeln src/data/erreichbarkeit.js der Website (Raster 30 Min., Vorlauf 2 h,
# Vor-Ort frühestens übermorgen, Mo–Do 08:00–16:00, Fr 08:00–13:00, Europe/Vienna).

import ipaddress
import re
from datetime import date, datetime, time, timedelta, timezone

ZEITZONE = "Europe/Vienna"

TELEFON = "Telefonische Beratung"
VIDEO = "Video-Beratung"
VOR_ORT = "Vor-Ort-Termin"
TERMINARTEN = (TELEFON, VIDEO, VOR_ORT)

# Dauer je Terminart in Minuten (wie TERMIN_ARTEN in src/data/erreichbarkeit.js); Rückruf wie KalenderLinks (15 Min.)
DAUER_MINUTEN = {TELEFON: 20, VIDEO: 30, VOR_ORT: 60}
RUECKRUF_DAUER_MINUTEN = 15

# Wer führt den Termin durch? Telefon und Video teilen sich die Berater im Büro,
# Vor-Ort-Termine laufen über den Außendienst (bewährt aus dem DE-Beratungstermin).
POOL = {TELEFON: "buero", VIDEO: "buero", VOR_ORT: "aussendienst"}

ANFRAGEART_TERMIN = "Termin"
ANFRAGEART_RUECKRUF = "Rückruf"

STATUS_FREI = "frei"
STATUS_TEILWEISE = "teilweise"
STATUS_AUSGEBUCHT = "ausgebucht"
STATUS_GESCHLOSSEN = "geschlossen"

MAX_BEREICH_TAGE = 60  # höchstens so viele Tage je get_kalender-Aufruf

WOCHENTAGE = ("", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag")
WOCHENTAGE_KURZ = ("", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So")
MONATE = ("", "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember")

FIRMA = {
	"name": "Ökovolt Solartechnik GmbH",
	"kurz": "Ökovolt",
	"telefon": "+43 6278 71030",
	"email": "office@oekovolt.at",
	"web": "https://www.oekovolt.com",
	"domain": "oekovolt.com",
}

# Standard-Zeitfenster, solange in „Termin Einstellungen“ keine Zeile gepflegt ist
# (= FIRMA.oeffnungszeiten in src/lib/site.js): Mo–Do 08:00–16:00, Fr 08:00–13:00, für alle Terminarten.
STANDARD_ZEITFENSTER = (
	[("Alle", tag, 8 * 60, 16 * 60) for tag in (1, 2, 3, 4)]
	+ [("Alle", 5, 8 * 60, 13 * 60)]
)

STANDARD = {
	"slot_minuten": 30,
	"vorlauf_stunden": 2,
	"vor_ort_vorlauf_tage": 2,
	"max_tage": 60,
	"betriebsruhe_24_31": 1,
	"kapazitaet_buero": 1,
	"kapazitaet_aussendienst": 1,
	"puffer_vor_ort_minuten": 45,
}

LOESCHFRIST_MONATE = 24


class EingabeFehler(ValueError):
	"""Ungültige Eingabe – der Text wird dem Besucher angezeigt (deutsch, ohne Interna)."""


# ---------------------------------------------------------------- Zeitzone Europe/Vienna


def _zone():
	"""ZoneInfo('Europe/Vienna') oder None, wenn keine Zeitzonendaten vorhanden sind (z. B. Windows ohne tzdata)."""
	try:
		from zoneinfo import ZoneInfo

		return ZoneInfo(ZEITZONE)
	except Exception:
		return None


def _letzter_sonntag(jahr, monat):
	tag = date(jahr, monat, 31)  # März und Oktober haben 31 Tage
	return tag - timedelta(days=(tag.isoweekday() % 7))


def _sommerzeit_utc(jahr):
	"""EU-Regel: Sommerzeit vom letzten Sonntag im März 01:00 UTC bis letzten Sonntag im Oktober 01:00 UTC."""
	beginn = datetime.combine(_letzter_sonntag(jahr, 3), time(1, 0))
	ende = datetime.combine(_letzter_sonntag(jahr, 10), time(1, 0))
	return beginn, ende


def utc_zu_wien(dt, zone="auto"):
	"""Zeitpunkt (aware, oder naiv = UTC) -> naive Wiener Wanduhrzeit."""
	if dt.tzinfo is not None:
		dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
	z = _zone() if zone == "auto" else zone
	if z is not None:
		return dt.replace(tzinfo=timezone.utc).astimezone(z).replace(tzinfo=None)
	beginn, ende = _sommerzeit_utc(dt.year)
	return dt + timedelta(hours=2 if beginn <= dt < ende else 1)


def wien_zu_utc(lokal, zone="auto"):
	"""Naive Wiener Wanduhrzeit -> aware UTC. Doppelte Stunde im Oktober: die erste (Sommerzeit)."""
	z = _zone() if zone == "auto" else zone
	if z is not None:
		return lokal.replace(tzinfo=z, fold=0).astimezone(timezone.utc)
	jahr = lokal.year
	sommer_von = datetime.combine(_letzter_sonntag(jahr, 3), time(2, 0))
	sommer_bis = datetime.combine(_letzter_sonntag(jahr, 10), time(3, 0))
	versatz = 2 if sommer_von <= lokal < sommer_bis else 1
	return (lokal - timedelta(hours=versatz)).replace(tzinfo=timezone.utc)


def jetzt_wien(jetzt_utc=None):
	"""Aktuelle Wiener Wanduhrzeit (naiv)."""
	return utc_zu_wien(jetzt_utc or datetime.now(timezone.utc))


# ---------------------------------------------------------------- Feiertage Österreich


def ostersonntag(jahr):
	"""Gaußsche Osterformel (anonymer gregorianischer Algorithmus)."""
	a = jahr % 19
	b, c = divmod(jahr, 100)
	d, e = divmod(b, 4)
	f = (b + 8) // 25
	g = (b - f + 1) // 3
	h = (19 * a + b - d - g + 15) % 30
	i, k = divmod(c, 4)
	l = (32 + 2 * e + 2 * i - h - k) % 7  # noqa: E741
	m = (a + 11 * h + 22 * l) // 451
	monat, tag = divmod(h + l - 7 * m + 114, 31)
	return date(jahr, monat, tag + 1)


def feiertage(jahr, betriebsruhe=False):
	"""
	Gesetzliche Feiertage in Österreich {date: Name}.
	betriebsruhe=True ergänzt Heiliger Abend und Silvester (wie die Website, src/data/erreichbarkeit.js).
	Karfreitag ist seit 2019 kein allgemeiner Feiertag; hl. Florian (4.5., OÖ) ist nicht arbeitsfrei.
	"""
	o = ostersonntag(jahr)
	liste = {
		date(jahr, 1, 1): "Neujahr",
		date(jahr, 1, 6): "Heilige Drei Könige",
		o + timedelta(days=1): "Ostermontag",
		date(jahr, 5, 1): "Staatsfeiertag",
		o + timedelta(days=39): "Christi Himmelfahrt",
		o + timedelta(days=50): "Pfingstmontag",
		o + timedelta(days=60): "Fronleichnam",
		date(jahr, 8, 15): "Mariä Himmelfahrt",
		date(jahr, 10, 26): "Nationalfeiertag",
		date(jahr, 11, 1): "Allerheiligen",
		date(jahr, 12, 8): "Mariä Empfängnis",
		date(jahr, 12, 25): "Christtag",
		date(jahr, 12, 26): "Stefanitag",
	}
	if betriebsruhe:
		liste[date(jahr, 12, 24)] = "Heiliger Abend"
		liste[date(jahr, 12, 31)] = "Silvester"
	return liste


def feiertag_am(tag, betriebsruhe=False):
	return feiertage(tag.year, betriebsruhe).get(tag)


# ---------------------------------------------------------------- Datum / Uhrzeit


def datum_parsen(wert):
	"""'YYYY-MM-DD' (oder date) -> date; sonst ValueError."""
	if isinstance(wert, datetime):
		return wert.date()
	if isinstance(wert, date):
		return wert
	text = str(wert or "").strip()
	if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", text):
		raise ValueError("Datum muss YYYY-MM-DD sein")
	return date.fromisoformat(text)


def zeit_zu_minuten(wert):
	"""'08:30', '8:30:00', time, timedelta (Frappe Time-Feld) -> Minuten ab Mitternacht; sonst ValueError."""
	if isinstance(wert, timedelta):
		return int(wert.total_seconds() // 60)
	if isinstance(wert, time):
		return wert.hour * 60 + wert.minute
	text = str(wert or "").strip()
	treffer = re.fullmatch(r"(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?", text)
	if not treffer:
		raise ValueError(f"Ungültige Uhrzeit: {text!r}")
	stunde, minute = int(treffer.group(1)), int(treffer.group(2))
	if stunde > 24 or minute > 59 or (stunde == 24 and minute):
		raise ValueError(f"Ungültige Uhrzeit: {text!r}")
	return stunde * 60 + minute


def hhmm(minuten):
	return f"{minuten // 60:02d}:{minuten % 60:02d}"


def tag_label(tag):
	"""date -> 'Fr, 2.10.'"""
	return f"{WOCHENTAGE_KURZ[tag.isoweekday()]}, {tag.day}.{tag.month}."


def datum_lang(dt):
	"""datetime -> 'Freitag, 2. Oktober 2026 um 09:00 Uhr'"""
	return f"{WOCHENTAGE[dt.isoweekday()]}, {dt.day}. {MONATE[dt.month]} {dt.year} um {dt.hour:02d}:{dt.minute:02d} Uhr"


def wochentag_nummer(wert):
	"""'Montag' / 'Mo' / 1 -> 1 … 7; sonst None."""
	if isinstance(wert, int):
		return wert if 1 <= wert <= 7 else None
	text = str(wert or "").strip()
	if text.isdigit():
		return wochentag_nummer(int(text))
	for i in range(1, 8):
		if text.lower() in (WOCHENTAGE[i].lower(), WOCHENTAGE_KURZ[i].lower()):
			return i
	return None


def monate_zurueck(tag, monate):
	"""Datum minus n Monate (31. -> letzter gültiger Tag)."""
	gesamt = tag.year * 12 + (tag.month - 1) - monate
	jahr, monat = divmod(gesamt, 12)
	monat += 1
	for t in (tag.day, 30, 29, 28):
		try:
			return date(jahr, monat, t)
		except ValueError:
			continue
	raise ValueError("Datum nicht berechenbar")


def loeschstichtag(heute, monate=LOESCHFRIST_MONATE):
	"""Termine mit Datum VOR diesem Tag werden anonymisiert."""
	return monate_zurueck(heute, monate)


# ---------------------------------------------------------------- Einstellungen


def _zahl(wert, standard, minimum=None, maximum=None, null_erlaubt=True):
	try:
		zahl = float(wert)
	except (TypeError, ValueError):
		return standard
	if wert is None or wert == "" or (not null_erlaubt and zahl == 0):
		return standard
	if minimum is not None:
		zahl = max(minimum, zahl)
	if maximum is not None:
		zahl = min(maximum, zahl)
	return zahl


def _hol(roh, feld):
	if roh is None:
		return None
	if isinstance(roh, dict):
		return roh.get(feld)
	return getattr(roh, feld, None)


def einstellungen_normalisieren(roh=None):
	"""
	„Termin Einstellungen“ (dict oder Frappe-Dokument) -> geprüftes dict für die Slot-Berechnung.
	Fehlende/ungültige Werte fallen auf STANDARD zurück. Ohne jede Zeitfenster-Zeile gelten die
	STANDARD_ZEITFENSTER (Mo–Do 08–16, Fr 08–13).
	"""
	e = {
		"slot_minuten": int(_zahl(_hol(roh, "slot_minuten"), STANDARD["slot_minuten"], 5, 240, null_erlaubt=False)),
		"vorlauf_minuten": int(round(_zahl(_hol(roh, "vorlauf_stunden"), STANDARD["vorlauf_stunden"], 0, 24 * 30) * 60)),
		"vor_ort_vorlauf_tage": int(_zahl(_hol(roh, "vor_ort_vorlauf_tage"), STANDARD["vor_ort_vorlauf_tage"], 0, 60)),
		"max_tage": int(_zahl(_hol(roh, "max_tage"), STANDARD["max_tage"], 1, 365, null_erlaubt=False)),
		"betriebsruhe": bool(int(_zahl(_hol(roh, "betriebsruhe_24_31"), STANDARD["betriebsruhe_24_31"]))),
		"kapazitaet": {
			"buero": int(_zahl(_hol(roh, "kapazitaet_buero"), STANDARD["kapazitaet_buero"], 1, 50, null_erlaubt=False)),
			"aussendienst": int(_zahl(_hol(roh, "kapazitaet_aussendienst"), STANDARD["kapazitaet_aussendienst"], 1, 50, null_erlaubt=False)),
		},
		"puffer": {
			"buero": 0,
			"aussendienst": int(_zahl(_hol(roh, "puffer_vor_ort_minuten"), STANDARD["puffer_vor_ort_minuten"], 0, 240)),
		},
		"zeitfenster": [],
		"sperrtage": {},
	}

	zeilen = _hol(roh, "zeitfenster") or []
	for z in zeilen:
		tag = wochentag_nummer(_hol(z, "wochentag"))
		try:
			beginn = zeit_zu_minuten(_hol(z, "beginn"))
			ende = zeit_zu_minuten(_hol(z, "ende"))
		except ValueError:
			continue
		art = str(_hol(z, "terminart") or "Alle").strip() or "Alle"
		if tag and ende > beginn and (art == "Alle" or art in TERMINARTEN):
			e["zeitfenster"].append((art, tag, beginn, ende))
	if not zeilen:
		e["zeitfenster"] = list(STANDARD_ZEITFENSTER)

	for s in _hol(roh, "sperrtage") or []:
		try:
			von = datum_parsen(_hol(s, "datum"))
		except ValueError:
			continue
		try:
			bis = datum_parsen(_hol(s, "bis")) if _hol(s, "bis") else von
		except ValueError:
			bis = von
		grund = str(_hol(s, "grund") or "gesperrt").strip()[:140]
		tag = von
		while tag <= bis and (tag - von).days <= 366:
			e["sperrtage"][tag] = grund
			tag += timedelta(days=1)
	return e


def zeitfenster_am(tag, terminart, e):
	"""[(beginn, ende)] in Minuten für einen Kalendertag – leer bei Feiertag, Sperrtag oder ohne Fenster."""
	if tag in e["sperrtage"] or feiertag_am(tag, e["betriebsruhe"]):
		return []
	eigene = [z for z in e["zeitfenster"] if z[0] == terminart]
	fenster = eigene or [z for z in e["zeitfenster"] if z[0] == "Alle"]
	return sorted((b, en) for _art, wt, b, en in fenster if wt == tag.isoweekday())


def raster(fenster, slot_minuten, dauer):
	"""Slot-Beginne (Minuten): alle slot_minuten ab Fensterbeginn, solange der Termin ins Fenster passt."""
	starts = set()
	for beginn, ende in fenster:
		m = beginn
		while m + dauer <= ende:
			starts.add(m)
			m += slot_minuten
	return sorted(starts)


# ---------------------------------------------------------------- Tagesstatus / Kalender


def status_aus(frei, belegt):
	if frei and belegt:
		return STATUS_TEILWEISE
	if frei:
		return STATUS_FREI
	if belegt:
		return STATUS_AUSGEBUCHT
	return STATUS_GESCHLOSSEN


def _geschlossen(tag):
	return {"datum": tag.isoformat(), "label": tag_label(tag), "status": STATUS_GESCHLOSSEN, "freie_slots": [], "belegte_slots": []}


def tag_berechnen(tag, terminart, e, belegungen, jetzt):
	"""
	Ein Kalendertag für eine Terminart.
	belegungen  [{"start": datetime, "ende": datetime, "pool": "buero"|"aussendienst"|None}] – naive Wiener Zeit;
	            pool None = blockiert alle (z. B. Kalendereintrag eines Beraters)
	jetzt       naive Wiener Zeit
	Rückgabe    {datum, label, status, freie_slots, belegte_slots}
	"""
	heute = jetzt.date()
	if tag < heute or tag > heute + timedelta(days=e["max_tage"]):
		return _geschlossen(tag)
	if terminart == VOR_ORT and tag < heute + timedelta(days=e["vor_ort_vorlauf_tage"]):
		return _geschlossen(tag)
	fenster = zeitfenster_am(tag, terminart, e)
	if not fenster:
		return _geschlossen(tag)

	dauer = timedelta(minutes=DAUER_MINUTEN[terminart])
	pool = POOL[terminart]
	kapazitaet = e["kapazitaet"][pool]
	puffer = timedelta(minutes=e["puffer"][pool])
	fruehester = jetzt + timedelta(minutes=e["vorlauf_minuten"])

	blockiert = []
	for b in belegungen:
		if b.get("pool") == pool:
			blockiert.append((b["start"] - puffer, b["ende"] + puffer))
		elif b.get("pool") is None:
			blockiert.append((b["start"], b["ende"]))

	frei, belegt = [], []
	for m in raster(fenster, e["slot_minuten"], DAUER_MINUTEN[terminart]):
		start = datetime.combine(tag, time(m // 60, m % 60))
		if start < fruehester:
			continue  # vorbei oder zu kurzfristig – weder frei noch belegt anzeigen
		ende = start + dauer
		gleichzeitig = sum(1 for s, en in blockiert if s < ende and start < en)
		(belegt if gleichzeitig >= kapazitaet else frei).append(hhmm(m))

	return {"datum": tag.isoformat(), "label": tag_label(tag), "status": status_aus(frei, belegt), "freie_slots": frei, "belegte_slots": belegt}


def bereich_begrenzen(von, bis):
	"""(von, bis) als date, bis höchstens MAX_BEREICH_TAGE Tage (inklusive) nach von."""
	if bis < von:
		raise ValueError("bis liegt vor von")
	return von, min(bis, von + timedelta(days=MAX_BEREICH_TAGE - 1))


def kalender(terminart, von, bis, e, belegungen, jetzt):
	"""Ein Eintrag je Tag von `von` bis `bis` (inkl., höchstens 60 Tage) – auch geschlossene Tage."""
	von, bis = bereich_begrenzen(von, bis)
	tage = []
	tag = von
	while tag <= bis:
		tage.append(tag_berechnen(tag, terminart, e, belegungen, jetzt))
		tag += timedelta(days=1)
	return tage


# ---------------------------------------------------------------- Eingaben der Buchung

EMAIL_RE = re.compile(r"^[^\s@<>\"',;]+@[^\s@<>\"',;]+\.[^\s@<>\"',;]{2,}$")
UHRZEIT_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
PLZ_RE = re.compile(r"^\d{4,5}$")
PFAD_RE = re.compile(r"^/[\w\-/.%~]*$")

# Kostenpflichtige/Sonderrufnummern – wie telefonNormalisieren() in src/data/erreichbarkeit.js
_GESPERRT = (
	re.compile(r"^\+49(900|137|138|180|181|190|191|192|193|194|199|118|115|110|112|116)"),
	re.compile(r"^\+491(1[0-9])$"),
	re.compile(r"^\+43(8[12]\d|900|901|930|931|939)"),
	re.compile(r"^\+41(90[0-9])"),
)

_WAHR = {"1", "true", "on", "yes", "ja"}


def text(wert, maximal, mehrzeilig=False):
	"""Steuerzeichen entfernen (bei mehrzeilig Zeilenumbrüche behalten), trimmen, kürzen."""
	s = "" if wert is None else str(wert)
	s = s.replace("\r\n", "\n").replace("\r", "\n")
	erlaubt = "\n\t" if mehrzeilig else ""
	s = "".join(z for z in s if z in erlaubt or (ord(z) >= 32 and ord(z) != 127))
	if not mehrzeilig:
		s = " ".join(s.split())
	return s.strip()[:maximal]


def telefon_normalisieren(eingabe):
	"""E.164 für AT/DE/CH, sonst None (gleiche Regeln wie die Website)."""
	t = re.sub(r"[\s\-/().]", "", str(eingabe or "").replace("(0)", ""))
	if t.startswith("00"):
		t = "+" + t[2:]
	elif t.startswith("0"):
		t = "+43" + t[1:]
	if not re.fullmatch(r"\+[1-9]\d{8,14}", t):
		return None
	if not re.match(r"^\+(49|43|41)", t):
		return None
	if any(r.search(t) for r in _GESPERRT):
		return None
	return t


def ip_pruefen(wert):
	try:
		return str(ipaddress.ip_address(str(wert or "").strip()))
	except ValueError:
		return ""


def einwilligung_gegeben(wert):
	if isinstance(wert, bool):
		return wert
	if isinstance(wert, (int, float)):
		return wert == 1
	return str(wert or "").strip().lower() in _WAHR


def ist_rueckruf(terminart, quelle):
	"""
	Rückruf-Widget und /termin senden denselben Body an buche_termin. Unterschied laut Website-Code:
	das Widget (RueckrufFormular.js) bucht immer „Telefonische Beratung“ und ist auf /termin ausgeblendet
	(RueckrufWidget.js: OHNE_WIDGET), die Terminbuchung (TerminBuchung.js) läuft nur auf /termin.
	→ Telefonische Beratung mit quelle außerhalb von /termin = Rückruf.
	"""
	q = str(quelle or "").strip()
	return terminart == TELEFON and bool(q) and not (q == "/termin" or q.startswith("/termin/") or q.startswith("/termin?"))


def nachricht_zerlegen(nachricht):
	"""
	Die Next-API hängt die Kampagnen-Herkunft als „\\n\\n—\\n[Herkunft] …“ an `nachricht` an
	(src/lib/herkunftServer.js). Rückgabe (nachricht_ohne_herkunft, herkunft_zeile_ohne_praefix).
	"""
	zeilen = str(nachricht or "").replace("\r\n", "\n").split("\n")
	behalten, herkunft = [], []
	for z in zeilen:
		if z.strip().startswith("[Herkunft]"):
			herkunft.append(z.strip()[len("[Herkunft]"):].strip())
		else:
			behalten.append(z)
	# Trenner „—“ und Leerzeilen am Ende entfernen
	while behalten and behalten[-1].strip() in ("", "—", "-", "–"):
		behalten.pop()
	return "\n".join(behalten).strip(), " · ".join(h for h in herkunft if h)


def nachricht_ohne_herkunft(nachricht):
	return nachricht_zerlegen(nachricht)[0]


def feld_aus_nachricht(nachricht, bezeichnung):
	"""Zeile „Bezeichnung: Wert“ aus der Nachricht (TerminBuchung.js: „Adresse: …“, „Unternehmen/Organisation: …“)."""
	for z in str(nachricht or "").split("\n"):
		if z.strip().lower().startswith(bezeichnung.lower() + ":"):
			return z.split(":", 1)[1].strip()
	return ""


def buchung_pruefen(d):
	"""
	Body von buche_termin (dict) prüfen und bereinigen. Wirft EingabeFehler mit Text für den Besucher.
	Die Verfügbarkeit des Slots wird NICHT hier geprüft (das passiert unter Sperre in termin.py).
	"""
	g = d.get if hasattr(d, "get") else (lambda k, _d=None: None)

	terminart = text(g("terminart"), 60)
	if terminart not in TERMINARTEN:
		raise EingabeFehler("Bitte wählen Sie eine gültige Terminart.")
	try:
		datum = datum_parsen(g("datum"))
	except ValueError:
		raise EingabeFehler("Bitte wählen Sie ein gültiges Datum.") from None
	uhrzeit = text(g("uhrzeit"), 5)
	if not UHRZEIT_RE.match(uhrzeit):
		raise EingabeFehler("Bitte wählen Sie eine gültige Uhrzeit.")

	name = text(g("name_komplett"), 140)
	if len(name) < 2 or not re.search(r"[^\W\d_]", name):
		raise EingabeFehler("Bitte geben Sie Ihren Namen an.")
	email = text(g("email"), 190).lower()
	if not EMAIL_RE.match(email):
		raise EingabeFehler("Bitte geben Sie eine gültige E-Mail-Adresse an.")
	telefon = telefon_normalisieren(g("telefon"))
	if not telefon:
		raise EingabeFehler("Bitte geben Sie eine gültige Telefonnummer aus Österreich, Deutschland oder der Schweiz an.")
	plz = text(g("plz"), 10)
	if not PLZ_RE.match(plz):
		raise EingabeFehler("Bitte geben Sie eine gültige Postleitzahl an.")
	if not einwilligung_gegeben(g("einwilligung")):
		raise EingabeFehler("Bitte bestätigen Sie die Einwilligung zur Verarbeitung Ihrer Angaben.")

	nachricht_roh = text(g("nachricht"), 8000, mehrzeilig=True)
	nachricht, herkunft = nachricht_zerlegen(nachricht_roh)
	quelle = text(g("quelle"), 200)
	if quelle and not PFAD_RE.match(quelle):
		quelle = ""
	rueckruf = ist_rueckruf(terminart, quelle)
	minuten = zeit_zu_minuten(uhrzeit)
	start = datetime.combine(datum, time(minuten // 60, minuten % 60))
	dauer = RUECKRUF_DAUER_MINUTEN if rueckruf else DAUER_MINUTEN[terminart]

	return {
		"terminart": terminart,
		"anfrageart": ANFRAGEART_RUECKRUF if rueckruf else ANFRAGEART_TERMIN,
		"rueckruf": rueckruf,
		"datum": datum,
		"uhrzeit": uhrzeit,
		"start": start,
		"ende": start + timedelta(minutes=dauer),
		"name_komplett": name,
		"email": email,
		"telefon": telefon,
		"plz": plz,
		"thema": text(g("thema"), 100),
		"nachricht": nachricht,
		"herkunft": text(herkunft, 500),
		"adresse": text(feld_aus_nachricht(nachricht, "Adresse"), 300) if terminart == VOR_ORT else "",
		"firma": text(feld_aus_nachricht(nachricht, "Unternehmen/Organisation"), 140),
		"quelle": quelle,
		"ip_adresse": ip_pruefen(g("ip_adresse")),
		"einwilligung": 1,
	}


def referenz_format(jahr, nummer):
	"""Anzeigeformat der Buchungsnummer, z. B. T-2026-000123 (in Frappe über autoname erzeugt)."""
	return f"T-{jahr}-{int(nummer):06d}"


# ---------------------------------------------------------------- .ics (RFC 5545)

VTIMEZONE_WIEN = (
	"BEGIN:VTIMEZONE",
	"TZID:Europe/Vienna",
	"X-LIC-LOCATION:Europe/Vienna",
	"BEGIN:DAYLIGHT",
	"TZOFFSETFROM:+0100",
	"TZOFFSETTO:+0200",
	"TZNAME:CEST",
	"DTSTART:19700329T020000",
	"RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
	"END:DAYLIGHT",
	"BEGIN:STANDARD",
	"TZOFFSETFROM:+0200",
	"TZOFFSETTO:+0100",
	"TZNAME:CET",
	"DTSTART:19701025T030000",
	"RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
	"END:STANDARD",
	"END:VTIMEZONE",
)


def ics_text(wert):
	"""TEXT-Wert escapen: Backslash, Semikolon, Komma, Zeilenumbruch."""
	s = str(wert or "").replace("\r\n", "\n").replace("\r", "\n")
	return s.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n")


def ics_falten(zeile):
	"""Zeilen auf höchstens 75 Oktette (UTF-8) falten, ohne Mehrbyte-Zeichen zu teilen."""
	teile, aktuell, laenge, grenze = [], "", 0, 75
	for z in zeile:
		n = len(z.encode("utf-8"))
		if laenge + n > grenze:
			teile.append(aktuell)
			aktuell, laenge, grenze = "", 0, 74  # Folgezeilen beginnen mit einem Leerzeichen
		aktuell += z
		laenge += n
	teile.append(aktuell)
	return "\r\n ".join(teile)


def ics_erzeugen(uid, start, ende, titel, beschreibung="", ort="", dtstamp_utc=None, status="CONFIRMED", url="", sequenz=0):
	"""VCALENDAR mit einem VEVENT; start/ende naive Wiener Zeit (TZID=Europe/Vienna), CRLF-Zeilenenden."""
	stempel = dtstamp_utc or datetime.now(timezone.utc)
	if stempel.tzinfo is not None:
		stempel = stempel.astimezone(timezone.utc).replace(tzinfo=None)
	fmt = "%Y%m%dT%H%M%S"
	zeilen = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Oekovolt Solartechnik GmbH//Website Termin//DE",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		*VTIMEZONE_WIEN,
		"BEGIN:VEVENT",
		f"UID:{uid}",
		f"DTSTAMP:{stempel.strftime(fmt)}Z",
		f"DTSTART;TZID={ZEITZONE}:{start.strftime(fmt)}",
		f"DTEND;TZID={ZEITZONE}:{ende.strftime(fmt)}",
		f"SUMMARY:{ics_text(titel)}",
	]
	if ort:
		zeilen.append(f"LOCATION:{ics_text(ort)}")
	if beschreibung:
		zeilen.append(f"DESCRIPTION:{ics_text(beschreibung)}")
	if url:
		zeilen.append(f"URL:{url}")
	zeilen += [f"STATUS:{status}", f"SEQUENCE:{int(sequenz)}", "TRANSP:OPAQUE", "END:VEVENT", "END:VCALENDAR"]
	return "\r\n".join(ics_falten(z) for z in zeilen) + "\r\n"


def termin_ort(termin):
	art = termin.get("terminart")
	if termin.get("rueckruf") or art == TELEFON:
		return f"Telefon – wir rufen Sie unter {termin.get('telefon') or 'Ihrer Nummer'} an"
	if art == VIDEO:
		return "Video-Beratung – den Link erhalten Sie per E-Mail"
	return termin.get("adresse") or (f"PLZ {termin.get('plz')}" if termin.get("plz") else "Vor Ort")


def termin_titel(termin):
	if termin.get("rueckruf"):
		return f"Rückruf von {FIRMA['kurz']}"
	return f"{FIRMA['kurz']}: {termin.get('terminart')}"


def termin_ics(termin, dtstamp_utc=None, status="CONFIRMED", sequenz=0):
	"""
	.ics für einen Website-Termin (dict mit referenz, terminart, rueckruf, start, ende, telefon, plz,
	adresse, thema, nachricht). Die interne Zeile „[Herkunft] …“ wird nie übernommen.
	"""
	zeilen = []
	if termin.get("rueckruf"):
		zeilen.append(f"{FIRMA['kurz']} ruft Sie zu Ihrer Anfrage zurück.")
	else:
		zeilen.append(f"{termin.get('terminart')} mit {FIRMA['kurz']}.")
	zeilen.append(f"Buchungsnummer: {termin.get('referenz')}")
	if termin.get("thema"):
		zeilen.append(f"Thema: {termin.get('thema')}")
	nachricht = nachricht_ohne_herkunft(termin.get("nachricht"))
	if nachricht:
		zeilen += ["", "Ihre Nachricht:", nachricht]
	zeilen += ["", f"Fragen oder Terminänderung: {FIRMA['telefon']} · {FIRMA['email']}"]
	return ics_erzeugen(
		uid=f"{termin.get('referenz')}@{FIRMA['domain']}",
		start=termin["start"],
		ende=termin["ende"],
		titel=termin_titel(termin),
		beschreibung="\n".join(zeilen),
		ort=termin_ort(termin),
		dtstamp_utc=dtstamp_utc,
		status=status,
		url=FIRMA["web"],
		sequenz=sequenz,
	)
