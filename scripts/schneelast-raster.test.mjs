// Tests für src/lib/standort/schneelastRaster.js (Projektion EPSG:3416 und Raster-Lookup).
//
// Aufruf: node scripts/schneelast-raster.test.mjs
// Ohne Abhängigkeiten (node:test, node:assert). Die Test-Rasterdatei wird im Temp-Verzeichnis
// erzeugt und danach gelöscht – sie gehört nicht ins Repo.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  AUSTRIA_LAMBERT,
  lccProjektion,
  lccVorwaerts,
  rasterCacheLeeren,
  skRichtwert,
  zelleFuer,
} from "../src/lib/standort/schneelastRaster.js";

const nahe = (ist, soll, tol, text) => assert.ok(Math.abs(ist - soll) <= tol, `${text}: ${ist} statt ${soll} (±${tol})`);

/* ------------------------------------------------------------------ Projektion */

test("Formel: EPSG Guidance Note 7-2, Rechenbeispiel LCC 2SP (NAD27 / Texas South Central)", () => {
  // Clarke 1866, Ergebnis in US-Survey-Feet: E = 2 963 503,91 ftUS, N = 254 759,80 ftUS
  const ftUS = 1200 / 3937;
  const dms = (g, m) => g + m / 60;
  const proj = lccProjektion({
    a: 6378206.4,
    f: 1 / 294.9786982,
    lat1: dms(28, 23),
    lat2: dms(30, 17),
    lat0: dms(27, 50),
    lon0: -99,
    x0: 2000000 * ftUS,
    y0: 0,
  });
  const { x, y } = proj(28.5, -96);
  nahe(x / ftUS, 2963503.91, 0.05, "Easting ftUS");
  nahe(y / ftUS, 254759.8, 0.05, "Northing ftUS");
});

test("Ursprung: (47,5° N, 13,3333° O) → (400 000, 400 000) ±1 m", () => {
  const { x, y } = lccVorwaerts(47.5, 13.333333333);
  nahe(x, 400000, 1, "x");
  nahe(y, 400000, 1, "y");
});

test("Wien (48,2082° N, 16,3738° O) liegt im erwarteten Bereich", () => {
  const { x, y } = lccVorwaerts(48.2082, 16.3738);
  console.log(`    Wien → x = ${x.toFixed(2)} m, y = ${y.toFixed(2)} m`);
  assert.ok(x >= 625000 && x <= 630000, `x = ${x}`);
  assert.ok(y >= 480000 && y <= 485000, `y = ${y}`);
});

test("Fremdbeispiele Austria Lambert (geoclub.de) über MGI/Bessel + EPSG:1618 reproduziert (±1 m)", () => {
  // Quelle: geoclub.de, „Gesucht: Umrechnung WGS84 nach Lambert (Österreich)“:
  //   WGS84 48,4388267° N / 14,0241486° O → 451 162 / 504 640
  //   Großglockner 47,07472° N / 12,69417° O → 351 525 / 352 993
  // Diese Werte sind MGI / Austria Lambert (EPSG:31287: gleiche Kegelparameter, Bessel 1841,
  // Datum MGI). Wir rechnen sie mit derselben lccProjektion() nach: WGS84 → MGI per
  // Helmert-Transformation EPSG:1618 (umgekehrt), dann LCC auf Bessel. Passt das auf < 1 m,
  // sind Formeln und Kegelparameter bestätigt; EPSG:3416 unterscheidet sich nur im Ellipsoid.
  const R = Math.PI / 180;
  const sek = R / 3600;
  const zuEcef = (lat, lon, a, f) => {
    const e2 = 2 * f - f * f;
    const N = a / Math.sqrt(1 - e2 * Math.sin(lat * R) ** 2);
    return [N * Math.cos(lat * R) * Math.cos(lon * R), N * Math.cos(lat * R) * Math.sin(lon * R), N * (1 - e2) * Math.sin(lat * R)];
  };
  const ausEcef = ([x, y, z], a, f) => {
    const e2 = 2 * f - f * f;
    const p = Math.hypot(x, y);
    let lat = Math.atan2(z, p * (1 - e2));
    for (let i = 0; i < 10; i++) lat = Math.atan2(z + e2 * (a / Math.sqrt(1 - e2 * Math.sin(lat) ** 2)) * Math.sin(lat), p);
    return [lat / R, Math.atan2(y, x) / R];
  };
  // EPSG:1618 MGI → WGS84 (Position Vector): 577,326 / 90,129 / 463,919 m, 5,137″ / 1,474″ / 5,297″, 2,4232 ppm – hier umgekehrt
  const t = [-577.326, -90.129, -463.919];
  const [rx, ry, rz] = [-5.137 * sek, -1.474 * sek, -5.297 * sek];
  const s = -2.4232e-6;
  const helmert = ([x, y, z]) => [
    t[0] + (1 + s) * (x - rz * y + ry * z),
    t[1] + (1 + s) * (rz * x + y - rx * z),
    t[2] + (1 + s) * (-ry * x + rx * y + z),
  ];
  const bessel = { a: 6377397.155, f: 1 / 299.1528128 };
  const mgiLambert = lccProjektion({ ...AUSTRIA_LAMBERT, ...bessel });
  for (const [lat, lon, sx, sy] of [
    [48.4388267, 14.0241486, 451162, 504640],
    [47.07472, 12.69417, 351525, 352993],
  ]) {
    const [bl, bo] = ausEcef(helmert(zuEcef(lat, lon, 6378137, 1 / 298.257223563)), bessel.a, bessel.f);
    const { x, y } = mgiLambert(bl, bo);
    const etrs = lccVorwaerts(lat, lon);
    console.log(`    ${lat}/${lon}: MGI-Lambert ${x.toFixed(1)} / ${y.toFixed(1)} (soll ${sx} / ${sy}), EPSG:3416 ${etrs.x.toFixed(1)} / ${etrs.y.toFixed(1)}`);
    nahe(x, sx, 1, "x (MGI)");
    nahe(y, sy, 1, "y (MGI)");
    // Datumsunterschied MGI ↔ ETRS89 liegt in Österreich bei rund 50–100 m
    const abstand = Math.hypot(etrs.x - x, etrs.y - y);
    assert.ok(abstand > 30 && abstand < 150, `Abstand MGI ↔ ETRS89 ${abstand} m`);
  }
});

