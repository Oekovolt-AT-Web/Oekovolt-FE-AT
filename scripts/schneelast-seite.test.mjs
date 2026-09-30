// Tests für die Schneelast-Seiten (/schneelast, /schneelast/[bundesland]):
// src/lib/schneelast/{projektion,einordnung,png,karte,richtwerte,orte,laender}.js
//
// Aufruf: node scripts/schneelast-seite.test.mjs
// Ohne Abhängigkeiten (node:test, node:assert). Liest das echte Raster aus data/schneelast/,
// wenn vorhanden; sonst werden die Raster-Tests übersprungen.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

import { bildZuLambert, bildZuWgs84, lambertZuBild, nachLambert, nachWgs84, wgs84ZuBild } from "../src/lib/schneelast/projektion.js";
import { KLASSEN, MAX_SEEHOEHE, einordnung, kgProM2, klasseFuer, kn, modulGrenzen, skGrenze, spanne, zahl } from "../src/lib/schneelast/einordnung.js";
import { crc32, pngPalette } from "../src/lib/schneelast/png.js";
import { kartenPalette, kartenPixel } from "../src/lib/schneelast/karte.js";
import { LAENDER, landFuerSlug } from "../src/lib/schneelast/laender.js";
import { ORTE } from "../src/lib/schneelast/orte.js";
import { laenderUeberblick, rasterMeta, richtwertFuerPunkt, richtwerteFuerLand } from "../src/lib/schneelast/richtwerte.js";
import { lccVorwaerts, zelleFuer, RASTER_VERZEICHNIS } from "../src/lib/standort/schneelastRaster.js";
import { bewerteSchnee, MODULKLASSEN } from "../src/lib/standort/berechnung.js";
import { BUNDESLAENDER } from "../src/data/bundeslaender.js";

const nahe = (ist, soll, tol, text) => assert.ok(Math.abs(ist - soll) <= tol, `${text}: ${ist} statt ${soll} (±${tol})`);
const RASTER_DA = fs.existsSync(path.join(RASTER_VERZEICHNIS, "sk50-at.bin"));
const META = { nx: 584, ny: 329, x0: 112500, y0: 258500, dx: 1000 };

/* ------------------------------------------------------------------ Projektion */

test("Projektion: vorwärts identisch mit schneelastRaster.lccVorwaerts", () => {
  for (const [lat, lon] of [[48.0428, 12.8417], [47.2639, 11.3948], [48.2085, 16.372], [46.6241, 14.3069], [47.5046, 9.7463]]) {
    const a = nachLambert(lat, lon);
    const b = lccVorwaerts(lat, lon);
    nahe(a.x, b.x, 1e-6, `x ${lat},${lon}`);
    nahe(a.y, b.y, 1e-6, `y ${lat},${lon}`);
  }
});

test("Projektion: Ursprung EPSG:3416 (47,5° N / 13° 20′ O) → 400 000 / 400 000", () => {
  const { x, y } = nachLambert(47.5, 13 + 1 / 3);
  nahe(x, 400000, 1e-6, "x");
  nahe(y, 400000, 1e-6, "y");
});

test("Projektion: rückwärts ist Umkehrung von vorwärts (< 1 mm)", () => {
  for (let lat = 46.4; lat <= 49; lat += 0.37) {
    for (let lon = 9.6; lon <= 17.1; lon += 0.53) {
      const { x, y } = nachLambert(lat, lon);
      const r = nachWgs84(x, y);
      nahe(r.lat, lat, 1e-8, `lat ${lat},${lon}`);
      nahe(r.lon, lon, 1e-8, `lon ${lat},${lon}`);
    }
  }
});

test("Bild ⇄ Raster: Zellmitte im Bild trifft genau diese Rasterzelle", () => {
  for (const [spalte, zeile] of [[0, 0], [583, 328], [290, 150], [17, 311]]) {
    const u = (spalte + 0.5) / META.nx;
    const v = (META.ny - 1 - zeile + 0.5) / META.ny;
    const { x, y } = bildZuLambert(META, u, v);
    const z = zelleFuer(META, x, y);
    assert.deepEqual([z.spalte, z.zeile], [spalte, zeile]);
    const b = lambertZuBild(META, x, y);
    nahe(b.u, u, 1e-12, "u");
    nahe(b.v, v, 1e-12, "v");
  }
});

