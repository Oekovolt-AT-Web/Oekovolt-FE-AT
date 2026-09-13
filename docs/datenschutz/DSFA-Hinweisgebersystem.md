# Datenschutz-Folgenabschätzung (Art. 35 DSGVO)

## Internes Hinweisgebersystem der ÖKOVOLT GmbH Solartechnik

| | |
|---|---|
| **Stand** | 13.09.2026, Entwurf |
| **Erstellt für** | Geschäftsführung, Datenschutzbeauftragte/r, interne Meldestelle |
| **Bezug** | VVT-Eintrag „Internes Hinweisgebersystem (HinSchG)“ |
| **Stellungnahme DSB (Art. 35 Abs. 2)** | `[OFFEN]` |
| **Freigabe Geschäftsführung** | `[OFFEN: Name, Datum]` |
| **Nächste Überprüfung** | `[OFFEN: spätestens 12 Monate nach Inbetriebnahme oder bei wesentlicher Änderung]` |

---

## 1. Notwendigkeit der DSFA

Die Verarbeitung ist voraussichtlich mit einem hohen Risiko verbunden:
- Sie betrifft Beschäftigte und kann Daten über Straftaten (Art. 10) sowie besondere Kategorien (Art. 9) enthalten.
- Sie kann zu erheblichen Folgen für beschuldigte Personen führen (arbeitsrechtliche Maßnahmen, Strafanzeige).
- Meldende Personen tragen ein Risiko von Repressalien, wenn ihre Identität bekannt wird.

Die Datenschutzkonferenz stuft Verfahren zur Meldung von Missständen als besonders risikobehaftet ein (Orientierungshilfe „Whistleblowing-Hotlines“). Eine DSFA ist daher durchzuführen.

## 2. Systematische Beschreibung

**Ablauf**
1. Die meldende Person öffnet `www.oekovolt.de/hinweisgebersystem` und füllt ein vierstufiges Formular aus; anonym ist voreingestellt.
2. Der Browser sendet die Meldung per HTTPS an die Next.js-API-Route `/api/hinweis`. Der Verkehr läuft über Cloudflare.
3. Die API-Route validiert die Daten und leitet sie ohne IP-Adresse oder Header der meldenden Person mit einem eigenen API-Token an Frappe weiter (`…hinweis.api.create_hinweis`).
4. Frappe speichert den Fall (DocType „Hinweis“) und erzeugt Fall-Nummer und Zugangsschlüssel. Vom Schlüssel wird nur der Hash gespeichert.
5. Fall-Nummer und Schlüssel werden der meldenden Person einmalig angezeigt.
6. Die Meldestelle wird per E-Mail ohne Inhalt benachrichtigt und bearbeitet den Fall im Backoffice.
7. Kommunikation läuft über das Postfach `/hinweisgebersystem/postfach` (Fall-Nummer + Schlüssel).
8. Nach Abschluss wird der Fall nach 3 Jahren automatisch gelöscht.

**Weitere Meldewege:** Post an die Meldestelle, persönliches Gespräch nach Terminvereinbarung. `[OFFEN: telefonischer Meldeweg nach § 16 Abs. 3 HinSchG]`

**Beteiligte Systeme:** Browser, Cloudflare, Website-Server (Next.js), Frappe-Backoffice mit Datenbank, E-Mail-Versand, Backups.

## 3. Notwendigkeit und Verhältnismäßigkeit

| Grundsatz | Bewertung |
|---|---|
| **Zweckbindung** | Daten nur für Prüfung, Folgemaßnahmen und Dokumentation nach HinSchG, keine Nutzung für andere Zwecke. |
| **Datenminimierung** | Kontaktdaten freiwillig; keine IP-/Gerätedaten; nur Pflichtfelder Thema, Betreff, Beschreibung. Hinweis im Formular, keine unnötigen personenbezogenen Angaben zu machen. |
| **Richtigkeit** | Rückfragen über das Postfach, Berichtigung im Fall dokumentierbar. |
| **Speicherbegrenzung** | Automatische Löschung 3 Jahre nach Abschluss; Verlängerung nur mit Begründung. |
| **Rechtmäßigkeit** | Art. 6 Abs. 1 lit. c DSGVO i. V. m. HinSchG; Art. 9 Abs. 2 lit. g, Art. 10 DSGVO i. V. m. § 10 HinSchG. |
| **Transparenz** | Datenschutzhinweise nach Art. 13/14 auf der Seite; Hinweis in der allgemeinen Datenschutzerklärung. |
| **Betroffenenrechte** | Gewährleistet, mit gesetzlich zulässigen Einschränkungen zum Schutz der Vertraulichkeit (Art. 23 DSGVO, §§ 29, 34 BDSG, § 8 HinSchG). |
| **Alternativen** | Externer SaaS-Anbieter (bisher IntegrityLine) gekündigt. Die Eigenlösung hält Daten in der eigenen Infrastruktur und vermeidet einen weiteren Auftragsverarbeiter. Dafür trägt das Unternehmen selbst die Verantwortung für Betrieb und Sicherheit (siehe Risiken R4, R6). |

