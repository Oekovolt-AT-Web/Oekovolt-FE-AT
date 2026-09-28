"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Droplet, Flame, Leaf, SlidersHorizontal, Sun, Thermometer } from "lucide-react";
import { WAERMEPUMPE } from "@/lib/rechner/annahmen";
import { VERGUETUNG } from "@/data/einspeiseverguetung";

/**
 * Heizkostenvergleich Öl / Gas / Wärmepumpe / Wärmepumpe + PV.
 * Reine Energiekosten pro Jahr – Orientierung mit offen gelegten und
 * anpassbaren Annahmen (Stand 09/2026, Österreich). Kein Angebot, keine Prognose.
 * Alle Preise und Faktoren kommen aus den zentralen Rechner-Annahmen
 * (src/lib/rechner/annahmen.js, Quellen dort: E-Control Gaspreismonitor,
 * EU Weekly Oil Bulletin, BMIMI Marktentwicklung 2024) und dem OeMAG-Rechensatz
 * (src/data/einspeiseverguetung.js) – nicht hier abtippen.
 */

const W = WAERMEPUMPE;
const WP_ANNAHMEN = {
  gasCtKwh: W.heizungen.gas.preisStandard, // Erdgas Haushalt, Gesamtpreis brutto
  oelEurLiter: W.heizungen.oel.preisStandard / 100, // €/Liter Heizöl
  wpStromCtKwh: W.wpTarifCt, // vermeidbarer Haushalts-Arbeitspreis brutto
  marktpreisCtKwh: VERGUETUNG.saetze[0].teileinspeisung, // Erlös für eingespeisten Überschuss
  wirkungsgradGas: W.heizungen.gas.nutzungsgrad,
  wirkungsgradOel: W.heizungen.oel.nutzungsgrad,
  kwhProLiterOel: W.heizungen.oel.kwhJeLiter,
  co2Gas: W.heizungen.gas.co2, // kg CO₂ je kWh Brennstoff
  co2Oel: W.heizungen.oel.co2,
  co2Strommix: W.co2Strom, // kg CO₂ je kWh Wärmepumpenstrom (heizgradtag-gewichtet, AT 2024)
};

const BEDARF_PRESETS = [
  { label: "Neubau", wert: 10000 },
  { label: "Teilsaniert", wert: 18000 },
  { label: "Unsaniert", wert: 28000 },
];

const JAZ_OPTIONEN = [
  { wert: 2.8, label: "2,8", hinweis: "Altbau, Heizkörper" },
  { wert: 3.3, label: "3,3", hinweis: "teilsaniert" },
  { wert: 3.8, label: "3,8", hinweis: "Fußboden­heizung" },
];

const eur = (n) => `${(Math.round(n / 10) * 10).toLocaleString("de-DE")} €`;
const zahl = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

