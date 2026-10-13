# Referenz-Freigabe per Einmal-Link – Vertrag Website ↔ Frappe (Welle A07)

Stand: 2026-10-11 · Ergänzung zur zentralen Spezifikation `docs/FRAPPE-AT-API-SPEZIFIKATION.md`
(dort nicht nachgetragen – QA verlinkt diese Datei). Rechtlicher Hintergrund: Social Proof nur mit
dokumentierter Freigabe; „Solar-Siegel“ ist seit 27.09.2026 (UWG-Novelle zur EmpCo-RL (EU) 2024/825)
durch die sachliche **Projekt-Plakette** ersetzt.

```
Vertrieb/Marketing (Desk)            Frappe                                   Website (Next.js)
─────────────────────────            ──────                                   ─────────────────
Referenz Freigabe anlegen ─────────▶ Token (32 Byte) erzeugen, SHA-256 speichern,
                                     Link EINMAL im Desk anzeigen
Link per E-Mail an den Kunden (Vorlage docs/seo/vorlagen/kunden-freigabe-mail.md)
Kunde öffnet /referenzen/freigabe/<token> ◀──────────────────────────────────── freigabe_lesen (Gast, POST)
Kunde kreuzt einzeln an, bestätigt Vertretungsbefugnis ─▶ freigabe_speichern (Gast) ◀── /api/referenz-freigabe
                                     Token verbraucht, Widerruf-Token erzeugt,
                                     Bestätigung an Kunden (Kopie + Widerrufslink), Glocke/E-Mail Vertrieb
Website liest get_freigaben (Rolle „Website API“, 10 min Cache) ◀──────────── src/lib/kundenbuehneServer.js
Kunde klickt Widerrufslink ?widerruf=1 ─▶ widerrufen (Gast) ─▶ alle Häkchen 0, widerrufen_am
```

## Dateien

| Datei | Zweck |
|---|---|
| `oekovolt_app/oekovolt_app/doctype/referenz_freigabe/referenz_freigabe.json` | DocType „Referenz Freigabe“ |
| `…/referenz_freigabe.py` | Controller: Prüfung, Token beim Anlegen, Status, Cache |
| `…/freigabe_logik.py` | reine Logik (Token, Hash, IP-Kürzel, Auswahlprüfung, Status, Mails) – ohne Frappe testbar |
| `…/test_freigabe_logik.py` | `python oekovolt_app/oekovolt_app/doctype/referenz_freigabe/test_freigabe_logik.py` |
| `oekovolt_app/website_api/freigabe.py` | Whitelist-Methoden (siehe unten) |

Installation: Dateien liegen im App-Ordner, `bench --site <site> migrate`, `bench restart`. Die Rolle **Marketing**
kommt über die Fixture `fixtures/role.json` bzw. `install.rollen_anlegen` (in Welle A von A06/A11 ergänzt). Kein Hook nötig: Whitelist-Methoden
werden direkt aufgerufen; Cache-Invalidierung läuft im Controller (`on_update`/`on_trash`).
site_config optional: `"oekovolt_website_url": "https://www.oekovolt.com"` (Basis des Einmal-Links).

## DocType „Referenz Freigabe“ (`RF-{YYYY}-{#####}`)

| Feld | Typ | Hinweis |
|---|---|---|
| `projekt` | Link Projekt | Pflicht |
| `status` | Select, read-only | Offen · Freigegeben · Widerrufen · Abgelaufen · Link verbraucht (aus Zeitstempeln berechnet) |
| `kunde_firma`, `ansprechperson`, `funktion`, `email` | Data | E-Mail wird **nie** an die Website geliefert |
| `token_hash` | Data, hidden, unique | SHA-256 des Einmal-Tokens; nach dem Speichern geleert |
| `widerruf_token_hash` | Data, hidden | SHA-256 des Widerruf-Tokens aus der Bestätigungsmail |
| `gueltig_bis` | Datetime | 30 Tage ab Link-Erzeugung |
| `vertretungsbefugnis_bestaetigt` | Check | Pflicht auf der Seite |
| `freigabe_name`, `freigabe_logo`, `freigabe_zitat`, `freigabe_fotos_anlage`, `freigabe_plakette`, `freigabe_livedaten`, `freigabe_messwerte` | Check, read-only | setzt nur der Kunde; Standard 0 |
| `zitat_text`, `zitat_person_funktion` | Small Text / Data | nur mit `freigabe_zitat` |
| `text_version` | Data | Version des Erklärungstexts (Website `FREIGABE_TEXT_VERSION`) |
| `freigegeben_am`, `widerrufen_am` | Datetime | Nachweis |
| `ip_kuerzel` | Data | IPv4 ohne letztes Oktett, IPv6 /48 |
| `notiz` | Small Text | intern |

Rechte: System Manager (alles), **Vertrieb** und **Marketing** (lesen, anlegen, schreiben – die Häkchen sind
read-only). Beim Anlegen zeigt der Desk den Link genau einmal (`frappe.msgprint`). Ein neuer Link:
`neuer_link(name)` (unten); er macht den alten ungültig. Ein formloser Widerruf per E-Mail wird vom
System Manager über `widerrufen_am` eingetragen (setzt alle Häkchen zurück).

## Methoden

