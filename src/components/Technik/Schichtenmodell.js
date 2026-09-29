"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Cpu, FileLock2, Fingerprint, History, KeyRound, Network, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Sicherheits-Schichtenmodell der Fernwartung (Zero Trust, Zonen-Conduit-Modell
 * nach IEC 62443). Schichten anklicken → Erklärung; „Zugriff durchspielen“ lässt
 * einen Beispiel-Zugriff Schicht für Schicht passieren, das Protokoll schreibt mit.
 * Der Ablauf ist ein illustratives Beispiel, keine Aufzeichnung.
 */

const SCHICHTEN = [
  {
    key: "mfa",
    icon: Fingerprint,
    kurz: "Identität",
    titel: "Mehr-Faktor-Authentifizierung",
    text: "Jeder Zugriff auf Regler, Wechselrichter oder Datenlogger erfordert eine persönliche Kennung mit zweitem Faktor – keine geteilten Sammelkonten.",
    log: "Anmeldung persönliche Kennung · 2. Faktor bestätigt",
  },
  {
    key: "zt",
    icon: KeyRound,
    kurz: "Freigabe",
    titel: "Zero Trust & minimale Rechte",
    text: "Jede Sitzung wird einzeln geprüft und nur für die benötigten Geräte freigeschaltet. Lesender Zugriff ist die Regel, schreibender die begründete Ausnahme.",
    log: "Sitzung freigegeben: nur Wechselrichter 3 · lesend",
  },
  {
    key: "tunnel",
    icon: Network,
    kurz: "Verbindung",
    titel: "Keine offenen Ports an der Anlage",
    text: "Das Gateway in der Anlage baut die verschlüsselte Verbindung von innen nach außen auf. Von außen erreichbare Modbus- oder Webschnittstellen gibt es nicht.",
    log: "Verschlüsselter Tunnel – vom Gateway ausgehend aufgebaut",
  },
  {
    key: "zonen",
    icon: FileLock2,
    kurz: "Zonen",
    titel: "Zonen & Übergänge",
    text: "Anlagennetz, Fernwirkanbindung des Netzbetreibers und Büro-IT sind getrennte Zonen mit definierten Übergängen nach dem Zonen-Conduit-Modell der IEC 62443.",
    log: "Übergang Zone Fernwartung → Anlagennetz (Conduit)",
  },
  {
    key: "proto",
    icon: ShieldCheck,
    kurz: "Protokolle",
    titel: "Gesicherte Protokolle",
    text: "Modbus TCP und IEC 60870-5-104 bringen keine eigene Authentifizierung mit. Sie bleiben im Anlagennetz; wo Geräte es unterstützen, nutzen wir gesicherte Varianten nach IEC 62351.",
    log: "Lesezugriff Modbus TCP – nur innerhalb des Anlagennetzes",
  },
];

const PROTOKOLL = {
  icon: History,
  titel: "Lückenloses Protokoll",
  text: "Wer wann worauf zugegriffen und was geändert hat, wird zeitgestempelt protokolliert – inklusive Parameteränderungen an netzrelevanten Einstellungen.",
};

// Ringe (außen → innen) als konzentrische Rechtecke
const RING = [
  { inset: 0, r: 40 },
  { inset: 34, r: 34 },
  { inset: 68, r: 28 },
  { inset: 102, r: 22 },
  { inset: 136, r: 18 },
];

