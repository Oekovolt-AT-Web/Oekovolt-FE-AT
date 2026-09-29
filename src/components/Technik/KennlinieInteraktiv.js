"use client";

import { useId, useState } from "react";
import { Activity, Gauge, Info } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Interaktive Standardkennlinien nach TOR Stromerzeugungsanlagen (ohne
 * abweichende Vorgabe des Netzbetreibers):
 *  - Q(U): Stützpunkte a = 0,92 · b = 0,96 · c = 1,05 · d = 1,08 Un (Typ A V1.4 / Typ B V1.3, Kap. 5.3.4.2)
 *  - P(f) im LFSM-O: Schwelle 50,2 Hz, Statik 5 % (Kap. 5.1.3)
 * Der Schieberegler setzt die Netzspannung bzw. Netzfrequenz; angezeigt wird die
 * Reaktion laut Kennlinie. Normwerte, keine Produktdaten.
 */

const W = 560;
const H = 330;
const P = { l: 62, r: 20, t: 26, b: 52 };
const pw = W - P.l - P.r;
const ph = H - P.t - P.b;
const QMAX_PMAX_TYP_A = 0.436;

const zahl = (n, s = 2) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

function qVonU(u) {
  if (u <= 0.92) return 1;
  if (u < 0.96) return 1 - (u - 0.92) / 0.04;
  if (u <= 1.05) return 0;
  if (u < 1.08) return -(u - 1.05) / 0.03;
  return -1;
}
function pVonF(f) {
  if (f <= 50.2) return 1;
  return Math.max(0, 1 - 0.4 * (f - 50.2));
}

function Raster({ xTicks, yTicks, x, y, xLabel, yLabel }) {
  return (
    <g>
      {yTicks.map((t) => (
        <g key={`y${t.v}`}>
          <line x1={P.l} x2={P.l + pw} y1={y(t.v)} y2={y(t.v)} stroke={t.v === 0 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.08)"} />
          <text x={P.l - 10} y={y(t.v) + 4.5} textAnchor="end" fontSize="13" fill="rgba(255,255,255,0.55)">
            {t.l}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x${t.v}`}>
          <line x1={x(t.v)} x2={x(t.v)} y1={P.t} y2={P.t + ph} stroke="rgba(255,255,255,0.08)" />
          <text x={x(t.v)} y={P.t + ph + 20} textAnchor="middle" fontSize="12.5" fill="rgba(255,255,255,0.55)">
            {t.l}
          </text>
        </g>
      ))}
      <text x={P.l + pw} y={H - 8} textAnchor="end" fontSize="13" fontWeight="600" fill="rgba(255,255,255,0.85)">
        {xLabel}
      </text>
      <text x={10} y={P.t - 8} fontSize="13" fontWeight="600" fill="rgba(255,255,255,0.85)">
        {yLabel}
      </text>
    </g>
  );
}

function DiagrammQU({ u }) {
  const x = (v) => P.l + ((v - 0.9) / 0.2) * pw;
  const y = (q) => P.t + (1 - (q + 1) / 2) * ph;
  const linie = [
    [0.9, 1],
    [0.92, 1],
    [0.96, 0],
    [1.05, 0],
    [1.08, -1],
    [1.1, -1],
  ];
  const q = qVonU(u);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Q(U)-Kennlinie; aktueller Punkt bei U/Un ${zahl(u)} mit Q/Qmax ${zahl(q)}`}>
      <Raster
        x={x}
        y={y}
        xTicks={[0.9, 0.92, 0.96, 1, 1.05, 1.08, 1.1].map((v) => ({ v, l: zahl(v) }))}
        yTicks={[
          { v: 1, l: "+Qmax" },
          { v: 0, l: "0" },
          { v: -1, l: "−Qmax" },
        ]}
        xLabel="U / Un"
        yLabel="Q"
      />
      <rect x={x(0.96)} y={P.t} width={x(1.05) - x(0.96)} height={ph} fill="rgba(140,186,88,0.10)" />
      <text x={(x(0.96) + x(1.05)) / 2} y={y(0) - 12} textAnchor="middle" fontSize="12.5" fill="#aed083">
        Totband: cos φ = 1
      </text>
      <polyline points={linie.map(([a, b]) => `${x(a)},${y(b)}`).join(" ")} fill="none" stroke="#7fa7d6" strokeWidth="3" strokeLinejoin="round" />
      {[
        { n: "a", u: 0.92, q: 1 },
        { n: "b", u: 0.96, q: 0 },
        { n: "c", u: 1.05, q: 0 },
        { n: "d", u: 1.08, q: -1 },
      ].map((s) => (
        <g key={s.n}>
          <circle cx={x(s.u)} cy={y(s.q)} r="4.5" fill="#03122b" stroke="#7fa7d6" strokeWidth="2" />
          <text x={x(s.u) + (s.n === "a" || s.n === "c" ? 9 : -9)} y={y(s.q) + (s.q === -1 ? -10 : 20)} textAnchor={s.n === "a" || s.n === "c" ? "start" : "end"} fontSize="13" fontWeight="700" fill="rgba(255,255,255,0.8)">
            {s.n}
          </text>
        </g>
      ))}
      {/* Aktueller Betriebspunkt */}
      <line x1={x(u)} x2={x(u)} y1={P.t} y2={P.t + ph} stroke="#ffc53d" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1={P.l} x2={x(u)} y1={y(q)} y2={y(q)} stroke="#ffc53d" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      <circle cx={x(u)} cy={y(q)} r="14" fill="#ffc53d" opacity="0.22" />
      <circle cx={x(u)} cy={y(q)} r="7" fill="#ffc53d" stroke="#03122b" strokeWidth="2" />
    </svg>
  );
}

function DiagrammPF({ f }) {
  const x = (v) => P.l + ((v - 49.8) / 1.8) * pw;
  const y = (p) => P.t + (1 - p) * ph;
  const p = pVonF(f);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`P(f)-Kennlinie im LFSM-O; bei ${zahl(f)} Hz beträgt P/Pref ${Math.round(p * 100)} Prozent`}>
      <Raster
        x={x}
        y={y}
        xTicks={[49.8, 50, 50.2, 50.6, 51, 51.5].map((v) => ({ v, l: zahl(v, 1) }))}
        yTicks={[1, 0.75, 0.5, 0.25, 0].map((v) => ({ v, l: `${Math.round(v * 100)} %` }))}
        xLabel="f in Hz"
        yLabel="P / Pref"
      />
      <polyline
        points={[49.8, 50.2, 51.5].map((v) => `${x(v)},${y(pVonF(v))}`).join(" ")}
        fill="none"
        stroke="#8cba58"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text x={x(50.2) + 10} y={y(1) + 20} fontSize="12.5" fill="rgba(255,255,255,0.7)">
        Schwelle 50,2 Hz
      </text>
      <text x={x(51.5) - 4} y={y(0.48) + 22} textAnchor="end" fontSize="12.5" fill="rgba(255,255,255,0.7)">
        48 % bei 51,5 Hz
      </text>
      <line x1={x(f)} x2={x(f)} y1={P.t} y2={P.t + ph} stroke="#ffc53d" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1={P.l} x2={x(f)} y1={y(p)} y2={y(p)} stroke="#ffc53d" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      <circle cx={x(f)} cy={y(p)} r="14" fill="#ffc53d" opacity="0.22" />
      <circle cx={x(f)} cy={y(p)} r="7" fill="#ffc53d" stroke="#03122b" strokeWidth="2" />
    </svg>
  );
}

