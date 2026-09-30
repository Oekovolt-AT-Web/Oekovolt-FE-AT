// Tests für src/lib/flaeche/* – Aufruf: node scripts/flaeche.test.mjs
import assert from "node:assert/strict";
import { pruefeFlaeche, pachtSpanne, PACHT_BELEG, WIDMUNGEN, AUSRICHTUNGEN, STUFEN } from "../src/lib/flaeche/check.js";
import { LAENDER, landFuerSlug, widmungsPfad, STAND } from "../src/lib/flaeche/laender.js";
import { CHECKLISTE } from "../src/lib/flaeche/checkliste.js";
import { zahl, euro, hektar } from "../src/lib/flaeche/format.js";

let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  process.stdout.write(`ok ${n} – ${name}\n`);
};

// ---------- Format (ohne Intl) ----------
test("Zahlformat mit Tausenderpunkt und Dezimalkomma", () => {
  assert.equal(zahl(0), "0");
  assert.equal(zahl(1234567), "1.234.567");
  assert.equal(zahl(1234.56, 1), "1.234,6");
  assert.equal(zahl(0.05, 1), "0,1");
  assert.equal(zahl(-2500), "−2.500");
  assert.equal(zahl(NaN), "–");
  assert.equal(euro(12345), "12.300 €");
  assert.equal(euro(12351, 1), "12.351 €");
  assert.equal(hektar(2.5), "2,5 ha");
  assert.equal(hektar(12), "12 ha");
});

// ---------- Länderdaten ----------
test("neun Bundesländer mit Quellen und Prüfregel", () => {
  assert.equal(LAENDER.length, 9);
  const slugs = LAENDER.map((l) => l.slug);
  assert.equal(new Set(slugs).size, 9);
  for (const l of LAENDER) {
    assert.ok(l.quellen.length >= 1, `${l.name}: Quelle fehlt`);
    for (const q of l.quellen) assert.match(q.url, /^https:\/\//, `${l.name}: URL`);
    assert.ok(l.regeln.length >= 2, `${l.name}: Regeln`);
    assert.ok(["widmung", "zonen", "staffel", "deckel", "keine"].includes(l.check.art), `${l.name}: check.art`);
    assert.ok(Array.isArray(l.offen), `${l.name}: offen`);
  }
  assert.equal(landFuerSlug("tirol").name, "Tirol");
  assert.equal(landFuerSlug("xy"), null);
  assert.equal(widmungsPfad("wien"), "/freiflaechen-photovoltaik/widmung/wien");
  assert.equal(STAND.iso, "2026-09-30");
});

// ---------- Pacht ----------
test("Pachtspanne nur für landwirtschaftliche Flächen belegt", () => {
  const p = pachtSpanne({ hektar: 4, widmung: "acker" });
  assert.equal(p.belegt, true);
  assert.equal(p.jahrVon, 4 * PACHT_BELEG.pvVon);
  assert.equal(p.jahrBis, 4 * PACHT_BELEG.pvBis);
  assert.equal(p.agrar, PACHT_BELEG.ackerland);
  assert.ok(p.quellen.length >= 2);
  const w = pachtSpanne({ hektar: 4, widmung: "wiese" });
  assert.equal(w.agrar, PACHT_BELEG.dauergruenland);
  for (const id of ["vorbelastet", "bauland", "wald"]) {
    const o = pachtSpanne({ hektar: 4, widmung: id });
    assert.equal(o.belegt, false, id);
    assert.match(o.hinweis, /Richtwert – Quelle offen/);
    assert.equal(o.jahrVon, undefined);
  }
  assert.equal(pachtSpanne({ hektar: -3, widmung: "acker" }).jahrVon, 0);
});

// ---------- Ampel ----------
const basis = { hektar: 3, widmung: "acker", netzKm: 0.5, neigung: 0, ausrichtung: "eben", bundesland: "oberoesterreich" };

test("Oberösterreich, 3 ha Acker, netznah, eben → grün", () => {
  const r = pruefeFlaeche(basis);
  assert.equal(r.ampel, "gruen");
  assert.equal(r.kwp, 3000);
  assert.equal(r.kriterien.length, 4);
  assert.equal(r.kriterien.find((k) => k.id === "widmung").stufe, "pruefen");
  assert.equal(r.eagAbschlag, true);
});

test("bestehende PV-Widmung → Widmung passt", () => {
  const r = pruefeFlaeche({ ...basis, widmung: "pv" });
  assert.equal(r.kriterien[0].stufe, "gut");
  assert.equal(r.ampel, "gruen");
});

test("Wald → rot", () => {
  assert.equal(pruefeFlaeche({ ...basis, widmung: "wald" }).ampel, "rot");
});

test("Kärnten: Deckel 4 ha, vorbelastet 10 ha", () => {
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "kaernten", hektar: 4 }).kriterien[0].stufe, "pruefen");
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "kaernten", hektar: 6 }).ampel, "rot");
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "kaernten", hektar: 6, widmung: "vorbelastet" }).kriterien[0].stufe, "pruefen");
  const gross = pruefeFlaeche({ ...basis, bundesland: "kaernten", hektar: 12, widmung: "vorbelastet" });
  assert.equal(gross.kriterien[0].stufe, "erschwert");
  assert.notEqual(gross.ampel, "rot");
});

