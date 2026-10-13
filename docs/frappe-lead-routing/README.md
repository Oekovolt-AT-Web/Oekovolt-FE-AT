# Lead-Routing, Dubletten, SLA und Eskalation (Speed-to-Lead II) – Frappe-Backend

Stand: 2026-10-11 · Welle A, Paket A06 · App `Import-Backend-Frappe/apps/oekovolt_app`

Jeder Website-Lead (Kontaktanfrage, Angebotsanfrage, Rechner Lead, Solarrechner Anfrage, Website Termin)
wird beim Anlegen im Backoffice automatisch bewertet, auf Dubletten geprüft, einer Vertriebsperson
zugewiesen und mit einer Frist für die Erstreaktion versehen. A-Leads lösen einen Sofortalarm aus; bleibt
die Erstreaktion aus, eskaliert das System in zwei Stufen.

```
Website ─▶ submit_kontakt / submit_angebot / rechner / solarrechner / buche_termin ─▶ doc.insert()
                                                                                        │ after_insert
                 ┌──────────────────────────────────────────────────────────────────────┘
                 ▼
   website_api/lead_eingang.after_insert
     1. segment (falls leer), bundesland, lead_score/lead_klasse/score_gruende (A11), lead_schluessel, eingang_am
     2. Dubletten: gleiche E-Mail oder gleiche E.164-Telefonnummer in 30 Tagen (alle Lead-DocTypes)
     3. Zuständigkeit über „Lead Routing Regel“ → Zuweisung (ToDo), sla_bis
     4. Team-Mail „[A] Angebotsanfrage: …“ mit Block „Frühere Anfragen“
     5. Sofortalarm A-Lead: Webhook (Teams/Slack) und SMS – ohne Personendaten
   website_api/sla.erstreaktion_setzen (on_update) · sla.communication_angelegt (Communication after_insert)
   website_api/sla.pruefen (Cron */5): Eskalation Stufe 1 (15 Min.) und Stufe 2 (60 Min.)
```

Reine Logik (Regelauswahl, Vertretung, Dubletten-Fenster, Geschäftsminuten, SLA-Fristen, Eskalationsstufen,
Alarm-Nutzlast) ist ohne Bench testbar: `python tests/test_lead_routing.py` (52 Tests).

## Inhalt

| Datei | Zweck |
|---|---|
| `oekovolt_app/doctype/lead_routing_regel/` | DocType „Lead Routing Regel“ (Vertriebsleitung schreibt, Vertrieb liest) |
| `website_api/lead_eingang.py` | Eingang: Segment, Score, Dubletten, Routing, Zuweisung, Team-Mail, Alarm |
| `website_api/sla.py` | Geschäftsminuten, SLA-Fristen, Erstreaktion, Eskalation, Desk-Methode `angerufen` |
| `website_api/helfer.py` | `team_benachrichtigen(…, empfaenger=[…])` – feste Empfängerliste (bestehende Aufrufe unverändert) |
| `hooks.py` | `doc_events`, `scheduler_events.cron`, `fixtures` (Rollen, Custom Field, Client Scripts) |
| `fixtures/role.json` | Rollen Vertrieb, Vertriebsleitung, Service, Personal, Einkauf, Marketing, Geschäftsführung, Monitoring (+ Website API, Terminberatung) |
| `fixtures/custom_field.json` | `User.abwesend_bis` (Date) – Vertretungsregel |
| `fixtures/client_script.json` | Desk-Knopf „Angerufen“ je Lead-DocType → `sla.angerufen` |
| `tests/test_lead_routing.py` | Tests ohne Frappe (inkl. Ablauf mit Frappe-Attrappe) |

Voraussetzung: das Kernschema aus **A11** (Felder `segment`, `bundesland`, `lead_score`, `lead_klasse`,
`score_gruende`, `eingang_am`, `erstreaktion_am`, `reaktionszeit_min`, `sla_bis`, `zustaendig`, `lead_schluessel`,
`fruehere_anfragen` auf den fünf Lead-DocTypes) und die Funktionen `lead_score`, `bundesland_aus_plz`,
`lead_schluessel`, `telefon_e164` in `website_api/format.py`. Fehlt ein Feld, wird es übersprungen; fehlen
die Funktionen, greifen Notlösungen (Klasse C, kein Bundesland) – der Lead wird trotzdem angelegt und gemeldet.

## 1. Migration (macht der Mensch)

