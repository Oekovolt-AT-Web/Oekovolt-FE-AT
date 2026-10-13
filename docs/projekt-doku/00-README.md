# Projektdokumentation oekovolt.com (Österreich) – Übersicht

| Dokumentenlenkung | |
|---|---|
| Dokument | Projektdokumentation Website oekovolt.com + Frappe-Backoffice |
| Version | 0.6 (Nachführung Welle A – Neubau nach Verlust des Stands vom 07.10.2026) |
| Datum | 11./12.10.2026 |
| Stand des Codes | Branch `main`, Commit `71829e1` (03.10.2026) zzgl. **nicht committeter** Arbeitsbaum-Änderungen der Welle A (Neubau 11./12.10.2026, siehe [08](08-konfiguration-und-aenderungen.md)); der Arbeitsbaum enthält parallel Teile der Wellen B und C (eigene Notizen `anhang/wellen/B*.md`, `C*.md`, nicht Gegenstand dieser Version) |
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
| `docs/frappe-*/README.md` | Installations- und Fachdoku je Frappe-Modul; neu in Welle A: `docs/frappe-lead-routing/README.md` (Routing, Dubletten, SLA, Eskalation, Alarm – A06), `docs/frappe-referenzfreigabe/README.md` (Referenz-Freigabe per Einmal-Link – A07) | 03, 07 |
| `anhang/wellen/A01.md` … `A12.md`, `A-INT.md` | Paket-Notizen der Welle A (Änderungen je Datei, Übergaben, Prüfungen, QA-Runden) und Integration der Übergaben; Grundlage der Nachführung 0.6 | 01–10 |
| `.claude/uebergabe/gesamtplan.json` | Gesamtplan der Website-Offensive (Wellen A–E, Pakete mit Auftrag, Dateien, Abnahme) | 01, 08 |
| `docs/regionen/` | DE-Recherche (laut `docs/AT-UEBERGABE.md:78` Aufräumkandidat) | – |
| `Import-Frappe/ANLEITUNG.md` | Installationsablauf Frappe-Pakete (DE-Stand) | 07 |
| `Import-Backend-Frappe/README.md`, `apps/*/README.md` | AT-Backoffice: Installation, Methoden, Kundenbühne, Heatmap, Löschfristen, Rollen | 03, 05, 07 |
| `docs/datenschutz/00-Uebersicht-VVT.md` + `VVT-*.md` (14 Dateien) | Verzeichnis von Verarbeitungstätigkeiten für AT (Entwurf, rechtlich prüfen), Abweichungstabelle Datenschutzerklärung ↔ Code (A1–A8) | 05 |
| `docs/frappe-hinweisgebersystem/GO-LIVE-AT.md` | Umstellung IntegrityLine → eigenes Hinweisgebersystem | 05, 07 |
| `anhang/seo-umsetzungsplan-2026-09-30.md` | vollständiger SEO-Umsetzungsplan (Kopie) | 11 |
| `docs/seo/Offpage-Fahrplan.md` + `docs/seo/vorlagen/*` (6 Vorlagen) | Maßnahmen außerhalb der Website (M29, M30): Search Console/Bing, Unternehmensprofile, Verzeichnisse, Wikidata, Datenstorys, Hersteller, Kundenfreigaben, Bewertungen | 11 |

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
| 0.5 | 30.09.2026 | Nachführung SEO-Welle P1–P9 und QA-Nacharbeit: robots.txt nach E1, `htmlLimitedBots`, Breadcrumbs, 301 alter URLs, robots zentral, Sitemap mit echten Daten, `llms.txt`, IndexNow nur Änderungen, Onpage/Kannibalisierung, Wechselrichter-Seiten, Entität/Fachprüfer/FAQ/DefinedTerm, Datasets, Bundesland ohne Doorway, OeMAG korrigiert, Presse-Grafiken, Offpage-Fahrplan, Datenschutzerklärung an Code angeglichen, HSchG-Fristen ab Eingang, Rechenkorrekturen; Kapitel 11 mit Status M01–M30 | Claude (KI-Assistent) im Auftrag der Geschäftsführung | offen |
| 0.6 | 11./12.10.2026 | Nachführung **Welle A** („Verkaufsstärkste Hebel sofort – rechtssicher“, Pakete A01–A12 + Integration): Next 15.5.27 und Sicherheitskonfiguration, Werbeaussagen-Register mit Schaltern (Salzburg AG neutral, TOP 3/Marktführer/WKO-Siegel/eigener Parkregler/Kundenlogo AUS), Kennzahlen mit Stand, Verkaufs-Bausteine, Zielgruppenseiten, Referenz-Freigabe und Projekt-Plakette, Commitment-Leiter der Formulare, Lead-Gate 2.0 mit Double-Opt-in und Entscheider-Mappe, Rechner-Stresstest/TOR nach AC, Speed-to-Lead im Backoffice (Kernschema, Scoring, Routing, SLA, Alarm), mobile Führung/Cookie-Banner/Barrierefreiheit; Entscheidungen des Inhabers vom 03./05./11.10.2026 (09 Abschnitt 3); Risiken R-63–R-81, Freigaben F-41–F-52; Tests erneut ausgeführt. **Der erste Stand der Welle A (03.–07.10.2026) ging am 07.10. durch Zurücksetzen des Arbeitsbaums verloren und wurde am 11./12.10. neu gebaut**; eine Doku-Version dieses ersten Stands gab es nicht. | Claude (KI-Assistent) im Auftrag der Geschäftsführung | offen |

