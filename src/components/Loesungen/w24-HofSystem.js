// src/components/Loesungen/w24-HofSystem.js
//
// Landwirtschaft: „Hof, Wohnhaus und Fläche als ein Energiesystem“.
// Eine gezeichnete Hofansicht im Morgenlicht: Stall, Maschinenhalle und Agri-PV-Fläche erzeugen,
// das Hofnetz verteilt an Wohnhaus mit Wärmepumpe, E-Hoflader und Energiegemeinschaft der Gemeinde.
// Beim Eintritt bauen sich Gebäude und Leitungen auf, danach laufen Energie-Teilchen ruhig durch
// das Hofnetz. Fährt man über eine der drei Karten darunter, leuchtet die passende Leitung auf.
//
// Server-Komponente; Aufbau über <S04Buehne/> (s04-stil), Hover-Kopplung rein per CSS (:has).
// Inhalte (Texte, Punkte, Link, Bild) kommen als Props aus der Seite.

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import S04Buehne from "@/components/Startseite/s04-Buehne";
import { S04_BASIS, d } from "@/components/Startseite/s04-stil";

const GRUEN = "#669933";
const GRUEN_HELL = "#8cba58";
const MODUL = "#12408a";
const LINIE = "#03122b";
const BODEN = 400;
const NETZ = 452;
const VB_Y = 130;
const VB_H = 370;

const CSS = `
${S04_BASIS}
.w24hof-fluss{stroke-dasharray:1.4 9.6;stroke-dashoffset:0;opacity:0;transition:opacity .6s ease 2.6s}
.s04-an .w24hof-fluss{opacity:1;animation:w24hof-fluss 2.6s linear infinite}
@keyframes w24hof-fluss{to{stroke-dashoffset:-11}}
.w24hof-pfad{transition:opacity .4s ease,stroke-width .4s ease}
.w24hof-karte{transition:box-shadow .35s,transform .45s cubic-bezier(.22,1,.36,1)}
@media (hover:hover){
  .w24hof-karte:hover{box-shadow:0 22px 48px -28px rgba(15,23,42,.45),0 0 0 1px rgba(102,153,51,.4)}
  .w24hof:has(.w24hof-karte[data-ziel]:hover) .w24hof-pfad{opacity:.25}
  .w24hof:has(.w24hof-karte[data-ziel="wp"]:hover) .w24hof-pfad-wp,
  .w24hof:has(.w24hof-karte[data-ziel="lader"]:hover) .w24hof-pfad-lader,
  .w24hof:has(.w24hof-karte[data-ziel="eg"]:hover) .w24hof-pfad-eg{opacity:1;stroke-width:4}
  .w24hof:has(.w24hof-karte[data-ziel="wp"]:hover) .w24hof-marke-wp,
  .w24hof:has(.w24hof-karte[data-ziel="lader"]:hover) .w24hof-marke-lader,
  .w24hof:has(.w24hof-karte[data-ziel="eg"]:hover) .w24hof-marke-eg{transform:scale(1.18)}
}
.w24hof-marke{transform-box:fill-box;transform-origin:50% 50%;transition:transform .4s cubic-bezier(.34,1.56,.64,1)}
@media (prefers-reduced-motion:reduce){.s04-an .w24hof-fluss{animation:none;opacity:0}.w24hof-pfad,.w24hof-marke,.w24hof-karte{transition:none}}
`;

/** Modulfeld auf einer Dachfläche (Parallelogramm unten links → rechts, oben eingerückt). */
function Dachmodule({ x1, x2, yUnten, yOben, einzug, spalten, reihen, verz }) {
  const linien = [];
  for (let i = 1; i < spalten; i++) {
    const f = i / spalten;
    linien.push(
      `M${x1 + (x2 - x1) * f},${yUnten} L${x1 + einzug + (x2 - x1 - 2 * einzug) * f},${yOben}`,
    );
  }
  for (let j = 1; j < reihen; j++) {
    const f = j / reihen;
    const y = yUnten - (yUnten - yOben) * f;
    const e = einzug * f;
    linien.push(`M${x1 + e},${y} L${x2 - e},${y}`);
  }
  return (
    <g className="s04-auf" style={d(verz)}>
      <path
        d={`M${x1},${yUnten} L${x2},${yUnten} L${x2 - einzug},${yOben} L${x1 + einzug},${yOben} Z`}
        fill={MODUL}
      />
      <path
        d={linien.join(" ")}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d={`M${x1 + einzug},${yOben} L${x2 - einzug},${yOben}`}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
      />
    </g>
  );
}

