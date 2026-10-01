"use client";

import { GRUEN, GRUEN_HELL, GRUEN_TIEF, SONNE, MODUL, DISPLAY, rd, strich } from "./gemeinsam";

/* ================================================================== */
/* 7 · Agri-PV: zwei schematische Querschnitte                          */
/* ================================================================== */
/*
 * Raster 1040 × 840. Oben: hoch aufgeständertes Moduldach über Obstbäumen. Unten: vertikale,
 * beidseitig aktive Modulreihen zwischen Grünland- und Ackerstreifen.
 *
 * Aufbau (≈ 2,5 s): Überschriften → Bodenlinien zeichnen sich → Stützen wachsen, Module setzen
 * sich aufs Dach, Bäume und Streifen wachsen → Sonnenbahnen zeichnen sich.
 * Danach läuft in beiden Szenen derselbe „Tag“ (13 s, endlos): Die Sonne geht links auf, zieht
 * über die Bahn und geht rechts unter; ihr Lichtkegel zielt stets auf die Anlage. Oben leuchtet
 * jedes Modul auf, wenn die Sonne darüber steht, und schickt Energieimpulse nach oben. Unten
 * leuchten morgens die linken, abends die rechten Modulseiten (bifazial).
 * Ruhige Dauerbewegung: Baumkronen atmen, Gras und Getreide wiegen sich.
 * Alle Klassen, Keyframes und IDs mit Präfix tv07.
 */

const TAG = 13000; // Dauer eines Tages (ms)
const START = 1800; // Sonnenaufgang nach dem Aufbau (ms)
const EASE = "cubic-bezier(0.22,1,0.36,1)";

/* ---------- Geometrie oben: hoch aufgeständert ---------- */
const BODEN_A = 372; // vordere Bodenlinie
const BODEN_A_HINTEN = 350;
const DACH_V = 236; // Vorderkante Moduldach
const DACH_H = 210; // Hinterkante
const TIEFE = 24; // Versatz der Hinterkante nach rechts
const DACH_X0 = 110;
const DACH_X1 = 870;
const MODULE_A = 12;
const PFOSTEN = [118, 364, 610, 856];
const BAEUME = [179, 303, 425, 549, 671, 795];
const BAEUME_HINTEN = [241, 487, 733];
const BAHN_A = { cx: 502, gy: BODEN_A, rx: 448, ry: 275 };

/* ---------- Geometrie unten: vertikal ---------- */
const BODEN_B = 792;
const REIHEN = [200, 360, 520, 680, 840];
const MOD_B = { oben: 652, unten: 770, halb: 8 };
const STREIFEN = [
  { x0: 222, x1: 338, art: "gras" },
  { x0: 382, x1: 498, art: "acker" },
  { x0: 542, x1: 658, art: "gras" },
  { x0: 702, x1: 818, art: "acker" },
  { x0: 70, x1: 178, art: "gras", leise: true },
  { x0: 862, x1: 970, art: "gras", leise: true },
];
const BAHN_B = { cx: 520, gy: BODEN_B, rx: 440, ry: 232 };

/* ---------- Helfer ---------- */
const zufall = (i) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return Math.round((v - Math.floor(v)) * 1000) / 1000;
};

/** Sonne auf der Ellipsenbahn bei Winkel phi (0 = links am Horizont, PI = rechts). */
function sonnenPunkt(b, ziel, phi) {
  const x = b.cx - b.rx * Math.cos(phi);
  // Wurzel: steiler Auf- und Untergang, flacher Mittag – die Sonne bleibt über dem Moduldach.
  const y = b.gy - b.ry * Math.sqrt(Math.sin(phi));
  const [tx, ty] = ziel(phi);
  return { x, y, a: (Math.atan2(ty - y, tx - x) * 180) / Math.PI, d: Math.hypot(tx - x, ty - y) };
}

