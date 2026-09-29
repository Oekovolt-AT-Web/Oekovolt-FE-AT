"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Droplets, Leaf, Sun, Wind, TrendingDown, TrendingUp } from "lucide-react";
import useEnergyLive, { fmtCt, fmtGw, fmtUhr } from "@/components/ui/useEnergyLive";
import { LiveDot } from "@/components/ui/LiveTicker";

/**
 * Startseiten-Modul „Strommarkt jetzt": Börsenpreis heute als Flächenverlauf
 * mit Jetzt-Markierung und günstigstem 3-Stunden-Fenster, dazu drei Kennzahlen.
 * `initial` kommt serverseitig (SEO, kein leerer Zustand), der Client aktualisiert.
 *
 * Hydration: Alles, was von der aktuellen Uhrzeit abhängt (Jetzt-Markierung im
 * Diagramm), wird erst nach dem Mounten gezeichnet. Server-HTML und erster
 * Client-Render rechnen mit dem Datenstand `d.stand` – sonst weichen die
 * SVG-Attribute (x/cx der Markierung) ab, sobald zwischen Server-Render und
 * Hydration ein neues Viertelstunden-Intervall beginnt.
 */
export default function HomeLive({ initial }) {
  const live = useEnergyLive({ voll: true, intervall: 10 * 60000 });
  const d = live || initial;
  const [hover, setHover] = useState(null);
  const [jetzt, setJetzt] = useState(null);

  useEffect(() => {
    setJetzt(Date.now());
    const t = setInterval(() => setJetzt(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);

  const heute = useMemo(() => {
    const punkte = d?.preis?.punkte || [];
    if (!punkte.length) return [];
    const fmt = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Vienna" });
    const bezug = jetzt ?? (d?.stand ? Date.parse(d.stand) : punkte[0].t);
    const tag = fmt.format(new Date(bezug));
    return punkte.filter((p) => fmt.format(new Date(p.t)) === tag);
  }, [d, jetzt]);

  const fenster = useMemo(() => {
    if (heute.length < 4) return null;
    const schritt = Math.max(1, Math.round((heute[1].t - heute[0].t) / 60000));
    const n = Math.max(1, Math.round(180 / schritt));
    let best = null;
    for (let i = 0; i + n <= heute.length; i++) {
      const avg = heute.slice(i, i + n).reduce((a, p) => a + p.eurMwh, 0) / n;
      if (!best || avg < best.avg) best = { i, n, avg };
    }
    return best;
  }, [heute]);

  if (!d) return null;

  const W = 640, H = 220, PT = 16, PB = 26;
  const werte = heute.map((p) => p.eurMwh);
  const max = Math.max(...werte, 50);
  const min = Math.min(...werte, 0);
  const x = (i) => (i / Math.max(heute.length - 1, 1)) * W;
  const y = (v) => PT + (H - PT - PB) * (1 - (v - min) / (max - min || 1));
  const linie = heute.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.eurMwh).toFixed(1)}`).join(" ");
  const flaeche = heute.length ? `${linie} L${W},${y(min)} L0,${y(min)} Z` : "";
  const jetztIdx = jetzt == null ? -1 : heute.findIndex((p, i) => jetzt >= p.t && (i === heute.length - 1 || jetzt < heute[i + 1].t));
  const aktiv = hover != null ? heute[hover] : d.preis.aktuell;
  const e = d.erzeugung || {};
  // Österreich: ab rund 100 MW Solarleistung ist „Solar“ aussagekräftiger als Wind (wie LiveTicker)
  const solarAktiv = e.solarMw > 100;
  const trend = d.preis.aktuell && d.preis.heute ? d.preis.aktuell.eurMwh - d.preis.heute.avg : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-[2rem] bg-white/[0.04] p-6 ring-1 ring-white/10 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">
              <LiveDot /> Börsenstrompreis heute
            </p>
            <p className="ov-num mt-3 font-display text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-extrabold leading-none tracking-tight text-white">
              {aktiv ? fmtCt(aktiv.eurMwh) : "–"} <span className="text-[18px] font-bold text-white/50">ct/kWh</span>
            </p>
            <p className="mt-2 text-[13.5px] text-white/55">
              {hover != null && aktiv ? `um ${fmtUhr(aktiv.t)} Uhr` : "jetzt · Day-Ahead Gebotszone AT, netto"}
            </p>
          </div>
          {d.preis.heute && hover == null && (
            <p className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium ${trend <= 0 ? "bg-ov-500/15 text-ov-300" : "bg-sun-400/15 text-sun-300"}`}>
              {trend <= 0 ? <TrendingDown aria-hidden="true" className="h-4 w-4" /> : <TrendingUp aria-hidden="true" className="h-4 w-4" />}
              {trend <= 0 ? "unter" : "über"} Tagesschnitt ({fmtCt(d.preis.heute.avg)} ct)
            </p>
          )}
        </div>

        {heute.length > 1 ? (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-6 h-auto w-full touch-none"
            role="img"
            aria-label={`Börsenstrompreis heute zwischen ${fmtCt(d.preis.heute?.min?.eurMwh ?? 0)} und ${fmtCt(d.preis.heute?.max?.eurMwh ?? 0)} Cent je Kilowattstunde`}
            onMouseLeave={() => setHover(null)}
            onPointerMove={(ev) => {
              const r = ev.currentTarget.getBoundingClientRect();
              const i = Math.round(((ev.clientX - r.left) / r.width) * (heute.length - 1));
              setHover(Math.max(0, Math.min(heute.length - 1, i)));
            }}
          >
            <defs>
              <linearGradient id="hl-flaeche" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#8cba58" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#8cba58" stopOpacity="0" />
              </linearGradient>
            </defs>
            {fenster && (
              <g>
                <rect x={x(fenster.i)} y={PT - 6} width={x(fenster.i + fenster.n - 1) - x(fenster.i)} height={H - PT - PB + 6} rx="8" fill="#8cba58" fillOpacity="0.1" />
                <text x={x(fenster.i) + 8} y={PT + 8} className="fill-ov-300 text-[11px] font-semibold">günstigstes 3-h-Fenster</text>
              </g>
            )}
            {min < 0 && <line x1="0" x2={W} y1={y(0)} y2={y(0)} stroke="rgba(255,255,255,0.25)" strokeDasharray="3 4" />}
            <path d={flaeche} fill="url(#hl-flaeche)" />
            <path d={linie} fill="none" stroke="#aed083" strokeWidth="2" strokeLinejoin="round" />
            {jetztIdx >= 0 && hover == null && (
              <g>
                <line x1={x(jetztIdx)} x2={x(jetztIdx)} y1={PT} y2={H - PB} stroke="rgba(255,255,255,0.35)" />
                <circle cx={x(jetztIdx)} cy={y(heute[jetztIdx].eurMwh)} r="5" fill="#ffc53d" stroke="#03122b" strokeWidth="2" />
              </g>
            )}
            {hover != null && (
              <g>
                <line x1={x(hover)} x2={x(hover)} y1={PT} y2={H - PB} stroke="rgba(255,255,255,0.5)" />
                <circle cx={x(hover)} cy={y(heute[hover].eurMwh)} r="5" fill="#fff" stroke="#03122b" strokeWidth="2" />
              </g>
            )}
            {[0, 6, 12, 18].map((h) => {
              const i = heute.findIndex((p) => Number(fmtUhr(p.t).slice(0, 2)) === h);
              return i >= 0 ? (
                <text key={h} x={x(i)} y={H - 6} textAnchor={x(i) < 24 ? "start" : "middle"} className="fill-white/40 text-[11px]">{`${String(h).padStart(2, "0")}:00`}</text>
              ) : null;
            })}
          </svg>
        ) : (
          <p className="mt-6 rounded-2xl bg-white/5 p-6 text-[14px] text-white/60">Die Preisdaten werden gerade aktualisiert.</p>
        )}
        {fenster && (
          <p className="mt-3 text-[13.5px] text-white/60">
            Günstigste Zeit heute: <strong className="text-white">{fmtUhr(heute[fenster.i].t)} – {fmtUhr(heute[fenster.i + fenster.n - 1].t + (heute[1].t - heute[0].t))} Uhr</strong> (Ø {fmtCt(fenster.avg)} ct/kWh) – ideal für Speicher, E-Flotte und flexible Lasten.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-5 lg:auto-rows-fr">
        <Kachel icon={Leaf} label="Erneuerbare am Verbrauch" wert={e.eeAnteil != null ? `${Math.round(e.eeAnteil)} %` : "–"} />
        <Kachel icon={Droplets} label="Wasserkraft im Netz" wert={e.wasserMw != null ? `${fmtGw(e.wasserMw)} GW` : "–"} farbe="text-navy-200" />
        {solarAktiv ? (
          <Kachel icon={Sun} label="Solarleistung im Netz" wert={`${fmtGw(e.solarMw)} GW`} farbe="text-sun-300" />
        ) : (
          <Kachel icon={Wind} label="Windleistung im Netz" wert={e.windMw != null ? `${fmtGw(e.windMw)} GW` : "–"} farbe="text-navy-200" />
        )}
        <Link href="/energie-live" className="group flex flex-col justify-between rounded-[1.5rem] bg-ov-600 p-5 text-white transition-colors hover:bg-ov-700 md:p-6">
          <p className="font-display text-[16px] font-bold leading-snug md:text-[18px]">Alle Live-Daten: Preise, Erzeugung, Prognose</p>
          <span className="mt-4 inline-flex items-center gap-2 text-[14.5px] font-semibold">
            Zum Dashboard <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function Kachel({ icon: Icon, label, wert, farbe = "text-ov-300" }) {
  return (
    <div className="flex flex-col justify-between rounded-[1.5rem] bg-white/[0.04] p-5 ring-1 ring-white/10 md:p-6">
      <p className="flex items-start gap-2 text-[13px] leading-snug text-white/60">
        <Icon aria-hidden="true" className={`mt-px h-4 w-4 shrink-0 ${farbe}`} /> {label}
      </p>
      <p className="ov-num mt-3 font-display text-[28px] font-extrabold leading-none tracking-tight text-white md:text-[32px]">{wert}</p>
    </div>
  );
}
