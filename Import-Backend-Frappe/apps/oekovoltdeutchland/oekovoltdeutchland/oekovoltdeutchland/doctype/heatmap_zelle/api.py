# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# Heatmap der Website – Vertrag mit der Website (verbindlich):
#
#   POST oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.api.erfassen
#        { "pfad": "/gewerbe", "geraet": "mobil|tablet|desktop",
#          "klicks": [ { "sel": "css-selektor", "rx": 0.35, "ry": 0.5 } ], "scroll": 70 }
#        → { "ok": true }
#
#   POST oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.api.auswertung
#        { "pfad", "geraet", "tage": 30 }
#        → { "pfad", "geraet", "aufrufe": n, "klicks": [ { "sel", "rx", "ry", "anzahl" } ],
#            "scroll": [ { "tiefe": 10..100, "anzahl" } ] }   (anzahl = Aufrufe mit mind. dieser Tiefe)
#
# Aufrufer: API-User der Website (Rolle „Website API“) bzw. System Manager.
# Gespeichert wird nur AGGREGIERT je Monat (keine Rohdaten, keine IP, keine Personen):
#   Heatmap Seite  (pfad, geraet, monat)                     → aufrufe
#   Heatmap Zelle  (pfad, geraet, selektor, rx, ry, monat)   → anzahl
#   Heatmap Scroll (pfad, geraet, tiefe, monat)              → anzahl (je MAXIMAL erreichter Tiefe)
# Hochzählen: deterministischer name (SHA-256 der Schlüsselfelder) + INSERT … ON DUPLICATE KEY UPDATE
# → atomar und nebenläufigkeitssicher, ein Statement je Tabelle.
# Plausibilitätsschutz: pfad nur [a-z0-9/._-] (nach Kleinschreibung), je Gerät und Monat höchstens
# 2.000 verschiedene Pfade – weitere NEUE Pfade werden still verworfen (Antwort trotzdem ok).
# Bekannt: nach einem Tab-Wechsel kann die Website einen zweiten Beacon für denselben Aufruf senden;
# „aufrufe“ kann dadurch leicht erhöht sein (akzeptiert).

import frappe
from frappe import _
from frappe.utils import cint, escape_html, getdate, now_datetime, nowdate

from oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle import heatmap_logik as L
from oekovoltdeutchland.oekovoltdeutchland.rollen import ROLLE_MARKETING, nur_rollen, nur_website_api

KLICK_LIMIT = 1000
TABELLEN = ("Heatmap Zelle", "Heatmap Scroll", "Heatmap Seite")


# ---------------------------------------------------------------- Hochzählen

def _hochzaehlen(doctype, felder, zeilen, zaehlfeld, jetzt):
	"""zeilen = [(name, (schlüsselwerte …), anzahl)] – legt an oder addiert atomar."""
	if not zeilen:
		return
	spalten = ["name", "creation", "modified", "owner", "modified_by", *felder, zaehlfeld]
	platzhalter = "(" + ", ".join(["%s"] * len(spalten)) + ")"
	werte = []
	# feste Reihenfolge (nach name) → gleiche Sperr-Reihenfolge bei parallelen Aufrufen
	for name, schluessel, anzahl in sorted(zeilen):
		werte.extend([name, jetzt, jetzt, "Administrator", "Administrator", *schluessel, int(anzahl)])
	tabelle = f"`tab{doctype}`"
	spaltenliste = ", ".join(f"`{s}`" for s in spalten)
	werteliste = ", ".join([platzhalter] * len(zeilen))
	if frappe.db.db_type == "postgres":
		sql = (
			f"insert into {tabelle} ({spaltenliste}) values {werteliste} "
			f"on conflict (`name`) do update set `{zaehlfeld}` = {tabelle}.`{zaehlfeld}` + excluded.`{zaehlfeld}`, "
			"`modified` = excluded.`modified`"
		)
	else:
		sql = (
			f"insert into {tabelle} ({spaltenliste}) values {werteliste} "
			f"on duplicate key update `{zaehlfeld}` = `{zaehlfeld}` + values(`{zaehlfeld}`), `modified` = values(`modified`)"
		)
	frappe.db.sql(sql, tuple(werte))


