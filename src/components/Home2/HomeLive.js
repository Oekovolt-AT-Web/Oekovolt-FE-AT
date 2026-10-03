"use client";

// src/components/Home2/HomeLive.js
//
// Startseiten-Modul „Strommarkt Österreich live“ (nur Startseite, eingebunden in
// src/components/Startseite/S06Strommarkt.js) – Website-Fassung der TV-Folie
// src/components/Kanaele/tv/Folie05Strom.js:
//   links   Börsenstrompreis jetzt (Count-up), Einordnung, Spanne Tagestief → Tageshoch
//   rechts  Preiskurve heute (+ morgen, sobald veröffentlicht) mit günstigsten 3 Stunden,
//           „jetzt“-Lot und Scrubben (Maus, Finger, Pfeiltasten) – der Preis links folgt
//   unten   Erneuerbar-Ring (Anteil an der Netzlast) und Erzeugungsmix je Quelle
//
// Daten: `initial` kommt serverseitig (SEO, kein leerer Zustand, gleiche Höhen wie live → kein CLS),
// danach aktualisiert useLiveDaten alle 5 Minuten. Server-HTML und erster Client-Render rechnen mit
// dem Datenstand `initial.stand` als „jetzt“ (Hydration); erst nach dem Mounten läuft die Uhr.
//
// Choreografie beim ersten Hineinscrollen (Phase „laeuft“, siehe s06-bewegung.js):
//   0–0,4 s   Raster, Achsen, Kopfzeilen
//   0,2–1,7 s Preis zählt hoch; Kurve zeichnet sich mit leuchtendem Kopf; Fläche steigt auf
//   1,35 s    günstigste 3 Stunden werden mit einer Lichtkante aufgedeckt
//   1,7–2,1 s „jetzt“-Lot fällt, Punkt setzt, Radar-Puls; Ring füllt sich, Mix-Balken wachsen
// Reduzierte Bewegung: ruhender Endzustand.

import { useMemo, useRef, useState } from "react";
import useLiveDaten from "@/components/EnergieLive/useLiveDaten";
import { ct, gw, preisTage, uhr, zahl, zeitfenster } from "@/components/EnergieLive/berechnung";
import { S06_FARBEN as F, S06_QUELLEN, erzeugungsMix, rd } from "@/components/Startseite/s06-daten";
import { auftritt, useEintritt, useFortschritt } from "@/components/Startseite/s06-bewegung";
import S06Preiskurve from "@/components/Startseite/s06-preiskurve";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const ZEICHNEN = "cubic-bezier(0.45, 0, 0.2, 1)";

