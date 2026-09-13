"use client";

import { useEffect, useState } from "react";
import { BatteryCharging, Car, Cpu, Flame, Home, Moon, PlugZap, Sun, Sunset, UtilityPole, ZapOff, Check } from "lucide-react";

/**
 * „Ihr Haus als Kraftwerk" – interaktives Energiefluss-Schema.
 * Alle Geräte hängen am Energiemanagement (Mitte). Je nach Situation ändern
 * sich Richtung und Stärke der Flüsse. Werte sind Beispielwerte (kW) für ein
 * Einfamilienhaus mit ca. 10 kWp, 10 kWh Speicher, Wärmepumpe und Wallbox.
 * Animation per SVG-SMIL, nur wenn prefers-reduced-motion das erlaubt.
 */

const FARBE = {
  pv: "#f5b82e",
  speicher: "#8cba58",
  netz: "#7fa8dc",
  verbraucher: "#e7ecf3",
  aus: "#ef6b5e",
};

// Knoten im viewBox 720 × 590
const HUB = { x: 360, y: 282, hw: 78, hh: 36 };
const KNOTEN = {
  pv: { x: 360, y: 122, name: "Photovoltaik", icon: Sun, farbe: FARBE.pv, label: "rechts" },
  netz: { x: 74, y: 282, name: "Stromnetz", icon: UtilityPole, farbe: FARBE.netz, label: "unten" },
  speicher: { x: 186, y: 430, name: "Speicher", icon: BatteryCharging, farbe: FARBE.speicher, label: "unten" },
  haushalt: { x: 360, y: 452, name: "Haushalt", icon: Home, farbe: FARBE.verbraucher, label: "unten" },
  waermepumpe: { x: 534, y: 430, name: "Wärmepumpe", icon: Flame, farbe: FARBE.verbraucher, label: "unten" },
  wallbox: { x: 646, y: 282, name: "Wallbox", icon: Car, farbe: FARBE.verbraucher, label: "unten" },
};

/*
 * Flüsse: positiver Wert = Energie fließt ZUM Energiemanagement (Quelle),
 * negativer Wert = Energie fließt VOM Energiemanagement zum Gerät (Senke).
 * Summe je Szenario = 0 (Bilanz geht auf).
 */
const SZENARIEN = [
  {
    id: "mittag",
    kurz: "Mittag",
    uhr: "12:30 Uhr",
    icon: Sun,
    titel: "Sonne satt – Überschuss clever verteilen",
    text: "Die Anlage liefert deutlich mehr, als das Haus gerade braucht. Das Energiemanagement verteilt den Überschuss nach Priorität: Haushalt, Warmwasser über die Wärmepumpe, E-Auto und Speicher – nur der Rest geht ins Netz.",
    aktionen: ["PV-Überschussladen der Wallbox", "Warmwasser-Boost mit Solarstrom", "Speicher lädt, Einspeisung minimal"],
    fluss: { pv: 7.8, haushalt: -0.6, waermepumpe: -1.4, wallbox: -3.5, speicher: -1.8, netz: -0.5 },
    soc: 62,
    himmel: "tag",
  },
  {
    id: "abend",
    kurz: "Abend",
    uhr: "19:00 Uhr",
    icon: Sunset,
    titel: "Sonne weg – der Speicher übernimmt",
    text: "Kochen, Licht und Heizung laufen jetzt aus dem Speicher. Das Laden des E-Autos verschiebt das System in die Nacht, damit die gespeicherte Sonnenenergie für den Haushalt reicht.",
    aktionen: ["Speicher deckt den Abendbedarf", "E-Auto-Laden auf später verschoben", "Kein teurer Netzbezug zur Abendspitze"],
    fluss: { pv: 0.4, speicher: 2.6, haushalt: -2.1, waermepumpe: -0.9, wallbox: 0, netz: 0 },
    soc: 88,
    himmel: "abend",
  },
  {
    id: "nacht",
    kurz: "Nacht",
    uhr: "02:00 Uhr",
    icon: Moon,
    titel: "Günstiger Nachtstrom – gezielt genutzt",
    text: "Mit einem dynamischen Stromtarif lädt das Energiemanagement das E-Auto in den Stunden mit niedrigem Börsenpreis. Den Speicher hält es als Reserve für die meist teurere Morgenspitze zurück.",
    aktionen: ["E-Auto lädt im günstigsten Zeitfenster", "Speicher-Reserve für den Morgen", "Wärmepumpe im Grundbetrieb"],
    fluss: { pv: 0, speicher: 0, haushalt: -0.3, waermepumpe: -0.9, wallbox: -3.7, netz: 4.9 },
    soc: 30,
    himmel: "nacht",
  },
  {
    id: "ausfall",
    kurz: "Stromausfall",
    uhr: "20:15 Uhr",
    icon: ZapOff,
    titel: "Netz fällt aus – Notstrom springt ein",
    text: "Die Notstrombox trennt das Haus vom öffentlichen Netz und versorgt wichtige Stromkreise aus dem Speicher. Große Verbraucher wie Wallbox und Wärmepumpe pausieren, damit die Reserve möglichst lange hält.",
    aktionen: ["Haus sicher vom Netz getrennt", "Kühlschrank, Licht & Router versorgt", "Große Verbraucher pausieren"],
    fluss: { pv: 0, speicher: 0.8, haushalt: -0.8, waermepumpe: 0, wallbox: 0, netz: 0 },
    soc: 74,
    himmel: "ausfall",
    netzAus: true,
  },
];

