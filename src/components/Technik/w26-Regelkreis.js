// src/components/Technik/w26-Regelkreis.js
//
// Bühnen-Schema „Ein Regelkreis, drei eigene Systeme“ für /technik (Server-Komponente, reines SVG).
// Weitergedacht aus dem Startseiten-Schema (s08) und der TV-Folie „Regelung“ (tv09):
// gezeichneter PV-Park, Wechselrichter, der Parkregler als Gerät mit Regel-Bildschirm,
// Netzanschlusspunkt und Netzbetreiber als Strommast; darüber die SCADA-Leitwarte mit drei
// schematischen Fenstern, dazwischen die gesicherte Fernwartung.
//
// Dauerbewegung (rein dekorativ, ohne Werte): Energiepakete auf der Leitung, Datenimpulse zur
// Leitwarte und alle 7 s ein Sollwert des Netzbetreibers. Trifft er ein, springt die Sollwert-
// Linie im Regler-Bildschirm nach unten und die Leistungskurve folgt – ein Sollwertsprung.
//
// Zwei Fassungen: quer ab lg (Raster 1280 × 620) und hochkant darunter (Raster 360 × 850).
// Gruppen (`data-g`) erlauben das Hervorheben eines Systems, sobald eine Karte mit
// `.w26-sys[data-sys=regler|fern|scada]` überfahren oder fokussiert wird (CSS :has).
// Aufbau startet, wenn <W26Buehne> `data-an` setzt; ohne JS bzw. bei reduzierter Bewegung steht
// der Endzustand. Alle Klassen, Keyframes und IDs tragen das Präfix w26.

import { MonitorDot, Lock, PlugZap, Zap } from "lucide-react";

const GRUEN = "#8cba58";
const GRUEN_HELL = "#aed083";
const SONNE = "#ffc53d";
const NAVY = "#03122b";
const DISPLAY = { fontFamily: "var(--font-display)" };
const rd = (v) => Math.round(v * 10) / 10;
const TAKT = 2800; // erster Sollwert, danach alle 7 s

/** Aufbau-Klasse mit Verzögerung (ms) und optionaler Dauer. */
const an = (klasse, ms = 0, dauer) => ({ className: klasse, style: { "--d": `${ms}ms`, ...(dauer ? { "--t": `${dauer}ms` } : {}) } });

function Ikon({ icon: I, x, y, s, farbe = "#fff", breite = 1.7 }) {
  return <I x={rd(x - s / 2)} y={rd(y - s / 2)} width={s} height={s} color={farbe} strokeWidth={breite} aria-hidden="true" />;
}

