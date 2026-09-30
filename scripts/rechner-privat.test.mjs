// Tests für die Privat-Rechner und gemeinsamen Bausteine (reine Funktionen):
//   src/lib/rechner/profile.js · stromspeicher.js · waermepumpe.js · wallbox.js · annahmen.js ·
//   angebot.js · dynamischerTarif.js · src/lib/solarrechner.js · src/lib/rechnerTeilen.js ("@/"-Alias)
// Aufruf: node scripts/rechner-privat.test.mjs
// (rechnerTeilen.js importiert "@/data/solarrechner" – der Alias wird über scripts/lib/alias.mjs aufgelöst.)

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { srcUrl } from "./lib/alias.mjs";
import {
  BETRIEB_GRUNDLAST,
  HAUSHALT_MONAT,
  HEIZ_MONAT,
  PROFIL_EAUTO,
  PROFIL_HAUSHALT,
  PROFIL_WP,
  PV_MONAT,
  betriebsLast,
  betriebsTagesform,
  jahresreihen,
  pvTagesform,
  simuliere,
} from "../src/lib/rechner/profile.js";
import { rechneStromspeicher, speicherErgebnis, speicherKosten, speicherKurve, speicherReihen } from "../src/lib/rechner/stromspeicher.js";
import { jazFuer, rechneWaermepumpe, waermebedarf } from "../src/lib/rechner/waermepumpe.js";
import { rechneWallbox } from "../src/lib/rechner/wallbox.js";
import { SPEICHER, fmt, fmtEur, satzFuer } from "../src/lib/rechner/annahmen.js";
import { angebotUrl } from "../src/lib/rechner/angebot.js";
import {
  PROFILE,
  bruttoCt,
  rechneDynamisch,
  tagesKosten,
  tagesLast,
  tagesSlots,
  verschiebe,
  wienStunde,
  wienTag,
  zeitfenster,
} from "../src/lib/rechner/dynamischerTarif.js";
import { berechne, empfohlenerSpeicher, mischSatz, zielgruppeVon } from "../src/lib/solarrechner.js";
import { einspeiseSatzCt } from "../src/lib/rechner/gewerbepv.js";

const { STANDARD, alsBerechnung, eingabenAusParams, standardFuer, teilenQuery } = await import(srcUrl("lib/rechnerTeilen.js"));

const nahe = (ist, soll, tol, text = "") => assert.ok(Math.abs(ist - soll) <= tol, `${text} ${ist} ≠ ${soll} (±${tol})`);
const summe = (a) => Array.prototype.reduce.call(a, (s, v) => s + v, 0);

