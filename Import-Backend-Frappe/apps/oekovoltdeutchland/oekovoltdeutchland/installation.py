# Copyright (c) 2026, Ökovolt Solartechnik GmbH
#
# Installations-Hooks (hooks.py → after_install / after_migrate).
# Legt fehlende Rollen an – vorhandene Rollen werden NICHT verändert (idempotent).

import frappe

ZEITZONE = "Europe/Vienna"

# (Rolle, Desk-Zugriff) – gleiche Liste wie installation/rollen.csv
ROLLEN = [
	("Hinweis Meldestelle", 1),
	("Hinweis Webformular", 0),
	("Kontakt Webformular", 0),
	("Kanal Webservice", 0),
	("Website API", 0),
	("Rückruf Team", 1),
	("Terminberatung", 1),
	("Vertrieb", 1),
	("Technik Innendienst", 1),
	("Marketing", 1),
]


def rollen_anlegen():
	neu = []
	for rolle, desk in ROLLEN:
		if frappe.db.exists("Role", rolle):
			continue
		frappe.get_doc({"doctype": "Role", "role_name": rolle, "desk_access": desk}).insert(ignore_permissions=True)
		neu.append(rolle)
	if neu:
		frappe.db.commit()
		print(f"oekovoltdeutchland: Rollen angelegt: {', '.join(neu)}")


def zeitzone_pruefen():
	tz = frappe.db.get_single_value("System Settings", "time_zone")
	if tz != ZEITZONE:
		print(
			f"oekovoltdeutchland: Hinweis – System-Zeitzone ist „{tz or 'nicht gesetzt'}“, erwartet {ZEITZONE}. "
			"Termine, Rückruf-Wunschzeiten und .ics-Dateien rechnen in der System-Zeitzone "
			"(setzen: installation/site_config.sh oder Desk → System Settings)."
		)


def heatmap_indizes():
	"""Zusammengesetzte Indizes für die Auswertung (pfad, geraet, monat). add_index ist idempotent."""
	for doctype in ("Heatmap Zelle", "Heatmap Scroll", "Heatmap Seite"):
		try:
			frappe.db.add_index(doctype, ["pfad", "geraet", "monat"], index_name="pfad_geraet_monat")
		except Exception:
			frappe.log_error(title=f"oekovoltdeutchland: Index für {doctype} nicht angelegt")


def nach_installation():
	rollen_anlegen()
	heatmap_indizes()
	zeitzone_pruefen()


def nach_migration():
	rollen_anlegen()
	heatmap_indizes()
