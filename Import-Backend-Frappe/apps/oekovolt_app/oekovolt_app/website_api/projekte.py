# Copyright (c) 2026, ÖKOVOLT
#
# Referenzprojekte für www.oekovolt.com (Spezifikation Abschnitt 2, #1–#3).
#   GET /api/method/oekovolt_app.website_api.projekte.get_projekte
#   GET /api/method/oekovolt_app.website_api.projekte.get_projekt?projekt_website_name=haydu-2
#   GET /api/method/oekovolt_app.website_api.projekte.get_referenzkarte
#
# Aufrufer: API-User mit Rolle „Website API“ (Header Authorization: token KEY:SECRET).
# Es werden nur veröffentlichte Projekte und nur öffentliche Bilder ausgeliefert.
# Antworten liegen 10 Minuten im Cache; Projekt bzw. Referenzkarte Einstellungen leeren ihn beim Speichern/Löschen.

import re

import frappe
from frappe.utils import get_url

from oekovolt_app.website_api import format as fmt
from oekovolt_app.website_api.helfer import nur_website_api

CACHE_PRAEFIX = "oekovolt_app:projekte:"
CACHE_SEKUNDEN = 600
_WEBSITE_NAME = re.compile(r"^[a-z0-9][a-z0-9-]{0,139}$")


def _gecacht(schluessel, erzeugen):
	cache = frappe.cache()
	key = CACHE_PRAEFIX + schluessel
	wert = cache.get_value(key)
	if wert is None:
		wert = erzeugen()
		cache.set_value(key, wert, expires_in_sec=CACHE_SEKUNDEN)
	return wert


def cache_leeren(*args, **kwargs):
	"""Aufgerufen von Projekt (on_update/on_trash/after_rename) und Referenzkarte Einstellungen (on_update)."""
	frappe.cache().delete_keys(CACHE_PRAEFIX)


def _veroeffentlichte(felder):
	return frappe.get_all(
		"Projekt",
		filters={"veroeffentlicht": 1},
		fields=list(felder),
		order_by="jahr desc, leistung desc, projekt_name asc",
	)


# ---------------------------------------------------------------- API

@frappe.whitelist(methods=["GET"])
def get_projekte():
	"""#1: {projekte: [...], anzahl, summe_kwp} – alle veröffentlichten Projekte."""
	nur_website_api()
	return _gecacht("liste", lambda: fmt.projekte_antwort(_veroeffentlichte(fmt.DB_FELDER_LISTE), get_url))


@frappe.whitelist(methods=["GET"])
def get_projekt(projekt_website_name=None):
	"""#2: ein veröffentlichtes Projekt inkl. bilder[], Technik und Koordinaten; nicht gefunden -> {}."""
	nur_website_api()
	schluessel = fmt.sauber(projekt_website_name, 140).lower()
	if not _WEBSITE_NAME.match(schluessel):
		return {}

	def laden():
		name = frappe.db.get_value("Projekt", {"projekt_website_name": schluessel, "veroeffentlicht": 1}, "name")
		if not name:
			return {}
		doc = frappe.get_doc("Projekt", name)
		row = {f: doc.get(f) for f in fmt.DB_FELDER_DETAIL}
		bilder = [{"bild": b.bild, "bild_alt": b.bild_alt, "idx": b.idx} for b in doc.get("bilder") or []]
		return fmt.projekt_detail(row, bilder, get_url)

	return _gecacht(f"projekt:{schluessel}", laden)


@frappe.whitelist(methods=["GET"])
def get_referenzkarte():
	"""#3: Firmensitz, Orte mit Projekten (gruppiert nach ort, Entfernung per Haversine), Umkreis."""
	nur_website_api()

	def laden():
		einstellungen = frappe.db.get_singles_dict("Referenzkarte Einstellungen") or {}
		return fmt.referenzkarte_antwort(_veroeffentlichte(fmt.DB_FELDER_KARTE), einstellungen)

	return _gecacht("karte", laden)
