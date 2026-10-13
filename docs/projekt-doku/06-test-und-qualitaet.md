# 06 – Test und Qualität

Testdokumentation in Anlehnung an ISO/IEC/IEEE 29119-3 (Testfälle, Testprotokoll, Testbericht) und
Qualitätsmerkmale in Anlehnung an ISO/IEC 25010. Keine Normkonformität behauptet.
Stand: Version 0.6, 12.10.2026 (Nachführung Welle A – Neubau am 11./12.10.2026 nach Verlust des Stands vom 07.10.2026).

## 1. Testumgebung

| Merkmal | Wert |
|---|---|
| Datum | 12.10.2026 (Welle A; frühere Läufe 30.09.2026) |
| Arbeitsstand | `main` @ `71829e1` + Arbeitsbaum Welle A (enthält auch Teile der Wellen B/C; siehe 08 „Unveröffentlicht“) |
| Next.js | 15.5.27 (`next dev` ohne Turbopack, Port 3001 über `scripts/dev-waechter.mjs`; Builds nur mit `NEXT_DIST_DIR=.next-verify…`) |
| Browser-Prüfung (Welle A) | Playwright (`playwright-core`) mit Chromium, WebKit, Firefox; Viewports 360, 390, iPhone 14, iPad, 1280, 1440 |
| Betriebssystem | Windows 11 Pro (Git Bash) |
| Node.js | v24.21.0 |
| Python | 3.14.7 (Tests mit `python -B`, es werden keine Bytecode-Dateien geschrieben) |
| Ausgeführt von | Claude (KI-Assistent) im Auftrag der Geschäftsführung |
| Nicht ausgeführt | `npm run build` (macht der Koordinator), `npm run dev`, Browser-Sichtprüfung |

## 2. Vorhandene automatisierte Tests

