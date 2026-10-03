// src/components/Startseite/s08-Schema.js
//
// Systemschema „Eigene Technik“ für S08Technik (Server-Komponente, reines SVG).
// Zwei Fassungen: quer ab lg (Raster 1200 × 590) und hochkant darunter (Raster 360 × 750).
//
// Gruppen (`data-g`) erlauben das Hervorheben eines Systems, sobald die passende Karte
// (data-sys = regler | fern | scada) mit Maus oder Tastatur angesteuert wird – reines CSS über :has().
// Aufbau-Animation startet, wenn <S08Buehne> `data-an` setzt; ohne JS / bei reduzierter Bewegung
// steht der Endzustand. Alle Klassen, Keyframes und IDs tragen das Präfix s08.

import { LayoutGrid, Lock, MonitorDot, PlugZap, UtilityPole, Zap } from "lucide-react";

const GRUEN = "#8cba58";
const GRUEN_HELL = "#aed083";
const SONNE = "#ffc53d";
const NAVY = "#03122b";
const DISPLAY = { fontFamily: "var(--font-display)" };
const rd = (v) => Math.round(v * 10) / 10;

/** Aufbau-Klasse mit Verzögerung (ms) und optionaler Dauer. */
const an = (klasse, ms = 0, dauer) => ({ className: klasse, style: { "--d": `${ms}ms`, ...(dauer ? { "--t": `${dauer}ms` } : {}) } });

function Ikon({ icon: I, x, y, s, farbe = "#fff", breite = 1.7 }) {
  return <I x={rd(x - s / 2)} y={rd(y - s / 2)} width={s} height={s} color={farbe} strokeWidth={breite} aria-hidden="true" />;
}

/** Nummern-Marke 01/02/03 – verbindet Schema und Karten. */
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

/** Schieberegler-Symbol des Parkreglers; Knöpfe verstellen sich, wenn ein Sollwert eintrifft. */
const KNOEPFE = [
  { dy: -19, x: -11, dx: 15 },
  { dy: 0, x: 12, dx: -17 },
  { dy: 19, x: -3, dx: 11 },
];
function Regler({ x, y, s = 1, takt }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {KNOEPFE.map((k) => (
        <line key={`l${k.dy}`} x1={-30} x2={30} y1={k.dy} y2={k.dy} stroke={GRUEN_HELL} strokeOpacity="0.5" strokeWidth="3.2" strokeLinecap="round" />
      ))}
      {KNOEPFE.map((k, i) => (
        <rect key={`k${k.dy}`} x={k.x - 5} y={k.dy - 11} width="10" height="22" rx="5" fill={GRUEN_HELL} stroke="#1c4321" strokeWidth="3" className="s08-amb s08-knopf" style={{ "--d": `${takt + i * 90}ms`, "--s08-dx": `${k.dx}px` }} />
      ))}
    </g>
  );
}

