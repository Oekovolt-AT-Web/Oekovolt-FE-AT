# 05 – Informationssicherheit und Datenschutz

Gliederung **nur als Ordnungsraster** in Anlehnung an die Themenbereiche von ISO/IEC 27001 Anhang A
(organisatorisch, personenbezogen, physisch, technologisch). Es besteht **kein ISMS** nach ISO/IEC 27001
und keine Zertifizierung; die Tabelle ist eine Bestandsaufnahme belegter Maßnahmen und Lücken.
Datenschutzbezug: DSGVO, DSG, TKG 2021. **Keine Rechtsberatung.** Stand: Version 0.5, 30.09.2026 (Nachführung SEO-Welle P1–P9 und QA).

Ausführliche Datenschutz-Dokumente (nur verlinkt). **Welle 4:** Verzeichnis für AT überarbeitet und erweitert – Deckblatt `docs/datenschutz/00-Uebersicht-VVT.md` (Verantwortlicher, Aufsichtsbehörde, Systeme, Auftragsverarbeiter, Abweichungstabelle A1–A8) und neue Einträge `VVT-Anfragen.md`, `VVT-Heatmap.md`, `VVT-Kundenbuehne.md`, `VVT-Lastgang-Analyse.md`, `VVT-Mediathek.md`; bestehende Einträge angepasst. Status: Entwurf, rechtlich prüfen. Die folgende Tabelle beschreibt den Stand vor Welle 4:

| Dokument | Inhalt | Bemerkung |
|---|---|---|
| `docs/datenschutz/VVT-Rueckruf-Termin.md` | VVT Rückruf/Termin | DE-Stand, für AT anpassen (siehe Befund D1) |
| `docs/datenschutz/VVT-Unterlagen-KI.md` | VVT Unterlagen per Smartphone + KI | DE-Stand |
| `docs/datenschutz/VVT-Kanaele.md` | VVT Push, Fediverse | DE-Stand |
| `docs/datenschutz/VVT-Statistik-Herkunft.md` | VVT Statistik, Kampagnen-Herkunft | DE-Stand; Heatmap fehlt noch |
| `docs/datenschutz/VVT-Hinweisgebersystem.md`, `DSFA-Hinweisgebersystem.md`, `Meldestelle-Handbuch.md`, `Beschaeftigteninformation-HinSchG.md` | Hinweisgebersystem | beziehen sich auf das deutsche HinSchG/BayLDA; in AT gilt HSchG |

## 1. Organisatorische Themen

| Thema | Umsetzung / Beleg | Lücke / offen |
|---|---|---|
| Rollen und Verantwortlichkeiten | Frappe-API-User je Zweck mit eigener Rolle (Website API, Kontakt Webformular, Kanal Webservice, Hinweis Webformular) – `docs/FRAPPE-AT-API-SPEZIFIKATION.md` Abschnitt 7; Rollen-Import `Import-Frappe/1_rollen.csv`; AT-Paket: Rollen werden bei Installation/Migration angelegt bzw. `Import-Backend-Frappe/installation/rollen.csv` – API-Rollen ohne Desk (Website API, Kontakt Webformular, Kanal Webservice, Hinweis Webformular), Desk-Rollen Vertrieb, Marketing (sieht Heatmap), Technik Innendienst, Rückruf Team, Terminberatung, Hinweis Meldestelle (2FA Pflicht); je API-User genau eine Rolle (`Import-Backend-Frappe/apps/oekovoltdeutchland/README.md`, Rollen und API-User) | Benannte Verantwortliche (Datenschutz, Betrieb, Freigabe) offen |
| Lieferantenbeziehungen | Auftragsverarbeiter und Drittdienste in der Datenschutzerklärung (`src/components/Datenschutz/datenschutz.js`) | AV-Verträge/Art.-26-Vertrag mit DE-Schwester, Hosting, E-Mail, CloudTalk, Anthropic: Nachweis offen (`docs/AT-UEBERGABE.md:84-85`) |
| Informationssicherheit in der Entwicklung | Arbeitsregeln für parallele Agenten (`docs/AT-BRIEFING.md:92-110`) | kein dokumentierter Review-/Freigabeprozess für Merges (08) |
| Datenschutz (Art. 5, 25 DSGVO) | Datensparsamkeit: Herkunft ohne Cookies (`src/lib/herkunft.js:1-6`), Messereignisse ohne personenbezogene Daten (`src/lib/statistik.js:1-6`), Heatmap aggregiert ohne IP (`src/app/api/heatmap/route.js:5-8`; Backend speichert nur Monatszähler, ≤ 14 Monate) | Datenschutzdokumente für AT überarbeiten (D1) |
| Meldewesen | Hinweisgebersystem vorerst über IntegrityLine (Redirect) – `next.config.mjs` (HEAD 30-34) | Freigabe eigenes System; AV-Vertrag IntegrityLine offen |

