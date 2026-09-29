import Image from "next/image";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";

/**
 * Bildband: randloses Foto mit Verlauf und Aussage – Rhythmuswechsel zwischen
 * hellen Abschnitten. Optional Punkte als Glaskarten.
 *
 * props: bild { src, alt, position? }, eyebrow, titel, text, punkte [{ titel, text }], nachweis
 */
export default function Bildband({ bild, eyebrow, titel, text, punkte = [], nachweis, rechts = false, className }) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-navy-950 text-white", className)}>
      <Image src={bild.src} alt={bild.alt || ""} fill sizes="100vw" className="-z-20 object-cover" style={bild.position ? { objectPosition: bild.position } : undefined} />
      <div aria-hidden="true" className={cn("absolute inset-0 -z-10", rechts ? "bg-gradient-to-l" : "bg-gradient-to-r", "from-navy-950/95 via-navy-950/70 to-navy-950/10")} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
      <div className="ov-container flex min-h-[520px] flex-col justify-center py-20 md:min-h-[580px] md:py-24">
        <Reveal className={cn("max-w-2xl lg:max-w-[46rem]", rechts && "ml-auto")}>
          {eyebrow && <Eyebrow dark className="mb-4">{eyebrow}</Eyebrow>}
          <h2 className="ov-h2 text-white">{titel}</h2>
          {Array.isArray(text) ? (
            <div className="mt-5 space-y-4 text-[16.5px] leading-relaxed text-white/75">
              {text.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          ) : (
            text && <p className="ov-lead mt-5 text-white/75">{text}</p>
          )}
        </Reveal>
        {punkte.length > 0 && (
          <ul className={cn("mt-10 grid gap-3 sm:grid-cols-2", punkte.length === 3 ? "max-w-5xl lg:grid-cols-3" : "max-w-4xl lg:grid-cols-4", rechts && "ml-auto")}>
            {punkte.map((p, i) => (
              <Reveal as="li" key={p.titel} delay={i * 80} className="ov-glass rounded-2xl p-4">
                <p className="font-display text-[15.5px] font-bold leading-snug text-white">{p.titel}</p>
                {p.text && <p className="mt-1 text-[13.5px] leading-snug text-white/65">{p.text}</p>}
              </Reveal>
            ))}
          </ul>
        )}
        {nachweis && <p className="mt-8 text-[11.5px] text-white/40">{nachweis}</p>}
      </div>
    </section>
  );
}
