// src/components/RechnerFinanzierung/StresstestFinanzierung.js
//
// CFO-Stresstest im Finanzierungsvergleich (Integration Welle A, Übergabe A10): konservativ / erwartet / günstig
// je Modell – Ergebnis nach JAHRE Jahren und Amortisation – plus Break-even-Strompreis je Modell.
// Rechnung: stresstestFinanzierung() in src/lib/rechner/finanzierung.js (gleiche Annahmen wie im Gewerbe-PV-Rechner).

import { cn } from "@/components/ui/cn";
import { amortText, euroKurz } from "@/lib/rechner/finanzierung";

export default function StresstestFinanzierung({ st, className }) {
  if (!st?.laeufe?.length) return null;
  const modelle = st.laeufe[0].modelle;
  return (
    <section aria-labelledby="stresstest-fin-titel" className={cn("rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 md:p-6", className)}>
      <h3 id="stresstest-fin-titel" className="font-display text-[17px] font-bold text-ink-900">
        Stresstest: Was, wenn es schlechter läuft?
      </h3>
      <ul className="mt-2 space-y-0.5 text-[13px] leading-relaxed text-ink-500">
        {st.laeufe.map((l) => (
          <li key={l.id}>
            <span className="font-semibold text-ink-700">{l.label}:</span> {l.annahme}
          </li>
        ))}
      </ul>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-ink-200/70">
        <table className="w-full min-w-[30rem] text-left text-[13.5px]">
          <caption className="sr-only">Ergebnis nach {st.jahre} Jahren und Amortisation je Finanzierungsmodell und Fall</caption>
          <thead>
            <tr className="border-b border-ink-200/70 text-[12px] text-ink-500">
              <th scope="col" className="px-3 py-2.5 font-semibold sm:px-4">Modell</th>
              {st.laeufe.map((l) => (
                <th key={l.id} scope="col" className="px-3 py-2.5 font-semibold sm:px-4">
                  {l.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modelle.map((m, i) => (
              <tr key={m.id} className="border-b border-ink-100 last:border-0">
                <th scope="row" className="px-3 py-2.5 font-semibold text-ink-800 sm:px-4">
                  {m.name}
                </th>
                {st.laeufe.map((l) => {
                  const x = l.modelle[i];
                  return (
                    <td key={l.id} className="ov-num px-3 py-2.5 sm:px-4">
                      <span className={cn("block font-bold", x.summe >= 0 ? "text-ov-700" : "text-ink-900")}>{euroKurz(x.summe)}</span>
                      <span className="block text-[12px] text-ink-500">Amortisation {amortText(x.amortisation, st.jahre)}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-4 space-y-1 text-[13.5px] leading-relaxed text-ink-700">
        {st.breakEven.map((b) => (
          <li key={b.id}>
            <span className="font-semibold text-ink-900">{b.name}:</span> {b.text}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">Ergebnis = Summe der Zahlungsströme nach {st.jahre} Jahren (ohne Abzinsung). Beispielwerte, kein Angebot.</p>
    </section>
  );
}
