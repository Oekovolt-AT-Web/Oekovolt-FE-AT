"use client";

import { KARTE_PFADE, KARTE_QUELLE, projiziere } from "@/components/Forderungen/Shared/kartePfade";
import { GRUEN, GRUEN_HELL, SONNE, NAVY, DISPLAY, rd } from "./gemeinsam";

/* ================================================================== */
/* 1 · Karte: aus Ostermiething in alle neun Bundesländer              */
/* ================================================================== */
//
// Choreografie (ab aktiv = true):
//   0,0–1,7 s  Bundesländer zeichnen sich mit hellem Lichtkopf, Punktraster füllt das Land
//   0,9 s      Sitz Ostermiething zündet (Blitzring, Halo, Pulsringe)
//   1,2–2,7 s  Lichtbahnen starten nach Entfernung gestaffelt, landen mit Welle; Land leuchtet auf,
//              Zähler 1 → 9 tickt mit jeder Landung
//   ab ~3 s    ruhiger Betrieb: Energieteilchen laufen in eigenem Takt über jede Bahn, bei Ankunft
//              Welle an der Hauptstadt und sanftes Aufleuchten des Bundeslands; langsamer Lichtstreif

// Raster 1040 × 860 (entspricht der Grafikfläche). Karte (600 × 315) wird skaliert eingesetzt.
const B = 1040;
const H = 860;
const S = 1.72;
const TX = 4;
const TY = 86;
const P = (lon, lat) => {
  const [x, y] = projiziere(lon, lat);
  return [rd(TX + x * S), rd(TY + y * S)];
};
const LAND = Object.keys(KARTE_PFADE);

const SITZ = P(12.8417, 48.0428);
const STAEDTE = [
  { n: "Bregenz", land: "vorarlberg", lon: 9.7471, lat: 47.5031, dx: 12, dy: 32, a: "start" },
  { n: "Innsbruck", land: "tirol", lon: 11.4041, lat: 47.2692, dx: 0, dy: 36, a: "middle" },
  { n: "Salzburg", land: "salzburg", lon: 13.055, lat: 47.8095, dx: -14, dy: 30, a: "end" },
  { n: "Linz", land: "oberoesterreich", lon: 14.2858, lat: 48.3069, dx: 0, dy: -20, a: "middle" },
  { n: "St. Pölten", land: "niederoesterreich", lon: 15.6256, lat: 48.2047, dx: -6, dy: 36, a: "middle" },
  { n: "Wien", land: "wien", lon: 16.3738, lat: 48.2082, dx: 16, dy: 8, a: "start" },
  { n: "Eisenstadt", land: "burgenland", lon: 16.5245, lat: 47.8456, dx: -4, dy: 36, a: "middle" },
  { n: "Graz", land: "steiermark", lon: 15.4395, lat: 47.0707, dx: 16, dy: 8, a: "start" },
  { n: "Klagenfurt", land: "kaernten", lon: 14.3055, lat: 46.6247, dx: 0, dy: 36, a: "middle" },
];

const bez = (a, c, b, t) => {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
};

// Bahnen: quadratische Bögen, nach Entfernung gestaffelt (die Welle breitet sich aus).
const BAHNEN = STAEDTE.map((s) => {
  const z = P(s.lon, s.lat);
  const d = Math.hypot(z[0] - SITZ[0], z[1] - SITZ[1]);
  const c = [rd((SITZ[0] + z[0]) / 2), rd((SITZ[1] + z[1]) / 2 - d * 0.36)];
  let L = 0;
  let v = SITZ;
  for (let i = 1; i <= 24; i++) {
    const q = bez(SITZ, c, z, i / 24);
    L += Math.hypot(q[0] - v[0], q[1] - v[1]);
    v = q;
  }
  return { ...s, z, c, L: Math.round(L), d: `M${SITZ[0]} ${SITZ[1]}Q${c[0]} ${c[1]} ${z[0]} ${z[1]}` };
})
  .sort((a, b) => a.L - b.L)
  .map((b, i) => {
    const start = 1150 + i * 105;
    const flug = Math.round(380 + b.L * 1.05);
    const landung = start + flug;
    // Dauerbetrieb: konstante Teilchengeschwindigkeit, je Bahn eigener Takt (kein Gleichschritt).
    const reise = Math.round(900 + b.L * 2.6);
    const periode = reise + 1700 + ((i * 530) % 1300);
    const beginn = 3000 + ((i * 770) % 2600);
    const schweif = rd(Math.min(0.45, 95 / b.L) * 1000) / 1000;
    const teile = [schweif, rd(schweif * 0.4 * 1000) / 1000, rd((6 / b.L) * 10000) / 10000, 0.001];
    return { ...b, i, start, flug, landung, reise, periode, beginn, teile };
  });

