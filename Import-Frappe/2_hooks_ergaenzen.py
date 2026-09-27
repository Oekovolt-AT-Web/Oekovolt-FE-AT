# ─────────────────────────────────────────────────────────────────────────────
# In die bestehende Datei  apps/oekovoltdeutchland/oekovoltdeutchland/hooks.py
# EINFÜGEN – nicht die ganze Datei ersetzen!
#
# Gibt es in hooks.py schon ein  doc_events = {...}  oder  scheduler_events = {...},
# dann die Einträge unten in die vorhandenen Dictionaries/Listen übernehmen,
# statt ein zweites Dictionary anzulegen (das zweite würde das erste überschreiben).
# ─────────────────────────────────────────────────────────────────────────────

doc_events = {
	# Website sofort benachrichtigen, wenn eine Veröffentlichung gespeichert wird
	"Veroeffentlichung": {
		"on_update": "oekovoltdeutchland.oekovoltdeutchland.doctype.veroeffentlichung.api.nach_speichern",
	},
}

scheduler_events = {
	# Löschfristen / Aufräumen (einmal täglich)
	"daily": [
		"oekovoltdeutchland.oekovoltdeutchland.doctype.hinweis.api.loesche_abgelaufene_hinweise",
		"oekovoltdeutchland.oekovoltdeutchland.doctype.rueckruf.api.loesche_erledigte_rueckrufe",
		"oekovoltdeutchland.oekovoltdeutchland.doctype.beratungstermin.api.loesche_alte_termine",
		"oekovoltdeutchland.oekovoltdeutchland.doctype.pv_analyse.api.loesche_alte_analysen",
		"oekovoltdeutchland.oekovoltdeutchland.doctype.solar_lead.api.aufraeumen",
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
