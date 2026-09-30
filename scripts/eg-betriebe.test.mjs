// Tests für src/lib/egBetriebe.js – Aufruf: node scripts/eg-betriebe.test.mjs
import assert from "node:assert/strict";
import { teilnahmeCheck, modellStatus, netzentgelt, gemeindeMindestmenge, pflichten, rechnerLink, GRENZEN } from "../src/lib/egBetriebe.js";
import { egAusParams } from "../src/lib/rechner/energiegemeinschaft.js";

const status = (r, id) => r.modelle.find((m) => m.id === id).status;

// Großunternehmen: nie EEG, BEG/P2P ja, über 6 MW nur bedingt
let r = teilnahmeCheck({ akteur: "gross", rolle: "erzeuger", nahebereich: "lokal", leistungKw: 2000 });
assert.equal(status(r, "eeg"), "nein");
assert.equal(status(r, "beg"), "ja");
assert.equal(status(r, "p2p"), "ja");
assert.equal(status(r, "gea"), "nein"); // nicht im Gebäude
assert.equal(r.empfehlung.modell, "beg");
assert.ok(r.pflichten.some((p) => p.id === "lieferant"));
assert.ok(r.pflichten.some((p) => p.id === "6mw"));

r = teilnahmeCheck({ akteur: "gross", rolle: "erzeuger", nahebereich: "regional", leistungKw: 8000 });
assert.equal(status(r, "beg"), "bedingt");
assert.equal(status(r, "p2p"), "bedingt");
assert.match(r.pflichten.find((p) => p.id === "6mw").titel, /überschritten/);
assert.match(r.pflichten.find((p) => p.id === "6mw").text, /8\.000 kW/);

// Grenze exakt 6 MW ist noch zulässig
assert.equal(modellStatus("beg", { akteur: "gross", nahebereich: "lokal", leistungKw: 6000, rolle: "erzeuger" }).status, "ja");
assert.equal(modellStatus("beg", { akteur: "gross", nahebereich: "lokal", leistungKw: 6001, rolle: "erzeuger" }).status, "bedingt");
// Abnehmer: Leistung irrelevant
r = teilnahmeCheck({ akteur: "gross", rolle: "abnehmer", nahebereich: "lokal", leistungKw: 9000 });
assert.equal(r.eingabe.leistungKw, 0);
assert.equal(status(r, "beg"), "ja");
assert.ok(!r.pflichten.some((p) => p.id === "6mw" || p.id === "lieferant"));

// Gebäude: GEA empfohlen, für Großunternehmen "prüfen"
r = teilnahmeCheck({ akteur: "kmu", rolle: "beides", nahebereich: "gebaeude", leistungKw: 80 });
assert.equal(status(r, "gea"), "ja");
assert.equal(r.empfehlung.modell, "gea");
assert.ok(!r.pflichten.some((p) => p.id === "lieferant")); // 80 kW < 100 kW
assert.ok(r.pflichten.some((p) => p.id === "haupttaetigkeit"));
assert.equal(teilnahmeCheck({ akteur: "gross", rolle: "erzeuger", nahebereich: "gebaeude", leistungKw: 500 }).modelle.find((m) => m.id === "gea").status, "pruefen");

// Lieferantenpflichten: > 100 kW, nicht bei genau 100 kW
assert.ok(!pflichten({ akteur: "kmu", rolle: "erzeuger", leistungKw: GRENZEN.lieferantSonstigeKw, nahebereich: "lokal" }).some((p) => p.id === "lieferant"));
assert.ok(pflichten({ akteur: "kmu", rolle: "erzeuger", leistungKw: 101, nahebereich: "lokal" }).some((p) => p.id === "lieferant"));

// Gemeinde: 10-%-Regel mit Richtwert (1.050 kWh/kWp)
const g = gemeindeMindestmenge(100);
assert.deepEqual(g, { erzeugung: 105000, mindest: 10500, haushalte: 3 });
assert.equal(gemeindeMindestmenge(-5).mindest, 0);
r = teilnahmeCheck({ akteur: "gemeinde", rolle: "erzeuger", nahebereich: "lokal", leistungKw: 250 });
const z = r.pflichten.find((p) => p.id === "zehnprozent");
assert.ok(z);
assert.match(z.text, /262\.500 kWh/);
assert.match(z.text, /26\.250 kWh/);
assert.equal(status(r, "eeg"), "ja");
assert.equal(r.empfehlung.modell, "eeg");
assert.ok(r.pflichten.some((p) => p.id === "vergabe"));
// Gemeinde nur als Abnehmer: keine 10-%-Pflicht
assert.ok(!teilnahmeCheck({ akteur: "gemeinde", rolle: "abnehmer", nahebereich: "lokal" }).pflichten.some((p) => p.id === "zehnprozent"));

// Netzentgelt
assert.match(netzentgelt("eeg", "lokal").bis2026, /57 %/);
assert.match(netzentgelt("eeg", "regional").bis2026, /28 %.*64 %/);
assert.match(netzentgelt("beg", "lokal").bis2026, /keine Reduktion/);
assert.match(netzentgelt("p2p", "weit").ab2027, /volle Netzentgelt/);
assert.match(netzentgelt("beg", "regional").ab2027, /noch offen/);

// Österreichweit: Hinweis ohne Netzvorteil, Empfehlung BEG
r = teilnahmeCheck({ akteur: "kmu", rolle: "erzeuger", nahebereich: "weit", leistungKw: 50 });
assert.ok(r.pflichten.some((p) => p.id === "weit"));
assert.equal(r.empfehlung.modell, "beg");

// Ungültige Eingaben werden auf Standardwerte gesetzt
r = teilnahmeCheck({ akteur: "x", rolle: "y", nahebereich: "z", leistungKw: NaN });
assert.deepEqual(r.eingabe, { akteur: "kmu", rolle: "erzeuger", nahebereich: "lokal", leistungKw: 0 });

// Rechner-Link lässt sich vom Rechner wieder einlesen
const link = rechnerLink({ akteur: "gross", rolle: "erzeuger", leistungKw: 800, nahebereich: "lokal" });
assert.ok(link.startsWith("/rechner/energiegemeinschaft?"));
const sp = new URLSearchParams(link.split("?")[1]);
const e = egAusParams((k) => sp.get(k));
assert.equal(e.modell, "beg");
assert.equal(e.teilnehmer[0].typ, "betrieb");
assert.equal(e.teilnehmer[0].kwp, 800);
assert.equal(e.teilnehmer[0].gross, true);
assert.equal(e.teilnehmer[0].ne, "6");
assert.equal(e.egPreisCt, null);
const lg = new URLSearchParams(rechnerLink({ akteur: "gemeinde", rolle: "abnehmer", leistungKw: 0, nahebereich: "regional" }).split("?")[1]);
const eg = egAusParams((k) => lg.get(k));
assert.equal(eg.modell, "regional");
assert.equal(eg.teilnehmer[0].typ, "gemeinde");
assert.equal(eg.teilnehmer[0].kwp, 0);
assert.equal(eg.teilnehmer[1].typ, "betrieb");

console.log("eg-betriebe: alle Tests bestanden");
