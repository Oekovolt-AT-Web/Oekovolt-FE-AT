// Tests für src/lib/marktindizes.js (Speicher-Spread-Index, Solar-Marktwert) mit fixen Preisreihen,
// plus Plausibilitätsprüfung der erzeugten Dateien unter data/marktindizes/ (falls vorhanden).
// Aufruf: node scripts/marktindizes.test.mjs

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  SPEICHER,
  csvText,
  erwarteteSchritte,
  gruppiere,
  indexAus,
  monatLabel,
  monatKurz,
  monatVon,
  monateZwischen,
  monatsIndex,
  naechsterMonat,
  schrittMinuten,
  solarMarktwert,
  summeLetzte,
  tagVon,
  tageImMonat,
  tagesSpread,
} from "../src/lib/marktindizes.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VS = 900000; // Viertelstunde in ms

// 1. September 2026, 00:00 Wien (MESZ = UTC+2)
const SEP_START = Date.UTC(2026, 7, 31, 22, 0, 0);

/** Ein Tag mit 96 Viertelstunden: Grundpreis 50, 8 günstige (10) am Anfang, 8 teure (110) am Abend */
function musterTag(start, { billig = 10, teuer = 110, basis = 50 } = {}) {
  const punkte = [];
  for (let i = 0; i < 96; i++) {
    let eurMwh = basis;
    if (i < 8) eurMwh = billig;
    if (i >= 72 && i < 80) eurMwh = teuer;
    punkte.push({ t: start + i * VS, eurMwh });
  }
  return punkte;
}

describe("Kalender (Europe/Vienna)", () => {
  test("tagVon/monatVon rechnen in Wiener Ortszeit", () => {
    assert.equal(tagVon(SEP_START), "2026-09-01");
    assert.equal(tagVon(SEP_START - 1), "2026-08-31");
    assert.equal(monatVon(SEP_START), "2026-09");
    // Winterzeit: 1. Jänner 2026 00:00 Wien = 31.12.2025 23:00 UTC
    assert.equal(monatVon(Date.UTC(2025, 11, 31, 23)), "2026-01");
    assert.equal(monatVon(Date.UTC(2025, 11, 31, 22, 59)), "2025-12");
  });
  test("Monatsfunktionen", () => {
    assert.equal(naechsterMonat("2026-12"), "2027-01");
    assert.equal(naechsterMonat("2026-09"), "2026-10");
    assert.deepEqual(monateZwischen("2025-11", "2026-02"), ["2025-11", "2025-12", "2026-01", "2026-02"]);
    assert.equal(tageImMonat("2024-02"), 29);
    assert.equal(tageImMonat("2026-09"), 30);
    assert.equal(erwarteteSchritte("2026-09"), 2880);
    assert.equal(erwarteteSchritte("2026-03"), 31 * 96 - 4, "März: 23-Stunden-Tag");
    assert.equal(erwarteteSchritte("2026-10"), 31 * 96 + 4, "Oktober: 25-Stunden-Tag");
    assert.equal(monatLabel("2026-09"), "September 2026");
    assert.match(monatKurz("2026-09"), /^Sep/);
  });
  test("schrittMinuten und gruppiere", () => {
    const tag = musterTag(SEP_START);
    assert.equal(schrittMinuten(tag), 15);
    assert.equal(schrittMinuten([{ t: 0 }, { t: 3600000 }]), 60);
    const g = gruppiere([...musterTag(SEP_START), ...musterTag(SEP_START + 96 * VS)], tagVon);
    assert.deepEqual([...g.keys()], ["2026-09-01", "2026-09-02"]);
    assert.equal(g.get("2026-09-02").length, 96);
  });
});

