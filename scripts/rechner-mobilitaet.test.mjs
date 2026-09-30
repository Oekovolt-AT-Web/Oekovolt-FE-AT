// Tests für E-Flotte- und Ladeinfrastruktur-Rechner (reine Funktionen):
//   src/lib/rechner/eflotte.js · src/lib/rechner/ladeinfrastruktur.js
// Aufruf: node scripts/rechner-mobilitaet.test.mjs

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  FLOTTE,
  KLASSEN,
  KLASSEN_IDS,
  PRESETS,
  flotteAusParams,
  flotteQuery,
  flotteStandard,
  klasseStandard,
  ladepunkteEmpfehlung,
  presetEingaben,
  pvAnteilMoeglich,
  rechneFlotte,
  sachbezug,
  vorsteuerEPkw,
} from "../src/lib/rechner/eflotte.js";
import {
  DT,
  JAHRESZEITEN,
  LADE_PRESETS,
  SCHRITTE,
  fensterSchritte,
  gebaeudeLast,
  ladeAusParams,
  ladePresetEingaben,
  ladeQuery,
  ladeStandard,
  pvLeistung,
  rechneLadeinfrastruktur,
  spitzeKappen,
  taelerFuellen,
} from "../src/lib/rechner/ladeinfrastruktur.js";

const nahe = (ist, soll, tol, text = "") => assert.ok(Math.abs(ist - soll) <= tol, `${text} ${ist} ≠ ${soll} (±${tol})`);
const summe = (a) => a.reduce((s, v) => s + v, 0);
const keinNaN = (obj, pfad = "") => {
  if (typeof obj === "number") return assert.ok(!Number.isNaN(obj), `NaN bei ${pfad}`);
  if (obj && typeof obj === "object") for (const [k, v] of Object.entries(obj)) keinNaN(v, `${pfad}.${k}`);
};

// ---------------------------------------------------------------------------
describe("eflotte – Steuer- und Hilfsfunktionen", () => {
  test("vorsteuerEPkw: Luxustangente 40.000 / 80.000 € brutto", () => {
    const a = vorsteuerEPkw(36000);
    assert.equal(a.stufe, "voll");
    nahe(a.vorsteuer, 6000, 1e-9);
    nahe(a.netto, 30000, 1e-9);
    const b = vorsteuerEPkw(60000);
    assert.equal(b.stufe, "teilweise");
    nahe(b.vorsteuer, 40000 / 6, 1e-9); // max. 6.666,67 €
    nahe(b.netto, 60000 - 40000 / 6, 1e-9);
    assert.equal(vorsteuerEPkw(40000).stufe, "voll");
    assert.equal(vorsteuerEPkw(80000).stufe, "teilweise");
    assert.deepEqual(vorsteuerEPkw(80001), { vorsteuer: 0, stufe: "keine", netto: 80001 });
    assert.deepEqual(vorsteuerEPkw(0), { vorsteuer: 0, stufe: "voll", netto: 0 });
    assert.deepEqual(vorsteuerEPkw(-100), { vorsteuer: 0, stufe: "voll", netto: 0 });
  });
  test("sachbezug: Sätze und Höchstbeträge 2027/2028, Verbrenner 2 %", () => {
    assert.deepEqual(sachbezug(50000, 45000), { e2026: 0, e2027: 180, e2028: 300, verbrenner: 900 });
    const k = sachbezug(30000, 30000);
    nahe(k.e2027, 112.5, 1e-9);
    nahe(k.e2028, 187.5, 1e-9);
    assert.equal(k.verbrenner, 600);
    assert.equal(sachbezug(0, 0).verbrenner, 0);
  });
  test("pvAnteilMoeglich: nutzbarer PV-Anteil, gedeckelt auf 70 %", () => {
    nahe(pvAnteilMoeglich({ kwp: 50, betriebKwh: 100000 }), 0.275, 1e-12);
    assert.equal(pvAnteilMoeglich({ kwp: 1000, betriebKwh: 1000 }), FLOTTE.pvAnteilMax);
    assert.equal(pvAnteilMoeglich({ kwp: 0, betriebKwh: 1000 }), 0);
    assert.equal(pvAnteilMoeglich({ kwp: 50, betriebKwh: 0 }), 0);
    assert.equal(pvAnteilMoeglich({ kwp: -5, betriebKwh: -5 }), 0);
  });
  test("klasseStandard / presetEingaben", () => {
    assert.equal(klasseStandard("pkw", 3).n, 3);
    assert.equal(klasseStandard("lkw").achsen, 2);
    assert.equal(klasseStandard("pkw").achsen, undefined);
    const p = presetEingaben("logistik");
    assert.equal(p.preset, "logistik");
    assert.equal(p.transporter.n, 8);
    assert.equal(p.transporter.kwh, KLASSEN.transporter.kwh); // nicht überschriebene Werte bleiben Standard
    assert.equal(presetEingaben("unbekannt").preset, PRESETS[0].id);
  });
  test("ladepunkteEmpfehlung: AC 11 kW für Transporter, DC für Lkw", () => {
    const r = rechneFlotte(presetEingaben("logistik"));
    const l = r.lade;
    // Transporter: 30.000 km × 30 kWh/100 km × 95 % / 250 Tage = 34,2 kWh → 3,4 kW über 10 h
    assert.equal(l.ac11, 8);
    // Lkw: 60.000 km × 125 kWh/100 km × 95 % / 250 = 285 kWh → 28,5 kW → DC 50
    assert.equal(l.dc50, 4);
    assert.equal(l.punkte, 12);
    assert.equal(l.installiert, 8 * 11 + 4 * 50);
    assert.ok(l.mitLm <= l.installiert);
    assert.equal(l.kosten, 8 * FLOTTE.kostenAc + 4 * FLOTTE.kostenDc);
    assert.deepEqual(ladepunkteEmpfehlung({}, {}).punkte, 0);
  });
});

