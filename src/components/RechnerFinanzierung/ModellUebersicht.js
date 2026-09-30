import { MODELLE } from "@/lib/rechner/finanzierung";

/* ------------------------------------------------------------------
   Qualitativer Überblick der fünf Modelle (Server-Komponente, im DOM für SEO).
   Neutral: beschreibt übliche Vertragsstrukturen am Markt – Details regelt
   immer der einzelne Vertrag. Formulierungen abgestimmt mit der Vergleichs-
   tabelle unter /service/finanzierung.
   ------------------------------------------------------------------ */

const ZEILEN = [
  {
    k: "Wem gehört die Anlage?",
    w: ["Ihnen, ab Inbetriebnahme", "Ihnen, ggf. mit Sicherungsübereignung an die Bank", "Dem Leasinggeber; am Ende meist Kauf- oder Verlängerungsoption", "Dem Contractor; Übernahme nach Laufzeit oft vereinbar", "Dem Investor bzw. Betreiber"],
  },
  { k: "Kapital zu Beginn", w: ["Volle Investition", "Eigenanteil", "Keines oder eine Anzahlung", "Keines", "Keines"] },
  { k: "Laufende Zahlung", w: ["–", "Kreditrate (Zins + Tilgung)", "Fixe Leasingrate", "Preis je genutzter kWh, oft indexiert", "Preis je kWh, oft fest über die Laufzeit"] },
  { k: "Betrieb, Wartung, Versicherung", w: ["Sie", "Sie", "Meist Sie – vertragsabhängig", "Contractor", "Investor bzw. Betreiber"] },
  {
    k: "EAG-Zuschuss & IFB",
    w: ["Sie (IFB 22 % bis Ende 2026)", "Sie (IFB 22 % bis Ende 2026)", "Beim wirtschaftlichen Eigentümer, meist dem Leasinggeber", "Beim Contractor", "Beim Investor"],
  },
  {
    k: "Wer trägt das Ertragsrisiko?",
    w: ["Sie", "Sie", "Sie – die Rate ist fix", "Contractor – Sie zahlen nur gelieferten Strom", "Investor; bei Take-or-pay tragen Sie den Wert des Überschusses"],
  },
  {
    k: "Bilanz",
    w: ["Anlagevermögen", "Anlagevermögen und Verbindlichkeit", "Nach UGB in der Regel beim Leasinggeber; nach IFRS 16 Nutzungsrecht bei Ihnen", "Meist nicht in Ihrer Bilanz – Sie kaufen Strom", "Meist nicht in Ihrer Bilanz – Sie kaufen Strom"],
  },
  {
    k: "Passt, wenn …",
    w: [
      "Liquidität vorhanden ist und die Rendite zählt",
      "Sie Eigentum wollen, aber Liquidität schonen",
      "der Kreditrahmen frei bleiben soll",
      "Sie weder investieren noch betreiben wollen",
      "ein planbarer Strompreis im Vordergrund steht",
    ],
  },
];

export default function ModellUebersicht() {
  return (
    <div className="mt-10 rounded-[2rem] bg-white p-5 ring-1 ring-ink-200/70 sm:p-6 md:mt-14 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Modelle am Markt</p>
          <h2 className="mt-1 font-display text-[22px] font-bold tracking-tight text-ink-900 md:text-[26px]">Die fünf Modelle im Überblick</h2>
        </div>
        <p className="max-w-md text-[13.5px] leading-relaxed text-ink-500">Übliche Strukturen – was genau gilt, regelt Ihr Vertrag. Steuer und Bilanz mit Ihrer Steuerberatung klären.</p>
      </div>
      <div tabIndex={0} role="region" aria-label="Vergleichstabelle der Finanzierungsmodelle" className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-ink-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500">
        <table className="w-full min-w-[860px] text-left text-[13.5px] leading-snug">
          <caption className="sr-only">Kauf mit Eigenkapital, Kauf mit Kredit, Leasing, Contracting und Dach-PPA im Vergleich</caption>
          <thead className="bg-sand-50">
            <tr>
              <th scope="col" className="sticky left-0 z-[1] w-[170px] bg-sand-50 px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-600">
                Kriterium
              </th>
              {MODELLE.map((m) => (
                <th key={m.id} scope="col" className="px-4 py-3 font-display text-[14.5px] font-bold text-ink-900">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.farbe }} />
                    {m.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {ZEILEN.map((z) => (
              <tr key={z.k} className="bg-white align-top">
                <th scope="row" className="sticky left-0 z-[1] bg-white px-4 py-3 font-semibold text-ink-800">
                  {z.k}
                </th>
                {z.w.map((w, i) => (
                  <td key={MODELLE[i].id} className="px-4 py-3 text-ink-600">
                    {w}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
