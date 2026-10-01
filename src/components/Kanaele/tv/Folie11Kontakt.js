"use client";

import { useMemo } from "react";
import { ScanQrCode } from "lucide-react";
import { kurzUrl, GRUEN, GRUEN_HELL, SONNE, NAVY } from "./gemeinsam";

/* ================================================================== */
/* 11 · Kontakt: QR-Code als Finale                                    */
/* ================================================================== */
//
// Choreografie (ab aktiv):
//   0 ms      Lichthof und weiße Kachel tauchen auf
//   350 ms    die drei Positionsmarken des QR-Codes setzen sich
//   650 ms    die Datenmodule bauen sich in einer diagonalen Welle auf (grün aufleuchtend, dann Navy),
//             eine Lichtkante zieht mit
//   1500 ms   Sucherecken rasten von außen ein, kurzer Bestätigungs-Lichtimpuls
//   1700 ms   „Angebot anfragen“ und Adresse
//   ab 2,5 s  ruhig: zwei Lichtpunkte umkreisen die Bahn, Signalwellen, einzelne Module lösen sich
//             nach außen, die Ecken atmen.
// Der Code selbst bleibt nach dem Aufbau unverändert (volle Lesbarkeit, Ruhezone ≈ 4 Module).

const V = 640; // SVG-Raster der Bühne (32 em Kantenlänge → 1 Einheit = 0,05 em)
const KACHEL = { x: 80, s: 480, r: 30 };
const QR = { x: 120, s: 400 };
const BANDEN = 16;
const BAND_START = 650;
const BAND_TAKT = 55;

/** Liest die Dunkel-Module aus dem SVG der Bibliothek „qrcode“ (Pfad aus M/m/h-Befehlen). */
function qrModule(svg) {
  const vb = /viewBox="0 0 (\d+) \d+"/.exec(svg || "");
  const pfad = /<path[^>]*stroke="[^"]*"[^>]*d="([^"]+)"/.exec(svg || "");
  if (!vb || !pfad) return null;
  const n = Number(vb[1]);
  const raster = Array.from({ length: n }, () => new Array(n).fill(false));
  let x = 0;
  let y = 0;
  const re = /([Mmh])\s*(-?[\d.]+)(?:[\s,]+(-?[\d.]+))?/g;
  let t;
  while ((t = re.exec(pfad[1]))) {
    const a = Number(t[2]);
    const b = Number(t[3] || 0);
    if (t[1] === "M") {
      x = a;
      y = b;
    } else if (t[1] === "m") {
      x += a;
      y += b;
    } else {
      const zeile = Math.floor(y);
      for (let i = 0; i < a; i++) {
        const s = Math.round(x + i);
        if (raster[zeile] && s < n) raster[zeile][s] = true;
      }
      x += a;
    }
  }
  return { n, raster };
}

const inFinder = (x, y, n) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);

/** Datenmodule in diagonale Bänder gruppiert, je Band ein Pfad (wenige DOM-Knoten). */
function baendern({ n, raster }) {
  const pfade = Array.from({ length: BANDEN }, () => "");
  const band = (x, y) => Math.min(BANDEN - 1, Math.floor(((x + y) / (2 * n - 1)) * BANDEN));
  for (let y = 0; y < n; y++) {
    let x = 0;
    while (x < n) {
      if (!raster[y][x] || inFinder(x, y, n)) {
        x++;
        continue;
      }
      const b = band(x, y);
      let l = 1;
      while (x + l < n && raster[y][x + l] && !inFinder(x + l, y, n) && band(x + l, y) === b) l++;
      pfade[b] += `M${x} ${y}h${l}v1h-${l}z`;
      x += l;
    }
  }
  return pfade;
}

