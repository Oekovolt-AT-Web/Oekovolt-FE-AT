"use client";

// src/components/Team/RollenPfad.js
//
// „Wer an Ihrer Anlage arbeitet“ als interaktiver Projektpfad: links die
// Rollen in Projektreihenfolge, rechts Foto und Beschreibung der gewählten
// Rolle. Alle Texte stehen im DOM (inaktive Panels nur ausgeblendet).
// rollen: [{ titel, text, phase, bild: { src, alt, pos } }] – Icons per Index.

import { useState } from "react";
import Image from "next/image";
import { Calculator, ClipboardList, HardHat, Headset, MonitorDot, PlugZap } from "lucide-react";

const ICONS = [Headset, ClipboardList, Calculator, PlugZap, MonitorDot, HardHat];

export default function RollenPfad({ rollen = [] }) {
  const [aktiv, setAktiv] = useState(0);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
      <ol className="relative space-y-2" aria-label="Rollen im Projektablauf">
        <span aria-hidden="true" className="absolute bottom-7 left-[27px] top-7 w-px bg-ink-200">
          <span
            className="absolute left-0 top-0 w-px bg-ov-500 transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ height: `${(aktiv / Math.max(1, rollen.length - 1)) * 100}%` }}
          />
        </span>
        {rollen.map((r, i) => {
          const Icon = ICONS[i % ICONS.length];
          const an = i === aktiv;
          return (
            <li key={r.titel} className="relative">
              <button
                type="button"
                onClick={() => setAktiv(i)}
                onMouseEnter={() => setAktiv(i)}
                aria-pressed={an}
                className={`group flex w-full items-center gap-4 rounded-2xl p-2 pr-4 text-left transition-colors ${an ? "bg-white shadow-lg ring-1 ring-ink-200/70" : "hover:bg-white/70"}`}
              >
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    an ? "bg-ov-500 text-white" : i < aktiv ? "bg-ov-100 text-ov-700" : "bg-white text-ink-500 ring-1 ring-ink-200"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">{r.phase}</span>
                  <span className={`block font-display text-[16.5px] font-bold leading-snug ${an ? "text-ink-900" : "text-ink-700"}`}>{r.titel}</span>
                </span>
                <span className={`ov-num font-display text-[22px] font-extrabold ${an ? "text-ov-600" : "text-ink-200"}`}>{String(i + 1).padStart(2, "0")}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-navy-950 shadow-[0_30px_70px_-40px_rgba(3,18,43,0.7)]">
        {rollen.map((r, i) => (
          <div
            key={r.titel}
            aria-hidden={i !== aktiv}
            className={`absolute inset-0 flex flex-col transition-opacity duration-500 motion-reduce:transition-none ${i === aktiv ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Image
              src={r.bild.src}
              alt={r.bild.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${i === aktiv ? "scale-100" : "scale-105"}`}
              style={r.bild.pos ? { objectPosition: r.bild.pos } : undefined}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
            <div className="relative mt-auto p-7 md:p-9">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">
                Schritt {i + 1} · {r.phase}
              </p>
              <h3 className="mt-2 font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-tight text-white">{r.titel}</h3>
              <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-white/80">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
