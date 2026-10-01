"use client";

import { useId } from "react";
import { Euro, RefreshCw, Sun, UtilityPole, Wrench } from "lucide-react";
import { GRUEN, GRUEN_HELL, SONNE, NAVY, DISPLAY, rd, SvgIcon } from "./gemeinsam";

/* ================================================================== */
/* 2 · Betrieb: eigene Solarparks seit 2012                            */
/* ================================================================== */
//
// Choreografie (ms ab `aktiv`):
//   0–1100     Überschrift steigt auf, Zeitachse zeichnet sich, Modultische erscheinen gedämpft
//   550–2750   die Sonne zieht auf ihrer Bahn von 2012 bis „heute“; jeder Jahrestisch zündet,
//              wenn sie darüber steht (Lichtkegel, Glanz über das Glas, Zellraster leuchtet),
//              die grüne Betriebslinie läuft synchron mit
//   2750       Ankunft bei „heute“: Marke, Puls, bleibender Lichtkegel
//   2300–3700  „Was wir aus dem Betrieb kennen“: Leitung von „heute“ zu den fünf Themen
//   ab ~4000   ruhige Dauerbewegung im 7-s-Takt: ein Lichtimpuls läuft über die Jahre bis „heute“
//              und weiter durch die Leitung, jedes Thema leuchtet auf, wenn er es erreicht;
//              dazu Lichtbahn über das Modulglas und atmender Sonnenschein

// Raster 1040 × 840
const MOD_OBEN = 318; // Oberkante der Modultische
const MOD_H = 96; // Höhe eines Moduls (zwei übereinander je Tisch)
const MOD_SPALT = 4;
const MOD_UNTEN = MOD_OBEN + 2 * MOD_H + MOD_SPALT; // 514
const ACHSE = 550; // Zeitachse
const JAHR_Y = 592; // Jahreszahlen
const SONNE_Y0 = 250; // Sonnenbahn: Start über 2012 …
const SONNE_Y1 = 140; // … Scheitel über „heute“
const START = 550; // Sonnenlauf beginnt
const LAUF = 2200; // Dauer Sonnenlauf
const ANKUNFT = START + LAUF;
const TAKT = 7000; // Dauerbewegung
const TAKT_START = ANKUNFT + 1300;
// Zeitfunktion des Sonnenlaufs: u(p) = p · (1.6 − 0.6 p), als cubic-bezier exakt abgebildet.
const LAUF_KURVE = "cubic-bezier(0.3333, 0.5333, 0.6667, 0.8667)";
const zeitAnteil = (u) => (1.6 - Math.sqrt(2.56 - 2.4 * u)) / 1.2;

// Senkrechte Bewegung der Sonne (Parabel y = Y1 + (Y0 − Y1)(1 − u)²), fein abgetastet.
const SONNE_Y_KEYS = Array.from({ length: 21 }, (_, k) => {
  const p = k / 20;
  const u = p * (1.6 - 0.6 * p);
  return `${k * 5}%{transform:translateY(${rd(SONNE_Y1 + (SONNE_Y0 - SONNE_Y1) * (1 - u) ** 2)}px)}`;
}).join("");

const THEMEN = [
  { icon: Sun, l: ["Ertrag"] },
  { icon: Wrench, l: ["Wartung"] },
  { icon: RefreshCw, l: ["Wechselrichter-", "tausch"] },
  { icon: UtilityPole, l: ["Netzbetreiber"] },
  { icon: Euro, l: ["Vermarktung"] },
];
const THEMA_X = [88, 290, 492, 694, 896];
const THEMA_Y = 740;
const BUS_OBEN = 612; // Leitung beginnt unter der „heute“-Marke
// Lichtimpuls im Takt (Prozent): Achse 0–26, Leitung senkrecht 26–33, waagrecht 33–63
const H_VON = 33;
const H_BIS = 63;

/** Klasse + Verzögerung; Animation läuft nur, solange die Folie aktiv ist. */
const an = (aktiv, klasse, ms = 0, dauer) => ({
  className: aktiv ? `${klasse} tv02-an` : klasse,
  style: aktiv ? { animationDelay: `${ms}ms`, ...(dauer ? { animationDuration: `${dauer}ms` } : null) } : undefined,
});

