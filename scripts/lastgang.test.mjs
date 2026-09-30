// scripts/lastgang.test.mjs
// Prüft Parser, Analyse, PV-Simulation und Peak-Shaving der Lastgang-Analyse (/lastgang-analyse).
// Ausführen: node scripts/lastgang.test.mjs

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { dekodiere, leseDatum, leseLastgang, leseZahl, LastgangFehler, utcZuWand, wandZuUtc } from "../src/lib/lastgang/parser.js";
import { analysiere, feiertageAT, ostersonntag, tagTyp } from "../src/lib/lastgang/analyse.js";
import { empfehlung, kurve, monatsErtraege, pvProfil, simuliere } from "../src/lib/lastgang/pv.js";
import { ersparnisLeistungspreis, haeltSchwelle, speicherFuerSchwelle } from "../src/lib/lastgang/peak.js";
import { beispielCsv } from "../src/lib/lastgang/beispiel.js";
import { datumZeit, energie, zahl } from "../src/lib/lastgang/format.js";

const wurzel = join(dirname(fileURLToPath(import.meta.url)), "..");
const PVGIS = JSON.parse(readFileSync(join(wurzel, "src/data/regionen-pvgis.json"), "utf8"));

let ok = 0;
const test = (name, fn) => {
  try {
    fn();
    ok++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}\n    ${e.message}`);
    process.exitCode = 1;
  }
};
const wirft = (fn, code) => {
  try {
    fn();
  } catch (e) {
    assert.ok(e instanceof LastgangFehler, `LastgangFehler erwartet, bekommen: ${e.message}`);
    if (code) assert.equal(e.code, code, e.message);
    return e;
  }
  assert.fail("Fehler erwartet");
};

// Einfacher synthetischer Lastgang: 50 kW Grundlast, werktags 8–16 Uhr 150 kW
const zwei = (n) => String(n).padStart(2, "0");
function reihe({ tage = 30, intervall = 15, start = Date.UTC(2025, 0, 6) } = {}) {
  const out = [];
  for (let t = start; t < start + tage * 86400000; t += intervall * 60000) {
    const d = new Date(t);
    const h = d.getUTCHours();
    const wt = (d.getUTCDay() + 6) % 7;
    const kw = wt < 5 && h >= 8 && h < 16 ? 150 : 50;
    out.push({ t, d, kw });
  }
  return out;
}
const de = (d) => `${zwei(d.getUTCDate())}.${zwei(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
const hm = (d) => `${zwei(d.getUTCHours())}:${zwei(d.getUTCMinutes())}`;

console.log("Format");
test("zahl: Tausenderpunkt, Dezimalkomma, Minus", () => {
  assert.equal(zahl(1234567.891, 1), "1.234.567,9");
  assert.equal(zahl(999.5), "1.000");
  assert.equal(zahl(-12.34, 2), "−12,34");
  assert.equal(zahl(NaN), "–");
  assert.equal(energie(884273), "884 MWh");
  assert.equal(energie(12345), "12,3 MWh");
  assert.equal(energie(9876), "9.876 kWh");
  assert.equal(energie(2_500_000), "2.500 MWh");
  assert.equal(datumZeit(Date.UTC(2025, 2, 4, 7, 15)), "04.03.2025, 07:15");
});

console.log("Parser – Grundbausteine");
test("leseZahl: Komma/Punkt/Tausender", () => {
  assert.equal(leseZahl("1.234,56", true), 1234.56);
  assert.equal(leseZahl("1,234.56", false), 1234.56);
  assert.equal(leseZahl("0,125", true), 0.125);
  assert.equal(leseZahl(" 12 ", true), 12);
  assert.ok(Number.isNaN(leseZahl("abc", true)));
});
test("leseDatum: DE, ISO, Schrägstrich, Zeitzone, 24:00, Bereich", () => {
  assert.equal(leseDatum("01.02.2025 07:15").wand, Date.UTC(2025, 1, 1, 7, 15));
  assert.equal(leseDatum("2025-02-01T07:15:00").wand, Date.UTC(2025, 1, 1, 7, 15));
  assert.equal(leseDatum("01/02/2025 07:15").wand, Date.UTC(2025, 1, 1, 7, 15));
  assert.equal(leseDatum("02/01/2025 07:15", "md").wand, Date.UTC(2025, 1, 1, 7, 15));
  // 06:15 UTC im Winter = 07:15 Ortszeit; im Sommer 05:15 UTC = 07:15
  assert.equal(leseDatum("2025-02-01T06:15:00Z").wand, Date.UTC(2025, 1, 1, 7, 15));
  assert.equal(leseDatum("2025-07-01T05:15:00Z").wand, Date.UTC(2025, 6, 1, 7, 15));
  assert.equal(leseDatum("2025-07-01T07:15:00+02:00").wand, Date.UTC(2025, 6, 1, 7, 15));
  assert.equal(leseDatum("01.02.2025 24:00").wand, Date.UTC(2025, 1, 2, 0, 0));
  assert.equal(leseDatum("01.02.2025 07:15 - 07:30").bereich, true);
  assert.equal(leseDatum("32.01.2025"), null);
  assert.equal(leseDatum("0,25"), null);
});
test("Sommerzeit: Wanduhr ↔ UTC", () => {
  assert.equal(utcZuWand(Date.UTC(2025, 2, 30, 0, 59)), Date.UTC(2025, 2, 30, 1, 59));
  assert.equal(utcZuWand(Date.UTC(2025, 2, 30, 1, 0)), Date.UTC(2025, 2, 30, 3, 0));
  assert.equal(wandZuUtc(Date.UTC(2025, 6, 1, 12, 0)), Date.UTC(2025, 6, 1, 10, 0));
  assert.equal(wandZuUtc(Date.UTC(2025, 0, 1, 12, 0)), Date.UTC(2025, 0, 1, 11, 0));
});
test("dekodiere: Windows-1252, UTF-8-BOM, Excel erkannt", () => {
  assert.equal(dekodiere(new Uint8Array([0x5a, 0xe4, 0x68, 0x6c])), "Zähl");
  assert.equal(dekodiere(new Uint8Array([0xef, 0xbb, 0xbf, 0x41])), "A");
  wirft(() => dekodiere(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0, 0])), "excel");
  wirft(() => dekodiere(new Uint8Array([])), "leer");
});

console.log("Parser – Dateiformate");
test("Beispieldatei: Vorspann, Datum + Zeit von/bis, Dezimalkomma, Jahr 2025", () => {
  const text = readFileSync(join(wurzel, "public/beispiele/lastgang-beispiel.csv"), "utf8");
  assert.equal(text, beispielCsv(), "public/beispiele/lastgang-beispiel.csv ist nicht aktuell – neu erzeugen");
  assert.match(text.split("\n")[0], /SYNTHETISCH/);
  const lg = leseLastgang(text);
  assert.equal(lg.intervall, 15);
  assert.equal(lg.einheit, "kwh");
  assert.equal(lg.einheitSicher, true);
  assert.equal(lg.kwh.length, 35040);
  assert.equal(lg.erkannt.trenner, "Semikolon");
  assert.equal(lg.erkannt.dezimal, "Komma");
  assert.equal(lg.erkannt.zeitstempel, "Intervallbeginn");
  assert.deepEqual(lg.hinweise, []);
});
test("ISO-Zeitstempel UTC, Komma-getrennt, Leistung in kW", () => {
  const z = ["timestamp,power_kW"];
  for (const r of reihe()) z.push(`${new Date(wandZuUtc(r.t)).toISOString()},${r.kw.toFixed(2)}`);
  const lg = leseLastgang(z.join("\n"));
  assert.equal(lg.einheit, "kw");
  assert.equal(lg.intervall, 15);
  const a = analysiere(lg);
  assert.ok(Math.abs(a.spitze.kw - 150) < 1e-9);
  assert.ok(Math.abs(a.grundlast - 50) < 1e-9);
  assert.equal(a.tagesgang.werktag[8 * 4], 150);
  assert.equal(a.tagesgang.werktag[7 * 4], 50);
});
test("Eine Spalte „Datum/Uhrzeit“, Intervallende, Einheit unbekannt → Heuristik + Hinweis", () => {
  const z = ["Zeitstempel;Wert"];
  for (const r of reihe({ tage: 14 })) {
    const e = new Date(r.t + 15 * 60000);
    z.push(`${de(e)} ${hm(e)};${(r.kw / 4).toFixed(3).replace(".", ",")}`);
  }
  const lg = leseLastgang(z.join("\r\n"));
  assert.equal(lg.erkannt.zeitstempel, "Intervallende");
  assert.equal(lg.zeiten[0], Date.UTC(2025, 0, 6, 0, 0));
  assert.equal(lg.einheitSicher, false);
  assert.ok(lg.hinweise.some((h) => h.includes("Einheit")));
  assert.equal(analysiere(lg).spitze.kw, 150);
});
test("Kopfzeile „bis“ + 24:00 + Tabulator", () => {
  const z = ["Datum\tZeit bis\tEnergie kWh"];
  for (const r of reihe({ tage: 8 })) {
    const e = new Date(r.t + 15 * 60000);
    const mitternacht = e.getUTCHours() === 0 && e.getUTCMinutes() === 0;
    z.push(`${de(mitternacht ? new Date(e - 86400000) : e)}\t${mitternacht ? "24:00" : hm(e)}\t${(r.kw / 4).toFixed(2)}`);
  }
  const lg = leseLastgang(z.join("\n"));
  assert.equal(lg.erkannt.trenner, "Tabulator");
  assert.equal(lg.zeiten[0], Date.UTC(2025, 0, 6, 0, 0));
  assert.equal(lg.kwh.length, 8 * 96);
});
test("Langformat mit OBIS-Kennzahl: nur Bezug 1.8.0", () => {
  const z = ["Zählpunkt: AT0000000000000000000000000000000;;;", "Datum;Uhrzeit;OBIS;Wert"];
  for (const r of reihe({ tage: 10 })) {
    z.push(`${de(r.d)};${hm(r.d)};1-1:1.8.0;${(r.kw / 4).toFixed(3).replace(".", ",")}`);
    z.push(`${de(r.d)};${hm(r.d)};1-1:2.8.0;0,000`);
  }
  const lg = leseLastgang(z.join("\n"));
  assert.equal(lg.kwh.length, 10 * 96);
  assert.ok(lg.hinweise.some((h) => h.includes("1-1:1.8.0")));
  assert.equal(analysiere(lg).spitze.kw, 150);
});
test("Zwei Wertspalten (Bezug/Einspeisung) → Bezug; Auswahl per Option", () => {
  const z = ["Datum;Zeit;Einspeisung kWh;Bezug kWh"];
  for (const r of reihe({ tage: 8 })) z.push(`${de(r.d)};${hm(r.d)};0,5;${(r.kw / 4).toFixed(3).replace(".", ",")}`);
  const lg = leseLastgang(z.join("\n"));
  assert.equal(lg.erkannt.wertspalte, "Bezug kWh");
  assert.equal(lg.spalten.length, 2);
  const lg2 = leseLastgang(z.join("\n"), { spalte: 2 });
  assert.equal(lg2.erkannt.wertspalte, "Einspeisung kWh");
});
test("Stundenwerte → Hinweis; Einheit per Option auf kW umstellbar", () => {
  const z = ["Datum;Stunde;Menge"];
  for (const r of reihe({ tage: 10, intervall: 60 })) z.push(`${de(r.d)};${hm(r.d)};${r.kw}`);
  const lg = leseLastgang(z.join("\n"));
  assert.equal(lg.intervall, 60);
  assert.ok(lg.hinweise.some((h) => h.includes("Stundenwerte")));
  const lgKw = leseLastgang(z.join("\n"), { einheit: "kw" });
  assert.equal(analysiere(lgKw).spitze.kw, 150);
});
test("Negative Werte (Vorzeichenkonvention) werden umgedreht", () => {
  const z = ["Datum;Zeit;Verbrauch [kWh]"];
  for (const r of reihe({ tage: 8 })) z.push(`${de(r.d)};${hm(r.d)};-${(r.kw / 4).toFixed(2).replace(".", ",")}`);
  const lg = leseLastgang(z.join("\n"));
  assert.ok(lg.kwh[0] > 0);
});
test("Fehlermeldungen: Tageswerte, zu kurz, kein Datum, 10-Minuten-Raster", () => {
  const tw = ["Datum;Verbrauch kWh"];
  for (let i = 1; i <= 28; i++) tw.push(`${zwei(i)}.02.2025;1234,5`);
  wirft(() => leseLastgang(tw.join("\n")), "tageswerte");
  const kurz = ["Datum;Zeit;kWh"];
  for (const r of reihe({ tage: 2 })) kurz.push(`${de(r.d)};${hm(r.d)};1,0`);
  wirft(() => leseLastgang(kurz.join("\n")), "kurz");
  wirft(() => leseLastgang("Hallo;Welt\nfoo;bar\nbaz;qux"), "keinDatum");
  const zehn = ["Datum;Zeit;kWh"];
  for (const r of reihe({ tage: 8, intervall: 10 })) zehn.push(`${de(r.d)};${hm(r.d)};1,0`);
  wirft(() => leseLastgang(zehn.join("\n")), "intervall");
});

console.log("Analyse");
test("Feiertage Österreich 2025 und Tagtypen", () => {
  assert.equal(ostersonntag(2025), Date.UTC(2025, 3, 20));
  const f = feiertageAT(2025);
  assert.ok(f.has(Date.UTC(2025, 3, 21))); // Ostermontag
  assert.ok(f.has(Date.UTC(2025, 5, 19))); // Fronleichnam
  assert.ok(f.has(Date.UTC(2025, 9, 26))); // Nationalfeiertag
  assert.equal(f.size, 13);
  assert.equal(tagTyp(Date.UTC(2025, 3, 21, 10)), 2);
  assert.equal(tagTyp(Date.UTC(2025, 3, 19, 10)), 1);
  assert.equal(tagTyp(Date.UTC(2025, 3, 22, 10)), 0);
});
const LG = leseLastgang(beispielCsv());
const A = analysiere(LG);
test("Beispiel: Jahresverbrauch, Spitze, Grundlast plausibel", () => {
  assert.equal(A.hochgerechnet, false);
  assert.ok(A.jahresverbrauch > 700000 && A.jahresverbrauch < 1100000, `Jahresverbrauch ${A.jahresverbrauch}`);
  assert.ok(A.spitze.kw > 250 && A.spitze.kw < 400, `Spitze ${A.spitze.kw}`);
  assert.ok(A.grundlast > 25 && A.grundlast < 50, `Grundlast ${A.grundlast}`);
  assert.equal(A.monate.length, 12);
  assert.ok(Math.abs(A.monate.reduce((s, m) => s + m.kwh, 0) - A.summe) < 1e-6);
  assert.ok(A.tagesgang.werktag[10 * 4] > A.tagesgang.sonntag[10 * 4] * 2);
  assert.ok(A.wochentage[6].kwhProTag < A.wochentage[2].kwhProTag);
  assert.equal(A.topSpitzen.length, 5);
  assert.equal(A.heat.tage.length, 365);
});
test("Teiljahr wird hochgerechnet und markiert", () => {
  const z = ["Datum;Zeit;Verbrauch kWh"];
  for (const r of reihe({ tage: 30 })) z.push(`${de(r.d)};${hm(r.d)};${(r.kw / 4).toFixed(3).replace(".", ",")}`);
  const a = analysiere(leseLastgang(z.join("\n")));
  assert.equal(a.hochgerechnet, true);
  assert.ok(Math.abs(a.jahresverbrauch - a.summe * (365 / 30)) < 1e-6);
});

console.log("PV-Simulation (PVGIS)");
const ORT = PVGIS.orte.ostermiething;
const PV = pvProfil(LG, ORT, "sued");
test("PV-Jahressumme = Summe der PVGIS-Monatswerte Süd 35°", () => {
  const s = PV.pv.reduce((a, b) => a + b, 0);
  const ziel = ORT.monate_sued35.reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(s - ziel) < 1e-6, `Summe ${s} statt ${ziel}`);
  assert.ok(Math.abs(s - ORT.sued35_kwh_kwp) <= 2, "Monatssumme weicht vom Jahreswert ab");
  assert.ok(PV.pv[0] === 0, "keine Erzeugung um Mitternacht");
});
test("Ost-West: Jahreswert und flacheres Winterprofil", () => {
  const ow = monatsErtraege(ORT, "ostwest");
  assert.ok(Math.abs(ow.reduce((a, b) => a + b, 0) - ORT.ostwest15_kwh_kwp) < 1e-6);
  assert.ok(ow[11] / ORT.ostwest15_kwh_kwp < ORT.monate_sued35[11] / ORT.sued35_kwh_kwp);
});
test("Eigenverbrauchsanteil fällt mit der Anlagengröße, Empfehlung erfüllt Ziel", () => {
  const k = kurve(LG.kwh, PV.pv, 1000, 12);
  for (let i = 1; i < k.length; i++) assert.ok(k[i].evQuote <= k[i - 1].evQuote + 1e-12);
  const e = empfehlung(LG.kwh, PV.pv, A.jahresverbrauch, PV.jahresErtrag, 0.8);
  assert.ok(e.ergebnis.evQuote >= 0.8, `EV ${e.ergebnis.evQuote}`);
  assert.ok(simuliere(LG.kwh, PV.pv, e.kwp * 1.3).evQuote < 0.8);
  assert.ok(e.kwp >= 50 && e.kwp <= 600, `kWp ${e.kwp}`);
});