test("Bild ⇄ WGS84: Hin- und Rückweg auf 5 Stellen", () => {
  const { u, v } = wgs84ZuBild(META, 47.2639, 11.3948);
  assert.ok(u > 0 && u < 1 && v > 0 && v < 1, "Innsbruck liegt im Bild");
  const p = bildZuWgs84(META, u, v);
  nahe(p.lat, 47.2639, 1e-5, "lat");
  nahe(p.lon, 11.3948, 1e-5, "lon");
  // Wien liegt östlich und nördlich von Innsbruck → größeres u, kleineres v
  const w = wgs84ZuBild(META, 48.2085, 16.372);
  assert.ok(w.u > u && w.v < v);
});

/* ------------------------------------------------------------------ Format & Klassen */

test("zahl(): Tausenderpunkt, Dezimalkomma, keine Intl-Abhängigkeit", () => {
  assert.equal(zahl(1234.5, 1), "1.234,5");
  assert.equal(zahl(1234567), "1.234.567");
  assert.equal(zahl(0.8, 2), "0,80");
  assert.equal(zahl(2000), "2.000");
  assert.equal(zahl(-0.01, 1), "0,0");
  assert.equal(zahl(-3.5, 1), "−3,5");
  assert.equal(zahl(NaN), "–");
  assert.equal(zahl(null), "0");
  assert.equal(kn(1.25, 1), "1,3 kN/m²");
  assert.equal(kgProM2(1), 100);
  assert.equal(kgProM2(2.3), 230);
});

test("klasseFuer(): Klassengrenzen", () => {
  assert.equal(klasseFuer(0.3), 0);
  assert.equal(klasseFuer(0.99), 0);
  assert.equal(klasseFuer(1), 1);
  assert.equal(klasseFuer(1.49), 1);
  assert.equal(klasseFuer(2.99), 3);
  assert.equal(klasseFuer(9.99), 6);
  assert.equal(klasseFuer(40), KLASSEN.length - 1);
  assert.equal(klasseFuer(-1), null);
  assert.equal(klasseFuer("x"), null);
});

/* ------------------------------------------------------------------ Modulklassen */

test("skGrenze(): passt exakt zu bewerteSchnee() (Auslastung 100 % bzw. 80 %)", () => {
  for (const neigung of [0, 10, 30, 45]) {
    for (const schneefang of [false, true]) {
      for (const k of MODULKLASSEN) {
        const grenze = skGrenze(k.bemessung, neigung, schneefang, 1);
        const b = bewerteSchnee({ sk: grenze, neigung, schneefang });
        const m = b.module.find((x) => x.id === k.id);
        nahe(m.auslastung, 1, 1e-9, `${k.id} ${neigung}° ${schneefang}`);
        const reserve = skGrenze(k.bemessung, neigung, schneefang, 0.8);
        nahe(bewerteSchnee({ sk: reserve, neigung, schneefang }).module.find((x) => x.id === k.id).auslastung, 0.8, 1e-9, "Reserve");
      }
    }
  }
  assert.equal(skGrenze(1600, 60, false), Infinity, "μ1 = 0 → keine Grenze");
});

test("modulGrenzen(30°): Standardmodul ≈ 1,54, Schneelastmodul ≈ 3,46 kN/m²", () => {
  const g = modulGrenzen(30, false);
  nahe(g[0].knappBis, 1.6 / (1.5 * 0.8 * Math.cos(Math.PI / 6)), 1e-12, "2400 Pa");
  nahe(g[0].knappBis, 1.54, 0.005, "2400 Pa gerundet");
  nahe(g[1].knappBis, 3.46, 0.005, "5400 Pa gerundet");
  assert.ok(g[0].reserveBis < g[0].knappBis);
  // flacheres Dach → strengere Grenze (cos α größer)
  assert.ok(modulGrenzen(10, false)[0].knappBis < g[0].knappBis);
});

