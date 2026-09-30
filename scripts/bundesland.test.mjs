// Tests für die Bundesland-Hubseiten /photovoltaik-bundesland/[land]:
// src/lib/bundesland/auswertung.js (rein) und src/lib/bundesland/daten.js (liest Repo-Daten
// und – falls vorhanden – das Schneelast-Raster data/schneelast/sk50-at.bin).
//
// Aufruf: node scripts/bundesland.test.mjs
// Ohne Abhängigkeiten (node:test, node:assert); Pfad-Aliase über scripts/lib/alias.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ROOT, srcUrl } from "./lib/alias.mjs";

const A = await import(srcUrl("lib/bundesland/auswertung.js"));
const { bundeslandDaten, laenderListe } = await import(srcUrl("lib/bundesland/daten.js"));
const { BUNDESLAENDER } = await import(srcUrl("data/bundeslaender.js"));
const { REGIONEN } = await import(srcUrl("data/regionen/index.js"));
const { PROJEKTE } = await import(srcUrl("data/projekte.js"));
const { normalisiereApiProjekt } = await import(srcUrl("components/Project/projektDaten.js"));
const pvgis = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/regionen-pvgis.json"), "utf8"));

const RASTER_DA = fs.existsSync(path.join(ROOT, "data/schneelast/sk50-at.bin"));
const PROJEKTE_N = PROJEKTE.map(normalisiereApiProjekt);

/* ------------------------------------------------------------------ rein */

test("zahl: Tausenderpunkt, Dezimalkomma, keine Intl-Abhängigkeit", () => {
  assert.equal(A.zahl(1143), "1.143");
  assert.equal(A.zahl(1234567), "1.234.567");
  assert.equal(A.zahl(0.65, 1), "0,7");
  assert.equal(A.zahl(2.1, 1), "2,1");
  assert.equal(A.zahl(-3), "−3");
  assert.equal(A.zahl(null), "–");
  assert.equal(A.zahl("x"), "–");
});

test("datumText: ISO → TT.MM.JJJJ", () => {
  assert.equal(A.datumText("2026-09-28"), "28.09.2026");
  assert.equal(A.datumText(""), "");
});

test("LAENDER: neun Länder, Slugs identisch mit src/data/bundeslaender.js", () => {
  assert.equal(A.LAENDER.length, 9);
  assert.deepEqual(A.LAENDER.map((l) => l.slug).sort(), Object.keys(BUNDESLAENDER).sort());
  for (const l of A.LAENDER) assert.equal(BUNDESLAENDER[l.slug].name, l.name);
  assert.equal(A.landPfad("tirol"), "/photovoltaik-bundesland/tirol");
});

test("landAusOrt: Land aus Ortsangaben der Kundendaten", () => {
  assert.equal(A.landAusOrt("Steyregg, Oberösterreich"), "oberoesterreich");
  assert.equal(A.landAusOrt("Hof bei Salzburg"), "salzburg");
  assert.equal(A.landAusOrt("Wien"), "wien");
  assert.equal(A.landAusOrt("Wiener Neustadt"), null);
  assert.equal(A.landAusOrt("Pasching, Oberösterreich (Standort); Firmensitz Guntramsdorf"), "oberoesterreich");
  assert.equal(A.landAusOrt("Nußdorf ob der Traisen, Niederösterreich (Werk)"), "niederoesterreich");
  assert.equal(A.landAusOrt("Kärnten"), "kaernten");
  assert.equal(A.landAusOrt("Mindelheim"), null);
  assert.equal(A.landAusOrt(""), null);
});

test("ortKurz: Ort ohne Land und Klammerzusatz", () => {
  assert.equal(A.ortKurz("Tragwein, Oberösterreich (Firmensitz)"), "Tragwein");
  assert.equal(A.ortKurz("Pasching, Oberösterreich (Standort); Firmensitz Guntramsdorf"), "Pasching");
  assert.equal(A.ortKurz("Wien"), "Wien");
});

