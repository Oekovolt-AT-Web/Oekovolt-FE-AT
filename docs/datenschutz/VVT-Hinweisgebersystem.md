# VVT (Art. 30 Abs. 1 DSGVO) – Internes Hinweisgebersystem nach dem HSchG

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 (österreichische Fassung; ersetzt den deutschen Entwurf vom
> 13.09.2026 nach HinSchG) · Version 2.0-AT · Freigabe Geschäftsführung: `[OFFEN: Name, Datum]` ·
> Prüfung Datenschutzberatung/Jurist: `[OFFEN]`
>
> Rechtsgrundlage ist das österreichische **HinweisgeberInnenschutzgesetz (HSchG), BGBl. I Nr. 6/2023**. Paragraphen
> geprüft an der konsolidierten RIS-Fassung vom 11.01.2024. `[OFFEN: RIS war am 30.09.2026 nicht erreichbar (HTTP 503) –
> auf spätere Novellen prüfen.]`

| | |
|---|---|
| **Bezeichnung** | Internes Hinweisgebersystem (interne Stelle nach §§ 11, 13 HSchG) |
| **Betriebszustand** | Schalter `HINWEIS_INTERN` (Website, `src/data/hinweisgeber.js`). **Aus** (Standard, Stand 30.09.2026): Meldekanal ist das externe Portal `https://oekovolt.integrityline.com/`, `/hinweisgebersystem` leitet dorthin um, `/api/hinweis*` antwortet 503. **An** (`=1`): eigenes System unter `https://www.oekovolt.com/hinweisgebersystem`. Umstellung nach `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md`. |
| **Fachlich verantwortlich** | Interne Stelle (§ 5 Z 6 HSchG) – `[OFFEN: Name/Funktion der benannten Person(en) und der Vertretung]` |
| **Zugehörige Dokumente** | [DSFA-Hinweisgebersystem.md](DSFA-Hinweisgebersystem.md) · [Meldestelle-Handbuch.md](Meldestelle-Handbuch.md) · [Beschaeftigteninformation-HinSchG.md](Beschaeftigteninformation-HinSchG.md) (Inhalt nach HSchG) |

---

## 1. Verantwortlicher (Art. 30 Abs. 1 lit. a DSGVO; § 8 Abs. 4 Z 2 und Abs. 8 HSchG)

Ökovolt Solartechnik GmbH, Gewerbegebiet 10, 5121 Ostermiething, Österreich · FN 375708m, Landesgericht Ried im Innkreis ·
Geschäftsführer Andreas Wegscheider · +43 6278 71030 · office@oekovolt.com (Quelle: `src/lib/site.js`).
Nach § 8 Abs. 4 Z 2 HSchG ist der Rechtsträger, dem die interne Stelle angehört, Verantwortlicher.

**Datenschutzbeauftragte/r:** `[OFFEN: siehe Deckblatt 00-Uebersicht-VVT.md]`

**Pflicht zur Einrichtung:** § 11 Abs. 1 HSchG verpflichtet Unternehmen mit **50 oder mehr Arbeitnehmer:innen**
(bei schwankender Zahl: Durchschnitt des Vorjahres, § 11 Abs. 2). `[OFFEN: Beschäftigtenzahl der Ökovolt Solartechnik GmbH
bestätigen. Liegt sie darunter, besteht keine Pflicht; das System kann freiwillig betrieben werden, die Rechtsgrundlage
ist dann Art. 6 Abs. 1 lit. f DSGVO (siehe 2.).]`

## 2. Zwecke und Rechtsgrundlagen (lit. b)

**Zwecke**
1. Entgegennahme von Hinweisen auf Rechtsverletzungen in den Bereichen des § 3 HSchG – schriftlich (Online-Formular,
   Post) sowie in einer Zusammenkunft auf Ersuchen (§ 13 Abs. 5).
