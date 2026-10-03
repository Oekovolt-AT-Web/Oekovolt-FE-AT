// src/components/Loesungen/w24-Motive.js
//
// Zusätzliche Mini-Vorschauen für die Werkzeug-Karten der Lösungsseiten (RechnerLeiste,
// variante="schaufenster") – im Stil der Startseiten-Vorschauen (s04-Vorschau.js), für Rechner,
// die dort keine eigene Vorschau haben. Rein dekorativ, keine Ergebniszahlen, Kurven schematisch.
// Aufbau-Klassen aus s04-stil.js, ausgelöst von <S04Buehne/>.

import { d, glatt, rd } from "@/components/Startseite/s04-stil";

const GRUEN = "#8cba58";
const GRUEN_HELL = "#aed083";
const SONNE = "#ffc53d";
const SVG = "block h-full w-full";

// CO₂ & ESG: Scope 2 vorher/nachher, Blatt, Berichtszeile
export function W24VorschauCo2() {
  return (
    <svg viewBox="0 0 240 112" className={SVG} preserveAspectRatio="xMidYMid meet">
      {[30, 58, 86].map((y) => (
        <line key={y} x1="10" x2="150" y1={y} y2={y} stroke="rgba(255,255,255,0.05)" />
      ))}
      <rect className="s04-wachsen" style={d(200)} x="28" y="20" width="34" height="76" rx="5" fill="rgba(255,255,255,0.22)" />
      <rect className="s04-wachsen" style={d(520)} x="88" y="62" width="34" height="34" rx="5" fill={GRUEN} />
      <path className="s04-zeichne" style={d(900, { "--s04-t": ".9s" })} pathLength="1" d="M62,22 C78,24 84,40 88,58" fill="none" stroke={GRUEN_HELL} strokeWidth="1.6" strokeDasharray="1" strokeLinecap="round" />
      <path className="s04-pop" style={d(1500)} d="M84,52 L88,60 L93,53" fill="none" stroke={GRUEN_HELL} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="45" y="108" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontWeight="600">vorher</text>
      <text x="105" y="108" textAnchor="middle" fill={GRUEN_HELL} fontSize="10" fontWeight="600">nachher</text>
      <line x1="10" x2="150" y1="96.5" y2="96.5" stroke="rgba(255,255,255,0.14)" />
      {/* Berichts-Baustein */}
      <g className="s04-links" style={d(1100)}>
        <rect x="164" y="18" width="68" height="78" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
        <path d="M186,30 C186,30 178,36 178,44 C178,49 182,52 186,52 C190,52 194,49 194,44 C194,36 186,30 186,30 Z" fill={GRUEN} />
        <line x1="186" x2="186" y1="40" y2="56" stroke="#04112a" strokeWidth="1.2" />
        <rect x="174" y="64" width="48" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="174" y="73" width="38" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
        <rect x="174" y="82" width="44" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
      </g>
    </svg>
  );
}

// Lastgang-Analyse: CSV-Zeilen werden zur Kurve
const LG = [
  [0, 74], [14, 74], [26, 70], [38, 40], [52, 30], [66, 34], [80, 24], [94, 30], [108, 28], [122, 44], [136, 66], [150, 74],
];
export function W24VorschauLastgang() {
  const kurve = glatt(LG.map(([x, y]) => [rd(78 + x), y]));
  return (
    <svg viewBox="0 0 240 112" className={SVG} preserveAspectRatio="xMidYMid meet">
      <g className="s04-auf" style={d(150)}>
        <rect x="6" y="14" width="58" height="84" rx="7" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
        <text x="14" y="28" fill={GRUEN_HELL} fontSize="9" fontWeight="700">CSV</text>
        {[40, 50, 60, 70, 80, 90].map((y, i) => (
          <rect key={y} className="s04-skx" style={d(300 + i * 70, { "--s04-t": ".5s" })} x="14" y={y - 3} width={i % 2 ? 34 : 42} height="3.5" rx="1.75" fill="rgba(255,255,255,0.22)" />
        ))}
      </g>
      <path d="M68,56 L74,56" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      {[30, 56, 82].map((y) => (
        <line key={y} x1="78" x2="232" y1={y} y2={y} stroke="rgba(255,255,255,0.05)" />
      ))}
      <path className="s04-auf" style={d(1300)} d={`${kurve} L228,98 L78,98 Z`} fill={GRUEN} fillOpacity="0.16" />
      <path className="s04-zeichne" style={d(800, { "--s04-t": "1.3s" })} pathLength="1" d={kurve} fill="none" stroke={GRUEN} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <line className="s04-skx" style={d(1500, { "--s04-t": ".8s" })} x1="78" x2="232" y1="30" y2="30" stroke={SONNE} strokeWidth="1.3" strokeDasharray="4 4" />
      <circle className="s04-pop" style={d(1900)} cx="158" cy="24" r="3.5" fill="#04112a" stroke={SONNE} strokeWidth="1.6" />
      <line x1="78" x2="232" y1="98.5" y2="98.5" stroke="rgba(255,255,255,0.14)" />
    </svg>
  );
}
