# Copyright (c) 2026, ÖKOVOLT
#
# Speed-to-Lead II (Welle A06) – Eingang jedes Website-Leads.
#   hooks.py doc_events after_insert für Kontaktanfrage, Angebotsanfrage, Rechner Lead,
#   Solarrechner Anfrage und Website Termin -> after_insert(doc, method)
#
# Ablauf je Lead:
#   1. Segment (falls leer), Bundesland, Lead-Score/-Klasse/-Gründe, Lead-Schlüssel, eingang_am setzen
#   2. Dubletten (gleiche E-Mail oder gleiche E.164-Telefonnummer in 30 Tagen): Kommentar am Erst-Lead,
#      gleiche Zuständigkeit, „Frühere Anfragen“ befüllen, Team nicht doppelt benachrichtigen
#   3. Zuständigkeit über „Lead Routing Regel“ (Abwesenheit laut User.abwesend_bis -> Vertretung,
#      sonst Fallback-Rolle), Zuweisung per frappe.desk.form.assign_to.add, SLA-Frist (sla.py)
#   4. Team-Mail „[A] Angebotsanfrage: …“ mit Block „Frühere Anfragen“; ohne site_config
#      oekovolt_routing_aktiv = 1 wie bisher nur an Rolle Vertrieb + Sammelpostfach
#   5. Sofortalarm für A-Leads (Webhook/SMS) OHNE Personendaten
#
# Schnittstelle zu A11 (format.py): lead_score(daten, quelle) -> (score, klasse, gruende),
# bundesland_aus_plz(plz), lead_schluessel(email), telefon_e164(tel). Solange diese Stubs fehlen,
# greifen die Notlösungen unten (_fallback_*), damit die App weiter startet.
#
# Reine Funktionen (ohne Frappe) stehen im oberen Teil und werden von tests/test_lead_routing.py
# geprüft; Geschäftszeiten/Feiertage liefert ausschließlich termin_logik.py (Europe/Vienna).

import html as _html
from datetime import date, datetime, timedelta

try:
	import frappe
except ImportError:  # Tests ohne Bench (tests/test_lead_routing.py)
	frappe = None

from oekovolt_app.website_api import format as fmt
from oekovolt_app.website_api import termin_logik as L

# rechner.py prüft das: after_insert überspringt Rechner-Leads mit flags.lead_eingang_aufschieben (A11)
AUFSCHUB_UNTERSTUETZT = True

try:  # A11 legt diese Funktionen in format.py an; bis dahin Notlösung (siehe Übergabe in A06.md)
	from oekovolt_app.website_api.format import lead_score
except ImportError:
	def lead_score(daten, quelle):  # noqa: D103 – Notlösung bis A11
		return 0, "C", ["Scoring (A11) noch nicht verfügbar"]
try:
	from oekovolt_app.website_api.format import bundesland_aus_plz
except ImportError:
	def bundesland_aus_plz(plz):  # noqa: D103 – Notlösung bis A11
		return None
try:
	from oekovolt_app.website_api.format import lead_schluessel
except ImportError:
	def lead_schluessel(email):  # noqa: D103 – Notlösung bis A11
		return (email or "").strip().lower() or None
try:
	from oekovolt_app.website_api.format import telefon_e164
except ImportError:
	def telefon_e164(tel):  # noqa: D103 – Notlösung bis A11
		return L.telefon_normalisieren(tel)


# ================================================================ Konstanten

LEAD_DOCTYPES = ("Kontaktanfrage", "Angebotsanfrage", "Rechner Lead", "Solarrechner Anfrage", "Website Termin")

# Quelle für lead_score(daten, quelle) je DocType (A11: Termin/Scan 10, Konfigurator 8, PDF-Analyse 6, Rechner/Kontakt 4)
QUELLE = {
	"Kontaktanfrage": "kontakt",
	"Angebotsanfrage": "konfigurator",
	"Rechner Lead": "rechner",
	"Solarrechner Anfrage": "pdf-analyse",
	"Website Termin": "termin",
}

# Segmente mit eigener Spur: keine Routing-Regel, kein Score-Alarm, keine SLA-Eskalation – Mail an diese Rolle
SPUREN = {"Service": "Service", "Bewerbung": "Personal", "Presse": "Marketing"}

