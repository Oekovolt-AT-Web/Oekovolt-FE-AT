# 04 – Daten, Datenquellen und Lizenzen

Merkmalsraster (Herkunft, Aktualität, Verantwortung) in Anlehnung an ISO/IEC 25012. Keine
Normkonformität behauptet. **Keine Rechtsberatung** – die Lizenzbewertung ist eine technische
Bestandsaufnahme; die rechtliche Prüfung ist offen (siehe 09).
Stand: Version 0.5, 30.09.2026 (Nachführung SEO-Welle P1–P9 und QA).

## 1. Externe Datenquellen und Namensnennung

| Quelle | Verwendung | Lizenz / Bedingungen (laut Code-Kommentar) | Namensnennung im UI | Beleg |
|---|---|---|---|---|
| GeoSphere Austria – SNOWGRID-CL v2.1 (Schneewasseräquivalent, 1961–2026, 1 km) | Schneelast-Richtwert (eigene Auswertung, als Datei im Repo) | CC BY 4.0, Nennung „GeoSphere Austria“ | Standort-Check: „Datenbasis: GeoSphere Austria, SNOWGRID-CL (CC BY 4.0), eigene Auswertung“; Quellenliste der Seite | `src/lib/standort/schneelastRaster.js:7-11`, `src/components/StandortCheck/StandortCheck.js:582,753`, `src/app/standort-check/page.js:85` |
| GeoSphere Austria – NWP v2 (`nwp-v2-1h-1km`, DOI 10.60669/rv80-9d61) und Ensemble v2 (`ensemble-v2-1h-1km`, DOI 10.60669/f21y-5007), C-LAEF AlpeAdria, 1 km, stündlich, 60 h | PV-Prognose (Laufzeitabruf) | CC BY 4.0; Pflicht-Quellenangabe „Datenquelle: GeoSphere Austria - https://data.hub.geosphere.at“; Nutzungsbedingungen verlangen Kenntnisnahme/Akzeptanz, Haftungsausschluss (https://data.hub.geosphere.at/legal); Limits 5/s, 240/h; Vorgänger v1 enden am 04.11.2026 | FAQ und Fußnote der Seite | `src/lib/prognose/geosphere.js:4-17`, `src/app/pv-prognose/page.js:69,198` |
| OeMAG (Marktpreise 2024–2026, PDF/Tabelle), E-Control (Quartalsmarktpreis, Referenzmarktwert PV, Marktpreis-Archiv), Land OÖ PV-Leitfaden, EAG-Abwicklungsstelle | `/einspeisung-gewerbe`, Erlös-Rechner | amtliche/öffentliche Veröffentlichungen, **manuell** übernommen, keine automatisierten Abrufe; Nutzungsbedingungen nicht gesondert dokumentiert (offen) | Quellenangaben je Wert auf der Seite | `src/data/oemag.js:1-26` |
| RIS (Rechtsinformationssystem des Bundes) und Spiegelungen (JUSLINE), WKO-Übersichten, Kanzlei-Übersichten, Landes-FAQ | Rechtsaussagen in EG-, Vergabe-, Widmungs-, Einspeise- und Datenschutzinhalten | amtliche Rechtstexte frei; **RIS war am 30.09.2026 nicht erreichbar (HTTP 503)** – Paragrafen teils über JUSLINE, Koordinationsstelle oder Sekundärquellen geprüft | Quellenangaben auf den Seiten | Agentenberichte Welle 4; R-35 |
| Landwirtschaftskammer Steiermark/Kärnten (Pachtspanne 3.000–5.000 €/ha·a, Stand 2022) | Flächen-Check | als „Angebotsniveau 2022“ gekennzeichnet | Quelle auf der Seite | `src/lib/flaeche/*` |
| Hersteller-Datenblätter und -Dokumente (Wechselrichter, Speicher, Module; 18 Marken) | neutrale Vergleichstabellen in Ratgebern (`#hersteller-vergleich`), Kennwerte der Hersteller-Detailseiten | Werte mit Link, Version und Abrufdatum 30.09.2026; keine Logos, keine Aussage über Verbau/Geschäftsbeziehung; Einschränkungen: Solis aus Betriebsanleitung, Huawei SUN2000/Sigenergy ohne Versionsangabe, Pylontech von Cloud-Speicher des Herstellers | Quellenzeile je Tabellenzeile | `src/content/ratgeber/wechselrichter-photovoltaik.js`, `solarmodule-vergleich.js` – R-55 |
| PV&B Austria Mitgliederliste | Beleg für `memberOf` | öffentliche Seite https://pvbaustria.at/mitglieder/ (geprüft 30.09.2026) | Registertabelle auf „Über uns“ | `src/lib/site.js` (`FIRMA.verbaende`) |
| Wikipedia (Verwaltungssitze), OSM-Koordinaten der Orte | Schneelast-Tabellen je Land | CC BY-SA / ODbL; Ortskoordinaten = Gemeinde-/Bezirkspunkt | Quellen auf der Seite | `src/lib/schneelast/orte.js` |
| basemap.at (Verwaltungsgrundkarte, Orthofoto) | Kartenkacheln Standort-Check | CC BY 4.0, Nennung „Datenquelle: basemap.at“ Pflicht | Karten-Attribution; Quellenliste; Impressum/Datenschutz | `src/components/StandortCheck/Karte.js:8-11`, `src/app/standort-check/page.js:90` |
| Statistik Austria (Bundesländer-Umrisse, vereinfacht von F. Perlot) | Österreich-Übersichtskarten (Regionen, Förderungen, Referenzkarte-Vorschau) | CC BY 4.0 (beide) | Konstante `AT_KARTE_QUELLE` | `src/components/Region/oesterreichKarte.js:1-7`, `src/components/Referenzkarte/ReferenzKarte.js:29` |
| PVGIS 5.3 (JRC, EU-Kommission), SARAH3 2005–2023 | Ertrag Standort-Check; `src/data/regionen-pvgis.json` | frei, Weiterverwendung mit Quellenangabe „PVGIS © Europäische Union“; Limit 30 Anfragen/s je IP | „PVGIS (…) © Europäische Union“ im Standort-Check | `src/lib/standort/dienste.js:14-17`, `src/components/StandortCheck/StandortCheck.js:912` |
| OpenStreetMap / Nominatim | Adresssuche, Rückwärtssuche, Geokodierung Referenzorte | ODbL; Nominatim-Policy: max. 1/s, User-Agent, Cache, keine Autovervollständigung | „Adresssuche: © OpenStreetMap-Mitwirkende (Nominatim)“ | `src/lib/standort/dienste.js:6-9`, `src/components/StandortCheck/StandortCheck.js:463` |
| OpenStreetMap-Kacheln | Referenzkarte (Leaflet) | ODbL / Tile-Usage-Policy | Link auf openstreetmap.org/copyright in der Attribution | `src/components/Referenzkarte/LeafletKarte.js:51-52` |
| OSRM-Demoserver (OSM-Daten) | Straßenroute ab Firmensitz in `regionen-pvgis.json` (einmalig per Skript) | ODbL (Daten); Demoserver-Nutzungsregeln **offen** | Feld `route_quelle` in JSON | `scripts/regionen-pvgis.mjs:10-11`, `src/data/regionen-pvgis.json:3` |
| Open Topo Data – EU-DEM v1.1 (Copernicus) | Seehöhe | frei mit Quellenangabe; öffentliche API 1/s, 1.000/Tag | im Datenschutztext genannt; **sichtbare Quellenangabe im Standort-Check-Ergebnis nicht belegt** (offen) | `src/lib/standort/dienste.js:10-13`, `src/components/Datenschutz/datenschutz.js` (Abschnitt Standort-Check) |
| Energy-Charts (Fraunhofer ISE) | Day-Ahead-Preis AT, Nettostromerzeugung AT | CC BY 4.0 (Energy-Charts); Preisdaten laut Seite „Bundesnetzagentur \| SMARD.de“ | „Quelle: Energy-Charts (Fraunhofer ISE), CC BY 4.0“ | `src/lib/energy.js:3-7`, `src/components/EnergieLive/ErzeugungChart.js:305`, `src/app/energie-live/page.js:340-351` |
| aWATTar Österreich | Rückfall für Day-Ahead-Preise | Bedingungen **nicht dokumentiert** (offen) | „Ersatzquelle für Preise: aWATTar Österreich“ | `src/lib/energy.js:8-9`, `src/app/energie-live/page.js:351` |
| EPEX Spot (Ursprung der Börsenpreise) | indirekt über Energy-Charts/aWATTar | Lizenzlage für die Anzeige von Börsenpreisen **offen** (R-12) | – | `src/lib/energy.js:3-12` |
| eHORA / HORA (hora.gv.at) | nur Direktlinks, **kein Abruf** | automatisiertes Abrufen laut HORA untersagt | Linktexte im Standort-Check | `src/lib/standort/hora.js:10,48` |
| Frei lizenzierte Fotos (Pexels, Unsplash, Pixabay, Wikimedia Commons u. a.) | Symbolbilder | je Bild in `public/Images/AT/QUELLEN-*.md` (19 Dateien) | Seite `/bildnachweis` liest `public/Images/**/QUELLEN*.md` automatisch | `docs/AT-UEBERGABE.md:13-14`, `public/Images/AT/QUELLEN-*.md` |
| Partnerbilder (Huawei, Sigenergy, meteocontrol) | Produkt-/Partnerseiten | Freigabe für AT **offen** | – | `docs/AT-UEBERGABE.md:98` |
| WKO-Siegel (Gütesiegel Meisterbetrieb, Elektrotechnik staatlich geprüft) | Hero der Startseite | abgerufen 30.09.2026 von wko.at, unverändert lokal gespeichert; Nutzung nur durch berechtigte Betriebe gemäß WKO – **Berechtigung vom Auftraggeber zu bestätigen** | Alt-Texte im Code; Quellendatei (erscheint damit auch unter `/bildnachweis`) | `public/Images/AT/QUELLEN-siegel.md`, `src/app/page.js` – R-28 |
| Websites der Referenzkunden (Impressum, „Über uns“) | Kundenporträts, Branche, Social-Links der Kundenbühne | Porträts in eigenen Worten, Quellen je Eintrag (`portraet_quellen`); Zitat/Logo nur mit Freigabe | Quellenliste im Kundenporträt (`src/components/Kundenbuehne/KundenPortraet.js:64-67`) | `src/data/kunden.js:1-16` – R-29 |
| Eigene Kurzvideos (Reels, bisher auf Facebook) | Mediathek, Startseite, Presse | eigene Aufnahmen; **Musik aus der Facebook-Musikbibliothek ist nur auf Meta-Plattformen lizenziert** (Hinweis des Koordinators) – Videos mit solcher Musik nicht selbst hosten oder Tonspur ersetzen; im Repo noch nicht vermerkt | – | `src/data/reels.js` (derzeit leer) – R-31 |
| Fotos Lkw/Traktor, Foto Pressekontakt | Mannschaft, Presse | eigene Fotos folgen; keine Kennzeichen/fremden Personen, Einwilligung der abgebildeten Person | – | `src/data/mannschaft.js` (Kopfkommentar), `src/components/Presse/PresseKontakt.js:3-6` |
| Hero-Video `intro.mp4` (zeigt ALPLA-Logo) | Startseite | Freigabe **offen** | – | `docs/AT-UEBERGABE.md:53`, `src/data/hero.js` |

