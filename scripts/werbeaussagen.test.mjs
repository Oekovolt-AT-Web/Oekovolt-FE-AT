// Tests für src/data/werbeaussagen.js (Belegakte) und Suche nach unbelegten Werbeaussagen im Quelltext.
// Aufruf: node scripts/werbeaussagen.test.mjs
//         node scripts/werbeaussagen.test.mjs --baseline   (Altbestand neu erfassen)
//
// Durchsucht src/app, src/components, src/data und src/content zeilenweise nach Spitzenstellungs-,
// Umwelt- und Garantiebegriffen (UWG). Eine Fundstelle ist erlaubt, wenn die Datei im Register
// (src/data/werbeaussagen.js) bei einem freigegebenen Eintrag unter `fundstellen` steht.
// Der Altbestand steht in scripts/werbeaussagen.baseline.json (beim ersten Lauf erzeugt, jede Zeile
// in docs/projekt-doku/anhang/wellen/A02.md triagiert). Der Test schlägt nur bei NEUEN Fundstellen fehl;
// verschwundene Altbestände werden gemeldet (Baseline dann mit --baseline neu schreiben).

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { ROOT, srcUrl } from "./lib/alias.mjs";

const BASELINE = path.join(ROOT, "scripts", "werbeaussagen.baseline.json");
const ORDNER = ["src/app", "src/components", "src/data", "src/content"];
const ENDUNGEN = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx", ".md", ".mdx"]);
const AUSGENOMMEN = new Set(["src/data/werbeaussagen.js"]); // das Register selbst

/**
 * Muster: name → { re, ok(zeile, treffer) } – `ok` sagt, ob ein Treffer trotzdem erlaubt ist
 * (Rechtszitate, Verneinungen). Alle Muster mit Wortgrenze, damit „weiterführend“, „ausführend“,
 * „durchführend“ und Tailwind-Klassen wie „-top-3“ nicht anschlagen.
 */
export const MUSTER = [
  { name: "marktfuehrer", re: /\bMarktführer/g },
  {
    name: "nr-1",
    re: /\bNr\.\s?1\b/g,
    // Rechtszitate wie „Abs. 1 Nr. 1“, „§ 5 Nr. 1“, „Z 1 Nr. 1“ oder „Nr. 1 lit a“ sind keine Werbung
    ok: (zeile, m) => /(Abs\.?\s*\d+\w*\s*|§\s*\d+\w*\s*|\bZ\s*\d+\s*|Ziffer\s*\d+\s*|Satz\s*\d+\s*|Art\.?\s*\d+\w*\s*)$/.test(zeile.slice(0, m.index)) || /^\s*(lit|Z|Abs|Satz)\b/.test(zeile.slice(m.index + m[0].length)),
  },
  { name: "nummer-1", re: /\bdie Nummer 1\b/g },
  { name: "groesste-oesterreichs", re: /\bgrößte[rsn]?\b.{0,30}Österreichs/g },
  {
    name: "fuehrend",
    re: /\b[Ff]ührende[rsnm]?\b/g,
    // „mit führenden Nullen“ (Zählpunkt-, Netzbetreibernummern) ist keine Werbung
    ok: (zeile, m) => /^\s+Null/.test(zeile.slice(m.index + m[0].length)),
  },
  { name: "testsieger", re: /\bTestsieger/g },
  { name: "klimaneutral", re: /\bklimaneutral/gi },
  { name: "co2-neutral", re: /\bCO(?:₂|2)-neutral/gi },
  { name: "umweltfreundlich", re: /\bumweltfreundlich/gi },
  {
    name: "garantiert",
    re: /\bgarantiert\b/gi,
    // „nicht garantiert“, „keine garantierte …“, „ohne garantierte …“ sind Einschränkungen, keine Zusagen
    ok: (zeile, m) => /\b(nicht|keine?[rsn]?|ohne|nie)\s+$/i.test(zeile.slice(0, m.index)),
  },
  { name: "top-3", re: /\b(?:TOP|Top)[  -]3\b/g },
];

/**
 * Erwähnung statt Verwendung: Ein Begriff in deutschen Anführungszeichen („klimaneutral“) oder in einer
 * reinen Kommentarzeile ist ein Zitat bzw. eine Regel (z. B. „Keine Aussage ‚klimaneutral‘“), keine Werbung.
 */
