// Tests für die Gewerbe-Rechner (reine Funktionen, ohne React/Aliase):
//   src/lib/rechner/gewerbepv.js · peakshaving.js · pacht.js · blackout.js · co2.js · energiegemeinschaft.js
//   sowie die Preis-/Förderhelfer aus src/data/solarrechner.js.
// Aufruf: node scripts/rechner-gewerbe.test.mjs
//
// Referenzwerte: Handrechnungen aus den offengelegten Annahmen (Stand September 2026),
// finanzmathematische Identitäten und Plausibilität (Monotonie, Energiebilanzen, Randfälle).

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { ANNAHMEN, preisProKwp, speicherPreisProKwh, strompreisGewerbe, betriebskostenProKwp, eagZuschuss } from "../src/data/solarrechner.js";
import {
  GEWERBE_PV,
  GEWERBE_PRESETS,
  annuitaet,
  arbeitspreisRichtwertCt,
  eagKategorie,
  einspeiseSatzCt,
  irr,
  kwpAusFlaeche,
  rechneGewerbePv,
  spezifischerErtrag,
  torTyp,
} from "../src/lib/rechner/gewerbepv.js";
import {
  NETZBEREICHE,
  PS_ANNAHMEN,
  PS_PRESETS,
  erreichbareSpitze,
  glatt,
  mitSpeicher,
  monatsspitzen,
  netzbereich,
  netzpreise,
  peakShaving,
  psAusParams,
  psParams,
  psReihen,
  spitzentag,
  ueberSchwelle,
} from "../src/lib/rechner/peakshaving.js";
import { PACHT, netzEinschaetzung, rechnePacht } from "../src/lib/rechner/pacht.js";
import {
  BRANCHEN,
  auslegung,
  boAusParams,
  boParams,
  branche,
  deckungsdauer,
  kostenJeStunde,
  literJeKwh,
  simuliereAusfall,
  speicherVorschlag,
  szenarien,
  szenarioKosten,
} from "../src/lib/rechner/blackout.js";
import { CO2, rechneCo2, textbaustein } from "../src/lib/rechner/co2.js";
import {
  EG_ANNAHMEN,
  EG_PRESETS,
  arbeitspreisCt,
  egAusParams,
  egBilanz,
  egParams,
  egWirtschaft,
  lastprofil,
  teilnahme,
  verbrauchVon,
} from "../src/lib/rechner/energiegemeinschaft.js";
import { PV_MONAT } from "../src/lib/rechner/profile.js";

// Summe der PV-Monatsanteile (sollte 1 sein – siehe Befund tests-01 in rechner-privat.test.mjs)
const PV_SUMME = PV_MONAT.reduce((a, b) => a + b, 0);

const nahe = (ist, soll, tol, text = "") => assert.ok(Math.abs(ist - soll) <= tol, `${text} ${ist} ≠ ${soll} (±${tol})`);
const endlich = (obj, pfad = "") => {
  // alle Zahlen eines Ergebnisses rekursiv auf NaN prüfen (Infinity ist teils gewollt)
  if (typeof obj === "number") return assert.ok(!Number.isNaN(obj), `NaN bei ${pfad}`);
  if (obj && typeof obj === "object" && !(obj instanceof Float64Array)) for (const [k, v] of Object.entries(obj)) endlich(v, `${pfad}.${k}`);
};
const getter = (qs) => {
  const p = new URLSearchParams(qs);
  return (k) => p.get(k);
};

// Standort wie aus src/data/regionen-pvgis.json (Richtwerte, gerundet)
const STANDORT = { sued35: 1100, ostwest15: 950, flach10: 1000 };

// ---------------------------------------------------------------------------
describe("data/solarrechner – Preis- und Förderhelfer", () => {
  test("preisProKwp: Stützstellen, Interpolation, privat brutto / Betrieb netto", () => {
    assert.equal(preisProKwp(5, "privat"), 1550 * 1.2);
    assert.equal(preisProKwp(5, "gewerbe"), 1550);
    assert.equal(preisProKwp(75, "gewerbe"), 925); // Mitte zwischen 50 (950) und 100 (900)
    assert.equal(preisProKwp(1, "gewerbe"), 1550); // unterhalb der ersten Stützstelle konstant
    assert.equal(preisProKwp(5000, "gewerbe"), 750); // oberhalb der letzten konstant
  });
  test("preisProKwp fällt mit der Anlagengröße (Skaleneffekt)", () => {
    let vorher = Infinity;
    for (const kwp of [5, 10, 20, 50, 100, 250, 500, 1000]) {
      const p = preisProKwp(kwp, "gewerbe");
      assert.ok(p <= vorher, `${kwp} kWp`);
      vorher = p;
    }
  });
  test("speicherPreisProKwh: privat brutto 660 €/kWh bei 10 kWh (Feld speicherPreisProKwh)", () => {
    nahe(speicherPreisProKwh(10, "privat"), ANNAHMEN.speicherPreisProKwh, 1e-9);
    assert.equal(speicherPreisProKwh(100, "gewerbe"), 450);
  });
  test("strompreisGewerbe: log-lineare Interpolation", () => {
    nahe(strompreisGewerbe(10000), 0.26, 1e-12);
    nahe(strompreisGewerbe(100000), 0.2, 1e-12);
    nahe(strompreisGewerbe(Math.sqrt(1e4 * 1e5)), 0.23, 1e-12); // geometrische Mitte → arithmetische Mitte
    nahe(strompreisGewerbe(0), 0.26, 1e-12); // Randfall 0 / negativ → erste Stützstelle
    nahe(strompreisGewerbe(-5), 0.26, 1e-12);
    nahe(strompreisGewerbe(1e9), 0.155, 1e-12);
    assert.equal(arbeitspreisRichtwertCt(100000), 20);
  });
  test("betriebskostenProKwp: privat pauschal, Betrieb interpoliert", () => {
    assert.equal(betriebskostenProKwp(10), 25);
    assert.equal(betriebskostenProKwp(10, "gewerbe"), 18);
    assert.equal(betriebskostenProKwp(55, "gewerbe"), 16);
  });
  test("eagZuschuss: Kategorien A–D, Speicher gedeckelt, > 1.000 kWp anteilig", () => {
    assert.deepEqual(eagZuschuss(8, 10), { kategorie: "A", pv: 1200, speicher: 1500, summe: 2700 });
    assert.equal(eagZuschuss(20, 0).pv, 2800);
    assert.equal(eagZuschuss(80, 80).speicher, 50 * 150); // max. 50 kWh
    assert.deepEqual(eagZuschuss(1500, 100), { kategorie: "D", pv: 120000, speicher: 7500, summe: 127500 });
    assert.equal(eagZuschuss(0, 10).summe, 0);
    assert.equal(eagZuschuss(-5, 10).summe, 0);
    assert.equal(eagZuschuss(10, -3).speicher, 0);
  });
});

