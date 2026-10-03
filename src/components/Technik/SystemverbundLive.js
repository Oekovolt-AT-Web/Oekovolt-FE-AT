"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Activity, BatteryCharging, Cpu, Gauge, MonitorDot, Pause, Play, PlugZap, Radio, ShieldCheck, Sun, TrendingUp, UtilityPole, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * Systemverbund als „Leitstand“-Ansicht (nur /technik): Schaltbild in einem Monitorrahmen,
 * darunter der Regelzyklus in fünf Schritten. Ein Demo-Ablauf hebt Schritt für Schritt den
 * jeweiligen Weg hervor (Kometen auf den Leitungen, aktive Knoten) – rein schematisch, ohne
 * Messwerte, und als solcher gekennzeichnet. Pausieren, Schritte direkt wählen und Wege über die
 * Legende hervorheben ist möglich.
 * Desktop: maßstäbliches Schema (viewBox 1600 × 900) mit HTML-Knoten darüber.
 * Mobil: vertikale Schichten mit fließenden Verbindern.
 * Ohne JS bzw. bei reduzierter Bewegung: alle Wege sichtbar, kein Ablauf.
 * Eigene Klassen/Keyframes: Präfix w26sv.
 */

const VB = { w: 1600, h: 900 };
const pct = (v, g) => `${(v / g) * 100}%`;
const TAKT = 3200; // ms je Schritt

const LEIT = [
  { id: "scada", x: 230, icon: MonitorDot, titel: "SCADA & Leitwarte", text: "Kennzahlen, Alarme, Berichte", href: "/technik/scada" },
  { id: "fern", x: 610, icon: ShieldCheck, titel: "Fernwartung", text: "VPN, MFA, Protokoll", href: "/technik/fernwartung" },
  { id: "nb", x: 990, icon: Radio, titel: "Netzbetreiber", text: "Sollwerte, Fernwirk, Abschaltung", href: "/forderungen/richtlinien" },
  { id: "dv", x: 1370, icon: TrendingUp, titel: "Direktvermarkter", text: "Abregelung, Fahrplan, Ist-Werte", href: "/service/direktvermarktung" },
];
const FELD = [
  { id: "pv", x: 230, icon: Sun, titel: "PV-Generator", text: "Module, Strings, Unterkonstruktion", href: "/produkte/photovoltaikanlage" },
  { id: "wr", x: 610, icon: Zap, titel: "Wechselrichter", text: "verschiedene Hersteller", href: "/produkte/hersteller" },
  { id: "sp", x: 990, icon: BatteryCharging, titel: "Speicher", text: "Eigenverbrauch, Peak Shaving", href: "/produkte/stromspeicher" },
  { id: "lp", x: 1370, icon: PlugZap, titel: "Ladepunkte", text: "E-Flotte mit Lastmanagement", href: "/produkte/wallbox" },
];
const KW = 300; // Knotenbreite
const KH = 112; // Knotenhöhe
const Y_LEIT = 40;
const Y_FELD = 596;
const BUS_OBEN = 222;
const BUS_UNTEN = 520;
const REGLER = { x: 470, y: 292, w: 660, h: 156 };
const NAP_Y = 790;

const PROTO_OBEN = "IEC 60870-5-104 · Modbus TCP · OpenADR · gesicherte API";
const PROTO_UNTEN = "Modbus TCP · SunSpec · OCPP · Speicher-EMS";

