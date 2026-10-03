// src/components/ui/w21-aufgang.js
//
// Gezeichnetes Motiv des seitenweiten Abschluss-Handlungsaufrufs (CtaBand, Präfix w21):
// Über einem Modulfeld in Fluchtperspektive geht die Sonne auf – Bahnen und Strahlen zeichnen sich,
// der Horizont zieht von der Sonne nach außen, danach laufen ein paar Energie-Impulse aus der Sonne
// über das Feld nach vorn. Weiterentwicklung des Startseiten-Finales, kompakter für ein Band, das
// auf vielen Seiten steht. Server-Komponente, reines SVG; die Choreografie hängt per CSS an
// `[data-w21-an]` (siehe CtaBand). Ohne JS bzw. bei prefers-reduced-motion steht das fertige Bild.
// Feste Pixelgröße 2400 × 520 (Horizont bei y = 380); Lage und Skalierung kommen aus CSS. Der Himmel
// (Lichthof, Strahlen) darf über den oberen Rand hinaus zeichnen, das Feld ist auf die Breite begrenzt.

const B = 2400;
const H = 520;
const HZ = 380; // Horizont
const VX = B / 2; // Sonne / Fluchtpunkt
const F = 64;
const K = 520; // y = HZ + K / z
const SONNE_R = 92;

const r1 = (v) => Math.round(v * 10) / 10;
const sy = (z) => r1(HZ + K / z);
const sx = (X, z) => r1(VX + (X * F) / z);

const BAHNEN = [132, 182, 246, 326, 424].map((r, i) => ({ key: r, d: `M${VX - r} ${HZ}A${r} ${r} 0 0 1 ${VX + r} ${HZ}`, i }));

const STRAHLEN = Array.from({ length: 15 }, (_, i) => {
  const w = Math.PI + ((i + 1) * Math.PI) / 16;
  const a = SONNE_R + 26;
  const e = 760;
  return {
    key: i,
    d: `M${r1(VX + Math.cos(w) * a)} ${r1(HZ + Math.sin(w) * a)}L${r1(VX + Math.cos(w) * e)} ${r1(HZ + Math.sin(w) * e)}`,
    i: Math.abs(i - 7),
  };
});

// Modultische in wachsender Tiefe; je Tisch Fläche, Zellraster und obere Lichtkante.
const X_MAX = 420;
const TISCHE = [];
{
  let zv = 3.9;
  for (let t = 0; t < 8; t++) {
    const zh = zv * 1.3;
    const schritt = (4 * F) / zh < 6 ? 10 : 5;
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
    zv = zh * 1.12;
  }
}

const IMPULSE = [-30, 12, -8, 26].map((X, i) => ({ key: X, d: `M${sx(X, 60)} ${sy(60)}L${sx(X, 3.9)} ${sy(3.9)}`, i }));

