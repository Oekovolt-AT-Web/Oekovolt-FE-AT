// Tests für die Gemeinde-Werkzeuge (Welle B, Paket B09) – Aufruf: node scripts/kommunen-werkzeuge.test.mjs
//  - src/components/KommunenVergabe/amtsvortrag.js (Amtsvortrag-Generator)
//  - src/components/KommunenVergabe/liegenschaften.js (Liegenschafts-Check)
//  - src/data/eignung.js (nur belegte Nachweise)
//  - public/vorlagen/ (Muster-Paket aus scripts/vorlagen-erzeugen.mjs)
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { AMTSVORTRAG_STAND, ELWG_68_6, GATE_KENNUNG, PROGRAMME, amtsvortragErzeugen, amtsvortragHtml, amtsvortragText, foerderungenAktiv } from "../src/components/KommunenVergabe/amtsvortrag.js";
import {
  BEISPIEL_ZEILEN,
  GEBAEUDE,
  MAX_GEBAEUDE,
  csvExport,
  eigenverbrauchKwh,
  kwpAusDachflaeche,
  kwpFuerQuote,
  liegenschaftBerechnen,
  liegenschaftenAuswerten,
  neueZeile,
  spezifischerErtrag,
} from "../src/components/KommunenVergabe/liegenschaften.js";
import { NACHWEISE_OPTIONAL, bundeslandAusOrt, nachweiseBelegt } from "../src/data/eignung.js";
import { KUNDEN } from "../src/data/kunden.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  void name;
};

// ---------------------------------------------------------------------------
// Amtsvortrag
// ---------------------------------------------------------------------------
test("Kennung und Stand", () => {
  assert.equal(GATE_KENNUNG, "gemeinderat-vorlage");
  assert.match(AMTSVORTRAG_STAND.iso, /^\d{4}-\d{2}-\d{2}$/);
});

test("Förderplan nur mit aktiven Fristen", () => {
  const am11 = foerderungenAktiv(PROGRAMME, "2026-10-11").map((p) => p.id);
  assert.ok(am11.includes("eag"));
  assert.ok(am11.includes("kig"));
  const am30 = foerderungenAktiv(PROGRAMME, "2026-10-30").map((p) => p.id);
  assert.ok(!am30.includes("eag"), "EAG-Call endet am 22.10.2026");
  assert.ok(am30.includes("kig"));
  assert.deepEqual(foerderungenAktiv(PROGRAMME, "2029-06-01"), []);
  assert.deepEqual(foerderungenAktiv(null), []);
});

const EINGABE = {
  gemeinde: "Marktgemeinde Musterdorf",
  liegenschaften: "Volksschule\nBauhof",
  kwp: 120,
  speicherKwh: 50,
  auftragswert: "150.000",
  auftraggeber: "klassisch",
  art: "bau",
  organ: "gemeinderat",
  bedeckung: "kig",
  foerderungen: ["eag", "kig"],
  eegRolle: "betreiberin",
};

test("Amtsvortrag – Aufbau, Verfahren, Neutralität", () => {
  const d = amtsvortragErzeugen(EINGABE, { heute: "2026-10-11" });
  assert.deepEqual(
    d.abschnitte.map((a) => a.id),
    ["sachverhalt", "rechtsgrundlage", "antrag", "beilagen"],
  );
  assert.equal(d.vergabe.verfahren.id, "direkt");
  const text = amtsvortragText(d);
  assert.match(text, /Volksschule und Bauhof/);
  assert.match(text, /150\.000 €/);
  assert.match(text, /mindestens drei Angebote/);
  assert.match(text, /§ 68 Abs\. 6 ElWG/);
  assert.match(text, /zumindest 10 %/);
  assert.match(text, /Keine Rechtsberatung/);
  assert.match(text, /Gemeindeordnung/);
  assert.match(text, /\[__ €\]/, "Wertgrenze der Gemeindeordnung bleibt Platzhalter");
  assert.doesNotMatch(text, /Ökovolt|oekovolt/i, "kein Auftragnehmer vorweggenommen");
  assert.ok(d.platzhalter > 3);
  assert.deepEqual(
    d.foerderungen.map((f) => f.id),
    ["eag", "kig"],
  );
});

test("Amtsvortrag – abgelaufene Förderung fällt weg, ohne EEG kein 10-%-Satz", () => {
  const d = amtsvortragErzeugen({ ...EINGABE, eegRolle: "keine" }, { heute: "2026-11-05" });
  assert.deepEqual(
    d.foerderungen.map((f) => f.id),
    ["kig"],
  );
  const text = amtsvortragText(d);
  assert.doesNotMatch(text, /10 %/);
});