| Test-ID | Datei | Prüfgegenstand | Art | Aufruf |
|---|---|---|---|---|
| T-SNOW | `scripts/schneelast-raster.test.mjs` | Projektion EPSG:3416 (LCC 2SP) gegen EPSG-Rechenbeispiel und Fremdbeispiele, Zellzuordnung, `skRichtwert` mit synthetischen und kaputten/fehlenden Dateien, Plausibilität der echten Rasterdatei (Wien, Innsbruck, außerhalb) | Unit (node:test), 8 Testfälle | `node scripts/schneelast-raster.test.mjs` |
| T-FOE | `scripts/foerdercall.test.mjs` | Phasen/Countdown des Fördercalls (Zeitgrenzen MESZ), Kategorien, Förderschätzung | Unit (node:assert), 35 Zusicherungen | `node scripts/foerdercall.test.mjs` |
| T-PROJ | `scripts/projekte-fallback.test.mjs` | Referenzen-Rückfall: statische Daten (Slugs, Pflichtfelder, Bild-Hosts), API leer / `message=[]` / HTTP 500 / nicht erreichbar / ohne Zugangsdaten, API gewinnt, Kennzahlen | Unit/Integration mit Fetch-Attrappe, 9 Testfälle | `node scripts/projekte-fallback.test.mjs` (optional `--live`: Slugs aus der Live-Sitemap, braucht Internet) |
| T-TERMIN | `Import-Backend-Frappe/apps/oekovolt_app/tests/test_termin_logik.py` | reine Terminlogik ohne Frappe: Feiertage, Zeit, Slots, Status, Buchung, ICS | Unit (unittest), 37 Testfälle in 6 Klassen | im Ordner `Import-Backend-Frappe/apps/oekovolt_app`: `python -m unittest discover -s tests -v` |
| T-HEAT | `Import-Backend-Frappe/apps/oekovoltdeutchland/oekovoltdeutchland/oekovoltdeutchland/doctype/heatmap_zelle/test_heatmap_logik.py` | reine Heatmap-Logik ohne Frappe (`heatmap_logik.py`) | Unit (unittest), 18 Testfälle | im Ordner `…/doctype/heatmap_zelle`: `python -m unittest test_heatmap_logik -v` bzw. `bench --site <site> run-tests --module …heatmap_zelle.test_heatmap_logik` |
| T-ALLE | `scripts/alle-tests.mjs` (Welle 4) | Sammellauf aller `scripts/*.test.mjs`; `todo`-Befunde brechen nicht ab | Runner, 21 Dateien (Stand 30.09.2026) | `node scripts/alle-tests.mjs` (Snippet `"test": "node scripts/alle-tests.mjs"` für `package.json` noch nicht übernommen) |
| T-W4 | neu in Welle 4: `prognose` (27), `schneelast-seite` (17), `einspeisung` (10 Gruppen), `eg-betriebe`, `kommunen-vergabe`, `flaeche` (15), `finanzierung` (14), `rechner-teilen` (13), `lastgang` (23), `experimente` (12), `kontrast` (18), `rechner-gewerbe` (68), `rechner-mobilitaet` (29), `rechner-privat` (43), `kundenbuehne` (23), `kennzahlen` (8), `heatmap-frontend` (11), `bundesland` (15) | Fachlogik der neuen Werkzeuge, Rechner, Kundenbühne, Kennzahlen, Heatmap-Validierung (Website), Farbkontrast | node:test bzw. node:assert | über T-ALLE |
| T-VERTRAG | `Import-Backend-Frappe/apps/oekovolt_app/tests/pruefe_vertrag.py` | Vertrag Website ↔ Backend ohne Frappe: Antwortformen `get_projekte`/`get_projekt`/`get_referenzkarte`, Formularprüfung (Honeypot, Pflichtfelder, PLZ, PDF), Herkunftszeile nicht in Kunden-Mail, DocType-Felder und Berechtigungen, Whitelist-Pfade mit Rollenprüfung | Prüfskript, 186 Prüfungen | im Ordner `Import-Backend-Frappe`: `python apps/oekovolt_app/tests/pruefe_vertrag.py` |
| T-WA | neu bzw. erweitert in Welle A: `redirects` (7, A01), `kontrast-klassen` (Fundliste als `todo`, A01), `werbeaussagen` (6, Register + Baseline, A02), `verkauf` (37, Fristen/IFB/Einwände/Freigabe-Filter, A03), `kundenbuehne` (40, Freigabe/Plakette/Award, A07), `lead-gate` (22, Kennungen/Pflichtfelder/Token/Cookie/Drossel, A09), `rechner-gewerbe` (88, Stresstest/TOR nach AC/Hero = Detail/Blackout, A10), `finanzierung` (Stresstest, A10), `rechner-privat` (45), `kennzahlen` (9), `experimente` (k4) | Werbeaussagen, Verkaufslogik, Freigaben, Lead-Gate, Rechenkern | node:test bzw. node:assert | über T-ALLE; `npm audit --omit=dev --audit-level=high` läuft am Ende mit (`--ohne-audit` lässt ihn aus) |
| T-ROUTING | `Import-Backend-Frappe/apps/oekovolt_app/tests/test_lead_routing.py` (A06) | Routing, Dubletten, SLA-Geschäftsminuten, Eskalation, Alarm ohne Personendaten – ohne Frappe | Unit (unittest), 52 Tests | `python -B tests/test_lead_routing.py` |
| T-RLEAD | `Import-Backend-Frappe/apps/oekovolt_app/tests/test_rechner_lead.py` (A11/Integration) | Double-Opt-in-Ablauf mit Frappe-Attrappe: 24 h, ungültige/verbrauchte Token, erneut senden, Honeypot, Drossel, Schalter, Löschjob 30 Tage, Website-Token | Unit (unittest), 10 Tests | `python -B tests/test_rechner_lead.py` |
| T-FREIGABE | `…/oekovolt_app/doctype/referenz_freigabe/test_freigabe_logik.py` (A07) | Token, Hash, IP-Kürzel, Auswahlprüfung, Status, Mailtexte der Referenz-Freigabe | Unit (unittest), 13 Tests | im Ordner des DocTypes: `python -B test_freigabe_logik.py` |