// Energieteilchen: Schweif, heller Schweif, Leuchthof, Kern (gleiche Bahn, gleicher Takt).
const TEILCHEN = [
  { farbe: GRUEN_HELL, deck: 0.4, breite: 3.6 },
  { farbe: GRUEN_HELL, deck: 0.95, breite: 4.6 },
  { farbe: GRUEN_HELL, deck: 0.22, breite: 22 },
  { farbe: "#fff", deck: 1, breite: 10 },
];
// Lichtköpfe (Strichlängen bei pathLength = 1): Grenzen, Bahnschweif, Bahnpunkt.
const KOEPFE = [0.05, 0.14, 0.001];
const LANDUNGEN = BAHNEN.map((b) => b.landung).sort((a, b) => a - b);
const pz = (v) => `${Math.round(v * 100) / 100}%`;

// Pro Bahn eigene Keyframes: Teilchenfahrt, Ankunftswelle, Aufleuchten des Bundeslands.
const BAHN_CSS = BAHNEN.map((b) => {
  const f = (b.reise / b.periode) * 100;
  const w = (1200 / b.periode) * 100;
  const l1 = f + (450 / b.periode) * 100;
  const l2 = Math.min(99, f + (2300 / b.periode) * 100);
  return `
${b.teile.map((h, k) => `@keyframes tv01-p${b.i}-${k} { 0% { stroke-dashoffset: ${h}; animation-timing-function: cubic-bezier(0.4,0,0.4,1); } ${pz(f)}, 100% { stroke-dashoffset: ${rd((h - 1.5) * 1000) / 1000}; } }`).join(" ")}
@keyframes tv01-w${b.i} { 0%, ${pz(f - 0.2)} { opacity: 0; transform: scale(0.6); } ${pz(f)} { opacity: 0.9; transform: scale(1); animation-timing-function: cubic-bezier(0.22,1,0.36,1); } ${pz(Math.min(99.5, f + w))} { opacity: 0; transform: scale(4); } 100% { opacity: 0; transform: scale(4); } }
@keyframes tv01-l${b.i} { 0%, ${pz(f - 0.5)} { opacity: 0; } ${pz(l1)} { opacity: 1; } ${pz(l2)}, 100% { opacity: 0; } }`;
}).join("");

