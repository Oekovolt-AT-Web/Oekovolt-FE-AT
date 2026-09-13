import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Referenzkarte eines Projekts (Bild mit Kennzahl-Overlay).
 * gross: doppelt so große Kachel im Bento-Raster.
 */
export default function ProjektKarte({ projekt, gross = false, sizes, className, headingAs: H = "h3", priority = false }) {
  const p = projekt;
  return (
    <Link
      href={`/referenzen/projekte/${p.slug}`}
      className={cn(
        "group relative isolate flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-3xl bg-navy-950 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)] ring-1 ring-ink-900/5 transition-shadow duration-500 hover:shadow-[0_30px_60px_-24px_rgba(15,23,42,0.55)]",
        gross ? "sm:min-h-[420px] lg:min-h-[560px]" : "sm:min-h-[340px]",
        className
      )}
    >
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-30 bg-gradient-to-br from-navy-900 to-navy-950" />
      <Image
        src={p.bild}
        alt={`Photovoltaikanlage ${p.titel}${p.leistungText ? ` mit ${p.leistungText}` : ""}`}
        fill
        priority={priority}
        sizes={sizes || (gross ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw")}
        className="-z-20 object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/95 via-navy-950/55 to-navy-950/10 transition-opacity duration-500" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ov-900/0 transition-colors duration-500 group-hover:bg-ov-900/15" />

      {/* Kopfzeile: Leistung + Objektart */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 md:p-5">
        {p.kwp != null ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13.5px] font-bold text-ink-900 shadow-lg">
            <Zap aria-hidden="true" className="h-3.5 w-3.5 fill-sun-400 text-sun-500" />
            <span className="ov-num">{p.leistungText}</span>
          </span>
        ) : (
          <span />
        )}
        {p.segment && (
          <span className="rounded-full bg-navy-950/60 px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/15 backdrop-blur-md">
            {p.segment}
          </span>
        )}
      </div>

      <div className={cn("relative p-5 md:p-6", gross && "lg:p-8")}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-white/70">
          {p.ort && (
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
              {p.ort}
            </span>
          )}
          {p.jahr && <span className="ov-num">{p.jahr}</span>}
        </p>
        <H className={cn("mt-1.5 font-display font-extrabold leading-tight tracking-tight text-white", gross ? "text-[24px] md:text-[30px]" : "text-[20px]")}>
          {p.titel}
        </H>
        {p.typ && <p className="mt-1.5 line-clamp-1 text-[14px] text-white/65">{p.typ}</p>}
        <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-300 transition-colors group-hover:text-white">
          Projekt ansehen
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
