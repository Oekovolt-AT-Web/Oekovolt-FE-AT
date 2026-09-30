# Go-live: eigenes Hinweisgebersystem statt IntegrityLine (Österreich)

Umstellung des Meldekanals von **IntegrityLine** (`https://oekovolt.integrityline.com/`) auf das
**eigene Hinweisgebersystem** unter `https://www.oekovolt.com/hinweisgebersystem` (Formular +
anonymes Postfach, Daten im AT-Backoffice, DocType „Hinweis“).

Rechtsgrundlage ist das österreichische **HinweisgeberInnenschutzgesetz (HSchG, BGBl. I Nr. 6/2023)**,
nicht das deutsche HinSchG. Externe Stelle ist das **BAK** (Bundesamt zur Korruptionsprävention und
Korruptionsbekämpfung). Installation des Backends: [README.md](README.md). Albanische Vorlage für DE:
[AKTIVIZIMI.md](AKTIVIZIMI.md). Stellen, die mit „⚖️ rechtlich prüfen“ markiert sind, muss der Jurist oder die
Datenschutzbeauftragte (DSB) bestätigen.

---

## 0. Der Schalter `HINWEIS_INTERN`

Eine einzige Umgebungsvariable der Website schaltet alles gleichzeitig um. Sie wird zentral in
`src/data/hinweisgeber.js` ausgewertet.

| | **AUS** (Standard: leer oder `0`) | **AN** (`HINWEIS_INTERN=1`) |
|---|---|---|
| Meldekanal | IntegrityLine | eigenes System `/hinweisgebersystem` |
| `/hinweisgebersystem`, `/hinweisgebersystem/*` | 307 → IntegrityLine (`next.config.mjs`) | 200, Formular und Postfach |
| `/api/hinweis`, `/api/hinweis/postfach`, `/api/hinweis/health` | 503 `nicht_konfiguriert` | aktiv, sofern `SERVER` und Zugangsdaten gesetzt |
| `/hinweisgeberschutz` (Infoseite) | Buttons und Texte → IntegrityLine | Buttons → `/hinweisgebersystem` (+ Postfach, weitere Meldewege) |
| Datenschutz der Infoseite | IntegrityLine als Auftragsverarbeiter | Texte des eigenen Systems (`DATENSCHUTZ` in `hinweisgeber.js`) |
| `/datenschutz`, Punkt 23 und 24 | IntegrityLine, „Betreiber des Hinweisgeberportals“ | eigenes System, eigenes Backoffice, 5 Jahre nach Abschluss; kein Portalbetreiber |
| `/datenschutz`, Punkt 9 (IP-Adresse) | unverändert | Zusatz: gilt nicht für Meldungen im Hinweisgebersystem |
| `/hinweisgebersystem` robots / Sitemap | noindex, nicht in der Sitemap | index, in der Sitemap |
| `llms.txt` | Link auf `/hinweisgeberschutz` | zusätzlich Link auf `/hinweisgebersystem` |
| `/barrierefreiheit` | „externes Hinweisgeberportal“ als Dienst Dritter | Hinweisgebersystem im Geltungsbereich |
| Footer, Impressum, LegalShell | → `/hinweisgeberschutz` | → `/hinweisgeberschutz` (unverändert, die Infoseite führt weiter) |

> **Build-Zeit!** Die Seiten werden statisch erzeugt, und die Redirects werden beim Build übernommen.
> Nur `/api/hinweis*` liest den Wert zur Laufzeit. Nach jedem Umschalten (auch beim Rückfall) daher
> **neu bauen und neu starten**. Nur neu zu starten reicht nicht: Dann zeigen die Seiten noch den alten Zustand, die API aber schon den neuen.

---

## 1. Blocker: vor dem Umschalten beheben

