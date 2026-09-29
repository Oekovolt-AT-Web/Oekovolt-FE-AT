"use client";

import { Children, useId, useState } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Umschaltbare Ansichten für lange Fachinhalte. Alle Panels werden
 * server-gerendert und bleiben im DOM (SEO) – inaktive nur mit `hidden`.
 *
 * props:
 *  tabs      [{ label, kurz?, icon? (JSX-Element) }]
 *  children  genau so viele Panels wie Tabs
 *  dunkel    für Navy-Sektionen
 *  label     aria-label der Tab-Leiste
 */
export default function Tabs({ tabs = [], children, dunkel = false, label = "Ansicht wählen", className }) {
  const [aktiv, setAktiv] = useState(0);
  const id = useId();
  const panels = Children.toArray(children);

  const tastatur = (e) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    let n = aktiv;
    if (e.key === "ArrowRight") n = (aktiv + 1) % tabs.length;
    if (e.key === "ArrowLeft") n = (aktiv - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = tabs.length - 1;
    setAktiv(n);
    document.getElementById(`${id}-t${n}`)?.focus();
  };

  return (
    <div className={cn("min-w-0", className)}>
      <div className="-mx-4 overflow-x-auto px-4 pb-1 ov-no-scrollbar md:mx-0 md:px-0">
        <div
          role="tablist"
          aria-label={label}
          onKeyDown={tastatur}
          className={cn("inline-flex min-w-full gap-1.5 rounded-full p-1.5 md:min-w-0", dunkel ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-white ring-1 ring-ink-200/80 shadow-sm")}
        >
          {tabs.map((t, i) => {
            const an = i === aktiv;
            return (
              <button
                key={t.label}
                id={`${id}-t${i}`}
                type="button"
                role="tab"
                aria-selected={an}
                aria-controls={`${id}-p${i}`}
                tabIndex={an ? 0 : -1}
                onClick={() => setAktiv(i)}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-all duration-300 md:px-5 md:text-[14.5px] [&_svg]:h-4 [&_svg]:w-4",
                  an
                    ? dunkel
                      ? "bg-white text-navy-950 shadow-lg"
                      : "bg-navy-950 text-white shadow-lg"
                    : dunkel
                      ? "text-white/70 hover:bg-white/10 hover:text-white"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                )}
              >
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      {panels.map((p, i) => (
        <div
          key={i}
          id={`${id}-p${i}`}
          role="tabpanel"
          aria-labelledby={`${id}-t${i}`}
          hidden={i !== aktiv}
          tabIndex={0}
          className="ov-tab-panel mt-6 outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-4 rounded-3xl"
        >
          {p}
        </div>
      ))}
    </div>
  );
}
