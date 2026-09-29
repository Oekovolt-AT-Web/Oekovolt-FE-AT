"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BellOff, CheckCircle2, CloudSun, Gauge, Layers, LayoutDashboard, Radio, Settings, Sun, WifiOff, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Animationen from "@/components/ServiceAT/A/Animationen";

/**
 * Gestaltetes Leitwarten-Mockup (Illustration mit frei gewählten Beispielwerten,
 * keine Kunden- oder Anlagendaten). Zeigt, wie Portfolio-KPIs, Soll-Ist-Kurve,
 * Anlagen-Ampel und Alarm-Zeitleiste in der Leitwarte zusammenkommen.
 */

// Beispielanlagen – bewusst neutral benannt
const ANSICHTEN = {
  portfolio: {
    label: "Portfolio",
    pr: 84.1,
    verf: 99.3,
    ertrag: 41.8,
    leistung: 6120,
    kwp: 9850,
    soll: [0, 2, 9, 24, 42, 60, 74, 83, 86, 82, 71, 54, 34, 15, 4, 0],
    ist: [0, 2, 9, 23, 40, 57, 70, 79, 81, 78, 68, 51, 32, 14, 4, 0],
  },
  halle: {
    label: "Hallendach Nord",
    pr: 86.4,
    verf: 99.8,
    ertrag: 3.9,
    leistung: 612,
    kwp: 950,
    soll: [0, 2, 10, 26, 44, 62, 76, 84, 86, 81, 70, 52, 32, 14, 3, 0],
    ist: [0, 2, 10, 25, 43, 61, 75, 83, 85, 80, 69, 51, 31, 14, 3, 0],
  },
  freiflaeche: {
    label: "Freifläche Süd",
    pr: 82.7,
    verf: 98.6,
    ertrag: 29.4,
    leistung: 4380,
    kwp: 7100,
    soll: [0, 3, 11, 27, 45, 63, 77, 85, 88, 84, 73, 56, 36, 16, 4, 0],
    ist: [0, 3, 10, 25, 41, 57, 60, 60, 60, 60, 60, 53, 34, 15, 4, 0],
  },
  agri: {
    label: "Agri-PV Ost",
    pr: 83.5,
    verf: 99.1,
    ertrag: 8.5,
    leistung: 1128,
    kwp: 1800,
    soll: [0, 4, 14, 31, 48, 64, 75, 81, 82, 76, 64, 46, 27, 11, 2, 0],
    ist: [0, 4, 13, 30, 46, 61, 71, 77, 78, 72, 61, 44, 26, 11, 2, 0],
  },
};

const ANLAGEN = [
  { name: "Freifläche Süd", status: "gelb", info: "Abregelung 60 % (Netzbetreiber)" },
  { name: "Agri-PV Ost", status: "gelb", info: "String 2.4 unter Soll" },
  { name: "Hallendach Nord", status: "gruen", info: "im Soll" },
  { name: "Carport Werk 2", status: "gruen", info: "im Soll" },
];

const ALARME = [
  { zeit: "12:30", icon: Radio, prio: "Info", ton: "navy", titel: "Sollwert Netzbetreiber 60 %", text: "Abregelung als eigenes Ereignis protokolliert – zählt nicht als technischer Ausfall" },
  { zeit: "11:05", icon: AlertTriangle, prio: "Mittel", ton: "gelb", titel: "Minderertrag String 2.4", text: "plausibilisiert gegen gemessene Einstrahlung, Ticket an Technik" },
  { zeit: "10:42", icon: WifiOff, prio: "Hoch", ton: "rot", titel: "Kommunikationsverlust Logger", text: "gebündelt: 1 Alarm statt 14 Folgemeldungen · quittiert 10:47" },
  { zeit: "05:58", icon: BellOff, prio: "—", ton: "grau", titel: "Nacht: Ertragsalarme unterdrückt", text: "keine Fehlalarme ohne Einstrahlung" },
];

const zahl = (n, s = 1) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

/** Weiches Überblenden eines Zahlenwerts (rAF), bei reduzierter Bewegung sofort. */
function useTween(ziel, dauer = 900) {
  const [wert, setWert] = useState(ziel);
  const von = useRef(ziel);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      von.current = ziel;
      setWert(ziel);
      return;
    }
    const start = performance.now();
    const a = von.current;
    let raf;
    const schritt = (t) => {
      const p = Math.min((t - start) / dauer, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = a + (ziel - a) * e;
      setWert(v);
      von.current = v;
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [ziel, dauer]);
  return wert;
}