test("einordnung(): Stufen nach Richtwert (30°, ohne Schneefang)", () => {
  assert.equal(einordnung(0.8).stufe, "standard");
  assert.equal(einordnung(1.2).stufe, "standard");
  assert.equal(einordnung(2).stufe, "erhoeht");
  assert.equal(einordnung(4).stufe, "hoch");
  assert.equal(einordnung(8).stufe, "sonder");
  assert.equal(einordnung(0), null);
  // 1,4 kN/m²: Standardmodul nur knapp (Auslastung > 80 %) → Empfehlung Schneelastmodul mit Reserve
  assert.equal(einordnung(1.4).stufe, "erhoeht");
  assert.equal(einordnung(1.4).knapp, false);
  // 5 kN/m²: nur das Hochlastmodul reicht, und auch das nur knapp
  assert.equal(einordnung(5).stufe, "hoch");
  assert.equal(einordnung(5).knapp, true);
});

test("spanne(): min, max, Median", () => {
  const s = spanne([{ ort: "A", sk: 1 }, { ort: "B", sk: 3 }, { ort: "C", sk: null }, { ort: "D", sk: 2 }, { ort: "E", sk: 0.5 }]);
  assert.equal(s.min.ort, "E");
  assert.equal(s.max.ort, "B");
  assert.equal(s.median, 1.5);
  assert.equal(s.anzahl, 4);
  assert.equal(spanne([]), null);
});

/* ------------------------------------------------------------------ PNG */

test("crc32(): Referenzwerte", () => {
  assert.equal(crc32(Buffer.from("IEND", "ascii")), 0xae426082);
  assert.equal(crc32(Buffer.from("123456789", "ascii")), 0xcbf43926);
});

