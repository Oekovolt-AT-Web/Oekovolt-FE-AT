// Tests für src/components/RechnerTeilen/kodierung.js – Aufruf: node scripts/rechner-teilen.test.mjs
import assert from "node:assert/strict";
import { berichtBereinigen, datumText, dekodiere, dokumentTitel, kodiere, pruefeFelder, rasterZahl, teilenLink, wegAus, zeitpunktText } from "../src/components/RechnerTeilen/kodierung.js";

let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  console.log(`ok ${n} – ${name}`);
};

// Feldliste wie im Gewerbe-PV-Rechner (gekürzt)
const FELDER = [
  { name: "preset", k: "p", typ: "wahl", optionen: ["logistik", "hotel", "individuell"], standard: "logistik" },
  { name: "flaeche", k: "f", typ: "zahl", min: 200, max: 20000, raster: 100, standard: 6000 },
  { name: "dachart", k: "d", typ: "wahl", optionen: ["ost-west", "sued"], standard: "ost-west" },
  { name: "preisManuell", k: "ap", typ: "zahl", min: 8, max: 35, raster: 0.5, standard: null },
  { name: "leasingZins", k: "lz", typ: "zahl", min: 2, max: 9, raster: 0.25, standard: 5 },
  { name: "lokG", k: "lg", typ: "zahl", min: 50, max: 400, raster: 0.1, standard: 196.4 },
  { name: "speicherAn", k: "sa", typ: "bool", standard: false },
  { name: "eag", k: "eg", typ: "bool", standard: true },
  { name: "tage", k: "bt", typ: "zahl", min: 5, max: 7, raster: 1, standard: 6 },
];
const START = { preset: "logistik", flaeche: 6000, dachart: "ost-west", preisManuell: null, leasingZins: 5, lokG: 196.4, speicherAn: false, eag: true, tage: 6 };
const lesenAus = (query) => {
  const p = new URLSearchParams(query);
  return (k) => p.get(k);
};

test("Feldliste ist gültig", () => {
  assert.equal(pruefeFelder(FELDER), true);
  assert.throws(() => pruefeFelder([{ k: "a", typ: "zahl" }, { k: "a", typ: "zahl" }]), /doppelt/);
  assert.throws(() => pruefeFelder([{ k: "Ab", typ: "zahl" }]), /Ungültiger Schlüssel/);
  assert.throws(() => pruefeFelder([{ k: "abcde", typ: "zahl" }]), /Ungültiger Schlüssel/);
  assert.throws(() => pruefeFelder([{ k: "a", typ: "text" }]), /Unbekannter Typ/);
});

test("Startwerte ergeben einen leeren Query (kurzer Link)", () => {
  assert.equal(kodiere(FELDER, START), "");
  assert.equal(teilenLink("https://www.oekovolt.com", "/rechner/gewerbe-pv", ""), "https://www.oekovolt.com/rechner/gewerbe-pv");
});

test("Nur Abweichungen stehen im Link", () => {
  const q = kodiere(FELDER, { ...START, preset: "individuell", flaeche: 8000, speicherAn: true, eag: false });
  assert.equal(q, "p=individuell&f=8000&sa=1&eg=0");
  assert.ok(q.length < 40);
});

test("Rundreise: kodieren → dekodieren ergibt dieselben Werte", () => {
  const werte = { preset: "hotel", flaeche: 1400, dachart: "sued", preisManuell: 18.5, leasingZins: 6.75, lokG: 150.3, speicherAn: true, eag: false, tage: 7 };
  const q = kodiere(FELDER, werte);
  const zurueck = dekodiere(FELDER, lesenAus(q));
  assert.deepEqual(zurueck, werte);
});

test("Gleitkomma bleibt sauber (0,1-Raster)", () => {
  assert.equal(rasterZahl(0.30000000000000004, { raster: 0.1 }), 0.3);
  assert.equal(rasterZahl("150,34", { min: 50, max: 400, raster: 0.1 }), 150.3);
  const q = kodiere(FELDER, { ...START, lokG: 0.1 * 3 + 100 });
  assert.equal(q, "lg=100.3");
});

