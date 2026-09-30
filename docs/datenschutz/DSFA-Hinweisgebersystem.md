# Risikobewertung / freiwillige DSFA (Art. 35 DSGVO) – Internes Hinweisgebersystem

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 (österreichische Fassung; ersetzt den deutschen Entwurf vom 13.09.2026).
> Aus der technischen Umsetzung abgeleitet, ersetzt keine Rechtsberatung.

| | |
|---|---|
| **Verantwortlicher** | Ökovolt Solartechnik GmbH, Gewerbegebiet 10, 5121 Ostermiething (FN 375708m) |
| **Bezug** | [VVT-Hinweisgebersystem.md](VVT-Hinweisgebersystem.md) |
| **Erstellt für** | Geschäftsführung, Datenschutzberatung, interne Stelle |
| **Stellungnahme Datenschutzbeauftragte/r bzw. -beratung** | `[OFFEN]` |
| **Freigabe Geschäftsführung** | `[OFFEN: Name, Datum]` |
| **Nächste Überprüfung** | `[OFFEN: spätestens 12 Monate nach Umschalten auf HINWEIS_INTERN=1 oder bei wesentlicher Änderung]` |

---

## 1. Ist eine DSFA Pflicht?

**Nein, nach § 8 Abs. 13 HSchG:** Die Datenverarbeitungen nach § 8 Abs. 1–12 HSchG beruhen auf einer Rechtsgrundlage des
Unionsrechts, sind bereits Gegenstand einer allgemeinen Datenschutz-Folgenabschätzung und erfüllen die Voraussetzungen des
Art. 35 Abs. 10 DSGVO für den Entfall der DSFA.

**Warum trotzdem diese Bewertung:** Die gesetzliche Folgenabschätzung betrifft die Verarbeitung als solche, nicht die
konkrete technische Umsetzung. Ökovolt betreibt eine **Eigenentwicklung** (Next.js-Website + Frappe-Backoffice) statt
eines spezialisierten Anbieters und trägt damit selbst die Verantwortung für Betrieb und Sicherheit (Art. 25, 32 DSGVO;
§ 11 Abs. 1 letzter Satz HSchG verlangt technische und organisatorische Eignung nach Art. 25 DSGVO). Die Bewertung dient als
Nachweis (Art. 5 Abs. 2 DSGVO) und als Entscheidungsgrundlage für das Umschalten.
`[OFFEN: Einschätzung der Datenschutzberatung, ob die Bewertung in dieser Form genügt]`

Risikofaktoren: Beschäftigtendaten; mögliche Daten zu strafbaren Handlungen (Art. 10) und besonderen Kategorien (Art. 9);
erhebliche Folgen für betroffene Personen; Gefahr von Vergeltungsmaßnahmen bei Aufdeckung der Identität.

## 2. Systematische Beschreibung

**Ablauf (eigenes System, `HINWEIS_INTERN=1`)**
1. Die hinweisgebende Person öffnet `https://www.oekovolt.com/hinweisgebersystem` und füllt das Formular aus; „anonym“ ist
   voreingestellt.
2. Der Browser sendet die Meldung per HTTPS an `/api/hinweis` (Next.js, Server der Website).
3. Die Route prüft Honeypot, Mindestausfülldauer und Felder und leitet die Meldung **ohne IP-Adresse oder Header** mit
   eigenen Zugangsdaten (`HINWEIS_API_KEY`) an das Backoffice weiter (`…doctype.hinweis.api.create_hinweis`).
4. Das Backoffice speichert den Fall (DocType „Hinweis“), erzeugt Fall-Nummer und Zugangsschlüssel; vom Schlüssel wird
   nur der Hash gespeichert.
5. Fall-Nummer und Schlüssel werden der Person **einmalig** angezeigt.
6. Die interne Stelle erhält eine E-Mail **ohne Inhalte** und bearbeitet den Fall im Backoffice.
7. Kommunikation über `/hinweisgebersystem/postfach` (Fall-Nummer + Schlüssel).
8. Abschluss → automatische Löschung 5 Jahre nach Abschluss (§ 8 Abs. 11 HSchG, siehe VVT Abschnitt 6).