function Kpi({ label, wert, einheit, stellen = 1, icon: Icon, akzent }) {
  const v = useTween(wert);
  return (
    <div className="min-w-0 rounded-2xl bg-white/[0.04] p-3.5 ring-1 ring-white/10 md:p-4">
      <p className="flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-[0.1em] text-white/45">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className={cn("ov-num mt-1.5 font-display text-[22px] font-extrabold leading-none tracking-tight md:text-[26px]", akzent)}>
        {zahl(v, stellen)}
        <span className="ml-1 text-[13px] font-semibold text-white/50">{einheit}</span>
      </p>
    </div>
  );
}

function Kurve({ soll, ist }) {
  const W = 640;
  const H = 210;
  const x = (i) => 12 + (i / (soll.length - 1)) * (W - 24);
  const y = (v) => H - 18 - (v / 100) * (H - 40);
  const pfad = (arr) => arr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const flaeche = `${pfad(ist)} L${x(ist.length - 1)} ${H - 18} L${x(0)} ${H - 18} Z`;
  const jetzt = 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="scada-ist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8cba58" stopOpacity="0.45" />
          <stop offset="1" stopColor="#8cba58" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((g) => (
        <line key={g} x1="12" x2={W - 12} y1={y(g)} y2={y(g)} stroke="rgba(255,255,255,0.06)" />
      ))}
      <path d={flaeche} fill="url(#scada-ist)" style={{ d: `path("${flaeche}")`, transition: "d 700ms cubic-bezier(.22,1,.36,1)" }} />
      <path d={pfad(soll)} fill="none" stroke="#7fa7d6" strokeWidth="2" strokeDasharray="5 6" style={{ d: `path("${pfad(soll)}")`, transition: "d 700ms cubic-bezier(.22,1,.36,1)" }} />
      <path d={pfad(ist)} fill="none" stroke="#aed083" strokeWidth="2.5" strokeLinejoin="round" style={{ d: `path("${pfad(ist)}")`, transition: "d 700ms cubic-bezier(.22,1,.36,1)" }} />
      <line x1={x(jetzt)} x2={x(jetzt)} y1="10" y2={H - 18} stroke="#ffc53d" strokeWidth="1.2" strokeDasharray="3 4" />
      <circle cx={x(jetzt)} cy={y(ist[jetzt])} r="9" fill="#ffc53d" opacity="0.25" className="ts-puls" style={{ transition: "cy 700ms" }} />
      <circle cx={x(jetzt)} cy={y(ist[jetzt])} r="4.5" fill="#ffc53d" style={{ transition: "cy 700ms" }} />
      {["06", "09", "12", "15", "18", "21"].map((t, i) => (
        <text key={t} x={x(i * 3)} y={H - 2} textAnchor={i === 0 ? "start" : i === 5 ? "end" : "middle"} fontSize="11" fill="rgba(255,255,255,0.4)">
          {t}:00
        </text>
      ))}
    </svg>
  );
}

const TON = {
  rot: "bg-red-500/15 text-red-300 ring-red-400/30",
  gelb: "bg-sun-400/15 text-sun-300 ring-sun-400/30",
  navy: "bg-navy-400/20 text-navy-100 ring-navy-300/30",
  grau: "bg-white/[0.06] text-white/50 ring-white/10",
};