**Lücken:**
- Laut `docs/AT-UEBERGABE.md:40` ist die Rechner-Logik `src/lib/rechner/*` „mit Node getestet“ – **Testdateien dazu sind
  nicht im Repository** (Q-01).
- `src/lib/kundenbuehne.js` ist ausdrücklich „per Node prüfbar“ (Kopfkommentar), ein Testskript dazu fehlt (Q-07).
- Keine Tests für die Website-Seite der Heatmap (`src/lib/heatmap.js`), die Drosselung der API-Routen, Konfetti,
  Herkunft und die Einwilligungslogik (Q-05).
- Kein Testskript in `package.json` (`scripts` enthält nur `dev`, `build`, `start`, `lint`), keine CI-Konfiguration im Repo.
- Keine automatisierten Barrierefreiheits- oder End-to-End-Tests im Repo.
- Kein Test für das Erzeugungsskript `scripts/schneelast-raster-erzeugen.py` (braucht ca. 0,9 GB Eingangsdaten); geprüft wird nur das Ergebnis (T-SNOW).

## 3. Testprotokoll

### 3.0000 Welle A (11./12.10.2026, Neubau)

Läufe der Dokumentation am 12.10.2026 auf dem aktuellen Arbeitsbaum (enthält auch Wellen B/C):

| Test | Ergebnis | Exit-Code | Bemerkung |
|---|---|---|---|
| `node scripts/alle-tests.mjs` | **41 von 41 Dateien bestanden**, 0 fehlgeschlagen (13,5 s) | 0 | `npm audit --omit=dev --audit-level=high`: keine Befunde ab high; bekannter Befund (`todo`): `kontrast-klassen.test.mjs` 359 Fundstellen (11.10.: 445) |
| T-VERTRAG `pruefe_vertrag.py` | **361/361** | 0 | 186 (0.5) → 356 (A11) → 361 (Integration) |
| T-RLEAD | 10 OK | 0 | neu |
| T-ROUTING | 52 OK | 0 | neu |
| T-TERMIN | 37 OK | 0 | unverändert |
| T-FREIGABE | 13 OK | 0 | neu |
| ESLint `npx eslint src scripts -f json` | **1.220 Dateien, 0 Fehler, 0 Warnungen** | 0 | Paketläufe A01–A12 je ohne Befund |

Ergebnisse der Pakete (laut Notizen `anhang/wellen/A*.md`):

| Prüfung | Ergebnis | Quelle |
|---|---|---|
| Produktions-Build `NEXT_DIST_DIR=.next-verify npx next build` | grün, Next 15.5.27, 355 statische Seiten (11.10., nach A01); `.next` nicht angefasst | A01 |
| Produktions-Server (`next start`, Port 3006) | Weiterleitungen ohne Ketten (308), `security.txt` 200 nach RFC 9116, Header (HSTS, `X-XSS-Protection: 0`, COOP außer `/tv`, `/einbetten`, `/siegel`), `/_next/image` nur `…/files/…` (AVIF 200; `/private/…` und unpkg 400), Referenzkarte ohne Anfrage an unpkg.com | A01 |
| Werbeaussagen-Scan der QA-Seiten | kein „TOP 3“, kein „bevorzugter PV-Errichter“, kein `<video>`, keine WKO-Siegel, keine Gesellschafter-Zeile; „Angaben Ökovolt Österreich · Stand 09/2026“ und „Symbolbild“ sichtbar; CTA-Gruppe 96 ms nach `domInteractive` sichtbar (Abnahme ≤ 800 ms) | A02 (Runden 1–3) |
| Mobile Führung | Primär-CTA (Unterkante) bei 390 × 844: `/gewerbe` 532 px, `/landwirtschaft` 532 px, `/agri-pv` 477 px (Ziel < 700 px); Cookie-Banner mobil 164 px, Desktop 90 px, gleichwertige Knöpfe, ohne Einwilligung 0 Anfragen an Google; CLS nach Scrollen 0; Mega-Menü per Tastatur | A12 |
| Kundennamen | auf `/` nach Durchscrollen keine Kundennamen (Steinbacher, PENN, ALPLA, Andritz, Hammerer, B&R, F&S Agrar) | A02 Runde 3 |
| Backoffice-Logik | nur ohne Frappe (Attrappen); `bench migrate`, echte Token, `get_freigaben`-Merge und Positivfall `/siegel/<slug>` nicht geprüft | A06, A07, A11 |

