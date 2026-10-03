// src/components/Loesungen/w25-AgriSzenen.js
//
// Gezeichnete Agri-PV-Querschnitte für AgriKonzepte (/agri-pv), im Stil der TV-Folie 07:
// vertikal bifazial zwischen Grünland- und Ackerstreifen, hoch aufgeständert über Obstbäumen,
// einachsig nachgeführt über Feldfrüchten. Raster 1000 × 470, Boden bei y = 400.
// Licht und Bewegung hängen an CSS-Variablen, die AgriKonzepte pro Bild setzt (Tageslauf):
//   --w25a-ost / --w25a-west (Seitenlicht), --w25a-tag (Helligkeit), --w25a-dreh (Tracker-Winkel, Grad),
//   --w25a-schatten (Schattenversatz, px), --w25a-sx (Sonne x).
// Aufbau-Animationen (Klassen w25a-wachs/-fall/-spross) laufen bei jedem Konzeptwechsel neu.
// Klassen und IDs: Präfix w25a. Koordinaten gerundet (Hydration-sicher).

export const W25A_BODEN = 400;
export const W25A_MODULE_HOCH = [];

const G = W25A_BODEN;
const rd = (v) => Math.round(v * 10) / 10;
const zufall = (k) => {
  const v = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const verz = (ms) => ({ animationDelay: `${ms}ms` });

/* ---------- gemeinsame Bausteine ---------- */

function Halme({ x0, x1, seed, art, leise }) {
  if (art === "gras") {
    const n = Math.max(6, Math.round((x1 - x0) / 9));
    let a = "";
    let b = "";
    for (let k = 0; k < n; k++) {
      const x = x0 + 3 + (k * (x1 - x0 - 6)) / (n - 1) + (zufall(seed + k) - 0.5) * 4;
      const h = 12 + 15 * zufall(seed + k * 3 + 1);
      const neig = (zufall(seed + k * 7 + 2) - 0.5) * 10;
      const d = `M${rd(x)} ${G}Q${rd(x + neig * 0.2)} ${rd(G - h * 0.6)} ${rd(x + neig)} ${rd(G - h)}`;
      if (k % 2) a += d;
      else b += d;
    }
    return (
      <g opacity={leise ? 0.45 : 1}>
        <g className="w25a-wiegen" style={verz(-seed * 300)}>
          <path d={a} fill="none" stroke="#8cba58" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <g className="w25a-wiegen" style={verz(-seed * 300 - 1700)}>
          <path d={b} fill="none" stroke="#8cba58" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
        </g>
      </g>
    );
  }
  // Getreide mit Ähren
  const n = Math.max(4, Math.round((x1 - x0) / 17));
  const teile = [
    { weg: "", aehren: [] },
    { weg: "", aehren: [] },
  ];
  for (let k = 0; k < n; k++) {
    const x = x0 + 7 + (k * (x1 - x0 - 14)) / (n - 1);
    const h = 40 + 13 * zufall(seed + k * 5 + 3);
    const neig = (zufall(seed + k * 11 + 4) - 0.5) * 7;
    const top = G - h;
    const t = teile[k % 2];
    t.weg += `M${rd(x)} ${G}Q${rd(x + neig * 0.2)} ${rd(G - h * 0.55)} ${rd(x + neig)} ${rd(top)}`;
    const s = k % 2 ? 1 : -1;
    t.weg += `M${rd(x + neig * 0.15)} ${rd(G - h * 0.35)}q${s * 6} -3 ${s * 11} -12`;
    t.aehren.push({ x: rd(x + neig * 1.1), y: rd(top - 7), r: rd(neig * 1.4) });
  }
  return (
    <g opacity={leise ? 0.45 : 1}>
      {teile.map((t, ti) => (
        <g key={ti} className="w25a-wiegen" style={verz(-(seed * 500 + ti * 1900))}>
          <path d={t.weg} fill="none" stroke="#aed083" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          {t.aehren.map((a) => (
            <ellipse key={a.x} cx={a.x} cy={a.y} rx="3.6" ry="9" fill="#ffc53d" opacity="0.85" transform={`rotate(${a.r} ${a.x} ${a.y})`} />
          ))}
        </g>
      ))}
    </g>
  );
}

/** Aufsteigende Energiefunken; Sichtbarkeit über eine CSS-Variable (z. B. var(--w25a-ost)). */
function Funken({ x, y, licht, versatz = 0 }) {
  return (
    <g style={{ opacity: licht }}>
      {[0, 1].map((j) => (
        <g key={j} className="w25a-funke" style={verz(versatz + j * 1150)}>
          <circle cx={x} cy={y} r="9" fill="#ffc53d" opacity="0.35" />
          <circle cx={x} cy={y} r="4.2" fill="#ffc53d" />
          <circle cx={x} cy={y} r="2" fill="#fffbea" />
        </g>
      ))}
    </g>
  );
}

function Mass({ x1, x2, y, vertikal }) {
  if (vertikal) {
    return <path d={`M${x1} ${y}V${x2}M${x1 - 6} ${y}h12M${x1 - 6} ${x2}h12`} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />;
  }
  return <path d={`M${x1} ${y}H${x2}M${x1} ${y - 6}v12M${x2} ${y - 6}v12`} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />;
}

/* ================= Vertikal bifazial ================= */
const REIHEN_V = [150, 330, 510, 690, 870];
const MV = { oben: 286, unten: 378, halb: 8, tiefe: 22 };
const STREIFEN_V = [
  { x0: 172, x1: 308, art: "gras" },
  { x0: 352, x1: 488, art: "acker" },
  { x0: 532, x1: 668, art: "gras" },
  { x0: 712, x1: 848, art: "acker" },
  { x0: 40, x1: 128, art: "acker", leise: true },
  { x0: 892, x1: 975, art: "gras", leise: true },
];

function Traktor({ x }) {
  // schlichte Silhouette, nach links fahrend
  return (
    <g transform={`translate(${x} ${G})`} opacity="0.9">
      <path d="M-34 -22H14V-8H-34Z" fill="#2c4a73" stroke="#d6e2f0" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M-4 -22V-50H22L26 -22" fill="rgba(214,226,240,0.12)" stroke="#d6e2f0" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M-30 -22V-30" stroke="#d6e2f0" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="14" cy="-14" r="14" fill="#03122b" stroke="#d6e2f0" strokeWidth="2" />
      <circle cx="14" cy="-14" r="5" fill="#d6e2f0" opacity="0.6" />
      <circle cx="-24" cy="-8" r="8" fill="#03122b" stroke="#d6e2f0" strokeWidth="2" />
    </g>
  );
}

export function SzeneVertikal() {
  const h = MV.unten - MV.oben;
  return (
    <g>
      {/* hintere Modulkanten (Tiefe) */}
      {REIHEN_V.map((rx, r) => (
        <g key={`t${rx}`} opacity="0.3">
          <g className="w25a-hoch" style={verz(200 + r * 90)}>
            <rect x={rx + MV.tiefe - MV.halb} y={MV.oben - 18} width={MV.halb * 2} height={h} rx="2" fill="#12408a" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <rect x={rx + MV.tiefe - 2} y={MV.unten - 18} width="4" height={G - MV.unten} fill="#d6e2f0" />
          </g>
        </g>
      ))}
      {STREIFEN_V.map((s, si) => (
        <g key={si} className="w25a-wachs" style={verz(300 + (si % 4) * 110)}>
          <Halme {...s} seed={si * 37 + 5} />
        </g>
      ))}
      <g className="w25a-rein" style={verz(900)}>
        <Traktor x={598} />
      </g>
      {REIHEN_V.map((rx, r) => {
        const { oben, unten, halb } = MV;
        let zellen = "";
        for (let z = 1; z < 8; z++) zellen += `M${rx - halb} ${rd(oben + (z * h) / 8)}H${rx + halb}`;
        return (
          <g key={rx} className="w25a-hoch" style={verz(250 + r * 100)}>
            <g style={{ opacity: "var(--w25a-ost)" }}>
              <path d={`M${rx - halb} ${oben - 22}A50 ${h / 2 + 22} 0 0 0 ${rx - halb} ${unten + 22}Z`} fill="url(#w25a-halo-l)" />
            </g>
            <g style={{ opacity: "var(--w25a-west)" }}>
              <path d={`M${rx + halb} ${oben - 22}A50 ${h / 2 + 22} 0 0 1 ${rx + halb} ${unten + 22}Z`} fill="url(#w25a-halo-r)" />
            </g>
            <rect x={rx - 2.5} y={unten} width="5" height={G - unten} fill="#d6e2f0" opacity="0.75" />
            <polygon points={`${rx - halb},${oben} ${rx + halb},${oben} ${rx + halb + MV.tiefe},${oben - 18} ${rx - halb + MV.tiefe},${oben - 18}`} fill="rgba(127,167,214,0.16)" stroke="rgba(255,255,255,0.28)" strokeWidth="1" strokeLinejoin="round" />
            <rect x={rx - halb} y={oben} width={halb * 2} height={h} rx="2" fill="url(#w25a-modul)" />
            <path d={zellen} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <rect x={rx - halb} y={oben} width={halb} height={h} rx="2" fill="url(#w25a-glanz)" style={{ opacity: "var(--w25a-ost)" }} />
            <rect x={rx} y={oben} width={halb} height={h} rx="2" fill="url(#w25a-glanz)" style={{ opacity: "var(--w25a-west)" }} />
            <rect x={rx - halb} y={oben} width={halb * 2} height={h} rx="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            <line x1={rx} x2={rx} y1={oben + 2} y2={unten - 2} stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
            <Funken x={rx - 5} y={oben - 10} licht="var(--w25a-ost)" versatz={r * 330} />
            <Funken x={rx + 5} y={oben - 10} licht="var(--w25a-west)" versatz={r * 330 + 600} />
          </g>
        );
      })}
      <g className="w25a-rein" style={verz(1100)}>
        <Mass x1={REIHEN_V[1] + 12} x2={REIHEN_V[2] - 12} y={428} />
      </g>
    </g>
  );
}

/* ================= Hoch aufgeständert ================= */
const DACH = { x0: 110, x1: 890, v: 196, h: 174, tiefe: 24, n: 12 };
const PFOSTEN = [118, 378, 638, 882];
const BAEUME = [183, 313, 443, 573, 703, 833];
const BAEUME_HINTEN = [248, 508, 768];
const MOD_B = (DACH.x1 - DACH.x0) / DACH.n;
const MODULE_HOCH = Array.from({ length: DACH.n }, (_, k) => {
  const x0 = DACH.x0 + k * MOD_B + 1.5;
  const w = MOD_B - 3;
  const pts = `${rd(x0)},${DACH.v} ${rd(x0 + w)},${DACH.v} ${rd(x0 + w + DACH.tiefe)},${DACH.h} ${rd(x0 + DACH.tiefe)},${DACH.h}`;
  let zellen = "";
  for (let j = 1; j < 6; j++) {
    const xj = x0 + (j * w) / 6;
    zellen += `M${rd(xj)} ${DACH.v}L${rd(xj + DACH.tiefe)} ${DACH.h}`;
  }
  zellen += `M${rd(x0 + DACH.tiefe / 2)} ${(DACH.v + DACH.h) / 2}H${rd(x0 + w + DACH.tiefe / 2)}`;
  return { pts, zellen, mitte: rd(x0 + w / 2 + DACH.tiefe / 2), kante: `M${rd(x0 + DACH.tiefe)} ${DACH.h}H${rd(x0 + w + DACH.tiefe)}` };
});
MODULE_HOCH.forEach((m) => W25A_MODULE_HOCH.push(m.mitte));

function Baum({ s = 1 }) {
  const krone = [
    [-22, -66, 22],
    [21, -68, 24],
    [0, -88, 27],
    [-3, -58, 22],
    [10, -52, 18],
  ]
    .map(([cx, cy, r]) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`)
    .join("");
  return (
    <g transform={`scale(${s})`}>
      <path d="M0 0V-50M0-26L-15-44M0-32L13-48" fill="none" stroke="rgba(214,226,240,0.55)" strokeWidth="4" strokeLinecap="round" />
      <path d={krone} fill="url(#w25a-krone)" />
      <path d="M-24 -80a24 24 0 0 1 30 -24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="3" strokeLinecap="round" />
      {[
        [-18, -62],
        [16, -72],
        [4, -94],
        [-4, -48],
        [24, -54],
      ].map(([fx, fy]) => (
        <circle key={`${fx}${fy}`} cx={fx} cy={fy} r="4.6" fill="#ef7a5c" />
      ))}
    </g>
  );
}

export function SzeneHoch({ modulRefs }) {
  return (
    <g>
      {/* hintere Stützen und Bäume */}
      {PFOSTEN.map((p, i) => (
        <rect key={`hp${p}`} x={p + DACH.tiefe - 2} y={DACH.h} width="4" height={G - 22 - DACH.h} fill="#d6e2f0" opacity="0.3" className="w25a-wachs" style={verz(150 + i * 80)} />
      ))}
      {BAEUME_HINTEN.map((bx, i) => (
        <g key={`hb${bx}`} transform={`translate(${bx + 14} ${G - 22})`} opacity="0.34">
          <g className="w25a-spross" style={verz(650 + i * 90)}>
            <Baum s={0.74} />
          </g>
        </g>
      ))}
      {/* Hagelnetz zusätzlich (gestrichelt unter dem Dach) */}
      <g className="w25a-rein" style={verz(1150)}>
        {PFOSTEN.slice(0, -1).map((p, i) => (
          <path key={p} d={`M${p + 4} ${DACH.v + 26}Q${(p + PFOSTEN[i + 1]) / 2} ${DACH.v + 44} ${PFOSTEN[i + 1] - 4} ${DACH.v + 26}`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeDasharray="3 4" />
        ))}
      </g>
      {/* vordere Stützen mit Kopfbändern */}
      {PFOSTEN.map((p, i) => (
        <g key={`p${p}`}>
          <rect x={p - 3} y={DACH.v + 6} width="6" height={G - DACH.v - 6} rx="1.5" fill="#d6e2f0" opacity="0.8" className="w25a-wachs" style={verz(200 + i * 80)} />
          <path
            d={`${i > 0 ? `M${p} ${DACH.v + 40}L${p - 30} ${DACH.v + 8}` : ""}${i < PFOSTEN.length - 1 ? `M${p} ${DACH.v + 40}L${p + 30} ${DACH.v + 8}` : ""}`}
            fill="none"
            stroke="rgba(214,226,240,0.55)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="w25a-rein"
            style={verz(550 + i * 80)}
          />
        </g>
      ))}
      <rect x={DACH.x0 - 4} y={DACH.v} width={DACH.x1 - DACH.x0 + 8} height="7" rx="2" fill="#d6e2f0" opacity="0.7" className="w25a-quer" style={verz(450)} />
      {BAEUME.map((bx, i) => (
        <g key={`b${bx}`} transform={`translate(${bx} ${G})`}>
          <g className="w25a-spross" style={verz(700 + i * 80)}>
            <g className="w25a-atem" style={verz(-((i * 1700) % 5200))}>
              <Baum />
            </g>
          </g>
        </g>
      ))}
      {/* Moduldach */}
      {MODULE_HOCH.map((m, k) => (
        <g key={k} className="w25a-fall" style={verz(500 + k * 45)}>
          <polygon points={m.pts} fill="url(#w25a-modul-dach)" />
          <polygon points={m.pts} fill="url(#w25a-glanz)" style={{ opacity: "calc(var(--w25a-tag) * 0.18)" }} />
          <polygon
            ref={(el) => {
              if (modulRefs) modulRefs.current[k] = el;
            }}
            points={m.pts}
            fill="url(#w25a-glanz)"
            stroke="#ffc53d"
            strokeWidth="1.5"
            strokeLinejoin="round"
            style={{ opacity: 0 }}
          />
          <path d={m.zellen} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <polygon points={m.pts} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinejoin="round" />
          <path d={m.kante} stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
        </g>
      ))}
      {/* Energieimpulse über dem Modul unter der Sonne */}
      <g style={{ transform: "translateX(calc(var(--w25a-sx) * 1px))", opacity: "var(--w25a-tag)" }}>
        <Funken x={-8} y={DACH.h - 8} licht="1" versatz={0} />
        <Funken x={10} y={DACH.h - 8} licht="1" versatz={600} />
      </g>
      <g className="w25a-rein" style={verz(1100)}>
        <Mass x1={248} x2={DACH.v + 9} y={G} vertikal />
      </g>
    </g>
  );
}

/* ================= Nachgeführt ================= */
const TRACKER = [170, 390, 610, 830];
const ACHSE = 300;
const STREIFEN_T = [
  { x0: 40, x1: 120, art: "gras", leise: true },
  { x0: 222, x1: 338, art: "acker" },
  { x0: 442, x1: 558, art: "gras" },
  { x0: 662, x1: 778, art: "acker" },
  { x0: 880, x1: 970, art: "gras", leise: true },
];

export function SzeneTracker() {
  return (
    <g>
      {/* Schatten am Boden wandert mit der Sonne */}
      {TRACKER.map((x) => (
        <g key={`s${x}`} style={{ transform: "translateX(calc(var(--w25a-schatten) * 1px))", opacity: "calc(var(--w25a-tag) * 0.9)" }}>
          <ellipse cx={x} cy={G + 2} rx="66" ry="6" fill="#01060f" opacity="0.55" />
        </g>
      ))}
      {STREIFEN_T.map((s, si) => (
        <g key={si} className="w25a-wachs" style={verz(300 + si * 100)}>
          <Halme {...s} seed={si * 41 + 9} />
        </g>
      ))}
      {TRACKER.map((x, i) => {
        let zellen = "";
        for (let z = 1; z < 8; z++) zellen += `M${x - 75 + z * 18.75} ${ACHSE - 5}V${ACHSE + 5}`;
        return (
          <g key={x}>
            <rect x={x - 3.5} y={ACHSE} width="7" height={G - ACHSE} rx="1.5" fill="#d6e2f0" opacity="0.8" className="w25a-wachs" style={verz(200 + i * 90)} />
            <g className="w25a-fall" style={verz(550 + i * 90)}>
              <g className="w25a-dreh" style={{ transformOrigin: `${x}px ${ACHSE}px` }}>
                <rect x={x - 75} y={ACHSE - 6} width="150" height="10" rx="2" fill="url(#w25a-modul)" />
                <rect x={x - 75} y={ACHSE - 6} width="150" height="10" rx="2" fill="url(#w25a-glanz)" style={{ opacity: "calc(var(--w25a-tag) * 0.55)" }} />
                <path d={zellen} stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                <rect x={x - 75} y={ACHSE - 6} width="150" height="10" rx="2" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
                <Funken x={x - 20} y={ACHSE - 16} licht="var(--w25a-tag)" versatz={i * 420} />
                <Funken x={x + 24} y={ACHSE - 16} licht="var(--w25a-tag)" versatz={i * 420 + 700} />
              </g>
              <circle cx={x} cy={ACHSE} r="6" fill="#03122b" stroke="#d6e2f0" strokeWidth="2" />
            </g>
          </g>
        );
      })}
      {/* Schwenkbereich am ersten Tracker */}
      <g className="w25a-rein" style={verz(1200)}>
        <path d={`M${rd(TRACKER[1] - 95 * Math.cos(Math.PI * 0.2))} ${rd(ACHSE - 95 * Math.sin(Math.PI * 0.2))}A95 95 0 0 1 ${rd(TRACKER[1] + 95 * Math.cos(Math.PI * 0.2))} ${rd(ACHSE - 95 * Math.sin(Math.PI * 0.2))}`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeDasharray="3 5" />
      </g>
    </g>
  );
}

/* ================= gemeinsame Defs ================= */
export function W25AgriDefs() {
  return (
    <defs>
      <linearGradient id="w25a-modul" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#12408a" />
        <stop offset="1" stopColor="#2c63c0" />
      </linearGradient>
      <linearGradient id="w25a-modul-dach" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#12408a" />
        <stop offset="1" stopColor="#2c63c0" />
      </linearGradient>
      <linearGradient id="w25a-glanz" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff4cc" />
        <stop offset="1" stopColor="#ffc53d" stopOpacity="0.88" />
      </linearGradient>
      <linearGradient id="w25a-kegel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0.1" stopColor="#ffc53d" stopOpacity="0.4" />
        <stop offset="1" stopColor="#ffc53d" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="w25a-hof">
        <stop offset="0" stopColor="#ffc53d" stopOpacity="0.45" />
        <stop offset="0.45" stopColor="#ffc53d" stopOpacity="0.14" />
        <stop offset="1" stopColor="#ffc53d" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="w25a-krone" cx="0.38" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#aed083" />
        <stop offset="0.55" stopColor="#8cba58" />
        <stop offset="1" stopColor="#669933" />
      </radialGradient>
      <linearGradient id="w25a-bahn" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.3" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="w25a-erde" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="w25a-horizont" cx="0.5" cy="1" r="0.5">
        <stop offset="0" stopColor="#8cba58" stopOpacity="0.18" />
        <stop offset="1" stopColor="#8cba58" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="w25a-halo-l" cx="1" cy="0.5" r="1" gradientTransform="translate(1 0.5) scale(1 0.5) translate(-1 -0.5)">
        <stop offset="0" stopColor="#ffc53d" stopOpacity="0.6" />
        <stop offset="0.45" stopColor="#ffc53d" stopOpacity="0.2" />
        <stop offset="1" stopColor="#ffc53d" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="w25a-halo-r" cx="0" cy="0.5" r="1" gradientTransform="translate(0 0.5) scale(1 0.5) translate(0 -0.5)">
        <stop offset="0" stopColor="#ffc53d" stopOpacity="0.6" />
        <stop offset="0.45" stopColor="#ffc53d" stopOpacity="0.2" />
        <stop offset="1" stopColor="#ffc53d" stopOpacity="0" />
      </radialGradient>
      <clipPath id="w25a-himmel">
        <rect x="0" y="0" width="1000" height={G} />
      </clipPath>
    </defs>
  );
}
