"use client";

// src/components/GewerbeUnikat/K1Teppich.js
//
// K1 · Lastgang-Teppich (Client-Bühne, per next/dynamic aus K1Insel.js in Bildschirmnähe geladen).
// Ein Jahr Viertelstundenwerte als Canvas (365 × 96 bzw. mobil hochkant 96 × 365), fünf Linsen, Fadenkreuz
// mit Ablesung und Tagesverlauf. Daten aus dem Web Worker (useGewerbeDaten) – hier wird nur NEU GEFÄRBT
// (≤ 3 ms je Linse, eine Schleife über die Zellen), nichts geparst oder analysiert.
//
// Dramaturgie (QA-Runde 13.10.2026):
//  1. Einblenden: Das Jahr läuft von Jänner bis Dezember ein; jede Monatsspitze leuchtet in dem Moment auf,
//     in dem die Einblendung ihre Spalte erreicht (Verzögerung = Umkehrung der Einblend-Kurve, nicht geraten).
//  2. „Sonne darüberlegen“: Die Sonne wandert von Jänner bis Dezember über dieselben Zellen (blau → grün/gelb,
//     linear codiert), „genutzt“ und „übrig“ zählen synchron zur Wischkante hoch.
//  3. Danach liegt auf derselben Fläche die Ablage „Ihr Lastgang statt Beispiel“ (Drag-and-drop auf den
//     Teppich, Gate unverändert – Ablauf in ./K1Ablage.js, gemeinsam mit dem Panel unter den Kennzahlen).
//
// Zeichnung: ImageData in Datenauflösung → putImageData; die Canvas skaliert per CSS image-rendering:
// pixelated. Zwei gestapelte Canvas: die neue Linse wird in die hintere gemalt und überblendet bzw. (Sonne)
// per clip-path eingewischt. Beschriftungen (Monatsspitzen, Betriebsurlaub, Zeitumstellung …) als SVG/HTML.
//
// Bedienung: Pointer (Hover am Desktop, Tippen + seitliches Ziehen mobil, touch-action: pan-y), Tastatur
// auf der Fläche (Pfeile, Umschalt = Woche/Stunde, Bild ↑/↓ ≈ Monat, Pos1/Ende, Esc), Linsen als Radiogruppe.

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { FileSpreadsheet, FileUp, Sun } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";
import { Erkenntnis, QuellePille } from "./_bausteine";
import { useGewerbeDaten, vorwaermen } from "./_daten";
import { LAST_PALETTE, hexZuRgb, lastStufe } from "./_farbe";
import { useAnsage, useImSichtfeld, useMobil, useProBild, useReduzierteBewegung, useTouch } from "./_gestaltung";
import { steckbrief, useSteckbrief } from "./_steckbrief";
import { BEWEGUNG, FARBE, KENNZEICHNUNG, STAND, prozent, zahl } from "./_tokens";
import { dateiAus, traegtDateien, useK1Ablage, useK1Gate } from "./K1Ablage";
import {
  EigenLink,
  HerkunftChip,
  LinsenOptik,
  MONATE_KURZ,
  TAG_MS,
  TeppichGestell,
  TeppichKopf,
  ZEILE,
  datumKurz,
  datumLang,
  datumSatz,
  minutenVon,
  monatsAbschnitte,
  tagBeginn,
  uhrzeit,
} from "./K1Gestell";

// ---------------------------------------------------------------------------------------------------
// Farben (flach, für die Färbe-Schleife)
// ---------------------------------------------------------------------------------------------------

// Gepackte RGBA-Werte (Uint32, Byte-Reihenfolge der Plattform): Die Färbe-Schleife schreibt je Zelle EINEN
// Wert aus einer Nachschlagetabelle – so bleibt das Neufärben von 35.040 Zellen deutlich unter 3 ms.
const LE = new Uint8Array(new Uint32Array([0x01020304]).buffer)[0] === 4;
const pack = (r, g, b) => (LE ? ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0 : ((r << 24) | (g << 16) | (b << 8) | 255) >>> 0);
const N950 = hexZuRgb(FARBE.navy950);
const N300 = hexZuRgb(FARBE.navy300);
const OV = hexZuRgb(FARBE.ov400);
const SU = hexZuRgb(FARBE.sun300);
const N950_P = pack(...N950);
const N300_P = pack(...N300);
/** Last-Rampe, Richtung navy-950 auf Helligkeit f abgedunkelt, als gepackte Tabelle. */
const rampeGedimmt = (f) => Uint32Array.from(LAST_PALETTE, ([r, g, b]) => pack(Math.round(N950[0] + (r - N950[0]) * f), Math.round(N950[1] + (g - N950[1]) * f), Math.round(N950[2] + (b - N950[2]) * f)));
const LUT = {
  voll: rampeGedimmt(1),
  band: rampeGedimmt(0.25), // Schichtbeginn: außerhalb des Bands
  werktag: rampeGedimmt(0.16), // Freie Tage: Werktage
  grund: rampeGedimmt(0.2), // Grundlast: über 1,2 × Grundlast
};
/**
 * Sonne: Netzbezug-Grund als flache RGB-Tabelle. Bewusst DUNKEL (Rampe auf 26 %): Die Deckung wird LINEAR
 * eingemischt (Grünanteil = Anteil der Last, den die Sonne deckt) – damit auch 15–30 % Teildeckung lesbar
 * bleiben, wird der Grund dunkler gewählt statt die Skala zu verzerren (QA 13.10.: Wurzel übertrieb die
 * Eigenversorgung optisch, 49 % statt 27 % „überwiegend grüne“ Zellen).
 */
const SONNE_GRUND_F = 0.26;
const SONNE_GRUND = Float32Array.from(LAST_PALETTE.flatMap(([r, g, b]) => [N950[0] + (r - N950[0]) * SONNE_GRUND_F, N950[1] + (g - N950[1]) * SONNE_GRUND_F, N950[2] + (b - N950[2]) * SONNE_GRUND_F]));
/** Sonne: Mischung Grün → Gelb für den Überschuss-Anteil in 64 Stufen (gepackt). */
const UEBER_LUT = Uint32Array.from({ length: 65 }, (_, i) => {
  const t = Math.min(1, 0.3 + i / 64); // mindestens 30 % Richtung Gelb – Überschuss soll klar lesbar sein
  return pack(Math.round(OV[0] + (SU[0] - OV[0]) * t), Math.round(OV[1] + (SU[1] - OV[1]) * t), Math.round(OV[2] + (SU[2] - OV[2]) * t));
});

const ERKENNTNIS_ID = { schichtbeginn: "k1-schichtbeginn", "freie-tage": "k1-freie-tage", grundlast: "k1-grundlast", sonne: "k1-sonne" };
const AUSRICHTUNG = { ostwest: "Ost-West", sued: "Süd", flach: "flach aufgeständert" };

// ---------------------------------------------------------------------------------------------------
// Takt: Einblend- und Wischkurve samt Umkehrung (wann erreicht die Kante den Anteil x?)
// ---------------------------------------------------------------------------------------------------

/** Kubische Bézier-Kurve (CSS cubic-bezier) als Tabelle: wert(t) = Fortschritt, zeit(p) = Umkehrung. */
function bezier([x1, y1, x2, y2]) {
  const N = 240;
  const xs = new Float64Array(N + 1);
  const ys = new Float64Array(N + 1);
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    const u = 1 - s;
    xs[i] = 3 * u * u * s * x1 + 3 * u * s * s * x2 + s * s * s;
    ys[i] = 3 * u * u * s * y1 + 3 * u * s * s * y2 + s * s * s;
  }
  const lies = (a, b, v) => {
    if (!(v > 0)) return 0;
    if (v >= 1) return 1;
    let lo = 0;
    let hi = N;
    while (hi - lo > 1) {
      const mi = (lo + hi) >> 1;
      if (a[mi] < v) lo = mi;
      else hi = mi;
    }
    const f = (v - a[lo]) / (a[hi] - a[lo] || 1);
    return b[lo] + (b[hi] - b[lo]) * f;
  };
  return { wert: (t) => lies(xs, ys, t), zeit: (p) => lies(ys, xs, p) };
}
/** Einblenden und Sonnen-Wisch laufen auf derselben ruhigen inAus-Kurve: ein Jahr „vergeht“ gleichmäßig. */
const KURVE = bezier(BEWEGUNG.ease.inAus);
const INTRO = BEWEGUNG.dauer.intro * 1.4; // 1,26 s – zwölf Monatsspitzen nacheinander statt in einem Blitz
const WISCH_LANG = 2.6; // s – erstes Darüberlegen der Sonne: Zeit zum Mitlesen der Zähler
const WISCH_KURZ = 1.3; // s – jedes weitere Mal

// ---------------------------------------------------------------------------------------------------
// Textbreite (Ausweich-Logik der Etiketten): gemessen in der echten Schrift, Rückfall Schätzung
// ---------------------------------------------------------------------------------------------------

let messKontext = null;
const messCache = new Map();
function textBreite(text, px) {
  const key = `${px}|${text}`;
  const alt = messCache.get(key);
  if (alt) return alt;
  let w = text.length * px * 0.6;
  try {
    if (!messKontext) messKontext = document.createElement("canvas").getContext("2d");
    messKontext.font = `600 ${px}px ${getComputedStyle(document.body).fontFamily}`;
    // tabellarische Ziffern sind etwas breiter als die proportionalen der Canvas-Messung
    w = messKontext.measureText(text).width * 1.05;
  } catch {
    // Messung nicht möglich (alte Browser): Schätzung bleibt
  }
  messCache.set(key, w);
  return w;
}

// ---------------------------------------------------------------------------------------------------
// Modell: einmal je Lastgang (Beispiel oder eigene Datei) – Stufen, Spaltenzuordnung, Anker der Beschriftung
// ---------------------------------------------------------------------------------------------------

