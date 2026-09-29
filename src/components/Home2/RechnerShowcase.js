import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { TOOLS } from "@/components/Rechner/tools";
import Reveal from "@/components/ui/Reveal";

/**
 * Startseite: „Rechner & Tools für Ihren Betrieb“ – große Karten mit kleinen,
 * animierten SVG-Motiven (starten, sobald die Karte eingeblendet wird; bei
 * reduzierter Bewegung statisch). Server-Komponente; Titel, Texte und Links
 * kommen aus der zentralen Tool-Liste (src/components/Rechner/tools.js).
 */

const tool = (id) => TOOLS.find((t) => t.id === id);

// Reihenfolge und Rasterplatz (lg: 4 Spalten – 2 + 2 | 1 + 1 + 1 + 1 | Band über die volle Breite)
const KARTEN = [
  { id: "gewerbe-pv", platz: "sm:col-span-2", motiv: MotivGewerbe, gross: true },
  { id: "peak-shaving", platz: "sm:col-span-2", motiv: MotivPeak, breit: true },
  { id: "e-flotte", platz: "", motiv: MotivFlotte },
  { id: "energiegemeinschaft", platz: "", motiv: MotivEeg },
  { id: "blackout", platz: "", motiv: MotivBlackout },
  { id: "standort-check", platz: "", motiv: MotivStandort },
  { id: "foerdercheck", platz: "sm:col-span-2 lg:col-span-4", motiv: MotivFoerderung, gruen: true, band: true },
];

const CSS = `
.hp-tool .hp-bar{transform-box:fill-box;transform-origin:bottom}
.js-ready .hp-tool:not(.is-visible) .hp-bar{transform:scaleY(.08)}
.js-ready .hp-tool:not(.is-visible) .hp-linie{stroke-dashoffset:1}
.js-ready .hp-tool:not(.is-visible) .hp-auf{opacity:0}
.hp-tool.is-visible .hp-bar{transform:scaleY(.08);animation:hp-wachsen 1.1s cubic-bezier(.22,1,.36,1) forwards;animation-delay:calc(var(--i,0) * 60ms + 250ms)}
.hp-tool.is-visible .hp-linie{stroke-dashoffset:1;animation:hp-zeichnen 1.8s cubic-bezier(.22,1,.36,1) .3s forwards}
.hp-tool.is-visible .hp-auf{opacity:0;animation:hp-ein .6s ease-out forwards;animation-delay:calc(var(--i,0) * 120ms + 700ms)}
.hp-tool.is-visible .hp-puls{animation:hp-puls 2.4s ease-in-out infinite;animation-delay:calc(var(--i,0) * 400ms)}
.hp-tool.is-visible .hp-fluss{stroke-dasharray:4 6;animation:hp-fluss 1.4s linear infinite}
.hp-tool:hover .hp-schweben{transform:translateY(-4px)}
.hp-schweben{transition:transform .5s cubic-bezier(.22,1,.36,1)}
@keyframes hp-wachsen{to{transform:scaleY(1)}}
@keyframes hp-zeichnen{to{stroke-dashoffset:0}}
@keyframes hp-ein{to{opacity:1}}
@keyframes hp-puls{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes hp-fluss{to{stroke-dashoffset:-20}}
@media (prefers-reduced-motion:reduce){
  .hp-tool .hp-bar{transform:none!important;animation:none!important}
  .hp-tool .hp-linie{stroke-dashoffset:0!important;animation:none!important}
  .hp-tool .hp-auf{opacity:1!important;animation:none!important}
  .hp-tool .hp-puls,.hp-tool .hp-fluss{animation:none!important}
}
`;

