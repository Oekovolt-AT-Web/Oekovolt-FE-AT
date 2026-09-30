# 07 – Betrieb und Deployment (Betriebsanleitung)

Gliederung in Anlehnung an ISO/IEC/IEEE 26514 (Informationen für Betreiber: Voraussetzungen, Konfiguration,
Abläufe, Wartung). Keine Normkonformität behauptet. Stand: Version 0.5, 30.09.2026 (Nachführung SEO-Welle P1–P9 und QA).

## 1. Voraussetzungen

| Komponente | Belegter Stand | Offen |
|---|---|---|
| Node.js | lokal v24.21.0 (Tests dieser Welle); `next` ^15.3.0 (installiert 15.5.19) | Mindestversion für das Hosting nicht festgelegt |
| Paketmanager | npm (`package-lock.json`) | – |
| Frappe-Backoffice | Frappe v15 mit MariaDB (laut `Import-Backend-Frappe/README.md`); Apps `oekovolt_app` und `oekovoltdeutchland` (Pfadnamen exakt, `docs/FRAPPE-AT-API-SPEZIFIKATION.md` Abschnitt 0) | Server/Anbieter, Backups |
| Hosting Website | Hinweise auf Vercel (`src/lib/rueckrufApi.js:10`) und `next start` (`next.config.mjs:3-6`) | Anbieter/Plattform **offen** |

## 2. Umgebungsvariablen der Website

Vollständige Liste aus `grep "process.env."` über `src/`, `scripts/` und `next.config.mjs` (30.09.2026, inkl.
Arbeitsbaum). Werte gehören **nie** ins Repository (`.gitignore`: `.env*`).

