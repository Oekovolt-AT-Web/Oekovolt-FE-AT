# Vorlage: Wikidata-Objekt „Ökovolt Solartechnik GmbH“ mit Offenlegung (M29, E10)

Zum [Offpage-Fahrplan, Abschnitt 10](../Offpage-Fahrplan.md#10-wikidata-eintrag-mit-offenlegung-m29-e10). Stand: 30.09.2026.
**Nur nach Freigabe E10.** Einen Wikipedia-Artikel legen wir nicht an.

## 1. Vorher prüfen

1. Auf https://www.wikidata.org nach „Ökovolt“, „Oekovolt“ und „SUN VALUE“ suchen. Gibt es schon ein Objekt, dieses ergänzen und kein neues anlegen.
2. Prüfen, ob es für die deutsche Schwester (ÖKOVOLT GmbH Solartechnik, Türkheim) oder die Lochauer Gesellschaft ein Objekt gibt. Die AT-GmbH ist **keine Tochter** der deutschen GmbH (`src/data/unternehmen.js`). Deshalb keine Eigenschaft „Muttergesellschaft“ setzen, höchstens „unterschiedlich von“ (P1889).
3. Mindestens eine **unabhängige** Referenz bereithalten. Die eigene Website und Pressemitteilungen zählen dafür nicht (Essay [Wikidata:Self-promotion](https://www.wikidata.org/wiki/Wikidata:Self-promotion)).

## 2. Offenlegung auf der Benutzerseite (Pflicht)

Nach der Richtlinie [Wikidata:Disclosure of paid editing](https://www.wikidata.org/wiki/Wikidata:Disclosure_of_paid_editing) steht die Offenlegung auf der **Benutzerseite**. Das geht im Klartext oder mit `{{PaidContributions}}`.

**Klartext (Beispiel für eine Mitarbeiterin bzw. einen Mitarbeiter):**

> Ich bin bei der Ökovolt Solartechnik GmbH (Ostermiething, Österreich) angestellt und bearbeite im Auftrag meines Arbeitgebers das Objekt über dieses Unternehmen. Ich trage nur belegbare Angaben mit Referenzen ein und keine werblichen Aussagen.

**Bei Bearbeitung durch eine Agentur:** Die Agentur **und** den Auftraggeber nennen, z. B. „…im Auftrag der Ökovolt Solartechnik GmbH, bezahlt durch **[Agentur]**“.

**Bearbeitungskommentar** bei jeder Änderung: `Bearbeitung mit Interessenkonflikt, siehe Benutzerseite`.

## 3. Bezeichnung, Beschreibung, Aliasse

| Sprache | Bezeichnung | Beschreibung (neutral) | Aliasse |
|---|---|---|---|
| de | Ökovolt Solartechnik GmbH | österreichisches Photovoltaik-Unternehmen mit Sitz in Ostermiething | Ökovolt Österreich; Oekovolt Solartechnik GmbH |
| en | Ökovolt Solartechnik GmbH | Austrian photovoltaics company based in Ostermiething | Oekovolt Solartechnik |

## 4. Aussagen

Q-IDs für Ziele (Österreich, Ostermiething, GmbH, Branche) **beim Anlegen per Suche auswählen**. Sie stehen hier bewusst nicht, damit keine falschen IDs übernommen werden.

| Eigenschaft | Wert | Referenz |
|---|---|---|
| P31 ist ein(e) | Unternehmen | WKO Firmen A–Z |
| P17 Staat | Österreich | WKO Firmen A–Z |
| P159 Hauptverwaltung | Ostermiething | WKO Firmen A–Z |
| P625 Koordinaten (optional) | 48.0428, 12.8417 | – |
| P1448 offizieller Name | „Ökovolt Solartechnik GmbH“ (de) | Firmenbuch/WKO |
| P1454 Rechtsform | Gesellschaft mit beschränkter Haftung | Firmenbuch/WKO |
| P571 Gründung, Gründungsdatum | 2012 | Firmenbuch/WKO |
| P452 Branche | Photovoltaik bzw. Solarenergie (passendes Objekt wählen) | WKO (Tätigkeit) |
| P856 offizielle Website | https://www.oekovolt.com | – |
| P3608 EU-Umsatzsteuer-Identifikationsnummer | ATU67027148 | Impressum/WKO |
| P463 Mitglied von | Bundesverband Photovoltaic & Battery Austria (nur falls ein Objekt existiert) | https://pvbaustria.at/mitglieder/ |
| P2013 Facebook-ID | Oekovolt | – |
| P4264 LinkedIn-Unternehmens-ID | oekovolt | – |
| P2003 Instagram-Benutzername | oekovolt.austria | – |

- **Nicht eintragen:** Gesellschafter als P127 mit nur einem Anteil (unvollständig und missverständlich), Kennzahlen (Angabe des Unternehmens, keine unabhängige Quelle), X-Handle (E6 offen), Personen ohne eigenes Objekt.
- **Firmenbuchnummer:** Nur eintragen, wenn es dafür eine passende Wikidata-Eigenschaft gibt (vorher in der Eigenschaftssuche prüfen). Sonst reicht die Referenz.

## 5. Referenzen (je Aussage)

Jede Referenz mit **P854** (URL der Fundstelle) und **P813** (abgerufen am):

- WKO Firmen A–Z: https://firmen.wko.at/%C3%96kovolt-solartechnik-gmbh-%C3%96kovolt-solartechnik-gmbh/ober%C3%B6sterreich/?firmaid=683331b8-cc78-405b-983d-55acaee1a686
- PV&B Austria, Mitgliederverzeichnis: https://pvbaustria.at/mitglieder/
- Redaktioneller Bericht, z. B. über Story 1: **[URL nach Veröffentlichung]**

## 6. Danach

- Die Q-ID im [Offpage-Fahrplan, Abschnitt 15](../Offpage-Fahrplan.md#15-abnahme-p7-aus-dem-plan-und-nachweis) als Nachweis eintragen.
- `https://www.wikidata.org/wiki/Q…` in `src/lib/site.js` → `FIRMA.profile` aufnehmen (`sameAs`, Paket P5).
- Das Objekt nicht laufend „optimieren“. Ändern nur, wenn sich Fakten ändern, und dann immer mit Referenz.
