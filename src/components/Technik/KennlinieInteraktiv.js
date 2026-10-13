"use client";

import { useId, useState } from "react";
import { Activity, Gauge, Info, SlidersHorizontal, TrendingDown } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Interaktive Standardkennlinien nach TOR Stromerzeugungsanlagen (ohne
 * abweichende Vorgabe des Netzbetreibers):
 *  - Q(U): Stützpunkte a = 0,92 · b = 0,96 · c = 1,05 · d = 1,08 Un (Typ A V1.4 / Typ B V1.3, Kap. 5.3.4.2)
 *  - P(U): spannungsgeführte Wirkleistungsreduktion 110 % Un → 100 % Pn, 112 % Un → 0 % (Typ A V1.4, Umrichter im NS-Netz)
 *  - cos φ(P): P/Pmax 0 → 1; 0,5 → 1; 1,0 → 0,9 untererregt (Typ B V1.3, Kap. 5.3.4)
 *  - P(f) im LFSM-O: Schwelle 50,2 Hz, Statik 5 % (Kap. 5.1.3)
 * Der Schieberegler setzt die Netzgröße; angezeigt wird die Reaktion laut Kennlinie.
 * Bezugsgröße bei Typ A: Qmax = ±0,436·Sr (cos φ 0,9, bezogen auf die Bemessungsscheinleistung
 * Sr – nicht auf Pmax; bis 3,68 kVA 0,312·Sr). Normwerte, keine Produktdaten.
 */

const W = 560;
const H = 330;
const P = { l: 62, r: 20, t: 26, b: 52 };
const pw = W - P.l - P.r;
const ph = H - P.t - P.b;
/** Typ A: Qmax/Sr bei cos φ 0,9 (sin φ). Bezug ist Sr, nicht Pmax (TOR Typ A V1.4, Kap. 5.3.3). */
const QMAX_SR_TYP_A = 0.436;
/** Typ A, Einheiten bis 3,68 kVA: Qmax/Sr bei cos φ 0,95. */
const QMAX_SR_TYP_A_KLEIN = 0.312;

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
/** P(U): 110 % Un → 100 % Pn, 112 % Un → 0 %, linear dazwischen. */
function pVonU(u) {
  if (u <= 1.1) return 1;
  if (u >= 1.12) return 0;
  return 1 - (u - 1.1) / 0.02;
}
/** cos φ(P): bis 0,5 Pmax cos φ = 1, dann linear auf 0,9 untererregt bei 1,0 Pmax. */
function cosPhiVonP(p) {
  if (p <= 0.5) return 1;
  return 1 - ((p - 0.5) / 0.5) * 0.1;
}

