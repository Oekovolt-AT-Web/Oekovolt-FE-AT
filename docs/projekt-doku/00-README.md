# Projektdokumentation oekovolt.com (Österreich) – Übersicht

| Dokumentenlenkung | |
|---|---|
| Dokument | Projektdokumentation Website oekovolt.com + Frappe-Backoffice |
| Version | 0.3 (Nachführung Welle 3) |
| Datum | 30.09.2026 |
| Stand des Codes | Branch `at-launch`, Commit `11472bf` (30.09.2026) zzgl. unveröffentlichter Arbeitsbaum-Änderungen der Wellen 2 und 3 (siehe [08](08-konfiguration-und-aenderungen.md)) |
| Autor | Claude (KI-Assistent) im Auftrag der Geschäftsführung |
| Prüfung | offen |
| Freigabe | offen |
| Ablage | `docs/projekt-doku/` im Repository `Oekovolt-FE-AT` |

## 1. Zweck

Diese Dokumentation beschreibt Anforderungen, Architektur, Schnittstellen, Daten und Lizenzen,
Sicherheit/Datenschutz, Tests, Betrieb, Konfigurationsmanagement, Risiken und Rückverfolgbarkeit
der österreichischen Website **www.oekovolt.com** (Next.js 15) und des zugehörigen
Frappe-Backoffice.

Sie ist **in Anlehnung an** die unten genannten ISO/IEC/IEEE-Normen gegliedert. Es besteht **keine
Zertifizierung** und es wird **keine vollständige Normkonformität** behauptet. Aus den Normen wird nur
die Gliederung bzw. die Art der Informationseinheit übernommen; Normtexte werden nicht zitiert.

Grundsatz: Dokumentiert ist nur, was im Repository belegt ist (Angabe `Datei:Zeile` oder Pfad).
Was nicht belegt werden kann, ist als **offen** markiert.

## 2. Leserkreis

| Leser | Relevante Teile |
|---|---|
| Geschäftsführung | 00, 01, 09 (Risiken, Freigaben) |
| Entwicklung (Website) | 01, 02, 03, 06, 07, 08, 10 |
| Backoffice-Betreuung (Frappe) | 03, 05, 07 und `docs/FRAPPE-AT-API-SPEZIFIKATION.md` |
| Datenschutz / Recht | 04, 05, 09 und `docs/datenschutz/*` |
| Redaktion | 04 (Aktualisierungswege), 07 (Pflegeaufgaben), `docs/Backoffice-Korrekturen.md` |

## 3. Normbezug (Gliederungshilfe)

| Datei | Normbezug („in Anlehnung an“) | Abgeleitete Informationseinheit |
|---|---|---|
| [01-anforderungen.md](01-anforderungen.md) | ISO/IEC/IEEE 29148 | Stakeholder, funktionale und nicht-funktionale Anforderungen mit ID, Quelle, Status |
| [02-architektur.md](02-architektur.md) | ISO/IEC/IEEE 42010 | Systemkontext, Stakeholder-Belange, Sichten (Baustein, Laufzeit, Verteilung), Architekturentscheidungen |
| [03-schnittstellen.md](03-schnittstellen.md) | ISO/IEC/IEEE 29148 (Schnittstellenanforderungen) / 15289 (Informationseinheit „Schnittstellenbeschreibung“) | Next-API-Routen, Frappe-Methoden, externe Dienste |
| [04-daten-und-lizenzen.md](04-daten-und-lizenzen.md) | ISO/IEC 25012 (Datenqualität, nur als Merkmalsraster) | Datenquellen, Lizenzen, Namensnennung, Aktualisierungswege |
| [05-sicherheit-und-datenschutz.md](05-sicherheit-und-datenschutz.md) | ISO/IEC 27001 Anhang A (nur Gliederung), DSGVO, TKG 2021 | Maßnahmen je Themenfeld, Secrets, Rollen, Einwilligung, Löschfristen |
| [06-test-und-qualitaet.md](06-test-und-qualitaet.md) | ISO/IEC/IEEE 29119-3, ISO/IEC 25010 | Testdokumentation (Testfälle, Ergebnisse), Qualitätsmerkmal-Matrix |
| [07-betrieb-und-deployment.md](07-betrieb-und-deployment.md) | ISO/IEC/IEEE 26514 | Betriebsanleitung: Umgebungsvariablen, Build/Deploy, Pflegeaufgaben |
| [08-konfiguration-und-aenderungen.md](08-konfiguration-und-aenderungen.md) | ISO/IEC/IEEE 12207 (Konfigurationsmanagement-Prozess) | Branch-Modell, Commit-Konventionen, Änderungsprotokoll |
| [09-risiken-und-offene-punkte.md](09-risiken-und-offene-punkte.md) | ISO/IEC/IEEE 16085 (Risikomanagement, nur als Raster) | Risikoregister, offene Freigaben |
| [10-rückverfolgbarkeit.md](10-rückverfolgbarkeit.md) | ISO/IEC/IEEE 29148 (Traceability) | Matrix Anforderung → Umsetzung → Test → Status |

