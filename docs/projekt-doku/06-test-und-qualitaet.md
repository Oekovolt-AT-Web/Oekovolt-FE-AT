# 06 – Test und Qualität

Testdokumentation in Anlehnung an ISO/IEC/IEEE 29119-3 (Testfälle, Testprotokoll, Testbericht) und
Qualitätsmerkmale in Anlehnung an ISO/IEC 25010. Keine Normkonformität behauptet.
Stand: Version 0.3, 30.09.2026 (Nachführung Welle 3).

## 1. Testumgebung

| Merkmal | Wert |
|---|---|
| Datum | 30.09.2026 (Welle 1 und Welle 2) |
| Arbeitsstand | `at-launch` @ `11472bf` + Arbeitsbaum (siehe 08 „Unveröffentlicht“) |
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
| T-VERTRAG | `Import-Backend-Frappe/apps/oekovolt_app/tests/pruefe_vertrag.py` | Vertrag Website ↔ Backend ohne Frappe: Antwortformen `get_projekte`/`get_projekt`/`get_referenzkarte`, Formularprüfung (Honeypot, Pflichtfelder, PLZ, PDF), Herkunftszeile nicht in Kunden-Mail, DocType-Felder und Berechtigungen, Whitelist-Pfade mit Rollenprüfung | Prüfskript, 186 Prüfungen | im Ordner `Import-Backend-Frappe`: `python apps/oekovolt_app/tests/pruefe_vertrag.py` |

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
| 3 | `npx eslint src -f json` (ohne Cache, schreibt nichts ins Projekt) | 865 Dateien, **0 Fehler, 0 Warnungen** |
| 2 | wie oben | 848 Dateien, 0 Fehler, 0 Warnungen |
| 1 | wie oben | 824 Dateien, 0 Fehler, 1 Warnung (`src/lib/heatmap.js`, überflüssige `eslint-disable`-Direktive – in Welle 2 behoben) |

`npm run lint` ruft `next lint` auf; hier wird ESLint direkt verwendet, damit nichts in `.next` geschrieben wird.

### 3.4 Build-Status

| Stand | Ergebnis | Quelle |
|---|---|---|
| 29.09.2026 (vor Commit `11472bf`) | Produktions-Build fehlerfrei; QA-Crawl 199 Sitemap-URLs: 0 Fehlerseiten, 0 interne 404, Title/Description/Canonical/H1/JSON-LD gültig | `docs/AT-UEBERGABE.md:3-5` |
| 30.09.2026, Wellen 2 und 3 | Build übernimmt der Koordinator (parallel) – **Ergebnis bei Redaktionsschluss nicht gemeldet** | beim nächsten Nachführen eintragen (P9) |

## 4. Manuelle Sichtprüfungen

| Prüfung | Vorgabe | Letzter belegter Stand | Offen |
|---|---|---|---|
| Visuelle Kontrolle Desktop 1440 px und Mobil 390 px im echten Browser, Vergleich zur DE-Seite | `docs/AT-DESIGN.md:8-20` | Premium-Überarbeitung, alle Bereiche (`docs/AT-UEBERGABE.md:35-36`) | neu seit 29.09.: EAG-Fördercall-Seite, Hinweisleiste, Standort-Check-Richtwert, Konfetti (auch mit „Bewegung reduzieren“), Heatmap-Ansicht, Netzanmeldung (inkl. Druckansicht Checkliste), Kundenbühne (Porträt, Siegel-Konfigurator, Social-Kit, ESG-Bericht, Siegel auf Fremdseite), Footer mit Instagram; Welle 3: WKO-Siegel im Hero, Kennzahlen-Band, Mannschaft (`/uber-uns#mannschaft`, Teaser), Pressekontakt, Mediathek (leer und mit ersten Videos), `/hinweisgeberschutz` in beiden Schalterstellungen |
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
| Q-02 | `npm test` bzw. Sammelskript für alle `scripts/*.test.mjs` und Python-Tests | mittel |
| Q-03 | Ergebnis des Produktions-Builds (Koordinator) hier eintragen | hoch |
| Q-04 | Barrierefreiheits-Prüfung (z. B. automatisiert + manuell nach WCAG 2.2 AA) dokumentieren | hoch (BaFG) |
| Q-05 | Tests für `src/lib/heatmap.js` (Website-Validierung) und die Drosselung der API-Routen | mittel |
| Q-06 | Leistungsziele (Core Web Vitals) festlegen und messen | mittel |
| Q-07 | Test für den Kundenbühne-Rechenweg (`src/lib/kundenbuehne.js`) | mittel |
| Q-08 | Tests für `src/data/reels.js` (`mediathekSitemap`, Sortierung) und `scripts/reels-optimieren.mjs` (Eintrag zwischen den Markierungen) | niedrig |
| Q-09 | Prüfung, dass Kennzahlen nur aus `src/data/kennzahlen.js` stammen (Duplikate finden) | niedrig |