function Raster({ xTicks, yTicks, x, y, xLabel, yLabel }) {
  return (
    <g>
      {yTicks.map((t) => (
        <g key={`y${t.v}`}>
          <line x1={P.l} x2={P.l + pw} y1={y(t.v)} y2={y(t.v)} stroke={t.v === 0 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.08)"} />
          <text x={P.l - 10} y={y(t.v) + 4.5} textAnchor="end" fontSize="13" fill="rgba(255,255,255,0.6)">
            {t.l}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x${t.v}`}>
          <line x1={x(t.v)} x2={x(t.v)} y1={P.t} y2={P.t + ph} stroke="rgba(255,255,255,0.08)" />
          <text x={x(t.v)} y={P.t + ph + 20} textAnchor="middle" fontSize="12.5" fill="rgba(255,255,255,0.6)">
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

function Betriebspunkt({ px, py, x0 }) {
  return (
    <>
      <line x1={px} x2={px} y1={P.t} y2={P.t + ph} stroke="#ffc53d" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1={x0} x2={px} y1={py} y2={py} stroke="#ffc53d" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      <circle cx={px} cy={py} r="14" fill="#ffc53d" opacity="0.22" />
      <circle cx={px} cy={py} r="7" fill="#ffc53d" stroke="#03122b" strokeWidth="2" />
    </>
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
      <Betriebspunkt px={x(u)} py={y(q)} x0={P.l} />
    </svg>
  );
}

function DiagrammPU({ u }) {
  const x = (v) => P.l + ((v - 1.0) / 0.15) * pw;
  const y = (p) => P.t + (1 - p) * ph;
  const p = pVonU(u);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`P(U)-Kennlinie; bei U/Un ${zahl(u, 3)} beträgt P/Pn ${Math.round(p * 100)} Prozent`}>
      <Raster
        x={x}
        y={y}
        xTicks={[1.0, 1.05, 1.1, 1.12, 1.15].map((v) => ({ v, l: zahl(v) }))}
        yTicks={[1, 0.75, 0.5, 0.25, 0].map((v) => ({ v, l: `${Math.round(v * 100)} %` }))}
        xLabel="U / Un"
        yLabel="P / Pn"
      />
      <rect x={x(1.1)} y={P.t} width={x(1.12) - x(1.1)} height={ph} fill="rgba(255,197,61,0.10)" />
      <polyline points={[1.0, 1.1, 1.12, 1.15].map((v) => `${x(v)},${y(pVonU(v))}`).join(" ")} fill="none" stroke="#8cba58" strokeWidth="3" strokeLinejoin="round" />
      <circle cx={x(1.1)} cy={y(1)} r="4.5" fill="#03122b" stroke="#8cba58" strokeWidth="2" />
      <text x={x(1.1) - 10} y={y(1) + 20} textAnchor="end" fontSize="12.5" fill="rgba(255,255,255,0.75)">
        110 % Un → 100 % Pn
      </text>
      <circle cx={x(1.12)} cy={y(0)} r="4.5" fill="#03122b" stroke="#8cba58" strokeWidth="2" />
      <text x={x(1.12) + 10} y={y(0) - 10} fontSize="12.5" fill="rgba(255,255,255,0.75)">
        112 % Un → 0 %
      </text>
      <Betriebspunkt px={x(u)} py={y(p)} x0={P.l} />
    </svg>
  );
}

function DiagrammCosPhiP({ p }) {
  const x = (v) => P.l + v * pw;
  const y = (c) => P.t + ((1 - c) / 0.12) * ph; // Achse 1,00 … 0,88
  const c = cosPhiVonP(p);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`cos φ(P)-Kennlinie; bei P/Pmax ${zahl(p)} beträgt cos φ ${zahl(c, 3)} ${c < 1 ? "untererregt" : ""}`}>
      <Raster
        x={x}
        y={y}
        xTicks={[0, 0.25, 0.5, 0.75, 1].map((v) => ({ v, l: zahl(v) }))}
        yTicks={[1, 0.95, 0.9].map((v) => ({ v, l: zahl(v) }))}
        xLabel="P / Pmax"
        yLabel="cos φ (untererregt)"
      />
      <polyline points={[0, 0.5, 1].map((v) => `${x(v)},${y(cosPhiVonP(v))}`).join(" ")} fill="none" stroke="#7fa7d6" strokeWidth="3" strokeLinejoin="round" />
      {[
        { v: 0, l: "0 → cos φ 1" },
        { v: 0.5, l: "0,5 → cos φ 1" },
        { v: 1, l: "1,0 → cos φ 0,9" },
      ].map((s) => (
        <g key={s.v}>
          <circle cx={x(s.v)} cy={y(cosPhiVonP(s.v))} r="4.5" fill="#03122b" stroke="#7fa7d6" strokeWidth="2" />
          <text x={x(s.v) + (s.v === 1 ? -10 : 10)} y={y(cosPhiVonP(s.v)) + (s.v === 1 ? -12 : 22)} textAnchor={s.v === 1 ? "end" : "start"} fontSize="12.5" fill="rgba(255,255,255,0.75)">
            {s.l}
          </text>
        </g>
      ))}
      <Betriebspunkt px={x(p)} py={y(c)} x0={P.l} />
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
      <polyline points={[49.8, 50.2, 51.5].map((v) => `${x(v)},${y(pVonF(v))}`).join(" ")} fill="none" stroke="#8cba58" strokeWidth="3" strokeLinejoin="round" />
      <text x={x(50.2) + 10} y={y(1) + 20} fontSize="12.5" fill="rgba(255,255,255,0.7)">
        Schwelle 50,2 Hz
      </text>
      <text x={x(51.5) - 4} y={y(0.48) + 22} textAnchor="end" fontSize="12.5" fill="rgba(255,255,255,0.7)">
        48 % bei 51,5 Hz
      </text>
      <Betriebspunkt px={x(f)} py={y(p)} x0={P.l} />
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
      <input id={id} type="range" min={min} max={max} step={step} value={wert} aria-valuetext={anzeige} onChange={(e) => onChange(Number(e.target.value))} className="ov-range my-4 block cursor-pointer" style={{ "--ov-fill": `${fill}%` }} />
      {marken && (
        <div className="flex justify-between text-[11.5px] text-white/60" aria-hidden="true">
          {marken.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function Kachel({ label, wert, hervor = false }) {
  return (
    <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
      <p className="text-[12.5px] text-white/60">{label}</p>
      <p className={cn("ov-num mt-1 font-display text-[26px] font-extrabold tracking-tight", hervor && "text-sun-300")}>{wert}</p>
    </div>
  );
}

const TABS = [
  { k: "qu", l: "Q(U) – Spannung", icon: Gauge },
  { k: "pu", l: "P(U) – Abregelung", icon: TrendingDown },
  { k: "cosp", l: "cos φ(P)", icon: SlidersHorizontal },
  { k: "pf", l: "P(f) – Frequenz", icon: Activity },
];

export default function KennlinieInteraktiv() {
  const id = useId();
  const [ansicht, setAnsicht] = useState("qu");
  const [u, setU] = useState(1.07);
  const [uP, setUP] = useState(1.11);
  const [pP, setPP] = useState(0.8);
  const [f, setF] = useState(50.6);

  const q = qVonU(u);
  const zustand = q > 0 ? "übererregt – spannungsstützend" : q < 0 ? "untererregt – spannungssenkend" : "Totband – keine Blindleistung";
  const p = pVonF(f);
  const pu = pVonU(uP);
  const cp = cosPhiVonP(pP);
  const qSrCosP = Math.sqrt(Math.max(0, 1 - cp * cp)); // sin φ: Q/S bei cos φ(P)

  const tastatur = (e) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.k === ansicht);
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % TABS.length;
    if (e.key === "ArrowLeft") n = (i - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = TABS.length - 1;
    setAnsicht(TABS[n].k);
    document.getElementById(`${id}-${TABS[n].k}`)?.focus();
  };

  return (
    <div className="overflow-hidden rounded-[2rem] bg-navy-950 text-white shadow-2xl ring-1 ring-white/10">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:px-8 md:py-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Interaktiv · Standardkennlinien nach TOR</p>
        <div className="-mx-5 overflow-x-auto px-5 ov-no-scrollbar lg:mx-0 lg:px-0">
          <div role="tablist" aria-label="Kennlinie wählen" onKeyDown={tastatur} className="inline-flex gap-1 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10">
            {TABS.map((t) => (
              <button
                key={t.k}
                type="button"
                role="tab"
                id={`${id}-${t.k}`}
                tabIndex={ansicht === t.k ? 0 : -1}
                aria-selected={ansicht === t.k}
                aria-controls={`${id}-panel`}
                onClick={() => setAnsicht(t.k)}
                className={cn("inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[13.5px] font-semibold transition-colors", ansicht === t.k ? "bg-white text-navy-950" : "text-white/70 hover:text-white")}
              >
                <t.icon aria-hidden="true" className="h-4 w-4" />
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${ansicht}`} className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="p-4 md:p-7">
          {ansicht === "qu" && <DiagrammQU u={u} />}
          {ansicht === "pu" && <DiagrammPU u={uP} />}
          {ansicht === "cosp" && <DiagrammCosPhiP p={pP} />}
          {ansicht === "pf" && <DiagrammPF f={f} />}
        </div>

        <div className="flex flex-col gap-6 border-t border-white/10 p-6 md:p-8 lg:border-l lg:border-t-0">
          {ansicht === "qu" && (
            <>
              <Regler id={`${id}-u`} label="Netzspannung am Anschlusspunkt" wert={u} min={0.9} max={1.1} step={0.005} onChange={setU} anzeige={`${zahl(u, 3)} Un`} marken={["0,90", "1,00", "1,10"]} />
              <div aria-live="polite" className="grid grid-cols-2 gap-3">
                <Kachel label="Blindleistung Q/Qmax" wert={`${q > 0 ? "+" : ""}${zahl(q)}`} hervor />
                <Kachel label="Q/Sr bei Typ A" wert={`${q > 0 ? "+" : ""}${zahl(q * QMAX_SR_TYP_A, 3)}`} />
              </div>
              <p className={cn("rounded-2xl px-4 py-3 text-[14.5px] font-semibold ring-1", q === 0 ? "bg-ov-500/15 text-ov-200 ring-ov-400/30" : "bg-sun-400/10 text-sun-300 ring-sun-400/30")}>
                {zustand}
                <span className="mt-0.5 block text-[12.5px] font-normal text-white/60">≈ {zahl(230 * u, 1)} V bei 230 V Nennspannung (Niederspannung, Leiter–Neutral)</span>
              </p>
              <p className="text-[13px] leading-relaxed text-white/60">
                Stützpunkte a = 0,92 · b = 0,96 · c = 1,05 · d = 1,08 Un; Dynamik PT1 mit τ = 5 s (einstellbar 3–60 s), 95 % des Sollwerts innerhalb 3 τ. Typ A: Qmax = ±{zahl(QMAX_SR_TYP_A, 3)}·Sr (cos φ 0,9; bis 3,68 kVA {zahl(QMAX_SR_TYP_A_KLEIN, 3)}·Sr).
              </p>
            </>
          )}
          {ansicht === "pu" && (
            <>
              <Regler id={`${id}-up`} label="Netzspannung am Anschlusspunkt" wert={uP} min={1.0} max={1.15} step={0.0025} onChange={setUP} anzeige={`${zahl(uP, 3)} Un`} marken={["1,00", "1,10", "1,15"]} />
              <div aria-live="polite" className="grid grid-cols-2 gap-3">
                <Kachel label="Wirkleistung P/Pn" wert={`${Math.round(pu * 100)} %`} hervor />
                <Kachel label="Abregelung" wert={`−${Math.round((1 - pu) * 100)} %`} />
              </div>
              <p className={cn("rounded-2xl px-4 py-3 text-[14.5px] font-semibold ring-1", pu === 1 ? "bg-ov-500/15 text-ov-200 ring-ov-400/30" : "bg-sun-400/10 text-sun-300 ring-sun-400/30")}>
                {pu === 1 ? "Unter 110 % Un – volle Wirkleistung" : pu === 0 ? "112 % Un erreicht – Wirkleistung 0 %" : "P(U) aktiv – Wirkleistung wird linear reduziert"}
                <span className="mt-0.5 block text-[12.5px] font-normal text-white/60">≈ {zahl(230 * uP, 1)} V bei 230 V Nennspannung; P(U) greift, bevor der Netzentkupplungsschutz abschaltet.</span>
              </p>
              <p className="text-[13px] leading-relaxed text-white/60">
                Standard für Umrichter im Niederspannungsnetz (TOR Typ A V1.4): 110 % Un → 100 % Pn, 112 % Un → 0 %; PT1-Filter Standard 5 s, Anlaufverzögerung max. 3 s. Stützpunkte parametrierbar, Vorgabe durch den Netzbetreiber.
              </p>
            </>
          )}
          {ansicht === "cosp" && (
            <>
              <Regler id={`${id}-pp`} label="Wirkleistung der Anlage" wert={pP} min={0} max={1} step={0.01} onChange={setPP} anzeige={`${zahl(pP)} Pmax`} marken={["0", "0,5", "1,0"]} />
              <div aria-live="polite" className="grid grid-cols-2 gap-3">
                <Kachel label="cos φ laut Kennlinie" wert={zahl(cp, 3)} hervor />
                <Kachel label="Q/S (sin φ)" wert={cp < 1 ? `−${zahl(qSrCosP, 3)}` : "0"} />
              </div>
              <p className={cn("rounded-2xl px-4 py-3 text-[14.5px] font-semibold ring-1", cp === 1 ? "bg-ov-500/15 text-ov-200 ring-ov-400/30" : "bg-sun-400/10 text-sun-300 ring-sun-400/30")}>
                {cp === 1 ? "Bis 0,5 Pmax: cos φ = 1, keine Blindleistung" : "Über 0,5 Pmax: untererregt, Blindleistung steigt mit der Wirkleistung"}
                <span className="mt-0.5 block text-[12.5px] font-normal text-white/60">Bei 1,0 Pmax cos φ 0,9 untererregt – entspricht Q/Pmax = tan φ = 0,484 bzw. Q/S = sin φ = 0,436.</span>
              </p>
              <p className="text-[13px] leading-relaxed text-white/60">Standardkennlinie cos φ(P) der TOR Typ B V1.3 (Kap. 5.3.4): P/Pmax 0 → cos φ 1; 0,5 → 1; 1,0 → 0,9 untererregt. Standardmäßig deaktiviert; aktiv nur auf Vorgabe des Netzbetreibers.</p>
            </>
          )}
          {ansicht === "pf" && (
            <>
              <Regler id={`${id}-f`} label="Netzfrequenz" wert={f} min={49.8} max={51.5} step={0.01} onChange={setF} anzeige={`${zahl(f)} Hz`} marken={["49,8", "50,2", "51,5"]} />
              <div aria-live="polite" className="grid grid-cols-2 gap-3">
                <Kachel label="Wirkleistung P/Pref" wert={`${Math.round(p * 100)} %`} hervor />
                <Kachel label="Reduktion" wert={`−${Math.round((1 - p) * 100)} %`} />
              </div>
              <p className={cn("rounded-2xl px-4 py-3 text-[14.5px] font-semibold ring-1", p === 1 ? "bg-ov-500/15 text-ov-200 ring-ov-400/30" : "bg-sun-400/10 text-sun-300 ring-sun-400/30")}>
                {p === 1 ? "Unter der Schwelle – volle Wirkleistung" : "LFSM-O aktiv – Statik 5 % ≙ −40 % je Hz"}
                <span className="mt-0.5 block text-[12.5px] font-normal text-white/60">Dieser Sollwert hat nach TOR Vorrang vor allen anderen Wirkleistungsvorgaben.</span>
              </p>
              <p className="text-[13px] leading-relaxed text-white/60">Schwelle einstellbar 50,2–50,5 Hz, Statik 2–12 %; Standard 50,2 Hz und 5 %. Pref ist bei Umrichtern die Wirkleistung beim Erreichen der Schwelle. Messauflösung ≤ 10 mHz.</p>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 border-t border-white/10 px-6 py-5 md:grid-cols-2 md:px-8">
        <p className="flex gap-2 text-[12.5px] leading-relaxed text-white/60">
          <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
          <span>
            Standardeinstellungen der TOR Stromerzeugungsanlagen ohne abweichende Vorgabe des Netzbetreibers. Viele Netzbetreiber schreiben eigene Stützpunkte, Verschiebungsfaktoren oder Zeitkonstanten vor – maßgeblich ist Ihr
            Netzanschlussvertrag.
          </span>
        </p>
        <p className="rounded-2xl bg-white/[0.05] px-4 py-3 text-[12.5px] leading-relaxed text-white/70 ring-1 ring-white/10">
          <strong className="text-white">Q/Sr gegenüber Q/Pmax:</strong> Typ A bezieht Qmax auf die Bemessungsscheinleistung Sr (±0,436·Sr bei cos φ 0,9; bis 3,68 kVA 0,312·Sr). Typ B bezieht den Blindleistungsbereich auf Pmax (Bereich II: Q/Pmax ±0,411 bei
          cos φ 0,925). Dieselbe Zahl mit falscher Bezugsgröße ergibt eine andere Blindleistung – Vorgaben immer mit Bezug übernehmen.
        </p>
      </div>
    </div>
  );
}
