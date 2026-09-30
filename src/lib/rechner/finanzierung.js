// src/lib/rechner/finanzierung.js
//
// Finanzierungsvergleich (/rechner/finanzierung): dieselbe Gewerbe-PV-Anlage auf
// dem eigenen Dach, fünf am Markt übliche Modelle über 20 Jahre –
//   1. Kauf mit Eigenkapital   2. Kauf mit Kredit   3. Leasing
//   4. Contracting (Anlage gehört dem Contractor, Sie zahlen je genutzter kWh)
//   5. Dach-PPA (On-site-Stromliefervertrag zum Festpreis)
//
// Neutral: Die Modelle beschreiben, was am Markt angeboten wird – KEINE Aussage,
// wer sie anbietet, und KEINE Konditionen eines Anbieters. Zins, Leasingfaktor,
// Contracting- und PPA-Preis sind Beispielwerte, die der Nutzer ändert.
//
// Reine Rechenfunktionen ohne React und ohne Pfad-Aliase (per Node prüfbar:
// node scripts/finanzierung.test.mjs). Wiederverwendet werden die Annahmen des
// Solarrechners (src/data/solarrechner.js: Netto-Anlagenpreis, Betriebskosten,
// Degradation, Strompreis Gewerbe, EAG-Höchstsätze, IFB) und die Helfer des
// Gewerbe-PV-Rechners (Annuität, IRR, Einspeise-Rechensatz).
// Betrachtung vor Ertragsteuern (nur der IFB-Steuereffekt wird – wie im
// Gewerbe-PV-Rechner – im Jahr 1 separat gezeigt). Alle Beträge NETTO.
// Stand: September 2026.

import { ANNAHMEN, preisProKwp, betriebskostenProKwp, strompreisGewerbe, eagZuschuss } from "../../data/solarrechner.js";
import { annuitaet, einspeiseSatzCt, irr } from "./gewerbepv.js";

export { annuitaet };

export const JAHRE = 20;

/** Monatlicher Annuitätenfaktor in % des Anschaffungswerts (z. B. 5 %, 10 J. → 1,06). */
export function monatsfaktor(zinsJahr, jahre, restwertAnteil = 0) {
  const n = Math.round(jahre * 12);
  if (!(n > 0)) return 0;
  const r = Math.pow(1 + zinsJahr, 1 / 12) - 1;
  const bw = 1 - restwertAnteil / Math.pow(1 + r, n); // Barwert des zu tilgenden Anteils
  if (!(r > 0)) return ((1 - restwertAnteil) / n) * 100;
  return ((bw * r) / (1 - Math.pow(1 + r, -n))) * 100;
}

/**
 * Rechnerisch im Leasingfaktor enthaltener effektiver Jahreszins (inkl. Marge
 * und Nebenkosten des Leasinggebers). null, wenn nicht bestimmbar.
 */
export function leasingEffektivzins(faktorProzent, jahre, restwertAnteil = 0) {
  const n = Math.round(jahre * 12);
  if (!(n > 0) || !(faktorProzent > 0)) return null;
  const z = [1];
  for (let m = 1; m <= n; m++) z.push(-faktorProzent / 100 - (m === n ? restwertAnteil : 0));
  const r = irr(z);
  return r == null ? null : Math.pow(1 + r, 12) - 1;
}

const rund = (v, s = 0.5) => Math.round(v / s) * s;

/** Standardwerte (Richtwerte bzw. Beispielwerte – im Rechner offen und änderbar). */
export const FINANZIERUNG = {
  jahre: JAHRE,
  kwp: 250,
  // Spezifischer Ertrag: Marktstatistik 2024 rechnet mit 1.000 Volllaststunden,
  // IEA PVPS NSR Austria 2024 mit 1.050 kWh/kWp im Mittel aller Anlagen.
  ertragProKwp: 1000,
  eigenverbrauchsquote: 0.7, // Ihre Annahme – genauer im Gewerbe-PV-Rechner (stündliche Simulation)
  // Vermeidbarer Arbeitspreis netto: Eurostat-basierter Richtwert (src/data/solarrechner.js)
  // für einen Betrieb mit rund 500 MWh Jahresverbrauch, auf 0,5 ct gerundet.
  strompreisCt: rund(strompreisGewerbe(500000) * 100),
  strompreisSteigerung: ANNAHMEN.strompreisSteigerung,
  degradation: ANNAHMEN.degradationProJahr,
  betriebskostenSteigerung: ANNAHMEN.betriebskostenSteigerung,
  kalkulationszins: 0.05, // Beispiel für Ihre Kapitalkosten (Diskontsatz des Barwerts)
  // Kredit: wie der Finanzierungsrechner unter /service/finanzierung (5 %, Beispiel)
  kredit: { eigenkapitalAnteil: 0.2, zins: 0.05, jahre: 10 },
  // Leasing: Beispiel-Leasingfaktor je Monat in % des Anschaffungswerts.
  // 1,10 % bei 10 Jahren ohne Restwert entspricht rechnerisch rund 6 % p. a.
  // (siehe leasingEffektivzins) – keine Kondition eines Leasinggebers.
  leasing: { faktor: 1.1, jahre: 10, restwert: 0 },
  // Contracting: Beispielpreis je genutzter kWh, jährliche Indexierung, Laufzeit,
  // danach Übernahme der Anlage zum Restwert (in % der ursprünglichen Investition).
  contracting: { preisCt: 14, index: 0.02, jahre: 15, uebernahme: 0.05 },
  // Dach-PPA: Festpreis je kWh, Indexierung, Abnahme der gesamten Erzeugung
  // (Take-or-pay) oder nur des Eigenverbrauchs; Laufzeit = Betrachtungszeitraum.
  ppa: { preisCt: 12, index: 0, abnahme: "gesamt" },
  eag: false, // EAG-Investitionszuschuss nur in Fördercalls, kein Rechtsanspruch
  ifb: true, // Investitionsfreibetrag (Anschaffung bis 31.12.2026: 22 %)
};