// ---------------------------------------------------------------------------
describe("gewerbepv – Hilfsfunktionen", () => {
  test("einspeiseSatzCt: anteilige Mischung der Größenklassen", () => {
    assert.equal(einspeiseSatzCt(10), 6);
    assert.equal(einspeiseSatzCt(500), 6);
    assert.equal(einspeiseSatzCt(1000), 5.75); // (500 × 6 + 500 × 5,5) / 1.000
    assert.equal(einspeiseSatzCt(2000), 5.63); // 5,625 gerundet
    assert.equal(einspeiseSatzCt(0), 6);
    assert.equal(einspeiseSatzCt(-10), 6);
    assert.equal(einspeiseSatzCt(NaN), 6);
  });
  test("annuitaet: Barwertformel, Zins 0, Randfälle", () => {
    nahe(annuitaet(100000, 0.05, 10), 12950.4575, 1e-3);
    assert.equal(annuitaet(1000, 0, 10), 100);
    assert.equal(annuitaet(0, 0.05, 10), 0);
    assert.equal(annuitaet(-1000, 0.05, 10), 0);
    assert.equal(annuitaet(1000, 0.05, 0), 0);
    // Summe der abgezinsten Raten = Kreditbetrag
    const r = annuitaet(50000, 0.04, 8);
    let bw = 0;
    for (let t = 1; t <= 8; t++) bw += r / 1.04 ** t;
    nahe(bw, 50000, 1e-6);
  });
  test("irr: bekannte Beispiele und nicht bestimmbare Fälle", () => {
    nahe(irr([-100, 110]), 0.1, 1e-6);
    nahe(irr([-100, 50, 50]), 0, 1e-6);
    nahe(irr([-1000, 300, 300, 300, 300, 300]), 0.15238, 1e-4);
    assert.equal(irr([100, 10]), null); // kein Vorzeichenwechsel
    assert.equal(irr([-100, -10]), null);
  });
  test("torTyp: Grenzen nach TOR Erzeuger", () => {
    assert.equal(torTyp(0.5).typ, "–");
    assert.equal(torTyp(0.8).typ, "A");
    assert.equal(torTyp(249.99).typ, "A");
    assert.equal(torTyp(250).typ, "B");
    assert.equal(torTyp(34999).typ, "B");
    assert.equal(torTyp(35000).typ, "C");
    assert.equal(torTyp(50000).typ, "D");
  });
  test("eagKategorie: Kategorien nach § 5 EAG-IZV", () => {
    assert.equal(eagKategorie(10).id, "A");
    assert.equal(eagKategorie(10.01).id, "B");
    assert.equal(eagKategorie(20).id, "B");
    assert.equal(eagKategorie(100).id, "C");
    assert.equal(eagKategorie(100.5).id, "D");
    assert.equal(eagKategorie(1000).anteiligBisKwp, undefined);
    assert.equal(eagKategorie(1500).anteiligBisKwp, 1000);
    assert.match(eagKategorie(80).text, /höchstens 130 €\/kWp/);
  });
  test("kwpAusFlaeche / spezifischerErtrag je Dachart", () => {
    assert.equal(kwpAusFlaeche(700, "ost-west"), 100);
    assert.equal(kwpAusFlaeche(500, "trapez"), 100);
    assert.equal(kwpAusFlaeche(1000, "sued"), 100);
    assert.equal(kwpAusFlaeche(700, "gibt-es-nicht"), 100); // Fallback Ost-West
    assert.equal(spezifischerErtrag("ost-west", STANDORT), 950);
    assert.equal(spezifischerErtrag("sued", STANDORT), 1000);
    assert.equal(spezifischerErtrag("trapez", STANDORT), 975);
    assert.equal(spezifischerErtrag("shed", STANDORT), 1067); // 1.100 × 0,97
  });
});