**QA-Sichtprüfung über 10 Geräte-/Browser-Kombinationen (Runden 1–3, 12.10.2026):** A04, A05, A08, A09 ohne Restbefund.
Restbefunde (in 09 als Risiken geführt): A02 – „eigener Leittechnik“/„eigener Technik“ ohne Schalter (R-63), Rahmen der
Schicht-Umschaltung im Hero-Rechner; A03 – nur Last-Zeitüberschreitungen des Produktionsservers 3002 (kein Code-Befund);
A06 – schwebende Leiste über Inhalten (R-72), Safari-Schriftstärke und Frappe-Prüfungen offen; A07 – leere Karte „Nach
Objektart“ und Texte ohne Datenbasis (R-73); A10 – Hero-Fließtext „eigener Leittechnik“ (R-63); A11 – Startwerte des
Konfigurators verzerren das Scoring (R-67); A12 – CLS beim ersten Laden mobil (R-69), Startseiten-CTA mobil (R-70),
WebKit-Schrift dünn (R-71).

**Einschränkungen:** Der Wächter-Dev-Server (3001) antwortete ab 11./12.10. nicht mehr; Sichtprüfungen liefen auf
Ersatz-Servern bzw. dem Produktionsserver 3002 mit Zeitüberschreitungen (R-74). A10 hat kein eigenes Kontrollbild
(Skripte `welle-a/A10/sicht.cjs`, `qa2.cjs` liegen für die QA bereit). Eine Prüfung auf echtem iPhone/Safari fehlt.

### 3.000 SEO-Welle P1–P9 und QA (30.09.2026)

| Test | Ergebnis | Exit-Code | Bemerkung |
|---|---|---|---|
| `npm test` bzw. `node scripts/alle-tests.mjs` | **21 von 21 Dateien bestanden**, 0 fehlgeschlagen | 0 | **keine `todo`-Befunde mehr** (tests-01 Folgebefund und tests-04 durch P9 behoben, als echte Tests umgestellt; `rechner-privat` jetzt 44 Tests) |
| T-TERMIN | **bestanden** – 37 OK | 0 | – |
| T-HEAT | **bestanden** – 18 OK | 0 | – |
| T-VERTRAG | **bestanden** – 186/186 | 0 | – |
| ESLint `src` + `scripts` | 977 Dateien, 0 Fehler, 0 Warnungen | – | – |

**QA-Crawl (Bericht QA, Dev-Server):** Sitemap 314 Adressen, davon 305 mit 200 und 9 Weiterleitungen (`/schneelast/<land>`, danach aus
Sitemap/`llms.txt` entfernt – H1). Alle 305 Seiten: genau eine H1, Title, Description, Canonical auf sich selbst, gültiges JSON-LD,
keine doppelten Titles/Descriptions, kein noindex in der Sitemap. robots.txt erfüllt E1. KI-Crawler erhalten Title/Canonical vor
`</head>` (nur Dev-Modus belegt). Mängel H1–H3, M1–M7, N1–N8 laut Koordinator nachgearbeitet; im Code stichprobenartig bestätigt:
`GEAENDERT` gefüllt, Schneelast-Länder aus `indexierbar()` ausgeschlossen, IndexNow-Aufruf im Kanal-Webhook, „Schwestergesellschaft“
in `unternehmen.js`, `max-*` auch außerhalb `googleBot`, Presse-Grafiken auf `/presse`, keine Links mehr auf `/ratgeber/reststromvermarktung`
außer Kommentaren. Rund 150 Unterseiten `/referenzen/projekte/*/esg|siegel|teilen` blieben wegen Dev-Server-Absturz ungeprüft (R-52).

