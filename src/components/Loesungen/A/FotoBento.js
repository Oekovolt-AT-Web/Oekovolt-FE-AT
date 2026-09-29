import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

/**
 * Foto-Bento: große Bildkarten mit Text auf dunklem Verlauf.
 * items: [{ titel, text, bild, alt, href?, tag?, icon?, format: "gross" | "breit" | "hoch" | "normal", position? }]
 * Raster: lg 4 Spalten, Zeilenhöhe fest – "gross" = 2×2, "breit" = 2×1, "hoch" = 1×2.
 * spalten={3}: gleichmäßiges 3er-Raster (Formate "breit"/"gross" dann 2 Spalten).
 * Die Seite ist dafür verantwortlich, dass die Formate das Raster lückenlos füllen.
 */
const FORMAT = {
  gross: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  breit: "sm:col-span-2 lg:col-span-2",
  hoch: "lg:row-span-2",
  normal: "",
};

export default function FotoBento({ items = [], spalten = 4, className, zeilenhoehe = spalten === 3 ? "lg:auto-rows-[250px]" : "lg:auto-rows-[232px]" }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 md:gap-5", spalten === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4", zeilenhoehe, className)}>
      {items.map((it, i) => (
        <Reveal key={it.titel} delay={i * 70} className={cn("min-h-[260px] sm:min-h-[280px] lg:min-h-0", FORMAT[it.format || "normal"])}>
          <Karte {...it} gross={it.format === "gross"} />
        </Reveal>
      ))}
    </div>
  );
}

function Karte({ titel, text, bild, alt, href, tag, icon: Icon, gross, position }) {
  const inhalt = (
    <>
      <Image
        src={bild}
        alt={alt || ""}
        fill
        sizes={gross ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
        className="object-cover transition-transform duration-[1400ms] ease-out motion-safe:group-hover:scale-[1.06]"
        style={position ? { objectPosition: position } : undefined}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/45 to-navy-950/0" />
      <div aria-hidden="true" className="absolute inset-0 bg-navy-950/0 transition-colors duration-500 group-hover:bg-navy-950/15" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5 md:p-6">
        {tag ? (
          <span className="ov-glass rounded-full px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wider text-white">{tag}</span>
        ) : Icon ? (
          <span className="ov-glass flex h-10 w-10 items-center justify-center rounded-2xl text-white">
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          </span>
        ) : (
          <span />
        )}
        {href && (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-all duration-300 group-hover:bg-ov-500 group-hover:ring-ov-500">
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </span>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <h3 className={cn("font-display font-bold leading-tight tracking-tight text-white", gross ? "text-[24px] md:text-[30px]" : "text-[19px] md:text-[20px]")}>{titel}</h3>
        {text && (
          <p className={cn("mt-2 leading-relaxed text-white/75", gross ? "max-w-md text-[15.5px]" : "text-[14px]")}>{text}</p>
        )}
      </div>
    </>
  );

  const basis = "group relative block h-full min-h-[inherit] overflow-hidden rounded-[1.75rem] bg-navy-900 shadow-lg shadow-navy-950/10 ring-1 ring-black/5";
  return href ? (
    <Link href={href} className={cn(basis, "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ov-400")}>
      {inhalt}
    </Link>
  ) : (
    <div className={basis}>{inhalt}</div>
  );
}
