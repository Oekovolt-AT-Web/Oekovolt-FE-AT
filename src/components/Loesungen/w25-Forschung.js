// src/components/Loesungen/w25-Forschung.js
//
// Abschnitt „Forschung & Praxis“ für /agri-pv (Server-Komponente, Präfix w25r).
// Links der Text, rechts zwei gezeichnete Befundkarten: die Flächennutzungseffizienz der Wiener
// Versuchsanlage als Skala (0,94 Soja bis 1,19 Wintergerste, 1,0 = getrennte Nutzung) und die
// Schutzwirkung in Haidegg (Starkregen, Sonnenbrand, Blütenfrost – Hagel nicht zuverlässig).
// Aufbau beim Eintritt über `data-w25-an` (W25Sicht); ohne JS/bei reduzierter Bewegung Endzustand.

import Image from "next/image";
import { CloudHail, CloudRain, Snowflake, Sun } from "lucide-react";
import W25Sicht from "./w25-Sicht";
import W25Zahl from "./w25-Zahl";

const X = (v) => Math.round((16 + ((v - 0.9) / 0.35) * 328) * 10) / 10;
const TICKS = [0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.25];

const CSS = `
@media (prefers-reduced-motion:no-preference){
  .w25r-band{transform-box:fill-box;transform-origin:${X(1) - X(0.94)}px 50%;transition:transform 1300ms cubic-bezier(.22,1,.36,1) 400ms}
  [data-w25-bereit]:not([data-w25-an]) .w25r-band{transform:scaleX(0)}
  .w25r-punkt{transition:opacity 500ms ease 1300ms,transform 600ms cubic-bezier(.22,1,.36,1) 1300ms;transform-box:fill-box;transform-origin:center}
  [data-w25-bereit]:not([data-w25-an]) .w25r-punkt{opacity:0;transform:scale(.3)}
  .w25r-reihe{transform-box:fill-box;transform-origin:50% 100%;transition:transform 900ms cubic-bezier(.22,1,.36,1) calc(var(--k) * 90ms),opacity 500ms ease calc(var(--k) * 90ms)}
  [data-w25-bereit]:not([data-w25-an]) .w25r-reihe{transform:scaleY(0);opacity:0}
  .w25r-schutz{transition:opacity 500ms ease calc(500ms + var(--k) * 140ms),transform 600ms cubic-bezier(.22,1,.36,1) calc(500ms + var(--k) * 140ms)}
  [data-w25-bereit]:not([data-w25-an]) .w25r-schutz{opacity:0;transform:translateY(8px)}
}
`;

const SCHUTZ = [
  { icon: CloudRain, t: "Starkregen", ok: true },
  { icon: Sun, t: "Sonnenbrand", ok: true },
  { icon: Snowflake, t: "Blütenfrost", ok: true },
  { icon: CloudHail, t: "Hagel", ok: false },
];

