"use client";

import { useEffect, useState } from "react";
import { BatteryCharging, Car, Cpu, Home, Moon, Sun, Sunset, Thermometer, UtilityPole } from "lucide-react";

/**
 * Animiertes Energiefluss-Diagramm des Smart Energy Home.
 * Dach → Energiemanager → Speicher / Haus / Wallbox / Wärmepumpe / Netz,
 * umschaltbar zwischen drei typischen Momenten eines Tages.
 * Beispielwerte (kW) – Leistungsbilanz je Szenario geht exakt auf.
 */

const KNOTEN = {
  pv: { x: 400, y: 90, label: "Photovoltaik", icon: Sun },
  speicher: { x: 120, y: 280, label: "Speicher", icon: BatteryCharging },
  netz: { x: 680, y: 280, label: "Stromnetz", icon: UtilityPole },
  haus: { x: 170, y: 440, label: "Haushalt", icon: Home },
  wallbox: { x: 400, y: 440, label: "E-Auto", icon: Car },
  wp: { x: 630, y: 440, label: "Wärmepumpe", icon: Thermometer },
};
const HUB = { x: 400, y: 280 };

// Flussrichtung: "rein" = zum Energiemanager, "raus" = vom Energiemanager weg
const SZENARIEN = {
  mittag: {
    tab: "Mittag",
    icon: Sun,
    zeit: "12:30 Uhr · sonnig",
    soc: 64,
    fluesse: { pv: [8.4, "rein"], speicher: [2.2, "raus"], netz: [0.5, "raus"], haus: [0.8, "raus"], wallbox: [3.7, "raus"], wp: [1.2, "raus"] },
    quelle: { pv: 8.4 },
    entscheidungen: [
      "Solarstrom deckt zuerst Haushalt und Wärmepumpe.",
      "Der Überschuss lädt das E-Auto mit angepasster Leistung.",
      "Der Speicher füllt sich für den Abend.",
      "Nur der kleine Rest wird eingespeist.",
    ],
  },
  abend: {
    tab: "Abend",
    icon: Sunset,
    zeit: "19:00 Uhr · Sonne geht unter",
    soc: 78,
    fluesse: { pv: [0.3, "rein"], speicher: [1.8, "rein"], netz: [0.2, "rein"], haus: [1.5, "raus"], wallbox: [0, null], wp: [0.8, "raus"] },
    quelle: { pv: 0.3, speicher: 1.8, netz: 0.2 },
    entscheidungen: [
      "Der Speicher übernimmt Kochen, Licht und Heizung.",
      "Das E-Auto wartet – der Strom ist jetzt teuer.",
      "Netzbezug bleibt die Ausnahme.",
    ],
  },
  nacht: {
    tab: "Nacht",
    icon: Moon,
    zeit: "02:00 Uhr · günstiger Börsenstrom",
    soc: 22,
    fluesse: { pv: [0, null], speicher: [0, null], netz: [4.6, "rein"], haus: [0.3, "raus"], wallbox: [3.7, "raus"], wp: [0.6, "raus"] },
    quelle: { netz: 4.6 },
    entscheidungen: [
      "Mit dynamischem Tarif lädt das Auto in der günstigsten Stunde.",
      "Die Wärmepumpe heizt den Pufferspeicher vor.",
      "Der Batteriespeicher bleibt für den Morgen reserviert.",
    ],
  },
};

const FARBE = { pv: "#ffc53d", speicher: "#8cba58", netz: "#7fa7d6" };
const fmt = (n) => n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function farbeFuer(szenario, id) {
  if (["pv", "speicher", "netz"].includes(id) && szenario.fluesse[id][1] === "rein") return FARBE[id];
  // Verbraucher: Farbe der wichtigsten aktiven Quelle
  const q = Object.entries(szenario.quelle).sort((a, b) => b[1] - a[1])[0]?.[0];
  return FARBE[q] || "#8cba58";
}

