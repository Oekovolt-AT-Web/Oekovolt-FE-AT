import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MonitorDot, MousePointerClick, Radio, SlidersHorizontal } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import W23Buehne from "@/components/Loesungen/w23-buehne";
import W23Schema, { W23_SCHEMA_CSS, kontextVon } from "@/components/Loesungen/w23-schema";

/**
 * Dunkle Technik-Sektion: gezeichnetes, animiertes Systemschema im Stil des Leitstands der
 * Startseite – Erzeugung (Kachel je Seitenkontext) → Speicher-Abzweig → Parkregler (EZA-Regler)
 * → Netzanschlusspunkt → Netzbetreiber, darüber Leitwarte/SCADA mit gesicherter Fernwartung,
 * unten die Sollwert-Schleife des Netzbetreibers. Darunter drei Systemkarten; Überfahren/Fokus
 * einer Karte hebt ihr System im Schema hervor (CSS :has, kein JS).
 *
 * props:
 *  eyebrow, title, lead
 *  knoten: { erzeugung: {titel, text}, zusatz: {titel, text}, netz: {titel, text}, leitwarte: {titel, text} }
 *  texte:  { parkregler, fernwartung, scada } – Kartentexte je Anwendungsfall
 *  fakten: [{ wert, label }] – bis zu 3 Kurzwerte neben der Überschrift
 *  bild:   { src, alt } – dezentes Hintergrundfoto
 *  kontext (optional): "halle" | "park" | "agri" | "hof" | "gemeinde" – Zeichnung der Erzeugungs-Kachel;
 *          ohne Angabe aus knoten.erzeugung abgeleitet
 *  children: optionaler Zusatzinhalt unter den Karten
 */

const LEGENDE = [
  { t: "Energiefluss", linie: "h-[3px] rounded-full bg-gradient-to-r from-sun-400 via-ov-300 to-ov-400" },
  { t: "Daten & Fernzugriff", linie: "h-0 border-t-2 border-dotted border-white/60" },
  { t: "Sollwerte des Netzbetreibers", linie: "h-0 border-t-2 border-dashed border-sun-400" },
];

const EIGENES_CSS = `
.w23-karte .w23-kante { opacity: 0; transition: opacity 500ms cubic-bezier(0.22, 1, 0.36, 1); }
.w23-karte:hover .w23-kante, .w23-karte:focus-visible .w23-kante { opacity: 1; }
`;

