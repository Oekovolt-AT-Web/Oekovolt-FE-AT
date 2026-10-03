// src/components/Startseite/s10-sonnenfeld.js
//
// Gezeichnetes Finale-Motiv für den Abschluss (Server-Komponente, reines SVG):
// Die Sonne geht hinter dem Horizont über einem Modulfeld in Fluchtperspektive auf, Bahnen und
// Strahlen zeichnen sich, danach laufen vereinzelt Energie-Impulse aus der Sonne über das Feld
// zum Betrachter. Die Choreografie hängt per CSS an `[data-s10-an]` (siehe S12Abschluss.js);
// ohne JS bzw. bei prefers-reduced-motion steht das fertige Bild.
// Das SVG darf über seinen Rahmen hinaus zeichnen (overflow visible): Strahlen und Bahnen laufen
// weich ausgeblendet hinter den Text. Koordinaten auf Modulebene berechnet und gerundet.

const B = 1440;
const H = 600;
const HORIZONT = 300;
const VX = B / 2;
const F = 62; // Brennweite der Feldperspektive
const TIEFE_K = 900; // y = HORIZONT + TIEFE_K / z  (z = 3 → Unterkante)
const SONNE_R = 118;

const r1 = (v) => Math.round(v * 10) / 10;
const sy = (z) => r1(HORIZONT + TIEFE_K / z);
const sx = (X, z) => r1(VX + (X * F) / z);

// Bahnen um die Sonne (Halbkreise über dem Horizont)
const BAHNEN = [168, 228, 304, 398, 512].map((r, i) => ({
  key: r,
  d: `M${VX - r} ${HORIZONT}A${r} ${r} 0 0 1 ${VX + r} ${HORIZONT}`,
  i,
}));

// Strahlen (obere Halbebene), außen per Maske ausgeblendet
const STRAHLEN = Array.from({ length: 17 }, (_, i) => {
  const w = Math.PI + ((i + 1) * Math.PI) / 18;
  const a = SONNE_R + 30;
  const e = 900;
  return {
    key: i,
    d: `M${r1(VX + Math.cos(w) * a)} ${r1(HORIZONT + Math.sin(w) * a)}L${r1(VX + Math.cos(w) * e)} ${r1(HORIZONT + Math.sin(w) * e)}`,
    i: Math.abs(i - 8),
  };
});

// Modultische: Reihen in wachsender Tiefe, je Tisch zwei Modulreihen mit Zellraster.
// Nur sichtbare Linien erzeugen, in der Ferne gröber (hält das SVG schlank).
const X_MAX = 240;
const TISCHE = [];
{
  let zv = 2.9;
  for (let t = 0; t < 9; t++) {
    const zh = zv * 1.32;
    const abstand = (4 * F) / zh; // Zellbreite in px an der Hinterkante
    const schritt = abstand < 5 ? 8 : 4;
    let raster = "";
    for (let X = -X_MAX; X <= X_MAX; X += schritt) {
      const xa = sx(X, zv);
      const xb = sx(X, zh);
      if ((xa < -40 && xb < -40) || (xa > B + 40 && xb > B + 40)) continue;
      raster += `M${xa} ${sy(zv)}L${xb} ${sy(zh)}`;
    }
    const mitte = Math.sqrt(zv * zh);
    raster += `M${sx(-X_MAX, mitte)} ${sy(mitte)}L${sx(X_MAX, mitte)} ${sy(mitte)}`;
    TISCHE.push({
      key: t,
      flaeche: `M${sx(-X_MAX, zv)} ${sy(zv)}L${sx(X_MAX, zv)} ${sy(zv)}L${sx(X_MAX, zh)} ${sy(zh)}L${sx(-X_MAX, zh)} ${sy(zh)}Z`,
      kante: `M${sx(-X_MAX, zh)} ${sy(zh)}L${sx(X_MAX, zh)} ${sy(zh)}`,
      raster,
      t,
    });
    zv = zh * 1.1;
  }
}

// Energie-Impulse: aus der Sonne über das Feld nach vorn
const IMPULSE = [-26, 9, -11, 24, -2].map((X, i) => ({
  key: X,
  d: `M${sx(X, 60)} ${sy(60)}L${sx(X, 2.9)} ${sy(2.9)}`,
  i,
}));

