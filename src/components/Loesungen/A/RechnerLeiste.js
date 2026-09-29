import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

/**
 * Leiste mit Werkzeugen/Rechnern und Services zum Weiterklicken.
 * items: [{ icon, titel, text, href, tag? }]
 */
export default function RechnerLeiste({ eyebrow = "Selbst rechnen", titel, text, items = [], kompakt = false, mini = false, spaltenKlasse, className }) {
  const spalten = items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : items.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={className}>
      {(titel || text) && (
        <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="max-w-2xl">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">{eyebrow}</p>
            {titel && <h2 className="ov-h2 mt-3 text-ink-900">{titel}</h2>}
          </div>
          {text && <p className="max-w-md text-[15.5px] leading-relaxed text-ink-600">{text}</p>}
        </div>
      )}
      <ul className={cn("grid gap-4 md:gap-5", spaltenKlasse || spalten, kompakt && "gap-3 md:gap-3")}>
        {items.map((it, i) => (
          <Reveal as="li" key={it.href} delay={i * 70} className="flex">
            {kompakt ? (
              <Link
                href={it.href}
                className={cn("group ov-card-hover relative flex w-full gap-4 rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-300", mini ? "items-center rounded-2xl px-4 py-3" : "items-start p-5")}
              >
                <span className={cn("flex shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-600 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white", mini ? "h-10 w-10 rounded-xl" : "h-11 w-11")}>
                  {it.icon && <it.icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-[16.5px] font-bold leading-snug text-ink-900">{it.titel}</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  {!mini && <span className="mt-1 block text-[14px] leading-snug text-ink-600">{it.text}</span>}
                </span>
              </Link>
            ) : (
            <Link
              href={it.href}
              className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 hover:ring-ov-300 md:p-7"
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-ov-400 to-sun-400 transition-transform duration-500 group-hover:scale-x-100" />
              <span className="flex items-center justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-50 text-ov-600 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white">
                  {it.icon && <it.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />}
                </span>
                {it.tag && <span className="rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-600">{it.tag}</span>}
              </span>
              <h3 className="mt-5 font-display text-[18px] font-bold leading-snug text-ink-900">{it.titel}</h3>
              <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-600">{it.text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-700">
                Öffnen
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
            )}
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
