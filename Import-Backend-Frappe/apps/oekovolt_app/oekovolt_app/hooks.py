app_name = "oekovolt_app"
app_title = "Oekovolt App"
app_publisher = "ÖKOVOLT"
app_description = "Backoffice-Schnittstelle für www.oekovolt.com (Österreich): Referenzprojekte, Formulare, Termine"
app_email = "office@oekovolt.at"
app_license = "Proprietary"

required_apps = ["frappe"]

# ------------------------------------------------------------------------------------------------
# Rollen (Fixture fixtures/role.json; vor dem DocType-Sync zusätzlich per install.rollen_anlegen)
#   Website API     – API-User der Website (API_KEY/API_SECRET), kein Desk
#   Vertrieb        – bearbeitet Kontakt-/Angebots-/Solarrechner-Anfragen, bekommt Benachrichtigungen
#   Terminberatung  – Berater für Website-Termine (Termin-Teil)
#   Vertriebsleitung – pflegt „Lead Routing Regel“, bekommt Eskalationen (Welle A06)
#   Service / Personal / Marketing – eigene Spuren für Segment Service / Bewerbung / Presse (lead_eingang.py)
#   Einkauf / Geschäftsführung / Monitoring – Rollen für Backoffice-Berechtigungen (A06)
# Weitere Fixtures (A06): Custom Field User.abwesend_bis (Vertretung), Client Scripts „Angerufen …“ (Erstreaktion).
# Die Filter nennen die Namen vollständig, damit `bench export-fixtures` nichts Fremdes mitnimmt.
# ------------------------------------------------------------------------------------------------
ROLLEN_FIXTURE = [
	"Website API", "Vertrieb", "Terminberatung",
	"Vertriebsleitung", "Service", "Personal", "Einkauf", "Marketing", "Geschäftsführung", "Monitoring",
]
CLIENT_SCRIPTS_FIXTURE = [
	"Angerufen Kontaktanfrage",
	"Angerufen Angebotsanfrage",
	"Angerufen Rechner Lead",
	"Angerufen Solarrechner Anfrage",
	"Angerufen Website Termin",
]
fixtures = [
	{"dt": "Role", "filters": [["name", "in", ROLLEN_FIXTURE]]},
	{"dt": "Custom Field", "filters": [["name", "in", ["User-abwesend_bis"]]]},
	{"dt": "Client Script", "filters": [["name", "in", CLIENT_SCRIPTS_FIXTURE]]},
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
# Speed-to-Lead II (Welle A06, docs/frappe-lead-routing/README.md)
#   after_insert -> lead_eingang.after_insert: Segment, Bundesland, Score/Klasse, Dubletten, Routing
#                   („Lead Routing Regel“, Vertretung über User.abwesend_bis), Zuweisung, SLA, Team-Mail, Alarm
#   on_update    -> sla.erstreaktion_setzen: erster Statuswechsel weg von „Neu“ = Erstreaktion
#   Communication after_insert -> sla.communication_angelegt: erste ausgehende E-Mail = Erstreaktion
#   Schalter site_config: oekovolt_routing_aktiv, oekovolt_alarm_webhook, oekovolt_alarm_sms_an, oekovolt_eskalation_an
# ------------------------------------------------------------------------------------------------
_LEAD_EVENTS = {
	"after_insert": "oekovolt_app.website_api.lead_eingang.after_insert",
	"on_update": "oekovolt_app.website_api.sla.erstreaktion_setzen",
}
doc_events = {
	"Kontaktanfrage": _LEAD_EVENTS,
	"Angebotsanfrage": _LEAD_EVENTS,
	"Rechner Lead": _LEAD_EVENTS,
	"Solarrechner Anfrage": _LEAD_EVENTS,
	"Website Termin": _LEAD_EVENTS,
	"Communication": {"after_insert": "oekovolt_app.website_api.sla.communication_angelegt"},
}

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
		# Unbestätigte Rechner-Leads nach 30 Tagen löschen (A11)
		"oekovolt_app.website_api.rechner.unbestaetigte_loeschen",
	],
	"cron": {
		# SLA-Eskalation für A-Leads ohne Erstreaktion (A06): 15 Geschäftsminuten -> Vertretung + Vertriebsleitung,
		# 60 -> Geschäftsführung (site_config „oekovolt_eskalation_an“)
		"*/5 * * * *": ["oekovolt_app.website_api.sla.pruefen"],
	},
}