| Variable | Pflicht | Zweck | Verwendet in |
|---|---|---|---|
| `SERVER` | ja | Basis-URL des Frappe-Backoffice | `src/lib/apiBaseUrl.js:4`, `src/lib/rueckrufApi.js:16`, `src/lib/kanaele/frappe.js:9`, `src/lib/hinweisApi.js:13`, `src/app/api/image/route.js:81`, `src/lib/api/uber-uns/anfrageWeiterleiten.js:167` |
| `API_KEY`, `API_SECRET` | ja | Haupt-API-User „Website API“ (Projekte, Kontakt, Angebot, Solarrechner, Produkte, Kalender, Heatmap); Rückfall für eingeschränkte Keys | `src/lib/apiBaseUrl.js:5-6` u. a. |
| `KONTAKT_API_KEY`, `KONTAKT_API_SECRET` | empfohlen | eingeschränkter User für Solar-Lead/Scan und Rückruf-Helfer (Rückfall `API_KEY`) | `src/lib/rueckrufApi.js:17-18` |
| `KANAL_API_KEY`, `KANAL_API_SECRET` | für Newsroom/Push/Fediverse | User „Kanal Webservice“ | `src/lib/kanaele/frappe.js:10-11` |
| `KANAL_WEBHOOK_SECRET` | für Newsroom/Push | Geheimnis des Frappe-Webhooks (= `oekovolt_kanal_secret` in Frappe) | `src/app/api/kanaele/verteilen/route.js:20` |
| `CRON_SECRET` | optional | Bearer für Cron-Aufruf von `/api/kanaele/verteilen` | `src/app/api/kanaele/verteilen/route.js:20` |
| `KANAL_DEMO` | nur lokal | `1` = Demo-Einträge ohne Backoffice (nie in Produktion wirksam) | `src/lib/kanaele/demo.js:5` |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | für Web-Push | VAPID-Schlüsselpaar (einmalig erzeugen, danach nicht ändern) | `src/app/push/actions.js:8-9`, `src/lib/kanaele/push.js:10,41` |
| `VAPID_SUBJECT` | optional | Kontakt für Push-Dienste (Standard `mailto:office@oekovolt.at`) | `src/lib/kanaele/push.js:41` |
| `AP_PUBLIC_KEY`, `AP_PRIVATE_KEY` | für Fediverse | RSA-Schlüssel für HTTP-Signaturen (einmalig, nicht ändern) | `src/lib/kanaele/activitypub.js:24,74,131` |
| `HINWEIS_INTERN` | optional | `1` = eigenes Hinweisgebersystem (Formular, Postfach, API, Texte, Sitemap); leer/`0` = IntegrityLine (Redirect 307, API 503). **Build-Zeit-Schalter** – nach Änderung neu bauen; Ablauf in `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md` | `src/data/hinweisgeber.js:8`, `next.config.mjs:32-39`, `src/lib/hinweisApi.js` |
| `HINWEIS_API_KEY`, `HINWEIS_API_SECRET` | bei `HINWEIS_INTERN=1` | User „Hinweis Webformular“ (Rückfall `API_KEY`) | `src/lib/hinweisApi.js:14-15` |
| `CLOUDTALK_KEY_ID`, `CLOUDTALK_KEY_SECRET`, `CLOUDTALK_AGENT_IDS` | optional | Sofort-Rückruf über CloudTalk; Agent-IDs kommagetrennt (Reihenfolge = Priorität) | `src/lib/rueckrufApi.js:21-26` |
| `NEXT_PUBLIC_GA_ID` | optional | GA4-Mess-ID der **AT**-Property; ohne ID kein Analytics (kein Rückfall auf DE) | `src/components/Statistik/GoogleAnalytics.js:73` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | optional | Google-Search-Console-Verifizierung als Meta-Tag (Alternative: DNS) | `src/app/layout.js` |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | optional | Bing-Webmaster-Verifizierung (`msvalidate.01`) | `src/app/layout.js` |
| `INDEXNOW_AKTIV` | optional | `1` = Presse-Veröffentlichungen werden beim Kanal-Webhook per IndexNow gemeldet; sonst Trockenlauf | `src/lib/kanaele/veroeffentlichungen.js` |
| `UMAMI_SCRIPT_URL`, `UMAMI_WEBSITE_ID` | optional | Umami-Skript und Website-ID; beide nötig. Wirkt auch auf den Datenschutztext (zur Build-Zeit) | `src/components/Statistik/Umami.js:15-16`, Arbeitsbaum `src/components/Datenschutz/datenschutz.js` |
| `HEATMAP_TOKEN` | für Heatmap-Ansicht | Zugangstoken (≥ 16 Zeichen) für `…?heatmap=<TOKEN>`; gleicher Wert wie `oekovolt_heatmap_token` in Frappe; erzeugen z. B. `openssl rand -hex 24` | `src/app/api/heatmap/route.js:13,75`, `Import-Backend-Frappe/installation/website_env.txt` |
| `ALLOWED_LOCAL` | optional | erlaubter Origin für `/api/image` (Standard `https://www.oekovolt.com`) | `src/app/api/image/route.js:96` |
| `NEXT_DIST_DIR` | optional | alternatives Build-Verzeichnis (z. B. `.next-verify`) | `next.config.mjs:7` |
| `NODE_ENV`, `NEXT_PHASE` | automatisch | von Next.js gesetzt | `src/lib/baseUrl.js:9,19` u. a. |
| `DEBUG`, `PROJEKTE_TEST_MODUS` | nur Test | Steuerung von `scripts/projekte-fallback.test.mjs` | `scripts/projekte-fallback.test.mjs:63-65` |

Vorlage für AT: **`Import-Backend-Frappe/installation/website_env.txt`** – laut Kopfkommentar vollständig mit
`grep "process.env." src/` abgeglichen (Stand 30.09.2026), mit korrigierter Zuordnung von `KONTAKT_API_KEY`
(nur Solar-Lead-Methoden) und AT-Werten (`SERVER=https://backoffice.oekovolt.com`, Umami-URL `statistik.oekovolt.com`).
Die ältere Vorlage `Import-Frappe/5_website_env.txt` (DE-Stand) wird für AT nicht mehr gebraucht.
Hinweis: `NEXT_PUBLIC_*`, `UMAMI_*` und `HEATMAP_TOKEN` wirken ab dem nächsten Build.

### 2.1 Frappe-Site-Konfiguration (`site_config.json`, nicht im Repo)

Gesetzt durch `Import-Backend-Frappe/installation/site_config.sh` (Werte als Umgebungsvariablen übergeben,
z. B. `SITE=backoffice.oekovolt.com KANAL_SECRET=… HEATMAP_TOKEN=… bash …/site_config.sh`).

