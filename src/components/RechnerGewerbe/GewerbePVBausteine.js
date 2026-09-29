"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { ChevronDown, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { useBreite } from "@/components/Rechner/bausteine";

/* ------------------------------------------------------------------
   Gemeinsame Bausteine der Rechner Gewerbe-PV, CO₂/ESG und Pacht
   (ergänzen src/components/Rechner/bausteine.js, gleiche Optik)
   ------------------------------------------------------------------ */

const reduziert = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true kurz nach dem Mount – für Einwachs-Animationen von Diagrammen. */
export function useEingeblendet(verzoegerung = 80) {
  const [an, setAn] = useState(false);
  useEffect(() => {
    if (reduziert()) {
      setAn(true);
      return;
    }
    const t = setTimeout(() => setAn(true), verzoegerung);
    return () => clearTimeout(t);
  }, [verzoegerung]);
  return an;
}

/** Standortauswahl (Orte mit PVGIS-Werten, gruppiert nach Bundesland). */
export function StandortWahl({ gruppen, wert, onChange, label = "Standort", hinweis }) {
  const id = useId();
  const ort = useMemo(() => gruppen.flatMap((g) => g.orte).find((o) => o.slug === wert), [gruppen, wert]);
  return (
    <div>
      <label htmlFor={id} className="mb-2.5 block text-[14.5px] font-semibold text-ink-800">
        {label}
      </label>
      <div className="relative">
        <MapPin aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ov-600" />
        <select
          id={id}
          value={wert}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-2xl bg-white pl-11 pr-10 text-[15px] font-semibold text-ink-900 ring-1 ring-ink-200 transition-shadow hover:ring-ink-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
        >
          {gruppen.map((g) => (
            <optgroup key={g.land} label={g.name}>
              {g.orte.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.name} ({g.name})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
      </div>
      {(hinweis || ort) && <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{hinweis ? hinweis(ort) : null}</p>}
    </div>
  );
}

/** Voreinstellungen als Chip-Leiste (horizontal scrollbar auf dem Handy). */
export function PresetLeiste({ presets, aktiv, onWahl, titel = "Beispielbetrieb laden" }) {
  return (
    <div>
      <p className="mb-2.5 flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-sun-500" />
        {titel}
      </p>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {presets.map((p) => {
          const an = p.id === aktiv;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={an}
              onClick={() => onWahl(p)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all duration-200",
                an ? "bg-ink-900 text-white shadow-md" : "bg-white text-ink-700 ring-1 ring-ink-200 hover:text-ink-900 hover:ring-ink-300"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Kleiner Umschalter (Tabs) für Diagramm-Ansichten. */
export function Umschalter({ optionen, wert, onChange, label, dunkel = false }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex rounded-full p-1", dunkel ? "bg-white/10" : "bg-ink-100")}>
      {optionen.map((o) => {
        const an = o.id === wert;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={an}
            onClick={() => onChange(o.id)}
            className={cn(
              "min-h-9 rounded-full px-3.5 text-[13px] font-semibold transition-all duration-200",
              an ? (dunkel ? "bg-white text-ink-900" : "bg-white text-ink-900 shadow-[0_2px_8px_-2px_rgba(21,26,36,0.18)]") : dunkel ? "text-white/70 hover:text-white" : "text-ink-600 hover:text-ink-900"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Rahmen für Diagramme im Ergebnis-Panel */
export function DiagrammKarte({ titel, rechts, children, className, fuss }) {
  return (
    <div className={cn("mt-6 rounded-3xl ring-1 ring-ink-200/70", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 md:px-6">
        <h3 className="font-display text-[17px] font-bold text-ink-900">{titel}</h3>
        {rechts}
      </div>
      {children}
      {fuss && <div className="px-5 pb-5 md:px-6">{fuss}</div>}
    </div>
  );
}

/** Zeile „Label … Wert“ für Aufstellungen */
export function Posten({ label, wert, stark, ton }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 text-[14px]">
      <dt className={cn(stark ? "font-semibold text-ink-900" : "text-ink-600")}>{label}</dt>
      <dd className={cn("ov-num shrink-0 text-right font-semibold", ton === "gruen" ? "text-ov-700" : ton === "sonne" ? "text-sun-500" : "text-ink-900", stark && "text-[15.5px]")}>{wert}</dd>
    </div>
  );
}

function schoeneSchritte(min, max) {
  const spanne = Math.max(max - min, 1);
  const roh = spanne / 4;
  const basis = Math.pow(10, Math.floor(Math.log10(roh)));
  const schritt = [1, 2, 2.5, 5, 10].map((m) => m * basis).find((s) => s >= roh) || roh;
  const unten = Math.floor(min / schritt) * schritt;
  const oben = Math.ceil(max / schritt) * schritt;
  const ticks = [];
  for (let v = unten; v <= oben + 1e-6; v += schritt) ticks.push(Math.round(v * 1e6) / 1e6);
  return { unten, oben, ticks };
}

const eurKurz = (v) => {
  const a = Math.abs(v);
  const s = v < 0 ? "−" : "";
  if (a >= 1e6) return `${s}${(a / 1e6).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mio. €`;
  if (a >= 1000) return `${s}${Math.round(a / 1000).toLocaleString("de-DE")} T€`;
  return `${s}${Math.round(a)} €`;
};
export const eur = (n) => `${n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("de-DE")} €`;

/**
 * Kumuliertes Balkendiagramm (Cashflow, Pachtsumme). Balken wachsen beim ersten
 * Einblenden und gleiten bei Änderungen weich (wie CashflowChart des Solarrechners).
 * @param {Array<{jahr:number, kumuliert:number}>} reihe
 * @param {number|null} marke     x-Position (in Jahren) einer Markierung, z. B. Amortisation
 * @param {string} markeLabel
 * @param {(eintrag) => Array<[string,string]>} tooltip  Zeilen für den Tooltip
 * @param {string} ariaLabel
 */
export function KumuliertDiagramm({ reihe, marke = null, markeLabel = "", tooltip, ariaLabel, startLabel = "Start", farbePlus = "#7fae4a", farbeMinus = "#b9c2d0" }) {
  const [ref, W0] = useBreite(720);
  const W = Math.max(W0, 280);
  const an = useEingeblendet(120);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 230 : 280;
  const P = { l: schmal ? 52 : 70, r: 12, t: 34, b: 30 };
  const { unten, oben, ticks } = useMemo(() => {
    const w = reihe.map((c) => c.kumuliert);
    return schoeneSchritte(Math.min(0, ...w), Math.max(0, ...w));
  }, [reihe]);
  const n = reihe.length || 1;
  const spalte = (W - P.l - P.r) / n;
  const bw = Math.max(spalte * 0.62, 3);
  const y = (v) => Math.round((P.t + (H - P.t - P.b) * (1 - (v - unten) / (oben - unten || 1))) * 10) / 10;
  const x = (i) => Math.round((P.l + i * spalte + spalte / 2) * 10) / 10;
  const markeX = marke != null && marke <= n - 1 ? x(0) + marke * spalte : null;
  const aktiv = hover != null ? reihe[hover] : null;
  const labelAlle = schmal ? 10 : 5;

  return (
    <div ref={ref} className="relative px-2 pb-4 pt-2 md:px-3">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="block touch-pan-y select-none" role="img" aria-label={ariaLabel} onPointerLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#151a24" : "#e8ebf0"} strokeWidth={t === 0 ? 1.25 : 1} />
            <text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-400 text-[11.5px]" style={{ fontVariantNumeric: "tabular-nums" }}>
              {t === 0 ? "0 €" : eurKurz(t)}
            </text>
          </g>
        ))}
        {reihe.map((c, i) => {
          const plus = c.kumuliert >= 0;
          const y0 = y(0);
          const y1 = an ? y(c.kumuliert) : y0;
          const top = Math.min(y0, y1);
          const h = Math.max(Math.abs(y1 - y0), an ? 1.5 : 0);
          const ist = hover === i;
          return (
            <g key={c.jahr}>
              <rect
                x={x(i) - bw / 2}
                y={top}
                width={bw}
                height={h}
                rx={Math.min(4, bw / 3)}
                fill={plus ? farbePlus : farbeMinus}
                opacity={hover == null || ist ? 1 : 0.55}
                style={{ transition: `y 600ms cubic-bezier(.22,1,.36,1) ${an ? 0 : i * 18}ms, height 600ms cubic-bezier(.22,1,.36,1) ${i * 18}ms, fill 250ms, opacity 200ms` }}
              />
              {(i % labelAlle === 0 || (!schmal && i === n - 1)) && (
                <text x={x(i)} y={H - 9} textAnchor="middle" className="fill-ink-400 text-[11.5px]">
                  {i === 0 ? startLabel : `${c.jahr} J.`}
                </text>
              )}
              <rect x={P.l + i * spalte} y={P.t} width={spalte} height={H - P.t - P.b} fill="transparent" onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)} />
            </g>
          );
        })}
        {markeX != null && (
          <g pointerEvents="none" style={{ transition: "opacity 400ms" }} opacity={an ? 1 : 0}>
            <line x1={markeX} x2={markeX} y1={P.t} y2={H - P.b} stroke="#003473" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx={markeX} cy={y(0)} r="5" fill="#fff" stroke="#003473" strokeWidth="2" />
          </g>
        )}
      </svg>
      {markeX != null && (
        <span
          className="pointer-events-none absolute top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy-700 px-2.5 py-1 text-[11.5px] font-semibold text-white shadow-md"
          style={{ left: `${Math.min(Math.max((markeX / W) * 100, 14), 86)}%` }}
        >
          {markeLabel}
        </span>
      )}
      {aktiv && tooltip && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 w-[220px] rounded-xl bg-ink-900 px-4 py-3 text-[12.5px] text-white shadow-xl"
          style={{ left: `${Math.min(Math.max((x(hover) / W) * 100, 18), 82)}%`, top: "16%", transform: "translateX(-50%)" }}
        >
          {tooltip(aktiv).map(([k, v], i) =>
            i === 0 ? (
              <p key={k} className="font-semibold">{k}</p>
            ) : (
              <p key={k} className="mt-0.5 flex justify-between gap-3 text-white/70">
                {k} <span className="ov-num font-semibold text-white">{v}</span>
              </p>
            )
          )}
        </div>
      )}
      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Jahr</th>
            <th scope="col">Kumuliert</th>
          </tr>
        </thead>
        <tbody>
          {reihe.map((c) => (
            <tr key={c.jahr}>
              <th scope="row">{c.jahr}</th>
              <td>{eur(c.kumuliert)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
