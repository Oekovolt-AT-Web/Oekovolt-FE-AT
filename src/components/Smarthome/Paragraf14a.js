import { Car, Flame, Gauge, Percent, Clock3, BadgePercent } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * §14a EnWG kurz und korrekt erklärt – als Orientierung, Stand September 2026.
 */
const MODULE = [
  { icon: BadgePercent, titel: "Modul 1", text: "Pauschale Reduzierung des Netzentgelts pro Jahr – die Höhe legt Ihr Netzbetreiber fest." },
  { icon: Percent, titel: "Modul 2", text: "60 % weniger Arbeitspreis beim Netzentgelt – setzt einen separaten Zähler für die Verbrauchseinrichtung voraus." },
  { icon: Clock3, titel: "Modul 3", text: "Zeitvariables Netzentgelt zusätzlich zu Modul 1 (seit April 2025) – günstiger in netzschwachen Zeiten, erfordert ein intelligentes Messsystem." },
];

export default function Paragraf14a() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
      <div>
        <SectionHeading
          eyebrow="§14a EnWG verständlich"
          title={<>Wärmepumpe & Wallbox: <span className="ov-text-gradient">weniger Netzentgelt</span></>}
        />
        <Reveal delay={80} className="mt-6 space-y-4 text-[16.5px] leading-relaxed text-ink-600">
          <p>
            <strong className="font-semibold text-ink-900">Seit 2024 gelten neu angeschlossene Wärmepumpen, private Wallboxen, Klimageräte und Batteriespeicher mit mehr als 4,2 kW Anschlussleistung als steuerbare Verbrauchseinrichtungen nach §14a EnWG.</strong>{" "}
            Sie werden beim Netzbetreiber angemeldet.
          </p>
          <p>
            Im Gegenzug zahlen Sie ein reduziertes Netzentgelt. Dafür darf der Netzbetreiber bei drohender Überlastung des örtlichen Netzes den Strombezug dieser Geräte vorübergehend drosseln – aber nie unter 4,2 kW. Ihr normaler Haushaltsstrom ist davon nicht betroffen, abgeschaltet wird nichts.
          </p>
          <p>
            Ein Energiemanagement macht das praktisch unsichtbar: Es verteilt die verfügbare Leistung automatisch und nutzt vorrangig Ihren eigenen Solarstrom. Die Anmeldung übernehmen wir für Sie.
          </p>
        </Reveal>
      </div>

      <Reveal dir="right" className="relative">
        <div className="overflow-hidden rounded-[2rem] bg-sand-50 ring-1 ring-ink-200/70">
          <div className="flex flex-wrap items-center gap-5 border-b border-ink-200/70 p-6 md:p-8">
            <div className="flex -space-x-2" aria-hidden="true">
              {[Flame, Car, Gauge].map((I, i) => (
                <span key={i} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ov-600 shadow-md ring-2 ring-sand-50">
                  <I className="h-5 w-5" />
                </span>
              ))}
            </div>
            <div>
              <p className="ov-num font-display text-[34px] font-extrabold leading-none tracking-tight text-ink-900">
                ≥ 4,2 kW
              </p>
              <p className="mt-1 text-[14px] text-ink-500">bleiben jedem Gerät auch bei einer Drosselung</p>
            </div>
          </div>
          <ul className="divide-y divide-ink-200/70">
            {MODULE.map(({ icon: Icon, titel, text }) => (
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
            Orientierung, Stand September 2026. Welche Module Ihr Netzbetreiber anbietet und wie hoch die Entlastung ausfällt, prüfen wir bei der Planung. Für Geräte, die vor 2024 in Betrieb gingen, gelten Übergangsregeln.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
