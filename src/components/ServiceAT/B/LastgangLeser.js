"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, CalendarDays, Gauge, Sun, TrendingUp } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * „So lesen wir Ihren Lastgang“ – animierte Illustration einer Beispielwoche in
 * Viertelstundenwerten (7 × 96 Werte). Vier Schritte heben nacheinander Grundlast,
 * Lastspitze, PV-Gleichzeitigkeit und Wochenprofil hervor. Illustrativ, keine Messung.
 */

const TAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const PRO_TAG = 96;
const WOLKEN = [1, 0.55, 0.9, 1, 0.45, 0.95, 1]; // Tagesfaktor PV (Beispielwetter)

// deterministisches „Rauschen“
const rausch = (i) => Math.sin(i * 12.9898) * 43758.5453 - Math.floor(Math.sin(i * 12.9898) * 43758.5453);

function erzeugeWoche() {
  const last = [];
  const pv = [];
  for (let d = 0; d < 7; d++) {
    const wochenende = d >= 5;
    for (let q = 0; q < PRO_TAG; q++) {
      const h = q / 4;
      const i = d * PRO_TAG + q;
      let l = 62 + rausch(i) * 8; // Grundlast
      if (!wochenende) {
        if (h >= 5.5 && h < 6.5) l += (h - 5.5) * 170;
        else if (h >= 6.5 && h < 16.5) l += 170 + Math.sin(((h - 6.5) / 10) * Math.PI) * 45 - (h >= 12 && h < 12.75 ? 55 : 0);
        else if (h >= 16.5 && h < 18) l += 170 - (h - 16.5) * 95;
        else if (h >= 18 && h < 22) l += 20;
        l += rausch(i + 999) * 18;
      } else if (d === 5 && h >= 7 && h < 12) {
        l += 45 + rausch(i + 555) * 10; // Samstag Vormittag
      }
      if (d === 1 && q >= 29 && q <= 30) l += 150; // Anlaufspitze Dienstag ~7:15
      last.push(Math.max(40, l));
      const sonne = h > 6 && h < 20 ? Math.pow(Math.sin(((h - 6) / 14) * Math.PI), 1.6) : 0;
      pv.push(195 * sonne * WOLKEN[d] * (0.92 + rausch(i + 77) * 0.08));
    }
  }
  return { last, pv };
}

const SCHRITTE = [
  {
    k: "grund",
    icon: Gauge,
    titel: "Grundlast",
    frage: "Was läuft immer – auch nachts und am Wochenende?",
    hebel: "Standby-Verbraucher, Druckluftleckagen, Kühlung; Richtgröße für den PV-Eigenverbrauch.",
  },
  {
    k: "spitze",
    icon: TrendingUp,
    titel: "Lastspitzen",
    frage: "Wann und wodurch entsteht die Höchstleistung?",
    hebel: "Leistungspreis senken durch Lastmanagement oder Speicher (Peak Shaving).",
  },
  {
    k: "pv",
    icon: Sun,
    titel: "Tagesprofil & PV",
    frage: "Wie passt der Verbrauch zur Sonnenkurve?",
    hebel: "Eigenverbrauchsquote, Ausrichtung (Süd oder Ost-West), Speichergröße.",
  },
  {
    k: "woche",
    icon: CalendarDays,
    titel: "Wochenprofil & Flexibilität",
    frage: "Was passiert am Wochenende – und was lässt sich verschieben?",
    hebel: "E-Flotte, Wärme- und Kältespeicher, Produktionsplanung, dynamische Tarife.",
  },
];

