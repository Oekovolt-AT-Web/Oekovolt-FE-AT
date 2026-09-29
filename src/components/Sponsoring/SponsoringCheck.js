"use client";

// src/components/Sponsoring/SponsoringCheck.js
//
// „Passt Ihr Vorhaben?“ – Selbstcheck anhand der Sponsoring-Kriterien.
// Rein informativ: Das Ergebnis ist keine Zusage (kein Anspruch auf
// Unterstützung, siehe FAQ). kriterien: [{ titel, text, pflicht }]

import { useState } from "react";
import { ArrowRight, Check, Info, Minus } from "lucide-react";

export default function SponsoringCheck({ kriterien = [], ausschluss = [] }) {
  const [antworten, setAntworten] = useState({});
  const [ausgeschlossen, setAusgeschlossen] = useState(false);

  const setze = (i, wert) => setAntworten((a) => ({ ...a, [i]: a[i] === wert ? undefined : wert }));
  const beantwortet = kriterien.filter((_, i) => antworten[i] !== undefined).length;
  const ja = kriterien.filter((_, i) => antworten[i] === true).length;
  const pflichtNein = kriterien.some((k, i) => k.pflicht && antworten[i] === false);
  const fertig = beantwortet === kriterien.length;

  let ergebnis = { ton: "neutral", titel: "Beantworten Sie die Fragen", text: `Noch ${kriterien.length - beantwortet} von ${kriterien.length} offen.` };
  if (ausgeschlossen) ergebnis = { ton: "rot", titel: "Leider nicht förderfähig", text: "Vorhaben aus den ausgeschlossenen Bereichen können wir nicht unterstützen." };
  else if (pflichtNein) ergebnis = { ton: "gelb", titel: "Eher schwierig", text: "Bezug zu Österreich und ein nachvollziehbarer, nicht gewinnorientierter Zweck sind Grundvoraussetzungen. Schreiben Sie uns trotzdem, wenn Sie unsicher sind." };
  else if (fertig && ja >= kriterien.length - 1) ergebnis = { ton: "gruen", titel: "Gute Voraussetzungen", text: "Ihr Vorhaben passt gut zu unseren Kriterien. Senden Sie uns Ihre Anfrage – wir prüfen sie im Rahmen unseres Budgets." };
  else if (fertig) ergebnis = { ton: "gelb", titel: "Grundsätzlich möglich", text: "Einige Punkte sind offen. Beschreiben Sie Ihr Vorhaben möglichst konkret – dann können wir es fair beurteilen." };

  const ton = {
    neutral: "bg-white/10 text-white",
    gruen: "bg-ov-500 text-white",
    gelb: "bg-sun-400 text-navy-950",
    rot: "bg-red-500 text-white",
  }[ergebnis.ton];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8">
      <ol className="space-y-2.5 sm:space-y-3">
        {kriterien.map((k, i) => {
          const a = antworten[i];
          return (
            <li key={k.titel} className={`rounded-3xl bg-white p-4 ring-1 transition-all sm:p-5 md:p-6 ${a === true ? "ring-ov-300" : a === false ? "ring-sun-300" : "ring-ink-200/70"}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                    <span className="ov-num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand-100 text-[13px] text-ink-600">{i + 1}</span>
                    {k.titel}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600 sm:mt-2 sm:text-[14.5px]">{k.text}</p>
                </div>
                <div className="flex shrink-0 gap-2" role="group" aria-label={`Trifft zu: ${k.titel}`}>
                  <button
                    type="button"
                    aria-pressed={a === true}
                    onClick={() => setze(i, true)}
                    className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition ${a === true ? "bg-ov-600 text-white" : "bg-sand-50 text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300"}`}
                  >
                    <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} /> Ja
                  </button>
                  <button
                    type="button"
                    aria-pressed={a === false}
                    onClick={() => setze(i, false)}
                    className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition ${a === false ? "bg-navy-950 text-white" : "bg-sand-50 text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ink-300"}`}
                  >
                    <Minus aria-hidden="true" className="h-4 w-4" strokeWidth={3} /> Nein
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="ov-noise relative overflow-hidden rounded-[2rem] bg-navy-950 p-7 text-white md:p-8">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-ov-500/30 blur-[80px]" />
          <p className="relative text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Ihr Ergebnis</p>
          <div className="relative mt-4 flex items-center gap-3" aria-live="polite">
            <span className={`inline-flex h-9 items-center rounded-full px-4 text-[14px] font-bold ${ton}`}>{ergebnis.titel}</span>
          </div>
          <p className="relative mt-4 text-[15px] leading-relaxed text-white/75">{ergebnis.text}</p>
          <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <div className="h-full rounded-full bg-ov-400 transition-[width] duration-500" style={{ width: `${(beantwortet / Math.max(1, kriterien.length)) * 100}%` }} />
          </div>

          {ausschluss.length > 0 && (
            <label className="relative mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
              <input type="checkbox" checked={ausgeschlossen} onChange={(e) => setAusgeschlossen(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-red-500" />
              <span className="text-[13.5px] leading-snug text-white/75">
                <strong className="block text-white">Fällt Ihr Vorhaben unter einen Ausschluss?</strong>
                {ausschluss.join(" · ")}
              </span>
            </label>
          )}

          <a
            href="#anfrage"
            className="group relative mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition hover:bg-ov-700"
          >
            Sponsoring anfragen
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="relative mt-3 flex items-start gap-2 text-[12.5px] leading-snug text-white/45">
            <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Orientierung, keine Zusage: Wir entscheiden im Rahmen unseres Budgets.
          </p>
        </div>
      </div>
    </div>
  );
}