const STIL = `
.s06-wurzel[data-phase="ruhe"] .s06-a { animation: none !important; }
.s06-wurzel[data-phase="wartet"] :is(.s06-a, .s06-amb),
.s06-wurzel[data-sichtbar="nein"] .s06-amb { animation-play-state: paused !important; }
.s06-blende { animation: s06-blende 900ms ease both; }
@keyframes s06-blende { from { opacity: 0; } to { opacity: 1; } }
.s06-hoch { animation: s06-hoch 900ms ${EASE} both; }
@keyframes s06-hoch { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.s06-linie { animation: s06-linie 1500ms ${ZEICHNEN} both; }
@keyframes s06-linie { from { stroke-dasharray: 1 2; stroke-dashoffset: 1; } to { stroke-dasharray: 1 2; stroke-dashoffset: 0; } }
.s06-kopf { opacity: 0; stroke-dasharray: 0.008 3; animation: s06-kopf 1500ms ${ZEICHNEN} both, s06-kopfblende 1500ms linear both; }
.s06-kopf-weit { stroke-dasharray: 0.016 3; animation-name: s06-kopf-weit, s06-kopfblende; }
@keyframes s06-kopf { from { stroke-dashoffset: 0.008; } to { stroke-dashoffset: -0.992; } }
@keyframes s06-kopf-weit { from { stroke-dashoffset: 0.016; } to { stroke-dashoffset: -0.984; } }
@keyframes s06-kopfblende { 0% { opacity: 0; } 6% { opacity: 1; } 84% { opacity: 1; } 100% { opacity: 0; } }
.s06-steigen { transform-box: fill-box; transform-origin: 50% 100%; animation: s06-steigen 1300ms ${EASE} both; }
@keyframes s06-steigen { from { opacity: 0; transform: scaleY(0.04); } to { opacity: 1; transform: none; } }
.s06-band { transform-box: fill-box; transform-origin: 0 50%; animation: s06-band 900ms ${EASE} both; }
@keyframes s06-band { from { transform: scaleX(0); } to { transform: none; } }
.s06-kante { opacity: 0; animation: s06-kante 900ms ${EASE} both; }
@keyframes s06-kante { 0% { opacity: 0; transform: none; } 12% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; transform: translateX(var(--s06-w)); } }
.s06-lot { transform-box: fill-box; transform-origin: 50% 0; animation: s06-lot 750ms ${EASE} both; }
@keyframes s06-lot { from { transform: scaleY(0); } to { transform: none; } }
.s06-punkt { transform-box: fill-box; transform-origin: center; animation: s06-punkt 650ms ${EASE} both; }
@keyframes s06-punkt { from { opacity: 0; transform: scale(0.2); } to { opacity: 1; transform: none; } }
.s06-radar { opacity: 0; transform-box: fill-box; transform-origin: center; animation: s06-radar 3.2s cubic-bezier(0.2, 0.6, 0.35, 1) infinite; }
@keyframes s06-radar { 0% { opacity: 0.7; transform: scale(1); } 100% { opacity: 0; transform: scale(4); } }
.s06-atmen { animation: s06-atmen 2.8s ease-in-out infinite; }
@keyframes s06-atmen { 0%, 100% { opacity: 0.9; transform: scale(1); } 50% { opacity: 0; transform: scale(2.6); } }
.s06-ring { animation: s06-ring 1500ms ${ZEICHNEN} both; }
@keyframes s06-ring { from { stroke-dashoffset: var(--s06-ee); } to { stroke-dashoffset: 0; } }
.s06-segment { transform-origin: 0 50%; animation: s06-segment 900ms ${EASE} both; }
@keyframes s06-segment { from { transform: scaleX(0); } to { transform: none; } }
.s06-sheen { opacity: 0; animation: s06-sheen 1600ms cubic-bezier(0.45, 0, 0.25, 1) both; }
@keyframes s06-sheen { 0% { opacity: 1; transform: translateX(-100%); } 100% { opacity: 1; transform: translateX(560%); } }
.s06-marker { transition: transform 420ms ${EASE}; }
.s06-mix [data-q] { transition: opacity 250ms ease; }
${S06_QUELLEN.map((q) => `.s06-mix:has([data-q="${q.key}"]:hover) [data-q]:not([data-q="${q.key}"]) { opacity: 0.3; }`).join("\n")}
@media (prefers-reduced-motion: reduce) {
  .s06-wurzel [class*="s06-"] { animation: none !important; transition: none !important; }
}
`;

