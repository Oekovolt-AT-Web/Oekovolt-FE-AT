// src/components/GewerbeUnikat/HeroGeometrie.js
//
// Wochen-Puls im Hero: SVG-Pfade, Beschriftungs-Positionen und Wochensummen aus beispielServer().puls.
// REIN (ohne React, ohne Browser-APIs) – läuft im Server-Rendering von Hero.js und in Node-Tests.
// Relative Importe mit Endung, damit Node die Datei ohne Bundler lädt.
//
// Koordinaten: viewBox "0 0 672 320" (eine Einheit = eine Viertelstunde), preserveAspectRatio="none".
// y: 0 kW = 300, Oberkante (nächste 50 kW über dem Wochenmaximum) = 20. Alle Werte auf 1 Nachkommastelle
// gerundet und relativ kodiert (l/h), damit das Hero-HTML klein bleibt. HTML-Beschriftungen werden in %
// derselben Fläche positioniert – bei preserveAspectRatio="none" passen sie auf jeder Breite exakt.

import { ostersonntag } from "../../lib/lastgang/analyse.js";

export const PULS_BREITE = 672;
export const PULS_HOEHE = 320;
const NULL_Y = 300;
const OBEN_Y = 20;
const TAG = 86400000;

const WOCHENTAG = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

/** Name eines gesetzlichen Feiertags in Österreich (§ 7 ARG) oder null. t = Tagesbeginn als UTC-ms. */
export function feiertagName(t) {
  const d = new Date(t);
  const j = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const tag = d.getUTCDate();
  const fest = {
    "0-1": "Neujahr",
    "0-6": "Heilige Drei Könige",
    "4-1": "Staatsfeiertag",
    "7-15": "Mariä Himmelfahrt",
    "9-26": "Nationalfeiertag",
    "10-1": "Allerheiligen",
    "11-8": "Mariä Empfängnis",
    "11-25": "Christtag",
    "11-26": "Stefanitag",
  };
  if (fest[`${m}-${tag}`]) return fest[`${m}-${tag}`];
  const o = ostersonntag(j);
  const beweglich = { 1: "Ostermontag", 39: "Christi Himmelfahrt", 50: "Pfingstmontag", 60: "Fronleichnam" };
  const n = Math.round((Date.UTC(j, m, tag) - o) / TAG);
  return beweglich[n] || null;
}

const r1 = (v) => Math.round(v * 10) / 10;
/** Zahl kompakt für Pfade: 0.5 → ".5", -0.5 → "-.5", -0 → "0" */
function n(v) {
  const r = r1(v);
  if (r === 0) return "0";
  const s = String(r);
  return s.replace(/^(-?)0\./, "$1.");
}
/** Paarliste [dx, dy] → kompakter relativer Pfad (l mit impliziter Wiederholung, h für waagrechte Läufe). */
function relativ(paare) {
  let out = "";
  let befehl = "";
  let hLauf = 0;
  const hSchliessen = () => {
    if (hLauf) {
      out += `h${n(hLauf)}`;
      befehl = "h";
      hLauf = 0;
    }
  };
  for (const [dx, dy] of paare) {
    if (dy === 0) {
      hLauf += dx;
      continue;
    }
    hSchliessen();
    const a = n(dx);
    const b = n(dy);
    const paar = `${a}${b.startsWith("-") ? "" : " "}${b}`;
    if (befehl === "l") out += `${paar.startsWith("-") || paar.startsWith(".") ? "" : " "}${paar}`;
    else out += `l${paar}`;
    befehl = "l";
  }
  hSchliessen();
  return out;
}

const zeit = (slot, slots) => {
  const min = Math.round((slot * 1440) / slots);
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
};

/** Zwei Zeichen Basis 36 je Wert (ganze kW, 0 … 1295) – kompakte Übergabe an die Client-Insel. */
export function kodiere(werte) {
  let s = "";
  for (const v of werte) s += Math.max(0, Math.min(1295, Math.round(v))).toString(36).padStart(2, "0");
  return s;
}

/**
 * @param {{ slots:number, kwp:number, last:number[], pv:number[], tage:{t:number,typ:number}[], spitze:{i:number,kw:number} }} puls
 * @param {number} grundlast kW (kennzahlen.grundlast)
 */
