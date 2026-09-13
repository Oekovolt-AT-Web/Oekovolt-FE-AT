import Link from "next/link";
import { BadgeEuro, Gauge, Percent, Receipt } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/**
 * Rechtlicher und wirtschaftlicher Rahmen für neue PV-Anlagen 2026.
 * Branchenwissen als Orientierung – mit Stand-Datum, zitierfähig formuliert.
 */
const ZEILEN = [
  {
    icon: BadgeEuro,
    thema: "Einspeisevergütung",
    wert: "7,70 ct/kWh",
    text: "Teileinspeisung bis 10 kWp, Inbetriebnahme ab 1. August 2026, 20 Jahre fest. Sinkt halbjährlich leicht.",
    href: "/ratgeber/einspeiseverguetung-2026",
    link: "Vergütung 2026",
  },
  {
    icon: Percent,
    thema: "Umsatzsteuer",
    wert: "0 %",
    text: "Nullsteuersatz auf Lieferung und Montage nach § 12 Abs. 3 UStG – bei Anlagen auf Wohngebäuden in der Regel bis 30 kWp.",
    href: "/forderungen/steuerlich",
    link: "Steuerliche Vorteile",
  },
  {
    icon: Receipt,
    thema: "Einkommensteuer",
    wert: "steuerfrei",
    text: "Einnahmen aus Anlagen bis 30 kWp je Wohn- oder Gewerbeeinheit sind nach § 3 Nr. 72 EStG von der Einkommensteuer befreit.",
  },
  {
    icon: Gauge,
    thema: "Solarspitzengesetz",
    wert: "60 %",
    text: "Neue Anlagen ohne Smart Meter und Steuerbox speisen max. 60 % der Modulleistung ein; bei negativen Börsenpreisen keine Vergütung.",
    href: "/produkte/smartmeter",
    link: "Smart Meter",
  },
];

export default function Rahmen2026() {
  return (
    <Reveal className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-2 border-b border-ink-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <h3 className="font-display text-[19px] font-bold text-ink-900 md:text-[21px]">Was 2026 für neue Anlagen gilt</h3>
        <p className="text-[13px] text-ink-500">Orientierung · Stand September 2026 · keine Steuerberatung</p>
      </div>
      <dl className="grid gap-px bg-ink-100 md:grid-cols-2 xl:grid-cols-4">
        {ZEILEN.map((z) => {
          const Icon = z.icon;
          return (
            <div key={z.thema} className="flex flex-col bg-white p-6 md:p-7">
              <dt className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-500">
                <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
                {z.thema}
              </dt>
              <dd className="ov-num mt-3 font-display text-[30px] font-extrabold leading-none tracking-tight text-ink-900">{z.wert}</dd>
              <dd className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-600">{z.text}</dd>
              {z.href && (
                <dd className="mt-4">
                  <Link href={z.href} className="text-[14px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                    {z.link}
                  </Link>
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    </Reveal>
  );
}
