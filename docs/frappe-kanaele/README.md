# Ausspielkanäle: Newsroom, RSS, Info-Bildschirme (SCADA), Push, Fediverse

Im Backoffice wird **einmal** gepflegt; per Haken entscheiden Sie je Beitrag, **wo** er erscheint.

| Kanal | Pflege im Backoffice | Ausspielung |
|---|---|---|
| Website / Newsroom | Veröffentlichung → „Website“ | `/presse`, `/presse/<slug>` (NewsArticle-Schema) |
| RSS / JSON-Feed | Veröffentlichung → „RSS- und JSON-Feed“ | `/presse/rss.xml`, `/presse/feed.json`, Gesamt `/rss.xml`, Ratgeber `/ratgeber/rss.xml` |
| Info-Bildschirme / SCADA-TV | Veröffentlichung → „Info-Bildschirme“ (+ Dauer, Priorität, Standorte, „Anzeigen bis“) | `/tv` (Vollbild), `/tv/feed.json`, `/tv/rss.xml` |
| Fediverse (Mastodon, Threads …) | Veröffentlichung → „Fediverse“ | `@oekovolt@oekovolt.de`. Neue Ratgeber-Artikel gehen automatisch an `@ratgeber@oekovolt.de` |
| Push-Benachrichtigungen | **eigener DocType „Push Nachricht“** – unabhängig von allen anderen Kanälen | Browser/Smartphone der Abonnenten, nach Thema |

## 1. Installation im Frappe-App-Code

| Ordner hier | Ziel `oekovoltdeutchland/oekovoltdeutchland/doctype/…` |
|---|---|
| `veroeffentlichung/` (json, py, api.py) | `veroeffentlichung/` |
| `push_nachricht/` | `push_nachricht/` |
| `push_abonnement/` | `push_abonnement/` |
| `fediverse_follower/` | `fediverse_follower/` |
| `verteilprotokoll/` | `verteilprotokoll/` |

In jedem Ordner eine leere `__init__.py` anlegen; `"module"` an `modules.txt` anpassen.

**Rollen:**
- `Marketing` – pflegt Veröffentlichungen und Push-Nachrichten.
- `Kanal Webservice` – ohne Desk-Zugriff, nur für den API-User der Website.

**hooks.py:**

```python
doc_events = {
    "Veroeffentlichung": {
        "on_update": "oekovoltdeutchland.oekovoltdeutchland.doctype.veroeffentlichung.api.nach_speichern",
    },
}
scheduler_events = {
    "cron": {
        "*/5 * * * *": [
            "oekovoltdeutchland.oekovoltdeutchland.doctype.veroeffentlichung.veroeffentlichung.geplante_veroeffentlichen",
            "oekovoltdeutchland.oekovoltdeutchland.doctype.veroeffentlichung.api.website_anstossen",
        ],
    },
}
```

Der zweite Cron-Eintrag stellt sicher, dass **geplante Push-Nachrichten** pünktlich (±5 Minuten) gesendet werden.

**site_config.json** (`bench --site <site> set-config …`):

```json
"oekovolt_kanal_webhook": "https://www.oekovolt.de/api/kanaele/verteilen",
"oekovolt_kanal_secret": "<gleicher Wert wie KANAL_WEBHOOK_SECRET der Website>"
```

Dann `bench --site <site> migrate` und `bench restart`.

## 2. Website-Umgebung (Vercel / .env.local)

Einmalig Schlüssel erzeugen: `node scripts/ap-schluessel.mjs`. Die Ausgabe in die Hosting-Umgebung eintragen, **nie** ins Repository.

```
KANAL_API_KEY / KANAL_API_SECRET   API-User mit Rolle „Kanal Webservice“
AP_PUBLIC_KEY / AP_PRIVATE_KEY     Fediverse-Signaturschlüssel (nie mehr ändern – sonst verlieren Follower die Verbindung)
VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT   Web-Push (nie mehr ändern – sonst verfallen alle Abos)
KANAL_WEBHOOK_SECRET               Frappe → Website
CRON_SECRET                        optional: Vercel-Cron auf GET /api/kanaele/verteilen
```

Ohne diese Variablen bleiben die Funktionen aus:
- **Push:** Die Schaltfläche zeigt „Bald verfügbar“.
- **Fediverse:** WebFinger antwortet mit 404.
- **Newsroom:** Er zeigt einen leeren Zustand.

**Lokale Vorschau ohne Backoffice:** `KANAL_DEMO=1 npm run dev` liefert Beispielbeiträge mit dem Präfix „[DEMO]“. Das funktioniert nur in der Entwicklung, niemals in Produktion.

## 3. Arbeitsablauf Marketing

