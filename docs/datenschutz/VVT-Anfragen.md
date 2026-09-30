# VVT (Art. 30 Abs. 1 DSGVO) – Kontakt-, Angebots- und Solarrechner-Anfragen

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 · Verantwortlicher: Ökovolt Solartechnik GmbH, Gewerbegebiet 10,
> 5121 Ostermiething ([Deckblatt](00-Uebersicht-VVT.md#verantwortlicher)) · Freigabe: `[OFFEN]` · Prüfung: `[OFFEN]`

## Wege in diese Verarbeitung (belegt im Code)

| Weg auf der Website | Route (Next.js) | Backoffice-Methode | DocType |
|---|---|---|---|
| Kontaktformular `/kontakt`, Service-Anfrage (`src/components/ServiceAT/ServiceAnfrage.js`) | `/api/create_contact` | `oekovolt_app.website_api.kontakt.submit_kontakt` | Kontaktanfrage (`KA-YYYY-#####`) |
| PV Award, Sponsoring, Elektro-Partner (`/pv-award`, `/sponsoring`, `/partner`) | `/api/award`, `/api/sponsoring`, `/api/partner-registrierung` über `src/lib/api/uber-uns/anfrageWeiterleiten.js` | `…kontakt.submit_kontakt` mit eigenem `thema` | Kontaktanfrage |
| Angebots-Konfigurator `/angebot` | `/api/create_anfrage` | `oekovolt_app.website_api.angebot.submit_angebot` | Angebotsanfrage (`AA-YYYY-#####`) |
| PDF-Analyse aus dem Solarrechner | `/api/analyse/pdf` (PDF wird auf dem Website-Server erzeugt) | `oekovolt_app.website_api.solarrechner.submit_solarrechner` (multipart, nur PDF, max. 10 MB) | Solarrechner Anfrage (`SR-YYYY-#####`), PDF als private Datei |

Belege: `src/app/api/create_contact/route.js`, `src/app/api/create_anfrage/route.js`, `src/app/api/analyse/pdf/route.js`,
`Import-Backend-Frappe/apps/oekovolt_app/README.md`, DocType-Definitionen unter
`Import-Backend-Frappe/apps/oekovolt_app/oekovolt_app/oekovolt_app/doctype/`.

## Eintrag

| Angabe | Inhalt |
|---|---|
| **Zweck** | Bearbeitung von Anfragen, Erstellung von Angeboten und Richtwert-Berechnungen, Beantwortung von Rückfragen; bei Award/Sponsoring/Partner: Prüfung der Einreichung bzw. Eignung; Auswertung der Kampagnenherkunft (siehe [VVT-Statistik-Herkunft.md](VVT-Statistik-Herkunft.md), Teil C); Missbrauchsschutz und Nachweis |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Anfrage); Art. 6 Abs. 1 lit. f DSGVO für Ansprechpersonen von Unternehmen, Gemeinden und Organisationen, für die Speicherung der IP-Adresse (Missbrauchsschutz, Nachweis) und für die Kampagnen-Zuordnung. Das Feld `einwilligung` dokumentiert die im Formular bestätigte Einwilligung/Kenntnisnahme. `[OFFEN: Wortlaut der Checkbox je Formular prüfen – ist es eine Einwilligung (lit. a) oder nur eine Kenntnisnahme der Datenschutzerklärung?]` |
| **Betroffene** | Interessent:innen und Kund:innen (Privat und Gewerbe), Ansprechpersonen von Unternehmen, Gemeinden, Vereinen; Einreichende zum PV Award; Elektrotechnik-Betriebe und deren Ansprechpersonen |
| **Datenkategorien – Kontaktanfrage** | `vorname`, `nachname`, `email`, `telefon`, `strasse_hausnummer`, `plz`, `ort`, `thema`, `quelle` (Seite), `nachricht` (bei Award/Sponsoring/Partner strukturiert: z. B. Firma, UID, Firmenbuch/GISA, Qualifikationen, Mitarbeiterzahl, Einsatzgebiet), `einwilligung`, interne `notiz`, `zustaendig`, `status` |
| **Datenkategorien – Angebotsanfrage** | Kontaktdaten wie oben (ohne Straße), `plz`, `ort`; Vorhaben (`vorhaben` als JSON), Gebäudetyp, Eigentümer, Startzeitpunkt, Dachform/-ausrichtung, Jahresverbrauch; berechnete Richtwerte (Anlagengröße, Speicher, Ertrag, Autarkie, Vorteil/Jahr, Investition von–bis, Amortisation) einzeln und als `ergebnis_json`; `nachricht`, `einwilligung` |
| **Datenkategorien – Solarrechner Anfrage** | `kunden_name`, `email`, `telefon`, `plz`, `analyse_referenz` (`PVA-2026-XXXXXX`), PDF mit Rechnerangaben und Ergebnissen, `quelle` |
| **Datenkategorien – alle** | `ip_adresse` (vom Website-Server gesetzt, `src/lib/ipAdresse.js`); Herkunftsfelder `herkunft`, `herkunft_kanal`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `herkunft_referrer` (nur Ursprung), `einstiegsseite` |
| **Besondere Kategorien (Art. 9/10)** | Nicht vorgesehen. Freitextfelder können sie enthalten, wenn Betroffene sie selbst eingeben. |
| **Empfänger intern** | Rolle **Vertrieb** (Lesen/Schreiben aller Anfrage-DocTypes, erhält Benachrichtigungen), System Manager. Die API-Rolle „Website API“ darf nur anlegen, nicht lesen. |
| **Benachrichtigungen** | E-Mail und Glocke (Notification Log) an alle aktiven Nutzer der Rolle Vertrieb, optional weitere Adressen (`oekovolt_benachrichtigung_an`), Reply-To = Absender:in. Bestätigungs-E-Mail an die anfragende Person ohne die interne Herkunftszeile; beim Solarrechner mit dem PDF als Anhang (abschaltbar: `oekovolt_keine_kundenmail`). |
| **Empfänger extern** | Keine Weitergabe an Dritte zu eigenen Zwecken. Entsteht ein Auftrag, gelten die Empfänger des Eintrags „Kunden und Projekte“ `[OFFEN: Eintrag fehlt noch]`. |
| **Auftragsverarbeiter** | Hosting Website `[OFFEN]`; Hosting Backoffice (Hetzner Online GmbH, Nürnberg, laut DNS/RIPE am 30.09.2026) `[OFFEN: AV-Vertrag]`; E-Mail (Microsoft 365 laut MX-Eintrag, Frappe-Ausgangskonto) `[OFFEN]` |
| **Drittland** | Keines vorgesehen. `[OFFEN: Microsoft 365 – Datenregion und Unterauftragsverarbeiter prüfen]` |
| **Löschung (umgesetzt)** | Täglicher Job `oekovolt_app.website_api.helfer.anfragen_aufraeumen`: Anfragen **älter als 24 Monate ab Anlage**, die nicht den Status „Angebot erstellt“ oder „Gewonnen“ haben, werden **anonymisiert**. Geleert werden Name (→ „Anonymisiert“), E-Mail, Telefon, Straße, Nachricht, Angaben/`ergebnis_json`, Notiz, Herkunftstext, IP-Adresse; gelöscht werden PDFs, Versionen (Änderungsprotokoll), Kommentare, Benachrichtigungen und Einträge der E-Mail-Warteschlange. Es bleiben PLZ, Ort, Thema, Richtwerte und Kampagnenfelder für die Statistik. Frist per `site_config.json` änderbar (`oekovolt_loeschfrist_monate`). |
| **Löschung (offen)** | `[OFFEN: Anfragen mit Status „Angebot erstellt“ oder „Gewonnen“ werden nie automatisch anonymisiert. Festlegen, wann sie in die Kundenakte übergehen und welche Frist dann gilt (Buchhaltungsunterlagen 7 Jahre nach § 132 BAO/§ 212 UGB; Anfragen selbst sind nicht zwingend Buchhaltungsunterlagen).]` `[OFFEN: E-Mail-Kopien in den Postfächern der Rolle Vertrieb und bei den Absender:innen werden vom Job nicht erfasst.]` `[OFFEN: Datenschutzerklärung nennt 12 Monate – siehe Deckblatt, Abweichung A1/A5/A6.]` |
| **Restrisiko Anonymisierung** | PLZ + Ort + Thema + Richtwerte bleiben erhalten. Bei Gewerbeanfragen in kleinen Gemeinden kann ein Rückschluss auf den Betrieb möglich sein. `[OFFEN: bewerten; ggf. zusätzlich Ort leeren und PLZ auf Bezirksebene kürzen]` |
| **TOM** | TLS; eigener API-User ohne Leserechte; serverseitige Prüfung von Pflichtfeldern, Längen, E-Mail, PLZ (4–5 Ziffern); Honeypot `website` (gefüllt → Erfolg ohne Speichern); Drosselung je IP und Stunde: Kontakt 5, Angebot 5, Solarrechner 10 (HTTP 429, anpassbar über `oekovolt_drossel`); zusätzlich Drosselung auf der Website (`gedrosselt` in `anfrageWeiterleiten.js`, Größenlimit 24 KB); PDF nur `application/pdf`, privat abgelegt; Änderungsprotokoll; Rollenrechte. `[OFFEN: 2FA für Rolle Vertrieb]` |
| **DSFA** | Voraussichtlich nicht erforderlich (keine umfangreiche Verarbeitung besonderer Kategorien, kein Profiling, keine systematische Überwachung). `[OFFEN: gegen die DSFA-Listen der DSB bestätigen]` |
| **Informationspflicht** | Datenschutzerklärung Punkte 7, 8, 9, 12, 14, 15, 16; Hinweis an den Formularen. |
| **Automatisierte Entscheidung** | Nein. Die Richtwerte sind unverbindliche Berechnungen; Angebote erstellen Mitarbeitende. |
