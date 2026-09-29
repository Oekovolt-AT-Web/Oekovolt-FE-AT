import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

/**
 * Kompakter Ablauf als Zeitleiste (bis zu 6 Schritte in einer Reihe ab xl).
 * items: [{ icon?, title, text }]
 */
export default function AblaufLeiste({ items = [], tone = "light", className }) {
  const dunkel = tone === "dark";
  const xl = items.length >= 6 ? "xl:grid-cols-6" : items.length === 5 ? "xl:grid-cols-5" : "xl:grid-cols-4";
  return (
    <div className={cn("relative", className)}>
      <div aria-hidden="true" className={cn("absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent to-transparent xl:block", dunkel ? "via-white/25" : "via-ov-300")} />
      <ol className={cn("relative grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3", xl)}>
      {items.map((s, i) => {
        const Icon = s.icon;
        return (
          <Reveal as="li" key={s.title} delay={i * 90} className="relative">
            <div className="flex">
              <span className={cn("relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md", dunkel ? "bg-ov-600 text-white shadow-ov-900/40" : "bg-white text-ov-600 ring-1 ring-ov-200")}>
                {Icon ? <Icon aria-hidden="true" className="h-5 w-5" /> : <span className="font-display text-[15px] font-extrabold">{i + 1}</span>}
              </span>
            </div>
            <h3 className={cn("mt-4 font-display text-[17.5px] font-bold leading-snug", dunkel ? "text-white" : "text-ink-900")}><span className={cn("mr-1.5 text-[13px]", dunkel ? "text-ov-300" : "text-ov-700")}>{String(i + 1).padStart(2, "0")}</span>{s.title}</h3>
            <p className={cn("mt-2 text-[14.5px] leading-relaxed", dunkel ? "text-white/65" : "text-ink-600")}>{s.text}</p>
          </Reveal>
        );
      })}
      </ol>
    </div>
  );
}
