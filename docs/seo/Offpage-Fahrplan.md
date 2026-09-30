# Offpage-Fahrplan oekovolt.com (P7: M29, M30)

**Stand:** 30.09.2026 · **Grundlage:** [SEO-Umsetzungsplan vom 30.09.2026](../projekt-doku/anhang/seo-umsetzungsplan-2026-09-30.md), Paket P7 (Maßnahmen M29, M30), Entscheidungen E1–E12
**Für:** Ökovolt Solartechnik GmbH (Auftraggeber). Alle Schritte hier geschehen **außerhalb** des Repositorys.
**Vorlagen:** [`vorlagen/`](vorlagen/) mit fertigen Textbausteinen, E-Mails und Pressetext

> **Grundsätze für alle Schritte**
> - Nur White-Hat nach den Richtlinien von Google und Bing. Wir kaufen keine Links, tauschen keine Links und setzen keine Keyword-Linktexte in Pressetexten. Auch Verzeichnis-Spam machen wir nicht.
> - Jede Zahl braucht eine Quelle und ein Stand-Datum. Ist ein Punkt beim Auftraggeber offen, steht hier **[offen: E…]** statt einer Annahme.
> - Bewertungen holen wir **ohne Anreize und ohne Vorauswahl** ein. Wir bitten alle Kunden gleich und nicht nur zufriedene (Abschnitt 13).
> - Marken (E3): „Partner“ oder ein Logo nur mit Urkunde. „Bei Ökovolt verbaut“ nur für Fronius, Huawei, BYD, Sigenergy, Solis und meteocontrol.
> - Es gibt **keine Garantie** für Rankings, Zitate in KI-Antworten oder Presseberichte.

Legende Status: ☐ offen · ◐ vorbereitet (Vorlage fertig, Handlung beim Auftraggeber) · ☑ erledigt (mit Nachweis).

---

## 0. Zeitplan auf einen Blick

| Termin | Schritt | Wer | Abschnitt | Status |
|---|---|---|---|---|
| sofort (ab 01.10.) | DNS-Zugang klären; Search Console und Bing Webmaster per DNS verifizieren | Auftraggeber (DNS), Technik | 2, 3 | ☐ |
| sofort | Google-Unternehmensprofil prüfen und korrigieren; Öffnungszeiten festlegen (E6) | Profilpflege (E10) | 4 | ◐ |
| bis 05.10., 12:00 | **Go/No-Go Story 1:** `/schneelast` liefert live 200, IndexNow-Schlüsseldatei erreichbar | Technik | 1, 11 | ☐ |
| **bis Di 06.10.2026** | **Story 1 „Schneelast-Karte“ versenden** | Auftraggeber/PR | 11 | ◐ |
| 08.10.2026, 17:00 | Ticketziehung EAG-Fördercall (Seite muss vorher live und gemeldet sein, Plan P2) | Technik | 1 | ☐ |
| bis 09.10. | Herold, Cylex, Gemeinde, voltalux, WKO und FirmenABC anschreiben | Auftraggeber | 7 | ◐ |
| bis 09.10. | Anfragen an Fronius, Huawei, BYD und Sigenergy versenden | Auftraggeber | 9 | ◐ |
| nach der GBP-Prüfung | Bing Places (Import aus Google) und Apple Business anlegen | Profilpflege | 5, 6 | ☐ |
| nach Veröffentlichung des OeMAG-Septemberwerts (Anfang Oktober) | Story 2 „OeMAG-Marktpreis“ | PR | 11 | ☐ |
| Oktober | Kunden-Freigaben für die Kundenbühne anfragen | Vertrieb/Projektleitung | 12 | ◐ |
| nach Freigabe E10 | Wikidata-Objekt mit Offenlegung | Auftraggeber | 10 | ◐ |
| November 2026 | Story 3 „Widmung: neun Länder, neun Regeln“ | PR | 11 | ☐ |
| Jänner 2027 | Story 4 „Netzanmeldung“ (vor dem nächsten Fördercall) und Story 5 „Jahresauswertung Börsenstrom 2026“ | PR | 11 | ☐ |
| laufend: T0, +4, +8 und +12 Wochen | Messplan | SEO | 14 | ☐ |

---

## 1. Voraussetzungen: Stand der Live-Website (geprüft am 30.09.2026)

Mehrere Offpage-Schritte verweisen auf Seiten, die **bisher nur lokal** vorhanden sind. Am 30.09.2026 lieferte `https://www.oekovolt.com` Folgendes (Abruf mit `curl`):

| URL | Live-Status | Folge |
|---|---|---|
| `/schneelast`, `/schneelast/tirol` | **404** | Story 1 darf erst nach dem Deploy verschickt werden (Go/No-Go am 05.10.) |
| `/presse` | **404** | Den Pressetext zusätzlich im Newsroom veröffentlichen, sobald er live ist |
| `/45250af1ed4ed419108eb76412d11547.txt` (IndexNow-Schlüssel) | **404** | IndexNow meldet erst nach dem Deploy (das Skript bricht bei 404 ab, M10) |
| `/sitemap.xml` | 200, **106** `<loc>` | Lokal sind es laut Plan rund 311 URLs. Die Sitemap erst nach dem Deploy in der Search Console einreichen bzw. neu einlesen lassen |
| `oekovolt.at` → `oekovolt.com` → `www.oekovolt.com` | 301 → 301 | Zwei Sprünge. Beim Hoster auf **einen** 301 direkt nach `https://www.oekovolt.com/` umstellen (Abschnitt 8) |