describe("tagesSpread – theoretische Obergrenze", () => {
  test("Standardspeicher 1 MWh / 0,5 MW: 8 Lade- und 8 Entladeviertelstunden, Round-Trip 88 %", () => {
    const s = tagesSpread(musterTag(SEP_START));
    assert.ok(s);
    assert.equal(s.schritte, 8);
    assert.equal(s.ladeMittel, 10);
    assert.equal(s.entladeMittel, 110);
    // 110 €/MWh × 1 MWh × 0,88 − 10 €/MWh × 1 MWh = 86,8 €
    assert.equal(s.erloesEur, 86.8);
    assert.equal(s.ladeFenster.length, 8);
    assert.equal(s.ladeFenster[0], SEP_START);
    assert.equal(s.entladeFenster[0], SEP_START + 72 * VS);
  });
  test("Reihenfolge der Punkte spielt keine Rolle", () => {
    const tag = musterTag(SEP_START).reverse();
    assert.equal(tagesSpread(tag).erloesEur, 86.8);
  });
  test("Stundenpreise als vier gleiche Viertelstunden (bis 09/2025) ergeben 2 Lade- und 2 Entladestunden", () => {
    const punkte = [];
    for (let h = 0; h < 24; h++) {
      const eurMwh = h < 2 ? 10 : h >= 18 && h < 20 ? 110 : 50;
      for (let q = 0; q < 4; q++) punkte.push({ t: SEP_START + (h * 4 + q) * VS, eurMwh });
    }
    const s = tagesSpread(punkte);
    assert.equal(s.ladeMittel, 10);
    assert.equal(s.entladeMittel, 110);
    assert.equal(s.erloesEur, 86.8);
  });
  test("flacher Tag: Spread negativ (Verluste), keine Erlöszusage", () => {
    const tag = musterTag(SEP_START, { billig: 50, teuer: 50, basis: 50 });
    assert.equal(tagesSpread(tag).erloesEur, -6);
  });
  test("negative Preise erhöhen den Spread (Bezahlung fürs Laden)", () => {
    const s = tagesSpread(musterTag(SEP_START, { billig: -20 }));
    assert.equal(s.erloesEur, Math.round((110 * 0.88 + 20) * 100) / 100);
  });
  test("andere Speicher: 1 MWh / 1 MW → 4 Viertelstunden; 2 MWh / 0,5 MW → 16", () => {
    assert.equal(tagesSpread(musterTag(SEP_START), { ...SPEICHER, leistungMw: 1 }).schritte, 4);
    assert.equal(tagesSpread(musterTag(SEP_START), { ...SPEICHER, kapazitaetMwh: 2 }).schritte, 16);
    // 1 MW: Laden 4 × 10, Entladen 4 × 110 → gleiche Mittel, gleicher Spread
    assert.equal(tagesSpread(musterTag(SEP_START), { ...SPEICHER, leistungMw: 1 }).erloesEur, 86.8);
  });
  test("unvollständige Tage liefern null, Zeitumstellungstage (92/100 Viertelstunden) nicht", () => {
    assert.equal(tagesSpread(musterTag(SEP_START).slice(0, 50)), null);
    assert.equal(tagesSpread([]), null);
    assert.ok(tagesSpread(musterTag(SEP_START).slice(0, 92)));
    const lang = [...musterTag(SEP_START), ...Array.from({ length: 4 }, (_, i) => ({ t: SEP_START + (96 + i) * VS, eurMwh: 50 }))];
    assert.ok(tagesSpread(lang));
  });
  test("Werte ohne Zahl werden ignoriert", () => {
    const tag = musterTag(SEP_START);
    tag[5] = { t: tag[5].t, eurMwh: null };
    const s = tagesSpread(tag);
    assert.ok(s);
    assert.equal(s.ladeMittel, Math.round(((7 * 10 + 50) / 8) * 100) / 100);
  });
});

describe("solarMarktwert – PV-gewichteter Preis", () => {
  test("Gewichtung", () => {
    const preise = [
      { t: 1, eurMwh: 10 },
      { t: 2, eurMwh: 20 },
      { t: 3, eurMwh: 30 },
    ];
    const pv = [
      { t: 1, mw: 0 },
      { t: 2, mw: 1 },
      { t: 3, mw: 3 },
    ];
    assert.equal(solarMarktwert(preise, pv), (20 * 1 + 30 * 3) / 4);
  });
  test("ohne PV oder ohne Überschneidung null", () => {
    assert.equal(solarMarktwert([{ t: 1, eurMwh: 10 }], []), null);
    assert.equal(solarMarktwert([{ t: 1, eurMwh: 10 }], [{ t: 2, mw: 5 }]), null);
    assert.equal(solarMarktwert([{ t: 1, eurMwh: 10 }], [{ t: 1, mw: 0 }]), null);
  });
  test("negative Mittagspreise drücken den Solar-Marktwert unter das Mittel", () => {
    const preise = [
      { t: 1, eurMwh: 100 },
      { t: 2, eurMwh: -10 },
    ];
    const pv = [
      { t: 1, mw: 0 },
      { t: 2, mw: 500 },
    ];
    assert.equal(solarMarktwert(preise, pv), -10);
  });
});

