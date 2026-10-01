"use client";

import { LayoutGrid, MonitorDot, PlugZap, UtilityPole, Zap } from "lucide-react";
import { GRUEN, GRUEN_HELL, SONNE, NAVY, DISPLAY, rd, strich, SvgIcon } from "./gemeinsam";

/* ================================================================== */
/* 9 · Regelung: vom Park bis zum Netzbetreiber                        */
/* ================================================================== */
/*
 * Schematische Systemgrafik (Raster 1040 × 840).
 * Aufbau (≈ 2,8 s): Komponenten von links nach rechts → Energieleitung zeichnet sich →
 * Überwachungsleitungen wachsen zur SCADA-Leiste → SCADA erscheint, Kurve zeichnet sich →
 * Sollwert-Schleife vom Netzbetreiber zum Parkregler.
 * Danach ruhige Dauerbewegung: Energiepakete auf der Leitung, Datenimpulse zur SCADA,
 * alle 6 s ein Sollwert-Signal, auf das der Parkregler mit Ringen reagiert.
 * Alle Klassen/Keyframes mit Präfix tv09.
 */

const KETTE = [
  { icon: LayoutGrid, l: ["PV-Park"] },
  { icon: Zap, l: ["Wechsel-", "richter"] },
  { icon: null, l: ["Parkregler"], unter: "EZA-Regler", eigen: true },
  { icon: PlugZap, l: ["Netzanschluss-", "punkt"] },
  { icon: UtilityPole, l: ["Netz-", "betreiber"] },
];

const MX = [108, 314, 520, 726, 932]; // Mitten der Komponenten
const CY = 420; // Mitte der Kacheln = Energieleitung
const R = 64; // halbe Kachel
const RP = 84; // halbe Kachel Parkregler
const halb = (i) => (KETTE[i].eigen ? RP : R);

const SC = { x: 20, y: 30, w: 1000, h: 170 }; // SCADA-Leiste
const SC_UNTEN = SC.y + SC.h;
const PILLE_Y = CY - RP - 54; // „eigene Entwicklung“
const LABEL_Y = 540;
const TAKT = 2600; // Start der Sollwert-Schleife (6 s)

// Sollwert-Schleife: vom Netzbetreiber zurück zum Parkregler
const SOLL_D = `M${MX[4]} 592C${MX[4]} 722 ${MX[2]} 722 ${MX[2]} 600`;

// Schematische Kurve im SCADA-Fenster (periodisch in 300 Einheiten, rein dekorativ)
const WIN = { x: 652, y: 58, w: 340, h: 114 };
const WELLE_P = 300;
function welle() {
  const mitte = WIN.y + WIN.h / 2 + 4;
  const pts = [];
  for (let x = 0; x <= WELLE_P * 2 + 60; x += 6) {
    const t = (2 * Math.PI * x) / WELLE_P;
    const y = mitte - 22 * Math.sin(2 * t) - 10 * Math.sin(5 * t + 1) - 5 * Math.sin(9 * t + 2);
    pts.push(`${x} ${rd(y)}`);
  }
  const linie = `M${pts.join("L")}`;
  const flaeche = `${linie}L${WELLE_P * 2 + 60} ${WIN.y + WIN.h}L0 ${WIN.y + WIN.h}Z`;
  return { linie, flaeche };
}
const WELLE = welle();