export default function Schichtenmodell() {
  const [aktiv, setAktiv] = useState(0);
  const [lauf, setLauf] = useState(-1); // -1 = kein Durchlauf, 0..5 Fortschritt
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const start = () => {
    clearTimeout(timer.current);
    const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduziert) {
      setLauf(SCHICHTEN.length);
      return;
    }
    let i = 0;
    setLauf(0);
    setAktiv(0);
    const weiter = () => {
      i += 1;
      setLauf(i);
      if (i < SCHICHTEN.length) {
        setAktiv(i);
        timer.current = setTimeout(weiter, 1100);
      }
    };
    timer.current = setTimeout(weiter, 1100);
  };

  const reset = () => {
    clearTimeout(timer.current);
    setLauf(-1);
  };

  const s = SCHICHTEN[aktiv];
  const logZeilen = lauf < 0 ? [] : SCHICHTEN.slice(0, Math.min(lauf + 1, SCHICHTEN.length));
  const fertig = lauf >= SCHICHTEN.length;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-navy-950 text-white shadow-2xl ring-1 ring-white/10">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Grafik */}
        <div className="relative p-5 md:p-8">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-50" />
          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            {RING.map((r, i) => {
              const sch = SCHICHTEN[i];
              const an = aktiv === i;
              const passiert = lauf > i;
              return (
                <button
                  key={sch.key}
                  type="button"
                  onClick={() => setAktiv(i)}
                  aria-pressed={an}
                  aria-label={`Schicht ${i + 1}: ${sch.titel}`}
                  className={cn(
                    "absolute border-2 text-left transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ov-400/60",
                    an ? "border-ov-400 bg-ov-500/[0.14] shadow-[0_0_40px_-6px_rgba(140,186,88,0.55)]" : passiert ? "border-ov-500/60 bg-white/[0.03]" : "border-white/15 bg-white/[0.02] hover:border-white/35"
                  )}
                  style={{ inset: `${(r.inset / 460) * 100}%`, borderRadius: r.r }}
                >
                  <span
                    className={cn(
                      "absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors sm:text-[11.5px]",
                      an ? "bg-ov-500 text-white" : passiert ? "bg-navy-900 text-ov-300" : "bg-navy-900 text-white/55"
                    )}
                    style={{ top: -12 }}
                  >
                    {passiert ? <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} /> : <sch.icon aria-hidden="true" className="h-3 w-3" />}
                    {sch.kurz}
                  </span>
                </button>
              );
            })}
            {/* Kern */}
            <div
              className={cn(
                "absolute flex flex-col items-center justify-center rounded-2xl text-center transition-all duration-500",
                fertig ? "bg-ov-600 shadow-[0_0_60px_-10px_rgba(140,186,88,0.8)]" : "bg-navy-800 ring-1 ring-white/15"
              )}
              style={{ inset: `${(172 / 460) * 100}%` }}
            >
              <Cpu aria-hidden="true" className="h-6 w-6 text-white/85" />
              <span className="mt-1 px-1 text-[11px] font-semibold leading-tight text-white/85 sm:text-[12px]">Anlage</span>
            </div>
            {/* Protokoll-Band */}
            <div aria-hidden="true" className="absolute -right-1 bottom-6 top-6 w-1.5 rounded-full bg-gradient-to-b from-sun-300/0 via-sun-300/70 to-sun-300/0 sm:-right-3" />
          </div>
        </div>

        {/* Erklärung + Protokoll */}
        <div className="flex flex-col border-t border-white/10 p-6 md:p-8 lg:border-l lg:border-t-0">
          <div key={s.key} className="ov-tab-panel" aria-live="polite">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">
              Schicht {aktiv + 1} von {SCHICHTEN.length}
            </p>
            <h3 className="mt-2 flex items-center gap-2.5 font-display text-[22px] font-extrabold leading-tight tracking-tight">
              <s.icon aria-hidden="true" className="h-5 w-5 text-ov-300" />
              {s.titel}
            </h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-white/70">{s.text}</p>
          </div>

          <div className="mt-5 flex gap-3 rounded-2xl bg-sun-400/[0.08] p-4 ring-1 ring-sun-400/25">
            <PROTOKOLL.icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" />
            <p className="text-[13.5px] leading-relaxed text-white/70">
              <strong className="text-white">{PROTOKOLL.titel}: </strong>
              {PROTOKOLL.text}
            </p>
          </div>

          {/* Mini-Terminal */}
          <div className="mt-5 flex-1 rounded-2xl bg-black/35 p-4 font-mono text-[12px] leading-relaxed ring-1 ring-white/10">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-white/45">zugriffsprotokoll · Beispielablauf</span>
              {lauf < 0 ? (
                <button type="button" onClick={start} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ov-500 px-3 font-sans text-[12.5px] font-semibold text-white hover:bg-ov-600">
                  <Play aria-hidden="true" className="h-3.5 w-3.5" />
                  Zugriff durchspielen
                </button>
              ) : (
                <button type="button" onClick={reset} className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 font-sans text-[12.5px] font-semibold text-white/70 ring-1 ring-white/20 hover:text-white">
                  <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                  Zurücksetzen
                </button>
              )}
            </div>
            <ol className="min-h-[132px] space-y-1" aria-live="polite">
              {lauf < 0 && <li className="text-white/35">Noch kein Zugriff – starten Sie den Beispielablauf.</li>}
              {logZeilen.map((z, i) => (
                <li key={z.key} className="ov-tab-panel flex gap-2 text-white/75">
                  <span className="text-ov-300">✓</span>
                  <span className="text-white/35">{`0${i + 1}`}</span>
                  <span className="min-w-0">{z.log}</span>
                </li>
              ))}
              {fertig && <li className="ov-tab-panel text-sun-300">→ Sitzung beendet · Protokoll zeitgestempelt gesichert</li>}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