export const erwaehnung = (zeile, m) =>
  /^\s*(\/\/|\*|\/\*)/.test(zeile) || (/[„‚"]$/.test(zeile.slice(0, m.index)) && /^[“‘"]/.test(zeile.slice(m.index + m[0].length)));

/** Alle Dateien unter den Ordnern (rekursiv), relativ zum Projekt mit „/“. */
function dateien() {
  const aus = [];
  const lauf = (abs) => {
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      const p = path.join(abs, e.name);
      if (e.isDirectory()) lauf(p);
      else if (ENDUNGEN.has(path.extname(e.name))) aus.push(path.relative(ROOT, p).split(path.sep).join("/"));
    }
  };
  for (const o of ORDNER) if (fs.existsSync(path.join(ROOT, o))) lauf(path.join(ROOT, o));
  return aus.filter((d) => !AUSGENOMMEN.has(d)).sort();
}

/** Fundstellen im Quelltext: [{ datei, zeile, muster, text }] – `text` ist die Zeile ohne Einrückung. */
export function suchen(liste = dateien()) {
  const funde = [];
  for (const datei of liste) {
    const zeilen = fs.readFileSync(path.join(ROOT, datei), "utf8").split(/\r?\n/);
    zeilen.forEach((zeile, i) => {
      for (const { name, re, ok } of MUSTER) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(zeile))) {
          if (erwaehnung(zeile, m) || (ok && ok(zeile, m))) continue;
          funde.push({ datei, zeile: i + 1, muster: name, text: zeile.trim().slice(0, 200) });
        }
      }
    });
  }
  return funde;
}

const schluessel = (f) => `${f.datei}|${f.muster}|${f.text}`;

/** Fundstellen, die das Register erlaubt (Datei bei einem freigegebenen Eintrag). */
function erlaubt(funde, register) {
  const frei = new Set(register.WERBEAUSSAGEN.filter((w) => register.werbeaussageAktiv(w.id)).flatMap((w) => w.fundstellen));
  return funde.filter((f) => frei.has(f.datei));
}

const register = await import(srcUrl("data/werbeaussagen.js"));

if (process.argv.includes("--baseline")) {
  const funde = suchen();
  const offen = funde.filter((f) => !erlaubt(funde, register).includes(f));
  fs.writeFileSync(BASELINE, `${JSON.stringify({ stand: new Date().toISOString().slice(0, 10), hinweis: "Altbestand unbelegter Werbebegriffe – jede Zeile in docs/projekt-doku/anhang/wellen/A02.md triagiert. Neu erzeugen: node scripts/werbeaussagen.test.mjs --baseline", funde: offen }, null, 2)}\n`);
  console.log(`Baseline geschrieben: ${offen.length} Fundstellen → ${path.relative(ROOT, BASELINE)}`);
}

describe("Register src/data/werbeaussagen.js", () => {
  test("Einträge vollständig, ids eindeutig, Schalter nur mit Beleg und Freigabe", () => {
    const ids = register.WERBEAUSSAGEN.map((w) => w.id);
    assert.equal(new Set(ids).size, ids.length, "ids eindeutig");
    for (const w of register.WERBEAUSSAGEN) {
      assert.match(w.id, /^[a-z0-9-]+$/, w.id);
      assert.ok(w.text, `${w.id}: text`);
      assert.ok(Array.isArray(w.fundstellen), `${w.id}: fundstellen[]`);
      assert.ok(["eigen", "fremdzitat"].includes(w.art), `${w.id}: art`);
      assert.match(w.stand, /^\d{4}-\d{2}-\d{2}$/, `${w.id}: stand`);
      assert.equal(typeof w.freigegeben, "boolean", `${w.id}: freigegeben`);
      if (w.freigegeben) {
        assert.ok(w.beleg && w.freigegeben_von, `${w.id}: freigegeben nur mit beleg und freigegeben_von`);
      }
      for (const f of w.fundstellen) assert.ok(fs.existsSync(path.join(ROOT, f)), `${w.id}: Fundstelle ${f} existiert`);
    }
    assert.match(register.WERBEAUSSAGEN_STAND, /^\d{4}-\d{2}-\d{2}$/);
  });

  test("Inhaber-Entscheidungen 05.10.2026: TOP 3, Meisterbetrieb, eigener Parkregler, Kundenlogo, Salzburg-AG-Werbung AUS", () => {
    for (const id of ["top3-epc-2021", "marktfuehrer", "meisterbetrieb-wko", "eigener-parkregler", "kundenlogo-hero-video", "salzburg-ag-bevorzugter-errichter"]) {
      assert.ok(register.werbeaussage(id), `Eintrag ${id} vorhanden`);
      assert.equal(register.werbeaussageAktiv(id), false, `${id} ist AUS`);
    }
    assert.equal(register.werbeaussageAktiv("gruender-betreiben"), true);
    assert.equal(register.werbeaussageAktiv("salzburg-ag-gesellschafterin"), true);
    assert.equal(register.werbeaussage("gibt-es-nicht"), null);
    assert.equal(register.werbeaussageAktiv("gibt-es-nicht"), false);
  });
});

