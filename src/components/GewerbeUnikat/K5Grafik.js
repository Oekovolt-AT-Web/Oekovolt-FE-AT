// src/components/GewerbeUnikat/K5Grafik.js
//
// K5 · Leistungspreis – REINE Grafik-Bausteine (ohne Hooks, ohne "use client"): Spitzen-Uhr, Monatstürme,
// Batterie und Grenznutzen-Kurve als SVG. Der Server rendert damit den Platzhalter (Startzustand), die
// Client-Bühne dieselben Bausteine mit motion-Elementen (Prop `k`) – deshalb sind Platzhalter und Bühne
// deckungsgleich (kein CLS) und ohne JavaScript bleibt eine vollständige, lesbare Grafik stehen.
//
// Farben (eine Farbe = eine Bedeutung, siehe BEDEUTUNG in ./_tokens.js):
//  navy-300 Monatsspitze/Netzbezug · sun-500 Lastspitze bzw. gekappter Teil (nur auf Navy) ·
//  sun-300 (35 %) Sonne über dem Horizont · ov-300 Speicher · ov-400 Sonne selbst genutzt.

import { arc, area, curveMonotoneX, line } from "d3-shape";
import { scaleBand, scaleLinear, scaleSqrt } from "d3-scale";
import { FARBE, zahl } from "./_tokens";
import { NB, euroText } from "./K5Rechnen";

const TAU = Math.PI * 2;
const r1 = (n) => Math.round(n * 10) / 10;

/** Statische „Komponenten“ (Server, Platzhalter). Die Bühne ersetzt sie durch motion-Elemente. */
export const STATISCH = { bewegt: false, ruhig: true, G: "g", Rect: "rect", Circle: "circle", Path: "path", Line: "line", Text: "text" };

/**
 * Bewegungs-Props: mit motion (k.bewegt) → initial/animate/transition (erster Render ohne Animation),
 * sonst die Attribute selbst. x/y werden für SVG zu attrX/attrY (sonst wären es CSS-Transforms).
 */
export function ani(k, attrs, transition) {
  if (!k.bewegt) return attrs;
  const ziel = {};
  for (const [key, wert] of Object.entries(attrs)) ziel[key === "x" ? "attrX" : key === "y" ? "attrY" : key] = wert;
  // Höhen gleiten als Tween (ease-out, kein Überschwingen): eine Feder mit geerbter Geschwindigkeit könnte
  // unter 0 schießen – negative <rect>-Höhen sind ungültig.
  return { initial: false, animate: ziel, transition: transition ?? ("height" in attrs ? (k.groesse ?? k.feder) : k.feder) };
}

// ---------------------------------------------------------------------------------------------------
// A · Spitzen-Uhr – 24-h-Zifferblatt, 00 Uhr oben, im Uhrzeigersinn; Jänner innen, Dezember außen
// ---------------------------------------------------------------------------------------------------

export const UHR = { groesse: 440, mitte: 220, innen: 64, aussen: 186 };
export const RING = (UHR.aussen - UHR.innen) / 12;
export const ringRadius = (i) => UHR.innen + (i + 0.5) * RING;
/** Minuten seit Mitternacht → Winkel (Bogenmaß, 0 = oben, im Uhrzeigersinn – wie d3-shape arc). */
export const winkelVon = (minuten) => (minuten / 1440) * TAU;
export function polar(r, w) {
  return [r1(UHR.mitte + r * Math.sin(w)), r1(UHR.mitte - r * Math.cos(w))];
}

/** Ring-Index unter einem Punkt (viewBox-Koordinaten), sonst null. */
export function ringBei(x, y) {
  const r = Math.hypot(x - UHR.mitte, y - UHR.mitte);
  if (r < UHR.innen - 4 || r > UHR.aussen + 6) return null;
  return Math.max(0, Math.min(11, Math.floor((r - UHR.innen) / RING)));
}

const ringFlaeche = arc().digits(1);

