"use client";

import { useState } from "react";
import { Tooltip, useBreite } from "@/components/Rechner/bausteine";
import { fmt } from "@/lib/rechner/annahmen";

const FARBE = { pv: "#f5a70f", speicher: "#669933", aggregat: "#0b4488", offen: "#c4cad5", soc: "#03122b", raster: "#eef0f4" };
const r1 = (v) => Math.round(v * 10) / 10;

/**
 * Überbrückung Stunde für Stunde: gestapelte Balken (PV, Speicher, Aggregat,
 * ungedeckt) und Ladezustand des Speichers als Linie.
 */
export function BlackoutVerlauf({ verlauf, mitSpeicher }) {
  const [ref, W] = useBreite(720);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 240 : 280;
  const P = { l: schmal ? 36 : 46, r: mitSpeicher ? (schmal ? 42 : 46) : 14, t: 30, b: 34 };
  const n = verlauf.length;
  const maxLast = Math.max(1, ...verlauf.map((v) => v.last));
  const top = Math.ceil((maxLast * 1.1) / 10) * 10;
  const bw = (W - P.l - P.r) / n;
  const x = (i) => r1(P.l + i * bw);
  const y = (v) => r1(P.t + (1 - v / top) * (H - P.t - P.b));
  const ySoc = (s) => r1(P.t + (1 - s) * (H - P.t - P.b));
  const luecke = Math.max(0.5, Math.min(3, bw * 0.18));
  const schritt = n <= 12 ? 1 : n <= 24 ? (schmal ? 4 : 2) : n <= 48 ? (schmal ? 12 : 6) : 12;
  const socPfad = verlauf.map((v, i) => `${i ? "L" : "M"}${r1(x(i) + bw / 2)},${ySoc(v.soc)}`).join(" ");
  const aktiv = hover != null ? verlauf[hover] : null;

  const ausZeiger = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    return Math.max(0, Math.min(n - 1, Math.floor((px - P.l) / bw)));
  };

  return (
    <div ref={ref} className="relative px-2 pb-4 md:px-3">
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} className="block touch-pan-y select-none" role="img" aria-label={`Überbrückung über ${n} Stunden: Anteile von Photovoltaik, Speicher und Aggregat je Stunde.`}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={P.l} x2={W - P.r} y1={y(top * f)} y2={y(top * f)} stroke={FARBE.raster} />
            <text x={P.l - 7} y={y(top * f) + 4} textAnchor="end" className="fill-ink-500 text-[11px]">{fmt(top * f)}</text>
            {mitSpeicher && <text x={W - P.r + 7} y={y(top * f) + 4} className="fill-ink-500 text-[11px]">{`${f * 100} %`}</text>}
          </g>
        ))}
        <text x={P.l - 7} y={P.t - 14} textAnchor="end" className="fill-ink-500 text-[11px]">kW</text>
        {verlauf.map((v, i) =>
          i % schritt === 0 ? (
            <text key={`t${i}`} x={r1(x(i) + bw / 2)} y={H - P.b + 18} textAnchor="middle" className="fill-ink-500 text-[11px]">
              {`${String(v.stunde).padStart(2, "0")}h`}
            </text>
          ) : null
        )}
        {verlauf.map((v, i) => {
          let unten = 0;
          const teile = [
            ["pv", v.pv],
            ["speicher", v.speicher],
            ["aggregat", v.aggregat],
            ["offen", v.offen],
          ];
          return (
            <g key={i} className="rg-einblenden" style={{ animationDelay: `${Math.min(i * 18, 900)}ms` }}>
              {teile.map(([k, wert]) => {
                if (wert <= 0.01) return null;
                const y0 = y(unten + wert);
                const h = r1(y(unten) - y0);
                unten += wert;
                return <rect key={k} x={r1(x(i) + luecke / 2)} y={y0} width={r1(Math.max(1, bw - luecke))} height={Math.max(0.5, h)} rx={bw > 10 ? 2 : 0.5} fill={FARBE[k]} fillOpacity={k === "offen" ? 1 : 0.9} />;
              })}
            </g>
          );
        })}
        {mitSpeicher && <path key={`soc-${n}-${verlauf[0]?.stunde}`} d={socPfad} pathLength="1" fill="none" stroke={FARBE.soc} strokeWidth="2" strokeDasharray="1" strokeLinejoin="round" className="rg-zeichnen" />}
        {hover != null && <rect x={x(hover)} y={P.t} width={r1(bw)} height={H - P.t - P.b} fill="#03122b" fillOpacity="0.06" pointerEvents="none" />}
        <rect x={0} y={0} width={W} height={H} fill="transparent" onPointerMove={(e) => setHover(ausZeiger(e))} onPointerLeave={() => setHover(null)} />
      </svg>
      {aktiv && (
        <Tooltip x={x(hover) + bw / 2} y={20} breite={W}>
          <p className="font-semibold">
            Stunde {hover + 1} · {String(aktiv.stunde).padStart(2, "0")}:00 Uhr
          </p>
          <p className="text-white/70">Last <span className="ov-num font-semibold text-white">{fmt(aktiv.last)} kW</span></p>
          {aktiv.pv > 0.01 && <p className="text-white/70">PV <span className="ov-num font-semibold text-sun-300">{fmt(aktiv.pv)} kW</span></p>}
          {aktiv.speicher > 0.01 && <p className="text-white/70">Speicher <span className="ov-num font-semibold text-ov-300">{fmt(aktiv.speicher)} kW</span></p>}
          {aktiv.aggregat > 0.01 && <p className="text-white/70">Aggregat <span className="ov-num font-semibold text-navy-200">{fmt(aktiv.aggregat)} kW</span></p>}
          {aktiv.offen > 0.01 && <p className="text-white/70">ungedeckt <span className="ov-num font-semibold text-sun-300">{fmt(aktiv.offen)} kW</span></p>}
          {mitSpeicher && <p className="text-white/70">Ladezustand <span className="ov-num font-semibold text-white">{fmt(aktiv.soc * 100)} %</span></p>}
        </Tooltip>
      )}
      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 px-3 text-[12.5px] text-ink-600">
        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-sun-500" aria-hidden="true" />Photovoltaik</li>
        {mitSpeicher && <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-500" aria-hidden="true" />Speicher</li>}
        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-navy-600" aria-hidden="true" />Aggregat</li>
        <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ink-300" aria-hidden="true" />ungedeckt (Stillstand)</li>
        {mitSpeicher && <li className="flex items-center gap-2"><span className="h-[2px] w-5 bg-navy-950" aria-hidden="true" />Ladezustand (rechte Achse)</li>}
      </ul>
    </div>
  );
}
