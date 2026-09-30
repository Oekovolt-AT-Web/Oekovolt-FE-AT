import Link from "next/link";
import { ArrowRight, BadgeCheck, FileBarChart2, Share2 } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { siegelBildUrl } from "@/lib/kundenbuehne";

/** Leichte Vorschau je Karte (gleiche Höhe): echtes Siegel-SVG bzw. CSS-Skizzen von Bildern und Bericht */
function Vorschau({ art, slug, zahlen }) {
  const rahmen = "mt-5 flex h-[156px] items-center justify-center overflow-hidden rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10";
  const werte = zahlen?.kwp ? [zahlen.texte.kwp, zahlen.texte.mwh, zahlen.texte.co2] : [];
  if (art === "siegel") {
    return (
      <span className={rahmen}>
        {/* SVG-Siegel aus eigener Route – kein next/image nötig */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siegelBildUrl({ slug })} alt="" width={340} height={zahlen?.kwp ? 176 : 118} loading="lazy" className="h-auto max-h-full w-auto max-w-full" />
      </span>
    );
  }
  if (art === "social") {
    const kachel = "flex flex-col justify-end rounded-lg bg-gradient-to-br from-navy-700 via-navy-900 to-ov-800 p-2 ring-1 ring-white/15";
    return (
      <span aria-hidden="true" className={`${rahmen} gap-2.5`}>
        <span className={`${kachel} aspect-[1.91/1] w-[46%]`}>
          <span className="h-1 w-8 rounded bg-ov-300" />
          <span className="mt-1 h-1.5 w-16 rounded bg-white/80" />
          <span className="mt-1.5 flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2.5 flex-1 rounded-sm bg-white/15" />
            ))}
          </span>
        </span>
        <span className={`${kachel} aspect-square w-[26%]`}>
          <span className="h-1 w-6 rounded bg-ov-300" />
          <span className="mt-1 h-1.5 w-10 rounded bg-white/80" />
        </span>
        <span className={`${kachel} aspect-[9/16] w-[17%]`}>
          <span className="h-1 w-4 rounded bg-ov-300" />
          <span className="mt-1 h-1.5 w-7 rounded bg-white/80" />
        </span>
      </span>
    );
  }
  return (
    <span aria-hidden="true" className={rahmen}>
      <span className="flex h-full w-[78%] flex-col rounded-lg bg-white p-3 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]">
        <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-ov-700">ESG-Kurzbericht</span>
        <span className="mt-1 h-1.5 w-2/3 rounded bg-ink-800" />
        <span className="mt-2.5 grid grid-cols-3 gap-1.5">
          {(werte.length ? werte : ["", "", ""]).map((w, i) => (
            <span key={i} className="rounded bg-ov-50 px-1 py-1.5 text-center text-[8.5px] font-bold leading-tight text-ink-800 ring-1 ring-ov-200">
              {w || "–"}
            </span>
          ))}
        </span>
        <span className="mt-2.5 h-1 w-full rounded bg-ink-100" />
        <span className="mt-1 h-1 w-5/6 rounded bg-ink-100" />
        <span className="mt-1 h-1 w-4/6 rounded bg-ink-100" />
      </span>
    </span>
  );
}

/**
 * Block „Für <Firma>: Ihr Solar-Kit“ auf der Projektseite – Links zu Siegel, Social-Kit und ESG-Bericht.
 */
export default function SolarKit({ slug, firma, zahlen }) {
  const basis = `/referenzen/projekte/${slug}`;
  const karten = [
    {
      href: `${basis}/siegel`,
      icon: BadgeCheck,
      titel: "Solar-Siegel für Ihre Website",
      text: "Zeigen Sie Ihren Besuchern, dass Ihr Betrieb Sonnenstrom erzeugt – als Bild mit Link, in hell oder dunkel, kompakt oder breit. Code kopieren, einfügen, fertig.",
      cta: "Siegel holen",
      vorschau: "siegel",
    },
    {
      href: `${basis}/teilen`,
      icon: Share2,
      titel: "Social-Media-Kit",
      text: "Fertige Bilder für LinkedIn und Instagram (Beitrag und Story) mit Ihren Anlagendaten – dazu Textvorschläge zum Kopieren.",
      cta: "Bilder & Texte",
      vorschau: "social",
    },
    {
      href: `${basis}/esg`,
      icon: FileBarChart2,
      titel: "ESG-Kurzbericht",
      text: "Anlage, geschätzte Jahresproduktion und CO₂-Vermeidung mit Faktor und Quelle – druckfertig als PDF für Nachhaltigkeitsbericht, Bank oder Kunden.",
      cta: "Bericht öffnen",
      vorschau: "esg",
    },
  ];

  return (
    <Section tone="navy" space="lg" className="ov-noise isolate overflow-hidden" aria-labelledby="solar-kit-titel">
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-ov-500/25 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-24 bottom-0 -z-10 h-[360px] w-[360px] rounded-full bg-sun-400/15 blur-[120px]" />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          dark
          eyebrow="Für unsere Kunden"
          title={
            <span id="solar-kit-titel">
              Für {firma}: <span className="ov-text-gradient-light">Ihr Solar-Kit</span>
            </span>
          }
          lead={`Ihre Anlage leistet${zahlen?.kwp ? ` ${zahlen.texte.kwp} und erzeugt geschätzt ${zahlen.texte.mwh} Solarstrom im Jahr` : " einen Beitrag zur Energiewende"}. Mit diesen Werkzeugen zeigen Sie das Ihren Kunden, Ihrem Team und Ihren Partnern – kostenlos und ohne Anmeldung.`}
        />
      </div>
      <ul className="mt-12 grid gap-5 lg:grid-cols-3">
        {karten.map((k, i) => (
          <Reveal as="li" key={k.href} delay={i * 90} className="h-full">
            <Link
              href={k.href}
              className="ov-glass ov-card-hover group flex h-full flex-col rounded-3xl p-6 ring-1 ring-white/15 transition-colors hover:ring-ov-300/60 md:p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-500/90 text-white">
                <k.icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-[21px] font-bold text-white">{k.titel}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{k.text}</p>
              <Vorschau art={k.vorschau} slug={slug} zahlen={zahlen} />
              <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold text-ov-300">
                {k.cta}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
