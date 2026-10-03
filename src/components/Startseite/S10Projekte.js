// src/components/Startseite/S10Projekte.js
//
// Startseite – Abschnitt: Neueste Projekte.
// Eingebunden in src/app/page.js (Prop `projekte`: die vier neuesten Projekte aus dem Backoffice,
// { title, slug, bild, leistung, jahr, kwp }).
//
// Gestaltung: redaktionelles Raster im Schachbrett aus breiten und schmalen Bildern (7/5 · 5/7),
// Bildunterschrift statt Text auf dem Foto. Aufbau beim Eintritt (einmal, gestaffelt):
//   Maske gibt das Foto von unten nach oben frei, das Foto setzt sich aus leichtem Zoom,
//   danach kWp-Kapsel (zählt hoch) und Bildunterschrift mit feiner Linie.
// Hover: ruhiger Zoom, Lichtkante zieht über das Foto, Pfeil und Linie werden grün.
// Mobil: wischbare Reihe mit Anschnitt der nächsten Karte (Scroll-Snap), ohne Seitenüberlauf.

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import S10Sicht from "./s10-sicht";
import S10Zahl from "./s10-zahl";

// Breiten im 12er-Raster (Desktop): Schachbrett breit/schmal – schmal/breit
const SPANNEN = {
  1: [12],
  2: [7, 5],
  3: [7, 5, 12],
  4: [7, 5, 5, 7],
};
const SPAN_KLASSE = { 5: "lg:col-span-5", 7: "lg:col-span-7", 12: "lg:col-span-12" };
const SIZES = {
  5: "(min-width: 1280px) 520px, (min-width: 1024px) 40vw, (min-width: 640px) 50vw, 86vw",
  7: "(min-width: 1280px) 720px, (min-width: 1024px) 56vw, (min-width: 640px) 50vw, 86vw",
  12: "(min-width: 1280px) 1216px, (min-width: 640px) 100vw, 86vw",
};
const ANZAHL = { 2: "zwei", 3: "drei", 4: "vier" };

const stellenVon = (v) => (Number.isInteger(v) ? 0 : 2);
const kwpText = (p) => String(p.leistung || "").replace(/\s*kWp/i, "").trim();

export default function StartProjekte({ projekte = [] }) {
  if (!projekte.length) return null;
  const spannen = SPANNEN[Math.min(projekte.length, 4)];
  const summe = Math.round(projekte.reduce((s, p) => s + (Number(p.kwp) || 0), 0));
  const zeigeSumme = projekte.length > 1 && summe > 0;

  return (
    <Section data-start="projekte" tone="white" space="lg">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
        <SectionHeading eyebrow="Referenzen" title="Unsere neuesten Photovoltaik-Projekte in Österreich" />
        <Reveal delay={120} className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 lg:flex-col lg:items-end lg:gap-6">
          {zeigeSumme && (
            <div className="lg:text-right">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                Leistung der {ANZAHL[projekte.length] || projekte.length} neuesten Anlagen
              </p>
              <p className="mt-1.5 font-display text-[34px] font-extrabold leading-none tracking-[-0.03em] text-ink-900 md:text-[44px]">
                <S10Zahl wert={summe} dauer={1800} fest={false} />
                <span className="ml-2 text-[0.5em] font-bold tracking-[-0.01em] text-ov-600">kWp</span>
              </p>
            </div>
          )}
          <Button href="/referenzen/projekte" variant="secondary" pfeil>
            Alle Projekte
          </Button>
        </Reveal>
      </div>

      <S10Sicht
        as="ul"
        schwelle={0.12}
        className="ov-no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-3 pt-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:px-0 sm:pb-0 md:mt-16 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-14"
      >
        {projekte.map((p, i) => {
          const span = spannen[i] || 12;
          const kwp = Number(p.kwp) || 0;
          const nr = String(i + 1).padStart(2, "0");
          return (
            <li
              key={p.slug}
              className={`s10-p-karte w-[86%] shrink-0 snap-start sm:w-auto ${SPAN_KLASSE[span]}`}
              style={{ "--s10-i": i }}
            >
              <Link
                href={`/referenzen/projekte/${p.slug}`}
                className="group block rounded-[1.75rem] outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-4"
              >
                <div className="s10-p-bild relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-navy-950 lg:aspect-auto lg:h-[clamp(300px,28.5vw,412px)]">
                  <div className="s10-p-zoom absolute inset-0">
                    <div className="s10-p-hover absolute inset-0">
                      <Image
                        src={p.bild || "/Images/Referenzen/Projekte-1.jpg"}
                        alt={`Photovoltaik-Projekt ${p.title}`}
                        fill
                        sizes={SIZES[span]}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  {/* Tiefe: unten leicht abgedunkelt für die Kapsel, oben feine Lichtkante */}
                  <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/60 via-navy-950/0 to-navy-950/0" />
                  <div aria-hidden="true" className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
                  <span aria-hidden="true" className="s10-p-licht pointer-events-none absolute inset-y-0 -left-1/2 w-1/2" />
                  <span aria-hidden="true" className="s10-p-maske absolute inset-0 bg-white" />

                  {(kwp > 0 || p.leistung) && (
                    <span className="s10-p-kapsel absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-navy-950/55 py-2 pl-2.5 pr-4 text-white ring-1 ring-inset ring-white/15 backdrop-blur-md md:bottom-5 md:left-5">
                      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0">
                        <circle cx="10" cy="10" r="4" fill="#ffc53d" />
                        <g stroke="#ffc53d" strokeWidth="1.6" strokeLinecap="round">
                          <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" />
                        </g>
                      </svg>
                      <span className="font-display text-[15px] font-bold tracking-[-0.01em] md:text-[16px]">
                        {kwp > 0 ? <S10Zahl wert={kwp} stellen={stellenVon(kwp)} verzoegerung={500 + i * 140} /> : kwpText(p)}
                        <span className="ml-1 font-semibold text-white/70">kWp</span>
                      </span>
                    </span>
                  )}

                  <span aria-hidden="true" className="s10-p-pfeil absolute right-4 top-4 md:right-5 md:top-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-[0_8px_24px_-10px_rgba(3,18,43,0.5)] transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white">
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" strokeWidth={2} />
                    </span>
                  </span>
                </div>

                {/* Bildunterschrift: Indexlinie (fluchtet über die Reihe), darunter der Projektname */}
                <div className="s10-p-text mt-5 md:mt-6">
                  <div className="flex items-center gap-3 text-[13px] text-ink-500">
                    <span className="ov-num font-display font-bold tracking-[0.04em] text-ov-600">{nr}</span>
                    <span aria-hidden="true" className="relative h-px flex-1 overflow-hidden bg-ink-200">
                      <span className="s10-p-linie absolute inset-0 bg-ov-500" />
                    </span>
                    <span className="shrink-0 font-medium transition-colors duration-300 group-hover:text-ov-700">
                      {p.jahr > 0 ? `${p.jahr} · ` : ""}Projekt ansehen
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-display text-[19px] font-bold leading-snug tracking-[-0.015em] text-ink-900 transition-colors duration-300 group-hover:text-ov-700 md:text-[22px]">
                    {p.title}
                  </h3>
                </div>
              </Link>
            </li>
          );
        })}
      </S10Sicht>

      <style>{STIL}</style>
    </Section>
  );
}

