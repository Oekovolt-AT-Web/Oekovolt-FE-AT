# Verbindlicher SEO-Umsetzungsplan für oekovolt.com (Stand 30.09.2026)

## 1) Kernaussage

oekovolt.com hat eine saubere technische Basis. Einige messbare Fehler verhindern aber, dass neue Seiten im Index landen. Dazu gehören die tote Seite `/schneelast`, Metadaten, die für KI-Crawler zu spät im HTML kommen, fehlerhafte Breadcrumbs, fehlende Sitemap- und llms.txt-Einträge sowie doppelte Titel. Die Welle behebt zuerst diese Fehler.

Realistisch erreichbar sind Top-10-Plätze und KI-Zitate in Nischen, in denen Ökovolt eigene Daten oder echtes Fachwissen hat: Schneelast-Richtwert, Netzanmeldung, OeMAG-Einspeise-Monitor, Parkregler/TOR, Fronius- und Wechselrichter-Gewerbe in Oberösterreich, Pacht-Check und Widmung. Bei Kopfbegriffen wie „Photovoltaik Gewerbe Anbieter“ oder „PV Firma [Stadt]“ ranken Verzeichnisse, Versorger und Behörden. Dort helfen vor allem Maßnahmen außerhalb der Website: Firmenprofile, einheitliche Firmendaten, Einträge bei den Herstellern und Datenstorys.

Garantien für Rankings, Zitate oder einen „Unicorn-Status“ gibt es nicht. Suchvolumina sind bis zur SISTRIX-Freigabe nur geschätzt.

## 2) Priorisierte Maßnahmen

Rollen: T = Technik, C = Content/Keywords, H = Hersteller, K = KI/GEO, L = Lokal/Entität, A = Autorität/PR. Die Nummern bei „Entscheidung“ verweisen auf Abschnitt 4. Aufwand und Risiko: S/M/L bzw. G = gering, M = mittel.

