# Projektdokumentation oekovolt.com (Österreich) – Übersicht

| Dokumentenlenkung | |
|---|---|
| Dokument | Projektdokumentation Website oekovolt.com + Frappe-Backoffice |
| Version | 0.4 (Nachführung Welle 4) |
| Datum | 30.09.2026 |
| Stand des Codes | Branch `at-launch`, Commit `add3074` (30.09.2026, enthält Wellen 2 und 3 samt Doku 0.3) zzgl. unveröffentlichter Arbeitsbaum-Änderungen der Welle 4 (siehe [08](08-konfiguration-und-aenderungen.md)) |
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
| [11-seo.md](11-seo.md) | – (fachlicher Plan, keine Norm) | Kurzfassung SEO-/GEO-Plan, Stand der Maßnahmen M01–M30, Entscheidungen E1–E12; Volltext in `anhang/` |

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
| `docs/datenschutz/00-Uebersicht-VVT.md` + `VVT-*.md` (14 Dateien) | Verzeichnis von Verarbeitungstätigkeiten für AT (Entwurf, rechtlich prüfen), Abweichungstabelle Datenschutzerklärung ↔ Code (A1–A8) | 05 |
| `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md` | Umstellung IntegrityLine → eigenes Hinweisgebersystem | 05, 07 |
| `anhang/seo-umsetzungsplan-2026-09-30.md` | vollständiger SEO-Umsetzungsplan (Kopie) | 11 |

## 5. Pflegeprozess (Nachführen)

- **Wer:** Claude (KI-Assistent) im Auftrag der Geschäftsführung; Prüfung/Freigabe durch eine benannte
  Person (offen).
- **Wann:** nach **jeder Arbeitswelle, vor dem Commit** der Welle.
- **Wie:**
  1. `git status`, `git diff --stat` und `git log` seit dem letzten Stand auswerten.
  2. Betroffene Kapitel nachführen (Anforderungen, Schnittstellen, Env-Variablen, Tests).
  3. Tests erneut ausführen (`node scripts/alle-tests.mjs`, Python-Tests unter `Import-Backend-Frappe/`) und Ergebnisse in [06](06-test-und-qualitaet.md) eintragen.
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
| 0.4 | 30.09.2026 | Nachführung Welle 4: PV-Prognose, Schneelast-Karte, Einspeisung Gewerbe, EG für Betriebe/Gemeinden, Vergabe für Gemeinden, Flächen-Check/Widmung, Finanzierungsvergleich, Teilen & PDF, Lastgang-Analyse, A/B-Infrastruktur, Performance/A11y, Test-Sammellauf (21 Dateien), Datenschutz-Doku AT, Bundesland-Hubs; Auftraggeber-Entscheidungen (KI-Training sperren, Marken, 510 MW, Fachprüfer); neues Kapitel 11 (SEO) | Claude (KI-Assistent) im Auftrag der Geschäftsführung | offen |

## 7. Beim nächsten Nachführen prüfen

### 7.1 Stand der Liste aus Version 0.3

| # | Bereich | Stand nach Welle 4 |
|---|---|---|
| P9 | Build-Status | macht der Koordinator (parallel) – Ergebnis in 06 eintragen |
| P10 | Sichtprüfung 1440/390 | offen, jetzt zusätzlich alle Welle-4-Seiten (siehe 06, Abschnitt 4) |
| P13 | Commit | Wellen 2 und 3 committet (`add3074`); Welle 4 offen |
| P14 | Rechtliche Freigaben | weiter offen; ergänzt um Welle-4-Punkte (09, F-24 bis F-33) |
| P15 | Datenschutz-Doku | **erledigt in Welle 4** (`docs/datenschutz/00-Uebersicht-VVT.md` + VVT je Verarbeitung); Restbezüge auf DE-Recht in 4 Dateien, teils als Abgrenzung – prüfen |
| P16 | Tests | **weitgehend erledigt**: Sammellauf `scripts/alle-tests.mjs` mit 21 Dateien inkl. Rechner- und Kundenbühne-Tests; offen: Befund tests-04, Folgetest zu tests-01 |
| P17 | CO₂-Faktoren | offen (F-07) |
| P19 | WKO-Siegel | Berechtigung weiter zu bestätigen |
| P21 | Kennzahlen zentral | Leistung auf 510 MW (Code: 510.000 kWp) umgestellt; CO₂-Zeitraum offen; Textduplikate prüfen |
| P22–P25 | Fotos, Mediathek, Hinweisgeber-Go-live, `mannschaft.js` | unverändert offen |
| P7, P8, P18, P20 | Datenschutzerklärung, Umami, `Import-Frappe/`, Heatmap-/Siegel-Funktionstest | unverändert offen |

### 7.2 Neu für die nächste Nachführung

| # | Bereich | Prüfen |
|---|---|---|
| P26 | Commit der Welle 4 | danach Abschnitt „Unveröffentlicht“ in 08 datieren |
| P27 | SEO-Pakete P1–P7 | Stand in 11 gegen Code abgleichen (insbesondere M02 `htmlLimitedBots`, M07 robots.txt nach E1, M09 `llms.txt` ohne Welle-4-Seiten) |
| P28 | Snippets der Welle-4-Agenten | nicht übernommene Snippets: `npm test` in `package.json`, `expFuerEreignis` in `src/lib/statistik.js`, A/B-Hinweis in der Datenschutzerklärung, HSchG-Fristen (`hinweis.py`, `hinweisgeber.js`), Kundenbühne-Abschnitt Datenschutzerklärung, Links von `/photovoltaik` auf Bundesland-Hubs |
| P29 | Inhaltliche Korrekturen außerhalb der Welle-4-Dateien | OeMAG-Werte im Ratgeber (Sep 2024, Q4/2026, Aug–Dez 2025), KIG 500 vs. 620 Mio. auf `/kommunen`, FAQ Leasing auf `/service/finanzierung`, Link `/ratgeber/investitionsfreibetrag-photovoltaik` |
| P30 | RIS-Abgleich | alle Rechtsquellen, die wegen RIS-Ausfall (HTTP 503) über Sekundärquellen belegt wurden (R-35) |
| P31 | Monatliche Pflege OeMAG | Anfang Oktober Wert September 2026 eintragen (`src/data/oemag.js`), sonst Warnhinweis ab 05.11.2026 |
| P32 | Kalender-gebundene Inhalte | nach 22.10.2026 EAG-Karte auf `/kommunen/vergabe-foerderung` umstellen; Klimafonds-Modellregionen-Ausschreibung; Abschläge SNE-V ab 01.01.2027 in `src/lib/egBetriebe.js` |