describe("gewerbepv – rechneGewerbePv", () => {
  const BASIS = { kwp: 200, dachart: "ost-west", standort: STANDORT, verbrauchKwh: 400000, betriebstage: 5, schichten: 1 };
  const r = rechneGewerbePv(BASIS);

  test("Energiebilanz ohne Speicher: Eigenverbrauch + Einspeisung = simulierte Erzeugung", () => {
    assert.equal(r.jahresertrag, 200 * 950);
    nahe(r.eigenverbrauch + r.einspeisung, r.jahresertrag * PV_SUMME, r.jahresertrag * 1e-6);
    assert.ok(r.eigenverbrauchsquote > 0 && r.eigenverbrauchsquote <= 1);
    assert.ok(r.autarkie > 0 && r.autarkie <= 1);
    nahe(r.netzbezug, 400000 - r.eigenverbrauch, 1e-6);
    nahe(r.co2Tonnen, (190000 * 0.2582) / 1000, 1e-9);
    endlich(r);
  });
  test(
    "Befund: Eigenverbrauch + Einspeisung ergibt nur 99,5 % des ausgewiesenen Jahresertrags",
    { todo: "Befund tests-01: PV_MONAT in src/lib/rechner/profile.js Z. 27 summiert sich auf 0,995 statt 1" },
    () => nahe(r.eigenverbrauch + r.einspeisung, r.jahresertrag, r.jahresertrag * 1e-6)
  );
  test("Geldwerte Jahr 1 aus den Annahmen nachgerechnet", () => {
    nahe(r.arbeitspreisCt, strompreisGewerbe(400000) * 100, 1e-9);
    assert.equal(r.einspeiseCt, 6);
    nahe(r.ersparnis, (r.eigenverbrauch * r.arbeitspreisCt) / 100, 1e-6);
    nahe(r.betriebskosten, 200 * betriebskostenProKwp(200, "gewerbe"), 1e-9);
    nahe(r.anlagenpreis, 200 * preisProKwp(200, "gewerbe"), 1e-9);
    assert.equal(r.investition, r.anlagenpreis);
    // IFB 22 % × 23 % KöSt
    nahe(r.ifb.steuereffekt, r.investition * 0.22 * 0.23, 1e-6);
    assert.equal(r.cashflow.length, GEWERBE_PV.jahre + 1);
    nahe(r.cashflow[1].ifb, r.ifb.steuereffekt, 1e-9);
    assert.equal(r.cashflow[2].ifb, 0);
  });
  test("Amortisation und IRR sind konsistent mit dem kumulierten Cashflow", () => {
    assert.ok(r.amortisation > 0 && r.amortisation < 25, `Amortisation ${r.amortisation}`);
    const t = Math.ceil(r.amortisation);
    assert.ok(r.cashflow[t].kumuliert >= 0 && r.cashflow[t - 1].kumuliert < 0);
    const npv = r.cashflow.reduce((s, c, i) => s + c.netto / (1 + r.irr) ** i, 0);
    nahe(npv, 0, 1);
    assert.ok(r.irrOhneIfb < r.irr, "IFB erhöht die Rendite");
    nahe(r.summe, r.cashflow.at(-1).kumuliert, 1e-9);
  });
  test("Plausibilität: höherer Strompreis → kürzere Amortisation, höherer IRR", () => {
    const billig = rechneGewerbePv({ ...BASIS, arbeitspreisCt: 12 });
    const teuer = rechneGewerbePv({ ...BASIS, arbeitspreisCt: 28 });
    assert.ok(teuer.amortisation < billig.amortisation);
    assert.ok(teuer.irr > billig.irr);
  });
  test("Plausibilität: Preissteigerung, EAG-Zuschuss und IFB verkürzen die Amortisation", () => {
    const ohneSteigerung = rechneGewerbePv({ ...BASIS, preissteigerung: 0 });
    const mitSteigerung = rechneGewerbePv({ ...BASIS, preissteigerung: 0.04 });
    assert.ok(mitSteigerung.amortisation < ohneSteigerung.amortisation);
    const eag = rechneGewerbePv({ ...BASIS, eag: true });
    nahe(eag.investition, r.anlagenpreis - eagZuschuss(200, 0).summe, 1e-6);
    assert.ok(eag.amortisation < r.amortisation);
    const ohneIfb = rechneGewerbePv({ ...BASIS, ifb: false });
    assert.ok(ohneIfb.amortisation > r.amortisation);
  });
  test("Speicher erhöht Autarkie und senkt Einspeisung", () => {
    const s = rechneGewerbePv({ ...BASIS, speicherKwh: 200 });
    assert.ok(s.autarkie > r.autarkie);
    assert.ok(s.einspeisung < r.einspeisung);
    assert.ok(s.speicherpreis > 0);
    nahe(s.ohneSpeicher.autarkie, r.autarkie, 1e-9);
  });
  test("Leasing: keine Anfangsinvestition im Cashflow, Rate = Annuität, keine Amortisation/IRR", () => {
    const l = rechneGewerbePv({ ...BASIS, finanzierung: "leasing", leasingZins: 0.05, leasingJahre: 10 });
    assert.equal(l.cashflow[0].netto, 0);
    nahe(l.leasing.rate, annuitaet(l.investition, 0.05, 10), 1e-6);
    assert.equal(l.cashflow[10].rate, l.leasing.rate);
    assert.equal(l.cashflow[11].rate, 0);
    assert.equal(l.amortisation, null);
    assert.equal(l.irr, null);
    assert.equal(l.ifb.aktiv, false);
    assert.equal(l.cashflow[1].ifb, 0);
  });
  test("Randfälle: 0/negative Eingaben werden abgefangen (kein NaN)", () => {
    const n = rechneGewerbePv({ kwp: 0, standort: STANDORT, verbrauchKwh: 0 });
    assert.equal(n.kwp, 1); // Mindestens 1 kWp
    endlich(n);
    const neg = rechneGewerbePv({ kwp: -50, standort: STANDORT, verbrauchKwh: -100, speicherKwh: -10 });
    assert.equal(neg.kwp, 1);
    assert.equal(neg.speicherpreis, 0);
    endlich(neg);
    const text = rechneGewerbePv({ kwp: "120", standort: STANDORT, verbrauchKwh: "300000" });
    assert.equal(text.kwp, 120);
  });
  test("TOR/EAG/OeMAG-Grenzen im Ergebnis", () => {
    const gross = rechneGewerbePv({ ...BASIS, kwp: 600, profil: false });
    assert.equal(gross.tor.typ, "B");
    assert.equal(gross.eag.id, "D");
    assert.equal(gross.oemagMoeglich, false);
    assert.equal(gross.tagesprofil, null);
    assert.equal(r.oemagMoeglich, true);
  });
  test("Tagesprofil: Sommer-PV übertrifft Winter-PV, 24 Stunden, nachts 0", () => {
    const { sommer, winter } = r.tagesprofil;
    assert.equal(sommer.pv.length, 24);
    const s = sommer.pv.reduce((a, b) => a + b, 0);
    const w = winter.pv.reduce((a, b) => a + b, 0);
    assert.ok(s > 2 * w, `Sommer ${s} / Winter ${w}`);
    assert.equal(sommer.pv[0], 0);
    assert.ok(Math.max(...sommer.last) > 0);
  });
  test("Presets rechnen ohne Fehler", () => {
    for (const p of GEWERBE_PRESETS) {
      const e = rechneGewerbePv({ kwp: kwpAusFlaeche(p.flaeche, p.dachart), dachart: p.dachart, standort: STANDORT, verbrauchKwh: p.verbrauch, typ: p.typ, betriebstage: p.betriebstage, schichten: p.schichten, speicherKwh: p.speicher, profil: false });
      endlich(e, p.id);
      assert.ok(e.amortisation === null || e.amortisation > 0, p.id);
    }
  });
});

