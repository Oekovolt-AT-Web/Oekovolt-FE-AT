"use client";

// src/components/Forderungen/Steuerlich/ElektrizitaetsabgabeRechner.js
//
// Mini-Rechner: Was spart die Befreiung von der Elektrizitätsabgabe für selbst
// erzeugten und verbrauchten PV-Strom (§ 2 Abs. 1 Z 4 ElAbgG)? Sätze: 2026
// befristet 0,82 ct/kWh (Betriebe) bzw. 0,1 ct/kWh (Haushalte nach § 4 Abs. 1
// SKZG), laut geltendem Recht ab 2027 wieder 1,5 ct/kWh (BGBl. I Nr. 95/2025).
// Keine Steuerberatung – Richtwert zur Orientierung.

import { useId, useState } from "react";
import { cn } from "@/components/ui/cn";
import { ELABG_SAETZE, ELABG_SATZ_2027, ersparnis } from "./elabg";

// Geschütztes Leerzeichen, damit "€" mobil nicht in eine eigene Zeile bricht.
const eur = (v) => `${Math.round(v).toLocaleString("de-AT")} €`;

const VORGABEN = [
  { id: "gewerbe", label: "Gewerbebetrieb", kwh: 60000 },
  { id: "industrie", label: "Industrie", kwh: 400000 },
  { id: "landwirtschaft", label: "Landwirtschaft", kwh: 25000 },
  { id: "haushalt", label: "Haushalt", kwh: 3500 },
];

export default function ElektrizitaetsabgabeRechner({ className }) {
  const [kwh, setKwh] = useState(60000);
  const [art, setArt] = useState("betrieb");
  const id = useId();

  const satz2026 = art === "haushalt" ? ELABG_SAETZE.haushalt2026 : ELABG_SAETZE.betrieb2026;
  const e2026 = ersparnis(kwh, satz2026);
  const e2027 = ersparnis(kwh, ELABG_SAETZE.regulaer);
  const e20 = e2027 * 20;

  return (
    <div className={cn("grid gap-6 rounded-[2rem] bg-white p-6 ring-1 ring-ink-200/70 md:grid-cols-[1fr_1.1fr] md:p-8", className)}>
      <div>
        <label htmlFor={`${id}-kwh`} className="block text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">
          Eigenverbrauch aus der PV-Anlage je Jahr
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            id={`${id}-kwh`}
            type="number"
            inputMode="numeric"
            min={0}
            step={500}
            value={kwh}
            onChange={(e) => setKwh(Math.max(0, Number(e.target.value) || 0))}
            className="ov-num min-h-11 w-full rounded-full bg-sand-50 px-5 py-2.5 text-[16px] font-semibold text-ink-900 ring-1 ring-ink-200/70 focus:outline-none focus:ring-2 focus:ring-ov-500"
          />
          <span className="shrink-0 text-[14.5px] text-ink-600">kWh</span>
        </div>
        <input type="range" min={0} max={1_000_000} step={1000} value={Math.min(kwh, 1_000_000)} onChange={(e) => setKwh(Number(e.target.value))} aria-label="Eigenverbrauch in kWh" className="mt-3 w-full accent-ov-600" />
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Beispielwerte">
          {VORGABEN.map((v) => (
            <li key={v.id}>
              <button type="button" onClick={() => { setKwh(v.kwh); setArt(v.id === "haushalt" ? "haushalt" : "betrieb"); }} className="min-h-11 rounded-full bg-sand-50 px-3.5 py-2 text-[13px] font-semibold text-ink-700 ring-1 ring-ink-200/70 hover:bg-ov-50 hover:text-ov-800">
                {v.label} · {v.kwh.toLocaleString("de-AT")} kWh
              </button>
            </li>
          ))}
        </ul>

        <fieldset className="mt-5">
          <legend className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Abnehmer 2026</legend>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup">
            {[
              ["betrieb", `Betrieb (0,82 ct/kWh)`],
              ["haushalt", `Haushalt (0,1 ct/kWh)`],
            ].map(([k, label]) => (
              <button key={k} type="button" role="radio" aria-checked={art === k} onClick={() => setArt(k)} className={cn("min-h-11 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors", art === k ? "bg-navy-950 text-white" : "bg-sand-50 text-ink-700 ring-1 ring-ink-200/70 hover:bg-ov-50")}>
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="rounded-3xl bg-navy-950 p-6 text-white">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white/60">Ersparte Elektrizitätsabgabe durch die Befreiung</p>
        <dl className="mt-5 space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="min-w-0 text-[14.5px] text-white/75">2026 (befristete Senkung, {satz2026.toLocaleString("de-AT")} ct/kWh)</dt>
            <dd className="ov-num shrink-0 whitespace-nowrap font-display text-[24px] font-extrabold">{eur(e2026)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-4">
            <dt className="min-w-0 text-[14.5px] text-white/75">ab 2027 je Jahr (1,5 ct/kWh)</dt>
            <dd className="ov-num shrink-0 whitespace-nowrap font-display text-[28px] font-extrabold text-ov-300">{eur(e2027)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-4">
            <dt className="min-w-0 text-[14.5px] text-white/75">über 20 Jahre Nutzungsdauer (1,5 ct/kWh, ohne Indexierung)</dt>
            <dd className="ov-num shrink-0 whitespace-nowrap font-display text-[20px] font-bold">{eur(e20)}</dd>
          </div>
        </dl>
        <p className="mt-5 text-[13px] leading-relaxed text-white/70">
          {ELABG_SATZ_2027}. Voraussetzung: Anzeige beim Finanzamt und Aufzeichnung von Erzeugung und Eigenverbrauch. Richtwert zur Orientierung, keine Steuerberatung.
        </p>
      </div>
    </div>
  );
}