export function pulsGeometrie(puls, grundlast) {
  const { slots, last, pv, tage } = puls;
  const anzahl = last.length;
  let max = 0;
  for (let i = 0; i < anzahl; i++) max = Math.max(max, last[i] || 0, pv[i] || 0);
  const oben = Math.floor(max / 50) * 50 + 50;
  const skala = (NULL_Y - OBEN_Y) / oben;
  const y = (kw) => NULL_Y - Math.max(0, kw) * skala;
  const yr = (kw) => r1(y(kw));
  const x = (i) => i + 0.5;
  const px = (v) => r1((v / PULS_BREITE) * 100); // % der Breite
  const py = (v) => r1((v / PULS_HOEHE) * 100); // % der Höhe

  // (d) Lastlinie: offener Pfad über die volle Breite; (a) Lastfläche = dieselbe Linie, unten an der Nulllinie geschlossen
  const yl = Array.from(last, (v) => yr(v));
  const paareLast = [];
  for (let i = 1; i < anzahl; i++) paareLast.push([1, r1(yl[i] - yl[i - 1])]);
  const pfadLinie = `M0 ${n(yl[0])}H.5${relativ(paareLast)}H672`;
  const pfadFlaeche = `${pfadLinie}V300H0Z`;

  // (b) Sonne genutzt = min(pv, last), Fläche ab der Nulllinie
  const g = Array.from(last, (v, i) => yr(Math.min(v, pv[i])));
  const paareG = [];
  for (let i = 1; i < anzahl; i++) paareG.push([1, r1(g[i] - g[i - 1])]);
  const pfadGenutzt = `M-1 300V${n(g[0])}H.5${relativ(paareG)}H673V300Z`;

  // (c) Sonne übrig: Band zwischen Last und PV, wo PV > Last – mit linear interpolierten Schnittpunkten
  const diff = Array.from(last, (v, i) => pv[i] - v);
  let pfadUebrig = "";
  for (let i = 0; i < anzahl; i++) {
    if (!(diff[i] > 0)) continue;
    let b = i;
    while (b + 1 < anzahl && diff[b + 1] > 0) b++;
    // Anfang: Schnitt zwischen i-1 und i
    let xs = x(i);
    let ys = yl[i];
    if (i > 0) {
      const t = diff[i - 1] / (diff[i - 1] - diff[i]);
      xs = x(i - 1) + t;
      ys = r1(yl[i - 1] + (yl[i] - yl[i - 1]) * t);
    }
    let xe = x(b);
    let ye = yl[b];
    if (b + 1 < anzahl) {
      const t = diff[b] / (diff[b] - diff[b + 1]);
      xe = x(b) + t;
      ye = r1(yl[b] + (yl[b + 1] - yl[b]) * t);
    }
    const ypv = (k) => yr(pv[k]);
    const hin = [[r1(x(i) - xs), r1(ypv(i) - ys)]];
    for (let k = i + 1; k <= b; k++) hin.push([1, r1(ypv(k) - ypv(k - 1))]);
    hin.push([r1(xe - x(b)), r1(ye - ypv(b))]);
    const zurueck = [[r1(x(b) - xe), r1(yl[b] - ye)]];
    for (let k = b - 1; k >= i; k--) zurueck.push([-1, r1(yl[k] - yl[k + 1])]);
    pfadUebrig += `M${n(xs)} ${n(ys)}${relativ(hin)}${relativ(zurueck)}Z`;
    i = b;
  }

  // Raster: waagrechte Haarlinien je 100 kW, Tagestrenner, Ruhetage (Sonn-/Feiertag)
  const rasterKw = [];
  for (let kw = 100; kw <= oben; kw += 100) rasterKw.push(kw);
  const pfadRaster = rasterKw.map((kw) => `M0 ${n(y(kw))}H672`).join("");
  const pfadTage = Array.from({ length: tage.length - 1 }, (_, d) => `M${(d + 1) * slots} 0V300`).join("");
  const ruhe = tage.map((t, d) => (t.typ === 2 ? d : -1)).filter((d) => d >= 0);

  // Tage (Beschriftung unter der Grafik, Ablesung im Fadenkreuz)
  const tageInfo = tage.map((t, d) => {
    const dt = new Date(t.t);
    const wt = WOCHENTAG[dt.getUTCDay()];
    const datum = `${dt.getUTCDate()}.${dt.getUTCMonth() + 1}.`;
    const name = t.typ === 2 && dt.getUTCDay() !== 0 ? feiertagName(t.t) || "Feiertag" : null;
    return { kurz: wt, datum, name, ruhe: t.typ === 2, mitte: px((d + 0.5) * slots) };
  });

  // ① Anlaufspitze
  const si = puls.spitze.i;
  const sd = Math.floor(si / slots);
  const spitze = { x: px(x(si)), y: py(yl[si]), kw: puls.spitze.kw, text: `${tageInfo[sd].kurz} ${zeit(si % slots, slots)}` };

  // Wochensummen (kWh) – Legende mit Werten; je Tag für die Feiertags-Erkenntnis
  let verbrauch = 0;
  let genutzt = 0;
  let uebrig = 0;
  const h = 24 / slots;
  const uebrigTag = new Array(tage.length).fill(0);
  for (let i = 0; i < anzahl; i++) {
    verbrauch += last[i] * h;
    genutzt += Math.min(last[i], pv[i]) * h;
    const u = Math.max(0, pv[i] - last[i]) * h;
    uebrig += u;
    uebrigTag[Math.floor(i / slots)] += u;
  }

  // ② Feiertag (kein Sonntag): Höchster PV-Wert des Tages als Ankerpunkt. `slot` = Viertelstunde der
  // Ablesung, auf die die Frage-Marke springt; `uebrigKwh`/`anteilWoche` = Antwort nach dem Entdecken.
  const fd = tageInfo.findIndex((t) => t.name);
  let feiertag = null;
  if (fd >= 0) {
    let k = fd * slots;
    for (let s = fd * slots; s < (fd + 1) * slots; s++) if (pv[s] > pv[k]) k = s;
    feiertag = {
      tag: fd,
      slot: k,
      name: tageInfo[fd].name,
      kurz: tageInfo[fd].kurz,
      datum: tageInfo[fd].datum,
      x: px(x(k)),
      y: py(yr(pv[k])),
      mitte: tageInfo[fd].mitte,
      uebrigKwh: Math.round(uebrigTag[fd]),
      anteilWoche: uebrig > 0 ? uebrigTag[fd] / uebrig : 0,
    };
  }

  // ③ Grundlast: Bezugslinie über die Woche, Beschriftung in der Nachtlücke vor dem Sonntag (dort ist weder
  // Sonne noch Schicht – die Lücke in Viertelstunden ohne PV um Sonntag 00:00 suchen)
  const so = tage.findIndex((t) => new Date(t.t).getUTCDay() === 0);
  let grundX = 97;
  let grundOben = yr(grundlast);
  if (so > 0) {
    let a = so * slots;
    let e = so * slots;
    while (a > 0 && !(pv[a - 1] > 1)) a--;
    while (e < anzahl - 1 && !(pv[e + 1] > 1)) e++;
    if (e - a >= 16) {
      grundX = px((x(a) + x(e)) / 2);
      // Beschriftung über der höchsten Last in der Mitte der Lücke (± 1/4 der Lücke)
      const m = Math.round((a + e) / 2);
      const r = Math.round((e - a) / 4);
      for (let k = m - r; k <= m + r; k++) grundOben = Math.min(grundOben, yl[k]);
    }
  }
  const grund = { kw: grundlast, y: py(yr(grundlast)), x: grundX, labelY: py(grundOben) };

  // ④ Sonne trifft Schicht: Mittwoch 12:00 – Punkt auf „Sonne genutzt“, Text rechts davon über der
  // Nachmittagsschicht (höchste Last 12:00–22:00 bestimmt die Höhe, damit nichts die Kurve kreuzt)
  const md = tage.findIndex((t) => new Date(t.t).getUTCDay() === 3);
  let schicht = null;
  if (md >= 0) {
    // Viertelstunde um 12:00 (± 1 h), in der die Sonne am meisten Last deckt – nicht die Mittagspause
    const mittag = md * slots + Math.round(slots / 2);
    let s = mittag;
    for (let k = mittag - 4; k <= mittag + 4; k++) if (Math.min(last[k], pv[k]) > Math.min(last[s], pv[s])) s = k;
    let hoechste = yl[s];
    for (let k = s - 2; k <= Math.min(anzahl - 1, s + Math.round((slots * 10) / 24)); k++) hoechste = Math.min(hoechste, yl[k]);
    schicht = { x: px(x(s)), y: py(g[s]), labelY: py(hoechste) };
  }

  return {
    oben,
    rasterKw: rasterKw.map((kw) => ({ kw, y: py(y(kw)) })),
    pfade: { linie: pfadLinie, flaeche: pfadFlaeche, genutzt: pfadGenutzt, uebrig: pfadUebrig, raster: pfadRaster, tage: pfadTage, grundlast: `M0 ${n(y(grundlast))}H672` },
    ruhe,
    tage: tageInfo,
    marken: { spitze, feiertag, grundlast: grund, schicht },
    summen: { verbrauch, genutzt, uebrig },
    kodiert: { last: kodiere(last), pv: kodiere(pv) },
  };
}
