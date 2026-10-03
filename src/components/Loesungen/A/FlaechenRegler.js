"use client";

// Flächenregler für /freiflaechen-photovoltaik (Präfix w25f).
// Ein gezeichnetes Solarpark-Diorama (w25-SolarparkDiorama) wächst mit dem Regler: Modulreihen
// füllen die Fläche, Zaun, Übergabestation und Kabeltrasse wachsen mit, über 10 MWp wechselt der
// Anschluss zum Umspannwerk. Daneben die Richtwerte (Leistung, Ertrag, Haushalte, CO₂) und die
// Schwellen für Bewilligung und Landeszonen – gerechnet mit den offengelegten Annahmen unten.

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Cable, Check, Home, Leaf, Sun, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { fmtZahl } from "./diagramm";
import W25SolarparkDiorama from "../w25-SolarparkDiorama";
import { useW25Gleiten, useW25Sicht } from "../w25-hooks";

// Annahmen (Richtwerte, auf der Seite offengelegt)
const HA_JE_MWP = 1.25; // Mitte aus „etwa 1 bis 1,5 Hektar je MW“
const ERTRAG = 1150; // kWh/kWp, Ost-Österreich, Südausrichtung (wie Beispielrechnung)
const HAUSHALT = 3500; // kWh/Jahr, Standardhaushalt E-Control-Preismonitor
const CO2 = 0.2582; // kg/kWh, Emissionskoeffizient substituierter Strom AT (Technikum Wien 2025)
const FUSSBALLFELD = 0.714; // ha (105 × 68 m)

const SCHWELLEN = [
  { ab: 0.5, einheit: "MWp", text: "Ab ca. 500 kWp planen wir Freiflächenanlagen" },
  { ab: 1, einheit: "MWp", text: "Oberösterreich: über 1.000 kW elektrizitätsrechtliche Bewilligung" },
  { ab: 2, einheit: "ha", text: "Niederösterreich: über 2 ha nur in Zonen des Sektoralen ROP" },
  { ab: 10, einheit: "ha", text: "Steiermark: über 10 ha nur in Vorrangzonen" },
];
const erreicht = (s, ha) => (s.einheit === "ha" ? ha > s.ab : ha / HA_JE_MWP >= s.ab);

// Reglerstufen: fein im kleinen Bereich, gröber bei großen Parks – jeder Tastendruck ändert etwas.
const STUFEN = (() => {
  const s = [];
  for (let v = 1; v <= 10; v += 0.5) s.push(v);
  for (let v = 11; v <= 20; v += 1) s.push(v);
  for (let v = 22.5; v <= 60; v += 2.5) s.push(v);
  return s;
})();
const MAX_IDX = STUFEN.length - 1;
const START_IDX = STUFEN.indexOf(6);
const MARKEN = [
  ...SCHWELLEN.map((s) => STUFEN.findIndex((ha) => erreicht(s, ha))),
  STUFEN.findIndex((ha) => ha / HA_JE_MWP > 10),
]
  .filter((k) => k > 0)
  .map((k) => Math.round((k / MAX_IDX) * 1000) / 10);

const rechne = (ha) => {
  const mwp = ha / HA_JE_MWP;
  const mwh = mwp * ERTRAG;
  return { mwp, gwh: mwh / 1000, haushalte: (mwh * 1000) / HAUSHALT, co2: (mwh * 1000 * CO2) / 1000, felder: ha / FUSSBALLFELD };
};
const netzText = (mwp) =>
  mwp < 0.5 ? "unter 500 kWp – eher Dach oder Agri-PV prüfen" : mwp <= 10 ? "Netzebene 5 (Mittelspannung, Übergabestation)" : "Netzebene 4 – Anschluss am Umspannwerk";

