// Tests für src/lib/rechner/investition.js, modellvergleich.js und src/lib/dossier/ablage.js
// Aufruf: node scripts/investition.test.mjs
//
// Excel-Referenz (LibreOffice/Excel-Formeln, nachgerechnet am 11.10.2026):
//   Kapitalwert: =NBW(10%;300;400;500)-1000         → −21,04
//                =NBW(5%;12000;…×10)-100000 → −7.339,18 (Annuitätenfaktor 7,72173)
//   DSCR:        =150000/100000 → 1,50; =80000/100000 → 0,80
//   Annuität:    =RMZ(5%;10;-100000) → 12.950,46
import assert from "node:assert/strict";
import { INVESTITION, SENSITIVITAET_VARIANTEN, dscr, kapitalwert, projektCashflow, sensitivitaet, zahl } from "../src/lib/rechner/investition.js";
import { VERGLEICH_MODELLE, eingabenOffen, rechneModellvergleich } from "../src/lib/rechner/modellvergleich.js";
import { DOSSIER_MAX, dossierEntfernen, dossierHinzufuegen, dossierLeeren, dossierLesen, eintragErzeugen } from "../src/lib/dossier/ablage.js";
import { annuitaet } from "../src/lib/rechner/gewerbepv.js";
import { STANDARD_EINGABEN, VARIANTEN, beispielRechnung, dossierRechnung, eingabenAlsUrl, eingabenLesen, gateKennung } from "../src/lib/dossier/rechnung.js";

const nahe = (a, b, tol, text) => assert.ok(Math.abs(a - b) <= tol, `${text}: ${a} ≠ ${b} (±${tol})`);
let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  console.log(`ok ${n} – ${name}`);
};

/* ------------------------------------------------------------ Kapitalwert */
test("kapitalwert: Excel =NBW(10%;300;400;500)-1000 = −21,04", () => {
  nahe(kapitalwert([-1000, 300, 400, 500], 0.1), -21.04, 0.01, "NPV");
});

test("kapitalwert: 10 × 12.000 bei 5 % gegen 100.000 (Excel −7.339,18)", () => {
  nahe(kapitalwert([-100000, ...Array(10).fill(12000)], 0.05), -7339.18, 0.01, "NPV Annuität");
  nahe(kapitalwert([-100, 110], 0.1), 0, 1e-9, "Nullpunkt");
  assert.ok(Number.isNaN(kapitalwert([1], -1)), "ungültiger Zins");
  assert.ok(Number.isNaN(kapitalwert(null, 0.05)), "keine Zahlungen");
});

/* ------------------------------------------------------------ Annuität / DSCR */
test("annuitaet: Excel =RMZ(5%;10;-100000) = 12.950,46", () => {
  nahe(annuitaet(100000, 0.05, 10), 12950.46, 0.01, "RMZ");
});

test("dscr: 150.000/100.000 = 1,5; 80.000/100.000 = 0,8; Jahre ohne Schuldendienst ausgelassen", () => {
  const d = dscr([150000, 80000, 120000], [100000, 100000, 0]);
  nahe(d.jahre[0].dscr, 1.5, 1e-9, "Jahr 1");
  nahe(d.jahre[1].dscr, 0.8, 1e-9, "Jahr 2");
  assert.equal(d.jahre[2].dscr, null);
  nahe(d.min, 0.8, 1e-9, "Minimum");
  nahe(d.mittel, 1.15, 1e-9, "Mittel");
  assert.equal(d.unterEins, 1);
  assert.equal(d.jahreMitSchuldendienst, 2);
});

/* ------------------------------------------------------------ Projekt-Cashflow */
const EINFACH = {
  kwp: 100,
  ertragProKwp: 1000,
  eigenverbrauchsquote: 0.5,
  strompreisCt: 20,
  einspeiseCt: 5,
  strompreisSteigerung: 0,
  degradation: 0,
  betriebskostenSteigerung: 0,
  investition: 100000,
  zuschuss: 0,
  betriebskosten: 1000,
  kalkulationszins: 0.05,
  ifb: false,
  kredit: null,
  jahre: 25,
};