test("Unabhängige Prüfung: Maßstab 1 auf 46° und 49°, konform (gleicher Maßstab in N- und O-Richtung)", () => {
  // Numerisch aus der Ellipsoidgeometrie: Meridian- und Querkrümmungsradius (GRS80)
  const { a, f } = AUSTRIA_LAMBERT;
  const e2 = 2 * f - f * f;
  const R = Math.PI / 180;
  const M = (phi) => (a * (1 - e2)) / (1 - e2 * Math.sin(phi * R) ** 2) ** 1.5;
  const N = (phi) => a / Math.sqrt(1 - e2 * Math.sin(phi * R) ** 2);
  const d = 1e-5; // Grad
  const massstab = (lat, lon) => {
    const p = lccVorwaerts(lat, lon);
    const pn = lccVorwaerts(lat + d, lon);
    const po = lccVorwaerts(lat, lon + d);
    const kN = Math.hypot(pn.x - p.x, pn.y - p.y) / (M(lat) * d * R);
    const kO = Math.hypot(po.x - p.x, po.y - p.y) / (N(lat) * Math.cos(lat * R) * d * R);
    return { kN, kO };
  };
  for (const lat of [46, 49]) {
    const { kN, kO } = massstab(lat, 13.3333333333);
    nahe(kN, 1, 1e-6, `Maßstab Nord bei ${lat}°`);
    nahe(kO, 1, 1e-6, `Maßstab Ost bei ${lat}°`);
  }
  const w = massstab(48.2082, 16.3738);
  nahe(w.kN, w.kO, 1e-6, "Konformität Wien");
  assert.ok(w.kN < 1 && w.kN > 0.999, `Maßstab Wien zwischen den Standardparallelen < 1: ${w.kN}`);
});

/* ------------------------------------------------------------------ Raster */

const LEER = 65535;

function testRaster(verzeichnis, { werte, nx, ny, x0, y0, ...extra }) {
  fs.mkdirSync(verzeichnis, { recursive: true });
  const buf = Buffer.alloc(nx * ny * 2);
  for (let i = 0; i < nx * ny; i++) buf.writeUInt16LE(werte[i] ?? LEER, i * 2);
  fs.writeFileSync(path.join(verzeichnis, "sk50-at.bin"), buf);
  const meta = {
    nx, ny, x0, y0, dx: 1000, crs: "EPSG:3416", skala: 100, leer: LEER,
    quelle: "GeoSphere Austria, SNOWGRID-CL v2.1 (CC BY 4.0)",
    zeitraum: "Winter 1961/62–2025/26", methode: "GEV (L-Momente), 50-jährlich",
    kalibrierung: 1.0, stand: "2026-09-30", ...extra,
  };
  fs.writeFileSync(path.join(verzeichnis, "sk50-at.json"), JSON.stringify(meta));
  rasterCacheLeeren();
}

test("zelleFuer: Rundung auf Zellmittelpunkt, Zeilen von Süd nach Nord, außerhalb → null", () => {
  const meta = { nx: 584, ny: 329, x0: 112500, y0: 258500, dx: 1000 };
  assert.deepEqual(zelleFuer(meta, 112500, 258500), { spalte: 0, zeile: 0, index: 0 });
  assert.deepEqual(zelleFuer(meta, 112999, 258999), { spalte: 0, zeile: 0, index: 0 });
  assert.deepEqual(zelleFuer(meta, 113001, 259001), { spalte: 1, zeile: 1, index: 585 });
  assert.equal(zelleFuer(meta, 111999, 258500), null);
  assert.equal(zelleFuer(meta, 112500 + 584 * 1000, 258500), null);
  // Wien liegt im Raster
  const w = lccVorwaerts(48.2082, 16.3738);
  const z = zelleFuer(meta, w.x, w.y);
  assert.ok(z && z.spalte > 0 && z.zeile > 0, "Wien im Raster");
});

