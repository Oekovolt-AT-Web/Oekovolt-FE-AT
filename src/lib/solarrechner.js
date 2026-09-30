// src/lib/solarrechner.js
//
// Reine Rechenfunktion des Solarrechners - bewusst ohne React und ohne
// Pfad-Aliase, damit sie unabhaengig von der Oberflaeche per Node geprueft
// werden kann.
//
// Genutzt von: Solarrechner (/solarrechner, Ratgeber), Rechner-Hub, PDF-Analyse
// und dem Angebots-Konfigurator. Rueckgabefelder daher nur ERGAENZEN, nie umbenennen.
//
// Oesterreich (Stand 09/2026):
// - Zielgruppe "privat": Autarkie ueber Saettigungskurven (siehe
//   src/data/solarrechner.js), Preise brutto inkl. 20 % USt.
// - Zielgruppen "gewerbe" und "landwirtschaft": stuendliche Jahressimulation
//   mit Betriebs-Lastprofil (Betriebstage, Schichten) aus lib/rechner/profile.js,
//   alle Preise NETTO (Vorsteuerabzug), ersetzter Strompreis = vermeidbarer
//   Arbeitspreis netto nach Verbrauchsklasse, IFB als Hinweis (nicht im Cashflow).
// - Einspeisung: Rechensatz aus src/data/einspeiseverguetung.js (OeMAG-Marktpreis /
//   Einspeisetarife) - in AT NICHT gesetzlich garantiert. Der Rechner haelt ihn
//   ueber den Betrachtungszeitraum konstant (vorsichtig, siehe Kommentar dort).

import {
  ANNAHMEN,
  AUSRICHTUNGEN,
  NEIGUNGEN,
  ZIELGRUPPEN,
  preisProKwp,
  speicherPreisProKwh,
  strompreisGewerbe,
  betriebskostenProKwp,
  eagZuschuss,
} from "../data/solarrechner.js";
import { VERGUETUNG } from "../data/einspeiseverguetung.js";
import { jahresreihen, simuliere } from "./rechner/profile.js";

/**
 * Mittlerer Einspeise-Rechensatz in ct/kWh fuer eine Anlagengroesse (anteilig
 * ueber die Groessenklassen in VERGUETUNG.saetze). Name und Signatur aus der
 * deutschen Fassung beibehalten; `art` ist in AT praktisch ohne Wirkung, weil
 * Voll- und Ueberschusseinspeisung gleich verguetet werden.
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

/** Gueltige Zielgruppe (Fallback privat) */
export const zielgruppeVon = (z) => (ZIELGRUPPEN.some((g) => g.id === z) ? z : "privat");

/**
 * @param {object} e Eingaben
 * @param {number} e.kwp          Anlagengroesse in kWp
 * @param {string} e.ausrichtung  id aus AUSRICHTUNGEN
 * @param {string} e.neigung      id aus NEIGUNGEN
 * @param {number} e.verbrauch    Jahresstromverbrauch in kWh
 * @param {number} e.speicherKwh  Speichergroesse in kWh (0 = kein Speicher)
 * @param {number} [e.preissteigerung] jaehrliche Strompreissteigerung (0.02 = 2 %)
 * @param {"privat"|"gewerbe"|"landwirtschaft"} [e.zielgruppe]
 * @param {5|6|7} [e.betriebstage] nur Gewerbe: Betriebstage je Woche
 * @param {1|2|3} [e.schichten]    nur Gewerbe: Schichtmodell
 * @param {boolean} [e.foerderung] EAG-Investitionszuschuss (Höchstsätze 2026) abziehen
 */
