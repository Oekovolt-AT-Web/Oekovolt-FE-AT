import Image from "next/image";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";

/**
 * Randloses Foto mit Verlauf und Aussage – Rhythmuswechsel zwischen hellen
 * Abschnitten. Optional Punkte als Glaskarten (2–4) und eigener Inhalt.
 *
 * props: bild { src, alt, position? }, eyebrow, titel, text, punkte [{ titel, text, icon? }], rechts, children
 */
export default function Bildband({ bild, eyebrow, titel, text, punkte = [], rechts = false, children, className }) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-navy-950 text-white", className)}>
      <Image src={bild.src} alt={bild.alt || ""} fill sizes="100vw" className="-z-20 object-cover" style={bild.position ? { objectPosition: bild.position } : undefined} />
      <div aria-hidden="true" className={cn("absolute inset-0 -z-10 from-navy-950/95 via-navy-950/70 to-navy-950/15", rechts ? "bg-gradient-to-l" : "bg-gradient-to-r")} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/85 via-transparent to-navy-950/30" />
      <div className="ov-container flex min-h-[540px] flex-col justify-center py-20 md:min-h-[600px] md:py-24">
        <Reveal className={cn("max-w-2xl", rechts && "lg:ml-auto")}>
          {eyebrow && (
            <Eyebrow dark className="mb-4">
              {eyebrow}
            </Eyebrow>
          )}
          <h2 className="ov-h2 text-white">{titel}</h2>
          {text && <p className="ov-lead mt-5 text-white/75">{text}</p>}
        </Reveal>
        {punkte.length > 0 && (
          <ul className={cn("mt-10 grid max-w-4xl gap-3 sm:grid-cols-2", punkte.length >= 3 && "lg:grid-cols-3", punkte.length === 4 && "lg:grid-cols-4 lg:max-w-none", rechts && "lg:ml-auto")}>
            {punkte.map((p, i) => (
              <Reveal as="li" key={p.titel} delay={100 + i * 80} className="ov-glass rounded-2xl p-5">
                <p className="flex items-center gap-2.5 font-display text-[16.5px] font-bold text-white">
                  {p.icon && <p.icon aria-hidden="true" className="h-4.5 w-4.5 shrink-0 text-ov-300" />}
                  {p.titel}
                </p>
                {p.text && <p className="mt-1.5 text-[14.5px] leading-relaxed text-white/70">{p.text}</p>}
              </Reveal>
            ))}
          </ul>
        )}
        {children}
      </div>
    </section>
  );
}
