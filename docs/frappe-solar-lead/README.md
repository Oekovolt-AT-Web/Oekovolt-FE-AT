# Unterlagen per Smartphone (QR-Handshake) & KI-Auswertung

## Ablauf

```
PC (Solarrechner)                         Next.js                              Frappe (Hetzner)
─────────────────                         ───────                              ────────────────
„Präzises Angebot anfordern“ ──POST /api/scan/start──▶ Token (32 Byte) erzeugen ──sitzung_starten(hash)──▶ Solar Lead (offen)
QR-Code + EventSource ◀──── SSE /api/scan/<token>/status ◀── pollt sitzung_status alle 1,5 s ◀──────────────┘

Smartphone /scan/<token>
  öffnet Seite ──POST verbunden──▶ sitzung_verbunden ──▶ PC: „Smartphone verbunden“
  Foto (Kamera) → verkleinern, EXIF/GPS entfernt, OCR Zählerstand auf dem Gerät (Tesseract, eigener Server)
             ──POST foto (multipart)──▶ Dateityp an Magic Bytes prüfen ──foto_speichern──▶ File (privat) am Solar Lead
  „Daten an PC senden“ + Einwilligung(en) ──POST abschliessen──▶ sitzung_abschliessen ──▶ Vertrieb: E-Mail + Glocke
                                                                                       └─ nur mit KI-Einwilligung:
                                                                                          RQ-Job ki.analysieren → Claude
PC: „Vielen Dank! Ihre Daten wurden übermittelt.“  (+ erkannte Werte → „In den Rechner übernehmen“)
```

## Erinnerung bei Abbruch (Fortsetzen-Link)

```
Solar Lead „Wartet auf Unterlagen“, 2–24 h alt, noch keine Erinnerung
  └─ erinnerungen_senden (alle 15 Min.) ──▶ EINE E-Mail mit https://www.oekovolt.de/fortsetzen/<token> (72 h gültig)
Kunde öffnet Link ──GET /fortsetzen/<token>──▶ fortsetzen_info (nur lesen: Vorname, Rechnerwerte, vorhandene Fotos)
Klick „Weiter“ ──POST /api/scan/fortsetzen──▶ fortsetzen_starten: neuer Handy-Code (45 Min.), „Über Erinnerung“ = 1
  Smartphone → direkt zur Foto-Seite · Computer → QR-Code fürs Handy
```

- **Nur eine Erinnerung** je Anfrage, keine weitere, wenn inzwischen eine andere Anfrage mit derselben E-Mail-Adresse abgeschlossen wurde.
- **Link-Scanner:** Das Öffnen des Links ändert nichts. Virenscanner in E-Mail-Programmen, die Links vorab aufrufen, verbrauchen ihn also nicht. Erst der Klick auf „Weiter“ erzeugt einen neuen Code, höchstens 10-mal.
- **Erfolg messen:** Filter „Über Erinnerungs-Link fortgesetzt“ in der Liste Solar Lead; in Umami das Ereignis `scan_fortgesetzt`.
- **Aufräumen:** Nicht abgeschlossene Anfragen werden 24 Stunden nach Ablauf des Fortsetzen-Links gelöscht.

## Sicherheit

- **Einmal-Token:** zufällig, 256 Bit, nur im QR-Code. Frappe speichert ausschließlich den SHA-256-Hash. Das Token ist 45 Minuten gültig.
- **Seitenschutz:** `/scan/*` hat `noindex` und `Referrer-Policy: no-referrer`, wird nicht gecacht und steht nicht in der Sitemap.
- **Uploads:**
  - höchstens 8 MB je Datei und 25 Uploads je Sitzung
  - Dateityp wird an den ersten Bytes geprüft: JPEG, PNG, WebP, HEIC, PDF (PDF nur bei der Rechnung)
  - Dateien sind privat in Frappe gespeichert und nur für die Rollen `Vertrieb` und `Technik Innendienst` lesbar