export default function W21Aufgang({ className }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox={`0 0 ${B} ${H}`} width={B} height={H} overflow="visible" className={className}>
      <defs>
        <radialGradient id="w21-c-sonne" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6d6" />
          <stop offset="45%" stopColor="#ffd873" />
          <stop offset="100%" stopColor="#f5a70f" />
        </radialGradient>
        <radialGradient id="w21-c-hof" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffc53d" stopOpacity="0.4" />
          <stop offset="32%" stopColor="#ffc53d" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffc53d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="w21-c-fade" cx={VX} cy={HZ} r="460" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="w21-c-himmelmaske" maskUnits="userSpaceOnUse" x="0" y="-400" width={B} height={HZ + 400}>
          <rect x="0" y="-400" width={B} height={HZ + 400} fill="url(#w21-c-fade)" />
        </mask>
        <linearGradient id="w21-c-horizont" x1="0" x2={B} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffd873" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffd873" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffd873" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="w21-c-modul" x1="0" x2="0" y1={HZ} y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2a68b3" />
          <stop offset="100%" stopColor="#0f3a78" />
        </linearGradient>
        <radialGradient
          id="w21-c-spiegel"
          cx={VX}
          cy={HZ}
          r="520"
          gradientUnits="userSpaceOnUse"
          gradientTransform={`translate(${VX} ${HZ}) scale(1 0.5) translate(${-VX} ${-HZ})`}
        >
          <stop offset="0%" stopColor="#ffe29a" stopOpacity="0.7" />
          <stop offset="35%" stopColor="#ffc53d" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffc53d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="w21-c-boden" x1="0" x2="0" y1={HZ} y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#020b1f" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#020b1f" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="w21-c-seiten" x1="0" x2={B} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#03122b" stopOpacity="1" />
          <stop offset="18%" stopColor="#03122b" stopOpacity="0.35" />
          <stop offset="34%" stopColor="#03122b" stopOpacity="0" />
          <stop offset="66%" stopColor="#03122b" stopOpacity="0" />
          <stop offset="82%" stopColor="#03122b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#03122b" stopOpacity="1" />
        </linearGradient>
        <clipPath id="w21-c-himmel">
          <rect x="0" y="-400" width={B} height={HZ + 400} />
        </clipPath>
        <clipPath id="w21-c-boden-clip">
          <rect x="0" y={HZ} width={B} height={H - HZ + 40} />
        </clipPath>
        <clipPath id="w21-c-tische">
          {TISCHE.map((t) => (
            <path key={t.key} d={t.flaeche} />
          ))}
        </clipPath>
      </defs>

      <g clipPath="url(#w21-c-himmel)">
        <circle className="w21-c-hof" cx={VX} cy={HZ} r="560" fill="url(#w21-c-hof)" />
        <g mask="url(#w21-c-himmelmaske)">
          {STRAHLEN.map((s) => (
            <path key={s.key} className="w21-c-strich w21-c-strahl" style={{ "--w21-k": s.i }} d={s.d} pathLength="1" stroke="#ffd873" strokeOpacity="0.32" strokeWidth="1" />
          ))}
          {BAHNEN.map((b) => (
            <path key={b.key} className="w21-c-strich w21-c-bahn" style={{ "--w21-k": b.i }} d={b.d} pathLength="1" stroke="#fff" strokeOpacity={r1(0.22 - b.i * 0.03)} strokeWidth="1" />
          ))}
        </g>
        <g className="w21-c-sonne">
          <circle cx={VX} cy={HZ} r={SONNE_R} fill="url(#w21-c-sonne)" />
        </g>
      </g>

      <g className="w21-c-feld" clipPath="url(#w21-c-boden-clip)">
        <rect x="0" y={HZ} width={B} height={H - HZ + 40} fill="#041d42" />
        {TISCHE.map((t) => (
          <g key={t.key}>
            <path d={t.flaeche} fill="url(#w21-c-modul)" />
            <path d={t.raster} stroke="#b2cbe9" strokeOpacity="0.34" strokeWidth="1" fill="none" />
            <path d={t.kante} stroke="#d9f0b8" strokeOpacity={r1(0.2 + (7 - t.t) * 0.04)} strokeWidth="1.2" fill="none" />
          </g>
        ))}
        <rect x="0" y={HZ} width={B} height={H - HZ} fill="url(#w21-c-spiegel)" clipPath="url(#w21-c-tische)" />
        <rect x="0" y={HZ} width={B} height={H - HZ + 40} fill="url(#w21-c-boden)" />
        <rect x="0" y={HZ} width={B} height={H - HZ + 40} fill="url(#w21-c-seiten)" />
      </g>

      <path className="w21-c-strich w21-c-horizont" d={`M${VX} ${HZ}H0`} pathLength="1" stroke="url(#w21-c-horizont)" strokeWidth="1.5" fill="none" />
      <path className="w21-c-strich w21-c-horizont" d={`M${VX} ${HZ}H${B}`} pathLength="1" stroke="url(#w21-c-horizont)" strokeWidth="1.5" fill="none" />

      <g>
        {IMPULSE.map((p) => (
          <path key={p.key} className="w21-c-impuls" style={{ "--w21-k": p.i }} d={p.d} pathLength="1" stroke="#ffd873" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        ))}
      </g>
    </svg>
  );
}
