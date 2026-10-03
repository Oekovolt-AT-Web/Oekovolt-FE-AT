// src/components/Startseite/s01-sonnenbahn.js
//
// Signatur-Grafik des Heros (Präfix s01): die Sonnenbahn über dem Hallendach.
// Ein Halbkreis (Tagesbogen 6–18 Uhr, Stundenmarken alle 15°). Beim Laden zieht die Sonne
// vom Horizont auf ihre Position und zeichnet dabei ihren zurückgelegten Weg als Lichtlinie;
// der Rest des Tages liegt gestrichelt dahinter. Desktop: großer Bogen über der ganzen Bühne,
// Mittagssonne in der Fuge zwischen Claim und Rechner, rechte Hälfte leuchtet weich durch das
// Glas des Rechners. Mobil: kleiner Sonnenaufgang über der Rechnerkarte.
// Geometrie in einem 200er-Quadrat; Größe, Lage, Sonnenwinkel und Verläufe kommen aus CSS
// (--s01-r, --s01-w, --s01-f je Breakpoint, siehe S01Hero). Rein dekorativ.

const rd = (v) => Math.round(v * 100) / 100;
const M = 100; // Mittelpunkt
const R = 98; // Bogenradius
const BOGEN = `M${M - R} ${M}A${R} ${R} 0 0 1 ${M + R} ${M}`;

// Stundenmarken: 13 Marken von 6 bis 18 Uhr (je 15°), Mittag und Randstunden etwas länger
const MARKEN = Array.from({ length: 13 }, (_, i) => {
  const w = ((-90 + i * 15) * Math.PI) / 180;
  const lang = i % 6 === 0 ? 3 : i % 3 === 0 ? 2 : 1.2;
  const s = Math.sin(w);
  const c = Math.cos(w);
  return { d: `M${rd(M + s * (R + 1.4))} ${rd(M - c * (R + 1.4))}L${rd(M + s * (R + 1.4 + lang))} ${rd(M - c * (R + 1.4 + lang))}`, i };
});

/** Horizontaler Verlauf entlang x (Nutzerkoordinaten) – blendet den Bogen unter dem Text aus. */
function Verlauf({ id, von, bis, farbe = "#fff", deckung = 1, spitze }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={von} y1="0" x2={bis} y2="0">
      <stop offset="0" stopColor={farbe} stopOpacity="0" />
      <stop offset="0.7" stopColor={farbe} stopOpacity={deckung * 0.85} />
      <stop offset="1" stopColor={spitze || farbe} stopOpacity={deckung} />
    </linearGradient>
  );
}

export default function S01Sonnenbahn() {
  return (
    <div aria-hidden="true" className="s01-bahn pointer-events-none absolute">
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" focusable="false">
        <defs>
          {/* mobil: Sonne bei −30°, Weg von links bis x≈51 */}
          <Verlauf id="s01-weg-m" von={4} bis={52} farbe="#aed083" spitze="#ffd873" />
          <Verlauf id="s01-rest-m" von={0} bis={30} deckung={0.3} />
          {/* Desktop: Mittagssonne bei x=100; links unter dem Text ausgeblendet */}
          <Verlauf id="s01-weg-d" von={72} bis={100} farbe="#aed083" spitze="#ffd873" />
          <Verlauf id="s01-rest-d" von={80} bis={97} deckung={0.34} />
          <radialGradient id="s01-sonne-glut">
            <stop offset="0" stopColor="#fff1c4" stopOpacity="0.95" />
            <stop offset="0.16" stopColor="#ffc53d" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#ffc53d" stopOpacity="0.13" />
            <stop offset="1" stopColor="#ffc53d" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* restlicher Tagesbogen, gestrichelt, und Stundenmarken */}
        <path d={BOGEN} className="s01-bahn-rest s01-bahn-linie" fill="none" strokeWidth="1" strokeDasharray="2 5" vectorEffect="non-scaling-stroke" />
        <g className="s01-bahn-rest s01-bahn-linie" strokeWidth="1" strokeLinecap="round">
          {MARKEN.map((m) => (
            <path key={m.i} d={m.d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        {/* zurückgelegter Weg der Sonne – zeichnet sich synchron zur Sonne; zwei breite, schwache
            Striche darunter ergeben den Lichtschein (ohne Filter) */}
        <path d={BOGEN} pathLength="1" className="s01-bahn-weg" fill="none" strokeOpacity="0.07" strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={BOGEN} pathLength="1" className="s01-bahn-weg" fill="none" strokeOpacity="0.16" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={BOGEN} pathLength="1" className="s01-bahn-weg" fill="none" strokeWidth="1.75" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {/* Sonne: dreht um den Mittelpunkt vom Horizont auf ihren Winkel */}
        <g className="s01-bahn-sonne">
          <circle cx={M} cy={M - R} r="16" fill="url(#s01-sonne-glut)" className="s01-bahn-glut" />
          <circle cx={M} cy={M - R} r="5" fill="none" stroke="#ffe6a3" strokeOpacity="0.28" strokeWidth="1" vectorEffect="non-scaling-stroke" className="s01-bahn-ring" />
          <circle cx={M} cy={M - R} r="2.3" fill="#fff6dc" className="s01-bahn-kern" />
        </g>
      </svg>
    </div>
  );
}
