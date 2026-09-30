// Tests für src/lib/prognose/* – Aufruf: node scripts/prognose.test.mjs
// Referenzwerte: einfache Handrechnungen bzw. bekannte Sonnenstände (Äquinoktium, Sonnenaufgang Salzburg).
import assert from "node:assert/strict";
import { sonnenstand, extraterrestrisch, cosEinfall, intervallGeometrie, SOLARKONSTANTE } from "../src/lib/prognose/sonne.js";
import { erbsDiffusanteil, aufteilen, transposition, modulTemperatur, leistungKw, azimutVonNord, teilflaechen, stundeRechnen, prognoseRechnen, ANNAHMEN } from "../src/lib/prognose/modell.js";
import { preiseJeStunde, tagesSummen, goldeneStunden, zelle } from "../src/lib/prognose/auswertung.js";
import { neuesBudget } from "../src/lib/prognose/budget.js";
import { zahl, wienZeit, intervall } from "../src/lib/prognose/format.js";
import { antwortLesen, reihenVerbinden } from "../src/lib/prognose/geosphere.js";

const nahe = (a, b, tol, text) => assert.ok(Math.abs(a - b) <= tol, `${text}: ${a} ≠ ${b} (±${tol})`);
const T = (s) => Date.parse(s);
let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  console.log(`ok ${n} – ${name}`);
};

/* ---------------------------------------------------------------- Sonnenstand */
test("Äquator, Äquinoktium, Mittag: Sonne fast im Zenit", () => {
  // 20.03.2026 um 12:07 UTC am Nullmeridian ≈ wahrer Mittag (Zeitgleichung ≈ −7,5 min)
  const s = sonnenstand(T("2026-03-20T12:07:00Z"), 0, 0);
  nahe(s.zenit, 0, 1.0, "Zenit");
});

test("48° N am Äquinoktium, wahrer Mittag: Zenit ≈ 48°, Azimut ≈ 180°", () => {
  // Ostermiething 12,83° O → wahrer Mittag ≈ 12:00 − 51,3 min + 7,5 min ≈ 11:16 UTC
  const s = sonnenstand(T("2026-03-20T11:16:00Z"), 48, 12.83);
  nahe(s.zenit, 48, 0.7, "Zenit");
  nahe(s.azimut, 180, 2, "Azimut");
});

test("Vormittag Ost-Hälfte, Nachmittag West-Hälfte", () => {
  assert.ok(sonnenstand(T("2026-06-21T06:00:00Z"), 48, 13).azimut < 180);
  assert.ok(sonnenstand(T("2026-06-21T16:00:00Z"), 48, 13).azimut > 180);
});

test("Sonnenaufgang Salzburg 30.09.2026 gegen 05:05 UTC (07:05 MESZ)", () => {
  // Suche des Minutenzeitpunkts, an dem die Sonnenhöhe die Horizontlinie (−0,833° inkl. Refraktion) kreuzt
  let t = T("2026-09-30T04:00:00Z");
  while (sonnenstand(t, 47.8, 13.04).hoehe < -0.833) t += 60000;
  nahe((t - T("2026-09-30T05:05:00Z")) / 60000, 0, 6, "Minuten Abweichung");
});

test("Extraterrestrik: Jahresgang ±3,3 % um die Solarkonstante", () => {
  nahe(extraterrestrisch(T("2026-01-03T12:00:00Z")), SOLARKONSTANTE * 1.033, 2, "Perihel");
  nahe(extraterrestrisch(T("2026-07-04T12:00:00Z")), SOLARKONSTANTE * 0.967, 2, "Aphel");
});

test("Einfallswinkel: Modul senkrecht zur Sonne → cos = 1, horizontal → cos Zenit", () => {
  nahe(cosEinfall(30, 180, 30, 180), 1, 1e-9, "senkrecht");
  nahe(cosEinfall(60, 120, 0, 180), 0.5, 1e-9, "horizontal");
});

