#!/usr/bin/env bash
# Site-Konfiguration des österreichischen Backoffice (oekovolt.com).
# Werte in <…> ersetzen (oder als Umgebungsvariablen übergeben) und im frappe-bench-Ordner ausführen:
#
#   cd /home/frappe/frappe-bench
#   SITE=backoffice.oekovolt.com KANAL_SECRET=… HEATMAP_TOKEN=… bash ~/Import-Backend-Frappe/installation/site_config.sh
#
# Die Werte landen in sites/<site>/site_config.json – NIE ins Git-Repository.
# Mehrfach ausführbar (set-config überschreibt).
set -euo pipefail
SITE="${SITE:?Bitte SITE=<site-name> setzen}"

# ---------------------------------------------------------------- Werte
# Adresse der Website: Fortsetzen-Link (Solar Lead), Link zur visuellen Heatmap
WEBSITE_URL="${WEBSITE_URL:-https://www.oekovolt.com}"

# Kanäle (Newsroom, Push, Fediverse): Frappe stößt die Website an
KANAL_WEBHOOK="${KANAL_WEBHOOK:-https://www.oekovolt.com/api/kanaele/verteilen}"
KANAL_SECRET="${KANAL_SECRET:-<gleicher Wert wie KANAL_WEBHOOK_SECRET der Website>}"

# Heatmap: Token für die visuelle Ansicht (…?heatmap=<TOKEN>) – gleicher Wert wie HEATMAP_TOKEN der Website.
# Erzeugen z. B. mit:  openssl rand -hex 24
HEATMAP_TOKEN="${HEATMAP_TOKEN:-<zufälliger Wert, identisch mit HEATMAP_TOKEN der Website>}"

# KI-Auswertung der Unterlagen (Solar Lead) – optional. Leer lassen = keine KI, Fotos gehen trotzdem an den Vertrieb.
ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}"
ANTHROPIC_MODEL="${ANTHROPIC_MODEL:-claude-sonnet-5}"

# Öffentliche Adresse des Backoffice (für absolute Datei-URLs, z. B. bild_url der Projekte).
# Die Website erlaubt Bilder nur von backoffice.oekovolt.com (next.config.mjs → images.remotePatterns).
HOST_NAME="${HOST_NAME:-https://backoffice.oekovolt.com}"

# System-Zeitzone: Termine, Rückruf-Wunschzeiten, .ics-Dateien, Heatmap-Monate
ZEITZONE="${ZEITZONE:-Europe/Vienna}"

# ---------------------------------------------------------------- Prüfen
for WERT in "$WEBSITE_URL" "$KANAL_WEBHOOK" "$KANAL_SECRET" "$HEATMAP_TOKEN" "$HOST_NAME"; do
	case "$WERT" in
		"<"*) echo "FEHLER: Platzhalter nicht ersetzt: $WERT" >&2; exit 1 ;;
	esac
done

# ---------------------------------------------------------------- Setzen
bench --site "$SITE" set-config website_url "$WEBSITE_URL"
bench --site "$SITE" set-config host_name "$HOST_NAME"
bench --site "$SITE" set-config oekovolt_kanal_webhook "$KANAL_WEBHOOK"
bench --site "$SITE" set-config oekovolt_kanal_secret "$KANAL_SECRET"
bench --site "$SITE" set-config oekovolt_heatmap_token "$HEATMAP_TOKEN"

if [ -n "$ANTHROPIC_API_KEY" ]; then
	bench --site "$SITE" set-config anthropic_api_key "$ANTHROPIC_API_KEY"
	bench --site "$SITE" set-config anthropic_model "$ANTHROPIC_MODEL"
else
	echo "Hinweis: ANTHROPIC_API_KEY leer – KI-Auswertung bleibt aus."
fi

# Zeitzone in den System Settings (bench execute speichert mit Commit)
bench --site "$SITE" execute frappe.client.set_value --args "['System Settings', 'System Settings', 'time_zone', '$ZEITZONE']"

bench --site "$SITE" clear-cache
bench restart || echo "Hinweis: 'bench restart' fehlgeschlagen – in Produktion ggf. 'sudo supervisorctl restart all'." >&2
echo "Fertig: site_config für $SITE gesetzt (Zeitzone $ZEITZONE)."
