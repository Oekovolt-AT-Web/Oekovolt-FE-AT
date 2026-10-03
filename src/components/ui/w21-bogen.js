// src/components/ui/w21-bogen.js
//
// Signatur-Linie der Seitenköpfe (Präfix w21): ein ruhiger Tagesbogen, der aus dem Horizont am
// Fuß des Seitenkopfs aufsteigt – die kleine Schwester der Sonnenbahn der Startseite.
// Beim Laden zeichnet sich der zurückgelegte Weg als Lichtlinie, die Sonne zieht mit und kommt
// kurz nach dem Zenit (18°, Anteil 0,6 des Bogens) zur Ruhe; der restliche Tag liegt gestrichelt dahinter, Stundenmarken alle 15°.
// Geometrie in einem 200er-Quadrat (nur obere Hälfte sichtbar). Größe/Lage kommen aus CSS
// (.w21-k-bogen in PageHero). Rein dekorativ, ohne JS, Koordinaten gerundet.

const rd = (v) => Math.round(v * 100) / 100;
const M = 100;
const R = 98;
const BOGEN = `M${M - R} ${M}A${R} ${R} 0 0 1 ${M + R} ${M}`;

const MARKEN = Array.from({ length: 13 }, (_, i) => {
  const w = ((-90 + i * 15) * Math.PI) / 180;
  const lang = i % 6 === 0 ? 3.2 : i % 3 === 0 ? 2.2 : 1.3;
  const s = Math.sin(w);
  const c = Math.cos(w);
  return { d: `M${rd(M + s * (R + 1.6))} ${rd(M - c * (R + 1.6))}L${rd(M + s * (R + 1.6 + lang))} ${rd(M - c * (R + 1.6 + lang))}`, i };
});

export default function W21Bogen({ id = "w21-k" }) {
  const farbe = "#ffffff";
  const weg = "#aed083";
  const spitze = "#ffd873";
  return (
    <div aria-hidden="true" className="w21-k-bogen pointer-events-none absolute">
      <svg viewBox="0 0 200 100" className="h-full w-full overflow-visible" focusable="false">
        <defs>
          {/* links weich ausgeblendet – der Bogen tritt hinter dem Text zurück */}
          <linearGradient id={`${id}-rest`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="0">
            <stop offset="0" stopColor={farbe} stopOpacity="0" />
            <stop offset="0.45" stopColor={farbe} stopOpacity="0.2" />
            <stop offset="1" stopColor={farbe} stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id={`${id}-weg`} gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="132" y2="0">
            <stop offset="0" stopColor={weg} stopOpacity="0" />
            <stop offset="0.6" stopColor={weg} stopOpacity="0.75" />
            <stop offset="1" stopColor={spitze} stopOpacity="1" />
          </linearGradient>
          <radialGradient id={`${id}-glut`}>
            <stop offset="0" stopColor="#fff1c4" stopOpacity="0.95" />
            <stop offset="0.18" stopColor="#ffc53d" stopOpacity="0.5" />
            <stop offset="0.55" stopColor="#ffc53d" stopOpacity="0.12" />
            <stop offset="1" stopColor="#ffc53d" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path d={BOGEN} className="w21-k-rest" fill="none" stroke={`url(#${id}-rest)`} strokeWidth="1" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
        <g className="w21-k-rest" stroke={`url(#${id}-rest)`} strokeWidth="1" strokeLinecap="round">
          {MARKEN.map((m) => (
            <path key={m.i} d={m.d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        {/* zurückgelegter Weg: breiter schwacher Schein + feine Lichtlinie (ohne Filter). Bewusst ohne
            non-scaling-stroke – sonst ignoriert Chrome pathLength beim Strichmuster. */}
        <path d={BOGEN} pathLength="1" className="w21-k-weg" fill="none" stroke={`url(#${id}-weg)`} strokeOpacity="0.14" strokeWidth="1.8" strokeLinecap="round" />
        <path d={BOGEN} pathLength="1" className="w21-k-weg" fill="none" stroke={`url(#${id}-weg)`} strokeWidth="0.42" strokeLinecap="round" />
        <g className="w21-k-sonne">
          <circle cx={M} cy={M - R} r="11" fill={`url(#${id}-glut)`} className="w21-k-glut" />
          <circle cx={M} cy={M - R} r="1.5" fill="#fff6dc" />
        </g>
      </svg>
    </div>
  );
}
