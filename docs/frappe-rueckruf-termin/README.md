# Rückruf & Online-Terminbuchung – Frappe-Backend und CloudTalk

Website-Funktionen:
- **Rückruf-Widget** auf allen Seiten (Desktop unten links, mobil über die Handlungsleiste „Rückruf“)
- **Terminbuchung** unter `/termin`: Telefon, Video, vor Ort – freie Zeiten in Echtzeit
- **Sofort-Rückruf über CloudTalk:** Ist eine Beraterin oder ein Berater frei, klingelt deren CloudTalk-Telefon. Nach dem Abheben wählt CloudTalk automatisch die Kundennummer.

```
Browser ─▶ Next.js /api/rueckruf ─┬─▶ CloudTalk  POST /api/calls/create.json  (Agent zuerst, dann Kunde)
                                  └─▶ Frappe     rueckruf.api.create_rueckruf  (Protokoll, E-Mail + Glocke fürs Team)
Browser ─▶ Next.js /api/termin   ───▶ Frappe     beratungstermin.api.belegte_zeiten / create_termin
                                                 (Termin + Event im Kalender + Bestätigungsmail mit .ics)
```

**Übergangsbetrieb:** Solange die DocTypes nicht installiert sind, funktioniert die Website trotzdem.
- Rückrufwünsche und Terminwünsche landen dann als **Kontaktanfrage** (DocType „Kontakt“) mit dem Präfix `RÜCKRUF-ANFRAGE` bzw. `TERMINWUNSCH`.
- Die Terminseite zeigt die Öffnungszeiten als freie Zeiten, ohne Belegung.
- Der Kunde sieht „Terminwunsch eingegangen – wir bestätigen per E-Mail“ statt „Termin gebucht“.

## Inhalt

| Datei | Ziel im App-Code |
|---|---|
| `rueckruf/rueckruf.json`, `rueckruf.py`, `api.py` | `oekovoltdeutchland/oekovoltdeutchland/doctype/rueckruf/` |
| `beratungstermin/beratungstermin.json`, `beratungstermin.py`, `api.py` | `…/doctype/beratungstermin/` |

In beiden Ordnern eine leere `__init__.py` anlegen. `"module"` in den JSON-Dateien an `modules.txt` anpassen (angenommen: `Oekovoltdeutchland`).

## 1. Installation

1. Dateien kopieren.
2. Rollen anlegen:
   - `Kontakt Webformular` – ohne Desk-Zugriff, nur für den API-User der Website
   - `Rückruf Team` – bekommt Rückrufe per E-Mail und als Glocke im Desk
   - `Terminberatung` – bekommt neue Termine. Deren Kalendereinträge (Event, Status „Open“) blockieren Buchungszeiten, z. B. Urlaub oder externe Termine.
3. Scheduler in `hooks.py` ergänzen:
   ```python
   scheduler_events = {
       "daily": [
           "oekovoltdeutchland.oekovoltdeutchland.doctype.rueckruf.api.loesche_erledigte_rueckrufe",
           "oekovoltdeutchland.oekovoltdeutchland.doctype.beratungstermin.api.loesche_alte_termine",
       ],
   }
   ```
4. `bench --site <site> migrate` und `bench restart`.
5. Ausgehende E-Mail (Email Account) muss eingerichtet sein, sonst gehen keine Bestätigungen raus.
6. Optional: **Google Calendar Integration** in Frappe aktivieren (Integrationen → Google Calendar) und die Kalender der Berater verbinden. Deren Google-Termine werden dann als Event synchronisiert und blockieren automatisch Buchungszeiten.

## 2. Kapazität und Regeln

In `beratungstermin/api.py`:
- `KAPAZITAET = {"buero": 1, "aussendienst": 1}` – wie viele Termine sich gleichzeitig überschneiden dürfen (Telefon und Video teilen sich das Büro)
- `PUFFER_MINUTEN = {"aussendienst": 45}` – Fahrzeitpuffer rund um Vor-Ort-Termine

Auf der Website (`src/data/erreichbarkeit.js`):
- Öffnungszeiten (Mo–Do 8–16, Fr 8–13), bayerische Feiertage (automatisch berechnet, inkl. 24.12./31.12.)
- Dauer je Terminart (20/30/60 Min.), Raster 30 Min., Vorlauf 2 h, Vor-Ort frühestens übermorgen, 21 Tage im Voraus

