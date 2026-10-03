// src/components/Loesungen/w25-SolarparkDiorama.js
//
// Gezeichnetes Solarpark-Diorama für den Flächenregler (/freiflaechen-photovoltaik).
// Isometrische Landschaft: Feldflur in Parzellen, Straße mit Mittelspannungsleitung, Hecken,
// Umspannwerk mit Hochspannungsleitung, darüber die Sonnenbahn. Ein Raster aus 12 × 10 Feldern
// à 0,5 ha (= 60 ha) füllt sich – von der Ecke an der Straße aus – mit Modulreihen; Zaun,
// Übergabestation und Kabeltrasse wachsen mit. Über 10 MWp wechselt der Anschluss vom
// Mittelspannungsnetz (Netzebene 5) zum Umspannwerk (Netzebene 4).
// Alle Koordinaten werden einmal beim Laden berechnet und gerundet (Hydration-sicher).
// Klassen und IDs: Präfix w25f. Die Bewegungs-Regeln liegen in FlaechenRegler.js.

export const W25F_RASTER = { NI: 12, NJ: 10 };

const OX = 380;
const OY = 300;
const HX = 20; // halbe Feldbreite (Bildschirm)
const HY = 10; // halbe Feldhöhe
const SOCKEL = 26;
const rd = (v) => Math.round(v * 10) / 10;
const P = (i, j) => [rd(OX + (i - j) * HX), rd(OY + (i + j) * HY)];
const pt = (p, dy = 0) => `${p[0]},${rd(p[1] + dy)}`;
const poly = (pts) => pts.join(" ");
const PLAN = `matrix(${HX} ${HY} ${-HX} ${HY} ${OX} ${OY})`;

const { NI, NJ } = W25F_RASTER;
const GI0 = -3;
const GI1 = 15;
const GJ0 = -3;
const GJ1 = 13;

/* ---------- Zellen: Reihenfolge (wächst von der Ecke an der Straße) und Modulreihen ---------- */
const ZELLEN = [];
for (let j = 0; j < NJ; j++) {
  for (let i = 0; i < NI; i++) {
    const score = Math.max((i + 0.5) / NI, (NJ - 1 - j + 0.5) / NJ);
    let oben = "";
    let front = "";
    let kante = "";
    for (const jr of [0.22, 0.52, 0.82]) {
      const fl = P(i + 0.05, j + jr + 0.09);
      const fr = P(i + 0.95, j + jr + 0.09);
      const br = P(i + 0.95, j + jr - 0.09);
      const bl = P(i + 0.05, j + jr - 0.09);
      oben += `M${pt(fl, -2.5)}L${pt(fr, -2.5)}L${pt(br, -6.5)}L${pt(bl, -6.5)}Z`;
      front += `M${pt(fl, -2.5)}L${pt(fr, -2.5)}L${pt(fr, 0.5)}L${pt(fl, 0.5)}Z`;
      kante += `M${pt(bl, -6.5)}L${pt(br, -6.5)}`;
    }
    const mitte = P(i + 0.5, j + 0.5);
    ZELLEN.push({ i, j, key: `${i}-${j}`, score: score + (i + (NJ - 1 - j)) * 0.0001, oben, front, kante, mitte, tiefe: i + j });
  }
}
const RANG = new Map([...ZELLEN].sort((a, b) => a.score - b.score).map((z, k) => [z.key, k]));
ZELLEN.forEach((z) => (z.rang = RANG.get(z.key)));
const ZELLEN_TIEFE = [...ZELLEN].sort((a, b) => a.tiefe - b.tiefe || a.i - b.i);

