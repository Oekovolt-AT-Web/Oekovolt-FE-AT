#!/usr/bin/env bash
# Kopiert alle DocTypes + den Bericht in die Frappe-App und migriert.
# Auf dem Server (Hetzner) im Ordner Import-Frappe ausführen:
#
#   SITE=backoffice.oekovolt.de BENCH=/home/frappe/frappe-bench bash 3_installieren.sh
#
# Vorhandene Dateien mit gleichem Namen werden überschrieben (= Update).
set -euo pipefail

BENCH="${BENCH:-/home/frappe/frappe-bench}"
SITE="${SITE:?Bitte SITE=<site-name> setzen, z. B. SITE=backoffice.oekovolt.de}"
ZIEL="$BENCH/apps/oekovoltdeutchland/oekovoltdeutchland/oekovoltdeutchland"
HIER="$(cd "$(dirname "$0")" && pwd)"

if [ ! -d "$ZIEL/doctype" ]; then
	echo "Ordner $ZIEL/doctype nicht gefunden – BENCH-Pfad prüfen." >&2
	exit 1
fi

echo "» Kopiere DocTypes und Bericht nach $ZIEL"
cp -r "$HIER/oekovoltdeutchland/oekovoltdeutchland/doctype/." "$ZIEL/doctype/"
mkdir -p "$ZIEL/report"
[ -f "$ZIEL/report/__init__.py" ] || : > "$ZIEL/report/__init__.py"
cp -r "$HIER/oekovoltdeutchland/oekovoltdeutchland/report/." "$ZIEL/report/"

echo "» Python-Pakete (KI-Auswertung, iPhone-Fotos)"
cd "$BENCH"
bench pip install anthropic pillow-heif

echo "» Migrieren"
bench --site "$SITE" migrate
bench restart

echo
echo "Fertig. Jetzt noch:"
echo "site_config (4_site_config.sh) und API-User – siehe ANLEITUNG.md."
