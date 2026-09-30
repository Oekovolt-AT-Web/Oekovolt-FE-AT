// src/components/Mannschaft/MannschaftSektion.js
//
// Abschnitt „Eigene Mannschaft, eigener Maschinenpark“ für /uber-uns (Anker #mannschaft).
// Server-Komponente. Inhalte und Quellen: src/data/mannschaft.js – angezeigt werden
// ausschließlich Einträge mit `bestaetigt: true`.
//
// Aufbau: Bildmodul (Foto mit Navy-Verlauf, Headline, Ausstattungsliste)
//       → „Vom Hof bis zum Netzanschluss“ (Desktop horizontal, mobil vertikal)
//       → „Was das für Ihr Projekt bedeutet“ (3 Nutzen-Karten) mit CTA.
//
// Motion: Die Verbindungslinie zeichnet sich beim Einblenden, die Stationen folgen
// gestaffelt. Beides hängt am globalen Reveal-Mechanismus (.js-ready/.is-visible) und
// ist mit motion-safe: an „Bewegung reduzieren“ gebunden. Ohne JavaScript ist alles sichtbar.

import Image from "next/image";
import { CalendarCheck2, Camera } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import SectionHeading, { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/components/ui/cn";
import { AUSSTATTUNG_BESTAETIGT, MANNSCHAFT, NUTZEN, STATIONEN } from "@/data/mannschaft";
import { mannschaftFotos } from "./mannschaftFoto";
import { mannschaftIcon } from "./icons";

// Zustand „noch nicht eingeblendet“ – nur mit JS und ohne reduzierte Bewegung:
//   motion-safe:[.js-ready_.ov-reveal:not(.is-visible)_&]:…
// Klassen bewusst als vollständige Literale, damit Tailwind sie beim Scannen findet.

export default function MannschaftSektion({ className }) {
  const { haupt, neben } = mannschaftFotos();
  const [t1, t2, t3] = MANNSCHAFT.titel;

  return (
    <section
      id={MANNSCHAFT.anker}
      aria-labelledby="mannschaft-titel"
      className={cn("relative scroll-mt-20 overflow-hidden bg-sand-50 py-16 text-ink-900 md:py-28", className)}
    >
      <div aria-hidden="true" className="absolute -right-48 top-[46%] h-[420px] w-[420px] rounded-full bg-ov-100/70 blur-[120px]" />

      <div className="ov-container relative">
        {/* ============ Bildmodul ============ */}
        <Reveal
          as="figure"
          dir="scale"
          className="relative isolate flex flex-col overflow-hidden rounded-[1.75rem] bg-navy-950 text-white shadow-2xl md:rounded-[2.5rem] lg:block lg:min-h-[640px]"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto">
            <Image
              src={haupt.src}
              alt={haupt.alt}
              fill
              sizes="(max-width: 1280px) 100vw, 1216px"
              className="object-cover lg:[scale:var(--ov-zoom)] lg:[transform-origin:var(--ov-origin)]"
              style={{ objectPosition: haupt.position, "--ov-zoom": haupt.zoom || 1, "--ov-origin": haupt.origin || "50% 50%" }}
            />
            {/* mobil: Übergang ins Navy darunter · Desktop: Verlauf von links für den Text */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950 to-navy-950/0 lg:hidden" />
            <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-r from-navy-950 via-navy-950/75 to-navy-950/5 lg:block" />
            <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-t from-navy-950/75 via-navy-950/0 to-navy-950/0 lg:block" />
            <figcaption className="absolute left-4 top-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-navy-950/60 px-3 py-1.5 text-[12.5px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-md md:left-6 md:top-6 lg:left-auto lg:right-8 lg:top-8">
              <Camera aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ov-300" />
              <span className="truncate">{haupt.unterschrift}</span>
            </figcaption>
          </div>

          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 hidden opacity-40 lg:block" />
          <div aria-hidden="true" className="absolute -left-32 bottom-[-30%] -z-10 hidden h-[460px] w-[460px] rounded-full bg-ov-500/25 blur-[130px] lg:block" />

          <div className="relative -mt-10 grid gap-10 px-6 pb-8 sm:-mt-16 sm:px-10 sm:pb-10 lg:mt-0 lg:min-h-[640px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)] lg:items-end lg:gap-14 lg:p-14 xl:p-16">
            <div className="min-w-0">
              <Eyebrow dark>{MANNSCHAFT.eyebrow}</Eyebrow>
              <h2
                id="mannschaft-titel"
                className="mt-5 font-display text-[clamp(1.75rem,0.9rem+3.4vw,4.1rem)] font-extrabold leading-[1.02] tracking-[-0.032em]"
              >
                <span className="block">{t1}</span>
                <span className="block">{t2}</span>
                <span className="ov-text-gradient-light block">{t3}</span>
              </h2>
              <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-white/80 md:text-[17.5px]">{MANNSCHAFT.lead}</p>
            </div>

            <div className="min-w-0 rounded-3xl bg-navy-950/60 p-5 ring-1 ring-white/15 backdrop-blur-xl sm:p-6 lg:p-7">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Im eigenen Haus</p>
                {neben && (
                  <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/20">
                    <Image src={neben.src} alt={neben.alt} fill sizes="80px" className="object-cover" style={{ objectPosition: neben.position }} />
                  </span>
                )}
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-5 lg:grid-cols-1 lg:gap-y-2.5">
                {AUSSTATTUNG_BESTAETIGT.map((a) => {
                  const Icon = mannschaftIcon(a.icon);
                  return (
                    <li key={a.id} className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                        <Icon aria-hidden="true" className="h-[18px] w-[18px] text-ov-300" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 leading-tight">
                        <span className="block text-[13.5px] font-semibold text-white sm:text-[14.5px]">{a.kurz}</span>
                        {a.text && <span className="mt-0.5 hidden text-[13px] text-white/60 sm:block">{a.text}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* ============ Vom Hof bis zum Netzanschluss ============ */}
        <div className="mt-20 md:mt-28">
          <div className="mb-12 grid gap-6 lg:mb-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <SectionHeading
              as="h3"
              eyebrow="Ablauf mit eigenen Leuten"
              title={
                <>
                  Vom Hof bis zum <span className="ov-text-gradient">Netzanschluss.</span>
                </>
              }
            />
            <Reveal delay={100}>
              <p className="ov-lead max-w-xl text-ink-600">
                Sechs Stationen, an denen bei Ökovolt eigene Leute, eigene Fahrzeuge oder eigene Technik arbeiten – und was Sie davon haben.
              </p>
            </Reveal>
          </div>

          <Reveal dir="scale" className="relative">
            {/* Verbindungslinie – Desktop horizontal (Mitte erstes bis Mitte letztes Icon) */}
            <span
              aria-hidden="true"
              className="absolute left-7 right-[calc((100%-6.25rem)/6-1.75rem)] top-7 hidden h-0.5 rounded-full bg-ink-200 lg:block"
            >
              <span
                className={cn(
                  "absolute inset-0 origin-left rounded-full bg-gradient-to-r from-ov-500 via-ov-400 to-navy-500 transition-[scale] duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "motion-safe:[.js-ready_.ov-reveal:not(.is-visible)_&]:scale-x-0"
                )}
              />
            </span>
            {/* mobil vertikal */}
            <span aria-hidden="true" className="absolute bottom-10 left-7 top-7 w-0.5 rounded-full bg-ink-200 lg:hidden">
              <span
                className={cn(
                  "absolute inset-0 origin-top rounded-full bg-gradient-to-b from-ov-500 via-ov-400 to-navy-500 transition-[scale] duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "motion-safe:[.js-ready_.ov-reveal:not(.is-visible)_&]:scale-y-0"
                )}
              />
            </span>

            <ol className="relative grid gap-9 lg:grid-cols-6 lg:gap-5">
              {STATIONEN.map((s, i) => {
                const Icon = mannschaftIcon(s.icon);
                const letzte = i === STATIONEN.length - 1;
                return (
                  <li
                    key={s.id}
                    className={cn(
                      "relative flex gap-5 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block",
                      "motion-safe:[.js-ready_.ov-reveal:not(.is-visible)_&]:translate-y-4 motion-safe:[.js-ready_.ov-reveal:not(.is-visible)_&]:opacity-0"
                    )}
                    style={{ transitionDelay: `${250 + i * 130}ms` }}
                  >
                    <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-ov-600 shadow-md ring-1 ring-ink-200">
                      <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                      {letzte && (
                        <span aria-hidden="true" className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-ov-400 ring-2 ring-white motion-safe:animate-ov-pulse-dot" />
                      )}
                    </span>
                    <div className="min-w-0 pt-1 lg:mt-6 lg:pt-0">
                      <p className="ov-num text-[12.5px] font-semibold tracking-[0.14em] text-ink-500">{String(i + 1).padStart(2, "0")}</p>
                      <h4 className="mt-1 font-display text-[18px] font-bold leading-snug text-ink-900">{s.titel}</h4>
                      <p className="mt-2 inline-flex rounded-full bg-ov-50 px-2.5 py-1 text-[12.5px] font-semibold leading-snug text-ov-800 ring-1 ring-ov-200">
                        {s.eigen}
                      </p>
                      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">{s.nutzen}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>

        {/* ============ Was das für Ihr Projekt bedeutet ============ */}
        <div className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] lg:gap-12">
          <SectionHeading
            as="h3"
            eyebrow="Ihr Vorteil"
            title="Was das für Ihr Projekt bedeutet"
            lead="Weniger Übergaben, mehr Verantwortung an einer Stelle."
            className="lg:self-start"
          >
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col lg:items-start">
              <Button href="/angebot?objekt=gewerbe" pfeil>
                Ersteinschätzung anfordern
              </Button>
              <Button href="/termin" variant="secondary" icon={CalendarCheck2}>
                Termin vereinbaren
              </Button>
            </div>
          </SectionHeading>

          <ul className="ov-no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
            {NUTZEN.map((n, i) => {
              const Icon = mannschaftIcon(n.icon);
              return (
                <Reveal
                  as="li"
                  key={n.id}
                  delay={i * 90}
                  className="ov-card-hover flex w-[84%] shrink-0 snap-start flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70 sm:w-[60%] md:w-auto md:p-7"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-500 text-white shadow-[0_10px_24px_-10px_rgba(102,153,51,0.8)]">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <h4 className="mt-5 font-display text-[18.5px] font-bold leading-snug text-ink-900">{n.titel}</h4>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-600">{n.text}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
