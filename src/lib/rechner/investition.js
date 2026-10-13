// src/lib/rechner/investition.js
//
// Investitionsrechnung für Business-Case-Dossier (/dossier) und Investitionsantrag
// (/rechner/investitionsantrag): Kapitalwert (NPV), Sensitivität als Tornado, DSCR
// (Schuldendienstdeckung) für die Kreditvariante und ein Projekt-Cashflow über
// 25 Jahre aus Eigentümersicht auf den Annahmen des Solarrechners.
//
// Reine Funktionen ohne React und ohne Pfad-Aliase – per Node prüfbar:
// node scripts/investition.test.mjs (Kapitalwert und DSCR gegen Excel-Referenzwerte).
// Betrachtung NETTO und vor Ertragsteuern; nur der Steuereffekt des Investitions-
// freibetrags wird – wie in finanzierung.js – im Jahr 1 separat ausgewiesen.
// Alle Werte sind Richtwerte/Orientierung, keine Steuer- oder Finanzberatung.
// Stand: 11.10.2026.

import { ANNAHMEN, preisProKwp, betriebskostenProKwp, strompreisGewerbe, eagZuschuss } from "../../data/solarrechner.js";
import { annuitaet, einspeiseSatzCt, irr } from "./gewerbepv.js";
import { amortisation } from "./finanzierung.js";

export const STAND_INVESTITION = { iso: "2026-10-11", label: "11.10.2026" };
export const JAHRE_ANTRAG = 25;

const zahlOder = (v, std) => (Number.isFinite(Number(v)) && v !== null && v !== "" ? Number(v) : std);
const rund = (v, s = 0.5) => Math.round(v / s) * s;

/**
 * Kapitalwert (Net Present Value).
 * zahlungen[0] fällt zum Zeitpunkt 0 an (Investition negativ), zahlungen[t] am Ende des Jahres t.
 * Entspricht in Excel: =zahlungen[0] + NBW(wacc; zahlungen[1]; …; zahlungen[n]).
 * @param {number[]} zahlungen
 * @param {number} wacc  Kalkulationszins (z. B. 0,05)
 */
export function kapitalwert(zahlungen, wacc) {
  const r = Number(wacc);
  if (!Array.isArray(zahlungen) || !Number.isFinite(r) || r <= -1) return NaN;
  return zahlungen.reduce((summe, z, t) => summe + (Number(z) || 0) / Math.pow(1 + r, t), 0);
}

/**
 * Schuldendienstdeckungsgrad (DSCR) je Jahr: Cashflow vor Schuldendienst (CFADS) ÷ Schuldendienst
 * (Zins + Tilgung). Jahre ohne Schuldendienst gehen nicht in Minimum und Mittel ein.
 * Banken verlangen üblicherweise dauerhaft deutlich über 1,0 (Orientierung, projektabhängig).
 * @param {number[]} cfads          Cashflow vor Schuldendienst je Jahr (Index 0 = Jahr 1)
 * @param {number[]} schuldendienst Zins + Tilgung je Jahr (Index 0 = Jahr 1)
 */
export function dscr(cfads, schuldendienst) {
  const jahre = [];
  const werte = [];
  const n = Math.max(cfads?.length || 0, schuldendienst?.length || 0);
  for (let i = 0; i < n; i++) {
    const c = Number(cfads?.[i]) || 0;
    const s = Number(schuldendienst?.[i]) || 0;
    const wert = s > 0 ? c / s : null;
    if (wert != null) werte.push(wert);
    jahre.push({ t: i + 1, cfads: c, schuldendienst: s, dscr: wert });
  }
  const min = werte.length ? Math.min(...werte) : null;
  const mittel = werte.length ? werte.reduce((a, b) => a + b, 0) / werte.length : null;
  return { jahre, min, mittel, unterEins: werte.filter((w) => w < 1).length, jahreMitSchuldendienst: werte.length };
}