test("Intervallgeometrie: horizontale Fläche hat rb = 1, Nacht liefert 0", () => {
  const g = intervallGeometrie({ vonMs: T("2026-06-21T10:00:00Z"), bisMs: T("2026-06-21T11:00:00Z"), lat: 48, lon: 13, neigung: 0 });
  nahe(g.rb, 1, 1e-9, "rb");
  const nacht = intervallGeometrie({ vonMs: T("2026-06-21T22:00:00Z"), bisMs: T("2026-06-21T23:00:00Z"), lat: 48, lon: 13, neigung: 30 });
  assert.equal(nacht.cosZ, 0);
  assert.equal(nacht.rb, 0);
});

/* ---------------------------------------------------------------- Strahlungsmodell */
test("Erbs: Stützwerte und Stetigkeit bei kt = 0,22 und 0,8", () => {
  nahe(erbsDiffusanteil(0.1), 0.991, 1e-9, "kt 0,1");
  nahe(erbsDiffusanteil(0.9), 0.165, 1e-9, "kt 0,9");
  nahe(erbsDiffusanteil(0.22), erbsDiffusanteil(0.2200001), 1e-3, "Stetigkeit 0,22");
  nahe(erbsDiffusanteil(0.8), 0.165, 0.01, "Stetigkeit 0,8");
  assert.equal(erbsDiffusanteil(0), 1);
});

test("Aufteilung: Summe bleibt GHI, tiefer Sonnenstand → rein diffus", () => {
  const a = aufteilen({ ghi: 700, g0h: 1000, cosZ: 0.7 });
  nahe(a.dhi + a.bhi, 700, 1e-9, "Summe");
  nahe(a.kt, 0.7, 1e-9, "kt");
  const tief = aufteilen({ ghi: 20, g0h: 40, cosZ: 0.03 });
  assert.deepEqual([tief.dhi, tief.bhi], [20, 0]);
});

test("Transposition: horizontales Modul = GHI (beide Modelle)", () => {
  for (const modell of ["isotrop", "hay-davies"]) {
    const g = transposition({ ghi: 600, dhi: 200, bhi: 400, rb: 1, g0h: 900, neigung: 0, modell });
    nahe(g.gesamt, 600, 1e-9, modell);
  }
});

test("Transposition: reine Direktstrahlung, Modul senkrecht zur Sonne (Handrechnung)", () => {
  // Zenit 30°, Modul 30° zur Sonne gedreht → rb = 1/cos30° = 1,1547; Boden: 1000·0,2·(1−cos30°)/2 = 13,40
  const rb = 1 / Math.cos((30 * Math.PI) / 180);
  const g = transposition({ ghi: 1000, dhi: 0, bhi: 1000, rb, g0h: 1180, neigung: 30, modell: "isotrop" });
  nahe(g.gesamt, 1154.7 + 13.4, 0.2, "gesamt");
});

test("Transposition: reine Diffusstrahlung, senkrechte Fassade isotrop = D/2 + Bodenreflexion", () => {
  const g = transposition({ ghi: 200, dhi: 200, bhi: 0, rb: 0, g0h: 500, neigung: 90, modell: "isotrop", albedo: 0.2 });
  nahe(g.gesamt, 100 + 20, 1e-9, "Fassade");
  // Hay-Davies mit bhi = 0 → Ai = 0 → identisch mit isotrop
  const h = transposition({ ghi: 200, dhi: 200, bhi: 0, rb: 0, g0h: 500, neigung: 90, modell: "hay-davies", albedo: 0.2 });
  nahe(h.gesamt, 120, 1e-9, "Hay-Davies ohne Direktanteil");
});

test("Hay-Davies hebt bei klarem Himmel die sonnenzugewandte Fläche über isotrop", () => {
  const basis = { ghi: 800, dhi: 150, bhi: 650, rb: 1.3, g0h: 1000, neigung: 30 };
  assert.ok(transposition({ ...basis, modell: "hay-davies" }).gesamt > transposition({ ...basis, modell: "isotrop" }).gesamt);
});

