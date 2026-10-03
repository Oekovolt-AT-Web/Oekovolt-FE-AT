// src/components/Startseite/S09Prozess.js
//
// Startseite – Abschnitt: Ablauf in vier Schritten.
// Eingebunden in src/app/page.js.
//
// Idee: Eine Linie führt „vom Lastgang zum laufenden Kraftwerk“. Sie zeichnet sich beim Scrollen
// (quer ab lg, hochkant am Handy), jeder Schritt leuchtet auf, sobald sie ihn erreicht, und seine
// kleine Strich-Illustration zeichnet sich. Am Ende: Endmarke „Laufendes Kraftwerk“.
// Scroll-Logik: s08-Pfad.js (Client-Insel). Klassen/Keyframes mit Präfix s08.

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import S08Pfad from "./s08-Pfad";
import { IlluAnalyse, IlluBau, IlluBetrieb, IlluPlanung } from "./s08-Illustrationen";

const SCHRITTE = [
  { title: "Analyse", tag: "Lastgang", Illu: IlluAnalyse, text: "Lastgang, Flächen, Netzanschluss und Förderungen: Wir rechnen, was sich für Ihren Betrieb wirklich lohnt." },
  { title: "Planung & Netzantrag", tag: "Auslegung · Netzzugang", Illu: IlluPlanung, text: "Auslegung, Statik, Netzzugang beim Netzbetreiber, Förderansuchen und Bewilligungen." },
  { title: "Bau & Inbetriebnahme", tag: "Eigener Fachbetrieb", Illu: IlluBau, text: "Montage durch den eigenen Fachbetrieb, Erstprüfung nach ÖVE/ÖNORM, Parkregler und Monitoring." },
  { title: "Betrieb & Wartung", tag: "Über die Laufzeit", Illu: IlluBetrieb, text: "Fernüberwachung, Wartungsvertrag, Prüfungen und Optimierung über die gesamte Laufzeit." },
];

const AUS = "cubic-bezier(0.22, 1, 0.36, 1)";
const CSS = `
.s08-zug { stroke-dasharray: 1 1; stroke-dashoffset: 0; }
.s08-geist { opacity: 0; filter: grayscale(1); }
.s08-spur-fill { transform-origin: 0 0; will-change: transform; }
.s08-spitze { opacity: 0; transition: opacity 300ms ease; }
@media (prefers-reduced-motion: no-preference) {
  .s08-pfad[data-bereit] .s08-geist { opacity: 0.2; transition: opacity 900ms ease 600ms; }
  .s08-pfad[data-bereit] .s08-schritt[data-an] .s08-geist { opacity: 0; }
  .s08-pfad[data-bereit] .s08-live .s08-zug { transition: stroke-dashoffset 1300ms cubic-bezier(0.65, 0, 0.35, 1) var(--d, 0ms); }
  .s08-pfad[data-bereit] .s08-live .s08-flaeche { transition: opacity 700ms ${AUS} var(--d, 0ms); }
  .s08-pfad[data-bereit] .s08-schritt:not([data-an]) .s08-live .s08-zug { stroke-dashoffset: 1; }
  .s08-pfad[data-bereit] .s08-schritt:not([data-an]) .s08-live .s08-flaeche { opacity: 0; }

  .s08-pfad[data-bereit] .s08-kachel { transition: transform 700ms ${AUS}, box-shadow 700ms ${AUS}, background-color 700ms; }
  .s08-pfad[data-bereit] .s08-schritt:not([data-an]) .s08-kachel { transform: translateY(10px); box-shadow: none; background-color: rgba(255,255,255,0.45); }

  .s08-pfad[data-bereit] .s08-knoten { transition: background-color 500ms ${AUS}, color 500ms ${AUS}, box-shadow 500ms ${AUS}; }
  .s08-pfad[data-bereit] .s08-schritt:not([data-an]) .s08-knoten { background-color: #fff; color: var(--color-ink-400); box-shadow: inset 0 0 0 1.5px var(--color-ink-200); }
  .s08-pfad[data-bereit] .s08-schritt[data-an] .s08-ping { animation: s08-ping 1100ms ${AUS} both; }

  .s08-pfad[data-bereit] .s08-titel { transition: color 500ms ${AUS}; }
  .s08-pfad[data-bereit] .s08-schritt:not([data-an]) .s08-titel { color: var(--color-ink-500); }

  .s08-pfad[data-bereit] .s08-ziel { transition: opacity 600ms ${AUS}, transform 600ms ${AUS}; }
  .s08-pfad[data-bereit] .s08-ziel:not([data-an]) { opacity: 0.35; transform: scale(0.96); }
  .s08-pfad[data-bereit] .s08-ziel[data-an] .s08-ping { animation: s08-ping 1100ms ${AUS} both; }
}
.s08-ping { opacity: 0; }
@keyframes s08-ping { 0% { opacity: 0.7; transform: scale(1); } 100% { opacity: 0; transform: scale(2.1); } }
`;

function Spitze({ achse }) {
  return (
    <span data-spitze="" aria-hidden="true" className={`s08-spitze absolute h-0 w-0 ${achse === "x" ? "left-0 top-1/2" : "left-1/2 top-0"}`}>
      <span className="absolute -left-3 -top-3 block h-6 w-6 rounded-full bg-ov-400/35" />
      <span className="absolute -left-[5px] -top-[5px] block h-2.5 w-2.5 rounded-full bg-white ring-[3px] ring-ov-500" />
    </span>
  );
}

