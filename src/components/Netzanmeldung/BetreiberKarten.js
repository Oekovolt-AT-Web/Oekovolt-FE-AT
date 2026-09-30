import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Hash, MonitorSmartphone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";
import { betreiberPfad } from "@/data/netzbetreiber";

/**
 * Karten der Netzbetreiber (Server). Gleiche Struktur für alle – keine Logos,
 * Regionsfoto als Bild. `aktiv` blendet den aktuellen Betreiber aus.
 */
export default function BetreiberKarten({ betreiber = [], aktiv, kompakt = false, className }) {
  const liste = betreiber.filter((b) => b.slug !== aktiv);
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2", kompakt ? "lg:grid-cols-4" : "lg:grid-cols-6", className)}>
      {liste.map((b, i) => (
        <Reveal
          as="li"
          key={b.slug}
          delay={(i % 3) * 80}
          className={cn("flex", !kompakt && (i < 3 ? "lg:col-span-2" : "lg:col-span-3"), !kompakt && i === liste.length - 1 && liste.length % 2 === 1 && "sm:col-span-2 lg:col-span-3")}
        >
          <article className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 focus-within:ring-2 focus-within:ring-ov-500">
            <div className={cn("relative overflow-hidden", kompakt ? "aspect-[16/9]" : "aspect-[16/8]")}>
              <Image
                src={b.bild.src}
                alt=""
                fill
                sizes={kompakt ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
              <p className="absolute bottom-4 left-5 right-5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white/75">{b.bundesland}</p>
            </div>
            <div className="flex flex-1 flex-col p-5 md:p-6">
              <h3 className="font-display text-[20px] font-extrabold leading-snug text-ink-900">
                <Link href={betreiberPfad(b.slug)} className="outline-none after:absolute after:inset-0 after:content-['']">
                  {b.kurz}
                </Link>
              </h3>
              {!kompakt && <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-ink-600">{b.gebiet}</p>}
              <dl className="mt-4 space-y-2 text-[13.5px]">
                <div className="flex items-start gap-2">
                  <dt className="sr-only">Portal</dt>
                  <MonitorSmartphone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                  <dd className="text-ink-700">{b.portal.name}</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="sr-only">Einspeisezählpunkt</dt>
                  <Hash aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                  <dd className="text-ink-700">Einspeisezählpunkt {b.eckdaten.zaehlpunkt}</dd>
                </div>
              </dl>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[14.5px] font-semibold text-ov-700">
                Ablauf & Unterlagen
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}
