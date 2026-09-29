"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

/**
 * Animierter Energiefluss für die drei Modelle der gemeinsamen Energienutzung (EEG, BEG, GEA).
 * Schematische Darstellung für dunklen Hintergrund. Die Fakten je Modell kommen von der Seite
 * (dieselben Daten wie in der Vergleichstabelle) – hier wird nichts Neues behauptet.
 *
 * fakten: { eeg: [{ label, wert }], beg: [...], gea: [...] }
 */

const MODELLE = [
  { id: "eeg", kurz: "EEG", name: "Erneuerbare-Energie-Gemeinschaft", sub: "lokal oder regional" },
  { id: "beg", kurz: "BEG", name: "Bürgerenergiegemeinschaft", sub: "österreichweit" },
  { id: "gea", kurz: "GEA", name: "Gemeinschaftliche Erzeugungsanlage", sub: "im selben Gebäude" },
];

// Je Modell fünf Teilnehmer (gleiche Schlüssel → sie wandern beim Umschalten) und ein Knoten in der Mitte
const LAYOUT = {
  eeg: {
    hub: { x: 320, y: 222, label: "Trafo", sub: "Netzebene 6/7" },
    rahmen: "kreis",
    rahmenLabel: "Nahbereich: selber Trafo oder selbes Umspannwerk",
    n: {
      n1: { x: 150, y: 96, label: "Gemeinde", sub: "erzeugt", erz: true },
      n2: { x: 490, y: 96, label: "KMU-Betrieb", sub: "erzeugt", erz: true },
      n3: { x: 530, y: 318, label: "Landwirtschaft", sub: "erzeugt", erz: true },
      n4: { x: 110, y: 318, label: "Haushalt", sub: "bezieht", erz: false },
      n5: { x: 320, y: 384, label: "Haushalte", sub: "beziehen", erz: false },
    },
  },
  beg: {
    hub: { x: 320, y: 222, label: "Öffentliches Netz", sub: "alle Netzebenen" },
    rahmen: "rechteck",
    rahmenLabel: "Ganz Österreich – auch über Netzgebiete hinweg",
    n: {
      n1: { x: 118, y: 100, label: "Großbetrieb", sub: "erzeugt", erz: true },
      n2: { x: 522, y: 100, label: "Wasserkraft", sub: "erzeugt", erz: true },
      n3: { x: 530, y: 340, label: "Filiale", sub: "bezieht", erz: false },
      n4: { x: 110, y: 340, label: "Büro", sub: "bezieht", erz: false },
      n5: { x: 320, y: 392, label: "Mitglieder", sub: "beziehen", erz: false },
    },
  },
  gea: {
    hub: { x: 320, y: 352, label: "Hauptleitung", sub: "im Gebäude" },
    rahmen: "gebaeude",
    rahmenLabel: "Gemeinsame Anlage im Gebäude",
    n: {
      n1: { x: 320, y: 70, label: "PV am Dach", sub: "erzeugt", erz: true },
      n2: { x: 258, y: 170, label: "Top 1", sub: "bezieht", erz: false },
      n3: { x: 382, y: 170, label: "Top 2", sub: "bezieht", erz: false },
      n4: { x: 258, y: 258, label: "Top 3", sub: "bezieht", erz: false },
      n5: { x: 382, y: 258, label: "Allgemein", sub: "bezieht", erz: false },
    },
  },
};

const KEYS = ["n1", "n2", "n3", "n4", "n5"];
const lerp = (a, b, p) => a + (b - a) * p;

function mische(von, zu, p) {
  const n = {};
  KEYS.forEach((k) => {
    n[k] = { ...zu.n[k], x: lerp(von.n[k].x, zu.n[k].x, p), y: lerp(von.n[k].y, zu.n[k].y, p) };
  });
  return { ...zu, hub: { ...zu.hub, x: lerp(von.hub.x, zu.hub.x, p), y: lerp(von.hub.y, zu.hub.y, p) }, n };
}