test("projektCashflow: händisch nachrechenbar (Jahr 1 = 50.000×0,20 + 50.000×0,05 − 1.000 = 11.500 €)", () => {
  const r = projektCashflow(EINFACH);
  assert.equal(r.jahre, 25);
  nahe(r.jahr1.cfads, 11500, 1e-6, "CFADS Jahr 1");
  nahe(r.jahr1.netto, 11500, 1e-6, "netto Jahr 1 ohne IFB");
  nahe(r.summe, 25 * 11500 - 100000, 1e-6, "Summe über 25 Jahre");
  // Excel: =NBW(5%; 11500 ×25) − 100000 = 11500 × 14,09394 − 100000 = 62.080,33
  nahe(r.kapitalwert, 62080.33, 0.05, "Kapitalwert");
  nahe(r.amortisation, 100000 / 11500, 1e-6, "Amortisation linear");
  assert.equal(r.kredit, null);
  assert.equal(r.kapitalwertKredit, null);
  assert.ok(r.irr > 0.09 && r.irr < 0.11, `IRR plausibel: ${r.irr}`);
});

test("projektCashflow: Kredit zum Kalkulationszins ändert den Kapitalwert nicht, DSCR = CFADS/Annuität", () => {
  const r = projektCashflow({ ...EINFACH, kredit: { fremdkapitalAnteil: 0.8, zins: 0.05, jahre: 10 } });
  nahe(r.kredit.betrag, 80000, 1e-9, "Kreditbetrag");
  nahe(r.kredit.rate, annuitaet(80000, 0.05, 10), 1e-9, "Annuität");
  nahe(r.kapitalwertKredit, r.kapitalwert, 0.01, "Kapitalwert mit/ohne Kredit beim Kalkulationszins");
  nahe(r.kredit.dscr.jahre[0].dscr, 11500 / annuitaet(80000, 0.05, 10), 1e-9, "DSCR Jahr 1");
  assert.equal(r.kredit.dscr.jahreMitSchuldendienst, 10);
  nahe(r.reihe[9].restschuld, 0, 0.01, "Restschuld nach 10 Jahren");
  nahe(r.eigenkapital, 20000, 1e-9, "Eigenkapital");
  nahe(r.reihe[0].zinsen, 4000, 1e-9, "Zinsen Jahr 1");
});

test("projektCashflow: Standardwerte liefern plausible Richtwerte", () => {
  const r = projektCashflow();
  assert.equal(r.eingaben.kwp, INVESTITION.kwp);
  assert.ok(r.investition > 100000 && r.investition < 400000, `Investition 250 kWp: ${r.investition}`);
  assert.ok(r.kapitalwert > 0, "Kapitalwert positiv");
  assert.ok(r.ifb.effekt > 0, "IFB-Effekt gesetzt");
  assert.ok(r.lcoeCt > 3 && r.lcoeCt < 15, `LCOE plausibel: ${r.lcoeCt}`);
  assert.equal(r.reihe.length, 25);
});

/* ------------------------------------------------------------ Sensitivität */
test("sensitivitaet: vier Varianten, sortiert nach Spanne, Richtung stimmt", () => {
  const s = sensitivitaet(EINFACH);
  assert.equal(s.zeilen.length, SENSITIVITAET_VARIANTEN.length);
  nahe(s.basis, 62080.33, 0.05, "Basis = Kapitalwert");
  for (let i = 1; i < s.zeilen.length; i++) assert.ok(s.zeilen[i - 1].spanne >= s.zeilen[i].spanne, "sortiert");
  const strom = s.zeilen.find((z) => z.id === "strompreis");
  assert.ok(strom.hoch.kapitalwert > strom.niedrig.kapitalwert, "höherer Strompreis → höherer Kapitalwert");
  nahe(strom.hoch.wert, 26, 1e-9, "+30 % Strompreis");
  const inv = s.zeilen.find((z) => z.id === "investition");
  assert.ok(inv.hoch.kapitalwert < inv.niedrig.kapitalwert, "höhere Investition → niedrigerer Kapitalwert");
  nahe(inv.hoch.kapitalwert, s.basis - 15000, 0.05, "+15 % Investition = −15.000 €");
  const ev = s.zeilen.find((z) => z.id === "eigenverbrauch");
  nahe(ev.hoch.wert, 0.6, 1e-9, "+10 Pp. Eigenverbrauch");
  const deg = s.zeilen.find((z) => z.id === "degradation");
  assert.ok(deg.hoch.kapitalwert < s.basis, "mehr Degradation → weniger Kapitalwert");
});

