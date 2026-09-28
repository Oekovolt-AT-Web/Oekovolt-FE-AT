// src/lib/rechner/wallbox.js
//
// E-Auto-Laderechner: Kosten und CO₂ je Jahr – Verbrenner gegen E-Auto mit
// Netzstrom bzw. mit Solarstrom-Anteil an der eigenen Wallbox.

import { ALLGEMEIN, WALLBOX as W, satzFuer } from "./annahmen.js";

/**
 * @param {object} e
 * @param {number} e.km                 Fahrleistung pro Jahr
 * @param {number} e.verbrauch          kWh/100 km (an der Wallbox inkl. Ladeverluste)
 * @param {number} e.anteilZuhause      0…1 – Anteil, der zu Hause geladen wird
 * @param {number} e.anteilPv           0…1 – Anteil des Heimladens aus PV-Überschuss
 * @param {"benzin"|"diesel"} e.kraftstoff
 * @param {number} e.kraftstoffPreis    €/l
 * @param {number} e.kraftstoffVerbrauch l/100 km
 * @param {number} e.strompreisCt       Netzstrom zu Hause ct/kWh
 * @param {number} e.kwp                für den Einspeise-Rechensatz (entgangener Erlös)
 */
export function rechneWallbox(e) {
  const {
    km,
    verbrauch,
    anteilZuhause,
    anteilPv,
    kraftstoff = "benzin",
    kraftstoffPreis = W.kraftstoffe[kraftstoff].preis,
    kraftstoffVerbrauch = W.kraftstoffe[kraftstoff].verbrauch,
    strompreisCt = ALLGEMEIN.strompreis * 100,
    kwp = 10,
  } = e;
  const k = W.kraftstoffe[kraftstoff];
  const satz = satzFuer(kwp, "teileinspeisung") / 100;
  const strom = strompreisCt / 100;
  const oeffentlich = W.oeffentlichCt / 100;

  // --- Verbrenner ---
  const liter = (km * kraftstoffVerbrauch) / 100;
  const verbrenner = { summe: liter * kraftstoffPreis, liter, co2: liter * k.co2 };

  // --- E-Auto ---
  const kwhGesamt = (km * verbrauch) / 100;
  const kwhZuhause = kwhGesamt * anteilZuhause;
  const kwhOeffentlich = kwhGesamt - kwhZuhause;

  const netzSzenario = {
    zuhause: kwhZuhause * strom,
    solar: 0,
    oeffentlich: kwhOeffentlich * oeffentlich,
  };
  netzSzenario.summe = netzSzenario.zuhause + netzSzenario.oeffentlich;
  netzSzenario.co2 = kwhGesamt * ALLGEMEIN.co2Strommix;

  const kwhSolar = kwhZuhause * anteilPv;
  const kwhNetzZuhause = kwhZuhause - kwhSolar;
  const solarSzenario = {
    zuhause: kwhNetzZuhause * strom,
    // Solarstrom kostet den entgangenen Einspeiseerlös (OeMAG-Marktpreis/Tarif)
    solar: kwhSolar * satz,
    oeffentlich: kwhOeffentlich * oeffentlich,
  };
  solarSzenario.summe = solarSzenario.zuhause + solarSzenario.solar + solarSzenario.oeffentlich;
  solarSzenario.co2 = (kwhNetzZuhause + kwhOeffentlich) * ALLGEMEIN.co2Strommix + kwhSolar * W.co2Solar;

  const je100 = (summe) => (km > 0 ? (summe / km) * 100 : 0);

  return {
    kwhGesamt,
    kwhZuhause,
    kwhSolar,
    kwhOeffentlich,
    verbrenner: { ...verbrenner, je100: je100(verbrenner.summe) },
    netz: { ...netzSzenario, je100: je100(netzSzenario.summe) },
    solar: { ...solarSzenario, je100: je100(solarSzenario.summe) },
    ersparnisNetz: verbrenner.summe - netzSzenario.summe,
    ersparnisSolar: verbrenner.summe - solarSzenario.summe,
    solarVorteil: netzSzenario.summe - solarSzenario.summe,
    co2Ersparnis: verbrenner.co2 - solarSzenario.co2,
    satzCt: satz * 100,
  };
}