```bash
cd ~/frappe-bench
bench --site backoffice.oekovolt.com migrate        # DocType, Custom Field, Client Scripts, Rollen (Fixtures)
bench --site backoffice.oekovolt.com clear-cache
bench restart                                       # Scheduler/Worker nehmen den Cron */5 auf
```

Danach prüfen: *Lead Routing Regel* ist als Liste erreichbar; *Benutzer › Abwesend bis* ist sichtbar; auf einer
Angebotsanfrage mit Status „Neu“ erscheint der Knopf **Angerufen**. `bench --site … scheduler status` muss
`enabled` melden, sonst läuft die Eskalation nicht.

Hinweis zur Reihenfolge beim ersten Migrieren: die DocType-Berechtigungen nennen die Rolle *Vertriebsleitung*.
`install.ROLLEN` legt bisher nur Website API, Vertrieb und Terminberatung vor dem DocType-Sync an (Übergabe an
A11/QA, siehe `docs/projekt-doku/anhang/wellen/A06.md`). Scheitert der Sync deshalb, einmal die Rollen über
*Setup › Role* anlegen und erneut `bench migrate` ausführen.

## 2. Schalter in `site_config.json`

| Schlüssel | Wirkung | Standard |
|---|---|---|
| `oekovolt_routing_aktiv` | `1` = Regeln anwenden, Zuweisung erzeugen, Team-Mail an Zuständigen + Vertretung + Sammelpostfach. Fehlt der Schalter (oder ≠ 1), geht die Team-Mail **wie bisher** an alle Nutzer der Rolle Vertrieb (Website Termin: Terminberatung) plus Sammelpostfach; Scoring, Dubletten-Kommentar, SLA-Frist und Alarm laufen trotzdem. | aus |
| `oekovolt_benachrichtigung_an` | Sammelpostfach (Text oder Liste), z. B. `["vertrieb@oekovolt.at"]` – bestehend | – |
| `oekovolt_alarm_webhook` | Incoming-Webhook-URL (Microsoft Teams / Slack). POST JSON `{text, klasse, segment, bezirk, doctype, name, link, sla_bis}` – **ohne Name, E-Mail, Telefon, Adresse**. Läuft als Hintergrundjob nach dem Commit. | aus |
| `oekovolt_alarm_sms_an` | Liste von Handynummern für die A-Lead-SMS; sendet nur, wenn *SMS Settings › SMS Gateway URL* gepflegt ist. Text = `text` der Webhook-Nutzlast (ohne Personendaten). | aus |
| `oekovolt_eskalation_an` | E-Mail-Adressen der Geschäftsführung für Eskalationsstufe 2 (Liste). | – |

Beispiel:

```json
{
  "oekovolt_routing_aktiv": 1,
  "oekovolt_benachrichtigung_an": ["vertrieb@oekovolt.at"],
  "oekovolt_alarm_webhook": "https://oekovolt.webhook.office.com/webhookb2/…",
  "oekovolt_alarm_sms_an": ["+43664…"],
  "oekovolt_eskalation_an": ["gf@oekovolt.at"]
}
```

Empfehlung für den Start: erst Regeln anlegen und die Felder im Desk prüfen (`oekovolt_routing_aktiv`
noch weglassen – Team-Mail wie bisher), dann den Schalter setzen.

## 3. Regeln anlegen (Lead Routing Regel)

Rechte: **Vertriebsleitung** legt an und ändert, **Vertrieb** liest. Felder:

| Feld | Bedeutung |
|---|---|
| Aktiv, Reihenfolge | Regeln werden nach Reihenfolge aufsteigend geprüft; die **erste passende** gilt. Spezielle Regeln (z. B. Freifläche Burgenland) vor allgemeine (Gewerbe Österreich). |
| Nur für Anfrageart | leer = alle; sonst Kontaktanfrage, Angebotsanfrage, Rechner Lead, Solarrechner Anfrage, Website Termin |
| Segment, Bundesland | leer = alle. Segmente wie in A11 (Gewerbe & Industrie, Landwirtschaft, Freifläche/Agri-PV, …) |
| PLZ von / bis | vierstellig, einschließlich; nur gemeinsam. Lead ohne PLZ passt nicht auf eine PLZ-Regel. |
| Mindest-Klasse | A = nur A-Leads, B = A und B, C/leer = alle |
| Zuständig | übernimmt den Lead (Zuweisung, E-Mail, Glocke) |
| Vertretung | übernimmt, wenn „Zuständig“ laut *Benutzer › Abwesend bis* abwesend ist (Datum einschließlich). Wird bei A-Leads nach 15 Geschäftsminuten ohne Erstreaktion mitinformiert. |
| Fallback-Rolle | sind Zuständiger und Vertretung abwesend oder leer: Lead geht an alle aktiven Nutzer der Rolle (z. B. Vertrieb) |