| Schlüssel | Zweck | Beleg |
|---|---|---|
| `website_url` | `https://www.oekovolt.com` – Fortsetzen-Link, Link zur visuellen Heatmap | `Import-Backend-Frappe/installation/site_config.sh:44` |
| `host_name` | öffentliche Adresse des Backoffice (absolute `bild_url`; muss `backoffice.oekovolt.com` sein) | ebd. `:45` |
| `oekovolt_kanal_webhook`, `oekovolt_kanal_secret` | Webhook der Website (`/api/kanaele/verteilen`), Secret = `KANAL_WEBHOOK_SECRET` | ebd. `:46-47` |
| `oekovolt_heatmap_token` | = `HEATMAP_TOKEN` der Website | ebd. `:48` |
| `anthropic_api_key`, `anthropic_model` | KI-Auswertung der Unterlagen (optional; ohne Key gehen Fotos ohne Auswertung an den Vertrieb) | ebd. `:51-52` |
| System-Zeitzone | Europe/Vienna (Termine, Rückruf-Zeiten, ICS, Heatmap-Monate) | Kommentar in `site_config.sh`, `apps/oekovoltdeutchland/README.md` |
| optional `oekovolt_drossel` | Drosselung je `ip_adresse` und Stunde anpassen (Standard Kontakt 5, Angebot 5, Solarrechner 10) | `apps/oekovolt_app/README.md` |
| optional `oekovolt_loeschfrist_monate` | Löschfrist Anfragen (Standard 24) | ebd. |
| optional `oekovolt_benachrichtigung_an`, `oekovolt_keine_kundenmail` | zusätzliche Empfänger, Bestätigungsmail an Kunden abschalten | ebd. |

## 3. Build und Deployment

### 3.1 Befehle (`package.json`)

| Befehl | Wirkung |
|---|---|
| `npm run dev` | `next dev --turbopack` |
| `npm run build` | `next build` |
| `npm run start` | `next start` |
| `npm run lint` | `next lint` |

### 3.2 Hinweis `.next`-Konflikt

`next dev` und `next build` im selben Verzeichnis überschreiben sich gegenseitig `.next`; ein laufender
Server (`next start` oder Dev-Server) liefert dann 500er. Abhilfe laut Code: Build in ein getrenntes
Verzeichnis, z. B. `NEXT_DIST_DIR=.next-verify npm run build` (`next.config.mjs:3-7`). Die Verzeichnisse
`.next-verify/`, `.next-dev/`, `.next-dev2/`, `.next-dev3/` sind in `.gitignore` ausgeschlossen. Für parallel
arbeitende Agenten gilt zusätzlich: kein `npm run build`/`dev` (`docs/AT-BRIEFING.md:100-102`).

### 3.3 Ablauf (Soll, aus den Unterlagen abgeleitet)

1. Umgebungsvariablen im Hosting setzen (Abschnitt 2); `SERVER`, `API_KEY`, `API_SECRET` auf das
   **österreichische** Backoffice (`docs/AT-UEBERGABE.md:63-66`).
2. Tests ausführen (Kapitel 06, Abschnitt 2).
3. Produktions-Build (bei laufendem Server in getrenntes Verzeichnis, 3.2).
4. Deploy auf das Hosting (**Verfahren offen**, keine Deploy-Konfiguration im Repo).
5. Nach dem Deploy: Search Console und Bing Webmaster (per DNS, siehe `docs/seo/Offpage-Fahrplan.md`), Sitemap einreichen,
   `node scripts/indexnow.mjs --trocken`, dann `node scripts/indexnow.mjs` (erster Lauf ohne Zustandsdatei meldet alle ca. 310 URLs;
   bricht ab, solange die Schlüsseldatei live 404 liefert). Zusätzlich `curl -A GPTBot https://www.oekovolt.com/kontakt` (Title vor `</head>`)
   und Rich-Results-Test. `docs/AT-UEBERGABE.md:71-72` beschreibt noch den alten Aufruf.
6. Kanal-Takt: Das Backoffice ruft den Webhook alle 5 Minuten selbst auf (`website_anstossen`); ein zusätzlicher Cron (`GET /api/kanaele/verteilen` mit `Authorization: Bearer $CRON_SECRET`) ist optional.
   Scheduler **offen**.

### 3.4 Sitemap, IndexNow, Feeds

| Artefakt | Quelle | Pflege |
|---|---|---|
| `sitemap.xml` | `src/app/sitemap.js` (feste `lastModified`-Daten, dynamisch Projekte/Jobs/Förderungen/Hersteller) | Datumskonstanten nur bei echter Inhaltsänderung anpassen (`src/app/sitemap.js:15-29`) |
| IndexNow | `scripts/indexnow.mjs` (alle Sitemap-URLs oder einzelne URLs als Argument), Schlüsseldatei `public/45250af1ed4ed419108eb76412d11547.txt` | nach jedem Deploy mit neuen/geänderten Seiten |
| `robots.txt` | `public/robots.txt` | – |
| `llms.txt`, `llms-full.txt` | `src/app/llms.txt`, `src/app/llms-full.txt` (automatisch aus Inhalten) | – |
| RSS/JSON-Feeds | `src/app/rss.xml`, `src/app/presse/{rss.xml,feed.json}`, `src/app/tv/{rss.xml,feed.json}` | aus Backoffice-Veröffentlichungen |