export function berechne({
  kwp,
  ausrichtung,
  neigung,
  verbrauch,
  speicherKwh,
  preissteigerung,
  zielgruppe = "privat",
  betriebstage = 5,
  schichten = 1,
  foerderung = false,
}) {
  const A = ANNAHMEN;
  const gruppe = zielgruppeVon(zielgruppe);
  const betrieb = gruppe !== "privat";
  const fA = AUSRICHTUNGEN.find((a) => a.id === ausrichtung)?.faktor ?? 1;
  const fN = NEIGUNGEN.find((n) => n.id === neigung)?.faktor ?? 1;
  const steigerung = Number.isFinite(preissteigerung) ? preissteigerung : A.strompreisSteigerung;
  const speicher = Math.max(Number(speicherKwh) || 0, 0);

  // --- Ertrag ---
  const spezifischerErtrag = A.ertragProKwpSued * fA * fN;
  const jahresertrag = kwp * spezifischerErtrag;
  const hatSpeicher = speicher > 0;

  // --- Eigenverbrauch ---
  let eigenverbrauch;
  let eingespeist;
  let speicherverlust = 0;
  if (betrieb) {
    // Stuendliche Simulation mit Betriebs-Lastprofil
    const reihen = jahresreihen({
      kwp,
      ertragProKwp: spezifischerErtrag,
      betrieb: { kwh: Math.max(verbrauch, 1), typ: gruppe, betriebstage, schichten },
    });
    const sim = simuliere(reihen, speicher, hatSpeicher ? { leistungKw: Math.max(speicher * A.gewerbeSpeicherCRate, 5) } : {});
    eigenverbrauch = Math.min(sim.autark, verbrauch); // aus eigener Anlage gedeckte Last
    eingespeist = Math.max(sim.einspeisung, 0);
    // Speicherverluste direkt aus der Simulation: in den Speicher geladene minus
    // entladene Energie (Wirkungsgrad, Standby, Rest-Ladestand am Jahresende).
    // Früher als Differenz Jahresertrag − Eigenverbrauch − Einspeisung gerechnet –
    // das wies auch OHNE Speicher einen „Verlust“ aus (Befund tests-01: PV_MONAT
    // summierte sich auf 0,995; danach blieb Gleitkomma-Rest ~1e-10 kWh).
    speicherverlust = hatSpeicher ? Math.max(sim.laden - sim.entladen, 0) : 0;
  } else {
    // Haushalt: Autarkie in Abhaengigkeit von Erzeugung/Verbrauch und
    // Speicher/Verbrauch (Saettigungskurven, siehe src/data/solarrechner.js).
    const mwh = Math.max(verbrauch, 1) / 1000;
    const verhaeltnis = jahresertrag / Math.max(verbrauch, 1);
    const a0 = A.autarkieOhneSpeicherMax * saettigung(verhaeltnis, A.autarkieOhneSpeicherK);
    let autarkieZiel = a0;
    if (hatSpeicher) {
      const amax = A.autarkieMitSpeicherMax * saettigung(verhaeltnis, A.autarkieMitSpeicherK);
      autarkieZiel = a0 + Math.max(amax - a0, 0) * saettigung(speicher / mwh, A.speicherK);
    }
    autarkieZiel = Math.min(autarkieZiel, A.autarkieMax);
    // Man kann nie mehr selbst nutzen als man erzeugt (mit Speicher abzgl. Verlusten).
    eigenverbrauch = Math.min(verbrauch * autarkieZiel, jahresertrag * (hatSpeicher ? A.eigenverbrauchMaxAnteil : 1));
    eingespeist = Math.max(jahresertrag - eigenverbrauch, 0);
  }
  const eigenverbrauchsquote = jahresertrag > 0 ? eigenverbrauch / jahresertrag : 0;
  // Autarkie: welcher Anteil des Verbrauchs aus der eigenen Anlage kommt
  const autarkie = verbrauch > 0 ? Math.min(eigenverbrauch / verbrauch, 1) : 0;
  const netzbezug = Math.max(verbrauch - eigenverbrauch, 0);

  // --- Geld (Jahr 1) ---
  const satzCt = mischSatz(kwp, "teileinspeisung");
  const satz = satzCt / 100; // ct -> EUR
  const strompreis = betrieb ? strompreisGewerbe(verbrauch) : A.strompreis; // EUR/kWh
  const einspeiseErloes = eingespeist * satz;
  const ersparnis = eigenverbrauch * strompreis;
  const betriebskosten = kwp * betriebskostenProKwp(kwp, gruppe);
  const nutzenProJahr = einspeiseErloes + ersparnis - betriebskosten;

  // --- Investition (privat brutto, Betriebe netto) ---
  const anlagenpreis = kwp * preisProKwp(kwp, gruppe);
  const speicherpreis = speicher * speicherPreisProKwh(speicher, gruppe);
  // Optional: EAG-Investitionszuschuss (nur bei Zuschlag im Fördercall)
  const zuschuss = foerderung ? eagZuschuss(kwp, speicher) : { kategorie: null, pv: 0, speicher: 0, summe: 0 };
  const investition = Math.max(anlagenpreis + speicherpreis - zuschuss.summe, 0);

  // --- Cashflow ueber den Betrachtungszeitraum ---
  // Jahr fuer Jahr: Moduldegradation senkt Ertrag, Eigenverbrauch und
  // Einspeisung anteilig; der ersetzte Strompreis steigt um `steigerung`, der
  // Einspeise-Rechensatz bleibt nominal konstant (in AT marktabhaengig und
  // nicht garantiert), Betriebskosten steigen mit der Inflation.
  const jahre = VERGUETUNG.betrachtungJahre ?? VERGUETUNG.garantieJahre;
  const cashflow = [{ jahr: 0, netto: -investition, kumuliert: -investition }];
  let kumuliert = -investition;
  let amortisationJahre = null;
  let summeNutzen = 0;
  for (let t = 1; t <= jahre; t++) {
    const d = Math.pow(1 - A.degradationProJahr, t - 1);
    const ersparnisT = eigenverbrauch * d * strompreis * Math.pow(1 + steigerung, t - 1);
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

  // CO2: vermiedene Emissionen je kWh PV-Strom (AT, siehe src/data/solarrechner.js)
  const co2ProJahr = jahresertrag * A.co2KgProKwh; // kg

  // Investitionsfreibetrag (nur Betriebe) - als Hinweis, NICHT im Cashflow,
  // weil der Steuereffekt von Rechtsform, Gewinn und Steuersatz abhaengt.
  // Bemessungsgrundlage: Anschaffungskosten abzüglich steuerfreier Zuschüsse
  const ifbBasis = Math.min(investition, A.ifb.bemessungsgrundlageMax);
  const ifb = betrieb
    ? {
        satz: A.ifb.satzOeko,
        betrag: ifbBasis * A.ifb.satzOeko,
        steuereffekt: ifbBasis * A.ifb.satzOeko * A.ifb.koest,
        koest: A.ifb.koest,
        hinweis: A.ifb.hinweis,
      }
    : null;

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
    benoetigteFlaeche: kwp * (betrieb && neigung === "flach" ? A.qmProKwpFlachdach : A.qmProKwp),
    // --- ergaenzt 09/2026 (AT) ---
    zielgruppe: gruppe,
    netto: betrieb,
    strompreisCt: strompreis * 100,
    speicherverlust,
    jahre,
    ifb,
    foerderung: zuschuss,
  };
}

/** Speicher-Empfehlung: grober Richtwert 1 kWh je 1.000 kWh Jahresverbrauch (Haushalt). */
export function empfohlenerSpeicher(verbrauch) {
  return Math.max(5, Math.round(verbrauch / 1000));
}
