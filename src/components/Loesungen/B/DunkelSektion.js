import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MonitorDot, Radio, SlidersHorizontal } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/components/ui/cn";

/**
 * Dunkle Kontrast-Sektion (navy) mit Raster, Körnung und weichen Lichtkreisen.
 * Kopf links, optional Foto rechts; darunter beliebiger Inhalt (Karten, Diagramm).
 */
export default function DunkelSektion({ id, eyebrow, title, lead, bild, children, className }) {
  return (
    <section id={id} className={cn("ov-noise relative isolate scroll-mt-24 overflow-hidden bg-navy-950 py-20 text-white md:py-32", className)}>
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden="true" className="absolute -left-40 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-32 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-navy-400/25 blur-[120px]" />
      <div className="ov-container">
        <div className={cn("grid grid-cols-1 items-center gap-10 lg:gap-16", bild && "lg:grid-cols-[1.05fr_0.95fr]")}>
          <SectionHeading dark eyebrow={eyebrow} title={title} lead={lead} />
          {bild && (
            <Reveal dir="right" className="relative">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                <Image src={bild.src} alt={bild.alt || ""} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" style={bild.position ? { objectPosition: bild.position } : undefined} />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-navy-950/70 via-navy-950/10 to-transparent" />
              </div>
              {bild.badge && (
                <div className="ov-glass absolute -bottom-6 left-6 max-w-[16rem] rounded-2xl px-5 py-4 text-[13.5px] leading-snug text-white/85 shadow-2xl">{bild.badge}</div>
              )}
            </Reveal>
          )}
        </div>
        {children && <div className="mt-14 md:mt-16">{children}</div>}
      </div>
    </section>
  );
}

const SYSTEME = [
  { key: "parkregler", icon: SlidersHorizontal, title: "Eigener Parkregler (EZA-Regler)", href: "/technik/parkregler", text: "Regelt Wirk- und Blindleistung am Netzverknüpfungspunkt nach den Vorgaben des Netzbetreibers und der TOR Erzeuger." },
  { key: "fernwartung", icon: Radio, title: "Eigene Fernwartung", href: "/technik/fernwartung", text: "Gesicherter Fernzugriff auf Wechselrichter, Regler und Zähler – Störungen erkennen und beheben, oft ohne Anfahrt." },
  { key: "scada", icon: MonitorDot, title: "Eigenes SCADA", href: "/technik/scada", text: "Erzeugung, Verbrauch, Speicher und Netzvorgaben in einer Leitwarte – mit Berichten für Controlling und Nachhaltigkeit." },
];

/** Die drei eigenen Systeme als Glas-Karten auf dunklem Grund. texte: { parkregler, fernwartung, scada } */
export function SystemKarten({ texte = {}, className }) {
  return (
    <ul className={cn("grid gap-4 md:grid-cols-3 md:gap-5", className)}>
      {SYSTEME.map((s, i) => (
        <Reveal as="li" key={s.key} delay={i * 90} className="flex">
          <Link
            href={s.href}
            className="group relative flex w-full flex-col rounded-3xl bg-white/[0.05] p-7 ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.09] hover:ring-ov-400/40 md:p-8"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-500/15 text-ov-300 ring-1 ring-ov-400/20 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white">
                <s.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <span className="font-display text-[13px] font-bold tracking-[0.2em] text-white/30">0{i + 1}</span>
            </div>
            <h3 className="ov-h3 mt-6 text-white">{s.title}</h3>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/65">{texte[s.key] || s.text}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-300 transition-colors group-hover:text-white">
              Mehr erfahren
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
