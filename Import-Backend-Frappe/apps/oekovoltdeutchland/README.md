# Frappe-App `oekovoltdeutchland` – Backoffice oekovolt.com (Österreich)

Frappe v15. Installierbare App mit allen Website-Methoden unter
`oekovoltdeutchland.oekovoltdeutchland.doctype.*` – ergänzt die App `oekovolt_app`
(Projekte, Kontakt, Angebot, Termin, Solarrechner).

## Warum „oekovoltdeutchland“, obwohl das die AT-Instanz ist?

Die Website ruft fest verdrahtete Pfade auf, z. B.
`/api/method/oekovoltdeutchland.oekovoltdeutchland.doctype.waermepumpe_page.api.get_waermepumpe_page_with_keywords`.
Der erste Teil ist der **App-Name**, der zweite der **Modulordner** (Modul „Oekovoltdeutchland“ in `modules.txt`).
Ein anderer Name würde jede dieser URLs brechen. Deshalb bleiben App- und Modulname (inkl. Schreibweise
„deutchland“) unverändert; alle Inhalte, Texte, Zeitzone und Domains sind auf Österreich angepasst.

## Aufbau

```
oekovoltdeutchland/                 App-Ordner (→ frappe-bench/apps/oekovoltdeutchland)
├─ pyproject.toml
├─ README.md
└─ oekovoltdeutchland/              Python-Paket
   ├─ __init__.py                   __version__
   ├─ hooks.py                      doc_events, scheduler_events, after_install/after_migrate
   ├─ installation.py               Rollen anlegen (idempotent), Heatmap-Indizes, Zeitzonen-Hinweis
   ├─ modules.txt                   Oekovoltdeutchland
   ├─ patches.txt
   └─ oekovoltdeutchland/           Modul
      ├─ rollen.py                  Rollenprüfung für die neuen Methoden
      ├─ doctype/…                  siehe Tabelle
      └─ report/anfragen_nach_herkunft, report/heatmap_auswertung
```

## DocTypes und Methoden

| DocType | Methoden (`…doctype.<ordner>.api.*`) | Aufrufer (Website-Variable) |
|---|---|---|
| **Stromspeicher Page** (Single) + Stromspeicher Page Item | `get_strom_page_with_keywords` (GET) | `API_KEY` |
| **Waermepumpe Page** (Single) + Waermepumpe Page Item | `get_waermepumpe_page_with_keywords` (GET) | `API_KEY` |
| **Hersteller** + Hersteller Produktoption | `get_hesteller_by_name?name=<title>` (GET, Tippfehler ist Absicht) | `API_KEY` |
| **Heatmap Zelle / Heatmap Scroll / Heatmap Seite** | `heatmap_zelle.api.erfassen`, `heatmap_zelle.api.auswertung` (POST) | `API_KEY` |
| Solar Lead (+ Rueckruf als Helfer) | 7 Methoden, siehe `docs/frappe-solar-lead/README.md` | `KONTAKT_API_KEY` |
| Veroeffentlichung, Push Nachricht, Push Abonnement, Fediverse Follower, Verteilprotokoll | 16 Methoden, siehe `docs/frappe-kanaele/README.md` | `KANAL_API_KEY` |
| Hinweis, Hinweis Nachricht | `ping`, `create_hinweis`, `get_postfach`, `add_nachricht` | `HINWEIS_API_KEY` (nur bei `HINWEIS_INTERN=1`) |
| Beratungstermin, PV Analyse | im Paket enthalten, von der AT-Website **nicht** aufgerufen | – |

Berichte: **Anfragen nach Herkunft** (Kampagnen), **Heatmap Auswertung** (neu).

### Produktseiten und Hersteller

- `get_strom_page_with_keywords` / `get_waermepumpe_page_with_keywords` liefern das Single-Dokument als dict
  inkl. Kindtabelle (`strom_second_card_table` bzw. `warmepumpe_third_card_options_table`), je Zeile
  `title, banner_image, logo_image, alt_banner_image, alt_logo_image, main_description, status, modified`.
  `owner`/`modified_by` (Bearbeiter-E-Mails) werden entfernt.
- `Passiv`-Zeilen werden mitgeliefert, die Website blendet sie aus.
- **Waermepumpe Page leer → alle `/produkte/warmepumpe/<slug>` liefern 404.**
- Stromspeicher: die Website zeigt nur Titel mit Fronius, Huawei, Solis, BYD, Sigenergy oder meteocontrol.
- `get_hesteller_by_name`: sucht per `title` (= Name des Dokuments). Nicht gefunden → `{}` (kein Fehler).
  Der `title` muss exakt dem Titel der Zeile in der Produktseite entsprechen.

### Bilder müssen öffentlich sein

Alle Bildfelder sind *Attach Image*. Die Website lädt `/files/…` **ohne Anmeldung** über
`${SERVER}/files/…` → beim Hochladen **nicht „Privat“** anhaken (`is_private = 0`).
Private Dateien (`/private/files/…`) erscheinen auf der Website nicht. Prüfen:
`curl -I https://<backoffice>/files/<bild>.jpg` → 200 ohne Login.