### 3.00 Welle 4 (30.09.2026, Nachführung)

| Test | Ergebnis | Exit-Code | Bemerkung |
|---|---|---|---|
| T-ALLE (`node scripts/alle-tests.mjs`) | **21 von 21 Dateien bestanden**, 0 fehlgeschlagen, ca. 5 s | 0 | 2 bekannte Befunde als `todo` (siehe unten) |
| T-TERMIN | **bestanden** – 37 Tests OK | 0 | – |
| T-HEAT | **bestanden** – 18 Tests OK | 0 | – |
| T-VERTRAG | **bestanden** – 186/186 | 0 | – |

**Befunde aus dem Testauftrag (tests-01 bis tests-05):**

| Befund | Gegenstand | Stand 30.09.2026 |
|---|---|---|
| tests-01 | `PV_MONAT` in `src/lib/rechner/profile.js` summierte sich auf 0,995 | im Code **behoben** (Normierung); der Folgetest „Gewerbe ohne Speicher weist einen Speicherverlust aus“ (`scripts/rechner-privat.test.mjs:388`) meldet aber weiterhin einen Befund → Ursache in `src/lib/solarrechner.js` prüfen (Q-10) |
| tests-02 | `zahlText()` gruppierte Dezimalzahlen falsch | **behoben** (`src/data/kennzahlen.js`, Dezimalkomma) |
| tests-03 | EAG-Zuschuss über 1.000 kWp im Pacht-Rechner | **behoben** (`src/lib/rechner/pacht.js`, anteilig) |
| tests-04 | eigene TOR-Staffel in `pacht.js` ohne 0,8-kW-Grenze | **offen** (todo im Sammellauf) |
| tests-05 | `wallbox.js` ohne Rückfall bei unbekanntem Kraftstoff | **behoben** (Rückfall Benzin) |

Weitere fachliche Hinweise aus dem Testauftrag (keine Logikfehler): Privat-Solarrechner mit Standardwerten amortisiert
nicht innerhalb von 20 Jahren; `toLocaleString("de-DE")` in `src/lib/rechner/annahmen.js`, `co2.js`, `kundenbuehne.js`,
`AnimZahl.js` (Hydrations-Risiko); Randfälle in `egAusParams` und `zeitfenster()`.

### 3.0 Welle 3 (30.09.2026, Nachführung)

| Test-ID | Ergebnis | Exit-Code | Bemerkung |
|---|---|---|---|
| T-SNOW | **bestanden** – 8 von 8 | 0 | – |
| T-FOE | **bestanden** – „alle Tests ok“ | 0 | – |
| T-PROJ | **bestanden** – 9 von 9 | 0 | – |
| T-TERMIN | **bestanden** – 37 Tests OK | 0 | – |
| T-HEAT | **bestanden** – 18 Tests OK | 0 | – |
| T-VERTRAG | **bestanden** – 186/186 Prüfungen | 0 | – |

Keine neuen Testdateien in Welle 3 (neue Module `kennzahlen.js`, `mannschaft.js`, `reels.js`, `reels-optimieren.mjs` ohne Tests, Q-08).

### 3.1 Welle 2 (30.09.2026, Nachführung)

| Test-ID | Ergebnis | Exit-Code | Bemerkung |
|---|---|---|---|
| T-SNOW | **bestanden** – 8 von 8 | 0 | wie Welle 1 |
| T-FOE | **bestanden** – „alle Tests ok“ | 0 | – |
| T-PROJ | **bestanden** – 9 von 9 | 0 | ohne `--live` |
| T-TERMIN | **bestanden** – 37 Tests OK | 0 | – |
| T-HEAT | **bestanden** – 18 Tests OK | 0 | neu in Welle 2 |
| T-VERTRAG | **bestanden** – 186/186 Prüfungen | 0 | neu in Welle 2 |

