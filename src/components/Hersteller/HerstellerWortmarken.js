import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Marquee from "@/components/ui/Marquee";
import { cn } from "@/components/ui/cn";
import { PARTNER } from "./partner";

/**
 * Laufband der Hersteller mit belegter Zusammenarbeit – als Wortmarken in unserer
 * Hausschrift statt als Logo-Dateien (keine Freigabe für Markenlogos Dritter).
 * Server-Komponente; das Laufband selbst (ui/Marquee) pausiert bei Hover/Fokus
 * und steht bei reduzierter Bewegung still.
 *
 * props:
 *  titel   – Überzeile über dem Band
 *  fokus   – Rollen, die hervorgehoben werden (z. B. ["Batteriespeicher"])
 *  dunkel  – Variante auf Navy-Grund
 */
export default function HerstellerWortmarken({ titel = "Komponenten von Herstellern, mit denen wir zusammenarbeiten", fokus = [], dunkel = false, className }) {
  const hervor = (p) => fokus.length > 0 && fokus.some((f) => p.rolle.toLowerCase().includes(f.toLowerCase()) || p.slug === f);
  return (
    <div className={cn("border-y py-8 md:py-10", dunkel ? "border-white/10 bg-navy-950" : "border-ink-100 bg-white", className)}>
      <div className="ov-container mb-6 flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
        <p className={cn("text-[12.5px] font-semibold uppercase tracking-[0.16em]", dunkel ? "text-white/55" : "text-ink-500")}>{titel}</p>
        <Link
          href="/produkte/hersteller"
          className={cn("group inline-flex min-h-11 items-center gap-1.5 text-[13.5px] font-semibold", dunkel ? "text-ov-300 hover:text-ov-200" : "text-ov-700 hover:text-ov-800")}
        >
          Alle Hersteller
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <Marquee speed={38} fade={dunkel ? "from-navy-950" : "from-white"}>
        {PARTNER.map((p) => (
          <div key={p.slug} className="group/wm flex items-center gap-12 md:gap-16">
            <div className="flex flex-col items-start leading-none">
              <span
                className={cn(
                  "font-display text-[28px] font-extrabold tracking-[-0.03em] transition-colors duration-300 md:text-[34px]",
                  dunkel
                    ? hervor(p)
                      ? "text-white"
                      : "text-white/45 group-hover/wm:text-white"
                    : hervor(p)
                      ? "text-ink-900"
                      : "text-ink-300 group-hover/wm:text-ink-900"
                )}
              >
                {p.title}
              </span>
              <span className={cn("mt-2 text-[11px] font-semibold uppercase tracking-[0.18em]", dunkel ? "text-ov-300/80" : "text-ov-700/80")}>{p.rolle}</span>
            </div>
            <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", dunkel ? "bg-white/20" : "bg-ink-200")} />
          </div>
        ))}
      </Marquee>
    </div>
  );
}
