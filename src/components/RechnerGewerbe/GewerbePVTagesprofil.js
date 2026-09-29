"use client";

import { useState } from "react";
import { useBreite } from "@/components/Rechner/bausteine";
import { fmt } from "@/lib/rechner/annahmen";
import { Umschalter, useEingeblendet } from "./GewerbePVBausteine";

/**
 * Tagesprofil Erzeugung vs. Last (mittlerer Betriebstag im Juli bzw. Jänner).
 * Gelb = PV-Erzeugung, Linie = Last, Grün = direkt genutzter Solarstrom.
 */
export default function GewerbePVTagesprofil({ profil }) {
  const [saison, setSaison] = useState("sommer");
  const [ref, W0] = useBreite(720);
  const W = Math.max(W0, 280);
  const an = useEingeblendet(150);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 220 : 260;
  const P = { l: schmal ? 44 : 54, r: 12, t: 18, b: 30 };
  const s = profil[saison];
  // gemeinsame Skala für Sommer und Winter – der Unterschied soll sichtbar sein
  const max = Math.max(...profil.sommer.pv, ...profil.sommer.last, ...profil.winter.pv, ...profil.winter.last, 1) * 1.08;
  const x = (h) => Math.round((P.l + (h / 23) * (W - P.l - P.r)) * 10) / 10;
  const y = (v) => Math.round((P.t + (1 - v / max) * (H - P.t - P.b)) * 10) / 10;
  const faktor = an ? 1 : 0;
  const linie = (werte) => werte.map((v, h) => `${h ? "L" : "M"}${x(h)},${y(v * faktor)}`).join(" ");
  const flaeche = (werte) => `${linie(werte)} L${x(23)},${y(0)} L${x(0)},${y(0)} Z`;
  const direkt = s.pv.map((v, h) => Math.min(v, s.last[h]));
  const summe = (a) => a.reduce((x1, x2) => x1 + x2, 0);
  const anteil = summe(s.pv) > 0 ? summe(direkt) / summe(s.pv) : 0;
  const deckung = summe(s.last) > 0 ? summe(direkt) / summe(s.last) : 0;
  const tickSchritt = max > 800 ? 200 : max > 400 ? 100 : max > 150 ? 50 : max > 60 ? 20 : 10;
  const ticks = [];
  for (let v = 0; v <= max; v += tickSchritt) ticks.push(v);
  const trans = { transition: "d 650ms cubic-bezier(.22,1,.36,1)" };
  const aktiv = hover != null ? { h: hover, pv: s.pv[hover], last: s.last[hover] } : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-3 md:px-6">
        <p className="text-[13px] text-ink-500">
          Mittlerer Betriebstag im {saison === "sommer" ? "Juli" : "Jänner"} · direkt genutzt <strong className="ov-num text-ink-800">{fmt(anteil * 100)} %</strong> der Erzeugung, deckt{" "}
          <strong className="ov-num text-ink-800">{fmt(deckung * 100)} %</strong> der Last
        </p>
        <Umschalter
          label="Jahreszeit"
          wert={saison}
          onChange={setSaison}
          optionen={[
            { id: "sommer", label: "Sommer" },
            { id: "winter", label: "Winter" },
          ]}
        />
      </div>
      <div ref={ref} className="relative px-2 pb-3 pt-2 md:px-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          className="block touch-pan-y select-none"
          role="img"
          aria-label={`Tagesprofil ${saison === "sommer" ? "Juli" : "Jänner"}: Spitze der PV-Erzeugung ${fmt(Math.max(...s.pv))} kW, Last bis ${fmt(Math.max(...s.last))} kW`}
          onPointerLeave={() => setHover(null)}
          onPointerMove={(e) => {
            const b = e.currentTarget.getBoundingClientRect();
            const px = ((e.clientX - b.left) / b.width) * W;
            setHover(Math.max(0, Math.min(23, Math.round(((px - P.l) / (W - P.l - P.r)) * 23))));
          }}
        >
          <defs>
            <linearGradient id="gpv-sonne" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffc53d" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffd873" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#c4cad5" : "#eef0f4"} />
              <text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-400 text-[11px]">
                {fmt(t)}
              </text>
            </g>
          ))}
          <text x={P.l - 8} y={P.t - 6} textAnchor="end" className="fill-ink-400 text-[10.5px]">kW</text>
          {[0, 6, 12, 18, 23].map((h) => (
            <text key={h} x={x(h)} y={H - 9} textAnchor={h === 23 ? "end" : "middle"} className="fill-ink-400 text-[11px]">
              {h === 23 ? "24 Uhr" : `${h}`}
            </text>
          ))}
          <path d={flaeche(s.pv)} fill="url(#gpv-sonne)" style={trans} />
          <path d={flaeche(direkt)} fill="#669933" fillOpacity="0.35" style={trans} />
          <path d={linie(s.pv)} fill="none" stroke="#f5a70f" strokeWidth="2" style={trans} />
          <path d={linie(s.last)} fill="none" stroke="#003473" strokeWidth="2.5" strokeLinejoin="round" style={trans} />
          {aktiv && (
            <g pointerEvents="none">
              <line x1={x(aktiv.h)} x2={x(aktiv.h)} y1={P.t} y2={H - P.b} stroke="#97a0b0" strokeDasharray="2 3" />
              <circle cx={x(aktiv.h)} cy={y(aktiv.pv)} r="4" fill="#fff" stroke="#f5a70f" strokeWidth="2" />
              <circle cx={x(aktiv.h)} cy={y(aktiv.last)} r="4" fill="#fff" stroke="#003473" strokeWidth="2" />
            </g>
          )}
        </svg>
        {aktiv && (
          <div
            role="status"
            className="pointer-events-none absolute top-3 z-10 w-[180px] rounded-xl bg-ink-900 px-3.5 py-2.5 text-[12.5px] text-white shadow-xl"
            style={{ left: `${Math.min(Math.max((x(aktiv.h) / W) * 100, 20), 80)}%`, transform: "translateX(-50%)" }}
          >
            <p className="font-semibold">
              {aktiv.h}–{aktiv.h + 1} Uhr
            </p>
            <p className="flex justify-between text-white/70">
              PV <span className="ov-num font-semibold text-sun-300">{fmt(aktiv.pv)} kW</span>
            </p>
            <p className="flex justify-between text-white/70">
              Last <span className="ov-num font-semibold text-white">{fmt(aktiv.last)} kW</span>
            </p>
          </div>
        )}
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 px-5 pb-5 text-[12.5px] text-ink-600 md:px-6">
        <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-4 rounded-[3px] bg-sun-300" />PV-Erzeugung</li>
        <li className="flex items-center gap-2"><span aria-hidden="true" className="h-[3px] w-5 rounded-full bg-navy-700" />Last Betrieb</li>
        <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-4 rounded-[3px] bg-ov-500/40" />direkt genutzt</li>
      </ul>
    </div>
  );
}