// ---------------------------------------------------------------------------
describe("profile – Last- und Erzeugungsprofile", () => {
  test("Tages- und Monatsprofile sind auf 1 normiert", () => {
    for (const [name, p] of Object.entries({ PROFIL_HAUSHALT, PROFIL_WP, PROFIL_EAUTO })) {
      assert.equal(p.length, 24, name);
      nahe(summe(p), 1, 1e-12, name);
    }
    nahe(summe(HAUSHALT_MONAT), 1, 1e-9);
    nahe(summe(HEIZ_MONAT), 1, 1e-9);
    for (let m = 0; m < 12; m++) nahe(summe(pvTagesform(m)), 1, 1e-12, `Monat ${m}`);
    assert.equal(pvTagesform(0)[0], 0); // Mitternacht im Jänner
  });
  // Befund tests-01 behoben: PV_MONAT in profile.js ist auf 1 normiert
  test("PV-Monatsanteile summieren sich auf 1", () => {
    nahe(summe(PV_MONAT), 1, 1e-9);
  });
  test("betriebsTagesform: Schichtzeiten mit Rampe, betriebsfreie Tage Grundlast", () => {
    const f = betriebsTagesform({ schichten: 1 });
    assert.equal(f[7], 1);
    assert.equal(f[15], 1);
    assert.equal(f[6], (1 + BETRIEB_GRUNDLAST) / 2);
    assert.equal(f[16], (1 + BETRIEB_GRUNDLAST) / 2);
    assert.equal(f[3], BETRIEB_GRUNDLAST);
    assert.ok(betriebsTagesform({ schichten: 3 }).every((v) => v === 1));
    assert.ok(betriebsTagesform({ arbeitstag: false }).every((v) => v === BETRIEB_GRUNDLAST));
    assert.deepEqual(betriebsTagesform({ schichten: 9 }), f); // unbekannt → 1 Schicht
    assert.equal(betriebsTagesform({ typ: "landwirtschaft" }).length, 24);
  });
  test("betriebsLast: Jahressumme = Verbrauch, Wochenende niedriger, 0 → leer", () => {
    for (const p of [
      { kwh: 250000, betriebstage: 5, schichten: 1 },
      { kwh: 1e6, betriebstage: 6, schichten: 2 },
      { kwh: 90000, typ: "landwirtschaft" },
    ]) {
      const l = betriebsLast(p);
      assert.equal(l.length, 8760);
      nahe(summe(l), p.kwh, p.kwh * 1e-9);
    }
    const l = betriebsLast({ kwh: 250000, betriebstage: 5, schichten: 1 });
    const tag = (d) => summe(l.slice(d * 24, d * 24 + 24));
    // 1.1.2026 = Donnerstag: Tag 1 (Fr) Arbeitstag, Tag 2 (Sa) frei
    assert.ok(tag(1) > 2 * tag(2));
    assert.equal(summe(betriebsLast({ kwh: 0 })), 0);
    assert.equal(summe(betriebsLast({ kwh: -5 })), 0);
    // betriebstage außerhalb 5–7 werden geklemmt
    assert.deepEqual(betriebsLast({ kwh: 1000, betriebstage: 2 }), betriebsLast({ kwh: 1000, betriebstage: 5 }));
  });
  test("jahresreihen: Lastsummen = Eingaben, deterministisch", () => {
    const r = jahresreihen({ kwp: 10, ertragProKwp: 1100, haushaltKwh: 4500, eAutoKwh: 2000, wpKwh: 3500 });
    nahe(summe(r.haushalt), 4500, 1e-6);
    nahe(summe(r.eauto), 2000, 1e-6);
    nahe(summe(r.wp), 3500, 1e-6);
    nahe(summe(r.pv), 11000 * summe(PV_MONAT), 1e-6);
    assert.deepEqual(jahresreihen({ kwp: 10, haushaltKwh: 4500 }).pv, jahresreihen({ kwp: 10, haushaltKwh: 4500 }).pv);
    assert.equal(r.betrieb, null);
  });
  test("simuliere: Energiebilanzen mit und ohne Speicher", () => {
    const r = jahresreihen({ kwp: 10, ertragProKwp: 1100, haushaltKwh: 4500 });
    const o = simuliere(r, 0);
    nahe(o.direkt + o.einspeisung, o.pv, 1e-6);
    nahe(o.direkt + o.netz, o.last, 1e-6);
    assert.equal(o.vollzyklen, 0);
    const s = simuliere(r, 10);
    nahe(s.eigenverbrauch + s.einspeisung, s.pv, 1e-6);
    nahe(s.autark + s.netz, s.last, 1e-6);
    assert.ok(s.entladen <= s.laden * 0.94 * 0.94 + 1e-6, "Verluste beim Speichern");
    assert.ok(s.autarkie > o.autarkie);
    let vorher = -1;
    for (const kap of [0, 2, 5, 10, 20]) {
      const x = simuliere(r, kap);
      assert.ok(x.autarkie >= vorher, `${kap} kWh`);
      vorher = x.autarkie;
    }
    assert.equal(simuliere(jahresreihen({ kwp: 0, haushaltKwh: 0 }), 5).autarkie, 0);
  });
});