const CSS = `
.tv01-v, .tv01-t { opacity: 0; }
.tv01-fb { transform-box: fill-box; transform-origin: center; }
.tv01-auf { animation: tv01-auf 1100ms cubic-bezier(0.22,1,0.36,1) both; }
@keyframes tv01-auf { from { opacity: 0; } to { opacity: 1; } }
.tv01-hoch { animation: tv01-hoch 900ms cubic-bezier(0.22,1,0.36,1) both; }
@keyframes tv01-hoch { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.tv01-pop { animation: tv01-pop 700ms cubic-bezier(0.22,1,0.36,1) both; }
@keyframes tv01-pop { from { opacity: 0; transform: scale(0.2); } to { opacity: 1; transform: scale(1); } }
${KOEPFE.map((h, k) => `.tv01-kopf${k} { animation: tv01-kopf${k} 1400ms cubic-bezier(0.65,0,0.35,1) both, tv01-weg 1400ms linear both; }
@keyframes tv01-kopf${k} { from { stroke-dashoffset: ${h}; } to { stroke-dashoffset: ${rd((h - 1) * 1000) / 1000}; } }`).join(" ")}
@keyframes tv01-weg { 0%, 80% { opacity: 1; } 100% { opacity: 0; } }
.tv01-welle { animation: tv01-welle 1300ms cubic-bezier(0.22,1,0.36,1) forwards; }
@keyframes tv01-welle { from { opacity: 0.95; transform: scale(0.8); } to { opacity: 0; transform: scale(4.4); } }
.tv01-blitz { animation: tv01-blitz 1700ms cubic-bezier(0.22,1,0.36,1) forwards; }
@keyframes tv01-blitz { from { opacity: 1; transform: scale(0.1); } to { opacity: 0; transform: scale(1); } }
.tv01-glimm { animation: tv01-glimm 1600ms cubic-bezier(0.22,1,0.36,1) both; }
@keyframes tv01-glimm { 0% { opacity: 0; } 22% { opacity: 1; } 100% { opacity: 0.32; } }
.tv01-ring { animation: tv01-ring 3600ms cubic-bezier(0.2,0.6,0.35,1) infinite both; }
@keyframes tv01-ring { from { opacity: 0.6; transform: scale(1); } to { opacity: 0; transform: scale(6); } }
.tv01-atmen { animation: tv01-atmen 4800ms ease-in-out infinite; }
@keyframes tv01-atmen { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }
.tv01-streif { animation: tv01-streif 11000ms cubic-bezier(0.45,0,0.55,1) 3400ms infinite both; }
@keyframes tv01-streif { 0% { transform: translateX(-420px); } 55%, 100% { transform: translateX(1250px); } }
.tv01-zi { animation: tv01-zi-an 260ms ease-out both; }
.tv01-zi.tv01-zi-ab { animation: tv01-zi-an 260ms ease-out both, tv01-zi-ab 260ms ease-in forwards; }
@keyframes tv01-zi-an { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes tv01-zi-ab { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(-18px); } }
${BAHN_CSS}
@media (prefers-reduced-motion: reduce) {
  .tv01-v { animation: none !important; opacity: 1 !important; transform: none !important; }
  .tv01-t { animation: none !important; opacity: 0 !important; }
  .tv01-glimm { opacity: 0.32 !important; }
  .tv01-zi-ab { opacity: 0 !important; }
}`;

/** Einmalige Animation (Klasse + Dauer/Verzögerung), nur wenn aktiv. */
const an = (aktiv, basis, klasse, ms = 0, dauer) => ({
  className: `${basis} ${aktiv ? klasse : ""}`,
  style: aktiv ? { animationDelay: `${ms}ms`, ...(dauer ? { animationDuration: `${dauer}ms` } : {}) } : undefined,
});

// Längen- und Breitengrade als feines Kartennetz.
const NETZ = (() => {
  let d = "";
  for (let lon = 9; lon <= 18; lon += 0.5) {
    const [x] = P(lon, 48);
    if (x > 0 && x < B) d += `M${x} 0V${H}`;
  }
  for (let lat = 46; lat <= 49.5; lat += 0.5) {
    const [, y] = P(12, lat);
    if (y > 0 && y < H) d += `M0 ${y}H${B}`;
  }
  return d;
})();

