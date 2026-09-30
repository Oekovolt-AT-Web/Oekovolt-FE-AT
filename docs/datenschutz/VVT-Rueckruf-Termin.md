# VVT (Art. 30 Abs. 1 DSGVO) – Rückruf und Online-Terminbuchung

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 (ersetzt die deutsche Fassung vom 14.09.2026) · Verantwortlicher:
> Ökovolt Solartechnik GmbH, Gewerbegebiet 10, 5121 Ostermiething ([Deckblatt](00-Uebersicht-VVT.md#verantwortlicher)) ·
> Freigabe: `[OFFEN]` · Prüfung: `[OFFEN]`

## Umsetzung (belegt im Code)

- **Terminbuchung** `/termin` (`src/components/Rueckruf/TerminBuchung.js`) und **Rückruf-Widget**
  (`src/components/Rueckruf/RueckrufFormular.js`, `RueckrufWidget.js`) senden denselben Datensatz an
  `/api/termin` bzw. `/api/rueckruf`. Beide leiten an `oekovolt_app.website_api.termin.buche_termin` weiter
  und ergänzen die IP-Adresse der Besucherin bzw. des Besuchers (`src/lib/ipAdresse.js`).
- Gespeichert wird im DocType **„Website Termin“** mit `anfrageart` „Termin“ oder „Rückruf“
  (`termin_logik.ist_rueckruf`). Terminarten: Telefonische Beratung, Video-Beratung, Vor-Ort-Termin.
- Freie Zeiten liefert `/api/termin/kalender` → `termin.get_kalender`. Dafür werden belegte Zeiträume aus Website-Terminen
  und aus offenen Kalendereinträgen (Frappe „Event“) der Nutzer mit Rolle „Terminberatung“ gelesen – **nur Zeiten, keine
  Inhalte** (`termin.py`, `_belegungen`).
- **CloudTalk ist nicht im Einsatz.** Die CloudTalk-Funktionen in `src/lib/rueckrufApi.js` werden von keiner Route
  aufgerufen; der deutsche DocType „Rückruf“ wird von der AT-Website nicht verwendet.

## Eintrag

| Angabe | Inhalt |
|---|---|
| **Zweck** | Vereinbarung und Durchführung von Rückrufen und Beratungsterminen (Telefon, Video, vor Ort), Terminbestätigung und -änderung, Planung der Berater:innen |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Anfrage); Einwilligung in die Verarbeitung/Kontaktaufnahme per Pflicht-Checkbox (`einwilligung`, `einwilligung_am`; Art. 6 Abs. 1 lit. a DSGVO; für Anrufe zu Werbezwecken zusätzlich § 174 TKG 2021); Art. 6 Abs. 1 lit. f DSGVO für die IP-Adresse (Missbrauchsschutz, Nachweis der Einwilligung). `[OFFEN: Ist für einen vom Kunden selbst angeforderten Rückruf eine Einwilligung nötig oder genügt lit. b? Wortlaut der Checkbox prüfen.]` |
| **Betroffene** | Interessent:innen, Kund:innen, Ansprechpersonen von Unternehmen; Beschäftigte der Terminberatung (Kalenderzeiten, Zuordnung als `berater`) |
| **Datenkategorien** | `name_komplett`, `firma` (aus der Nachricht), `email`, `telefon` (E.164, nur AT/DE/CH), `plz`, `adresse` (nur Vor-Ort-Termin), `thema`, `nachricht`, `terminart`, `datum`, `uhrzeit`, `start`, `ende`, `berater`, `status`, interne `notiz`, `quelle` (Seite), `herkunft` (Kampagnen-Zuordnung, siehe [VVT-Statistik-Herkunft.md](VVT-Statistik-Herkunft.md)), `ip_adresse`, `einwilligung`, `einwilligung_am`, `referenz` (`T-JJJJ-…`) |
| **Keine Verarbeitung** | Keine Gesprächsaufzeichnung vorgesehen. Die Kalenderdatei (.ics) für die Kundin bzw. den Kunden erzeugt das Backoffice als Anhang der Bestätigungs-E-Mail; die Schaltflächen „Zum Kalender hinzufügen“ auf der Website (`KalenderLinks.js`) öffnen Google/Outlook erst durch Klick. |
| **Empfänger intern** | Rolle **Terminberatung** (Lesen; E-Mail und Glocke bei jeder Buchung), System Manager |
| **Empfänger extern** | Keine. Für die Video-Beratung wird ein Link per E-Mail gesendet. `[OFFEN: Welches Videokonferenz-Werkzeug wird verwendet (z. B. Microsoft Teams)? Als Auftragsverarbeiter ergänzen.]` |
| **Auftragsverarbeiter** | Hosting Website `[OFFEN]`; Hosting Backoffice (Hetzner, Nürnberg) `[OFFEN: AV-Vertrag]`; E-Mail-Versand (Frappe-Ausgangskonto) und Postfächer (Microsoft 365 laut MX) `[OFFEN]` |
| **Drittland** | Keines vorgesehen. `[OFFEN: abhängig von Video-Werkzeug und E-Mail-Dienst]` |
| **Löschung (umgesetzt)** | Täglicher Job `oekovolt_app.website_api.termin.loesche_alte_termine`: Termine und Rückrufe, deren **Datum mehr als 24 Monate** zurückliegt (`LOESCHFRIST_MONATE = 24` in `termin_logik.py`), werden anonymisiert: Name → „Anonymisiert“, E-Mail, Telefon, Adresse, Firma, Nachricht, Notiz, IP geleert, Berater entfernt; Versionen, Benachrichtigungen, Kommentare und E-Mail-Warteschlange werden gelöscht. Terminart, Datum, PLZ, Thema, Quelle und Herkunft bleiben für die Statistik. |
| **Löschung (offen)** | `[OFFEN: Datenschutzerklärung Punkt 10 nennt „Rückrufe 90 Tage, Termine 12 Monate“ – Abweichung A2/A3 im Deckblatt.]` `[OFFEN: Übernahme in die Kundenakte, wenn aus dem Termin ein Angebot oder Auftrag entsteht.]` `[OFFEN: E-Mail-Kopien in den Postfächern der Terminberatung.]` |
| **TOM** | Zwei Drosselungsstufen: `@rate_limit` 60 Buchungen je aufrufender IP und 10 Minuten sowie 5 Buchungen je Besucher-IP und 10 Minuten; Telefonnummern nur aus AT/DE/CH, Mehrwert- und Sondernummern gesperrt; Prüfung von Terminart, Datum, Uhrzeit, Name, E-Mail, PLZ, Pflicht-Einwilligung; Slot-Vergabe unter Sperre (keine Doppelbuchung); Rollenrechte; Änderungsprotokoll; TLS. |
| **Hinweis zur Sicherheit** | `buche_termin` ist als **Gastmethode** freigegeben (`allow_guest=True`) und damit auch ohne die Website direkt erreichbar; das Feld `ip_adresse` stammt dann vom Aufrufer und ist nicht vertrauenswürdig. `[OFFEN: Backoffice-Methode auf die IP des Website-Servers beschränken (Firewall/nginx) oder wieder mit Token absichern.]` |
| **Beschäftigtendaten** | Die Verfügbarkeitsprüfung liest Termine der Kalender von Mitarbeitenden (nur Zeiten). `[OFFEN: im Beschäftigten-VVT aufnehmen; Mitbestimmung nach ArbVG prüfen, falls ein Betriebsrat besteht]` |
| **DSFA** | Voraussichtlich nicht erforderlich (keine besonderen Kategorien, kein Profiling). `[OFFEN: bestätigen]` |
| **Informationspflicht** | Datenschutzerklärung Punkt 10 (anzupassen), Hinweis an Formular und Widget. |
