// Tests für src/lib/rechner/finanzierung.js – Aufruf: node scripts/finanzierung.test.mjs
// Referenzwerte: Handrechnungen (Annuität, Barwert, Amortisation) und
// finanzmathematische Gleichheiten (Kredit zum Kalkulationszins = Barwert Kauf).
import assert from "node:assert/strict";
import {
  FINANZIERUNG,
  MODELLE,
  amortisation,
  amortText,
  euroKurz,
  leasingEffektivzins,
  monatsfaktor,
  rechneFinanzierung,
  zahl,
} from "../src/lib/rechner/finanzierung.js";

const nahe = (a, b, tol, text) => assert.ok(Math.abs(a - b) <= tol, `${text}: ${a} ≠ ${b} (±${tol})`);
let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  console.log(`ok ${n} – ${name}`);
};
const modell = (r, id) => r.modelle.find((m) => m.id === id);

// Einfache, händisch nachrechenbare Basis: keine Degradation, keine Steigerung
const EINFACH = {
  kwp: 100,
  ertragProKwp: 1000,
  eigenverbrauchsquote: 0.5,
  strompreisCt: 20,
  einspeiseCt: 5,
  strompreisSteigerung: 0,
  degradation: 0,
  investition: 100000,
  betriebskosten: 1000,
  kalkulationszins: 0.05,
  ifb: false,
  eag: false,
};

/* ------------------------------------------------------------ Zahlformat */
test("zahl(): Tausenderpunkt, Dezimalkomma, Minuszeichen", () => {
  assert.equal(zahl(1234567), "1.234.567");
  assert.equal(zahl(1234.56, 1), "1.234,6");
  assert.equal(zahl(-2500), "−2.500");
  assert.equal(zahl(-0.2), "0");
  assert.equal(zahl(NaN), "–");
  assert.equal(euroKurz(1234567), "1,2 Mio. €");
  assert.equal(euroKurz(-45600), "−46 T€");
  assert.equal(amortText(0), "ab Jahr 1");
  assert.equal(amortText(null), "> 20 J.");
});

/* ------------------------------------------------------------ Faktoren */
test("monatsfaktor: 5 % / 10 Jahre ≈ 1,06 % je Monat", () => {
  nahe(monatsfaktor(0.05, 10), 1.055, 0.003, "Faktor");
  nahe(monatsfaktor(0, 10), 100 / 120, 1e-9, "zinslos");
});

test("leasingEffektivzins ist die Umkehrung von monatsfaktor", () => {
  const f = monatsfaktor(0.06, 10, 0.1);
  nahe(leasingEffektivzins(f, 10, 0.1), 0.06, 1e-5, "Zins");
  nahe(leasingEffektivzins(FINANZIERUNG.leasing.faktor, 10, 0), 0.0595, 0.001, "Standardfaktor ≈ 6 %");
});

/* ------------------------------------------------------------ Basis */
test("Energie und Nutzen Jahr 1 (Handrechnung)", () => {
  const r = rechneFinanzierung(EINFACH);
  assert.equal(r.jahre, 20);
  assert.equal(r.basis.jahresertrag, 100000);
  assert.equal(r.basis.eigenverbrauch, 50000);
  // 50.000 × 0,20 + 50.000 × 0,05 − 1.000 = 11.500 €
  nahe(r.basis.nutzenJahr1, 11500, 1e-6, "Nutzen");
  assert.equal(r.modelle.length, MODELLE.length);
  for (const m of r.modelle) assert.equal(m.reihe.length, 21, `${m.id}: 21 Einträge (Jahr 0–20)`);
});

/* ------------------------------------------------------------ Kauf */
test("Kauf mit Eigenkapital: Start −Investition, Amortisation, Barwert", () => {
  const r = rechneFinanzierung(EINFACH);
  const m = modell(r, "eigenkapital");
  assert.equal(m.reihe[0].netto, -100000);
  assert.equal(m.eigenkapital, 100000);
  // Betriebskosten steigen 2 %/Jahr → Nutzen fällt leicht; Amortisation knapp über 100.000/11.500 = 8,7 J.
  assert.ok(m.amortisation > 8.69 && m.amortisation < 9.2, `Amortisation ${m.amortisation}`);
  const bw = m.reihe.reduce((s, x) => s + x.netto / Math.pow(1.05, x.jahr), 0);
  nahe(m.barwert, bw, 1e-6, "Barwert");
  assert.ok(m.irr > 0.08 && m.irr < 0.11, `IRR ${m.irr}`);
});

test("Kredit zum Kalkulationszins hat denselben Barwert wie Eigenkapital", () => {
  const r = rechneFinanzierung({ ...EINFACH, kredit: { eigenkapitalAnteil: 0.2, zins: 0.05, jahre: 10 } });
  nahe(modell(r, "kredit").barwert, modell(r, "eigenkapital").barwert, 1e-6, "Barwert");
  // Annuität 80.000 € / 5 % / 10 J. = 10.360,37 €
  nahe(r.basis.kredit.rate, 10360.37, 0.01, "Rate");
  assert.equal(modell(r, "kredit").eigenkapital, 20000);
  // Gleichstand wird gemeinsam ausgewiesen (kein Zufallssieger durch Rundung)
  const std = rechneFinanzierung();
  assert.deepEqual(std.besteIds, ["eigenkapital", "kredit"]);
  assert.equal(std.besterId, "eigenkapital");
  // teurerer Kredit → geringerer Barwert
  const teuer = rechneFinanzierung({ ...EINFACH, kredit: { eigenkapitalAnteil: 0.2, zins: 0.08, jahre: 10 } });
  assert.ok(modell(teuer, "kredit").barwert < modell(teuer, "eigenkapital").barwert);
});

