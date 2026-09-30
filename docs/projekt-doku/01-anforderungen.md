# 01 – Anforderungen

Gliederung in Anlehnung an ISO/IEC/IEEE 29148 (Stakeholder-Anforderungen, System-/Softwareanforderungen).
Keine Normkonformität behauptet. Stand: Version 0.5, 30.09.2026 (Nachführung SEO-Welle P1–P9 und QA).

**Hinweis zur Herkunft:** Es gibt kein formales Lastenheft im Repository. Die Anforderungen sind aus
den vorhandenen Dokumenten (`docs/AT-BRIEFING.md`, `docs/AT-UEBERGABE.md`, `docs/AT-DESIGN.md`,
`docs/FRAPPE-AT-API-SPEZIFIKATION.md`), aus Commit-Nachrichten und aus dem Code **rückwirkend
abgeleitet** (Reverse Engineering). Sie sind damit ein Ist-Abbild und müssen fachlich bestätigt werden
(Freigabe offen).

## 1. Stakeholder

| ID | Stakeholder | Belang | Quelle |
|---|---|---|---|
| STK-01 | Geschäftsführung Ökovolt Solartechnik GmbH (AT) | Leadgewinnung Gewerbe/Industrie/Landwirtschaft/öffentliche Hand, fachliche Tiefe, Rechtssicherheit | `docs/AT-BRIEFING.md:10-22` |
| STK-02 | Deutsche ÖKOVOLT GmbH Solartechnik (Markeninhaberin; Mutter- oder Schwestergesellschaft – widersprüchlich, siehe R-22) | Marken- und Websiterechte, gemeinsames Backoffice, Corporate Design | `docs/AT-BRIEFING.md:40-45`, `docs/AT-UEBERGABE.md:85` |
| STK-03 | Gesellschafterin Salzburg AG (49 %) | korrekte Darstellung der Beteiligung | `src/lib/site.js:43`, `docs/AT-BRIEFING.md:36-39` |
| STK-04 | Interessenten B2B (GF, Technik, Einkauf), Gemeinden, Landwirte | konkrete Zahlen, Rechner, Förderinfos, einfache Anfrage | `docs/AT-BRIEFING.md:12-16` |
| STK-05 | Private Premium-Kunden (u. a. Chalets alpin) | nachgeordnete Zielgruppe | `docs/AT-BRIEFING.md:12-13` |
| STK-06 | Vertrieb/Innendienst (Backoffice-Nutzer) | Anfragen strukturiert in Frappe, Rückruf/Termin, Herkunft | `docs/FRAPPE-AT-API-SPEZIFIKATION.md`, `docs/frappe-herkunft/README.md` |
| STK-07 | Redaktion | Pflege Inhalte, Förderstände, Ratgeber | `docs/AT-UEBERGABE.md:101-106` |
| STK-08 | Datenschutz / Recht | DSGVO, TKG 2021, BaFG, HSchG, UWG | `docs/AT-UEBERGABE.md:80-99` |
| STK-09 | Menschen mit Behinderungen | barrierefreie Nutzung | `src/app/barrierefreiheit/page.js:58-69` |
| STK-10 | Such- und Antwortmaschinen | crawlbare, zitierfähige Inhalte | `docs/AT-BRIEFING.md:17-22`, `docs/AT-UEBERGABE.md:29-31` |
| STK-11 | Datenlieferanten (GeoSphere, OSM, JRC, basemap.at, Energy-Charts …) | Einhaltung Nutzungsbedingungen, Namensnennung | `src/lib/standort/dienste.js:1-20` |

Statuswerte: **umgesetzt** (im Code belegt, committet) · **umgesetzt (unveröff.)** (nur im Arbeitsbaum) ·
**in Arbeit** · **teilweise** · **offen** · **Freigabe offen** (fachlich/rechtlich nicht bestätigt).

## 2. Funktionale Anforderungen

### 2.1 Anfrage-Strecken (REQ-ANF)

| ID | Anforderung | Quelle | Status |
|---|---|---|---|
| REQ-ANF-01 | Kontaktformular sendet über `/api/create_contact` an `oekovolt_app.website_api.kontakt.submit_kontakt`. | `src/app/api/create_contact/route.js:12`, `src/components/Kontakt/KontaktFormular.js:54` | umgesetzt; AT-Backoffice offen |
| REQ-ANF-02 | Service-Seiten nutzen dieselbe Kontakt-API mit Thema. | `src/components/ServiceAT/ServiceAnfrage.js:6,14` | umgesetzt |
| REQ-ANF-03 | Angebots-Konfigurator `/angebot` sendet an `submit_angebot`; übernimmt kWp/Objekt aus Rechnern im Gewerbe-Modus. | `src/components/Angebot/Konfigurator.js:34-40`, Commit `11472bf` | umgesetzt |
| REQ-ANF-04 | PDF-Analyse im Solarrechner: PDF serverseitig erzeugen, an `submit_solarrechner` (multipart) senden; 4-stellige PLZ. | `src/app/api/analyse/pdf/route.js:16-52`, Commit `11472bf` | umgesetzt |
| REQ-ANF-05 | Rückruf-Widget auf jeder Seite; Speicherung über `buche_termin`; optional Sofort-Rückruf über CloudTalk. | `src/app/api/rueckruf/route.js`, `src/lib/rueckrufApi.js:1-30` | umgesetzt; CloudTalk-Konfiguration offen |
| REQ-ANF-06 | Online-Terminbuchung `/termin` mit Kalender freier Zeiten; nur bekannte Terminarten, max. 30 Tage. | `src/app/api/termin/route.js`, `src/app/api/termin/kalender/route.js:17-21` | umgesetzt |
| REQ-ANF-07 | Unterlagen per Smartphone (QR-Handshake, `/scan/<token>`, Fortsetzen-Link), OCR im Gerät, KI-Auswertung im Backoffice. | `src/app/api/scan/**`, `src/lib/scan/backend.js`, `docs/frappe-solar-lead/README.md` | umgesetzt (Website); AT-Backoffice offen |
| REQ-ANF-08 | Award-, Sponsoring- und Partner-Formulare: Validierung (u. a. UID ATU, GISA, FN), Honeypot, Drosselung, Weiterleitung an `submit_kontakt`. | `src/lib/api/uber-uns/anfrageWeiterleiten.js:1-100` | umgesetzt; eigene Felder im Backoffice offen (`docs/AT-UEBERGABE.md:68-70`) |
| REQ-ANF-09 | Kampagnen-Herkunft (UTM, Referrer-Domain, Einstiegsseite) ohne Cookies/Browserspeicher erfassen und nur mit einer Anfrage übertragen. | `src/lib/herkunft.js:1-6` | umgesetzt |
| REQ-ANF-10 | Einheitliche Fehlerbehandlung: 409 belegt, 422 Validierung, 429 Drosselung, 502 Backend; Nutzerhinweis auf E-Mail/Telefon. | `src/lib/backendFehler.js:1-15`, `src/lib/api/uber-uns/anfrageWeiterleiten.js:26` | umgesetzt |
| REQ-ANF-11 | Honeypot-Feld `website`: gefüllt → Erfolg melden, nichts speichern. | `src/lib/api/uber-uns/anfrageWeiterleiten.js:92`, `src/app/api/analyse/pdf/route.js:60`, `docs/FRAPPE-AT-API-SPEZIFIKATION.md` (0. Grundregeln) | umgesetzt – bei Kontakt/Angebot/Rückruf/Termin prüft das Backoffice den Honeypot (`Import-Backend-Frappe/apps/oekovolt_app/README.md`, Abschnitt Methoden) |
| REQ-ANF-12 | IP-Adresse für den Nachweis nur serverseitig ermitteln (`ip_adresse`), nie aus dem Formular übernehmen. | `src/lib/ipAdresse.js:1-10` | umgesetzt |
| REQ-ANF-13 | Alle Anfrage-Routen mit Drosselung und Größenlimit: Kontakt, Angebot, Rückruf, Termin je IP und Formular 5 Anfragen / 10 min, Body ≤ 24.000 Byte (413). Ohne ermittelbare IP wird **nicht** gedrosselt (Welle 3, damit fehlende Proxy-Header nicht alle Besucher sperren). Das Backoffice drosselt zusätzlich je `ip_adresse` und Stunde (Kontakt 5, Angebot 5, Solarrechner 10). | `src/lib/api/uber-uns/anfrageWeiterleiten.js:23,102-150` (`if (!ip) return null`, Zeile 139), `src/app/api/{create_contact,create_anfrage,rueckruf,termin}/route.js`, `Import-Backend-Frappe/apps/oekovolt_app/README.md` | umgesetzt (unveröff.) |

