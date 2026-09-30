# Import-Backend-Frappe – Backoffice für oekovolt.com (Österreich)

Alles, was auf den **Frappe-Server** (v15, MariaDB) des österreichischen Backoffice gehört, liegt in diesem Ordner.
Die Website (Next.js, Rest dieses Repositorys) läuft getrennt davon und spricht das Backoffice nur über
`/api/method/…` an. Verbindlicher Schnittstellen-Vertrag: `docs/FRAPPE-AT-API-SPEZIFIKATION.md`.

| Ordner | Inhalt | Details |
|---|---|---|
| `apps/oekovolt_app/` | Projekte/Referenzen inkl. Kundenfelder, Referenzkarte, Kontakt, Angebot, Solarrechner-PDF, Terminbuchung und Kalender (AT-Feiertage), Löschfristen | `apps/oekovolt_app/README.md` |
| `apps/oekovoltdeutchland/` | Produktseiten (Stromspeicher, Wärmepumpe), Hersteller, Heatmap + Bericht „Heatmap Auswertung“, dazu der Bestand aus `Import-Frappe/` (Rückruf, Solar Lead, Hinweisgebersystem, Newsroom/Push/Fediverse, Bericht „Anfragen nach Herkunft“) für Österreich angepasst | `apps/oekovoltdeutchland/README.md` |
| `installation/` | `installieren.sh`, `site_config.sh`, `rollen.csv`, `website_env.txt` | Kommentare in den Dateien |

Der App-Name `oekovoltdeutchland` bleibt trotz AT-Instanz so, weil die Website die Methodenpfade
`oekovoltdeutchland.oekovoltdeutchland.doctype.*` aufruft. Der ältere Ordner `Import-Frappe/` (DE-Paket) wird
für Österreich nicht mehr gebraucht; alles Nötige ist hier enthalten.

## Installation (Kurzfassung)

1. **Backup** der Site: `bench --site <site> backup --with-files`
2. Diesen Ordner auf den Server kopieren (z. B. `scp -r Import-Backend-Frappe frappe@<server>:~/`).
3. Apps installieren bzw. aktualisieren (idempotent, legt Rollen an, führt `migrate` aus):
   ```bash
   cd ~/Import-Backend-Frappe
   SITE=backoffice.oekovolt.com BENCH=/home/frappe/frappe-bench bash installation/installieren.sh
   ```
4. Site-Konfiguration: Platzhalter in `installation/site_config.sh` ersetzen, dann ausführen
   (setzt u. a. `website_url`, `host_name`, Zeitzone Europe/Vienna, `oekovolt_heatmap_token`).
5. **API-User** im Desk anlegen (je nur eine Rolle, „API Access → Generate Keys“) und die Schlüssel in die
   Hosting-Umgebung der Website eintragen – vollständige, kommentierte Liste: `installation/website_env.txt`.
   | User | Rolle | Website-Variablen |
   |---|---|---|
   | `website-api@…` | Website API | `API_KEY` / `API_SECRET` |
   | `kontakt-web@…` | Kontakt Webformular | `KONTAKT_API_KEY` / `KONTAKT_API_SECRET` |
   | `kanal-web@…` | Kanal Webservice | `KANAL_API_KEY` / `KANAL_API_SECRET` |
   | `hinweis-web@…` | Hinweis Webformular | `HINWEIS_API_KEY` / `HINWEIS_API_SECRET` (nur bei eigenem Hinweisgebersystem) |
6. Im Desk: **ausgehendes E-Mail-Konto** (Default Outgoing) einrichten, Scheduler aktivieren
   (`bench --site <site> enable-scheduler`), Mitarbeitenden die Rollen Vertrieb, Terminberatung, Marketing,
   Rückruf Team usw. geben, „Termin Einstellungen“ und „Referenzkarte Einstellungen“ prüfen.
7. Website neu bauen und deployen (Variablen wie `HEATMAP_TOKEN` und `UMAMI_*` gelten ab dem Build).

## Abnahme nach der Installation

```bash
H='Authorization: token KEY:SECRET'; S=https://backoffice.oekovolt.com/api/method
curl -H "$H" "$S/oekovolt_app.website_api.projekte.get_projekte"                     # message.projekte[]
curl -H "$H" "$S/oekovolt_app.website_api.termin.get_kalender?terminart=Video-Beratung&von=2026-10-01&bis=2026-10-07"
curl -X POST -H 'Content-Type: application/json' "$S/oekovolt_app.website_api.termin.buche_termin" -d '{…}'   # ohne Token!
curl -H "$H" "$S/oekovoltdeutchland.oekovoltdeutchland.doctype.waermepumpe_page.api.get_waermepumpe_page_with_keywords"
curl -I https://backoffice.oekovolt.com/files/<bild>.jpg                                 # 200 ohne Login
```
Danach auf der Website durchklicken: Startseite (Referenzen), Projektseite mit Kundenporträt, Referenzkarte,
Kontakt, Angebot, Termin, Rückruf-Widget, Solarrechner-PDF, Foto-Upload per QR, Presse, Wärmepumpen-Hersteller,
Heatmap-Ansicht (`<seite>?heatmap=<HEATMAP_TOKEN>`).

## Tests ohne Frappe (lokal)

```bash
python apps/oekovolt_app/tests/pruefe_vertrag.py            # Vertrag Website ↔ Backend
python apps/oekovolt_app/tests/test_termin_logik.py         # Kalender, Feiertage, .ics
python -m unittest discover -s apps/oekovoltdeutchland/oekovoltdeutchland/oekovoltdeutchland/doctype/heatmap_zelle -p "test_*.py"
```
Auf dem Server zusätzlich: `bench --site <site> run-tests --app oekovolt_app` bzw. `--app oekovoltdeutchland`.

## Vor dem Produktivbetrieb rechtlich/fachlich bestätigen

- Löschfristen: Anfragen 24 Monate (Anonymisierung), Termine 24 Monate, Heatmap 14 Monate,
  Hinweisgebersystem **5 Jahre nach Abschluss** (HSchG – geändert gegenüber dem DE-Paket).
- `host_name` = tatsächliche Adresse des AT-Backoffice; die Website erlaubt Bilder nur von
  `backoffice.oekovolt.com` (`next.config.mjs` → `images.remotePatterns`).
- Auftragsverarbeitung/Hosting im EWR (die Datenschutzerklärung der Website sagt das für die Heatmap zu).
