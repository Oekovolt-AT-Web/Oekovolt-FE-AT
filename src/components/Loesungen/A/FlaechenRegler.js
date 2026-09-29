"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Cable, Home, Landmark, Leaf, Sun } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { fmtZahl } from "./diagramm";

// Annahmen (Richtwerte, auf der Seite offengelegt)
const HA_JE_MWP = 1.25; // Mitte aus „etwa 1 bis 1,5 Hektar je MW“
const ERTRAG = 1150; // kWh/kWp, Ost-Österreich, Südausrichtung (wie Beispielrechnung)
const HAUSHALT = 3500; // kWh/Jahr, Standardhaushalt E-Control-Preismonitor
const CO2 = 0.2582; // kg/kWh, Emissionskoeffizient substituierter Strom AT (Technikum Wien 2025)
const FUSSBALLFELD = 0.714; // ha (105 × 68 m)

const SCHWELLEN = [
  { ab: 0.5, einheit: "MWp", text: "Ab ca. 500 kWp planen wir Freiflächenanlagen" },
  { ab: 1, einheit: "MWp", text: "Oberösterreich: über 1.000 kW elektrizitätsrechtliche Bewilligung" },
  { ab: 2, einheit: "ha", text: "Niederösterreich: über 2 ha nur in Zonen des Sektoralen ROP" },
  { ab: 10, einheit: "ha", text: "Steiermark: über 10 ha nur in Vorrangzonen" },
];

/**
 * Flächen-Schieberegler: Hektar → MWp, Jahresertrag, Haushalte, CO₂ – mit Hinweisen zu Netzebene und Widmung.
 */