### 2.2 Rechner (REQ-REC)

| ID | Anforderung | Quelle | Status |
|---|---|---|---|
| REQ-REC-01 | Rechner-Hub `/rechner` mit eigenem Hauptmenüpunkt. | `docs/AT-UEBERGABE.md:38-40`, `src/app/rechner/page.js` | umgesetzt |
| REQ-REC-02 | Acht Gewerbe-Rechner (gewerbe-pv, peak-shaving, e-flotte, ladeinfrastruktur, energiegemeinschaft, blackout, co2-esg, freiflaeche-pacht) mit Logik als reine Funktionen. | `src/app/rechner/*`, `src/lib/rechner/*.js` | umgesetzt |
| REQ-REC-03 | Weitere Rechner: Stromspeicher, Wärmepumpe, Wallbox, dynamischer Stromtarif; Solarrechner; Förder-Check. | `src/app/rechner/{stromspeicher,waermepumpe,wallbox,dynamischer-stromtarif}`, `src/app/solarrechner`, `src/app/foerdercheck` | umgesetzt |
| REQ-REC-04 | Ergebnisse an den Konfigurator übergeben (kWp, Objekt). | Commit `11472bf`, `src/lib/rechner/angebot.js` | umgesetzt |
| REQ-REC-05 | Messung „Ergebnis angesehen“ einmal je Aufruf, ohne Eingabewerte. | `src/lib/useRechnerErgebnis.js:11-19` | umgesetzt |
| REQ-REC-06 | Annahmen mit Richtwert-Charakter als solche kennzeichnen und fachlich freigeben (u. a. CO₂-Faktoren: 258,2 g/kWh Substitution in Solarrechner/Gewerbe-PV/Pacht/Kundenbühne, 105,4 g/kWh Strommix im CO₂-Rechner, 209 g/kWh E-Flotte). | `docs/AT-UEBERGABE.md:54-56,92-93`, `src/data/solarrechner.js:166`, `src/lib/rechner/annahmen.js:36-38`, `src/lib/rechner/eflotte.js:44` | Freigabe offen |
| REQ-REC-07 | Solarrechner-Ergebnis teilen (Vorschaubild), Erinnerungs-E-Mail mit Fortsetzen-Link. | Commit `e443860`, `src/components/Solarrechner/ErgebnisTeilen.js` | umgesetzt (aus DE-Stand übernommen) |

### 2.3 Standort-Check und Schneelast (REQ-STO)

| ID | Anforderung | Quelle | Status |
|---|---|---|---|
| REQ-STO-01 | Adresssuche über Nominatim nur auf Knopfdruck, ≥ 3 Zeichen, serverseitig gedrosselt (≥ 1,1 s Abstand) und gecacht. | `src/lib/standort/dienste.js:6-9,95-99`, `src/app/api/standort/route.js:58-61` | umgesetzt |
| REQ-STO-02 | Seehöhe aus EU-DEM (Open Topo Data), Rückfall auf PVGIS-Geländemodell. | `src/lib/standort/dienste.js:10-13,147-152`, `src/app/api/standort/route.js:105-109` | umgesetzt |
| REQ-STO-03 | PV-Ertrag aus PVGIS 5.3 (Rückfall 5.2) für gewählte und optimale Ausrichtung. | `src/lib/standort/dienste.js:14-17`, `src/app/api/standort/route.js:89-94` | umgesetzt |
| REQ-STO-04 | HORA/eHORA **nicht** automatisiert abfragen; nur Direktlinks mit Koordinaten. | `src/app/api/standort/route.js:6-10`, `src/lib/standort/hora.js:10,48` | umgesetzt |
| REQ-STO-05 | Schneelast-Richtwert (50-jährlich, 1-km-Raster aus SNOWGRID-CL) aus lokaler Datei, klar als Richtwert (nicht Normwert) gekennzeichnet. | `src/lib/standort/schneelastRaster.js:1-22`, `src/components/StandortCheck/StandortCheck.js:580-590` | umgesetzt; Kalibrierung Freigabe offen (`data/schneelast/sk50-at.json:13`) |
| REQ-STO-06 | Kein Richtwert über 2.000 m Seehöhe. | `src/app/api/standort/route.js:112-121` | umgesetzt |
| REQ-STO-07 | Kein Richtwert auf Gletscherzellen (ganzjährige Schneedecke: in > 50 % der Winter kein Ausapern → Zelle leer). | `scripts/schneelast-raster-erzeugen.py:17-19,58` | umgesetzt (Skript unveröff.) |
| REQ-STO-11 | Erzeugung des Rasters reproduzierbar dokumentiert (Download SNOWGRID-CL, Winterjahr 1.8.–31.7., GEV/L-Momente, T = 50, Export `sk50-at.*`). | `scripts/schneelast-raster-erzeugen.py:1-19` | umgesetzt (unveröff.) |
| REQ-STO-08 | Fehlt/unstimmig die Rasterdatei → `null`, Rückfall auf eHORA-Eingabe bzw. alte Zonenformel (als Grobschätzung gekennzeichnet). | `src/lib/standort/schneelastRaster.js:103-125`, `src/components/StandortCheck/StandortCheck.js:586,663-672` | umgesetzt |
| REQ-STO-09 | Nur Standorte in Österreich (Rahmenprüfung + Länderkennung). | `src/lib/standort/dienste.js:27-32`, `src/app/api/standort/route.js:77-99` | umgesetzt |
| REQ-STO-10 | Drosselung je IP: 20 Suchen / 40 Analysen je 10 Minuten. | `src/app/api/standort/route.js:30-45` | umgesetzt |

