// Tests für src/lib/experimente.js (A/B-Test-Infrastruktur)
// Aufruf: node scripts/experimente.test.mjs
import assert from "node:assert/strict";
import {
  EXPERIMENTE,
  EXP_HEADER,
  _zuruecksetzen,
  aktiveZuweisungen,
  auswerten,
  endeVon,
  expFuerEreignis,
  expKennung,
  experimenteFuerPfad,
  headerWert,
  laeuft,
  leseHeader,
  middlewareZuweisung,
  normalVerteilung,
  normalisierePfad,
  pfadPasst,
  stichprobeJeVariante,
  varianteAusHeader,
  vorschauVariante,
  waehleVariante,
  zufallszahl,
  zuweisen,
} from "../src/lib/experimente.js";

let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  console.log("ok -", name);
};
const nah = (a, b, eps = 1e-4) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);

const JETZT = new Date("2026-09-30T10:00:00Z");
const TEST = [
  { id: "k1", seiten: ["/angebot"], varianten: ["a", "b"], gewichte: [50, 50], aktiv: true, bis: "2026-12-31", ort: "client" },
  { id: "s1", seiten: ["/ratgeber/*"], varianten: ["a", "b", "c"], gewichte: [0, 1, 3], aktiv: true, bis: "2026-10-31", ort: "server" },
  { id: "alt", seiten: ["/angebot"], varianten: ["a", "b"], gewichte: [50, 50], aktiv: true, bis: "2026-09-29", ort: "server" },
  { id: "aus", seiten: ["/"], varianten: ["a", "b"], aktiv: false, ort: "server" },
];

test("Verzeichnis: K1 vorhanden, standardmäßig inaktiv, gültige Felder", () => {
  const k1 = EXPERIMENTE.find((e) => e.id === "k1");
  assert.ok(k1);
  assert.equal(k1.aktiv, false);
  assert.deepEqual(k1.varianten, ["a", "b"]);
  assert.equal(k1.gewichte.length, k1.varianten.length);
  assert.ok(endeVon(k1.bis));
  assert.equal(EXP_HEADER, "x-ov-exp");
  for (const e of EXPERIMENTE) {
    assert.match(e.id, /^[a-z0-9]{1,12}$/);
    assert.ok(["client", "server"].includes(e.ort));
    assert.equal(new Set(EXPERIMENTE.map((x) => x.id)).size, EXPERIMENTE.length, "IDs eindeutig");
  }
});

test("laeuft: aktiv, Enddatum einschließlich, inaktiv", () => {
  assert.equal(laeuft(TEST[0], JETZT), true);
  assert.equal(laeuft(TEST[2], JETZT), false); // abgelaufen
  assert.equal(laeuft(TEST[3], JETZT), false); // aus
  assert.equal(laeuft({ ...TEST[0], bis: "2026-09-30" }, new Date("2026-09-30T22:00:00Z")), true); // 23:00 Wien (UTC+1-Näherung)
  assert.equal(laeuft({ ...TEST[0], bis: "2026-09-30" }, new Date("2026-10-01T00:00:00Z")), false);
  assert.equal(laeuft({ ...TEST[0], bis: "30.09.2026" }, JETZT), false); // ungültiges Datum → nicht laufen lassen
  assert.equal(laeuft({ ...TEST[0], varianten: ["a"] }, JETZT), false);
});

test("Pfade: Normalisierung und Muster", () => {
  assert.equal(normalisierePfad("/angebot/?x=1#y"), "/angebot");
  assert.equal(normalisierePfad(""), "/");
  assert.equal(pfadPasst("/angebot", "/angebot/"), true);
  assert.equal(pfadPasst("/angebot", "/angebot-x"), false);
  assert.equal(pfadPasst("/ratgeber/*", "/ratgeber/pv"), true);
  assert.equal(pfadPasst("/ratgeber/*", "/ratgeber"), false);
  assert.deepEqual(experimenteFuerPfad("/angebot", { jetzt: JETZT, verzeichnis: TEST }).map((e) => e.id), ["k1"]);
  assert.deepEqual(experimenteFuerPfad("/angebot", { ort: "server", jetzt: JETZT, verzeichnis: TEST }), []);
});