## 4. Regelmäßige Pflegeaufgaben

Aus `docs/AT-UEBERGABE.md:101-106`, ergänzt um Belege aus dem Code.

| Aufgabe | Intervall | Ort | Hilfsmittel |
|---|---|---|---|
| OeMAG-Marktpreis | monatlich | `src/data/einspeiseverguetung.js` | – |
| E-Control-Quartalsmarktpreise | quartalsweise | Inhalte/Daten | – |
| EAG-Fördercalls (nächster 08.–22.10.2026) | je Call | `src/lib/foerdercall.js` | `node scripts/foerdercall.test.mjs` |
| Landesförderungen (`STAND`) | mindestens vierteljährlich | `src/data/bundeslaender.js:13-22` | – |
| SNE-Verordnung 2027, IFB-Befristung (31.12.2026), Sachbezug E-Auto ab 2027 | anlassbezogen | Inhalte | – |
| KV-Werte Jobs | jährlich zum 1.1. | `src/data/stellen.js` | danach `node scripts/og-bilder.mjs` |
| Neue Ratgeber-Artikel/Stellen | anlassbezogen | `src/content/ratgeber/*`, `src/data/stellen.js` | `node scripts/ratgeber-index.mjs`, `node scripts/og-bilder.mjs` |
| Regionen-Erträge | bei Bedarf | `src/data/regionen-pvgis.json` | `node scripts/regionen-pvgis.mjs` |
| Tesseract-Dateien | nach Update von `tesseract.js` | `public/tesseract` | `node scripts/tesseract-assets.mjs` |
| Schneelast-Raster | bei neuen SNOWGRID-Daten / Kalibrierung | `data/schneelast/*` | `scripts/schneelast-raster-erzeugen.py` (Ablauf im Kopfkommentar: Download, venv mit `numpy`/`h5py`, Export kopieren), danach `node scripts/schneelast-raster.test.mjs` |
| Kundendaten (Rückfall) | bei neuen Referenzen / Änderungen beim Kunden | `src/data/kunden.js` (führend: Kundenfelder am Projekt im Backoffice) | Prüfdatum/`KUNDEN_STAND` anpassen |
| Netzbetreiber-Angaben | mindestens bei Änderungen der Netzbetreiber-Formulare/Preisblätter | `src/data/netzbetreiber.js` | `GEPRUEFT_AM` je Betreiber und `STAND` anpassen |
| Reels/Mediathek | bei neuen Videos | `reels-roh/` (nicht versioniert) → `public/videos/reels/`, `src/data/reels.js` | ffmpeg installieren (`winget install Gyan.FFmpeg`), `node scripts/reels-optimieren.mjs`, Titel/Beschreibung/Kategorie/Datum ergänzen; Musikrechte prüfen |
| Unternehmenskennzahlen | bei neuen Zahlen, mindestens jährlich | `src/data/kennzahlen.js` (+ Textstellen `src/data/unternehmen.js`, `src/lib/llms.js`, `src/app/page.js`) | `KENNZAHLEN_STAND` anpassen, danach `llms.txt` neu erzeugt (Build) |
| **OeMAG-Marktpreis** | **monatlich**, Anfang des Folgemonats (nächster: Wert September 2026 Anfang Oktober) | `src/data/oemag.js` (`OEMAG_MONATE`, `REFERENZMARKTWERT_PV`, Quartalspreise, `NAECHSTE_VEROEFFENTLICHUNG`, `STAND.geprueftAm`) | `node scripts/einspeisung.test.mjs`; ohne Pflege erscheint nach 35 Tagen ein Warnhinweis (ab 05.11.2026); Ratgeber `oemag-marktpreis.js` mitziehen |
| Widmung/Beschleunigungsgebiete | vierteljährlich | `src/lib/flaeche/laender.js` (`STAND`) | `node scripts/flaeche.test.mjs` |
| EG-Netzentgelt-Abschläge ab 2027 | sobald Tarifverordnung/SNE-G-V veröffentlicht | `src/lib/egBetriebe.js`, `NahebereichStufen.js` | `node scripts/eg-betriebe.test.mjs` |
| Vergabe-/Förderkarten Gemeinden | nach 22.10.2026 (EAG-Call) und bei neuer Klimafonds-Ausschreibung | `src/app/kommunen/vergabe-foerderung/page.js`, `src/lib/kommunen/*` | `node scripts/kommunen-vergabe.test.mjs` |
| Lastgang-Beispieldatei | bei Änderung von `beispielCsv()` | `public/beispiele/lastgang-beispiel.csv` | Test meldet veraltete Datei |
| Alle Node-Tests | vor jedem Commit/Deploy | `scripts/*.test.mjs` | `node scripts/alle-tests.mjs` |
| Sitemap-Änderungsdaten | bei sichtbaren Inhaltsänderungen | `GEAENDERT` in `src/app/sitemap.js`; Listen `NICHT_INDEXIERT` (`src/lib/llms.js`) und `WEITERGELEITETE_HERSTELLER` (`src/app/sitemap.js`) mit `next.config.mjs` synchron halten | danach IndexNow |
| IndexNow-Zustand | automatisch | `scripts/indexnow-zustand.json` (in `.gitignore`, liegt nur auf dem ausführenden Rechner) | bei Rechnerwechsel `--nur-zustand` für eine Ausgangsbasis |
| Fachprüfer freischalten | nach Einwilligung | `src/data/fachpruefer.js` (`einwilligung`, Rolle, Qualifikation) | – |
| Offpage-Maßnahmen | laut Fahrplan | `docs/seo/Offpage-Fahrplan.md` (Go/No-Go 05.10., Story 1 bis 06.10.) | außerhalb des Repos |
| Mannschaft & Maschinenpark | bei Änderungen | `src/data/mannschaft.js` | neue Einträge mit Quelle, `bestaetigt` erst nach Freigabe |
| Fotos nachreichen | einmalig | `public/Images/AT/unternehmen/oekovolt-lkw.jpg` (optional `…-traktor.jpg`), `public/Images/AT/team/` (Pressekontakt) | Formatvorgaben im Kopfkommentar von `src/data/mannschaft.js` bzw. `PresseKontakt.js`; Bildquelle dokumentieren |
| Backoffice-Korrekturen | laufend | Frappe | `docs/Backoffice-Korrekturen.md` (Sichtbarkeit nach ≤ 10 min, `revalidate: 600`) |
| Kennzahlen Startseite (werbliche Aussagen) | regelmäßig | `src/data/hero.js` | – |
| Projektdokumentation | nach jeder Arbeitswelle vor dem Commit | `docs/projekt-doku/` | Pflegeprozess in 00 |