## 4. Risikobewertung

Skala: Eintrittswahrscheinlichkeit (W) und Schwere (S) jeweils 1 (gering) bis 4 (sehr hoch); Risiko = W × S vor bzw. nach Maßnahmen.

| # | Risiko | Betroffene | W | S | vorher | Maßnahmen (umgesetzt ✔ / offen ☐) | nachher |
|---|---|---|---|---|---|---|---|
| R1 | Identität der anonym meldenden Person wird über technische Metadaten (IP, Gerät) aufgedeckt | Meldende | 3 | 4 | 12 | ✔ Keine IP-/Header-Weitergabe an Frappe · ✔ keine Inhalts-Logs · ✔ keine Cookies/Analytics im Formularablauf · ☐ Access-Logs des Website-Hostings für `/api/hinweis*` deaktivieren oder anonymisieren · ☐ Cloudflare-Logs (Logpush) für diese Pfade prüfen | 4 |
| R2 | Unbefugte Beschäftigte (z. B. Vorgesetzte, Admins) lesen Meldungen | Meldende, Beschuldigte | 3 | 4 | 12 | ✔ Rollenmodell „Hinweis Meldestelle“ · ✔ Web-API-User ohne Leserecht · ✔ E-Mails ohne Inhalte · ✔ Änderungsprotokoll · ☐ 2FA für Meldestelle/Admins · ☐ Zahl der System-Manager minimieren, Zugriffe regelmäßig prüfen | 4 |
| R3 | Fremde erlangen Zugriff auf ein Postfach (Erraten/Brute Force) | Meldende | 2 | 4 | 8 | ✔ 24-stelliger Zufallsschlüssel (Alphabet 32 Zeichen, ca. 120 Bit) · ✔ PBKDF2-Hash · ✔ einheitliche Fehlerantwort · ✔ Drosselung · ✔ Sperre der Fall-Nummer nach 10 Fehlversuchen für 30 Min. mit Benachrichtigung der Meldestelle | 2 |
| R4 | Kompromittierung von Server, Datenbank oder Backups | alle | 2 | 4 | 8 | ✔ TLS · ☐ Datenbank- und Backup-Verschlüsselung · ☐ Patch-Management Frappe/Next.js · ☐ Backup-Zugriff beschränkt und protokolliert | 4 |
| R5 | Offenlegung gegenüber Drittanbietern (Cloudflare mit TLS-Terminierung, Dienstleister mit Fernwartung) bzw. Drittlandzugriff | alle | 2 | 3 | 6 | ✔ Transparenz in den Datenschutzhinweisen · ✔ Cloudflare DPF-Zertifizierung geprüft (13.09.2026) · ☐ DPA-Einbeziehung dokumentieren · ☐ AV-Verträge mit Hosting und IT Engineers · ☐ optional: Backoffice-API nicht über Cloudflare-Proxy, sondern direkt per TLS aus dem Website-Netz | 3 |
| R6 | Fristen (7 Tage / 3 Monate) werden versäumt → Rechtsverstoß, Vertrauensverlust | Meldende | 2 | 3 | 6 | ✔ Fristfelder automatisch · ✔ Benachrichtigung bei Eingang/Nachricht · ☐ Vertretungsregelung · ☐ wöchentliche Fristenkontrolle | 2 |
| R7 | Beschuldigte Personen werden zu Unrecht belastet, Daten zu lange gespeichert | Beschuldigte | 2 | 3 | 6 | ✔ Prüfung der Stichhaltigkeit dokumentiert · ✔ Löschautomatik · ✔ Information nach Art. 14 mit dokumentiertem Aufschub | 3 |
| R8 | Meldung geht technisch verloren (Backend-Ausfall) | Meldende | 2 | 3 | 6 | ✔ Eingaben bleiben im Formular bei Fehler · ✔ Hinweis auf Postweg und externe Meldestelle · ✔ Monitoring-Endpunkt `/api/hinweis/health` · ☐ externen Uptime-Check darauf einrichten | 3 |
| R9 | Beschuldigte oder Dritte identifizieren die meldende Person über den Inhalt | Meldende | 3 | 3 | 9 | ✔ Warnhinweis im Formular · ✔ Vertraulichkeitspflicht § 8 · ☐ Schulung der Meldestelle zur Anonymisierung bei Weitergabe | 6 |
| R10 | Missbrauch (Spam, gezielte Falschmeldungen) | Beschuldigte, Unternehmen | 2 | 2 | 4 | ✔ Honeypot, Mindestdauer, Drosselung · ✔ Prüfung vor Folgemaßnahmen | 2 |

