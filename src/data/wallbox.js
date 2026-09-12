// src/data/wallbox.js
//
// Zahlen fuer den Wallbox-Ratgeber an EINER Stelle. Recherchestand
// September 2026; Quellen im jeweiligen Kommentar. Bei Preis- oder
// Foerderaenderungen nur diese Datei anfassen.

export const WALLBOX = {
  // Spanne fuer eine 11-kW-Wallbox inkl. Installation im Einfamilienhaus.
  // Mehrere Fachquellen nennen uebereinstimmend 1.000-2.700 EUR.
  gesamtVon: 1000,
  gesamtBis: 2700,

  // Kosten nach Variante (Geraet / Installation / Gesamt in EUR)
  varianten: [
    { name: "11 kW Einstieg", geraet: [300, 500], montage: [400, 700], gesamt: [1000, 1200] },
    { name: "11 kW Mittelklasse", geraet: [600, 800], montage: [700, 1200], gesamt: [1300, 2000] },
    { name: "11 kW Premium", geraet: [1000, 1200], montage: [700, 1200], gesamt: [1700, 2400] },
    { name: "22 kW", geraet: [800, 2000], montage: [1000, 1800], gesamt: [1800, 4300] },
  ],

  // Installationskosten nach Gebaeudetyp (nur Montage)
  gebaeude: [
    { typ: "Neubau mit Leerrohr", kosten: [400, 700], grund: "kurzer Kabelweg, moderner Zählerschrank" },
    { typ: "Bestandsbau, Garage am Haus", kosten: [700, 1200], grund: "10–15 m Kabelweg, ggf. Wanddurchbruch" },
    { typ: "Altbau vor 2000", kosten: [1000, 1800], grund: "Zählerschrank ertüchtigen, Erdung nachrüsten" },
    { typ: "Freistehende Garage / Carport", kosten: [800, 1500], grund: "Erdkabel verlegen, Grabungsarbeiten" },
    { typ: "Tiefgarage im Mehrparteienhaus", kosten: [1200, 2500], grund: "Brandschutz, Lastmanagement, WEG-Abstimmung" },
  ],

  // Bundesprogramm "Laden im Mehrparteienhaus"
  mfhProgramm: {
    von: "15. April 2026",
    bis: "10. November 2026",
    saetze: [
      { was: "Vorverkabelung ohne Ladepunkt", bis: 1300 },
      { was: "Wallbox installiert (bis 22 kW)", bis: 1500 },
      { was: "Wallbox mit bidirektionalem Laden", bis: 2000 },
    ],
  },

  // § 14a EnWG: Netzentgelt-Rabatt fuer steuerbare Verbrauchseinrichtungen
  paragraf14a: { ersparnisVon: 110, ersparnisBis: 190, drosselungKw: 4.2 },

  // Handwerkerbonus nach § 35a EStG
  handwerkerbonus: { anteil: 0.2, maxProJahr: 1200 },

  // Verbrauch eines Kompakt-E-Autos je 100 km (kWh)
  verbrauchProHundert: 20,
};

/** "1.000–2.700 €" aus einem [von, bis]-Paar */
export function spanne([von, bis]) {
  return `${von.toLocaleString("de-DE")}–${bis.toLocaleString("de-DE")} €`;
}
