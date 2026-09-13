import Link from "next/link";
import { ArrowRight, BatteryCharging, Gauge, Home, Sun, UtilityPole } from "lucide-react";

import { AUTARKIE } from "@/data/smarthome-seite";

// Reihenfolge, in der ein Energiemanager den Solarstrom verteilt.
const SCHRITTE = [
  {
    icon: Sun,
    titel: "Erzeugen",
    text: "Die PV-Anlage produziert tagsüber Strom – im Allgäu rund 1.000 kWh je kWp im Jahr.",
  },
  {
    icon: Home,
    titel: "Direkt verbrauchen",
    text: "Zuerst versorgt der Solarstrom alles, was im Haus gerade läuft.",
  },
  {
    icon: BatteryCharging,
    titel: "Speichern & laden",
    text: "Überschuss lädt den Speicher oder über die Wallbox das E-Auto.",
  },
  {
    icon: UtilityPole,
    titel: "Einspeisen",
    text: "Erst was dann noch übrig bleibt, geht gegen Vergütung ins Netz.",
  },
];

/**
 * Erklärt in einem Blick, wie Speicher, Wallbox und Smartmeter
 * zusammenwirken – und was das für die Unabhängigkeit vom Netz bedeutet.
 */
export default function Energiefluss() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
      <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-[#669933]">
          So greift alles ineinander
        </p>
        <h2 className="text-balance text-[26px] font-semibold leading-tight text-gray-900 md:text-[34px]">
          Jede Kilowattstunde Solarstrom an die richtige Stelle
        </h2>
        <p className="mx-auto mt-4 max-w-[60ch] text-[16px] leading-relaxed text-gray-600 md:text-[17px]">
          Ein Energiemanager entscheidet sekundengenau, wohin Ihr Strom fließt.
          Das Smartmeter liefert ihm dafür die Messwerte.
        </p>
      </div>

      {/* Ablauf: mobil untereinander mit senkrechter Linie, ab lg nebeneinander
          mit waagerechter Verbindungslinie hinter den Symbolen. */}
      <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
        <span
          aria-hidden="true"
          className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-[#669933]/50 via-[#669933]/25 to-transparent lg:left-[12.5%] lg:right-[12.5%] lg:top-[27px] lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r"
        />
        {SCHRITTE.map(({ icon: Icon, titel, text }, i) => (
          <li key={titel} className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center">
            <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-gray-100">
              <Icon aria-hidden="true" className="h-6 w-6 text-[#669933]" />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#003473] text-[11px] font-semibold text-white">
                {i + 1}
              </span>
            </span>
            <div className="lg:mt-5">
              <h3 className="mb-1.5 text-[18px] font-semibold text-gray-900">{titel}</h3>
              <p className="text-[15px] leading-relaxed text-gray-600 lg:mx-auto lg:max-w-[26ch]">
                {text}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* Vergleich Autarkie */}
      <div className="mt-14 grid gap-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:mt-16 md:p-9 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-14">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f7e6]">
              <Gauge aria-hidden="true" className="h-5 w-5 text-[#669933]" />
            </span>
            <h3 className="text-[20px] font-semibold text-gray-900 md:text-[22px]">
              Was der Speicher ausmacht
            </h3>
          </div>
          <p className="text-[15px] leading-relaxed text-gray-600 md:text-[16px]">
            Ohne Speicher fällt der meiste Solarstrom mittags an, wenn kaum jemand
            zu Hause ist. Mit Speicher und Wallbox nutzen Sie ihn abends, nachts
            und fürs Auto – und kaufen entsprechend weniger Strom zu.
          </p>
          <Link
            href="/solarrechner"
            className="group mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-[#669933] hover:text-[#558822]"
          >
            Eigenen Wert berechnen
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div>
          <dl className="space-y-6">
            <Balken label="PV-Anlage ohne Speicher" wert={AUTARKIE.ohneSpeicher} ton="grau" />
            <Balken label="Mit Speicher & Energiemanagement" wert={AUTARKIE.mitSpeicher} praefix="bis zu" ton="gruen" />
          </dl>
          <p className="mt-5 text-[13px] leading-relaxed text-gray-500 [hyphens:manual]">
            Anteil des Jahresstrombedarfs aus eigener Erzeugung (Autarkie).
            Richtwerte für ein Einfamilienhaus – abhängig von Verbrauch,
            Anlagen- und Speichergröße.
          </p>
        </div>
      </div>
    </section>
  );
}

function Balken({ label, wert, praefix = "rund", ton }) {
  const gruen = ton === "gruen";
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <dt className="text-[15px] font-medium text-gray-700">{label}</dt>
        <dd className={`whitespace-nowrap text-[15px] ${gruen ? "text-[#3f6b1a]" : "text-gray-500"}`}>
          {praefix} <span className="text-[22px] font-semibold tabular-nums">{wert} %</span>
        </dd>
      </div>
      <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${gruen ? "bg-gradient-to-r from-[#7fb446] to-[#669933]" : "bg-gray-300"}`}
          style={{ width: `${wert}%` }}
        />
      </div>
    </div>
  );
}