- [ ] **Kategorien im DocType ergänzen (Backend).** `api.py` akzeptiert die AT-Kategorien des Formulars
      (`Korruption`, `Vergabe`, `Produktsicherheit`, `Umwelt`, `Datenschutz`, `Verbraucherschutz`,
      `Finanzen`, `Arbeitssicherheit`, `Sonstiges`). Das Select-Feld `kategorie` in
      `doctype/hinweis/hinweis.json` kennt aber nur die DE-Werte
      (`Straftat, Ordnungswidrigkeit, Arbeitssicherheit, Umwelt, Datenschutz, Produktsicherheit, Wettbewerb, Diskriminierung, Sonstiges`).
      Frappe prüft Select-Werte beim `insert()`. Meldungen mit **Korruption, Vergabe, Verbraucherschutz oder Finanzen**
      scheitern deshalb mit einem ValidationError. Die Website zeigt dann „Die Meldung konnte gerade nicht übermittelt werden“.
      Behebung: In `hinweis.json` die Optionen um `Korruption`, `Vergabe`, `Verbraucherschutz` und `Finanzen` erweitern
      (DE-Werte für Altfälle stehen lassen). Danach `bench --site <site> migrate`.
      Test: je eine Testmeldung pro Kategorie (Punkt 4).
- [ ] Datum klären, **bis wann IntegrityLine vertraglich läuft**. Das eigene System muss vorher live und getestet sein,
      damit es keinen Tag ohne funktionierenden internen Meldekanal gibt.

---

## 2. Voraussetzungen (organisatorisch und rechtlich)

### 2.1 Interne Meldestelle
- [ ] Mindestens **eine reale Person** hat im AT-Backoffice die Rolle **„Hinweis Meldestelle“**. Nicht `Administrator`:
      Dieses Konto wird bei den Benachrichtigungen übersprungen.
- [ ] **Vertretung** (Urlaub, Krankheit) ist benannt und hat dieselbe Rolle.
- [ ] Die Personen sind unparteiisch, bei der Bearbeitung nicht weisungsgebunden, zur Vertraulichkeit
      verpflichtet und fachlich geeignet (HSchG). ⚖️ Benennung schriftlich dokumentieren.
- [ ] Keine andere Rolle hat Rechte auf den DocType „Hinweis“. Die Zahl der Konten mit `System Manager` bzw.
      `Administrator` ist minimal, denn diese Konten sehen technisch alles.

### 2.2 E-Mail-Benachrichtigung (wichtigster Test)
Bei einer neuen Meldung, einer neuen Postfach-Nachricht und nach 10 Fehlversuchen bekommt die Meldestelle eine E-Mail
**ohne Inhalte** („Hinweisgebersystem: Neue Meldung eingegangen (HW-…)“).
- [ ] Im AT-Backoffice gibt es ein **Email Account** mit *Enable Outgoing*, und es funktioniert.
- [ ] In `site_config.json` steht **nicht** `"mute_emails": 1`.
- [ ] Die Testmeldung aus Punkt 4 kommt innerhalb weniger Minuten bei der Meldestelle an.
      Ohne E-Mail bleibt eine Meldung womöglich unbemerkt, und die Fristen werden versäumt:
      **7 Tage** Eingangsbestätigung, **3 Monate** Rückmeldung (§ 13 HSchG).

### 2.3 Eigener API-User für die Website
- [ ] Im AT-Backoffice den User `hinweis-web@oekovolt.com` anlegen, **nur** mit der Rolle **„Hinweis Webformular“**
      (ohne Desk-Zugriff). Die Rollen „Hinweis Meldestelle“ und „Hinweis Webformular“ sind angelegt.
- [ ] *API Key* und *API Secret* erzeugen (User → Settings → API Access).
- [ ] Prüfen: Dieser Schlüssel kann Meldungen **nicht lesen**. `GET /api/resource/Hinweis` liefert **403** (Punkt 4, Test 9).

### 2.4 Backend installiert
- [ ] DocTypes „Hinweis“ und „Hinweis Nachricht“ sind migriert, inklusive Kategorien-Fix aus Punkt 1.
- [ ] Der Scheduler-Job `…doctype.hinweis.api.loesche_abgelaufene_hinweise` steht in `hooks.py` → `scheduler_events.daily`
      (im Repo vorhanden). Der Scheduler ist auf der Site aktiv (`bench --site <site> scheduler status`).
- [ ] Redis-Cache läuft. Er wird für die Sperre nach 10 falschen Zugangsschlüsseln benötigt.