/* ------------------------------------------------------------ Modellvergleich */
test("modellvergleich: sechs Modelle, Dachpacht ohne Investition, keine Anbieternamen", () => {
  const r = rechneModellvergleich({ ...EINFACH, kredit: { eigenkapitalAnteil: 0.2, zins: 0.05, jahre: 10 }, pacht: { eurProKwpJahr: 10, jahre: 20, index: 0 } });
  assert.equal(r.modelle.length, 6);
  assert.deepEqual(
    r.modelle.map((m) => m.id),
    ["eigenkapital", "kredit", "leasing", "contracting", "ppa", "pacht"]
  );
  const pacht = r.modelle.find((m) => m.id === "pacht");
  nahe(pacht.summe, 100 * 10 * 20, 1e-6, "Pacht-Summe 100 kWp × 10 €/kWp × 20 J.");
  nahe(pacht.liquiditaetJahr1, 1000, 1e-6, "Pacht Jahr 1");
  nahe(pacht.kapitalwert, kapitalwert([0, ...Array(20).fill(1000)], 0.05), 1e-6, "Pacht-Kapitalwert");
  assert.equal(pacht.eigentumEnde, false);
  const ek = r.modelle.find((m) => m.id === "eigenkapital");
  nahe(ek.liquiditaetJahr1, -100000 + 11500, 1e-6, "Liquidität Jahr 1 Kauf EK");
  const kredit = r.modelle.find((m) => m.id === "kredit");
  nahe(kredit.kapitalwert, ek.kapitalwert, 0.01, "Kredit zum Kalkulationszins = Kauf EK");
  const maxKw = Math.max(...r.modelle.map((m) => m.kapitalwert));
  assert.ok(r.besteIds.length >= 1 && r.modelle.find((m) => m.id === r.besterId).kapitalwert === maxKw, "bester = höchster Kapitalwert");
  for (const m of r.modelle) {
    assert.ok(Array.isArray(m.eingaben) && m.eingaben.length >= 2, `Eingaben offengelegt: ${m.id}`);
    assert.ok(typeof m.ifbAfa === "string" && m.ifbAfa.length > 3, `IFB/AfA-Text: ${m.id}`);
  }
  const text = JSON.stringify([VERGLEICH_MODELLE, r.hinweise, r.modelle.map((m) => m.eingaben)]);
  for (const verboten of ["Raiffeisen", "Erste", "Sparkasse", "Bank Austria", "UniCredit", "Oberbank", "BAWAG", "Grenke", "Ökovolt bietet", "unser Contracting"]) {
    assert.ok(!text.includes(verboten), `kein Anbietername: ${verboten}`);
  }
  assert.ok(eingabenOffen("pacht", r.basis, {}).some(([l]) => /Beispiel/.test(l)), "Pacht als Beispiel gekennzeichnet");
});

/* ------------------------------------------------------------ Dossier-Ablage */
function speicherAttrappe() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}

test("ablage: Eintrag normalisieren, ablegen, ersetzen, Grenze 10, entfernen, leeren", () => {
  const s = speicherAttrappe();
  assert.equal(eintragErzeugen({ quelle: "javascript:alert(1)", titel: "x" }), null, "nur Seitenpfade als Quelle");
  assert.equal(eintragErzeugen({ quelle: "/standort-check" }), null, "Titel Pflicht");
  const e = eintragErzeugen({ quelle: "/standort-check", titel: "Standort-Check Ostermiething", kennzahlen: [{ label: "Ertrag", wert: "1.050", einheit: "kWh/kWp" }, { label: "", wert: "x" }], annahmen: ["PVGIS 5.3", ["Neigung", "30°"]], stand: "11.10.2026", art: "standort", eingaben: { kwp: 30, email: "a@b.c".repeat(20), tief: { ok: true } } });
  assert.equal(e.kennzahlen.length, 1, "leere Kennzahl verworfen");
  assert.equal(e.annahmen.length, 2);
  assert.equal(e.eingaben.kwp, 30);
  assert.equal(e.eingaben.email, undefined, "lange Texte nicht übernommen");
  assert.equal(e.eingaben.tief.ok, true);
  assert.ok(e.id && e.zeit > 0);

  assert.equal(dossierLesen(s).length, 0);
  let r = dossierHinzufuegen(e, s);
  assert.ok(r.ok && !r.ersetzt && r.liste.length === 1);
  r = dossierHinzufuegen({ ...e, titel: "Standort-Check Ostermiething (neu)" }, s);
  assert.ok(r.ersetzt && r.liste.length === 1 && r.liste[0].titel.endsWith("(neu)"), "gleiche id ersetzt");

  for (let i = 0; i < 15; i++) dossierHinzufuegen({ quelle: "/foerdercheck", titel: `Förder-Check ${i}`, kennzahlen: [{ label: "Programme", wert: String(i) }] }, s);
  const liste = dossierLesen(s);
  assert.equal(liste.length, DOSSIER_MAX, "höchstens 10");
  assert.equal(liste[0].titel, "Förder-Check 14", "neueste zuerst");

  const rest = dossierEntfernen(liste[0].id, s);
  assert.equal(rest.length, DOSSIER_MAX - 1);
  assert.equal(dossierLeeren(s).length, 0);
  assert.equal(dossierLesen(s).length, 0);
  assert.equal(dossierHinzufuegen({ quelle: "", titel: "" }, s).ok, false, "ungültiger Eintrag");
});

