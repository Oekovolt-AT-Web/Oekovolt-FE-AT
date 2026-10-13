// src/components/GewerbeUnikat/K3Ansicht.js
//
// Kapitel 03 – die ANSICHT des Instruments „Sonne trifft Schicht“: Knick-Kurve mit Läufer, Wochenstreifen
// (Ursache und Wirkung in einem Blick), Messwerte, drei Tagesbänder mit E-Flotte, Marktwert-Streifen und
// Überschuss-Weiche.
//
// REINE Komponente (keine Hooks, kein "use client"): Die Server-Hülle rendert sie im Startzustand als
// Platzhalter (SSR, ohne JS lesbar, gleiche Höhe wie die Bühne → kein CLS), die Client-Bühne
// (K3SonneSchicht) rendert DIESELBE Ansicht mit Live-Werten und reicht über `slots` die interaktiven
// Teile herein (Regler, Feder-Läufer, Wochenstreifen mit Federwert, Erkenntnisse). d3 ist servertauglich.
//
// Geometrie: Knick-Kurve und Marktwert-Streifen zeichnen in Pixeln (viewBox = gemessene Breite, Schrift
// wird nicht skaliert); SSR rendert sie je Stufe (mobil/desktop bzw. mobil/mittel/desktop) und schaltet per
// CSS um. Tagesbänder und Wochenstreifen sind EIN SVG je Tag (preserveAspectRatio="none", Texte in HTML)
// und brauchen keine zweite Fassung. Seitenverhältnisse sind in SSR und Bühne gleich → nichts springt.

import Link from "next/link";
import { area, line, curveLinear, curveMonotoneX } from "d3-shape";
import { scaleBand, scaleLinear } from "d3-scale";
import { FARBE, BEDEUTUNG, KENNZEICHNUNG, zahl } from "./_tokens";
import { Kennzeichnung, Vertiefen } from "./_bausteine";
import { LADEN } from "./K3Modell";
import K3Woche, { TagFlaechen, tagPfade } from "./K3Woche";

const D = {
  last: BEDEUTUNG.last.dunkel,
  eigen: BEDEUTUNG.eigen.dunkel,
  uebrig: BEDEUTUNG.ueberschuss.dunkel,
  grenze: BEDEUTUNG.grenze.dunkel,
  raster: BEDEUTUNG.raster.dunkel,
  grund: FARBE.navy950,
  text: "rgba(255,255,255,0.6)",
  textStark: "rgba(255,255,255,0.86)",
};

/** Grund-Geometrien (Breite × Höhe = Seitenverhältnis) und Ränder in px. */
const GEO = {
  kurve: {
    mobil: { w: 350, h: 238, l: 34, r: 14, t: 44, b: 26, schrift: 11 },
    desktop: { w: 760, h: 360, l: 46, r: 22, t: 50, b: 30, schrift: 12 },
  },
  markt: {
    mobil: { w: 350, h: 146, l: 2, r: 2, t: 34, b: 22, schrift: 10.5 },
    mittel: { w: 700, h: 196, l: 2, r: 2, t: 36, b: 22, schrift: 11.5 },
    desktop: { w: 1200, h: 230, l: 2, r: 2, t: 36, b: 24, schrift: 12 },
  },
};

/**
 * Geometrie einer Grafik. stufe: true/"mobil" | "mittel" | false/"desktop"; breite = gemessene Breite
 * (Client) oder null (SSR: Grundbreite, per viewBox skaliert).
 */
export function geo(art, stufe, breite) {
  const st = stufe === true ? "mobil" : stufe === false || stufe == null ? "desktop" : stufe;
  const g = GEO[art][st] || GEO[art].desktop;
  const w = breite > 0 ? Math.round(breite) : g.w;
  const h = (w * g.h) / g.w; // nicht runden: gleiche Höhe wie das per viewBox skalierte SSR-Bild
  return { ...g, w, h, iw: w - g.l - g.r, ih: h - g.t - g.b, mobil: st === "mobil", kompakt: st !== "desktop" };
}

/** Skalen der Kurve (auch von der Bühne für Feder-Läufer und Zeiger benutzt). */
export function kurvenSkalen(g, xMax) {
  return {
    sx: scaleLinear().domain([0, xMax]).range([g.l, g.w - g.r]).clamp(true),
    sy: scaleLinear().domain([0, 1]).range([g.h - g.b, g.t]),
  };
}

const MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const MONATE_KURZ = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
/** "2026-04" → "April 2026" (kurz: "Apr 26") */
export function monatText(monat, kurz = false) {
  const [j, m] = monat.split("-").map(Number);
  return kurz ? `${MONATE_KURZ[m - 1]} ${String(j).slice(2)}` : `${MONATE[m - 1]} ${j}`;
}

const ct = (v) => zahl(v, 2);
const prozentZahl = (a) => zahl(a * 100, 0);

/** Zahl ohne Bewegung (SSR) – die Bühne reicht stattdessen <Zahl> (gleitend) herein. */
function ZahlText({ wert, stellen = 0, vor = "", nach = "", className }) {
  return (
    <span className={["ov-num", className].filter(Boolean).join(" ")}>
      {vor}
      {zahl(wert, stellen)}
      {nach}
    </span>
  );
}

const Einheit = ({ children }) => <span className="ml-1 text-[0.55em] font-bold text-white/60">{children}</span>;

/**
 * Stufen: SSR (stufe null) zeichnet jede Stufe und schaltet per CSS um (zwei Stufen an md, drei an md/lg);
 * die Bühne übergibt ihre Stufe (true/false bzw. "mobil" | "mittel" | "desktop").
 */
function Varianten({ stufe, render, drei = false }) {
  if (stufe === null || stufe === undefined) {
    if (drei)
      return (
        <>
          <div className="md:hidden">{render("mobil")}</div>
          <div className="hidden md:block lg:hidden">{render("mittel")}</div>
          <div className="hidden lg:block">{render("desktop")}</div>
        </>
      );
    return (
      <>
        <div className="md:hidden">{render("mobil")}</div>
        <div className="hidden md:block">{render("desktop")}</div>
      </>
    );
  }
  return render(stufe);
}

// ---------------------------------------------------------------------------------------------------
// A · Knick-Kurve
// ---------------------------------------------------------------------------------------------------

function xTicks(xMax, mobil) {
  const schritt = xMax <= 1000 ? (mobil ? 200 : 100) : xMax <= 2000 ? (mobil ? 500 : 250) : mobil ? 1000 : 500;
  const t = [];
  for (let k = 0; k <= xMax + 1e-9; k += schritt) t.push(k);
  return t;
}

function wertBei(punkte, kwp, feld) {
  if (kwp <= punkte[0].kwp) return punkte[0][feld];
  for (let j = 1; j < punkte.length; j++) {
    const a = punkte[j - 1];
    const b = punkte[j];
    if (kwp <= b.kwp) return a[feld] + ((b[feld] - a[feld]) * (kwp - a.kwp)) / (b.kwp - a.kwp || 1);
  }
  return punkte[punkte.length - 1][feld];
}

/** Geschätzte Textbreite (Manrope/Inter fett, tabellarische Ziffern) – reicht für Kollisionsprüfungen. */
export const textBreite = (text, f, fett = true) => text.length * f * (fett ? 0.6 : 0.56);

/** Rechteck-Überschneidung mit Luft (px). */
const trifft = (a, b, luft = 3) => a.x0 < b.x1 + luft && a.x1 + luft > b.x0 && a.y0 < b.y1 + luft && a.y1 + luft > b.y0;

/** Schneidet eine Kurve (EV, Autarkie, Grenz) das Rechteck? Abgetastet alle 3 px. */
function kurveIn(box, punkte, sx, sy, luft = 3) {
  for (let x = box.x0; x <= box.x1 + 0.1; x += 3) {
    const k = sx.invert(Math.min(x, box.x1));
    for (const fe of ["ev", "aut", "grenz"]) {
      const y = sy(wertBei(punkte, k, fe));
      if (y >= box.y0 - luft && y <= box.y1 + luft) return true;
    }
  }
  return false;
}

/**
 * Bereich, den der Läufer belegt: Linie, Punkte und die Werte rechts davon (am rechten Rand links davon).
 * Kurven-Beschriftungen weichen ihm beim Platzieren aus; die Bühne blendet sie beim Ziehen hier aus.
 */
export function laeuferZone(g, x) {
  const links = x > g.w - g.r - 64;
  return { x0: links ? x - 66 : x - 26, x1: links ? x + 26 : x + 66, y0: 0, y1: g.h };
}

