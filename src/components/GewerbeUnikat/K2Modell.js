// src/components/GewerbeUnikat/K2Modell.js
//
// K2 · Dach-Labor: REINE Rechen- und Geometriefunktionen (ohne React, ohne three) für Server-Hülle,
// SSR-Platzhalter (K2IsoSvg), Client-Bühne (K2DachLabor) und 3D-Szene (K2Szene3D). In Node testbar.
//
// Koordinaten des Modells (Meter): x = Osten (+) / Westen (−), z = Süden (+) / Norden (−), y = Höhe.
// Die Längsachse der Halle (laengeM) liegt Nord–Süd (z), die Breite (breiteM) Ost–West (x).
//
// Zahlen (kWp, Nutzfläche, Ertrag) kommen ausschließlich aus den Projektbibliotheken:
// nutzflaeche()/kwpAusNutzflaeche() (src/lib/rechner/flaeche.js), Flächenbedarf je Dachart aus
// GEWERBE_PV.dacharten und spezifischer Ertrag aus spezifischerErtrag() (src/lib/rechner/gewerbepv.js,
// serverseitig je Ort vorberechnet). Das Modulraster ist SCHEMATISCH: Es verteilt so viele Module, wie
// die kWp-Formel ergibt, im typischen Muster der Dachart – es ist keine Belegungsplanung.

import { DACH_ABZUEGE, kwpAusNutzflaeche, nutzflaeche } from "../../lib/rechner/flaeche.js";
import { zahl } from "./_tokens.js";

const RAD = Math.PI / 180;

/** Modellhalle (Annahmen der Darstellung, keine Planungswerte). */
export const HALLE = { hoehe: 9, attika: 1.0, attikaDicke: 0.4 };

/** Modul-Annahme für das Raster: 430 Wp, 1,13 × 1,72 m. */
export const MODUL = { wp: 430, laenge: 1.72, breite: 1.13, dicke: 0.05, fuge: 0.02 };

/** Höchstzahl der Instanzen in der 3D-Szene; darüber fasst ein Feld mehrere Module zusammen. */
export const MAX_INSTANZEN = 2400;

/** Darstellungs-Neigung je Dachart (Grad). Süd: Reihen 10–15° → 12°. */
export const NEIGUNG = { "ost-west": 15, sued: 12, trapez: 5, shed: 35 };

/** Höhe der Aufständerung über der Dachhaut (m). */
const AUFSTAENDERUNG = 0.25;
/** Zahntiefe der Sheds (m, Richtwert der Darstellung). */
const SHED_ZAHN = 5;

/** Texte je Dachart (Darstellung; Flächenbedarf und Ertragsbasis kommen aus GEWERBE_PV.dacharten). */
export const DACH_INFO = {
  "ost-west": {
    kurz: "Ost-West",
    montage: "A-Paare 15°, aufgeständert",
    phrase: "Ost-West aufgeständert",
    basis: "PVGIS Ost-West 15°",
    leiste: "Ost-West 15°",
    lesart: "Module in A-Paaren nach Osten und Westen: dicht gestellt, flacher Tagesverlauf, Ballast meist gering.",
  },
  sued: {
    kurz: "Süd",
    montage: "Reihen 10–15°, große Reihenabstände",
    phrase: "Süd aufgeständert",
    basis: "PVGIS Süd 10°",
    leiste: "Süd 10°",
    lesart: "Reihen nach Süden mit Abstand gegen Eigenverschattung: viel Ertrag je Modul, aber weniger Module je m².",
  },
  trapez: {
    kurz: "Trapezblech",
    montage: "dachparallel, flaches Satteldach 5°",
    phrase: "Trapezblech dachparallel",
    basis: "Mittel aus PVGIS Süd 10° und Ost-West 15°",
    leiste: "Mittel Süd 10° / Ost-West 15°",
    lesart: "Module direkt auf dem Blech: die dichteste Belegung, kein Ballast – Dachhaut und Befestigung entscheiden.",
  },
  shed: {
    kurz: "Shed",
    montage: "nur Südflächen, 35°",
    phrase: "Sheddach, Südflächen",
    basis: "PVGIS Süd 35°, 3 % Abschlag Verschattung",
    leiste: "Süd 35° (−3 %)",
    lesart: "Nur die Südflanken der Sägezähne tragen Module: hoher Ertrag je kWp, die Nordverglasung bleibt frei.",
  },
};