describe("eflotte – rechneFlotte", () => {
  const std = flotteStandard();
  const r = rechneFlotte(std);

  test("Standard (Handwerk): Summen, Reihen, kein NaN", () => {
    assert.equal(r.jahre, 6);
    assert.equal(r.reihe.length, 7);
    assert.equal(r.summe.n, 6);
    nahe(r.tcoErsparnis, r.tcoV - r.tcoE, 1e-9);
    nahe(r.summe.kwh, r.summe.kwhBetrieb + r.summe.kwhOeffentlich, 1e-6);
    nahe(r.summe.kwhBetrieb, r.summe.kwhPv + r.summe.kwhNetz, 1e-6);
    assert.ok(r.pvAnteil <= r.pvMax + 1e-12);
    assert.ok(r.co2Ersparnis > 0, "E-Flotte spart CO₂");
    keinNaN(r);
  });
  test("Break-even liegt dort, wo die TCO-Kurven sich schneiden", () => {
    assert.ok(r.breakEven != null && r.breakEven > 0 && r.breakEven <= r.jahre);
    const t0 = Math.floor(r.breakEven);
    const d = (t) => r.reihe[t].e - r.reihe[t].v;
    assert.ok(d(t0) > 0 && d(Math.ceil(r.breakEven)) <= 0);
  });
  test("Plausibilität: teurerer Diesel → mehr Ersparnis, früherer Break-even", () => {
    const teuer = rechneFlotte({ ...std, diesel: 2.8 });
    assert.ok(teuer.ersparnisJahr > r.ersparnisJahr);
    assert.ok(teuer.amortisation < r.amortisation);
  });
  test("Plausibilität: teurerer Strom → weniger Ersparnis", () => {
    const teuer = rechneFlotte({ ...std, stromCt: 35 });
    assert.ok(teuer.ersparnisJahr < r.ersparnisJahr);
    assert.ok(teuer.amortisation > r.amortisation);
  });
  test("Förderung und IFB senken die E-Kosten, Ladeinfrastruktur erhöht sie", () => {
    const f = rechneFlotte({ ...std, foerderung: 3000 });
    nahe(r.tcoE - f.tcoE, 6 * 3000 - (r.summe.el.ifb - f.summe.el.ifb), 1e-6);
    assert.ok(rechneFlotte({ ...std, ifb: false }).tcoE > r.tcoE);
    assert.ok(rechneFlotte({ ...std, infra: false }).tcoE < r.tcoE);
  });
  test("PV: ohne PV kein Solaranteil, dafür ein Vorschlag", () => {
    const o = rechneFlotte({ ...std, pv: false });
    assert.equal(o.pvAnteil, 0);
    assert.equal(o.summe.kwhPv, 0);
    assert.ok(o.pvVorschlag.kwp >= 20 && o.pvVorschlag.kwp <= 500);
    assert.ok(o.pvVorschlag.ersparnis > 0);
    assert.equal(r.pvVorschlag, null);
  });
  test("E-Pkw: Vorsteuer nach Luxustangente, Verbrenner-Pkw brutto", () => {
    const p = rechneFlotte({ ...std, pkw: { ...std.pkw, n: 2 }, transporter: { ...std.transporter, n: 0 } });
    const k = p.klassen.pkw;
    assert.equal(k.vst.stufe, "teilweise"); // 42.000 + 2.000 = 44.000 € brutto > 40.000 €
    nahe(k.el.anschaffung, 2 * (44000 - 40000 / 6), 1e-6);
    nahe(k.v.anschaffung, 2 * 42000, 1e-9); // Verbrenner-Pkw brutto (kein Vorsteuerabzug)
  });
  test("Lkw: GO-Maut Diesel vs. emissionsfrei (2 Achsen)", () => {
    const l = rechneFlotte({ ...std, pkw: { ...std.pkw, n: 0 }, transporter: { ...std.transporter, n: 0 }, lkw: klasseStandard("lkw", 1) });
    const k = l.klassen.lkw;
    nahe(k.v.maut, 30000 * 0.2724, 1e-6);
    nahe(k.el.maut, 30000 * 0.0587, 1e-6);
  });
  test("Randfälle: leere Flotte, negative Anzahl, fehlende Klassen", () => {
    const leer = rechneFlotte({ ...std, pkw: { ...std.pkw, n: 0 }, transporter: { ...std.transporter, n: -3 }, lkw: undefined });
    assert.equal(leer.summe.n, 0);
    assert.equal(leer.lade.punkte, 0);
    keinNaN(leer);
    assert.equal(rechneFlotte({ ...std, jahre: 0 }).jahre, FLOTTE.jahre); // 0 = nicht gesetzt → Standard
    assert.equal(rechneFlotte({ ...std, jahre: 0.4 }).jahre, 1);
  });
  test("Teilen-Link: flotteQuery → flotteAusParams für alle Presets", () => {
    for (const p of PRESETS) {
      const ein = presetEingaben(p.id);
      const aus = flotteAusParams(new URLSearchParams(flotteQuery(ein)));
      // Klassen mit n = 0 werden nicht übertragen und kommen als Standard zurück
      for (const id of KLASSEN_IDS) if (ein[id].n > 0) assert.deepEqual(aus[id], ein[id], `${p.id}.${id}`);
      for (const k of ["preset", "pkwKraftstoff", "diesel", "benzin", "stromCt", "oeffentlichCt", "ladeanteil", "pv", "kwp", "pvAnteil", "jahre", "foerderung", "ifb", "steuersatz", "infra"]) {
        assert.deepEqual(aus[k], ein[k], `${p.id}.${k}`);
      }
    }
  });
  test("flotteAusParams: Grenzen und ungültige Werte", () => {
    assert.equal(flotteAusParams({}), null);
    const x = flotteAusParams({ pn: "9999", pk: "1", kf: "wasserstoff", d: "99", st: "17", z: "fantasie", so: "0", j: "40", ly: "7" });
    assert.equal(x.pkw.n, 500);
    assert.equal(x.pkw.km, KLASSEN.pkw.grenzen.km[0]);
    assert.equal(x.pkwKraftstoff, "diesel");
    assert.equal(x.diesel, 3);
    assert.equal(x.steuersatz, 23);
    assert.equal(x.preset, "individuell");
    assert.equal(x.pv, false);
    assert.equal(x.jahre, 12);
    assert.equal(x.lkw.achsen, 2);
  });
});