function zellRaster(x, y, w, h, spalten = 6, zeilen = 10) {
  let d = "";
  for (let s = 1; s < spalten; s++) d += `M${rd(x + (s * w) / spalten)} ${y}V${y + h}`;
  for (let z = 1; z < zeilen; z++) d += `M${x} ${rd(y + (z * h) / zeilen)}H${rd(x + w)}`;
  return d;
}

const CSS = `
  .tv02-ein{opacity:0}
  .tv02-ein.tv02-an{opacity:1;animation:tv02-ein 900ms cubic-bezier(.22,1,.36,1) both}
  @keyframes tv02-ein{from{opacity:0}}
  .tv02-hoch{opacity:0}
  .tv02-hoch.tv02-an{opacity:1;transform:none;animation:tv02-hoch 1100ms cubic-bezier(.22,1,.36,1) both}
  @keyframes tv02-hoch{from{opacity:0;transform:translateY(22px)}}
  .tv02-licht{opacity:0}
  .tv02-licht.tv02-an{opacity:1;animation:tv02-ein 750ms cubic-bezier(.22,1,.36,1) both}
  .tv02-hell{opacity:.34}
  .tv02-hell.tv02-an{opacity:1;animation:tv02-hell 700ms ease-out both}
  @keyframes tv02-hell{from{opacity:.34}}
  .tv02-knoten{opacity:0;transform-box:fill-box;transform-origin:center}
  .tv02-knoten.tv02-an{opacity:1;transform:none;animation:tv02-knoten 650ms cubic-bezier(.22,1,.36,1) both}
  @keyframes tv02-knoten{from{opacity:0;transform:scale(.2)}}
  .tv02-glanz{opacity:0}
  .tv02-glanz.tv02-an{animation:tv02-glanz 1100ms cubic-bezier(.45,0,.2,1) both}
  @keyframes tv02-glanz{0%{opacity:0;transform:translateX(0)}18%{opacity:1}78%{opacity:1}100%{opacity:0;transform:translateX(var(--tv02-glanz))}}
  .tv02-strahl{opacity:0}
  .tv02-strahl.tv02-an{animation:tv02-strahl 1000ms ease-out both}
  @keyframes tv02-strahl{0%{opacity:0}22%{opacity:1}100%{opacity:0}}
  .tv02-sx{transform:translateX(var(--tv02-x1))}
  .tv02-sx.tv02-an{animation:tv02-sx ${LAUF}ms ${LAUF_KURVE} both}
  @keyframes tv02-sx{from{transform:translateX(var(--tv02-x0))}to{transform:translateX(var(--tv02-x1))}}
  .tv02-sy{transform:translateY(${SONNE_Y1}px)}
  .tv02-sy.tv02-an{animation:tv02-sy ${LAUF}ms linear both}
  @keyframes tv02-sy{${SONNE_Y_KEYS}}
  .tv02-sonne{opacity:0}
  .tv02-sonne.tv02-an{opacity:1;transform:none;animation:tv02-sonne 1000ms cubic-bezier(.22,1,.36,1) both}
  @keyframes tv02-sonne{from{opacity:0;transform:scale(.35)}}
  .tv02-bahn{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0)}
  .tv02-bahn.tv02-an{transform:none;animation:tv02-bahn ${LAUF}ms ${LAUF_KURVE} both}
  @keyframes tv02-bahn{from{transform:scaleX(0)}}
  .tv02-kopf{opacity:0;transform:translateX(var(--tv02-dx))}
  .tv02-kopf.tv02-an{opacity:1;animation:tv02-kopf ${LAUF}ms ${LAUF_KURVE} both}
  @keyframes tv02-kopf{from{transform:translateX(0)}to{transform:translateX(var(--tv02-dx))}}
  .tv02-atmen.tv02-an{animation:tv02-atmen 5.5s ease-in-out infinite alternate both}
  @keyframes tv02-atmen{from{transform:scale(.9);opacity:.7}to{transform:scale(1.08);opacity:1}}
  .tv02-sweep{opacity:0}
  .tv02-sweep.tv02-an{animation:tv02-sweep 9s cubic-bezier(.45,0,.25,1) infinite both}
  @keyframes tv02-sweep{0%{opacity:1;transform:translateX(0)}55%{opacity:1;transform:translateX(1500px)}100%{opacity:1;transform:translateX(1500px)}}
  .tv02-komA,.tv02-komV,.tv02-komH{opacity:0}
  .tv02-komA.tv02-an{animation:tv02-komA ${TAKT}ms linear infinite both}
  .tv02-komV.tv02-an{animation:tv02-komV ${TAKT}ms linear infinite both}
  .tv02-komH.tv02-an{animation:tv02-komH ${TAKT}ms linear infinite both}
  @keyframes tv02-komA{0%{opacity:0;transform:translateX(0)}3%{opacity:1}24%{opacity:1}26%,100%{opacity:0;transform:translateX(var(--tv02-dx))}}
  @keyframes tv02-komV{0%,26%{opacity:0;transform:translateY(0)}27%{opacity:1}32%{opacity:1}${H_VON}%,100%{opacity:0;transform:translateY(${THEMA_Y - 24 - BUS_OBEN}px)}}
  @keyframes tv02-komH{0%,${H_VON}%{opacity:0;transform:translateX(0)}${H_VON + 1}%{opacity:1}${H_BIS - 2}%{opacity:1}${H_BIS}%,100%{opacity:0;transform:translateX(calc(-1 * var(--tv02-bus)))}}
  .tv02-welle{opacity:0;transform-box:fill-box;transform-origin:center}
  .tv02-welle.tv02-an{animation:tv02-welle ${TAKT}ms cubic-bezier(.22,1,.36,1) infinite both}
  @keyframes tv02-welle{0%{opacity:0;transform:scale(1)}4%{opacity:.85;transform:scale(1)}36%,100%{opacity:0;transform:scale(1.55)}}
  .tv02-glimmen{opacity:0}
  .tv02-glimmen.tv02-an{animation:tv02-glimmen ${TAKT}ms ease-out infinite both}
  @keyframes tv02-glimmen{0%{opacity:0}5%{opacity:1}40%,100%{opacity:0}}
  .tv02-puls{opacity:0;transform-box:fill-box;transform-origin:center}
  .tv02-puls.tv02-an{animation:tv02-puls 3s cubic-bezier(.22,1,.36,1) infinite both}
  @keyframes tv02-puls{0%{opacity:0;transform:scale(1)}6%{opacity:.8;transform:scale(1.1)}70%,100%{opacity:0;transform:scale(3.4)}}
  @media (prefers-reduced-motion: reduce){
    .tv02-an{animation:none !important}
  }
`;