## 2. Personenbezogene Themen

| Thema | Umsetzung / Beleg | Lücke / offen |
|---|---|---|
| Schulung/Sensibilisierung Backoffice-Nutzer | Handbuch Meldestelle (`docs/datenschutz/Meldestelle-Handbuch.md`) | für übrige Module offen |

## 3. Physische Themen

Nicht Gegenstand des Repositorys (Hosting-Anbieter offen, siehe 02 Verteilungssicht).

## 4. Technologische Themen

### 4.1 Geheimnisse (Secrets) und Schlüssel

| Maßnahme | Beleg |
|---|---|
| Alle Zugangsdaten nur über Umgebungsvariablen (vollständige Liste in 07) | `grep "process.env."` über `src/`, `scripts/`, `next.config.mjs` |
| `.env*` und `*.pem` sind von Git ausgeschlossen | `.gitignore` (Abschnitte „env files“, „misc“) |
| Vorlagen enthalten nur Platzhalter | `Import-Frappe/5_website_env.txt`, `Import-Frappe/4_site_config.sh:9,12` (Platzhalter in spitzen Klammern) |
| Schlüsselerzeugung per Skript, Ausgabe nur als `.env`-Zeilen, Hinweis „nie committen“ | `scripts/ap-schluessel.mjs:1-5` |
| Frappe kennt vom Scan-Token nur den SHA-256-Hash | `src/lib/scan/backend.js:7-8` |
| Secrets zeitkonstant verglichen (Kanal-Webhook, Cron, Heatmap-Token) | `src/app/api/kanaele/verteilen/route.js:13-21`, `src/app/api/heatmap/route.js:74-80` |

**Secret-Prüfung vom 30.09.2026, wiederholt in Welle 2 über `src/`, `scripts/`, `Import-Backend-Frappe/`, `docs/`** (grep über das Repository ohne `node_modules`, `.next*`, `.git`, `public/tesseract`;
Muster: `sk-ant-…`, `AKIA…`, `AIza…`, `ghp_…`, `xox?-…`, `-----BEGIN … PRIVATE KEY`, Zuweisungen an
`api_key|secret|password|token|private_key|vapid` mit ≥ 16 Zeichen, `token <hex>:<hex>`; zusätzlich Dateisuche
nach `.env*`, `*.pem`, `*.key`, `site_config*.json` im Arbeitsbaum und in der Git-Historie):

| Ergebnis | Bewertung |
|---|---|
| Keine Zugangsdaten, privaten Schlüssel oder `.env`-Dateien gefunden – weder im Arbeitsbaum noch in der Historie (`git log --all --diff-filter=A`). | in Ordnung |
| IndexNow-Schlüssel im Code und als Datei in `public/` | **kein Geheimnis** – das IndexNow-Protokoll verlangt die öffentliche Ablage (`src/lib/indexnow.js:5-7`) |
| Eine Google-Analytics-Mess-ID (Property der DE-Seite) ist in `docs/datenschutz/VVT-Statistik-Herkunft.md:39` genannt | öffentliche Kennung, kein Geheimnis; Hinweis: gehört zur DE-Property, AT braucht eine eigene (`src/components/Statistik/GoogleAnalytics.js:69-71`) |
| Platzhalter `"<sk-ant-…>"` in `Import-Frappe/4_site_config.sh:12` bzw. Kommentar in `ki.py:8` | Platzhalter, kein echter Schlüssel |
| Welle 2: `Import-Backend-Frappe/installation/site_config.sh` und `website_env.txt` | nur Variablen/leere Platzhalter; Werte werden per Umgebungsvariable übergeben (`KANAL_SECRET=… HEATMAP_TOKEN=…`) – kein Fund |