/** Keyframes für Sonnenlauf (Position + Ausrichtung des Lichtkegels) und Kegellänge. */
function bahnKeyframes(name, b, ziel) {
  const n = 24;
  let lauf = "";
  let kegel = "";
  let vorher = null;
  for (let k = 0; k <= n; k++) {
    const p = k / n;
    const s = sonnenPunkt(b, ziel, Math.PI * p);
    let a = s.a;
    if (vorher !== null) {
      while (a - vorher > 180) a -= 360;
      while (a - vorher < -180) a += 360;
    }
    vorher = a;
    const pct = rd(p * 100);
    lauf += `${pct}%{transform:translate(${rd(s.x)}px,${rd(s.y)}px) rotate(${rd(a)}deg)}`;
    kegel += `${pct}%{transform:scaleX(${Math.round(s.d) / 100})}`;
  }
  const ruhe = sonnenPunkt(b, ziel, Math.PI * 0.3);
  return (
    `@keyframes tv07-lauf${name}{${lauf}}@keyframes tv07-kegel${name}{${kegel}}` +
    `.tv07-sonne${name}{transform-box:view-box;transform-origin:0 0;transform:translate(${rd(ruhe.x)}px,${rd(ruhe.y)}px) rotate(${rd(ruhe.a)}deg)}` +
    `.tv07-kegel${name}{transform-box:view-box;transform-origin:0 0;transform:scaleX(${Math.round(ruhe.d) / 100})}` +
    `.tv07-sonne${name}.tv07-an{animation:tv07-lauf${name} ${TAG}ms linear ${START}ms infinite both}` +
    `.tv07-kegel${name}.tv07-an{animation:tv07-kegel${name} ${TAG}ms linear ${START}ms infinite both}`
  );
}

const zielA = (phi) => [502, 300 - 70 * Math.sin(phi)];
const zielB = (phi) => [520, 740 - 34 * Math.sin(phi)];

/** Sonnenbahn als feine Linie (gleiche Kurve wie der Lauf). */
const bahnPfad = (b) =>
  Array.from({ length: 49 }, (_, k) => {
    const phi = (Math.PI * k) / 48;
    return `${k ? "L" : "M"}${rd(b.cx - b.rx * Math.cos(phi))} ${rd(b.gy - b.ry * Math.sqrt(Math.sin(phi)))}`;
  }).join("");
const PFAD_A = bahnPfad(BAHN_A);
const PFAD_B = bahnPfad(BAHN_B);

/* Module oben: Parallelogramme (leichte Aufsicht), Zeitpunkt, zu dem die Sonne darüber steht. */
const MOD_BREITE = (DACH_X1 - DACH_X0) / MODULE_A;
const MODULE = Array.from({ length: MODULE_A }, (_, k) => {
  const x0 = DACH_X0 + k * MOD_BREITE + 1.5;
  const w = MOD_BREITE - 3;
  const pts = `${rd(x0)},${DACH_V} ${rd(x0 + w)},${DACH_V} ${rd(x0 + w + TIEFE)},${DACH_H} ${rd(x0 + TIEFE)},${DACH_H}`;
  let zellen = "";
  for (let j = 1; j < 6; j++) {
    const xj = x0 + (j * w) / 6;
    zellen += `M${rd(xj)} ${DACH_V}L${rd(xj + TIEFE)} ${DACH_H}`;
  }
  const ym = (DACH_V + DACH_H) / 2;
  zellen += `M${rd(x0 + TIEFE / 2)} ${ym}H${rd(x0 + w + TIEFE / 2)}`;
  const mitte = x0 + w / 2 + TIEFE / 2;
  const anteil = Math.acos((BAHN_A.cx - mitte) / BAHN_A.rx) / Math.PI;
  const spitze = Math.round(START + anteil * TAG - 0.05 * TAG);
  return { pts, zellen, mitte: rd(mitte), spitze, kante: `M${rd(x0 + TIEFE)} ${DACH_H}H${rd(x0 + w + TIEFE)}` };
});