export default function BetriebGrafik({ aktiv }) {
  const id = useId().replace(/:/g, "");
  // Jahr ist auf Server und Browser gleich (Hydration unkritisch).
  const heute = new Date().getFullYear();
  const jahre = Array.from({ length: heute - 2012 + 1 }, (_, i) => 2012 + i);
  const n = jahre.length;
  const luecke = 8;
  const w = rd((1000 - (n - 1) * luecke) / n);
  const links = (i) => rd(20 + i * (w + luecke));
  const mitte = (i) => rd(20 + i * (w + luecke) + w / 2);
  const c0 = mitte(0);
  const cN = mitte(n - 1);
  const zuend = (i) => START + Math.round(LAUF * zeitAnteil(n > 1 ? i / (n - 1) : 1));
  const sonneY = (u) => rd(SONNE_Y1 + (SONNE_Y0 - SONNE_Y1) * (1 - u) ** 2);

  const busX = rd(cN - 10); // senkrechter Teil der Leitung
  const busH0 = rd(cN - 34); // Beginn des waagrechten Teils
  const busLaenge = rd(busH0 - THEMA_X[0]);
  const busPfad = `M${busX} ${BUS_OBEN}V${THEMA_Y - 24}Q${busX} ${THEMA_Y} ${busH0} ${THEMA_Y}H${THEMA_X[0]}`;
  // Zeitpunkt, zu dem der Lichtimpuls ein Thema erreicht (im Takt, ab TAKT_START)
  const themaTakt = (x) => TAKT_START + Math.round((TAKT * (H_VON + ((H_BIS - H_VON) * Math.max(0, busH0 - x - 22)) / busLaenge)) / 100);

  const alleModule = jahre.flatMap((_, i) => [
    <rect key={`${i}a`} x={links(i)} y={MOD_OBEN} width={w} height={MOD_H} rx="2.5" />,
    <rect key={`${i}b`} x={links(i)} y={MOD_OBEN + MOD_H + MOD_SPALT} width={w} height={MOD_H} rx="2.5" />,
  ]);

  return (
    <svg
      viewBox="0 0 1040 840"
      className="h-full w-full"
      aria-hidden="true"
      style={{
        overflow: "visible",
        "--tv02-x0": `${c0}px`,
        "--tv02-x1": `${cN}px`,
        "--tv02-dx": `${rd(cN - c0)}px`,
        "--tv02-glanz": `${rd(w + 110)}px`,
        "--tv02-bus": `${busLaenge}px`,
      }}
    >
      <style>{CSS}</style>

      <defs>
        <linearGradient id={`${id}d`} x1="0" x2="0.5" y1="0" y2="1">
          <stop offset="0" stopColor="#0e2c5e" />
          <stop offset="1" stopColor="#071a3b" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" x2="0.55" y1="0" y2="1">
          <stop offset="0" stopColor="#3a7fdc" />
          <stop offset="0.45" stopColor="#1a4fa3" />
          <stop offset="1" stopColor="#0c2d69" />
        </linearGradient>
        <linearGradient id={`${id}k`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.55" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={`${id}kh`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.3" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={`${id}sw`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}pg`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.35" />
          <stop offset="1" stopColor={GRUEN_HELL} />
        </linearGradient>
        {/* Schweife der Lichtimpulse: nach rechts, nach unten, nach links */}
        <linearGradient id={`${id}sr`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0" />
          <stop offset="1" stopColor="#e9f5da" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${id}su`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0" />
          <stop offset="1" stopColor="#e9f5da" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${id}sl`} x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0" />
          <stop offset="1" stopColor="#e9f5da" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id={`${id}halo`}>
          <stop offset="0" stopColor={SONNE} stopOpacity="0.42" />
          <stop offset="0.3" stopColor={SONNE} stopOpacity="0.14" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}disc`} cx="0.4" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.45" stopColor={SONNE} />
          <stop offset="1" stopColor="#f2a31b" />
        </radialGradient>
        <radialGradient id={`${id}boden`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1b4a8f" stopOpacity="0.32" />
          <stop offset="1" stopColor="#1b4a8f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}gl`}>
          <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0.9" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}alle`}>{alleModule}</clipPath>
      </defs>

      {/* Tiefe: weicher Lichtschein hinter der Modulreihe */}
      <ellipse cx="520" cy="420" rx="560" ry="190" fill={`url(#${id}boden)`} />

      {/* Überschrift */}
      <g {...an(aktiv, "tv02-hoch", 0)}>
        <text x="20" y="42" fontSize="26" fontWeight="700" fill="rgba(255,255,255,0.72)" style={DISPLAY}>
          Eigene Solarparks in Betrieb
        </text>
      </g>
      <g {...an(aktiv, "tv02-hoch", 120)}>
        <text x="16" y="110" fontSize="58" fontWeight="800" fill="#fff" letterSpacing="-1.5" style={DISPLAY}>
          seit <tspan fill={GRUEN}>2012</tspan>
        </text>
      </g>

      {/* Sonnenbahn (gepunktet) */}
      <g {...an(aktiv, "tv02-ein", 250, 1400)}>
        <path d={`M${c0} ${SONNE_Y0}Q${rd((c0 + cN) / 2)} ${SONNE_Y1} ${cN} ${SONNE_Y1}`} fill="none" stroke="rgba(255,197,61,0.42)" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="0.1 10" />
      </g>

      {/* Lichtkegel beim Zünden jedes Jahres */}
      {jahre.map((j, i) => {
        const x = links(i);
        const sx = mitte(i);
        const sy = sonneY(n > 1 ? i / (n - 1) : 1) + 26;
        return <polygon key={`k${j}`} points={`${rd(sx - 9)},${sy} ${rd(sx + 9)},${sy} ${rd(x + w)},${MOD_OBEN} ${x},${MOD_OBEN}`} fill={`url(#${id}k)`} {...an(aktiv, "tv02-strahl", zuend(i) - 120)} />;
      })}
      {/* bleibender Lichtkegel auf „heute“ */}
      <g {...an(aktiv, "tv02-ein", ANKUNFT - 150, 1400)}>
        <polygon points={`${rd(cN - 12)},${SONNE_Y1 + 28} ${rd(cN + 12)},${SONNE_Y1 + 28} ${rd(cN + w / 2 + 3)},${MOD_OBEN} ${rd(cN - w / 2 - 3)},${MOD_OBEN}`} fill={`url(#${id}kh)`} />
      </g>

      {/* Modultische, einer je Betriebsjahr */}
      {jahre.map((j, i) => {
        const x = links(i);
        const letzte = i === n - 1;
        const t = zuend(i);
        const y2 = MOD_OBEN + MOD_H + MOD_SPALT;
        return (
          <g key={`m${j}`}>
            <g {...an(aktiv, "tv02-ein", 180 + i * 35, 700)}>
              {/* Stütze bis zur Zeitachse */}
              <path d={`M${rd(x + w / 2)} ${MOD_UNTEN}V${ACHSE - 5}`} stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
              {[MOD_OBEN, y2].map((y) => (
                <g key={y}>
                  <rect x={x} y={y} width={w} height={MOD_H} rx="2.5" fill={`url(#${id}d)`} />
                  <path d={zellRaster(x, y, w, MOD_H)} stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
                  <rect x={x} y={y} width={w} height={MOD_H} rx="2.5" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                </g>
              ))}
            </g>
            {/* gezündet: helles Glas, leuchtendes Zellraster */}
            <g {...an(aktiv, "tv02-licht", t)}>
              {[MOD_OBEN, y2].map((y) => (
                <g key={y}>
                  <rect x={x} y={y} width={w} height={MOD_H} rx="2.5" fill={`url(#${id}l)`} />
                  <path d={zellRaster(x, y, w, MOD_H)} stroke="rgba(214,232,255,0.2)" strokeWidth="0.8" />
                  <path d={`M${x} ${rd(y + MOD_H * 0.62)}L${rd(x + w)} ${rd(y + MOD_H * 0.22)}V${rd(y + MOD_H * 0.4)}L${x} ${rd(y + MOD_H * 0.8)}Z`} fill="#fff" opacity="0.07" />
                  <rect x={x} y={y} width={w} height={MOD_H} rx="2.5" fill="none" stroke={letzte ? GRUEN : "rgba(174,208,131,0.5)"} strokeWidth={letzte ? 2.5 : 1.2} />
                  <path d={`M${rd(x + 2)} ${y + 0.8}H${rd(x + w - 2)}`} stroke="#fff" strokeOpacity="0.55" strokeWidth="1" />
                </g>
              ))}
            </g>
            {/* Glanz, der über das Glas zieht */}
            <clipPath id={`${id}c${i}`}>
              <rect x={x} y={MOD_OBEN} width={w} height={MOD_H} />
              <rect x={x} y={y2} width={w} height={MOD_H} />
            </clipPath>
            <g clipPath={`url(#${id}c${i})`}>
              <g {...an(aktiv, "tv02-glanz", t - 60)}>
                <polygon points={`${rd(x - 44)},${MOD_OBEN} ${rd(x - 14)},${MOD_OBEN} ${rd(x - 64)},${MOD_UNTEN} ${rd(x - 94)},${MOD_UNTEN}`} fill="#fff" opacity="0.5" />
                <polygon points={`${rd(x - 6)},${MOD_OBEN} ${rd(x + 2)},${MOD_OBEN} ${rd(x - 48)},${MOD_UNTEN} ${rd(x - 56)},${MOD_UNTEN}`} fill="#fff" opacity="0.35" />
              </g>
            </g>
          </g>
        );
      })}

      {/* Dauerbewegung: Lichtbahn über das gesamte Modulglas */}
      <g clipPath={`url(#${id}alle)`}>
        <g {...an(aktiv, "tv02-sweep", ANKUNFT + 1400)}>
          <polygon points={`-260,${MOD_OBEN} -120,${MOD_OBEN} -200,${MOD_UNTEN} -340,${MOD_UNTEN}`} fill={`url(#${id}sw)`} />
        </g>
      </g>

      {/* Zeitachse */}
      <path d={`M20 ${ACHSE}H1020`} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" pathLength="1" className={`tv-strich ${aktiv ? "tv-zeichnen" : ""}`} style={aktiv ? { animationDelay: "120ms", animationDuration: "1100ms" } : undefined} />
      <line x1={c0} x2={cN} y1={ACHSE} y2={ACHSE} stroke={GRUEN} strokeOpacity="0.18" strokeWidth="12" strokeLinecap="round" {...an(aktiv, "tv02-bahn", START)} />
      <line x1={c0} x2={cN} y1={ACHSE} y2={ACHSE} stroke={`url(#${id}pg)`} strokeWidth="3.5" strokeLinecap="round" {...an(aktiv, "tv02-bahn", START)} />

      {/* Jahresmarken */}
      {jahre.map((j, i) => {
        const cx = mitte(i);
        const erste = i === 0;
        const letzte = i === n - 1;
        const beschriften = erste || (i % 2 === 0 && i < n - 2);
        const t = zuend(i);
        return (
          <g key={`j${j}`}>
            <g {...an(aktiv, "tv02-ein", 180 + i * 35, 700)}>
              <circle cx={cx} cy={ACHSE} r="4.5" fill={NAVY} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            </g>
            <circle cx={cx} cy={ACHSE} r={letzte ? 8 : 5.5} fill={letzte ? GRUEN : GRUEN_HELL} {...an(aktiv, "tv02-knoten", t)} />
            {beschriften && !letzte && (
              <g {...an(aktiv, "tv02-ein", 180 + i * 35, 700)}>
                <g {...an(aktiv, "tv02-hell", t)}>
                  <text x={cx} y={JAHR_Y} textAnchor="middle" fontSize={erste ? 26 : 21} fontWeight={erste ? 800 : 600} fill={erste ? "#fff" : "rgba(255,255,255,0.62)"} style={DISPLAY}>
                    {j}
                  </text>
                </g>
              </g>
            )}
          </g>
        );
      })}

      {/* Leitung von „heute“ zu den Themen */}
      <path d={busPfad} fill="none" stroke="rgba(174,208,131,0.4)" strokeWidth="2" strokeLinecap="round" pathLength="1" className={`tv-strich ${aktiv ? "tv-zeichnen" : ""}`} style={aktiv ? { animationDelay: `${ANKUNFT - 50}ms`, animationDuration: "900ms" } : undefined} />

      {/* Lichtimpulse (Dauerbewegung): über die Jahre, dann durch die Leitung */}
      <g {...an(aktiv, "tv02-komA", TAKT_START)}>
        <rect x={rd(c0 - 110)} y={ACHSE - 2} width="110" height="4" rx="2" fill={`url(#${id}sr)`} />
        <circle cx={c0} cy={ACHSE} r="15" fill={`url(#${id}gl)`} opacity="0.75" />
        <circle cx={c0} cy={ACHSE} r="4.5" fill="#fff" />
      </g>
      <g {...an(aktiv, "tv02-komV", TAKT_START)}>
        <rect x={busX - 2} y={BUS_OBEN - 40} width="4" height="40" rx="2" fill={`url(#${id}su)`} />
        <circle cx={busX} cy={BUS_OBEN} r="13" fill={`url(#${id}gl)`} opacity="0.75" />
        <circle cx={busX} cy={BUS_OBEN} r="4" fill="#fff" />
      </g>
      <g {...an(aktiv, "tv02-komH", TAKT_START)}>
        <rect x={busH0} y={THEMA_Y - 2} width="110" height="4" rx="2" fill={`url(#${id}sl)`} />
        <circle cx={busH0} cy={THEMA_Y} r="15" fill={`url(#${id}gl)`} opacity="0.75" />
        <circle cx={busH0} cy={THEMA_Y} r="4.5" fill="#fff" />
      </g>

      {/* „heute“ */}
      <circle cx={cN} cy={ACHSE} r="8" fill="none" stroke={GRUEN_HELL} strokeWidth="2" {...an(aktiv, "tv02-puls", ANKUNFT)} />
      <g {...an(aktiv, "tv02-hoch", ANKUNFT - 100, 900)}>
        <rect x="940" y={JAHR_Y - 26} width="80" height="38" rx="19" fill={GRUEN} />
        <text x="980" y={JAHR_Y} textAnchor="middle" fontSize="23" fontWeight="800" fill={NAVY} style={DISPLAY}>
          heute
        </text>
      </g>

      {/* Lichtpunkt, der mit der Sonne über die Achse läuft */}
      <g {...an(aktiv, "tv02-kopf", START)}>
        <circle cx={c0} cy={ACHSE} r="18" fill={`url(#${id}gl)`} opacity="0.55" />
        <circle cx={c0} cy={ACHSE} r="6" fill="#fff" />
      </g>

      {/* Sonne */}
      <g {...an(aktiv, "tv02-sx", START)}>
        <g {...an(aktiv, "tv02-sy", START)}>
          <g {...an(aktiv, "tv02-sonne", 300)}>
            <g {...an(aktiv, "tv02-atmen", ANKUNFT)}>
              <circle r="140" fill={`url(#${id}halo)`} />
            </g>
            <circle r="38" fill="none" stroke={SONNE} strokeOpacity="0.3" strokeWidth="1.5" />
            <circle r="25" fill={`url(#${id}disc)`} />
          </g>
        </g>
      </g>

      {/* Was wir aus dem Betrieb kennen */}
      <g {...an(aktiv, "tv02-hoch", ANKUNFT - 450)}>
        <text x="20" y="664" fontSize="26" fontWeight="800" fill="#fff" style={DISPLAY}>
          Was wir aus dem Betrieb kennen
        </text>
      </g>
      {THEMEN.map((t, j) => {
        const cx = THEMA_X[j];
        const reihe = THEMEN.length - 1 - j; // Leitung kommt von rechts
        const ms = ANKUNFT + 120 + reihe * 130;
        const takt = themaTakt(cx);
        return (
          <g key={t.l[0]}>
            <g {...an(aktiv, "tv02-hoch", ms, 900)}>
              <circle cx={cx} cy={THEMA_Y} r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
              <circle cx={cx} cy={THEMA_Y} r="35" fill={NAVY} />
              <circle cx={cx} cy={THEMA_Y} r="35" fill="rgba(140,186,88,0.12)" stroke={GRUEN} strokeWidth="1.8" />
              <circle cx={cx} cy={THEMA_Y} r="35" fill="rgba(140,186,88,0.32)" {...an(aktiv, "tv02-glimmen", takt)} />
              <SvgIcon icon={t.icon} x={cx} y={THEMA_Y} s={34} farbe={GRUEN_HELL} />
              {t.l.map((zeile, z) => (
                <text key={zeile} x={cx} y={806 + z * 26} textAnchor="middle" fontSize="22" fontWeight="600" fill="#fff">
                  {zeile}
                </text>
              ))}
            </g>
            <circle cx={cx} cy={THEMA_Y} r="35" fill="none" stroke={GRUEN_HELL} strokeWidth="2" {...an(aktiv, "tv02-welle", takt)} />
          </g>
        );
      })}
    </svg>
  );
}
