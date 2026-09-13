// src/lib/solarrechner.js
//
// Reine Rechenfunktion des Solarrechners - bewusst ohne React, damit sie
// unabhaengig von der Oberflaeche geprueft werden kann.
//
// Genutzt von: Solarrechner (/solarrechner, Ratgeber) und dem
// Angebots-Konfigurator. Rueckgabefelder daher nur ERGAENZEN, nie umbenennen.

import {
  ANNAHMEN,
  AUSRICHTUNGEN,
  NEIGUNGEN,
  preisProKwp,
} from "@/data/solarrechner";
import { VERGUETUNG } from "@/data/einspeiseverguetung";

/**
 * Anteiliger Verguetungssatz nach EEG (ct/kWh): Die ersten 10 kWp werden mit
 * dem Satz bis 10 kWp verguetet, der Rest mit dem Satz der naechsten Stufe.
 * Frueher wurde fuer die ganze Anlage der Satz der hoechsten Stufe genommen -
 * das hat Anlagen knapp ueber 10 kWp zu schlecht gerechnet.
 */
export function mischSatz(kwp, art = "teileinspeisung") {
  if (!(kwp > 0)) return VERGUETUNG.saetze[0][art];
  let summe = 0;
  for (const s of VERGUETUNG.saetze) {
    const anteil = Math.max(0, Math.min(kwp, s.bis) - s.von);
    summe += anteil * s[art];
  }
  const letzte = VERGUETUNG.saetze[VERGUETUNG.saetze.length - 1];
  if (kwp > letzte.bis) summe += (kwp - letzte.bis) * letzte[art];
  return Math.round((summe / kwp) * 100) / 100;
}

/** Saettigungskurve 1 - e^(-k x) */
const saettigung = (x, k) => 1 - Math.exp(-k * Math.max(x, 0));

/**
 * @param {object} e Eingaben
 * @param {number} e.kwp          Anlagengroesse in kWp
 * @param {string} e.ausrichtung  id aus AUSRICHTUNGEN
 * @param {string} e.neigung      id aus NEIGUNGEN
 * @param {number} e.verbrauch    Jahresstromverbrauch in kWh
 * @param {number} e.speicherKwh  Speichergroesse in kWh (0 = kein Speicher)
 * @param {number} [e.preissteigerung] jaehrliche Strompreissteigerung (0.02 = 2 %)
 */
