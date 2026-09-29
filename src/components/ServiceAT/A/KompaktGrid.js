import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * Kompaktes Kartenraster (Icon neben Titel) für Fachinhalte in Tabs und
 * Akkordeons – deutlich niedriger als FeatureGrid, besonders mobil.
 * items: [{ icon: LucideIcon, title, text }]
 */
export default function KompaktGrid({ items = [], className }) {
  return (
    <ul className={cn("grid gap-3 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((it, i) => (
        <Reveal as="li" key={it.title} delay={(i % 3) * 60} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/70">
          <p className="flex items-center gap-3 font-display text-[16.5px] font-bold leading-snug text-ink-900">
            {it.icon && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600">
                <it.icon aria-hidden="true" className="h-[18px] w-[18px]" />
              </span>
            )}
            {it.title}
          </p>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-600">{it.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}
