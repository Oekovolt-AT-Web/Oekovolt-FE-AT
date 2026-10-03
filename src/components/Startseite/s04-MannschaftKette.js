// src/components/Startseite/s04-MannschaftKette.js
//
// „Die ganze Kette in eigener Hand“ – gezeichnete Strichgrafiken für den Mannschaft-Teaser
// der Startseite. Gruppen = die drei Zeilen der Überschrift (Fahrzeuge · Leute · Technik).
// Nur bestätigte Einträge aus src/data/mannschaft.js (AUSSTATTUNG_BESTAETIGT).
// Server-Komponente; Aufbau über S04Buehne (s04-stil.js).

import { AUSSTATTUNG_BESTAETIGT } from "@/data/mannschaft";
import { d } from "./s04-stil";

export const KETTE = [
  { gruppe: "fahrzeuge", titel: "Unsere Fahrzeuge", ids: ["lkw", "traktoren"] },
  { gruppe: "leute", titel: "Unsere Leute", ids: ["montage"] },
  { gruppe: "technik", titel: "Unsere Technik", ids: ["parkregler", "scada"] },
]
  .map((g) => ({ ...g, eintraege: g.ids.map((id) => AUSSTATTUNG_BESTAETIGT.find((a) => a.id === id)).filter(Boolean) }))
  .filter((g) => g.eintraege.length > 0);

/* Strichgrafiken 96 × 56 – Körper in currentColor, Akzent in Grün. */
const STRICHE = {
  lkw: {
    koerper: ["M8,14 H58 V42 H8 Z", "M58,42 V22 H72 L82,32 V42", "M62,25.5 H70.5 L76,31 H62 Z", "M8,42 H86"],
    raeder: [[22, 45, 5.5], [72, 45, 5.5]],
    akzent: ["M17,20 H49 V36 H17 Z", "M27.7,20 V36 M38.3,20 V36 M17,28 H49"],
  },
  traktoren: {
    koerper: ["M20,32 V8 H44 V32", "M44,24 H76 V40 H44", "M66,24 V14", "M24,12 H40 V24 H24 Z"],
    raeder: [[30, 40, 11], [74, 44, 6.5]],
    akzent: ["M30,36.5 a3.5,3.5 0 1,0 0.01,0", "M50,30 H70"],
  },
  montage: {
    koerper: ["M26,36 C26,20 36,12 48,12 C60,12 70,20 70,36", "M18,36 H78", "M30,36 V41 H66 V36"],
    raeder: [],
    akzent: ["M48,12 V24", "M39,15 V27 M57,15 V27"],
  },
  parkregler: {
    koerper: ["M24,6 H72 V50 H24 Z", "M36,14 V42 M48,14 V42 M60,14 V42"],
    raeder: [],
    akzent: ["M32.5,27 H39.5 V32 H32.5 Z", "M44.5,18 H51.5 V23 H44.5 Z", "M56.5,33 H63.5 V38 H56.5 Z"],
  },
  scada: {
    koerper: ["M10,6 H86 V40 H10 Z", "M42,40 L38,50 H58 L54,40"],
    raeder: [],
    akzent: ["M18,32 L30,25 L40,28 L52,17 L64,21 L78,12"],
  },
};

export function KettenGrafik({ id, start = 0 }) {
  const s = STRICHE[id];
  if (!s) return null;
  const strich = (i) => d(start + i * 120, { "--s04-t": "1.1s" });
  let n = 0;
  return (
    <svg viewBox="0 0 96 56" className="s04m-ill block h-14 w-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2,52 H94" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
      {s.koerper.map((p) => (
        <path key={p} className="s04-zeichne" style={strich(n++)} pathLength="1" d={p} stroke="currentColor" strokeWidth="2" />
      ))}
      {s.raeder.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} className="s04-zeichne" style={strich(n++)} pathLength="1" cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth="2" fill="#fff" />
      ))}
      {s.akzent.map((p) => (
        <path key={p} className="s04-zeichne s04m-akzent" style={strich(n++)} pathLength="1" d={p} stroke="#669933" strokeWidth="2" />
      ))}
    </svg>
  );
}