test("Amtsvortrag – über Direktvergabe-Grenze anderes Verfahren", () => {
  const d = amtsvortragErzeugen({ ...EINGABE, auftragswert: 450000 }, { heute: "2026-10-11" });
  assert.notEqual(d.vergabe.verfahren.id, "direkt");
  assert.ok(!d.vergabe.zulaessig.some((w) => w.id === "direkt"));
});

test("Amtsvortrag – leere Eingaben bleiben Platzhalter", () => {
  const d = amtsvortragErzeugen({});
  assert.equal(d.vergabe, null);
  assert.match(amtsvortragText(d), /\[Gemeinde\]/);
  assert.match(amtsvortragText(d), /\[Liegenschaft\(en\)\]/);
});

test("Amtsvortrag – HTML eigenständig und maskiert", () => {
  const d = amtsvortragErzeugen({ ...EINGABE, gemeinde: "<script>x</script>" });
  const html = amtsvortragHtml(d);
  assert.match(html, /^<!doctype html>/);
  assert.doesNotMatch(html, /<script>x/);
  assert.match(html, /keine Rechtsberatung/i);
  assert.doesNotMatch(html, /https?:\/\/(?!www\.)/, "keine externen Ressourcen");
});

test("§ 68 Abs. 6 ElWG – Zitat vorhanden", () => {
  assert.match(ELWG_68_6.zitat, /zumindest 10%/);
  assert.match(ELWG_68_6.zitat, /schutzbedürftige Haushalte/);
});

// ---------------------------------------------------------------------------
// Liegenschafts-Check
// ---------------------------------------------------------------------------
test("kWp aus Dachfläche", () => {
  assert.equal(kwpAusDachflaeche(0), 0);
  assert.equal(kwpAusDachflaeche(3), 1);
  assert.equal(kwpAusDachflaeche(700), 100);
  assert.equal(kwpAusDachflaeche("1.400"), 200);
});

test("Ertrag je Bundesland plausibel", () => {
  for (const id of ["wien", "tirol", "salzburg"]) {
    const e = spezifischerErtrag(id);
    assert.ok(e > 900 && e < 1250, `${id}: ${e}`);
  }
  assert.equal(spezifischerErtrag("unbekannt"), 1000);
});

test("Eigenverbrauch begrenzt und Profile sinnvoll", () => {
  const ara = eigenverbrauchKwh({ verbrauch: 250000, kwp: 80, typId: "klaeranlage", ertragProKwp: 1000 });
  assert.ok(ara > 0.85 * 80000, "Kläranlage nutzt fast alles selbst");
  const schule = eigenverbrauchKwh({ verbrauch: 60000, kwp: 170, typId: "schule", ertragProKwp: 1000 });
  assert.ok(schule < 60000 && schule < 170000);
  const ff = liegenschaftBerechnen({ typ: "feuerwehr", verbrauch: 8000, dachflaeche: 300 });
  assert.ok(ff.evQuote < 0.3);
  assert.ok(ff.hinweise.some((h) => h.id === "ev-niedrig"));
  for (const g of GEBAEUDE) {
    assert.equal(g.werktag.length, 24, g.id);
    assert.equal(g.monat.length, 12, g.id);
  }
});

test("Auslegung auf Eigenverbrauch", () => {
  const p = kwpFuerQuote({ verbrauch: 60000, typId: "schule", ertragProKwp: 1000, kwpMax: 170 });
  assert.ok(p > 0 && p < 170);
  const r = liegenschaftBerechnen({ typ: "schule", verbrauch: 60000, dachflaeche: 1200 }, { auslegung: "eigenverbrauch" });
  assert.ok(r.evQuote >= 0.5 - 1e-9);
});

test("Hinweise Dachalter und Netzebene", () => {
  const r = liegenschaftBerechnen({ typ: "schule", verbrauch: 60000, dachflaeche: 1200, dachalter: 32, netzebene: "7" });
  assert.ok(r.hinweise.some((h) => h.id === "dach-sanierung"));
  assert.ok(r.hinweise.some((h) => h.id === "netz-ne7"));
});

