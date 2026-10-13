// scripts/c02-foerderstatus.test.mjs
//
// Tests für Paket C02: Fristen aus Statustexten (foerderstatusText.js),
// Gemeindeförderungen (Datenqualität: Quelle und Prüfdatum je Zeile, keine
// erfundenen Programme), Elektrizitätsabgabe-Rechnung und der neue Ratgeber
// (pruefen:true, noindex, keine Steuerberatung).
// Aufruf: node scripts/c02-foerderstatus.test.mjs

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lade = (rel) => import(pathToFileURL(path.join(root, rel)).href);

let fehler = 0;
const test = async (name, fn) => {
  try {
    await fn();
    console.log(`  ok  ${name}`);
  } catch (e) {
    fehler += 1;
    console.log(`  FEHLER  ${name}\n      ${e.message}`);
  }
};

console.log("C02 – Förderstatus, Gemeindeförderungen, Steuer 2027");

// --- foerderstatusText -------------------------------------------------------
const { fristAusText, startAusText, datumsfelder, textSagtBeendet } = await lade("src/components/Forderungen/foerderstatusText.js");

await test("fristAusText: 'bis 31.12.2026' → 2026-12-31", () => assert.equal(fristAusText("laut Sekundärquellen bis 31.12.2026, Antrag bis 6 Monate nach Rechnung"), "2026-12-31"));
await test("fristAusText: Zeitraum '08.10.–22.10.2026' → Ende", () => assert.equal(fristAusText("Call 08.10.–22.10.2026: läuft"), "2026-10-22"));
await test("fristAusText: 'Stichtag 30.06.2026'", () => assert.equal(fristAusText("einziger Stichtag 30.06.2026 – derzeit keine Einreichung"), "2026-06-30"));
await test("fristAusText: 'Einreichung bis 30.09.2026'", () => assert.equal(fristAusText("Einreichung bis 30.09.2026"), "2026-09-30"));
await test("fristAusText: 'eingestellt per 01.07.2026'", () => assert.equal(fristAusText("eingestellt per 01.07.2026 – Mittel ausgeschöpft"), "2026-07-01"));
await test("fristAusText: ohne Datum → null (nichts schätzen)", () => assert.equal(fristAusText("laufend, solange Mittel reichen"), null));
await test("startAusText: 'seit 01.05.2026'", () => assert.equal(startAusText("seit 01.05.2026"), "2026-05-01"));
await test("startAusText: Zeitraum → Start", () => assert.equal(startAusText("23.04.–11.05.2026"), "2026-04-23"));
await test("textSagtBeendet erkennt ausgeschöpft/beendet, nicht 'laufend'", () => {
  assert.equal(textSagtBeendet("wegen ausgeschöpftem Budget vorzeitig beendet"), true);
  assert.equal(textSagtBeendet("laufend"), false);
});
await test("datumsfelder: ISO-Felder haben Vorrang vor dem Text", () => {
  const d = datumsfelder({ fristIso: "2027-03-10", status: "bis 31.12.2026" });
  assert.equal(d.fristIso, "2027-03-10");
});
await test("datumsfelder: beendet ohne Datum → anzeigeStatus 'beendet'", () => {
  assert.equal(datumsfelder({ ende: "Mittel ausgeschöpft – derzeit keine Antragstellung" }).anzeigeStatus, "beendet");
});

// --- programmStatus (C01) mit abgeleiteten Feldern ---------------------------
const psPfad = path.join(root, "src/lib/programmStatus.js");
if (fs.existsSync(psPfad)) {
  const { programmStatus } = await lade("src/lib/programmStatus.js");
  await test("programmStatus: Landesprogramm mit Textfrist springt nach der Frist auf 'abgelaufen'", () => {
    const p = { status: "laut Sekundärquellen bis 31.12.2026", ...datumsfelder({ status: "laut Sekundärquellen bis 31.12.2026" }) };
    assert.equal(programmStatus(p, "2026-10-11T12:00:00+02:00"), "offen");
    assert.equal(programmStatus(p, "2027-01-02T12:00:00+01:00"), "abgelaufen");
  });
  await test("programmStatus: beendetes KPC-Programm ohne Datum → 'abgelaufen'", () => {
    const p = datumsfelder({ ende: "wegen ausgeschöpftem Budget vorzeitig beendet" });
    assert.equal(programmStatus(p, Date.now()), "abgelaufen");
  });
} else {
  console.log("  (übersprungen) src/lib/programmStatus.js fehlt noch – C01");
}

