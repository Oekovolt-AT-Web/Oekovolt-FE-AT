app_name = "oekovoltdeutchland"
app_title = "Oekovoltdeutchland"
app_publisher = "Ökovolt Solartechnik GmbH"
app_description = "Backoffice-Erweiterungen für oekovolt.com (Österreich)"
app_email = "office@oekovolt.at"
app_license = "unlicense"
required_apps = ["frappe"]

# Hinweis zum Namen: Die Website ruft fest verdrahtete Pfade
#   oekovoltdeutchland.oekovoltdeutchland.doctype.<doctype>.api.<methode>
# auf. App- und Modulname bleiben deshalb „oekovoltdeutchland“ / „Oekovoltdeutchland“,
# obwohl dies die österreichische Instanz ist (siehe README.md).

# ---------------------------------------------------------------- Installation
# Rollen anlegen (idempotent) und Zeitzone prüfen – bei install-app und jedem migrate.
after_install = "oekovoltdeutchland.installation.nach_installation"
after_migrate = "oekovoltdeutchland.installation.nach_migration"

# ---------------------------------------------------------------- Dokument-Ereignisse
# Zusammengeführt aus Import-Frappe/2_hooks_ergaenzen.py
doc_events = {
	# Website sofort benachrichtigen, wenn eine Veröffentlichung gespeichert wird
	"Veroeffentlichung": {
		"on_update": "oekovoltdeutchland.oekovoltdeutchland.doctype.veroeffentlichung.api.nach_speichern",
	},
}

# ---------------------------------------------------------------- Geplante Aufgaben
scheduler_events = {
	# Löschfristen / Aufräumen (einmal täglich)
	"daily": [
		# aus Import-Frappe/2_hooks_ergaenzen.py
		"oekovoltdeutchland.oekovoltdeutchland.doctype.hinweis.api.loesche_abgelaufene_hinweise",
		"oekovoltdeutchland.oekovoltdeutchland.doctype.rueckruf.api.loesche_erledigte_rueckrufe",
		"oekovoltdeutchland.oekovoltdeutchland.doctype.beratungstermin.api.loesche_alte_termine",
		"oekovoltdeutchland.oekovoltdeutchland.doctype.pv_analyse.api.loesche_alte_analysen",
		"oekovoltdeutchland.oekovoltdeutchland.doctype.solar_lead.api.aufraeumen",
		# neu (AT): Heatmap-Monate älter als 14 Monate löschen
		"oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.api.alte_monate_loeschen",
	],
	"cron": {
		# Geplante Veröffentlichungen + geplante Push-Nachrichten (alle 5 Minuten)
		"*/5 * * * *": [
			"oekovoltdeutchland.oekovoltdeutchland.doctype.veroeffentlichung.veroeffentlichung.geplante_veroeffentlichen",
			"oekovoltdeutchland.oekovoltdeutchland.doctype.veroeffentlichung.api.website_anstossen",
		],
		# Erinnerungs-E-Mail mit Fortsetzen-Link für abgebrochene Foto-Uploads (alle 15 Minuten)
		"*/15 * * * *": [
			"oekovoltdeutchland.oekovoltdeutchland.doctype.solar_lead.api.erinnerungen_senden",
		],
	},
}
