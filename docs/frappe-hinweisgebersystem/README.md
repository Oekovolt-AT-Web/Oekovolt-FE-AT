# Hinweisgebersystem (HinSchG) – Frappe-Backend

Das Hinweisgebersystem ersetzt den gekündigten externen Anbieter IntegrityLine.
Die Oberfläche liegt auf der Website (`/hinweisgebersystem` und `/hinweisgebersystem/postfach`).
Die Daten werden im Frappe-Backoffice gespeichert. Dieses Verzeichnis enthält alles, was im Backend installiert werden muss.

```
Browser ──HTTPS──▶ Next.js /api/hinweis* ──Token──▶ Frappe  oekovoltdeutchland…doctype.hinweis.api.*
                   (keine IP-Weitergabe,             (DocType „Hinweis“, nur Rolle
                    kein Logging von Inhalten)        „Hinweis Meldestelle“ darf lesen)
```

## Inhalt

| Datei | Ziel im App-Code |
|---|---|
| `hinweis/hinweis.json` | `oekovoltdeutchland/oekovoltdeutchland/doctype/hinweis/hinweis.json` |
| `hinweis/hinweis.py` | `…/doctype/hinweis/hinweis.py` |
| `hinweis/api.py` | `…/doctype/hinweis/api.py` |
| `hinweis_nachricht/hinweis_nachricht.json` | `…/doctype/hinweis_nachricht/hinweis_nachricht.json` |
| `hinweis_nachricht/hinweis_nachricht.py` | `…/doctype/hinweis_nachricht/hinweis_nachricht.py` |

In beiden DocType-Ordnern zusätzlich eine leere `__init__.py` anlegen.

## 1. Installation

1. Dateien wie oben kopieren. `"module"` in beiden JSON-Dateien muss zum Modulnamen in `modules.txt` passen (hier angenommen: `Oekovoltdeutchland`).
2. Rollen anlegen: **Role** → `Hinweis Meldestelle` (Desk-Zugriff) und `Hinweis Webformular` (ohne Desk-Zugriff).
3. Den Scheduler-Job für die gesetzliche Löschfrist in `hooks.py` eintragen:
   ```python
   scheduler_events = {
       "daily": [
           "oekovoltdeutchland.oekovoltdeutchland.doctype.hinweis.api.loesche_abgelaufene_hinweise",
       ],
   }
   ```
4. `bench --site <site> migrate`, danach `bench restart`.

## 2. Zugänge

**API-User für die Website:** Legen Sie z. B. `hinweis-web@oekovolt.de` an. Er bekommt **nur** die Rolle `Hinweis Webformular`, dann einen API-Key und ein Secret erzeugen.
Diese Rolle hat keine Leserechte auf „Hinweis“. Meldungen sind deshalb auch dann nicht auslesbar, wenn der Schlüssel der Website kompromittiert wird.

**Meldestelle:** Nur die benannten, zur Vertraulichkeit verpflichteten Personen bekommen die Rolle `Hinweis Meldestelle`.
- Es darf keine weiteren Rollen-Rechte auf den DocType geben.
- `Administrator` und `System Manager` sehen technisch alles. Die Zahl dieser Konten sollte daher minimal bleiben.

## 3. Website konfigurieren

In der Umgebung des Next.js-Servers (`.env.local` bzw. Hosting) eintragen:

```
HINWEIS_API_KEY=<key des API-Users hinweis-web>
HINWEIS_API_SECRET=<secret>
```

Fehlen die Variablen, nutzt die Website die allgemeinen Zugangsdaten (`API_KEY`). Das funktioniert, ist für den Produktivbetrieb aber **nicht** zulässig.

## 4. Arbeitsweise der Meldestelle

1. Die Meldestelle bekommt eine E-Mail **ohne Inhalt** („Neue Meldung eingegangen“) und öffnet danach im Desk **Hinweis**. Die Liste zeigt die Fristen.
2. **Eingangsbestätigung (7 Tage):** In der Tabelle *Nachrichten* eine Zeile mit Absender `Meldestelle` und dem Text ergänzen. Dann den Status auf `Eingang bestätigt` setzen. Die 3-Monats-Frist für die Rückmeldung wird automatisch berechnet.
3. **Rückfragen / Rückmeldung:** ebenfalls als Nachricht. Die meldende Person sieht sie in ihrem Postfach.
   - Interne Notizen mit Haken **Intern** sind für sie unsichtbar.
   - „Neue Nachricht der meldenden Person“ zeigt Antworten aus dem Postfach an.
4. **Abschluss:** Status `Abgeschlossen`. Die Löschung ist dann automatisch nach 3 Jahren fällig.
   - Mit *Aufbewahrung verlängert* und einem Grund lässt sie sich aussetzen.
   - Beim Löschen wird auch die Versionshistorie entfernt.