/** Regelzyklus: Schritt → hervorgehobene Wege (art), Kometen-Pfade, aktive Knoten. */
const SCHRITTE = [
  {
    art: "vorgabe",
    titel: "Vorgabe",
    text: "Netzbetreiber und Direktvermarkter senden Sollwerte, Fernwirkbefehle, Abregelung oder Fahrplan an den Parkregler.",
    farbe: "#b2cbe9",
    wege: [`M990 ${Y_LEIT + KH}V${BUS_OBEN}H800V${REGLER.y}`, `M1370 ${Y_LEIT + KH}V${BUS_OBEN}H800V${REGLER.y}`],
    knoten: ["nb", "dv", "regler"],
  },
  {
    art: "verteilung",
    titel: "Verteilung",
    text: "Der Parkregler verteilt die Vorgaben an Wechselrichter, Speicher und Ladepunkte – herstellerunabhängig über offene Schnittstellen.",
    farbe: "#b2cbe9",
    wege: [610, 990, 1370].map((x) => `M800 ${REGLER.y + REGLER.h}V${BUS_UNTEN}H${x}V${Y_FELD}`),
    knoten: ["regler", "wr", "sp", "lp"],
  },
  {
    art: "energie",
    titel: "Einspeisung",
    text: "Am Netzanschlusspunkt kommt an, was Netzbetreiber und Vertrag erlauben – und fließt ins Verteilernetz.",
    farbe: "#cde3b1",
    wege: FELD.map((k) => `M${k.x} ${Y_FELD + KH}V${NAP_Y}`),
    knoten: ["pv", "wr", "sp", "lp", "nap"],
  },
  {
    art: "mess",
    titel: "Messung",
    text: "Messwerte vom Netzanschlusspunkt – U, I, P, Q, f – gehen zurück an den Regler. Der Regelkreis schließt sich.",
    farbe: "#ffd873",
    wege: [`M1548 ${NAP_Y}V370H${REGLER.x + REGLER.w}`],
    knoten: ["nap", "regler"],
  },
  {
    art: "leit",
    titel: "Überwachung",
    text: "Leitwarte und Fernwartung erhalten Kennzahlen und Alarme; Eingriffe laufen gesichert über VPN, MFA und Protokoll.",
    farbe: "#b2cbe9",
    wege: [`M800 ${REGLER.y}V${BUS_OBEN}H230V${Y_LEIT + KH}`, `M800 ${REGLER.y}V${BUS_OBEN}H610V${Y_LEIT + KH}`],
    knoten: ["regler", "scada", "fern"],
  },
];

const LEGENDE = [
  { art: "daten", label: "Daten & Sollwerte", strich: "h-0.5 w-6 bg-[repeating-linear-gradient(90deg,#7fa7d6_0_5px,transparent_5px_10px)]" },
  { art: "energie", label: "Energiefluss", strich: "h-1 w-6 rounded bg-ov-400" },
  { art: "mess", label: "Messwert-Rückführung", strich: "h-0.5 w-6 bg-[repeating-linear-gradient(90deg,#ffc53d_0_4px,transparent_4px_9px)]" },
];
const DATEN = ["vorgabe", "verteilung", "leit"];

const CSS = `
@keyframes w26sv-fluss { to { stroke-dashoffset: -48; } }
@keyframes w26sv-fluss-rueck { to { stroke-dashoffset: 48; } }
@keyframes w26sv-komet { from { stroke-dashoffset: 0.16; opacity: 1; } 88% { opacity: 1; } to { stroke-dashoffset: -1; opacity: 0; } }
@keyframes w26sv-fortschritt { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes w26sv-led { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@keyframes w26sv-puls { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
.w26sv-komet { stroke-dasharray: 0.16 2; stroke-dashoffset: 0.16; opacity: 0; }
.w26sv-balken { transform-origin: 0 50%; }
@media (prefers-reduced-motion: no-preference) {
  .w26sv[data-sicht] .w26sv-fluss { animation: w26sv-fluss 1.6s linear infinite; }
  .w26sv[data-sicht] .w26sv-fluss-rueck { animation: w26sv-fluss-rueck 2.2s linear infinite; }
  .w26sv[data-sicht] .w26sv-komet { animation: w26sv-komet 1.5s cubic-bezier(0.45, 0, 0.55, 1) var(--d, 0ms) 2 both; }
  .w26sv[data-sicht] .w26sv-balken[data-laeuft] { animation: w26sv-fortschritt ${TAKT}ms linear both; }
  .w26sv[data-sicht] .w26sv-led { animation: w26sv-led 1.2s ease-in-out infinite; }
  .w26sv[data-sicht] .w26sv-puls { animation: w26sv-puls 3.2s ease-in-out infinite; }
}
`;

/* ------------------------------------------------------------------ */
/* Desktop                                                              */
/* ------------------------------------------------------------------ */

