// src/components/Technik/w26-Systeme.js
//
// /technik – Bühne direkt unter dem Seitenkopf: „Drei Bausteine, eine Verantwortung“.
// Das gezeichnete Regelkreis-Schema (w26-Regelkreis) baut sich beim Eintritt auf; die drei
// Systemkarten darunter heben beim Überfahren/Fokussieren ihr System im Schema hervor
// (CSS :has, kein JS nötig). Server-Komponente; Bewegung über die Client-Insel W26Buehne.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MonitorDot, MousePointerClick, ShieldCheck, SlidersHorizontal } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import W26Buehne from "./w26-Buehne";
import W26Regelkreis, { W26_REGELKREIS_CSS } from "./w26-Regelkreis";

const LEGENDE = [
  { t: "Energiefluss", linie: "h-[3px] rounded-full bg-gradient-to-r from-ov-300 to-ov-400" },
  { t: "Fernwartung & Monitoring", linie: "h-0 border-t-2 border-dotted border-white/60" },
  { t: "Sollwerte des Netzbetreibers", linie: "h-0 border-t-2 border-dashed border-sun-400" },
];

const KARTEN_CSS = `
.w26-sys .w26-kante { opacity: 0; transition: opacity 500ms cubic-bezier(0.22, 1, 0.36, 1); }
.w26-sys:hover .w26-kante, .w26-sys:focus-visible .w26-kante { opacity: 1; }
`;

const ICONS = { regler: SlidersHorizontal, fern: ShieldCheck, scada: MonitorDot };

/**
 * systeme: [{ sys: "regler"|"fern"|"scada", tag, titel, text, href, cta, bild, alt }]
 */
export default function W26Systeme({ id = "systeme", eyebrow, titel, lead, systeme = [] }) {
  return (
    <section id={id} data-blk="systeme" aria-labelledby={`${id}-titel`} className="ov-noise relative isolate scroll-mt-24 overflow-hidden bg-navy-950 pb-20 pt-16 text-white md:pb-28 md:pt-20">
      <style>{W26_REGELKREIS_CSS + KARTEN_CSS}</style>
      <div aria-hidden="true" className="ov-grid-bg pointer-events-none absolute inset-0 -z-10 opacity-80" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[30%] -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-ov-500/[0.16] blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-navy-400/20 blur-[130px]" />

      <div className="w26-modul ov-container relative">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading dark eyebrow={eyebrow} title={<span id={`${id}-titel`}>{titel}</span>} />
          <Reveal delay={120} className="lg:pb-1">
            {lead && <p className="ov-lead max-w-[34rem] text-white/70">{lead}</p>}
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 text-[13px] text-white/65" aria-label="Legende des Schemas">
              {LEGENDE.map((l) => (
                <li key={l.t} className="flex items-center gap-2.5">
                  <span aria-hidden="true" className={`block w-7 ${l.linie}`} />
                  {l.t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <W26Buehne className="w26-buehne relative mt-12 md:mt-16">
          <W26Regelkreis />
        </W26Buehne>
        <p className="sr-only">
          Schema: Der PV-Park speist über Wechselrichter, Parkregler (EZA-Regler, eigene Entwicklung) und Netzanschlusspunkt mit Messung und Zähler ins Netz. Der
          Netzbetreiber gibt Sollwerte nach TOR Erzeuger an den Parkregler; der Regler führt Wirkleistung und Blindleistung nach. Wechselrichter, Regler und
          Netzanschlusspunkt sind über gesicherte Fernwartung an SCADA und Leitwarte angebunden.
        </p>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/10 pt-6 md:mt-12">
          <p className="flex items-center gap-2 text-[13px] text-white/50">
            <MousePointerClick aria-hidden="true" className="hidden h-4 w-4 text-ov-300 lg:block" strokeWidth={1.8} />
            <span className="hidden lg:inline">System wählen – es leuchtet im Schema auf.</span>
            <span className="lg:hidden">Schematische Darstellung · Bewegung dekorativ</span>
          </p>
          <p className="hidden text-[13px] text-white/40 lg:block">Schematische Darstellung · Bewegung dekorativ, keine Messwerte</p>
        </div>

        <ul className="ov-no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {systeme.map((s, i) => {
            const Icon = ICONS[s.sys] || SlidersHorizontal;
            return (
              <Reveal as="li" key={s.href} delay={i * 90} className="flex w-[86%] shrink-0 snap-start md:w-auto">
                <Link
                  href={s.href}
                  data-sys={s.sys}
                  className="w26-sys group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-[1.75rem] bg-white/[0.04] ring-1 ring-white/10 transition-[box-shadow,transform,background-color] duration-500 hover:bg-white/[0.07] hover:ring-ov-300/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-300"
                >
                  <span aria-hidden="true" className="w26-kante absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-ov-300 to-transparent" />
                  <div className="relative aspect-[16/9] overflow-hidden bg-navy-900">
                    <Image
                      src={s.bild}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 768px) 86vw, (max-width: 1280px) 31vw, 400px"
                      className="object-cover opacity-80 transition-[transform,opacity] duration-[1400ms] ease-out group-hover:scale-[1.05] group-hover:opacity-100"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/5" />
                    <span aria-hidden="true" className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-ov-400 font-display text-[12px] font-extrabold text-navy-950 ring-4 ring-navy-950/40">
                      0{i + 1}
                    </span>
                    <span className="absolute right-4 top-4 rounded-full bg-navy-950/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 ring-1 ring-white/15 backdrop-blur-md">
                      {s.tag}
                    </span>
                    <span className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-950/60 ring-1 ring-white/15 backdrop-blur-md transition-colors duration-500 group-hover:bg-ov-500 group-hover:ring-ov-400">
                      <Icon aria-hidden="true" className="h-5 w-5 text-ov-300 transition-colors duration-500 group-hover:text-white" strokeWidth={1.8} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-5 pb-6 pt-4 md:px-6">
                    <h3 className="font-display text-[20px] font-bold leading-snug tracking-tight text-white md:text-[21px]">{s.titel}</h3>
                    <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-white/65">{s.text}</p>
                    <span className="mt-5 inline-flex min-h-6 items-center gap-2 text-[14.5px] font-semibold text-ov-300">
                      {s.cta} <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