## 4a. Meldungen per Post, Telefon oder Gespräch

Die Meldestelle legt solche Fälle im Desk selbst an: **Hinweis → Neu**, Eingangskanal wählen. Die Fall-Nummer wird automatisch vergeben. Einen Postfach-Zugang gibt es dafür nicht; die Kommunikation läuft über den vereinbarten Weg. Details und Textvorlagen stehen in docs/datenschutz/Meldestelle-Handbuch.md.

## 4b. Monitoring und Schutz

- **Überwachung:** `https://www.oekovolt.de/api/hinweis/health` liefert 200, wenn Website-Konfiguration, Frappe und DocType erreichbar sind, sonst 503. Keine Falldaten. Diesen Endpunkt in einem Uptime-Dienst überwachen.
- **Sperre gegen Durchprobieren:** Nach 10 falschen Schlüsseln wird eine Fall-Nummer 30 Minuten gesperrt (Redis-Cache), und die Meldestelle wird ohne Inhalte benachrichtigt.

## 5. Sicherheit – Checkliste vor Go-live

- [ ] HTTPS durchgängig. `backoffice.oekovolt.de` nur über TLS erreichbar.
- [ ] Datenbank-Backups verschlüsselt, Zugriff auf Backups dokumentiert (Backups enthalten Meldungen).
- [ ] Access-Logs des Website-Hostings für `/api/hinweis*` deaktivieren oder IP-anonymisieren.
- [ ] In Frappe `Error Log`/`Request Log` prüfen: Durch die API landen keine Inhalte darin. Trotzdem Zugriff auf Log-DocTypes einschränken.
- [ ] Rollen und Rechte wie oben – ein Test mit dem Web-User ergibt `403` beim direkten Lesen von `/api/resource/Hinweis`.
- [ ] Datenschutzerklärung und Verzeichnis der Verarbeitungstätigkeiten ergänzt. Den Hinweistext auf der Seite prüft der DSB.
- [ ] Meldestelle nach § 15 HinSchG benannt, Vertretung geregelt.
- [ ] Uptime-Check auf `/api/hinweis/health` eingerichtet.
- [ ] 2FA für alle Konten mit Rolle `Hinweis Meldestelle` und `System Manager` aktiv.

## 6. Test

```bash
# Meldung anlegen (mit dem Web-User)
curl -X POST "https://backoffice.oekovolt.de/api/method/oekovoltdeutchland.oekovoltdeutchland.doctype.hinweis.api.create_hinweis" \
  -H "Authorization: token KEY:SECRET" -H "Content-Type: application/json" \
  -d '{"kategorie":"Sonstiges","betreff":"Testmeldung","beschreibung":"Dies ist eine technische Testmeldung mit ausreichend Text.","anonym":1}'
# -> {"message":{"referenz":"HW-XXXX-XXXX","zugangsschluessel":"XXXXXX-XXXXXX-XXXXXX-XXXXXX"}}

# Postfach abrufen
curl -X POST ".../hinweis.api.get_postfach" -H "Authorization: token KEY:SECRET" -H "Content-Type: application/json" \
  -d '{"referenz":"HW-XXXX-XXXX","schluessel":"XXXXXX-XXXXXX-XXXXXX-XXXXXX"}'

# Darf NICHT funktionieren (403):
curl ".../api/resource/Hinweis" -H "Authorization: token KEY:SECRET"
```

Danach im Browser `/hinweisgebersystem` durchspielen: Meldung abgeben → Postfach öffnen → im Desk antworten → Antwort erscheint im Postfach.

## 7. Umstellung vom bisherigen Anbieter (IntegrityLine gekündigt)

1. Backend installieren und die Tests aus Abschnitt 6 bestehen – **vor** dem Ende des IntegrityLine-Vertrags. Die Website verlinkt IntegrityLine nicht mehr.
2. Offene Fälle aus IntegrityLine bis Vertragsende abschließen oder als Fall im Backoffice übernehmen. Die Fristen laufen weiter. Datenexport und Löschbestätigung des Anbieters archivieren.
3. Anonym Meldenden bei IntegrityLine vor Vertragsende über deren Postfach mitteilen, wie der Kontakt weitergeführt wird.
4. Datenschutz: Das Verzeichnis von Verarbeitungstätigkeiten und die DSFA liegen unter `docs/datenschutz/`. Ihre offenen Punkte `[OFFEN: …]` sind Voraussetzung für den Produktivbetrieb.
5. Den telefonischen Meldeweg (§ 16 Abs. 3 HinSchG) einrichten und die Nummer in `src/data/hinweisgeber.js` → `MELDESTELLE.telefon` eintragen. Die Seite zeigt ihn dann automatisch an.