describe("monatsIndex / indexAus", () => {
  // September 2026 mit 30 Mustertagen, Tag 1 mit 8 negativen Viertelstunden
  const monat = [];
  for (let d = 0; d < 30; d++) monat.push(...musterTag(SEP_START + d * 96 * VS, d === 0 ? { billig: -5 } : {}));
  const pv = monat.map((p) => ({ t: p.t, mw: (p.t - SEP_START) / VS % 96 >= 72 && (p.t - SEP_START) / VS % 96 < 80 ? 1000 : 0 }));

  test("Kennzahlen eines vollständigen Monats", () => {
    const m = monatsIndex("2026-09", monat, pv);
    assert.equal(m.monat, "2026-09");
    assert.equal(m.viertelstunden, 2880);
    assert.equal(m.abdeckung, 1);
    assert.equal(m.schrittMin, 15);
    assert.equal(m.negativ, 8);
    assert.equal(m.negativStunden, 2);
    assert.equal(m.min, -5);
    assert.equal(m.max, 110);
    assert.equal(m.spreadTage, 30);
    // Tag 1: 110 × 0,88 + 5 = 101,8; übrige 29 Tage: 86,8
    const erwartet = 101.8 + 29 * 86.8;
    assert.equal(m.spreadErloesEur, Math.round(erwartet));
    assert.equal(m.spreadProTag, Math.round((erwartet / 30) * 100) / 100);
    assert.equal(m.spreadJeKwh, Math.round((erwartet / 1000) * 1000) / 1000);
    // Mittel: je Tag (8·10 + 8·110 + 80·50)/96 = 51,67; Tag 1 mit −5 statt 10
    const summe = 29 * (8 * 10 + 8 * 110 + 80 * 50) + (8 * -5 + 8 * 110 + 80 * 50);
    assert.equal(m.mittel, Math.round((summe / 2880) * 100) / 100);
    // PV nur in den teuren Abendviertelstunden → Solar-Marktwert = 110
    assert.equal(m.solarMarktwert, 110);
    assert.equal(m.marktwertfaktor, Math.round((110 / (summe / 2880)) * 1000) / 1000);
  });
  test("ohne PV bleibt der Solar-Marktwert null", () => {
    const m = monatsIndex("2026-09", monat, []);
    assert.equal(m.solarMarktwert, null);
    assert.equal(m.marktwertfaktor, null);
  });
  test("Lücken: fehlende Tage werden hochgerechnet und in abdeckung sichtbar", () => {
    const m = monatsIndex("2026-09", monat.slice(0, 20 * 96), []);
    assert.equal(m.spreadTage, 20);
    assert.equal(m.abdeckung, Math.round((20 / 30) * 1000) / 1000);
    // (101,8 + 19 × 86,8) / 20 × 30 = 2626,5 – Gleitkomma darf auf 2626 oder 2627 runden
    const soll = ((101.8 + 19 * 86.8) / 20) * 30;
    assert.ok(Math.abs(m.spreadErloesEur - soll) <= 0.5 + 1e-9, `${m.spreadErloesEur} ≈ ${soll}`);
  });
  test("fremde Monate werden ignoriert, leerer Monat → null", () => {
    assert.equal(monatsIndex("2026-10", monat, []), null);
  });
  test("indexAus gruppiert und sortiert nach Monat", () => {
    const okt = musterTag(SEP_START + 30 * 96 * VS);
    const idx = indexAus([...okt, ...monat], pv);
    assert.deepEqual(
      idx.map((m) => m.monat),
      ["2026-09", "2026-10"]
    );
    assert.equal(idx[1].spreadTage, 1);
    assert.equal(idx[1].abdeckung, Math.round((96 / erwarteteSchritte("2026-10")) * 1000) / 1000);
  });
  test("summeLetzte", () => {
    const reihe = Array.from({ length: 14 }, (_, i) => ({ spreadErloesEur: i + 1 }));
    assert.equal(summeLetzte(reihe, "spreadErloesEur", 12), 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14);
    assert.equal(summeLetzte(reihe.slice(0, 5), "spreadErloesEur", 12), null);
    assert.equal(summeLetzte([...reihe.slice(0, 11), { spreadErloesEur: null }], "spreadErloesEur", 12), null);
  });
});

