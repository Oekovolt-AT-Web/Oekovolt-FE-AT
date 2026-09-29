"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight, ChevronsLeftRight, Info, Sun, TrendingUp, Zap } from "lucide-react";

/**
 * Vorher/Nachher-Leistungsvergleich fürs Repowering.
 * Gleiche Dachfläche, alte Module (Baujahr wählbar, mit Alterung) gegen
 * aktuelle Hochleistungsmodule. Schieberegler blendet zwischen beiden Dächern.
 * Vereinfachte Orientierung – ersetzt keinen Anlagencheck.
 */

const JETZT = 2026;
const BELEGUNG = 0.85; // genutzter Anteil der Dachfläche
const NEU = { wirkungsgrad: 0.225, modulFlaeche: 1.95, jahr: JETZT }; // ≈ 440 Wp Glas-Glas-Modul
const ALT_MODUL_FLAECHE = 1.25;
const ERTRAG_JE_KWP = 1050; // kWh je kWp und Jahr – Richtwert Österreich, gute Ausrichtung
const BILD_FLAECHE = 100; // m² – die Illustration zeigt einen Dachausschnitt
const DEGRADATION_ALT = 0.006; // pro Jahr, ältere Modulgenerationen
const WR_ALT = 0.95; // relativer Wirkungsgrad alter Wechselrichter gegenüber neuen

const zahl = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });
const wirkungsgradAlt = (jahr) => 0.105 + (jahr - 1998) * 0.0035;

