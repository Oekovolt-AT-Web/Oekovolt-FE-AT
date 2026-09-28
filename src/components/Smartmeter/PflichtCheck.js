"use client";

import { useState } from "react";
import { BadgeCheck, Info, ShieldCheck, Sparkles } from "lucide-react";
import Regler from "@/components/Wallbox/Regler";

/**
 * Smart-Meter-Check Österreich (ElWG § 54, Stand 09/2026):
 * Ist ein Opt-out möglich – oder misst der Smart Meter Viertelstundenwerte?
 * Und ab wann ist im Betrieb ein Lastprofilzähler (Leistungsmessung) üblich?
 *
 * Opt-out ausgeschlossen (§ 54 Abs. 2 ElWG) u. a. bei meldepflichtigen
 * Anlagen (PV, Wallbox, Wärmepumpe, Speicher), dynamischem Tarif und
 * Teilnahme an einer Energiegemeinschaft.
 * Quelle: https://netz-noe.at/energiezukunft/elwg-zu-smart-meter
 * Lastprofilzähler: üblich ab 100.000 kWh Jahresverbrauch oder 50 kW
 * Anschlussleistung (bisher § 17 ElWOG 2010, standardisierte Lastprofile).
 *
 * Dateiname und Export bleiben aus Kompatibilitätsgründen „PflichtCheck“.
 */

const OPTIONEN = [
  { k: "pv", label: "PV-Anlage oder andere Erzeugungsanlage" },
  { k: "geraet", label: "Wallbox, Wärmepumpe oder Stromspeicher" },
  { k: "dynamisch", label: "Dynamischer Stromtarif (Spotpreis)" },
  { k: "eg", label: "Teilnahme an einer Energiegemeinschaft oder GEA" },
];

function bewerte({ verbrauch, auswahl }) {
  const gruende = OPTIONEN.filter((o) => auswahl[o.k]).map((o) => o.label);
  const lastprofil = verbrauch > 100000;
  return { optOutMoeglich: gruende.length === 0 && !lastprofil, gruende, lastprofil };
}

export default function PflichtCheck() {
  const [verbrauch, setVerbrauch] = useState(4500);
  const [auswahl, setAuswahl] = useState({ pv: true, geraet: false, dynamisch: false, eg: false });
  const r = bewerte({ verbrauch, auswahl });
  const umschalten = (k) => setAuswahl((a) => ({ ...a, [k]: !a[k] }));

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="space-y-4 p-6 md:p-8">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Smart-Meter-Check Österreich</p>
        <Regler
          id="pc-verbrauch"
          label="Stromverbrauch pro Jahr"
          wert={verbrauch}
          min={1000}
          max={200000}
          step={1000}
          onChange={setVerbrauch}
          anzeige={`${verbrauch.toLocaleString("de-DE")} kWh`}
          hinweis="Betriebe über 100.000 kWh werden in der Regel mit Lastprofilzähler gemessen."
        />
        {OPTIONEN.map((o) => (
          <label
            key={o.k}
            className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-2xl bg-ink-50 px-4 py-3 ring-1 ring-ink-200/70 transition-colors hover:bg-ov-50"
          >
            <span className="text-[14px] font-medium text-ink-700">{o.label}</span>
            <input type="checkbox" checked={auswahl[o.k]} onChange={() => umschalten(o.k)} className="peer sr-only" />
            <span
              aria-hidden="true"
              className="relative h-7 w-12 shrink-0 rounded-full bg-ink-300 transition-colors peer-checked:bg-ov-500 peer-focus-visible:ring-4 peer-focus-visible:ring-ov-500/30 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
            />
          </label>
        ))}
      </div>

      <div aria-live="polite" className={`relative overflow-hidden p-6 text-white transition-colors duration-500 md:p-8 ${r.optOutMoeglich ? "bg-ov-700" : "bg-navy-950"}`}>
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div className="relative">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">
            {r.optOutMoeglich ? <Sparkles aria-hidden="true" className="h-4 w-4 text-sun-300" /> : <ShieldCheck aria-hidden="true" className="h-4 w-4 text-ov-300" />}
            Ihr Ergebnis
          </p>
          <p className="mt-3 font-display text-[24px] font-extrabold leading-tight tracking-tight md:text-[28px]">
            {r.lastprofil ? "Lastprofilzähler mit Leistungsmessung" : r.optOutMoeglich ? "Opt-out ist möglich" : "Viertelstundenwerte – kein Opt-out"}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/75">
            {r.lastprofil
              ? "Bei diesem Verbrauch misst der Netzbetreiber üblicherweise mit Lastprofilzähler: Viertelstundenleistung, Leistungspreis und Lastgang sind Grundlage für Netzentgelt, PV-Planung und Peak Shaving."
              : r.optOutMoeglich
                ? "Sie können der Speicherung und Übertragung von Tages- und Viertelstundenwerten widersprechen (§ 54 Abs. 2 ElWG). Ohne Widerspruch stellen die Netzbetreiber schrittweise auf Viertelstundenwerte um."
                : `Grund: ${r.gruende.join(", ")}. In diesen Fällen ist ein Opt-out nach § 54 Abs. 2 ElWG ausgeschlossen – die Viertelstundenwerte stehen Ihnen im Kundenportal des Netzbetreibers zur Verfügung.`}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="ov-glass rounded-2xl p-4 text-[13.5px] leading-snug text-white/80">
              <p className="flex gap-2">
                <BadgeCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
                Den Zähler stellt immer Ihr Netzbetreiber – die Kosten sind im regulierten Messentgelt enthalten.
              </p>
            </div>
            <div className="ov-glass rounded-2xl p-4 text-[13.5px] leading-snug text-white/80">
              <p className="flex gap-2">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" />
                {r.optOutMoeglich
                  ? "Für dynamische Tarife oder Energiegemeinschaften brauchen Sie die Viertelstundenwerte."
                  : "Echtzeitwerte für das Energiemanagement liefert die Kundenschnittstelle des Zählers."}
              </p>
            </div>
          </div>
          <p className="mt-5 text-[12px] leading-snug text-white/50">Orientierung nach ElWG, Stand September 2026. Details regelt Ihr Netzbetreiber. Keine Rechtsberatung.</p>
        </div>
      </div>
    </div>
  );
}