def _pfad_zulassen(pfad, geraet, monat):
	"""Bekannter Pfad → ja. Neuer Pfad → nur, solange das Monatslimit je Gerät nicht erreicht ist."""
	if frappe.db.exists("Heatmap Seite", L.name_seite(pfad, geraet, monat)):
		return True
	return L.neuer_pfad_erlaubt(frappe.db.count("Heatmap Seite", {"geraet": geraet, "monat": monat}))


def _speichern(e):
	"""Zählt einen Seitenaufruf. False = verworfen (Pfad-Limit des Monats erreicht)."""
	jetzt = now_datetime()  # System-Zeitzone (Europe/Vienna) bestimmt den Monat
	monat = L.monat_von(jetzt)
	pfad, geraet = e["pfad"], e["geraet"]
	if not _pfad_zulassen(pfad, geraet, monat):
		return False
	_hochzaehlen(
		"Heatmap Seite", ["pfad", "geraet", "monat"],
		[(L.name_seite(pfad, geraet, monat), (pfad, geraet, monat), 1)], "aufrufe", jetzt,
	)
	_hochzaehlen(
		"Heatmap Zelle", ["pfad", "geraet", "selektor", "rx", "ry", "monat"],
		[(L.name_zelle(pfad, geraet, sel, rx, ry, monat), (pfad, geraet, sel, rx, ry, monat), n) for sel, rx, ry, n in e["klicks"]],
		"anzahl", jetzt,
	)
	if e["scroll"]:  # 0 bzw. None: nur der Aufruf zählt
		_hochzaehlen(
			"Heatmap Scroll", ["pfad", "geraet", "tiefe", "monat"],
			[(L.name_scroll(pfad, geraet, e["scroll"], monat), (pfad, geraet, e["scroll"], monat), 1)], "anzahl", jetzt,
		)
	return True


@frappe.whitelist(methods=["POST"])
def erfassen(**kwargs):
	nur_website_api()
	try:
		e = L.erfassung_vorbereiten(frappe.form_dict)
	except ValueError as fehler:
		frappe.throw(_("Ungültige Heatmap-Daten ({0})").format(str(fehler)))

	for versuch in range(3):
		try:
			_speichern(e)
			frappe.db.commit()
			break
		except Exception as fehler:
			frappe.db.rollback()
			if versuch == 2 or not frappe.db.is_deadlocked(fehler):
				raise
	return {"ok": True}


# ---------------------------------------------------------------- Auswertung

def _bedingung(pfad, geraet, von, bis):
	werte = {"pfad": pfad, "von": von, "bis": bis}
	sql = "`pfad` = %(pfad)s and `monat` between %(von)s and %(bis)s"
	if geraet:
		sql += " and `geraet` = %(geraet)s"
		werte["geraet"] = geraet
	return sql, werte


def aufrufe_laden(pfad, geraet, von, bis):
	bed, werte = _bedingung(pfad, geraet, von, bis)
	return cint(frappe.db.sql(f"select coalesce(sum(`aufrufe`), 0) from `tabHeatmap Seite` where {bed}", werte)[0][0])


def scroll_laden(pfad, geraet, von, bis):
	bed, werte = _bedingung(pfad, geraet, von, bis)
	zeilen = frappe.db.sql(f"select `tiefe`, sum(`anzahl`) from `tabHeatmap Scroll` where {bed} group by `tiefe`", werte)
	return L.scroll_kumulieren(zeilen)