// ---------------------------------------------------------------------------
describe("peakshaving", () => {
  test("netzpreise / netzbereich: Werte aus der SNE-V 2026, Fallback OÖ", () => {
    assert.deepEqual(
      (({ lp, ap, nv }) => ({ lp, ap, nv }))(netzpreise("ooe", 6)),
      { lp: 65.88, ap: 2.37, nv: 0.454 }
    );
    assert.equal(netzpreise("ooe", "7").nv, 0.528);
    assert.equal(netzpreise("wien", 5).lp, 55.32);
    assert.equal(netzbereich("gibt-es-nicht").id, "ooe");
    assert.equal(netzpreise("ooe", 9).lp, 65.88); // ungültige Ebene → NE 6
    assert.equal(NETZBEREICHE.length, 13);
  });
  test("monatsspitzen: Faktoren der Spitzenform", () => {
    assert.deepEqual(monatsspitzen(500, "winter"), [500, 495, 485, 475, 470, 475, 470, 440, 475, 480, 495, 500]);
    assert.equal(Math.max(...monatsspitzen(300, "sommer")), 300);
    assert.deepEqual(monatsspitzen(100, "x"), monatsspitzen(100, "winter"));
  });
  test("spitzentag: 96 Viertelstunden, Maximum = Spitze, nie negativ", () => {
    for (const art of ["anlauf", "mittel", "plateau"]) {
      for (const schichten of [1, 2, 3]) {
        const k = spitzentag({ spitze: 500, plateau: 350, schichten, art });
        assert.equal(k.length, 96);
        nahe(Math.max(...k), 500, 0.5, `${art}/${schichten}`);
        assert.ok(k.every((v) => v >= 0));
      }
    }
    // unplausible Grundlast über der Spitze wird gekappt
    const k = spitzentag({ spitze: 100, plateau: 500 });
    nahe(Math.max(...k), 100, 0.5);
  });
  test("ueberSchwelle: Energie in kWh (Viertelstunden) und Leistung", () => {
    assert.deepEqual(ueberSchwelle([0, 100, 200, 100], 150), { energie: 12.5, leistung: 50 });
    assert.deepEqual(ueberSchwelle([10, 20], 50), { energie: 0, leistung: 0 });
  });
  test("erreichbareSpitze: Ziel mit genug Speicher, sonst dazwischen", () => {
    const k = [100, 200, 300, 200, 100];
    assert.equal(erreichbareSpitze(k, 150, 1000, 1000), 150);
    assert.equal(erreichbareSpitze(k, 400, 0, 0), 300); // Ziel über der Spitze
    const s = erreichbareSpitze(k, 150, 5, 1000); // 5 kWh reichen nur teilweise
    assert.ok(s > 150 && s < 300);
    nahe(ueberSchwelle(k, s).energie, 5, 1e-6);
    nahe(erreichbareSpitze(k, 150, 0, 0), 300, 1e-6);
  });
  test("mitSpeicher: Netzbezug über der Schwelle gekappt, Nachladen mit Verlust", () => {
    const k = spitzentag({ spitze: 500, plateau: 350, schichten: 2, art: "mittel" });
    const r = mitSpeicher(k, 420, 200);
    assert.ok(Math.max(...r.netz) <= 420 + 1e-9);
    const entladen = r.entladen.reduce((a, b) => a + b, 0) / 4;
    const geladen = r.laden.reduce((a, b) => a + b, 0) / 4;
    nahe(geladen, entladen / PS_ANNAHMEN.eta, 1e-6);
  });
  test("glatt: Rundung auf übliche Speichergrößen", () => {
    assert.equal(glatt(0), 0);
    assert.equal(glatt(-3), 0);
    assert.equal(glatt(12), 15);
    assert.equal(glatt(49), 50);
    assert.equal(glatt(50), 50);
    assert.equal(glatt(51), 60);
    assert.equal(glatt(201), 220);
    assert.equal(glatt(1001), 1050);
  });

  const metall = PS_PRESETS.find((p) => p.id === "metall");
  const e = { ...metall, spitzen: monatsspitzen(metall.spitze, metall.form), speicher: null };
  const reihen = psReihen(e);
  const r = peakShaving(e, reihen);

  test("Vorschlag erreicht das Kappungsziel, Senkung und Ersparnis stimmen", () => {
    assert.equal(r.zielErreicht, true);
    assert.equal(r.jahresspitze, 500);
    assert.equal(r.ziel, 400);
    r.gekappt.forEach((g, m) => assert.ok(g <= r.spitzen[m] + 1e-9));
    nahe(r.senkung, r.ohneMittel - r.mitMittel, 1e-9);
    nahe(r.ersparnisLp, r.senkung * 65.88, 1e-6);
    assert.ok(r.speicher.kwh >= r.bedarf.kapazitaet);
    assert.ok(r.speicher.kw >= r.bedarf.leistung);
    assert.ok(r.wirtschaft.amortisation > 0);
    endlich(r);
  });
  test("Plausibilität: höherer Leistungspreis → mehr Ersparnis, kürzere Amortisation", () => {
    const hoch = peakShaving({ ...e, lp: 120 }, reihen);
    assert.ok(hoch.ersparnisLp > r.ersparnisLp);
    assert.ok(hoch.wirtschaft.amortisation < r.wirtschaft.amortisation);
  });
  test("ohne Speicher keine Kappung, keine Amortisation", () => {
    const o = peakShaving({ ...e, speicher: 0 }, reihen);
    assert.deepEqual(o.gekappt, o.spitzen);
    assert.equal(o.senkung, 0);
    assert.equal(o.wirtschaft.amortisation, null);
    assert.equal(o.wirtschaft.invest, 0);
  });
  test("Kappung über der Jahresspitze / negative Kappung", () => {
    const ueber = peakShaving({ ...e, kappung: 900, speicher: 0 }, reihen);
    assert.equal(ueber.ziel, 500);
    const neg = peakShaving({ ...e, kappung: -10, speicher: 0 }, reihen);
    assert.equal(neg.ziel, 0);
    endlich(neg);
  });
  test("Leistungsmessung: NE 7 unter 100.000 kWh und 50 kW nicht gemessen", () => {
    const klein = { verbrauch: 80000, spitzen: monatsspitzen(40), kappung: 35, schichten: 1, art: "anlauf", bereich: "ooe", ne: 7, kwp: 0, speicher: 0 };
    assert.equal(peakShaving(klein).gemessen, false);
    assert.equal(peakShaving({ ...klein, ne: 6 }).gemessen, true);
  });
  test("Teilen-Link: psParams → psAusParams ergibt dieselben Eingaben", () => {
    for (const p of PS_PRESETS) {
      const ein = { ...p, spitzen: monatsspitzen(p.spitze, p.form), speicher: 300, lp: 70.5 };
      const aus = psAusParams(getter(psParams(ein)));
      for (const k of ["verbrauch", "spitzen", "kappung", "schichten", "art", "bereich", "ne", "kwp", "speicher", "lp"]) assert.deepEqual(aus[k], ein[k], `${p.id}.${k}`);
    }
    assert.equal(psAusParams(getter("")), null);
    assert.equal(psAusParams(getter("v=1000&s=1-2-3")), null); // nicht 12 Monate
    const grenzen = psAusParams(getter(`v=5&s=${Array(12).fill(99999).join("-")}&ne=9&b=mars&art=x&lp=999`));
    assert.equal(grenzen.verbrauch, 20000);
    assert.equal(grenzen.spitzen[0], 20000);
    assert.equal(grenzen.ne, 6);
    assert.equal(grenzen.bereich, "ooe");
    assert.equal(grenzen.art, "mittel");
    assert.equal(grenzen.lp, 300);
    assert.equal(grenzen.speicher, null);
  });
});