/** Rechteck der Beschriftung „Rechenbeispiel 300 kWp“ unten an ihrer Linie. */
export function rbBox(g, sx, rbKwp) {
  const rx = sx(rbKwp);
  const f = g.schrift - 0.5;
  return { x0: rx + 6, x1: rx + 6 + textBreite(`Rechenbeispiel ${zahl(rbKwp)} kWp`, f, false), y0: g.h - g.b - 8 - f, y1: g.h - g.b - 4 };
}

/** Beschriftung der Grenz-Linie am Läufer (jenseits des Knicks), zweizeilig. */
export const grenzBeschriftung = (g, grenz) =>
  g.mobil ? ["nächste kWh:", `nur ${zahl(grenz * 100)} % selbst`] : ["von jeder weiteren kWh", `nur noch ${zahl(grenz * 100)} % selbst genutzt`];

/**
 * Lage der Grenz-Beschriftung am Läufer: unter/über dem Grenz-Punkt, rechts/links – die erste Lage, die
 * keine Kurve schneidet, im Bild bleibt und die Läufer-Werte frei lässt.
 * @returns {{ x:number, y:number, anker:"start"|"end", box:{x0,x1,y0,y1}, zeile:number }}
 */
export function grenzTextLage(g, punkte, sx, sy, k, zeilen, hindernisse = []) {
  const f = g.schrift + (g.mobil ? 0 : 0.5);
  const zeile = f + 3;
  const w = Math.max(...zeilen.map((z) => textBreite(z, f)));
  const x = sx(k);
  const yG = sy(wertBei(punkte, k, "grenz"));
  const yEv = sy(wertBei(punkte, k, "ev"));
  const yAut = sy(wertBei(punkte, k, "aut"));
  const wLinks = x > g.w - g.r - 64;
  const werte = [yEv, yAut].map((y) => ({ x0: wLinks ? x - 58 : x + 4, x1: wLinks ? x - 4 : x + 58, y0: y - 13, y1: y + 9 }));
  const plot = { x0: g.l + 2, x1: g.w - g.r - 2, y0: g.t + 2, y1: g.h - g.b - 2 };
  const lagen = [
    ["rechts", true],
    ["links", true],
    ["rechts", false],
    ["links", false],
  ].map(([seite, unten]) => {
    const ax = seite === "rechts" ? x + 10 : x - 10;
    const y = unten ? yG + f + 6 : yG - 8 - zeile;
    const box = { x0: seite === "rechts" ? ax : ax - w, x1: seite === "rechts" ? ax + w : ax, y0: y - f * 0.8, y1: y + zeile + f * 0.22 };
    return { x: ax, y, anker: seite === "rechts" ? "start" : "end", box, zeile };
  });
  const frei = lagen.find(
    (l) => l.box.x0 >= plot.x0 && l.box.x1 <= plot.x1 && l.box.y0 >= plot.y0 && l.box.y1 <= plot.y1 && !kurveIn(l.box, punkte, sx, sy, 2) && !werte.some((b) => trifft(l.box, b, 2)) && !hindernisse.some((b) => trifft(l.box, b, 2))
  );
  if (frei) return frei;
  return lagen.find((l) => l.box.x0 >= plot.x0 && l.box.x1 <= plot.x1) || lagen[0];
}

/**
 * Direktbeschriftungen der drei Kurven mit Kollisionsprüfung: Jede Beschriftung sucht entlang ihrer Kurve
 * (nahe der bevorzugten Stelle zuerst, unterhalb/oberhalb) einen Platz, der keine Kurve schneidet, nicht über
 * den Rand ragt und keine feste Beschriftung, den Läufer oder die Grenz-Beschriftung berührt; dünne
 * Markierungslinien darf sie kreuzen (Halo). Findet sie keinen, entfällt sie – die Messwerte nennen Farbe
 * UND Wort. Läufer-Nähe beim Ziehen blendet die Bühne zur Laufzeit aus.
 */
function kurvenLabels({ g, punkte, sx, sy, hindernisse, dachX, knick }) {
  const f = g.schrift;
  const plot = { x0: g.l + 4, x1: g.w - g.r - 2, y0: g.t + 2, y1: g.h - g.b - 3 };
  const yBei = (x, feld) => sy(wertBei(punkte, sx.invert(x), feld));
  const defs = [
    { id: "ev", text: g.mobil ? "Eigenverbrauch" : "Eigenverbrauchsquote", feld: "ev", farbe: D.eigen, wunsch: 0.6, seiten: ["unter", "ueber"] },
    { id: "aut", text: "Autarkie", feld: "aut", farbe: D.last, wunsch: 0.22, seiten: ["ueber", "unter"] },
    { id: "grenz", text: g.mobil ? "nächste kWh" : "nächste kWh selbst genutzt", feld: "grenz", farbe: "rgba(255,255,255,0.72)", wunsch: 0.86, seiten: ["unter", "ueber"] },
  ];
  const belegt = [...hindernisse];
  const dachBox = dachX != null ? { x0: dachX, x1: g.w, y0: 0, y1: g.h } : null;
  const out = [];
  for (const def of defs) {
    if (def.id === "grenz" && knick) continue; // der Läufer beschriftet die Linie selbst
    const w = textBreite(def.text, f, def.id !== "grenz");
    const stellen = [];
    for (let st = 0.04; st <= 0.97; st += 0.02) stellen.push(st);
    stellen.sort((a, b) => Math.abs(a - def.wunsch) - Math.abs(b - def.wunsch));
    let gefunden = null;
    for (const mitDach of [true, false]) {
      for (const st of stellen) {
        const x = plot.x0 + (plot.x1 - plot.x0) * st;
        const x0 = x - w / 2;
        const x1 = x + w / 2;
        if (x0 < plot.x0 || x1 > plot.x1) continue;
        let yMin = Infinity;
        let yMaxK = -Infinity;
        for (let xx = x0; xx <= x1 + 0.1; xx += 3) {
          const y = yBei(Math.min(xx, x1), def.feld);
          yMin = Math.min(yMin, y);
          yMaxK = Math.max(yMaxK, y);
        }
        for (const seite of def.seiten) {
          const basis = seite === "ueber" ? yMin - 7 : yMaxK + f + 4;
          const box = { x0, x1, y0: basis - f * 0.8, y1: basis + f * 0.22 };
          if (box.y0 < plot.y0 || box.y1 > plot.y1) continue;
          if (kurveIn(box, punkte, sx, sy)) continue;
          if (belegt.some((b) => trifft(box, b, 4))) continue;
          if (mitDach && dachBox && trifft(box, dachBox, 2)) continue;
          gefunden = { ...def, x, y: basis, box };
          break;
        }
        if (gefunden) break;
      }
      if (gefunden) break;
    }
    if (gefunden) {
      belegt.push(gefunden.box);
      out.push(gefunden);
    }
  }
  return out;
}

/**
 * Statischer Läufer (SSR und Startbild): Linie, Punkte, Werte, dazu die zweizeilige Beschriftung der
 * Grenz-Linie (nur jenseits des Knicks sichtbar). Die Bühne bewegt ihn mit Feder (refs).
 */
export function LaeuferSvg({ g, x, yEv, yAut, yGrenz, evText, autText, grenzZeilen = ["", ""], grenzLage, knick = false, refs = {} }) {
  const links = x > g.w - g.r - 64;
  const dx = links ? -11 : 11;
  const anker = links ? "end" : "start";
  // Werte nicht übereinander schreiben, wenn EV und Autarkie nah beieinander liegen
  const abstand = yAut - yEv;
  const evDy = abstand < 22 ? -((22 - abstand) / 2) : 0;
  const autDy = abstand < 22 ? (22 - abstand) / 2 : 0;
  const halo = { stroke: D.grund, strokeWidth: 5, paintOrder: "stroke", strokeLinejoin: "round" };
  const lage = grenzLage || { x: x + 10, y: yGrenz + g.schrift + 6, anker: "start", zeile: g.schrift + 3 };
  return (
    <g ref={refs.gruppe} pointerEvents="none">
      <line ref={refs.linie} x1={x} x2={x} y1={g.t - 6} y2={g.h - g.b} stroke="rgba(255,255,255,0.78)" strokeWidth="1" />
      <circle ref={refs.grenz} cx={x} cy={yGrenz} r={knick ? 4.5 : 3.5} fill="#fff" stroke={D.grund} strokeWidth="2" />
      <circle ref={refs.aut} cx={x} cy={yAut} r="6.5" fill={D.last} stroke={D.grund} strokeWidth="3" />
      <circle ref={refs.ev} cx={x} cy={yEv} r="6.5" fill={D.eigen} stroke={D.grund} strokeWidth="3" />
      <text ref={refs.evText} x={x + dx} y={yEv + 4.5 + evDy} textAnchor={anker} className="ov-num font-display" fontSize={g.mobil ? 13 : 14.5} fontWeight="800" fill={D.eigen} {...halo}>
        {evText}
      </text>
      <text ref={refs.autText} x={x + dx} y={yAut + 4.5 + autDy} textAnchor={anker} className="ov-num font-display" fontSize={g.mobil ? 13 : 14.5} fontWeight="800" fill={D.last} {...halo}>
        {autText}
      </text>
      <text
        ref={refs.grenzText}
        data-k3-grenztext=""
        x={lage.x}
        y={lage.y}
        textAnchor={lage.anker}
        fontSize={g.schrift + (g.mobil ? 0 : 0.5)}
        fontWeight="700"
        fill="#fff"
        opacity={knick ? 1 : 0}
        style={{ transition: "opacity 320ms cubic-bezier(0.16,1,0.3,1)" }}
        className="motion-reduce:!transition-none"
        {...halo}
      >
        <tspan x={lage.x}>{grenzZeilen[0]}</tspan>
        <tspan x={lage.x} dy={lage.zeile}>
          {grenzZeilen[1]}
        </tspan>
      </text>
    </g>
  );
}