## 2. Eigene Datenbestände

| Bestand | Inhalt | Herkunft | Aktualisierungsweg | Verantwortung | Beleg |
|---|---|---|---|---|---|
| `data/schneelast/sk50-at.bin` + `.json` | Uint16-Raster 584 × 329 Zellen, 1 km, EPSG:3416, s_k × 100, `leer` = 65535 (auch Gletscher-/Firnzellen); Kalibrierfaktor 1,0; Stand 30.09.2026 | eigene Auswertung SNOWGRID-CL v2.1 (`swe_tot` 1961–2026, Winterjahr 1.8.–31.7., Jahresmaxima, GEV/L-Momente nach Hosking, T = 50, SWE × 9,81/1000 = kN/m²) | `scripts/schneelast-raster-erzeugen.py` (Download ca. 0,9 GB, `numpy` + `h5py`), danach `export/sk50-at.*` nach `data/schneelast/` kopieren und `node scripts/schneelast-raster.test.mjs`; Metadaten `stand`, `zeitraum`, `kalibrierung` setzen | Technik (Freigabe F-01 offen) | `scripts/schneelast-raster-erzeugen.py:1-19,58,96`, `data/schneelast/sk50-at.json:1-15` |
| `src/data/projekte.js` | 58 Referenzprojekte (statischer Rückfall) | übernommen am 30.09.2026 von den Live-Detailseiten `oekovolt.com/referenzen/projekte/<slug>`; nur sichtbare Inhalte | nicht pflegen – führend ist das Backoffice; Datei entfällt, sobald `get_projekte` liefert; Abgleich per `node scripts/projekte-fallback.test.mjs --live` | Redaktion/Backoffice | `src/data/projekte.js:1-12`, `scripts/projekte-fallback.test.mjs:4,42` |
| `src/data/regionen-pvgis.json` | Solarerträge je Ort, Luftlinie/Route ab Ostermiething | PVGIS v5.3 + OSRM, abgerufen 28.09.2026 | `node scripts/regionen-pvgis.mjs` | Entwicklung | `scripts/regionen-pvgis.mjs:1-11` |
| `src/data/bundeslaender.js` | 9 Landesförderungen | Recherche, `STAND` 29.09.2026 | mindestens vierteljährlich prüfen, `STAND` anpassen | Redaktion | `src/data/bundeslaender.js:13-22` |
| `src/data/einspeiseverguetung.js` | OeMAG-Marktpreis / Einspeisetarife | Stand 29.09.2026, `stand: "2026-09"` | monatlich (OeMAG-Marktpreis) | Redaktion | `src/data/einspeiseverguetung.js:4,27,44`, `docs/AT-UEBERGABE.md:103` |
| `src/lib/foerdercall.js` | Termine, Budgets, Sätze 3. EAG-Call 2026 | EAG-Abwicklungsstelle, BMWET, geprüft 30.09.2026 | je Fördercall anpassen, `node scripts/foerdercall.test.mjs` | Redaktion/Entwicklung | `src/lib/foerdercall.js:1-31` |
| `src/lib/energy.js` `TARIF_ANNAHMEN` | Aufschläge Endkundenpreis | Richtwerte Stand 2026 | mit echten Angeboten abgleichen | Fachbereich | `src/lib/energy.js:24-30`, `docs/AT-UEBERGABE.md:92-93` |
| `src/lib/rechner/annahmen.js` u. a. | Rechner-Annahmen (Richtwerte) | eigene Annahmen | fachliche Freigabe offen | Fachbereich | `docs/AT-UEBERGABE.md:54-56` |
| `src/data/stellen.js` | 11 Stellen mit KV-Mindestentgelt | eigene Angaben | jährlich zum 1.1. (KV) | HR | `docs/AT-UEBERGABE.md:94` |
| `src/content/ratgeber/*` (68 Dateien) | Ratgeber-Artikel | eigene Redaktion mit Quellen | nach neuen Artikeln `node scripts/ratgeber-index.mjs`, `node scripts/og-bilder.mjs` | Redaktion | `docs/AT-UEBERGABE.md:106` |
| `src/data/lexikon.js`, `faqs.js`, `regionen/*` | Lexikon, FAQ, Regionalseiten | eigene Redaktion | bei Bedarf | Redaktion | `docs/AT-UEBERGABE.md:27-28` |
| `src/data/hero.js` | Kennzahlen Startseite (werbliche Aussagen) | Backoffice-Werte bzw. statisch | Aktualität/Belegbarkeit regelmäßig prüfen | GF/Marketing | `docs/Backoffice-Korrekturen.md:27` |
| `src/data/kunden.js` | Kundendaten zu 52 Referenzprojekten (Firmenwortlaut, Branche, Website, Social-Profile, Porträt, Quellen); 6 Projekte bewusst weggelassen (keine eindeutige Zuordnung/Quelle) | Recherche 30.09.2026 auf den offiziellen Websites der Kunden (Impressum, „Über uns“); Porträts in eigenen Worten; Social-Profile nur, wenn auf der Kunden-Website verlinkt; `freigabe` immer `false` | Rückfall – führend sind die Kundenfelder am Projekt im Backoffice (Spezifikation #1/#2); bei Änderungen `KUNDEN_STAND`/Prüfdatum anpassen | Marketing | `src/data/kunden.js:1-16` (unveröff.) |
| Kundenbühne-Kennzahlen | Jahresertrag = kWp × 1.050 kWh/kWp (bzw. Backoffice-Ertrag); CO₂ = Ertrag × 0,2582 kg/kWh | IEA PVPS National Survey Report Austria 2024; BMIMI „Innovative Energietechnologien in Österreich – Marktentwicklung 2024“, Tab. 34 | bei neuen Marktberichten prüfen | Fachbereich | `src/lib/kundenbuehne.js:6-25` |
| `src/data/kennzahlen.js` | 5.000 PV-Kraftwerke, **510.000 kWp (Welle 4, vorher 340.000; Auftraggeber: 510 MW)**, 112.000 t CO₂ (**ausgeblendet**, solange `CO2_ZEITRAUM` leer ist) (nur Ökovolt Österreich), `KENNZAHLEN_STAND` 30.09.2026, `CO2_ZEITRAUM` leer | Angabe der Geschäftsführung (30.09.2026); nicht identisch mit der Summe der online dokumentierten Referenzen | regelmäßig prüfen (UWG), `STAND` nachziehen; Duplikate in `unternehmen.js`, `llms.js`, `page.js` mitziehen | GF / Marketing | `src/data/kennzahlen.js:1-21` |
| `src/data/oemag.js` | (SEO-Welle: an Primärquellen erneut geprüft; der Ratgeber `oemag-marktpreis.js` liest jetzt daraus, Titel mit Monat automatisch) OeMAG-Monatswerte ab 01/2024, Quartalspreise, Referenzmarktwert PV, `STAND.geprueftAm`, `NAECHSTE_VEROEFFENTLICHUNG` | OeMAG, E-Control (geprüft 30.09.2026) | **monatlich** Anfang des Folgemonats; `node scripts/einspeisung.test.mjs` | Redaktion (Person benennen) | `src/data/oemag.js:6-12` |
| `src/lib/flaeche/laender.js` | Widmungsregeln, Schwellen, Beschleunigungsgebiete je Land, `STAND` | Landesgesetze, Landes-FAQ | vierteljährlich; `node scripts/flaeche.test.mjs` | Redaktion | – |
| `public/beispiele/lastgang-beispiel.csv` | synthetischer Lastgang (35.040 Viertelstunden) | erzeugt mit `beispielCsv()` aus `src/lib/lastgang/beispiel.js` | Test erkennt veraltete Datei | Entwicklung | `scripts/lastgang.test.mjs` |
| `public/presse/grafiken/*` (3 Grafiken, je SVG und PNG) | Schneelast-Karte, Schneelast je Land, OeMAG-Verlauf | eigene Auswertungen (GeoSphere-Raster, OeMAG) | bei neuen Daten neu erzeugen | Redaktion | gesetzte Lizenz CC BY 4.0 **vom Auftraggeber zu bestätigen** (R-57) |
| `src/data/fachpruefer.js` | drei benannte Fachprüfer, `einwilligung: false` | Angabe Auftraggeber | Freischaltung erst nach Einwilligung, Rolle, Qualifikation | GF | – |
| `src/data/mannschaft.js` | Ausstattung und Fähigkeiten (Lkw, Traktoren, Montageteams …) mit Quelle und `bestaetigt`-Flag | Angaben Auftraggeber, `unternehmen.js`, `site.js` | neue Einträge mit Quelle; Freischaltung per Flag | GF | `src/data/mannschaft.js:1-28` |
| `src/data/reels.js` | Videoliste (derzeit leer) | Reels der eigenen Facebook-Seite (Download Meta Business Suite) | `node scripts/reels-optimieren.mjs` (ffmpeg nötig), danach Texte ergänzen | Marketing | `src/data/reels.js:9-18,38-41` |
| `src/data/netzbetreiber.js` | Anmeldewege der fünf größten Verteilernetzbetreiber (nach Zählpunkten, E-Control Smart-Meter-Monitoringbericht 2025) | eigene Formulierungen nach Primärquellen (Websites, Formulare, Preisblätter der Netzbetreiber, E-Control, ElWG), Recherche 30.09.2026; jede Aussage mit `quellen`, Ungeklärtes in `offen` | bei Änderungen `GEPRUEFT_AM` je Betreiber und `STAND` anpassen | offen | `src/data/netzbetreiber.js:1-24` (unveröff.) |

## 3. Open-Source-Abhängigkeiten mit Lizenzhinweis

Auszug direkter Abhängigkeiten (Lizenzangabe aus `node_modules/<paket>/package.json` bzw. `LICENSE`, geprüft 30.09.2026):

| Paket | Version (installiert) | Lizenz | Hinweis |
|---|---|---|---|
| next | 15.5.19 | MIT | – |
| react-leaflet | 5.0.0 | **Hippocratic-2.1** | keine OSI-Lizenz, enthält Nutzungsbedingungen – rechtlich prüfen (R-17) |
| leaflet | 1.9.4 | BSD-2-Clause | nur als Peer-Abhängigkeit installiert, aber direkt importiert (`src/components/StandortCheck/Karte.js:4`) – nicht in `package.json` deklariert |
| tesseract.js | 7.0.0 | Apache-2.0 | Dateien lokal unter `public/tesseract` |
| web-push | 3.6.7 | MPL-2.0 | – |
| heatmap.js | 2.0.5 | MIT-Text in `LICENSE` (kein `license`-Feld in `package.json`) | Heatmap-Ansicht (`src/components/Statistik/HeatmapAnsicht.js:3`); vom Auftraggeber ausdrücklich gewünscht |
| @react-pdf/renderer, sanitize-html, qrcode, styled-components, react-icons, @react-google-maps/api | – | MIT | – |
| lucide-react | 0.511.0 | ISC | – |

Eine vollständige Lizenzliste (SBOM) ist **offen**.

## 4. Personenbezogene Daten (Verweis)

Verarbeitungen, Zwecke und Löschfristen sind in `docs/datenschutz/VVT-*.md` beschrieben; Zusammenfassung in Kapitel 05.