// ---------------------------------------------------------------------------
describe("annahmen / angebot", () => {
  test("satzFuer = mischSatz = einspeiseSatzCt (dreifach dupliziert, muss gleich bleiben)", () => {
    for (const kwp of [-1, 0, 3, 10, 20, 35.5, 100, 499, 500, 750, 1000, 2500]) {
      assert.equal(satzFuer(kwp), mischSatz(kwp), `${kwp}`);
      assert.equal(satzFuer(kwp), einspeiseSatzCt(kwp), `${kwp}`);
      assert.equal(satzFuer(kwp, "volleinspeisung"), mischSatz(kwp, "volleinspeisung"), `${kwp}`);
    }
  });
  test("fmt / fmtEur: Tausenderpunkt, Dezimalkomma, NaN → Strich", () => {
    assert.equal(fmt(1234.5, 1), "1.234,5");
    assert.equal(fmt(1234567), "1.234.567");
    assert.equal(fmt(NaN), "–");
    assert.equal(fmt(Infinity), "–");
    assert.equal(fmtEur(1234.4), "1.234 €");
  });
  test("angebotUrl: nur gesetzte, positive Werte, gerundet", () => {
    assert.equal(angebotUrl(), "/angebot");
    assert.equal(angebotUrl({}), "/angebot");
    assert.equal(angebotUrl({ kwp: 9.96, verbrauch: 4500.4, speicher: 8.4, wallbox: true }), "/angebot?kwp=10&verbrauch=4500&speicher=8&wallbox=1");
    assert.equal(angebotUrl({ objekt: "gewerbe", kwp: 0, verbrauch: -5, speicher: 0, waermepumpe: 1 }), "/angebot?objekt=gewerbe&waermepumpe=1");
    assert.equal(angebotUrl({ objekt: "a&b=c" }), "/angebot?objekt=a%26b%3Dc");
  });
});

// ---------------------------------------------------------------------------
describe("stromspeicher", () => {
  test("speicherKosten: Preis je kWh plus Nachrüstaufschlag", () => {
    assert.equal(speicherKosten(0), 0);
    assert.equal(speicherKosten(-3), 0);
    assert.equal(speicherKosten(10), 10 * SPEICHER.preisProKwh);
    assert.equal(speicherKosten(10, true), 10 * SPEICHER.preisProKwh + SPEICHER.nachruestAufschlag);
  });
  test("speicherReihen: E-Auto und Wärmepumpe erhöhen den Verbrauch", () => {
    const b = speicherReihen({ verbrauch: 4500, kwp: 10, eAuto: true, km: 15000, waermepumpe: true });
    nahe(b.eAutoKwh, (15000 * 18 * 0.8) / 100, 1e-9);
    assert.equal(b.wpKwh, 3500);
    nahe(b.gesamtverbrauch, 4500 + 2160 + 3500, 1e-9);
    assert.equal(speicherReihen({ verbrauch: 4500, kwp: 10, km: 15000 }).eAutoKwh, 0);
  });
  const E = { verbrauch: 4500, kwp: 10, speicher: 8 };
  const r = rechneStromspeicher(E);
  test("Speicher erhöht Autarkie, senkt Einspeisung und Netzbezug", () => {
    assert.ok(r.mit.autarkie > r.ohne.autarkie);
    assert.ok(r.mit.einspeisung < r.ohne.einspeisung);
    assert.ok(r.mit.netz < r.ohne.netz);
    assert.ok(r.ersparnis > 0);
    assert.equal(r.kosten, 8 * SPEICHER.preisProKwh);
    assert.equal(r.satzCt, 6);
    assert.ok(r.vollzyklen > 50 && r.vollzyklen < 365);
  });
  test("Kurve: 0–20 kWh, Autarkie steigt monoton, Optimum mit positivem Überschuss", () => {
    assert.equal(r.kurve.punkte.length, SPEICHER.maxKwh + 1);
    for (let i = 1; i < r.kurve.punkte.length; i++) assert.ok(r.kurve.punkte[i].autarkie >= r.kurve.punkte[i - 1].autarkie - 1e-12);
    if (r.kurve.optimum) assert.ok(r.kurve.optimum.ueberschuss > 0);
  });
  test("Plausibilität: Nachrüsten verlängert die Amortisation", () => {
    const n = rechneStromspeicher({ ...E, nachruesten: true });
    assert.ok(n.amortisation > r.amortisation);
    assert.ok(n.ueberschuss < r.ueberschuss);
  });
  test("Randfall ohne Speicher: keine Kosten, keine Amortisation", () => {
    const basis = speicherReihen(E);
    const o = speicherErgebnis(basis, { kwp: 10, speicher: 0 });
    assert.equal(o.kosten, 0);
    assert.equal(o.ersparnis, 0);
    assert.equal(o.amortisation, null);
    assert.equal(o.lohntSich, false);
    assert.equal(speicherKurve(basis, { kwp: 10 }).punkte[0].kosten, 0);
  });
});

