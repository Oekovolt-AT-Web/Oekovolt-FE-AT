// scripts/kontrast-klassen.test.mjs – listet Tailwind-Klassen, die die Kontrastregel
// der Welle A verletzen (Wellenregel 5):
//   - text-ink-400 als Schriftfarbe            -> text-ink-500
//   - bg-ov-500 zusammen mit text-white        -> bg-ov-600 (hover ov-700)
//   - text-white/30 bis text-white/45          -> text-white/60
// Vorerst nur als Warnung (Exit 0, node:test-„todo“ mit Anzahl der Befunde);
// Paket E10 stellt auf Fehler um. scripts/kontrast.test.mjs (Farbwerte) bleibt unberührt.
//
// Aufruf: node scripts/kontrast-klassen.test.mjs            (Liste + Zusammenfassung)
//         KONTRAST_KLASSEN_STRENG=1 node scripts/kontrast-klassen.test.mjs   (Befunde = Fehler)

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/alias.mjs";

const SRC = path.join(ROOT, "src");
const ENDUNGEN = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const STRENG = process.env.KONTRAST_KLASSEN_STRENG === "1";

function* dateien(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "node_modules") yield* dateien(p);
    } else if (ENDUNGEN.has(path.extname(e.name))) yield p;
  }
}

// Klassen-Token als eigenständiges Wort (nicht Teil von z. B. "text-ink-400/50" -> zählt trotzdem,
// aber "hover:text-ink-400" ebenso; "text-ink-4000" oder "xtext-ink-400" nicht)
const TOKEN = (klasse) => new RegExp(`(?<![\\w-])${klasse.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`, "g");
const RE_INK_400 = TOKEN("text-ink-400");
const RE_WEISS_SCHWACH = /(?<![\w-])text-white\/(30|35|40|45)(?![\w-])/g;
// String-Literale (Anführungszeichen, Hochkomma, Template) – darin bg-ov-500 UND text-white
const RE_LITERAL = /"[^"\n]*"|'[^'\n]*'|`[^`]*`/g;

export function pruefeQuelle(text) {
  const befunde = { ink400: [], ovWeiss: [], weissSchwach: [] };
  const zeile = (idx) => text.slice(0, idx).split("\n").length;
  for (const m of text.matchAll(RE_INK_400)) befunde.ink400.push(zeile(m.index));
  for (const m of text.matchAll(RE_WEISS_SCHWACH)) befunde.weissSchwach.push(zeile(m.index));
  for (const m of text.matchAll(RE_LITERAL)) {
    const s = m[0];
    if (TOKEN("bg-ov-500").test(s) && TOKEN("text-white").test(s)) befunde.ovWeiss.push(zeile(m.index));
  }
  return befunde;
}

const alle = [];
for (const datei of dateien(SRC)) {
  const text = fs.readFileSync(datei, "utf8");
  const b = pruefeQuelle(text);
  const rel = path.relative(ROOT, datei).replace(/\\/g, "/");
  for (const z of b.ink400) alle.push({ datei: rel, zeile: z, art: "text-ink-400 -> text-ink-500" });
  for (const z of b.ovWeiss) alle.push({ datei: rel, zeile: z, art: "bg-ov-500 + text-white -> bg-ov-600" });
  for (const z of b.weissSchwach) alle.push({ datei: rel, zeile: z, art: "text-white/30–45 -> text-white/60" });
}

if (alle.length) {
  console.log(`Kontrastklassen: ${alle.length} Befund(e) in ${new Set(alle.map((a) => a.datei)).size} Datei(en)`);
  for (const a of alle) console.log(`  ${a.datei}:${a.zeile}  ${a.art}`);
} else console.log("Kontrastklassen: keine Befunde");

test("Selbsttest: Muster erkennen", () => {
  const b = pruefeQuelle(`<p className="text-ink-400 hover:text-ink-400">x</p>\n<a className={\`bg-ov-500 text-white\`}>y</a>\n<span className="text-white/40 text-ink-4000">z</span>`);
  assert.deepEqual(b, { ink400: [1, 1], ovWeiss: [2], weissSchwach: [3] });
});

const anzahl = alle.length;
test(
  `Kontrastklassen unter src/ (${anzahl} Befund(e))`,
  { todo: !STRENG && anzahl ? `${anzahl} Befund(e) – Warnung, E10 stellt auf Fehler um` : false },
  () => {
    // Im Warnmodus ist der Test als „todo“ markiert: Die Zusicherung scheitert, zählt aber
    // nicht als Fehler (Exit 0) und erscheint in scripts/alle-tests.mjs als bekannter Befund.
    assert.equal(anzahl, 0, `${anzahl} Kontrastklassen-Befund(e), siehe Liste oben`);
  }
);