| ID | Maßnahme | Rolle | Dateien | Wirkung | Aufw. | Risiko | Abhängigkeit/Entscheidung |
|---|---|---|---|---|---|---|---|
| M01 | Weiterleitung `/schneelast` entfernen, Title und Description von `/standort-check` trennen | T | `next.config.mjs:77`, `schneelast/page.js`, `standort-check/page.js` | hoch | S | G | – |
| M02 | `htmlLimitedBots` um GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, SeznamBot, Qwantbot, MojeekBot und Amazonbot erweitern | T | `next.config.mjs` | hoch (KI) | S | G | Nach dem Build mit `curl -A` prüfen |
| M03 | Breadcrumb-Schema: Einträge ohne `href` weglassen | T | `src/components/ui/Breadcrumbs.js` | mittel | S | G | – |
| M04 | Seitenweise `robots:{index,follow}` streichen, damit die Layout-Werte gelten (`max-image-preview`, `max-snippet`) | T | `ServiceAT/meta.js`, `Rechner/RechnerSeite.js`, 53 `page.js` | mittel | S–M | G | Jedes Paket bereinigt seine eigenen page.js |
| M05 | 301 für alte WordPress-URLs (`/unternehmen`, `/photovoltaik-leasing`, `/photovoltaik-contracting`, `/photovoltaik-loesungen`) | T | `next.config.mjs` | mittel | S | G | Ziele fachlich prüfen |
| M06 | hreflang in `seitenMeta` ergänzen | T | `Technik/seite.js:20` | gering | S | G | – |
| M07 | robots.txt konsistent machen: veraltete Tokens bereinigen, `Claude-User` ergänzen, Trainings-Crawler nach Entscheidung einstellen | T/K | `public/robots.txt` | mittel | S | M | **E1** |
| M08 | Neue Seiten in die Sitemap, jeweils mit eigenem echtem Datum | T/K | `src/app/sitemap.js` | hoch | S | G | – |
| M09 | llms.txt vollständig: Blöcke „Werkzeuge & Daten“, „Förderung & Netz“, „Referenzen“, „Hersteller“, Stand-Datum im Kopf, `/mediathek` angleichen | K | `src/lib/llms.js`, `llms*.txt/route.js` | hoch (KI) | S | G | Block „Hersteller“ erst nach M17 |
| M10 | IndexNow: nur Änderungen melden, Key-Datei vorher prüfen, Statuscodes auswerten, `src/lib/indexnow.js` nutzen, bei Presse-Veröffentlichung auslösen | T/K | `scripts/indexnow.mjs`, `src/lib/indexnow.js`, `src/lib/kanaele/veroeffentlichungen.js` | hoch (Bing, ChatGPT) | S–M | G | Nach dem Deploy |
| M11 | Bild-Sitemap für Referenzfotos | T | `src/app/sitemap.js` | gering–mittel | S | G | – |
| M12 | Dataset-Schema korrigieren (`description` bzw. `CreativeWork`, `license`, Methodik) | K | `standort-check`, `pv-prognose`, `schneelast/*`, `einspeisung-gewerbe` | mittel–hoch | S | G | – |
| M13 | Titel von Startseite und `/gewerbe` trennen; Suchbegriff in die H1 von rund 12 Hauptseiten, der Werbespruch wird Unterzeile | C | `page.js` der Hauptseiten (siehe P3) | hoch | S | G | 4 Wochen Klickrate in der Search Console beobachten |
| M14 | Titel und Seitenfokus gegen Kannibalisierung (Einspeisung, Mieterstrom/GEA, Bundesförderung/EAG, Pacht, Speicher); 11 Ratgeber-Dubletten bekommen zunächst einen eigenen Blickwinkel | C | siehe P3 | hoch | M | M | 301 für Dubletten nur nach Daten: **E7** |
| M15 | Projektseiten: festes `dateModified`, `datePublished`, H1/Title mit Ort und Branche, eigene Descriptions | C | `referenzen/projekte/[title]/page.js`, `Project/projektDaten.js` | mittel | M | G | – |
| M16 | Waisenseiten und schwache Ratgeber intern verlinken | C | `src/data/verlinkung.js`, `Reusable/Querverweise.js` | mittel | M | G | noindex-Variante: **E8** |
| M17 | `partner.js` wird einzige Datenquelle mit Feld `belegt`; Vergleich über Slug | H | `partner.js`, `HerstellerDetail.js` | Grundlage | S | G | **E3** (Nachweise) |
| M18 | `/produkte/wechselrichter` plus Detailseiten Fronius, Huawei, Solis | H | neu `produkte/wechselrichter/**`, `navigation.js` | hoch | M | M | M17, **E3** |
| M19 | Brand-Schema mit `url`/`sameAs`, `Service` statt Product-ItemList; Huawei-Speicherseite auf LUNA2000 schärfen; interne Links auf Detailseiten statt Anker | H | `HerstellerDetail.js`, `produkte/hersteller/page.js`, `stromspeicher/[slug]/page.js`, `KomponentenUebersicht.js`, `HerstellerFilter.js` | mittel | S | G | – |
| M20 | Vergleichstabellen mit Datenblattquellen; Checkliste „PV-Firma prüfen“; Abschnitt „Service für alle Hersteller“ | H | 3 Ratgeber-Dateien, `service/repowering`, `service/e-check` | hoch | M–L | M (UWG, MSchG) | Service-Abschnitt nur, wenn wahr: **E4** |
| M21 | FAQ nach dem Prinzip „Antwort zuerst“: erster Satz mit Zahl, Einheit und Stand | K | `src/data/faqs.js` | hoch | M | M | Zahlen müssen belegt sein |
| M22 | Namentlicher Fachprüfer (`reviewedBy`, Person, Autorenseite) | K/A | `ratgeber/[slug]/page.js`, `uber-uns/team/page.js`, `data/mannschaft.js` | mittel | M | M | **E5** |
| M23 | Definitionssatz oben auf den Fachseiten, `DefinedTerm` im Lexikon | K | `technik/parkregler/page.js`, `data/lexikon.js` | hoch (Nische) | M | G | – |
| M24 | Entität: `memberOf` PV Austria, unbelegten X-Handle entfernen, `sameAs`/`hasMap`/`FIRMA.profile`, Verifizierung aus Umgebungsvariable, Abgrenzung AT/DE/CH auf „Über uns“ | L/K | `layout.js`, `site.js`, `uber-uns/page.js` | mittel | S | G | **E6** (Kennzahlen, E-Mail) |
| M25 | CO₂-Zeitraum und Kennzahlen vereinheitlichen | A/K | `src/data/kennzahlen.js` | mittel | S | M (UWG) | **E6** |
| M26 | Bundesland-Vorlagen: eine Hauptseite je Land; Schneelast- und Widmungsseiten mit echten Unterschieden oder als Sprungmarken im Hub; „Förderung“ aus dem Titel-Muster | C/T | `lib/bundesland/auswertung.js`, Bundesland-Routen, `lib/flaeche/*`, `data/regionen/*` | hoch (Doorway-Risiko) | M–L | M | **E9** (Wien, Zusammenführen) |
| M27 | OeMAG-Wert monatlich mit Monat im Titel pflegen | K/C | `data/oemag.js`, `content/ratgeber/oemag-marktpreis.js` | hoch | S laufend | G | Eine Person ist zuständig |
| M28 | Sponsoring-Links mit `rel="sponsored"`, alte Bewertungskomponente löschen, `/mediathek` bis zur Befüllung auf noindex | A | `sponsoring/page.js`, `sponsoringDaten.js`, `googlereview.js`, `reviews.js`, `mediathek/page.js` | gering | S | G | – |
| M29 | Außerhalb der Website: Search Console und Bing Webmaster per DNS; Google-Unternehmensprofil, Bing Places und Apple Business Connect nur für Ostermiething; Verzeichnisse bereinigen (Herold, Cylex, Gemeinde, voltalux); eigenverbrauch.at per 301; Wikidata mit Offenlegung | L | keine (extern) | **sehr hoch** | S–M | G | **E6, E10** |
| M30 | Datenstorys 1–5 mit Outreach, Kunden-Freigaben für die Kundenbühne, Einträge bei Fronius, Huawei, BYD und Sigenergy | A/H | extern; `data/kunden.js` (Freigaben) | hoch, nicht garantiert | M | G | Story 1 bis 06.10.; Voraussetzung M01, M25 |

