# Verzeichnis von Verarbeitungstätigkeiten – Übersicht (Art. 30 Abs. 1 DSGVO)

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026. Dieser Entwurf wurde aus der tatsächlichen Umsetzung im Code
> abgeleitet (Website `src/`, Backoffice `Import-Backend-Frappe/`) und ersetzt keine Rechtsberatung.
> Mit `[OFFEN: …]` markierte Punkte muss das Unternehmen vor der Freigabe klären bzw. ergänzen.
>
> **Freigabe Geschäftsführung:** `[OFFEN: Name, Datum]` · **Prüfung Datenschutzberatung/Jurist:** `[OFFEN]`

Diese Datei ist das Deckblatt des Verzeichnisses. Sie enthält die gemeinsamen Angaben (Verantwortlicher,
Aufsichtsbehörde, Rechtsrahmen, Systeme, Auftragsverarbeiter) und die Liste aller Einträge. Die Einträge selbst stehen
in den Dateien dieses Ordners.

---

<a id="verantwortlicher"></a>

## 1. Verantwortlicher (Art. 30 Abs. 1 lit. a DSGVO)

| Angabe | Inhalt |
|---|---|
| Firma | **Ökovolt Solartechnik GmbH** |
| Anschrift | Gewerbegebiet 10, 5121 Ostermiething, Oberösterreich, Österreich |
| Firmenbuch | FN 375708m, Landesgericht Ried im Innkreis |
| UID | ATU67027148 |
| Geschäftsführer | Andreas Wegscheider |
| Telefon / E-Mail | +43 6278 71030 · office@oekovolt.com (Betreff „Datenschutz“) |
| Website | https://www.oekovolt.com |
| Vertreter in der Union (Art. 27) | entfällt (Sitz in der EU) |
| Datenschutzbeauftragte/r | `[OFFEN: Benennungspflicht nach Art. 37 DSGVO prüfen. Das DSG sieht keine eigene Schwelle wie § 38 BDSG vor; Pflicht nur bei Kerntätigkeit mit umfangreicher, regelmäßiger und systematischer Überwachung oder umfangreicher Verarbeitung von Art.-9/10-Daten. Wenn benannt: Name und Kontakt eintragen.]` |

**Quelle:** `src/lib/site.js` (Registerdaten laut Dateikopf am 28.09.2026 über WKO Firmen A–Z, FirmenABC und das
Firmenbuch verifiziert). Bei Änderungen dort und hier gleichzeitig anpassen.

**Unternehmensgruppe:** Gesellschafter laut `src/lib/site.js` (Stand Firmenbuch/FirmenABC 09/2026): Andreas Wegscheider
(51 %), Salzburg AG für Energie, Verkehr und Telekommunikation (49 %). Deutsche Schwestergesellschaft: ÖKOVOLT GmbH
Solartechnik, Türkheim (DE). Die Datenschutzerklärung (Punkt 18) nennt eine gemeinsame Nutzung von IT-Systemen mit der
Schwester auf Grundlage von Art. 26/28 DSGVO. `[OFFEN: Gibt es tatsächlich gemeinsame Systeme oder Admin-Zugriffe der
DE-Gesellschaft auf das AT-Backoffice? Falls ja: Vereinbarung nach Art. 26 bzw. 28 DSGVO abschließen und hier eintragen.
Laut docs/AT-UEBERGABE.md noch offen.]`

## 2. Aufsichtsbehörde

**Österreichische Datenschutzbehörde (DSB)** · Barichgasse 40–42, 1030 Wien · Telefon +43 1 52 152-0 ·
dsb@dsb.gv.at · https://www.dsb.gv.at (Kontaktdaten abgerufen am 30.09.2026).
Beschwerderecht: Art. 77 DSGVO, § 24 DSG. Meldung von Datenschutzverletzungen: Art. 33 DSGVO an die DSB binnen 72 Stunden.

## 3. Rechtsrahmen (Österreich)