// --- Gemeindeförderungen -------------------------------------------------------
const { GEMEINDEFOERDERUNGEN, BEZIRKE, GEMEINDE_STATUS, zaehleStatus } = await lade("src/data/gemeindefoerderungen.js");

await test("Gemeinden: 46 im Bezirk Braunau, 37 in Salzburg-Umgebung", () => {
  assert.equal(GEMEINDEFOERDERUNGEN.filter((g) => g.bezirk === "braunau").length, 46);
  assert.equal(GEMEINDEFOERDERUNGEN.filter((g) => g.bezirk === "salzburg-umgebung").length, 37);
});
await test("Gemeinden: GKZ eindeutig, fünfstellig, Bezirk bekannt", () => {
  const gkz = new Set();
  for (const g of GEMEINDEFOERDERUNGEN) {
    assert.match(g.gkz, /^\d{5}$/, `${g.gemeinde}: GKZ ${g.gkz}`);
    assert.equal(gkz.has(g.gkz), false, `GKZ doppelt: ${g.gkz}`);
    gkz.add(g.gkz);
    assert.ok(BEZIRKE.some((b) => b.id === g.bezirk), `${g.gemeinde}: Bezirk ${g.bezirk}`);
    assert.ok(GEMEINDE_STATUS[g.status], `${g.gemeinde}: Status ${g.status}`);
  }
});
await test("Gemeinden: jede geprüfte Zeile hat Quelle (https) und Prüfdatum", () => {
  for (const g of GEMEINDEFOERDERUNGEN.filter((x) => x.status !== "ungeprueft")) {
    assert.match(g.quelleUrl || "", /^https:\/\//, `${g.gemeinde}: quelleUrl fehlt`);
    assert.match(g.geprueftAm || "", /^\d{4}-\d{2}-\d{2}$/, `${g.gemeinde}: geprueftAm fehlt`);
  }
});
await test("Gemeinden: Programme nennen Programm und Hinweis; Höhe nur mit Primärquelle (pruefen:true → keine Höhe)", () => {
  for (const g of GEMEINDEFOERDERUNGEN.filter((x) => x.status === "programm" || x.status === "ausgesetzt")) {
    assert.ok(g.programm, `${g.gemeinde}: programm fehlt`);
    if (g.pruefen) assert.equal(g.hoehe, null, `${g.gemeinde}: Höhe trotz pruefen:true`);
  }
});
await test("Gemeinden: ungeprüfte Zeilen tragen weder Programm noch Höhe", () => {
  for (const g of GEMEINDEFOERDERUNGEN.filter((x) => x.status === "ungeprueft")) {
    assert.equal(g.programm, null, g.gemeinde);
    assert.equal(g.hoehe, null, g.gemeinde);
  }
});
await test("Gemeinden: zaehleStatus summiert alle Zeilen", () => {
  const z = zaehleStatus();
  assert.equal(z.programm + z.ausgesetzt + z.keine + z.ungeprueft, GEMEINDEFOERDERUNGEN.length);
  assert.ok(z.programm >= 4, "mindestens Thalgau, Wals-Siezenheim, Hallwang, Henndorf, Eugendorf, Bergheim");
});

// --- Elektrizitätsabgabe (Konstanten in elabg.js, ohne "use client") -------------
const elabgQuelle = fs.readFileSync(path.join(root, "src/components/Forderungen/Steuerlich/elabg.js"), "utf8");
const rechnerQuelle = fs.readFileSync(path.join(root, "src/components/Forderungen/Steuerlich/ElektrizitaetsabgabeRechner.js"), "utf8");
const { ELABG_SAETZE, ELABG_SATZ_2027, ersparnis } = await lade("src/components/Forderungen/Steuerlich/elabg.js");
await test("Elektrizitätsabgabe: einheitlicher Satz 2027 wörtlich in elabg.js", () => {
  assert.equal(ELABG_SATZ_2027, "Laut geltendem Recht ab 2027 wieder 1,5 ct/kWh; eine Verlängerung der Senkung wird verhandelt (Stand 29.09.2026)");
});
await test("Elektrizitätsabgabe: 60.000 kWh × 1,5 ct = 900 €, × 0,82 ct = 492 €; Sätze", () => {
  assert.equal(ersparnis(60000, ELABG_SAETZE.regulaer), 900);
  assert.equal(ersparnis(60000, ELABG_SAETZE.betrieb2026), 492);
  assert.equal(ersparnis(0, 1.5), 0);
  assert.equal(ELABG_SAETZE.haushalt2026, 0.1);
});
await test("QA C02: elabg.js ohne 'use client'; Client-Rechner exportiert keine Konstanten (Server-Proxy-Fehler)", () => {
  assert.equal(/^\s*["']use client["']/m.test(elabgQuelle), false);
  assert.ok(/^"use client"/.test(rechnerQuelle));
  assert.equal(/export\s+(const|function)\s/.test(rechnerQuelle), false, "nur der Default-Export der Komponente");
  assert.ok(rechnerQuelle.includes('from "./elabg"'));
});
await test("QA C02: Rechner-Werte brechen nicht um (whitespace-nowrap, geschütztes Leerzeichen vor €)", () => {
  assert.ok(rechnerQuelle.includes("whitespace-nowrap"));
  assert.ok(/toLocaleString\("de-AT"\)\}( |\u00a0)€/.test(rechnerQuelle));
  assert.equal(/min-h-9/.test(rechnerQuelle), false, "Tap-Ziele mind. 44 px");
});

// --- Steuerseite: Pflichttexte --------------------------------------------------
const steuer = fs.readFileSync(path.join(root, "src/app/forderungen/steuerlich/page.js"), "utf8");
await test("Steuerseite: 'Was sich 2027 ändert', Elektrizitätsabgabe-H2, BGBl. I Nr. 62/2026, keine Steuerberatung", () => {
  assert.ok(steuer.includes("Was sich 2027 ändert"));
  assert.ok(steuer.includes("Elektrizitätsabgabe bei PV-Eigenverbrauch"));
  assert.ok(steuer.includes("BGBl. I Nr. 62/2026"));
  assert.ok(steuer.includes("degressive AfA") || steuer.includes("Degressive AfA"));
  assert.ok(steuer.includes("1 Mio. €"));
  assert.ok(/Übergabe/.test(steuer) && /nicht die Bestellung/.test(steuer));
  assert.ok(steuer.toLowerCase().includes("keine steuerberatung"));
});
await test("QA C02: Steuerseite importiert Konstanten nicht aus der Client-Datei; Pflichtsatz nicht doppelt im Absatz", () => {
  assert.equal(/import[^;]*\{[^}]*ELABG[^}]*\}[^;]*ElektrizitaetsabgabeRechner/.test(steuer), false);
  assert.ok(steuer.includes('from "@/components/Forderungen/Steuerlich/elabg"'));
  assert.equal((steuer.match(/(?<!\$)\{ELABG_SATZ_2027\}/g) || []).length, 0, "Pflichtsatz steht im Rechner, nicht zusätzlich im Absatz");
});
await test("QA C02: Meta-Description ≤ 160 Zeichen (status, steuerlich, ladeinfrastruktur), Title ≤ 60", () => {
  for (const rel of ["src/app/forderungen/status/page.js", "src/app/forderungen/steuerlich/page.js", "src/app/forderungen/ladeinfrastruktur/page.js"]) {
    const q = fs.readFileSync(path.join(root, rel), "utf8");
    const d = q.match(/const DESCRIPTION = "([^"]+)"/)[1];
    const t = q.match(/const TITLE = "([^"]+)"/)[1];
    assert.ok(d.length <= 160, `${rel}: Description ${d.length}`);
    assert.ok(t.length <= 60, `${rel}: Title ${t.length}`);
  }
});
await test("QA C02: Status-Kennzahl zählt nur geprüfte Gemeinden", () => {
  const q = fs.readFileSync(path.join(root, "src/app/forderungen/status/page.js"), "utf8");
  assert.equal(q.includes("${GEMEINDEFOERDERUNGEN.length} geprüften"), false);
  assert.ok(q.includes("gemeindenGeprueft"));
  const z = zaehleStatus();
  assert.ok(z.programm + z.ausgesetzt + z.keine < GEMEINDEFOERDERUNGEN.length);
  assert.equal(BEZIRKE.some((b) => b.kuerzel === "S"), false, "kein unklares Kürzel 'S'");
});

