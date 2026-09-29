import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BatteryCharging, MonitorDot, Radio, SlidersHorizontal, Sun, UtilityPole } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/components/ui/cn";

/**
 * Dunkle Technik-Sektion: Systemgrafik Erzeugung → Parkregler (EZA-Regler) → Netz,
 * dazu Fernwartung/SCADA als Datenebene, plus drei Glas-Karten zu den eigenen Systemen.
 *
 * props:
 *  eyebrow, title, lead
 *  knoten: { erzeugung: {titel, text}, zusatz: {titel, text}, netz: {titel, text}, leitwarte: {titel, text} }
 *  texte:  { parkregler, fernwartung, scada } – Kartentexte je Anwendungsfall
 *  fakten: [{ wert, label }] – bis zu 3 Kurzwerte neben der Überschrift
 *  bild:   { src, alt } – dezentes Hintergrundfoto
 *  children: optionaler Zusatzinhalt unter den Karten
 */
export default function TechnikSystem({ id, eyebrow = "Technik & Betrieb", title, lead, knoten = {}, texte = {}, fakten = [], bild, children }) {
  const k = {
    erzeugung: { titel: "PV-Anlage", text: "Module & Wechselrichter", ...knoten.erzeugung },
    zusatz: { titel: "Speicher & Verbraucher", text: "Batterie, Ladepunkte, Betrieb", ...knoten.zusatz },
    netz: { titel: "Netzbetreiber", text: "Netzverknüpfungspunkt", ...knoten.netz },
    leitwarte: { titel: "SCADA-Leitwarte", text: "Monitoring & Fernwartung", ...knoten.leitwarte },
  };

  return (
    <section id={id} className="ov-noise relative isolate scroll-mt-24 overflow-hidden bg-navy-950 py-20 text-white md:py-24">
      <style>{`
        @keyframes la-fluss { to { stroke-dashoffset: -24; } }
        @keyframes la-fluss-v { to { background-position: 0 24px; } }
        @media (prefers-reduced-motion: no-preference) {
          .la-fluss { animation: la-fluss 1.1s linear infinite; }
          .la-fluss-rueck { animation: la-fluss 1.6s linear infinite reverse; }
          .la-fluss-v { animation: la-fluss-v 1.1s linear infinite; }
        }
      `}</style>
      {bild?.src && (
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-20 w-full lg:w-[55%]">
          <Image src={bild.src} alt="" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover opacity-[0.22]" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950" />
        </div>
      )}
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-1/4 -z-10 h-[460px] w-[460px] rounded-full bg-ov-500/25 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-24 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-navy-400/25 blur-[120px]" />

      <div className="ov-container">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-12">
          <SectionHeading dark eyebrow={eyebrow} title={title} lead={lead} />
          {fakten.length > 0 && (
            <Reveal delay={120} as="dl" className="grid grid-cols-3 gap-3">
              {fakten.map((f) => (
                <div key={f.label} className="ov-glass min-w-0 rounded-2xl p-3 sm:p-4">
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="ov-num whitespace-nowrap font-display text-[16px] font-extrabold leading-none tracking-tight text-white sm:text-[21px] md:text-[23px]">{f.wert}</dd>
                  <dd className="mt-2 hyphens-auto text-[11.5px] leading-snug text-white/60 sm:text-[12.5px]">{f.label}</dd>
                </div>
              ))}
            </Reveal>
          )}
        </div>

        <Reveal dir="scale" className="relative mt-10 rounded-[2rem] bg-white/[0.03] p-4 ring-1 ring-white/10 md:mt-12 md:p-7">
          {/* Verbindungen – nur Desktop */}
          <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-8 hidden h-[calc(100%-4rem)] w-[calc(100%-4rem)] lg:block">
            <g fill="none" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke">
              <path d="M29,25 C34,25 33,50 38,50" stroke="#ffc53d" strokeDasharray="6 6" className="la-fluss" vectorEffect="non-scaling-stroke" />
              <path d="M29,75 C34,75 33,50 38,50" stroke="#ffc53d" strokeDasharray="6 6" className="la-fluss" vectorEffect="non-scaling-stroke" />
              <path d="M62,50 C67,50 66,25 71,25" stroke="#ffc53d" strokeDasharray="6 6" className="la-fluss" vectorEffect="non-scaling-stroke" />
              <path d="M62,46 C67,46 66,21 71,21" stroke="#7fa7d6" strokeOpacity="0.8" strokeDasharray="2 7" className="la-fluss-rueck" vectorEffect="non-scaling-stroke" />
              <path d="M62,50 C67,50 66,75 71,75" stroke="#8cba58" strokeDasharray="2 6" className="la-fluss" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>

          <div className="relative grid gap-3 lg:grid-cols-[29%_1fr_29%] lg:gap-[9%]">
            <div className="grid gap-3 lg:gap-6">
              <Knoten icon={Sun} {...k.erzeugung} ton="sun" />
              <Knoten icon={BatteryCharging} {...k.zusatz} ton="sun" />
            </div>
            <Verbinder className="lg:hidden" />
            <div className="flex items-center">
              <div className="relative w-full rounded-3xl bg-gradient-to-b from-ov-500/25 to-ov-500/5 p-6 text-center shadow-[0_0_80px_-20px_rgba(140,186,88,0.6)] ring-1 ring-ov-400/50 md:p-7">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ov-500 text-white shadow-lg shadow-ov-900/40">
                  <SlidersHorizontal aria-hidden="true" className="h-6 w-6" />
                </span>
                <p className="mt-4 font-display text-[19px] font-bold leading-tight">Parkregler (EZA-Regler)</p>
                <p className="mt-1.5 text-[13.5px] leading-snug text-white/65">Wirk- & Blindleistung, Einspeiselimit, Fernwirkbefehle</p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-ov-200">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-ov-300 opacity-75 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-ov-300" />
                  </span>
                  Eigene Entwicklung
                </p>
              </div>
            </div>
            <Verbinder className="lg:hidden" />
            <div className="grid gap-3 lg:gap-6">
              <Knoten icon={UtilityPole} {...k.netz} ton="navy" />
              <Knoten icon={MonitorDot} {...k.leitwarte} ton="gruen" />
            </div>
          </div>

          <ul className="relative mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[12.5px] text-white/60">
            <li className="flex items-center gap-2"><span className="h-0 w-6 border-t-2 border-dashed border-sun-400" />Energiefluss</li>
            <li className="flex items-center gap-2"><span className="h-0 w-6 border-t-2 border-dotted border-navy-300" />Sollwerte des Netzbetreibers</li>
            <li className="flex items-center gap-2"><span className="h-0 w-6 border-t-2 border-dotted border-ov-400" />Daten & Fernzugriff</li>
          </ul>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: SlidersHorizontal, titel: "Eigener Parkregler", text: texte.parkregler, href: "/technik/parkregler" },
            { icon: Radio, titel: "Eigene Fernwartung", text: texte.fernwartung, href: "/technik/fernwartung" },
            { icon: MonitorDot, titel: "Eigenes SCADA", text: texte.scada, href: "/technik/scada" },
          ].map((c, i) => (
            <Reveal key={c.titel} delay={i * 90}>
              <Link href={c.href} className="group ov-card-hover flex h-full flex-col rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 hover:bg-white/[0.08]">
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ov-300 transition-colors group-hover:bg-ov-500 group-hover:text-white">
                    <c.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="flex-1 font-display text-[18px] font-bold">{c.titel}</h3>
                  <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </span>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">{c.text}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}

function Knoten({ icon: Icon, titel, text, ton }) {
  const farbe = ton === "sun" ? "bg-sun-400/15 text-sun-300" : ton === "gruen" ? "bg-ov-500/20 text-ov-300" : "bg-navy-400/25 text-navy-200";
  return (
    <div className="ov-glass flex items-center gap-4 rounded-2xl p-4 md:p-5">
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", farbe)}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-[16.5px] font-bold leading-tight">{titel}</p>
        <p className="mt-1 text-[13px] leading-snug text-white/60">{text}</p>
      </div>
    </div>
  );
}

function Verbinder({ className }) {
  return (
    <div aria-hidden="true" className={cn("flex justify-center", className)}>
      <span
        className="la-fluss-v block h-8 w-[3px] rounded-full"
        style={{ backgroundImage: "repeating-linear-gradient(to bottom, #ffc53d 0 6px, transparent 6px 12px)", backgroundSize: "3px 24px" }}
      />
    </div>
  );
}
