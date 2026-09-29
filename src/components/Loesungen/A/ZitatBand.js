import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/components/ui/cn";

/**
 * Vollbreites Fotoband mit Aussage und Kennwerten (Glas-Karten) – für Haltung/Erfahrung.
 * bild { src, alt, position? }, eyebrow, titel, text, fakten [{ icon?, titel, text }]
 */
export default function ZitatBand({ id, bild, eyebrow, titel, text, fakten = [], children }) {
  return (
    <section id={id} className="relative isolate scroll-mt-24 overflow-hidden bg-navy-950 text-white">
      <Image src={bild.src} alt={bild.alt || ""} fill sizes="100vw" className="-z-20 object-cover" style={bild.position ? { objectPosition: bild.position } : undefined} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/35" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
      <div className={cn("ov-container grid gap-10 pt-20 md:pt-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16", children ? "pb-14 md:pb-16" : "pb-20 md:pb-24")}>
        <Reveal>
          {eyebrow && <Eyebrow dark className="mb-5">{eyebrow}</Eyebrow>}
          <h2 className="font-display text-[clamp(2rem,1.3rem+2.6vw,3.4rem)] font-extrabold leading-[1.05] tracking-tight">
            <span aria-hidden="true" className="mr-1 text-ov-300">„</span>
            {titel}
            <span aria-hidden="true" className="text-ov-300">“</span>
          </h2>
          {text && <p className="ov-lead mt-6 max-w-2xl text-white/75">{text}</p>}
        </Reveal>
        {fakten.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {fakten.map((f, i) => (
              <Reveal key={f.titel} delay={120 + i * 90} className="ov-glass flex items-start gap-4 rounded-2xl p-5">
                {f.icon && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ov-500/25 text-ov-200">
                    <f.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                )}
                <div>
                  <p className="font-display text-[17px] font-bold">{f.titel}</p>
                  <p className="mt-1 text-[14px] leading-snug text-white/70">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
      {children && <div className="ov-container pb-20 md:pb-24">{children}</div>}
    </section>
  );
}
