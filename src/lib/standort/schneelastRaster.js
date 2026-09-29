// src/lib/standort/schneelastRaster.js
//
// Schneelast-RICHTWERT für den Standort-Check (/standort-check) aus eigener Auswertung offener
// Daten – NICHT der Normwert. Der Normwert s_k nach ÖNORM B 1991-1-3:2022 steht weiterhin nur
// in HORA/eHORA; HORA untersagt automatisierte Abrufe und wird hier NICHT abgefragt
// (siehe src/lib/standort/hora.js).
//
// Datenbasis: GeoSphere Austria, SNOWGRID-CL v2.1 (Tageswerte Schneewasseräquivalent
// 1961–2026, 1-km-Raster), Lizenz CC BY 4.0, Namensnennung „GeoSphere Austria“.
// Eigene Auswertung: Jahresmaxima je Winterjahr (1.8.–31.7.), GEV-Anpassung über L-Momente,
// 50-jährlicher Wert je Rasterzelle, in kN/m².
//
// Dateien (liegen im Repo unter data/schneelast/, werden über outputFileTracingIncludes in
// next.config.mjs für die Route /api/standort mit ausgeliefert):
//   sk50-at.bin  – Uint16 little-endian, Zeilen von Süd nach Nord (Index = zeile · nx + spalte),
//                  Wert = s_k · skala (kN/m² × 100), leer (65535) = kein Wert (außerhalb Österreichs)
//   sk50-at.json – Metadaten: nx, ny, x0, y0 (Zellmittelpunkt der Zelle 0/0 in m), dx, crs
//                  (EPSG:3416), skala, leer, quelle, zeitraum, methode, kalibrierung, stand
//
// Fehlen die Dateien oder sind sie unstimmig, liefert skRichtwert() null – der Standort-Check
// fällt dann auf die bisherige Eingabe bzw. die alte Zonenformel zurück.
//
// Nur serverseitig verwenden (fs). lccVorwaerts() und zelleFuer() sind reine Funktionen.

import fs from "node:fs";
import path from "node:path";

/* ------------------------------------------------------------------ Projektion EPSG:3416 */

/**
 * Parameter von EPSG:3416 (ETRS89 / Austria Lambert): Lambert Conformal Conic 2SP auf GRS80.
 * Quelle: EPSG-Registry (epsg.org / epsg.io/3416).
 */
export const AUSTRIA_LAMBERT = Object.freeze({
  a: 6378137,
  f: 1 / 298.257222101,
  lat1: 49,
  lat2: 46,
  lat0: 47.5,
  lon0: 13 + 1 / 3,
  x0: 400000,
  y0: 400000,
});

const GRAD = Math.PI / 180;

/**
 * Lambert Conformal Conic 2SP, Ellipsoid-Formeln (EPSG Guidance Note 7-2, Methode 9802;
 * Snyder, „Map Projections – A Working Manual“, Gl. 15-1 ff.). Allgemein gehalten, damit der
 * Test die Formeln am EPSG-Rechenbeispiel prüfen kann.
 */
export function lccProjektion({ a, f, lat1, lat2, lat0, lon0, x0, y0 }) {
  const e = Math.sqrt(2 * f - f * f);
  const m = (phi) => Math.cos(phi) / Math.sqrt(1 - e * e * Math.sin(phi) ** 2);
  const t = (phi) => {
    const es = e * Math.sin(phi);
    return Math.tan(Math.PI / 4 - phi / 2) / ((1 - es) / (1 + es)) ** (e / 2);
  };
  const p1 = lat1 * GRAD;
  const p2 = lat2 * GRAD;
  const m1 = m(p1);
  const m2 = m(p2);
  const t1 = t(p1);
  const t2 = t(p2);
  const n = (Math.log(m1) - Math.log(m2)) / (Math.log(t1) - Math.log(t2));
  const F = m1 / (n * t1 ** n);
  const rho0 = a * F * t(lat0 * GRAD) ** n;

  return function vorwaerts(lat, lon) {
    const rho = a * F * t(lat * GRAD) ** n;
    const theta = n * (lon - lon0) * GRAD;
    return { x: x0 + rho * Math.sin(theta), y: y0 + rho0 - rho * Math.cos(theta) };
  };
}

const austriaLambert = lccProjektion(AUSTRIA_LAMBERT);

/** WGS84/ETRS89 (Grad) → EPSG:3416 Austria Lambert (Meter). */
export function lccVorwaerts(lat, lon) {
  return austriaLambert(Number(lat), Number(lon));
}

/* ------------------------------------------------------------------ Raster */

/**
 * Rasterzelle für einen Punkt in EPSG:3416. x0/y0 sind Zellmittelpunkte, daher round().
 * Rückgabe { spalte, zeile, index } oder null außerhalb des Rasters.
 */
