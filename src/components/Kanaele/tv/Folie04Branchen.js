"use client";

import { useMemo } from "react";
import { GRUEN, GRUEN_HELL, SONNE, BLAU, DISPLAY, rd } from "./gemeinsam";

/* ================================================================== */
/* 4 · Branchen: jede Referenz ein Modul                               */
/* ================================================================== */
//
// Datengrafik im Raster 1040 × 840: links die Branchen (Name + Anzahl, Ziffern rollen hoch),
// aus jedem Branchenknoten fächern Energiebahnen zu einem Modul je Referenzbetrieb auf,
// daneben der Firmenname. Die Module fliegen ein und setzen sich zu Strängen je Branche
// zusammen (Einheitendiagramm: ein Modul = ein Betrieb).
// Danach ruhige Dauerbewegung: Energieteilchen laufen die Bahnen entlang, ein Lichtstreif
// zieht über die Module, die Hervorhebung wandert Branche für Branche weiter.
// Alle Animationen hängen an der Klasse „tv04-an“ (nur solange die Folie aktiv ist).

const ZEILE = 36; // Zeilenabstand je Betrieb
const LUECKE = 30; // Abstand zwischen Branchen
const X_NAME_BR = 236; // Branchenname endet hier (rechtsbündig)
const X_ZAHL = 254; // Anzahl (Rollziffer)
const X_KNOTEN = 318; // Knoten, aus dem die Bahnen auffächern
const X_MODUL = 496;
const MW = 52; // Modulbreite (quer)
const MH = 29;
const X_FIRMA = 570;
const ZH = 64; // Ziffernhöhe der Rollziffer
const START = 2700; // ab hier Dauerbewegung (ms)
const TAKT = 2000; // Hervorhebung je Branche (ms)

function aufbauen(namen) {
  const m = new Map();
  for (const n of namen) m.set(n.branche, [...(m.get(n.branche) || []), n.name]);
  const gruppen = [...m.entries()].map(([branche, liste]) => ({ branche, liste })).sort((a, b) => b.liste.length - a.liste.length);
  const hoehe = namen.length * ZEILE + (gruppen.length - 1) * LUECKE;
  let y = Math.round(18 + (770 - hoehe) / 2);
  let i = 0;
  return gruppen.map((g, gi) => {
    const firmen = g.liste.map((name) => {
      const f = { name, i, y: y + ZEILE / 2 };
      i += 1;
      y += ZEILE;
      return f;
    });
    y += LUECKE;
    const cy = (firmen[0].y + firmen[firmen.length - 1].y) / 2;
    return { ...g, gi, cy, firmen };
  });
}

/** Bahn vom Branchenknoten zum Modul (S-Kurve). */
const bahn = (cy, y) => {
  const x0 = X_KNOTEN + 8;
  const x1 = X_MODUL - 10;
  const xm = rd((x0 + x1) / 2);
  return `M${x0} ${rd(cy)}C${xm} ${rd(cy)} ${xm} ${rd(y)} ${x1} ${rd(y)}`;
};

/** Start des Modulanflugs je Betrieb (ms). */
const modulStart = (i) => 480 + i * 50;

/** Deterministischer Anflug je Modul (kein Math.random, Hydration). */
const anflug = (i) => ({
  "--tv04-dx": `${120 + ((i * 37) % 7) * 34}px`,
  "--tv04-dy": `${(((i * 53) % 9) - 4) * 26}px`,
});

function ModulGlyph({ x, y }) {
  let linien = "";
  for (let s = 1; s < 8; s++) linien += `M${rd(x + (s * MW) / 8)} ${y}V${y + MH}`;
  for (let z = 1; z < 4; z++) linien += `M${x} ${rd(y + (z * MH) / 4)}H${x + MW}`;
  return (
    <g>
      <rect x={x} y={y} width={MW} height={MH} rx="2.5" fill="url(#tv04-modul)" />
      <path d={linien} stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
      <path d={`M${x} ${rd(y + MH * 0.62)}L${x + MW} ${rd(y + MH * 0.18)}V${rd(y + MH * 0.38)}L${x} ${rd(y + MH * 0.82)}Z`} fill="#fff" opacity="0.07" />
      <rect x={x} y={y} width={MW} height={MH} rx="2.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    </g>
  );
}