function baueModell(last) {
  const { tage, typ, slots, last: werte, max } = last.raster;
  const nT = tage.length;
  const t0 = tage[0];
  // Spalten = Kalendertage ab dem ersten Tag (fehlende Tage bleiben leer statt zusammenzurücken)
  const nSp = Math.max(1, Math.round((tage[nT - 1] - t0) / TAG_MS) + 1);
  const tagVonSpalte = new Int32Array(nSp).fill(-1);
  for (let d = 0; d < nT; d++) {
    const c = Math.round((tage[d] - t0) / TAG_MS);
    if (c >= 0 && c < nSp) tagVonSpalte[c] = d;
  }
  const monatVonSpalte = Uint8Array.from({ length: nSp }, (_, c) => new Date(t0 + c * TAG_MS).getUTCMonth());
  const minProSlot = 1440 / slots;
  const gl = last.grundlast;
  const glSchwelle = 1.2 * gl;
  const stufe = new Uint8Array(nT * slots);
  let gueltig = 0;
  let unterGl = 0;
  for (let j = 0; j < stufe.length; j++) {
    const v = werte[j];
    if (Number.isFinite(v)) {
      stufe[j] = lastStufe(v, max);
      gueltig++;
      if (v <= glSchwelle) unterGl++;
    } else stufe[j] = 255;
  }
  const zelle = (t) => {
    const b = tagBeginn(t);
    return { sp: Math.round((b - t0) / TAG_MS), sl: Math.min(slots - 1, Math.floor((t - b) / (minProSlot * 60000))) };
  };
  const spitzen = last.monate.map((mo) => ({ ...zelle(mo.spitzeT), kw: mo.spitzeKw, t: mo.spitzeT, min: minutenVon(mo.spitzeT), key: `${mo.jahr}-${mo.monat}` }));
  const minuten = spitzen.map((s) => s.min);
  const minM = minuten.length ? Math.min(...minuten) : 0;
  const maxM = minuten.length ? Math.max(...minuten) : 0;
  // Band um die Uhrzeiten der Monatsspitzen: beim Beispiel genau 05:45–06:45 (06:00 − 15 min … 06:15 + 30 min)
  const band = minuten.length && maxM - minM <= 240 ? { von: Math.max(0, minM - 15), bis: Math.min(1440, maxM + 30) } : null;
  let sa = 0;
  let so = 0;
  let ft = 0;
  for (let d = 0; d < nT; d++) {
    if (typ[d] === 1) sa++;
    else if (typ[d] === 2) {
      if (new Date(tage[d]).getUTCDay() === 0) so++;
      else ft++;
    }
  }
  // Betriebsurlaub des synthetischen Beispiels (src/lib/lastgang/beispiel.js): 4.–15. August und zum
  // Jahreswechsel (24.–31. Dezember, 1.–6. Jänner). Für eigene Daten keine Behauptung über Ursachen.
  const urlaube = [];
  if (last.quelle === "beispiel") {
    const j = new Date(t0).getUTCFullYear();
    const sp = (mo, tag) => Math.round((Date.UTC(j, mo, tag) - t0) / TAG_MS);
    const kandidaten = [
      { von: sp(0, 1), bis: sp(0, 6), text: "Jahreswechsel", ausrichtung: "start" },
      { von: sp(7, 4), bis: sp(7, 15), text: "Betriebsurlaub", ausrichtung: "mitte" },
      { von: sp(11, 24), bis: sp(11, 31), text: "Jahreswechsel", ausrichtung: "ende" },
    ];
    for (const k of kandidaten) if (k.von >= 0 && k.bis < nSp) urlaube.push(k);
  }
  // Zeitumstellung im März: die Viertelstunden 02:00–02:45 Ortszeit gibt es nicht (NaN im Raster)
  let dst = null;
  const s2 = Math.floor(120 / minProSlot);
  const nDst = Math.max(1, Math.round(60 / minProSlot));
  for (let d = 0; d < nT && !dst; d++) {
    const dt = new Date(tage[d]);
    if (dt.getUTCMonth() !== 2 || dt.getUTCDay() !== 0 || dt.getUTCDate() < 25) continue;
    let leer = true;
    for (let s = s2; s < s2 + nDst; s++) if (Number.isFinite(werte[d * slots + s])) leer = false;
    if (leer) dst = { sp: Math.round((tage[d] - t0) / TAG_MS), sl: s2, n: nDst };
  }
  // Anker „Grundlast“: eine Nacht um 03:00 Anfang Juni (bzw. 42 % des Zeitraums)
  let glSp = Math.round(nSp * 0.42);
  for (let i = 0; i < 30 && tagVonSpalte[glSp] < 0; i++) glSp = Math.min(nSp - 1, glSp + 1);
  return {
    quelle: last.quelle,
    t0,
    nT,
    nSp,
    slots,
    minProSlot,
    tage,
    typ,
    werte,
    max,
    stufe,
    tagVonSpalte,
    monatVonSpalte,
    gl,
    glSchwelle,
    anteilGl: gueltig ? unterGl / gueltig : 0,
    spitze: { ...zelle(last.spitze.t), kw: last.spitze.kw, t: last.spitze.t, min: minutenVon(last.spitze.t) },
    spitzen,
    spanne: { min: minM, max: maxM },
    band,
    bandSl: band ? { von: Math.floor(band.von / minProSlot), bis: Math.ceil(band.bis / minProSlot) } : null,
    zaehl: { sa, so, ft },
    urlaube,
    dst,
    glAnker: { sp: glSp, sl: Math.min(slots - 1, Math.floor(180 / minProSlot)) },
    abschnitte: monatsAbschnitte(t0, nSp),
    werktag: last.tagesgang?.werktag || null,
    anteilFrei: last.anteilFrei,
    jahresverbrauch: last.jahresverbrauch,
    stundenUeber90: last.stundenUeber90,
    mittelMonatsspitze: last.mittelMonatsspitze,
  };
}

/**
 * Sonnen-Bilanz im Raster (kWh): genutzt, übrig, Verbrauch – dazu je Spalte (Tag) die Summen bis dahin
 * (Zähler beim Wischen) und die Anker „Sonne übrig“ / „Sonne trifft Schicht“.
 */
function sonnenBilanz(mod, pvRaster, kwp) {
  if (!mod || !pvRaster || !(kwp > 0)) return null;
  const { slots, werte, typ, nSp, tagVonSpalte } = mod;
  const h = mod.minProSlot / 60;
  const kumE = new Float64Array(nSp);
  const kumU = new Float64Array(nSp);
  let eigen = 0;
  let ueber = 0;
  let verbrauch = 0;
  let maxU = 0;
  let ankerU = null;
  let maxE = 0;
  let ankerE = null;
  for (let sp = 0; sp < nSp; sp++) {
    const d = tagVonSpalte[sp];
    if (d >= 0) {
      for (let s = 0; s < slots; s++) {
        const j = d * slots + s;
        const L = werte[j];
        if (!Number.isFinite(L)) continue;
        const P = pvRaster[j] * kwp;
        const e = Math.min(P, L);
        const u = P > L ? P - L : 0;
        eigen += e * h;
        ueber += u * h;
        verbrauch += L * h;
        if (u > maxU) {
          maxU = u;
          ankerU = { sp, sl: s };
        }
        if (typ[d] === 0 && e > maxE) {
          maxE = e;
          ankerE = { sp, sl: s };
        }
      }
    }
    kumE[sp] = eigen;
    kumU[sp] = ueber;
  }
  return { eigen, ueber, verbrauch, kumE, kumU, anker: { ueber: ankerU, eigen: ankerE } };
}

// ---------------------------------------------------------------------------------------------------
// Färben (eine Schleife, ≤ 3 ms) und Zeichnen
// ---------------------------------------------------------------------------------------------------

