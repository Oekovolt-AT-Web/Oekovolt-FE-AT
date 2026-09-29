"use client";

import { useState } from "react";
import Link from "next/link";
import { BatteryCharging, Cpu, Gauge, MonitorDot, PlugZap, Radio, ShieldCheck, Sun, TrendingUp, UtilityPole, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";
import Animationen from "@/components/ServiceAT/A/Animationen";

/**
 * Systemverbund als animiertes Schaltbild auf dunklem Grund (Server-Komponente,
 * Animation rein per CSS, bei reduzierter Bewegung statisch).
 * Desktop: maßstäbliches Schema (viewBox 1600 × 900) mit HTML-Knoten darüber.
 * Mobil: vertikale Schichten mit fließenden Verbindern.
 * Datenwege blau gestrichelt, Energiefluss grün, Rückführung der Messwerte gelb.
 */

const VB = { w: 1600, h: 900 };
const pct = (v, g) => `${(v / g) * 100}%`;

const LEIT = [
  { x: 230, icon: MonitorDot, titel: "SCADA & Leitwarte", text: "Kennzahlen, Alarme, Berichte", href: "/technik/scada" },
  { x: 610, icon: ShieldCheck, titel: "Fernwartung", text: "VPN, MFA, Protokoll", href: "/technik/fernwartung" },
  { x: 990, icon: Radio, titel: "Netzbetreiber", text: "Sollwerte, Fernwirk, Abschaltung", href: "/forderungen/richtlinien" },
  { x: 1370, icon: TrendingUp, titel: "Direktvermarkter", text: "Abregelung, Fahrplan, Ist-Werte", href: "/service/direktvermarktung" },
];
const FELD = [
  { x: 230, icon: Sun, titel: "PV-Generator", text: "Module, Strings, Unterkonstruktion", href: "/produkte/photovoltaikanlage" },
  { x: 610, icon: Zap, titel: "Wechselrichter", text: "verschiedene Hersteller", href: "/produkte/hersteller" },
  { x: 990, icon: BatteryCharging, titel: "Speicher", text: "Eigenverbrauch, Peak Shaving", href: "/produkte/stromspeicher" },
  { x: 1370, icon: PlugZap, titel: "Ladepunkte", text: "E-Flotte mit Lastmanagement", href: "/produkte/wallbox" },
];
const KW = 300; // Knotenbreite
const KH = 112; // Knotenhöhe
const Y_LEIT = 40;
const Y_FELD = 596;

function Knoten({ k, y }) {
  const Icon = k.icon;
  return (
    <Link
      href={k.href}
      className="group absolute flex items-center gap-3 rounded-2xl bg-navy-900/80 px-4 ring-1 ring-white/15 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-800 hover:ring-ov-400/70 xl:gap-3.5 xl:px-5"
      style={{ left: pct(k.x - KW / 2, VB.w), top: pct(y, VB.h), width: pct(KW, VB.w), height: pct(KH, VB.h) }}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ov-300 transition-colors group-hover:bg-ov-500 group-hover:text-white xl:h-11 xl:w-11">
        <Icon aria-hidden="true" className="h-[18px] w-[18px] xl:h-5 xl:w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[13.5px] font-bold leading-tight text-white xl:text-[15.5px]">{k.titel}</span>
        <span className="mt-0.5 block text-[11.5px] leading-snug text-white/55 xl:text-[12.5px]">{k.text}</span>
      </span>
    </Link>
  );
}

function Schema({ fokus }) {
  const sicht = (art) => ({ opacity: !fokus || fokus === art ? 1 : 0.1, transition: "opacity 400ms" });
  const leitUnten = Y_LEIT + KH;
  const feldOben = Y_FELD;
  const feldUnten = Y_FELD + KH;
  const busOben = 222;
  const busUnten = 520;
  const reglerOben = 292;
  const reglerUnten = 448;
  const napY = 790;
  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full" aria-hidden="true" fill="none">
      <defs>
        <radialGradient id="sv-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#669933" stopOpacity="0.55" />
          <stop offset="1" stopColor="#669933" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Glow hinter dem Regler */}
      <ellipse cx="800" cy="370" rx="420" ry="170" fill="url(#sv-glow)" className="ts-puls" />

      <g style={sicht("daten")}>
      {/* Datenebene oben: Leitebene → Regler */}
      {LEIT.map((k) => (
        <path key={`lo${k.x}`} d={`M${k.x} ${leitUnten} V${busOben}`} stroke="#4a7cbd" strokeWidth="2.5" strokeDasharray="6 10" className="ts-fluss" />
      ))}
      <path d={`M230 ${busOben} H1370`} stroke="#4a7cbd" strokeWidth="2.5" strokeOpacity="0.55" />
      <path d={`M800 ${busOben} V${reglerOben}`} stroke="#7fa7d6" strokeWidth="3" strokeDasharray="6 10" className="ts-fluss" />

      {/* Datenebene unten: Regler → Feldgeräte (Sollwerte) */}
      <path d={`M800 ${reglerUnten} V${busUnten}`} stroke="#7fa7d6" strokeWidth="3" strokeDasharray="6 10" className="ts-fluss" />
      <path d={`M230 ${busUnten} H1370`} stroke="#4a7cbd" strokeWidth="2.5" strokeOpacity="0.55" />
      {FELD.map((k) => (
        <path key={`fu${k.x}`} d={`M${k.x} ${busUnten} V${feldOben}`} stroke="#4a7cbd" strokeWidth="2.5" strokeDasharray="6 10" className="ts-fluss" />
      ))}

      </g>
      <g style={sicht("energie")}>
      {/* Energiefluss: Feldgeräte → Netzanschlusspunkt */}
      {FELD.map((k) => (
        <g key={`e${k.x}`}>
          <path d={`M${k.x} ${feldUnten} V${napY}`} stroke="#669933" strokeWidth="8" strokeOpacity="0.25" strokeLinecap="round" />
          <path d={`M${k.x} ${feldUnten} V${napY}`} stroke="#8cba58" strokeWidth="4" strokeDasharray="14 10" strokeLinecap="round" className="ts-fluss" />
        </g>
      ))}

      </g>
      <g style={sicht("mess")}>
      {/* Rückführung Messwerte: Netzanschlusspunkt → Regler (rechts außen) */}
      <path d={`M1548 ${napY} V370 H1060`} stroke="#ffc53d" strokeWidth="2.5" strokeDasharray="4 8" strokeLinejoin="round" className="ts-fluss-rueck" />
      <circle cx="1060" cy="370" r="6" fill="#ffc53d" className="ts-blink" />
      </g>

      <g style={sicht("daten")}>
      {/* Knotenpunkte */}
      {[230, 610, 990, 1370].map((x) => (
        <g key={`p${x}`}>
          <circle cx={x} cy={busOben} r="5" fill="#7fa7d6" />
          <circle cx={x} cy={busUnten} r="5" fill="#7fa7d6" />
        </g>
      ))}
      </g>
    </svg>
  );
}