/** Kreisbogen auf Ring r von Minute „von“ bis „bis“ – relativ zur Uhrmitte, kompakter SVG-Bogenbefehl. */
function bogenPfad(r, von, bis) {
  const w0 = winkelVon(von);
  const w1 = winkelVon(bis);
  const x0 = r1(r * Math.sin(w0));
  const y0 = r1(-r * Math.cos(w0));
  const x1 = r1(r * Math.sin(w1));
  const y1 = r1(-r * Math.cos(w1));
  return `M${x0} ${y0}A${r1(r)} ${r1(r)} 0 ${w1 - w0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`;
}
const STUNDEN = Array.from({ length: 24 }, (_, h) => h);
const BESCHRIFTET = [0, 3, 6, 9, 12, 15, 18, 21];

/** Keyframes für den Intro-Weg eines Punkts von 00:00 im Uhrzeigersinn zur Uhrzeit (Ease-out-Quart). */
export function introWeg(r, zielWinkel, schritte = 12) {
  const cx = [];
  const cy = [];
  const times = [];
  for (let s = 0; s <= schritte; s++) {
    const p = s / schritte;
    const [x, y] = polar(r, zielWinkel * p);
    cx.push(x);
    cy.push(y);
    times.push(1 - Math.pow(1 - p, 0.25)); // Umkehrung von 1 − (1 − t)^4
  }
  return { cx, cy, times };
}

/**
 * Zifferblatt. intro: "warten" (Punkte bei 00:00, Bögen ungezeichnet) | "los" (Intro läuft) | "fertig".
 * zeiger: Pointer-Handler für die Ring-Auswahl (nur Client).
 */