export function berechne({ kwp, ausrichtung, neigung, verbrauch, speicherKwh, preissteigerung }) {
  const A = ANNAHMEN;
  const fA = AUSRICHTUNGEN.find((a) => a.id === ausrichtung)?.faktor ?? 1;
  const fN = NEIGUNGEN.find((n) => n.id === neigung)?.faktor ?? 1;
  const steigerung = Number.isFinite(preissteigerung) ? preissteigerung : A.strompreisSteigerung;

  // --- Ertrag ---
  const spezifischerErtrag = A.ertragProKwpSued * fA * fN;
  const jahresertrag = kwp * spezifischerErtrag;

  // --- Eigenverbrauch ---
  // Gerechnet wird ueber die Autarkie in Abhaengigkeit vom Verhaeltnis
  // Erzeugung/Verbrauch und Speicher/Verbrauch (siehe @/data/solarrechner).
  // So bringt eine kleine Anlage mit grossem Speicher realistisch wenig,
  // und 100 % Autarkie sind ausgeschlossen.
  const mwh = Math.max(verbrauch, 1) / 1000;
  const verhaeltnis = jahresertrag / Math.max(verbrauch, 1);
  const hatSpeicher = speicherKwh > 0;
  const a0 = A.autarkieOhneSpeicherMax * saettigung(verhaeltnis, A.autarkieOhneSpeicherK);
  let autarkieZiel = a0;
  if (hatSpeicher) {
    const amax = A.autarkieMitSpeicherMax * saettigung(verhaeltnis, A.autarkieMitSpeicherK);
    autarkieZiel = a0 + Math.max(amax - a0, 0) * saettigung(speicherKwh / mwh, A.speicherK);
  }
  autarkieZiel = Math.min(autarkieZiel, A.autarkieMax);

  // Man kann nie mehr selbst nutzen als man erzeugt (mit Speicher abzgl. Verlusten).
  const eigenverbrauch = Math.min(
    verbrauch * autarkieZiel,
    jahresertrag * (hatSpeicher ? A.eigenverbrauchMaxAnteil : 1)
  );
  const eingespeist = Math.max(jahresertrag - eigenverbrauch, 0);
  const eigenverbrauchsquote = jahresertrag > 0 ? eigenverbrauch / jahresertrag : 0;
  // Autarkie: welcher Anteil des Verbrauchs aus der eigenen Anlage kommt
  const autarkie = verbrauch > 0 ? Math.min(eigenverbrauch / verbrauch, 1) : 0;
  const netzbezug = Math.max(verbrauch - eigenverbrauch, 0);

  // --- Geld (Jahr 1) ---
  const satzCt = mischSatz(kwp, "teileinspeisung");
  const satz = satzCt / 100; // ct -> EUR
  const einspeiseErloes = eingespeist * satz;
  const ersparnis = eigenverbrauch * A.strompreis;
  const betriebskosten = kwp * A.betriebskostenProKwp;
  const nutzenProJahr = einspeiseErloes + ersparnis - betriebskosten;

  // --- Investition ---
  const anlagenpreis = kwp * preisProKwp(kwp);
  const speicherpreis = speicherKwh * A.speicherPreisProKwh;
  const investition = anlagenpreis + speicherpreis;

  // --- Cashflow ueber die EEG-Laufzeit ---
  // Jahr fuer Jahr: Moduldegradation senkt Ertrag, Eigenverbrauch und
  // Einspeisung anteilig; der ersetzte Strompreis steigt um `steigerung`,
  // die Einspeiseverguetung bleibt nominal fest, Betriebskosten steigen mit
  // der Inflation.
  const jahre = VERGUETUNG.garantieJahre;
  const cashflow = [{ jahr: 0, netto: -investition, kumuliert: -investition }];
  let kumuliert = -investition;
  let amortisationJahre = null;
  let summeNutzen = 0;
  for (let t = 1; t <= jahre; t++) {
    const d = Math.pow(1 - A.degradationProJahr, t - 1);
    const ersparnisT = eigenverbrauch * d * A.strompreis * Math.pow(1 + steigerung, t - 1);
    const einspeisungT = eingespeist * d * satz;
    const betriebT = betriebskosten * Math.pow(1 + A.betriebskostenSteigerung, t - 1);
    const netto = ersparnisT + einspeisungT - betriebT;
    const vorher = kumuliert;
    kumuliert += netto;
    summeNutzen += netto;
    if (amortisationJahre === null && vorher < 0 && kumuliert >= 0 && netto > 0) {
      amortisationJahre = t - 1 + -vorher / netto;
    }
    cashflow.push({ jahr: t, netto, ersparnis: ersparnisT, einspeisung: einspeisungT, betrieb: betriebT, kumuliert });
  }
  if (investition <= 0) amortisationJahre = 0;

  const ertrag20Jahre = kumuliert;
  // Durchschnittliche Rendite (einfach, nicht IRR): Ueberschuss je Jahr / Investition
  const renditeProJahr = investition > 0 ? ertrag20Jahre / jahre / investition : 0;

  // CO2: deutscher Strommix rund 380 g/kWh
  const co2ProJahr = (jahresertrag * 380) / 1000; // kg

  return {
    spezifischerErtrag,
    jahresertrag,
    eigenverbrauch,
    eingespeist,
    netzbezug,
    eigenverbrauchsquote,
    autarkie,
    einspeiseErloes,
    ersparnis,
    betriebskosten,
    nutzenProJahr,
    anlagenpreis,
    speicherpreis,
    investition,
    amortisationJahre,
    ertrag20Jahre,
    summeNutzen,
    renditeProJahr,
    cashflow,
    preissteigerung: steigerung,
    co2ProJahr,
    satzCt,
    benoetigteFlaeche: kwp * A.qmProKwp,
  };
}

/** Speicher-Empfehlung: grober Richtwert 1 kWh je 1.000 kWh Jahresverbrauch. */
export function empfohlenerSpeicher(verbrauch) {
  return Math.max(5, Math.round(verbrauch / 1000));
}
