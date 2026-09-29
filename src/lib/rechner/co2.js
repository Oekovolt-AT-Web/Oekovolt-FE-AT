// src/lib/rechner/co2.js
//
// CO₂- & ESG-Rechner (/rechner/co2-esg): Scope-2-Emissionen vorher/nachher nach
// GHG Protocol Scope 2 Guidance – standortbasiert (location-based) und
// marktbasiert (market-based) – plus optional Scope 1 der Fahrzeugflotte.
// Reine Funktionen ohne React/Pfad-Aliase (per Node prüfbar). Stand: September 2026.
//
// Quellen/Annahmen (im UI offengelegt):
//  - Standortbasiert: mittlere österreichische Stromaufbringung 2024 = 105,4 g CO₂äqu/kWh
//    („Innovative Energietechnologien in Österreich – Marktentwicklung 2024“, BMIMI 06/2025,
//    Kap. 3.2.3, Basis E-Control/ENFOS) – identisch mit ALLGEMEIN.co2Strommix der Rechner.
//    Frei änderbar, damit Sie den Faktor Ihres Berichtsjahres einsetzen können.
//  - Marktbasiert: Wert der Stromkennzeichnung Ihres Lieferanten (g CO₂/kWh auf Rechnung
//    bzw. Website; überwacht von der E-Control). Strom mit Herkunftsnachweisen
//    aus erneuerbaren Quellen wird mit 0 g/kWh bilanziert.
//    Versorgermix Österreich Kennzeichnungsperiode 2025: 87,34 % erneuerbar, 12,71 % fossil,
//    keine Nachweise aus Kernenergie (E-Control, Presseaussendung 03.09.2026).
//  - Vermiedene Emissionen im Stromsystem (nur Zusatzinformation, NICHT Scope 2):
//    258,2 g CO₂äqu/kWh Substitutionsfaktor für PV-Strom (Marktentwicklung 2024, Tab. 34).
//  - Kraftstoffe (Tank-to-Wheel): Diesel 2,65 kg CO₂/l, Benzin 2,37 kg CO₂/l
//    (wie E-Auto-Rechner, src/lib/rechner/annahmen.js).
//  - PV-Ertrag ohne Standortangabe: 1.000 kWh/kWp (Volllaststunden der österreichischen
//    Marktstatistik 2024; siehe src/data/solarrechner.js).

import { ALLGEMEIN, SOLAR, WALLBOX } from "./annahmen.js";

export const CO2 = {
  lokFaktorG: Math.round(ALLGEMEIN.co2Strommix * 10000) / 10, // 105,4 g/kWh
  substitutionG: Math.round(SOLAR.co2KgProKwh * 10000) / 10, // 258,2 g/kWh
  marktFaktorBeispielG: 150, // Beispielwert – bitte Wert der eigenen Stromkennzeichnung eintragen
  versorgermix2025: { erneuerbar: 87.34, fossil: 12.71 },
  pvErtragProKwp: 1000,
  dieselKgProLiter: WALLBOX.kraftstoffe.diesel.co2,
  benzinKgProLiter: WALLBOX.kraftstoffe.benzin.co2,
  // Vergleichsgröße Pkw-Kilometer: Benziner 7,0 l/100 km × 2,37 kg/l (wie E-Auto-Rechner)
  pkwKgProKm: (WALLBOX.kraftstoffe.benzin.verbrauch * WALLBOX.kraftstoffe.benzin.co2) / 100,
  eFahrzeugKwhJe100: 20, // Annahme Fuhrpark-Mix Pkw/Transporter inkl. Ladeverluste
};

/**
 * @param {object} e
 * @param {number} e.strombezugKwh   Stromverbrauch des Betriebs pro Jahr (heute, ohne Eigenstrom)
 * @param {number} e.lokFaktorG      g CO₂/kWh standortbasiert
 * @param {number} e.marktFaktorG    g CO₂/kWh laut Stromkennzeichnung des Lieferanten (heute)
 * @param {number} e.oekoAnteil      Anteil des verbleibenden Netzbezugs mit erneuerbaren Herkunftsnachweisen (0–1, nachher)
 * @param {object} [e.pv]            { kwp, ertragProKwp, eigenverbrauchsquote } – Eigenverbrauch senkt den Netzbezug
 * @param {object} [e.flotte]        { fahrzeuge, kmJeFahrzeug, literJe100, anteilElektrisch, kwhJe100, pvLadeanteil }
 */