// ---------------------------------------------------------------------------
describe("waermepumpe", () => {
  test("waermebedarf: Fläche × Standard bzw. bekannter Verbrauch × Nutzungsgrad", () => {
    assert.equal(waermebedarf({ flaeche: 150, standard: "1995" }), 15750);
    assert.equal(waermebedarf({ flaeche: 150, standard: "x" }), 15750); // Fallback 1995–2009
    nahe(waermebedarf({ verbrauchBekannt: true, heizung: "gas", verbrauchWert: 20000 }), 17600, 1e-9);
    nahe(waermebedarf({ verbrauchBekannt: true, heizung: "oel", verbrauchWert: 2000 }), 17000, 1e-9);
    // bekannter Verbrauch 0 → Flächenschätzung
    assert.equal(waermebedarf({ flaeche: 100, standard: "neubau", verbrauchBekannt: true, verbrauchWert: 0 }), 4500);
    assert.equal(jazFuer("neubau"), 4.3);
    assert.equal(jazFuer("x"), 3.5);
  });
  const E = { flaeche: 150, standard: "1995", heizung: "gas", preis: 12, jaz: 3.5 };
  const r = rechneWaermepumpe(E);
  test("Beispiel Gas 12 ct/kWh, 150 m², JAZ 3,5 (Handrechnung)", () => {
    assert.equal(r.bedarf, 15750);
    assert.equal(r.wpStrom, 4500);
    nahe(r.netz.strom, 4500 * 0.28, 1e-9);
    nahe(r.fossil.brennstoff, (15750 / 0.88) * 0.12, 1e-9);
    nahe(r.fossil.summe, (15750 / 0.88) * 0.12 + 250, 1e-9);
    nahe(r.ersparnisNetz, r.fossil.summe - r.netz.summe, 1e-9);
    assert.ok(r.co2Ersparnis > 0);
    assert.equal(r.foerderung.verfuegbar, false);
    assert.equal(r.foerderung.max, 0);
    assert.equal(r.monate.length, 12);
  });
  test("Plausibilität: höherer Gaspreis / höhere JAZ → mehr Ersparnis", () => {
    assert.ok(rechneWaermepumpe({ ...E, preis: 16 }).ersparnisNetz > r.ersparnisNetz);
    assert.ok(rechneWaermepumpe({ ...E, jaz: 4.5 }).ersparnisNetz > r.ersparnisNetz);
    assert.ok(rechneWaermepumpe({ ...E, wpTarifCt: 35 }).ersparnisNetz < r.ersparnisNetz);
  });
  test("Öl: Preis je 100 l, Menge in Litern", () => {
    const o = rechneWaermepumpe({ ...E, heizung: "oel", preis: 185 });
    nahe(o.fossil.menge, 15750 / 0.85 / 10, 1e-9);
    nahe(o.fossil.brennstoff, (15750 / 0.85) * 0.185, 1e-9);
  });
  test("PV-Anteil: 0–100 %, mit Speicher höher, Solarstrom günstiger als Netz", () => {
    const pv = rechneWaermepumpe({ ...E, pv: "pv", kwp: 10 });
    const sp = rechneWaermepumpe({ ...E, pv: "pvSpeicher", kwp: 10 });
    assert.ok(pv.solar.anteil > 0 && pv.solar.anteil < 1);
    assert.ok(sp.solar.anteil >= pv.solar.anteil);
    assert.ok(pv.solar.summe < r.netz.summe);
    nahe(pv.solar.solarKwh + pv.solar.reststrom, r.wpStrom, 1e-9);
    assert.equal(rechneWaermepumpe({ ...E, pv: "pv", kwp: 0 }).solar, null);
  });
});

