"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, Info, Scale, Sparkles } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { Regler } from "@/components/Rechner/bausteine";
import { fmt } from "@/lib/rechner/annahmen";

/* ------------------------------------------------------------------
   Gemeinsame Bausteine der Gewerbe-Rechner (Peak Shaving,
   Energiegemeinschaft, Blackout). Ergänzt src/components/Rechner/bausteine.js.
   ------------------------------------------------------------------ */

/** Große Energiemengen lesbar: 250.000 kWh → „250 MWh“, 2.500.000 → „2,5 GWh“ */
export const menge = (kwh) =>
  kwh >= 1e6 ? `${fmt(kwh / 1e6, kwh % 1e6 ? 1 : 0)} GWh` : kwh >= 1e4 ? `${fmt(kwh / 1000)} MWh` : `${fmt(kwh)} kWh`;

const p2 = (v) => Math.round(v * 100) / 100; // Prozentwerte für SSR und Client identisch

export const euro = (n) => `${n < 0 ? "−" : ""}${fmt(Math.abs(Math.round(n)))} €`;

/**
 * Animationen der Diagramme – eigene Keyframes (Präfix rg-), nur bei
 * erlaubter Bewegung. Einmal je Seite einbinden.
 */
export function GewerbeStil() {
  return (
    <style>{`
@media (prefers-reduced-motion: no-preference) {
  .rg-zeichnen { stroke-dasharray: 1; stroke-dashoffset: 1; animation: rg-zeichnen 1100ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .rg-einblenden { animation: rg-einblenden 700ms ease-out both; }
  .rg-fluss { animation: rg-fluss 1.6s linear infinite; }
  .rg-pfad { transition: d 600ms cubic-bezier(0.22, 1, 0.36, 1); }
  .rg-balken { transition: height 600ms cubic-bezier(0.22, 1, 0.36, 1), background-color 300ms; }
  .rg-puls { animation: rg-puls 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
}
@keyframes rg-zeichnen { to { stroke-dashoffset: 0; } }
@keyframes rg-einblenden { from { opacity: 0; } to { opacity: 1; } }
@keyframes rg-fluss { to { stroke-dashoffset: -28; } }
@keyframes rg-puls { 0%, 100% { transform: scale(1); opacity: 0.55; } 50% { transform: scale(1.12); opacity: 0.2; } }
`}</style>
  );
}

/** Rechnerkarte: gleiche Hülle wie die bestehenden Rechner */
export function Karte({ children, className }) {
  return (
    <div className={cn("overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70", className)}>
      {children}
    </div>
  );
}

/** Vorlagen als Chips (horizontal scrollbar auf dem Handy) */
export function Vorlagen({ vorlagen, aktiv, onWahl, titel = "Beispiel laden" }) {
  return (
    <div>
      <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">{titel}</p>
      <div className="ov-no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {vorlagen.map((v) => {
          const an = aktiv === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onWahl(v)}
              aria-pressed={an}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-semibold ring-1 transition-colors duration-200",
                an ? "bg-ink-900 text-white ring-ink-900" : "bg-white text-ink-700 ring-ink-200 hover:ring-ink-300 hover:text-ink-900"
              )}
            >
              {an && <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-sun-300" />}
              {v.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Logarithmischer Schieberegler (z. B. 20 MWh bis 10 GWh) auf Basis von Regler */
export function LogRegler({ label, wert, min, max, onChange, format, raster = (v) => (v < 1e5 ? 1000 : v < 1e6 ? 10000 : 50000), hinweis }) {
  const pos = Math.round((Math.log(wert / min) / Math.log(max / min)) * 1000);
  const ausPos = (p) => {
    const roh = min * Math.pow(max / min, p / 1000);
    const r = raster(roh);
    return Math.min(max, Math.max(min, Math.round(roh / r) * r));
  };
  return (
    <Regler
      label={label}
      wert={Math.max(0, Math.min(1000, pos))}
      min={0}
      max={1000}
      step={1}
      format={(p) => format(p === pos ? wert : ausPos(p))}
      minLabel={format(min)}
      maxLabel={format(max)}
      onChange={(p) => onChange(ausPos(p))}
      hinweis={hinweis}
    />
  );
}

/** Kompaktes Zahlenfeld (deutsches Zahlformat, Komma als Dezimaltrenner) */
export function Zahlfeld({ label, wert, onChange, einheit, min = 0, max = 1e9, step = 1, klein = false, className, ariaLabel }) {
  const id = useId();
  const stellen = step < 1 ? Math.min(2, String(step).split(".")[1]?.length || 1) : 0;
  const anzeige = (v) => (Number.isFinite(v) ? v.toLocaleString("de-DE", { maximumFractionDigits: stellen, useGrouping: false }) : "");
  const [text, setText] = useState(anzeige(wert));
  const fokus = useRef(false);
  useEffect(() => {
    if (!fokus.current) setText(anzeige(wert));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wert]);
  const lesen = (t) => Number(String(t).trim().replace(",", "."));
  const uebernehmen = (t) => {
    const n = lesen(t);
    if (Number.isFinite(n) && String(t).trim() !== "") onChange(Math.min(max, Math.max(min, n)));
  };
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={cn("mb-1.5 block font-semibold text-ink-700", klein ? "text-[12px]" : "text-[13.5px]")}>
          {label}
        </label>
      )}
      <div className="flex items-center rounded-xl bg-white ring-1 ring-ink-200 focus-within:ring-2 focus-within:ring-ov-500">
        <input
          id={id}
          type="text"
          inputMode={stellen ? "decimal" : "numeric"}
          value={text}
          aria-label={ariaLabel}
          onFocus={() => (fokus.current = true)}
          onBlur={() => {
            fokus.current = false;
            uebernehmen(text);
            const n = lesen(text);
            setText(anzeige(Number.isFinite(n) && text.trim() !== "" ? Math.min(max, Math.max(min, n)) : wert));
          }}
          onChange={(e) => {
            setText(e.target.value);
            const n = lesen(e.target.value);
            if (Number.isFinite(n) && n >= min && n <= max && e.target.value.trim() !== "") onChange(n);
          }}
          className={cn("ov-num w-full min-w-0 rounded-xl bg-transparent px-3 font-semibold text-ink-900 outline-none", klein ? "h-10 text-[14px]" : "h-11 text-[15px]")}
        />
        {einheit && <span className="shrink-0 pr-3 text-[12.5px] font-medium text-ink-500">{einheit}</span>}
      </div>
    </div>
  );
}

