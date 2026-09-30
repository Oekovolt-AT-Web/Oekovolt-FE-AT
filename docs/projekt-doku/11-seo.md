# 11 – SEO- und GEO-Plan (Kurzfassung und Umsetzungsstand)

Kapitel seit Version 0.4. Keine Norm-Gliederung (fachlicher Plan). Stand: Version 0.5, 30.09.2026 (nach der SEO-Umsetzungswelle
P1–P9 und der QA-Nacharbeit).

**Vollständiger Plan:** [anhang/seo-umsetzungsplan-2026-09-30.md](anhang/seo-umsetzungsplan-2026-09-30.md) (Maßnahmen M01–M30,
Pakete P1–P7, Entscheidungen E1–E12). **Offpage:** [`docs/seo/Offpage-Fahrplan.md`](../seo/Offpage-Fahrplan.md) mit Vorlagen unter
`docs/seo/vorlagen/`. Die Paket- und QA-Berichte der Welle lagen nur im Arbeitsverzeichnis der Sitzung; ihr Inhalt ist hier und in
01–10 zusammengefasst.

## 1. Kernaussage

Die technische Basis ist sauber; die bekannten Indexierungsbremsen sind im Arbeitsbaum behoben. Realistisch sind Top-10-Plätze und
KI-Zitate in Nischen mit eigenen Daten (Schneelast, Netzanmeldung, OeMAG, Parkregler/TOR, Pacht/Widmung). Rankings und Zitate sind
**nicht garantiert**. **Wirksam wird die Welle erst nach dem Deploy**: Am 30.09.2026 liefert die Live-Seite `/schneelast`, `/presse`
und die IndexNow-Schlüsseldatei noch mit 404, die Live-Sitemap hat 106 URLs (R-53).

## 2. Status der Maßnahmen M01–M30

Legende: **erledigt** = im Arbeitsbaum umgesetzt (noch nicht committet/deployt) · **teilweise** · **offen** · **extern** = außerhalb
des Repos, vorbereitet im Offpage-Fahrplan. Nachweise aus den Paketberichten (Dev-Server) und Stichproben im Code.

| ID | Maßnahme (Kurzform) | Paket | Status | Beleg / Rest |
|---|---|---|---|---|
| M01 | `/schneelast` erreichbar, Title/Description von `/standort-check` getrennt | P1/P6 | erledigt | Redirect entfernt; eigene Titles |
| M02 | `htmlLimitedBots` für KI-Crawler | P1 | erledigt | `next.config.mjs`; Nachweis im Produktions-Build offen (Q-15) |
| M03 | Breadcrumb-Schema ohne Einträge ohne `href` | P1 | erledigt | `src/components/ui/Breadcrumbs.js`; Rich-Results-Test nach Deploy; doppelte BreadcrumbList auf 49 Seiten (kein Fehler) |
| M04 | seitenweise `robots` entfernen | P1–P6 | erledigt | `src/lib/seo/robots.js` für bedingtes noindex |
| M05 | 301 alter WordPress-URLs | P1 | erledigt | 4 URLs + `/ratgeber/reststromvermarktung` (E7) |
| M06 | hreflang in `seitenMeta` | P1 | erledigt | `src/components/Technik/seite.js` |
| M07 | robots.txt nach E1 | P1 | erledigt | vier Gruppen; Amazonbot gesperrt (F-34); weitere Trainings-Crawler optional (N8) |
| M08 | Sitemap vollständig, echte Daten | P2 | erledigt | laut Koordinator 305 URLs; `GEAENDERT` gepflegt |
| M09 | `llms.txt` vollständig | P2 | erledigt | Blöcke „Werkzeuge & Daten“, „Förderung & Netz“, „Referenzen“, „Hersteller“; Stand im Kopf |
| M10 | IndexNow nur Änderungen | P2 | erledigt | erster echter Lauf nach Deploy; Presse-Meldung nur mit `INDEXNOW_AKTIV=1` |
| M11 | Bild-Sitemap | P2 | erledigt | 188 Bilder auf 58 Projektseiten |
| M12 | Dataset-Schema korrigieren | P6 | erledigt | Lizenz CC BY 4.0 für eigene Auswertungen zu bestätigen (F-35) |
| M13 | Titel Startseite/`/gewerbe` trennen, Suchbegriff in H1 | P3 | erledigt | 20 Hauptseiten; Klickrate 4 Wochen beobachten |
| M14 | Kannibalisierung, Ratgeber-Dubletten | P3 | teilweise | 5 Themenpaare getrennt, 10 Ratgeber neu ausgerichtet; 301 für Dubletten erst nach Daten (E7); `/ratgeber/photovoltaik-hotel` vs. `/hotellerie-tourismus` offen |
| M15 | Projektseiten mit festen Daten, Ort/Branche | P3 | teilweise | feste Daten erledigt; nur 24 von 58 Titeln mit Branche/Ort |
| M16 | Waisenseiten verlinken | P3 | erledigt | Mieterstrom, Smarthome, Ablauf-Ratgeber (E8 = verlinken) |
| M17 | `partner.js` einzige Quelle mit `belegt` | P4 | erledigt | 6 belegte Marken (E3) |
| M18 | `/produkte/wechselrichter` + Detailseiten | P4 | erledigt | Fronius, Huawei, Solis; ≥ 94 % eigener Text |
| M19 | Brand-Schema, Huawei-Speicherseite, interne Links | P4 | erledigt | kein `Product` ohne `offers` |
| M20 | Vergleichstabellen, Checkliste, Service-Abschnitt | P4 | teilweise | 18 statt 20 Marken; Service-Abschnitt aus (E4); Rechtsprüfung E12 (R-55) |
| M21 | FAQ „Antwort zuerst“ | P5 | erledigt | 18 von 51 FAQ |
| M22 | Fachprüfer (`reviewedBy`) | P5 | teilweise | vorbereitet, Ausgabe erst mit Einwilligung (E5, F-25) |
| M23 | Definitionssatz, `DefinedTerm` | P5 | erledigt | Parkregler/EZA-Regler |
| M24 | Entität (`memberOf`, Handles, `sameAs`, Verifizierung, AT/DE/CH) | P5 | erledigt | PV&B Austria belegt; Profile-Links erst nach Anlage (M29) |
| M25 | CO₂-Zeitraum und Kennzahlen | P5 | teilweise | CO₂ ausgeblendet bis Zeitraum geklärt; 510 MW vs. kWp offen (E6) |
| M26 | Bundesland-Vorlagen ohne Doorway | P6 | erledigt | Schneelast-Länder zusammengeführt; Widmung 0,189; Hubs 0,309 (knapp); Wien E9 offen |
| M27 | OeMAG monatlich mit Monat im Titel | P6 | erledigt (laufend) | Titel automatisch aus `oemag.js`; Zuständigkeit für monatliche Pflege offen (F-27) |
| M28 | `rel="sponsored"`, alte Bewertungskomponente löschen, `/mediathek` noindex | P5/P2 | erledigt | derzeit keine Sponsoring-Links; `/mediathek` noindex bis Videos |
| M29 | Search Console, Bing, Unternehmensprofile, Verzeichnisse, Wikidata | P7 | extern | Fahrplan und Vorlagen fertig; Umsetzung beim Auftraggeber; DNS-Zugang offen |
| M30 | Datenstorys, Kundenfreigaben, Hersteller-Einträge | P7 | extern | Story 1 (Schneelast) bis 06.10. nur nach Deploy (Go/No-Go 05.10.) |

