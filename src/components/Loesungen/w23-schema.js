// src/components/Loesungen/w23-schema.js
//
// Systemschema für TechnikSystem (Server-Komponente, reines SVG) – dieselbe Bildsprache wie das
// Leitstand-Schema der Startseite, aber an den Seitenkontext angepasst:
//   Erzeugung (gezeichnete Kachel je Kontext: Hallendach, Solarpark, Agri-PV, Hof, Gemeinde)
//   → Speicher-Abzweig (Laden/Entladen) → Parkregler (eigene Entwicklung) → Netzanschlusspunkt
//   → Netzbetreiber; darüber SCADA/Leitwarte, dazwischen gesicherte Fernwartung,
//   unten die Sollwert-Schleife des Netzbetreibers zum Parkregler.
// Zwei Fassungen: quer ab lg (Raster 1200 × 650) und hochkant darunter (Raster 360 × 770).
// Gruppen (`data-g`) erlauben das Hervorheben eines Systems, sobald die passende Karte
// (data-sys = regler | fern | scada) mit Maus oder Tastatur angesteuert wird – reines CSS über :has().
// Aufbau startet, wenn <W23Buehne> `data-an` setzt; ohne JS / bei reduzierter Bewegung steht der
// Endzustand. Alle Klassen, Keyframes und IDs tragen das Präfix w23.

import { BatteryCharging, Lock, MonitorDot, PlugZap, UtilityPole } from "lucide-react";

const GRUEN = "#8cba58";
const GRUEN_HELL = "#aed083";
const SONNE = "#ffc53d";
const NAVY = "#03122b";
const MODUL = "rgba(174,208,131,0.24)";
const LINIE = "rgba(255,255,255,0.86)";
const DISPLAY = { fontFamily: "var(--font-display)" };
const rd = (v) => Math.round(v * 10) / 10;

/** Aufbau-Klasse mit Verzögerung (ms) und optionaler Dauer. */
const an = (klasse, ms = 0, dauer) => ({ className: klasse, style: { "--d": `${ms}ms`, ...(dauer ? { "--t": `${dauer}ms` } : {}) } });
/** Strich, der sich zeichnet (pathLength = 1). */
const zug = (ms, dauer, extra = {}) => ({ pathLength: 1, fill: "none", strokeLinecap: "round", strokeLinejoin: "round", ...an("w23-strich", ms, dauer), ...extra });

/** Einfacher, deterministischer Zeilenumbruch nach Zeichenzahl (Server und Browser identisch). */
export function umbruch(text = "", max = 24, maxZeilen = 3) {
  const woerter = String(text).split(/\s+/).filter(Boolean);
  const zeilen = [];
  let akt = "";
  for (const w of woerter) {
    if (!akt) akt = w;
    else if ((akt + " " + w).length <= max) akt += " " + w;
    else {
      zeilen.push(akt);
      akt = w;
    }
  }
  if (akt) zeilen.push(akt);
  // keine Waisen: sehr kurzes letztes Wort (z. B. „5“) holt sein Vorgängerwort mit
  const n = zeilen.length;
  if (n > 1 && zeilen[n - 1].length <= 3 && zeilen[n - 2].includes(" ")) {
    const vor = zeilen[n - 2].split(" ");
    const wort = vor.pop();
    zeilen[n - 2] = vor.join(" ");
    zeilen[n - 1] = `${wort} ${zeilen[n - 1]}`;
  }
  if (zeilen.length > maxZeilen) return [...zeilen.slice(0, maxZeilen - 1), zeilen.slice(maxZeilen - 1).join(" ")];
  return zeilen;
}

/** Kontext der Erzeugungs-Kachel – aus Prop oder aus dem Knotentitel abgeleitet. */
export function kontextVon(knoten = {}, kontext) {
  if (kontext) return kontext;
  const t = `${knoten.erzeugung?.titel || ""} ${knoten.erzeugung?.text || ""}`.toLowerCase();
  if (/agri/.test(t)) return "agri";
  if (/solarpark|freifl|modultisch/.test(t)) return "park";
  if (/gemeinde|schule|rathaus/.test(t)) return "gemeinde";
  if (/stall|hof|scheune/.test(t)) return "hof";
  return "halle";
}

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
        <rect key={`k${k.dy}`} x={k.x - 5} y={k.dy - 11} width="10" height="22" rx="5" fill={GRUEN_HELL} stroke="#1c4321" strokeWidth="3" className="w23-amb w23-knopf" style={{ "--d": `${takt + i * 90}ms`, "--w23-dx": `${k.dx}px` }} />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Erzeugungs-Kachel: kleine Strichzeichnung je Kontext (Raster 160×100) */
/* ------------------------------------------------------------------ */

function Paneel({ x, y, l = 16, h = 7, ms }) {
  // geneigtes Modul im Profil
  return <path d={`M${x} ${y}L${x + l} ${y - h}`} stroke={GRUEN_HELL} strokeWidth="4.2" strokeLinecap="round" fill="none" {...an("w23-heben", ms)} />;
}