# Rolle der Team-Mail ohne Routing (site_config oekovolt_routing_aktiv != 1) – „wie bisher“
STANDARD_ROLLE = {"Website Termin": "Terminberatung"}

KLASSEN_RANG = {"A": 3, "B": 2, "C": 1}

DUBLETTEN_TAGE = 30
ENGAGEMENT_TAGE = 90  # A11: weitere Anfrage mit gleichem Schlüssel in 90 Tagen

# Status, bei denen ein Erst-Lead als abgeschlossen gilt (dann normale Benachrichtigung statt Dubletten-Stille)
ABGESCHLOSSEN_STATUS = ("Gewonnen", "Verloren", "Erledigt", "Spam", "Abgesagt")

# Felder, die nie in Alarm-Nutzlasten (Webhook/SMS) landen dürfen
PERSONENFELDER = (
	"vorname", "nachname", "name_komplett", "kunden_name", "firma", "email", "telefon",
	"strasse_hausnummer", "adresse", "ort", "nachricht", "notiz", "ip_adresse", "lead_schluessel",
)

# Segment aus Thema/Objekt ableiten, wenn die Website keins mitschickt (Reihenfolge = Priorität)
_SEGMENT_SCHLUESSEL = (
	(("bewerb", "karriere", "job", "lehrstell", "praktik"), "Bewerbung"),
	(("presse", "medien", "journalist", "interview"), "Presse"),
	(("störung", "stoerung", "wartung", "service", "laufendes projekt", "rechnung", "buchhaltung", "monitoring", "reparatur"), "Service"),
	(("lieferant", "partner", "subunternehm"), "Partner"),
	(("gemeinde", "kommun", "öffentlich", "oeffentlich", "stadt", "markt"), "Gemeinde & öffentliche Hand"),
	(("agri", "freifl", "solarpark"), "Freifläche/Agri-PV"),
	(("landwirt", "agrar", "bauernhof", "stall", "hof"), "Landwirtschaft"),
	(("hotel", "touris", "gastro", "pension", "camping"), "Hotellerie & Tourismus"),
	(("chalet", "premium", "villa"), "Chalet & Premium"),
	(("gewerbe", "industrie", "betrieb", "unternehmen", "firma", "logistik", "handel", "autohaus", "produktion"), "Gewerbe & Industrie"),
	(("privat", "einfamilien", "eigenheim", "wohnhaus", "haushalt"), "Privat"),
)
_SEGMENT_FELDER = ("segment_hinweis", "objekt", "gebaeudetyp", "thema", "rechner", "zweck", "terminart", "vorhaben")


# ================================================================ Reine Funktionen (ohne Frappe)


def _text(wert):
	return str(wert if wert is not None else "").strip()


def segment_ableiten(daten):
	"""Segment aus Thema/Objekt/Rechner ableiten; nichts erkannt -> „Sonstiges“. Vorhandenes Segment bleibt."""
	if _text(daten.get("segment")):
		return _text(daten.get("segment"))
	text = " ".join(_text(daten.get(f)) for f in _SEGMENT_FELDER).lower()
	for woerter, segment in _SEGMENT_SCHLUESSEL:
		if any(w in text for w in woerter):
			return segment
	return "Sonstiges"


def eigene_spur(segment):
	"""Rolle der eigenen Spur (Service/Personal/Marketing) oder None für Vertriebs-Leads."""
	return SPUREN.get(_text(segment))


def klasse_erfuellt(klasse, mindest_klasse):
	"""Lead-Klasse erreicht die Mindest-Klasse der Regel (leer oder C = alle)."""
	if not mindest_klasse:
		return True
	return KLASSEN_RANG.get(_text(klasse), 0) >= KLASSEN_RANG.get(_text(mindest_klasse), 0)


def _plz_zahl(wert):
	t = _text(wert)
	return int(t) if t.isdigit() else None


