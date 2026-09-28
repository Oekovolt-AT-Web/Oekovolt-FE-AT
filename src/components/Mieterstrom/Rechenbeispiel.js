"use client";

import { useState } from "react";
import { Building2, Users } from "lucide-react";
import Regler from "@/components/Wallbox/Regler";
import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG } from "@/data/einspeiseverguetung";

/**
 * Rechenbeispiel gemeinschaftliche Erzeugungsanlage (GEA): Wie viel Solarstrom
 * wird im Gebäude verteilt – und was bedeutet das für Betreiber und Teilnehmer?
 * Bewusst einfach und mit offengelegten Annahmen (Richtwerte, kein Angebot).
 *
 * Annahmen:
 *  - 2.500 kWh Jahresverbrauch je Einheit (typischer Haushalt im
 *    Mehrparteienhaus; Gewerbeeinheiten weichen stark ab).
 *  - Marktpreis für eingespeisten Überschuss als einstellbarer Richtwert –
 *    der OeMAG-Marktpreis bzw. Händlerpreise schwanken monatlich.
 *  - Strompreis aus dem Netz = Gesamtpreis je kWh (Energie, Netzentgelte,
 *    Abgaben, USt). Den intern verteilten GEA-Strom ersetzt er vollständig,
 *    weil dafür keine Netzentgelte und keine Elektrizitätsabgabe anfallen.
 */

const VERBRAUCH_JE_EINHEIT = 2500; // kWh/Jahr
// Zentrale Werte (nicht abtippen): OeMAG-Rechensatz und vermeidbarer Haushaltsstrompreis
const MARKTPREIS_CT = VERGUETUNG.saetze[0].teileinspeisung; // ct/kWh
const NETZ_CT_START = Math.round(ANNAHMEN.strompreis * 100); // ct/kWh brutto

const eur = (n) => `${Math.round(n).toLocaleString("de-DE")} €`;

export default function Rechenbeispiel() {
  const [einheiten, setEinheiten] = useState(8);
  const [quote, setQuote] = useState(35);
  const [preis, setPreis] = useState(15);
  const [netz, setNetz] = useState(NETZ_CT_START);

  const kwh = einheiten * VERBRAUCH_JE_EINHEIT * (quote / 100);
  const erloes = (kwh * preis) / 100;
  const nurEinspeisen = (kwh * MARKTPREIS_CT) / 100;
  const ersparnisJeEinheit = (VERBRAUCH_JE_EINHEIT * (quote / 100) * (netz - preis)) / 100;

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4 border-b border-ink-100 p-6 md:p-8 lg:border-b-0 lg:border-r">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Rechenbeispiel Mehrparteienhaus</p>
        <Regler
          id="rb-einheiten"
          label="Teilnehmende Einheiten"
          wert={einheiten}
          min={3}
          max={40}
          step={1}
          onChange={setEinheiten}
          anzeige={`${einheiten} Tops`}
          hinweis={`≈ ${(einheiten * VERBRAUCH_JE_EINHEIT).toLocaleString("de-DE")} kWh Gesamtverbrauch im Jahr`}
        />
        <Regler
          id="rb-quote"
          label="Anteil Solarstrom am Verbrauch"
          wert={quote}
          min={20}
          max={50}
          step={5}
          onChange={setQuote}
          anzeige={`${quote} %`}
          hinweis="Ohne Speicher meist 25–40 %, abhängig von Dachgröße und Verbrauchsprofil."
        />
        <Regler
          id="rb-preis"
          label="Preis für den GEA-Strom"
          wert={preis}
          min={8}
          max={24}
          step={1}
          onChange={setPreis}
          anzeige={`${preis} ct/kWh`}
          hinweis="Frei im Errichtungs- und Betriebsvertrag vereinbar."
        />
        <Regler
          id="rb-netz"
          label="Strompreis aus dem Netz (gesamt)"
          wert={netz}
          min={18}
          max={40}
          step={1}
          onChange={setNetz}
          anzeige={`${netz} ct/kWh`}
          hinweis="Energie, Netzentgelte, Abgaben und USt – laut Ihrer Stromrechnung."
        />
      </div>

      <div className="flex flex-col p-6 md:p-8">
        <p className="text-[13px] text-ink-500">Solarstrom, der im Gebäude verteilt wird</p>
        <p className="ov-num font-display text-[34px] font-extrabold leading-tight tracking-tight text-ink-900">
          {Math.round(kwh).toLocaleString("de-DE")} kWh<span className="text-[16px] font-semibold text-ink-500"> / Jahr</span>
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-navy-950 p-5 text-white">
            <p className="flex items-center gap-2 text-[12.5px] text-white/60">
              <Building2 aria-hidden="true" className="h-4 w-4 text-ov-300" />
              Einnahmen Betreiber
            </p>
            <p className="ov-num mt-1 font-display text-[28px] font-extrabold">{eur(erloes)}</p>
            <p className="text-[12.5px] text-white/55">pro Jahr</p>
          </div>
          <div className="rounded-2xl bg-ov-600 p-5 text-white">
            <p className="flex items-center gap-2 text-[12.5px] text-white/75">
              <Users aria-hidden="true" className="h-4 w-4" />
              Ersparnis je Einheit
            </p>
            <p className="ov-num mt-1 font-display text-[28px] font-extrabold">{eur(Math.max(ersparnisJeEinheit, 0))}</p>
            <p className="text-[12.5px] text-white/70">pro Jahr</p>
          </div>
        </div>

        <dl className="mt-5 space-y-3 text-[14.5px]">
          <div className="flex items-baseline justify-between gap-3 border-b border-ink-100 pb-3">
            <dt className="text-ink-600">Dieselbe Menge nur eingespeist (Richtwert {MARKTPREIS_CT.toLocaleString("de-DE")} ct)</dt>
            <dd className="ov-num shrink-0 whitespace-nowrap text-right font-semibold text-ink-500">{eur(nurEinspeisen)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-ink-600">Mehrerlös durch Verteilung im Haus</dt>
            <dd className="ov-num shrink-0 whitespace-nowrap text-right font-display text-[20px] font-extrabold text-ov-700">{eur(Math.max(erloes - nurEinspeisen, 0))}</dd>
          </div>
        </dl>

        <p className="mt-auto pt-6 text-[12px] leading-snug text-ink-500">
          Orientierung, kein Angebot: {VERBRAUCH_JE_EINHEIT.toLocaleString("de-DE")} kWh je Einheit, Marktpreis für Überschuss als Richtwert. Einnahmen vor Kosten für Anlage, Messung, Abrechnung und
          Versicherung. Stand September 2026.
        </p>
      </div>
    </div>
  );
}
