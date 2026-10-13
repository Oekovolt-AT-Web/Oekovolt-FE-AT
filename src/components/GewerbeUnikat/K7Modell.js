// src/components/GewerbeUnikat/K7Modell.js
//
// K7 · 25 Jahre & Stresstest – Rechenkern (REIN, ohne React). Server (Startzustand im SSR) und Client
// (K7Stresstest, entprellt) rechnen hiermit. Drei Läufe von rechneGewerbePv (src/lib/rechner/gewerbepv.js)
// genau so, wie stresstest() es intern tut – aber mit dem vollen Cashflow, den die Grafik braucht:
//   konservativ: Preis und Einspeisung × STRESSTEST.konservativ.strompreisFaktor, Standortwerte × ertragFaktor,
//                Preissteigerung STRESSTEST.konservativ.preissteigerung
//   erwartet:    Annahmen des Rechners (ANNAHMEN)
//   günstig:     Preissteigerung + STRESSTEST.guenstig.preissteigerungPlusPp
// Danach stresstest(e, { erwartet }) für Satz und Break-even (zusammen 5 Läufe ≈ 15 ms).

import { ANNAHMEN } from "@/data/solarrechner";
import { GEWERBE_PV, STRESSTEST, STRESSTEST_LAEUFE, rechneGewerbePv, spezifischerErtrag, stresstest, stresstestBericht } from "@/lib/rechner/gewerbepv";

const skaliere = (s, f) => ({ ...s, sued35: s.sued35 * f, ostwest15: s.ostwest15 * f, flach10: s.flach10 * f });

/** Dachart-Label (Gewerbe-PV-Rechner). */
export const dachartLabel = (id) => {
  const d = GEWERBE_PV.dacharten.find((x) => x.id === id) || GEWERBE_PV.dacharten[0];
  return { kurz: d.label.replace("Flachdach ", ""), lang: `${d.label} (${d.sub})` };
};

/**
 * Eingaben für rechneGewerbePv aus Pult und Steckbrief.
 * @param {{ kwp:number, dachart:string, ortId:string, verbrauchKwh:number, schichten:number, arbeitspreisCt:number, einspeiseCt:number, eag:boolean }} m
 * @param {Record<string, {sued35:number, ostwest15:number, flach10:number}>} orte
 */
export function modellEingabe(m, orte) {
  const ort = orte[m.ortId] || orte.linz || Object.values(orte)[0];
  return {
    kwp: m.kwp,
    dachart: m.dachart,
    standort: { sued35: ort.sued35, ostwest15: ort.ostwest15, flach10: ort.flach10 },
    verbrauchKwh: m.verbrauchKwh,
    typ: "gewerbe",
    betriebstage: 5,
    schichten: m.schichten,
    arbeitspreisCt: m.arbeitspreisCt,
    einspeiseCt: m.einspeiseCt,
    speicherKwh: 0,
    eag: m.eag,
    ifb: true,
    profil: false,
  };
}

/** Schlüssel für „hat sich etwas geändert?“ (gerundet, damit Gleiten der Regler nicht neu rechnet). */
export const modellSchluessel = (m) =>
  [m.kwp, m.dachart, m.ortId, Math.round(m.verbrauchKwh), m.schichten, Math.round(m.arbeitspreisCt * 1000), Math.round(m.einspeiseCt * 1000), m.eag ? 1 : 0].join("|");

/**
 * Drei Läufe + Stresstest-Sätze. Rückgabe vollständig serialisierbar (Server → Client).
 */
export function modellRechnen(m, orte) {
  const e = modellEingabe(m, orte);
  const Kf = STRESSTEST.konservativ;
  const steigerung = ANNAHMEN.strompreisSteigerung;
  const basis = { ...e, preissteigerung: steigerung };
  const laeufe = {
    konservativ: rechneGewerbePv({
      ...basis,
      arbeitspreisCt: e.arbeitspreisCt * Kf.strompreisFaktor,
      einspeiseCt: e.einspeiseCt * Kf.strompreisFaktor,
      standort: skaliere(e.standort, Kf.ertragFaktor),
      preissteigerung: Kf.preissteigerung,
    }),
    erwartet: rechneGewerbePv(basis),
    guenstig: rechneGewerbePv({ ...basis, preissteigerung: steigerung + STRESSTEST.guenstig.preissteigerungPlusPp }),
  };
  const st = stresstest(e, { erwartet: laeufe.erwartet });
  const kum = (r) => r.cashflow.map((c) => Math.round(c.kumuliert));
  const ew = laeufe.erwartet;
  return {
    schluessel: modellSchluessel(m),
    kwp: e.kwp,
    ortId: m.ortId,
    dachart: m.dachart,
    spezifischerErtrag: spezifischerErtrag(m.dachart, e.standort),
    reihen: { k: kum(laeufe.konservativ), e: kum(ew), g: kum(laeufe.guenstig) },
    amort: { k: laeufe.konservativ.amortisation, e: ew.amortisation, g: laeufe.guenstig.amortisation },
    laeufe: STRESSTEST_LAEUFE.map((l) => {
      const r = laeufe[l.id];
      return { id: l.id, label: l.label, annahme: l.annahme, amortisation: r.amortisation, irr: r.irr, summe: r.summe };
    }),
    erwartet: {
      investition: ew.investition,
      anlagenpreis: ew.anlagenpreis,
      zuschuss: ew.zuschuss.summe,
      amortisation: ew.amortisation,
      irr: ew.irr,
      irrOhneIfb: ew.irrOhneIfb,
      ifbAktiv: ew.ifb.aktiv,
      ifbSteuereffekt: ew.ifb.steuereffekt,
      cashflow: ew.cashflow.slice(1).map((c) => Math.round(c.netto)),
      jahresertrag: ew.jahresertrag,
      eigenverbrauchsquote: ew.eigenverbrauchsquote,
      summe: ew.summe,
      jahre: ew.jahre,
    },
    st: {
      satz: st.satz,
      breakEven: { ct: st.breakEven.ct, frage: st.breakEven.frage, antwort: st.breakEven.antwort, text: st.breakEven.text, erklaerung: st.breakEven.erklaerung },
      laeufe: st.laeufe,
      jahre: st.jahre,
    },
  };
}

/** Stresstest-Tabelle für das Druckblatt (stresstestBericht aus dem Gewerbe-PV-Rechner). */
export const modellBericht = (mod) => stresstestBericht(mod.st);

/** Annahmen des Stundenmodells (offengelegt unter dem Fächer und im Druckblatt). */
export const MODELL_ANNAHMEN = {
  degradation: ANNAHMEN.degradationProJahr,
  preissteigerung: ANNAHMEN.strompreisSteigerung,
  betriebskostenSteigerung: ANNAHMEN.betriebskostenSteigerung,
  jahre: GEWERBE_PV.jahre,
  ifbSatz: ANNAHMEN.ifb.satzOeko,
  koest: ANNAHMEN.ifb.koest,
};
