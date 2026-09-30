// Tests für src/data/kennzahlen.js (zahlText, kz, Kennzahlen-Satz) und die Nutzung in src/data/hero.js.
// Aufruf: node scripts/kennzahlen.test.mjs

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { srcUrl } from "./lib/alias.mjs";
import { CO2_KENNZAHL, CO2_ZEITRAUM, KENNZAHLEN, KENNZAHLEN_HINWEIS, KENNZAHLEN_SATZ, KENNZAHLEN_STAND, kz, zahlText } from "../src/data/kennzahlen.js";

describe("zahlText – Tausenderpunkt ohne Intl", () => {
  test("ganze Zahlen", () => {
    assert.equal(zahlText(0), "0");
    assert.equal(zahlText(7), "7");
    assert.equal(zahlText(999), "999");
    assert.equal(zahlText(1000), "1.000");
    assert.equal(zahlText(12345), "12.345");
    assert.equal(zahlText(340000), "340.000");
    assert.equal(zahlText(1234567), "1.234.567");
    assert.equal(zahlText(1_000_000_000), "1.000.000.000");
  });
  test("negative Zahlen und Zeichenketten", () => {
    assert.equal(zahlText(-1234), "-1.234");
    assert.equal(zahlText(-999), "-999");
    assert.equal(zahlText("5000"), "5.000");
    assert.equal(zahlText(""), "");
  });
  test("gleiches Ergebnis wie de-AT-Formatierung für ganze Zahlen (Stichprobe)", () => {
    for (const n of [0, 5, 1000, 25000, 340000, 112000, 9876543]) {
      assert.equal(zahlText(n), n.toLocaleString("de-DE"), String(n));
    }
  });
  test(
    "Befund: Dezimalzahlen werden falsch gruppiert",
    { todo: "Befund tests-02: src/data/kennzahlen.js Z. 23 – zahlText(1234.5) → „1.234.5“, zahlText(1234.567) → „1.234.567“ (liest sich wie 1,2 Mio.), zahlText(0.12345) → „0.12.345“; nur ganze Zahlen übergeben (aktuelle Aufrufer runden vorher)" },
    () => {
      assert.equal(zahlText(1234.5), "1.234,5");
      assert.equal(zahlText(0.12345), "0,12345");
    }
  );
});

describe("KENNZAHLEN / kz", () => {
  // SEO-Plan M25/E6: Die CO₂-Zahl erscheint nur mit festgelegtem Zeitraum („ausgefüllt oder entfernt“).
  test("Kennzahlen: eindeutige ids, positive ganze Zahlen, CO₂ nur mit Zeitraum", () => {
    assert.deepEqual(KENNZAHLEN.map((k) => k.id), CO2_ZEITRAUM ? ["anlagen", "leistung", "co2"] : ["anlagen", "leistung"]);
    assert.equal(CO2_KENNZAHL.zahl, 112000);
    for (const k of KENNZAHLEN) {
      assert.ok(Number.isInteger(k.zahl) && k.zahl > 0, k.id);
      assert.ok(k.label && !k.label.endsWith(" "), k.id);
    }
    assert.match(KENNZAHLEN_STAND, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(KENNZAHLEN_HINWEIS, "Angaben Ökovolt Österreich");
  });
  test("kz: formatierter Wert, unbekannte id leer", () => {
    assert.equal(kz("anlagen"), "5.000");
    assert.equal(kz("leistung"), "510.000");
    assert.equal(kz("co2"), CO2_ZEITRAUM ? "112.000" : "");
    assert.equal(kz("gibt-es-nicht"), "");
  });
  test("KENNZAHLEN_SATZ: Fließtext ohne Zeitraum-Platzhalter", () => {
    const erwartet = `5.000 PV-Kraftwerke errichtet, 510.000 kWp installierte Leistung${CO2_ZEITRAUM ? `, 112.000 t CO₂-Einsparung ${CO2_ZEITRAUM}` : ""}`;
    assert.equal(KENNZAHLEN_SATZ, erwartet);
    if (!CO2_ZEITRAUM) assert.doesNotMatch(KENNZAHLEN_SATZ, /CO₂/);
    assert.doesNotMatch(KENNZAHLEN_SATZ, /undefined|NaN|\s$/);
  });
  test("hero.js übernimmt die Kennzahlen mit Suffix", async () => {
    const hero = await import(srcUrl("data/hero.js"));
    const liste = Object.values(hero).find((v) => Array.isArray(v) && v.some((x) => x?.wert === "510.000 kWp"));
    assert.ok(liste, "Kennzahl „510.000 kWp“ in hero.js gefunden");
    assert.ok(liste.some((x) => x.wert === "5.000" && x.zahl === 5000));
    assert.equal(liste.some((x) => x.wert === "112.000 t"), Boolean(CO2_ZEITRAUM), "CO₂-Kennzahl nur mit Zeitraum");
  });
});
