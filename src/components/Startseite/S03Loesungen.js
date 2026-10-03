// src/components/Startseite/S03Loesungen.js
//
// Startseite – Abschnitt: Lösungs-Bento (Zielgruppen).
// Eingebunden in src/app/page.js (ZIELGRUPPEN → JSON-LD aus titel + href, Form beibehalten).
//
// Idee: sieben Zielgruppen als komponiertes Foto-Bento. Jede Karte wird beim Scrollen
// „aufgedeckt“: ein Vorhang mit Lichtkante fährt hoch, das Foto setzt sich, ein gezeichnetes
// Linien-Motiv (s02-Motive.js) zieht sich nach. Fotos mit dezenter Parallaxe, beim Hover
// Zoom, Lichtkante, die dem Mauszeiger folgt, und Pfeil. Verhalten in s02-LoesungenBento.js.
//
// Titel brechen nie im Wort: Die Schriftgröße richtet sich per Container-Einheit (cqi) nach dem
// längsten Wort des Titels bzw. des Kartenpaars (fit = gemessene Wortbreite in em bei Manrope 800 + 5 %) und Silbentrennung ist
// für diese Titel abgeschaltet.
//
// Bilder mit CC-Lizenz tragen eine Namensnennung (Bildnachweis unten auf der Startseite,
// public/Images/AT/QUELLEN-home.md, QUELLEN-loesungen.md, QUELLEN-chalets.md).
// Hotel- und Kläranlagen-Motiv zeigen Anlagen Dritter → als Symbolbild gekennzeichnet.
//
// Raster lg (12 Spalten): Gewerbe 6×2 | Freifläche 6 · Agri 3 · Landwirtschaft 3 | Hotel 4 · Gemeinden 4 · Chalets 4.
// Raster mobil (2 Spalten): Gewerbe 2×2 | Freifläche 2 | Agri 1 · Landwirtschaft 1 | Gemeinden 2 | Hotel 1 · Chalets 1.

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Motiv from "./s02-Motive";
import LoesungenBento from "./s02-LoesungenBento";

export const ZIELGRUPPEN = [
  {
    titel: "Gewerbe & Industrie",
    text: "Hallen- und Flachdächer, ausgelegt nach Ihrem Lastgang – mit Parkregler, Monitoring und Wartungsvertrag.",
    href: "/gewerbe",
    bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg",
    motiv: "gewerbe",
    gross: true,
    raster: "col-span-2 row-span-2 lg:col-span-6",
    sizes: "(min-width: 1024px) 50vw, 100vw",
    fit: 4,
  },
  {
    titel: "Freiflächenanlagen",
    text: "Solarparks ab 500 kWp",
    href: "/freiflaechen-photovoltaik",
    bild: "/Images/AT/loesungen/freiflaeche-solarpark-duernrohr.jpg",
    motiv: "freiflaeche",
    raster: "col-span-2 lg:col-span-6",
    sizes: "(min-width: 1024px) 50vw, 100vw",
    fit: 8.2,
  },
  {
    titel: "Agri-PV",
    text: "Doppelte Ernte auf einer Fläche",
    href: "/agri-pv",
    bild: "/Images/AT/loesungen/agri-pv-obstbau.jpg",
    motiv: "agri",
    halb: true,
    raster: "col-span-1 lg:col-span-3",
    sizes: "(min-width: 1024px) 25vw, 50vw",
    fit: 6.6, // Paar mit „Landwirtschaft“ (6,25 em)
  },
  {
    titel: "Landwirtschaft",
    text: "Stall, Scheune, Maschinenhalle",
    href: "/landwirtschaft",
    bild: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg",
    motiv: "landwirtschaft",
    halb: true,
    raster: "col-span-1 lg:col-span-3",
    sizes: "(min-width: 1024px) 25vw, 50vw",
    fit: 6.6,
  },
  {
    titel: "Hotellerie & Tourismus",
    text: "Hotels, Bergbahnen, Thermen",
    href: "/hotellerie-tourismus",
    bild: "/Images/AT/home/hotel-pv-dach-luftbild.jpg",
    motiv: "hotel",
    halb: true,
    symbolbild: true,
    raster: "col-span-1 max-lg:order-1 lg:col-span-4",
    sizes: "(min-width: 1024px) 33vw, 50vw",
    fit: 6.2, // Paar mit „Luxus-Chalets“ (5,9 em)
  },
  {
    titel: "Gemeinden & Länder",
    text: "Schulen, Bauhöfe, Kläranlagen – und Energiegemeinschaften mit der Bevölkerung.",
    href: "/kommunen",
    bild: "/Images/AT/home/klaeranlage-pv-luftbild.jpg",
    motiv: "gemeinde",
    symbolbild: true,
    raster: "col-span-2 lg:col-span-4",
    sizes: "(min-width: 1024px) 33vw, 100vw",
    fit: 5,
  },
  {
    titel: "Luxus-Chalets & Alpin",
    text: "Indach-Lösungen, hohe Schneelasten, Concierge-Wartung – für Premium-Objekte in den Bergen.",
    href: "/chalets",
    bild: "/Images/AT/chalets/chalets-alpin-winter-mittelberg.jpg",
    motiv: "chalet",
    halb: true,
    raster: "col-span-1 max-lg:order-1 lg:col-span-4",
    sizes: "(min-width: 1024px) 33vw, 50vw",
    fit: 6.2,
  },
];