export default function Energiefluss() {
  const [key, setKey] = useState("mittag");
  const [bewegung, setBewegung] = useState(false);
  useEffect(() => setBewegung(!window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  const s = SZENARIEN[key];
  const nacht = key === "nacht";
  const verbrauch = s.fluesse.haus[0] + s.fluesse.wallbox[0] + s.fluesse.wp[0];
  const eigen = verbrauch > 0 ? Math.min(1, ((s.quelle.pv || 0) + (s.quelle.speicher || 0)) / verbrauch) : 0;
  const autarkie = Math.round(Math.min(1, eigen) * 100);

  return (
    <div className="overflow-hidden rounded-[2rem] ring-1 ring-white/10">
      <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between md:p-7">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Interaktiv · Energiefluss</p>
          <p className="mt-1 font-display text-[20px] font-bold text-white md:text-[22px]">{s.zeit}</p>
        </div>
        <div role="group" aria-label="Tageszeit" className="grid grid-cols-3 rounded-full bg-white/10 p-1">
          {Object.entries(SZENARIEN).map(([k, v]) => (
            <button
              key={k}
              type="button"
              aria-pressed={key === k}
              onClick={() => setKey(k)}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-all duration-300 md:px-5 ${
                key === k ? "bg-white text-navy-950 shadow-lg" : "text-white/70 hover:text-white"
              }`}
            >
              <v.icon aria-hidden="true" className="h-4 w-4" />
              {v.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative">
          {/* Himmel: Tag/Abend/Nacht */}
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: nacht ? 0 : 1,
              background:
                key === "abend"
                  ? "radial-gradient(ellipse at 50% 0%, rgba(245,167,15,0.28), transparent 60%)"
                  : "radial-gradient(ellipse at 50% 0%, rgba(255,197,61,0.22), transparent 60%)",
            }}
          />
          <svg
            viewBox="0 0 800 560"
            className="relative h-auto w-full"
            role="img"
            aria-label={`Energiefluss ${s.tab}: ${Object.entries(s.fluesse)
              .filter(([, f]) => f[0] > 0)
              .map(([id, f]) => `${KNOTEN[id].label} ${fmt(f[0])} Kilowatt`)
              .join(", ")}`}
          >
            {nacht &&
              [[90, 60], [180, 120], [620, 70], [720, 140], [300, 40], [520, 150], [760, 50]].map(([x, y2], i) => (
                <circle key={i} cx={x} cy={y2} r="1.8" fill="#ffffff" opacity="0.5" />
              ))}

            {/* Leitungen */}
            {Object.entries(KNOTEN).map(([id, n]) => {
              const [kw, richtung] = s.fluesse[id];
              const aktiv = kw > 0;
              const d = `M${n.x},${n.y} L${HUB.x},${HUB.y}`;
              const breite = aktiv ? 3 + Math.min(kw, 8) * 0.9 : 2;
              const dauer = `${Math.max(0.5, 2.6 - kw * 0.28).toFixed(2)}s`;
              const farbe = farbeFuer(s, id);
              return (
                <g key={id}>
                  <path d={d} stroke="rgba(255,255,255,0.08)" strokeWidth="14" strokeLinecap="round" />
                  <path
                    d={d}
                    stroke={aktiv ? farbe : "rgba(255,255,255,0.12)"}
                    strokeWidth={breite}
                    strokeLinecap="round"
                    strokeDasharray={aktiv ? "2 16" : "0"}
                    style={{ transition: "stroke 500ms, stroke-width 500ms" }}
                  >
                    {aktiv && bewegung && (
                      <animate
                        attributeName="stroke-dashoffset"
                        from={richtung === "rein" ? "0" : "0"}
                        to={richtung === "rein" ? "-36" : "36"}
                        dur={dauer}
                        repeatCount="indefinite"
                      />
                    )}
                  </path>
                </g>
              );
            })}

            {/* Energiemanager */}
            <g>
              <circle cx={HUB.x} cy={HUB.y} r="62" fill="#669933" opacity="0.18">
                {bewegung && <animate attributeName="r" values="56;70;56" dur="3s" repeatCount="indefinite" />}
              </circle>
              <circle cx={HUB.x} cy={HUB.y} r="50" fill="#03122b" stroke="#669933" strokeWidth="3" />
              <Cpu x={HUB.x - 18} y={HUB.y - 30} width="36" height="36" color="#aed083" strokeWidth={1.8} />
              <text x={HUB.x} y={HUB.y + 26} textAnchor="middle" className="fill-white text-[12px] font-semibold max-sm:text-[22px]">EMS</text>
            </g>

            {/* Knoten */}
            {Object.entries(KNOTEN).map(([id, n]) => {
              const [kw, richtung] = s.fluesse[id];
              const aktiv = kw > 0;
              const Icon = id === "pv" && nacht ? Moon : n.icon;
              const zusatz =
                id === "speicher" && aktiv ? (richtung === "raus" ? "lädt" : "entlädt") : id === "netz" && aktiv ? (richtung === "raus" ? "Einspeisung" : "Bezug") : null;
              return (
                <g key={id} style={{ transition: "opacity 400ms" }} opacity={aktiv || id === "speicher" ? 1 : 0.55}>
                  <circle cx={n.x} cy={n.y} r="44" fill="#041d42" stroke={aktiv ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)"} strokeWidth="2" />
                  {id === "speicher" && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="44"
                      fill="none"
                      stroke="#8cba58"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.round(2 * Math.PI * 44 * (s.soc / 100))} 400`}
                      transform={`rotate(-90 ${n.x} ${n.y})`}
                      style={{ transition: "stroke-dasharray 700ms cubic-bezier(.22,1,.36,1)" }}
                    />
                  )}
                  <Icon x={n.x - 16} y={n.y - 16} width="32" height="32" color={aktiv ? "#ffffff" : "rgba(255,255,255,0.6)"} strokeWidth={1.8} />
                  <text
                    x={id === "pv" ? n.x + 62 : n.x}
                    y={id === "pv" ? n.y + 24 : n.y + 68}
                    textAnchor={id === "pv" ? "start" : "middle"}
                    className="fill-white/60 text-[13px] max-sm:text-[25px]"
                  >
                    {n.label}
                    {id === "speicher" ? ` · ${s.soc} %` : ""}
                  </text>
                  <text
                    x={id === "pv" ? n.x + 62 : n.x}
                    y={id === "pv" ? n.y - 2 : n.y + 94}
                    textAnchor={id === "pv" ? "start" : "middle"}
                    className="ov-num fill-white font-display text-[17px] font-bold max-sm:text-[30px]"
                  >
                    {aktiv ? `${fmt(kw)} kW` : "–"}
                    {zusatz && <tspan className="fill-white/50 text-[12px] font-normal max-sm:hidden">{` ${zusatz}`}</tspan>}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="border-t border-white/10 bg-white/[0.03] p-6 md:p-7 lg:border-l lg:border-t-0">
          <p className="text-[13px] text-white/55">Anteil aus Sonne & Speicher</p>
          <p className="ov-num mt-1 font-display text-[44px] font-extrabold leading-none tracking-tight text-white">{autarkie} %</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <div className="h-full rounded-full bg-ov-400 transition-all duration-700" style={{ width: `${autarkie}%` }} />
          </div>

          <p className="mt-8 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Der Energiemanager entscheidet</p>
          <ol key={key} className="ov-tab-panel mt-4 space-y-3">
            {s.entscheidungen.map((e, i) => (
              <li key={e} className="flex gap-3 text-[14.5px] leading-snug text-white/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-[12px] font-bold text-ov-300">{i + 1}</span>
                {e}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="border-t border-white/10 px-6 py-4 text-[12.5px] leading-relaxed text-white/45 md:px-7">
        Beispielwerte für ein Einfamilienhaus mit 10-kWp-Anlage, Speicher, Wallbox und Wärmepumpe. Die tatsächliche Regelung hängt von Anlage, Tarif und Einstellungen ab.
      </p>
    </div>
  );
}