export default function FlaechenRegler({ eyebrow = "Interaktiv · Flächenrechner", titel = "Was trägt Ihre Fläche?", lead, className }) {
  const [ha, setHa] = useState(6);
  const id = useId();
  const r = useMemo(() => {
    const mwp = ha / HA_JE_MWP;
    const mwh = mwp * ERTRAG; // MWh/Jahr
    return {
      mwp,
      mwpVon: ha / 1.5,
      mwpBis: ha / 1,
      gwh: mwh / 1000,
      haushalte: (mwh * 1000) / HAUSHALT,
      co2: (mwh * 1000 * CO2) / 1000, // t
      felder: ha / FUSSBALLFELD,
      netz: mwp < 0.5 ? "unter 500 kWp – eher Dach oder Agri-PV prüfen" : mwp <= 10 ? "Netzebene 5 (Mittelspannung, Übergabestation)" : "Netzebene 4 – Anschluss am Umspannwerk",
    };
  }, [ha]);

  const min = 1;
  const max = 60;
  const fill = ((ha - min) / (max - min)) * 100;

  // Feld-Illustration: 12 × 10 Felder à 0,5 ha, gefüllt nach Fläche
  const zellen = 120;
  const aktiv = Math.max(1, Math.round(ha * 2));

  return (
    <div className={cn("overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70", className)}>
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="p-5 md:p-8 lg:p-10">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">{eyebrow}</p>
          <h2 className="mt-3 font-display text-[clamp(1.6rem,1.2rem+1.2vw,2.2rem)] font-extrabold leading-[1.1] tracking-tight text-ink-900">{titel}</h2>
          {lead && <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600">{lead}</p>}

          <div className="mt-7">
            <div className="flex items-end justify-between gap-4">
              <label htmlFor={id} className="text-[14.5px] font-semibold text-ink-700">Flächengröße</label>
              <p className="ov-num font-display text-[34px] font-extrabold leading-none tracking-tight text-ink-900">
                {fmtZahl(ha, ha % 1 ? 1 : 0)} <span className="text-[18px] font-bold text-ink-500">ha</span>
              </p>
            </div>
            <input
              id={id}
              type="range"
              min={min}
              max={max}
              step={0.5}
              value={ha}
              onChange={(e) => setHa(Number(e.target.value))}
              className="ov-range mt-5"
              style={{ "--ov-fill": `${fill}%` }}
              aria-valuetext={`${fmtZahl(ha, 1)} Hektar`}
            />
            <div className="mt-2 flex justify-between text-[12px] text-ink-400">
              <span>1 ha</span>
              <span>≈ {fmtZahl(r.felder, r.felder < 10 ? 1 : 0)} Fußballfelder</span>
              <span>60 ha</span>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-3">
            <Wert icon={Sun} label="Leistung (Richtwert)" wert={`${fmtZahl(r.mwp, 1)} MWp`} klein={`Spanne ${fmtZahl(r.mwpVon, 1)}–${fmtZahl(r.mwpBis, 1)} MWp`} hervor />
            <Wert icon={Sun} label="Jahresertrag" wert={`${fmtZahl(r.gwh, r.gwh < 10 ? 1 : 0)} GWh`} klein="bei 1.150 kWh/kWp" />
            <Wert icon={Home} label="Haushalte versorgt" wert={`≈ ${fmtZahl(Math.round(r.haushalte / 10) * 10)}`} klein="à 3.500 kWh/Jahr" />
            <Wert icon={Leaf} label="CO₂ vermieden" wert={`≈ ${fmtZahl(Math.round(r.co2 / 10) * 10)} t`} klein="pro Jahr" />
          </dl>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-navy-50 p-4 text-[14px] leading-snug text-navy-900 ring-1 ring-navy-100">
            <Cable aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" />
            <p><span className="font-semibold">Netzanschluss:</span> {r.netz}</p>
          </div>

          <Link href="/rechner/freiflaeche-pacht" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ov-600 px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-colors hover:bg-ov-700">
            Pacht & Erlös für diese Fläche rechnen
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative flex flex-col justify-between gap-6 overflow-hidden bg-navy-950 p-5 text-white md:p-8 lg:p-10">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div aria-hidden="true" className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-ov-500/25 blur-[100px]" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Ihre Fläche, schematisch</p>
              <p className="flex items-center gap-2 text-[12px] text-white/55"><span className="h-3 w-4 rounded-[3px] bg-gradient-to-b from-navy-300 to-navy-600" />= 0,5 ha</p>
            </div>
            <div aria-hidden="true" className="mt-5 grid grid-cols-12 gap-1.5 rounded-2xl bg-[#1d3a1a] p-3 ring-1 ring-white/10" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(140,186,88,0.35), transparent 60%)" }}>
              {Array.from({ length: zellen }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-4 rounded-[3px] transition-all duration-500 md:h-6",
                    i < aktiv ? "bg-gradient-to-b from-navy-300 to-navy-600 shadow-[0_1px_0_rgba(255,255,255,0.25)_inset]" : "bg-white/[0.06]"
                  )}
                  style={{ transitionDelay: `${(i % 12) * 12}ms` }}
                />
              ))}
            </div>
          </div>
          <ul className="relative space-y-2.5">
            {SCHWELLEN.map((s) => {
              const erreicht = s.einheit === "ha" ? ha > s.ab : r.mwp >= s.ab;
              return (
                <li key={s.text} className={cn("flex items-start gap-3 rounded-xl px-3 py-2.5 text-[13.5px] leading-snug transition-all duration-300", erreicht ? "bg-white/10 text-white" : "text-white/45")}>
                  <Landmark aria-hidden="true" className={cn("mt-0.5 h-4 w-4 shrink-0", erreicht ? "text-sun-300" : "text-white/30")} />
                  {s.text}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="border-t border-ink-100 px-5 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        Richtwerte, keine Zusage: 1–1,5 ha je MWp (Mitte 1,25 ha), 1.150 kWh/kWp (Ost-Österreich, Süd), 3.500 kWh je Haushalt (Standardhaushalt
        E-Control-Preismonitor), 258,2 g CO₂/kWh substituierter Strom (Technikum Wien 2025, Basis E-Control). Ob eine Fläche widmungsfähig ist,
        entscheiden Gemeinde und Land.
      </p>
    </div>
  );
}

function Wert({ icon: Icon, label, wert, klein, hervor }) {
  return (
    <div className={cn("rounded-2xl p-4 ring-1", hervor ? "bg-ov-50 ring-ov-200" : "bg-sand-50 ring-ink-200/70")}>
      <dt className="flex items-center gap-1.5 text-[12.5px] text-ink-500">
        <Icon aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />
        {label}
      </dt>
      <dd className="ov-num mt-1.5 font-display text-[24px] font-extrabold leading-none tracking-tight text-ink-900 md:text-[26px]">{wert}</dd>
      {klein && <dd className="mt-1.5 text-[12px] text-ink-500">{klein}</dd>}
    </div>
  );
}