### `POST oekovolt_app.website_api.freigabe.freigabe_lesen` (Gast)
Body `{token, ip_adresse}` → ohne E-Mail/Hash:
```json
{"status":"offen","kunde_firma":"…","ansprechperson":"…","funktion":"…","gueltig_bis":"2026-11-10",
 "text_version":"","projekt":{"titel":"…","ort":"…","jahr":2025,"kwp":248.0,"slug":"halle-muster"}}
```
`status`: `offen` · `freigegeben` · `widerrufen` · `abgelaufen` · `link_verbraucht`. Unbekannter Token → 404 (`DoesNotExistError`).

### `POST oekovolt_app.website_api.freigabe.freigabe_speichern` (Gast)
Body `{token, auswahl, ip_adresse}`; `auswahl` als JSON-Text oder Objekt:
`{name, logo, zitat, zitat_text, zitat_person_funktion, fotos_anlage, plakette, livedaten, messwerte, vertretungsbefugnis_bestaetigt, text_version}`.
Pflicht: `vertretungsbefugnis_bestaetigt`; `zitat` nur mit Wortlaut (≥ 10 Zeichen, ≤ 600) und Person/Funktion.
Alles andere ist frei kombinierbar – auch „nichts“ ist eine gültige Antwort. Der Link ist danach verbraucht
(Zeilensperre `FOR UPDATE` gegen Doppelaufruf). Antwort `{"status":"freigegeben","freigegeben_am":"2026-10-11 14:02"}`.
Fehler: 404 ungültig/verbraucht/abgelaufen, 417 `ValidationError` mit Text (Website zeigt ihn), 429 Drosselung.

### `POST oekovolt_app.website_api.freigabe.widerrufen` (Gast)
Body `{token, ip_adresse}` mit dem **Widerruf-Token** aus der Bestätigungsmail → alle Häkchen 0,
`widerrufen_am`, Glocke/E-Mail an Vertrieb. Antwort `{"status":"widerrufen","widerrufen_am":"…"}`. Idempotent.

### `GET oekovolt_app.website_api.freigabe.get_freigaben` (Rolle „Website API“, Token)
Nur wirksame Freigaben (freigegeben, nicht widerrufen), je Projekt die jüngste, **ohne E-Mail, Hash, IP**:
```json
[{"projekt_website_name":"halle-muster","freigabe_name":1,"freigabe_logo":0,"freigabe_zitat":1,
  "freigabe_fotos_anlage":1,"freigabe_plakette":1,"freigabe_livedaten":0,"freigabe_messwerte":1,
  "zitat_text":"…","zitat_person_funktion":"…","freigegeben_am":"2026-10-11","text_version":"2026-10-11-v1"}]
```
Cache 10 Minuten (`oekovolt_app:freigaben:*`), geleert bei jeder Änderung eines Datensatzes.

### `POST oekovolt_app.website_api.freigabe.neuer_link` (Rollen Vertrieb/Marketing)
Body `{name}` → `{"link":"https://www.oekovolt.com/referenzen/freigabe/<token>","gueltig_bis":"…"}`.

## Drosselung und Sicherheit

- Gast-Methoden: `@rate_limit(120/10 min)` je aufrufender IP (der Next-Server) **plus** 10 Aufrufe je Besucher-IP
  (`ip_adresse`, vom Next-Server gesetzt) und je Token in 10 Minuten.
- Website-Proxy `/api/referenz-freigabe`: nur POST, JSON ≤ 24 KB, gleiche Herkunft (Origin/Sec-Fetch-Site),
  5 Aufrufe je Besucher und 10 Minuten.
- Token nur im Link (43 Zeichen base64url); Seite `noindex, nofollow`, `Cache-Control: no-store`,
  `Referrer-Policy: no-referrer`. Das Öffnen des Widerrufslinks ändert nichts – erst der Klick.
- Logodatei: wird am **Projekt** hochgeladen (Feld `logo`, öffentlich); die Website zeigt sie nur mit
  `freigabe_logo` aus dieser Freigabe (bzw. – Altbestand ohne Datensatz – mit `freigabe_logo` am Projekt).

## Website-Seite

`src/lib/kundenbuehneServer.js` lädt `get_freigaben` (Fehler → **nichts** freigegeben) und führt sie in
`kundeZusammenfuehren({api, eintrag, freigabe})` (`src/lib/kundenbuehne.js`) zusammen: Backoffice-Datensatz
gewinnt über `src/data/kunden.js`. `kit.plakette` steuert `/siegel/<slug>` (404 ohne Freigabe), `kit.social`/`kit.esg`
(= Namensfreigabe) die Kit-Seiten, `freigabe.messwerte` den Einsatz des Backoffice-Ertrags.

## Test

```bash
cd Import-Backend-Frappe/apps/oekovolt_app
python oekovolt_app/oekovolt_app/doctype/referenz_freigabe/test_freigabe_logik.py

# Gast-Aufruf (ohne Token) – muss 404 liefern:
curl -X POST ".../api/method/oekovolt_app.website_api.freigabe.freigabe_lesen" -H "Content-Type: application/json" -d '{"token":"x"}'
# Darf NICHT funktionieren (403): Listenzugriff mit dem Website-Token
curl ".../api/resource/Referenz%20Freigabe" -H "Authorization: token KEY:SECRET"
```

**Vor Einsatz anwaltlich prüfen:** Erklärungstext (`FreigabeFormular.js`), Vorlage
`docs/datenschutz/vorlage-referenzfreigabe.md`, Mailvorlage `docs/seo/vorlagen/kunden-freigabe-mail.md`.
