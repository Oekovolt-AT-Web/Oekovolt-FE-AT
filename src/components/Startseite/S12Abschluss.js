// src/components/Startseite/S12Abschluss.js
//
// Startseite – Abschnitt: Abschluss-CTA und Bildnachweis.
// Eingebunden in src/app/page.js.
//
// Gestaltung: dunkle Bühne als Finale (abgesetzt vom ebenfalls dunklen Footer durch hellen Rand).
// Über dem Text die Botschaft, darunter geht die Sonne über einem Modulfeld auf (s10-sonnenfeld.js).
// Choreografie beim Eintritt (einmal):
//   0 ms     Überschrift steigt zeilenweise aus Masken, Horizont zeichnet sich von der Mitte aus
//   300 ms   Bahnen um die Sonne zeichnen sich, Sonne steigt auf, Lichthof blendet ein
//   700 ms   Strahlen zeichnen sich von innen nach außen, Modulfeld setzt sich
//   900 ms   Text, Handlungsaufrufe und Kontaktleiste
//   ab 2,6 s vereinzelte Energie-Impulse laufen aus der Sonne über das Feld (ruhig, selten)
// Ohne JS / bei prefers-reduced-motion: fertiges Bild ohne Bewegung.

import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Calculator, Clock, Phone, ShieldCheck } from "lucide-react";
import { FIRMA } from "@/lib/site";
import S10Sicht from "./s10-sicht";
import S10Sonnenfeld from "./s10-sonnenfeld";

const BILDNACHWEIS = [
  "Hotellerie & Tourismus: C.Stadler/Bwag, CC BY-SA 4.0 (Symbolbild)",
  "Gemeinden & Länder: Isiwal, CC BY-SA 4.0 (Symbolbild)",
  "Energiegemeinschaften: Isiwal, CC BY-SA 4.0 (Symbolbild)",
  "Freiflächenanlagen: C.Stadler/Bwag, CC BY-SA 4.0",
  "Agri-PV: Lisamiri, CC BY-SA 4.0 (Symbolbild, Deutschland)",
  "Luxus-Chalets: Mike Kotsch, CC0",
  "Gewerbespeicher: Bp 95, CC BY 4.0 (Ausschnitt)",
  "Ladeinfrastruktur: pedrik, CC BY 2.0 (Symbolbild)",
  "Reststromvermarktung: Christiankral, CC BY 4.0",
  "Leitwarte: Dpysh w, CC BY 3.0 (Symbolbild)",
];

const VERSPRECHEN = [
  { icon: BadgeCheck, text: "Seit 2012 in Österreich, Gruppe seit 2010" },
  { icon: ShieldCheck, text: "Planung, Netzanschluss, Montage & Betrieb aus einer Hand" },
  { icon: Clock, text: "Eigener Parkregler, Fernwartung & SCADA" },
];

