"use client";

// src/components/Loesungen/A/FachTabs.js
//
// Fachdetails in Kapiteln („Für Technik & Einkauf“). Eine Schiene mit gleitender Markierung
// statt loser Knöpfe, ein Fortschrittsstrich zeigt, wo man im Fachteil steht; jedes Kapitel
// endet mit „Weiter: …“, damit sich der Fachteil wie ein kurzes Dossier lesen lässt.
// Alle Panels werden serverseitig gerendert und bleiben im DOM (SEO) – inaktive Panels sind nur
// per `hidden` ausgeblendet. #id öffnet den passenden Tab (auch Sprungmarken innerhalb).

import { Children, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/components/ui/cn";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const CSS = `
.w24ft-marke{transition:transform .5s cubic-bezier(.65,0,.35,1),width .5s cubic-bezier(.65,0,.35,1),opacity .3s}
.w24ft-fortschritt{transform-origin:0 50%;transition:transform .6s cubic-bezier(.65,0,.35,1)}
.w24ft-panel{animation:w24ft-ein .45s cubic-bezier(.22,1,.36,1) both}
@keyframes w24ft-ein{from{opacity:0;transform:translate3d(0,10px,0)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.w24ft-marke,.w24ft-fortschritt{transition:none}.w24ft-panel{animation:none}}
`;

/**
 * tabs: [{ id, label, kurz? }] – id dient als Sprungmarke (#id öffnet den Tab).
 * children: je Tab ein Panel in derselben Reihenfolge.
 */
export default function FachTabs({ tabs = [], children, className }) {
  const panels = Children.toArray(children);
  const [aktiv, setAktiv] = useState(0);
  const [marke, setMarke] = useState(null);
  const basis = useId();
  const listeRef = useRef(null);
  const wurzelRef = useRef(null);
  const [gewechselt, setGewechselt] = useState(false);

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

  // Gleitende Markierung: Lage des aktiven Tabs messen (auch nach Größenänderung).
  useIsoLayoutEffect(() => {
    const liste = listeRef.current;
    if (!liste) return undefined;
    const messen = () => {
      const knopf = liste.querySelectorAll('[role="tab"]')[aktiv];
      if (!knopf) return;
      setMarke({ x: knopf.offsetLeft, b: knopf.offsetWidth });
    };
    messen();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(messen) : null;
    ro?.observe(liste);
    document.fonts?.ready?.then(messen);
    return () => ro?.disconnect();
  }, [aktiv, tabs.length]);

  // Aktiven Tab in der (mobil scrollbaren) Schiene sichtbar halten.
  useEffect(() => {
    const liste = listeRef.current;
    const knopf = liste?.querySelectorAll('[role="tab"]')[aktiv];
    if (!liste || !knopf || liste.scrollWidth <= liste.clientWidth) return;
    const ziel = knopf.offsetLeft - (liste.clientWidth - knopf.offsetWidth) / 2;
    liste.scrollTo({ left: Math.max(0, ziel), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [aktiv]);

  const waehle = (n, { scrollen = false, fokus = false } = {}) => {
    setGewechselt(true);
    setAktiv(n);
    if (fokus) listeRef.current?.querySelectorAll('[role="tab"]')[n]?.focus();
    if (scrollen) {
      const top = wurzelRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) wurzelRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  };

  const tastatur = (e) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    let n = aktiv;
    if (e.key === "ArrowRight") n = (aktiv + 1) % tabs.length;
    if (e.key === "ArrowLeft") n = (aktiv - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = tabs.length - 1;
    waehle(n, { fokus: true });
  };

  const anzahl = tabs.length;

  return (
    <div ref={wurzelRef} data-blk="fachtabs" className={cn("scroll-mt-28", className)}>
      <style>{CSS}</style>

      {/* Schiene */}
      <div className="relative -mx-4 md:mx-0">
        <div
          ref={listeRef}
          role="tablist"
          aria-label="Fachdetails"
          onKeyDown={tastatur}
          className="ov-no-scrollbar relative flex gap-1 overflow-x-auto px-4 outline-none md:inline-flex md:max-w-full md:p-1.5"
        >
          {/* gleitende Markierung (Desktop/Tablet); mobil trägt der Knopf selbst die Farbe */}
          <span
            aria-hidden="true"
            className="w24ft-marke pointer-events-none absolute bottom-1.5 left-0 top-1.5 hidden rounded-2xl bg-navy-950 md:block"
            style={{ width: marke ? marke.b : 0, transform: `translate3d(${marke ? marke.x : 0}px,0,0)`, opacity: marke ? 1 : 0 }}
          />
          {tabs.map((t, i) => {
            const an = aktiv === i;
            return (
              <button
                key={t.id}
                id={`${basis}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={an}
                aria-controls={`${basis}-panel-${i}`}
                tabIndex={an ? 0 : -1}
                onClick={() => waehle(i)}
                className={cn(
                  "relative inline-flex h-12 shrink-0 items-center gap-2.5 rounded-2xl px-4 text-[14.5px] font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ov-500 md:px-5",
                  an
                    ? cn("text-white", marke ? "bg-navy-950 md:bg-transparent" : "bg-navy-950")
                    : "bg-transparent text-ink-600 hover:bg-ink-900/[0.04] hover:text-ink-900"
                )}
              >
                <span className={cn("ov-num font-display text-[12px] font-bold transition-colors duration-300", an ? "text-ov-300" : "text-ov-600")}>{String(i + 1).padStart(2, "0")}</span>
                <span className="whitespace-nowrap">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panels */}
      {panels.map((p, i) => {
        const vor = tabs[i + 1];
        const zurueck = tabs[i - 1];
        return (
          <div
            key={tabs[i]?.id || i}
            id={`${basis}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${basis}-tab-${i}`}
            data-fachtab={i}
            hidden={aktiv !== i}
            className={cn(
              "relative mt-5 overflow-hidden rounded-[1.75rem] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_30px_80px_-50px_rgba(15,23,42,0.4)] ring-1 ring-ink-900/[0.07] md:mt-6 md:rounded-[2rem]",
              gewechselt && "w24ft-panel"
            )}
          >
            {/* Fortschritt durch den Fachteil */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-ink-100">
              <span className="w24ft-fortschritt block h-full bg-gradient-to-r from-ov-400 via-ov-600 to-sun-400" style={{ transform: `scaleX(${(i + 1) / anzahl})` }} />
            </div>
            <span id={tabs[i]?.id} className="block scroll-mt-32" />
            <div className="p-5 pt-7 md:p-10 md:pt-11">
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-400">
                Kapitel <span className="ov-num text-ink-700">{String(i + 1).padStart(2, "0")}</span> von <span className="ov-num">{String(anzahl).padStart(2, "0")}</span>
              </p>
              {p}
            </div>
            {anzahl > 1 && (
              <div className="flex items-stretch justify-between gap-3 border-t border-ink-100 bg-sand-50/60 px-3 py-3 md:px-6">
                {zurueck ? (
                  <button
                    type="button"
                    onClick={() => waehle(i - 1, { scrollen: true })}
                    className="group inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-[14px] font-semibold text-ink-600 outline-none transition-colors hover:text-ink-900 focus-visible:ring-2 focus-visible:ring-ov-500"
                  >
                    <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="hidden sm:inline">{zurueck.label}</span>
                    <span className="sm:hidden">Zurück</span>
                  </button>
                ) : (
                  <span />
                )}
                {vor && (
                  <button
                    type="button"
                    onClick={() => waehle(i + 1, { scrollen: true })}
                    className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 text-right text-[14px] font-semibold text-ink-900 shadow-[0_6px_18px_-12px_rgba(15,23,42,0.5)] outline-none ring-1 ring-ink-900/[0.08] transition-colors hover:ring-ov-400 focus-visible:ring-2 focus-visible:ring-ov-500"
                  >
                    <span className="text-ink-500">Weiter:</span>
                    <span className="max-w-[46vw] truncate sm:max-w-none">{vor.label}</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
