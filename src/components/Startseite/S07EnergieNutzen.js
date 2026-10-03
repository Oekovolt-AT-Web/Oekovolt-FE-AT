// src/components/Startseite/S07EnergieNutzen.js
//
// Startseite – Abschnitt: Energie nutzen.
// Eingebunden in src/app/page.js (ENERGIE_NUTZEN liefert dort auch das JSON-LD – Name und
// Felder title/href beibehalten).
//
// Idee: Energiefluss vom eigenen PV-Dach zu den vier Verwendungen. Desktop: gezeichnetes Dach,
// Stamm und vier Äste, die genau auf den Karten landen; Mobil: senkrechte Leitung links an der
// Kartenliste. Linien zeichnen sich beim Hineinscrollen, danach fließen Energie-Teilchen.
// Die Karten bleiben Server-HTML (SEO); nur die Grafik ist eine Client-Insel (s06-energiefluss.js).

import { ArrowUpRight, BatteryCharging, PlugZap, Share2, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import S06Energiefluss from "@/components/Startseite/s06-energiefluss";

export const ENERGIE_NUTZEN = [
  { icon: BatteryCharging, verb: "Speichern", title: "Gewerbespeicher", text: "Lastspitzen kappen, Leistungspreis senken, Überschüsse verschieben und Notstrom bereitstellen.", href: "/gewerbespeicher", bild: "/Images/AT/loesungen/gewerbespeicher-batteriecontainer.jpg" },
  { icon: PlugZap, verb: "Laden", title: "Ladeinfrastruktur", text: "E-Flotte, Kundenparkplatz und Lkw mit Solarstrom laden – mit Lastmanagement am Netzanschluss.", href: "/ladeinfrastruktur", bild: "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg" },
  { icon: Share2, verb: "Teilen", title: "Energiegemeinschaften", umbruch: "Energie\u00ADgemeinschaften", text: "Überschüsse in einer EEG, BEG oder GEA teilen – mit reduzierten Netzentgelten in der EEG.", href: "/energiegemeinschaften", bild: "/Images/AT/home/energiegemeinschaft-ort-luftbild.jpg" },
  { icon: TrendingUp, verb: "Vermarkten", title: "Reststromvermarktung", umbruch: "Reststrom\u00ADvermarktung", text: "Überschuss über Direktvermarktung, PPA oder OeMAG-Marktpreis erlösen.", href: "/service/direktvermarktung", bild: "/Images/AT/technik/umspannwerk-obersielach.jpg" },
];

export default function StartEnergieNutzen() {
  return (
    <>
      {/* ================= ENERGIE NUTZEN ================= */}
      <Section data-start="energie" tone="sand" space="md" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg-light absolute inset-x-0 top-0 h-[520px]" />
        <div className="relative">
          <div className="mb-10 grid gap-6 lg:mb-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
            <SectionHeading
              eyebrow="Energie nutzen"
              title={
                <>
                  Jede Kilowattstunde <span className="ov-text-gradient">an der richtigen Stelle.</span>
                </>
              }
            />
            <Reveal delay={120}>
              <p className="ov-lead max-w-[34rem] text-ink-600">
                Solarstrom rechnet sich am besten, wenn er im Betrieb verbraucht wird. Was übrig bleibt, speichern, laden, teilen oder vermarkten wir – abgestimmt
                auf Lastgang, Netzanschluss und Tarif.
              </p>
            </Reveal>
          </div>

          <S06Energiefluss anzahl={ENERGIE_NUTZEN.length}>
            <ul className="s06e-liste relative grid gap-3.5 pl-9 sm:gap-4 sm:pl-11 lg:grid-cols-4 lg:gap-5 lg:pl-0">
              {ENERGIE_NUTZEN.map((e, i) => (
                <li key={e.href} data-ast={i} className="s06-a s06e-karte relative flex">
                  {/* Andockpunkt des Energieflusses (Desktop) */}
                  <span aria-hidden="true" className="s06e-port absolute -top-[7px] left-1/2 z-10 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-ov-500 bg-white lg:block" />
                  <Link
                    href={e.href}
                    className="group relative flex w-full items-center gap-4 rounded-[1.5rem] bg-white p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_12px_32px_-18px_rgba(15,23,42,0.28)] ring-1 ring-ink-900/[0.06] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_2px_6px_-2px_rgba(15,23,42,0.06),0_28px_56px_-20px_rgba(15,23,42,0.32)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ov-600 sm:gap-6 lg:flex-col lg:items-stretch lg:gap-0 lg:rounded-[1.75rem] lg:p-2"
                  >
                    <div className="relative min-h-[112px] w-[96px] shrink-0 self-stretch overflow-hidden rounded-[1.1rem] bg-navy-950 sm:min-h-[132px] sm:w-[188px] lg:min-h-0 lg:self-auto lg:aspect-[4/3] lg:h-auto lg:w-full lg:rounded-[1.35rem]">
                      <Image
                        src={e.bild}
                        alt=""
                        fill
                        sizes="(max-width: 639px) 96px, (max-width: 1023px) 188px, (max-width: 1280px) 25vw, 300px"
                        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-navy-950/0 to-navy-950/10" />
                      <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
                      <span aria-hidden="true" className="absolute bottom-2 left-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-ov-600 shadow-sm backdrop-blur-sm lg:bottom-3 lg:left-3 lg:h-11 lg:w-11 lg:rounded-2xl">
                        <e.icon className="h-[18px] w-[18px] lg:h-5 lg:w-5" strokeWidth={1.9} />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col self-stretch py-1 pr-1 lg:px-4 lg:pb-4 lg:pt-5">
                      <p className="flex items-center justify-between gap-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
                        <span>
                          <span className="ov-num text-ink-400">0{i + 1}</span> · {e.verb}
                        </span>
                        <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-700 ring-1 ring-ink-900/[0.06] transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white lg:h-9 lg:w-9">
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
                        </span>
                      </p>
                      <h3 className="mt-1 font-display text-[17.5px] font-bold leading-snug tracking-tight text-ink-900 sm:text-[19px] lg:mt-2 lg:text-[20px]">{e.umbruch || e.title}</h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600 sm:text-[14.5px] lg:mt-2">{e.text}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </S06Energiefluss>
        </div>
      </Section>
    </>
  );
}
