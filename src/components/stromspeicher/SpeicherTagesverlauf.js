"use client";

import { useMemo, useState } from "react";
import { BatteryCharging, Sun, PlugZap, Home } from "lucide-react";

/**
 * Interaktiver Tagesverlauf: Wohin fließt der Solarstrom – mit und ohne Speicher?
 * Beispieltag im Frühjahr: 10 kWp, 4.500 kWh Jahresverbrauch, 8 kWh Speicher.
 * Vereinfachte Stundenbilanz, als Veranschaulichung gekennzeichnet.
 */

const FARBEN = {
  direkt: "#669933",
  laden: "#f5b82e",
  einspeisung: "#cde3b1",
  speicher: "#1f5aa1",
  netz: "#c4cad5",
};

// Erzeugung kWh je Stunde (Summe ≈ 31 kWh) und Verbrauch (Summe ≈ 13 kWh)
const PV = Array.from({ length: 24 }, (_, h) => {
  const x = (h + 0.5 - 13.2) / 2.9;
  return h < 6 || h > 20 ? 0 : +(4.3 * Math.exp(-0.5 * x * x)).toFixed(2);
});
const LAST = [0.3, 0.25, 0.25, 0.25, 0.25, 0.3, 0.55, 0.9, 0.8, 0.55, 0.45, 0.5, 0.75, 0.6, 0.45, 0.45, 0.55, 0.85, 1.25, 1.3, 1.1, 0.8, 0.55, 0.4];

function simuliere(kapazitaet) {
  let soc = kapazitaet * 0.1;
  return PV.map((pv, h) => {
    const last = LAST[h];
    const direkt = Math.min(pv, last);
    const ueberschuss = pv - direkt;
    const laden = Math.min(ueberschuss * 0.95, kapazitaet - soc);
    soc += laden;
    const einspeisung = ueberschuss - laden / 0.95;
    const bedarf = last - direkt;
    const entladen = Math.min(bedarf, soc);
    soc -= entladen;
    const netz = bedarf - entladen;
    return { h, pv, last, direkt, laden: laden / 0.95, einspeisung: Math.max(einspeisung, 0), speicher: entladen, netz, soc };
  });
}

const fmt = (n, s = 1) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

