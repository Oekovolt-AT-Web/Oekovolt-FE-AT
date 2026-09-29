"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CableCar, Hotel, Snowflake, Sun } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Saison-Umschalter: schematischer Tagesverlauf von Verbrauch und PV-Erzeugung
 * für Hotel oder Bergbahn, jeweils Winter- und Sommertag. Veranschaulichung der
 * Lastprofile aus dem Seitentext – keine Messwerte.
 */

const N = 48; // Halbstundenwerte
const glocke = (t, m, b) => Math.exp(-((t - m) ** 2) / (2 * b * b));
const pvKurve = (t, spitze, auf, ab) => (t <= auf || t >= ab ? 0 : spitze * Math.pow(Math.sin((Math.PI * (t - auf)) / (ab - auf)), 1.6));

const PROFILE = {
  "hotel-winter": {
    last: (t) => 95 + 95 * glocke(t, 8, 1.3) + 55 * glocke(t, 12.5, 1.6) + 120 * glocke(t, 18.5, 2) + 20 * glocke(t, 14, 3),
    pv: (t) => pvKurve(t, 78, 7.8, 16.4),
    text: "Frühstück, Küche und Wellness am Abend – im Hochwinter erzeugt die Anlage weniger, als das Haus braucht. Steilere Module, Fassaden und die Schneereflexion in höheren Lagen holen mehr Winterertrag.",
  },
  "hotel-sommer": {
    last: (t) => 80 + 75 * glocke(t, 8, 1.3) + 110 * glocke(t, 14.5, 2.6) + 80 * glocke(t, 19, 1.6),
    pv: (t) => pvKurve(t, 175, 5.4, 20.8),
    text: "Kühlräume, Klima und Wäscherei laufen am Nachmittag – genau mit der Solarkurve. In Sommerbetrieben und Häusern mit Wellness sind Eigenverbrauchsquoten über 80 % realistisch.",
  },
  "berg-winter": {
    last: (t) => 45 + 230 * (t >= 8.5 && t <= 16.5 ? 1 : 0) * (0.85 + 0.15 * Math.sin(t * 2)) + 300 * (t >= 21 || t <= 5.5 ? 1 : 0),
    pv: (t) => pvKurve(t, 125, 7.8, 16.6),
    text: "Lifte tagsüber, Beschneiung vor allem in kalten Nächten. Photovoltaik in Höhenlage liefert im Winter mehr als im Tal – den Rest verteilen Speicher und Lastmanagement.",
  },
  "berg-sommer": {
    last: (t) => 30 + 105 * (t >= 8.5 && t <= 17.5 ? 1 : 0) * (0.9 + 0.1 * Math.sin(t * 1.7)),
    pv: (t) => pvKurve(t, 270, 5.4, 20.8),
    text: "Im Sommerbetrieb bleibt viel Solarstrom übrig. Über eine Energiegemeinschaft geht der Überschuss an Hotels, Gemeinde und Haushalte im Ort – statt billig ins Netz.",
  },
};

const reihe = (f) => Array.from({ length: N }, (_, i) => Math.max(0, f(i / 2 + 0.25)));
const DATEN = Object.fromEntries(Object.entries(PROFILE).map(([k, p]) => [k, { last: reihe(p.last), pv: reihe(p.pv), text: p.text }]));

const W = 720, H = 300, L = 16, R = 16, T = 16, B = 30, MAXY = 360;
const x = (i) => L + ((W - L - R) * i) / (N - 1);
const y = (v) => T + (H - T - B) * (1 - v / MAXY);
const linie = (w) => w.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
const flaeche = (w) => `${linie(w)} L${x(N - 1)},${y(0)} L${x(0)},${y(0)} Z`;

