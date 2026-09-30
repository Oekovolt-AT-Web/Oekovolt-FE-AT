"use client";

// Interaktiver Ertragsvergleich der Regionalseiten eines Bundeslands: Ausrichtung umschalten,
// Anlagengröße wählen – Balken je Ort mit simuliertem Jahresertrag (PVGIS-Werte aus dem Repo).
// Zahlen ohne Intl (zahl()), damit Server- und Browser-HTML identisch sind.

import { useId, useState } from "react";
import Link from "next/link";
import { cn } from "@/components/ui/cn";
import { AUSRICHTUNGEN, jahresertrag, zahl } from "@/lib/bundesland/auswertung";

const GROESSEN = [50, 100, 250, 500, 1000];

/**
 * orte:   [{ slug, name, werte: { sued35, ostwest15, flach10 } }]
 * mittel: { sued35, ostwest15, flach10 } – ungewichtetes Landesmittel
 * land:   Anzeigename („Oberösterreich“)
 */
export default function ErtragVergleich({ orte = [], mittel = {}, land }) {
  const [ausrichtung, setAusrichtung] = useState("sued35");
  const [kwp, setKwp] = useState(100);
  const id = useId();
  const a = AUSRICHTUNGEN.find((x) => x.id === ausrichtung) || AUSRICHTUNGEN[0];

  const liste = [...orte].sort((x, y) => (y.werte[ausrichtung] || 0) - (x.werte[ausrichtung] || 0));
  const werte = liste.map((o) => o.werte[ausrichtung]).filter(Number.isFinite);
  const max = Math.max(...werte, mittel[ausrichtung] || 0);
  const basis = Math.floor((Math.min(...werte, mittel[ausrichtung] || max) * 0.85) / 50) * 50;
  const anteil = (w) => Math.max(6, ((w - basis) / (max - basis || 1)) * 100);
  const mittelWert = mittel[ausrichtung];

  return (
    <div className="rounded-[2rem] bg-white p-5 text-ink-900 shadow-2xl ring-1 ring-ink-200/70 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <fieldset>
          <legend className="text-[13px] font-semibold text-ink-700">Ausrichtung und Neigung</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {AUSRICHTUNGEN.map((x) => {
              const aktiv = x.id === ausrichtung;
              return (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={aktiv}
                  onClick={() => setAusrichtung(x.id)}
                  className={cn(
                    "min-h-11 rounded-full px-4 text-[14px] font-semibold ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2",
                    aktiv ? "bg-navy-950 text-white ring-navy-950" : "bg-sand-50 text-ink-700 ring-ink-200 hover:bg-white"
                  )}
                >
                  {x.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div>
          <label htmlFor={`${id}-kwp`} className="block text-[13px] font-semibold text-ink-700">
            Anlagengröße
          </label>
          <select
            id={`${id}-kwp`}
            value={kwp}
            onChange={(e) => setKwp(Number(e.target.value))}
            className="mt-2 min-h-11 w-full rounded-xl border-0 bg-sand-50 px-3 text-[14px] font-semibold text-ink-900 ring-1 ring-ink-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 md:w-44"
          >
            {GROESSEN.map((g) => (
              <option key={g} value={g}>
                {zahl(g)} kWp
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-6 text-[14px] leading-relaxed text-ink-600" aria-live="polite">
        {a.label}: Im Mittel der {orte.length} {orte.length === 1 ? "Standortseite" : "Standortseiten"} {land ? `in ${land} ` : ""}erzeugt 1 kWp rund{" "}
        <strong className="ov-num text-ink-900">{zahl(mittelWert)} kWh</strong> im Jahr – eine Anlage mit {zahl(kwp)} kWp also etwa{" "}
        <strong className="ov-num text-ink-900">{zahl(jahresertrag(mittelWert, kwp))} kWh</strong>.
      </p>

      <ol className="mt-6 space-y-2.5">
        {liste.map((o) => {
          const w = o.werte[ausrichtung];
          return (
            <li key={o.slug}>
              <Link href={`/photovoltaik/${o.slug}`} className="group flex items-center gap-3 rounded-xl py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 md:gap-4">
                <span className="w-24 shrink-0 truncate text-[14.5px] font-semibold text-ink-900 group-hover:text-ov-700 sm:w-36">{o.name}</span>
                <span className="relative h-8 min-w-0 flex-1 overflow-hidden rounded-lg bg-ink-100/70">
                  <span
                    className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-navy-700 to-ov-500 transition-[width] duration-500 ease-out motion-reduce:transition-none"
                    style={{ width: `${anteil(w)}%` }}
                  />
                  {Number.isFinite(mittelWert) && (
                    <span aria-hidden="true" className="absolute inset-y-0 w-0.5 bg-sun-400" style={{ left: `${anteil(mittelWert)}%` }} />
                  )}
                </span>
                <span className="w-[7.5rem] shrink-0 text-right sm:w-40">
                  <span className="ov-num block text-[14px] font-bold text-ink-900">{zahl(w)} kWh/kWp</span>
                  <span className="ov-num block text-[12px] text-ink-500">{zahl(jahresertrag(w, kwp))} kWh/Jahr</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 flex items-center gap-2 text-[12.5px] text-ink-600">
        <span aria-hidden="true" className="inline-block h-3 w-0.5 bg-sun-400" />
        Landesmittel der Standortseiten ({a.kurz}). Balkenachse beginnt bei {zahl(basis)} kWh/kWp.
      </p>
    </div>
  );
}