export default function Heizkostenvergleich() {
  const id = useId();
  const [bedarf, setBedarf] = useState(18000);
  const [jaz, setJaz] = useState(3.3);
  const [pvAnteil, setPvAnteil] = useState(25);
  const [gas, setGas] = useState(WP_ANNAHMEN.gasCtKwh);
  const [oel, setOel] = useState(WP_ANNAHMEN.oelEurLiter);
  const [strom, setStrom] = useState(WP_ANNAHMEN.wpStromCtKwh);
  const einspeisung = WP_ANNAHMEN.marktpreisCtKwh;

  const r = useMemo(() => {
    const a = WP_ANNAHMEN;
    const gasKwh = bedarf / a.wirkungsgradGas;
    const oelKwh = bedarf / a.wirkungsgradOel;
    const wpStrom = bedarf / jaz;
    const pvKwh = wpStrom * (pvAnteil / 100);
    const netzKwh = wpStrom - pvKwh;
    const zeilen = [
      { k: "oel", label: "Ölheizung", icon: Droplet, kosten: (oelKwh / a.kwhProLiterOel) * oel, co2: oelKwh * a.co2Oel, detail: `${zahl(oelKwh / a.kwhProLiterOel)} Liter Heizöl`, farbe: "bg-ink-400" },
      { k: "gas", label: "Gasheizung", icon: Flame, kosten: (gasKwh * gas) / 100, co2: gasKwh * a.co2Gas, detail: `${zahl(gasKwh)} kWh Gas`, farbe: "bg-navy-300" },
      { k: "wp", label: "Wärmepumpe", icon: Thermometer, kosten: (wpStrom * strom) / 100, co2: wpStrom * a.co2Strommix, detail: `${zahl(wpStrom)} kWh Strom`, farbe: "bg-ov-400" },
      // Eigener PV-Strom „kostet“ den entgangenen Erlös aus der Einspeisung
      { k: "wppv", label: "Wärmepumpe + PV", icon: Sun, kosten: (netzKwh * strom + pvKwh * einspeisung) / 100, co2: netzKwh * a.co2Strommix, detail: `${zahl(pvKwh)} kWh vom eigenen Dach`, farbe: "bg-ov-600", hervor: true },
    ];
    return { zeilen, max: Math.max(...zeilen.map((z) => z.kosten)), wpStrom };
  }, [bedarf, jaz, pvAnteil, gas, oel, strom, einspeisung]);

  const [oelZ, gasZ, , wppvZ] = r.zeilen;
  const sparGas = gasZ.kosten - wppvZ.kosten;
  const sparOel = oelZ.kosten - wppvZ.kosten;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr]">
        {/* Eingaben */}
        <div className="border-b border-ink-100 bg-sand-50/60 p-6 md:p-8 lg:border-b-0 lg:border-r">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Interaktiv · Ihr Haus</p>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${id}-bedarf`} className="text-[15px] font-semibold text-ink-900">Wärmebedarf pro Jahr</label>
              <p className="ov-num font-display text-[20px] font-extrabold text-ink-900">{zahl(bedarf)} <span className="text-[14px] font-semibold text-ink-500">kWh</span></p>
            </div>
            <input
              id={`${id}-bedarf`}
              type="range"
              min={6000}
              max={40000}
              step={1000}
              value={bedarf}
              onChange={(e) => setBedarf(Number(e.target.value))}
              aria-valuetext={`${bedarf} Kilowattstunden Wärme pro Jahr`}
              className="mt-2 h-11 w-full cursor-pointer accent-ov-500"
            />
            <div className="mt-1 flex flex-wrap gap-2" role="group" aria-label="Typische Gebäude">
              {BEDARF_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setBedarf(p.wert)}
                  aria-pressed={bedarf === p.wert}
                  className={`h-11 rounded-full px-4 text-[13.5px] font-semibold transition-all ${bedarf === p.wert ? "bg-ink-900 text-white" : "bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ov-300"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-500">Tipp: bisheriger Gasverbrauch in kWh × 0,88 oder Liter Heizöl × 8,5.</p>
          </div>

          <div className="mt-7">
            <p id={`${id}-jaz`} className="text-[15px] font-semibold text-ink-900">Jahresarbeitszahl (JAZ)</p>
            <div role="group" aria-labelledby={`${id}-jaz`} className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-ink-100 p-1">
              {JAZ_OPTIONEN.map((o) => (
                <button
                  key={o.wert}
                  type="button"
                  aria-pressed={jaz === o.wert}
                  onClick={() => setJaz(o.wert)}
                  className={`flex min-h-14 flex-col items-center justify-center rounded-xl px-1 py-1.5 transition-all duration-300 ${jaz === o.wert ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"}`}
                >
                  <span className="ov-num text-[15px] font-bold">{o.label}</span>
                  <span className="max-w-full break-words text-[11.5px] leading-tight">{o.hinweis}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${id}-pv`} className="text-[15px] font-semibold text-ink-900">Anteil Solarstrom an der Wärmepumpe</label>
              <p className="ov-num shrink-0 whitespace-nowrap font-display text-[20px] font-extrabold text-ink-900">{pvAnteil} %</p>
            </div>
            <input
              id={`${id}-pv`}
              type="range"
              min={0}
              max={45}
              step={5}
              value={pvAnteil}
              onChange={(e) => setPvAnteil(Number(e.target.value))}
              aria-valuetext={`${pvAnteil} Prozent`}
              className="mt-2 h-11 w-full cursor-pointer accent-ov-500"
            />
            <p className="text-[13px] leading-relaxed text-ink-500">Realistisch sind rund 20–35 % – im Winter liefert das Dach wenig, in der Übergangszeit und beim Warmwasser viel.</p>
          </div>

          <details className="group mt-7 rounded-2xl bg-white ring-1 ring-ink-200/70">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[14px] font-semibold text-ink-800 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-ov-600" />
                Energiepreise anpassen
              </span>
              <span aria-hidden="true" className="text-ink-400 transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="grid gap-3 border-t border-ink-100 p-4">
              <PreisFeld id={`${id}-gas`} label="Gaspreis" einheit="ct/kWh" wert={gas} setWert={setGas} schritt={0.5} />
              <PreisFeld id={`${id}-oel`} label="Heizölpreis" einheit="€/Liter" wert={oel} setWert={setOel} schritt={0.05} />
              <PreisFeld id={`${id}-strom`} label="Wärmepumpenstrom" einheit="ct/kWh" wert={strom} setWert={setStrom} schritt={0.5} />
            </div>
          </details>
        </div>

        {/* Ergebnis */}
        <div className="flex flex-col p-6 md:p-8">
          <h3 className="ov-h3 text-ink-900">Heizkosten pro Jahr im Vergleich</h3>
          <p className="mt-1 text-[14px] text-ink-500">Reine Energiekosten für {zahl(bedarf)} kWh Wärme</p>

          <ul className="mt-7 space-y-5" aria-live="polite">
            {r.zeilen.map((z) => {
              const Icon = z.icon;
              return (
                <li key={z.k}>
                  <div className="flex items-end justify-between gap-3">
                    <p className={`flex items-center gap-2 text-[15px] font-semibold ${z.hervor ? "text-ov-700" : "text-ink-800"}`}>
                      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {z.label}
                    </p>
                    <p className={`ov-num font-display font-extrabold tracking-tight ${z.hervor ? "text-[24px] text-ov-700" : "text-[20px] text-ink-900"}`}>{eur(z.kosten)}</p>
                  </div>
                  <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div className={`h-full rounded-full ${z.farbe}`} style={{ width: `${Math.max((z.kosten / r.max) * 100, 2)}%`, transition: "width 550ms cubic-bezier(.22,1,.36,1)" }} />
                  </div>
                  <p className="mt-1.5 flex flex-wrap justify-between gap-x-4 text-[12.5px] text-ink-500">
                    <span>{z.detail}</span>
                    <span className="ov-num">≈ {zahl(z.co2 / 1000, 1)} t CO₂/Jahr</span>
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-ov-50 p-5 ring-1 ring-ov-100">
              <p className="text-[13px] text-ov-800">Ersparnis ggü. Gasheizung</p>
              <p className="ov-num mt-1 font-display text-[26px] font-extrabold tracking-tight text-ov-700">{sparGas > 0 ? eur(sparGas) : "–"}<span className="text-[14px] font-semibold"> /Jahr</span></p>
            </div>
            <div className="rounded-2xl bg-navy-950 p-5 text-white">
              <p className="text-[13px] text-white/65">Ersparnis ggü. Ölheizung</p>
              <p className="ov-num mt-1 font-display text-[26px] font-extrabold tracking-tight">{sparOel > 0 ? eur(sparOel) : "–"}<span className="text-[14px] font-semibold text-white/70"> /Jahr</span></p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-[14px] text-ink-600">
              <Leaf aria-hidden="true" className="h-4 w-4 text-ov-600" />
              Genauer mit Förderung & Investition
            </p>
            <Link href="/rechner/waermepumpe" className="group inline-flex h-11 items-center gap-2 self-start rounded-full bg-ink-900 px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-ink-800 sm:self-auto">
              Zum Wärmepumpen-Rechner
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
      <p className="border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        Orientierung, kein Angebot. Annahmen Stand 09/2026: Nutzungsgrad Gaskessel {zahl(WP_ANNAHMEN.wirkungsgradGas * 100)} %, Ölkessel {zahl(WP_ANNAHMEN.wirkungsgradOel * 100)} %; {zahl(WP_ANNAHMEN.kwhProLiterOel)} kWh je Liter Heizöl; selbst genutzter Solarstrom
        wird mit dem entgangenen Erlös aus der Einspeisung (Richtwert {zahl(einspeisung)} ct/kWh Marktpreis) bewertet. Ohne Grundgebühren, Wartung, Rauchfangkehrer und
        künftige Preisänderungen (z. B. CO₂-Bepreisung). Preise: Richtwerte Österreich (E-Control, EU Oil Bulletin); CO₂ Wärmepumpenstrom ca. {zahl(WP_ANNAHMEN.co2Strommix * 1000)} g/kWh (Stromaufbringung AT 2024, heizgradtag-gewichtet).
      </p>
    </div>
  );
}

function PreisFeld({ id, label, einheit, wert, setWert, schritt }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-[14px] text-ink-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={schritt}
          value={wert}
          onChange={(e) => setWert(Math.max(0, Number(e.target.value) || 0))}
          className="ov-num h-11 w-24 rounded-xl border border-ink-200 bg-white px-3 text-right text-[15px] font-semibold text-ink-900 focus:border-ov-500 focus:outline-none"
        />
        <span className="w-14 text-[13px] text-ink-500">{einheit}</span>
      </div>
    </div>
  );
}