// --- Ladeinfrastruktur-Seite ----------------------------------------------------
const laden = fs.readFileSync(path.join(root, "src/app/forderungen/ladeinfrastruktur/page.js"), "utf8");
await test("Ladeinfrastruktur: keine Formulierung 'Förderung sichern', alle 9 Länder, Link zum Planer", () => {
  assert.equal(/förderung(?:en)? sichern/i.test(laden), false);
  for (const l of ["Burgenland", "Steiermark", "Oberösterreich", "Tirol", "Vorarlberg", "Niederösterreich", "Salzburg", "Kärnten", "Wien"]) assert.ok(laden.includes(`land: "${l}"`), l);
  assert.ok(laden.includes("/rechner/ladeinfrastruktur"));
  assert.ok(laden.includes("eRide"));
});
await test("QA C02: Ladeinfrastruktur ohne unbelegte Spanne 'meist 100 bis 300 €', Steiermark mit Prüfvermerk", () => {
  assert.equal(/meist 100 bis 300/.test(laden), false);
  assert.equal(laden.includes("Burgenland und Steiermark: 300 €"), false);
  assert.equal(/Nächster Fördercall/.test(laden), false);
});

// --- Ratgeber (Entwurf mit Unterstrich, bis zur Freigabe nicht veröffentlicht) ---
const ratgeber = (await lade("src/content/ratgeber/_gewinnfreibetrag-photovoltaik-2027.js")).default;
await test("Ratgeber: slug, pruefen:true mit Vermerk, noindex, Kategorie, Quellen", () => {
  assert.equal(ratgeber.slug, "gewinnfreibetrag-photovoltaik-2027");
  assert.equal(ratgeber.pruefen, true);
  assert.equal(ratgeber.pruefHinweis, "vor Veröffentlichung Steuerberatung gegenlesen");
  assert.equal(ratgeber.noindex, true);
  assert.equal(ratgeber.kategorie, "Förderung, Steuern & Recht");
  assert.ok(ratgeber.quellen.length >= 4);
  assert.ok(ratgeber.seoTitle.length <= 60 && ratgeber.seoTitle.endsWith("| Ökovolt"));
});
await test("QA C02: Ratgeber bis zur Freigabe nicht im Index (keine Sitemap/llms/Übersicht) und nicht verlinkt", () => {
  assert.equal(fs.existsSync(path.join(root, "src/content/ratgeber/gewinnfreibetrag-photovoltaik-2027.js")), false);
  const index = fs.readFileSync(path.join(root, "src/content/ratgeber/index.js"), "utf8");
  assert.equal(index.includes("gewinnfreibetrag-photovoltaik-2027"), false);
  assert.equal(/href:\s*"\/ratgeber\/gewinnfreibetrag-photovoltaik-2027"/.test(steuer), false);
});
await test("Ratgeber: 'keine Steuerberatung' und Freiberufler-Beispiel enthalten", () => {
  const text = JSON.stringify(ratgeber);
  assert.ok(/keine Steuerberatung/i.test(text));
  assert.ok(/Freiberuf/i.test(text));
  assert.ok(text.includes("15.210"));
});
await test("Ratgeber: Rechenbeispiel stimmt (13 % von 117.000 = 15.210; 48 % Steuer)", () => {
  assert.equal(Math.round(117000 * 0.13), 15210);
  assert.equal(Math.round((4950 + 15210) * 0.48), 9677);
  assert.equal(Math.round(4950 * 0.48), 2376);
  assert.equal(Math.round(22000 * 0.15), 3300);
});

console.log(fehler ? `\n${fehler} Test(s) fehlgeschlagen` : "\nalle Tests grün");
process.exit(fehler ? 1 : 0);