function Erzeugung({ art, ms = 0 }) {
  const boden = <path d="M4 92H156" stroke={LINIE} strokeOpacity="0.5" strokeWidth="1.6" {...zug(ms, 700)} />;
  if (art === "park") {
    return (
      <>
        {boden}
        {[0, 52, 104].map((dx, i) => (
          <g key={dx}>
            <path d={`M${dx + 20} 72V92M${dx + 42} 61V92M${dx + 20} 80L${dx + 42} 69`} stroke={LINIE} strokeWidth="1.8" {...zug(ms + 150 + i * 120, 700)} />
            <path d={`M${dx + 6} 74L${dx + 50} 52L${dx + 53} 58L${dx + 9} 80Z`} fill={MODUL} stroke={GRUEN_HELL} strokeWidth="1.6" strokeLinejoin="round" {...an("w23-heben", ms + 450 + i * 120)} />
            <path d={`M${dx + 21} 66.5L${dx + 24} 72.5M${dx + 36} 59L${dx + 39} 65`} stroke={GRUEN_HELL} strokeOpacity="0.55" strokeWidth="1" {...an("w23-heben", ms + 500 + i * 120)} />
          </g>
        ))}
      </>
    );
  }
  if (art === "agri") {
    const halme = [12, 26, 40, 54, 68, 82, 96, 110, 124, 138, 150];
    return (
      <>
        {boden}
        {halme.map((x, i) => (
          <path key={x} d={`M${x} 92V83M${x} 88Q${x - 4} 87 ${x - 5} 82M${x} 87Q${x + 4} 86 ${x + 5} 81`} stroke={GRUEN} strokeWidth="1.6" fill="none" strokeLinecap="round" {...an("w23-heben", ms + 500 + i * 35)} />
        ))}
        <path d="M32 92V39M128 92V29M32 60L52 42M128 52L108 33" stroke={LINIE} strokeWidth="1.8" {...zug(ms + 120, 800)} />
        <path d="M12 44L148 27L149.5 33L13.5 50Z" fill={MODUL} stroke={GRUEN_HELL} strokeWidth="1.6" strokeLinejoin="round" {...an("w23-heben", ms + 420)} />
        <path d="M46 40L47 46M80 35.8L81 41.8M114 31.5L115 37.5" stroke={GRUEN_HELL} strokeOpacity="0.55" strokeWidth="1" {...an("w23-heben", ms + 480)} />
      </>
    );
  }
  if (art === "hof") {
    const fugen = [1, 2, 3, 4, 5, 6].map((k) => ({ k, ox: rd(34 + (k * 92) / 7), ux: rd(10 + (k * 140) / 7) }));
    return (
      <>
        {boden}
        <path d="M18 92V62M142 62V92" stroke={LINIE} strokeWidth="1.8" {...zug(ms + 100, 600)} />
        <path d="M10 62L34 30H126L150 62Z" fill={MODUL} stroke={GRUEN_HELL} strokeWidth="1.7" strokeLinejoin="round" {...an("w23-heben", ms + 380)} />
        <g {...an("w23-heben", ms + 520)}>
          {fugen.map((f) => (
            <path key={f.k} d={`M${f.ox} 30L${f.ux} 62`} stroke={GRUEN_HELL} strokeOpacity="0.5" strokeWidth="1" />
          ))}
          <path d="M22 46H138" stroke={GRUEN_HELL} strokeOpacity="0.5" strokeWidth="1" />
        </g>
        <path d="M62 92V70H98V92M62 70L98 92M98 70L62 92" stroke={LINIE} strokeOpacity="0.7" strokeWidth="1.5" {...zug(ms + 300, 800)} />
      </>
    );
  }
  if (art === "gemeinde") {
    const fenster = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) fenster.push({ x: 20 + c * 21, y: 58 + r * 15, k: r * 3 + c });
    return (
      <>
        {boden}
        <path d="M10 92V48H86V92" stroke={LINIE} strokeWidth="1.8" {...zug(ms + 100, 700)} />
        <path d="M98 92V62L125 44L152 62V92" stroke={LINIE} strokeWidth="1.8" {...zug(ms + 220, 700)} />
        <g {...an("w23-heben", ms + 600)}>
          {fenster.map((f) => (
            <rect key={f.k} x={f.x} y={f.y} width="12" height="8" rx="1.5" fill="none" stroke={LINIE} strokeOpacity="0.4" strokeWidth="1.2" />
          ))}
          <rect x="118" y="76" width="14" height="16" rx="1.5" fill="none" stroke={LINIE} strokeOpacity="0.5" strokeWidth="1.3" />
        </g>
        {[16, 38, 60].map((x, i) => (
          <Paneel key={x} x={x} y={46} l={17} h={7} ms={ms + 420 + i * 90} />
        ))}
        <path d="M102 56L122 42.6" stroke={GRUEN_HELL} strokeWidth="4.2" strokeLinecap="round" fill="none" {...an("w23-heben", ms + 700)} />
      </>
    );
  }
  // Hallendach (Gewerbe)
  return (
    <>
      {boden}
      <path d="M16 92V50H144V92M12 50H148" stroke={LINIE} strokeWidth="1.8" {...zug(ms + 100, 800)} />
      <path d="M24 59H54M106 59H136" stroke={LINIE} strokeOpacity="0.35" strokeWidth="1.6" {...zug(ms + 500, 500)} />
      <path d="M62 92V68H98V92M62 74H98M62 80H98M62 86H98" stroke={LINIE} strokeOpacity="0.6" strokeWidth="1.3" {...zug(ms + 400, 700)} />
      {[20, 41, 62, 83, 104, 125].map((x, i) => (
        <Paneel key={x} x={x} y={47} l={16} h={7} ms={ms + 450 + i * 70} />
      ))}
    </>
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
      <linearGradient id={`${p}-erz`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#123a70" />
        <stop offset="1" stopColor="#071d40" />
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
      <radialGradient id={`${p}-sonne`} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={SONNE} stopOpacity="0.32" />
        <stop offset="1" stopColor={SONNE} stopOpacity="0" />
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
        <stop offset="0" stopColor={SONNE} stopOpacity="0.9" />
        <stop offset="0.18" stopColor={GRUEN_HELL} />
        <stop offset="1" stopColor={GRUEN} />
      </linearGradient>
    </>
  );
}

/** Mehrzeiliger SVG-Text (Titel + Unterzeile). */
function Beschriftung({ x, y, anker = "middle", titel, text, tMax, uMax, tFs, uFs, tLh, uLh, unterFarbe = "rgba(255,255,255,0.58)", extra = [] }) {
  const t = umbruch(titel, tMax, 2);
  const u = text ? umbruch(text, uMax, 3) : [];
  return (
    <>
      {t.map((z, j) => (
        <text key={`t${j}`} x={x} y={rd(y + j * tLh)} textAnchor={anker} fontSize={tFs} fontWeight="800" fill="#fff" letterSpacing="-0.2" style={DISPLAY}>
          {z}
        </text>
      ))}
      {u.map((z, j) => (
        <text key={`u${j}`} x={x} y={rd(y + (t.length - 1) * tLh + uLh * (j + 1) + 2)} textAnchor={anker} fontSize={uFs} fontWeight="500" fill={unterFarbe}>
          {z}
        </text>
      ))}
      {extra.map((e, j) => (
        <text key={`e${j}`} x={x} y={rd(y + (t.length - 1) * tLh + uLh * (u.length + j + 1) + 2)} textAnchor={anker} fontSize={uFs} fontWeight="700" fill={GRUEN_HELL}>
          {e}
        </text>
      ))}
    </>
  );
}