def regel_passt(regel, lead):
	"""Passt eine „Lead Routing Regel“ (dict/Document) auf den Lead {doctype, segment, bundesland, plz, lead_klasse}?"""
	hol = regel.get if hasattr(regel, "get") else (lambda k, d=None: getattr(regel, k, d))
	if not int(hol("aktiv") or 0):
		return False
	if _text(hol("doctype_filter")) and _text(hol("doctype_filter")) != _text(lead.get("doctype")):
		return False
	if _text(hol("segment")) and _text(hol("segment")) != _text(lead.get("segment")):
		return False
	if _text(hol("bundesland")) and _text(hol("bundesland")) != _text(lead.get("bundesland")):
		return False
	von, bis = _plz_zahl(hol("plz_von")), _plz_zahl(hol("plz_bis"))
	if von is not None and bis is not None:
		plz = _plz_zahl(lead.get("plz"))
		if plz is None or not (von <= plz <= bis):
			return False
	return klasse_erfuellt(lead.get("lead_klasse"), hol("mindest_klasse"))


def regel_waehlen(regeln, lead):
	"""Erste passende Regel nach (reihenfolge, name) oder None."""
	def hol(r, k):
		return r.get(k) if hasattr(r, "get") else getattr(r, k, None)

	sortiert = sorted(regeln, key=lambda r: (int(hol(r, "reihenfolge") or 0), _text(hol(r, "name"))))
	for regel in sortiert:
		if regel_passt(regel, lead):
			return regel
	return None


def ist_abwesend(abwesend_bis, heute):
	"""User.abwesend_bis (date/datetime/ISO-Text) gilt einschließlich des Tages."""
	if not abwesend_bis:
		return False
	if isinstance(abwesend_bis, datetime):
		abwesend_bis = abwesend_bis.date()
	elif isinstance(abwesend_bis, str):
		try:
			abwesend_bis = date.fromisoformat(abwesend_bis[:10])
		except ValueError:
			return False
	if isinstance(heute, datetime):
		heute = heute.date()
	return abwesend_bis >= heute


def zustaendige_bestimmen(regel, abwesenheiten, heute):
	"""
	Zuständigkeit aus der Regel: {zustaendig, vertretung, rolle, grund}.
	abwesenheiten: {benutzer: abwesend_bis|None}. Reihenfolge: Benutzer -> Vertretung -> Fallback-Rolle.
	"""
	hol = regel.get if hasattr(regel, "get") else (lambda k, d=None: getattr(regel, k, d))
	benutzer, vertretung, rolle = _text(hol("benutzer")), _text(hol("vertretung")), _text(hol("rolle_fallback"))
	if benutzer and not ist_abwesend(abwesenheiten.get(benutzer), heute):
		return {"zustaendig": benutzer, "vertretung": vertretung or None, "rolle": None, "grund": "Regel"}
	if vertretung and not ist_abwesend(abwesenheiten.get(vertretung), heute):
		return {"zustaendig": vertretung, "vertretung": None, "rolle": None, "grund": "Vertretung (Zuständiger abwesend)"}
	return {"zustaendig": None, "vertretung": None, "rolle": rolle or None, "grund": "Fallback-Rolle"}


def dubletten_finden(kandidaten, schluessel, telefon, eigener_name, jetzt, tage=DUBLETTEN_TAGE):
	"""
	Frühere Anfragen derselben Person innerhalb des Fensters (älteste zuerst).
	kandidaten: [{doctype, name, creation, status, zustaendig, lead_schluessel, email, telefon, lead_klasse}]
	Treffer: gleicher Lead-Schlüssel (E-Mail) ODER gleiche E.164-Telefonnummer, Anlage innerhalb `tage` vor `jetzt`.
	"""
	stichtag = jetzt - timedelta(days=tage)
	treffer = []
	for k in kandidaten:
		if k.get("name") == eigener_name:
			continue
		angelegt = k.get("creation")
		if isinstance(angelegt, str):
			angelegt = datetime.fromisoformat(angelegt[:19])
		if angelegt is None or angelegt < stichtag or angelegt > jetzt:
			continue
		k_schluessel = _text(k.get("lead_schluessel")) or _text(lead_schluessel(k.get("email")))
		k_tel = telefon_e164(k.get("telefon"))
		if (schluessel and k_schluessel == schluessel) or (telefon and k_tel == telefon):
			treffer.append({**k, "creation": angelegt})
	treffer.sort(key=lambda k: k["creation"])
	return treffer