### 3.2 Welle 1 (30.09.2026, Erstfassung)

| Test-ID | Ergebnis | Bemerkung |
|---|---|---|
| T-SNOW | bestanden – 8 von 8 | Konsolenmeldung „Dateien unstimmig … Richtwert deaktiviert“ stammt aus dem gewollten Negativfall (kaputte Datei). Ausgabe: Wien s_k = 0,5, Innsbruck s_k = 1,2 kN/m². Node-Warnung `MODULE_TYPELESS_PACKAGE_JSON` (kein `"type"` in `package.json`) – harmlos |
| T-FOE | bestanden | – |
| T-PROJ | bestanden – 9 von 9 | – |
| T-TERMIN | bestanden – 37 Tests OK | Paket damals noch in Arbeit |

### 3.3 Statische Analyse (Lint)

| Welle | Aufruf | Ergebnis |
|---|---|---|
| A | `npx eslint src scripts -f json` (12.10.2026, inkl. Wellen B/C im Arbeitsbaum) | 1.220 Dateien, **0 Fehler, 0 Warnungen** |
| 5 | `npx eslint src scripts -f json` (ohne Cache) | 977 Dateien, **0 Fehler, 0 Warnungen** |
| 4 | wie oben | 976 Dateien, 0 Fehler, 0 Warnungen |
| 3 | `npx eslint src -f json` | 865 Dateien, 0 Fehler, 0 Warnungen |
| 2 | wie oben | 848 Dateien, 0 Fehler, 0 Warnungen |
| 1 | wie oben | 824 Dateien, 0 Fehler, 1 Warnung (`src/lib/heatmap.js`, überflüssige `eslint-disable`-Direktive – in Welle 2 behoben) |

`npm run lint` ruft `next lint` auf; hier wird ESLint direkt verwendet, damit nichts in `.next` geschrieben wird.

### 3.4 Build-Status

| Stand | Ergebnis | Quelle |
|---|---|---|
| 29.09.2026 (vor Commit `11472bf`) | Produktions-Build fehlerfrei; QA-Crawl 199 Sitemap-URLs: 0 Fehlerseiten, 0 interne 404, Title/Description/Canonical/H1/JSON-LD gültig | `docs/AT-UEBERGABE.md:3-5` |
| 11.10.2026, Welle A nach A01 | `NEXT_DIST_DIR=.next-verify npx next build` grün (Next 15.5.27, 355 statische Seiten) | `anhang/wellen/A01.md` |
| 12.10.2026, Welle A Ende | kein vollständiger Build der Dokumentation; QA prüfte gegen einen Produktionsserver auf Port 3002 (neu gestartet 12.10., 11:55) und Paket-Builds in eigenen Verzeichnissen (`.next-verify-a07`, `-a08`, `-a12`) | Paket-Notizen, QA-Restbefunde |
| 30.09.2026, Wellen 2–4 | Build übernimmt der Koordinator (parallel) – **Ergebnis bei Redaktionsschluss nicht gemeldet**; laut Koordinator Sitemap mit 311 URLs | beim nächsten Nachführen eintragen (P9) |

## 4. Manuelle Sichtprüfungen