const rundRechteck = (x, y, w, h, r) =>
  `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

const ECK = { a: 44, e: 596, arm: 92, r: 30 };
const ecken = [
  { d: `M${ECK.a} ${ECK.a + ECK.arm}V${ECK.a + ECK.r}A${ECK.r} ${ECK.r} 0 0 1 ${ECK.a + ECK.r} ${ECK.a}H${ECK.a + ECK.arm}`, dx: -1, dy: -1 },
  { d: `M${ECK.e - ECK.arm} ${ECK.a}H${ECK.e - ECK.r}A${ECK.r} ${ECK.r} 0 0 1 ${ECK.e} ${ECK.a + ECK.r}V${ECK.a + ECK.arm}`, dx: 1, dy: -1 },
  { d: `M${ECK.e} ${ECK.e - ECK.arm}V${ECK.e - ECK.r}A${ECK.r} ${ECK.r} 0 0 1 ${ECK.e - ECK.r} ${ECK.e}H${ECK.e - ECK.arm}`, dx: 1, dy: 1 },
  { d: `M${ECK.a + ECK.arm} ${ECK.e}H${ECK.a + ECK.r}A${ECK.r} ${ECK.r} 0 0 1 ${ECK.a} ${ECK.e - ECK.r}V${ECK.e - ECK.arm}`, dx: -1, dy: 1 },
];
const BAHN = rundRechteck(14, 14, 612, 612, 64);

// Lichtpunkt mit Schweif: Schichten gleicher Spitze, unterschiedlicher Länge (pathLength = 1)
const SCHWEIF = [
  { l: 0.16, w: 3, o: 0.18 },
  { l: 0.075, w: 4, o: 0.45 },
  { l: 0.022, w: 6, o: 1 },
  { l: 0.004, w: 16, o: 0.35 },
];
const KOMETEN = [
  { farbe: GRUEN_HELL, start: 0 },
  { farbe: SONNE, start: 0.5 },
];

// Deterministische Pseudo-Zufallsfolge (kein Math.random → gleiches Markup auf Server und Client)
const zufall = (i, k) => {
  let s = (i * 2654435761 + k * 40503) >>> 0;
  s = (s ^ (s >>> 15)) * 2246822519;
  s = (s ^ (s >>> 13)) >>> 0;
  return (s % 10000) / 10000;
};
const TEILCHEN = Array.from({ length: 18 }, (_, i) => {
  const seite = i % 4;
  const t = 0.08 + zufall(i, 1) * 0.84;
  const pos = 72 + t * 496;
  const [x, y, nx, ny] = [
    [pos, 70, 0, -1],
    [570, pos, 1, 0],
    [pos, 570, 0, 1],
    [70, pos, -1, 0],
  ][seite];
  const weite = 46 + zufall(i, 2) * 80;
  const quer = (zufall(i, 3) - 0.5) * 40;
  const g = 7 + Math.round(zufall(i, 4) * 4);
  return {
    x: Math.round(x - g / 2),
    y: Math.round(y - g / 2),
    g,
    dx: Math.round(nx * weite + ny * quer),
    dy: Math.round(ny * weite + nx * quer),
    farbe: i % 7 === 3 ? SONNE : i % 5 === 0 ? "#ffffff" : GRUEN_HELL,
    dauer: 5200 + Math.round(zufall(i, 5) * 3400),
    verz: 2600 + Math.round(zufall(i, 6) * 7000),
    hell: (0.3 + zufall(i, 7) * 0.3).toFixed(2),
  };
});

export default function KontaktGrafik({ f, aktiv }) {
  const qr = useMemo(() => qrModule(f.qrSvg), [f.qrSvg]);
  const baender = useMemo(() => (qr ? baendern(qr) : null), [qr]);
  const n = qr?.n || 1;
  const m = Math.round((QR.s / n) * 1000) / 1000;
  const finder = [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ];

  return (
    <div className={`tv11 flex h-full flex-col items-center justify-center ${aktiv ? "tv11-los" : ""}`}>
      <style>{CSS}</style>

      <div className="relative h-[32em] w-[32em] shrink-0">
        {/* Lichthof (statischer Verlauf, nur Deckkraft/Skalierung animiert) */}
        <div aria-hidden="true" className="tv11-hof pointer-events-none absolute left-1/2 top-1/2 h-[62em] w-[62em] -translate-x-1/2 -translate-y-1/2">
          <div className="tv11-atmen h-full w-full rounded-full" style={{ background: "radial-gradient(closest-side, rgba(140,186,88,0.26), rgba(140,186,88,0.08) 45%, rgba(3,18,43,0) 72%)" }} />
        </div>

        {/* Signalwellen hinter der Kachel */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            aria-hidden="true"
            className="tv11-welle pointer-events-none absolute left-[4em] top-[4em] h-[24em] w-[24em] rounded-[1.5em] border-[0.1em] border-ov-400/50"
            style={{ animationDelay: `${2300 + i * 3000}ms` }}
          />
        ))}

        {/* Weiche Schattenfläche der Kachel */}
        <div
          aria-hidden="true"
          className="tv11-kachel absolute left-[4em] top-[4em] h-[24em] w-[24em] rounded-[1.5em]"
          style={{ boxShadow: "0 2.4em 5em -1em rgba(0,0,0,0.55), 0 0 7em 0.4em rgba(174,208,131,0.22)" }}
        />

        <svg viewBox={`0 0 ${V} ${V}`} className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label={`QR-Code zur Angebotsanfrage: ${kurzUrl(f.url)}`}>
          <defs>
            <clipPath id="tv11-clip">
              <rect x={KACHEL.x} y={KACHEL.x} width={KACHEL.s} height={KACHEL.s} rx={KACHEL.r} />
            </clipPath>
            <linearGradient id="tv11-licht" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0" />
              <stop offset="0.5" stopColor={GRUEN_HELL} stopOpacity="0.55" />
              <stop offset="1" stopColor={GRUEN_HELL} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Module, die sich von der Kachel lösen und in den Raum treiben */}
          <g aria-hidden="true">
            {TEILCHEN.map((p, i) => (
              <rect
                key={i}
                x={p.x}
                y={p.y}
                width={p.g}
                height={p.g}
                rx="1.5"
                fill={p.farbe}
                className="tv11-teilchen"
                style={{ "--tv11-tx": `${p.dx}px`, "--tv11-ty": `${p.dy}px`, "--tv11-o": p.hell, animationDuration: `${p.dauer}ms`, animationDelay: `${p.verz}ms` }}
              />
            ))}
          </g>

          {/* Umlaufbahn mit zwei Lichtpunkten */}
          <g aria-hidden="true" className="tv11-bahn">
            <path d={BAHN} fill="none" stroke="#fff" strokeOpacity="0.06" strokeWidth="1.5" />
            {KOMETEN.map((k) =>
              SCHWEIF.map((s) => (
                <path
                  key={`${k.farbe}${s.l}`}
                  d={BAHN}
                  pathLength="1"
                  fill="none"
                  stroke={k.farbe}
                  strokeOpacity={s.o}
                  strokeWidth={s.w}
                  strokeLinecap="round"
                  className="tv11-komet"
                  style={{ strokeDasharray: `${s.l} ${1 - s.l}`, "--tv11-k": `${s.l - k.start}` }}
                />
              ))
            )}
          </g>

          {/* Kachel mit Code */}
          <rect x={KACHEL.x} y={KACHEL.x} width={KACHEL.s} height={KACHEL.s} rx={KACHEL.r} fill="#fff" className="tv11-kachel" />

          {qr && baender ? (
            <g clipPath="url(#tv11-clip)">
              <g transform={`translate(${QR.x} ${QR.x}) scale(${m})`} shapeRendering="crispEdges">
                {baender.map((d, i) => (
                  <path key={`n${i}`} d={d} fill={NAVY} className="tv11-band" style={{ animationDelay: `${BAND_START + i * BAND_TAKT}ms` }} />
                ))}
                {baender.map((d, i) => (
                  <path key={`g${i}`} d={d} fill={GRUEN} className="tv11-blitz" aria-hidden="true" style={{ animationDelay: `${BAND_START + i * BAND_TAKT}ms` }} />
                ))}
                {finder.map(([fx, fy], i) => (
                  <g key={i} className="tv11-finder" style={{ animationDelay: `${350 + i * 110}ms` }}>
                    <rect x={fx} y={fy} width="7" height="7" rx="1.3" fill={NAVY} />
                    <rect x={fx + 1} y={fy + 1} width="5" height="5" rx="0.7" fill="#fff" />
                    <rect x={fx + 2} y={fy + 2} width="3" height="3" rx="0.5" fill={NAVY} />
                  </g>
                ))}
              </g>
              {/* Lichtkante, die mit der Aufbauwelle einmal diagonal über die Kachel zieht */}
              <g aria-hidden="true" transform={`rotate(45 ${V / 2} ${V / 2})`}>
                <rect x="-120" y="-200" width="240" height="1040" fill="url(#tv11-licht)" className="tv11-kante" />
              </g>
            </g>
          ) : (
            <foreignObject x={QR.x} y={QR.x} width={QR.s} height={QR.s}>
              <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: f.qrSvg || "" }} />
            </foreignObject>
          )}

          {/* Bestätigungs-Impuls beim Einrasten */}
          <rect aria-hidden="true" x={KACHEL.x} y={KACHEL.x} width={KACHEL.s} height={KACHEL.s} rx={KACHEL.r} fill="none" stroke={GRUEN_HELL} strokeWidth="4" className="tv11-impuls" />

          {/* Sucherecken: rasten ein, atmen danach ruhig */}
          <g aria-hidden="true">
            {ecken.map((e, i) => (
              <g key={i} className="tv11-ecke" style={{ "--tv11-dx": `${e.dx * 34}px`, "--tv11-dy": `${e.dy * 34}px`, animationDelay: `${1500 + i * 50}ms` }}>
                <g className="tv11-eck-atmen" style={{ "--tv11-ax": `${-e.dx * 7}px`, "--tv11-ay": `${-e.dy * 7}px` }}>
                  <path d={e.d} fill="none" stroke={GRUEN} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={e.d} fill="none" stroke={GRUEN_HELL} strokeWidth="8" strokeLinecap="round" className="tv11-eck-blitz" style={{ animationDelay: `${2150 + i * 50}ms` }} />
                </g>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="mt-[1.6em] text-center">
        <p className="tv11-text font-display text-[3.4em] font-extrabold leading-none tracking-[-0.035em]" style={{ animationDelay: "1700ms" }}>
          Angebot anfragen
        </p>
        <p className="tv11-text mt-[0.8em] flex items-center justify-center gap-[0.6em] text-[1.45em] font-semibold" style={{ animationDelay: "1950ms" }}>
          <ScanQrCode aria-hidden="true" className="h-[1.05em] w-[1.05em] text-ov-300" strokeWidth={2} />
          <span className="text-white/70">Mit dem Handy scannen</span>
          <span aria-hidden="true" className="h-[0.26em] w-[0.26em] rounded-full bg-white/30" />
          <span className="text-ov-300">{kurzUrl(f.url)}</span>
        </p>
      </div>
    </div>
  );
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const CSS = `
.tv11 .tv11-hof, .tv11 .tv11-kachel, .tv11 .tv11-finder, .tv11 .tv11-band, .tv11 .tv11-ecke, .tv11 .tv11-text, .tv11 .tv11-bahn { opacity: 0; }
.tv11 .tv11-blitz, .tv11 .tv11-impuls, .tv11 .tv11-eck-blitz, .tv11 .tv11-welle, .tv11 .tv11-teilchen { opacity: 0; }
.tv11 .tv11-kachel, .tv11 .tv11-finder, .tv11 .tv11-impuls { transform-box: fill-box; transform-origin: center; }
.tv11 .tv11-ecke { transform: translate(var(--tv11-dx), var(--tv11-dy)); }
.tv11 .tv11-kante { transform: translateX(-320px); }
.tv11 .tv11-komet { stroke-dashoffset: var(--tv11-k); }

