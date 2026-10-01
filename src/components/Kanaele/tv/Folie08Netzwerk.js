"use client";

import { Droplets, Factory, Flame, House, Landmark, School, Warehouse } from "lucide-react";
import { GRUEN, GRUEN_HELL, SONNE, NAVY, NAVY_TIEF, DISPLAY, rd, SvgIcon } from "./gemeinsam";

/* ================================================================== */
/* 8 · Netzwerk: Energiegemeinschaft (Kürzel tv08)                      */
/* ================================================================== */
//
// Choreografie (ab `aktiv`):
//   0,0 s  Höhenlinien der Gemeinde blenden ein, weiches Licht driftet
//   0,1 s  Gemeindedach zündet wie eine kleine Sonne (Glut, Blitz, Korona)
//   0,7 s  Leitungen wachsen als Lichtspuren nach außen, Teilnehmer erscheinen beim Eintreffen
//   1,3 s  Grenze der Energiegemeinschaft zeichnet sich einmal rundum, Beschriftung folgt
//   ab 3 s Energie-Teilchen laufen im Uhrzeigersinn reihum zu allen Teilnehmern,
//          jeder Knoten leuchtet beim Eintreffen auf; Korona und Grenze atmen ruhig.

const TEILNEHMER = [
  { icon: School, l: "Schule" },
  { icon: Warehouse, l: "Bauhof" },
  { icon: Droplets, l: "Kläranlage" },
  { icon: House, l: "Haushalte" },
  { icon: Factory, l: "Betriebe" },
  { icon: Flame, l: "Feuerwehrhaus" },
];

const CX = 520;
const CY = 430;
const RK = 104; // Kern (Gemeindedach)
const RN = 58; // Teilnehmer
const TAKT = 3000; // ms je Umlauf der Teilchen
const VERSATZ = TAKT / TEILNEHMER.length;
const START_TEILCHEN = 3000;
const FAHRT = 0.55; // Anteil des Takts, in dem ein Teilchen unterwegs ist
const L_SPUR = 0.2; // Länge des Schweifs (pathLength = 1)
const L_KOPF = 0.018;
const L_HALO = 0.05;

/* ---------- Geometrie (einmal, deterministisch, gerundet) ---------- */