**Weitere Wege:** Post an die interne Stelle; Zusammenkunft auf Ersuchen binnen 14 Kalendertagen (§ 13 Abs. 5 HSchG),
Dokumentation nach § 9 Abs. 4–5 HSchG. Eine eigene Telefonnummer gibt es nicht (`MELDESTELLE.telefon = null`); nach
§ 13 Abs. 5 HSchG sind mündliche Hinweise optional („schriftlich oder mündlich oder in beiden Formen“).

**Beteiligte Systeme:** Browser → Website-Server (Hosting `[OFFEN]`) → Backoffice `backoffice.oekovolt.com`
(Hetzner, Nürnberg) mit MariaDB, Redis (Sperre nach Fehlversuchen), Scheduler, E-Mail-Ausgang, Backups.

**Solange `HINWEIS_INTERN` aus ist**, gilt diese Bewertung nicht; Meldungen gehen an `oekovolt.integrityline.com`.
`[OFFEN: Für den Übergangszeitraum AV-Vertrag und Sicherheitsnachweise des Portalbetreibers ablegen]`

## 3. Notwendigkeit und Verhältnismäßigkeit

| Grundsatz | Bewertung |
|---|---|
| **Zweckbindung** | Nur für Prüfung, Folgemaßnahmen und Dokumentation nach HSchG (§ 8 Abs. 1, 2). Geschäftsgeheimnisse nur für diese Zwecke (§ 7 Abs. 7). |
| **Datenminimierung** | Kontaktdaten freiwillig; keine IP-/Gerätedaten; keine Dateianhänge; Pflichtfelder nur Betreff und Beschreibung; Hinweis im Formular, keine unnötigen Angaben zu machen. Nicht benötigte Daten unverzüglich löschen (§ 8 Abs. 10) – `[OFFEN: im Handbuch als Arbeitsschritt verankert, technisch nicht erzwungen]`. |
| **Richtigkeit** | Rückfragen über das Postfach; Ergänzungen und Berichtigungen der hinweisgebenden Person (§ 13 Abs. 8). |
| **Speicherbegrenzung** | 5 Jahre nach Abschluss mit Löschjob; Verlängerung nur mit Grund. Protokolldaten nach § 8 Abs. 12 fehlen noch (Maßnahme M3). |
| **Rechtmäßigkeit** | Art. 6 Abs. 1 lit. c DSGVO i. V. m. §§ 8, 11 HSchG; Art. 9 über § 8 Abs. 5; Art. 10 über § 8 Abs. 6 HSchG. |
| **Transparenz** | Datenschutzhinweise auf `/hinweisgebersystem#datenschutz`, Datenschutzerklärung Punkt 23, Beschäftigteninformation (§ 10 Abs. 1). |
| **Betroffenenrechte** | Gewährleistet mit den Beschränkungen des § 8 Abs. 9 HSchG; Beginn/Ende der Beschränkung dokumentieren. |
| **Alternativen** | Externes Portal (IntegrityLine, derzeit aktiv) oder Eigenlösung. Die Eigenlösung hält die Daten in der eigenen Infrastruktur und spart einen Auftragsverarbeiter, verlangt aber eigenen sicheren Betrieb (Risiken R2, R4). |

## 4. Risikobewertung

Skala: Eintrittswahrscheinlichkeit (W) und Schwere (S) jeweils 1 (gering) bis 4 (sehr hoch); Risiko = W × S vor bzw. nach
Maßnahmen. ✔ umgesetzt (im Code belegt) · ☐ offen.

