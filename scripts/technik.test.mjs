// scripts/technik.test.mjs
// Prüft die reinen Funktionen von Paket B04 (Netzverträglichkeit, Datenblatt-Freigabe, Prüfplan)
// und die Bezugsgrößen-Korrektur Q/Sr in den Kennlinien-Dateien.
// Ausführen: node scripts/technik.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { GRENZEN, ampel, bewerte, maxScheinleistungKva, noetigerCosPhi, phiGrad, spannungsaenderung, zeiger } from "../src/lib/technik/netzvertraeglichkeit.js";
import { DATENBLATT, FREIGEGEBENE_WERTE, PRUEFPLAN_STUFEN, pruefplan, reglerBezeichnung } from "../src/data/parkreglerDatenblatt.js";

const wurzel = join(dirname(fileURLToPath(import.meta.url)), "..");
const lies = (p) => readFileSync(join(wurzel, p), "utf8");
const nahe = (a, b, tol = 1e-3) => assert.ok(Math.abs(a - b) <= tol, `${a} ≠ ${b} (±${tol})`);

test("Δu gegen Handrechnung: 500 kVA an 20 MVA, ψ = 60°, cos φ = 1 → 1,25 %", () => {
  // Δu = 0,5/20 · cos 60° = 0,025 · 0,5 = 1,25 %
  nahe(spannungsaenderung({ sKva: 500, skMva: 20, psiGrad: 60 }), 1.25);
});

test("Δu gegen Handrechnung: 100 kVA an 2 MVA, ψ = 45°, cos φ = 1 → 3,536 %", () => {
  nahe(spannungsaenderung({ sKva: 100, skMva: 2, psiGrad: 45 }), 3.5355, 1e-3);
});

test("Untererregt senkt die Spannungsanhebung, übererregt erhöht sie", () => {
  const basis = { sKva: 500, skMva: 20, psiGrad: 60 };
  const neutral = spannungsaenderung(basis);
  const unter = spannungsaenderung({ ...basis, cosPhi: 0.9, erregung: "untererregt" });
  const ueber = spannungsaenderung({ ...basis, cosPhi: 0.9, erregung: "uebererregt" });
  // cos(60° + 25,84°) = 0,0725 → 0,181 %; cos(60° − 25,84°) = 0,8274 → 2,07 %
  nahe(unter, 0.1813, 2e-3);
  nahe(ueber, 2.0686, 2e-3);
  assert.ok(unter < neutral && neutral < ueber);
});

test("phiGrad: cos φ 0,9 → 25,84°, übererregt negativ", () => {
  nahe(phiGrad(0.9), 25.842, 1e-2);
  nahe(phiGrad(0.9, "uebererregt"), -25.842, 1e-2);
  assert.equal(phiGrad(1), 0);
});

test("Ungültige Eingaben ergeben NaN", () => {
  assert.ok(Number.isNaN(spannungsaenderung({ sKva: 0, skMva: 20, psiGrad: 60 })));
  assert.ok(Number.isNaN(spannungsaenderung({ sKva: 100, skMva: -1, psiGrad: 60 })));
  assert.ok(Number.isNaN(spannungsaenderung({ sKva: 100, skMva: 2, psiGrad: "x" })));
});

test("Ampel: 3 % NS, 2 % MS laut TOR D2; gelb ab 80 % der Grenze", () => {
  assert.equal(GRENZEN.NS.grenzeProzent, 3);
  assert.equal(GRENZEN.MS.grenzeProzent, 2);
  assert.equal(ampel(1.0, "NS").stufe, "gruen");
  assert.equal(ampel(2.5, "NS").stufe, "gelb");
  assert.equal(ampel(3.01, "NS").stufe, "rot");
  assert.equal(ampel(1.7, "MS").stufe, "gelb");
  assert.equal(ampel(2.5, "MS").stufe, "rot");
  assert.equal(ampel(NaN).stufe, "unbekannt");
});

test("Nötiger cos φ: Handrechnung 1 MVA an 20 MVA, ψ = 60°", () => {
  // NS ohne Q: 0,05 · 0,5 = 2,5 % < 3 % → nicht nötig
  const a = noetigerCosPhi({ sKva: 1000, skMva: 20, psiGrad: 60, netzebene: "NS" });
  assert.equal(a.noetig, false);
  assert.equal(a.cosPhi, null);
  // MS (2 %): cos(60° + φ) ≤ 0,02·20000/1000 = 0,4 → 60° + φ ≥ 66,42° → φ ≥ 6,42° → cos φ ≈ 0,994
  const b = noetigerCosPhi({ sKva: 1000, skMva: 20, psiGrad: 60, netzebene: "MS" });
  assert.equal(b.noetig, true);
  nahe(b.cosPhi, 0.994, 1e-3);
  nahe(b.phiGrad, 6.4, 0.1);
  assert.equal(b.imBereich, true);
});

