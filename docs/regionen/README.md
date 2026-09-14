# Regionalseiten `/photovoltaik/[stadt]`

24 Städte im Einzugsgebiet, jeweils mit eigenem, recherchiertem Inhalt. Die Übersicht liegt unter `/photovoltaik`.

## Aufbau je Seite

| Block | Quelle | Einzigartig durch |
| --- | --- | --- |
| Hero, Einleitung, Schwerpunkte, FAQ, CTA | `src/data/regionen/<stadt>.js` (redaktionell) | Satzungen, Förderlogik, lokale Besonderheiten |
| Solarertrag (Monatsgrafik, Ost/West, Flachdach, Winteranteil) | `src/data/regionen-pvgis.json` (PVGIS, EU JRC, mit Geländehorizont) | Standortdaten |
| Netz, Förderung, Kataster, Beratung, Schneelast, Ortsbild | `fakten` in der Stadtdatei, jede Angabe mit Quell-URL | Recherche 14.09.2026 |
| Referenzen | Live aus dem Backoffice (DocType „Projekte“), nach Entfernung | Nur echte Projekte, Koordinaten in `src/lib/regionen.js` |
| Leistungsumfang | Zone nach Entfernung (bis 100 / 200 / 300 km) | – (bewusst gleich) |

Die redaktionellen Texte überschneiden sich zwischen zwei Städten höchstens zu rund 3 % (gemeinsame 5-Wort-Folgen).

## Pflege

- **Rechercheprotokolle:** `docs/regionen/recherche/<stadt>.json`, jeweils mit Quellen und einer Liste `offen`. Förderprogramme alle 3–6 Monate prüfen, dann `fakten.stand` in der Stadtdatei aktualisieren. Das Datum steuert auch `lastModified` in der Sitemap.
- **Neue Stadt:**
  1. Koordinaten in `scripts/regionen-pvgis.mjs` ergänzen und `node scripts/regionen-pvgis.mjs` ausführen.
  2. Stadtdatei anlegen.
  3. In `src/data/regionen/index.js` eintragen.
- **Neue Referenzorte:** Koordinaten in `REFERENZ_ORTE` (`src/lib/regionen.js`) ergänzen, sonst erscheint das Projekt nicht als „in der Nähe“.

## Vor dem Livegang prüfen

- **Leistungsumfang je Zone:** Die Texte in `src/app/photovoltaik/[stadt]/page.js` (`UMFANG`) mit dem tatsächlichen Angebot abgleichen:
  - Zone 3 heißt „Schwerpunkt Gewerbe & größere Anlagen, private Anfragen im Einzelfall“.
  - Zone 1 heißt „Service aus dem regionalen Einzugsgebiet“.
- **Mannheim:** Ein Ökovolt-Standort ist nicht belegt (`recherche/_oekovolt-mannheim.json`) und wird deshalb nicht erwähnt. Falls es ihn gibt, bitte Adresse liefern.
- **Ulm:** ulm.de war nicht abrufbar. Klimaziel, Solarkataster und Altstadt-Regeln der Stadt Ulm fehlen bewusst.
- **Fürth:** Die Angaben zu infra fürth stammen aus einem Web-Archiv-Snapshot (Juni 2026). Bitte live gegenprüfen.
- **Netzbetreiber:** Er ist überall für das Kerngebiet belegt. Randgebiete können abweichen, das steht jeweils auch auf der Seite.