/** Auswahlliste (natives select im Markenstil) */
export function Liste({ label, wert, onChange, optionen, hinweis }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-[14.5px] font-semibold text-ink-800">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={wert}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-2xl bg-white pl-4 pr-10 text-[15px] font-semibold text-ink-900 ring-1 ring-ink-200 transition hover:ring-ink-300 focus:outline-none focus:ring-2 focus:ring-ov-500"
        >
          {optionen.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500">
          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {hinweis && <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{hinweis}</p>}
    </div>
  );
}

const HINWEIS_TON = {
  info: { box: "bg-navy-50/70 ring-navy-100 text-ink-700", icon: Info, farbe: "text-navy-600" },
  warn: { box: "bg-sun-300/15 ring-sun-400/40 text-ink-700", icon: AlertTriangle, farbe: "text-sun-500" },
  recht: { box: "bg-ink-50 ring-ink-200 text-ink-700", icon: Scale, farbe: "text-ink-600" },
  gruen: { box: "bg-ov-50 ring-ov-200 text-ink-700", icon: Sparkles, farbe: "text-ov-600" },
};

/** Hinweisbox (Info, Warnung, Rechtslage) */
export function Hinweis({ ton = "info", titel, children, className }) {
  const t = HINWEIS_TON[ton] || HINWEIS_TON.info;
  const Icon = t.icon;
  return (
    <div className={cn("flex gap-3 rounded-2xl px-4 py-3.5 text-[13.5px] leading-relaxed ring-1", t.box, className)}>
      <Icon aria-hidden="true" className={cn("mt-0.5 h-4 w-4 shrink-0", t.farbe)} />
      <div className="min-w-0">
        {titel && <p className="font-semibold text-ink-900">{titel}</p>}
        <div className={titel ? "mt-0.5" : ""}>{children}</div>
      </div>
    </div>
  );
}

/** Diagramm-Karte mit Titel und optionaler Zusatzzeile/Steuerung */
export function DiagrammKarte({ titel, unter, rechts, children, className }) {
  return (
    <div className={cn("rounded-3xl ring-1 ring-ink-200/70", className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 px-5 pt-5 md:px-6">
        <div className="min-w-0">
          <h3 className="font-display text-[17px] font-bold text-ink-900">{titel}</h3>
          {unter && <p className="mt-0.5 text-[12.5px] text-ink-500">{unter}</p>}
        </div>
        {rechts}
      </div>
      {children}
    </div>
  );
}

/** Kleine segmentierte Umschaltung (für Diagramme) */
export function Umschalter({ optionen, wert, onChange, label }) {
  return (
    <div role="group" aria-label={label} className="inline-flex shrink-0 rounded-full bg-ink-100/80 p-1">
      {optionen.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={wert === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "min-h-9 rounded-full px-3 text-[12.5px] font-semibold transition-all duration-200",
            wert === o.id ? "bg-white text-ink-900 shadow-[0_2px_8px_-2px_rgba(21,26,36,0.18)]" : "text-ink-600 hover:text-ink-900"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Startwerte aus der URL übernehmen (geteilter Link) – einmalig nach dem Laden. */
export function useStartAusUrl(parser, uebernehmen) {
  const erledigt = useRef(false);
  useEffect(() => {
    if (erledigt.current) return;
    erledigt.current = true;
    try {
      const p = new URLSearchParams(window.location.search);
      const e = parser((k) => p.get(k));
      if (e) uebernehmen(e);
    } catch {
      /* ungültiger Link – Standardwerte bleiben */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Balken-Anteil (z. B. Win-win-Aufteilung) */
export function Anteilsbalken({ teile, hoehe = "h-3", label }) {
  const summe = teile.reduce((s, t) => s + Math.max(0, t.wert), 0) || 1;
  return (
    <div role="img" aria-label={label} className={cn("flex w-full overflow-hidden rounded-full bg-ink-100", hoehe)}>
      {teile.map((t) => (
        <div key={t.id} className={cn("h-full motion-safe:transition-[width] motion-safe:duration-500", t.klasse)} style={{ width: `${p2((Math.max(0, t.wert) / summe) * 100)}%` }} />
      ))}
    </div>
  );
}