/**
 * Knick-Kurve als SVG. `overlay(g, skalen)` zeichnet den Läufer (Bühne: Feder, SSR: statisch),
 * `zeiger` (optional) die Ablese-Linie unter dem Mauszeiger, `pfad` die animierte Pfad-Komponente der Bühne.
 */
export function KurveSvg({ g, id, punkte, xMax, empfKwp, empfLabel = "Empfehlung", rbKwp, dachKwp, dachModell = false, overlay, zeiger, handlers = {}, pfad: Pfad, pfadProps, knick = false, laeuferKwp, knickFest = false }) {
  const { sx, sy } = kurvenSkalen(g, xMax);
  // Bühne: monotone Kurve (gleitet bei neuer Kurve); SSR: dieselben 61 Punkte linear verbunden – optisch gleich,
  // aber ein Drittel des HTML (der Platzhalter steht in HTML UND RSC-Daten)
  const form = Pfad ? curveMonotoneX : curveLinear;
  const lin = (feld) => line().x((p) => sx(p.kwp)).y((p) => sy(p[feld])).curve(form).digits(1)(punkte);
  const flaeche = area().x((p) => sx(p.kwp)).y0(sy(0)).y1((p) => sy(p.ev)).curve(form).digits(1)(punkte);
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const xT = xTicks(xMax, g.mobil);
  const letzterTick = xT[xT.length - 1];
  const dachX = dachKwp < xMax ? sx(dachKwp) : null;
  const ex = sx(empfKwp);
  const rx = sx(rbKwp);
  const f = g.schrift;
  const zeigeRb = rbKwp < xMax && Math.abs(rx - ex) > 2;

  // Empfehlungs-Beschriftung oben (zweizeilig), links der Linie wenn Platz ist
  const empfText = `${empfLabel}: ${zahl(empfKwp)} kWp`;
  const empfW = textBreite(empfText, f);
  const empfLinks = ex - g.l > empfW + 10;
  const dachRechts = dachX != null && g.w - g.r - dachX > (g.mobil ? 62 : 80);
  const dachTexte = dachX != null ? (dachModell && !g.mobil ? 3 : 2) : 0;

  // Hindernisse für die Kurven-Beschriftung: feste Texte (dünne Markierungslinien darf sie kreuzen)
  const hindernisse = [];
  if (zeigeRb) {
    hindernisse.push(rbBox(g, sx, rbKwp));
  }
  if (dachX != null) {
    const dw = textBreite("Dachgrenze", f);
    hindernisse.push({ x0: dachRechts ? dachX + 4 : dachX - dw - 8, x1: dachRechts ? dachX + dw + 8 : dachX - 4, y0: g.t, y1: g.t + 14 * dachTexte + 4 });
  }
  // … und der Läufer an der übernommenen Stelle samt Beschriftung der Grenz-Linie (beim Ziehen blendet die
  // Bühne nahe Beschriftungen aus; nach dem Loslassen stehen sie wieder frei)
  if (Number.isFinite(laeuferKwp)) {
    hindernisse.push(laeuferZone(g, sx(laeuferKwp)));
    if (knickFest) hindernisse.push(grenzTextLage(g, punkte, sx, sy, laeuferKwp, grenzBeschriftung(g, wertBei(punkte, laeuferKwp, "grenz")), zeigeRb ? [rbBox(g, sx, rbKwp)] : []).box);
  }
  const labels = kurvenLabels({ g, punkte, sx, sy, hindernisse, dachX, knick });

  const pfadAus = (art, props) => (Pfad ? <Pfad art={art} knick={knick} {...props} {...(pfadProps || {})} /> : <path {...props} />);

  return (
    <svg
      viewBox={`0 0 ${g.w} ${g.h}`}
      width="100%"
      className={["block h-auto w-full select-none overflow-visible", handlers.onClick ? "cursor-pointer" : ""].join(" ")}
      style={{ touchAction: "pan-y" }}
      role="img"
      aria-labelledby={`${id}-titel`}
      {...handlers}
    >
      <title id={`${id}-titel`}>{`Knick-Kurve: Eigenverbrauchsquote, Autarkie und Grenz-Eigenverbrauch über der Anlagengröße bis ${zahl(xMax)} kWp`}</title>
      <defs>
        <linearGradient id={`${id}-ev`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={D.eigen} stopOpacity="0.16" />
          <stop offset="1" stopColor={D.eigen} stopOpacity="0" />
        </linearGradient>
        <pattern id={`${id}-dach`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
        </pattern>
        <filter id={`${id}-glanz`} x="-5%" y="-40%" width="110%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Raster und Achsen */}
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={g.l} x2={g.w - g.r} y1={sy(v)} y2={sy(v)} stroke={v === 0 ? "rgba(255,255,255,0.22)" : D.raster} strokeWidth="1" />
          <text x={g.l - 8} y={sy(v) + 4} textAnchor="end" fontSize={f - 0.5} fill={D.text} className="ov-num">
            {zahl(v * 100)}
            {v === 1 ? " %" : ""}
          </text>
        </g>
      ))}
      {xT.map((k) => (
        <text key={k} x={sx(k)} y={g.h - g.b + f + 6} textAnchor={k === 0 ? "start" : "middle"} fontSize={f - 0.5} fill={D.text} className="ov-num">
          {zahl(k)}
          {k === letzterTick ? " kWp" : ""}
        </text>
      ))}

      {/* jenseits der Dachgrenze */}
      {dachX != null && (
        <g pointerEvents="none">
          <rect x={dachX} y={g.t} width={g.w - g.r - dachX} height={g.ih} fill={`url(#${id}-dach)`} />
          <line x1={dachX} x2={dachX} y1={g.t} y2={g.h - g.b} stroke={D.grenze} strokeWidth="1.25" />
          <text x={dachRechts ? dachX + 6 : dachX - 6} y={g.t + 14} textAnchor={dachRechts ? "start" : "end"} fontSize={g.mobil ? f - 0.5 : f} fontWeight="700" fill={D.textStark} stroke={D.grund} strokeWidth="4" paintOrder="stroke">
            Dachgrenze
          </text>
          <text x={dachRechts ? dachX + 6 : dachX - 6} y={g.t + 28} textAnchor={dachRechts ? "start" : "end"} fontSize={f - 0.5} fill={D.text} className="ov-num" stroke={D.grund} strokeWidth="4" paintOrder="stroke">
            {zahl(dachKwp)} kWp
          </text>
          {dachTexte === 3 && (
            <text x={dachRechts ? dachX + 6 : dachX - 6} y={g.t + 41} textAnchor={dachRechts ? "start" : "end"} fontSize={f - 0.5} fill={D.text} stroke={D.grund} strokeWidth="4" paintOrder="stroke">
              Modellhalle
            </text>
          )}
        </g>
      )}

      {/* Empfehlung: Ablese-Linien bei 80 % */}
      <g pointerEvents="none" data-testid="k3-empfehlung-marke" data-kwp={empfKwp}>
        <line x1={g.l} x2={ex} y1={sy(0.8)} y2={sy(0.8)} stroke={FARBE.ov300} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 4" />
        <line x1={ex} x2={ex} y1={g.t - 30} y2={g.h - g.b} stroke={FARBE.ov300} strokeOpacity="0.55" strokeWidth="1" strokeDasharray="3 4" />
        <text x={empfLinks ? ex - 7 : ex + 7} y={g.t - 20} textAnchor={empfLinks ? "end" : "start"} fontSize={f} fontWeight="700" fill={FARBE.ov300}>
          {empfLabel}: <tspan className="ov-num">{zahl(empfKwp)}</tspan> kWp
        </text>
        <text x={empfLinks ? ex - 7 : ex + 7} y={g.t - 6} textAnchor={empfLinks ? "end" : "start"} fontSize={f - 0.5} fill={D.text}>
          80 % Eigenverbrauch
        </text>
      </g>

      {/* Rechenbeispiel der Seite */}
      {zeigeRb && (
        <g pointerEvents="none">
          <line x1={rx} x2={rx} y1={g.t} y2={g.h - g.b} stroke="rgba(255,255,255,0.32)" strokeWidth="1" strokeDasharray="1 3" />
          <text
            x={rx + 6}
            y={g.h - g.b - 8}
            textAnchor="start"
            fontSize={f - 0.5}
            fill={D.text}
            stroke={D.grund}
            strokeWidth="4"
            paintOrder="stroke"
            data-k3-label="rb"
            data-fest="1"
            {...(() => {
              const b = rbBox(g, sx, rbKwp);
              return { "data-x0": Math.round(b.x0), "data-x1": Math.round(b.x1), "data-y0": Math.round(b.y0), "data-y1": Math.round(b.y1) };
            })()}
            style={{ transition: "opacity 200ms ease-out" }}
          >
            Rechenbeispiel <tspan className="ov-num">{zahl(rbKwp)}</tspan> kWp
          </text>
        </g>
      )}

      {/* Kurven (Bühne: Pfade gleiten bei neuer Kurve, die Grenz-Linie leuchtet jenseits des Knicks auf) */}
      {pfadAus("flaeche", { d: flaeche, fill: `url(#${id}-ev)` })}
      {Pfad && pfadAus("glanz", { d: lin("grenz"), fill: "none", stroke: "#fff", strokeWidth: 3, filter: `url(#${id}-glanz)` })}
      {pfadAus("grenz", { "data-art": "grenz", d: lin("grenz"), fill: "none", stroke: "#fff", strokeOpacity: knick ? 0.95 : 0.5, strokeWidth: knick ? 2 : 1.4, strokeDasharray: "4 4" })}
      {pfadAus("linie", { d: lin("aut"), fill: "none", stroke: D.last, strokeWidth: 2.4, strokeLinecap: "round" })}
      {pfadAus("linie", { d: lin("ev"), fill: "none", stroke: D.eigen, strokeWidth: 2.6, strokeLinecap: "round" })}

      {/* Direktbeschriftung statt Legende (kollisionsgeprüft) */}
      <g pointerEvents="none" fontSize={f} fontWeight="700">
        {labels.map((l) => (
          <text
            key={l.id}
            data-k3-label={l.id}
            data-x0={Math.round(l.box.x0)}
            data-x1={Math.round(l.box.x1)}
            data-y0={Math.round(l.box.y0)}
            data-y1={Math.round(l.box.y1)}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            fill={l.farbe}
            fontWeight={l.id === "grenz" ? 600 : 700}
            stroke={D.grund}
            strokeWidth="4"
            paintOrder="stroke"
            style={{ transition: "opacity 200ms ease-out" }}
          >
            {l.text}
          </text>
        ))}
      </g>

      {zeiger}
      {overlay?.(g, { sx, sy })}
    </svg>
  );
}