export default function HomeLive({ initial }) {
  const wurzel = useRef(null);
  const { phase, sichtbar } = useEintritt(wurzel);
  const { daten, jetzt } = useLiveDaten(initial);
  const tage = useMemo(() => preisTage(daten.preis, jetzt), [daten.preis, jetzt]);
  const fenster = useMemo(() => (tage.heute ? zeitfenster(tage.heute.punkte, 180, tage.schrittMs).guenstig : null), [tage]);
  const mix = useMemo(() => erzeugungsMix(daten.erzeugung) || initial?.mix || null, [daten.erzeugung, initial?.mix]);
  const [hover, setHover] = useState(null);

  return (
    <div ref={wurzel} data-phase={phase} data-sichtbar={sichtbar ? "ja" : "nein"} className="s06-wurzel">
      <style>{STIL}</style>
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 ring-1 ring-white/10 sm:p-8 lg:p-10">
        {/* Lichtkante oben */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-ov-300/50 to-transparent" />
        <div className="grid gap-9 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-14">
          <PreisJetzt phase={phase} tage={tage} hover={hover} fenster={fenster} />
          <div className="min-w-0">
            <div {...auftritt("s06-blende", 0, "mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2")}>
              <p className="text-[14px] font-semibold text-white/80">
                Börsenstrompreis im Tagesverlauf <span className="block font-normal text-white/45 sm:inline"><span className="hidden sm:inline">· </span>ct/kWh netto</span>
              </p>
              <ul className="flex items-center gap-4 text-[12.5px] text-white/55">
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-white" /> heute
                </li>
                {tage.morgen && (
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-navy-300" /> morgen
                  </li>
                )}
                {fenster && (
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-2.5 w-3 rounded-[3px] border-t-2 border-ov-400 bg-ov-400/25" /> günstigste 3 h
                  </li>
                )}
              </ul>
            </div>
            <S06Preiskurve tage={tage} fenster={fenster} jetzt={jetzt} hover={hover} setHover={setHover} />
            <p className="mt-3 hidden text-[12.5px] text-white/40 sm:block">Tipp: Mit der Maus über die Kurve fahren – der Preis links folgt.</p>
          </div>
        </div>

        <div className="mt-9 border-t border-white/10 pt-8 lg:mt-10 lg:pt-10">
          <ErzeugungMix phase={phase} mix={mix} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Preis jetzt                                                          */
/* ------------------------------------------------------------------ */

function PreisJetzt({ phase, tage, hover, fenster }) {
  const p = useFortschritt(phase, 250, 1500);
  const { aktuell, heute, morgen, schrittMs } = tage;
  const slot = hover || aktuell;
  const istMorgen = Boolean(slot && morgen && slot.t >= morgen.start);
  const tag = istMorgen ? morgen : heute;
  const lage = slot && tag && tag.max.eurMwh > tag.min.eurMwh ? (slot.eurMwh - tag.min.eurMwh) / (tag.max.eurMwh - tag.min.eurMwh) : null;
  const einordnung = lage == null ? null : lage < 0.33 ? "eher günstig" : lage > 0.66 ? "eher teuer" : "im Mittelfeld";
  const farbe = lage == null ? "#fff" : lage < 0.33 ? F.gruenHell : lage > 0.66 ? F.sonne : "#fff";
  const wert = slot ? (hover ? slot.eurMwh : slot.eurMwh * p) : null;

  return (
    <div className="flex min-w-0 flex-col">
      <p {...auftritt("s06-hoch", 0, "flex items-center gap-2.5 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300")}>
        <span aria-hidden="true" className="relative flex h-2 w-2">
          <span className="s06-amb s06-atmen absolute inset-0 rounded-full bg-ov-400" />
          <span className="relative h-2 w-2 rounded-full bg-ov-400" />
        </span>
        {hover ? (istMorgen ? "Börsenstrompreis morgen" : "Börsenstrompreis heute") : "Börsenstrompreis jetzt"}
      </p>
      <p className="mt-4 whitespace-nowrap font-display leading-none text-white">
        <span className="ov-num text-[clamp(3.4rem,2.9rem+2.2vw,4.6rem)] font-extrabold tracking-[-0.045em]">{wert == null ? "–" : ct(wert)}</span>
        <span {...auftritt("s06-blende", 700, "ml-2 text-[18px] font-bold tracking-tight text-white/55")}>ct/kWh</span>
      </p>
      <p {...auftritt("s06-hoch", 600, "mt-4 min-h-[3.2em] text-[14.5px] leading-[1.6] text-white/60")}>
        {slot ? (
          <>
            Day-Ahead, netto, <span className="ov-num">{uhr(slot.t)}</span> bis <span className="ov-num">{uhr(slot.t + schrittMs)}</span> Uhr.
            {einordnung && (
              <>
                {" "}Für {istMorgen ? "morgen" : "heute"}{" "}
                <strong className="font-semibold" style={{ color: farbe }}>
                  {einordnung}
                </strong>
                .
              </>
            )}
          </>
        ) : (
          "Day-Ahead-Preis der Gebotszone Österreich, netto."
        )}
      </p>

      {fenster && (
        <div {...auftritt("s06-hoch", 1750, "relative mt-6 overflow-hidden rounded-2xl bg-ov-400/[0.08] px-4 py-3.5 ring-1 ring-ov-300/20")}>
          <span aria-hidden="true" className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-ov-400" />
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Günstigste 3 Stunden heute</p>
          <p className="mt-1 font-display text-[20px] font-extrabold leading-tight tracking-tight text-white">
            <span className="ov-num">{uhr(fenster.start)}–{uhr(fenster.ende)}</span> Uhr
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-white/55">
            Ø <span className="ov-num">{ct(fenster.avg)}</span> ct/kWh – ideal für Speicher, E-Flotte und flexible Lasten.
          </p>
        </div>
      )}

      {tag && (
        <div className="mt-auto pt-7">
          <p {...auftritt("s06-blende", 900, "mb-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-white/40")}>Spanne {istMorgen ? "morgen" : "heute"}</p>
          {/* Spanne Tagestief → Tageshoch mit Position des Preises */}
          <div className="relative h-4">
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
              <div {...auftritt("s06-segment", 900, "h-full w-full rounded-full", { background: `linear-gradient(90deg, ${F.gruen} 0%, rgba(255,255,255,0.55) 55%, ${F.sonne} 100%)` })} />
            </div>
            {lage != null && (
              <div className="s06-marker absolute inset-0" style={{ transform: `translateX(${(lage * 100).toFixed(2)}%)` }}>
                <span
                  {...auftritt("s06-punkt", 1300, "absolute left-0 top-1/2 -ml-2 -mt-2 block h-4 w-4 rounded-full border-[3px] bg-navy-950 shadow-[0_0_0_4px_rgba(3,18,43,0.6)]", { borderColor: farbe })}
                />
              </div>
            )}
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            {[
              { l: "Tief", p: tag.min, a: "text-left" },
              { l: "Mittel", w: tag.avg, a: "text-center" },
              { l: "Hoch", p: tag.max, a: "text-right" },
            ].map((s, i) => (
              <div key={s.l} {...auftritt("s06-hoch", 1100 + i * 110, s.a)}>
                <dt className="text-[12.5px] text-white/45">{s.l}</dt>
                <dd className="mt-0.5 font-display text-[19px] font-extrabold leading-tight tracking-tight text-white">
                  <span className="ov-num">{ct(s.p ? s.p.eurMwh : s.w)}</span> <span className="text-[12px] font-bold text-white/45">ct</span>
                </dd>
                <dd className="ov-num text-[12px] text-white/40">{s.p ? `${uhr(s.p.t)} Uhr` : "Tagesschnitt"}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Erneuerbar-Ring und Erzeugungsmix                                    */
/* ------------------------------------------------------------------ */

function Ring({ phase, ee }) {
  const p = useFortschritt(phase, 1200, 1500);
  const c = 110;
  const r = 88;
  const wert = ee == null ? null : Math.max(0, Math.min(100, ee));
  const endA = wert == null ? 0 : (wert / 100) * Math.PI * 2 - Math.PI / 2;
  const ticks = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2 - Math.PI / 2;
    const gross = i % 10 === 0;
    const r1 = 102;
    const r2 = gross ? 110 : 106.5;
    return { i, gross, x1: rd(c + Math.cos(a) * r1), y1: rd(c + Math.sin(a) * r1), x2: rd(c + Math.cos(a) * r2), y2: rd(c + Math.sin(a) * r2) };
  });
  return (
    <svg viewBox="-2 -2 224 224" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="s06-ring-verlauf" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor={F.gruenTief} />
          <stop offset="1" stopColor={F.gruenHell} />
        </linearGradient>
      </defs>
      <g {...auftritt("s06-blende", 1000)}>
        {ticks.map((t) => (
          <line key={t.i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.gross ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.16)"} strokeWidth={t.gross ? 2.5 : 1.5} strokeLinecap="round" />
        ))}
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
      </g>
      {wert != null && (
        <>
          <circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="url(#s06-ring-verlauf)"
            strokeWidth="14"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray={`${wert} 200`}
            transform={`rotate(-90 ${c} ${c})`}
            {...auftritt("s06-ring", 1200, "", { "--s06-ee": wert })}
          />
          <g {...auftritt("s06-punkt", 2600)}>
            <circle cx={rd(c + Math.cos(endA) * r)} cy={rd(c + Math.sin(endA) * r)} r="12" fill={F.gruenHell} fillOpacity="0.28" />
            <circle cx={rd(c + Math.cos(endA) * r)} cy={rd(c + Math.sin(endA) * r)} r="5" fill="#fff" />
          </g>
        </>
      )}
      <text x={c} y={c + 16} textAnchor="middle" fill="#fff" fontWeight="800" style={{ fontFamily: "var(--font-display)" }}>
        <tspan fontSize="60" letterSpacing="-2.5" fillOpacity={ee == null ? 0.3 : 1}>
          {ee == null ? "–" : Math.round(ee * p)}
        </tspan>
        {ee != null && (
          <tspan fontSize="30" dx="3" fill="rgba(255,255,255,0.6)">
            %
          </tspan>
        )}
      </text>
    </svg>
  );
}

function ErzeugungMix({ phase, mix }) {
  const p = useFortschritt(phase, 1300, 1500);
  if (!mix) {
    return <p className="text-[14px] text-white/55">Die Erzeugungsdaten werden gerade aktualisiert.</p>;
  }
  const { quellen, summe, lastMw, importMw, eeAnteil, zeitpunkt } = mix;
  const export_ = importMw != null && importMw < 0;
  let n = 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-14">
      <div className="flex items-center gap-5">
        <div className="h-[104px] w-[104px] shrink-0 sm:h-[120px] sm:w-[120px]">
          <Ring phase={phase} ee={eeAnteil} />
        </div>
        <div {...auftritt("s06-hoch", 1300)}>
          <p className="font-display text-[17px] font-bold leading-snug text-white">Erneuerbarer Anteil an der Netzlast</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
            Österreich<span className="block">Stand <span className="ov-num">{uhr(zeitpunkt)}</span> Uhr</span>
          </p>
        </div>
      </div>

      <div className="s06-mix min-w-0">
        <div {...auftritt("s06-blende", 1100, "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1")}>
          <p className="text-[14px] font-semibold text-white/80">Stromerzeugung in Österreich</p>
          <p className="text-[13px] text-white/50">
            Netzlast <strong className="ov-num font-display font-extrabold text-white">{gw(lastMw)} GW</strong>
            {importMw != null && (
              <>
                {" "}· {export_ ? "Nettoexport" : "Nettoimport"} <strong className="ov-num font-display font-extrabold text-white">{gw(Math.abs(importMw))} GW</strong>
              </>
            )}
          </p>
        </div>
        <div className="relative mt-3.5 flex h-11 gap-[3px] overflow-hidden rounded-xl bg-white/[0.05]">
          {quellen.map((q) => {
            if (!(q.mw > 0)) return null;
            const anteil = (q.mw / summe) * 100;
            const k = n++;
            return (
              <div key={q.key} data-q={q.key} className="relative h-full min-w-0 overflow-hidden" style={{ flex: `${q.mw} 1 0` }}>
                <div {...auftritt("s06-segment", 1400 + k * 110, "flex h-full w-full items-center pl-2.5", { background: q.farbe })}>
                  {anteil >= 8 && (
                    <span className={`ov-num whitespace-nowrap font-display text-[13.5px] font-extrabold ${anteil < 15 ? "hidden sm:inline" : ""}`} style={{ color: q.text }}>
                      {Math.round(anteil * p)} %
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div {...auftritt("s06-sheen", 2300, "absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-white/30 to-transparent")} />
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-3.5 sm:grid-cols-6">
          {quellen.map((q, i) => (
            <div key={q.key} data-q={q.key} {...auftritt("s06-hoch", 1500 + i * 80, "min-w-0 cursor-default")}>
              <dt className="flex items-center gap-1.5 truncate text-[12.5px] text-white/55">
                <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: q.farbe }} />
                {q.name}
              </dt>
              <dd className="mt-0.5 font-display text-[18px] font-extrabold leading-tight tracking-tight text-white">
                <span className="ov-num">{zahl((q.mw * p) / 1000, 1)}</span> <span className="text-[11.5px] font-bold text-white/45">GW</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
