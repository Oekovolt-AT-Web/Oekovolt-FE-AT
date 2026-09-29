import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/components/ui/cn";
import HeroSuche from "./HeroSuche";
import ThemaLink from "./ThemaLink";
import { artikelPfad, datumLang, kategoriePfad, kategorieSlug } from "@/lib/ratgeber";

/* ------------------------------------------------------------------
   Bausteine der Ratgeber-Übersicht im Magazin-Look (Server-Komponenten).
   ------------------------------------------------------------------ */

/**
 * Magazin-Kopf: links Titel, Suche und Kennzahlen, rechts der Titelartikel
 * groß mit Foto und zwei weitere Empfehlungen.
 */
export function MagazinHero({ top, neben = [], stats = [], vorschlaege = [] }) {
  return (
    <section className="ov-noise relative isolate overflow-hidden bg-navy-950 text-white">
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-1/3 -z-10 h-[460px] w-[460px] rounded-full bg-ov-500/25 blur-[130px]" />
      <div aria-hidden="true" className="absolute -right-24 -top-32 -z-10 h-[420px] w-[420px] rounded-full bg-navy-400/30 blur-[130px]" />

      <div className="ov-container pb-16 pt-8 md:pb-20 md:pt-12">
        <Breadcrumbs dark items={[{ name: "Ratgeber" }]} className="ov-hero-in mb-10" />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 xl:gap-20">
          <div className="flex flex-col">
            <div className="ov-hero-in" style={{ "--ov-delay": "60ms" }}>
              <Eyebrow dark className="mb-5">
                Fachmagazin für Österreich · Stand September 2026
              </Eyebrow>
            </div>
            <h1 className="ov-h1 ov-hero-in" style={{ "--ov-delay": "120ms" }}>
              Photovoltaik-<span className="ov-text-gradient-light">Ratgeber</span>
            </h1>
            <p className="ov-lead ov-hero-in mt-6 max-w-xl text-white/70" style={{ "--ov-delay": "200ms" }}>
              Rechnet sich PV für Ihren Betrieb, welche Förderung und welcher Freibetrag gelten, was verlangt der Netzbetreiber? Antworten für Geschäftsführung, Technik und
              Einkauf – nach österreichischer Rechtslage, mit Zahlen und Quellen.
            </p>
            <div className="ov-hero-in mt-9 max-w-xl" style={{ "--ov-delay": "260ms" }}>
              <HeroSuche vorschlaege={vorschlaege} />
            </div>
            {stats.length > 0 && (
              <dl className="ov-hero-in mt-auto grid max-w-xl grid-cols-3 gap-6 border-t border-white/15 pt-8 max-lg:mt-12 lg:pt-8" style={{ "--ov-delay": "380ms" }}>
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-[clamp(1.5rem,1.1rem+1.2vw,2.1rem)] font-extrabold leading-none tracking-tight">
                      <CountUp value={s.value} />
                    </dd>
                    <dd className="mt-2 text-[13px] leading-snug text-white/55">{s.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="ov-hero-in grid gap-4" style={{ "--ov-delay": "180ms" }}>
            {top && <TitelKarte artikel={top} />}
            {neben.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {neben.map((a) => (
                  <MiniKarte key={a.slug} artikel={a} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Großer Titelartikel mit Text auf dem Foto. */
function TitelKarte({ artikel: a }) {
  return (
    <article className="group relative isolate flex min-h-[340px] overflow-hidden rounded-[2rem] bg-navy-900 ring-1 ring-white/10 sm:min-h-[400px] lg:min-h-[420px]">
      <Image src={a.bild} alt={a.bildAlt || ""} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="-z-20 object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/5" />
      <div className="flex w-full flex-col justify-between p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ov-500 px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.12em] text-white">Titelthema</span>
          <span className="ov-glass rounded-full px-3 py-1 text-[12px] font-semibold text-white/90">{a.kategorie}</span>
        </div>
        <div className="max-w-2xl">
          <h2 className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.3rem)] font-extrabold leading-[1.12] tracking-tight text-white">
            <Link href={artikelPfad(a.slug)} className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline">
              {a.title}
            </Link>
          </h2>
          <p className="mt-3 line-clamp-2 text-[15.5px] leading-relaxed text-white/75">{a.excerpt}</p>
          <p className="mt-5 flex items-center gap-4 text-[13px] text-white/60">
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              {a.lesezeit} Min. Lesezeit
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-white transition-transform group-hover:translate-x-1">
              Jetzt lesen <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}

/** Kleine Empfehlung im Hero: Vorschaubild + Titel. */
function MiniKarte({ artikel: a }) {
  return (
    <article className="group relative flex items-center gap-4 rounded-3xl bg-white/[0.06] p-3 pr-5 ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-white/[0.1]">
      <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-2xl bg-navy-900">
        <Image src={a.bild} alt="" fill sizes="80px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="min-w-0">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ov-300">{a.kategorie.split(/,| &/)[0]}</p>
        <h2 className="mt-1 line-clamp-2 font-display text-[15.5px] font-bold leading-snug text-white">
          <Link href={artikelPfad(a.slug)} className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:underline">
            {a.kurzTitel || a.title}
          </Link>
        </h2>
        <p className="mt-1 text-[12.5px] text-white/50">{a.lesezeit} Min. Lesezeit</p>
      </div>
    </article>
  );
}

/** Karte in der horizontalen Leseleiste. */
export function LeseKarte({ artikel: a, neu = false }) {
  return (
    <article className="group relative flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col sm:w-[300px]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-100">
        <Image src={a.bild} alt={a.bildAlt || ""} fill sizes="320px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        {neu && <span className="absolute left-4 top-4 rounded-full bg-ov-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-sm">Neu</span>}
      </div>
      <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-ov-700">{a.kategorie}</p>
      <h3 className="mt-1.5 font-display text-[17px] font-extrabold leading-snug text-ink-900 transition-colors group-hover:text-ov-700">
        <Link href={artikelPfad(a.slug)} className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline">
          {a.title}
        </Link>
      </h3>
      <p className="mt-2 flex items-center gap-2 text-[13px] text-ink-500">
        <time dateTime={a.aktualisiert}>{datumLang(a.aktualisiert)}</time>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink-300" />
        {a.lesezeit} Min.
      </p>
    </article>
  );
}

/**
 * Einstieg nach Rolle: Geschäftsführung, Technik, Einkauf.
 * bereich: { rolle, frage, text, bild, bildAlt, icon, artikel: [...] }
 */
export function FachbereichKarte({ bereich: b, delay = 0 }) {
  const Icon = b.icon;
  return (
    <Reveal delay={delay} className="flex w-full">
      <div className="flex w-full flex-col overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink-200/70">
        <div className="relative aspect-[16/9] overflow-hidden bg-ink-100">
          <Image src={b.bild} alt={b.bildAlt} fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white shadow-lg">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-200">{b.rolle}</p>
              <h3 className="font-display text-[20px] font-extrabold leading-tight text-white">{b.frage}</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-7">
          <p className="text-[15px] leading-relaxed text-ink-600">{b.text}</p>
          <ul className="mt-5 divide-y divide-ink-100 border-t border-ink-100">
            {b.artikel.map((a) => (
              <li key={a.slug}>
                <Link href={artikelPfad(a.slug)} className="group flex items-center justify-between gap-4 py-3 text-[15px] font-semibold text-ink-800 transition-colors hover:text-ov-700">
                  <span>{a.kurzTitel || a.title}</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ov-600" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * Themenbereich als Fotokachel: Anzahl, drei Artikel, Link auf den gefilterten Katalog.
 * thema: { kategorie, text, bild, icon, artikel: [...] }
 */
export function ThemenKachel({ thema: t, delay = 0, gross = false }) {
  const Icon = t.icon;
  return (
    <Reveal delay={delay} className={cn("flex w-[84vw] max-w-[380px] shrink-0 snap-start md:w-auto md:max-w-none", gross && "md:col-span-2")}>
      <div className="group relative isolate flex min-h-[420px] w-full flex-col overflow-hidden rounded-[2rem] bg-navy-950 p-6 text-white ring-1 ring-ink-900/5 md:p-7">
        <Image src={t.bild} alt="" fill sizes={gross ? "(max-width: 768px) 100vw, 640px" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"} className="-z-20 object-cover opacity-90 transition-transform duration-[1200ms] group-hover:scale-105" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/15" />
        <div className="mb-auto flex items-start justify-between gap-3 pb-10">
          <span className="ov-glass flex h-12 w-12 items-center justify-center rounded-2xl text-ov-200">
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="ov-glass ov-num rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-white/90">{t.artikel.length} Artikel</span>
        </div>
        <h3 className="max-w-md font-display text-[clamp(1.35rem,1.1rem+0.7vw,1.7rem)] font-extrabold leading-tight">{t.kategorie}</h3>
        <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-white/70">{t.text}</p>
        <ul className={cn("mt-5 grid gap-x-6 border-t border-white/15 pt-4", gross && "sm:grid-cols-2")}>
          {t.artikel.slice(0, gross ? 4 : 3).map((a) => (
            <li key={a.slug}>
              <Link href={artikelPfad(a.slug)} className="flex items-center gap-2 py-1.5 text-[14.5px] font-medium text-white/85 transition-colors hover:text-ov-200">
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ov-300" />
                <span className="line-clamp-1">{a.kurzTitel || a.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ThemaLink
          thema={kategorieSlug(t.kategorie)}
          href={kategoriePfad(t.kategorie)}
          className="mt-5 inline-flex h-11 items-center gap-2 self-start rounded-full bg-white px-5 text-[14px] font-semibold text-ink-900 transition-colors hover:bg-ov-500 hover:text-white"
        >
          Alle {t.artikel.length} Artikel ansehen
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </ThemaLink>
      </div>
    </Reveal>
  );
}
