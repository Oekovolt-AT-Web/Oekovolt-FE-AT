import Link from "next/link";
import { ArrowUpRight, Building2, Hotel, Package, ShoppingBag, Tractor, Trees } from "lucide-react";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";
import { REFERENZ_UNTERNEHMEN } from "@/data/hero";

/**
 * Referenz-Namen (öffentlich gelistete Referenzunternehmen, src/data/hero.js) –
 * reine Namensliste, keine Logos, keine Leistungsangaben.
 * Verlinkt wird nur, wenn es die Projektdetailseite gibt (slugs aus der Projektliste).
 */

const BRANCHEN_ICON = { Industrie: Building2, Holz: Trees, Handel: ShoppingBag, Logistik: Package, Tourismus: Hotel, Landwirtschaft: Tractor };

/** Laufband mit den Namen – als Vertrauensband unter dem Seitenkopf */
export function ReferenzNamenBand({ titel = "Unternehmen, die mit uns Strom erzeugen – eine Auswahl", dunkel = false, className }) {
  return (
    <div className={cn("border-y py-7 md:py-9", dunkel ? "border-white/10 bg-navy-950" : "border-ink-100 bg-white", className)}>
      <p className={cn("ov-container mb-5 text-center text-[12.5px] font-semibold uppercase tracking-[0.16em]", dunkel ? "text-white/55" : "text-ink-500")}>{titel}</p>
      <Marquee speed={60} fade={dunkel ? "from-navy-950" : "from-white"}>
        {REFERENZ_UNTERNEHMEN.map((r) => (
          <span key={r.slug} className="flex items-center gap-12 md:gap-16">
            <span className={cn("whitespace-nowrap font-display text-[20px] font-bold tracking-tight md:text-[24px]", dunkel ? "text-white/70" : "text-ink-400")}>{r.name}</span>
            <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", dunkel ? "bg-ov-400/60" : "bg-ov-300")} />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/**
 * Referenzwand nach Branchen – gestalteter Zustand, wenn das Backoffice (noch) keine
 * Projektdaten liefert. Auf dunklem Grund, Kacheln je Branche mit den Firmennamen.
 */
export function ReferenzWand({ vorhandeneSlugs = new Set(), telefon, telefonHref }) {
  const branchen = [...new Set(REFERENZ_UNTERNEHMEN.map((r) => r.branche))].map((b) => ({
    name: b,
    firmen: REFERENZ_UNTERNEHMEN.filter((r) => r.branche === b),
  }));
  const gross = branchen[0];
  const rest = branchen.slice(1);

  return (
    <div className="ov-noise relative isolate overflow-hidden rounded-[2rem] bg-navy-950 p-6 text-white shadow-2xl md:p-10">
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden="true" className="absolute -left-24 -top-24 -z-10 h-[380px] w-[380px] rounded-full bg-ov-500/20 blur-[120px]" />
      <div aria-hidden="true" className="absolute -bottom-24 right-0 -z-10 h-[320px] w-[320px] rounded-full bg-navy-400/25 blur-[120px]" />

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        {/* Industrie groß */}
        <Reveal className="relative flex flex-col overflow-hidden rounded-3xl bg-white/[0.05] p-6 ring-1 ring-white/10 md:p-8">
          <span aria-hidden="true" className="ov-num pointer-events-none absolute -bottom-10 -right-2 font-display text-[220px] font-extrabold leading-none text-white/[0.04]">{gross.firmen.length}</span>
          <Kopf name={gross.name} anzahl={gross.firmen.length} gross />
          <ul className="relative mt-6 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {gross.firmen.map((f) => (
              <Firma key={f.slug} firma={f} verlinkt={vorhandeneSlugs.has(f.slug)} gross />
            ))}
          </ul>
          <p className="relative mt-auto pt-8 text-[13.5px] leading-relaxed text-white/50">Produktion, Verarbeitung und Automation – Betriebe mit großen Dachflächen und hohem Tagesverbrauch.</p>
        </Reveal>
        <div className="grid content-start gap-4 sm:grid-cols-2">
          {rest.map((b, i) => (
            <Reveal key={b.name} delay={80 + i * 70} className={cn("rounded-3xl bg-white/[0.05] p-5 ring-1 ring-white/10 md:p-6", b.firmen.length > 2 && "sm:col-span-2")}>
              <Kopf name={b.name} anzahl={b.firmen.length} />
              <ul className={cn("mt-4 grid gap-y-1", b.firmen.length > 2 && "sm:grid-cols-2 sm:gap-x-6")}>
                {b.firmen.map((f) => (
                  <Firma key={f.slug} firma={f} verlinkt={vorhandeneSlugs.has(f.slug)} />
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-[14.5px] leading-relaxed text-white/65">
          Öffentlich gelistete Referenzen von Ökovolt in Österreich – reine Namensliste. Leistung, Dachart und Ort der Anlagen ergänzen wir laufend; vergleichbare Projekte in Ihrer Nähe nennen wir Ihnen gern persönlich.
        </p>
        {telefon && (
          <a href={telefonHref} className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-navy-950 transition-colors hover:bg-ov-50 md:self-auto">
            {telefon}
          </a>
        )}
      </div>
    </div>
  );
}

function Kopf({ name, anzahl, gross = false }) {
  const Icon = BRANCHEN_ICON[name] || Building2;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-3">
        <span className={cn("flex items-center justify-center rounded-2xl bg-ov-500/15 text-ov-300 ring-1 ring-ov-400/20", gross ? "h-12 w-12" : "h-10 w-10")}>
          <Icon aria-hidden="true" className={gross ? "h-6 w-6" : "h-5 w-5"} />
        </span>
        <span className={cn("font-display font-extrabold tracking-tight", gross ? "text-[26px]" : "text-[19px]")}>{name}</span>
      </span>
      <span className="ov-num rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-semibold text-white/75">{anzahl}</span>
    </div>
  );
}

function Firma({ firma, verlinkt, gross = false }) {
  const klasse = cn("flex min-h-11 items-center justify-between gap-2 border-b border-white/[0.07] py-2 font-semibold", gross ? "text-[16px]" : "text-[15px]");
  return (
    <li>
      {verlinkt ? (
        <Link href={`/referenzen/projekte/${firma.slug}`} className={cn(klasse, "group text-white hover:text-ov-300")}>
          {firma.name}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-white/40 group-hover:text-ov-300" />
        </Link>
      ) : (
        <span className={cn(klasse, "text-white/90")}>{firma.name}</span>
      )}
    </li>
  );
}
