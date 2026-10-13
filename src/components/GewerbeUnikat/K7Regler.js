// src/components/GewerbeUnikat/K7Regler.js
//
// K7 · Bedienelemente des Pults – REINE Komponenten (keine Hooks, kein "use client"). Ohne Handler
// (Server-Platzhalter) erscheinen sie im Startzustand, deaktiviert und ohne ids/testids; die Bühne (K7Pult)
// reicht Handler herein. Jede Eingabe ist nativ (range mit aria-valuetext, Radiogruppe, button).
//
// Regler: Trefferfläche 44 px (mobil 48 px), sichtbare Spur 5 px, Griff 28 px; darunter Marken für das
// Rechenbeispiel (und z. B. den Richtwert der Marktstatistik), darunter Chips mit Werten aus anderen
// Kapiteln. Pillen gefüllt, nie umrahmt.

import { cn } from "@/components/ui/cn";

/**
 * Fokus am Griff: Der globale Fokusring (ungeschichtet in globals.css, deshalb „!“) zöge einen Rahmen um die
 * ganze 44-px-Trefferfläche und schnitte durch Beschriftung und Marken. Stattdessen bekommt der Griff einen
 * weißen Spalt und einen ov-600-Ring (Kontrast ≥ 3:1 auf Weiß und Sand).
 */
export const FOKUS_GRIFF =
  "focus-visible:outline-none! focus-visible:shadow-none! " +
  "focus-visible:[&::-webkit-slider-thumb]:shadow-[inset_0_0_0_8px_var(--color-navy-950),0_0_0_3px_#fff,0_0_0_6px_var(--color-ov-600)] " +
  "focus-visible:[&::-moz-range-thumb]:shadow-[inset_0_0_0_8px_var(--color-navy-950),0_0_0_3px_#fff,0_0_0_6px_var(--color-ov-600)] ";

/** Regler-Spur (auch für die Ableseleiste unter dem Fächer). */
export const SPUR =
  "block h-11 w-full appearance-none bg-transparent max-md:h-12 rounded-full " +
  FOKUS_GRIFF +
  "[&::-webkit-slider-runnable-track]:h-[5px] [&::-webkit-slider-runnable-track]:rounded-full " +
  "[&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-navy-950)_var(--k7-fuell),var(--color-ink-200)_var(--k7-fuell))] " +
  "[&::-webkit-slider-thumb]:mt-[-11.5px] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white " +
  "[&::-webkit-slider-thumb]:shadow-[inset_0_0_0_8px_var(--color-navy-950),0_2px_10px_rgba(21,26,36,0.22)] " +
  "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 active:[&::-webkit-slider-thumb]:scale-110 " +
  "[&::-moz-range-track]:h-[5px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-ink-200 " +
  "[&::-moz-range-progress]:h-[5px] [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-navy-950 " +
  "[&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white " +
  "[&::-moz-range-thumb]:shadow-[inset_0_0_0_8px_var(--color-navy-950),0_2px_10px_rgba(21,26,36,0.22)]";

const anteil = (wert, min, max) => Math.min(1, Math.max(0, (wert - min) / (max - min)));

/** Geschätzte Breite einer Marken-Beschriftung (11 px Inter ≈ 5,9 px je Zeichen) und kleinste Spurbreite. */
const MARKE_ZEICHEN_PX = 5.9;
const SPUR_MIN_PX = 280;

/**
 * Marken nach Lage gruppieren: Überlappen sich zwei Beschriftungen auf der schmalsten Spur, entsteht EINE
 * Beschriftung „Beispiel 800 · Markt 840“ (Kurzformen) mit zwei Strichen – nie übereinander gedruckter Text.
 */
export function markenGruppen(marken, min, max) {
  const liste = marken.map((m) => ({ ...m, t: anteil(m.wert, min, max) })).sort((a, b) => a.t - b.t);
  const gruppen = [];
  for (const m of liste) {
    const vor = gruppen[gruppen.length - 1];
    if (vor) {
      const breiteVor = vor.text.length * MARKE_ZEICHEN_PX;
      const breite = m.label.length * MARKE_ZEICHEN_PX;
      const abstand = (m.t - vor.t) * SPUR_MIN_PX;
      if (abstand < (breiteVor + breite) / 2 + 10) {
        vor.marken.push(m);
        vor.text = vor.marken.map((x) => x.kurz ?? x.label).join(" · ");
        vor.t = (vor.marken[0].t + m.t) / 2;
        continue;
      }
    }
    gruppen.push({ t: m.t, text: m.label, marken: [m] });
  }
  return gruppen;
}
/** Position über der Spur (Griff 28 px breit). */
const links = (t) => `calc(14px + (100% - 28px) * ${t})`;

