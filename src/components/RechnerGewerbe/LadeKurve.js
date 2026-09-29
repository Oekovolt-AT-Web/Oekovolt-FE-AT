"use client";

import { useState } from "react";
import { cn } from "@/components/ui/cn";
import { Tooltip, useBreite } from "@/components/Rechner/bausteine";
import { useEinblenden, useReihenUebergang } from "./FlotteLadeBausteine";
import { DT, SCHRITTE, fensterSchritte } from "@/lib/rechner/ladeinfrastruktur";
import { fmt } from "@/lib/rechner/annahmen";

export const LADE_FARBEN = {
  gebaeude: "#b2cbe9", // navy-200
  laden: "#669933", // ov-500
  pv: "#ffc53d", // sun-400
  netz: "#03122b", // navy-950
  grenze: "#f5a70f", // sun-500
  flotte: "#436621",
  mitarbeitende: "#8cba58",
  kunden: "#4a7cbd",
};

const uhr = (h) => {
  const s = Math.floor(h);
  const m = Math.round((h - s) * 60);
  return `${String(s % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

function schritt(max) {
  const roh = max / 4;
  const p = Math.pow(10, Math.floor(Math.log10(Math.max(roh, 1))));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= roh) || 10 * p;
}

/**
 * Tageslastkurve am Netzanschluss (24 h, 15-min-Schritte): Gebäudelast, Laden
 * (gestapelt), PV-Erzeugung und resultierender Netzbezug, dazu Anschlussgrenze
 * und Ladefenster der Nutzergruppen. Wechsel zwischen den Szenarien wird animiert.
 */
const NULLEN = new Array(SCHRITTE).fill(0);

export default function LadeKurve({ gebaeude, laden, pv, speicher = NULLEN, anschluss, gruppen = [], label }) {
  const [ref, W] = useBreite(720);
  const [sichtRef, fortschritt] = useEinblenden(1300);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;

  // speicher: + laden / − entladen (kW) – wirkt nur auf den Netzbezug
  const flach = useReihenUebergang([...gebaeude, ...laden, ...pv, ...speicher]);
  const g = flach.slice(0, SCHRITTE);
  const l = flach.slice(SCHRITTE, 2 * SCHRITTE);
  const p = flach.slice(2 * SCHRITTE, 3 * SCHRITTE);
  const sp = flach.slice(3 * SCHRITTE, 4 * SCHRITTE);
  const netz = g.map((v, i) => v + l[i] - p[i] + sp[i]);
  const mitSpeicher = sp.some((v) => Math.abs(v) > 0.5);

  const bandH = 16;
  const baender = gruppen.filter((x) => x.fenster?.length);
  const oberkante = 14 + baender.length * (bandH + 4);
  const H = (schmal ? 250 : 300) + oberkante;
  const P = { l: schmal ? 40 : 52, r: schmal ? 10 : 18, t: oberkante + 10, b: 30 };
  const maxWert = Math.max(...g.map((v, i) => v + l[i]), ...p, anschluss * 1.12, 10);
  const st = schritt(maxWert);
  const oben = Math.ceil(maxWert / st) * st;
  const x = (i) => Math.round((P.l + (i / SCHRITTE) * (W - P.l - P.r)) * 10) / 10;
  const y = (v) => Math.round((P.t + (1 - v / oben) * (H - P.t - P.b)) * 10) / 10;

  // Treppenfreie Linien: Punkt in der Mitte jeder Viertelstunde, Ränder bei 0 und 24 Uhr
  const pfad = (werte, basis) => {
    const pts = werte.map((v, i) => [x(i + 0.5), y(v + (basis ? basis[i] : 0))]);
    pts.unshift([x(0), pts[0][1]]);
    pts.push([x(SCHRITTE), pts[pts.length - 1][1]]);
    return pts.map(([a, b], i) => `${i ? "L" : "M"}${a},${b}`).join(" ");
  };
  const flaeche = (werte, basis) => {
    const oberLinie = pfad(werte, basis);
    const unter = basis
      ? [...basis.map((v, i) => [x(i + 0.5), y(v)])].reverse()
      : [
          [x(SCHRITTE), y(0)],
          [x(0), y(0)],
        ];
    if (basis) {
      unter.unshift([x(SCHRITTE), y(basis[SCHRITTE - 1])]);
      unter.push([x(0), y(basis[0])]);
    }
    return `${oberLinie} ${unter.map(([a, b]) => `L${a},${b}`).join(" ")} Z`;
  };

  const ticksY = Array.from({ length: Math.round(oben / st) + 1 }, (_, i) => i * st);
  const ticksX = schmal ? [0, 6, 12, 18, 24] : [0, 3, 6, 9, 12, 15, 18, 21, 24];
  const spitzeI = netz.reduce((m, v, i) => (v > netz[m] ? i : m), 0);
  const spitze = netz[spitzeI];
  const ueber = spitze > anschluss;
  const clipId = "ov-lade-clip";

  const ausZeiger = (ev) => {
    const box = ev.currentTarget.getBoundingClientRect();
    const px = ((ev.clientX - box.left) / box.width) * W;
    return Math.max(0, Math.min(SCHRITTE - 1, Math.floor(((px - P.l) / (W - P.l - P.r)) * SCHRITTE)));
  };

  return (
    <div
      ref={(el) => {
        ref.current = el;
        sichtRef.current = el;
      }}
      className="relative px-2 pb-4 md:px-3"
    >
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block touch-pan-y select-none"
        role="img"
        aria-label={`${label}: höchster Netzbezug ${fmt(Math.round(spitze))} kW um ${uhr(spitzeI * DT)} Uhr, Anschlussleistung ${fmt(anschluss)} kW.`}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={P.l + (W - P.l) * fortschritt} height={H} />
          </clipPath>
          <linearGradient id="ov-lade-laden" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={LADE_FARBEN.laden} stopOpacity="0.95" />
            <stop offset="100%" stopColor={LADE_FARBEN.laden} stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="ov-lade-pv" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={LADE_FARBEN.pv} stopOpacity="0.55" />
            <stop offset="100%" stopColor={LADE_FARBEN.pv} stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Ladefenster der Gruppen */}
        {baender.map((b, k) => {
          const yb = 6 + k * (bandH + 4);
          return (
            <g key={b.id}>
              {b.fenster.map((f, j) => {
                const s = fensterSchritte(f.fenster);
                // Fenster über Mitternacht in zusammenhängende Stücke teilen
                const stuecke = [];
                let start = s[0];
                let vorher = s[0];
                for (let n = 1; n < s.length; n++) {
                  if (s[n] !== vorher + 1) {
                    stuecke.push([start, vorher + 1]);
                    start = s[n];
                  }
                  vorher = s[n];
                }
                stuecke.push([start, vorher + 1]);
                return stuecke.map(([a, e], m) => (
                  <rect key={`${j}-${m}`} x={x(a)} y={yb} width={Math.max(x(e) - x(a), 2)} height={bandH} rx="5" fill={LADE_FARBEN[b.id]} opacity="0.18" />
                ));
              })}
              <text x={P.l + 6} y={yb + 12} className="text-[10.5px] font-semibold" fill={LADE_FARBEN[b.id]}>
                {b.label} · {b.standzeit?.sub}
              </text>
            </g>
          );
        })}

        {ticksY.map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="#eef0f4" />
            <text x={P.l - 7} y={y(t) + 4} textAnchor="end" className="fill-ink-500 text-[11px]">
              {fmt(t)}
            </text>
          </g>
        ))}
        <text x={P.l - 7} y={y(oben) - 12} textAnchor="end" className="fill-ink-500 text-[10.5px] font-semibold">
          kW
        </text>
        {ticksX.map((h) => (
          <text key={h} x={x(h / DT)} y={H - 9} textAnchor={h === 0 ? "start" : h === 24 ? "end" : "middle"} className="fill-ink-500 text-[11px]">
            {`${h} h`}
          </text>
        ))}

        <g clipPath={`url(#${clipId})`}>
          <path d={flaeche(p)} fill="url(#ov-lade-pv)" />
          <path d={flaeche(g)} fill={LADE_FARBEN.gebaeude} opacity="0.75" />
          <path d={flaeche(l, g)} fill="url(#ov-lade-laden)" />
          <path d={pfad(p)} fill="none" stroke={LADE_FARBEN.grenze} strokeWidth="1.75" strokeDasharray="2 3" />
          <path d={pfad(netz)} fill="none" stroke={LADE_FARBEN.netz} strokeWidth="2.25" strokeLinejoin="round" />
        </g>

        {/* Anschlussgrenze */}
        <line x1={P.l} x2={W - P.r} y1={y(anschluss)} y2={y(anschluss)} stroke={LADE_FARBEN.grenze} strokeWidth="2" strokeDasharray="7 5" />
        <rect x={W - P.r - (schmal ? 118 : 142)} y={y(anschluss) - 22} width={schmal ? 118 : 142} height="18" rx="9" fill="#fff" stroke={LADE_FARBEN.grenze} />
        <text x={W - P.r - (schmal ? 59 : 71)} y={y(anschluss) - 9.5} textAnchor="middle" className="fill-ink-800 text-[11px] font-semibold">
          {`Anschluss ${fmt(anschluss)} kW`}
        </text>

        {/* Spitze */}
        {fortschritt > 0.95 && (
          <g className="motion-safe:animate-[ov-tab-ein_400ms_ease-out_both]">
            <circle cx={x(spitzeI + 0.5)} cy={y(spitze)} r="6" fill="#fff" stroke={ueber ? LADE_FARBEN.grenze : LADE_FARBEN.netz} strokeWidth="2.5" />
            {!schmal && (
              <text x={x(spitzeI + 0.5)} y={y(spitze) - 12} textAnchor={spitzeI > SCHRITTE * 0.8 ? "end" : spitzeI < SCHRITTE * 0.2 ? "start" : "middle"} className="fill-ink-900 text-[11.5px] font-bold">
                {`Spitze ${fmt(Math.round(spitze))} kW`}
              </text>
            )}
          </g>
        )}

        {hover != null && <line x1={x(hover + 0.5)} x2={x(hover + 0.5)} y1={P.t} y2={H - P.b} stroke="#97a0b0" strokeDasharray="2 3" />}
        <rect x={0} y={0} width={W} height={H} fill="transparent" onPointerMove={(ev) => setHover(ausZeiger(ev))} onPointerLeave={() => setHover(null)} onClick={(ev) => setHover(ausZeiger(ev))} />
      </svg>

      {hover != null && (
        <Tooltip x={x(hover + 0.5)} y={Math.max(y(g[hover] + l[hover]) - 70, 0)} breite={W}>
          <p className="font-semibold">
            {uhr(hover * DT)}–{uhr((hover + 1) * DT)} Uhr
          </p>
          <p className="text-white/70">
            Gebäude <span className="ov-num font-semibold text-white">{fmt(Math.round(g[hover]))} kW</span>
          </p>
          <p className="text-white/70">
            Laden <span className="ov-num font-semibold text-white">{fmt(Math.round(l[hover]))} kW</span>
          </p>
          {Math.abs(sp[hover]) > 0.5 && (
            <p className="text-white/70">
              Speicher <span className="ov-num font-semibold text-white">{sp[hover] > 0 ? "lädt" : "liefert"} {fmt(Math.round(Math.abs(sp[hover])))} kW</span>
            </p>
          )}
          {p[hover] > 0.5 && (
            <p className="text-white/70">
              PV <span className="ov-num font-semibold text-sun-300">−{fmt(Math.round(p[hover]))} kW</span>
            </p>
          )}
          <p className={cn("ov-num font-semibold", netz[hover] > anschluss ? "text-sun-300" : "text-ov-300")}>Netzbezug {fmt(Math.round(Math.max(0, netz[hover])))} kW</p>
        </Tooltip>
      )}

      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 px-3 text-[12.5px] text-ink-600">
        <li className="flex items-center gap-2">
          <span className="h-3 w-4 rounded-[3px]" style={{ background: LADE_FARBEN.gebaeude }} aria-hidden="true" />
          Gebäude
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-4 rounded-[3px] bg-ov-500" aria-hidden="true" />
          Laden
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-4 rounded-[3px] bg-sun-300/60" aria-hidden="true" />
          PV-Erzeugung
        </li>
        <li className="flex items-center gap-2">
          <span className="h-[3px] w-5 rounded-full bg-navy-950" aria-hidden="true" />
          {mitSpeicher ? "Netzbezug mit Speicher" : "Netzbezug"}
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 border-t-2 border-dashed border-sun-500" aria-hidden="true" />
          Anschlussleistung
        </li>
      </ul>
    </div>
  );
}
