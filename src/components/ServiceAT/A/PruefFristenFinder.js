"use client";

import { useId, useState } from "react";
import { AlertTriangle, ArrowRight, Building, CalendarClock, CheckCircle2, Construction, Flame, HardHat, Info, Sun } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Prüffristen-Finder nach § 9 ESV 2012: Betriebsart wählen, Jahr der letzten
 * Prüfung eingeben → Höchstfrist, spätestes Jahr der nächsten Prüfung und
 * Hinweis auf die FI-Funktionskontrolle (§ 7). Vereinfachte Orientierung,
 * keine Rechtsberatung – kürzere Fristen aus Bescheid, Versicherung oder
 * Herstellervorgaben gehen vor.
 */

const ARTEN = [
  { key: "regel", icon: HardHat, label: "Regelfall", text: "alle Anlagen ohne besondere Einstufung", frist: 5, fristText: "längstens 5 Jahre", grundlage: "§ 9 Abs. 2 ESV 2012" },
  { key: "gering", icon: Building, label: "Geringe Beanspruchung", text: "z. B. Büros, Handel und Dienstleistung ohne besondere Einflüsse", frist: 10, fristText: "bis zu 10 Jahre", grundlage: "§ 9 ESV 2012" },
  { key: "ex", icon: Flame, label: "Explosionsgefährdeter Bereich", text: "Ex-Bereiche", frist: 3, fristText: "3 Jahre", grundlage: "§ 9 ESV 2012", zusatz: { label: "zusätzlich besondere Beanspruchung", frist: 1, fristText: "1 Jahr" } },
  { key: "bau", icon: Construction, label: "Baustelle", text: "elektrische Anlagen auf Baustellen", frist: 1, fristText: "1 Jahr", grundlage: "§ 9 ESV 2012" },
  {
    key: "besonders",
    icon: Sun,
    label: "Besondere Beanspruchung",
    text: "Nässe, Temperaturen unter −20 °C oder über 40 °C, Korrosion, Witterung, Staub",
    frist: null,
    fristText: "Behörde kann kürzere Fristen vorschreiben",
    grundlage: "§ 9 ESV 2012",
    zusatz: { label: "mehrere Einflüsse gleichzeitig", frist: 1, fristText: "jährlich" },
  },
];

const JAHR = 2026;