/* ---------- Landschaft ---------- */
const PARZELLEN = [
  { i0: -3, j0: -3, i1: 6, j1: 4.2, f: "#6f9343", r: "i" },
  { i0: 6, j0: -3, i1: 15, j1: 3.4, f: "#b39e5c", r: "j" },
  { i0: -3, j0: 4.2, i1: 5, j1: 10.9, f: "#84a855", r: "j" },
  { i0: 5, j0: 3.4, i1: 15, j1: 8.6, f: "#957d57", r: "i" },
  { i0: 5, j0: 8.6, i1: 15, j1: 10.9, f: "#628a39", r: "i" },
  { i0: -3, j0: 11.7, i1: 15, j1: 13, f: "#78a04a", r: "" },
];
const FURCHEN = PARZELLEN.map((p) => {
  let d = "";
  if (p.r === "i") for (let j = p.j0 + 0.35; j < p.j1 - 0.1; j += 0.35) d += `M${p.i0 + 0.1} ${rd(j)}H${p.i1 - 0.1}`;
  if (p.r === "j") for (let i = p.i0 + 0.35; i < p.i1 - 0.1; i += 0.35) d += `M${rd(i)} ${p.j0 + 0.1}V${p.j1 - 0.1}`;
  return d;
});
let RASTER = "";
for (let i = 0; i <= NI; i++) RASTER += `M${i} 0V${NJ}`;
for (let j = 0; j <= NJ; j++) RASTER += `M0 ${j}H${NI}`;