## 3) Umsetzungspakete für die nächste Welle

**Zuordnung der gemeinsamen Dateien (verbindlich):**

| Datei | Paket |
|---|---|
| `next.config.mjs` | P1 |
| `public/robots.txt` | P1 |
| `src/app/sitemap.js` | P2 |
| `src/lib/llms.js` | P2 |
| `src/data/verlinkung.js` | P3 |
| `src/data/navigation.js` | P4 |
| `src/app/layout.js` | P5 |

**Regel zu M04:** Die `robots`-Zeile entfernt jeweils das Paket, dem die page.js gehört. P1 bearbeitet alle page.js, die in keiner Paketliste stehen.

### P1 Technik-Fundament und Crawling (M01-Teil, M02–M07)
- **Dateien:**
  - `next.config.mjs`
  - `public/robots.txt`
  - `src/components/ui/Breadcrumbs.js`
  - `src/components/ServiceAT/meta.js`
  - `src/components/Rechner/RechnerSeite.js`
  - `src/components/Technik/seite.js`
  - neu `src/lib/seo/robots.js` (optional, für Sonderfälle)
  - alle übrigen page.js mit `robots:{index:true,follow:true}`, die keinem anderen Paket gehören
- **Ziel:** Alles ist erreichbar und indexierbar, Head-Metadaten kommen für KI-Crawler zuerst, das Schema ist fehlerfrei.
- **Abnahme:**
  - `/schneelast` liefert 200 statt 308.
  - `curl -A PerplexityBot` und `curl -A GPTBot` auf `/kontakt` im Produktions-Build: `<title>` und Canonical stehen vor `</head>`.
  - Der Rich-Results-Test für Breadcrumbs zeigt auf `/service/*` keinen Fehler.
  - `grep "index: true, follow: true"` liefert 0 Treffer, die P1 gehören.
  - Die 4 WordPress-URLs liefern 301.
  - `/service/stromtarif` enthält hreflang im HTML.
  - robots.txt ist nach E1 widerspruchsfrei.
  - Build und Tests grün.

### P2 Sitemap, llms.txt und IndexNow (M08–M11, `/mediathek` angleichen)
- **Dateien:**
  - `src/app/sitemap.js`
  - `src/lib/llms.js`
  - `src/app/llms.txt/route.js`
  - `src/app/llms-full.txt/route.js`
  - `scripts/indexnow.mjs`
  - `src/lib/indexnow.js`
  - `src/lib/kanaele/veroeffentlichungen.js`
  - `src/app/mediathek/page.js`
