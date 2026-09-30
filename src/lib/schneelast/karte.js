// src/lib/schneelast/karte.js
//
// Erzeugt das Kartenbild der Schneelast-Richtwerte (PNG, Palettenbild) direkt aus dem Raster
// data/schneelast/sk50-at.bin – eine Farbe je 1-km-Zelle, Norden oben, außerhalb Österreichs
// transparent. Nur serverseitig (zlib über png.js).

import { KLASSEN, hexZuRgb, klasseFuer } from "./einordnung.js";
import { pngPalette } from "./png.js";

/**
 * Palettenindizes für ein Raster { meta, daten }; faktor = Pixel je Rasterzelle (ganzzahlig).
 * Index 0 = transparent (kein Wert), 1 … KLASSEN.length = Farbklasse.
 */
export function kartenPixel({ meta, daten }, faktor = 1) {
  const f = Math.max(1, Math.round(faktor));
  const breite = meta.nx * f;
  const hoehe = meta.ny * f;
  const pixel = new Uint8Array(breite * hoehe);
  const leer = meta.leer ?? 65535;
  const kal = Number.isFinite(meta.kalibrierung) && meta.kalibrierung > 0 ? meta.kalibrierung : 1;
  for (let zeile = 0; zeile < meta.ny; zeile++) {
    const bildZeile = meta.ny - 1 - zeile; // Zeile 0 liegt im Süden → unten im Bild
    for (let spalte = 0; spalte < meta.nx; spalte++) {
      const roh = daten.readUInt16LE((zeile * meta.nx + spalte) * 2);
      if (roh === leer) continue;
      const klasse = klasseFuer((roh / meta.skala) * kal);
      if (klasse == null) continue;
      for (let dy = 0; dy < f; dy++) {
        const start = (bildZeile * f + dy) * breite + spalte * f;
        pixel.fill(klasse + 1, start, start + f);
      }
    }
  }
  if (f >= 2) umriss(pixel, breite, hoehe, KLASSEN.length + 1);
  return { breite, hoehe, pixel };
}

/** Randpixel (Nachbar ohne Wert) bekommen den Umriss-Index – damit auch helle Klassen auf hellem Grund lesbar bleiben. */
function umriss(pixel, breite, hoehe, index) {
  const rand = [];
  for (let y = 0; y < hoehe; y++) {
    for (let x = 0; x < breite; x++) {
      const i = y * breite + x;
      if (pixel[i] === 0) continue;
      if (x === 0 || y === 0 || x === breite - 1 || y === hoehe - 1 || pixel[i - 1] === 0 || pixel[i + 1] === 0 || pixel[i - breite] === 0 || pixel[i + breite] === 0) rand.push(i);
    }
  }
  for (const i of rand) pixel[i] = index;
}

/** Farbe des Umrisses (Landesgrenze und Zellen ohne Wert). */
export const UMRISS_FARBE = "#6f7f96";

/** Palette: transparent + Klassenfarben + Umriss. */
export function kartenPalette() {
  return [[0, 0, 0, 0], ...KLASSEN.map((k) => [...hexZuRgb(k.farbe), 255]), [...hexZuRgb(UMRISS_FARBE), 255]];
}

/** PNG-Buffer der Karte. */
export function kartePng(raster, faktor = 2) {
  const { breite, hoehe, pixel } = kartenPixel(raster, faktor);
  return pngPalette({ breite, hoehe, palette: kartenPalette(), pixel });
}
