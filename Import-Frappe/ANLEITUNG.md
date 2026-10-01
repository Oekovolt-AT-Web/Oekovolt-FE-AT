# Import-Frappe – alles, was ins Backoffice muss

Dieser Ordner enthält **alle** Backend-Teile der Website in einem Paket. Die Ordnerstruktur entspricht 1:1 der Frappe-App `oekovoltdeutchland`.

| Was | DocType / Bericht | Wofür |
|---|---|---|
| `doctype/rueckruf` | Rueckruf | Rückruf-Widget (+ gemeinsame Helfer, **wird von PV Analyse, Beratungstermin und Solar Lead gebraucht**) |
| `doctype/beratungstermin` | Beratungstermin | Online-Terminbuchung `/termin` |
| `doctype/pv_analyse` | PV Analyse | PDF-Analyse aus dem Solarrechner |
| `doctype/solar_lead` | Solar Lead | Unterlagen per Smartphone (QR), KI-Auswertung, Erinnerungs-E-Mail |
| `doctype/hinweis`, `doctype/hinweis_nachricht` | Hinweis, Hinweis Nachricht | Hinweisgebersystem (HinSchG) |
| `doctype/veroeffentlichung` | Veroeffentlichung | Newsroom, RSS, TV-Bildschirme, Fediverse |
| `doctype/push_nachricht`, `push_abonnement` | Push Nachricht, Push Abonnement | Push-Benachrichtigungen |
| `doctype/fediverse_follower`, `verteilprotokoll` | Fediverse Follower, Verteilprotokoll | Fediverse (Mastodon, Threads) |
| `report/anfragen_nach_herkunft` | Bericht „Anfragen nach Herkunft“ | Kampagnen-Auswertung |

Leere `__init__.py` sind überall schon enthalten. `"module"` ist in allen JSON-Dateien `Oekovoltdeutchland` – muss zu `modules.txt` der App passen.

**Nicht nötig:** Kontaktformular, Konfigurator und die Inhaltsseiten (Team, Jobs, Produkte …) nutzen die bereits vorhandenen DocTypes. Die Kampagnen-Herkunft steht dort nur als letzte Zeile in der Nachricht.

---

## Reihenfolge

> Vorher: **Backup** der Site: `bench --site <site> backup --with-files`

### Schritt 1 – Rollen anlegen (`1_rollen.csv`)

Desk → **Data Import** → Neu → DocType **Role**, „Insert New Records“ → `1_rollen.csv` hochladen → Import starten.
Bereits vorhandene Rollen meldet der Import als Fehler – das ist unkritisch.

(Alternativ von Hand: Desk → Role → Neu. „Desk Access“ = 0 bei den drei Web-Rollen.)

| Rolle | Desk | Wer bekommt sie |
|---|---|---|
| Hinweis Meldestelle | ja | nur die benannte Meldestelle (HinSchG), 2FA Pflicht |
| Hinweis Webformular | **nein** | nur API-User `hinweis-web` |
| Kontakt Webformular | **nein** | nur API-User `kontakt-web` |
| Kanal Webservice | **nein** | nur API-User `kanal-web` |
| Rückruf Team | ja | wer Rückrufe bearbeitet (bekommt E-Mail + Glocke) |
| Terminberatung | ja | Berater, deren Kalender Termine blockiert |
| Vertrieb | ja | Leads aus PDF-Analyse und Foto-Upload |
| Technik Innendienst | ja | darf Foto-Unterlagen sehen |
| Marketing | ja | pflegt Veröffentlichungen und Push-Nachrichten |

### Schritt 2 – `hooks.py` ergänzen (`2_hooks_ergaenzen.py`)

Inhalt in `apps/oekovoltdeutchland/oekovoltdeutchland/hooks.py` **einfügen**.
Gibt es dort schon `doc_events` oder `scheduler_events`, die Einträge **zusammenführen** – nicht doppelt anlegen.

### Schritt 3 – Dateien kopieren + migrieren (`3_installieren.sh`)

Den ganzen Ordner `Import-Frappe` auf den Server kopieren (z. B. WinSCP oder `scp -r Import-Frappe frappe@<server>:~/`), dann:

```bash
cd ~/Import-Frappe
SITE=backoffice.oekovolt.com BENCH=/home/frappe/frappe-bench bash 3_installieren.sh
```

Das Skript kopiert `doctype/` und `report/` in die App, installiert `anthropic` und `pillow-heif`, führt `bench migrate` aus und startet neu.
Pfad oder Site-Name anders? Einfach `SITE` / `BENCH` anpassen.

<details><summary>Ohne Skript (von Hand)</summary>

