import { ArrowUp, BatteryCharging, Building2, Cpu, Gauge, PlugZap, Radio, Sun, TrendingUp, UtilityPole, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";
import Animationen from "@/components/ServiceAT/A/Animationen";

/**
 * Signalkette des Parkreglers auf dunklem Grund mit fließenden Datenwegen
 * (CSS-Animation, bei reduzierter Bewegung statisch). Inhalte wie in der
 * bisherigen Signalkette – ohne Produkt- oder Datenblattwerte.
 */

const VORGABEN = [
  {
    icon: Radio,
    titel: "Netzbetreiber",
    text: "Wirkleistungsstufen, Blindleistungsverfahren, Wirkleistungsbeendigung",
    chips: ["Potentialfreie Kontakte (z. B. Rundsteuer-/Funkempfänger)", "IEC 60870-5-104 / -101", "Modbus TCP/RTU", "OpenADR (Typ A, § 76 ElWG)"],
  },
  { icon: TrendingUp, titel: "Direktvermarkter", text: "Abregelung bei negativen Preisen, Fahrpläne, Ist-Einspeisung", chips: ["gesicherte Fernwirk- bzw. API-Verbindung"] },
  { icon: Building2, titel: "Betreiber & Energiemanagement", text: "Einspeiselimit (netzwirksame Leistung), Eigenverbrauch, Speicherstrategie", chips: ["Parametrierung, SCADA"] },
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

function Fluss({ className }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center justify-center", className)}>
      {/* mobil vertikal */}
      <svg viewBox="0 0 24 56" className="h-14 w-6 lg:hidden" fill="none">
        <path d="M12 0V48" stroke="#7fa7d6" strokeWidth="2.5" strokeDasharray="5 7" className="ts-fluss" />
        <path d="M5 42l7 10 7-10" stroke="#7fa7d6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* ab lg horizontal: drei Adern */}
      <svg viewBox="0 0 64 160" className="hidden h-40 w-16 lg:block" fill="none">
        {[30, 80, 130].map((y) => (
          <path key={y} d={`M0 ${y} C 32 ${y}, 32 80, 56 80`} stroke="#4a7cbd" strokeWidth="2" strokeDasharray="5 7" className="ts-fluss" />
        ))}
        <path d="M50 73l9 7-9 7" stroke="#7fa7d6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function FlussAus({ className }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center justify-center", className)}>
      <svg viewBox="0 0 24 56" className="h-14 w-6 lg:hidden" fill="none">
        <path d="M12 0V48" stroke="#7fa7d6" strokeWidth="2.5" strokeDasharray="5 7" className="ts-fluss" />
        <path d="M5 42l7 10 7-10" stroke="#7fa7d6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 64 160" className="hidden h-40 w-16 lg:block" fill="none">
        {[30, 80, 130].map((y) => (
          <path key={y} d={`M4 80 C 32 80, 32 ${y}, 58 ${y}`} stroke="#4a7cbd" strokeWidth="2" strokeDasharray="5 7" className="ts-fluss" />
        ))}
        <circle cx="4" cy="80" r="4" fill="#7fa7d6" />
      </svg>
    </div>
  );
}

