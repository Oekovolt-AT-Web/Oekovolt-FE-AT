# PDF-Analyse (Solarrechner) – Frappe-Backend

Die Website (`POST /api/analyse/pdf`) arbeitet in **einem** Schritt:

1. **Berechnen:** mit demselben Rechenkern wie der Solarrechner (`src/lib/solarrechner.js`).
2. **Rendern:** ein 4-seitiges PDF auf dem Server (`@react-pdf/renderer`, Schriften Inter/Manrope lokal).
3. **Speichern:** `pv_analyse.api.create_analyse` legt den Lead „PV Analyse“ mit privatem PDF-Anhang an. Dabei:
   - sendet es dem Kunden eine Kopie per E-Mail,
   - informiert den Vertrieb per E-Mail und über die Glocke im Desk.
4. **Ausliefern:** Das PDF geht direkt als Download an den Browser.
   - Ist das Backoffice nicht erreichbar, bekommt der Kunde trotzdem sein PDF.
   - Die Anfrage landet dann als Kontaktanfrage „PV-ANALYSE …“.

## Installation

- **Dateien:** `pv_analyse/` nach `oekovoltdeutchland/oekovoltdeutchland/doctype/pv_analyse/` kopieren und eine leere `__init__.py` anlegen.
- **Voraussetzungen:** Der DocType „Rueckruf“ (docs/frappe-rueckruf-termin) wird für die gemeinsamen Helfer benötigt.
- **Rollen:**
  - `Vertrieb` bekommt die Leads.
  - Der API-User der Website hat bereits `Kontakt Webformular`.
- **Scheduler:** in `hooks.py` → `scheduler_events["daily"]` ergänzen: `"oekovoltdeutchland.oekovoltdeutchland.doctype.pv_analyse.api.loesche_alte_analysen"`
- **Abschluss:** `bench --site <site> migrate`.

## Hinweise

- **Unverbindlich:** Das PDF ist ausdrücklich eine Ersteinschätzung und kein Angebot. So steht es auf Seite 1 und 4.
- **Preise und Annahmen:** Sie kommen aus `src/data/solarrechner.js` und `src/data/einspeiseverguetung.js`. Bei Änderungen dort ändern sich Rechner und PDF gemeinsam.
- **Missbrauchsschutz:**
  - höchstens 5 PDFs je E-Mail-Adresse pro Tag
  - 60 PDFs pro 10 Minuten insgesamt
  - Honeypot-Feld und Mindest-Ausfüllzeit
- **Datenschutz:**
  - Abschnitt „PDF-Analyse“ (`#analyse`) in der Datenschutzerklärung
  - Löschung nach 12 Monaten ohne Fortschritt
