// Tests für src/lib/einspeisung.js und die Daten in src/data/oemag.js
// Aufruf: node scripts/einspeisung.test.mjs
import assert from "node:assert/strict";
import {
  ctText,
  datenFrische,
  datumText,
  dezimal,
  erloesProJahr,
  erloesSzenarien,
  euroText,
  gewichtetesMittel,
  grenzMonate,
  korridorFuer,
  lageImKorridor,
  letzterMonat,
  mittel,
  monatLabel,
  neuesterKorridor,
  oemagMoeglich,
  quartalVon,
  spanne,
  tageSeit,
  werteImZeitraum,
  zahlAusText,
} from "../src/lib/einspeisung.js";
import { OEMAG_MONATE, PV_PROFIL, QUARTALSPREISE, REFERENZMARKTWERT_PV, STAND } from "../src/data/oemag.js";

const nah = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);
let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  console.log(`ok ${n} – ${name}`);
};

// ------------------------------------------------------------ Daten
test("Monatswerte lückenlos Jänner 2024 bis August 2026, aufsteigend", () => {
  assert.equal(OEMAG_MONATE.length, 32);
  assert.equal(OEMAG_MONATE[0].monat, "2024-01");
  assert.equal(letzterMonat().monat, "2026-08");
  for (let i = 1; i < OEMAG_MONATE.length; i++) {
    const [j0, m0] = OEMAG_MONATE[i - 1].monat.split("-").map(Number);
    const [j1, m1] = OEMAG_MONATE[i].monat.split("-").map(Number);
    assert.equal(j1 * 12 + m1, j0 * 12 + m0 + 1, `Lücke nach ${OEMAG_MONATE[i - 1].monat}`);
  }
  assert.deepEqual(REFERENZMARKTWERT_PV.map((r) => r.monat), OEMAG_MONATE.map((r) => r.monat));
  assert.equal(PV_PROFIL.monate.length, 12);
});

test("Jeder Monatswert passt zur Grundlage laut OeMAG (Korridor aus E-Control-Quartalspreisen)", () => {
  for (const w of OEMAG_MONATE) {
    const k = korridorFuer(w.monat);
    assert.ok(k, `kein Quartalspreis für ${w.monat}`);
    assert.ok(w.ct >= k.unter - 0.0011 && w.ct <= k.ober + 0.0011, `${w.monat} außerhalb des Korridors`);
    assert.equal(lageImKorridor(w.ct, k), w.grundlage, `${w.monat}: berechnet ${lageImKorridor(w.ct, k)}, OeMAG ${w.grundlage}`);
  }
});

test("Einzelwerte aus den Primärquellen", () => {
  const wert = (m) => OEMAG_MONATE.find((x) => x.monat === m).ct;
  assert.equal(wert("2024-09"), 6.038); // PDF 2024
  assert.equal(wert("2025-08"), 5.892); // PDF 2025
  assert.equal(wert("2026-08"), 8.997); // oem-ag.at
  assert.equal(QUARTALSPREISE.at(-1).quartal, "2026-Q4");
  assert.equal(QUARTALSPREISE.at(-1).ct, 15.282); // 152,82 €/MWh
});

// ------------------------------------------------------------ Korridor
test("Korridor und Quartal", () => {
  assert.equal(quartalVon("2026-08"), "2026-Q3");
  assert.equal(quartalVon("2026-10"), "2026-Q4");
  assert.equal(quartalVon("2024-03"), "2024-Q1");
  const k = korridorFuer("2026-07");
  nah(k.unter, 6.1458);
  nah(k.ober, 10.515);
  const k24 = korridorFuer("2024-04");
  nah(k24.unter, 4.6548);
  assert.equal(k24.abzug, 0);
  assert.equal(korridorFuer("2027-01"), null);
  assert.equal(lageImKorridor(8.997, k), "day-ahead");
  assert.equal(lageImKorridor(NaN, k), null);
});

test("Neuester Korridor Q4/2026", () => {
  const k = neuesterKorridor();
  assert.deepEqual(k.monate, ["2026-10", "2026-11", "2026-12"]);
  nah(k.unter, 0.6 * 15.282 - 0.408);
  nah(k.ober, 15.282 - 0.408);
  assert.equal(ctText(k.unter), "8,761");
  assert.equal(ctText(k.ober), "14,874");
  assert.equal(k.abzugBekannt, true);
  // Jahr ohne bekannten Abzug
  const k27 = neuesterKorridor([...QUARTALSPREISE, { quartal: "2027-Q1", ct: 10 }]);
  assert.equal(k27.abzugBekannt, false);
});

// ------------------------------------------------------------ Zeiträume
test("Zeiträume, Mittelwerte, Spanne", () => {
  const z12 = werteImZeitraum(OEMAG_MONATE, "12m");
  assert.equal(z12.length, 12);
  assert.equal(z12[0].monat, "2025-09");
  assert.equal(werteImZeitraum(OEMAG_MONATE, "2025").length, 12);
  assert.equal(werteImZeitraum(OEMAG_MONATE, "2026").length, 8);
  nah(mittel([{ ct: 4 }, { ct: 6 }]), 5);
  assert.ok(Number.isNaN(mittel([])));
  // Gewichtung: Juli (133) zählt mehr als Jänner (48)
  const g = gewichtetesMittel([{ monat: "2026-01", ct: 10 }, { monat: "2026-07", ct: 4 }]);
  nah(g, (10 * 48 + 4 * 133) / (48 + 133));
  // Gleichverteilung = einfacher Mittelwert
  nah(gewichtetesMittel(z12, Array(12).fill(1)), mittel(z12));
  // Sommer-Untergrenze drückt das gewichtete Mittel unter das einfache
  assert.ok(gewichtetesMittel(z12) < mittel(z12));
  const s = spanne(z12);
  assert.equal(s.min.monat, "2026-03");
  assert.equal(s.max.ct, 9.167);
  assert.equal(grenzMonate(werteImZeitraum(OEMAG_MONATE, "2026"), "untergrenze"), 4);
});

