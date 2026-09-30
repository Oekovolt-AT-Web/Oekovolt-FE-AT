app_name = "oekovolt_app"
app_title = "Oekovolt App"
app_publisher = "ÖKOVOLT"
app_description = "Backoffice-Schnittstelle für www.oekovolt.com (Österreich): Referenzprojekte, Formulare, Termine"
app_email = "office@oekovolt.com"
app_license = "Proprietary"

required_apps = ["frappe"]

# ------------------------------------------------------------------------------------------------
# Rollen (Fixture fixtures/role.json; vor dem DocType-Sync zusätzlich per install.rollen_anlegen)
#   Website API     – API-User der Website (API_KEY/API_SECRET), kein Desk
#   Vertrieb        – bearbeitet Kontakt-/Angebots-/Solarrechner-Anfragen, bekommt Benachrichtigungen
#   Terminberatung  – Berater für Website-Termine (Termin-Teil)
# ------------------------------------------------------------------------------------------------
fixtures = [
	{"dt": "Role", "filters": [["name", "in", ["Website API", "Vertrieb", "Terminberatung"]]]},
]

before_install = "oekovolt_app.install.before_install"
after_install = [
	"oekovolt_app.install.after_install",
	# Termin (siehe website_api/termin.py): Standard-Zeitfenster, falls noch keine gepflegt sind
	"oekovolt_app.website_api.termin.einstellungen_vorbelegen",
]
before_migrate = "oekovolt_app.install.before_migrate"

# Cache-Invalidierung der Projekt-API läuft über die Controller
# (Projekt.on_update/on_trash/after_rename, Referenzkarte Einstellungen.on_update).

# ------------------------------------------------------------------------------------------------
# Termin (siehe website_api/termin.py)
#   buche_termin (Gast, rate_limit) und get_kalender; Doctypes Website Termin, Termin Einstellungen,
#   Termin Zeitfenster, Termin Sperrtag. Täglicher Job: Termine nach 24 Monaten anonymisieren.
# ------------------------------------------------------------------------------------------------
scheduler_events = {
	"daily": [
		"oekovolt_app.website_api.termin.loesche_alte_termine",
		# Löschfrist Kontakt-/Angebots-/Solarrechner-Anfragen (24 Monate, site_config „oekovolt_loeschfrist_monate“)
		"oekovolt_app.website_api.helfer.anfragen_aufraeumen",
	],
}