### 2.4 Förderseiten / EAG (REQ-FOE)

| ID | Anforderung | Quelle | Status |
|---|---|---|---|
| REQ-FOE-01 | Landingpage `/forderungen/eag-foerdercall` mit Phasen (vor/Ticket/Einreichung/nach) und Countdown für den 3. Call 2026 (08.10. 17:00 – 22.10. 23:59). | `src/lib/foerdercall.js:19-31,45-55`, `src/app/forderungen/eag-foerdercall/page.js` | umgesetzt |
| REQ-FOE-02 | Schnellrechner: Kategorien A–D, Speicher 150 €/kWh (0,5 kWh/kWp min., 50 kWh max.), anteilig bis 1.000 kWp, Deckel 30 %. | `src/lib/foerdercall.js:33-43`, `src/components/Foerdercall/SchnellRechner.js` | umgesetzt |
| REQ-FOE-03 | Kalenderdatei (ICS) zum Call. | `src/app/forderungen/eag-foerdercall/termin.ics/route.js` | umgesetzt |
| REQ-FOE-04 | Hinweisleiste auf der Startseite. | `src/components/Foerdercall/HinweisLeiste.js`, `src/app/page.js` | umgesetzt |
| REQ-FOE-05 | Push-Opt-in (Thema „foerderung“) auf der Fördercall-Seite; Hinweis-Push zum Start am 08.10. | `src/app/forderungen/eag-foerdercall/page.js:326-327` | Opt-in umgesetzt; Versand am 08.10. offen (Backoffice/VAPID) |
| REQ-FOE-06 | Bundes- und 9 Landesförderungen mit Stand-Kennzeichnung (`STAND`), vierteljährliche Prüfung. | `src/data/bundeslaender.js:13-22` | umgesetzt; Pflege laufend |
| REQ-FOE-07 | Förderangaben als Orientierung kennzeichnen; verbindlich ist der Fördervertrag. | `src/lib/foerdercall.js:17` | umgesetzt |

### 2.5 Referenzen (REQ-REF)

| ID | Anforderung | Quelle | Status |
|---|---|---|---|
| REQ-REF-01 | Referenzprojekte aus dem Backoffice (`get_projekte`, `get_projekt`), Cache 600 s. | `src/components/Project/ladeProjekte.js:4-30` | umgesetzt; AT-Backoffice offen |
| REQ-REF-02 | Statischer Rückfall (58 Live-Projekte vom 30.09.2026), wenn API nicht konfiguriert/fehlerhaft/leer; liefert die API ≥ 1 Projekt, gilt nur die API. | `src/data/projekte.js:1-12`, `src/components/Project/ladeProjekte.js:4-7` | umgesetzt |
| REQ-REF-03 | Referenzkarte mit Fallback; Liste, Detail, Karte, Startseite und Sitemap nutzen dieselbe Quelle. | `src/components/Project/ladeProjekte.js:1-3`, `src/app/referenzen/referenzkarte/page.js` | umgesetzt |
| REQ-REF-04 | Projektbilder nur von `backoffice.oekovolt.com`. | `next.config.mjs` (`images.remotePatterns`, HEAD Zeile 158) | umgesetzt |
| REQ-REF-05 | Kundenbühne je Referenzprojekt: Kundenporträt (nur belegte Angaben mit Quellen), Solar-Siegel für Kunden-Websites (`/siegel/<slug>`, Cache 1 Tag), Social-Media-Kit (Bilder per `next/og`), ESG-Kurzbericht; Rechenweg offengelegt und als Schätzung gekennzeichnet. | `src/app/referenzen/projekte/[title]/{siegel,teilen,esg,bild}/*`, `src/app/siegel/[slug]/route.js`, `src/components/Kundenbuehne/*`, `src/lib/kundenbuehne.js:1-25`, `src/lib/kundenbuehneServer.js`, `next.config.mjs` (Header `/siegel/:path*`) | umgesetzt (unveröff.) |
| REQ-REF-06 | Kundendaten: Backoffice-Felder am Projekt gewinnen, sonst statischer Stand `src/data/kunden.js` (52 Kunden, 6 bewusst weggelassen); Zitat und Logo nur mit Kundenfreigabe (im statischen Stand immer `false`); Social-Profile nur, wenn auf der Kunden-Website verlinkt. | `src/data/kunden.js:1-16`, `src/lib/kundenbuehneServer.js:1-7`, `docs/FRAPPE-AT-API-SPEZIFIKATION.md` (Ergänzung Kundenbühne) | umgesetzt (unveröff.); Freigaben offen |

### 2.6 Newsroom, Kanäle, Push (REQ-KAN)

| ID | Anforderung | Quelle | Status |
|---|---|---|---|
| REQ-KAN-01 | Newsroom `/presse` mit RSS/JSON-Feed, Info-Bildschirm `/tv` (einbettbar, noindex), Fediverse-Konten. | `src/app/presse/*`, `src/app/tv/*`, `src/app/api/ap/**`, `docs/frappe-kanaele/README.md` | umgesetzt (Website); AT-Backoffice offen |
| REQ-KAN-02 | Web-Push-Opt-in; Versand fälliger Push-Nachrichten und Fediverse-Verteilung über `/api/kanaele/verteilen` (Webhook-Secret oder Cron-Bearer, zeitkonstanter Vergleich). | `src/app/api/kanaele/verteilen/route.js:13-30`, `src/lib/kanaele/push.js` | umgesetzt |
| REQ-KAN-03 | Demo-Daten nur lokal (`KANAL_DEMO=1` und nicht Produktion). | `src/lib/kanaele/demo.js:1-5` | umgesetzt |

### 2.7 Messung und Heatmap (REQ-MES)