| Norm | Bedeutung für dieses Verzeichnis |
|---|---|
| DSGVO (VO (EU) 2016/679) | Art. 5, 6, 9, 10, 13, 14, 28, 30, 32, 35 |
| Datenschutzgesetz (DSG), BGBl. I Nr. 165/1999 | § 1 Grundrecht auf Datenschutz (schützt nach österreichischem Verständnis grundsätzlich auch juristische Personen, siehe VVT-Kundenbuehne.md), § 24 Beschwerde |
| Telekommunikationsgesetz 2021 (TKG 2021) | § 165 Abs. 3: Speichern/Auslesen im Endgerät nur mit Einwilligung, außer unbedingt erforderlich (Cookies, Web-Push); § 174: unerbetene Anrufe und elektronische Post |
| HinweisgeberInnenschutzgesetz (HSchG), BGBl. I Nr. 6/2023 | Hinweisgebersystem, insbesondere § 7 (Identitätsschutz), § 8 (Datenschutz, Aufbewahrung, Protokolldaten), § 9 (Dokumentation, 7-Tage-Bestätigung), § 11 (Pflicht ab 50 Arbeitnehmer:innen), § 13 (Verfahren, 3-Monats-Rückmeldung) – geprüft an der konsolidierten Fassung vom 11.01.2024 (RIS-Ausdruck). `[OFFEN: RIS war am 30.09.2026 nicht erreichbar (HTTP 503); spätere Novellen, insbesondere nach der Evaluierung 2026 (§ 28 Abs. 3 HSchG), im RIS prüfen.]` |
| Bundesabgabenordnung (BAO) § 132, Unternehmensgesetzbuch (UGB) § 212 | 7 Jahre Aufbewahrung von Büchern und Geschäftsunterlagen |
| ABGB § 1489 | 3 Jahre Verjährung von Schadenersatzansprüchen (Aufbewahrung zur Rechtsverteidigung) |
| Urheberrechtsgesetz (UrhG) § 78 | Bildnisschutz (Mediathek, Fotos von Personen) |
| DSFA-Verordnung / DSFA-Ausnahmenverordnung der DSB | Positiv- und Negativliste zu Art. 35 DSGVO `[OFFEN: Fundstellen im RIS prüfen und jeden Eintrag gegen die Listen abgleichen]` |

## 4. Einträge dieses Verzeichnisses

| Nr. | Verarbeitungstätigkeit | Datei | Rechtsgrundlage (Kurz) | Speicherdauer laut Code | Betriebsstatus 30.09.2026 |
|---|---|---|---|---|---|
| 1 | Kontakt-, Angebots- und Solarrechner-Anfragen (inkl. Service, PV Award, Sponsoring, Elektro-Partner) | [VVT-Anfragen.md](VVT-Anfragen.md) | Art. 6 Abs. 1 lit. b, f | 24 Monate ab Anlage, dann Anonymisierung | gebaut, Backend `oekovolt_app` |
| 2 | Rückruf und Online-Terminbuchung | [VVT-Rueckruf-Termin.md](VVT-Rueckruf-Termin.md) | Art. 6 Abs. 1 lit. b, a (Anruf), f | 24 Monate nach Termindatum, dann Anonymisierung | gebaut |
| 3 | Unterlagen per Smartphone und KI-Auswertung | [VVT-Unterlagen-KI.md](VVT-Unterlagen-KI.md) | Art. 6 Abs. 1 lit. b, a; Art. 49 Abs. 1 lit. a | 12 Monate; unvollständige Vorgänge 24 h | gebaut |
| 4 | Klick- und Scroll-Heatmap | [VVT-Heatmap.md](VVT-Heatmap.md) | Art. 6 Abs. 1 lit. a, § 165 Abs. 3 TKG 2021 | nur Monatszählwerte, 14 Monate | gebaut, aktiv nach Einwilligung |
| 5 | Besucherstatistik (Umami, Google Analytics 4) und Kampagnen-Zuordnung | [VVT-Statistik-Herkunft.md](VVT-Statistik-Herkunft.md) | Art. 6 Abs. 1 lit. f bzw. a | siehe Eintrag | per Umgebungsvariable schaltbar |
| 6 | Lastgang-Analyse im Browser | [VVT-Lastgang-Analyse.md](VVT-Lastgang-Analyse.md) | keine Verarbeitung durch Ökovolt | keine | Rechenlogik gebaut, Oberfläche noch nicht eingebunden |
| 7 | Mediathek (selbst gehostete Kurzvideos) | [VVT-Mediathek.md](VVT-Mediathek.md) | Art. 6 Abs. 1 lit. a bzw. f (abgebildete Personen) | bis Widerruf/Entfernung | gebaut |
| 8 | Kundenbühne der Referenzprojekte | [VVT-Kundenbuehne.md](VVT-Kundenbuehne.md) | Art. 6 Abs. 1 lit. f, a (Zitat, Logo) | solange Referenz veröffentlicht | gebaut |
| 9 | Web-Push, Fediverse, RSS | [VVT-Kanaele.md](VVT-Kanaele.md) | Art. 6 Abs. 1 lit. a, b | bis Abmeldung | gebaut |
| 10 | Internes Hinweisgebersystem (HSchG) | [VVT-Hinweisgebersystem.md](VVT-Hinweisgebersystem.md), [DSFA](DSFA-Hinweisgebersystem.md) | Art. 6 Abs. 1 lit. c i. V. m. § 8 HSchG | 5 Jahre nach Abschluss | Schalter `HINWEIS_INTERN` aus → derzeit IntegrityLine |