/**
 * Standardwerte des Projekt-Cashflows (Richtwerte des Solarrechners, Beispielwerte für Kredit).
 * Alles im Rechner offen und änderbar.
 */
export const INVESTITION = {
  jahre: JAHRE_ANTRAG,
  kwp: 250,
  ertragProKwp: 1000, // Volllaststunden Marktstatistik 2024 (siehe src/data/solarrechner.js)
  eigenverbrauchsquote: 0.7,
  strompreisCt: rund(strompreisGewerbe(500000) * 100), // Eurostat-basierter Richtwert, 500 MWh/a
  strompreisSteigerung: ANNAHMEN.strompreisSteigerung,
  degradation: ANNAHMEN.degradationProJahr,
  betriebskostenSteigerung: ANNAHMEN.betriebskostenSteigerung,
  kalkulationszins: 0.05, // Beispiel für die Kapitalkosten (WACC) des Betriebs
  kredit: { fremdkapitalAnteil: 0.8, zins: 0.05, jahre: 10 }, // Beispielwerte, keine Bankkondition
  eag: false,
  ifb: true,
};

/**
 * Projekt-Cashflow über `jahre` Jahre (Standard 25) aus Sicht des Eigentümers, optional mit
 * Kreditvariante (Annuität) für DSCR und Liquidität.
 * @param {object} e  alle Felder optional, siehe INVESTITION; zusätzlich investition, betriebskosten,
 *                    einspeiseCt, zuschuss (€, überschreibt eag), kredit {fremdkapitalAnteil, zins, jahre}
 */