export function rechneCo2({ strombezugKwh, lokFaktorG = CO2.lokFaktorG, marktFaktorG = CO2.marktFaktorBeispielG, oekoAnteil = 0, pv = null, flotte = null }) {
  const verbrauch = Math.max(Number(strombezugKwh) || 0, 0);
  const lok = Math.max(lokFaktorG, 0) / 1000; // kg/kWh
  const markt = Math.max(marktFaktorG, 0) / 1000;
  const oeko = Math.min(Math.max(oekoAnteil, 0), 1);

  // --- Photovoltaik ---
  const pvErtrag = pv && pv.kwp > 0 ? pv.kwp * (pv.ertragProKwp || CO2.pvErtragProKwp) : 0;
  const pvEigen = Math.min(pvErtrag * Math.min(Math.max(pv?.eigenverbrauchsquote ?? 0, 0), 1), verbrauch);
  let pvUeberschuss = Math.max(pvErtrag - pvEigen, 0);

  // --- Flotte (optional) ---
  let scope1Vorher = 0;
  let scope1Nachher = 0;
  let ladestrom = 0;
  let ladestromPv = 0;
  if (flotte && flotte.fahrzeuge > 0) {
    const km = flotte.fahrzeuge * flotte.kmJeFahrzeug;
    const liter = (km * flotte.literJe100) / 100;
    const anteilE = Math.min(Math.max(flotte.anteilElektrisch, 0), 1);
    scope1Vorher = liter * CO2.dieselKgProLiter;
    scope1Nachher = liter * (1 - anteilE) * CO2.dieselKgProLiter;
    ladestrom = (km * anteilE * (flotte.kwhJe100 || CO2.eFahrzeugKwhJe100)) / 100;
    // Laden mit eigenem Solarstrom nur aus dem Überschuss, der sonst eingespeist würde
    ladestromPv = Math.min(ladestrom * Math.min(Math.max(flotte.pvLadeanteil ?? 0, 0), 1), pvUeberschuss);
    pvUeberschuss -= ladestromPv;
  }

  // --- Scope 2 ---
  const netzVorher = verbrauch;
  const netzNachher = Math.max(verbrauch - pvEigen, 0) + (ladestrom - ladestromPv);
  const lokVorher = netzVorher * lok;
  const lokNachher = netzNachher * lok;
  const marktVorher = netzVorher * markt;
  const marktNachher = netzNachher * (1 - oeko) * markt;

  const proz = (v, n) => (v > 0 ? (v - n) / v : 0);
  const gesamtVorher = marktVorher + scope1Vorher;
  const gesamtNachher = marktNachher + scope1Nachher;
  const reduktionKg = Math.max(gesamtVorher - gesamtNachher, 0);

  return {
    verbrauch,
    faktoren: { lokG: lok * 1000, marktG: markt * 1000, oekoAnteil: oeko },
    pv: { ertrag: pvErtrag, eigenverbrauch: pvEigen, einspeisung: pvUeberschuss },
    netz: { vorher: netzVorher, nachher: netzNachher },
    flotte: { ladestrom, ladestromPv, scope1Vorher, scope1Nachher },
    scope2: {
      location: { vorher: lokVorher, nachher: lokNachher, reduktion: proz(lokVorher, lokNachher) },
      market: { vorher: marktVorher, nachher: marktNachher, reduktion: proz(marktVorher, marktNachher) },
    },
    scope1: { vorher: scope1Vorher, nachher: scope1Nachher, reduktion: proz(scope1Vorher, scope1Nachher) },
    gesamt: { vorher: gesamtVorher, nachher: gesamtNachher, reduktion: proz(gesamtVorher, gesamtNachher), reduktionKg },
    // Zusatzinformation, nicht Scope 2: vermiedene Emissionen durch eingespeisten PV-Strom
    vermiedenEinspeisungKg: (pvUeberschuss * CO2.substitutionG) / 1000,
    aequivalent: { pkwKm: reduktionKg / CO2.pkwKgProKm },
  };
}

