"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Umschalter zwischen Ansichten (z. B. Gewerbe / Privat, Übersicht / Technik).
 * Alle Panels werden serverseitig mitgerendert (SEO) und nur ausgeblendet.
 * Tastatur: Pfeiltasten wechseln den Tab (WAI-ARIA Tabs).
 *
 * props: ansichten [{ id, label, icon? (JSX-Element, z. B. <Factory />), inhalt (JSX) }], dunkel, ausrichtung, label
 * Hinweis: Icons als Element übergeben – Komponenten (Funktionen) sind über die
 * Server-/Client-Grenze nicht serialisierbar.
 */
export default function Umschalter({ ansichten = [], dunkel = false, ausrichtung = "center", label = "Ansicht wählen", className }) {
  const [aktiv, setAktiv] = useState(ansichten[0]?.id);
  const basis = useId();
  const refs = useRef([]);

  const taste = (e, i) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const n = ansichten.length;
    const ziel = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
    setAktiv(ansichten[ziel].id);
    refs.current[ziel]?.focus();
  };

  return (
    <div className={className}>
      <div className={cn("flex", ausrichtung === "center" ? "justify-center" : "justify-start")}>
        <div
          role="tablist"
          aria-label={label}
          className={cn("grid w-full auto-cols-fr grid-flow-col gap-1 rounded-[1.4rem] p-1.5 sm:inline-flex sm:w-auto sm:rounded-full", dunkel ? "bg-white/[0.07] ring-1 ring-white/15" : "bg-white shadow-md ring-1 ring-ink-200/80")}
        >
          {ansichten.map((a, i) => {
            const an = a.id === aktiv;
            return (
              <button
                key={a.id}
                ref={(el) => (refs.current[i] = el)}
                type="button"
                role="tab"
                id={`${basis}-t-${a.id}`}
                aria-selected={an}
                aria-controls={`${basis}-p-${a.id}`}
                tabIndex={an ? 0 : -1}
                onClick={() => setAktiv(a.id)}
                onKeyDown={(e) => taste(e, i)}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[1.1rem] px-3 py-2 text-center text-[13px] font-semibold leading-tight transition-all duration-300 sm:shrink-0 sm:rounded-full sm:px-5 sm:text-[14.5px] md:px-6",
                  an
                    ? dunkel
                      ? "bg-white text-navy-950 shadow-lg"
                      : "bg-navy-950 text-white shadow-lg"
                    : dunkel
                      ? "text-white/70 hover:text-white"
                      : "text-ink-600 hover:text-ink-900"
                )}
              >
                {a.icon && <span aria-hidden="true" className="hidden sm:flex [&>svg]:h-4 [&>svg]:w-4">{a.icon}</span>}
                {a.label}
              </button>
            );
          })}
        </div>
      </div>
      {ansichten.map((a) => (
        <div
          key={a.id}
          role="tabpanel"
          id={`${basis}-p-${a.id}`}
          aria-labelledby={`${basis}-t-${a.id}`}
          hidden={a.id !== aktiv}
          className="ov-tab-panel mt-10 md:mt-12"
        >
          {a.inhalt}
        </div>
      ))}
    </div>
  );
}