| # | Risiko | Betroffene | W | S | vorher | Maßnahmen | nachher |
|---|---|---|---|---|---|---|---|
| R1 | Identität anonym Hinweisgebender wird über technische Metadaten (IP, Gerät) aufgedeckt | Hinweisgebende | 3 | 4 | 12 | ✔ keine IP-/Header-Weitergabe ans Backoffice · ✔ keine Inhalts-Logs · ✔ keine Statistik/Heatmap auf `/hinweisgebersystem*` · ☐ Access-Logs der Website für `/api/hinweis*` abschalten oder anonymisieren · ☐ nach dem Umzug prüfen, ob ein CDN/Proxy dazwischenliegt | 4 |
| R2 | Unbefugte (Vorgesetzte, Admins) lesen Hinweise | Hinweisgebende, Betroffene | 3 | 4 | 12 | ✔ Rolle „Hinweis Meldestelle“ als einzige mit Leserecht · ✔ Web-API-User ohne Leserecht · ✔ E-Mails ohne Inhalte · ✔ Änderungsprotokoll · ☐ 2FA · ☐ System-Manager-Konten minimieren · ☐ Lesezugriffe protokollieren (§ 9 Abs. 6) | 4 |
| R3 | Fremde verschaffen sich Zugang zu einem Postfach (Erraten) | Hinweisgebende | 2 | 4 | 8 | ✔ ca. 120-Bit-Schlüssel · ✔ PBKDF2 (200.000 Iterationen) · ✔ einheitliche Fehlerantwort und Laufzeit · ✔ Drosselung · ✔ Sperre nach 10 Fehlversuchen für 30 Minuten mit Benachrichtigung | 2 |
| R4 | Kompromittierung von Server, Datenbank oder Backups | alle | 2 | 4 | 8 | ✔ TLS · ☐ verschlüsselte Backups mit beschränktem Zugriff · ☐ Patch-Management Frappe/Next.js · ☐ Fernwartung nur über gesicherte Zugänge | 4 |
| R5 | Offenlegung gegenüber Dienstleistern (Hosting, Wartung, E-Mail) | alle | 2 | 3 | 6 | ✔ Benachrichtigungen ohne Inhalte · ☐ AV-Verträge Hosting Website/Backoffice und Wartung · ☐ Verpflichtung der Dienstleister auf § 7 HSchG (§ 8 Abs. 4 letzter Satz) | 3 |
| R6 | Fristen versäumt (7 Tage Bestätigung, 3 Monate Rückmeldung, 14 Tage Zusammenkunft) | Hinweisgebende | 2 | 3 | 6 | ✔ Fälligkeitsfelder automatisch · ✔ Benachrichtigung bei Eingang/Nachricht · ☐ **Rückmeldefrist ab Entgegennahme statt ab Bestätigung berechnen** (§ 13 Abs. 9) · ☐ Vertretungsregelung · ☐ wöchentliche Fristenkontrolle | 2 |
| R7 | Betroffene zu Unrecht belastet; Daten zu lange gespeichert | Betroffene | 2 | 3 | 6 | ✔ Stichhaltigkeit wird dokumentiert · ✔ Löschjob · ✔ Zurückweisung offenkundig falscher Hinweise (§ 6 Abs. 4, § 13 Abs. 6) im Handbuch | 3 |
| R8 | Gesetzlich verlangte Protokolldaten fehlen oder werden zu früh gelöscht | alle, Unternehmen | 3 | 2 | 6 | ☐ inhaltsfreies Zugriffs- und Änderungsprotokoll, das die Löschung um 3 Jahre überdauert (§ 8 Abs. 12) | 2 |
| R9 | Hinweis geht technisch verloren (Ausfall) | Hinweisgebende | 2 | 3 | 6 | ✔ Eingaben bleiben im Formular bei Fehler · ✔ Hinweis auf Postweg und externe Stelle (BAK) · ✔ `/api/hinweis/health` · ☐ externer Uptime-Monitor · ☐ E-Mail-Zustellung testen | 3 |
| R10 | Rückschluss auf die hinweisgebende Person über den Inhalt | Hinweisgebende | 3 | 3 | 9 | ✔ Warnhinweis im Formular · ✔ Verschwiegenheit (§ 7) · ☐ Schulung der internen Stelle zur Anonymisierung bei Weitergabe | 6 |
| R11 | Missbrauch (Spam, gezielte Falschmeldungen) | Betroffene, Unternehmen | 2 | 2 | 4 | ✔ Honeypot, Mindestdauer, Drosselung · ✔ Prüfung vor Folgemaßnahmen · ✔ Hinweis auf § 24 Z 4 HSchG | 2 |