function Marke({ x, y, n, art, verz }) {
  return (
    <g className={`s04-pop w24hof-marke w24hof-marke-${art}`} style={d(verz)}>
      <circle
        cx={x}
        cy={y}
        r="15"
        fill="#fff"
        stroke={GRUEN}
        strokeWidth="2.5"
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill={LINIE}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {n}
      </text>
    </g>
  );
}

// Leitungen: Quelle → Hofnetz → Verbraucher
const PFADE = [
  { art: "wp", d: `M380,262 V${NETZ} H185 V392`, verz: 1500 },
  { art: "haus", d: `M380,${NETZ} H96 V${BODEN}`, verz: 1650 },
  { art: "lader", d: `M690,232 V${NETZ} H832 V392`, verz: 1750 },
  { art: "eg", d: `M995,352 V${NETZ} H1152 V${BODEN - 2}`, verz: 1900 },
];

function Szene() {
  return (
    <svg
      viewBox={`0 ${VB_Y} 1200 ${VB_H}`}
      className="block h-auto w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="w24hof-sonne" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd873" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd873" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="w24hof-wiese" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cde3b1" />
          <stop offset="1" stopColor="#e6f1d8" />
        </linearGradient>
      </defs>

      {/* Sonne & Horizont */}
      <circle
        className="s04-pop"
        style={d(100)}
        cx="168"
        cy="214"
        r="110"
        fill="url(#w24hof-sonne)"
      />
      <circle
        className="s04-pop"
        style={d(200)}
        cx="168"
        cy="214"
        r="26"
        fill="#ffc53d"
      />
      <path
        className="s04-auf"
        style={d(300)}
        d={`M0,${BODEN - 26} C180,${BODEN - 52} 360,${BODEN - 34} 560,${BODEN - 44} S900,${BODEN - 58} 1200,${BODEN - 36} L1200,${BODEN} L0,${BODEN} Z`}
        fill="#e6f1d8"
        opacity="0.7"
      />

      {/* Boden & Hofnetz */}
      <rect
        x="0"
        y={BODEN}
        width="1200"
        height={500 - BODEN}
        fill="url(#w24hof-wiese)"
      />
      <line
        className="s04-skx"
        style={d(250, { "--s04-t": "1.2s" })}
        x1="0"
        x2="1200"
        y1={BODEN}
        y2={BODEN}
        stroke={LINIE}
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />

      {/* Bäume hinter den Gebäuden */}
      {[
        [204, 296, 26, 450],
        [566, 288, 30, 650],
        [1098, 340, 18, 1250],
      ].map(([x, y, r, v]) => (
        <g key={x} className="s04-hoch" style={d(v)}>
          <line x1={x} x2={x} y1={y} y2={BODEN} stroke={LINIE} strokeOpacity="0.6" strokeWidth="2" />
          <circle cx={x} cy={y} r={r} fill="#cde3b1" stroke={LINIE} strokeOpacity="0.55" strokeWidth="1.4" />
          <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.38} fill="#e6f1d8" />
        </g>
      ))}

      {/* Wohnhaus mit Wärmepumpe */}
      <g className="s04-hoch" style={d(400)}>
        <path
          d={`M34,${BODEN} V318 L96,268 L158,318 V${BODEN} Z`}
          fill="#fff"
          stroke={LINIE}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M24,326 L96,264 L168,326"
          fill="none"
          stroke={LINIE}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <rect
          x="58"
          y="336"
          width="22"
          height="22"
          rx="2"
          fill="#eef4fb"
          stroke={LINIE}
          strokeWidth="1.2"
        />
        <rect
          x="104"
          y="350"
          width="26"
          height="50"
          rx="2"
          fill="#f5f3ea"
          stroke={LINIE}
          strokeWidth="1.2"
        />
        <rect
          x="170"
          y="370"
          width="30"
          height="30"
          rx="4"
          fill="#fff"
          stroke={LINIE}
          strokeWidth="1.4"
        />
        <circle
          cx="185"
          cy="385"
          r="9"
          fill="none"
          stroke={LINIE}
          strokeWidth="1.2"
        />
        <path d="M185,376 V394 M176,385 H194" stroke={LINIE} strokeWidth="1" />
      </g>

      {/* Stall (lang, PV auf der Dachfläche) */}
      <g className="s04-hoch" style={d(550)}>
        <rect
          x="222"
          y="314"
          width="318"
          height={BODEN - 314}
          fill="#fff"
          stroke={LINIE}
          strokeWidth="1.6"
        />
        {Array.from({ length: 7 }, (_, i) => (
          <rect
            key={i}
            x={240 + i * 42}
            y="338"
            width="26"
            height="16"
            rx="2"
            fill="#eef4fb"
            stroke={LINIE}
            strokeWidth="1"
          />
        ))}
        <path
          d="M212,316 L550,316 L520,258 L242,258 Z"
          fill="#f5f3ea"
          stroke={LINIE}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </g>
      <Dachmodule
        x1={226}
        x2={536}
        yUnten={310}
        yOben={264}
        einzug={24}
        spalten={10}
        reihen={2}
        verz={900}
      />

      {/* Maschinenhalle mit großem Tor */}
      <g className="s04-hoch" style={d(700)}>
        <rect
          x="590"
          y="280"
          width="200"
          height={BODEN - 280}
          fill="#fff"
          stroke={LINIE}
          strokeWidth="1.6"
        />
        <rect
          x="626"
          y="318"
          width="92"
          height={BODEN - 318}
          fill="#f5f3ea"
          stroke={LINIE}
          strokeWidth="1.3"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="626"
            x2="718"
            y1={334 + i * 14}
            y2={334 + i * 14}
            stroke={LINIE}
            strokeOpacity="0.25"
          />
        ))}
        <path
          d="M580,282 L800,282 L768,220 L612,220 Z"
          fill="#f5f3ea"
          stroke={LINIE}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </g>
      <Dachmodule
        x1={586}
        x2={794}
        yUnten={276}
        yOben={226}
        einzug={26}
        spalten={7}
        reihen={2}
        verz={1050}
      />

      {/* E-Hoflader vor der Halle */}
      <g className="s04-links" style={d(1200)}>
        <path
          d={`M800,${BODEN - 14} V368 Q800,362 806,362 L832,362 L838,348 L858,348 Q864,348 864,354 V${BODEN - 14} Z`}
          fill="#fff"
          stroke={LINIE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M842,352 L856,352 L856,364 L838,364 Z" fill="#d9e6f5" />
        <path
          d="M776,374 L800,370 M776,374 L770,390"
          stroke={LINIE}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="814"
          cy={BODEN - 12}
          r="12"
          fill="#fff"
          stroke={LINIE}
          strokeWidth="2"
        />
        <circle
          cx="852"
          cy={BODEN - 9}
          r="9"
          fill="#fff"
          stroke={LINIE}
          strokeWidth="2"
        />
        <path
          d="M822,368 L816,378 L822,378 L818,388 L828,375 L822,375 L826,368 Z"
          fill={GRUEN_HELL}
        />
      </g>

      {/* Agri-PV: senkrechte Modulreihen zwischen Grünlandstreifen */}
      <g>
        {Array.from({ length: 5 }, (_, i) => {
          const x = 912 + i * 42;
          return (
            <g key={i} className="s04-hoch" style={d(1150 + i * 70)}>
              <line
                x1={x + 3}
                x2={x + 3}
                y1="352"
                y2={BODEN}
                stroke={LINIE}
                strokeWidth="1.5"
              />
              <rect
                x={x - 2}
                y="330"
                width="10"
                height="48"
                rx="1.5"
                fill={MODUL}
              />
              <line
                x1={x + 3}
                x2={x + 3}
                y1="332"
                y2="376"
                stroke="rgba(255,255,255,0.35)"
              />
              <path
                d={`M${x + 14},${BODEN} q4,-12 8,0 q4,-10 8,0`}
                fill="none"
                stroke={GRUEN}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>

      {/* Gemeinde am Horizont */}
      <g className="s04-auf" style={d(1300)}>
        <path
          d={`M1112,${BODEN} V376 L1124,366 L1136,376 V${BODEN} Z M1140,${BODEN} V372 L1154,360 L1168,372 V${BODEN} Z M1172,${BODEN} V340 L1180,326 L1188,340 V${BODEN} Z`}
          fill="#eef0f4"
          stroke={LINIE}
          strokeOpacity="0.55"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <line
          x1="1180"
          x2="1180"
          y1="318"
          y2="326"
          stroke={LINIE}
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
      </g>

      {/* Hofnetz-Leitungen */}
      {PFADE.map((p) => (
        <path
          key={`b-${p.art}`}
          d={p.d}
          fill="none"
          stroke={LINIE}
          strokeOpacity="0.12"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {PFADE.map((p) => (
        <path
          key={`z-${p.art}`}
          className={`s04-zeichne w24hof-pfad w24hof-pfad-${p.art === "haus" ? "wp" : p.art}`}
          style={d(p.verz, { "--s04-t": "1.3s" })}
          pathLength="1"
          d={p.d}
          fill="none"
          stroke={GRUEN}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {PFADE.map((p) => (
        <path
          key={`f-${p.art}`}
          className="w24hof-fluss"
          pathLength="110"
          d={p.d}
          fill="none"
          stroke="#ffc53d"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      ))}
      {[
        [380, NETZ],
        [690, NETZ],
        [995, NETZ],
      ].map(([x, y], i) => (
        <circle
          key={x}
          className="s04-pop"
          style={d(1450 + i * 120)}
          cx={x}
          cy={y}
          r="6"
          fill="#fff"
          stroke={GRUEN}
          strokeWidth="2.5"
        />
      ))}

      {/* Nummern passend zu den Karten */}
      <Marke x={185} y={340} n="1" art="wp" verz={2300} />
      <Marke x={884} y={334} n="2" art="lader" verz={2420} />
      <Marke x={1152} y={296} n="3" art="eg" verz={2540} />
    </svg>
  );
}

// Beschriftungen in SVG-Koordinaten (Mittelpunkt)
const CHIPS = [
  { l: "Wohnhaus", x: 96, y: 240 },
  { l: "Stalldach", x: 381, y: 232 },
  { l: "Maschinenhalle", x: 690, y: 196 },
  { l: "Agri-PV", x: 996, y: 306 },
  { l: "Hofnetz", x: 560, y: 478 },
];

/**
 * eyebrow, titel, absaetze: [String], punkte: [{ titel, text }] (genau 3: Wärme, Laden, Gemeinschaft),
 * bild: { src, alt }, aktion: { label, href }
 */
export default function W24HofSystem({
  eyebrow,
  titel,
  absaetze = [],
  punkte = [],
  bild,
  aktion,
}) {
  const ziele = ["wp", "lader", "eg"];
  return (
    <div data-blk="hofsystem" className="w24hof">
      <style>{CSS}</style>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <Reveal className="lg:col-span-7">
          {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
          <h2 className="ov-h2 text-ink-900">{titel}</h2>
        </Reveal>
        <Reveal delay={120} className="space-y-4 lg:col-span-5">
          {absaetze.map((a) => (
            <p
              key={a.slice(0, 24)}
              className="max-w-[38rem] text-[16px] leading-relaxed text-ink-600"
            >
              {a}
            </p>
          ))}
        </Reveal>
      </div>

      {/* Bühne */}
      <S04Buehne className="relative mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#fbf6e6] via-sand-50 to-white ring-1 ring-ink-900/[0.06] md:mt-14">
        <div
          className="ov-no-scrollbar overflow-x-auto md:overflow-visible"
          tabIndex={-1}
        >
          <div className="relative min-w-[760px] md:min-w-0">
            <Szene />
            {CHIPS.map((c, i) => (
              <span
                key={c.l}
                aria-hidden="true"
                className="s04-auf absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-ink-700 shadow-[0_4px_14px_-6px_rgba(15,23,42,0.3)] ring-1 ring-ink-900/[0.07] md:block"
                style={d(1600 + i * 110, {
                  left: `${Math.round((c.x / 1200) * 1000) / 10}%`,
                  top: `${Math.round(((c.y - VB_Y) / VB_H) * 1000) / 10}%`,
                })}
              >
                {c.l}
              </span>
            ))}
          </div>
        </div>
        <p
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11.5px] font-semibold text-ink-500 ring-1 ring-ink-900/[0.06] md:hidden"
        >
          Wischen für den ganzen Hof →
        </p>
      </S04Buehne>

      {/* Drei Wege für den Hofstrom + Agri-PV */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:mt-5 md:gap-5 lg:grid-cols-4">
        {punkte.slice(0, 3).map((p, i) => (
          <Reveal key={p.titel} delay={i * 80} className="flex">
            <div
              data-ziel={ziele[i]}
              className="w24hof-karte flex w-full gap-4 rounded-[1.5rem] bg-white p-5 ring-1 ring-ink-900/[0.07]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[2.5px] border-ov-500 font-display text-[14px] font-extrabold text-ink-900">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-[17px] font-bold leading-snug text-ink-900">
                  {p.titel}
                </h3>
                <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">
                  {p.text}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
        {bild && aktion && (
          <Reveal delay={240} className="flex">
            <Link
              href={aktion.href}
              className="group relative flex min-h-[168px] w-full overflow-hidden rounded-[1.5rem] bg-navy-950 outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-4"
            >
              <Image
                src={bild.src}
                alt={bild.alt}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 300px"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent"
              />
              <span className="relative mt-auto flex w-full items-end justify-between gap-3 p-5">
                <span className="font-display text-[17px] font-bold leading-snug text-white">
                  {aktion.label}
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-navy-950 transition-colors group-hover:bg-ov-500 group-hover:text-white"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </div>
  );
}
