"use client";

import { useEffect, useRef, useState } from "react";
import { Gavel, Ticket } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Förderkalender 2026: EAG-Fördercalls als Zeitfenster und Gebotstermine der
 * Marktprämie auf einer Jahresachse, dazu ein Countdown zur Ticketziehung des
 * nächsten Calls. Datumswerte kommen als Text aus bund.js ("23.04.–11.05.2026").
 *
 * calls:   [{ nr, zeitraum, budget: {A,B,C,D}, summe, status }]
 * termine: [{ datum, volumen, hoechstpreis, status }]
 * start:   ISO-Zeitpunkt der Ticketziehung, z. B. "2026-10-08T17:00:00+02:00"
 * heuteIso: Prüfdatum als Startwert (vermeidet Hydrationsfehler)
 */

const MONATE = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const JAHR_START = Date.UTC(2026, 0, 1);
const JAHR_ENDE = Date.UTC(2027, 0, 1);

function datum(t) {
  const [d, m, y] = t.split(".").map((x) => x.trim());
  return Date.UTC(Number(y), Number(m) - 1, Number(d));
}
function fenster(zeitraum) {
  const [a, b] = zeitraum.split("–");
  const jahr = b.trim().slice(-4);
  return [datum(`${a.trim()}${jahr}`), datum(b.trim()) + 86_400_000];
}
const pos = (t) => ((t - JAHR_START) / (JAHR_ENDE - JAHR_START)) * 100;