const zufall = (k) => {
  const v = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

function baum(i, j, s, k) {
  const [x, y] = P(i, j);
  return { key: `${i}-${j}`, x, y, s: rd(s), k };
}
const HECKE_HINTEN = [];
for (let i = -2.2, k = 0; i < 14.6; i += 1.15, k++) HECKE_HINTEN.push(baum(rd(i + zufall(k) * 0.3), rd(-2.2 + zufall(k + 9) * 0.5), 0.8 + zufall(k + 3) * 0.35, k));
const HECKE_RECHTS = [];
for (let j = -1.2, k = 40; j < 10.6; j += 1.3, k++) HECKE_RECHTS.push(baum(rd(13.9 + zufall(k) * 0.5), rd(j + zufall(k + 5) * 0.3), 0.75 + zufall(k + 2) * 0.35, k));

/* Mittelspannung entlang der Straße, Hochspannung vom Umspannwerk nach hinten */
const MS_MASTEN = [-2.4, 1.6, 5.6, 9.6, 13.6].map((i) => {
  const [x, y] = P(i, 12.35);
  return { x, y, top: rd(y - 40) };
});
const MS_DRAEHTE = MS_MASTEN.slice(1)
  .map((m, k) => {
    const a = MS_MASTEN[k];
    return [-9, 0, 9]
      .map((dx) => `M${rd(a.x + dx)} ${rd(a.top + 1)}Q${rd((a.x + m.x) / 2 + dx)} ${rd((a.top + m.top) / 2 + 9)} ${rd(m.x + dx)} ${rd(m.top + 1)}`)
      .join("");
  })
  .join("");
const HS_MASTEN = [
  [-1.9, -0.6],
  [-1.9, -2.7],
].map(([i, j]) => {
  const [x, y] = P(i, j);
  return { x, y, top: rd(y - 64) };
});

function kiste(i0, j0, di, dj, h) {
  const a = P(i0, j0);
  const b = P(i0 + di, j0);
  const c = P(i0 + di, j0 + dj);
  const d = P(i0, j0 + dj);
  return {
    oben: poly([pt(a, -h), pt(b, -h), pt(c, -h), pt(d, -h)]),
    links: poly([pt(d, -h), pt(c, -h), pt(c), pt(d)]),
    rechts: poly([pt(b, -h), pt(c, -h), pt(c), pt(b)]),
  };
}
const STATION = kiste(-1.05, 8.7, 0.8, 0.8, 13);
const UW_TRAFOS = [kiste(-2.3, 1.7, 0.7, 0.8, 11), kiste(-2.3, 3.0, 0.7, 0.8, 11)];
const UW_PORTAL = (() => {
  const a = P(-1.1, 1.6);
  const b = P(-1.1, 4.2);
  return `M${a[0]} ${a[1]}V${rd(a[1] - 30)}M${b[0]} ${b[1]}V${rd(b[1] - 30)}M${a[0]} ${rd(a[1] - 27)}L${b[0]} ${rd(b[1] - 27)}`;
})();
const UW_LEITUNG = (() => {
  const a = P(-1.1, 1.6);
  const h0 = HS_MASTEN[0];
  const h1 = HS_MASTEN[1];
  return `M${a[0]} ${rd(a[1] - 27)}Q${rd((a[0] + h0.x) / 2)} ${rd((a[1] - 27 + h0.top) / 2 + 6)} ${h0.x} ${rd(h0.top + 4)}Q${rd((h0.x + h1.x) / 2)} ${rd((h0.top + h1.top) / 2 + 10)} ${h1.x} ${rd(h1.top + 4)}`;
})();

/* Kabeltrassen */
const KABEL_NE5 = (() => {
  const a = P(-0.65, 9.5);
  const b = P(-0.65, 12.35);
  return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
})();
const KABEL_NE4 = (() => {
  const a = P(-1.05, 9.1);
  const b = P(-1.55, 9.1);
  const c = P(-1.55, 4.75);
  return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}`;
})();

/* Sockel (Erdreich) */
const L = P(GI0, GJ1);
const B = P(GI1, GJ1);
const R = P(GI1, GJ0);
const T = P(GI0, GJ0);
const SOCKEL_LINKS = poly([pt(L), pt(B), pt(B, SOCKEL), pt(L, SOCKEL)]);
const SOCKEL_RECHTS = poly([pt(B), pt(R), pt(R, SOCKEL), pt(B, SOCKEL)]);
const BODEN_KANTE = `M${pt(L)}L${pt(B)}L${pt(R)}`;
const BODEN_HINTEN = `M${pt(L)}L${pt(T)}L${pt(R)}`;

/* Sonnenbahn */
const BAHN = { cx: 400, cy: 360, rx: 372, ry: 300 };
const BAHN_D = `M${BAHN.cx - BAHN.rx} ${BAHN.cy}A${BAHN.rx} ${BAHN.ry} 0 0 1 ${BAHN.cx + BAHN.rx} ${BAHN.cy}`;
const SONNE = (() => {
  const phi = Math.PI * 0.64;
  return [rd(BAHN.cx - BAHN.rx * Math.cos(phi)), rd(BAHN.cy - BAHN.ry * Math.sin(phi))];
})();
const STUNDEN = Array.from({ length: 11 }, (_, k) => {
  const phi = (Math.PI * (k + 1)) / 12;
  return { key: k, x: rd(BAHN.cx - BAHN.rx * Math.cos(phi)), y: rd(BAHN.cy - BAHN.ry * Math.sin(phi)) };
});

/* Zaun um die aktive Fläche (Bildschirmkoordinaten) */
function zaunPfad(aktivSet) {
  let d = "";
  const istAn = (i, j) => aktivSet.has(`${i}-${j}`);
  for (const z of ZELLEN) {
    if (!istAn(z.i, z.j)) continue;
    const { i, j } = z;
    if (!istAn(i, j - 1)) d += `M${pt(P(i, j))}L${pt(P(i + 1, j))}`;
    if (!istAn(i, j + 1)) d += `M${pt(P(i, j + 1))}L${pt(P(i + 1, j + 1))}`;
    if (!istAn(i - 1, j)) d += `M${pt(P(i, j))}L${pt(P(i, j + 1))}`;
    if (!istAn(i + 1, j)) d += `M${pt(P(i + 1, j))}L${pt(P(i + 1, j + 1))}`;
  }
  return d;
}

function Baum({ b }) {
  return (
    <g transform={`translate(${b.x} ${b.y}) scale(${b.s})`}>
      <ellipse cx="3" cy="1" rx="11" ry="4.5" fill="#06142e" opacity="0.35" />
      <path d="M0 0V-9" stroke="#6b5a43" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="-4" cy="-15" r="8" fill="url(#w25f-krone)" />
      <circle cx="5" cy="-17" r="8.5" fill="url(#w25f-krone)" />
      <circle cx="0" cy="-23" r="8" fill="url(#w25f-krone)" />
    </g>
  );
}

/**
 * aktiv: Anzahl belegter Felder (0–120) · verz(rang): Übergangsverzögerung je Feld in ms
 * netz4: Anschluss am Umspannwerk · klein: Beschriftung im Bild (MWp) · label: Bildbeschreibung
 */
export default function W25SolarparkDiorama({ aktiv, verz, netz4, klein, label }) {
  const aktivSet = new Set(ZELLEN.filter((z) => z.rang < aktiv).map((z) => z.key));
  const zaun = zaunPfad(aktivSet);

  // Anker für Lichtkegel und Beschriftung: Mitte und Oberkante der belegten Fläche
  let sx = 0;
  let sy = 0;
  let oben = Infinity;
  let links = Infinity;
  let rechts = -Infinity;
  for (const z of ZELLEN) {
    if (!aktivSet.has(z.key)) continue;
    sx += z.mitte[0];
    sy += z.mitte[1];
    oben = Math.min(oben, z.mitte[1] - HY);
    links = Math.min(links, z.mitte[0] - HX);
    rechts = Math.max(rechts, z.mitte[0] + HX);
  }
  const n = Math.max(aktivSet.size, 1);
  const mx = rd(sx / n);
  const my = rd(sy / n);
  const kegel = `M${SONNE[0]} ${SONNE[1]}L${rd(links + 6)} ${my}L${rd(rechts - 6)} ${my}Z`;
  const anker = { x: mx, y: rd(oben - 22) };

  return (
    <svg viewBox="24 44 752 596" className="block h-auto w-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id="w25f-hof">
          <stop offset="0" stopColor="#ffc53d" stopOpacity="0.4" />
          <stop offset="0.4" stopColor="#ffc53d" stopOpacity="0.1" />
          <stop offset="1" stopColor="#ffc53d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="w25f-sonne">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.5" stopColor="#ffd873" />
          <stop offset="1" stopColor="#f5a70f" />
        </radialGradient>
        <linearGradient id="w25f-bahn" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="w25f-kegel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd873" stopOpacity="0.2" />
          <stop offset="1" stopColor="#ffd873" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="w25f-erde-l" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3a28" />
          <stop offset="1" stopColor="#21180f" />
        </linearGradient>
        <linearGradient id="w25f-erde-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2d1f" />
          <stop offset="1" stopColor="#181109" />
        </linearGradient>
        <linearGradient id="w25f-modul" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a78cc" />
          <stop offset="1" stopColor="#123f86" />
        </linearGradient>
        <linearGradient id="w25f-dunst" x1="0" y1="240" x2="0" y2="430" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#041d42" stopOpacity="0.55" />
          <stop offset="1" stopColor="#041d42" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="w25f-krone" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#aed083" />
          <stop offset="0.55" stopColor="#6f9a3f" />
          <stop offset="1" stopColor="#3f6420" />
        </radialGradient>
      </defs>

      {/* ---------- Himmel: Sonnenbahn und Sonne ---------- */}
      <g className="w25f-himmel">
        <path className="w25f-bahn" d={BAHN_D} pathLength="1" fill="none" stroke="url(#w25f-bahn)" strokeWidth="1.5" />
        {STUNDEN.map((s) => (
          <circle key={s.key} className="w25f-stunde" style={{ "--k": s.key }} cx={s.x} cy={s.y} r="2" fill="#fff" opacity="0.28" />
        ))}
        <g className="w25f-sonne">
          <circle cx={SONNE[0]} cy={SONNE[1]} r="36" fill="none" stroke="#ffc53d" strokeOpacity="0.3" strokeWidth="1.5" />
          <circle cx={SONNE[0]} cy={SONNE[1]} r="22" fill="url(#w25f-sonne)" />
        </g>
      </g>

      {/* ---------- Landschaft ---------- */}
      <g className="w25f-land">
        <ellipse cx="400" cy="604" rx="360" ry="32" fill="#020b1f" opacity="0.6" />
        <polygon points={SOCKEL_LINKS} fill="url(#w25f-erde-l)" />
        <polygon points={SOCKEL_RECHTS} fill="url(#w25f-erde-r)" />
        <path d={`M${pt(L, 9)}L${pt(B, 9)}L${pt(R, 9)}`} fill="none" stroke="#000" strokeOpacity="0.22" strokeWidth="1" />

        <g transform={PLAN}>
          {PARZELLEN.map((p, k) => (
            <g key={k}>
              <rect x={p.i0} y={p.j0} width={p.i1 - p.i0} height={p.j1 - p.j0} fill={p.f} />
              {FURCHEN[k] && <path d={FURCHEN[k]} stroke="#000" strokeOpacity="0.13" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" />}
            </g>
          ))}
          {/* Straße */}
          <rect x={GI0} y="10.9" width={GI1 - GI0} height="0.8" fill="#4e5562" />
          <path d={`M${GI0} 11.3H${GI1}`} stroke="#f2f4f7" strokeOpacity="0.55" strokeDasharray="6 7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {/* Umspannwerk: Schotterfläche */}
          <rect x="-2.75" y="1.2" width="2.25" height="3.5" fill="#8d959f" />
          <rect x="-2.75" y="1.2" width="2.25" height="3.5" fill="none" stroke="#e6ebf1" strokeOpacity="0.7" strokeWidth="1" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          {/* belegte Felder: Wiese unter den Modulen */}
          {ZELLEN.map((z) => (
            <rect
              key={z.key}
              x={z.i}
              y={z.j}
              width="1"
              height="1"
              fill="#557f2e"
              className="w25f-wiese"
              style={{ opacity: z.rang < aktiv ? 1 : 0, transitionDelay: `${verz(z.rang)}ms` }}
            />
          ))}
          {/* Maßstab: 0,5-ha-Raster */}
          <path d={RASTER} stroke="#fff" strokeOpacity="0.16" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" />
          <rect x="0" y="0" width={NI} height={NJ} fill="none" stroke="#fff" strokeOpacity="0.3" strokeDasharray="3 4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </g>

        {/* atmosphärischer Dunst nach hinten */}
        <polygon points={poly([pt(L), pt(T), pt(R), pt(P(GI1, 5)), pt(P(5, GJ1))])} fill="url(#w25f-dunst)" opacity="0.6" />
        <path d={BODEN_HINTEN} fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.2" />
        <path d={BODEN_KANTE} fill="none" stroke="#d9f0b8" strokeOpacity="0.45" strokeWidth="1.2" />

        {/* Hecke hinten */}
        {HECKE_HINTEN.map((b) => (
          <Baum key={b.key} b={b} />
        ))}

        {/* Umspannwerk mit Hochspannung */}
        <g className={netz4 ? "w25f-netz is-an" : "w25f-netz"}>
          {HS_MASTEN.map((m) => (
            <g key={m.x}>
              <path d={`M${m.x - 7} ${m.y}L${m.x} ${m.top}L${m.x + 7} ${m.y}M${m.x - 14} ${m.top + 8}H${m.x + 14}M${m.x - 10} ${m.top + 20}H${m.x + 10}`} fill="none" stroke="#d6e2f0" strokeWidth="1.6" strokeLinejoin="round" />
            </g>
          ))}
          <path d={UW_LEITUNG} fill="none" stroke="#d6e2f0" strokeOpacity="0.6" strokeWidth="1" />
          <path d={UW_PORTAL} fill="none" stroke="#d6e2f0" strokeWidth="1.8" />
          {UW_TRAFOS.map((t, k) => (
            <g key={k}>
              <polygon points={t.links} fill="#8f9aa8" />
              <polygon points={t.rechts} fill="#6f7a88" />
              <polygon points={t.oben} fill="#c9d1db" />
            </g>
          ))}
        </g>

        {/* Kabeltrassen mit Energieimpulsen */}
        <path d={KABEL_NE5} fill="none" stroke="#ffd873" strokeOpacity={!netz4 ? 0.35 : 0} strokeWidth="2.5" className="w25f-trasse" />
        <path d={KABEL_NE5} fill="none" stroke="#ffd873" strokeWidth="2.5" strokeLinecap="round" className={!netz4 ? "w25f-impuls is-an" : "w25f-impuls"} />
        <path d={KABEL_NE4} fill="none" stroke="#ffd873" strokeOpacity={netz4 ? 0.35 : 0} strokeWidth="2.5" className="w25f-trasse" />
        <path d={KABEL_NE4} fill="none" stroke="#ffd873" strokeWidth="2.5" strokeLinecap="round" className={netz4 ? "w25f-impuls is-an" : "w25f-impuls"} />

        {/* Lichtkegel von der Sonne auf den Park */}
        <path className="w25f-kegel" d={kegel} style={{ d: `path("${kegel}")` }} fill="url(#w25f-kegel)" />

        {/* Modulreihen */}
        {ZELLEN_TIEFE.map((z) => {
          const an = z.rang < aktiv;
          return (
            <g key={z.key} className={an ? "w25f-mod is-an" : "w25f-mod"} style={{ transitionDelay: `${verz(z.rang)}ms` }}>
              <path d={z.front} fill="#0a2550" />
              <path d={z.oben} fill="url(#w25f-modul)" />
              <path d={z.kante} stroke="#cfe2ff" strokeOpacity="0.7" strokeWidth="0.9" fill="none" />
            </g>
          );
        })}

        {/* Zaun */}
        <path d={zaun} fill="none" stroke="#f4f7fb" strokeOpacity="0.75" strokeWidth="1.3" strokeDasharray="2.5 2.5" className="w25f-zaun" />

        {/* Übergabestation */}
        <g>
          <polygon points={STATION.links} fill="#c3cad4" />
          <polygon points={STATION.rechts} fill="#97a2b0" />
          <polygon points={STATION.oben} fill="#eef2f6" />
          <circle cx={P(-0.65, 9.1)[0]} cy={rd(P(-0.65, 9.1)[1] - 22)} r="3" fill="#ffc53d" className="w25f-lampe" />
        </g>

        {/* Hecke rechts (vorne) */}
        {HECKE_RECHTS.map((b) => (
          <Baum key={b.key} b={b} />
        ))}

        {/* Mittelspannung an der Straße */}
        <g className={netz4 ? "w25f-netz" : "w25f-netz is-an"}>
          <path d={MS_DRAEHTE} fill="none" stroke="#d6e2f0" strokeOpacity="0.55" strokeWidth="0.9" />
          {MS_MASTEN.map((m) => (
            <g key={m.x}>
              <path d={`M${m.x} ${m.y}V${m.top}M${m.x - 11} ${m.top + 2}H${m.x + 11}`} stroke="#e6ecf3" strokeWidth="2" strokeLinecap="round" />
              {[-9, 0, 9].map((dx) => (
                <circle key={dx} cx={m.x + dx} cy={m.top + 1} r="1.6" fill="#fff" />
              ))}
            </g>
          ))}
        </g>
      </g>

      {/* Beschriftung, wandert mit der belegten Fläche */}
      {klein && (
        <g className="w25f-anker max-md:hidden" style={{ transform: `translate(${anker.x}px, ${anker.y}px)` }}>
          <line x1="0" y1="0" x2="0" y2="-26" stroke="#fff" strokeOpacity="0.55" strokeWidth="1" />
          <circle r="3" fill="#ffd873" />
          <g transform="translate(0 -42)">
            <rect x="-52" y="-15" width="104" height="30" rx="15" fill="#03122b" fillOpacity="0.82" stroke="#fff" strokeOpacity="0.22" />
            <text x="0" y="5.5" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" style={{ fontFamily: "var(--font-display)" }}>
              {klein}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}