export function UhrBild({ v, k = STATISCH, intro = "fertig", zeiger, svgRef }) {
  const aktiv = v.monate[v.aktiv];
  const wartet = intro === "warten";
  const laeuft = intro === "los";
  const zeigerWinkel = aktiv && !aktiv.leer ? winkelVon(aktiv.minuten) : 0;
  const [zx1, zy1] = polar(UHR.innen - 6, zeigerWinkel);
  const [zx2, zy2] = polar(ringRadius(v.aktiv) - 8, zeigerWinkel);
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${UHR.groesse} ${UHR.groesse}`}
      className="absolute inset-0 h-full w-full select-none overflow-visible"
      aria-hidden="true"
      focusable="false"
      style={{ touchAction: "pan-y" }}
      {...zeiger}
    >
      <defs>
        <radialGradient id="k5-uhr-tiefe" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={FARBE.navy800} stopOpacity="0.85" />
          <stop offset="62%" stopColor={FARBE.navy900} stopOpacity="0.55" />
          <stop offset="100%" stopColor={FARBE.navy950} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={UHR.mitte} cy={UHR.mitte} r={UHR.aussen + 24} fill="url(#k5-uhr-tiefe)" />

      <g transform={`translate(${UHR.mitte},${UHR.mitte})`}>
        {/* Ringbahnen */}
        {v.monate.map((m, i) => (
          <path
            key={`bahn-${i}`}
            d={ringFlaeche({ innerRadius: ringRadius(i) - RING / 2 + 0.9, outerRadius: ringRadius(i) + RING / 2 - 0.9, startAngle: 0, endAngle: TAU })}
            fill="#fff"
            className="transition-[fill-opacity] duration-300 motion-reduce:transition-none"
            style={{ fillOpacity: i === v.aktiv ? 0.13 : m.leer ? 0.02 : 0.045 }}
          />
        ))}
        {/* Sonnenbögen: 15. des Monats, Aufgang bis Untergang; kräftiger Kern ab 20° Sonnenhöhe */}
        {v.boegen.map((b, i) => {
          if (!b || b.unter <= b.auf) return null;
          const bogen = (von, bis) => bogenPfad(ringRadius(i), von, bis);
          const P = k.Path;
          const zeichnen = (verz) =>
            k.bewegt
              ? {
                  initial: false,
                  animate: { pathLength: wartet ? 0 : 1 },
                  transition: laeuft ? { duration: 0.9, delay: verz + i * 0.04, ease: [0.16, 1, 0.3, 1] } : { duration: 0 },
                }
              : {};
          const breit = RING - 3.4;
          return (
            <g key={`bogen-${i}-${b.auf}-${b.unter}`}>
              <P d={bogen(b.auf, b.unter)} fill="none" stroke={FARBE.sun300} strokeOpacity={0.24} strokeWidth={breit} strokeLinecap="butt" {...zeichnen(0.15)} />
              {b.kernAuf != null && b.kernUnter > b.kernAuf && (
                <P d={bogen(b.kernAuf, b.kernUnter)} fill="none" stroke={FARBE.sun300} strokeOpacity={0.42} strokeWidth={breit} strokeLinecap="butt" {...zeichnen(0.45)} />
              )}
            </g>
          );
        })}
      </g>

      {/* Stundenstriche und Schichtbeginn-Speiche */}
      {STUNDEN.map((h) => {
        const w = winkelVon(h * 60);
        const lang = h % 3 === 0;
        const [x1, y1] = polar(UHR.aussen + 5, w);
        const [x2, y2] = polar(UHR.aussen + (lang ? 13 : 9), w);
        return <line key={`h-${h}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeOpacity={lang ? 0.32 : 0.14} strokeWidth={1} />;
      })}
      {(() => {
        const [x1, y1] = polar(UHR.innen - 2, winkelVon(360));
        const [x2, y2] = polar(UHR.aussen + 3, winkelVon(360));
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeOpacity={0.3} strokeWidth={1} strokeDasharray="2 4" />;
      })()}

      {/* Monatskennung am oberen Rand jedes Rings (ab lg) */}
      {v.monate.map((m, i) => {
        const [x, y] = polar(ringRadius(i), -0.105);
        return (
          <text key={`b-${i}`} x={x} y={y} dy="0.34em" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#fff" fillOpacity={i === v.aktiv ? 0.9 : 0.38} className="hidden lg:inline">
            {m.buchstabe}
          </text>
        );
      })}

      {/* Zeiger zum gewählten Monat */}
      {intro === "fertig" && aktiv && !aktiv.leer && (
        <k.Line {...ani(k, { x1: zx1, y1: zy1, x2: zx2, y2: zy2 })} stroke="#fff" strokeOpacity={0.5} strokeWidth={1} />
      )}

      {/* Spitzenpunkte */}
      {v.monate.map((m, i) => {
        if (m.leer) return null;
        const r = ringRadius(i);
        const w = winkelVon(m.minuten);
        const [x, y] = polar(r, w);
        const gross = i === v.aktiv;
        const C = k.Circle;
        let props;
        if (!k.bewegt) props = { cx: x, cy: y, r: gross ? 7 : 5 };
        else if (wartet) {
          const [x0, y0] = polar(r, 0);
          props = { initial: false, animate: { cx: x0, cy: y0, r: 4.5, opacity: 0.0001 }, transition: { duration: 0 } };
        } else if (laeuft) {
          const weg = introWeg(r, w);
          props = {
            initial: false,
            animate: { cx: weg.cx, cy: weg.cy, r: gross ? 7 : 5, opacity: 1 },
            transition: { cx: { duration: 1.15, delay: 0.25 + i * 0.04, ease: "linear", times: weg.times }, cy: { duration: 1.15, delay: 0.25 + i * 0.04, ease: "linear", times: weg.times }, r: { duration: 0.3 }, opacity: { duration: 0.2, delay: 0.25 + i * 0.04 } },
          };
        } else props = { initial: false, animate: { cx: x, cy: y, r: gross ? 7 : 5, opacity: 1 }, transition: k.feder };
        return <C key={`p-${i}`} {...props} fill={FARBE.sun500} stroke="#fff" strokeWidth={1.6} />;
      })}
    </svg>
  );
}

