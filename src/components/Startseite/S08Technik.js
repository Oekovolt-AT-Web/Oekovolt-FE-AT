// src/components/Startseite/S08Technik.js
//
// Startseite – Abschnitt: Eigene Technik & Service.
// Eingebunden in src/app/page.js.
//
// Idee: ein dunkles „Leitstand“-Modul mit gezeichnetem Systemschema (PV-Park → Wechselrichter →
// Parkregler → Netzanschlusspunkt → Netzbetreiber, darüber SCADA, dazwischen gesicherte
// Fernwartung). Das Schema baut sich beim Eintritt auf; jede der drei Systemkarten hebt beim
// Überfahren/Fokussieren ihr System im Schema hervor (CSS :has, kein JS nötig).
// Darunter: Service über den Lebenszyklus als Zeitachse mit drei Leistungsfamilien.
// Eigene Klassen/Keyframes: Präfix s08 (siehe s08-Schema.js).

import { ArrowRight, ArrowUpRight, ClipboardCheck, Droplets, MonitorDot, MousePointerClick, Radio, ScanSearch, ShieldAlert, ShieldCheck, SlidersHorizontal, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import SectionHeading, { Eyebrow } from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import S08Buehne from "./s08-Buehne";
import S08Schema, { S08_CSS } from "./s08-Schema";

const TECHNIK = [
  { sys: "regler", icon: SlidersHorizontal, title: "Parkregler (EZA-Regler)", text: "Regelt Wirk- und Blindleistung am Netzanschlusspunkt nach den Vorgaben des Netzbetreibers und den TOR Erzeuger – inklusive Einspeisebegrenzung und Fernwirkanbindung.", href: "/technik/parkregler", cta: "Zum Parkregler", bild: "/Images/AT/technik/umspannwerk-transformator.jpg", alt: "Transformator und Schaltgeräte in einem Umspannwerk" },
  { sys: "fern", icon: Radio, title: "Fernwartung", text: "Gesicherte Fernzugriffe auf Wechselrichter, Regler und Zähler: Viele Störungen beheben wir, ohne dass jemand anfahren muss.", href: "/technik/fernwartung", cta: "Zur Fernwartung", bild: "/Images/Jobs/jobs4.jpg", alt: "Techniker prüft Anlagendaten auf einem Tablet neben PV-Modulen" },
  { sys: "scada", icon: MonitorDot, title: "SCADA & Leitwarte", text: "Portfolio-Monitoring, Alarmierung und Reporting über alle Anlagen – entwickelt mit unserem Digitalisierungspartner Solensa.", href: "/technik/scada", cta: "Zu SCADA & Leitwarte", bild: "/Images/AT/technik/leitwarte-netzbetrieb.jpg", alt: "Leitwarte mit Großbildwand und Arbeitsplätzen (Symbolbild)" },
];

const SERVICE = [
  {
    phase: "Prüfen",
    items: [
      { icon: ClipboardCheck, title: "E-Check & Anlagenprüfung", text: "Nach ÖVE/ÖNORM E 8101 und EN 62446", href: "/service/e-check" },
      { icon: ScanSearch, title: "Drohnen-Thermografie", text: "Hotspots georeferenziert finden", href: "/service/drohneninspektion" },
    ],
  },
  {
    phase: "Pflegen",
    items: [
      { icon: Wrench, title: "Wartung & Wartungsvertrag", text: "Für eigene und fremd errichtete Anlagen", href: "/service/wartung" },
      { icon: Droplets, title: "PV-Reinigung", text: "Wenn der Ertragsvergleich es rechtfertigt", href: "/service/reinigung" },
    ],
  },
  {
    phase: "Absichern",
    items: [
      { icon: ShieldCheck, title: "PV-Versicherung", text: "Beratung – wir vermitteln Kontakte", href: "/service/versicherung" },
      { icon: ShieldAlert, title: "Notstrom & Blackout", text: "Ersatzstrom für kritische Verbraucher", href: "/service/notstrom" },
    ],
  },
];

const LEGENDE = [
  { t: "Energiefluss", linie: "h-[3px] rounded-full bg-gradient-to-r from-ov-300 to-ov-400" },
  { t: "Fernwartung & Monitoring", linie: "h-0 border-t-2 border-dotted border-white/60" },
  { t: "Sollwerte des Netzbetreibers", linie: "h-0 border-t-2 border-dashed border-sun-400" },
];

const EIGENES_CSS = `
.s08-karte .s08-kante { opacity: 0; transition: opacity 500ms cubic-bezier(0.22, 1, 0.36, 1); }
.s08-karte:hover .s08-kante, .s08-karte:focus-visible .s08-kante { opacity: 1; }
.s08-achse-fill { transform-origin: 0 50%; }
@media (prefers-reduced-motion: no-preference) {
  .s08-achse[data-bereit] .s08-achse-fill { transform: scaleX(0); }
  .s08-achse[data-an] .s08-achse-fill { transform: none; transition: transform 2200ms cubic-bezier(0.65, 0, 0.35, 1) 200ms; }
  .s08-achse[data-bereit] .s08-achse-ende { opacity: 0; }
  .s08-achse[data-an] .s08-achse-ende { opacity: 1; transition: opacity 500ms ease 2300ms; }
}
`;

export default function StartTechnik() {
  return (
    <>
      {/* ================= EIGENE TECHNIK & SERVICE ================= */}
      <Section data-start="technik" tone="white" space="md">
        <style>{S08_CSS + EIGENES_CSS}</style>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Eigene Technik" title={<>Drei Systeme. <span className="ov-text-gradient">Selbst entwickelt.</span></>} />
          <Reveal delay={120} className="lg:pb-1">
            <p className="ov-lead max-w-[34rem] text-ink-600">
              Große Anlagen stellen hohe Anforderungen an Netzanschluss und Betrieb. Deshalb setzen wir auf eigene Regelungs- und Leittechnik statt auf Blackbox-Lösungen.
            </p>
            <Button href="/technik" variant="secondary" pfeil className="mt-6">
              Technik-Übersicht
            </Button>
          </Reveal>
        </div>

        {/* ---------- Leitstand-Modul: Schema + Systemkarten ---------- */}
        <div className="s08-modul ov-noise relative mt-12 overflow-hidden rounded-[2rem] bg-navy-950 px-5 pb-6 pt-7 text-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.55)] md:mt-16 md:rounded-[2.5rem] md:px-10 md:pb-10 md:pt-10">
          <div aria-hidden="true" className="ov-grid-bg pointer-events-none absolute inset-0 opacity-70" />
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[18%] h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-ov-500/20 blur-[120px]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="relative">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Eyebrow dark>Systemschema<span className="hidden sm:inline"> · vom Modul bis zum Netz</span></Eyebrow>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/65" aria-label="Legende">
                {LEGENDE.map((l) => (
                  <li key={l.t} className="flex items-center gap-2.5">
                    <span aria-hidden="true" className={`block w-7 ${l.linie}`} />
                    {l.t}
                  </li>
                ))}
              </ul>
            </div>

            <S08Buehne className="s08-buehne mt-8 md:mt-10">
              <S08Schema />
            </S08Buehne>
            <p className="sr-only">
              Schema: Der PV-Park speist über Wechselrichter, Parkregler (EZA-Regler, eigene Entwicklung) und Netzanschlusspunkt mit Zähler ins Netz. Der Netzbetreiber gibt Sollwerte nach TOR Erzeuger an den Parkregler. Wechselrichter, Regler und Zähler sind über gesicherte Fernwartung an SCADA und Leitwarte angebunden.
            </p>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6 md:mt-10">
              <p className="flex items-center gap-2 text-[13px] text-white/50">
                <MousePointerClick aria-hidden="true" className="hidden h-4 w-4 text-ov-300 lg:block" strokeWidth={1.8} />
                <span className="hidden lg:inline">System wählen – es leuchtet im Schema auf.</span>
                <span className="lg:hidden">Schematische Darstellung</span>
              </p>
              <p className="hidden text-[13px] text-white/40 lg:block">Schematische Darstellung</p>
            </div>

            <ul className="ov-no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
              {TECHNIK.map((t, i) => (
                <li key={t.href} className="flex w-[86%] shrink-0 snap-start md:w-auto">
                  <Link
                    href={t.href}
                    data-sys={t.sys}
                    className="s08-karte group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-[1.5rem] bg-white/[0.04] ring-1 ring-white/10 transition-[box-shadow,transform,background-color] duration-500 hover:bg-white/[0.07] hover:ring-ov-300/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-300"
                  >
                    <span aria-hidden="true" className="s08-kante absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-ov-300 to-transparent" />
                    <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                      <Image src={t.bild} alt={t.alt} fill sizes="(max-width: 768px) 86vw, (max-width: 1280px) 31vw, 380px" className="object-cover opacity-90 transition-[transform,opacity] duration-[1400ms] ease-out group-hover:scale-[1.05] group-hover:opacity-100" />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-navy-950/10" />
                      <span aria-hidden="true" className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-ov-400 font-display text-[12px] font-extrabold text-navy-950 ring-4 ring-navy-950/40">
                        0{i + 1}
                      </span>
                      <span className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-950/60 ring-1 ring-white/15 backdrop-blur-md transition-colors duration-500 group-hover:bg-ov-500 group-hover:ring-ov-400">
                        <t.icon aria-hidden="true" className="h-5 w-5 text-ov-300 transition-colors duration-500 group-hover:text-white" strokeWidth={1.8} />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-5 pb-6 pt-4 md:px-6">
                      <h3 className="font-display text-[20px] font-bold leading-snug tracking-tight text-white md:text-[21px]">{t.title}</h3>
                      <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-white/65">{t.text}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ov-300">
                        {t.cta} <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- Service über den Lebenszyklus ---------- */}
        <div className="mt-16 md:mt-24">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
            <div>
              <Eyebrow>Service über den Lebenszyklus</Eyebrow>
              <h2 className="mt-4 max-w-[36rem] text-balance font-display text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-ink-900 md:text-[2.15rem]">Damit die Anlage 25&nbsp;Jahre und länger liefert.</h2>
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-start">
              <p className="max-w-[34rem] text-[15.5px] leading-relaxed text-ink-600 md:text-[16.5px]">Wartung, Prüfung und Absicherung – für Anlagen, die wir gebaut haben, und für Bestandsanlagen anderer Errichter.</p>
              <Button href="/service/wartung#anfrage" pfeil className="shrink-0">
                Wartungsvertrag anfragen
              </Button>
            </div>
          </div>

          <S08Buehne className="s08-achse mt-12 min-w-0 md:mt-14">
            {/* Zeitachse: Inbetriebnahme → 25 Jahre und länger */}
            <div aria-hidden="true" className="relative">
              <div className="flex justify-between text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                <span>Inbetriebnahme</span>
                <span>25 Jahre +</span>
              </div>
              <div className="relative mt-3 h-4">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink-200" />
                <div className="absolute inset-0 [background:repeating-linear-gradient(90deg,var(--color-ink-300)_0_1px,transparent_1px_4%)]" />
                <div className="absolute right-0 top-0 h-4 w-px bg-ink-300" />
                <div className="s08-achse-fill absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-ov-300 via-ov-500 to-ov-400" />
                <div className="s08-achse-ende absolute right-0 top-1/2 h-0 w-0">
                  <span className="absolute -left-1.5 -top-1.5 block h-3 w-3 rounded-full bg-ov-500 ring-4 ring-ov-100" />
                </div>
              </div>
            </div>

            <div className="mt-2 grid gap-8 md:grid-cols-3 md:gap-6">
              {SERVICE.map((p, i) => (
                <div key={p.phase} className="relative">
                  <div className="flex items-center gap-3 pt-6 md:pt-8">
                    <span aria-hidden="true" className="absolute left-[11px] top-0 h-6 w-px bg-gradient-to-b from-ov-400 to-ov-200 md:h-8" />
                    <span aria-hidden="true" className="s08-phase-punkt relative flex h-6 w-6 items-center justify-center rounded-full bg-white ring-1 ring-ov-300" style={{ "--d": `${500 + i * 450}ms` }}>
                      <span className="h-2 w-2 rounded-full bg-ov-500" />
                    </span>
                    <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-ink-900">
                      <span className="mr-2 text-ov-600">0{i + 1}</span>
                      {p.phase}
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {p.items.map((s) => (
                      <li key={s.href}>
                        <Link href={s.href} className="group flex min-h-[76px] items-center gap-3.5 rounded-2xl bg-sand-50 p-3.5 ring-1 ring-ink-200/60 transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_40px_-22px_rgba(15,23,42,0.35)] hover:ring-ov-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200/70 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                            <s.icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-[15.5px] font-bold leading-snug text-ink-900">{s.title}</span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-ink-500">{s.text}</span>
                          </span>
                          <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ov-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </S08Buehne>
        </div>
      </Section>
    </>
  );
}