export default function EnergieFluss({ fakten = {} }) {
  const [modell, setModell] = useState("eeg");
  const [bild, setBild] = useState(LAYOUT.eeg);
  const [bewegt, setBewegt] = useState(false);
  const [p, setP] = useState(1);
  const bildRef = useRef(LAYOUT.eeg);

  useEffect(() => {
    setBewegt(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const wechseln = (id) => {
    if (id === modell) return;
    const von = bildRef.current;
    const zu = LAYOUT[id];
    setModell(id);
    if (!bewegt) {
      bildRef.current = zu;
      setBild(zu);
      return;
    }
    const start = performance.now();
    const schritt = (t) => {
      const q = Math.min((t - start) / 750, 1);
      const e = q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
      const m = mische(von, zu, e);
      bildRef.current = m;
      setBild(m);
      setP(q);
      if (q < 1) requestAnimationFrame(schritt);
    };
    requestAnimationFrame(schritt);
  };

  const info = MODELLE.find((m) => m.id === modell);
  const liste = fakten[modell] || [];
  const ruhig = p >= 1;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-sm">
      <div role="tablist" aria-label="Modell wählen" className="grid grid-cols-3 border-b border-white/10">
        {MODELLE.map((m) => {
          const an = m.id === modell;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={an}
              onClick={() => wechseln(m.id)}
              className={cn(
                "relative px-3 py-4 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ov-400 md:px-7 md:py-6",
                an ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
              )}
            >
              <span className={cn("block font-display text-[22px] font-extrabold tracking-tight md:text-[28px]", an ? "text-white" : "text-white/45")}>{m.kurz}</span>
              <span className={cn("mt-0.5 hidden text-[13px] leading-snug sm:block", an ? "text-white/75" : "text-white/40")}>{m.name}</span>
              <span className={cn("absolute inset-x-0 bottom-0 h-[3px] origin-left bg-ov-400 transition-transform duration-500", an ? "scale-x-100" : "scale-x-0")} />
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <div className="relative p-3 md:p-6">
          <div className="-mx-3 overflow-x-auto px-3 ov-no-scrollbar md:mx-0 md:px-0">
          <svg viewBox="0 0 640 440" className="h-auto w-full min-w-[540px] md:min-w-0" role="img" aria-label={`Schema ${info.name}: ${LAYOUT[modell].rahmenLabel}`}>
            <style>{`
              .ef-linie { stroke-dasharray: 3 7; animation: ef-fluss 1.2s linear infinite; }
              @keyframes ef-fluss { to { stroke-dashoffset: -20; } }
              @media (prefers-reduced-motion: reduce) { .ef-linie { animation: none; } }
            `}</style>
            <defs>
              <radialGradient id="ef-glow">
                <stop offset="0%" stopColor="#8cba58" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#8cba58" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Rahmen je Modell – blendet weich über */}
            <g style={{ transition: "opacity 500ms" }} opacity={modell === "eeg" ? 1 : 0}>
              <circle cx="320" cy="236" r="206" fill="none" stroke="rgba(255,255,255,0.18)" strokeDasharray="5 7" />
            </g>
            <g style={{ transition: "opacity 500ms" }} opacity={modell === "beg" ? 1 : 0}>
              <rect x="22" y="36" width="596" height="394" rx="28" fill="none" stroke="rgba(255,255,255,0.18)" strokeDasharray="5 7" />
            </g>
            <g style={{ transition: "opacity 500ms" }} opacity={modell === "gea" ? 1 : 0}>
              <path d="M180,122 L320,34 L460,122 L460,406 L180,406 Z" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinejoin="round" />
              <line x1="320" y1="392" x2="320" y2="406" stroke="rgba(255,255,255,0.28)" />
              <line x1="460" y1="352" x2="560" y2="352" stroke="rgba(255,255,255,0.22)" strokeDasharray="4 5" />
              <g transform="translate(560,352)">
                <circle r="20" fill="#03122b" stroke="rgba(255,255,255,0.3)" />
                <text y="4" textAnchor="middle" className="fill-white/70 text-[10px] font-semibold">Netz</text>
              </g>
              <text x="560" y="392" textAnchor="middle" className="fill-white/45 text-[10.5px]">nur Überschuss</text>
            </g>
            <text x="320" y={modell === "gea" ? 430 : 26} textAnchor="middle" className="fill-white/55 text-[12px] font-medium" style={{ transition: "opacity 300ms" }} opacity={ruhig ? 1 : 0}>
              {LAYOUT[modell].rahmenLabel}
            </text>

            {/* Leitungen mit fließender Energie */}
            {KEYS.map((k) => {
              const n = bild.n[k];
              const von = n.erz ? n : bild.hub;
              const zu = n.erz ? bild.hub : n;
              return (
                <g key={`l-${k}`}>
                  <line x1={von.x} y1={von.y} x2={zu.x} y2={zu.y} stroke="rgba(255,255,255,0.12)" strokeWidth="6" strokeLinecap="round" />
                  <line className="ef-linie" x1={von.x} y1={von.y} x2={zu.x} y2={zu.y} stroke={n.erz ? "#ffc53d" : "#aed083"} strokeWidth="2.4" strokeLinecap="round" />
                  {bewegt && ruhig && (
                    <circle r="4" fill={n.erz ? "#ffd873" : "#cde3b1"}>
                      <animateMotion dur={`${1.6 + (KEYS.indexOf(k) % 3) * 0.35}s`} repeatCount="indefinite" path={`M${von.x},${von.y} L${zu.x},${zu.y}`} />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Knoten in der Mitte */}
            <g transform={`translate(${bild.hub.x},${bild.hub.y})`}>
              <circle r="72" fill="url(#ef-glow)" />
              <circle r="42" fill="#669933" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              <text y="-1" textAnchor="middle" className="fill-white text-[11px] font-bold">{bild.hub.label.split(" ")[0]}</text>
              <text y="12" textAnchor="middle" className="fill-white/80 text-[9px]">{bild.hub.label.split(" ").slice(1).join(" ") || bild.hub.sub}</text>
            </g>

            {/* Teilnehmer */}
            {KEYS.map((k) => {
              const n = bild.n[k];
              return (
                <g key={k} transform={`translate(${n.x},${n.y})`}>
                  <rect x="-56" y="-23" width="112" height="46" rx="14" fill="#07203f" stroke={n.erz ? "rgba(255,197,61,0.55)" : "rgba(174,208,131,0.45)"} strokeWidth="1.5" />
                  <circle cx="-36" cy="0" r="10" fill={n.erz ? "rgba(255,197,61,0.18)" : "rgba(174,208,131,0.16)"} />
                  {n.erz ? (
                    <g stroke="#ffc53d" strokeWidth="1.6" strokeLinecap="round">
                      <circle cx="-36" cy="0" r="3.2" fill="#ffc53d" stroke="none" />
                      <line x1="-36" y1="-7" x2="-36" y2="-5.5" />
                      <line x1="-36" y1="5.5" x2="-36" y2="7" />
                      <line x1="-43" y1="0" x2="-41.5" y2="0" />
                      <line x1="-30.5" y1="0" x2="-29" y2="0" />
                    </g>
                  ) : (
                    <path d="M-41,1 L-36,-4 L-31,1 L-31,5 L-41,5 Z" fill="none" stroke="#aed083" strokeWidth="1.6" strokeLinejoin="round" />
                  )}
                  <text x="-20" y="-3" className="fill-white text-[11.5px] font-semibold">{n.label}</text>
                  <text x="-20" y="11" className="fill-white/55 text-[10px]">{n.sub}</text>
                </g>
              );
            })}
          </svg>
          </div>
          <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1 px-3 text-[12.5px] text-white/60">
            <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-sun-400" />Erzeugung</li>
            <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-ov-300" />zugeordneter Bezug</li>
          </ul>
        </div>

        <div className="border-t border-white/10 p-6 md:p-8 lg:border-l lg:border-t-0">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">{info.sub}</p>
          <p className="mt-2 font-display text-[21px] font-bold leading-snug text-white">{info.name}</p>
          <dl key={modell} className="ov-tab-panel mt-6 space-y-4">
            {liste.map((f) => (
              <div key={f.label} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ov-500/20 text-ov-300">
                  <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
                </span>
                <div>
                  <dt className="text-[12px] font-semibold uppercase tracking-wider text-white/45">{f.label}</dt>
                  <dd className="mt-0.5 text-[14.5px] leading-relaxed text-white/85">{f.wert}</dd>
                </div>
              </div>
            ))}
          </dl>
          <Button href="/rechner/energiegemeinschaft" variant="primary" icon={ArrowRight} className="mt-8 w-full sm:w-auto">
            Ersparnis berechnen
          </Button>
        </div>
      </div>
    </div>
  );
}
