import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

const de = (n) => Number(n).toLocaleString("de-DE");

/**
 * Animierte Rangliste (horizontale Balken) – Server-Komponente.
 * Die Balken wachsen beim Scrollen (Reveal), bei reduzierter Bewegung stehen sie sofort.
 * items: [{ name, wert, href?, sub?, hervor? }], einheit, basis (Startwert der Achse)
 */
export default function ErtragBalken({ items = [], einheit = "kWh/kWp", basis, className }) {
  const max = Math.max(...items.map((i) => i.wert));
  const min = basis ?? Math.floor((Math.min(...items.map((i) => i.wert)) * 0.85) / 50) * 50;
  return (
    <Reveal as="ol" className={cn("space-y-2.5", className)}>
      {items.map((it, i) => {
        const anteil = ((it.wert - min) / (max - min)) * 100;
        const Inhalt = (
          <>
            <span className="hidden w-7 shrink-0 text-right text-[12.5px] font-semibold text-ink-400 ov-num sm:block">{i + 1}</span>
            <span className="w-24 shrink-0 sm:w-32 md:w-40">
              <span className="block truncate text-[15px] font-semibold text-ink-900 group-hover:text-ov-700">{it.name}</span>
              {it.sub && <span className="block truncate text-[12px] text-ink-500">{it.sub}</span>}
            </span>
            <span className="relative h-7 min-w-0 flex-1 overflow-hidden rounded-lg bg-ink-100/70 sm:h-9 sm:rounded-xl">
              <span
                className={cn(
                  "absolute inset-y-0 left-0 origin-left rounded-xl transition-transform duration-[1400ms] ease-out motion-safe:[.js-ready_.ov-reveal:not(.is-visible)_&]:scale-x-0",
                  it.hervor ? "bg-gradient-to-r from-ov-600 to-sun-400" : "bg-gradient-to-r from-navy-700 to-ov-500"
                )}
                style={{ width: `${Math.max(anteil, 6)}%`, transitionDelay: `${i * 70}ms` }}
              />
            </span>
            <span className="ov-num w-14 shrink-0 text-right text-[14px] font-bold text-ink-900 sm:w-28">
              {de(it.wert)} <span className="hidden text-[12px] font-medium text-ink-500 sm:inline">{einheit}</span>
            </span>
          </>
        );
        return (
          <li key={it.name}>
            {it.href ? (
              <Link href={it.href} className="group flex items-center gap-3 rounded-xl py-0.5 md:gap-4">
                {Inhalt}
              </Link>
            ) : (
              <div className="flex items-center gap-3 md:gap-4">{Inhalt}</div>
            )}
          </li>
        );
      })}
    </Reveal>
  );
}
