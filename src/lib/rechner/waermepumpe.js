// src/lib/rechner/waermepumpe.js
//
// Wärmepumpen-Rechner: jährliche Heizkosten und CO₂ von Gas/Öl gegenüber
// einer Wärmepumpe mit Netzstrom bzw. mit Solarstrom-Anteil.

import { jahresreihen, simuliere } from "./profile.js";
import { ALLGEMEIN, WAERMEPUMPE as W, satzFuer } from "./annahmen.js";

/** Nutzwärmebedarf in kWh/Jahr */
export function waermebedarf({ flaeche, standard, verbrauchBekannt = false, heizung = "gas", verbrauchWert = 0 }) {
  if (verbrauchBekannt && verbrauchWert > 0) {
    const h = W.heizungen[heizung];
    const brennstoffKwh = heizung === "oel" ? verbrauchWert * h.kwhJeLiter : verbrauchWert;
    return brennstoffKwh * h.nutzungsgrad;
  }
  const s = W.standards.find((x) => x.id === standard) || W.standards[2];
  return flaeche * s.kwhProQm;
}

/** Empfohlene Jahresarbeitszahl je Gebäudestandard */
export const jazFuer = (standard) => (W.standards.find((x) => x.id === standard) || W.standards[2]).jaz;

/**
 * @param {object} e
 * @param {number} e.flaeche        Wohnfläche m²
 * @param {string} e.standard       id aus WAERMEPUMPE.standards
 * @param {boolean} e.verbrauchBekannt
 * @param {number} e.verbrauchWert  kWh Gas bzw. Liter Öl pro Jahr
 * @param {"gas"|"oel"} e.heizung
 * @param {number} e.preis          Gas: ct/kWh, Öl: €/100 l
 * @param {number} e.jaz
 * @param {number} e.wpTarifCt      Strompreis für die Wärmepumpe
 * @param {"keine"|"pv"|"pvSpeicher"} e.pv
 * @param {number} e.kwp
 */
export function rechneWaermepumpe(e) {
  const { heizung = "gas", preis, jaz, wpTarifCt = W.wpTarifCt, pv = "keine", kwp = 10 } = e;
  const h = W.heizungen[heizung];
  const bedarf = waermebedarf(e);

  // --- Bisherige Heizung ---
  const brennstoffKwh = bedarf / h.nutzungsgrad;
  const preisJeKwh = heizung === "oel" ? preis / 100 / h.kwhJeLiter : preis / 100; // €/kWh
  const fossilBrennstoff = brennstoffKwh * preisJeKwh;
  const fossil = {
    brennstoff: fossilBrennstoff,
    nebenkosten: h.nebenkosten,
    summe: fossilBrennstoff + h.nebenkosten,
    co2: brennstoffKwh * h.co2,
    menge: heizung === "oel" ? brennstoffKwh / h.kwhJeLiter : brennstoffKwh,
  };

  // --- Wärmepumpe mit Netzstrom ---
  const wpStrom = bedarf / jaz;
  const netz = {
    strom: wpStrom * (wpTarifCt / 100),
    nebenkosten: W.wpNebenkosten,
    summe: wpStrom * (wpTarifCt / 100) + W.wpNebenkosten,
    co2: wpStrom * ALLGEMEIN.co2Strommix,
  };

  // --- Wärmepumpe mit PV-Anteil (stündliche Jahressimulation) ---
  let solar = null;
  let monate = null;
  if (pv !== "keine" && kwp > 0) {
    const reihen = jahresreihen({ kwp, ertragProKwp: ALLGEMEIN.ertragProKwp, haushaltKwh: W.haushaltKwh, wpKwh: wpStrom });
    const sim = simuliere(reihen, pv === "pvSpeicher" ? W.speicherMitPv : 0);
    const solarKwh = Math.min(sim.deckung.wp, wpStrom);
    const anteil = wpStrom > 0 ? solarKwh / wpStrom : 0;
    const satz = satzFuer(kwp, "teileinspeisung") / 100;
    const reststrom = wpStrom - solarKwh;
    // Solarstrom "kostet" die entgangene Einspeisevergütung
    const stromkosten = reststrom * (wpTarifCt / 100) + solarKwh * satz;
    solar = {
      anteil,
      solarKwh,
      reststrom,
      strom: stromkosten,
      nebenkosten: W.wpNebenkosten,
      summe: stromkosten + W.wpNebenkosten,
      co2: reststrom * ALLGEMEIN.co2Strommix,
      satzCt: satz * 100,
    };
    monate = sim.monate.map((m) => ({ name: m.name, wp: m.wp, solar: m.wpSolar }));
  } else {
    // Monatsverteilung ohne PV (für das Diagramm)
    const reihen = jahresreihen({ kwp: 0, haushaltKwh: 0, wpKwh: wpStrom });
    monate = simuliere(reihen, 0).monate.map((m) => ({ name: m.name, wp: m.wp, solar: 0 }));
  }

  const best = solar || netz;
  const f = W.foerderung;
  const foerderfaehig = Math.min(f.investitionOrientierung, f.kostenDeckelErsteWe);

  return {
    bedarf,
    wpStrom,
    fossil,
    netz,
    solar,
    monate,
    ersparnisNetz: fossil.summe - netz.summe,
    ersparnisBest: fossil.summe - best.summe,
    co2Ersparnis: fossil.co2 - best.co2,
    co2Anteil: fossil.co2 > 0 ? (fossil.co2 - best.co2) / fossil.co2 : 0,
    foerderung: {
      min: foerderfaehig * (f.grundProzent / 100),
      max: foerderfaehig * (f.maxProzent / 100),
      foerderfaehig,
    },
  };
}