- **Ziel:** Jede indexierbare Seite steht in der Sitemap und in llms.txt, IndexNow meldet nur Änderungen.
- **Abnahme:**
  - Diese Seiten stehen mit eigenem `lastModified` in der Sitemap: alle Seiten der Welle 4, `/lastgang-analyse`, `/photovoltaik-bundesland/*` und `/produkte/wechselrichter/**` (sobald P4 sie liefert).
  - llms.txt hat die Blöcke „Werkzeuge & Daten“, „Förderung & Netz“ (EAG-Fördercall, 9 Landesförderungen, Netzanmeldung), „Referenzen“ und „Hersteller“ (aus `partner.js`, nur `belegt`) sowie „Stand:“ im Kopf.
  - `/mediathek` ist einheitlich behandelt: noindex und nicht in llms.txt.
  - Die Bild-Sitemap enthält die Referenzfotos.
  - IndexNow läuft als Trockenlauf mit Zustandsdatei und meldet nur Änderungen.
  - Die Key-Prüfung bricht bei 404 ab.
  - Die Statuscodes 403, 422 und 429 werden behandelt.

### P3 Onpage und Kannibalisierung (M13–M16, Seilbahn- und Bürgerbeteiligungs-Abschnitte)
- **Dateien:**
  - `src/app/page.js`, `gewerbe/page.js`
  - `produkte/photovoltaikanlage/page.js`, `produkte/mieterstrom/page.js`
  - `dienstleistungen/photovoltaik/page.js`
  - `forderungen/bundesfoerderung/page.js`
  - `service/direktvermarktung/page.js`
  - `gewerbespeicher/page.js`, `hotellerie-tourismus/page.js`, `kommunen/page.js`, `kommunen/vergabe-foerderung/page.js`
  - `energiegemeinschaften/betriebe-gemeinden/page.js`
  - `ladeinfrastruktur/page.js`, `landwirtschaft/page.js`, `agri-pv/page.js`
  - `rechner/freiflaeche-pacht/page.js`, `rechner/gewerbe-pv/page.js`, `rechner/finanzierung/page.js`
  - `flaechen-check/page.js`
  - `referenzen/projekte/[title]/page.js`, `components/Project/projektDaten.js`
  - `src/content/ratgeber/index.js` und die 11 Dubletten-Artikel in `src/content/ratgeber/*` (außer den Dateien von P4 und P6)
  - `src/data/verlinkung.js`, `components/Reusable/Querverweise.js`
  - `src/lib/hreflang.js` (nur bei E8 = noindex)
- **Ziel:** Jede Suchanfrage hat genau eine Zielseite, die H1 enthält den Suchbegriff, und es gibt keine Waisenseiten.
- **Abnahme:**
  - Keine doppelten Titles im Crawl.
  - Title ≤ 60 Zeichen und Description ≤ 160 Zeichen nach `meta-vorschlaege.tsv`.
  - Die H1 der 12 Hauptseiten enthält den Suchbegriff.
  - Projektseiten ohne `new Date()`, mit `datePublished`.
  - `/dienstleistungen/smarthome` und `/produkte/mieterstrom` haben mindestens einen internen Link.
  - Der Seilbahn-Abschnitt erscheint nur mit RIS-Beleg.

### P4 Hersteller und Wechselrichter (M17–M20)
- **Dateien:**
  - `components/Hersteller/partner.js`, `Hersteller/HerstellerFilter.js`
  - `components/Produktdetail/HerstellerDetail.js`
  - `components/Photovoltaik/KomponentenUebersicht.js`
  - neu `app/produkte/wechselrichter/page.js` und `[slug]/page.js`
  - `produkte/stromspeicher/[slug]/page.js`, `produkte/hersteller/page.js`
  - `service/repowering/page.js`, `service/e-check/page.js`
  - `content/ratgeber/wechselrichter-photovoltaik.js`, `solarmodule-vergleich.js`, `photovoltaik-angebot-vergleichen.js`
  - `src/data/navigation.js`
  - `src/data/projekte.js` (nur mit echten Daten)
- **Ziel:** Belegte Marken sind mit eigenständigen Seiten auffindbar, rechtssicher nach MSchG und UWG.
- **Abnahme:**
  - `BELEGTE_PARTNER` wird aus `partner.js` abgeleitet.
  - Detailseiten gibt es nur für Marken mit `belegt`.
  - Jede Detailseite hat mindestens 60 % eigenen Text im Vergleich zu den Speicherseiten.
  - Brand hat `url` und `sameAs`, kein Product ohne `offers`.
  - Titel und Description von `stromspeicher/huawei` sind stimmig.
  - Jeder Tabellenwert hat Datenblatt, Version und Abrufdatum.
  - Keine Logos, kein „Partner“ ohne Urkunde, keine Namen von Mitbewerbern.
  - Die Checkliste hat den Anker `#pv-firma-pruefen`.
  - Der Service-Abschnitt erscheint nur bei E4 = ja.

