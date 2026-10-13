// src/components/GewerbeUnikat/K7Faecher.js
//
// K7 · 25-Jahre-Fächer: Geometrie (d3-scale) und Zeichnung (d3-shape) des kumulierten Cashflows dreier
// Stresstest-Läufe. REINE Komponente/Funktionen (keine Hooks, kein "use client"):
//  - Server-Hülle: zeichnet den Fächer im Startzustand zweimal (mobil 358 × 240, desktop 760 × 330, per CSS
//    umgeschaltet) – ohne JS lesbar, gleiche Seitenverhältnisse wie die Bühne (kein CLS).
//  - Client (K7Stresstest): misst die Breite (viewBox = Pixel, Schrift wird nicht skaliert) und reicht über
//    `Pfad` animierte Pfade (motion) herein; Beschriftungen gleiten per CSS-Übergang.
//
// Farben (eine Farbe = eine Bedeutung): Wert/Ersparnis = ov (hell: ov-600 Linie, ov-100 Band, ov-300 Ränder),
// Raster = Haarlinien 8 %, Nulllinie ink-900 mit 45 %. Keine Legende – die Linien sind direkt beschriftet.

import { area, curveMonotoneX, line } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { BEDEUTUNG, FARBE, zahl } from "./_tokens.js";

/** Grund-Geometrien (Breite × Höhe = Seitenverhältnis) und Ränder in px. */
export const FAECHER = {
  mobil: { w: 358, h: 240, l: 36, r: 74, t: 20, b: 24, schrift: 10.5 },
  desktop: { w: 760, h: 330, l: 48, r: 120, t: 26, b: 30, schrift: 12 },
};

export const JAHRE = 25;
const X_TICKS = [0, 5, 10, 15, 20, 25];

export const F = {
  band: FARBE.ov100,
  rand: FARBE.ov300,
  erwartet: FARBE.ov600,
  erwartetText: FARBE.ov700,
  text: FARBE.ink500,
  textStark: FARBE.ink700,
  null: "rgba(21,26,36,0.45)",
  raster: BEDEUTUNG.raster.hell,
  minus: "rgba(21,26,36,0.035)",
  lese: "rgba(21,26,36,0.4)",
};

const LAEUFE = [
  { id: "g", name: "Günstig" },
  { id: "e", name: "Erwartet" },
  { id: "k", name: "Konservativ" },
];

/**
 * Pixel-Geometrie für eine Breite.
 * @param {{k:number[], e:number[], g:number[]}} reihen kumulierter Cashflow Jahr 0–25 (€)
 * @param {{k:number|null, e:number|null, g:number|null}} amort Amortisation in Jahren (null = nicht in 25 J.)
 * @param {object} g FAECHER.mobil | FAECHER.desktop
 * @param {number} [w] gemessene Breite (Standard: Grundbreite)
 */