// ---------------------------------------------------------------------------
describe("pacht (Freiflächen-/Agri-PV)", () => {
  test("Beispiel 2 ha Freifläche, 1.100 kWh/kWp, 1.500 €/ha, 2 % Index, 25 Jahre", () => {
    const r = rechnePacht({ hektar: 2, standort: STANDORT });
    assert.equal(r.kwp, 2000);
    assert.equal(r.ertragKwh, 2.2e6);
    nahe(r.haushalte, 2.2e6 / 3500, 1e-9);
    assert.equal(r.mwhProHa, 1100);
    assert.equal(r.pachtJahr1, 3000);
    nahe(r.pachtSumme, (3000 * (1.02 ** 25 - 1)) / 0.02, 1e-6); // geometrische Reihe
    assert.equal(r.pachtReihe.length, 25);
    assert.equal(r.pachtJeKwp, 1.5);
    assert.equal(r.tor, "B");
    nahe(r.co2Tonnen, (2.2e6 * PACHT.co2KgProKwh) / 1000, 1e-9);
  });
  test("Konzepte: Leistungsdichte und Ertragsbasis", () => {
    assert.equal(rechnePacht({ hektar: 1, standort: STANDORT, konzept: "agri-hoch" }).kwp, 600);
    const v = rechnePacht({ hektar: 1, standort: STANDORT, konzept: "agri-vertikal" });
    assert.equal(v.kwp, 400);
    assert.equal(v.spezifischerErtrag, 950);
    assert.equal(rechnePacht({ hektar: 1, standort: STANDORT, konzept: "x" }).konzept.id, "freiflaeche");
  });
  test("Index 0: Summe = Jahrespacht × Laufzeit; Laufzeit < 1 → 1 Jahr", () => {
    assert.equal(rechnePacht({ hektar: 3, standort: STANDORT, index: 0, laufzeit: 20, pachtEurHa: 1000 }).pachtSumme, 60000);
    assert.equal(rechnePacht({ hektar: 3, standort: STANDORT, laufzeit: 0 }).laufzeit, 1);
  });
  test("Randfälle 0 / negative Hektar", () => {
    for (const hektar of [0, -2, "abc"]) {
      const r = rechnePacht({ hektar, standort: STANDORT });
      assert.equal(r.kwp, 0);
      assert.equal(r.mwhProHa, 0);
      assert.equal(r.pachtJeKwp, 0);
      assert.equal(r.pachtSumme, 0);
      endlich(r);
    }
  });
  test("netzEinschaetzung: Faustregel-Stufen", () => {
    assert.equal(netzEinschaetzung(0.5, 100).stufe, "gut");
    assert.equal(netzEinschaetzung(2, 5000).stufe, "gut"); // 0,4 km je MWp
    assert.equal(netzEinschaetzung(3, 2000).stufe, "pruefen"); // 1,5 km je MWp
    assert.equal(netzEinschaetzung(5, 1000).stufe, "kritisch");
  });
  test(
    "Befund: EAG-Investitionszuschuss über 1.000 kWp – pacht.js sagt nein, eagZuschuss()/eagKategorie() fördern anteilig bis 1.000 kWp",
    { todo: "Befund tests-03: src/lib/rechner/pacht.js Z. 134 (eagInvestitionszuschuss: kwp <= 1000) widerspricht src/data/solarrechner.js eagZuschuss() und gewerbepv.eagKategorie()" },
    () => {
      const r = rechnePacht({ hektar: 2, standort: STANDORT });
      assert.equal(r.eagInvestitionszuschuss, eagZuschuss(r.kwp).summe > 0);
    }
  );
  test(
    "Befund: TOR-Typ bei 0 kWp – pacht.js liefert „A“, gewerbepv.torTyp() „–“ (unter 0,8 kW)",
    { todo: "Befund tests-04: src/lib/rechner/pacht.js Z. 117 (eigene TOR-Staffel ohne 0,8-kW-Grenze)" },
    () => {
      assert.equal(rechnePacht({ hektar: 0, standort: STANDORT }).tor, torTyp(0).typ);
    }
  );
});