| Prüfung | Vorgabe | Letzter belegter Stand | Offen |
|---|---|---|---|
| Visuelle Kontrolle Desktop 1440 px und Mobil 390 px im echten Browser, Vergleich zur DE-Seite | `docs/AT-DESIGN.md:8-20` | Premium-Überarbeitung, alle Bereiche (`docs/AT-UEBERGABE.md:35-36`) | neu seit 29.09.: EAG-Fördercall-Seite, Hinweisleiste, Standort-Check-Richtwert, Konfetti (auch mit „Bewegung reduzieren“), Heatmap-Ansicht, Netzanmeldung (inkl. Druckansicht Checkliste), Kundenbühne (Porträt, Siegel-Konfigurator, Social-Kit, ESG-Bericht, Siegel auf Fremdseite), Footer mit Instagram; Welle 3: WKO-Siegel im Hero, Kennzahlen-Band, Mannschaft (`/uber-uns#mannschaft`, Teaser), Pressekontakt, Mediathek (leer und mit ersten Videos), `/hinweisgeberschutz` in beiden Schalterstellungen; Welle 4: `/pv-prognose`, `/schneelast` (Hydration-Konsole), Schneelast-Länderseiten, `/einspeisung-gewerbe`, `/energiegemeinschaften/betriebe-gemeinden`, `/kommunen/vergabe-foerderung`, `/flaechen-check` (mobil ca. 22 Bildschirmhöhen), Widmungsseiten, `/rechner/finanzierung`, PDF-Druck in allen 8 Gewerbe-Rechnern (Peak-Shaving ungeprüft), Teilen-Knopf mobil, `/lastgang-analyse` (Ergebnis PV/Peak), Bundesland-Hubs (Ertrags-Abschnitt, Wisch-Karten mobil), Kontrast auf Seiten mit Altbausteinen, Reveal-Elemente |
| HORA-Direktlinks im Browser testen | `docs/AT-UEBERGABE.md:97` | nicht belegt | offen |
| Abnahmetest Backoffice (curl + Seiten) | `docs/FRAPPE-AT-API-SPEZIFIKATION.md` Abschnitt 8; `Import-Backend-Frappe/README.md` („Abnahme nach der Installation“) | nicht belegt (AT-Backoffice nicht live) | offen |

## 5. Qualitätsmerkmal-Matrix (ISO/IEC 25010 als Raster)

| Merkmal | Teilmerkmal | Belegte Maßnahme | Nachweis | Bewertung |
|---|---|---|---|---|
| Funktionale Eignung | Korrektheit | Unit-Tests Schneelast-Projektion, Fördercall, Referenzen-Rückfall, Terminlogik, Heatmap-Logik | T-SNOW, T-FOE, T-PROJ, T-TERMIN, T-HEAT, T-VERTRAG | teilweise (Rechner, Kundenbühne ohne Tests im Repo) |
| Leistungseffizienz | Zeitverhalten | Caching, Bildformate, statische Rasterdatei statt Abruf, Siegel/Social-Bilder 1 Tag gecacht | 01 REQ-NF-PERF-01/02 | nicht gemessen (keine Web-Vitals-Daten) |
| Kompatibilität | Koexistenz/Interoperabilität | ActivityPub, RSS/JSON-Feed, Web-Push, IndexNow, Siegel als SVG/`<img>` für Fremdseiten; `browserslist` definiert | `package.json` (`browserslist`), `src/app/siegel/[slug]/route.js` | umgesetzt |
| Benutzbarkeit / Interaktionsfähigkeit | Barrierefreiheit | `lang="de-AT"`, Sprunglink, reduced motion (auch Konfetti), Barrierefreiheitserklärung | 01 REQ-NF-A11Y-*, REQ-KON-02 | Audit offen |
| Benutzbarkeit | Fehlertoleranz | verständliche Fehlermeldungen mit Kontaktalternative | `src/lib/backendFehler.js` | umgesetzt |
| Zuverlässigkeit | Fehlertoleranz/Verfügbarkeit | statische Rückfälle ohne Backoffice (Referenzen, Kundendaten) | T-PROJ, ADR-003/014/017 | umgesetzt |
| Sicherheit | Vertraulichkeit/Integrität | Secrets in Env, Token-Hashes, zeitkonstante Vergleiche, Header, keine offenen Proxys, Drosselung + Größenlimit aller Anfrage-Routen | 05 | S1–S4 behoben; offen: CSP, Drosselung je Instanz, `X-Forwarded-For` |
| Wartbarkeit | Modularität/Testbarkeit | reine Funktionen (`src/lib/rechner`, `foerdercall`, `schneelastRaster`, `kundenbuehne`, `heatmap_logik.py`), zentrale Konstanten | 02 | gut; ~150 ungenutzte Altkomponenten (`docs/AT-UEBERGABE.md:76-78`) |
| Übertragbarkeit | Installierbarkeit | `NEXT_DIST_DIR`, Env-Vorlage, Installationsskripte Backoffice | 07 | Website-Hosting-Doku offen |

