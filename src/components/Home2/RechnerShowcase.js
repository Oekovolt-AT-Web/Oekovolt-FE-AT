// src/components/Home2/RechnerShowcase.js
//
// Startseite: „Rechner & Tools“ als Produkt-Schaufenster (Stripe-/Linear-Stil).
// Jede Karte zeigt eine kleine, gezeichnete Vorschau des Werkzeugs, die sich beim
// Eintritt einmal aufbaut (Regler bewegt sich → Balken wachsen → Kennzahl-Kacheln).
// Beim Überfahren mit der Maus folgt ein Lichtkegel dem Zeiger und lässt die Kante
// aufleuchten; Energieflüsse laufen nur, solange die Karte überfahren wird.
//
// Server-Komponente: Titel, Texte und Links aus src/components/Rechner/tools.js.
// Client-Inseln: S04Buehne (Aufbau je Karte), S04Spot (Lichtkegel).

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { TOOLS } from "@/components/Rechner/tools";
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

const tool = (id) => TOOLS.find((t) => t.id === id);

const KLEIN = [
  { id: "e-flotte", motiv: VorschauFlotte },
  { id: "energiegemeinschaft", motiv: VorschauEeg },
  { id: "blackout", motiv: VorschauBlackout },
  { id: "standort-check", motiv: VorschauStandort },
];

// „Außerdem“: weitere Werkzeuge als Schnellzugriff (nur vorhandene Einträge)
const WEITERE = ["solarrechner", "co2-esg", "freiflaeche-pacht", "finanzierungsvergleich", "lastgang-analyse", "stromspeicher", "pv-prognose", "dynamisch"];

const CSS = `
${S04_BASIS}
.s04-karte{isolation:isolate}
.s04-flaeche{background:radial-gradient(120% 90% at 0% 0%,rgba(31,90,161,.20),transparent 55%),linear-gradient(180deg,#0a1d3d 0%,#061530 100%)}
.s04-schirm{background:linear-gradient(180deg,rgba(4,17,42,.75),rgba(4,17,42,.45));box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
.s04-rand,.s04-licht{position:absolute;left:0;top:0;border-radius:9999px;pointer-events:none;opacity:0;transform:translate3d(var(--s04-mx,-999px),var(--s04-my,-999px),0);transition:opacity .45s ease}
.s04-rand{width:340px;height:340px;margin:-170px 0 0 -170px;background:radial-gradient(circle,rgba(190,225,140,.9),rgba(140,186,88,.25) 35%,transparent 65%);z-index:0}
.s04-licht{width:560px;height:560px;margin:-280px 0 0 -280px;background:radial-gradient(circle,rgba(140,186,88,.13),transparent 62%)}
.s04-karte--gruen .s04-licht{background:radial-gradient(circle,rgba(255,216,115,.18),transparent 62%)}
@media (hover:hover){.s04-karte:hover .s04-rand,.s04-karte:hover .s04-licht{opacity:1}}
.s04-hebt{transition:transform .6s cubic-bezier(.22,1,.36,1)}
@media (hover:hover) and (prefers-reduced-motion:no-preference){.s04-karte:hover .s04-hebt{transform:translate3d(0,-5px,0)}}
.s04-pfeil{transition:transform .35s cubic-bezier(.22,1,.36,1),background-color .35s,color .35s}
.s04-karte:hover .s04-pfeil{transform:translate3d(2px,-2px,0)}

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
.s04-an .s04-fluss{animation:s04-fluss 1.1s linear 3;animation-delay:var(--s04-d,0ms)}
@media (hover:hover){.s04-karte:hover .s04-fluss{animation:s04-fluss .9s linear infinite}}
@keyframes s04-fluss{to{stroke-dashoffset:-22}}
@media (prefers-reduced-motion:reduce){
  .s04-an .s04-fluss,.s04-karte:hover .s04-fluss{animation:none}
  .s04-rand,.s04-licht{display:none}
}
`;

/** Gemeinsamer Kartenrahmen: 1-px-Lichtkante + Fläche + Lichtkegel. */
function Karte({ href, className, innenClass, gruen, children }) {
  return (
    <Link
      href={href}
      data-s04-karte=""
      className={`s04-karte group relative flex w-full overflow-hidden rounded-[1.75rem] p-px outline-none focus-visible:ring-2 focus-visible:ring-ov-300 focus-visible:ring-offset-4 focus-visible:ring-offset-navy-950 ${
        gruen ? "s04-karte--gruen bg-white/25" : "bg-white/[0.09]"
      } ${className || ""}`}
    >
      <span aria-hidden="true" className="s04-rand" />
      <span
        className={`relative z-[1] flex w-full flex-col overflow-hidden rounded-[calc(1.75rem-1px)] ${
          gruen ? "ov-noise bg-gradient-to-br from-ov-600 via-ov-700 to-ov-900" : "s04-flaeche"
        } ${innenClass || ""}`}
      >
        <span aria-hidden="true" className="s04-licht" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        {children}
      </span>
    </Link>
  );
}