describe("csvText", () => {
  test("Kommentare, Kopf, Zellen mit Anführungszeichen", () => {
    const csv = csvText({
      spalten: [
        { key: "a", label: "monat" },
        { key: "b", label: "wert" },
      ],
      zeilen: [
        { a: "2026-09", b: 1.5 },
        { a: "x;y", b: null },
        { a: 'sag "hallo"', b: 0 },
      ],
      kommentare: ["Lizenz CC BY 4.0"],
    });
    assert.equal(csv, '# Lizenz CC BY 4.0\nmonat;wert\n2026-09;1.5\n"x;y";\n"sag ""hallo""";0\n');
  });
});

describe("Erzeugte Dateien (data/marktindizes)", () => {
  const dateien = ["speicher-spread-index.json", "solar-marktwert.json"].map((n) => path.join(ROOT, "data", "marktindizes", n));
  const vorhanden = dateien.every((d) => fs.existsSync(d));

  test("Struktur, Sortierung, Kennzeichnung", { skip: vorhanden ? false : "noch nicht erzeugt – node scripts/marktindizes.mjs" }, () => {
    for (const d of dateien) {
      const j = JSON.parse(fs.readFileSync(d, "utf8"));
      assert.equal(j.lizenz, "CC BY 4.0");
      assert.match(j.stand, /^\d{4}-\d{2}-\d{2}$/);
      assert.match(j.hinweis, /nicht amtlich/);
      assert.ok(Array.isArray(j.monate) && j.monate.length >= 12, `${path.basename(d)}: mindestens 12 Monate`);
      const monate = j.monate.map((m) => m.monat);
      assert.deepEqual(monate, [...monate].sort(), "nach Monat sortiert");
      assert.equal(new Set(monate).size, monate.length, "keine doppelten Monate");
      for (const m of j.monate) {
        assert.match(m.monat, /^\d{4}-\d{2}$/);
        assert.ok(m.abdeckung > 0.9 && m.abdeckung <= 1.01, `${m.monat}: Abdeckung ${m.abdeckung}`);
        assert.ok(typeof m.mittel === "number" && m.mittel > -50 && m.mittel < 500, `${m.monat}: Mittel plausibel`);
        assert.ok(Number.isInteger(m.negativ) && m.negativ >= 0);
      }
    }
    const sp = JSON.parse(fs.readFileSync(dateien[0], "utf8"));
    assert.deepEqual({ kapazitaetMwh: sp.annahmen.kapazitaetMwh, leistungMw: sp.annahmen.leistungMw, roundTrip: sp.annahmen.roundTrip, zyklenProTag: sp.annahmen.zyklenProTag }, SPEICHER);
    for (const m of sp.monate) {
      assert.ok(m.spreadErloesEur != null && m.spreadErloesEur > 0 && m.spreadErloesEur < 50000, `${m.monat}: Spread ${m.spreadErloesEur}`);
      assert.ok(m.spreadTage >= 27, `${m.monat}: ${m.spreadTage} Tage`);
    }
    const so = JSON.parse(fs.readFileSync(dateien[1], "utf8"));
    for (const m of so.monate) {
      // Jeder Monat braucht die PV-Reihe (sonst ist der Abruf bei Energy-Charts gescheitert → Skript erneut laufen lassen)
      assert.ok(m.pvViertelstunden >= 0.9 * m.abdeckung * 2688, `${m.monat}: PV-Reihe fehlt (${m.pvViertelstunden})`);
      assert.ok(typeof m.solarMarktwert === "number", `${m.monat}: Solar-Marktwert fehlt`);
      if (m.solarMarktwert == null) continue;
      // Im Sommerhalbjahr drückt die PV-Mittagsspitze den Marktwert unter das Mittel; im Winter kann er
      // knapp darüber liegen (Dunkelflaute-Tage mit hohen Mittagspreisen, z. B. Dezember 2024).
      const sommer = Number(m.monat.slice(5, 7)) >= 4 && Number(m.monat.slice(5, 7)) <= 9;
      if (sommer) assert.ok(m.solarMarktwert < m.mittel, `${m.monat}: Solar-Marktwert (${m.solarMarktwert}) unter dem Monatsmittel (${m.mittel})`);
      assert.ok(m.marktwertfaktor > -1 && m.marktwertfaktor < 1.5, `${m.monat}: Faktor ${m.marktwertfaktor}`);
    }
  });
});