function Regler({ id, label, wert, min, max, step, onChange, anzeige, marken }) {
  const fill = ((wert - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14px] font-medium text-white/75">
          {label}
        </label>
        <output htmlFor={id} className="ov-num shrink-0 whitespace-nowrap font-display text-[20px] font-extrabold tracking-tight text-white">
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
        className="ov-range my-4 block cursor-pointer"
        style={{ "--ov-fill": `${fill}%` }}
      />
      {marken && (
        <div className="flex justify-between text-[11.5px] text-white/40" aria-hidden="true">
          {marken.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KennlinieInteraktiv() {
  const id = useId();
  const [ansicht, setAnsicht] = useState("qu");
  const [u, setU] = useState(1.07);
  const [f, setF] = useState(50.6);

  const q = qVonU(u);
  const zustand = q > 0 ? "übererregt – spannungsstützend" : q < 0 ? "untererregt – spannungssenkend" : "Totband – keine Blindleistung";
  const p = pVonF(f);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-navy-950 text-white shadow-2xl ring-1 ring-white/10">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-6">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Interaktiv · Standardkennlinien nach TOR</p>
        <div role="tablist" aria-label="Kennlinie wählen" className="inline-flex gap-1 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10">
          {[
            { k: "qu", l: "Q(U) – Spannung", icon: Gauge },
            { k: "pf", l: "P(f) – Frequenz", icon: Activity },
          ].map((t) => (
            <button
              key={t.k}
              type="button"
              role="tab"
              id={`${id}-${t.k}`}
              aria-selected={ansicht === t.k}
              aria-controls={`${id}-panel`}
              onClick={() => setAnsicht(t.k)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition-colors",
                ansicht === t.k ? "bg-white text-navy-950" : "text-white/70 hover:text-white"
              )}
            >
              <t.icon aria-hidden="true" className="h-4 w-4" />
              {t.l}
            </button>
          ))}
        </div>
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${ansicht}`} className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="p-4 md:p-7">{ansicht === "qu" ? <DiagrammQU u={u} /> : <DiagrammPF f={f} />}</div>

        <div className="flex flex-col gap-6 border-t border-white/10 p-6 md:p-8 lg:border-l lg:border-t-0">
          {ansicht === "qu" ? (
            <>
              <Regler
                id={`${id}-u`}
                label="Netzspannung am Anschlusspunkt"
                wert={u}
                min={0.9}
                max={1.1}
                step={0.005}
                onChange={setU}
                anzeige={`${zahl(u, 3)} Un`}
                marken={["0,90", "1,00", "1,10"]}
              />
              <div aria-live="polite" className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                  <p className="text-[12.5px] text-white/55">Blindleistung Q/Qmax</p>
                  <p className="ov-num mt-1 font-display text-[26px] font-extrabold tracking-tight text-sun-300">{q > 0 ? "+" : ""}{zahl(q)}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                  <p className="text-[12.5px] text-white/55">Q/Pmax bei Typ A</p>
                  <p className="ov-num mt-1 font-display text-[26px] font-extrabold tracking-tight">{q > 0 ? "+" : ""}{zahl(q * QMAX_PMAX_TYP_A, 3)}</p>
                </div>
              </div>
              <p className={cn("rounded-2xl px-4 py-3 text-[14.5px] font-semibold ring-1", q === 0 ? "bg-ov-500/15 text-ov-200 ring-ov-400/30" : "bg-sun-400/10 text-sun-300 ring-sun-400/30")}>
                {zustand}
                <span className="mt-0.5 block text-[12.5px] font-normal text-white/55">≈ {zahl(230 * u, 1)} V bei 230 V Nennspannung (Niederspannung, Leiter–Neutral)</span>
              </p>
              <p className="text-[13px] leading-relaxed text-white/55">
                Stützpunkte a = 0,92 · b = 0,96 · c = 1,05 · d = 1,08 Un; Dynamik PT1 mit τ = 5 s (einstellbar 3–60 s), 95 % des Sollwerts innerhalb 3 τ. Qmax/Pmax bei Typ A: 0,436.
              </p>
            </>
          ) : (
            <>
              <Regler
                id={`${id}-f`}
                label="Netzfrequenz"
                wert={f}
                min={49.8}
                max={51.5}
                step={0.01}
                onChange={setF}
                anzeige={`${zahl(f)} Hz`}
                marken={["49,8", "50,2", "51,5"]}
              />
              <div aria-live="polite" className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                  <p className="text-[12.5px] text-white/55">Wirkleistung P/Pref</p>
                  <p className="ov-num mt-1 font-display text-[26px] font-extrabold tracking-tight text-sun-300">{Math.round(p * 100)} %</p>
                </div>
                <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                  <p className="text-[12.5px] text-white/55">Reduktion</p>
                  <p className="ov-num mt-1 font-display text-[26px] font-extrabold tracking-tight">−{Math.round((1 - p) * 100)} %</p>
                </div>
              </div>
              <p className={cn("rounded-2xl px-4 py-3 text-[14.5px] font-semibold ring-1", p === 1 ? "bg-ov-500/15 text-ov-200 ring-ov-400/30" : "bg-sun-400/10 text-sun-300 ring-sun-400/30")}>
                {p === 1 ? "Unter der Schwelle – volle Wirkleistung" : "LFSM-O aktiv – Statik 5 % ≙ −40 % je Hz"}
                <span className="mt-0.5 block text-[12.5px] font-normal text-white/55">Dieser Sollwert hat nach TOR Vorrang vor allen anderen Wirkleistungsvorgaben.</span>
              </p>
              <p className="text-[13px] leading-relaxed text-white/55">
                Schwelle einstellbar 50,2–50,5 Hz, Statik 2–12 %; Standard 50,2 Hz und 5 %. Pref ist bei Umrichtern die Wirkleistung beim Erreichen der Schwelle. Messauflösung ≤ 10 mHz.
              </p>
            </>
          )}
        </div>
      </div>

      <p className="flex gap-2 border-t border-white/10 px-6 py-4 text-[12.5px] leading-relaxed text-white/50 md:px-8">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
        <span>
          Standardeinstellungen der TOR Stromerzeugungsanlagen ohne abweichende Vorgabe des Netzbetreibers. Viele Netzbetreiber schreiben eigene Stützpunkte, Verschiebungsfaktoren oder
          Zeitkonstanten vor – maßgeblich ist Ihr Netzanschlussvertrag.
        </span>
      </p>
    </div>
  );
}