/**
 * Läufer-Leiste unter der Kurve: Spur, Füllung, Läufer-Pille; `eingabe` = natives range (Bühne).
 * px = true (Bühne): Pille per transform (kein Layout-Shift), Breite = gemessene Breite g.w.
 */
export function LaeuferLeiste({ g, xMax, min, max, kwp, eingabe, refs = {}, px = false }) {
  const { sx } = kurvenSkalen(g, xMax);
  const pct = (k) => (sx(k) / g.w) * 100;
  const a = pct(min);
  const b = pct(max);
  const v = pct(kwp);
  const pilleStil = px ? { left: 0, transform: `translateX(${Math.max(44, Math.min(g.w - 44, sx(kwp)))}px)` } : { left: `clamp(2.75rem, ${v}%, calc(100% - 2.75rem))` };
  return (
    <div className="relative h-14 select-none" style={{ touchAction: "pan-y" }}>
      <div aria-hidden="true" className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/[0.12]" style={{ left: `${a}%`, width: `${b - a}%` }} />
      <div ref={refs.fuellung} aria-hidden="true" className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/60" style={{ left: `${a}%`, width: `${Math.max(0, v - a)}%` }} />
      {eingabe?.({ a, b })}
      <div
        ref={refs.pille}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 flex h-9 -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-white px-3.5 font-display text-[14px] font-extrabold text-navy-950 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.6)] peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ov-400"
        style={pilleStil}
      >
        <span aria-hidden="true" className="absolute -top-1.25 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-xs bg-white" />
        <span ref={refs.pilleText} className="ov-num relative">
          {zahl(kwp)}
        </span>
        <span className="relative text-[0.62em] font-bold text-navy-950/60">kWp</span>
      </div>
    </div>
  );
}

/** Messwerte rechts (desktop) bzw. unter der Kurve (mobil). Jede Ausgabe gibt es genau einmal. */
export function Messwerte({ kwp, max, werte, Z = ZahlText }) {
  const anteilErz = Math.max(0.02, Math.min(1, kwp / max));
  const ev = Math.max(0, Math.min(1, werte.ev));
  const balken = "absolute inset-y-0 left-0 w-full origin-left transition-transform duration-300 ease-out motion-reduce:transition-none";
  return (
    <div className="md:rounded-3xl md:bg-white/[0.045] md:p-6">
      <dl className="grid grid-cols-3 gap-3 xl:grid-cols-1 xl:gap-0">
        <div className="hidden md:block">
          <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">Anlage</dt>
          <dd className="mt-1.5 font-display text-[30px] font-extrabold leading-none tracking-[-0.03em] text-white md:text-[40px] xl:text-[48px]">
            <output aria-live="off" data-testid="kwp-ausgabe">
              <Z wert={kwp} />
            </output>
            <Einheit>kWp</Einheit>
          </dd>
        </div>
        <div className="xl:mt-5 xl:border-t xl:border-white/[0.08] xl:pt-5">
          <dt className="flex items-center gap-1.5 text-[12px] font-semibold text-white/70 xl:text-[13px]">
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-ov-400" />
            <span>
              Eigenverbrauch<span className="hidden xl:inline">squote</span>
            </span>
          </dt>
          <dd className="mt-1.5 flex items-baseline justify-between gap-3">
            <span className="font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] text-ov-400 md:text-[30px] xl:text-[34px]">
              <output aria-live="off" data-testid="ev-ausgabe">
                <Z wert={werte.ev * 100} />
              </output>
              <span className="ml-0.5 text-[0.55em] font-bold text-ov-300/80">%</span>
            </span>
            <span className="hidden max-w-[9.5rem] text-right text-[12.5px] leading-snug text-white/60 xl:block">vom Solarstrom selbst genutzt</span>
          </dd>
        </div>
        <div className="xl:mt-5">
          <dt className="flex items-center gap-1.5 text-[12px] font-semibold text-white/70 xl:text-[13px]">
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-navy-300" />
            Autarkie
          </dt>
          <dd className="mt-1.5 flex items-baseline justify-between gap-3">
            <span className="font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] text-navy-300 md:text-[30px] xl:text-[34px]">
              <output aria-live="off" data-testid="autarkie-ausgabe">
                <Z wert={werte.aut * 100} />
              </output>
              <span className="ml-0.5 text-[0.55em] font-bold text-navy-200/80">%</span>
            </span>
            <span className="hidden max-w-[9.5rem] text-right text-[12.5px] leading-snug text-white/60 xl:block">vom Verbrauch durch die Sonne gedeckt</span>
          </dd>
        </div>
        <div className="md:hidden">
          <dt className="text-[12px] font-semibold text-white/70">Nächste 20 kWp</dt>
          <dd className="mt-1.5 font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] text-white">
            <Z wert={werte.grenz * 100} />
            <span className="ml-0.5 text-[0.55em] font-bold text-white/60">% selbst</span>
          </dd>
        </div>
      </dl>

      <div className="md:grid md:grid-cols-2 md:gap-6 xl:block">
        {/* Erzeugung = selbst genutzt + Überschuss; Balkenlänge wächst mit der Anlage (transform → kein Layout-Shift) */}
        <div className="mt-4 md:mt-5 xl:mt-7">
          <div className="flex items-baseline justify-between text-[13px] text-white/70">
            <span className="font-semibold">Erzeugung im Jahr</span>
            <span className="font-display text-[15px] font-extrabold text-white">
              <output aria-live="off">
                <Z wert={werte.erzeugtMwh} />
              </output>
              <span className="ml-1 text-[0.7em] font-bold text-white/60">MWh</span>
            </span>
          </div>
          <div aria-hidden="true" className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06] md:h-3">
            <div className={`${balken} bg-sun-300`} style={{ transform: `scaleX(${anteilErz})` }} />
            <div className={`${balken} bg-ov-400`} style={{ transform: `scaleX(${anteilErz * ev})` }} />
          </div>
          <div className="mt-2 flex items-start justify-between gap-3 text-[12.5px] leading-snug xl:mt-2.5">
            <p className="flex flex-wrap items-baseline gap-x-1.5">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 self-center rounded-full bg-ov-400" />
              <span className="font-display text-[14px] font-extrabold text-ov-300 md:text-[15px]">
                <output aria-live="off" data-testid="eigen-ausgabe">
                  <Z wert={werte.eigenMwh} />
                </output>
                <span className="ml-0.5 text-[0.75em] font-bold text-white/60">MWh</span>
              </span>
              <span className="whitespace-nowrap text-white/60 xl:basis-full xl:pl-3.5">selbst genutzt</span>
            </p>
            <p className="flex flex-wrap items-baseline justify-end gap-x-1.5 text-right">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 self-center rounded-full bg-sun-300" />
              <span className="font-display text-[14px] font-extrabold text-sun-300 md:text-[15px]">
                <output aria-live="off" data-testid="ueberschuss-ausgabe">
                  <Z wert={werte.ueberschussMwh} />
                </output>
                <span className="ml-0.5 text-[0.75em] font-bold text-white/60">MWh</span>
              </span>
              <span className="whitespace-nowrap text-white/60 xl:basis-full">Überschuss</span>
            </p>
          </div>
        </div>

        {/* Grenz-Eigenverbrauch: die Pointe der Knick-Kurve */}
        <div className="mt-5 hidden rounded-2xl bg-white/[0.05] px-4 py-3 md:block">
          <p className="text-[13px] leading-snug text-white/75">
            Von den <strong className="font-semibold text-white">nächsten 20 kWp</strong> nutzt der Betrieb noch
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <span className="font-display text-[22px] font-extrabold leading-none text-white">
              <output aria-live="off" data-testid="grenz-ausgabe">
                <Z wert={werte.grenz * 100} />
              </output>
              <span className="ml-0.5 text-[0.6em] font-bold text-white/60">%</span>
            </span>
            <span aria-hidden="true" className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.1]">
              <span className={`${balken} rounded-full bg-white/70`} style={{ transform: `scaleX(${Math.max(0, Math.min(1, werte.grenz))})` }} />
            </span>
            <span className="text-[12.5px] text-white/60">selbst</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Sprungmarken (gefüllte Chips). onWahl fehlt im SSR → reine Anzeige. */