### 4.2 Zugriffssteuerung und Authentisierung

| Maßnahme | Beleg | Lücke |
|---|---|---|
| Frappe-Aufrufe mit Token je API-User; getrennte Keys für Kontakt/Scan, Kanäle, Hinweise (Rückfall auf Haupt-Key) | `src/lib/apiBaseUrl.js`, `src/lib/rueckrufApi.js:16-18`, `src/lib/kanaele/frappe.js:9-11`, `src/lib/hinweisApi.js:13-15` | Rückfall auf `API_KEY` hebelt die Trennung aus, wenn die eingeschränkten Keys fehlen |
| `buche_termin` ohne Auth (Gast), daher Validierung im Backoffice | Spezifikation #6 | Backend-Drosselung prüfen |
| Heatmap-Ansicht nur mit `HEATMAP_TOKEN` (≥ 16 Zeichen, gleicher Wert wie `oekovolt_heatmap_token` in Frappe), sonst 404 | `src/app/api/heatmap/route.js:74-80`, `Import-Backend-Frappe/installation/site_config.sh:48` | – |
| ActivityPub: eingehende HTTP-Signaturen werden geprüft | `src/lib/kanaele/activitypub.js:9,177` | – |

### 4.3 Missbrauchsschutz: Drosselung und Honeypots

| Route | Drosselung | Honeypot / Mindestdauer | Beleg |
|---|---|---|---|
| `/api/standort` | 20 Suchen, 40 Analysen je 10 min je IP | – | `src/app/api/standort/route.js:30-45` |
| `/api/analyse/pdf` | global 60/10 min; je E-Mail 5/24 h | `website`; Ausfülldauer < 3 s abgelehnt | `src/app/api/analyse/pdf/route.js:52-73` |
| `/api/scan/start` | global 40/10 min; je E-Mail 5/h | `website`; < 2,5 s | `src/app/api/scan/start/route.js:19-38` |
| `/api/hinweis` | global 40/10 min | `website`; < 4 s | `src/app/api/hinweis/route.js:16-26` |
| `/api/award`, `/api/sponsoring`, `/api/partner-registrierung` | je IP (im Speicher) | `website` → stilles „Erfolg“ | `src/lib/api/uber-uns/anfrageWeiterleiten.js:92,135-144` |
| `/api/heatmap` | je IP (gesalzener Hash): 120 Erfassungen, 60 Ansichten, 20 Token-Versuche je 10 min | – | `src/app/api/heatmap/route.js:38-60` |
| `/api/pv-prognose` | 30 je IP / 10 min; GeoSphere-Budget 200/h je Instanz | – | `src/app/api/pv-prognose/route.js:26-34` |
| `/schneelast/richtwert` | 30 je IP / 10 min; Open Topo Data gedrosselt (1,1 s, gemeinsamer Tagesvorrat 1.000) | – | `src/app/schneelast/richtwert/route.js:28-60` |
| `/api/create_contact`, `/api/create_anfrage`, `/api/rueckruf`, `/api/termin` | je IP und Formular 5 / 10 min; Body ≤ 24.000 Byte (413) | Honeypot im Backoffice; dort zusätzlich Drosselung je `ip_adresse` und Stunde (Kontakt 5, Angebot 5, Solarrechner 10) | `src/lib/api/uber-uns/anfrageWeiterleiten.js:102-150`, `Import-Backend-Frappe/apps/oekovolt_app/README.md` |
| Externe Dienste | 1,1 s Abstand je Dienst, Cache | – | `src/lib/standort/dienste.js:50-68` |

