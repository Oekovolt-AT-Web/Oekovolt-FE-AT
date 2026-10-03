// src/components/Loesungen/w25-Biodiversitaet.js
//
// Abschnitt „Biodiversität“ für /freiflaechen-photovoltaik (Server-Komponente, Präfix w25b).
// Ein gezeichneter Querschnitt durch einen ökologisch geplanten Solarpark bei Tag: Hügel, Himmel
// und Sonnenbahn, Modultische mit Bodenfreiheit und Reihenabstand, Schafe, Blühstreifen, ein
// Zaun mit Durchlass, Hecke mit Steinhaufen, Totholz und Kleingewässer, eine Monitoring-Fläche.
// Nummerierte Marken verbinden die Zeichnung mit den fünf Maßnahmen darunter; Überfahren einer
// Maßnahme hebt ihre Marke hervor (CSS :has, kein JS). Der Aufbau beim Eintritt hängt an
// `data-w25-an` (Client-Insel W25Sicht); ohne JS bzw. bei reduzierter Bewegung steht das Bild.

import Image from "next/image";
import Link from "next/link";
import W25Sicht from "./w25-Sicht";

const B = 1200;
const H = 440;
const G = 360;
const VB_Y = 80;
const rd = (v) => Math.round(v * 10) / 10;
const zufall = (k) => {
  const v = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/* Modultische: 80 cm Bodenfreiheit (40 px), Tiefe 181 px, Reihenabstand 2 m (100 px) */
const TISCHE = [150, 431, 712].map((x0) => {
  const a = [x0, 320];
  const b = [x0 + 181, 235];
  const yAuf = (x) => rd(320 - (85 * (x - x0)) / 181);
  let zellen = "";
  for (let k = 1; k < 5; k++) {
    const x = x0 + (181 * k) / 5;
    const y = yAuf(x);
    zellen += `M${rd(x)} ${y}l2 6`;
  }
  return {
    x0,
    flaeche: `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${b[0] + 3} ${b[1] + 7}L${a[0] + 3} ${a[1] + 7}Z`,
    kante: `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`,
    zellen,
    pfosten: [
      { x: x0 + 25, y: yAuf(x0 + 25) },
      { x: x0 + 150, y: yAuf(x0 + 150) },
    ],
  };
});

const BLUMEN_FARBEN = ["#ffc53d", "#ffffff", "#b48ad6", "#e8707e", "#ffd873"];
const BLUMEN = [];
[
  [14, 132, 16],
  [338, 425, 6],
  [619, 706, 6],
  [900, 960, 4],
].forEach(([x0, x1, n], s) => {
  for (let k = 0; k < n; k++) {
    const x = rd(x0 + ((x1 - x0) * (k + zufall(s * 31 + k) * 0.8)) / n);
    const h = rd(10 + zufall(s * 17 + k * 3) * 22);
    BLUMEN.push({ key: `${s}-${k}`, x, h, f: BLUMEN_FARBEN[(k + s) % BLUMEN_FARBEN.length], i: k + s * 3 });
  }
});

let GRAS = "";
for (let k = 0; k < 120; k++) {
  const x = rd(8 + k * 10 + zufall(k) * 6);
  const h = rd(5 + zufall(k + 300) * 9);
  const n = rd((zufall(k + 600) - 0.5) * 6);
  GRAS += `M${x} ${G}q${rd(n * 0.3)} ${rd(-h * 0.6)} ${n} ${-h}`;
}

const STRAEUCHER = [
  [985, 330, 26],
  [1018, 316, 32],
  [1060, 322, 30],
  [1150, 312, 36],
  [1190, 326, 28],
  [1000, 344, 20],
  [1105, 340, 24],
];

function Schaf({ x, s = 1, grasen = false, k = 0 }) {
  return (
    <g transform={`translate(${x} ${G}) scale(${s})`}>
      <ellipse cx="0" cy="1" rx="30" ry="4" fill="#33502a" opacity="0.18" />
      {[-16, -7, 10, 19].map((lx) => (
        <rect key={lx} x={lx - 2} y="-17" width="4" height="17" rx="2" fill="#3b3a36" />
      ))}
      <g className="w25b-wolle" style={{ "--k": k }}>
        {[
          [-18, -30, 11],
          [-6, -36, 13],
          [8, -35, 12],
          [19, -28, 11],
          [0, -24, 16],
          [-14, -22, 10],
          [14, -21, 10],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} fill="#f6f2e6" />
        ))}
        <path d="M-26 -30a14 14 0 0 1 18 -12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>
      {grasen ? (
        <g>
          <ellipse cx="-31" cy="-12" rx="8" ry="10" transform="rotate(-30 -31 -12)" fill="#3b3a36" />
          <ellipse cx="-27" cy="-23" rx="5" ry="2.4" transform="rotate(-20 -27 -23)" fill="#3b3a36" />
        </g>
      ) : (
        <g>
          <ellipse cx="-33" cy="-36" rx="8.5" ry="10.5" transform="rotate(20 -33 -36)" fill="#3b3a36" />
          <ellipse cx="-27" cy="-45" rx="6" ry="2.5" transform="rotate(-25 -27 -45)" fill="#3b3a36" />
          <circle cx="-36" cy="-38" r="1.3" fill="#fff" />
        </g>
      )}
    </g>
  );
}

