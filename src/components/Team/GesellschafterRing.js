"use client";

// src/components/Team/GesellschafterRing.js
//
// Ring-Diagramm der Gesellschafterstruktur der Ökovolt Solartechnik GmbH
// (Werte aus FIRMA.gesellschafter in @/lib/site). Die Segmente zeichnen sich
// beim ersten Sichtkontakt ein; Hover/Fokus auf Legende oder Segment hebt
// einen Gesellschafter hervor und zeigt seinen Anteil in der Mitte.

import { useEffect, useRef, useState } from "react";
import { FIRMA } from "@/lib/site";

const R = 88;
const U = 2 * Math.PI * R;
const LUECKE = 32; // Abstand zwischen den Segmenten inkl. runder Enden (Umfangseinheiten)

const FARBEN = [
  { strich: "var(--color-ov-500)", punkt: "bg-ov-500", ring: "ring-ov-200", text: "text-ov-700" },
  { strich: "var(--color-navy-500)", punkt: "bg-navy-500", ring: "ring-navy-200", text: "text-navy-600" },
];

const prozent = (s) => Number(String(s).replace(/[^\d,.]/g, "").replace(",", ".")) || 0;
const kurzname = (n) => n.replace(" für Energie, Verkehr und Telekommunikation", "");

export default function GesellschafterRing({ zusatz = {} }) {
  const ref = useRef(null);
  const [sichtbar, setSichtbar] = useState(false);
  const [fokus, setFokus] = useState(null);

  const teile = FIRMA.gesellschafter.map((g, i) => ({ ...g, wert: prozent(g.anteil), farbe: FARBEN[i % FARBEN.length], kurz: kurzname(g.name) }));

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
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let versatz = 0;
  const segmente = teile.map((t, i) => {
    const laenge = (t.wert / 100) * U - LUECKE;
    const s = { ...t, i, laenge, start: versatz };
    versatz += (t.wert / 100) * U;
    return s;
  });

  const aktiv = fokus == null ? null : teile[fokus];

  return (
    <div ref={ref} className="grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-8">
      <div className="relative mx-auto aspect-square w-full max-w-[300px]">
        <div aria-hidden="true" className="absolute inset-[14%] rounded-full bg-ov-200/40 blur-3xl" />
        <svg viewBox="0 0 220 220" className="relative h-full w-full -rotate-90" role="img" aria-label={`Gesellschafter der ${FIRMA.name}: ${teile.map((t) => `${t.name} ${t.anteil}`).join(", ")}`}>
          <circle cx="110" cy="110" r={R} fill="none" strokeWidth="22" className="stroke-ink-100" />
          {segmente.map((s) => (
            <circle
              key={s.name}
              cx="110"
              cy="110"
              r={R}
              fill="none"
              strokeWidth={fokus === s.i ? 26 : 22}
              strokeLinecap="round"
              onMouseEnter={() => setFokus(s.i)}
              onMouseLeave={() => setFokus(null)}
              style={{
                stroke: s.farbe.strich,
                strokeDasharray: `${sichtbar ? s.laenge : 0} ${U}`,
                strokeDashoffset: -s.start - LUECKE / 2,
                opacity: !sichtbar ? 0 : fokus == null || fokus === s.i ? 1 : 0.35,
                transition: `stroke-dasharray 1400ms cubic-bezier(0.22,1,0.36,1) ${s.i * 250}ms, opacity 300ms, stroke-width 300ms`,
                cursor: "pointer",
              }}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-[22%] text-center">
          <p className="ov-num whitespace-nowrap font-display text-[clamp(1.9rem,1.4rem+1.6vw,2.6rem)] font-extrabold leading-none tracking-tight text-ink-900">
            {aktiv ? aktiv.anteil : "100 %"}
          </p>
          <p className="mt-2 text-[12.5px] font-medium leading-snug text-ink-500">{aktiv ? aktiv.kurz : "Geschäftsanteile"}</p>
        </div>
      </div>

      <ul className="space-y-3">
        {teile.map((t, i) => (
          <li key={t.name}>
            <button
              type="button"
              onMouseEnter={() => setFokus(i)}
              onMouseLeave={() => setFokus(null)}
              onFocus={() => setFokus(i)}
              onBlur={() => setFokus(null)}
              className={`flex w-full items-start gap-4 rounded-3xl bg-white p-5 text-left ring-1 transition-all duration-300 ${
                fokus === i ? `shadow-lg ${t.farbe.ring}` : "ring-ink-200/70"
              }`}
            >
              <span aria-hidden="true" className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ${t.farbe.punkt}`} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="font-display text-[17px] font-bold text-ink-900">{t.kurz}</span>
                  <span className={`ov-num font-display text-[24px] font-extrabold ${t.farbe.text}`}>{t.anteil}</span>
                </span>
                {zusatz[i] && <span className="mt-1 block text-[14.5px] leading-snug text-ink-600">{zusatz[i]}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
