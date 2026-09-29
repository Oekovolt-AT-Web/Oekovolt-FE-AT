import { ChevronDown } from "lucide-react";
import { cn } from "@/components/ui/cn";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";

/**
 * Premium-Bausteine (Server) für den Förderbereich: Kennzahlenband mit
 * CountUp, Fachdetail-Akkordeon, Bildnachweis.
 */

/**
 * Kennzahlenband unter dem Hero.
 * items: [{ value?: number, decimals?, prefix?, suffix?, text?: string, label, hinweis? }]
 * Mit `value` zählt die Zahl hoch; sonst wird `text` angezeigt.
 */
export function KennzahlenBand({ items = [], ton = "white" }) {
  const dunkel = ton === "navy";
  return (
    <div className={cn("relative border-b", dunkel ? "border-white/10 bg-navy-950 text-white" : "border-ink-200/70 bg-white")}>
      <dl className={cn("ov-container grid grid-cols-2 gap-y-7 py-8 md:py-11", items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4")}>
        {items.map((k, i) => (
          <Reveal key={k.label} delay={i * 80} className={cn("pr-3 md:px-7 md:first:pl-0", i > 0 && (dunkel ? "md:border-l md:border-white/10" : "md:border-l md:border-ink-200"))}>
            <dt className="sr-only">{k.label}</dt>
            <dd className={cn("font-display text-[clamp(1.7rem,1.2rem+1.7vw,2.6rem)] font-extrabold leading-none tracking-tight", dunkel ? "text-white" : "text-ink-900")}>
              {typeof k.value === "number" ? (
                <CountUp value={k.value} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} />
              ) : (
                <span className="ov-num">{k.text}</span>
              )}
            </dd>
            <dd className={cn("mt-2.5 text-[13.5px] leading-snug", dunkel ? "text-white/60" : "text-ink-500")}>{k.label}</dd>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}

/**
 * Aufklappbarer Fachteil („Für Technik & Einkauf“). Inhalt ist server-gerendert
 * und bleibt im DOM – nur visuell eingeklappt.
 */
export function Fachdetails({ titel = "Für Technik & Einkauf", untertitel, children, className, offen = false, dark = false }) {
  return (
    <details open={offen} className={cn("group rounded-3xl transition-colors", dark ? "bg-white/[0.04] ring-1 ring-white/10 open:bg-white/[0.06]" : "bg-white ring-1 ring-ink-200/70 open:shadow-[0_30px_60px_-45px_rgba(3,18,43,0.45)]", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 outline-none focus-visible:ring-2 focus-visible:ring-ov-500 md:px-7 md:py-5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className={cn("block font-display text-[17px] font-bold leading-snug md:text-[18px]", dark ? "text-white" : "text-ink-900")}>{titel}</span>
          {untertitel && <span className={cn("mt-0.5 block text-[13.5px] leading-snug", dark ? "text-white/55" : "text-ink-500")}>{untertitel}</span>}
        </span>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-open:rotate-180", dark ? "bg-white/10 text-white group-open:bg-ov-500" : "bg-ink-100 text-ink-700 group-open:bg-ov-500 group-open:text-white")}>
          <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </span>
      </summary>
      <div className="px-5 pb-6 md:px-7 md:pb-8">{children}</div>
    </details>
  );
}

/** Bildnachweis für CC-Lizenzen. items: [{ motiv, urheber, lizenz, href }] */
export function Bildnachweis({ items = [], className }) {
  if (!items.length) return null;
  return (
    <p className={cn("ov-container pb-6 text-[12px] leading-relaxed text-ink-400", className)}>
      Bildnachweis:{" "}
      {items.map((b, i) => (
        <span key={b.href}>
          {i > 0 && " · "}
          {b.motiv}: {b.urheber},{" "}
          <a href={b.href} target="_blank" rel="noopener noreferrer license" className="underline decoration-ink-300 hover:text-ink-600">
            {b.lizenz}
          </a>
        </span>
      ))}
    </p>
  );
}

/** Weiche Lichtflecken für dunkle Sektionen (dekorativ). */
export function Glow({ className }) {
  return (
    <>
      <div aria-hidden="true" className={cn("ov-grid-bg pointer-events-none absolute inset-0", className)} />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/4 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-navy-400/25 blur-[120px]" />
    </>
  );
}