.tv11-los .tv11-hof { animation: tv11-auf 1600ms ${EASE} forwards; }
.tv11-los .tv11-atmen { animation: tv11-atmen 8s ease-in-out 1.6s infinite alternate; }
.tv11-los .tv11-kachel { animation: tv11-kachel 1000ms ${EASE} forwards; }
.tv11-los .tv11-finder { animation: tv11-finder 700ms ${EASE} forwards; }
.tv11-los .tv11-band { animation: tv11-auf 420ms ease-out forwards; }
.tv11-los .tv11-blitz { animation: tv11-blitz 760ms ease-out forwards; }
.tv11-los .tv11-kante { animation: tv11-kante 1500ms cubic-bezier(0.45, 0, 0.35, 1) 560ms forwards; }
.tv11-los .tv11-ecke { animation: tv11-ecke 760ms ${EASE} forwards; }
.tv11-los .tv11-eck-blitz { animation: tv11-blitz 900ms ease-out forwards; }
.tv11-los .tv11-eck-atmen { animation: tv11-eck-atmen 5.2s ease-in-out 3s infinite; }
.tv11-los .tv11-impuls { animation: tv11-impuls 1100ms ${EASE} 2150ms forwards; }
.tv11-los .tv11-text { animation: tv11-text 1000ms ${EASE} forwards; }
.tv11-los .tv11-bahn { animation: tv11-auf 1400ms ease-out 2400ms forwards; }
.tv11-los .tv11-komet { animation: tv11-komet 11s linear infinite; }
.tv11-los .tv11-welle { animation: tv11-welle 9s cubic-bezier(0.2, 0.6, 0.35, 1) infinite; }
.tv11-los .tv11-teilchen { animation-name: tv11-teilchen; animation-timing-function: cubic-bezier(0.3, 0.5, 0.4, 1); animation-iteration-count: infinite; }