export function Sprungmarken({ marken, kwp, onWahl }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0" role="group" aria-label="Anlagengröße direkt wählen">
      <ul className="flex w-max gap-2 md:w-auto md:flex-wrap">
        {marken.map((m) => {
          const aktiv = Math.abs(m.kwp - kwp) < 0.5;
          return (
            <li key={m.id}>
              <button
                type="button"
                data-testid={`marke-${m.id}`}
                aria-pressed={aktiv}
                onClick={onWahl ? () => onWahl(m.kwp, m.id) : undefined}
                className={[
                  "flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13.5px] font-semibold transition-colors duration-200",
                  aktiv ? "bg-white text-navy-950" : "bg-white/[0.07] text-white/80 hover:bg-white/[0.12]",
                ].join(" ")}
              >
                <span>{m.label}</span>
                <span className={["ov-num font-display font-extrabold", aktiv ? "text-navy-950/70" : "text-white/60"].join(" ")}>{zahl(m.kwp)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------
// B · Drei Tage
// ---------------------------------------------------------------------------------------------------

const uhr = (s, slots) => {
  const min = Math.round((s * 1440) / slots);
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
};

function bandLabel(b) {
  if (!b.summe) return `${b.titel}, ${b.datum}: wird gerechnet`;
  return `${b.titel}, ${b.datum}: Verbrauch ${zahl(b.summe.last)} Kilowattstunden, Sonne selbst genutzt ${zahl(b.summe.eigen)}, Sonne übrig ${zahl(b.summe.uebrig)}${
    b.summe.flotte > 0 ? `, davon E-Flotte ${zahl(b.summe.flotte)}` : ""
  }`;
}

/** Kurzes Label eines Tagesbands für die mobile Tagwahl. */
export function bandKurz(b) {
  if (b.id === "juni") return "Werktag";
  if (b.id === "samstag") return "Samstag";
  if (/^Betriebsurlaub/.test(b.titel)) return "Betriebsurlaub";
  if (/^Sonntag/.test(b.titel)) return "Sonntag";
  return "Ruhiger Tag";
}

const HALO = "[text-shadow:0_0_3px_#03122b,0_0_3px_#03122b,0_0_2px_#03122b]";

/**
 * Ein Tagesband (Slots × 100, preserveAspectRatio="none"): Last-Linie, PV genutzt/übrig, Netzbezug,
 * E-Flotte schraffiert; Beschriftung, Uhrzeiten und Zeiger in HTML (Prozent-Positionen).
 */
export function TagBand({ band, yMax, ersterBand, zeigerSlot, handlers, id, className = "" }) {
  const slots = band.L ? band.L.length : 96;
  const zeiger = zeigerSlot != null && band.L;
  const yP = (v) => 100 - Math.max(0, Math.min(1, v / yMax)) * 100;
  const xP = (s) => ((s + 0.5) / slots) * 100;
  let inhalt = null;
  if (band.L) {
    const { L, F, P } = band;
    const pfade = tagPfade(L, P, F && F.some((v) => v > 0) ? F : null, yMax);
    const m = (s) => Math.min(P[s], L[s]);
    let sG = 0;
    let sU = 0;
    for (let s = 0; s < slots; s++) {
      if (m(s) > m(sG)) sG = s;
      if (P[s] - L[s] > P[sU] - L[sU]) sU = s;
    }
    const sF = F ? F.findIndex((v) => v > 0) : -1;
    const iL = Math.min(slots - 1, Math.round(slots / 32));
    // Beschriftungen nur, wo Platz ist – „genutzt“ entfällt, wenn sie mit „übrig“ zusammenstieße
    const zeigU = (P[sU] - L[sU]) / yMax > 0.05;
    const xU = Math.min(90, Math.max(10, xP(sU)));
    const yGen = (100 + yP(m(sG))) / 2;
    const zeigG = m(sG) / yMax > 0.2 && !(zeigU && Math.abs(xP(sG) - xU) < 18 && Math.abs(yGen - yP(P[sU])) < 30);
    inhalt = (
      <>
        <TagFlaechen id={id} pfade={pfade} slots={slots} staerke={1.6} netzDeckkraft={0.17} flotteMuster />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-[11px] font-bold md:text-[11.5px]">
          {zeigG && (
            <span className="absolute -translate-x-1/2 -translate-y-1/2 text-navy-950" style={{ left: `${xP(sG)}%`, top: `${yGen}%` }}>
              genutzt
            </span>
          )}
          {zeigU && (
            <span className={`absolute -translate-x-1/2 text-sun-300 ${HALO}`} style={{ left: `${xU}%`, top: `calc(${yP(P[sU])}% - 1.15rem)` }}>
              übrig
            </span>
          )}
          {ersterBand && (
            <span className={`absolute text-navy-300 ${HALO}`} style={{ left: `${xP(iL)}%`, top: `calc(${yP(L[iL])}% - 1.15rem)` }}>
              Verbrauch
            </span>
          )}
          {ersterBand && sF >= 0 && (
            <span className={`absolute text-white ${HALO}`} style={{ left: `${xP(sF)}%`, top: `max(0px, calc(${yP(L[Math.min(slots - 1, sF + 2)])}% - 1.15rem))` }}>
              E-Flotte
            </span>
          )}
        </div>
        {zeiger && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute inset-y-0 w-px bg-white/70" style={{ left: `${xP(zeigerSlot)}%` }} />
            <span className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-300 ring-2 ring-navy-950" style={{ left: `${xP(zeigerSlot)}%`, top: `${yP(L[zeigerSlot])}%` }} />
            <span className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun-300 ring-2 ring-navy-950" style={{ left: `${xP(zeigerSlot)}%`, top: `${yP(P[zeigerSlot])}%` }} />
          </div>
        )}
      </>
    );
  } else {
    inhalt = <p className="absolute inset-0 flex items-center justify-center text-[12px] text-white/60">wird im Browser aus dem Lastgang gerechnet</p>;
  }

  return (
    <div className={["min-w-0", className].join(" ")} data-testid={`tag-${band.id}`}>
      <h4 className="font-display text-[14px] font-bold text-white md:text-[14.5px]">
        {band.titel} <span className="ml-1 font-sans text-[12.5px] font-medium text-white/60">{band.datum}</span>
      </h4>
      <div
        className="relative mt-1.5 aspect-[350/112] select-none overflow-hidden rounded-xl bg-white/[0.03] md:aspect-[380/156]"
        style={{ touchAction: "pan-y" }}
        role="img"
        aria-label={bandLabel(band)}
        {...(handlers || {})}
      >
        {/* Zeichenfläche: oben 8 px Luft, unten 20 px für die Uhrzeiten */}
        <div className="absolute inset-x-0 bottom-5 top-2">
          {[6, 12, 18].map((h) => (
            <span key={h} aria-hidden="true" className="absolute inset-y-0 w-px bg-white/[0.08]" style={{ left: `${(h / 24) * 100}%` }} />
          ))}
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
          {inhalt}
        </div>
        {[6, 12, 18].map((h) => (
          <span key={h} aria-hidden="true" className="ov-num absolute bottom-0.5 -translate-x-1/2 text-[10.5px] text-white/60 md:text-[11px]" style={{ left: `${(h / 24) * 100}%` }}>
            {String(h).padStart(2, "0")}:00
          </span>
        ))}
        {zeiger && (
          <span aria-hidden="true" className="ov-num pointer-events-none absolute right-1.5 top-1.5 z-[1] whitespace-nowrap rounded-full bg-navy-950/90 px-2 py-0.5 text-[11.5px] text-white/85">
            {uhr(zeigerSlot, slots)} · Verbrauch <span className="font-semibold text-navy-300">{zahl(band.L[zeigerSlot])}</span> · Sonne{" "}
            <span className="font-semibold text-sun-300">{zahl(band.P[zeigerSlot])}</span> kW
          </span>
        )}
      </div>
      <dl className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[11.5px] leading-tight sm:gap-x-3 md:gap-x-4 md:text-[12px]">
        <BandWert farbe="bg-navy-300" label="Verbrauch" wert={band.summe?.last} />
        <BandWert farbe="bg-ov-400" label="genutzt" wert={band.summe?.eigen} />
        <BandWert farbe="bg-sun-300" label="übrig" wert={band.summe?.uebrig} />
      </dl>
    </div>
  );
}

function BandWert({ farbe, label, wert }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="flex items-center gap-1.5 text-white/60">
        <span aria-hidden="true" className={`h-2 w-2 rounded-full ${farbe}`} />
        {label}
      </dt>
      <dd className="ov-num font-display text-[13px] font-extrabold text-white">
        {Number.isFinite(wert) ? zahl(wert) : "–"}
        <span className="ml-0.5 text-[0.75em] font-bold text-white/60">kWh</span>
      </dd>
    </div>
  );
}

/** Mobile Tagwahl im SSR (Anzeige; die Bühne reicht eine echte Radiogruppe herein). */
function TagWahlStatisch({ baender, aktiv }) {
  return (
    <div aria-hidden="true" className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-white/[0.07] p-1">
      {baender.map((b, i) => (
        <span key={b.id} className={["flex min-h-9 items-center rounded-full px-3 text-[13px] font-semibold", i === aktiv ? "bg-white text-navy-950" : "text-white/75"].join(" ")}>
          {bandKurz(b)}
        </span>
      ))}
    </div>
  );
}

/**
 * E-Flotte: Stepper + 20 Ladepunkte; Steuerung kommt von der Bühne (SSR: nur Anzeige).
 * Ladeleistung und Tagesenergie stehen auch bei 0 Fahrzeugen da (gleiche Höhe in SSR und Bühne).
 */
export function FlotteBlock({ n, max, annahme, bedarfTag, steuerung }) {
  const kwhTag = bedarfTag ? n * bedarfTag : 0;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2.5 rounded-3xl bg-white/[0.045] p-3.5 md:gap-x-5 md:gap-y-3 md:p-5 lg:grid-cols-[minmax(0,15rem)_auto_minmax(0,1fr)] lg:gap-x-8">
      <div className="min-w-0">
        <p id="k3-flotte-label" className="font-display text-[15px] font-bold leading-snug text-white">
          E-Transporter, die mittags laden
        </p>
        <p className="mt-0.5 text-[12.5px] leading-snug text-white/60">
          <span className="hidden sm:inline">je </span>
          <span className="ov-num">{zahl(LADEN.kw)}</span> kW AC ab {String(LADEN.abStunde).padStart(2, "0")}:00<span className="hidden sm:inline"> an Arbeitstagen</span>
        </p>
      </div>
      {steuerung ?? (
        <div className="flex items-center gap-1 rounded-full bg-white/[0.07] p-1">
          <span className="flex h-12 w-12 items-center justify-center rounded-full text-[22px] font-bold text-white/60 md:h-11 md:w-11" aria-hidden="true">
            −
          </span>
          <span className="ov-num flex h-12 w-12 items-center justify-center font-display text-[20px] font-extrabold text-white md:h-11">{n}</span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full text-[22px] font-bold text-white/60 md:h-11 md:w-11" aria-hidden="true">
            +
          </span>
        </div>
      )}
      <div className="col-span-2 min-w-0 lg:col-span-1">
        <div aria-hidden="true" className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1">
          {Array.from({ length: max }, (_, i) => (
            <span key={i} className={["h-3 rounded-[3px] transition-colors duration-300 motion-reduce:transition-none md:h-4", i < n ? "bg-white/85" : "bg-white/[0.1]"].join(" ")} />
          ))}
        </div>
        <p className="mt-1.5 hidden justify-between gap-3 text-[12px] text-white/60 sm:flex">
          <span>
            Ladeleistung <strong className="ov-num font-semibold text-white">{zahl(n * LADEN.kw)} kW</strong>
          </span>
          <span>
            <strong className="ov-num font-semibold text-white">{zahl(kwhTag)} kWh</strong> je Arbeitstag
          </span>
        </p>
      </div>
      <p className="col-span-2 text-[11.5px] leading-snug text-white/60 sm:text-[12px] lg:col-span-3">
        Annahme wie E-Flotten-Rechner:{" "}
        <span className="hidden sm:inline">
          <span className="ov-num">{zahl(annahme.km)}</span> km/Jahr × <span className="ov-num">{zahl(annahme.kwh100)}</span> kWh/100 km ={" "}
        </span>
        <span className="ov-num">{zahl((annahme.km * annahme.kwh100) / 100)}</span> <span className="hidden sm:inline">kWh je Fahrzeug und Jahr, verteilt auf die Arbeitstage eines Jahres.</span>
        <span className="sm:hidden">kWh je Fahrzeug und Jahr.</span>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------
// C · Was Überschuss wert ist
// ---------------------------------------------------------------------------------------------------

/**
 * 24 Monatsbalken Referenzmarktwert PV gegen die Linie „selbst genutzt“. g.kompakt (mobil/mittel):
 * Beschriftungen einzeilig über der Linie – unter 1.024 px ist für zweizeilige Etiketten kein Platz.
 */
export function MarktSvg({ g, id, monate, eigenCt, auswahl, zeiger, handlers = {} }) {
  const sx = scaleBand()
    .domain(monate.map((_, i) => i))
    .range([g.l, g.w - g.r])
    .paddingInner(g.mobil ? 0.22 : 0.3);
  const yMax = Math.max(16, Math.ceil(eigenCt + 1.5));
  const sy = scaleLinear().domain([0, yMax]).range([g.h - g.b, g.t]);
  const f = g.schrift;
  const bw = sx.bandwidth();
  const iApr = monate.findIndex((m) => m.monat === "2026-04");
  const iJan = monate.findIndex((m) => m.monat === "2026-01");
  const jahre = monate.map((m, i) => (i === 0 || m.monat.endsWith("-01") ? i : -1)).filter((i) => i >= 0);
  const hell = zeiger ?? auswahl;
  const halo = { stroke: D.grund, strokeWidth: 3.5, paintOrder: "stroke" };
  return (
    <svg viewBox={`0 0 ${g.w} ${g.h}`} width="100%" className="block h-auto w-full select-none" style={{ touchAction: "pan-y" }} role="img" aria-labelledby={`${id}-titel`} {...handlers}>
      <title id={`${id}-titel`}>{`Referenzmarktwert Photovoltaik je Monat von ${monatText(monate[0].monat)} bis ${monatText(monate[monate.length - 1].monat)} zwischen ${ct(Math.min(...monate.map((m) => m.ct)))} und ${ct(Math.max(...monate.map((m) => m.ct)))} Cent je Kilowattstunde, gegenüber ${ct(eigenCt)} Cent für eine selbst genutzte Kilowattstunde`}</title>
      {[0, 5, 10, 15].filter((v) => v <= yMax).map((v) => (
        <line key={v} x1={g.l} x2={g.w - g.r} y1={sy(v)} y2={sy(v)} stroke={v === 0 ? "rgba(255,255,255,0.2)" : D.raster} />
      ))}
      {monate.map((m, i) => (
        <rect
          key={m.monat}
          x={sx(i)}
          y={sy(m.ct)}
          width={bw}
          height={Math.max(1, sy(0) - sy(m.ct))}
          rx={Math.min(3, bw / 3)}
          fill={D.uebrig}
          fillOpacity={hell == null ? 0.82 : hell === i ? 1 : 0.38}
        />
      ))}
      {auswahl != null && <rect x={sx(auswahl) - 2} y={sy(eigenCt) + 5} width={bw + 4} height={sy(0) - sy(eigenCt) - 3} rx="4" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" pointerEvents="none" />}
      {/* Linie: Wert der selbst genutzten kWh */}
      <line x1={g.l} x2={g.w - g.r} y1={sy(eigenCt)} y2={sy(eigenCt)} stroke={D.eigen} strokeWidth="2.25" />
      <text x={g.kompakt ? g.l : g.w - g.r} y={sy(eigenCt) - 8} textAnchor={g.kompakt ? "start" : "end"} fontSize={f} fontWeight="800" fill={D.eigen} {...halo} strokeWidth="4">
        selbst genutzt: <tspan className="ov-num">{ct(eigenCt)}</tspan> ct
      </text>
      {/* Direktbeschriftung der Extreme */}
      {iApr >= 0 &&
        (() => {
          // über den Nachbarbalken beschriften, mit feiner Führungslinie zum Balken
          const nachbarn = monate.slice(Math.max(0, iApr - 1), iApr + 2).map((x) => x.ct);
          const yOben = sy(Math.max(...nachbarn)) - 6;
          const xm = sx(iApr) + bw / 2;
          return (
            <g pointerEvents="none" fontSize={f} textAnchor="middle">
              <line x1={xm} x2={xm} y1={yOben - 2} y2={sy(monate[iApr].ct) - 3} stroke="rgba(255,255,255,0.45)" />
              <text x={xm} y={yOben - 18} fill={D.text} {...halo}>
                {g.mobil ? "Apr 26" : "April 2026"}
              </text>
              <text x={xm} y={yOben - 4} fill={D.uebrig} fontWeight="800" className="ov-num" {...halo}>
                {ct(monate[iApr].ct)} ct
              </text>
            </g>
          );
        })()}
      {iJan >= 0 && g.kompakt && (
        // kompakt: einzeilig über der Linie (rechts daneben ist kein Platz)
        <text x={Math.min(g.w - g.r - (g.mobil ? 48 : 80), sx(iJan) + bw / 2)} y={sy(eigenCt) - 8} textAnchor="middle" fontSize={f} fill={D.text} {...halo} pointerEvents="none">
          {g.mobil ? "Jän 26" : "Jänner 2026"}:{" "}
          <tspan fill={D.uebrig} fontWeight="800" className="ov-num">
            {ct(monate[iJan].ct)} ct
          </tspan>
        </text>
      )}
      {iJan >= 0 && !g.kompakt && (
        <g pointerEvents="none" fontSize={f} textAnchor="start">
          <text x={sx(iJan) + bw + 5} y={sy(monate[iJan].ct) + f + 6} fill={D.text}>
            Jänner 2026
          </text>
          <text x={sx(iJan) + bw + 5} y={sy(monate[iJan].ct) + 2 * f + 9} fill={D.uebrig} fontWeight="800" className="ov-num" {...halo}>
            {ct(monate[iJan].ct)} ct
          </text>
        </g>
      )}
      {jahre.map((i) => (
        <g key={i} pointerEvents="none">
          {i > 0 && <line x1={sx(i) - (sx.step() - bw) / 2} x2={sx(i) - (sx.step() - bw) / 2} y1={g.t} y2={g.h - g.b + 6} stroke="rgba(255,255,255,0.18)" />}
          <text x={sx(i)} y={g.h - 5} fontSize={f - 0.5} fill={D.text} className="ov-num">
            {g.mobil ? monatText(monate[i].monat, true) : monatText(monate[i].monat)}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Überschuss-Weiche: vier Wege mit Stand (mobil als waagrechte Karten mit Einrasten). */
export function Weiche({ wege, kwp, ueberschussMwh, Z = ZahlText }) {
  return (
    <div className="min-w-0">
      <h4 className="font-display text-[15.5px] font-bold text-white md:text-[16px]">
        Wohin mit{" "}
        <span className="text-sun-300">
          <Z wert={ueberschussMwh} /> MWh
        </span>{" "}
        Überschuss?
      </h4>
      <ul className="-mx-5 mt-2.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
        {wege.map((w) => {
          const aus = w.grenzeKwp != null && kwp >= w.grenzeKwp;
          return (
            <li
              key={w.id}
              data-weg={w.id}
              data-aus={aus ? "1" : undefined}
              className={[
                "flex w-[82%] max-w-[20rem] shrink-0 snap-start flex-col rounded-2xl bg-white/[0.045] p-3.5 transition-opacity duration-300 sm:w-[46%] md:p-4 lg:w-auto lg:max-w-none",
                aus ? "opacity-50" : "",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="font-display text-[14.5px] font-bold text-white [hyphens:manual]">{w.titel}</p>
                <p className="ov-num whitespace-nowrap font-display text-[14px] font-extrabold text-sun-300">{w.wert}</p>
              </div>
              <p className="mt-1.5 hidden text-[13px] leading-snug text-white/70 md:block">{w.text}</p>
              {w.kurz && <p className="mt-1 text-[12.5px] leading-snug text-white/75 md:hidden">{w.kurz}</p>}
              {aus && (
                <p className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-[12px] font-semibold text-white/80">
                  ab {zahl(w.grenzeKwp)} kW Engpassleistung nicht verfügbar
                </p>
              )}
              <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-2 text-[12px]">
                <span className="text-white/60">
                  <span className="sm:hidden">{w.standKurz || w.stand}</span>
                  <span className="hidden sm:inline">{w.stand}</span>
                </span>
                {w.href && (
                  <Link href={w.href} className="font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-2 hover:decoration-ov-300">
                    {w.linkText}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------
// Gesamtansicht
// ---------------------------------------------------------------------------------------------------

/**
 * @param {object} p
 *  mobil (true/false; null = SSR beide), stufeMarkt ("mobil" | "mittel" | "desktop"; null = SSR alle),
 *  quelle, ortLabel, rechnet, punkte, xMax, min, max, kwp, empfKwp, empfLabel, rbKwp, dachKwp, dachAusK2,
 *  werte, knick, marken, woche { woche, yMax, jahr }, baender, tagAktiv, yMax,
 *  flotte { n, max, annahme, bedarfTag }, markt { monate, eigenCt, wege }, monat, monatZeiger,
 *  breiten { kurve, markt }, refs { kurve, markt }, Z, slots { … }, handlers { … }
 */
export default function K3Ansicht(p) {
  const s = p.slots || {};
  const h = p.handlers || {};
  const Z = p.Z || ZahlText;
  const idBasis = p.idBasis || "k3s";
  const tagAktiv = p.tagAktiv ?? 0;
  return (
    <div className="relative" data-k3={p.modus || "ssr"}>
      {/* A · Knick-Kurve + Wochenstreifen (Ursache und Wirkung in einem Blick) */}
      <div className="grid gap-4 md:gap-5 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-12">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h3 className="font-display text-[18px] font-bold tracking-[-0.01em] text-white md:text-[20px]">
              Knick-Kurve<span className="hidden sm:inline">: Eigenverbrauch und Autarkie nach Anlagengröße</span>
            </h3>
            <QuelleMarke quelle={p.quelle} ortLabel={p.ortLabel} />
          </div>
          <div ref={p.refs?.kurve} className="relative mt-2 md:mt-3">
            <span aria-hidden={!p.rechnet} className={["pointer-events-none absolute right-0 top-0 text-[12px] text-white/60 transition-opacity duration-300", p.rechnet ? "opacity-100" : "opacity-0"].join(" ")}>
              rechnet …
            </span>
            <Varianten
              stufe={p.mobil}
              render={(m) => {
                const g = geo("kurve", m, p.breiten?.kurve);
                return (
                  <KurveSvg
                    g={g}
                    id={`${idBasis}-k${g.mobil ? "m" : "d"}`}
                    punkte={p.punkte}
                    xMax={p.xMax}
                    empfKwp={p.empfKwp}
                    empfLabel={p.empfLabel}
                    rbKwp={p.rbKwp}
                    dachKwp={p.dachKwp}
                    dachModell={!p.dachAusK2}
                    handlers={h.kurve}
                    pfad={s.pfad}
                    pfadProps={s.pfadProps}
                    knick={!!p.knick}
                    laeuferKwp={p.kwpFest ?? p.kwp}
                    knickFest={!!p.knickFest}
                    zeiger={s.zeiger?.(g)}
                    overlay={
                      s.laeufer ||
                      ((gg, { sx, sy }) => (
                        <LaeuferSvg
                          g={gg}
                          x={sx(p.kwp)}
                          yEv={sy(p.werte.ev)}
                          yAut={sy(p.werte.aut)}
                          yGrenz={sy(p.werte.grenz)}
                          evText={`${prozentZahl(p.werte.ev)} %`}
                          autText={`${prozentZahl(p.werte.aut)} %`}
                        />
                      ))
                    }
                  />
                );
              }}
            />
          </div>
          {/* mobil: Wochenstreifen ÜBER dem Regler (Daumen verdeckt nichts), ab md: Regler direkt unter der Kurve */}
          <div className="flex flex-col">
            <div className="order-2 md:order-1">
              <Varianten stufe={p.mobil} render={(m) => <LaeuferLeiste g={geo("kurve", m, p.breiten?.kurve)} xMax={p.xMax} min={p.min} max={p.max} kwp={p.kwp} eingabe={s.eingabe} refs={s.leisteRefs} px={!!s.eingabe} />} />
            </div>
            <div className="order-1 mt-3">{s.woche ?? (p.woche && <K3Woche {...p.woche} kwp={p.kwp} kwpText={p.kwp} quelle={p.quelle} idBasis={`${idBasis}-w`} />)}</div>
            <div className="order-3 mt-1 flex flex-col gap-2 md:mt-5">
              <Sprungmarken marken={p.marken} kwp={p.kwp} onWahl={h.marke} />
              {!p.dachAusK2 && (
                <p className="hidden text-[12.5px] leading-snug text-white/60 md:block">
                  Dachgrenze der Modellhalle aus{" "}
                  <a href="#hallendach" className="font-semibold text-white/80 underline decoration-white/30 underline-offset-2 hover:decoration-white/70">
                    Kapitel 02
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <Messwerte kwp={p.kwp} max={p.max} werte={p.werte} Z={Z} />
        </div>
      </div>
      {s.erkenntnisA}

      {/* Vertiefen (Jury 13.10.2026: ein Instrument sichtbar, Zweit-Grafiken in die Schublade). Im SSR-Startzustand
          nur Zusammenfassung und Ersatztext – die Bühne liefert Tagesbänder, E-Flotte und Marktwert nach (leichteres HTML). */}
      <Vertiefen
        dunkel
        className="mt-8 md:mt-12"
        data-testid="k3-vertiefen"
        titel="Drei Tage im Detail, E-Flotte und was Überschuss wert ist"
        inhalt="Werktag, Samstag und Betriebsurlaub je Viertelstunde · E-Transporter mittags laden · Marktwert eingespeister kWh"
        ersatz="Werktag, Samstag und Betriebsurlaub in Viertelstunden, E-Transporter, die mittags laden, und der Referenzmarktwert des Überschusses – die Zahlen dazu stehen unter „Begriffe und Regeln“."
      >
        {p.slots ? (
          <>
      <div>
        <h3 className="font-display text-[18px] font-bold tracking-[-0.01em] text-white md:text-[20px]">
          Drei Tage im Detail<span className="hidden sm:inline">: wo die Sonne auf die Schicht trifft</span>
        </h3>
        <p className="mt-2 hidden max-w-[68ch] text-[15px] leading-relaxed text-white/70 md:block">
          Solarstrom bei <strong className="ov-num font-semibold text-white">{zahl(p.kwp)} kWp</strong> je Viertelstunde – <span className="font-semibold text-ov-300">genutzt</span>,{" "}
          <span className="font-semibold text-sun-300">übrig</span> und Netzbezug <span className="text-navy-300">(blau)</span>. Gleiche Skala für alle drei Tage; die E-Flotte lädt an
          Arbeitstagen.
        </p>
        <div className="mt-3 md:mt-5">
          <FlotteBlock n={p.flotte.n} max={p.flotte.max} annahme={p.flotte.annahme} bedarfTag={p.flotte.bedarfTag} steuerung={s.flotteSteuerung} />
        </div>
        <div className="mt-3 md:hidden">{s.tagWahl ?? <TagWahlStatisch baender={p.baender} aktiv={tagAktiv} />}</div>
        <div className="mt-3 grid gap-3 md:mt-6 md:grid-cols-3 md:gap-5">
          {p.baender.map((b, i) => (
            <TagBand
              key={b.id}
              id={`${idBasis}-b${i}`}
              band={b}
              yMax={p.yMax}
              ersterBand={i === 0}
              zeigerSlot={p.zeigerSlot}
              handlers={h.band}
              className={i === tagAktiv ? "" : "max-md:hidden"}
            />
          ))}
        </div>
      </div>
      {s.erkenntnisB}

      {/* C · Was Überschuss wert ist */}
      <div className="mt-8 md:mt-14">
        <div className="grid gap-x-12 gap-y-1.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h3 className="font-display text-[18px] font-bold tracking-[-0.01em] text-white md:text-[20px]">Was Überschuss wert ist</h3>
            <p className="mt-2 hidden max-w-[60ch] text-[15px] leading-relaxed text-white/70 md:block">
              Referenzmarktwert Photovoltaik je Monat – so viel brachte eingespeister Sonnenstrom im Mittel am Markt – gegen den Wert einer selbst genutzten Kilowattstunde.
            </p>
          </div>
          <MarktAblesung markt={p.markt} monat={p.monatZeiger ?? p.monat} />
        </div>
        <div
          ref={p.refs?.markt}
          className="relative mt-4 rounded-2xl has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ov-400 md:mt-5"
        >
          <Varianten
            drei
            stufe={p.stufeMarkt}
            render={(m) => <MarktSvg g={geo("markt", m, p.breiten?.markt)} id={`${idBasis}-m${m === true ? "mobil" : m || "d"}`} monate={p.markt.monate} eigenCt={p.markt.eigenCt} auswahl={p.monat} zeiger={p.monatZeiger} handlers={h.markt} />}
          />
          {s.marktEingabe}
        </div>
        <div className="mt-5 md:mt-8">
          <Weiche wege={p.markt.wege} kwp={p.kwp} ueberschussMwh={p.werte.ueberschussMwh} Z={Z} />
        </div>
      </div>
      {s.erkenntnisC}
          </>
        ) : null}
      </Vertiefen>

      <div className="mt-4 grid gap-1 md:mt-8">
        <Kennzeichnung dunkel>{p.quelle === "eigen" ? "Ihr Lastgang – gerechnet in diesem Browser; die Datei verlässt Ihr Gerät nicht" : KENNZEICHNUNG.synthetisch}</Kennzeichnung>
        <Kennzeichnung dunkel>{KENNZEICHNUNG.pvModell}</Kennzeichnung>
      </div>
      {s.ansage}
    </div>
  );
}

function QuelleMarke({ quelle, ortLabel }) {
  const pille = "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] md:px-3 md:py-1 md:text-[12.5px]";
  return (
    <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
      {quelle === "eigen" ? (
        <span className={`${pille} bg-ov-400 font-bold text-navy-950`} data-testid="k3-ihr-lastgang">
          Ihr Lastgang
        </span>
      ) : (
        <span className={`${pille} bg-white/[0.07] font-medium text-white/70`}>
          <span className="md:hidden">Synthetisch</span>
          <span className="hidden md:inline">Beispielbetrieb · synthetisch</span>
        </span>
      )}
      {ortLabel && <span className={`${pille} bg-white/[0.07] font-medium text-white/70`}>{ortLabel}</span>}
    </div>
  );
}

/** Ablesung zum Marktwert-Streifen: Zusammenfassung oder gewählter Monat. */
function MarktAblesung({ markt, monat }) {
  const m = monat != null ? markt.monate[monat] : null;
  const werte = markt.monate.map((x) => x.ct);
  const mittel = werte.reduce((a, b) => a + b, 0) / werte.length;
  return (
    <p className="mt-2 min-h-[2.6rem] text-[13px] leading-snug text-white/75 lg:mt-0 lg:text-[13.5px]" aria-live="polite">
      {m ? (
        <>
          <strong className="font-semibold text-white">{monatText(m.monat)}:</strong> am Markt <span className="ov-num font-semibold text-sun-300">{ct(m.ct)} ct/kWh</span> · selbst genutzt{" "}
          <span className="ov-num font-semibold text-ov-300">{ct(markt.eigenCt)} ct</span> –{" "}
          <span className="font-semibold text-white">
            <span className="ov-num">{zahl(markt.eigenCt / m.ct, 1)}</span>-mal
          </span>{" "}
          so viel.
        </>
      ) : (
        <>
          Referenzmarktwert PV, 24 Monate: <span className="ov-num">{ct(Math.min(...werte))}</span> bis <span className="ov-num">{ct(Math.max(...werte))}</span> ct/kWh, Mittel{" "}
          <span className="ov-num">{ct(mittel)}</span> ct · E-Control (§ 13 EAG) · Richtwert
        </>
      )}
    </p>
  );
}