export default function W25Forschung({ eyebrow, titel, absaetze = [], bild }) {
  return (
    <div data-blk="forschung" className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
      <style>{CSS}</style>
      <div className="lg:self-center">
        <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
          {eyebrow}
        </p>
        <h2 className="ov-h2 mt-4 max-w-[30rem] text-balance text-ink-900">{titel}</h2>
        <div className="mt-6 max-w-[36rem] space-y-4 text-[16px] leading-relaxed text-ink-600">
          {absaetze.map((a) => (
            <p key={a.slice(0, 24)}>{a}</p>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {bild && (
          <div className="relative aspect-[16/7] overflow-hidden rounded-[1.75rem] ring-1 ring-ink-200/70">
            <Image src={bild.src} alt={bild.alt} fill sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-4 rounded-full bg-navy-950/70 px-3 py-1 text-[11.5px] font-semibold text-white">Forschungsanlage, hoch aufgeständert (Deutschland)</span>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Wien: Flächennutzungseffizienz */}
          <W25Sicht as="figure" schwelle={0.35} className="flex flex-col rounded-[1.75rem] bg-white p-5 ring-1 ring-ink-200/70 md:p-6">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Wien · Schafflerhofstraße</p>
            <svg viewBox="0 0 360 64" className="mt-4 h-auto w-full" aria-hidden="true">
              <line x1="6" x2="354" y1="58" y2="58" stroke="#8cba58" strokeWidth="2" />
              {[0, 1, 2, 3, 4, 5].map((k) => {
                const x = 30 + k * 60;
                return (
                  <g key={k} className="w25r-reihe" style={{ "--k": k }}>
                    <rect x={x - 4} y="14" width="8" height="38" rx="1.5" fill="#12408a" />
                    <rect x={x - 4} y="14" width="4" height="38" rx="1.5" fill="#ffd873" opacity="0.55" />
                    <rect x={x - 1.5} y="52" width="3" height="6" fill="#8a96a6" />
                  </g>
                );
              })}
              {[0, 1, 2, 3, 4].map((k) => (
                <g key={k} className="w25r-reihe" style={{ "--k": k + 2 }}>
                  {[14, 24, 34, 44].map((dx) => (
                    <path key={dx} d={`M${30 + k * 60 + dx} 58v-12`} stroke="#aed083" strokeWidth="2" strokeLinecap="round" />
                  ))}
                </g>
              ))}
              <path d="M38 8H82M38 4v8M82 4v8" stroke="#94a0b0" strokeWidth="1.2" fill="none" />
            </svg>
            <p className="mt-1 text-[12px] text-ink-500">sechs Modulreihen, 10 m Abstand, dazwischen Ackerbau</p>

            <figcaption className="mt-5 font-display text-[16px] font-bold leading-snug text-ink-900">Flächennutzungseffizienz 2022</figcaption>
            <svg viewBox="0 0 360 64" className="mt-3 h-auto w-full" aria-hidden="true">
              <defs>
                <linearGradient id="w25r-band" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#d9c08a" />
                  <stop offset={(X(1) - X(0.94)) / (X(1.19) - X(0.94))} stopColor="#cfe0b4" />
                  <stop offset="1" stopColor="#669933" />
                </linearGradient>
              </defs>
              <line x1={X(0.9)} x2={X(1.25)} y1="30" y2="30" stroke="#dfe3ea" strokeWidth="10" strokeLinecap="round" />
              <rect className="w25r-band" x={X(0.94)} y="25" width={X(1.19) - X(0.94)} height="10" rx="5" fill="url(#w25r-band)" />
              <line x1={X(1)} x2={X(1)} y1="12" y2="46" stroke="#03122b" strokeWidth="1.5" strokeDasharray="3 3" />
              {TICKS.map((v) => (
                <g key={v}>
                  <line x1={X(v)} x2={X(v)} y1="40" y2="44" stroke="#94a0b0" />
                  {[0.9, 1, 1.1, 1.2].includes(v) && (
                    <text x={X(v)} y="60" textAnchor="middle" fontSize="12" fill="#5b6475">
                      {v.toLocaleString("de-DE", { minimumFractionDigits: 1 })}
                    </text>
                  )}
                </g>
              ))}
              <circle className="w25r-punkt" cx={X(0.94)} cy="30" r="7" fill="#fff" stroke="#b08f4c" strokeWidth="3" />
              <circle className="w25r-punkt" cx={X(1.19)} cy="30" r="7" fill="#fff" stroke="#436621" strokeWidth="3" />
            </svg>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-[12.5px] text-ink-500">Soja</dt>
                <dd className="font-display text-[26px] font-extrabold leading-none tracking-tight text-ink-900">
                  <W25Zahl wert={0.94} stellen={2} von={0.8} />
                </dd>
              </div>
              <div>
                <dt className="text-[12.5px] text-ink-500">Wintergerste</dt>
                <dd className="font-display text-[26px] font-extrabold leading-none tracking-tight text-ov-700">
                  <W25Zahl wert={1.19} stellen={2} von={0.8} />
                </dd>
              </div>
            </dl>
            <div aria-hidden="true" className="min-h-4 flex-1" />
            <p className="border-t border-ink-100 pt-3 text-[13px] leading-snug text-ink-600">
              <strong className="text-ink-900">1,0</strong> = so viel wie getrennte Nutzung. Vier von fünf Kulturen lagen darüber.
            </p>
          </W25Sicht>

          {/* Haidegg: Schutzwirkung */}
          <W25Sicht as="figure" schwelle={0.35} className="relative flex flex-col overflow-hidden rounded-[1.75rem] bg-navy-950 p-5 text-white ring-1 ring-navy-900 md:p-6">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ov-500/20 blur-[70px]" />
            <p className="relative text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Steiermark · Haidegg</p>
            <p className="relative mt-4 font-display font-extrabold leading-none tracking-tight">
              <span className="text-[13px] font-semibold text-white/55">rund </span>
              <W25Zahl wert={2800} className="text-[34px]" />
              <span className="ml-1 text-[18px] text-white/60">m²</span>
            </p>
            <p className="relative mt-2 text-[13px] leading-snug text-white/60">teiltransparente Module über Apfel, Birne, Kirsche, Marille und weiteren Obstarten</p>
            <figcaption className="relative mt-5 font-display text-[16px] font-bold">Schutzwirkung der Anlage</figcaption>
            <ul className="relative mt-3 space-y-2">
              {SCHUTZ.map((s, k) => (
                <li key={s.t} className="w25r-schutz flex items-center gap-3 rounded-xl bg-white/[0.05] px-3 py-2.5 ring-1 ring-white/10" style={{ "--k": k }}>
                  <s.icon aria-hidden="true" className={s.ok ? "h-4 w-4 text-ov-300" : "h-4 w-4 text-sun-300"} />
                  <span className="flex-1 text-[14px] font-semibold">{s.t}</span>
                  <span className={s.ok ? "text-[12px] font-semibold text-ov-300" : "text-[12px] font-semibold text-sun-300"}>{s.ok ? "geschützt" : "nicht zuverlässig"}</span>
                </li>
              ))}
            </ul>
            <p className="relative mt-4 text-[13px] leading-snug text-white/60">Deshalb wurden zusätzlich Hagelnetze montiert.</p>
          </W25Sicht>
        </div>
      </div>
    </div>
  );
}
