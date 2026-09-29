"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/components/ui/cn";

/**
 * Die sechs Bereiche als ruhige Reiter-Galerie: links eine nummerierte Liste mit feinen Linien,
 * rechts ein großes Bild (Überblendung) und darunter der Inhalt des Bereichs.
 * Alle Inhalte sind server-seitig im DOM (SEO); inaktive Bereiche sind nur `hidden`.
 * Sprungmarken (#indach, #speicher …) öffnen den passenden Bereich.
 *
 * bereiche: [{ id, titel, kurz, bild, alt, position?, inhalt: JSX }]
 */
export default function BereicheGalerie({ bereiche = [] }) {
  const [aktiv, setAktiv] = useState(bereiche[0]?.id);
  const basis = useId();
  const wurzel = useRef(null);
  const knoepfe = useRef({});

  useEffect(() => {
    const ausHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (bereiche.some((b) => b.id === id)) {
        setAktiv(id);
        wurzel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    ausHash();
    window.addEventListener("hashchange", ausHash);
    return () => window.removeEventListener("hashchange", ausHash);
  }, [bereiche]);

  const tastatur = (e, i) => {
    const n = bereiche.length;
    const vor = ["ArrowDown", "ArrowRight"].includes(e.key);
    const zurueck = ["ArrowUp", "ArrowLeft"].includes(e.key);
    if (!vor && !zurueck) return;
    e.preventDefault();
    const b = bereiche[(i + (vor ? 1 : -1) + n) % n];
    setAktiv(b.id);
    knoepfe.current[b.id]?.focus();
  };

  const index = Math.max(0, bereiche.findIndex((b) => b.id === aktiv));

  return (
    <div ref={wurzel} className="grid scroll-mt-28 grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[340px_minmax(0,1fr)]">
      {/* Liste */}
      <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <div role="tablist" aria-label="Sechs Bereiche" aria-orientation="vertical" className="-mx-4 flex gap-2 overflow-x-auto px-4 ov-no-scrollbar lg:mx-0 lg:block lg:overflow-visible lg:border-t lg:border-ink-200 lg:px-0">
          {bereiche.map((b, i) => {
            const an = b.id === aktiv;
            return (
              <button
                key={b.id}
                ref={(el) => (knoepfe.current[b.id] = el)}
                type="button"
                role="tab"
                id={`${basis}-t-${b.id}`}
                aria-selected={an}
                aria-controls={b.id}
                tabIndex={an ? 0 : -1}
                onClick={() => setAktiv(b.id)}
                onKeyDown={(e) => tastatur(e, i)}
                className={cn(
                  "group relative shrink-0 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500",
                  "rounded-full px-4 py-2.5 ring-1 lg:w-full lg:rounded-none lg:border-b lg:border-ink-200 lg:px-0 lg:py-5 lg:ring-0",
                  an ? "bg-navy-950 ring-navy-950 lg:bg-transparent" : "ring-ink-200 lg:hover:bg-transparent"
                )}
              >
                <span className="flex items-baseline gap-4">
                  <span className={cn("hidden font-display text-[12px] font-semibold tracking-[0.2em] lg:inline", an ? "text-ov-600" : "text-ink-400")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("whitespace-nowrap font-display text-[14.5px] tracking-tight lg:whitespace-normal lg:text-[21px] lg:font-light", an ? "text-white lg:text-ink-900" : "text-ink-600 group-hover:text-ink-900")}>
                    {b.titel}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn("absolute bottom-[-1px] left-0 hidden h-px bg-ov-600 transition-all duration-700 lg:block", an ? "w-full" : "w-0")}
                />
                <span className={cn("hidden overflow-hidden pl-9 text-[14px] leading-relaxed text-ink-500 transition-all duration-500 lg:grid", an ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <span className="min-h-0">{b.kurz}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bild + Inhalt */}
      <div className="min-w-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-ink-100 sm:aspect-[16/9]">
          {bereiche.map((b) => (
            <Image
              key={b.id}
              src={b.bild}
              alt={b.alt || ""}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              aria-hidden={b.id !== aktiv}
              className={cn(
                "object-cover transition-[opacity,transform] duration-[1200ms] ease-out",
                b.id === aktiv ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
              )}
              style={b.position ? { objectPosition: b.position } : undefined}
            />
          ))}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
          <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6 text-white md:p-8">
            <p className="font-display text-[13px] font-semibold tracking-[0.24em] text-white/80">
              {String(index + 1).padStart(2, "0")} <span className="text-white/40">/ {String(bereiche.length).padStart(2, "0")}</span>
            </p>
            <div className="flex gap-1.5">
              {bereiche.map((b) => (
                <span key={b.id} className={cn("h-[2px] rounded-full transition-all duration-500", b.id === aktiv ? "w-8 bg-white" : "w-3 bg-white/40")} />
              ))}
            </div>
          </div>
        </div>

        {bereiche.map((b) => (
          <div
            key={b.id}
            id={b.id}
            role="tabpanel"
            aria-labelledby={`${basis}-t-${b.id}`}
            hidden={b.id !== aktiv}
            className="ov-tab-panel scroll-mt-28 pt-10"
          >
            {b.inhalt}
          </div>
        ))}
      </div>
    </div>
  );
}
