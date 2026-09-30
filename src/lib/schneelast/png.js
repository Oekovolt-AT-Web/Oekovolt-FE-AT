// src/lib/schneelast/png.js
//
// Minimaler PNG-Kodierer für Palettenbilder (Farbtyp 3, 8 bit) ohne externe Pakete – für die
// Schneelast-Karte (/schneelast/karte.png). Nur serverseitig (node:zlib).
// Format: W3C „Portable Network Graphics (PNG) Specification“, Chunks IHDR, PLTE, tRNS, IDAT,
// IEND; Filter 0 je Zeile; CRC-32 nach ISO 3309.

import zlib from "node:zlib";

const CRC_TABELLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

/** CRC-32 (ISO 3309 / PNG) über ein oder mehrere Buffer. */
export function crc32(...teile) {
  let c = 0xffffffff;
  for (const buf of teile) for (let i = 0; i < buf.length; i++) c = CRC_TABELLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(typ, daten) {
  const laenge = Buffer.alloc(4);
  laenge.writeUInt32BE(daten.length);
  const typBuf = Buffer.from(typ, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typBuf, daten));
  return Buffer.concat([laenge, typBuf, daten, crc]);
}

/**
 * Palettenbild als PNG.
 * breite, hoehe: Pixel; palette: [[r, g, b, a], …] (1–256 Einträge); pixel: Uint8Array
 * (breite · hoehe), Zeilen von oben nach unten, Wert = Palettenindex.
 */
export function pngPalette({ breite, hoehe, palette, pixel }) {
  if (!(breite > 0 && hoehe > 0) || pixel.length !== breite * hoehe) throw new Error("PNG: Maße und Pixelzahl passen nicht zusammen");
  if (palette.length < 1 || palette.length > 256) throw new Error("PNG: Palette muss 1–256 Farben haben");

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(breite, 0);
  ihdr.writeUInt32BE(hoehe, 4);
  ihdr[8] = 8; // Bittiefe
  ihdr[9] = 3; // Farbtyp: Palette
  ihdr[10] = 0; // Kompression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // kein Interlace

  const plte = Buffer.from(palette.flatMap(([r, g, b]) => [r, g, b]));
  const trns = Buffer.from(palette.map((p) => (p[3] == null ? 255 : p[3])));

  const roh = Buffer.alloc((breite + 1) * hoehe);
  for (let z = 0; z < hoehe; z++) {
    roh[z * (breite + 1)] = 0; // Filter „None“
    roh.set(pixel.subarray(z * breite, (z + 1) * breite), z * (breite + 1) + 1);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("PLTE", plte),
    chunk("tRNS", trns),
    chunk("IDAT", zlib.deflateSync(roh, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