test("Modultemperatur und Leistung (Handrechnung)", () => {
  nahe(modulTemperatur(25, 1000, 0.03), 55, 1e-9, "Ross");
  // STC: 10 kWp, 1000 W/m², 25 °C, ohne Verluste → 10 kW
  nahe(leistungKw({ gModul: 1000, tModul: 25, kwp: 10, verluste: 0 }), 10, 1e-9, "STC");
  // 55 °C, −0,35 %/K → Faktor 0,895; 14 % Verluste → 10 · 0,895 · 0,86 = 7,697 kW
  nahe(leistungKw({ gModul: 1000, tModul: 55, kwp: 10, tempKoeff: -0.0035, verluste: 0.14 }), 7.697, 1e-3, "warm");
  // Begrenzung auf kWp (Kälte + hohe Einstrahlung)
  nahe(leistungKw({ gModul: 1200, tModul: 0, kwp: 10, verluste: 0 }), 10, 1e-9, "Begrenzung");
  assert.equal(leistungKw({ gModul: 0, tModul: 10, kwp: 10 }), 0);
});

test("Azimut-Umrechnung und Ost-West-Teilung", () => {
  assert.equal(azimutVonNord(0), 180);
  assert.equal(azimutVonNord(-90), 90);
  assert.equal(azimutVonNord(90), 270);
  const t = teilflaechen({ kwp: 100, neigung: 10, azimut: "ost-west" });
  assert.deepEqual(t.map((f) => [f.kwp, f.azimut]), [[50, -90], [50, 90]]);
});

test("Stunde: Nacht = 0 kW, Mittag Süd > Mittag Nord, Leistung ≤ kWp", () => {
  const basis = { lat: 48.05, lon: 12.83, tLuft: 15, anlage: { kwp: 100, neigung: 30, azimut: 0 } };
  const nacht = stundeRechnen({ ...basis, vonMs: T("2026-09-30T20:00:00Z"), bisMs: T("2026-09-30T21:00:00Z"), ghi: 0 });
  assert.equal(nacht.kw, 0);
  const mittag = { vonMs: T("2026-09-30T10:30:00Z"), bisMs: T("2026-09-30T11:30:00Z"), ghi: 600 };
  const sued = stundeRechnen({ ...basis, ...mittag });
  const nord = stundeRechnen({ ...basis, ...mittag, anlage: { kwp: 100, neigung: 30, azimut: 180 } });
  assert.ok(sued.kw > nord.kw, "Süd > Nord");
  assert.ok(sued.kw <= 100);
  // Plausibel: 600 W/m² horizontal Ende September → Modulebene 30° Süd deutlich darüber
  assert.ok(sued.gModul > 700 && sued.gModul < 950, `gModul ${sued.gModul}`);
});

test("Prognose über Stunden inkl. Band; Band bleibt geordnet", () => {
  const stunden = [
    { ende: T("2026-09-30T11:00:00Z"), ghi: 500, ghiP10: 200, ghiP90: 650, t2m: 18 },
    { ende: T("2026-09-30T12:00:00Z"), ghi: 550, ghiP10: null, ghiP90: null, t2m: 19 },
  ];
  const r = prognoseRechnen({ stunden, lat: 48.05, lon: 12.83, anlage: { kwp: 50, neigung: 20, azimut: 0 } });
  assert.equal(r.length, 2);
  assert.equal(r[0].beginn, T("2026-09-30T10:00:00Z"));
  assert.ok(r[0].kwP10 < r[0].kw && r[0].kw < r[0].kwP90);
  assert.equal(r[1].kwP10, null);
});

/* ---------------------------------------------------------------- Auswertung */
test("Preise: Viertelstunden werden zu Stundenmitteln", () => {
  const h = T("2026-10-01T10:00:00Z");
  const p = preiseJeStunde([
    { t: h, eurMwh: 10 },
    { t: h + 900000, eurMwh: 20 },
    { t: h + 1800000, eurMwh: 30 },
    { t: h + 2700000, eurMwh: 40 },
    { t: h + 3600000, eurMwh: -5 },
    { t: h + 3600000 + 900000, eurMwh: null },
  ]);
  assert.deepEqual(p, [
    { t: h, eurMwh: 25 },
    { t: h + 3600000, eurMwh: -5 },
  ]);
});

const tagStunden = (datum, werte) =>
  werte.map((kw, i) => {
    const beginn = T(`${datum}T00:00:00Z`) + i * 3600000; // 00–23 UTC = 02–01 Uhr MESZ
    return { beginn, ende: beginn + 3600000, kw, kwP10: kw * 0.5, kwP90: kw * 1.2 };
  });