export function faecherGeo(reihen, amort, g, w = g.w) {
  const h = Math.round((w * g.h) / g.w);
  const x = scaleLinear().domain([0, JAHRE]).range([g.l, w - g.r]);
  const alle = [...reihen.k, ...reihen.e, ...reihen.g];
  const lo = Math.min(0, ...alle);
  const hi = Math.max(0, ...alle);
  const pad = (hi - lo) * 0.06 || 1;
  const y = scaleLinear()
    .domain([lo - pad * 0.5, hi + pad])
    .range([h - g.b, g.t]);
  const pts = (arr) => arr.map((v, i) => [x(i), y(v)]);
  const ticksY = y.ticks(g === FAECHER.mobil ? 4 : 5).map((v) => ({ v, y: y(v) }));

  // Marker an der Amortisation (Schnitt mit der Nulllinie)
  const marker = ["k", "e", "g"]
    .map((id) => (amort[id] != null && amort[id] <= JAHRE ? { id, a: amort[id], x: x(amort[id]), y: y(0) } : null))
    .filter(Boolean);

  // Direktbeschriftung am rechten Ende – Mindestabstand zwei Zeilen
  const zeile = g.schrift * 1.25;
  const gap = zeile * 2 + 2;
  const enden = LAEUFE.map((l) => ({ ...l, wert: reihen[l.id][JAHRE], y: y(reihen[l.id][JAHRE]) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < enden.length; i++) if (enden[i].y - enden[i - 1].y < gap) enden[i].y = enden[i - 1].y + gap;
  const unten = h - g.b - zeile;
  if (enden.length && enden[enden.length - 1].y > unten) {
    enden[enden.length - 1].y = unten;
    for (let i = enden.length - 2; i >= 0; i--) if (enden[i + 1].y - enden[i].y < gap) enden[i].y = enden[i + 1].y - gap;
  }

  return {
    w,
    h,
    g,
    x0: g.l,
    x1: w - g.r,
    yNull: y(0),
    yUnten: h - g.b,
    ticksY,
    ticksX: X_TICKS.map((j) => ({ j, x: x(j) })),
    schritt: (w - g.r - g.l) / JAHRE,
    k: pts(reihen.k),
    e: pts(reihen.e),
    gg: pts(reihen.g),
    marker,
    enden,
  };
}

// Pfade auf 1 Nachkommastelle (d3-shape digits, Standard 3) – kleineres HTML/RSC, optisch gleich
const linieGen = line().curve(curveMonotoneX).digits(1);
const bandGen = area()
  .curve(curveMonotoneX)
  .digits(1)
  .x((d) => d[0])
  .y0((d) => d[1])
  .y1((d) => d[2]);

/** Linienpfad aus Pixelpunkten. */
export const pfadLinie = (pts) => linieGen(pts) || "";
/** Band zwischen zwei Pixelreihen (gleiche x). */
export const pfadBand = (lo, hi) => bandGen(lo.map((p, i) => [p[0], p[1], hi[i][1]])) || "";

/** Pfade im Endzustand (Server, reduzierte Bewegung). */
export function faecherPfade(geo) {
  return { band: pfadBand(geo.k, geo.gg), k: pfadLinie(geo.k), e: pfadLinie(geo.e), g: pfadLinie(geo.gg) };
}

/**
 * Hinweis unter der Nulllinie („↑ darüber: Investition zurückverdient“) mit Ausweichen: Liegt ein
 * Amortisations-Marker (samt Beschriftung) oder der Ablese-Strich in seinem Bereich, erst die Kurzform
 * „↑ zurückverdient“, sonst ausblenden. Breite geschätzt (Inter ≈ 0,56 em je Zeichen).
 */
export function nullHinweis(geo, leseX = null) {
  const s = geo.g.schrift;
  const lang = geo.g === FAECHER.mobil ? null : "↑ darüber: Investition zurückverdient";
  const kurz = "↑ zurückverdient";
  const rechts = geo.x1 - 4;
  // Sperrbereiche: konservativ (Kreis, Lot und Jahresbeschriftung darunter), erwartet (Lot), günstig (Kreis),
  // Ablese-Strich
  const sperre = geo.marker.map((m) => ({ x: m.x, halb: m.id === "k" ? s * 1.9 : m.id === "e" ? 3 : 5 }));
  if (leseX != null) sperre.push({ x: leseX, halb: 3 });
  const frei = (text) => {
    const links = rechts - text.length * s * 0.56;
    return sperre.every((b) => b.x + b.halb < links - 2 || b.x - b.halb > rechts + 2);
  };
  if (lang && frei(lang)) return { text: lang, sichtbar: true };
  if (frei(kurz)) return { text: kurz, sichtbar: true };
  return { text: lang ?? kurz, sichtbar: false };
}

/** Achsbeschriftung in Tsd. € („−200“, „0“, „400“). */
const achse = (v) => zahl(Math.round(v / 1000));

/**
 * Der Fächer als SVG.
 * @param {object} p
 * @param {ReturnType<typeof faecherGeo>} p.geo
 * @param {{band:any,k:any,e:any,g:any}} p.pfade Pfad-Strings oder MotionValues (mit passendem `Pfad`)
 * @param {any} [p.Pfad] Komponente für die vier Pfade (Server: "path", Client: m.path)
 * @param {object} [p.pfadProps] Zusatz-Attribute je Pfad { band, k, e, g } (z. B. pathLength-Animation)
 * @param {number|null} [p.lese] abgelesenes Jahr (Fadenkreuz)
 * @param {boolean} [p.gleiten] Beschriftungen per CSS gleiten lassen
 * @param {boolean} [p.beschriftet] Direktbeschriftung und Marker sichtbar (Aufbau)
 * @param {string} [p.className]
 * @param {object} [p.rest] weitere SVG-Attribute (Ereignisse, aria)
 */
export function FaecherSvg({ geo, pfade, Pfad = "path", pfadProps = {}, lese = null, gleiten = false, beschriftet = true, className, ...rest }) {
  const { w, h, g } = geo;
  const s = g.schrift;
  const ueb = gleiten ? "transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1)" : undefined;
  const sichtbar = { opacity: beschriftet ? 1 : 0, transition: gleiten ? "opacity 480ms cubic-bezier(0.16, 1, 0.3, 1)" : undefined };
  const me = geo.marker.find((m) => m.id === "e");
  const mk = geo.marker.find((m) => m.id === "k");
  const mg = geo.marker.find((m) => m.id === "g");
  const leseX = lese != null ? geo.k[lese]?.[0] : null;
  const hinweis = nullHinweis(geo, leseX);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" className={className} style={{ display: "block", overflow: "visible" }} {...rest}>
      {/* Minus-Zone unter der Nulllinie */}
      <rect x={geo.x0} y={geo.yNull} width={Math.max(0, geo.x1 - geo.x0)} height={Math.max(0, geo.yUnten - geo.yNull)} fill={F.minus} />

      {/* Raster und y-Achse (Tsd. €) */}
      <g fontSize={s} fill={F.text} className="ov-num">
        {geo.ticksY.map((t) => (
          <g key={t.v}>
            {t.v !== 0 && <line x1={geo.x0} x2={geo.x1} y1={t.y} y2={t.y} stroke={F.raster} strokeWidth={1} shapeRendering="crispEdges" />}
            <text x={geo.x0 - 8} y={t.y} dy="0.32em" textAnchor="end">
              {achse(t.v)}
            </text>
          </g>
        ))}
        <text x={geo.x0 - 8} y={g.t - 12} textAnchor="end" fontWeight={600} fill={F.textStark}>
          Tsd. €
        </text>
        {geo.ticksX.map((t) => (
          <text key={t.j} x={t.x} y={geo.yUnten + s + 8} textAnchor={t.j === JAHRE ? "end" : "middle"}>
            {t.j === JAHRE ? (g === FAECHER.mobil ? "25 J." : "25 Jahre") : t.j}
          </text>
        ))}
      </g>

      {/* Band konservativ – günstig, Ränder, erwartete Linie */}
      <Pfad d={pfade.band} fill={F.band} stroke="none" {...pfadProps.band} />
      <Pfad d={pfade.k} fill="none" stroke={F.rand} strokeWidth={1.25} {...pfadProps.k} />
      <Pfad d={pfade.g} fill="none" stroke={F.rand} strokeWidth={1.25} {...pfadProps.g} />
      <Pfad d={pfade.e} fill="none" stroke={F.erwartet} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...pfadProps.e} />

      {/* Nulllinie */}
      <line x1={geo.x0} x2={geo.x1} y1={geo.yNull} y2={geo.yNull} stroke={F.null} strokeWidth={1} shapeRendering="crispEdges" />
      {/* rechts unter der Nulllinie liegt keine Linie (dort sind alle Läufe im Plus); der Hinweis weicht
          Amortisations-Markern und dem Ablese-Strich aus: erst Kurzform, sonst blendet er aus */}
      {hinweis && (
        <text
          x={geo.x1 - 4}
          y={geo.yNull + s + 5}
          textAnchor="end"
          fontSize={s}
          fill={F.text}
          style={{ opacity: hinweis.sichtbar ? 1 : 0, transition: gleiten ? "opacity 200ms ease-out" : undefined }}
          aria-hidden={hinweis.sichtbar ? undefined : true}
        >
          {hinweis.text}
        </text>
      )}

      {/* Marker an der Amortisation */}
      <g style={sichtbar}>
        {mg && (
          <circle cx={0} cy={0} r={3.5} fill="#fff" stroke={F.rand} strokeWidth={1.5} style={{ transform: `translate(${mg.x}px, ${mg.y}px)`, transition: ueb }} />
        )}
        {mk && (
          <g style={{ transform: `translate(${mk.x}px, ${mk.y}px)`, transition: ueb }}>
            <line x1={0} x2={0} y1={0} y2={geo.yUnten - mk.y} stroke={F.rand} strokeWidth={1} strokeDasharray="2 3" />
            <circle r={4} fill="#fff" stroke={FARBE.ov500} strokeWidth={1.75} />
            <text y={s + 9} textAnchor="middle" fontSize={s} fontWeight={700} fill={F.textStark} className="ov-num">
              {zahl(mk.a, 1)} J.
            </text>
          </g>
        )}
        {me && (
          <g style={{ transform: `translate(${me.x}px, ${me.y}px)`, transition: ueb }}>
            <line x1={0} x2={0} y1={0} y2={geo.yUnten - me.y} stroke={F.erwartet} strokeWidth={1} strokeDasharray="2 3" />
            <circle r={5} fill={F.erwartet} stroke="#fff" strokeWidth={2} />
            <text y={-10} textAnchor="middle" fontSize={s} fontWeight={800} fill={F.erwartetText} className="ov-num">
              {zahl(me.a, 1)} J.
            </text>
          </g>
        )}
      </g>

      {/* Direktbeschriftung am rechten Ende */}
      <g style={sichtbar} fontSize={s}>
        {geo.enden.map((l) => (
          <g key={l.id} style={{ transform: `translate(${geo.x1 + 7}px, ${l.y}px)`, transition: ueb }}>
            <text dy="-0.15em" fontWeight={l.id === "e" ? 800 : 700} fill={l.id === "e" ? F.erwartetText : F.textStark}>
              {l.name}
            </text>
            <text dy="1.05em" fill={l.id === "e" ? F.erwartetText : F.text} className="ov-num">
              {zahl(Math.round(l.wert / 1000))} Tsd. €
            </text>
          </g>
        ))}
      </g>

      {/* Fadenkreuz (abgelesenes Jahr) */}
      {leseX != null && (
        <g pointerEvents="none">
          <line x1={leseX} x2={leseX} y1={g.t - 6} y2={geo.yUnten} stroke={F.lese} strokeWidth={1} />
          <circle cx={leseX} cy={geo.gg[lese][1]} r={3.5} fill="#fff" stroke={FARBE.ov500} strokeWidth={1.5} />
          <circle cx={leseX} cy={geo.k[lese][1]} r={3.5} fill="#fff" stroke={FARBE.ov500} strokeWidth={1.5} />
          <circle cx={leseX} cy={geo.e[lese][1]} r={4.5} fill={F.erwartet} stroke="#fff" strokeWidth={2} />
          <text x={leseX} y={g.t - 10} textAnchor={lese > 21 ? "end" : lese < 3 ? "start" : "middle"} fontSize={s} fontWeight={700} fill={F.textStark} className="ov-num">
            Jahr {lese}
          </text>
        </g>
      )}
    </svg>
  );
}