export default function Foerderkalender({ calls = [], termine = [], start, ende, heuteIso, hinweis, kopf }) {
  const [jetzt, setJetzt] = useState(() => Date.parse(heuteIso));
  const [live, setLive] = useState(false);
  const [sichtbar, setSichtbar] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setJetzt(Date.now());
    setLive(true);
    const t = setInterval(() => setJetzt(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSichtbar(true);
        io.disconnect();
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const startMs = Date.parse(start);
  const endeMs = Date.parse(ende);
  const rest = Math.max(0, startMs - jetzt);
  const phase = jetzt < startMs ? "vor" : jetzt < endeMs ? "laeuft" : "vorbei";
  const tage = Math.floor(rest / 86_400_000);
  const stunden = Math.floor((rest % 86_400_000) / 3_600_000);
  const minuten = Math.floor((rest % 3_600_000) / 60_000);
  const heutePos = Math.min(100, Math.max(0, pos(jetzt)));

  return (
    <div ref={ref}>
      {/* Kopf + Countdown */}
      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
        <div className="min-w-0">{kopf}</div>
        <div className="ov-glass rounded-3xl p-5 sm:p-6">
          <p className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ov-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ov-400" />
            </span>
            {phase === "vor" ? "Nächster Fördercall" : phase === "laeuft" ? "Fördercall läuft" : "Fördercalls 2026"}
          </p>
          <p className="mt-2 font-display text-[21px] font-extrabold leading-tight tracking-tight text-white">
            {phase === "vorbei" ? "Alle drei Calls 2026 sind abgeschlossen." : <>3. Call · <span className="ov-num">{calls[2]?.zeitraum}</span></>}
          </p>
          {phase !== "vorbei" && (
            <div className="mt-4 flex gap-2.5" aria-live="off">
              {(phase === "vor"
                ? [
                    { w: tage, l: tage === 1 ? "Tag" : "Tage" },
                    { w: stunden, l: "Std." },
                    { w: minuten, l: "Min." },
                  ]
                : [{ w: Math.max(0, Math.ceil((endeMs - jetzt) / 86_400_000)), l: "Tage offen" }]
              ).map((z) => (
                <div key={z.l} className="flex w-[78px] flex-col items-center rounded-2xl bg-white/[0.07] px-2 py-3 ring-1 ring-white/10 sm:w-[88px]">
                  <span className="ov-num font-display text-[32px] font-extrabold leading-none text-white sm:text-[36px]">{live ? String(z.w).padStart(2, "0") : "–"}</span>
                  <span className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-white/55">{z.l}</span>
                </div>
              ))}
            </div>
          )}
          {phase === "vor" && <p className="mt-3 text-[12.5px] text-white/50">bis zur Ticketziehung A/B am {new Date(startMs).toLocaleDateString("de-DE", { timeZone: "Europe/Vienna" })}, 17 Uhr</p>}
        </div>
      </div>

      {/* Jahresachse */}
      <div className="ov-glass mt-8 rounded-3xl p-5 sm:p-7">
        <div className="relative">
          {/* Monate */}
          <div aria-hidden="true" className="relative ml-0 grid grid-cols-12 text-[11px] font-semibold uppercase tracking-wider text-white/40 sm:ml-[132px]">
            {MONATE.map((m) => (
              <span key={m} className="border-l border-white/10 pl-1.5">
                <span className="hidden sm:inline">{m}</span>
                <span className="sm:hidden">{m[0]}</span>
              </span>
            ))}
          </div>

          {/* Spur EAG */}
          <Spur titel="EAG-Investitionszuschuss" icon={<Ticket aria-hidden="true" className="h-4 w-4 text-ov-300" />}>
            {calls.map((c, i) => {
              const [a, b] = fenster(c.zeitraum);
              const vorbei = b < jetzt;
              return (
                <span
                  key={c.nr}
                  title={`${c.nr}. Call ${c.zeitraum} · ${c.summe}`}
                  className={cn(
                    "absolute top-1/2 h-7 -translate-y-1/2 origin-left rounded-full transition-transform duration-700 ease-out motion-reduce:transition-none",
                    vorbei ? "bg-white/25" : "bg-gradient-to-r from-ov-400 to-ov-600 shadow-[0_0_24px_rgba(140,186,88,0.55)]",
                    sichtbar ? "scale-x-100" : "scale-x-0 motion-reduce:scale-x-100"
                  )}
                  style={{ left: `${pos(a)}%`, width: `max(${pos(b) - pos(a)}%, 10px)`, transitionDelay: `${200 + i * 180}ms` }}
                >
                  <span className="absolute -top-6 left-0 whitespace-nowrap text-[11.5px] font-bold text-white/80">{c.nr}.</span>
                </span>
              );
            })}
          </Spur>

          {/* Spur Marktprämie */}
          <Spur titel="Marktprämie (Gebot)" icon={<Gavel aria-hidden="true" className="h-4 w-4 text-sun-400" />}>
            {termine.map((t, i) => {
              const d = datum(t.datum);
              const vorbei = d + 86_400_000 < jetzt;
              return (
                <span
                  key={t.datum}
                  title={`Gebotstermin ${t.datum}`}
                  className={cn(
                    "absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[3px] transition-all duration-500",
                    vorbei ? "bg-white/30" : "bg-sun-400 shadow-[0_0_18px_rgba(255,197,61,0.7)]",
                    sichtbar ? "opacity-100" : "opacity-0 motion-reduce:opacity-100"
                  )}
                  style={{ left: `${pos(d)}%`, transitionDelay: `${700 + i * 120}ms` }}
                />
              );
            })}
          </Spur>

          {/* Heute */}
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 top-6 hidden sm:left-[132px] sm:block">
            <span className="absolute bottom-0 top-0 w-px bg-white/70" style={{ left: `${heutePos}%` }}>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-navy-950">heute</span>
            </span>
          </div>
        </div>

        {/* Call-Karten */}
        <ol className="mt-10 grid gap-3 md:grid-cols-3">
          {calls.map((c) => {
            const [, b] = fenster(c.zeitraum);
            const vorbei = b < jetzt;
            return (
              <li key={c.nr} className={cn("rounded-2xl p-5 ring-1 transition-colors", vorbei ? "bg-white/[0.03] ring-white/10" : "bg-ov-500/15 ring-ov-400/40")}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-[17px] font-bold text-white">{c.nr}. Call</p>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[12px] font-semibold", vorbei ? "bg-white/10 text-white/60" : "bg-ov-400 text-navy-950")}>{c.status}</span>
                </div>
                <p className="ov-num mt-1 text-[14px] text-white/65">{c.zeitraum}</p>
                <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
                  {["A", "B", "C", "D"].map((k) => (
                    <div key={k} className="rounded-xl bg-white/[0.05] px-1 py-2">
                      <dt className="text-[11px] font-semibold uppercase text-white/45">Kat. {k}</dt>
                      <dd className="ov-num mt-0.5 text-[12.5px] font-bold text-white">{c.budget[k].replace(" Mio. €", " Mio.")}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-[13.5px] text-white/60">Summe <strong className="ov-num text-white">{c.summe}</strong></p>
              </li>
            );
          })}
        </ol>
        {hinweis && (
          <p className="mt-5 flex gap-3 rounded-2xl bg-ov-500/10 p-4 text-[14.5px] leading-relaxed text-white/75 ring-1 ring-ov-400/25">
            <Ticket aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
            <span><strong className="text-white">Tipp für Kategorie A und B:</strong> {hinweis}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function Spur({ titel, icon, children }) {
  return (
    <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
      <p className="flex w-[132px] shrink-0 items-center gap-2 text-[12.5px] font-semibold leading-tight text-white/75">
        {icon}
        {titel}
      </p>
      <div className="relative h-9 flex-1 rounded-full bg-white/[0.04] ring-1 ring-inset ring-white/5">{children}</div>
    </div>
  );
}