test("Goldene Stunden: günstigste Preise unter den sonnenstarken Stunden", () => {
  // Leistung 06–14 UTC, Spitze 10 kW um 10 UTC
  const kw = [0, 0, 0, 0, 0, 0, 1, 3, 6, 8, 10, 9, 7, 4, 1, 0, 0, 0, 0, 0, 0, 0];
  const stunden = tagStunden("2026-10-01", kw);
  const preise = stunden.map((s, i) => ({ t: s.beginn, eurMwh: [100, 100, 100, 100, 100, 100, 90, 80, 70, 50, 40, 20, -10, 30, 60, 100, 120, 150, 140, 110, 100, 90][i] }));
  const [tag] = goldeneStunden({ stunden, preise, anzahl: 3, mindestAnteil: 0.6 });
  assert.equal(tag.mitPreis, true);
  // Kandidaten ≥ 6 kW: 08 (70), 09 (50), 10 (40), 11 (20), 12 (−10) → günstigste drei: 10, 11, 12 UTC
  assert.deepEqual(tag.stunden.map((s) => new Date(s.beginn).getUTCHours()), [10, 11, 12]);
  assert.equal(tag.stunden[2].eurMwh, -10);
});

test("Goldene Stunden ohne Preis: stärkste Sonnenstunden; trüber Tag ohne Leistung: leer", () => {
  const stunden = tagStunden("2026-10-02", [0, 0, 0, 0, 0, 0, 1, 3, 6, 8, 10, 9, 7, 4]);
  const [tag] = goldeneStunden({ stunden, preise: [], anzahl: 2 });
  assert.equal(tag.mitPreis, false);
  assert.deepEqual(tag.stunden.map((s) => s.kw), [10, 9]);
  const [leer] = goldeneStunden({ stunden: tagStunden("2026-10-03", [0, 0, 0]), preise: [] });
  assert.deepEqual(leer.stunden, []);
});

