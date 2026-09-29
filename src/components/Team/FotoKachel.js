// src/components/Team/FotoKachel.js
//
// Große Fotokarte mit Verlauf und Text unten – für Foto-Bentos auf den
// Unternehmensseiten (/uber-uns, /uber-uns/team, /uber-uns/jobs, /sponsoring).
// Mit `href` ist die ganze Karte ein Link.

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/components/ui/cn";

export default function FotoKachel({ href, bild, kopf, titel, text, icon: Icon, sizes = "(max-width: 768px) 100vw, 33vw", className, as: Ueberschrift = "h3", children }) {
  const inhalt = (
    <>
      {bild?.src && (
        <Image
          src={bild.src}
          alt={bild.alt || ""}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          style={bild.pos ? { objectPosition: bild.pos } : undefined}
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/65 to-navy-950/0" />
      <div aria-hidden="true" className="absolute inset-0 bg-ov-900/0 transition-colors duration-500 group-hover:bg-ov-900/10" />
      <div className="relative mt-auto p-6 md:p-7">
        {(kopf || Icon) && (
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">
            {Icon && (
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
            )}
            {kopf}
          </p>
        )}
        <Ueberschrift className="mt-3 flex items-start justify-between gap-3 font-display text-[clamp(1.2rem,1.05rem+0.5vw,1.5rem)] font-extrabold leading-tight text-white">
          {titel}
          {href && (
            <ArrowUpRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-white/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
          )}
        </Ueberschrift>
        {text && <p className="mt-2 line-clamp-3 max-w-md text-[14.5px] leading-relaxed text-white/80">{text}</p>}
        {children}
      </div>
    </>
  );

  const klassen = cn(
    "group relative isolate flex min-h-[260px] flex-col overflow-hidden rounded-[1.75rem] bg-navy-900 shadow-[0_20px_50px_-30px_rgba(3,18,43,0.6)]",
    href && "ov-card-hover",
    className
  );

  return href ? (
    <Link href={href} className={klassen}>
      {inhalt}
    </Link>
  ) : (
    <div className={klassen}>{inhalt}</div>
  );
}
