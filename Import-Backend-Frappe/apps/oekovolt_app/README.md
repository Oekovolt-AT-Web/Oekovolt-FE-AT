# oekovolt_app – Backoffice-Schnittstelle für www.oekovolt.com (AT)

Frappe-App (v15) für das österreichische Backoffice. Sie liefert Referenzprojekte an die Website und nimmt
Kontakt-, Angebots- und Solarrechner-Anfragen sowie Rechner-Leads (Lead-Gate mit E-Mail-Bestätigung) entgegen. Vertrag: `docs/FRAPPE-AT-API-SPEZIFIKATION.md` im Website-Repository.
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
| `oekovolt_app.website_api.rechner.submit_rechner_lead` | POST JSON | → Rechner Lead (Lead-Gate, #17); mit `bestaetigung: "double-opt-in"` Bestätigungsmail |
| `oekovolt_app.website_api.rechner.sende_bestaetigung` | POST JSON, **Gast** | „Erneut senden“ (#18): `lead` + `email`, frühestens nach 60 s, max. 5 Mails |
| `oekovolt_app.website_api.rechner.bestaetige_lead` | POST JSON, **Gast** | Link aus der Mail (#19): `token` → `{ok, lead_id, kennung, rueckkehr}` |
| `oekovolt_app.website_api.termin.*` | | siehe `termin.py` (Termin-Teil) |

Alle Methoden oben außer den Gastmethoden (`sende_bestaetigung`, `bestaetige_lead`, `termin.buche_termin`) verlangen die
Rolle **Website API** (oder System Manager); Header `Authorization: token KEY:SECRET`.

- **Projekt-Antworten** liegen 10 Minuten im Redis-Cache. Speichern/Löschen eines Projekts oder der Referenzkarte-Einstellungen leert ihn.
  Die Website cached zusätzlich 10 Minuten (`revalidate: 600`).
- **Formulare:** Honeypot `website` gefüllt → Erfolg ohne Speichern. Pflichtfelder/Längen/E-Mail/PLZ (4–5 Ziffern) werden geprüft;
  Fehler kommen als `frappe.throw` mit deutschem Text (die Website zeigt ihn an). Bei Kontakt dürfen PLZ und Straße leer sein (Award, Sponsoring).
  Telefon ist bei Kontakt und Angebot optional (Pflicht nur mit `rueckruf_ok = 1`), beim Solarrechner Pflicht; ist es gesetzt,
  muss es sich nach E.164 normalisieren lassen (gleiche Regeln wie Website und Termin-Teil) und wird so gespeichert.
  Statt des Häkchens `einwilligung` genügt ein angezeigter Hinweistext (`einwilligung_id` auf `-info`, Art. 6 Abs. 1 lit. b).
- **Drosselung** je `ip_adresse` und Stunde: Kontakt 5, Angebot 5, Solarrechner 10, Rechner Lead 5 je IP und 5 je E-Mail → HTTP 429.
  Anpassbar per `site_config.json`: `"oekovolt_drossel": {"kontakt": 10, "rechner": 20}`.
- **Team-Benachrichtigung:** seit Welle A11 ausschließlich über `lead_eingang.after_insert` (Welle A06: Routing, Score,
  Dubletten, SLA – `docs/frappe-lead-routing/README.md`). Ohne `oekovolt_routing_aktiv` wie bisher an alle aktiven Nutzer der
  Rolle **Vertrieb** (Termine: **Terminberatung**) plus `"oekovolt_benachrichtigung_an": [...]`, Reply-To = Kunde.
- **Bestätigungs-E-Mail an den Kunden** ohne Freitext aus der Anfrage (keine Nachricht, keine Adresse, keine Firma, keine
  Herkunft), mit gehärteter Anrede, Referenz im Betreff, Block „So geht es weiter“ (ohne Zeitzusage) und bei Gewerbe der
  Unterlagen-Checkliste. Im Datensatz bleibt die Nachricht vollständig; die Herkunftszeile steht zusätzlich zerlegt in
  `herkunft`, `herkunft_kanal`, `utm_*`, `herkunft_referrer`, `einstiegsseite`. Beim Solarrechner hängt das PDF als Kopie an.
  Abschalten: `"oekovolt_keine_kundenmail": 1`. Links in Mails: `"oekovolt_website_url": "https://www.oekovolt.com"`.

## Vertrieb – Speed-to-Lead I (Welle A11)

Alle fünf Lead-DocTypes (Kontaktanfrage, Angebotsanfrage, Rechner Lead, Solarrechner Anfrage, Website Termin) haben den Abschnitt
**Vertrieb** und **Qualifizierung**: `segment`, `firma`, `bundesland`, `plz`, `lead_score`, `lead_klasse`, `score_gruende`,
`eingang_am`, `erstreaktion_am`, `reaktionszeit_min`, `sla_bis`, `zustaendig`, `lead_schluessel`, `fruehere_anfragen`,
`rueckruf_ok`, `kontakt_ok`, `einwilligung_id`, `einwilligung_text_version`, `rolle`, `gremium`, `zeitplan`, `verlustgrund`.
Status-Pipeline: Neu → Kontaktversuch → Qualifiziert → Termin vereinbart → Angebot erstellt → Verhandlung → Gewonnen | Verloren |
Erledigt | Spam („In Bearbeitung“ bleibt gültig). Details, Werte und Scoring-Tabelle: Spezifikation Abschnitt 3a.

Reine Funktionen in `website_api/format.py` (von `lead_eingang.py`, A06, genutzt):

| Funktion | Zweck |
|---|---|
| `lead_score(daten, quelle)` → `(score, klasse, gruende)` | Fit (50) + Absicht (35) + Engagement (15); A ≥ 70, B ≥ 45. **Gewichte nur in `SCORE_GEWICHTE` ändern** (Vertriebsleitung) |
| `bundesland_aus_plz(plz)` | PLZ-Bereichstabelle `PLZ_BEREICHE` (Ausnahmen zuerst: 5121 = OÖ, 1300 = NÖ, 9900 = Tirol) |
| `lead_schluessel(email)` | E-Mail normalisiert (Dubletten/Engagement) |
| `telefon_e164(tel)` | E.164 (AT/DE/CH wie Website; Ausland mit Vorwahl) oder None |
| `anrede_name(...)` | Anrede-Härtung für Kundenmails |
| `rechner_name(kennung)` | `RECHNER_NAMEN` (= `src/data/leadRechner.js`), unbekannt → „Ihr Rechenergebnis“ |
| `team_mail_rechner`, `team_mail_termin` | Team-Mails für Rechner Lead und Website Termin (lead_eingang nutzt sie automatisch) |

## Lead-Gate mit E-Mail-Bestätigung (Rechner Lead, #17–#19)

1. Die Website (`/api/rechner_lead`, A09) ruft `submit_rechner_lead` mit `bestaetigung: "double-opt-in"` auf.
2. Das Backend legt den Lead an, speichert nur den **sha256-Hash** des Tokens (24 h gültig) und schickt die Mail mit
   `https://<website>/freischalten?token=…`.
3. `/freischalten` (A09) ruft `bestaetige_lead(token)` → `{ok, lead_id, kennung, rueckkehr}`; der Link ist danach verbraucht.
   Dann geht die Ergebnis-Mail (Ergebnis-Link, „So geht es weiter“, neutraler Terminlink) an den Kunden.
4. „Erneut senden“: `sende_bestaetigung(lead, email)` – frühestens nach 60 s, höchstens 5 Mails, Antwort verrät nichts.
5. Unbestätigte Leads löscht `rechner.unbestaetigte_loeschen` (täglich) nach **30 Tagen** endgültig.

Pflicht sind nur Vorname, Nachname, E-Mail (Art. 6 Abs. 1 lit. b DSGVO). Telefon nur mit dem freiwilligen Häkchen `kontakt_ok`.
Kein Newsletter, keine Werbe-Einwilligung. Ohne Kundenmails (`oekovolt_keine_kundenmail`) steht der Link im `developer_mode`
im Log `oekovolt_app`.

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

Täglicher Job `oekovolt_app.website_api.helfer.anfragen_aufraeumen`: Kontakt-, Angebots-, Solarrechner-Anfragen und Rechner Leads,
die älter als **24 Monate** (ab Anlage) sind und nicht den Status „Termin vereinbart“, „Angebot erstellt“, „Verhandlung“
oder „Gewonnen“ haben, werden anonymisiert (seit A11 auch Firma, Lead-Schlüssel, Gremium, frühere Anfragen; beim Rechner Lead
Ergebnis und Ergebnis-JSON):
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
| Solarrechner Anfrage | `SR-YYYY-#####` | Analyse-Referenz aus dem Dateinamen (`PVA-2026-XXXXXX`), PDF privat, Herkunftsfelder |
| Rechner Lead | `RL-YYYY-#####` | Lead-Gate: Werkzeug-Kennung, Ergebnis (Text/JSON/Link), E-Mail-Bestätigung (Token-Hash, Ablauf), Vertrieb |
| Website Termin | `T-YYYY-######` | Termin-Teil; seit A11 mit Vertrieb, Herkunftsfeldern und `bezug` |

## Rollen und Rechte

| Rolle | Desk | Rechte |
|---|---|---|
| Website API | nein | lesen: Projekt, Referenzkarte Einstellungen; nur anlegen: Kontaktanfrage, Angebotsanfrage, Solarrechner Anfrage, Rechner Lead |
| Vertrieb | ja | voll auf alle Anfrage-DocTypes und Rechner Lead; Website Termin lesen/schreiben/auswerten; bekommt die Benachrichtigungen |
| System Manager | ja | voll |
| Terminberatung | ja | Termin-Teil |

API-User anlegen: Desk → User `website-api@oekovolt.com`, nur Rolle **Website API**, dann „API Access → Generate Keys“ →
in der Website als `API_KEY`/`API_SECRET` eintragen.

## Einstellungen auf dem Server

- `host_name` in `site_config.json` = `https://backoffice.oekovolt.com` (daraus entstehen die absoluten `bild_url`;
  die Website erlaubt in `next.config.mjs` nur diesen Host).
- Ausgehendes E-Mail-Konto (Email Account, „Default Outgoing“) und laufender Scheduler (`bench enable-scheduler`),
  sonst bleiben Mails in der Email Queue.

## Migration (Welle A11)

Nur beschreiben – **ausführen macht der Mensch**:

```bash
bench --site <at-backoffice> migrate          # übernimmt die geänderten DocType-JSONs (modified 2026-10-12) und legt „Rechner Lead“ an
bench --site <at-backoffice> clear-cache
```

- Alle neuen Felder sind optional; bestehende Datensätze bleiben gültig (Status „In Bearbeitung“ bleibt erlaubt).
- A06 (Routing/SLA, `hooks.py`) und A11 gemeinsam einspielen – sonst fehlt die Team-Mail (A11 allein) bzw. kommt doppelt (A06 allein).
- Täglichen Job `oekovolt_app.website_api.rechner.unbestaetigte_loeschen` in `hooks.py` → `scheduler_events.daily` eintragen
  (Datei gehört A06; siehe Wellen-Notiz A11, Übergabe).
- `site_config.json`: `oekovolt_website_url`, optional `oekovolt_drossel` (`rechner`, `rechner-mail`, `bestaetigung`).

## Test ohne Frappe

```bash
cd Import-Backend-Frappe/apps/oekovolt_app
python tests/pruefe_vertrag.py                               # Antwortformen, Eingabeprüfung, DocTypes, Rechte, Pfade,
                                                             # Scoring, PLZ, Anrede, Rechnernamen, Kundenmails, Token, Kernschema
python tests/test_lead_routing.py                            # Routing/SLA (A06)
python -m py_compile oekovolt_app/website_api/*.py          # Syntax
for f in $(find . -name "*.json"); do python -m json.tool "$f" > /dev/null; done
```

Die Formatierung und Prüfung steckt in `oekovolt_app/website_api/format.py` (ohne Frappe-Import);
die Whitelist-Methoden sind dünne Hüllen darum (Rollenprüfung, Drosselung, Speichern, E-Mails).

Abnahme gegen den Server: Abschnitt 8 der Spezifikation (`curl`-Aufrufe).