Einschränkungen: Alle Drosselungen liegen im Arbeitsspeicher **einer** Instanz (`zugriffe = new Map()`), sie
gelten also nicht instanzübergreifend und beginnen nach Neustart neu. Die IP stammt aus dem ersten Eintrag von
`X-Forwarded-For` (`src/lib/ipAdresse.js:7`); ob der vorgelagerte Proxy diesen Header überschreibt, ist
**offen** – sonst ist die IP-Drosselung umgehbar (R-18).
Stand Welle 3: `gedrosselt()` in `anfrageWeiterleiten.js` drosselt ohne ermittelbare IP **gar nicht** mehr (`if (!ip) return null`, Zeile 139) – vorher teilten sich solche Anfragen ein gemeinsames Kontingent. Folge: Fehlt `X-Forwarded-For`/`X-Real-IP` hinter dem Proxy, entfällt die Website-Drosselung für Kontakt, Angebot, Rückruf, Termin, Award, Sponsoring und Partner; es bleibt die Drosselung im Backoffice (je `ip_adresse` – dann ebenfalls leer). Beim Deploy prüfen (R-18).

### 4.4 Netzwerk- und Webanwendungssicherheit

| Maßnahme | Beleg | Lücke |
|---|---|---|
| HSTS (1 Jahr, includeSubDomains), `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` | `next.config.mjs` (HEAD 171-190) | **keine Content-Security-Policy** für die Website allgemein; `X-XSS-Protection` ist veraltet (unschädlich) |
| `/scan`, `/fortsetzen`: noindex, `no-referrer`, `no-store` | `next.config.mjs` (headers) | – |
| `/tv`: bewusst einbettbar (`frame-ancestors *`) | `next.config.mjs` (headers `/tv`) | gewollt (Signage) |
| `poweredByHeader: false` | `next.config.mjs:18` | – |
| Bilder aus Backoffice nur über `backoffice.oekovolt.com` bzw. Proxy `/api/image` (nur `/files/…`) | `next.config.mjs` (images), `src/app/api/image/route.js:106-108` | – |
| 410 für WordPress-Pfade | `src/middleware.js` | – |

**Befunde aus der Code-Durchsicht (Version 0.1) und Stand nach Welle 2:**

| ID | Befund | Beleg | Empfehlung |
|---|---|---|---|
| S1 | `/api/optimize-video?url=` lud beliebige URLs serverseitig (offener Proxy, SSRF-Risiko) | ehemals `src/app/api/optimize-video/route.js` | **behoben** (Welle 2): Route gelöscht |
| S2 | `/api/image?path=` reichte jeden Pfad an `${SERVER}` weiter | `src/app/api/image/route.js:106-108` | **behoben** (Welle 2): nur `^/files/…` ohne `..`; Origin-Prüfung weiterhin nur mit `Origin`-Header (unkritisch, da nur öffentliche Dateien) |
| S3 | Rewrite `/api/backoffice/:path*` stellte das gesamte Backoffice unter der Website-Domain bereit | `next.config.mjs` | **behoben** (Welle 2): Rewrite entfernt |
| S4 | Kontakt/Angebot/Rückruf/Termin ohne Größenlimit und Website-Drosselung | `src/app/api/{create_contact,create_anfrage,rueckruf,termin}/route.js` | **behoben** (Welle 2): `gedrosselt` + `leseJson` |
| S5 | `src/lib/baseUrl.js` liefert serverseitig in Produktion `http://localhost:3000` | `src/lib/baseUrl.js:9-11` | offen – laut Koordinator nur toter Code; beim Aufräumen entfernen |
| S6 | Keine Content-Security-Policy | `next.config.mjs` (headers) | offen |
| S7 | Drosselung nur im Arbeitsspeicher je Instanz; IP aus `X-Forwarded-For` | `src/lib/ipAdresse.js:7` | offen (R-18) |

### 4.5 Protokollierung und Überwachung

| Maßnahme | Beleg | Lücke |
|---|---|---|
| Fehler serverseitig per `console.error`, Nutzer erhält nur bereinigte Meldungen (keine Tracebacks) | `src/lib/backendFehler.js:1-6` | Log-Aufbewahrung/-zugriff offen |
| Health-Check Hinweisgebersystem | `src/app/api/hinweis/health/route.js` | Monitoring-Werkzeug offen |

### 4.6 Datensicherung