test("Nötiger cos φ außerhalb des TOR-Bereichs wird gemeldet", () => {
  // 300 kVA an 2 MVA, ψ = 30°, NS: ohne Q 0,15·0,866 = 13 % → cos(30°+φ) ≤ 0,2 → φ ≥ 48,5° → cos φ 0,66 < 0,925
  const r = noetigerCosPhi({ sKva: 300, skMva: 2, psiGrad: 30, netzebene: "NS", typ: "B" });
  assert.equal(r.noetig, true);
  assert.equal(r.imBereich, false);
  assert.ok(r.cosPhi < 0.925);
  assert.match(r.hinweis, /Netzbetreiber/);
});

test("Maximale Scheinleistung bei cos φ = 1", () => {
  // NS: 0,03 · 20000 / cos 60° = 1200 kVA
  nahe(maxScheinleistungKva({ skMva: 20, psiGrad: 60, netzebene: "NS" }), 1200, 0.1);
  // MS: 0,02 · 100000 / cos 75° = 7727,4 kVA
  nahe(maxScheinleistungKva({ skMva: 100, psiGrad: 75, netzebene: "MS" }), 7727.4, 0.2);
});

test("Zeigerdiagramm: Längsanteil entspricht Δu, Betrag knapp darüber", () => {
  const z = zeiger({ sKva: 500, skMva: 20, psiGrad: 60 });
  nahe(z.laengs * 100, 1.25, 1e-6);
  nahe(z.vp.re, 1.0125, 1e-6);
  nahe(z.vp.im, (0.5 / 20) * Math.sin(Math.PI / 3), 1e-6);
  assert.ok(z.betragProzent >= 1.25 && z.betragProzent < 1.3);
  assert.equal(zeiger({ sKva: 0, skMva: 20, psiGrad: 60 }), null);
});

test("Zeigerdiagramm bei cos φ < 1: Längsanteil = Δu für unter- und übererregt", () => {
  // 200 kVA an 5 MVA, ψ = 45°, cos φ = 0,95 (φ ≈ 18,19°)
  // untererregt: 0,04 · cos(63,19°) ≈ 1,80 %; übererregt: 0,04 · cos(26,81°) ≈ 3,57 %
  const basis = { sKva: 200, skMva: 5, psiGrad: 45, cosPhi: 0.95 };
  for (const erregung of ["untererregt", "uebererregt"]) {
    const e = { ...basis, erregung };
    const z = zeiger(e);
    nahe(z.laengs * 100, spannungsaenderung(e), 1e-9);
    assert.ok(z.betragProzent >= z.laengs * 100 - 1e-9, `${erregung}: Betrag unter Längsanteil`);
  }
  const unter = zeiger({ ...basis, erregung: "untererregt" });
  const ueber = zeiger({ ...basis, erregung: "uebererregt" });
  nahe(unter.laengs * 100, 1.805, 2e-3);
  nahe(ueber.laengs * 100, 3.570, 2e-3);
  assert.ok(unter.laengs < ueber.laengs, "untererregt muss den kürzeren ΔU-Zeiger liefern");
  assert.ok(unter.betragProzent < ueber.betragProzent);
  assert.ok(unter.strom.im > 0 && ueber.strom.im < 0, "Blindanteil: untererregt positiv, übererregt negativ");
});

test("bewerte(): Gesamtergebnis mit Netzebene MS", () => {
  const r = bewerte({ sKva: 2000, skMva: 100, psiGrad: 75, netzebene: "MS" });
  nahe(r.deltaUProzent, 0.518, 1e-3);
  assert.equal(r.ampel.stufe, "gruen");
  assert.equal(r.grenze.grenzeProzent, 2);
  assert.equal(r.cosPhi.noetig, false);
});

test("Datenblatt: ohne Freigabe keine Werte sichtbar, keine Herstellerbezeichnung", () => {
  assert.equal(DATENBLATT.freigegeben, false);
  assert.equal(FREIGEGEBENE_WERTE.length, 0, "Solange freigegeben:false ist, darf kein Wert ausgespielt werden");
  for (const g of DATENBLATT.gruppen) for (const z of g.zeilen) assert.equal(z.freigegeben, false, `${g.id}/${z.id} ohne Freigabe`);
  assert.equal(reglerBezeichnung(false), "Parkregler (Bezeichnung nach Rechteklärung)");
  assert.doesNotMatch(reglerBezeichnung(false), /Solensa|Ökovolt/);
});

