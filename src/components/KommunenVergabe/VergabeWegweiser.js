"use client";

import { useId, useMemo, useState } from "react";
import { Check, CircleAlert, Minus, Scale } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { zahlText } from "@/data/kennzahlen";
import { ARTEN, AUFTRAGGEBER, DREI_ANGEBOTE_AB, betragLesen, euro, vergabeWege } from "@/lib/kommunen/vergabe";

/**
 * Interaktiver Vergabe-Wegweiser: Auftraggeber, Auftragsart und geschätzten
 * Auftragswert wählen → zulässige Verfahren und Pflichten nach BVergG 2018 idF 2026.
 * Startzustand fest (hydrationssicher), keine Übertragung von Eingaben.
 */

const MIN = 10_000;
const MAX = 10_000_000;
const LOG_MIN = Math.log10(MIN);
const LOG_MAX = Math.log10(MAX);
const SCHRITTE = 400;

const zuRegler = (w) => Math.round(((Math.log10(Math.min(Math.max(w, MIN), MAX)) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * SCHRITTE);
const vonRegler = (r) => {
  const roh = 10 ** (LOG_MIN + (r / SCHRITTE) * (LOG_MAX - LOG_MIN));
  const stufe = roh < 100_000 ? 1_000 : roh < 1_000_000 ? 5_000 : 50_000;
  return Math.round(roh / stufe) * stufe;
};
const prozent = (w) => (zuRegler(w) / SCHRITTE) * 100;

const BEISPIELE = [
  { wert: 45_000, label: "45.000 €" },
  { wert: 120_000, label: "120.000 €" },
  { wert: 450_000, label: "450.000 €" },
  { wert: 2_500_000, label: "2,5 Mio. €" },
];

function Umschalter({ legende, optionen, wert, setWert, name }) {
  return (
    <fieldset>
      <legend className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-500">{legende}</legend>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
        {optionen.map((o) => {
          const an = o.id === wert;
          return (
            <label
              key={o.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-[14.5px] font-semibold ring-1 transition focus-within:ring-2 focus-within:ring-ov-500",
                an ? "bg-ov-50 text-ink-900 ring-ov-400" : "bg-white text-ink-700 ring-ink-200 hover:ring-ink-300"
              )}
            >
              <input type="radio" name={name} value={o.id} checked={an} onChange={() => setWert(o.id)} className="sr-only" />
              <span aria-hidden="true" className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-2", an ? "bg-ov-600 ring-ov-600" : "bg-white ring-ink-300")}>
                {an && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
              <span className="leading-snug">{o.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function VergabeWegweiser({ className }) {
  const id = useId();
  const [auftraggeber, setAuftraggeber] = useState("klassisch");
  const [art, setArt] = useState("bau");
  const [eingabe, setEingabe] = useState(zahlText(180_000));

  const wert = betragLesen(eingabe);
  const ergebnis = useMemo(() => (wert == null ? null : vergabeWege({ auftraggeber, art, wert })), [auftraggeber, art, wert]);
  const s = ergebnis?.schwellen;

  const marken = s
    ? [
        { wert: DREI_ANGEBOTE_AB, label: "3 Angebote" },
        { wert: s.direkt, label: "Direktvergabe" },
        ...(s.direktBekanntmachung !== s.direkt ? [{ wert: s.direktBekanntmachung, label: "mit Bekanntmachung" }] : []),
        { wert: s.eu, label: "EU-weit" },
      ]
    : [];

  return (
    <div className={cn("overflow-hidden rounded-[2rem] bg-white shadow-[0_50px_100px_-60px_rgba(3,18,43,0.6)] ring-1 ring-ink-200/70", className)}>
      <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Eingaben */}
        <form className="space-y-7 p-5 sm:p-8" onSubmit={(e) => e.preventDefault()} aria-label="Angaben zum Auftrag">
          <Umschalter legende="Wer vergibt?" name={`${id}-ag`} optionen={AUFTRAGGEBER} wert={auftraggeber} setWert={setAuftraggeber} />
          <Umschalter legende="Was wird vergeben?" name={`${id}-art`} optionen={ARTEN} wert={art} setWert={setArt} />

          <div>
            <label htmlFor={`${id}-wert`} className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-500">
              Geschätzter Auftragswert (netto)
            </label>
            <div className="mt-2.5 flex items-center rounded-2xl bg-white ring-1 ring-ink-200 focus-within:ring-2 focus-within:ring-ov-500">
              <input
                id={`${id}-wert`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={eingabe}
                onChange={(e) => setEingabe(e.target.value)}
                onBlur={() => wert != null && setEingabe(zahlText(wert))}
                aria-describedby={`${id}-wert-hilfe`}
                aria-invalid={wert == null}
                className="ov-num min-w-0 flex-1 rounded-2xl bg-transparent px-4 py-3.5 font-display text-[22px] font-bold text-ink-900 outline-none"
              />
              <span aria-hidden="true" className="pr-4 text-[18px] font-semibold text-ink-500">€</span>
            </div>
            <p id={`${id}-wert-hilfe`} className={cn("mt-2 text-[13px]", wert == null ? "text-red-700" : "text-ink-500")}>
              {wert == null ? "Bitte einen Betrag eingeben, z. B. 180.000 oder 1,2 Mio." : "Gesamtwert aller zum Vorhaben gehörigen Leistungen inkl. Optionen, ohne Umsatzsteuer."}
            </p>

            <label htmlFor={`${id}-regler`} className="sr-only">
              Auftragswert mit Schieberegler wählen
            </label>
            <input
              id={`${id}-regler`}
              type="range"
              min={0}
              max={SCHRITTE}
              step={1}
              value={zuRegler(wert ?? MIN)}
              onChange={(e) => setEingabe(zahlText(vonRegler(Number(e.target.value))))}
              aria-valuetext={wert != null ? euro(wert) : "keine Angabe"}
              className="mt-5 w-full accent-ov-600"
            />
            <div className="mt-1 flex justify-between text-[12px] text-ink-500">
              <span className="ov-num">10.000 €</span>
              <span className="ov-num">10 Mio. €</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Beispielwerte">
              {BEISPIELE.map((b) => (
                <button
                  key={b.wert}
                  type="button"
                  onClick={() => setEingabe(zahlText(b.wert))}
                  aria-pressed={wert === b.wert}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[13px] font-semibold ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500",
                    wert === b.wert ? "bg-navy-950 text-white ring-navy-950" : "bg-sand-50 text-ink-700 ring-ink-200 hover:ring-ink-300"
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Ergebnis */}
        <div className="ov-noise relative isolate overflow-hidden bg-navy-950 p-5 text-white sm:p-8" aria-live="polite">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[320px] w-[320px] rounded-full bg-ov-500/25 blur-[110px]" />
          <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">
            <Scale aria-hidden="true" className="h-4 w-4" />
            Ergebnis · Orientierung
          </p>
          {ergebnis ? (
            <>
              <p className="mt-3 font-display text-[22px] font-extrabold leading-snug md:text-[26px]">{ergebnis.kurz}</p>

              {/* Schwellen-Leiste */}
              <div className="mt-7" aria-hidden="true">
                <div className="relative h-2 rounded-full bg-white/10">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ov-400 to-ov-600 transition-[width] duration-300" style={{ width: `${prozent(wert)}%` }} />
                  {marken.map((m) => (
                    <span key={m.label} className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-white/70" style={{ left: `${prozent(m.wert)}%` }} />
                  ))}
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px] text-white/65 sm:grid-cols-4">
                  {marken.map((m) => (
                    <li key={m.label} className="leading-snug">
                      <span className="ov-num block font-semibold text-white">{euro(m.wert)}</span>
                      {m.label}
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="mt-7 space-y-2.5">
                {ergebnis.wege.map((w) => (
                  <li key={w.id} className={cn("flex gap-3 rounded-2xl p-3.5 ring-1", w.zulaessig ? "bg-white/[0.07] ring-white/15" : "ring-white/5")}>
                    <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full", w.zulaessig ? "bg-ov-500 text-white" : "bg-white/10 text-white/50")}>
                      {w.zulaessig ? <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} /> : <Minus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0">
                      <span className={cn("block text-[15px] font-semibold leading-snug", w.zulaessig ? "text-white" : "text-white/55")}>
                        {w.name}
                        <span className="sr-only">{w.zulaessig ? ": zulässig" : ": nicht zulässig"}</span>
                      </span>
                      <span className={cn("mt-0.5 block text-[13.5px] leading-relaxed", w.zulaessig ? "text-white/70" : "text-white/45")}>
                        {w.grenze != null && <span className="ov-num">bis unter {euro(w.grenze)} · </span>}
                        {w.text} <span className="whitespace-nowrap">({w.norm})</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ov-300">Pflichten</p>
                <ul className="mt-2 space-y-2 text-[14px] leading-relaxed text-white/75">
                  {ergebnis.pflichten.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ov-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="mt-4 text-[15px] text-white/70">Geben Sie einen geschätzten Auftragswert ein, um die möglichen Verfahren zu sehen.</p>
          )}
          <p className="mt-6 flex gap-2 text-[12.5px] leading-relaxed text-white/55">
            <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" />
            Keine Rechtsberatung. Ob eine PV-Anlage Bau- oder Lieferauftrag ist, richtet sich nach dem Hauptgegenstand der Leistung. Sektorenwerte gelten nur für
            Aufträge im Rahmen der Sektorentätigkeit. Die Wahl des Verfahrens verantwortet der Auftraggeber.
          </p>
        </div>
      </div>
    </div>
  );
}