function Igel({ x }) {
  let stacheln = "";
  for (let k = 0; k < 9; k++) {
    const a = Math.PI + (k * Math.PI) / 8;
    stacheln += `M${rd(Math.cos(a) * 11)} ${rd(Math.sin(a) * 8 - 1)}l${rd(Math.cos(a) * 6)} ${rd(Math.sin(a) * 6)}`;
  }
  return (
    <g transform={`translate(${x} ${G})`}>
      <path d={stacheln} stroke="#6d5539" strokeWidth="2" strokeLinecap="round" />
      <path d="M-13 0a13 10 0 0 1 26 0Z" fill="#8a6c47" />
      <path d="M-13 -2q-6 0 -8 2h8Z" fill="#c9a679" />
      <circle cx="-17" cy="-2.5" r="1" fill="#2b2118" />
    </g>
  );
}

function Pin({ n, x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`w25b-pin w25b-pin-${n}`} style={{ "--k": n }}>
        <circle className="w25b-pin-ring" r="22" fill="#669933" opacity="0" />
        <circle className="w25b-pin-kreis" r="14" fill="#fff" stroke="#669933" strokeWidth="2" />
        <text className="w25b-pin-zahl" y="5" textAnchor="middle" fontSize="14" fontWeight="800" fill="#436621" style={{ fontFamily: "var(--font-display)" }}>
          {n}
        </text>
      </g>
    </g>
  );
}

const CSS = `
.w25b-pin{transform-box:fill-box;transform-origin:center}
.w25b-pin-kreis,.w25b-pin-zahl,.w25b-pin-ring{transition:fill 300ms ease,opacity 300ms ease,stroke 300ms ease}
.w25b-karte{transition:background-color 300ms ease,box-shadow 300ms ease,transform 300ms ease}
${[1, 2, 3, 4, 5]
  .map(
    (n) =>
      `.w25b:has([data-mass="${n}"]:hover) .w25b-pin-${n} .w25b-pin-kreis{fill:#669933}.w25b:has([data-mass="${n}"]:hover) .w25b-pin-${n} .w25b-pin-zahl{fill:#fff}.w25b:has([data-mass="${n}"]:hover) .w25b-pin-${n} .w25b-pin-ring{opacity:.22}`
  )
  .join("")}