test("ertragStatistik: Mittel, Spanne, Monatsprofil", () => {
  const orte = [
    { slug: "a", name: "A", pvgis: { sued35_kwh_kwp: 1100, ostwest15_kwh_kwp: 900, flach10_kwh_kwp: 1000, monate_sued35: Array(12).fill(100) } },
    { slug: "b", name: "B", kurzname: "Bee", pvgis: { sued35_kwh_kwp: 1210, ostwest15_kwh_kwp: 1000, flach10_kwh_kwp: 1101, monate_sued35: Array(12).fill(110) } },
  ];
  const s = A.ertragStatistik(orte);
  assert.equal(s.anzahl, 2);
  assert.deepEqual(s.mittel, { sued35: 1155, ostwest15: 950, flach10: 1051 });
  assert.equal(s.min.slug, "a");
  assert.equal(s.max.name, "Bee");
  assert.equal(s.spanneProzent, 10);
  assert.deepEqual(s.monate, Array(12).fill(105));
  assert.equal(A.ertragStatistik([]), null);
});

test("winteranteil und jahresertrag", () => {
  const p = pvgis.orte.ostermiething;
  const w = A.winteranteil(p);
  const soll = Math.round(([0, 1, 10, 11].reduce((s, i) => s + p.monate_sued35[i], 0) / p.sued35_kwh_kwp) * 100);
  assert.equal(w, soll);
  assert.equal(A.winteranteil({}), null);
  assert.equal(A.jahresertrag(1143, 100), 114300);
  assert.equal(A.jahresertrag(1143.4, 1), 1100);
  assert.equal(A.jahresertrag(null, 100), 0);
});

test("skSpanne: Minimum und Maximum, ohne Werte null", () => {
  const s = A.skSpanne([{ ort: "x", sk: 1.2 }, { ort: "y", sk: null }, { ort: "z", sk: 0.4 }]);
  assert.equal(s.min.ort, "z");
  assert.equal(s.max.ort, "x");
  assert.equal(s.anzahl, 2);
  assert.equal(A.skSpanne([{ sk: null }]), null);
});

test("netzbetreiberGruppen: gruppiert, Anmeldeseiten in Nennungsreihenfolge", () => {
  const orte = [
    { slug: "a", name: "A", fakten: { netzbetreiber: { name: "Netz Niederösterreich GmbH" } } },
    { slug: "b", name: "B", fakten: { netzbetreiber: { name: "Netz Niederösterreich GmbH" } } },
    { slug: "c", name: "C", fakten: { netzbetreiber: { name: "Netz Niederösterreich GmbH / Wiener Netze GmbH" } } },
    { slug: "d", name: "D", fakten: {} },
  ];
  const verzeichnis = [
    { slug: "wiener-netze", name: "Wiener Netze GmbH", kurz: "Wiener Netze" },
    { slug: "netz-niederoesterreich", name: "Netz Niederösterreich GmbH", kurz: "Netz NÖ" },
  ];
  const g = A.netzbetreiberGruppen(orte, verzeichnis);
  assert.equal(g.length, 2);
  assert.equal(g[0].orte.length, 2);
  assert.deepEqual(g[0].anmeldung.map((x) => x.slug), ["netz-niederoesterreich"]);
  assert.deepEqual(g[1].anmeldung.map((x) => x.slug), ["netz-niederoesterreich", "wiener-netze"]);
});

test("referenzenFuerLand: Anlagenort vor Kundensitz, je Firma das größte Projekt, nichts geraten", () => {
  const projekte = [
    { slug: "p1", titel: "P1", ort: "", kwp: 100 },
    { slug: "p2", titel: "P2", ort: "", kwp: 300 },
    { slug: "p3", titel: "P3", ort: "Linz", kwp: 50 },
    { slug: "p4", titel: "P4", ort: "", kwp: 999 },
    { slug: "p5", titel: "P5", ort: "Mindelheim", kwp: 10 },
  ];
  const kunden = {
    p1: { firma: "Firma X", ort: "Wels, Oberösterreich" },
    p2: { firma: "Firma X", ort: "Wels, Oberösterreich" },
    p3: { firma: "Firma Y", ort: "Wien" },
    p5: { firma: "Firma Z", ort: "Salzburg" },
  };
  const ortZuLand = new Map([["linz", "oberoesterreich"]]);
  const r = A.referenzenFuerLand("oberoesterreich", projekte, kunden, ortZuLand);
  assert.deepEqual(r.map((x) => x.projekt.slug), ["p2", "p3"]);
  assert.equal(r[0].quelle, "kunde");
  assert.equal(r[0].ort, "Wels");
  assert.equal(r[1].quelle, "anlage");
  // Projekt mit unbekanntem Anlagenort fällt auf den Kundensitz zurück
  assert.deepEqual(A.referenzenFuerLand("salzburg", projekte, kunden, ortZuLand).map((x) => x.projekt.slug), ["p5"]);
  // p4 ohne Ort und ohne Kundeneintrag taucht nirgends auf
  for (const l of A.LAENDER) assert.ok(!A.referenzenFuerLand(l.slug, projekte, kunden, ortZuLand).some((x) => x.projekt.slug === "p4"));
});