test("waehleVariante: Gewichte, Grenzen, Gleichverteilung als Rückfall", () => {
  const e = TEST[1]; // 0 : 1 : 3
  assert.equal(waehleVariante(e, 0), "b"); // Gewicht 0 für a
  assert.equal(waehleVariante(e, 0.24), "b");
  assert.equal(waehleVariante(e, 0.26), "c");
  assert.equal(waehleVariante(e, 0.9999999), "c");
  assert.equal(waehleVariante(e, 5), "c");
  assert.equal(waehleVariante({ varianten: ["a", "b"], gewichte: [1] }, 0.6), "b");
  assert.equal(waehleVariante({ varianten: ["a", "b"], gewichte: [0, 0] }, 0.6), "a");
  // Verteilung über viele Ziehungen ~ 50/50
  let b = 0;
  for (let i = 0; i < 20000; i++) if (waehleVariante(TEST[0], zufallszahl()) === "b") b++;
  assert.ok(b > 9500 && b < 10500, `b = ${b}`);
});

test("Header: schreiben, lesen, Unbekanntes verwerfen", () => {
  assert.equal(headerWert({ s1: "b", k1: "a", "X!": "b" }), "k1=a;s1=b");
  assert.deepEqual(leseHeader("k1=b; s1=c ;zz=a;s1", TEST), { k1: "b", s1: "c" });
  assert.deepEqual(leseHeader("k1=z", TEST), {});
  assert.deepEqual(leseHeader(null, TEST), {});
  assert.equal(varianteAusHeader("s1=c", "s1", { jetzt: JETZT, verzeichnis: TEST }), "c");
  assert.equal(varianteAusHeader("", "s1", { jetzt: JETZT, verzeichnis: TEST }), "a"); // Kontrolle
  assert.equal(varianteAusHeader("alt=b", "alt", { jetzt: JETZT, verzeichnis: TEST }), "a"); // abgelaufen → Kontrolle
  assert.equal(varianteAusHeader("x=b", "gibtsnicht", { verzeichnis: TEST }), null);
});

test("Middleware-Zuweisung: nur laufende Server-Tests auf passenden Pfaden", () => {
  assert.equal(middlewareZuweisung("/ratgeber/pv", { zufall: () => 0.9, jetzt: JETZT, verzeichnis: TEST }), "s1=c");
  assert.equal(middlewareZuweisung("/ratgeber/pv", { zufall: () => 0.1, jetzt: JETZT, verzeichnis: TEST }), "s1=b");
  assert.equal(middlewareZuweisung("/angebot", { jetzt: JETZT, verzeichnis: TEST }), ""); // k1 client, alt abgelaufen
  assert.equal(middlewareZuweisung("/", { jetzt: JETZT, verzeichnis: TEST }), ""); // aus
  // Echtes Verzeichnis: derzeit kein serverseitiger Test → Middleware setzt keinen Header
  assert.equal(middlewareZuweisung("/angebot"), "");
});

test("Client-Zuweisung im Arbeitsspeicher: stabil je Seitenaufruf, Kontrolle ohne Test", () => {
  _zuruecksetzen();
  const o = { jetzt: JETZT, verzeichnis: TEST, pfad: "/angebot" };
  assert.equal(zuweisen("k1", { ...o, zufall: () => 0.7 }), "b");
  assert.equal(zuweisen("k1", { ...o, zufall: () => 0.1 }), "b"); // bleibt bis zum Neuladen
  assert.equal(zuweisen("k1", { ...o, pfad: "/kontakt" }), "a"); // falsche Seite → Kontrolle
  assert.equal(zuweisen("aus", { ...o, pfad: "/" }), "a");
  assert.equal(zuweisen("gibtsnicht", o), null);
  // Echtes Verzeichnis: K1 ist aus → immer Kontrolle, keine exp-Kennung in Ereignissen
  _zuruecksetzen();
  assert.equal(zuweisen("k1", { pfad: "/angebot", zufall: () => 0.99 }), "a");
  assert.deepEqual(aktiveZuweisungen(), {});
  assert.equal(expFuerEreignis(), "");
});

