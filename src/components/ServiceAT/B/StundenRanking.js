"use client";

import { useId, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, BatteryCharging, Car, Clock, Snowflake, ThermometerSun, Trophy } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { LiveDot } from "@/components/ui/LiveTicker";
import useLiveDaten from "@/components/EnergieLive/useLiveDaten";
import { preisTage, zeitfenster, stundenmittel, ct, uhr, spanne, zahl, tagLang, berlinTag } from "@/components/EnergieLive/berechnung";

/**
 * Tagesverlauf als Heatmap-Leiste (24 Stundenmittel), Rangliste der günstigsten
 * Stunden und ein Lastverschiebungs-Rechner (günstigstes vs. teuerstes Fenster).
 * Basis: Day-Ahead-Preise der Gebotszone AT (live). Nur der Energiepreis –
 * Netzentgelte, Abgaben und Leistungspreis bleiben unberücksichtigt.
 */

const LASTEN = [
  { k: "flotte", name: "E-Flotte laden", icon: Car, kwh: 200, std: 4 },
  { k: "wp", name: "Wärmepumpe & Puffer", icon: ThermometerSun, kwh: 80, std: 3 },
  { k: "kaelte", name: "Kühlhaus vorkühlen", icon: Snowflake, kwh: 120, std: 3 },
  { k: "speicher", name: "Speicher aus dem Netz laden", icon: BatteryCharging, kwh: 400, std: 2 },
];

// Farbskala günstig → teuer (grün – sand – orange)
function farbe(anteil) {
  const stops = [
    [0, [67, 102, 33]],
    [0.35, [140, 186, 88]],
    [0.6, [245, 243, 234]],
    [0.8, [255, 197, 61]],
    [1, [214, 110, 30]],
  ];
  let a = stops[0];
  let b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (anteil >= stops[i][0] && anteil <= stops[i + 1][0]) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }
  const t = b[0] === a[0] ? 0 : (anteil - a[0]) / (b[0] - a[0]);
  const c = a[1].map((v, i) => Math.round(v + (b[1][i] - v) * t));
  return { bg: `rgb(${c.join(",")})`, hell: anteil > 0.4 && anteil < 0.9 };
}