Beispielsatz:

| Reihenfolge | Anfrageart | Segment | Bundesland | PLZ | Mindest-Klasse | Zuständig | Vertretung | Fallback |
|---|---|---|---|---|---|---|---|---|
| 10 | – | Freifläche/Agri-PV | – | – | – | Projektleitung Freifläche | Vertriebsleitung | Vertrieb |
| 20 | – | Gemeinde & öffentliche Hand | – | – | – | Kommunalberatung | Vertriebsleitung | Vertrieb |
| 30 | – | – | Salzburg | – | – | Berater West | Berater Ost | Vertrieb |
| 31 | – | – | Oberösterreich | – | – | Berater West | Berater Ost | Vertrieb |
| 40 | – | – | – | 1000–3999 | – | Berater Ost | Berater West | Vertrieb |
| 900 | – | – | – | – | – | – | – | Vertrieb |

Passt keine Regel, bleibt `zustaendig` leer und die Team-Mail geht an die Rolle wie bisher.
Segmente **Service, Bewerbung, Presse** laufen auf eigenen Spuren: keine Regel, keine Zuweisung, keine
SLA-Frist, kein Alarm – die Mail geht an die Rolle Service bzw. Personal bzw. Marketing (plus Sammelpostfach).

Abwesenheit pflegen: *Benutzer › Abwesend bis* (Custom Field). Nach der Rückkehr leeren – ein Datum in der
Vergangenheit gilt automatisch als anwesend.

## 4. Dubletten

Fenster 30 Tage über alle fünf Lead-DocTypes; Treffer bei gleichem Lead-Schlüssel (E-Mail, A11) **oder**
gleicher Telefonnummer in E.164 (`+43 664 123 45 67` = `0664/1234567`). Folge:

- Feld `fruehere_anfragen` am neuen Lead (eine Zeile je Anfrage), Block „Frühere Anfragen“ in der Team-Mail.
- Ist der älteste Treffer noch **offen** (Status nicht Gewonnen/Verloren/Erledigt/Spam/Abgesagt):
  Kommentar „Erneute Anfrage derselben Person: …“ am Erst-Lead, gleiche Zuständigkeit, **keine zweite Team-Mail**,
  nur eine Glocke an die zuständige Person, kein Alarm.
- Ist der Erst-Lead bereits abgeschlossen: normaler Ablauf (Mail, Routing, Alarm) mit dem Block „Frühere Anfragen“.

Für das Scoring (A11) wird zusätzlich `fruehere_anfragen_anzahl` (Fenster 90 Tage) übergeben.

## 5. SLA, Erstreaktion, Eskalation

Geschäftszeiten und Feiertage kommen ausschließlich aus `termin_logik.py` (Europe/Vienna): Mo–Do 08:00–16:00,
Fr 08:00–13:00, gesetzliche Feiertage Österreich, 24./31.12. Betriebsruhe; Sperrtage aus *Termin Einstellungen*
(z. B. Betriebsurlaub) gelten ebenfalls.

| Klasse | `sla_bis` |
|---|---|
| A | Eingang + 60 Geschäftsminuten (Freitag 12:30 → Montag 08:30) |
| B | Eingang + 4 Geschäftsstunden |
| C | nächster Werktag 10:00 |

`erstreaktion_am` und `reaktionszeit_min` (Geschäftsminuten) werden beim **ersten** Ereignis gesetzt:

1. Statuswechsel weg von „Neu“ (nicht „Spam“) – `on_update`,
2. erste ausgehende E-Mail zum Lead (Communication, Sent),
3. Desk-Knopf **Angerufen** (`sla.angerufen`): setzt zusätzlich Status „Neu“ → „Kontaktversuch“ und einen Kommentar.

Eskalation (`sla.pruefen`, alle 5 Minuten, nur A-Leads der Vertriebsspur mit Status „Neu“ ohne Erstreaktion):

