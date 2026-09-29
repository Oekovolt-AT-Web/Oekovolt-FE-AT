import { MessageSquareQuote } from "lucide-react";
import { cn } from "@/components/ui/cn";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";

/**
 * Kennzahlenband direkt unter dem Seitenkopf: optional zitierfähige Kurzantwort
 * (GEO – erster Satz beantwortet die Frage) plus Zahlen mit CountUp.
 *
 * props:
 *  frage, children   Kurzantwort (optional)
 *  zahlen            [{ value, decimals?, prefix?, suffix?, text?, label, hinweis? }]
 *                    – `text` ersetzt die Zahl (z. B. „< 500 kWp“), dann ohne CountUp
 *  fussnote          kleine Quellenangabe unter dem Band
 *  dunkel            Navy-Variante
 */
export default function Kennzahlen({ frage, children, zahlen = [], fussnote, dunkel = false, className }) {
  const mitText = Boolean(frage);
  return (
    <section aria-label={frage ? "Kurz beantwortet" : "Kennzahlen"} className={cn("relative overflow-hidden", dunkel ? "bg-navy-950 text-white" : "border-b border-ink-200/70 bg-white", className)}>
      {dunkel && <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />}
      <div className={cn("ov-container relative grid gap-10 py-14 md:py-16", mitText && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16")}>
        {mitText && (
          <Reveal className="min-w-0">
            <p className={cn("inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em]", dunkel ? "text-ov-300" : "text-ov-700")}>
              <MessageSquareQuote aria-hidden="true" className="h-4 w-4" />
              Kurz beantwortet
            </p>
            <h2 className={cn("mt-3 font-display text-[22px] font-extrabold leading-snug tracking-tight md:text-[26px]", dunkel ? "text-white" : "text-ink-900")}>{frage}</h2>
            <div className={cn("mt-4 max-w-[68ch] space-y-3 text-[16px] leading-relaxed md:text-[16.5px]", dunkel ? "text-white/70 [&_strong]:text-white" : "text-ink-600 [&_strong]:text-ink-900")}>{children}</div>
          </Reveal>
        )}
        {zahlen.length > 0 && (
          <div className="min-w-0">
            <dl
              className={cn(
                "grid grid-cols-2 gap-px overflow-hidden rounded-3xl",
                !mitText && zahlen.length >= 4 && "lg:grid-cols-4",
                dunkel ? "bg-white/10 ring-1 ring-white/10" : "bg-ink-200/70 ring-1 ring-ink-200/70"
              )}
            >
              {zahlen.map((z, i) => (
                <Reveal key={z.label} delay={i * 70} className={cn("flex min-w-0 flex-col p-5 md:p-7", dunkel ? "bg-navy-950" : "bg-white")}>
                  <dt className="sr-only">{z.label}</dt>
                  <dd className={cn("font-display text-[clamp(1.35rem,0.95rem+1.9vw,2.6rem)] font-extrabold leading-none tracking-tight", dunkel ? "text-white" : "text-ink-900")}>
                    {z.text ? <span className="ov-num">{z.text}</span> : <CountUp value={z.value} decimals={z.decimals} prefix={z.prefix} suffix={z.suffix} />}
                  </dd>
                  <dd className={cn("mt-3 text-[14px] font-medium leading-snug", dunkel ? "text-white/80" : "text-ink-800")}>{z.label}</dd>
                  {z.hinweis && <dd className={cn("mt-1 text-[12.5px] leading-snug", dunkel ? "text-white/50" : "text-ink-500")}>{z.hinweis}</dd>}
                </Reveal>
              ))}
            </dl>
            {fussnote && <p className={cn("mt-3 text-[12.5px] leading-relaxed", dunkel ? "text-white/50" : "text-ink-500")}>{fussnote}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
