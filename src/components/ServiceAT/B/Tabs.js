"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Barrierearme Tabs (WAI-ARIA Tabs-Muster, Pfeiltasten). Alle Panels werden
 * gerendert (SEO) – inaktive nur mit `hidden` ausgeblendet.
 *
 * props:
 *  tabs   [{ id, label, icon? (JSX-Element, z. B. <Warehouse />), inhalt (JSX) }]
 *  dunkel Variante für Navy-Flächen
 *  label  aria-label der Tab-Leiste
 */
export default function Tabs({ tabs = [], dunkel = false, label = "Ansicht wählen", className, leisteClassName }) {
  const basis = useId();
  const [aktiv, setAktiv] = useState(tabs[0]?.id);
  const refs = useRef([]);

  const tasten = (e, i) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n == null) return;
    e.preventDefault();
    setAktiv(tabs[n].id);
    refs.current[n]?.focus();
  };

  return (
    <div className={className}>
      <div className="ov-no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label={label} className={cn("inline-flex min-w-max gap-1 rounded-full p-1.5", dunkel ? "bg-white/[0.07] ring-1 ring-white/10" : "bg-ink-100", leisteClassName)}>
          {tabs.map((t, i) => {
            const an = t.id === aktiv;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${basis}-tab-${t.id}`}
                aria-selected={an}
                aria-controls={`${basis}-panel-${t.id}`}
                tabIndex={an ? 0 : -1}
                onClick={() => setAktiv(t.id)}
                onKeyDown={(e) => tasten(e, i)}
                className={cn(
                  "inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14.5px] font-semibold transition-all duration-300 sm:px-5",
                  an
                    ? dunkel
                      ? "bg-white text-navy-950 shadow-lg"
                      : "bg-white text-ink-900 shadow-md"
                    : dunkel
                      ? "text-white/70 hover:text-white"
                      : "text-ink-600 hover:text-ink-900"
                )}
              >
                {t.icon && <span aria-hidden="true" className={cn("[&_svg]:h-4 [&_svg]:w-4", an ? "text-ov-600" : "")}>{t.icon}</span>}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${basis}-panel-${t.id}`}
          aria-labelledby={`${basis}-tab-${t.id}`}
          hidden={t.id !== aktiv}
          tabIndex={0}
          className="ov-tab-panel mt-8 outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-4 rounded-3xl"
        >
          {t.inhalt}
        </div>
      ))}
    </div>
  );
}