const CSS = `
.w25f-wiese{transition:opacity 500ms ease}
.w25f-mod{opacity:0;transform:translateY(-12px);transition:opacity 420ms ease,transform 650ms cubic-bezier(.22,1,.36,1)}
.w25f-mod.is-an{opacity:1;transform:none}
.w25f-netz{opacity:.3;transition:opacity 600ms ease}
.w25f-netz.is-an{opacity:1}
.w25f-impuls{stroke-dasharray:3 14;opacity:0;transition:opacity 400ms ease}
.w25f-impuls.is-an{opacity:1}
.w25f-trasse{transition:stroke-opacity 400ms ease}
.w25f-kegel{transition:d 650ms cubic-bezier(.22,1,.36,1)}
.w25f-anker{transition:transform 650ms cubic-bezier(.22,1,.36,1)}
.w25f-range{-webkit-appearance:none;appearance:none;display:block;width:100%;height:44px;background:transparent;cursor:pointer;touch-action:pan-y}
.w25f-range::-webkit-slider-runnable-track{height:8px;border-radius:999px;background:linear-gradient(90deg,#669933,#8cba58 55%,#ffd873) no-repeat 0 0/var(--f) 100%,rgba(255,255,255,.14)}
.w25f-range::-moz-range-track{height:8px;border-radius:999px;background:rgba(255,255,255,.14)}
.w25f-range::-moz-range-progress{height:8px;border-radius:999px;background:linear-gradient(90deg,#669933,#8cba58 55%,#ffd873)}
.w25f-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:30px;height:30px;margin-top:-11px;border-radius:999px;background:#fff;border:0;box-shadow:0 0 0 6px rgba(255,216,115,.18),0 6px 16px rgba(0,0,0,.45);transition:transform 160ms,box-shadow 200ms}
.w25f-range::-moz-range-thumb{width:30px;height:30px;border-radius:999px;background:#fff;border:0;box-shadow:0 0 0 6px rgba(255,216,115,.18),0 6px 16px rgba(0,0,0,.45)}
.w25f-range:hover::-webkit-slider-thumb{box-shadow:0 0 0 9px rgba(255,216,115,.22),0 6px 16px rgba(0,0,0,.45)}
.w25f-range:active::-webkit-slider-thumb{transform:scale(1.08)}
.w25f-range:focus{outline:none}
.w25f-range:focus-visible{outline:3px solid #aed083;outline-offset:4px;border-radius:12px}
@keyframes w25f-fluss{to{stroke-dashoffset:-17}}
@media (prefers-reduced-motion:no-preference){
  .w25f-impuls.is-an{animation:w25f-fluss 1.3s linear infinite}
  .w25f-land{transition:opacity 900ms ease,transform 1200ms cubic-bezier(.22,1,.36,1)}
  [data-w25-bereit]:not([data-w25-an]) .w25f-land{opacity:0;transform:translateY(28px)}
  [data-w25-bereit]:not([data-w25-an]) .w25f-mod{opacity:0;transform:translateY(-12px)}
  [data-w25-bereit]:not([data-w25-an]) .w25f-wiese{opacity:0!important}
  [data-w25-bereit] .w25f-bahn{stroke-dasharray:1;stroke-dashoffset:1}
  [data-w25-an] .w25f-bahn{stroke-dashoffset:0;transition:stroke-dashoffset 1800ms cubic-bezier(.65,0,.35,1) 150ms}
  .w25f-sonne,.w25f-stunde{transition:opacity 900ms ease,transform 1400ms cubic-bezier(.22,1,.36,1)}
  [data-w25-bereit]:not([data-w25-an]) .w25f-sonne{opacity:0;transform:translateY(40px)}
  [data-w25-an] .w25f-sonne{transition-delay:500ms}
  [data-w25-bereit]:not([data-w25-an]) .w25f-stunde{opacity:0}
  [data-w25-an] .w25f-stunde{transition-delay:calc(300ms + var(--k) * 110ms)}
  [data-w25-bereit]:not([data-w25-an]) .w25f-kegel,[data-w25-bereit]:not([data-w25-an]) .w25f-anker,[data-w25-bereit]:not([data-w25-an]) .w25f-zaun{opacity:0}
  [data-w25-an] .w25f-zaun{transition:opacity 700ms ease 1500ms}
  [data-w25-an] .w25f-kegel{transition:d 650ms cubic-bezier(.22,1,.36,1),opacity 900ms ease 1400ms}
  [data-w25-an] .w25f-anker{transition:transform 650ms cubic-bezier(.22,1,.36,1),opacity 600ms ease 1700ms}
}
`;

/**
 * Flächen-Schieberegler: Hektar → MWp, Jahresertrag, Haushalte, CO₂ – mit gezeichnetem Solarpark,
 * Hinweisen zu Netzebene und Widmung.
 */