def offener_erst_lead(treffer):
	"""Ältester noch offener Erst-Lead (Status nicht abgeschlossen) oder None."""
	for k in treffer:
		if _text(k.get("status")) not in ABGESCHLOSSEN_STATUS:
			return k
	return None


def fruehere_anfragen_text(treffer):
	"""Inhalt des Feldes fruehere_anfragen (eine Zeile je Anfrage)."""
	zeilen = []
	for k in treffer:
		wann = k["creation"].strftime("%d.%m.%Y") if isinstance(k.get("creation"), datetime) else _text(k.get("creation"))
		teile = [f"{k.get('doctype')} {k.get('name')}", wann, f"Status {k.get('status') or '–'}"]
		if k.get("zustaendig"):
			teile.append(f"zuständig {k['zustaendig']}")
		zeilen.append(" · ".join(teile))
	return "\n".join(zeilen)


def fruehere_anfragen_html(treffer, link_fn):
	"""Block „Frühere Anfragen“ für die Team-Mail (leer ohne Treffer). link_fn(doctype, name) -> Desk-URL."""
	if not treffer:
		return ""
	li = "".join(
		f"<li><a href='{_html.escape(link_fn(k['doctype'], k['name']))}'>{_html.escape(str(k['name']))}</a> "
		f"({_html.escape(str(k.get('doctype')))}, {k['creation'].strftime('%d.%m.%Y')}, Status {_html.escape(str(k.get('status') or '–'))}"
		+ (f", zuständig {_html.escape(str(k['zustaendig']))}" if k.get("zustaendig") else "")
		+ ")</li>"
		for k in treffer
	)
	return (
		"<div style='font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;margin-top:12px'>"
		f"<p><b>Frühere Anfragen</b> (gleiche E-Mail oder Telefonnummer, letzte {DUBLETTEN_TAGE} Tage):</p><ul>{li}</ul></div>"
	)


def betreff_mit_klasse(klasse, betreff):
	"""„[A] Angebotsanfrage: …“ – Klasse vorne, damit Postfach-Regeln greifen."""
	k = _text(klasse)
	return f"[{k}] {betreff}" if k in KLASSEN_RANG else betreff


def bezirk_text(bundesland, plz):
	"""Grobe Ortsangabe ohne Personenbezug: Bundesland und PLZ-Gebiet (erste zwei Ziffern)."""
	p = _text(plz)
	gebiet = f"PLZ-Gebiet {p[:2]}xx" if len(p) >= 2 and p[:2].isdigit() else ""
	return " · ".join(t for t in (_text(bundesland), gebiet) if t) or "ohne Ortsangabe"


def alarm_nutzlast(lead, link):
	"""
	Nutzlast für Webhook (Teams/Slack) und SMS bei A-Leads – OHNE Name, E-Mail, Telefon, Adresse.
	lead: {doctype, name, lead_klasse, segment, bundesland, plz, sla_bis}
	"""
	bezirk = bezirk_text(lead.get("bundesland"), lead.get("plz"))
	klasse = _text(lead.get("lead_klasse")) or "–"
	segment = _text(lead.get("segment")) or "–"
	sla = lead.get("sla_bis")
	if isinstance(sla, datetime):
		sla = sla.strftime("%d.%m. %H:%M")
	text = f"{klasse}-Lead eingegangen: {segment} · {bezirk} · {lead.get('doctype')} {lead.get('name')}"
	if sla:
		text += f" · Erstreaktion bis {sla}"
	text += f" · {link}"
	return {
		"text": text,
		"klasse": klasse,
		"segment": segment,
		"bezirk": bezirk,
		"doctype": _text(lead.get("doctype")),
		"name": _text(lead.get("name")),
		"link": link,
		"sla_bis": sla or None,
	}


def nutzlast_ohne_personendaten(nutzlast, lead):
	"""True, wenn weder Personenfelder noch deren Werte in der Nutzlast vorkommen (Test und Laufzeitschutz)."""
	if any(f in nutzlast for f in PERSONENFELDER):
		return False
	flach = " ".join(str(v) for v in nutzlast.values() if v is not None).lower()
	for feld in PERSONENFELDER:
		wert = _text(lead.get(feld)).lower()
		if len(wert) >= 3 and wert in flach:
			return False
	return True