@keyframes tv11-auf { to { opacity: 1; } }
@keyframes tv11-atmen { from { transform: scale(0.94); opacity: 0.8; } to { transform: scale(1.05); opacity: 1; } }
@keyframes tv11-kachel { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes tv11-finder { from { opacity: 0; transform: scale(0.35); } to { opacity: 1; transform: scale(1); } }
@keyframes tv11-blitz { 0% { opacity: 0; } 22% { opacity: 1; } 100% { opacity: 0; } }
@keyframes tv11-kante { from { transform: translateX(-320px); } to { transform: translateX(820px); } }
@keyframes tv11-ecke { from { opacity: 0; transform: translate(var(--tv11-dx), var(--tv11-dy)); } to { opacity: 1; transform: translate(0, 0); } }
@keyframes tv11-eck-atmen { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(var(--tv11-ax), var(--tv11-ay)); } }
@keyframes tv11-impuls { from { opacity: 0.95; transform: scale(1); } to { opacity: 0; transform: scale(1.14); } }
@keyframes tv11-text { from { opacity: 0; transform: translateY(0.45em); } to { opacity: 1; transform: translateY(0); } }
@keyframes tv11-komet { from { stroke-dashoffset: var(--tv11-k); } to { stroke-dashoffset: calc(var(--tv11-k) - 1); } }
@keyframes tv11-welle { 0% { opacity: 0; transform: scale(1); } 10% { opacity: 0.6; } 70% { opacity: 0; } 100% { opacity: 0; transform: scale(1.5); } }
@keyframes tv11-teilchen { 0% { opacity: 0; transform: translate(0, 0); } 18% { opacity: var(--tv11-o); } 100% { opacity: 0; transform: translate(var(--tv11-tx), var(--tv11-ty)); } }

@media (prefers-reduced-motion: reduce) {
  .tv11 *, .tv11-los * { animation: none !important; }
  .tv11 .tv11-hof, .tv11 .tv11-kachel, .tv11 .tv11-finder, .tv11 .tv11-band, .tv11 .tv11-ecke, .tv11 .tv11-text, .tv11 .tv11-bahn { opacity: 1; transform: none; }
}
`;