export default function StundenRanking({ initial, dunkel = false }) {
  const id = useId();
  const { daten, jetzt, live } = useLiveDaten(initial);
  const tage = useMemo(() => preisTage(daten.preis, jetzt), [daten.preis, jetzt]);
  const [wahl, setWahl] = useState("heute");
  const [last, setLast] = useState("flotte");
  const [kwh, setKwh] = useState(200);
  const [std, setStd] = useState(4);

  const tag = (wahl === "morgen" && tage.morgen) || tage.heute || tage.morgen;
  const istHeute = tag && tag === tage.heute;

  const stunden = useMemo(() => (tag ? stundenmittel(tag.punkte) : []), [tag]);
  const rang = useMemo(() => [...stunden].sort((a, b) => a.avg - b.avg), [stunden]);
  const fenster = useMemo(() => (tag ? zeitfenster(tag.punkte, std * 60, tage.schrittMs) : { guenstig: null, teuer: null }), [tag, std, tage.schrittMs]);

  if (!tag || !stunden.length) {
    return <div className="rounded-[2rem] bg-white p-10 text-center text-ink-600 shadow-xl">Die Börsenpreise sind gerade nicht abrufbar. Die Anzeige aktualisiert sich automatisch.</div>;
  }

  const min = rang[0].avg;
  const max = rang[rang.length - 1].avg;
  const anteil = (v) => (max > min ? (v - min) / (max - min) : 0.5);
  const jetztStunde = istHeute ? Math.floor(jetzt / 3600000) * 3600000 : null;
  const top = rang.slice(0, 5);
  const ersparnis = fenster.guenstig && fenster.teuer ? ((fenster.teuer.avg - fenster.guenstig.avg) / 1000) * kwh : null;

  const waehleLast = (l) => {
    setLast(l.k);
    setKwh(l.kwh);
    setStd(l.std);
  };

  return (
    <div className={cn("overflow-hidden rounded-[2rem] bg-white text-ink-900 shadow-2xl", dunkel ? "ring-1 ring-white/10" : "ring-1 ring-ink-200/70")}>
      {/* Kopf */}
      <div className="flex flex-col gap-4 border-b border-ink-100 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
            {live && <LiveDot />}
            Tagesverlauf · Stundenmittel · Gebotszone AT
          </p>
          <h3 className="ov-h3 mt-1.5 text-ink-900">
            Günstigste Stunden {istHeute ? "heute" : "morgen"}, {tagLang(tag.start)}
          </h3>
        </div>
        <div role="group" aria-label="Tag wählen" className="inline-flex self-start rounded-full bg-ink-100 p-1 md:self-auto">
          {[
            { v: "heute", l: "Heute", ok: !!tage.heute },
            { v: "morgen", l: "Morgen", ok: !!tage.morgen },
          ].map((o) => {
            const an = (o.v === "heute" && istHeute) || (o.v === "morgen" && !istHeute);
            return (
              <button
                key={o.v}
                type="button"
                aria-pressed={an}
                disabled={!o.ok}
                onClick={() => setWahl(o.v)}
                className={cn("h-11 min-w-[92px] rounded-full px-5 text-[14px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-45", an ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-900")}
              >
                {o.l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Heatmap */}
      <div className="px-4 pt-6 sm:px-7">
        <div className="ov-no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ol className="grid min-w-[720px] grid-cols-24 gap-1" style={{ gridTemplateColumns: `repeat(${stunden.length}, minmax(0, 1fr))` }} aria-label="Börsenpreis je Stunde">
            {stunden.map((h) => {
              const f = farbe(anteil(h.avg));
              const jetztHier = jetztStunde === h.t;
              const platz = rang.indexOf(h);
              return (
                <li key={h.t} className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn("relative flex h-24 w-full items-end justify-center rounded-lg pb-2 transition-transform duration-300 hover:-translate-y-0.5 sm:h-28", jetztHier && "ring-2 ring-navy-950 ring-offset-2")}
                    style={{ background: f.bg }}
                    title={`${spanne(h.t, h.t + 3600000)}: ${ct(h.avg, 2)} ct/kWh`}
                  >
                    {platz < 3 && <Trophy aria-hidden="true" className="absolute top-1.5 h-3.5 w-3.5 text-white/90" />}
                    <span className={cn("ov-num text-[11.5px] font-bold [writing-mode:vertical-rl] rotate-180 sm:text-[12.5px]", f.hell ? "text-navy-950" : "text-white")}>{ct(h.avg)}</span>
                    <span className="sr-only">
                      {spanne(h.t, h.t + 3600000)}: {ct(h.avg, 2)} ct/kWh
                      {jetztHier ? " (aktuelle Stunde)" : ""}
                    </span>
                  </span>
                  <span className={cn("ov-num text-[11px]", jetztHier ? "font-bold text-ink-900" : "text-ink-500")}>{uhr(h.t).slice(0, 2)}</span>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-ink-500">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-28 rounded-full" style={{ background: "linear-gradient(90deg,#436621,#8cba58,#f5f3ea,#ffc53d,#d66e1e)" }} />
            günstig → teuer (ct/kWh netto, Börse)
          </span>
          {istHeute && (
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-3 w-3 rounded-sm ring-2 ring-navy-950" />
              aktuelle Stunde
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 border-t border-ink-100 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Rangliste */}
        <div className="p-5 sm:p-7 lg:border-r lg:border-ink-100">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Top 5 günstigste Stunden</p>
          <ol className="mt-4 space-y-2">
            {top.map((h, i) => (
              <li key={h.t} className="flex items-center gap-3 rounded-2xl bg-sand-50 px-3.5 py-2.5 ring-1 ring-ink-200/60">
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[14px] font-bold", i === 0 ? "bg-ov-600 text-white" : "bg-white text-ink-700 ring-1 ring-ink-200")}>{i + 1}</span>
                <span className="min-w-0 flex-1 text-[15px] font-semibold text-ink-800">{spanne(h.t, h.t + 3600000)}</span>
                <span className="ov-num font-display text-[18px] font-extrabold tracking-tight text-ink-900">{ct(h.avg)} ct</span>
              </li>
            ))}
          </ol>
          <dl className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-ov-50 p-3.5 ring-1 ring-ov-200/70">
              <dt className="flex items-center gap-1.5 text-[12px] text-ink-600">
                <ArrowDownRight aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />
                Tagestief
              </dt>
              <dd className="ov-num mt-1 font-display text-[19px] font-extrabold text-ink-900">{ct(tag.min.eurMwh)} ct</dd>
              <dd className="text-[12px] text-ink-500">um {uhr(tag.min.t)} Uhr</dd>
            </div>
            <div className="rounded-2xl bg-sun-300/20 p-3.5 ring-1 ring-sun-300/70">
              <dt className="flex items-center gap-1.5 text-[12px] text-ink-600">
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 text-sun-500" />
                Tageshoch
              </dt>
              <dd className="ov-num mt-1 font-display text-[19px] font-extrabold text-ink-900">{ct(tag.max.eurMwh)} ct</dd>
              <dd className="text-[12px] text-ink-500">um {uhr(tag.max.t)} Uhr</dd>
            </div>
          </dl>
        </div>

        {/* Lastverschiebung */}
        <div className="bg-navy-950 p-5 text-white sm:p-7">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Lastverschiebung rechnen</p>
          <div role="group" aria-label="Verbraucher wählen" className="mt-4 grid grid-cols-2 gap-2">
            {LASTEN.map((l) => (
              <button
                key={l.k}
                type="button"
                aria-pressed={last === l.k}
                onClick={() => waehleLast(l)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-semibold transition-all",
                  last === l.k ? "bg-white text-navy-950" : "bg-white/[0.06] text-white/80 ring-1 ring-white/10 hover:bg-white/10"
                )}
              >
                <l.icon aria-hidden="true" className={cn("h-4 w-4 shrink-0", last === l.k ? "text-ov-600" : "text-ov-300")} />
                {l.name}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Regler id={`${id}-kwh`} label="Energiemenge" wert={kwh} anzeige={`${zahl(kwh, 0)} kWh`} min={10} max={2000} step={10} onChange={setKwh} />
            <Regler id={`${id}-std`} label="Dauer am Stück" wert={std} anzeige={`${std} h`} min={1} max={8} step={1} onChange={setStd} />
          </div>
          {fenster.guenstig && fenster.teuer && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2" aria-live="polite">
              <div className="rounded-2xl bg-ov-500/15 p-4 ring-1 ring-ov-400/30">
                <p className="flex items-center gap-1.5 text-[12.5px] text-white/65">
                  <Clock aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
                  Bestes Fenster
                </p>
                <p className="ov-num mt-1 font-display text-[19px] font-extrabold">{spanne(fenster.guenstig.start, fenster.guenstig.ende)}</p>
                <p className="text-[12.5px] text-white/60">Ø {ct(fenster.guenstig.avg)} ct/kWh</p>
              </div>
              <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                <p className="text-[12.5px] text-white/65">Ersparnis ggü. teuerstem Fenster</p>
                <p className="ov-num mt-1 font-display text-[26px] font-extrabold leading-none tracking-tight text-ov-300">{zahl(Math.max(ersparnis, 0), 0)} €</p>
                <p className="mt-1 text-[12.5px] text-white/60">
                  statt {spanne(fenster.teuer.start, fenster.teuer.ende).replace(" Uhr", "")} · netto
                </p>
              </div>
            </div>
          )}
          <p className="mt-4 text-[12px] leading-relaxed text-white/45">
            Nur Energiepreis an der Börse ({berlinTag(tag.start) === berlinTag(jetzt) ? "heute" : "morgen"}); Netzentgelte, Abgaben, Lieferantenaufschlag und Leistungspreis unberücksichtigt. Wer alle Lasten in dieselbe
            Viertelstunde legt, riskiert eine neue Leistungsspitze.
          </p>
        </div>
      </div>
    </div>
  );
}

function Regler({ id, label, wert, anzeige, min, max, step, onChange }) {
  const fill = ((wert - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-white/75">
          {label}
        </label>
        <output htmlFor={id} className="ov-num font-display text-[16px] font-extrabold text-white">
          {anzeige}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={wert}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ov-range mt-3 block cursor-pointer"
        style={{ "--ov-fill": `${fill}%` }}
      />
    </div>
  );
}