const CSS = `
.tv09-heben { opacity: 0; animation: tv09-heben 1000ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes tv09-heben { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
.tv09-kachel { opacity: 0; transform-box: fill-box; transform-origin: center; animation: tv09-kachel 1100ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes tv09-kachel { from { opacity: 0; transform: translateY(28px) scale(0.9); } to { opacity: 1; transform: none; } }
.tv09-wachsen { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); animation: tv09-wachsen 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes tv09-wachsen { to { transform: scaleY(1); } }
.tv09-paket { opacity: 0; animation: tv09-paket 3.6s linear infinite; }
@keyframes tv09-paket { 0% { transform: translateX(0); opacity: 0; } 5% { opacity: 1; } 94% { opacity: 1; } 100% { transform: translateX(${MX[4] - MX[0]}px); opacity: 0; } }
.tv09-daten { opacity: 0; animation: tv09-daten 2.6s linear infinite; }
@keyframes tv09-daten { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 66% { opacity: 1; } 70%, 100% { transform: translateY(var(--tv09-h)); opacity: 0; } }
.tv09-ping { opacity: 0; transform-box: fill-box; transform-origin: center; animation: tv09-ping 2.6s linear infinite; }
@keyframes tv09-ping { 0%, 67% { opacity: 0; transform: scale(1); } 69% { opacity: 0.9; transform: scale(1); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); } 100% { opacity: 0; transform: scale(3.6); } }
.tv09-welle { animation: tv09-welle 8s linear infinite; }
@keyframes tv09-welle { to { transform: translateX(-${WELLE_P}px); } }
.tv09-glanz { opacity: 0; animation: tv09-glanz 10s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
@keyframes tv09-glanz { 0% { transform: translateX(-280px); opacity: 1; } 34% { transform: translateX(1100px); opacity: 1; } 35%, 100% { transform: translateX(1100px); opacity: 0; } }
.tv09-komet { stroke-dasharray: 0.07 2; stroke-dashoffset: 0.07; opacity: 0; animation: tv09-komet 6s linear infinite; }
@keyframes tv09-komet { 0% { stroke-dashoffset: 0.07; opacity: 0; } 3% { stroke-dashoffset: 0.05; opacity: 1; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } 34% { stroke-dashoffset: -0.93; opacity: 1; } 37%, 100% { stroke-dashoffset: -1; opacity: 0; } }
.tv09-sender { opacity: 0; transform-box: fill-box; transform-origin: center; animation: tv09-sender 6s linear infinite; }
@keyframes tv09-sender { 0% { opacity: 0.9; transform: scale(1); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); } 16%, 100% { opacity: 0; transform: scale(3.4); } }
.tv09-ring { opacity: 0; transform-box: fill-box; transform-origin: center; animation: tv09-ring 6s linear infinite; }
@keyframes tv09-ring { 0%, 33% { opacity: 0; transform: scale(1); } 35% { opacity: 0.85; transform: scale(1); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); } 72%, 100% { opacity: 0; transform: scale(1.42); } }
.tv09-glut { opacity: 0.45; animation: tv09-glut 6s ease-in-out infinite; }
@keyframes tv09-glut { 0%, 31% { opacity: 0.45; } 40% { opacity: 1; } 78%, 100% { opacity: 0.45; } }
.tv09-spitze { opacity: 0.75; animation: tv09-spitze 6s ease-out infinite; }
@keyframes tv09-spitze { 0%, 32% { opacity: 0.75; } 35% { opacity: 1; } 60%, 100% { opacity: 0.75; } }
.tv09-knopf { animation: tv09-knopf 6s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
@keyframes tv09-knopf { 0%, 35% { transform: translateX(0); } 47%, 80% { transform: translateX(var(--tv09-dx)); } 94%, 100% { transform: translateX(0); } }
@media (prefers-reduced-motion: reduce) {
  .tv09-heben, .tv09-kachel { animation: none; opacity: 1; transform: none; }
  .tv09-wachsen { animation: none; transform: none; }
  .tv09-paket, .tv09-daten, .tv09-ping, .tv09-komet, .tv09-sender, .tv09-ring, .tv09-glanz { animation: none; opacity: 0; }
  .tv09-welle, .tv09-glut, .tv09-spitze, .tv09-knopf { animation: none; }
}
`;

/** Aufbau-Animation mit Verzögerung (eigene Klasse, Startzustand unsichtbar). */
const ein = (aktiv, ms, art = "tv09-heben") => ({ className: aktiv ? art : "opacity-0", style: aktiv ? { animationDelay: `${ms}ms` } : undefined });
const verz = (ms) => ({ animationDelay: `${ms}ms` });