/** Wörter mit Bindestrich („Agri-PV“, „Luxus-Chalets“) nie am Bindestrich umbrechen. */
function titelSatz(titel) {
  return titel.split(" ").map((w, k) => (
    <span key={k}>
      {k > 0 && " "}
      {w.includes("-") ? <span className="whitespace-nowrap">{w}</span> : w}
    </span>
  ));
}

function Karte({ p, i }) {
  const variante = p.gross ? "s02b-gross" : p.halb ? "s02b-halb" : "s02b-voll";
  return (
    <Link
      href={p.href}
      data-s02-karte={i}
      style={{ "--s02b-fit": p.fit }}
      className={`s02b-karte group ${variante} ${p.raster}`}
    >
      {/* Foto: Parallaxe-Schicht → Aufdeck-Skalierung → Hover-Zoom */}
      <div className="s02b-parallax" aria-hidden="true">
        <div className="s02b-setzen">
          <Image src={p.bild} alt="" fill sizes={p.sizes} className="s02b-foto object-cover" />
        </div>
      </div>
      <div aria-hidden="true" className="s02b-verlauf" />
            <div aria-hidden="true" className="s02b-schein" />

      <div className="s02b-inhalt relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="s02b-chip">
            <Motiv name={p.motiv} className="h-[26px] w-[26px] lg:h-7 lg:w-7" />
          </span>
          {p.symbolbild && <span className="s02b-symbol">Symbolbild</span>}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="s02b-titel">{titelSatz(p.titel)}</h3>
            <p className="s02b-text">{p.text}</p>
            {p.gross && (
              <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-300">
                Mehr erfahren <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            )}
          </div>
          <span aria-hidden="true" className="s02b-pfeil">
            <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </span>
        </div>
      </div>

      <span aria-hidden="true" className="s02b-kante">
        <span className="s02b-kante-licht" />
      </span>
      <span aria-hidden="true" className="s02b-vorhang" />
    </Link>
  );
}

export default function StartLoesungen() {
  return (
    <Section data-start="loesungen" tone="sand" space="lg" className="overflow-hidden">
      <style>{STIL}</style>
      {/* ================= ZIELGRUPPEN BENTO ================= */}
      <div className="mb-12 grid gap-8 md:mb-16 lg:grid-cols-12 lg:items-end lg:gap-10">
        <Reveal className="lg:col-span-7">
          <Eyebrow className="mb-4">Lösungen</Eyebrow>
          <h2 className="ov-h2 max-w-[15ch] text-ink-900">
            Eine Anlage, die zu Ihrem <span className="ov-text-gradient">Betrieb passt.</span>
          </h2>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-5">
          <p className="s02b-lead max-w-[52ch] text-ink-600">
            Vom Hallendach bis zum Solarpark, vom Bauernhof bis zur Gemeinde: Jede Anlage wird nach Lastgang, Fläche und Netzanschluss ausgelegt – nicht nach Katalog.
          </p>
          <Link
            href="/photovoltaik"
            className="group/l mt-3 inline-flex min-h-11 items-center gap-2 rounded-full text-[15px] font-semibold text-ov-700 transition-colors hover:text-ov-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ov-500"
          >
            Einzugsgebiet Österreich
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover/l:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <LoesungenBento className="grid auto-rows-[196px] grid-cols-2 gap-3 sm:auto-rows-[250px] sm:gap-4 lg:auto-rows-[300px] lg:grid-cols-12 lg:gap-5">
        {ZIELGRUPPEN.map((p, i) => (
          <Karte key={p.href} p={p} i={i} />
        ))}
      </LoesungenBento>
    </Section>
  );
}

