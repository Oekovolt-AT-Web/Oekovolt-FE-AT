// src/components/Startseite/s04-Vorschau.js
//
// Mini-Vorschauen der Rechner für „Rechner & Tools“ (Startseite). Rein dekorativ
// (aria-hidden über den Container), Server-Komponenten. Die Vorschauen zeigen bewusst
// KEINE Ergebniszahlen – nur Eingabefelder und Ergebnisarten, die der jeweilige Rechner
// laut src/components/Rechner/tools.js wirklich liefert. Kurven sind schematisch.
// Aufbau-Animation: Klassen aus s04-stil.js, ausgelöst von <S04Buehne/> je Karte.

import { MapPin } from "lucide-react";
import { d, glatt, rd } from "./s04-stil";

const GRUEN = "#8cba58";
const GRUEN_HELL = "#aed083";
const SONNE = "#ffc53d";

/* ------------------------------------------------------------------ */
/* Gewerbe-PV: Produktfenster mit Eingaben und Ergebnis                */
/* ------------------------------------------------------------------ */

const MONATE = [22, 35, 58, 74, 88, 94, 97, 86, 66, 45, 26, 18];

export function VorschauGewerbe({ pfad }) {
  return (
    <div className="s04-fenster overflow-hidden rounded-2xl bg-[#04112a]/80 ring-1 ring-white/[0.09]">
      {/* Fensterleiste */}
      <div className="flex h-9 items-center gap-1.5 border-b border-white/[0.07] px-3.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="mx-auto truncate rounded-md bg-white/[0.05] px-3 py-0.5 text-[10.5px] tracking-wide text-white/45">oekovolt.com{pfad}</span>
        <span className="w-[30px]" />
      </div>
      <div className="grid sm:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        {/* Eingaben */}
        <div className="hidden space-y-4 border-r border-white/[0.07] p-4 sm:block">
          <div>
            <p className="flex justify-between text-[10.5px] font-medium text-white/55">
              <span>Dachfläche</span>
              <span className="text-white/30">m²</span>
            </p>
            <div className="relative mt-2.5 h-1 rounded-full bg-white/10">
              <span className="s04-regler-fuell absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-ov-600 to-ov-300" />
              <span className="s04-regler-bahn absolute inset-0">
                <span className="absolute -top-[5px] -ml-[7px] h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_0_3px_rgba(140,186,88,0.35),0_4px_10px_rgba(0,0,0,0.4)]" />
              </span>
            </div>
          </div>
          <div>
            <p className="text-[10.5px] font-medium text-white/55">Standort</p>
            <div className="mt-2 flex h-8 items-center gap-2 rounded-lg bg-white/[0.05] px-2.5 ring-1 ring-white/[0.08]">
              <MapPin className="h-3.5 w-3.5 text-ov-300" strokeWidth={2} />
              <span className="s04-tippen h-1.5 w-[70%] origin-left rounded-full bg-white/25" />
            </div>
          </div>
          <div>
            <p className="text-[10.5px] font-medium text-white/55">Schichtbetrieb</p>
            <div className="relative mt-2 grid h-8 grid-cols-3 rounded-lg bg-white/[0.05] p-0.5 ring-1 ring-white/[0.08]">
              <span className="s04-schicht absolute inset-y-0.5 left-0.5 w-[calc((100%-4px)/3)] rounded-md bg-ov-500/90 shadow-[0_4px_12px_-4px_rgba(102,153,51,0.8)]" />
              {["1", "2", "3"].map((s) => (
                <span key={s} className="relative flex items-center justify-center text-[11px] font-semibold text-white/80">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ergebnis */}
        <div className="p-4">
          <p className="flex items-center justify-between text-[10.5px] font-medium text-white/55">
            <span>Ertrag & Last je Monat</span>
            <span className="flex items-center gap-1.5 text-white/40">
              <span className="h-0.5 w-3 rounded-full bg-sun-400" /> Last
            </span>
          </p>
          <svg viewBox="0 0 300 104" className="mt-2 block h-auto w-full">
            <defs>
              <linearGradient id="s04-g-balken" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={GRUEN_HELL} />
                <stop offset="100%" stopColor="#3f6a1c" />
              </linearGradient>
            </defs>
            {[24, 52, 80].map((y) => (
              <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
            ))}
            {MONATE.map((w, i) => {
              const h = rd((w / 100) * 84);
              return <rect key={i} className="s04-wachsen" style={d(700 + i * 45)} x={rd(4 + i * 24.6)} y={rd(92 - h)} width="15" height={h} rx="3" fill="url(#s04-g-balken)" />;
            })}
            <path className="s04-zeichne" style={d(1100, { "--s04-t": "1.4s" })} pathLength="1" d="M4,52 C50,50 80,56 130,51 S220,47 260,52 296,51 296,51" fill="none" stroke={SONNE} strokeWidth="2" strokeLinecap="round" />
            <line x1="0" x2="300" y1="92.5" y2="92.5" stroke="rgba(255,255,255,0.14)" />
          </svg>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Kpi titel="Eigenverbrauch">
              <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" />
              <circle className="s04-ring" style={d(1500)} cx="14" cy="14" r="10" fill="none" stroke={GRUEN} strokeWidth="3.5" strokeLinecap="round" pathLength="1" transform="rotate(-90 14 14)" />
            </Kpi>
            <Kpi titel="Amortisation">
              <line x1="0" x2="60" y1="15" y2="15" stroke="rgba(255,255,255,0.14)" strokeDasharray="2 3" />
              <path className="s04-zeichne" style={d(1650, { "--s04-t": "1s" })} pathLength="1" d="M2,25 L18,20 L32,14 L46,8 L58,3" fill="none" stroke={GRUEN_HELL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle className="s04-pop" style={d(2300)} cx="35" cy="13" r="2.6" fill={SONNE} />
            </Kpi>
            <Kpi titel="IRR" nurBreit>
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} className="s04-wachsen" style={d(1800 + i * 80)} x={6 + i * 13} y={22 - 4 - i * 5} width="8" height={4 + i * 5} rx="1.5" fill={i === 3 ? GRUEN : "rgba(255,255,255,0.22)"} />
              ))}
            </Kpi>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ titel, nurBreit, children }) {
  return (
    <div className={`rounded-lg bg-white/[0.04] p-2 ring-1 ring-white/[0.06] ${nurBreit ? "hidden sm:block" : ""}`}>
      <p className="truncate text-[10px] font-medium text-white/50 sm:text-[10.5px]">{titel}</p>
      <svg viewBox="0 0 60 28" className="mt-1 block h-7 w-full" preserveAspectRatio="xMinYMid meet">
        {children}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Peak-Shaving: Spitzentag ohne und mit Speicher                      */
/* ------------------------------------------------------------------ */

const KAPPE = 70;
const LAST = [
  [0, 150], [30, 148], [60, 140], [85, 112], [110, 96], [135, 66], [158, 44], [180, 70], [205, 98],
  [228, 92], [250, 62], [272, 36], [294, 60], [318, 102], [345, 130], [372, 144], [400, 148],
];
const LAST_PFAD = glatt(LAST);
const GEKAPPT_PFAD = glatt(LAST.map(([x, y]) => [x, Math.max(y, KAPPE)]));

export function VorschauPeak() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-white/55">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-white/40" /> ohne Speicher
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-ov-400" /> mit Speicher
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-sun-400/50 ring-1 ring-sun-400/70" /> Spitze gekappt
        </span>
      </div>
      <svg viewBox="0 0 400 186" className="mt-4 block h-auto w-full">
        <defs>
          <clipPath id="s04-ueber">
            <rect x="0" y="0" width="400" height={KAPPE} />
          </clipPath>
          <clipPath id="s04-unter">
            <rect x="0" y={KAPPE - 1.5} width="400" height="200" />
          </clipPath>
          <linearGradient id="s04-g-spitze" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={SONNE} stopOpacity="0.75" />
            <stop offset="100%" stopColor={SONNE} stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="s04-g-gekappt" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={GRUEN} stopOpacity="0.32" />
            <stop offset="100%" stopColor={GRUEN} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[40, 100, 160].map((y) => (
          <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgba(255,255,255,0.05)" />
        ))}
        {/* Fläche unter der gekappten Kurve */}
        <path className="s04-auf" style={d(1700)} d={`${GEKAPPT_PFAD} L400,166 L0,166 Z`} fill="url(#s04-g-gekappt)" clipPath="url(#s04-unter)" />
        {/* Spitzen über der Grenze */}
        <path className="s04-auf" style={d(1500)} d={`${LAST_PFAD} L400,166 L0,166 Z`} fill="url(#s04-g-spitze)" clipPath="url(#s04-ueber)" />
        {/* Lastgang ohne Speicher */}
        <path className="s04-zeichne" style={d(300, { "--s04-t": "1.5s" })} pathLength="1" d={LAST_PFAD} fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1.8" strokeLinejoin="round" />
        {/* Grenze */}
        <line className="s04-skx" style={d(1150, { "--s04-t": ".9s" })} x1="0" x2="400" y1={KAPPE} y2={KAPPE} stroke={SONNE} strokeWidth="1.6" strokeDasharray="5 5" />
        {/* Lastgang mit Speicher */}
        <path className="s04-zeichne" style={d(1750, { "--s04-t": "1.5s" })} pathLength="1" d={GEKAPPT_PFAD} fill="none" stroke={GRUEN} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" clipPath="url(#s04-unter)" />
        {[158, 272].map((x, i) => (
          <circle key={x} className="s04-pop" style={d(2300 + i * 160)} cx={x} cy={KAPPE} r="4" fill="#061530" stroke={SONNE} strokeWidth="2" />
        ))}
        <line x1="0" x2="400" y1="166.5" y2="166.5" stroke="rgba(255,255,255,0.14)" />
        {["0", "6", "12", "18", "24 h"].map((t, i) => (
          <text key={t} x={i === 0 ? 0 : i === 4 ? 400 : i * 100} y="182" textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"} fill="rgba(255,255,255,0.35)" fontSize="10.5">
            {t}
          </text>
        ))}
      </svg>
      <div className="mt-auto grid grid-cols-2 gap-2 pt-4 sm:grid-cols-3">
        <Kpi titel="Speichergröße">
          <rect x="4" y="5" width="44" height="18" rx="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" />
          <rect x="49" y="10.5" width="3" height="7" rx="1" fill="rgba(255,255,255,0.3)" />
          <rect className="s04-skx" style={d(2400, { "--s04-t": "1s" })} x="7" y="8" width="28" height="12" rx="1.5" fill={GRUEN} />
        </Kpi>
        <Kpi titel="Leistungspreis">
          <rect x="8" y="4" width="14" height="20" rx="2" fill="rgba(255,255,255,0.2)" />
          <rect className="s04-wachsen" style={d(2550)} x="28" y="12" width="14" height="12" rx="2" fill={GRUEN} />
          <path className="s04-auf" style={d(2700)} d="M46,6 L52,12 M52,12 L52,7.5 M52,12 L47.5,12" stroke={SONNE} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </Kpi>
        <Kpi titel="Amortisation" nurBreit>
          <line x1="0" x2="60" y1="15" y2="15" stroke="rgba(255,255,255,0.14)" strokeDasharray="2 3" />
          <path className="s04-zeichne" style={d(2650, { "--s04-t": "1s" })} pathLength="1" d="M2,25 L18,20 L32,14 L46,8 L58,3" fill="none" stroke={GRUEN_HELL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Kpi>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Kleine Vorschauen                                                  */
/* ------------------------------------------------------------------ */

const SVG_KLEIN = "block h-full w-full";

// E-Flotte: Solarstrom vom Dach über den Ladepunkt in den Transporter
export function VorschauFlotte() {
  return (
    <svg viewBox="0 0 240 112" className={SVG_KLEIN} preserveAspectRatio="xMidYMid meet">
      <g className="s04-pop" style={d(200)}>
        <circle cx="30" cy="20" r="7" fill={SONNE} />
        <circle cx="30" cy="20" r="12" fill={SONNE} opacity="0.18" />
      </g>
      {/* Modul */}
      <g className="s04-auf" style={d(350)}>
        <path d="M14,40 L58,40 L66,62 L22,62 Z" fill="#12408a" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <path d="M28.7,40 L36.7,62 M43.3,40 L51.3,62 M18,51 L62,51" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
      </g>
      {/* Leitungen */}
      <path d="M44,62 L44,92 L92,92" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" strokeLinejoin="round" />
      <path className="s04-fluss" d="M44,62 L44,92 L92,92" fill="none" stroke={GRUEN} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M110,72 C120,72 122,78 134,78" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
      <path className="s04-fluss" d="M110,72 C120,72 122,78 134,78" fill="none" stroke={GRUEN} strokeWidth="2.5" />
      {/* Ladepunkt */}
      <rect x="92" y="50" width="18" height="46" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" />
      <rect x="96" y="56" width="10" height="12" rx="2" fill="#04112a" />
      <rect className="s04-wachsen" style={d(900)} x="97.5" y="57.5" width="7" height="9" rx="1" fill={GRUEN} />
      {/* Transporter */}
      <g className="s04-links" style={d(500)}>
        <path d="M134,92 L134,52 Q134,46 140,46 L190,46 Q196,46 199,51 L210,66 L222,70 Q228,72 228,78 L228,92 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M192,52 L203,66 L188,66 L188,52 Z" fill="rgba(127,167,214,0.3)" />
        <line x1="134" x2="228" y1="80" y2="80" stroke="rgba(255,255,255,0.12)" />
        <circle cx="152" cy="94" r="8" fill="#04112a" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
        <circle cx="210" cy="94" r="8" fill="#04112a" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
        <path d="M160,56 L156,64 L161,64 L158,72 L166,61 L161,61 L164,56 Z" fill={GRUEN_HELL} />
      </g>
      <line x1="6" x2="234" y1="104" y2="104" stroke="rgba(255,255,255,0.1)" />
    </svg>
  );
}

// Energiegemeinschaft: Erzeugung in der Mitte, Gemeinde, Betrieb und Haushalte rundum
export function VorschauEeg() {
  const knoten = [
    { x: 42, y: 80, l: "Gemeinde", icon: "gemeinde" },
    { x: 120, y: 80, l: "Betriebe", icon: "betrieb" },
    { x: 198, y: 80, l: "Haushalte", icon: "haus" },
  ];
  const M = { x: 120, y: 22 };
  const kante = (k) => `M${M.x},${M.y + 16} C${M.x},${M.y + 38} ${k.x},${k.y - 38} ${k.x},${k.y - 16}`;
  return (
    <svg viewBox="0 0 240 112" className={SVG_KLEIN} preserveAspectRatio="xMidYMid meet">
      {knoten.map((k, i) => (
        <g key={k.l}>
          <path d={kante(k)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <path className="s04-fluss" style={d(i * 120)} d={kante(k)} fill="none" stroke={GRUEN} strokeWidth="2" />
        </g>
      ))}
      {knoten.map((k, i) => (
        <g key={k.l} className="s04-pop" style={d(500 + i * 140)}>
          <circle cx={k.x} cy={k.y} r="15" fill="#0a2149" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
          <EegIcon art={k.icon} x={k.x} y={k.y} />
          <text x={k.x} y={k.y + 29} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10.5" fontWeight="600">
            {k.l}
          </text>
        </g>
      ))}
      <g className="s04-pop" style={d(200)}>
        <circle cx={M.x} cy={M.y} r="22" fill={GRUEN} opacity="0.12" />
        <circle cx={M.x} cy={M.y} r="16" fill="#558227" stroke={GRUEN_HELL} strokeWidth="1.5" />
        <circle cx={M.x} cy={M.y - 4} r="3.6" fill={SONNE} />
        <path d={`M${M.x - 8},${M.y + 8} L${M.x + 8},${M.y + 8} L${M.x + 5},${M.y + 2} L${M.x - 5},${M.y + 2} Z`} fill="#fff" opacity="0.9" />
      </g>
    </svg>
  );
}

function EegIcon({ art, x, y }) {
  const s = { fill: "none", stroke: "#fff", strokeWidth: 1.4, strokeLinejoin: "round", strokeLinecap: "round" };
  if (art === "gemeinde")
    return <path {...s} d={`M${x - 7},${y + 6} L${x + 7},${y + 6} M${x - 6},${y + 6} L${x - 6},${y - 1} L${x + 6},${y - 1} L${x + 6},${y + 6} M${x - 7},${y - 1} L${x},${y - 7} L${x + 7},${y - 1} M${x - 2.5},${y + 6} L${x - 2.5},${y + 2} L${x + 2.5},${y + 2} L${x + 2.5},${y + 6}`} />;
  if (art === "betrieb")
    return <path {...s} d={`M${x - 8},${y + 6} L${x - 8},${y - 2} L${x - 3},${y - 6} L${x - 3},${y - 2} L${x + 2},${y - 6} L${x + 2},${y - 2} L${x + 8},${y - 6} L${x + 8},${y + 6} Z`} />;
  return <path {...s} d={`M${x - 7},${y + 6} L${x - 7},${y - 1} L${x},${y - 7} L${x + 7},${y - 1} L${x + 7},${y + 6} Z M${x - 2},${y + 6} L${x - 2},${y + 1} L${x + 2},${y + 1} L${x + 2},${y + 6}`} />;
}

// Blackout: Netz fällt aus, Notstrom übernimmt
const AUSFALL = 118;
const welle = (von, bis) => {
  let p = "";
  for (let x = von; x <= bis; x += 3) p += `${p ? " L" : "M"}${x},${rd(56 + Math.sin((x - 12) / 9) * 15)}`;
  return p;
};
const NETZ = welle(12, AUSFALL);
const NOT = welle(AUSFALL, 228);

export function VorschauBlackout() {
  return (
    <svg viewBox="0 0 240 112" className={SVG_KLEIN} preserveAspectRatio="xMidYMid meet">
      {[26, 56, 86].map((y) => (
        <line key={y} x1="8" x2="232" y1={y} y2={y} stroke="rgba(255,255,255,0.05)" />
      ))}
      <text x="12" y="104" fill="rgba(255,255,255,0.45)" fontSize="10.5" fontWeight="600">Netz</text>
      <text x="228" y="104" textAnchor="end" fill={GRUEN_HELL} fontSize="10.5" fontWeight="600">Notstrom</text>
      <path className="s04-zeichne" style={d(200, { "--s04-t": ".9s" })} pathLength="1" d={NETZ} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinejoin="round" />
      <line className="s04-skx" style={d(1050, { "--s04-t": ".8s" })} x1={AUSFALL} x2="228" y1="56" y2="56" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="3 4" />
      <line className="s04-sky" style={d(950, { "--s04-t": ".4s" })} x1={AUSFALL} x2={AUSFALL} y1="14" y2="96" stroke="#ff8a7a" strokeWidth="1.2" strokeDasharray="3 3" />
      <g className="s04-pop" style={d(1000)}>
        <circle cx={AUSFALL} cy="14" r="8" fill="#3a1520" stroke="#ff8a7a" strokeWidth="1.2" />
        <path d={`M${AUSFALL - 3},11 L${AUSFALL + 3},17 M${AUSFALL + 3},11 L${AUSFALL - 3},17`} stroke="#ff8a7a" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <path className="s04-zeichne" style={d(1250, { "--s04-t": "1.1s" })} pathLength="1" d={NOT} fill="none" stroke={GRUEN} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// Standort-Check: Höhenlinien, Pin, Prüfgrößen
const HOEHEN = [
  "M70,72 C70,48 98,34 122,36 C150,38 172,52 170,74 C168,94 140,102 118,100 C92,98 70,92 70,72 Z",
  "M88,72 C88,56 104,48 122,49 C142,50 154,60 153,74 C152,87 136,91 120,90 C102,89 88,85 88,72 Z",
  "M104,71 C104,63 112,59 121,60 C131,61 137,66 136,73 C135,80 128,82 120,81 C111,80 104,78 104,71 Z",
];

export function VorschauStandort() {
  const chips = [
    { l: "Schneelast", x: 4, y: 16 },
    { l: "Wind", x: 176, y: 16 },
    { l: "Hagel", x: 4, y: 98 },
    { l: "Ertrag", x: 176, y: 98 },
  ];
  return (
    <svg viewBox="0 0 240 112" className={SVG_KLEIN} preserveAspectRatio="xMidYMid meet">
      {HOEHEN.map((p, i) => (
        <path key={i} className="s04-zeichne" style={d(150 + i * 180, { "--s04-t": "1.2s" })} pathLength="1" d={p} fill="none" stroke={`rgba(255,255,255,${0.16 + i * 0.12})`} strokeWidth="1.2" />
      ))}
      <circle className="s04-pop" style={d(1250)} cx="120" cy="71" r="16" fill="none" stroke={GRUEN} strokeOpacity="0.45" strokeWidth="1.2" />
      <g className="s04-hoch" style={d(950)}>
        <path d="M120,72 C120,72 110,60 110,52 C110,46 114.5,42 120,42 C125.5,42 130,46 130,52 C130,60 120,72 120,72 Z" fill={GRUEN} />
        <circle cx="120" cy="52" r="3.6" fill="#04112a" />
      </g>
      {chips.map((c, i) => (
        <g key={c.l} className="s04-auf" style={d(1400 + i * 110)}>
          <rect x={c.x} y={c.y - 11} width="60" height="18" rx="9" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" />
          <text x={c.x + 30} y={c.y + 2} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="10" fontWeight="600">
            {c.l}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Förder-Check: Bausteine fügen sich zusammen
export function VorschauFoerderung() {
  const teile = ["EAG-Zuschuss", "IFB 22 %", "Landesförderung"];
  return (
    <div className="flex flex-wrap items-center gap-2" aria-hidden="true">
      {teile.map((t, i) => (
        <span key={t} className="contents">
          {i > 0 && (
            <span className="s04-pop hidden text-[15px] font-bold text-white/60 sm:inline" style={d(450 + i * 220)}>
              +
            </span>
          )}
          <span className="s04-links inline-flex h-10 items-center rounded-full bg-white/[0.14] px-4 text-[13px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm" style={d(300 + i * 220)}>
            {t}
          </span>
        </span>
      ))}
    </div>
  );
}
