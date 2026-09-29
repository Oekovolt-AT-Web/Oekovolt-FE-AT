"use client";

import { useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

/**
 * Scrollbereich für breite Tabellen: Schatten links/rechts zeigen, dass es
 * seitlich weitergeht, dazu ein Wisch-Hinweis, solange noch nicht gescrollt
 * wurde. Ohne JavaScript bleibt es ein normaler horizontal scrollbarer Rahmen.
 */
export default function TabellenRahmen({ label, children }) {
  const ref = useRef(null);
  const [s, setS] = useState({ links: false, rechts: false, gescrollt: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const messe = () => {
      const max = el.scrollWidth - el.clientWidth;
      setS((alt) => ({ links: el.scrollLeft > 4, rechts: el.scrollLeft < max - 4, gescrollt: alt.gescrollt || el.scrollLeft > 20 }));
    };
    messe();
    el.addEventListener("scroll", messe, { passive: true });
    const ro = new ResizeObserver(messe);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", messe);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      {/* Scrollbarer Bereich per Tastatur erreichbar (WCAG 2.1.1) */}
      <div ref={ref} tabIndex={0} role="region" aria-label={label} className="overflow-x-auto overscroll-x-contain rounded-2xl bg-white ring-1 ring-ink-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500">
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-px left-px w-10 rounded-l-2xl bg-gradient-to-r from-ink-900/[0.09] to-transparent transition-opacity duration-300 ${s.links ? "opacity-100" : "opacity-0"}`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-px right-px w-12 rounded-r-2xl bg-gradient-to-l from-ink-900/[0.1] to-transparent transition-opacity duration-300 ${s.rechts ? "opacity-100" : "opacity-0"}`}
      />
      {s.rechts && !s.gescrollt && (
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink-900/85 px-3 py-1.5 text-[12px] font-semibold text-white shadow-lg backdrop-blur motion-safe:animate-pulse">
          <MoveHorizontal className="h-3.5 w-3.5" />
          Seitlich wischen
        </span>
      )}
    </div>
  );
}
