"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp, Zap } from "lucide-react";
import useEnergyLive, { fmtCt, fmtUhr } from "@/components/ui/useEnergyLive";
import { LiveDot } from "@/components/ui/LiveTicker";

/**
 * Live-Bezug für die Smart-Meter-Seite: Was ein dynamischer Tarif heute
 * bedeutet – aktueller Börsenpreis sowie günstigste und teuerste Viertelstunde.
 * Server-HTML zeigt einen ruhigen Platzhalter gleicher Höhe.
 */
export default function LivePreis() {
  const d = useEnergyLive();
  // Kommen die Live-Daten nicht, nach 15 s ruhigen Hinweis statt Ladeanimation zeigen
  const [zuLange, setZuLange] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setZuLange(true), 15000);
    return () => clearTimeout(t);
  }, []);
  const fehlt = !d && zuLange;
  const p = d?.preis;
  const spanne = p?.heute ? (p.heute.max.eurMwh - p.heute.min.eurMwh) / 10 : null;

  const Wert = ({ icon: Icon, label, wert, zeit, farbe }) => (
    <div className="ov-glass rounded-2xl p-4">
      <p className="flex items-center gap-1.5 text-[12.5px] text-white/60">
        <Icon aria-hidden="true" className={`h-3.5 w-3.5 ${farbe}`} />
        {label}
      </p>
      {wert == null && fehlt ? (
        <p className="mt-1 font-display text-[24px] font-extrabold leading-tight text-white/40">–</p>
      ) : wert == null ? (
        <span className="mt-2 block h-7 w-20 animate-ov-shimmer rounded bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.16),rgba(255,255,255,0.06))] bg-[length:200%_100%]" />
      ) : (
        <p className="ov-num mt-1 font-display text-[24px] font-extrabold leading-tight text-white">
          {wert}
          <span className="text-[13px] font-semibold text-white/55"> ct</span>
        </p>
      )}
      <p className="mt-0.5 h-4 text-[12px] text-white/50">{zeit}</p>
    </div>
  );

  return (
    <div className="ov-noise relative flex h-full flex-col overflow-hidden rounded-3xl bg-navy-950 p-7 text-white md:p-8">
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
      <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sun-400/15 blur-[90px]" />
      <div className="relative flex flex-1 flex-col">
        <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">
          <LiveDot />
          Börsenstrompreis heute
        </p>
        <h3 className="ov-h3 mt-3 text-white">Dynamische Stromtarife</h3>
        <p className="mt-3 text-[15.5px] leading-relaxed text-white/70">
          Seit 2025 muss jeder Stromanbieter einen dynamischen Tarif anbieten. Der Preis folgt der Strombörse – nutzbar ist das nur mit intelligentem
          Messsystem, das Ihren Verbrauch viertelstündlich erfasst.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2.5">
          <Wert icon={Zap} farbe="text-sun-400" label="Jetzt" wert={p?.aktuell ? fmtCt(p.aktuell.eurMwh) : null} zeit={p?.aktuell ? `${fmtUhr(p.aktuell.t)} Uhr` : ""} />
          <Wert icon={TrendingDown} farbe="text-ov-300" label="Tief" wert={p?.heute ? fmtCt(p.heute.min.eurMwh) : null} zeit={p?.heute ? `${fmtUhr(p.heute.min.t)} Uhr` : ""} />
          <Wert icon={TrendingUp} farbe="text-navy-200" label="Hoch" wert={p?.heute ? fmtCt(p.heute.max.eurMwh) : null} zeit={p?.heute ? `${fmtUhr(p.heute.max.t)} Uhr` : ""} />
        </div>
        <p className="mt-4 min-h-10 text-[13.5px] leading-snug text-white/65">
          {spanne != null
            ? `Heute liegen ${spanne.toLocaleString("de-DE", { maximumFractionDigits: 1 })} ct/kWh zwischen günstigster und teuerster Viertelstunde (Börse, netto, ohne Netzentgelte und Abgaben).`
            : fehlt
              ? "Die Live-Börsendaten sind gerade nicht erreichbar – im Live-Dashboard sehen Sie den Tagesverlauf."
              : "Börsenpreise netto je kWh, ohne Netzentgelte und Abgaben."}
        </p>

        <div className="mt-auto flex flex-wrap gap-x-6 gap-y-1 pt-5">
          <Link href="/energie-live" className="group inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-white hover:text-ov-300">
            Live-Dashboard
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/service/stromtarif" className="group inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-white/75 hover:text-white">
            Dynamischer Tarif
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
