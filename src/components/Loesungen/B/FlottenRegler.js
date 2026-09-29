"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calculator, PlugZap, Sun } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Regler, Zahl } from "@/components/Rechner/bausteine";

/**
 * Flotten-Mini-Regler: Energiekosten einer E-Transporter-Flotte mit PV-Überschussladen
 * gegenüber Diesel. Annahmen identisch mit der Beispielrechnung auf /ladeinfrastruktur
 * (25 kWh/100 km, 9 l/100 km, 1,40 €/l netto, Netzstrom 16 ct, PV-Strom 6 ct entgangene Einspeisung).
 */
const A = { kwh100: 25, l100: 9, diesel: 1.4, netz: 0.16, pv: 0.06, tage: 250, standzeit: 10 };

const fmt = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

export default function FlottenRegler() {
  const [anzahl, setAnzahl] = useState(20);
  const [km, setKm] = useState(20000);
  const [pv, setPv] = useState(60);

  const r = useMemo(() => {
    const kwh = (anzahl * km * A.kwh100) / 100;
    const kwhPv = kwh * (pv / 100);
    const kwhNetz = kwh - kwhPv;
    const kostenPv = kwhPv * A.pv;
    const kostenNetz = kwhNetz * A.netz;
    const elektrisch = kostenPv + kostenNetz;
    const diesel = ((anzahl * km * A.l100) / 100) * A.diesel;
    const leistung = kwh / A.tage / A.standzeit;
    return { kwh, kostenPv, kostenNetz, elektrisch, diesel, differenz: diesel - elektrisch, leistung };
  }, [anzahl, km, pv]);

  const max = Math.max(r.diesel, 1);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="border-b border-ink-100 p-6 md:p-9 lg:border-b-0 lg:border-r">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Interaktiv · Flotten-Check</p>
          <h3 className="ov-h3 mt-2 text-ink-900">Was Ihre Flotte an Energie spart</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-600">E-Transporter mit PV-Überschussladen gegenüber Diesel – nur Energiekosten, ohne Fahrzeug, Wartung und Maut.</p>
          <div className="mt-8 space-y-7">
            <Regler label="Fahrzeuge" wert={anzahl} min={1} max={100} onChange={setAnzahl} />
            <Regler label="Fahrleistung je Fahrzeug" wert={km} min={5000} max={60000} step={1000} onChange={setKm} format={(v) => `${fmt(v)} km/Jahr`} minLabel="5.000 km" maxLabel="60.000 km" />
            <Regler label="Anteil Solarstrom" wert={pv} min={0} max={80} step={5} einheit="%" onChange={setPv} hinweis="Hoch bei Tagstandzeiten am Firmenparkplatz, niedrig bei reinem Nachtladen." />
          </div>
        </div>

        <div className="flex flex-col p-6 md:p-9">
          <p className="text-[13px] font-medium text-ink-500">Energiekosten-Differenz pro Jahr</p>
          <p className="mt-1 font-display text-[clamp(2.2rem,1.6rem+2.4vw,3.4rem)] font-extrabold leading-none tracking-tight text-ov-700">
            <Zahl wert={r.differenz} prefix="≈ " suffix=" €" />
          </p>

          <div className="mt-8 space-y-5" aria-hidden="true">
            <Balken label="Diesel" wert={r.diesel} max={max} teile={[{ w: r.diesel, c: "bg-ink-300" }]} />
            <Balken
              label="Elektrisch"
              wert={r.elektrisch}
              max={max}
              teile={[
                { w: r.kostenPv, c: "bg-sun-400" },
                { w: r.kostenNetz, c: "bg-navy-600" },
              ]}
            />
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-ink-500">
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-sun-400" />Solarstrom (6 ct/kWh)</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-navy-600" />Netzstrom (16 ct/kWh)</li>
            </ul>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
              <dt className="flex items-center gap-1.5 text-[12.5px] text-ink-500"><Sun aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />Strombedarf Flotte</dt>
              <dd className="mt-1 font-display text-[19px] font-extrabold text-ink-900"><Zahl wert={r.kwh} suffix=" kWh" /></dd>
            </div>
            <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
              <dt className="flex items-center gap-1.5 text-[12.5px] text-ink-500"><PlugZap aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />Ø Ladeleistung über Nacht</dt>
              <dd className="mt-1 font-display text-[19px] font-extrabold text-ink-900"><Zahl wert={r.leistung} suffix=" kW" /></dd>
            </div>
          </dl>
          <p className="sr-only" aria-live="polite">
            {`Diesel ${fmt(r.diesel)} Euro, elektrisch ${fmt(r.elektrisch)} Euro, Differenz ${fmt(r.differenz)} Euro pro Jahr.`}
          </p>

          <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:flex-wrap">
            <Button href="/rechner/e-flotte" variant="navy" icon={ArrowRight}>E-Flotte-Rechner</Button>
            <Button href="/rechner/ladeinfrastruktur" variant="secondary" icon={Calculator}>Ladeinfrastruktur planen</Button>
          </div>
        </div>
      </div>
      <p className="border-t border-ink-100 bg-sand-50 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-9">
        Annahmen wie in der Beispielrechnung unten: 25 kWh bzw. 9 l Diesel je 100 km, Diesel 1,40 €/l netto, Netzstrom 16 ct/kWh netto inkl.
        Netzentgelten und Abgaben, Solarstrom mit 6 ct/kWh entgangener Einspeisung bewertet. Ladeleistung: 250 Einsatztage, 10 h Standzeit,
        mit Lastmanagement gleichmäßig verteilt. Orientierung, kein Angebot.
      </p>
    </div>
  );
}

function Balken({ label, wert, max, teile }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-[13.5px]">
        <span className="font-semibold text-ink-800">{label}</span>
        <span className="ov-num font-semibold text-ink-900">{fmt(Math.round(wert))} €/Jahr</span>
      </div>
      <div className="flex h-4 overflow-hidden rounded-full bg-ink-100">
        {teile.map((t, i) => (
          <span
            key={i}
            className={cn("h-full motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out", t.c)}
            style={{ width: `${(t.w / max) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
