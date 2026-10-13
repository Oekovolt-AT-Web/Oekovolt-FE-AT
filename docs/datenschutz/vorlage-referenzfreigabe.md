# Vorlage: Referenz-Freigabe (Erklärung des Kunden)

> **Entwurf – vor Einsatz anwaltlich prüfen.** Stand 11.10.2026 (Welle A07). Verantwortlicher: Ökovolt Solartechnik GmbH,
> Gewerbegebiet 10, 5121 Ostermiething. Diese Vorlage ist die Textgrundlage der Freigabeseite
> `/referenzen/freigabe/<token>` (`FREIGABE_TEXT_VERSION = 2026-10-11-v1`) und für eine Freigabe auf Papier/PDF.
> Sie ersetzt keine Rechtsberatung. VVT-Eintrag: `VVT-Kundenbuehne.md`.

## 1. Zweck

Die Ökovolt Solartechnik GmbH stellt die Photovoltaikanlage des Kunden auf www.oekovolt.com als Referenzprojekt vor
(Projektseite, Projektliste, Referenzkarte, Vorschaubilder, Social-Media-Kit, ESG-Kurzbericht, Projekt-Plakette).
Ohne Freigabe werden nur Anlagendaten (Leistung, Jahr, Ort auf Ortsebene) und eine neutrale Beschreibung
(Branche, Ort) gezeigt – **kein Firmenname, kein Logo, kein Zitat, keine Fotos, keine Plakette, keine Messwerte**.

## 2. Umfang – jede Zeile einzeln, nichts ist vorangekreuzt

| ☐ | Inhalt | Was genau |
|---|---|---|
| ☐ | **Firmenname nennen** | Firmenwortlaut auf der Projektseite, in Listen und Vorschaubildern |
| ☐ | **Firmenlogo zeigen** | Logo neben dem Kundenporträt, unverändert, Datei vom Kunden |
| ☐ | **Zitat veröffentlichen** | Wortlaut: „…“ – Name, Funktion der zitierten Person: … |
| ☐ | **Fotos der Anlage** | nur Anlage und Gebäude, **ohne erkennbare Personen** |
| ☐ | **Projekt-Plakette** | sachliche Plakette „Photovoltaikanlage errichtet von Ökovolt Solartechnik GmbH · Jahr · kWp“ zum Einbau auf der Kunden-Website; kein Siegel, keine Bewertung |
| ☐ | **Live-Daten** | aktuelle Leistung/Tagesertrag aus dem Monitoring auf der Projektseite (sobald angeboten) |
| ☐ | **Messwerte (Jahresertrag)** | gemessener Ertrag statt Richtwert; CO₂-Angaben nur mit Zeitraum und Rechenweg |

**Personenfotos:** Fotos mit erkennbaren Personen veröffentlichen wir nur mit deren **eigener** Einwilligung
(gesondert einzuholen, Art. 6 Abs. 1 lit. a DSGVO, § 78 UrhG). Diese Freigabe erfasst sie nicht.

## 3. Laufzeit und Widerruf

- Die Freigabe gilt, solange das Projekt auf www.oekovolt.com als Referenz veröffentlicht ist.
- Sie kann **jederzeit ganz oder teilweise widerrufen** werden: über den Link in der Bestätigungsmail oder formlos
  an office@oekovolt.at. Nach einem Widerruf entfernt Ökovolt die betroffenen Inhalte innerhalb weniger Werktage
  (Website-Cache bis 10 Minuten). Bereits gedruckte oder von Dritten geteilte Inhalte können nicht zurückgeholt werden.
- Der Widerruf berührt nicht die Rechtmäßigkeit der bis dahin erfolgten Verwendung.

## 4. Keine Gegenleistung

Die Freigabe ist freiwillig. Es gibt keine Vergütung, keinen Rabatt und keine sonstige Gegenleistung; sie hat
keinen Einfluss auf Auftrag, Gewährleistung oder Service. (Nicht kommerziell vergütete Kundenstimmen – sonst wäre
eine Kennzeichnung als Werbung zu prüfen.)

## 5. Vertretungsbefugnis (Pflicht)

☐ **Ich bin berechtigt, diese Erklärung für das Unternehmen abzugeben** (Geschäftsführung, Prokura oder Vollmacht).
Name: … Funktion: … Datum: …

## 6. Datenschutz (Information nach Art. 13 DSGVO)

- **Daten:** Name und Funktion der Ansprechperson, E-Mail (nur für Link und Bestätigung), bei Zitat Name/Funktion
  der zitierten Person; zum Nachweis Datum, Textfassung der Erklärung und eine gekürzte IP-Adresse.
- **Zweck/Rechtsgrundlage:** Darstellung des Referenzprojekts und Nachweis der Freigabe – Einwilligung
  (Art. 6 Abs. 1 lit. a DSGVO) für Zitat/Personendaten; berechtigtes Interesse (lit. f) für den Nachweis.
- **Speicherdauer:** solange die Referenz veröffentlicht ist, danach drei Jahre als Nachweis (Verjährung).
- **Empfänger:** Öffentlichkeit (Website) für die freigegebenen Inhalte; Backoffice (Hetzner, Nürnberg).
- **Rechte:** Auskunft, Berichtigung, Löschung, Widerruf, Beschwerde bei der Datenschutzbehörde.
  Datenschutzerklärung: https://www.oekovolt.com/datenschutz

## 7. Ablage

Elektronisch: DocType „Referenz Freigabe“ (RF-JJJJ-NNNNN) mit Datum, IP-Kürzel, Textfassung. Papier/PDF: Scan am
Datensatz anhängen, `freigegeben_am` und Häkchen im Desk nachtragen (nur System Manager, Häkchen sind sonst
read-only). In `src/data/kunden.js` zusätzlich `freigegebenAm` und `beleg` (RF-Nummer) eintragen, wenn das Backoffice
nicht erreichbar ist.

`[OFFEN – Anwalt]`: Formulierung Nr. 3 (Wirkung des Widerrufs), Nr. 4 (UWG-Kennzeichnung), Nr. 6 (Speicherdauer),
Verhältnis zur Referenzklausel in AGB/Auftrag.
