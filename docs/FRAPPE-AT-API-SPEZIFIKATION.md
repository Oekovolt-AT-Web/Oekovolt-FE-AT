# Frappe-Backoffice für oekovolt.com (AT) – vollständige API-Spezifikation

Stand 29.09.2026, ergänzt 30.09.2026 (Kundenbühne-Felder bei #1/#2, Heatmap #15/#16) und 12.10.2026
(Welle A11: Abschnitt 3a „Vertrieb“ mit Kernschema, Lead-Scoring und Kundenmails, Felder bei #4/#5/#6/#8,
Abschnitt 3b „Rechner Lead“ mit Double-Opt-in #17–#19), Branch `at-launch`. Abgeleitet aus dem tatsächlichen Code der Website (nicht aus Annahmen).
Ziel: Ein neues/österreichisches Frappe-Backoffice so bauen, dass die Website **ohne Code-Änderung** läuft.

## 0. Grundregeln

- Aufruf immer `${SERVER}/api/method/<dotted.path>`; die Pfade unten **exakt** so anlegen
  (App-Namen `oekovolt_app` und `oekovoltdeutchland`, Modul-Unterordner wie angegeben).
  Andere Namen gehen nur mit Änderungen in der Website.
- Auth: Header `Authorization: token KEY:SECRET`. Welcher Key: siehe Spalte „Auth“.
  Ausnahme: `buche_termin` wird **ohne** Auth aufgerufen → `@frappe.whitelist(allow_guest=True)`.
- Antwort: normales Frappe-JSON, die Website liest immer `message`.
- Fehler: `frappe.throw(...)` (ValidationError/MandatoryError) → die Website zeigt den ersten Text aus
  `_server_messages` dem Nutzer (HTTP 422). Text mit „nicht mehr verfügbar“ → 409 (Termin belegt).
  HTTP 429 wird durchgereicht, alles andere → 502.
- Jeder schreibende Aufruf enthält zusätzlich `ip_adresse` (vom Next-Server gesetzt).
- Honeypot: Feld `website` – ist es nicht leer, Anfrage still verwerfen (Erfolg zurückgeben, nichts speichern).
- Bilder:
  - Felder vom Typ Attach Image liefern `/files/...` → die Website holt sie **ohne Auth** über
    `GET ${SERVER}/files/...` → Dateien müssen **öffentlich** sein (`is_private = 0`).
  - `bild_url` bei Projekten ist eine **absolute URL**. Erlaubt ist nur der Host `backoffice.oekovolt.com`
    (`next.config.mjs` → `images.remotePatterns`). Anderer Host = eine Zeile in der Website ergänzen.
- Caching auf der Website: Inhalte `revalidate: 600` (max. 10 Min. bis sichtbar), Kalender `no-store`.

## 1. Übersicht – was gebaut werden muss

| # | Methode | Art | Auth | Status |
|---|---|---|---|---|
| 1 | `oekovolt_app.website_api.projekte.get_projekte` | GET | API_KEY | **muss** – Referenzen, Startseite, Sitemap |
| 2 | `oekovolt_app.website_api.projekte.get_projekt` | GET | API_KEY | **muss** – Projekt-Detailseite |
| 3 | `oekovolt_app.website_api.projekte.get_referenzkarte` | GET | API_KEY | sollte – Karte hat Fallback |
| 4 | `oekovolt_app.website_api.kontakt.submit_kontakt` | POST JSON | API_KEY | **muss** – Kontakt, 11 Service-Seiten, Award, Sponsoring, Partner |
| 5 | `oekovolt_app.website_api.angebot.submit_angebot` | POST JSON | API_KEY | **muss** – Konfigurator `/angebot` |
| 6 | `oekovolt_app.website_api.termin.buche_termin` | POST JSON | **Gast** | **muss** – `/termin` + Rückruf-Widget auf jeder Seite |
| 7 | `oekovolt_app.website_api.termin.get_kalender` | GET | API_KEY | sollte – sonst lokale Ersatz-Slots |
| 8 | `oekovolt_app.website_api.solarrechner.submit_solarrechner` | POST multipart | API_KEY | **muss** – PDF-Analyse im Solarrechner |
| 9 | `oekovoltdeutchland.oekovoltdeutchland.doctype.stromspeicher_page.api.get_strom_page_with_keywords` | GET | API_KEY | sollte – statischer Fallback vorhanden |
| 10 | `oekovoltdeutchland.oekovoltdeutchland.doctype.waermepumpe_page.api.get_waermepumpe_page_with_keywords` | GET | API_KEY | **muss** – sonst 404 auf allen `/produkte/warmepumpe/<slug>` |
| 11 | `oekovoltdeutchland.oekovoltdeutchland.doctype.hersteller.api.get_hesteller_by_name` | GET | API_KEY | sollte – Herstellerdetails (Tippfehler „hesteller“ ist Absicht) |
| 12 | `…doctype.solar_lead.api.*` (7 Methoden) | POST JSON | KONTAKT_API_KEY | **muss** – Foto-Upload per QR. **Code fertig** in `Import-Frappe/` |
| 13 | `…doctype.veroeffentlichung.api.*` (16 Methoden) | POST JSON | KANAL_API_KEY | **muss** – `/presse`, RSS, `/tv`, Push, Fediverse. **Code fertig** in `Import-Frappe/` |
| 14 | `…doctype.hinweis.api.*` (4 Methoden) | POST JSON | HINWEIS_API_KEY | optional – nur wenn `HINWEIS_INTERN=1`, sonst IntegrityLine. **Code fertig** |
| 15 | `oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.api.erfassen` | POST JSON | API_KEY | sollte – Heatmap-Sammler (nur mit Einwilligung „Statistik“); ohne Backoffice verwirft die Website still (204). Siehe Abschnitt 5a |
| 16 | `oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.api.auswertung` | POST JSON | API_KEY | optional – Heatmap-Ansicht `?heatmap=<HEATMAP_TOKEN>`. Siehe Abschnitt 5a |
| 17 | `oekovolt_app.website_api.rechner.submit_rechner_lead` | POST JSON | API_KEY | **muss** – Lead-Gate der Rechner/Auswertungen (A09 `/api/rechner_lead`). Abschnitt 3b |
| 18 | `oekovolt_app.website_api.rechner.sende_bestaetigung` | POST JSON | **Gast** | **muss** – „Erneut senden“ der Bestätigungsmail. Abschnitt 3b |
| 19 | `oekovolt_app.website_api.rechner.bestaetige_lead` | POST JSON | **Gast** | **muss** – Link aus der Bestätigungsmail (`/freischalten?token=…`). Abschnitt 3b |

**Nicht bauen** (in der Website nur toter Code, von keiner Seite genutzt):
`photovoltaikanlage_page…get_photovoltaik_page_with_keywords`, `hersteller_page…get_hersteller_page_with_keywords`,
`hersteller.api.get_icon_partners`, `team.api.teamde_data`, `projekte.api.projektede_data`,
`partners.api.partnersde_data`, `jobs.api.jobsde_data`, `primary_page…team_page.api.get_team_page`,
`primary_page…card_contact_redirection.api.get_card_contact`, `kontakt.api.create_contact`.
Team und Jobs sind statisch (`src/data/stellen.js`), die Kennzahlen auf der Startseite ebenso (`src/data/hero.js`).

**In `Import-Frappe/` enthalten, aber von der AT-Website nicht aufgerufen:** DocTypes `Beratungstermin` und
`PV Analyse` (die Website nutzt stattdessen #6/#7 und #8). `Rueckruf` wird trotzdem gebraucht, weil
`solar_lead/api.py` daraus `herkunft_felder, nur_webformular, team_benachrichtigen, text` importiert.

---

## 2. Projekte / Referenzen (#1–#3)

### DocType „Projekt“ (Vorschlag, App `oekovolt_app`)

| Feld | Typ | Hinweis |
|---|---|---|
| `projekt_name` | Data, Pflicht | Titel. URL-Slug = kleingeschrieben, Umlaute ersetzt, Leerzeichen → `-` („Mindelheim 2“ → `mindelheim-2`) |
| `projekt_website_name` | Data, eindeutig | z. B. `haydu-2`. **Startseite zeigt nur Projekte, bei denen das Feld gesetzt ist.** Schlüssel für #2 |
| `veroeffentlicht` | Check | nur veröffentlichte ausliefern |
| `leistung` | Float | kWp, für Sortierung/Summen |
| `leistung_label` | Data | Anzeigetext, z. B. „314,5 kWp“ (kann aus `leistung` berechnet werden) |
| `jahr` | Int | |
| `ort`, `plz`, `land` | Data | `land` z. B. „Österreich“ |
| `objekt` | Select | exakt `Gewerbe` / `Landwirtschaft` / `Einfamilienhaus` (Texte auf der Detailseite hängen davon ab) |
| `dach` | Data | Dachart |
| `bild` | Attach Image | → als `bild_url` **absolut** ausliefern (`frappe.utils.get_url(bild)`) |
| `bild_alt` | Data | |
| `bilder` | Table „Projekt Bild“ (`bild` Attach Image) | → als `bilder: [{bild_url}]` absolut ausliefern |
| `modul`, `wechselrichter`, `speicher` | Data | Technik-Tabelle |
| `ertrag` | Float | kWh/Jahr; leer → Website rechnet kWp × 1050 |
| `latitude`, `longitude` | Float | für Karte und Schema |

**Ergänzung 30.09.2026 – Kundenbühne** (Porträt, Solar-Siegel, Social-Kit, ESG-Kurzbericht; umgesetzt in
`Import-Backend-Frappe/apps/oekovolt_app`, Details `Import-Backend-Frappe/apps/oekovolt_app/README.md`, Abschnitt „Kundenbühne“):

| Feld | Typ | Hinweis |
|---|---|---|
| `website_url`, `linkedin`, `instagram`, `facebook`, `youtube`, `xing`, `tiktok`, `x` | Data (URL) | nur `https://`, sonst Fehler beim Speichern |
| `branche` | Data | |
| `portraet` | Text | Kundenporträt in eigenen Worten |
| `portraet_quellen` | Small Text | eine `https://`-Adresse je Zeile |
| `zitat`, `zitat_person` | Data/Text | nur mit `freigabe_zitat` ausgeliefert |
| `freigabe_zitat` | Check | wird nicht ausgeliefert; Freigabe ohne Zitat nicht speicherbar |
| `logo` | Attach Image (öffentlich) | → `logo_url` absolut, nur mit `freigabe_logo` |
| `freigabe_logo` | Check | wird nicht ausgeliefert; Freigabe ohne Logo nicht speicherbar |

Die Website nutzt diese Felder vorrangig; fehlen sie, greift der statische Stand `src/data/kunden.js`
(`src/lib/kundenbuehneServer.js`).

### #1 `get_projekte` – GET, keine Parameter

```json
{ "message": {
    "projekte": [ { "projekt_name": "Haydu 2", "projekt_website_name": "haydu-2", "leistung": 314.5,
                    "leistung_label": "314,5 kWp", "jahr": 2024, "ort": "Salzburg", "land": "Österreich",
                    "objekt": "Gewerbe", "dach": "Flachdach", "bild_url": "https://backoffice.oekovolt.com/files/x.jpg",
                    "bild_alt": "…", "modified": "2026-09-01 10:00:00" } ],
    "anzahl": 1, "summe_kwp": 314.5 } }
```
Wichtig: Immer die Form `message.projekte` liefern (Detailseite und Karte akzeptieren nur diese).
Leere Liste → Startseite blendet Referenzen aus, **jede Projekt-Detailseite wird 404**.
Die Slugs der bisherigen Live-Seite (z. B. `alpla-werke-alwin-lehner-gmbh-co-kg`) müssen über `projekt_name` wieder entstehen.
Ergänzung Kundenbühne: jedes Projekt zusätzlich mit `website_url` und `branche` (neben `jahr`).

### #2 `get_projekt` – GET `?projekt_website_name=haydu-2`

`message` = ein Objekt mit allen Feldern aus #1 **plus** `bilder`, `plz`, `modul`, `wechselrichter`, `speicher`,
`ertrag`, `latitude`, `longitude`. Wird verworfen, wenn `message.projekt_website_name` fehlt.
Ergänzung Kundenbühne: zusätzlich `website_url`, `branche`, `linkedin` … `x` (je `null`, wenn leer), `portraet`,
`portraet_quellen` (Liste, `[]` wenn leer), `zitat`/`zitat_person` (nur mit Freigabe, sonst `null`),
`logo_url` (absolut, nur mit Freigabe, sonst `null`). Nicht gefunden → `{}`.

### #3 `get_referenzkarte` – GET, keine Parameter

```json
{ "message": {
    "firmensitz": { "name": "Ostermiething", "latitude": 48.05, "longitude": 12.83, "beschreibung": "…" },
    "orte": [ { "ort": "Salzburg", "plz": "5020", "latitude": 47.8, "longitude": 13.04, "land": "Österreich",
                "entfernung_km": 35.2, "im_umkreis": true, "anzahl_projekte": 2,
                "projekte": [ { "projekt_name": "…", "projekt_website_name": "…", "leistung_label": "…" } ] } ],
    "umkreis_km": 100, "anzahl_im_umkreis": 12 } }
```
Gruppierung der veröffentlichten Projekte nach `ort`; Entfernung per Haversine zum Firmensitz.

---

## 3. Formulare (#4, #5, #8)

### #4 `submit_kontakt` – POST JSON → DocType „Kontaktanfrage“

| Feld | Typ / Werte |
|---|---|
| `thema` | Select/Data: `Gewerbe & Industrie`, `Freifläche & Agri-PV`, `Landwirtschaft`, `Gemeinde`, `Speicher & Laden`, `Service & Wartung`, `Energiegemeinschaft`, `Presse`, `Sonstiges`, `Photovoltaik`, `Stromspeicher`, `PV Award – Einreichung`, `Sponsoring-Anfrage`, `Elektro-Partner – Registrierung` oder leer → Data verwenden, nicht Select |
| `vorname`, `nachname`, `email` | Data, Pflicht |
| `telefon` | Data, **optional** (seit A11); Pflicht nur mit `rueckruf_ok = 1`. Ist es gesetzt, muss es sich nach E.164 normalisieren lassen (AT/DE/CH wie die Website, sonst mit Ländervorwahl); gespeichert als E.164 |
| `strasse_hausnummer` | Data, **darf leer sein** (Award, Sponsoring) |
| `plz` | Data, **4–5 Ziffern** (AT hat 4) |
| `ort` | Data |
| `nachricht` | Long Text, bis 8000 Zeichen (Firma, Zusatzfelder, Kampagnen-Herkunft stehen als Zeilen „Label: Wert“ darin) |
| `einwilligung` | Check (1/0) – oder statt des Häkchens ein angezeigter Hinweistext: `einwilligung_id` endet auf `-info` (Art. 6 Abs. 1 lit. b DSGVO) |
| `quelle` | Data (Seitenpfad), **bis 255 Zeichen** (die Website erlaubt 200) |
| `ip_adresse` | Data |
| `website` | Honeypot, nicht speichern |
| *optional (A08/A11)* `firma`, `zeitplan`, `jahresverbrauch`, `rueckruf_ok`, `segment`, `rolle`, `gremium[]`, `einwilligung_id`, `einwilligung_version` | Vertriebsfelder, siehe Abschnitt 3a. `jahresverbrauch` = Chip-Wert (`unter 100 MWh`, `100–500 MWh`, `500–2.000 MWh`, `über 2.000 MWh`, `weiß nicht`) |

Antwort wird nicht gelesen; 2xx = Erfolg. Die Team-Benachrichtigung kommt aus `lead_eingang.after_insert`
(Routing, Score, SLA – `docs/frappe-lead-routing/README.md`), die Eingangsbestätigung an den Kunden aus `kontakt.py`
(Abschnitt 3a, „Kundenmails“).

### #5 `submit_angebot` – POST JSON → DocType „Angebotsanfrage“

| Feld | Typ / Werte |
|---|---|
| `vorhaben` | **Array** aus `pv`, `freiflaeche`, `speicher`, `wallbox`, `waermepumpe`, `notstrom`, `service` → als Text/JSON speichern |
| `gebaeudetyp`, `eigentuemer`, `dachform`, `dachausrichtung`, `startzeitpunkt` | Data (Klartext-Labels) |
| `jahresverbrauch_kwh` | Float |
| `vorname`, `nachname`, `email`, `telefon`, `plz`, `ort` | Data |
| `einwilligung` | Check |
| `ergebnis` | **Objekt** `{berechnungsbasis_kwh, anlagengroesse_kwp, speicher_kwh, jahresertrag_kwh, autarkie_prozent, vorteil_pro_jahr, investition_von, investition_bis, amortisation_jahre, angaben}` – Werte können `null` sein (Gewerbe). Als eigene Felder oder JSON speichern |
| `nachricht` | Long Text (= `ergebnis.angaben`) |
| `ip_adresse`, `website` | wie oben |
| `telefon` | seit A11 **optional** wie bei #4 (Pflicht nur mit `rueckruf_ok = 1`), E.164 |
| *optional (A08/A11)* `objekt` | `gewerbe`, `landwirtschaft`, `freiflaeche`, `hotellerie`, `gemeinde`, `chalet`, `privat`, `sonstiges` → setzt `segment`, wenn keins gesendet wird |
| `netzebene` | `7`, `6`, `5`, `4`, `unbekannt` |
| `lastgang` | `ja`, `nein`, `unbekannt` → Check `lastgang_vorhanden` |
| `flaeche_m2`, `kwp_wunsch` | Zahl > 0 (max. 10 Mio. m² bzw. 100.000 kWp) |
| `zweck` | `angebot`, `beschlussvorlage`, `zweitmeinung`, `foerderung`, `finanzierung`, `netzanmeldung`, `wartung`, `ausschreibung` |
| `thema` | `netzanmeldung`, `beschlussvorlage`, `lastgang`, `speicher`, `ladeinfrastruktur`, `notstrom`, `repowering`, `wartung`, `foerderung`, `finanzierung`, `zweitmeinung` |
| `bezug` | Website-Referenz der Anfrage, z. B. `AK-20261011-7F3K` (verknüpft Anfrage, Termin, Lastgang-Analyse) |
| `lastgang_kennzahlen` | Objekt, nur `jahresverbrauch_kwh`, `grundlast_kw`, `spitzenlast_kw`, `wochenendanteil_prozent`, `deckungsgrad_prozent`, `volllaststunden`, `messintervall_min`, `tage`, `monatsspitzen_kw[12]` – **keine Rohdaten** → Feld `lastgang_kennzahlen` (JSON) |
| `firma`, `zeitplan`, `rolle`, `gremium[]`, `rueckruf_ok`, `einwilligung_id`, `einwilligung_version` | Vertriebsfelder, Abschnitt 3a. Fehlt `zeitplan`, wird er aus `startzeitpunkt` abgeleitet |
| `vorbelegt[]` | optional: Felder, die der Kunde **nicht** selbst gewählt hat (Startwerte). Erlaubt: `zeitplan`, `startzeitpunkt`, `eigentuemer`, `jahresverbrauch_kwh`. Diese Felder werden weder gespeichert noch im Lead-Scoring gezählt |

Unbekannte Werte werden verworfen (Whitelist), nicht abgelehnt – ältere Website-Stände bleiben kompatibel.

### #8 `submit_solarrechner` – POST **multipart/form-data** → DocType „Solarrechner Anfrage“

Felder: `kunden_name`, `email`, `telefon` (Pflicht, E.164-Prüfung), `plz`, `ip_adresse`, `quelle` (z. B. `/solarrechner`,
bis 255 Zeichen), optional `herkunft` (Zeile „[Herkunft] Kanal: … · Quelle: …“ → `herkunft_kanal`, `utm_*`, `herkunft_referrer`,
`einstiegsseite`) und die Vertriebsfelder aus Abschnitt 3a (`firma`, `segment`, `rolle`, …), und Datei `pdf`
(`Oekovolt-PV-Analyse-PVA-2026-XXXXXX.pdf`, application/pdf). Datei aus `frappe.request.files["pdf"]` lesen,
**privat** anhängen (`is_private=1`), optional PDF per E-Mail an Kunden + Vertrieb. Antwort wird nicht gelesen.

> Achtung Website-Bug: `src/app/api/analyse/pdf/route.js:72` (und der Client) prüft `plz` mit `/^\d{5}$/` –
> österreichische 4-stellige PLZ werden abgelehnt. Muss in der Website auf `/^\d{4,5}$/` geändert werden.

---

## 3a. Vertrieb – Kernschema, Lead-Scoring, Kundenmails (Welle A11)

Gilt für **Kontaktanfrage, Angebotsanfrage, Rechner Lead, Solarrechner Anfrage und Website Termin**. Alle Felder sind
optional; fehlen sie im Website-Body, läuft alles wie bisher (Website-Fallbacks bleiben kompatibel). Routing, Dubletten,
SLA, Eskalation und Alarm stehen in **`docs/frappe-lead-routing/README.md`** (A06); Referenz-Freigaben der Kunden in
**`docs/frappe-referenzfreigabe/README.md`** (A07).

### Felder (Abschnitt „Vertrieb“ bzw. „Qualifizierung“ im DocType)

| Feld | Typ | Herkunft / Bedeutung |
|---|---|---|
| `segment` | Select: Gewerbe & Industrie, Landwirtschaft, Freifläche/Agri-PV, Hotellerie & Tourismus, Gemeinde & öffentliche Hand, Chalet & Premium, Privat, Service, Partner, Bewerbung, Presse, Sonstiges | Website (`segment` als Wert oder Schlüssel `gewerbe` …), `objekt` (#5), Kennung (#17); sonst `lead_eingang` (A06) aus Thema/Objekt |
| `firma` | Data (140) | Website; neu in Kontaktanfrage, Angebotsanfrage, Solarrechner Anfrage, Rechner Lead (Website Termin hatte es) |
| `bundesland` | Select (9 Bundesländer) | `bundesland_aus_plz(plz)` – PLZ-Bereichstabelle, nicht die erste Ziffer (5121 Ostermiething = Oberösterreich, 1300 = NÖ, 3335 Weyer = OÖ, 9900 Lienz = Tirol); 5-stellig → leer |
| `plz` | Data | wo es fehlte (Website Termin/Kontakt hatten es) |
| `lead_score` | Int, schreibgeschützt | 0–100, `lead_score(daten, quelle)` |
| `lead_klasse` | Select A/B/C, schreibgeschützt | A ≥ 70, B 45–69, C < 45 |
| `score_gruende` | Small Text, schreibgeschützt | eine Zeile je Punktequelle + Summe |
| `eingang_am`, `sla_bis`, `erstreaktion_am` | Datetime, schreibgeschützt | A06 (`lead_eingang`, `sla`) |
| `reaktionszeit_min` | Int, schreibgeschützt | Geschäftsminuten bis zur Erstreaktion (A06) |
| `zustaendig` | Link User | Routing (A06) oder wer den Status aus „Neu“ nimmt |
| `lead_schluessel` | Data, schreibgeschützt | `lead_schluessel(email)`: E-Mail klein/getrimmt, Gmail ohne Punkte/„+…“ |
| `fruehere_anfragen` | Small Text, schreibgeschützt | A06 (Dubletten 30 Tage) |
| `rueckruf_ok` | Check | Rückruf/Anruf erwünscht (Häkchen, Termin oder Rückrufwunsch). Der Vertrieb ruft nur dann an |
| `kontakt_ok` | Check | Lead-Gate: freiwilliges Häkchen „darf mich zu diesem Ergebnis kontaktieren“ |
| `einwilligung_id`, `einwilligung_text_version` | Data, schreibgeschützt | Kennung/Version des angezeigten Hinweis- bzw. Einwilligungstexts (Website `einwilligung_id`, `einwilligung_version`) |
| `rolle` | Select: Geschäftsführung/Inhaber, Finanzen, Technik/Facility, Einkauf, Gemeinde/Verwaltung, Landwirt/Eigentümer, Sonstiges | Website |
| `gremium` | Small Text | Website `gremium[]` (Geschäftsführung, Finanzen, Technik, Eigentümer/Vermieter, Hausbank, Gemeinderat), eine Zeile je Wert |
| `zeitplan` | Select: So bald wie möglich, In den nächsten 3 Monaten, In 3–12 Monaten, Später / Budgetplanung | Website; bei #5 sonst aus `startzeitpunkt` |
| `verlustgrund` | Select: Preis, Mitbewerber, Netzzusage/Netzebene, Kein Budget/verschoben, Nicht erreichbar, Dach/Fläche ungeeignet, Kein Bedarf, Sonstiges | Vertrieb; Pflicht bei Status „Verloren“ |

Zusätzlich: Angebotsanfrage `objekt`, `netzebene`, `lastgang_vorhanden`, `flaeche_m2`, `kwp_wunsch`, `zweck`, `thema`, `bezug`,
`lastgang_kennzahlen` (JSON); Kontaktanfrage `jahresverbrauch`; Solarrechner Anfrage `herkunft` + `herkunft_kanal`, `utm_*`,
`herkunft_referrer`, `einstiegsseite`; Website Termin dieselben Herkunftsfelder und `bezug`; Rechner Lead zusätzlich `utm_content`.
`quelle` hat überall die Länge 255.

**Status** (Kontakt-, Angebots-, Solarrechner-Anfrage, Rechner Lead): Neu → Kontaktversuch → Qualifiziert → Termin vereinbart →
Angebot erstellt → Verhandlung → Gewonnen | Verloren | Erledigt | Spam. Der Altwert „In Bearbeitung“ bleibt gültig.
Website Termin: Neu, Kontaktversuch, Bestätigt, Qualifiziert, Angebot erstellt, Verhandlung, Gewonnen, Verloren, Erledigt,
Abgesagt, Spam („Abgesagt“ gibt den Slot frei).

### Lead-Scoring (`format.lead_score`, Gewichte in der Konstante `SCORE_GEWICHTE`)

| Block (Deckel) | Kriterium | Punkte |
|---|---|---|
| FIT (max. 50) | Segment B2B (Gewerbe, Landwirtschaft, Freifläche, Hotellerie, Gemeinde) / Chalet / Privat | 20 / 12 / 5 |
| | Jahresverbrauch ≥ 500 MWh / 100–500 / 30–100 (Zahl, Lastgang-Kennzahl oder Kontakt-Chip) | 15 / 10 / 5 |
| | Netzebene 5 oder 6 | 8 |
| | Eigentümer (Konfigurator „Ja, Eigentümer“ oder Rolle „Landwirt/Eigentümer“) | 5 |
| ABSICHT (max. 35) | Zeitplan so bald wie möglich / ≤ 3 Monate / 3–12 Monate / später | 15 / 12 / 6 / 2 |
| | Lastgang vorhanden · Firma angegeben | je 5 |
| | Quelle Termin oder Scan / Konfigurator / PDF-Analyse / Rechner oder Kontakt | 10 / 8 / 6 / 4 |
| | Rolle Geschäftsführung/Inhaber oder Finanzen | 5 |
| ENGAGEMENT (max. 15) | weitere Anfrage mit gleichem Lead-Schlüssel in 90 Tagen (A06 zählt) · Gewerbe-Rechner · Einstieg über eine Zielgruppenseite (`/gewerbe`, `/landwirtschaft`, `/agri-pv`, `/kommunen`, `/chalets` …) | je 5 |

Service, Bewerbung und Presse laufen in einer eigenen Spur (0 Punkte, Klasse C, kein Alarm). Das Scoring priorisiert nur
die Bearbeitung im Vertrieb; es ist keine automatisierte Entscheidung gegenüber der Person (Art. 22 DSGVO).

### Kundenmails

- Kein Freitext aus der Anfrage (Nachricht, Thema-Freitext, Firma, Ort, Adresse, Ergebnistext): nur gehärtete Anrede,
  feste Texte, Listenwerte und Zahlen. Anrede nur mit Buchstaben, Leerzeichen, Bindestrich, Apostroph, höchstens 60 Zeichen,
  ohne Domains – sonst „Guten Tag,“.
- Referenz im Betreff („Ihre Angebotsanfrage AA-2026-00042“, „Ihre Anfrage KA-… bei Ökovolt ist eingegangen“,
  „Terminbestätigung T-…“, „Ihr Ergebnis: Gewerbe-PV-Rechner (RL-…)“).
- Block „So geht es weiter“ ohne Zeitzusage; bei Gewerbe-Leads die Unterlagen-Checkliste (Lastgang mit 15-Minuten-Werten
  aus dem Netzbetreiber-Portal, letzte Stromrechnung, Zählpunktnummer, Dachplan bzw. Statik; Link `/netzanmeldung/checkliste`).
- Werkzeugnamen nur aus `RECHNER_NAMEN` (= `src/data/leadRechner.js`); unbekannte Kennungen (`^[a-z0-9-]{2,40}$`) erscheinen als
  „Ihr Rechenergebnis“. Terminlink neutral („Rückfragen? Termin wählen“), ohne Werbeinhalte.
- Links zeigen auf `site_config.oekovolt_website_url` (nur `https://`, Standard `https://www.oekovolt.com`).
- `site_config.oekovolt_keine_kundenmail = 1` schaltet alle Kundenmails ab (auch Termin und Double-Opt-in; im
  `developer_mode` steht der Bestätigungslink dann im Log `oekovolt_app`).
- Die Team-Mail sendet ausschließlich `lead_eingang.after_insert` (A06); die API-Module rufen `team_benachrichtigen` nicht mehr auf.

### Datenschutz / Löschfrist

`helfer.anfragen_aufraeumen` (24 Monate) leert zusätzlich `firma`, `lead_schluessel`, `gremium`, `fruehere_anfragen`, beim
Rechner Lead auch `ergebnis`, `ergebnis_json` (enthalten Firmennamen, z. B. im CO₂-Untertitel), `ergebnis_link`, `rueckkehr`,
`mappe_rollen` und den Token-Hash. Ausgenommen bleiben die Status „Termin vereinbart“, „Angebot erstellt“, „Verhandlung“, „Gewonnen“.
Website-Termine: `termin.loesche_alte_termine` leert zusätzlich `lead_schluessel`, `gremium`, `fruehere_anfragen`.

### Migration

Schema per DocType-JSON (`modified` angehoben) – **`bench --site <site> migrate` führt der Mensch aus**, danach
`bench --site <site> clear-cache`. Neue Felder sind leer; alte Datensätze bleiben gültig. Reihenfolge: zuerst diese App-Version
(A06 + A11 gemeinsam) einspielen, sonst kommt die Team-Mail doppelt bzw. gar nicht.

---

## 3b. Rechner Lead / Lead-Gate mit Double-Opt-in (#17–#19)

DocType **„Rechner Lead“** (`RL-YYYY-#####`): Kontakt (`vorname`, `nachname`, `email`, `telefon` nur mit `kontakt_ok`, `firma`,
`plz`, `mappe_rollen`), Werkzeug (`rechner` = Kennung, `rechner_name`, `aktion`), Ergebnis (`ergebnis` Text, `ergebnis_json`,
`ergebnis_link`, `rueckkehr`, `jahresverbrauch_kwh`, `lastgang_kennzahlen`), Bestätigung (`bestaetigung_erforderlich`,
`bestaetigt`, `bestaetigt_am`, `bestaetigungs_token` = **sha256-Hash**, `token_gueltig_bis`, `bestaetigung_gesendet_am`,
`bestaetigung_anzahl`), Vertriebsfelder (Abschnitt 3a), Herkunft inkl. `utm_content`, `ip_adresse`. Rechte: Website API nur
create, Vertrieb/System Manager voll.

### #17 `submit_rechner_lead` – POST JSON, Rolle Website API

| Feld | Werte |
|---|---|
| `kennung` | **Pflicht**, `^[a-z0-9-]{2,40}$` (Liste: `src/data/leadRechner.js`; die Website lehnt unbekannte ab) |
| `vorname`, `nachname`, `email` | **Pflicht** (Art. 6 Abs. 1 lit. b DSGVO – Zustellung des Ergebnisses, Rückfragen) |
| `kontakt_ok` | 0/1, freiwillig, nicht vorangekreuzt. Nur mit 1 wird `telefon` gespeichert (dann E.164-geprüft) |
| `telefon` | optional |
| `aktion` | `pdf`, `download`, `export`, `link`, `auswertung`, `senden`, `druck`, `mail` |
| `plz`, `firma`, `segment`, `rolle`, `gremium[]`, `zeitplan`, `rueckruf_ok`, `einwilligung_id`, `einwilligung_version` | optional, Abschnitt 3a; `segment` sonst aus der Kennung |
| `mappe_rollen[]` | Geschäftsführung, Finanzen/CFO, Technik/Facility, Bank, ESG/Betriebsrat, Gemeinderat – oder die Website-Kennungen `gf`, `cfo`, `technik`, `bank`, `esg`, `gemeinderat` (Liste oder Komma-Text), gespeichert werden die Namen |
| `ergebnis` | Text (Zusammenfassung, max. 4.000 Zeichen) **oder** Objekt (→ `ergebnis_json`, max. 20.000 Zeichen); alternativ `ergebnis_text` + `ergebnis_json` |
| `ergebnis_link`, `rueckkehr` | nur Pfade der eigenen Website (`/rechner/gewerbe-pv?r=…`), sonst verworfen |
| `jahresverbrauch_kwh`, `lastgang_kennzahlen` | optional, wie #5 (keine Rohdaten) |
| `bestaetigung` | `double-opt-in` oder `email` → Bestätigungsmail; leer → Ergebnis-Mail sofort |
| `quelle`, `herkunft` (Zeile), `utm_content`, `ip_adresse`, `website` | wie #4 |

Antwort: `{"message": {"ok": true, "lead_id": "RL-2026-00042", "bestaetigung": "gesendet" | "nicht_noetig" | "aus"}}`
(`aus` = Kundenmails per Schalter abgeschaltet). Keine Pflicht-Einwilligung, kein Newsletter. Drossel je Besucher-IP
(`rechner`) und je E-Mail (`rechner-mail`, Hash statt Klartext); abgelehnte Eingaben zählen nicht.

Ablauf mit Bestätigung: Lead anlegen → Token (`secrets.token_urlsafe(32)`) erzeugen, **nur den sha256-Hash** speichern,
(Integration Welle A: schickt die Website `bestaetigungs_link` mit `/freischalten?token=<signierter Website-Token>`, wird
**dieser** Token übernommen – die Website prüft dessen Signatur auf /freischalten; die Link-Basis kommt trotzdem immer aus
`oekovolt_website_url`. „Erneut senden“ über #18 erzeugt ein eigenes Token, das die Website nicht freischaltet – die
Website sendet dafür das Formular erneut an #17.)
gültig 24 h → Mail „Bitte bestätigen Sie Ihre E-Mail-Adresse“ mit `https://<website>/freischalten?token=…` → nach der
Bestätigung Ergebnis-Mail (Werkzeugname, Ergebnis-Link, „So geht es weiter“, Terminlink). Unbestätigte Leads löscht der
tägliche Job `oekovolt_app.website_api.rechner.unbestaetigte_loeschen` nach **30 Tagen** endgültig.

### #18 `sende_bestaetigung` – POST JSON, Gast (`allow_guest`, `rate_limit`)

`{lead: "RL-2026-00042", email, ip_adresse}` → immer `{ok: true, gesendet: bool}` (verrät nicht, ob es den Lead gibt).
Neue Mail nur, wenn `email` zum Lead passt, er noch nicht bestätigt ist, die letzte Mail ≥ 60 s zurückliegt und höchstens
5 Mails verschickt wurden; jedes Mal ein neues Token (das alte wird ungültig). Drossel je IP und je E-Mail.

### #19 `bestaetige_lead` – POST JSON, Gast (`allow_guest`, `rate_limit`)

`{token, ip_adresse}` → prüft Format, sha256-Hash und Ablauf (24 h), setzt `bestaetigt = 1`, `bestaetigt_am`, macht den Link
unbrauchbar (einmal verwendbar) und schickt die Ergebnis-Mail.
Antwort `{ok: true, lead_id, kennung, rueckkehr}` – die Website (A09: `/freischalten`, `/api/lead-gate/bestaetigen`) setzt
daraufhin ihr signiertes Freischalt-Cookie und leitet auf `rueckkehr` zurück. Fehler: `{ok: false, grund: "verwendet" |
"abgelaufen" | "ungueltig", meldung}`; bei `verwendet` zusätzlich `lead_id`, `kennung`, `rueckkehr`. Keine Personendaten in der Antwort.

Die Team-Mail des Rechner Leads kommt aus `lead_eingang.after_insert` (A06). Bei Double-Opt-in setzt `submit_rechner_lead`
das Flag `doc.flags.lead_eingang_aufschieben`; meldet `lead_eingang` `AUFSCHUB_UNTERSTUETZT = True`, verarbeitet
`bestaetige_lead` den Eingang erst nach der Bestätigung (sonst sofort beim Anlegen, mit Hinweis „Bestätigung ausstehend“).

---

## 4. Termine und Rückruf (#6, #7)

### DocType „Website Termin“ (Vorschlag)

Felder wie im Body unten plus `status` (Neu/Bestätigt/Erledigt/Abgesagt), `berater` (Link User), `referenz` (eindeutig, z. B. `T-2026-000123`).
Arbeitszeiten/Slots in einem Single-DocType „Termin Einstellungen“ pflegen: je `terminart` Wochentage, Beginn, Ende,
Slotlänge (Standard 30 Min.), Vorlauf, gesperrte Tage (Feiertage AT). Zeitzone Europe/Vienna.

### #7 `get_kalender` – GET `?terminart=Telefonische%20Beratung&von=2026-09-29&bis=2026-10-29`

`terminart` ∈ `Telefonische Beratung`, `Video-Beratung`, `Vor-Ort-Termin`.
```json
{ "message": [ { "datum": "2026-10-02", "label": "Fr, 2.10.", "status": "teilweise",
                 "freie_slots": ["08:30", "10:00"], "belegte_slots": ["09:00"] } ] }
```
`status` ∈ `frei`, `teilweise`, `ausgebucht`, `geschlossen`. Buchbar nur mit `frei`/`teilweise` **und** nicht leeren `freie_slots`.
Ein Eintrag pro Tag im Bereich (auch geschlossene Tage).

### #6 `buche_termin` – POST JSON, **`allow_guest=True`** (die Website sendet keinen Token)

| Feld | Werte |
|---|---|
| `terminart` | wie oben |
| `datum` | `YYYY-MM-DD` |
| `uhrzeit` | `HH:MM` (Wiener Ortszeit) |
| `name_komplett`, `email` | Data |
| `telefon` | E.164, z. B. `+43…` |
| `plz`, `thema`, `nachricht`, `quelle` | Data / Long Text |
| `einwilligung` | Check |
| `ip_adresse`, `website` | wie oben |
| *optional (A08/A11)* `bezug` | Referenz der vorangegangenen Anfrage (`AK-20261011-7F3K` oder `AA-2026-00042`) → Feld `bezug` |
| `einwilligung_id`, `einwilligung_version` | Kennung/Version des angezeigten Hinweistexts → `einwilligung_id`, `einwilligung_text_version` |
| `segment`, `rueckruf_ok` | optional; Rückruf und „Telefonische Beratung“ setzen `rueckruf_ok = 1` |

Die Herkunftszeile in `nachricht` wird zusätzlich in `herkunft_kanal`, `utm_*`, `herkunft_referrer`, `einstiegsseite`
zerlegt (wie bei #4). Die Rolle **Vertrieb** darf Website-Termine lesen, schreiben und auswerten.

Antwort: `{"message": {"referenz": "T-2026-000123"}}`.
Slot schon belegt → `frappe.throw("Dieser Termin ist leider nicht mehr verfügbar.")` (Website zeigt dann neue Slots).
Weil Gast-Zugriff: Rate-Limit (`@frappe.rate_limit`), Honeypot, Pflichtfelder, Slot-Prüfung **unter Sperre** (Doppelbuchung verhindern).
Danach: Bestätigungs-E-Mail mit .ics (ohne Freitext: keine Nachricht, kein Thema, keine Adresse; Referenz im Betreff).
Die Benachrichtigung an die Terminberatung kommt seit A11 aus `lead_eingang.after_insert` (nicht mehr aus `buche_termin`).

---

## 5. Produktseiten (#9–#11)

### #9 Single-DocType „Stromspeicher Page“ mit Tabelle `strom_second_card_table`
### #10 Single-DocType „Waermepumpe Page“ mit Tabelle `warmepumpe_third_card_options_table`

Beide Methoden: GET ohne Parameter, liefern `message` = das Single-Dokument (`frappe.get_single(...).as_dict()`).
Zeilenfelder der Tabellen (identisch):

| Feld | Typ | Hinweis |
|---|---|---|
| `title` | Data | Markenname; Slug = `generateSlug(title)`. Muss genau dem `title` im Hersteller (#11) entsprechen |
| `banner_image`, `logo_image` | Attach Image | öffentlich |
| `alt_banner_image`, `alt_logo_image` | Data | |
| `main_description` | Small Text | Zeilenumbrüche bleiben erhalten |
| `status` | Select `Aktiv`/`Passiv` | `Passiv` wird ausgeblendet |
| `modified` | (automatisch) | Sitemap |

Stromspeicher: angezeigt werden nur Titel, die `Fronius`, `Huawei`, `Solis`, `BYD`, `Sigenergy` oder `meteocontrol` enthalten.

### #11 `get_hesteller_by_name` – GET `?name=<title>` → DocType „Hersteller“

`message` = ein Objekt (auch `message.message` wird akzeptiert). Felder:
`title`, `main_description`, `banner_image`, `alt_banner_image`, `logo_image`, `alt_logo_image`, `company_name`,
`location`, `website_url`, `email`, `phone_number`, `company_description`, `details_description`
und für `n` ∈ `first`, `second`, `third`, `fourth`, `fifth`:
`{n}_product_status` (nur `Aktiv` wird gezeigt), `{n}_product_name`, `{n}_product_image`, `{n}_product_image_alt`,
`{n}_product_description`, `{n}_product_options` (Tabelle mit Feld `options`).
Nicht gefunden → leeres `message` (kein Fehler); die Seite zeigt dann nur die Daten aus #9/#10.

---

## 5a. Heatmap (#15, #16) – Ergänzung 30.09.2026

Umgesetzt in `Import-Backend-Frappe/apps/oekovoltdeutchland` (DocTypes „Heatmap Zelle“, „Heatmap Scroll“, „Heatmap Seite“,
Bericht „Heatmap Auswertung“); ausführlich `Import-Backend-Frappe/apps/oekovoltdeutchland/README.md`, Abschnitt „Heatmap“.
Website-Seite: `src/app/api/heatmap/route.js` (Sammler `src/components/Statistik/HeatmapSammler.js`, nur mit Einwilligung „Statistik“).

### #15 `heatmap_zelle.api.erfassen` – POST JSON, Rolle Website API

```json
{ "pfad": "/gewerbe", "geraet": "mobil|tablet|desktop",
  "klicks": [ { "sel": "css-selektor", "rx": 0.35, "ry": 0.5 } ], "scroll": 70 }
→ { "message": { "ok": true } }
```
- Die Website sendet **keine IP-Adresse** und keine Kennungen; ein Aufruf = ein Seitenaufruf.
- Validierung wie die Website: `pfad` beginnt mit `/`, ohne Query/Fragment, ≤ 200 Zeichen, nur `[a-z0-9/._-]` (klein);
  `sel` ≤ 200 Zeichen; ≤ 100 Klicks; `rx`/`ry` 0…1 auf 0,05 gerundet; `scroll` 0…100 auf 10 gerundet.
  Ungültiger `pfad`/`geraet` → ValidationError; ungültige Klicks werden still verworfen.
- Speicherung nur **aggregiert je Monat** (Zähler je Zelle, Seite, Scrolltiefe), atomar hochgezählt.
- Pfad-Limit: je Gerät und Monat höchstens **2.000 verschiedene Pfade**; weitere neue Pfade werden still verworfen.
- Löschung: täglicher Job `heatmap_zelle.api.alte_monate_loeschen` – nichts ist älter als **14 Monate**.

### #16 `heatmap_zelle.api.auswertung` – POST JSON, Rolle Website API

```json
{ "pfad": "/gewerbe", "geraet": "desktop", "tage": 30 }
→ { "message": { "pfad": "…", "geraet": "…", "aufrufe": 123,
                 "klicks": [ { "sel": "…", "rx": 0.35, "ry": 0.5, "anzahl": 7 } ],
                 "scroll": [ { "tiefe": 10, "anzahl": 120 } ] } }
```
- `klicks` absteigend, max. 1.000; `scroll` kumuliert (Aufrufe mit mindestens dieser Tiefe); `tage` wird in Monate umgerechnet.
- Die Website ruft #16 nur für die Ansicht mit gültigem `HEATMAP_TOKEN` auf (gleicher Wert wie `oekovolt_heatmap_token` in Frappe).

---

## 6. Fertige Pakete aus `Import-Frappe/` (#12–#14)

Code, DocTypes, Rollen, hooks, Installationsskript liegen vollständig bereit – Ablauf: `Import-Frappe/ANLEITUNG.md`.
Für AT anpassen: Site-Name (`backoffice.oekovolt.com` → AT-Backoffice), E-Mail-Adressen der API-User,
`website_url` → `https://www.oekovolt.com`, Zeitzone/Texte (Berlin → Wien), Health-Check-URL auf .com.

- **solar_lead** (`sitzung_starten`, `sitzung_status`, `sitzung_verbunden`, `foto_speichern`, `sitzung_abschliessen`,
  `fortsetzen_info`, `fortsetzen_starten`) – braucht `rueckruf/api.py` als Helfer. Doku `docs/frappe-solar-lead/README.md`.
- **veroeffentlichung** + `push_nachricht`, `push_abonnement`, `fediverse_follower`, `verteilprotokoll`
  (`liste`, `detail`, `push_abo_speichern`, `push_abo_loeschen`, `push_abo_ersetzen`, `push_abos`, `push_abos_entfernen`,
  `faellige_push`, `push_gesendet`, `ap_follower_speichern`, `ap_follower_loeschen`, `ap_followers`,
  `ap_follower_anzahl`, `verteilt_pruefen`, `verteilt_reservieren`, `verteilt_abschliessen`). Doku `docs/frappe-kanaele/README.md`.
- **hinweis** (`ping`, `create_hinweis`, `get_postfach`, `add_nachricht`) – nur bei eigenem Hinweisgebersystem.
- **report/anfragen_nach_herkunft** – optional, Kampagnen-Auswertung.

---

## 7. Rollen, API-User, Umgebung

| API-User | Rolle | Rechte | Website-Variable |
|---|---|---|---|
| `website-api@…` | Website API | lesen: Projekt, Stromspeicher Page, Waermepumpe Page, Hersteller, Termin Einstellungen; anlegen: Kontaktanfrage, Angebotsanfrage, Solarrechner Anfrage, Rechner Lead (#17); Heatmap erfassen/auswerten (#15/#16) | `API_KEY` / `API_SECRET` |
| `kontakt-web@…` | Kontakt Webformular | nur Solar-Lead-Methoden | `KONTAKT_API_KEY` / `KONTAKT_API_SECRET` |
| `kanal-web@…` | Kanal Webservice | Veröffentlichungs-Methoden | `KANAL_API_KEY` / `KANAL_API_SECRET` |
| `hinweis-web@…` | Hinweis Webformular | nur Hinweis-Methoden | `HINWEIS_API_KEY` / `HINWEIS_API_SECRET` |

Alle schreibenden Methoden per `frappe.has_permission` / Rollenprüfung absichern, Eingaben kürzen und validieren,
`ignore_permissions=True` nur nach dieser Prüfung. Keine Methode darf personenbezogene Daten zurückgeben
(außer #1–#3/#9–#11, die nur öffentliche Inhalte liefern).

Website-Umgebung: `SERVER=https://<at-backoffice>` plus die Keys oben; Vorlage `Import-Frappe/5_website_env.txt`.
Backoffice-Schalter (`site_config.json`) für den Vertrieb: `oekovolt_website_url` (Links in Kundenmails),
`oekovolt_keine_kundenmail`, `oekovolt_routing_aktiv`, `oekovolt_alarm_webhook`, `oekovolt_eskalation_an` (A06),
`oekovolt_drossel` (z. B. `{"rechner": 20, "rechner-mail": 5, "bestaetigung": 10}`).
Hinweis: Die Vorlage sagt, `KONTAKT_API_KEY` decke Rückruf/Termin/PDF ab – laut Code stimmt das nicht
(Termin/Rückruf ohne Auth, PDF über `API_KEY`); die Tabelle hier ist maßgeblich.

## 8. Abnahmetest

```bash
H='Authorization: token KEY:SECRET'; S=https://<at-backoffice>/api/method
curl -H "$H" "$S/oekovolt_app.website_api.projekte.get_projekte"            # message.projekte[] mit bild_url absolut
curl -H "$H" "$S/oekovolt_app.website_api.termin.get_kalender?terminart=Video-Beratung&von=2026-10-01&bis=2026-10-07"
curl -X POST -H 'Content-Type: application/json' "$S/oekovolt_app.website_api.termin.buche_termin" -d '{…}'  # ohne Token!
curl -H "$H" "$S/oekovoltdeutchland.oekovoltdeutchland.doctype.waermepumpe_page.api.get_waermepumpe_page_with_keywords"
curl -I "https://<at-backoffice>/files/<bild>.jpg"                          # 200 ohne Login
curl -X POST -H "$H" -H 'Content-Type: application/json' "$S/oekovolt_app.website_api.rechner.submit_rechner_lead" \
  -d '{"kennung":"gewerbe-pv","vorname":"Test","nachname":"Lauf","email":"test@example.at","bestaetigung":"double-opt-in","ergebnis_link":"/rechner/gewerbe-pv"}'
curl -X POST -H 'Content-Type: application/json' "$S/oekovolt_app.website_api.rechner.bestaetige_lead" -d '{"token":"<aus der Mail>"}'  # ohne Token-Header
```
Danach auf der Website: Startseite (Referenzen), `/referenzen/projekte/<slug>`, `/referenzen/referenzkarte`, `/kontakt`,
`/angebot`, `/termin`, Rückruf-Widget, `/solarrechner` → PDF, Foto-Upload per QR, `/presse`, `/produkte/warmepumpe/<slug>`.