// Schematische Tagesganglinie im Leitwarten-Fenster (ohne Werte, rein dekorativ)
function tageskurve(w, h, x0, y0, schritt = 4) {
  const pts = [];
  for (let x = 0; x <= w; x += schritt) {
    const t = x / w;
    const glocke = Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 0.08) / 0.84))));
    const wolke = 0.06 * Math.sin(t * 37 + 0.6) + 0.04 * Math.sin(t * 89 + 2);
    const y = y0 + h - 8 - (h - 22) * Math.pow(glocke, 1.4) * (1 + (glocke > 0.2 ? wolke : 0));
    pts.push(`${rd(x0 + x)} ${rd(y)}`);
  }
  const linie = `M${pts.join("L")}`;
  return { linie, flaeche: `${linie}L${x0 + w} ${y0 + h}L${x0} ${y0 + h}Z` };
}

const TAKT = 2900; // erster Sollwert-Impuls, danach alle 6 s

/* ================================================================== */
/* Quer (ab lg)                                                        */
/* ================================================================== */

const D = {
  sc: { x: 20, y: 18, w: 1160, h: 122 },
  cy: 372,
  x: { erz: 132, kn: 352, regler: 600, nap: 846, netz: 1078 },
  erz: { w: 196, h: 140 },
  r: 52,
  rp: 70,
  lockY: 214,
  zus: { y: 586, r: 46 },
};
const D_SC_U = D.sc.y + D.sc.h;
const D_PILLE = D.cy - D.rp - 48;
const D_LABEL = 476;
const D_SOLL = `M${D.x.netz} 542C${D.x.netz} 612 ${D.x.regler} 612 ${D.x.regler} 524`;
const WIN = { x: 800, y: 36, w: 356, h: 86 };
const KURVE_D = tageskurve(WIN.w, WIN.h, WIN.x, WIN.y);