### P5 Entität, E-E-A-T und Antwortformat (M21–M25, M28)
- **Dateien:**
  - `src/app/layout.js`, `src/lib/site.js`
  - `app/uber-uns/page.js`, `uber-uns/team/page.js`
  - `app/ratgeber/[slug]/page.js`
  - `data/mannschaft.js`, `data/faqs.js`, `data/kennzahlen.js`, `data/lexikon.js`
  - `technik/parkregler/page.js`
  - `sponsoring/page.js`, `components/Sponsoring/sponsoringDaten.js`
  - `photovoltaikanlage/googlereview.js`, `reviews.js` (löschen)
  - `app/presse/page.js`
- **Ziel:** Eine eindeutige, belegte Firma als Entität; Inhalte, aus denen KI-Systeme zitieren können.
- **Abnahme:**
  - `memberOf` enthält PV Austria.
  - Kein `@oekovolt`-Handle ohne Beleg.
  - `verification` kommt aus einer Umgebungsvariablen, die GTM-ID ist entfernt.
  - Der CO₂-Zeitraum ist ausgefüllt oder die Zahl ist entfernt.
  - Bei mindestens 16 FAQ beginnt die Antwort mit Zahl, Einheit und Stand.
  - `reviewedBy` erscheint nur mit schriftlicher Einwilligung.
  - Die Parkregler-Seite beginnt mit „Ein EZA-Regler ist …“.
  - Sponsoring-Links tragen `rel="sponsored"`.

### P6 Eigene Daten und Bundesland-Vorlagen (M01-Rest, M12, M26, M27)
- **Dateien:**
  - `app/schneelast/page.js`, `schneelast/[bundesland]/page.js`
  - `app/standort-check/page.js`, `app/pv-prognose/page.js`, `app/einspeisung-gewerbe/page.js`
  - `freiflaechen-photovoltaik/widmung/**`, `src/lib/flaeche/*`
  - `photovoltaik-bundesland/[land]/page.js`, `lib/bundesland/auswertung.js`
  - `data/regionen/wien.js`, `data/regionen/salzburg.js`
  - `data/oemag.js`, `content/ratgeber/oemag-marktpreis.js`
  - neu `public/presse/grafiken/*`
- **Ziel:** Eigene Daten werden zitierfähig, und die Regionalseiten gelten nicht als Doorway-Seiten.
- **Abnahme:**
  - Datasets sind gültig (description, license, Methodik).
  - Die 5-Wort-Überschneidung der Bundesland-Varianten liegt unter 0,35. Sonst werden sie als Sprungmarken im Hub zusammengeführt.
  - Je Bundesland ist eine Hauptseite festgelegt.
  - Im Titel-Muster steht kein „Förderung“.
  - Stadt Salzburg und Land Salzburg sind im Titel getrennt.
  - `/einspeisung-gewerbe` ohne „OeMAG-Marktpreis“ im Title.
  - Die OeMAG-Seite nennt den Monat im Titel.
  - Die Hubs verlinken auf `/ratgeber/photovoltaik-angebot-vergleichen#pv-firma-pruefen`.
  - Widmungsseiten mit Kriterien-Tabelle, Quelle und Stand.

### P7 Maßnahmen außerhalb der Website (M29, M30; keine Repo-Dateien außer neu `docs/seo/Offpage-Fahrplan.md`)
- **Ziel:** Sichtbarkeit in der Kartensuche, bei Bing und ChatGPT, bei Apple und DuckDuckGo; redaktionelle Links.
- **Abnahme:**
  - Search Console und Bing Webmaster sind per DNS verifiziert, die Sitemap ist eingereicht.
  - Google-Unternehmensprofil geprüft (Name ohne Zusatzwörter, Kategorie „Solarenergieunternehmen“, 9 Bundesländer als Einzugsgebiet).
  - Bing Places und Apple Business Connect sind angelegt.
  - Herold, Cylex und die Gemeinde sind angeschrieben.
  - Story 1 ist bis 06.10. versendet.
  - Wikidata ist mit Offenlegung angelegt.
  - Einträge im Installateur-Programm der Hersteller sind geklärt.
  - Bewertungen werden ohne Anreize und ohne Vorauswahl eingeholt.

**Reihenfolge:** P1, P2 und P6 parallel zuerst; `/schneelast` und der EAG-Fördercall müssen vor dem 08.10. live und per IndexNow gemeldet sein. P3, P4 und P5 parallel. P7 läuft sofort und unabhängig.

## 4) Entscheidungen für den Auftraggeber

