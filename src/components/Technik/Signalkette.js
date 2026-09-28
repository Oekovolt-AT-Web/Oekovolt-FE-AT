import { ArrowDown, ArrowRight, ArrowUp, BatteryCharging, Building2, Cpu, Gauge, PlugZap, Radio, Sun, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * Signalkette des Parkreglers (EZA-Regler) als responsive Diagramm aus Tailwind-
 * Boxen und SVG-Pfeilen – auf dem Smartphone vertikal, ab lg horizontal mit
 * Rückführung der Messwerte vom Netzanschlusspunkt.
 * Bewusst ohne Produkt- oder Datenblattwerte: Protokolle sind die in TOR bzw.
 * Branche üblichen Schnittstellen, die konkrete Auswahl legt der Netzanschlussvertrag fest.
 */

const VORGABEN = [
  {
    icon: Radio,
    titel: "Netzbetreiber",
    text: "Wirkleistungsstufen, Blindleistungsverfahren, Wirkleistungsbeendigung",
    chips: ["Potentialfreie Kontakte (z. B. Rundsteuer-/Funkempfänger)", "IEC 60870-5-104 / -101", "Modbus TCP/RTU", "OpenADR (Typ A, § 76 ElWG)"],
  },
  {
    icon: TrendingUp,
    titel: "Direktvermarkter",
    text: "Abregelung bei negativen Preisen, Fahrpläne, Ist-Einspeisung",
    chips: ["gesicherte Fernwirk- bzw. API-Verbindung"],
  },
  {
    icon: Building2,
    titel: "Betreiber & Energiemanagement",
    text: "Einspeiselimit (netzwirksame Leistung), Eigenverbrauch, Speicherstrategie",
    chips: ["Parametrierung, SCADA"],
  },
];

const KERN = [
  "Priorisierung: Schutz und Netzbetreiber-Vorgaben vor Vermarktung vor Eigenoptimierung",
  "Wirkleistungsregelung mit Rampen und Einspeiselimit",
  "Blindleistung: cos φ fix, cos φ(P), Q(U), Q fix",
  "Rückfallwert bei Kommunikationsausfall",
  "Zeitgestempeltes Ereignis- und Sollwertprotokoll",
];

const STELLGLIEDER = [
  { icon: Sun, titel: "PV-Wechselrichter", text: "verschiedene Hersteller parallel", chip: "Modbus TCP · SunSpec-Modelle · Herstellerprotokolle" },
  { icon: BatteryCharging, titel: "Batteriespeicher", text: "Laden, Entladen, Blindleistung", chip: "Speicher-Umrichter / Energiemanagement" },
  { icon: PlugZap, titel: "Ladepunkte", text: "Lastmanagement in Bezugsrichtung", chip: "OCPP über Lademanagement" },
];

function Pfeil({ className }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center justify-center text-ov-500", className)}>
      <ArrowDown className="h-7 w-7 lg:hidden" strokeWidth={2.2} />
      <svg viewBox="0 0 48 24" className="hidden h-6 w-12 lg:block" fill="none">
        <path d="M2 12h40" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" />
        <path d="M36 5l8 7-8 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function Signalkette() {
  return (
    <figure className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-ink-200/70 sm:p-7 md:p-9">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-display text-[18px] font-bold text-ink-900 md:text-[20px]">Signalkette: vom Sollwert zur geregelten Einspeisung</span>
        <span className="text-[13px] text-ink-500">schematisch · Datenfluss gestrichelt, Energiefluss grün</span>
      </figcaption>

      <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1.05fr)_3rem_minmax(0,1fr)] lg:items-center lg:gap-0">
        {/* Vorgaben */}
        <Reveal className="grid gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">1 · Vorgaben</p>
          {VORGABEN.map((v) => (
            <div key={v.titel} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/70">
              <p className="flex items-center gap-2 font-display text-[15.5px] font-bold text-ink-900">
                <v.icon aria-hidden="true" className="h-4 w-4 text-navy-500" />
                {v.titel}
              </p>
              <p className="mt-1 text-[13.5px] leading-snug text-ink-600">{v.text}</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {v.chips.map((c) => (
                  <li key={c} className="rounded-full bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink-600 ring-1 ring-ink-200">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <Pfeil className="py-1 lg:py-0" />

        {/* Regelkern */}
        <Reveal delay={100} className="relative overflow-hidden rounded-3xl bg-navy-950 p-5 text-white shadow-2xl sm:p-6">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ov-500/30 blur-[70px]" />
          <div className="relative">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-300">2 · Parkregler / EZA-Regler</p>
            <p className="mt-2 flex items-center gap-2 font-display text-[20px] font-extrabold tracking-tight">
              <Cpu aria-hidden="true" className="h-5 w-5 text-ov-300" />
              Regelkern am Netzanschlusspunkt
            </p>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-snug text-white/75">
              {KERN.map((k) => (
                <li key={k} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ov-400" />
                  {k}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-[12.5px] leading-snug text-white/60 ring-1 ring-white/10">
              Unabhängig davon regeln die Wechselrichter autonom auf die Frequenz (LFSM-O) – dieser Sollwert hat nach TOR Vorrang vor allen
              anderen Wirkleistungsvorgaben.
            </p>
          </div>
        </Reveal>

        <Pfeil className="py-1 lg:py-0" />

        {/* Stellglieder */}
        <Reveal delay={200} className="grid gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">3 · Stellglieder</p>
          {STELLGLIEDER.map((s) => (
            <div key={s.titel} className="rounded-2xl bg-white p-4 ring-1 ring-ink-200">
              <p className="flex items-center gap-2 font-display text-[15.5px] font-bold text-ink-900">
                <s.icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
                {s.titel}
              </p>
              <p className="mt-1 text-[13.5px] leading-snug text-ink-600">{s.text}</p>
              <p className="mt-2.5 inline-flex rounded-full bg-ink-50 px-2.5 py-1 text-[11.5px] font-medium text-ink-600 ring-1 ring-ink-200">{s.chip}</p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Energiefluss und Rückführung */}
      <Reveal delay={260} className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-[3rem]">
        <div className="hidden lg:block" />
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-ov-50 px-4 py-3 text-[13.5px] font-semibold text-ov-800 ring-1 ring-ov-200">
          <ArrowUp aria-hidden="true" className="h-4 w-4 shrink-0" />
          Rückführung: U, I, P, Q, cos φ, f – geschlossener Regelkreis
        </div>
        <div className="hidden lg:block" />
      </Reveal>

      <Reveal delay={320} className="mt-3 flex flex-col items-stretch gap-2 rounded-2xl bg-ov-600 p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="flex items-center gap-2 text-[14px] font-semibold">
          <Zap aria-hidden="true" className="h-4 w-4 shrink-0 text-sun-300" />
          Energiefluss: Wechselrichter, Speicher, Ladepunkte
        </span>
        <ArrowRight aria-hidden="true" className="hidden h-5 w-5 shrink-0 sm:block" />
        <span className="flex items-center gap-2 text-[14px] font-semibold">
          <Gauge aria-hidden="true" className="h-4 w-4 shrink-0" />
          Messung am Netzanschlusspunkt (Wandler, MS- oder NS-seitig)
        </span>
        <ArrowRight aria-hidden="true" className="hidden h-5 w-5 shrink-0 sm:block" />
        <span className="text-[14px] font-semibold">Verteilernetz des Netzbetreibers</span>
      </Reveal>
    </figure>
  );
}