export default function PruefFristenFinder() {
  const id = useId();
  const [art, setArt] = useState("regel");
  const [zusatz, setZusatz] = useState(false);
  const [letzte, setLetzte] = useState(2022);

  const a = ARTEN.find((x) => x.key === art);
  const mitZusatz = zusatz && a.zusatz;
  const frist = mitZusatz ? a.zusatz.frist : a.frist;
  const fristText = mitZusatz ? a.zusatz.fristText : a.fristText;
  const naechste = frist ? letzte + frist : null;
  const status = naechste == null ? "offen" : naechste < JAHR ? "ueberfaellig" : naechste === JAHR ? "faellig" : "ok";

  // Zeitleiste: letzte Prüfung … nächste Prüfung, Markierung „heute“
  const ende = naechste ?? letzte + 5;
  const spanne = Math.max(ende, JAHR) - letzte || 1;
  const posHeute = Math.min(100, Math.max(0, ((JAHR - letzte) / spanne) * 100));
  const posNaechste = Math.min(100, ((ende - letzte) / spanne) * 100);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* Eingabe */}
        <div className="p-6 md:p-9">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Interaktiv · Prüffristen-Finder</p>
          <h3 className="ov-h3 mt-2 text-ink-900">Wann ist Ihre nächste Prüfung fällig?</h3>

          <fieldset className="mt-6">
            <legend className="text-[14px] font-medium text-ink-700">Betriebsart bzw. Beanspruchung</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {ARTEN.map((x) => {
                const an = x.key === art;
                return (
                  <label
                    key={x.key}
                    className={cn(
                      "relative flex cursor-pointer gap-3 rounded-2xl p-3.5 ring-1 transition-all duration-300 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ov-500/30",
                      an ? "bg-navy-950 text-white ring-navy-950 shadow-lg" : "bg-white text-ink-800 ring-ink-200 hover:ring-ov-300",
                      x.key === "besonders" && "sm:col-span-2"
                    )}
                  >
                    <input
                      type="radio"
                      name={`${id}-art`}
                      value={x.key}
                      checked={an}
                      onChange={() => {
                        setArt(x.key);
                        setZusatz(false);
                      }}
                      className="sr-only"
                    />
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", an ? "bg-ov-500 text-white" : "bg-ov-50 text-ov-600")}>
                      <x.icon aria-hidden="true" className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[14.5px] font-bold leading-snug">{x.label}</span>
                      <span className={cn("block text-[12.5px] leading-snug", an ? "text-white/60" : "text-ink-500")}>{x.text}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {a.zusatz && (
            <label className="ov-tab-panel mt-3 flex cursor-pointer items-center gap-3 rounded-2xl bg-sand-50 p-3.5 ring-1 ring-ink-200/70">
              <input type="checkbox" checked={zusatz} onChange={(e) => setZusatz(e.target.checked)} className="h-5 w-5 shrink-0 accent-ov-600" />
              <span className="text-[14.5px] text-ink-700">
                <strong className="text-ink-900">{a.zusatz.label[0].toUpperCase() + a.zusatz.label.slice(1)}</strong> – dann {a.zusatz.fristText}
              </span>
            </label>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <label htmlFor={`${id}-jahr`} className="text-[14px] font-medium text-ink-700">
              Letzte wiederkehrende Prüfung (Jahr)
            </label>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Ein Jahr früher" onClick={() => setLetzte((j) => Math.max(2000, j - 1))} className="h-11 w-11 rounded-full bg-ink-100 font-display text-[18px] font-bold text-ink-700 hover:bg-ink-200">
                −
              </button>
              <input
                id={`${id}-jahr`}
                type="number"
                min={2000}
                max={JAHR}
                value={letzte}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (n >= 1990 && n <= JAHR) setLetzte(n);
                }}
                className="ov-num h-11 w-24 rounded-xl border border-ink-200 text-center font-display text-[18px] font-extrabold text-ink-900 focus:border-ov-500 focus:outline-none focus:ring-4 focus:ring-ov-500/20"
              />
              <button type="button" aria-label="Ein Jahr später" onClick={() => setLetzte((j) => Math.min(JAHR, j + 1))} className="h-11 w-11 rounded-full bg-ink-100 font-display text-[18px] font-bold text-ink-700 hover:bg-ink-200">
                +
              </button>
            </div>
          </div>
        </div>

        {/* Ergebnis */}
        <div aria-live="polite" className="relative overflow-hidden bg-navy-950 p-6 text-white md:p-9">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ov-500/30 blur-[90px]" />
          <div key={`${art}-${zusatz}`} className="ov-tab-panel relative">
            <p className="flex items-center gap-2 text-[13px] text-white/55">
              <CalendarClock aria-hidden="true" className="h-4 w-4 text-ov-300" />
              Höchstfrist für die wiederkehrende Prüfung
            </p>
            <p className="mt-2 font-display text-[34px] font-extrabold leading-tight tracking-tight md:text-[40px]">{fristText}</p>
            <p className="mt-1 text-[13.5px] text-white/55">Grundlage: {a.grundlage}</p>

            {naechste ? (
              <>
                <div className="mt-8">
                  <div className="relative h-2 rounded-full bg-white/10">
                    <div
                      className={cn("absolute inset-y-0 left-0 rounded-full transition-[width] duration-700", status === "ueberfaellig" ? "bg-red-400" : status === "faellig" ? "bg-sun-400" : "bg-ov-400")}
                      style={{ width: `${posHeute}%` }}
                    />
                    <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-navy-950 bg-white" style={{ left: `${posNaechste}%` }} aria-hidden="true" />
                  </div>
                  <div className="mt-3 flex justify-between text-[12px] text-white/50">
                    <span>letzte Prüfung {letzte}</span>
                    <span>heute {JAHR}</span>
                  </div>
                </div>
                <div
                  className={cn(
                    "mt-6 flex items-start gap-3 rounded-2xl p-4 ring-1",
                    status === "ueberfaellig" ? "bg-red-500/10 ring-red-400/30" : status === "faellig" ? "bg-sun-400/10 ring-sun-400/30" : "bg-ov-500/10 ring-ov-400/30"
                  )}
                >
                  {status === "ok" ? <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-300" /> : <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sun-300" />}
                  <p className="text-[15px] leading-snug text-white/85">
                    Nächste Prüfung {frist === 10 ? "bei geringer Beanspruchung " : ""}spätestens <strong className="text-white">{naechste}</strong>
                    {status === "ueberfaellig" && <> – die Frist ist bereits abgelaufen.</>}
                    {status === "faellig" && <> – also in diesem Jahr.</>}
                    {status === "ok" && <>.</>}
                  </p>
                </div>
              </>
            ) : (
              <p className="mt-8 rounded-2xl bg-sun-400/10 p-4 text-[15px] leading-snug text-white/85 ring-1 ring-sun-400/30">
                Die Behörde kann bei besonderer Beanspruchung kürzere Fristen vorschreiben – wirken mehrere Einflüsse zusammen, ist jährlich zu prüfen. Wir klären das Intervall mit Ihnen.
              </p>
            )}

            <ul className="mt-7 space-y-3 border-t border-white/10 pt-6 text-[13.5px] leading-relaxed text-white/65">
              <li className="flex gap-2.5">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
                <span>
                  <strong className="text-white/90">Unabhängig davon:</strong> Funktionskontrolle der Fehlerstrom-Schutzschalter per Prüftaste nach Herstellerintervall, sonst mindestens alle
                  6 Monate (§ 7 ESV 2012).
                </span>
              </li>
              <li className="flex gap-2.5">
                <Sun aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
                <span>
                  <strong className="text-white/90">PV-Anlagen:</strong> Der Generator liegt dauerhaft im Freien – wir empfehlen, das Intervall mit Versicherer und Wartungsvertrag abzustimmen und
                  dazwischen jährlich eine Sichtprüfung mit Monitoring-Auswertung.
                </span>
              </li>
            </ul>
            <a href="#anfrage" className="mt-7 inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold text-ov-300 hover:text-ov-200">
              Prüfung beauftragen
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <p className="border-t border-ink-100 px-6 py-3.5 text-[12.5px] leading-relaxed text-ink-500 md:px-9">
        Quelle: Elektroschutzverordnung 2012, BGBl. II Nr. 33/2012 in der geltenden Fassung (RIS). Vereinfachte Orientierung, keine Rechtsberatung – kürzere Fristen aus Bescheid, Versicherung oder
        Herstellervorgaben gehen vor.
      </p>
    </div>
  );
}
