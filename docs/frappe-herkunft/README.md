# Kampagnen-Zuordnung & Dashboards (Frappe) + Umami

## Was die Website mitschickt

Beim ersten Seitenaufruf merkt sich die Website **nur im Arbeitsspeicher des Tabs** (kein Cookie, kein localStorage):

- **UTM-Parameter:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- **Verweisende Website:** nur der Hostname, z. B. `google.com`
- **Einstiegsseite:** der Pfad, z. B. `/landwirtschaft`
- **Kanal:** daraus abgeleitet (Anzeige, Social Media, E-Mail, Offline/QR, Kampagne, Suchmaschine, KI-Assistent, Verweis, Direkt)

Diese Angaben werden **ausschließlich zusammen mit einer Anfrage** übertragen und serverseitig geprüft (`src/lib/herkunftServer.js`):

| Anfrage | Ziel in Frappe |
| --- | --- |
| Rückruf | Rueckruf → Abschnitt „Herkunft (Kampagne)“ |
| Online-Termin | Beratungstermin → „Herkunft (Kampagne)“ |
| PDF-Analyse | PV Analyse → „Herkunft (Kampagne)“ |
| Foto-Upload (QR) | Solar Lead → „Herkunft (Kampagne)“ |
| Kontaktformular, Konfigurator, Übergangslösungen | Kontakt → letzte Zeile der Nachricht: `[Herkunft] Kanal: … · Quelle: … · Kampagne: …` |

Wer die Seite ohne Anfrage wieder verlässt, hinterlässt in Frappe nichts.

## Installation

1. **DocTypes aktualisieren:** Die JSON- und `api.py`-Dateien aus `docs/frappe-rueckruf-termin`, `docs/frappe-pv-analyse` und `docs/frappe-solar-lead` erneut kopieren. Die Helfer `herkunft_felder()` und `herkunft_html()` liegen in `rueckruf/api.py`.
2. **Bericht kopieren:** `anfragen_nach_herkunft/` nach `oekovoltdeutchland/oekovoltdeutchland/report/anfragen_nach_herkunft/` kopieren und eine leere `__init__.py` anlegen.
3. **Migrieren:** `bench --site <site> migrate`
4. **Rollen prüfen:** Die Rollen im Bericht (System Manager, Rückruf Team, Sales Manager) nach Bedarf anpassen.

Ältere Datensätze ohne Herkunft erscheinen im Bericht als „(ohne Angabe)“.

## Bericht „Anfragen nach Herkunft“

**Desk → Berichte → Anfragen nach Herkunft**

- **Filter:**
  - Zeitraum (Standard: 90 Tage)
  - Gruppierung nach Kanal, Quelle, Kampagne, Medium, Einstiegsseite oder Anfrageart
  - optional nur ein bestimmter Kanal
- **Spalten:** Anfragen gesamt, je Anfrageart, „Weiter qualifiziert“ und Quote.
  - **„Weiter qualifiziert“ bedeutet:**
    - Rückruf mit dem Ergebnis „Termin vereinbart“ oder „Angebot angefordert“
    - Beratungstermin „Durchgeführt“
    - PDF-Analyse oder Solar Lead mit „Angebot erstellt“ oder „Gewonnen“
  - **Kontaktanfragen** zählen nicht als qualifiziert, weil der Kontakt-DocType keinen Status hat.
- **Diagramm:** die 10 stärksten Gruppen.
- **Solar Leads:** Sie zählen erst, wenn tatsächlich Unterlagen eingegangen sind.

## Dashboard einrichten (ohne Code, 10 Minuten)

**Desk → Dashboard → Neu: „Marketing & Anfragen“**

### Number Cards (Desk → Number Card → Neu)

| Name | DocType | Funktion | Filter |
| --- | --- | --- | --- |
| Rückrufe (30 Tage) | Rueckruf | Count | Erstellt am ≥ vor 30 Tagen |
| Termine (30 Tage) | Beratungstermin | Count | Erstellt am ≥ vor 30 Tagen |
| PDF-Analysen (30 Tage) | PV Analyse | Count | Erstellt am ≥ vor 30 Tagen |
| Foto-Uploads (30 Tage) | Solar Lead | Count | Status ≠ Wartet auf Unterlagen |
| Anfragen aus Anzeigen | PV Analyse | Count | Kanal = Anzeige |

### Dashboard Charts (Desk → Dashboard Chart → Neu)

| Name | Typ | Einstellungen |
| --- | --- | --- |
| Anfragen nach Kanal | Report | Bericht „Anfragen nach Herkunft“, Gruppierung Kanal, Balken |
| Kampagnen | Report | Bericht „Anfragen nach Herkunft“, Gruppierung Kampagne |
| Rückrufe pro Woche | Count | DocType Rueckruf, Zeitreihe über „Erstellt am“, wöchentlich |
| PDF-Analysen nach Kanal | Group By | DocType PV Analyse, Group By „herkunft_kanal“, Donut |
| Einstiegsseiten (Termine) | Group By | DocType Beratungstermin, Group By „einstiegsseite“ |