// ---------------------------------------------------------------------------
describe("ladeinfrastruktur – Hilfsfunktionen", () => {
  test("fensterSchritte: Viertelstunden, auch über Mitternacht", () => {
    assert.equal(SCHRITTE * DT, 24);
    const nacht = fensterSchritte([17, 7]);
    assert.equal(nacht.length, 56);
    assert.equal(nacht[0], 68);
    assert.equal(nacht.at(-1), 27);
    assert.equal(fensterSchritte([0, 24]).length, 96);
    assert.equal(fensterSchritte([7.5, 16.5]).length, 36);
    assert.equal(fensterSchritte([8, 8]).length, 96); // gleiche Zeit = ganzer Tag
  });
  test("gebaeudeLast: Spitze erreicht, Grundlast 25 %", () => {
    const b = gebaeudeLast(100, "buero");
    assert.equal(b.length, 96);
    nahe(Math.max(...b), 100, 1e-9);
    nahe(Math.min(...b), 25, 1e-9);
    const d = gebaeudeLast(100, "dauer");
    assert.ok(Math.min(...d) >= 80 - 1e-9);
    assert.deepEqual(gebaeudeLast(50, "x"), gebaeudeLast(50, "buero"));
    assert.ok(gebaeudeLast(0).every((v) => v === 0));
  });
  test("pvLeistung: Tagesenergie = kWp × Tagesertrag der Jahreszeit", () => {
    for (const j of Object.keys(JAHRESZEITEN)) {
      nahe(summe(pvLeistung(100, j)) * DT, 100 * JAHRESZEITEN[j].kwhProKwp, 1e-9, j);
    }
    // Juni-Anteil 0,13 aus PV_MONAT, seit Befund tests-01 auf Summe 1 normiert (÷ 0,995)
    nahe(JAHRESZEITEN.sommer.kwhProKwp, ((0.13 / 0.995) * 1100) / 30, 1e-12);
    assert.ok(summe(pvLeistung(0)) === 0 && summe(pvLeistung(-5)) === 0);
    assert.equal(pvLeistung(100, "sommer")[0], 0); // Mitternacht
  });
  test("taelerFuellen: Energie erhalten, Leistung begrenzt, Täler zuerst", () => {
    const basis = Array.from({ length: 96 }, (_, i) => (i >= 28 && i < 72 ? 100 : 20));
    const schritte = fensterSchritte([17, 7]);
    const r = taelerFuellen(basis, schritte, 300, 50);
    nahe(summe(r.last) * DT, 300, 1e-6);
    assert.equal(r.fehlt, 0);
    assert.ok(r.last.every((v) => v <= 50 + 1e-9));
    assert.ok(r.last.every((v, i) => v === 0 || schritte.includes(i)));
    // unmöglich: mehr Energie als Fenster × Leistung
    const u = taelerFuellen(basis, [0, 1, 2, 3], 100, 10);
    nahe(u.fehlt, 100 - 4 * 10 * DT, 1e-9);
    assert.equal(taelerFuellen(basis, schritte, 0, 50).fehlt, 0);
    assert.equal(taelerFuellen(basis, [], 100, 50).fehlt, 0);
  });
  test("spitzeKappen: Speicher senkt die Spitze, ohne Speicher unverändert", () => {
    const netz = Array.from({ length: 96 }, (_, i) => (i >= 40 && i < 48 ? 200 : 80));
    const ohne = spitzeKappen(netz, 0, 0);
    assert.deepEqual(ohne.netz, netz);
    assert.equal(ohne.grenze, 200);
    const mit = spitzeKappen(netz, 200, 100);
    assert.ok(Math.max(...mit.netz) < 200);
    assert.ok(Math.max(...mit.netz) <= mit.grenze + 1e-6);
    // Tagesenergie bleibt (zyklischer Ladezustand, verlustfrei gerechnet)
    nahe(summe(mit.netz), summe(netz), 1);
  });
});