/** Nummern-Marke 01/02/03 – verbindet Schema und Systemkarten. */
function Marke({ x, y, n, r = 15, fs = 13 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 4} fill={NAVY} />
      <circle cx={x} cy={y} r={r} fill={GRUEN} />
      <text x={x} y={rd(y + fs * 0.36)} textAnchor="middle" fontSize={fs} fontWeight="800" fill={NAVY} style={DISPLAY}>
        {n}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Gemeinsame Verläufe                                                  */
/* ------------------------------------------------------------------ */

function Defs({ p, leitung }) {
  return (
    <>
      <linearGradient id={`${p}-kachel`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0f3263" />
        <stop offset="1" stopColor="#061a3a" />
      </linearGradient>
      <linearGradient id={`${p}-kachel-r`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.36" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id={`${p}-geraet`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2c5e2e" />
        <stop offset="1" stopColor="#0f2914" />
      </linearGradient>
      <linearGradient id={`${p}-glas`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.085" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.02" />
      </linearGradient>
      <linearGradient id={`${p}-glas-r`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.06" />
      </linearGradient>
      <linearGradient id={`${p}-modul`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d56a8" />
        <stop offset="1" stopColor="#0b2a5c" />
      </linearGradient>
      <linearGradient id={`${p}-kurve`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={GRUEN} stopOpacity="0.36" />
        <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${p}-glanz`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${p}-halo`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={GRUEN} stopOpacity="0.5" />
        <stop offset="0.55" stopColor={GRUEN} stopOpacity="0.13" />
        <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${p}-paket-halo`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0.75" />
        <stop offset="1" stopColor={GRUEN_HELL} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${p}-daten-halo`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${p}-schweif`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0" />
        <stop offset="0.75" stopColor={GRUEN_HELL} stopOpacity="0.6" />
        <stop offset="1" stopColor="#f4fbe9" />
      </linearGradient>
      <linearGradient id={`${p}-schweif-y`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0" />
        <stop offset="0.75" stopColor={GRUEN_HELL} stopOpacity="0.6" />
        <stop offset="1" stopColor="#f4fbe9" />
      </linearGradient>
      <linearGradient id={`${p}-leitung`} gradientUnits="userSpaceOnUse" {...leitung}>
        <stop offset="0" stopColor={GRUEN_HELL} />
        <stop offset="1" stopColor={GRUEN} />
      </linearGradient>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Gezeichnete Bauteile (lokale Koordinaten, per transform skaliert)    */
/* ------------------------------------------------------------------ */

/** PV-Park: vier Modultische in leichter Perspektive, Lichtkante wandert darüber. Lokal 200 × 150. */
function PvPark({ x, y, s = 1, p }) {
  const reihen = [0, 1, 2, 3].map((i) => {
    const oy = i * 37;
    const ein = 26 - i * 7; // oben schmaler → Tiefe
    return { oy, l0: ein + 8, r0: 200 - ein - 8, l1: ein, r1: 200 - ein, h: 27 };
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={`${p}-feld`}>
          {reihen.map((r) => (
            <path key={r.oy} d={`M${r.l0} ${r.oy}H${r.r0}L${r.r1} ${r.oy + r.h}H${r.l1}Z`} />
          ))}
        </clipPath>
      </defs>
      {reihen.map((r, i) => {
        const zellen = [];
        for (let k = 1; k < 10; k++) {
          const t = k / 10;
          zellen.push(`M${rd(r.l0 + (r.r0 - r.l0) * t)} ${r.oy}L${rd(r.l1 + (r.r1 - r.l1) * t)} ${r.oy + r.h}`);
        }
        return (
          <g key={r.oy} {...an("w26-heben", 140 + i * 70)}>
            <path d={`M${r.l1 + 6} ${r.oy + r.h}V${r.oy + r.h + 6}M${r.r1 - 6} ${r.oy + r.h}V${r.oy + r.h + 6}`} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
            <path d={`M${r.l0} ${r.oy}H${r.r0}L${r.r1} ${r.oy + r.h}H${r.l1}Z`} fill={`url(#${p}-modul)`} stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" strokeLinejoin="round" />
            <path d={`${zellen.join("")}M${rd((r.l0 + r.l1) / 2)} ${r.oy + r.h / 2}H${rd((r.r0 + r.r1) / 2)}`} stroke="rgba(255,255,255,0.14)" strokeWidth="0.9" />
          </g>
        );
      })}
      {/* Lichtkante, wandert schräg über die Module */}
      <g clipPath={`url(#${p}-feld)`}>
        <rect x="-60" y="-10" width="46" height="170" fill={`url(#${p}-glanz)`} transform="skewX(-22)" className="w26-amb w26-glanz" style={{ "--d": `${TAKT - 1400}ms` }} />
      </g>
    </g>
  );
}

/** Strommast als Linienzeichnung. Lokal: Mitte x = 0, Spitze y = 0, Fuß y = 190. */
function Mast({ x, y, s = 1 }) {
  const fuss = 190;
  const bein = (dy) => rd(8 + (26 * dy) / fuss);
  const streben = [];
  for (let k = 0; k < 5; k++) {
    const a = 46 + k * 28;
    const b = a + 28;
    streben.push(`M${-bein(a)} ${a}L${bein(b)} ${b}M${bein(a)} ${a}L${-bein(b)} ${b}`);
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g stroke="rgba(255,255,255,0.78)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={`M-4 0L${-bein(fuss)} ${fuss}M4 0L${bein(fuss)} ${fuss}M-4 0H4`} />
        <path d="M-56 26H56M-42 58H42" />
        <path d="M-56 26L-8 12M56 26L8 12M-42 58L-11 46M42 58L11 46" strokeOpacity="0.6" />
      </g>
      <path d={streben.join("")} stroke="rgba(255,255,255,0.3)" strokeWidth="1.3" fill="none" />
      {[-52, 52, -38, 38].map((dx, i) => (
        <g key={dx}>
          <line x1={dx} x2={dx} y1={i < 2 ? 26 : 58} y2={i < 2 ? 40 : 72} stroke={GRUEN_HELL} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx={dx} cy={i < 2 ? 42 : 74} r="2.6" fill={GRUEN_HELL} />
        </g>
      ))}
      <line x1={-44} x2={44} y1={fuss} y2={fuss} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

/*
 * Parkregler als Gerät: Kopfleiste mit Status-LEDs, Bildschirm mit Sollwert-Linie (gelb) und
 * Leistungskurve (grün). Lokal 260 × 196. Die Kurve ist periodisch (P = 112) und läuft endlos.
 */
const SCR = { x: 18, y: 40, w: 224, h: 112 };
const WP = 112;
function welle() {
  const pts = [];
  for (let x = 0; x <= WP * 2 + SCR.w + 8; x += 4) {
    const t = (2 * Math.PI * x) / WP;
    const y = SCR.y + 46 - 4.5 * Math.sin(t) - 3 * Math.sin(3 * t + 1) - 1.8 * Math.sin(7 * t + 2);
    pts.push(`${x} ${rd(y)}`);
  }
  const linie = `M${pts.join("L")}`;
  return { linie, flaeche: `${linie}V${SCR.y + SCR.h + 60}H0Z` };
}
const WELLE = welle();

function Geraet({ x, y, s = 1, p, details = true }) {
  const w = 260;
  const h = 196;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={`${p}-schirm`}>
          <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx="10" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width={w} height={h} rx="30" fill={`url(#${p}-geraet)`} />
      <rect x="1.25" y="1.25" width={w - 2.5} height={h - 2.5} rx="28.75" fill="none" stroke={GRUEN} strokeWidth="2.5" />
      <line x1="28" x2={w - 28} y1="1.6" y2="1.6" stroke="#fff" strokeOpacity="0.42" strokeWidth="1.6" strokeLinecap="round" />
      {/* Kopfleiste */}
      {details && (
        <text x="22" y="27" fontSize="11.5" fontWeight="800" letterSpacing="1.8" fill="rgba(230,241,216,0.75)" style={DISPLAY}>
          EZA-REGLER
        </text>
      )}
      <circle cx={w - 58} cy="22" r="4" fill={GRUEN_HELL} />
      <circle cx={w - 42} cy="22" r="4" fill={GRUEN_HELL} fillOpacity="0.45" />
      <circle cx={w - 26} cy="22" r="4" fill={SONNE} className="w26-amb w26-led" style={{ "--d": `${TAKT}ms` }} />
      <circle cx={w - 26} cy="22" r="4" fill={SONNE} fillOpacity="0.25" />

      {/* Bildschirm */}
      <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx="10" fill="rgba(3,18,43,0.82)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      <g clipPath={`url(#${p}-schirm)`}>
        {[1, 2, 3].map((k) => (
          <line key={`h${k}`} x1={SCR.x} x2={SCR.x + SCR.w} y1={rd(SCR.y + (k * SCR.h) / 4)} y2={rd(SCR.y + (k * SCR.h) / 4)} stroke="rgba(255,255,255,0.06)" />
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map((k) => (
          <line key={`v${k}`} x1={rd(SCR.x + (k * SCR.w) / 8)} x2={rd(SCR.x + (k * SCR.w) / 8)} y1={SCR.y} y2={SCR.y + SCR.h} stroke="rgba(255,255,255,0.045)" />
        ))}
        {/* Leistungskurve: folgt dem Sollwert */}
        <g className="w26-amb-fix w26-niveau" style={{ "--d": `${TAKT}ms` }}>
          <g transform={`translate(${SCR.x} 0)`}>
            <g className="w26-amb-fix w26-welle">
              <path d={WELLE.flaeche} fill={`url(#${p}-kurve)`} />
              <path d={WELLE.linie} fill="none" stroke={GRUEN_HELL} strokeWidth="2.4" strokeLinejoin="round" />
            </g>
          </g>
        </g>
        {/* Sollwert-Linie */}
        <g className="w26-amb-fix w26-limit" style={{ "--d": `${TAKT}ms` }}>
          <line x1={SCR.x} x2={SCR.x + SCR.w} y1={SCR.y + 22} y2={SCR.y + 22} stroke={SONNE} strokeWidth="2" strokeDasharray="6 5" />
          {details && (
            <>
              <rect x={SCR.x + SCR.w - 70} y={SCR.y + 9} width="62" height="18" rx="9" fill={NAVY} stroke="rgba(255,197,61,0.55)" strokeWidth="1" />
              <text x={SCR.x + SCR.w - 39} y={SCR.y + 22} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={SONNE} style={DISPLAY}>
                Sollwert
              </text>
            </>
          )}
        </g>
      </g>
      {/* Größen, die der Regler führt */}
      {details &&
        ["P", "Q(U)", "cos φ"].map((t, i) => (
          <g key={t}>
            <rect x={18 + i * 78} y="164" width="68" height="20" rx="10" fill="rgba(255,255,255,0.07)" stroke="rgba(174,208,131,0.35)" strokeWidth="1" />
            <text x={52 + i * 78} y="178" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={GRUEN_HELL} style={DISPLAY}>
              {t}
            </text>
          </g>
        ))}
    </g>
  );
}

/* ================================================================== */
/* Quer (ab lg)                                                        */
/* ================================================================== */

const Q = {
  sc: { x: 40, y: 22, w: 1200, h: 112 },
  cy: 360,
  pv: 150,
  wr: 400,
  rg: 640,
  nap: 880,
  mast: 1132,
  r: 52,
  dev: { x: 510, y: 262, w: 260, h: 196 },
  lock: 180,
  pille: 220,
  label: 500,
};
const Q_SC_U = Q.sc.y + Q.sc.h;
const Q_SOLL = `M${Q.mast} 538C${Q.mast} 606 ${Q.rg} 606 ${Q.rg} 544`;
const Q_LEITUNG = { a: 262, b: 1104 };

// Schematische Tagesganglinie im SCADA-Fenster (ohne Werte)
function tageskurve(w, h, x0, y0) {
  const pts = [];
  for (let x = 0; x <= w; x += 4) {
    const t = x / w;
    const glocke = Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 0.08) / 0.84))));
    const wolke = 0.07 * Math.sin(t * 41) + 0.05 * Math.sin(t * 97 + 1);
    const y = y0 + h - 8 - (h - 22) * Math.pow(glocke, 1.4) * (1 + (glocke > 0.2 ? wolke : 0));
    pts.push(`${rd(x0 + x)} ${rd(y)}`);
  }
  const linie = `M${pts.join("L")}`;
  return { linie, flaeche: `${linie}L${x0 + w} ${y0 + h}L${x0} ${y0 + h}Z` };
}
const FENSTER = [
  { id: "portfolio", x: 548, w: 196, t: "Portfolio" },
  { id: "verlauf", x: 760, w: 248, t: "Tagesverlauf" },
  { id: "meldungen", x: 1024, w: 196, t: "Meldungen" },
];
const FY = 40;
const FH = 76;
const KURVE = tageskurve(FENSTER[1].w - 16, FH - 24, FENSTER[1].x + 8, FY + 20);

function ScadaFenster() {
  return (
    <>
      {FENSTER.map((f, i) => (
        <g key={f.id} {...an("w26-heben", 600 + i * 120)}>
          <rect x={f.x} y={FY} width={f.w} height={FH} rx="12" fill="rgba(3,18,43,0.6)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
          <text x={f.x + 12} y={FY + 15} fontSize="9.5" fontWeight="700" letterSpacing="1.4" fill="rgba(255,255,255,0.38)">
            {f.t.toUpperCase()}
          </text>
        </g>
      ))}
      {/* Portfolio: Anlagenzeilen, eine mit Hinweis */}
      <g {...an("w26-heben", 700)}>
        {[
          { y: 66, w: 110, f: GRUEN },
          { y: 82, w: 134, f: GRUEN },
          { y: 98, w: 76, f: SONNE, alarm: true },
        ].map((z) => (
          <g key={z.y}>
            <circle cx={FENSTER[0].x + 16} cy={z.y} r="4" fill={z.f} className={z.alarm ? "w26-amb-fix w26-blink" : undefined} />
            <rect x={FENSTER[0].x + 28} y={z.y - 2.5} width="152" height="5" rx="2.5" fill="rgba(255,255,255,0.09)" />
            <rect x={FENSTER[0].x + 28} y={z.y - 2.5} width={z.w} height="5" rx="2.5" fill={z.f} fillOpacity={z.alarm ? 0.85 : 0.6} />
          </g>
        ))}
      </g>
      {/* Tagesverlauf mit wanderndem Cursor */}
      <path d={KURVE.flaeche} fill="url(#w26q-kurve)" {...an("w26-heben", 1500)} />
      <path d={KURVE.linie} fill="none" stroke={GRUEN_HELL} strokeWidth="2.2" strokeLinejoin="round" pathLength={1} {...an("w26-strich", 1000, 1600)} />
      <g className="w26-amb w26-cursor" style={{ "--d": `${TAKT}ms`, "--w26-dx": `${FENSTER[1].w - 24}px` }}>
        <line x1={FENSTER[1].x + 12} x2={FENSTER[1].x + 12} y1={FY + 22} y2={FY + FH - 6} stroke="#fff" strokeOpacity="0.45" strokeWidth="1.2" />
      </g>
      {/* Meldungen */}
      <g {...an("w26-heben", 900)}>
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <rect x={FENSTER[2].x + 12} y={FY + 25 + k * 16} width={FENSTER[2].w - 24} height="11" rx="5.5" fill="rgba(255,255,255,0.05)" />
            <circle cx={FENSTER[2].x + 22} cy={FY + 30.5 + k * 16} r="3" fill={k === 0 ? SONNE : GRUEN} fillOpacity={k === 0 ? 1 : 0.75} />
            <rect x={FENSTER[2].x + 32} y={FY + 28.5 + k * 16} width={[96, 120, 82][k]} height="4" rx="2" fill="rgba(255,255,255,0.28)" />
          </g>
        ))}
      </g>
    </>
  );
}