**Noch ohne eigenen Eintrag** (auf der Website vorhanden, hier nicht ausgearbeitet): Server-Logdateien und Hosting,
Cookie-Einwilligung (Cookie `cookieConsent`, 1 Jahr), Google Maps und OpenStreetMap (nach Einwilligung),
Standort-Check und PV-Prognose (Adresse/Koordinaten serverseitig an Nominatim, Open Topo Data, PVGIS bzw. GeoSphere Austria
Data Hub, ohne Speicherung), Bewerbungen, Kunden-, Projekt- und Monitoringdaten, Energie live, Info-Bildschirme,
Beschäftigtendaten (Backoffice-Konten, Kalender der Terminberatung).
`[OFFEN: Einträge für diese Verarbeitungen ergänzen; insbesondere Kunden-/Auftragsdaten und Beschäftigtendaten sind
Pflichtbestandteile eines vollständigen Verzeichnisses.]`

## 5. Systeme und Auftragsverarbeiter (belegt)

| System | Beleg | Anbieter / Ort | AV-Vertrag Art. 28 |
|---|---|---|---|
| Backoffice `backoffice.oekovolt.com` (Frappe v15, MariaDB) | DNS → 178.105.87.159; RIPE-RDAP: Netz „CLOUD-NBG1“, Hetzner Online GmbH, Land DE (abgerufen 30.09.2026, https://rdap.db.ripe.net/ip/178.105.87.159) | Hetzner Online GmbH, Rechenzentrum Nürnberg (DE) | `[OFFEN: Vertragspartner (Ökovolt oder Dienstleister?), AV-Vertrag ablegen]` |
| Website `www.oekovolt.com` | DNS → 178.105.80.143, ebenfalls Hetzner „CLOUD-NBG1“ (DE), Server nginx. Am 30.09.2026 liefert die Adresse noch die bisherige Website aus (`/api/hinweis/health` → 404). | `[OFFEN: Hosting der neuen Next.js-Website bestätigen]` | `[OFFEN]` |
| E-Mail `@oekovolt.com` | MX-Eintrag `oekovolt-com.mail.protection.outlook.com` (abgerufen 30.09.2026) → Microsoft 365 / Exchange Online | Microsoft Ireland Operations Ltd. `[OFFEN: Vertragspartner, Datenregion (EU Data Boundary), Drittlandbezug USA (Data Privacy Framework) bestätigen]` | `[OFFEN]` |
| Ausgehende E-Mails des Backoffice | Frappe „Email Account – Default Outgoing“ (Installationsanleitung `Import-Backend-Frappe/README.md`, Schritt 6) | `[OFFEN: Konto/Relay eintragen]` | `[OFFEN]` |
| Statistik-Server Umami | `UMAMI_SCRIPT_URL=https://statistik.oekovolt.com/script.js` (Vorlage `Import-Backend-Frappe/installation/website_env.txt`); `statistik.oekovolt.com` hat am 30.09.2026 keinen DNS-Eintrag → derzeit nicht in Betrieb | `[OFFEN]` | `[OFFEN]` |
| Anthropic, PBC (USA) | nur KI-Auswertung nach Einwilligung, `solar_lead/ki.py` | USA | `[OFFEN: DPA mit SCC]` |
| Google Ireland Ltd. | Google Analytics 4 (nur mit `NEXT_PUBLIC_GA_ID` und Einwilligung), Google Maps (nach Einwilligung) | IE / USA | `[OFFEN]` |
| IntegrityLine (Portal `oekovolt.integrityline.com`) | aktueller Meldekanal, solange `HINWEIS_INTERN` nicht gesetzt ist | `[OFFEN: Vertragspartner, Sitz, AV-Vertrag – laut docs/AT-UEBERGABE.md offen]` | `[OFFEN]` |
| CloudTalk s.r.o. | Code vorhanden (`src/lib/rueckrufApi.js`), aber **nirgends eingebunden** – der Rückruf läuft über die Terminbuchung | nicht im Einsatz | entfällt, solange nicht eingebunden |
| Dienstleister Entwicklung/Wartung | `[OFFEN: Wer hat Administrationszugriff auf Website und Backoffice (z. B. Solensa GmbH laut docs/AT-BRIEFING.md, externe Entwickler)? Sitz und Zugriffsumfang eintragen.]` | `[OFFEN]` | `[OFFEN]` |

**Kein Cloudflare:** Anders als in der deutschen Fassung zeigen die DNS-Einträge von `www` und `backoffice` am 30.09.2026
direkt auf Hetzner-Adressen; ein CDN mit TLS-Terminierung war nicht erkennbar. `[OFFEN: nach dem Umzug der neuen Website
erneut prüfen]`

## 6. Gemeinsame technische und organisatorische Maßnahmen (Art. 32 DSGVO)

Umgesetzt im Code:
- Übertragung nur per HTTPS; die Website spricht das Backoffice ausschließlich serverseitig an (`/api/method/…`).
- Je Zweck ein eigener API-Benutzer mit genau einer Rolle (`Import-Backend-Frappe/README.md`, Schritt 5):
  „Website API“, „Kontakt Webformular“, „Kanal Webservice“, „Hinweis Webformular“. Die Web-Rollen dürfen Anfragen nur
  anlegen, nicht lesen.
- Eingabeprüfung und Längenbegrenzung auf Website und Backoffice, Honeypot-Feld `website`, Drosselung je IP-Adresse.
- Änderungsprotokoll (`track_changes`) auf allen Anfrage-DocTypes.
- Tägliche Löschjobs im Frappe-Scheduler (Anfragen, Termine, Solar Lead, Heatmap, Hinweise).

Offen:
- `[OFFEN: Zwei-Faktor-Authentifizierung für alle Backoffice-Konten mit Desk-Zugang]`
- `[OFFEN: Scheduler auf der Site aktiv? (bench --site <site> scheduler status) – ohne ihn laufen keine Löschfristen]`
- `[OFFEN: Backup-Konzept (Verschlüsselung, Aufbewahrung, Wiederherstellungstest); gelöschte Daten bleiben bis zum Ablauf der Backup-Rotation in Sicherungen]`
- `[OFFEN: Löschkonzept für E-Mail-Postfächer – Benachrichtigungen an Vertrieb/Terminberatung enthalten die vollständigen Anfragen und werden von den Löschjobs des Backoffice nicht erfasst]`
- `[OFFEN: Rollen- und Berechtigungsprüfung mindestens jährlich dokumentieren]`

## 7. Abweichungen zwischen Code und Datenschutzerklärung (`src/components/Datenschutz/datenschutz.js`)

Diese Punkte sollten vor dem Livegang bereinigt werden – entweder der Text oder der Code. Die Einträge dieses
Verzeichnisses beschreiben den **Code**.

| # | Thema | Datenschutzerklärung | Code / Backend | Empfehlung |
|---|---|---|---|---|
| A1 | Anfragen ohne Angebot/Auftrag (Punkte 7, 11, 12, 14, 15) | Löschung nach 12 Monaten | Kontakt, Angebot, Solarrechner sowie Award, Sponsoring und Partner (laufen als Kontaktanfrage): Anonymisierung nach **24 Monaten** ab Anlage (`oekovolt_app/website_api/helfer.py` → `anfragen_aufraeumen`). Unterlagen per Smartphone (Solar Lead): 12 Monate. | Text auf 24 Monate/Anonymisierung ändern oder `oekovolt_loeschfrist_monate` auf 12 setzen |
| A2 | Rückruf (Punkt 10) | Erledigte Rückrufe nach 90 Tagen löschen | Rückruf wird als „Website Termin“ mit Anfrageart „Rückruf“ gespeichert (`/api/rueckruf` → `termin.buche_termin`), Anonymisierung 24 Monate nach Termindatum | Text anpassen |
| A3 | Termine (Punkt 10) | 12 Monate nach dem Termin | 24 Monate nach Termindatum (`termin.loesche_alte_termine`, `LOESCHFRIST_MONATE = 24`) | Text oder Frist angleichen |
| A4 | CloudTalk (Punkte 10, 24) | Sofort-Rückruf über CloudTalk als Auftragsverarbeiter | CloudTalk-Funktionen in `src/lib/rueckrufApi.js` werden nirgends aufgerufen | Absatz entfernen, solange CloudTalk nicht eingebunden ist |
| A5 | IP-Adresse (Punkt 9) | Löschung, sobald die Anfrage abschließend bearbeitet ist | `ip_adresse` bleibt bis zur Anonymisierung (24 Monate); bei Status „Angebot erstellt“/„Gewonnen“ ohne automatische Löschung | Text oder Code angleichen; ggf. IP nach kurzer Frist (z. B. 30 Tage) separat leeren |
| A6 | Partner-Registrierung (Punkt 14) | 12 Monate nach Entscheidung | keine eigene Logik, 24 Monate ab Anlage wie Kontaktanfrage | angleichen |
| A7 | Hinweisgebersystem (`src/data/hinweisgeber.js`, ABLAUF und FAQ_INFO) | Rückmeldung „spätestens drei Monate nach der Eingangsbestätigung“, Fristen mit „§ 13 HSchG“ belegt | § 13 Abs. 9 HSchG: drei Monate **nach Entgegennahme** des Hinweises; die 7-Tage-Bestätigung steht in § 9 Abs. 1 HSchG. Backend `hinweis.py` rechnet ebenfalls ab Bestätigung. | Text und Backend anpassen (siehe VVT-Hinweisgebersystem.md, Abschnitt 6) |
| A8 | Kundenbühne, Mediathek, Lastgang-Analyse | nicht erwähnt | gebaut | kurze Abschnitte ergänzen (Textvorschläge in den jeweiligen Einträgen) |

## 8. Pflege

- Bei jeder neuen Funktion, die personenbezogene Daten verarbeitet, einen Eintrag anlegen oder erweitern.
- Mindestens jährlich prüfen: Rollen, Löschjobs, Auftragsverarbeiter, Drittlandgrundlagen (DPF-Liste).
- `[OFFEN: verantwortliche Person für die Pflege des Verzeichnisses benennen]`