const t = (kg) => (kg / 1000).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const p = (x) => `${Math.round(x * 100).toLocaleString("de-DE")} %`;
const z = (n) => Math.round(n).toLocaleString("de-DE");
const delta = (x) => (x >= 0 ? `−${p(x)}` : `+${p(-x)}`);

/**
 * Textbaustein für den Nachhaltigkeitsbericht (VSME/ESRS E1-orientiert, sachlich).
 * @param {object} r      Ergebnis von rechneCo2()
 * @param {object} [o]    { jahr, firma }
 */
export function textbaustein(r, { jahr = "2026", firma = "Unser Unternehmen" } = {}) {
  const teile = [];
  teile.push(
    `${firma} bezog im Berichtsjahr ${jahr} rund ${z(r.verbrauch)} kWh Strom. Die indirekten energiebezogenen Emissionen (Scope 2) betragen standortbasiert ${t(r.scope2.location.vorher)} t CO₂e (Emissionsfaktor ${r.faktoren.lokG.toLocaleString("de-DE")} g CO₂e/kWh) und marktbasiert ${t(r.scope2.market.vorher)} t CO₂e (${r.faktoren.marktG.toLocaleString("de-DE")} g CO₂/kWh laut Stromkennzeichnung des Lieferanten).`
  );
  const massnahmen = [];
  if (r.pv.eigenverbrauch > 0) massnahmen.push(`eine eigene Photovoltaikanlage (rund ${z(r.pv.ertrag)} kWh Jahresertrag, davon ${z(r.pv.eigenverbrauch)} kWh im Betrieb selbst genutzt)`);
  if (r.faktoren.oekoAnteil > 0) massnahmen.push(`den Bezug von ${p(r.faktoren.oekoAnteil)} des verbleibenden Netzstroms mit Herkunftsnachweisen aus erneuerbaren Quellen`);
  if (r.flotte.scope1Vorher > 0 && r.flotte.scope1Nachher < r.flotte.scope1Vorher) massnahmen.push(`die teilweise Elektrifizierung der Fahrzeugflotte`);
  if (massnahmen.length) {
    const liste = massnahmen.length === 1 ? massnahmen[0] : `${massnahmen.slice(0, -1).join(", ")} sowie ${massnahmen[massnahmen.length - 1]}`;
    const sinken = r.scope2.location.reduktion >= 0 && r.scope2.market.reduktion >= 0;
    teile.push(
      `Durch ${liste} ${sinken ? "sinken" : "verändern sich"} die Scope-2-Emissionen rechnerisch auf ${t(r.scope2.location.nachher)} t CO₂e standortbasiert (${delta(r.scope2.location.reduktion)}) bzw. ${t(r.scope2.market.nachher)} t CO₂e marktbasiert (${delta(r.scope2.market.reduktion)}).`
    );
  }
  if (r.flotte.scope1Vorher > 0) {
    teile.push(`Die direkten Emissionen der Fahrzeugflotte (Scope 1) sinken von ${t(r.flotte.scope1Vorher)} auf ${t(r.flotte.scope1Nachher)} t CO₂e.`);
  }
  if (r.pv.einspeisung > 0) {
    teile.push(`In das öffentliche Netz eingespeister Solarstrom (${z(r.pv.einspeisung)} kWh) wird nicht auf die eigenen Scope-2-Emissionen angerechnet.`);
  }
  teile.push("Berechnung nach GHG Protocol Scope 2 Guidance (standort- und marktbasierte Methode); Planwerte, die nach Inbetriebnahme mit Messdaten zu bestätigen sind.");
  return teile.join(" ");
}