- **Datenminimierung:**
  - Das Smartphone entfernt GPS- und Kameradaten beim Verkleinern.
  - Die Texterkennung bleibt auf dem Gerät.
  - Claude übernimmt ausdrücklich keine Bankdaten.
- **Missbrauchsschutz:** Rate-Limits je E-Mail und global, Honeypot-Feld, Einwilligung ist Pflicht.

## Installation in Frappe

1. **Dateien:** `solar_lead/` nach `oekovoltdeutchland/oekovoltdeutchland/doctype/solar_lead/` kopieren (inkl. `__init__.py`).
   - **Voraussetzungen:** DocTypes aus `docs/frappe-rueckruf-termin` (gemeinsame Helfer, Rolle `Kontakt Webformular`).
2. **Rollen:** `Vertrieb` und `Technik Innendienst`.
3. **Python-Pakete:** `bench pip install anthropic pillow-heif` (HEIC-Fotos von iPhones).
4. **Konfiguration:**
   ```
   bench --site <site> set-config anthropic_api_key "sk-ant-…"
   bench --site <site> set-config anthropic_model "claude-sonnet-5"      # optional, Standard
   ```
   Ohne `anthropic_api_key` entfällt die KI-Auswertung. Die Fotos gehen trotzdem an den Vertrieb.
5. **Worker:** Die Queue `long` muss laufen, das ist bei `bench start` bzw. in Produktion per supervisor Standard.
6. **Scheduler:** in `hooks.py` eintragen:
   ```python
   scheduler_events = {
       "daily": ["oekovoltdeutchland.oekovoltdeutchland.doctype.solar_lead.api.aufraeumen"],
       "cron": {"*/15 * * * *": ["oekovoltdeutchland.oekovoltdeutchland.doctype.solar_lead.api.erinnerungen_senden"]},
   }
   ```
   Für die Erinnerungs-E-Mail muss ein ausgehendes E-Mail-Konto eingerichtet sein. Die Adresse der Website ist optional (Standard `https://www.oekovolt.de`): `bench --site <site> set-config website_url "https://www.oekovolt.de"`
7. **Abschluss:** `bench --site <site> migrate` und `bench restart`.

## Website (Next.js)

Die Funktion nutzt die vorhandenen Frappe-Zugangsdaten (`KONTAKT_API_KEY` bzw. `API_KEY`). Einmalig nach Updates von tesseract.js ausführen:

```
node scripts/tesseract-assets.mjs     # OCR-Dateien nach public/tesseract/
```

**Hosting auf Hetzner:** Der Live-Status läuft über Server-Sent Events. Hinter nginx für `/api/scan/` Pufferung abschalten, der Header `X-Accel-Buffering: no` wird bereits gesetzt:

```nginx
location /api/scan/ { proxy_pass http://127.0.0.1:3000; proxy_buffering off; proxy_read_timeout 310s; }
```

**Lokal testen ohne Backoffice:** `KANAL_DEMO=1 npm run dev`. Dann arbeitet ein Speicher im Arbeitsspeicher, und eine KI-Auswertung wird nur simuliert.

## Datenschutz – vor Go-live

- [ ] **Anthropic:** AV-Vertrag (DPA) mit Anthropic abschließen (Commercial Terms). Standardvertragsklauseln und die Zusage „keine Nutzung zum Training“ prüfen.
- [ ] **Einwilligungstext:** Datenschutzerklärung `#unterlagen` vom DSB freigeben lassen, besonders den Einwilligungstext und die Rechtsgrundlage für die Drittlandübermittlung.
- [ ] **VVT:** Eintrag `docs/datenschutz/VVT-Unterlagen-KI.md` ergänzen.
- [ ] **Hosting:** Access-Logs des Webservers für `/scan/` und `/api/scan/` ohne vollständige URL oder anonymisiert führen, denn das Token steht im Pfad.