function faerben(mod, linse, pvRaster, kwp, hoch, ziel) {
  const { nSp, slots, stufe, werte, typ, tagVonSpalte, bandSl, glSchwelle } = mod;
  const out = new Uint32Array(ziel.buffer, ziel.byteOffset, ziel.length >> 2);
  out.fill(N950_P);
  // Index im Bild: quer (Tag = x, Viertelstunde = y) bzw. hochkant (Viertelstunde = x, Tag = y)
  const sx = hoch ? 1 : nSp;
  const sy = hoch ? slots : 1;
  const sonne = linse === "sonne" && pvRaster && kwp > 0;
  const voll = LUT.voll;
  const band = LUT.band;
  const werktag = LUT.werktag;
  const grund = LUT.grund;
  const bVon = bandSl ? bandSl.von : -1;
  const bBis = bandSl ? bandSl.bis : -1;
  for (let sp = 0; sp < nSp; sp++) {
    const d = tagVonSpalte[sp];
    if (d < 0) continue;
    const basis = d * slots;
    const zeile = sp * sy;
    if (linse === "jahr" || (linse === "freie-tage" && typ[d] > 0)) {
      for (let sl = 0; sl < slots; sl++) {
        const st = stufe[basis + sl];
        if (st !== 255) out[zeile + sl * sx] = voll[st];
      }
    } else if (linse === "freie-tage") {
      for (let sl = 0; sl < slots; sl++) {
        const st = stufe[basis + sl];
        if (st !== 255) out[zeile + sl * sx] = werktag[st];
      }
    } else if (linse === "schichtbeginn") {
      for (let sl = 0; sl < slots; sl++) {
        const st = stufe[basis + sl];
        if (st !== 255) out[zeile + sl * sx] = sl >= bVon && sl < bBis ? voll[st] : band[st];
      }
    } else if (linse === "grundlast") {
      for (let sl = 0; sl < slots; sl++) {
        const st = stufe[basis + sl];
        if (st !== 255) out[zeile + sl * sx] = werte[basis + sl] <= glSchwelle ? N300_P : grund[st];
      }
    } else {
      // Sonne: Grünanteil = min(pv, Last) / Last – LINEAR (ehrlich, passt zur Autarkie daneben);
      // Überschuss (pv > 1,05 × Last) von Grün Richtung Gelb nach (pv − Last) / pv
      for (let sl = 0; sl < slots; sl++) {
        const j = basis + sl;
        const st = stufe[j];
        if (st === 255) continue;
        const L = werte[j];
        const P = sonne ? pvRaster[j] * kwp : 0;
        let farbe;
        if (P > 1.05 * L && P > 0) farbe = UEBER_LUT[((P - L) / P) * 64 + 0.5 | 0];
        else {
          const k = st * 3;
          let r = SONNE_GRUND[k];
          let g = SONNE_GRUND[k + 1];
          let b = SONNE_GRUND[k + 2];
          if (P > 0 && L > 0) {
            const c = P < L ? P / L : 1;
            r += (OV[0] - r) * c;
            g += (OV[1] - g) * c;
            b += (OV[2] - b) * c;
          }
          farbe = LE ? ((255 << 24) | ((b | 0) << 16) | ((g | 0) << 8) | (r | 0)) >>> 0 : (((r | 0) << 24) | ((g | 0) << 16) | ((b | 0) << 8) | 255) >>> 0;
        }
        out[zeile + sl * sx] = farbe;
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------------
// Texte
// ---------------------------------------------------------------------------------------------------

function ablesung(mod, sp, sl, sonne, pvRaster, kwp) {
  const t = mod.t0 + sp * TAG_MS;
  const zeit = uhrzeit(sl * mod.minProSlot);
  const d = mod.tagVonSpalte[sp];
  const v = d >= 0 ? mod.werte[d * mod.slots + sl] : NaN;
  if (!Number.isFinite(v)) {
    // Letzter Sonntag im März, 02:00–02:45: Sommerzeit – diese Viertelstunden gibt es in Ortszeit nicht
    const dt = new Date(t);
    const umstellung = dt.getUTCMonth() === 2 && dt.getUTCDay() === 0 && dt.getUTCDate() >= 25 && Math.floor((sl * mod.minProSlot) / 60) === 2;
    const grund = umstellung ? "keine Daten (Zeitumstellung)" : "keine Daten";
    return { kurz: `${datumKurz(t)} · ${zeit} · ${grund}`, lang: `${datumLang(t)}, ${zeit} Uhr: ${grund}`, d };
  }
  let kurz = `${datumKurz(t)} · ${zeit} · ${zahl(v)} kW`;
  let lang = `${datumLang(t)}, ${zeit} Uhr: ${zahl(v)} Kilowatt`;
  if (sonne && pvRaster && kwp > 0) {
    const p = pvRaster[d * mod.slots + sl] * kwp;
    kurz += ` · Sonne ${zahl(p)} kW`;
    lang += `, Sonne ${zahl(p)} Kilowatt`;
  }
  return { kurz, lang, d };
}

function satzFuer(linse, mod, eigen) {
  const s = mod.spitze;
  if (linse === "jahr") {
    const beimStart = !eigen && mod.band && s.min >= mod.band.von && s.min < mod.band.bis;
    return eigen
      ? `Ihre Jahresspitze: ${zahl(s.kw)} kW am ${datumSatz(s.t)} um ${uhrzeit(s.min)}.`
      : `Jahresspitze ${zahl(s.kw)} kW am ${datumSatz(s.t)} um ${uhrzeit(s.min)}${beimStart ? " – beim Schichtbeginn" : ""}.`;
  }
  if (linse === "schichtbeginn") {
    const n = mod.spitzen.length;
    const von = uhrzeit(mod.spanne.min);
    const bis = uhrzeit(mod.spanne.max);
    if (n < 2) return `Die Monatsspitze liegt um ${von} Uhr.`;
    if (mod.spanne.max - mod.spanne.min <= 60) return von === bis ? `Alle ${n} Monatsspitzen liegen um ${von} Uhr.` : `Alle ${n} Monatsspitzen liegen zwischen ${von} und ${bis} Uhr.`;
    return `${eigen ? "Ihre" : "Die"} Monatsspitzen verteilen sich auf ${von} bis ${bis} Uhr.`;
  }
  if (linse === "freie-tage") return `${prozent(mod.anteilFrei)} ${eigen ? "Ihres Stroms fließen" : "des Stroms fließen"} an Samstagen, Sonn- und Feiertagen.`;
  if (linse === "grundlast") {
    if (!(mod.gl >= 1)) return "Ihre Grundlast liegt bei ≈ 0 kW – nachts ruht der Verbrauch fast ganz.";
    return eigen
      ? `Nachts läuft Ihr Betrieb nie auf null: Grundlast ≈ ${zahl(mod.gl)} kW.`
      : `Nachts läuft der Betrieb nie auf null: Grundlast ≈ ${zahl(mod.gl)} kW (im Beispiel IT, Kühlung, Druckluft).`;
  }
  return eigen
    ? "Grün zeigt, wo Sonne und Ihr Verbrauch sich treffen – Gelb, wann Sonne übrig bliebe."
    : "Sonne und Schicht treffen sich werktags mittags – an Wochenenden, Feiertagen und im Betriebsurlaub bleibt Sonne übrig.";
}

// ---------------------------------------------------------------------------------------------------
// Bausteine der Bühne
// ---------------------------------------------------------------------------------------------------

const EIN = { duration: BEWEGUNG.dauer.mittel, ease: BEWEGUNG.ease.aus };
const FADE = `opacity ${BEWEGUNG.dauer.mittel}s ${BEWEGUNG.css.aus}`;
const AUGENBRAUE = "text-[12.5px] font-semibold uppercase tracking-[0.16em] text-white/55";

/** Runde auf 1-2-5-Stufen (52 → 50, 104 → 100, 208 → 200) – Skalenmarken der Legende. */
function runde125(v) {
  if (!(v > 0)) return 0;
  const k = Math.pow(10, Math.floor(Math.log10(v)));
  const q = v / k;
  return (q < 1.5 ? 1 : q < 3.5 ? 2 : q < 7.5 ? 5 : 10) * k;
}

/**
 * Seite und Verschiebung eines Etiketts – EINE Rechnung für Darstellung und Ausweich-Logik.
 * Rand-Etiketten (x > 86 % bzw. < 14 %) werden rechts- bzw. linksbündig angeschlagen.
 */
function etikettLage(seite, x, y, betont) {
  let s = seite;
  if (s === "oben2" && y < 24) s = "unten";
  else if (s === "oben" && y < 16) s = "unten";
  else if (s === "unten" && y > 84) s = "oben";
  let tx = "-50%";
  let ty = "-50%";
  let buendig = "mitte";
  const abstand = betont ? 14 : 10;
  if (s === "oben" || s === "unten" || s === "oben2") {
    // oben2: zweite Reihe über der ersten – für drei dicht stehende Monatsspitzen (z. B. Okt–Dez bei 1024 px)
    ty = s === "oben" ? `calc(-100% - ${abstand}px)` : s === "oben2" ? `calc(-200% - ${abstand + 6}px)` : `${abstand}px`;
    if (x > 86) {
      tx = "calc(-100% + 12px)";
      buendig = "rechts";
    } else if (x < 14) {
      tx = "-12px";
      buendig = "links";
    }
  } else if (s === "rechts") tx = "10px";
  else if (s === "rechts2") tx = "calc(18px + 9.5em)";
  else tx = "calc(-100% - 10px)";
  return { s, tx, ty, buendig };
}

/** Horizontale Ausdehnung [links, rechts] in px eines Etiketts oben/unten – wie etikettLage es setzt. */
function etikettSpanne(px, breite, buendig) {
  if (buendig === "rechts") return [px - breite + 12, px + 12];
  if (buendig === "links") return [px - 12, px - 12 + breite];
  return [px - breite / 2, px + breite / 2];
}

/** Direktbeschriftung (HTML) an einem Punkt in Prozent der Fläche. */
function Etikett({ x, y, seite = "oben", betont = false, leise = false, verz = 0, ruhig, children, testid, daten }) {
  const { s, tx, ty } = etikettLage(seite, x, y, betont);
  return (
    <m.span
      data-testid={testid}
      {...daten}
      className={cn(
        "ov-num pointer-events-none absolute z-[2] whitespace-nowrap rounded-md px-1.5 py-[3px] font-semibold leading-none shadow-[0_2px_8px_rgba(3,18,43,0.45)]",
        betont ? "bg-white text-[11.5px] text-navy-950" : leise ? "bg-navy-950/90 text-[11px] font-medium text-white/85" : "bg-navy-950/85 text-[11px] text-white"
      )}
      style={{ left: `${x}%`, top: `${y}%`, translate: `${tx} ${ty}` }}
      initial={ruhig ? false : { opacity: 0, y: s === "unten" ? -4 : 4 }}
      animate={{ opacity: 1, y: 0, transition: { ...EIN, delay: ruhig ? 0 : verz } }}
      exit={{ opacity: 0, transition: { duration: BEWEGUNG.dauer.kurz } }}
    >
      {children}
    </m.span>
  );
}

/**
 * Zeitspanne als Klammer (Betriebsurlaub): quer oben über den Spalten, hochkant rechts neben den Zeilen.
 * ausrichtung: Beschriftung mittig bzw. am Anfang/Ende (Spannen am Rand des Jahres).
 */
function Spanne({ von, bis, n, hoch, ruhig, verz = 0.15, ausrichtung = "mitte", children }) {
  const a = (von / n) * 100;
  const b = ((bis + 1) / n) * 100;
  const etikett = hoch
    ? ausrichtung === "start"
      ? "right-3 top-0"
      : ausrichtung === "ende"
        ? "right-3 bottom-0"
        : "right-3 top-1/2 -translate-y-1/2"
    : ausrichtung === "start"
      ? "left-0 top-2.5"
      : ausrichtung === "ende"
        ? "right-0 top-2.5"
        : "left-1/2 top-2.5 -translate-x-1/2";
  return (
    <m.span
      className="pointer-events-none absolute z-[2]"
      data-testid="k1-urlaub"
      style={hoch ? { top: `${a}%`, height: `${b - a}%`, right: 6, width: 8 } : { left: `${a}%`, width: `${b - a}%`, top: 6, height: 8 }}
      initial={ruhig ? false : { opacity: 0 }}
      animate={{ opacity: 1, transition: { ...EIN, delay: ruhig ? 0 : verz } }}
      exit={{ opacity: 0, transition: { duration: BEWEGUNG.dauer.kurz } }}
    >
      <span className={cn("absolute bg-white/70", hoch ? "inset-y-0 right-0 w-px" : "inset-x-0 top-0 h-px")} />
      <span className={cn("absolute bg-white/70", hoch ? "right-0 top-0 h-px w-2" : "left-0 top-0 h-2 w-px")} />
      <span className={cn("absolute bg-white/70", hoch ? "bottom-0 right-0 h-px w-2" : "right-0 top-0 h-2 w-px")} />
      <span className={cn("absolute whitespace-nowrap rounded-md bg-navy-950/85 px-1.5 py-[3px] text-[11px] font-semibold leading-none text-white", etikett)}>{children}</span>
    </m.span>
  );
}

/**
 * Beschriftungen und Marken je Linse (SVG-Kreise + HTML-Etiketten). Memo: Fadenkreuz-Bewegung rendert sie
 * nicht neu. takt = { dauer } während Einblenden bzw. Sonnen-Wisch: Jede Marke erscheint genau dann, wenn
 * die Kante ihre Spalte (quer) bzw. Zeile (hochkant) erreicht.
 */
const LinsenEbene = memo(function LinsenEbene({ linse, mod, hoch, mass, bilanz, ruhig, eigen, takt }) {
  const pos = (sp, sl) =>
    hoch ? { x: ((sl + 0.5) / mod.slots) * 100, y: ((sp + 0.5) / mod.nSp) * 100 } : { x: ((sp + 0.5) / mod.nSp) * 100, y: ((sl + 0.5) / mod.slots) * 100 };
  // Verzögerung: im Takt der Kante, sonst kurzer Versatz
  const verz = (anteil, extra = 0, i = 0) => (takt ? KURVE.zeit(Math.min(1, Math.max(0, anteil))) * takt.dauer + extra : 0.1 + extra + i * BEWEGUNG.versatz);
  const lauf = (p) => (hoch ? p.y : p.x) / 100;
  const r = hoch ? 5 : 6;
  const kreise = [];
  const etiketten = [];
  const rahmen = [];

  if (linse === "jahr") {
    // Die zwölf Monatsspitzen als kleine Punkte – ohne Etikett; sie stehen alle auf einer Linie (06:00)
    mod.spitzen.forEach((s, i) => {
      if (s.t === mod.spitze.t) return;
      const p = pos(s.sp, s.sl);
      kreise.push({ key: `m-${s.key}`, ...p, r: hoch ? 2.75 : 3.25, rand: 1.25, farbe: FARBE.sun500, verz: verz(lauf(p), 0, i), testid: "monatsspitze-jahr", zeit: uhrzeit(s.min) });
    });
    const p = pos(mod.spitze.sp, mod.spitze.sl);
    kreise.push({ key: "jahr", ...p, r: r + 1.5, farbe: FARBE.sun500, verz: verz(lauf(p)) });
    etiketten.push({
      key: "jahr",
      ...p,
      seite: hoch ? "rechts" : "oben",
      betont: true,
      verz: verz(lauf(p), 0.08),
      text: `Jahresspitze ${zahl(mod.spitze.kw)} kW · ${uhrzeit(mod.spitze.min)}`,
      testid: "jahresspitze",
      daten: { "data-zeit": uhrzeit(mod.spitze.min), "data-kw": Math.round(mod.spitze.kw) },
    });
    if (mod.dst) {
      const { sp, sl, n } = mod.dst;
      const box = hoch
        ? { x: (sl / mod.slots) * 100, y: (sp / mod.nSp) * 100, w: (n / mod.slots) * 100, h: (1 / mod.nSp) * 100 }
        : { x: (sp / mod.nSp) * 100, y: (sl / mod.slots) * 100, w: (1 / mod.nSp) * 100, h: (n / mod.slots) * 100 };
      const mitte = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
      rahmen.push({ key: "dst", ...box, verz: verz(lauf(mitte)) });
      const schmal = mass.w > 0 && mass.w < 300;
      etiketten.push({
        key: "dst",
        x: hoch ? box.x + box.w : box.x + box.w,
        y: mitte.y,
        seite: "rechts",
        leise: true,
        verz: verz(lauf(mitte), 0.08),
        text: schmal ? "Zeitumstellung: Stunde fehlt" : "Zeitumstellung – diese Stunde gibt es nicht",
        testid: "k1-zeitumstellung",
      });
    }
  }
  if (linse === "schichtbeginn") {
    const sortiert = mod.spitzen.map((p) => ({ ...p, ...pos(p.sp, p.sl) })).sort((a, b) => (hoch ? a.y - b.y : a.x - b.x));
    // Ausweichen: je Seite merken, wo das letzte Etikett endet; bevorzugt oben (quer) bzw. rechts (hochkant).
    // Dieselbe Verschiebung wie in der Darstellung (Rand-Etiketten bündig) und die gemessene Breite.
    const seiten = hoch ? ["rechts", "rechts2"] : ["oben", "unten", "oben2"];
    const ende = Object.fromEntries(seiten.map((x) => [x, -Infinity]));
    const LUECKE = 6;
    // Quer unter 900 px Breite reicht der Platz nicht für zwölf „301 kW · 06:15“: dann nur die kW-Zahl
    // (Einheit in der Legende, Uhrzeit liest man an der Zeile ab)
    const knapp = !hoch && mass.w > 0 && mass.w < 900;
    sortiert.forEach((p, i) => {
      const jahresSpitze = p.t === mod.spitze.t;
      const text = knapp ? (jahresSpitze ? `${zahl(p.kw)} kW` : zahl(p.kw)) : `${zahl(p.kw)} kW · ${uhrzeit(p.min)}`;
      let seite = seiten[0];
      if (hoch) {
        const py = (p.y / 100) * mass.h;
        const a = py - 10;
        if (a < ende[seiten[0]] + LUECKE) seite = a >= ende[seiten[1]] + LUECKE || ende[seiten[1]] < ende[seiten[0]] ? seiten[1] : seiten[0];
        ende[seite] = py + 10;
      } else {
        // erste freie Reihe in der Reihenfolge oben → unten → oben2; sind alle belegt, die mit der kleinsten Überdeckung
        const px = (p.x / 100) * mass.w;
        const breite = textBreite(text, jahresSpitze ? 11.5 : 11) + 12;
        const lagen = seiten.map((sx) => ({ sx, sp: etikettSpanne(px, breite, etikettLage(sx, p.x, p.y, jahresSpitze).buendig) }));
        const frei = lagen.find((lg) => lg.sp[0] >= ende[lg.sx] + LUECKE);
        const wahl = frei || lagen.reduce((a, b) => (ende[b.sx] - b.sp[0] < ende[a.sx] - a.sp[0] ? b : a));
        seite = wahl.sx;
        ende[seite] = wahl.sp[1];
      }
      kreise.push({ key: p.key, x: p.x, y: p.y, r: jahresSpitze ? r + 1.5 : r, farbe: FARBE.sun500, verz: verz(lauf(p), 0, i), zeit: uhrzeit(p.min), testid: "monatsspitze-punkt" });
      etiketten.push({
        key: p.key,
        x: p.x,
        y: p.y,
        seite,
        betont: jahresSpitze,
        verz: verz(lauf(p), 0.06, i),
        text,
        testid: "monatsspitze",
        daten: { "data-zeit": uhrzeit(p.min), "data-kw": Math.round(p.kw) },
      });
    });
  }
  if (linse === "grundlast" && mod.gl >= 1) {
    const p = pos(mod.glAnker.sp, mod.glAnker.sl);
    kreise.push({ key: "gl", x: p.x, y: p.y, r: r - 1, farbe: FARBE.navy300, verz: verz(lauf(p)) });
    etiketten.push({ key: "gl", x: p.x, y: p.y, seite: hoch ? "rechts" : "unten", verz: verz(lauf(p), 0.06), text: `Grundlast ≈ ${zahl(mod.gl)} kW` });
  }
  if (linse === "sonne" && bilanz) {
    const { ueber, eigen: e } = bilanz.anker;
    const pe = e ? pos(e.sp, e.sl) : null;
    const pu = ueber ? pos(ueber.sp, ueber.sl) : null;
    // quer: die beiden Etiketten zeigen voneinander weg (liegen die Anker dicht beieinander, treffen sie sich sonst)
    const eOben = pe && pu ? pe.y <= pu.y : false;
    if (pe) {
      kreise.push({ key: "se", x: pe.x, y: pe.y, r: r - 1, farbe: FARBE.ov400, verz: verz(lauf(pe)) });
      etiketten.push({ key: "se", x: pe.x, y: pe.y, seite: hoch ? "links" : eOben ? "oben" : "unten", verz: verz(lauf(pe), 0.06), text: eigen ? "Sonne trifft Last" : "Sonne trifft Schicht" });
    }
    if (pu) {
      kreise.push({ key: "su", x: pu.x, y: pu.y, r: r - 1, farbe: FARBE.sun300, verz: verz(lauf(pu)) });
      etiketten.push({ key: "su", x: pu.x, y: pu.y, seite: hoch ? "rechts" : eOben ? "unten" : "oben", verz: verz(lauf(pu), 0.06), text: "Sonne übrig" });
    }
  }
  const bandLinien = linse === "schichtbeginn" && mod.bandSl ? [mod.bandSl.von, mod.bandSl.bis].map((sl) => (sl / mod.slots) * 100) : [];
  const urlaub = mod.urlaube.length > 0 && (linse === "jahr" || linse === "freie-tage" || linse === "sonne");

  return (
    <>
      <svg className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible" aria-hidden="true">
        {bandLinien.map((v, i) =>
          hoch ? (
            <line key={i} x1={`${v}%`} x2={`${v}%`} y1="0" y2="100%" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="3 3" />
          ) : (
            <line key={i} x1="0" x2="100%" y1={`${v}%`} y2={`${v}%`} stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="3 3" />
          )
        )}
        {kreise.map((k) => (
          <m.circle
            key={k.key}
            cx={`${k.x}%`}
            cy={`${k.y}%`}
            fill={k.farbe}
            stroke="#ffffff"
            strokeWidth={k.rand || 2}
            data-testid={k.testid}
            data-zeit={k.zeit}
            initial={ruhig ? false : { r: 0, opacity: 0 }}
            animate={{ r: k.r, opacity: 1, transition: { ...EIN, delay: ruhig ? 0 : k.verz } }}
            exit={{ opacity: 0, transition: { duration: BEWEGUNG.dauer.kurz } }}
          />
        ))}
      </svg>
      {rahmen.map((b) => (
        <m.span
          key={b.key}
          aria-hidden="true"
          className="pointer-events-none absolute z-[2] rounded-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.75)]"
          style={{ left: `calc(${b.x}% - 3px)`, top: `calc(${b.y}% - 3px)`, width: `calc(${b.w}% + 6px)`, height: `calc(${b.h}% + 6px)` }}
          initial={ruhig ? false : { opacity: 0 }}
          animate={{ opacity: 1, transition: { ...EIN, delay: ruhig ? 0 : b.verz } }}
          exit={{ opacity: 0, transition: { duration: BEWEGUNG.dauer.kurz } }}
        />
      ))}
      {etiketten.map((e) => (
        <Etikett key={e.key} x={e.x} y={e.y} seite={e.seite} betont={e.betont} leise={e.leise} verz={e.verz} ruhig={ruhig} testid={e.testid} daten={e.daten}>
          {e.text}
        </Etikett>
      ))}
      {urlaub &&
        mod.urlaube.map((u) => (
          <Spanne
            key={`${u.von}-${u.text}`}
            von={u.von}
            bis={u.bis}
            n={mod.nSp}
            hoch={hoch}
            ruhig={ruhig}
            ausrichtung={u.ausrichtung}
            verz={verz((u.von + 0.5) / mod.nSp, 0.04)}
          >
            {u.text}
          </Spanne>
        ))}
    </>
  );
});

/** Legende und Kennwert je Linse (Zeile unter dem Teppich). */
const LinsenLegende = memo(function LinsenLegende({ linse, mod, pvLaedt, sonnenQuelle }) {
  const chip = (farbe, text, form = "rund") => (
    <span className="inline-flex items-center gap-2 text-[13px] font-medium text-white/80">
      <span aria-hidden="true" className={cn("inline-block shrink-0", form === "rund" ? "h-2.5 w-2.5 rounded-full" : "h-2.5 w-4 rounded-[3px]", farbe)} />
      <span>{text}</span>
    </span>
  );
  let links = null;
  let rechts = null;
  if (linse === "jahr") {
    const ticks = [...new Set([1 / 6, 1 / 3, 2 / 3].map((f) => runde125(mod.max * f)))].filter((v) => v > 0 && v < mod.max * 0.92).map((v) => ({ v, p: Math.sqrt(v / mod.max) * 100 }));
    links = (
      <span className="inline-flex items-center gap-3 text-[13px] font-medium text-white/80">
        <span className="ov-num text-white/60">0</span>
        <span className="relative h-2.5 w-40 rounded-full bg-[linear-gradient(90deg,#03122b,#003473_25%,#4a7cbd_50%,#b2cbe9_75%,#ffffff)] shadow-[0_0_0_1px_rgba(255,255,255,0.12)] sm:w-48">
          {ticks.map((t) => (
            <span key={t.v} className="ov-num absolute top-3.5 -translate-x-1/2 text-[10.5px] text-white/55" style={{ left: `${t.p}%` }}>
              {t.v}
            </span>
          ))}
        </span>
        <span className="ov-num whitespace-nowrap">{zahl(mod.max)} kW</span>
      </span>
    );
    rechts = Number.isFinite(mod.stundenUeber90) ? (
      <>
        Über 90 % der Spitze (&gt; {zahl(mod.max * 0.9)} kW): nur <span className="ov-num font-semibold text-white">{zahl(mod.stundenUeber90, 1)} h</span> im Jahr
      </>
    ) : null;
  } else if (linse === "schichtbeginn") {
    links = (
      <span className="flex flex-wrap gap-x-5 gap-y-1.5">
        <span className="inline-flex items-center gap-2 text-[13px] font-medium text-white/80">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-sun-500 ring-2 ring-white" />
          Monatsspitze in kW
        </span>
        {mod.band && chip("bg-navy-200", `hell: ${uhrzeit(mod.band.von)}–${uhrzeit(mod.band.bis)}`, "eckig")}
      </span>
    );
    rechts = (
      <>
        Mittel der Monatsspitzen <span className="ov-num font-semibold text-white">{zahl(mod.mittelMonatsspitze, 1)} kW</span>
      </>
    );
  } else if (linse === "freie-tage") {
    links = (
      <span className="flex flex-wrap gap-x-5 gap-y-1.5">
        {chip(
          "bg-[linear-gradient(90deg,#1f5aa1,#b2cbe9)]",
          <>
            <span className="sm:hidden">Sa, So, Feiertag</span>
            <span className="hidden sm:inline">Samstag, Sonn- und Feiertag</span>
          </>,
          "eckig"
        )}
        {chip(
          "bg-navy-800",
          <>
            Werktag <span className="hidden sm:inline">(abgedunkelt)</span>
            <span className="sm:hidden">(gedimmt)</span>
          </>,
          "eckig"
        )}
      </span>
    );
    rechts = (
      <span className="ov-num">
        {mod.zaehl.sa} Samstage · {mod.zaehl.so} Sonntage · {mod.zaehl.ft} Feiertage
      </span>
    );
  } else if (linse === "grundlast") {
    links = chip("bg-navy-300", `bis 1,2 × Grundlast (≤ ${zahl(mod.glSchwelle)} kW)`, "eckig");
    const sockel = mod.jahresverbrauch > 0 ? (mod.gl * 8760) / mod.jahresverbrauch : NaN;
    rechts = (
      <>
        in <span className="ov-num font-semibold text-white">{prozent(mod.anteilGl)}</span> aller Viertelstunden
        {Number.isFinite(sockel) && sockel <= 1 && (
          <>
            {" "}· Grundlast × 8.760 h ≈ <span className="ov-num font-semibold text-white">{prozent(sockel)}</span> des Jahresverbrauchs
          </>
        )}
      </>
    );
  } else if (linse === "sonne") {
    links = (
      <span className="flex flex-wrap gap-x-4 gap-y-1.5 md:gap-x-5">
        {chip(
          "bg-ov-400",
          <>
            <span className="hidden sm:inline">Sonne </span>genutzt
          </>,
          "eckig"
        )}
        {chip(
          "bg-sun-300",
          <>
            <span className="hidden sm:inline">Sonne </span>übrig
          </>,
          "eckig"
        )}
        {chip("bg-[linear-gradient(90deg,#071a3a,#13325f)]", "Netzbezug", "eckig")}
      </span>
    );
    rechts = (
      <QuellePille dunkel className="text-left">
        {sonnenQuelle}
        {pvLaedt ? " · wird neu gerechnet …" : ""}
      </QuellePille>
    );
  }
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-8">
      <div className="min-w-0 pb-1 md:pb-0">{links}</div>
      {rechts && <div className="min-w-0 text-[13px] leading-snug text-white/65 md:max-w-[56%] md:text-right">{rechts}</div>}
    </div>
  );
});

/** Tagesverlauf des gewählten Tags (dieser Tag, Ø Werktag, in der Linse Sonne PV genutzt/übrig). */
const Tagesprofil = memo(function Tagesprofil({ mod, d, sl, sonne, pvRaster, kwp }) {
  const S = mod.slots;
  const ymax = mod.max * 1.06;
  const y = (v) => 100 - (Math.max(0, v) / ymax) * 100;
  const xs = (s) => (s + 0.5).toFixed(2);
  let linie = "";
  let wert = NaN;
  let pvFl = "";
  let eigenFl = "";
  if (d >= 0) {
    for (let s = 0; s < S; s++) {
      const v = mod.werte[d * S + s];
      if (!Number.isFinite(v)) continue;
      linie += `${linie ? "L" : "M"}${xs(s)},${y(v).toFixed(1)}`;
      if (s === sl) wert = v;
    }
    if (sonne && pvRaster && kwp > 0) {
      let ob = "";
      let oe = "";
      for (let s = 0; s < S; s++) {
        const L = mod.werte[d * S + s];
        const P = pvRaster[d * S + s] * kwp;
        ob += `L${xs(s)},${y(P).toFixed(1)}`;
        oe += `L${xs(s)},${y(Number.isFinite(L) ? Math.min(P, L) : 0).toFixed(1)}`;
      }
      pvFl = `M0.5,100${ob}L${xs(S - 1)},100Z`;
      eigenFl = `M0.5,100${oe}L${xs(S - 1)},100Z`;
    }
  }
  let wtLinie = "";
  if (mod.werktag) {
    for (let s = 0; s < mod.werktag.length; s++) {
      const v = mod.werktag[s];
      if (Number.isFinite(v)) wtLinie += `${wtLinie ? "L" : "M"}${xs(s)},${y(v).toFixed(1)}`;
    }
  }
  return (
    <div className="mt-3">
      <div className="relative">
        <svg viewBox={`0 0 ${S} 100`} preserveAspectRatio="none" className="block h-[44px] w-full overflow-visible md:h-[72px]" aria-hidden="true">
          <line x1="0" x2={S} y1="100" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={S * f} x2={S * f} y1="0" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          {pvFl && <path d={pvFl} fill={FARBE.sun300} fillOpacity="0.9" />}
          {eigenFl && <path d={eigenFl} fill={FARBE.ov400} fillOpacity="0.95" />}
          {wtLinie && <path d={wtLinie} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />}
          {linie && <path d={linie} fill="none" stroke={FARBE.navy300} strokeWidth="1.75" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
          <line x1={xs(sl)} x2={xs(sl)} y1="0" y2="100" stroke="rgba(255,255,255,0.6)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        {Number.isFinite(wert) && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-navy-950"
            style={{ left: `${((sl + 0.5) / S) * 100}%`, top: `${y(wert)}%` }}
          />
        )}
      </div>
      <div className="mt-1.5 hidden justify-between text-[10.5px] text-white/55 md:flex" aria-hidden="true">
        <span className="ov-num">00</span>
        <span className="ov-num">06</span>
        <span className="ov-num">12</span>
        <span className="ov-num">18</span>
        <span className="ov-num">24</span>
      </div>
    </div>
  );
});

/**
 * Sonnen-Bilanz über dem Erkenntnis-Satz: „genutzt“ und „übrig“ groß, in den Bedeutungsfarben der Zellen.
 * live = true während des Wischens: Die Zahlen schreibt die Bild-Schleife direkt in die (von React leer
 * gelassenen) Spans – kein Re-Render je Bild, keine Ansage-Flut (aria-hidden; die Endwerte stehen danach da).
 */
function SonnenBilanz({ bilanz, eigen, ganzesJahr, live, refE, refU }) {
  const ertrag = bilanz.eigen + bilanz.ueber;
  const autarkie = bilanz.verbrauch > 0 ? bilanz.eigen / bilanz.verbrauch : NaN;
  const uebAnteil = ertrag > 0 ? bilanz.ueber / ertrag : NaN;
  const textE = zahl(bilanz.eigen / 1000);
  const textU = zahl(bilanz.ueber / 1000);
  const posten = (farbe, label, text, ref, unter, testid) => (
    <div className="min-w-0">
      <dt className="flex items-center gap-2 text-[12.5px] font-medium text-white/70 md:text-[13px]">
        <span aria-hidden="true" className={cn("inline-block h-2.5 w-4 shrink-0 rounded-[3px]", farbe === "eigen" ? "bg-ov-400" : "bg-sun-300")} />
        {label}
      </dt>
      <dd className="mt-1.5">
        <span className={cn("ov-num block whitespace-nowrap font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] md:text-[34px]", farbe === "eigen" ? "text-ov-300" : "text-sun-300")}>
          {/* feste, rechtsbündige Zahlenbox: beim Hochzählen rückt die Einheit nicht (keine Layout-Verschiebung) */}
          <span className="inline-flex items-baseline justify-end" style={{ minWidth: `calc(${text.length}ch + 0.5em)` }}>
            <span className="mr-1 text-[0.55em] font-bold text-white/60">≈</span>
            {live ? (
              <span key="live" ref={ref} aria-hidden="true" className="empty:before:content-['0']" />
            ) : (
              <span key="fest" data-testid={testid}>
                {text}
              </span>
            )}
          </span>
          <span className="ml-1 text-[0.55em] font-bold text-white/60">MWh</span>
        </span>
        <span className={cn("mt-1.5 block text-[12px] leading-snug text-white/60 transition-opacity duration-300 md:text-[12.5px]", live ? "opacity-0" : "opacity-100")}>{unter}</span>
      </dd>
    </div>
  );
  return (
    <div data-testid="k1-sonnenbilanz" data-live={live ? "true" : "false"}>
      <dl className="grid max-w-[440px] grid-cols-2 gap-x-6">
        {posten(
          "eigen",
          "Sonne genutzt",
          textE,
          refE,
          <>
            {prozent(autarkie)} des <span className="max-[359px]:hidden">{ganzesJahr ? "Jahresverbrauchs" : "Verbrauchs im Zeitraum"}</span>
            <span className="min-[360px]:hidden">Verbrauchs</span>
          </>,
          "k1-genutzt"
        )}
        {posten(
          "ueber",
          "Sonne übrig",
          textU,
          refU,
          <>
            {prozent(uebAnteil)} des <span className="max-[359px]:hidden">Sonnenertrags</span>
            <span className="min-[360px]:hidden">Ertrags</span>
          </>,
          "k1-uebrig"
        )}
      </dl>
    </div>
  );
}

const groesse = (b) => (b >= 1024 * 1024 ? `${zahl(b / 1024 / 1024, 1)} MB` : `${zahl(Math.max(1, b / 1024))} KB`);
const KNOPF_GRUEN = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700";
const KNOPF_HELL = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-[15px] font-semibold text-navy-950 transition-colors hover:bg-ov-50";
const KNOPF_LEISE = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-white/15";

/** Stand der eigenen Datei direkt am Teppich (gleicher Ablauf wie im Panel, ./K1Ablage.js). */
function AblageStatus({ phase, datei, fehler, freigegeben, geradeBestaetigt, starten, dateiWaehlen }) {
  if (phase === "leer") {
    if (!geradeBestaetigt) return null;
    return (
      <div role="status" className="mt-5 rounded-2xl bg-white/[0.06] p-4 md:p-5">
        <p className="text-[14px] leading-snug text-ov-200">E-Mail bestätigt. Wählen Sie Ihre Datei noch einmal – die Auswertung startet sofort.</p>
        <button type="button" onClick={dateiWaehlen} className={cn(KNOPF_HELL, "mt-3 w-full sm:w-auto")}>
          <FileUp aria-hidden="true" className="h-4 w-4" />
          CSV-Datei wählen
        </button>
      </div>
    );
  }
  return (
    <div data-testid="k1-ablage-status" data-phase={phase} className="mt-5 rounded-2xl bg-white/[0.06] p-4 md:p-5">
      {datei && (
        <p className="flex min-w-0 items-center gap-3 text-[14px] text-white">
          <FileSpreadsheet aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-300" />
          <span className="min-w-0 flex-1 truncate font-semibold">{datei.name}</span>
          <span className="ov-num shrink-0 text-white/55">{groesse(datei.size)}</span>
        </p>
      )}
      {phase === "gewaehlt" && (
        <>
          <button type="button" onClick={starten} data-testid="k1-ablage-auswerten" className={cn(KNOPF_GRUEN, "mt-4 w-full sm:w-auto")}>
            {freigegeben ? "Jetzt auswerten" : "E-Mail bestätigen und auswerten"}
          </button>
          <p className="mt-2.5 text-[12.5px] leading-snug text-white/60">Gelesen wird die Datei erst nach Ihrer Bestätigung – und nur hier im Browser.</p>
        </>
      )}
      {(phase === "dialog" || phase === "wartet") && !freigegeben && (
        <div role="status" className="mt-3">
          <p className="text-[13.5px] leading-snug text-white/75">
            {phase === "dialog" ? "Bestätigung läuft im Dialog." : "Noch nicht freigeschaltet – E-Mail bestätigen, dann startet die Auswertung hier automatisch."}
          </p>
          {phase === "wartet" && (
            <button type="button" onClick={starten} data-testid="k1-ablage-bestaetigen" className={cn(KNOPF_GRUEN, "mt-3 w-full sm:w-auto")}>
              E-Mail bestätigen
            </button>
          )}
        </div>
      )}
      {phase === "rechnet" && (
        <p role="status" className="mt-3 text-[13.5px] font-medium text-white/80">
          Ihr Lastgang wird ausgewertet …
        </p>
      )}
      {phase === "fehler" && (
        <p role="status" className="mt-3 rounded-xl bg-white/[0.07] px-3 py-2.5 text-[13.5px] leading-snug text-white">
          {fehler} Das Beispiel bleibt stehen.
        </p>
      )}
      {phase !== "rechnet" && (
        <button type="button" onClick={dateiWaehlen} className="mt-2 inline-flex min-h-11 items-center text-[13.5px] font-semibold text-white/70 underline underline-offset-4 hover:text-white">
          Andere Datei wählen
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------
// Bühne
// ---------------------------------------------------------------------------------------------------

export default function K1Teppich({ ortNamen = {} }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Buehne ortNamen={ortNamen} />
      </MotionConfig>
    </LazyMotion>
  );
}

/** Fokusziel nach dem Gate-Dialog am Teppich: nächster Schritt der Ablage, sonst die Regie-Spalte (in dieser Rangfolge). */
const ABLAGE_ZIELE = ["k1-ablage-bestaetigen", "k1-ablage-auswerten", "k1-ablage-status", "k1-regie"];
const ablageFokus = () => {
  for (const id of ABLAGE_ZIELE) {
    const el = document.querySelector(`[data-testid="${id}"]`);
    if (el) return el;
  }
  return null;
};

function Buehne({ ortNamen }) {
  const { status, last, pv, quelle, pvLaedt } = useGewerbeDaten();
  const hoch = useMobil();
  const touch = useTouch();
  const ruhig = useReduzierteBewegung();
  const kwpSb = useSteckbrief((s) => s.kwp);
  const { gate, phase, datei, waehlen, starten } = useK1Gate({ fokus: ablageFokus });
  const { fehler } = useK1Ablage();
  const [linse, setLinse] = useState("jahr");
  const [cursorRoh, setCursorRoh] = useState(null); // { sp, sl, mod }
  const [zeigen, setZeigen] = useState(false);
  const [mass, setMass] = useState({ w: 0, h: 0 });
  const [enthuellt, setEnthuellt] = useState(false);
  const [introLaeuft, setIntroLaeuft] = useState(false);
  const [sonneGesehen, setSonneGesehen] = useState(false);
  const [wisch, setWisch] = useState(null); // { id, dauer } während die Sonne einwischt
  const [ziehen, setZiehen] = useState(false); // Datei wird über die Bühne gezogen
  const [ansage, ansagen] = useAnsage();
  const buehneRef = useRef(null);
  const flaecheRef = useRef(null);
  const canvasA = useRef(null);
  const canvasB = useRef(null);
  const vorneRef = useRef(0);
  const bildRef = useRef(null);
  const gedrueckt = useRef(false);
  const dateiRef = useRef(null);
  const wischRef = useRef(null);
  const wischNr = useRef(0);
  const wischWunsch = useRef(0); // im Klick geplanter Wisch (id) – die Mal-Wirkung setzt ihn um
  const sonneGewischt = useRef(false);
  const frontRef = useRef(null);
  const frontMonat = useRef(null);
  const frontZahl = useRef(null);
  const zaehlerE = useRef(null);
  const zaehlerU = useRef(null);
  const ziehTiefe = useRef(0);
  const id = useId();
  const sichtbar = useImSichtfeld(flaecheRef, { schwelle: 0.2 });

  // Worker anstoßen (idempotent – auf /gewerbe macht das schon der Hero im Leerlauf)
  useEffect(() => {
    vorwaermen();
  }, []);

  const eigen = quelle === "eigen";
  const modell = useMemo(() => (last ? baueModell(last) : null), [last]);
  const kwp = kwpSb ?? pv?.empfehlung?.kwp ?? 0;
  const bilanz = useMemo(() => sonnenBilanz(modell, pv?.raster, kwp), [modell, pv, kwp]);
  const cursor = cursorRoh && cursorRoh.mod === modell ? cursorRoh : null;
  const bilanzRef = useRef(null);
  bilanzRef.current = bilanz;

  // --- Zeichnen ----------------------------------------------------------------------------------
  const param = useRef(null);
  param.current = { modell, linse, pvRaster: pv?.raster, kwp, hoch };

  // Die Canvas hat genau die Datenauflösung (365 × 96 bzw. 96 × 365); die Darstellung skaliert per
  // CSS image-rendering: pixelated (Nächster Nachbar, auf Gerätepixel gerastert, im Compositor). So bleibt
  // jede Zelle scharf, und ein Linsenwechsel kostet nur Neufärben + putImageData – kein Neuzeichnen von
  // 1–3 Mio. Gerätepixeln (drawImage-Skalierung, gemessen 17–96 ms ohne GPU).
  const malen = useCallback((index) => {
    const p = param.current;
    const cv = (index === 0 ? canvasA : canvasB).current;
    const box = flaecheRef.current;
    if (!cv || !box || !p?.modell) return;
    const W = p.hoch ? p.modell.slots : p.modell.nSp;
    const H = p.hoch ? p.modell.nSp : p.modell.slots;
    if (cv.width !== W) cv.width = W;
    if (cv.height !== H) cv.height = H;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let img = bildRef.current;
    if (!img || img.width !== W || img.height !== H) {
      img = ctx.createImageData(W, H);
      bildRef.current = img;
    }
    const t0 = performance.now();
    faerben(p.modell, p.linse, p.pvRaster, p.kwp, p.hoch, img.data);
    const t1 = performance.now();
    ctx.putImageData(img, 0, 0);
    // Messpunkte für die QA: Neufärben (Ziel ≤ 3 ms) und Übertragen in die Canvas
    box.dataset.faerbenMs = (t1 - t0).toFixed(2);
    box.dataset.zeichnenMs = (performance.now() - t1).toFixed(2);
  }, []);

  /** Laufenden Sonnen-Wisch sofort in den Endzustand bringen (neue Linse, neue Daten, Verlassen). */
  const wischBeenden = useCallback(() => {
    const w = wischRef.current;
    if (!w) return;
    cancelAnimationFrame(w.raf);
    wischRef.current = null;
    w.ziel.style.clipPath = "";
    w.ziel.style.zIndex = "";
    w.alt.style.zIndex = "";
    w.alt.style.opacity = "0";
    setWisch(null);
  }, []);

  // Neue Linse / neue Daten: in die hintere Fläche malen und überblenden – beim Wechsel AUF die Sonne
  // stattdessen von Jänner bis Dezember einwischen (im Klick geplant, damit Marken und Zähler vom ersten
  // Bild an im Takt sind; reduzierte Bewegung: sofort).
  useEffect(() => {
    if (!modell) return;
    const wunsch = wischWunsch.current;
    wischWunsch.current = 0;
    wischBeenden();
    const ziel = 1 - vorneRef.current;
    malen(ziel);
    vorneRef.current = ziel;
    const zc = (ziel === 0 ? canvasA : canvasB).current;
    const ac = (ziel === 0 ? canvasB : canvasA).current;
    if (!zc || !ac) return;
    const p = param.current;
    const mitWisch = wunsch > 0 && linse === "sonne" && !ruhig && p.pvRaster && p.kwp > 0;
    if (wunsch && !mitWisch) setWisch(null);
    if (mitWisch) {
      zc.style.transition = "none";
      ac.style.transition = "none";
      zc.style.zIndex = "1";
      ac.style.zIndex = "0";
      ac.style.opacity = "1";
      zc.style.opacity = "1";
      zc.style.clipPath = hoch ? "inset(0 0 100% 0)" : "inset(0 100% 0 0)";
      wischRef.current = { id: wunsch, ziel: zc, alt: ac, raf: 0, hoch };
    } else {
      const t = ruhig ? "none" : FADE;
      zc.style.transition = t;
      ac.style.transition = t;
      zc.style.clipPath = "";
      zc.style.zIndex = "";
      ac.style.zIndex = "";
      zc.style.opacity = "1";
      ac.style.opacity = "0";
    }
  }, [modell, linse, pv, kwp, hoch, malen, ruhig, wischBeenden]);

  // Bild-Schleife des Sonnen-Wischs: Kante, Monatsmarke und Zähler laufen synchron (kein React-Render je Bild)
  useEffect(() => {
    if (!wisch) return undefined;
    const w = wischRef.current;
    const b = bilanzRef.current;
    const mod = param.current.modell;
    if (!w || w.id !== wisch.id || !mod) return undefined;
    const nSp = mod.nSp;
    const start = performance.now();
    let letzteSp = -1;
    const schreiben = (sp) => {
      if (sp === letzteSp) return;
      letzteSp = sp;
      if (b && zaehlerE.current) zaehlerE.current.textContent = zahl(b.kumE[sp] / 1000);
      if (b && zaehlerU.current) zaehlerU.current.textContent = zahl(b.kumU[sp] / 1000);
      if (frontMonat.current) frontMonat.current.textContent = MONATE_KURZ[mod.monatVonSpalte[sp]];
      if (b && frontZahl.current) frontZahl.current.textContent = ` · ≈ ${zahl(b.kumE[sp] / 1000)} MWh genutzt`;
    };
    schreiben(0);
    const schritt = (jetzt) => {
      const t = Math.min(1, (jetzt - start) / (wisch.dauer * 1000));
      const p = KURVE.wert(t);
      const rest = ((1 - p) * 100).toFixed(3);
      w.ziel.style.clipPath = w.hoch ? `inset(0 0 ${rest}% 0)` : `inset(0 ${rest}% 0 0)`;
      // Kante per transform verschieben (top/left würden als Layout-Verschiebung in den CLS zählen)
      const f = frontRef.current;
      if (f) f.style.transform = w.hoch ? `translate3d(0, ${(p * 100).toFixed(3)}%, 0)` : `translate3d(${(p * 100).toFixed(3)}%, 0, 0)`;
      schreiben(Math.min(nSp - 1, Math.floor(p * nSp)));
      if (t < 1) w.raf = requestAnimationFrame(schritt);
      else wischBeenden();
    };
    w.raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(w.raf);
  }, [wisch, wischBeenden]);

  // Aufräumen beim Verlassen: kein Bild-Rückruf auf eine abgebaute Bühne
  useEffect(() => () => cancelAnimationFrame(wischRef.current?.raf || 0), []);

  // Größe der Fläche merken (Ausweich-Logik der Etiketten); die Canvas skaliert per CSS mit
  useEffect(() => {
    const box = flaecheRef.current;
    if (!box || typeof ResizeObserver === "undefined") return undefined;
    let raf = 0;
    const ro = new ResizeObserver(([e]) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = e.contentRect.width;
        const h = e.contentRect.height;
        setMass((alt) => (Math.abs(alt.w - w) < 1 && Math.abs(alt.h - h) < 1 ? alt : { w, h }));
      });
    });
    ro.observe(box);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [hoch]);

  // Einblenden beim ersten Erscheinen (quer von links, hochkant von oben); reduziert: sofort
  useEffect(() => {
    if (!modell || !sichtbar || enthuellt) return undefined;
    const raf = requestAnimationFrame(() => {
      setEnthuellt(true);
      if (!ruhig) setIntroLaeuft(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [modell, sichtbar, enthuellt, ruhig]);
  useEffect(() => {
    if (!introLaeuft) return undefined;
    const t = setTimeout(() => setIntroLaeuft(false), INTRO * 1000 + 300);
    return () => clearTimeout(t);
  }, [introLaeuft]);

  // Mobil: die aktive Pille in der waagrecht scrollenden Leiste ins Bild holen (nur waagrecht, nie die Seite)
  useEffect(() => {
    const el = buehneRef.current?.querySelector(`[data-testid="linse-${linse}"]`);
    const sc = el?.closest(".ov-no-scrollbar");
    if (!el || !sc || sc.scrollWidth <= sc.clientWidth + 1) return;
    const a = el.getBoundingClientRect();
    const b = sc.getBoundingClientRect();
    if (a.left < b.left + 8 || a.right > b.right - 8) sc.scrollTo({ left: sc.scrollLeft + (a.left - b.left) - 20, behavior: ruhig ? "auto" : "smooth" });
  }, [linse, ruhig]);

  // --- Bedienung -------------------------------------------------------------------------------
  const setze = useCallback(
    (z) => {
      if (!modell) return;
      const sp = Math.max(0, Math.min(modell.nSp - 1, z.sp));
      const sl = Math.max(0, Math.min(modell.slots - 1, z.sl));
      setCursorRoh({ sp, sl, mod: modell });
      setZeigen(true);
    },
    [modell]
  );
  const setzeProBild = useProBild(setze);

  const zelleAus = (e) => {
    const r = flaecheRef.current.getBoundingClientRect();
    const fx = Math.min(0.99999, Math.max(0, (e.clientX - r.left) / r.width));
    const fy = Math.min(0.99999, Math.max(0, (e.clientY - r.top) / r.height));
    return hoch ? { sp: Math.floor(fy * modell.nSp), sl: Math.floor(fx * modell.slots) } : { sp: Math.floor(fx * modell.nSp), sl: Math.floor(fy * modell.slots) };
  };

  const flaecheProps = modell
    ? {
        tabIndex: 0,
        role: "application",
        "aria-label": "Lastgang-Teppich, Pfeiltasten bewegen den Cursor",
        "aria-describedby": `${id}-hilfe ${id}-ablesung`,
        "data-testid": "teppich",
        "data-linse": linse,
        onPointerDown: (e) => {
          gedrueckt.current = true;
          setze(zelleAus(e));
        },
        onPointerMove: (e) => {
          if (e.pointerType === "mouse" || gedrueckt.current) setzeProBild(zelleAus(e));
        },
        onPointerUp: () => {
          gedrueckt.current = false;
        },
        onPointerCancel: () => {
          gedrueckt.current = false;
        },
        onPointerLeave: (e) => {
          if (e.pointerType === "mouse") setZeigen(false);
        },
        onFocus: () => {
          // funktional: ein Tippen setzt den Cursor vor dem Fokus-Ereignis – nicht überschreiben
          setCursorRoh((c) => (c && c.mod === modell ? c : { sp: modell.spitze.sp, sl: modell.spitze.sl, mod: modell }));
          setZeigen(true);
        },
        onBlur: () => setZeigen(false),
        onKeyDown: (e) => {
          const c = cursor ?? modell.spitze;
          const stunde = Math.max(1, Math.round(60 / modell.minProSlot));
          const tagS = e.shiftKey ? 7 : 1;
          const zeitS = e.shiftKey ? stunde : 1;
          let { sp, sl } = c;
          // Pfeile folgen der Bildschirmrichtung: quer ←/→ Tag, ↑/↓ Viertelstunde; hochkant umgekehrt
          if (e.key === "ArrowLeft") hoch ? (sl -= zeitS) : (sp -= tagS);
          else if (e.key === "ArrowRight") hoch ? (sl += zeitS) : (sp += tagS);
          else if (e.key === "ArrowUp") hoch ? (sp -= tagS) : (sl -= zeitS);
          else if (e.key === "ArrowDown") hoch ? (sp += tagS) : (sl += zeitS);
          else if (e.key === "PageUp") sp -= 30;
          else if (e.key === "PageDown") sp += 30;
          else if (e.key === "Home") sp = 0;
          else if (e.key === "End") sp = modell.nSp - 1;
          else if (e.key === "Escape") {
            setZeigen(false);
            return;
          } else return;
          e.preventDefault();
          sp = Math.max(0, Math.min(modell.nSp - 1, sp));
          sl = Math.max(0, Math.min(modell.slots - 1, sl));
          setCursorRoh({ sp, sl, mod: modell });
          setZeigen(true);
          ansagen(ablesung(modell, sp, sl, linse === "sonne", pv?.raster, kwp).lang);
        },
      }
    : { "data-testid": "teppich", "data-status": status };

  const sonneBereit = Boolean(modell && pv?.raster && kwp > 0);
  const waehleLinse = (neu) => {
    if (neu === linse) return;
    // Auf die Sonne: Wisch gleich hier planen (Marken, Zähler und Kante kennen den Takt ab dem ersten Bild)
    if (neu === "sonne" && !ruhig && sonneBereit && enthuellt) {
      wischNr.current += 1;
      wischWunsch.current = wischNr.current;
      setWisch({ id: wischNr.current, dauer: sonneGewischt.current ? WISCH_KURZ : WISCH_LANG });
      sonneGewischt.current = true;
    }
    setLinse(neu);
    if (neu === "sonne") setSonneGesehen(true);
    const eid = ERKENNTNIS_ID[neu];
    if (eid) {
      steckbrief.erkenntnis(eid);
      ereignis("erkenntnis", { id: eid });
    }
  };

  const sonneDarueber = () => {
    ereignis("k1_sonne_darueber", { quelle: eigen ? "eigen" : "beispiel" });
    waehleLinse("sonne");
    // Der Knopf liegt unter dem Teppich: ist dessen Anfang schon unter dem Seitenkopf verschwunden, einmal
    // sanft zurückholen – sonst läuft die Sonne mobil in einem Bereich, den niemand sieht. Kein Scroll-Fangen.
    const r = flaecheRef.current?.getBoundingClientRect();
    if (r && r.top < 76) window.scrollBy({ top: r.top - 96, behavior: ruhig ? "auto" : "smooth" });
  };

  const dateiWaehlen = () => dateiRef.current?.click();

  // Drag-and-drop einer Datei auf die Bühne (Desktop). Nur Dateien – gezogener Text oder Links nicht.
  const ablageProps = touch
    ? {}
    : {
        onDragEnter: (e) => {
          if (!traegtDateien(e)) return;
          e.preventDefault();
          ziehTiefe.current += 1;
          setZiehen(true);
        },
        onDragOver: (e) => {
          if (!traegtDateien(e)) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        },
        onDragLeave: (e) => {
          if (!traegtDateien(e)) return;
          ziehTiefe.current = Math.max(0, ziehTiefe.current - 1);
          if (ziehTiefe.current === 0) setZiehen(false);
        },
        onDrop: (e) => {
          if (!traegtDateien(e)) return;
          e.preventDefault();
          ziehTiefe.current = 0;
          setZiehen(false);
          waehlen(dateiAus(e.dataTransfer?.files), "teppich");
        },
      };

  // --- Ableitungen für die Anzeige ---------------------------------------------------------------
  const ziel = modell ? cursor ?? { sp: modell.spitze.sp, sl: modell.spitze.sl } : null;
  const lesung = modell ? ablesung(modell, ziel.sp, ziel.sl, linse === "sonne", pv?.raster, kwp) : null;
  const zPos = modell && cursor ? (hoch ? { x: ((cursor.sl + 0.5) / modell.slots) * 100, y: ((cursor.sp + 0.5) / modell.nSp) * 100 } : { x: ((cursor.sp + 0.5) / modell.nSp) * 100, y: ((cursor.sl + 0.5) / modell.slots) * 100 }) : null;
  const satz = modell ? satzFuer(linse, modell, eigen) : "";
  const wischt = Boolean(wisch) && linse === "sonne";
  const takt = wischt ? { dauer: wisch.dauer } : introLaeuft && linse === "jahr" ? { dauer: INTRO } : null;
  const ablageAktiv = phase !== "leer" || gate.geradeBestaetigt;
  const ablagePille = !touch && linse === "sonne" && !wischt && !eigen && phase === "leer" && enthuellt;

  const clip = ruhig || enthuellt ? "inset(0 0 0 0 round 10px)" : hoch ? "inset(0 0 100% 0 round 10px)" : "inset(0 100% 0 0 round 10px)";

  // Tooltip: quer am Cursor, hochkant/Touch oben in der Fläche (der Finger verdeckt sonst die Zahl)
  let tipStil = null;
  if (zPos && zeigen && lesung) {
    if (hoch || touch) {
      tipStil = { left: "50%", top: zPos.y < 30 ? "auto" : 8, bottom: zPos.y < 30 ? 8 : "auto", translate: "-50% 0" };
    } else {
      const tx = zPos.x > 78 ? "calc(-100% - 14px)" : zPos.x < 22 ? "14px" : "-50%";
      const ty = zPos.y < 28 ? "16px" : "calc(-100% - 16px)";
      tipStil = { left: `${zPos.x}%`, top: `${zPos.y}%`, translate: `${tx} ${ty}` };
    }
  }

  const ortName = pv && ortNamen[pv.ortId] ? `, ${ortNamen[pv.ortId]}` : "";
  const sonnenQuelle = `PV ${zahl(kwp)} kWp ${AUSRICHTUNG[pv?.ausrichtung] || pv?.ausrichtung || ""}${ortName} · ${KENNZEICHNUNG.pvModell} · ${STAND.werte} · ${KENNZEICHNUNG.richtwert}`;
  const augenbraue = linse === "jahr" ? "Was der Teppich zeigt" : linse === "sonne" ? `Sonne ${modell && modell.nSp >= 360 ? "im Jahr" : "im Zeitraum"} · ${zahl(kwp)} kWp` : "Erkenntnis";

  return (
    <div ref={buehneRef} data-k1-buehne="" data-status={status} data-wisch={wischt ? "laeuft" : undefined} {...ablageProps}>
      <input
        ref={dateiRef}
        type="file"
        accept=".csv,.txt,text/csv,text/plain"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        data-testid="lastgang-upload-teppich"
        onChange={(e) => {
          waehlen(dateiAus(e.target.files), "teppich");
          e.target.value = "";
        }}
      />
      <TeppichKopf
        linsen={<LinsenOptik aktiv={linse} onWahl={waehleLinse} eigen={eigen} />}
        herkunft={<HerkunftChip eigen={eigen} text={eigen ? "Ihr Lastgang · ausgewertet nur in diesem Browser" : KENNZEICHNUNG.synthetischKurz} />}
        aktion={<EigenLink eigen={eigen} />}
      />

      <div className="mt-4 md:mt-5">
        <TeppichGestell
          hoch={hoch}
          abschnitte={modell ? modell.abschnitte : undefined}
          nTage={modell ? modell.nSp : 365}
          flaecheRef={flaecheRef}
          flaecheProps={flaecheProps}
          flaecheClassName={cn("focus-visible:rounded-[10px]", modell && "cursor-crosshair select-none")}
        >
          {!modell && (
            <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-[14px] font-medium text-white/55" role="status">
              {status === "fehler"
                ? "Der Teppich lässt sich in diesem Browser nicht berechnen. Die Monatswerte stehen in der Tabelle unter „Lastgang lesen“."
                : "Lastgang wird berechnet …"}
            </span>
          )}
          <div
            className="absolute inset-0 overflow-hidden rounded-[10px]"
            style={{ clipPath: clip, transition: ruhig ? "none" : `clip-path ${INTRO}s ${BEWEGUNG.css.inAus}` }}
          >
            <canvas ref={canvasA} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-0" style={{ imageRendering: "pixelated" }} />
            <canvas ref={canvasB} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-0" style={{ imageRendering: "pixelated" }} />
          </div>

          {modell && (
            <AnimatePresence>
              <m.div
                key={`${linse}-${hoch ? "h" : "q"}-${modell.quelle}`}
                className="pointer-events-none absolute inset-0"
                exit={{ opacity: 0, transition: { duration: BEWEGUNG.dauer.kurz } }}
              >
                {(enthuellt || ruhig) && <LinsenEbene linse={linse} mod={modell} hoch={hoch} mass={mass} bilanz={bilanz} ruhig={ruhig} eigen={eigen} takt={takt} />}
              </m.div>
            </AnimatePresence>
          )}

          {/* Wischkante der Sonne: dünne Linie mit Monatsmarke, läuft mit dem clip-path */}
          {wischt && (
            <span
              ref={frontRef}
              aria-hidden="true"
              data-testid="k1-sonnenkante"
              className="pointer-events-none absolute inset-0 z-[3] will-change-transform"
              style={{ transform: "translate3d(0, 0, 0)" }}
            >
              <span
                className={cn(
                  "absolute bg-sun-300 shadow-[0_0_18px_4px_rgba(255,216,115,0.45)]",
                  hoch ? "inset-x-0 top-0 h-[2px] -translate-y-1/2" : "inset-y-0 left-0 w-[2px] -translate-x-1/2"
                )}
              />
              <span
                className={cn(
                  "ov-num absolute whitespace-nowrap rounded-md bg-sun-300 px-1.5 py-[3px] text-[11px] font-bold leading-none text-navy-950",
                  hoch ? "left-1.5 top-0 -translate-y-[calc(100%+4px)]" : "left-0 top-1.5 -translate-x-1/2"
                )}
              >
                <span ref={frontMonat} />
                {/* mobil liegen die großen Zähler unter dem Teppich oft außerhalb des Bildes: Zähler an der Kante */}
                {hoch && <span ref={frontZahl} className="font-semibold" />}
              </span>
            </span>
          )}

          {zPos && zeigen && (
            <svg className="pointer-events-none absolute inset-0 z-[3] h-full w-full overflow-visible" aria-hidden="true">
              <line x1={`${zPos.x}%`} x2={`${zPos.x}%`} y1="0" y2="100%" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
              <line x1="0" x2="100%" y1={`${zPos.y}%`} y2={`${zPos.y}%`} stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
              <circle cx={`${zPos.x}%`} cy={`${zPos.y}%`} r="5.5" fill="none" stroke="#ffffff" strokeWidth="1.75" />
            </svg>
          )}
          {tipStil && (
            <span
              aria-hidden="true"
              className="ov-num pointer-events-none absolute z-[4] whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-semibold leading-none text-navy-950 shadow-[0_8px_24px_-6px_rgba(3,18,43,0.6)]"
              style={tipStil}
            >
              {lesung.kurz}
            </span>
          )}

          {/* Touch: kleiner Hinweis bis zur ersten Berührung – hochkant in den Nachtstunden im Juni (dort steht nichts) */}
          {touch && modell && enthuellt && !cursor && !wischt && (
            <span
              aria-hidden="true"
              data-testid="k1-tipp"
              className={cn(
                "pointer-events-none absolute z-[2] rounded-md bg-navy-950/85 px-1.5 py-1 text-[11px] font-semibold leading-tight text-white/85",
                hoch ? "left-1.5 top-[44%] w-[23%] min-w-[72px] text-center" : "left-2 top-2"
              )}
            >
              Tippen und ziehen
            </span>
          )}

          {/* Nach der Sonne: die Ablage für den eigenen Lastgang liegt auf derselben Fläche (Desktop) */}
          <AnimatePresence>
            {ablagePille && (
              <m.button
                key="ablage-pille"
                type="button"
                onClick={dateiWaehlen}
                onPointerDown={(e) => e.stopPropagation()}
                data-testid="k1-ablage-pille"
                className="absolute bottom-3 right-3 z-[5] inline-flex min-h-11 items-center gap-2.5 rounded-full bg-navy-950/85 py-1.5 pl-1.5 pr-4 text-left text-white shadow-[0_10px_30px_-10px_rgba(3,18,43,0.9)] backdrop-blur-sm transition-colors hover:bg-navy-900"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { ...EIN, delay: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: BEWEGUNG.dauer.kurz } }}
              >
                <span aria-hidden="true" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-navy-950">
                  <FileUp className="h-4 w-4" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[13.5px] font-semibold">Ihr Lastgang statt Beispiel</span>
                  <span className="block text-[12px] text-white/65">CSV hierher ziehen oder wählen</span>
                </span>
              </m.button>
            )}
          </AnimatePresence>

          {/* Datei wird über die Bühne gezogen: die ganze Fläche ist Ablage */}
          {ziehen && (
            <div
              data-testid="k1-ablage-ueberlagerung"
              className="pointer-events-none absolute inset-0 z-[6] flex flex-col items-center justify-center gap-3 rounded-[10px] bg-navy-950/85 px-6 text-center shadow-[inset_0_0_0_2px_rgba(140,186,88,0.7)] backdrop-blur-[2px]"
            >
              <span aria-hidden="true" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ov-400/20 text-ov-300">
                <FileUp className="h-6 w-6" />
              </span>
              <span className="font-display text-[19px] font-bold text-white md:text-[22px]">Loslassen – Ihr Lastgang ersetzt das Beispiel</span>
              <span className="max-w-[46ch] text-[13.5px] leading-snug text-white/70">
                Die Datei verlässt Ihren Browser nicht. Gelesen wird sie erst, nachdem Sie Ihre E-Mail-Adresse bestätigt haben.
              </span>
            </div>
          )}
        </TeppichGestell>
      </div>

      <p id={`${id}-hilfe`} className="sr-only">
        {hoch
          ? "Pfeil links und rechts wechseln die Viertelstunde, Pfeil hoch und runter den Tag; mit Umschalt eine Stunde bzw. eine Woche. Bild auf und ab springen etwa einen Monat, Pos1 und Ende zum ersten und letzten Tag."
          : "Pfeil links und rechts wechseln den Tag, Pfeil hoch und runter die Viertelstunde; mit Umschalt eine Woche bzw. eine Stunde. Bild auf und ab springen etwa einen Monat, Pos1 und Ende zum ersten und letzten Tag."}
      </p>
      <p aria-live="polite" className="sr-only">
        {ansage}
      </p>

      <div className={cn("mt-4", ZEILE.legende)}>{modell && <LinsenLegende linse={linse} mod={modell} pvLaedt={pvLaedt} sonnenQuelle={sonnenQuelle} />}</div>

      <div className={cn("mt-4 grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-10 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:gap-12", ZEILE.unten)}>
        <div className="min-w-0" data-testid="k1-regie">
          {modell && (
            <>
              <p className={cn("hidden md:block", AUGENBRAUE)}>{augenbraue}</p>
              {linse === "sonne" && bilanz && (
                <div className="md:mt-3">
                  <SonnenBilanz bilanz={bilanz} eigen={eigen} ganzesJahr={modell.nSp >= 360} live={wischt} refE={zaehlerE} refU={zaehlerU} />
                </div>
              )}
              <div aria-live="polite" className={linse === "sonne" ? "mt-4" : "md:mt-3"}>
                <AnimatePresence mode="wait" initial={false}>
                  {!wischt && (
                    <m.div
                      key={`${linse}-${eigen ? "e" : "b"}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: EIN }}
                      exit={{ opacity: 0, y: -4, transition: { duration: BEWEGUNG.dauer.kurz } }}
                    >
                      <Erkenntnis dunkel data-testid="k1-erkenntnis" className={linse === "sonne" ? "max-md:text-[16.5px] max-[359px]:text-[15.5px] md:text-[19px]" : undefined}>
                        {satz}
                      </Erkenntnis>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

              {ablageAktiv ? (
                <AblageStatus
                  phase={phase}
                  datei={datei}
                  fehler={fehler}
                  freigegeben={gate.freigegeben}
                  geradeBestaetigt={gate.geradeBestaetigt}
                  starten={starten}
                  dateiWaehlen={dateiWaehlen}
                />
              ) : linse !== "sonne" && !sonneGesehen ? (
                <m.div
                  className="mt-5"
                  initial={ruhig ? false : { opacity: 0, y: 8 }}
                  animate={enthuellt || ruhig ? { opacity: 1, y: 0, transition: { ...EIN, delay: ruhig ? 0 : introLaeuft ? INTRO : 0 } } : { opacity: 0, y: 8 }}
                >
                  <p className="text-[14.5px] leading-snug text-white/70">
                    Was ändert eine Photovoltaik-Anlage{sonneBereit ? <span className="ov-num"> mit {zahl(kwp)} kWp</span> : null} an diesem Bild?
                  </p>
                  <button
                    type="button"
                    onClick={sonneDarueber}
                    disabled={!sonneBereit}
                    data-testid="k1-sonne-darueber"
                    className={cn(KNOPF_HELL, "mt-3 w-full pl-4 sm:w-auto disabled:cursor-wait disabled:opacity-60")}
                  >
                    <Sun aria-hidden="true" className="h-[18px] w-[18px] text-sun-500" />
                    Sonne darüberlegen
                  </button>
                </m.div>
              ) : linse === "sonne" && !wischt ? (
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 md:gap-x-5">
                  <a
                    href="#eigenverbrauch"
                    className="inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:text-ov-200"
                  >
                    Größe ausprobieren <span aria-hidden="true">→</span>
                  </a>
                  {!eigen && (
                    <button type="button" onClick={dateiWaehlen} data-testid="k1-ablage-knopf" className={cn(KNOPF_LEISE, "min-h-11 px-4 text-[14px]", !touch && "md:hidden")}>
                      <FileUp aria-hidden="true" className="h-4 w-4" />
                      <span className="sm:hidden">Ihr Lastgang</span>
                      <span className="hidden sm:inline">Ihr Lastgang statt Beispiel</span>
                    </button>
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="hidden min-w-0 md:block">
          {modell && lesung && (
            <>
              <p className={AUGENBRAUE}>{cursor ? "Ablesung" : "Ablesung · Jahresspitze"}</p>
              <output
                id={`${id}-ablesung`}
                data-testid="teppich-readout"
                aria-live="off"
                className="ov-num mt-2 block font-display text-[16px] font-bold leading-snug text-white md:text-[18px]"
              >
                {lesung.kurz}
              </output>
              <Tagesprofil mod={modell} d={lesung.d} sl={ziel.sl} sonne={linse === "sonne"} pvRaster={pv?.raster} kwp={kwp} />
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-[2px] w-4 rounded bg-navy-300" />
                  dieser Tag
                </span>
                {modell.werktag && (
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-0 w-4 border-t border-dashed border-white/50" />
                    Ø Werktag
                  </span>
                )}
                <span className="ml-auto">{touch ? "Tippen und seitlich ziehen" : "Zeigen oder Tab + Pfeiltasten"}</span>
              </p>
            </>
          )}
        </div>
      </div>
      {gate.dialog}
    </div>
  );
}
