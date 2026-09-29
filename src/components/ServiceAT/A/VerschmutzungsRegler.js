"use client";

import { useId, useMemo, useState } from "react";
import { Droplets, Info, Sun, TrendingDown } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Verschmutzungs-Ertragsverlust-Regler: Anlagenleistung, spezifischer Ertrag,
 * Verschmutzungsverlust und Energiewert → entgangene kWh und € pro Jahr.
 * Voreinstellungen nach DLR (Renewable Energy, 2025): Europa im Mittel 0,9 %
 * pro Jahr bei gut reinigendem Regen, bis zu 5,3 % bei geringer Regenwirkung;
 * gemäßigtes Klima/Wohngebiete meist unter 1 %. Rechenbeispiel, keine Zusage –
 * Reinigungskosten sind nicht berücksichtigt.
 */

const VOREINSTELLUNGEN = [
  { label: "Europa-Mittel, Regen reinigt gut", wert: 0.9 },
  { label: "Regen wirkt wenig (bis)", wert: 5.3 },
];

const zahl = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

function Regler({ id, label, wert, min, max, step, onChange, anzeige }) {
  const fill = ((wert - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14px] font-medium text-ink-700">
          {label}
        </label>
        <output htmlFor={id} className="ov-num shrink-0 whitespace-nowrap font-display text-[18px] font-extrabold tracking-tight text-ink-900">
          {anzeige}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={wert}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ov-range my-4 block cursor-pointer"
        style={{ "--ov-fill": `${fill}%` }}
      />
    </div>
  );
}

/** Modul-Illustration: Schmutzschleier wächst mit dem Verlust, Rand an der Unterkante. */
function Modul({ verlust }) {
  const staerke = Math.min(1, verlust / 8);
  return (
    <svg viewBox="0 0 360 230" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="vr-glas" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b2a44" />
          <stop offset="0.55" stopColor="#0e1a2e" />
          <stop offset="1" stopColor="#223453" />
        </linearGradient>
        <linearGradient id="vr-rand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a7a5c" stopOpacity="0" />
          <stop offset="1" stopColor="#6d5c3d" stopOpacity="0.95" />
        </linearGradient>
        <filter id="vr-korn">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0.62  0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 1.4 -0.55" />
        </filter>
        <clipPath id="vr-clip">
          <rect x="14" y="14" width="332" height="202" rx="4" />
        </clipPath>
      </defs>
      <rect x="6" y="6" width="348" height="218" rx="8" fill="#c9d1dc" />
      <rect x="14" y="14" width="332" height="202" rx="4" fill="url(#vr-glas)" />
      {/* Zellraster 10 × 6 */}
      <g stroke="#2d4266" strokeWidth="1">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={14 + ((i + 1) * 332) / 10} x2={14 + ((i + 1) * 332) / 10} y1="14" y2="216" />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1="14" x2="346" y1={14 + ((i + 1) * 202) / 6} y2={14 + ((i + 1) * 202) / 6} />
        ))}
      </g>
      <path d="M14 14 L150 14 L60 216 L14 216 Z" fill="#ffffff" opacity="0.05" />
      <g clipPath="url(#vr-clip)">
        <rect x="14" y="14" width="332" height="202" filter="url(#vr-korn)" style={{ opacity: staerke * 0.9, transition: "opacity 400ms" }} />
        <rect x="14" y={216 - 12 - staerke * 38} width="332" height={12 + staerke * 38} fill="url(#vr-rand)" style={{ transition: "all 400ms" }} />
        {verlust > 2 && (
          <g fill="#e8e2d2" style={{ opacity: Math.min(1, (verlust - 2) / 4), transition: "opacity 400ms" }}>
            <ellipse cx="82" cy="66" rx="7" ry="5" />
            <ellipse cx="248" cy="120" rx="9" ry="6" />
            <ellipse cx="300" cy="52" rx="5" ry="4" />
          </g>
        )}
      </g>
    </svg>
  );
}