### Heatmap

Vertrag mit der Website (verbindlich):

```
POST …heatmap_zelle.api.erfassen
  { "pfad": "/gewerbe", "geraet": "mobil|tablet|desktop",
    "klicks": [ { "sel": "css-selektor", "rx": 0.35, "ry": 0.5 } ], "scroll": 70 }
  → { "ok": true }

POST …heatmap_zelle.api.auswertung
  { "pfad": "/gewerbe", "geraet": "desktop", "tage": 30 }
  → { "pfad", "geraet", "aufrufe": n,
      "klicks": [ { "sel", "rx", "ry", "anzahl" } ],          (absteigend, max. 1000)
      "scroll": [ { "tiefe": 10 … 100, "anzahl" } ] }          (anzahl = Aufrufe mit mind. dieser Tiefe)
```

- **Nur aggregiert**, monatsweise – keine Rohdaten, keine IP, keine Personen, keine Sitzungs-IDs.
  Ein `erfassen`-Aufruf = ein Seitenaufruf (Heatmap Seite `aufrufe` + 1), jeder Klick zählt in seiner
  Rasterzelle (Heatmap Zelle), die **maximal** erreichte Scrolltiefe einmal (Heatmap Scroll); die
  Auswertung kumuliert (≥ Tiefe).
- Plausibilitätsschutz: `pfad` wird kleingeschrieben und darf nur `[a-z0-9/._-]` enthalten (sonst Fehler);
  je Gerät und Monat werden höchstens **2.000 verschiedene Pfade** angenommen – weitere neue Pfade werden
  still verworfen (Antwort trotzdem `{ok: true}`), bekannte Pfade zählen weiter.
- Bekannt und akzeptiert: nach einem Tab-Wechsel kann die Website einen zweiten Beacon für denselben
  Seitenaufruf senden – `aufrufe` kann dadurch leicht erhöht sein.
- Validierung wie die Website: `pfad` beginnt mit `/`, ohne Query/Fragment, ≤ 200 Zeichen;
  `sel` ≤ 200 Zeichen; höchstens 100 Klicks; `rx`/`ry` auf 0 … 1 begrenzt und auf 0,05 gerundet;
  `scroll` auf 0 … 100 begrenzt und auf 10 gerundet. Ungültiger `pfad`/`geraet` → ValidationError (`frappe.throw`),
  ungültige Klicks werden still verworfen.
- Hochzählen: deterministischer `name` = SHA-256 der Schlüsselfelder, dann
  `INSERT … ON DUPLICATE KEY UPDATE anzahl = anzahl + VALUES(anzahl)` (MariaDB; PostgreSQL:
  `ON CONFLICT … DO UPDATE`) – atomar, ohne Lesen vorher, bei Deadlock bis zu 3 Versuche.
- `tage` wird in Monate umgerechnet (gespeichert wird monatsweise): 30 Tage = aktueller und ggf. Vormonat.
- Rollen: `erfassen`/`auswertung` nur **Website API** bzw. System Manager.
- Löschung: täglicher Job `heatmap_zelle.api.alte_monate_loeschen` – behalten werden der aktuelle und
  die 13 Vormonate (nichts ist älter als 14 Monate).
- Desk: Bericht **Heatmap Auswertung** (Filter Pfad, Gerät, Von/Bis Monat): Top-Elemente
  (Selektor, Klicks, Anteil an Aufrufen), Scroll-Kurve als Diagramm, Kennzahl Aufrufe. Für
  **System Manager / Marketing** zusätzlich Link und Button „Visuelle Ansicht auf der Website“:
  `https://www.oekovolt.com<pfad>?heatmap=<oekovolt_heatmap_token>&geraet=<geraet>`.
- Reine Logik ohne Frappe: `doctype/heatmap_zelle/heatmap_logik.py`, Tests `test_heatmap_logik.py`.

## Rollen und API-User

Rollen legt die App beim Installieren/Migrieren selbst an (fehlende nur, vorhandene bleiben unverändert);
alternativ `installation/rollen.csv` per Data Import.

| Rolle | Desk | Zweck |
|---|---|---|
| Website API | nein | API-User `website-api@oekovolt.com` → `API_KEY` (lesen Produktseiten/Hersteller, Heatmap) |
| Kontakt Webformular | nein | API-User `kontakt-web@oekovolt.com` → `KONTAKT_API_KEY` (Solar Lead) |
| Kanal Webservice | nein | API-User `kanal-web@oekovolt.com` → `KANAL_API_KEY` |
| Hinweis Webformular | nein | API-User `hinweis-web@oekovolt.com` → `HINWEIS_API_KEY` |
| Hinweis Meldestelle | ja | interne Stelle nach HSchG (2FA Pflicht) |
| Marketing | ja | pflegt Produktseiten, Hersteller, Veröffentlichungen, Push; sieht Heatmap |
| Vertrieb, Technik Innendienst, Rückruf Team, Terminberatung | ja | Leads, Fotos, Rückrufe, Termine |

