// src/lib/solarrechner.js
//
// Reine Rechenfunktion des Solarrechners - bewusst ohne React, damit sie
// unabhaengig von der Oberflaeche geprueft werden kann.

import {
  ANNAHMEN,
  AUSRICHTUNGEN,
  NEIGUNGEN,
  preisProKwp,
} from "@/data/solarrechner";
import { VERGUETUNG, satzFuer } from "@/data/einspeiseverguetung";

/**
 * @param {object} e Eingaben
 * @param {number} e.kwp          Anlagengroesse in kWp
 * @param {string} e.ausrichtung  id aus AUSRICHTUNGEN
 * @param {string} e.neigung      id aus NEIGUNGEN
 * @param {number} e.verbrauch    Jahresstromverbrauch in kWh
 * @param {number} e.speicherKwh  Speichergroesse in kWh (0 = kein Speicher)
 */
export function berechne({ kwp, ausrichtung, neigung, verbrauch, speicherKwh }) {
  const fA = AUSRICHTUNGEN.find((a) => a.id === ausrichtung)?.faktor ?? 1;
  const fN = NEIGUNGEN.find((n) => n.id === neigung)?.faktor ?? 1;

  // --- Ertrag ---
  const spezifischerErtrag = ANNAHMEN.ertragProKwpSued * fA * fN;
  const jahresertrag = kwp * spezifischerErtrag;

  // --- Eigenverbrauch ---
  // Ausgangspunkt ist die Autarkie, nicht der Erzeugungsanteil: bei einer
  // ueberdimensionierten Anlage wuerde sonst rechnerisch der gesamte Verbrauch
  // gedeckt (100 % Autarkie), was es real nicht gibt.
  const hatSpeicher = speicherKwh > 0;
  const autarkieZiel = hatSpeicher
    ? Math.min(
        ANNAHMEN.autarkieMax,
        ANNAHMEN.autarkieMitSpeicherBasis +
          ANNAHMEN.autarkieProKwhSpeicher * speicherKwh
      )
    : ANNAHMEN.autarkieOhneSpeicher;

  // Man kann nie mehr selbst nutzen als man erzeugt.
  const eigenverbrauch = Math.min(verbrauch * autarkieZiel, jahresertrag);
  const eingespeist = Math.max(jahresertrag - eigenverbrauch, 0);
  const eigenverbrauchsquote = jahresertrag > 0 ? eigenverbrauch / jahresertrag : 0;
  // Autarkie: welcher Anteil des Verbrauchs aus der eigenen Anlage kommt
  const autarkie = verbrauch > 0 ? Math.min(eigenverbrauch / verbrauch, 1) : 0;

  // --- Geld ---
  const satz = satzFuer(kwp, "teileinspeisung") / 100; // ct -> EUR
  const einspeiseErloes = eingespeist * satz;
  const ersparnis = eigenverbrauch * ANNAHMEN.strompreis;
  const betriebskosten = kwp * ANNAHMEN.betriebskostenProKwp;
  const nutzenProJahr = einspeiseErloes + ersparnis - betriebskosten;

  // --- Investition ---
  const anlagenpreis = kwp * preisProKwp(kwp);
  const speicherpreis = speicherKwh * ANNAHMEN.speicherPreisProKwh;
  const investition = anlagenpreis + speicherpreis;

  const amortisationJahre = nutzenProJahr > 0 ? investition / nutzenProJahr : null;
  const ertrag20Jahre = nutzenProJahr * VERGUETUNG.garantieJahre - investition;

  // CO2: deutscher Strommix rund 380 g/kWh
  const co2ProJahr = (jahresertrag * 380) / 1000; // kg

  return {
    spezifischerErtrag,
    jahresertrag,
    eigenverbrauch,
    eingespeist,
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
    co2ProJahr,
    satzCt: satzFuer(kwp, "teileinspeisung"),
    benoetigteFlaeche: kwp * ANNAHMEN.qmProKwp,
  };
}

/** Speicher-Empfehlung: grober Richtwert 1 kWh je 1.000 kWh Jahresverbrauch. */
export function empfohlenerSpeicher(verbrauch) {
  return Math.max(5, Math.round(verbrauch / 1000));
}