export const DACHART_IDS = ["ost-west", "sued", "trapez", "shed"];

/** Hallenmaß-Chips (Breite Ost–West × Länge Nord–Süd). 6.000 m² = GEWERBE_PRESETS „logistik“. */
export const HALLEN_PRESETS = [
  { id: "h2500", label: "2.500 m²", sub: "50 × 50 m", laengeM: 50, breiteM: 50 },
  { id: "h6000", label: "6.000 m²", sub: "60 × 100 m", laengeM: 100, breiteM: 60 },
  { id: "h12000", label: "12.000 m²", sub: "80 × 150 m", laengeM: 150, breiteM: 80 },
];

export const MASS = {
  laenge: { min: 20, max: 200, schritt: 5 },
  breite: { min: 15, max: 120, schritt: 5 },
};

export const ABZUG = {
  rand: { ...DACH_ABZUEGE.rand, schritt: 1 },
  hindernisse: { ...DACH_ABZUEGE.hindernisse, schritt: 1 },
  stand: DACH_ABZUEGE.stand,
};

/** Sonnen-Tage (Monat 0-basiert). */
export const SONNEN_TAGE = [
  { id: "maerz", label: "21. März", kurz: "21.3.", m: 2, d: 21 },
  { id: "juni", label: "21. Juni", kurz: "21.6.", m: 5, d: 21 },
  { id: "dez", label: "21. Dez.", kurz: "21.12.", m: 11, d: 21 },
];

/** Uhrzeit-Regler in Minuten ab Mitternacht (Wanduhr Österreich, mit Sommerzeit). */
export const ZEIT = { min: 270, max: 1290, schritt: 15, start: 600 };

/** Startzustand des Kapitels (= SSR-Platzhalter). */
export const START = {
  dachart: "ost-west",
  laengeM: 100,
  breiteM: 60,
  randPct: DACH_ABZUEGE.rand.standard,
  hindernisPct: DACH_ABZUEGE.hindernisse.standard,
  ortId: "linz",
  tag: "juni",
  zeitMin: ZEIT.start,
};

// ---------------------------------------------------------------------------------------------------
// Kennwerte (die Zahlen des Kapitels)
// ---------------------------------------------------------------------------------------------------

/**
 * Brutto → Nutzfläche → max. kWp (auf 5 gerundet) → Jahresertrag.
 * @param {{ laengeM:number, breiteM:number, randPct:number, hindernisPct:number, qmProKwp:number, spez:number }} p
 */
export function kennwerte({ laengeM, breiteM, randPct, hindernisPct, qmProKwp, spez }) {
  const brutto = laengeM * breiteM;
  const f = nutzflaeche(brutto, { randPct, hindernisPct });
  const kwp = Math.round(kwpAusNutzflaeche(f.netto, qmProKwp) / 5) * 5;
  const mwh = (kwp * spez) / 1000;
  return { brutto, rand: f.rand, hindernisse: f.hindernisse, netto: f.netto, kwp, spez, mwh, module: Math.round((kwp * 1000) / MODUL.wp) };
}

/** Bildunterschrift (SSR-Startzustand und Live-Text). */
export function bildunterschrift({ laengeM, breiteM, dachart, netto, kwp, spez, ortName }) {
  const d = DACH_INFO[dachart] || DACH_INFO["ost-west"];
  return `Halle ${zahl(breiteM)} × ${zahl(laengeM)} m, ${d.phrase}: Nutzfläche ${zahl(netto)} m², bis ≈ ${zahl(kwp)} kWp, ≈ ${zahl(spez)} kWh/kWp in ${ortName} (PVGIS)`;
}