Karten und Charts im Dashboard hinzufügen und für die Rollen Vertrieb/Marketing freigeben.

## UTM-Links richtig bauen

```
https://www.oekovolt.de/landwirtschaft?utm_source=facebook&utm_medium=paid_social&utm_campaign=agri_pv_2026&utm_term=stall
```

- **`utm_source`:** Plattform, z. B. google, facebook, instagram, linkedin, newsletter, flyer, messe.
- **`utm_medium`:**
  - `cpc` / `paid_social` → Kanal „Anzeige“ (alles mit „paid“, „cpc“, „ppc“)
  - `social` → „Social Media“
  - jeder andere Wert → „Kampagne“
  - `email` → „E-Mail“
  - `qr` / `print` / `offline` → „Offline/QR“
- **`utm_campaign`:** kurz, klein, ohne Umlaute, z. B. `agri_pv_2026`, `gewerbe_speicher_q4`.
- **`utm_term`:** Auf `/landwirtschaft` und `/gewerbe` wählt er die passende Überschrift aus, siehe `src/data/zielgruppen.js`.
- **Keine personenbezogenen Daten** in UTM-Parameter schreiben (keine Namen, E-Mail-Adressen, Kundennummern).

---

# Umami (cookielose Besucherstatistik)

Umami läuft selbst gehostet, zum Beispiel auf dem Hetzner-Server:

- setzt **keine Cookies** und speichert keine IP-Adressen
- respektiert „Do Not Track“
- zeichnet `/scan` und `/tv` gar nicht auf
- speichert von URL-Parametern nur `utm_*`

## docker-compose.yml

```yaml
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    restart: always
    environment:
      DATABASE_URL: postgresql://umami:${UMAMI_DB_PASSWORT}@db:5432/umami
      APP_SECRET: ${UMAMI_APP_SECRET}      # openssl rand -hex 32
      DISABLE_TELEMETRY: 1
      TRACKER_SCRIPT_NAME: ov.js             # neutraler Skriptname
    ports: ["127.0.0.1:3010:3000"]
    depends_on: [db]
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: ${UMAMI_DB_PASSWORT}
    volumes: ["umami-db:/var/lib/postgresql/data"]
volumes:
  umami-db:
```

## nginx (Subdomain `statistik.oekovolt.de`)

```nginx
server {
  server_name statistik.oekovolt.de;
  location / {
    proxy_pass http://127.0.0.1:3010;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  # TLS per certbot --nginx
}
```

## Einrichtung

1. `docker compose up -d` ausführen, dann `https://statistik.oekovolt.de` öffnen.
   - Das Standard-Login ist `admin` / `umami`. **Das Passwort sofort ändern.**
2. Website „oekovolt.de“ anlegen und die **Website-ID** kopieren.
3. In der Umgebung der Next.js-Website setzen und neu deployen:
   ```
   UMAMI_SCRIPT_URL=https://statistik.oekovolt.de/ov.js
   UMAMI_WEBSITE_ID=<id>
   ```
   Ohne diese Variablen lädt die Website nichts.
4. **Content-Security-Policy:** Falls eine CSP aktiv ist, `statistik.oekovolt.de` bei `script-src` und `connect-src` ergänzen.

## Ereignisse (Umami → Events)

| Ereignis | Wann | Daten |
| --- | --- | --- |
| `rueckruf_angefordert` | Rückruf gesendet | modus |
| `termin_gebucht` | Termin gebucht | art |
| `pdf_analyse_erstellt` | PDF heruntergeladen | kwp |
| `scan_qr_erzeugt` / `scan_unterlagen_eingegangen` | QR-Handshake | quelle |
| `angebot_angefragt` | Konfigurator gesendet | kwp |
| `kontakt_gesendet` | Kontaktformular | thema |

Die Ereignisse enthalten nie Namen, E-Mail-Adressen, Telefonnummern oder Freitext.

## Datenschutz

- **Datenschutzerklärung:** Abschnitte `#cookies`, `#statistik`, `#herkunft` und `#google-maps`.
- **Verzeichnis:** `docs/datenschutz/VVT-Statistik-Herkunft.md`
- **Rechtsgrundlage:** berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO).
- **Keine Einwilligung nach § 25 TDDDG nötig:** Es wird nichts auf dem Endgerät gespeichert oder ausgelesen, was nicht unbedingt erforderlich ist.
- **Vor dem Livegang:** vom Datenschutzbeauftragten bestätigen lassen.
