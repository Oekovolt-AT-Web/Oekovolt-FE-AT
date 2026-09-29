import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

/**
 * Foto-Bento: große Bildkarten mit Text auf dunklem Verlauf.
 * items: [{ bild, alt, titel, text, href?, eyebrow?, position? }]
 * layout:
 *  - "bento"  (Standard) erstes Bild groß (2×2), die übrigen klein – ideal für 3 oder 5 Karten
 *  - "reihe"  gleich große Karten nebeneinander (2–4)
 */
export default function FotoBento({ items = [], layout = "bento", className }) {
  const bento = layout === "bento";
  const n = items.length;
  const raster = bento
    ? n >= 5
      ? "md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2"
      : "md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
    : n === 2
      ? "md:grid-cols-2"
      : n === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-3";
  return (
    <ul className={cn("grid auto-rows-[minmax(260px,auto)] gap-4 md:gap-5", raster, className)}>
      {items.map((it, i) => {
        const gross = bento && i === 0;
        const Inhalt = (
          <>
            <Image
              src={it.bild}
              alt={it.alt || ""}
              fill
              sizes={gross ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"}
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              style={it.position ? { objectPosition: it.position } : undefined}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/75 via-45% to-navy-950/10" />
            <div className={cn("relative mt-auto p-6 text-white", gross && "md:p-9")}>
              {it.eyebrow && <p className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">{it.eyebrow}</p>}
              <h3 className={cn("font-display font-extrabold leading-tight tracking-tight [text-shadow:0_1px_12px_rgba(3,8,20,0.6)]", gross ? "text-[24px] md:text-[32px]" : "text-[19px] md:text-[20px]")}>{it.titel}</h3>
              {it.text && <p className={cn("mt-2 leading-relaxed text-white/85 [text-shadow:0_1px_8px_rgba(3,8,20,0.55)]", gross ? "max-w-md text-[15.5px]" : "line-clamp-4 text-[14px]")}>{it.text}</p>}
            </div>
            {it.href && (
              <span aria-hidden="true" className="ov-glass absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            )}
          </>
        );
        const klasse = cn(
          "group relative isolate flex h-full min-h-[260px] flex-col overflow-hidden rounded-3xl bg-navy-900 shadow-lg ring-1 ring-black/5",
          gross && "min-h-[380px] md:min-h-[540px]"
        );
        return (
          <Reveal as="li" key={it.titel} delay={i * 80} className={cn("flex", gross && "md:col-span-2 lg:row-span-2")}>
            {it.href ? (
              <Link href={it.href} className={cn(klasse, "w-full")}>
                {Inhalt}
              </Link>
            ) : (
              <div className={cn(klasse, "w-full")}>{Inhalt}</div>
            )}
          </Reveal>
        );
      })}
    </ul>
  );
}