**Go/No-Go-Prüfung vor jedem Presseversand** (in PowerShell oder Git Bash):

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.oekovolt.com/schneelast          # erwartet 200
curl -s https://www.oekovolt.com/45250af1ed4ed419108eb76412d11547.txt                 # erwartet den Schlüssel
node scripts/indexnow.mjs --trocken                                                  # zeigt, was gemeldet würde
node scripts/indexnow.mjs https://www.oekovolt.com/schneelast                        # meldet die Landingpage
```

---

## 2. Einheitliche Firmendaten (NAP): eine Quelle

Die **einzige Quelle** ist `src/lib/site.js` (FIRMA). Registerdaten wurden am 28.09.2026 über das Firmenbuch, WKO Firmen A–Z und FirmenABC geprüft. Überall gilt exakt dieser Wortlaut:

| Feld | Wert | Anmerkung |
|---|---|---|
| Name | **Ökovolt Solartechnik GmbH** | ohne Zusatzwörter wie „Photovoltaik“, „Oberösterreich“ oder „Solaranlagen“ |
| Adresse | Gewerbegebiet 10, 5121 Ostermiething, Oberösterreich | Bezirk Braunau am Inn |
| Telefon | +43 6278 71030 | |
| E-Mail | office@oekovolt.at | Entscheidung E6: .com; das .at-Postfach bleibt erreichbar |
| Website | https://www.oekovolt.com | immer mit `www` und `https` |
| Firmenbuch | FN 375708m, Landesgericht Ried im Innkreis | |
| UID | ATU67027148 | |
| Gegründet | 2012 | |
| Gewerbe | Elektrotechnik (reglementiertes Gewerbe), GISA 17864251 | |
| Verband | ordentliches Mitglied PV&B Austria (Beleg: pvbaustria.at/mitglieder, 30.09.2026) | |
| Öffnungszeiten | **[offen: E6]**. Website derzeit: Mo–Do 08:00–16:00, Fr 08:00–13:00 | Herold und Cylex weichen ab (Abschnitt 7) |
| Kennzahlen (optional) | 5.000 PV-Kraftwerke errichtet, 510.000 kWp installierte Leistung (Angaben Ökovolt Österreich, Stand 30.09.2026, `src/data/kennzahlen.js`) | Einheit MW oder MWp ist ungeklärt (R-46). In Verzeichnissen den Wortlaut der Website verwenden. **Die CO₂-Zahl nicht verwenden**, solange ihr Zeitraum offen ist (E6) |

**Regel:** Ändert sich ein Wert, wird zuerst `src/lib/site.js` geändert und danach jedes Profil aus Abschnitt 4–7. Die Profil-URLs trägt man nach der Prüfung in `site.js` ein (`googleUnternehmensprofil`, `bingPlaces`). Sie erscheinen dann automatisch in `sameAs` (Paket P5).

---

## 3. Google Search Console und Bing Webmaster Tools per DNS

### 3.1 Vorbereitung
1. Klären, wer die DNS-Zone von `oekovolt.com` verwaltet (Registrar oder Hoster) und wer dort Einträge anlegen darf. **[offen: Zugang]**
2. Ein **Google-Konto der Firma** verwenden (z. B. ein Rollenkonto), kein privates Konto und kein Konto der Agentur. Weitere Personen bekommen später Nutzerrechte.

### 3.2 Google Search Console (Domain-Property)
1. `https://search.google.com/search-console` → „Property hinzufügen“ → **Domain** → `oekovolt.com` (ohne `www` und ohne `https`). Die Domain-Property umfasst `www`, die Domain ohne `www` sowie `http` und `https`.
2. Search Console zeigt einen **TXT-Eintrag** (`google-site-verification=…`). Diesen in der DNS-Zone anlegen: Host/Name **leer oder `@`**, Typ TXT, Wert = der angezeigte Text. Bestehende TXT-Einträge (z. B. SPF) bleiben stehen.
3. In der Search Console auf „Bestätigen“ klicken. Manuell angelegte Einträge können laut Google **bis zu zwei oder drei Tage** brauchen. Schlägt die Bestätigung fehl, nach ein bis zwei Tagen erneut versuchen.
4. **Sitemap einreichen:** Menü „Sitemaps“ → `https://www.oekovolt.com/sitemap.xml`. Erst **nach dem Deploy** einreichen (Abschnitt 1), sonst liest Google den alten Stand mit 106 URLs. Optional die Feeds `https://www.oekovolt.com/rss.xml` und `https://www.oekovolt.com/presse/rss.xml` ebenfalls als Sitemap einreichen.
5. **Nutzer:** Den Auftraggeber als Inhaber eintragen, SEO und Technik als „Uneingeschränkt“. Rechte nur so weit vergeben wie nötig.
6. **Optional:** `oekovolt.at` und `eigenverbrauch.at` ebenfalls als Domain-Property bestätigen. Dann sieht man, ob dort noch Seiten im Index stehen (Abschnitt 8).
7. **Nachweis für die Abnahme:** Screenshot „Inhaberschaft bestätigt“ und Screenshot des Sitemap-Berichts mit Status „Erfolgreich“ und Anzahl der gefundenen URLs.

### 3.3 Bing Webmaster Tools
1. `https://www.bing.com/webmasters` → mit einem Microsoft-Konto der Firma anmelden.
2. Einfachster Weg: **„Aus Google Search Console importieren“**. Bing übernimmt Website und Sitemaps und prüft die Inhaberschaft regelmäßig über die Search Console. Voraussetzung ist Schritt 3.2.
3. Weg ohne Google (**DNS**): Website `https://www.oekovolt.com` hinzufügen → Methode **CNAME** → Bing nennt einen Namen. In der DNS-Zone einen CNAME mit diesem Namen auf **`verify.bing.com`** anlegen. Die Änderung kann bis zu 72 Stunden brauchen. Alternativ „Domain Connect“, falls der DNS-Anbieter das unterstützt.
4. **Sitemap:** „Sitemaps“ → `https://www.oekovolt.com/sitemap.xml` einreichen, falls sie nicht schon importiert wurde.
5. **IndexNow:** Der Schlüssel liegt bereits im Repository (`public/45250af1ed4ed419108eb76412d11547.txt`, Konstante in `src/lib/indexnow.js`). **In Bing keinen zweiten Schlüssel erzeugen.** Nach dem Deploy prüfen:
   - `https://www.oekovolt.com/45250af1ed4ed419108eb76412d11547.txt` liefert genau `45250af1ed4ed419108eb76412d11547`.
   - `node scripts/indexnow.mjs --nur-zustand` legt die Ausgangsbasis an. Danach meldet `node scripts/indexnow.mjs` nach jedem Deploy nur die Änderungen (M10).
   - Im Bing Webmaster unter „IndexNow“ erscheinen die gemeldeten URLs. Diesen Screenshot als Nachweis ablegen.
6. **Nutzer:** Den Auftraggeber als Inhaber eintragen, SEO als Administrator.
7. **Warum Bing wichtig ist:** Bing liefert den Index für DuckDuckGo, Ecosia und Yahoo. Laut `src/lib/indexnow.js` nutzt auch die Such- und Antwortfunktion von ChatGPT und Copilot den Bing-Index.

---

## 4. Google-Unternehmensprofil (nur Ostermiething)