// Farben/Strichmuster der Kurven: Unterscheidung nicht nur über die Farbe (Barrierefreiheit)
export const MODELLE = [
  { id: "eigenkapital", name: "Kauf mit Eigenkapital", kurz: "Kauf EK", farbe: "#37521e", strich: "" },
  { id: "kredit", name: "Kauf mit Kredit", kurz: "Kredit", farbe: "#669933", strich: "7 5" },
  { id: "leasing", name: "Leasing", kurz: "Leasing", farbe: "#1f5aa1", strich: "" },
  { id: "contracting", name: "Contracting", kurz: "Contracting", farbe: "#b36b00", strich: "2 4" },
  { id: "ppa", name: "Dach-PPA", kurz: "PPA", farbe: "#7b52b8", strich: "10 4 2 4" },
];

const zahlOder = (v, std) => (Number.isFinite(Number(v)) ? Number(v) : std);

/**
 * Hauptberechnung.
 * @param {object} e  alle Felder optional, Standard siehe FINANZIERUNG
 * @returns {{ basis: object, modelle: Array<object>, jahre: number }}
 */
export function rechneFinanzierung(e = {}) {
  const S = FINANZIERUNG;
  const kwp = Math.max(zahlOder(e.kwp, S.kwp), 1);
  const spez = Math.max(zahlOder(e.ertragProKwp, S.ertragProKwp), 0);
  const evQuote = Math.min(Math.max(zahlOder(e.eigenverbrauchsquote, S.eigenverbrauchsquote), 0), 1);
  const preis = zahlOder(e.strompreisCt, S.strompreisCt) / 100;
  const steigerung = zahlOder(e.strompreisSteigerung, S.strompreisSteigerung);
  const deg = zahlOder(e.degradation, S.degradation);
  const einspeise = zahlOder(e.einspeiseCt, einspeiseSatzCt(kwp)) / 100;
  const kz = zahlOder(e.kalkulationszins, S.kalkulationszins);
  const jahre = JAHRE;

  const kr = { ...S.kredit, ...(e.kredit || {}) };
  const le = { ...S.leasing, ...(e.leasing || {}) };
  const co = { ...S.contracting, ...(e.contracting || {}) };
  const pp = { ...S.ppa, ...(e.ppa || {}) };
  const mitEag = e.eag ?? S.eag;
  const mitIfb = e.ifb ?? S.ifb;

  // --- Investition (netto) ---
  const anlagenpreis = zahlOder(e.investition, kwp * preisProKwp(kwp, "gewerbe"));
  const zuschuss = mitEag ? eagZuschuss(kwp, 0).summe : 0;
  const investition = Math.max(anlagenpreis - zuschuss, 0);
  const betrieb1 = zahlOder(e.betriebskosten, kwp * betriebskostenProKwp(kwp, "gewerbe"));

  // IFB: Bemessungsgrundlage = Anschaffungskosten abzgl. steuerfreier Zuschüsse, max. 1 Mio. €
  const ifbBetrag = Math.min(investition, ANNAHMEN.ifb.bemessungsgrundlageMax) * ANNAHMEN.ifb.satzOeko;
  const ifbEffekt = mitIfb ? ifbBetrag * ANNAHMEN.ifb.koest : 0;

  // --- Energie & Nutzen je Jahr (Eigentümersicht) ---
  const jahr = [];
  for (let t = 1; t <= jahre; t++) {
    const erzeugung = kwp * spez * Math.pow(1 - deg, t - 1);
    const ev = erzeugung * evQuote;
    const ueb = erzeugung - ev;
    const preisT = preis * Math.pow(1 + steigerung, t - 1);
    const ersparnis = ev * preisT;
    const erloes = ueb * einspeise;
    const betrieb = betrieb1 * Math.pow(1 + S.betriebskostenSteigerung, t - 1);
    jahr.push({ t, erzeugung, ev, ueb, preisT, ersparnis, erloes, betrieb, eigentum: ersparnis + erloes - betrieb });
  }

  // Stromgestehungskosten (LCOE) bei Kauf – Referenz für Contracting- und PPA-Preise
  let bwKosten = investition;
  let bwMenge = 0;
  for (const j of jahr) {
    const d = Math.pow(1 + kz, j.t);
    bwKosten += j.betrieb / d;
    bwMenge += j.erzeugung / d;
  }
  const lcoeCt = bwMenge > 0 ? (bwKosten / bwMenge) * 100 : null;

  // --- Modelle ---
  const zeilen = {};

  // 1. Kauf mit Eigenkapital
  zeilen.eigenkapital = {
    start: -investition,
    jahre: jahr.map((j) => ({ nutzen: j.eigentum, zahlung: 0, ifb: j.t === 1 ? ifbEffekt : 0 })),
  };

  // 2. Kauf mit Kredit (jährliche Annuität, Rest als Eigenkapital zu Beginn)
  const ekAnteil = Math.min(Math.max(kr.eigenkapitalAnteil, 0), 1);
  const kreditbetrag = investition * (1 - ekAnteil);
  const kreditJahre = Math.max(Math.round(kr.jahre), 1);
  const kreditRate = annuitaet(kreditbetrag, kr.zins, kreditJahre);
  zeilen.kredit = {
    start: -investition * ekAnteil,
    jahre: jahr.map((j) => ({ nutzen: j.eigentum, zahlung: j.t <= kreditJahre ? kreditRate : 0, ifb: j.t === 1 ? ifbEffekt : 0 })),
  };

  // 3. Leasing (Rate = Leasingfaktor × Anschaffungswert je Monat; Betrieb trägt der
  //    Leasingnehmer; am Laufzeitende Übernahme zum Restwert, danach eigene Anlage; IFB beim Leasinggeber)
  const leasingJahre = Math.max(Math.round(le.jahre), 1);
  const leasingRate = investition * (le.faktor / 100) * 12;
  const leasingRestwert = investition * Math.max(le.restwert, 0);
  zeilen.leasing = {
    start: 0,
    jahre: jahr.map((j) => ({
      nutzen: j.eigentum,
      zahlung: (j.t <= leasingJahre ? leasingRate : 0) + (j.t === leasingJahre ? leasingRestwert : 0),
      ifb: 0,
    })),
  };

  // 4. Contracting (Contractor investiert, betreibt und speist den Überschuss auf
  //    eigene Rechnung ein; Sie zahlen je genutzter kWh; danach Übernahme)
  const coJahre = Math.min(Math.max(Math.round(co.jahre), 1), jahre);
  const coUebernahme = coJahre < jahre ? anlagenpreis * Math.max(co.uebernahme, 0) : 0;
  zeilen.contracting = {
    start: 0,
    jahre: jahr.map((j) => {
      if (j.t <= coJahre) {
        const preisC = (co.preisCt / 100) * Math.pow(1 + co.index, j.t - 1);
        return { nutzen: j.ersparnis, zahlung: j.ev * preisC + (j.t === coJahre ? coUebernahme : 0), ifb: 0 };
      }
      return { nutzen: j.eigentum, zahlung: 0, ifb: 0 };
    }),
  };

  // 5. Dach-PPA (Festpreis, Laufzeit = Betrachtungszeitraum, keine Übernahme)
  const takeOrPay = pp.abnahme !== "eigenverbrauch";
  zeilen.ppa = {
    start: 0,
    jahre: jahr.map((j) => {
      const preisP = (pp.preisCt / 100) * Math.pow(1 + pp.index, j.t - 1);
      return takeOrPay
        ? { nutzen: j.ersparnis + j.erloes, zahlung: j.erzeugung * preisP, ifb: 0 }
        : { nutzen: j.ersparnis, zahlung: j.ev * preisP, ifb: 0 };
    }),
  };

  const modelle = MODELLE.map((m) => {
    const z = zeilen[m.id];
    const reihe = [{ jahr: 0, netto: z.start, kumuliert: z.start, nutzen: 0, zahlung: 0, ifb: 0 }];
    let kum = z.start;
    let barwert = z.start;
    let minimum = Math.min(z.start, 0);
    let summeZahlungen = -Math.min(z.start, 0);
    z.jahre.forEach((y, i) => {
      const t = i + 1;
      const netto = y.nutzen - y.zahlung + y.ifb;
      kum += netto;
      barwert += netto / Math.pow(1 + kz, t);
      minimum = Math.min(minimum, kum);
      summeZahlungen += y.zahlung;
      reihe.push({ jahr: t, netto, kumuliert: kum, nutzen: y.nutzen, zahlung: y.zahlung, ifb: y.ifb });
    });
    return {
      ...m,
      reihe,
      barwert,
      summe: kum,
      jahr1: reihe[1].netto,
      eigenkapital: -Math.min(z.start, 0),
      maxVorleistung: -minimum,
      summeZahlungen,
      amortisation: amortisation(reihe),
      irr: z.start < 0 ? irr(reihe.map((r) => r.netto)) : null,
    };
  });

  // Höchster Barwert; Gleichstände (±1 €, z. B. Kredit zum Kalkulationszins) gelten gemeinsam
  const maxBarwert = Math.max(...modelle.map((m) => m.barwert));
  const besteIds = modelle.filter((m) => m.barwert >= maxBarwert - 1).map((m) => m.id);

  return {
    jahre,
    basis: {
      kwp,
      ertragProKwp: spez,
      jahresertrag: jahr[0].erzeugung,
      eigenverbrauch: jahr[0].ev,
      einspeisung: jahr[0].ueb,
      eigenverbrauchsquote: evQuote,
      strompreisCt: preis * 100,
      einspeiseCt: einspeise * 100,
      anlagenpreis,
      zuschuss,
      investition,
      betriebskosten: betrieb1,
      nutzenJahr1: jahr[0].eigentum,
      ifb: { aktiv: !!mitIfb, betrag: ifbBetrag, effekt: ifbEffekt, satz: ANNAHMEN.ifb.satzOeko, koest: ANNAHMEN.ifb.koest },
      lcoeCt,
      kalkulationszins: kz,
      kredit: { betrag: kreditbetrag, rate: kreditRate, jahre: kreditJahre, zins: kr.zins, zinsen: Math.max(kreditRate * kreditJahre - kreditbetrag, 0) },
      leasing: { rate: leasingRate, jahre: leasingJahre, restwert: leasingRestwert, effektivzins: leasingEffektivzins(le.faktor, leasingJahre, Math.max(le.restwert, 0)) },
      contracting: { jahre: coJahre, uebernahme: coUebernahme },
      ppa: { takeOrPay },
    },
    modelle,
    besterId: besteIds[0],
    besteIds,
  };
}

