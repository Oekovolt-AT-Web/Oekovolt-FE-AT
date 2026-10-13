// Tests für den Rechenkern des Hybridpark-Konfigurators (Welle C, Paket C03):
//   src/components/Technik/hybridpark.js (reine Funktionen, ohne React/Aliase).
// Aufruf: node scripts/hybridpark.test.mjs
//
// Geprüft: TOR-Summenregel und Typgrenzen, Energiebilanzen (Erzeugung, Abregelung, Speicher),
// Monotonie (mehr Netzleistung/Speicher → weniger Abregelung), Randfälle und der CSV-Export.

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { ANNAHMEN, STANDARD, bereinige, hybridparkCsv, simuliereHybridpark, torEinordnung, torTyp } from "../src/components/Technik/hybridpark.js";

const nah = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)), `${a} ≉ ${b}`);

describe("TOR-Typ", () => {
  test("Schwellen nach RfG-Schwellenwert-V", () => {
    assert.equal(torTyp(0.5), null);
    assert.equal(torTyp(0.8), "A");
    assert.equal(torTyp(249.9), "A");
    assert.equal(torTyp(250), "B");
    assert.equal(torTyp(34999), "B");
    assert.equal(torTyp(35000), "C");
    assert.equal(torTyp(49999), "C");
    assert.equal(torTyp(50000), "D");
  });
  test("Summenregel: PV-AC + BESS-Leistung", () => {
    const t = torEinordnung({ pvAcKw: 30000, bessKw: 10000, netzKw: 30000 });
    assert.equal(t.summeKw, 40000);
    assert.equal(t.typ, "C");
    assert.equal(t.typBegrenzt, "B");
    assert.equal(t.abweichung, true);
    assert.match(t.regelwerk, /Typ C/);
  });
  test("ohne Abweichung, wenn Begrenzung den Typ nicht ändert", () => {
    const t = torEinordnung({ pvAcKw: 5000, bessKw: 2000, netzKw: 3000 });
    assert.equal(t.typ, "B");
    assert.equal(t.abweichung, false);
  });
});

describe("Simulation", () => {
  const std = simuliereHybridpark(STANDARD);

  test("spezifischer Ertrag entspricht der Annahme (vor Clipping)", () => {
    nah(std.pvDc / std.kwp, ANNAHMEN.ertragProKwp, 0.01);
    nah(std.pvDc - std.clipping, std.pvAc);
  });

  test("Abregelung mit Speicher ≤ ohne Speicher, beides ≥ 0", () => {
    assert.ok(std.abregelungOhne > 0);
    assert.ok(std.abregelungMit >= 0);
    assert.ok(std.abregelungMit < std.abregelungOhne);
    nah(std.vermieden, std.abregelungOhne - std.abregelungMit);
  });

  test("Energiebilanz Speicher: Laden = Entladen + Verluste + Restladung", () => {
    nah(std.ladenPv + std.ladenNetz, std.entladen + std.speicherVerluste + std.restladung);
    assert.ok(std.speicherVerluste >= 0);
    // Verluste passen zum Round-Trip-Wirkungsgrad
    nah(std.entladen / (std.ladenPv + std.ladenNetz - std.restladung / ANNAHMEN.wirkungsgrad), std.roundTrip, 0.01);
  });

  test("Energiebilanz Netz: Einspeisung mit Speicher = AC − Abregelung − Ladung aus PV + Entladung", () => {
    nah(std.einspeisungMit, std.pvAc - std.abregelungMit - std.ladenPv + std.entladen);
    nah(std.einspeisungOhne, std.pvAc - std.abregelungOhne);
    // Durch Speicherverluste nie mehr Einspeisung als die vermiedene Abregelung zulässt
    assert.ok(std.einspeisungMit - std.einspeisungOhne <= std.vermieden + 1e-6);
  });

  test("Monatssummen ergeben die Jahreswerte", () => {
    const s = (k) => std.monate.reduce((a, m) => a + m[k], 0);
    nah(s("pvAc"), std.pvAc);
    nah(s("abrOhne"), std.abregelungOhne);
    nah(s("abrMit"), std.abregelungMit);
    nah(s("entladen"), std.entladen);
    assert.equal(std.monate.length, 12);
  });

  test("Vollzyklen = Entladung / Nennkapazität, plausibel < 365 ohne Netzladung", () => {
    nah(std.vollzyklen, std.entladen / STANDARD.bessKwh);
    assert.ok(std.vollzyklen > 0 && std.vollzyklen < 365);
  });

  test("ohne Speicher: keine Ladung, Abregelung unverändert", () => {
    const r = simuliereHybridpark({ ...STANDARD, bessKw: 0, bessKwh: 0 });
    assert.equal(r.entladen, 0);
    assert.equal(r.vollzyklen, 0);
    nah(r.abregelungMit, r.abregelungOhne);
    assert.equal(r.tor.summeKw, STANDARD.pvAcKw);
  });

  test("Netzanschluss ≥ PV-AC: keine Abregelung", () => {
    const r = simuliereHybridpark({ ...STANDARD, netzKw: STANDARD.pvAcKw });
    assert.equal(r.abregelungOhne, 0);
    assert.equal(r.abregelungMit, 0);
    assert.equal(r.stundenMitAbregelung, 0);
  });

  test("Monotonie: kleinerer Netzanschluss → mehr Abregelung; größerer Speicher → weniger", () => {
    const eng = simuliereHybridpark({ ...STANDARD, netzKw: 2000 });
    assert.ok(eng.abregelungOhne > std.abregelungOhne);
    const gross = simuliereHybridpark({ ...STANDARD, bessKwh: 8000 });
    assert.ok(gross.abregelungMit <= std.abregelungMit + 1e-6);
  });

  test("Speicherbezug erhöht die Zyklen, ohne die Abregelung zu verschlechtern", () => {
    const r = simuliereHybridpark({ ...STANDARD, bezugKw: 2000 });
    assert.ok(r.ladenNetz > 0);
    assert.ok(r.vollzyklen > std.vollzyklen);
    assert.ok(r.abregelungMit <= std.abregelungMit * 1.02, `${r.abregelungMit} vs ${std.abregelungMit}`);
  });

  test("Deterministisch: gleiche Eingabe = gleiches Ergebnis", () => {
    const a = simuliereHybridpark(STANDARD);
    assert.equal(a.abregelungMit, std.abregelungMit);
  });

  test("Bereinigung begrenzt Eingaben", () => {
    const b = bereinige({ pvAcKw: -5, dcAc: 9, netzKw: "abc", bessKwh: 1e9 });
    assert.equal(b.pvAcKw, 100);
    assert.equal(b.dcAc, 1.6);
    assert.equal(b.netzKw, 50);
    assert.equal(b.bessKwh, 400000);
  });
});

describe("CSV-Export", () => {
  test("Kopf mit Stand und Richtwert-Hinweis, 12 Monate + Jahr", () => {
    const csv = hybridparkCsv(simuliereHybridpark(STANDARD));
    const zeilen = csv.split("\r\n");
    assert.match(zeilen[0], /Stand 2026-/);
    assert.match(csv, /Richtwert\/Orientierung/);
    assert.match(csv, /keine Ertrags- oder Erlöszusage/);
    const daten = zeilen.filter((z) => !z.startsWith("#"));
    assert.equal(daten.length, 1 + 12 + 1);
    assert.ok(daten.every((z) => z.split(";").length === 6));
    assert.match(daten.at(-1), /^Jahr;/);
  });
});
