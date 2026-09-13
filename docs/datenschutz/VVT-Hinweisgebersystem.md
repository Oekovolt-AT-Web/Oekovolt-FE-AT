# Verzeichnis von Verarbeitungstätigkeiten (Art. 30 Abs. 1 DSGVO)

## Verarbeitungstätigkeit: Internes Hinweisgebersystem (HinSchG)

| | |
|---|---|
| **Stand** | 13.09.2026, Entwurf zur Freigabe |
| **Version** | 1.0 |
| **Ersetzt** | Eintrag „Hinweisgebersystem EQS IntegrityLine“ (externer Anbieter, gekündigt) |
| **Fachlich verantwortlich** | Interne Meldestelle nach § 14 HinSchG – `[OFFEN: Name/Funktion der benannten Person(en) und Vertretung]` |
| **Freigabe** | `[OFFEN: Geschäftsführung, Datum]` |

Mit `[OFFEN: …]` markierte Felder muss das Unternehmen vor der Freigabe ergänzen.

---

### 1. Verantwortlicher (Art. 30 Abs. 1 lit. a)

ÖKOVOLT GmbH Solartechnik, Schlingener Straße 1a, 86842 Türkheim
Vertreten durch: Andreas Wegscheider, Geschäftsführender Gesellschafter
Telefon +49 8245 96 788 0 · office@oekovolt.de

**Datenschutzbeauftragter:** `[OFFEN: Name und Kontaktdaten, falls benannt – Benennungspflicht nach § 38 BDSG prüfen]`

### 2. Zwecke der Verarbeitung (lit. b)

1. Entgegennahme von Meldungen über Verstöße im Sinne des § 2 HinSchG (online, schriftlich, persönlich).
2. Eingangsbestätigung und Kommunikation mit der meldenden Person, auch anonym über das Postfach.
3. Prüfung der Stichhaltigkeit und Ergreifen von Folgemaßnahmen (§ 18 HinSchG).
4. Dokumentation der Meldungen (§ 11 HinSchG).
5. Schutz meldender Personen vor Repressalien und Wahrung der Vertraulichkeit (§ 8 HinSchG).

**Rechtsgrundlagen:**
- Art. 6 Abs. 1 lit. c DSGVO i. V. m. §§ 10, 12, 16, 17, 18 HinSchG.
  - Pflicht zur Einrichtung ab 50 Beschäftigten (§ 12 Abs. 2 HinSchG). `[OFFEN: Beschäftigtenzahl bestätigen]`
  - Liegt sie darunter, gilt Art. 6 Abs. 1 lit. f DSGVO: berechtigtes Interesse an der Aufdeckung von Rechtsverstößen.
- Besondere Kategorien personenbezogener Daten: Art. 9 Abs. 2 lit. g DSGVO i. V. m. § 10 Satz 2 HinSchG.
- Daten über strafbare Handlungen: Art. 10 DSGVO i. V. m. § 10 HinSchG.

### 3. Kategorien betroffener Personen und personenbezogener Daten (lit. c)

| Betroffene Personen | Datenkategorien |
|---|---|
| Meldende Personen: Beschäftigte, ehemalige Beschäftigte, Bewerbende, Lieferanten, Kunden, sonstige | freiwillige Kontaktdaten (Name, E-Mail, Telefon), Beziehung zum Unternehmen, Inhalt der Meldung, Nachrichten im Postfach |
| In der Meldung genannte Personen (beschuldigte Personen) | Name, Funktion, Beschreibung des Verhaltens, ggf. Daten zu Straftaten (Art. 10 DSGVO) |
| Dritte / Zeuginnen und Zeugen | Name, Funktion, Rolle im Sachverhalt |
| Beschäftigte der Meldestelle | Benutzerkonto, Bearbeitungsvermerke, Änderungsprotokoll |

