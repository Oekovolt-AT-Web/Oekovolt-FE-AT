# 10 – Rückverfolgbarkeit (Traceability-Matrix)

In Anlehnung an ISO/IEC/IEEE 29148 (Rückverfolgbarkeit von Anforderungen). Keine Normkonformität behauptet.
Stand: Version 0.3, 30.09.2026 (Nachführung Welle 3).

Spalten: **Anforderung** (Kapitel 01) → **Umsetzung** (Datei) → **Test** (Kapitel 06; „–“ = kein automatisierter
Test, „manuell“ = nur Sichtprüfung/Abnahme vorgesehen) → **Status**.
Statuswerte wie in Kapitel 01. „unveröff.“ = nur im Arbeitsbaum, nicht committet.

## 1. Funktionale Anforderungen

| Anforderung | Umsetzung | Test | Status |
|---|---|---|---|
| REQ-ANF-01 Kontakt | `src/components/Kontakt/KontaktFormular.js`, `src/app/api/create_contact/route.js` | – (Abnahme Spez. Abschn. 8) | umgesetzt; Backoffice offen |
| REQ-ANF-02 Service-Anfragen | `src/components/ServiceAT/ServiceAnfrage.js` | – | umgesetzt |
| REQ-ANF-03 Konfigurator | `src/components/Angebot/Konfigurator.js`, `src/app/api/create_anfrage/route.js`, `src/lib/rechner/angebot.js` | – | umgesetzt |
| REQ-ANF-04 PDF-Analyse | `src/components/Analyse/PdfAnalyse.js`, `src/app/api/analyse/pdf/route.js`, `src/lib/analyse/*` | – | umgesetzt |
| REQ-ANF-05 Rückruf | `src/components/Rueckruf/RueckrufFormular.js`, `RueckrufWidget.js`, `src/app/api/rueckruf/route.js`, `src/lib/rueckrufApi.js` | – | umgesetzt; CloudTalk offen |
| REQ-ANF-06 Termin | `src/components/Rueckruf/TerminBuchung.js`, `src/app/api/termin/**`, `src/lib/terminKalender.js`, `src/lib/terminSlots.js`; Backend `Import-Backend-Frappe/apps/oekovolt_app/oekovolt_app/website_api/termin*.py` | T-TERMIN (37 Tests), T-VERTRAG | umgesetzt; Backoffice-Installation offen |
| REQ-ANF-07 Unterlagen per Smartphone | `src/components/Scan/*`, `src/app/api/scan/**`, `src/lib/scan/backend.js` | – | umgesetzt; Backoffice offen |
| REQ-ANF-08 Award/Sponsoring/Partner | `src/app/api/{award,sponsoring,partner-registrierung}/route.js`, `src/lib/api/uber-uns/anfrageWeiterleiten.js` | – | umgesetzt |
| REQ-ANF-09 Herkunft | `src/lib/herkunft.js`, `src/lib/herkunftServer.js` | – | umgesetzt |
| REQ-ANF-10 Fehlerbehandlung | `src/lib/backendFehler.js` | – | umgesetzt |
| REQ-ANF-11 Honeypot | Website: `anfrageWeiterleiten.js:92`, `analyse/pdf/route.js:60`, `scan/start/route.js:27`, `hinweis/route.js:26`; Backoffice: `oekovolt_app/website_api/*` | T-VERTRAG (Honeypot-Prüfung) | umgesetzt |
| REQ-ANF-12 IP serverseitig | `src/lib/ipAdresse.js` | – | umgesetzt (R-18) |
| REQ-ANF-13 Drosselung/Größenlimit aller Anfrage-Routen | `src/lib/api/uber-uns/anfrageWeiterleiten.js:102-150`, `src/app/api/{create_contact,create_anfrage,rueckruf,termin}/route.js` | – (Q-05) | umgesetzt (unveröff.) |
| REQ-REC-01…03 Rechner | `src/app/rechner/**`, `src/components/Rechner/*`, `src/components/RechnerGewerbe/*`, `src/lib/rechner/*` | – (Tests laut Übergabe, nicht im Repo; Q-01) | umgesetzt |
| REQ-REC-04 Übergabe an Konfigurator | `src/lib/rechner/angebot.js`, `src/lib/rechner/gewerbepv.js` | – | umgesetzt |
| REQ-REC-05 Ergebnis-Messung | `src/lib/useRechnerErgebnis.js` | – | umgesetzt |
| REQ-REC-06 Annahmen freigeben | `src/lib/rechner/annahmen.js`, `src/lib/energy.js` | – | Freigabe offen (F-07) |
| REQ-REC-07 Ergebnis teilen | `src/components/Solarrechner/ErgebnisTeilen.js`, `src/lib/rechnerTeilen.js` | – | umgesetzt |
| REQ-STO-01 Adresssuche | `src/lib/standort/dienste.js`, `src/app/api/standort/route.js` | – | umgesetzt |
| REQ-STO-02 Seehöhe | `src/lib/standort/dienste.js:147-160` | – | umgesetzt |
| REQ-STO-03 PVGIS | `src/lib/standort/dienste.js` | – | umgesetzt |
| REQ-STO-04 keine HORA-Abfrage | `src/lib/standort/hora.js` | – (Code-Durchsicht) | umgesetzt |
| REQ-STO-05 Schneelast-Richtwert | `src/lib/standort/schneelastRaster.js`, `data/schneelast/*`, `src/components/StandortCheck/StandortCheck.js` | T-SNOW (8 Tests) | umgesetzt; F-01 offen |
| REQ-STO-06 kein Wert > 2.000 m | `src/app/api/standort/route.js:112-121` | – | umgesetzt |
| REQ-STO-07 kein Wert auf Gletschern | `scripts/schneelast-raster-erzeugen.py:17-19,58` | – (nur Ergebnis über T-SNOW) | umgesetzt (unveröff.) |
| REQ-STO-08 Rückfall ohne Raster | `src/lib/standort/schneelastRaster.js:103-125` | T-SNOW (Negativfälle) | umgesetzt |
| REQ-STO-11 Erzeugungsweg Raster | `scripts/schneelast-raster-erzeugen.py` | – | umgesetzt (unveröff.) |
| REQ-STO-09 nur Österreich | `src/lib/standort/dienste.js:27-32`, `src/app/api/standort/route.js:77-99` | – | umgesetzt |
| REQ-STO-10 Drosselung | `src/app/api/standort/route.js:30-45` | – | umgesetzt |
| REQ-FOE-01 Fördercall-Seite/Phasen | `src/app/forderungen/eag-foerdercall/page.js`, `src/lib/foerdercall.js`, `src/components/Foerdercall/CallStatus.js` | T-FOE | umgesetzt |
| REQ-FOE-02 Schnellrechner | `src/components/Foerdercall/SchnellRechner.js`, `src/lib/foerdercall.js` | T-FOE | umgesetzt |
| REQ-FOE-03 ICS | `src/app/forderungen/eag-foerdercall/termin.ics/route.js` | – | umgesetzt |
| REQ-FOE-04 Hinweisleiste | `src/components/Foerdercall/HinweisLeiste.js`, `FoerdercallHinweis.js` | – | umgesetzt |
| REQ-FOE-05 Push zum Call | `src/components/Kanaele/PushOptIn.js`, `src/app/api/kanaele/verteilen/route.js` | manuell (Testversand) | Opt-in umgesetzt; Versand offen (F-02) |
| REQ-FOE-06 Landesförderungen | `src/data/bundeslaender.js`, `src/app/forderungen/landesforderungen/**` | – | umgesetzt |
| REQ-FOE-07 Förderangaben als Orientierung | `src/lib/foerdercall.js:17`, Seitentexte | – | umgesetzt |
| REQ-REF-01…03 Referenzen + Rückfall | `src/components/Project/ladeProjekte.js`, `src/components/Project/projektDaten.js`, `src/data/projekte.js`, `src/app/referenzen/**` | T-PROJ (9 Tests) | umgesetzt |
| REQ-REF-04 Bild-Host | `next.config.mjs` (`images.remotePatterns`) | T-PROJ („Bild-Hosts“) | umgesetzt |
| REQ-REF-05 Kundenbühne (Porträt, Siegel, Social-Kit, ESG) | `src/app/referenzen/projekte/[title]/{siegel,teilen,esg,bild}/*`, `src/app/siegel/[slug]/route.js`, `src/components/Kundenbuehne/*`, `src/lib/kundenbuehne.js`, `src/lib/kundenbuehneServer.js` | – (Q-07) | umgesetzt (unveröff.); F-16 offen |
| REQ-REF-06 Kundendaten mit Rückfall | `src/data/kunden.js`, Backend `oekovolt_app/website_api/projekte.py`, Spezifikation #1/#2 | T-VERTRAG (Antwortformen `get_projekt`) | umgesetzt (unveröff.) |
| REQ-KAN-01 Newsroom/Feeds/TV/Fediverse | `src/app/presse/**`, `src/app/tv/**`, `src/app/api/ap/**`, `src/lib/kanaele/*` | – | umgesetzt; Backoffice offen |
| REQ-KAN-02 Push/Verteilung | `src/app/push/actions.js`, `src/app/api/push/erneuern/route.js`, `src/app/api/kanaele/verteilen/route.js`, `public/sw.js` | – | umgesetzt |
| REQ-KAN-03 Demo nur lokal | `src/lib/kanaele/demo.js` | – | umgesetzt |
| REQ-MES-01 Umami | `src/components/Statistik/Umami.js`, `src/app/layout.js` | – | umgesetzt; Env offen (F-03) |
| REQ-MES-02 GA4 mit Einwilligung | `src/components/Statistik/GoogleAnalytics.js`, `src/components/Cookies/cookiecomponent.js` | – | umgesetzt; ID offen (F-09) |
| REQ-MES-03 Ereignisse ohne PII | `src/lib/statistik.js` | – | umgesetzt |
| REQ-MES-04 Heatmap | `src/lib/heatmap.js`, `src/app/api/heatmap/route.js`, `src/components/Statistik/{Heatmap,HeatmapSammler,HeatmapAnsicht}.js`, `src/components/Reusable/LayoutWrapper.js`; Backend `…/doctype/heatmap_zelle` | T-HEAT (18 Tests, Backend); Website-Teil – (Q-05) | umgesetzt (unveröff.) |
| REQ-MES-05 Ausnahmen | `GoogleAnalytics.js:24`, `Umami.js:29`, `src/lib/heatmap.js` (inkl. `/hinweisgebersystem`) | – | umgesetzt (unveröff.) |
| REQ-MES-06 Heatmap-Aufbewahrung/Pfad-Limit/Token | Backend `heatmap_zelle` (Job `alte_monate_loeschen`), `src/app/api/heatmap/route.js:74-80` | T-HEAT | umgesetzt (unveröff.); F-18 offen |
| REQ-NETZ-01 Netzanmeldung | `src/app/netzanmeldung/{page.js,checkliste/page.js,[betreiber]/page.js}`, `src/components/Netzanmeldung/*`; Sitemap/Navigation/Querverweise | – | umgesetzt (unveröff.) |
| REQ-NETZ-02 Netzbetreiber-Daten | `src/data/netzbetreiber.js` | – | umgesetzt (unveröff.) |
| REQ-KON-01…04 Konfetti | `src/lib/konfetti.js` + 11 Formular-Komponenten | – (manuell: reduced motion prüfen) | umgesetzt (unveröff.) |
| REQ-HIN-01 Hinweisgebersystem | `src/data/hinweisgeber.js` (Schalter), `next.config.mjs:32-39`, `src/lib/hinweisApi.js`, `src/app/api/hinweis/**`, `src/app/hinweisgebersystem`, `src/app/hinweisgeberschutz`; Backend `…/doctype/hinweis` (AT-Kategorien, Löschfrist 5 Jahre); `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md` | T-VERTRAG (nur `oekovolt_app`); manuell: Health-Check, Testmeldung | umgesetzt (unveröff.); F-10, F-18, F-23 offen |
| REQ-ANA-01 AT-Logo in PDF/Ergebnisbild | `src/lib/analyse/logo-hell.png` | manuell | umgesetzt (unveröff.) |
| REQ-UNT-01 Kennzahlen zentral | `src/data/kennzahlen.js`, `src/data/hero.js`, `src/app/presse/page.js`, `src/app/referenzen/projekte/page.js`, `src/app/referenzen/referenzkarte/page.js` | – (Q-09) | teilweise (Duplikate), F-19 offen |
| REQ-UNT-02 Mannschaft & Maschinenpark | `src/data/mannschaft.js`, `src/components/Mannschaft/*`, `src/app/uber-uns/page.js`, `src/app/page.js` | manuell | umgesetzt (unveröff.); F-22 offen |
| REQ-PRE-01 Pressekontakt | `src/components/Presse/PresseKontakt.js`, `src/app/presse/page.js` | manuell | umgesetzt (unveröff.); F-20 offen |
| REQ-MED-01 Mediathek | `src/data/reels.js`, `src/components/Reels/*`, `src/app/mediathek/**`, `src/data/navigation.js`, `src/app/sitemap.js` | – (Q-08) | umgesetzt (unveröff.), ohne Videos |
| REQ-MED-02 Video-Aufbereitung | `scripts/reels-optimieren.mjs`, `.gitignore` | – (Q-08) | umgesetzt (unveröff.) |
| REQ-MED-03 Musikrechte | – | – | offen (F-21) |
| REQ-SIE-01 WKO-Siegel | `src/app/page.js`, `public/Images/AT/siegel/*`, `public/Images/AT/QUELLEN-siegel.md` | manuell | umgesetzt (unveröff.); F-17 offen |
| REQ-ENE-01 Strommarkt live | `src/lib/energy.js`, `src/app/api/energie/live/route.js`, `src/app/energie-live/page.js` | – | umgesetzt; R-12 |
| REQ-INH-01 Inhalte | `src/content/ratgeber/*`, `src/data/{lexikon,faqs}.js`, `src/data/regionen/*` | QA-Crawl 29.09. (`docs/AT-UEBERGABE.md:3-5`) | umgesetzt |
| REQ-REC-LEG-01 Rechtsseiten | `src/app/{impressum,agb,datenschutz,barrierefreiheit,hinweisgeberschutz,bildnachweis}` | – | umgesetzt; Rechtsprüfung offen |