def sammelpostfach(konfiguration):
	"""site_config oekovolt_benachrichtigung_an (Text oder Liste) -> Liste."""
	extra = konfiguration or []
	if isinstance(extra, str):
		extra = [extra]
	return [e for e in extra if e]


def empfaenger_zusammenstellen(zustaendig, vertretung, postfach):
	"""Zuständiger, Vertretung und Sammelpostfach ohne Doppelte und Leere (Reihenfolge bleibt)."""
	return [e for e in dict.fromkeys([zustaendig, vertretung, *postfach]) if e]


# ================================================================ Frappe-Anbindung


def after_insert(doc, method=None):
	"""doc_events after_insert für alle Lead-DocTypes. Darf das Anlegen nie verhindern."""
	if doc.doctype not in LEAD_DOCTYPES:
		return
	# Rechner-Leads mit Double-Opt-in: Score, Routing und Team-Mail erst nach der E-Mail-Bestätigung
	# (rechner.bestaetige_lead ruft den Eingang dann selbst auf, A11)
	if doc.doctype == "Rechner Lead" and doc.flags.get("lead_eingang_aufschieben"):
		return
	try:
		_verarbeiten(doc)
	except Exception:
		frappe.log_error(title=f"Lead-Eingang {doc.doctype} {doc.name} fehlgeschlagen")


def _hat(doc, feld):
	return frappe.get_meta(doc.doctype).has_field(feld)


def _felder_setzen(doc, werte):
	"""Nur vorhandene Felder schreiben (A11-Schema optional), ohne modified zu verändern."""
	vorhanden = {k: v for k, v in werte.items() if _hat(doc, k)}
	if vorhanden:
		frappe.db.set_value(doc.doctype, doc.name, vorhanden, update_modified=False)
		doc.update(vorhanden)


def _einstellungen():
	"""Termin Einstellungen (Zeitfenster, Sperrtage) für die SLA-Berechnung; fehlt alles -> Standard."""
	try:
		return L.einstellungen_normalisieren(frappe.get_cached_doc("Termin Einstellungen"))
	except Exception:
		return L.einstellungen_normalisieren(None)


def _kandidaten(stichtag):
	"""Leads der letzten 30 Tage aus allen Lead-DocTypes (nur die Felder für den Dubletten-Abgleich)."""
	liste = []
	for doctype in LEAD_DOCTYPES:
		if not frappe.db.exists("DocType", doctype):
			continue
		meta = frappe.get_meta(doctype)
		felder = ["name", "creation", "status", "email", "telefon"]
		felder += [f for f in ("zustaendig", "lead_schluessel", "lead_klasse") if meta.has_field(f)]
		for zeile in frappe.get_all(doctype, filters={"creation": [">=", stichtag]}, fields=felder, limit=2000):
			liste.append({**zeile, "doctype": doctype})
	return liste


def _regeln():
	if not frappe.db.exists("DocType", "Lead Routing Regel"):
		return []
	return frappe.get_all(
		"Lead Routing Regel",
		filters={"aktiv": 1},
		fields=["name", "reihenfolge", "doctype_filter", "segment", "bundesland", "plz_von", "plz_bis",
			"mindest_klasse", "benutzer", "vertretung", "rolle_fallback", "aktiv"],
		order_by="reihenfolge asc, name asc",
	)


def _abwesenheiten(*nutzer):
	"""{benutzer: abwesend_bis} aus dem Custom Field User.abwesend_bis (fehlt es, gilt niemand als abwesend)."""
	if not frappe.get_meta("User").has_field("abwesend_bis"):
		return {}
	return {u: frappe.db.get_value("User", u, "abwesend_bis") for u in nutzer if u}


def _rollen_nutzer(rolle):
	if not rolle:
		return []
	from oekovolt_app.website_api.helfer import _empfaenger

	return _empfaenger(rolle)[0]