1. Inhalt von `oekovoltdeutchland/oekovoltdeutchland/doctype/` nach `apps/oekovoltdeutchland/oekovoltdeutchland/oekovoltdeutchland/doctype/` kopieren.
2. Inhalt von `…/report/` nach `…/oekovoltdeutchland/report/` kopieren (fehlt `report/__init__.py`, leer anlegen).
3. `bench pip install anthropic pillow-heif`
4. `bench --site <site> migrate` und `bench restart`
</details>

> Falls die App per Git deployt wird: die Dateien stattdessen ins Repository der Frappe-App committen und wie gewohnt deployen, danach `migrate`.

### Schritt 4 – Site-Konfiguration (`4_site_config.sh`)

Platzhalter `<…>` ersetzen, dann im `frappe-bench`-Ordner: `SITE=backoffice.oekovolt.com bash ~/Import-Frappe/4_site_config.sh`

| Schlüssel | Wofür |
|---|---|
| `oekovolt_kanal_webhook` / `oekovolt_kanal_secret` | Frappe stößt die Website an (Newsroom, Push, Fediverse) |
| `anthropic_api_key` / `anthropic_model` | KI-Auswertung der Unterlagen (optional) |
| `website_url` | Fortsetzen-Link in der Erinnerungs-E-Mail |

### Schritt 5 – API-User anlegen

Desk → User → Neu, jeweils **nur** die eine Rolle, dann „API Access“ → *Generate Keys*:

| User | Rolle | Keys → Website-Variable |
|---|---|---|
| `kontakt-web@oekovolt.de` | Kontakt Webformular | `KONTAKT_API_KEY` / `KONTAKT_API_SECRET` |
| `hinweis-web@oekovolt.de` | Hinweis Webformular | `HINWEIS_API_KEY` / `HINWEIS_API_SECRET` |
| `kanal-web@oekovolt.de` | Kanal Webservice | `KANAL_API_KEY` / `KANAL_API_SECRET` |

Dann Personen ihre Rollen geben (Tabelle in Schritt 1).

### Schritt 6 – Website-Umgebung (`5_website_env.txt`)

Die Keys aus Schritt 5 und die übrigen Werte in die Hosting-Umgebung der Next.js-Website eintragen und neu deployen. Das ist **keine** Frappe-Einstellung.

### Schritt 7 – Sonstiges im Desk

- **E-Mail-Konto** (ausgehend) muss eingerichtet sein – sonst keine Bestätigungen, Termine mit .ics und Erinnerungen.
- **Worker/Scheduler** laufen (`bench doctor`); Queue `long` für die KI-Auswertung.
- Optional: **Google Calendar**-Integration für die Berater (blockiert belegte Zeiten).
- Optional: Dashboard „Marketing & Anfragen“ mit Number Cards/Charts – siehe `docs/frappe-herkunft/README.md`.

---

## Test nach der Installation

```bash
# Muss 403 liefern (Web-User darf nicht lesen):
curl "https://backoffice.oekovolt.com/api/resource/Hinweis"         -H "Authorization: token KEY:SECRET"
curl "https://backoffice.oekovolt.com/api/resource/Beratungstermin" -H "Authorization: token KEY:SECRET"

# Muss freie/belegte Zeiten liefern:
curl -X POST "https://backoffice.oekovolt.com/api/method/oekovoltdeutchland.oekovoltdeutchland.doctype.beratungstermin.api.belegte_zeiten" \
  -H "Authorization: token KEY:SECRET" -H "Content-Type: application/json" -d '{"art":"video"}'
```

Dann auf der Website durchklicken: Rückruf · Termin buchen · PDF-Analyse · Foto-Upload per QR · Hinweis abgeben + Postfach · Veröffentlichung mit Haken „Website“.
Health-Check: `https://www.oekovolt.de/api/hinweis/health` → 200.

## Ausführliche Doku je Funktion

| Funktion | Datei |
|---|---|
| Rückruf, Termin, CloudTalk | `docs/frappe-rueckruf-termin/README.md` |
| PDF-Analyse | `docs/frappe-pv-analyse/README.md` |
| Foto-Upload, KI, Erinnerung | `docs/frappe-solar-lead/README.md` |
| Hinweisgebersystem (Go-live-Checkliste!) | `docs/frappe-hinweisgebersystem/README.md` |
| Newsroom, Push, Fediverse, TV | `docs/frappe-kanaele/README.md` |
| Kampagnen-Herkunft, Dashboard, Umami | `docs/frappe-herkunft/README.md` |
| Datenschutz (VVT, DSFA) | `docs/datenschutz/` |