## 5. Ergebnis

Vor Umsetzung der offenen Maßnahmen (☐) besteht in R1, R2 und R4 ein **hohes Risiko**. Nach ihrer Umsetzung wird das Restrisiko als **vertretbar (mittel bis gering)** bewertet. Eine vorherige Konsultation der Aufsichtsbehörde nach Art. 36 DSGVO ist dann nicht erforderlich.

**Voraussetzung für den Produktivbetrieb:** mindestens diese Maßnahmen umsetzen:
- ☐ R1 – Access-Logs für `/api/hinweis*` deaktivieren oder anonymisieren
- ☐ R2 – 2FA und Rollenprüfung
- ☐ R4 – verschlüsselte Backups
- ☐ R5 – AV-Verträge und Cloudflare-Prüfung

## 6. Maßnahmenplan

| Maßnahme | Verantwortlich | Termin | Status |
|---|---|---|---|
| Frappe-Paket installieren und Rollen einrichten (docs/frappe-hinweisgebersystem/README.md) | `[OFFEN: Backend-Dienstleister]` | `[OFFEN]` | ☐ |
| Access-Logs für `/api/hinweis*` deaktivieren/anonymisieren; Cloudflare-Logs prüfen | `[OFFEN]` | vor Go-live | ☐ |
| 2FA für Meldestelle und Administratoren | `[OFFEN]` | vor Go-live | ☐ |
| Backup-Verschlüsselung und Zugriffskonzept | `[OFFEN]` | vor Go-live | ☐ |
| AV-Verträge: Hosting Website, Hosting Backoffice, IT Engineers, Cloudflare (DPA/DPF) | `[OFFEN]` | vor Go-live | ☐ |
| Telefonischen Meldeweg einrichten und in `src/data/hinweisgeber.js` (`MELDESTELLE.telefon`) eintragen | `[OFFEN]` | `[OFFEN]` | ☐ |
| Meldestelle benennen, Vertretung, Schulung, Verpflichtung auf Vertraulichkeit | Geschäftsführung | `[OFFEN]` | ☐ |
| Beschäftigte über Meldewege informieren (§ 13 Abs. 2 HinSchG) | Geschäftsführung / HR | `[OFFEN]` | ☐ |
| Fehlversuch-Sperre Postfach im Backend | umgesetzt in `api.py` | 13.09.2026 | ✔ |
| Monitoring: externen Uptime-Check auf `https://www.oekovolt.de/api/hinweis/health` (erwartet HTTP 200) | `[OFFEN]` | nach Go-live | ☐ |
| Offene Fälle aus IntegrityLine übernehmen/abschließen, Datenexport und Löschbestätigung des Anbieters archivieren | Meldestelle | `[OFFEN]` | ☐ |
| Überprüfung dieser DSFA | DSB | 12 Monate nach Go-live | ☐ |

## 7. Hinweis

Dieser Entwurf ist aus der technischen Umsetzung abgeleitet und ersetzt keine Rechtsberatung. Die/der Datenschutzbeauftragte sollte die Bewertung prüfen, und die offenen Felder müssen mit den tatsächlichen Gegebenheiten ergänzt werden.