| Geschäftsminuten | Stufe | Empfänger |
|---|---|---|
| ≥ 15 | 1 | zuständige Person, Vertretung laut passender Regel, alle Nutzer der Rolle Vertriebsleitung |
| ≥ 60 | 2 | `oekovolt_eskalation_an` (Geschäftsführung) und Vertriebsleitung |

Jede Stufe wird nur einmal gemeldet; der Marker ist ein Kommentar „Eskalation Stufe n …“ am Lead (sichtbar in der
Zeitleiste). Die Mail enthält Segment, Region (Bundesland + PLZ-Gebiet), zuständige Person und den Desk-Link.

## 6. Webhook und SMS (Datenschutz)

Nutzlast des Alarms:

```json
{
  "text": "A-Lead eingegangen: Gewerbe & Industrie · Oberösterreich · PLZ-Gebiet 51xx · Angebotsanfrage AA-2026-00042 · Erstreaktion bis 12.10. 11:00 · https://backoffice…/app/angebotsanfrage/AA-2026-00042",
  "klasse": "A", "segment": "Gewerbe & Industrie", "bezirk": "Oberösterreich · PLZ-Gebiet 51xx",
  "doctype": "Angebotsanfrage", "name": "AA-2026-00042", "link": "https://backoffice…", "sla_bis": "12.10. 11:00"
}
```

Vor dem Versand prüft `nutzlast_ohne_personendaten` zur Laufzeit, dass weder Personenfelder noch deren Werte
(Name, Firma, E-Mail, Telefon, Adresse, Nachricht, IP) enthalten sind; andernfalls wird der Alarm unterdrückt und
protokolliert. Teams-Webhooks akzeptieren `{"text": …}`, Slack ebenso; die übrigen Felder sind Zusatz für Workflows.
Ohne `oekovolt_alarm_webhook` bzw. ohne SMS-Gateway passiert nichts.

## 7. Team-Mail

Betreff mit Klasse vorne, z. B. `[A] Angebotsanfrage: Gewerbe – Muster GmbH, 5121 Ostermiething`; darunter der
bisherige Inhalt aus `format.team_mail_*`, ergänzt um Lead-Klasse/Punkte, Segment, Bundesland, Zuständig,
„Erstreaktion bis“, Score-Gründe und den Block „Frühere Anfragen“. Für „Rechner Lead“ und „Website Termin“ nutzt
`lead_eingang` `format.team_mail_rechner` bzw. `format.team_mail_termin`, sobald A11 sie anlegt; bis dahin eine
allgemeine Tabelle (Name, Firma, E-Mail, Telefon, PLZ/Ort, Thema, Terminart, Termin, Rechner, Nachricht, Seite).

Die Website-Module (`kontakt.py`, `angebot.py`, `rechner.py`, `solarrechner.py`, `termin.py`) dürfen **keine**
eigene Team-Mail mehr senden (A11 entfernt die direkten `team_benachrichtigen`-/`berater_benachrichtigen`-Aufrufe),
sonst kommt sie doppelt.

## 8. Fehlerverhalten

Alles in `after_insert`, `on_update` und im Cron ist in `try/except` gekapselt und schreibt bei Problemen einen
Error Log (`Lead-Eingang … fehlgeschlagen`, `SLA-Prüfung … fehlgeschlagen`). Ein Fehler im Routing verhindert
nie das Anlegen des Leads oder die Antwort an die Website.

## 9. Tests

```bash
cd Import-Backend-Frappe/apps/oekovolt_app
python tests/test_lead_routing.py          # 52 Tests, ohne Frappe
python -m py_compile oekovolt_app/website_api/lead_eingang.py oekovolt_app/website_api/sla.py oekovolt_app/hooks.py
```

Abgedeckt: Geschäftsminuten über Wochenende, Feiertag (Nationalfeiertag 26.10.2026) und Betriebsruhe, Sperrtage
aus Termin Einstellungen, Freitag 12:30 + 60 → Montag 08:30, SLA-Fristen A/B/C, Eskalationsstufen (jede nur einmal),
Regelauswahl nach Reihenfolge/Filtern, Vertretung bei Abwesenheit, Dubletten-Fenster 30 Tage mit E-Mail und
E.164-Telefon, Alarm-Nutzlast ohne Personendaten, Fixtures-Namen in `hooks.py`, und der gesamte Eingangsablauf
mit einer Frappe-Attrappe (ohne Schalter wie bisher, mit Schalter Routing + Alarm, Dublette ohne zweite Mail,
eigene Spur ohne Alarm, Erstreaktion, Eskalation).