| ID | Anforderung | Quelle | Status |
|---|---|---|---|
| REQ-MES-01 | Cookielose Reichweitenmessung (Umami, selbst gehostet) nur, wenn `UMAMI_SCRIPT_URL` und `UMAMI_WEBSITE_ID` gesetzt; URL-Parameter außer `utm_*` entfernen, Referrer auf Origin kürzen. | `src/components/Statistik/Umami.js:3-48` | umgesetzt; Env offen |
| REQ-MES-02 | Google Analytics 4 nur nach Einwilligung „Statistik“, Consent Mode v2 (Standard „denied“), Widerruf löscht `_ga`-Cookies; eigene AT-Property, kein Rückfall auf DE-ID. | `src/components/Statistik/GoogleAnalytics.js:57-130` | umgesetzt; GA4-ID offen |
| REQ-MES-03 | Ereignisse ohne personenbezogene Daten, Namen/Werte gekürzt. | `src/lib/statistik.js:1-35` | umgesetzt |
| REQ-MES-04 | Klick-/Scroll-Heatmap nur mit Einwilligung, ohne Texte/Eingaben/Kennungen, Positionen gerundet, Speicherung nur als monatliche Zählwerte im Backoffice, Weiterleitung ohne IP. | `src/lib/heatmap.js`, `src/app/api/heatmap/route.js`, `src/components/Statistik/HeatmapSammler.js:16-37,159`, Backend `…/doctype/heatmap_zelle`, Spezifikation #15/#16 | umgesetzt (unveröff.) |
| REQ-MES-06 | Heatmap-Aufbewahrung höchstens 14 Monate; je Gerät und Monat höchstens 2.000 Pfade; visuelle Ansicht nur mit `HEATMAP_TOKEN`; Bericht „Heatmap Auswertung“ im Backoffice. | `Import-Backend-Frappe/apps/oekovoltdeutchland/README.md` (Abschnitt Heatmap), `src/components/Datenschutz/datenschutz.js:280` | umgesetzt (unveröff.); Rechtsprüfung offen |
| REQ-MES-05 | Keine Messung auf `/scan`, `/fortsetzen`, `/tv` und `/hinweisgebersystem` (GA4 und Umami seit Welle 3; Heatmap zusätzlich token-artige Pfadsegmente). | `src/components/Statistik/GoogleAnalytics.js:24`, `src/components/Statistik/Umami.js:29`, `src/lib/heatmap.js` | umgesetzt (unveröff.) |

### 2.8 Netzanmeldung (REQ-NETZ)

| ID | Anforderung | Quelle | Status |
|---|---|---|---|
| REQ-NETZ-01 | Seiten zur Netzanmeldung (`/netzanmeldung`, `/netzanmeldung/[betreiber]`, druckbare `/netzanmeldung/checkliste`) mit Checkliste, Zählpunkt-Prüfer und Druckfunktion. | `src/app/netzanmeldung/**`, `src/components/Netzanmeldung/{NetzCheckliste,ZaehlpunktPruefer,DruckenKnopf}.js`; eingetragen in `src/app/sitemap.js`, `src/data/navigation.js`, `src/data/verlinkung.js` | umgesetzt (unveröff.) |
| REQ-NETZ-02 | Netzbetreiber-Daten der fünf größten Verteilernetzbetreiber (nach Zählpunkten), nur aus Primärquellen, jede Aussage mit Quelle, Ungeklärtes als `offen`, neutrale Darstellung ohne Logos; `STAND` je Betreiber. | `src/data/netzbetreiber.js:1-24` (5 Betreiber: Wiener Netze, Netz Niederösterreich, Netz Oberösterreich, Energienetze Steiermark, Salzburg Netz) | umgesetzt (unveröff.) |

### 2.9 Konfetti (REQ-KON)

| ID | Anforderung | Quelle | Status |
|---|---|---|---|
| REQ-KON-01 | Nach erfolgreich abgeschickter Anfrage Konfettieffekt in 11 Strecken (Kontakt, Service, Konfigurator, PDF-Analyse, Rückruf, Termin, Scan-Handshake, Scan-App, Award, Sponsoring, Partner). | `src/lib/konfetti.js:1-7`; Aufrufe z. B. `src/components/Kontakt/KontaktFormular.js:128` | umgesetzt (unveröff.) |
| REQ-KON-02 | Barrierearm: „Bewegung reduzieren“ respektieren, `aria-hidden`, Klicks gehen durch. | `src/lib/konfetti.js:14-24` | umgesetzt (unveröff.) |
| REQ-KON-03 | Nicht im Hinweisgebersystem verwenden. | `src/lib/konfetti.js:7` | umgesetzt (unveröff.) |
| REQ-KON-04 | Ohne externe Bibliothek (Canvas, dynamischer Import). | `src/lib/konfetti.js:3` | umgesetzt (unveröff.) |

### 2.10 Weitere Funktionen (Auswahl)

