"use client";

import { useMemo, useState } from "react";
import { cn } from "@/components/ui/cn";
import { Tooltip, useBreite } from "@/components/Rechner/bausteine";
import { fmt } from "@/lib/rechner/annahmen";
import { MONATE_LANG } from "@/lib/rechner/profile";
import { mitSpeicher } from "@/lib/rechner/peakshaving";
import { euro } from "./GewerbeBausteine";

const FARBE = { ohne: "#97a0b0", ueber: "#f5a70f", mit: "#669933", laden: "#4a7cbd", schwelle: "#03122b", raster: "#eef0f4" };
const r1 = (v) => Math.round(v * 10) / 10;
const p2 = (v) => Math.round(v * 100) / 100; // Prozentwerte für SSR und Client identisch

/** „Schöne“ Achsenobergrenze und Schrittweite */
function achse(max) {
  const roh = max / 4;
  const p = Math.pow(10, Math.floor(Math.log10(roh || 1)));
  const s = [1, 2, 2.5, 5, 10].map((f) => f * p).find((x) => x >= roh) || roh;
  return { schritt: s, max: Math.ceil(max / s) * s };
}

/**
 * Lastkurve eines Spitzentags (96 Viertelstunden) ohne und mit Speicher:
 * Fläche über der Schwelle (vom Speicher gedeckt), Nachladen darunter.
 */
