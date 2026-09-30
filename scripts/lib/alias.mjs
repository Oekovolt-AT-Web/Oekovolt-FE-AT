// scripts/lib/alias.mjs
//
// Kleiner Modul-Hook für Node-Tests: löst die Next.js-Pfad-Aliase so auf wie
// jsconfig.json ("@/*" -> "./src/*") und der Next-Bundler (Endung ".js" bzw.
// "/index.js" ergänzen, JSON ohne Import-Attribut).
//
// Nutzung (ohne Abhängigkeiten, Node >= 22.15 bzw. 23.5 wegen module.registerHooks):
//   node --import ./scripts/lib/alias.mjs scripts/<name>.test.mjs
// oder im Test selbst – dann die Alias-Module DYNAMISCH laden, weil statische
// Importe schon vor diesem Hook aufgelöst werden:
//   import { srcUrl } from "./lib/alias.mjs";
//   const { x } = await import(srcUrl("lib/rechnerTeilen.js"));

import fs from "node:fs";
import path from "node:path";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SRC = path.join(ROOT, "src");
const SRC_URL = pathToFileURL(SRC).href;

/** file://-URL einer Datei unter src/ (z. B. srcUrl("lib/heatmap.js")). */
export const srcUrl = (relativ) => pathToFileURL(path.join(SRC, relativ)).href;

/** Pfad ohne Endung wie der Bundler ergänzen: x -> x.js | x.mjs | x.json | x/index.js */
function ergaenze(ziel) {
  if (path.extname(ziel) && fs.existsSync(ziel)) return ziel;
  for (const kandidat of [`${ziel}.js`, `${ziel}.mjs`, `${ziel}.json`, path.join(ziel, "index.js")]) {
    if (fs.existsSync(kandidat)) return kandidat;
  }
  return ziel;
}

// Ein ES-Modul wird nur einmal ausgewertet – der Hook wird also genau einmal registriert,
// auch wenn die Datei per --import UND im Test importiert wird.
registerHooks({
  resolve(spezifizierer, kontext, weiter) {
    if (spezifizierer.startsWith("@/")) {
      return weiter(pathToFileURL(ergaenze(path.join(SRC, spezifizierer.slice(2)))).href, kontext);
    }
    // Relative Importe ohne Endung nur innerhalb von src/ ergänzen
    if (/^\.\.?\//.test(spezifizierer) && kontext.parentURL?.startsWith(SRC_URL)) {
      const basis = path.resolve(path.dirname(fileURLToPath(kontext.parentURL)), spezifizierer);
      if (!fs.existsSync(basis) || fs.statSync(basis).isDirectory()) return weiter(pathToFileURL(ergaenze(basis)).href, kontext);
    }
    return weiter(spezifizierer, kontext);
  },
  load(url, kontext, weiter) {
    // JSON aus src/ wie im Bundler ohne `with { type: "json" }` laden
    if (url.startsWith(SRC_URL) && url.endsWith(".json")) {
      const text = fs.readFileSync(fileURLToPath(url), "utf8");
      return { format: "module", source: `export default ${text};`, shortCircuit: true };
    }
    return weiter(url, kontext);
  },
});