test("Tagessummen nach Wiener Kalendertag (22 UTC = 0 Uhr MESZ)", () => {
  const stunden = tagStunden("2026-10-01", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
  const tage = tagesSummen(stunden);
  // 00:00–21:59 UTC gehören zum 01.10. (Wien), 22:00 und 23:00 UTC bereits zum 02.10.
  assert.equal(tage.length, 2);
  assert.equal(tage[0].datum, "2026-10-01");
  nahe(tage[0].kwh, (22 * 23) / 2, 1e-9, "Summe 1..22");
  nahe(tage[1].kwh, 23 + 24, 1e-9, "Summe 23+24");
  nahe(tage[0].kwhP10, tage[0].kwh * 0.5, 1e-9, "Band P10");
});

test("Rasterzelle 0,05°: Nachbarpunkte teilen die Zelle, Mittelpunkt korrekt", () => {
  const a = zelle(48.051, 12.834);
  const b = zelle(48.099, 12.801);
  assert.equal(a.schluessel, b.schluessel);
  assert.deepEqual([a.lat, a.lon], [48.075, 12.825]);
  assert.notEqual(zelle(48.101, 12.834).schluessel, a.schluessel);
});

/* ---------------------------------------------------------------- Abrufbudget */
test("Budget: nie mehr als der Deckel je gleitender Stunde", () => {
  const b = neuesBudget({ proStunde: 200, reserve: 20 });
  let t = 0;
  let erlaubt = 0;
  for (let i = 0; i < 500; i++) {
    t += 1000;
    if (b.darf(t)) {
      b.buchen(t);
      erlaubt++;
    }
  }
  assert.equal(erlaubt, 200);
  assert.ok(200 < 240, "Deckel unter GeoSphere-Limit");
  // Nach Ablauf des Fensters werden wieder Abrufe frei
  assert.equal(b.darf(3600000 + 1001), true);
});

test("Budget: Header-Rest ≤ Reserve und HTTP 429 sperren", () => {
  const b = neuesBudget({ proStunde: 200, reserve: 20, sperreMs: 600000 });
  b.headerMelden("21", 0);
  assert.equal(b.darf(1), true);
  b.headerMelden("20", 1000);
  assert.equal(b.darf(2000), false);
  assert.equal(b.darf(601001), true);
  b.zuVieleMelden(700000, "120");
  assert.equal(b.darf(700000 + 119000), false);
  assert.equal(b.darf(700000 + 121000), true);
});

/* ---------------------------------------------------------------- GeoSphere-Antwort */
test("GeoSphere-Antwort lesen und Ensemble über Zeitstempel zuordnen", () => {
  const nwp = antwortLesen(
    {
      reference_time: "2026-09-29T21:00+00:00",
      timestamps: ["2026-09-30T10:00+00:00", "2026-09-30T11:00+00:00", "2026-09-30T12:00+00:00"],
      features: [{ properties: { parameters: { ssrd: { data: [544.5, 601.9, -0.1] }, "2t": { data: [20, 22.9, null] } } } }],
    },
    ["ssrd", "2t"]
  );
  const ens = antwortLesen(
    {
      reference_time: "2026-09-29T18:00+00:00",
      timestamps: ["2026-09-30T11:00+00:00", "2026-09-30T12:00+00:00"],
      features: [{ properties: { parameters: { ssrd_p10: { data: [300, 280] }, ssrd_p50: { data: [590, 600] }, ssrd_p90: { data: [640, 650] }, "2t_p50": { data: [22, 23] } } } }],
    },
    ["ssrd_p10", "ssrd_p50", "ssrd_p90", "2t_p50"]
  );
  const r = reihenVerbinden(nwp, ens);
  assert.equal(r.length, 3);
  assert.equal(r[0].ghiP10, null); // 10 UTC fehlt im Ensemble
  assert.equal(r[1].ghiP90, 640);
  assert.equal(r[2].ghi, 0); // negative Rundungswerte → 0
  assert.equal(r[2].t2m, 23); // fehlende Temperatur aus Ensemble-Median
});

/* ---------------------------------------------------------------- Format */
test("Zahlen- und Zeitformat ohne toLocaleString", () => {
  assert.equal(zahl(1234.56, 1), "1.234,6");
  assert.equal(zahl(1234567), "1.234.567");
  assert.equal(zahl(-3.25, 1), "−3,3");
  assert.equal(zahl(-0.01, 1), "0,0");
  assert.equal(zahl(NaN), "–");
  const z = wienZeit(T("2026-09-30T22:30:00Z"));
  assert.equal(z.datum, "2026-10-01");
  assert.equal(z.stunde, 0);
  assert.equal(z.wochentag, "Do");
  assert.equal(intervall(T("2026-09-30T21:00:00Z"), T("2026-09-30T22:00:00Z")), "23–24 Uhr");
});

test("Plausibilität: klarer Herbsttag (GeoSphere-Beispiel 30.09.2026) für 100 kWp Süd 30°", () => {
  // Stundenmittel ssrd für Ostermiething aus dem Lauf 29.09.2026 21 UTC (Werte 06–17 UTC)
  const ghi = [33.3, 157.1, 306.8, 441.8, 544.5, 601.9, 605.9, 556.9, 461.0, 327.0, 173.2, 35.3];
  const stunden = ghi.map((g, i) => ({ ende: T("2026-09-30T06:00:00Z") + i * 3600000, ghi: g, t2m: 18 }));
  const r = prognoseRechnen({ stunden, lat: 48.05, lon: 12.83, anlage: { kwp: 100, neigung: 30, azimut: 0 } });
  const kwh = r.reduce((s, x) => s + x.kw, 0);
  // Tagessumme horizontal 4,24 kWh/m²; auf 30° Süd im Herbst etwa +20–35 %, mal 0,86 und Temperatur
  assert.ok(kwh > 400 && kwh < 560, `Tagesertrag ${kwh.toFixed(0)} kWh`);
  // Spitze um die Mittagszeit (10–12 UTC)
  const spitze = r.reduce((a, b) => (b.kw > a.kw ? b : a));
  assert.ok([10, 11].includes(new Date(spitze.beginn).getUTCHours()));
  assert.ok(ANNAHMEN.verluste === 0.14);
});

console.log(`\n${n} Tests bestanden.`);