function Knoten({ k, y, aktiv }) {
  const Icon = k.icon;
  return (
    <Link
      href={k.href}
      className={cn(
        "group absolute flex items-center gap-3 rounded-2xl px-4 ring-1 backdrop-blur transition-all duration-500 hover:-translate-y-0.5 hover:bg-navy-800 hover:ring-ov-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-300 xl:gap-3.5 xl:px-5",
        aktiv ? "bg-navy-800/90 shadow-[0_0_0_1px_rgba(140,186,88,0.25),0_18px_40px_-18px_rgba(140,186,88,0.55)] ring-ov-400/60" : "bg-navy-900/80 ring-white/15"
      )}
      style={{ left: pct(k.x - KW / 2, VB.w), top: pct(y, VB.h), width: pct(KW, VB.w), height: pct(KH, VB.h) }}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 group-hover:bg-ov-500 group-hover:text-white xl:h-11 xl:w-11",
          aktiv ? "bg-ov-500/25 text-ov-200" : "bg-white/10 text-ov-300"
        )}
      >
        <Icon aria-hidden="true" className="h-[18px] w-[18px] xl:h-5 xl:w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[13.5px] font-bold leading-tight text-white xl:text-[15.5px]">{k.titel}</span>
        <span className="mt-0.5 block text-[11.5px] leading-snug text-white/55 xl:text-[12.5px]">{k.text}</span>
      </span>
      <span aria-hidden="true" className={cn("absolute right-3 top-3 h-1.5 w-1.5 rounded-full transition-colors duration-500", aktiv ? "w26sv-led bg-ov-300" : "bg-white/20")} />
    </Link>
  );
}

