"use client";

// src/components/Award/AwardKriterien.js
//
// Bewertungskriterien des PV Award als Gewichtungsband (100 %) plus Karten.
// Hover/Fokus auf eine Karte hebt das Segment hervor; das Band füllt sich
// beim ersten Sichtkontakt. Daten: KRITERIEN aus ./awardDaten.

import { useEffect, useRef, useState } from "react";
import { KRITERIEN } from "./awardDaten";

const FARBEN = [
  { band: "bg-sun-400", punkt: "bg-sun-400", text: "text-sun-500" },
  { band: "bg-ov-500", punkt: "bg-ov-500", text: "text-ov-600" },
  { band: "bg-navy-500", punkt: "bg-navy-500", text: "text-navy-500" },
  { band: "bg-ov-300", punkt: "bg-ov-300", text: "text-ov-700" },
  { band: "bg-sun-300", punkt: "bg-sun-300", text: "text-sun-500" },
  { band: "bg-navy-300", punkt: "bg-navy-300", text: "text-navy-500" },
];

export default function AwardKriterien() {
  const ref = useRef(null);
  const [sichtbar, setSichtbar] = useState(false);
  const [fokus, setFokus] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSichtbar(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSichtbar(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const summe = KRITERIEN.reduce((s, k) => s + k.gewicht, 0);

  return (
    <div ref={ref}>
      <div className="rounded-[2rem] bg-navy-950 p-5 shadow-[0_30px_70px_-40px_rgba(3,18,43,0.7)] md:p-7">
        <div className="flex items-center justify-between gap-4 text-white">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-sun-300">Gewichtung</p>
          <p className="ov-num font-display text-[15px] font-bold text-white/70">Summe {summe} %</p>
        </div>
        <div className="mt-4 flex h-14 gap-1 overflow-hidden rounded-2xl bg-white/5" role="img" aria-label={`Gewichtung: ${KRITERIEN.map((k) => `${k.titel} ${k.gewicht} %`).join(", ")}`}>
          {KRITERIEN.map((k, i) => (
            <div
              key={k.titel}
              onMouseEnter={() => setFokus(i)}
              onMouseLeave={() => setFokus(null)}
              className={`flex items-center justify-center overflow-hidden rounded-xl ${FARBEN[i].band} transition-[width,opacity] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
              style={{ width: sichtbar ? `${k.gewicht}%` : "0%", transitionDelay: `${i * 110}ms, 0ms`, opacity: fokus == null || fokus === i ? 1 : 0.3 }}
            >
              <span className={`ov-num whitespace-nowrap font-display text-[14px] font-extrabold text-navy-950 ${k.gewicht < 15 ? "hidden sm:inline" : ""}`}>{k.gewicht} %</span>
            </div>
          ))}
        </div>
      </div>

      <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {KRITERIEN.map((k, i) => (
          <li key={k.titel}>
            <button
              type="button"
              onMouseEnter={() => setFokus(i)}
              onMouseLeave={() => setFokus(null)}
              onFocus={() => setFokus(i)}
              onBlur={() => setFokus(null)}
              className={`flex h-full w-full flex-col rounded-3xl bg-white p-5 text-left ring-1 transition-all duration-300 md:p-6 ${
                fokus === i ? "-translate-y-1 shadow-xl ring-sun-300" : "ring-ink-200/70"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className={`h-3 w-3 rounded-full ${FARBEN[i].punkt}`} aria-hidden="true" />
                <span className={`ov-num font-display text-[26px] font-extrabold leading-none ${FARBEN[i].text}`}>{k.gewicht} %</span>
              </span>
              <span className="mt-4 block font-display text-[17px] font-bold leading-snug text-ink-900">{k.titel}</span>
              <span className="mt-2 block text-[14.5px] leading-relaxed text-ink-600">{k.text}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