Zusätzlich (außerhalb M01–M30): **P8** Datenschutzerklärung an Code angeglichen, HSchG-Fristen; **P9** Rechenkorrekturen,
Finanzierungsseite neutral; **QA-Nacharbeit** H1–H3, M1–M7, N1–N8 laut Koordinator erledigt.

## 3. Entscheidungen des Auftraggebers

| Nr. | Frage | Stand 30.09.2026 |
|---|---|---|
| E1 | KI-Crawler | **entschieden:** Training gesperrt, Such-/Abruf-Crawler erlaubt – umgesetzt |
| E2 | Englische Version | offen (spätere Welle empfohlen) |
| E3 | Herstellermarken | **entschieden:** Fronius, Huawei, BYD, Sigenergy, Solis, meteocontrol belegt – umgesetzt |
| E4 | Service für Fremdmarken | offen (Abschnitt vorbereitet, aus; Wartungs-FAQ prüfen, R-61) |
| E5 | Fachprüfer | teilweise: Personen benannt, Einwilligungen ausstehend |
| E6 | Firmendaten | teilweise: 510 MW; CO₂-Zeitraum, Einheit MW/MWp, Öffnungszeiten, E-Mail, Lochau, X-Handle, Büro Salzburg offen |
| E7 | Ratgeber-Dubletten | teilweise: nur `reststromvermarktung` per 301; übrige nach Daten |
| E8 | Waisenseiten | umgesetzt als „verlinken“ |
| E9 | Bundesland-Struktur | teilweise: Hauptseite je Land festgelegt, Schneelast zusammengeführt; Wien offen |
| E10 | Offpage-Verantwortung, Wikidata, APA-OTS | offen |
| E11 | SISTRIX | offen (Connector nicht autorisiert) |
| E12 | Rechtsprüfung Vergleichstabellen, Seilbahn, Bürgerbeteiligung, E-Mail-Versand an Redaktionen | offen |

## 4. Pflege

- Neue Seiten: Sitemap (mit Datum), `llms.txt`, `src/data/verlinkung.js`, ggf. Navigation/Rechner-Hub; Indexierbarkeit über
  `indexierbar()`; bei Weiterleitungen `NICHT_INDEXIERT` und `WEITERGELEITETE_HERSTELLER` nachziehen (R-58).
- Sichtbare Inhaltsänderung: Eintrag in `GEAENDERT` (`src/app/sitemap.js`), danach `node scripts/indexnow.mjs`.
- Bundesland-Hubs: vor neuen gemeinsamen Textbausteinen Überschneidung messen (R-62).
- OeMAG monatlich (07).
