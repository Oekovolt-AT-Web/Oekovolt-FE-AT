// src/components/GewerbeUnikat/_beispiel.js
//
// DIE eine Beispielrechnung der Seite /gewerbe (300 kWp, Netzebene 6, Oberösterreich) als Zahlen und als
// reine Rechenfunktion. Startzustand von Hero-Kurzantwort, kWh-Röntgen (K4) und Rechenweg-Pult (K7).
// Rein, ohne React – Server und Client. Die Werte sind identisch mit der bisherigen Tabelle BEISPIEL in
// src/app/gewerbe/page.js (Stand 09/2026); ändern nur gemeinsam mit FAQ-Text und Kurzantwort.

/** Annahmen des Rechenbeispiels (alle netto). */
export const BEISPIEL = {
  kwp: 300,
  ertragKwhKwp: 1050, // Innviertel, Richtwert nach PVGIS
  evQuote: 0.7, // Eigenverbrauch Zweischichtbetrieb
  energieCt: 11.0, // Energiepreis Liefervertrag
  netzApCt: 2.37, // Netznutzung Arbeitspreis NE 6 OÖ (SNE-V 2018 – Novelle 2026)
  netzverlustCt: 0.454, // Netzverlustentgelt NE 6 OÖ
  abgabeCt: 0.82, // Elektrizitätsabgabe Unternehmen 2026 (befristet; regulär 1,5)
  ueberschussCt: 6.0, // Rechensatz Überschusserlös
  betriebAnteil: 0.015, // Betrieb, Wartung, Versicherung je Jahr (Anteil Investition)
  investKwp: 800, // Marktannahme €/kWp netto – kein Ökovolt-Preis
  eagKwp: 100, // Annahme Zuschlag Kategorie D (Höchstsatz 2026: 120 €/kWp)
  ifbSatz: 0.22, // Öko-IFB für Anschaffungen bis 31.12.2026
  ifbSatzDanach: 0.15,
  koest: 0.23,
  ifbBasisMax: 1_000_000,
  bereich: "ooe",
  ne: 6,
  ort: "Innviertel",
  stand: "09/2026",
};

/**
 * Rechenweg wie die Beispieltabelle – jede Zeile nachrechenbar.
 * @param {Partial<typeof BEISPIEL>} p Abweichungen vom Beispiel (Regler im Pult)
 */
export function rechenweg(p = {}) {
  const a = { ...BEISPIEL, ...p };
  const ertrag = a.kwp * a.ertragKwhKwp;
  const eigen = ertrag * a.evQuote;
  const ueberschuss = ertrag - eigen;
  const vermiedenCt = a.energieCt + a.netzApCt + a.netzverlustCt + a.abgabeCt;
  const ersparnis = (eigen * vermiedenCt) / 100;
  const erloes = (ueberschuss * a.ueberschussCt) / 100;
  const investitionBrutto = a.kwp * a.investKwp;
  const betrieb = investitionBrutto * a.betriebAnteil;
  const jahr = ersparnis + erloes - betrieb;
  const zuschuss = a.kwp * a.eagKwp;
  const investition = Math.max(0, investitionBrutto - zuschuss);
  const amortisation = jahr > 0 ? investition / jahr : null;
  const ifbBasis = Math.min(investition, a.ifbBasisMax);
  const ifbWirkung = ifbBasis * a.ifbSatz * a.koest;
  const ifbWirkungDanach = ifbBasis * a.ifbSatzDanach * a.koest;
  return {
    eingaben: a,
    ertrag,
    eigen,
    ueberschuss,
    vermiedenCt,
    faktor: a.ueberschussCt > 0 ? vermiedenCt / a.ueberschussCt : null,
    ersparnis,
    erloes,
    betrieb,
    jahr,
    investitionBrutto,
    zuschuss,
    investition,
    amortisation,
    ifbWirkung,
    ifbDifferenz: ifbWirkung - ifbWirkungDanach,
  };
}

/** Ergebnis des unveränderten Beispiels (≈ 34.360 €/Jahr, ≈ 6,1 Jahre, ≈ 10.600 € IFB-Wirkung). */
export const BEISPIEL_ERGEBNIS = rechenweg();