/* Grünland: feine Halme; Acker: Getreidehalme mit Ähren. */
const STREIFEN_FORM = STREIFEN.map((s, si) => {
  const seed = si * 37 + 5;
  if (s.art === "gras") {
    const n = 15;
    const halme = [[], []];
    for (let k = 0; k < n; k++) {
      const x = s.x0 + 4 + (k * (s.x1 - s.x0 - 8)) / (n - 1) + (zufall(seed + k) - 0.5) * 4;
      const h = 15 + 17 * zufall(seed + k * 3 + 1);
      const neig = (zufall(seed + k * 7 + 2) - 0.5) * 12;
      halme[k % 2].push(`M${rd(x)} ${BODEN_B}Q${rd(x + neig * 0.2)} ${rd(BODEN_B - h * 0.6)} ${rd(x + neig)} ${rd(BODEN_B - h)}`);
    }
    return { ...s, halme: halme.map((h) => h.join("")) };
  }
  const n = 7;
  const teile = [
    { weg: "", aehren: [] },
    { weg: "", aehren: [] },
  ];
  for (let k = 0; k < n; k++) {
    const x = s.x0 + 8 + (k * (s.x1 - s.x0 - 16)) / (n - 1);
    const h = 42 + 14 * zufall(seed + k * 5 + 3);
    const neig = (zufall(seed + k * 11 + 4) - 0.5) * 8;
    const top = BODEN_B - h;
    const t = teile[k % 2];
    t.weg += `M${rd(x)} ${BODEN_B}Q${rd(x + neig * 0.2)} ${rd(BODEN_B - h * 0.55)} ${rd(x + neig)} ${rd(top)}`;
    const seite = k % 2 ? 1 : -1;
    t.weg += `M${rd(x + neig * 0.15)} ${rd(BODEN_B - h * 0.35)}q${seite * 7} -3 ${seite * 12} -13`;
    t.aehren.push({ x: rd(x + neig * 1.1), y: rd(top - 8), r: rd(neig * 1.4) });
  }
  return { ...s, teile };
});

const CSS = `
.tv07-aus{opacity:0}
.tv07-rein{opacity:0;animation:tv07-rein 1000ms ${EASE} both}
@keyframes tv07-rein{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.tv07-fall{opacity:0;animation:tv07-fall 900ms ${EASE} both}
@keyframes tv07-fall{from{opacity:0;transform:translateY(-22px)}to{opacity:1;transform:none}}
.tv07-hoch{opacity:0;animation:tv07-hoch 1000ms ${EASE} both}
@keyframes tv07-hoch{from{opacity:0;transform:translateY(46px)}to{opacity:1;transform:none}}
.tv07-wachs{transform-box:fill-box;transform-origin:50% 100%;animation:tv07-wachs 900ms ${EASE} both}
@keyframes tv07-wachs{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.tv07-quer{transform-box:fill-box;transform-origin:0 50%;animation:tv07-quer 1100ms ${EASE} both}
@keyframes tv07-quer{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.tv07-spross{transform-box:fill-box;transform-origin:50% 100%;animation:tv07-spross 1200ms ${EASE} both}
@keyframes tv07-spross{from{opacity:0;transform:scale(0.55)}to{opacity:1;transform:scale(1)}}

.tv07-tag{animation:tv07-tag ${TAG}ms linear ${START}ms infinite both}
@keyframes tv07-tag{0%{opacity:0}6%{opacity:1}94%{opacity:1}100%{opacity:0}}
.tv07-glanz{opacity:0;animation:tv07-glanz ${TAG}ms linear infinite both}
@keyframes tv07-glanz{0%{opacity:0}6%{opacity:1}26%{opacity:0.16}40%{opacity:0}100%{opacity:0}}
.tv07-impuls{transform-box:fill-box;opacity:0;animation:tv07-impuls ${TAG}ms linear infinite both}
@keyframes tv07-impuls{0%{opacity:0;transform:translateY(0)}1.5%{opacity:1}12%{opacity:0;transform:translateY(-92px)}100%{opacity:0;transform:translateY(-92px)}}
.tv07-ost{opacity:0;animation:tv07-ost ${TAG}ms linear infinite both}
@keyframes tv07-ost{0%{opacity:0}7%{opacity:1}30%{opacity:0.85}46%{opacity:0.08}52%{opacity:0}100%{opacity:0}}
.tv07-west{opacity:0;animation:tv07-west ${TAG}ms linear infinite both}
@keyframes tv07-west{0%,48%{opacity:0}54%{opacity:0.08}70%{opacity:0.85}93%{opacity:1}100%{opacity:0}}
.tv07-funke{transform-box:fill-box;opacity:0;animation:tv07-funke 2400ms cubic-bezier(0.3,0.6,0.5,1) infinite both}
@keyframes tv07-funke{0%{opacity:0;transform:translateY(0)}18%{opacity:1}100%{opacity:0;transform:translateY(-74px)}}
.tv07-photon{opacity:0;animation:tv07-photon 1500ms linear infinite both}
@keyframes tv07-photon{0%{opacity:0;transform:translateX(14px)}25%{opacity:0.9}100%{opacity:0;transform:translateX(92px)}}
.tv07-atem{transform-box:fill-box;transform-origin:50% 100%;animation:tv07-atem 5200ms ease-in-out infinite alternate both}
@keyframes tv07-atem{from{transform:scale(1)}to{transform:scale(1.035)}}
.tv07-wiegen{transform-box:fill-box;transform-origin:50% 100%;animation:tv07-wiegen 3800ms ease-in-out infinite alternate both}
@keyframes tv07-wiegen{from{transform:skewX(-5deg)}to{transform:skewX(5deg)}}
${bahnKeyframes("A", BAHN_A, zielA)}
${bahnKeyframes("B", BAHN_B, zielB)}
@media (prefers-reduced-motion: reduce){
  .tv07-rein,.tv07-fall,.tv07-hoch,.tv07-wachs,.tv07-quer,.tv07-spross{animation:none;opacity:1;transform:none}
  .tv07-sonneA.tv07-an,.tv07-sonneB.tv07-an,.tv07-kegelA.tv07-an,.tv07-kegelB.tv07-an,.tv07-atem,.tv07-wiegen{animation:none}
  .tv07-tag{animation:none;opacity:1}
  .tv07-glanz{animation:none;opacity:0.3}
  .tv07-ost{animation:none;opacity:0.9}
  .tv07-west{animation:none;opacity:0}
  .tv07-impuls,.tv07-funke,.tv07-photon{animation:none;opacity:0}
}
`;