function SchemaQuer({ k, art }) {
  const { sc, cy, x: X, erz, r, rp, lockY, zus } = D;
  const fern = [
    { x: X.erz, unten: cy - erz.h / 2 },
    { x: X.regler, unten: D_PILLE },
    { x: X.nap, unten: cy - r },
  ];
  const nebenKnoten = [
    { id: "nap", x: X.nap, icon: PlugZap, g: "basis fern", titel: "Netzanschlusspunkt", text: "Zähler", ms: 450 },
    { id: "netz", x: X.netz, icon: UtilityPole, g: "basis regler", titel: k.netz.titel, text: k.netz.text, ms: 560 },
  ];
  const erzX = X.erz - erz.w / 2;
  const erzY = cy - erz.h / 2;

  return (
    <svg viewBox="0 0 1200 650" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <defs>
        <Defs p="w23d" leitung={{ x1: X.erz, y1: 0, x2: X.netz, y2: 0 }} />
        <linearGradient id="w23d-kurve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.34" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </linearGradient>
        <clipPath id="w23d-win">
          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx="12" />
        </clipPath>
        <clipPath id="w23d-erz-clip">
          <rect x={erzX} y={erzY} width={erz.w} height={erz.h} rx="26" />
        </clipPath>
        <mask id="w23d-soll-maske" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="650">
          <path d={D_SOLL} fill="none" stroke="#fff" strokeWidth="26" pathLength={1} {...an("w23-strich", 1700, 1100)} />
        </mask>
      </defs>

      {/* ============ 03 · Leitwarte ============ */}
      <g data-g="scada">
        <g {...an("w23-heben", 0)}>
          <rect x={sc.x} y={sc.y} width={sc.w} height={sc.h} rx="22" fill="url(#w23d-scada)" />
          <rect x={sc.x + 0.75} y={sc.y + 0.75} width={sc.w - 1.5} height={sc.h - 1.5} rx="21.25" fill="none" stroke="url(#w23d-scada-r)" strokeWidth="1.5" />
          <circle cx="98" cy={sc.y + sc.h / 2} r="34" fill="rgba(140,186,88,0.13)" stroke="rgba(174,208,131,0.45)" strokeWidth="1.5" />
          <Ikon icon={MonitorDot} x={98} y={sc.y + sc.h / 2} s={34} farbe={GRUEN_HELL} />
          {umbruch(k.leitwarte.titel, 26, 1).map((z) => (
            <text key={z} x="154" y={sc.y + 56} fontSize="26" fontWeight="800" fill="#fff" letterSpacing="-0.4" style={DISPLAY}>
              {z}
            </text>
          ))}
          {umbruch(k.leitwarte.text, 42, 1).map((z) => (
            <text key={z} x="154" y={sc.y + 88} fontSize="17" fill="rgba(255,255,255,0.6)">
              {z}
            </text>
          ))}

          {/* Portfolio: abstrakte Anlagenzeilen, eine mit Hinweis */}
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

          <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx="12" fill="rgba(3,18,43,0.6)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2" />
          <g clipPath="url(#w23d-win)">
            {[1, 2, 3].map((n) => (
              <line key={`h${n}`} x1={WIN.x} x2={WIN.x + WIN.w} y1={rd(WIN.y + (n * WIN.h) / 4)} y2={rd(WIN.y + (n * WIN.h) / 4)} stroke="rgba(255,255,255,0.06)" />
            ))}
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <line key={`v${n}`} x1={rd(WIN.x + (n * WIN.w) / 8)} x2={rd(WIN.x + (n * WIN.w) / 8)} y1={WIN.y} y2={WIN.y + WIN.h} stroke="rgba(255,255,255,0.045)" />
            ))}
            <path d={KURVE_D.flaeche} fill="url(#w23d-kurve)" {...an("w23-heben", 1500)} />
            <path d={KURVE_D.linie} fill="none" stroke={GRUEN_HELL} strokeWidth="2.4" strokeLinejoin="round" pathLength={1} {...an("w23-strich", 1100, 1600)} />
          </g>
          <text x={WIN.x + WIN.w - 12} y={WIN.y + 19} textAnchor="end" fontSize="11.5" fontWeight="600" letterSpacing="1.2" fill="rgba(255,255,255,0.38)">
            SCHEMATISCH
          </text>
        </g>
        <rect className="w23-hl" x={sc.x - 6} y={sc.y - 6} width={sc.w + 12} height={sc.h + 12} rx="27" fill="none" stroke={GRUEN_HELL} strokeWidth="2" data-hl="scada" />
        <g {...an("w23-pop", 500)}>
          <Marke x={sc.x + 6} y={sc.y + 4} n="03" />
        </g>
      </g>

      {/* Anschlusspunkte unter der Leitwarte */}
      <g data-g="scada fern">
        <g {...an("w23-heben", 300)}>
          {fern.map((f) => (
            <circle key={`a${f.x}`} cx={f.x} cy={D_SC_U} r="5.5" fill={NAVY} stroke="#fff" strokeWidth="2" />
          ))}
        </g>
      </g>

      {/* ============ 02 · Fernwartung ============ */}
      <g data-g="fern">
        <g {...an("w23-heben", 1250)}>
          <Marke x={190} y={lockY + 12} n="02" />
          <text x="218" y={lockY + 7} fontSize="20" fontWeight="800" fill="#fff" style={DISPLAY}>
            Fernwartung
          </text>
          <text x="218" y={lockY + 31} fontSize="15" fill="rgba(255,255,255,0.58)">
            gesicherter Fernzugriff
          </text>
          <path d={`M400 ${lockY + 10}H${X.regler - 26}`} stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" fill="none" />
        </g>
        {fern.map((f, n) => (
          <g key={`f${f.x}`}>
            <line x1={f.x} x2={f.x} y1={D_SC_U + 6} y2={f.unten} stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" {...an("w23-wachsen", 900 + n * 90)} />
            <line className="w23-hl" data-hl="fern" x1={f.x} x2={f.x} y1={D_SC_U + 6} y2={f.unten} stroke={GRUEN_HELL} strokeWidth="3" strokeDasharray="3 7" strokeLinecap="round" />
            <g className="w23-amb w23-daten" style={{ "--d": `${TAKT - 400 + n * 900}ms`, "--w23-dy": `${D_SC_U - f.unten + 12}px` }}>
              <circle cx={f.x} cy={f.unten - 8} r="13" fill="url(#w23d-daten-halo)" />
              <rect x={f.x - 2.5} y={f.unten - 16} width="5" height="15" rx="2.5" fill="#fff" />
            </g>
            <g {...an("w23-pop", 1150 + n * 90)}>
              <circle cx={f.x} cy={lockY + 10} r="16" fill={NAVY} stroke="rgba(174,208,131,0.65)" strokeWidth="1.6" />
              <Ikon icon={Lock} x={f.x} y={lockY + 10} s={15} farbe={GRUEN_HELL} breite={2} />
            </g>
          </g>
        ))}
      </g>

      {/* ============ Energieleitung + Speicher-Abzweig ============ */}
      <g data-g="basis">
        <line x1={X.erz} x2={X.netz} y1={cy} y2={cy} stroke={GRUEN} strokeOpacity="0.16" strokeWidth="14" strokeLinecap="round" pathLength={1} {...an("w23-strich", 380, 1500)} />
        <line x1={X.erz} x2={X.netz} y1={cy} y2={cy} stroke="url(#w23d-leitung)" strokeWidth="4" strokeLinecap="round" pathLength={1} {...an("w23-strich", 380, 1500)} />
        <line x1={X.kn} x2={X.kn} y1={cy} y2={zus.y - zus.r} stroke={GRUEN} strokeOpacity="0.16" strokeWidth="12" strokeLinecap="round" {...an("w23-wachsen", 900)} />
        <line x1={X.kn} x2={X.kn} y1={cy} y2={zus.y - zus.r} stroke={GRUEN_HELL} strokeOpacity="0.85" strokeWidth="3.5" strokeLinecap="round" {...an("w23-wachsen", 900)} />
        {[0, 1, 2].map((n) => (
          <g key={`e${n}`} className="w23-amb w23-paket-x" style={{ "--d": `${TAKT - 900 + n * 1600}ms`, "--w23-dx": `${X.netz - X.erz}px` }}>
            <ellipse cx={X.erz} cy={cy} rx="28" ry="17" fill="url(#w23d-paket-halo)" />
            <rect x={X.erz - 96} y={cy - 3.5} width="100" height="7" rx="3.5" fill={GRUEN_HELL} fillOpacity="0.85" />
          </g>
        ))}
        {/* Laden / Entladen */}
        <g className="w23-amb w23-speicher" style={{ "--d": `${TAKT - 200}ms`, "--w23-dy": `${zus.y - zus.r - cy - 30}px` }}>
          <ellipse cx={X.kn} cy={cy + 16} rx="13" ry="20" fill="url(#w23d-paket-halo)" />
          <rect x={X.kn - 3} y={cy + 2} width="6" height="30" rx="3" fill={GRUEN_HELL} />
        </g>
        <g {...an("w23-pop", 760)}>
          <circle cx={X.kn} cy={cy} r="9" fill={NAVY} stroke={GRUEN_HELL} strokeWidth="2.4" />
          <circle cx={X.kn} cy={cy} r="3.2" fill={GRUEN_HELL} />
        </g>
      </g>

      {/* Parkregler-Halo */}
      <g data-g="regler">
        <ellipse cx={X.regler} cy={cy} rx="210" ry="170" fill="url(#w23d-halo)" {...an("w23-heben", 700)} />
      </g>

      {/* ============ Erzeugung (Kontext-Kachel) ============ */}
      <g data-g="basis fern">
        <ellipse cx={X.erz} cy={erzY + 10} rx="120" ry="70" fill="url(#w23d-sonne)" {...an("w23-heben", 200)} />
        <g {...an("w23-pop", 120)}>
          <rect x={erzX} y={erzY} width={erz.w} height={erz.h} rx="26" fill="url(#w23d-erz)" />
          <rect x={erzX + 0.75} y={erzY + 0.75} width={erz.w - 1.5} height={erz.h - 1.5} rx="25.25" fill="none" stroke="url(#w23d-kachel-r)" strokeWidth="1.5" />
          <line x1={erzX + 24} x2={erzX + erz.w - 24} y1={erzY + 1.5} y2={erzY + 1.5} stroke="#fff" strokeOpacity="0.26" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx={erzX + erz.w} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />
        </g>
        <g clipPath="url(#w23d-erz-clip)">
          <g {...an("w23-heben", 260)}>
            <circle cx={erzX + erz.w - 30} cy={erzY + 30} r="10" fill={SONNE} />
            <circle cx={erzX + erz.w - 30} cy={erzY + 30} r="17" fill="none" stroke={SONNE} strokeOpacity="0.35" strokeWidth="1.5" />
          </g>
          <g transform={`translate(${erzX + 18} ${erzY + 30}) scale(1)`}>
            <Erzeugung art={art} ms={250} />
          </g>
        </g>
        <g {...an("w23-heben", 260)}>
          <Beschriftung x={X.erz} y={D_LABEL} titel={k.erzeugung.titel} text={k.erzeugung.text} tMax={20} uMax={32} tFs={19} uFs={15} tLh={23} uLh={21} />
        </g>
      </g>

      {/* ============ Speicher & Verbraucher ============ */}
      <g data-g="basis">
        <g {...an("w23-pop", 980)}>
          <rect x={X.kn - zus.r} y={zus.y - zus.r} width={zus.r * 2} height={zus.r * 2} rx="22" fill="url(#w23d-kachel)" />
          <rect x={X.kn - zus.r + 0.75} y={zus.y - zus.r + 0.75} width={zus.r * 2 - 1.5} height={zus.r * 2 - 1.5} rx="21.25" fill="none" stroke="url(#w23d-kachel-r)" strokeWidth="1.5" />
          <Ikon icon={BatteryCharging} x={X.kn} y={zus.y} s={36} />
          <circle cx={X.kn} cy={zus.y - zus.r} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />
        </g>
        <g {...an("w23-heben", 1080)}>
          <Beschriftung x={X.kn - zus.r - 22} y={zus.y - 10} anker="end" titel={k.zusatz.titel} text={k.zusatz.text} tMax={24} uMax={32} tFs={19} uFs={15} tLh={23} uLh={21} />
        </g>
      </g>

      {/* ============ Parkregler ============ */}
      <g data-g="regler fern">
        <rect x={X.regler - rp} y={cy - rp} width={rp * 2} height={rp * 2} rx="32" fill="none" stroke={GRUEN_HELL} strokeWidth="2.5" className="w23-amb w23-ring" style={{ "--d": `${TAKT}ms` }} />
        <rect className="w23-hl" data-hl="regler" x={X.regler - rp - 9} y={cy - rp - 9} width={rp * 2 + 18} height={rp * 2 + 18} rx="40" fill="none" stroke={GRUEN_HELL} strokeWidth="2" />
        <g {...an("w23-pop", 340)}>
          <rect x={X.regler - rp} y={cy - rp} width={rp * 2} height={rp * 2} rx="32" fill="url(#w23d-regler)" />
          <rect x={X.regler - rp + 1.25} y={cy - rp + 1.25} width={rp * 2 - 2.5} height={rp * 2 - 2.5} rx="30.75" fill="none" stroke={GRUEN} strokeWidth="2.5" />
          <line x1={X.regler - rp + 20} x2={X.regler + rp - 20} y1={cy - rp + 1.5} y2={cy - rp + 1.5} stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
          <Regler x={X.regler} y={cy} takt={TAKT} />
          <circle cx={X.regler - rp} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />
          <circle cx={X.regler + rp} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />
        </g>
        <g {...an("w23-heben", 480)}>
          <text x={X.regler} y={D_LABEL} textAnchor="middle" fontSize="19" fontWeight="800" fill="#fff" letterSpacing="-0.2" style={DISPLAY}>
            Parkregler
          </text>
          <text x={X.regler} y={D_LABEL + 24} textAnchor="middle" fontSize="15.5" fontWeight="600" fill={GRUEN_HELL}>
            EZA-Regler
          </text>
        </g>
        <g {...an("w23-heben", 1300)}>
          <rect x={X.regler - 98} y={D_PILLE} width="196" height="32" rx="16" fill={GRUEN} />
          <text x={X.regler} y={D_PILLE + 21.5} textAnchor="middle" fontSize="15.5" fontWeight="800" fill={NAVY} style={DISPLAY}>
            eigene Entwicklung
          </text>
        </g>
        <g {...an("w23-pop", 600)}>
          <Marke x={X.regler - rp + 2} y={cy - rp + 2} n="01" />
        </g>
      </g>

      {/* ============ Netzanschlusspunkt, Netzbetreiber ============ */}
      {nebenKnoten.map((n) => (
        <g key={n.id} data-g={n.g}>
          <g {...an("w23-pop", n.ms)}>
            <rect x={n.x - r} y={cy - r} width={r * 2} height={r * 2} rx="24" fill="url(#w23d-kachel)" />
            <rect x={n.x - r + 0.75} y={cy - r + 0.75} width={r * 2 - 1.5} height={r * 2 - 1.5} rx="23.25" fill="none" stroke="url(#w23d-kachel-r)" strokeWidth="1.5" />
            <line x1={n.x - r + 20} x2={n.x + r - 20} y1={cy - r + 1.5} y2={cy - r + 1.5} stroke="#fff" strokeOpacity="0.24" strokeWidth="1.5" strokeLinecap="round" />
            <Ikon icon={n.icon} x={n.x} y={cy} s={42} />
            <circle cx={n.x - r} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />
            {n.id === "nap" && <circle cx={n.x + r} cy={cy} r="5.5" fill={NAVY} stroke={GRUEN} strokeWidth="2.4" />}
          </g>
          <g {...an("w23-heben", n.ms + 140)}>
            <Beschriftung x={n.x} y={D_LABEL} titel={n.titel} text={n.text} tMax={20} uMax={26} tFs={19} uFs={15} tLh={23} uLh={21} />
          </g>
        </g>
      ))}

      {/* ============ Sollwerte des Netzbetreibers → Parkregler ============ */}
      <g data-g="regler">
        <path d={D_SOLL} fill="none" stroke={SONNE} strokeWidth="2.6" strokeDasharray="8 7" mask="url(#w23d-soll-maske)" />
        <path d={D_SOLL} fill="none" stroke={SONNE} strokeOpacity="0.28" strokeWidth="14" strokeLinecap="round" pathLength={1} className="w23-amb w23-komet" style={{ "--d": `${TAKT}ms` }} />
        <path d={D_SOLL} fill="none" stroke="#fff3cf" strokeWidth="4.5" strokeLinecap="round" pathLength={1} className="w23-amb w23-komet" style={{ "--d": `${TAKT}ms` }} />
        <g {...an("w23-heben", 2400)}>
          <circle cx={X.netz} cy="542" r="4.5" fill={SONNE} />
          <path d={`M${X.regler - 11} 538L${X.regler} 524L${X.regler + 11} 538`} fill="none" stroke={SONNE} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g {...an("w23-heben", 2200)}>
          <rect x={rd((X.regler + X.netz) / 2 - 122)} y="577" width="244" height="30" rx="15" fill={NAVY} stroke="rgba(255,197,61,0.45)" strokeWidth="1.2" />
          <text x={rd((X.regler + X.netz) / 2)} y="597" textAnchor="middle" fontSize="15" fontWeight="700" fill={SONNE} style={DISPLAY}>
            Sollwerte des Netzbetreibers
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
  sc: { x: 6, y: 10, w: 348, h: 92 },
  cx: 102,
  ys: { erz: 232, zus: 348, regler: 468, nap: 586, netz: 698 },
  erz: { w: 100, h: 78 },
  r: 30,
  rp: 42,
  bus: 26,
  lx: 168,
};
const M_SC_U = M.sc.y + M.sc.h;
const M_UNTEN = M.ys.netz + M.r;
const M_SOLL = `M${M.cx} ${M_UNTEN}V${M_UNTEN + 12}Q${M.cx} ${M_UNTEN + 28} ${M.cx + 14} ${M_UNTEN + 28}H322Q338 ${M_UNTEN + 28} 338 ${M_UNTEN + 12}V${M.ys.regler + M.rp + 32}Q338 ${M.ys.regler + M.rp + 16} 322 ${M.ys.regler + M.rp + 16}H${M.cx + 36}Q${M.cx + 22} ${M.ys.regler + M.rp + 16} ${M.cx + 22} ${M.ys.regler + M.rp + 2}V${M.ys.regler + M.rp - 1}`;