/**
 * Amortisation in Jahren: Zeitpunkt, ab dem der kumulierte Vorteil dauerhaft
 * nicht mehr negativ ist (linear im Jahr interpoliert). 0 = nie im Minus,
 * null = am Ende des Zeitraums noch im Minus.
 */
export function amortisation(reihe) {
  const letzte = reihe[reihe.length - 1];
  if (letzte.kumuliert < 0) return null;
  let letzteNeg = -1;
  reihe.forEach((r, i) => {
    if (r.kumuliert < -1e-9) letzteNeg = i;
  });
  if (letzteNeg < 0) return 0;
  const vorher = reihe[letzteNeg].kumuliert;
  const netto = reihe[letzteNeg + 1].netto;
  return reihe[letzteNeg].jahr + (netto > 0 ? -vorher / netto : 1);
}

/* ------------------------------------------------------------------
   Zahlformat ohne Intl (identisch auf Server und Client):
   1234567,8 → „1.234.568“; zahl(1234.5, 1) → „1.234,5“
   ------------------------------------------------------------------ */
export function zahl(n, stellen = 0) {
  if (!Number.isFinite(n)) return "–";
  const neg = n < 0;
  const f = Math.pow(10, stellen);
  const r = Math.round(Math.abs(n) * f) / f;
  const [ganz, dez] = r.toFixed(stellen).split(".");
  const text = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (dez ? `,${dez}` : "");
  return neg && r !== 0 ? `−${text}` : text;
}

export const euro = (n) => `${zahl(Math.round(n))} €`;

/** Kurzform für Achsen und Kacheln: 12.345 → „12 T€“, 1.234.567 → „1,2 Mio. €“ */
export function euroKurz(n) {
  const a = Math.abs(n);
  const s = n < 0 ? "−" : "";
  if (a >= 1e6) return `${s}${zahl(a / 1e6, 1)} Mio. €`;
  if (a >= 1e4) return `${s}${zahl(a / 1000)} T€`;
  if (a >= 1000) return `${s}${zahl(a / 1000, 1)} T€`;
  return `${s}${zahl(a)} €`;
}

export const prozent = (anteil, stellen = 0) => `${zahl(anteil * 100, stellen)} %`;

/** Amortisation als Text */
export function amortText(a, jahre = JAHRE) {
  if (a == null) return `> ${jahre} J.`;
  if (a === 0) return "ab Jahr 1";
  return `${zahl(a, 1)} J.`;
}
