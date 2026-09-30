# 03 – Schnittstellenbeschreibung

Informationseinheit „Schnittstellenbeschreibung“ in Anlehnung an ISO/IEC/IEEE 15289 / 29148.
Keine Normkonformität behauptet. Stand: Version 0.4, 30.09.2026 (Nachführung Welle 4).

**Führendes Dokument für die Frappe-Methoden ist `docs/FRAPPE-AT-API-SPEZIFIKATION.md`** (Methoden #1–#14,
Auth, Fehlerabbildung, Rollen, Abnahmetest). Dieses Kapitel dupliziert das nicht, sondern ergänzt:
(1) die Next-API-Routen der Website, (2) Frappe-Methoden, die dort noch fehlen (Heatmap),
(3) Hinweise, wo Code und Spezifikation voneinander abweichen.

## 1. Allgemeine Regeln (Kurzfassung mit Verweis)

| Regel | Beleg |
|---|---|
| Aufruf `${SERVER}/api/method/<pfad>`, Header `Authorization: token KEY:SECRET` | `src/lib/apiBaseUrl.js:4-19` |
| Website liest `message`; Fehlerabbildung 409/422/429/502 | `src/lib/backendFehler.js:7-15`, Spezifikation Abschnitt 0 |
| `ip_adresse` wird von der Website gesetzt | `src/lib/ipAdresse.js:6-10` |
| Inhalte `revalidate: 600`, Kalender `no-store` | Spezifikation Abschnitt 0 |

## 2. Next-API-Routen (`src/app/api/**`)

Legende Auth: **öffentlich** = ohne Anmeldung aufrufbar · **Secret** = gemeinsames Geheimnis · **Token** = `HEATMAP_TOKEN`.

### 2.1 Anfrage-Strecken

