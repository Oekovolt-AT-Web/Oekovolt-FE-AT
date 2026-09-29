import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

// Raster auf großen Bildschirmen: 4 Spalten, Zeilen à 250 px. Muster je Kartenanzahl,
// so dass nie eine verwaiste Einzelkarte in der letzten Reihe steht.
const MUSTER = {
  3: ["lg:col-span-2 lg:row-span-2", "lg:col-span-2", "lg:col-span-2"],
  4: ["lg:col-span-2 lg:row-span-2", "lg:col-span-2", "", ""],
  5: ["lg:col-span-2 lg:row-span-2", "", "", "lg:col-span-2", "lg:col-span-2"],
  6: ["lg:col-span-2 lg:row-span-2", "lg:col-span-2", "", "", "lg:col-span-2", "lg:col-span-2"],
};

/**
 * Foto-Bento: große Bildkarten mit Verlauf, Titel und Kurztext.
 * items: [{ bild, alt, titel, text, href?, tag?, position? }]
 */
export default function FotoBento({ items = [], className }) {
  const muster = MUSTER[items.length] || [];
  return (
    <div className={cn("grid auto-rows-[300px] gap-4 sm:grid-cols-2 md:gap-5 lg:auto-rows-[250px] lg:grid-cols-4", className)}>
      {items.map((it, i) => (
        <Reveal
          key={it.titel}
          delay={(i % 4) * 80}
          dir="scale"
          className={cn(
            "min-h-0",
            muster[i],
            i === 0 && "sm:col-span-2 lg:col-span-2",
            // Zweispaltig (Tablet): letzte Karte über die volle Breite, falls sonst verwaist
            i === items.length - 1 && (items.length - 1) % 2 === 1 && cn("sm:col-span-2", muster[i] || "lg:col-span-1")
          )}
        >
          <BentoKarte {...it} gross={i === 0} />
        </Reveal>
      ))}
    </div>
  );
}

function BentoKarte({ bild, alt, titel, text, href, tag, position, gross }) {
  const inhalt = (
    <>
      <Image
        src={bild}
        alt={alt || ""}
        fill
        sizes={gross ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        style={position ? { objectPosition: position } : undefined}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/35 to-navy-950/0 transition-opacity duration-500 group-hover:from-navy-950/95" />
      {tag && (
        <span className="ov-glass absolute left-5 top-5 rounded-full px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/90">{tag}</span>
      )}
      {href && (
        <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-all duration-300 group-hover:bg-ov-500 group-hover:ring-ov-500">
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
        <h3 className={cn("font-display font-bold leading-tight tracking-tight text-white", gross ? "text-[24px] md:text-[30px]" : "text-[19px] md:text-[20px]")}>{titel}</h3>
        {text && (
          <p className={cn("mt-2 max-w-xl text-[14.5px] leading-relaxed text-white/75", gross ? "md:text-[15.5px]" : "line-clamp-3")}>{text}</p>
        )}
      </div>
    </>
  );
  const basis = "group relative block h-full overflow-hidden rounded-[2rem] bg-navy-900 shadow-lg ring-1 ring-ink-900/5";
  return href ? (
    <Link href={href} className={cn(basis, "focus-visible:ring-2 focus-visible:ring-ov-500")}>
      {inhalt}
    </Link>
  ) : (
    <div className={basis}>{inhalt}</div>
  );
}