export default function StartAbschluss() {
  return (
    <div data-start="abschluss" className="bg-sand-50">
      <section aria-labelledby="s10-abschluss-titel" className="px-3 pb-6 pt-4 md:px-6 md:pb-8 md:pt-6">
        <S10Sicht
          schwelle={0.25}
          className="s10-e ov-noise relative isolate mx-auto max-w-[90rem] overflow-hidden rounded-[2rem] bg-navy-950 text-white md:rounded-[2.75rem]"
        >
          {/* Himmel: Verlauf von Nachtblau zur Dämmerung über dem Horizont */}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_70%_at_50%_100%,#0b3a78_0%,#041d42_45%,#03122b_80%)]" />
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-50" />

          <div className="relative mx-auto max-w-[74rem] px-5 pt-16 text-center sm:px-8 md:pt-24 lg:pt-28">
            <p className="s10-e-auf inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-ov-300" style={{ "--s10-d": "0ms" }}>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sun-400 shadow-[0_0_12px_2px_rgba(255,197,61,0.6)]" />
              Kostenlos &amp; unverbindlich
            </p>
            <h2
              id="s10-abschluss-titel"
              className="mt-5 font-display text-[clamp(2rem,1.1rem+3.2vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.035em] [text-wrap:balance]"
            >
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="s10-e-zeile block" style={{ "--s10-d": "60ms" }}>
                  Ihr Dach, Ihre Fläche, Ihr Lastgang –
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="s10-e-zeile ov-text-gradient-light block" style={{ "--s10-d": "200ms" }}>
                  wir rechnen es durch.
                </span>
              </span>
            </h2>
            <p className="s10-e-auf mx-auto mt-6 max-w-[44rem] text-[16.5px] leading-[1.65] text-white/70 md:text-[18.5px]" style={{ "--s10-d": "800ms" }}>
              Persönliche Beratung vom Elektrotechnik-Fachbetrieb aus {FIRMA.ort}: ehrliche Wirtschaftlichkeitsrechnung, Förderprüfung und ein
              fester Ansprechpartner von der Planung bis zum Betrieb – in ganz Österreich.
            </p>
            <div className="s10-e-auf mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center" style={{ "--s10-d": "950ms" }}>
              <Link
                href="/angebot?objekt=gewerbe"
                className="s10-e-cta group relative inline-flex h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-sun-400 px-8 text-[16px] font-bold text-navy-950 shadow-[0_14px_40px_-12px_rgba(255,197,61,0.75)] outline-none transition-[background-color,box-shadow,transform] duration-300 hover:bg-sun-300 hover:shadow-[0_18px_48px_-12px_rgba(255,197,61,0.9)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-navy-950 active:scale-[0.98]"
              >
                <span aria-hidden="true" className="s10-e-glanz pointer-events-none absolute inset-y-0 -left-1/3 w-1/3" />
                <span className="relative">Ersteinschätzung anfordern</span>
                <ArrowRight aria-hidden="true" className="relative h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/rechner/gewerbe-pv"
                className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full px-8 text-[16px] font-semibold text-white ring-1 ring-inset ring-white/30 outline-none transition-colors duration-300 hover:bg-white/10 hover:ring-white/60 focus-visible:ring-2 focus-visible:ring-white"
              >
                <Calculator aria-hidden="true" className="h-[1.1em] w-[1.1em] text-sun-300" />
                Hallendach berechnen
              </Link>
            </div>
          </div>

          {/* Sonnenaufgang über dem Modulfeld – Strahlen laufen weich hinter den Text */}
          <div aria-hidden="true" className="pointer-events-none relative -z-10 mt-4 h-[260px] sm:h-[320px] lg:mt-2 lg:h-[420px]">
            <S10Sonnenfeld className="absolute inset-0 h-full w-full overflow-visible" />
          </div>

          {/* Kontaktleiste auf Glas über dem Modulfeld */}
          <div className="s10-e-auf relative mx-3 -mt-10 mb-3 grid gap-5 rounded-[1.5rem] border border-white/12 bg-navy-950/55 p-5 backdrop-blur-md sm:mx-5 sm:-mt-12 sm:mb-5 md:mx-6 md:mb-6 lg:-mt-12 md:p-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-10 lg:px-8" style={{ "--s10-d": "1150ms" }}>
            <a href={FIRMA.telefonHref} className="group flex items-center gap-4 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ov-500 transition-transform duration-300 group-hover:scale-105">
                <Phone aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-medium text-white/55">Lieber direkt sprechen?</span>
                <span className="ov-num block font-display text-[21px] font-extrabold tracking-[-0.02em] transition-colors group-hover:text-sun-300 md:text-[24px]">{FIRMA.telefon}</span>
                <span className="block text-[12.5px] text-white/50">
                  {FIRMA.oeffnungszeiten.map((o, i) => (
                    <Fragment key={o.tage}>
                      {i > 0 && " · "}
                      <span className="whitespace-nowrap">
                        {o.tage} {o.zeit}
                      </span>
                    </Fragment>
                  ))}
                </span>
              </span>
            </a>
            <ul className="grid gap-3 border-t border-white/10 pt-5 text-[14px] leading-snug text-white/80 sm:grid-cols-3 sm:gap-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {VERSPRECHEN.map((v) => (
                <li key={v.text} className="flex items-start gap-2.5">
                  <v.icon aria-hidden="true" className="mt-[2px] h-4 w-4 shrink-0 text-ov-300" />
                  <span className="min-w-0">{v.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </S10Sicht>
      </section>

      <p className="ov-container pb-8 pt-2 text-[11.5px] leading-relaxed text-ink-500">
        Bildnachweis: {BILDNACHWEIS.join(" · ")} – Details unter{" "}
        <Link href="/bildnachweis" className="underline underline-offset-2 hover:text-ink-700">
          Bildnachweis
        </Link>
        .
      </p>
      <style>{STIL}</style>
    </div>
  );
}

const STIL = `
.s10-e-strich { fill: none; stroke-dasharray: 1; stroke-dashoffset: 0; }
.s10-e-sonne { transform-box: fill-box; transform-origin: 50% 100%; }
.s10-e-impuls { stroke-dasharray: 0.045 1.2; stroke-dashoffset: 0.045; opacity: 0; }
.s10-e-glanz { background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%); transform: translate3d(0,0,0) skewX(-14deg); opacity: 0; }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .s10-e-cta:hover .s10-e-glanz { opacity: 1; transform: translate3d(440%, 0, 0) skewX(-14deg); transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 150ms; }
}
@media (prefers-reduced-motion: no-preference) {
  [data-s10-an] .s10-e-zeile { transition: transform 1100ms cubic-bezier(0.22, 1, 0.36, 1) var(--s10-d, 0ms); }
  [data-s10-an] .s10-e-auf { transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1) var(--s10-d, 0ms), transform 900ms cubic-bezier(0.22, 1, 0.36, 1) var(--s10-d, 0ms); }
  [data-s10-an] .s10-e-horizont { transition: stroke-dashoffset 1500ms cubic-bezier(0.65, 0, 0.35, 1) 150ms; }
  [data-s10-an] .s10-e-bahn { transition: stroke-dashoffset 1900ms cubic-bezier(0.65, 0, 0.35, 1) calc(300ms + var(--s10-k) * 110ms); }
  [data-s10-an] .s10-e-strahl { transition: stroke-dashoffset 1300ms cubic-bezier(0.22, 1, 0.36, 1) calc(700ms + var(--s10-k) * 45ms); }
  [data-s10-an] .s10-e-sonne { transition: transform 1800ms cubic-bezier(0.22, 1, 0.36, 1) 300ms, opacity 1200ms ease 300ms; }
  [data-s10-an] .s10-e-hof { transition: opacity 2000ms ease 500ms; }
  [data-s10-an] .s10-e-feld { transition: opacity 1400ms cubic-bezier(0.22, 1, 0.36, 1) 600ms, transform 1600ms cubic-bezier(0.22, 1, 0.36, 1) 600ms; }

  [data-s10-bereit]:not([data-s10-an]) .s10-e-zeile { transform: translate3d(0, 108%, 0); }
  [data-s10-bereit]:not([data-s10-an]) .s10-e-auf { opacity: 0; transform: translate3d(0, 16px, 0); }
  [data-s10-bereit]:not([data-s10-an]) .s10-e-strich { stroke-dashoffset: 1; }
  [data-s10-bereit]:not([data-s10-an]) .s10-e-sonne { transform: translate3d(0, 46%, 0); opacity: 0.4; }
  [data-s10-bereit]:not([data-s10-an]) .s10-e-hof { opacity: 0; }
  [data-s10-bereit]:not([data-s10-an]) .s10-e-feld { opacity: 0; transform: translate3d(0, 24px, 0); }

  [data-s10-an] .s10-e-impuls { animation: s10-e-impuls 7000ms cubic-bezier(0.45, 0, 0.55, 1) infinite; animation-delay: calc(2600ms + var(--s10-k) * 1400ms); }
}
@keyframes s10-e-impuls {
  0% { stroke-dashoffset: 0.045; opacity: 0; }
  4% { opacity: 1; }
  24% { stroke-dashoffset: -1; opacity: 1; }
  25%, 100% { stroke-dashoffset: -1; opacity: 0; }
}
`;