function SchemaHoch({ k, art }) {
  const { sc, cx, ys, erz, r, rp, bus, lx } = M;
  const erzX = cx - erz.w / 2;
  const erzY = ys.erz - erz.h / 2;
  const fern = [
    { y: ys.erz, ziel: erzX },
    { y: ys.regler, ziel: cx - rp },
    { y: ys.nap, ziel: cx - r },
  ];
  const kacheln = [
    { id: "zus", y: ys.zus, icon: BatteryCharging, g: "basis", titel: k.zusatz.titel, text: k.zusatz.text, ms: 300 },
    { id: "nap", y: ys.nap, icon: PlugZap, g: "basis fern", titel: "Netzanschluss- punkt", text: "Zähler", ms: 520 },
    { id: "netz", y: ys.netz, icon: UtilityPole, g: "basis regler", titel: k.netz.titel, text: k.netz.text, ms: 630 },
  ];
  const lab = { tMax: 18, uMax: 26, tFs: 16, uFs: 12.5, tLh: 19, uLh: 17 };
  // Unterhalb des Parkreglers läuft rechts die Sollwert-Schleife (x = 338) → schmalere Spalte
  const labEng = { ...lab, tMax: 16, uMax: 22 };
  const labelY = (y, titel, text, l = lab) => {
    const n = umbruch(titel, l.tMax, 2).length + (text ? umbruch(text, l.uMax, 3).length : 0);
    return rd(y - (n * 17) / 2 + 12);
  };
  const H = M_UNTEN + 56;

  return (
    <svg viewBox={`0 0 360 ${H}`} className="mx-auto block h-auto w-full max-w-[460px]" aria-hidden="true" focusable="false">
      <defs>
        <Defs p="w23m" leitung={{ x1: 0, y1: ys.erz, x2: 0, y2: ys.netz }} />
        <mask id="w23m-soll-maske" maskUnits="userSpaceOnUse" x="0" y="0" width="360" height={H}>
          <path d={M_SOLL} fill="none" stroke="#fff" strokeWidth="22" pathLength={1} {...an("w23-strich", 1700, 1200)} />
        </mask>
        <clipPath id="w23m-erz-clip">
          <rect x={erzX} y={erzY} width={erz.w} height={erz.h} rx="18" />
        </clipPath>
      </defs>

      {/* 03 · Leitwarte */}
      <g data-g="scada">
        <g {...an("w23-heben", 0)}>
          <rect x={sc.x} y={sc.y} width={sc.w} height={sc.h} rx="18" fill="url(#w23m-scada)" />
          <rect x={sc.x + 0.75} y={sc.y + 0.75} width={sc.w - 1.5} height={sc.h - 1.5} rx="17.25" fill="none" stroke="url(#w23m-scada-r)" strokeWidth="1.3" />
          <circle cx="52" cy={sc.y + sc.h / 2} r="24" fill="rgba(140,186,88,0.13)" stroke="rgba(174,208,131,0.45)" strokeWidth="1.3" />
          <Ikon icon={MonitorDot} x={52} y={sc.y + sc.h / 2} s={24} farbe={GRUEN_HELL} />
          <text x="88" y={sc.y + 42} fontSize="18" fontWeight="800" fill="#fff" style={DISPLAY}>
            {umbruch(k.leitwarte.titel, 24, 1)[0]}
          </text>
          <text x="88" y={sc.y + 64} fontSize="12.5" fill="rgba(255,255,255,0.6)">
            {umbruch(k.leitwarte.text, 40, 1)[0]}
          </text>
        </g>
        <rect className="w23-hl" data-hl="scada" x={sc.x + 1} y={sc.y + 1} width={sc.w - 2} height={sc.h - 2} rx="17" fill="none" stroke={GRUEN_HELL} strokeWidth="2" />
        <g {...an("w23-pop", 500)}>
          <Marke x={sc.x + 14} y={sc.y + 6} n="03" r={11} fs={10.5} />
        </g>
      </g>

      {/* 02 · Fernwartung: Sammelleitung links, gesicherte Abzweige */}
      <g data-g="fern">
        <line x1={bus} x2={bus} y1={M_SC_U} y2={ys.nap} stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeDasharray="3 6" strokeLinecap="round" {...an("w23-wachsen", 800)} />
        <line className="w23-hl" data-hl="fern" x1={bus} x2={bus} y1={M_SC_U} y2={ys.nap} stroke={GRUEN_HELL} strokeWidth="2.6" strokeDasharray="3 6" strokeLinecap="round" />
        <g {...an("w23-heben", 1200)}>
          <Marke x={bus} y={146} n="02" r={11} fs={10.5} />
          <text x="46" y="144" fontSize="14.5" fontWeight="800" fill="#fff" style={DISPLAY}>
            Fernwartung
          </text>
          <text x="46" y="161" fontSize="11.5" fill="rgba(255,255,255,0.58)">
            gesicherter Fernzugriff
          </text>
        </g>
        {fern.map((f, n) => (
          <g key={`f${f.y}`}>
            <line x1={bus} x2={f.ziel} y1={f.y} y2={f.y} stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeDasharray="3 6" strokeLinecap="round" {...an("w23-heben", 1000 + n * 90)} />
            <line className="w23-hl" data-hl="fern" x1={bus} x2={f.ziel} y1={f.y} y2={f.y} stroke={GRUEN_HELL} strokeWidth="2.6" strokeDasharray="3 6" strokeLinecap="round" />
            <g {...an("w23-pop", 1150 + n * 90)}>
              <circle cx={bus} cy={f.y} r="11" fill={NAVY} stroke="rgba(174,208,131,0.65)" strokeWidth="1.4" />
              <Ikon icon={Lock} x={bus} y={f.y} s={11} farbe={GRUEN_HELL} breite={2.2} />
            </g>
          </g>
        ))}
      </g>

      {/* Energieleitung */}
      <g data-g="basis">
        <line x1={cx} x2={cx} y1={ys.erz} y2={ys.netz} stroke={GRUEN} strokeOpacity="0.16" strokeWidth="12" strokeLinecap="round" pathLength={1} {...an("w23-strich", 380, 1500)} />
        <line x1={cx} x2={cx} y1={ys.erz} y2={ys.netz} stroke="url(#w23m-leitung)" strokeWidth="3.5" strokeLinecap="round" pathLength={1} {...an("w23-strich", 380, 1500)} />
        {[0, 1].map((n) => (
          <g key={`e${n}`} className="w23-amb w23-paket-y" style={{ "--d": `${TAKT - 900 + n * 2400}ms`, "--w23-dy": `${ys.netz - ys.erz}px` }}>
            <ellipse cx={cx} cy={ys.erz} rx="14" ry="22" fill="url(#w23m-paket-halo)" />
            <rect x={cx - 3} y={ys.erz - 70} width="6" height="74" rx="3" fill={GRUEN_HELL} fillOpacity="0.85" />
          </g>
        ))}
      </g>

      <g data-g="regler">
        <ellipse cx={cx} cy={ys.regler} rx="120" ry="110" fill="url(#w23m-halo)" {...an("w23-heben", 700)} />
      </g>

      {/* Erzeugung */}
      <g data-g="basis fern">
        <g {...an("w23-pop", 120)}>
          <rect x={erzX} y={erzY} width={erz.w} height={erz.h} rx="18" fill="url(#w23m-erz)" />
          <rect x={erzX + 0.6} y={erzY + 0.6} width={erz.w - 1.2} height={erz.h - 1.2} rx="17.4" fill="none" stroke="url(#w23m-kachel-r)" strokeWidth="1.2" />
        </g>
        <g clipPath="url(#w23m-erz-clip)">
          <circle cx={erzX + erz.w - 16} cy={erzY + 16} r="6" fill={SONNE} {...an("w23-heben", 260)} />
          <g transform={`translate(${rd(erzX + 8)} ${rd(erzY + 20)}) scale(0.525)`}>
            <Erzeugung art={art} ms={250} />
          </g>
        </g>
        <g {...an("w23-heben", 260)}>
          <Beschriftung x={lx} y={labelY(ys.erz, k.erzeugung.titel, k.erzeugung.text)} anker="start" titel={k.erzeugung.titel} text={k.erzeugung.text} {...lab} />
        </g>
      </g>

      {/* Parkregler */}
      <g data-g="regler fern">
        <rect x={cx - rp} y={ys.regler - rp} width={rp * 2} height={rp * 2} rx="22" fill="none" stroke={GRUEN_HELL} strokeWidth="2" className="w23-amb w23-ring" style={{ "--d": `${TAKT}ms` }} />
        <rect className="w23-hl" data-hl="regler" x={cx - rp - 7} y={ys.regler - rp - 7} width={rp * 2 + 14} height={rp * 2 + 14} rx="28" fill="none" stroke={GRUEN_HELL} strokeWidth="1.8" />
        <g {...an("w23-pop", 400)}>
          <rect x={cx - rp} y={ys.regler - rp} width={rp * 2} height={rp * 2} rx="22" fill="url(#w23m-regler)" />
          <rect x={cx - rp + 1} y={ys.regler - rp + 1} width={rp * 2 - 2} height={rp * 2 - 2} rx="21" fill="none" stroke={GRUEN} strokeWidth="2" />
          <Regler x={cx} y={ys.regler} s={0.78} takt={TAKT} />
        </g>
        <g {...an("w23-heben", 520)}>
          <Beschriftung x={lx} y={ys.regler - 14} anker="start" titel="Parkregler" text="EZA-Regler" unterFarbe={GRUEN_HELL} extra={["eigene Entwicklung"]} {...lab} />
        </g>
        <g {...an("w23-pop", 600)}>
          <Marke x={cx - rp + 2} y={ys.regler - rp + 2} n="01" r={11} fs={10.5} />
        </g>
      </g>

      {/* Speicher, Netzanschlusspunkt, Netzbetreiber */}
      {kacheln.map((n) => (
        <g key={n.id} data-g={n.g}>
          <g {...an("w23-pop", n.ms)}>
            <rect x={cx - r} y={n.y - r} width={r * 2} height={r * 2} rx="17" fill="url(#w23m-kachel)" />
            <rect x={cx - r + 0.6} y={n.y - r + 0.6} width={r * 2 - 1.2} height={r * 2 - 1.2} rx="16.4" fill="none" stroke="url(#w23m-kachel-r)" strokeWidth="1.2" />
            <Ikon icon={n.icon} x={cx} y={n.y} s={26} />
          </g>
          <g {...an("w23-heben", n.ms + 140)}>
            <Beschriftung x={lx} y={labelY(n.y, n.titel, n.text, n.id === "zus" ? lab : labEng)} anker="start" titel={n.titel} text={n.text} {...(n.id === "zus" ? lab : labEng)} />
          </g>
        </g>
      ))}

      {/* Sollwerte */}
      <g data-g="regler">
        <path d={M_SOLL} fill="none" stroke={SONNE} strokeWidth="2.2" strokeDasharray="7 6" mask="url(#w23m-soll-maske)" />
        <path d={M_SOLL} fill="none" stroke={SONNE} strokeOpacity="0.28" strokeWidth="11" strokeLinecap="round" pathLength={1} className="w23-amb w23-komet" style={{ "--d": `${TAKT}ms` }} />
        <path d={M_SOLL} fill="none" stroke="#fff3cf" strokeWidth="3.6" strokeLinecap="round" pathLength={1} className="w23-amb w23-komet" style={{ "--d": `${TAKT}ms` }} />
        <g {...an("w23-heben", 2400)}>
          <path d={`M${cx + 12} ${ys.regler + rp + 12}L${cx + 22} ${ys.regler + rp}L${cx + 32} ${ys.regler + rp + 12}`} fill="none" stroke={SONNE} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g {...an("w23-heben", 2200)}>
          <rect x="120" y={M_UNTEN + 15} width="208" height="26" rx="13" fill={NAVY} stroke="rgba(255,197,61,0.45)" strokeWidth="1" />
          <text x="224" y={M_UNTEN + 32.5} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={SONNE} style={DISPLAY}>
            Sollwerte des Netzbetreibers
          </text>
        </g>
      </g>
    </svg>
  );
}