const fmt = (n) => Math.abs(n).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function zustand(key, wert, s) {
  if (key === "netz" && s.netzAus) return "getrennt";
  if (Math.abs(wert) < 0.05) return key === "pv" ? "keine Erzeugung" : key === "speicher" ? "hält Reserve" : key === "netz" ? "kein Austausch" : "pausiert";
  if (key === "pv") return "erzeugt";
  if (key === "speicher") return wert > 0 ? "entlädt" : "lädt";
  if (key === "netz") return wert > 0 ? "Bezug" : "Einspeisung";
  if (key === "wallbox") return "lädt E-Auto";
  if (key === "waermepumpe") return "heizt";
  return "Bedarf";
}

export default function EnergieflussHaus() {
  const [aktivId, setAktivId] = useState("mittag");
  const [bewegung, setBewegung] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setBewegung(!mq.matches);
    set();
    mq.addEventListener?.("change", set);
    return () => mq.removeEventListener?.("change", set);
  }, []);

  const s = SZENARIEN.find((x) => x.id === aktivId);
  const verbrauch = -(s.fluss.haushalt + s.fluss.waermepumpe + s.fluss.wallbox);
  const netzbezug = Math.max(s.fluss.netz, 0);
  const eigen = verbrauch > 0 ? Math.round(((verbrauch - Math.min(netzbezug, verbrauch)) / verbrauch) * 100) : 0;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-sm">
      {/* Umschalter */}
      <div className="flex flex-col gap-5 border-b border-white/10 p-5 md:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Interaktiv · Beispielhaushalt</p>
          <h3 className="ov-h3 mt-2 text-white">Wählen Sie eine Situation</h3>
        </div>
        <div role="radiogroup" aria-label="Situation wählen" className="grid grid-cols-2 gap-1.5 rounded-3xl bg-white/[0.06] p-1.5 sm:inline-grid sm:grid-cols-4 sm:rounded-full">
          {SZENARIEN.map((o) => {
            const Icon = o.icon;
            const an = o.id === aktivId;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={an}
                onClick={() => setAktivId(o.id)}
                className={`flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-all duration-300 ${
                  an ? "bg-white text-navy-950 shadow-lg" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon aria-hidden="true" className={`h-4 w-4 ${an ? (o.id === "ausfall" ? "text-red-500" : "text-ov-600") : ""}`} />
                {o.kurz}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.45fr_1fr]">
        {/* Schema */}
        <div className="relative border-white/10 p-3 sm:p-6 lg:border-r">
          <svg
            viewBox="0 0 720 590"
            className="h-auto w-full"
            role="img"
            aria-label={`Energiefluss ${s.kurz}: ${Object.entries(s.fluss)
              .map(([k, v]) => `${KNOTEN[k].name} ${zustand(k, v, s)}${Math.abs(v) >= 0.05 ? ` ${fmt(v)} Kilowatt` : ""}`)
              .join(", ")}`}
          >
            <defs>
              <radialGradient id="ef-glow-sonne">
                <stop offset="0%" stopColor="#ffd873" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f5b82e" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="ef-glow-hub">
                <stop offset="0%" stopColor="#669933" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#669933" stopOpacity="0" />
              </radialGradient>
            </defs>

            <Himmel art={s.himmel} />

            {/* Haus */}
            <path d="M106 196 L360 40 L614 196" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M140 178 L360 56 L580 178 L580 574 L140 574 Z" fill="rgba(255,255,255,0.035)" />
            <path d="M140 190 L140 574 M580 190 L580 574" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
            <line x1="20" x2="700" y1="574" y2="574" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
            {/* PV-Module auf dem Dach */}
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${300 - i * 36} ${90 + i * 23} l-30 19 l9 11 l30 -19 Z`}
                fill={s.himmel === "tag" ? "rgba(245,184,46,0.55)" : "rgba(127,168,220,0.25)"}
                style={{ transition: "fill 600ms" }}
              />
            ))}

            {/* Leitungen */}
            {Object.entries(KNOTEN).map(([k, n]) => (
              <Leitung key={`${k}-${aktivId}`} k={k} n={n} wert={s.fluss[k]} bewegung={bewegung} netzAus={k === "netz" && s.netzAus} />
            ))}

            {/* Energiemanagement */}
            <circle cx={HUB.x} cy={HUB.y} r="92" fill="url(#ef-glow-hub)" />
            <rect x={HUB.x - 78} y={HUB.y - 36} width="156" height="72" rx="22" className="fill-navy-900" stroke="#8cba58" strokeWidth="2" />
            <Cpu x={HUB.x - 62} y={HUB.y - 16} width="32" height="32" color="#aed083" strokeWidth={1.8} aria-hidden="true" />
            <text x={HUB.x - 22} y={HUB.y - 3} className="fill-white text-[17px] font-bold">Energie-</text>
            <text x={HUB.x - 22} y={HUB.y + 18} className="fill-white text-[17px] font-bold">manager</text>

            {/* Knoten */}
            {Object.entries(KNOTEN).map(([k, n]) => (
              <Knoten key={k} k={k} n={n} wert={s.fluss[k]} s={s} />
            ))}
          </svg>

          {/* Mobile Werteliste (Beschriftungen im SVG sind dort ausgeblendet) */}
          <ul className="mt-2 grid grid-cols-2 gap-2 px-1 pb-2 sm:hidden">
            {Object.entries(KNOTEN).map(([k, n]) => {
              const v = s.fluss[k];
              const aktiv = Math.abs(v) >= 0.05;
              const Icon = n.icon;
              return (
                <li key={k} className="flex items-center gap-2.5 rounded-2xl bg-white/[0.05] px-3 py-2.5 ring-1 ring-white/10">
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" style={{ color: k === "netz" && s.netzAus ? FARBE.aus : aktiv ? n.farbe : "rgba(255,255,255,0.35)" }} />
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] text-white/60">{n.name}</span>
                    <span className="ov-num block text-[14px] font-semibold text-white">{aktiv ? `${fmt(v)} kW` : "–"}</span>
                    <span className={`block truncate text-[11.5px] ${k === "netz" && s.netzAus ? "text-red-300" : "text-white/55"}`}>{zustand(k, v, s)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Erklärung */}
        <div className="flex flex-col border-t border-white/10 p-6 md:p-8 lg:border-t-0">
          <div key={aktivId} className="ov-tab-panel" aria-live="polite">
            <p className="flex items-center gap-2 text-[13px] font-medium text-white/55">
              <span className={`h-2 w-2 rounded-full ${s.netzAus ? "bg-red-400" : "bg-ov-400"}`} aria-hidden="true" />
              {s.uhr} · Beispielwerte
            </p>
            <h4 className="mt-3 font-display text-[22px] font-extrabold leading-tight tracking-tight text-white md:text-[24px]">{s.titel}</h4>
            <p className="mt-3 text-[15.5px] leading-relaxed text-white/70">{s.text}</p>

            <p className="mt-6 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-white/45">Das Energiemanagement jetzt</p>
            <ul className="mt-3 space-y-2.5">
              {s.aktionen.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-[15px] text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ov-500/25 text-ov-300">
                    <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 lg:mt-auto">
            <Kennzahl label="Eigen­versorgung" wert={`${eigen} %`} />
            <Kennzahl
              label={s.netzAus ? "Netz" : s.fluss.netz > 0.05 ? "Netzbezug" : s.fluss.netz < -0.05 ? "Einspeisung" : "Netz"}
              wert={s.netzAus ? "aus" : Math.abs(s.fluss.netz) < 0.05 ? "0 kW" : `${fmt(s.fluss.netz)} kW`}
              warn={s.netzAus}
            />
            <div className="bg-navy-950/60 p-3 sm:p-4">
              <dt className="text-[12px] leading-tight text-white/55">Speicher</dt>
              <dd className="ov-num mt-1 font-display text-[20px] font-extrabold text-white">{s.soc} %</dd>
              <dd className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                <span className="block h-full rounded-full bg-ov-400 transition-[width] duration-700" style={{ width: `${s.soc}%` }} />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="border-t border-white/10 px-6 py-4 text-[12.5px] leading-relaxed text-white/50 md:px-8">
        Vereinfachte Veranschaulichung mit Beispielwerten (Momentanleistung in kW) für ein Einfamilienhaus mit ca. 10 kWp, 10 kWh Speicher, Wärmepumpe und Wallbox – keine Messwerte. Notstrom setzt ein notstrom- bzw. ersatzstromfähiges System voraus; dynamische Tarife erfordern ein intelligentes Messsystem.
      </p>
    </div>
  );
}

function Kennzahl({ label, wert, warn }) {
  return (
    <div className="bg-navy-950/60 p-3 sm:p-4">
      <dt className="text-[12px] leading-tight text-white/55">{label}</dt>
      <dd className={`ov-num mt-1 font-display text-[20px] font-extrabold ${warn ? "text-red-300" : "text-white"}`}>{wert}</dd>
    </div>
  );
}

function Leitung({ k, n, wert, bewegung, netzAus }) {
  const aktiv = Math.abs(wert) >= 0.05;
  // Quelle → Energiemanagement oder Energiemanagement → Senke
  const [von, nach] = wert > 0 ? [n, HUB] : [HUB, n];
  const farbe = k === "pv" || k === "speicher" || k === "netz" ? n.farbe : wert < 0 ? "#aed083" : n.farbe;
  const pfad = `M${von.x} ${von.y} L${nach.x} ${nach.y}`;
  const laenge = Math.hypot(nach.x - von.x, nach.y - von.y);
  const dauer = Math.max(1.2, (laenge / 140) * (2.4 - Math.min(Math.abs(wert), 5) * 0.22));
  const winkel = (Math.atan2(nach.y - von.y, nach.x - von.x) * 180) / Math.PI;
  // Pfeil zwischen Knoten und Energiemanagement (etwas Richtung Knoten verschoben)
  const dx = HUB.x - n.x;
  const dy = HUB.y - n.y;
  const L = Math.hypot(dx, dy);
  const hubRand = Math.min(dx ? HUB.hw / Math.abs(dx / L) : Infinity, dy ? HUB.hh / Math.abs(dy / L) : Infinity);
  const t = (40 + (L - 40 - hubRand) / 2) / L;
  const mx = n.x + dx * t;
  const my = n.y + dy * t;
  const dicke = aktiv ? 3 + Math.min(Math.abs(wert), 5) * 0.9 : 2;

  return (
    <g>
      <line x1={n.x} y1={n.y} x2={HUB.x} y2={HUB.y} stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeLinecap="round" />
      {aktiv ? (
        <>
          <line x1={n.x} y1={n.y} x2={HUB.x} y2={HUB.y} stroke={farbe} strokeOpacity="0.55" strokeWidth={dicke} strokeLinecap="round" />
          {bewegung &&
            [0, 1, 2].map((i) => (
              <circle key={i} r={4 + Math.min(Math.abs(wert), 5) * 0.35} fill={farbe}>
                <animateMotion dur={`${dauer}s`} begin={`${-(dauer / 3) * i}s`} repeatCount="indefinite" path={pfad} />
                <animate attributeName="opacity" dur={`${dauer}s`} begin={`${-(dauer / 3) * i}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.15;0.8;1" />
              </circle>
            ))}
          <g transform={`translate(${mx} ${my}) rotate(${winkel})`}>
            <circle r="13" className="fill-navy-950" stroke={farbe} strokeWidth="2" />
            <path d="M-4 -6 L4 0 L-4 6" fill="none" stroke={farbe} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </>
      ) : (
        <line
          x1={n.x}
          y1={n.y}
          x2={HUB.x}
          y2={HUB.y}
          stroke={netzAus ? FARBE.aus : "rgba(255,255,255,0.28)"}
          strokeOpacity={netzAus ? 0.7 : 1}
          strokeWidth="2"
          strokeDasharray="4 8"
          strokeLinecap="round"
        />
      )}
      {netzAus && (
        <g transform={`translate(${mx} ${my})`}>
          <circle r="15" className="fill-navy-950" stroke={FARBE.aus} strokeWidth="2" />
          <path d="M-5 -5 L5 5 M5 -5 L-5 5" stroke={FARBE.aus} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

function Knoten({ k, n, wert, s }) {
  const Icon = n.icon;
  const aus = k === "netz" && s.netzAus;
  const aktiv = Math.abs(wert) >= 0.05;
  const ring = aus ? FARBE.aus : aktiv ? n.farbe : "rgba(255,255,255,0.22)";
  const rechts = n.label === "rechts";
  const lx = rechts ? n.x + 54 : n.x;
  const ly = rechts ? n.y - 14 : n.y + 62;

  return (
    <g>
      {aktiv && <circle cx={n.x} cy={n.y} r="48" fill={n.farbe} fillOpacity="0.12" />}
      <circle cx={n.x} cy={n.y} r="38" className="fill-navy-900" stroke={ring} strokeWidth="2.5" style={{ transition: "stroke 400ms" }} />
      <Icon x={n.x - 17} y={n.y - 17} width="34" height="34" color={aus ? FARBE.aus : aktiv ? n.farbe : "rgba(255,255,255,0.45)"} strokeWidth={1.8} aria-hidden="true" />
      <g className="hidden sm:block">
        <text x={lx} y={ly} textAnchor={rechts ? "start" : "middle"} className="fill-white/60 text-[15px] font-medium">
          {n.name}
        </text>
        <text x={lx} y={ly + 23} textAnchor={rechts ? "start" : "middle"} className="ov-num fill-white text-[20px] font-bold">
          {aktiv ? `${fmt(wert)} kW` : "–"}
        </text>
        <text x={lx} y={ly + 42} textAnchor={rechts ? "start" : "middle"} className={`text-[13.5px] ${aus ? "fill-red-300" : "fill-white/50"}`}>
          {zustand(k, wert, s)}
        </text>
      </g>
    </g>
  );
}

function Himmel({ art }) {
  if (art === "tag")
    return (
      <g>
        <circle cx="650" cy="78" r="70" fill="url(#ef-glow-sonne)" />
        <circle cx="650" cy="78" r="24" fill="#ffd873" />
      </g>
    );
  if (art === "abend")
    return (
      <g>
        <circle cx="660" cy="170" r="64" fill="url(#ef-glow-sonne)" opacity="0.7" />
        <circle cx="660" cy="170" r="20" fill="#f59e3b" />
      </g>
    );
  return (
    <g>
      <path d="M660 58 a26 26 0 1 0 22 40 a22 22 0 1 1 -22 -40 Z" fill={art === "ausfall" ? "rgba(255,255,255,0.35)" : "#e7ecf3"} />
      {[
        [560, 40],
        [604, 120],
        [700, 150],
        [80, 60],
        [40, 150],
        [130, 110],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#fff" opacity={art === "ausfall" ? 0.25 : 0.6} />
      ))}
    </g>
  );
}
