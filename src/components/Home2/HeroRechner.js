"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { berechne, empfohlenerSpeicher } from "@/lib/solarrechner";
import useEnergyLive, { fmtCt } from "@/components/ui/useEnergyLive";
import { LiveDot } from "@/components/ui/LiveTicker";

const AUSRICHTUNGEN = [
  { id: "sued", label: "Süd" },
  { id: "suedost", label: "SO / SW" },
  { id: "ost-west", label: "Ost / West" },
];

const eur = (n) => Math.round(n).toLocaleString("de-DE");

/** Mini-Rechner im Hero: drei Eingaben, sofortiges Ergebnis, Übergabe an den Konfigurator. */
export default function HeroRechner() {
  const [verbrauch, setVerbrauch] = useState(4500);
  const [ausrichtung, setAusrichtung] = useState("sued");
  const [speicher, setSpeicher] = useState(true);
  const live = useEnergyLive();

  const r = useMemo(() => {
    const kwp = Math.min(Math.max(Math.round((verbrauch / 1000) * 1.4 * 2) / 2, 4), 30);
    const speicherKwh = speicher ? Math.min(empfohlenerSpeicher(verbrauch), 15) : 0;
    return { kwp, speicherKwh, ...berechne({ kwp, ausrichtung, neigung: "mittel", verbrauch, speicherKwh }) };
  }, [verbrauch, ausrichtung, speicher]);

  const fill = ((verbrauch - 1500) / (15000 - 1500)) * 100;
  const ziel = `/angebot?verbrauch=${verbrauch}&kwp=${r.kwp}${speicher ? `&speicher=${r.speicherKwh}` : ""}`;

  return (
    <div className="ov-glass relative overflow-hidden rounded-[2rem] p-6 text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] md:p-8">
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ov-400/30 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-[19px] font-bold">Was bringt Ihr Dach?</p>
          {live?.preis?.aktuell && (
            <Link href="/energie-live" className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[12px] text-white/80 hover:bg-white/15">
              <LiveDot />
              <Zap aria-hidden="true" className="h-3 w-3 text-sun-400" />
              <span className="ov-num">{fmtCt(live.preis.aktuell.eurMwh)} ct</span>
            </Link>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <label htmlFor="hero-verbrauch" className="text-[13.5px] text-white/70">Stromverbrauch pro Jahr</label>
            <output htmlFor="hero-verbrauch" className="ov-num font-display text-[22px] font-extrabold">
              {verbrauch.toLocaleString("de-DE")} <span className="text-[14px] font-bold text-white/60">kWh</span>
            </output>
          </div>
          <input
            id="hero-verbrauch"
            type="range"
            min={1500}
            max={15000}
            step={250}
            value={verbrauch}
            onChange={(e) => setVerbrauch(Number(e.target.value))}
            className="ov-range mt-3"
            style={{ "--ov-fill": `${fill}%` }}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[13.5px] text-white/70">Dach</span>
          {AUSRICHTUNGEN.map((a) => (
            <button
              key={a.id}
              type="button"
              aria-pressed={ausrichtung === a.id}
              onClick={() => setAusrichtung(a.id)}
              className={`h-9 rounded-full px-3.5 text-[13.5px] font-semibold transition-all ${ausrichtung === a.id ? "bg-white text-navy-950" : "bg-white/10 text-white/80 hover:bg-white/20"}`}
            >
              {a.label}
            </button>
          ))}
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-[13.5px] text-white/80">
            <input type="checkbox" checked={speicher} onChange={(e) => setSpeicher(e.target.checked)} className="h-4 w-4 accent-[#8cba58]" />
            Speicher
          </label>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/10">
          {[
            { l: "Anlage", w: `${r.kwp.toLocaleString("de-DE")} kWp` },
            { l: "Autarkie", w: `${Math.round(r.autarkie * 100)} %` },
            { l: "Amortisation", w: r.amortisationJahre ? `~${Math.round(r.amortisationJahre)} J.` : "–" },
          ].map((k) => (
            <div key={k.l} className="bg-navy-950/40 px-3 py-3.5">
              <p className="text-[11.5px] text-white/55">{k.l}</p>
              <p className="ov-num mt-0.5 font-display text-[17px] font-extrabold">{k.w}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[12.5px] text-white/60">Vorteil pro Jahr, ca.</p>
            <p className="ov-num whitespace-nowrap font-display text-[34px] font-extrabold leading-none tracking-tight text-ov-300 sm:text-[40px]">{eur(r.nutzenProJahr)} €</p>
          </div>
          <p className="hidden max-w-[9rem] text-right text-[11px] leading-snug text-white/45 sm:block">Richtwert · Details im Solarrechner</p>
        </div>

        <Link
          href={ziel}
          className="group mt-6 flex h-13 items-center justify-center gap-2 rounded-full bg-ov-500 py-3.5 text-[15.5px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(102,153,51,0.9)] transition-all hover:bg-ov-400"
        >
          Angebot mit diesen Werten
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