export default function VerschmutzungsRegler() {
  const id = useId();
  const [kwp, setKwp] = useState(250);
  const [ertrag, setErtrag] = useState(1050);
  const [verlust, setVerlust] = useState(0.9);
  const [preis, setPreis] = useState(0.15);

  const r = useMemo(() => {
    const jahr = kwp * ertrag;
    const kwh = jahr * (verlust / 100);
    return { jahr, kwh, euro: kwh * preis, zehn: kwh * preis * 10 };
  }, [kwp, ertrag, verlust, preis]);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="p-6 md:p-9">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Interaktiv · Verschmutzung & Ertrag</p>
          <h3 className="ov-h3 mt-2 text-ink-900">Was kostet Schmutz auf Ihrer Anlage?</h3>

          <div className="mt-6">
            <p className="text-[14px] font-medium text-ink-700">Richtwerte laut DLR-Auswertung für Europa</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {VOREINSTELLUNGEN.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setVerlust(v.wert)}
                  aria-pressed={verlust === v.wert}
                  className={cn(
                    "min-h-10 rounded-full px-3.5 text-[13px] font-semibold ring-1 transition-colors",
                    verlust === v.wert ? "bg-navy-950 text-white ring-navy-950" : "bg-white text-ink-700 ring-ink-200 hover:ring-ov-300"
                  )}
                >
                  {v.label} · {zahl(v.wert, 1)} %
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[13px] leading-snug text-ink-500">Gemäßigtes Klima und Wohngebiete: meist unter 1 % pro Jahr. Stall-, Ernte- und Industriestaub oder flache Module: deutlich mehr möglich.</p>
          </div>

          <div className="mt-6">
            <Regler id={`${id}-v`} label="Verschmutzungsverlust pro Jahr" wert={verlust} min={0} max={10} step={0.1} onChange={setVerlust} anzeige={`${zahl(verlust, 1)} %`} />
            <Regler id={`${id}-k`} label="Anlagenleistung" wert={kwp} min={10} max={3000} step={10} onChange={setKwp} anzeige={`${zahl(kwp)} kWp`} />
            <Regler id={`${id}-e`} label="Spezifischer Ertrag (aus Ihrem Monitoring)" wert={ertrag} min={850} max={1300} step={10} onChange={setErtrag} anzeige={`${zahl(ertrag)} kWh/kWp`} />
            <Regler id={`${id}-p`} label="Wert je kWh (Ihr Rechenwert)" wert={preis} min={0.05} max={0.35} step={0.01} onChange={setPreis} anzeige={`${zahl(preis * 100)} ct`} />
          </div>
        </div>

        <div aria-live="polite" className="relative flex flex-col overflow-hidden bg-navy-950 p-6 text-white md:p-9">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sun-400/20 blur-[90px]" />
          <div className="relative">
            <div className="rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
              <Modul verlust={verlust} />
            </div>
            <p className="mt-2 text-center text-[11.5px] text-white/40">Illustration: Schmutzschleier und Rand an der unteren Rahmenkante</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                <p className="flex items-center gap-1.5 text-[12.5px] text-white/55">
                  <TrendingDown aria-hidden="true" className="h-3.5 w-3.5 text-sun-300" />
                  entgangen pro Jahr
                </p>
                <p className="ov-num mt-1 font-display text-[21px] font-extrabold sm:text-[24px] tracking-tight text-sun-300 md:text-[28px]">
                  <span className="whitespace-nowrap">{zahl(Math.round(r.kwh / 10) * 10)}</span> <span className="text-[16px] md:text-[20px]">kWh</span>
                </p>
              </div>
              <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                <p className="flex items-center gap-1.5 text-[12.5px] text-white/55">
                  <Sun aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
                  Wert pro Jahr
                </p>
                <p className="ov-num mt-1 font-display text-[21px] font-extrabold sm:text-[24px] tracking-tight md:text-[28px]">≈ {zahl(Math.round(r.euro / 10) * 10)} €</p>
              </div>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-white/70">
              Bei rund {zahl(Math.round(r.jahr / 1000))} MWh Jahresertrag entspricht das über zehn Jahre etwa <strong className="text-white">{zahl(Math.round(r.zehn / 100) * 100)} €</strong> – dem
              stellen wir die Kosten der Reinigung gegenüber.
            </p>
            <a href="#anfrage" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] hover:bg-ov-700">
              <Droplets aria-hidden="true" className="h-4 w-4" />
              Befund & Angebot anfragen
            </a>
          </div>
        </div>
      </div>
      <p className="flex gap-2 border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-9">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
        <span>
          Rechenbeispiel mit Ihren Eingaben, keine Zusage. Voreinstellungen nach DLR (Renewable Energy, 2025: „Photovoltaic soiling loss in Europe“). Der tatsächliche Verlust hängt stark von
          Standort, Neigung und Staubquelle ab – wir messen ihn vorab durch Strangvergleich oder Performance Ratio. Reinigungskosten sind nicht berücksichtigt.
        </span>
      </p>
    </div>
  );
}
