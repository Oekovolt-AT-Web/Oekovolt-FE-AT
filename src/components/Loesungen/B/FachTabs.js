"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Fachdetails in Reitern („Für Technik & Einkauf“). Alle Inhalte werden
 * server-seitig gerendert und bleiben im DOM (SEO) – inaktive Reiter sind nur `hidden`.
 *
 * tabs: [{ id, label, icon?: JSX-Element, inhalt: JSX }]
 * dunkel: Darstellung auf navy-Hintergrund
 */
export default function FachTabs({ tabs = [], dunkel = false, className }) {
  const [aktiv, setAktiv] = useState(tabs[0]?.id);
  const basis = useId();
  const refs = useRef({});

  const tastatur = (e, index) => {
    const n = tabs.length;
    let ziel = null;
    if (e.key === "ArrowRight") ziel = (index + 1) % n;
    if (e.key === "ArrowLeft") ziel = (index - 1 + n) % n;
    if (e.key === "Home") ziel = 0;
    if (e.key === "End") ziel = n - 1;
    if (ziel === null) return;
    e.preventDefault();
    const t = tabs[ziel];
    setAktiv(t.id);
    refs.current[t.id]?.focus();
  };

  return (
    <div className={className}>
      <div className="-mx-4 overflow-x-auto px-4 ov-no-scrollbar md:mx-0 md:px-0">
        <div
          role="tablist"
          aria-label="Fachdetails"
          className={cn("inline-flex min-w-full gap-1 rounded-full p-1.5 md:min-w-0", dunkel ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-white ring-1 ring-ink-200/80 shadow-sm")}
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
                onKeyDown={(e) => tastatur(e, i)}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 md:px-5 md:text-[14.5px]",
                  an
                    ? dunkel
                      ? "bg-white text-navy-950 shadow-lg"
                      : "bg-navy-950 text-white shadow-md"
                    : dunkel
                      ? "text-white/65 hover:text-white"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                )}
              >
                {t.icon && <span aria-hidden="true" className={cn("[&>svg]:h-4 [&>svg]:w-4", an ? (dunkel ? "text-ov-600" : "text-ov-300") : "text-current opacity-70")}>{t.icon}</span>}
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
          className="ov-tab-panel mt-8 focus-visible:outline-none md:mt-10"
        >
          {t.inhalt}
        </div>
      ))}
    </div>
  );
}
