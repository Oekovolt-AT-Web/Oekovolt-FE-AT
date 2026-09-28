import Link from "next/link";
import { BadgeEuro, Gauge, Percent, Receipt } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/**
 * Rechtlicher und wirtschaftlicher Rahmen für neue PV-Anlagen in Österreich 2026.
 * Branchenwissen als Orientierung – mit Stand-Datum, zitierfähig formuliert,
 * bewusst ohne Fördersätze (ändern sich je OeMAG-Fördercall).
 */
const ZEILEN = [
  {
    icon: BadgeEuro,
    thema: "Förderung",
    wert: "EAG",
    text: "Investitionszuschuss nach § 56 EAG über OeMAG-Fördercalls, Kategorien A bis D bis 1.000 kWp. Antrag vor der Bestellung.",
    href: "/forderungen/bundesfoerderung",
    link: "Bundesförderung",
  },
  {
    icon: Percent,
    thema: "Umsatzsteuer",
    wert: "20 %",
    text: "Der befristete Nullsteuersatz endete mit 31. März 2025. Für vorsteuerabzugsberechtigte Betriebe kein Kostenfaktor.",
    href: "/forderungen/steuerlich",
    link: "Steuerliche Vorteile",
  },
  {
    icon: Receipt,
    thema: "Elektrizitätsabgabe",
    wert: "befreit",
    text: "Selbst erzeugter und selbst verbrauchter PV-Strom ist von der Elektrizitätsabgabe befreit – ein Vorteil jeder Kilowattstunde Eigenverbrauch.",
  },
  {
    icon: Gauge,
    thema: "Netzanschluss",
    wert: "TOR",
    text: "Typ A ab 0,8 kW, Typ B ab 250 kW nach TOR Stromerzeugungsanlagen – mit Anforderungen an Blindleistung und Fernsteuerbarkeit.",
    href: "/technik/parkregler",
    link: "Parkregler",
  },
];

export default function Rahmen2026() {
  return (
    <Reveal className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-2 border-b border-ink-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <h3 className="font-display text-[19px] font-bold text-ink-900 md:text-[21px]">Was 2026 in Österreich für neue Anlagen gilt</h3>
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