- **Mögliche besondere Kategorien (Art. 9 DSGVO):** Gesundheitsdaten, ethnische Herkunft, religiöse Überzeugung, sexuelle Orientierung – nur, soweit sie im Freitext einer Meldung stehen.
- **Nicht erhoben:** IP-Adresse, User-Agent, Geräte-Kennungen und Cookies zur Meldung (technisch umgesetzt: Weiterleitung über den Website-Server, kein Logging von Inhalten).
- **Zugangsschlüssel:** nur als PBKDF2-SHA256-Hash gespeichert (200.000 Iterationen, Salt je Fall).

### 4. Empfänger (lit. d)

**Intern:** ausschließlich Beschäftigte der Meldestelle (Rolle „Hinweis Meldestelle“ im Frappe-Backoffice). Weitere Stellen nur im Rahmen von Folgemaßnahmen und unter Wahrung von § 8 HinSchG, zum Beispiel Geschäftsführung oder Personalabteilung, ohne Identität der meldenden Person.

**Extern, nur in den Fällen des § 9 HinSchG:** Strafverfolgungsbehörden, Gerichte, zuständige Verwaltungsbehörden; gegebenenfalls externe Rechtsanwälte zur Aufklärung.

**Auftragsverarbeiter (Art. 28 DSGVO):**

| Dienstleister | Leistung | Sitz / Verarbeitungsort | AV-Vertrag |
|---|---|---|---|
| `[OFFEN: Hosting-Anbieter des Next.js-Website-Servers]` | Betrieb der Website und der API-Routen `/api/hinweis*` | `[OFFEN]` | `[OFFEN]` |
| `[OFFEN: Hosting-Anbieter des Frappe-Backoffice]` | Datenbank und Anwendung, Speicherung der Meldungen | `[OFFEN]` | `[OFFEN]` |
| IT Engineers LLC (Website-/Backoffice-Entwicklung) | Wartung, ggf. Administrationszugriff | `[OFFEN: Sitz und Zugriffsumfang prüfen]` | `[OFFEN]` |
| Cloudflare, Inc. | CDN, DDoS-Schutz, TLS-Terminierung für `www.oekovolt.de` und `backoffice.oekovolt.de` | USA / weltweit | Cloudflare DPA (online abgeschlossen?) `[OFFEN: prüfen]` |
| `[OFFEN: E-Mail-Versanddienst des Backoffice]` | Benachrichtigungs-E-Mails an die Meldestelle, ohne Inhalte | `[OFFEN]` | `[OFFEN]` |

### 5. Übermittlung in Drittländer (lit. e)

- **USA (Cloudflare, Inc.):** Cloudflare terminiert TLS und kann Inhalte technisch im Klartext verarbeiten.
  - Grundlage: Angemessenheitsbeschluss EU-US Data Privacy Framework (Art. 45 DSGVO) sowie EU-Standardvertragsklauseln im Cloudflare DPA.
  - `[OFFEN: DPF-Zertifizierung zum Freigabezeitpunkt unter dataprivacyframework.gov verifizieren]`
- **Weitere Drittlandbezüge:** `[OFFEN: Standort der Server und Fernwartungszugriffe der Dienstleister klären, insbesondere außerhalb EU/EWR]`

### 6. Löschfristen (lit. f)

| Daten | Frist | Umsetzung |
|---|---|---|
| Dokumentation einer Meldung inkl. Nachrichten | 3 Jahre nach Abschluss des Verfahrens (§ 11 Abs. 5 HinSchG); länger nur, wenn erforderlich und verhältnismäßig | täglicher Scheduler-Job `loesche_abgelaufene_hinweise`; Aussetzen nur mit dokumentiertem Grund (Feld „Aufbewahrung verlängert“) |
| Versionshistorie (Änderungsprotokoll) des Falls | zusammen mit dem Fall | wird beim Löschen mit entfernt |
| Benachrichtigungs-E-Mails | `[OFFEN: Aufbewahrung im Postfach der Meldestelle festlegen, z. B. 30 Tage]` | enthalten keine Inhalte |
| Datensicherungen (Backups) | `[OFFEN: Rotationszyklus, z. B. 30 Tage]` | gelöschte Fälle verschwinden mit Ablauf der Backup-Rotation |
| Unvollständige Meldungen | werden nicht gespeichert | Speicherung erst beim Absenden |
| Anonymes Postfach | nicht gesondert, Teil des Falls | Zugangsschlüssel nach Löschung des Falls nutzlos |

