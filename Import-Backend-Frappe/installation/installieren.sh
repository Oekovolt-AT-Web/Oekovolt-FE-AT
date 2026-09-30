#!/usr/bin/env bash
# Installiert bzw. aktualisiert die Frappe-Apps des österreichischen Backoffice (oekovolt.com):
#   oekovolt_app        (Projekte, Kontakt, Angebot, Termin, Solarrechner)
#   oekovoltdeutchland  (Produktseiten, Hersteller, Heatmap, Solar Lead, Kanäle, Hinweisgebersystem)
#
# Aufruf auf dem Server (Ordner Import-Backend-Frappe vorher dorthin kopieren, z. B. per scp/WinSCP):
#
#   SITE=backoffice.oekovolt.com BENCH=/home/frappe/frappe-bench bash installation/installieren.sh
#
# Parameter (Umgebungsvariablen):
#   SITE    Pflicht – Site-Name in sites/
#   BENCH   Pfad zum frappe-bench-Ordner          (Standard: /home/frappe/frappe-bench)
#   APPS    zu installierende Apps                (Standard: "oekovolt_app oekovoltdeutchland")
#   QUELLE  Ordner mit den App-Quellen            (Standard: ../apps neben diesem Skript)
#   BACKUP  1 = vorher Backup mit Dateien         (Standard: 1)
#   SAUBER  1 = beim Aktualisieren Dateien löschen, die es in der Quelle nicht mehr gibt (Standard: 0)
#
# Idempotent: mehrfach ausführbar. Vorhandene App-Ordner werden aktualisiert (Dateien überschrieben),
# bereits installierte Apps nicht erneut installiert, danach immer migrate.
set -euo pipefail

BENCH="${BENCH:-/home/frappe/frappe-bench}"
SITE="${SITE:?Bitte SITE=<site-name> setzen, z. B. SITE=backoffice.oekovolt.com}"
HIER="$(cd "$(dirname "$0")" && pwd)"
QUELLE="${QUELLE:-$HIER/../apps}"
APPS="${APPS:-oekovolt_app oekovoltdeutchland}"
BACKUP="${BACKUP:-1}"
SAUBER="${SAUBER:-0}"

fehler() { echo "FEHLER: $*" >&2; exit 1; }
schritt() { echo; echo "» $*"; }

command -v bench >/dev/null 2>&1 || fehler "bench nicht gefunden (als Benutzer frappe ausführen?)"
[ -d "$BENCH/apps/frappe" ] || fehler "$BENCH ist kein frappe-bench-Ordner – BENCH prüfen."
[ -d "$BENCH/sites/$SITE" ] || fehler "Site $SITE nicht gefunden in $BENCH/sites."
QUELLE="$(cd "$QUELLE" && pwd)" || fehler "Quellordner $QUELLE fehlt."
PYTHON="$BENCH/env/bin/python"
[ -x "$PYTHON" ] || fehler "Python-Umgebung $PYTHON fehlt."

cd "$BENCH"

if [ "$BACKUP" = "1" ]; then
	schritt "Backup der Site $SITE (mit Dateien)"
	bench --site "$SITE" backup --with-files
fi

kopieren() {
	local von="$1" nach="$2"
	mkdir -p "$nach"
	if command -v rsync >/dev/null 2>&1; then
		local loeschen=()
		[ "$SAUBER" = "1" ] && loeschen=(--delete)
		rsync -a ${loeschen[@]+"${loeschen[@]}"} --exclude '.git' --exclude '__pycache__' --exclude '*.pyc' --exclude '*.egg-info' "$von/" "$nach/"
	else
		cp -a "$von/." "$nach/"
		find "$nach" -name '__pycache__' -type d -prune -exec rm -rf {} +
	fi
}

INSTALLIERT="$(bench --site "$SITE" list-apps 2>/dev/null || true)"

for APP in $APPS; do
	SRC="$QUELLE/$APP"
	ZIEL="$BENCH/apps/$APP"
	if [ ! -f "$SRC/pyproject.toml" ] && [ ! -f "$SRC/setup.py" ]; then
		echo "WARNUNG: $SRC ist keine App (pyproject.toml fehlt) – $APP wird übersprungen." >&2
		continue
	fi

	if [ ! -d "$ZIEL" ] && [ -d "$SRC/.git" ]; then
		# App ist ein eigenes Git-Repository → regulär über bench get-app (lokaler Pfad)
		schritt "$APP: bench get-app aus $SRC"
		bench get-app --skip-assets "$SRC"
	else
		schritt "$APP: Dateien nach $ZIEL kopieren"
		kopieren "$SRC" "$ZIEL"
		schritt "$APP: Python-Paket (editierbar) installieren"
		"$PYTHON" -m pip install --quiet --upgrade -e "$ZIEL"
		# In sites/apps.txt eintragen (ohne Duplikat, Zeilenende sicherstellen)
		touch sites/apps.txt
		if ! grep -qxF "$APP" sites/apps.txt; then
			[ -n "$(tail -c1 sites/apps.txt)" ] && echo >> sites/apps.txt
			echo "$APP" >> sites/apps.txt
		fi
	fi
done

schritt "Python-Pakete für die KI-Auswertung (anthropic) und iPhone-Fotos (pillow-heif)"
bench pip install anthropic pillow-heif

for APP in $APPS; do
	[ -d "$BENCH/apps/$APP" ] || continue
	if grep -Eq "^${APP}([[:space:]]|$)" <<< "$INSTALLIERT"; then
		echo "» $APP ist auf $SITE bereits installiert."
	else
		schritt "$APP auf $SITE installieren"
		bench --site "$SITE" install-app "$APP"
	fi
done

schritt "Migrieren (DocTypes, Berichte, Rollen, Indizes)"
bench --site "$SITE" migrate
bench --site "$SITE" clear-cache

schritt "Neustart"
bench restart || echo "Hinweis: 'bench restart' fehlgeschlagen – in Produktion ggf. 'sudo supervisorctl restart all' ausführen." >&2

echo
echo "Fertig. Als Nächstes:"
echo "  1. installation/site_config.sh (Zeitzone, Webhook, Heatmap-Token, website_url)"
echo "  2. API-User anlegen und Keys erzeugen (siehe README), Rollen an Personen vergeben"
echo "  3. installation/website_env.txt in der Hosting-Umgebung der Website eintragen"