| Route | Methode | Weiter an | Schutzmaßnahmen in der Route | Beleg |
|---|---|---|---|---|
| `/api/create_contact` | POST | `oekovolt_app.website_api.kontakt.submit_kontakt` (#4) | IP serverseitig; Drosselung je IP 5/10 min (`gedrosselt`), Body ≤ 24.000 Byte (`leseJson`, sonst 413); Honeypot und zusätzliche Drosselung im Backoffice | `src/app/api/create_contact/route.js:11-28`, `src/lib/api/uber-uns/anfrageWeiterleiten.js:102-150` |
| `/api/create_anfrage` | POST | `…angebot.submit_angebot` (#5) | wie oben (Formular „angebot“) | `src/app/api/create_anfrage/route.js:8-28` |
| `/api/analyse/pdf` | POST | `…solarrechner.submit_solarrechner` (#8, multipart) | Drosselung global 60/10 min und je E-Mail 5/24 h; Honeypot + Mindestausfülldauer | `src/app/api/analyse/pdf/route.js:16,52-73` |
| `/api/rueckruf` | POST | `…termin.buche_termin` (#6, ohne Token) | IP serverseitig; Drosselung 5/10 min, Größenlimit | `src/app/api/rueckruf/route.js:7-25` |
| `/api/termin` | POST | `…termin.buche_termin` (#6) | IP serverseitig; Drosselung 5/10 min, Größenlimit | `src/app/api/termin/route.js:7-25` |
| `/api/termin/kalender` | GET `?terminart=&tage=` | `…termin.get_kalender` (#7) über `src/lib/terminKalender.js` (Slot-Bildung `src/lib/terminSlots.js`); ohne Backoffice lokale Ersatz-Slots laut Spezifikation #7 | nur bekannte Terminarten, `tage` 1–30, `no-store` | `src/app/api/termin/kalender/route.js:14-28` |
| `/api/award`, `/api/sponsoring`, `/api/partner-registrierung` | POST | `…kontakt.submit_kontakt` (#4) mit eigenem `thema` | Größenlimit 24 kB, Säubern/Validieren, Honeypot, Drosselung je IP, Timeout 15 s | `src/lib/api/uber-uns/anfrageWeiterleiten.js:1-26,92,135` |
| `/api/scan/start`, `/api/scan/fortsetzen`, `/api/scan/[token]/{verbunden,status,foto,abschliessen}` | POST/GET | `…doctype.solar_lead.api.*` (#12: `sitzung_starten`, `sitzung_status`, `sitzung_verbunden`, `foto_speichern`, `sitzung_abschliessen`, `fortsetzen_info`, `fortsetzen_starten`) mit `KONTAKT_API_KEY` (Rückfall `API_KEY`, `src/lib/rueckrufApi.js:17-18`); Token nur als SHA-256-Hash in Frappe, 45 min gültig (`src/lib/scan/backend.js:7-8,17`) | Drosselung (z. B. 40/10 min global, 5/h je E-Mail), Honeypot + Mindestdauer; Header noindex/no-referrer/no-store | `src/app/api/scan/start/route.js:19-38`, `src/lib/scan/backend.js`, `next.config.mjs` (headers `/scan`, `/fortsetzen`) |
| `/api/hinweis`, `/api/hinweis/postfach` | POST | `…doctype.hinweis.api.*` (#14) | nur bei `HINWEIS_INTERN=1` (Build-Zeit), sonst 503 `nicht_konfiguriert`; Drosselung, Honeypot, Mindestdauer; Kategorien Website ↔ Backend abgeglichen (AT-Kategorien in `hinweis.json` ergänzt) | `src/app/api/hinweis/route.js:16-26`, `src/lib/hinweisApi.js`, `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md` |
| `/api/hinweis/health` | GET | `…hinweis.api.ping` | Monitoring: 200/503 | `src/app/api/hinweis/health/route.js` |

### 2.2 Werkzeuge und Daten

| Route | Methode | Ziel | Hinweise | Beleg |
|---|---|---|---|---|
| `/api/standort` | GET `?q=` bzw. `?lat&lon&neigung&azimut&montage[&nur=ertrag]` | Nominatim, Open Topo Data, PVGIS; lokales Schneelast-Raster | Drosselung 20/40 je 10 min je IP; nur Österreich; Antwortfelder `lage`, `seehoehe`, `schneelastRichtwert`, `ertrag`, `hora` | `src/app/api/standort/route.js:12-139` |
| `/api/energie/live` | GET `[?voll=1]` | Energy-Charts / aWATTar | `revalidate = 900`, `s-maxage=300` | `src/app/api/energie/live/route.js:1-32` |
| `/api/forderungen/landesforderungen` | GET | statisch `src/data/bundeslaender.js` | kein Backend-Aufruf | `src/app/api/forderungen/landesforderungen/route.js:1-4` |
| `/forderungen/eag-foerdercall/termin.ics` | GET | – | ICS-Datei zum Fördercall | `src/app/forderungen/eag-foerdercall/termin.ics/route.js` |
| `/api/image` | GET `?path=` | `${SERVER}/files/…` (Backoffice-Dateien, auch Video mit Range) | nur Pfade `^/files/…` ohne `..` (sonst abgelehnt); Origin-Prüfung, wenn `Origin` gesendet wird | `src/app/api/image/route.js:106-108` |
| `/siegel/<slug>[.svg]` | GET `?stil=hell\|dunkel&format=klein\|breit` | Projekt- und Kundendaten (Backoffice oder statisch) | Solar-Siegel für Kunden-Websites; `X-Robots-Tag: noindex, follow`; Cache `max-age=3600, s-maxage=86400` (Header-Regel `/siegel/:path*` in `next.config.mjs`) | `src/app/siegel/[slug]/route.js:1-14` |
| `/referenzen/projekte/<slug>/bild/{linkedin,instagram,story}` | GET | – | Social-Media-Bilder (PNG, `next/og`), noindex, Cache 1 Tag | `src/app/referenzen/projekte/[title]/bild/[format]/route.js:1-14,205` |
| `/mediathek`, `/mediathek/<slug>` | GET (Seiten) | statisch `src/data/reels.js`, Videos aus `public/videos/reels/` | kein Drittanbieter; `noindex`, solange keine Videos; Detailseite 404 bei unbekanntem Slug, `VideoObject`-Schema | `src/app/mediathek/page.js:23`, `src/app/mediathek/[slug]/page.js:26-58` |
| `/api/pv-prognose` | GET `?lat=&lon=` | GeoSphere Data Hub (`nwp-v2-1h-1km`, `ensemble-v2-1h-1km`), Day-Ahead-Preise über `src/lib/energy.js` | Antwort `{ zelle, lauf, herkunft, ensemble, stunden: [{ ende, ghi, t2m, ghiP10, ghiP50, ghiP90 }], preise, quelle }`; Drosselung 30 je IP und 10 min; Budget 200/h, Cache je Zelle/Lauf (bis 12 h als Rückfall) | `src/app/api/pv-prognose/route.js:1-34`, `src/lib/prognose/geosphere.js`, `src/lib/prognose/budget.js` |
| `/schneelast/richtwert` | GET `?lat=&lon=` | lokales Raster; Seehöhe über Open Topo Data (EU-DEM) | Antwort `{ lage, seehoehe, richtwert, grund, hora }`; über 2.000 m kein Wert; Drosselung 30 je IP und 10 min; Adresssuche weiter über `/api/standort?q=` | `src/app/schneelast/richtwert/route.js:1-60` |
| `/schneelast/karte.png` | GET | – | Karte als PNG, beim Build erzeugt | `src/app/schneelast/karte.png/route.js` |
| `/beispiele/lastgang-beispiel.csv` | GET (statisch) | – | Beispiel-Lastgang (35.040 Zeilen, ca. 1,08 MB) für `/lastgang-analyse`; die Analyse selbst sendet keine Nutzerdaten | `public/beispiele/lastgang-beispiel.csv`, `src/components/Lastgang/LastgangAnalyse.js:42,109` |
| ~~`/api/optimize-video`~~ | – | – | **entfernt** in Welle 2 (war offener Proxy, S1) | Löschung laut `git status` |

### 2.3 Kanäle, Push, Fediverse

| Route | Methode | Ziel | Hinweise | Beleg |
|---|---|---|---|---|
| `/api/kanaele/verteilen` | POST (Webhook, `X-Kanal-Secret`) / GET (Cron, `Bearer CRON_SECRET`) | `…veroeffentlichung.api.*` (#13), Web-Push, Fediverse | zeitkonstanter Secret-Vergleich; `maxDuration = 300` | `src/app/api/kanaele/verteilen/route.js:9-30` |
| `/api/push/erneuern` | POST | `push_abo_ersetzen` | nur erlaubte Push-Endpunkte | `src/app/api/push/erneuern/route.js:1-20` |
| Server-Action `src/app/push/actions.js` | – | VAPID-Schlüssel, Abo speichern/löschen | aktiv nur mit VAPID + Kanal-Konfiguration | `src/app/push/actions.js:6-9` |
| `/api/ap/*` (webfinger, nodeinfo, host-meta, users, inbox, outbox, followers, following, posts) | GET/POST | ActivityPub | eingehende HTTP-Signaturen werden geprüft, ausgehende signiert; Rewrites `/.well-known/*` | `src/lib/kanaele/activitypub.js:9,123-177`, `next.config.mjs` (rewrites) |

Frappe-Methoden des Kanalmoduls (Aufrufe `kanal("…")` in `src/lib/kanaele/*`): `liste`, `detail`,
`push_abo_speichern`, `push_abo_loeschen`, `push_abo_ersetzen`, `push_abos`, `push_abos_entfernen`,
`faellige_push`, `push_gesendet`, `ap_follower_speichern`, `ap_follower_loeschen`, `ap_followers`,
`ap_follower_anzahl`, `verteilt_pruefen`, `verteilt_reservieren`, `verteilt_abschliessen` – deckungsgleich
mit Spezifikation #13.

### 2.3a Experimente (A/B-Tests, seit Welle 4)

| Aspekt | Vertrag laut Code | Beleg |
|---|---|---|
| Verzeichnis | `EXPERIMENTE` mit `{ id, titel, seiten, varianten, gewichte, aktiv, bis, ort: "client" \| "server" }`; `varianten[0]` = Kontrolle; nach `bis` gilt automatisch die Kontrolle; K1 (Konfigurator) angelegt, `aktiv: false` | `src/lib/experimente.js` |
| Server-Variante | Middleware lost für Pfade im `matcher` aus, setzt Request- und Response-Header `x-ov-exp` und `Cache-Control: private, no-store`; derzeit kein Pfad eingetragen | `src/middleware.js` |
| Client-Variante | `useExperiment(id)` nach dem Mounten; Variante nur im Arbeitsspeicher | `src/components/Experimente/*` |
| Messung | `exp_gesehen` einmal je Experiment und Aufruf bei Sichtbarkeit; Anfrage-Ereignisse tragen `exp` (z. B. `k1:b`) – im Konfigurator umgesetzt, für alle Ereignisse per `expFuerEreignis()` vorbereitet (Snippet für `src/lib/statistik.js` noch nicht übernommen) | `src/lib/experimente.js:15-18` |
| Backoffice | Variante B von K1 sendet ggf. `einwilligung=0` an `submit_angebot` – Annahme durch das Backoffice **ungeklärt** | Agentenbericht Welle 4 |

### 2.4 Heatmap (Ergänzung – jetzt auch in der Spezifikation #15/#16)

Der Frappe-Teil ist seit Welle 2 in `docs/FRAPPE-AT-API-SPEZIFIKATION.md` (Abschnitt 5a, #15/#16) beschrieben. Website-Seite
(Arbeitsbaum, nicht committet):

| Aspekt | Vertrag laut Code | Beleg |
|---|---|---|
| Website-Route | `POST /api/heatmap` (per `navigator.sendBeacon`), Body `{ pfad, geraet, klicks: [{ sel, rx, ry }], scroll }` | `src/app/api/heatmap/route.js:5-8` |
| Validierung | `pfad` beginnt mit `/`, ≤ 200 Zeichen, ohne Query/Fragment, nicht ausgenommen; `geraet` ∈ {mobil, tablet, desktop}; ≤ 100 Klicks; `rx`,`ry` ∈ [0,1] → auf 0,05 gerundet; `scroll` ∈ [0,100] → auf 10 gerundet; Body ≤ 40.000 Zeichen | `src/lib/heatmap.js:7-45`, `src/app/api/heatmap/route.js:32,82-100` |
| Antwort | immer `204` (auch bei Fehlern, die nur geloggt werden) | `src/app/api/heatmap/route.js:6-8,64` |
| Drosselung | je IP im Speicher als gesalzener SHA-256-Hash (Salz je Serverstart): 120 Erfassungen, 60 Ansichten, 20 Token-Versuche je 10 min | `src/app/api/heatmap/route.js:38-60` |
| Frappe (schreibend) | `oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.api.erfassen` – **ohne IP-Adresse** | `src/app/api/heatmap/route.js:29-30` |
| Ansicht | `GET /api/heatmap?pfad=&geraet=&tage=30&token=` → nur mit gültigem `HEATMAP_TOKEN` (≥ 16 Zeichen, zeitkonstanter Vergleich), sonst 404; Frappe `…heatmap_zelle.api.auswertung` | `src/app/api/heatmap/route.js:10-11,74-81` |
| Frappe-DocTypes | „Heatmap Zelle“, „Heatmap Scroll“, „Heatmap Seite“, Bericht „Heatmap Auswertung“; Aufbewahrung ≤ 14 Monate; ≤ 2.000 Pfade je Gerät und Monat; Frappe-Aufrufe per POST | `Import-Backend-Frappe/apps/oekovoltdeutchland/README.md` (Abschnitt Heatmap), `src/app/api/heatmap/route.js:126-166` |

## 3. Abweichungen und Ergänzungen zur Frappe-Spezifikation

| # | Feststellung | Beleg | Status |
|---|---|---|---|
| A1 | Einige Next-Routen rufen Methoden auf, die laut Spezifikation „nicht bauen“ (toter Code): `/api/card_contact`, `/api/partners`, `/api/partners_icon`, `/api/produkte/hersteller`, `/api/produkte/photovoltaikanlage`, `/api/referenzen/project_item`, `/api/team`, `/api/uber-uns/jobs`, `/api/uber-uns/team` | Routen-Liste oben; Spezifikation Abschnitt 1 („Nicht bauen“) | Aufräumkandidaten (offen) |
| A2 | Heatmap-Methoden fehlten in der Spezifikation | 2.4 | **erledigt** (Spezifikation #15/#16, Welle 2) |
| A3 | `Import-Frappe/5_website_env.txt` ordnet `KONTAKT_API_KEY` auch Rückruf/Termin/PDF zu; laut Code nur Scan/Solar Lead bzw. Rückruf-Helfer (`src/lib/rueckrufApi.js:17-18` fällt auf `API_KEY` zurück) | Spezifikation Abschnitt 7 | **erledigt** für AT: `Import-Backend-Frappe/installation/website_env.txt` ordnet korrekt zu |
| A4 | Rewrite `/api/backoffice/:path*` machte das Backoffice unter der Website-Domain erreichbar | `next.config.mjs` | **erledigt** – Rewrite entfernt (Welle 2) |
| A5 | Kundenbühne-Felder am Projekt (#1/#2) | Spezifikation Abschnitt 2 (Ergänzung) | **erledigt** (Welle 2) |

## 4. Externe Schnittstellen (Kurzüberblick)

Details, Lizenzen und Nutzungsregeln: Kapitel 04. Drosselung/Timeouts: `src/lib/standort/dienste.js:50-80`.

| Dienst | Aufruf aus | Auth | Timeout/Drosselung |
|---|---|---|---|
| Nominatim | `src/lib/standort/dienste.js`, `src/lib/referenzOrte.js` | keine, User-Agent mit Kontakt | 1,1 s Abstand, Cache |
| Open Topo Data | `src/lib/standort/dienste.js:147-152` | keine | 1,1 s Abstand |
| PVGIS 5.3 / 5.2 | `src/lib/standort/dienste.js`, `scripts/regionen-pvgis.mjs` | keine | Timeout 8 s (Standard in `holeJson`) |
| Energy-Charts / aWATTar | `src/lib/energy.js` | keine | Next-Cache |
| CloudTalk | `src/lib/rueckrufApi.js:21-30` | `CLOUDTALK_KEY_ID/SECRET` | – (offen) |
| Web-Push | `src/lib/kanaele/push.js` | VAPID | – |
| IndexNow | `scripts/indexnow.mjs` | öffentlicher Schlüssel (Protokollvorgabe) | – |
| Anthropic | nur Frappe (`solar_lead/ki.py`) | `anthropic_api_key` in Frappe-`site_config` | `max_retries=2`, `timeout=120` (`ki.py:121`) |