export default function BranchenGrafik({ f, aktiv }) {
  const gruppen = useMemo(() => aufbauen(f.namen || []), [f.namen]);
  const alle = gruppen.flatMap((g) => g.firmen.map((fi) => ({ ...fi, g })));
  const zyklus = TAKT * gruppen.length;
  const erstesY = alle[0]?.y ?? 0;
  const letztesY = alle[alle.length - 1]?.y ?? 0;
  const Y_QUELLE = rd(erstesY - 2); // Sonne oben auf der Sammelschiene
  if (!gruppen.length) return null;

  return (
    <div className={`tv04 h-full w-full ${aktiv ? "tv04-an" : ""}`}>
      <style>{STIL}</style>
      <svg viewBox="0 0 1040 840" className="h-full w-full" role="img" aria-label={`${f.titel} ${gruppen.map((g) => `${g.branche}: ${g.liste.join(", ")}`).join(". ")}.`}>
        <defs>
          <linearGradient id="tv04-modul" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1f58ad" />
            <stop offset="1" stopColor="#0a2658" />
          </linearGradient>
          <linearGradient id="tv04-bahn" gradientUnits="userSpaceOnUse" x1={X_KNOTEN} y1="0" x2={X_MODUL} y2="0">
            <stop offset="0" stopColor={GRUEN} stopOpacity="0.85" />
            <stop offset="1" stopColor={BLAU} stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="tv04-zeile" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tv04-glanz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="tv04-licht" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={GRUEN} stopOpacity="0.12" />
            <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="tv04-sonne" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.3" stopColor={SONNE} stopOpacity="0.45" />
            <stop offset="1" stopColor={SONNE} stopOpacity="0" />
          </radialGradient>
          <clipPath id="tv04-modulmaske">
            {alle.map((fi) => (
              <rect key={fi.i} x={X_MODUL} y={rd(fi.y - MH / 2)} width={MW} height={MH} rx="2.5" />
            ))}
          </clipPath>
          {gruppen.map((g) => (
            <clipPath key={g.gi} id={`tv04-ziffer-${g.gi}`}>
              <rect x={X_ZAHL - 4} y={rd(g.cy - 24)} width="70" height="46" />
            </clipPath>
          ))}
        </defs>

        {/* Tiefe: ruhiges Licht hinter den Knoten (statisch) */}
        <ellipse cx={X_KNOTEN + 60} cy={rd((erstesY + letztesY) / 2)} rx="420" ry="400" fill="url(#tv04-licht)" aria-hidden="true" />

        {/* Hervorhebung je Branche (wandert, nur Deckkraft) */}
        <g aria-hidden="true">
          {gruppen.map((g) => {
            return (
              <g key={g.gi} className="tv04-hell" style={{ animationDuration: `${zyklus}ms`, animationDelay: `${START + g.gi * TAKT}ms` }}>
                <circle cx={X_KNOTEN} cy={g.cy} r="17" fill={GRUEN} opacity="0.22" />
                <circle cx={X_KNOTEN} cy={g.cy} r="8" fill="none" stroke={GRUEN_HELL} strokeWidth="2" className={aktiv ? "tv-puls" : ""} />
              </g>
            );
          })}
        </g>

        {/* Energiebahnen */}
        <g aria-hidden="true">
          {/* Sammelschiene: verbindet alle Branchenknoten */}
          <path d={`M${X_KNOTEN} ${Y_QUELLE}V${rd(gruppen[gruppen.length - 1].cy)}`} pathLength="1" fill="none" stroke={GRUEN} strokeOpacity="0.4" strokeWidth="2" className="tv04-bahn" style={{ animationDelay: "160ms", animationDuration: "1300ms" }} />
          <g className="tv04-teilchen" style={{ animationDelay: `${START - 900}ms` }}>
            <path d={`M${X_KNOTEN} ${Y_QUELLE}V${rd(gruppen[gruppen.length - 1].cy)}`} pathLength="1" fill="none" stroke={GRUEN} strokeOpacity="0.35" strokeWidth="7" strokeLinecap="round" />
            <path d={`M${X_KNOTEN} ${Y_QUELLE}V${rd(gruppen[gruppen.length - 1].cy)}`} pathLength="1" fill="none" stroke="#f3ffe4" strokeWidth="2.4" strokeLinecap="round" />
          </g>
          {alle.map((fi) => (
            <path
              key={fi.i}
              d={bahn(fi.g.cy, fi.y)}
              pathLength="1"
              fill="none"
              stroke="url(#tv04-bahn)"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="tv04-bahn"
              style={{ animationDelay: `${420 + fi.g.gi * 80 + (fi.i - fi.g.firmen[0].i) * 40}ms` }}
            />
          ))}
          {gruppen.map((g) => (
            <g key={g.gi} className="tv04-hell" style={{ animationDuration: `${zyklus}ms`, animationDelay: `${START + g.gi * TAKT}ms` }}>
              {g.firmen.map((fi) => (
                <path key={fi.i} d={bahn(g.cy, fi.y)} fill="none" stroke={GRUEN_HELL} strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
              ))}
            </g>
          ))}
          {/* Teilchen: kurzer Strich, der über die Bahn läuft (stroke-dashoffset) */}
          {alle.map((fi) => (
            <g key={fi.i} className="tv04-teilchen" style={{ animationDelay: `${START - 600 + ((fi.i * 7) % 16) * 190}ms` }}>
              <path d={bahn(fi.g.cy, fi.y)} pathLength="1" fill="none" stroke={GRUEN} strokeOpacity="0.35" strokeWidth="7" strokeLinecap="round" />
              <path d={bahn(fi.g.cy, fi.y)} pathLength="1" fill="none" stroke="#f3ffe4" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          ))}
        </g>

        {/* Quelle: Sonne oben auf der Sammelschiene */}
        <g className="tv04-knoten" style={{ animationDelay: "60ms" }} aria-hidden="true">
          <circle cx={X_KNOTEN} cy={Y_QUELLE} r="34" fill="url(#tv04-sonne)" style={{ mixBlendMode: "screen" }} />
          <circle cx={X_KNOTEN} cy={Y_QUELLE} r="11" fill={SONNE} />
        </g>
        <circle cx={X_KNOTEN} cy={Y_QUELLE} r="12" fill="none" stroke={SONNE} strokeWidth="2" className={aktiv ? "tv04-sonnenpuls" : "tv04-aus"} style={{ mixBlendMode: "screen" }} aria-hidden="true" />

        {/* Branchen: Name + rollende Anzahl + Knoten */}
        {gruppen.map((g) => {
          const n = g.liste.length;
          return (
            <g key={g.gi}>
              <g className="tv04-label" style={{ animationDelay: `${80 + g.gi * 80}ms` }}>
                <text x={X_NAME_BR} y={rd(g.cy + 10)} textAnchor="end" fontSize="29" fontWeight="800" fill="#fff" style={DISPLAY}>
                  {g.branche}
                </text>
              </g>
              <g className="tv04-hell" style={{ animationDuration: `${zyklus}ms`, animationDelay: `${START + g.gi * TAKT}ms` }} aria-hidden="true">
                <text x={X_NAME_BR} y={rd(g.cy + 10)} textAnchor="end" fontSize="29" fontWeight="800" fill={GRUEN_HELL} style={DISPLAY}>
                  {g.branche}
                </text>
              </g>
              <g className="tv04-label" style={{ animationDelay: `${140 + g.gi * 80}ms` }} clipPath={`url(#tv04-ziffer-${g.gi})`} aria-hidden="true">
                <g className="tv04-rolle" style={{ "--tv04-n": `${-n * ZH}px`, animationDelay: `${200 + g.gi * 80}ms`, animationDuration: `${900 + n * 110}ms` }}>
                  {Array.from({ length: n + 1 }, (_, k) => (
                    <text key={k} x={X_ZAHL} y={rd(g.cy + 12 + k * ZH)} fontSize="40" fontWeight="800" fill={GRUEN} style={DISPLAY}>
                      {k}
                    </text>
                  ))}
                </g>
              </g>
              <g className="tv04-knoten" style={{ animationDelay: `${300 + g.gi * 80}ms` }} aria-hidden="true">
                <circle cx={X_KNOTEN} cy={g.cy} r="7.5" fill={GRUEN} />
                <circle cx={X_KNOTEN} cy={g.cy} r="3" fill="#fff" />
              </g>
            </g>
          );
        })}

        {/* Module: fliegen ein und setzen sich zu Strängen zusammen */}
        <g aria-hidden="true">
          {/* Montageschienen hinter jedem Strang */}
          {gruppen.map((g) => {
            const y0 = rd(g.firmen[0].y - MH / 2 - 4);
            const y1 = rd(g.firmen[g.firmen.length - 1].y + MH / 2 + 4);
            return (
              <path
                key={g.gi}
                d={`M${X_MODUL + 12} ${y0}V${y1}M${X_MODUL + MW - 12} ${y0}V${y1}`}
                stroke="rgba(190,205,225,0.28)"
                strokeWidth="3"
                strokeLinecap="round"
                className="tv04-schiene"
                style={{ animationDelay: `${modulStart(g.firmen[0].i) + 450}ms` }}
              />
            );
          })}
          {alle.map((fi) => (
            <g key={fi.i} className="tv04-modul" style={{ ...anflug(fi.i), animationDelay: `${modulStart(fi.i)}ms` }}>
              <ModulGlyph x={X_MODUL} y={rd(fi.y - MH / 2)} />
            </g>
          ))}
          {/* Lichtstreif über alle Module */}
          <g clipPath="url(#tv04-modulmaske)">
            <g className="tv04-glanz" style={{ animationDelay: `${START - 700}ms` }}>
              <polygon points={`${X_MODUL - 20},0 ${X_MODUL + MW + 20},-46 ${X_MODUL + MW + 20},44 ${X_MODUL - 20},90`} fill="url(#tv04-glanz)" />
            </g>
          </g>
          {/* Hervorgehobene Module: grüner Rand, wandert mit der Branche */}
          {gruppen.map((g) => (
            <g key={g.gi} className="tv04-hell" style={{ animationDuration: `${zyklus}ms`, animationDelay: `${START + g.gi * TAKT}ms` }}>
              {g.firmen.map((fi) => (
                <g key={fi.i}>
                  <rect x={X_MODUL - 3} y={rd(fi.y - MH / 2 - 3)} width={MW + 6} height={MH + 6} rx="5" fill="none" stroke={GRUEN} strokeOpacity="0.3" strokeWidth="5" />
                  <rect x={X_MODUL - 0.5} y={rd(fi.y - MH / 2 - 0.5)} width={MW + 1} height={MH + 1} rx="3" fill="url(#tv04-zeile)" stroke={GRUEN_HELL} strokeWidth="2" />
                </g>
              ))}
            </g>
          ))}
        </g>

        {/* Firmennamen */}
        {alle.map((fi) => (
          <g key={fi.i} className="tv04-name" style={{ animationDelay: `${modulStart(fi.i) + 420}ms` }}>
            <text
              x={X_FIRMA}
              y={rd(fi.y + 9)}
              fontSize="25"
              fontWeight="600"
              fill="#fff"
              className="tv04-dimm"
              style={{ animationDelay: `${START - 200}ms` }}
            >
              {fi.name}
            </text>
          </g>
        ))}

        {/* Hervorgehobene Namen: volle Deckkraft über den gedimmten */}
        {gruppen.map((g) => (
          <g key={g.gi} className="tv04-hell" style={{ animationDuration: `${zyklus}ms`, animationDelay: `${START + g.gi * TAKT}ms` }} aria-hidden="true">
            {g.firmen.map((fi) => (
              <text key={fi.i} x={X_FIRMA} y={rd(fi.y + 9)} fontSize="25" fontWeight="600" fill="#fff">
                {fi.name}
              </text>
            ))}
          </g>
        ))}

        {/* Legende */}
        <g className="tv04-name" style={{ animationDelay: `${modulStart(alle.length) + 420}ms` }} aria-hidden="true">
          <rect x={X_MODUL + 14} y="803" width="24" height="14" rx="1.5" fill="url(#tv04-modul)" stroke="rgba(255,255,255,0.3)" />
          <text x={X_FIRMA} y="817" fontSize="20" fill="#fff" fillOpacity="0.5">
            Jedes Modul steht für einen Referenzbetrieb.
          </text>
        </g>
      </svg>
    </div>
  );
}