## 4. Einordnung der vorhandenen Dokumentation

Die folgenden Dokumente bleiben unverändert an ihrem Ort und werden von hier aus verlinkt.

| Dokument | Inhalt | Eingeordnet in |
|---|---|---|
| `docs/AT-BRIEFING.md` | Zielbild, Unternehmensfakten, Leitplanken, Arbeitsregeln für Agenten | 01 (Quelle Stakeholder/Anforderungen), 08 |
| `docs/AT-DESIGN.md` | Design-Leitfaden, Pflicht zur Browser-Sichtprüfung | 01 (NFR), 06 |
| `docs/AT-RATGEBER-PLAN.md` | Redaktionsplan Ratgeber | 01, 04 |
| `docs/AT-UEBERGABE.md` | Übergabe, Vor-Livegang-Liste, regelmäßige Pflege | 07, 09 |
| `docs/FRAPPE-AT-API-SPEZIFIKATION.md` | vollständige Frappe-Schnittstellen für das AT-Backoffice | 03 (führend für Frappe-Methoden) |
| `docs/Backoffice-Korrekturen.md` | Redaktionelle Korrekturliste Backoffice | 04, 09 |
| `docs/datenschutz/*` | VVT, DSFA, Handbuch Meldestelle, Beschäftigteninfo | 05 |
| `docs/frappe-*/README.md` | Installations- und Fachdoku je Frappe-Modul | 03, 07 |
| `docs/regionen/` | DE-Recherche (laut `docs/AT-UEBERGABE.md:78` Aufräumkandidat) | – |
| `Import-Frappe/ANLEITUNG.md` | Installationsablauf Frappe-Pakete (DE-Stand) | 07 |
| `Import-Backend-Frappe/README.md`, `apps/*/README.md` | AT-Backoffice: Installation, Methoden, Kundenbühne, Heatmap, Löschfristen, Rollen | 03, 05, 07 |

## 5. Pflegeprozess (Nachführen)

- **Wer:** Claude (KI-Assistent) im Auftrag der Geschäftsführung; Prüfung/Freigabe durch eine benannte
  Person (offen).
- **Wann:** nach **jeder Arbeitswelle, vor dem Commit** der Welle.
- **Wie:**
  1. `git status`, `git diff --stat` und `git log` seit dem letzten Stand auswerten.
  2. Betroffene Kapitel nachführen (Anforderungen, Schnittstellen, Env-Variablen, Tests).
  3. Tests erneut ausführen und Ergebnisse in [06](06-test-und-qualitaet.md) eintragen.
  4. Änderungsprotokoll in [08](08-konfiguration-und-aenderungen.md) unter „Unveröffentlicht“ ergänzen;
     nach dem Commit in eine datierte Version überführen.
  5. Risikoregister ([09](09-risiken-und-offene-punkte.md)) und Matrix ([10](10-rückverfolgbarkeit.md)) aktualisieren.
  6. Versionsstand unten erhöhen.