## 3. Zugänge (Website)

API-User z. B. `kontakt-web@oekovolt.de` mit **nur** der Rolle `Kontakt Webformular`, API-Key und Secret erzeugen.
In der Hosting-Umgebung (`.env.local` / Vercel) eintragen:

```
KONTAKT_API_KEY=<key>
KONTAKT_API_SECRET=<secret>
```

Ohne diese Variablen nutzt die Website den allgemeinen Zugang (`API_KEY`). Das funktioniert, ist aber nicht empfohlen.

## 4. CloudTalk (Sofort-Rückruf)

1. In CloudTalk als Admin: **Account → Settings → API Keys → Add API Key** und Key-ID und Secret notieren (das Secret wird nur einmal angezeigt).
2. Die **Agent-IDs** der Personen ermitteln, die Rückrufe annehmen sollen (Agents-Liste in CloudTalk oder `GET https://my.cloudtalk.io/api/agents/index.json`). Jeder Agent braucht eine ausgehende Nummer.
3. In der Hosting-Umgebung eintragen:
   ```
   CLOUDTALK_KEY_ID=<key id>
   CLOUDTALK_KEY_SECRET=<secret>
   CLOUDTALK_AGENT_IDS=12345,23456     # Reihenfolge = Priorität
   ```
4. **Ablauf:**
   - Die Website fragt alle 30 s die `availability_status` der Agents ab.
   - Während der Öffnungszeiten und wenn jemand „online“ ist, zeigt das Widget „Berater gerade frei – Rückruf in unter 60 Sekunden“.
   - Beim Absenden startet `calls/create.json`: Der Agent hat 20 s zum Abheben, danach wird der Kunde angerufen.
   - Klappt das nicht (niemand frei, Fehler), wird der Rückruf als „Sofort“ an das Rückruf-Team gemeldet.
5. Die angezeigte Rufnummer beim Kunden ist die ausgehende Nummer des Agents in CloudTalk. Empfohlen: die Firmennummer 08245 96 788 0, damit Kunden den Anruf erkennen.

**Missbrauchsschutz** (auf der Website umgesetzt):
- Nur Rufnummern aus DE, AT und CH; Sonder- und Mehrwertnummern sind gesperrt (0900, 0137, 0180 …)
- Höchstens 3 Rückrufwünsche je Nummer pro Stunde, global 60 pro 10 Minuten
- Honeypot-Feld und Mindest-Ausfüllzeit gegen Bots
- Einwilligungs-Checkbox (Pflicht)

## 5. Datenschutz

- **Datenschutzerklärung:** Abschnitt „Rückruf, Terminbuchung und CloudTalk“ (Anker `#rueckruf`) ist ergänzt.
- **AV-Vertrag mit CloudTalk:** CloudTalk s.r.o., Bratislava (EU) nach Art. 28 DSGVO abschließen; die Unterauftragsverarbeiter von CloudTalk prüfen.
- **Löschfristen:**
  - Rückrufe: 90 Tage nach Erledigung
  - Termine: 12 Monate nach dem Termin
  - Wird daraus ein Lead oder Auftrag, die Daten vorher übernehmen.
- **Anrufaufzeichnung:** In CloudTalk nur mit ausdrücklicher Einwilligung am Telefon aktivieren. Die Website holt dafür **keine** Einwilligung ein.
- **VVT:** Eintrag „Rückruf und Online-Terminbuchung“ ergänzen (Vorlage: `docs/datenschutz/VVT-Rueckruf-Termin.md`).

## 6. Test

```bash
# Belegung (mit dem Web-User)
curl -X POST ".../api/method/oekovoltdeutchland.oekovoltdeutchland.doctype.beratungstermin.api.belegte_zeiten" \
  -H "Authorization: token KEY:SECRET" -H "Content-Type: application/json" -d '{"art":"video"}'

# Darf NICHT funktionieren (403):
curl ".../api/resource/Beratungstermin" -H "Authorization: token KEY:SECRET"
```

Danach auf der Website `/termin` einen Video-Termin buchen. Prüfen:
- Die Bestätigungsmail mit .ics kommt an.
- Event und Beratungstermin stehen im Desk.
- Derselbe Slot ist anschließend nicht mehr buchbar.
