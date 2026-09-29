"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Info, TrendingDown, Zap } from "lucide-react";
import { Regler, Zahl } from "@/components/Rechner/bausteine";

/**
 * Peak Shaving zum Anfassen: Beispiel-Lastgang eines Gewerbebetriebs in
 * Viertelstunden. Der Schwellwert zeigt, welche Spitzen der Speicher kappen
 * muss und wie viel Energie und Entladeleistung dafür nötig sind.
 * Bewusst ohne Euro-Beträge: Der Leistungspreis hängt von Netzbetreiber und Netzebene ab.
 */

// 96 Viertelstunden: Grundlast nachts, Schichtbeginn 6:00 mit Anlaufspitzen, Mittag, zweite Spitze 13:00
const LAST = Array.from({ length: 96 }, (_, q) => {
  const h = q / 4;
  let p = 120;
  if (h >= 5.5 && h < 22) p = 160 + 150 * Math.min(1, (h - 5.5) / 1.2);
  if (h >= 16.5 && h < 22) p = 310 - 150 * Math.min(1, (h - 16.5) / 3);
  if (h >= 11.75 && h < 12.75) p -= 70;
  // Anlaufspitzen (Maschinen, Kompressoren)
  const spitze = (t, hoehe, breite) => hoehe * Math.exp(-0.5 * ((h - t) / breite) ** 2);
  p += spitze(6.25, 125, 0.18) + spitze(9.5, 45, 0.15) + spitze(13.1, 95, 0.16) + spitze(15.25, 40, 0.12);
  p += 12 * Math.sin(q * 1.7) + 8 * Math.sin(q * 0.63);
  return Math.round(p);
});
const MAX = Math.max(...LAST);
const B = 720;
const H = 260;
const x = (q) => (q / 95) * B;
const y = (p) => H - (p / (MAX * 1.08)) * H;