/** HTML-Beschriftungen der Uhr (Stunden, Mitte) – gestochen scharf in jeder Größe. */
export function UhrBeschriftung({ v, Zahl }) {
  const aktiv = v.monate[v.aktiv];
  return (
    <>
      {BESCHRIFTET.map((h) => {
        const [x, y] = polar(UHR.aussen + 21, winkelVon(h * 60));
        const wichtig = h % 6 === 0;
        return (
          <span
            key={`l-${h}`}
            aria-hidden="true"
            className={`ov-num pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[11px] font-semibold md:text-[12px] ${wichtig ? "text-white/75" : "max-md:hidden text-white/60"}`}
            style={{ left: `${(x / UHR.groesse) * 100}%`, top: `${(y / UHR.groesse) * 100}%` }}
          >
            {String(h).padStart(2, "0")}
          </span>
        );
      })}
      {[
        [0, "Jän"],
        [11, "Dez"],
      ].map(([i, t]) => {
        const [x, y] = polar(ringRadius(i), -0.2 + i * 0.008);
        return (
          <span
            key={`m-${i}`}
            aria-hidden="true"
            className="pointer-events-none absolute -translate-x-full -translate-y-1/2 pr-1 text-[10px] font-semibold text-white/55 lg:hidden"
            style={{ left: `${(x / UHR.groesse) * 100}%`, top: `${(y / UHR.groesse) * 100}%` }}
          >
            {t}
          </span>
        );
      })}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 flex w-[27%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
        <span className="max-w-full truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55 md:text-[11px]">{aktiv?.lang}</span>
        <span className="mt-1 font-display text-[21px] font-extrabold leading-none tracking-[-0.03em] text-white md:text-[27px]">
          {aktiv && !aktiv.leer ? <Zahl wert={aktiv.kw} /> : "–"}
          <span className="ml-0.5 text-[0.55em] font-bold text-white/60">kW</span>
        </span>
        <span className="ov-num mt-1.5 text-[11px] font-semibold text-sun-300 md:text-[12px]">{aktiv && !aktiv.leer ? `${aktiv.uhr} Uhr` : "keine Daten"}</span>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------
// B · Monatstürme mit Deckel (d3-scale band + linear, y-Achse ab 0)
// ---------------------------------------------------------------------------------------------------

export const TUERME_HOEHE = { mobil: 264, breit: 360 };
export const TUERME_BREITE_SSR = { mobil: 290, breit: 720 };
/** Breite der Batterie-Spalte rechts neben den Türmen (px). */
export const BATTERIE_BREITE = { mobil: 50, breit: 96 };

export function tuermeSkalen({ breite, hoehe, mobil, v }) {
  const links = mobil ? 30 : 44;
  // rechts: Platz für den Griff „230 kW / ≈ 4.050 €/a“ (mobil ragt er ein Stück in den Spalt zur Batterie)
  const rechts = mobil ? 58 : 108;
  const oben = 30;
  const unten = 26;
  const x = scaleBand()
    .domain(Array.from({ length: 12 }, (_, i) => i))
    .range([links, Math.max(links + 60, breite - rechts)])
    .paddingInner(v.modus === "2027" ? 0.44 : 0.26)
    .paddingOuter(0.14);
  const y = scaleLinear().domain([0, v.yMax]).range([hoehe - unten, oben]);
  return { x, y, links, rechts, oben, unten, plotRechts: breite - rechts };
}

/** Monatstürme. plot: Pointer-Handler für die Plotfläche (nur Client, Maus). */
export function TuermeBild({ v, k = STATISCH, breite, hoehe, mobil, plot, svgRef, skalieren = false }) {
  const s = tuermeSkalen({ breite, hoehe, mobil, v });
  const { x, y } = s;
  const bw = x.bandwidth();
  const y0 = y(0);
  const schritt = v.yMax > 200 ? 100 : 50;
  const linien = [];
  for (let t = schritt; t <= v.yMax; t += schritt) linien.push(t);
  const yd = y(v.deckel);
  const jahrIndex = v.ohnePv.reduce((best, w, i) => (Number.isFinite(w) && (!(v.ohnePv[best] >= w)) ? i : best), 0);
  const R = k.Rect;
  const fs = mobil ? 10 : 11;
  return (
    <svg
      ref={svgRef}
      width={skalieren ? "100%" : breite}
      height={skalieren ? "100%" : hoehe}
      viewBox={`0 0 ${breite} ${hoehe}`}
      className="block select-none overflow-visible"
      aria-hidden="true"
      focusable="false"
      style={{ touchAction: "pan-y" }}
      {...plot}
    >
      {v.modus === "2027" && (
        <text x={s.links} y={s.oben - 16} fontSize={fs} fontWeight="600" fill="#fff" fillOpacity={0.7}>
          12 Monatsrechnungen – jede zählt einzeln
        </text>
      )}
      {/* Raster */}
      {linien.map((t) => (
        <g key={`r-${t}`}>
          <line x1={s.links} x2={s.plotRechts + 6} y1={r1(y(t))} y2={r1(y(t))} stroke="#fff" strokeOpacity={0.08} />
          <text x={s.links - 7} y={r1(y(t))} dy="0.34em" textAnchor="end" fontSize={fs} fill="#fff" fillOpacity={0.45} className="ov-num">
            {zahl(t)}
          </text>
        </g>
      ))}
      <text x={s.links - 7} y={s.oben - 16} textAnchor="end" fontSize={fs} fill="#fff" fillOpacity={0.45}>
        kW
      </text>
      <line x1={s.links} x2={s.plotRechts + 6} y1={y0} y2={y0} stroke="#fff" strokeOpacity={0.22} />

      {/* Türme */}
      {v.werte.map((w, i) => {
        if (!Number.isFinite(w)) return null;
        const bx = r1(x(i));
        const unterDeckel = Math.min(w, v.deckel);
        const yt = r1(y(unterDeckel));
        const yw = r1(y(w));
        const gekappt = w > v.deckel;
        const aktiv = i === v.aktiv;
        const orig = v.ohnePv[i];
        const delta = v.sonne && Number.isFinite(orig) ? orig - w : 0;
        return (
          <g key={`t-${i}`}>
            <R {...ani(k, { x: bx, y: yt, width: r1(bw), height: Math.max(0, r1(y0 - yt)) })} rx={Math.min(3, bw / 4)} fill={aktiv ? FARBE.navy200 : FARBE.navy300} fillOpacity={aktiv ? 1 : 0.88} />
            <R {...ani(k, { x: bx, y: yw, width: r1(bw), height: gekappt ? Math.max(0, r1(yt - yw)) : 0 })} rx={Math.min(2, bw / 5)} fill={FARBE.sun500} />
            {delta >= 0.5 && (
              <>
                <rect x={bx + 0.5} y={r1(y(orig))} width={Math.max(0, r1(bw) - 1)} height={Math.max(0, r1(yw - y(orig)))} fill="none" stroke="#fff" strokeOpacity={0.45} strokeDasharray="2 2" />
                {v.modus !== "2027" && (
                  <text x={r1(bx + bw / 2)} y={r1(y(orig)) - 5} textAnchor="middle" fontSize={mobil ? 9 : 10.5} fontWeight="700" fill={FARBE.ov300} className="ov-num">
                    −{zahl(delta)}
                  </text>
                )}
              </>
            )}
            {v.modus === "2027" ? (
              mobil && gekappt && yt - yw >= 24 ? (
                // Mobil (schmale Türme): Abzug senkrecht IN das gekappte Stück, dunkel auf Amber
                <text
                  x={r1(bx + bw / 2)}
                  y={r1((yw + yt) / 2)}
                  dy="0.34em"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="800"
                  fill={FARBE.navy950}
                  transform={`rotate(-90 ${r1(bx + bw / 2)} ${r1((yw + yt) / 2)})`}
                  className="ov-num"
                >
                  −{zahl(v.kappen2027[i])}
                </text>
              ) : (
                <text x={r1(bx + bw / 2)} y={r1(Math.min(yw, y(orig || w))) - 6} textAnchor="middle" fontSize={mobil ? 8.5 : 10.5} fontWeight="700" fill={v.kappen2027[i] > 0 ? FARBE.sun500 : "#fff"} fillOpacity={v.kappen2027[i] > 0 ? 1 : 0.4} className="ov-num">
                  {v.kappen2027[i] > 0 ? `−${zahl(v.kappen2027[i])}` : "0"}
                </text>
              )
            ) : (
              i === jahrIndex &&
              !(delta >= 0.5) && (
                <text x={r1(bx + bw / 2)} y={yw - 6} textAnchor="middle" fontSize={fs} fontWeight="600" fill="#fff" fillOpacity={0.7} className="ov-num">
                  {zahl(w)}
                </text>
              )
            )}
            <text x={r1(bx + bw / 2)} y={y0 + 16} textAnchor="middle" fontSize={fs} fontWeight={aktiv ? 700 : 500} fill="#fff" fillOpacity={aktiv ? 0.95 : 0.45}>
              {mobil ? v.monate[i].buchstabe : v.monate[i].kurz}
            </text>
          </g>
        );
      })}

      {/* Deckel */}
      <line x1={s.links - 4} x2={s.plotRechts + 14} y1={r1(yd)} y2={r1(yd)} stroke="#fff" strokeOpacity={0.95} strokeWidth={1.75} />
      {skalieren && (
        /* Platzhalter: Griff als Teil der Grafik, damit er beim Skalieren am Deckel bleibt */
        <g>
          <rect x={breite - 98} y={r1(yd) - 20} width={94} height={40} rx={14} fill="#fff" />
          <text x={breite - 51} y={r1(yd) - 6} dy="0.36em" textAnchor="middle" fontSize="14" fontWeight="800" fill={FARBE.navy950} className="ov-num">
            {zahl(v.deckel)} kW
          </text>
          {v.euro != null && v.modus !== "2027" && (
            <text x={breite - 51} y={r1(yd) + 9} dy="0.36em" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={FARBE.navy950} fillOpacity={0.72} className="ov-num">
              {euroText(v.euro)}/a
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

/**
 * Geometrie der Batterie: Die Batterie ist immer VOLL (Speicher geladen vor Schichtbeginn) – ihre GRÖSSE
 * zeigt die Nennkapazität. Höhe auf Wurzelskala (beschriftet), damit kleine Speicher sichtbar bleiben;
 * Grundlinie wie die Türme. Von Ansicht und Bühne (Landepunkt der Kappen) gemeinsam genutzt.
 */
export function batterieGeometrie({ v, breite, hoehe, mobil }) {
  const yB = hoehe - 26;
  const oben = 30;
  // Desktop: Platz für das mitfahrende Etikett „55 kWh / 85 kW“; mobil steht der Wert unter der Grundlinie
  // (der Griff ragt dort in den Spalt – ein mitfahrendes Etikett könnte ihn kreuzen)
  const etikett = mobil ? 8 : 34;
  const hMax = Math.max(40, yB - oben - etikett);
  const skala = scaleSqrt().domain([0, Math.max(1, v.speicherMax)]).range([0, hMax]).clamp(true);
  const moeglich = !!v.zeile?.moeglich && Number.isFinite(v.zeile.nennKwh);
  const kwh = moeglich ? v.zeile.nennKwh : 0;
  const h = kwh > 0 ? Math.max(6, skala(kwh)) : 0;
  const bodyW = mobil ? 28 : 40;
  const bodyX = mobil ? Math.round((breite - bodyW) / 2) : 8;
  return { yB, oben, hMax, skala, moeglich, kwh, h, bodyW, bodyX, top: yB - h, mitteX: bodyX + bodyW / 2, kappeH: 5 };
}

const BATTERIE_TICKS = [50, 100, 250, 500, 1000, 2000, 5000];

/**
 * Batterie (Speicher-Farbe ov-300). Desktop: mitfahrendes Etikett „55 kWh / 85 kW“ und beschriftete Skala
 * „Speichergröße“; mobil der kWh-Wert unter der Grundlinie wie die Monatsbuchstaben.
 */
export function BatterieBild({ v, k = STATISCH, breite, hoehe, mobil, skalieren = false }) {
  const g = batterieGeometrie({ v, breite, hoehe, mobil });
  const R = k.Rect;
  const T = k.Text;
  // weicher Tween ohne Verzögerung und ohne Überschwingen (eine Verzögerung würde bei jedem Zwischenwert des
  // Ziehens neu starten; eine Feder könnte die Höhe unter 0 treiben)
  const feder = k.bewegt && !k.ruhig ? { duration: 0.7, ease: [0.16, 1, 0.3, 1] } : undefined;
  const top = r1(g.top);
  const kappeY = r1(g.top - g.kappeH + 1);
  const etikettX = mobil ? r1(g.mitteX) : g.bodyX - 1;
  const anker = mobil ? "middle" : "start";
  const yKwh = r1(Math.max(12, g.top - g.kappeH - 21));
  const yKw = r1(Math.max(25, g.top - g.kappeH - 8));
  const achseX = g.bodyX + g.bodyW + 10;
  const ticks = mobil ? [] : BATTERIE_TICKS.filter((t) => t < v.speicherMax * 0.97);
  const fs = mobil ? 10 : 11;
  return (
    <svg width={skalieren ? "100%" : breite} height={skalieren ? "100%" : hoehe} viewBox={`0 0 ${breite} ${hoehe}`} className="block overflow-visible" aria-hidden="true" focusable="false">
      {/* Skala „Speichergröße“ (Wurzelskala, beschriftet) */}
      {!mobil && (
        <g>
          <line x1={achseX} x2={achseX} y1={g.yB} y2={r1(g.yB - g.hMax)} stroke="#fff" strokeOpacity={0.14} />
          <text x={achseX} y={g.oben - 16} textAnchor="middle" fontSize={fs} fill="#fff" fillOpacity={0.45}>
            kWh
          </text>
          {ticks.map((t) => {
            const ty = r1(g.yB - g.skala(t));
            // Tick-Zahl ausblenden, wo das Etikett der Batterie steht
            const frei = !g.moeglich || ty < yKwh - 14 || ty > yKw + 8;
            return (
              <g key={`bt-${t}`}>
                <line x1={achseX - 3} x2={achseX + 3} y1={ty} y2={ty} stroke="#fff" strokeOpacity={0.3} />
                {frei && (
                  <text x={achseX + 6} y={ty} dy="0.34em" fontSize="9.5" fill="#fff" fillOpacity={0.42} className="ov-num">
                    {zahl(t)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      )}
      <line x1={0} x2={breite} y1={g.yB} y2={g.yB} stroke="#fff" strokeOpacity={0.22} />

      {g.moeglich ? (
        <>
          <R {...ani(k, { y: kappeY }, feder)} x={r1(g.mitteX - g.bodyW * 0.21)} width={r1(g.bodyW * 0.42)} height={g.kappeH} rx={1.5} fill={FARBE.ov300} fillOpacity={0.75} />
          <R {...ani(k, { y: top, height: r1(g.h) }, feder)} x={g.bodyX} width={g.bodyW} rx={mobil ? 4 : 6} fill={FARBE.ov300} />
          {!mobil && (
            <>
              <T {...ani(k, { y: yKwh }, feder)} x={etikettX} textAnchor={anker} fontSize={12.5} fontWeight="800" fill="#fff" className="ov-num">
                {`${zahl(g.kwh)}${NB}kWh`}
              </T>
              <T {...ani(k, { y: yKw }, feder)} x={etikettX} textAnchor={anker} fontSize={11} fontWeight="600" fill="#fff" fillOpacity={0.62} className="ov-num">
                {`${zahl(v.zeile.leistungKw)}${NB}kW`}
              </T>
            </>
          )}
        </>
      ) : (
        <>
          <rect x={g.bodyX + 0.5} y={g.yB - 12.5} width={g.bodyW - 1} height={12} rx={3} fill="none" stroke="#fff" strokeOpacity={0.4} strokeDasharray="2 2" />
          <text x={etikettX} y={g.yB - 22} textAnchor={anker} fontSize={fs} fontWeight="700" fill="#fff" fillOpacity={0.7}>
            –
          </text>
        </>
      )}
      {mobil ? (
        <text x={r1(g.mitteX)} y={g.yB + 16} textAnchor="middle" fontSize={10.5} fontWeight="800" fill="#fff" className="ov-num">
          {g.moeglich ? `${zahl(g.kwh)}${NB}kWh` : "Speicher"}
        </text>
      ) : (
        <text x={g.bodyX} y={g.yB + 16} fontSize={fs} fontWeight="500" fill="#fff" fillOpacity={0.45}>
          Speichergröße
        </text>
      )}
    </svg>
  );
}

const GRENZ_TICKS = [50, 100, 250, 500, 1000, 2000];

/**
 * Grenznutzen: €/Jahr über Nennkapazität, aktueller Punkt markiert (d3-shape, curveMonotoneX).
 * x-Achse als Wurzelskala (beschriftet) – der spannende Bereich 0–120 kWh bekommt Platz.
 */
export function GrenzBild({ v, k = STATISCH, breite, hoehe = 140, idZusatz = "", skalieren = false }) {
  const p = v.grenz.punkte;
  if (p.length < 2) return <svg width={breite} height={hoehe} aria-hidden="true" />;
  const l = 6;
  const r = 10;
  const o = 18;
  const u = 22;
  const maxKwh = v.speicherMax;
  const maxEuro = Math.max(v.grenzEuroMax, p[p.length - 1].euro);
  const x = scaleSqrt().domain([0, maxKwh]).range([l, breite - r]).clamp(true);
  const y = scaleLinear().domain([0, maxEuro * 1.05]).range([hoehe - u, o]);
  const linie = line()
    .digits(1)
    .x((d) => x(d.kwh))
    .y((d) => y(d.euro))
    .curve(curveMonotoneX);
  const flaeche = area()
    .digits(1)
    .x((d) => x(d.kwh))
    .y0(hoehe - u)
    .y1((d) => y(d.euro))
    .curve(curveMonotoneX);
  const a = v.grenz.aktuell;
  const ax = a ? r1(x(a.kwh)) : null;
  const ay = a ? r1(y(a.euro)) : null;
  const rechtsbuendig = a && ax > breite * 0.62;
  // Etikett UNTER dem Punkt (rechts davon verläuft die Kurve höher) – am rechten Rand links darüber
  const ey = a ? (rechtsbuendig ? ay - 9 : Math.min(ay + 17, hoehe - u - 5)) : 0;
  const ticks = GRENZ_TICKS.filter((t) => t < maxKwh * 0.8);
  const C = k.Circle;
  return (
    <svg width={skalieren ? "100%" : breite} height={hoehe} viewBox={`0 0 ${breite} ${hoehe}`} className="block max-w-full overflow-visible" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`k5-grenz-flaeche${idZusatz}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={FARBE.sun500} stopOpacity="0.12" />
          <stop offset="100%" stopColor={FARBE.sun500} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={flaeche(p)} fill={`url(#k5-grenz-flaeche${idZusatz})`} />
      <path d={linie(p)} fill="none" stroke={FARBE.sun500} strokeWidth={1.75} />
      <line x1={l} x2={breite - r} y1={hoehe - u} y2={hoehe - u} stroke="#fff" strokeOpacity={0.2} />
      {ticks.map((t) => (
        <g key={`gt-${t}`}>
          <line x1={r1(x(t))} x2={r1(x(t))} y1={hoehe - u} y2={hoehe - u + 4} stroke="#fff" strokeOpacity={0.3} />
          <text x={r1(x(t))} y={hoehe - 6} textAnchor="middle" fontSize="10" fill="#fff" fillOpacity={0.45} className="ov-num">
            {zahl(t)}
          </text>
        </g>
      ))}
      <text x={l} y={hoehe - 6} fontSize="10" fill="#fff" fillOpacity={0.45}>
        0
      </text>
      <text x={breite - r} y={hoehe - 6} textAnchor="end" fontSize="10" fill="#fff" fillOpacity={0.45} className="ov-num">
        {`${zahl(maxKwh)}${NB}kWh`}
      </text>
      <text x={l} y={o - 7} fontSize="10" fill="#fff" fillOpacity={0.45} className="ov-num">
        {`${zahl(Math.round(maxEuro / 100) * 100)}${NB}€/Jahr`}
      </text>
      {a && (
        <>
          <line x1={ax} x2={ax} y1={ay} y2={hoehe - u} stroke="#fff" strokeOpacity={0.3} strokeDasharray="2 3" />
          <C {...ani(k, { cx: ax, cy: ay })} r={4.5} fill={FARBE.sun500} stroke="#fff" strokeWidth={1.5} />
          <text x={rechtsbuendig ? ax - 9 : ax + 9} y={ey} textAnchor={rechtsbuendig ? "end" : "start"} fontSize="10.5" fontWeight="700" fill="#fff" className="ov-num">
            {`${zahl(a.kwh)}${NB}kWh · ${euroText(a.euro)}`}
          </text>
        </>
      )}
    </svg>
  );
}