### 2.5 Aufbewahrung und Löschung ⚖️ rechtlich prüfen
- Umgesetzt im Backend (`hinweis.py`): Beim Status **Abgeschlossen** wird `loeschung_faellig = abgeschlossen_am + 5 Jahre` gesetzt.
  Der tägliche Job löscht fällige Fälle samt Versionshistorie, außer bei „Aufbewahrung verlängert“ (mit Grund).
- [ ] ⚖️ Bestätigen, dass „5 Jahre **nach Abschluss**“ die Vorgabe aus § 8 Abs. 11 HSchG erfüllt. Das Gesetz knüpft an die
      *letztmalige Verarbeitung oder Übermittlung* an; Website-Texte und Backend verwenden „nach Abschluss“.
- [ ] ⚖️ Klären, ob und wie **Protokolldaten** über Verarbeitungsvorgänge über die Löschung hinaus aufzubewahren sind (HSchG).
      Derzeit löscht der Job die Frappe-Versionshistorie **mit**. Die Website-Texte machen dazu bewusst keine Aussage.

### 2.6 Mündlicher und persönlicher Meldeweg
- [ ] Festlegen, wie **mündliche Meldungen** angenommen werden. Stand heute: keine eigene Telefonnummer
      (`MELDESTELLE.telefon = null` in `src/data/hinweisgeber.js`). Die Seite nennt deshalb das **persönliche Gespräch nach
      Terminvereinbarung**, angefragt über eine kurze Online-Meldung (auch anonym) oder per Brief, mit Terminvorschlag im Postfach.
- [ ] Die Meldestelle kann ein solches Gespräch **innerhalb angemessener Frist** anbieten und legt es im Backoffice als Fall an
      (Hinweis → Neu, Eingangskanal „Persönliches Gespräch“ bzw. „Post“).
- [ ] Optional: eigene Durchwahl der Meldestelle (nicht die Zentrale) in `MELDESTELLE.telefon` und `telefonzeiten` eintragen.
      Die Seite zeigt sie dann automatisch an. **Keine Nummer eintragen, die nicht vertraulich bei der Meldestelle ankommt.**
- [ ] ⚖️ Bestätigen, dass die gewählte Form des mündlichen Meldewegs den Anforderungen des HSchG genügt.

### 2.7 Datenschutz-Dokumentation (für Österreich neu fassen)
Die vorhandenen Dokumente unter `docs/datenschutz/` sind die **deutsche** Fassung: HinSchG, oekovolt.de, ÖKOVOLT GmbH Solartechnik.
- [ ] **Verzeichnis von Verarbeitungstätigkeiten** (`VVT-Hinweisgebersystem.md`) für die Ökovolt Solartechnik GmbH
      nach HSchG fassen und die offenen Punkte `[OFFEN]` füllen.
- [ ] **DSFA** (`DSFA-Hinweisgebersystem.md`) für AT fassen, offene Punkte schließen, unterschreiben.
- [ ] **Beschäftigteninformation** (`Beschaeftigteninformation-HinSchG.md`) auf HSchG, BAK und
      `www.oekovolt.com/hinweisgebersystem` umschreiben.
- [ ] **Handbuch der Meldestelle** (`Meldestelle-Handbuch.md`) auf HSchG-Fristen und -Paragraphen umstellen und aushändigen.
- [ ] Die Texte der Website hat die DSB geprüft: `DATENSCHUTZ` und `FAQ` in `src/data/hinweisgeber.js`,
      `/datenschutz` Punkt 23, `/hinweisgeberschutz`.

### 2.8 Technische Sicherheit
- [ ] Durchgehend HTTPS: `www.oekovolt.com` und `SERVER=https://backoffice.oekovolt.com`. Das Backoffice ist nur per TLS erreichbar.
- [ ] 2FA für alle Konten mit „Hinweis Meldestelle“ und „System Manager“.
- [ ] Datenbank-Backups sind verschlüsselt, der Zugriff ist dokumentiert. Die Backups enthalten Meldungen.
- [ ] Access-Logs des Website-Hostings für `/api/hinweis*` deaktivieren oder IP-anonymisieren.
- [ ] In Frappe prüfen, dass `Error Log`/`Request Log` keine Meldungsinhalte enthalten, und den Zugriff darauf beschränken.
- [ ] **Statistik ausnehmen (Website-Code):** Die Heatmap schließt `/hinweisgebersystem` bereits aus (`src/lib/heatmap.js`).
      **Google Analytics** (nach Einwilligung) und **Umami** messen den Seitenaufruf `/hinweisgebersystem*` dagegen noch.
      Empfehlung: `hinweisgebersystem` in die Ausnahmen aufnehmen, in `src/components/Statistik/GoogleAnalytics.js`
      (`AUSGENOMMEN`) und `src/components/Statistik/Umami.js`. Meldungsinhalte werden in keinem Fall übertragen.