export function zelleFuer(meta, x, y) {
  if (!meta || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  const spalte = Math.round((x - meta.x0) / meta.dx);
  const zeile = Math.round((y - meta.y0) / meta.dx);
  if (spalte < 0 || zeile < 0 || spalte >= meta.nx || zeile >= meta.ny) return null;
  return { spalte, zeile, index: zeile * meta.nx + spalte };
}

export const RASTER_VERZEICHNIS = path.join(process.cwd(), "data", "schneelast");
const DATEI_BIN = "sk50-at.bin";
const DATEI_META = "sk50-at.json";

const cache = new Map(); // Verzeichnis → { meta, daten } | null

/**
 * Liest Raster und Metadaten einmal je Verzeichnis und hält sie im Modul-Cache.
 * Fehlende oder unstimmige Dateien → null (wird ebenfalls gecacht, bis zum Neustart).
 */
export function ladeRaster(verzeichnis = RASTER_VERZEICHNIS) {
  if (cache.has(verzeichnis)) return cache.get(verzeichnis);
  let raster = null;
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(verzeichnis, DATEI_META), "utf8"));
    const daten = fs.readFileSync(path.join(verzeichnis, DATEI_BIN));
    const ok =
      Number.isInteger(meta.nx) && meta.nx > 0 &&
      Number.isInteger(meta.ny) && meta.ny > 0 &&
      [meta.x0, meta.y0, meta.dx, meta.skala].every((v) => Number.isFinite(v)) &&
      meta.dx > 0 && meta.skala > 0 &&
      daten.length === meta.nx * meta.ny * 2 &&
      (meta.crs == null || meta.crs === "EPSG:3416");
    if (ok) raster = { meta: { leer: 65535, kalibrierung: 1, ...meta }, daten };
    else console.error("Schneelast-Raster: Dateien unstimmig (Größe oder Metadaten) – Richtwert deaktiviert.");
  } catch (e) {
    if (e?.code !== "ENOENT") console.error("Schneelast-Raster konnte nicht gelesen werden:", e?.message);
  }
  cache.set(verzeichnis, raster);
  return raster;
}

/** Nur für Tests: Cache leeren. */
export function rasterCacheLeeren() {
  cache.clear();
}

function zellwert(raster, spalte, zeile) {
  const { meta, daten } = raster;
  if (spalte < 0 || zeile < 0 || spalte >= meta.nx || zeile >= meta.ny) return null;
  const roh = daten.readUInt16LE((zeile * meta.nx + spalte) * 2);
  return roh === meta.leer ? null : roh / meta.skala;
}

/**
 * Schneelast-Richtwert s_k (50-jährlich, kN/m²) für einen Punkt in Österreich.
 * Liegt die Zelle knapp außerhalb der Datenmaske (Grenzlage), wird der höchste Wert der
 * acht Nachbarzellen verwendet (vorsichtige Annahme).
 * Rückgabe { sk, quelle, zeitraum, methode, stand, rasterweite, nachbarzelle } oder null.
 */
export function skRichtwert(lat, lon, { verzeichnis } = {}) {
  const raster = ladeRaster(verzeichnis ?? RASTER_VERZEICHNIS);
  if (!raster) return null;
  const { x, y } = lccVorwaerts(lat, lon);
  const zelle = zelleFuer(raster.meta, x, y);
  if (!zelle) return null;

  let wert = zellwert(raster, zelle.spalte, zelle.zeile);
  let nachbarzelle = false;
  if (wert == null) {
    for (let dz = -1; dz <= 1; dz++) {
      for (let ds = -1; ds <= 1; ds++) {
        const w = zellwert(raster, zelle.spalte + ds, zelle.zeile + dz);
        if (w != null && (wert == null || w > wert)) wert = w;
      }
    }
    if (wert == null) return null;
    nachbarzelle = true;
  }

  const kalibrierung = Number.isFinite(raster.meta.kalibrierung) && raster.meta.kalibrierung > 0 ? raster.meta.kalibrierung : 1;
  // Auf 0,1 kN/m² runden: feinere Stellen täuschen eine Genauigkeit vor, die ein 1-km-Raster nicht hat.
  const sk = Math.round(wert * kalibrierung * 10) / 10;
  if (!(sk > 0)) return null;

  return {
    sk,
    quelle: raster.meta.quelle || "GeoSphere Austria, SNOWGRID-CL (CC BY 4.0)",
    zeitraum: raster.meta.zeitraum || null,
    methode: raster.meta.methode || null,
    stand: raster.meta.stand || null,
    rasterweite: raster.meta.dx,
    nachbarzelle,
  };
}