export default function S10Sonnenfeld({ className }) {
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${B} ${H}`} preserveAspectRatio="xMidYMid slice" overflow="visible" className={className}>
      <defs>
        <radialGradient id="s10-e-sonne" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6d6" />
          <stop offset="45%" stopColor="#ffd873" />
          <stop offset="100%" stopColor="#f5a70f" />
        </radialGradient>
        <radialGradient id="s10-e-hof" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffc53d" stopOpacity="0.42" />
          <stop offset="30%" stopColor="#ffc53d" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffc53d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="s10-e-fade" cx={VX} cy={HORIZONT} r="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="s10-e-himmelmaske" maskUnits="userSpaceOnUse" x="-400" y="-700" width={B + 800} height={HORIZONT + 700}>
          <rect x="-400" y="-700" width={B + 800} height={HORIZONT + 700} fill="url(#s10-e-fade)" />
        </mask>
        <linearGradient id="s10-e-horizont" x1="0" x2={B} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffd873" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffd873" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffd873" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="s10-e-modul" x1="0" x2="0" y1={HORIZONT} y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2a68b3" />
          <stop offset="100%" stopColor="#0f3a78" />
        </linearGradient>
        <radialGradient
          id="s10-e-spiegel"
          cx={VX}
          cy={HORIZONT}
          r="560"
          gradientUnits="userSpaceOnUse"
          gradientTransform={`translate(${VX} ${HORIZONT}) scale(1 0.62) translate(${-VX} ${-HORIZONT})`}
        >
          <stop offset="0%" stopColor="#ffe29a" stopOpacity="0.75" />
          <stop offset="35%" stopColor="#ffc53d" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffc53d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s10-e-boden" x1="0" x2="0" y1={HORIZONT} y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#020b1f" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#020b1f" stopOpacity="0.85" />
        </linearGradient>
        <clipPath id="s10-e-himmel">
          <rect x="-400" y="-700" width={B + 800} height={HORIZONT + 700} />
        </clipPath>
        <clipPath id="s10-e-tische">
          {TISCHE.map((t) => (
            <path key={t.key} d={t.flaeche} />
          ))}
        </clipPath>
      </defs>

      {/* Himmel: Lichthof, Strahlen, Bahnen, Sonne */}
      <g clipPath="url(#s10-e-himmel)">
        <circle className="s10-e-hof" cx={VX} cy={HORIZONT} r="620" fill="url(#s10-e-hof)" />
        <g mask="url(#s10-e-himmelmaske)">
          {STRAHLEN.map((s) => (
            <path key={s.key} className="s10-e-strich s10-e-strahl" style={{ "--s10-k": s.i }} d={s.d} pathLength="1" stroke="#ffd873" strokeOpacity="0.34" strokeWidth="1" />
          ))}
          {BAHNEN.map((b) => (
            <path key={b.key} className="s10-e-strich s10-e-bahn" style={{ "--s10-k": b.i }} d={b.d} pathLength="1" stroke="#fff" strokeOpacity={r1(0.2 - b.i * 0.025)} strokeWidth="1" />
          ))}
        </g>
        <g className="s10-e-sonne">
          <circle cx={VX} cy={HORIZONT} r={SONNE_R} fill="url(#s10-e-sonne)" />
        </g>
      </g>

      {/* Boden und Modulfeld */}
      <g className="s10-e-feld">
        <rect x="-400" y={HORIZONT} width={B + 800} height={H - HORIZONT + 200} fill="#041d42" />
        {TISCHE.map((t) => (
          <g key={t.key}>
            <path d={t.flaeche} fill="url(#s10-e-modul)" />
            <path d={t.raster} stroke="#b2cbe9" strokeOpacity="0.38" strokeWidth="1" fill="none" />
            <path d={t.kante} stroke="#d9f0b8" strokeOpacity={r1(0.2 + (8 - t.t) * 0.04)} strokeWidth="1.2" fill="none" />
          </g>
        ))}
        <rect x="0" y={HORIZONT} width={B} height={H - HORIZONT} fill="url(#s10-e-spiegel)" clipPath="url(#s10-e-tische)" />
        <rect x="-400" y={HORIZONT} width={B + 800} height={H - HORIZONT + 200} fill="url(#s10-e-boden)" />
      </g>

      {/* Horizont zeichnet sich von der Mitte nach außen */}
      <path className="s10-e-strich s10-e-horizont" d={`M${VX} ${HORIZONT}H0`} pathLength="1" stroke="url(#s10-e-horizont)" strokeWidth="1.5" />
      <path className="s10-e-strich s10-e-horizont" d={`M${VX} ${HORIZONT}H${B}`} pathLength="1" stroke="url(#s10-e-horizont)" strokeWidth="1.5" />

      {/* Energie-Impulse (nur mit Bewegung sichtbar) */}
      <g>
        {IMPULSE.map((p) => (
          <path key={p.key} className="s10-e-impuls" style={{ "--s10-k": p.i }} d={p.d} pathLength="1" stroke="#ffd873" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        ))}
      </g>
    </svg>
  );
}
