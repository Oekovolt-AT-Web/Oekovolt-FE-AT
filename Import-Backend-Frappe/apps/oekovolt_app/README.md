# oekovolt_app – Backoffice-Schnittstelle für www.oekovolt.com (AT)

Frappe-App (v15) für das österreichische Backoffice. Sie liefert Referenzprojekte an die Website und nimmt
Kontakt-, Angebots- und Solarrechner-Anfragen entgegen. Vertrag: `docs/FRAPPE-AT-API-SPEZIFIKATION.md` im Website-Repository.
Der Termin-Teil (`website_api/termin.py`, #6/#7) gehört ebenfalls zu dieser App.

## Installation

```bash
cd ~/frappe-bench
bench get-app /pfad/zu/Import-Backend-Frappe/apps/oekovolt_app   # oder App-Ordner nach apps/ kopieren + bench setup requirements
bench --site <at-backoffice> install-app oekovolt_app
bench --site <at-backoffice> migrate
```

Beim Installieren/Migrieren werden die Rollen angelegt (vor dem DocType-Sync, zusätzlich als Fixture),
der Firmensitz Ostermiething in „Referenzkarte Einstellungen“ und die Standard-Terminzeiten vorbelegt.

## Methoden (`/api/method/<pfad>`)

| Pfad | Art | Wofür |
|---|---|---|
| `oekovolt_app.website_api.projekte.get_projekte` | GET | `{projekte[], anzahl, summe_kwp}` – nur veröffentlichte Projekte, `bild_url` absolut, `leistung_label` „314,5 kWp“ |
| `oekovolt_app.website_api.projekte.get_projekt?projekt_website_name=haydu-2` | GET | Ein Projekt inkl. `bilder[]` (Titelbild zuerst), Technik, Ertrag, Koordinaten und Kundenbühne (siehe unten); nicht gefunden → `{}` |
| `oekovolt_app.website_api.projekte.get_referenzkarte` | GET | Firmensitz, Orte (gruppiert nach `ort`, Haversine-Entfernung, `im_umkreis`), `umkreis_km`, `anzahl_im_umkreis`. Projekte am Firmensitz stehen nicht in `orte` (die Website zeigt sie am Firmensitz-Marker) |
| `oekovolt_app.website_api.kontakt.submit_kontakt` | POST JSON | → Kontaktanfrage |
| `oekovolt_app.website_api.angebot.submit_angebot` | POST JSON | → Angebotsanfrage (`vorhaben` als JSON, `ergebnis` einzeln + `ergebnis_json`) |
| `oekovolt_app.website_api.solarrechner.submit_solarrechner` | POST multipart | → Solarrechner Anfrage, `pdf` (nur application/pdf, max. 10 MB) privat angehängt |
| `oekovolt_app.website_api.termin.*` | | siehe `termin.py` (Termin-Teil) |

Alle Methoden oben verlangen die Rolle **Website API** (oder System Manager); Header `Authorization: token KEY:SECRET`.

- **Projekt-Antworten** liegen 10 Minuten im Redis-Cache. Speichern/Löschen eines Projekts oder der Referenzkarte-Einstellungen leert ihn.
  Die Website cached zusätzlich 10 Minuten (`revalidate: 600`).
- **Formulare:** Honeypot `website` gefüllt → Erfolg ohne Speichern. Pflichtfelder/Längen/E-Mail/PLZ (4–5 Ziffern) werden geprüft;
  Fehler kommen als `frappe.throw` mit deutschem Text (die Website zeigt ihn an). Bei Kontakt dürfen PLZ und Straße leer sein (Award, Sponsoring).
- **Drosselung** je `ip_adresse` und Stunde: Kontakt 5, Angebot 5, Solarrechner 10 → HTTP 429.
  Anpassbar per `site_config.json`: `"oekovolt_drossel": {"kontakt": 10}`.
- **Benachrichtigung:** E-Mail + Glocke (Notification Log) an alle aktiven Nutzer der Rolle **Vertrieb**
  (plus optional `"oekovolt_benachrichtigung_an": ["vertrieb@oekovolt.com"]`), Reply-To = Kunde.
- **Bestätigungs-E-Mail an den Kunden** ohne die interne Zeile `[Herkunft] …`. Im Datensatz bleibt die Nachricht vollständig;
  die Zeile steht zusätzlich zerlegt in `herkunft`, `herkunft_kanal`, `utm_*`, `herkunft_referrer`, `einstiegsseite`.
  Beim Solarrechner hängt das PDF als Kopie an. Abschalten: `"oekovolt_keine_kundenmail": 1`.

## Kundenbühne (Ergänzung zur Spezifikation)

> **Hinweis für `docs/FRAPPE-AT-API-SPEZIFIKATION.md`:** Die Felder unten gehen über Abschnitt 2 der Spezifikation hinaus
> (Auftrag des Koordinators vom 30.09.2026) und sollten dort unter „DocType Projekt“, #1 und #2 nachgetragen werden.

Neue Felder am Projekt (Abschnitte „Kundenbühne“ und „Zitat und Logo“):
`website_url`, `linkedin`, `instagram`, `facebook`, `youtube`, `xing`, `tiktok`, `x` (Data/URL, **nur `https://`** – sonst Fehlermeldung beim Speichern),
`branche`, `portraet`, `portraet_quellen` (eine `https://`-Adresse pro Zeile), `zitat`, `zitat_person`, `freigabe_zitat`, `logo` (Attach Image, öffentlich), `freigabe_logo`.

| Schlüssel | `get_projekte` | `get_projekt` |
|---|---|---|
| `website_url`, `branche` (+ `jahr` wie bisher) | ja | ja |
| `linkedin` … `x` | – | ja (`null`, wenn leer) |
| `portraet` | – | ja |
| `portraet_quellen` | – | **Liste** von URLs (`[]`, wenn leer) |
| `zitat`, `zitat_person` | – | nur mit `freigabe_zitat`, sonst `null` |
| `logo_url` | – | absolut, nur mit `freigabe_logo`, sonst `null` |

Die Freigabe-Häkchen selbst werden nicht ausgeliefert. Eine Freigabe ohne Zitat bzw. ohne Logo lässt sich nicht speichern.

## Löschfrist (Datenschutz)

Täglicher Job `oekovolt_app.website_api.helfer.anfragen_aufraeumen`: Kontakt-, Angebots- und Solarrechner-Anfragen,
die älter als **24 Monate** (ab Anlage) sind und nicht den Status „Angebot erstellt“ oder „Gewonnen“ haben, werden anonymisiert:
Name → „Anonymisiert“, E-Mail, Telefon, Straße, Nachricht, Angaben, Notiz, IP geleert, `anonymisiert = 1`;
PDFs der Solarrechner-Anfragen, Versionen, Kommentare, Benachrichtigungen und Einträge der E-Mail-Warteschlange werden gelöscht.
PLZ, Ort, Thema, Richtwerte und Kampagnen-Felder bleiben für die Statistik. Frist ändern: `"oekovolt_loeschfrist_monate": 36`.
(Website-Termine: eigener Job `termin.loesche_alte_termine`.)

## DocTypes (Modul „Oekovolt App“)

| DocType | Art | Hinweise |
|---|---|---|
| Projekt | normal, `PRJ-#####` | Felder laut Spezifikation 2 plus Kundenbühne. `projekt_website_name` eindeutig (wird zu Slug), `veroeffentlicht`, Anhänge öffentlich; `leistung_label` wird aus `leistung` berechnet, wenn leer. Warnung, wenn zwei veröffentlichte Projekte dieselbe URL ergäben |
| Projekt Bild | Tabelle | `bild` (Attach Image), `bild_alt` |
| Referenzkarte Einstellungen | Single | `firmensitz_name`, `latitude`, `longitude`, `beschreibung`, `umkreis_km` (Standard 100) |
| Kontaktanfrage | `KA-YYYY-#####` | Status wie Angebotsanfrage, Zuständig, Notiz, Herkunft, `anonymisiert` |
| Angebotsanfrage | `AA-YYYY-#####` | Status bis Gewonnen/Verloren, Richtwerte einzeln + JSON |
| Solarrechner Anfrage | `SR-YYYY-#####` | Analyse-Referenz aus dem Dateinamen (`PVA-2026-XXXXXX`), PDF privat |

## Rollen und Rechte

| Rolle | Desk | Rechte |
|---|---|---|
| Website API | nein | lesen: Projekt, Referenzkarte Einstellungen; nur anlegen: Kontaktanfrage, Angebotsanfrage, Solarrechner Anfrage |
| Vertrieb | ja | voll auf alle DocTypes oben; bekommt die Benachrichtigungen |
| System Manager | ja | voll |
| Terminberatung | ja | Termin-Teil |

API-User anlegen: Desk → User `website-api@oekovolt.com`, nur Rolle **Website API**, dann „API Access → Generate Keys“ →
in der Website als `API_KEY`/`API_SECRET` eintragen.

## Einstellungen auf dem Server

- `host_name` in `site_config.json` = `https://backoffice.oekovolt.com` (daraus entstehen die absoluten `bild_url`;
  die Website erlaubt in `next.config.mjs` nur diesen Host).
- Ausgehendes E-Mail-Konto (Email Account, „Default Outgoing“) und laufender Scheduler (`bench enable-scheduler`),
  sonst bleiben Mails in der Email Queue.

## Test ohne Frappe

```bash
cd Import-Backend-Frappe/apps/oekovolt_app
python tests/pruefe_vertrag.py                               # Antwortformen, Eingabeprüfung, DocTypes, Rechte, Pfade
python -m py_compile oekovolt_app/website_api/*.py          # Syntax
for f in $(find . -name "*.json"); do python -m json.tool "$f" > /dev/null; done
```

Die Formatierung und Prüfung steckt in `oekovolt_app/website_api/format.py` (ohne Frappe-Import);
die Whitelist-Methoden sind dünne Hüllen darum (Rollenprüfung, Drosselung, Speichern, E-Mails).

Abnahme gegen den Server: Abschnitt 8 der Spezifikation (`curl`-Aufrufe).