export default function SignalketteLive() {
  return (
    <figure className="relative">
      <Animationen />
      <figcaption className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-display text-[18px] font-bold text-white md:text-[20px]">Signalkette: vom Sollwert zur geregelten Einspeisung</span>
        <span className="text-[13px] text-white/50">schematisch · Daten blau, Energie grün, Messwerte gelb</span>
      </figcaption>

      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1.1fr)_4rem_minmax(0,1fr)] lg:items-center lg:gap-0">
        <Reveal className="grid gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/45">1 · Vorgaben</p>
          {VORGABEN.map((v) => (
            <div key={v.titel} className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
              <p className="flex items-center gap-2 font-display text-[15.5px] font-bold text-white">
                <v.icon aria-hidden="true" className="h-4 w-4 text-navy-300" />
                {v.titel}
              </p>
              <p className="mt-1 text-[13.5px] leading-snug text-white/60">{v.text}</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {v.chips.map((c) => (
                  <li key={c} className="rounded-full bg-navy-800/80 px-2.5 py-1 text-[11.5px] font-medium text-navy-100 ring-1 ring-navy-600/60">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <Fluss />

        <Reveal delay={100} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ov-600 to-ov-800 p-6 text-white shadow-[0_40px_90px_-30px_rgba(102,153,51,0.7)] ring-1 ring-ov-300/40 md:p-7">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-50" />
          <div aria-hidden="true" className="ts-puls absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/25 blur-[60px]" />
          <div className="relative">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-100">2 · Parkregler / EZA-Regler</p>
            <p className="mt-2 flex items-center gap-2.5 font-display text-[21px] font-extrabold tracking-tight">
              <Cpu aria-hidden="true" className="h-6 w-6" />
              Regelkern am Netzanschlusspunkt
            </p>
            <ul className="mt-4 space-y-2.5 text-[14px] leading-snug text-white/90">
              {KERN.map((k) => (
                <li key={k} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                  {k}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-navy-950/35 px-3.5 py-2.5 text-[12.5px] leading-snug text-white/85 ring-1 ring-white/15">
              Unabhängig davon regeln die Wechselrichter autonom auf die Frequenz (LFSM-O) – dieser Sollwert hat nach TOR Vorrang vor allen anderen Wirkleistungsvorgaben.
            </p>
          </div>
        </Reveal>

        <FlussAus />

        <Reveal delay={200} className="grid gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/45">3 · Stellglieder</p>
          {STELLGLIEDER.map((s) => (
            <div key={s.titel} className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
              <p className="flex items-center gap-2 font-display text-[15.5px] font-bold text-white">
                <s.icon aria-hidden="true" className="h-4 w-4 text-ov-300" />
                {s.titel}
              </p>
              <p className="mt-1 text-[13.5px] leading-snug text-white/60">{s.text}</p>
              <p className="mt-2.5 inline-flex rounded-full bg-white/[0.06] px-2.5 py-1 text-[11.5px] font-medium text-white/70 ring-1 ring-white/12">{s.chip}</p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Energiefluss und Rückführung */}
      <Reveal delay={260} className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1.1fr)_4rem_minmax(0,1fr)]">
        <div className="hidden lg:block" />
        <div className="hidden lg:block" />
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-sun-400/10 px-4 py-3 text-[13.5px] font-semibold text-sun-300 ring-1 ring-sun-400/30">
          <ArrowUp aria-hidden="true" className="ts-blink h-4 w-4 shrink-0" />
          Rückführung: U, I, P, Q, cos φ, f – geschlossener Regelkreis
        </div>
      </Reveal>

      <Reveal delay={320} className="relative mt-3 overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-ov-400/40">
        <svg aria-hidden="true" className="absolute inset-x-0 top-1/2 hidden h-2 w-full -translate-y-1/2 sm:block" preserveAspectRatio="none" viewBox="0 0 1000 8">
          <path d="M0 4H1000" stroke="#669933" strokeWidth="8" strokeOpacity="0.2" />
          <path d="M0 4H1000" stroke="#8cba58" strokeWidth="3" strokeDasharray="14 12" className="ts-fluss" />
        </svg>
        <div className="relative flex flex-col items-stretch gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2 rounded-xl bg-navy-950 px-3.5 py-2 text-[13.5px] font-semibold text-white ring-1 ring-white/10">
            <Zap aria-hidden="true" className="h-4 w-4 shrink-0 text-sun-300" />
            Energiefluss: Wechselrichter, Speicher, Ladepunkte
          </span>
          <span className="flex items-center gap-2 rounded-xl bg-navy-950 px-3.5 py-2 text-[13.5px] font-semibold text-white ring-1 ring-white/10">
            <Gauge aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-300" />
            Messung am Netzanschlusspunkt (Wandler, MS- oder NS-seitig)
          </span>
          <span className="flex items-center gap-2 rounded-xl bg-navy-950 px-3.5 py-2 text-[13.5px] font-semibold text-white ring-1 ring-white/10">
            <UtilityPole aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-300" />
            Verteilernetz des Netzbetreibers
          </span>
        </div>
      </Reveal>
    </figure>
  );
}