function Dach({ anzahl, reihen, neu }) {
  // Dachfläche in der Illustration: Trapez, Module in schräg gestelltem Raster
  const X0 = 150, Y0 = 150, B = 500, HH = 210;
  const spalten = Math.max(1, Math.ceil(anzahl / reihen));
  const gap = neu ? 4 : 6;
  const w = (B - gap * (spalten + 1)) / spalten;
  const h = (HH - gap * (reihen + 1)) / reihen;
  const zellen = [];
  let n = 0;
  for (let r = 0; r < reihen; r++) {
    for (let c = 0; c < spalten; c++) {
      if (n >= anzahl) break;
      zellen.push({ x: X0 + gap + c * (w + gap), y: Y0 + gap + r * (h + gap), key: `${r}-${c}` });
      n++;
    }
  }

  return (
    <svg viewBox="0 0 800 450" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={neu ? "himmel-neu" : "himmel-alt"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={neu ? "#cfe3f5" : "#dfe4ea"} />
          <stop offset="100%" stopColor={neu ? "#f4f8fc" : "#f3f4f6"} />
        </linearGradient>
        <linearGradient id={neu ? "modul-neu" : "modul-alt"} x1="0" y1="0" x2="1" y2="1">
          {neu ? (
            <>
              <stop offset="0%" stopColor="#1b2536" />
              <stop offset="55%" stopColor="#0d1420" />
              <stop offset="100%" stopColor="#253349" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#5f7fa6" />
              <stop offset="100%" stopColor="#3f5c82" />
            </>
          )}
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill={`url(#${neu ? "himmel-neu" : "himmel-alt"})`} />
      <circle cx="690" cy="70" r={neu ? 40 : 34} fill="#ffd873" opacity={neu ? 0.9 : 0.55} />
      {/* Haus */}
      <rect x="170" y="370" width="460" height="80" fill="#ece6da" />
      <polygon points="110,380 690,380 640,130 160,130" fill={neu ? "#6b4a3a" : "#7a5c4f"} />
      <polygon points="110,380 690,380 686,392 114,392" fill="#4d3529" />
      <g transform="translate(0 0) skewX(-3)" style={{ transformOrigin: "400px 260px" }}>
        {zellen.map((z) => (
          <g key={z.key}>
            <rect x={z.x} y={z.y} width={w} height={h} rx={neu ? 2 : 1} fill={`url(#${neu ? "modul-neu" : "modul-alt"})`} stroke={neu ? "#0a0f18" : "#c9d3de"} strokeWidth={neu ? 1 : 2} />
            {!neu && (
              // Sichtbares Zellraster und Busbars alter Module
              <g stroke="#9fb3cb" strokeWidth="0.8" opacity="0.75">
                <line x1={z.x + w / 3} x2={z.x + w / 3} y1={z.y} y2={z.y + h} />
                <line x1={z.x + (2 * w) / 3} x2={z.x + (2 * w) / 3} y1={z.y} y2={z.y + h} />
                <line x1={z.x} x2={z.x + w} y1={z.y + h / 2} y2={z.y + h / 2} />
              </g>
            )}
            {neu && <rect x={z.x + 3} y={z.y + 3} width={w * 0.35} height={h * 0.18} rx="1" fill="#ffffff" opacity="0.07" />}
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function VorherNachher() {
  const id = useId();
  const [pos, setPos] = useState(50);
  const [baujahr, setBaujahr] = useState(2010);
  const [flaeche, setFlaeche] = useState(1500);

  const r = useMemo(() => {
    const nutz = flaeche * BELEGUNG;
    const altAnzahl = Math.max(4, Math.floor(nutz / ALT_MODUL_FLAECHE));
    const neuAnzahl = Math.max(3, Math.floor(nutz / NEU.modulFlaeche));
    const altKwp = altAnzahl * ALT_MODUL_FLAECHE * wirkungsgradAlt(baujahr);
    const neuKwp = neuAnzahl * NEU.modulFlaeche * NEU.wirkungsgrad;
    const alter = JETZT - baujahr;
    const altErtrag = altKwp * ERTRAG_JE_KWP * (1 - DEGRADATION_ALT * alter) * WR_ALT;
    const neuErtrag = neuKwp * ERTRAG_JE_KWP;
    return {
      altAnzahl,
      neuAnzahl,
      altKwp,
      neuKwp,
      altWp: (ALT_MODUL_FLAECHE * wirkungsgradAlt(baujahr)) * 1000,
      neuWp: NEU.modulFlaeche * NEU.wirkungsgrad * 1000,
      alter,
      altErtrag,
      neuErtrag,
      faktor: neuErtrag / altErtrag,
      mehr: neuErtrag - altErtrag,
    };
  }, [baujahr, flaeche]);

  const reihenAlt = 6;
  const reihenNeu = 5;
  const bildAlt = Math.floor((BILD_FLAECHE * BELEGUNG) / ALT_MODUL_FLAECHE);
  const bildNeu = Math.floor((BILD_FLAECHE * BELEGUNG) / NEU.modulFlaeche);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-2 border-b border-ink-100 p-6 md:p-8">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Interaktiv · Vorher/Nachher</p>
        <h3 className="ov-h3 text-ink-900">Gleiches Dach – wie viel mehr Leistung ist drin?</h3>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Bildvergleich */}
        <div className="p-4 md:p-6">
          <div className="relative aspect-[4/3] select-none sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden rounded-3xl bg-ink-100 focus-within:ring-4 focus-within:ring-ov-500/40">
            <div className="absolute inset-0">
              <Dach anzahl={bildNeu} reihen={reihenNeu} neu />
            </div>
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Dach anzahl={bildAlt} reihen={reihenAlt} />
            </div>

            {/* Etiketten */}
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[12.5px] font-semibold text-ink-800 shadow backdrop-blur md:left-4 md:top-4">
              Vorher · {baujahr}
            </span>
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-navy-950/90 px-3 py-1.5 text-[12.5px] font-semibold text-white shadow backdrop-blur md:right-4 md:top-4">
              Nachher · {JETZT}
            </span>
            <span className="ov-num pointer-events-none absolute bottom-3 left-3 rounded-xl bg-white/95 px-3 py-2 text-[13px] leading-tight text-ink-700 shadow md:bottom-4 md:left-4">
              <strong className="block font-display text-[18px] text-ink-900">{zahl(r.altKwp, 1)} kWp</strong>
              <span className="hidden sm:inline">{r.altAnzahl} Module à ~{zahl(r.altWp)} Wp</span><span className="sm:hidden">{r.altAnzahl} Module</span>
            </span>
            <span className="ov-num pointer-events-none absolute bottom-3 right-3 rounded-xl bg-ov-600 px-3 py-2 text-right text-[13px] leading-tight text-white shadow md:bottom-4 md:right-4">
              <strong className="block font-display text-[18px]">{zahl(r.neuKwp, 1)} kWp</strong>
              <span className="hidden sm:inline">{r.neuAnzahl} Module à ~{zahl(r.neuWp)} Wp</span><span className="sm:hidden">{r.neuAnzahl} Module</span>
            </span>

            {/* Trennlinie mit Griff */}
            <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }} aria-hidden="true">
              <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
              <div className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink-800 shadow-xl ring-1 ring-ink-200">
                <ChevronsLeftRight className="h-5 w-5" />
              </div>
            </div>
            <label htmlFor={`${id}-pos`} className="sr-only">Vorher/Nachher-Vergleich verschieben</label>
            <input
              id={`${id}-pos`}
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>
          <p className="mt-3 flex items-center justify-center gap-2 text-[12.5px] text-ink-500">
            <ChevronsLeftRight aria-hidden="true" className="h-4 w-4" /> Regler ziehen, um alt und neu zu vergleichen
          </p>
        </div>

        {/* Eingaben & Ergebnis */}
        <div className="flex flex-col gap-6 border-t border-ink-100 p-6 md:p-8 lg:border-l lg:border-t-0">
          <Regler id={`${id}-jahr`} label="Baujahr Ihrer Anlage" wert={baujahr} anzeige={String(baujahr)} min={2003} max={2016} step={1} onChange={setBaujahr} />
          <Regler id={`${id}-flaeche`} label="Belegte Dachfläche" wert={flaeche} anzeige={`${zahl(flaeche)} m²`} min={100} max={10000} step={100} onChange={setFlaeche} />

          <div aria-live="polite" className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-ink-50 p-4 ring-1 ring-ink-200/60">
              <p className="flex items-center gap-1.5 text-[12.5px] text-ink-500"><Sun aria-hidden="true" className="h-3.5 w-3.5" />Ertrag heute</p>
              <p className="ov-num mt-1 font-display text-[22px] font-extrabold tracking-tight text-ink-900">{zahl(Math.round(r.altErtrag / 100) * 100)}</p>
              <p className="text-[12px] text-ink-500">kWh/Jahr, nach {r.alter} Jahren Alterung</p>
            </div>
            <div className="rounded-2xl bg-ov-50 p-4 ring-1 ring-ov-200/70">
              <p className="flex items-center gap-1.5 text-[12.5px] text-ink-600"><Zap aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />Ertrag neu</p>
              <p className="ov-num mt-1 font-display text-[22px] font-extrabold tracking-tight text-ov-700">{zahl(Math.round(r.neuErtrag / 100) * 100)}</p>
              <p className="text-[12px] text-ink-500">kWh/Jahr mit neuen Modulen</p>
            </div>
          </div>

          <div className="rounded-3xl bg-navy-950 p-5 text-white">
            <p className="flex items-center gap-2 text-[13px] text-white/60"><TrendingUp aria-hidden="true" className="h-4 w-4 text-ov-300" />Mehrertrag vom selben Dach</p>
            <p className="ov-num mt-1 font-display text-[34px] font-extrabold leading-tight tracking-tight">
              × {zahl(r.faktor, 1)}
              <span className="ml-2 text-[16px] font-semibold text-white/70">+{zahl(Math.round(r.mehr / 100) * 100)} kWh/Jahr</span>
            </p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              <div className="h-full rounded-full bg-ov-400 transition-[width] duration-500" style={{ width: `${Math.min(100, (r.altErtrag / r.neuErtrag) * 100)}%` }} />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-white/60">
              Altanlage liefert heute rund {zahl((r.altErtrag / r.neuErtrag) * 100)} % <ArrowRight aria-hidden="true" className="h-3 w-3" /> neu 100 %
            </p>
          </div>
        </div>
      </div>

      <p className="flex gap-2 border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
        <span>
          Vereinfachte Orientierung: Modulwirkungsgrad alt ca. {zahl(wirkungsgradAlt(baujahr) * 100, 1)} %, neu ca. {zahl(NEU.wirkungsgrad * 100, 1)} %; {zahl(BELEGUNG * 100)} % Flächenbelegung, {zahl(ERTRAG_JE_KWP)} kWh je kWp,
          Alterung alt {zahl(DEGRADATION_ALT * 100, 1)} % pro Jahr, älterer Wechselrichter −5 %. Die Grafik zeigt einen Dachausschnitt von 100 m². Verschattung, Ausrichtung und Statik prüfen wir beim Anlagencheck vor Ort.
        </span>
      </p>
    </div>
  );
}

function Regler({ id, label, wert, anzeige, min, max, step, onChange }) {
  const fill = ((wert - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14px] font-medium text-ink-700">{label}</label>
        <output htmlFor={id} className="ov-num font-display text-[18px] font-extrabold tracking-tight text-ink-900">{anzeige}</output>
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
    </div>
  );
}
