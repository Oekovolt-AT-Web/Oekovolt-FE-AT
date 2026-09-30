# 08 – Konfigurationsmanagement und Änderungsprotokoll

Gliederung in Anlehnung an den Konfigurationsmanagement-Prozess von ISO/IEC/IEEE 12207 (Identifikation,
Änderungssteuerung, Statusbericht). Keine Normkonformität behauptet. Stand: Version 0.4, 30.09.2026 (Nachführung Welle 4).

## 1. Konfigurationseinheiten

| Einheit | Ort | Versionierung |
|---|---|---|
| Website-Quellcode | Repository `Oekovolt-FE-AT` (Remote `github.com/Oekovolt-AT-Web/Oekovolt-FE-AT`) | Git |
| Abhängigkeiten | `package.json`, `package-lock.json` | Git |
| Datenbestände | `src/data/*`, `src/content/*`, `data/schneelast/*` | Git (Raster als Binärdatei) |
| Frappe-Pakete | `Import-Backend-Frappe/` (maßgeblich für AT, in `add3074` committet), `Import-Frappe/` (DE-Stand, für AT nicht mehr nötig) | Git |
| Laufzeitkonfiguration | Umgebungsvariablen (Hosting), Frappe `site_config.json` | **nicht** in Git (bewusst); Stand je Umgebung offen |
| Backoffice-Inhalte | Frappe-Datenbank | außerhalb Git |
| Projektdokumentation | `docs/projekt-doku/` (Version 0.4, Version 0.3 in `add3074` committet) | Git (noch nicht committet) |

## 2. Branch-Modell (Ist, aus `git log`/`git branch -a` abgeleitet)