def _zuweisen(doc, nutzer, klasse, sla_bis):
	"""Zuweisung (ToDo) per frappe.desk.form.assign_to.add – schlägt sie fehl, bleibt der Lead trotzdem gespeichert."""
	nutzer = [u for u in dict.fromkeys(nutzer) if u]
	if not nutzer:
		return
	from frappe.desk.form.assign_to import add

	try:
		add({
			"assign_to": nutzer,
			"doctype": doc.doctype,
			"name": doc.name,
			"description": f"{klasse or '–'}-Lead ({doc.get('segment') or 'ohne Segment'}) – Erstreaktion bis "
				+ (sla_bis.strftime("%d.%m.%Y %H:%M") if sla_bis else "–"),
			"priority": "High" if klasse == "A" else ("Medium" if klasse == "B" else "Low"),
			"date": sla_bis.date().isoformat() if sla_bis else None,
			"notify": 0,
		})
	except Exception:
		frappe.log_error(title=f"Zuweisung {doc.doctype} {doc.name} fehlgeschlagen")


def _kommentar_erst_lead(erst, doc):
	from frappe.utils import get_url_to_form

	link = get_url_to_form(doc.doctype, doc.name)
	try:
		frappe.get_doc({
			"doctype": "Comment",
			"comment_type": "Info",
			"reference_doctype": erst["doctype"],
			"reference_name": erst["name"],
			"content": f"Erneute Anfrage derselben Person: <a href='{_html.escape(link)}'>{_html.escape(doc.doctype)} "
				f"{_html.escape(doc.name)}</a> (Klasse {_html.escape(str(doc.get('lead_klasse') or '–'))}).",
		}).insert(ignore_permissions=True)
	except Exception:
		frappe.log_error(title=f"Dubletten-Kommentar {erst['doctype']} {erst['name']} fehlgeschlagen")


def _team_mail(doc, klasse, treffer):
	"""Betreff und HTML der Team-Mail: Bauer aus format.py je DocType, sonst allgemeine Tabelle."""
	from frappe.utils import get_url_to_form

	link = get_url_to_form(doc.doctype, doc.name)
	daten = doc.as_dict()
	bauer = {
		"Kontaktanfrage": "team_mail_kontakt",
		"Angebotsanfrage": "team_mail_angebot",
		"Solarrechner Anfrage": "team_mail_solarrechner",
		"Rechner Lead": "team_mail_rechner",
		"Website Termin": "team_mail_termin",
	}.get(doc.doctype)
	fn = getattr(fmt, bauer, None) if bauer else None
	if fn:
		betreff, html = fn(daten, link)
	else:
		betreff, html = _team_mail_allgemein(doc, daten, link)
	zusatz = fmt._tabelle([
		("Lead-Klasse", f"{klasse} ({doc.get('lead_score') or 0} Punkte)" if klasse else ""),
		("Segment", doc.get("segment")),
		("Bundesland", doc.get("bundesland")),
		("Zuständig", doc.get("zustaendig")),
		("Erstreaktion bis", doc.get("sla_bis").strftime("%d.%m.%Y %H:%M") if isinstance(doc.get("sla_bis"), datetime) else ""),
		("Score-Gründe", doc.get("score_gruende")),
	])
	html = html + f"<div style='font-family:Arial,Helvetica,sans-serif;font-size:14px;margin-top:12px'>{zusatz}</div>"
	html += fruehere_anfragen_html(treffer, get_url_to_form)
	return betreff_mit_klasse(klasse, betreff), html


def _team_mail_allgemein(doc, daten, link):
	name = daten.get("name_komplett") or daten.get("kunden_name") or " ".join(
		t for t in (daten.get("vorname"), daten.get("nachname")) if t
	)
	betreff = f"{doc.doctype}: {daten.get('thema') or daten.get('terminart') or daten.get('rechner') or 'Website'} – {name}".strip(" –")
	zeilen = [
		("Name", name),
		("Firma", daten.get("firma")),
		("E-Mail", daten.get("email")),
		("Telefon", daten.get("telefon")),
		("PLZ/Ort", " ".join(t for t in (daten.get("plz"), daten.get("ort")) if t)),
		("Thema", daten.get("thema")),
		("Terminart", daten.get("terminart")),
		("Termin", daten.get("start").strftime("%d.%m.%Y %H:%M") if isinstance(daten.get("start"), datetime) else ""),
		("Rechner", daten.get("rechner")),
		("Ergebnis", daten.get("ergebnis")),
		("Nachricht", daten.get("nachricht")),
		("Seite", daten.get("quelle")),
		("Herkunft", daten.get("herkunft")),
	]
	return betreff, fmt._team_rahmen(f"Neuer Lead ({doc.doctype}) von der Website:", zeilen, link)