test("exp-Kennung für Ereignisse", () => {
  assert.equal(expKennung({ k1: "b" }), "k1:b");
  assert.equal(expKennung({ s1: "a", k1: "b" }), "k1:b,s1:a");
  assert.equal(expKennung({ "k 1": "b", k2: "" }), "");
  assert.ok(expKennung(Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`t${i}`, "a"]))).length <= 80);
});

test("Vorschau per ?ov-exp= (auch bei inaktivem Test, ohne Zählung)", () => {
  assert.equal(vorschauVariante("?ov-exp=k1:b", "k1"), "b"); // echtes Verzeichnis, K1 aus
  assert.equal(vorschauVariante("?x=1&ov-exp=s1:c,k1:a", "k1", TEST), "a");
  assert.equal(vorschauVariante("?ov-exp=k1:z", "k1"), null);
  assert.equal(vorschauVariante("", "k1"), null);
  assert.equal(vorschauVariante("?ov-exp=k1:b", "gibtsnicht"), null);
  _zuruecksetzen();
  vorschauVariante("?ov-exp=k1:b", "k1");
  assert.equal(expFuerEreignis(), "");
});

test("Normalverteilung", () => {
  nah(normalVerteilung(0), 0.5);
  nah(normalVerteilung(1.959964), 0.975);
  nah(normalVerteilung(-1.644854), 0.05);
});

test("Auswertung: Zwei-Stichproben-Test für Anteile", () => {
  // Beispiel: A 1.000 gesehen / 50 Anfragen (5 %), B 1.000 / 75 (7,5 %)
  const r = auswerten({ a: { gesehen: 1000, anfragen: 50 }, b: { gesehen: 1000, anfragen: 75 } });
  nah(r.quoteA, 0.05);
  nah(r.quoteB, 0.075);
  nah(r.veraenderung, 0.5);
  // z = 0,025 / sqrt(0,0625 * 0,9375 * 0,002) = 2,3094
  nah(r.z, 2.3094, 1e-3);
  nah(r.p, 0.0209, 1e-3);
  assert.equal(r.signifikant, true);
  const gleich = auswerten({ a: { gesehen: 500, anfragen: 25 }, b: { gesehen: 500, anfragen: 26 } });
  assert.equal(gleich.signifikant, false);
  const leer = auswerten({ a: { gesehen: 0, anfragen: 0 }, b: { gesehen: 10, anfragen: 1 } });
  assert.equal(leer.p, null);
  assert.equal(leer.signifikant, false);
  const unsinn = auswerten({ a: { gesehen: 10, anfragen: 20 }, b: { gesehen: 10, anfragen: -3 } }); // gekappt
  assert.equal(unsinn.quoteA, 1);
  assert.equal(unsinn.quoteB, 0);
});

test("Stichprobenplanung", () => {
  // Basis 5 %, +20 % relativ (5 % → 6 %): Lehrbuchwert ≈ 8.155 je Gruppe
  const n1 = stichprobeJeVariante(0.05, 0.2);
  assert.ok(n1 > 8000 && n1 < 8300, `n = ${n1}`);
  assert.ok(stichprobeJeVariante(0.05, 0.5) < n1);
  assert.equal(stichprobeJeVariante(0, 0.2), null);
  assert.equal(stichprobeJeVariante(0.9, 0.2), null);
});

console.log(`\n${n} Tests bestanden.`);