**Richtlinien** (Google-Hilfe, abgerufen am 30.09.2026):
- [Richtlinien für die Präsentation Ihres Unternehmens](https://support.google.com/business/answer/3038177?hl=de): Name wie in der realen Welt, keine Zusatzwörter. Bei Verstößen kann das Profil gesperrt werden.
- [Einzugsgebiet](https://support.google.com/business/answer/9157481?hl=de): höchstens 20 Gebiete. Die Grenzen des gesamten Einzugsgebiets sollten nicht mehr als etwa **zwei Autostunden** vom Standort entfernt sein.
- [Beschreibung](https://support.google.com/business/answer/13682007?hl=de): höchstens 750 Zeichen, keine URLs, kein HTML, keine Aktionen oder Preise.

### Schritt für Schritt
1. **Inhaberschaft prüfen:** `https://business.google.com` mit dem Firmenkonto aufrufen. Gibt es schon ein Profil, zuerst die Inhaberschaft übernehmen und die Verwaltung auf das Firmenkonto legen. Die Agentur wird nur als „Verwalter“ eingetragen. **[offen: E10, wer das Profil pflegt]**
2. **Dubletten suchen:** In Google Maps nach „Ökovolt“, „Oekovolt“, „SUN VALUE“ und „Ökovolt Lochau“ suchen. Doppelte Profile derselben GmbH über „Änderung vorschlagen → Doppelt vorhanden“ melden. Ein Profil für einen Standort **ohne ständig besetztes Büro** gibt es nicht. Das gilt auch für Salzburg, solange E6 offen ist.
3. **Name:** exakt `Ökovolt Solartechnik GmbH`. **Nicht** „Ökovolt Solartechnik GmbH – Photovoltaik Oberösterreich“ oder Ähnliches.
4. **Hauptkategorie:** „Solarenergieunternehmen“ (Vorgabe des Plans). In der Kategorieauswahl prüfen, ob die Bezeichnung genau so angeboten wird. Weitere Kategorien nur, wenn der Satz „Dieses Unternehmen **ist** …“ zutrifft (etwa eine Elektrotechnik-Kategorie wegen des reglementierten Gewerbes). Keine Kategorien für Produkte wie Wallbox oder Wärmepumpe.
5. **Adresse und Einzugsgebiet:** Die Adresse bleibt sichtbar, wenn im Büro während der Öffnungszeiten Personal vor Ort ist (Richtlinie für hybride Unternehmen). Sonst die Adresse ausblenden.
   - **Abweichung vom Plan:** Das Abnahmekriterium „9 Bundesländer als Einzugsgebiet“ widerspricht der Google-Richtlinie zu etwa zwei Autostunden. Wien, Burgenland und Vorarlberg liegen von Ostermiething aus voraussichtlich weiter weg; die Fahrzeiten mit einem Routenplaner prüfen.
   - **Empfehlung:** Nur Bundesländer bzw. Bezirke eintragen, die innerhalb von etwa zwei Stunden liegen. Die bundesweite Tätigkeit zeigen Website und Bundesland-Hubs (`/photovoltaik-bundesland/*`), nicht das Profil. **[offen: Entscheidung Auftraggeber, dann Abnahmekriterium anpassen]**
6. **Öffnungszeiten:** erst nach E6 eintragen, danach identisch in Herold, Cylex und `site.js`.
7. **Leistungen** (nur solche mit eigener Seite auf oekovolt.com):
   - Photovoltaik für Gewerbe und Industrie
   - Freiflächen-Photovoltaik
   - Agri-PV
   - Photovoltaik für Landwirtschaft
   - Photovoltaik für Gemeinden
   - Gewerbespeicher/Stromspeicher
   - Ladeinfrastruktur
   - Wartung
   - E-Check/Anlagenprüfung
   - Drohneninspektion
   - PV-Reinigung
   - Repowering
   - Notstrom
   - Energieberatung

   Keine Preise, wenn sie nicht verbindlich sind. Service für Fremdmarken **nicht** nennen (E4).
8. **Beschreibung** (673 Zeichen, geprüft, ohne URL):
   > Die Ökovolt Solartechnik GmbH plant, errichtet und betreut seit 2012 Photovoltaikanlagen in Österreich – vom Firmensitz in Ostermiething im Bezirk Braunau am Inn aus. Schwerpunkt sind Anlagen für Gewerbe, Industrie, Landwirtschaft und Gemeinden: Dach- und Freiflächenanlagen, Stromspeicher und Ladeinfrastruktur sowie Wartung, E-Check und Repowering bestehender Anlagen. Ökovolt ist ein Fachbetrieb für Elektrotechnik (reglementiertes Gewerbe) und ordentliches Mitglied im Bundesverband Photovoltaic & Battery Austria. Auf unserer Website stellen wir kostenlose Werkzeuge bereit, etwa eine Schneelast-Karte für ganz Österreich auf Basis offener Daten von GeoSphere Austria.
9. **Website-Link:** `https://www.oekovolt.com/` ohne UTM-Parameter. Parameter verfälschen die Kanonisierung nicht, erschweren aber den Messplan; die Auswertung läuft über die GBP-Statistik.
10. **Fotos:** nur eigene Fotos mit geklärten Rechten, keine Herstellerlogos. Geeignet sind Firmensitz außen und innen, Team (nur mit Einwilligung, E5/P5) und Baustellen von Referenzprojekten mit Freigabe (Abschnitt 12).
11. **Beiträge:** einmal im Monat ein sachlicher Beitrag zu eigenem Inhalt mit Link auf die Landingpage:
    - Story 1: Schneelast-Karte
    - OeMAG-Monatswert (M27, monatlich)
    - EAG-Fördercall-Termine
    - neue Referenz mit Kundenfreigabe

    Keine Rabatt- oder Gewinnspiel-Beiträge, die an Bewertungen gekoppelt sind.
12. **Bewertungen:** siehe Abschnitt 13. Auf jede Bewertung sachlich antworten, auch auf negative. Keine Kundendaten in Antworten nennen.
13. **Nachweis für die Abnahme:** Screenshot der Profilansicht mit Name, Kategorie, Einzugsgebiet und Leistungen. Die Profil-URL in `site.js` → `googleUnternehmensprofil` eintragen (Paket P5 bzw. Technik).

---

## 5. Bing Places for Business

1. `https://www.bingplaces.com` → mit dem Microsoft-Konto aus Abschnitt 3.3 anmelden.
2. **„Aus Google Unternehmensprofil importieren“** wählen, **nachdem** Abschnitt 4 geprüft ist. Sonst werden alte Fehler übernommen. Bei einem bestätigten Google-Profil ist laut Microsoft-/Branchenangaben meist keine eigene Bestätigung nötig. Die Veröffentlichung dauert einige Tage.
3. Der Abgleich läuft nur von Google zu Bing. Änderungen immer zuerst in Google machen und dann in Bing neu synchronisieren.
4. Nur **einen** Eintrag für Ostermiething anlegen. Name, Kategorie und Beschreibung wie in Abschnitt 4.
5. **Nachweis:** Screenshot „Veröffentlicht“. Die URL in `site.js` → `bingPlaces` eintragen.

## 6. Apple Business (vormals Apple Business Connect)

Laut Apple-Support ist Business Connect in **Apple Business** aufgegangen. Anmeldung unter `https://business.apple.com` (Quelle: [Apple – Sign up and verify your organization](https://support.apple.com/guide/business/sign-up-and-verify-your-organization-axm402206497/web), abgerufen am 30.09.2026).

1. Organisation anlegen: Firmenname exakt wie in Abschnitt 2, Adresse, Website `https://www.oekovolt.com`, Ansprechperson mit Telefonnummer.
2. **Organisation verifizieren:** Das geht laut Apple innerhalb von **60 Tagen** mit **zwei** Methoden und kann bis zu fünf Werktage dauern. Möglich sind:
   - D-U-N-S-Nummer, falls vorhanden **[offen]**
   - **Domain-Validierung per TXT-Eintrag** in der DNS-Zone (gleicher Zugang wie Abschnitt 3)
   - amtliche Dokumente, etwa ein Firmenbuchauszug, ein GISA-Auszug oder eine Versorgerrechnung mit Name und Adresse
3. **Ort hinzufügen:** Ostermiething, Kategorie sinngemäß wie bei Google, Öffnungszeiten nach E6, Website und Telefon. Den Ort mit Dokumenten oder einem Anruf bestätigen, je nachdem, was Apple anbietet.
4. Nur **ein** Ort. Keine Orte für Regionen ohne Büro.
5. **Nachweis:** Screenshot „Verifiziert“ und Ansicht des Ortes in Apple Karten.

---

## 7. Verzeichnisse bereinigen

**Befund** (abgerufen am 30.09.2026; ✱ = nur über den Suchmaschinen-Ausschnitt geprüft, weil die Seite automatische Abrufe blockiert):

| Verzeichnis | Befund | Soll | Vorlage |
|---|---|---|---|
| **Herold** – [Eintrag Ostermiething](https://www.herold.at/gelbe-seiten/ostermiething/RhvF4/oekovolt-solartechnik-gmbh/) | Adresse, Telefon, E-Mail und FN stimmen. Der Seitentitel lautet „in 5121 Braunau am Inn“. Öffnungszeiten **Mo–Do 08–17, Fr 08–12**. In Suchergebnissen erscheint dieselbe Kennung (`RhvF4`) auch unter einem Pfad mit „kramsach“; Herold um eine eindeutige URL bitten | Öffnungszeiten nach E6. Ort „Ostermiething“. Website `https://www.oekovolt.com` | [verzeichnis-korrektur.md](vorlagen/verzeichnis-korrektur.md) A |
| **Herold** – [ÖKOVOLT Energietechnik GmbH, Lochau](https://www.herold.at/gelbe-seiten/lochau/fsQdR/oekovolt-energietechnik-gmbh-oesterreich/) | **Andere Gesellschaft** (FN 261840 i, gegründet 1998, Grünegger 10, 6911 Lochau), aber mit **office@oekovolt.at** und Website **oekovolt.com** | Klären, wie die Lochauer Gesellschaft zu Ökovolt steht (E6). Bis dahin nicht auf die AT-GmbH verweisen lassen: E-Mail und Website ändern oder den Eintrag löschen lassen, falls die Gesellschaft nicht mehr aktiv ist | B |
| **Cylex** – [Eintrag](https://www.cylex.at/ostermiething/%c3%b6kovolt-solartechnik-gmbh-8228401.html) ✱ | Öffnungszeiten laut Ausschnitt Mo–Fr 08–12 und 13–17. Kennzahlen „über 5.000 Anlagen und 510 MW“ | Öffnungszeiten nach E6. Kennzahlen im Wortlaut der Website mit Stand oder weglassen | A |
| **Gemeinde Ostermiething** – [Branchenverzeichnis](https://www.ostermiething.at/SUN_VALUE_GmbH) | E-Mail **office@oekovolt.at**. Die Seiten-URL enthält den alten Namen „SUN_VALUE_GmbH“ | E-Mail `office@oekovolt.at`. Eine URL mit dem aktuellen Namen erbitten; Website-Link ergänzen | C |
| **voltalux** – [Profil](https://voltalux.at/p/bfc887f3/) | „Ökovolt Solartechnik GmbH“ unter **„PV Anbieter Bregenz“** mit Adresse **Landstraße 11, 6911 Lochau**. Laut voltalux kein Vertragspartner | Adresse Ostermiething und Region Oberösterreich, oder Profil entfernen. Die AT-GmbH hat keinen Sitz in Lochau | D |
| **WKO Firmen A–Z** – [Eintrag](https://firmen.wko.at/%C3%96kovolt-solartechnik-gmbh-%C3%96kovolt-solartechnik-gmbh/ober%C3%B6sterreich/?firmaid=683331b8-cc78-405b-983d-55acaee1a686) | Grundlage der Registerdaten. Laut `docs/AT-UEBERGABE.md` mit office@oekovolt.at | Nur prüfen: Website mit `www`, Öffnungszeiten nach E6, Tätigkeitsbeschreibung | A (Kurztext) |
| **FirmenABC** – [Eintrag](https://www.firmenabc.at/oekovolt-solartechnik-gmbh_OvcS) | Grundlage der Registerdaten. Die Lochauer Gesellschaft hat einen eigenen Eintrag (`oekovolt-energietechnik-gmbh_qGI`) | Website und Beschreibung prüfen; beim Lochauer Eintrag wie Herold B vorgehen | A, B |
| **eigenverbrauch.at** | Die Domain zeigt auf denselben Server wie www.oekovolt.com (178.105.80.143). Das Zertifikat gilt nur für oekovolt.com, deshalb schlägt der Abruf fehl. In Suchergebnissen erscheint `eigenverbrauch.at/kontakt` | 301 auf `https://www.oekovolt.com/` mit gültigem Zertifikat (Abschnitt 8) | – |

**Vorgehen:**
1. Zuerst E6 klären (Öffnungszeiten, Lochau). Danach alle Einträge mit **denselben** Werten aus Abschnitt 2 anschreiben bzw. über die Eintragsverwaltung ändern. Herold und Cylex bieten eine Inhaber-Funktion am Eintrag („Sind Sie Inhaber dieses Unternehmens?“ bzw. „Eintrag bearbeiten“).
2. **Keine neuen Verzeichnisse in Masse.** Nur Verzeichnisse mit echtem Nutzen: Branchenbücher, Kammer, Gemeinde, Verband, Hersteller.
3. Nachweis je Verzeichnis: Datum der Anfrage, Antwort und Screenshot danach. In der Tabelle „Verzeichnis-Protokoll“ am Ende von [verzeichnis-korrektur.md](vorlagen/verzeichnis-korrektur.md) eintragen.

---

## 8. Domains und Weiterleitungen (beim Hoster, nicht im Repo)

| Domain | Ist (30.09.2026) | Soll |
|---|---|---|
| `oekovolt.at`, `www.oekovolt.at` | 301 → `https://oekovolt.com/` → 301 → `https://www.oekovolt.com/` | ein 301 direkt auf `https://www.oekovolt.com/` mit Pfad |
| `eigenverbrauch.at` | DNS zeigt auf den Web-Server, kein gültiges Zertifikat, keine Antwort | Zertifikat für `eigenverbrauch.at` und `www.eigenverbrauch.at`, dann 301 auf `https://www.oekovolt.com/` bzw. auf passende Seiten wie `/kontakt`. Gehört die Domain zur Lochauer Gesellschaft, zuerst E6 klären |

Stand in der Search Console (Domain-Properties aus 3.2, Punkt 6) nach 4 Wochen prüfen. Hatte `eigenverbrauch.at` eigene Seiten im Index, das Werkzeug „Adressänderung“ nutzen.

---

## 9. Installateur-Programme der Hersteller (M30, E3)

**Regel:** Erst mit **schriftlicher** Aufnahme (Urkunde, Bestätigungsmail oder Listung) wird der Status in `src/components/Hersteller/partner.js` gepflegt (Paket P4). Bis dahin lautet die Formulierung nur „bei Ökovolt verbaut“. „Partner“ und Programmlogos sind erst nach der Aufnahme erlaubt (MSchG/UWG).

| Hersteller | Programm | Voraussetzungen laut Hersteller (abgerufen am 30.09.2026) | Was Ökovolt braucht | Quelle |
|---|---|---|---|---|
| **Fronius** | Fronius System Partner (FSP), Österreich | Mindestens 20 registrierte Seriennummern, mindestens 60 Training Credits, aktive Nutzung von Solar.web und Solar.SOS. Vorteile laut Fronius: u. a. Listung in der Online-Installateurssuche und das FSP-Logo | Zahl der registrierten Seriennummern und Solar.web-Konto prüfen, Trainingsstand ermitteln, dann online bewerben. Nach dem Formular schickt Fronius ein Partner-Angebot per E-Mail | [fronius.com – Partnerschaft mit Fronius (AT)](https://www.fronius.com/de-at/austria/solarenergie/installateure-partner/service-support/fronius-system-partner), Bewerbung: [fsp.fronius.com/de-AT/Registration](https://fsp.fronius.com/de-AT/Registration) |
| **Huawei** | FusionSolar Installer / CSP (Certified Service Partner) | Die Installateurssuche zeigt zertifizierte Partner. CSP ist laut Huawei „die offizielle Akkreditierung für die Service-Fähigkeiten von Partnern“. Stufen und Prüfungen (Online-/Vor-Ort-Prüfung, installierte Leistung) nennen Huawei-Seiten und Distributoren; die genauen Kriterien für Österreich beim Huawei-Distributor erfragen | FusionSolar-Installateurskonto (Firma), Zahl der Anlagen, Schulungsnachweise. Anfrage zu CSP-Kriterien und Kartenlistung | [solar.huawei.com – Find Installers](https://solar.huawei.com/en/find-installer/), [Partner-Karte](https://solar.huawei.com/partners/map), [Installer Community](https://community.solar.huawei.com/en/be_installer.html?target=regInstaller) |
| **BYD** (Battery-Box) | Be Partner Program | „To participate, please register as installer first.“ Punkte für registrierte Systeme. Laut BYD Zugang zu Events, Informationen, Prämien und Zertifizierung; Online-Schulung „BePartner Online Training“. **Eine öffentliche Installateurssuche auf bydbatterybox.com war nicht belegbar** | Als Installateur registrieren, verbaute Systeme erfassen, Schulung absolvieren. Nachfragen, ob und wo Installateure gelistet werden | [bydbatterybox.com/byd-partner](https://www.bydbatterybox.com/byd-partner), [bepartner-program.com](https://www.bepartner-program.com/login), [BePartner Online Training](https://training.bydbatterybox.com/courses/course-v1:EFT-Systems+BPOT01+2020_H1/about) |
| **Sigenergy** | Installer Program, Stufen Certified / Silver / Gold / Platinum | Silver „Top 5–10% in the region“, Gold „Top 5% in the region“, Platinum „by invitation only“. „Installers will be shown Sigenergy installer map“. Registrierung über die mySigen-App (Kontotyp Installateur) | mySigen-Installateurskonto, Zertifizierungskurs, verbaute Anlagen erfassen. Nachfragen, ab wann die Listung auf der Karte für Österreich erfolgt | [sigenergy.com – Installer Program](https://www.sigenergy.com/en/service/installer_program), [Installer Map](https://www.sigenergy.com/en/order/installer_map) |

- Solis und meteocontrol sind ebenfalls belegt (E3), aber nicht Teil von M30. Wer möchte, kann sie analog anfragen.
- Anfrage-Mails: [hersteller-anfrage.md](vorlagen/hersteller-anfrage.md).
- **Abnahme „geklärt“** heißt: Für jeden der vier Hersteller liegt schriftlich vor, (a) ob Ökovolt gelistet ist bzw. wird und (b) welche Bezeichnung Ökovolt verwenden darf.

---

## 10. Wikidata-Eintrag mit Offenlegung (M29, E10)

**Wichtig vorab:**
- Wikidata nimmt Objekte auf, die „mit seriösen und öffentlich zugänglichen Referenzen beschrieben werden können“ ([Wikidata:Notability](https://www.wikidata.org/wiki/Wikidata:Notability), Kriterium 2).
- Der Essay [Wikidata:Self-promotion](https://www.wikidata.org/wiki/Wikidata:Self-promotion) rät **ausdrücklich davon ab**, Objekte über die eigene Organisation anzulegen. Er empfiehlt unabhängige Quellen; Pressemitteilungen und die eigene Website zählen nicht.
- Bezahlte oder beauftragte Bearbeitungen müssen laut Richtlinie [Wikidata:Disclosure of paid editing](https://www.wikidata.org/wiki/Wikidata:Disclosure_of_paid_editing) **auf der Benutzerseite** offengelegt werden, im Klartext oder mit der Vorlage `{{PaidContributions}}`.

**Empfehlung:**
1. Anlegen erst, wenn E10 freigegeben ist, **mit Offenlegung** und nur mit unabhängigen Referenzen: WKO Firmen A–Z, Mitgliederverzeichnis PV&B Austria, Firmenbuch (FN) und idealerweise ein redaktioneller Bericht, etwa über Story 1.
2. Liegt noch kein unabhängiger Bericht vor, ist das Löschrisiko höher. Dann besser erst nach der ersten Berichterstattung anlegen.
3. **Keinen Wikipedia-Artikel** anlegen (E10).

Vorlage mit Eigenschaften, Referenzen und Offenlegungstext: [wikidata-eintrag.md](vorlagen/wikidata-eintrag.md).
Nach dem Anlegen die Wikidata-URL in `site.js` → `FIRMA.profile` (`sameAs`) aufnehmen (Paket P5).

---

## 11. Datenstorys 1–5 mit Outreach (M30)

**Regeln für die Pressearbeit:**
- **Eigene Daten mit offener Methodik.** Jede Story hat eine Landingpage mit Quelle, Lizenz und Stand.
- **Links:** Wir bitten nicht um Links und bieten nichts dafür an. In Pressetexten stehen nur Marken- bzw. URL-Links, keine Keyword-Linktexte (Google: Link-Spam in verteilten Pressemitteilungen).
- **Versand** nur an redaktionelle Adressen, die für Pressemitteilungen veröffentlicht sind. Jede Mail einzeln, kein offener Verteiler, mit Hinweis zur Abmeldung. Die rechtliche Zulässigkeit von E-Mail-Aussendungen (TKG 2021, DSGVO) vor dem ersten Versand prüfen lassen (E12). Alternative ist APA-OTS **[offen: Budget E10]**.
- **Offenlegung:** Ökovolt verkauft Photovoltaik. Das steht im Pressetext unter „Über Ökovolt“. Bei Storys mit Netzbetreibern die Beteiligung der Salzburg AG (49 %) offenlegen.
- **CC-BY-Pflicht:** Werden GeoSphere-, RIS- oder Energy-Charts-Daten gezeigt, die Quelle immer nennen.
- **Nach dem Versand:** Den Text im Newsroom (`/presse`, über das Backoffice) veröffentlichen. Die URL wird mit `node scripts/indexnow.mjs` gemeldet, siehe `src/lib/kanaele/veroeffentlichungen.js`. Im Google-Profil einen Beitrag setzen (Abschnitt 4).
- **Kontaktadressen** der Medien stehen hier bewusst **nicht**. Vor dem Versand die Redaktionsadresse aus dem Impressum bzw. der Kontaktseite des Mediums erfassen.

### Story 1: Schneelast-Karte Österreich (**Versand bis Di 06.10.2026**)
- **Landingpage:** `https://www.oekovolt.com/schneelast` und `/schneelast/[bundesland]`. **Voraussetzung:** live 200 (Abschnitt 1) sowie M01 und M12 aus den Paketen P1 und P6.
- **Kernaussagen** (von der Seite, Stand 30.09.2026):
  - Ökovolt hat für jeden Punkt Österreichs bis 2.000 m einen **50-jährlichen Schneelast-Richtwert** berechnet: 1-km-Raster, Winter seit 1961/62, Extremwertverteilung GEV über L-Momente.
  - Median der Bezirkshauptorte je Bundesland: Tirol 2,1 kN/m², Kärnten 1,7, Salzburg 1,7, Vorarlberg 1,5, Oberösterreich 1,3, Steiermark 1,2, Niederösterreich 0,7, Burgenland 0,6, Wien 0,6 (23 Bezirke).
  - Höchster Bezirkshauptort: Hermagor-Pressegger See mit 3,9 kN/m². Niedrigster: Krems an der Donau mit 0,4 kN/m².
  - Standardmodule mit 2.400 Pa Prüflast reichen auf einem 30°-Dach ohne Schneefang rechnerisch bis zu einem Richtwert von rund 1,5 kN/m². In Tirol, Kärnten und Salzburg liegt schon der **Median** der Bezirkshauptorte darüber.
  - Seit der ÖNORM B 1991-1-3:2022 gibt es keine Schneelastzonen mehr. Den Normwert zeigt eHORA.
- **Pflichtsatz:** „Richtwert, kein Normwert nach ÖNORM B 1991-1-3, ersetzt keine Statik. Normwert in eHORA (hora.gv.at).“
- **Datenbasis:** GeoSphere Austria, SNOWGRID-CL v2.1 (CC BY 4.0), eigene Auswertung.
- **Zeitpunkt:** vor dem ersten Schnee und vor Montagen im Herbst. Kein Bezug zu einem Unglücksfall.
- **Pressetext-Entwurf:** [pressetext-story1-schneelast.md](vorlagen/pressetext-story1-schneelast.md).

### Story 2: OeMAG-Marktpreis – 32 Monatswerte (Versand nach Veröffentlichung des Septemberwerts, Ziel bis 16.10.2026)
- **Landingpage:** `https://www.oekovolt.com/einspeisung-gewerbe`
- **Kernaussagen** (Seite, Stand 30.09.2026):
  - Alle OeMAG-Monatswerte für PV seit Jänner 2024 mit Quelle.
  - August 2026: 8,997 ct/kWh netto.
  - Rechnerischer Korridor Okt.–Dez. 2026: 8,761–14,874 ct/kWh; Quartalspreis der E-Control für Q4 2026: 15,282 ct/kWh.
  - Seit 2026 gibt es einen Abzug von 0,408 ct/kWh für Ausgleichsenergie.
  - Die OeMAG nimmt nur Anlagen unter 500 kWp ab.
- **Vor dem Versand:** den Septemberwert auf der Seite nachtragen (M27) und alle Zahlen neu gegen OeMAG und E-Control prüfen.
- **Zielgruppe:** Wirtschafts-, Gewerbe- und Landwirtschaftsmedien.

### Story 3: Freiflächen-PV – neun Länder, neun Regeln (November 2026)
- **Landingpage:** `https://www.oekovolt.com/freiflaechen-photovoltaik/widmung` und Landesseiten
- **Kernaussagen** (RIS, geprüft am 30.09.2026):
  - Die Schwellen für eine eigene Widmung oder Zone reichen von „über 35 m² Modulfläche“ (Burgenland) bis „keine eigene PV-Widmung im Grünland“ (Wien).
  - Niederösterreich hat 116 Zonen im Sektoralen Raumordnungsprogramm, die Steiermark 36 Vorrangzonen.
  - Kärnten begrenzt eine zusammenhängende Widmungsfläche grundsätzlich auf 4 ha.
- **Vor dem Versand:** eine fachliche und rechtliche Prüfung (E12), Stand-Datum aktualisieren.
- **Zielgruppe:** Gemeinden, Landwirtschaft, Raumplanung.

### Story 4: Netzanmeldung bei den fünf größten Netzbetreibern (Jänner 2027 bzw. sobald der nächste Fördercall feststeht)
- **Landingpage:** `https://www.oekovolt.com/netzanmeldung` und `/netzanmeldung/[betreiber]`
- **Kernaussagen:**
  - Auswahl nach Zählpunkten laut Smart-Meter-Bericht 2025 der E-Control (Ende 2024): Wiener Netze 1.646.935, Netz NÖ 945.234, Netz OÖ 736.171, Energienetze Steiermark 524.795, Salzburg Netz 465.566.
  - Portale, Unterlagen und Einspeisezählpunkt im Vergleich.
  - Frist bei Anlagen bis 20 kW: 4 Wochen (laut Seite).
- **Offenlegung:** Die Salzburg AG hält 49 % an Ökovolt. Das gehört in den Pressetext, weil Salzburg Netz Teil des Vergleichs ist.
- **Vor dem Versand:** alle Angaben je Netzbetreiber neu abrufen.

### Story 5: Börsenstrom 2026 – Jahresauswertung für PV-Betreiber (Jänner 2027)
- **Landingpages:** `https://www.oekovolt.com/energie-live` und `/pv-prognose`
- **Idee:** Eigene Auswertung der Day-Ahead-Preise der Gebotszone Österreich 2026: Stunden mit negativen Preisen, Mittagspreise gegenüber Abendpreisen, Monatsmittel. Datenbasis ist Energy-Charts (Fraunhofer ISE, CC BY 4.0), dieselbe Quelle wie `/energie-live`.
- **Status:** **Es gibt noch keine Zahlen.** Die Auswertung ab 01.01.2027 mit vollständigem Jahr 2026 erstellen; Methodik und Skript offenlegen. Bis dahin keine Aussagen.

### Medienliste (Auswahl; Adressen vor dem Versand aus dem Impressum erfassen)

| Medium | Ressort/Bezug | Story |
|---|---|---|
| APA-OTS (Verbreitung, kostenpflichtig) | Pressemitteilung an alle Redaktionen | 1–5, Budget E10 |
| ORF Landesstudios Oberösterreich, Salzburg, Tirol, Kärnten, Vorarlberg | Regionalnachrichten, Wetter | 1, 3 |
| Oberösterreichische Nachrichten, Salzburger Nachrichten, Tiroler Tageszeitung, Kleine Zeitung, Vorarlberger Nachrichten, Niederösterreichische Nachrichten | Regional, Wirtschaft, Bauen und Wohnen | 1, 2, 3 |
| Der Standard, Die Presse, Kurier | Wirtschaft, Wissenschaft, Immobilien | 1, 2, 5 |
| MeinBezirk (Bezirksrundschau), Tips | Lokal, besonders Innviertel und Flachgau | 1, 4 |
| Holzkurier, Österreichische Bauzeitung, Solid, Architektur & Bau Forum | Bau, Holzbau, Dach | 1 |
| Holzbau Austria, Bundes- und Landesinnungen Dachdecker/Spengler (Mitgliederinfos) | Fachinformation | 1 |
| pv magazine, oekonews.at, Elektrojournal | PV- und Energie-Fachmedien | 1, 2, 4, 5 |
| PV&B Austria (Verbandsnews; Ökovolt ist Mitglied) | Branche | 1, 2 |
| KOMMUNAL (Gemeindebund) | Gemeinden | 3, 4 |
| Landwirt, BauernZeitung, Blick ins Land | Landwirtschaft | 2, 3 |
| trend, Die Wirtschaft, WKO-Landeszeitungen (z. B. Oberösterreichische Wirtschaft, Salzburger Wirtschaft) | Wirtschaft, Gewerbe | 2, 4, 5 |

**Protokoll:** Für jeden Versand Medium, Ansprechperson, Datum, Antwort und Veröffentlichung mit URL festhalten. Veröffentlichungen fließen in den Messplan (Abschnitt 14).

---

## 12. Kunden-Freigaben für die Kundenbühne (M30)

- **Ausgangslage:** `src/data/kunden.js` enthält 52 Kundeneinträge, alle mit `freigabe: { zitat: false, logo: false }`. Zitat und Logo erscheinen erst nach Freigabe (Logik in `src/lib/kundenbuehne.js`).
- **Freigabe:** schriftlich (E-Mail genügt) und **getrennt** für Porträttext, Zitat mit Name und Funktion sowie Logo. Jederzeit widerrufbar.
- **Keine Gegenleistung für ein Zitat.** Ein bezahltes oder vergütetes Testimonial müsste als Werbung gekennzeichnet werden (UWG).
- **Siegel:** Das Solar-Siegel darf der Kunde einbauen, muss es aber nicht. Der Einbau-Code verlinkt bewusst mit `rel="nofollow"` (`src/lib/kundenbuehne.js`). Dabei bleibt es.
- **Ablauf:**
  1. Die Projektleitung verschickt die Mail aus [kunden-freigabe-mail.md](vorlagen/kunden-freigabe-mail.md).
  2. Die Antwort wird abgelegt.
  3. Das Backoffice bzw. `kunden.js` setzt `freigabe.zitat` oder `freigabe.logo` auf `true` und trägt das Zitat samt Datum ein.
- **Nachweis:** Anzahl der angefragten Kunden, Anzahl der Freigaben, abgelegte Freigabe-Mails.

---

## 13. Bewertungen: ohne Anreize, ohne Vorauswahl

**Quellen:**
- Google, [Richtlinie zu gefälschten Interaktionen](https://support.google.com/contributionpolicy/answer/7400114?hl=de). Verboten sind:
  - „Anreize bieten, etwa Zahlungen, Rabatte, kostenlose Produkte und/oder Dienstleistungen, für das Veröffentlichen einer Rezension“
  - „Negative Rezensionen verhindern oder verbieten oder Kunden gezielt um positive Rezensionen bitten“
- UWG in der Fassung nach der Richtlinie (EU) 2019/2161: gefälschte oder beauftragte Bewertungen sind unlauter.

**Regeln:**
1. **Alle** Kunden bekommen nach der Abnahme bzw. Inbetriebnahme **dieselbe** Bitte ([bewertungsanfrage.md](vorlagen/bewertungsanfrage.md)). Es gibt keine Vorabfrage nach Zufriedenheit und keine Weiterleitung nur der Zufriedenen („Review Gating“).
2. Keine Rabatte, Gutscheine, Gewinnspiele, Spenden je Bewertung und keine Wartungsgutschrift.
3. Keine Bewertungen von Mitarbeitenden, Gesellschaftern, Familie, Agentur oder Partnerbetrieben.
4. Bewertungen nicht selbst verfassen und nicht vorformulieren.
5. Auf jede Bewertung innerhalb einer Woche sachlich antworten, ohne personenbezogene Details.
6. Die alten Bewertungs-Bausteine auf der Website entfernt Paket P5 (`googlereview.js`, `reviews.js`). Bewertungen werden nicht als eigenes Schema-Markup ausgezeichnet.

**Nachweis:** Vorlage und Prozessbeschreibung liegen vor. Stichprobe nach drei Monaten: Anfragen gesamt gegenüber eingegangenen Bewertungen, ohne Filter.

---

## 14. Messplan

| Werkzeug | Kennzahl | Ausgangswert (T0) | Prüftermine | Anmerkung |
|---|---|---|---|---|
| Google Search Console | Klicks, Impressionen, CTR und Position je Seitengruppe: Schneelast, Netzanmeldung, Einspeisung/OeMAG, EAG-Fördercall, Widmung, Bundesland-Hubs, Hersteller | Export am Tag der Bestätigung (Abschnitt 3.2) | +4, +8 und +12 Wochen, dann monatlich | M13: 4 Wochen CTR nach dem Titelwechsel beobachten |
| Google Search Console | Indexierung („Seiten“): indexiert/nicht indexiert; Sitemap: eingereicht/indexiert | nach dem Deploy | wöchentlich im ersten Monat | Ziel: alle Seiten der Sitemap indexiert, keine 404 aus der Sitemap |
| Google Search Console | Links: verweisende Domains, Top-Linkziele | T0 | nach jeder Story (+2 Wochen) | Wirkung der Datenstorys |
| Bing Webmaster Tools | Suchleistung, Indexierung, IndexNow-Meldungen, Backlinks | T0 | wie oben | IndexNow-Status 200/202 laut Skriptausgabe |
| Google-Unternehmensprofil | Aufrufe, Anrufe, Routen, Website-Klicks; Anzahl und Schnitt der Bewertungen | nach der Übernahme | monatlich | keine Bewertungsziele mit Anreizen |
| Bing Places, Apple Business | Aufrufe und Aktionen, soweit angezeigt | nach dem Anlegen | quartalsweise | |
| **SISTRIX** | Sichtbarkeitsindex AT, Rankings je Keyword laut `keyword-map.tsv`, Links, KI-Sichtbarkeit (AI-Tracker) | **erst nach Autorisierung** | monatlich | **E11:** Der SISTRIX-Connector in claude.ai ist nicht autorisiert (OAuth fehlt). Autorisieren unter claude.ai → Einstellungen → Connectors → SISTRIX (Toolbox-Login). Erst dann lassen sich Suchvolumina, E7 und KI-Sichtbarkeit messen |
| Presse-Protokoll | Veröffentlichungen, erwähnte oder verlinkte Landingpage | – | nach jeder Story | ohne Link zählt die Erwähnung trotzdem (Marke, Entität) |

**Berichtsform:** eine Tabelle pro Prüftermin mit Werten, Veränderung zu T0 und Ursache, soweit belegbar. Ursachen nur nennen, wenn der zeitliche Zusammenhang eindeutig ist. Keine Hochrechnungen.

---

## 15. Abnahme P7 (aus dem Plan) und Nachweis

| Abnahmekriterium laut Plan | Vorbereitet in | Nachweis durch den Auftraggeber | Status |
|---|---|---|---|
| Search Console und Bing Webmaster per DNS verifiziert, Sitemap eingereicht | Abschnitt 3 | Screenshots „bestätigt“ und Sitemap-Status | ◐ |
| Google-Profil geprüft (Name ohne Zusatzwörter, Kategorie „Solarenergieunternehmen“, 9 Bundesländer als Einzugsgebiet) | Abschnitt 4 | Screenshot. **Einzugsgebiet:** Abweichung wegen der Zwei-Stunden-Richtlinie, Entscheidung offen | ◐ |
| Bing Places und Apple Business Connect angelegt | Abschnitte 5, 6 | Screenshots „veröffentlicht“/„verifiziert“ | ◐ |
| Herold, Cylex und Gemeinde angeschrieben | Abschnitt 7, Vorlage A–D | Verzeichnis-Protokoll mit Datum | ◐ |
| Story 1 bis 06.10. versendet | Abschnitt 11, Pressetext | Versandprotokoll. **Voraussetzung:** `/schneelast` live 200 | ◐ |
| Wikidata mit Offenlegung angelegt | Abschnitt 10, Vorlage | Q-ID und Benutzerseite mit Offenlegung. **Voraussetzung:** Freigabe E10 | ◐ |
| Installateur-Programme der Hersteller geklärt | Abschnitt 9, Vorlage | schriftliche Antworten der vier Hersteller | ◐ |
| Bewertungen ohne Anreize und ohne Vorauswahl | Abschnitt 13, Vorlage | Prozess bestätigt, Stichprobe nach 3 Monaten | ◐ |

---

## 16. Offene Punkte beim Auftraggeber

- **E6:** verbindliche Öffnungszeiten, Verhältnis zur ÖKOVOLT Energietechnik GmbH in Lochau (FN 261840 i; Herold führt sie mit office@oekovolt.at und oekovolt.com), X-Handle, Büro Salzburg, CO₂-Zeitraum, Einheit MW oder MWp.
- **E10:** Wer pflegt Google-Profil, Bing und Apple und fragt Bewertungen an? Freigabe für Wikidata. Budget für APA-OTS.
- **E11:** SISTRIX-Connector autorisieren.
- **E12:** rechtliche Prüfung der Presse-Mails (TKG/DSGVO) und von Story 3.
- **Einzugsgebiet Google-Profil:** Soll die Zwei-Stunden-Richtlinie gelten (Empfehlung) oder das Planziel „9 Bundesländer“?
- **Technik:** Deploy des aktuellen Stands vor dem 05.10. (`/schneelast`, `/presse`, IndexNow-Schlüssel). Beim Hoster: Weiterleitungen und `eigenverbrauch.at` (Abschnitt 8). DNS-Zugang.
- **Pressekontakt:** Name und Funktion für den Pressetext. Zitat der Geschäftsführung nur im freigegebenen Wortlaut.

## 17. Quellen (abgerufen am 30.09.2026)

- Google Search Console – Inhaberschaft bestätigen (DNS): https://support.google.com/webmasters/answer/9008080?hl=de
- Google Unternehmensprofil – Richtlinien: https://support.google.com/business/answer/3038177?hl=de · Einzugsgebiet: https://support.google.com/business/answer/9157481?hl=de · Beschreibung: https://support.google.com/business/answer/13682007?hl=de
- Google – Richtlinie zu gefälschten Interaktionen (Rezensionen): https://support.google.com/contributionpolicy/answer/7400114?hl=de
- Bing Webmaster Tools – Add and verify site: https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b · Domain Connect: https://blogs.bing.com/webmaster/august-2019/Bing-Webmaster-Tools-simplifies-site-verification-using-Domain-Connect
- IndexNow – Dokumentation: https://www.indexnow.org/documentation
- Apple Business – Registrierung und Verifizierung: https://support.apple.com/guide/business/sign-up-and-verify-your-organization-axm402206497/web
- Fronius System Partner (AT): https://www.fronius.com/de-at/austria/solarenergie/installateure-partner/service-support/fronius-system-partner
- Huawei FusionSolar – Find Installers / Partner-Karte: https://solar.huawei.com/en/find-installer/ · https://solar.huawei.com/partners/map
- BYD Battery-Box – Be Partner: https://www.bydbatterybox.com/byd-partner
- Sigenergy – Installer Program / Installer Map: https://www.sigenergy.com/en/service/installer_program · https://www.sigenergy.com/en/order/installer_map
- Wikidata – Notability, Disclosure of paid editing, Self-promotion: https://www.wikidata.org/wiki/Wikidata:Notability · https://www.wikidata.org/wiki/Wikidata:Disclosure_of_paid_editing · https://www.wikidata.org/wiki/Wikidata:Self-promotion
- Verzeichnis-Einträge: siehe Links in Abschnitt 7
- Eigene Landingpages (lokal geprüft am 30.09.2026): `/schneelast`, `/einspeisung-gewerbe`, `/freiflaechen-photovoltaik/widmung`, `/netzanmeldung`, `/forderungen/eag-foerdercall`, `/energie-live`, `/pv-prognose`