Frappe-Backup vor Installation: `bench --site <site> backup --with-files` (`Import-Frappe/ANLEITUNG.md`).
Regelmäßige Backups, Rotation und Wiederherstellungstests: **offen** (vgl. `docs/datenschutz/VVT-Hinweisgebersystem.md:83`).

## 5. Einwilligung (Cookie-Banner) und Messung

| Aspekt | Umsetzung | Beleg |
|---|---|---|
| Speicherort der Einwilligung | Cookie `cookieConsent` (JSON), 365 Tage, `SameSite=Lax` | `src/components/Cookies/cookiecomponent.js:168-172` |
| Kategorien | notwendig; funktional (Google Maps); Statistik (Google Analytics + Heatmap ohne eigenen Schalter) | `src/components/Cookies/cookiecomponent.js:5-111` |
| Voreinstellung | alles außer „notwendig“ aus | `src/components/Cookies/cookiecomponent.js:111` |
| Sofortige Wirkung/Widerruf | Ereignis `ov-consent`; GA stoppt und löscht `_ga`-Cookies | `src/components/Cookies/cookiecomponent.js:173-174`, `src/components/Statistik/GoogleAnalytics.js:117-130` |
| Ohne Einwilligung | Umami (falls konfiguriert, cookielos); Kampagnen-Herkunft im Arbeitsspeicher | `src/components/Statistik/Umami.js`, `src/lib/herkunft.js` |
| Mediathek (Reels) | selbst gehostete Videos, keine Verbindung zu Meta → keine Einwilligung nötig; Link zur Facebook-Seite ist ein normaler Link | `src/data/reels.js:5-6` |
| Hinweisgebersystem | von GA4 und Umami ausgenommen (Welle 3), Heatmap ebenso | `src/components/Statistik/GoogleAnalytics.js:24`, `src/components/Statistik/Umami.js:29`, `src/lib/heatmap.js` |
| PV-Prognose | Browser → eigener Server (Koordinaten); Server → GeoSphere nur mit Koordinaten der Rasterzelle (0,05°), keine Nutzerdaten | `src/app/api/pv-prognose/route.js`, `src/lib/prognose/geosphere.js` |
| Lastgang-Analyse | Datei wird nur im Browser gelesen, kein Upload | `src/components/Lastgang/LastgangAnalyse.js:42` |
| A/B-Tests | Auslosung je Aufruf ohne Cookie/Speicher; Ereignis-Kennung ohne Personenbezug | `src/lib/experimente.js:5-18` |
| Referenzkarte (OSM-Kacheln) | eigene Einwilligung in der Karte (`openStreetMap` im Consent-Cookie) | `src/components/Referenzkarte/map.js:61-110` |
| Standort-Check-Karte (basemap.at) | Kacheln werden **ohne vorherige Einwilligung** direkt vom Browser geladen; in der Datenschutzerklärung offengelegt | `src/components/StandortCheck/Karte.js:8-11`, Datenschutzerklärung Abschnitt Standort-Check |

Rechtliche Bewertung (TKG § 165 Abs. 3 für Umami ohne Einwilligung, Heatmap, basemap.at-Kacheln): **offen** (R-09).

## 6. Löschfristen (Zusammenfassung aus den VVT)