test("null = automatisch: nicht im Link, bei Zahl-Standard als leerer Schlüssel", () => {
  assert.equal(kodiere(FELDER, { ...START, preisManuell: null }), "");
  const felder = [{ name: "speicher", k: "sp", typ: "zahl", min: 0, max: 100, raster: 5, standard: 20 }];
  const q = kodiere(felder, { speicher: null });
  assert.equal(q, "sp=");
  assert.deepEqual(dekodiere(felder, lesenAus(q)), { speicher: null });
});

test("Ungültige oder manipulierte Werte werden begrenzt bzw. verworfen", () => {
  const w = dekodiere(FELDER, lesenAus("f=999999&d=nord&ap=abc&lz=100&sa=ja&eg=0&bt=5.4&p=<script>"));
  assert.deepEqual(w, { flaeche: 20000, leasingZins: 9, eag: false, tage: 5 });
  assert.equal(dekodiere(FELDER, lesenAus("f=-5")).flaeche, 200);
  assert.equal(dekodiere(FELDER, lesenAus("f=6049")).flaeche, 6000);
});

test("Fremde Parameter (utm, Mini-Rechner) lösen nichts aus", () => {
  assert.equal(dekodiere(FELDER, lesenAus("utm_source=linkedin&flaeche=5000&verbrauch=300")), null);
  assert.equal(dekodiere(FELDER, lesenAus("")), null);
});

test("Werte außerhalb der Optionen werden nicht kodiert", () => {
  assert.equal(kodiere(FELDER, { ...START, dachart: "unbekannt", flaeche: NaN }), "");
});

test("Link-Aufbau ohne doppelte Schrägstriche", () => {
  assert.equal(teilenLink("http://localhost:3000/", "/rechner/co2-esg", "v=600"), "http://localhost:3000/rechner/co2-esg?v=600");
});

test("Datum ohne Intl (hydrationssicher, österreichisches Format)", () => {
  const d = new Date(2026, 8, 30, 9, 5);
  assert.equal(datumText(d), "30.09.2026");
  assert.equal(zeitpunktText(d), "30.09.2026, 09:05 Uhr");
  assert.equal(dokumentTitel("CO₂- & ESG-Rechner", d), "Ökovolt CO₂- & ESG-Rechner – Ergebnis 2026-09-30");
  assert.equal(dokumentTitel('A/B:"C"', d), "Ökovolt A B C – Ergebnis 2026-09-30");
});

test("Teilen-Weg für die Statistik", () => {
  assert.equal(wegAus("Auf LinkedIn teilen"), "linkedin");
  assert.equal(wegAus("Per E-Mail teilen"), "e_mail");
  assert.equal(wegAus("Link kopieren"), "link_kopieren");
  assert.equal(wegAus("Teilen"), "teilen");
  assert.equal(wegAus(""), "unbekannt");
  assert.match(wegAus("Auf WhatsApp teilen"), /^[a-z0-9_]{2,40}$/);
});

test("Bericht bereinigen: leere Zeilen und Gruppen fallen weg, max. 4 Kennzahlen", () => {
  const b = berichtBereinigen({
    titel: "Test",
    kennzahlen: [["A", "1"], ["B", "2"], false, ["C", "3"], ["D", "4"], ["E", "5"]],
    eingaben: [{ titel: "G1", zeilen: [["x", "1"], false, ["y", ""], ["z", null], ["w", 0]] }, { titel: "leer", zeilen: [false] }, false],
    ergebnisse: [{ zeilen: [["r", "2", "Zusatz"]] }],
    annahmen: ["a", false, "", "b"],
  });
  assert.equal(b.kennzahlen.length, 4);
  assert.deepEqual(b.eingaben, [{ titel: "G1", zeilen: [["x", "1", ""], ["w", "0", ""]] }]);
  assert.deepEqual(b.ergebnisse, [{ titel: "", zeilen: [["r", "2", "Zusatz"]] }]);
  assert.deepEqual(b.annahmen, ["a", "b"]);
  assert.deepEqual(b.hinweise, []);
});

console.log(`\n${n} Tests bestanden.`);