- [ ] Uptime-Monitor auf `https://www.oekovolt.com/api/hinweis/health` (200 = Website, Backend und DocType ok; keine Falldaten).

### 2.9 Übergang von IntegrityLine
- [ ] Offene Fälle bei IntegrityLine bis Vertragsende abschließen oder als Fall im Backoffice übernehmen
      (Eingangskanal „Post“ o. Ä.). **Die Fristen laufen weiter.**
- [ ] Anonym Meldende bei IntegrityLine **vor** Vertragsende über das dortige Postfach informieren, wie der Kontakt weitergeht.
- [ ] Dokumentation der IntegrityLine-Fälle exportieren und entsprechend § 8 Abs. 11 HSchG aufbewahren.
      Die Löschbestätigung des Anbieters archivieren.
- [ ] Beschäftigte, Leiharbeitskräfte und Partner über den neuen Kanal und das Stichtagsdatum informieren
      (E-Mail, Intranet, Aushang: Beschäftigteninformation aus 2.7).
- [ ] Interne Richtlinie bzw. Compliance-Dokumente auf die neue Adresse umstellen.
- [ ] ⚖️ Jurist bzw. Compliance hat die Umstellung und alle Texte freigegeben.

---

## 3. Umschalten

Voraussetzung: Punkt 1 und 2 sind vollständig abgehakt.

- [ ] In der Umgebung des **Live-Servers** (Hosting bzw. `.env.production` des Live-Verzeichnisses, nicht die Entwicklung)
      setzen (Vorlage: `Import-Backend-Frappe/installation/website_env.txt`):
      ```env
      HINWEIS_INTERN=1
      HINWEIS_API_KEY=<API Key von hinweis-web@oekovolt.com>
      HINWEIS_API_SECRET=<API Secret von hinweis-web@oekovolt.com>
      ```
      Ohne `HINWEIS_API_KEY/SECRET` nimmt die Website den allgemeinen `API_KEY`. Das funktioniert, ist aber
      **nicht zulässig**, weil dieser Schlüssel zu weit reichende Rechte hat.
- [ ] Optional im Code: In `src/app/sitemap.js` das `lastModified` des Eintrags `/hinweisgebersystem` auf das Go-live-Datum setzen.
- [ ] **Neu bauen und deployen** (die Variable muss beim Build gesetzt sein):
      ```bash
      npm ci
      npm run build
      # danach den Node-Prozess der Website neu starten (z. B. pm2 restart <name> --update-env)
      ```
- [ ] Nach dem Deploy: IndexNow bzw. Search Console (Sitemap neu einreichen), siehe `docs/AT-UEBERGABE.md`.

---

## 4. Test nach dem Umschalten

