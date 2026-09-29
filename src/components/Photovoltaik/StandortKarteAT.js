"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Sun } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { AT_KARTE, AT_KARTE_QUELLE, BUNDESLAND_PFADE, projiziereAT } from "@/components/Region/oesterreichKarte";

/**
 * Österreich-Karte mit allen Standorten der Regionalseiten.
 * Punkte an echten Koordinaten (PVGIS-Referenzpunkt je Ort), eingefärbt nach
 * simuliertem Jahresertrag (Süd, 35°) im Stil einer Heatmap; Filter nach Bundesland.
 *
 * props:
 *  orte     [{ slug, name, land, bundesland, lat, lon, ertrag, km, heimat }]
 *  laender  [{ land, name, anzahl }]
 *  quelle   Text der PVGIS-Quelle
 */

// Farbskala niedrig → hoch: Navy-Blau → Markengrün → Sonnengelb
const STOPS = [
  [0, [74, 124, 189]],
  [0.5, [140, 186, 88]],
  [1, [255, 197, 61]],
];
function farbe(t) {
  const x = Math.max(0, Math.min(1, t));
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i];
    const [t0, c0] = STOPS[i - 1];
    if (x <= t1) {
      const f = (x - t0) / (t1 - t0);
      return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * f)).join(",")})`;
    }
  }
  return "rgb(255,197,61)";
}
const de = (n) => Number(n).toLocaleString("de-DE");

export default function StandortKarteAT({ orte = [], laender = [], quelle }) {
  const [land, setLand] = useState("alle");
  const [aktiv, setAktiv] = useState(null);

  const min = Math.min(...orte.map((o) => o.ertrag));
  const max = Math.max(...orte.map((o) => o.ertrag));
  const t = (e) => (e - min) / (max - min || 1);

  const punkte = useMemo(() => orte.map((o) => ({ ...o, ...projiziereAT(o.lat, o.lon) })).sort((a, b) => a.ertrag - b.ertrag), [orte]);
  const sichtbar = land === "alle" ? punkte : punkte.filter((p) => p.land === land);
  const liste = [...sichtbar].sort((a, b) => b.ertrag - a.ertrag);
  const gewaehlt = punkte.find((p) => p.slug === aktiv) || null;
  const schnitt = Math.round(sichtbar.reduce((s, p) => s + p.ertrag, 0) / (sichtbar.length || 1));

  return (
    <div className="overflow-hidden rounded-[2rem] bg-navy-900/50 ring-1 ring-white/10 backdrop-blur">
      {/* Filter */}
      <div className="border-b border-white/10 p-4 md:p-5">
        <div role="group" aria-label="Nach Bundesland filtern" className="ov-no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {[{ land: "alle", name: "Ganz Österreich", anzahl: orte.length }, ...laender].map((l) => (
            <button
              key={l.land}
              type="button"
              aria-pressed={land === l.land}
              onClick={() => {
                setLand(l.land);
                setAktiv(null);
              }}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition-all duration-300",
                land === l.land ? "bg-white text-navy-950 shadow-lg" : "bg-white/[0.06] text-white/75 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              {l.name}
              <span className={cn("ov-num rounded-full px-1.5 text-[11.5px]", land === l.land ? "bg-navy-950/10" : "bg-white/10")}>{l.anzahl}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px]">
        {/* Karte */}
        <div className="relative p-3 md:p-6">
          <svg viewBox={`0 0 ${AT_KARTE.breite} ${AT_KARTE.hoehe}`} className="block h-auto w-full" role="img" aria-label={`Karte Österreich mit ${sichtbar.length} Standorten, eingefärbt nach simuliertem PV-Jahresertrag`}>
            <defs>
              <filter id="at-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
              <linearGradient id="at-land" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#0f3266" />
                <stop offset="1" stopColor="#06193a" />
              </linearGradient>
            </defs>
            {/* Bundesländer */}
            {Object.entries(BUNDESLAND_PFADE).map(([id, d]) => {
              const an = land === id;
              const aus = land !== "alle" && !an;
              return (
                <path
                  key={id}
                  d={d}
                  onClick={() => setLand(an ? "alle" : id)}
                  className="cursor-pointer transition-all duration-500"
                  fill={an ? "#123a73" : "url(#at-land)"}
                  fillOpacity={aus ? 0.45 : 1}
                  stroke={an ? "rgba(174,208,131,0.9)" : "rgba(255,255,255,0.18)"}
                  strokeWidth={an ? 2 : 1}
                  strokeLinejoin="round"
                />
              );
            })}
            {/* Heatmap-Schein */}
            <g filter="url(#at-glow)" style={{ mixBlendMode: "screen" }}>
              {sichtbar.map((p) => (
                <circle key={p.slug} cx={p.x} cy={p.y} r={20 + t(p.ertrag) * 26} fill={farbe(t(p.ertrag))} fillOpacity={0.8} />
              ))}
            </g>
            {/* Punkte */}
            {punkte.map((p) => {
              const an = sichtbar.includes(p);
              const sel = aktiv === p.slug;
              return (
                <g
                  key={p.slug}
                  role="button"
                  tabIndex={an ? 0 : -1}
                  aria-label={`${p.name}: ${de(p.ertrag)} kWh je kWp`}
                  onClick={() => setAktiv(p.slug)}
                  onMouseEnter={() => setAktiv(p.slug)}
                  onFocus={() => setAktiv(p.slug)}
                  onKeyDown={(e) => e.key === "Enter" && setAktiv(p.slug)}
                  className={cn("cursor-pointer outline-none transition-opacity duration-500", !an && "pointer-events-none opacity-15")}
                >
                  {p.heimat && (
                    <circle cx={p.x} cy={p.y} r="10" fill="none" stroke="#fff" strokeOpacity="0.8">
                      <animate attributeName="r" values="8;24;8" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={p.x} cy={p.y} r={sel ? 9 : p.heimat ? 8 : 5.5} fill={p.heimat ? "#ffffff" : farbe(t(p.ertrag))} stroke={p.heimat ? "#669933" : "#03122b"} strokeWidth={p.heimat ? 3 : 1.5} className="transition-all duration-300" />
                  {(sel || p.heimat) && (
                    <text x={p.x + 12} y={p.y - 10} fill="#fff" fontSize="17" fontWeight="800" paintOrder="stroke" stroke="rgba(3,18,43,0.85)" strokeWidth="4" fontFamily="inherit">
                      {p.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legende */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 text-[12px] text-white/55">
            <div className="flex items-center gap-3">
              <span>{de(min)}</span>
              <span aria-hidden="true" className="h-2 w-40 rounded-full" style={{ background: `linear-gradient(90deg, ${farbe(0)}, ${farbe(0.5)}, ${farbe(1)})` }} />
              <span>{de(max)} kWh/kWp</span>
            </div>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-ov-500 bg-white" /> Firmensitz Ostermiething
            </span>
          </div>
        </div>

        {/* Detail + Rangliste */}
        <aside className="flex min-h-0 flex-col border-t border-white/10 lg:border-l lg:border-t-0">
          <div className="p-5">
            {gewaehlt ? (
              <div className="rounded-2xl bg-white p-5 text-ink-900 shadow-2xl">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-700">{gewaehlt.bundesland}</p>
                <p className="mt-1 font-display text-[22px] font-extrabold leading-tight">{gewaehlt.name}</p>
                <p className="mt-3 flex items-baseline gap-1.5">
                  <Sun aria-hidden="true" className="h-4 w-4 self-center text-sun-500" />
                  <span className="ov-num font-display text-[30px] font-extrabold leading-none">{de(gewaehlt.ertrag)}</span>
                  <span className="text-[13px] text-ink-500">kWh je kWp und Jahr</span>
                </p>
                <p className="mt-2 text-[13px] text-ink-500">{gewaehlt.heimat ? "Firmensitz" : `${gewaehlt.km} km Luftlinie ab Ostermiething`}</p>
                <Link href={`/photovoltaik/${gewaehlt.slug}`} className="group mt-4 flex min-h-11 items-center justify-between rounded-xl bg-ov-600 px-4 text-[14.5px] font-semibold text-white transition-colors hover:bg-ov-700">
                  Photovoltaik {gewaehlt.name}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/10">
                <p className="text-[13px] text-white/60">{land === "alle" ? "Mittel aller Standorte" : `Mittel ${laender.find((l) => l.land === land)?.name}`}</p>
                <p className="mt-1 font-display text-[34px] font-extrabold leading-none text-white">
                  <span className="ov-num">{de(schnitt)}</span> <span className="text-[15px] font-bold text-white/60">kWh/kWp</span>
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/55">Punkt oder Ort wählen für Details. Klick auf ein Bundesland filtert die Karte.</p>
              </div>
            )}
          </div>
          <ol className="ov-no-scrollbar max-h-[360px] flex-1 overflow-y-auto px-3 pb-4 lg:max-h-[430px]">
            {liste.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/photovoltaik/${p.slug}`}
                  onMouseEnter={() => setAktiv(p.slug)}
                  onFocus={() => setAktiv(p.slug)}
                  className={cn("group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors", aktiv === p.slug ? "bg-white/10" : "hover:bg-white/[0.05]")}
                >
                  <span className="ov-num w-6 shrink-0 text-right text-[12px] text-white/40">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 truncate text-[14px] font-semibold text-white">
                      {p.heimat && <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />}
                      {p.name}
                    </span>
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-white/10">
                      <span className="block h-full rounded-full" style={{ width: `${40 + t(p.ertrag) * 60}%`, background: farbe(t(p.ertrag)) }} />
                    </span>
                  </span>
                  <span className="ov-num shrink-0 text-[13px] font-semibold text-white/75">{de(p.ertrag)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <p className="border-t border-white/10 px-5 py-3 text-[11.5px] leading-relaxed text-white/40">
        Simulierter Jahresertrag je kWp, Süd 35°, Referenzpunkt Ortszentrum. {quelle}. {AT_KARTE_QUELLE}.
      </p>
    </div>
  );
}