def webhook_senden(url, nutzlast):
	"""POST an Teams/Slack-Webhook (Hintergrundjob). Nutzlast enthält keine Personendaten."""
	import requests

	try:
		antwort = requests.post(url, json=nutzlast, timeout=8)
		if antwort.status_code >= 300:
			frappe.log_error(title="Lead-Alarm Webhook abgelehnt", message=f"HTTP {antwort.status_code}: {antwort.text[:500]}")
	except Exception:
		frappe.log_error(title="Lead-Alarm Webhook fehlgeschlagen")


def _alarm(doc, lead):
	"""Sofortalarm für A-Leads: Webhook (site_config oekovolt_alarm_webhook) und SMS (SMS Settings + oekovolt_alarm_sms_an)."""
	from frappe.utils import get_url_to_form

	nutzlast = alarm_nutzlast(lead, get_url_to_form(doc.doctype, doc.name))
	if not nutzlast_ohne_personendaten(nutzlast, doc.as_dict()):
		frappe.log_error(title=f"Lead-Alarm {doc.doctype} {doc.name} unterdrückt (Personendaten in Nutzlast)")
		return
	url = frappe.conf.get("oekovolt_alarm_webhook")
	if url:
		try:
			frappe.enqueue(webhook_senden, url=url, nutzlast=nutzlast, enqueue_after_commit=True, queue="short")
		except Exception:
			webhook_senden(url, nutzlast)
	nummern = frappe.conf.get("oekovolt_alarm_sms_an") or []
	if isinstance(nummern, str):
		nummern = [nummern]
	nummern = [n for n in nummern if n]
	if nummern:
		try:
			if frappe.db.get_single_value("SMS Settings", "sms_gateway_url"):
				from frappe.core.doctype.sms_settings.sms_settings import send_sms

				send_sms(nummern, nutzlast["text"], success_msg=False)
		except Exception:
			frappe.log_error(title=f"Lead-Alarm SMS {doc.doctype} {doc.name} fehlgeschlagen")


def _glocke(nutzer, betreff, doc):
	try:
		frappe.get_doc({
			"doctype": "Notification Log",
			"for_user": nutzer,
			"type": "Alert",
			"document_type": doc.doctype,
			"document_name": doc.name,
			"subject": betreff,
		}).insert(ignore_permissions=True)
	except Exception:
		frappe.log_error(title=f"Glocke {doc.doctype} {doc.name} fehlgeschlagen")


