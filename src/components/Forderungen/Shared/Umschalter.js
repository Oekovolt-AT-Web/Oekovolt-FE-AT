"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Umschalter (Tabs) für die Förder- und Rechtsseiten.
 *
 * Alle Panels werden server-gerendert und bleiben im DOM (SEO, Strg+F);
 * inaktive Panels sind nur per `hidden` ausgeblendet. Tastatur: Pfeiltasten,
 * Pos1/Ende wie im WAI-ARIA-Tabs-Muster.
 *
 * tabs:   [{ id, label, icon?: JSX, badge?: string|number, hinweis?: string }]
 * panels: [JSX] – gleiche Reihenfolge wie tabs
 * ton:    "light" | "dark"
 * form:   "pillen" (Standard) | "karten" (große Auswahlkacheln) | "liste" (vertikal links, Desktop)
 */
export default function Umschalter({ tabs = [], panels = [], start, ton = "light", form = "pillen", label = "Ansicht wählen", className, panelClassName, zentriert = false }) {
  const [aktiv, setAktiv] = useState(start || tabs[0]?.id);
  const basis = useId();
  const refs = useRef({});
  const dunkel = ton === "dark";

  function tasten(e, i) {
    let ziel = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") ziel = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") ziel = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") ziel = 0;
    if (e.key === "End") ziel = tabs.length - 1;
    if (ziel === null) return;
    e.preventDefault();
    setAktiv(tabs[ziel].id);
    refs.current[tabs[ziel].id]?.focus();
  }

  const liste = form === "liste";

  const leiste = (
    <div
      role="tablist"
      aria-label={label}
      aria-orientation={liste ? "vertical" : "horizontal"}
      className={cn(
        form === "pillen" && cn("ov-no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:inline-flex sm:flex-wrap sm:rounded-full sm:p-1 sm:px-1", dunkel ? "sm:bg-white/[0.06] sm:ring-1 sm:ring-white/10" : "sm:bg-ink-100/80"),
        form === "karten" && "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap",
        liste && "ov-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0",
        zentriert && form === "pillen" && "sm:mx-auto"
      )}
    >
      {tabs.map((t, i) => {
        const an = t.id === aktiv;
        return (
          <button
            key={t.id}
            ref={(el) => (refs.current[t.id] = el)}
            type="button"
            role="tab"
            id={`${basis}-tab-${t.id}`}
            aria-selected={an}
            aria-controls={`${basis}-panel-${t.id}`}
            tabIndex={an ? 0 : -1}
            onClick={() => setAktiv(t.id)}
            onKeyDown={(e) => tasten(e, i)}
            className={cn(
              "group relative inline-flex shrink-0 items-center gap-2 font-semibold outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ov-500",
              form === "pillen" && cn(
                "h-11 rounded-full px-4 text-[14.5px]",
                an
                  ? dunkel ? "bg-white text-navy-950 shadow-lg" : "bg-white text-ink-900 shadow-[0_6px_18px_-8px_rgba(3,18,43,0.35)]"
                  : dunkel ? "bg-white/[0.06] text-white/75 ring-1 ring-white/10 hover:text-white sm:bg-transparent sm:ring-0" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:text-ink-900 sm:bg-transparent sm:ring-0"
              ),
              form === "karten" && cn(
                "min-h-[56px] rounded-2xl px-4 py-2.5 text-left text-[14.5px] leading-tight",
                an ? "bg-navy-950 text-white shadow-[0_14px_30px_-16px_rgba(3,18,43,0.7)]" : dunkel ? "bg-white/[0.06] text-white/80 ring-1 ring-white/10 hover:bg-white/10" : "bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ov-300"
              ),
              liste && cn(
                "h-11 rounded-full px-4 text-[14.5px] lg:h-auto lg:w-full lg:rounded-2xl lg:px-4 lg:py-3.5 lg:text-left",
                an ? "bg-navy-950 text-white shadow-[0_14px_30px_-16px_rgba(3,18,43,0.7)]" : "bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ov-300"
              )
            )}
          >
            {t.icon && <span aria-hidden="true" className={cn("flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]", an ? (dunkel || form !== "pillen" ? "text-ov-300" : "text-ov-600") : "text-ov-600")}>{t.icon}</span>}
            <span className="min-w-0">
              <span className="block">{t.label}</span>
              {t.hinweis && <span className={cn("mt-0.5 hidden text-[12.5px] font-medium lg:block", an ? "text-white/60" : "text-ink-500")}>{t.hinweis}</span>}
            </span>
            {t.badge !== undefined && (
              <span className={cn("ov-num ml-auto rounded-full px-1.5 text-[12px]", an ? (dunkel || form !== "pillen" ? "bg-white/15 text-white" : "bg-ov-100 text-ov-800") : dunkel ? "bg-white/10 text-white/70" : "bg-ink-100 text-ink-600")}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );

  const inhalt = tabs.map((t, i) => (
    <div
      key={t.id}
      role="tabpanel"
      id={`${basis}-panel-${t.id}`}
      aria-labelledby={`${basis}-tab-${t.id}`}
      hidden={t.id !== aktiv}
      tabIndex={0}
      className={cn("ov-tab-panel outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-4 rounded-3xl", panelClassName)}
    >
      {panels[i]}
    </div>
  ));

  if (liste) {
    return (
      <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10", className)}>
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">{leiste}</div>
        <div className="min-w-0">{inhalt}</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={cn(zentriert && "flex justify-center")}>{leiste}</div>
      <div className="mt-6 md:mt-8">{inhalt}</div>
    </div>
  );
}
