"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Car, Flame, Info, Sparkles } from "lucide-react";
import { Regler, Zahl } from "@/components/Rechner/bausteine";
import { fmt } from "@/lib/rechner/annahmen";
import { speicherErgebnis, speicherKurve, speicherReihen } from "@/lib/rechner/stromspeicher";
import { cn } from "@/components/ui/cn";

/**
 * Mini-Rechner Heimspeicher – gleiche stündliche Jahressimulation wie
 * /rechner/stromspeicher, reduziert auf die wichtigsten Eingaben.
 */
export default function SpeicherMini() {
  const [verbrauch, setVerbrauch] = useState(4500);
  const [kwp, setKwp] = useState(10);
  const [speicher, setSpeicher] = useState(8);
  const [eAuto, setEAuto] = useState(false);
  const [wp, setWp] = useState(false);

  const e = useDeferredValue({ verbrauch, kwp, speicher, eAuto, wp });
  const { basis, kurve } = useMemo(() => {
    const b = speicherReihen({ verbrauch: e.verbrauch, kwp: e.kwp, eAuto: e.eAuto, km: 15000, waermepumpe: e.wp });
    return { basis: b, kurve: speicherKurve(b, { kwp: e.kwp }) };
  }, [e.verbrauch, e.kwp, e.eAuto, e.wp]);
  const r = useMemo(() => speicherErgebnis(basis, { kwp: e.kwp, speicher: e.speicher }), [basis, e.kwp, e.speicher]);

  const ohne = Math.round(r.ohne.autarkie * 100);
  const mit = Math.round(r.mit.autarkie * 100);
  const optimum = kurve.optimum?.kap;

  return (
    <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-6 p-6 md:p-9">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
            <BatteryCharging aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">Speicher-Schnellcheck</p>
            <p className="text-[13px] text-ink-500">Stündliche Jahressimulation, Wohnhaus</p>
          </div>
        </div>
        <Regler label="Stromverbrauch Haushalt" wert={verbrauch} min={2000} max={12000} step={250} einheit="kWh" onChange={setVerbrauch} />
        <Regler label="PV-Anlage" wert={kwp} min={4} max={30} step={0.5} stellen={1} einheit="kWp" onChange={setKwp} />
        <Regler label="Speichergröße" wert={speicher} min={0} max={20} step={1} einheit="kWh" onChange={setSpeicher} />
        <div className="grid grid-cols-2 gap-2">
          <Chip an={eAuto} onClick={() => setEAuto((x) => !x)} icon={Car}>
            E-Auto
          </Chip>
          <Chip an={wp} onClick={() => setWp((x) => !x)} icon={Flame}>
            Wärmepumpe
          </Chip>
        </div>
      </div>

      <div className="relative isolate overflow-hidden bg-sand-50 p-6 md:p-9">
        <div aria-hidden="true" className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-sun-300/30 blur-[90px]" />
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-700">Selbst versorgt</p>
        <div className="mt-5 space-y-4">
          <Balken label="Ohne Speicher" wert={ohne} farbe="bg-ink-300" />
          <Balken label={`Mit ${fmt(speicher)} kWh Speicher`} wert={mit} farbe="bg-gradient-to-r from-ov-600 to-ov-400" stark />
        </div>
        <dl className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
            <dt className="text-[12.5px] text-ink-500">Ersparnis / Jahr</dt>
            <dd className="mt-1 font-display text-[22px] font-extrabold text-ink-900">
              <Zahl wert={Math.round(r.ersparnis / 10) * 10} /> €
            </dd>
          </div>
          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
            <dt className="text-[12.5px] text-ink-500">Amortisation</dt>
            <dd className="mt-1 font-display text-[22px] font-extrabold text-ink-900">
              {speicher === 0 ? "–" : r.amortisation != null ? <><Zahl wert={r.amortisation} stellen={1} /> J.</> : "> 15 J."}
            </dd>
          </div>
        </dl>
        {optimum != null && (
          <button
            type="button"
            onClick={() => setSpeicher(optimum)}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-navy-950 px-4 py-3 text-left text-[14px] text-white transition-colors hover:bg-navy-900"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-sun-300" />
            <span className="flex-1">
              Wirtschaftlich sinnvoll: <strong className="ov-num">{optimum} kWh</strong>
            </span>
            <span className="text-[12.5px] font-semibold text-ov-300">übernehmen</span>
          </button>
        )}
        <Link href="/rechner/stromspeicher" className="group mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
          Zum ausführlichen Stromspeicher-Rechner
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <p className="mt-3 flex gap-2 text-[12px] leading-relaxed text-ink-500">
          <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Richtwerte mit Branchenpreisen (brutto) und Standardlastprofil; E-Auto 15.000 km/Jahr. Für Betriebe rechnen wir mit Ihrem Lastgang.
        </p>
      </div>
    </div>
  );
}

function Chip({ an, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      aria-pressed={an}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-[14.5px] font-semibold ring-1 transition-all duration-300",
        an ? "bg-ov-600 text-white ring-ov-600 shadow-md" : "bg-white text-ink-700 ring-ink-200 hover:ring-ink-300"
      )}
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      {children}
    </button>
  );
}

function Balken({ label, wert, farbe, stark = false }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className={cn("text-[14px]", stark ? "font-semibold text-ink-900" : "text-ink-600")}>{label}</span>
        <span className={cn("ov-num font-display font-extrabold", stark ? "text-[28px] text-ink-900" : "text-[20px] text-ink-500")}>{wert} %</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink-200/60">
        <div className={cn("h-full rounded-full transition-[width] duration-500", farbe)} style={{ width: `${wert}%` }} />
      </div>
    </div>
  );
}