export function PeakLastkurve({ kurve, schwelle, erreicht, leistung, monat }) {
  const [ref, W] = useBreite(720);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 250 : 300;
  const P = { l: schmal ? 42 : 52, r: schmal ? 12 : 20, t: 22, b: 34 };
  const spitze = Math.max(...kurve);
  const { schritt, max } = achse(spitze * 1.08);
  const x = (q) => r1(P.l + (q / 96) * (W - P.l - P.r));
  const y = (v) => r1(P.t + (1 - v / max) * (H - P.t - P.b));
  const aktivSchwelle = leistung > 0 ? erreicht : spitze;
  const sp = useMemo(() => (leistung > 0 ? mitSpeicher(kurve, aktivSchwelle, leistung) : { netz: kurve.slice(), entladen: kurve.map(() => 0), laden: kurve.map(() => 0) }), [kurve, aktivSchwelle, leistung]);

  // Treppenpfade (Viertelstundenwerte)
  const stufen = (werte) => werte.map((v, q) => `${q ? "L" : "M"}${x(q)},${y(v)} L${x(q + 1)},${y(v)}`).join(" ");
  const pOhne = stufen(kurve);
  const pMit = stufen(sp.netz);
  const flaecheOhne = `${pOhne} L${x(96)},${y(0)} L${x(0)},${y(0)} Z`;
  // Entladefläche: zwischen Lastkurve und Netzbezug, wo der Speicher liefert
  const flaeche = (oben, unten) => {
    const teile = [];
    let seg = null;
    oben.forEach((o, q) => {
      if (o - unten[q] > 0.01) {
        if (!seg) seg = [];
        seg.push(q);
      } else if (seg) {
        teile.push(seg);
        seg = null;
      }
    });
    if (seg) teile.push(seg);
    return teile
      .map((s) => {
        const hin = s.map((q) => `L${x(q)},${y(oben[q])} L${x(q + 1)},${y(oben[q])}`).join(" ").replace(/^L/, "M");
        const zurueck = s.slice().reverse().map((q) => `L${x(q + 1)},${y(unten[q])} L${x(q)},${y(unten[q])}`).join(" ");
        return `${hin} ${zurueck} Z`;
      })
      .join(" ");
  };
  const pEntladen = flaeche(kurve, sp.netz);
  const pLaden = flaeche(sp.netz, kurve);
  const qMax = kurve.indexOf(spitze);
  const aktiv = hover != null ? hover : null;

  const ausZeiger = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    return Math.max(0, Math.min(95, Math.floor(((px - P.l) / (W - P.l - P.r)) * 96)));
  };
  const uhr = (q) => `${String(Math.floor(q / 4)).padStart(2, "0")}:${String((q % 4) * 15).padStart(2, "0")}`;

  return (
    <div ref={ref} className="relative px-2 pb-4 md:px-3">
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block touch-pan-y select-none"
        role="img"
        aria-label={`Lastkurve am Spitzentag im ${MONATE_LANG[monat]}: Spitze ${fmt(spitze)} Kilowatt um ${uhr(qMax)} Uhr, mit Speicher höchstens ${fmt(Math.max(...sp.netz))} Kilowatt.`}
      >
        <defs>
          <linearGradient id="rg-peak-flaeche" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={FARBE.ohne} stopOpacity="0.28" />
            <stop offset="100%" stopColor={FARBE.ohne} stopOpacity="0.04" />
          </linearGradient>
          <pattern id="rg-peak-schraffur" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill={FARBE.ueber} fillOpacity="0.28" />
            <line x1="0" y1="0" x2="0" y2="6" stroke={FARBE.ueber} strokeWidth="2.2" />
          </pattern>
        </defs>

        {Array.from({ length: Math.round(max / schritt) + 1 }, (_, i) => i * schritt).map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={FARBE.raster} />
            <text x={P.l - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-500 text-[11px]">
              {fmt(v)}
            </text>
          </g>
        ))}
        <text x={P.l - 8} y={P.t - 8} textAnchor="end" className="fill-ink-500 text-[11px]">kW</text>
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].filter((h) => !schmal || h % 6 === 0).map((h) => (
          <text key={h} x={x(h * 4)} y={H - P.b + 20} textAnchor={h === 24 ? "end" : h === 0 ? "start" : "middle"} className="fill-ink-500 text-[11px]">
            {h === 24 ? "24 Uhr" : `${h}`}
          </text>
        ))}

        <path d={flaecheOhne} fill="url(#rg-peak-flaeche)" className="rg-pfad" />
        {leistung > 0 && <path key={`e-${monat}`} d={pEntladen} fill="url(#rg-peak-schraffur)" className="rg-pfad rg-einblenden" />}
        {leistung > 0 && pLaden && <path d={pLaden} fill={FARBE.laden} fillOpacity="0.18" className="rg-pfad" />}
        <path d={pOhne} fill="none" stroke={FARBE.ohne} strokeWidth="1.5" strokeLinejoin="round" className="rg-pfad" />
        {leistung > 0 && (
          <path key={`m-${monat}-${Math.round(aktivSchwelle)}`} d={pMit} pathLength="1" fill="none" stroke={FARBE.mit} strokeWidth="2.75" strokeLinejoin="round" className="rg-zeichnen" />
        )}

        {/* Schwelle */}
        <line x1={P.l} x2={W - P.r} y1={y(schwelle)} y2={y(schwelle)} stroke={FARBE.schwelle} strokeWidth="1.25" strokeDasharray="6 5" className="rg-pfad" />
        <g transform={`translate(${W - P.r - (schmal ? 96 : 118)}, ${Math.max(y(schwelle) - 24, 2)})`}>
          <rect width={schmal ? 96 : 118} height="20" rx="10" fill={FARBE.schwelle} />
          <text x={(schmal ? 96 : 118) / 2} y="14" textAnchor="middle" className="fill-white text-[11px] font-semibold">
            {`Ziel ${fmt(schwelle)} kW`}
          </text>
        </g>

        {/* Spitze markieren */}
        <g className="rg-einblenden">
          <circle cx={x(qMax + 0.5)} cy={y(spitze)} r="9" fill={FARBE.ueber} className="rg-puls" />
          <circle cx={x(qMax + 0.5)} cy={y(spitze)} r="4.5" fill="#fff" stroke={FARBE.ueber} strokeWidth="2.5" />
        </g>

        {aktiv != null && (
          <g pointerEvents="none">
            <line x1={x(aktiv + 0.5)} x2={x(aktiv + 0.5)} y1={P.t} y2={H - P.b} stroke="#97a0b0" strokeDasharray="2 3" />
            <circle cx={x(aktiv + 0.5)} cy={y(kurve[aktiv])} r="3.5" fill="#fff" stroke={FARBE.ohne} strokeWidth="2" />
            {leistung > 0 && <circle cx={x(aktiv + 0.5)} cy={y(sp.netz[aktiv])} r="4" fill={FARBE.mit} stroke="#fff" strokeWidth="2" />}
          </g>
        )}
        <rect x={0} y={0} width={W} height={H} fill="transparent" onPointerMove={(e) => setHover(ausZeiger(e))} onPointerLeave={() => setHover(null)} />
      </svg>

      {aktiv != null && (
        <Tooltip x={x(aktiv + 0.5)} y={Math.max(y(kurve[aktiv]) - 80, 0)} breite={W}>
          <p className="font-semibold">{uhr(aktiv)} Uhr</p>
          <p className="text-white/70">Last <span className="ov-num font-semibold text-white">{fmt(kurve[aktiv])} kW</span></p>
          {leistung > 0 && (
            <>
              <p className="text-white/70">Netzbezug <span className="ov-num font-semibold text-white">{fmt(sp.netz[aktiv])} kW</span></p>
              {sp.entladen[aktiv] > 0 && <p className="text-white/70">Speicher liefert <span className="ov-num font-semibold text-sun-300">{fmt(sp.entladen[aktiv])} kW</span></p>}
              {sp.laden[aktiv] > 0 && <p className="text-white/70">Speicher lädt <span className="ov-num font-semibold text-navy-200">{fmt(sp.laden[aktiv])} kW</span></p>}
            </>
          )}
        </Tooltip>
      )}

      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 px-3 text-[12.5px] text-ink-600">
        <li className="flex items-center gap-2"><span className="h-[3px] w-5 rounded-full bg-ink-400" aria-hidden="true" />Last ohne Speicher</li>
        {leistung > 0 && <li className="flex items-center gap-2"><span className="h-[3px] w-5 rounded-full bg-ov-500" aria-hidden="true" />Netzbezug mit Speicher</li>}
        {leistung > 0 && <li className="flex items-center gap-2"><span className="h-3 w-4 rounded-[3px] bg-sun-400/60 ring-1 ring-sun-500" aria-hidden="true" />Speicher kappt</li>}
        {leistung > 0 && <li className="flex items-center gap-2"><span className="h-3 w-4 rounded-[3px] bg-navy-400/25 ring-1 ring-navy-300" aria-hidden="true" />Nachladen unter der Schwelle</li>}
      </ul>
    </div>
  );
}