2. Eingangsbestätigung und Kommunikation mit der hinweisgebenden Person, auch anonym über das Postfach.
3. Prüfung der Stichhaltigkeit (§ 13 Abs. 6) und Folgemaßnahmen (§ 5 Z 3).
4. Dokumentation der Hinweise (§ 9).
5. Schutz der Identität von Hinweisgebenden und betroffenen Personen (§ 7) und Schutz vor Vergeltungsmaßnahmen (§ 20).

**Rechtsgrundlagen**
- Art. 6 Abs. 1 lit. c DSGVO i. V. m. § 8 Abs. 1 und § 11 HSchG (Pflicht zur Einrichtung).
- Hinweise außerhalb des Geltungsbereichs des HSchG bzw. bei freiwilligem Betrieb: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
  Interesse an der Aufdeckung und Verhinderung von Rechtsverstößen). So beschreibt es auch die Website (`DATENSCHUTZ` in
  `src/data/hinweisgeber.js`).
- Besondere Kategorien (Art. 9 DSGVO): § 8 Abs. 5 HSchG (unbedingt erforderlich, erhebliches öffentliches Interesse,
  wirksame Schutzmaßnahmen) i. V. m. Art. 9 Abs. 2 lit. g DSGVO.
- Daten über strafbare Handlungen (Art. 10 DSGVO): § 8 Abs. 6 HSchG – nur bei unbedingter Erforderlichkeit, **schriftlich
  zu dokumentieren**.
- Nicht benötigte Daten dürfen nicht erhoben werden bzw. sind unverzüglich zu löschen (§ 8 Abs. 10 HSchG).

## 3. Betroffene Personen und Datenkategorien (lit. c)

| Betroffene | Datenkategorien (Felder des DocType „Hinweis“) |
|---|---|
| Hinweisgebende Personen (§ 2 Abs. 1, 2 HSchG: Arbeitnehmer:innen, überlassene Arbeitskräfte, Bewerber:innen, Praktikant:innen, Selbständige, Organmitglieder, Beschäftigte von Auftragnehmern/Lieferanten, Anteilseigner) | nur wenn nicht anonym: `name_meldende`, `email`, `telefon`; `beziehung` (Auswahl, „Keine Angabe“ möglich); Inhalt: `kategorie`, `betreff`, `beschreibung`, `zeitraum`, `ort`, `beteiligte`, `bereits_gemeldet`; Postfach-Nachrichten (Kindtabelle „Hinweis Nachricht“) |
| Von einem Hinweis betroffene Personen (Beschuldigte) | Name, Funktion, Beschreibung des Verhaltens, ggf. Daten nach Art. 10 DSGVO |
| Personen im Umkreis, Unterstützende, Zeug:innen (§ 2 Abs. 3 HSchG) | Name, Funktion, Rolle im Sachverhalt |
| Von Folgemaßnahmen betroffene Personen (§ 8 Abs. 1 Z 4) | Angaben in `folgemassnahmen` und internen Notizen |
| Beschäftigte der internen Stelle | Benutzerkonto, Absender „Meldestelle“ in Nachrichten, Änderungsprotokoll |

- **Verwaltungsfelder:** `referenz` (Fall-Nummer `HW-XXXX-XXXX`), `status`, `quelle` (Website, Post, Telefon, Persönliches
  Gespräch), `eingegangen_am`, `bestaetigung_faellig`, `eingang_bestaetigt_am`, `rueckmeldung_faellig`, `stichhaltig`,
  `abgeschlossen_am`, `loeschung_faellig`, `aufbewahrung_verlaengert`, `aufbewahrung_grund`, `ungelesen`.
- **Zugangsschlüssel:** nur als Hash `zugang_hash` (PBKDF2-HMAC-SHA256, 200.000 Iterationen, 16 Byte Salt je Fall).
- **Nicht erhoben:** IP-Adresse, User-Agent, Geräte-Kennungen, Cookies (die Website leitet serverseitig weiter und
  übermittelt keine Metadaten, `src/lib/hinweisApi.js`); keine Dateianhänge im Online-Formular.