test("Rangfolge, 15 Gebäude, CSV", () => {
  const zeilen = Array.from({ length: 18 }, (_, i) => neueZeile(GEBAEUDE[i % GEBAEUDE.length].id, `Gebäude ${i + 1}`));
  const a = liegenschaftenAuswerten(zeilen, { ertragProKwp: 1050 });
  assert.equal(a.liste.length, MAX_GEBAEUDE);
  assert.deepEqual(
    a.reihung.map((r) => r.rang),
    Array.from({ length: MAX_GEBAEUDE }, (_, i) => i + 1),
  );
  for (let i = 1; i < a.reihung.length; i++) assert.ok(a.reihung[i - 1].score >= a.reihung[i].score);
  assert.equal(
    a.gesamt.kwp,
    a.liste.reduce((s, x) => s + x.kwp, 0),
  );
  const csv = csvExport(a);
  assert.ok(csv.startsWith("﻿"));
  assert.equal(csv.split("\r\n").length, MAX_GEBAEUDE + 2);
  assert.match(csv, /Grobabschätzung mit typisierten Profilen/);
  assert.equal(BEISPIEL_ZEILEN.length >= 3, true);
});

// ---------------------------------------------------------------------------
// Eignung
// ---------------------------------------------------------------------------
test("Eignung – Start: nichts belegt", () => {
  for (const [id, x] of Object.entries(NACHWEISE_OPTIONAL)) assert.equal(x.belegt, false, id);
  assert.deepEqual(nachweiseBelegt(), []);
});

// ---------------------------------------------------------------------------
// Muster-Paket
// ---------------------------------------------------------------------------
test("Vorlagen vorhanden, herstellerneutral, mit Rechtsvorbehalt und § 25", () => {
  const dir = path.join(ROOT, "public", "vorlagen");
  for (const f of ["leistungsbeschreibung-pv-gemeinde-muster.docx", "leistungsbeschreibung-pv-gemeinde-muster.html", "bewertungsmatrix-pv-angebote-muster.xlsx"]) {
    const p = path.join(dir, f);
    assert.ok(fs.existsSync(p), f);
    assert.ok(fs.statSync(p).size > 4000, `${f} zu klein`);
  }
  // DOCX/XLSX sind ZIP-Container
  assert.equal(fs.readFileSync(path.join(dir, "leistungsbeschreibung-pv-gemeinde-muster.docx")).subarray(0, 2).toString(), "PK");
  assert.equal(fs.readFileSync(path.join(dir, "bewertungsmatrix-pv-angebote-muster.xlsx")).subarray(0, 2).toString(), "PK");
  const html = fs.readFileSync(path.join(dir, "leistungsbeschreibung-pv-gemeinde-muster.html"), "utf8");
  assert.match(html, /§ 25 BVergG/);
  assert.match(html, /Rechtsvorbehalt/);
  assert.match(html, /keine Rechtsberatung/i);
  assert.match(html, /herstellerneutral/);
  for (const norm of ["StLB-HT", "R 11-1", "62446-1", "TOR Erzeuger", "EAG", "Wartung"]) assert.ok(html.includes(norm), norm);
  const marken = /\b(Fronius|Huawei|SMA Solar|Kostal|Sungrow|SolarEdge|Enphase|Jinko|Trina|LONGi|JA Solar|Canadian Solar|BYD|Tesla|Sonnen|Kaco|Goodwe|Victron|Q CELLS|Hanwha|Meyer Burger|REC|Aiko)\b/i;
  assert.doesNotMatch(html, marken);
});

test("Referenzliste – nur Bundesland, keine Ortsnamen (Kunden ohne Freigabe)", () => {
  const laender = ["Burgenland", "Kärnten", "Niederösterreich", "Oberösterreich", "Salzburg", "Steiermark", "Tirol", "Vorarlberg", "Wien", "–"];
  assert.equal(bundeslandAusOrt("Pasching, Oberösterreich (Standort); Firmensitz Guntramsdorf"), "Oberösterreich");
  assert.equal(bundeslandAusOrt("Hof bei Salzburg"), "Salzburg");
  assert.equal(bundeslandAusOrt("Tragwein, Oberösterreich (Firmensitz)"), "Oberösterreich");
  assert.equal(bundeslandAusOrt("Nußdorf ob der Traisen, Niederösterreich (Werk)"), "Niederösterreich");
  assert.equal(bundeslandAusOrt("Wien"), "Wien");
  assert.equal(bundeslandAusOrt(""), "–");
  assert.equal(bundeslandAusOrt(undefined), "–");
  for (const k of Object.values(KUNDEN)) assert.ok(laender.includes(bundeslandAusOrt(k.ort)), String(k.ort));
});

console.log(`kommunen-werkzeuge: ${n} Tests bestanden`);