test("seoTitel: höchstens 60 Zeichen für alle Länder", () => {
  for (const l of A.LAENDER) {
    const t = A.seoTitel(l.name);
    assert.ok(t.length <= 60, `${t} (${t.length})`);
    assert.ok(t.includes(l.name));
  }
});

/* ------------------------------------------------------------------ Daten aus dem Repo */

test("bundeslandDaten: jede Regionalseite genau einem Land zugeordnet", () => {
  const summe = A.LAENDER.reduce((s, l) => s + bundeslandDaten(l.slug, []).orte.length, 0);
  assert.equal(summe, Object.keys(REGIONEN).length);
  assert.equal(laenderListe().reduce((s, l) => s + l.anzahlOrte, 0), Object.keys(REGIONEN).length);
  assert.equal(bundeslandDaten("bayern", []), null);
});

test("bundeslandDaten: Landesmittel stimmt mit den PVGIS-Werten der Regionen überein", () => {
  for (const l of A.LAENDER) {
    const d = bundeslandDaten(l.slug, []);
    assert.ok(d.orte.length >= 1, `${l.slug}: keine Standortseite`);
    const werte = d.orte.map((o) => pvgis.orte[o.slug].sued35_kwh_kwp);
    assert.equal(d.ertrag.mittel.sued35, Math.round(werte.reduce((s, w) => s + w, 0) / werte.length));
    assert.equal(d.ertrag.min.wert, Math.min(...werte));
    assert.equal(d.ertrag.max.wert, Math.max(...werte));
    assert.ok(d.ertrag.mittel.sued35 > 1000 && d.ertrag.mittel.sued35 < 1400);
    assert.ok(d.foerderung.pfad.startsWith("/forderungen/landesforderungen/"));
    assert.ok(d.netz.gruppen.length >= 1, `${l.slug}: kein Netzbetreiber`);
    assert.ok(d.nachbarn.length >= 1);
  }
});

test("bundeslandDaten: Referenzen nur mit belegtem Land", () => {
  let gesamt = 0;
  for (const l of A.LAENDER) {
    const d = bundeslandDaten(l.slug, PROJEKTE_N);
    for (const r of d.referenzen.liste) {
      assert.ok(r.ort, `${l.slug}: Referenz ohne Ort`);
      assert.ok(["anlage", "kunde"].includes(r.quelle));
    }
    gesamt += d.referenzen.liste.length;
  }
  assert.ok(gesamt > 0, "keine einzige Referenz zugeordnet");
});

test("bundeslandDaten: Schneelast-Richtwerte aus dem Raster", { skip: !RASTER_DA && "Raster fehlt" }, () => {
  for (const l of A.LAENDER) {
    const d = bundeslandDaten(l.slug, []);
    assert.ok(d.schneelast.bezirksorte, `${l.slug}: keine Spanne`);
    for (const o of d.orte) {
      assert.ok(o.sk == null || (o.sk > 0 && o.sk < 10), `${o.slug}: ${o.sk}`);
    }
    assert.ok(d.schneelast.orte.min.sk <= d.schneelast.orte.max.sk);
  }
  // Plausibilität: alpines Tirol schneereicher als das Burgenland
  const tirol = bundeslandDaten("tirol", []).schneelast.orte.max.sk;
  const bgld = bundeslandDaten("burgenland", []).schneelast.orte.max.sk;
  assert.ok(tirol > bgld);
});
