import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

/**
 * Kennzahlenband unter dem Hero: schwebt als weiße Karte über der Bildkante.
 * items: [{ wert: Zahl, dezimal?, vor?, nach?, text?, label }]
 *   – wert als Zahl → CountUp; `text` statt `wert` für nicht zählbare Werte.
 * quelle: Quellenzeile (klein).
 */
export default function KennzahlenBand({ items = [], quelle, className }) {
  return (
    <div className={cn("relative z-10", className)}>
      <div className="ov-container">
        <Reveal
          dir="scale"
          className="relative -mt-8 overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] ring-1 ring-ink-200/70 md:-mt-10"
        >
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ov-400 via-ov-600 to-sun-400" />
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {items.map((k, i) => (
              <div
                key={k.label}
                className={cn(
                  "relative px-5 py-7 md:px-8 md:py-9",
                  i % 2 === 1 && "border-l border-ink-100",
                  i >= 2 && "border-t border-ink-100 lg:border-t-0",
                  i === 2 && "lg:border-l"
                )}
              >
                <dt className="sr-only">{k.label}</dt>
                <dd className="font-display text-[clamp(1.7rem,1.2rem+1.6vw,2.6rem)] font-extrabold leading-none tracking-tight text-ink-900">
                  {typeof k.wert === "number" ? (
                    <CountUp value={k.wert} decimals={k.dezimal || 0} prefix={k.vor || ""} suffix={k.nach || ""} />
                  ) : (
                    <span className="ov-num">{k.text ?? k.wert}</span>
                  )}
                </dd>
                <dd className="mt-3 max-w-[30ch] hyphens-auto text-[13px] leading-snug text-ink-500 [overflow-wrap:anywhere] md:text-[13.5px]">{k.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        {quelle && <p className="mt-4 text-[12px] leading-relaxed text-ink-400 md:px-2">{quelle}</p>}
      </div>
    </div>
  );
}
