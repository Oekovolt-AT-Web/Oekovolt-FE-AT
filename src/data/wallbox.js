// src/data/wallbox.js
//
// Zahlen rund um Wallbox und Laden an EINER Stelle – Österreich,
// Recherchestand September 2026. Bei Preis- oder Regeländerungen nur diese
// Datei anfassen.
//
// Quellen Netzbetreiber-Regeln:
//   - Netz Niederösterreich, Meldepflichtige Geräte:
//     https://netz-noe.at/strom/meldepflichtige-geraete
//     (alle Ladeeinrichtungen meldepflichtig; bis 11 kW dreiphasig je
//     Netzanschlusspunkt grundsätzlich möglich; darüber Einzelprüfung)
//   - Smart Meter / ElWG § 54: https://netz-noe.at/energiezukunft/elwg-zu-smart-meter
//     (kein Opt-out bei meldepflichtigen Anlagen wie Wallbox)
//   - Schieflastgrenze einphasig 3,68 kVA (16 A) nach den Technischen
//     Anschlussbedingungen (TAEV) der österreichischen Netzbetreiber.
//
// Preisannahmen kommen aus den zentralen Modulen (nicht abtippen):
//   Haushaltsstrom  → ANNAHMEN.strompreis (src/data/solarrechner.js)
//   Einspeise-Erlös → VERGUETUNG.saetze (src/data/einspeiseverguetung.js, OeMAG-Marktpreis)
//   Öffentlich laden → WALLBOX.oeffentlichCt (src/lib/rechner/annahmen.js)
// Relative Importe, damit die Datei ohne Pfad-Alias per Node ladbar bleibt.

import { ANNAHMEN } from "./solarrechner.js";
import { VERGUETUNG } from "./einspeiseverguetung.js";
import { WALLBOX as RECHNER_WALLBOX } from "../lib/rechner/annahmen.js";

export const WALLBOX = {
  // Spanne für eine 11-kW-Wallbox inkl. Installation im Einfamilienhaus
  // (Richtwert brutto inkl. 20 % USt; Marktübersicht, keine Ökovolt-Preise).
  gesamtVon: 1000,
  gesamtBis: 2700,

  // Kosten nach Variante (Gerät / Installation / Gesamt in EUR, Richtwerte)
  varianten: [
    { name: "11 kW Einstieg", geraet: [300, 500], montage: [400, 700], gesamt: [1000, 1200] },
    { name: "11 kW Mittelklasse", geraet: [600, 800], montage: [700, 1200], gesamt: [1300, 2000] },
    { name: "11 kW Premium", geraet: [1000, 1200], montage: [700, 1200], gesamt: [1700, 2400] },
    { name: "22 kW", geraet: [800, 2000], montage: [1000, 1800], gesamt: [1800, 4300] },
  ],

  // Installationskosten nach Gebäudetyp (nur Montage, Richtwerte)
  gebaeude: [
    { typ: "Neubau mit Leerrohr", kosten: [400, 700], grund: "kurzer Kabelweg, moderner Zählerschrank" },
    { typ: "Bestandsbau, Garage am Haus", kosten: [700, 1200], grund: "10–15 m Kabelweg, ggf. Wanddurchbruch" },
    { typ: "Altbau vor 2000", kosten: [1000, 1800], grund: "Zählerschrank ertüchtigen, Erdung nachrüsten" },
    { typ: "Freistehende Garage / Carport", kosten: [800, 1500], grund: "Erdkabel verlegen, Grabungsarbeiten" },
    { typ: "Tiefgarage im Mehrparteienhaus", kosten: [1200, 2500], grund: "Brandschutz, Lastmanagement, Zustimmung der Miteigentümer" },
  ],

  // Österreich: Regeln der Netzbetreiber (siehe Quellen oben)
  netzbetreiber: {
    meldung: "Jede Ladeeinrichtung ist dem Netzbetreiber zu melden – das erledigt der Elektrotechniker.",
    ohnePruefungBisKw: 11, // dreiphasig je Netzanschlusspunkt, in der Regel ohne gesonderte Netzprüfung
    schieflastKva: 3.68, // max. einphasige Anschlussleistung (16 A)
    smartMeterOptOut: false, // mit meldepflichtiger Wallbox kein Opt-out (§ 54 Abs. 2 ElWG)
  },

  // Wohnungseigentum: Zustimmungsfiktion nach § 16 WEG seit 1.1.2022
  weg: { zustimmungsfiktionMonate: 2, seit: "1. Jänner 2022" },

  // Preisannahmen Österreich für die Rechner (Richtwerte, Stand 09/2026)
  preiseAt: {
    netzstromCt: Math.round(ANNAHMEN.strompreis * 100), // vermeidbarer Haushalts-Arbeitspreis brutto
    marktpreisCt: VERGUETUNG.saetze[0].teileinspeisung, // Erlös für eingespeisten Überschuss (netto)
    oeffentlichCt: RECHNER_WALLBOX.oeffentlichCt, // Ad-hoc-Preis öffentlich, grobe Orientierung
  },

  // Verbrauch eines Kompakt-E-Autos je 100 km (kWh)
  verbrauchProHundert: 20,

  // ------------------------------------------------------------------------
  // @deprecated – deutsche Rechtslage. Nur noch für nicht umgestellte
  // Ratgeber-Dateien vorhanden, damit deren Import nicht bricht. NICHT auf
  // österreichischen Seiten verwenden; entfernen, sobald kein Import mehr
  // darauf zugreift (grep: paragraf14a, mfhProgramm, handwerkerbonus).
  // ------------------------------------------------------------------------
  paragraf14a: { ersparnisVon: 110, ersparnisBis: 190, drosselungKw: 4.2 },
  mfhProgramm: {
    von: "15. April 2026",
    bis: "10. November 2026",
    saetze: [
      { was: "Vorverkabelung ohne Ladepunkt", bis: 1300 },
      { was: "Wallbox installiert (bis 22 kW)", bis: 1500 },
      { was: "Wallbox mit bidirektionalem Laden", bis: 2000 },
    ],
  },
  handwerkerbonus: { anteil: 0.2, maxProJahr: 1200 },
};

/** "1.000–2.700 €" aus einem [von, bis]-Paar */
export function spanne([von, bis]) {
  return `${von.toLocaleString("de-DE")}–${bis.toLocaleString("de-DE")} €`;
}