## 2. Nicht-funktionale Anforderungen

| Anforderung | Umsetzung | Test | Status |
|---|---|---|---|
| REQ-NF-PERF-01/02 | Caching in Loadern/Routen, `next.config.mjs` (images, headers) | – | umgesetzt |
| REQ-NF-PERF-03 | – | – | offen (Q-06) |
| REQ-NF-A11Y-01/02 | `src/app/layout.js:220`, `src/components/Reusable/LayoutWrapper.js`, `src/app/barrierefreiheit/page.js` | – (Q-04) | teilweise |
| REQ-NF-DS-01 | `src/components/Cookies/cookiecomponent.js`, `src/components/Datenschutz/datenschutz.js` | – | umgesetzt; F-04 |
| REQ-NF-DS-02 | `docs/datenschutz/VVT-*.md`; Backoffice-Jobs (`oekovolt_app` 24 Monate, Heatmap 14 Monate, Hinweis 5 Jahre) | – | Backend umgesetzt (unveröff.); VVT/Rechtsprüfung offen |
| REQ-NF-DS-03 | `.gitignore` | Secret-Prüfung 30.09.2026 (05) | umgesetzt |
| REQ-NF-SEO-01 | Seiten-`metadata`, Layout-Schema | QA-Crawl 29.09. | umgesetzt |
| REQ-NF-SEO-02 | `src/lib/hreflang.js` (28 Pfade) | – | umgesetzt (unveröff.); DE-Gegenrichtung offen |
| REQ-NF-SEO-03 | `src/app/sitemap.js`, `scripts/indexnow.mjs` | – | umgesetzt |
| REQ-NF-SEO-04 | `next.config.mjs` (redirects inkl. 7 Hersteller-Slugs), `src/middleware.js` | – | umgesetzt |
| REQ-NF-SEO-05 | `public/robots.txt`, `src/app/llms*.txt`, `src/lib/llms.js` | – | umgesetzt |
| REQ-NF-SEO-06 | `src/app/layout.js`, `src/lib/site.js`, `src/components/Reusable/footer.js`, `src/app/ratgeber/[slug]/page.js`, `src/app/sitemap.js` | – | umgesetzt (unveröff.) |
| REQ-NF-SEC-01 | `next.config.mjs` (headers) | – | umgesetzt; CSP fehlt |
| REQ-NF-SEC-02 | Löschung `src/app/api/optimize-video/route.js`, `src/app/api/image/route.js:106-108`, `next.config.mjs` (Rewrite entfernt) | – | umgesetzt (unveröff.) |
| REQ-NF-DES-01 | Bausteine `src/components/ui/*`; Ausnahme `heatmap.js` (ADR-016) | – | umgesetzt |
| REQ-NF-DES-02 | `docs/AT-DESIGN.md` | manuell 1440/390 | Stand 29.09.; neue Seiten offen |
| REQ-NF-I18N-01 | Formatfunktionen, Texte | – | umgesetzt |
| REQ-NF-WART-01 | `src/lib/site.js`, `src/data/navigation.js` | – | umgesetzt |
| REQ-NF-VERF-01 | `ladeProjekte.js`, `anfrageWeiterleiten.js`, `src/app/produkte/stromspeicher/[slug]/page.js` | T-PROJ | umgesetzt |

## 3. Auswertung

| Kennzahl (30.09.2026) | Wert |
|---|---|
| Anforderungs-IDs in Kapitel 01 | 92 (Welle 2: 85, Welle 1: 77) |
| davon mit automatisiertem Test verknüpft | 15 (REQ-ANF-06, REQ-ANF-11, REQ-STO-05, REQ-STO-08, REQ-FOE-01, REQ-FOE-02, REQ-REF-01…04, REQ-REF-06, REQ-MES-04 (nur Backend), REQ-MES-06, REQ-NF-VERF-01) |
| Schwerpunkte offen | Commit der Welle 2, Installation/Abnahme Backoffice, Rechtsprüfungen (Datenschutz, Löschfristen, Kundenbühne, UWG/Kartell), Build-Nachweis, Tests Website-Seite |

Hinweis: Die Zählung ist beim Nachführen neu zu erstellen.