- **Mögliche besondere Kategorien:** nur, soweit sie in Freitexten stehen.

## 4. Empfänger (lit. d)

**Intern:** ausschließlich die Personen der internen Stelle – Rolle **„Hinweis Meldestelle“** (Lesen, Schreiben, Anlegen,
Bericht, Drucken; kein Löschen, kein Export, kein Teilen, keine E-Mail aus dem Desk). Weitere Stellen (z. B.
Geschäftsführung nach § 13 Abs. 3) nur, soweit für Folgemaßnahmen erforderlich, und ohne Identität der hinweisgebenden
Person (§ 7 Abs. 1, 2). Technisch sehen Konten mit **System Manager/Administrator** alle Daten.

**Extern:** Verwaltungsbehörden, Gerichte, Staatsanwaltschaft – die Identität nur in den Fällen des § 7 Abs. 3–5 HSchG;
externe Rechtsberatung zur Aufklärung `[OFFEN: falls vorgesehen]`.

**Auftragsverarbeiter (Art. 28 DSGVO)** – die Pflichten zum Schutz der Hinweisgebenden gelten auch für sie
(§ 8 Abs. 4 letzter Satz HSchG):

| Dienstleister | Leistung | Ort (Beleg) | AV-Vertrag |
|---|---|---|---|
| Hosting der Website (`/api/hinweis*`) | Weiterleitung der Meldungen, Postfach | `[OFFEN]` | `[OFFEN]` |
| Hosting des Backoffice `backoffice.oekovolt.com` | Datenbank und Anwendung | Hetzner Online GmbH, Nürnberg (DNS/RIPE-RDAP, 30.09.2026) | `[OFFEN]` |
| E-Mail-Versand des Backoffice | Benachrichtigungen an die interne Stelle **ohne Inhalte** (nur Anlass und Fall-Nummer) | `[OFFEN]`; Postfächer vermutlich Microsoft 365 (MX-Eintrag) | `[OFFEN]` |
| Dienstleister mit Administrationszugriff | Wartung Website/Backoffice | `[OFFEN: wer, Sitz, Zugriffsumfang]` | `[OFFEN]` |
| **Solange `HINWEIS_INTERN` aus ist:** Betreiber des Portals `oekovolt.integrityline.com` | vollständiger Meldekanal | `[OFFEN: Vertragspartner, Sitz, Serverstandort]` | `[OFFEN: laut docs/AT-UEBERGABE.md offen]` |

## 5. Übermittlung in Drittländer (lit. e)

Für das eigene System keine vorgesehen: Website und Backoffice laufen nach DNS-Stand vom 30.09.2026 auf Servern in Deutschland;
ein CDN mit TLS-Terminierung (wie Cloudflare in der deutschen Fassung) war nicht erkennbar.
`[OFFEN: Standort der neuen Website bestätigen; E-Mail-Dienst (Microsoft 365) auf Drittlandbezug prüfen – die
Benachrichtigungen enthalten nur die Fall-Nummer; Fernwartung von außerhalb des EWR ausschließen oder absichern.]`

## 6. Fristen und Löschung (lit. f)