function Kopf({ t, tag }) {
  const Icon = t.icon;
  return (
    <span className="relative flex items-center justify-between gap-4">
      <span className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-ov-300 ring-1 ring-white/10">
          <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </span>
        {tag && <span className="rounded-full bg-sun-400/15 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-sun-300 ring-1 ring-sun-400/25">{tag}</span>}
      </span>
      <span className="s04-pfeil flex h-9 w-9 items-center justify-center rounded-full text-white/45 ring-1 ring-white/10 group-hover:bg-white group-hover:text-navy-950">
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </span>
    </span>
  );
}

export default function RechnerShowcase() {
  const gewerbe = tool("gewerbe-pv");
  const peak = tool("peak-shaving");
  const foerder = tool("foerdercheck");
  const weitere = WEITERE.map(tool).filter(Boolean);

  return (
    <>
      <style>{CSS}</style>
      <S04Spot className="grid gap-4 md:gap-5 lg:grid-cols-12">
        {/* ---------- Gewerbe-PV: das Hauptprodukt ---------- */}
        {gewerbe && (
          <S04Buehne className="flex lg:col-span-7">
            <Karte href={gewerbe.href} innenClass="p-5 sm:p-7">
              <Kopf t={gewerbe} tag={gewerbe.tag} />
              <span aria-hidden="true" className="s04-hebt relative mt-5 block sm:mt-6">
                <VorschauGewerbe pfad={gewerbe.href} />
              </span>
              <span className="relative mt-6 block sm:mt-7">
                <span className="block font-display text-[clamp(1.45rem,1.15rem+1vw,2rem)] font-extrabold leading-tight tracking-[-0.025em] text-white">{gewerbe.titel}</span>
                <span className="mt-2 block max-w-md text-[15px] leading-relaxed text-white/60">{gewerbe.kurz}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ov-300">
                  Hallendach durchrechnen
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </span>
            </Karte>
          </S04Buehne>
        )}

        {/* ---------- Peak-Shaving ---------- */}
        {peak && (
          <S04Buehne className="flex lg:col-span-5">
            <Karte href={peak.href} innenClass="p-5 sm:p-7">
              <Kopf t={peak} />
              <span aria-hidden="true" className="s04-hebt s04-schirm relative mt-5 flex flex-1 flex-col rounded-2xl p-4 ring-1 ring-white/[0.07] sm:mt-6 sm:p-5">
                <VorschauPeak />
              </span>
              <span className="relative mt-6 block sm:mt-7">
                <span className="block font-display text-[clamp(1.3rem,1.1rem+0.6vw,1.6rem)] font-extrabold leading-tight tracking-[-0.02em] text-white">{peak.titel}</span>
                <span className="mt-2 block text-[15px] leading-relaxed text-white/60">{peak.kurz}</span>
              </span>
            </Karte>
          </S04Buehne>
        )}

        {/* ---------- Vier kleine Werkzeuge (mobil: wischen) ---------- */}
        <ul className="ov-no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 md:gap-5 lg:col-span-12 lg:grid-cols-4">
          {KLEIN.map((k) => {
            const t = tool(k.id);
            if (!t) return null;
            const Motiv = k.motiv;
            return (
              <S04Buehne as="li" key={k.id} className="flex w-[80%] shrink-0 snap-start sm:w-auto">
                <Karte href={t.href} innenClass="p-5 md:p-6">
                  <Kopf t={t} />
                  <span aria-hidden="true" className="s04-hebt s04-schirm relative mt-4 block h-[132px] rounded-2xl p-3 ring-1 ring-white/[0.07]">
                    <Motiv />
                  </span>
                  <span className="relative mt-5 block">
                    <span className="block font-display text-[18px] font-bold leading-snug tracking-[-0.01em] text-white">{t.titel}</span>
                    <span className="mt-1.5 block text-[14px] leading-relaxed text-white/55">{t.kurz}</span>
                  </span>
                </Karte>
              </S04Buehne>
            );
          })}
        </ul>

        {/* ---------- Förder-Check als Band ---------- */}
        {foerder && (
          <S04Buehne className="flex lg:col-span-12">
            <Karte href={foerder.href} gruen innenClass="gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10">
              <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sun-300/20 blur-3xl" />
              <span className="relative flex items-start gap-4 lg:max-w-md lg:flex-1">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20">
                  <foerder.icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="block">
                  <span className="block font-display text-[22px] font-extrabold tracking-[-0.02em] text-white">{foerder.titel}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-white/85">{foerder.text}</span>
                </span>
              </span>
              <span className="relative block lg:flex-1">
                <VorschauFoerderung />
              </span>
              <span className="relative inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-ov-800 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-[1.03] lg:self-center">
                Förder-Check starten
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Karte>
          </S04Buehne>
        )}
      </S04Spot>

      {/* ---------- Außerdem ---------- */}
      {weitere.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.08] pt-7 md:mt-10 lg:flex-row lg:items-center lg:gap-6">
          <p className="shrink-0 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-white/45">Außerdem</p>
          <ul className="ov-no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {weitere.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.id}>
                  <Link
                    href={t.href}
                    className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full bg-white/[0.05] px-3.5 text-[13.5px] font-medium text-white/75 ring-1 ring-white/10 transition-colors hover:bg-white/[0.1] hover:text-white hover:ring-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-300"
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 text-ov-300" strokeWidth={1.8} />
                    {t.titel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