// ---------------------------------------------------------------------------
describe("wallbox", () => {
  const E = { km: 15000, verbrauch: 18, anteilZuhause: 0.8, anteilPv: 0.5, kraftstoff: "benzin" };
  const r = rechneWallbox(E);
  test("Beispiel 15.000 km Benziner vs. E-Auto (Handrechnung)", () => {
    nahe(r.verbrenner.liter, 1050, 1e-9);
    nahe(r.verbrenner.summe, 1050 * 1.93, 1e-9);
    nahe(r.kwhGesamt, 2700, 1e-9);
    nahe(r.kwhOeffentlich, 540, 1e-9);
    nahe(r.netz.summe, 2160 * 0.28 + 540 * 0.55, 1e-9);
    nahe(r.solar.summe, 1080 * 0.28 + 1080 * 0.06 + 540 * 0.55, 1e-9);
    nahe(r.verbrenner.je100, (r.verbrenner.summe / 15000) * 100, 1e-9);
    assert.ok(r.co2Ersparnis > 0);
  });
  test("Plausibilität: mehr PV-Anteil → günstiger; teureres Benzin → mehr Ersparnis", () => {
    assert.ok(rechneWallbox({ ...E, anteilPv: 1 }).solar.summe < rechneWallbox({ ...E, anteilPv: 0 }).solar.summe);
    assert.ok(rechneWallbox({ ...E, kraftstoffPreis: 2.2 }).ersparnisNetz > r.ersparnisNetz);
    assert.ok(rechneWallbox({ ...E, strompreisCt: 40 }).ersparnisNetz < r.ersparnisNetz);
    nahe(rechneWallbox({ ...E, anteilPv: 0 }).solarVorteil, 0, 1e-9);
  });
  test("Randfall 0 km: keine Division durch 0", () => {
    const n = rechneWallbox({ ...E, km: 0 });
    assert.equal(n.verbrenner.je100, 0);
    assert.equal(n.solar.je100, 0);
    assert.equal(n.ersparnisNetz, 0);
  });
  // Befund tests-05 behoben: wallbox.js fällt bei unbekanntem Kraftstoff zurück
  test("Unbekannter Kraftstoff (z. B. aus manipuliertem Link) wirft nicht", () => {
    assert.doesNotThrow(() => rechneWallbox({ ...E, kraftstoff: "lpg" }));
  });
});

