// scripts/alle-tests.mjs – führt alle scripts/*.test.mjs nacheinander aus (ohne Abhängigkeiten).
//
// Aufruf:  node scripts/alle-tests.mjs              alle Tests
//          node scripts/alle-tests.mjs rechner      nur Dateien, deren Name „rechner“ enthält
//          node scripts/alle-tests.mjs --ausgabe    Ausgabe jeder Datei vollständig zeigen
// Exit-Code 0, wenn alle Dateien bestehen, sonst 1. Bekannte Befunde sind als node:test-„todo“
// markiert: Sie werden gezählt und aufgelistet, lassen den Lauf aber nicht scheitern.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ORDNER = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(ORDNER, "..");
const args = process.argv.slice(2);
const ausgabe = args.includes("--ausgabe");
const filter = args.filter((a) => !a.startsWith("--"));

const dateien = fs
  .readdirSync(ORDNER)
  .filter((f) => f.endsWith(".test.mjs"))
  .filter((f) => !filter.length || filter.some((x) => f.includes(x)))
  .sort();

if (!dateien.length) {
  console.error(`Keine Testdateien gefunden${filter.length ? ` für „${filter.join(", ")}“` : ""}.`);
  process.exit(1);
}

const zahl = (text, name) => Number(text.match(new RegExp(`^ℹ ${name} (\\d+)`, "m"))?.[1] ?? NaN);
const ergebnisse = [];
const start = Date.now();

for (const datei of dateien) {
  const t0 = Date.now();
  const lauf = spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", path.join(ORDNER, datei)], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, NODE_TEST_CONTEXT: undefined },
    maxBuffer: 64 * 1024 * 1024,
  });
  const text = `${lauf.stdout || ""}${lauf.stderr || ""}`;
  const ok = lauf.status === 0;
  // node:test listet todo-Tests im Lauf und noch einmal in der Zusammenfassung → entdoppeln
  const todos = [...new Set([...text.matchAll(/^\s*⚠ (.+?) \([\d.]+m?s\)(?: # (.+))?$/gm)].map((m) => m[2] || m[1]))];
  const e = { datei, ok, ms: Date.now() - t0, tests: zahl(text, "tests"), fail: zahl(text, "fail"), todo: todos.length, todos, text, fehler: lauf.error };
  ergebnisse.push(e);
  const detail = Number.isFinite(e.tests) ? `${e.tests} Tests${e.todo ? `, ${e.todo} Befund(e)` : ""}` : "ohne node:test-Zusammenfassung";
  console.log(`${ok ? "OK    " : "FEHLER"}  ${datei.padEnd(34)} ${detail} · ${e.ms} ms`);
  if (ausgabe || !ok) console.log(text.replace(/^/gm, "        ").trimEnd());
  if (lauf.error) console.log(`        ${lauf.error.message}`);
}

const fehlgeschlagen = ergebnisse.filter((e) => !e.ok);
const alleTodos = ergebnisse.flatMap((e) => e.todos.map((t) => `${e.datei}: ${t}`));
console.log("");
console.log(`${ergebnisse.length} Dateien · ${ergebnisse.length - fehlgeschlagen.length} bestanden · ${fehlgeschlagen.length} fehlgeschlagen · ${((Date.now() - start) / 1000).toFixed(1)} s`);
if (alleTodos.length) {
  console.log(`\nBekannte Befunde (todo, brechen den Lauf nicht ab):`);
  for (const t of alleTodos) console.log(`  - ${t}`);
}
if (fehlgeschlagen.length) {
  console.log(`\nFehlgeschlagen: ${fehlgeschlagen.map((e) => e.datei).join(", ")}`);
  process.exit(1);
}
