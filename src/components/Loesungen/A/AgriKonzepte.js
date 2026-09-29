"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpFromLine, Columns3, Rotate3d } from "lucide-react";
import { cn } from "@/components/ui/cn";

const ICONS = { vertikal: Columns3, hoch: ArrowUpFromLine, tracker: Rotate3d };

/**
 * Konzept-Umschalter Agri-PV: vertikal bifazial / hoch aufgeständert / nachgeführt.
 * konzepte: [{ id: "vertikal"|"hoch"|"tracker", label, kurz, bild: {src, alt}, werte: [{ label, wert }], hinweis, profil }]
 * Die Illustration ist schematisch (nicht maßstäblich).
 */
export default function AgriKonzepte({ konzepte = [], link, className }) {
  const [aktivId, setAktivId] = useState(konzepte[0]?.id);
  const k = konzepte.find((x) => x.id === aktivId) || konzepte[0];

  return (
    <div className={cn("overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70", className)}>
      <style>{`
        @keyframes la-tracker { 0%,100% { transform: rotate(-28deg); } 50% { transform: rotate(28deg); } }
        @keyframes la-sonne { 0%,100% { transform: translateX(-150px); } 50% { transform: translateX(150px); } }
        @media (prefers-reduced-motion: no-preference) {
          .la-tracker { animation: la-tracker 9s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
          .la-sonne { animation: la-sonne 9s ease-in-out infinite; }
        }
      `}</style>
      <div role="group" aria-label="Agri-PV-Konzept wählen" className="grid grid-cols-3 border-b border-ink-100">
        {konzepte.map((x) => {
          const Icon = ICONS[x.id];
          const an = x.id === k.id;
          return (
            <button
              key={x.id}
              type="button"
              aria-pressed={an}
              onClick={() => setAktivId(x.id)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 px-2 py-4 text-center transition-colors duration-300 md:flex-row md:justify-center md:gap-3 md:py-6",
                an ? "bg-white text-ink-900" : "bg-sand-50 text-ink-500 hover:bg-white hover:text-ink-800"
              )}
            >
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-colors", an ? "bg-ov-500 text-white shadow-lg shadow-ov-900/20" : "bg-white text-ov-600 ring-1 ring-ink-200")}>
                {Icon && <Icon aria-hidden="true" className="h-5 w-5" />}
              </span>
              <span className="font-display text-[14px] font-bold leading-tight md:text-[17px]">{x.label}</span>
              <span aria-hidden="true" className={cn("absolute inset-x-6 bottom-0 h-[3px] rounded-full bg-ov-500 transition-transform duration-500", an ? "scale-x-100" : "scale-x-0")} />
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="relative min-w-0 bg-gradient-to-b from-navy-50 via-white to-ov-50/60 p-4 md:p-8">
          <svg viewBox="0 0 600 320" className="h-auto w-full" role="img" aria-label={`Schematische Darstellung: ${k.label} – ${k.kurz}`}>
            <defs>
              <linearGradient id="agri-modul" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#4a7cbd" />
                <stop offset="1" stopColor="#03285a" />
              </linearGradient>
              <linearGradient id="agri-boden" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8cba58" />
                <stop offset="1" stopColor="#436621" />
              </linearGradient>
            </defs>
            {/* Sonne */}
            <g className="la-sonne">
              <circle cx="300" cy="46" r="20" fill="#ffc53d" />
              <circle cx="300" cy="46" r="34" fill="#ffd873" opacity="0.25" />
            </g>
            {/* Boden */}
            <rect x="0" y="262" width="600" height="58" fill="url(#agri-boden)" />
            <rect x="0" y="262" width="600" height="4" fill="#aed083" />

            {/* Vertikal bifazial */}
            <g style={{ opacity: k.id === "vertikal" ? 1 : 0, transition: "opacity 500ms" }}>
              {[70, 230, 390, 550].map((x) => (
                <g key={x}>
                  <rect x={x - 4} y="170" width="8" height="92" rx="2" fill="url(#agri-modul)" />
                  <rect x={x - 1} y="160" width="2" height="104" fill="#394050" />
                </g>
              ))}
              {[110, 140, 170, 200, 270, 300, 330, 360, 430, 460, 490, 520].map((x) => (
                <path key={x} d={`M${x},262 q-6,-26 0,-40 q6,14 0,40`} fill="#558227" />
              ))}
              <g stroke="#03122b" strokeWidth="1.5" fill="none">
                <path d="M78,290 L222,290" markerEnd="" />
                <path d="M78,284 v12 M222,284 v12" />
              </g>
              <text x="150" y="310" textAnchor="middle" className="fill-white text-[17px] font-semibold">Gasse z. B. 10 m</text>
              <text x="70" y="150" textAnchor="middle" className="fill-ink-600 text-[15px]">Ost ◂ ▸ West</text>
            </g>

            {/* Hoch aufgeständert */}
            <g style={{ opacity: k.id === "hoch" ? 1 : 0, transition: "opacity 500ms" }}>
              {[110, 300, 490].map((x) => (
                <g key={x}>
                  <rect x={x - 3} y="118" width="6" height="144" fill="#394050" />
                  <g transform={`rotate(-10 ${x} 112)`}>
                    <rect x={x - 80} y="104" width="160" height="12" rx="2" fill="url(#agri-modul)" />
                  </g>
                  {[-45, 45].map((d) => (
                    <g key={d}>
                      <rect x={x + d - 2} y="205" width="4" height="57" fill="#6b4f2a" />
                      <circle cx={x + d} cy="198" r="22" fill="#669933" />
                      <circle cx={x + d - 8} cy="192" r="4" fill="#e74c3c" />
                      <circle cx={x + d + 9} cy="203" r="4" fill="#e74c3c" />
                    </g>
                  ))}
                </g>
              ))}
              <g stroke="#03122b" strokeWidth="1.5" fill="none">
                <path d="M205,262 V122 M199,262 h12 M199,122 h12" />
              </g>
              <text x="215" y="196" className="fill-ink-800 text-[17px] font-semibold">≥ 2 m</text>
            </g>

            {/* Nachgeführt */}
            <g style={{ opacity: k.id === "tracker" ? 1 : 0, transition: "opacity 500ms" }}>
              {[100, 300, 500].map((x) => (
                <g key={x}>
                  <rect x={x - 3} y="170" width="6" height="92" fill="#394050" />
                  <rect className="la-tracker" x={x - 70} y="163" width="140" height="10" rx="2" fill="url(#agri-modul)" />
                  <circle cx={x} cy="168" r="5" fill="#252b37" />
                </g>
              ))}
              {[30, 55, 150, 175, 200, 230, 255, 350, 375, 400, 430, 455, 550, 575].map((x) => (
                <path key={x} d={`M${x},262 q-5,-20 0,-30 q5,10 0,30`} fill="#558227" />
              ))}
              <text x="300" y="300" textAnchor="middle" className="fill-white text-[17px] font-semibold">einachsig nachgeführt</text>
            </g>
          </svg>

          {/* Tagesprofil (schematisch) */}
          <div className="mt-2 flex items-center gap-4 rounded-2xl bg-white/80 p-3 ring-1 ring-ink-200/70 backdrop-blur md:p-4">
            <svg viewBox="0 0 120 40" className="h-10 w-28 shrink-0" aria-hidden="true">
              <line x1="0" y1="38" x2="120" y2="38" stroke="#dfe3ea" />
              <path d={PROFILE[k.id]} fill="rgba(255,197,61,0.35)" stroke="#f5a70f" strokeWidth="2" style={{ transition: "d 500ms" }} />
            </svg>
            <p className="text-[13px] leading-snug text-ink-600">
              <span className="font-semibold text-ink-900">Tagesprofil (schematisch):</span> {k.profil}
            </p>
          </div>
          {k.bild?.src && (
            <div key={k.bild.src} className="ov-tab-panel relative mt-4 hidden aspect-[16/4.5] overflow-hidden rounded-2xl ring-1 ring-ink-200/70 sm:block">
              <Image src={k.bild.src} alt={k.bild.alt || ""} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" style={k.bild.position ? { objectPosition: k.bild.position } : undefined} />
              <span className="absolute bottom-3 left-3 rounded-full bg-navy-950/70 px-3 py-1 text-[11.5px] font-semibold text-white backdrop-blur">Beispielanlage</span>
            </div>
          )}
        </div>

        <div key={k.id} className="ov-tab-panel flex flex-col border-t border-ink-100 p-5 md:p-8 lg:border-l lg:border-t-0">
          <p className="font-display text-[22px] font-bold leading-tight text-ink-900">{k.label}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{k.kurz}</p>
          <dl className="mt-5 divide-y divide-ink-100 rounded-2xl bg-sand-50 px-4 ring-1 ring-ink-200/60">
            {k.werte.map((w) => (
              <div key={w.label} className="grid grid-cols-[110px_1fr] gap-3 py-3 text-[14px] leading-snug md:grid-cols-[130px_1fr]">
                <dt className="font-semibold text-ink-500">{w.label}</dt>
                <dd className="text-ink-800">{w.wert}</dd>
              </div>
            ))}
          </dl>
          {k.hinweis && <p className="mt-4 text-[13px] leading-relaxed text-ink-500">{k.hinweis}</p>}
          {link && (
            <Link href={link.href} className="group mt-auto inline-flex items-center gap-2 pt-5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
              {link.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// Schematische Tagesverläufe (x: 0–120 = 5–21 Uhr)
const PROFILE = {
  vertikal: "M0,38 C10,38 16,12 28,10 C40,8 48,30 60,30 C72,30 80,8 92,10 C104,12 110,38 120,38 Z",
  hoch: "M0,38 C20,38 34,6 60,4 C86,6 100,38 120,38 Z",
  tracker: "M0,38 C8,38 14,10 28,8 C44,6 76,6 92,8 C106,10 112,38 120,38 Z",
};
