import { MessageSquareQuote } from "lucide-react";
import { cn } from "@/components/ui/cn";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";

/**
 * Kurzantwort (GEO: erster Satz beantwortet die Frage) plus Kennzahlenband mit
 * CountUp – ersetzt die frühere reine Textbox direkt unter dem Seitenkopf.
 *
 * props:
 *  frage     die implizite Suchfrage (h2)
 *  children  2–4 Sätze Antwort
 *  zahlen    [{ value, decimals?, prefix?, suffix?, label, text? }] – nur belegte Werte
 *  dunkel    Navy-Variante (für Technik-Seiten)
 */
export default function AntwortBand({ frage, children, zahlen = [], dunkel = false, className }) {
  return (
    <section aria-label="Kurz beantwortet" className={cn("relative overflow-hidden", dunkel ? "bg-navy-950 text-white" : "border-b border-ink-200/70 bg-white", className)}>
      {dunkel && <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />}
      <div className="ov-container relative grid gap-10 py-14 md:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <Reveal className="min-w-0">
          <p className={cn("inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em]", dunkel ? "text-ov-300" : "text-ov-700")}>
            <MessageSquareQuote aria-hidden="true" className="h-4 w-4" />
            Kurz beantwortet
          </p>
          <h2 className={cn("mt-3 font-display text-[22px] font-extrabold leading-snug tracking-tight md:text-[26px]", dunkel ? "text-white" : "text-ink-900")}>{frage}</h2>
          <div className={cn("mt-4 max-w-[68ch] space-y-3 text-[16px] leading-relaxed md:text-[16.5px]", dunkel ? "text-white/70 [&_strong]:text-white" : "text-ink-600 [&_strong]:text-ink-900")}>{children}</div>
        </Reveal>
        {zahlen.length > 0 && (
          <dl className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-3xl", dunkel ? "bg-white/10 ring-1 ring-white/10" : "bg-ink-200/70 ring-1 ring-ink-200/70")}>
            {zahlen.map((z, i) => (
              <Reveal key={z.label} delay={i * 80} className={cn("flex min-w-0 flex-col p-5 md:p-6", dunkel ? "bg-navy-950/90" : "bg-white")}>
                <dt className="sr-only">{z.label}</dt>
                <dd className={cn("font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.6rem)] font-extrabold leading-none tracking-tight", dunkel ? "text-white" : "text-ink-900")}>
                  {typeof z.value === "number" ? <CountUp value={z.value} decimals={z.decimals} prefix={z.prefix} suffix={z.suffix} /> : <span className="ov-num">{z.value}</span>}
                </dd>
                <dd className={cn("mt-2.5 text-[13.5px] font-semibold leading-snug", dunkel ? "text-white/85" : "text-ink-800")}>{z.label}</dd>
                {z.text && <dd className={cn("mt-1 text-[12.5px] leading-snug", dunkel ? "text-white/50" : "text-ink-500")}>{z.text}</dd>}
              </Reveal>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