export function projektCashflow(e = {}) {
  const S = INVESTITION;
  const jahre = Math.min(Math.max(Math.round(zahlOder(e.jahre, S.jahre)), 1), 40);
  const kwp = Math.max(zahlOder(e.kwp, S.kwp), 1);
  const spez = Math.max(zahlOder(e.ertragProKwp, S.ertragProKwp), 0);
  const evQuote = Math.min(Math.max(zahlOder(e.eigenverbrauchsquote, S.eigenverbrauchsquote), 0), 1);
  const strompreisCt = Math.max(zahlOder(e.strompreisCt, S.strompreisCt), 0);
  const steigerung = zahlOder(e.strompreisSteigerung, S.strompreisSteigerung);
  const deg = Math.min(Math.max(zahlOder(e.degradation, S.degradation), 0), 0.05);
  const einspeiseCt = Math.max(zahlOder(e.einspeiseCt, einspeiseSatzCt(kwp)), 0);
  const kz = zahlOder(e.kalkulationszins, S.kalkulationszins);
  const bkSteigerung = zahlOder(e.betriebskostenSteigerung, S.betriebskostenSteigerung);
  const mitIfb = e.ifb ?? S.ifb;
  const mitEag = e.eag ?? S.eag;
  const kr = { ...S.kredit, ...(e.kredit || {}) };
  const mitKredit = e.kredit !== null && e.kredit !== false && kr.fremdkapitalAnteil > 0;

  const anlagenpreis = Math.max(zahlOder(e.investition, kwp * preisProKwp(kwp, "gewerbe")), 0);
  const zuschuss = Math.max(zahlOder(e.zuschuss, mitEag ? eagZuschuss(kwp, 0).summe : 0), 0);
  const investition = Math.max(anlagenpreis - zuschuss, 0);
  const betrieb1 = Math.max(zahlOder(e.betriebskosten, kwp * betriebskostenProKwp(kwp, "gewerbe")), 0);

  // IFB: Bemessung = Anschaffungskosten abzüglich steuerfreier Zuschüsse, höchstens 1 Mio. €
  const ifbBetrag = Math.min(investition, ANNAHMEN.ifb.bemessungsgrundlageMax) * ANNAHMEN.ifb.satzOeko;
  const ifbEffekt = mitIfb ? ifbBetrag * ANNAHMEN.ifb.koest : 0;

  // Kredit (Annuität, Zins/Tilgung getrennt für den DSCR)
  const fkAnteil = mitKredit ? Math.min(Math.max(kr.fremdkapitalAnteil, 0), 1) : 0;
  const kreditbetrag = investition * fkAnteil;
  const kreditJahre = Math.max(Math.round(kr.jahre), 1);
  const kreditRate = mitKredit ? annuitaet(kreditbetrag, kr.zins, kreditJahre) : 0;

  const reihe = [];
  let kum = -investition;
  let kumKredit = -(investition - kreditbetrag);
  let restschuld = kreditbetrag;
  let lcoeKosten = investition;
  let lcoeMenge = 0;
  for (let t = 1; t <= jahre; t++) {
    const erzeugung = kwp * spez * Math.pow(1 - deg, t - 1);
    const ev = erzeugung * evQuote;
    const ueb = erzeugung - ev;
    const preisT = (strompreisCt / 100) * Math.pow(1 + steigerung, t - 1);
    const ersparnis = ev * preisT;
    const erloes = ueb * (einspeiseCt / 100);
    const betrieb = betrieb1 * Math.pow(1 + bkSteigerung, t - 1);
    const cfads = ersparnis + erloes - betrieb;
    let zinsen = 0;
    let tilgung = 0;
    if (mitKredit && t <= kreditJahre && restschuld > 0) {
      zinsen = restschuld * Math.max(kr.zins, 0);
      tilgung = Math.min(kreditRate - zinsen, restschuld);
      restschuld = Math.max(restschuld - tilgung, 0);
    }
    const ifb = t === 1 ? ifbEffekt : 0;
    const netto = cfads + ifb;
    const nettoKredit = cfads - zinsen - tilgung + ifb;
    kum += netto;
    kumKredit += nettoKredit;
    lcoeKosten += betrieb / Math.pow(1 + kz, t);
    lcoeMenge += erzeugung / Math.pow(1 + kz, t);
    reihe.push({ t, erzeugung, ev, ueb, preisCt: preisT * 100, ersparnis, erloes, betrieb, cfads, ifb, zinsen, tilgung, schuldendienst: zinsen + tilgung, restschuld, netto, kumuliert: kum, nettoKredit, kumuliertKredit: kumKredit });
  }

  const zahlungen = [-investition, ...reihe.map((r) => r.netto)];
  const zahlungenKredit = [-(investition - kreditbetrag), ...reihe.map((r) => r.nettoKredit)];
  const reiheKum = [{ jahr: 0, netto: -investition, kumuliert: -investition }, ...reihe.map((r) => ({ jahr: r.t, netto: r.netto, kumuliert: r.kumuliert }))];
  const schuldendienst = dscr(
    reihe.map((r) => r.cfads),
    reihe.map((r) => r.schuldendienst)
  );

  return {
    stand: STAND_INVESTITION,
    jahre,
    eingaben: { kwp, ertragProKwp: spez, eigenverbrauchsquote: evQuote, strompreisCt, strompreisSteigerung: steigerung, degradation: deg, einspeiseCt, kalkulationszins: kz, betriebskosten: betrieb1, betriebskostenSteigerung: bkSteigerung, investition: anlagenpreis, zuschuss, ifb: !!mitIfb, kredit: mitKredit ? { fremdkapitalAnteil: fkAnteil, zins: kr.zins, jahre: kreditJahre } : null },
    anlagenpreis,
    zuschuss,
    investition,
    eigenkapital: investition - kreditbetrag,
    jahr1: reihe[0],
    reihe,
    zahlungen,
    kapitalwert: kapitalwert(zahlungen, kz),
    kapitalwertKredit: mitKredit ? kapitalwert(zahlungenKredit, kz) : null,
    irr: investition > 0 ? irr(zahlungen) : null,
    amortisation: amortisation(reiheKum),
    summe: kum,
    summeKredit: mitKredit ? kumKredit : null,
    lcoeCt: lcoeMenge > 0 ? (lcoeKosten / lcoeMenge) * 100 : null,
    ifb: { aktiv: !!mitIfb, betrag: ifbBetrag, effekt: ifbEffekt, satz: ANNAHMEN.ifb.satzOeko, koest: ANNAHMEN.ifb.koest },
    kredit: mitKredit ? { betrag: kreditbetrag, rate: kreditRate, jahre: kreditJahre, zins: kr.zins, zinsenGesamt: reihe.reduce((s, r) => s + r.zinsen, 0), dscr: schuldendienst } : null,
  };
}

