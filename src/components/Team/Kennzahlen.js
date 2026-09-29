// src/components/Team/Kennzahlen.js
//
// Kennzahlenband mit CountUp – für /uber-uns, /uber-uns/team und /uber-uns/jobs.
// items: [{ value, prefix, suffix, decimals, label, text }]
// Nur belegte Werte übergeben (siehe docs/AT-BRIEFING.md).

import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

export default function Kennzahlen({ items = [], dunkel = false, klein = false, className }) {
  const drei = items.length === 3;
  const spalten = drei ? "grid-cols-3" : items.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2";
  return (
    <dl className={cn("grid gap-y-10", spalten, className)}>
      {items.map((k, i) => (
        <Reveal
          key={k.label}
          delay={i * 90}
          className={cn(
            drei ? "relative px-2.5 first:pl-0 sm:px-6" : "relative px-4 sm:px-6",
            drei ? i > 0 && "border-l" : [i % 2 === 1 && "border-l", i > 0 && "lg:border-l"],
            dunkel ? "border-white/15" : "border-ink-200"
          )}
        >
          <dt className="sr-only">{k.label}</dt>
          <dd className={cn("whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.03em]", klein ? "text-[clamp(1.45rem,1.1rem+1.6vw,2.6rem)]" : "text-[clamp(2.1rem,1.4rem+2.6vw,3.6rem)]", dunkel ? "text-white" : "text-ink-900")}>
            {typeof k.value === "number" ? (
              <CountUp value={k.value} decimals={k.decimals} prefix={k.prefix} suffix={k.suffix} />
            ) : (
              <span className="ov-num">{k.value}</span>
            )}
          </dd>
          <dd className={cn("mt-3 text-[13px] font-semibold leading-snug sm:text-[14.5px]", dunkel ? "text-white" : "text-ink-900")}>{k.label}</dd>
          {k.text && <dd className={cn("mt-1 text-[13.5px] leading-snug", dunkel ? "text-white/55" : "text-ink-500")}>{k.text}</dd>}
        </Reveal>
      ))}
    </dl>
  );
}