## 5. Backoffice-Installation

| Paket | Stand | Anleitung |
|---|---|---|
| **`Import-Backend-Frappe/`** (maßgeblich für AT) | laut Auftraggeber vollständig (nicht committet): `apps/oekovolt_app` (Projekte inkl. Kundenfelder, Referenzkarte, Kontakt, Angebot, Solarrechner, Termine mit AT-Feiertagen, Löschfristen), `apps/oekovoltdeutchland` (Produktseiten, Hersteller, Heatmap + Bericht, Bestand AT-angepasst: Rückruf, Solar Lead, Kanäle, Hinweisgebersystem, Beratungstermin, PV Analyse), `installation/` (`installieren.sh` idempotent inkl. Backup und `migrate`, `site_config.sh`, `rollen.csv`, `website_env.txt`) | `Import-Backend-Frappe/README.md` (Installation in 7 Schritten, Abnahme per curl, Tests), `apps/*/README.md` |
| `Import-Frappe/` | älterer DE-Stand; laut `Import-Backend-Frappe/README.md` für AT nicht mehr nötig | `Import-Frappe/ANLEITUNG.md` |
| Schnittstellenvertrag | – | `docs/FRAPPE-AT-API-SPEZIFIKATION.md` (inkl. #15/#16 Heatmap, Kundenfelder #1/#2) |

Kurzablauf (aus `Import-Backend-Frappe/README.md`): Backup → Ordner auf den Server kopieren →
`SITE=… BENCH=… bash installation/installieren.sh` → `site_config.sh` → API-User je Rolle anlegen und Schlüssel in die
Website-Umgebung → E-Mail-Konto und Scheduler aktivieren, Mitarbeiterrollen vergeben → Website neu bauen und deployen →
Abnahme (curl + Durchklicken).

Täglich/zyklisch laufende Backoffice-Jobs (laut `apps/oekovoltdeutchland/README.md`, Abschnitt Hooks, und
`apps/oekovolt_app/README.md`): Löschfristen (Hinweis, Rückruf, Beratungstermin, PV Analyse, Solar Lead, Heatmap,
Anfragen, Website-Termine), alle 5 min geplante Veröffentlichungen und Webhook an die Website, alle 15 min
Erinnerungsmails Solar Lead.

## 5a. Kapazitätsgrenzen externer Dienste und Zwischenspeicher

| Dienst / Speicher | Grenze | Genutzt von | Hinweis |
|---|---|---|---|
| Open Topo Data (öffentlich, EU-DEM) | 1 Anfrage/s, **1.000 Anfragen/Tag** | `/api/standort` und `/schneelast/richtwert` (gemeinsam) | bei viel Verkehr eigenen Zugang oder eigene Höhendatei einplanen; Rückfall PVGIS-Seehöhe nur im Standort-Check |
| GeoSphere Data Hub | 5/s, 240/h je ausgehender IP | `/api/pv-prognose` | eigener Deckel 200/h; v1-Datensätze enden am 04.11.2026 (verwendet wird v2) |
| Nominatim | 1/s | Adresssuche | unverändert |
| **In-Memory-Caches und -Zähler** | je Serverprozess/Instanz, gehen beim Neustart verloren | Standort-Dienste, PV-Prognose (auf `globalThis`), Drosselungen aller Routen | bei mehreren Instanzen (z. B. Serverless) gelten Budgets und Drosselungen je Instanz – für zentrale Zähler wäre ein gemeinsamer Speicher (Redis/KV) nötig |

### 5b. Entwicklungsumgebung

`next dev` belegte bei parallelen Abrufen bis zu ca. **15,8 GB RAM** und ist dabei abgestürzt (QA-Bericht, 30.09.2026;
Neustart unter neuer Prozess-ID). Bei Prüfläufen gegen den Dev-Server Abrufe nicht parallelisieren und Speicherverbrauch
beobachten; für Crawls besser einen Produktions-Build in eigenem Verzeichnis nutzen (`NEXT_DIST_DIR`, siehe 3.2). R-52.

## 6. Störungen – Erstmaßnahmen

| Symptom | Wahrscheinliche Ursache | Maßnahme | Beleg |
|---|---|---|---|
| Formulare melden „Server vorübergehend nicht erreichbar“ | `SERVER`/Keys fehlen oder Backoffice down | Env prüfen, Backoffice erreichbar? | `src/lib/backendFehler.js:13` |
| Referenzen zeigen alten Stand | API liefert nicht → statischer Rückfall | `get_projekte` prüfen | `src/components/Project/ladeProjekte.js:4-7` |
| Standort-Check ohne Schneelast-Richtwert | Rasterdatei fehlt/unstimmig (Log „Dateien unstimmig“) oder Seehöhe > 2.000 m | Dateien und `outputFileTracingIncludes` prüfen | `src/lib/standort/schneelastRaster.js:121`, `next.config.mjs:14-15` |
| 429 bei Standort-Check | IP-Drosselung | abwarten (10-min-Fenster) | `src/app/api/standort/route.js:30-45` |
| 500er nach Build während laufendem Server | `.next`-Konflikt | getrenntes `NEXT_DIST_DIR` | `next.config.mjs:3-7` |
| Hinweisgeber-Meldung 503 | `HINWEIS_INTERN` nicht gesetzt (gewollt) | – | `src/lib/hinweisApi.js:18-21` |
| Hinweisgebersystem zeigt nach Umschalten alten Stand | `HINWEIS_INTERN` wirkt erst ab dem nächsten Build | neu bauen und deployen | `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md` |
| PV-Prognose zeigt älteren Modelllauf | GeoSphere-Budget erschöpft → Antwort aus Cache (bis 12 h) | abwarten; Budget/Zellgröße prüfen | `src/lib/prognose/geosphere.js:19-25` |
| `/einspeisung-gewerbe` zeigt Warnhinweis | `STAND.geprueftAm` älter als 35 Tage | Monatswert eintragen | `src/data/oemag.js:26` |
| Schneelast-Richtwert „–“ auf Bundesland-Hubs | Raster bei ISR nicht ausgeliefert | `outputFileTracingIncludes` für `/photovoltaik-bundesland/[land]` prüfen | `next.config.mjs` |