test("Prüfplan: Sollwertsprünge 100/60/30/0 %, Q-Verfahren-Test und Rückfallwert", () => {
  assert.deepEqual(PRUEFPLAN_STUFEN, [100, 60, 30, 0]);
  const p = pruefplan({ pmaxKw: 800, qVerfahren: "qu", rueckfallProzent: 70, typ: "B" });
  const sprung = p.schritte.filter((s) => s.art === "sollwertsprung");
  assert.deepEqual(sprung.map((s) => s.sollProzent), [100, 60, 30, 0]);
  assert.deepEqual(sprung.map((s) => s.sollKw), [800, 480, 240, 0]);
  assert.ok(sprung.every((s) => /1 min/.test(s.frist)));
  assert.ok(p.schritte.some((s) => s.art === "q-verfahren" && /Q\(U\)/.test(s.titel)));
  const rf = p.schritte.find((s) => s.art === "rueckfall");
  assert.equal(rf.sollKw, 560);
  assert.ok(/Netzbetreiber/.test(p.hinweis));
  assert.throws(() => pruefplan({ pmaxKw: 0 }));
});

test("Kennlinien: Typ A bezieht Qmax auf Sr (0,436·Sr), nicht auf Pmax", () => {
  const k = lies("src/components/Technik/KennlinieInteraktiv.js");
  assert.match(k, /QMAX_SR_TYP_A\s*=\s*0\.436/);
  assert.doesNotMatch(k, /QMAX_PMAX_TYP_A/);
  assert.match(k, /Q\/Sr bei Typ A/);
  const s = lies("src/components/Technik/Kennlinien.js");
  assert.match(s, /0,436·Sr/);
  assert.doesNotMatch(s, /Qmax\/Pmax bei Typ A/);
  const r = lies("src/content/ratgeber/eza-regler-parkregler.js");
  assert.match(r, /Qmax = ±0,436·Sr/);
  assert.match(r, /bis 3,68 kVA 0,312·Sr/);
});

test("Fernwartung: NISG 2026 gilt seit 1. Oktober 2026 mit Quelle", () => {
  const f = lies("src/app/technik/fernwartung/page.js");
  assert.match(f, /gilt seit 1\. Oktober 2026/);
  assert.match(f, /BGBl\. I Nr\. 94\/2025/);
  assert.doesNotMatch(f, /tritt am 1\. Oktober 2026 in Kraft/);
});

test("Parkregler-Seite: kein „selbst entwickelter“ Regler ohne Rechteklärung, Schaltbild und Datenblatt-Weg eingebaut", () => {
  const p = lies("src/app/technik/parkregler/page.js");
  assert.doesNotMatch(p, /selbst entwickelten Parkregler/);
  assert.match(p, /PARKREGLER_SATZ/);
  assert.match(p, /Einlinienschaltbild/);
  assert.match(p, /\/technik\/parkregler\/datenblatt/);
});

test("Einlinienschaltbild: NE7/NE6/NE5, fokussierbare Bauteile, Tabellen-Alternative", () => {
  const e = lies("src/components/Technik/Einlinienschaltbild.js");
  for (const k of ["ne7", "ne6", "ne5"]) assert.match(e, new RegExp(`k: "${k}"`));
  assert.match(e, /role="button"/);
  assert.match(e, /tabIndex=\{0\}/);
  assert.match(e, /e\.key === "Enter" \|\| e\.key === " "/);
  assert.match(e, /<table/);
  assert.match(e, /laut Ihrem Netzbetreiber/);
  assert.match(e, /Funktion[\s\S]*TOR-Bezug[\s\S]*Typischer Nachweis/);
});

test("Simulator- und Datenblatt-Seite: Pflichthinweise und Gate-Kennung", () => {
  const s = lies("src/app/technik/netzanschluss-simulator/page.js") + lies("src/components/Technik/NetzanschlussSimulator.js");
  assert.match(s, /Vereinfachte Vorabschätzung, verbindlich prüft der Netzbetreiber/);
  assert.match(s, /TOR D2/);
  assert.match(s, /IAEW/);
  assert.match(s, /Richtwert\/Orientierung/);
  const d = lies("src/app/technik/parkregler/datenblatt/page.js");
  assert.match(d, /Datenblatt in Vorbereitung/);
  assert.match(d, /FREIGEGEBENE_WERTE/);
  assert.match(d, /PARKREGLER_RECHTE_GEKLAERT/);
  assert.match(lies("src/components/Technik/PruefplanGenerator.js"), /"fachplaner-paket"/);
});