| Verarbeitung | Frist laut Dokument | Quelle | Umsetzung |
|---|---|---|---|
| Rückrufe | 90 Tage nach Erledigung (automatischer Job) | `docs/datenschutz/VVT-Rueckruf-Termin.md:17` | im AT-Backoffice offen |
| Termine | 12 Monate nach Termin | ebd. | offen |
| Unterlagen per Smartphone: unvollständige Sitzungen | 24 h nach Ablauf QR/Fortsetzen-Link | `docs/datenschutz/VVT-Unterlagen-KI.md:15` | offen |
| Leads ohne Angebot/Auftrag | 12 Monate | ebd. | offen |
| Push-Abos | sofort bei Abbestellung; bei 404/410 automatisch | `docs/datenschutz/VVT-Kanaele.md:15` | Code-Pfad `push_abos_entfernen` vorhanden |
| Fediverse-Follower | bei „Entfolgen“/Kontolöschung | `docs/datenschutz/VVT-Kanaele.md:28` | vorhanden |
| Statistik-Rohdaten | **[OFFEN]** (Vorschlag 25 Monate) | `docs/datenschutz/VVT-Statistik-Herkunft.md:16` | offen |
| Kampagnen-Herkunft | mit der jeweiligen Anfrage | `docs/datenschutz/VVT-Statistik-Herkunft.md:30` | – |
| Hinweisgebersystem | **Widerspruch:** VVT (DE-Stand) 3 Jahre; AT-Backend 5 Jahre nach Abschluss (§ 8 Abs. 11 HSchG laut Code-Kommentar) | `docs/datenschutz/VVT-Hinweisgebersystem.md:76-85`, `Import-Backend-Frappe/…/doctype/hinweis/api.py:260-266` | Backend umgesetzt (unveröff.); **rechtlich prüfen**, VVT anpassen |
| Heatmap (monatliche Zählwerte, ohne Personenbezug) | höchstens 14 Monate (aktueller + 13 Vormonate), täglicher Job `alte_monate_loeschen` | `Import-Backend-Frappe/apps/oekovoltdeutchland/README.md` (Heatmap, Hooks), Datenschutzerklärung `src/components/Datenschutz/datenschutz.js:280` | umgesetzt (unveröff.) |
| Kontakt-, Angebots-, Solarrechner-Anfragen (`oekovolt_app`) | 24 Monate ab Anlage → Anonymisierung (außer Status „Angebot erstellt“/„Gewonnen“), PDFs und Nebeneinträge gelöscht; konfigurierbar `oekovolt_loeschfrist_monate` | `Import-Backend-Frappe/apps/oekovolt_app/README.md` (Löschfrist) | umgesetzt (unveröff.); VVT fehlt |
| Website-Termine (`oekovolt_app`) | eigener Job `termin.loesche_alte_termine` | ebd. | Frist im Repo nicht beziffert (offen) |

## 7. Befunde Datenschutz-Dokumentation

| ID | Befund | Beleg |
|---|---|---|
| D1 | Alle Dateien unter `docs/datenschutz/` enthalten DE-Bezüge (z. B. oekovolt.de, HinSchG, BayLDA); für die AT-Gesellschaft (DSG, Datenschutzbehörde, HSchG) nicht angepasst | `grep` auf `BayLDA|HinSchG|oekovolt\.de|Türkheim` trifft alle 8 Dateien |
| D2 | Kein VVT-Eintrag für Heatmap, Kontakt-/Angebots-/Solarrechner-Anfragen (`oekovolt_app`), Standort-Check, Kundenbühne (Kundendaten, Porträts) | – |
| D4 | Löschfrist Hinweisgebersystem widersprüchlich (VVT 3 Jahre vs. Backend 5 Jahre) | siehe Abschnitt 6 |
| D5 | Pressekontakt: Name und Foto einer Mitarbeiterin werden veröffentlicht – Einwilligung (DSGVO, § 78 UrhG) laut Code „vom Auftraggeber bereitgestellt“, schriftlicher Nachweis nicht im Repo | `src/components/Presse/PresseKontakt.js:3-6` |
| D6 | Datenschutztexte des Hinweisgebersystems hängen vom Schalter `HINWEIS_INTERN` ab (Build-Zeit) – nach Umschalten neu bauen und Datenschutzerklärung Punkte 9, 23, 24 prüfen | `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md` (Abschnitt 0) |
| D7 | Datenschutzerklärung weicht vom Code ab (u. a. Anfragen 12 statt 24 Monate, Rückruf 90 Tage, Termine 12 Monate, CloudTalk genannt, obwohl nicht aufgerufen, IP-Löschung, Partner-Frist) – Tabelle A1–A8 | `docs/datenschutz/00-Uebersicht-VVT.md` |
| D8 | Hinweisgebersystem: Rückmeldefrist wird ab Bestätigung statt ab Eingang berechnet (§ 13 Abs. 9 HSchG); kein inhaltsfreies Zugriffsprotokoll nach § 8 Abs. 12 / § 9 Abs. 6 HSchG; Löschjob entfernt Versionshistorie – vor `HINWEIS_INTERN=1` beheben | Agentenbericht Welle 4 (Snippets für `hinweis.py`, `hinweisgeber.js`) |
| D9 | `termin.buche_termin` ist Gastmethode und direkt aufrufbar – `ip_adresse` dann nicht vertrauenswürdig; auf die IP des Website-Servers beschränken | `Import-Backend-Frappe/…/website_api/termin.py` |
| D10 | A/B-Test K1, Variante B: Rechtsgrundlage Art. 6 Abs. 1 lit. b ohne Einwilligungs-Checkbox und ohne AGB-Akzeptanz; Transparenzhinweis in der Datenschutzerklärung fehlt noch | `src/lib/experimente.js`, Agentenbericht Welle 4 |
| D11 | Kundenbühne und Lastgang-Analyse sind in der Datenschutzerklärung noch nicht beschrieben (Textvorschläge in den VVT-Einträgen) | `docs/datenschutz/VVT-Kundenbuehne.md`, `VVT-Lastgang-Analyse.md` |
| D12 | Offene Organisationspunkte: Beschäftigtenzahl (Pflicht zur internen Stelle nach § 11 HSchG ab 50), DSB-Benennung (Art. 37), Hosting (www.oekovolt.com liefert am 30.09.2026 noch die alte Seite aus), AV-Verträge (Hetzner, Microsoft 365, IntegrityLine …), 2FA für Desk-Konten, verschlüsselte Backups | `docs/datenschutz/00-Uebersicht-VVT.md` |