function SchemaQuer() {
  const { sc, cy, r, dev, lock, pille, label } = Q;
  const fernZiele = [
    { x: Q.wr, unten: cy - r },
    { x: Q.rg, unten: pille },
    { x: Q.nap, unten: cy - r },
  ];
  return (
    <svg viewBox="0 0 1280 620" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <defs>
        <Defs p="w26q" leitung={{ x1: Q_LEITUNG.a, y1: 0, x2: Q_LEITUNG.b, y2: 0 }} />
        <mask id="w26q-soll-maske" maskUnits="userSpaceOnUse" x="0" y="0" width="1280" height="620">
          <path d={Q_SOLL} fill="none" stroke="#fff" strokeWidth="26" pathLength={1} {...an("w26-strich", 1700, 1100)} />
        </mask>
      </defs>

      {/* ============ 03 · SCADA & Leitwarte ============ */}
      <g data-g="scada">
        <g {...an("w26-heben", 0)}>
          <rect x={sc.x} y={sc.y} width={sc.w} height={sc.h} rx="24" fill="url(#w26q-glas)" />
          <rect x={sc.x + 0.75} y={sc.y + 0.75} width={sc.w - 1.5} height={sc.h - 1.5} rx="23.25" fill="none" stroke="url(#w26q-glas-r)" strokeWidth="1.5" />
          <line x1={sc.x + 40} x2={sc.x + sc.w - 40} y1={sc.y + 1} y2={sc.y + 1} stroke="#fff" strokeOpacity="0.28" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx={sc.x + 66} cy={sc.y + sc.h / 2} r="32" fill="rgba(140,186,88,0.13)" stroke="rgba(174,208,131,0.45)" strokeWidth="1.5" />
          <Ikon icon={MonitorDot} x={sc.x + 66} y={sc.y + sc.h / 2} s={32} farbe={GRUEN_HELL} />
          <text x={sc.x + 118} y={sc.y + 50} fontSize="25" fontWeight="800" fill="#fff" letterSpacing="-0.4" style={DISPLAY}>
            SCADA & Leitwarte
          </text>
          <text x={sc.x + 118} y={sc.y + 80} fontSize="15.5" fill="rgba(255,255,255,0.6)">
            Performance Ratio · Verfügbarkeit · Alarme
          </text>
        </g>
        <ScadaFenster />
        <rect className="w26-hl" data-hl="scada" x={sc.x - 6} y={sc.y - 6} width={sc.w + 12} height={sc.h + 12} rx="29" fill="none" stroke={GRUEN_HELL} strokeWidth="2" />
        <g {...an("w26-pop", 500)}>
          <Marke x={sc.x + 8} y={sc.y + 6} n="03" />
        </g>
      </g>

      {/* Anschlusspunkte unter der Leitwarte */}
      <g data-g="scada fern">
        <g {...an("w26-heben", 300)}>
          {fernZiele.map((z) => (
            <circle key={`a${z.x}`} cx={z.x} cy={Q_SC_U} r="5.5" fill={NAVY} stroke="#fff" strokeWidth="2" />
          ))}
        </g>
      </g>

      {/* ============ 02 · Fernwartung ============ */}
      <g data-g="fern">
        <g {...an("w26-heben", 1250)}>
          <Marke x={66} y={lock + 4} n="02" />
          <text x="94" y={lock} fontSize="20" fontWeight="800" fill="#fff" style={DISPLAY}>
            Fernwartung
          </text>
          <text x="94" y={lock + 23} fontSize="15" fill="rgba(255,255,255,0.58)">
            gesichert, mit MFA & Protokoll
          </text>
          <path d={`M300 ${lock + 4}H${Q.wr - 24}`} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" fill="none" />
        </g>
        {fernZiele.map((z, n) => (
          <g key={`f${z.x}`}>
            <line x1={z.x} x2={z.x} y1={Q_SC_U + 6} y2={z.unten} stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" {...an("w26-wachsen", 900 + n * 90)} />
            <line className="w26-hl" data-hl="fern" x1={z.x} x2={z.x} y1={Q_SC_U + 6} y2={z.unten} stroke={GRUEN_HELL} strokeWidth="3" strokeDasharray="3 7" strokeLinecap="round" />
            <g className="w26-amb w26-daten" style={{ "--d": `${TAKT - 400 + n * 900}ms`, "--w26-dy": `${Q_SC_U - z.unten + 12}px` }}>
              <circle cx={z.x} cy={z.unten - 8} r="13" fill="url(#w26q-daten-halo)" />
              <rect x={z.x - 2.5} y={z.unten - 16} width="5" height="15" rx="2.5" fill="#fff" />
            </g>
            <g {...an("w26-pop", 1150 + n * 90)}>
              <circle cx={z.x} cy={lock + 4} r="16" fill={NAVY} stroke="rgba(174,208,131,0.65)" strokeWidth="1.6" />
              <Ikon icon={Lock} x={z.x} y={lock + 4} s={15} farbe={GRUEN_HELL} breite={2} />
            </g>
          </g>
        ))}
      </g>

      {/* ============ Energieleitung ============ */}
      <g data-g="basis">
        <line x1={Q_LEITUNG.a} x2={Q_LEITUNG.b} y1={cy} y2={cy} stroke={GRUEN} strokeOpacity="0.16" strokeWidth="14" strokeLinecap="round" pathLength={1} {...an("w26-strich", 380, 1500)} />
        <line x1={Q_LEITUNG.a} x2={Q_LEITUNG.b} y1={cy} y2={cy} stroke="url(#w26q-leitung)" strokeWidth="4" strokeLinecap="round" pathLength={1} {...an("w26-strich", 380, 1500)} />
        {[0, 1, 2, 3].map((k) => (
          <g key={`e${k}`} className="w26-amb w26-paket-x" style={{ "--d": `${TAKT - 900 + k * 1200}ms`, "--w26-dx": `${Q_LEITUNG.b - Q_LEITUNG.a}px` }}>
            <ellipse cx={Q_LEITUNG.a} cy={cy} rx="28" ry="17" fill="url(#w26q-paket-halo)" />
            <rect x={Q_LEITUNG.a - 100} y={cy - 3.5} width="104" height="7" rx="3.5" fill="url(#w26q-schweif)" />
          </g>
        ))}
      </g>

      {/* Parkregler-Halo */}
      <g data-g="regler">
        <ellipse cx={Q.rg} cy={cy} rx="260" ry="190" fill="url(#w26q-halo)" {...an("w26-heben", 700)} />
      </g>

      {/* ============ Komponenten ============ */}
      {/* PV-Park */}
      <g data-g="basis">
        <PvPark x={Q.pv - 100} y={292} p="w26q" />
        <circle cx={Q_LEITUNG.a} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" {...an("w26-pop", 400)} />
        <text x={Q.pv} y={label} textAnchor="middle" fontSize="19" fontWeight="800" fill="#fff" style={DISPLAY} {...an("w26-heben", 260)}>
          PV-Park
        </text>
      </g>

      {/* Wechselrichter, Netzanschlusspunkt */}
      {[
        { x: Q.wr, icon: Zap, l: "Wechselrichter", unter: "verschiedene Hersteller", g: "basis fern", i: 1 },
        { x: Q.nap, icon: PlugZap, l: "Netzanschlusspunkt", unter: "Messung · Zähler", g: "basis fern regler", i: 3 },
      ].map((k) => (
        <g key={k.l} data-g={k.g}>
          <g {...an("w26-pop", 120 + k.i * 110)}>
            <rect x={k.x - Q.r} y={cy - Q.r} width={Q.r * 2} height={Q.r * 2} rx="24" fill="url(#w26q-kachel)" />
            <rect x={k.x - Q.r + 0.75} y={cy - Q.r + 0.75} width={Q.r * 2 - 1.5} height={Q.r * 2 - 1.5} rx="23.25" fill="none" stroke="url(#w26q-kachel-r)" strokeWidth="1.5" />
            <line x1={k.x - Q.r + 20} x2={k.x + Q.r - 20} y1={cy - Q.r + 1.5} y2={cy - Q.r + 1.5} stroke="#fff" strokeOpacity="0.24" strokeWidth="1.5" strokeLinecap="round" />
            <Ikon icon={k.icon} x={k.x} y={cy} s={42} />
            <circle cx={k.x - Q.r} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />
            <circle cx={k.x + Q.r} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />
          </g>
          <g {...an("w26-heben", 260 + k.i * 110)}>
            <text x={k.x} y={label} textAnchor="middle" fontSize="19" fontWeight="800" fill="#fff" letterSpacing="-0.2" style={DISPLAY}>
              {k.l}
            </text>
            <text x={k.x} y={label + 24} textAnchor="middle" fontSize="15" fontWeight="600" fill="rgba(255,255,255,0.55)">
              {k.unter}
            </text>
          </g>
        </g>
      ))}

      {/* 01 · Parkregler */}
      <g data-g="regler fern">
        <rect x={dev.x} y={dev.y} width={dev.w} height={dev.h} rx="30" fill="none" stroke={GRUEN_HELL} strokeWidth="2.5" className="w26-amb w26-ring" style={{ "--d": `${TAKT}ms` }} />
        <rect x={dev.x} y={dev.y} width={dev.w} height={dev.h} rx="30" fill="none" stroke={GRUEN_HELL} strokeWidth="1.5" className="w26-amb w26-ring" style={{ "--d": `${TAKT + 380}ms` }} />
        <rect className="w26-hl" data-hl="regler" x={dev.x - 9} y={dev.y - 9} width={dev.w + 18} height={dev.h + 18} rx="38" fill="none" stroke={GRUEN_HELL} strokeWidth="2" />
        <g {...an("w26-pop", 340)}>
          <Geraet x={dev.x} y={dev.y} p="w26q" />
          <circle cx={dev.x} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />
          <circle cx={dev.x + dev.w} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />
        </g>
        <g {...an("w26-heben", 480)}>
          <text x={Q.rg} y={label} textAnchor="middle" fontSize="19" fontWeight="800" fill="#fff" letterSpacing="-0.2" style={DISPLAY}>
            Parkregler
          </text>
          <text x={Q.rg} y={label + 24} textAnchor="middle" fontSize="15" fontWeight="600" fill={GRUEN_HELL}>
            EZA-Regler
          </text>
        </g>
        <g {...an("w26-heben", 1300)}>
          <rect x={Q.rg - 98} y={pille} width="196" height="32" rx="16" fill={GRUEN} />
          <text x={Q.rg} y={pille + 21.5} textAnchor="middle" fontSize="15.5" fontWeight="800" fill={NAVY} style={DISPLAY}>
            eigene Entwicklung
          </text>
        </g>
        <g {...an("w26-pop", 600)}>
          <Marke x={dev.x + 4} y={dev.y + 4} n="01" />
        </g>
      </g>

      {/* Netzbetreiber (Strommast) */}
      <g data-g="basis regler">
        <g {...an("w26-heben", 560)}>
          <Mast x={Q.mast} y={268} />
          {/* abgehende Leitungen */}
          <path d={`M${Q.mast + 52} 310Q1226 326 1280 316M${Q.mast + 38} 342Q1220 360 1280 352`} stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" fill="none" />
          <circle cx={Q_LEITUNG.b} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />
        </g>
        <text x={Q.mast} y={label} textAnchor="middle" fontSize="19" fontWeight="800" fill="#fff" letterSpacing="-0.2" style={DISPLAY} {...an("w26-heben", 700)}>
          Netzbetreiber
        </text>
      </g>

      {/* ============ Sollwerte des Netzbetreibers → Parkregler ============ */}
      <g data-g="regler">
        <path d={Q_SOLL} fill="none" stroke={SONNE} strokeWidth="2.6" strokeDasharray="8 7" mask="url(#w26q-soll-maske)" />
        <path d={Q_SOLL} fill="none" stroke={SONNE} strokeOpacity="0.28" strokeWidth="14" strokeLinecap="round" pathLength={1} className="w26-amb w26-komet" style={{ "--d": `${TAKT}ms` }} />
        <path d={Q_SOLL} fill="none" stroke="#fff3cf" strokeWidth="4.5" strokeLinecap="round" pathLength={1} className="w26-amb w26-komet" style={{ "--d": `${TAKT}ms` }} />
        <circle cx={Q.mast} cy="538" r="7" fill="none" stroke={SONNE} strokeWidth="2" className="w26-amb w26-sender" style={{ "--d": `${TAKT}ms` }} />
        <g {...an("w26-heben", 2300)}>
          <circle cx={Q.mast} cy="538" r="4.5" fill={SONNE} />
          <path d={`M${Q.rg - 11} 556L${Q.rg} 543L${Q.rg + 11} 556`} fill="none" stroke={SONNE} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g {...an("w26-heben", 2100)}>
          <rect x="766" y="574" width="238" height="30" rx="15" fill={NAVY} stroke="rgba(255,197,61,0.45)" strokeWidth="1.2" />
          <text x="885" y="594" textAnchor="middle" fontSize="15" fontWeight="700" fill={SONNE} style={DISPLAY}>
            Sollwerte nach TOR Erzeuger
          </text>
        </g>
      </g>
    </svg>
  );
}