function Endmarke({ className }) {
  return (
    <div data-ziel="" className={`s08-ziel flex items-center gap-3 ${className || ""}`}>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 text-ov-300 shadow-[0_10px_24px_-10px_rgba(3,18,43,0.6)]">
        <span aria-hidden="true" className="s08-ping absolute inset-0 rounded-full ring-2 ring-ov-400" />
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
        </svg>
      </span>
      <span className="rounded-full bg-white px-3.5 py-1.5 font-display text-[14px] font-bold leading-tight text-ink-900 shadow-[0_8px_20px_-12px_rgba(3,40,90,0.4)] ring-1 ring-ov-200">Laufendes Kraftwerk</span>
    </div>
  );
}

export default function StartProzess() {
  return (
    <>
      {/* ================= PROZESS ================= */}
      <Section data-start="prozess" tone="green" space="md" className="overflow-hidden">
        <style>{CSS}</style>
        <div aria-hidden="true" className="ov-grid-bg-light pointer-events-none absolute inset-0 opacity-80" />

        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="In vier Schritten" title={<>Vom Lastgang zum <span className="ov-text-gradient">laufenden Kraftwerk</span></>} />
          <Reveal delay={120} className="lg:pb-1">
            <p className="ov-lead max-w-[34rem] text-ink-600">Ein Ansprechpartner von der ersten Analyse bis zur Wartung – über die gesamte Lebensdauer der Anlage.</p>
            <Button href="/angebot?objekt=gewerbe" pfeil className="mt-6">
              Projekt starten
            </Button>
          </Reveal>
        </div>

        <S08Pfad className="s08-pfad relative mt-14 md:mt-16">
          {/* Linie quer (ab lg): von Knoten 01 bis zur Endmarke */}
          <div data-spur="x" aria-hidden="true" className="absolute left-[22px] right-[22px] top-[250px] hidden h-[2px] -translate-y-1/2 lg:block">
            <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(90deg,var(--color-ov-300)_0_6px,transparent_6px_12px)] opacity-70" />
            <div data-fill="" className="s08-spur-fill absolute -inset-y-px inset-x-0 rounded-full bg-gradient-to-r from-ov-300 via-ov-500 to-ov-600 shadow-[0_0_12px_rgba(102,153,51,0.45)]" />
            <Spitze achse="x" />
          </div>
          {/* Linie hochkant (unter lg) */}
          <div data-spur="y" aria-hidden="true" className="absolute bottom-[22px] left-[21px] top-[22px] w-[2px] lg:hidden">
            <div className="absolute inset-0 rounded-full bg-[repeating-linear-gradient(180deg,var(--color-ov-300)_0_6px,transparent_6px_12px)] opacity-70" />
            <div data-fill="" className="s08-spur-fill absolute -inset-x-px inset-y-0 rounded-full bg-gradient-to-b from-ov-300 via-ov-500 to-ov-600" />
            <Spitze achse="y" />
          </div>

          <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
            {SCHRITTE.map((s, i) => (
              <li key={s.title} data-schritt="" className="s08-schritt relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 lg:flex lg:flex-col">
                {/* Knoten */}
                <span data-knoten="" className="s08-knoten relative z-10 col-start-1 row-span-2 row-start-1 flex h-11 w-11 items-center justify-center rounded-full bg-ov-600 font-display text-[14px] font-extrabold text-white shadow-[0_8px_20px_-8px_rgba(85,130,39,0.8)] lg:order-2 lg:mt-7">
                  <span aria-hidden="true" className="s08-ping absolute inset-0 rounded-full ring-2 ring-ov-500" />
                  0{i + 1}
                </span>
                {/* Illustration */}
                <div aria-hidden="true" className="s08-kachel relative col-start-2 row-start-1 h-[168px] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_48px_-30px_rgba(3,40,90,0.35)] ring-1 ring-ov-200/70 sm:h-[190px] lg:order-1 lg:h-[200px]">
                  <span className="absolute left-4 top-3.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-400">{s.tag}</span>
                  {/* Blaupause (immer da) + Zeichnung, die beim Aufleuchten entsteht */}
                  <div className="s08-geist absolute inset-x-3 bottom-2 top-9 sm:inset-x-5">
                    <s.Illu />
                  </div>
                  <div className="s08-live absolute inset-x-3 bottom-2 top-9 sm:inset-x-5">
                    <s.Illu />
                  </div>
                </div>
                {/* Text */}
                <div className="col-start-2 row-start-2 mt-5 lg:order-3 lg:mt-6">
                  <h3 className="s08-titel ov-h3 text-ink-900">{s.title}</h3>
                  <p className="mt-2.5 max-w-[34rem] text-[15.5px] leading-relaxed text-ink-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Endmarke: quer am rechten Ende der Linie, hochkant am Fuß */}
          <Endmarke className="absolute right-0 top-[250px] hidden -translate-y-1/2 flex-row-reverse gap-2.5 lg:flex" />
          <Endmarke className="relative mt-12 lg:hidden" />
        </S08Pfad>
      </Section>
    </>
  );
}