export default function LastgangLeser() {
  const { last, pv } = useMemo(erzeugeWoche, []);
  const [schritt, setSchritt] = useState(0);
  const [auto, setAuto] = useState(true);
  const [sichtbar, setSichtbar] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setSichtbar(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !sichtbar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setSchritt((s) => (s + 1) % SCHRITTE.length), 4200);
    return () => clearInterval(t);
  }, [auto, sichtbar]);

  const W = 700;
  const H = 240;
  const n = last.length;
  const max = 400;
  const x = (i) => (i / (n - 1)) * W;
  const y = (v) => H - (v / max) * (H - 16);
  const linie = last.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const pvLinie = pv.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  // Eigenverbrauch = min(Last, PV)
  const eigen = last.map((v, i) => Math.min(v, pv[i]));
  const eigenFlaeche = `${eigen.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("")}L${W},${H}L0,${H}Z`;

  const grund = Math.round(last.filter((_, i) => { const h = (i % PRO_TAG) / 4; return h < 4; }).reduce((a, b) => a + b, 0) / (7 * 16));
  let spitzeI = 0;
  last.forEach((v, i) => {
    if (v > last[spitzeI]) spitzeI = i;
  });
  const eigenSumme = eigen.reduce((a, b) => a + b, 0) / 4;
  const pvSumme = pv.reduce((a, b) => a + b, 0) / 4;
  const quote = Math.round((eigenSumme / pvSumme) * 100);
  const s = SCHRITTE[schritt].k;

  return (
    <div ref={ref} className="overflow-hidden rounded-[2rem] bg-white text-ink-900 shadow-2xl ring-1 ring-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="min-w-0 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
              <Activity aria-hidden="true" className="h-4 w-4" />
              Beispiel-Lastgang · 1 Woche · 672 Viertelstunden
            </p>
            <ul className="flex flex-wrap gap-3 text-[12.5px] text-ink-600" aria-label="Legende">
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-0.5 w-4 rounded bg-navy-500" />
                Verbrauch
              </li>
              <li className={cn("flex items-center gap-1.5 transition-opacity", s === "pv" ? "opacity-100" : "opacity-40")}>
                <span aria-hidden="true" className="h-0.5 w-4 rounded bg-sun-500" />
                PV-Erzeugung
              </li>
              <li className={cn("flex items-center gap-1.5 transition-opacity", s === "pv" ? "opacity-100" : "opacity-40")}>
                <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-ov-400/50" />
                Eigenverbrauch
              </li>
            </ul>
          </div>

          <div className="mt-4 rounded-2xl bg-sand-50 p-2 ring-1 ring-ink-200/60 sm:p-3">
            <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-[220px] w-full sm:h-[280px]" role="img" aria-label="Beispiel-Lastgang einer Woche mit Grundlast, Lastspitze, PV-Erzeugung und Wochenende">
              {/* Tagestrenner */}
              {TAGE.map((t, d) => (
                <line key={t} x1={x(d * PRO_TAG)} x2={x(d * PRO_TAG)} y1="0" y2={H} stroke="#dfe3ea" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              ))}
              {/* Wochenende */}
              <rect x={x(5 * PRO_TAG)} y="0" width={W - x(5 * PRO_TAG)} height={H} fill={s === "woche" ? "rgba(102,153,51,0.14)" : "transparent"} className="transition-all duration-700" />
              {/* Grundlast-Band */}
              <rect x="0" y={y(grund + 12)} width={W} height={y(0) - y(grund + 12)} fill={s === "grund" ? "rgba(31,90,161,0.16)" : "transparent"} className="transition-all duration-700" />
              <line x1="0" x2={W} y1={y(grund)} y2={y(grund)} stroke="#1f5aa1" strokeDasharray="5 5" strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity={s === "grund" ? 1 : 0} className="transition-opacity duration-500" />
              {/* Eigenverbrauch + PV */}
              <path d={eigenFlaeche} fill="rgba(140,186,88,0.45)" opacity={s === "pv" ? 1 : 0} className="transition-opacity duration-700" />
              <path d={pvLinie} fill="none" stroke="#f5a70f" strokeWidth="1.8" vectorEffect="non-scaling-stroke" opacity={s === "pv" ? 1 : 0.18} className="transition-opacity duration-700" />
              {/* Verbrauch */}
              <path d={linie} fill="none" stroke="#1f5aa1" strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
              {/* Spitze */}
              <line x1={x(spitzeI)} x2={x(spitzeI)} y1={y(last[spitzeI])} y2={H} stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" opacity={s === "spitze" ? 1 : 0} className="transition-opacity duration-500" />
              <line x1="0" x2={W} y1={y(last[spitzeI])} y2={y(last[spitzeI])} stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" opacity={s === "spitze" ? 0.6 : 0} className="transition-opacity duration-500" />
            </svg>
            {/* Markierungen in HTML (unverzerrt) */}
            <span
              className={cn("pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red-600 shadow-lg transition-opacity duration-500", s === "spitze" ? "opacity-100" : "opacity-0")}
              style={{ left: `${(spitzeI / (n - 1)) * 100}%`, top: `${(y(last[spitzeI]) / H) * 100}%` }}
            />
            <span className={cn("absolute left-4 rounded-full bg-navy-700 px-2.5 py-1 text-[12px] font-semibold text-white shadow transition-opacity duration-500", s === "grund" ? "opacity-100" : "opacity-0")} style={{ bottom: "18%" }}>
              Grundlast ≈ {grund} kW
            </span>
            <span className={cn("absolute right-4 top-4 rounded-full bg-red-600 px-2.5 py-1 text-[12px] font-semibold text-white shadow transition-opacity duration-500", s === "spitze" ? "opacity-100" : "opacity-0")}>
              Wochenspitze {Math.round(last[spitzeI])} kW · Di 07:15
            </span>
            <span className={cn("absolute right-4 top-4 rounded-full bg-ov-600 px-2.5 py-1 text-[12px] font-semibold text-white shadow transition-opacity duration-500", s === "pv" ? "opacity-100" : "opacity-0")}>
              Eigenverbrauchsquote ≈ {quote} %
            </span>
            <span className={cn("absolute right-4 top-4 rounded-full bg-ov-700 px-2.5 py-1 text-[12px] font-semibold text-white shadow transition-opacity duration-500", s === "woche" ? "opacity-100" : "opacity-0")}>
              Wochenende: PV-Überschuss
            </span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-7 text-center text-[12px] font-semibold text-ink-500">
            {TAGE.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col border-t border-ink-100 bg-sand-50 p-5 sm:p-7 lg:border-l lg:border-t-0">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">So lesen wir Ihren Lastgang</p>
          <ol className="mt-4 grid gap-2">
            {SCHRITTE.map((st, i) => {
              const an = i === schritt;
              return (
                <li key={st.k}>
                  <button
                    type="button"
                    aria-pressed={an}
                    onClick={() => {
                      setAuto(false);
                      setSchritt(i);
                    }}
                    className={cn("w-full rounded-2xl p-4 text-left transition-all duration-300", an ? "bg-navy-950 text-white shadow-lg" : "bg-white ring-1 ring-ink-200/70 hover:ring-ov-300")}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", an ? "bg-ov-500 text-white" : "bg-ov-50 text-ov-600")}>
                        <st.icon aria-hidden="true" className="h-4.5 w-4.5" />
                      </span>
                      <span className="font-display text-[16px] font-bold">
                        <span className={cn("mr-1.5 text-[13px]", an ? "text-ov-300" : "text-ov-700")}>{String(i + 1).padStart(2, "0")}</span>
                        {st.titel}
                      </span>
                    </span>
                    {an && (
                      <span className="sb-ein mt-3 block text-[14px] leading-relaxed">
                        <span className="block text-white/85">{st.frage}</span>
                        <span className="mt-1.5 block text-white/60">Hebel: {st.hebel}</span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-[12px] leading-relaxed text-ink-500 lg:mt-auto lg:pt-4">
            Illustration mit Beispielwerten eines Produktionsbetriebs (ca. 300 kWp PV, wechselhaftes Wetter) – Ihre Auswertung basiert auf Ihren echten Viertelstundenwerten.
          </p>
        </div>
      </div>
    </div>
  );
}
