import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * Foto-Bento: große Bildkarten mit Text auf Verlauf, dazwischen ruhige
 * Textkacheln (ohne Bild). Raster lg: 3 Spalten, Zeilenhöhe fest.
 *
 * items: [{ titel, text, bild?, alt?, tag?, icon? (JSX-Element), href?, form?: "breit" | "hoch" | "gross", ton?: "navy" | "sand" | "gruen" }]
 *  form  breit = 2 Spalten, hoch = 2 Zeilen, gross = 2×2
 */
const FORM = {
  breit: "lg:col-span-2",
  hoch: "lg:row-span-2",
  gross: "lg:col-span-2 lg:row-span-2",
};

const TON = {
  navy: "bg-navy-950 text-white ring-navy-900",
  sand: "bg-sand-50 text-ink-900 ring-ink-200/70",
  gruen: "bg-ov-600 text-white ring-ov-700",
  weiss: "bg-white text-ink-900 ring-ink-200/70",
};

export default function FotoBento({ items = [], zeile = 250, spalten = 3, className }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", spalten === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3", className)} style={{ gridAutoRows: `minmax(${zeile}px, auto)` }}>
      {items.map((it, i) => (
        <Reveal key={it.titel} delay={(i % 4) * 70} className={cn("min-w-0", FORM[it.form], it.form === "breit" || it.form === "gross" ? "md:col-span-2" : "")}>
          <Karte {...it} />
        </Reveal>
      ))}
    </div>
  );
}

function Karte({ titel, text, bild, alt, tag, icon, href, form, ton = "navy" }) {
  const gross = form === "gross" || form === "hoch";
  const inhalt = bild ? (
    <>
      <Image src={bild} alt={alt || ""} fill sizes={form === "gross" || form === "breit" ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"} className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.05]" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/65 to-navy-950/10" />
      <div className="relative mt-auto p-6 md:p-7">
        {tag && <span className="ov-glass mb-3 inline-flex rounded-full px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wider text-white/90">{tag}</span>}
        <h3 className={cn("font-display font-extrabold leading-tight tracking-tight text-white", gross ? "text-[24px] md:text-[28px]" : "text-[19px] md:text-[20px]")}>{titel}</h3>
        {text && <p className={cn("mt-2 max-w-xl leading-relaxed text-white/75", gross ? "text-[15.5px]" : "text-[14.5px]")}>{text}</p>}
      </div>
    </>
  ) : (
    <div className="relative flex h-full flex-col p-6 md:p-7">
      {ton === "navy" && <div aria-hidden="true" className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-ov-500/25 blur-[60px]" />}
      {icon && (
        <span className={cn("relative flex h-11 w-11 items-center justify-center rounded-2xl [&_svg]:h-5 [&_svg]:w-5", ton === "navy" || ton === "gruen" ? "bg-white/10 text-ov-200" : "bg-ov-50 text-ov-600")}>{icon}</span>
      )}
      <div className="relative mt-auto pt-6">
        {tag && <span className={cn("mb-2 block text-[11.5px] font-semibold uppercase tracking-[0.14em]", ton === "navy" ? "text-ov-300" : ton === "gruen" ? "text-white/75" : "text-ov-700")}>{tag}</span>}
        <h3 className="font-display text-[19px] font-extrabold leading-tight tracking-tight md:text-[20px]">{titel}</h3>
        {text && <p className={cn("mt-2 text-[14.5px] leading-relaxed", ton === "navy" || ton === "gruen" ? "text-white/70" : "text-ink-600")}>{text}</p>}
      </div>
    </div>
  );

  const basis = cn(
    "group ov-card-hover relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-3xl ring-1",
    bild ? "bg-navy-950 ring-navy-900" : TON[ton] || TON.navy
  );

  if (href) {
    return (
      <Link href={href} className={basis}>
        {inhalt}
        <ArrowUpRight aria-hidden="true" className="absolute right-5 top-5 h-5 w-5 text-white/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    );
  }
  return <div className={basis}>{inhalt}</div>;
}
