# 11 – SEO- und GEO-Plan (Kurzfassung)

Neues Kapitel ab Version 0.4. Keine Norm-Gliederung (fachlicher Plan). Stand: Version 0.4, 30.09.2026.

**Vollständiger Plan:** [anhang/seo-umsetzungsplan-2026-09-30.md](anhang/seo-umsetzungsplan-2026-09-30.md) –
unveränderte Kopie des verbindlichen SEO-Umsetzungsplans vom 30.09.2026 (Maßnahmen M01–M30, Pakete P1–P7,
Entscheidungen E1–E12). Die Rohdaten der Fachberichte (`meta-vorschlaege.tsv`, `keyword-map.tsv`) lagen nur im
Arbeitsverzeichnis der Sitzung und sind **nicht im Repository** (offen: bei Bedarf unter `docs/seo/` ablegen).

## 1. Kernaussage

Die technische Basis ist sauber. Messbare Fehler bremsen die Indexierung neuer Seiten (u. a. früher die
Weiterleitung `/schneelast`, Metadaten zu spät im HTML für KI-Crawler, fehlerhafte Breadcrumbs, fehlende Sitemap-
und `llms.txt`-Einträge, doppelte Titel). Realistisch sind Top-10-Plätze und KI-Zitate in Nischen mit eigenen Daten
(Schneelast-Richtwert, Netzanmeldung, OeMAG-Monitor, Parkregler/TOR, Pacht/Widmung). Rankings oder Zitate sind
**nicht garantiert**; Suchvolumina sind bis zur SISTRIX-Freigabe (E11) geschätzt.

## 2. Pakete und Stand (30.09.2026, nach Welle 4)

Stand je Maßnahme aus dem Arbeitsbaum abgeleitet; „offen“ heißt: im Code nicht umgesetzt oder nicht belegt.

| Paket | Maßnahmen | Inhalt | Stand |
|---|---|---|---|
| P1 Technik & Crawling | M01–M07 | Redirect `/schneelast` weg, `htmlLimitedBots` für KI-Crawler, Breadcrumb-Schema, seitenweise `robots` entfernen, 301 alter WordPress-URLs, hreflang in `seitenMeta`, robots.txt nach E1 | M01 Redirect **entfernt** (`next.config.mjs`); M02, M03, M05, M06 **offen** (keine Änderung an `next.config.mjs`/`Breadcrumbs.js` dazu); M07 **offen** – E1 entschieden (Training sperren), `public/robots.txt` noch unverändert (siehe 3.) |
| P2 Sitemap, llms.txt, IndexNow | M08–M11 | alle neuen Seiten mit echtem Datum in der Sitemap, `llms.txt`-Blöcke, IndexNow nur für Änderungen, Bild-Sitemap | M08 **weitgehend** (alle Welle-4-Routen in `src/app/sitemap.js`; laut Koordinator 311 URLs); M09 **offen** (keine Welle-4-Seite in `src/lib/llms.js`); M10, M11 **offen** |
| P3 Onpage & Kannibalisierung | M13–M16 | Titel Startseite/`/gewerbe` trennen, H1 mit Suchbegriff, Dubletten, Projektseiten-Daten, Waisenseiten | **offen** (Querverweise der neuen Seiten eingetragen, `src/data/verlinkung.js`) |
| P4 Hersteller & Wechselrichter | M17–M20 | `partner.js` mit `belegt`, `/produkte/wechselrichter/**`, Brand-Schema, Vergleichstabellen | **offen**; Entscheidung E3 getroffen (siehe 3.) |
| P5 Entität, E-E-A-T | M21–M25, M28 | FAQ „Antwort zuerst“, Fachprüfer `reviewedBy`, `DefinedTerm`, `memberOf`, Kennzahlen/CO₂-Zeitraum, Sponsoring `rel="sponsored"` | M25 **teilweise** (Leistung 510 MW in `src/data/kennzahlen.js`; CO₂-Zeitraum weiter offen); M22 **offen** (Einwilligungen der Fachprüfer ausstehend); übrige offen |
| P6 Eigene Daten & Bundesland-Vorlagen | M01-Rest, M12, M26, M27 | Dataset-Schema, Doorway-Risiko der Bundesland-Varianten, OeMAG-Monatstitel | Seiten gebaut (`/schneelast/*`, `/pv-prognose`, `/einspeisung-gewerbe`, `/freiflaechen-photovoltaik/widmung/*`, `/photovoltaik-bundesland/*`); M12, M26 (E9), M27 **offen** |
| P7 Außerhalb der Website | M29, M30 | Search Console/Bing per DNS, Unternehmensprofile, Verzeichnisse, Datenstorys, Hersteller-Einträge | **offen** (keine Repo-Dateien) |

## 3. Entscheidungen des Auftraggebers (Stand 30.09.2026)

| Nr. | Frage | Entscheidung / Stand | Folge im Repo |
|---|---|---|---|
| E1 | KI-Crawler / Training | **Training sperren**, Such- und Antwort-Crawler erlaubt (Variante B) | `public/robots.txt` sperrt bereits GPTBot, ClaudeBot, CCBot, Google-Extended, Meta-ExternalAgent u. a.; laut Plan müssen zusätzlich **Applebot-Extended, anthropic-ai und Claude-Web** gesperrt werden – derzeit stehen sie in der erlaubten Gruppe (`public/robots.txt:20,22,27`) → offen (R-44) |
| E3 | Herstellermarken | belegt: **Fronius, Huawei, BYD, Sigenergy, Solis, meteocontrol** (eigene Seiten); übrige Top-20-Marktführer nur neutrale Vergleichs-/Ratgeberseiten | P4 umsetzen; MSchG/UWG-Prüfung (E12) |
| E5 | Fachprüfer | benannt (drei Personen); Einwilligung und Rolle ausstehend | `reviewedBy` erst nach schriftlicher Einwilligung (R-45) |
| E6 | Firmendaten | Gesamtleistung **510 MW** (vorher 340 MW); CO₂-Zeitraum, E-Mail, Öffnungszeiten, Lochau, X-Handle, Büro Salzburg offen | `src/data/kennzahlen.js` angepasst |
| E2, E4, E7–E12 | Englische Version, Fremdmarken-Service, Dubletten, Waisenseiten, Bundesland-Struktur, Offpage, SISTRIX, Rechtsprüfung | **offen** | – |

Hinweis: Die Kennzahl steht im Code als 510.000 **kWp** (`src/data/kennzahlen.js`), der Auftraggeber nennt 510 **MW**.
Ob MWp (DC) gemeint ist, sollte einheitlich geklärt werden (R-46).

## 4. Pflege

- Neue Seiten immer in `src/app/sitemap.js` (mit eigenem Datum), `src/lib/llms.js`, `src/data/verlinkung.js` und ggf.
  `src/data/navigation.js`/`src/components/Rechner/tools.js` eintragen.
- Nach jedem Deploy `node scripts/indexnow.mjs` (bis M10 umgesetzt ist: alle Sitemap-URLs).
- OeMAG-Monatswert monatlich (M27, siehe 07).
- Stand dieses Kapitels bei jeder Welle gegen den Plan abgleichen (Tabelle 2).