/** Klasse + Verzögerung, nur wenn aktiv (sonst Startzustand). */
const an = (aktiv, cls, ms = 0) => ({
  className: aktiv ? cls : "tv07-aus",
  style: aktiv ? { animationDelay: `${ms}ms` } : undefined,
});
/** Dauerbewegung: ohne aktiv einfach ruhend (sichtbar bleibt der Elternteil verantwortlich). */
const dauer = (aktiv, cls, ms = 0) => ({
  className: aktiv ? cls : undefined,
  style: aktiv ? { animationDelay: `${ms}ms` } : undefined,
});

/* ---------- Bausteine ---------- */

function Baum({ atmen, verzoegerung }) {
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
    <>
      <path d="M0 0V-50M0-26L-15-44M0-32L13-48" fill="none" stroke="rgba(214,226,240,0.55)" strokeWidth="4" strokeLinecap="round" />
      <g {...dauer(atmen, "tv07-atem", verzoegerung)}>
        <path d={krone} fill="url(#tv07-krone)" />
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
    </>
  );
}

function SonneMitKegel({ name, aktiv }) {
  return (
    <g className={aktiv ? "tv07-tag" : "tv07-aus"}>
      <g className={`tv07-sonne${name} ${aktiv ? "tv07-an" : ""}`}>
        <g className={`tv07-kegel${name} ${aktiv ? "tv07-an" : ""}`}>
          <polygon points="0,-7 100,-54 100,54 0,7" fill="url(#tv07-kegel)" />
          {aktiv &&
            [-16, 0, 16].map((yo, i) => (
              <line key={yo} x1="0" x2="7" y1={yo * 0.6} y2={yo} stroke="#ffe7a3" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="tv07-photon" style={{ animationDelay: `${i * 500}ms` }} />
            ))}
        </g>
        <circle r="74" fill="url(#tv07-hof)" />
        <circle r="31" fill="none" stroke={SONNE} strokeOpacity="0.35" strokeWidth="1.5" />
        <circle r="20" fill={SONNE} />
        <circle r="11" fill="#ffe7a3" />
      </g>
    </g>
  );
}

