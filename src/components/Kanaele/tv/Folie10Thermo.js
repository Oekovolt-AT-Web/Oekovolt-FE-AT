"use client";

import { useId } from "react";
import { DISPLAY, Modul, NAVY_TIEF, GRUEN, SONNE, auf, rd, strich } from "./gemeinsam";

/* ================================================================== */
/* 10 · Drohnen-Thermografie (Schema)                                  */
/* ================================================================== */
/*
 * Ein Modulfeld (5 × 2) liegt als schräge Ebene im Raum. Eine Drohne fliegt es ab; wo ihr
 * Kamerastreifen war, wird das Wärmebild sichtbar. Die auffällige Zelle wird angepeilt und
 * beschriftet. Danach patrouilliert die Drohne ruhig weiter.
 *
 * Alles, was auf dem Feld liegt (Module, Wärmebild, Fadenkreuz, Drohne samt Schatten), wird in
 * Feld-Koordinaten (u, v) gezeichnet und mit einer affinen Matrix in die Schrägansicht gebracht.
 */

const THERMO = [
  [0, [20, 12, 66]],
  [0.3, [74, 24, 120]],
  [0.5, [150, 34, 110]],
  [0.68, [214, 72, 52]],
  [0.84, [247, 160, 40]],
  [1, [255, 245, 190]],
];
function thermFarbe(t) {
  for (let i = 1; i < THERMO.length; i++) {
    const [p1, c1] = THERMO[i];
    const [p0, c0] = THERMO[i - 1];
    if (t <= p1) {
      const k = (t - p0) / (p1 - p0);
      return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * k)).join(",")})`;
    }
  }
  return "rgb(255,245,190)";
}
const rausch = (i) => {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

/* ---------- Geometrie ---------- */
const MW = 150;
const MH = 250;
const GAP = 14;
const Z = 25;
const W = 5 * MW + 4 * GAP; // 806
const H = 2 * MH + GAP; // 514
// Schrägansicht: Drehung um −15°, Tiefe gestaucht (0,6). Werte gerundet → identisches Markup.
const MA = 0.9659;
const MB = -0.1553;
const MC = 0.2588;
const MD = 0.5796;
const OX = 64;
const OY = 352;
const EBENE = `translate(${OX} ${OY}) matrix(${MA} ${MB} ${MC} ${MD} 0 0)`;
const P = (u, v) => [rd(OX + MA * u + MC * v), rd(OY + MB * u + MD * v)];
// Bildschirm-Senkrechte (1 px nach oben) in Feld-Koordinaten
const HOCH_U = 0.4313;
const HOCH_V = -1.6098;
const FLUGHOEHE = 220;
const DU = rd(HOCH_U * FLUGHOEHE);
const DV = rd(H / 2 + HOCH_V * FLUGHOEHE);

const HEISS = { m: 2, r: 1, s: 3, z: 3 };
const HU = HEISS.m * (MW + GAP) + HEISS.s * Z + Z / 2;
const HV = HEISS.r * (MH + GAP) + HEISS.z * Z + Z / 2;

// Bodenraster rund um das Feld (ein Pfad)
const RASTER = (() => {
  let d = "";
  for (let u = -164; u <= W + 164; u += 82) d += `M${u} -180V${H + 180}`;
  for (let v = -180; v <= H + 180; v += 82) d += `M-164 ${v}H${W + 164}`;
  return d;
})();

/* ---------- Choreografie ---------- */
const START_U = -60; // Drohne startet links außerhalb des Feldes
const WEG = W - START_U;
const FLUG_START = 450;
const FLUG_DAUER = 2900;
const FLUG_KURVE = [0.42, 0, 0.28, 1];
function kurveZeit([x1, y1, x2, y2], ziel) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (((ay * m + by) * m + cy) * m < ziel) lo = m;
    else hi = m;
  }
  const s = (lo + hi) / 2;
  return ((ax * s + bx) * s + cx) * s;
}
// Zeitpunkt, an dem die Scan-Kante die heiße Zelle überstreicht
const LOCK = Math.round(FLUG_START + FLUG_DAUER * kurveZeit(FLUG_KURVE, (HU - START_U) / WEG)) + 120;
const FLUG_ENDE = FLUG_START + FLUG_DAUER;

const CSS = `
.tv10-heben { opacity: 0; animation: tv10-heben 1100ms cubic-bezier(0.22,1,0.36,1) 60ms forwards; }
@keyframes tv10-heben { from { opacity: 0; transform: translateY(34px); } to { opacity: 1; transform: none; } }
.tv10-flug0 { transform: translateX(${-WEG}px); }
.tv10-flug { animation: tv10-flug ${FLUG_DAUER}ms cubic-bezier(${FLUG_KURVE.join(",")}) ${FLUG_START}ms both; }
@keyframes tv10-flug { from { transform: translateX(${-WEG}px); } to { transform: none; } }
.tv10-glanz0 { transform: translateX(-260px); }
.tv10-glanz { animation: tv10-glanz 1700ms cubic-bezier(0.45,0,0.25,1) 350ms both; }
@keyframes tv10-glanz { from { transform: translateX(-260px); } to { transform: translateX(${W + 320}px); } }
.tv10-patrouille { animation: tv10-patrouille 13s cubic-bezier(0.45,0,0.55,1) ${FLUG_ENDE + 900}ms infinite alternate; }
@keyframes tv10-patrouille { to { transform: translateX(-640px); } }
.tv10-schweben { animation: tv10-schweben 3.2s ease-in-out infinite alternate; }
@keyframes tv10-schweben { to { transform: translate(${rd(HOCH_U * 7)}px, ${rd(HOCH_V * 7)}px); } }
.tv10-rotor { animation: tv10-rotor 420ms linear infinite; }
@keyframes tv10-rotor { to { transform: rotate(360deg); } }
.tv10-lock0 { opacity: 0; }
.tv10-lock { animation: tv10-lock 900ms cubic-bezier(0.16,1,0.3,1) ${LOCK}ms both; }
@keyframes tv10-lock { from { opacity: 0; transform: scale(3.2); } 55% { opacity: 1; } to { opacity: 1; transform: none; } }
.tv10-atmen { animation: tv10-atmen 2.2s ease-in-out ${LOCK + 900}ms infinite alternate; }
@keyframes tv10-atmen { to { transform: scale(1.12); } }
.tv10-blitz { opacity: 0; }
.tv10-blitz.an { animation: tv10-blitz 1100ms ease-out ${LOCK + 380}ms both; }
@keyframes tv10-blitz { from { opacity: 0; transform: scale(0.6); } 20% { opacity: 1; } to { opacity: 0; transform: scale(2.6); } }
.tv10-zeigen { opacity: 0; animation: tv10-zeigen 320ms ease-out both; }
@keyframes tv10-zeigen { to { opacity: 1; } }
.tv10-glimmen { animation: tv10-glimmen 2.8s ease-in-out ${LOCK}ms infinite alternate; }
@keyframes tv10-glimmen { from { opacity: 0.55; } to { opacity: 1; } }
.tv10-waerme { animation: tv10-waerme 5s ease-in-out infinite alternate; }
@keyframes tv10-waerme { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .tv10-heben, .tv10-zeigen, .tv10-flug, .tv10-glanz, .tv10-patrouille, .tv10-schweben, .tv10-rotor, .tv10-lock, .tv10-atmen, .tv10-glimmen, .tv10-waerme { animation: none !important; opacity: 1; transform: none; }
  .tv10-glanz { opacity: 0; }
  .tv10-blitz.an { animation: none; }
}
`;

/* ---------- Drohne (Draufsicht, Feld-Koordinaten, Mitte 0|0, Flugrichtung +u) ---------- */
const ARM = 46;
const ROTOR = 30;
const ROTOREN = [
  [ARM, -ARM],
  [ARM, ARM],
  [-ARM, -ARM],
  [-ARM, ARM],
];

function Drohne({ aktiv }) {
  return (
    <g>
      {ROTOREN.map(([x, y]) => (
        <line key={`a${x}${y}`} x1="0" y1="0" x2={x} y2={y} stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
      ))}
      {ROTOREN.map(([x, y]) => (
        <g key={`r${x}${y}`} transform={`translate(${x} ${y})`}>
          <circle r={ROTOR} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
          <g className={aktiv ? "tv10-rotor" : undefined}>
            <path d={`M${-ROTOR + 3} 0A${ROTOR - 3} ${ROTOR - 3} 0 0 1 -6 ${-ROTOR + 8}L0 0Z`} fill="rgba(255,255,255,0.16)" />
            <path d={`M${ROTOR - 3} 0A${ROTOR - 3} ${ROTOR - 3} 0 0 1 6 ${ROTOR - 8}L0 0Z`} fill="rgba(255,255,255,0.16)" />
            <line x1={-ROTOR + 3} y1="0" x2={ROTOR - 3} y2="0" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
          </g>
          <circle r="4.5" fill="#fff" />
        </g>
      ))}
      <rect x="-30" y="-21" width="60" height="42" rx="15" fill={NAVY_TIEF} stroke="#fff" strokeWidth="2.5" />
      <rect x="-18" y="-11" width="30" height="22" rx="8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <circle cx="22" cy="0" r="8" fill="#0a1a33" stroke="#fff" strokeWidth="2" />
      <circle cx="22" cy="0" r="3.4" fill={SONNE} />
      <circle cx={ARM + 4} cy={-ARM + 4} r="4" fill={GRUEN} className={aktiv ? "tv-blinken" : undefined} />
      <circle cx={ARM + 4} cy={ARM - 4} r="4" fill={GRUEN} className={aktiv ? "tv-blinken" : undefined} />
    </g>
  );
}

export default function ThermoGrafik({ aktiv }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const k = (name) => (aktiv ? `tv10-${name}` : `tv10-${name}0`);

  const zellen = [];
  for (let r = 0; r < 2; r++)
    for (let m = 0; m < 5; m++)
      for (let s = 0; s < 6; s++)
        for (let z = 0; z < 10; z++) {
          const i = ((r * 5 + m) * 6 + s) * 10 + z;
          let t = 0.12 + 0.24 * rausch(i) + 0.05 * (z / 10);
          if (m === HEISS.m && r === HEISS.r) {
            const d = Math.max(Math.abs(s - HEISS.s), Math.abs(z - HEISS.z));
            if (d === 0) t = 1;
            else if (d === 1) t = 0.66 + 0.06 * rausch(i + 7);
            else if (d === 2) t = Math.max(t, 0.44);
          }
          zellen.push({ x: m * (MW + GAP) + s * Z, y: r * (MH + GAP) + z * Z, t, key: i });
        }
  const spalten = [];
  for (let m = 0; m < 5; m++)
    for (let s = 0; s < 6; s++) {
      const x = m * (MW + GAP) + s * Z;
      const p = (x + Z / 2 - START_U) / WEG;
      spalten.push({ key: `${m}${s}`, x, ms: Math.round(FLUG_START + FLUG_DAUER * kurveZeit(FLUG_KURVE, p)) - 60, zellen: zellen.filter((c) => c.x === x) });
    }
  const tafeln = [];
  for (let r = 0; r < 2; r++) for (let m = 0; m < 5; m++) tafeln.push({ x: m * (MW + GAP), y: r * (MH + GAP), key: `${r}${m}` });

  // Beschriftung (Bildschirm-Koordinaten)
  const [ex, ey] = P(HU + 30, HV + 30); // Ecke des Fadenkreuzes
  const TX = 700;
  const TY = 700;
  const fund = auf(aktiv, LOCK + 520);
  const leg = auf(aktiv, FLUG_ENDE - 300);
  const leiter = strich(aktiv, LOCK + 380, 700);

  // Kamerastreifen (Feld-Koordinaten, relativ zur Drohnen-Position)
  const FW = 34;
  const kegel = `M${DU} ${DV + 10}L${FW} ${H}L${-FW} ${H}L${-FW} 0Z`;
  const ecke = (x, y, sx, sy) => `M${x + sx * 18} ${y}H${x}V${y + sy * 18}`;

  return (
    <svg viewBox="0 0 1040 840" className="h-full w-full" style={{ overflow: "visible" }} aria-hidden="true">
      <style>{CSS}</style>
      <defs>
        <linearGradient id={`${id}s`} x1="0" x2="1">
          {THERMO.map(([p, c]) => (
            <stop key={p} offset={p} stopColor={`rgb(${c.join(",")})`} />
          ))}
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a64b8" />
          <stop offset="0.55" stopColor="#154592" />
          <stop offset="1" stopColor="#0c2c66" />
        </linearGradient>
        <linearGradient id={`${id}k`} gradientUnits="userSpaceOnUse" x1={DU} y1={DV} x2="0" y2={H}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.26" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}n`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id={`${id}h`}>
          <stop offset="0" stopColor="rgb(255,200,90)" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="rgb(240,110,50)" stopOpacity="0.3" />
          <stop offset="1" stopColor="rgb(214,72,52)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}w`}>
          <stop offset="0" stopColor="rgb(170,60,120)" stopOpacity="0.4" />
          <stop offset="1" stopColor="rgb(170,60,120)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}d`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}f`}>
          <stop offset="0" stopColor="#0a2a5c" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0a2a5c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}r`} gradientUnits="userSpaceOnUse" cx={W / 2} cy={H / 2} r="700">
          <stop offset="0.3" stopColor="#7fa7d6" stopOpacity="0.22" />
          <stop offset="1" stopColor="#7fa7d6" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}m`}>
          {tafeln.map((m) => (
            <rect key={m.key} x={m.x} y={m.y} width={MW} height={MH} rx="3" />
          ))}
        </clipPath>
      </defs>

      {/* Feld: Grundfläche, Modul-Kanten, Module, Glanz, Wärmebild */}
      <g className={aktiv ? "tv10-heben" : "opacity-0"}>
        <ellipse cx={P(W / 2, H / 2)[0]} cy={P(W / 2, H / 2)[1] + 20} rx="560" ry="250" fill={`url(#${id}f)`} />
        <g transform={EBENE}>
          <path d={RASTER} fill="none" stroke={`url(#${id}r)`} strokeWidth="1.5" />
          {tafeln.map((m) => (
            <rect key={m.key} x={m.x - 3} y={m.y + 13} width={MW} height={MH} rx="3" fill="#01081a" />
          ))}
          {tafeln.map((m) => (
            <Modul key={m.key} x={m.x} y={m.y} w={MW} h={MH} verlauf={`url(#${id}b)`} rand="rgba(255,255,255,0.35)" />
          ))}
          <g clipPath={`url(#${id}m)`}>
            <g className={k("glanz")}>
              <path d={`M-120 -20H0L-160 ${H + 20}H-280Z`} fill={`url(#${id}g)`} />
            </g>
          </g>
          {/* Wärmebild: Zellspalten erscheinen genau dann, wenn die Scan-Kante sie erreicht */}
          {spalten.map((sp) => (
            <g key={sp.key} className={aktiv ? "tv10-zeigen" : "opacity-0"} style={aktiv ? { animationDelay: `${sp.ms}ms` } : undefined}>
              {[0, 1].map((r) => (
                <rect key={r} x={sp.x - 0.5} y={r * (MH + GAP) - 0.5} width={Z + 1} height={MH + 1} fill="#0a0a22" />
              ))}
              {sp.zellen.map((c) => (
                <rect key={c.key} x={c.x + 0.8} y={c.y + 0.8} width={Z - 1.6} height={Z - 1.6} fill={thermFarbe(c.t)} />
              ))}
            </g>
          ))}
          <g className={aktiv ? "tv10-zeigen" : "opacity-0"} style={aktiv ? { animationDelay: `${FLUG_ENDE}ms`, animationDuration: "1600ms" } : undefined}>
            {/* leichte Wärmeschwankung */}
            <g className={aktiv ? "tv10-waerme" : "opacity-0"}>
              <ellipse cx="120" cy="140" rx="170" ry="120" fill={`url(#${id}w)`} />
              <ellipse cx="700" cy="380" rx="170" ry="130" fill={`url(#${id}w)`} />
            </g>
            <g className={aktiv ? "tv10-waerme" : "opacity-0"} style={aktiv ? { animationDelay: "-2.5s" } : undefined}>
              <ellipse cx="560" cy="120" rx="180" ry="110" fill={`url(#${id}w)`} />
              <ellipse cx="200" cy="400" rx="150" ry="110" fill={`url(#${id}w)`} />
            </g>
          </g>
          <g className={aktiv ? "tv10-zeigen" : "opacity-0"} style={aktiv ? { animationDelay: `${LOCK - 200}ms`, animationDuration: "900ms" } : undefined}>
            <g className={aktiv ? "tv10-glimmen" : undefined}>
              <circle cx={HU} cy={HV} r="80" fill={`url(#${id}h)`} />
            </g>
          </g>
        </g>
      </g>

      {/* Fadenkreuz auf der heißen Zelle */}
      <g transform={EBENE}>
        <g transform={`translate(${HU} ${HV})`}>
          <circle r="22" fill="none" stroke="#fff" strokeWidth="3" className={`tv10-blitz ${aktiv ? "an" : ""}`} />
          <g className={k("lock")}>
            <g className={aktiv ? "tv10-atmen" : undefined}>
              <path d={[ecke(-30, -30, 1, 1), ecke(30, -30, -1, 1), ecke(-30, 30, 1, -1), ecke(30, 30, -1, -1)].join("")} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M-52 0H-38M38 0H52M0 -52V-38M0 38V52" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </g>

      {/* Drohne mit Kamerastreifen und Schatten */}
      <g className={aktiv ? "tv-auf" : "opacity-0"} style={aktiv ? { animationDelay: `${FLUG_START}ms`, animationDuration: "700ms" } : undefined}>
        <g transform={`${EBENE} translate(${W} 0)`}>
          <g className={k("flug")}>
            <g className={aktiv ? "tv10-patrouille" : undefined}>
              <ellipse cx="-70" cy={H / 2 + 70} rx="90" ry="90" fill={`url(#${id}d)`} />
              <path d={kegel} fill={`url(#${id}k)`} />
              <rect x={-FW} y="0" width={FW} height={H} fill={`url(#${id}n)`} />
              <path
                d={[ecke(-FW, 0, 1, 1), ecke(FW, 0, -1, 1), ecke(-FW, H, 1, -1), ecke(FW, H, -1, -1)].join("")}
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.8"
              />
              <line x1="0" y1="-8" x2="0" y2={H + 8} stroke="#fff" strokeWidth="10" opacity="0.18" />
              <line x1="0" y1="-8" x2="0" y2={H + 8} stroke="#fff" strokeWidth="3" />
              <g transform={`translate(${DU} ${DV})`}>
                <g className={aktiv ? "tv10-schweben" : undefined}>
                  <g transform="scale(1.25)">
                    <Drohne aktiv={aktiv} />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>

      {/* Befund */}
      <g className={fund.className} style={fund.style}>
        <circle cx={ex} cy={ey} r="5" fill="#fff" />
        <text x={TX} y={TY} fontSize="34" fontWeight="800" fill="#fff" style={{ ...DISPLAY, letterSpacing: "-0.02em" }}>
          Auffällige Zelle
        </text>
        <text x={TX} y={TY + 36} fontSize="24" fill="rgba(255,255,255,0.72)">
          nur im Wärmebild sichtbar
        </text>
      </g>
      <path d={`M${ex} ${ey}L${TX - 40} ${TY - 12}H${TX - 14}`} fill="none" stroke="#fff" strokeWidth="2" {...leiter} />

      {/* Legende */}
      <g className={leg.className} style={leg.style}>
        <text x="330" y="784" textAnchor="end" fontSize="22" fill="rgba(255,255,255,0.72)">
          kühler
        </text>
        <rect x="346" y="768" width="348" height="16" rx="8" fill={`url(#${id}s)`} />
        <text x="710" y="784" fontSize="22" fill="rgba(255,255,255,0.72)">
          wärmer
        </text>
        <text x="520" y="828" textAnchor="middle" fontSize="20" fill="rgba(255,255,255,0.5)">
          Schematische Darstellung einer Drohnen-Thermografie
        </text>
      </g>
    </svg>
  );
}
