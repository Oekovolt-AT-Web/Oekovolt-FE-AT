import Image from "next/image";
import Link from "next/link";
import { CalendarClock } from "lucide-react";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { datumLang, kategoriePfad } from "@/lib/ratgeber";
import { ArtikelMeta } from "./Bausteine";
import { nachweisFuer } from "./bildnachweise";

/**
 * Artikelkopf im Magazin-Look: Themen-Chip, Titel, Vorspann, Autorenzeile und
 * Titelbild mit schwebender Kennzahl. Ist das Bild frei lizenziert (CC, Pexels …),
 * steht die Namensnennung direkt auf dem Bild – automatisch aus den
 * QUELLEN-Dateien oder aus dem optionalen Artikelfeld `bildNachweis`.
 */
export default function ArtikelHero({ artikel, titel, badge }) {
  const nachweis = nachweisFuer(artikel);
  const aktualisiert = artikel.aktualisiert && artikel.aktualisiert !== artikel.veroeffentlicht;

  return (
    <section className="relative overflow-hidden bg-sand-50">
      <div aria-hidden="true" className="ov-grid-bg-light pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-ov-200/45 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-sun-300/20 blur-3xl" />

      <div className="ov-container relative pb-16 pt-8 md:pb-20 md:pt-10">
        <Breadcrumbs items={[{ name: "Ratgeber", href: "/ratgeber" }, { name: artikel.kurzTitel || artikel.title }]} className="ov-hero-in mb-8" />

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14 xl:gap-20">
          <div>
            <div className="ov-hero-in flex flex-wrap items-center gap-2" style={{ "--ov-delay": "60ms" }}>
              <Link
                href={kategoriePfad(artikel.kategorie)}
                className="inline-flex h-8 items-center gap-2 rounded-full bg-white px-3.5 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ov-700 ring-1 ring-ov-200 transition-colors hover:bg-ov-500 hover:text-white hover:ring-ov-500"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                {artikel.kategorie}
              </Link>
              {aktualisiert && (
                <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ov-50 px-3 text-[12.5px] font-semibold text-ov-800">
                  <CalendarClock aria-hidden="true" className="h-3.5 w-3.5" />
                  Aktualisiert {datumLang(artikel.aktualisiert)}
                </span>
              )}
            </div>
            <h1
              className="ov-hero-in mt-6 font-display text-[clamp(1.75rem,1.15rem+2.4vw,3.1rem)] font-extrabold leading-[1.07] tracking-[-0.03em] text-ink-900 [text-wrap:balance]"
              style={{ "--ov-delay": "120ms" }}
            >
              {titel || artikel.title}
            </h1>
            {artikel.excerpt && (
              <p className="ov-hero-in mt-6 max-w-2xl text-[clamp(1.02rem,0.95rem+0.3vw,1.18rem)] leading-relaxed text-ink-600" style={{ "--ov-delay": "200ms" }}>
                {artikel.excerpt}
              </p>
            )}
            <ArtikelMeta artikel={artikel} />
          </div>

          <figure className="ov-hero-in relative" style={{ "--ov-delay": "180ms" }}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-ink-100 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.55)] ring-1 ring-ink-900/5 sm:aspect-[16/11] lg:aspect-[4/3.4]">
              <Image src={artikel.bild} alt={artikel.bildAlt || ""} fill priority sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/35 via-transparent to-transparent" />
              {nachweis && (
                <figcaption className="absolute right-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full bg-navy-950/60 px-3 py-1 text-[11px] leading-snug text-white/85 backdrop-blur-md">
                  <Nachweis n={nachweis} />
                </figcaption>
              )}
            </div>
            {badge && (
              <div className="absolute -bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xs md:-left-8 md:right-auto">
                <div className="animate-ov-float rounded-2xl bg-white/95 p-5 shadow-2xl ring-1 ring-ink-100 backdrop-blur">{badge}</div>
              </div>
            )}
          </figure>
        </div>
      </div>
    </section>
  );
}

/** Namensnennung: Urheber (verlinkt auf die Quelle), Plattform, Lizenz (verlinkt auf den Lizenztext). */
export function Nachweis({ n }) {
  if (n.text) return <>Bild: {n.text}</>;
  const link = "underline decoration-white/40 underline-offset-2 hover:decoration-white";
  const partner = n.lizenz === "Partnerfreigabe";
  return (
    <>
      {partner ? "Bild: " : "Foto: "}
      {n.quelle ? (
        <a href={n.quelle} target="_blank" rel="noopener noreferrer nofollow" className={link}>
          {n.urheber || n.plattform || "Quelle"}
        </a>
      ) : (
        n.urheber
      )}
      {n.plattform && n.urheber && <>, {n.plattform}</>}
      {n.lizenz && (
        <>
          {" · "}
          {n.lizenzUrl ? (
            <a href={n.lizenzUrl} target="_blank" rel="noopener noreferrer nofollow license" className={link}>
              {n.lizenz}
            </a>
          ) : (
            n.lizenz
          )}
        </>
      )}
    </>
  );
}
