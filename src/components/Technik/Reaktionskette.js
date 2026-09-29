"use client";

import { useEffect, useRef, useState } from "react";
import { BellRing, ClipboardList, Pause, Play, RotateCcw, Siren, Stethoscope, Truck } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Reaktionskette der Fernwartung: Alarm → Einstufen → Diagnose → Fern beheben →
 * Einsatz vor Ort → Bericht. Läuft automatisch durch, sobald sichtbar (nicht bei
 * reduzierter Bewegung), und lässt sich anhalten oder per Klick steuern.
 */

const SCHRITTE = [
  { icon: BellRing, title: "Erkennen", text: "Automatischer Alarm aus Wechselrichter, Datenlogger, Zähler oder Parkregler – plausibilisiert gegen Einstrahlung und Sollwerte." },
  { icon: Siren, title: "Einstufen", text: "Priorität nach Ertragsverlust, Sicherheitsrelevanz und Netzvorgaben; Eskalation nach festgelegter Kette." },
  { icon: Stethoscope, title: "Diagnose", text: "Fehlerspeicher, Messwerte und Ereignisprotokolle auswerten; Ursache und benötigte Teile festlegen." },
  { icon: RotateCcw, title: "Fern beheben", text: "Neustart, Parameterkorrektur oder Kommunikationswiederherstellung – protokolliert und bestätigt." },
  { icon: Truck, title: "Einsatz vor Ort", text: "Wenn nötig: Techniker mit Diagnose und Ersatzteil, Arbeiten nach ÖVE/ÖNORM EN 50110-1." },
  { icon: ClipboardList, title: "Bericht", text: "Ursache, Maßnahmen, Ausfallzeit und Ertragsverlust dokumentiert – für Versicherung, Bank und Ihr Controlling." },
];

const DAUER = 3200;

export default function Reaktionskette() {
  const [aktiv, setAktiv] = useState(0);
  const [laeuft, setLaeuft] = useState(false);
  const ref = useRef(null);

  // Start, sobald im Bild – nicht bei reduzierter Bewegung
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLaeuft(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!laeuft) return;
    const t = setTimeout(() => setAktiv((a) => (a + 1) % SCHRITTE.length), DAUER);
    return () => clearTimeout(t);
  }, [laeuft, aktiv]);

  const s = SCHRITTE[aktiv];

  return (
    <div ref={ref}>
      {/* Kette */}
      <ol className="relative grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-2">
        <div aria-hidden="true" className="absolute left-[8%] right-[8%] top-7 hidden h-0.5 rounded bg-white/10 md:block">
          <div className="h-full rounded bg-gradient-to-r from-ov-400 to-sun-300 transition-[width] duration-700" style={{ width: `${(aktiv / (SCHRITTE.length - 1)) * 100}%` }} />
        </div>
        {SCHRITTE.map((st, i) => {
          const an = i === aktiv;
          const vorbei = i < aktiv;
          return (
            <li key={st.title} className="relative flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => {
                  setAktiv(i);
                  setLaeuft(false);
                }}
                aria-current={an ? "step" : undefined}
                aria-label={`Schritt ${i + 1}: ${st.title}`}
                className={cn(
                  "relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ov-400/60",
                  an ? "scale-110 bg-ov-500 text-white ring-ov-300 shadow-[0_0_40px_-6px_rgba(140,186,88,0.8)]" : vorbei ? "bg-navy-800 text-ov-300 ring-ov-500/40" : "bg-navy-900 text-white/45 ring-white/12 hover:text-white"
                )}
              >
                <st.icon aria-hidden="true" className="h-6 w-6" />
                {an && laeuft && <span aria-hidden="true" className="absolute inset-0 rounded-2xl ring-2 ring-ov-300/60 motion-safe:animate-ping" />}
              </button>
              <span className={cn("mt-3 font-display text-[13.5px] font-bold leading-tight md:text-[14.5px]", an ? "text-white" : "text-white/55")}>
                <span className="block text-[11px] font-semibold text-ov-300/80">{String(i + 1).padStart(2, "0")}</span>
                {st.title}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Detail */}
      <div className="mt-10 grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div key={aktiv} className="ov-tab-panel ov-glass rounded-3xl p-6 md:p-8" aria-live="polite">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">
            Stufe {aktiv + 1} von {SCHRITTE.length}
          </p>
          <p className="mt-2 flex items-center gap-3 font-display text-[24px] font-extrabold tracking-tight text-white md:text-[28px]">
            <s.icon aria-hidden="true" className="h-6 w-6 text-ov-300" />
            {s.title}
          </p>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-white/75">{s.text}</p>
          {laeuft && (
            <div aria-hidden="true" className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
              <div key={`b${aktiv}`} className="ov-hero-fortschritt h-full rounded-full bg-ov-400" style={{ animationDuration: `${DAUER}ms` }} />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setLaeuft((l) => !l)}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full px-5 text-[14px] font-semibold text-white ring-1 ring-white/25 hover:bg-white/10 md:self-center"
        >
          {laeuft ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
          {laeuft ? "Anhalten" : "Abspielen"}
        </button>
      </div>

      {/* Alle Schritte als Text (SEO, ohne JS lesbar) */}
      <ol className="sr-only">
        {SCHRITTE.map((st) => (
          <li key={st.title}>
            {st.title}: {st.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