const STIL = `
.s02b-karte {
  --s02b-pad: 16px;
  position: relative; isolation: isolate; display: block; overflow: hidden;
  container-type: inline-size;
  border-radius: 1.5rem; background: var(--color-navy-950); color: #fff;
  padding: var(--s02b-pad);
  box-shadow: 0 1px 2px rgba(3,18,43,.08), 0 26px 50px -30px rgba(3,18,43,.6);
  transition: transform 600ms cubic-bezier(.22,1,.36,1), box-shadow 600ms cubic-bezier(.22,1,.36,1), opacity 500ms ease-out;
  transition-delay: 0ms, 0ms, var(--s02b-d, 0ms);
  -webkit-tap-highlight-color: transparent;
}
@media (max-width: 639px) {
  .s02b-halb { --s02b-pad: 14px; }
  .s02b-halb { --s02b-pfeil-platz: 0px; }
  .s02b-halb .s02b-text, .s02b-halb .s02b-pfeil { display: none; }
  .s02b-symbol { padding: 3px 8px; font-size: 9.5px; letter-spacing: .1em; }
}
@media (min-width: 640px) { .s02b-karte { --s02b-pad: 24px; border-radius: 1.75rem; } }
@media (min-width: 1024px) { .s02b-karte { --s02b-pad: 28px; border-radius: 2rem; } }
.s02b-karte:focus-visible { outline: 2px solid var(--color-ov-500); outline-offset: 4px; }
@media (hover: hover) {
  .s02b-karte:hover { transform: translate3d(0,-4px,0); box-shadow: 0 2px 6px rgba(3,18,43,.1), 0 40px 70px -34px rgba(3,18,43,.7); }
}

/* Foto-Schichten */
.s02b-parallax { position: absolute; inset: -32px 0; will-change: transform; z-index: -1; }
.s02b-setzen { position: absolute; inset: 0; transform-origin: 50% 60%; transition: transform 1900ms cubic-bezier(.22,1,.36,1) var(--s02b-d, 0ms); }
.s02b-foto { transition: transform 1400ms cubic-bezier(.22,1,.36,1); }
.s02b-karte:hover .s02b-foto { transform: scale(1.06); }

.s02b-verlauf {
  position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(to bottom, rgba(3,18,43,.45) 0, rgba(3,18,43,0) 110px),
    linear-gradient(to top, rgba(3,18,43,.95) 0%, rgba(3,18,43,.78) 30%, rgba(3,18,43,.28) 62%, rgba(3,18,43,.04) 85%);
}
.s02b-gross .s02b-verlauf {
  background:
    linear-gradient(to bottom, rgba(3,18,43,.45) 0, rgba(3,18,43,0) 110px),
    linear-gradient(to top, rgba(3,18,43,.95) 0%, rgba(3,18,43,.7) 28%, rgba(3,18,43,.15) 55%, rgba(3,18,43,0) 75%);
}
.s02b-lead { font-size: clamp(1.05rem, 0.98rem + 0.35vw, 1.2rem); line-height: 1.65; }
@media (min-width: 1024px) { .s02b-lead { font-size: 17.5px; } }

/* Licht: Schein folgt dem Zeiger, Lichtkante am Rand */
.s02b-schein, .s02b-kante-licht {
  position: absolute; left: 0; top: 0; pointer-events: none; border-radius: 999px;
  transform: translate3d(calc(var(--s02b-mx, 50%) - 50%), calc(var(--s02b-my, 0px) - 50%), 0);
}
.s02b-schein {
  width: 560px; height: 560px; z-index: 0;
  background: radial-gradient(circle, rgba(255,255,255,.16) 0%, rgba(255,255,255,.05) 35%, transparent 65%);
  opacity: 0; transition: opacity 500ms;
}
.s02b-kante {
  position: absolute; inset: 0; z-index: 15; pointer-events: none; border-radius: inherit;
  padding: 1.5px; overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.1);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
}
.s02b-kante-licht {
  width: 520px; height: 520px;
  background: radial-gradient(circle, #f3ffe4 0%, #aed083 20%, rgba(140,186,88,.4) 40%, transparent 66%);
  opacity: 0; transition: opacity 500ms;
}
@media (hover: hover) {
  .s02b-karte:hover .s02b-schein, .s02b-karte:hover .s02b-kante-licht { opacity: 1; }
}

/* Inhalt */
.s02b-chip {
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  width: 44px; height: 44px; border-radius: 14px; color: var(--color-ov-300);
  background: rgba(3,18,43,.5); box-shadow: inset 0 0 0 1px rgba(255,255,255,.16);
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  transition: background-color 400ms, color 400ms, box-shadow 400ms;
}
@media (min-width: 1024px) { .s02b-chip { width: 52px; height: 52px; border-radius: 16px; } }
.s02b-karte:hover .s02b-chip { background: rgba(3,18,43,.7); color: #d9f0b8; box-shadow: inset 0 0 0 1px rgba(174,208,131,.45); }
.s02b-symbol {
  margin-top: 2px; padding: 4px 10px; border-radius: 999px;
  font-size: 10.5px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; line-height: 1.4;
  color: rgba(255,255,255,.78); background: rgba(3,18,43,.45); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14);
}

.s02b-titel {
  font-family: var(--font-display); font-weight: 800; letter-spacing: -0.025em; line-height: 1.08;
  font-size: clamp(var(--s02b-min, 15px), calc((100cqi - var(--s02b-pfeil-platz, 60px)) / var(--s02b-fit)), var(--s02b-max, 26px));
  -webkit-hyphens: manual; hyphens: manual; overflow-wrap: normal; word-break: normal;
}
.s02b-text { margin-top: .5rem; max-width: 36ch; font-size: 14.5px; line-height: 1.5; color: rgba(255,255,255,.76); text-wrap: pretty; }
.s02b-gross .s02b-text { max-width: 30rem; font-size: clamp(15px, 14px + .3vw, 17px); margin-top: .75rem; }
.s02b-gross { --s02b-min: 26px; --s02b-max: 34px; }
.s02b-voll { --s02b-min: 18px; --s02b-max: 25px; }
.s02b-halb { --s02b-min: 14px; --s02b-max: 20px; }
@media (min-width: 640px) {
  .s02b-gross { --s02b-max: 44px; }
  .s02b-voll, .s02b-halb { --s02b-max: 26px; }
}
@media (min-width: 1024px) {
  .s02b-gross { --s02b-max: 50px; }
  .s02b-voll, .s02b-halb { --s02b-max: 27px; }
}

.s02b-pfeil {
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  width: 44px; height: 44px; border-radius: 999px; color: #fff;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.3);
  transition: background-color 400ms, color 400ms, box-shadow 400ms, transform 500ms cubic-bezier(.22,1,.36,1);
}
.s02b-pfeil svg { transition: transform 500ms cubic-bezier(.22,1,.36,1); }
.s02b-karte:hover .s02b-pfeil { background: #fff; color: var(--color-ink-900); box-shadow: inset 0 0 0 1px #fff; }
.s02b-karte:hover .s02b-pfeil svg { transform: rotate(45deg); }

/* Aufdecken (nur mit JS und ohne reduzierte Bewegung) */
.s02b-vorhang {
  position: absolute; inset: -2px; z-index: 20; pointer-events: none;
  background: var(--color-sand-50);
  transform: translate3d(0, -102%, 0);
}
.s02b-vorhang::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #aed083 18%, #ffd873 50%, #aed083 82%, transparent);
  box-shadow: 0 0 22px 3px rgba(174,208,131,.55);
}
.s02b-js .s02b-karte:not(.s02b-an) { opacity: 0; }
.s02b-js .s02b-karte:not(.s02b-an) .s02b-vorhang { transform: translate3d(0, 0, 0); }
.s02b-js .s02b-karte:not(.s02b-an) .s02b-setzen { transform: scale(1.16); }
.s02b-js .s02b-karte:not(.s02b-an) .s02b-inhalt { opacity: 0; transform: translate3d(0, 16px, 0); }
.s02b-js .s02b-an .s02b-vorhang { transition: transform 1150ms cubic-bezier(.76,0,.24,1) calc(var(--s02b-d, 0ms) + 120ms); }
.s02b-inhalt { transition: opacity 800ms cubic-bezier(.22,1,.36,1), transform 900ms cubic-bezier(.22,1,.36,1); transition-delay: calc(var(--s02b-d, 0ms) + 650ms); }
.s02b-js .s02b-strich { stroke-dasharray: 1; stroke-dashoffset: 0; transition: stroke-dashoffset 1300ms cubic-bezier(.65,0,.35,1) calc(var(--s02b-d, 0ms) + 800ms); }
.s02b-js .s02b-karte:not(.s02b-an) .s02b-strich { stroke-dashoffset: 1; }

@media (prefers-reduced-motion: reduce) {
  .s02b-karte, .s02b-setzen, .s02b-foto, .s02b-inhalt, .s02b-pfeil, .s02b-pfeil svg { transition: none !important; }
  .s02b-vorhang { display: none; }
  .s02b-karte:hover, .s02b-karte:hover .s02b-foto, .s02b-karte:hover .s02b-pfeil svg { transform: none; }
}
`;