// ---------------------------------------------------------------------------
describe("blackout (Ersatzstrom)", () => {
  const prod = { ...branche("produktion"), kwp: 300, speicher: 0, aggregat: true, jahreszeit: "winter", startStunde: 8 };

  test("kostenJeStunde: Deckungsbeitrag + Personal × Lohn", () => {
    assert.equal(kostenJeStunde(prod), 2500 + 40 * 45);
    assert.equal(kostenJeStunde({}), 0);
  });
  test("szenarioKosten: ohne Deckung kein Vorteil, volle Deckung spart", () => {
    const k = kostenJeStunde(prod);
    const ohne = szenarioKosten(prod, 8, 0);
    assert.equal(ohne.vermieden, 0);
    assert.equal(ohne.ohne, (8 + 4) * k + 15000 + 5000);
    const voll = szenarioKosten(prod, 8, Infinity);
    assert.equal(voll.offen, 0);
    assert.equal(voll.wareMit, 0);
    nahe(voll.mit, 8 * k * 0.8 + 4 * k * 0.8, 1e-9);
    assert.ok(voll.vermieden > 0);
    // negative Deckung wie 0
    assert.equal(szenarioKosten(prod, 8, -5).vermieden, 0);
  });
  test("szenarioKosten: Ware verdirbt erst ab der Verderbnisgrenze", () => {
    const kuehl = branche("kuehlhaus"); // verderb 6 h
    assert.equal(szenarioKosten(kuehl, 0.5, 0).wareOhne, 0);
    assert.equal(szenarioKosten(kuehl, 8, 0).wareOhne, 150000);
    assert.equal(szenarioKosten(kuehl, 8, 4).wareMit, 0); // nur 4 h offen
    assert.equal(szenarioKosten(kuehl, 48, 24).wareMit, 150000);
  });
  test("literJeKwh: Deutz-Kennlinie, Bestpunkt 75 %", () => {
    nahe(literJeKwh(0.75), 0.228 / (0.835 * 0.88), 1e-12);
    nahe(literJeKwh(0.1), literJeKwh(0.25), 1e-12); // unterhalb 25 % geklemmt
    nahe(literJeKwh(2), literJeKwh(1), 1e-12);
    assert.ok(literJeKwh(0.25) > literJeKwh(0.5)); // Teillast ist ineffizient
  });
  test("auslegung: Produktion 120 kW × 1,5 → 250-kVA-Aggregat", () => {
    const a = auslegung(prod);
    assert.equal(a.leistung, 180);
    assert.equal(a.kvaRoh, 225);
    assert.equal(a.kva, 250);
    assert.equal(a.aggregatKw, 200);
    nahe(a.mittlereLast, 72, 1e-9);
    nahe(a.energie, 576, 1e-9);
    nahe(a.speicherNur, 576 / (0.9 * 0.95), 1e-9);
    assert.equal(auslegung({ ...prod, last: 2000 }).kva, 3750); // über der Tabelle: auf 50 kVA gerundet
  });
  test("speicherVorschlag: 2 h mittlere Last, gerundet", () => {
    assert.equal(speicherVorschlag(prod), 170);
    assert.equal(speicherVorschlag({ last: 1, auslastung: 0.1 }), 5);
  });
  test("simuliereAusfall: Energiebilanz und Deckung", () => {
    const s = simuliereAusfall({ ...prod, speicher: 170 });
    const lastSumme = s.verlauf.reduce((a, v) => a + v.last, 0);
    nahe(s.energie.pv + s.energie.speicher + s.energie.aggregat + s.energie.offen, lastSumme, 1e-6);
    nahe(s.anteile.pv + s.anteile.speicher + s.anteile.aggregat + s.anteile.offen, 1, 1e-9);
    assert.equal(s.dauer, 8);
    assert.equal(s.vollGedeckt, true);
    assert.equal(deckungsdauer(s), Infinity);
    assert.ok(s.liter < s.nurAggregatLiter + 1e-9);
    assert.ok(s.verlauf.every((v) => v.soc >= -1e-9 && v.soc <= 1 + 1e-9));
  });
  test("simuliereAusfall: ohne Ersatzstrom sofort Lücke; mehr Speicher überbrückt länger", () => {
    const nichts = simuliereAusfall({ ...prod, kwp: 0, speicher: 0, aggregat: false });
    assert.equal(nichts.ueberbrueckt, 0);
    nahe(nichts.anteile.offen, 1, 1e-12);
    let vorher = -1;
    for (const speicher of [50, 150, 400, 1000]) {
      const s = simuliereAusfall({ ...prod, kwp: 0, speicher, aggregat: false, ziel: 24 });
      assert.ok(s.ueberbrueckt >= vorher, `${speicher} kWh`);
      vorher = s.ueberbrueckt;
    }
  });
  test("szenarien: drei Szenarien, ersatzstrom=false ohne Vorteil", () => {
    const s = simuliereAusfall({ ...prod, speicher: 170 });
    const sz = szenarien(prod, s);
    assert.deepEqual(sz.map((x) => x.id), ["kurz", "regional", "blackout"]);
    assert.ok(sz.every((x) => x.vermieden >= 0));
    assert.ok(szenarien({ ...prod, ersatzstrom: false }, s).every((x) => x.vermieden === 0));
  });
  test("Teilen-Link: boParams → boAusParams", () => {
    const ein = { ...prod, speicher: 120, startStunde: 18, jahreszeit: "sommer" };
    const aus = boAusParams(getter(boParams(ein)));
    for (const k of ["branche", "last", "ziel", "db", "personen", "lohn", "ware", "verderb", "wiederanlauf", "wiederanlaufKosten", "kwp", "speicher", "aggregat", "jahreszeit", "startStunde"]) {
      assert.deepEqual(aus[k], k === "branche" ? "produktion" : ein[k], k);
    }
    assert.equal(boAusParams(getter("")), null);
    const x = boAusParams(getter("b=unbekannt&l=-5&z=500&st=7&j=x&ag=0"));
    assert.equal(x.branche, BRANCHEN[0].id);
    assert.equal(x.last, 1);
    assert.equal(x.ziel, 72);
    assert.equal(x.startStunde, 8);
    assert.equal(x.jahreszeit, "winter");
    assert.equal(x.aggregat, false);
  });
});

