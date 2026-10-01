"use client";

import { mannschaftIcon } from "@/components/Mannschaft/icons";
import { GRUEN, GRUEN_HELL, GRUEN_TIEF, DISPLAY, rd, SvgIcon } from "./gemeinsam";

/* ================================================================== */
/* 3 · Ring: sechs Stationen, ein Ansprechpartner                      */
/* ================================================================== */
//
// Choreografie (ab `aktiv`):
//  0,1 s  Skalenringe drehen sich ein, leere Spur blendet auf
//  0,5 s  Ein Lichtkomet läuft einmal um den Ring (390°, stark abbremsend) und zieht die
//         Segmente hinter sich her; jede Station leuchtet auf, wenn er sie passiert
//  1,3 s  Mitte (ein fester Ansprechpartner) blendet auf
//  3,2 s  Der Komet bremst in Station 1 ab und wird zum Spotlight: es gleitet im 2-s-Takt
//         von Station zu Station (Segment, Symbol, Beschriftung und Knoten leuchten auf),
//         dazu wandern feine Lichtpunkte auf dem inneren Ring, die Mitte „atmet“.

const CX = 520;
const CY = 420;
const R = 222; // Mitte des Segmentbands
const BAND = 52;
const R_AUSSEN = R + BAND / 2;
const R_SKALA = 270;
const R_FLUSS = 176;

// Komet: Start, Dauer, Weg (eine Runde + bis zur Mitte von Station 1) und Verlauf
const K_START = 500;
const K_DAUER = 2700;
const K_WINKEL = 390;
const K_KURVE = [0.45, 0, 0.15, 1];
const T_ENDE = K_START + K_DAUER;
const SCHRITT = 2000; // Spotlight je Station

/** Zeitanteil, zu dem eine cubic-bezier-Kurve den Fortschritt p erreicht (deterministisch). */
function zeitAnteil(p, [x1, y1, x2, y2]) {
  const b = (s, a1, a2) => 3 * a1 * s * (1 - s) ** 2 + 3 * a2 * s * s * (1 - s) + s ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (b(m, y1, y2) < p) lo = m;
    else hi = m;
  }
  return b((lo + hi) / 2, x1, x2);
}
/** Zeitpunkt (ms), zu dem der Kometenkopf `w` Grad hinter dem Start (12 Uhr) steht. */
const zeitBei = (w) => Math.round(K_START + K_DAUER * zeitAnteil(w / K_WINKEL, K_KURVE));