console.log("Peak Shaving");
test("Einzelspitze: Leistung und Kapazität analytisch", () => {
  const kw = new Float64Array(96 * 7).fill(100);
  kw[40] = 200;
  const s = speicherFuerSchwelle(kw, 15, 150);
  assert.equal(s.leistungKw, 50);
  assert.ok(Math.abs(s.nutzbarKwh - 12.5) <= 0.5, `nutzbar ${s.nutzbarKwh}`);
  assert.equal(s.tageMitEingriff, 1);
  assert.equal(haeltSchwelle(kw, 15, 150, 12, 50), false);
  assert.equal(haeltSchwelle(kw, 15, 150, 12.5, 50), true);
});
test("Schwelle unter Dauerlast ist nicht erreichbar", () => {
  const kw = new Float64Array(96 * 3).fill(100);
  assert.equal(speicherFuerSchwelle(kw, 15, 80).moeglich, false);
});
test("Beispiel: 10 % Kappung → Speicher und Ersparnis > 0", () => {
  const ziel = A.spitze.kw * 0.9;
  const s = speicherFuerSchwelle(A.kw, 15, ziel);
  assert.ok(s.moeglich && s.leistungKw > 0 && s.nennKwh > s.nutzbarKwh);
  const e = ersparnisLeistungspreis(A.monate, ziel, 65.88);
  assert.ok(e.euro > 0 && e.nachher <= ziel + 1e-9);
});

console.log(process.exitCode ? "\nFEHLER" : `\nAlle ${ok} Tests bestanden.`);
