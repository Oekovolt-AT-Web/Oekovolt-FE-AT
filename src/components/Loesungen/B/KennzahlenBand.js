import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

/**
 * Kennzahlenband, das als schwebende Karte über die Unterkante des Heros ragt.
 * Zahlen zählen beim Einblenden hoch (CountUp, Server-HTML enthält den Endwert).
 *
 * items: [{ wert: 750, dezimal?, prefix?, suffix?, text?: "UZ 200", label }]
 *        – `text` statt `wert` für Angaben, die keine Zahl sind (z. B. Datum, Richtlinie).
 * quelle: Quellenzeile unter der Karte
 * ueberlappen: Karte ragt in den Hero (Hero braucht dann mehr Innenabstand unten)
 */
export default function KennzahlenBand({ items = [], quelle, ueberlappen = true, className }) {
  return (
    <section aria-label="Kennzahlen" className={cn("relative z-10", className)}>
      <div className={cn("ov-container", ueberlappen ? "-mt-10 md:-mt-14" : "pt-12 md:pt-16")}>
        <Reveal dir="scale">
          <dl className="grid grid-cols-2 overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70 lg:grid-cols-4">
            {items.map((k, i) => (
              <div
                key={k.label}
                className={cn(
                  "relative p-5 sm:p-7 lg:p-8",
                  i % 2 === 1 && "border-l border-ink-100",
                  i >= 2 && "border-t border-ink-100 lg:border-t-0",
                  i >= 1 && "lg:border-l lg:border-ink-100"
                )}
              >
                <dt className="sr-only">{k.label}</dt>
                <dd className="font-display text-[clamp(1.55rem,1.05rem+1.9vw,2.65rem)] font-extrabold leading-none tracking-tight text-ink-900">
                  {k.text ? (
                    <span className="ov-num">{k.text}</span>
                  ) : (
                    <CountUp value={k.wert} decimals={k.dezimal || 0} prefix={k.prefix || ""} suffix={k.suffix || ""} />
                  )}
                </dd>
                <dd className="mt-3 hyphens-auto text-[13px] leading-snug text-ink-500 [overflow-wrap:anywhere] sm:text-[13.5px]" lang="de">{k.label}</dd>
                <span aria-hidden="true" className="absolute left-5 top-0 h-[3px] w-10 rounded-b-full bg-ov-500/80 sm:left-7 lg:left-8" />
              </div>
            ))}
          </dl>
        </Reveal>
        {quelle && <p className="mt-5 max-w-4xl px-1 text-[12px] leading-relaxed text-ink-400">{quelle}</p>}
      </div>
    </section>
  );
}