def klicks_laden(pfad, geraet, von, bis, limit=KLICK_LIMIT):
	bed, werte = _bedingung(pfad, geraet, von, bis)
	zeilen = frappe.db.sql(
		f"""select `selektor`, `rx`, `ry`, sum(`anzahl`) as n from `tabHeatmap Zelle` where {bed}
		group by `selektor`, `rx`, `ry` order by n desc limit {int(limit)}""",
		werte,
	)
	return L.klicks_zusammenfassen(zeilen, limit)


def elemente_laden(pfad, geraet, von, bis, limit=100):
	bed, werte = _bedingung(pfad, geraet, von, bis)
	return frappe.db.sql(
		f"""select `selektor`, sum(`anzahl`) as n from `tabHeatmap Zelle` where {bed}
		group by `selektor` order by n desc limit {int(limit)}""",
		werte,
	)


@frappe.whitelist(methods=["POST"])
def auswertung(**kwargs):
	nur_website_api()
	d = frappe.form_dict
	pfad = L.pfad_pruefen(d.get("pfad"))
	geraet = L.geraet_pruefen(d.get("geraet"))
	if not pfad or not geraet:
		frappe.throw(_("Ungültiger Pfad oder ungültiges Gerät"))
	von, bis = L.monate_fuer_tage(getdate(nowdate()), d.get("tage"))
	return {
		"pfad": pfad,
		"geraet": geraet,
		"aufrufe": aufrufe_laden(pfad, geraet, von, bis),
		"klicks": klicks_laden(pfad, geraet, von, bis),
		"scroll": scroll_laden(pfad, geraet, von, bis),
	}


# ---------------------------------------------------------------- Link zur visuellen Ansicht (Desk)

def link_berechtigt():
	return bool({"System Manager", ROLLE_MARKETING}.intersection(frappe.get_roles()))


def ansicht_url(pfad, geraet):
	"""URL der visuellen Heatmap auf der Website oder None, wenn kein Token konfiguriert ist."""
	token = frappe.conf.get("oekovolt_heatmap_token")
	if not token:
		return None
	basis = frappe.conf.get("website_url") or "https://www.oekovolt.com"
	return L.ansicht_link(basis, pfad, token, geraet)


@frappe.whitelist(methods=["GET", "POST"])
def ansicht_link(pfad=None, geraet=None, **kwargs):
	"""Für den Desk (Bericht „Heatmap Auswertung“): nur System Manager / Marketing."""
	nur_rollen(ROLLE_MARKETING)
	p = L.pfad_pruefen(pfad)
	if not p:
		frappe.throw(_("Bitte einen gültigen Pfad angeben, z. B. /gewerbe"))
	url = ansicht_url(p, geraet)
	if not url:
		frappe.throw(_("In der site_config fehlt „oekovolt_heatmap_token“."))
	return {"url": url}


def ansicht_hinweis_html(pfad, geraet):
	"""HTML-Hinweis für den Bericht – Link nur für System Manager / Marketing."""
	if not link_berechtigt():
		return ""
	url = ansicht_url(pfad, geraet)
	if not url:
		return "<p>Visuelle Ansicht: in der site_config fehlt <code>oekovolt_heatmap_token</code>.</p>"
	return (
		f"<p>Visuelle Ansicht auf der Website: <a href='{escape_html(url)}' target='_blank' rel='noopener noreferrer'>"
		f"{escape_html(pfad)} ({escape_html(L.geraet_pruefen(geraet) or 'desktop')}) öffnen</a>"
		" – der Link enthält den Heatmap-Token, bitte nicht weitergeben.</p>"
	)


# ---------------------------------------------------------------- Löschfrist

def alte_monate_loeschen():
	"""Täglicher Scheduler-Job: Monate älter als 14 Monate aus allen Heatmap-Tabellen entfernen."""
	grenze = L.loesch_grenze(getdate(nowdate()))
	for doctype in TABELLEN:
		frappe.db.sql(f"delete from `tab{doctype}` where `monat` < %s", (grenze,))
	frappe.db.commit()