function Desktop({ fokus }) {
  return (
    <div className="relative hidden lg:block" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
      <Schema fokus={fokus} />
      {LEIT.map((k) => (
        <Knoten key={k.titel} k={k} y={Y_LEIT} />
      ))}
      {FELD.map((k) => (
        <Knoten key={k.titel} k={k} y={Y_FELD} />
      ))}

      {/* Bus-Beschriftungen */}
      <p className="absolute rounded-full bg-navy-950 px-3 py-1 text-[11.5px] font-medium text-navy-200 ring-1 ring-navy-700 xl:text-[12.5px]" style={{ left: pct(830, VB.w), top: pct(236, VB.h) }}>
        IEC 60870-5-104 · Modbus TCP · OpenADR · gesicherte API
      </p>
      <p className="absolute rounded-full bg-navy-950 px-3 py-1 text-[11.5px] font-medium text-navy-200 ring-1 ring-navy-700 xl:text-[12.5px]" style={{ left: pct(830, VB.w), top: pct(534, VB.h) }}>
        Modbus TCP · SunSpec · OCPP · Speicher-EMS
      </p>
      <p className="absolute text-right text-[11.5px] font-semibold leading-tight text-sun-300 xl:text-[12.5px]" style={{ right: pct(64, VB.w), top: pct(386, VB.h) }}>
        Rückführung
        <br />U · I · P · Q · f
      </p>

      {/* Regler */}
      <Link
        href="/technik/parkregler"
        className="group absolute flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-ov-600 to-ov-800 px-6 text-white shadow-[0_30px_80px_-20px_rgba(102,153,51,0.55)] ring-1 ring-ov-300/40 transition-transform duration-300 hover:-translate-y-0.5 xl:px-8"
        style={{ left: pct(470, VB.w), top: pct(292, VB.h), width: pct(660, VB.w), height: pct(156, VB.h) }}
      >
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-50" />
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 xl:h-14 xl:w-14">
          <Cpu aria-hidden="true" className="h-6 w-6 xl:h-7 xl:w-7" />
        </span>
        <span className="relative min-w-0">
          <span className="block text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-100">Regelebene</span>
          <span className="block font-display text-[19px] font-extrabold leading-tight tracking-tight xl:text-[23px]">Parkregler (EZA-Regler)</span>
          <span className="mt-0.5 block text-[12.5px] leading-snug text-white/80 xl:text-[13.5px]">misst am Netzanschlusspunkt, regelt P und Q, hält Einspeiselimit ein</span>
        </span>
      </Link>

      {/* Netzanschlusspunkt */}
      <div
        className="absolute flex items-center justify-between gap-4 rounded-2xl bg-white/[0.06] px-6 text-white ring-1 ring-ov-400/40 backdrop-blur"
        style={{ left: pct(80, VB.w), top: pct(790, VB.h), width: pct(1500, VB.w), height: pct(90, VB.h) }}
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
        { t: "Leitebene", y: 18 },
        { t: "Regelebene", y: 270 },
        { t: "Feldebene", y: 574 },
      ].map((e) => (
        <span key={e.t} className="absolute text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35" style={{ left: pct(80, VB.w), top: pct(e.y, VB.h) }}>
          {e.t}
        </span>
      ))}
    </div>
  );
}

