"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Themen-Explorer: links eine kompakte Liste, rechts das Detail – für
 * Funktionslisten, die als Kartenraster zu lang würden. Alle Details sind
 * server-gerendert im DOM (inaktive mit `hidden`).
 *
 * items: [{ titel, kurz?, text, icon? (JSX), tag?, punkte?: [{ titel, text }] }]
 */
export default function ThemenExplorer({ items = [], label = "Themen", dunkel = false, kopf, zweispaltig = false, className }) {
  const [aktiv, setAktiv] = useState(0);
  const id = useId();
  const panelRef = useRef(null);
  const waehle = (i) => {
    setAktiv(i);
    // Mobil liegt das Detail unter der Liste – sanft dorthin scrollen
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" }));
    }
  };

  const tastatur = (e) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
    e.preventDefault();
    const n = (aktiv + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    setAktiv(n);
    document.getElementById(`${id}-t${n}`)?.focus();
  };

  return (
    <div className={cn("grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8", className)}>
      <div className="min-w-0">
      {kopf && <div className="mb-8">{kopf}</div>}
      <div role="tablist" aria-label={label} aria-orientation="vertical" onKeyDown={tastatur} className={cn("grid content-start gap-1.5 sm:grid-cols-2", !zweispaltig && "lg:grid-cols-1")}>
        {items.map((it, i) => {
          const an = i === aktiv;
          return (
            <button
              key={it.titel}
              id={`${id}-t${i}`}
              type="button"
              role="tab"
              aria-selected={an}
              aria-controls={`${id}-p${i}`}
              tabIndex={an ? 0 : -1}
              onClick={() => waehle(i)}
              className={cn(
                "group flex min-h-[52px] items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-all duration-300",
                an
                  ? dunkel
                    ? "bg-white text-navy-950 shadow-xl"
                    : "bg-navy-950 text-white shadow-xl"
                  : dunkel
                    ? "text-white/75 hover:bg-white/[0.06]"
                    : "text-ink-700 hover:bg-white hover:shadow-sm"
              )}
            >
              {it.icon && (
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors [&_svg]:h-[18px] [&_svg]:w-[18px]",
                    an ? "bg-ov-500 text-white" : dunkel ? "bg-white/10 text-ov-300" : "bg-ov-50 text-ov-600 group-hover:bg-ov-100"
                  )}
                >
                  {it.icon}
                </span>
              )}
              <span className={cn("min-w-0 flex-1 font-display font-bold leading-snug", zweispaltig ? "text-[14px]" : "text-[15px]")}>{it.titel}</span>
              {!zweispaltig && <ArrowRight aria-hidden="true" className={cn("hidden h-4 w-4 shrink-0 transition-all lg:block", an ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0")} />}
            </button>
          );
        })}
      </div>
      </div>

      <div ref={panelRef} className="min-w-0 scroll-mt-24 lg:sticky lg:top-28 lg:self-start">
        {items.map((it, i) => (
          <div
            key={it.titel}
            id={`${id}-p${i}`}
            role="tabpanel"
            aria-labelledby={`${id}-t${i}`}
            hidden={i !== aktiv}
            className={cn(
              "ov-tab-panel relative overflow-hidden rounded-[2rem] p-7 md:p-10",
              dunkel ? "bg-white/[0.05] ring-1 ring-white/10" : "bg-white shadow-xl ring-1 ring-ink-200/70"
            )}
          >
            <div aria-hidden="true" className={cn("absolute -right-20 -top-20 h-60 w-60 rounded-full blur-[80px]", dunkel ? "bg-ov-500/20" : "bg-ov-100")} />
            {it.icon && (
              <span aria-hidden="true" className={cn("absolute right-6 top-6 hidden sm:block [&_svg]:h-16 [&_svg]:w-16 [&_svg]:stroke-[1.25]", dunkel ? "text-white/10" : "text-ov-200")}>
                {it.icon}
              </span>
            )}
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <span className={cn("font-display text-[13px] font-bold", dunkel ? "text-ov-300" : "text-ov-700")}>
                  {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
                {it.tag && (
                  <span className={cn("rounded-full px-2.5 py-1 text-[11.5px] font-semibold tracking-wide", dunkel ? "bg-white/10 text-white/75" : "bg-ink-100 text-ink-600")}>{it.tag}</span>
                )}
              </div>
              <h3 className={cn("mt-4 font-display text-[24px] font-extrabold leading-tight tracking-tight md:text-[28px]", dunkel ? "text-white" : "text-ink-900")}>{it.titel}</h3>
              <p className={cn("mt-4 max-w-[62ch] text-[16.5px] leading-relaxed", dunkel ? "text-white/70" : "text-ink-600")}>{it.text}</p>
              {it.punkte?.length > 0 && (
                <ul className="mt-6 grid gap-3">
                  {it.punkte.map((p) => (
                    <li key={p.titel} className="flex gap-3">
                      <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full", dunkel ? "bg-ov-500/20 text-ov-300" : "bg-ov-100 text-ov-700")}>
                        <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <span className={cn("text-[15px] leading-relaxed", dunkel ? "text-white/75" : "text-ink-700")}>
                        <strong className={dunkel ? "text-white" : "text-ink-900"}>{p.titel}</strong> – {p.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