const pol = (a, rr) => [rd(CX + rr * Math.cos((a * Math.PI) / 180)), rd(CY + rr * Math.sin((a * Math.PI) / 180))];
const bogen = (a0, a1, rr) => {
  const [x0, y0] = pol(a0, rr);
  const [x1, y1] = pol(a1, rr);
  return `M${x0} ${y0}A${rr} ${rr} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};
const ms = (v) => `${Math.round(v)}ms`;

function skala(r0, r1, schritt, lang, r0lang, r1lang) {
  let d = "";
  for (let a = 0; a < 360; a += schritt) {
    const gross = lang && a % lang === 0;
    const [x0, y0] = pol(a - 90, gross ? r0lang : r0);
    const [x1, y1] = pol(a - 90, gross ? r1lang : r1);
    d += `M${x0} ${y0}L${x1} ${y1}`;
  }
  return d;
}
const SKALA_AUSSEN = skala(R_SKALA - 3, R_SKALA + 3, 3, 60, R_SKALA - 10, R_SKALA + 10);
const SKALA_INNEN = skala(158, 164, 6, 0);

export default function RingGrafik({ f, aktiv }) {
  const n = f.stationen.length;
  const teil = 360 / n;
  const luecke = 1.8;
  const zyklus = n * SCHRITT;
  const verweil = (1300 / zyklus) * 100;
  // Spotlight: gleiten – verweilen – gleiten (Kurve gilt je Abschnitt)
  let gleiten = "";
  for (let k = 0; k < n; k++) {
    const p = (k * 100) / n;
    gleiten += `${p.toFixed(3)}%{transform:rotate(${rd(k * teil)}deg)}${(p + verweil).toFixed(3)}%{transform:rotate(${rd(k * teil)}deg)}`;
  }
  gleiten += "100%{transform:rotate(360deg)}";
  const hlVorlauf = zyklus * 0.04; // Spotlight erreicht die Station bei 4 % ihres Zyklus

  const s0a0 = -90 + luecke;
  const s0a1 = -90 + teil - luecke;
  const s0m = -90 + teil / 2;
  const [s0x, s0y] = pol(s0m, R);
  const [s0mx, s0my] = pol(s0m, R_SKALA);
  const [kopfX, kopfY] = pol(-90, R);
  const [schweifX, schweifY] = pol(-90 - 80, R);

  const Person = mannschaftIcon("UserRoundCheck");

  return (
    <svg viewBox="0 0 1040 840" className={`h-full w-full ${aktiv ? "tv03-an" : ""}`} aria-hidden="true">
      <style>{`
        .tv03-ein, .tv03-skala, .tv03-lab, .tv03-pop, .tv03-mitte, .tv03-spot-ein, .tv03-komet-huelle, .tv03-hell, .tv03-welle { opacity: 0; }
        .tv03-seg { stroke-dasharray: 1; stroke-dashoffset: 1; }
        .tv03-skala, .tv03-komet, .tv03-spot { transform-box: view-box; transform-origin: ${CX}px ${CY}px; }
        .tv03-pop, .tv03-ic, .tv03-mitte, .tv03-welle { transform-box: fill-box; transform-origin: center; }
        .tv03-an .tv03-ein { animation: tv03-ein 1000ms cubic-bezier(0.22,1,0.36,1) both; }
        .tv03-an .tv03-skala { animation: tv03-skala 2200ms cubic-bezier(0.22,1,0.36,1) both; }
        .tv03-an .tv03-seg { animation: tv03-zeichnen linear both; }
        .tv03-an .tv03-komet { animation: tv03-komet ${K_DAUER}ms cubic-bezier(${K_KURVE.join(",")}) ${K_START}ms both; }
        .tv03-an .tv03-komet-huelle { animation: tv03-komet-huelle ${K_DAUER + 300}ms linear ${K_START}ms both; }
        .tv03-an .tv03-spot-ein { animation: tv03-ein 700ms ease-out ${T_ENDE - 450}ms both; }
        .tv03-an .tv03-spot { animation: tv03-gleiten ${zyklus}ms cubic-bezier(0.65,0,0.35,1) ${T_ENDE}ms infinite; }
        .tv03-an .tv03-pop { animation: tv03-pop 800ms cubic-bezier(0.22,1,0.36,1) both; }
        .tv03-an .tv03-welle { animation: tv03-welle 1400ms cubic-bezier(0.22,1,0.36,1) forwards; }
        .tv03-an .tv03-lab { animation: tv03-lab 1100ms cubic-bezier(0.22,1,0.36,1) both; }
        .tv03-an .tv03-mitte { animation: tv03-mitte 1400ms cubic-bezier(0.22,1,0.36,1) 1300ms both; }
        .tv03-an .tv03-atmen { animation: tv03-atmen 5s ease-in-out 2600ms infinite alternate; }
        .tv03-an .tv03-fluss { animation: tv03-fluss 1800ms linear infinite; }
        .tv03-an .tv03-ic { animation: tv03-ic ${zyklus}ms cubic-bezier(0.22,1,0.36,1) infinite; }
        @keyframes tv03-ein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tv03-skala { from { opacity: 0; transform: rotate(-28deg); } to { opacity: 1; transform: none; } }
        @keyframes tv03-zeichnen { to { stroke-dashoffset: 0; } }
        @keyframes tv03-komet { from { transform: rotate(0deg); } to { transform: rotate(${K_WINKEL}deg); } }
        @keyframes tv03-komet-huelle { 0% { opacity: 0; } 8% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes tv03-gleiten { ${gleiten} }
        @keyframes tv03-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
        @keyframes tv03-welle { 0% { opacity: 0.85; transform: scale(0.9); } 100% { opacity: 0; transform: scale(2.1); } }
        @keyframes tv03-lab { from { opacity: 0; transform: translate(var(--tv03-dx), var(--tv03-dy)); } to { opacity: 1; transform: none; } }
        @keyframes tv03-blitz { 0% { opacity: 0; } 18% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes tv03-hl { 0% { opacity: 0; } 4% { opacity: 1; } 15% { opacity: 1; } 21% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes tv03-ic { 0% { transform: none; } 4% { transform: scale(1.16); } 15% { transform: scale(1.16); } 21% { transform: none; } 100% { transform: none; } }
        @keyframes tv03-mitte { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: none; } }
        @keyframes tv03-atmen { from { opacity: 0.55; } to { opacity: 1; } }
        @keyframes tv03-fluss { to { stroke-dashoffset: -0.0208333; } }
        @media (prefers-reduced-motion: reduce) {
          .tv03-an * { animation: none !important; }
          .tv03-an .tv03-ein, .tv03-an .tv03-skala, .tv03-an .tv03-lab, .tv03-an .tv03-pop, .tv03-an .tv03-mitte { opacity: 1; }
          .tv03-an .tv03-seg { stroke-dashoffset: 0; }
          .tv03-an .tv03-dim { opacity: 1; }
        }
      `}</style>

      <defs>
        <radialGradient id="tv03-mitte-glow">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.2" />
          <stop offset="0.6" stopColor={GRUEN} stopOpacity="0.06" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv03-licht">
          <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0.5" />
          <stop offset="0.45" stopColor={GRUEN} stopOpacity="0.14" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv03-kopf">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor={GRUEN_HELL} stopOpacity="0.18" />
          <stop offset="1" stopColor={GRUEN_HELL} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tv03-schweif" gradientUnits="userSpaceOnUse" x1={schweifX} y1={schweifY} x2={kopfX} y2={kopfY}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
        {f.stationen.map((st, i) => {
          const [x0, y0] = pol(-90 + i * teil + luecke, R);
          const [x1, y1] = pol(-90 + (i + 1) * teil - luecke, R);
          return (
            <linearGradient key={st.id} id={`tv03-seg-${i}`} gradientUnits="userSpaceOnUse" x1={x0} y1={y0} x2={x1} y2={y1}>
              <stop offset="0" stopColor={GRUEN_TIEF} />
              <stop offset="1" stopColor={GRUEN} />
            </linearGradient>
          );
        })}
      </defs>

      {/* Tiefe: Lichthof, Skalen, leere Spur */}
      <circle className="tv03-atmen" cx={CX} cy={CY} r="190" fill="url(#tv03-mitte-glow)" />
      <g className="tv03-skala" style={{ animationDelay: "100ms" }}>
        <circle cx={CX} cy={CY} r={R_SKALA} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <path d={SKALA_AUSSEN} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </g>
      <g className="tv03-ein" style={{ animationDelay: "250ms" }}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={BAND} />
        <path d={SKALA_INNEN} stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      </g>
      <g className="tv03-ein" style={{ animationDelay: "1200ms" }}>
        <circle className="tv03-fluss" cx={CX} cy={CY} r={R_FLUSS} fill="none" stroke={GRUEN_HELL} strokeOpacity="0.45" strokeWidth="2.6" strokeLinecap="round" pathLength="1" strokeDasharray="0.0001 0.0207333" />
      </g>

      {/* Segmente: werden vom Kometen gezogen */}
      {f.stationen.map((st, i) => {
        const a0 = -90 + i * teil + luecke;
        const a1 = -90 + (i + 1) * teil - luecke;
        const t0 = zeitBei(i * teil + luecke);
        const t1 = zeitBei((i + 1) * teil - luecke);
        const zeit = { animationDelay: ms(t0), animationDuration: ms(Math.max(40, t1 - t0)) };
        return (
          <g key={st.id}>
            <path className="tv03-seg" d={bogen(a0, a1, R)} pathLength="1" fill="none" stroke={`url(#tv03-seg-${i})`} strokeWidth={BAND} style={zeit} />
            <path className="tv03-seg" d={bogen(a0, a1, R_AUSSEN - 1)} pathLength="1" fill="none" stroke={GRUEN_HELL} strokeOpacity="0.85" strokeWidth="2" style={zeit} />
            <path className="tv03-seg" d={bogen(a0, a1, R - BAND / 2 + 1.5)} pathLength="1" fill="none" stroke="#03122b" strokeOpacity="0.35" strokeWidth="3" style={zeit} />
          </g>
        );
      })}

      {/* Spotlight: übernimmt vom Kometen und gleitet von Station zu Station */}
      <g className="tv03-spot-ein">
        <g className="tv03-spot">
          <circle cx={s0x} cy={s0y} r="170" fill="url(#tv03-licht)" />
          <path d={bogen(s0a0, s0a1, R)} fill="none" stroke={GRUEN_HELL} strokeOpacity="0.5" strokeWidth={BAND} />
          <path d={bogen(s0a0, s0a1, R_AUSSEN - 1)} fill="none" stroke="#fff" strokeWidth="3" />
          <circle cx={s0mx} cy={s0my} r="16" fill="url(#tv03-kopf)" />
          <circle cx={s0mx} cy={s0my} r="4.5" fill="#fff" />
        </g>
      </g>

      {/* Stationen */}
      {f.stationen.map((st, i) => {
        const am = -90 + i * teil + teil / 2;
        const rad = (am * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const [ix, iy] = pol(am, R);
        const [d0x, d0y] = pol(am, R_SKALA);
        const [l0x, l0y] = pol(am, R_SKALA + 8);
        const [l1x, l1y] = pol(am, 294);
        const [nx, ny] = pol(am, R_FLUSS);
        const [lx, ly] = pol(am, Math.abs(cos) > 0.9 ? 306 : 312);
        const anker = cos > 0.2 ? "start" : cos < -0.2 ? "end" : "middle";
        const kb = sin < -0.3 ? ly - 58 : sin > 0.3 ? ly + 4 : ly - 26;
        const tPass = zeitBei(i * teil + teil / 2);
        const tHl = T_ENDE + i * SCHRITT - hlVorlauf;
        const hlStil = aktiv ? { animation: `tv03-blitz 2200ms cubic-bezier(0.22,1,0.36,1) ${ms(tPass)} both, tv03-hl ${zyklus}ms linear ${ms(tHl)} infinite` } : undefined;
        const knotenStil = aktiv ? { animation: `tv03-hl ${zyklus}ms linear ${ms(tHl)} infinite` } : undefined;
        const nr = String(i + 1).padStart(2, "0");
        const beschriftung = (hell) => (
          <>
            <text x={lx} y={kb} textAnchor={anker} fontSize="21" fontWeight="800" letterSpacing="1.5" fill={hell ? GRUEN_HELL : GRUEN} style={DISPLAY}>
              {nr}
            </text>
            <text x={lx} y={kb + 35} textAnchor={anker} fontSize="29" fontWeight="800" letterSpacing="-0.4" fill="#fff" style={DISPLAY}>
              {st.titel}
            </text>
            <text x={lx} y={kb + 66} textAnchor={anker} fontSize="21" fill={hell ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.72)"}>
              {st.eigen}
            </text>
          </>
        );
        return (
          <g key={st.id}>
            {/* Knoten auf dem inneren Ring */}
            <g className="tv03-ein" style={{ animationDelay: ms(tPass) }}>
              <circle cx={nx} cy={ny} r="4" fill={GRUEN_HELL} fillOpacity="0.5" />
            </g>
            <g className="tv03-hell" style={knotenStil}>
              <circle cx={nx} cy={ny} r="14" fill="url(#tv03-kopf)" />
              <circle cx={nx} cy={ny} r="4.5" fill="#fff" />
            </g>

            {/* Symbol im Band */}
            <circle className="tv03-welle" cx={ix} cy={iy} r="30" fill="none" stroke={GRUEN_HELL} strokeWidth="2.5" style={{ animationDelay: ms(tPass - 60) }} />
            <g className="tv03-pop" style={{ animationDelay: ms(tPass - 120) }}>
              <g className="tv03-ic" style={{ animationDelay: ms(tHl) }}>
                <SvgIcon icon={mannschaftIcon(st.icon)} x={ix} y={iy} s={34} farbe="#fff" breite={2.1} />
              </g>
            </g>

            {/* Beschriftung: gedimmte Grundfassung + helle Fassung für Komet und Spotlight */}
            <g className="tv03-lab" style={{ animationDelay: ms(tPass), "--tv03-dx": `${rd(-cos * 16)}px`, "--tv03-dy": `${rd(-sin * 16)}px` }}>
              <g className="tv03-dim" opacity="0.72">
                <circle cx={d0x} cy={d0y} r="3.5" fill="#fff" fillOpacity="0.6" />
                <line x1={l0x} y1={l0y} x2={l1x} y2={l1y} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                {beschriftung(false)}
              </g>
              <g className="tv03-hell" style={hlStil}>
                <line x1={l0x} y1={l0y} x2={l1x} y2={l1y} stroke={GRUEN_HELL} strokeWidth="2" />
                {beschriftung(true)}
              </g>
            </g>
          </g>
        );
      })}

      {/* Komet: zieht die Segmente */}
      <g className="tv03-komet">
        <g className="tv03-komet-huelle">
          <path d={bogen(-170, -90, R)} fill="none" stroke="url(#tv03-schweif)" strokeWidth={BAND} />
          <path d={bogen(-170, -90, R_AUSSEN - 1)} fill="none" stroke="url(#tv03-schweif)" strokeWidth="3" />
          <circle cx={kopfX} cy={kopfY} r="80" fill="url(#tv03-kopf)" />
          <circle cx={kopfX} cy={kopfY} r="7" fill="#fff" />
        </g>
      </g>

      {/* Mitte */}
      <g className="tv03-mitte">
        <SvgIcon icon={Person} x={CX} y={CY - 86} s={42} farbe={GRUEN_HELL} breite={2} />
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize="33" fontWeight="800" letterSpacing="-0.6" fill="#fff" style={DISPLAY}>
          Ein fester
        </text>
        <text x={CX} y={CY + 34} textAnchor="middle" fontSize="33" fontWeight="800" letterSpacing="-0.6" fill="#fff" style={DISPLAY}>
          Ansprechpartner
        </text>
        <rect x={CX - 18} y={CY + 56} width="36" height="3" rx="1.5" fill={GRUEN} />
        <text x={CX} y={CY + 92} textAnchor="middle" fontSize="22" fill="rgba(255,255,255,0.7)">
          für alle sechs Schritte
        </text>
      </g>
    </svg>
  );
}