export default function FlaechenRegler({ eyebrow = "Interaktiv · Flächenrechner", titel = "Was trägt Ihre Fläche?", lead, className }) {
  const [idx, setIdx] = useState(START_IDX);
  const [geaendert, setGeaendert] = useState(false);
  const basis = useRef(Math.round(STUFEN[START_IDX] * 2));
  const id = useId();
  const stage = useRef(null);
  const phase = useW25Sicht(stage, { schwelle: 0.3 });

  const ha = STUFEN[idx];
  const aktiv = Math.min(120, Math.max(1, Math.round(ha * 2)));
  const r = useMemo(() => rechne(ha), [ha]);
  const netz4 = r.mwp > 10;

  // Count-up beim Eintritt, danach weiches Gleiten zwischen den Werten
  const gleit = useW25Gleiten(phase === "warten" ? 0 : ha, phase === "an" && !geaendert ? 1600 : 420);
  const g = rechne(gleit);

  const aendern = (k) => {
    basis.current = aktiv;
    setGeaendert(true);
    setIdx(k);
  };

  // Übergangsverzögerung je Feld: beim Eintritt nacheinander, danach relativ zur Änderung
  const b = basis.current;
  const verz = (rang) => {
    if (!geaendert) return 450 + Math.min(rang, 60) * 28;
    if (rang >= b && rang < aktiv) return Math.min((rang - b) * 14, 700);
    if (rang >= aktiv && rang < b) return Math.min((b - 1 - rang) * 8, 400);
    return 0;
  };

  const fill = Math.round((idx / MAX_IDX) * 1000) / 10;
  const haText = fmtZahl(ha, ha % 1 ? 1 : 0);
  const label = `Schematischer Solarpark auf ${haText} Hektar: rund ${fmtZahl(r.mwp, 1)} MWp in Modulreihen mit Zaun und Übergabestation, Anschluss ${netz4 ? "am Umspannwerk (Netzebene 4)" : "an die Mittelspannung (Netzebene 5)"}.`;

  return (
    <div data-blk="flaechenregler" className={className}>
      <style>{CSS}</style>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
            {eyebrow}
          </p>
          <h2 className="ov-h2 mt-4 max-w-[36rem] text-balance text-ink-900">{titel}</h2>
        </div>
        {lead && <p className="ov-lead max-w-[34rem] text-ink-600 lg:pb-1">{lead}</p>}
      </div>

      <div className="ov-noise relative mt-10 overflow-hidden rounded-[2rem] bg-navy-950 text-white shadow-[0_40px_90px_-40px_rgba(3,18,43,0.6)] md:mt-12 md:rounded-[2.5rem]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="grid lg:grid-cols-[minmax(0,1.42fr)_minmax(0,1fr)]">
          {/* ---------- Bühne ---------- */}
          <div
            ref={stage}
            className="relative flex min-w-0 flex-col justify-center overflow-hidden px-2 pb-4 pt-14 sm:px-6 md:pt-16 lg:pb-8"
            style={{
              background:
                "radial-gradient(90% 60% at 66% 12%, rgba(255,197,61,0.16), transparent 60%), radial-gradient(70% 50% at 50% 78%, rgba(140,186,88,0.14), transparent 70%), linear-gradient(180deg, #041d42 0%, #062652 55%, #03122b 100%)",
            }}
          >
            <div aria-hidden="true" className="ov-grid-bg pointer-events-none absolute inset-0 opacity-40" />
            <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between gap-3 md:inset-x-8 md:top-7">
              <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-ov-300 md:text-[12px] md:tracking-[0.16em]">Ihre Fläche · schematisch</p>
              <p className="flex items-center gap-2 whitespace-nowrap text-[11px] text-white/60 md:text-[12px]">
                <span aria-hidden="true" className="h-3 w-3 rotate-45 scale-y-[0.6] border border-white/50" />1 Feld = 0,5 ha
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-[760px]">
              <W25SolarparkDiorama aktiv={aktiv} verz={verz} netz4={netz4} klein={`≈ ${fmtZahl(r.mwp, 1)} MWp`} label={label} />
            </div>
            <ul aria-hidden="true" className="relative mt-1 flex flex-wrap justify-center gap-x-5 gap-y-1.5 px-3 text-[11.5px] text-white/55 md:text-[12px]">
              <li className="flex items-center gap-1.5"><span className="h-2 w-3.5 rounded-[2px] bg-gradient-to-br from-[#3a78cc] to-[#123f86] ring-1 ring-white/40" />Modulreihen</li>
              <li className="flex items-center gap-1.5"><span className="h-0 w-4 border-t border-dashed border-white/80" />Zaun</li>
              <li className="flex items-center gap-1.5"><span className="h-[3px] w-4 rounded-full bg-sun-300" />Kabeltrasse</li>
              <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-[2px] bg-[#c3cad4]" />Übergabestation</li>
            </ul>
          </div>

          {/* ---------- Steuerung & Richtwerte ---------- */}
          <div className="relative border-t border-white/10 bg-white/[0.03] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-9">
            <div className="flex items-end justify-between gap-4">
              <label htmlFor={id} className="pb-1 text-[14px] font-semibold text-white/75">
                Flächengröße
              </label>
              <p className="text-right">
                <span className="ov-num font-display text-[44px] font-extrabold leading-none tracking-[-0.03em] text-white md:text-[52px]">{haText}</span>
                <span className="ml-1.5 font-display text-[20px] font-bold text-white/55">ha</span>
              </p>
            </div>
            <div className="relative mt-3">
              <input
                id={id}
                type="range"
                min={0}
                max={MAX_IDX}
                step={1}
                value={idx}
                onChange={(e) => aendern(Number(e.target.value))}
                className="w25f-range relative z-[1]"
                style={{ "--f": `${fill}%` }}
                aria-valuetext={`${fmtZahl(ha, 1)} Hektar, rund ${fmtZahl(r.mwp, 1)} Megawatt peak`}
              />
              {/* Schwellen als Marken auf der Spur */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-[15px] top-1/2 h-0">
                {MARKEN.map((m) => (
                  <span key={m} className={cn("absolute top-[7px] h-2 w-px", fill >= m ? "bg-sun-300" : "bg-white/35")} style={{ left: `${m}%` }} />
                ))}
              </div>
            </div>
            <div className="mt-1 flex justify-between text-[12px] text-white/45">
              <span>1 ha</span>
              <span className="text-white/70">≈ {fmtZahl(r.felder, r.felder < 10 ? 1 : 0)} Fußballfelder</span>
              <span>60 ha</span>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10">
              <Wert icon={Zap} label="Leistung (Richtwert)" wert={fmtZahl(g.mwp, 1)} einheit="MWp" klein={`Spanne ${fmtZahl(ha / 1.5, 1)}–${fmtZahl(ha, 1)} MWp`} hervor />
              <Wert icon={Sun} label="Jahresertrag" wert={fmtZahl(g.gwh, r.gwh < 10 ? 1 : 0)} einheit="GWh" klein="bei 1.150 kWh/kWp" />
              <Wert icon={Home} label="Haushalte versorgt" wert={`≈ ${fmtZahl(Math.round(g.haushalte / 10) * 10)}`} klein="à 3.500 kWh/Jahr" />
              <Wert icon={Leaf} label="CO₂ vermieden" wert={`≈ ${fmtZahl(Math.round(g.co2 / 10) * 10)}`} einheit="t" klein="pro Jahr" />
            </dl>

            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sun-300/[0.08] px-4 py-3.5 text-[14px] leading-snug ring-1 ring-sun-300/25" aria-live="polite">
              <Cable aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" />
              <p className="text-white/85">
                <span className="font-semibold text-white">Netzanschluss:</span> {netzText(r.mwp)}
              </p>
            </div>

            <ul className="mt-5 space-y-1">
              {SCHWELLEN.map((s) => {
                const an = erreicht(s, ha);
                return (
                  <li key={s.text} className={cn("flex items-start gap-3 py-1.5 text-[13.5px] leading-snug transition-colors duration-300", an ? "text-white/90" : "text-white/40")}>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        an ? "bg-sun-300 text-navy-950 shadow-[0_0_12px_rgba(255,216,115,0.55)]" : "ring-1 ring-white/25"
                      )}
                    >
                      {an && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span>
                      <span className="sr-only">{an ? "Greift: " : "Greift noch nicht: "}</span>
                      {s.text}
                    </span>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/rechner/freiflaeche-pacht"
              className="group mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ov-500 px-6 py-3 text-[15px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(140,186,88,0.7)] transition-colors hover:bg-ov-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            >
              Pacht & Erlös für diese Fläche rechnen
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-5 max-w-[62rem] text-[12.5px] leading-relaxed text-ink-500">
        Richtwerte, keine Zusage: 1–1,5 ha je MWp (Mitte 1,25 ha), 1.150 kWh/kWp (Ost-Österreich, Süd), 3.500 kWh je Haushalt (Standardhaushalt
        E-Control-Preismonitor), 258,2 g CO₂/kWh substituierter Strom (Technikum Wien 2025, Basis E-Control). Ob eine Fläche widmungsfähig ist,
        entscheiden Gemeinde und Land. Die Zeichnung ist schematisch, nicht maßstäblich.
      </p>
    </div>
  );
}

function Wert({ icon: Icon, label, wert, einheit, klein, hervor }) {
  return (
    <div className={cn("p-4 md:p-5", hervor ? "bg-[#0b2a52]" : "bg-navy-950")}>
      <dt className="flex items-center gap-1.5 text-[12.5px] text-white/55">
        <Icon aria-hidden="true" className={cn("h-3.5 w-3.5", hervor ? "text-sun-300" : "text-ov-300")} />
        {label}
      </dt>
      <dd className="mt-2 font-display font-extrabold leading-none tracking-tight text-white">
        <span className="ov-num text-[26px] md:text-[30px]">{wert}</span>
        {einheit && <span className="ml-1 text-[15px] font-bold text-white/55">{einheit}</span>}
      </dd>
      {klein && <dd className="mt-1.5 text-[12px] text-white/45">{klein}</dd>}
    </div>
  );
}