- **E1 KI-Crawler:**
  - Variante A (empfohlen): GPTBot, ClaudeBot, CCBot, Google-Extended und Meta-ExternalAgent erlauben. Das bedeutet Grounding in der Gemini-App und Markenwissen in künftigen Modellen. Die Inhalte werden dann fürs Training genutzt.
  - Variante B: Training bleibt gesperrt. Dann müssen auch Applebot-Extended, anthropic-ai und Claude-Web gesperrt werden.
  - Die Such-Crawler bleiben in beiden Fällen erlaubt.
- **E2 Englische Version:** Nur als Kurzfassung mit 3–5 Seiten, eigenem Root-Layout, hreflang nur zwischen gleichwertigen Seitenpaaren und von Menschen geprüfter Übersetzung. Voraussetzung ist, dass jemand englische Anfragen beantwortet. Empfehlung: in eine spätere Welle verschieben. Keine Seiten für Südtirol oder Bayern, Bayern deckt oekovolt.de ab.
- **E3 Herstellermarken:** Für welche Marken gibt es Nachweise, etwa Lieferantenrechnungen oder Zertifikate (Fronius, Huawei, Solis, BYD, Sigenergy, meteocontrol)? Ist Ökovolt Fronius System Partner, oder wird die Teilnahme beantragt? Dürfen interne Daten zu Wechselrichtern und Speichern in `projekte.js` eingetragen werden?
- **E4 Service für Fremdmarken:** Wartet und tauscht Ökovolt tatsächlich Wechselrichter anderer Hersteller, etwa SMA oder SolarEdge? Nur dann wird der Abschnitt veröffentlicht.
- **E5 Autoren und Fachprüfer:** Welche reale Person, zum Beispiel die Geschäftsführung oder eine Elektrotechnik-Fachkraft, prüft Ratgeber-Artikel fachlich? Nötig sind schriftliche Einwilligung, Foto, LinkedIn-Profil und Qualifikation.
- **E6 Firmendaten:**
  - Gilt die Kennzahl 340 MWp oder 510 MW? Welcher Zeitraum gilt für die CO₂-Zahl?
  - Offizielle E-Mail office@oekovolt.at oder .at? Beide Postfächer bleiben erreichbar.
  - Welche Öffnungszeiten gelten verbindlich? Herold weicht ab.
  - Wie hängt „ÖKOVOLT Energietechnik GmbH“ in Lochau mit Ökovolt zusammen?
  - Gehört der X-Handle der AT-GmbH?
  - Gibt es ein besetztes Büro in Salzburg? Wenn nicht, gibt es kein eigenes Profil dafür.
- **E7 Ratgeber-Dubletten:** 301 auf die Hauptseite oder eigener Blickwinkel? Die Entscheidung fällt erst mit Traffic-Daten aus der Search Console oder SISTRIX. Sofort freigegeben ist nur der 301 von `reststromvermarktung`.
- **E8 Waisenseiten aus DE-Altbestand** (`smarthome`, `mieterstrom`): Verlinken (empfohlen) oder noindex? Bei noindex muss die hreflang-Liste mit oekovolt.de abgestimmt werden.
- **E9 Bundesland-Struktur:** Welcher Seitentyp ist je Bundesland die Hauptseite? Dürfen Schneelast- und Widmungsseiten ohne echte Unterschiede in den Hub zusammengeführt werden? Wird Wien auf eine einzige Seite zusammengeführt (301)?
- **E10 Außerhalb der Website:**
  - Wer pflegt das Google-Unternehmensprofil und fragt Bewertungen an?
  - Kunden-Freigaben für die Kundenbühne einholen.
  - Freigabe für Wikidata mit Offenlegung; einen Wikipedia-Artikel legen wir nicht an.
  - Budget für APA-OTS.
- **E11 SISTRIX:** Den Connector in claude.ai autorisieren (OAuth fehlt). Erst dann lassen sich die geschätzten Suchvolumina und die KI-Sichtbarkeit messen und E7 entscheiden.
- **E12 Rechtliche Prüfung:** Die Vergleichstabellen in P4 und die Seilbahn-Aussage (RIS) vor der Veröffentlichung prüfen lassen.

Rohdaten der Fachberichte liegen im Scratchpad unter `scratchpad/seotech/` und `scratchpad/kwstrat/`: `meta-vorschlaege.tsv` mit den Title- und H1-Wortlauten für P3, `keyword-map.tsv` mit der Zuordnung Keyword → Zielseite.