test("pngPalette(): gültige Struktur und Bilddaten", () => {
  const pixel = new Uint8Array([0, 1, 2, 1, 0, 2]);
  const png = pngPalette({ breite: 3, hoehe: 2, palette: [[0, 0, 0, 0], [255, 0, 0], [0, 0, 255]], pixel });
  assert.deepEqual([...png.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  // Chunks durchlaufen und CRC prüfen
  let pos = 8;
  const typen = [];
  let idat = null;
  while (pos < png.length) {
    const laenge = png.readUInt32BE(pos);
    const typ = png.subarray(pos + 4, pos + 8).toString("ascii");
    const daten = png.subarray(pos + 8, pos + 8 + laenge);
    assert.equal(png.readUInt32BE(pos + 8 + laenge), crc32(png.subarray(pos + 4, pos + 8), daten), `CRC ${typ}`);
    if (typ === "IHDR") assert.deepEqual([daten.readUInt32BE(0), daten.readUInt32BE(4), daten[8], daten[9]], [3, 2, 8, 3]);
    if (typ === "tRNS") assert.deepEqual([...daten], [0, 255, 255]);
    if (typ === "IDAT") idat = daten;
    typen.push(typ);
    pos += 12 + laenge;
  }
  assert.deepEqual(typen, ["IHDR", "PLTE", "tRNS", "IDAT", "IEND"]);
  assert.deepEqual([...zlib.inflateSync(idat)], [0, 0, 1, 2, 0, 1, 0, 2]);
});

test("kartenPixel(): Nord oben, leer transparent, Faktor und Umriss", () => {
  // 3 × 2 Raster, Zeile 0 = Süden: [0,5 | leer | 2,5] / [1,2 | 7 | 12]
  const werte = [50, 65535, 250, 120, 700, 1200];
  const daten = Buffer.alloc(werte.length * 2);
  werte.forEach((w, i) => daten.writeUInt16LE(w, i * 2));
  const raster = { meta: { nx: 3, ny: 2, skala: 100, leer: 65535, kalibrierung: 1 }, daten };
  const { breite, hoehe, pixel } = kartenPixel(raster, 1);
  assert.equal(breite, 3);
  assert.equal(hoehe, 2);
  // oberste Bildzeile = nördliche Rasterzeile (1)
  assert.deepEqual([...pixel], [klasseFuer(1.2) + 1, klasseFuer(7) + 1, klasseFuer(12) + 1, klasseFuer(0.5) + 1, 0, klasseFuer(2.5) + 1]);
  const gross = kartenPixel(raster, 2);
  assert.equal(gross.breite, 6);
  assert.equal(gross.pixel[2 * 6 + 2], 0, "leere Zelle bleibt transparent");
  const umriss = KLASSEN.length + 1;
  assert.equal(gross.pixel[0], umriss, "Bildrand = Umriss");
  assert.equal(kartenPalette().length, KLASSEN.length + 2);
  assert.equal(kartenPalette()[0][3], 0);
});

/* ------------------------------------------------------------------ Orte & Länder */

test("Orte: neun Länder, Koordinaten in Österreich, keine Doppelungen, Wien 23 Bezirke", () => {
  assert.deepEqual(Object.keys(ORTE).sort(), LAENDER.map((l) => l.slug).sort());
  for (const l of LAENDER) {
    assert.ok(BUNDESLAENDER[l.slug], `Slug ${l.slug} auch in src/data/bundeslaender.js`);
    assert.equal(landFuerSlug(l.slug).name, BUNDESLAENDER[l.slug].name);
    const orte = ORTE[l.slug];
    assert.ok(orte.length >= 4, `${l.slug}: mindestens 4 Orte`);
    assert.equal(new Set(orte.map((o) => o.ort)).size, orte.length, `${l.slug}: Orte eindeutig`);
    for (const o of orte) {
      assert.ok(o.lat > 46.35 && o.lat < 49.05 && o.lon > 9.5 && o.lon < 17.2, `${o.ort} im Österreich-Rahmen`);
      assert.ok(Number.isInteger(o.hoehe) && o.hoehe > 100 && o.hoehe < MAX_SEEHOEHE, `${o.ort}: Seehöhe plausibel`);
    }
  }
  assert.equal(ORTE.wien.length, 23);
  // Jede Statutarstadt / jeder Bezirk nur einmal zugeordnet
  const bezirke = Object.values(ORTE).flat().flatMap((o) => o.bezirke);
  assert.equal(new Set(bezirke).size, bezirke.length);
  assert.equal(landFuerSlug("xyz"), null);
});

test("richtwertFuerPunkt(): über 2.000 m kein Wert (ohne Rasterzugriff)", () => {
  assert.deepEqual(richtwertFuerPunkt(47.07, 12.69, 2500), { sk: null, nachbarzelle: false, grund: "ueber2000" });
});

test("Richtwerte aus dem echten Raster (Build-Zeit-Logik)", { skip: !RASTER_DA && "data/schneelast/sk50-at.bin fehlt" }, () => {
  const meta = rasterMeta();
  assert.deepEqual([meta.nx, meta.ny, meta.dx], [584, 329, 1000]);
  let gesamt = 0;
  for (const l of LAENDER) {
    const zeilen = richtwerteFuerLand(l.slug);
    for (const z of zeilen) {
      gesamt++;
      assert.ok(z.sk != null, `${z.ort}: Richtwert vorhanden`);
      assert.ok(z.sk >= 0.2 && z.sk <= 8, `${z.ort}: ${z.sk} kN/m² plausibel`);
      assert.equal(Math.round(z.sk * 10) / 10, z.sk, "auf 0,1 gerundet");
      nahe(z.dachlast30, 0.8 * z.sk, 1e-9, `${z.ort}: Dachlast 30° = 0,8 · sₖ`);
      assert.ok(["standard", "erhoeht", "hoch", "sonder"].includes(z.modul.stufe));
    }
  }
  assert.ok(gesamt >= 100, `${gesamt} Orte`);
  const u = laenderUeberblick();
  assert.equal(u.length, 9);
  for (const l of u) assert.ok(l.spanne && l.spanne.min.sk <= l.spanne.median && l.spanne.median <= l.spanne.max.sk, l.slug);
  // Osten flacher als Westen: Median Wien < Median Tirol
  const median = (slug) => u.find((l) => l.slug === slug).spanne.median;
  assert.ok(median("wien") < median("tirol"));
});
