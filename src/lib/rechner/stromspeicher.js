// src/lib/rechner/stromspeicher.js
//
// Stromspeicher-Rechner: Autarkie, Eigenverbrauch und Wirtschaftlichkeit
// mit und ohne Speicher auf Basis der stündlichen Jahressimulation.

import { jahresreihen, simuliere } from "./profile.js";
import { ALLGEMEIN, SPEICHER, satzFuer } from "./annahmen.js";

/**
 * Jahresreihen für die Eingaben – teuer, daher getrennt von der Speichergröße.
 * @param {object} e { verbrauch, kwp, eAuto, km, waermepumpe }
 */
export function speicherReihen({ verbrauch, kwp, eAuto = false, km = 0, waermepumpe = false }) {
  const eAutoKwh = eAuto ? (km * SPEICHER.eAutoVerbrauch * SPEICHER.eAutoLadeanteilZuhause) / 100 : 0;
  const wpKwh = waermepumpe ? SPEICHER.wpStromKwh : 0;
  return {
    reihen: jahresreihen({ kwp, ertragProKwp: ALLGEMEIN.ertragProKwp, haushaltKwh: verbrauch, eAutoKwh, wpKwh }),
    eAutoKwh,
    wpKwh,
    gesamtverbrauch: verbrauch + eAutoKwh + wpKwh,
  };
}

const OPT = { wirkungsgrad: SPEICHER.wirkungsgradJeRichtung, nutzbarAnteil: SPEICHER.nutzbarAnteil };

/** Mehrkosten des Speichers in € */
export function speicherKosten(kwh, nachruesten = false) {
  if (kwh <= 0) return 0;
  return kwh * SPEICHER.preisProKwh + (nachruesten ? SPEICHER.nachruestAufschlag : 0);
}

/**
 * Wirtschaftlicher Vergleich einer Speichergröße gegen "ohne Speicher".
 * Ersparnis = vermiedener Netzbezug × Strompreis − entgangene Einspeisevergütung.
 */
function bewerte(ohne, mit, kwp) {
  const satz = satzFuer(kwp, "teileinspeisung") / 100;
  const wenigerNetz = ohne.netz - mit.netz;
  const wenigerEinspeisung = ohne.einspeisung - mit.einspeisung;
  return wenigerNetz * ALLGEMEIN.strompreis - wenigerEinspeisung * satz;
}

/**
 * Wirtschaftlichkeit über die Nutzungsdauer: der ersetzte Strompreis steigt
 * jährlich (wie im Solarrechner), die Einspeisevergütung bleibt nominal fest.
 * @returns {{ summe: number, amortisation: number|null }}
 */
function lebenszyklus(ohne, mit, kwp, kosten) {
  const satz = satzFuer(kwp, "teileinspeisung") / 100;
  const netz = (ohne.netz - mit.netz) * ALLGEMEIN.strompreis;
  const einsp = (ohne.einspeisung - mit.einspeisung) * satz;
  let kumuliert = -kosten;
  let summe = 0;
  let amortisation = null;
  for (let t = 1; t <= SPEICHER.lebensdauerJahre; t++) {
    const netto = netz * Math.pow(1 + SPEICHER.strompreisSteigerung, t - 1) - einsp;
    const vorher = kumuliert;
    kumuliert += netto;
    summe += netto;
    if (amortisation === null && vorher < 0 && kumuliert >= 0 && netto > 0) amortisation = t - 1 + -vorher / netto;
  }
  return { summe, amortisation };
}

/**
 * Autarkie-Kurve über alle Speichergrößen 0 … maxKwh (1-kWh-Schritte)
 * inkl. wirtschaftlichem Optimum (größter Überschuss über die Lebensdauer).
 */
export function speicherKurve(basis, { kwp, nachruesten = false }) {
  const { reihen } = basis;
  const ohne = simuliere(reihen, 0, OPT);
  const punkte = [];
  for (let kap = 0; kap <= SPEICHER.maxKwh; kap++) {
    const s = kap === 0 ? ohne : simuliere(reihen, kap, OPT);
    const ersparnis = kap === 0 ? 0 : bewerte(ohne, s, kwp);
    const kosten = speicherKosten(kap, nachruesten);
    const lz = kap === 0 ? { summe: 0 } : lebenszyklus(ohne, s, kwp, kosten);
    punkte.push({
      kap,
      autarkie: s.autarkie,
      eigenverbrauchsquote: s.eigenverbrauchsquote,
      ersparnis,
      kosten,
      ueberschuss: lz.summe - kosten,
      vollzyklen: s.vollzyklen,
    });
  }
  // Optimum: größter Überschuss; bei fast gleichem Wert (< 1 %) die kleinere Größe
  let optimum = null;
  for (const p of punkte) {
    if (p.kap === 0 || p.ueberschuss <= 0) continue;
    if (!optimum || p.ueberschuss > optimum.ueberschuss * 1.01) optimum = p;
  }
  return { ohne, punkte, optimum };
}

/**
 * Ergebnis für die gewählte Speichergröße.
 * @param {object} basis   aus speicherReihen()
 * @param {object} e       { kwp, speicher, nachruesten }
 */
export function speicherErgebnis(basis, { kwp, speicher, nachruesten = false }) {
  const { reihen, gesamtverbrauch } = basis;
  const ohne = simuliere(reihen, 0, OPT);
  const mit = speicher > 0 ? simuliere(reihen, speicher, OPT) : ohne;
  const ersparnis = speicher > 0 ? bewerte(ohne, mit, kwp) : 0;
  const kosten = speicherKosten(speicher, nachruesten);
  const lz = speicher > 0 ? lebenszyklus(ohne, mit, kwp, kosten) : { summe: 0, amortisation: null };
  // Amortisation innerhalb der Nutzungsdauer; sonst einfache Schätzung (Kosten / Ersparnis)
  const amortisation = lz.amortisation ?? (ersparnis > 0 ? kosten / ersparnis : null);
  return {
    gesamtverbrauch,
    erzeugung: mit.pv,
    ohne: { autarkie: ohne.autarkie, eigenverbrauchsquote: ohne.eigenverbrauchsquote, netz: ohne.netz, einspeisung: ohne.einspeisung },
    mit: { autarkie: mit.autarkie, eigenverbrauchsquote: mit.eigenverbrauchsquote, netz: mit.netz, einspeisung: mit.einspeisung },
    ersparnis,
    kosten,
    amortisation,
    lohntSich: amortisation != null && amortisation <= SPEICHER.lebensdauerJahre,
    ueberschuss: lz.summe - kosten,
    vollzyklen: mit.vollzyklen,
    satzCt: satzFuer(kwp, "teileinspeisung"),
  };
}

/** Komfort: alles in einem Aufruf (für Tests) */
export function rechneStromspeicher(e) {
  const basis = speicherReihen(e);
  const kurve = speicherKurve(basis, e);
  return { ...speicherErgebnis(basis, e), kurve };
}
