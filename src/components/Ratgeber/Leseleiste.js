"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontale Leseleiste (Scroll-Snap) mit Pfeiltasten und Fortschrittsbalken.
 * Die Karten kommen als Server-Kinder – hier nur das Scroll-Verhalten.
 */
export default function Leseleiste({ label, children }) {
  const spur = useRef(null);
  const [stand, setStand] = useState({ links: false, rechts: true, anteil: 0 });

  useEffect(() => {
    const el = spur.current;
    if (!el) return;
    const messe = () => {
      const max = el.scrollWidth - el.clientWidth;
      setStand({ links: el.scrollLeft > 8, rechts: el.scrollLeft < max - 8, anteil: max > 0 ? el.scrollLeft / max : 1 });
    };
    messe();
    el.addEventListener("scroll", messe, { passive: true });
    window.addEventListener("resize", messe);
    return () => {
      el.removeEventListener("scroll", messe);
      window.removeEventListener("resize", messe);
    };
  }, []);

  const blaettern = (richtung) => {
    const el = spur.current;
    if (!el) return;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: richtung * Math.max(el.clientWidth * 0.8, 280), behavior: ruhig ? "auto" : "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={spur}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="ov-no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 md:-mx-8 md:gap-5 md:px-8 lg:mx-0 lg:px-0"
      >
        {children}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <div aria-hidden="true" className="h-1 flex-1 overflow-hidden rounded-full bg-ink-200/70">
          <div className="h-full w-1/4 rounded-full bg-ink-900 transition-transform duration-300" style={{ transform: `translateX(${stand.anteil * 300}%)` }} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => blaettern(-1)}
            disabled={!stand.links}
            aria-label="Zurück blättern"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-800 ring-1 ring-ink-200 transition-all hover:bg-ink-900 hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-ink-800"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => blaettern(1)}
            disabled={!stand.rechts}
            aria-label="Weiter blättern"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-800 ring-1 ring-ink-200 transition-all hover:bg-ink-900 hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-ink-800"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