describe("Muster – keine Fehlalarme", () => {
  const treffer = (text) => suchenInText(text).map((f) => f.muster);
  function suchenInText(text) {
    const aus = [];
    for (const { name, re, ok } of MUSTER) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text))) if (!erwaehnung(text, m) && !(ok && ok(text, m))) aus.push({ muster: name });
    }
    return aus;
  }
  test("Rechtszitate und Ableitungen schlagen nicht an", () => {
    assert.deepEqual(treffer("nach § 2 Abs. 1 Nr. 1 UWG"), []);
    assert.deepEqual(treffer("§ 5 Z 1 Nr. 1 lit a"), []);
    assert.deepEqual(treffer("Art. 6 Abs. 1 Nr. 1 DSGVO"), []);
    assert.deepEqual(treffer("weiterführende Links, ausführende Firma, durchführende Stelle"), []);
    assert.deepEqual(treffer("Netzbetreibernummer mit führenden Nullen, mit führender Null"), []);
    assert.deepEqual(treffer("Keine Aussage „klimaneutral“ und kein „Marktführer“"), []);
    assert.deepEqual(treffer("// Regel: kein Marktführer ohne Beleg"), []);
    assert.deepEqual(treffer('className="absolute -top-3 left-4"'), []);
    assert.deepEqual(treffer("Ertrag wird nicht garantiert; keine garantierte Vergütung; ohne garantierten Ertrag"), []);
    assert.deepEqual(treffer("Marktführung ist kein Wort hier: Marktfuehrer"), []);
  });
  test("Werbebegriffe schlagen an", () => {
    assert.deepEqual(treffer("Wir sind Marktführer"), ["marktfuehrer"]);
    assert.deepEqual(treffer("Der Nr. 1 Errichter"), ["nr-1"]);
    assert.deepEqual(treffer("die Nummer 1 in Österreich"), ["nummer-1"]);
    assert.deepEqual(treffer("der größte PV-Errichter Österreichs"), ["groesste-oesterreichs"]);
    assert.deepEqual(treffer("ein führender Anbieter"), ["fuehrend"]);
    assert.deepEqual(treffer("Führende Technik"), ["fuehrend"]);
    assert.deepEqual(treffer("Testsieger 2025"), ["testsieger"]);
    assert.deepEqual(treffer("klimaneutral produziert"), ["klimaneutral"]);
    assert.deepEqual(treffer("CO₂-neutral und CO2-neutral"), ["co2-neutral", "co2-neutral"]);
    assert.deepEqual(treffer("umweltfreundlicher Strom"), ["umweltfreundlich"]);
    assert.deepEqual(treffer("Ertrag garantiert"), ["garantiert"]);
    assert.deepEqual(treffer("TOP 3 der EPC-Errichter"), ["top-3"]);
    assert.deepEqual(treffer("Top 3"), ["top-3"]);
  });
});