// ---------------------------------------------------------------------------
describe("co2 (Scope 1/2)", () => {
  test("Faktoren aus den Annahmen", () => {
    assert.equal(CO2.lokFaktorG, 105.4);
    assert.equal(CO2.substitutionG, 258.2);
    nahe(CO2.pkwKgProKm, 0.1659, 1e-12);
  });
  test("nur Strombezug: Emissionen vorher = nachher", () => {
    const r = rechneCo2({ strombezugKwh: 100000 });
    nahe(r.scope2.location.vorher, 10540, 1e-9);
    nahe(r.scope2.market.vorher, 15000, 1e-9);
    assert.equal(r.scope2.location.reduktion, 0);
    assert.equal(r.gesamt.reduktionKg, 0);
  });
  test("PV-Eigenverbrauch senkt Scope 2 standortbasiert anteilig", () => {
    const r = rechneCo2({ strombezugKwh: 100000, pv: { kwp: 100, ertragProKwp: 1000, eigenverbrauchsquote: 0.5 } });
    assert.equal(r.pv.eigenverbrauch, 50000);
    assert.equal(r.pv.einspeisung, 50000);
    nahe(r.scope2.location.reduktion, 0.5, 1e-12);
    nahe(r.vermiedenEinspeisungKg, 50000 * 0.2582, 1e-9);
    // Eigenverbrauch höchstens der Verbrauch
    const gross = rechneCo2({ strombezugKwh: 10000, pv: { kwp: 100, eigenverbrauchsquote: 1 } });
    assert.equal(gross.pv.eigenverbrauch, 10000);
    assert.equal(gross.netz.nachher, 0);
  });
  test("Herkunftsnachweise 100 %: marktbasiert 0", () => {
    const r = rechneCo2({ strombezugKwh: 100000, oekoAnteil: 1 });
    assert.equal(r.scope2.market.nachher, 0);
    nahe(r.scope2.market.reduktion, 1, 1e-12);
    assert.equal(rechneCo2({ strombezugKwh: 1, oekoAnteil: 5 }).faktoren.oekoAnteil, 1);
  });
  test("Flotte: Scope 1 sinkt, Ladestrom aus PV-Überschuss", () => {
    const r = rechneCo2({
      strombezugKwh: 100000,
      pv: { kwp: 100, ertragProKwp: 1000, eigenverbrauchsquote: 0.5 },
      flotte: { fahrzeuge: 10, kmJeFahrzeug: 20000, literJe100: 8, anteilElektrisch: 0.5, kwhJe100: 20, pvLadeanteil: 1 },
    });
    nahe(r.scope1.vorher, 16000 * CO2.dieselKgProLiter, 1e-9);
    nahe(r.scope1.nachher, 8000 * CO2.dieselKgProLiter, 1e-9);
    assert.equal(r.flotte.ladestrom, 20000);
    assert.equal(r.flotte.ladestromPv, 20000);
    assert.equal(r.pv.einspeisung, 30000);
    assert.equal(r.netz.nachher, 50000);
    assert.ok(r.gesamt.reduktionKg > 0);
    nahe(r.aequivalent.pkwKm, r.gesamt.reduktionKg / CO2.pkwKgProKm, 1e-9);
  });
  test("Randfälle: 0 / negativ / Text", () => {
    for (const strombezugKwh of [0, -500, "x", undefined]) {
      const r = rechneCo2({ strombezugKwh, marktFaktorG: -20, lokFaktorG: -1 });
      assert.equal(r.verbrauch, 0);
      assert.equal(r.gesamt.reduktion, 0);
      endlich(r);
    }
  });
  test("textbaustein: nennt Firma, Jahr, Maßnahmen; kein NaN/undefined", () => {
    const r = rechneCo2({ strombezugKwh: 250000, oekoAnteil: 0.5, pv: { kwp: 150, eigenverbrauchsquote: 0.6 } });
    const t = textbaustein(r, { jahr: "2026", firma: "Muster GmbH" });
    assert.match(t, /^Muster GmbH bezog im Berichtsjahr 2026 rund 250\.000 kWh Strom\./);
    assert.match(t, /Photovoltaikanlage/);
    assert.match(t, /Herkunftsnachweisen/);
    assert.match(t, /GHG Protocol/);
    assert.doesNotMatch(t, /NaN|undefined/);
  });
});

