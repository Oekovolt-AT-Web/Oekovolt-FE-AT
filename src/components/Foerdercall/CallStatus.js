"use client";

import { useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { FOERDERCALL, naechstesZiel, restZeit } from "@/lib/foerdercall";

/**
 * Status-Badge + Countdown des 3. EAG-Fördercalls 2026.
 *
 * Hydration: Server und erster Client-Render nutzen denselben Zeitpunkt
 * (`startMs`, vom Server beim Rendern bestimmt). Erst nach dem Mounten läuft
 * die echte Uhr – so gibt es keine abweichenden Texte zwischen HTML und Client.
 */

const PHASEN = {
  vor: { badge: "Vor dem Call", titel: "Ticketziehung am 08.10.2026 um 17 Uhr", ton: "bg-sun-400 text-navy-950" },
  ticket: { badge: "Call gestartet · Ticketziehung", titel: "Ticket jetzt ziehen – Antrag ab 09.10., 8 Uhr", ton: "bg-ov-400 text-navy-950" },
  einreichung: { badge: "Call läuft · Einreichung offen", titel: "Antrag bis 22.10.2026, 23:59 Uhr einreichen", ton: "bg-ov-400 text-navy-950" },
  nach: { badge: "Call beendet", titel: "Der 3. Fördercall 2026 ist geschlossen", ton: "bg-white/15 text-white" },
};

export default function CallStatus({ startMs, className }) {
  const [jetzt, setJetzt] = useState(startMs);
  const [live, setLive] = useState(false);

  useEffect(() => {
    setJetzt(Date.now());
    setLive(true);
    const t = setInterval(() => setJetzt(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const ziel = naechstesZiel(jetzt);
  const p = PHASEN[ziel.phase];
  const r = ziel.iso ? restZeit(Date.parse(ziel.iso), jetzt) : null;
  const felder = r
    ? [
        { w: r.tage, l: r.tage === 1 ? "Tag" : "Tage" },
        { w: r.stunden, l: "Std." },
        { w: r.minuten, l: "Min." },
        { w: r.sekunden, l: "Sek." },
      ]
    : [];

  return (
    <div className={cn("ov-glass rounded-3xl p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em]", p.ton)}>
          {ziel.phase !== "nach" && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-navy-950/60 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-navy-950" />
            </span>
          )}
          {p.badge}
        </span>
        <span className="text-[12.5px] font-medium text-white/55">3. Call · {FOERDERCALL.zeitraum}</span>
      </div>
      <p className="mt-3 font-display text-[19px] font-extrabold leading-snug tracking-tight text-white sm:text-[21px]">{p.titel}</p>

      {r ? (
        <>
          <div className="mt-4 grid grid-cols-4 gap-2" role="timer" aria-live="off" aria-label={`Noch ${r.tage} Tage, ${r.stunden} Stunden und ${r.minuten} Minuten ${ziel.text}`}>
            {felder.map((z) => (
              <div key={z.l} className="flex flex-col items-center rounded-2xl bg-white/[0.07] px-1 py-2.5 ring-1 ring-white/10">
                <span className="ov-num font-display text-[26px] font-extrabold leading-none text-white sm:text-[32px]">{live ? String(z.w).padStart(2, "0") : "–"}</span>
                <span className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-white/55 sm:text-[11px]">{z.l}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] text-white/55">{ziel.text} · Zeiten in MESZ (Wien)</p>
        </>
      ) : (
        <p className="mt-3 text-[14px] leading-relaxed text-white/70">
          Für 2026 ist kein weiterer Call angekündigt. Den nächsten Termin veröffentlicht die EAG-Förderabwicklungsstelle (OeMAG) – wir bereiten Ihr Projekt schon jetzt vor.
        </p>
      )}

      {ziel.phase === "vor" && (
        <a
          href="/forderungen/eag-foerdercall/termin.ics"
          download
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-[13.5px] font-semibold text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/15"
        >
          <CalendarPlus aria-hidden="true" className="h-4 w-4 text-ov-300" />
          Termine in den Kalender
        </a>
      )}
    </div>
  );
}