export default function SaisonProfil() {
  const [betrieb, setBetrieb] = useState("hotel");
  const [saison, setSaison] = useState("winter");
  const schluessel = `${betrieb === "hotel" ? "hotel" : "berg"}-${saison}`;
  const ziel = DATEN[schluessel];

  const [kurven, setKurven] = useState({ last: ziel.last, pv: ziel.pv });
  const aktuell = useRef(kurven);

  useEffect(() => {
    const von = aktuell.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      aktuell.current = { last: ziel.last, pv: ziel.pv };
      setKurven(aktuell.current);
      return;
    }
    let raf;
    const start = performance.now();
    const schritt = (t) => {
      const p = Math.min((t - start) / 700, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const m = {
        last: von.last.map((v, i) => v + (ziel.last[i] - v) * e),
        pv: von.pv.map((v, i) => v + (ziel.pv[i] - v) * e),
      };
      aktuell.current = m;
      setKurven(m);
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [ziel]);

  const kennzahlen = useMemo(() => {
    const summe = (a) => a.reduce((s, v) => s + v * 0.5, 0);
    const direkt = summe(ziel.last.map((v, i) => Math.min(v, ziel.pv[i])));
    const last = summe(ziel.last);
    const pv = summe(ziel.pv);
    return { deckung: direkt / last, eigen: pv > 0 ? direkt / pv : 0, ueberschuss: Math.max(0, pv - direkt) / pv };
  }, [ziel]);

  const direkt = kurven.last.map((v, i) => Math.min(v, kurven.pv[i]));

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-4 border-b border-ink-100 p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Interaktiv · Lastprofil nach Saison</p>
          <h3 className="ov-h3 mt-2 text-ink-900">Wann Ihr Betrieb Strom braucht – und wann die Sonne liefert</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Umschalter
            label="Betrieb"
            wert={betrieb}
            onChange={setBetrieb}
            optionen={[
              { id: "hotel", l: "Hotel", icon: Hotel },
              { id: "berg", l: "Bergbahn", icon: CableCar },
            ]}
          />
          <Umschalter
            label="Saison"
            wert={saison}
            onChange={setSaison}
            optionen={[
              { id: "winter", l: "Winter", icon: Snowflake },
              { id: "sommer", l: "Sommer", icon: Sun },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="p-4 md:p-6">
          <div className="-mx-4 overflow-x-auto px-4 ov-no-scrollbar md:mx-0 md:px-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[540px] md:min-w-0" role="img" aria-label={`Schematischer Tagesverlauf ${betrieb === "hotel" ? "Hotel" : "Bergbahn"} im ${saison === "winter" ? "Winter" : "Sommer"}: Verbrauch und Photovoltaik-Erzeugung`}>
            <defs>
              <linearGradient id="sp-pv" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffc53d" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ffc53d" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="sp-direkt" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#669933" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#669933" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            {[6, 12, 18].map((h) => (
              <line key={h} x1={x(h * 2)} x2={x(h * 2)} y1={T} y2={H - B} stroke="#eef0f4" strokeDasharray="3 4" />
            ))}
            <line x1={L} x2={W - R} y1={y(0)} y2={y(0)} stroke="#dfe3ea" />
            <path d={flaeche(kurven.pv)} fill="url(#sp-pv)" />
            <path d={flaeche(direkt)} fill="url(#sp-direkt)" />
            <path d={linie(kurven.pv)} fill="none" stroke="#f5a70f" strokeWidth="2" />
            <path d={linie(kurven.last)} fill="none" stroke="#03122b" strokeWidth="2.4" strokeLinejoin="round" />
            {[0, 6, 12, 18, 24].map((h) => (
              <text key={h} x={h === 24 ? W - R : h === 0 ? L : x(h * 2)} y={H - 9} textAnchor={h === 0 ? "start" : h === 24 ? "end" : "middle"} className="fill-ink-400 text-[11px]">{`${String(h).padStart(2, "0")}:00`}</text>
            ))}
          </svg>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 px-1 text-[13px] text-ink-600">
            <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-navy-950" />Verbrauch</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-sun-400/60" />PV-Erzeugung</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-[3px] bg-ov-500" />direkt genutzt</li>
          </ul>
        </div>
        <div className="flex flex-col border-t border-ink-100 bg-sand-50 p-6 md:p-7 lg:border-l lg:border-t-0">
          <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-400">Am gezeigten Schema-Tag</p>
          <dl className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-5">
            <Wert label="Verbrauch aus PV" wert={kennzahlen.deckung} />
            <Wert label="Solarstrom selbst genutzt" wert={kennzahlen.eigen} />
            <Wert label="Überschuss" wert={kennzahlen.ueberschuss} />
          </dl>
          <p key={schluessel} className="ov-tab-panel mt-6 text-[14.5px] leading-relaxed text-ink-700">{ziel.text}</p>
        </div>
      </div>
      <p className="border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        Schematischer Tagesverlauf zur Veranschaulichung, keine Messwerte. Ihr tatsächliches Profil ermitteln wir aus den Viertelstundenwerten Ihres Netzbetreibers.
      </p>
    </div>
  );
}

function Umschalter({ label, wert, onChange, optionen }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full bg-ink-100 p-1">
      {optionen.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={wert === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500",
            wert === o.id ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"
          )}
        >
          <o.icon aria-hidden="true" className={cn("h-4 w-4", wert === o.id ? "text-ov-600" : "")} />
          {o.l}
        </button>
      ))}
    </div>
  );
}

function Wert({ label, wert }) {
  return (
    <div>
      <dt className="text-[12.5px] leading-snug text-ink-500">{label}</dt>
      <dd className="ov-num mt-1 font-display text-[24px] font-extrabold tracking-tight text-ink-900 md:text-[28px]">{Math.round(wert * 100)} %</dd>
      <dd className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200/70" aria-hidden="true">
        <span className="block h-full rounded-full bg-ov-500 motion-safe:transition-[width] motion-safe:duration-700" style={{ width: `${Math.round(wert * 100)}%` }} />
      </dd>
    </div>
  );
}