| Branch | Rolle | Beleg |
|---|---|---|
| `main` | Hauptzweig; letzter Commit `922a0a1` (27.09.2026); früher über Pull Requests aus `develop` gespeist (Merge-Commits „Merge pull request 'develop' (#…)“) | `git log main` |
| `develop`, `general` | historische Arbeitszweige (nur in Merge-Nachrichten sichtbar, nicht mehr als Branch vorhanden) | Merge-Commits `3c5c0b0`, `3090dbf` |
| `redesign-2026` | früherer Upstream-Zweig (Merge `3034c02`) | `git log` |
| `at-launch` | **aktueller Arbeitszweig** für die österreichische Website; zweigt bei `922a0a1` von `main` ab; 7 Commits voraus; lokal 1 Commit vor `origin/at-launch` (`11472bf` nicht gepusht) | `git log main..at-launch`, `git status -sb` |

Offen: Zielprozess für den Livegang (Merge `at-launch` → `main`? Tagging? Review/Freigabe?). Hinweis:
`docs/AT-UEBERGABE.md:3` nennt den Branch „lokal, nicht gepusht“ – inzwischen existiert `origin/at-launch`.

## 3. Commit-Konventionen (Ist)

Abgeleitet aus `git log` (keine schriftliche Konvention im Repo):

- Sprache Deutsch (ältere Commits teils Englisch, z. B. „fixed the meta data and title“).
- Betreffzeile als Sammelbeschreibung der Welle, Bereiche durch Komma bzw. Semikolon getrennt
  (z. B. `11472bf`: „EAG-Fördercall-Seite, Schneelast-Richtwert aus GeoSphere-Daten, …“).
- Bei größeren Wellen Rumpf mit Spiegelstrichen je Änderung (`11472bf`).
- KI-unterstützte Commits enden mit der Zeile `Co-Authored-By: Claude …` (28 Commits in der Historie).
- Kein Ticket-/Issue-Bezug, keine Präfixe (kein Conventional-Commits-Schema).
- Mehrere Autor-Identitäten derselben Personen (unterschiedliche Schreibweisen von Name/E-Mail).

Empfehlung (Vorschlag, nicht verbindlich): Betreffzeile ≤ 72 Zeichen + Rumpf mit Spiegelstrichen je Bereich;
Verweis auf Anforderungs-IDs (`REQ-…`) aus Kapitel 01, damit die Matrix in Kapitel 10 nachgeführt werden kann.

## 4. Änderungsprotokoll (Changelog)

Format in Anlehnung an „Keep a Changelog“. Kategorien: Hinzugefügt · Geändert · Behoben · Entfernt · Sicherheit.
Einträge werden beim Nachführen aus `git log` und `git diff --stat` gebildet.

### [Unveröffentlicht] – Arbeitsbaum am 30.09.2026 nach Welle 4 (nicht committet)

Umfang gegenüber `add3074` laut `git status` / `git diff --shortstat`: 58 geänderte versionierte Dateien
(+2.422/−699 Zeilen, einschließlich dieser Dokumentation), dazu 62 neue, nicht versionierte Pfade.

**Hinzugefügt**
- PV-Prognose `/pv-prognose` mit `/api/pv-prognose` (GeoSphere NWP v2 und Ensemble v2, Cache je Zelle/Lauf, Budget 200/h),
  `src/lib/prognose/*`, `src/components/Prognose/*`.
- Schneelast-Karte `/schneelast`, 9 Länderseiten, `/schneelast/richtwert`, `/schneelast/karte.png` (`src/lib/schneelast/*`,
  `src/components/Schneelast/*`); Redirect `/schneelast` → `/standort-check` entfernt.
- `/einspeisung-gewerbe` mit `src/data/oemag.js` und `src/lib/einspeisung.js`.
- `/energiegemeinschaften/betriebe-gemeinden` (`src/lib/egBetriebe.js`, `src/components/EGBetriebe/*`).
- `/kommunen/vergabe-foerderung` (`src/lib/kommunen/*`, `src/components/KommunenVergabe/*`).
- `/flaechen-check` und `/freiflaechen-photovoltaik/widmung` + Landesseiten (`src/lib/flaeche/*`, `src/components/FlaechenCheck/*`).
- `/rechner/finanzierung` (`src/lib/rechner/finanzierung.js`, `src/components/RechnerFinanzierung/*`).
- Teilen-Link und PDF-Bericht in 8 Gewerbe-Rechnern (`src/components/RechnerTeilen/*`).
- `/lastgang-analyse` (nur im Browser) mit `src/lib/lastgang/*` und `public/beispiele/lastgang-beispiel.csv`.
- A/B-Test-Infrastruktur `src/lib/experimente.js`, `src/components/Experimente/*`, Erweiterung `src/middleware.js` (K1 inaktiv).
- Bundesland-Hubs `/photovoltaik-bundesland/[land]` (`src/lib/bundesland/*`, `src/components/Bundesland/*`).
- Test-Sammellauf `scripts/alle-tests.mjs`, `scripts/lib/` und 18 neue Testdateien (21 insgesamt, alle grün).
- Datenschutz-Doku AT: `docs/datenschutz/00-Uebersicht-VVT.md`, `VVT-Anfragen.md`, `VVT-Heatmap.md`, `VVT-Kundenbuehne.md`,
  `VVT-Lastgang-Analyse.md`, `VVT-Mediathek.md`.
- Projektdoku 0.4 mit neuem Kapitel `11-seo.md` und Anhang `anhang/seo-umsetzungsplan-2026-09-30.md`.

**Geändert**
- Integration: Sitemap (laut Koordinator 311 URLs), Navigation, Querverweise (`src/data/verlinkung.js`), Rechner-Hub
  (`src/app/rechner/page.js`, `src/components/Rechner/tools.js`), Tracing für `/schneelast/richtwert` und
  `/photovoltaik-bundesland/[land]` (`next.config.mjs`); Links von `/energiegemeinschaften`, `/kommunen`,
  `/freiflaechen-photovoltaik`, `/photovoltaik`, `/photovoltaik/[stadt]`, Pacht-Rechner.
- Performance/Barrierefreiheit: Schriften nur „latin“, `HeroVideo`, Cookie-Banner im Footer per `next/dynamic`,
  `RevealObserver`, Kontrastregel in `globals.css`, `Teilen.js`, `icons.js`.
- Kennzahl Gesamtleistung 510.000 kWp (vorher 340.000) in `src/data/kennzahlen.js`; `zahlText()` mit Dezimalkomma.
- Befunde behoben: tests-01 (`profile.js`), tests-02 (`kennzahlen.js`), tests-03 (`pacht.js`), tests-05 (`wallbox.js`).
- Bestehende Datenschutz-Dokumente auf AT angepasst.

**Offen / nicht übernommen:** siehe 00 (P26–P32) und 09 (R-35 bis R-51).

### [add3074] – 30.09.2026 (Wellen 2 und 3)

Commit „Heatmap, Backend-Paket, Netzanmeldung, Kundenbühne, Mediathek, Mannschaft, Kennzahlen, Hinweisgeber-Schalter,
ISO-Doku, Sicherheitsfixes“. Inhalt wie bis Version 0.3 unter „Unveröffentlicht“ geführt:

#### Welle 3

**Hinzugefügt**
- Zentrale Unternehmenskennzahlen `src/data/kennzahlen.js` (5.000 PV-Kraftwerke, 340.000 kWp, 112.000 t CO₂, nur
  Ökovolt Österreich; CO₂-Zeitraum offen), genutzt in `hero.js` (`KERNFAKTEN`), Presse, Referenzliste und Referenzkarte.
- Abschnitt „Eigene Mannschaft & Maschinenpark“: `src/data/mannschaft.js` (Einträge mit `bestaetigt`-Flag),
  `src/components/Mannschaft/*`, `/uber-uns#mannschaft`, Teaser auf der Startseite.
- Pressekontakt `src/components/Presse/PresseKontakt.js` auf `/presse#kontakt` (Foto folgt, Initialen als Rückfall).
- Mediathek, selbst gehostet: `src/data/reels.js`, `src/components/Reels/*`, `/mediathek`, `/mediathek/[slug]`
  (`VideoObject`), `scripts/reels-optimieren.mjs`; Abschnitt auf Startseite und `/presse`, Menüpunkt „Mediathek“,
  Sitemap über `mediathekSitemap` (leer bis Videos vorhanden); `reels-roh/` in `.gitignore`.
- `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md` (Umstellung IntegrityLine → eigenes System).
- `public/Images/AT/QUELLEN-siegel.md` (Quellen der WKO-Siegel).

**Geändert**
- Hinweisgebersystem über den Build-Zeit-Schalter `HINWEIS_INTERN` (`src/data/hinweisgeber.js`, `next.config.mjs`,
  `src/lib/hinweisApi.js`, `/hinweisgebersystem`, `/hinweisgeberschutz`, Datenschutz); AT-Kategorien im Backend
  (`hinweis.json`) ergänzt.
- `/hinweisgebersystem` von GA4 und Umami ausgenommen.
- `gedrosselt()` drosselt ohne ermittelbare IP nicht mehr (statt gemeinsamem Kontingent).
- 30 MWp nur noch als Meilenstein 2021; Startseiten- und SEO-Text, `unternehmen.js`, `llms.js` auf die neuen Kennzahlen.
- Barrierefreiheitserklärung folgt dem Schalter: mit `HINWEIS_INTERN=1` gehört das eigene Hinweisgebersystem zum Geltungsbereich, sonst wird das externe Portal als Drittdienst genannt (`src/app/barrierefreiheit/page.js`).

**Bereits in Welle 2 erfasst, vom Koordinator erneut genannt:** Instagram in Footer/`sameAs`, Kundenbühne-Konfiguration
(Siegel-Cache, Tracing), AT-Logo in `src/lib/analyse/logo-hell.png`, Netzanmeldung in Sitemap/Navigation/Querverweisen.

#### Welle 2

(Stand nach Welle 2: 40 geänderte/gelöschte versionierte Dateien, +432/−208 Zeilen, 22 neue Pfade.)

**Hinzugefügt**
- Klick-/Scroll-Heatmap (nur mit Einwilligung „Statistik“): `src/lib/heatmap.js`, `src/app/api/heatmap/route.js`,
  `src/components/Statistik/{Heatmap,HeatmapSammler,HeatmapAnsicht}.js`, Einbindung in `LayoutWrapper.js`;
  Bibliothek `heatmap.js` ^2.0.5 für die Ansicht (vom Auftraggeber gewünscht). Backend: DocTypes Heatmap Zelle/Scroll/Seite,
  Bericht „Heatmap Auswertung“, Aufbewahrung ≤ 14 Monate, ≤ 2.000 Pfade je Gerät und Monat.
- Frappe-Backend-Paket `Import-Backend-Frappe/` (vollständig laut Auftraggeber): `apps/oekovolt_app` (Projekte inkl.
  Kundenfelder, Referenzkarte, Kontakt, Angebot, Solarrechner, Termine; Anonymisierung von Anfragen nach 24 Monaten),
  `apps/oekovoltdeutchland` (Produktseiten, Hersteller, Heatmap, Bestand AT-angepasst; Hinweis-Löschfrist 5 Jahre),
  `installation/` (`installieren.sh`, `site_config.sh`, `rollen.csv`, `website_env.txt`), `README.md`;
  Tests `test_termin_logik.py` (37), `test_heatmap_logik.py` (18), `pruefe_vertrag.py` (186 Prüfungen).
- Netzanmeldung: `/netzanmeldung`, fünf Betreiberseiten, druckbare Checkliste (`src/app/netzanmeldung/**`,
  `src/components/Netzanmeldung/*`, `src/data/netzbetreiber.js`); eingetragen in Sitemap, Navigation und Querverweisen.
- Kundenbühne je Referenzprojekt: Kundenporträt, Solar-Siegel (`/siegel/<slug>`, Cache 1 Tag), Social-Media-Kit
  (Bilder per `next/og`), ESG-Kurzbericht (`src/app/referenzen/projekte/[title]/{siegel,teilen,esg,bild}`,
  `src/app/siegel/[slug]/route.js`, `src/components/Kundenbuehne/*`, `src/lib/kundenbuehne*.js`); Kundendaten
  `src/data/kunden.js` (52 Kunden, 6 bewusst weggelassen).
- Konfetti nach erfolgreichen Anfragen ohne Bibliothek (`src/lib/konfetti.js`, 11 Aufrufstellen, nicht im
  Hinweisgebersystem, respektiert „Bewegung reduzieren“).
- Erzeugungsskript Schneelast-Raster `scripts/schneelast-raster-erzeugen.py` (inkl. Ausschluss von Gletscherzellen).
- WKO-Siegel (Meisterbetrieb, Elektrotechnik) im Hero der Startseite (`src/app/page.js`, Bilder `public/Images/AT/siegel/`).
- Projektdokumentation `docs/projekt-doku/` (Version 0.1 und 0.2); Ergänzung `docs/FRAPPE-AT-API-SPEZIFIKATION.md`
  (Kundenfelder bei #1/#2, Heatmap #15/#16, Abschnitt 5a).

**Geändert**
- SEO: 301 für 7 alte Hersteller-Slugs (`next.config.mjs`), hreflang auf 28 gemeinsame Pfade (`src/lib/hreflang.js`),
  Organisations-Schema ohne `parentOrganization`, mit `contactPoint`/`brand`, Instagram in `sameAs` und Footer
  (`src/app/layout.js`, `src/lib/site.js`, `src/components/Reusable/footer.js`), Presse-Detailseiten und Netzanmeldung
  in der Sitemap (`src/app/sitemap.js`), Ratgeber-`author` nur als `@id`.
- Anfrage-Routen Kontakt, Angebot, Rückruf, Termin mit Drosselung und Größenlimit (`gedrosselt`, `leseJson`).
- `/api/image` nur noch für `/files/…`.
- Cookie-Banner und Datenschutzerklärung: Heatmap (Kategorie „Statistik“, 14 Monate), Umami nur bei gesetzten Variablen.
- PDF-Analyse und Ergebnisbild mit AT-Logo (`src/lib/analyse/logo-hell.png`).
- Kontaktseite, einzelne Ratgeber-Seiten und Referenz-Detailseite angepasst.

**Entfernt**
- `src/app/api/optimize-video/route.js` (offener Proxy, S1).
- Rewrite `/api/backoffice/:path*` in `next.config.mjs` (S3).
- `src/components/Photovoltaik/Region.js` (ungenutzt, Löschung gewollt).

**Sicherheit**
- S1–S4 aus Kapitel 05 behoben; offen: CSP, In-Memory-Drosselung je Instanz, `X-Forwarded-For`, `baseUrl.js` (toter Code).

### [11472bf] – 30.09.2026

**Hinzugefügt**
- Landingpage `/forderungen/eag-foerdercall` (Countdown, Checkliste, Schnellrechner, Kalenderdatei, FAQ), Hinweisleiste Startseite.
- Standort-Check: automatischer Schneelast-Richtwert aus SNOWGRID-CL (CC BY 4.0) in `data/schneelast`; HORA weiterhin ohne Abfrage.
- Referenzen: statischer Stand der 58 Live-Projekte als Rückfall (Liste, Detail, Karte, Startseite, Sitemap).
- Messung: Umami (cookielos) eingebunden, Herkunft bei Angebot/Termin/Rückruf, neue Ereignisse.
- Tests `scripts/schneelast-raster.test.mjs`, `scripts/foerdercall.test.mjs`, `scripts/projekte-fallback.test.mjs`.
- `docs/FRAPPE-AT-API-SPEZIFIKATION.md`.

**Geändert**
- EAG-Förderung über 1.000 kWp anteilig, 30-%-Deckel netto/brutto nach Vorsteuerabzug.
- Konfigurator übernimmt kWp aus Rechnern im Gewerbe-Modus; Rückruf zeigt alle Themen.
- Datenschutzerklärung ergänzt (rechtlich prüfen).

**Behoben**
- Solarrechner-PDF akzeptiert 4-stellige PLZ.

### [5e40806] – 29.09.2026
**Geändert** – Speicher-Partnerseiten ohne Backoffice zur Laufzeit rendern (kein 404 aus dem Build); Übergabedokument ergänzt.

### [8ba0af9] – 29.09.2026
**Geändert** – Kennzahlenband über der Hero-Kante; Unternehmensseiten, Lösungen B, Schneelast-Begriffe, Rechner-Querverweise.

### [34f035c] – 29.09.2026
**Hinzugefügt** – 8 Gewerbe-Rechner, Rechner-Hub, neue Startseite, AT-Logo.
**Geändert** – visuelle Überarbeitung Lösungen, Technik, Service, Förderungen, Produkte, Regionen, Wissen; einheitliches Zahlenformat.

### [96d2e57] – 29.09.2026
**Hinzugefügt** – Ratgeber komplett (69 Artikel), Bildnachweis, OG-Bilder, Querverweise, Übergabedokument.
**Geändert** – Sitemap-Bereinigung.

### [e3f8fd9] – 29.09.2026
**Hinzugefügt** – Recht, Förderungen, Lösungen, Technik, Service, Regionen, Rechner, Lexikon, Ratgeber (Zwischenstand; 489 Dateien).

### [bfa32f1] – 28.09.2026
**Geändert** – AT-Basis: Domain oekovolt.com, Firmendaten, Schema, Navigation, Footer.

### Vorgeschichte (`main`, bis 27.09.2026)
Übernahme der deutschen Website (oekovolt.de) als Ausgangsbasis, u. a. Formulare auf `oekovolt_app`-API (`e05f108`),
GA statt Umami (`889295d`), UI-Korrekturen (`7dd016d`), Hinweisgebersystem vorerst über IntegrityLine (`922a0a1`).
Details: `git log main`.

## 5. Statusbericht Konfiguration (30.09.2026, nach Welle 4)

| Punkt | Stand |
|---|---|
| HEAD | `add3074` auf `at-launch` (enthält Wellen 2 und 3) |
| Remote | nicht erneut geprüft (Stand 0.3: `origin/at-launch` einen Commit zurück) |
| Arbeitsbaum | 58 versionierte Dateien geändert, 62 neue Pfade (Welle 4, siehe „Unveröffentlicht“) |
| Zeilenenden | Git meldet LF→CRLF-Umwandlung für mehrere Dateien (`.gitattributes` vorhanden) – unkritisch, beim Commit beachten |
| Nächster Schritt | Commit der Welle 4 durch den Koordinator; danach „Unveröffentlicht“ datieren |
