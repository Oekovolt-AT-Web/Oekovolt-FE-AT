"use client";

import { useState } from "react";
import { Building2, Sun, UtilityPole } from "lucide-react";

/**
 * Umschalter gemeinschaftliche Erzeugungsanlage (GEA) ↔ Erneuerbare-Energie-
 * Gemeinschaft (EEG, lokal) nach österreichischem Recht. Oben ein stilisiertes
 * Haus: Solaranteil je Einheit, darunter die Unterschiede als Tabelle.
 *
 * Rechtsstand 09/2026: § 16a ElWOG 2010 (GEA) bzw. § 79 EAG (EEG); ab
 * 1.10.2026 ElWG (BGBl. I Nr. 91/2025) – GEA: § 6 Abs. 1 Z 58 und § 70 Abs. 6.
 * Quellen: energiegemeinschaften.gv.at (Klima- und Energiefonds), E-Control.
 */

const MODELLE = {
  gea: {
    tab: "GEA",
    titel: "Gemeinschaftliche Erzeugungsanlage",
    recht: "§ 16a ElWOG · ab 1.10.2026 ElWG",
    kurz: "Die PV-Anlage am Gebäude versorgt die teilnehmenden Einheiten über die gemeinsame Hauptleitung – ohne das öffentliche Netz.",
    zeilen: {
      netz: "Kein öffentliches Netz – Verteilung hinter dem Hausanschluss",
      reststrom: "Jede Einheit über ihren eigenen Stromliefervertrag",
      organisation: "Betreiber plus Errichtungs- und Betriebsvertrag mit den Teilnehmern",
      entgelte: "Keine Netzentgelte und keine Elektrizitätsabgabe für den intern verteilten Solarstrom",
      messung: "Smart Meter mit Viertelstundenwerten je Teilnehmer",
      fuer: "Mehrparteienhaus, Wohnanlage, Gewerbepark an einem Anschluss",
    },
  },
  eeg: {
    tab: "Energiegemeinschaft",
    titel: "Erneuerbare-Energie-Gemeinschaft (lokal)",
    recht: "§ 79 EAG · ab 1.10.2026 ElWG",
    kurz: "Erzeugung und Verbrauch liegen an verschiedenen Anschlüssen in der Nähe – der Strom wird über das lokale Netz geteilt.",
    zeilen: {
      netz: "Öffentliches Netz im Nahbereich (lokal bzw. regional)",
      reststrom: "Jedes Mitglied über seinen eigenen Stromliefervertrag",
      organisation: "Eigene Rechtsperson, z. B. Verein oder Genossenschaft",
      entgelte: "Reduzierte Netzentgelte laut Systemnutzungsentgelte-Verordnung",
      messung: "Smart Meter mit Viertelstundenwerten je Mitglied",
      fuer: "Nachbarschaft, Gemeinde, Betriebe mit mehreren Standorten in der Nähe",
    },
  },
};

const LABELS = [
  ["netz", "Weg des Solarstroms"],
  ["reststrom", "Wer liefert den Reststrom?"],
  ["organisation", "Organisation"],
  ["entgelte", "Netzentgelte & Abgaben"],
  ["messung", "Messung"],
  ["fuer", "Passt besonders für"],
];

// Solaranteil je Einheit (Beispiel) und Farbe des jeweils eigenen Stromlieferanten
const EINHEITEN = [38, 31, 44, 27, 35, 40];
const ANBIETER = ["bg-navy-400", "bg-sun-400", "bg-ink-400", "bg-navy-600", "bg-sun-500", "bg-ink-500"];

export default function ModellVergleich() {
  const [m, setM] = useState("gea");
  const modell = MODELLE[m];

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-5 border-b border-ink-100 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Interaktiv · Modellvergleich</p>
          <p className="mt-2 font-display text-[20px] font-bold text-ink-900 md:text-[22px]">Solarstrom im Gebäude oder in der Nachbarschaft teilen</p>
        </div>
        <div role="group" aria-label="Modell" className="grid grid-cols-2 rounded-full bg-ink-100 p-1">
          {Object.entries(MODELLE).map(([k, v]) => (
            <button
              key={k}
              type="button"
              aria-pressed={m === k}
              onClick={() => setM(k)}
              className={`h-11 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-all duration-300 md:px-5 ${
                m === k ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"
              }`}
            >
              {v.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Haus-Grafik */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="mx-auto max-w-sm" aria-hidden="true">
            <div className="relative mx-auto flex h-16 items-end justify-center">
              <div className="absolute -top-2 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-sun-300/60">
                <Sun className="h-6 w-6 text-sun-500" />
              </div>
              <div className="grid w-[88%] grid-cols-6 gap-1 rounded-t-xl bg-navy-900 p-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="h-3 rounded-[3px] bg-navy-500" />
                ))}
              </div>
            </div>
            <div className="rounded-b-2xl bg-white p-3 shadow-lg ring-1 ring-ink-200">
              <div className="grid grid-cols-2 gap-2.5">
                {EINHEITEN.map((anteil, i) => (
                  <div key={i} className="rounded-xl bg-ink-50 p-2.5 ring-1 ring-ink-100">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-ink-500">
                      <span>Top {i + 1}</span>
                      <span className="ov-num text-ov-700">{anteil} % Sonne</span>
                    </div>
                    <div className="mt-2 flex h-2.5 overflow-hidden rounded-full">
                      <span className="bg-ov-500" style={{ width: `${anteil}%` }} />
                      <span className={`flex-1 ${ANBIETER[i]}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-navy-950 px-3 py-2 text-[11.5px] text-white/80">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-ov-300" />
                  {m === "gea" ? "Hauptleitung im Gebäude" : "Eigener Anschluss je Mitglied"}
                </span>
                <span className="flex items-center gap-1.5">
                  <UtilityPole className="h-3.5 w-3.5 text-navy-200" />
                  {m === "gea" ? "Netz nur für Rest" : "Lokales Netz"}
                </span>
              </div>
            </div>
          </div>

          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-[13px] text-ink-600">
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-[3px] bg-ov-500" />
              {m === "gea" ? "Solarstrom vom eigenen Dach" : "Solarstrom aus der Gemeinschaft"}
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-3 w-9 overflow-hidden rounded-[3px]">
                <span className="flex-1 bg-navy-400" />
                <span className="flex-1 bg-sun-400" />
                <span className="flex-1 bg-ink-400" />
              </span>
              Reststrom vom jeweils eigenen Lieferanten
            </li>
          </ul>
        </div>

        {/* Unterschiede */}
        <div key={m} className="ov-tab-panel p-6 md:p-8">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">{modell.recht}</p>
          <h3 className="ov-h3 mt-2 text-ink-900">{modell.titel}</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-600">{modell.kurz}</p>
          <dl className="mt-6 divide-y divide-ink-100 rounded-2xl ring-1 ring-ink-200/70">
            {LABELS.map(([k, l]) => (
              <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[0.8fr_1.2fr] sm:gap-4">
                <dt className="text-[13.5px] text-ink-500">{l}</dt>
                <dd className="text-[14.5px] font-semibold leading-snug text-ink-900">{modell.zeilen[k]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        Vereinfachte Darstellung, Stand September 2026. Ab 1. Oktober 2026 gelten die Bestimmungen des ElWG zur gemeinsamen Energienutzung; die Umsetzung bei den Netzbetreibern kann sich bis ins Frühjahr 2027 ziehen. Welches Modell für Ihr Objekt passt, prüfen wir im Einzelfall.
      </p>
    </div>
  );
}
