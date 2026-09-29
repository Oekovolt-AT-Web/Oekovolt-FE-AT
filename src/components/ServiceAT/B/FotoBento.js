import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * Foto-Bento: große Bildkarte plus kleinere Karten, ohne verwaiste Einzelkarte.
 * Das Raster richtet sich nach der Anzahl (3, 4, 5 oder 6 Karten).
 *
 * items: [{ bild?: { src, alt, position? }, icon?, titel, text, href?, tag? }]
 * Karten ohne Bild erscheinen als dunkle bzw. grüne Textkarte (ton: "navy" | "gruen" | "hell").
 */
const RASTER = {
  3: { grid: "lg:grid-cols-3 lg:grid-rows-2", spans: ["lg:col-span-2 lg:row-span-2", "", ""] },
  4: { grid: "lg:grid-cols-4 lg:grid-rows-2", spans: ["lg:col-span-2 lg:row-span-2", "", "", "lg:col-span-2"] },
  5: { grid: "lg:grid-cols-4 lg:grid-rows-2", spans: ["lg:col-span-2 lg:row-span-2", "", "", "", ""] },
  6: { grid: "lg:grid-cols-3 lg:grid-rows-3", spans: ["lg:col-span-2 lg:row-span-2", "", "", "", "", ""] },
};

const TON = {
  navy: "bg-navy-950 text-white ring-navy-900",
  gruen: "bg-ov-700 text-white ring-ov-800",
  hell: "bg-white text-ink-900 ring-ink-200/70",
};

export default function FotoBento({ items = [], className }) {
  const r = RASTER[items.length] || RASTER[6];
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 md:gap-5", r.grid, className)}>
      {items.map((it, i) => (
        <Reveal
          key={it.titel}
          delay={i * 70}
          className={cn(
            "min-w-0",
            i === 0 && "sm:col-span-2",
            // Tablet: ungerade Restanzahl → letzte Karte über beide Spalten (keine verwaiste Karte)
            i > 0 && i === items.length - 1 && (items.length - 1) % 2 === 1 && "sm:col-span-2 lg:col-span-1",
            r.spans[i]
          )}
        >
          <Karte {...it} gross={i === 0} />
        </Reveal>
      ))}
    </div>
  );
}

function Karte({ bild, icon: Icon, titel, text, href, tag, ton = "navy", gross }) {
  const hell = !bild && ton === "hell";
  const inhalt = (
    <>
      {bild?.src && (
        <>
          <Image
            src={bild.src}
            alt={bild.alt || ""}
            fill
            sizes={gross ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
            style={bild.position ? { objectPosition: bild.position } : undefined}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/45 to-navy-950/5" />
        </>
      )}
      {!bild && ton !== "hell" && <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ov-400/25 blur-3xl" />}
      <div className="relative mt-auto flex min-w-0 flex-col p-6 md:p-7">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl backdrop-blur", hell ? "bg-ov-50 text-ov-600" : "bg-white/15 text-white ring-1 ring-white/20")}>
              <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
            </span>
          )}
          {tag && <span className={cn("rounded-full px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wider", hell ? "bg-ink-100 text-ink-600" : "bg-white/15 text-white/90")}>{tag}</span>}
        </div>
        <h3 lang="de" className={cn("mt-4 hyphens-auto break-words font-display font-extrabold leading-tight tracking-tight [overflow-wrap:anywhere]", gross ? "text-[24px] md:text-[30px]" : "text-[18px] md:text-[19px] lg:text-[18px] xl:text-[19.5px]", hell ? "text-ink-900" : "text-white")}>{titel}</h3>
        {text && <p lang="de" className={cn("mt-2 max-w-xl hyphens-auto leading-relaxed", gross ? "text-[15.5px] md:text-[16.5px]" : "text-[14.5px]", hell ? "text-ink-600" : "text-white/75")}>{text}</p>}
      </div>
    </>
  );

  const basis = cn(
    "group ov-card-hover relative isolate flex h-full flex-col overflow-hidden rounded-3xl ring-1",
    gross ? "min-h-[340px] md:min-h-[420px]" : "min-h-[250px]",
    bild ? "bg-navy-950 ring-navy-900" : TON[ton] || TON.navy
  );

  if (href) {
    return (
      <Link href={href} className={basis}>
        {inhalt}
        <ArrowUpRight
          aria-hidden="true"
          className={cn("absolute right-5 top-5 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5", hell ? "text-ink-400" : "text-white/70")}
        />
      </Link>
    );
  }
  return <div className={basis}>{inhalt}</div>;
}