const STIL = `
.tv04 .tv04-label, .tv04 .tv04-knoten, .tv04 .tv04-modul, .tv04 .tv04-name, .tv04 .tv04-hell, .tv04 .tv04-teilchen { opacity: 0; }
.tv04 .tv04-bahn { stroke-dasharray: 1; stroke-dashoffset: 1; }
.tv04 .tv04-rolle { transform: translateY(var(--tv04-n)); }
.tv04 .tv04-glanz { transform: translateY(-120px); }
.tv04 .tv04-teilchen path { stroke-dasharray: 0.07 1; stroke-dashoffset: 0.07; }

.tv04-an .tv04-label { animation: tv04-links 1000ms cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes tv04-links { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: none; } }

.tv04-an .tv04-rolle { animation: tv04-rolle 1200ms cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes tv04-rolle { from { transform: translateY(0); } to { transform: translateY(var(--tv04-n)); } }

.tv04 .tv04-knoten { transform-box: fill-box; transform-origin: center; }
.tv04-an .tv04-knoten { animation: tv04-knoten 800ms cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes tv04-knoten { from { opacity: 0; transform: scale(0.1); } to { opacity: 1; transform: none; } }

.tv04-an .tv04-bahn { animation: tv04-zeichnen 1100ms cubic-bezier(0.65, 0, 0.35, 1) both; }
@keyframes tv04-zeichnen { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }

.tv04 .tv04-schiene { opacity: 0; transform-box: fill-box; transform-origin: center; }
.tv04-an .tv04-schiene { animation: tv04-schiene 900ms cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes tv04-schiene { from { opacity: 0; transform: scaleY(0.3); } to { opacity: 1; transform: none; } }

.tv04 .tv04-modul { transform-box: fill-box; transform-origin: center; }
.tv04-an .tv04-modul { animation: tv04-flug 1050ms cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes tv04-flug {
  from { opacity: 0; transform: translate(var(--tv04-dx), var(--tv04-dy)) scale(1.5); }
  45% { opacity: 1; }
  to { opacity: 1; transform: none; }
}

.tv04-an .tv04-name { animation: tv04-name 1000ms cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes tv04-name { from { opacity: 0; transform: translateX(22px); } to { opacity: 1; transform: none; } }

.tv04-an .tv04-hell { animation-name: tv04-hell; animation-timing-function: linear; animation-iteration-count: infinite; animation-fill-mode: both; }
@keyframes tv04-hell { 0% { opacity: 0; } 4% { opacity: 1; } 15% { opacity: 1; } 20% { opacity: 0; } 100% { opacity: 0; } }

.tv04 .tv04-dimm { opacity: 0.92; }
.tv04-an .tv04-dimm { animation: tv04-dimm 900ms ease-in-out both; }
@keyframes tv04-dimm { from { opacity: 0.92; } to { opacity: 0.66; } }

.tv04-an .tv04-teilchen { animation: tv04-sichtbar 600ms ease-out both; }
.tv04-an .tv04-teilchen path { animation: tv04-teilchen 3040ms cubic-bezier(0.45, 0, 0.55, 1) infinite; animation-delay: inherit; }
@keyframes tv04-sichtbar { to { opacity: 1; } }
@keyframes tv04-teilchen { 0% { stroke-dashoffset: 0.07; } 70% { stroke-dashoffset: -1; } 100% { stroke-dashoffset: -1; } }

.tv04 .tv04-aus { opacity: 0; }
.tv04 .tv04-sonnenpuls { opacity: 0; transform-box: fill-box; transform-origin: center; animation: tv04-sonnenpuls 3200ms ease-out infinite; animation-delay: ${START - 1200}ms; }
@keyframes tv04-sonnenpuls { from { transform: scale(1); opacity: 0.55; } to { transform: scale(3.2); opacity: 0; } }

.tv04-an .tv04-glanz { animation: tv04-glanz 6200ms cubic-bezier(0.45, 0, 0.55, 1) infinite; }
@keyframes tv04-glanz { 0% { transform: translateY(-120px); } 38% { transform: translateY(880px); } 100% { transform: translateY(880px); } }

@media (prefers-reduced-motion: reduce) {
  .tv04 .tv04-schiene, .tv04 .tv04-label, .tv04 .tv04-knoten, .tv04 .tv04-modul, .tv04 .tv04-name { animation: none !important; opacity: 1; transform: none; }
  .tv04 .tv04-rolle { animation: none !important; transform: translateY(var(--tv04-n)); }
  .tv04 .tv04-bahn { animation: none !important; stroke-dashoffset: 0; }
  .tv04 .tv04-dimm { animation: none !important; opacity: 0.92; }
  .tv04 .tv04-hell, .tv04 .tv04-teilchen, .tv04 .tv04-teilchen path, .tv04 .tv04-glanz, .tv04 .tv04-sonnenpuls { animation: none !important; opacity: 0; }
}
`;