| ID | Anforderung | Quelle | Status |
|---|---|---|---|
| REQ-HIN-01 | Hinweisgebersystem über einen Schalter: `HINWEIS_INTERN` leer/0 → IntegrityLine (Redirect 307, API 503, Infoseite und Datenschutz verweisen auf IntegrityLine); `HINWEIS_INTERN=1` → eigenes System (Formular, anonymes Postfach, Texte, Sitemap, `llms.txt`). Auswertung zur Build-Zeit, zentral in `src/data/hinweisgeber.js`. AT-Kategorien im Backend-DocType ergänzt. Backend-Löschfrist 5 Jahre nach Abschluss. | `src/data/hinweisgeber.js:8`, `next.config.mjs:32-39`, `src/lib/hinweisApi.js`, `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md` (Abschnitt 0), `Import-Backend-Frappe/…/doctype/hinweis/hinweis.json:121`, `…/hinweis/api.py:260-266` | umgesetzt (unveröff.); **SEO-Welle P8:** Rückmeldefrist ab Eingang (§ 13 Abs. 9 HSchG, `fristen_ab_eingang()`), Löschjob löscht endgültig (`delete_permanently=True`); Zugriffsprotokoll § 8 Abs. 12 offen; Go-live offen |
| REQ-ANA-01 | PDF-Analyse und Ergebnisbild mit AT-Logo statt deutschem Logo. | `src/lib/analyse/logo-hell.png` (Arbeitsbaum geändert), `next.config.mjs:11-13` | umgesetzt (unveröff.) |
| REQ-UNT-01 | Unternehmenskennzahlen zentral in einer Datei (5.000 PV-Kraftwerke, 340.000 kWp, 112.000 t CO₂; nur Ökovolt Österreich laut Auftraggeber, Stand 30.09.2026; CO₂-Zeitraum offen → Beschriftung neutral); verwendet in Startseite (`KERNFAKTEN`), Presse, Referenzliste und Referenzkarte (mit Abgrenzung „online dokumentierte Referenzen“). 30 MWp nur als Meilenstein 2021. **Welle 4:** Gesamtleistung 510 MW laut Auftraggeber (im Code `zahl: 510000`, Suffix „kWp“; vorher 340.000). **SEO-Welle:** CO₂-Zahl wird ausgeblendet, solange `CO2_ZEITRAUM` leer ist (Startseite, Presse, `llms.txt`); Startseiten-Band passt das Raster an. | `src/data/kennzahlen.js:1-21`, `src/data/hero.js:13,37-38`, `src/app/presse/page.js`, `src/app/referenzen/projekte/page.js`, `src/app/referenzen/referenzkarte/page.js`, `src/data/unternehmen.js:380-382` | umgesetzt (unveröff.) – **teilweise zentral**: `src/data/unternehmen.js:45-52` (HEUTE), `src/lib/llms.js:41`, `src/app/page.js:424` enthalten die Zahlen als festen Text; CO₂-Zeitraum offen |
| REQ-UNT-02 | Abschnitt „Eigene Mannschaft & Maschinenpark“ auf `/uber-uns#mannschaft` und Teaser auf der Startseite; nur belegte Fakten mit Quellenvermerk; im UI nur Einträge mit `bestaetigt: true` (Stand: 10 bestätigt, 7 vorbereitet); Foto mit Rückfall auf vorhandenes eigenes Foto. | `src/data/mannschaft.js:1-40`, `src/components/Mannschaft/*`, `src/app/uber-uns/page.js`, `src/app/page.js` | umgesetzt (unveröff.); Bestätigungen und Lkw-/Traktor-Foto offen |
| REQ-PRE-01 | Pressekontakt mit Foto (Initialen als Rückfall) auf `/presse#kontakt`; bis zur Bestätigung zentrale Telefonnummer/E-Mail; Veröffentlichung von Name und Foto nur mit Einwilligung. | `src/components/Presse/PresseKontakt.js:1-10`, `src/app/presse/page.js` | umgesetzt (unveröff.); Einwilligung/Durchwahl/Foto offen |
| REQ-PRE-02 | Presse-Grafiken aus eigenen Daten (Schneelast-Karte, Schneelast je Land, OeMAG-Verlauf; SVG und PNG) zum Download auf `/presse` und bei den Quellseiten. | `public/presse/grafiken/*`, `src/app/presse/page.js:58-62` | umgesetzt (unveröff.); Lizenz CC BY 4.0 vom Auftraggeber zu bestätigen |
| REQ-MED-01 | Mediathek für Kurzvideos, **selbst gehostet** (`public/videos/reels/`), keine Einbettung oder Abrufe bei Meta, daher ohne Einwilligung; Übersicht `/mediathek` (noindex, solange leer) und Detailseiten `/mediathek/<slug>` mit `VideoObject`; Abschnitt auf Startseite (vor FAQ) und `/presse`; Menüpunkt „Mediathek“; Sitemap-Einträge nur bei vorhandenen Videos. | `src/data/reels.js:1-30,90-96`, `src/components/Reels/*`, `src/app/mediathek/page.js:23,58`, `src/app/mediathek/[slug]/page.js:26,50,58`, `src/data/navigation.js:146`, `src/app/sitemap.js:15,377` | umgesetzt (unveröff.); noch keine Videos (`REELS = []`) |
| REQ-MED-02 | Aufbereitung neuer Videos per Skript (MP4 max. 720×1280, Vorschaubild, Dauer, Eintrag in `reels.js`); Rohdateien nicht versioniert. | `scripts/reels-optimieren.mjs`, `src/data/reels.js:9-18`, `.gitignore` (`reels-roh/`) | umgesetzt (unveröff.); ffmpeg lokal nicht installiert |
| REQ-MED-03 | Nur Videos mit geklärten Rechten veröffentlichen (Musik aus der Facebook-Musikbibliothek ist nur auf Meta-Plattformen lizenziert). | Auftrag Koordinator Welle 3 | **nicht im Repo belegt** – kein Hinweis in `src/data/reels.js` oder `scripts/reels-optimieren.mjs` gefunden; organisatorisch offen (F-21) |
| REQ-SIE-01 | WKO-Siegel „Meisterbetrieb“ und „Elektrotechnik“ im Startseiten-Hero, lokal gespeichert (kein Abruf bei wko.at), Quelle dokumentiert. | `src/app/page.js`, `public/Images/AT/siegel/*.png`, `public/Images/AT/QUELLEN-siegel.md` | umgesetzt (unveröff.); Berechtigung vom Auftraggeber zu bestätigen |
| REQ-PRO-01 | PV-Prognose `/pv-prognose`: stündlicher Solarertrag der nächsten 60 h für eine Adresse aus GeoSphere-Wettermodell C-LAEF (`nwp-v2-1h-1km`) mit Unsicherheitsband aus dem Ensemble (`ensemble-v2-1h-1km`, P10/P50/P90) und Day-Ahead-Preisen AT; Leistungsrechnung im Browser, damit Parameteränderungen keine Abrufe auslösen. | `src/app/pv-prognose/page.js`, `src/app/api/pv-prognose/route.js:1-13`, `src/lib/prognose/*`, `src/components/Prognose/*` | umgesetzt (unveröff.); Modellparameter nicht validiert |
| REQ-PRO-02 | Schonung des GeoSphere-Limits: Cache je Rasterzelle (0,05°) und Modelllauf, `/metadata` höchstens alle 20 min, eigener Deckel 200 Abrufe je gleitender Stunde (GeoSphere: 240/h, 5/s), Auswertung `X-RateLimit-Remaining-Hour`, Timeout 8 s, Rückfall auf Cache bis 12 h; Drosselung 30 Anfragen je IP und 10 min. | `src/lib/prognose/geosphere.js:19-25,42`, `src/lib/prognose/budget.js:6-8`, `src/app/api/pv-prognose/route.js:26-34` | umgesetzt (unveröff.); Zähler je Serverinstanz |
| REQ-PRO-03 | Pflicht-Quellenangabe „Datenquelle: GeoSphere Austria - https://data.hub.geosphere.at“ (CC BY 4.0), „Prognose ohne Gewähr“; keine Push- oder EMS-Schnittstelle. | `src/app/pv-prognose/page.js:69,198` | umgesetzt (unveröff.); GeoSphere-AGB rechtlich prüfen |
| REQ-SNK-01 | Schneelast-Karte `/schneelast` und 9 Bundesland-Seiten `/schneelast/[bundesland]` mit Richtwert je Ort, Karte (`/schneelast/karte.png`, beim Build erzeugt), Punktabfrage `/schneelast/richtwert` (Raster lokal, Seehöhe über Open Topo Data, kein Wert über 2.000 m, eHORA-Direktlink); Redirect `/schneelast` → `/standort-check` entfernt. | `src/app/schneelast/**`, `src/lib/schneelast/*`, `src/components/Schneelast/*`, `next.config.mjs` (Redirect entfernt, Tracing `/schneelast/richtwert`) | umgesetzt (unveröff.); **SEO-Welle:** die 9 Länderseiten sind als Sprungmarken in `/schneelast#<land>` zusammengeführt (308), eigenes Dataset-Schema |
| REQ-EIN-01 | `/einspeisung-gewerbe`: OeMAG-Marktpreise lückenlos ab 01/2024, E-Control-Quartalspreise, Referenzmarktwert PV, Erlös-Rechner mit Szenarien; jede Zahl mit Quelle; Warnhinweis, wenn die Daten älter als 35 Tage geprüft sind; keine automatisierten Abrufe. | `src/data/oemag.js:1-26`, `src/lib/einspeisung.js`, `src/components/Einspeisung/*`, `src/app/einspeisung-gewerbe/page.js` | umgesetzt (unveröff.); monatliche Pflege |
| REQ-EG-01 | `/energiegemeinschaften/betriebe-gemeinden`: Teilnahme-Check EEG/BEG/P2P/GEA je Akteur, 6-MW-Grenze, Lieferantenschwelle, 10-%-Regel, Netzentgelt je Nahebereich (Abschläge ab 2027 als „offen“ gekennzeichnet), Deeplinks in den EG-Rechner. | `src/lib/egBetriebe.js`, `src/components/EGBetriebe/*`, `src/app/energiegemeinschaften/betriebe-gemeinden/page.js` | umgesetzt (unveröff.) |
| REQ-KOM-01 | `/kommunen/vergabe-foerderung`: Vergabe-Wegweiser nach Schwellenwerten 2026 (inkl. Sektorenauftraggeber, EU-Schwellen), Förderübersicht, Checkliste für den Gemeinderat. | `src/lib/kommunen/*`, `src/components/KommunenVergabe/*`, `src/app/kommunen/vergabe-foerderung/page.js` | umgesetzt (unveröff.) |
| REQ-FLA-01 | `/flaechen-check`: Eignungsampel für Grundeigentümer (Widmung je Land, Größe, Netz, Hang), belegte Pachtspanne, Checkliste Pachtvertrag; Faustregeln als Ökovolt-Annahmen gekennzeichnet. | `src/lib/flaeche/*`, `src/components/FlaechenCheck/*`, `src/app/flaechen-check/page.js` | umgesetzt (unveröff.); Faustregeln freigeben |
| REQ-FLA-02 | `/freiflaechen-photovoltaik/widmung` + 9 Landesseiten mit Rechtsgrundlagen, Schwellen, Beschleunigungsgebieten (Stand je Land, offene Punkte markiert). | `src/app/freiflaechen-photovoltaik/widmung/**`, `src/lib/flaeche/laender.js` | umgesetzt (unveröff.); vierteljährliche Prüfung |
| REQ-FIN-01 | `/rechner/finanzierung`: Kauf, Kredit, Leasing, Contracting und PPA über 20 Jahre (Barwert, Cashflow, Amortisation, IRR, Effektivzins aus Leasingfaktor); Konditionen als Beispielwerte gekennzeichnet. | `src/lib/rechner/finanzierung.js`, `src/components/RechnerFinanzierung/*`, `src/app/rechner/finanzierung/page.js` | umgesetzt; Beispielwerte weiter ohne Marktbeleg; `/service/finanzierung` spricht nur noch von Beratung (neue FAQ „Bietet Ökovolt Leasing oder Finanzierungen an?“) |
| REQ-TEI-01 | Teilen-Link (nur Abweichungen, manipulationssicher begrenzt) und druckbarer PDF-Bericht in den 8 Gewerbe-Rechnern; Ereignisse `rechner_geteilt` { rechner, weg } und `rechner_pdf` { rechner }. | `src/components/RechnerTeilen/*`, `src/components/RechnerGewerbe/*`, `src/components/ui/Teilen.js` | umgesetzt (unveröff.) |
| REQ-LAST-01 | `/lastgang-analyse`: 15-Minuten-CSV aus Netzbetreiber-Portalen **nur im Browser** auswerten (kein Upload), Lastprofil, Grundlast, Spitzen, PV-Größe, Peak-Shaving; Beispieldatei. | `src/lib/lastgang/*`, `src/components/Lastgang/LastgangAnalyse.js:42,109`, `src/app/lastgang-analyse/page.js`, `public/beispiele/lastgang-beispiel.csv` | umgesetzt (unveröff.); Portal-Formate nicht an echten Exporten geprüft |
| REQ-EXP-01 | A/B-Test-Infrastruktur ohne Cookies und Browserspeicher (Auslosung je Seitenaufruf), serverseitige Variante per Middleware-Header `x-ov-exp` mit `Cache-Control: private, no-store`, kein Cloaking (keine User-Agent-Weiche, keine SEO-relevanten Unterschiede), Ereignisse `exp_gesehen` und `exp` an Anfragen; Test K1 angelegt, **inaktiv**. | `src/lib/experimente.js:1-30`, `src/middleware.js`, `src/components/Experimente/*`, `src/components/Angebot/Konfigurator.js` | umgesetzt (unveröff.); Start von K1 offen |
| REQ-BL-01 | Bundesland-Hubs `/photovoltaik-bundesland` und `/photovoltaik-bundesland/[land]`: Ertrag, Schneelast-Spanne, Netzbetreiber, Referenzen (Zuordnung über Unternehmenssitz), Regionalseiten. | `src/lib/bundesland/auswertung.js`, `src/components/Bundesland/*`, `src/app/photovoltaik-bundesland/**`, `next.config.mjs` (Tracing) | umgesetzt (unveröff.); Doorway-Risiko prüfen (E9) |
| REQ-HER-01 | Herstellermarken: eigene Seiten nur für belegte Marken (Fronius, Huawei, BYD, Sigenergy, Solis, meteocontrol); übrige Marktführer nur in neutralen Vergleichs-/Ratgeberseiten. | Entscheidung Auftraggeber 30.09.2026; SEO-Plan M17–M20 | **umgesetzt (unveröff.)**: `partner.js` einzige Quelle mit `belegt`; `/produkte/wechselrichter` + Fronius, Huawei, Solis; neutrale Vergleichstabellen (18 Marken, alphabetisch, Datenblattquellen); Service-Abschnitt für Fremdmarken abgeschaltet (E4) |
| REQ-ENE-01 | Live-Strommarkt Gebotszone AT (Day-Ahead, Erzeugung) serverseitig gecacht; Rückfall aWATTar. | `src/lib/energy.js:1-22`, `src/app/api/energie/live/route.js:6,32` | umgesetzt |
| REQ-INH-01 | Inhalte: 69 Ratgeber-Artikel, Lexikon 142 Begriffe, 51 FAQ, 37 Regionalseiten. | `docs/AT-UEBERGABE.md:27-28` | umgesetzt (laut Übergabe; Zählung nicht erneut geprüft) |
| REQ-REC-LEG-01 | Rechtsseiten Impressum, AGB, Datenschutz, Barrierefreiheit, Hinweisgeberschutz, Bildnachweis. | `docs/AT-UEBERGABE.md:11-14` | umgesetzt; Rechtsprüfung offen |

