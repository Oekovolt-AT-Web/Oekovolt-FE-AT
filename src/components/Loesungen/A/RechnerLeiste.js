// src/components/Loesungen/A/RechnerLeiste.js
//
// Werkzeuge/Rechner und Services zum Weiterklicken – drei Darstellungen:
// - Standard: Kartenraster mit Lichtkante.
// - kompakt (+ mini): schlanke Liste, z. B. neben den FAQ.
// - variante="schaufenster": Produkt-Schaufenster wie auf der Startseite (Rechner & Tools), für
//   helle Abschnitte: weiße Karten mit dunklem „Bildschirm“, darin eine gezeichnete Vorschau des
//   Werkzeugs, die sich beim Eintritt aufbaut; Lichtkegel folgt dem Mauszeiger.
//
// Server-Komponente. Client-Inseln: S04Buehne (Aufbau), S04Spot (Lichtkegel).

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import S04Buehne from "@/components/Startseite/s04-Buehne";
import S04Spot from "@/components/Startseite/s04-Spot";
import { S04_BASIS } from "@/components/Startseite/s04-stil";
import {
  VorschauBlackout,
  VorschauEeg,
  VorschauFlotte,
  VorschauFoerderung,
  VorschauGewerbe,
  VorschauPeak,
  VorschauStandort,
} from "@/components/Startseite/s04-Vorschau";
import { W24VorschauCo2, W24VorschauLastgang } from "@/components/Loesungen/w24-Motive";

const MOTIVE = {
  gewerbe: VorschauGewerbe,
  peak: VorschauPeak,
  flotte: VorschauFlotte,
  eeg: VorschauEeg,
  blackout: VorschauBlackout,
  standort: VorschauStandort,
  co2: W24VorschauCo2,
  lastgang: W24VorschauLastgang,
};

const CSS = `
${S04_BASIS}
.s04-regler-fuell{transform:scaleX(.72)}
.s04-regler-bahn{transform:translate3d(72%,0,0)}
.s04-schicht{transform:translate3d(100%,0,0)}
.s04-tippen{transform-origin:0 50%}
.s04-ring{stroke-dasharray:.72 1}
.s04-bereit:not(.s04-an) .s04-regler-fuell{transform:scaleX(.26)}
.s04-bereit:not(.s04-an) .s04-regler-bahn{transform:translate3d(26%,0,0)}
.s04-bereit:not(.s04-an) .s04-schicht{transform:translate3d(0,0,0)}
.s04-bereit:not(.s04-an) .s04-tippen{transform:scaleX(0)}
.s04-bereit:not(.s04-an) .s04-ring{stroke-dashoffset:.72}
.s04-an .s04-regler-fuell,.s04-an .s04-regler-bahn{transition:transform 1.3s cubic-bezier(.65,0,.35,1) .35s}
.s04-an .s04-tippen{transition:transform .9s steps(9,end) .2s}
.s04-an .s04-schicht{transition:transform .7s cubic-bezier(.65,0,.35,1) 1.05s}
.s04-an .s04-ring{transition:stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1) var(--s04-d,0ms)}
.s04-fluss{stroke-dasharray:4 7}
.s04-an .s04-fluss{animation:w24rl-fluss 1.1s linear 3;animation-delay:var(--s04-d,0ms)}
@media (hover:hover){.w24rl-karte:hover .s04-fluss{animation:w24rl-fluss .9s linear infinite}}
@keyframes w24rl-fluss{to{stroke-dashoffset:-22}}

.w24rl-karte{transition:box-shadow .5s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)}
@media (hover:hover) and (prefers-reduced-motion:no-preference){.w24rl-karte:hover{transform:translate3d(0,-4px,0)}}
@media (hover:hover){.w24rl-karte:hover{box-shadow:0 2px 6px -2px rgba(15,23,42,.06),0 36px 70px -34px rgba(15,23,42,.42),0 0 0 1px rgba(102,153,51,.35)}}
.w24rl-schirm{background:radial-gradient(120% 100% at 0% 0%,rgba(31,90,161,.28),transparent 58%),linear-gradient(180deg,#0a1d3d 0%,#061530 100%);isolation:isolate}
.w24rl-licht{position:absolute;left:0;top:0;width:420px;height:420px;margin:-210px 0 0 -210px;border-radius:9999px;pointer-events:none;opacity:0;background:radial-gradient(circle,rgba(140,186,88,.2),transparent 62%);transform:translate3d(var(--s04-mx,-999px),var(--s04-my,-999px),0);transition:opacity .45s ease;z-index:0}
@media (hover:hover){.w24rl-karte:hover .w24rl-licht{opacity:1}}
.w24rl-pfeil{transition:transform .35s cubic-bezier(.22,1,.36,1),background-color .35s,color .35s}
.w24rl-karte:hover .w24rl-pfeil{transform:translate3d(2px,-2px,0)}
.w24rl-mini{transition:box-shadow .35s,transform .45s cubic-bezier(.22,1,.36,1)}
@media (hover:hover){.w24rl-mini:hover{box-shadow:0 18px 40px -26px rgba(15,23,42,.4),0 0 0 1px rgba(102,153,51,.35)}}
@media (prefers-reduced-motion:reduce){
  .s04-an .s04-fluss,.w24rl-karte:hover .s04-fluss{animation:none}
  .w24rl-licht{display:none}
}
`;

