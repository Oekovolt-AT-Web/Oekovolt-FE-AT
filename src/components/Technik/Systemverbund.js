import Link from "next/link";
import { ArrowDown, ArrowRight, BatteryCharging, Cpu, Landmark, MonitorDot, PlugZap, Radio, ShieldCheck, Sun, TrendingUp, UtilityPole, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * Systemverbund als Schichtendiagramm (Tailwind): Leitebene – Regelebene – Feldebene –
 * Netzanschluss. Jede Box verlinkt auf die passende Seite. Datenwege gestrichelt,
 * Energiefluss als grüne Leiste.
 */

function Knoten({ icon: Icon, titel, text, href, dunkel = false, className }) {
  const inhalt = (
    <>
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", dunkel ? "bg-white/10 text-ov-300" : "bg-ov-50 text-ov-600")}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className={cn("block font-display text-[15.5px] font-bold leading-snug", dunkel ? "text-white" : "text-ink-900")}>{titel}</span>
        <span className={cn("mt-0.5 block text-[13px] leading-snug", dunkel ? "text-white/60" : "text-ink-600")}>{text}</span>
      </span>
    </>
  );
  const basis = cn(
    "flex items-start gap-3 rounded-2xl p-4 ring-1 transition-colors",
    dunkel ? "bg-white/[0.05] ring-white/15" : "bg-white ring-ink-200",
    href && (dunkel ? "hover:bg-white/[0.1] hover:ring-ov-400" : "hover:ring-ov-300"),
    className
  );
  return href ? (
    <Link href={href} className={basis}>
      {inhalt}
    </Link>
  ) : (
    <div className={basis}>{inhalt}</div>
  );
}

function Verbinder({ text }) {
  return (
    <div className="flex items-center gap-3 py-3 pl-6 text-[12.5px] text-ink-500 md:pl-10" aria-hidden="true">
      <svg viewBox="0 0 12 40" className="h-9 w-3 shrink-0 text-navy-400" fill="none">
        <path d="M6 0v32" stroke="currentColor" strokeWidth="2" strokeDasharray="3 4" />
        <path d="M1 28l5 8 5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{text}</span>
    </div>
  );
}

function Ebene({ label, children, className }) {
  return (
    <div className={cn("grid gap-3 md:grid-cols-[9rem_1fr] md:items-center md:gap-6", className)}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">{label}</p>
      {children}
    </div>
  );
}

export default function Systemverbund() {
  return (
    <figure className="rounded-[2rem] bg-sand-50 p-5 ring-1 ring-ink-200/70 sm:p-7 md:p-9">
      <figcaption className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-display text-[18px] font-bold text-ink-900 md:text-[20px]">Der Ökovolt-Systemverbund</span>
        <span className="text-[13px] text-ink-500">schematisch · Boxen führen zur jeweiligen Seite</span>
      </figcaption>

      <Reveal>
        <Ebene label="Leitebene">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Knoten icon={MonitorDot} titel="SCADA & Leitwarte" text="Kennzahlen, Alarme, Berichte" href="/technik/scada" />
            <Knoten icon={ShieldCheck} titel="Fernwartung" text="VPN, MFA, Protokoll" href="/technik/fernwartung" />
            <Knoten icon={Radio} titel="Netzbetreiber" text="Sollwerte, Fernwirk, Abschaltung" href="/forderungen/richtlinien" />
            <Knoten icon={TrendingUp} titel="Direktvermarkter" text="Abregelung, Fahrplan, Ist-Werte" href="/service/direktvermarktung" />
          </div>
        </Ebene>
      </Reveal>

      <Verbinder text="IEC 60870-5-104 · Modbus TCP · OpenADR · gesicherte API – nur über getrennte Zonen" />

      <Reveal delay={80}>
        <Ebene label="Regelebene">
          <Link
            href="/technik/parkregler"
            className="group relative flex flex-col gap-3 overflow-hidden rounded-3xl bg-navy-950 p-5 text-white ring-1 ring-navy-800 transition-colors hover:ring-ov-400 sm:flex-row sm:items-center sm:justify-between md:p-6"
          >
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ov-500/30 blur-[70px]" />
            <span className="relative flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ov-500 text-white">
                <Cpu aria-hidden="true" className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-[18px] font-extrabold tracking-tight">Parkregler (EZA-Regler)</span>
                <span className="block text-[13.5px] text-white/65">misst am Netzanschlusspunkt, regelt P und Q, hält Einspeiselimit und Netzvorgaben ein</span>
              </span>
            </span>
            <ArrowRight aria-hidden="true" className="relative h-5 w-5 shrink-0 text-ov-300 transition-transform group-hover:translate-x-1" />
          </Link>
        </Ebene>
      </Reveal>

      <Verbinder text="Modbus TCP · SunSpec · OCPP über Lademanagement · Speicher-Energiemanagement" />

      <Reveal delay={160}>
        <Ebene label="Feldebene">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Knoten icon={Sun} titel="PV-Generator" text="Module, Strings, Unterkonstruktion" href="/produkte/photovoltaikanlage" />
            <Knoten icon={Zap} titel="Wechselrichter" text="verschiedene Hersteller" href="/produkte/hersteller" />
            <Knoten icon={BatteryCharging} titel="Speicher" text="Eigenverbrauch, Peak Shaving, Notstrom" href="/produkte/stromspeicher" />
            <Knoten icon={PlugZap} titel="Ladepunkte" text="E-Flotte mit Lastmanagement" href="/produkte/wallbox" />
          </div>
        </Ebene>
      </Reveal>

      <div className="flex items-center gap-3 py-3 pl-6 md:pl-10" aria-hidden="true">
        <ArrowDown className="h-6 w-6 text-ov-500" />
        <span className="text-[12.5px] text-ink-500">Energiefluss</span>
      </div>

      <Reveal delay={240}>
        <Ebene label="Netzanschluss">
          <div className="flex flex-col gap-2 rounded-2xl bg-ov-600 p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="flex items-center gap-2 text-[14.5px] font-semibold">
              <UtilityPole aria-hidden="true" className="h-4 w-4 shrink-0" />
              Netzanschlusspunkt: Messung, Schutz, Zähler
            </span>
            <ArrowRight aria-hidden="true" className="hidden h-5 w-5 sm:block" />
            <span className="flex items-center gap-2 text-[14.5px] font-semibold">
              <Landmark aria-hidden="true" className="h-4 w-4 shrink-0" />
              Verteilernetz (Netzebene 7 bis 3)
            </span>
          </div>
        </Ebene>
      </Reveal>
    </figure>
  );
}