@media (prefers-reduced-motion:no-preference){
  .w25b-szene :is(.w25b-land,.w25b-tisch,.w25b-pflanze,.w25b-tier,.w25b-pin,.w25b-mass){transition:opacity 900ms ease,transform 1000ms cubic-bezier(.22,1,.36,1)}
  [data-w25-bereit]:not([data-w25-an]) .w25b-land{opacity:0;transform:translateY(16px)}
  [data-w25-bereit]:not([data-w25-an]) .w25b-tisch{opacity:0;transform:translateY(-24px)}
  [data-w25-an] .w25b-tisch{transition-delay:calc(350ms + var(--k) * 140ms)}
  .w25b-pflanze{transform-box:fill-box;transform-origin:50% 100%}
  [data-w25-bereit]:not([data-w25-an]) .w25b-pflanze{opacity:0;transform:scaleY(0)}
  [data-w25-an] .w25b-pflanze{transition-delay:calc(700ms + var(--k) * 25ms)}
  [data-w25-bereit]:not([data-w25-an]) .w25b-tier{opacity:0;transform:translateX(18px)}
  [data-w25-an] .w25b-tier{transition-delay:1100ms}
  [data-w25-bereit]:not([data-w25-an]) .w25b-mass{opacity:0}
  [data-w25-an] .w25b-mass{transition-delay:1500ms}
  [data-w25-bereit]:not([data-w25-an]) .w25b-pin{opacity:0;transform:scale(.4)}
  [data-w25-an] .w25b-pin{transition-delay:calc(1500ms + var(--k) * 120ms)}
  .w25b-bahn{stroke-dasharray:1;stroke-dashoffset:0}
  [data-w25-bereit]:not([data-w25-an]) .w25b-bahn{stroke-dashoffset:1}
  [data-w25-an] .w25b-bahn{transition:stroke-dashoffset 2000ms cubic-bezier(.65,0,.35,1) 200ms}
  .w25b-falter{animation:w25b-falter 4.5s ease-in-out infinite alternate}
  @keyframes w25b-falter{from{transform:translate(0,0)}to{transform:translate(10px,-8px)}}
  .w25b-karte:hover{transform:translateY(-2px)}
}
`;

export default function W25Biodiversitaet({ eyebrow, titel, text, massnahmen = [], bild, hinweis }) {
  const pins = [
    { n: 1, x: 381, y: 268 },
    { n: 2, x: 585, y: 296 },
    { n: 3, x: 1060, y: 262 },
    { n: 4, x: 920, y: 286 },
    { n: 5, x: 75, y: 402 },
  ];
  return (
    <div data-blk="biodiversitaet" className="w25b">
      <style>{CSS}</style>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
            {eyebrow}
          </p>
          <h2 className="ov-h2 mt-4 max-w-[38rem] text-balance text-ink-900">{titel}</h2>
        </div>
        <p className="ov-lead max-w-[34rem] text-ink-600 lg:pb-1">{text}</p>
      </div>

      {/* ---------- Querschnitt ---------- */}
      <W25Sicht className="w25b-szene relative mt-10 overflow-hidden rounded-[2rem] ring-1 ring-ink-200/70 md:mt-12 md:rounded-[2.5rem]" schwelle={0.25}>
        <div className="ov-no-scrollbar overflow-x-auto">
          <div className="relative min-w-[820px] md:min-w-0">
            <svg viewBox={`0 ${VB_Y} ${B} ${H - VB_Y}`} className="block h-auto w-full" role="img" aria-label="Querschnitt durch einen ökologisch geplanten Solarpark: Modultische mit Bodenfreiheit und Reihenabstand, Schafe und Blühstreifen, ein Zaun mit Durchlass für Kleintiere, eine Hecke mit Steinhaufen, Totholz und Kleingewässer sowie eine Monitoring-Fläche.">
              <defs>
                <linearGradient id="w25b-himmel" x1="0" y1={VB_Y} x2="0" y2={G} gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#dcebf8" />
                  <stop offset="0.7" stopColor="#f3f6f2" />
                  <stop offset="1" stopColor="#fbf5e6" />
                </linearGradient>
                <radialGradient id="w25b-sonne-hof">
                  <stop offset="0" stopColor="#ffd873" stopOpacity="0.7" />
                  <stop offset="0.35" stopColor="#ffd873" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#ffd873" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="w25b-boden" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#7fae4c" />
                  <stop offset="0.55" stopColor="#699a3a" />
                  <stop offset="1" stopColor="#5a4a30" />
                </linearGradient>
                <linearGradient id="w25b-modul" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#12408a" />
                  <stop offset="1" stopColor="#3a78cc" />
                </linearGradient>
                <radialGradient id="w25b-strauch" cx="0.35" cy="0.3" r="0.8">
                  <stop offset="0" stopColor="#9cc56a" />
                  <stop offset="0.6" stopColor="#5f8f33" />
                  <stop offset="1" stopColor="#3d6420" />
                </radialGradient>
              </defs>

              {/* Himmel, Sonnenbahn, Hügel */}
              <rect y={VB_Y} width={B} height={H - VB_Y} fill="url(#w25b-himmel)" />
              <circle cx="960" cy="135" r="160" fill="url(#w25b-sonne-hof)" />
              <path className="w25b-bahn" pathLength="1" d="M60 360A540 300 0 0 1 1140 360" fill="none" stroke="#e8a92a" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="1" />
              <circle cx="960" cy="135" r="24" fill="#ffc53d" />
              <circle cx="960" cy="135" r="13" fill="#fff1c2" />
              <g className="w25b-land">
                <path d="M0 292C140 250 260 262 400 280S700 236 880 250S1100 270 1200 248V360H0Z" fill="#e1edd0" />
                <path d="M0 318C180 290 330 300 480 312S780 284 960 298S1120 306 1200 296V360H0Z" fill="#c9dfad" />
              </g>

              {/* Boden */}
              <g className="w25b-land">
                <rect x="0" y={G} width={B} height={H - G} fill="url(#w25b-boden)" />
                <path d={GRAS} fill="none" stroke="#6f9e3f" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="0" x2={B} y1={G} y2={G} stroke="#8cba58" strokeWidth="2" />
                {/* Kleingewässer */}
                <ellipse cx="1150" cy="378" rx="38" ry="7" fill="#7fb0dd" />
                <ellipse cx="1142" cy="376" rx="18" ry="2" fill="#fff" opacity="0.6" />
                {/* Monitoring-Fläche */}
                <polygon points="34,376 102,376 116,364 48,364" fill="#fff" fillOpacity="0.15" stroke="#fff" strokeWidth="1.8" />
                {[34, 102, 116, 48].map((x, k) => (
                  <line key={x} x1={x} x2={x} y1={k < 2 ? 376 : 364} y2={(k < 2 ? 376 : 364) - 9} stroke="#e8707e" strokeWidth="2" strokeLinecap="round" />
                ))}
              </g>

              {/* Schatten der Tische */}
              {TISCHE.map((t) => (
                <ellipse key={`s${t.x0}`} className="w25b-land" cx={t.x0 + 130} cy={G + 3} rx="96" ry="5" fill="#2c4a1d" opacity="0.22" />
              ))}

              {/* Blühstreifen */}
              {BLUMEN.map((b) => (
                <g key={b.key} className="w25b-pflanze" style={{ "--k": b.i }}>
                  <path d={`M${b.x} ${G}q-1 ${-b.h * 0.5} 0 ${-b.h}`} stroke="#5f8f33" strokeWidth="1.5" fill="none" />
                  <circle cx={b.x} cy={rd(G - b.h)} r="3.4" fill={b.f} stroke="#000" strokeOpacity="0.08" />
                  <circle cx={b.x} cy={rd(G - b.h)} r="1.2" fill="#e8a92a" />
                </g>
              ))}

              {/* Modultische */}
              {TISCHE.map((t, k) => (
                <g key={t.x0} className="w25b-tisch" style={{ "--k": k }}>
                  {t.pfosten.map((p) => (
                    <rect key={p.x} x={p.x - 2.5} y={p.y} width="5" height={G - p.y} rx="1.5" fill="#8a96a6" />
                  ))}
                  <path d={`M${t.pfosten[0].x} ${G - 8}L${t.pfosten[1].x} ${rd((t.pfosten[1].y + G) / 2)}`} stroke="#a7b1be" strokeWidth="2.5" />
                  <path d={t.flaeche} fill="url(#w25b-modul)" />
                  <path d={t.zellen} stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
                  <path d={t.kante} stroke="#cfe2ff" strokeWidth="1.6" strokeLinecap="round" />
                </g>
              ))}

              {/* Maße: Bodenfreiheit und Reihenabstand */}
              <g className="w25b-mass" stroke="#03122b" strokeOpacity="0.75" strokeWidth="1.4" fill="none">
                <path d="M134 360V320M128 360h12M128 320h12" />
                <path d="M331 300H431M331 294v12M431 294v12" strokeDasharray="0" />
              </g>
              <g className="w25b-mass" fontSize="16" fontWeight="700" fill="#03122b" style={{ fontFamily: "var(--font-display)" }}>
                <rect x="36" y="324" width="88" height="28" rx="14" fill="#fff" fillOpacity="0.92" />
                <text x="80" y="343.5" textAnchor="middle">≥ 80 cm</text>
                <rect x="345" y="306" width="72" height="28" rx="14" fill="#fff" fillOpacity="0.92" />
                <text x="381" y="325.5" textAnchor="middle">≥ 2 m</text>
              </g>

              {/* Zaun mit Durchlass, Igel */}
              <g className="w25b-land">
                {[880, 920, 960].map((x) => (
                  <rect key={x} x={x - 2} y="288" width="4" height="72" rx="1.5" fill="#7a8696" />
                ))}
                <path d="M880 292H960M880 344H960" stroke="#7a8696" strokeWidth="1.4" />
                <path
                  d={Array.from({ length: 8 }, (_, k) => `M${880 + k * 10} 292l10 13M${890 + k * 10} 292l-10 13M${880 + k * 10} 305l10 13M${890 + k * 10} 305l-10 13M${880 + k * 10} 318l10 13M${890 + k * 10} 318l-10 13M${880 + k * 10} 331l10 13M${890 + k * 10} 331l-10 13`).join("")}
                  stroke="#7a8696"
                  strokeOpacity="0.55"
                  strokeWidth="0.9"
                />
              </g>
              <g className="w25b-tier">
                <Igel x={922} />
              </g>

              {/* Hecke, Baum, Steinhaufen, Totholz */}
              <g className="w25b-land">
                <path d="M1110 360V250" stroke="#6b5a43" strokeWidth="7" strokeLinecap="round" />
                <circle cx="1094" cy="232" r="34" fill="url(#w25b-strauch)" />
                <circle cx="1128" cy="222" r="38" fill="url(#w25b-strauch)" />
                <circle cx="1108" cy="196" r="34" fill="url(#w25b-strauch)" />
                {STRAEUCHER.map(([cx, cy, r]) => (
                  <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} fill="url(#w25b-strauch)" />
                ))}
                {[
                  [1020, 356, 13, 8],
                  [1040, 357, 11, 7],
                  [1030, 347, 10, 7],
                  [1052, 358, 8, 5],
                ].map(([cx, cy, rx, ry]) => (
                  <ellipse key={`${cx}${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#a3a9b1" stroke="#7d848d" strokeWidth="1" />
                ))}
                <rect x="1062" y="349" width="46" height="11" rx="5.5" fill="#7a5a3a" />
                <circle cx="1067" cy="354.5" r="4" fill="#a07a52" stroke="#7a5a3a" />
              </g>

              {/* Schafe */}
              <g className="w25b-tier">
                <Schaf x={530} s={0.95} grasen k={0} />
                <Schaf x={655} s={0.85} k={1} />
                <Schaf x={820} s={0.9} grasen k={2} />
              </g>

              {/* Falter über dem Blühstreifen */}
              <g className="w25b-tier">
                <g className="w25b-falter">
                  <ellipse cx="88" cy="300" rx="5" ry="3.5" transform="rotate(-30 88 300)" fill="#ffc53d" />
                  <ellipse cx="95" cy="300" rx="5" ry="3.5" transform="rotate(30 95 300)" fill="#ffd873" />
                </g>
                <g className="w25b-falter" style={{ animationDelay: "-2s" }}>
                  <ellipse cx="385" cy="330" rx="4" ry="3" transform="rotate(-30 385 330)" fill="#b48ad6" />
                  <ellipse cx="391" cy="330" rx="4" ry="3" transform="rotate(30 391 330)" fill="#c9a6e6" />
                </g>
              </g>

              {pins.map((p) => (
                <Pin key={p.n} {...p} />
              ))}
            </svg>
          </div>
        </div>
        <p className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-ink-500 md:hidden">Seitlich wischen</p>
      </W25Sicht>

      {/* ---------- Maßnahmen ---------- */}
      <ul className="ov-no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 md:mt-10 lg:grid-cols-3">
        {massnahmen.map((m, k) => (
          <li key={m.t} data-mass={k + 1} className="w25b-karte flex w-[82%] shrink-0 snap-start gap-4 rounded-2xl sm:w-auto bg-sand-50 p-5 ring-1 ring-ink-200/60 hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">
            <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-display text-[14px] font-extrabold text-ov-700 ring-2 ring-ov-500">
              {k + 1}
            </span>
            <div>
              <p className="font-display text-[16px] font-bold leading-snug text-ink-900">{m.t}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{m.x}</p>
            </div>
          </li>
        ))}
        {bild && (
          <li className="relative min-h-[200px] w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl ring-1 ring-ink-200/60 sm:w-auto">
            <Image src={bild.src} alt={bild.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-4 text-[12px] font-semibold text-white">Schafbeweidung im Solarpark (Symbolbild)</span>
          </li>
        )}
      </ul>

      {hinweis && (
        <p className="mt-6 rounded-2xl bg-ov-50 px-5 py-4 text-[15px] leading-relaxed text-ink-700 ring-1 ring-ov-100">
          <strong className="text-ink-900">Doppelnutzung gewünscht?</strong> Soll die Fläche landwirtschaftlich vorrangig genutzt bleiben, ist{" "}
          <Link href="/agri-pv" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
            Agri-PV
          </Link>{" "}
          oft die bessere Wahl – mit 30 % Förderzuschlag statt 25 % Abschlag.
        </p>
      )}
    </div>
  );
}
