import Image from "next/image";
import { cn } from "@/components/ui/cn";

/**
 * Foto mit schwebender Kennzahlkarte – als `aside` für SplitMedia.
 * bild { src, alt, position? }, titel (kleine Überschrift der Karte),
 * werte [{ wert, label }] (2–3 Stück), fuss (kurzer Hinweis), seite: "links" | "rechts"
 */
export default function FotoKennzahl({ bild, titel, werte = [], fuss, seite = "rechts", format = "aspect-[4/3]", className }) {
  return (
    <div className={cn("relative pb-10 md:pb-0", className)}>
      <div aria-hidden="true" className={cn("absolute -inset-3 rounded-[2.25rem] bg-ov-100/60 md:-inset-4", seite === "rechts" ? "-rotate-2" : "rotate-2")} />
      <div className={cn("relative overflow-hidden rounded-[2rem] bg-ink-100 shadow-xl", format)}>
        <Image src={bild.src} alt={bild.alt || ""} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-[1400ms] motion-safe:hover:scale-[1.04]" style={bild.position ? { objectPosition: bild.position } : undefined} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
      </div>
      {werte.length > 0 && (
        <div
          className={cn(
            "absolute -bottom-2 left-4 right-4 rounded-3xl bg-white/95 p-5 shadow-2xl ring-1 ring-ink-100 backdrop-blur motion-safe:animate-ov-float sm:left-auto sm:right-auto sm:w-[390px] md:-bottom-8 md:p-6",
            seite === "rechts" ? "sm:right-6 md:-right-6" : "sm:left-6 md:-left-6"
          )}
        >
          {titel && <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">{titel}</p>}
          <dl className={cn("mt-3 grid gap-3 sm:gap-4", werte.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
            {werte.map((w) => (
              <div key={w.label}>
                <dt className="sr-only">{w.label}</dt>
                <dd className="ov-num whitespace-nowrap font-display text-[17px] font-extrabold leading-none tracking-tight text-ink-900 sm:text-[20px] md:text-[22px]">{w.wert}</dd>
                <dd className="mt-1.5 text-[12px] leading-snug text-ink-500">{w.label}</dd>
              </div>
            ))}
          </dl>
          {fuss && <p className="mt-3 border-t border-ink-100 pt-3 text-[11.5px] leading-snug text-ink-400">{fuss}</p>}
        </div>
      )}
    </div>
  );
}