- Kapitel dieser Doku sind bewusst getrennte Dateien, damit Nachführungen kleine, gut prüfbare Diffs ergeben.

## 6. Versionsstand

| Version | Datum | Änderung | Autor | Freigabe |
|---|---|---|---|---|
| 0.1 | 30.09.2026 | Erstfassung aller Kapitel 00–10 auf Stand `11472bf` + Arbeitsbaum | Claude (KI-Assistent) im Auftrag der Geschäftsführung | offen |
| 0.2 | 30.09.2026 | Nachführung Welle 2: Heatmap fertig, `Import-Backend-Frappe/` vollständig, SEO, Netzanmeldung, Kundenbühne, Konfetti, Sicherheitsbefunde S1–S4 behoben, Schneelast-Erzeugungsskript, AT-Logo im PDF, WKO-Siegel (neu erfasst); Tests erneut ausgeführt (inkl. neu T-HEAT, T-VERTRAG); P1–P12 abgearbeitet; `docs/FRAPPE-AT-API-SPEZIFIKATION.md` um Kundenbühne-Felder (#1/#2) und Heatmap (#15/#16) ergänzt | Claude (KI-Assistent) im Auftrag der Geschäftsführung | offen |
| 0.3 | 30.09.2026 | Nachführung Welle 3: zentrale Kennzahlen, Mannschaft & Maschinenpark, Pressekontakt, selbst gehostete Mediathek (Reels), Schalter `HINWEIS_INTERN` + Go-live-Anleitung, WKO-Siegel mit Quellendatei, Drosselung ohne IP geändert; Tests und Lint erneut ausgeführt | Claude (KI-Assistent) im Auftrag der Geschäftsführung | offen |

## 7. Beim nächsten Nachführen prüfen

### 7.1 Erledigt in Welle 2 (Liste aus Version 0.1)

| # | Bereich | Ergebnis |
|---|---|---|
| P1 | Heatmap | fertig: Frontend (`src/components/Statistik/Heatmap*.js`, `src/lib/heatmap.js`, `src/app/api/heatmap/route.js`), Backend (DocTypes Heatmap Zelle/Scroll/Seite, Bericht „Heatmap Auswertung“, 18 Unit-Tests), Vertrag in Spezifikation #15/#16; ESLint-Hinweis behoben (0 Warnungen) |
| P2 | `Import-Backend-Frappe/` | vollständig laut Auftraggeber: `apps/oekovolt_app`, `apps/oekovoltdeutchland`, `installation/` (`installieren.sh`, `site_config.sh`, `rollen.csv`, `website_env.txt`), `README.md` |
| P3 | SEO | 7 Hersteller-Slugs per 301, hreflang 28 Pfade, Organisations-Schema ohne `parentOrganization`, Instagram in `sameAs`/Footer, Presse in der Sitemap, Ratgeber-`author` nur `@id` |
| P4 | Netzanmeldung | `/netzanmeldung`, 5 Betreiberseiten, Checkliste; in Sitemap, Navigation und Querverweisen |
| P5 | Konfetti | 11 Aufrufstellen bestätigt; weiterhin nicht committet (Status „unveröff.“ bis zum Commit) |
| P6 | `heatmap.js` | vom Auftraggeber ausdrücklich gewünscht – erledigt (nur Konfetti sollte ohne Bibliothek sein) |
| P9 | Build | macht der Koordinator; Ergebnis in 06 eintragen, sobald gemeldet |
| P11 | `src/components/Photovoltaik/Region.js` | Löschung gewollt |
| P12 | Code-Befunde S1–S5 | S1–S4 behoben (siehe 05); offen: CSP, In-Memory-Drosselung, `X-Forwarded-For`, S5 `baseUrl.js` (nur toter Code) |

### 7.2 Offen für die nächste Nachführung

| # | Bereich | Prüfen |
|---|---|---|
| P7 | Datenschutzerklärung / Cookie-Banner | Rechtsprüfung (F-04), insbesondere Heatmap (14 Monate), Umami ohne Einwilligung, basemap.at-Kacheln |
| P8 | Umami | Env gesetzt? danach neu bauen (Datenschutztext entsteht zur Build-Zeit) |
| P9 | Build-Status | Ergebnis des Koordinator-Builds in 06 eintragen |
| P10 | Sichtprüfung Desktop 1440 / Mobil 390 | neue Seiten: Fördercall, Netzanmeldung, Kundenbühne (Porträt, `/siegel`, Social-Kit, ESG), Heatmap-Ansicht, Konfetti |
| P13 | Commit der Wellen 2 und 3 | danach Changelog-Abschnitt „Unveröffentlicht“ in eine datierte Version überführen, Status „unveröff.“ in 01/10 anpassen |
| P14 | Rechtliche Freigaben neu | Hinweis-Löschfrist 5 Jahre (HSchG), Löschfrist Anfragen 24 Monate, Kundenbühne (Porträts ohne Kundenfreigabe, Zitat/Logo nur mit Freigabe), Siegel-Aussagen (UWG) |
| P15 | Datenschutz-Doku | `docs/datenschutz/*` noch DE-Stand (D1); VVT für Heatmap, Anfragen `oekovolt_app`, Kundenbühne fehlen |
| P16 | Tests | Rechner-Tests (Q-01) und Kundenbühne-Rechenweg (`src/lib/kundenbuehne.js`, als Node-testbar beschrieben, kein Testskript) |
| P17 | CO₂-Faktoren | Kundenbühne/Solarrechner/Gewerbe-PV/Pacht 258,2 g/kWh (Substitution), CO₂-Rechner 105,4 g/kWh (Strommix), E-Flotte 209 g/kWh – Unterschiede fachlich bestätigen (F-07) |
| P18 | `Import-Frappe/` vs. `Import-Backend-Frappe/` | welches Paket ist maßgeblich? `Import-Frappe/` (DE-Stand) ggf. als veraltet kennzeichnen |
| P19 | WKO-Siegel auf der Startseite | Quellendatei `public/Images/AT/QUELLEN-siegel.md` vorhanden (Welle 3); Berechtigung weiter vom Auftraggeber zu bestätigen (R-28, F-17) |
| P20 | Heatmap-Ansicht und Siegel-Einbau auf Fremdseiten | Funktionstest nach Backoffice-Installation (`?heatmap=<TOKEN>`, `/siegel/<slug>.svg`) |
| P21 | Kennzahlen zentral | `src/data/kennzahlen.js` vorhanden, aber Zahlen stehen zusätzlich fest im Text (`src/data/unternehmen.js` HEUTE, `src/lib/llms.js:41`, `src/app/page.js:424`) – bei Änderung (z. B. `CO2_ZEITRAUM`) mitziehen; CO₂-Zeitraum klären (F-19) |
| P22 | Fotos folgen | `public/Images/AT/unternehmen/oekovolt-lkw.jpg` (ggf. Traktor) und `public/Images/AT/team/<Pressekontakt>.jpg` – nach Ablage Sichtprüfung; Einwilligung und Durchwahl Pressekontakt (F-20) |
| P23 | Mediathek | erste Videos einpflegen (ffmpeg installieren), danach Sitemap/Index prüfen; Musikrechte je Video klären (F-21) |
| P24 | Hinweisgebersystem Go-live | Entscheidung `HINWEIS_INTERN=1` nach `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md` (Build-Zeit-Schalter) |
| P25 | `mannschaft.js` | Einträge mit `bestaetigt: false` vom Auftraggeber bestätigen lassen |
