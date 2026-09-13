"use client";

import { useState } from "react";
import { Building2, Users } from "lucide-react";
import Regler from "@/components/Wallbox/Regler";
import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG } from "@/data/einspeiseverguetung";

/**
 * Rechenbeispiel für Vermieter: Wie viel Solarstrom lässt sich im Haus
 * verkaufen – und was bleibt für Eigentümer und Mieter übrig?
 * Bewusst einfach und mit offengelegten Annahmen.
 */

const VERBRAUCH_JE_WE = 2500; // kWh/Jahr, typischer Mehrpersonenhaushalt im MFH
const ZUSCHLAG_CT = 2.33; // Mieterstromzuschlag 10–40 kWp ab 01.08.2026
const EINSPEISUNG_CT = VERGUETUNG.saetze[1].teileinspeisung; // 10–40 kWp
const NETZ_CT = Math.round(ANNAHMEN.strompreis * 1000) / 10;

const eur = (n) => `${Math.round(n).toLocaleString("de-DE")} €`;

export default function Rechenbeispiel() {
  const [we, setWe] = useState(8);
  const [preis, setPreis] = useState(26);
  const [quote, setQuote] = useState(35);

  const kwh = we * VERBRAUCH_JE_WE * (quote / 100);
  const erloesGgv = (kwh * preis) / 100;
  const erloesMs = (kwh * (preis + ZUSCHLAG_CT)) / 100;
  const nurEinspeisen = (kwh * EINSPEISUNG_CT) / 100;
  const mieterJahr = ((VERBRAUCH_JE_WE * (quote / 100)) * (NETZ_CT - preis)) / 100;

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4 border-b border-ink-100 p-6 md:p-8 lg:border-b-0 lg:border-r">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Rechenbeispiel Mehrfamilienhaus</p>
        <Regler id="rb-we" label="Wohneinheiten" wert={we} min={3} max={20} step={1} onChange={setWe} anzeige={`${we} WE`} hinweis={`≈ ${(we * VERBRAUCH_JE_WE).toLocaleString("de-DE")} kWh Gesamtverbrauch im Jahr`} />
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
          label="Preis für den Solarstrom"
          wert={preis}
          min={18}
          max={32}
          step={1}
          onChange={setPreis}
          anzeige={`${preis} ct/kWh`}
          hinweis={`Zum Vergleich: Haushaltsstrom im Schnitt ca. ${NETZ_CT.toLocaleString("de-DE")} ct/kWh.`}
        />
      </div>

      <div className="flex flex-col p-6 md:p-8">
        <p className="text-[13px] text-ink-500">Solarstrom, den Ihre Mieter im Haus nutzen</p>
        <p className="ov-num font-display text-[34px] font-extrabold leading-tight tracking-tight text-ink-900">
          {Math.round(kwh).toLocaleString("de-DE")} kWh<span className="text-[16px] font-semibold text-ink-500"> / Jahr</span>
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-navy-950 p-5 text-white">
            <p className="flex items-center gap-2 text-[12.5px] text-white/60"><Building2 aria-hidden="true" className="h-4 w-4 text-ov-300" />Einnahmen Gebäudeversorgung</p>
            <p className="ov-num mt-1 font-display text-[28px] font-extrabold">{eur(erloesGgv)}</p>
            <p className="text-[12.5px] text-white/55">pro Jahr</p>
          </div>
          <div className="rounded-2xl bg-ov-600 p-5 text-white">
            <p className="flex items-center gap-2 text-[12.5px] text-white/75"><Building2 aria-hidden="true" className="h-4 w-4" />Mit Mieterstromzuschlag</p>
            <p className="ov-num mt-1 font-display text-[28px] font-extrabold">{eur(erloesMs)}</p>
            <p className="text-[12.5px] text-white/70">pro Jahr</p>
          </div>
        </div>

        <dl className="mt-5 space-y-3 text-[14.5px]">
          <div className="flex items-baseline justify-between gap-3 border-b border-ink-100 pb-3">
            <dt className="text-ink-600">Dieselbe Menge nur eingespeist ({EINSPEISUNG_CT.toLocaleString("de-DE")} ct)</dt>
            <dd className="ov-num shrink-0 whitespace-nowrap text-right font-semibold text-ink-500">{eur(nurEinspeisen)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="flex items-center gap-2 text-ink-600"><Users aria-hidden="true" className="h-4 w-4 text-ov-600" />Ersparnis je Mieterhaushalt</dt>
            <dd className="ov-num shrink-0 whitespace-nowrap text-right font-display text-[20px] font-extrabold text-ov-700">{eur(Math.max(mieterJahr, 0))}<span className="text-[14px] font-semibold text-ink-500"> / Jahr</span></dd>
          </div>
        </dl>

        <p className="mt-auto pt-6 text-[12px] leading-snug text-ink-500">
          Orientierung, kein Angebot: {VERBRAUCH_JE_WE.toLocaleString("de-DE")} kWh je Wohnung, Zuschlag {ZUSCHLAG_CT.toLocaleString("de-DE")} ct (10–40 kWp, ab 08/2026). Einnahmen vor Kosten
          für Anlage, Messung, Abrechnung und – beim Mieterstrom – Reststrombeschaffung. Stand 2026.
        </p>
      </div>
    </div>
  );
}
