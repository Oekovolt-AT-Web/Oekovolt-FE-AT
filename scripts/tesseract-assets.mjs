// Kopiert die OCR-Dateien von Tesseract.js nach public/tesseract/, damit die Texterkennung
// vollständig vom eigenen Server geladen wird (kein CDN, keine Datenübertragung an Dritte).
//   node scripts/tesseract-assets.mjs   (nach Updates von tesseract.js erneut ausführen)
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "..");
const ziel = path.join(ROOT, "public/tesseract");
fs.mkdirSync(path.join(ziel, "core"), { recursive: true });
fs.mkdirSync(path.join(ziel, "lang"), { recursive: true });

const kopiere = (von, nach) => {
  fs.copyFileSync(path.join(ROOT, von), path.join(ziel, nach));
  console.log("✓", nach, `${Math.round(fs.statSync(path.join(ziel, nach)).size / 1024)} KB`);
};

kopiere("node_modules/tesseract.js/dist/worker.min.js", "worker.min.js");
for (const f of ["tesseract-core-lstm.wasm.js", "tesseract-core-simd-lstm.wasm.js", "tesseract-core-relaxedsimd-lstm.wasm.js"]) {
  kopiere(`node_modules/tesseract.js-core/${f}`, `core/${f}`);
}
// Kompaktes LSTM-Modell (best_int), reicht für Ziffern auf Zähler-Displays
kopiere("node_modules/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz", "lang/eng.traineddata.gz");