test("ablage: kaputter Speicher stört nicht", () => {
  const kaputt = {
    getItem: () => {
      throw new Error("blockiert");
    },
    setItem: () => {
      throw new Error("blockiert");
    },
  };
  assert.deepEqual(dossierLesen(kaputt), []);
  assert.equal(dossierHinzufuegen({ quelle: "/dossier", titel: "x", kennzahlen: [] }, kaputt).ok, false);
  const s = speicherAttrappe();
  s.setItem("ov-dossier", "{kein json");
  assert.deepEqual(dossierLesen(s), []);
});

test("zahl(): Format", () => {
  assert.equal(zahl(1234567.891, 1), "1.234.567,9");
  assert.equal(zahl(-12.3), "−12");
});

/* ------------------------------------------------------------ Dossier-Rechnung */
test("dossier: eingabenLesen ist idempotent (Anteile bleiben Anteile) und URL-Runde stimmt", () => {
  const e = eingabenLesen({ ...STANDARD_EINGABEN, eigenverbrauchsquote: 0.62, kalkulationszins: 0.06, fremdkapitalAnteil: 0.5, kwp: 400 });
  nahe(e.eigenverbrauchsquote, 0.62, 1e-9, "EV-Quote");
  nahe(eingabenLesen(e).eigenverbrauchsquote, 0.62, 1e-9, "zweimal gelesen");
  nahe(e.kalkulationszins, 0.06, 1e-9, "WACC");
  const url = eingabenAlsUrl(e);
  assert.match(url, /^\/rechner\/investitionsantrag\?/);
  const aus = eingabenLesen(Object.fromEntries(new URLSearchParams(url.split("?")[1])), { ausUrl: true });
  assert.equal(aus.kwp, 400);
  nahe(aus.eigenverbrauchsquote, 0.62, 1e-9, "EV aus URL");
  nahe(aus.fremdkapitalAnteil, 0.5, 1e-9, "FK aus URL");
  // Grenzen: Unsinn wird begrenzt, Fremdes fällt weg
  const b = eingabenLesen({ ev: "250", kwp: "-3", foo: "x" }, { ausUrl: true });
  assert.equal(b.eigenverbrauchsquote, 1);
  assert.equal(b.kwp, 5);
  assert.equal(b.foo, undefined);
});

test("dossier: Varianten, Kennung, Vergabe nur im Gemeinderat, CO₂-Text mit Berichtsjahr", () => {
  assert.deepEqual(
    VARIANTEN.map((v) => v.id),
    ["cfo", "bank", "gemeinderat", "investitionsantrag"]
  );
  assert.equal(gateKennung("cfo"), "dossier");
  assert.equal(gateKennung("investitionsantrag"), "investitionsantrag");
  const cfo = dossierRechnung({}, { variante: "cfo" });
  assert.equal(cfo.vergabe, null);
  assert.equal(cfo.cashflow.reihe.length, 25);
  assert.equal(cfo.modell.modelle.length, 6);
  assert.ok(cfo.kennzahlen.every((k) => k.label && k.wert), "Kennzahlen vollständig");
  assert.ok(cfo.annahmen.length >= 10);
  const gr = dossierRechnung({}, { variante: "gemeinderat" });
  assert.ok(gr.vergabe?.bau?.wege?.length > 0, "Vergabewege");
  const an = dossierRechnung({ berichtsjahr: 2028 }, { variante: "investitionsantrag" });
  assert.match(an.co2Text, /2028/);
  assert.equal(beispielRechnung().beispiel, true);
  // Kapitalwert der Dossier-Rechnung = Kapitalwert des Projekt-Cashflows mit denselben Annahmen
  nahe(cfo.cashflow.kapitalwert, projektCashflow({ ...INVESTITION, kredit: { fremdkapitalAnteil: 0.8, zins: 0.05, jahre: 10 } }).kapitalwert, 1, "Kapitalwert konsistent");
});

console.log(`\n${n} Tests bestanden.`);