**Hinweis zu Version 0.6 (Verlust und Neubau):** Welle A wurde vom 03. bis 07.10.2026 bereits einmal gebaut (rund 352
Dateien). Am 07.10.2026 um 16:57 wurde der Arbeitsbaum auf den Commit `71829e1` vom 03.10.2026 zurückgesetzt; der Stand war
nicht committet und ist verloren. Der Inhaber hat am 11.10.2026 den kompletten Neubau beauftragt („ja“). Diese Version
beschreibt ausschließlich den Neubau. Erkenntnisse aus dem ersten Durchlauf (QA-Schwerpunkte A08, A10, A11, A12;
Kundennamen standardmäßig ausblenden; `next dev` ohne Turbopack) sind eingeflossen. Sicherungen des Neubaus:
`refs/sicherung/2026-10-11-2355`, `refs/sicherung/2026-10-12-welle-bc` (R-75).

## 7. Beim nächsten Nachführen prüfen

### 7.1 Stand der Liste aus Version 0.4

| # | Bereich | Stand nach der SEO-Welle |
|---|---|---|
| P9 | Build-Status | macht der Koordinator – Ergebnis in 06 eintragen |
| P10 | Sichtprüfung 1440/390 | teilweise durch Paket-Screenshots (P3–P6, QA) belegt; vollständige Prüfung offen |
| P26 | Commit | Welle 4 committet (`ffd5c00`); SEO-Welle offen |
| P27 | SEO-Pakete | **P1–P6, P8, P9 umgesetzt**, P7 als Fahrplan vorbereitet (Stand je Maßnahme in 11) |
| P28 | Snippets Welle 4 | **erledigt** (`npm test`, HSchG-Fristen, Datenschutzerklärung, Links auf Bundesland-Hubs); `expFuerEreignis` in `statistik.js` nicht geprüft |
| P29 | Inhaltliche Korrekturen | **erledigt**: OeMAG-Werte, KIG 620 Mio. €, Leasing-FAQ neutral; Link Investitionsfreibetrag nicht erneut geprüft |
| P30 | RIS-Abgleich | teilweise: HSchG über RIS-OGD geprüft, KIG über JUSLINE; übrige weiter offen |
| P31 | OeMAG monatlich | offen (Anfang Oktober; Zuständigkeit ungeklärt) |
| P32 | Kalender-gebundene Inhalte | offen |
| P7, P8, P14, P17–P25 | Datenschutz-Freigaben, Umami, Rechtliche Freigaben, CO₂-Faktoren, `Import-Frappe/`, WKO-Siegel, Heatmap-/Siegel-Test, Kennzahlen, Fotos, Mediathek, Hinweisgeber-Go-live, `mannschaft.js` | unverändert offen (CO₂-Kennzahl bleibt laut Auftraggeber ausgeblendet) |

### 7.2 Neu für die nächste Nachführung