## 6. Offene Qualitätspunkte

| ID | Punkt | Priorität (Vorschlag) |
|---|---|---|
| Q-01 | Tests für `src/lib/rechner/*` ins Repo aufnehmen (laut Übergabe vorhanden gewesen) | hoch |
| Q-02 | `npm test` bzw. Sammelskript für alle `scripts/*.test.mjs` und Python-Tests | mittel – `npm test` vorhanden; Python-Tests weiter einzeln |
| Q-03 | Ergebnis des Produktions-Builds (Koordinator) hier eintragen | hoch |
| Q-04 | Barrierefreiheits-Prüfung (z. B. automatisiert + manuell nach WCAG 2.2 AA) dokumentieren | hoch (BaFG) |
| Q-05 | Tests für `src/lib/heatmap.js` (Website-Validierung) und die Drosselung der API-Routen | mittel |
| Q-06 | Leistungsziele (Core Web Vitals) festlegen und messen | mittel |
| Q-07 | Test für den Kundenbühne-Rechenweg (`src/lib/kundenbuehne.js`) | mittel |
| Q-08 | Tests für `src/data/reels.js` (`mediathekSitemap`, Sortierung) und `scripts/reels-optimieren.mjs` (Eintrag zwischen den Markierungen) | niedrig |
| Q-09 | Prüfung, dass Kennzahlen nur aus `src/data/kennzahlen.js` stammen (Duplikate finden) | niedrig |
| Q-10 | Folgebefund tests-01 (`speicherverlust` ohne Speicher) in `src/lib/solarrechner.js` klären | **erledigt** (P9) |
| Q-11 | Befund tests-04 (TOR-Staffel in `pacht.js`, `torTyp()` aus `gewerbepv.js` wiederverwenden) | **erledigt** (P9) |
| Q-12 | Lastgang-Parser mit je einem echten, anonymisierten Export aus 2–3 Netzbetreiber-Portalen prüfen | mittel |
| Q-13 | PV-Prognose gegen Monitoringdaten einer Ökovolt-Anlage validieren | mittel |
| Q-14 | Seitenlängen über der Richtschnur 8–11 Bildschirmhöhen kürzen (Schneelast, EG Betriebe, Vergabe, Flächen-Check, Bundesland-Hubs) | niedrig |
| Q-15 | Crawler-Test (`curl -A`), Rich-Results-Test und IndexNow-Lauf im Produktions-Build nach dem Deploy | hoch |
| Q-16 | `scratchpad/indexnow-statuscodes.test.mjs` (12 Prüfungen) als `scripts/indexnow.test.mjs` übernehmen | niedrig |
| Q-17 | Restliche ca. 150 Kundenbühne-Unterseiten nachcrawlen | niedrig |
| Q-18 | Testmuster „eigene(r) Leittechnik“/„eigene Technik“ in `scripts/werbeaussagen.test.mjs` (R-63) | hoch |
| Q-19 | CLS beim ersten Laden mobil < 0,1 (`/gewerbe`, `/kontakt`) nachweisen (R-69) | hoch |
| Q-20 | Sichtprüfung auf echtem iPhone/Safari (Schriftstärke, `/termin`) (R-71) | mittel |
| Q-21 | Backoffice-Abnahme nach `bench migrate`: Double-Opt-in mit echter Mail, Referenz-Freigabe mit echtem Token, Routing/SLA/Alarm (Spezifikation §8) | hoch |
| Q-22 | Kontrast-Altbestand (359) abbauen und `KONTRAST_KLASSEN_STRENG=1` (Welle E) | mittel |
| Q-23 | Vollständiger Produktions-Build des Endstands Welle A mit Ergebnis hier eintragen | hoch |
| Q-24 | Test, dass der Konfigurator `vorbelegt` sendet (R-67) | mittel |
