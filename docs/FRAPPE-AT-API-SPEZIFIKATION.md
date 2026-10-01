# Frappe-Backoffice für oekovolt.com (AT) – vollständige API-Spezifikation

Stand 29.09.2026, ergänzt 30.09.2026 (Kundenbühne-Felder bei #1/#2, Heatmap #15/#16), Branch `at-launch`. Abgeleitet aus dem tatsächlichen Code der Website (nicht aus Annahmen).
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
| `vorname`, `nachname`, `email`, `telefon` | Data |
| `strasse_hausnummer` | Data, **darf leer sein** (Award, Sponsoring) |
| `plz` | Data, **4–5 Ziffern** (AT hat 4) |
| `ort` | Data |
| `nachricht` | Long Text, bis 8000 Zeichen (Firma, Zusatzfelder, Kampagnen-Herkunft stehen als Zeilen „Label: Wert“ darin) |
| `einwilligung` | Check (1/0) |
| `quelle` | Data (Seitenpfad) |
| `ip_adresse` | Data |
| `website` | Honeypot, nicht speichern |

Antwort wird nicht gelesen; 2xx = Erfolg. Empfohlen: Benachrichtigung an Vertrieb + Bestätigungs-E-Mail.

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

### #8 `submit_solarrechner` – POST **multipart/form-data** → DocType „Solarrechner Anfrage“

Felder: `kunden_name`, `email`, `telefon`, `plz`, `ip_adresse`, `quelle` (z. B. `/solarrechner`) und Datei `pdf`
(`Oekovolt-PV-Analyse-PVA-2026-XXXXXX.pdf`, application/pdf). Datei aus `frappe.request.files["pdf"]` lesen,
**privat** anhängen (`is_private=1`), optional PDF per E-Mail an Kunden + Vertrieb. Antwort wird nicht gelesen.

> Achtung Website-Bug: `src/app/api/analyse/pdf/route.js:72` (und der Client) prüft `plz` mit `/^\d{5}$/` –
> österreichische 4-stellige PLZ werden abgelehnt. Muss in der Website auf `/^\d{4,5}$/` geändert werden.

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

Antwort: `{"message": {"referenz": "T-2026-000123"}}`.
Slot schon belegt → `frappe.throw("Dieser Termin ist leider nicht mehr verfügbar.")` (Website zeigt dann neue Slots).
Weil Gast-Zugriff: Rate-Limit (`@frappe.rate_limit`), Honeypot, Pflichtfelder, Slot-Prüfung **unter Sperre** (Doppelbuchung verhindern).
Danach: Bestätigungs-E-Mail mit .ics, Benachrichtigung an Berater.

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
| `website-api@…` | Website API | lesen: Projekt, Stromspeicher Page, Waermepumpe Page, Hersteller, Termin Einstellungen; anlegen: Kontaktanfrage, Angebotsanfrage, Solarrechner Anfrage; Heatmap erfassen/auswerten (#15/#16) | `API_KEY` / `API_SECRET` |
| `kontakt-web@…` | Kontakt Webformular | nur Solar-Lead-Methoden | `KONTAKT_API_KEY` / `KONTAKT_API_SECRET` |
| `kanal-web@…` | Kanal Webservice | Veröffentlichungs-Methoden | `KANAL_API_KEY` / `KANAL_API_SECRET` |
| `hinweis-web@…` | Hinweis Webformular | nur Hinweis-Methoden | `HINWEIS_API_KEY` / `HINWEIS_API_SECRET` |

Alle schreibenden Methoden per `frappe.has_permission` / Rollenprüfung absichern, Eingaben kürzen und validieren,
`ignore_permissions=True` nur nach dieser Prüfung. Keine Methode darf personenbezogene Daten zurückgeben
(außer #1–#3/#9–#11, die nur öffentliche Inhalte liefern).

Website-Umgebung: `SERVER=https://<at-backoffice>` plus die Keys oben; Vorlage `Import-Frappe/5_website_env.txt`.
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
```
Danach auf der Website: Startseite (Referenzen), `/referenzen/projekte/<slug>`, `/referenzen/referenzkarte`, `/kontakt`,
`/angebot`, `/termin`, Rückruf-Widget, `/solarrechner` → PDF, Foto-Upload per QR, `/presse`, `/produkte/warmepumpe/<slug>`.