def _verarbeiten(doc):
	from frappe.utils import cint, now_datetime

	from oekovolt_app.website_api import sla
	from oekovolt_app.website_api.helfer import team_benachrichtigen
	from oekovolt_app.website_api.termin import system_zu_wien, wien_zu_system

	jetzt = now_datetime()
	jetzt_wien = system_zu_wien(jetzt)
	daten = doc.as_dict()

	# 1) Segment, Bundesland, Schlüssel
	segment = segment_ableiten(daten)
	bundesland = _text(daten.get("bundesland")) or bundesland_aus_plz(daten.get("plz"))
	schluessel = lead_schluessel(daten.get("email"))
	telefon = telefon_e164(daten.get("telefon"))

	# 2) Dubletten (30 Tage) und Engagement (90 Tage) über alle Lead-DocTypes
	kandidaten = _kandidaten(jetzt - timedelta(days=ENGAGEMENT_TAGE))
	treffer = dubletten_finden(kandidaten, schluessel, telefon, doc.name, jetzt, DUBLETTEN_TAGE)
	engagement = dubletten_finden(kandidaten, schluessel, telefon, doc.name, jetzt, ENGAGEMENT_TAGE)
	erst = offener_erst_lead(treffer)

	# 3) Scoring (A11)
	score, klasse, gruende = lead_score(
		{**daten, "segment": segment, "bundesland": bundesland, "fruehere_anfragen_anzahl": len(engagement)},
		QUELLE[doc.doctype],
	)
	klasse = _text(klasse) if _text(klasse) in KLASSEN_RANG else "C"
	spur = eigene_spur(segment)

	werte = {
		"segment": segment,
		"bundesland": bundesland,
		"lead_score": cint(score),
		"lead_klasse": klasse,
		"score_gruende": "\n".join(str(g) for g in (gruende or [])),
		"lead_schluessel": schluessel,
		"eingang_am": jetzt,
		"fruehere_anfragen": fruehere_anfragen_text(treffer),
	}

	# 4) SLA-Frist (nicht für eigene Spuren)
	sla_bis = None
	if not spur:
		sla_bis = sla.sla_frist(klasse, jetzt_wien, _einstellungen())
		werte["sla_bis"] = wien_zu_system(sla_bis)

	# 5) Zuständigkeit
	routing_aktiv = cint(frappe.conf.get("oekovolt_routing_aktiv")) == 1
	zustaendig = vertretung = None
	pool = []
	if erst and erst.get("zustaendig"):
		zustaendig = erst["zustaendig"]  # gleiche Zuständigkeit wie beim Erst-Lead
	elif routing_aktiv and not spur:
		lead = {"doctype": doc.doctype, "segment": segment, "bundesland": bundesland, "plz": daten.get("plz"), "lead_klasse": klasse}
		regel = regel_waehlen(_regeln(), lead)
		if regel:
			wahl = zustaendige_bestimmen(regel, _abwesenheiten(regel.get("benutzer"), regel.get("vertretung")), jetzt_wien.date())
			zustaendig, vertretung = wahl["zustaendig"], wahl["vertretung"]
			if not zustaendig:
				pool = _rollen_nutzer(wahl["rolle"])
	if zustaendig:
		werte["zustaendig"] = zustaendig

	_felder_setzen(doc, werte)
	if routing_aktiv and (zustaendig or pool):
		_zuweisen(doc, [zustaendig] if zustaendig else pool, klasse, sla_bis)

	# 6) Dublette: Kommentar am Erst-Lead, keine zweite Team-Mail, nur Glocke an den Zuständigen
	betreff, html = _team_mail(doc, klasse, treffer)
	if erst:
		_kommentar_erst_lead(erst, doc)
		if zustaendig:
			_glocke(zustaendig, f"Erneute Anfrage: {betreff}", doc)
		return

	# 7) Team-Mail – „wie bisher“ heißt: Rolle Vertrieb (Website Termin: Terminberatung) plus Sammelpostfach
	reply_to = daten.get("email") or None
	rolle_bisher = STANDARD_ROLLE.get(doc.doctype, "Vertrieb")
	if spur:
		team_benachrichtigen(betreff, html, doc.doctype, doc.name, reply_to=reply_to, rolle=spur)
		return
	if routing_aktiv:
		postfach = sammelpostfach(frappe.conf.get("oekovolt_benachrichtigung_an"))
		empfaenger = empfaenger_zusammenstellen(zustaendig, vertretung, [*pool, *postfach])
		if empfaenger:
			team_benachrichtigen(betreff, html, doc.doctype, doc.name, reply_to=reply_to, empfaenger=empfaenger)
		else:  # keine passende Regel und kein Postfach: wie bisher an die Rolle
			team_benachrichtigen(betreff, html, doc.doctype, doc.name, reply_to=reply_to, rolle=rolle_bisher)
	else:
		team_benachrichtigen(betreff, html, doc.doctype, doc.name, reply_to=reply_to, rolle=rolle_bisher)

	# 8) Sofortalarm nur für A-Leads der Vertriebsspur
	if klasse == "A":
		_alarm(doc, {
			"doctype": doc.doctype, "name": doc.name, "lead_klasse": klasse, "segment": segment,
			"bundesland": bundesland, "plz": daten.get("plz"), "sla_bis": sla_bis,
		})
