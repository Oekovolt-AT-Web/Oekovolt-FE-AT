#!/usr/bin/env bash
# Werte in <…> ersetzen und im frappe-bench-Ordner ausführen.
# Die Werte stehen danach in sites/<site>/site_config.json – NIE ins Git-Repository.
set -euo pipefail
SITE="${SITE:?Bitte SITE=<site-name> setzen}"

# Kanäle (Newsroom, Push, Fediverse): Frappe → Website
bench --site "$SITE" set-config oekovolt_kanal_webhook "https://www.oekovolt.de/api/kanaele/verteilen"
bench --site "$SITE" set-config oekovolt_kanal_secret  "<gleicher Wert wie KANAL_WEBHOOK_SECRET der Website>"

# KI-Auswertung der Unterlagen (Solar Lead). Ohne Key: Fotos gehen trotzdem an den Vertrieb.
bench --site "$SITE" set-config anthropic_api_key "<sk-ant-…>"
bench --site "$SITE" set-config anthropic_model   "claude-sonnet-5"

# Adresse der Website für den Fortsetzen-Link in der Erinnerungs-E-Mail
bench --site "$SITE" set-config website_url "https://www.oekovolt.de"

bench restart