// ---------------------------------------------------------------------------
describe("dynamischerTarif", () => {
  const A = { aufschlagCt: 2, mwst: 0.2 };
  // 15.06.2026 (MESZ, UTC+2): 00:00 Wien = 14.06. 22:00 UTC
  const start = Date.UTC(2026, 5, 14, 22);
  const preis = (h) => (h >= 12 && h < 15 ? -20 : h >= 18 && h < 21 ? 200 : 90);
  const punkte = Array.from({ length: 24 }, (_, h) => ({ t: start + h * 3600000, eurMwh: preis(h) }));

  test("wienTag / wienStunde: Europe/Vienna inkl. Sommerzeit", () => {
    assert.equal(wienTag(Date.UTC(2026, 0, 1, 23, 30)), "2026-01-02");
    assert.equal(wienStunde(Date.UTC(2026, 0, 1, 23, 30)), 0);
    assert.equal(wienStunde(Date.UTC(2026, 5, 15, 10)), 12);
    assert.equal(wienStunde(start), 0);
  });
  test("bruttoCt: (€/MWh / 10 + Aufschlag) × (1 + USt.)", () => {
    nahe(bruttoCt(100, A), 14.4, 1e-12);
    nahe(bruttoCt(-50, A), -3.6, 1e-12);
  });
  test("tagesSlots / tagesLast: 24 Slots, Tagesenergie wie Profil", () => {
    const slots = tagesSlots(punkte, "2026-06-15", 60, A);
    assert.equal(slots.length, 24);
    assert.deepEqual(slots.map((s) => s.stunde), Array.from({ length: 24 }, (_, h) => h));
    const l = tagesLast(slots, PROFILE.eauto, "2026-06-15");
    nahe(summe(l.haushalt) + summe(l.eauto) + summe(l.wp), l.tagesKwh.gesamt, 1e-9);
    nahe(l.tagesKwh.eauto, (15000 * 18) / 100 / 365, 1e-12);
    assert.equal(tagesSlots(punkte, "2026-06-16", 60, A).length, 0);
  });
  test("Zeitumstellung 25.10.2026: 25 Stunden, Energie trotzdem vollständig", () => {
    const s0 = Date.UTC(2026, 9, 24, 22); // 00:00 MESZ
    const p = Array.from({ length: 25 }, (_, h) => ({ t: s0 + h * 3600000, eurMwh: 80 }));
    const slots = tagesSlots(p, "2026-10-25", 60, A);
    assert.equal(slots.length, 25);
    const l = tagesLast(slots, PROFILE.wp, "2026-10-25");
    nahe(summe(l.haushalt) + summe(l.eauto) + summe(l.wp), l.tagesKwh.gesamt, 1e-9);
  });
  test("verschiebe: Energie bleibt erhalten, Kosten sinken, 0 % ändert nichts", () => {
    const slots = tagesSlots(punkte, "2026-06-15", 60, A);
    for (const profil of Object.values(PROFILE)) {
      const last = tagesLast(slots, profil, "2026-06-15");
      const neu = verschiebe(slots, last, 1);
      for (const art of ["haushalt", "eauto", "wp"]) nahe(summe(neu[art]), summe(last[art]), 1e-9, `${profil.id}/${art}`);
      assert.ok(tagesKosten(slots, neu, 30).dynamisch <= tagesKosten(slots, last, 30).dynamisch + 1e-12);
      const gleich = verschiebe(slots, last, 0);
      for (const art of ["haushalt", "eauto", "wp"]) gleich[art].forEach((v, i) => nahe(v, last[art][i], 1e-12));
    }
  });
  test("zeitfenster: günstigstes und teuerstes 3-h-Fenster", () => {
    const slots = tagesSlots(punkte, "2026-06-15", 60, A);
    const g = zeitfenster(slots, 3);
    assert.equal(g.von, 12);
    assert.equal(g.bis, 14);
    nahe(g.avgCt, bruttoCt(-20, A), 1e-12);
    assert.equal(g.endeT - g.startT, 3 * 3600000);
    const t = zeitfenster(slots, 3, { teuerstes: true });
    assert.equal(t.von, 18);
    // ab 16 Uhr: günstigstes Fenster liegt danach
    assert.ok(zeitfenster(slots, 3, { abT: start + 16 * 3600000 }).von >= 16);
    assert.equal(zeitfenster([], 3), null);
    assert.equal(zeitfenster(slots, 30), null);
  });
  test("rechneDynamisch: Festpreis vs. dynamisch, null ohne Daten", () => {
    const r = rechneDynamisch({ punkte, aufloesungMin: 60, tag: "2026-06-15", profil: PROFILE.eauto, verschiebbarkeit: 1, festpreisCt: 30, annahmen: A });
    nahe(r.ersparnisTag, r.fest - r.dynamischMit, 1e-12);
    assert.ok(r.verschiebeVorteil >= 0);
    assert.equal(r.negativ, 3);
    assert.equal(r.min.eurMwh, -20);
    assert.equal(r.max.eurMwh, 200);
    assert.equal(rechneDynamisch({ punkte: [], aufloesungMin: 60, tag: "2026-06-15", profil: PROFILE.haushalt, verschiebbarkeit: 0, festpreisCt: 30, annahmen: A }), null);
  });
});

