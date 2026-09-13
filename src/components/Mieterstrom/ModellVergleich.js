"use client";

import { useState } from "react";
import { Building2, Sun, UtilityPole } from "lucide-react";

/**
 * Umschalter Mieterstrom (§ 42a EnWG) ↔ gemeinschaftliche Gebäudeversorgung
 * (§ 42b EnWG). Oben ein stilisiertes Haus: Solaranteil je Wohnung und wer den
 * Reststrom liefert. Darunter die Unterschiede als Tabelle. Stand 2026.
 */

const MODELLE = {
  mieterstrom: {
    tab: "Mieterstrom",
    recht: "§ 42a EnWG · § 21 EEG",
    kurz: "Ein Anbieter liefert alles: Solarstrom vom Dach plus Reststrom aus dem Netz.",
    zeilen: {
      reststrom: "Der Mieterstromanbieter (Vollversorgung)",
      pflichten: "Volle Lieferantenpflichten (Rechnung, Kennzeichnung, Reststrom)",
      foerderung: "Mieterstromzuschlag, derzeit bis 2,51 ct/kWh",
      preis: "Höchstens 90 % des örtlichen Grundversorgungstarifs",
      messung: "Messkonzept mit Summenzähler",
      fuer: "Größere Objekte, professionelle Verwaltung, Dienstleister-Modell",
    },
  },
  ggv: {
    tab: "Gebäudeversorgung",
    recht: "§ 42b EnWG",
    kurz: "Der Solarstrom wird nach Schlüssel verteilt – den Rest liefert jeder eigene Stromanbieter.",
    zeilen: {
      reststrom: "Jeder Haushalt über seinen eigenen Stromvertrag",
      pflichten: "Keine Vollversorgung – deutlich weniger Bürokratie",
      foerderung: "Kein Mieterstromzuschlag",
      preis: "Frei vereinbar im Nutzungsvertrag",
      messung: "Viertelstündliche Messung je Teilnehmer (Smart Meter)",
      fuer: "Kleinere Mehrfamilienhäuser, WEG, Gewerbeobjekte",
    },
  },
};

const LABELS = [
  ["reststrom", "Wer liefert den Reststrom?"],
  ["pflichten", "Pflichten für Betreiber"],
  ["foerderung", "Förderung"],
  ["preis", "Preis für den Solarstrom"],
  ["messung", "Messung"],
  ["fuer", "Passt besonders für"],
];

// Solaranteil je Wohnung (Beispiel) und Farbe des jeweiligen Reststromanbieters bei GGV
const WOHNUNGEN = [38, 31, 44, 27, 35, 40];
const ANBIETER = ["bg-navy-400", "bg-sun-400", "bg-ink-400", "bg-navy-600", "bg-sun-500", "bg-ink-500"];

export default function ModellVergleich() {
  const [m, setM] = useState("ggv");
  const modell = MODELLE[m];

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-5 border-b border-ink-100 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Interaktiv · Modellvergleich</p>
          <p className="mt-2 font-display text-[20px] font-bold text-ink-900 md:text-[22px]">Zwei Wege, Solarstrom im Haus zu teilen</p>
        </div>
        <div role="radiogroup" aria-label="Modell" className="grid grid-cols-2 rounded-full bg-ink-100 p-1">
          {Object.entries(MODELLE).map(([k, v]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={m === k}
              onClick={() => setM(k)}
              className={`h-11 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-all duration-300 md:px-5 ${
                m === k ? "bg-white text-ink-900 shadow-md" : "text-ink-500 hover:text-ink-800"
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
            {/* Dach mit PV */}
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
                {WOHNUNGEN.map((anteil, i) => (
                  <div key={i} className="rounded-xl bg-ink-50 p-2.5 ring-1 ring-ink-100">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-ink-500">
                      <span>WE {i + 1}</span>
                      <span className="ov-num text-ov-700">{anteil} % Sonne</span>
                    </div>
                    <div className="mt-2 flex h-2.5 overflow-hidden rounded-full">
                      <span className="bg-ov-500" style={{ width: `${anteil}%` }} />
                      <span className={`flex-1 transition-colors duration-500 ${m === "ggv" ? ANBIETER[i] : "bg-navy-700"}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-navy-950 px-3 py-2 text-[11.5px] text-white/80">
                <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-ov-300" />Messkonzept</span>
                <span className="flex items-center gap-1.5"><UtilityPole className="h-3.5 w-3.5 text-navy-200" />Netz</span>
              </div>
            </div>
          </div>

          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-[13px] text-ink-600">
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-500" />Solarstrom vom eigenen Dach</li>
            {m === "ggv" ? (
              <li className="flex items-center gap-2">
                <span className="flex h-3 w-9 overflow-hidden rounded-[3px]">
                  <span className="flex-1 bg-navy-400" /><span className="flex-1 bg-sun-400" /><span className="flex-1 bg-ink-400" />
                </span>
                Reststrom vom jeweils eigenen Anbieter
              </li>
            ) : (
              <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-navy-700" />Reststrom vom Mieterstromanbieter</li>
            )}
          </ul>
        </div>

        {/* Unterschiede */}
        <div key={m} className="ov-tab-panel p-6 md:p-8">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">{modell.recht}</p>
          <h3 className="ov-h3 mt-2 text-ink-900">{m === "ggv" ? "Gemeinschaftliche Gebäudeversorgung" : "Klassischer Mieterstrom"}</h3>
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
        Vereinfachte Darstellung, Stand September 2026. Zuschlagssatz für Anlagen bis 10 kWp ab 1. August 2026 (bis 40 kWp: 2,33 ct, bis 1 MW: 1,57 ct). Welches Modell für Ihr Objekt passt, prüfen wir im Einzelfall.
      </p>
    </div>
  );
}