/** Uhrzeit „10:00“ aus Minuten. */
export function uhrzeit(min) {
  const t = Math.round(min);
  const h = Math.floor(t / 60);
  const m = t - h * 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Himmelsrichtung (8-teilig) aus Azimut von Nord. */
export function himmelsrichtung(azimut) {
  const namen = ["Norden", "Nordosten", "Osten", "Südosten", "Süden", "Südwesten", "Westen", "Nordwesten"];
  const kurz = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"];
  const i = Math.round((((azimut % 360) + 360) % 360) / 45) % 8;
  return { lang: namen[i], kurz: kurz[i] };
}

// ---------------------------------------------------------------------------------------------------
// Dachplan: Randstreifen, Freihaltestreifen, Lichtkuppeln, Technik, Modulraster
// ---------------------------------------------------------------------------------------------------

/** Breite eines gleichmäßigen Randstreifens, dessen Fläche randPct % der Bruttofläche ergibt. */
export function randBreite(L, B, randPct) {
  const r = Math.min(0.99, Math.max(0, randPct / 100));
  const s = L + B;
  return Math.max(0, (s - Math.sqrt(Math.max(0, s * s - 4 * L * B * r))) / 4);
}

/** Shed-Geometrie: Zahl der Zähne, Zahntiefe r (m) und Zahnhöhe (m) bei 35° Südfläche. */
export function shedGeometrie(L) {
  const n = Math.max(2, Math.round(L / SHED_ZAHN));
  const r = L / n;
  return { n, r, hub: r * Math.tan(NEIGUNG.shed * RAD) };
}

/** Höhe der Dachoberfläche (m) im Grundriss-Punkt (x, z) für eine Dachart. */
export function dachHoehe(typ, x, z, L, B) {
  const H = HALLE.hoehe;
  if (typ === "trapez") return H + (B / 2 - Math.min(B / 2, Math.abs(x))) * Math.tan(NEIGUNG.trapez * RAD);
  if (typ === "shed") {
    const { n, r, hub } = shedGeometrie(L);
    const zz = z + L / 2;
    if (zz >= L - 1e-7) return H;
    if (zz <= 0) return H + hub;
    const k = Math.min(n - 1, Math.floor((zz + 1e-7) / r));
    return H + hub * (1 - (zz - k * r) / r);
  }
  const a = HALLE.attikaDicke + 1e-6;
  if (x <= -B / 2 + a || x >= B / 2 - a || z <= -L / 2 + a || z >= L / 2 - a) return H + HALLE.attika;
  return H;
}

/**
 * Rasterlinien der Dachfläche (Höhenfeld), gemeinsam für alle Dacharten – so lässt sich die Dachform
 * zwischen Flachdach mit Attika, Satteldach und Shed per Höhen-Überblendung verwandeln.
 * @returns {{ xs:number[], zs:number[], glas:Set<number> }} glas = Indizes j der Zellreihen zs[j]…zs[j+1], die Shed-Verglasung sind
 */
export function dachRaster(L, B) {
  const a = HALLE.attikaDicke;
  const e = 0.02;
  const xs = [-B / 2, -B / 2 + a, -B / 2 + a + e, 0, B / 2 - a - e, B / 2 - a, B / 2];
  const zsRoh = [-L / 2, -L / 2 + a, -L / 2 + a + e, L / 2 - a - e, L / 2 - a, L / 2];
  const { n, r } = shedGeometrie(L);
  const glasStart = [];
  for (let k = 1; k < n; k++) {
    const zb = -L / 2 + k * r;
    zsRoh.push(zb - e, zb);
    glasStart.push(zb - e);
  }
  zsRoh.sort((p, q) => p - q);
  const zs = [];
  for (const v of zsRoh) if (!zs.length || v - zs[zs.length - 1] > 0.005) zs.push(v);
  const glas = new Set();
  for (const g of glasStart) {
    const j = zs.findIndex((v) => Math.abs(v - g) < 0.004);
    if (j >= 0) glas.add(j);
  }
  return { xs, zs, glas };
}

/** Muster je Dachart: Teilung quer zur Reihe (m), Fußabdruck quer zur Reihe, Reihenachse. */
function muster(dachart, qmProKwp) {
  const p = MODUL.laenge + MODUL.fuge; // Teilung entlang der Reihe
  const am = qmProKwp * (MODUL.wp / 1000); // Dachfläche je Modul (m²), z. B. 7 × 0,43 = 3,01
  if (dachart === "sued") return { reihe: "x", quer: am / p, fuss: MODUL.breite * Math.cos(NEIGUNG.sued * RAD), je: 1, am };
  if (dachart === "trapez") return { reihe: "z", quer: am / p, fuss: MODUL.breite, je: 1, am };
  if (dachart === "shed") return { reihe: "x", quer: null, fuss: 2 * MODUL.breite * Math.cos(NEIGUNG.shed * RAD), je: 2, am };
  // Ost-West: ein Platz = ein A-Paar (Ost- und West-Modul)
  return { reihe: "z", quer: (2 * am) / p, fuss: 2 * MODUL.breite * Math.cos(NEIGUNG["ost-west"] * RAD) + 0.06, je: 2, am };
}

/** Zentrierte Teilung einer Strecke [a, b] in Plätze der Breite fuss mit Abstand teil. */
function teilung(a, b, teil, fuss) {
  const frei = b - a - fuss;
  if (!(frei >= 0) || !(teil > 0)) return [];
  const n = Math.floor(frei / teil + 1e-9) + 1;
  const start = a + (b - a - (n - 1) * teil) / 2;
  return Array.from({ length: n }, (_, i) => start + i * teil);
}

/**
 * Reihe entlang der Reihenachse [a, b] in Feldern zu je k Modulen; das letzte Feld nimmt den Rest
 * (weniger Module). Zentriert. → [{ c: Mitte, laenge, mods }]
 */
function reihe(a, b, k) {
  const p = MODUL.laenge + MODUL.fuge;
  const n = Math.floor((b - a + MODUL.fuge) / p + 1e-9);
  if (n < 1) return [];
  const start = a + (b - a - (n * p - MODUL.fuge)) / 2;
  const out = [];
  for (let s = 0; s < n; s += k) {
    const mods = Math.min(k, n - s);
    const laenge = mods * p - MODUL.fuge;
    out.push({ c: start + s * p + laenge / 2, laenge, mods });
  }
  return out;
}

/**
 * Vollständiger Dachplan für die Darstellung (3D und Iso-SVG).
 * @param {{ laengeM:number, breiteM:number, randPct:number, hindernisPct:number, dachart:string, qmProKwp:number, module:number }} p
 * @returns {{
 *   L:number, B:number, H:number, rand:number, nutz:{x0:number,x1:number,z0:number,z1:number},
 *   streifen:{z0:number,z1:number}[], kuppeln:{x:number,z:number,w:number,d:number}[], technik:{x:number,z:number,w:number,d:number}[],
 *   k:number, instanzen:{x:number,y:number,z:number,rx:number,rz:number,sx:number,sz:number,mods:number}[], module:number, gezeigt:number
 * }}
 */
export function dachPlan({ laengeM: L, breiteM: B, randPct, hindernisPct, dachart, qmProKwp, module }) {
  const H = HALLE.hoehe;
  const p = MODUL.laenge + MODUL.fuge;
  const w = randBreite(L, B, randPct);
  const nutz = { x0: -B / 2 + w, x1: B / 2 - w, z0: -L / 2 + w, z1: L / 2 - w };
  const nB = Math.max(0, nutz.x1 - nutz.x0);
  const nL = Math.max(0, nutz.z1 - nutz.z0);
  const aH = nB * nL * Math.min(1, Math.max(0, hindernisPct / 100));
  const m = muster(dachart, qmProKwp);

  // Aggregation: 1 Instanz = k Module in Reihe, sobald sonst mehr als MAX_INSTANZEN entstünden
  // (mit Reserve für die kürzeren Restfelder am Reihenende)
  const k = [1, 4, 9, 16].find((f) => Math.ceil(module / f) * 1.08 <= MAX_INSTANZEN) || 25;

  // Freihaltestreifen quer übers Dach (Ost–West), gleichmäßig verteilt: 40 % des Hindernis-Abzugs.
  // Shed: der ganze Abzug – Lichtkuppeln und Technik entfallen dort, die Nordverglasung bringt das Tageslicht.
  const streifen = [];
  const anteilStreifen = dachart === "shed" ? 1 : 0.4;
  if (aH > 0 && nB > 1 && nL > 1) {
    const n = Math.max(1, Math.floor(nL / 45));
    const breite = Math.min((nL / (n + 1)) * 0.8, (anteilStreifen * aH) / (n * nB));
    for (let i = 1; i <= n; i++) {
      const zc = nutz.z0 + (i * nL) / (n + 1);
      streifen.push({ z0: zc - breite / 2, z1: zc + breite / 2 });
    }
  }
  // Felder zwischen den Streifen – kein Modulfeld überquert eine Freihaltezone
  const felder = [];
  let zLauf = nutz.z0;
  for (const s of streifen) {
    felder.push({ z0: zLauf, z1: s.z0 });
    zLauf = s.z1;
  }
  felder.push({ z0: zLauf, z1: nutz.z1 });

  // Raster-Plätze im Muster der Dachart: { i, j, x, z, z0, z1, laenge, mods }
  const plaetze = [];
  if (dachart === "shed") {
    const { n, r } = shedGeometrie(L);
    const segs = reihe(nutz.x0, nutz.x1, k);
    for (let t = 0; t < n; t++) {
      const z0 = -L / 2 + t * r + 0.25; // knapp unter dem First (Nordkante des Zahns)
      const z1 = z0 + m.fuss;
      if (z0 < nutz.z0 || z1 > nutz.z1 || streifen.some((s) => z1 > s.z0 && z0 < s.z1)) continue;
      segs.forEach((g, i) => plaetze.push({ i, j: t, x: g.c, z: (z0 + z1) / 2, z0, z1, laenge: g.laenge, mods: g.mods }));
    }
  } else if (m.reihe === "z") {
    const xsPl = teilung(nutz.x0, nutz.x1, m.quer, m.fuss).filter((x) => !(dachart === "trapez" && Math.abs(x) < m.quer / 2));
    let j = 0;
    for (const f of felder) {
      for (const g of reihe(f.z0, f.z1, k)) {
        xsPl.forEach((x, i) => plaetze.push({ i, j, x, z: g.c, z0: g.c - g.laenge / 2, z1: g.c + g.laenge / 2, laenge: g.laenge, mods: g.mods }));
        j++;
      }
    }
  } else {
    const segs = reihe(nutz.x0, nutz.x1, k);
    let j = 0;
    for (const f of felder) {
      for (const zc of teilung(f.z0, f.z1, m.quer, m.fuss)) {
        segs.forEach((g, i) => plaetze.push({ i, j, x: g.c, z: zc, z0: zc - m.fuss / 2, z1: zc + m.fuss / 2, laenge: g.laenge, mods: g.mods }));
        j++;
      }
    }
  }
  const platzBreite = (q) => (m.reihe === "z" ? m.fuss : q.laenge);
  const platzFlaeche = (q) => q.mods * m.am * m.je;

  // Lichtkuppeln (45 %) und Technik (15 %) ersetzen ganze Raster-Plätze – so bleibt die Modulzahl stimmig
  const kuppeln = [];
  const technik = [];
  const belegt = new Set();
  if (dachart !== "shed" && aH > 0 && plaetze.length) {
    const iMax = Math.max(...plaetze.map((q) => q.i));
    const jMax = Math.max(...plaetze.map((q) => q.j));
    const teilX = nB / (iMax + 1);
    const teilZ = nL / (jMax + 1);
    // Technik-Blöcke ≈ 6 × 8 m, abwechselnd am West- und am Ostrand
    const cx = Math.max(1, Math.round(6 / teilX));
    const cz = Math.max(1, Math.round(8 / teilZ));
    const nTech = Math.min(6, Math.round((0.15 * aH) / (cx * teilX * cz * teilZ)));
    for (let t = 0; t < nTech; t++) {
      const j0 = Math.max(0, Math.round(((t + 0.5) * (jMax + 1)) / nTech - cz / 2));
      const i0 = t % 2 === 0 ? Math.min(1, iMax) : Math.max(0, iMax - cx);
      const block = plaetze.filter((q) => q.i >= i0 && q.i < i0 + cx && q.j >= j0 && q.j < j0 + cz && !belegt.has(q));
      if (!block.length) continue;
      const xa = Math.min(...block.map((q) => q.x - platzBreite(q) / 2));
      const xb = Math.max(...block.map((q) => q.x + platzBreite(q) / 2));
      const za = Math.min(...block.map((q) => q.z0));
      const zb = Math.max(...block.map((q) => q.z1));
      technik.push({ x: (xa + xb) / 2, z: (za + zb) / 2, w: Math.max(1.5, (xb - xa) * 0.7), d: Math.max(1.5, (zb - za) * 0.7) });
      for (const q of block) belegt.add(q);
    }
    // Lichtkuppeln gleichmäßig verteilt: jeder s-te Platz in beiden Richtungen
    const frei = plaetze.filter((q) => !belegt.has(q));
    const mittelFlaeche = frei.reduce((s, q) => s + platzFlaeche(q), 0) / Math.max(1, frei.length);
    const nKPl = Math.round((0.45 * aH) / mittelFlaeche);
    if (nKPl > 0 && frei.length) {
      const verh = Math.max(1, frei.length / nKPl);
      const sX = Math.max(1, Math.min(iMax + 1, Math.round(Math.sqrt((verh * teilZ) / teilX))));
      const sZ = Math.max(1, Math.round(verh / sX));
      const oX = Math.floor(sX / 2);
      const oZ = Math.floor(sZ / 2);
      for (const q of frei) {
        if (q.i % sX !== oX || q.j % sZ !== oZ) continue;
        belegt.add(q);
        // je Modul des Platzes eine Kuppel (bei zusammengefassten Feldern mehrere in Reihe)
        for (let s = 0; s < q.mods; s++) {
          const off = (s - (q.mods - 1) / 2) * p;
          if (m.reihe === "z") kuppeln.push({ x: q.x, z: q.z + off, w: Math.min(1.5, m.fuss * 0.62), d: 1.3 });
          else kuppeln.push({ x: q.x + off, z: q.z, w: 1.3, d: Math.min(1.5, m.quer * 0.6) });
        }
      }
    }
  }

  // Modul-Instanzen aus den freien Plätzen
  let instanzen = [];
  for (const q of plaetze) {
    if (belegt.has(q)) continue;
    if (dachart === "ost-west") {
      const t = NEIGUNG["ost-west"] * RAD;
      const dx = (MODUL.breite * Math.cos(t)) / 2 + 0.03;
      const y = H + AUFSTAENDERUNG + (MODUL.breite / 2) * Math.sin(t);
      instanzen.push({ x: q.x + dx, y, z: q.z, rx: 0, rz: -t, sx: MODUL.breite, sz: q.laenge, mods: q.mods });
      instanzen.push({ x: q.x - dx, y, z: q.z, rx: 0, rz: t, sx: MODUL.breite, sz: q.laenge, mods: q.mods });
    } else if (dachart === "sued") {
      const t = NEIGUNG.sued * RAD;
      instanzen.push({ x: q.x, y: H + AUFSTAENDERUNG + (MODUL.breite / 2) * Math.sin(t), z: q.z, rx: t, rz: 0, sx: q.laenge, sz: MODUL.breite, mods: q.mods });
    } else if (dachart === "trapez") {
      const t = NEIGUNG.trapez * RAD * (q.x > 0 ? -1 : 1);
      instanzen.push({ x: q.x, y: dachHoehe("trapez", q.x, q.z, L, B) + 0.09, z: q.z, rx: 0, rz: t, sx: MODUL.breite, sz: q.laenge, mods: q.mods });
    } else {
      const t = NEIGUNG.shed * RAD;
      const tief = MODUL.breite * Math.cos(t);
      for (let s = 0; s < 2; s++) {
        const zz = q.z0 + tief * (s + 0.5) + s * 0.02;
        instanzen.push({ x: q.x, y: dachHoehe("shed", q.x, zz, L, B) + 0.09 / Math.cos(t), z: zz, rx: t, rz: 0, sx: q.laenge, sz: MODUL.breite, mods: q.mods });
      }
    }
  }
  // So viele Module, wie die kWp-Formel ergibt: überzählige Felder bleiben im Norden frei
  instanzen.sort((a, b) => b.z - a.z || a.x - b.x);
  let gezeigt = 0;
  let n = 0;
  while (n < instanzen.length && gezeigt < module) gezeigt += instanzen[n++].mods;
  instanzen = instanzen.slice(0, n);
  // Reihenfolge Nord → Süd, West → Ost (das gestaffelte Umordnen läuft als Welle)
  instanzen.sort((a, b) => a.z - b.z || a.x - b.x);

  return { L, B, H, rand: w, nutz, streifen, kuppeln, technik, k, instanzen, module, gezeigt };
}

// ---------------------------------------------------------------------------------------------------
// Ansicht: 3/4-Aufsicht von Südost (gemeinsam für 3D-Kamera und Iso-SVG)
// ---------------------------------------------------------------------------------------------------

/** Blickrichtung der Kamera: Azimut von Nord (Grad, 145° = Südost-Süd) und Höhenwinkel (Grad). */
export const ANSICHT = { azimut: 148, hoehe: 33, drehung: 20 };

/** Bildschirmwinkel der Nordrichtung (Grad, 0 = rechts, im Uhrzeigersinn) bei Drehung d – für die Windrose. */
export function nordRichtung(d = 0) {
  const a = (ANSICHT.azimut + d) * RAD;
  const [u, v] = [Math.sin(a), Math.cos(a) * Math.sin(ANSICHT.hoehe * RAD)];
  return { u, v };
}

/** Radius der runden Modellplatte (m) – Halle, Lkw an der Ostrampe und Bäume haben Platz. */
export function plattenRadius(L, B) {
  return Math.max(0.5 * Math.hypot(L, B) + 7, B / 2 + 20, L / 2 + 7);
}

/**
 * Parallelprojektion (für das Iso-SVG): Grundriss (x, z) und Höhe y → Bildschirm (u nach rechts, v nach unten).
 */
export function iso(x, y, z, azimut = ANSICHT.azimut, hoehe = ANSICHT.hoehe) {
  const a = azimut * RAD;
  const e = hoehe * RAD;
  const u = -x * Math.cos(a) - z * Math.sin(a);
  const tiefe = x * Math.sin(a) - z * Math.cos(a);
  return [u, tiefe * Math.sin(e) - y * Math.cos(e)];
}

/** Sonnenrichtung als Einheitsvektor (x Ost, y oben, z Süd) aus Zenit/Azimut (Grad). */
export function sonnenVektor(zenit, azimut) {
  const z = zenit * RAD;
  const a = azimut * RAD;
  return [Math.sin(z) * Math.sin(a), Math.cos(z), -Math.sin(z) * Math.cos(a)];
}

// ---------------------------------------------------------------------------------------------------
// Gemeinsame Bildgeometrie für Iso-SVG und 3D-Szene (beide Parallelprojektion, gleicher Ausschnitt).
// So liegen SSR-Platzhalter und 3D-Modell beim Überblenden deckungsgleich übereinander.
// ---------------------------------------------------------------------------------------------------

/** Höhe der runden Modellplatte (m). */
export const PLATTE = 0.8;

/** Sattelzug an der Ostrampe (Maße in m, Darstellung). */
export const LKW = { auflieger: { l: 13.6, h: 3.9, b: 2.55, boden: 0.6 }, kabine: { l: 2.3, h: 3.0, b: 2.5, abstand: 0.2 } };

/**
 * Umgebung als Maßstab: Sattelzüge an der Ostrampe und Modellbäume am Plattenrand (Norden, Westen) –
 * nie auf Halle oder Lkw. Dieselben Positionen in 3D und Iso-SVG.
 * @returns {{ R:number, lkw:{ x:number, z:number }[], baeume:{ x:number, z:number, s:number, dreh:number }[] }}
 */
export function umgebung(L, B) {
  const R = plattenRadius(L, B);
  const n = L >= 40 ? 2 : 1;
  const lkw = Array.from({ length: n }, (_, i) => ({ x: B / 2 + 0.6, z: n === 1 ? 0 : (i === 0 ? -1 : 1) * Math.min(6, L / 6) }));
  const winkel = [292, 318, 340, 8, 34, 205, 228, 252, 270, 150];
  const baeume = [];
  for (const [i, g] of winkel.entries()) {
    const rho = R * (0.8 + (i % 3) * 0.04);
    const x = Math.sin(g * RAD) * rho;
    const z = -Math.cos(g * RAD) * rho;
    const frei = Math.abs(x) > B / 2 + 5 || Math.abs(z) > L / 2 + 5;
    const lkwZone = x > B / 2 - 2 && x < B / 2 + 20 && Math.abs(z) < 12;
    if (!frei || lkwZone) continue;
    baeume.push({ x, z, s: 2.6 + (i % 3) * 0.6, dreh: i });
  }
  return { R, lkw, baeume };
}

/** Krone eines Modellbaums: Mittelpunkt-Höhe und Radius (Kugel – in der Parallelprojektion ein Kreis). */
export const baumKrone = (s) => ({ y: PLATTE + 2.2 + s * 1.04, r: s * 1.04 });

/** Höchster Punkt des Dachs über alle Dacharten – der Ausschnitt springt beim Dachart-Wechsel nicht. */
export function dachOberkante(L, B) {
  return HALLE.hoehe + Math.max(HALLE.attika, (B / 2) * Math.tan(NEIGUNG.trapez * RAD), shedGeometrie(L).hub);
}

/**
 * Bildausschnitt der Parallelprojektion (Koordinaten von iso(): u nach rechts, v nach unten) für eine Halle:
 * Modellplatte, Halle (höchste Dachform), Lkw und Bäume – über alle Drehungen ±ANSICHT.drehung, damit beim
 * Drehen nichts aus dem Bild läuft. Iso-SVG nimmt ihn als viewBox, die 3D-Kamera (orthografisch) als
 * Frustum – beide mit „meet“ (ganzer Ausschnitt sichtbar, zentriert).
 * @returns {{ u0:number, v0:number, w:number, h:number }}
 */
export function bildRahmen(L, B) {
  const { R, lkw, baeume } = umgebung(L, B);
  const e = ANSICHT.hoehe * RAD;
  const oben = dachOberkante(L, B);
  let u0 = -R;
  let u1 = R;
  let v0 = -R * Math.sin(e) - PLATTE * Math.cos(e);
  let v1 = R * Math.sin(e);
  const punkt = (x, y, z, r = 0) => {
    for (const d of [-ANSICHT.drehung, 0, ANSICHT.drehung]) {
      const [u, v] = iso(x, y, z, ANSICHT.azimut + d);
      u0 = Math.min(u0, u - r);
      u1 = Math.max(u1, u + r);
      v0 = Math.min(v0, v - r);
      v1 = Math.max(v1, v + r);
    }
  };
  for (const [x, z] of [
    [-B / 2, -L / 2],
    [B / 2, -L / 2],
    [-B / 2, L / 2],
    [B / 2, L / 2],
  ])
    punkt(x, oben, z);
  const hL = PLATTE + LKW.auflieger.boden + LKW.auflieger.h;
  for (const k of lkw) for (const dx of [0, LKW.auflieger.l + LKW.kabine.abstand + LKW.kabine.l]) punkt(k.x + dx, hL, k.z);
  for (const b of baeume) {
    const k = baumKrone(b.s);
    punkt(b.x, k.y, b.z, k.r);
  }
  const rand = R * 0.05;
  return { u0: u0 - rand, v0: v0 - rand, w: u1 - u0 + 2 * rand, h: v1 - v0 + 2 * rand };
}

/**
 * Helligkeit eines Moduls (0 = navy-800, 1 = navy-400) aus dem Bestrahlungsanteil f = cos(Einfallswinkel).
 * Bewusst steil, damit sonnenzugewandte Flanken sichtbar aufhellen (Ost-West: morgens Ost, abends West).
 */
export function modulTon(f) {
  const t = Math.min(1, Math.max(0, (f - 0.22) / 0.6));
  return t * t * (3 - 2 * t);
}
