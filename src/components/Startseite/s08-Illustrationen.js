// src/components/Startseite/s08-Illustrationen.js
//
// Kleine, gezeichnete Strich-Illustrationen für die vier Schritte in S09Prozess (Server-Komponente).
// Raster je 240 × 150. Linien mit Klasse `s08-zug` (pathLength = 1) zeichnen sich, sobald der Schritt
// aufleuchtet; Flächen mit `s08-flaeche` blenden ein. Verzögerung über --d (ms). Rein dekorativ.

import { Wrench } from "lucide-react";

const NAVY = "#03285a";
const GRUEN = "#669933";
const GRUEN_HELL = "#aed083";
const SONNE = "#ffc53d";

const zug = (ms, extra = {}) => ({ pathLength: 1, className: "s08-zug", style: { "--d": `${ms}ms` }, fill: "none", strokeLinecap: "round", strokeLinejoin: "round", ...extra });
const flaeche = (ms) => ({ className: "s08-flaeche", style: { "--d": `${ms}ms` } });

function Rahmen({ children }) {
  return (
    <svg viewBox="8 12 224 132" className="h-full w-full" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** 01 · Analyse: Lastgang mit PV-Erzeugung darunter, Lupe auf der Lastspitze. */
export function IlluAnalyse() {
  return (
    <Rahmen>
      {[46, 70, 94].map((y) => (
        <line key={y} x1="30" x2="214" y1={y} y2={y} stroke={NAVY} strokeOpacity="0.07" />
      ))}
      <path d="M62 124C92 124 100 54 124 54C148 54 156 124 186 124Z" fill={SONNE} fillOpacity="0.32" {...flaeche(700)} />
      <path d="M62 124C92 124 100 54 124 54C148 54 156 124 186 124" stroke={SONNE} strokeWidth="2" {...zug(650)} />
      <path d="M28 18V124H216" stroke={NAVY} strokeWidth="2" {...zug(0)} />
      <path
        d="M30 104L44 102L52 95L60 98L68 80L76 72L84 76L92 60L100 64L108 52L116 58L124 40L132 54L140 64L148 60L156 76L164 72L172 88L180 92L188 100L200 98L214 104"
        stroke={GRUEN}
        strokeWidth="2.6"
        {...zug(200)}
      />
      <g {...flaeche(1100)}>
        <circle cx="124" cy="40" r="17" fill="#fff" fillOpacity="0.55" stroke={NAVY} strokeWidth="2" />
        <path d="M136.5 52.5L150 66" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
        <circle cx="124" cy="40" r="3.5" fill={GRUEN} />
      </g>
    </Rahmen>
  );
}

/** 02 · Planung & Netzantrag: Dachplan mit Modulfeld und Bemaßung, daneben der Antrag. */
export function IlluPlanung() {
  const felder = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) felder.push({ x: 38 + c * 25, y: 44 + r * 22, k: r * 4 + c });
  return (
    <Rahmen>
      <rect x="24" y="28" width="128" height="94" rx="4" stroke={NAVY} strokeWidth="2" {...zug(0)} />
      {felder.map((m) => (
        <rect key={m.k} x={m.x} y={m.y} width="21" height="17" rx="1.5" fill="#e6f1d8" stroke={GRUEN} strokeWidth="1.6" {...flaeche(300 + m.k * 45)} />
      ))}
      <path d="M24 136H152M24 131V141M152 131V141" stroke={NAVY} strokeOpacity="0.55" strokeWidth="1.5" {...zug(500)} />
      <path d="M172 24H204L216 36V106H172Z" fill="#fff" stroke={NAVY} strokeWidth="2" {...zug(250)} />
      <path d="M204 24V36H216" stroke={NAVY} strokeWidth="2" {...zug(600)} />
      <path d="M180 48H206M180 58H206M180 68H198" stroke={NAVY} strokeOpacity="0.4" strokeWidth="2" {...zug(700)} />
      <g {...flaeche(1050)}>
        <circle cx="207" cy="104" r="15" fill={GRUEN} />
        <path d="M200.5 104.5L205 109L213.5 99.5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Rahmen>
  );
}

/** 03 · Bau & Inbetriebnahme: zwei Modultische im Profil, Inbetriebnahme-Haken. */
export function IlluBau() {
  const tische = [0, 92];
  return (
    <Rahmen>
      <path d="M14 124H226" stroke={NAVY} strokeWidth="2" {...zug(0)} />
      {[30, 46, 62, 78, 94, 110, 126, 142, 158, 174, 190, 206].map((x) => (
        <line key={x} x1={x} x2={x - 6} y1="128" y2="136" stroke={NAVY} strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      {tische.map((dx, i) => (
        <g key={dx}>
          <path d={`M${dx + 46} 96V124M${dx + 86} 74V124M${dx + 46} 108L${dx + 86} 86`} stroke={NAVY} strokeWidth="2" {...zug(150 + i * 200)} />
          <path d={`M${dx + 30} 100L${dx + 102} 61L${dx + 106} 68L${dx + 34} 107Z`} fill="#12408a" stroke={NAVY} strokeWidth="1.5" {...flaeche(450 + i * 200)} />
          <path d={`M${dx + 48} 90.5L${dx + 52} 97.5M${dx + 66} 80.8L${dx + 70} 87.8M${dx + 84} 71L${dx + 88} 78`} stroke="#fff" strokeOpacity="0.35" strokeWidth="1" {...flaeche(500 + i * 200)} />
        </g>
      ))}
      <g {...flaeche(950)}>
        <circle cx="206" cy="36" r="15" fill={SONNE} />
        <path d="M206 25V20M206 52V47M195 36H190M222 36H217" stroke={SONNE} strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <g {...flaeche(1150)}>
        <circle cx="30" cy="34" r="15" fill={GRUEN} />
        <path d="M23.5 34.5L28 39L36.5 29.5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Rahmen>
  );
}

/** 04 · Betrieb & Wartung: Monitoring mit Tagesgang, Status und Wartung. */
export function IlluBetrieb() {
  return (
    <Rahmen>
      <rect x="26" y="20" width="148" height="92" rx="9" fill="#fff" stroke={NAVY} strokeWidth="2" {...zug(0)} />
      <path d="M100 112V124M78 126H122" stroke={NAVY} strokeWidth="2" {...zug(300)} />
      <path d="M40 96C70 96 78 44 100 44C122 44 130 96 160 96Z" fill="#e6f1d8" {...flaeche(700)} />
      <path d="M40 96C70 96 78 44 100 44C122 44 130 96 160 96" stroke={GRUEN} strokeWidth="2.6" {...zug(400)} />
      <path d="M40 96H160" stroke={NAVY} strokeOpacity="0.25" strokeWidth="1.5" {...zug(350)} />
      <g {...flaeche(900)}>
        <circle cx="158" cy="33" r="4" fill={GRUEN} />
        <circle cx="158" cy="33" r="8" fill={GRUEN_HELL} fillOpacity="0.45" />
        <rect x="38" y="30" width="34" height="5" rx="2.5" fill={NAVY} fillOpacity="0.18" />
      </g>
      <g {...flaeche(1150)}>
        <circle cx="200" cy="96" r="22" fill={NAVY} />
        <Wrench x={188} y={84} width={24} height={24} color="#fff" strokeWidth={1.9} aria-hidden="true" />
      </g>
      <path d="M174 70C188 70 200 74 200 74" stroke={NAVY} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 4" fill="none" {...flaeche(1100)} />
    </Rahmen>
  );
}