export default function W23Schema({ knoten, art }) {
  return (
    <>
      {/* Kein display:none zum Umschalten – das würde laufende Animationen neu starten.
          Die inaktive Fassung ist 0 px hoch und unsichtbar. */}
      <div className="w23-quer max-lg:invisible max-lg:h-0 max-lg:overflow-hidden">
        <SchemaQuer k={knoten} art={art} />
      </div>
      <div className="w23-hoch lg:invisible lg:h-0 lg:overflow-hidden">
        <SchemaHoch k={knoten} art={art} />
      </div>
    </>
  );
}

/* ================================================================== */
/* Stile                                                               */
/* ================================================================== */

const AUS = "cubic-bezier(0.22, 1, 0.36, 1)";
const SYS = ["regler", "fern", "scada"];

export const W23_SCHEMA_CSS = `
.w23-modul [data-g] { transition: opacity 500ms ${AUS}; }
.w23-hl { opacity: 0; transition: opacity 500ms ${AUS}; }
${SYS.map(
  (s) => `.w23-modul:has(.w23-karte[data-sys="${s}"]:is(:hover, :focus-visible)) [data-g]:not([data-g~="${s}"]) { opacity: 0.14; }
.w23-modul:has(.w23-karte[data-sys="${s}"]:is(:hover, :focus-visible)) .w23-hl[data-hl="${s}"] { opacity: 1; }`
).join("\n")}
.w23-modul .w23-hl[data-hl="fern"], .w23-modul .w23-hl[data-hl="scada"] { filter: drop-shadow(0 0 6px rgba(174,208,131,0.55)); }

.w23-amb { opacity: 0; }
.w23-knopf { opacity: 1; }

@media (prefers-reduced-motion: no-preference) {
  .w23-buehne[data-bereit] .w23-heben,
  .w23-buehne[data-bereit] .w23-pop { opacity: 0; }
  .w23-buehne[data-bereit] .w23-wachsen { transform: scaleY(0); }
  .w23-buehne[data-bereit] .w23-strich { stroke-dasharray: 1 1; stroke-dashoffset: 1; }
  .w23-pop, .w23-wachsen { transform-box: fill-box; }
  .w23-pop { transform-origin: center; }
  .w23-wachsen { transform-origin: 50% 0; }

  .w23-buehne[data-an] .w23-heben { animation: w23-heben 900ms ${AUS} var(--d, 0ms) both; }
  .w23-buehne[data-an] .w23-pop { animation: w23-pop 1000ms ${AUS} var(--d, 0ms) both; }
  .w23-buehne[data-an] .w23-wachsen { animation: w23-wachsen 900ms ${AUS} var(--d, 0ms) both; }
  .w23-buehne[data-an] .w23-strich { animation: w23-zeichnen var(--t, 1200ms) cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms) both; }

  .w23-buehne[data-an] .w23-paket-x { animation: w23-paket-x 4.8s linear var(--d) infinite; }
  .w23-buehne[data-an] .w23-paket-y { animation: w23-paket-y 4.8s linear var(--d) infinite; }
  .w23-buehne[data-an] .w23-speicher { animation: w23-speicher 9.6s ${AUS} var(--d) infinite; }
  .w23-buehne[data-an] .w23-daten { animation: w23-daten 2.7s ${AUS} var(--d) infinite; }
  .w23-buehne[data-an] .w23-komet { stroke-dasharray: 0.08 2; animation: w23-komet 6s linear var(--d) infinite; }
  .w23-buehne[data-an] .w23-ring { transform-box: fill-box; transform-origin: center; animation: w23-ring 6s linear var(--d) infinite; }
  .w23-buehne[data-an] .w23-knopf { animation: w23-knopf 6s cubic-bezier(0.65, 0, 0.35, 1) var(--d) infinite; }
  .w23-buehne:not([data-sicht]) .w23-amb { animation-play-state: paused; }
  @media (max-width: 1023.98px) { .w23-quer .w23-amb { animation-play-state: paused; } }
  @media (min-width: 1024px) { .w23-hoch .w23-amb { animation-play-state: paused; } }
}
@keyframes w23-heben { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes w23-pop { from { opacity: 0; transform: translateY(16px) scale(0.9); } to { opacity: 1; transform: none; } }
@keyframes w23-wachsen { from { transform: scaleY(0); } to { transform: none; } }
@keyframes w23-zeichnen { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes w23-paket-x { 0% { transform: translateX(0); opacity: 0; } 6% { opacity: 1; } 92% { opacity: 1; } 100% { transform: translateX(var(--w23-dx)); opacity: 0; } }
@keyframes w23-paket-y { 0% { transform: translateY(0); opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { transform: translateY(var(--w23-dy)); opacity: 0; } }
@keyframes w23-speicher { 0% { transform: translateY(0); opacity: 0; } 5% { opacity: 1; } 30% { transform: translateY(var(--w23-dy)); opacity: 1; } 34%, 52% { transform: translateY(var(--w23-dy)); opacity: 0; } 57% { opacity: 1; } 82% { transform: translateY(0); opacity: 1; } 86%, 100% { transform: translateY(0); opacity: 0; } }
@keyframes w23-daten { 0% { transform: translateY(0); opacity: 0; } 12% { opacity: 1; } 62% { opacity: 1; } 70%, 100% { transform: translateY(var(--w23-dy)); opacity: 0; } }
@keyframes w23-komet { 0% { stroke-dashoffset: 0.08; opacity: 0; } 3% { stroke-dashoffset: 0.06; opacity: 1; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } 34% { stroke-dashoffset: -0.92; opacity: 1; } 37%, 100% { stroke-dashoffset: -1; opacity: 0; } }
@keyframes w23-ring { 0%, 33% { opacity: 0; transform: scale(1); } 35% { opacity: 0.8; transform: scale(1); animation-timing-function: ${AUS}; } 72%, 100% { opacity: 0; transform: scale(1.38); } }
@keyframes w23-knopf { 0%, 35% { transform: translateX(0); } 47%, 80% { transform: translateX(var(--w23-dx)); } 94%, 100% { transform: translateX(0); } }
`;