export default function TechnikSystem({ id, eyebrow = "Technik & Betrieb", title, lead, knoten = {}, texte = {}, fakten = [], bild, kontext, children }) {
  const k = {
    erzeugung: { titel: "PV-Anlage", text: "Module & Wechselrichter", ...knoten.erzeugung },
    zusatz: { titel: "Speicher & Verbraucher", text: "Batterie, Ladepunkte, Betrieb", ...knoten.zusatz },
    netz: { titel: "Netzbetreiber", text: "Netzverknüpfungspunkt", ...knoten.netz },
    leitwarte: { titel: "SCADA-Leitwarte", text: "Monitoring & Fernwartung", ...knoten.leitwarte },
  };
  const art = kontextVon(k, kontext);

  const karten = [
    { sys: "regler", icon: SlidersHorizontal, titel: "Eigener Parkregler", text: texte.parkregler, href: "/technik/parkregler", cta: "Zum Parkregler" },
    { sys: "fern", icon: Radio, titel: "Eigene Fernwartung", text: texte.fernwartung, href: "/technik/fernwartung", cta: "Zur Fernwartung" },
    { sys: "scada", icon: MonitorDot, titel: "Eigenes SCADA", text: texte.scada, href: "/technik/scada", cta: "Zu SCADA & Leitwarte" },
  ];

  return (
    <section id={id} data-blk="technik-system" className="ov-noise relative isolate scroll-mt-24 overflow-hidden bg-navy-950 py-20 text-white md:py-28">
      <style>{W23_SCHEMA_CSS + EIGENES_CSS}</style>
      {bild?.src && (
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-20 h-[720px] lg:left-auto lg:w-[55%]">
          <Image src={bild.src} alt="" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover opacity-[0.2]" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950" />
        </div>
      )}
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden="true" className="absolute -left-40 top-1/4 -z-10 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-24 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-navy-400/20 blur-[120px]" />

      <div className="ov-container">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-12">
          <SectionHeading dark eyebrow={eyebrow} title={title} lead={lead} />
          {fakten.length > 0 && (
            <Reveal delay={120} as="dl" className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {fakten.map((f) => (
                <div key={f.label} className="relative min-w-0 overflow-hidden rounded-2xl bg-white/[0.045] p-3 ring-1 ring-white/10 sm:p-4">
                  <span aria-hidden="true" className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-ov-300/70 to-transparent" />
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="ov-num whitespace-nowrap font-display text-[16px] font-extrabold leading-none tracking-tight text-white sm:text-[21px] md:text-[23px]">{f.wert}</dd>
                  <dd className="mt-2 hyphens-auto text-[11.5px] leading-snug text-white/60 sm:text-[12.5px]">{f.label}</dd>
                </div>
              ))}
            </Reveal>
          )}
        </div>

        {/* ---------- Leitstand-Modul: Schema + Systemkarten ---------- */}
        <div className="w23-modul relative mt-12 md:mt-14">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-navy-950/70 px-4 pb-5 pt-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] ring-1 ring-white/10 md:rounded-[2.25rem] md:px-9 md:pb-8 md:pt-9">
            <div aria-hidden="true" className="ov-grid-bg pointer-events-none absolute inset-0 opacity-60" />
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[30%] h-[380px] w-[620px] -translate-x-1/2 rounded-full bg-ov-500/15 blur-[110px]" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <div className="relative">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-400" />
                  Systemschema<span className="hidden sm:inline"> · von der Anlage bis zum Netz</span>
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-white/65 md:gap-x-6 md:text-[13px]" aria-label="Legende">
                  {LEGENDE.map((l) => (
                    <li key={l.t} className="flex items-center gap-2.5">
                      <span aria-hidden="true" className={`block w-7 ${l.linie}`} />
                      {l.t}
                    </li>
                  ))}
                </ul>
              </div>

              <W23Buehne className="w23-buehne mt-7 md:mt-9">
                <W23Schema knoten={k} art={art} />
              </W23Buehne>
              <p className="sr-only">
                Schematische Darstellung: {k.erzeugung.titel} ({k.erzeugung.text}) speist über den Parkregler (EZA-Regler, eigene Entwicklung) und den Netzanschlusspunkt mit Zähler ins Netz ({k.netz.titel}: {k.netz.text}). Am Energiefluss hängen {k.zusatz.titel} ({k.zusatz.text}). Der Netzbetreiber gibt Sollwerte an den Parkregler. Erzeugung, Regler und Zähler sind über gesicherte Fernwartung an {k.leitwarte.titel} ({k.leitwarte.text}) angebunden.
              </p>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5 md:mt-8">
                <p className="flex items-center gap-2 text-[13px] text-white/50">
                  <MousePointerClick aria-hidden="true" className="hidden h-4 w-4 text-ov-300 lg:block" strokeWidth={1.8} />
                  <span className="hidden lg:inline">System wählen – es leuchtet im Schema auf.</span>
                  <span className="lg:hidden">Schematische Darstellung, keine Messwerte</span>
                </p>
                <p className="hidden text-[13px] text-white/40 lg:block">Schematische Darstellung, keine Messwerte</p>
              </div>
            </div>
          </div>

          <ul className="mt-5 grid gap-4 md:mt-6 md:grid-cols-3 md:gap-5">
            {karten.map((c, i) => (
              <Reveal as="li" key={c.sys} delay={i * 90} className="flex">
                <Link
                  href={c.href}
                  data-sys={c.sys}
                  className="w23-karte group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-[1.5rem] bg-white/[0.04] p-6 ring-1 ring-white/10 transition-[box-shadow,transform,background-color] duration-500 hover:bg-white/[0.07] hover:ring-ov-300/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-300 md:p-7"
                >
                  <span aria-hidden="true" className="w23-kante absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ov-300 to-transparent" />
                  <span className="flex items-center gap-3.5">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] ring-1 ring-white/15 transition-colors duration-500 group-hover:bg-ov-500 group-hover:ring-ov-400">
                      <c.icon aria-hidden="true" className="h-5 w-5 text-ov-300 transition-colors duration-500 group-hover:text-white" strokeWidth={1.8} />
                      <span aria-hidden="true" className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ov-400 font-display text-[10.5px] font-extrabold text-navy-950 ring-[3px] ring-navy-950">
                        0{i + 1}
                      </span>
                    </span>
                    <h3 className="font-display text-[18.5px] font-bold leading-snug tracking-tight text-white md:text-[19.5px]">{c.titel}</h3>
                  </span>
                  <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-white/65 md:text-[15px]">{c.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-ov-300">
                    {c.cta} <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
        {children}
      </div>
    </section>
  );
}