/* ================================================================== */
/* Hochkant (unter lg)                                                 */
/* ================================================================== */

const H = {
  sc: { x: 6, y: 8, w: 348, h: 92 },
  cx: 118,
  pvY: 162,
  wr: 300,
  dev: { x: 43, y: 384, w: 150, s: 150 / 260 },
  nap: 588,
  mastY: 652,
  r: 30,
  bus: 24,
  lx: 204,
};
const H_DEV_H = Math.round(196 * H.dev.s);
const H_RG = H.dev.y + H_DEV_H / 2;
const H_SOLL = `M${H.cx} 842V850Q${H.cx} 862 ${H.cx + 12} 862H334Q348 862 348 848V538Q348 524 334 524H174Q160 524 160 ${H.dev.y + H_DEV_H + 22}`;

function SchemaHoch() {
  const { sc, cx, r, bus, lx, dev } = H;
  const fern = [
    { y: H.wr, ziel: cx - r },
    { y: H_RG, ziel: dev.x },
    { y: H.nap, ziel: cx - r },
  ];
  const leitungOben = H.pvY + 76;
  const leitungUnten = H.mastY + 40;
  return (
    <svg viewBox="0 0 360 880" className="mx-auto block h-auto w-full max-w-[440px]" aria-hidden="true" focusable="false">
      <defs>
        <Defs p="w26m" leitung={{ x1: 0, y1: leitungOben, x2: 0, y2: leitungUnten }} />
        <mask id="w26m-soll-maske" maskUnits="userSpaceOnUse" x="0" y="0" width="360" height="880">
          <path d={H_SOLL} fill="none" stroke="#fff" strokeWidth="22" pathLength={1} {...an("w26-strich", 1700, 1200)} />
        </mask>
      </defs>

      {/* 03 · SCADA */}
      <g data-g="scada">
        <g {...an("w26-heben", 0)}>
          <rect x={sc.x} y={sc.y} width={sc.w} height={sc.h} rx="18" fill="url(#w26m-glas)" />
          <rect x={sc.x + 0.75} y={sc.y + 0.75} width={sc.w - 1.5} height={sc.h - 1.5} rx="17.25" fill="none" stroke="url(#w26m-glas-r)" strokeWidth="1.3" />
          <circle cx="52" cy={sc.y + sc.h / 2} r="24" fill="rgba(140,186,88,0.13)" stroke="rgba(174,208,131,0.45)" strokeWidth="1.3" />
          <Ikon icon={MonitorDot} x={52} y={sc.y + sc.h / 2} s={24} farbe={GRUEN_HELL} />
          <text x="88" y={sc.y + 42} fontSize="18" fontWeight="800" fill="#fff" style={DISPLAY}>
            SCADA & Leitwarte
          </text>
          <text x="88" y={sc.y + 64} fontSize="12.5" fill="rgba(255,255,255,0.6)">
            Performance Ratio · Alarme
          </text>
          {[0, 1, 2].map((k) => (
            <rect key={k} x={290} y={sc.y + 30 + k * 12} width={[44, 34, 24][k]} height="4" rx="2" fill={k === 2 ? SONNE : GRUEN} fillOpacity={k === 2 ? 0.9 : 0.6} />
          ))}
        </g>
        <rect className="w26-hl" data-hl="scada" x={sc.x + 1} y={sc.y + 1} width={sc.w - 2} height={sc.h - 2} rx="17" fill="none" stroke={GRUEN_HELL} strokeWidth="2" />
        <g {...an("w26-pop", 500)}>
          <Marke x={sc.x + 14} y={sc.y + 6} n="03" r={11} fs={10.5} />
        </g>
      </g>

      {/* 02 · Fernwartung: Sammelleitung links */}
      <g data-g="fern">
        <line x1={bus} x2={bus} y1={sc.y + sc.h} y2={H.nap} stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeDasharray="3 6" strokeLinecap="round" {...an("w26-wachsen", 800)} />
        <line className="w26-hl" data-hl="fern" x1={bus} x2={bus} y1={sc.y + sc.h} y2={H.nap} stroke={GRUEN_HELL} strokeWidth="2.6" strokeDasharray="3 6" strokeLinecap="round" />
        <g {...an("w26-heben", 1200)}>
          <Marke x={bus} y={128} n="02" r={11} fs={10.5} />
          <text x="44" y="126" fontSize="14.5" fontWeight="800" fill="#fff" style={DISPLAY}>
            Fernwartung
          </text>
          <text x="44" y="143" fontSize="11.5" fill="rgba(255,255,255,0.58)">
            gesichert, mit MFA & Protokoll
          </text>
        </g>
        {fern.map((f, n) => (
          <g key={`f${f.y}`}>
            <line x1={bus} x2={f.ziel} y1={f.y} y2={f.y} stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeDasharray="3 6" strokeLinecap="round" {...an("w26-heben", 1000 + n * 90)} />
            <line className="w26-hl" data-hl="fern" x1={bus} x2={f.ziel} y1={f.y} y2={f.y} stroke={GRUEN_HELL} strokeWidth="2.6" strokeDasharray="3 6" strokeLinecap="round" />
            <g {...an("w26-pop", 1150 + n * 90)}>
              <circle cx={bus} cy={f.y} r="11" fill={NAVY} stroke="rgba(174,208,131,0.65)" strokeWidth="1.4" />
              <Ikon icon={Lock} x={bus} y={f.y} s={11} farbe={GRUEN_HELL} breite={2.2} />
            </g>
          </g>
        ))}
      </g>

      {/* Energieleitung */}
      <g data-g="basis">
        <line x1={cx} x2={cx} y1={leitungOben} y2={leitungUnten} stroke={GRUEN} strokeOpacity="0.16" strokeWidth="12" strokeLinecap="round" pathLength={1} {...an("w26-strich", 380, 1500)} />
        <line x1={cx} x2={cx} y1={leitungOben} y2={leitungUnten} stroke="url(#w26m-leitung)" strokeWidth="3.5" strokeLinecap="round" pathLength={1} {...an("w26-strich", 380, 1500)} />
        {[0, 1].map((k) => (
          <g key={`e${k}`} className="w26-amb w26-paket-y" style={{ "--d": `${TAKT - 900 + k * 2400}ms`, "--w26-dy": `${leitungUnten - leitungOben}px` }}>
            <ellipse cx={cx} cy={leitungOben} rx="14" ry="22" fill="url(#w26m-paket-halo)" />
            <rect x={cx - 3} y={leitungOben - 70} width="6" height="74" rx="3" fill="url(#w26m-schweif-y)" />
          </g>
        ))}
      </g>

      <g data-g="regler">
        <ellipse cx={cx} cy={H_RG} rx="130" ry="120" fill="url(#w26m-halo)" {...an("w26-heben", 700)} />
      </g>

      {/* PV-Park */}
      <g data-g="basis">
        <PvPark x={cx - 70} y={H.pvY} s={0.7} p="w26m" />
        <text x={lx} y={H.pvY + 56} fontSize="16.5" fontWeight="800" fill="#fff" style={DISPLAY} {...an("w26-heben", 260)}>
          PV-Park
        </text>
      </g>

      {/* Wechselrichter, Netzanschlusspunkt */}
      {[
        { y: H.wr, icon: Zap, zeilen: ["Wechselrichter"], unter: "verschiedene Hersteller", g: "basis fern", i: 1 },
        { y: H.nap, icon: PlugZap, zeilen: ["Netzanschluss-", "punkt"], unter: "Messung · Zähler", g: "basis fern regler", i: 3 },
      ].map((k) => {
        const basis = k.y - (k.zeilen.length > 1 ? 14 : 4) - 4;
        return (
          <g key={k.zeilen[0]} data-g={k.g}>
            <g {...an("w26-pop", 120 + k.i * 110)}>
              <rect x={cx - r} y={k.y - r} width={r * 2} height={r * 2} rx="17" fill="url(#w26m-kachel)" />
              <rect x={cx - r + 0.6} y={k.y - r + 0.6} width={r * 2 - 1.2} height={r * 2 - 1.2} rx="16.4" fill="none" stroke="url(#w26m-kachel-r)" strokeWidth="1.2" />
              <Ikon icon={k.icon} x={cx} y={k.y} s={26} />
            </g>
            <g {...an("w26-heben", 260 + k.i * 110)}>
              {k.zeilen.map((z, j) => (
                <text key={z} x={lx} y={basis + j * 20} fontSize="16.5" fontWeight="800" fill="#fff" style={DISPLAY}>
                  {z}
                </text>
              ))}
              <text x={lx} y={basis + (k.zeilen.length - 1) * 20 + 19} fontSize="12.5" fontWeight="600" fill="rgba(255,255,255,0.55)">
                {k.unter}
              </text>
            </g>
          </g>
        );
      })}

      {/* 01 · Parkregler */}
      <g data-g="regler fern">
        <rect x={dev.x} y={dev.y} width={dev.w} height={H_DEV_H} rx="18" fill="none" stroke={GRUEN_HELL} strokeWidth="2" className="w26-amb w26-ring" style={{ "--d": `${TAKT}ms` }} />
        <rect className="w26-hl" data-hl="regler" x={dev.x - 7} y={dev.y - 7} width={dev.w + 14} height={H_DEV_H + 14} rx="24" fill="none" stroke={GRUEN_HELL} strokeWidth="1.8" />
        <g {...an("w26-pop", 340)}>
          <Geraet x={dev.x} y={dev.y} s={dev.s} p="w26m" details={false} />
        </g>
        <g {...an("w26-heben", 480)}>
          <text x={lx} y={H_RG - 8} fontSize="16.5" fontWeight="800" fill="#fff" style={DISPLAY}>
            Parkregler
          </text>
          <text x={lx} y={H_RG + 11} fontSize="12.5" fontWeight="600" fill={GRUEN_HELL}>
            EZA-Regler
          </text>
          <text x={lx} y={H_RG + 28} fontSize="12.5" fontWeight="600" fill={GRUEN_HELL}>
            eigene Entwicklung
          </text>
        </g>
        <g {...an("w26-pop", 600)}>
          <Marke x={dev.x + 2} y={dev.y + 2} n="01" r={11} fs={10.5} />
        </g>
      </g>

      {/* Netzbetreiber */}
      <g data-g="basis regler">
        <g {...an("w26-heben", 560)}>
          <Mast x={cx} y={H.mastY} s={0.78} />
        </g>
        <text x={lx} y={H.mastY + 80} fontSize="16.5" fontWeight="800" fill="#fff" style={DISPLAY} {...an("w26-heben", 700)}>
          Netzbetreiber
        </text>
      </g>

      {/* Sollwerte */}
      <g data-g="regler">
        <path d={H_SOLL} fill="none" stroke={SONNE} strokeWidth="2.2" strokeDasharray="7 6" mask="url(#w26m-soll-maske)" />
        <path d={H_SOLL} fill="none" stroke={SONNE} strokeOpacity="0.28" strokeWidth="11" strokeLinecap="round" pathLength={1} className="w26-amb w26-komet" style={{ "--d": `${TAKT}ms` }} />
        <path d={H_SOLL} fill="none" stroke="#fff3cf" strokeWidth="3.6" strokeLinecap="round" pathLength={1} className="w26-amb w26-komet" style={{ "--d": `${TAKT}ms` }} />
        <g {...an("w26-heben", 2300)}>
          <path d={`M150 ${H.dev.y + H_DEV_H + 18}L160 ${H.dev.y + H_DEV_H + 7}L170 ${H.dev.y + H_DEV_H + 18}`} fill="none" stroke={SONNE} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g {...an("w26-heben", 2100)}>
          <rect x="132" y="849" width="196" height="26" rx="13" fill={NAVY} stroke="rgba(255,197,61,0.45)" strokeWidth="1" />
          <text x="230" y="866.5" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={SONNE} style={DISPLAY}>
            Sollwerte nach TOR Erzeuger
          </text>
        </g>
      </g>
    </svg>
  );
}

