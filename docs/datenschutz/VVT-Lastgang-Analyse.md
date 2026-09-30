# VVT-Prüfung – Lastgang-Analyse im Browser

> **Entwurf – rechtlich prüfen.** Stand 30.09.2026 · Verantwortlicher: Ökovolt Solartechnik GmbH, Gewerbegebiet 10,
> 5121 Ostermiething ([Deckblatt](00-Uebersicht-VVT.md#verantwortlicher)) · Freigabe: `[OFFEN]` · Prüfung: `[OFFEN]`

## Ergebnis vorab

Nach der Umsetzung im Code wird eine hochgeladene Lastgang-Datei **nur im Browser** der Nutzerin bzw. des Nutzers gelesen
und ausgewertet. Die Datei und die Ergebnisse werden **nicht an den Server von Ökovolt übertragen**. Solange das so bleibt,
verarbeitet Ökovolt dabei keine personenbezogenen Daten; ein Eintrag im Verzeichnis ist dafür nicht erforderlich. Diese
Datei dokumentiert die Prüfung und die Bedingungen, unter denen die Aussage gilt.

## Stand der Umsetzung (30.09.2026)

- Rechenlogik: `src/lib/lastgang/parser.js`, `analyse.js`, `peak.js`, `pv.js`, `format.js`, `beispiel.js`.
  Laut Dateikopf von `parser.js`: „Läuft komplett im Browser (und in Node für den Test) – keine Abhängigkeiten, kein
  Netzwerk.“ Eine Suche nach `fetch`, `localStorage` und `sessionStorage` in `src/lib/lastgang/` ergab am 30.09.2026
  **keine Treffer**.
- Test: `scripts/lastgang.test.mjs`.
- **Die Oberfläche ist noch nicht eingebunden:** Am 30.09.2026 importiert keine Seite und keine Komponente
  `src/lib/lastgang/`. `[OFFEN: Diese Prüfung vor dem Freischalten der Oberfläche wiederholen.]`

## Welche Daten die Datei enthalten kann

Lastgang-Exporte aus Netzbetreiber- und Energieportalen enthalten neben den Viertelstundenwerten oft einen Vorspann mit
**Zählpunktbezeichnung, Kundennummer, Name und Anschrift** (der Parser überspringt diesen Vorspann). Verbrauchswerte eines
Zählpunkts sind personenbezogen, wenn der Zählpunkt einer natürlichen Person (z. B. Einzelunternehmer:in, Landwirt:in)
zugeordnet ist.

## Bedingungen, unter denen „keine Verarbeitung durch Ökovolt“ gilt

1. Die Datei wird im Browser mit der File-API gelesen; kein Upload, kein Senden der Datei oder einzelner Werte an
   `/api/...` oder an Dritte.
2. Keine Speicherung im Browser (`localStorage`, IndexedDB), es sei denn, sie ist für die ausdrücklich gewünschte Funktion
   unbedingt erforderlich (§ 165 Abs. 3 TKG 2021) und wird angezeigt.
3. Statistik: Umami, Google Analytics und Heatmap erfassen keine Dateiinhalte, Dateinamen oder Ergebnisse. Die Heatmap
   speichert nur Selektor und Position, nie Werte (siehe [VVT-Heatmap.md](VVT-Heatmap.md)). `[OFFEN: Bei eigenen
   Statistik-Ereignissen für die Lastgang-Seite nur allgemeine Ereignisse wie „Analyse gestartet“ senden, keine
   Kennzahlen.]`
4. Sendet die Person die Ergebnisse anschließend **freiwillig mit einer Anfrage** (z. B. Angebots- oder Kontaktformular),
   gilt ab diesem Zeitpunkt der Eintrag [VVT-Anfragen.md](VVT-Anfragen.md). Der Zählpunkt sollte dabei nicht
   automatisch mitgeschickt werden.

## Textvorschlag für die Datenschutzerklärung (neuer Abschnitt oder Ergänzung zu Punkt 7)

> **Lastgang-Analyse.** Wenn Sie eine Lastgang-Datei Ihres Netzbetreibers auswählen, wird sie ausschließlich in Ihrem
> Browser gelesen und ausgewertet. Die Datei und die Ergebnisse werden nicht an uns oder an Dritte übertragen und nicht
> gespeichert; nach dem Schließen der Seite sind sie verworfen. Erst wenn Sie uns Ergebnisse mit einer Anfrage senden,
> verarbeiten wir diese wie unter Punkt 7 beschrieben.

`[OFFEN: Text erst veröffentlichen, wenn die Oberfläche live ist und die Bedingungen oben geprüft sind.]`