1. **Veröffentlichung → Neu**
   - Titel, Teaser (max. 400 Zeichen), Text, Bild **mit Alt-Text** (Pflicht, Barrierefreiheit) und Hashtags ausfüllen.
   - Kanäle anhaken.
2. Status **„Veröffentlicht“** (sofort) oder **„Geplant“** mit Zeitpunkt.
   - **Die Website** aktualisiert sich binnen Sekunden (Webhook) bzw. spätestens nach 5 Minuten.
   - **Fediverse-Beiträge** werden genau einmal an alle Follower zugestellt (Verteilprotokoll).
   - **Nach der Zustellung** das URL-Kürzel nicht mehr ändern.
3. **Push Nachricht → Neu:**
   - Titel (≤ 60), Text (≤ 160), Link auf eine Seite der Website und Empfänger-Thema angeben.
   - Status „Jetzt senden“ oder „Geplant“.
   - Das Ergebnis (zugestellt / fehlgeschlagen / abgelaufene Abos entfernt) steht danach im Dokument.
   - **Tipp:** Push sparsam einsetzen (höchstens 1–2 pro Woche), sonst bestellen Nutzer ab.

## 4. Info-Bildschirme und SCADA-Visualisierung

| Einsatz | Adresse |
|---|---|
| Vollbild im Browser / Kiosk-Modus / Smart-TV | `https://www.oekovolt.de/tv` |
| nur Meldungen für einen Standort | `https://www.oekovolt.de/tv?standort=Werk-Nord` |
| andere Standarddauer, ohne Strommarkt-Leiste, helles Design | `…/tv?dauer=20&energie=0&hell=1` |
| Einbettung als iFrame/WebView (z. B. WinCC Unified, Ignition Perspective, zenon, Niagara PX) | `<iframe src="https://www.oekovolt.de/tv?standort=…">` – die Einbettung ist für `/tv` freigegeben |
| SCADA-Systeme mit JSON-Datenquelle | `GET /tv/feed.json?standort=…` → `eintraege[]` mit `titel`, `teaser`, `bild`, `dauer`, `url`, `qrSvg` |
| Systeme mit RSS-Ticker | `GET /tv/rss.xml?standort=…` |

**Funktionen des Bildschirms:**
- Folienwechsel mit Fortschrittsbalken und QR-Code zum Beitrag
- Uhr, Datum und Live-Strommarktdaten (Fraunhofer ISE Energy-Charts)
- Markenfolie am Ende jeder Runde
- Daten-Aktualisierung alle 5 Minuten, kompletter Neuladen alle 6 Stunden

## 5. Fediverse testen (nach dem Deployment)

1. `https://www.oekovolt.de/.well-known/webfinger?resource=acct:oekovolt@oekovolt.de` liefert JSON.
   - `https://oekovolt.de/.well-known/…` muss auf www weiterleiten; Mastodon und Threads folgen der Weiterleitung.
2. In Mastodon nach `@oekovolt@oekovolt.de` suchen → Profil mit Logo erscheint → **Folgen**. Danach steht im Backoffice unter „Fediverse Follower“ ein Eintrag.
3. **Threads:**
   - In den Threads-Einstellungen „Fediverse-Freigabe“ aktivieren.
   - Nach `@oekovolt@oekovolt.de` suchen und folgen.
   - Threads-Konten werden in einigen Regionen noch schrittweise freigeschaltet.
4. Eine Veröffentlichung mit Haken „Fediverse“ veröffentlichen → erscheint binnen Minuten in der Timeline. Im Verteilprotokoll stehen Empfänger-Server und Erfolg.
5. **Tipp für Kommunen & Stadtwerke:**
   - Hashtags wie `Kommunen`, `Stadtwerke`, `Klimaschutz`, `AgriPV`, `Energiewende` verwenden.
   - Beiträge mit Kategorie „Kommunen & Stadtwerke“ sind im Newsroom filterbar.
   - Viele Behörden-Konten liegen auf `social.bund.de` und kommunalen Mastodon-Instanzen.

## 6. Sicherheit und Datenschutz

**Signaturen**
- Eingehende Fediverse-Aktivitäten werden per HTTP-Signatur geprüft.
- Die Website verarbeitet nur Follow, Undo und Delete; Antworten und Likes werden ignoriert.
- Follower-Listen werden nicht veröffentlicht.

**Push-Abos**
- Push-Abos enthalten keine personenbezogenen Stammdaten.
- Endpoints werden als Hash indexiert.
- Nur Push-Dienste der Browserhersteller sind zugelassen.

**Webhook**
- Der Webhook akzeptiert ausschließlich das gemeinsame Secret, geprüft per Timing-sicherem Vergleich.

**Datenschutzerklärung**
- Abschnitte `#push` und `#fediverse` sind ergänzt.
- VVT-Einträge: `docs/datenschutz/VVT-Kanaele.md`.