test("skRichtwert mit synthetischer Rasterdatei", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sk50-test-"));
  try {
    // 5 × 5-Raster, Wien in der Mitte (Spalte 2, Zeile 2)
    const w = lccVorwaerts(48.2082, 16.3738);
    const x0 = Math.round(w.x / 1000) * 1000 - 2000;
    const y0 = Math.round(w.y / 1000) * 1000 - 2000;
    const nx = 5;
    const ny = 5;
    const werte = new Array(nx * ny).fill(LEER);
    werte[2 * nx + 2] = 123; // Wien: 1,23 kN/m² → 1,2
    werte[3 * nx + 2] = 250; // eine Zeile nördlich
    werte[0 * nx + 0] = 400; // SW-Ecke
    const dir = path.join(tmp, "ok");
    testRaster(dir, { werte, nx, ny, x0, y0 });

    const r = skRichtwert(48.2082, 16.3738, { verzeichnis: dir });
    assert.ok(r, "Wert vorhanden");
    assert.equal(r.sk, 1.2);
    assert.equal(r.quelle, "GeoSphere Austria, SNOWGRID-CL v2.1 (CC BY 4.0)");
    assert.equal(r.zeitraum, "Winter 1961/62–2025/26");
    assert.equal(r.methode, "GEV (L-Momente), 50-jährlich");
    assert.equal(r.stand, "2026-09-30");
    assert.equal(r.nachbarzelle, false);

    // Rund 1 km nördlich (Zeile 3, weil Zeilen von Süd nach Nord laufen)
    assert.equal(skRichtwert(48.2082 + 1000 / 111200, 16.3738, { verzeichnis: dir }).sk, 2.5);

    // Leere Zelle mit Nachbarn: höchster Nachbarwert (vorsichtig)
    const werte2 = [...werte];
    werte2[2 * nx + 2] = LEER;
    const dir2 = path.join(tmp, "nachbar");
    testRaster(dir2, { werte: werte2, nx, ny, x0, y0 });
    const n = skRichtwert(48.2082, 16.3738, { verzeichnis: dir2 });
    assert.equal(n.sk, 2.5);
    assert.equal(n.nachbarzelle, true);

    // Kalibrierfaktor: 1,23 × 1,1 = 1,353 → 1,4
    const dir3 = path.join(tmp, "kalibriert");
    testRaster(dir3, { werte, nx, ny, x0, y0, kalibrierung: 1.1 });
    assert.equal(skRichtwert(48.2082, 16.3738, { verzeichnis: dir3 }).sk, 1.4);

    // Nur leere Zellen ringsum → null
    const dir4 = path.join(tmp, "leer");
    testRaster(dir4, { werte: new Array(nx * ny).fill(LEER), nx, ny, x0, y0 });
    assert.equal(skRichtwert(48.2082, 16.3738, { verzeichnis: dir4 }), null);

    // Punkt außerhalb des Rasters → null (Innsbruck liegt weit westlich)
    assert.equal(skRichtwert(47.2692, 11.4041, { verzeichnis: dir }), null);

    // Dateigröße passt nicht zu nx · ny → null, kein Fehler
    const dir5 = path.join(tmp, "kaputt");
    testRaster(dir5, { werte, nx, ny, x0, y0 });
    fs.writeFileSync(path.join(dir5, "sk50-at.bin"), Buffer.alloc(10));
    rasterCacheLeeren();
    assert.equal(skRichtwert(48.2082, 16.3738, { verzeichnis: dir5 }), null);

    // Fehlende Dateien → null, kein Fehler
    assert.equal(skRichtwert(48.2082, 16.3738, { verzeichnis: path.join(tmp, "gibt-es-nicht") }), null);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
    rasterCacheLeeren();
  }
});

test("Echte Rasterdatei (falls schon abgelegt): Plausibilität Wien, Innsbruck, außerhalb", () => {
  const r = skRichtwert(48.2082, 16.3738);
  if (!r) {
    console.log("    data/schneelast/sk50-at.* noch nicht vorhanden – übersprungen");
    return;
  }
  console.log(`    Wien sk = ${r.sk}, Innsbruck sk = ${skRichtwert(47.2692, 11.4041)?.sk}, Stand ${r.stand}`);
  assert.ok(r.sk > 0 && r.sk < 5, `Wien ${r.sk}`);
  assert.equal(skRichtwert(48.1351, 11.582), null, "München liegt außerhalb");
});