describe("Quelltext ohne neue unbelegte Werbeaussagen", () => {
  test("keine neuen Fundstellen gegenüber scripts/werbeaussagen.baseline.json", () => {
    assert.ok(fs.existsSync(BASELINE), "Baseline fehlt – einmal `node scripts/werbeaussagen.test.mjs --baseline` ausführen");
    const basis = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
    const bekannt = new Set(basis.funde.map(schluessel));
    const funde = suchen();
    const frei = new Set(erlaubt(funde, register).map(schluessel));
    const neu = funde.filter((f) => !frei.has(schluessel(f)) && !bekannt.has(schluessel(f)));
    const weg = basis.funde.filter((f) => !funde.some((g) => schluessel(g) === schluessel(f)));
    if (weg.length) console.log(`ℹ ${weg.length} Altbestand-Fundstelle(n) nicht mehr vorhanden – Baseline mit --baseline aktualisieren:\n${weg.map((f) => `  - ${f.datei}: ${f.text.slice(0, 80)}`).join("\n")}`);
    assert.deepEqual(
      neu.map((f) => `${f.datei}:${f.zeile} [${f.muster}] ${f.text}`),
      [],
      "Neue Werbeaussage ohne Register-Eintrag – in src/data/werbeaussagen.js eintragen (Beleg!) oder Text ändern"
    );
  });

  test("Abnahme A02: „TOP 3“, „bevorzugter PV-Errichter“ und „eigener Parkregler“ nur noch im Register bzw. Altbestand anderer Pakete", () => {
    const eigene = [
      "src/data/hero.js",
      "src/data/unternehmen.js",
      "src/data/marke.js",
      "src/data/tvSchauraum.js",
      "src/data/regionen/salzburg.js",
      "src/components/Startseite/S01Hero.js",
      "src/components/Startseite/S05Warum.js",
      "src/components/Startseite/S12Abschluss.js",
      "src/components/Startseite/S08Technik.js",
      "src/components/Startseite/s08-Schema.js",
      "src/data/mannschaft.js",
      "src/components/Team/Firmengeschichte.js",
      "src/app/uber-uns/page.js",
      "src/app/uber-uns/team/page.js",
      "src/app/uber-uns/jobs/[title]/page.js",
      "src/app/presse/page.js",
      "src/app/produkte/photovoltaikanlage/page.js",
    ];
    for (const d of eigene) {
      const text = fs.readFileSync(path.join(ROOT, d), "utf8");
      // Kommentarzeilen dürfen die Begriffe nennen (Begründung), Code/Texte nicht.
      const code = text
        .split(/\r?\n/)
        .filter((z) => !/^\s*(\/\/|\*|\/\*)/.test(z))
        .join("\n");
      assert.doesNotMatch(code, /\bTOP 3\b/, `${d}: TOP 3`);
      assert.doesNotMatch(code, /bevorzugte[rn]? PV-Errichter/i, `${d}: bevorzugter PV-Errichter`);
      // marke.js hält die Formulierung hinter PARKREGLER_RECHTE_GEKLAERT (Schalter) – dort erlaubt
      if (d !== "src/data/marke.js") assert.doesNotMatch(code, /\beigene[rnm]? (Parkregler|EZA-Regler)/i, `${d}: eigener Parkregler`);
      // QA 12.10.: „eigene Entwicklung“ am Parkregler (Systemschema) – nur in Zeilen, die am Schalter
      // PARKREGLER_RECHTE_GEKLAERT hängen, erlaubt.
      const ungeschaltet = code
        .split("\n")
        .filter((z) => !z.includes("PARKREGLER_RECHTE_GEKLAERT"))
        .join("\n");
      assert.doesNotMatch(ungeschaltet, /\b(eigene|eigener) Entwicklung\b|selbst entwickelt|aus eigener Entwicklung/i, `${d}: eigene Entwicklung`);
    }
    // Meisterbetrieb/WKO-Gütesiegel nur, wenn FIRMA.guetesiegel.meisterbetrieb.belegt (QA 12.10., mannschaft.js)
    const mannschaft = fs.readFileSync(path.join(ROOT, "src/data/mannschaft.js"), "utf8");
    const meister = mannschaft.split(/\r?\n/).find((z) => /id: "meister"/.test(z)) || "";
    assert.ok(!/bestaetigt: true/.test(meister), "mannschaft.js: Meisterbetrieb ohne Beleg fest bestätigt");
    // Der Schalter steht auf AUS, deshalb liefert marke.js keinen „eigenen Parkregler“
    const marke = fs.readFileSync(path.join(ROOT, "src/data/marke.js"), "utf8");
    assert.match(marke, /export const PARKREGLER_RECHTE_GEKLAERT = false;/);
  });
});