| Vorgabe | Gesetz | Umsetzung im Backend (`hinweis.py`, `api.py`) | Bewertung |
|---|---|---|---|
| Eingangsbestätigung schriftlicher Hinweise spätestens nach **7 Kalendertagen** | § 9 Abs. 1 HSchG (Ausnahmen: ausdrücklicher Verzicht oder Gefährdung der Identität) | `bestaetigung_faellig = Eingang + 7 Tage` | passt; Kommentar im Code nennt fälschlich § 13 |
| Bestätigung von Ergänzungen/Berichtigungen **auf Verlangen** binnen 7 Kalendertagen | § 13 Abs. 8 HSchG | keine eigene Frist | `[OFFEN: im Handbuch geregelt, technisch nicht überwacht]` |
| Zusammenkunft auf Ersuchen binnen **14 Kalendertagen** | § 13 Abs. 5 HSchG | nicht abgebildet | `[OFFEN: Prozess im Handbuch; ggf. Feld „Gespräch erbeten am“]` |
| Rückmeldung spätestens **3 Monate nach Entgegennahme** | § 13 Abs. 9 HSchG | `rueckmeldung_faellig` = Eingang + 3 Monate + 7 Tage; nach Bestätigung **Bestätigung + 3 Monate** | **Abweichung:** Frist ist nach dem Gesetz ab Entgegennahme zu rechnen. `[OFFEN: Backend auf „Eingang + 3 Monate“ ändern; Website-Texte (ABLAUF, FAQ_INFO in src/data/hinweisgeber.js) sagen ebenfalls „nach der Eingangsbestätigung“]` |
| Aufbewahrung personenbezogener Daten **5 Jahre ab letztmaliger Verarbeitung oder Übermittlung**, darüber hinaus für bereits eingeleitete Verfahren; danach Löschung | § 8 Abs. 11 HSchG | `loeschung_faellig = abgeschlossen_am + 5 Jahre`; täglicher Job `loesche_abgelaufene_hinweise` löscht Fall und Versionshistorie; Ausnahme „Aufbewahrung verlängert“ mit Grund | `[OFFEN: Gleichsetzung „Abschluss“ = „letztmalige Verarbeitung“ bestätigen. Hinweis: Das Gesetz verlangt die Aufbewahrung („sind … aufzubewahren“) – eine frühere Löschung ganzer Fälle ist nicht vorgesehen; unnötige Einzeldaten sind dagegen sofort zu löschen (§ 8 Abs. 10).]` |
| **Protokolldaten** über Verarbeitungsvorgänge (Änderungen, Abfragen, Übermittlungen) aufzeichnen und bis **3 Jahre nach Ende der Aufbewahrungspflicht** aufbewahren | § 8 Abs. 12 HSchG; § 9 Abs. 6 (Zugang protokollieren und beschränken) | Frappe-Änderungsprotokoll (`track_changes`) – wird beim Löschen **mitgelöscht**; Lesezugriffe werden nicht protokolliert (`track_views` nicht gesetzt) | **Abweichung.** `[OFFEN: inhaltsfreies Protokoll (wer, wann, welcher Fall, welche Aktion) einrichten, das die Löschung um 3 Jahre überdauert; Lesezugriffe protokollieren (z. B. Frappe „Track Views“ oder eigenes Zugriffsprotokoll).]` |
| Benachrichtigungs-E-Mails | – | ohne Inhalte | `[OFFEN: Aufbewahrung im Postfach festlegen, z. B. 30 Tage]` |
| Unvollständige Meldungen | – | nicht gespeichert (Speicherung erst beim Absenden) | passt |
| Datensicherungen | – | `[OFFEN: Rotationszyklus]` | gelöschte Fälle verschwinden erst mit Ablauf der Backup-Rotation |

## 7. Technische und organisatorische Maßnahmen (lit. g, Art. 32 DSGVO, § 9 Abs. 6, § 11 Abs. 1 letzter Satz HSchG)

**Vertraulichkeit (umgesetzt)**
- Eigener API-Benutzer mit Rolle „Hinweis Webformular“ **ohne Leserechte**; Datensätze werden nur über freigegebene
  Methoden (`create_hinweis`, `get_postfach`, `add_nachricht`, `ping`) geschrieben bzw. gelesen.
- Zugangsschlüssel: 24 Zeichen aus 32 Zeichen (ca. 120 Bit), nur als PBKDF2-Hash gespeichert; unbekannte Fall-Nummer und
  falscher Schlüssel sind nicht unterscheidbar (gleiche Antwort, gleiche Rechenzeit); Sperre der Fall-Nummer nach
  10 Fehlversuchen für 30 Minuten mit inhaltsfreier Benachrichtigung der internen Stelle.