// ---------------------------------------------------------------------------
describe("energiegemeinschaft", () => {
  test("verbrauchVon / teilnahme / arbeitspreisCt", () => {
    assert.equal(verbrauchVon({ typ: "haushalte", anzahl: 40, verbrauch: 3500 }), 140000);
    assert.equal(verbrauchVon({ typ: "betrieb", verbrauch: 60000 }), 60000);
    assert.equal(verbrauchVon({ typ: "betrieb" }), 0);
    assert.equal(teilnahme({ gross: true }, "lokal").ok, false);
    assert.equal(teilnahme({ gross: true }, "beg").ok, true);
    assert.equal(teilnahme({ ne: "5" }, "lokal").ok, false);
    assert.equal(teilnahme({ ne: "5" }, "regional").ok, true);
    assert.equal(arbeitspreisCt("ooe", "7n"), 6.29);
    assert.equal(arbeitspreisCt("ooe", "6"), 2.37);
    assert.equal(arbeitspreisCt("x", "7"), 4.68);
  });
  test("lastprofil: Jahressumme = Verbrauch, leer bei 0", () => {
    for (const t of [
      { typ: "haushalte", anzahl: 10, verbrauch: 3500 },
      { typ: "landwirtschaft", verbrauch: 60000 },
      { typ: "gemeinde", verbrauch: 85000 },
      { typ: "betrieb", verbrauch: 450000, schichten: 3 },
    ]) {
      const l = lastprofil(t);
      assert.equal(l.length, 8760);
      nahe(l.reduce((a, b) => a + b, 0), verbrauchVon(t), verbrauchVon(t) * 1e-9, t.typ);
    }
    assert.equal(lastprofil({ typ: "betrieb", verbrauch: 0 }).reduce((a, b) => a + b, 0), 0);
  });

  const preset = EG_PRESETS.find((p) => p.id === "gemeinde");
  const b = egBilanz(preset.teilnehmer, preset.modell);

  test("egBilanz: Energieerhaltung je Teilnehmer und Gemeinschaft", () => {
    for (const x of b.teilnehmer) {
      nahe(x.eigen + x.ueberschuss, x.erzeugung, 1e-6);
      nahe(x.eigen + x.restbedarf, x.verbrauch, 1e-6);
    }
    const geliefert = b.teilnehmer.reduce((s, x) => s + x.geliefert, 0);
    const bezogen = b.teilnehmer.reduce((s, x) => s + x.bezogen, 0);
    nahe(geliefert, bezogen, 1e-6);
    nahe(b.geteilt, geliefert, 1e-6);
    assert.ok(b.geteilt <= Math.min(b.ueberschuss, b.restbedarf) + 1e-6);
    nahe(b.monat.reduce((s, m) => s + m.geteilt, 0), b.geteilt, 1e-6);
    assert.ok(b.quoteUeberschuss > 0 && b.quoteUeberschuss <= 1);
    nahe(b.verbrauch, 85000 + 60000 + 140000, 1e-3);
    nahe(b.erzeugung, 180 * EG_ANNAHMEN.ertragProKwp * PV_SUMME, 1e-3); // 0,995 – Befund tests-01
  });
  test("egBilanz: nicht zugelassene Teilnehmer teilen nichts", () => {
    const t = [...preset.teilnehmer, { typ: "betrieb", verbrauch: 100000, kwp: 0, ne: "6", gross: true }];
    const x = egBilanz(t, "lokal");
    assert.equal(x.aktiv[3], false);
    assert.equal(x.teilnehmer[3].bezogen, 0);
  });
  test("egWirtschaft: Gesamtvorteil hängt nicht vom EG-Preis ab (nur Verteilung)", () => {
    const p = { teilnehmer: preset.teilnehmer, modell: "lokal", bereich: "ooe", energiepreisCt: 14, marktpreisCt: 7 };
    const w1 = egWirtschaft(b, { ...p, egPreisCt: 9 });
    const w2 = egWirtschaft(b, { ...p, egPreisCt: 12 });
    nahe(w1.gesamt, w2.gesamt, 1e-6);
    assert.ok(w2.erzeuger > w1.erzeuger);
    assert.ok(w2.energie < w1.energie);
    nahe(w1.winwinCt, 10.5, 1e-12);
    // EG-Preis = Energiepreis → Verbraucher sparen nur Netz und Abgabe
    const w3 = egWirtschaft(b, { ...p, egPreisCt: 14 });
    assert.equal(w3.energie, 0);
    // Netzkosten-Reduktion 57 % lokal auf NE 7
    const z = w1.zeilen[1];
    nahe(z.netzCt, 4.68 * 0.57, 1e-12);
    assert.equal(z.abgabeCt, EG_ANNAHMEN.elAbgabeCt.sonst);
  });
  test("egWirtschaft: BEG ohne Netz- und Abgabevorteil", () => {
    const bb = egBilanz(preset.teilnehmer, "beg");
    const w = egWirtschaft(bb, { teilnehmer: preset.teilnehmer, modell: "beg", bereich: "ooe", energiepreisCt: 14, marktpreisCt: 7, egPreisCt: 10 });
    assert.equal(w.netz, 0);
    assert.equal(w.abgabe, 0);
  });
  test("Teilen-Link: egParams → egAusParams", () => {
    for (const p of EG_PRESETS) {
      const qs = egParams({ teilnehmer: p.teilnehmer, modell: p.modell, bereich: p.bereich, energiepreisCt: 15, egPreisCt: 10 });
      const aus = egAusParams(getter(qs));
      assert.equal(aus.modell, p.modell);
      assert.equal(aus.bereich, p.bereich);
      assert.equal(aus.energiepreisCt, 15);
      assert.equal(aus.egPreisCt, 10);
      aus.teilnehmer.forEach((t, i) => {
        const o = p.teilnehmer[i];
        assert.equal(t.typ, o.typ);
        assert.equal(t.verbrauch, o.verbrauch);
        assert.equal(t.kwp, o.kwp);
        assert.equal(t.ne, o.ne);
        if (o.typ === "haushalte") assert.equal(t.anzahl, o.anzahl);
      });
    }
    assert.equal(egAusParams(getter("")), null);
    assert.equal(egAusParams(getter("t=z.1.2")), null);
    const x = egAusParams(getter("t=b.-5.99999.9.0.7.1&m=mond&e=999&p=-1"));
    assert.equal(x.teilnehmer[0].verbrauch, 0);
    assert.equal(x.teilnehmer[0].kwp, 5000);
    assert.equal(x.teilnehmer[0].ne, "7");
    assert.equal(x.teilnehmer[0].schichten, 3);
    assert.equal(x.teilnehmer[0].gross, true);
    assert.equal(x.modell, "lokal");
    assert.equal(x.energiepreisCt, 40);
    assert.equal(x.egPreisCt, null);
  });
});