## 3. Nicht-funktionale Anforderungen

| ID | Kategorie | Anforderung | Quelle | Status |
|---|---|---|---|---|
| REQ-NF-PERF-01 | Performance | Externe Daten serverseitig mit Cache (Inhalte 600 s, Energie 900 s, Standort privat 1 h). | `src/components/Project/ladeProjekte.js:28`, `src/app/api/energie/live/route.js:6`, `src/app/api/standort/route.js:137` | umgesetzt |
| REQ-NF-PERF-02 | Performance | Bildoptimierung AVIF/WebP, lange Cache-Header für statische Assets, Kompression. | `next.config.mjs` (HEAD Zeilen 17, 149-170, 190-200) | umgesetzt |
| REQ-NF-PERF-03 | Performance | Messbare Zielwerte (z. B. Core Web Vitals). | – | **offen** (keine Zielwerte/Messungen im Repo) |
| REQ-NF-PERF-04 | Performance | Schriften nur Subset „latin“ vorladen, Hero-Video optimiert, Cookie-Banner im Footer per `next/dynamic`, Reveal-Observer nach dem Durchlauf abbauen. | `src/app/layout.js:10-24`, `src/components/Home2/HeroVideo.js`, `src/components/Reusable/footer.js`, `src/components/ui/RevealObserver.js` | umgesetzt (unveröff.); Wirkung nicht gemessen |
| REQ-NF-A11Y-01 | Barrierefreiheit | BaFG; technisch EN 301 549 / WCAG 2.1 AA, Ziel WCAG 2.2 AA; Erklärung zur Barrierefreiheit. | `src/app/barrierefreiheit/page.js:58-69` | teilweise – Audit/Prüfbericht nicht im Repo (offen) |
| REQ-NF-A11Y-02 | Barrierefreiheit | Sprache `de-AT`, Sprunglink, Rücksicht auf `prefers-reduced-motion`. | `src/app/layout.js:220`, `src/components/Reusable/LayoutWrapper.js`, 50 Dateien mit `prefers-reduced-motion` | umgesetzt |
| REQ-NF-A11Y-03 | Barrierefreiheit | Farbkontrast ≥ 4,5:1 für grünen Text auf hellen/getönten Flächen (ov-600/`#669933` → ov-700), rechnerisch geprüft. | `src/app/globals.css`, `scripts/kontrast.test.mjs` | umgesetzt (unveröff.); Browser-Nachmessung offen |
| REQ-NF-DS-01 | Datenschutz | Nicht notwendige Dienste (GA4, Heatmap, Google Maps, OSM-Karten) erst nach Einwilligung (§ 165 Abs. 3 TKG 2021). | `src/components/Cookies/cookiecomponent.js`, `src/components/Datenschutz/datenschutz.js` | umgesetzt; Rechtsprüfung offen |
| REQ-NF-DS-02 | Datenschutz | Löschfristen gemäß VVT; Anfragen (`oekovolt_app`) nach 24 Monaten anonymisieren (außer „Angebot erstellt“/„Gewonnen“); Heatmap höchstens 14 Monate. | `docs/datenschutz/VVT-*.md`, `Import-Backend-Frappe/apps/oekovolt_app/README.md` (Löschfrist), `Import-Backend-Frappe/apps/oekovoltdeutchland/README.md` (Hooks) | im Backend-Paket umgesetzt (unveröff.); VVT-Anpassung und Rechtsprüfung offen |
| REQ-NF-DS-03 | Datenschutz | Keine Secrets im Repository. | `.gitignore` (`.env*`, `*.pem`), Prüfung in 05 | umgesetzt (Prüfung 30.09.2026 ohne Fund) |
| REQ-NF-DS-04 | Datenschutz | Verzeichnis von Verarbeitungstätigkeiten für AT je Verarbeitung (u. a. Anfragen, Heatmap, Kundenbühne, Lastgang, Mediathek) mit Abweichungstabelle zur Datenschutzerklärung. | `docs/datenschutz/00-Uebersicht-VVT.md`, `docs/datenschutz/VVT-*.md` | Entwurf; Datenschutzerklärung an den Code angeglichen (SEO-Welle P8); rechtlich prüfen |
| REQ-NF-SEO-01 | SEO | Title ≤ ~60 Zeichen, Description 140–160, Canonical, `de_AT`, strukturierte Daten entsprechen sichtbarem Inhalt. | `docs/AT-BRIEFING.md:17-22` | umgesetzt laut QA-Crawl (`docs/AT-UEBERGABE.md:3-5`) |
| REQ-NF-SEO-02 | SEO | hreflang nur für auf .de und .com identische Pfade, bidirektional. | `src/lib/hreflang.js` (28 Pfade in `SHARED_PATHS`), `docs/AT-UEBERGABE.md:73-75` | umgesetzt (unveröff.); Gegenrichtung auf oekovolt.de offen |
| REQ-NF-SEO-03 | SEO | Sitemap mit festen `lastModified`-Daten; IndexNow nach Deploy. | `src/app/sitemap.js:15-29`, `scripts/indexnow.mjs` | umgesetzt |
| REQ-NF-SEO-04 | SEO | 301 für alte URLs/Kurz-URLs (inkl. 7 alter Hersteller-Slugs), 410 für WordPress-Artefakte. | `next.config.mjs` (redirects), `src/middleware.js:1-58` | umgesetzt |
| REQ-NF-SEO-06 | SEO | Organisations-Schema ohne `parentOrganization`, mit `contactPoint`, `brand` und Instagram in `sameAs` (auch im Footer); Ratgeber-`author` nur als `@id`-Verweis; Presse-Detailseiten und Netzanmeldung in der Sitemap. | `src/app/layout.js`, `src/lib/site.js`, `src/components/Reusable/footer.js`, `src/app/ratgeber/[slug]/page.js`, `src/app/sitemap.js` | umgesetzt (unveröff.) |
| REQ-NF-SEO-07 | SEO/GEO | KI-Training sperren, Such- und Antwort-Crawler erlauben (Entscheidung E1, Variante B). | `public/robots.txt` | **umgesetzt (unveröff.)**: vier Gruppen (Suchmaschinen, KI-Suche/Abruf, Training gesperrt inkl. Applebot-Extended, anthropic-ai, Claude-Web, Amazonbot, cohere-training-data-crawler, Alle übrigen) |
| REQ-NF-SEO-08 | SEO/GEO | Maßnahmen M01–M30 des SEO-Plans (Kapitel 11). | `docs/projekt-doku/11-seo.md` | überwiegend umgesetzt – Stand je Maßnahme in 11 |
| REQ-NF-SEO-09 | SEO/GEO | KI-Crawler erhalten Metadaten im `<head>` vor dem Streaming (`htmlLimitedBots` = Next-Standardliste + GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, DuckAssistBot, SeznamBot, Qwantbot, MojeekBot, Amazonbot). | `next.config.mjs` | umgesetzt (unveröff.); Nachweis nur im Dev-Modus |
| REQ-NF-SEO-10 | SEO | Breadcrumb-Schema ohne Einträge ohne `href` (nur letzter Eintrag ohne Link). | `src/components/ui/Breadcrumbs.js` | umgesetzt (unveröff.) |
| REQ-NF-SEO-11 | SEO | Robots-Angaben zentral im Layout (inkl. `max-*` auch für Bing); seitenweise nur `nurNoindex()` für bedingtes noindex. | `src/app/layout.js:216-230`, `src/lib/seo/robots.js` | umgesetzt (unveröff.) |
| REQ-NF-SEO-12 | SEO | Sitemap nur mit indexierbaren Seiten und echtem `lastModified` je Datenquelle bzw. `GEAENDERT`-Liste; Bild-Sitemap der Referenzfotos. | `src/app/sitemap.js:113` | umgesetzt (unveröff.); laut Koordinator 305 URLs |
| REQ-NF-SEO-13 | GEO | `llms.txt`/`llms-full.txt` mit Stand-Datum und Blöcken „Werkzeuge & Daten“, „Förderung & Netz“, „Referenzen“, „Hersteller“ (nur belegt), stündlich aktualisiert; gleiche Indexierbarkeits-Regel wie die Sitemap. | `src/lib/llms.js:34-62`, `src/app/llms.txt/route.js`, `src/app/llms-full.txt/route.js` | umgesetzt (unveröff.) |
| REQ-NF-SEO-14 | SEO | IndexNow meldet nur neue/geänderte URLs (Zustandsdatei), prüft den Schlüssel, behandelt 403/422/429; Presse-Veröffentlichungen werden über den Kanal-Webhook gemeldet (nur mit `INDEXNOW_AKTIV=1`). | `scripts/indexnow.mjs:1-25`, `src/lib/indexnow.js`, `src/lib/kanaele/veroeffentlichungen.js`, `src/app/api/kanaele/verteilen/route.js:8,83`, `.gitignore` | umgesetzt (unveröff.); erster Lauf nach Deploy |
| REQ-NF-SEO-15 | SEO | Onpage: eigener Title (≤ 60) und Description (≤ 160) je Seite, Suchbegriff in der H1 der Hauptseiten, getrennte Zielseiten bei überschneidenden Themen, keine Waisenseiten, feste Datumsangaben auf Projektseiten. | P3-Dateien laut 08 | umgesetzt (unveröff.); QA: 305 Seiten mit je einer H1, keine doppelten Titles |
| REQ-NF-SEO-16 | SEO/GEO | Entität: `memberOf` PV&B Austria (belegt), keine unbelegten Handles, `sameAs`/`hasMap` aus `FIRMA`, Verifizierung nur per Umgebungsvariable, Abschnitt AT/DE/CH auf „Über uns“. | `src/app/layout.js`, `src/lib/site.js`, `src/app/uber-uns/page.js` | umgesetzt (unveröff.) |
| REQ-NF-SEO-17 | GEO | Fachprüfer mit Schema (`reviewedBy`, Person) nur bei Einwilligung, Rolle und Qualifikation; FAQ „Antwort zuerst“ (18 von 51 mit Zahl, Einheit, Stand); `DefinedTerm` für EZA-Regler; Sponsoring-Links `rel="sponsored"`. | `src/data/fachpruefer.js` (alle `einwilligung: false`), `src/data/faqs.js`, `src/app/technik/parkregler/page.js`, `src/components/Sponsoring/sponsoringDaten.js` | umgesetzt (unveröff.); Einwilligungen offen |
| REQ-NF-SEO-18 | GEO | Datasets mit `description`, `license`, Methodik (Schneelast, Einspeisung; verlinkte Fremd-Datasets); Bundesland-Varianten mit 5-Wort-Überschneidung < 0,35. | `src/app/schneelast/page.js`, `src/app/einspeisung-gewerbe/page.js`, `src/lib/bundesland/auswertung.js` | umgesetzt (unveröff.) |
| REQ-NF-SEO-19 | SEO | 301 für alte WordPress-URLs (`/unternehmen`, `/photovoltaik-leasing`, `/photovoltaik-contracting`, `/photovoltaik-loesungen`) und `/ratgeber/reststromvermarktung`; hreflang in `seitenMeta`. | `next.config.mjs`, `src/components/Technik/seite.js` | umgesetzt (unveröff.) |
| REQ-NF-DS-05 | Datenschutz | Datenschutzerklärung entspricht dem Code (Fristen, Empfänger, neue Verarbeitungen: Lastgang, Kundenbühne, Standort/Schneelast/PV-Prognose, A/B-Tests); Abschnittsnummern berechnet. | `src/components/Datenschutz/datenschutz.js` | umgesetzt (unveröff.); rechtlich prüfen |
| REQ-NF-SEO-05 | SEO/GEO | `robots.txt` (Trainings-Crawler gesperrt), `llms.txt`/`llms-full.txt`. | `public/robots.txt`, `src/app/llms.txt`, `src/app/llms-full.txt` | umgesetzt |
| REQ-NF-SEC-01 | Sicherheit | Sicherheits-Header (HSTS, nosniff, X-Frame-Options, Referrer-/Permissions-Policy); Sonderregeln `/tv`, `/scan`, `/fortsetzen`. | `next.config.mjs` (HEAD Zeilen 171-240) | umgesetzt; CSP fehlt (siehe 05) |
| REQ-NF-SEC-02 | Sicherheit | Keine offenen Proxys: `/api/optimize-video` entfernt, `/api/image` nur `/files/…`, Rewrite `/api/backoffice/*` entfernt. | `src/app/api/image/route.js:106-108`, Löschung `src/app/api/optimize-video/route.js` (git status), `next.config.mjs` | umgesetzt (unveröff.) |
| REQ-NF-DES-01 | Gestaltung | Corporate Design unverändert, keine neuen Designsprachen/Bibliotheken, kein TypeScript. | `docs/AT-BRIEFING.md:3-8` | umgesetzt – `heatmap.js` (Heatmap-Ansicht) vom Auftraggeber ausdrücklich gewünscht; Konfetti bewusst ohne Bibliothek |
| REQ-NF-DES-02 | Gestaltung | Visuelle Kontrolle im echten Browser, Desktop 1440 / Mobil 390. | `docs/AT-DESIGN.md:8-20`, `docs/AT-UEBERGABE.md:35-36` | für Stand 29.09. durchgeführt (laut Übergabe); neue Seiten offen |
| REQ-NF-I18N-01 | Sprache/Format | Österreichisches Deutsch, Sie-Form; Zahlen mit Punkt als Tausendertrennzeichen (Hydration), Datum `de-AT`. | `docs/AT-BRIEFING.md:77-82`, `docs/AT-UEBERGABE.md:45-46` | umgesetzt |
| REQ-NF-WART-01 | Wartbarkeit | Zentrale Konstanten importieren (`src/lib/site.js`, `src/data/navigation.js`). | `docs/AT-BRIEFING.md:24-28` | umgesetzt |
| REQ-NF-VERF-01 | Verfügbarkeit | Ausfall des Backoffice darf keine 404/500 erzeugen: statische Rückfälle, verständliche Fehlermeldungen. | `src/components/Project/ladeProjekte.js`, `src/lib/api/uber-uns/anfrageWeiterleiten.js:12-13`, Commit `5e40806` | umgesetzt |
| REQ-NF-TEST-01 | Qualität | Sammellauf aller Node-Tests mit Exit-Code für CI; bekannte Befunde als `todo`, die den Lauf nicht abbrechen. | `scripts/alle-tests.mjs`, `scripts/*.test.mjs` (21), `scripts/lib/` | umgesetzt (unveröff.); `npm test` in `package.json`; keine `todo`-Befunde mehr |