// ---------------------------------------------------------------------------
describe("solarrechner – berechne()", () => {
  const P = { kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 8 };
  const r = berechne(P);

  test("Privat, 10 kWp Süd, 4.500 kWh, 8 kWh Speicher: Grundwerte", () => {
    assert.equal(r.jahresertrag, 11000);
    assert.equal(r.zielgruppe, "privat");
    nahe(r.eigenverbrauch + r.eingespeist, r.jahresertrag, 1e-9);
    assert.ok(r.autarkie > 0.5 && r.autarkie <= 0.8, `Autarkie ${r.autarkie}`);
    assert.equal(r.cashflow.length, r.jahre + 1);
    assert.ok(r.amortisationJahre > 5 && r.amortisationJahre < 20, `Amortisation ${r.amortisationJahre}`);
    nahe(r.co2ProJahr, 11000 * 0.2582, 1e-9);
    assert.equal(r.benoetigteFlaeche, 50);
    assert.equal(r.ifb, null);
  });
  test("Plausibilität: höhere Strompreissteigerung → kürzere Amortisation", () => {
    const a2 = berechne({ ...P, preissteigerung: 0.02 }).amortisationJahre;
    const a4 = berechne({ ...P, preissteigerung: 0.04 }).amortisationJahre;
    assert.ok(a4 < a2);
    // ohne Steigerung keine Amortisation innerhalb von 20 Jahren (siehe offene Punkte)
    assert.equal(berechne({ ...P, preissteigerung: 0 }).amortisationJahre, null);
    assert.ok(berechne({ ...P, preissteigerung: 0.04 }).ertrag20Jahre > berechne({ ...P, preissteigerung: 0 }).ertrag20Jahre);
  });
  test("Plausibilität: Ost-West/Nord weniger Ertrag, Förderung verkürzt Amortisation", () => {
    assert.ok(berechne({ ...P, ausrichtung: "nord" }).jahresertrag < berechne({ ...P, ausrichtung: "ost-west" }).jahresertrag);
    assert.ok(berechne({ ...P, foerderung: true }).amortisationJahre < r.amortisationJahre);
  });
  test("Speicher: höhere Autarkie, Eigenverbrauch nie über Erzeugung", () => {
    const o = berechne({ ...P, speicherKwh: 0 });
    assert.ok(r.autarkie > o.autarkie);
    const riesig = berechne({ ...P, kwp: 3, speicherKwh: 30 });
    assert.ok(riesig.eigenverbrauch <= riesig.jahresertrag * 0.92 + 1e-9);
  });
  test("Gewerbe: stündliche Simulation, netto, IFB-Hinweis", () => {
    const g = berechne({ kwp: 100, ausrichtung: "sued", neigung: "flach", verbrauch: 250000, speicherKwh: 0, zielgruppe: "gewerbe" });
    assert.equal(g.netto, true);
    assert.ok(g.ifb && g.ifb.satz === 0.22);
    nahe(g.strompreisCt, 100 * (0.2 - (0.2 - 0.17) * Math.log10(2.5)), 1e-9);
    assert.equal(g.benoetigteFlaeche, 700);
  });
  // Befund tests-01 (Folge), behoben 30.09.2026: speicherverlust kommt jetzt aus der
  // Simulation (geladen − entladen) statt als Restgröße aus dem Jahresertrag.
  test("Gewerbe/Landwirtschaft ohne Speicher: kein „Speicherverlust“, Energiebilanz geschlossen", () => {
    for (const zielgruppe of ["gewerbe", "landwirtschaft"]) {
      for (const kwp of [10, 100, 500]) {
        const g = berechne({ kwp, ausrichtung: "sued", neigung: "flach", verbrauch: 250000, speicherKwh: 0, zielgruppe });
        assert.equal(g.speicherverlust, 0, `${zielgruppe} ${kwp} kWp`);
        nahe(g.eigenverbrauch + g.eingespeist, g.jahresertrag, g.jahresertrag * 1e-9, `${zielgruppe} ${kwp} kWp`);
      }
    }
  });
  test("Gewerbe mit Speicher: Verlust > 0 und Bilanz Ertrag = Eigenverbrauch + Einspeisung + Verlust", () => {
    const g = berechne({ kwp: 100, ausrichtung: "sued", neigung: "flach", verbrauch: 250000, speicherKwh: 50, zielgruppe: "gewerbe" });
    assert.ok(g.speicherverlust > 0);
    assert.ok(g.speicherverlust < g.jahresertrag * 0.05);
    nahe(g.eigenverbrauch + g.eingespeist + g.speicherverlust, g.jahresertrag, g.jahresertrag * 1e-9);
  });
  test("Randfälle: 0 kWp / 0 Verbrauch / unbekannte Zielgruppe", () => {
    const n = berechne({ ...P, kwp: 0, speicherKwh: 0 });
    assert.equal(n.jahresertrag, 0);
    assert.equal(n.eigenverbrauchsquote, 0);
    const v = berechne({ ...P, verbrauch: 0 });
    assert.equal(v.autarkie, 0);
    assert.equal(v.eigenverbrauch, 0);
    assert.ok(v.amortisationJahre === null || Number.isFinite(v.amortisationJahre));
    assert.ok(Object.values(v).every((x) => typeof x !== "number" || !Number.isNaN(x)));
    assert.equal(zielgruppeVon("mond"), "privat");
    assert.equal(berechne({ ...P, zielgruppe: "mond" }).zielgruppe, "privat");
  });
  test("empfohlenerSpeicher: 1 kWh je 1.000 kWh, mindestens 5", () => {
    assert.equal(empfohlenerSpeicher(3000), 5);
    assert.equal(empfohlenerSpeicher(12000), 12);
    assert.equal(empfohlenerSpeicher(0), 5);
  });
});