/* ================================================================== */

export default function AgriGrafik({ aktiv }) {
  const bodenA = strich(aktiv, 150, 1300);
  const bodenB = strich(aktiv, 650, 1300);
  const bahnA = strich(aktiv, 1250, 1700);
  const bahnB = strich(aktiv, 1450, 1700);
  return (
    <svg viewBox="0 0 1040 840" className="h-full w-full" aria-hidden="true">
      <style>{CSS}</style>
      <defs>
        <linearGradient id="tv07-modul" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={MODUL} />
          <stop offset="1" stopColor="#2c63c0" />
        </linearGradient>
        <linearGradient id="tv07-glanzfarbe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4cc" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0.88" />
        </linearGradient>
        <linearGradient id="tv07-kegel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.1" stopColor={SONNE} stopOpacity="0.42" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="tv07-hof">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.45" />
          <stop offset="0.45" stopColor={SONNE} stopOpacity="0.14" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv07-krone" cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" stopColor={GRUEN_HELL} />
          <stop offset="0.55" stopColor={GRUEN} />
          <stop offset="1" stopColor={GRUEN_TIEF} />
        </radialGradient>
        <linearGradient id="tv07-bahn" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tv07-erde" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="tv07-horizont" cx="0.5" cy="1" r="0.5">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.16" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv07-halo-l" cx="1" cy="0.5" r="1" gradientTransform="translate(1 0.5) scale(1 0.5) translate(-1 -0.5)">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.6" />
          <stop offset="0.45" stopColor={SONNE} stopOpacity="0.2" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv07-halo-r" cx="0" cy="0.5" r="1" gradientTransform="translate(0 0.5) scale(1 0.5) translate(0 -0.5)">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.6" />
          <stop offset="0.45" stopColor={SONNE} stopOpacity="0.2" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tv07-trenner" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="tv07-himmel-a">
          <rect x="0" y="0" width="1040" height={BODEN_A} />
        </clipPath>
        <clipPath id="tv07-himmel-b">
          <rect x="0" y="430" width="1040" height={BODEN_B - 430} />
        </clipPath>
      </defs>

      {/* ============================ Szene A ============================ */}
      <ellipse cx="502" cy={BODEN_A} rx="520" ry="150" fill="url(#tv07-horizont)" clipPath="url(#tv07-himmel-a)" />
      <path d={PFAD_A} fill="none" strokeLinejoin="round" stroke="url(#tv07-bahn)" strokeWidth="1.5" {...bahnA} />
      <g clipPath="url(#tv07-himmel-a)">
        <SonneMitKegel name="A" aktiv={aktiv} />
      </g>

      <g {...an(aktiv, "tv07-rein", 0)}>
        <text x="20" y="40" fontSize="28" fontWeight="800" fill="#fff" style={DISPLAY}>
          Hoch aufgeständert
        </text>
        <text x="20" y="73" fontSize="22" fill="rgba(255,255,255,0.62)">
          über Obst, Wein und Beeren
        </text>
      </g>
      <g {...an(aktiv, "tv07-rein", 1700)}>
        <circle cx="800" cy="32" r="7" fill={SONNE} />
        <circle cx="800" cy="32" r="13" fill="none" stroke={SONNE} strokeOpacity="0.35" strokeWidth="1.5" />
        <text x="824" y="40" fontSize="23" fontWeight="700" fill={SONNE}>
          oben Solarstrom
        </text>
        <circle cx="800" cy="66" r="7" fill={GRUEN_HELL} />
        <circle cx="800" cy="66" r="13" fill="none" stroke={GRUEN_HELL} strokeOpacity="0.35" strokeWidth="1.5" />
        <text x="824" y="74" fontSize="23" fontWeight="700" fill={GRUEN_HELL}>
          darunter Obstbau
        </text>
      </g>

      {/* Boden (Ebene mit Tiefe) */}
      <g {...an(aktiv, "tv07-rein", 100)}>
        <polygon points={`20,${BODEN_A} 1020,${BODEN_A} 1020,${BODEN_A_HINTEN} 44,${BODEN_A_HINTEN}`} fill="rgba(140,186,88,0.05)" />
        <line x1="44" x2="1020" y1={BODEN_A_HINTEN} y2={BODEN_A_HINTEN} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <rect x="20" y={BODEN_A} width="1000" height="22" fill="url(#tv07-erde)" />
      </g>
      <line x1="20" x2="1020" y1={BODEN_A} y2={BODEN_A} stroke="rgba(255,255,255,0.5)" strokeWidth="2" {...bodenA} />

      {/* hintere Stützen und Bäume (Tiefe) */}
      {PFOSTEN.map((p, i) => (
        <g key={`hp${p}`} opacity="0.3">
          <rect x={p + TIEFE - 2} y={DACH_H} width="4" height={BODEN_A_HINTEN - DACH_H} fill="#d6e2f0" {...an(aktiv, "tv07-wachs", 250 + i * 90)} />
        </g>
      ))}
      {BAEUME_HINTEN.map((bx, i) => (
        <g key={`hb${bx}`} transform={`translate(${bx + 14} ${BODEN_A_HINTEN}) scale(0.74)`} opacity="0.34">
          <g {...an(aktiv, "tv07-spross", 850 + i * 90)}>
            <Baum atmen={aktiv} verzoegerung={-i * 1300} />
          </g>
        </g>
      ))}

      {/* vordere Stützen mit Kopfbändern */}
      {PFOSTEN.map((p, i) => (
        <g key={`p${p}`}>
          <rect x={p - 3} y={DACH_V + 6} width="6" height={BODEN_A - DACH_V - 6} rx="1.5" fill="#d6e2f0" opacity="0.78" {...an(aktiv, "tv07-wachs", 300 + i * 90)} />
          <path
            d={`${i > 0 ? `M${p} ${DACH_V + 40}L${p - 30} ${DACH_V + 8}` : ""}${i < PFOSTEN.length - 1 ? `M${p} ${DACH_V + 40}L${p + 30} ${DACH_V + 8}` : ""}`}
            fill="none"
            stroke="rgba(214,226,240,0.55)"
            strokeWidth="2.5"
            strokeLinecap="round"
            {...an(aktiv, "tv07-rein", 700 + i * 90)}
          />
        </g>
      ))}
      <rect x={DACH_X0 - 4} y={DACH_V} width={DACH_X1 - DACH_X0 + 8} height="7" rx="2" fill="#d6e2f0" opacity="0.7" {...an(aktiv, "tv07-quer", 550)} />

      {/* Bäume vorne */}
      {BAEUME.map((bx, i) => (
        <g key={`b${bx}`} transform={`translate(${bx} ${BODEN_A})`}>
          <g {...an(aktiv, "tv07-spross", 1000 + i * 80)}>
            <Baum atmen={aktiv} verzoegerung={-((i * 1700) % 5200)} />
          </g>
        </g>
      ))}

      {/* Moduldach */}
      {MODULE.map((m, k) => (
        <g key={`m${k}`} {...an(aktiv, "tv07-fall", 650 + k * 50)}>
          <polygon points={m.pts} fill="url(#tv07-modul)" />
          {/* Tageslicht auf dem ganzen Dach */}
          <g opacity="0.2">
            <polygon points={m.pts} fill="url(#tv07-glanzfarbe)" className={aktiv ? "tv07-tag" : "tv07-aus"} />
          </g>
          {/* Lichtspitze, wenn die Sonne darüber steht */}
          <polygon points={m.pts} fill="url(#tv07-glanzfarbe)" stroke={SONNE} strokeWidth="1.5" strokeLinejoin="round" {...dauer(aktiv, "tv07-glanz", m.spitze)} opacity={aktiv ? undefined : 0} />
          <path d={m.zellen} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <polygon points={m.pts} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinejoin="round" />
          <path d={m.kante} stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
        </g>
      ))}

      {/* Energieimpulse aus den Modulen */}
      {aktiv &&
        MODULE.flatMap((m, k) =>
          [0, 1].map((j) => {
            const ix = m.mitte + (j ? 12 : -10);
            return (
              <g key={`i${k}-${j}`} className="tv07-impuls" style={{ animationDelay: `${m.spitze + 200 + j * 480}ms` }}>
                <circle cx={ix} cy={DACH_H - 8} r="11" fill={SONNE} opacity="0.4" />
                <circle cx={ix} cy={DACH_H - 8} r="5" fill={SONNE} />
                <circle cx={ix} cy={DACH_H - 8} r="2.4" fill="#fffbea" />
              </g>
            );
          })
        )}

      {/* Trenner */}
      <rect x="20" y="425" width="1000" height="1.5" fill="url(#tv07-trenner)" {...an(aktiv, "tv07-rein", 400)} />

      {/* ============================ Szene B ============================ */}
      <ellipse cx="520" cy={BODEN_B} rx="520" ry="140" fill="url(#tv07-horizont)" clipPath="url(#tv07-himmel-b)" />
      <path d={PFAD_B} fill="none" strokeLinejoin="round" stroke="url(#tv07-bahn)" strokeWidth="1.5" {...bahnB} />
      <g clipPath="url(#tv07-himmel-b)">
        <SonneMitKegel name="B" aktiv={aktiv} />
      </g>

      <g {...an(aktiv, "tv07-rein", 500)}>
        <text x="20" y="480" fontSize="28" fontWeight="800" fill="#fff" style={DISPLAY}>
          Vertikal zwischen Grünland- und Ackerstreifen
        </text>
        <text x="20" y="513" fontSize="22" fill="rgba(255,255,255,0.62)">
          Beidseitig aktive Module nutzen Morgen- und Abendsonne
        </text>
      </g>

      <g {...an(aktiv, "tv07-rein", 600)}>
        <polygon points={`20,${BODEN_B} 1020,${BODEN_B} 1020,${BODEN_B - 22} 44,${BODEN_B - 22}`} fill="rgba(140,186,88,0.05)" />
        <line x1="44" x2="1020" y1={BODEN_B - 22} y2={BODEN_B - 22} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <rect x="20" y={BODEN_B} width="1000" height="22" fill="url(#tv07-erde)" />
      </g>
      {/* Reihen laufen in die Tiefe: hintere Modulkanten */}
      {REIHEN.map((rx, r) => (
        <g key={`rt${rx}`} opacity="0.3" clipPath="url(#tv07-himmel-b)">
          <g {...an(aktiv, "tv07-hoch", 1100 + r * 110)}>
            <rect x={rx + TIEFE - MOD_B.halb} y={MOD_B.oben - 22} width={MOD_B.halb * 2} height={MOD_B.unten - MOD_B.oben} rx="2" fill={MODUL} stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <rect x={rx + TIEFE - 2} y={MOD_B.unten - 22} width="4" height={BODEN_B - MOD_B.unten} fill="#d6e2f0" />
          </g>
        </g>
      ))}

      {/* Streifen: Grünland und Acker */}
      {STREIFEN_FORM.map((s, si) => (
        <g key={`s${si}`} opacity={s.leise ? 0.45 : 1}>
          <g {...an(aktiv, "tv07-wachs", 1000 + (si % 4) * 110)}>
            {s.art === "gras"
              ? s.halme.map((d, hi) => (
                  <g key={hi} {...dauer(aktiv, "tv07-wiegen", -(si * 900 + hi * 1700))}>
                    <path d={d} fill="none" stroke={GRUEN} strokeWidth="2.4" strokeLinecap="round" opacity={hi ? 0.75 : 1} />
                  </g>
                ))
              : s.teile.map((t, ti) => (
                  <g key={ti} {...dauer(aktiv, "tv07-wiegen", -(si * 700 + ti * 1900))}>
                    <path d={t.weg} fill="none" stroke={GRUEN_HELL} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
                    {t.aehren.map((a) => (
                      <ellipse key={`${a.x}`} cx={a.x} cy={a.y} rx="4" ry="10" fill={SONNE} opacity="0.85" transform={`rotate(${a.r} ${a.x} ${a.y})`} />
                    ))}
                  </g>
                ))}
          </g>
        </g>
      ))}

      <line x1="20" x2="1020" y1={BODEN_B} y2={BODEN_B} stroke="rgba(255,255,255,0.5)" strokeWidth="2" {...bodenB} />

      {/* vertikale, beidseitig aktive Module */}
      <g clipPath="url(#tv07-himmel-b)">
      {REIHEN.map((rx, r) => {
        const { oben, unten, halb } = MOD_B;
        const h = unten - oben;
        let zellen = "";
        for (let z = 1; z < 8; z++) zellen += `M${rx - halb} ${rd(oben + (z * h) / 8)}H${rx + halb}`;
        return (
          <g key={`r${rx}`} {...an(aktiv, "tv07-hoch", 1150 + r * 110)}>
            {/* Leuchten der Seiten */}
            <g {...dauer(aktiv, "tv07-ost", START + r * 70)} opacity={aktiv ? undefined : 0}>
              <path d={`M${rx - halb} ${oben - 24}A52 ${h / 2 + 24} 0 0 0 ${rx - halb} ${unten + 24}Z`} fill="url(#tv07-halo-l)" />
            </g>
            <g {...dauer(aktiv, "tv07-west", START + r * 70)} opacity={aktiv ? undefined : 0}>
              <path d={`M${rx + halb} ${oben - 24}A52 ${h / 2 + 24} 0 0 1 ${rx + halb} ${unten + 24}Z`} fill="url(#tv07-halo-r)" />
            </g>
            <rect x={rx - 2.5} y={unten} width="5" height={BODEN_B - unten} fill="#d6e2f0" opacity="0.75" />
            <polygon points={`${rx - halb},${oben} ${rx + halb},${oben} ${rx + halb + TIEFE},${oben - 22} ${rx - halb + TIEFE},${oben - 22}`} fill="rgba(127,167,214,0.16)" stroke="rgba(255,255,255,0.28)" strokeWidth="1" strokeLinejoin="round" />
            <rect x={rx - halb} y={oben} width={halb * 2} height={h} rx="2" fill="url(#tv07-modul)" />
            <path d={zellen} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <g {...dauer(aktiv, "tv07-ost", START + r * 70)} opacity={aktiv ? undefined : 0}>
              <rect x={rx - halb} y={oben} width={halb} height={h} rx="2" fill="url(#tv07-glanzfarbe)" />
            </g>
            <g {...dauer(aktiv, "tv07-west", START + r * 70)} opacity={aktiv ? undefined : 0}>
              <rect x={rx} y={oben} width={halb} height={h} rx="2" fill="url(#tv07-glanzfarbe)" />
            </g>
            <rect x={rx - halb} y={oben} width={halb * 2} height={h} rx="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            <line x1={rx} x2={rx} y1={oben + 2} y2={unten - 2} stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
            {/* Energiefunken je Seite */}
            {aktiv &&
              [
                ["tv07-ost", -5],
                ["tv07-west", 5],
              ].map(([cls, dx]) => (
                <g key={cls} className={cls} style={{ animationDelay: `${START + r * 70}ms` }}>
                  {[0, 1].map((j) => (
                    <g key={j} className="tv07-funke" style={{ animationDelay: `${r * 330 + j * 1200}ms` }}>
                      <circle cx={rx + dx} cy={oben - 10} r="10" fill={SONNE} opacity="0.4" />
                      <circle cx={rx + dx} cy={oben - 10} r="4.6" fill={SONNE} />
                      <circle cx={rx + dx} cy={oben - 10} r="2.2" fill="#fffbea" />
                    </g>
                  ))}
                </g>
              ))}
          </g>
        );
      })}
      </g>

      <g {...an(aktiv, "tv07-rein", 1900)}>
        <text x="24" y="833" fontSize="22" fontWeight="600" fill="rgba(255,255,255,0.72)">
          Morgen
        </text>
        <text x="1016" y="833" textAnchor="end" fontSize="22" fontWeight="600" fill="rgba(255,255,255,0.72)">
          Abend
        </text>
      </g>
    </svg>
  );
}