### 7. Technische und organisatorische Maßnahmen (lit. g, Art. 32 DSGVO)

**Vertraulichkeit**
- Zugriff im Backoffice nur mit Rolle „Hinweis Meldestelle“; kein Lese-, Export- oder Share-Recht für andere Rollen.
- Eigener API-Benutzer „Hinweis Webformular“ ohne Leserechte; Datensätze werden nur über whitelisted Methoden geschrieben.
- Zugangsschlüssel nur als Hash; unbekannte Fall-Nummer und falscher Schlüssel sind für Angreifer nicht unterscheidbar (gleiche Antwort, gleiche Rechenzeit).
- Keine Speicherung von IP-Adressen und Metadaten; Frappe erhält Anfragen nur vom Website-Server.
- Benachrichtigungs-E-Mails ohne Meldungsinhalte.
- Keine Zwischenspeicherung von Entwürfen im Browser; Zugangsdaten im Postfach nur im Arbeitsspeicher.
- `[OFFEN: Zwei-Faktor-Authentifizierung für alle Konten mit Rolle „Hinweis Meldestelle“ und System Manager aktivieren]`
- `[OFFEN: Zugriff der Rolle System Manager/Administrator auf das Nötigste beschränken und dokumentieren]`

**Integrität**
- Durchgängige TLS-Verschlüsselung (HTTPS).
- Änderungsprotokoll (track changes) auf dem DocType „Hinweis“.
- Serverseitige Validierung und Längenbegrenzung aller Eingaben.

**Verfügbarkeit und Belastbarkeit**
- Drosselung von Anfragen ohne IP-Bezug; Honeypot und Mindestausfülldauer gegen automatisierte Einsendungen.
- `[OFFEN: Backup-Konzept Backoffice, verschlüsselte Backups, Wiederherstellungstest]`

**Verfahren zur regelmäßigen Überprüfung**
- `[OFFEN: jährliche Überprüfung der Rollen, Löschläufe und dieses Eintrags]`
- Fristenüberwachung (7 Tage / 3 Monate) über Listenansicht im Backoffice.

**Organisatorisch**
- Benennung der Meldestelle, Unabhängigkeit und Weisungsfreiheit (§ 15 HinSchG).
- Verpflichtung auf Vertraulichkeit; Schulung der Meldestelle `[OFFEN: Nachweis]`.
- Informationen für Beschäftigte über Meldewege (§ 13 Abs. 2 HinSchG): Intranet/Aushang `[OFFEN]`.

### 8. Datenschutz-Folgenabschätzung

Pflicht nach Art. 35 DSGVO; siehe `DSFA-Hinweisgebersystem.md`. Die Datenschutzkonferenz stuft Hinweisgebersysteme als Verarbeitung mit voraussichtlich hohem Risiko ein.

### 9. Informationspflichten

- Meldende Personen: Datenschutzhinweise unter https://www.oekovolt.de/hinweisgebersystem#datenschutz, Bestätigung vor dem Absenden.
- Beschuldigte Personen: Information nach Art. 14 DSGVO. Aufschub, solange die Aufklärung oder die Vertraulichkeit gefährdet wäre (Art. 14 Abs. 5 lit. b DSGVO, § 29 Abs. 1 BDSG). Aufschub und Nachholung sind im Fall zu dokumentieren.
- Allgemeine Datenschutzerklärung: Abschnitt „Hinweisgebersystem“.