export default function RegelungGrafik({ aktiv }) {
  const scada = ein(aktiv, 800);
  const sollText = ein(aktiv, 1900);
  const spitze = ein(aktiv, 2300);
  const leg = ein(aktiv, 2100);
  const leitung = strich(aktiv, 350, 1500);
  const sollStrich = strich(aktiv, 1500, 1000);
  const kurve = strich(aktiv, 1300, 1500);

  return (
    <svg viewBox="0 0 1040 840" className="h-full w-full" aria-hidden="true">
      <style>{CSS}</style>
      <defs>
        <pattern id="tv09-raster" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="13" cy="13" r="1.4" fill="rgba(255,255,255,0.2)" />
        </pattern>
        <radialGradient id="tv09-raster-maske-v" cx="50%" cy="52%" r="55%">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="tv09-raster-maske">
          <rect x="0" y="0" width="1040" height="840" fill="url(#tv09-raster-maske-v)" />
        </mask>
        <radialGradient id="tv09-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.6" />
          <stop offset="0.5" stopColor={GRUEN} stopOpacity="0.2" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tv09-schweif" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0" />
          <stop offset="0.75" stopColor={GRUEN_HELL} stopOpacity="0.55" />
          <stop offset="1" stopColor="#f4fbe9" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="tv09-paket-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0.7" />
          <stop offset="1" stopColor={GRUEN_HELL} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv09-daten-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tv09-kachel-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d2d5c" />
          <stop offset="1" stopColor="#061a3a" />
        </linearGradient>
        <linearGradient id="tv09-kachel-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="tv09-regler-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a5a2c" />
          <stop offset="1" stopColor="#123218" />
        </linearGradient>
        <linearGradient id="tv09-scada-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.025" />
        </linearGradient>
        <linearGradient id="tv09-scada-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="tv09-welle-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.32" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tv09-glanz-f" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tv09-leitung" x1={MX[0]} y1="0" x2={MX[4]} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={GRUEN_HELL} />
          <stop offset="1" stopColor={GRUEN} />
        </linearGradient>
        <clipPath id="tv09-scada-clip">
          <rect x={SC.x} y={SC.y} width={SC.w} height={SC.h} rx="24" />
        </clipPath>
        <clipPath id="tv09-win-clip">
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx="14" />
        </clipPath>
        <mask id="tv09-soll-maske" maskUnits="userSpaceOnUse" x="0" y="0" width="1040" height="840">
          <path d={SOLL_D} fill="none" stroke="#fff" strokeWidth="24" {...sollStrich} />
        </mask>
      </defs>

      {/* Hintergrund: feines Punktraster, mittig betont */}
      <rect x="0" y="0" width="1040" height="840" fill="url(#tv09-raster)" mask="url(#tv09-raster-maske)" opacity={aktiv ? 1 : 0} style={{ transition: "opacity 1.2s ease" }} />

      {/* ============ SCADA und Fernwartung ============ */}
      <g className={scada.className} style={scada.style}>
        <rect x={SC.x} y={SC.y} width={SC.w} height={SC.h} rx="24" fill="url(#tv09-scada-f)" />
        <g clipPath="url(#tv09-scada-clip)">
          {aktiv && (
            <g transform="skewX(-18)">
              <rect x={SC.x + 60} y={SC.y - 40} width="220" height={SC.h + 80} fill="url(#tv09-glanz-f)" className="tv09-glanz" style={verz(2400)} />
            </g>
          )}
        </g>
        <rect x={SC.x + 0.75} y={SC.y + 0.75} width={SC.w - 1.5} height={SC.h - 1.5} rx="23.5" fill="none" stroke="url(#tv09-scada-r)" strokeWidth="1.5" />

        <circle cx="100" cy={SC.y + SC.h / 2} r="44" fill="rgba(140,186,88,0.12)" stroke="rgba(174,208,131,0.45)" strokeWidth="1.5" />
        <SvgIcon icon={MonitorDot} x={100} y={SC.y + SC.h / 2} s={44} farbe={GRUEN_HELL} />
        <text x="170" y={SC.y + 76} fontSize="32" fontWeight="800" fill="#fff" letterSpacing="-0.5" style={DISPLAY}>
          SCADA und Fernwartung
        </text>
        <text x="170" y={SC.y + 114} fontSize="21" fill="rgba(255,255,255,0.62)">
          Überwachung und Reporting
        </text>
        <text x="170" y={SC.y + 142} fontSize="21" fill="rgba(255,255,255,0.62)">
          aus eigener Entwicklung
        </text>

        {/* schematische Verlaufskurve, ohne Werte */}
        <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx="14" fill="rgba(3,18,43,0.55)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
        <g clipPath="url(#tv09-win-clip)">
          {[1, 2, 3].map((k) => (
            <line key={k} x1={WIN.x} x2={WIN.x + WIN.w} y1={WIN.y + (k * WIN.h) / 4} y2={WIN.y + (k * WIN.h) / 4} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          ))}
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <line key={k} x1={WIN.x + (k * WIN.w) / 7} x2={WIN.x + (k * WIN.w) / 7} y1={WIN.y} y2={WIN.y + WIN.h} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          <g transform={`translate(${WIN.x} 0)`}>
            <g className={aktiv ? "tv09-welle" : undefined}>
              <path d={WELLE.flaeche} fill="url(#tv09-welle-f)" />
              <path d={WELLE.linie} fill="none" stroke={GRUEN_HELL} strokeWidth="2.6" strokeLinejoin="round" pathLength={1} className={kurve.className} style={kurve.style} />
            </g>
          </g>
        </g>
      </g>

      {/* ============ Überwachungsleitungen zur SCADA ============ */}
      {[0, 1, 2, 3].map((i) => {
        const oben = SC_UNTEN;
        const unten = KETTE[i].eigen ? PILLE_Y : CY - R;
        const w = ein(aktiv, 1100 + i * 80, "tv09-wachsen");
        return (
          <g key={`u${i}`}>
            <line x1={MX[i]} x2={MX[i]} y1={oben} y2={unten} stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" className={aktiv ? w.className : "opacity-0"} style={w.style} />
            {aktiv && (
              <g className="tv09-daten" style={{ ...verz(2100 + i * 650), "--tv09-h": `${oben - unten}px` }}>
                <circle cx={MX[i]} cy={unten} r="14" fill="url(#tv09-daten-halo)" />
                <rect x={MX[i] - 3} y={unten - 9} width="6" height="18" rx="3" fill="#fff" />
              </g>
            )}
          </g>
        );
      })}
      {/* Anschlusspunkte an der SCADA-Leiste */}
      <g className={scada.className} style={scada.style}>
        {[0, 1, 2, 3].map((i) => (
          <g key={`p${i}`}>
            {aktiv && <circle cx={MX[i]} cy={SC_UNTEN} r="6" fill="none" stroke="#fff" strokeWidth="1.6" className="tv09-ping" style={verz(2100 + i * 650)} />}
            <circle cx={MX[i]} cy={SC_UNTEN} r="5.5" fill={NAVY} stroke="#fff" strokeWidth="2" />
          </g>
        ))}
      </g>

      {/* ============ Energieleitung ============ */}
      <line x1={MX[0]} x2={MX[4]} y1={CY} y2={CY} stroke={GRUEN} strokeOpacity="0.18" strokeWidth="14" strokeLinecap="round" {...leitung} />
      <line x1={MX[0]} x2={MX[4]} y1={CY} y2={CY} stroke="url(#tv09-leitung)" strokeWidth="4" strokeLinecap="round" {...leitung} />
      {aktiv &&
        [0, 1, 2, 3, 4].map((k) => (
          <g key={`e${k}`} className="tv09-paket" style={verz(1500 + k * 720)}>
            <ellipse cx={MX[0]} cy={CY} rx="30" ry="18" fill="url(#tv09-paket-halo)" />
            <rect x={MX[0] - 104} y={CY - 4} width="110" height="8" rx="4" fill="url(#tv09-schweif)" />
          </g>
        ))}

      {/* Parkregler-Halo (unter den Kacheln) */}
      <g className={aktiv ? "tv09-heben" : "opacity-0"} style={aktiv ? verz(700) : undefined}>
        <ellipse cx={MX[2]} cy={CY} rx="230" ry="190" fill="url(#tv09-halo)" className={aktiv ? "tv09-glut" : undefined} style={aktiv ? verz(TAKT) : undefined} />
      </g>

      {/* ============ Komponenten ============ */}
      {KETTE.map((k, i) => {
        const h = halb(i);
        const a = ein(aktiv, 120 + i * 120, "tv09-kachel");
        const t = ein(aktiv, 260 + i * 120);
        const x = MX[i] - h;
        const y = CY - h;
        return (
          <g key={k.l[0]}>
            {k.eigen && aktiv && (
              <>
                <rect x={x} y={y} width={h * 2} height={h * 2} rx="32" fill="none" stroke={GRUEN_HELL} strokeWidth="2.5" className="tv09-ring" style={verz(TAKT)} />
                <rect x={x} y={y} width={h * 2} height={h * 2} rx="32" fill="none" stroke={GRUEN_HELL} strokeWidth="1.5" className="tv09-ring" style={verz(TAKT + 380)} />
              </>
            )}
            <g className={a.className} style={a.style}>
              <rect x={x} y={y} width={h * 2} height={h * 2} rx={k.eigen ? 32 : 26} fill={k.eigen ? "url(#tv09-regler-f)" : "url(#tv09-kachel-f)"} />
              <rect x={x + 0.75} y={y + 0.75} width={h * 2 - 1.5} height={h * 2 - 1.5} rx={k.eigen ? 31 : 25} fill="none" stroke={k.eigen ? GRUEN : "url(#tv09-kachel-r)"} strokeWidth={k.eigen ? 3 : 1.5} />
              <line x1={x + 22} x2={x + h * 2 - 22} y1={y + 1.5} y2={y + 1.5} stroke="#fff" strokeOpacity={k.eigen ? 0.35 : 0.22} strokeWidth="1.5" strokeLinecap="round" />
              {k.eigen ? <ReglerSymbol aktiv={aktiv} /> : <SvgIcon icon={k.icon} x={MX[i]} y={CY} s={50} farbe="#fff" breite={1.6} />}
              {/* Anschlüsse an der Energieleitung */}
              {i > 0 && <circle cx={x} cy={CY} r="6" fill={NAVY} stroke={GRUEN} strokeWidth="2.5" />}
              {i < 4 && <circle cx={x + h * 2} cy={CY} r="6" fill={NAVY} stroke={GRUEN} strokeWidth="2.5" />}
            </g>
            <g className={t.className} style={t.style}>
              {k.l.map((z, j) => (
                <text key={z} x={MX[i]} y={LABEL_Y + j * 29} textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff" letterSpacing="-0.3" style={DISPLAY}>
                  {z}
                </text>
              ))}
              {k.unter && (
                <text x={MX[i]} y={LABEL_Y + 30} textAnchor="middle" fontSize="22" fontWeight="600" fill={GRUEN_HELL}>
                  {k.unter}
                </text>
              )}
            </g>
            {k.eigen && (
              <g className={aktiv ? "tv09-heben" : "opacity-0"} style={aktiv ? verz(820) : undefined}>
                <rect x={MX[i] - 112} y={PILLE_Y} width="224" height="40" rx="20" fill={GRUEN} />
                <text x={MX[i]} y={PILLE_Y + 27} textAnchor="middle" fontSize="20" fontWeight="800" fill={NAVY} style={DISPLAY}>
                  eigene Entwicklung
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* ============ Sollwerte des Netzbetreibers ============ */}
      <path d={SOLL_D} fill="none" stroke={SONNE} strokeWidth="3" strokeDasharray="9 8" mask="url(#tv09-soll-maske)" opacity={aktiv ? 1 : 0} />
      {aktiv && (
        <>
          <path d={SOLL_D} fill="none" stroke={SONNE} strokeOpacity="0.28" strokeWidth="16" strokeLinecap="round" pathLength={1} className="tv09-komet" style={verz(TAKT)} />
          <path d={SOLL_D} fill="none" stroke="#fff3cf" strokeWidth="5" strokeLinecap="round" pathLength={1} className="tv09-komet" style={verz(TAKT)} />
          <circle cx={MX[4]} cy="592" r="7" fill="none" stroke={SONNE} strokeWidth="2" className="tv09-sender" style={verz(TAKT)} />
        </>
      )}
      <g className={spitze.className} style={spitze.style}>
        <circle cx={MX[4]} cy="592" r="5" fill={SONNE} />
        <path d={`M${MX[2] - 12} 610L${MX[2]} 594L${MX[2] + 12} 610`} fill="none" stroke={SONNE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className={aktiv ? "tv09-spitze" : undefined} style={aktiv ? verz(TAKT) : undefined} />
      </g>
      <g className={sollText.className} style={sollText.style}>
        <text x={MX[3]} y="752" textAnchor="middle" fontSize="24" fontWeight="700" fill={SONNE} style={DISPLAY}>
          Sollwerte nach TOR Erzeuger
        </text>
      </g>

      {/* ============ Legende ============ */}
      <g className={leg.className} style={leg.style}>
        {[
          { y: 672, t: "Energiefluss", linie: { stroke: GRUEN, strokeWidth: 5 } },
          { y: 712, t: "Überwachung", linie: { stroke: "rgba(255,255,255,0.6)", strokeWidth: 2.4, strokeDasharray: "3 7" } },
          { y: 752, t: "Vorgaben des Netzbetreibers", linie: { stroke: SONNE, strokeWidth: 3, strokeDasharray: "9 8" } },
        ].map((z) => (
          <g key={z.t}>
            <line x1="22" x2="62" y1={z.y - 7} y2={z.y - 7} strokeLinecap="round" {...z.linie} />
            <text x="78" y={z.y} fontSize="21" fill="rgba(255,255,255,0.74)">
              {z.t}
            </text>
          </g>
        ))}
        <text x="22" y="800" fontSize="20" fill="rgba(255,255,255,0.4)">
          Schematische Darstellung
        </text>
      </g>
    </svg>
  );
}

/** Schieberegler-Symbol des Parkreglers; die Regler verstellen sich, wenn ein Sollwert eintrifft. */
const KNOEPFE = [
  { dy: -19, x: -11, dx: 15 },
  { dy: 0, x: 12, dx: -17 },
  { dy: 19, x: -3, dx: 11 },
];
function ReglerSymbol({ aktiv }) {
  const x = MX[2];
  return (
    <g>
      {KNOEPFE.map((k) => (
        <line key={`l${k.dy}`} x1={x - 30} x2={x + 30} y1={CY + k.dy} y2={CY + k.dy} stroke={GRUEN_HELL} strokeOpacity="0.55" strokeWidth="3.2" strokeLinecap="round" />
      ))}
      {KNOEPFE.map((k, i) => (
        <rect
          key={`k${k.dy}`}
          x={x + k.x - 5}
          y={CY + k.dy - 11}
          width="10"
          height="22"
          rx="5"
          fill={GRUEN_HELL}
          stroke="#1c4321"
          strokeWidth="3"
          className={aktiv ? "tv09-knopf" : undefined}
          style={aktiv ? { animationDelay: `${TAKT + i * 90}ms`, "--tv09-dx": `${k.dx}px` } : undefined}
        />
      ))}
    </g>
  );
}
