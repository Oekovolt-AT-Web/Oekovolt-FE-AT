// src/components/GewerbeUnikat/_farbe.js
//
// Farbrampen für Canvas-Grafiken (Lastgang-Teppich u. a.) – rein, ohne React, Server und Client.
// Die Kapitel nutzen DIESE Funktionen statt eigener Interpolation, damit gleiche Werte überall gleich
// aussehen. Stützfarben aus ./_tokens.js (CD-Tokens).

import { FARBE, LAST_RAMPE } from "./_tokens.js";

/** "#669933" → [102, 153, 51] */
export function hexZuRgb(hex) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

/** Lineare Mischung zweier RGB-Farben (t = 0 … 1). */
export function mische(a, b, t) {
  return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)];
}

/** Rampe aus Stützfarben (Hex) in n gleichmäßige RGB-Stufen. */
export function rampe(stuetzen, n) {
  const rgb = stuetzen.map(hexZuRgb);
  return Array.from({ length: n }, (_, i) => {
    const p = n === 1 ? 0 : (i / (n - 1)) * (rgb.length - 1);
    const j = Math.min(rgb.length - 2, Math.floor(p));
    return mische(rgb[j], rgb[j + 1], p - j);
  });
}

/** Anzahl Stufen der Last-Rampe (Teppich). */
export const LAST_STUFEN = 48;

/** Last-Palette: LAST_STUFEN RGB-Werte von navy-950 (keine Last) bis Weiß (Jahresspitze). */
export const LAST_PALETTE = rampe(LAST_RAMPE, LAST_STUFEN);

/**
 * Stufe (0 … LAST_STUFEN-1) für eine Leistung. Wurzel-Skala, damit Grundlast und Teillast
 * unterscheidbar bleiben (lineare Skala drückt alles unter die halbe Spitze ins Dunkel).
 */
export function lastStufe(kw, maxKw) {
  if (!Number.isFinite(kw) || !(maxKw > 0)) return 0;
  const t = Math.sqrt(Math.max(0, Math.min(1, kw / maxKw)));
  return Math.min(LAST_STUFEN - 1, Math.round(t * (LAST_STUFEN - 1)));
}

/** Farben der Sonnen-Linse (Teppich und Tagesbänder): Eigenverbrauch, Überschuss, Netzbezug. */
export const SONNE_RGB = {
  eigen: hexZuRgb(FARBE.ov400),
  ueberschuss: hexZuRgb(FARBE.sun300),
  netz: hexZuRgb(FARBE.navy700),
  leer: hexZuRgb(FARBE.navy950),
};

/** Anteil (0 … 1) → rgba-String, z. B. für Deckkraft-Abdunklung ausgeblendeter Bereiche. */
export const rgba = ([r, g, b], a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`;