function Schema({ hell, schritt, bewegt }) {
  // hell(arten) → Deckkraft der Gruppe
  const g = (arten) => ({ opacity: hell(arten), transition: "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)" });
  const leitUnten = Y_LEIT + KH;
  const feldUnten = Y_FELD + KH;
  const s = bewegt ? SCHRITTE[schritt] : null;
  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full" aria-hidden="true" fill="none">
      <defs>
        <radialGradient id="w26sv-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#669933" stopOpacity="0.5" />
          <stop offset="1" stopColor="#669933" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="800" cy="370" rx="440" ry="180" fill="url(#w26sv-glow)" className="w26sv-puls" />

      {/* Datenebene oben: Leitebene ↔ Regler */}
      {LEIT.map((k) => (
        <path
          key={`lo${k.x}`}
          d={`M${k.x} ${leitUnten} V${BUS_OBEN}`}
          stroke="#4a7cbd"
          strokeWidth="2.5"
          strokeDasharray="6 10"
          className="w26sv-fluss"
          style={g(k.id === "nb" || k.id === "dv" ? ["daten", "vorgabe"] : ["daten", "leit"])}
        />
      ))}
      <path d={`M230 ${BUS_OBEN} H1370`} stroke="#4a7cbd" strokeWidth="2.5" strokeOpacity="0.55" style={g(["daten", "vorgabe", "leit"])} />
      <path d={`M800 ${BUS_OBEN} V${REGLER.y}`} stroke="#7fa7d6" strokeWidth="3" strokeDasharray="6 10" className="w26sv-fluss" style={g(["daten", "vorgabe", "leit"])} />

      {/* Datenebene unten: Regler → Feldgeräte (Sollwerte) */}
      <g style={g(["daten", "verteilung"])}>
        <path d={`M800 ${REGLER.y + REGLER.h} V${BUS_UNTEN}`} stroke="#7fa7d6" strokeWidth="3" strokeDasharray="6 10" className="w26sv-fluss" />
        <path d={`M230 ${BUS_UNTEN} H1370`} stroke="#4a7cbd" strokeWidth="2.5" strokeOpacity="0.55" />
        {FELD.map((k) => (
          <path key={`fu${k.x}`} d={`M${k.x} ${BUS_UNTEN} V${Y_FELD}`} stroke="#4a7cbd" strokeWidth="2.5" strokeDasharray="6 10" className="w26sv-fluss" />
        ))}
      </g>

      {/* Energiefluss: Feldgeräte → Netzanschlusspunkt */}
      <g style={g(["energie"])}>
        {FELD.map((k) => (
          <g key={`e${k.x}`}>
            <path d={`M${k.x} ${feldUnten} V${NAP_Y}`} stroke="#669933" strokeWidth="10" strokeOpacity="0.22" strokeLinecap="round" />
            <path d={`M${k.x} ${feldUnten} V${NAP_Y}`} stroke="#8cba58" strokeWidth="4" strokeDasharray="14 10" strokeLinecap="round" className="w26sv-fluss" />
          </g>
        ))}
      </g>

      {/* Rückführung Messwerte: Netzanschlusspunkt → Regler */}
      <g style={g(["mess"])}>
        <path d={`M1548 ${NAP_Y} V370 H${REGLER.x + REGLER.w}`} stroke="#ffc53d" strokeWidth="2.5" strokeDasharray="4 8" strokeLinejoin="round" className="w26sv-fluss-rueck" />
        <circle cx={REGLER.x + REGLER.w} cy="370" r="6" fill="#ffc53d" />
      </g>

      {/* Knotenpunkte */}
      {[230, 610, 990, 1370].map((x) => (
        <g key={`p${x}`}>
          <circle cx={x} cy={BUS_OBEN} r="5" fill="#7fa7d6" style={g(["daten", x > 800 ? "vorgabe" : "leit"])} />
          <circle cx={x} cy={BUS_UNTEN} r="5" fill="#7fa7d6" style={g(["daten", "verteilung"])} />
        </g>
      ))}

      {/* Kometen des aktiven Schritts (Neustart über key) */}
      {s && (
        <g key={`k${schritt}`}>
          {s.wege.map((d, i) => (
            <g key={d}>
              <path d={d} stroke={s.farbe} strokeOpacity="0.35" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="w26sv-komet" style={{ "--d": `${i * 120}ms` }} />
              <path d={d} stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="w26sv-komet" style={{ "--d": `${i * 120}ms` }} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

function Desktop({ hell, schritt, bewegt, istAktiv }) {
  const label = (arten) => ({ opacity: Math.max(hell(arten), 0.4), transition: "opacity 500ms" });
  return (
    <div className="relative hidden lg:block" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
      <Schema hell={hell} schritt={schritt} bewegt={bewegt} />
      {LEIT.map((k) => (
        <Knoten key={k.titel} k={k} y={Y_LEIT} aktiv={istAktiv(k.id)} />
      ))}
      {FELD.map((k) => (
        <Knoten key={k.titel} k={k} y={Y_FELD} aktiv={istAktiv(k.id)} />
      ))}

      {/* Bus-Beschriftungen */}
      <p
        className="absolute rounded-full bg-navy-950 px-3 py-1 text-[11.5px] font-medium text-navy-200 ring-1 ring-navy-700 xl:text-[12.5px]"
        style={{ left: pct(830, VB.w), top: pct(236, VB.h), ...label(["daten", "vorgabe", "leit"]) }}
      >
        {PROTO_OBEN}
      </p>
      <p className="absolute rounded-full bg-navy-950 px-3 py-1 text-[11.5px] font-medium text-navy-200 ring-1 ring-navy-700 xl:text-[12.5px]" style={{ left: pct(830, VB.w), top: pct(534, VB.h), ...label(["daten", "verteilung"]) }}>
        {PROTO_UNTEN}
      </p>
      <p className="absolute text-right text-[11.5px] font-semibold leading-tight text-sun-300 xl:text-[12.5px]" style={{ right: pct(72, VB.w), top: pct(386, VB.h), ...label(["mess"]) }}>
        Rückführung
        <br />U · I · P · Q · f
      </p>

      {/* Regler */}
      <Link
        href="/technik/parkregler"
        className={cn(
          "group absolute flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-ov-600 to-ov-800 px-6 text-white ring-1 transition-[transform,box-shadow] duration-500 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white xl:px-8",
          istAktiv("regler") ? "shadow-[0_30px_90px_-16px_rgba(140,186,88,0.75)] ring-ov-200/70" : "shadow-[0_30px_80px_-20px_rgba(102,153,51,0.5)] ring-ov-300/40"
        )}
        style={{ left: pct(REGLER.x, VB.w), top: pct(REGLER.y, VB.h), width: pct(REGLER.w, VB.w), height: pct(REGLER.h, VB.h) }}
      >
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-50" />
        <span aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 xl:h-14 xl:w-14">
          <Cpu aria-hidden="true" className="h-6 w-6 xl:h-7 xl:w-7" />
        </span>
        <span className="relative min-w-0">
          <span className="block text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-100">Regelebene · eigene Entwicklung</span>
          <span className="block font-display text-[19px] font-extrabold leading-tight tracking-tight xl:text-[23px]">Parkregler (EZA-Regler)</span>
          <span className="mt-0.5 block text-[12.5px] leading-snug text-white/80 xl:text-[13.5px]">misst am Netzanschlusspunkt, regelt P und Q, hält Einspeiselimit ein</span>
        </span>
        <span aria-hidden="true" className={cn("absolute right-4 top-4 h-2 w-2 rounded-full", istAktiv("regler") ? "w26sv-led bg-white" : "bg-white/35")} />
      </Link>

      {/* Netzanschlusspunkt */}
      <div
        className={cn(
          "absolute flex items-center justify-between gap-4 rounded-2xl px-6 text-white ring-1 backdrop-blur transition-[background-color,box-shadow] duration-500",
          istAktiv("nap") ? "bg-ov-500/[0.14] shadow-[0_0_60px_-20px_rgba(140,186,88,0.7)] ring-ov-300/60" : "bg-white/[0.06] ring-ov-400/40"
        )}
        style={{ left: pct(80, VB.w), top: pct(NAP_Y, VB.h), width: pct(1500, VB.w), height: pct(90, VB.h) }}
      >
        <span className="flex items-center gap-3 font-display text-[14.5px] font-bold xl:text-[16px]">
          <Gauge aria-hidden="true" className="h-5 w-5 text-ov-300" />
          Netzanschlusspunkt: Messung, Schutz, Zähler
        </span>
        <span className="hidden h-px flex-1 bg-gradient-to-r from-ov-400/60 via-ov-300 to-ov-400/60 xl:block" aria-hidden="true" />
        <span className="flex items-center gap-3 font-display text-[14.5px] font-bold xl:text-[16px]">
          <UtilityPole aria-hidden="true" className="h-5 w-5 text-ov-300" />
          Verteilernetz (Netzebene 7 bis 3)
        </span>
      </div>

      {/* Ebenen-Beschriftung links */}
      {[
        { t: "Leitebene", y: 14 },
        { t: "Regelebene", y: 268 },
        { t: "Feldebene", y: 570 },
      ].map((e) => (
        <span key={e.t} aria-hidden="true" className="absolute text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35" style={{ left: pct(80, VB.w), top: pct(e.y, VB.h) }}>
          {e.t}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobil                                                                */
/* ------------------------------------------------------------------ */

function MobilVerbinder({ text, energie = false, deckkraft = 1 }) {
  return (
    <div className="flex items-center gap-3 py-2 pl-5 transition-opacity duration-500" style={{ opacity: deckkraft }} aria-hidden="true">
      <svg viewBox="0 0 12 44" className="h-11 w-3 shrink-0" fill="none">
        <path d="M6 0V44" stroke={energie ? "#8cba58" : "#7fa7d6"} strokeWidth={energie ? 3.5 : 2.5} strokeDasharray={energie ? "10 7" : "5 7"} className="w26sv-fluss" />
      </svg>
      <span className={cn("text-[12px] leading-snug", energie ? "text-ov-300" : "text-navy-200")}>{text}</span>
    </div>
  );
}

function MobilKnoten({ k, aktiv }) {
  const Icon = k.icon;
  return (
    <Link
      href={k.href}
      className={cn(
        "relative flex min-h-[64px] items-center gap-3 rounded-2xl p-3.5 ring-1 transition-[background-color,box-shadow] duration-500 hover:ring-ov-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-300",
        aktiv ? "bg-navy-800/90 ring-ov-400/60" : "bg-white/[0.06] ring-white/12"
      )}
    >
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", aktiv ? "bg-ov-500/25 text-ov-200" : "bg-white/10 text-ov-300")}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[15px] font-bold leading-tight text-white">{k.titel}</span>
        <span className="block text-[12.5px] leading-snug text-white/55">{k.text}</span>
      </span>
      <span aria-hidden="true" className={cn("absolute right-3 top-3 h-1.5 w-1.5 rounded-full", aktiv ? "w26sv-led bg-ov-300" : "bg-white/20")} />
    </Link>
  );
}

function Mobil({ hell, istAktiv }) {
  return (
    <div className="lg:hidden">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Leitebene</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {LEIT.map((k) => (
          <MobilKnoten key={k.titel} k={k} aktiv={istAktiv(k.id)} />
        ))}
      </div>
      <MobilVerbinder text={PROTO_OBEN} deckkraft={Math.max(hell(["daten", "vorgabe", "leit"]), 0.35)} />
      <Link
        href="/technik/parkregler"
        className={cn(
          "relative flex items-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-ov-600 to-ov-800 p-5 text-white ring-1 transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
          istAktiv("regler") ? "shadow-[0_20px_60px_-16px_rgba(140,186,88,0.7)] ring-ov-200/70" : "ring-ov-300/40"
        )}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <Cpu aria-hidden="true" className="h-6 w-6" />
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ov-100">Regelebene</span>
          <span className="block font-display text-[18px] font-extrabold leading-tight">Parkregler (EZA-Regler)</span>
          <span className="block text-[13px] leading-snug text-white/80">misst am Netzanschlusspunkt, regelt P und Q</span>
        </span>
      </Link>
      <MobilVerbinder text={PROTO_UNTEN} deckkraft={Math.max(hell(["daten", "verteilung"]), 0.35)} />
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Feldebene</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {FELD.map((k) => (
          <MobilKnoten key={k.titel} k={k} aktiv={istAktiv(k.id)} />
        ))}
      </div>
      <MobilVerbinder energie text="Energiefluss · Messwerte zurück an den Regler" deckkraft={Math.max(hell(["energie", "mess"]), 0.35)} />
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl p-4 text-[14px] font-semibold text-white ring-1 transition-colors duration-500",
          istAktiv("nap") ? "bg-ov-500/[0.14] ring-ov-300/60" : "bg-white/[0.06] ring-ov-400/40"
        )}
      >
        <span className="flex items-center gap-2">
          <Gauge aria-hidden="true" className="h-4 w-4 text-ov-300" />
          Netzanschlusspunkt: Messung, Schutz, Zähler
        </span>
        <span className="flex items-center gap-2">
          <UtilityPole aria-hidden="true" className="h-4 w-4 text-ov-300" />
          Verteilernetz (Netzebene 7 bis 3)
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Regelzyklus (Schrittleiste)                                         */
/* ------------------------------------------------------------------ */

function Zyklus({ schritt, bewegt, laeuft, waehlen }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 lg:grid-cols-5" aria-label="Regelzyklus in fünf Schritten">
      {SCHRITTE.map((s, i) => {
        const aktiv = bewegt && i === schritt;
        return (
          <li key={s.art} className="relative flex">
            <button
              type="button"
              onClick={() => waehlen(i)}
              aria-pressed={aktiv}
              className={cn(
                "group relative flex w-full flex-col items-start gap-1.5 px-5 py-4 text-left transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ov-300 lg:min-h-[148px] lg:py-5",
                aktiv ? "bg-navy-800" : "bg-navy-950/95 hover:bg-navy-900"
              )}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "ov-num flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-display text-[11px] font-extrabold transition-colors duration-500",
                    aktiv ? "bg-ov-400 text-navy-950" : "bg-white/10 text-white/70"
                  )}
                >
                  0{i + 1}
                </span>
                <span className={cn("font-display text-[15px] font-bold transition-colors duration-500", aktiv ? "text-white" : "text-white/80")}>{s.titel}</span>
              </span>
              <span className={cn("text-[13px] leading-snug transition-colors duration-500", aktiv ? "text-white/75" : "text-white/50", bewegt && !aktiv && "max-lg:sr-only")}>{s.text}</span>
              {aktiv && (
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
                  <span key={`b${schritt}`} data-laeuft={laeuft ? "" : undefined} className="w26sv-balken block h-full w-full bg-gradient-to-r from-ov-400 to-ov-200" />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */

export default function SystemverbundLive() {
  const ref = useRef(null);
  const [fokus, setFokus] = useState(null); // Legende: daten | energie | mess
  const [schritt, setSchritt] = useState(0);
  const [bewegt, setBewegt] = useState(false); // Demo-Ablauf erlaubt (JS + keine reduzierte Bewegung)
  const [sichtbar, setSichtbar] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setzen = () => setBewegt(!mq.matches);
    setzen();
    mq.addEventListener("change", setzen);
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        setSichtbar(e.isIntersecting);
        if (e.isIntersecting) el.setAttribute("data-sicht", "");
        else el.removeAttribute("data-sicht");
      },
      { threshold: 0.2 }
    );
    if (el) io.observe(el);
    return () => {
      mq.removeEventListener("change", setzen);
      io.disconnect();
    };
  }, []);

  const laeuft = bewegt && sichtbar && !pause && !fokus;

  useEffect(() => {
    if (!laeuft) return undefined;
    const t = setTimeout(() => setSchritt((s) => (s + 1) % SCHRITTE.length), TAKT);
    return () => clearTimeout(t);
  }, [laeuft, schritt]);

  // Was ist hervorgehoben? Legende vor Ablauf; ohne Ablauf alles sichtbar.
  const aktiveArten = fokus ? (fokus === "daten" ? DATEN.concat("daten") : [fokus]) : bewegt ? [SCHRITTE[schritt].art] : null;
  const hell = (arten) => (!aktiveArten || arten.some((a) => aktiveArten.includes(a)) ? 1 : 0.2);
  const istAktiv = (id) => !fokus && bewegt && SCHRITTE[schritt].knoten.includes(id);

  const waehlen = (i) => {
    setFokus(null);
    setSchritt(i);
    setPause(true);
  };

  return (
    <Reveal as="figure" className="relative" data-blk="systemverbund">
      <style>{CSS}</style>
      <figcaption className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <span>
          <span className="block font-display text-[18px] font-bold text-white md:text-[20px]">Der Ökovolt-Systemverbund</span>
          <span className="mt-1 block text-[12.5px] text-white/50">schematisch · Boxen führen zur jeweiligen Seite</span>
        </span>
        <span className="hidden flex-wrap items-center gap-2 lg:flex" role="group" aria-label="Wege im Schema hervorheben">
          {LEGENDE.map((l) => {
            const an = fokus === l.art;
            return (
              <button
                key={l.art}
                type="button"
                aria-pressed={an}
                onClick={() => setFokus(an ? null : l.art)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[12.5px] font-medium ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-300",
                  an ? "bg-white text-navy-950 ring-white" : "text-white/70 ring-white/15 hover:bg-white/10 hover:text-white"
                )}
              >
                <span aria-hidden="true" className={l.strich} />
                {l.label}
              </button>
            );
          })}
        </span>
      </figcaption>

      {/* Monitorrahmen */}
      <div ref={ref} className="w26sv relative overflow-hidden rounded-[1.75rem] bg-navy-900/40 ring-1 ring-white/10 md:rounded-[2rem]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        {/* Kopfleiste */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-6">
          <span className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">
            <Activity aria-hidden="true" className="h-4 w-4 text-ov-300" />
            Schaltbild · Regelzyklus
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-white/[0.06] px-3 text-[12px] text-white/70 ring-1 ring-white/10">
              <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", laeuft ? "w26sv-led bg-ov-300" : "bg-white/35")} />
              {bewegt ? "Demo-Ablauf · keine Echtdaten" : "Schematische Ansicht · keine Echtdaten"}
            </span>
            {bewegt && (
              <button
                type="button"
                onClick={() => {
                  setFokus(null);
                  setPause((p) => !p);
                }}
                aria-label={pause ? "Ablauf abspielen" : "Ablauf anhalten"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/75 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-300"
              >
                {pause ? <Play aria-hidden="true" className="h-4 w-4" /> : <Pause aria-hidden="true" className="h-4 w-4" />}
              </button>
            )}
          </span>
        </div>

        <div className="px-4 pb-4 pt-5 md:px-6 md:pb-6 lg:px-8 lg:pt-8">
          <Desktop hell={hell} schritt={schritt} bewegt={bewegt && !fokus} istAktiv={istAktiv} />
          <Mobil hell={hell} istAktiv={istAktiv} />
          <div className="mt-6 lg:mt-8">
            <Zyklus schritt={schritt} bewegt={bewegt && !fokus} laeuft={laeuft} waehlen={waehlen} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