| # | Test | Erwartet | ✓ |
|---|---|---|---|
| 1 | `curl -sI https://www.oekovolt.com/hinweisgebersystem` | `200` (kein `307` mehr) | [ ] |
| 2 | `curl -sI https://www.oekovolt.com/hinweisgebersystem/postfach` | `200`, im HTML `noindex` | [ ] |
| 3 | `curl -s https://www.oekovolt.com/api/hinweis/health` | `{"ok":true}` | [ ] |
| 4 | `/hinweisgeberschutz` aufrufen | „Hinweis abgeben“ und „Zum Hinweisgebersystem“ führen zu `/hinweisgebersystem`; nirgends „integrityline“ | [ ] |
| 5 | `/datenschutz#hinweisgeber` und `#empfaenger` | Punkt 23 beschreibt das eigene System, Punkt 24 ohne „Betreiber des Hinweisgeberportals“ | [ ] |
| 6 | `https://www.oekovolt.com/sitemap.xml` und `/llms.txt` | enthalten `/hinweisgebersystem` | [ ] |
| 7 | **Testmeldung** auf `/hinweisgebersystem`, anonym, Betreff „TEST – bitte löschen“; nacheinander auch mit den Kategorien Korruption, Vergabe, Verbraucherschutz und Finanzen | Fall-Nummer `HW-XXXX-XXXX` und Zugangsschlüssel werden angezeigt | [ ] |
| 8 | **Mail an die Meldestelle** | „Hinweisgebersystem: Neue Meldung eingegangen (HW-…)“ kommt an, ohne Inhalte | [ ] |
| 9 | **403 für den Web-User:** `curl -s -o /dev/null -w "%{http_code}" https://backoffice.oekovolt.com/api/resource/Hinweis -H "Authorization: token <HINWEIS_API_KEY>:<HINWEIS_API_SECRET>"` | `403` | [ ] |
| 10 | Im Backoffice → Hinweis | Der TEST-Fall ist da, mit Fristen (Bestätigung +7 Tage, Rückmeldung). Die Meldestelle schreibt eine Nachricht (Absender „Meldestelle“, nicht „Intern“) und setzt den Status „Eingang bestätigt“. | [ ] |
| 11 | **Postfach:** `/hinweisgebersystem/postfach` mit Fall-Nummer und Schlüssel | Status und Antwort der Meldestelle werden angezeigt; eine Antwort der meldenden Person kommt an, und es gibt eine Mail „Neue Nachricht der meldenden Person“ | [ ] |
| 12 | Postfach mit falschem Schlüssel | „Fall-Nummer oder Zugangsschlüssel stimmen nicht.“ | [ ] |
| 13 | TEST-Fälle im Backoffice löschen | – | [ ] |

Erst wenn alle Tests bestanden sind: Beschäftigte informieren (2.9) und IntegrityLine zum Vertragsende beenden.

---

## 5. Rückfall (falls etwas nicht funktioniert)

Solange IntegrityLine noch läuft:
1. `HINWEIS_INTERN` auf dem Live-Server leeren oder auf `0` setzen.
2. **Neu bauen und neu starten** (wie in Punkt 3). Danach leitet `/hinweisgebersystem` wieder auf IntegrityLine um, alle Texte
   und Links zeigen auf IntegrityLine, und die API nimmt keine Meldungen mehr an (503).
3. Meldungen, die in der Zwischenzeit im eigenen System eingegangen sind, bleiben im Backoffice. Die Meldestelle bearbeitet sie
   dort weiter; die Kommunikation läuft über das Postfach, das für bestehende Fälle aber nur bei `HINWEIS_INTERN=1` erreichbar ist.
   Meldende deshalb bei Bedarf über den vereinbarten Weg (Post oder persönlich) kontaktieren.

Läuft IntegrityLine **nicht mehr**, gibt es keinen Rückfall auf IntegrityLine. Dann sofort einen Ersatzkanal bereitstellen
und auf der Seite nennen, z. B. Post an die Meldestelle und das persönliche Gespräch (bereits auf `/hinweisgebersystem#meldewege`).
Den Fehler im eigenen System beheben, statt umzuschalten: Ohne IntegrityLine zeigt der AUS-Zustand auf einen toten Kanal.

---

## 6. Laufender Betrieb (Meldestelle)

- **Innerhalb von 7 Tagen:** Eingangsbestätigung, als Nachricht an die meldende Person plus Status „Eingang bestätigt“ (§ 13 HSchG).
- **Spätestens 3 Monate danach:** Rückmeldung zu den ergriffenen oder geplanten Folgemaßnahmen (§ 13 HSchG).
- Mündliche Meldungen und persönliche Gespräche ebenfalls als Fall im Backoffice dokumentieren.
- Nach Abschluss: Status „Abgeschlossen“. Die Löschung erfolgt automatisch 5 Jahre später (⚖️ siehe 2.5), außer bei
  „Aufbewahrung verlängert“ mit Grund, z. B. wegen eines laufenden Verfahrens.
- Den Health-Check und die E-Mail-Zustellung regelmäßig prüfen.