// ---------------------------------------------------------------------------
describe("rechnerTeilen – Teilen-Link des Solarrechners (über @/-Alias geladen)", () => {
  test("Standardwerte je Zielgruppe", () => {
    assert.deepEqual(standardFuer("privat"), STANDARD);
    const g = standardFuer("gewerbe");
    assert.equal(g.kwp, 100);
    assert.equal(g.verbrauch, 250000);
    assert.equal(g.neigung, "flach");
    assert.equal(standardFuer("mond").zielgruppe, "privat");
  });
  test("teilenQuery → eingabenAusParams ergibt dieselben Eingaben", () => {
    for (const e of [
      STANDARD,
      { ...standardFuer("gewerbe"), betriebstage: 6, schichten: 2, speicher: 100 },
      { ...standardFuer("landwirtschaft"), kwp: 55, ausrichtung: "ost-west" },
      { ...STANDARD, steigerung: 0, speicher: 0, kwp: 12.5 },
    ]) {
      const aus = eingabenAusParams(new URLSearchParams(teilenQuery(e)));
      const erwartet = e.zielgruppe === "gewerbe" ? e : { ...e, betriebstage: 5, schichten: 1 };
      assert.deepEqual(aus, erwartet, e.zielgruppe);
    }
  });
  test("Grenzen, Raster und ungültige Werte", () => {
    const x = eingabenAusParams({ k: "999", v: "10", s: "7.4", a: "west", n: "x", p: "0.03", t: "9", sch: "0" });
    assert.equal(x.kwp, 35);
    assert.equal(x.verbrauch, 1500);
    assert.equal(x.speicher, 7);
    assert.equal(x.ausrichtung, "sued");
    assert.equal(x.neigung, "mittel");
    assert.equal(x.steigerung, 0.02);
    assert.equal(x.betriebstage, 7);
    assert.equal(x.schichten, 1);
    assert.equal(eingabenAusParams({ k: ["12", "20"] }).kwp, 12); // mehrfacher Parameter → erster
    assert.equal(eingabenAusParams().kwp, 10);
    assert.equal(eingabenAusParams({ z: "gewerbe", k: "3" }).kwp, 10); // Gewerbe-Minimum
  });
  test("alsBerechnung liefert gültige Eingaben für berechne()", () => {
    const b = berechne(alsBerechnung(STANDARD));
    assert.equal(b.jahresertrag, 11000);
    assert.equal(alsBerechnung(STANDARD).speicherKwh, 8);
  });
});