- Keine IP-Adressen und Metadaten; das Backoffice sieht nur den Website-Server. Keine Meldungsinhalte in Logs und
  Fehlermeldungen.
- Interne Notizen (`intern`) erscheinen nicht im Postfach.
- Kein Zwischenspeichern von Entwürfen im Browser; Heatmap, Google Analytics und Umami schließen `/hinweisgebersystem*`
  aus (`src/lib/heatmap.js`, `GoogleAnalytics.js`, `Umami.js`).

**Vertraulichkeit (offen)**
- `[OFFEN: 2FA für alle Konten mit „Hinweis Meldestelle“ und „System Manager“]`
- `[OFFEN: Zahl der System-Manager-/Administrator-Konten minimieren und dokumentieren]`
- `[OFFEN: Ohne HINWEIS_API_KEY/SECRET verwendet die Website den allgemeinen API_KEY (src/lib/hinweisApi.js) – im
  Livebetrieb unzulässig, eigene Zugangsdaten sind Pflicht]`
- `[OFFEN: Access-Logs des Website-Hostings für /api/hinweis* deaktivieren oder IP-anonymisieren; Frappe Error Log/Request Log prüfen]`

**Integrität:** durchgehend TLS; Änderungsprotokoll; serverseitige Validierung und Längenbegrenzung (Betreff 140,
Beschreibung 20.000, Nachricht 10.000 Zeichen); Kategorien-Allowlist.

**Verfügbarkeit:** Drosselung ohne IP-Bezug (Website: 40 Meldungen bzw. 120 Postfach-Abrufe je 10 Minuten, global);
Honeypot und Mindestausfülldauer (4 Sekunden); Health-Check `/api/hinweis/health`.
`[OFFEN: Backup-Konzept mit Verschlüsselung und Wiederherstellungstest; externer Uptime-Monitor]`

**Organisatorisch:** Benennung der internen Stelle; Unparteilichkeit und Unvoreingenommenheit (§ 13 Abs. 2);
Verschwiegenheit (§ 7); Schulung `[OFFEN: Nachweis]`; Information der Beschäftigten nach § 10 Abs. 1 HSchG
`[OFFEN: Aushang/Intranet mit der Beschäftigteninformation]`.

## 8. Datenschutz-Folgenabschätzung

§ 8 Abs. 13 HSchG: Die Verarbeitungen nach § 8 Abs. 1–12 beruhen auf einer unionsrechtlichen Grundlage und sind bereits
Gegenstand einer allgemeinen DSFA; sie erfüllen die Voraussetzungen des **Art. 35 Abs. 10 DSGVO für den Entfall der DSFA**.
Wegen der Eigenentwicklung wird dennoch eine freiwillige Risikobewertung empfohlen: [DSFA-Hinweisgebersystem.md](DSFA-Hinweisgebersystem.md).

## 9. Informationspflichten und Betroffenenrechte

- **Hinweisgebende:** Datenschutzhinweise unter `/hinweisgebersystem#datenschutz` (Texte `DATENSCHUTZ` in
  `src/data/hinweisgeber.js`); Datenschutzerklärung Punkt 23.
- **Betroffene Personen:** Die Rechte auf Information (Art. 13, 14), Auskunft, Berichtigung, Löschung, Einschränkung,
  Widerspruch und Benachrichtigung bei Datenschutzverletzungen (Art. 34) finden **keine Anwendung**, solange und soweit
  dies zum Schutz der Identität oder zur Erreichung der Zwecke erforderlich ist, insbesondere während eines Verfahrens;
  **Information und Auskunft zum Hinweis sind in dieser Zeit zu unterlassen** (§ 8 Abs. 9 HSchG). Danach Information nach
  Art. 14 DSGVO (Vorlage D im Handbuch). Beginn und Ende der Beschränkung sind im Fall zu dokumentieren.
- **Information der Beschäftigten** über interne und externe Hinweisgebung: § 10 Abs. 1 HSchG.