export default function PeakShavingDemo() {
  const [schwelle, setSchwelle] = useState(Math.round((MAX * 0.8) / 10) * 10);

  const r = useMemo(() => {
    let energie = 0;
    let laengste = 0;
    let lauf = 0;
    for (const p of LAST) {
      const ueber = Math.max(p - schwelle, 0);
      energie += ueber * 0.25;
      lauf = ueber > 0 ? lauf + 1 : 0;
      laengste = Math.max(laengste, lauf);
    }
    const leistung = Math.max(MAX - schwelle, 0);
    return { energie, leistung, prozent: (leistung / MAX) * 100, dauerMin: laengste * 15 };
  }, [schwelle]);

  const linie = LAST.map((p, q) => `${q ? "L" : "M"}${x(q).toFixed(1)} ${y(p).toFixed(1)}`).join("");
  const flaeche = `${linie}L${B} ${H}L0 ${H}Z`;
  const ys = y(schwelle);
  const gekappt = LAST.map((p, q) => `${q ? "L" : "M"}${x(q).toFixed(1)} ${y(Math.max(p, schwelle)).toFixed(1)}`).join("") + `L${B} ${ys.toFixed(1)}L0 ${ys.toFixed(1)}Z`;

  return (
    <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70 lg:grid-cols-[1.35fr_0.9fr]">
      <figure className="p-5 md:p-8">
        <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-display text-[17px] font-bold text-ink-900">Lastgang eines Werktags (Beispiel)</span>
          <span className="flex items-center gap-4 text-[12.5px] text-ink-500">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-navy-700" /> Netzbezug
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-sun-400" /> vom Speicher gedeckt
            </span>
          </span>
        </figcaption>
        <svg viewBox={`0 0 ${B} ${H + 26}`} className="h-auto w-full" role="img" aria-label={`Beispiel-Lastgang mit Spitze ${MAX} kW; Schwellwert ${schwelle} kW, Speicher deckt ${Math.round(r.energie)} kWh`}>
          <defs>
            <linearGradient id="ps-flaeche" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#003473" stopOpacity="0.35" />
              <stop offset="1" stopColor="#003473" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={B} y1={H * f} y2={H * f} stroke="#dfe3ea" strokeDasharray="3 5" />
          ))}
          <path d={flaeche} fill="url(#ps-flaeche)" />
          <path d={gekappt} fill="#ffc53d" fillOpacity="0.85" className="transition-all duration-300" />
          <path d={linie} fill="none" stroke="#003473" strokeWidth="2" strokeLinejoin="round" />
          <line x1="0" x2={B} y1={ys} y2={ys} stroke="#669933" strokeWidth="2.5" strokeDasharray="8 6" className="transition-all duration-300" />
          <rect x={B - 132} y={ys - 30} width="128" height="24" rx="12" fill="#669933" className="transition-all duration-300" />
          <text x={B - 68} y={ys - 13.5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">
            Grenze {schwelle} kW
          </text>
          {[0, 6, 12, 18, 24].map((h) => (
            <text key={h} x={Math.min(Math.max(x(h * 4), 12), B - 16)} y={H + 20} textAnchor="middle" fill="#6b7486" fontSize="12">
              {h}:00
            </text>
          ))}
        </svg>
        <div className="mt-4">
          <Regler label="Bezugsgrenze am Netzanschluss" wert={schwelle} min={Math.round((MAX * 0.6) / 10) * 10} max={MAX} step={5} einheit="kW" onChange={setSchwelle} />
        </div>
      </figure>

      <div className="ov-noise relative isolate flex flex-col overflow-hidden bg-navy-950 p-6 text-white md:p-8">
        <div aria-hidden="true" className="absolute -bottom-24 -right-16 -z-10 h-72 w-72 rounded-full bg-sun-400/20 blur-[110px]" />
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">Was der Speicher leisten muss</p>
        <dl className="mt-6 space-y-5">
          <div>
            <dt className="flex items-center gap-2 text-[13px] text-white/60">
              <TrendingDown aria-hidden="true" className="h-4 w-4 text-ov-300" /> Spitze gesenkt um
            </dt>
            <dd className="mt-1 font-display text-[36px] font-extrabold leading-none tracking-tight">
              <Zahl wert={r.leistung} /> kW <span className="text-[18px] font-bold text-ov-300">−<Zahl wert={r.prozent} /> %</span>
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
              <dt className="flex items-center gap-1.5 text-[12.5px] text-white/60">
                <Zap aria-hidden="true" className="h-3.5 w-3.5 text-sun-300" /> Entladeleistung
              </dt>
              <dd className="mt-1 font-display text-[22px] font-extrabold">
                <Zahl wert={r.leistung} /> kW
              </dd>
            </div>
            <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
              <dt className="flex items-center gap-1.5 text-[12.5px] text-white/60">
                <BatteryCharging aria-hidden="true" className="h-3.5 w-3.5 text-sun-300" /> Energie je Tag
              </dt>
              <dd className="mt-1 font-display text-[22px] font-extrabold">
                <Zahl wert={r.energie} /> kWh
              </dd>
            </div>
          </div>
        </dl>
          <p className="mt-5 text-[14px] leading-relaxed text-white/70">
            Längster Einsatz am Stück: <strong className="ov-num text-white">{r.dauerMin} Minuten</strong>. Je tiefer die Grenze, desto stärker wächst der Speicher – das Optimum liegt meist dort, wo wenige kurze Spitzen verschwinden.
          </p>
        <Link href="/rechner/peak-shaving" className="group mt-auto flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-white px-5 text-[15px] font-semibold text-navy-950 transition-colors hover:bg-ov-50">
          Peak-Shaving-Rechner öffnen
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <p className="mt-4 flex gap-2 text-[12px] leading-relaxed text-white/45">
          <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Vereinfachter Beispiel-Lastgang, kein Kundendatensatz. Ohne Reserve, Wirkungsgrad und Ladestrategie.
        </p>
      </div>
    </div>
  );
}