const STIL = `
.s10-p-maske { transform-origin: 50% 0%; transform: scaleY(0); }
.s10-p-linie { transform-origin: 0 50%; transform: scaleX(0); transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1); }
.group:hover .s10-p-linie, .group:focus-visible .s10-p-linie { transform: scaleX(1); }
.s10-p-licht {
  background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 100%);
  transform: translate3d(0, 0, 0) skewX(-12deg);
  opacity: 0;
}
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .s10-p-hover { transition: transform 1400ms cubic-bezier(0.22, 1, 0.36, 1); }
  .group:hover .s10-p-hover { transform: scale(1.045); }
  .group:hover .s10-p-licht { opacity: 1; transform: translate3d(320%, 0, 0) skewX(-12deg); transition: transform 1100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms; }
}
@media (prefers-reduced-motion: no-preference) {
  [data-s10-an] .s10-p-maske { transition: transform 1150ms cubic-bezier(0.77, 0, 0.18, 1) calc(var(--s10-i) * 140ms + 80ms); }
  [data-s10-an] .s10-p-zoom { transition: transform 1700ms cubic-bezier(0.22, 1, 0.36, 1) calc(var(--s10-i) * 140ms + 80ms); }
  [data-s10-an] .s10-p-kapsel, [data-s10-an] .s10-p-pfeil {
    transition: opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) calc(var(--s10-i) * 140ms + 650ms),
      transform 700ms cubic-bezier(0.22, 1, 0.36, 1) calc(var(--s10-i) * 140ms + 650ms);
  }
  [data-s10-an] .s10-p-text {
    transition: opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) calc(var(--s10-i) * 140ms + 420ms),
      transform 800ms cubic-bezier(0.22, 1, 0.36, 1) calc(var(--s10-i) * 140ms + 420ms);
  }
  [data-s10-bereit]:not([data-s10-an]) .s10-p-maske { transform: scaleY(1); }
  [data-s10-bereit]:not([data-s10-an]) .s10-p-zoom { transform: scale(1.14); }
  [data-s10-bereit]:not([data-s10-an]) .s10-p-kapsel { opacity: 0; transform: translate3d(0, 10px, 0); }
  [data-s10-bereit]:not([data-s10-an]) .s10-p-pfeil { opacity: 0; transform: scale(0.6); }
  [data-s10-bereit]:not([data-s10-an]) .s10-p-text { opacity: 0; transform: translate3d(0, 16px, 0); }
}
`;
