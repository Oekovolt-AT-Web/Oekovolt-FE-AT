"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Animierte Prozess-Timeline mit HowTo-Schema.
 *
 * Desktop: waagrechte Schiene mit Knoten, darunter der Text des aktiven Schritts.
 * Mobil:   senkrechte Liste, der aktive Schritt ist aufgeklappt.
 * Jeder Schritttext steht genau einmal im DOM (inaktive per `hidden` bzw. lg:hidden).
 *
 * schritte: [{ name, text, icon?: JSX, dauer?: string }]
 * ton: "light" | "dark"
 */
export default function Prozess({ name, beschreibung, schritte = [], ton = "light", className, schema = true }) {
  const [aktiv, setAktiv] = useState(0);
  const [sichtbar, setSichtbar] = useState(false);
  const ref = useRef(null);
  const basis = useId();
  const dunkel = ton === "dark";
  const n = schritte.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSichtbar(true);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description: beschreibung,
    step: schritte.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
  };

  const fortschritt = n > 1 ? (aktiv / (n - 1)) * 100 : 100;

  return (
    <div ref={ref} className={className}>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}

      <div className="relative">
        {/* Schiene (nur Desktop) */}
        <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-[27px] hidden lg:block" style={{ paddingInline: `${50 / n}%` }}>
          <span className={cn("block h-[3px] rounded-full", dunkel ? "bg-white/10" : "bg-ink-200/80")}>
            <span
              className="block h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600 transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: sichtbar ? `${fortschritt}%` : "0%" }}
            />
          </span>
        </div>

      <ol className="relative grid gap-2 lg:gap-x-2 lg:gap-y-0 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ "--n": n }}>
        {schritte.map((s, i) => {
          const an = i === aktiv;
          const fertig = i < aktiv;
          return (
            <li key={s.name} className="lg:contents">
              <button
                type="button"
                id={`${basis}-k-${i}`}
                aria-expanded={an}
                aria-controls={`${basis}-p-${i}`}
                onClick={() => setAktiv(i)}
                className={cn(
                  "group relative flex w-full items-center gap-4 rounded-2xl p-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ov-500 lg:row-start-1 lg:flex-col lg:items-center lg:gap-3 lg:rounded-3xl lg:p-0 lg:pb-2 lg:text-center",
                  !an && (dunkel ? "hover:bg-white/[0.04] lg:hover:bg-transparent" : "hover:bg-ink-50 lg:hover:bg-transparent")
                )}
              >
                <span
                  className={cn(
                    "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-[16px] font-extrabold transition-all duration-500 [&>svg]:h-6 [&>svg]:w-6",
                    an
                      ? "scale-105 bg-ov-600 text-white shadow-[0_12px_28px_-10px_rgba(85,130,39,0.8)]"
                      : fertig
                        ? dunkel ? "bg-ov-500/20 text-ov-300 ring-1 ring-ov-400/40" : "bg-ov-50 text-ov-700 ring-1 ring-ov-200"
                        : dunkel ? "bg-navy-900 text-white/60 ring-1 ring-white/10 group-hover:text-white" : "bg-white text-ink-500 ring-1 ring-ink-200 group-hover:text-ov-700 group-hover:ring-ov-200",
                    sichtbar ? "opacity-100" : "opacity-0 motion-reduce:opacity-100"
                  )}
                  style={{ transitionDelay: sichtbar ? `${i * 90}ms` : "0ms" }}
                >
                  {s.icon || String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 lg:px-1">
                  <span className={cn("block text-[12px] font-bold uppercase tracking-[0.14em]", an ? (dunkel ? "text-ov-300" : "text-ov-700") : dunkel ? "text-white/40" : "text-ink-400")}>
                    Schritt {i + 1}
                  </span>
                  <span className={cn("mt-0.5 block font-display text-[16px] font-bold leading-snug lg:text-[14.5px]", an ? (dunkel ? "text-white" : "text-ink-900") : dunkel ? "text-white/70" : "text-ink-700")}>
                    {s.name}
                  </span>
                </span>
              </button>

              <div
                id={`${basis}-p-${i}`}
                role="region"
                aria-labelledby={`${basis}-k-${i}`}
                hidden={!an}
                className="ov-tab-panel mb-3 ml-[72px] mt-1 lg:col-span-full lg:row-start-2 lg:mb-0 lg:ml-0 lg:mt-8"
              >
                <div className={cn("relative overflow-hidden rounded-3xl p-5 md:p-8", dunkel ? "ov-glass" : "bg-white ring-1 ring-ink-200/70 shadow-[0_30px_60px_-45px_rgba(3,18,43,0.5)]")}>
                  <span aria-hidden="true" className={cn("pointer-events-none absolute -right-2 -top-6 hidden font-display text-[120px] font-extrabold leading-none md:block", dunkel ? "text-white/[0.04]" : "text-ink-100")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div className="max-w-3xl">
                      <p className={cn("hidden font-display text-[22px] font-extrabold leading-snug tracking-tight lg:block", dunkel ? "text-white" : "text-ink-900")}>{s.name}</p>
                      <p className={cn("text-[15.5px] leading-relaxed lg:mt-3 lg:text-[16.5px]", dunkel ? "text-white/75" : "text-ink-600")}>{s.text}</p>
                      {s.dauer && <p className={cn("mt-3 text-[13.5px] font-semibold", dunkel ? "text-ov-300" : "text-ov-700")}>{s.dauer}</p>}
                    </div>
                    <div className="hidden gap-2 lg:flex">
                      <button
                        type="button"
                        onClick={() => setAktiv(Math.max(0, i - 1))}
                        disabled={i === 0}
                        aria-label="Vorheriger Schritt"
                        className={cn("flex h-11 w-11 items-center justify-center rounded-full transition-colors disabled:opacity-30", dunkel ? "text-white ring-1 ring-white/20 hover:bg-white/10" : "text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50")}
                      >
                        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAktiv(Math.min(n - 1, i + 1))}
                        disabled={i === n - 1}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-ov-600 px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-ov-700 disabled:opacity-30"
                      >
                        Nächster Schritt
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      </div>
    </div>
  );
}