test("IFB wirkt nur beim Kauf, einmalig im Jahr 1", () => {
  const r = rechneFinanzierung({ ...EINFACH, ifb: true });
  // 100.000 × 22 % × 23 % = 5.060 €
  nahe(r.basis.ifb.effekt, 5060, 1e-6, "IFB-Effekt");
  assert.equal(modell(r, "eigenkapital").reihe[1].ifb, 5060);
  assert.equal(modell(r, "eigenkapital").reihe[2].ifb, 0);
  assert.equal(modell(r, "kredit").reihe[1].ifb, 5060);
  for (const id of ["leasing", "contracting", "ppa"]) assert.equal(modell(r, id).reihe[1].ifb, 0, id);
});

test("EAG-Zuschuss senkt die Investition (Kategorie D, 120 €/kWp bei 250 kWp)", () => {
  const r = rechneFinanzierung({ kwp: 250, eag: true });
  nahe(r.basis.zuschuss, 30000, 1e-6, "Zuschuss");
  nahe(r.basis.investition, r.basis.anlagenpreis - 30000, 1e-6, "Investition");
});

/* ------------------------------------------------------------ Leasing */
test("Leasing: keine Anfangsinvestition, Rate bis Laufzeitende, danach voller Nutzen", () => {
  const r = rechneFinanzierung({ ...EINFACH, leasing: { faktor: 1, jahre: 10, restwert: 0.1 } });
  const m = modell(r, "leasing");
  assert.equal(m.reihe[0].netto, 0);
  nahe(m.reihe[1].zahlung, 12000, 1e-6, "Rate Jahr 1");
  nahe(m.reihe[10].zahlung, 12000 + 10000, 1e-6, "Rate + Restwert Jahr 10");
  assert.equal(m.reihe[11].zahlung, 0);
  nahe(m.reihe[11].netto, modell(r, "eigenkapital").reihe[11].netto, 1e-6, "ab Jahr 11 wie Kauf");
});

/* ------------------------------------------------------------ Contracting */
test("Contracting: Zahlung je genutzter kWh, Übernahme am Ende, danach Eigentum", () => {
  const r = rechneFinanzierung({ ...EINFACH, contracting: { preisCt: 15, index: 0, jahre: 15, uebernahme: 0.05 } });
  const m = modell(r, "contracting");
  // Jahr 1: 50.000 kWh × (0,20 − 0,15) = 2.500 €
  nahe(m.reihe[1].netto, 2500, 1e-6, "Jahr 1");
  nahe(m.reihe[15].zahlung, 50000 * 0.15 + 5000, 1e-6, "Jahr 15 inkl. Übernahme");
  nahe(m.reihe[16].netto, modell(r, "eigenkapital").reihe[16].netto, 1e-6, "ab Jahr 16 wie Kauf");
  // Laufzeit 20 → keine Übernahme
  const voll = rechneFinanzierung({ ...EINFACH, contracting: { preisCt: 15, index: 0, jahre: 20, uebernahme: 0.05 } });
  assert.equal(voll.basis.contracting.uebernahme, 0);
});

test("Contracting-Preis über dem Strompreis ergibt Nachteil (neutral, kein Schönrechnen)", () => {
  const r = rechneFinanzierung({ ...EINFACH, contracting: { preisCt: 25, index: 0, jahre: 20, uebernahme: 0 } });
  assert.ok(modell(r, "contracting").barwert < 0);
  assert.equal(modell(r, "contracting").amortisation, null);
});

/* ------------------------------------------------------------ PPA */
test("PPA Take-or-pay vs. nur Eigenverbrauch", () => {
  const top = rechneFinanzierung({ ...EINFACH, ppa: { preisCt: 10, index: 0, abnahme: "gesamt" } });
  // 50.000 × 0,20 + 50.000 × 0,05 − 100.000 × 0,10 = 2.500 €
  nahe(modell(top, "ppa").reihe[1].netto, 2500, 1e-6, "Take-or-pay");
  const ev = rechneFinanzierung({ ...EINFACH, ppa: { preisCt: 10, index: 0, abnahme: "eigenverbrauch" } });
  // 50.000 × (0,20 − 0,10) = 5.000 €
  nahe(modell(ev, "ppa").reihe[1].netto, 5000, 1e-6, "nur Eigenverbrauch");
});

/* ------------------------------------------------------------ Amortisation */
test("amortisation(): dauerhaft positiv, Rückfall ins Minus wird berücksichtigt", () => {
  const reihe = (werte) => {
    let k = 0;
    return werte.map((v, jahr) => ((k += v), { jahr, netto: v, kumuliert: k }));
  };
  assert.equal(amortisation(reihe([-100, 50, 50, 50])), 2);
  assert.equal(amortisation(reihe([0, 10, 10])), 0);
  assert.equal(amortisation(reihe([0, 10, -30, 40])), 2.5);
  assert.equal(amortisation(reihe([-100, 10, 10])), null);
});

/* ------------------------------------------------------------ Standardfall */
test("Standardwerte: plausible, endliche Ergebnisse", () => {
  const r = rechneFinanzierung();
  assert.equal(r.basis.kwp, FINANZIERUNG.kwp);
  assert.ok(r.basis.lcoeCt > 4 && r.basis.lcoeCt < 15, `LCOE ${r.basis.lcoeCt}`);
  for (const m of r.modelle) {
    assert.ok(Number.isFinite(m.barwert), `${m.id} Barwert`);
    assert.ok(Number.isFinite(m.summe), `${m.id} Summe`);
  }
  assert.ok(MODELLE.some((m) => m.id === r.besterId));
});

console.log(`\n${n} Tests bestanden.`);