// ------------------------------------------------------------ Erlös
test("Erlös pro Jahr", () => {
  assert.deepEqual(erloesProJahr({ kwh: 100000, ct: 7 }), { eur: 7000, ctNetto: 7 });
  nah(erloesProJahr({ kwh: 250000, ct: 6.5, entgelt: 0.5 }).eur, 15000);
  assert.equal(erloesProJahr({ kwh: 0, ct: 7 }).eur, 0);
  assert.equal(erloesProJahr({ kwh: -5, ct: 7 }).eur, 0);
  assert.equal(erloesProJahr({ kwh: NaN, ct: 7 }).eur, 0);
  assert.equal(erloesProJahr({ kwh: 1000, ct: "x" }).eur, 0);
});

test("Szenarien und 500-kWp-Grenze", () => {
  assert.equal(oemagMoeglich(499.9), true);
  assert.equal(oemagMoeglich(500), false);
  assert.equal(oemagMoeglich(""), true);
  const s = erloesSzenarien({ kwh: 100000, kwp: 200, zeitraum: "12m", entgelt: 0.5 });
  const om = s.find((x) => x.id === "oemag");
  const sp = s.find((x) => x.id === "spot");
  assert.equal(om.moeglich, true);
  assert.equal(om.monate, 12);
  nah(om.eur, om.ct * 1000);
  nah(om.von, 5.72 * 1000);
  nah(om.bis, 9.167 * 1000);
  assert.ok(om.von <= om.eur && om.eur <= om.bis);
  nah(sp.ct, sp.brutto - 0.5);
  nah(sp.eur, sp.ct * 1000);
  assert.equal(s.length, 2);
  const mitEigen = erloesSzenarien({ kwh: 100000, kwp: 800, eigenCt: 7.25 });
  assert.equal(mitEigen.find((x) => x.id === "oemag").moeglich, false);
  nah(mitEigen.find((x) => x.id === "eigen").eur, 7250);
  assert.equal(erloesSzenarien({ kwh: 1, kwp: 1, eigenCt: 0 }).length, 2);
  assert.equal(erloesSzenarien({ kwh: 1, kwp: 1, eigenCt: "" }).length, 2);
  // Jahr 2024 nutzt nur Werte aus 2024
  assert.equal(erloesSzenarien({ kwh: 1, kwp: 1, zeitraum: "2024" })[0].monate, 12);
});

// ------------------------------------------------------------ Datenfrische
test("Datenfrische und Warnung nach 35 Tagen", () => {
  const T = (s) => Date.parse(s);
  assert.equal(tageSeit("2026-09-30", T("2026-09-30T12:00:00+02:00")), 0);
  assert.equal(tageSeit("2026-09-30", T("2026-11-04T09:00:00+01:00")), 35);
  assert.equal(datenFrische("2026-09-30", T("2026-11-04T09:00:00+01:00")).veraltet, false);
  assert.equal(datenFrische("2026-09-30", T("2026-11-05T09:00:00+01:00")).veraltet, true);
  // kurz nach Mitternacht Wiener Zeit zählt schon der neue Tag
  assert.equal(tageSeit("2026-09-30", T("2026-10-01T00:30:00+01:00")), 1);
  assert.equal(datenFrische("kaputt", T("2026-10-01T00:00:00Z")).veraltet, true);
  assert.equal(datenFrische(STAND.geprueftAm, T("2026-09-30T10:00:00+02:00")).tage, 0);
});

// ------------------------------------------------------------ Formatierung
test("Formatierung ohne Intl", () => {
  assert.equal(dezimal(1234567.891, 2), "1.234.567,89");
  assert.equal(dezimal(-0.0004, 3), "0,000");
  assert.equal(dezimal(-2.5, 1), "−2,5");
  assert.equal(dezimal(NaN), "–");
  assert.equal(ctText(8.997), "8,997");
  assert.equal(ctText(8.7), "8,700");
  assert.equal(euroText(12345.6), "12.346 €");
  assert.equal(euroText(999.4), "999 €");
  assert.equal(monatLabel("2026-08"), "August 2026");
  assert.equal(monatLabel("2025-01", true), "Jän 25");
  assert.equal(monatLabel("quatsch"), "quatsch");
  assert.equal(datumText("2026-09-30"), "30.09.2026");
  assert.equal(zahlAusText("12.500"), 12500);
  assert.equal(zahlAusText("8,5"), 8.5);
  assert.equal(zahlAusText("1.250.000"), 1250000);
  assert.equal(zahlAusText("7.25"), 7.25);
  assert.equal(zahlAusText("1.234,5"), 1234.5);
  assert.ok(Number.isNaN(zahlAusText("")));
  assert.ok(Number.isNaN(zahlAusText("abc")));
});

console.log(`\n${n} Testgruppen bestanden.`);
