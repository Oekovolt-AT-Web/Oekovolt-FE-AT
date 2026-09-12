// src/data/solarrechner.js
//
// Alle Annahmen des Solarrechners an EINER Stelle. Wenn sich Preise oder
// Erfahrungswerte aendern, nur hier anpassen - der Rechner, die Ergebnisse
// und die ausgewiesenen Hinweistexte ziehen sich alles hieraus.
//
// WICHTIG: Das sind Richtwerte fuer eine erste Orientierung, keine Angebote.
// Der Rechner weist das an der Oberflaeche auch aus.

export const ANNAHMEN = {
  // --- Ertrag ---------------------------------------------------------
  // Spezifischer Jahresertrag in kWh je kWp bei Sued-Ausrichtung und
  // guenstiger Neigung. 1.000 ist ein belastbarer Wert fuer Sueddeutschland
  // (Allgaeu/Schwaben); Norddeutschland liegt eher bei 900.
  ertragProKwpSued: 1000,

  // Modulflaeche: moderne Module brauchen rund 5 m² Dachflaeche je kWp.
  qmProKwp: 5,

  // --- Preise (Richtwerte, Endpreise bei 0 % USt nach § 12 Abs. 3 UStG) ---
  // Recherchestand September 2026:
  //   Fraunhofer ISE nennt im Marktschnitt rund 1.015 EUR/kWp (Maerz 2026).
  //   Fuer eine schluesselfertige 10-kWp-Anlage werden 1.000-1.300 EUR/kWp
  //   bzw. rund 12.000 EUR gesamt genannt; kleine Anlagen liegen wegen der
  //   Fixkosten (Geruest, Anfahrt, Zaehlerschrank) deutlich darueber.
  // Anlagenpreis je kWp faellt mit der Groesse. Stuetzstellen, dazwischen
  // wird linear interpoliert.
  preisProKwp: [
    { kwp: 5, eur: 1450 },
    { kwp: 10, eur: 1200 },
    { kwp: 20, eur: 1050 },
    { kwp: 30, eur: 980 },
  ],
  // Speicher GEMEINSAM mit der Anlage installiert. Reine Hardware liegt im
  // Marktschnitt bei rund 315 EUR/kWh, installiert werden fuer 10 kWh
  // 3.000-7.000 EUR genannt. Eine spaetere Nachruestung ist teurer
  // (eigener Batterie-Wechselrichter, zweiter Montagetermin).
  speicherPreisProKwh: 450,

  // --- Verbrauch & Eigenverbrauch --------------------------------------
  // Gerechnet wird ueber die AUTARKIE (welcher Anteil des Verbrauchs aus der
  // eigenen Anlage kommt), nicht ueber den Erzeugungsanteil. Sonst kommen bei
  // ueberdimensionierten Anlagen unrealistische 100 % heraus - im Winter
  // liefert keine PV-Anlage genug, 100 % Autarkie gibt es praktisch nie.
  autarkieOhneSpeicher: 0.3,
  // Mit Speicher: Grundwert + Zuschlag je kWh, gedeckelt.
  autarkieMitSpeicherBasis: 0.3,
  autarkieProKwhSpeicher: 0.05,
  autarkieMax: 0.8,

  // Strompreis, den der Eigenverbrauch ersetzt (EUR/kWh).
  // BDEW nennt fuer 2026 im Schnitt 37,0 ct; Bestandskunden zahlen im
  // September 2026 rund 31,1 ct. 33 ct ist der bewusst vorsichtige Mittelwert -
  // lieber unter- als ueberversprechen.
  strompreis: 0.33,

  // Jaehrliche Betriebskosten je kWp: Versicherung, Wartung, Zaehlermiete,
  // Reinigung und Ruecklage fuer den Wechselrichtertausch. Fuer eine
  // 10-kWp-Anlage werden 200-400 EUR/Jahr genannt.
  betriebskostenProKwp: 25,
};

// Ausrichtung: Faktor auf den Sued-Ertrag
export const AUSRICHTUNGEN = [
  { id: "sued", label: "Süd", faktor: 1.0 },
  { id: "suedost", label: "Südost / Südwest", faktor: 0.95 },
  { id: "ost-west", label: "Ost / West", faktor: 0.85 },
  { id: "nord", label: "Nord", faktor: 0.6 },
];

// Dachneigung: Faktor auf den Ertrag
export const NEIGUNGEN = [
  { id: "flach", label: "Flachdach (0–15°)", faktor: 0.9 },
  { id: "mittel", label: "Schrägdach (15–40°)", faktor: 1.0 },
  { id: "steil", label: "Steiles Dach (über 40°)", faktor: 0.93 },
];

/** Anlagenpreis je kWp, linear zwischen den Stuetzstellen interpoliert. */
export function preisProKwp(kwp) {
  const p = ANNAHMEN.preisProKwp;
  if (kwp <= p[0].kwp) return p[0].eur;
  if (kwp >= p[p.length - 1].kwp) return p[p.length - 1].eur;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i];
    const b = p[i + 1];
    if (kwp >= a.kwp && kwp <= b.kwp) {
      const t = (kwp - a.kwp) / (b.kwp - a.kwp);
      return a.eur + t * (b.eur - a.eur);
    }
  }
  return p[p.length - 1].eur;
}
