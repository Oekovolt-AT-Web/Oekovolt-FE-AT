import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

/**
 * Kennzahlenband unter dem Seitenkopf: 3–4 große Zahlen mit kurzer Erklärung.
 * items: [{ value: 30, suffix: " MWp", label: "…", quelle? }] oder { wert: "TOP 3", label }
 *   value  → zählt hoch (CountUp, Endwert im Server-HTML)
 *   wert   → feststehender Text (z. B. Jahreszahlen, „TOP 3“)
 * tone: dark (Navy, Standard) | light (Sand)
 */
export default function Kennzahlenband({ items = [], tone = "dark", fussnote, className }) {
  const dunkel = tone === "dark";
  const spalten = items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  return (
    <section
      aria-label="Kennzahlen"
      className={cn("relative isolate overflow-hidden", dunkel ? "ov-noise bg-navy-950 text-white" : "bg-sand-50 text-ink-900", className)}
    >
      {dunkel && (
        <>
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-70" />
          <div aria-hidden="true" className="absolute -left-24 top-1/2 -z-10 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-ov-500/20 blur-[120px]" />
          <div aria-hidden="true" className="absolute -right-24 -top-20 -z-10 h-[280px] w-[280px] rounded-full bg-navy-400/25 blur-[120px]" />
        </>
      )}
      <div className="ov-container py-12 md:py-16">
        <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-10", spalten)}>
          {items.map((k, i) => (
            <Reveal key={k.label} delay={i * 90} className={cn("relative", i > 0 && "lg:pl-8", i > 0 && (dunkel ? "lg:border-l lg:border-white/10" : "lg:border-l lg:border-ink-200"))}>
              <dt className="sr-only">{k.label}</dt>
              <dd className={cn("font-display whitespace-nowrap text-[clamp(1.6rem,1.1rem+2.6vw,3.4rem)] font-extrabold leading-none tracking-[-0.03em]", dunkel ? "text-white" : "text-ink-900")}>
                {k.wert != null ? (
                  <span className="ov-num">{k.wert}</span>
                ) : (
                  <CountUp value={k.value} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} />
                )}
              </dd>
              <dd className={cn("mt-3 max-w-[26ch] text-[14px] leading-snug", dunkel ? "text-white/65" : "text-ink-600")}>{k.label}</dd>
            </Reveal>
          ))}
        </dl>
        {fussnote && <p className={cn("mt-10 text-[12.5px] leading-relaxed", dunkel ? "text-white/45" : "text-ink-500")}>{fussnote}</p>}
      </div>
    </section>
  );
}
