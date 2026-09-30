// Prüft die Kontrastwerte, auf denen die globale Grüntext-Regel in
// src/app/globals.css beruht (WCAG 2.x, relative Leuchtdichte).
// Ausführen: node scripts/kontrast.test.mjs
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const token = (name) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m, `Token --color-${name} fehlt`);
  return m[1];
};

const kanal = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const leuchtdichte = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => kanal(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const kontrast = (a, b) => {
  const [x, y] = [leuchtdichte(a), leuchtdichte(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

let ok = 0;
const pruefe = (text, wert, soll, vergleich = ">=") => {
  const r = Math.round(wert * 100) / 100;
  if (vergleich === ">=") assert.ok(wert >= soll, `${text}: ${r} < ${soll}`);
  else assert.ok(wert < soll, `${text}: ${r} >= ${soll}`);
  ok++;
  console.log(`ok  ${text}: ${r}`);
};

const WEISS = "#ffffff";
const hell = { weiss: WEISS, "sand-50": token("sand-50"), "sand-100": token("sand-100"), "ov-50": token("ov-50"), "ov-100": token("ov-100"), "ink-50": token("ink-50"), "gray-100 (Tailwind)": "#f3f4f6" };

// 1. Zielfarbe ov-700 erreicht auf allen hellen Flächen AA (4,5 : 1)
for (const [name, bg] of Object.entries(hell)) pruefe(`ov-700 auf ${name}`, kontrast(token("ov-700"), bg), 4.5);

// 2. Die ersetzten Farben verfehlen AA auf hellem Grund (Begründung der Regel)
pruefe("#669933 auf Weiß (verfehlt AA)", kontrast("#669933", WEISS), 4.5, "<");
pruefe("ov-500 auf gray-100 (verfehlt AA)", kontrast(token("ov-500"), "#f3f4f6"), 4.5, "<");
pruefe("#558822 auf Weiß (verfehlt AA)", kontrast("#558822", WEISS), 4.5, "<");
pruefe("ov-600 auf sand-50 (verfehlt AA)", kontrast(token("ov-600"), token("sand-50")), 4.5, "<");
pruefe("ov-600 auf ov-50 (verfehlt AA)", kontrast(token("ov-600"), token("ov-50")), 4.5, "<");

// 3. Auf dunklen Flächen wäre ov-700 schlechter – deshalb die Ausnahme
pruefe("ov-500 auf navy-950 (bleibt)", kontrast(token("ov-500"), token("navy-950")), 4.5);
pruefe("ov-700 auf navy-950 (ungeeignet)", kontrast(token("ov-700"), token("navy-950")), 3, "<");

// 4. Icons behalten die Markenfarbe: 3 : 1 für Grafiken (WCAG 1.4.11)
pruefe("#669933-Icon auf Weiß", kontrast("#669933", WEISS), 3);

// 5. Die Regel steht in globals.css und bleibt in @layer utilities
assert.match(css, /@layer utilities \{\s*\/\* A\)/, "Grüntext-Regel A fehlt");
assert.match(css, /\.text-ov-600:is\(/, "Grüntext-Regel B fehlt");
assert.doesNotMatch(css, /\)\n\s+:not\(/, "Zeilenumbruch zwischen Selektorteilen wäre ein Nachfahren-Kombinator");
ok += 3;

console.log(`\n${ok} Prüfungen bestanden.`);