export default function W26Regelkreis() {
  return (
    <>
      {/* Kein display:none zum Umschalten – das würde laufende Animationen neu starten.
          Die inaktive Fassung ist 0 px hoch und unsichtbar. */}
      <div className="w26-quer max-lg:invisible max-lg:h-0 max-lg:overflow-hidden">
        <SchemaQuer />
      </div>
      <div className="w26-hoch lg:invisible lg:h-0 lg:overflow-hidden">
        <SchemaHoch />
      </div>
    </>
  );
}

/* ================================================================== */
/* Stile                                                               */
/* ================================================================== */

const AUS = "cubic-bezier(0.22, 1, 0.36, 1)";
const WEICH = "cubic-bezier(0.65, 0, 0.35, 1)";
const sys = ["regler", "fern", "scada"];

export const W26_REGELKREIS_CSS = `
.w26-modul [data-g] { transition: opacity 500ms ${AUS}; }
.w26-hl { opacity: 0; transition: opacity 500ms ${AUS}; }
${sys
  .map(
    (s) => `.w26-modul:has(.w26-sys[data-sys="${s}"]:is(:hover, :focus-visible)) [data-g]:not([data-g~="${s}"]) { opacity: 0.14; }
.w26-modul:has(.w26-sys[data-sys="${s}"]:is(:hover, :focus-visible)) .w26-hl[data-hl="${s}"] { opacity: 1; }`
  )
  .join("\n")}

.w26-amb { opacity: 0; }

@media (prefers-reduced-motion: no-preference) {
  .w26-buehne[data-bereit] .w26-heben,
  .w26-buehne[data-bereit] .w26-pop { opacity: 0; }
  .w26-buehne[data-bereit] .w26-wachsen { transform: scaleY(0); }
  .w26-buehne[data-bereit] .w26-strich { stroke-dasharray: 1 1; stroke-dashoffset: 1; }
  .w26-pop, .w26-wachsen { transform-box: fill-box; }
  .w26-pop { transform-origin: center; }
  .w26-wachsen { transform-origin: 50% 0; }

  .w26-buehne[data-an] .w26-heben { animation: w26-heben 900ms ${AUS} var(--d, 0ms) both; }
  .w26-buehne[data-an] .w26-pop { animation: w26-pop 1000ms ${AUS} var(--d, 0ms) both; }
  .w26-buehne[data-an] .w26-wachsen { animation: w26-wachsen 900ms ${AUS} var(--d, 0ms) both; }
  .w26-buehne[data-an] .w26-strich { animation: w26-zeichnen var(--t, 1200ms) ${WEICH} var(--d, 0ms) both; }

  .w26-buehne[data-an] .w26-paket-x { animation: w26-paket-x 4.8s linear var(--d) infinite; }
  .w26-buehne[data-an] .w26-paket-y { animation: w26-paket-y 4.8s linear var(--d) infinite; }
  .w26-buehne[data-an] .w26-daten { animation: w26-daten 2.7s ${AUS} var(--d) infinite; }
  .w26-buehne[data-an] .w26-komet { stroke-dasharray: 0.08 2; animation: w26-komet 7s linear var(--d) infinite; }
  .w26-buehne[data-an] .w26-sender { transform-box: fill-box; transform-origin: center; animation: w26-sender 7s linear var(--d) infinite; }
  .w26-buehne[data-an] .w26-ring { transform-box: fill-box; transform-origin: center; animation: w26-ring 7s linear var(--d) infinite; }
  .w26-buehne[data-an] .w26-led { animation: w26-led 7s linear var(--d) infinite; }
  .w26-buehne[data-an] .w26-glanz { animation: w26-glanz 9s ${WEICH} var(--d) infinite; }
  .w26-buehne[data-an] .w26-cursor { animation: w26-cursor 9s linear var(--d) infinite; }
  .w26-buehne[data-an] .w26-welle { animation: w26-welle 5s linear infinite; }
  .w26-buehne[data-an] .w26-limit { animation: w26-limit 7s ${WEICH} var(--d) infinite; }
  .w26-buehne[data-an] .w26-niveau { animation: w26-niveau 7s ${WEICH} var(--d) infinite; }
  .w26-buehne[data-an] .w26-blink { animation: w26-blink 2.4s ease-in-out infinite; }

  .w26-buehne:not([data-sicht]) :is(.w26-amb, .w26-amb-fix) { animation-play-state: paused; }
  @media (max-width: 1023.98px) { .w26-quer :is(.w26-amb, .w26-amb-fix) { animation-play-state: paused; } }
  @media (min-width: 1024px) { .w26-hoch :is(.w26-amb, .w26-amb-fix) { animation-play-state: paused; } }
}
@keyframes w26-heben { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes w26-pop { from { opacity: 0; transform: translateY(16px) scale(0.92); } to { opacity: 1; transform: none; } }
@keyframes w26-wachsen { from { transform: scaleY(0); } to { transform: none; } }
@keyframes w26-zeichnen { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes w26-paket-x { 0% { transform: translateX(0); opacity: 0; } 6% { opacity: 1; } 92% { opacity: 1; } 100% { transform: translateX(var(--w26-dx)); opacity: 0; } }
@keyframes w26-paket-y { 0% { transform: translateY(0); opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { transform: translateY(var(--w26-dy)); opacity: 0; } }
@keyframes w26-daten { 0% { transform: translateY(0); opacity: 0; } 12% { opacity: 1; } 62% { opacity: 1; } 70%, 100% { transform: translateY(var(--w26-dy)); opacity: 0; } }
@keyframes w26-komet { 0% { stroke-dashoffset: 0.08; opacity: 0; } 3% { stroke-dashoffset: 0.06; opacity: 1; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } 30% { stroke-dashoffset: -0.92; opacity: 1; } 33%, 100% { stroke-dashoffset: -1; opacity: 0; } }
@keyframes w26-sender { 0% { opacity: 0.9; transform: scale(1); animation-timing-function: ${AUS}; } 14%, 100% { opacity: 0; transform: scale(3.4); } }
@keyframes w26-ring { 0%, 30% { opacity: 0; transform: scale(1); } 32% { opacity: 0.8; transform: scale(1); animation-timing-function: ${AUS}; } 62%, 100% { opacity: 0; transform: scale(1.22); } }
@keyframes w26-led { 0%, 30% { opacity: 0; } 32%, 40% { opacity: 1; } 44%, 100% { opacity: 0; } }
@keyframes w26-glanz { 0% { transform: skewX(-22deg) translateX(0); opacity: 1; } 40% { transform: skewX(-22deg) translateX(320px); opacity: 1; } 41%, 100% { transform: skewX(-22deg) translateX(320px); opacity: 0; } }
@keyframes w26-cursor { 0% { transform: translateX(0); opacity: 0; } 5% { opacity: 1; } 95% { opacity: 1; } 100% { transform: translateX(var(--w26-dx)); opacity: 0; } }
@keyframes w26-welle { to { transform: translateX(-${WP}px); } }
@keyframes w26-limit { 0%, 32% { transform: translateY(0); } 42%, 80% { transform: translateY(40px); } 92%, 100% { transform: translateY(0); } }
@keyframes w26-niveau { 0%, 35% { transform: translateY(0); } 50%, 82% { transform: translateY(38px); } 96%, 100% { transform: translateY(0); } }
@keyframes w26-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`;