export default function ScadaDashboard() {
  const [ansicht, setAnsicht] = useState("portfolio");
  const a = ANSICHTEN[ansicht];
  const [puls, setPuls] = useState(0);

  // „Live“-Wert der Momentanleistung leicht schwanken lassen (Illustration)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setPuls((p) => (p + 1) % 6), 2200);
    return () => clearInterval(t);
  }, []);
  const schwankung = [0, 0.6, -0.4, 1.1, -0.8, 0.3][puls] / 100;
  const leistung = Math.round(a.leistung * (1 + schwankung));
  const auslastung = useMemo(() => Math.round((a.leistung / a.kwp) * 100), [a]);

  return (
    <figure className="relative">
      <Animationen />
      <div className="overflow-hidden rounded-[1.75rem] bg-[#060f22] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.8)] ring-1 ring-white/12">
        {/* Fensterleiste */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 md:px-5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </span>
          <span className="truncate text-[12.5px] font-medium text-white/55">Leitwarte · Portfolio-Übersicht</span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ov-500/15 px-2.5 py-1 text-[11px] font-semibold text-ov-300 ring-1 ring-ov-400/30">
            <span aria-hidden="true" className="ts-blink h-1.5 w-1.5 rounded-full bg-ov-400" />
            Illustration · Beispielwerte
          </span>
        </div>

        <div className="grid md:grid-cols-[56px_minmax(0,1fr)]">
          {/* Seitenleiste */}
          <div className="hidden flex-col items-center gap-3 border-r border-white/10 py-5 md:flex" aria-hidden="true">
            {[LayoutDashboard, Layers, Gauge, AlertTriangle, Settings].map((I, i) => (
              <span key={i} className={cn("flex h-9 w-9 items-center justify-center rounded-xl", i === 0 ? "bg-ov-500 text-white" : "text-white/35")}>
                <I className="h-[18px] w-[18px]" />
              </span>
            ))}
          </div>

          <div className="min-w-0 p-4 md:p-6">
            {/* Auswahl */}
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 ov-no-scrollbar" role="group" aria-label="Beispielansicht wählen">
              {Object.entries(ANSICHTEN).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={ansicht === k}
                  onClick={() => setAnsicht(k)}
                  className={cn(
                    "min-h-10 shrink-0 rounded-full px-3.5 text-[13px] font-semibold ring-1 transition-colors",
                    ansicht === k ? "bg-white text-navy-950 ring-white" : "text-white/65 ring-white/12 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* KPIs */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4" aria-live="polite">
              <Kpi label="Performance Ratio" wert={a.pr} einheit="%" icon={Gauge} akzent="text-ov-300" />
              <Kpi label="Verfügbarkeit" wert={a.verf} einheit="%" icon={CheckCircle2} akzent="text-white" />
              <Kpi label="Ertrag heute" wert={a.ertrag} einheit="MWh" icon={Sun} akzent="text-white" />
              <div className="min-w-0 rounded-2xl bg-white/[0.04] p-3.5 ring-1 ring-white/10 md:p-4">
                <p className="flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-[0.1em] text-white/45">
                  <Zap aria-hidden="true" className="h-3.5 w-3.5" />
                  Leistung jetzt
                </p>
                <p className="ov-num mt-1.5 font-display text-[22px] font-extrabold leading-none tracking-tight text-sun-300 md:text-[26px]">
                  {leistung.toLocaleString("de-DE")}
                  <span className="ml-1 text-[13px] font-semibold text-white/50">kW</span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                  <div className="h-full rounded-full bg-sun-400 transition-[width] duration-700" style={{ width: `${auslastung}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              {/* Soll-Ist-Kurve */}
              <div className="min-w-0 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-white/85">Leistung heute · Soll-Ist</p>
                  <p className="flex items-center gap-3 text-[11.5px] text-white/50">
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="h-0.5 w-4 bg-ov-300" />
                      Ist
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="h-0.5 w-4 bg-[repeating-linear-gradient(90deg,#7fa7d6_0_4px,transparent_4px_8px)]" />
                      Soll aus Einstrahlung
                    </span>
                  </p>
                </div>
                <Kurve soll={a.soll} ist={a.ist} />
                <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-white/40">
                  <CloudSun aria-hidden="true" className="h-3.5 w-3.5" />
                  Soll = Modell mit gemessener Einstrahlung und Temperatur
                </p>
              </div>

              {/* Anlagen-Ampel */}
              <div className="min-w-0 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10">
                <p className="mb-3 text-[13px] font-semibold text-white/85">Anlagen nach Handlungsbedarf</p>
                <ul className="space-y-2">
                  {ANLAGEN.map((an) => (
                    <li key={an.name} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 transition-colors", an.name === a.label ? "bg-white/[0.08] ring-white/20" : "ring-transparent")}>
                      <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-full", an.status === "gruen" ? "bg-ov-400" : "ts-blink bg-sun-400")} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-semibold text-white">{an.name}</span>
                        <span className="block truncate text-[12px] text-white/50">{an.info}</span>
                      </span>
                      <span className="sr-only">{an.status === "gruen" ? "Status: im Soll" : "Status: Hinweis"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Alarm-Zeitleiste */}
            <div className="mt-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10">
              <p className="mb-3 text-[13px] font-semibold text-white/85">Ereignisse & Alarme · heute</p>
              <ol className="grid gap-2 md:grid-cols-2">
                {ALARME.map((al) => (
                  <li key={al.zeit} className="flex gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.06]">
                    <span className="ov-num w-11 shrink-0 pt-0.5 text-[12.5px] font-semibold text-white/45">{al.zeit}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <al.icon aria-hidden="true" className="h-3.5 w-3.5 text-white/60" />
                        <span className="text-[13.5px] font-semibold text-white">{al.titel}</span>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ring-1", TON[al.ton])}>{al.prio}</span>
                      </span>
                      <span className="mt-1 block text-[12.5px] leading-snug text-white/50">{al.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-[12.5px] text-white/45">
        Gestaltete Illustration der Leitwarten-Oberfläche mit frei gewählten Beispielwerten – keine Kunden- oder Echtzeitdaten.
      </figcaption>
    </figure>
  );
}