Jeder API-User bekommt **nur** seine eine Rolle, dann *API Access → Generate Keys*.

## Installation

```bash
# Ordner Import-Backend-Frappe auf den Server kopieren, dann:
SITE=backoffice.oekovolt.com BENCH=/home/frappe/frappe-bench bash installation/installieren.sh
cd /home/frappe/frappe-bench
SITE=backoffice.oekovolt.com KANAL_SECRET=… HEATMAP_TOKEN=… bash ~/Import-Backend-Frappe/installation/site_config.sh
```

`site_config.sh` setzt u. a. `website_url=https://www.oekovolt.com`, `oekovolt_heatmap_token`,
Webhook/Secret der Kanäle und die System-Zeitzone **Europe/Vienna**. Umgebungsvariablen der Website:
`installation/website_env.txt`.

Manuell statt Skript: App-Ordner nach `apps/` kopieren, `./env/bin/pip install -e apps/oekovoltdeutchland`,
`oekovoltdeutchland` in `sites/apps.txt` eintragen, `bench --site <site> install-app oekovoltdeutchland`,
`bench pip install anthropic pillow-heif`, `bench --site <site> migrate`, `bench restart`.

## Hooks

- `doc_events`: `Veroeffentlichung.on_update` → `veroeffentlichung.api.nach_speichern`
- `scheduler_events.daily`: Löschfristen Hinweis, Rückruf, Beratungstermin, PV Analyse, Solar Lead
  (`aufraeumen`), **Heatmap** (`alte_monate_loeschen`)
- `cron */5`: `geplante_veroeffentlichen`, `website_anstossen`; `cron */15`: `solar_lead.api.erinnerungen_senden`
- `after_install` / `after_migrate`: `installation.nach_installation` / `nach_migration`

## Österreich-Anpassungen gegenüber `Import-Frappe/`

- Domain/Links: `www.oekovolt.de` → `www.oekovolt.com` (Termin-Link in der PV-Analyse-Mail,
  Fortsetzen-Link-Standard, Push-Link-Prüfung, Webhook-Beispiel, Fediverse-Handle `@oekovolt@oekovolt.com`,
  .ics-UID `@oekovolt.com`), E-Mail `office@oekovolt.com`, Telefon `+43 6278 71030`.
- Zeitzone: Code nutzt die System-Zeitzone → **Europe/Vienna** (site_config.sh, Hinweis beim Installieren).
- Veröffentlichung: Dateline-Standard „Ostermiething“ statt „Türkheim“, Slug-Beispiel „…-salzburg“.
- Push: Beispiel-Link `/ratgeber/elwg-elektrizitaetswirtschaftsgesetz` statt Solarspitzengesetz.
- KI-Anweisung: „österreichischer Fachbetrieb“.
- Hinweisgebersystem: HinSchG → **HSchG** (Texte), Kategorien des AT-Formulars (Korruption, Vergabe,
  Verbraucherschutz, Finanzen …; alte Werte bleiben gültig), Löschfrist **5 Jahre** nach Abschluss
  (§ 8 Abs. 11 HSchG, wie in der Datenschutzinformation der Website) statt 3 Jahren.
- Bericht „Anfragen nach Herkunft“: liest die `[Herkunft]`-Zeile zusätzlich aus Kontaktanfrage,
  Angebotsanfrage und Website Termin (`oekovolt_app`, Feld `nachricht`), falls vorhanden.

## Tests

```bash
cd oekovoltdeutchland/oekovoltdeutchland/doctype/heatmap_zelle && python -m unittest test_heatmap_logik -v
# oder im Bench:
bench --site <site> run-tests --module oekovoltdeutchland.oekovoltdeutchland.doctype.heatmap_zelle.test_heatmap_logik
```

Abnahme nach der Installation (mit Key/Secret des Website-API-Users):

```bash
H='Authorization: token KEY:SECRET'; S=https://<backoffice>/api/method/oekovoltdeutchland.oekovoltdeutchland.doctype
curl -H "$H" "$S.waermepumpe_page.api.get_waermepumpe_page_with_keywords"
curl -H "$H" "$S.stromspeicher_page.api.get_strom_page_with_keywords"
curl -H "$H" "$S.hersteller.api.get_hesteller_by_name?name=Fronius"
curl -X POST -H "$H" -H 'Content-Type: application/json' "$S.heatmap_zelle.api.erfassen" \
     -d '{"pfad":"/gewerbe","geraet":"desktop","klicks":[{"sel":"a.cta","rx":0.35,"ry":0.5}],"scroll":70}'
curl -X POST -H "$H" -H 'Content-Type: application/json' "$S.heatmap_zelle.api.auswertung" \
     -d '{"pfad":"/gewerbe","geraet":"desktop","tage":30}'
```