function MobilVerbinder({ text, energie = false }) {
  return (
    <div className="flex items-center gap-3 py-2 pl-5" aria-hidden="true">
      <svg viewBox="0 0 12 44" className="h-11 w-3 shrink-0" fill="none">
        <path d="M6 0V44" stroke={energie ? "#8cba58" : "#7fa7d6"} strokeWidth={energie ? 3.5 : 2.5} strokeDasharray={energie ? "10 7" : "5 7"} className="ts-fluss" />
      </svg>
      <span className={cn("text-[12px] leading-snug", energie ? "text-ov-300" : "text-navy-200")}>{text}</span>
    </div>
  );
}

function MobilKnoten({ k }) {
  const Icon = k.icon;
  return (
    <Link href={k.href} className="flex min-h-[64px] items-center gap-3 rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/12 hover:ring-ov-400/70">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ov-300">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[15px] font-bold leading-tight text-white">{k.titel}</span>
        <span className="block text-[12.5px] leading-snug text-white/55">{k.text}</span>
      </span>
    </Link>
  );
}

function Mobil() {
  return (
    <div className="lg:hidden">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Leitebene</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {LEIT.map((k) => (
          <MobilKnoten key={k.titel} k={k} />
        ))}
      </div>
      <MobilVerbinder text="IEC 60870-5-104 · Modbus TCP · OpenADR · gesicherte API" />
      <Link href="/technik/parkregler" className="relative flex items-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-br from-ov-600 to-ov-800 p-5 text-white ring-1 ring-ov-300/40">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <Cpu aria-hidden="true" className="h-6 w-6" />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-[18px] font-extrabold leading-tight">Parkregler (EZA-Regler)</span>
          <span className="block text-[13px] leading-snug text-white/80">misst am Netzanschlusspunkt, regelt P und Q</span>
        </span>
      </Link>
      <MobilVerbinder text="Modbus TCP · SunSpec · OCPP · Speicher-EMS" />
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Feldebene</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {FELD.map((k) => (
          <MobilKnoten key={k.titel} k={k} />
        ))}
      </div>
      <MobilVerbinder energie text="Energiefluss · Messwerte zurück an den Regler" />
      <div className="flex flex-col gap-2 rounded-2xl bg-white/[0.06] p-4 text-[14px] font-semibold text-white ring-1 ring-ov-400/40">
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

const LEGENDE = [
  { art: "daten", label: "Daten & Sollwerte", strich: "h-0.5 w-6 bg-[repeating-linear-gradient(90deg,#7fa7d6_0_5px,transparent_5px_10px)]" },
  { art: "energie", label: "Energiefluss", strich: "h-1 w-6 rounded bg-ov-400" },
  { art: "mess", label: "Messwert-Rückführung", strich: "h-0.5 w-6 bg-[repeating-linear-gradient(90deg,#ffc53d_0_4px,transparent_4px_9px)]" },
];

export default function SystemverbundLive() {
  const [fokus, setFokus] = useState(null);
  return (
    <Reveal as="figure" className="relative">
      <Animationen />
      <figcaption className="mb-6 flex flex-wrap items-center justify-between gap-4">
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
                onMouseEnter={() => setFokus(l.art)}
                onMouseLeave={() => setFokus(null)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-[12.5px] font-medium ring-1 transition-colors",
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
      <Desktop fokus={fokus} />
      <Mobil />
    </Reveal>
  );
}