/**
 * items: [{ icon, titel, text, href, tag?, motiv?, format?, spalten?, cta? }]
 *   motiv:  gewerbe | peak | flotte | eeg | blackout | standort | co2 | lastgang | foerder
 *   format (nur Schaufenster): gross | karte | band | kachel | link
 *     – ohne Angabe: mit Motiv „karte“, sonst „kachel“.
 *   spalten: Tailwind-Spaltenklasse für lg (z. B. "lg:col-span-5").
 * variante: "schaufenster" für das Produkt-Schaufenster; alle: { label, href } (Schaufenster-Kopf).
 */
export default function RechnerLeiste({ eyebrow = "Selbst rechnen", titel, text, items = [], kompakt = false, mini = false, spaltenKlasse, variante, alle, className }) {
  if (variante === "schaufenster") return <Schaufenster eyebrow={eyebrow} titel={titel} text={text} items={items} alle={alle} className={className} />;

  const spalten = items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : items.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div data-blk="rechnerleiste" className={className}>
      <style>{CSS}</style>
      {(titel || text) && (
        <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="max-w-2xl">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">{eyebrow}</p>
            {titel && <h2 className="ov-h2 mt-3 text-ink-900">{titel}</h2>}
          </div>
          {text && <p className="max-w-md text-[15.5px] leading-relaxed text-ink-600">{text}</p>}
        </div>
      )}
      <ul className={cn("grid gap-4 md:gap-5", spaltenKlasse || spalten, kompakt && "gap-2.5 md:gap-2.5")}>
        {items.map((it, i) => (
          <Reveal as="li" key={it.href} delay={i * 60} className="flex">
            {kompakt ? (
              <Link
                href={it.href}
                className={cn(
                  "w24rl-mini group relative flex w-full items-center gap-3.5 bg-white ring-1 ring-ink-900/[0.07] outline-none focus-visible:ring-2 focus-visible:ring-ov-500",
                  mini ? "min-h-[60px] rounded-2xl px-3 py-2.5" : "rounded-3xl p-5"
                )}
              >
                <span className={cn("flex shrink-0 items-center justify-center bg-ov-50 text-ov-600 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white", mini ? "h-10 w-10 rounded-xl" : "h-11 w-11 rounded-2xl")}>
                  {it.icon && <it.icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[15.5px] font-bold leading-snug text-ink-900">{it.titel}</span>
                  {!mini && it.text && <span className="mt-1 block text-[14px] leading-snug text-ink-600">{it.text}</span>}
                </span>
                <span aria-hidden="true" className="w24rl-pfeil flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-600 ring-1 ring-ink-900/[0.06] group-hover:bg-ov-500 group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            ) : (
              <Link
                href={it.href}
                className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 hover:ring-ov-300 md:p-7"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-ov-400 to-sun-400 transition-transform duration-500 group-hover:scale-x-100" />
                <span className="flex items-center justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-50 text-ov-600 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white">
                    {it.icon && <it.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />}
                  </span>
                  {it.tag && <span className="rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-600">{it.tag}</span>}
                </span>
                <h3 className="mt-5 font-display text-[18px] font-bold leading-snug text-ink-900">{it.titel}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-600">{it.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-700">
                  Öffnen
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            )}
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Schaufenster                                                        */
/* ------------------------------------------------------------------ */

function format(it) {
  if (it.format) return it.format;
  return it.motiv ? "karte" : "kachel";
}

function Kopf({ it, hell }) {
  const Icon = it.icon;
  return (
    <span className="relative flex items-center justify-between gap-4">
      <span className="flex items-center gap-2.5">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", hell ? "bg-white/[0.07] text-ov-300 ring-1 ring-white/10" : "bg-ov-50 text-ov-600")}>
          {Icon && <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />}
        </span>
        {it.tag && (
          <span className={cn("rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em]", hell ? "bg-sun-400/15 text-sun-300 ring-1 ring-sun-400/25" : "bg-sand-100 text-ink-600")}>{it.tag}</span>
        )}
      </span>
      <span aria-hidden="true" className="w24rl-pfeil flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-600 ring-1 ring-ink-900/[0.06] group-hover:bg-ov-500 group-hover:text-white">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </span>
  );
}

function Karte({ it, gross }) {
  const Motiv = MOTIVE[it.motiv];
  const breitMotiv = it.motiv === "gewerbe";
  return (
    <Link
      href={it.href}
      data-s04-karte=""
      className="w24rl-karte group relative flex w-full flex-col overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_60px_-40px_rgba(15,23,42,0.4)] ring-1 ring-ink-900/[0.07] outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-4"
    >
      {/* Bildschirm mit Vorschau */}
      <span aria-hidden="true" className={cn("w24rl-schirm relative flex flex-col overflow-hidden rounded-[1.35rem]", gross ? "p-4 sm:p-6" : it.motiv === "peak" ? "flex-1 p-4 sm:p-5" : "p-3")}>
        <span className="w24rl-licht" />
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <span className={cn("relative flex flex-1 flex-col", !gross && !breitMotiv && it.motiv !== "peak" && "h-[132px]")}>{Motiv && (breitMotiv ? <Motiv pfad={it.href} /> : <Motiv />)}</span>
      </span>
      {/* Text */}
      <span className={cn("relative flex flex-col", it.motiv !== "peak" && "flex-1", gross ? "px-4 pb-4 pt-5 sm:px-5 sm:pb-5 sm:pt-6" : "px-3.5 pb-4 pt-4 sm:px-4")}>
        <Kopf it={it} />
        <span
          className={cn(
            "mt-4 block font-display font-extrabold leading-tight tracking-[-0.02em] text-ink-900",
            gross ? "text-[clamp(1.4rem,1.15rem+0.9vw,1.85rem)]" : "text-[18.5px] font-bold"
          )}
        >
          {it.titel}
        </span>
        {it.text && <span className={cn("mt-1.5 block leading-relaxed text-ink-600", gross ? "max-w-xl text-[15.5px]" : "text-[14.5px]")}>{it.text}</span>}
        {it.cta && (
          <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[14.5px] font-semibold text-ov-700">
            {it.cta}
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        )}
      </span>
    </Link>
  );
}

function Kachel({ it }) {
  const Icon = it.icon;
  return (
    <Link
      href={it.href}
      className="w24rl-mini group relative flex w-full flex-1 items-start gap-4 rounded-[1.5rem] bg-white p-5 ring-1 ring-ink-900/[0.07] outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white">
        {Icon && <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />}
      </span>
      <span className="min-w-0 flex-1">
        {it.tag && <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ov-700">{it.tag}</span>}
        <span className="mt-0.5 block font-display text-[17px] font-bold leading-snug text-ink-900">{it.titel}</span>
        {it.text && <span className="mt-1 block text-[14px] leading-relaxed text-ink-600">{it.text}</span>}
      </span>
      <span aria-hidden="true" className="w24rl-pfeil flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-600 ring-1 ring-ink-900/[0.06] group-hover:bg-ov-500 group-hover:text-white">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

function Band({ it }) {
  const Icon = it.icon;
  return (
    <Link
      href={it.href}
      data-s04-karte=""
      className="w24rl-karte ov-noise group relative flex w-full flex-col gap-6 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-ov-600 via-ov-700 to-ov-900 p-6 outline-none focus-visible:ring-2 focus-visible:ring-ov-400 focus-visible:ring-offset-4 sm:p-8 lg:flex-row lg:items-center lg:gap-10"
    >
      <span aria-hidden="true" className="w24rl-licht" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sun-300/20 blur-3xl" />
      <span className="relative flex items-start gap-4 lg:max-w-md lg:flex-1">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20">
          {Icon && <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />}
        </span>
        <span className="block">
          <span className="block font-display text-[22px] font-extrabold tracking-[-0.02em] text-white">{it.titel}</span>
          {it.text && <span className="mt-1 block text-[15px] leading-relaxed text-white/85">{it.text}</span>}
        </span>
      </span>
      {it.motiv === "foerder" && (
        <span className="relative block lg:flex-1">
          <VorschauFoerderung />
        </span>
      )}
      <span className="relative inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-ov-800 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-[1.03] lg:self-center">
        {it.cta || "Öffnen"}
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function Schaufenster({ eyebrow, titel, text, items, alle, className }) {
  const gruppe = items.filter((it) => format(it) === "kachel");
  const links = items.filter((it) => format(it) === "link");
  let gruppeGesetzt = false;

  return (
    <div data-blk="rechnerleiste" className={className}>
      <style>{CSS}</style>
      {(titel || text) && (
        <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <Reveal className="lg:col-span-7">
            {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
            {titel && <h2 className="ov-h2 text-ink-900">{titel}</h2>}
          </Reveal>
          {(text || alle) && (
            <Reveal delay={120} className="lg:col-span-5">
              {text && <p className="max-w-[34rem] text-[16px] leading-relaxed text-ink-600 md:text-[17px]">{text}</p>}
              {alle && (
                <div className="mt-6">
                  <Button href={alle.href} variant="secondary" pfeil>
                    {alle.label}
                  </Button>
                </div>
              )}
            </Reveal>
          )}
        </div>
      )}

      <S04Spot className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-12">
        {items.map((it) => {
          const f = format(it);
          if (f === "link") return null;
          if (f === "kachel") {
            if (gruppeGesetzt) return null;
            gruppeGesetzt = true;
            return (
              <S04Buehne key="kacheln" className={cn("grid gap-4 sm:col-span-2 sm:grid-cols-2 md:gap-5 lg:grid-cols-1", it.spalten || "lg:col-span-4")}>
                {gruppe.map((g) => (
                  <div key={g.href} className="s04-hoch flex">
                    <Kachel it={g} />
                  </div>
                ))}
              </S04Buehne>
            );
          }
          if (f === "band") {
            return (
              <S04Buehne key={it.href} className="flex sm:col-span-2 lg:col-span-12">
                <Band it={it} />
              </S04Buehne>
            );
          }
          const gross = f === "gross";
          return (
            <S04Buehne key={it.href} className={cn("flex", gross ? "sm:col-span-2 lg:col-span-7" : it.motiv === "peak" ? "sm:col-span-2 lg:col-span-5" : "", it.spalten || (!gross && it.motiv !== "peak" ? "lg:col-span-4" : ""))}>
              <Karte it={it} gross={gross} />
            </S04Buehne>
          );
        })}
      </S04Spot>

      {links.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 border-t border-ink-900/[0.08] pt-7 md:mt-10 lg:flex-row lg:items-center lg:gap-6">
          <p className="shrink-0 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Außerdem</p>
          <ul className="flex flex-wrap gap-2">
            {links.map((it) => {
              const Icon = it.icon;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 text-[14px] font-medium text-ink-700 ring-1 ring-ink-900/[0.08] transition-colors hover:text-ink-900 hover:ring-ov-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
                  >
                    {Icon && <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" strokeWidth={1.8} />}
                    {it.titel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
