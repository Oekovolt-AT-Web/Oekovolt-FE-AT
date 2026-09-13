"use client";

/**
 * Schieberegler im Markenstil (nutzt die globale Klasse .ov-range).
 * Wird von den interaktiven Elementen der Produktseiten Wallbox,
 * Smart Meter und Mieterstrom gemeinsam genutzt.
 */
export default function Regler({ id, label, wert, min, max, step = 1, onChange, anzeige, hinweis, dunkel = false }) {
  const fill = ((wert - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className={`text-[14px] font-medium ${dunkel ? "text-white/75" : "text-ink-600"}`}>
          {label}
        </label>
        <output htmlFor={id} className={`ov-num shrink-0 whitespace-nowrap font-display text-[17px] font-extrabold tracking-tight ${dunkel ? "text-white" : "text-ink-900"}`}>
          {anzeige ?? wert}
        </output>
      </div>
      {/* py-3 vergrößert die Touch-Fläche auf über 44 px */}
      <div className="py-3">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={wert}
          onChange={(e) => onChange(Number(e.target.value))}
          className="ov-range"
          style={{ "--ov-fill": `${fill}%` }}
        />
      </div>
      {hinweis && <p className={`-mt-1 text-[12.5px] leading-snug ${dunkel ? "text-white/50" : "text-ink-500"}`}>{hinweis}</p>}
    </div>
  );
}