export default function SpeicherTagesverlauf() {
  const [mitSpeicher, setMitSpeicher] = useState(true);
  const [hover, setHover] = useState(null);

  const daten = useMemo(() => simuliere(mitSpeicher ? 8 : 0), [mitSpeicher]);
  const summe = (k) => daten.reduce((a, d) => a + d[k], 0);
  const pvSumme = summe("pv");
  const lastSumme = summe("last");
  const eigen = summe("direkt") + summe("laden");
  const autark = summe("direkt") + summe("speicher");
  const eigenQuote = eigen / pvSumme;
  const autarkie = autark / lastSumme;

  const W = 720, H = 300, PAD_L = 34, PAD_B = 28, PAD_T = 10;
  const maxY = 4.5;
  const bw = (W - PAD_L) / 24;
  const y = (v) => PAD_T + (H - PAD_T - PAD_B) * (1 - v / maxY);

  const segmente = (d) => {
    const reihen = ["direkt", "speicher", "netz", "laden", "einspeisung"];
    let basis = 0;
    return reihen
      .map((k) => {
        const v = d[k];
        if (v < 0.005) return null;
        const seg = { k, y0: basis, y1: basis + v };
        basis += v;
        return seg;
      })
      .filter(Boolean);
  };

  const aktiv = hover != null ? daten[hover] : null;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-5 border-b border-ink-100 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Interaktiv · Beispieltag im Frühjahr</p>
          <h3 className="ov-h3 mt-2 text-ink-900">Wohin fließt Ihr Solarstrom?</h3>
        </div>
        <div role="radiogroup" aria-label="Szenario" className="inline-flex rounded-full bg-ink-100 p-1">
          {[
            { v: false, l: "Ohne Speicher" },
            { v: true, l: "Mit 8-kWh-Speicher" },
          ].map((o) => (
            <button
              key={o.l}
              type="button"
              role="radio"
              aria-checked={mitSpeicher === o.v}
              onClick={() => setMitSpeicher(o.v)}
              className={`h-10 rounded-full px-4 text-[14px] font-semibold transition-all duration-300 ${
                mitSpeicher === o.v ? "bg-white text-ink-900 shadow-md" : "text-ink-500 hover:text-ink-800"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="relative p-4 md:p-6">
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[520px]" role="img" aria-label={`Tagesverlauf ${mitSpeicher ? "mit" : "ohne"} Speicher: Eigenverbrauch ${Math.round(eigenQuote * 100)} Prozent, Autarkie ${Math.round(autarkie * 100)} Prozent`}>
              {[0, 1, 2, 3, 4].map((v) => (
                <g key={v}>
                  <line x1={PAD_L} x2={W} y1={y(v)} y2={y(v)} stroke="#eef0f4" strokeWidth="1" />
                  <text x={PAD_L - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-400 text-[11px]">{v}</text>
                </g>
              ))}
              <text x={4} y={PAD_T + 4} className="fill-ink-400 text-[10px]">kWh</text>
              {daten.map((d, i) => {
                const x = PAD_L + i * bw;
                return (
                  <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                    <rect x={x} y={PAD_T} width={bw} height={H - PAD_T - PAD_B} fill={hover === i ? "#f7f8fa" : "transparent"} />
                    {segmente(d).map((s) => (
                      <rect
                        key={s.k}
                        x={x + 2}
                        y={y(s.y1) + 1}
                        width={bw - 4}
                        height={Math.max(y(s.y0) - y(s.y1) - 2, 0.5)}
                        rx="3"
                        fill={FARBEN[s.k]}
                        style={{ transition: "y 500ms cubic-bezier(.22,1,.36,1), height 500ms cubic-bezier(.22,1,.36,1)" }}
                      />
                    ))}
                    {i % 3 === 0 && (
                      <text x={x + bw / 2} y={H - 8} textAnchor="middle" className="fill-ink-400 text-[11px]">{`${String(i).padStart(2, "0")}h`}</text>
                    )}
                  </g>
                );
              })}
              {/* Verbrauchslinie */}
              <polyline
                fill="none"
                stroke="#151a24"
                strokeWidth="2"
                strokeDasharray="4 4"
                points={daten.map((d, i) => `${PAD_L + i * bw + bw / 2},${y(d.last)}`).join(" ")}
              />
            </svg>
          </div>

          {aktiv && (
            <div className="pointer-events-none absolute right-6 top-6 rounded-xl bg-ink-900 px-4 py-3 text-[12.5px] text-white shadow-xl">
              <p className="font-semibold">{String(aktiv.h).padStart(2, "0")}:00 – {String(aktiv.h + 1).padStart(2, "0")}:00 Uhr</p>
              <p className="mt-1 text-white/70">Erzeugung <span className="ov-num text-white">{fmt(aktiv.pv, 2)} kWh</span></p>
              <p className="text-white/70">Verbrauch <span className="ov-num text-white">{fmt(aktiv.last, 2)} kWh</span></p>
              {mitSpeicher && <p className="text-white/70">Speicherstand <span className="ov-num text-white">{fmt(aktiv.soc, 1)} kWh</span></p>}
            </div>
          )}

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 px-2 text-[13px] text-ink-600">
            {[
              ["direkt", "Direkt genutzt"],
              ["laden", "Speicher lädt"],
              ["einspeisung", "Einspeisung"],
              ["speicher", "Aus dem Speicher"],
              ["netz", "Netzbezug"],
            ].map(([k, l]) => (
              <li key={k} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-[3px]" style={{ background: FARBEN[k] }} />
                {l}
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span className="h-0 w-4 border-t-2 border-dashed border-ink-900" />
              Verbrauch
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-px bg-ink-100 lg:grid-cols-1">
          <Kennzahl icon={Home} label="Autarkie an diesem Tag" wert={`${Math.round(autarkie * 100)} %`} gross />
          <Kennzahl icon={Sun} label="Eigenverbrauchsquote" wert={`${Math.round(eigenQuote * 100)} %`} gross />
          <Kennzahl icon={PlugZap} label="Netzbezug" wert={`${fmt(summe("netz"))} kWh`} />
          <Kennzahl icon={BatteryCharging} label="Eingespeist" wert={`${fmt(summe("einspeisung"))} kWh`} />
        </div>
      </div>
      <p className="border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        Vereinfachte Veranschaulichung (Stundenwerte, sonniger Frühjahrstag, 95 % Ladewirkungsgrad). Ihre tatsächlichen Werte berechnen wir im{" "}
        <a href="/rechner/stromspeicher" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">Stromspeicher-Rechner</a>.
      </p>
    </div>
  );
}

function Kennzahl({ icon: Icon, label, wert, gross }) {
  return (
    <div className="bg-white p-5 md:p-6">
      <p className="flex items-center gap-2 text-[13px] text-ink-500">
        <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
        {label}
      </p>
      <p className={`ov-num mt-1.5 font-display font-extrabold tracking-tight text-ink-900 transition-all ${gross ? "text-[34px]" : "text-[22px]"}`}>{wert}</p>
    </div>
  );
}
