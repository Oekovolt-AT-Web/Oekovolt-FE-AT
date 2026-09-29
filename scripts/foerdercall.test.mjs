// Tests für src/lib/foerdercall.js – Aufruf: node scripts/foerdercall.test.mjs
import assert from "node:assert/strict";
import { callPhase, naechstesZiel, restZeit, kategorieFuer, schaetzeFoerderung, euro, FOERDERCALL } from "../src/lib/foerdercall.js";
const T = (s) => Date.parse(s);
// Phasen
assert.equal(callPhase(T("2026-09-30T12:00:00+02:00")), "vor");
assert.equal(callPhase(T("2026-10-08T16:59:59+02:00")), "vor");
assert.equal(callPhase(T("2026-10-08T17:00:00+02:00")), "ticket");
assert.equal(callPhase(T("2026-10-09T07:59:59+02:00")), "ticket");
assert.equal(callPhase(T("2026-10-09T08:00:00+02:00")), "einreichung");
assert.equal(callPhase(T("2026-10-22T23:58:59+02:00")), "einreichung");
assert.equal(callPhase(T("2026-10-22T23:59:00+02:00")), "nach");
assert.equal(callPhase(NaN), "vor");
assert.equal(naechstesZiel(T("2026-09-30T12:00:00+02:00")).iso, FOERDERCALL.ticketStart);
assert.equal(naechstesZiel(T("2026-10-30T12:00:00+01:00")).iso, null);
// Restzeit
const r = restZeit(T("2026-10-08T17:00:00+02:00"), T("2026-09-30T12:00:00+02:00"));
assert.deepEqual([r.tage, r.stunden, r.minuten, r.sekunden], [8, 5, 0, 0]);
assert.equal(restZeit(0, 1000).gesamtMs, 0);
// Kategorien
assert.equal(kategorieFuer(0), null);
assert.equal(kategorieFuer(10).id, "A");
assert.equal(kategorieFuer(10.01).id, "B");
assert.equal(kategorieFuer(20).id, "B");
assert.equal(kategorieFuer(100).id, "C");
assert.equal(kategorieFuer(100.5).id, "D");
assert.equal(kategorieFuer(1500).id, "D");
// Kat. A: 8 kWp + 10 kWh
let e = schaetzeFoerderung({ kwp: 8, speicherKwh: 10 });
assert.equal(e.pv, 1200); assert.equal(e.speicher.betrag, 1500); assert.equal(e.summe, 2700);
// Speicher zu klein: 20 kWp -> min 10 kWh
e = schaetzeFoerderung({ kwp: 20, speicherKwh: 9.9 });
assert.equal(e.kategorie.id, "B"); assert.equal(e.pv, 2800); assert.equal(e.speicher.ok, false); assert.equal(e.speicher.grund, "zu-klein"); assert.equal(e.summe, 2800);
e = schaetzeFoerderung({ kwp: 20, speicherKwh: 10 });
assert.equal(e.speicher.ok, true); assert.equal(e.summe, 4300);
// Kat. C 80 kWp + 40 kWh, Höchstsatz
e = schaetzeFoerderung({ kwp: 80, speicherKwh: 40 });
assert.equal(e.pv, 10400); assert.equal(e.speicher.betrag, 6000); assert.equal(e.summe, 16400);
// Gebot 100 €/kWp
e = schaetzeFoerderung({ kwp: 80, speicherKwh: 40, gebot: 100 });
assert.equal(e.satz, 100); assert.equal(e.pv, 8000);
// Gebot über Höchstsatz
e = schaetzeFoerderung({ kwp: 80, gebot: 200 });
assert.equal(e.satz, 130);
// Gebot in Kat. A ignoriert
assert.equal(schaetzeFoerderung({ kwp: 5, gebot: 50 }).satz, 150);
// Speicher max 50 kWh: 150 kWp braucht 75 kWh -> 50 kWh gefördert
e = schaetzeFoerderung({ kwp: 150, speicherKwh: 80 });
assert.equal(e.kategorie.id, "D"); assert.equal(e.pv, 18000); assert.equal(e.speicher.kwhFoerderfaehig, 50); assert.equal(e.speicher.betrag, 7500);
// Über 1.000 kWp anteilig
e = schaetzeFoerderung({ kwp: 1200 });
assert.equal(e.kwpFoerderfaehig, 1000); assert.equal(e.pv, 120000);
// Deckel 30 %
e = schaetzeFoerderung({ kwp: 10, speicherKwh: 10, kostenPv: 5000, kostenSpeicher: 30000 });
assert.equal(e.pv, 1500); assert.equal(e.speicher.betrag, 1500); assert.equal(e.gedeckelt, false);
e = schaetzeFoerderung({ kwp: 10, speicherKwh: 10, kostenPv: 3000, kostenSpeicher: 4000 });
assert.equal(e.pv, 900); assert.equal(e.speicher.betrag, 1200); assert.equal(e.gedeckelt, true);
assert.equal(schaetzeFoerderung({ kwp: 10 }).mindestKostenPv, 5000);
// Nur Speicher
e = schaetzeFoerderung({ kwp: 0, speicherKwh: 10 });
assert.equal(e.kategorie, null); assert.equal(e.summe, 0);
// Ungültige Eingaben
assert.equal(schaetzeFoerderung({ kwp: "abc" }).summe, 0);
assert.equal(schaetzeFoerderung().summe, 0);
assert.equal(euro(16400), "16.400 €");
console.log("alle Tests ok");