/** Gemeinsame Verläufe; `p` = ID-Präfix je Fassung. */
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
      <linearGradient id={`${p}-regler`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2c5e2e" />
        <stop offset="1" stopColor="#122f17" />
      </linearGradient>
      <linearGradient id={`${p}-scada`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.085" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.025" />
      </linearGradient>
      <linearGradient id={`${p}-scada-r`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.07" />
      </linearGradient>
      <radialGradient id={`${p}-halo`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={GRUEN} stopOpacity="0.5" />
        <stop offset="0.55" stopColor={GRUEN} stopOpacity="0.14" />
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
      <linearGradient id={`${p}-leitung`} gradientUnits="userSpaceOnUse" {...leitung}>
        <stop offset="0" stopColor={GRUEN_HELL} />
        <stop offset="1" stopColor={GRUEN} />
      </linearGradient>
    </>
  );
}

/* ================================================================== */
/* Quer (ab lg)                                                        */
/* ================================================================== */

const D = {
  sc: { x: 20, y: 18, w: 1160, h: 122 },
  cy: 372,
  mx: [110, 345, 600, 855, 1090],
  r: 52,
  rp: 70,
  lockY: 204,
};
const D_SC_U = D.sc.y + D.sc.h;
const D_PILLE = D.cy - D.rp - 48; // „eigene Entwicklung“
const D_LABEL = 476;
const D_SOLL = `M${D.mx[4]} 512C${D.mx[4]} 578 ${D.mx[2]} 578 ${D.mx[2]} 518`;
const TAKT = 2700; // erster Sollwert-Impuls, danach alle 6 s

const KETTE = [
  { id: "pv", icon: LayoutGrid, l: "PV-Park", g: "basis" },
  { id: "wr", icon: Zap, l: "Wechselrichter", g: "basis fern" },
  { id: "regler", l: "Parkregler", unter: "EZA-Regler", g: "regler fern" },
  { id: "nap", icon: PlugZap, l: "Netzanschlusspunkt", unter: "Zähler", g: "basis fern" },
  { id: "nb", icon: UtilityPole, l: "Netzbetreiber", g: "basis regler" },
];

// Schematische Tagesganglinie im SCADA-Fenster (ohne Werte, rein dekorativ)
const WIN = { x: 800, y: 36, w: 356, h: 86 };
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
const KURVE = tageskurve(WIN.w, WIN.h, WIN.x, WIN.y);

function SchemaQuer() {
  const { sc, cy, mx, r, rp, lockY } = D;
  const halb = (k) => (k.id === "regler" ? rp : r);
  const fernZiele = [1, 2, 3];

  return (
    <svg viewBox="0 0 1200 590" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <defs>
        <Defs p="s08d" leitung={{ x1: mx[0], y1: 0, x2: mx[4], y2: 0 }} />
        <linearGradient id="s08d-kurve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.34" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </linearGradient>
        <clipPath id="s08d-win">
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx="12" />
        </clipPath>
        <mask id="s08d-soll-maske" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="590">
          <path d={D_SOLL} fill="none" stroke="#fff" strokeWidth="26" pathLength={1} {...an("s08-strich", 1600, 1100)} />
        </mask>
      </defs>

      {/* ============ 03 · SCADA & Leitwarte ============ */}
      <g data-g="scada">
        <g {...an("s08-heben", 0)}>
          <rect x={sc.x} y={sc.y} width={sc.w} height={sc.h} rx="22" fill="url(#s08d-scada)" />
          <rect x={sc.x + 0.75} y={sc.y + 0.75} width={sc.w - 1.5} height={sc.h - 1.5} rx="21.25" fill="none" stroke="url(#s08d-scada-r)" strokeWidth="1.5" />
          <circle cx="98" cy={sc.y + sc.h / 2} r="34" fill="rgba(140,186,88,0.13)" stroke="rgba(174,208,131,0.45)" strokeWidth="1.5" />
          <Ikon icon={MonitorDot} x={98} y={sc.y + sc.h / 2} s={34} farbe={GRUEN_HELL} />
          <text x="154" y={sc.y + 56} fontSize="26" fontWeight="800" fill="#fff" letterSpacing="-0.4" style={DISPLAY}>
            SCADA & Leitwarte
          </text>
          <text x="154" y={sc.y + 88} fontSize="17" fill="rgba(255,255,255,0.6)">
            Portfolio-Monitoring · Alarmierung · Reporting
          </text>

          {/* Portfolio: abstrakte Anlagenzeilen, eine mit Alarm */}
          {[
            { y: 50, w: 118, f: GRUEN },
            { y: 79, w: 140, f: GRUEN },
            { y: 108, w: 84, f: SONNE },
          ].map((z, i) => (
            <g key={z.y}>
              <circle cx="596" cy={z.y} r="4.5" fill={z.f} />
              <rect x="612" y={z.y - 3} width="160" height="6" rx="3" fill="rgba(255,255,255,0.09)" />
              <rect x="612" y={z.y - 3} width={z.w} height="6" rx="3" fill={z.f} fillOpacity={i === 2 ? 0.85 : 0.6} />
            </g>
          ))}

          {/* Verlaufsfenster */}
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx="12" fill="rgba(3,18,43,0.6)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
          <g clipPath="url(#s08d-win)">
            {[1, 2, 3].map((k) => (
              <line key={`h${k}`} x1={WIN.x} x2={WIN.x + WIN.w} y1={rd(WIN.y + (k * WIN.h) / 4)} y2={rd(WIN.y + (k * WIN.h) / 4)} stroke="rgba(255,255,255,0.06)" />
            ))}
            {[1, 2, 3, 4, 5, 6, 7].map((k) => (
              <line key={`v${k}`} x1={rd(WIN.x + (k * WIN.w) / 8)} x2={rd(WIN.x + (k * WIN.w) / 8)} y1={WIN.y} y2={WIN.y + WIN.h} stroke="rgba(255,255,255,0.045)" />
            ))}
            <path d={KURVE.flaeche} fill="url(#s08d-kurve)" {...an("s08-heben", 1500)} />
            <path d={KURVE.linie} fill="none" stroke={GRUEN_HELL} strokeWidth="2.4" strokeLinejoin="round" pathLength={1} {...an("s08-strich", 1100, 1600)} />
          </g>
        </g>
        <rect className="s08-hl" x={sc.x - 6} y={sc.y - 6} width={sc.w + 12} height={sc.h + 12} rx="27" fill="none" stroke={GRUEN_HELL} strokeWidth="2" data-hl="scada" />
        <g {...an("s08-pop", 500)}>
          <Marke x={sc.x + 6} y={sc.y + 4} n="03" />
        </g>
      </g>

      {/* Anschlusspunkte unter der SCADA-Leiste */}
      <g data-g="scada fern">
        <g {...an("s08-heben", 300)}>
          {fernZiele.map((i) => (
            <circle key={`a${i}`} cx={mx[i]} cy={D_SC_U} r="5.5" fill={NAVY} stroke="#fff" strokeWidth="2" />
          ))}
        </g>
      </g>

      {/* ============ 02 · Fernwartung: gesicherte Zugriffe ============ */}
      <g data-g="fern">
        <g {...an("s08-heben", 1250)}>
          <Marke x={52} y={226} n="02" />
          <text x="80" y="221" fontSize="20" fontWeight="800" fill="#fff" style={DISPLAY}>
            Fernwartung
          </text>
          <text x="80" y="245" fontSize="15" fill="rgba(255,255,255,0.58)">
            gesicherter Fernzugriff
          </text>
          <path d={`M248 ${lockY + 12}H${mx[1] - 24}`} stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" fill="none" />
        </g>
        {fernZiele.map((i, n) => {
          const unten = i === 2 ? D_PILLE : cy - r;
          return (
            <g key={`f${i}`}>
              <line x1={mx[i]} x2={mx[i]} y1={D_SC_U + 6} y2={unten} stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" {...an("s08-wachsen", 900 + n * 90)} />
              <line className="s08-hl" data-hl="fern" x1={mx[i]} x2={mx[i]} y1={D_SC_U + 6} y2={unten} stroke={GRUEN_HELL} strokeWidth="3" strokeDasharray="3 7" strokeLinecap="round" />
              <g className="s08-amb s08-daten" style={{ "--d": `${TAKT - 400 + n * 900}ms`, "--s08-dy": `${D_SC_U - unten + 12}px` }}>
                <circle cx={mx[i]} cy={unten - 8} r="13" fill="url(#s08d-daten-halo)" />
                <rect x={mx[i] - 2.5} y={unten - 16} width="5" height="15" rx="2.5" fill="#fff" />
              </g>
              <g {...an("s08-pop", 1150 + n * 90)}>
                <circle cx={mx[i]} cy={lockY + 10} r="16" fill={NAVY} stroke="rgba(174,208,131,0.65)" strokeWidth="1.6" />
                <Ikon icon={Lock} x={mx[i]} y={lockY + 10} s={15} farbe={GRUEN_HELL} breite={2} />
              </g>
            </g>
          );
        })}
      </g>

      {/* ============ Energieleitung ============ */}
      <g data-g="basis">
        <line x1={mx[0]} x2={mx[4]} y1={cy} y2={cy} stroke={GRUEN} strokeOpacity="0.16" strokeWidth="14" strokeLinecap="round" pathLength={1} {...an("s08-strich", 380, 1500)} />
        <line x1={mx[0]} x2={mx[4]} y1={cy} y2={cy} stroke="url(#s08d-leitung)" strokeWidth="4" strokeLinecap="round" pathLength={1} {...an("s08-strich", 380, 1500)} />
        {[0, 1, 2].map((k) => (
          <g key={`e${k}`} className="s08-amb s08-paket-x" style={{ "--d": `${TAKT - 900 + k * 1600}ms`, "--s08-dx": `${mx[4] - mx[0]}px` }}>
            <ellipse cx={mx[0]} cy={cy} rx="28" ry="17" fill="url(#s08d-paket-halo)" />
            <rect x={mx[0] - 96} y={cy - 3.5} width="100" height="7" rx="3.5" fill={GRUEN_HELL} fillOpacity="0.85" />
          </g>
        ))}
      </g>

      {/* Parkregler-Halo */}
      <g data-g="regler">
        <ellipse cx={mx[2]} cy={cy} rx="210" ry="170" fill="url(#s08d-halo)" {...an("s08-heben", 700)} />
      </g>

      {/* ============ Komponenten ============ */}
      {KETTE.map((k, i) => {
        const h = halb(k);
        const x = mx[i] - h;
        const y = cy - h;
        const eigen = k.id === "regler";
        return (
          <g key={k.id} data-g={k.g}>
            {eigen && (
              <>
                <rect x={x} y={y} width={h * 2} height={h * 2} rx="32" fill="none" stroke={GRUEN_HELL} strokeWidth="2.5" className="s08-amb s08-ring" style={{ "--d": `${TAKT}ms` }} />
                <rect className="s08-hl" data-hl="regler" x={x - 9} y={y - 9} width={h * 2 + 18} height={h * 2 + 18} rx="40" fill="none" stroke={GRUEN_HELL} strokeWidth="2" />
              </>
            )}
            <g {...an("s08-pop", 120 + i * 110)}>
              <rect x={x} y={y} width={h * 2} height={h * 2} rx={eigen ? 32 : 24} fill={eigen ? "url(#s08d-regler)" : "url(#s08d-kachel)"} />
              <rect x={x + 0.75} y={y + 0.75} width={h * 2 - 1.5} height={h * 2 - 1.5} rx={eigen ? 31.25 : 23.25} fill="none" stroke={eigen ? GRUEN : "url(#s08d-kachel-r)"} strokeWidth={eigen ? 2.5 : 1.5} />
              <line x1={x + 20} x2={x + h * 2 - 20} y1={y + 1.5} y2={y + 1.5} stroke="#fff" strokeOpacity={eigen ? 0.4 : 0.24} strokeWidth="1.5" strokeLinecap="round" />
              {eigen ? <Regler x={mx[i]} y={cy} takt={TAKT} /> : <Ikon icon={k.icon} x={mx[i]} y={cy} s={42} />}
              {i > 0 && <circle cx={x} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />}
              {i < 4 && <circle cx={x + h * 2} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />}
            </g>
            <g {...an("s08-heben", 260 + i * 110)}>
              <text x={mx[i]} y={D_LABEL} textAnchor="middle" fontSize="19" fontWeight="800" fill="#fff" letterSpacing="-0.2" style={DISPLAY}>
                {k.l}
              </text>
              {k.unter && (
                <text x={mx[i]} y={D_LABEL + 24} textAnchor="middle" fontSize="15.5" fontWeight="600" fill={eigen ? GRUEN_HELL : "rgba(255,255,255,0.55)"}>
                  {k.unter}
                </text>
              )}
            </g>
            {eigen && (
              <>
                <g {...an("s08-heben", 1300)}>
                  <rect x={mx[i] - 98} y={D_PILLE} width="196" height="32" rx="16" fill={GRUEN} />
                  <text x={mx[i]} y={D_PILLE + 21.5} textAnchor="middle" fontSize="15.5" fontWeight="800" fill={NAVY} style={DISPLAY}>
                    eigene Entwicklung
                  </text>
                </g>
                <g {...an("s08-pop", 600)}>
                  <Marke x={x + 2} y={y + 2} n="01" />
                </g>
              </>
            )}
          </g>
        );
      })}

      {/* ============ Sollwerte des Netzbetreibers → Parkregler ============ */}
      <g data-g="regler">
        <path d={D_SOLL} fill="none" stroke={SONNE} strokeWidth="2.6" strokeDasharray="8 7" mask="url(#s08d-soll-maske)" />
        <path d={D_SOLL} fill="none" stroke={SONNE} strokeOpacity="0.28" strokeWidth="14" strokeLinecap="round" pathLength={1} className="s08-amb s08-komet" style={{ "--d": `${TAKT}ms` }} />
        <path d={D_SOLL} fill="none" stroke="#fff3cf" strokeWidth="4.5" strokeLinecap="round" pathLength={1} className="s08-amb s08-komet" style={{ "--d": `${TAKT}ms` }} />
        <g {...an("s08-heben", 2300)}>
          <circle cx={mx[4]} cy="512" r="4.5" fill={SONNE} />
          <path d={`M${mx[2] - 11} 532L${mx[2]} 518L${mx[2] + 11} 532`} fill="none" stroke={SONNE} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g {...an("s08-heben", 2100)}>
          <rect x="726" y="545" width="238" height="30" rx="15" fill={NAVY} stroke="rgba(255,197,61,0.45)" strokeWidth="1.2" />
          <text x="845" y="565" textAnchor="middle" fontSize="15" fontWeight="700" fill={SONNE} style={DISPLAY}>
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

const M = {
  sc: { x: 6, y: 10, w: 348, h: 90 },
  cx: 96,
  ys: [214, 320, 440, 560, 668],
  r: 30,
  rp: 42,
  bus: 26,
  lx: 146,
};
const M_SC_U = M.sc.y + M.sc.h;
const M_SOLL = `M${M.cx} ${M.ys[4] + M.r}V${M.ys[4] + 42}Q${M.cx} 724 ${M.cx + 14} 724H322Q338 724 338 708V516Q338 500 322 500H134Q120 500 120 486V483`;

function SchemaHoch() {
  const { sc, cx, ys, r, rp, bus, lx } = M;
  const halb = (k) => (k.id === "regler" ? rp : r);
  const fernZiele = [1, 2, 3];
  const takt = TAKT;

  return (
    <svg viewBox="0 0 360 750" className="mx-auto block h-auto w-full max-w-[440px]" aria-hidden="true" focusable="false">
      <defs>
        <Defs p="s08m" leitung={{ x1: 0, y1: ys[0], x2: 0, y2: ys[4] }} />
        <mask id="s08m-soll-maske" maskUnits="userSpaceOnUse" x="0" y="0" width="360" height="750">
          <path d={M_SOLL} fill="none" stroke="#fff" strokeWidth="22" pathLength={1} {...an("s08-strich", 1600, 1200)} />
        </mask>
      </defs>

      {/* 03 · SCADA */}
      <g data-g="scada">
        <g {...an("s08-heben", 0)}>
          <rect x={sc.x} y={sc.y} width={sc.w} height={sc.h} rx="18" fill="url(#s08m-scada)" />
          <rect x={sc.x + 0.75} y={sc.y + 0.75} width={sc.w - 1.5} height={sc.h - 1.5} rx="17.25" fill="none" stroke="url(#s08m-scada-r)" strokeWidth="1.3" />
          <circle cx="52" cy={sc.y + sc.h / 2} r="24" fill="rgba(140,186,88,0.13)" stroke="rgba(174,208,131,0.45)" strokeWidth="1.3" />
          <Ikon icon={MonitorDot} x={52} y={sc.y + sc.h / 2} s={24} farbe={GRUEN_HELL} />
          <text x="88" y={sc.y + 41} fontSize="18" fontWeight="800" fill="#fff" style={DISPLAY}>
            SCADA & Leitwarte
          </text>
          <text x="88" y={sc.y + 63} fontSize="12.5" fill="rgba(255,255,255,0.6)">
            Monitoring · Alarmierung · Reporting
          </text>
        </g>
        <rect className="s08-hl" data-hl="scada" x={sc.x + 1} y={sc.y + 1} width={sc.w - 2} height={sc.h - 2} rx="17" fill="none" stroke={GRUEN_HELL} strokeWidth="2" />
        <g {...an("s08-pop", 500)}>
          <Marke x={sc.x + 14} y={sc.y + 6} n="03" r={11} fs={10.5} />
        </g>
      </g>

      {/* 02 · Fernwartung: Sammelleitung links, gesicherte Abzweige */}
      <g data-g="fern">
        <line x1={bus} x2={bus} y1={M_SC_U} y2={ys[3]} stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeDasharray="3 6" strokeLinecap="round" {...an("s08-wachsen", 800)} />
        <line className="s08-hl" data-hl="fern" x1={bus} x2={bus} y1={M_SC_U} y2={ys[3]} stroke={GRUEN_HELL} strokeWidth="2.6" strokeDasharray="3 6" strokeLinecap="round" />
        <g {...an("s08-heben", 1200)}>
          <Marke x={bus} y={142} n="02" r={11} fs={10.5} />
          <text x="46" y="140" fontSize="14.5" fontWeight="800" fill="#fff" style={DISPLAY}>
            Fernwartung
          </text>
          <text x="46" y="157" fontSize="11.5" fill="rgba(255,255,255,0.58)">
            gesicherter Fernzugriff
          </text>
        </g>
        {fernZiele.map((i, n) => {
          const ziel = cx - (i === 2 ? rp : r);
          return (
            <g key={`f${i}`}>
              <line x1={bus} x2={ziel} y1={ys[i]} y2={ys[i]} stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeDasharray="3 6" strokeLinecap="round" {...an("s08-heben", 1000 + n * 90)} />
              <line className="s08-hl" data-hl="fern" x1={bus} x2={ziel} y1={ys[i]} y2={ys[i]} stroke={GRUEN_HELL} strokeWidth="2.6" strokeDasharray="3 6" strokeLinecap="round" />
              <g {...an("s08-pop", 1150 + n * 90)}>
                <circle cx={bus} cy={ys[i]} r="11" fill={NAVY} stroke="rgba(174,208,131,0.65)" strokeWidth="1.4" />
                <Ikon icon={Lock} x={bus} y={ys[i]} s={11} farbe={GRUEN_HELL} breite={2.2} />
              </g>
            </g>
          );
        })}
      </g>

      {/* Energieleitung */}
      <g data-g="basis">
        <line x1={cx} x2={cx} y1={ys[0]} y2={ys[4]} stroke={GRUEN} strokeOpacity="0.16" strokeWidth="12" strokeLinecap="round" pathLength={1} {...an("s08-strich", 380, 1500)} />
        <line x1={cx} x2={cx} y1={ys[0]} y2={ys[4]} stroke="url(#s08m-leitung)" strokeWidth="3.5" strokeLinecap="round" pathLength={1} {...an("s08-strich", 380, 1500)} />
        {[0, 1].map((k) => (
          <g key={`e${k}`} className="s08-amb s08-paket-y" style={{ "--d": `${takt - 900 + k * 2400}ms`, "--s08-dy": `${ys[4] - ys[0]}px` }}>
            <ellipse cx={cx} cy={ys[0]} rx="14" ry="22" fill="url(#s08m-paket-halo)" />
            <rect x={cx - 3} y={ys[0] - 70} width="6" height="74" rx="3" fill={GRUEN_HELL} fillOpacity="0.85" />
          </g>
        ))}
      </g>

      <g data-g="regler">
        <ellipse cx={cx} cy={ys[2]} rx="120" ry="110" fill="url(#s08m-halo)" {...an("s08-heben", 700)} />
      </g>

      {/* Komponenten */}
      {KETTE.map((k, i) => {
        const h = halb(k);
        const x = cx - h;
        const y = ys[i] - h;
        const eigen = k.id === "regler";
        const zeilen = eigen ? ["Parkregler"] : k.id === "nap" ? ["Netzanschluss-", "punkt"] : [k.l];
        const unter = eigen ? "EZA-Regler · eigene Entwicklung" : k.unter;
        const basis = ys[i] - (zeilen.length > 1 ? 14 : 4) + (unter ? -4 : 6);
        return (
          <g key={k.id} data-g={k.g}>
            {eigen && (
              <>
                <rect x={x} y={y} width={h * 2} height={h * 2} rx="22" fill="none" stroke={GRUEN_HELL} strokeWidth="2" className="s08-amb s08-ring" style={{ "--d": `${takt}ms` }} />
                <rect className="s08-hl" data-hl="regler" x={x - 7} y={y - 7} width={h * 2 + 14} height={h * 2 + 14} rx="28" fill="none" stroke={GRUEN_HELL} strokeWidth="1.8" />
              </>
            )}
            <g {...an("s08-pop", 120 + i * 110)}>
              <rect x={x} y={y} width={h * 2} height={h * 2} rx={eigen ? 22 : 17} fill={eigen ? "url(#s08m-regler)" : "url(#s08m-kachel)"} />
              <rect x={x + 0.6} y={y + 0.6} width={h * 2 - 1.2} height={h * 2 - 1.2} rx={eigen ? 21.4 : 16.4} fill="none" stroke={eigen ? GRUEN : "url(#s08m-kachel-r)"} strokeWidth={eigen ? 2 : 1.2} />
              {eigen ? <Regler x={cx} y={ys[i]} s={0.78} takt={takt} /> : <Ikon icon={k.icon} x={cx} y={ys[i]} s={26} />}
            </g>
            <g {...an("s08-heben", 260 + i * 110)}>
              {zeilen.map((z, j) => (
                <text key={z} x={lx} y={basis + j * 20} fontSize="16.5" fontWeight="800" fill="#fff" style={DISPLAY}>
                  {z}
                </text>
              ))}
              {unter && (
                <text x={lx} y={basis + (zeilen.length - 1) * 20 + 19} fontSize="12.5" fontWeight="600" fill={eigen ? GRUEN_HELL : "rgba(255,255,255,0.55)"}>
                  {unter}
                </text>
              )}
            </g>
            {eigen && (
              <g {...an("s08-pop", 600)}>
                <Marke x={x + 2} y={y + 2} n="01" r={11} fs={10.5} />
              </g>
            )}
          </g>
        );
      })}

      {/* Sollwerte */}
      <g data-g="regler">
        <path d={M_SOLL} fill="none" stroke={SONNE} strokeWidth="2.2" strokeDasharray="7 6" mask="url(#s08m-soll-maske)" />
        <path d={M_SOLL} fill="none" stroke={SONNE} strokeOpacity="0.28" strokeWidth="11" strokeLinecap="round" pathLength={1} className="s08-amb s08-komet" style={{ "--d": `${takt}ms` }} />
        <path d={M_SOLL} fill="none" stroke="#fff3cf" strokeWidth="3.6" strokeLinecap="round" pathLength={1} className="s08-amb s08-komet" style={{ "--d": `${takt}ms` }} />
        <g {...an("s08-heben", 2300)}>
          <path d="M110 494L120 482L130 494" fill="none" stroke={SONNE} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g {...an("s08-heben", 2100)}>
          <rect x="126" y="711" width="196" height="26" rx="13" fill={NAVY} stroke="rgba(255,197,61,0.45)" strokeWidth="1" />
          <text x="224" y="728.5" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={SONNE} style={DISPLAY}>
            Sollwerte nach TOR Erzeuger
          </text>
        </g>
      </g>
    </svg>
  );
}

export default function S08Schema() {
  return (
    <>
      {/* Bewusst kein display:none zum Umschalten – das würde laufende Animationen neu starten
          (z. B. wenn sich das Fenster kurz ändert). Die inaktive Fassung ist 0 px hoch und unsichtbar. */}
      <div className="s08-quer max-lg:invisible max-lg:h-0 max-lg:overflow-hidden">
        <SchemaQuer />
      </div>
      <div className="s08-hoch lg:invisible lg:h-0 lg:overflow-hidden">
        <SchemaHoch />
      </div>
    </>
  );
}

/* ================================================================== */
/* Stile                                                               */
/* ================================================================== */

const AUS = "cubic-bezier(0.22, 1, 0.36, 1)";
const sys = ["regler", "fern", "scada"];

export const S08_CSS = `
.s08-modul [data-g] { transition: opacity 500ms ${AUS}; }
.s08-hl { opacity: 0; transition: opacity 500ms ${AUS}; }
${sys
  .map(
    (s) => `.s08-modul:has(.s08-karte[data-sys="${s}"]:is(:hover, :focus-visible)) [data-g]:not([data-g~="${s}"]) { opacity: 0.14; }
.s08-modul:has(.s08-karte[data-sys="${s}"]:is(:hover, :focus-visible)) .s08-hl[data-hl="${s}"] { opacity: 1; }`
  )
  .join("\n")}
.s08-modul .s08-hl[data-hl="fern"], .s08-modul .s08-hl[data-hl="scada"] { filter: drop-shadow(0 0 6px rgba(174,208,131,0.55)); }

.s08-amb { opacity: 0; }
.s08-knopf { opacity: 1; }

@media (prefers-reduced-motion: no-preference) {
  .s08-buehne[data-bereit] .s08-heben,
  .s08-buehne[data-bereit] .s08-pop { opacity: 0; }
  .s08-buehne[data-bereit] .s08-wachsen { transform: scaleY(0); }
  .s08-buehne[data-bereit] .s08-strich { stroke-dasharray: 1 1; stroke-dashoffset: 1; }
  .s08-pop, .s08-wachsen { transform-box: fill-box; }
  .s08-pop { transform-origin: center; }
  .s08-wachsen { transform-origin: 50% 0; }

  .s08-buehne[data-an] .s08-heben { animation: s08-heben 900ms ${AUS} var(--d, 0ms) both; }
  .s08-buehne[data-an] .s08-pop { animation: s08-pop 1000ms ${AUS} var(--d, 0ms) both; }
  .s08-buehne[data-an] .s08-wachsen { animation: s08-wachsen 900ms ${AUS} var(--d, 0ms) both; }
  .s08-buehne[data-an] .s08-strich { animation: s08-zeichnen var(--t, 1200ms) cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) both; }

  .s08-buehne[data-an] .s08-paket-x { animation: s08-paket-x 4.8s linear var(--d) infinite; }
  .s08-buehne[data-an] .s08-paket-y { animation: s08-paket-y 4.8s linear var(--d) infinite; }
  .s08-buehne[data-an] .s08-daten { animation: s08-daten 2.7s ${AUS} var(--d) infinite; }
  .s08-buehne[data-an] .s08-komet { stroke-dasharray: 0.08 2; animation: s08-komet 6s linear var(--d) infinite; }
  .s08-buehne[data-an] .s08-ring { transform-box: fill-box; transform-origin: center; animation: s08-ring 6s linear var(--d) infinite; }
  .s08-buehne[data-an] .s08-knopf { animation: s08-knopf 6s cubic-bezier(0.65, 0, 0.35, 1) var(--d) infinite; }
  .s08-buehne:not([data-sicht]) .s08-amb { animation-play-state: paused; }
  @media (max-width: 1023.98px) { .s08-quer .s08-amb { animation-play-state: paused; } }
  @media (min-width: 1024px) { .s08-hoch .s08-amb { animation-play-state: paused; } }
}
@keyframes s08-heben { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes s08-pop { from { opacity: 0; transform: translateY(16px) scale(0.9); } to { opacity: 1; transform: none; } }
@keyframes s08-wachsen { from { transform: scaleY(0); } to { transform: none; } }
@keyframes s08-zeichnen { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes s08-paket-x { 0% { transform: translateX(0); opacity: 0; } 6% { opacity: 1; } 92% { opacity: 1; } 100% { transform: translateX(var(--s08-dx)); opacity: 0; } }
@keyframes s08-paket-y { 0% { transform: translateY(0); opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { transform: translateY(var(--s08-dy)); opacity: 0; } }
@keyframes s08-daten { 0% { transform: translateY(0); opacity: 0; } 12% { opacity: 1; } 62% { opacity: 1; } 70%, 100% { transform: translateY(var(--s08-dy)); opacity: 0; } }
@keyframes s08-komet { 0% { stroke-dashoffset: 0.08; opacity: 0; } 3% { stroke-dashoffset: 0.06; opacity: 1; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } 34% { stroke-dashoffset: -0.92; opacity: 1; } 37%, 100% { stroke-dashoffset: -1; opacity: 0; } }
@keyframes s08-ring { 0%, 33% { opacity: 0; transform: scale(1); } 35% { opacity: 0.8; transform: scale(1); animation-timing-function: ${AUS}; } 72%, 100% { opacity: 0; transform: scale(1.38); } }
@keyframes s08-knopf { 0%, 35% { transform: translateX(0); } 47%, 80% { transform: translateX(var(--s08-dx)); } 94%, 100% { transform: translateX(0); } }
`;
