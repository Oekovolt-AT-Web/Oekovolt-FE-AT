// src/app/energie-live/_marktindizes/IndexVerweis.js
//
// Kompakter Verweisblock auf die Ökovolt-Marktindizes (B10) – für Gewerbespeicher,
// Peak-Shaving-Rechner und Einspeisung Gewerbe. Zahl des letzten Monats mit Stand und Kennzeichnung.

import Link from "next/link";
import { ArrowRight, BatteryCharging, Sun } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { SOLAR_INDEX, SPEICHER_INDEX, ctAusMwh, datumText, eur, monatLabel } from "./daten";

/**
 * props:
 *  fokus  "speicher" | "solar" – welcher Index zuerst steht
 *  className
 */
export default function IndexVerweis({ fokus = "speicher", className }) {
  const sp = SPEICHER_INDEX.monate[SPEICHER_INDEX.monate.length - 1];
  const so = SOLAR_INDEX.monate[SOLAR_INDEX.monate.length - 1];
  const karten = [
    {
      key: "speicher",
      href: "/energie-live/speicher-index",
      icon: BatteryCharging,
      titel: "Speicher-Spread-Index",
      wert: eur(sp.spreadErloesEur),
      text: `theoretischer Day-Ahead-Spread-Erlös je MWh Speicher im ${monatLabel(sp.monat)} – Obergrenze, keine Erlöszusage`,
    },
    {
      key: "solar",
      href: "/energie-live/solar-marktwert",
      icon: Sun,
      titel: "Solar-Marktwert",
      wert: ctAusMwh(so.solarMarktwert),
      text: `PV-gewichteter Börsenpreis im ${monatLabel(so.monat)} (Monatsmittel ${ctAusMwh(so.mittel)}) – Ökovolt-Schätzung, nicht amtlich`,
    },
  ].sort((a, b) => (a.key === fokus ? -1 : b.key === fokus ? 1 : 0));

  return (
    <aside aria-label="Ökovolt-Marktindizes" className={cn("rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-7", className)}>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Eigene Marktindizes · offen nachrechenbar</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {karten.map((k) => (
          <Link key={k.key} href={k.href} className="group flex flex-col rounded-2xl bg-white p-4 ring-1 ring-ink-200/60 transition-all hover:ring-ov-300 md:p-5">
            <span className="flex items-center gap-2 text-[15px] font-bold text-ink-900">
              <k.icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
              {k.titel}
            </span>
            <span className="ov-num mt-2 font-display text-[26px] font-extrabold leading-none text-ink-900">{k.wert}</span>
            <span className="mt-2 text-[13.5px] leading-snug text-ink-600">{k.text}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-ov-700">
              Zum Index
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500">
        Eigene Berechnung Ökovolt Österreich · Daten: Speicher-Spread-Index – Bundesnetzagentur | SMARD.de; Solar-Marktwert – Bundesnetzagentur | SMARD.de und Energy-Charts (Fraunhofer ISE); jeweils CC BY 4.0 · Stand {datumText(SPEICHER_INDEX.stand)} · Richtwert/Orientierung
      </p>
    </aside>
  );
}