/**
 * Natives Range-Feld mit Beschriftung, <output>, Marken und Chips.
 * marken: [{ wert, label }] · chips: [{ label, wert, aktiv }] (Klick → onWert(wert))
 */
export function Regler({ id, label, zusatz, wert, min, max, schritt, anzeige, valuetext, testid, onWert, marken = [], chips = [], hinweis, className }) {
  const live = Boolean(onWert);
  const t = anteil(wert, min, max);
  const feld = live
    ? { id, value: wert, onChange: (e) => onWert(Number(e.target.value)), "data-testid": testid, "aria-valuetext": valuetext }
    : { defaultValue: wert, disabled: true, tabIndex: -1, "aria-hidden": true };
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-baseline justify-between gap-3">
        {live ? (
          <label htmlFor={id} className="min-w-0 text-[13.5px] font-semibold leading-snug text-ink-700">
            {label}
            {zusatz && <span className="block text-[12px] font-normal text-ink-500">{zusatz}</span>}
          </label>
        ) : (
          <span className="min-w-0 text-[13.5px] font-semibold leading-snug text-ink-700">
            {label}
            {zusatz && <span className="block text-[12px] font-normal text-ink-500">{zusatz}</span>}
          </span>
        )}
        {live ? (
          <output htmlFor={id} aria-live="off" className="ov-num shrink-0 font-display text-[15.5px] font-bold text-ink-900">
            {anzeige}
          </output>
        ) : (
          <span className="ov-num shrink-0 font-display text-[15.5px] font-bold text-ink-900">{anzeige}</span>
        )}
      </div>
      <input type="range" min={min} max={max} step={schritt} className={cn(SPUR, live ? "cursor-pointer" : "cursor-default")} style={{ "--k7-fuell": `${t * 100}%` }} {...feld} />
      {marken.length > 0 && (
        <div aria-hidden="true" className="relative -mt-1 h-[18px] text-[11px] leading-none text-ink-500">
          {markenGruppen(marken, min, max).map((gr) => (
            <span key={gr.text}>
              {gr.marken.map((m) => (
                <span key={m.label} className="absolute top-0 block h-[5px] w-px -translate-x-1/2 bg-ink-900/45" style={{ left: links(m.t) }} />
              ))}
              <span
                className={cn("absolute top-[8px] whitespace-nowrap", gr.t > 0.82 ? "-translate-x-[85%]" : gr.t < 0.18 ? "-translate-x-[15%]" : "-translate-x-1/2")}
                style={{ left: links(gr.t) }}
              >
                {gr.text}
              </span>
            </span>
          ))}
        </div>
      )}
      {chips.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {chips.map((c) =>
            live ? (
              <button
                key={c.label}
                type="button"
                onClick={() => onWert(c.wert)}
                aria-pressed={c.aktiv}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold transition-colors duration-200",
                  c.aktiv ? "bg-ov-100 text-ov-800" : "bg-ink-100 text-ink-700 hover:bg-ink-200"
                )}
              >
                <span aria-hidden="true">{c.aktiv ? "✓" : "↧"}</span>
                {c.label}
              </button>
            ) : (
              <span key={c.label} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ink-100 px-3 text-[12.5px] font-semibold text-ink-700">
                <span aria-hidden="true">↧</span>
                {c.label}
              </span>
            )
          )}
        </div>
      )}
      {hinweis && <p className="mt-2 max-w-[56ch] text-[12.5px] leading-snug text-ink-500">{hinweis}</p>}
    </div>
  );
}