/** Monatsspitzen vorher/nachher – mit Umschaltung auf die Abrechnungsstruktur ab 2027 */
export function PeakMonate({ spitzen, gekappt, ziel, lp, ansicht, monat, onMonat }) {
  const max = Math.max(...spitzen) * 1.08 || 1;
  const kurz = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const lang = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  return (
    <div className="px-4 pb-5 pt-4 md:px-6">
      <div className="relative h-44">
        <div className="pointer-events-none absolute inset-x-0 z-10 border-t-[1.5px] border-dashed border-navy-950/70 rg-pfad" style={{ bottom: `${p2((ziel / max) * 100)}%` }} aria-hidden="true" />
        <ul className="grid h-full grid-cols-12 items-end gap-1 sm:gap-2">
          {spitzen.map((s, m) => {
            const g = gekappt[m];
            const aktiv = m === monat;
            const wert = ansicht === "2027" ? `Ersparnis ${euro((s - g) * (lp / 12))}` : `${fmt(s)} → ${fmt(g)} kW`;
            return (
              <li key={m} className="h-full">
                <button
                  type="button"
                  onClick={() => onMonat(m)}
                  aria-pressed={aktiv}
                  aria-label={`${MONATE_LANG[m]}: ${wert}`}
                  title={`${MONATE_LANG[m]}: ${wert}`}
                  className={cn("flex h-full w-full items-end justify-center gap-[2px] rounded-lg transition-colors", aktiv ? "bg-ov-50 ring-1 ring-ov-200" : "hover:bg-ink-50")}
                >
                  <span className="rg-balken w-[40%] max-w-4 rounded-t-[4px] bg-ink-300" style={{ height: `${p2((s / max) * 100)}%` }} />
                  <span className={cn("rg-balken w-[40%] max-w-4 rounded-t-[4px]", aktiv ? "bg-ov-600" : "bg-ov-500")} style={{ height: `${p2((g / max) * 100)}%` }} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <ul className="mt-1.5 grid grid-cols-12 gap-1 sm:gap-2" aria-hidden="true">
        {spitzen.map((s, m) => (
          <li key={m} className="text-center">
            <span className={cn("block text-[11px] font-semibold", m === monat ? "text-ov-700" : "text-ink-500")}>
              <span className="sm:hidden">{kurz[m]}</span>
              <span className="hidden sm:inline">{lang[m]}</span>
            </span>
            {ansicht === "2027" && <span className="ov-num hidden text-[10.5px] text-ink-600 md:block">{fmt(Math.round((s - gekappt[m]) * (lp / 12)))}</span>}
          </li>
        ))}
      </ul>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-ink-600">
        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ink-300" aria-hidden="true" />Monatsspitze heute</li>
        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-500" aria-hidden="true" />mit Peak Shaving</li>
        <li className="flex items-center gap-2"><span className="w-5 border-t-[1.5px] border-dashed border-navy-950/70" aria-hidden="true" />Ziel</li>
        {ansicht === "2027" && <li className="text-ink-500">Zahlen = Ersparnis je Monat in € (Platzhalter: Leistungspreis 2026 ÷ 12)</li>}
      </ul>
    </div>
  );
}