| # | Bereich | Prüfen |
|---|---|---|
| P33 | Commit der SEO-Welle | danach Abschnitt „Unveröffentlicht“ in 08 datieren |
| P34 | Deploy und Nachprüfungen | nach dem Deploy: `curl -A GPTBot/PerplexityBot` (Metadaten vor `</head>` im Produktions-Build), Rich-Results-Test für Breadcrumbs, `node scripts/indexnow.mjs` (erster Lauf meldet alle ca. 310 URLs), Search Console/Bing; `/schneelast` und EAG-Fördercall vor dem 08.10. live |
| P35 | Hand gepflegte Listen | `NICHT_INDEXIERT` (`src/lib/llms.js`) und `WEITERGELEITETE_HERSTELLER` (`src/app/sitemap.js`) gegen `next.config.mjs` abgleichen; `GEAENDERT` in `src/app/sitemap.js` bei sichtbaren Inhaltsänderungen pflegen |
| P36 | Offene Entscheidungen der SEO-Welle | E4 (Service Fremdmarken), E5 (Fachprüfer-Einwilligungen), E6 (CO₂-Zeitraum, MW/MWp, Öffnungszeiten, Lochau), E9 (Wien), E10/E11, E12 (Vergleichstabellen, Bürgerbeteiligung), Amazonbot-Sperre, CC-BY-Lizenz für eigene Auswertungen, Schweiz-Aussage auf „Über uns“ |
| P37 | Dev-Server | Speicherverbrauch von `next dev` (Absturz bei ca. 15,8 GB RAM) beobachten (R-52) |
| P38 | `docs/AT-UEBERGABE.md` | beschreibt noch den alten IndexNow-Aufruf – vom Eigentümer der Datei nachziehen lassen |
| P39 | HSchG-Protokoll | inhaltsfreies Zugriffs-/Änderungsprotokoll (§ 8 Abs. 12, § 9 Abs. 6) vor `HINWEIS_INTERN=1` |

### 7.3 Stand nach Welle A und neue Punkte (Version 0.6)

| # | Bereich | Stand / Prüfen |
|---|---|---|
| P26/P33 | Commit | SEO-Welle committet (`33ae71a`, Merge `1238d5e`); danach `7148bd5`, `71829e1` („Changes“, 01./03.10.). Welle A **nicht committet** (F-49); vorher Build-Ordner aus dem Arbeitsbaum entfernen (R-76) |
| P34 | Deploy | weiterhin offen; Push/Deploy für Welle A nicht freigegeben; Fördercall-Termin 08.10. verstrichen |
| P37 | Dev-Server | verschärft (R-74): Wächter-Server 3001 hing ab 11./12.10.; Prüfungen auf Ersatz-Ports |
| P40 | Eigen-Technik-Formulierungen | „eigene(r) Leittechnik“/„eigener Technik“ an `PARKREGLER_RECHTE_GEKLAERT` koppeln, Testmuster ergänzen (R-63) |
| P41 | Restbefunde QA Welle A | CLS mobil (R-69), Startseiten-CTA mobil (R-70), Safari-Schrift (R-71), schwebende Leiste (R-72), Karte „Nach Objektart“ (R-73), Konfigurator-`vorbelegt` (R-67), Rahmen der Schicht-Umschaltung im Hero-Rechner (A02 → A10), Trefferfläche Range-Inputs ≥ 44 px |
| P42 | Offene Integrationen (A-INT) | `COOKIE_KOPF_SKRIPT` in den `<head>` (eigenes Modul nötig), `bericht().mappe` mit Rohzahlen je Rechner und Stresstest im Druckblatt, `?ref=` für `/lastgang-analyse`, `unpkg`-Prefetch in `layout.js` streichen, `tvSchauraum.js` QR auf `/referenzen/projekte`, toter Code `src/components/Referenzkarte/map.js` |
| P43 | Backoffice-Rollout | F-46, F-47; Python-Tests nach `bench migrate` im echten Backoffice wiederholen |
| P44 | Rechts- und Inhaberfreigaben Welle A | F-41–F-45, F-48, F-50–F-52 |
| P45 | Jahreswechsel 2026/27 | IFB 22 % → 15 %, ElWG-Texte, `security.txt` `Expires` (2027-10-11) – R-77, R-80 |
| P46 | Wellen B und C | Arbeitsbaum enthält deren Stand (Notizen `anhang/wellen/B*.md`, `C*.md`); in der nächsten Version nachführen |