/** Gefüllte Auswahl als Radiogruppe (wie Segment aus ./_gestaltung, aber ohne Hooks – auch im SSR). */
export function Wahl({ name, legende, legendeVersteckt = false, voll = false, wert, optionen, onWahl, testid, klein = true, className }) {
  const live = Boolean(onWahl);
  return (
    <fieldset className={cn("min-w-0", className)} data-testid={live ? testid : undefined}>
      <legend className={legendeVersteckt ? "sr-only" : "mb-1.5 text-[13.5px] font-semibold text-ink-700"}>{legende}</legend>
      <div className={cn("max-w-full gap-1 rounded-[22px] bg-ink-100 p-1", voll ? "grid w-full auto-cols-fr grid-flow-col" : "inline-flex flex-wrap")}>
        {optionen.map((o) => {
          const aktiv = o.id === wert;
          return (
            <label
              key={o.id}
              className={cn(
                "relative flex select-none items-center justify-center rounded-full text-center font-semibold leading-tight transition-colors duration-200",
                klein ? "min-h-10 px-3 py-1.5 text-[13px]" : "min-h-11 px-4 text-[14px]",
                aktiv ? "bg-navy-950 text-white" : "text-ink-700 hover:bg-white",
                live ? "cursor-pointer" : "cursor-default",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ov-500"
              )}
            >
              {live ? (
                <input type="radio" name={name} value={o.id} checked={aktiv} onChange={() => onWahl(o.id)} className="sr-only" />
              ) : (
                <input type="radio" defaultChecked={aktiv} disabled tabIndex={-1} aria-hidden="true" className="sr-only" />
              )}
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Warte-Regler als Monatsleiste: 24 Monatszellen bilden die Spur, der native Regler liegt darüber.
 * Kein Countdown, keine Annahme zur Projektdauer – nur Jahresüberschuss ÷ 12 × Monate.
 */
export function MonatsLeiste({ id, monate, max = 24, onWert, valuetext, testid }) {
  const live = Boolean(onWert);
  const feld = live
    ? { id, value: monate, onChange: (e) => onWert(Number(e.target.value)), "data-testid": testid, "aria-valuetext": valuetext }
    : { defaultValue: monate, disabled: true, tabIndex: -1, "aria-hidden": true };
  return (
    <div className="relative h-12">
      <div aria-hidden="true" className="absolute inset-x-[14px] top-1/2 flex h-3 -translate-y-1/2 gap-[2px]">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={cn("h-full flex-1 transition-colors duration-300 first:rounded-l-full last:rounded-r-full", i < monate ? "bg-ink-700" : "bg-ink-200", i % 12 === 11 && "mr-[3px]")}
          />
        ))}
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        className={cn(
          "absolute inset-0 h-12 w-full appearance-none bg-transparent rounded-full",
          FOKUS_GRIFF,
          "[&::-webkit-slider-runnable-track]:h-full [&::-webkit-slider-runnable-track]:bg-transparent",
          "[&::-webkit-slider-thumb]:mt-[10px] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
          "[&::-webkit-slider-thumb]:shadow-[inset_0_0_0_8px_var(--color-navy-950),0_2px_10px_rgba(21,26,36,0.22)]",
          "[&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white",
          "[&::-moz-range-thumb]:shadow-[inset_0_0_0_8px_var(--color-navy-950),0_2px_10px_rgba(21,26,36,0.22)]",
          live ? "cursor-pointer" : "cursor-default"
        )}
        {...feld}
      />
      <div aria-hidden="true" className="ov-num pointer-events-none absolute inset-x-[14px] -bottom-2.5 flex justify-between text-[11px] leading-none text-ink-500">
        <span>heute</span>
        <span>12 Monate</span>
        <span>24</span>
      </div>
    </div>
  );
}

/** Ableseleiste unter dem Fächer: natives Gegenstück zum Fadenkreuz (Jahr 0–25). */
export function Ableseleiste({ jahr, onWert, valuetext }) {
  const live = Boolean(onWert);
  const feld = live
    ? { id: "k7-jahr", value: jahr, onChange: (e) => onWert(Number(e.target.value)), "data-testid": "faecher-jahr", "aria-valuetext": valuetext }
    : { defaultValue: jahr, disabled: true, tabIndex: -1, "aria-hidden": true };
  return (
    <div className="mt-2 flex items-center gap-3">
      {live ? (
        <label htmlFor="k7-jahr" className="shrink-0 text-[12.5px] font-semibold text-ink-600">
          Jahr ablesen
        </label>
      ) : (
        <span className="shrink-0 text-[12.5px] font-semibold text-ink-600">Jahr ablesen</span>
      )}
      <input type="range" min={0} max={25} step={1} className={cn(SPUR, "min-w-0 flex-1", live ? "cursor-pointer" : "cursor-default")} style={{ "--k7-fuell": `${(jahr / 25) * 100}%` }} {...feld} />
    </div>
  );
}