/** Geschlossene, weiche Kurve durch Punkte (Catmull-Rom → Bézier). */
function glatt(p) {
  const n = p.length;
  let d = `M${rd(p[0][0])} ${rd(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const a = p[(i - 1 + n) % n];
    const b = p[i];
    const c = p[(i + 1) % n];
    const e = p[(i + 2) % n];
    d += `C${rd(b[0] + (c[0] - a[0]) / 6)} ${rd(b[1] + (c[1] - a[1]) / 6)} ${rd(c[0] - (e[0] - b[0]) / 6)} ${rd(c[1] - (e[1] - b[1]) / 6)} ${rd(c[0])} ${rd(c[1])}`;
  }
  return d + "Z";
}

const KNOTEN = TEILNEHMER.map((t, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  const nx = rd(CX + 362 * Math.cos(a));
  const ny = rd(CY + 262 * Math.sin(a));
  // leicht gebogene Leitung (alle im selben Drehsinn) von Kernmitte zu Knotenmitte
  const dx = nx - CX;
  const dy = ny - CY;
  const len = Math.hypot(dx, dy);
  const qx = rd(CX + dx / 2 - (dy / len) * len * 0.1);
  const qy = rd(CY + dy / 2 + (dx / len) * len * 0.1);
  const pfad = `M${CX} ${CY}Q${qx} ${qy} ${nx} ${ny}`;
  // Anteil der Strecke, an dem das Teilchen den Knotenrand erreicht (Kurve ≈ 2 % länger)
  const rand = (len * 1.02 - RN) / (len * 1.02);
  const ankunft = Math.round(START_TEILCHEN + i * VERSATZ + ((TAKT * FAHRT) * rand) / (1 + L_SPUR));
  return { ...t, nx, ny, pfad, ankunft, oben: i === 0 };
});

const GRENZE = (() => {
  const p = [];
  const n = 56;
  for (let k = 0; k < n; k++) {
    const th = ((135 + (k * 360) / n) * Math.PI) / 180;
    const w = 1 + 0.012 * Math.sin(3 * th + 0.8) + 0.009 * Math.sin(5 * th + 2.1) + 0.005 * Math.sin(8 * th + 0.3);
    p.push([CX + 492 * w * Math.cos(th), CY + 390 * w * Math.sin(th)]);
  }
  return glatt(p);
})();

const HOEHENLINIEN = (() => {
  const huegel = [
    { x: 150, y: 790, sx: 1.25, sy: 0.9, f: 0.4, n: 9 },
    { x: 960, y: 70, sx: 1.1, sy: 0.95, f: 2.3, n: 8 },
    { x: 1010, y: 820, sx: 0.9, sy: 0.7, f: 4.1, n: 4 },
  ];
  const linien = [];
  huegel.forEach((h, hi) => {
    for (let k = 0; k < h.n; k++) {
      const R = 46 + k * 58;
      const p = [];
      const n = 60;
      for (let j = 0; j < n; j++) {
        const th = (j * 2 * Math.PI) / n;
        const w = 1 + 0.09 * Math.sin(2 * th + h.f + k * 0.33) + 0.05 * Math.sin(3 * th - h.f * 0.7 - k * 0.21) + 0.025 * Math.sin(5 * th + h.f + k * 0.5);
        p.push([h.x + R * h.sx * w * Math.cos(th), h.y + R * h.sy * w * Math.sin(th)]);
      }
      linien.push({ d: glatt(p), stark: k % 4 === 3, key: `${hi}-${k}` });
    }
  });
  return linien;
})();

const KORONA = (() => {
  let d = "";
  const n = 72;
  for (let i = 0; i < n; i++) {
    const a = (i * 2 * Math.PI) / n;
    const r0 = RK + 18;
    const r1 = RK + (i % 2 === 0 ? 44 : i % 4 === 1 ? 30 : 26);
    d += `M${rd(CX + r0 * Math.cos(a))} ${rd(CY + r0 * Math.sin(a))}L${rd(CX + r1 * Math.cos(a))} ${rd(CY + r1 * Math.sin(a))}`;
  }
  return d;
})();

/* ---------- Stil ---------- */

const EASE = "cubic-bezier(0.22,1,0.36,1)";
const CSS = `
.tv08 .tv08-zieh { stroke-dasharray: 1 1; }
@media (prefers-reduced-motion: no-preference) {
  .tv08-aus .tv08-ein, .tv08-aus .tv08-wachs { opacity: 0; }
  .tv08-aus .tv08-zieh { stroke-dashoffset: 1; }
  .tv08-an .tv08-ein { animation: tv08-ein var(--t, 900ms) ${EASE} var(--d, 0ms) both; }
  .tv08-an .tv08-wachs { animation: tv08-wachs var(--t, 1100ms) ${EASE} var(--d, 0ms) both; }
  .tv08-an .tv08-zieh { animation: tv08-zieh var(--t, 1000ms) cubic-bezier(0.65,0,0.35,1) var(--d, 0ms) both; }
  .tv08-an .tv08-komet { animation: tv08-komet var(--t, 1000ms) cubic-bezier(0.65,0,0.35,1) var(--d, 0ms) both; }
  .tv08-an .tv08-blitz { animation: tv08-blitz var(--t, 1300ms) cubic-bezier(0.16,1,0.3,1) var(--d, 0ms) forwards; }
  .tv08-an .tv08-teil { animation: tv08-teil ${TAKT}ms linear var(--d, 0ms) infinite; }
  .tv08-an .tv08-treffer { animation: tv08-treffer ${TAKT}ms cubic-bezier(0.22,1,0.36,1) var(--d, 0ms) infinite; }
  .tv08-an .tv08-leuchten { animation: tv08-leuchten ${TAKT}ms ease-out var(--d, 0ms) infinite; }
  .tv08-an .tv08-welle { animation: tv08-welle ${TAKT}ms cubic-bezier(0.2,0.6,0.35,1) var(--d, 0ms) infinite; }
  .tv08-an .tv08-atmen { animation: tv08-atmen 6s ease-in-out var(--d, 0ms) infinite alternate; }
  .tv08-an .tv08-glimmen { animation: tv08-glimmen 7s ease-in-out var(--d, 0ms) infinite alternate; }
  .tv08-an .tv08-lauf { animation: tv08-lauf 28s linear infinite; }
  .tv08-an .tv08-drift { animation: tv08-drift 19s ease-in-out infinite alternate; }
}
@keyframes tv08-ein { from { opacity: 0; } to { opacity: 1; } }
@keyframes tv08-wachs { from { opacity: 0; transform: scale(var(--s, 0.6)); } to { opacity: 1; transform: scale(1); } }
@keyframes tv08-zieh { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes tv08-komet {
  0% { stroke-dashoffset: var(--v0); opacity: 1; }
  82% { opacity: 1; }
  100% { stroke-dashoffset: var(--v1); opacity: 0; }
}
@keyframes tv08-blitz { from { opacity: 0.95; transform: scale(1); } to { opacity: 0; transform: scale(var(--s, 2.6)); } }
@keyframes tv08-teil {
  0% { stroke-dashoffset: var(--v0); opacity: 1; }
  ${FAHRT * 100}% { stroke-dashoffset: var(--v1); opacity: 1; }
  100% { stroke-dashoffset: var(--v1); opacity: 1; }
}
@keyframes tv08-treffer {
  0% { opacity: 0.95; transform: scale(1); }
  45% { opacity: 0; transform: scale(1.55); }
  100% { opacity: 0; transform: scale(1.55); }
}
@keyframes tv08-leuchten { 0% { opacity: 0; } 6% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
@keyframes tv08-welle { 0% { opacity: 0.5; transform: scale(1); } 70% { opacity: 0; transform: scale(2.05); } 100% { opacity: 0; transform: scale(2.05); } }
@keyframes tv08-atmen { from { transform: scale(1); opacity: 0.8; } to { transform: scale(1.045); opacity: 1; } }
@keyframes tv08-glimmen { from { opacity: 0.35; } to { opacity: 1; } }
@keyframes tv08-lauf { to { stroke-dashoffset: -1; } }
@keyframes tv08-drift { from { transform: translate(-70px, 40px); } to { transform: translate(80px, -50px); } }
.tv08 .tv08-teil, .tv08 .tv08-treffer, .tv08 .tv08-leuchten, .tv08 .tv08-welle, .tv08 .tv08-komet, .tv08 .tv08-blitz { opacity: 0; }
`;

/** Inline-Stil mit Verzögerung/Dauer/Ursprung als CSS-Variablen. */
const st = (d, t, extra) => ({ "--d": `${d}ms`, ...(t ? { "--t": `${t}ms` } : null), ...extra });
const um = (x, y) => ({ transformOrigin: `${x}px ${y}px` });

/** Energie-Teilchen: Halo, Schweif und Kopf laufen mit gemeinsamer Front. */
function Teilchen({ d, verz }) {
  const lauf = 1 + L_SPUR;
  const teil = (L, farbe, breite, deck) => (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={farbe}
      strokeOpacity={deck}
      strokeWidth={breite}
      strokeLinecap="round"
      strokeDasharray={`${L} 3`}
      className="tv08-teil"
      style={{ "--d": `${verz}ms`, "--v0": `${L}`, "--v1": `${rd((L - lauf) * 1000) / 1000}` }}
    />
  );
  return (
    <g>
      {teil(L_SPUR, SONNE, 5, 0.45)}
      {teil(L_HALO, SONNE, 30, 0.2)}
      {teil(L_HALO * 0.6, SONNE, 16, 0.4)}
      {teil(L_KOPF, "#fffbea", 11, 1)}
    </g>
  );
}

export default function NetzwerkGrafik({ aktiv }) {
  const wurzel = `tv08 ${aktiv ? "tv08-an" : "tv08-aus"}`;
  return (
    <svg viewBox="0 0 1040 840" className={`h-full w-full ${wurzel}`} aria-hidden="true" style={{ overflow: "visible" }}>
      <style>{CSS}</style>
      <defs>
        <radialGradient id="tv08-kern" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#fff0bf" />
          <stop offset="0.45" stopColor={SONNE} />
          <stop offset="1" stopColor="#e9a21c" />
        </radialGradient>
        <radialGradient id="tv08-glut">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.42" />
          <stop offset="0.35" stopColor={SONNE} stopOpacity="0.14" />
          <stop offset="0.7" stopColor={GRUEN} stopOpacity="0.06" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv08-flaeche" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.1" />
          <stop offset="0.75" stopColor={GRUEN} stopOpacity="0.035" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0.07" />
        </radialGradient>
        <radialGradient id="tv08-knoten" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#0d3163" />
          <stop offset="1" stopColor={NAVY_TIEF} />
        </radialGradient>
        <radialGradient id="tv08-hof">
          <stop offset="0.45" stopColor={GRUEN_HELL} stopOpacity="0.45" />
          <stop offset="1" stopColor={GRUEN_HELL} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv08-bluete">
          <stop offset="0.3" stopColor="#fff6d6" stopOpacity="0.9" />
          <stop offset="0.6" stopColor={SONNE} stopOpacity="0.35" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv08-licht">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.13" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv08-maske-verlauf" cx="0.5" cy="0.5" r="0.62">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="tv08-maske" maskUnits="userSpaceOnUse" x="-60" y="-60" width="1160" height="960">
          <rect x="-60" y="-60" width="1160" height="960" fill="url(#tv08-maske-verlauf)" />
        </mask>
        <path id="tv08-grenze" d={GRENZE} />
      </defs>

      {/* Hintergrund: Höhenlinien „vor Ort“ und driftendes Licht */}
      <g className="tv08-ein" style={st(0, 1800)} mask="url(#tv08-maske)">
        {HOEHENLINIEN.map((h) => (
          <path key={h.key} d={h.d} fill="none" stroke="#fff" strokeOpacity={h.stark ? 0.16 : 0.09} strokeWidth={h.stark ? 1.7 : 1.3} />
        ))}
      </g>
      <g className="tv08-drift">
        <circle cx={CX} cy={CY} r="420" fill="url(#tv08-licht)" />
      </g>

      {/* Grenze der Energiegemeinschaft */}
      <use href="#tv08-grenze" className="tv08-ein" style={st(2600, 1600)} fill="url(#tv08-flaeche)" />
      <g className="tv08-ein" style={st(3200, 1200)}>
        <use href="#tv08-grenze" className="tv08-glimmen" style={st(3200)} fill="none" stroke={GRUEN} strokeOpacity="0.16" strokeWidth="12" />
      </g>
      <path d={GRENZE} pathLength={1} className="tv08-zieh" style={st(1300, 1800)} fill="none" stroke={GRUEN} strokeOpacity="0.7" strokeWidth="2" />
      <path d={GRENZE} pathLength={1} className="tv08-komet" style={st(1300, 1800, { "--v0": "0.06", "--v1": "-0.94" })} fill="none" stroke={GRUEN_HELL} strokeWidth="4" strokeLinecap="round" strokeDasharray="0.06 3" />
      <g className="tv08-ein" style={st(3800, 1400)}>
        <path d={GRENZE} pathLength={1} className="tv08-lauf" fill="none" stroke={GRUEN_HELL} strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" strokeDasharray="0.035 0.3" />
      </g>
      <g className="tv08-ein" style={st(2700, 1200)}>
        <path d="M12 22H54" stroke={GRUEN} strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="54" cy="22" r="5" fill={GRUEN_HELL} />
        <text x="72" y="30" fontSize="24" fontWeight="700" fill={GRUEN_HELL} style={DISPLAY}>
          Energiegemeinschaft vor Ort
        </text>
      </g>

      {/* Glut hinter dem Kern */}
      <g className="tv08-wachs" style={st(100, 1600, { "--s": 0.3, ...um(CX, CY) })}>
        <circle cx={CX} cy={CY} r="300" fill="url(#tv08-glut)" className="tv08-atmen" style={st(1800, null, um(CX, CY))} />
      </g>

      {/* Leitungen */}
      {KNOTEN.map((k, i) => {
        const d0 = 650 + i * 110;
        return (
          <g key={`l-${k.l}`}>
            <path d={k.pfad} fill="none" stroke={GRUEN} strokeOpacity="0.07" strokeWidth="12" strokeLinecap="round" className="tv08-ein" style={st(d0 + 600, 1200)} />
            <path d={k.pfad} pathLength={1} fill="none" stroke={GRUEN} strokeOpacity="0.55" strokeWidth="3" className="tv08-zieh" style={st(d0, 950)} />
            <path d={k.pfad} pathLength={1} fill="none" stroke="#fffbea" strokeWidth="7" strokeLinecap="round" strokeDasharray="0.03 3" className="tv08-komet" style={st(d0, 950, { "--v0": "0.03", "--v1": "-0.97" })} />
            <path d={k.pfad} pathLength={1} fill="none" stroke={SONNE} strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" strokeDasharray="0.2 3" className="tv08-komet" style={st(d0, 950, { "--v0": "0.2", "--v1": "-0.8" })} />
            <Teilchen d={k.pfad} verz={START_TEILCHEN + i * VERSATZ} />
          </g>
        );
      })}

      {/* Kern: Photovoltaik auf dem Gemeindedach */}
      <circle cx={CX} cy={CY} r={RK + 8} fill="none" stroke={SONNE} strokeWidth="2" className="tv08-welle" style={st(2600, null, um(CX, CY))} />
      <circle cx={CX} cy={CY} r="190" fill="url(#tv08-bluete)" className="tv08-blitz" style={st(120, 1700, { "--s": 1.5, ...um(CX, CY) })} />
      <g className="tv08-wachs" style={st(300, 1400, { "--s": 0.8, ...um(CX, CY) })}>
        <path d={KORONA} stroke={SONNE} strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" className="tv08-atmen" style={st(1700, null, um(CX, CY))} />
      </g>
      <circle cx={CX} cy={CY} r={RK + 9} fill="none" stroke={SONNE} strokeOpacity="0.35" strokeWidth="1.5" className="tv08-ein" style={st(500, 1200)} />
      <g className="tv08-wachs" style={st(100, 900, { "--s": 0.6, ...um(CX, CY) })}>
        <circle cx={CX} cy={CY} r={RK} fill="url(#tv08-kern)" />
        <circle cx={CX} cy={CY} r={RK - 1} fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.5" />
        <SvgIcon icon={Landmark} x={CX} y={CY - 36} s={50} farbe={NAVY} breite={2} />
        <text x={CX} y={CY + 22} textAnchor="middle" fontSize="26" fontWeight="800" fill={NAVY} style={DISPLAY} letterSpacing="-0.3">
          Photovoltaik
        </text>
        <text x={CX} y={CY + 50} textAnchor="middle" fontSize="21" fontWeight="600" fill={NAVY} fillOpacity="0.78" style={DISPLAY}>
          Gemeindedach
        </text>
      </g>
      <circle cx={CX} cy={CY} r={RK + 6} fill="none" stroke={SONNE} strokeOpacity="0.7" strokeWidth="2.5" className="tv08-blitz" style={st(380, 1600, { "--s": 3, ...um(CX, CY) })} />

      {/* Teilnehmer */}
      {KNOTEN.map((k, i) => {
        const d1 = 650 + i * 110 + 720;
        return (
          <g key={k.l}>
            <circle cx={k.nx} cy={k.ny} r={RN + 44} fill="url(#tv08-hof)" className="tv08-leuchten" style={st(k.ankunft)} />
            <g className="tv08-wachs" style={st(d1, 900, { "--s": 0.82, ...um(k.nx, k.ny) })}>
              <circle cx={k.nx} cy={k.ny} r={RN} fill="url(#tv08-knoten)" stroke={GRUEN_HELL} strokeOpacity="0.4" strokeWidth="2" />
              <SvgIcon icon={k.icon} x={k.nx} y={k.ny} s={40} farbe="#fff" />
            </g>
            <circle cx={k.nx} cy={k.ny} r={RN} fill="none" stroke={GRUEN_HELL} strokeWidth="3" className="tv08-blitz" style={st(d1 + 120, null, { "--s": 1.6, ...um(k.nx, k.ny) })} />
            <circle cx={k.nx} cy={k.ny} r={RN} fill="none" stroke={GRUEN_HELL} strokeWidth="3" className="tv08-treffer" style={st(k.ankunft, null, um(k.nx, k.ny))} />
            <text x={k.nx} y={k.oben ? k.ny - RN - 22 : k.ny + RN + 38} textAnchor="middle" fontSize="25" fontWeight="700" fill="#fff" className="tv08-ein" style={{ ...DISPLAY, ...st(d1 + 250, 900) }}>
              {k.l}
            </text>
          </g>
        );
      })}

      <text x="1030" y="29" textAnchor="end" fontSize="20" fill="#fff" fillOpacity="0.4" className="tv08-ein" style={st(3200, 1200)}>
        Schematische Darstellung
      </text>
    </svg>
  );
}
