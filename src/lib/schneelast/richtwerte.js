// src/lib/schneelast/richtwerte.js
//
// Schneelast-Richtwerte für die Schneelast-Seiten, zur BUILD-Zeit aus dem Raster gelesen
// (data/schneelast/sk50-at.bin über src/lib/standort/schneelastRaster.js, fs).
// Nur serverseitig verwenden. HORA wird NICHT abgefragt.
//
// Richtwert = eigene Auswertung GeoSphere Austria SNOWGRID-CL v2.1 (CC BY 4.0), 50-jährlich,
// 1-km-Raster – kein Normwert nach ÖNORM B 1991-1-3. Über 2.000 m Seehöhe geben wir keinen
// Wert aus (Gültigkeitsgrenze der Normkarte; im 1-km-Raster stehen dort Hochgebirgswerte).

import fs from "node:fs";
import path from "node:path";

import { ladeRaster, skRichtwert, RASTER_VERZEICHNIS } from "../standort/schneelastRaster.js";
import { ORTE } from "./orte.js";
import { LAENDER } from "./laender.js";
import { MAX_SEEHOEHE, einordnung, spanne } from "./einordnung.js";

/**
 * Richtwert für einen Punkt mit (optional) bekannter Seehöhe.
 * Rückgabe { sk, nachbarzelle, grund }: grund = "ueber2000" | "keinWert" | null.
 */
export function richtwertFuerPunkt(lat, lon, hoehe, optionen) {
  if (Number.isFinite(hoehe) && hoehe > MAX_SEEHOEHE) return { sk: null, nachbarzelle: false, grund: "ueber2000" };
  const r = skRichtwert(lat, lon, optionen);
  if (!r) return { sk: null, nachbarzelle: false, grund: "keinWert" };
  return { sk: r.sk, nachbarzelle: r.nachbarzelle, grund: null };
}

/** Tabelle eines Bundeslands: Orte mit Richtwert, Dachlast (30°, ohne Schneefang) und Einordnung. */
export function richtwerteFuerLand(slug, optionen) {
  const orte = ORTE[slug] || [];
  return orte.map((o) => {
    const r = richtwertFuerPunkt(o.lat, o.lon, o.hoehe, optionen);
    const e = r.sk != null ? einordnung(r.sk) : null;
    return {
      ...o,
      sk: r.sk,
      grund: r.grund,
      nachbarzelle: Boolean(r.nachbarzelle),
      dachlast30: e ? e.bewertung.s : null,
      modul: e ? { id: e.klasse?.id ?? null, kurz: e.kurz, stufe: e.stufe, knapp: e.knapp } : null,
    };
  });
}

/** Überblick aller Länder: Spanne (min, max, median) der Richtwerte. */
export function laenderUeberblick(optionen) {
  return LAENDER.map((l) => {
    const zeilen = richtwerteFuerLand(l.slug, optionen);
    return { ...l, anzahl: zeilen.length, spanne: spanne(zeilen) };
  });
}

/** Metadaten des Rasters für die Kartenumrechnung im Browser (ohne die Rasterdaten selbst). */
export function rasterMeta(verzeichnis = RASTER_VERZEICHNIS) {
  const raster = ladeRaster(verzeichnis);
  const m = raster?.meta ?? leseMeta(verzeichnis);
  if (!m) return null;
  const { nx, ny, x0, y0, dx, quelle, zeitraum, methode, stand } = m;
  return { nx, ny, x0, y0, dx, quelle: quelle ?? null, zeitraum: zeitraum ?? null, methode: methode ?? null, stand: stand ?? null };
}

function leseMeta(verzeichnis) {
  try {
    return JSON.parse(fs.readFileSync(path.join(verzeichnis, "sk50-at.json"), "utf8"));
  } catch {
    return null;
  }
}
