"use client";

// src/components/Kontakt/Wochenzeiten.js
//
// Öffnungszeiten als Wochenband (Mo–So, 6–20 Uhr) mit Live-Markierung
// „jetzt“ am heutigen Tag (Zeitzone Europe/Vienna). Server-HTML zeigt die
// Zeiten ohne Markierung – der Browser ergänzt Status und Uhrzeit.
// Quelle: OEFFNUNGSZEITEN / oeffnungsStatus aus @/data/erreichbarkeit.

import { useEffect, useState } from "react";
import { OEFFNUNGSZEITEN, WOCHENTAGE_KURZ, berlin, hhmm, oeffnungsStatus } from "@/data/erreichbarkeit";

const START = 6 * 60;
const ENDE = 20 * 60;
const pos = (min) => `${Math.min(100, Math.max(0, ((min - START) / (ENDE - START)) * 100))}%`;

const fensterFuer = (tag) => OEFFNUNGSZEITEN.find((o) => o.tage.includes(tag) && o.von != null) || null;

export default function Wochenzeiten({ dunkel = false }) {
  const [jetzt, setJetzt] = useState(null);

  useEffect(() => {
    const tick = () => setJetzt({ b: berlin(), s: oeffnungsStatus() });
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  const heute = jetzt?.b.wochentag;
  const t = dunkel ? { text: "text-white", sub: "text-white/55", bahn: "bg-white/[0.07]", raster: "border-white/10" } : { text: "text-ink-900", sub: "text-ink-500", bahn: "bg-ink-100", raster: "border-ink-200" };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`inline-flex items-center gap-2.5 font-display text-[18px] font-bold ${t.text}`} aria-live="polite">
          <span className="relative flex h-3 w-3" aria-hidden="true">
            {jetzt?.s.offen && <span className="absolute inset-0 animate-ping rounded-full bg-ov-400 opacity-60 motion-reduce:hidden" />}
            <span className={`relative h-3 w-3 rounded-full ${jetzt == null ? "bg-ink-300" : jetzt.s.offen ? "bg-ov-500" : "bg-sun-500"}`} />
          </span>
          {jetzt ? jetzt.s.titel : "Öffnungszeiten"}
          {jetzt?.s.detail && <span className={`text-[14px] font-medium ${t.sub}`}>· {jetzt.s.detail}</span>}
        </p>
        {jetzt && <p className={`ov-num text-[13px] ${t.sub}`}>Ostermiething, {hhmm(jetzt.b.minuten)} Uhr</p>}
      </div>

      <div className="mt-5">
        <div className={`ml-10 flex justify-between text-[11px] ${t.sub}`} aria-hidden="true">
          {[6, 9, 12, 15, 18].map((h) => (
            <span key={h} className="ov-num">{h}</span>
          ))}
          <span className="ov-num">20</span>
        </div>
        <ul className="mt-1.5 space-y-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((tag) => {
            const f = fensterFuer(tag);
            const istHeute = tag === heute;
            return (
              <li key={tag} className="flex items-center gap-3">
                <span className={`w-7 text-[13px] font-semibold ${istHeute ? (dunkel ? "text-ov-300" : "text-ov-700") : t.sub}`}>{WOCHENTAGE_KURZ[tag]}</span>
                <span className={`relative h-6 flex-1 overflow-hidden rounded-full ${t.bahn} ${istHeute ? (dunkel ? "ring-1 ring-ov-400/60" : "ring-1 ring-ov-300") : ""}`}>
                  {f ? (
                    <span
                      className={`absolute inset-y-0 flex items-center justify-center rounded-full text-[11px] font-semibold ${istHeute && jetzt?.s.offen ? "bg-ov-500 text-white" : dunkel ? "bg-ov-500/60 text-white" : "bg-ov-200 text-ov-800"}`}
                      style={{ left: pos(f.von), width: `calc(${pos(f.bis)} - ${pos(f.von)})` }}
                    >
                      <span className="ov-num hidden sm:inline">
                        {hhmm(f.von)}–{hhmm(f.bis)}
                      </span>
                    </span>
                  ) : (
                    <span className={`absolute inset-0 flex items-center pl-3 text-[11px] ${t.sub}`}>geschlossen</span>
                  )}
                  {istHeute && jetzt && jetzt.b.minuten >= START && jetzt.b.minuten <= ENDE && (
                    <span aria-hidden="true" className="absolute inset-y-0 w-0.5 bg-navy-950" style={{ left: pos(jetzt.b.minuten) }}>
                      <span className="absolute -left-[3px] -top-0.5 h-2 w-2 rounded-full bg-navy-950" />
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        <ul className="sr-only">
          {OEFFNUNGSZEITEN.map((o) => (
            <li key={o.label}>
              {o.label}: {o.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