describe("ladeinfrastruktur – rechneLadeinfrastruktur", () => {
  const std = ladeStandard();
  const r = rechneLadeinfrastruktur(std);

  test("Standard: 22 AC-11-kW-Punkte, Energie und Status", () => {
    assert.equal(r.punkte.ac11, 22);
    assert.equal(r.punkteGesamt, 22);
    assert.equal(r.installiert, 242);
    nahe(r.energieTag, 10 * 26.4 + 12 * 9, 1e-9);
    assert.ok(["ok", "knapp", "erhoehen"].includes(r.status));
    assert.ok(r.kosten.min <= r.kosten.max);
    assert.ok(r.pvAnteil >= 0 && r.pvAnteil <= 1);
    assert.ok(r.hinweise.some((h) => h.ton === "pflicht"));
    keinNaN(r);
  });
  test("Lastmanagement senkt die Spitze und lädt die ganze Energie", () => {
    assert.ok(r.spitze.lm <= r.spitze.ohne + 1e-6);
    assert.ok(r.spitze.lmTag <= r.spitze.ohneTag + 1e-6);
    nahe(summe(r.kurven.lm.laden) * DT, r.energieTag - r.fehlt, 1e-3);
    nahe(summe(r.kurven.ohne.laden) * DT, r.energieTag, 1e-3);
    assert.ok(r.vermieden.kw >= 0);
  });
  test("Speicher senkt die Auslegungsspitze", () => {
    const s = rechneLadeinfrastruktur({ ...std, speicherKwh: 200 });
    assert.ok(s.spitze.speicher <= s.spitze.lm + 1e-6);
    assert.equal(s.auslegung, s.spitze.speicher);
    assert.ok(s.kosten.posten.some((p) => p.id === "speicher"));
  });
  test("Flotte mit hohem Tagesbedarf bekommt 22 kW bzw. DC 50", () => {
    // 400 km × 30 kWh/100 km = 120 kWh in 9 h − 1,5 h Ankunft = 7,5 h → 16 kW → AC 22
    const x = rechneLadeinfrastruktur({ ...std, flotte: { ...std.flotte, km: 400, verbrauch: 30, standzeit: "spaet" } });
    assert.equal(x.gruppen.find((y) => y.id === "flotte").kw, 22);
    assert.ok(x.hinweise.some((h) => /AC 22 kW/.test(h.text)));
    // 500 km × 40 kWh/100 km = 200 kWh / 7,5 h ≈ 26,7 kW → DC 50
    const y = rechneLadeinfrastruktur({ ...std, flotte: { ...std.flotte, km: 500, verbrauch: 40, standzeit: "spaet" } });
    assert.equal(y.gruppen.find((g) => g.id === "flotte").kw, 50);
    assert.equal(y.punkte.dc50, 10);
  });
  test("Kundenladen: Ladepunkte mit Reserve, Hinweis Eichrecht", () => {
    const k = rechneLadeinfrastruktur(ladePresetEingaben("handel"));
    const g = k.gruppen.find((x) => x.id === "kunden");
    assert.ok(g.punkte >= 1);
    assert.equal(g.kwhTag, 40 * 20);
    assert.ok(k.hinweise.some((h) => /Eich/.test(h.text)));
  });
  test("zu kleiner Anschluss → Erhöhung, Kosten für Netzbereitstellung", () => {
    const x = rechneLadeinfrastruktur({ ...std, anschlussKw: 20 });
    assert.equal(x.status, "erhoehen");
    assert.ok(x.erhoehungKw > 0 && x.erhoehungKw % 5 === 0);
    assert.ok(x.kosten.posten.some((p) => p.id === "nbe"));
  });
  test("Randfälle: alles aus, 0/negative Werte", () => {
    const leer = rechneLadeinfrastruktur({ ...std, flotte: { an: false }, mitarbeitende: { an: false }, kunden: { an: false }, kwp: -5, gebaeudeKw: -10, anschlussKw: 0 });
    assert.equal(leer.punkteGesamt, 0);
    assert.equal(leer.energieTag, 0);
    assert.equal(leer.pvAnteil, 0);
    assert.equal(leer.anschluss, 1);
    keinNaN(leer);
    assert.equal(rechneLadeinfrastruktur({ ...std, acKw: 17 }).acKw, 11);
  });
  test("Teilen-Link: ladeQuery → ladeAusParams für alle Presets", () => {
    for (const p of LADE_PRESETS) {
      const ein = ladePresetEingaben(p.id);
      assert.deepEqual(ladeAusParams(new URLSearchParams(ladeQuery(ein))), ein, p.id);
    }
    assert.equal(ladeAusParams({}), null);
    const x = ladeAusParams({ fn: "-4", fk: "9999", fs: "mond", ac: "22", an: "1", jz: "herbst", z: "x" });
    assert.equal(x.flotte.n, 0);
    assert.equal(x.flotte.km, 500);
    assert.equal(x.flotte.standzeit, "nacht");
    assert.equal(x.acKw, 22);
    assert.equal(x.anschlussKw, 10);
    assert.equal(x.jahreszeit, "uebergang");
    assert.equal(x.preset, "individuell");
  });
});
