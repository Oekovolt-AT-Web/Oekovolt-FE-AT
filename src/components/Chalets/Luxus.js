import Image from "next/image";
import { ArrowDown, Check } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

/*
 * Bausteine für die Chalet-Seite: ruhiger, großzügiger Auftritt mit feinen Linien,
 * leichter Display-Schrift (Manrope in dünnen Schnitten) und viel Weißraum –
 * im Corporate Design (Farben, Schriften, Radien) der übrigen Seiten.
 */

/** Überzeile mit Haarlinie, gesperrt gesetzt. */
export function LuxusZeile({ children, dunkel = false, zentriert = false, className }) {
  return (
    <p className={cn("flex items-center gap-4 text-[11.5px] font-semibold uppercase tracking-[0.32em]", dunkel ? "text-white/70" : "text-ov-700", zentriert && "justify-center", className)}>
      <span aria-hidden="true" className={cn("h-px w-10", dunkel ? "bg-white/40" : "bg-ov-600/50")} />
      {children}
      {zentriert && <span aria-hidden="true" className={cn("h-px w-10", dunkel ? "bg-white/40" : "bg-ov-600/50")} />}
    </p>
  );
}

/** Abschnittskopf mit leichter, großer Headline. */
export function LuxusKopf({ zeile, titel, text, dunkel = false, zentriert = false, as: Tag = "h2", className }) {
  return (
    <Reveal className={cn("max-w-3xl", zentriert && "mx-auto text-center", className)}>
      {zeile && <LuxusZeile dunkel={dunkel} zentriert={zentriert}>{zeile}</LuxusZeile>}
      <Tag className={cn("mt-6 font-display text-[clamp(1.9rem,1.35rem+2.2vw,3.25rem)] font-light leading-[1.1] tracking-[-0.03em] text-balance hyphens-none", dunkel ? "text-white" : "text-ink-900")}>{titel}</Tag>
      {text && <p className={cn("mt-6 text-[17px] leading-[1.75]", dunkel ? "text-white/70" : "text-ink-600", zentriert && "mx-auto max-w-2xl")}>{text}</p>}
    </Reveal>
  );
}

/** Vollflächiger Seitenkopf mit großem Foto, ruhiger Typografie und feinen Linien. */
export function LuxusHero({ breadcrumbs, zeile, titel, lead, bild, aktionen = [], punkte = [] }) {
  return (
    <section className="relative isolate flex min-h-[640px] flex-col overflow-hidden bg-navy-950 text-white md:min-h-[calc(100svh-7rem)]">
      <Image src={bild.src} alt={bild.alt || ""} fill priority sizes="100vw" className="-z-20 object-cover motion-safe:animate-[ov-hero-zoom_14s_ease-out_both]" style={bild.position ? { objectPosition: bild.position } : undefined} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/30" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/70 via-navy-950/20 to-transparent" />
      <style>{"@keyframes ov-hero-zoom { from { transform: scale(1.08); } to { transform: scale(1); } }"}</style>

      <div className="ov-container flex flex-1 flex-col pb-10 pt-8 md:pb-14 md:pt-10">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} dark className="ov-hero-in" />}
        <div className="mt-auto max-w-4xl pt-24">
          <div className="ov-hero-in" style={{ "--ov-delay": "80ms" }}>
            <LuxusZeile dunkel>{zeile}</LuxusZeile>
          </div>
          <h1 className="ov-hero-in mt-7 font-display text-[clamp(2.4rem,1.5rem+3.9vw,5rem)] font-extralight leading-[1.04] tracking-[-0.035em] text-balance hyphens-none" style={{ "--ov-delay": "160ms" }}>
            {titel}
          </h1>
          {lead && <p className="ov-hero-in mt-7 max-w-2xl text-[17px] leading-[1.75] text-white/75 md:text-[18.5px]" style={{ "--ov-delay": "240ms" }}>{lead}</p>}
          {aktionen.length > 0 && (
            <div className="ov-hero-in mt-10 flex flex-col gap-3 sm:flex-row" style={{ "--ov-delay": "320ms" }}>
              {aktionen.map((a, i) => (
                <Button key={a.label} href={a.href} size="lg" variant={i === 0 ? "white" : "outlineLight"} pfeil={i === 0} icon={a.icon}>
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        {punkte.length > 0 && (
          <ul className="ov-hero-in mt-14 grid grid-cols-2 border-t border-white/20 md:grid-cols-4" style={{ "--ov-delay": "420ms" }}>
            {punkte.map((p, i) => (
              <li key={p} className={cn("flex items-center gap-2.5 py-5 text-[13.5px] text-white/80 md:px-6 md:first:pl-0", i > 0 && "md:border-l md:border-white/15", i % 2 === 1 && "border-l border-white/15 pl-4 md:pl-6")}>
                <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ov-300" strokeWidth={2.5} />
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>
      <a href="#chalet-bereiche" className="absolute bottom-6 right-6 hidden h-12 w-12 items-center justify-center rounded-full text-white/70 ring-1 ring-white/30 transition-colors hover:bg-white/10 hover:text-white md:right-10 lg:flex" aria-label="Zu den sechs Bereichen">
        <ArrowDown aria-hidden="true" className="h-4 w-4 motion-safe:animate-bounce" />
      </a>
    </section>
  );
}

/** Kennzahlen in feinen Linien, ohne Karte. items: [{ wert, dezimal?, suffix?, prefix?, label }] */
export function LuxusZahlen({ items = [], quelle }) {
  return (
    <div>
      <dl className="grid grid-cols-2 border-y border-ink-200 lg:grid-cols-4">
        {items.map((k, i) => (
          <div key={k.label} className={cn("px-2 py-9 md:px-8 md:py-12", i % 2 === 1 && "border-l border-ink-200", i >= 2 && "border-t border-ink-200 lg:border-t-0", i >= 1 && "lg:border-l")}>
            <dt className="sr-only">{k.label}</dt>
            <dd className="font-display text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] font-extralight leading-none tracking-[-0.03em] text-ink-900">
              <CountUp value={k.wert} decimals={k.dezimal || 0} prefix={k.prefix || ""} suffix={k.suffix || ""} />
            </dd>
            <dd className="mt-4 max-w-[15rem] text-[13.5px] leading-relaxed text-ink-500">{k.label}</dd>
          </div>
        ))}
      </dl>
      {quelle && <p className="mt-4 text-[12px] leading-relaxed text-ink-400">{quelle}</p>}
    </div>
  );
}

/** Liste mit Haarlinien statt Karten. items: [{ titel, text }] */
export function LinienListe({ items = [], dunkel = false, spalten = 2, className }) {
  return (
    <ul className={cn("grid gap-x-12", spalten === 3 ? "md:grid-cols-2 lg:grid-cols-3" : spalten === 2 && "md:grid-cols-2", className)}>
      {items.map((it, i) => (
        <Reveal as="li" key={it.titel} delay={(i % 3) * 70} className={cn("border-t py-6", dunkel ? "border-white/15" : "border-ink-200")}>
          <p className={cn("font-display text-[18px] font-semibold tracking-tight", dunkel ? "text-white" : "text-ink-900")}>{it.titel}</p>
          <p className={cn("mt-2 text-[15px] leading-relaxed", dunkel ? "text-white/65" : "text-ink-600")}>{it.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}
