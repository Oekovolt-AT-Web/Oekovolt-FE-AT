"use client";

import { useId, useMemo, useState } from "react";
import { BatteryCharging, Info, Scale, TrendingUp } from "lucide-react";

/**
 * Erlösvergleich: feste EEG-Einspeisevergütung vs. Direktvermarktung im
 * Marktprämienmodell. Zeigt verständlich, wie die gleitende Marktprämie den
 * Börsenerlös bis zum anzulegenden Wert auffüllt – und woher ein Mehrerlös kommt.
 * Beispielrechnung mit offen gelegten Annahmen (Stand September 2026).
 */

// Einspeisevergütung Teileinspeisung, Inbetriebnahme 01.08.2026–31.01.2027 (ct/kWh)
const STUFEN = [
  { bis: 10, satz: 7.7 },
  { bis: 40, satz: 6.66 },
  { bis: 100, satz: 5.44 },
];
const AUFSCHLAG_AW = 0.4; // anzulegender Wert liegt 0,4 ct über der festen Vergütung
const ENTGELT = 0.4; // Vermarktungsentgelt Direktvermarkter, Beispielwert ct/kWh
const OPTIMIERUNG = 1.12; // Mehrwert, wenn Speicher/Energiemanagement in teure Stunden verschiebt
const ERTRAG = 1000; // kWh je kWp

// Beispielhafter Jahresverlauf des Monatsmarktwerts Solar (ct/kWh), nur zur Veranschaulichung
const MONATE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const MUSTER = [1.45, 1.25, 1.0, 0.72, 0.55, 0.5, 0.6, 0.7, 0.9, 1.15, 1.4, 1.5];

const zahl = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });
const eur = (n) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/** Mischsatz nach § 23c EEG (anteilig je Leistungsstufe) */
function mischsatz(kwp) {
  let rest = kwp, unten = 0, summe = 0;
  for (const s of STUFEN) {
    const teil = Math.max(0, Math.min(rest, s.bis - unten));
    summe += teil * s.satz;
    rest -= teil;
    unten = s.bis;
  }
  return summe / kwp;
}

