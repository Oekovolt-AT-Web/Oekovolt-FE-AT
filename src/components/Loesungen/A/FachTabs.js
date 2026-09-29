"use client";

import { Children, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Fachdetails in Tabs („Für Technik & Einkauf“).
 * Alle Panels werden serverseitig gerendert und bleiben im DOM (SEO) –
 * inaktive Panels sind nur per `hidden` ausgeblendet.
 * tabs: [{ id, label, kurz? }] – id dient als Sprungmarke (#id öffnet den Tab).
 * children: je Tab ein Panel in derselben Reihenfolge.
 */
export default function FachTabs({ tabs = [], children, className }) {
  const panels = Children.toArray(children);
  const [aktiv, setAktiv] = useState(0);
  const basis = useId();
  const listeRef = useRef(null);

  useEffect(() => {
    const oeffne = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (!h) return;
      const i = tabs.findIndex((t) => t.id === h);
      const zeige = (n) => {
        setAktiv(n);
        setTimeout(() => document.getElementById(h)?.scrollIntoView({ block: "start" }), 60);
      };
      if (i >= 0) return zeige(i);
      // Sprungmarke innerhalb eines Panels?
      const el = document.getElementById(h);
      const panel = el?.closest?.("[data-fachtab]");
      if (panel) zeige(Number(panel.getAttribute("data-fachtab")));
    };
    oeffne();
    window.addEventListener("hashchange", oeffne);
    return () => window.removeEventListener("hashchange", oeffne);
  }, [tabs]);

  const tastatur = (e) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    let n = aktiv;
    if (e.key === "ArrowRight") n = (aktiv + 1) % tabs.length;
    if (e.key === "ArrowLeft") n = (aktiv - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = tabs.length - 1;
    setAktiv(n);
    listeRef.current?.querySelectorAll('[role="tab"]')[n]?.focus();
  };

  return (
    <div className={className}>
      <div
        ref={listeRef}
        role="tablist"
        aria-label="Fachdetails"
        onKeyDown={tastatur}
        className="ov-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            id={`${basis}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={aktiv === i}
            aria-controls={`${basis}-panel-${i}`}
            tabIndex={aktiv === i ? 0 : -1}
            onClick={() => setAktiv(i)}
            className={cn(
              "relative inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl px-5 text-[14.5px] font-semibold transition-all duration-300",
              aktiv === i ? "bg-navy-950 text-white shadow-lg shadow-navy-950/15" : "bg-white text-ink-700 ring-1 ring-ink-200 hover:text-ink-900 hover:ring-ink-300"
            )}
          >
            <span className={cn("font-display text-[12px] font-bold", aktiv === i ? "text-ov-300" : "text-ov-600")}>{String(i + 1).padStart(2, "0")}</span>
            {t.label}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div
          key={tabs[i]?.id || i}
          id={`${basis}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${basis}-tab-${i}`}
          data-fachtab={i}
          hidden={aktiv !== i}
          className="ov-tab-panel mt-6 rounded-[2rem] bg-white p-5 ring-1 ring-ink-200/70 md:p-10"
        >
          <span id={tabs[i]?.id} className="block scroll-mt-32" />
          {p}
        </div>
      ))}
    </div>
  );
}