test("Niederösterreich: über 2 ha nur in Zonen → gelb", () => {
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "niederoesterreich", hektar: 2 }).ampel, "gruen");
  const r = pruefeFlaeche({ ...basis, bundesland: "niederoesterreich", hektar: 2.5 });
  assert.equal(r.kriterien[0].stufe, "erschwert");
  assert.equal(r.ampel, "gelb");
});

test("Steiermark: Staffel 2 / 10 ha", () => {
  const st = { ...basis, bundesland: "steiermark" };
  assert.equal(pruefeFlaeche({ ...st, hektar: 1.5 }).kriterien[0].stufe, "pruefen");
  assert.equal(pruefeFlaeche({ ...st, hektar: 5 }).kriterien[0].stufe, "erschwert");
  assert.equal(pruefeFlaeche({ ...st, hektar: 5, widmung: "vorbelastet" }).kriterien[0].stufe, "pruefen");
  assert.match(pruefeFlaeche({ ...st, hektar: 15, widmung: "vorbelastet" }).kriterien[0].text, /Vorrangzone/);
});

test("Burgenland und Wien → mindestens gelb", () => {
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "burgenland" }).ampel, "gelb");
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "wien" }).ampel, "gelb");
});

test("Größe: unter 0,2 ha erschwert, unter 0,5 ha prüfen", () => {
  assert.equal(pruefeFlaeche({ ...basis, hektar: 0.1 }).kriterien.find((k) => k.id === "groesse").stufe, "erschwert");
  assert.equal(pruefeFlaeche({ ...basis, hektar: 0.4 }).kriterien.find((k) => k.id === "groesse").stufe, "pruefen");
  assert.equal(pruefeFlaeche({ ...basis, hektar: 0.5 }).kriterien.find((k) => k.id === "groesse").stufe, "gut");
});

test("Netz: lange Trasse bei kleiner Fläche erschwert", () => {
  const r = pruefeFlaeche({ ...basis, hektar: 1, netzKm: 5 });
  assert.equal(r.kriterien.find((k) => k.id === "netz").stufe, "erschwert");
  assert.equal(r.ampel, "gelb");
});

test("Gelände: Nordhang steil → rot, Südhang flach → gut", () => {
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "nord", neigung: 15 }).ampel, "rot");
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "nord", neigung: 4 }).kriterien[3].stufe, "pruefen");
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "sued", neigung: 12 }).kriterien[3].stufe, "gut");
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "ostwest", neigung: 15 }).kriterien[3].stufe, "pruefen");
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "sued", neigung: 30 }).kriterien[3].stufe, "erschwert");
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "nord", neigung: 1 }).kriterien[3].stufe, "gut");
});

test("robuste Eingaben", () => {
  const r = pruefeFlaeche({ hektar: "abc", bundesland: "unbekannt" });
  assert.equal(r.kwp, 0);
  assert.equal(r.land.slug, LAENDER[0].slug);
  for (const w of WIDMUNGEN) for (const a of AUSRICHTUNGEN) {
    const x = pruefeFlaeche({ ...basis, widmung: w.id, ausrichtung: a.id, neigung: 10 });
    assert.ok(["gruen", "gelb", "rot"].includes(x.ampel));
    for (const k of x.kriterien) assert.ok(STUFEN[k.stufe], k.id);
  }
});

// ---------- Checkliste ----------
test("Checkliste mit eindeutigen IDs und gültigen Quellen", () => {
  assert.ok(CHECKLISTE.length >= 8);
  assert.equal(new Set(CHECKLISTE.map((c) => c.id)).size, CHECKLISTE.length);
  for (const c of CHECKLISTE) if (c.quelle) assert.match(c.quelle.url, /^https:\/\//);
});

process.stdout.write(`\n${n} Tests bestanden.\n`);
