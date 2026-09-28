import { Car, Flame, Gauge, Share2, Clock3, ShieldCheck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Smart Meter & ElWG kurz erklärt – österreichisches Pendant zum früheren
 * Abschnitt über § 14a EnWG (Deutschland). Dateiname und Export bleiben aus
 * Kompatibilitätsgründen. Stand September 2026.
 * Quellen: ElWG § 54 (Netz NÖ, https://netz-noe.at/energiezukunft/elwg-zu-smart-meter),
 * energiegemeinschaften.gv.at (Neuerungen ab 1.10.2026).
 */
const PUNKTE = [
  { icon: Clock3, titel: "Viertelstundenwerte", text: "Mit Wallbox, Wärmepumpe, Speicher oder PV misst der Smart Meter immer in Viertelstundenwerten – ein Opt-out ist dann ausgeschlossen." },
  { icon: Gauge, titel: "Dynamische Tarife", text: "Spotpreis-Tarife rechnen nach dem Day-Ahead-Preis der Gebotszone Österreich ab. Das Energiemanagement verlegt flexible Verbraucher in günstige Viertelstunden." },
  { icon: Share2, titel: "Energiegemeinschaften", text: "Ab 1. Oktober 2026 regelt das ElWG gemeinsame Energienutzung neu – inklusive Peer-to-Peer-Verträgen. Überschüsse lassen sich in der Nachbarschaft teilen." },
];

export default function Paragraf14a() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
      <div>
        <SectionHeading
          eyebrow="Smart Meter & ElWG"
          title={
            <>
              Wallbox & Wärmepumpe: <span className="ov-text-gradient">was 2026 gilt</span>
            </>
          }
        />
        <Reveal delay={80} className="mt-6 space-y-4 text-[16.5px] leading-relaxed text-ink-600">
          <p>
            <strong className="font-semibold text-ink-900">
              Wallboxen, Wärmepumpen und Stromspeicher sind in Österreich dem Netzbetreiber zu melden. Mit einer solchen Anlage misst der Smart Meter immer in Viertelstundenwerten.
            </strong>{" "}
            Das regelt § 54 des Elektrizitätswirtschaftsgesetzes (ElWG), das seit Ende 2025 in Kraft ist.
          </p>
          <p>
            Die Viertelstundenwerte sind kein Nachteil, sondern die Grundlage für dynamische Tarife und Energiegemeinschaften. Sie sehen sie im Kundenportal Ihres Netzbetreibers; Echtzeitwerte liefert die Kundenschnittstelle des Zählers.
          </p>
          <p>Ein Energiemanagement nutzt diese Daten automatisch und verteilt die Leistung so, dass vorrangig eigener Solarstrom genutzt wird. Die Meldung beim Netzbetreiber übernehmen wir.</p>
        </Reveal>
      </div>

      <Reveal dir="right" className="relative">
        <div className="overflow-hidden rounded-[2rem] bg-sand-50 ring-1 ring-ink-200/70">
          <div className="flex flex-wrap items-center gap-5 border-b border-ink-200/70 p-6 md:p-8">
            <div className="flex -space-x-2" aria-hidden="true">
              {[Flame, Car, ShieldCheck].map((I, i) => (
                <span key={i} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ov-600 shadow-md ring-2 ring-sand-50">
                  <I className="h-5 w-5" />
                </span>
              ))}
            </div>
            <div>
              <p className="ov-num font-display text-[34px] font-extrabold leading-none tracking-tight text-ink-900">96</p>
              <p className="mt-1 text-[14px] text-ink-500">Messwerte am Tag statt einer Ablesung im Jahr</p>
            </div>
          </div>
          <ul className="divide-y divide-ink-200/70">
            {PUNKTE.map(({ icon: Icon, titel, text }) => (
              <li key={titel} className="flex gap-4 p-6 md:px-8">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ink-200/70">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-[17px] font-bold text-ink-900">{titel}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-600">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-ink-200/70 bg-white/60 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
            Orientierung, Stand September 2026. Details zu Messung und Anschluss regelt Ihr Netzbetreiber; wir klären sie bei der Planung.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