## 5. Ergebnis

Vor Umsetzung der offenen Maßnahmen besteht bei R1, R2 und R4 ein **hohes Risiko**. Nach ihrer Umsetzung wird das
Restrisiko als **vertretbar (mittel bis gering)** eingeschätzt. Eine vorherige Konsultation der Datenschutzbehörde nach
Art. 36 DSGVO ist dann nicht erforderlich. `[OFFEN: Bestätigung durch die Datenschutzberatung]`

**Mindestvoraussetzungen vor dem Umschalten auf `HINWEIS_INTERN=1`:**
- ☐ M1 – Access-Logs für `/api/hinweis*` deaktivieren oder anonymisieren (R1)
- ☐ M2 – 2FA für „Hinweis Meldestelle“ und „System Manager“; Rollenprüfung (R2)
- ☐ M3 – Protokollierung nach § 8 Abs. 12 und § 9 Abs. 6 HSchG (R2, R8)
- ☐ M4 – Rückmeldefrist ab Entgegennahme (R6)
- ☐ M5 – verschlüsselte Backups (R4)
- ☐ M6 – AV-Verträge Hosting und Wartung (R5)
- ☐ M7 – eigene Zugangsdaten `HINWEIS_API_KEY/SECRET` gesetzt (kein Rückfall auf `API_KEY`)

## 6. Maßnahmenplan

| Maßnahme | Verantwortlich | Termin | Status |
|---|---|---|---|
| Kategorien im DocType „Hinweis“ um AT-Werte erweitern | Backend | – | ✔ (in `hinweis.json` enthalten: Korruption, Vergabe, Verbraucherschutz, Finanzen) |
| Fehlversuch-Sperre des Postfachs | Backend | – | ✔ (`api.py`, 10 Versuche / 30 Minuten) |
| Rückmeldefrist ab Eingang (`hinweis.py`) und Texte in `src/data/hinweisgeber.js` angleichen | `[OFFEN]` | vor Go-live | ☐ |
| Protokoll nach § 8 Abs. 12 / § 9 Abs. 6 HSchG (Lesezugriffe, inhaltsfrei, 3 Jahre über Löschung hinaus) | `[OFFEN]` | vor Go-live | ☐ |
| Access-Logs `/api/hinweis*` | `[OFFEN]` | vor Go-live | ☐ |
| 2FA, Rollen, Zahl der System Manager | `[OFFEN]` | vor Go-live | ☐ |
| Backup-Verschlüsselung und Zugriffskonzept | `[OFFEN]` | vor Go-live | ☐ |
| AV-Verträge: Hosting Website, Hosting Backoffice, Wartung, E-Mail | `[OFFEN]` | vor Go-live | ☐ |
| Interne Stelle benennen, Vertretung, Schulung, Verschwiegenheit | Geschäftsführung | `[OFFEN]` | ☐ |
| Beschäftigte informieren (§ 10 Abs. 1 HSchG) | Geschäftsführung / Personal | `[OFFEN]` | ☐ |
| Externer Uptime-Check auf `https://www.oekovolt.com/api/hinweis/health` (HTTP 200) | `[OFFEN]` | nach Go-live | ☐ |
| Offene Fälle aus IntegrityLine übernehmen/abschließen, Export und Löschbestätigung archivieren | interne Stelle | vor Vertragsende | ☐ |
| Überprüfung dieser Bewertung | Datenschutzberatung | 12 Monate nach Go-live | ☐ |

## 7. Hinweis

Die Bewertung beruht auf dem Code-Stand vom 30.09.2026 (`src/app/api/hinweis/*`, `src/lib/hinweisApi.js`,
`src/data/hinweisgeber.js`, `Import-Backend-Frappe/apps/oekovoltdeutchland/.../doctype/hinweis/`). Offene Felder sind mit
den tatsächlichen Gegebenheiten zu ergänzen.
