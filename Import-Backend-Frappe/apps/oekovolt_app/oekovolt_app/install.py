# Copyright (c) 2026, ÖKOVOLT
#
# Einrichtung beim Installieren/Migrieren der App.
# Die Rollen stehen zusätzlich als Fixture in fixtures/role.json; hier werden sie VOR dem
# Synchronisieren der DocTypes angelegt, damit die Berechtigungen der DocTypes sie schon vorfinden.

import frappe

# (Rolle, Desk-Zugriff)
ROLLEN = (
	("Website API", 0),  # nur API-User der Website (API_KEY/API_SECRET) – kein Desk
	("Vertrieb", 1),  # bearbeitet Anfragen, bekommt E-Mail + Glocke
	("Terminberatung", 1),  # Berater, deren Kalender Termine blockiert (Termin-Teil)
)


def rollen_anlegen():
	for rolle, desk in ROLLEN:
		if not frappe.db.exists("Role", rolle):
			frappe.get_doc({"doctype": "Role", "role_name": rolle, "desk_access": desk}).insert(ignore_permissions=True)


def referenzkarte_vorbelegen():
	"""Firmensitz Ostermiething als Standard, falls noch nichts gepflegt ist."""
	from oekovolt_app.website_api.format import FIRMENSITZ_STANDARD, UMKREIS_STANDARD

	doc = frappe.get_single("Referenzkarte Einstellungen")
	if doc.latitude and doc.longitude:
		return
	doc.firmensitz_name = doc.firmensitz_name or FIRMENSITZ_STANDARD["name"]
	doc.beschreibung = doc.beschreibung or FIRMENSITZ_STANDARD["beschreibung"]
	doc.latitude = FIRMENSITZ_STANDARD["latitude"]
	doc.longitude = FIRMENSITZ_STANDARD["longitude"]
	doc.umkreis_km = doc.umkreis_km or UMKREIS_STANDARD
	doc.save(ignore_permissions=True)


def before_install():
	rollen_anlegen()


def after_install():
	rollen_anlegen()
	referenzkarte_vorbelegen()
	frappe.db.commit()


def before_migrate():
	rollen_anlegen()
	frappe.db.commit()
