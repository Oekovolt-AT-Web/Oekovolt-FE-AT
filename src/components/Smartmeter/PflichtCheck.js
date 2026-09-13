"use client";

import { useState } from "react";
import { BadgeCheck, Info, ShieldCheck, Sparkles } from "lucide-react";
import Regler from "@/components/Wallbox/Regler";

/**
 * Pflicht-Check nach Messstellenbetriebsgesetz (§ 29, § 30 MsbG, Stand 2026):
 * Welcher Zähler kommt – und welche Preisobergrenze gilt für Sie?
 * Werte = Anteil des Anschlussnutzers (brutto/Jahr).
 */

function bewerte({ verbrauch, kwp, steuerbar }) {
  const gruende = [];
  if (verbrauch > 6000) gruende.push(`Jahresverbrauch über 6.000 kWh`);
  if (kwp > 7) gruende.push(`PV-Anlage über 7 kW`);
  if (steuerbar) gruende.push("steuerbare Verbrauchseinrichtung nach § 14a EnWG");
  const pflicht = gruende.length > 0;

  const kandidaten = [];
  if (verbrauch > 50000) kandidaten.push(140);
  else if (verbrauch > 20000) kandidaten.push(110);
  else if (verbrauch > 10000) kandidaten.push(50);
  else if (verbrauch > 6000) kandidaten.push(40);
  if (kwp > 25) kandidaten.push(140);
  else if (kwp > 15) kandidaten.push(110);
  else if (kwp > 7) kandidaten.push(50);
  if (steuerbar) kandidaten.push(50);

  return {
    pflicht,
    gruende,
    preis: pflicht ? Math.max(...kandidaten) : 20,
    steuerbox: kwp > 7 || steuerbar,
  };
}

export default function PflichtCheck() {
  const [verbrauch, setVerbrauch] = useState(4500);
  const [kwp, setKwp] = useState(9);
  const [steuerbar, setSteuerbar] = useState(false);
  const r = bewerte({ verbrauch, kwp, steuerbar });

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="space-y-4 p-6 md:p-8">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Smart-Meter-Pflicht-Check</p>
        <Regler
          id="pc-verbrauch"
          label="Stromverbrauch pro Jahr"
          wert={verbrauch}
          min={1000}
          max={30000}
          step={500}
          onChange={setVerbrauch}
          anzeige={`${verbrauch.toLocaleString("de-DE")} kWh`}
        />
        <Regler
          id="pc-kwp"
          label="Leistung Ihrer PV-Anlage"
          wert={kwp}
          min={0}
          max={30}
          step={0.5}
          onChange={setKwp}
          anzeige={kwp === 0 ? "keine" : `${kwp.toLocaleString("de-DE")} kWp`}
        />
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-2xl bg-ink-50 px-4 py-3 ring-1 ring-ink-200/70 transition-colors hover:bg-ov-50">
          <span className="text-[14px] font-medium text-ink-700">
            Wärmepumpe, Wallbox oder Speicher über 4,2&nbsp;kW <span className="text-ink-500">(§ 14a EnWG)</span>
          </span>
          <input type="checkbox" checked={steuerbar} onChange={(e) => setSteuerbar(e.target.checked)} className="peer sr-only" />
          <span aria-hidden="true" className="relative h-7 w-12 shrink-0 rounded-full bg-ink-300 transition-colors peer-checked:bg-ov-500 peer-focus-visible:ring-4 peer-focus-visible:ring-ov-500/30 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
        </label>
      </div>

      <div aria-live="polite" className={`relative overflow-hidden p-6 text-white transition-colors duration-500 md:p-8 ${r.pflicht ? "bg-navy-950" : "bg-ov-700"}`}>
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div className="relative">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">
            {r.pflicht ? <ShieldCheck aria-hidden="true" className="h-4 w-4 text-ov-300" /> : <Sparkles aria-hidden="true" className="h-4 w-4 text-sun-300" />}
            Ihr Ergebnis
          </p>
          <p className="mt-3 font-display text-[24px] font-extrabold leading-tight tracking-tight md:text-[28px]">
            {r.pflicht ? "Intelligentes Messsystem ist Pflicht" : "Moderne Messeinrichtung genügt"}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/75">
            {r.pflicht
              ? `Grund: ${r.gruende.join(", ")}. Ihr Messstellenbetreiber baut das Smart Meter nach seinem Rollout-Plan ein – ablehnen können Sie es nicht.`
              : "Sie sind nicht zum Smart Meter verpflichtet. Auf Wunsch haben Sie aber ein Recht auf den Einbau – etwa für einen dynamischen Stromtarif."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="ov-glass rounded-2xl p-4">
              <p className="text-[12.5px] text-white/60">Preisobergrenze für Sie</p>
              <p className="ov-num mt-1 font-display text-[30px] font-extrabold leading-none">
                {r.preis} €<span className="text-[15px] font-semibold text-white/60"> / Jahr</span>
              </p>
            </div>
            <div className="ov-glass rounded-2xl p-4 text-[13.5px] leading-snug text-white/80">
              {r.pflicht ? (
                r.steuerbox ? (
                  <p className="flex gap-2"><Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" />Zzgl. Steuerungseinrichtung: bis 50 € im Jahr.</p>
                ) : (
                  <p className="flex gap-2"><BadgeCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />Keine Steuerbox erforderlich.</p>
                )
              ) : (
                <p className="flex gap-2"><Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" />Smart Meter freiwillig: 30 € im Jahr, einmalig bis 100 € für den Einbau.</p>
              )}
            </div>
          </div>
          <p className="mt-5 text-[12px] leading-snug text-white/50">Anteil des Anschlussnutzers laut § 30 MsbG, brutto, Stand 2026. Orientierung, keine Rechtsberatung.</p>
        </div>
      </div>
    </div>
  );
}