/**
 * Varianten des Tornado-Diagramms: niedrig/hoch je Einflussgröße.
 * relativ: Faktor auf den Basiswert, absolut: Verschiebung in Einheiten des Felds.
 */
export const SENSITIVITAET_VARIANTEN = [
  { id: "strompreis", label: "Strompreis", feld: "strompreisCt", art: "relativ", niedrig: -0.3, hoch: 0.3, text: "±30 %" },
  { id: "eigenverbrauch", label: "Eigenverbrauchsquote", feld: "eigenverbrauchsquote", art: "absolut", niedrig: -0.1, hoch: 0.1, text: "±10 Prozentpunkte" },
  { id: "investition", label: "Investition", feld: "investition", art: "relativ", niedrig: -0.15, hoch: 0.15, text: "±15 %" },
  { id: "degradation", label: "Degradation", feld: "degradation", art: "absolut", niedrig: -0.0025, hoch: 0.0025, text: "±0,25 Prozentpunkte je Jahr" },
];

/**
 * Sensitivität des Kapitalwerts als Tornado: je Variante der Kapitalwert bei niedrigem und hohem
 * Wert der Einflussgröße, sortiert nach Spannweite (größter Hebel zuerst).
 * @param {object} eingaben   wie projektCashflow()
 * @param {object} [o]        { varianten, rechne } – rechne(eingaben) liefert den Kapitalwert
 */
export function sensitivitaet(eingaben = {}, { varianten = SENSITIVITAET_VARIANTEN, rechne } = {}) {
  const basisErgebnis = projektCashflow(eingaben);
  const basis = basisErgebnis.eingaben;
  const kw = rechne || ((e) => projektCashflow(e).kapitalwert);
  // Aufgelöste Eingaben festhalten, damit jede Variante nur ihr Feld verändert
  const fest = { ...eingaben, kwp: basis.kwp, ertragProKwp: basis.ertragProKwp, eigenverbrauchsquote: basis.eigenverbrauchsquote, strompreisCt: basis.strompreisCt, degradation: basis.degradation, investition: basis.investition, zuschuss: basis.zuschuss, betriebskosten: basis.betriebskosten, einspeiseCt: basis.einspeiseCt, kalkulationszins: basis.kalkulationszins };
  const basisKw = kw(fest);
  const zeilen = varianten.map((v) => {
    const w0 = basis[v.feld];
    const wert = (d) => (v.art === "relativ" ? w0 * (1 + d) : w0 + d);
    const wN = Math.max(wert(v.niedrig), 0);
    const wH = Math.max(wert(v.hoch), 0);
    const kN = kw({ ...fest, [v.feld]: wN });
    const kH = kw({ ...fest, [v.feld]: wH });
    return { id: v.id, label: v.label, text: v.text, basis: w0, niedrig: { wert: wN, kapitalwert: kN, delta: kN - basisKw }, hoch: { wert: wH, kapitalwert: kH, delta: kH - basisKw }, spanne: Math.abs(kH - kN) };
  });
  zeilen.sort((a, b) => b.spanne - a.spanne);
  return { basis: basisKw, zeilen, stand: STAND_INVESTITION };
}

/* ------------------------------------------------------------------
   Zahlformat ohne Intl (identisch auf Server und Client)
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
export const prozent = (anteil, stellen = 0) => `${zahl(anteil * 100, stellen)} %`;