export default function ErloesVergleich() {
  const id = useId();
  const [kwp, setKwp] = useState(30);
  const [eigen, setEigen] = useState(30);
  const [mw, setMw] = useState(4.5);
  const [optimiert, setOptimiert] = useState(false);
  const [monatHover, setMonatHover] = useState(null);

  const r = useMemo(() => {
    const einspeisung = kwp * ERTRAG * (1 - eigen / 100);
    const satz = mischsatz(kwp);
    const aw = satz + AUFSCHLAG_AW;
    const faktor = optimiert ? OPTIMIERUNG : 1;
    const eeg = (einspeisung * satz) / 100;
    const boerse = (einspeisung * mw * faktor) / 100;
    const praemie = (einspeisung * Math.max(0, aw - mw)) / 100;
    const entgelt = (einspeisung * ENTGELT) / 100;
    const dv = boerse + praemie - entgelt;
    return { einspeisung, satz, aw, eeg, boerse, praemie, entgelt, dv, diff: dv - eeg };
  }, [kwp, eigen, mw, optimiert]);

  // Balkengrafik
  // Balken zeigen Nettowerte: Entgelt wird zuerst von der Prämie, dann vom Börsenerlös abgezogen
  const praemieNetto = Math.max(0, r.praemie - r.entgelt);
  const boerseNetto = Math.max(0, r.dv - praemieNetto);
  const maxWert = Math.max(r.eeg, r.dv) * 1.1 || 1;
  const hoehe = (v) => `${(v / maxWert) * 100}%`;

  // Monatsgrafik
  const mittelMuster = MUSTER.reduce((a, b) => a + b, 0) / MUSTER.length;
  const monate = MUSTER.map((m) => (m / mittelMuster) * mw);
  const mMax = Math.max(r.aw, ...monate) * 1.15;
  const W = 1000, H = 280, PL = 8, PR = 8, PT = 26, PB = 30;
  const bw = (W - PL - PR) / 12;
  const y = (v) => PT + (H - PT - PB) * (1 - v / mMax);

  const fill = (v, min, max) => ({ "--ov-fill": `${((v - min) / (max - min)) * 100}%` });

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-2 border-b border-ink-100 p-6 md:p-8">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Interaktiv · Beispielrechnung</p>
        <h3 className="ov-h3 text-ink-900">EEG-Vergütung oder Direktvermarktung – was bringt mehr?</h3>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* Eingaben */}
        <div className="space-y-6 border-b border-ink-100 p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${id}-kwp`} className="text-[14px] font-medium text-ink-700">Anlagenleistung</label>
              <output htmlFor={`${id}-kwp`} className="ov-num font-display text-[18px] font-extrabold text-ink-900">{zahl(kwp)} kWp</output>
            </div>
            <input id={`${id}-kwp`} type="range" min={5} max={100} step={1} value={kwp} onChange={(e) => setKwp(Number(e.target.value))} className="ov-range my-4 block cursor-pointer" style={fill(kwp, 5, 100)} />
            <p className="text-[12.5px] text-ink-500">Über 100 kWp ist die Direktvermarktung für neue Anlagen Pflicht.</p>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${id}-eigen`} className="text-[14px] font-medium text-ink-700">Eigenverbrauch</label>
              <output htmlFor={`${id}-eigen`} className="ov-num font-display text-[18px] font-extrabold text-ink-900">{zahl(eigen)} %</output>
            </div>
            <input id={`${id}-eigen`} type="range" min={0} max={80} step={5} value={eigen} onChange={(e) => setEigen(Number(e.target.value))} className="ov-range my-4 block cursor-pointer" style={fill(eigen, 0, 80)} />
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${id}-mw`} className="text-[14px] font-medium text-ink-700">Marktwert Solar (Jahresmittel)</label>
              <output htmlFor={`${id}-mw`} className="ov-num font-display text-[18px] font-extrabold text-ink-900">{zahl(mw, 1)} ct</output>
            </div>
            <input id={`${id}-mw`} type="range" min={1} max={14} step={0.1} value={mw} onChange={(e) => setMw(Number(e.target.value))} className="ov-range my-4 block cursor-pointer" style={fill(mw, 1, 14)} />
            <p className="text-[12.5px] text-ink-500">Durchschnittlicher Börsenwert von Solarstrom – schwankt je nach Monat und Jahr.</p>
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-sand-50 px-4 py-3 ring-1 ring-ink-200/60">
            <span className="flex items-center gap-3 text-[14.5px] font-medium text-ink-800">
              <BatteryCharging aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-600" />
              Einspeisung in teure Stunden verschieben (Speicher/EMS)
            </span>
            <input type="checkbox" checked={optimiert} onChange={(e) => setOptimiert(e.target.checked)} className="peer sr-only" />
            <span aria-hidden="true" className="relative h-7 w-12 shrink-0 rounded-full bg-ink-300 transition-colors peer-checked:bg-ov-500 peer-focus-visible:ring-4 peer-focus-visible:ring-ov-500/30 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
          </label>
        </div>

        {/* Ergebnis */}
        <div className="flex flex-col p-6 md:p-8">
          <div className="grid grid-cols-[1fr_1fr] items-end gap-4 sm:gap-8" style={{ height: 260 }} role="img" aria-label={`Jahreserlös: EEG-Vergütung ${eur(r.eeg)}, Direktvermarktung ${eur(r.dv)}`}>
            <Balken titel="Feste EEG-Vergütung" summe={r.eeg}>
              <div className="w-full rounded-t-xl bg-navy-700 transition-[height] duration-500" style={{ height: hoehe(r.eeg) }} />
            </Balken>
            <Balken titel="Direktvermarktung (nach Entgelt)" summe={r.dv} gruen>
              <div className="flex w-full flex-col transition-[height] duration-500" style={{ height: hoehe(Math.max(r.dv, 0)) }}>
                {praemieNetto > 0.5 && (
                  <div className="w-full rounded-t-xl bg-ov-200 transition-[height] duration-500" style={{ height: `${(praemieNetto / (boerseNetto + praemieNetto)) * 100}%` }} />
                )}
                <div className={`w-full flex-1 bg-ov-500 ${praemieNetto > 0.5 ? "border-t-2 border-white" : "rounded-t-xl"}`} />
              </div>
            </Balken>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-600">
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-navy-700" />EEG-Vergütung ({zahl(r.satz, 2)} ct)</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-500" />Börsenerlös</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-200" />Marktprämie</li>
          </ul>

          <div aria-live="polite" className={`mt-6 rounded-3xl p-5 ${r.diff > 1 ? "bg-navy-950 text-white" : "bg-ink-50 text-ink-800 ring-1 ring-ink-200/60"}`}>
            <p className={`flex items-center gap-2 text-[13px] ${r.diff > 1 ? "text-white/60" : "text-ink-500"}`}>
              {r.diff > 1 ? <TrendingUp aria-hidden="true" className="h-4 w-4 text-ov-300" /> : <Scale aria-hidden="true" className="h-4 w-4" />}
              Unterschied pro Jahr
            </p>
            <p className="ov-num mt-1 font-display text-[30px] font-extrabold leading-tight tracking-tight">
              {Math.abs(r.diff) < 1 ? "±" : r.diff > 0 ? "+" : "−"}{eur(Math.abs(r.diff))}
            </p>
            <p className={`mt-1 text-[14px] leading-relaxed ${r.diff > 1 ? "text-white/70" : "text-ink-600"}`}>
              {r.diff > 1
                ? mw > r.aw
                  ? "Der Marktwert liegt über dem anzulegenden Wert – den Mehrerlös behalten Sie."
                  : "Die Marktprämie sichert den anzulegenden Wert ab, die optimierte Einspeisung bringt den Mehrerlös."
                : "Liegt der Marktwert unter dem anzulegenden Wert, füllt die Marktprämie auf – Sie landen etwa auf dem Niveau der EEG-Vergütung."}
            </p>
          </div>
        </div>
      </div>

      {/* So funktioniert die Marktprämie */}
      <div className="relative border-t border-ink-100 p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[15px] font-semibold text-ink-900">So füllt die Marktprämie Monat für Monat auf</p>
          <p className="text-[12.5px] text-ink-500">Beispielverlauf des Monatsmarktwerts, ct/kWh</p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[600px]" role="img" aria-label={`Monatsmarktwert Solar im Beispiel und anzulegender Wert von ${zahl(r.aw, 2)} ct je kWh`} onMouseLeave={() => setMonatHover(null)}>
            {monate.map((m, i) => {
              const x = PL + i * bw;
              const praemie = Math.max(0, r.aw - m);
              return (
                <g key={MONATE[i]} onMouseEnter={() => setMonatHover(i)}>
                  <rect x={x} y={PT} width={bw} height={H - PT - PB} fill={monatHover === i ? "#f4f6f9" : "transparent"} />
                  <rect x={x + 10} y={y(m)} width={bw - 20} height={y(0) - y(m)} rx="3" fill="#669933" style={{ transition: "y 400ms, height 400ms" }} />
                  {praemie > 0 && (
                    <rect x={x + 10} y={y(r.aw)} width={bw - 20} height={Math.max(y(m) - y(r.aw) - 2, 0)} rx="3" fill="#cde3b1" style={{ transition: "y 400ms, height 400ms" }} />
                  )}
                  <text x={x + bw / 2} y={H - 8} textAnchor="middle" className="fill-ink-500 text-[12px]">{MONATE[i]}</text>
                </g>
              );
            })}
            <line x1={PL} x2={W - PR} y1={y(r.aw)} y2={y(r.aw)} stroke="#003473" strokeWidth="1.5" strokeDasharray="5 5" />
            <text x={W - PR} y={y(r.aw) - 7} textAnchor="end" className="fill-navy-700 text-[12px] font-semibold">anzulegender Wert {zahl(r.aw, 2)} ct</text>
            <line x1={PL} x2={W - PR} y1={y(0)} y2={y(0)} stroke="#9aa3b2" strokeWidth="1" />
          </svg>
        </div>
        {monatHover != null && (
          <div className="pointer-events-none absolute right-8 top-16 rounded-xl bg-ink-900 px-4 py-3 text-[12.5px] text-white shadow-xl">
            <p className="font-semibold">{MONATE[monatHover]} (Beispiel)</p>
            <p className="text-white/70">Marktwert <span className="ov-num text-white">{zahl(monate[monatHover], 2)} ct</span></p>
            <p className="text-white/70">Marktprämie <span className="ov-num text-white">{zahl(Math.max(0, r.aw - monate[monatHover]), 2)} ct</span></p>
          </div>
        )}
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-600">
          <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-500" />Marktwert Solar (Börse)</li>
          <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-200" />Marktprämie</li>
          <li className="flex items-center gap-2"><span className="h-0 w-4 border-t-2 border-dashed border-navy-700" />Anzulegender Wert</li>
        </ul>
      </div>

      <p className="flex gap-2 border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
        <span>
          Beispielrechnung zur Orientierung, Stand September 2026: Vergütungssätze für Teileinspeisung bei Inbetriebnahme ab 01.08.2026, anteilig nach Leistungsstufen; anzulegender Wert = Vergütung + {zahl(AUFSCHLAG_AW, 1)} ct;
          Vermarktungsentgelt {zahl(ENTGELT, 1)} ct/kWh (Beispiel); {zahl(ERTRAG)} kWh je kWp; optimierte Einspeisung +{zahl((OPTIMIERUNG - 1) * 100)} % Börsenerlös. In Stunden mit negativen Preisen entfällt die Förderung für neue Anlagen in beiden Modellen. Vertragsdetails des Direktvermarkters können abweichen.
        </span>
      </p>
    </div>
  );
}

function Balken({ titel, summe, gruen, children }) {
  return (
    <div className="flex h-full flex-col items-center justify-end">
      <p className={`ov-num mb-2 font-display text-[20px] font-extrabold tracking-tight sm:text-[24px] ${gruen ? "text-ov-700" : "text-ink-900"}`}>{eur(summe)}</p>
      <div className="flex min-h-0 w-full max-w-[160px] flex-1 items-end">{children}</div>
      <p className="mt-3 text-center text-[13px] font-medium leading-snug text-ink-600">{titel}</p>
    </div>
  );
}
