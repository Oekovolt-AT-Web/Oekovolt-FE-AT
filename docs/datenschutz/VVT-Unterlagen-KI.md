# VVT (Art. 30 Abs. 1 DSGVO) – Unterlagen per Smartphone und KI-Auswertung

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 (ersetzt die deutsche Fassung vom 14.09.2026) · Verantwortlicher:
> Ökovolt Solartechnik GmbH, Gewerbegebiet 10, 5121 Ostermiething ([Deckblatt](00-Uebersicht-VVT.md#verantwortlicher)) ·
> Freigabe: `[OFFEN]` · Prüfung: `[OFFEN]`

Umsetzung: `src/app/api/scan/*`, `src/lib/scan/backend.js`, `src/components/Scan/*`; Backoffice DocType „Solar Lead“
mit `api.py` und `ki.py` (`Import-Backend-Frappe/apps/oekovoltdeutchland/.../doctype/solar_lead/`), API-User
„Kontakt Webformular“. Datenschutzerklärung Punkt 11.

| Angabe | Inhalt |
|---|---|
| **Zweck** | Präzise Photovoltaik-Angebote anhand von Fotos von Stromzähler, Stromrechnung sowie optional Zählerschrank und Gebäude/Dach; optional automatisches Auslesen der Rechnung mit KI |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahme auf Anfrage); KI-Auswertung nur mit ausdrücklicher Einwilligung (Art. 6 Abs. 1 lit. a DSGVO); Übermittlung in die USA auf Grundlage der Einwilligung (Art. 49 Abs. 1 lit. a DSGVO) und von Standardvertragsklauseln (Art. 46 DSGVO) `[OFFEN: Prüfen, ob Anthropic, PBC am EU-US Data Privacy Framework teilnimmt – dann Art. 45 DSGVO; DPA/SCC-Stand dokumentieren]` |
| **Betroffene** | Interessent:innen; weitere Personen, die auf der Rechnung stehen (z. B. Mitbewohner:innen, Ansprechpersonen) |
| **Datenkategorien** | Name, E-Mail, Telefon, PLZ; Rechnerangaben; Fotos/PDF (Pflicht: `zaehler`, `rechnung`; optional `rechnung_2`, `schaltschrank`, `dach`; JPEG, PNG, WebP, HEIC, PDF, max. 8 MB), die Adresse, Kundennummer, Zählernummer/Zählpunkt und ggf. Bankdaten enthalten können; Zählerstand (auf dem Gerät per OCR gelesen); KI-Ergebnis (Verbrauch, Preise, Anbieter, Tarif, Zeitraum, Zählernummer, Beschreibungen von Zählerschrank und Dach); Herkunftsfelder |
| **Empfänger intern** | Rollen **Vertrieb** und **Technik Innendienst** (Lesen/Schreiben), System Manager |
| **Auftragsverarbeiter** | Hosting Website `[OFFEN]`; Backoffice (Hetzner, Nürnberg) `[OFFEN: AV-Vertrag]`; E-Mail-Versand `[OFFEN]`; nur mit Einwilligung: **Anthropic, PBC** (San Francisco, USA), Modell laut Standard `claude-sonnet-5` (`ki.py`, `MODELL_STANDARD`) `[OFFEN: DPA]` |
| **Drittland** | USA (Anthropic) – nur bei Einwilligung. Ohne Einwilligung prüft eine Mitarbeiterin bzw. ein Mitarbeiter die Unterlagen manuell. |
| **Erinnerung** | Einmalige E-Mail 2 Stunden nach dem Start, falls noch keine Unterlagen eingegangen sind (Fenster bis 24 h); darin ein persönlicher Fortsetzen-Link, 72 Stunden gültig, höchstens 10 Aufrufe, nur als SHA-256-Hash gespeichert. Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO (Durchführung der begonnenen Anfrage); keine Werbung, keine weiteren Erinnerungen. `[OFFEN: Datenschutzberatung bestätigen lassen, dass § 174 TKG 2021 nicht greift (kein Werbezweck); sonst gesondertes Opt-in]` |
| **Löschung (umgesetzt)** | Täglicher Job `solar_lead.api.aufraeumen`: nicht abgeschlossene Sitzungen 24 Stunden nach Ablauf von QR-Code bzw. Fortsetzen-Link samt Fotos endgültig löschen; Leads mit Status „Neu“, „In Prüfung“ oder „Verloren“ **12 Monate** nach Anlage samt Fotos und Versionen löschen. |
| **Löschung (offen)** | `[OFFEN: Leads mit anderem Status (z. B. Angebot/Auftrag) werden nicht automatisch gelöscht – Übergang in die Kundenakte und Frist festlegen.]` |
| **TOM** | QR-Token 32 Byte zufällig, nur als SHA-256-Hash im Backoffice, 45 Minuten gültig; `noindex`/`no-referrer` auf den Upload-Seiten; Prüfung von Dateityp (Magic Bytes) und Größe; Drosselung; private Dateiablage mit Rollenrechten; Fotos werden auf dem Gerät verkleinert, EXIF-Daten (Standort, Kamera) entfernt; OCR des Zählerstands auf dem Gerät (Programmdateien vom eigenen Server); Seiten `/scan` und `/fortsetzen` sind von Statistik und Heatmap ausgenommen; TLS; Löschjob. |
| **DSFA** | Schwellwertprüfung empfohlen (Fotos von Rechnungen mit Bank- und Zählerdaten, KI-Einsatz, Drittland). `[OFFEN: Datenschutzberatung]` |
| **Automatisierte Entscheidung** | Nein – die KI-Werte werden von Mitarbeitenden geprüft (Art. 22 DSGVO nicht anwendbar). |