**Stand nach der SEO-Welle (Paket P8):**

| ID | Stand | Beleg |
|---|---|---|
| D7 | **erledigt** – Datenschutzerklärung an Code angeglichen: Anfragen 24 Monate Anonymisierung (auch PDF-Analyse, Partner, Sponsoring, Award), Rückruf/Termine 24 Monate, CloudTalk entfernt, IP/UTM-Beschreibung, Heatmap 14 Monate, Übersicht „Speicherdauer“ | `src/components/Datenschutz/datenschutz.js` |
| D8 | **teilweise** – Fristen ab Eingang (`fristen_ab_eingang()`), Website-Texte über `FRISTEN_TEXT`; **Fehler behoben:** Löschjob behielt „Deleted Document“-Kopien, jetzt `delete_permanently=True`; offen: inhaltsfreies Zugriffsprotokoll (§ 8 Abs. 12, § 9 Abs. 6 HSchG), Lesezugriffe nicht protokolliert | `…/doctype/hinweis/hinweis.py`, `…/hinweis/api.py`, `src/data/hinweisgeber.js` |
| D9 | offen – `buche_termin` weiter Gastmethode | – |
| D10 | **erledigt** – Unterpunkt „Varianten-Tests“ in der Datenschutzerklärung, laufende Tests werden zur Build-Zeit genannt (derzeit keiner) | `src/components/Datenschutz/datenschutz.js` |
| D11 | **erledigt** – Abschnitte Lastgang-Analyse, Referenzprojekte/Kundenporträts, Standort-Check/Schneelast/PV-Prognose | ebd. |
| D12 | offen (Organisation) | – |
| D13 | **neu, rechtlich prüfen:** Anonymisierung statt Löschung nach 24 Monaten; IP-Adresse 24 Monate bzw. unbefristet bei „Angebot erstellt“/„Gewonnen“; Löschkonzept E-Mail-Postfächer; GA-Aufbewahrung 14 Monate nur als GA-Einstellung; Partner/Sponsoring/Award-Frist nicht im Backend; Eingangszeitpunkt manuell erfasster Hinweise | Bericht P8 |
| D14 | **neu:** Verifizierungs-Tags nur aus `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_BING_SITE_VERIFICATION`, keine GTM-ID im HTML (auskommentierte GTM-Zeile in `src/components/Reusable/LayoutWrapper.js:33`) | `src/app/layout.js` |
| D3 | Datenschutzerklärung nennt Umami nur, wenn die Env-Variablen **zur Build-Zeit** gesetzt sind | Arbeitsbaum `src/components/Datenschutz/datenschutz.js` (Funktion `umamiAktiv`) |