export default function RechnerShowcase() {
  return (
    <>
      <style>{CSS}</style>
      <ul className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
        {KARTEN.map((k, i) => {
          const t = tool(k.id);
          if (!t) return null;
          const Motiv = k.motiv;
          const Icon = t.icon;
          return (
            <Reveal as="li" key={k.id} delay={i * 70} className={`hp-tool flex ${k.platz}`}>
              <Link
                href={t.href}
                className={`group ov-card-hover relative flex w-full overflow-hidden rounded-[1.75rem] p-6 ring-1 transition-colors md:p-7 ${k.band ? "flex-col gap-6 lg:flex-row lg:items-center lg:gap-10" : "flex-col"} ${
                  k.gruen
                    ? "ov-noise bg-gradient-to-br from-ov-600 to-ov-800 ring-white/10"
                    : "bg-white/[0.045] ring-white/10 hover:bg-white/[0.08] hover:ring-white/20"
                } ${k.band ? "" : k.gross || k.breit ? "min-h-[300px] sm:min-h-[320px]" : "sm:min-h-[250px]"}`}
              >
                <div aria-hidden="true" className={`absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125 ${k.gruen ? "bg-sun-300/25" : "bg-ov-500/15"}`} />
                <div className="relative flex items-start justify-between gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-300 ${k.gruen ? "bg-white/15 text-white" : "bg-white/10 text-ov-300 group-hover:bg-ov-500 group-hover:text-white"}`}>
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  {k.gross && t.tag ? (
                    <span className="rounded-full bg-sun-400/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-sun-300">{t.tag}</span>
                  ) : k.band ? null : (
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  )}
                </div>

                {!k.band && (
                  <div className={`hp-schweben relative my-4 flex-1 ${k.gross || k.breit ? "" : "hidden sm:block"}`} aria-hidden="true">
                    <Motiv />
                  </div>
                )}

                <div className={`relative ${k.band ? "lg:max-w-md lg:flex-1" : k.gross || k.breit ? "" : "mt-4 sm:mt-0"}`}>
                  <h3 className={`font-display font-bold tracking-tight text-white ${k.gross ? "text-[clamp(1.5rem,1.2rem+1vw,2rem)]" : "text-[19px]"}`}>{t.titel}</h3>
                  <p className={`mt-1.5 leading-relaxed ${k.gruen ? "text-white/85" : "text-white/60"} ${k.gross ? "max-w-md text-[15.5px]" : "text-[14px]"}`}>{k.band ? t.text : t.kurz}</p>
                  {k.gross && (
                    <span className="mt-3 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ov-300">
                      Hallendach durchrechnen
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </div>
                {k.band && (
                  <>
                    <div className="hp-schweben relative flex-1 lg:max-w-[380px]" aria-hidden="true">
                      <Motiv />
                    </div>
                    <span className="relative inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-ov-800 transition-transform group-hover:scale-[1.03] lg:self-center">
                      Förder-Check starten
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </>
                )}
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Motive (rein dekorativ, aria-hidden über den Container)             */
/* ------------------------------------------------------------------ */

// Monatsertrag (Jänner–Dezember) als wachsende Balken + Lastlinie
function MotivGewerbe() {
  const werte = [22, 35, 58, 74, 88, 94, 97, 86, 66, 45, 26, 18];
  return (
    <svg viewBox="0 0 360 180" className="h-full max-h-[150px] w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="hp-g-bar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#aed083" />
          <stop offset="100%" stopColor="#558227" />
        </linearGradient>
      </defs>
      {[40, 80, 120].map((y) => (
        <line key={y} x1="0" x2="360" y1={y} y2={y} stroke="rgba(255,255,255,0.07)" />
      ))}
      {werte.map((w, i) => {
        const h = (w / 100) * 140;
        return <rect key={i} className="hp-bar" style={{ "--i": i }} x={8 + i * 29.5} y={160 - h} width="18" height={h} rx="4" fill="url(#hp-g-bar)" />;
      })}
      <path className="hp-linie" pathLength="1" d="M8,92 C60,88 100,96 150,90 S250,86 300,92 352,90 352,90" fill="none" stroke="#ffc53d" strokeWidth="2.5" strokeDasharray="1" strokeLinecap="round" />
      <g className="hp-auf" style={{ "--i": 2 }}>
        <rect x="236" y="8" width="118" height="26" rx="13" fill="rgba(255,255,255,0.1)" />
        <circle cx="250" cy="21" r="4" fill="#ffc53d" />
        <text x="260" y="25" fill="rgba(255,255,255,0.8)" fontSize="11" fontWeight="600">Last Ihres Betriebs</text>
      </g>
      {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => (
        <text key={i} x={17 + i * 29.5} y="176" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10">{m}</text>
      ))}
    </svg>
  );
}

// Lastgang mit gekappter Spitze
function MotivPeak() {
  return (
    <svg viewBox="0 0 360 110" className="h-full max-h-[140px] w-full" preserveAspectRatio="xMidYMid meet">
      <path d="M0,90 L30,82 L55,60 L80,64 L105,30 L125,26 L140,58 L170,50 L195,18 L215,22 L235,56 L265,48 L290,66 L320,74 L360,86 L360,110 L0,110Z" fill="rgba(140,186,88,0.12)" />
      <path className="hp-linie" pathLength="1" d="M0,90 L30,82 L55,60 L80,64 L105,30 L125,26 L140,58 L170,50 L195,18 L215,22 L235,56 L265,48 L290,66 L320,74 L360,86" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeDasharray="1" />
      <line className="hp-auf" style={{ "--i": 1 }} x1="0" x2="360" y1="42" y2="42" stroke="#ffc53d" strokeWidth="2" strokeDasharray="6 5" />
      <g className="hp-auf" style={{ "--i": 2 }}>
        <rect x="98" y="24" width="34" height="18" rx="4" fill="rgba(255,197,61,0.25)" />
        <rect x="188" y="12" width="34" height="30" rx="4" fill="rgba(255,197,61,0.25)" />
        <text x="252" y="36" fill="#ffd873" fontSize="11" fontWeight="600">Spitze gekappt</text>
      </g>
    </svg>
  );
}

// Fahrzeug an Ladepunkt mit Energiefluss
function MotivFlotte() {
  return (
    <svg viewBox="0 0 200 90" className="h-full max-h-[100px] w-full" preserveAspectRatio="xMidYMid meet">
      <rect x="14" y="20" width="26" height="54" rx="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" />
      <rect className="hp-puls" x="21" y="30" width="12" height="8" rx="2" fill="#8cba58" />
      <path className="hp-fluss" d="M40,56 C70,56 70,62 96,62" fill="none" stroke="#8cba58" strokeWidth="2.5" />
      <path d="M96,66 L104,48 Q108,42 116,42 L160,42 Q168,42 172,48 L182,62 Q188,63 188,68 L188,72 L96,72Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" />
      <circle cx="118" cy="74" r="7" fill="#03122b" stroke="rgba(255,255,255,0.5)" />
      <circle cx="168" cy="74" r="7" fill="#03122b" stroke="rgba(255,255,255,0.5)" />
    </svg>
  );
}

// Energiegemeinschaft: Erzeuger im Zentrum, Teilnehmer rundum
function MotivEeg() {
  const punkte = [
    [40, 22],
    [160, 22],
    [26, 70],
    [174, 70],
    [100, 84],
  ];
  return (
    <svg viewBox="0 0 200 96" className="h-full max-h-[100px] w-full" preserveAspectRatio="xMidYMid meet">
      {punkte.map(([x, y], i) => (
        <line key={i} className="hp-fluss" x1="100" y1="48" x2={x} y2={y} stroke="rgba(140,186,88,0.7)" strokeWidth="1.8" />
      ))}
      {punkte.map(([x, y], i) => (
        <circle key={i} className="hp-puls" style={{ "--i": i }} cx={x} cy={y} r="8" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.5)" />
      ))}
      <circle cx="100" cy="48" r="15" fill="#558227" stroke="#aed083" strokeWidth="2" />
      <path d="M100,38 L100,41 M100,55 L100,58 M90,48 L93,48 M107,48 L110,48" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="48" r="4" fill="#ffc53d" />
    </svg>
  );
}

// Blackout: Netz aus, Ersatzstrom an
function MotivBlackout() {
  return (
    <svg viewBox="0 0 200 90" className="h-full max-h-[100px] w-full" preserveAspectRatio="xMidYMid meet">
      <path d="M12,70 L60,70 M36,70 L36,24 M24,32 L48,32 M26,44 L46,44" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
      <path d="M62,40 L76,54 M76,40 L62,54" stroke="#ff8a7a" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="112" y="30" width="60" height="42" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.35)" />
      <path className="hp-puls" d="M146,36 L134,54 L143,54 L138,68 L152,48 L143,48 Z" fill="#ffc53d" />
      <path className="hp-fluss" d="M86,51 L112,51" stroke="#8cba58" strokeWidth="2.5" />
    </svg>
  );
}

// Standort-Check: Höhenlinien mit Pin
function MotivStandort() {
  return (
    <svg viewBox="0 0 200 90" className="h-full max-h-[100px] w-full" preserveAspectRatio="xMidYMid meet">
      <path className="hp-linie" pathLength="1" d="M0,80 L40,46 L62,60 L100,14 L132,52 L150,40 L200,80" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="1" strokeLinejoin="round" />
      <path d="M86,31 L100,14 L114,31 L106,27 L100,33 L93,27Z" fill="rgba(255,255,255,0.85)" />
      <g className="hp-auf" style={{ "--i": 1 }}>
        <path d="M150,20 C150,12 162,12 162,20 C162,27 156,32 156,36 C156,32 150,27 150,20Z" fill="#8cba58" />
        <circle cx="156" cy="20" r="2.6" fill="#03122b" />
      </g>
      {[20, 60, 140, 180].map((x, i) => (
        <circle key={x} className="hp-puls" style={{ "--i": i }} cx={x} cy={8 + (i % 2) * 6} r="1.6" fill="#fff" />
      ))}
    </svg>
  );
}

// Förderung: gestapelte Bausteine EAG + IFB + Land
function MotivFoerderung() {
  const teile = [
    { l: "EAG-Zuschuss", w: 150 },
    { l: "IFB 22 %", w: 118 },
    { l: "Land", w: 84 },
  ];
  return (
    <svg viewBox="0 0 360 110" className="h-full max-h-[120px] w-full" preserveAspectRatio="xMinYMid meet">
      {teile.map((t, i) => (
        <g key={t.l} className="hp-auf" style={{ "--i": i }}>
          <rect x="0" y={8 + i * 34} width={t.w} height="26" rx="13" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.3)" />
          <text x="14" y={25 + i * 34} fill="#fff" fontSize="12" fontWeight="600">{t.l}</text>
        </g>
      ))}
      <path className="hp-linie" pathLength="1" d="M190,90 C230,88 250,60 280,50 S330,20 352,14" fill="none" stroke="#ffd873" strokeWidth="3" strokeDasharray="1" strokeLinecap="round" />
      <circle className="hp-auf" style={{ "--i": 3 }} cx="352" cy="14" r="5" fill="#ffd873" />
    </svg>
  );
}