export default function KarteGrafik({ aktiv }) {
  const [hx, hy] = SITZ;
  const k = aktiv ? "tv01-k" : "tv01-x"; // Schlüssel: Animationen bei jedem Aktivieren neu starten

  return (
    <div className="relative h-full">
      <style>{CSS}</style>
      <svg viewBox={`0 0 ${B} ${H}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" key={k}>
        <defs>
          {LAND.map((l) => (
            <path key={l} id={`tv01-${l}`} d={KARTE_PFADE[l].d} pathLength="1" />
          ))}
          <clipPath id="tv01-land">
            {LAND.map((l) => (
              <use key={l} href={`#tv01-${l}`} />
            ))}
          </clipPath>
          <pattern id="tv01-punkte" width="5.2" height="5.2" patternUnits="userSpaceOnUse">
            <circle cx="2.6" cy="2.6" r="0.62" fill="#cfe3ff" />
          </pattern>
          <radialGradient id="tv01-halo">
            <stop offset="0" stopColor={SONNE} stopOpacity="0.55" />
            <stop offset="0.35" stopColor={SONNE} stopOpacity="0.16" />
            <stop offset="1" stopColor={SONNE} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="tv01-feld">
            <stop offset="0" stopColor="#1b4a86" stopOpacity="0.34" />
            <stop offset="0.55" stopColor="#1b4a86" stopOpacity="0.12" />
            <stop offset="1" stopColor="#1b4a86" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tv01-streif-g" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0" />
            <stop offset="0.5" stopColor={GRUEN_HELL} stopOpacity="0.16" />
            <stop offset="1" stopColor={GRUEN_HELL} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tv01-zahl" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#d6f0b4" />
            <stop offset="1" stopColor={GRUEN} />
          </linearGradient>
        </defs>

        {/* Tiefe: weiches Lichtfeld und feines Kartennetz */}
        <ellipse cx="520" cy="390" rx="510" ry="390" fill="url(#tv01-feld)" />
        <path d={NETZ} stroke="#9fc0ea" strokeOpacity="0.06" strokeWidth="1" fill="none" {...an(aktiv, "tv01-v", "tv01-auf", 0, 1600)} />

        {/* Land: Sockel, Fläche, Punktraster, Lichtstreif */}
        <g transform={`translate(${TX} ${TY}) scale(${S})`}>
          <g transform="translate(0 5)" {...an(aktiv, "tv01-v", "tv01-auf", 500, 1400)}>
            {LAND.map((l) => (
              <use key={l} href={`#tv01-${l}`} fill="#0d2f63" stroke="#1d4b8a" strokeWidth="0.6" strokeLinejoin="round" />
            ))}
          </g>
          <g {...an(aktiv, "tv01-v", "tv01-auf", 250, 1400)}>
            {LAND.map((l) => (
              <use key={l} href={`#tv01-${l}`} fill="#08204a" />
            ))}
          </g>
          <g clipPath="url(#tv01-land)">
            <rect x="0" y="0" width="600" height="315" fill="url(#tv01-punkte)" opacity="0.2" {...an(aktiv, "tv01-v", "tv01-auf", 700, 1600)} />
            {aktiv && <rect x="0" y="-20" width="170" height="360" fill="url(#tv01-streif-g)" transform="skewX(-18)" className="tv01-streif" />}
            {/* Bundesländer leuchten beim Eintreffen der Bahn auf */}
            {BAHNEN.map((b) => (
              <use key={b.land} href={`#tv01-${b.land}`} fill={GRUEN} fillOpacity="0.2" {...an(aktiv, "tv01-v", "tv01-glimm", b.landung - 60)} />
            ))}
            {aktiv &&
              BAHNEN.map((b) => (
                <use key={b.land} href={`#tv01-${b.land}`} fill={GRUEN} fillOpacity="0.13" opacity="0" style={{ animation: `tv01-l${b.i} ${b.periode}ms linear ${b.beginn}ms infinite` }} className="tv01-t" />
              ))}
          </g>
          {/* Grenzen zeichnen sich mit hellem Lichtkopf */}
          {LAND.map((l, i) => (
            <use
              key={l}
              href={`#tv01-${l}`}
              fill="none"
              stroke="#c9dcf5"
              strokeOpacity="0.5"
              strokeWidth={1.05 / S}
              strokeLinejoin="round"
              className={`tv-strich ${aktiv ? "tv-zeichnen" : ""}`}
              style={aktiv ? { animationDelay: `${i * 55}ms`, animationDuration: "1500ms" } : undefined}
            />
          ))}
          {aktiv &&
            LAND.map((l, i) => (
              <use
                key={l}
                href={`#tv01-${l}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth={2.6 / S}
                strokeLinecap="round"
                strokeDasharray="0.05 2"
                className="tv01-t tv01-kopf0"
                style={{ animationDelay: `${i * 55}ms, ${i * 55}ms`, animationDuration: "1500ms, 1500ms" }}
              />
            ))}
        </g>

        {/* Lichtbahnen */}
        {BAHNEN.map((b) => (
          <g key={b.n}>
            <path d={b.d} fill="none" stroke={GRUEN} strokeOpacity="0.14" strokeWidth="9" strokeLinecap="round" pathLength="1" className={`tv-strich ${aktiv ? "tv-zeichnen" : ""}`} style={aktiv ? { animationDelay: `${b.start}ms`, animationDuration: `${b.flug}ms` } : undefined} />
            <path d={b.d} fill="none" stroke={GRUEN} strokeOpacity="0.85" strokeWidth="2.4" strokeLinecap="round" pathLength="1" className={`tv-strich ${aktiv ? "tv-zeichnen" : ""}`} style={aktiv ? { animationDelay: `${b.start}ms`, animationDuration: `${b.flug}ms` } : undefined} />
            {aktiv && (
              <>
                {/* Startkopf */}
                <path d={b.d} fill="none" stroke={GRUEN_HELL} strokeWidth="5" strokeLinecap="round" pathLength="1" strokeDasharray="0.14 3" className="tv01-t tv01-kopf1" style={{ animationDelay: `${b.start}ms, ${b.start}ms`, animationDuration: `${b.flug}ms, ${b.flug}ms` }} />
                <path d={b.d} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" pathLength="1" strokeDasharray="0.001 3" className="tv01-t tv01-kopf2" style={{ animationDelay: `${b.start}ms, ${b.start}ms`, animationDuration: `${b.flug}ms, ${b.flug}ms` }} />
                {/* Dauerbetrieb: Energieteilchen mit Schweif */}
                <g className="tv01-t" style={{ animation: `tv01-auf 400ms ease ${b.beginn}ms both` }}>
                  {TEILCHEN.map((t, k) => (
                    <path key={k} d={b.d} fill="none" stroke={t.farbe} strokeOpacity={t.deck} strokeWidth={t.breite} strokeLinecap="round" pathLength="1" strokeDasharray={`${b.teile[k]} 3`} style={{ strokeDashoffset: k === 0 ? b.teile[0] : 1, animation: `tv01-p${b.i}-${k} ${b.periode}ms linear ${b.beginn}ms infinite` }} />
                  ))}
                </g>
              </>
            )}
          </g>
        ))}

        {/* Hauptstädte: Landung, Welle, Beschriftung */}
        {BAHNEN.map((b) => {
          const [x, y] = b.z;
          return (
            <g key={b.n}>
              {aktiv && (
                <>
                  <circle cx={x} cy={y} r="9" fill="none" stroke={GRUEN_HELL} strokeWidth="2.2" className="tv01-t tv01-fb tv01-welle" style={{ animationDelay: `${b.landung}ms` }} />
                  <circle cx={x} cy={y} r="8" fill="none" stroke={GRUEN_HELL} strokeWidth="2" className="tv01-t tv01-fb" style={{ animation: `tv01-w${b.i} ${b.periode}ms linear ${b.beginn}ms infinite` }} />
                </>
              )}
              <g {...an(aktiv, "tv01-v tv01-fb", "tv01-pop", b.landung - 80)}>
                <circle cx={x} cy={y} r="11" fill={GRUEN} fillOpacity="0.22" />
                <circle cx={x} cy={y} r="5.2" fill="#fff" stroke={NAVY} strokeWidth="1.5" />
              </g>
              <g {...an(aktiv, "tv01-v", "tv01-hoch", b.landung + 60)}>
                <text x={x + b.dx} y={y + b.dy} textAnchor={b.a} fontSize="25" fontWeight="600" fill="#fff" fillOpacity="0.93" stroke={NAVY} strokeWidth="7" strokeOpacity="0.9" paintOrder="stroke" strokeLinejoin="round">
                  {b.n}
                </text>
              </g>
            </g>
          );
        })}

        {/* Sitz Ostermiething */}
        <circle cx={hx} cy={hy} r="120" fill="url(#tv01-halo)" {...an(aktiv, "tv01-v", "tv01-auf", 850, 1400)} />
        {aktiv && <circle cx={hx} cy={hy} r="120" fill="url(#tv01-halo)" className="tv01-atmen" style={{ animationDelay: "2200ms" }} opacity="0" />}
        {aktiv && (
          <>
            <circle cx={hx} cy={hy} r="150" fill="none" stroke={SONNE} strokeWidth="2" className="tv01-t tv01-fb tv01-blitz" style={{ animationDelay: "900ms" }} />
            <circle cx={hx} cy={hy} r="10" fill="none" stroke={SONNE} strokeWidth="1.6" className="tv01-t tv01-fb tv01-ring" style={{ animationDelay: "1500ms" }} />
            <circle cx={hx} cy={hy} r="10" fill="none" stroke={SONNE} strokeWidth="1.6" className="tv01-t tv01-fb tv01-ring" style={{ animationDelay: "3300ms" }} />
          </>
        )}
        <g {...an(aktiv, "tv01-v tv01-fb", "tv01-pop", 900, 800)}>
          <circle cx={hx} cy={hy} r="15" fill={SONNE} fillOpacity="0.25" />
          <circle cx={hx} cy={hy} r="9.5" fill={SONNE} stroke={NAVY} strokeWidth="2" />
          <circle cx={hx - 2.5} cy={hy - 2.5} r="3" fill="#fff" fillOpacity="0.75" />
        </g>
        <g {...an(aktiv, "tv01-v", "tv01-hoch", 1150)}>
          <path d={`M${hx} ${hy - 20}V${hy - 104}H${hx - 14}`} fill="none" stroke={SONNE} strokeOpacity="0.7" strokeWidth="1.6" />
          <text x={hx - 24} y={hy - 94} textAnchor="end" fontSize="36" fontWeight="800" letterSpacing="-0.5" fill="#fff" stroke={NAVY} strokeWidth="8" strokeOpacity="0.9" paintOrder="stroke" strokeLinejoin="round" style={DISPLAY}>
            Ostermiething
          </text>
          <text x={hx - 24} y={hy - 62} textAnchor="end" fontSize="23" fontWeight="600" fill={SONNE} stroke={NAVY} strokeWidth="6" strokeOpacity="0.9" paintOrder="stroke" strokeLinejoin="round">
            Sitz, Innviertel
          </text>
        </g>

        {/* Zähler: jede Landung zählt ein Bundesland */}
        <g transform="translate(22 720)">
          {LANDUNGEN.map((t, i) => (
            <text
              key={i}
              x="0"
              y="0"
              fontSize="104"
              fontWeight="800"
              letterSpacing="-3"
              fill="url(#tv01-zahl)"
              style={{ ...DISPLAY, ...(aktiv ? { animationDelay: i < 8 ? `${t}ms, ${LANDUNGEN[i + 1]}ms` : `${t}ms` } : {}) }}
              className={`${i < 8 ? "tv01-t" : "tv01-v"} ${aktiv ? `tv01-zi ${i < 8 ? "tv01-zi-ab" : ""}` : ""}`}
            >
              {i + 1}
            </text>
          ))}
          <g {...an(aktiv, "tv01-v", "tv01-hoch", 1300)}>
            <text x="84" y="-42" fontSize="30" fontWeight="800" fill="#fff" style={DISPLAY}>
              Bundesländer
            </text>
            <text x="84" y="-6" fontSize="23" fill="#fff" fillOpacity="0.62">
              Einsatzgebiet ab Ostermiething
            </text>
          </g>
        </g>
        <g {...an(aktiv, "tv01-v", "tv01-auf", 2600)}>
          <text x="22" y="782" fontSize="19" fill="#fff" fillOpacity="0.36">
            {KARTE_QUELLE}
          </text>
        </g>
      </svg>
    </div>
  );
}
