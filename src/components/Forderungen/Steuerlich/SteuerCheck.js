"use client";

import { useId, useMemo, useState } from "react";
import { Building, Building2, CircleCheck, CircleAlert, Home, Store } from "lucide-react";

/**
 * Steuer-Check für Photovoltaikanlagen (Orientierung, keine Steuerberatung).
 *
 * Regeln (Stand 2026):
 *  - § 12 Abs. 3 UStG: 0 % für Lieferung + Installation auf/bei Wohngebäuden,
 *    öffentlichen und gemeinwohlorientierten Gebäuden. Bis 30 kWp (MaStR)
 *    gilt die Gebäudevoraussetzung laut BMF-Schreiben vom 27.02.2023 als erfüllt.
 *  - § 3 Nr. 72 EStG (JStG 2024): Anlagen ab 2025 bis 30 kWp je Wohn- oder
 *    Gewerbeeinheit, zusammen höchstens 100 kWp je Steuerpflichtigem.
 *    Anlagen 2022–2024: 30 kWp bei Einfamilienhäusern und Gewerbeimmobilien,
 *    15 kWp je Einheit bei übrigen Gebäuden. Freigrenze – wird sie
 *    überschritten, ist die ganze Anlage steuerpflichtig.
 *  - § 3 Nr. 32 GewStG: Gewerbesteuerfreiheit folgt der Einkommensteuer.
 */

const GEBAEUDE = [
  { id: "efh", label: "Ein-/Zweifamilienhaus", icon: Home, wohnen: true },
  { id: "mfh", label: "Mehrfamilienhaus", icon: Building2, wohnen: true },
  { id: "gemischt", label: "Wohn- & Geschäftshaus", icon: Building, wohnen: true },
  { id: "gewerbe", label: "Gewerbe / Halle", icon: Store, wohnen: false },
];

const euro = (n) => n.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + " €";
const zahl = (n) => n.toLocaleString("de-DE", { maximumFractionDigits: 1 });

function Regler({ label, wert, min, max, step = 1, einheit, onChange, hilfe }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14.5px] font-semibold text-ink-800">{label}</label>
        <output htmlFor={id} className="ov-num font-display text-[18px] font-extrabold text-ink-900">
          {einheit === "€" ? euro(wert) : `${zahl(wert)} ${einheit}`}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={wert}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ov-range mt-3 w-full"
        style={{ "--ov-fill": `${((wert - min) / (max - min)) * 100}%` }}
      />
      {hilfe && <p className="mt-1.5 text-[12.5px] text-ink-500">{hilfe}</p>}
    </div>
  );
}

export default function SteuerCheck() {
  const [gebaeude, setGebaeude] = useState("efh");
  const [kwp, setKwp] = useState(10);
  const [einheiten, setEinheiten] = useState(6);
  const [weitere, setWeitere] = useState(0);
  const [kosten, setKosten] = useState(16000);
  const [ab2025, setAb2025] = useState(true);

  const g = GEBAEUDE.find((x) => x.id === gebaeude);
  const mehrereEinheiten = gebaeude === "mfh" || gebaeude === "gemischt";
  const anzahl = mehrereEinheiten ? einheiten : 1;

  const ergebnis = useMemo(() => {
    // Umsatzsteuer
    const ustNull = g.wohnen || kwp <= 30;
    const ustGrund = g.wohnen
      ? kwp <= 30
        ? "Wohngebäude und höchstens 30 kWp – die Voraussetzungen gelten ohne weiteren Nachweis als erfüllt."
        : "Die Anlage steht auf einem Wohngebäude. Über 30 kWp muss der Gebäudebezug im Zweifel belegt werden."
      : kwp <= 30
        ? "Bis 30 kWp gilt die Gebäudevoraussetzung nach BMF-Schreiben als erfüllt – auch auf dem Firmendach."
        : "Über 30 kWp auf einem reinen Gewerbegebäude gelten 19 %. Als Unternehmer holen Sie sich die Vorsteuer in der Regel zurück.";

    // Einkommensteuer
    const jeEinheit = ab2025 ? 30 : gebaeude === "efh" || gebaeude === "gewerbe" ? 30 : 15;
    const grenzeGebaeude = ab2025 || mehrereEinheiten ? jeEinheit * anzahl : 30;
    const gesamt = kwp + weitere;
    const gebaeudeOk = kwp <= grenzeGebaeude;
    const gesamtOk = gesamt <= 100;
    const estFrei = gebaeudeOk && gesamtOk;
    const estGrund = estFrei
      ? `${zahl(kwp)} kWp liegen unter der Grenze von ${zahl(grenzeGebaeude)} kWp für dieses Gebäude${weitere > 0 ? ` und Ihre Anlagen zusammen unter 100 kWp` : ""}. Keine Gewinnermittlung, keine Anlage EÜR.`
      : !gebaeudeOk
        ? `Die Grenze für dieses Gebäude liegt bei ${zahl(grenzeGebaeude)} kWp. Weil es eine Freigrenze ist, sind dann alle Erträge der Anlage steuerpflichtig – mit Gewinnermittlung und Abschreibung.`
        : `Zusammen betreiben Sie ${zahl(gesamt)} kWp – mehr als die 100 kWp je Person. Damit entfällt die Befreiung für alle Anlagen.`;

    return {
      ustNull,
      ustGrund,
      ersparnis: ustNull ? Math.round(kosten * 0.19) : 0,
      estFrei,
      estGrund,
      grenzeGebaeude,
    };
  }, [g, kwp, weitere, kosten, ab2025, gebaeude, mehrereEinheiten, anzahl]);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-50px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Eingaben */}
        <form className="space-y-8 border-b border-ink-100 p-6 sm:p-8 lg:border-b-0 lg:border-r md:p-10" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend className="text-[14.5px] font-semibold text-ink-800">Auf welchem Gebäude?</legend>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {GEBAEUDE.map((o) => {
                const an = gebaeude === o.id;
                return (
                  <label
                    key={o.id}
                    className={`relative flex min-h-[52px] min-w-0 cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-3 text-[14px] font-semibold leading-snug transition-all focus-within:ring-2 focus-within:ring-ov-500 ${an ? "bg-ov-50 text-ov-800 ring-2 ring-ov-500" : "bg-sand-50 text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300"}`}
                  >
                    <input type="radio" name="gebaeude" value={o.id} checked={an} onChange={() => setGebaeude(o.id)} className="sr-only" />
                    <o.icon aria-hidden="true" className={`h-5 w-5 shrink-0 ${an ? "text-ov-600" : "text-ink-400"}`} />
                    {o.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <Regler label="Leistung der Anlage" wert={kwp} min={1} max={120} step={0.5} einheit="kWp" onChange={setKwp} />
          {mehrereEinheiten && (
            <Regler label="Wohn- und Gewerbeeinheiten im Gebäude" wert={einheiten} min={2} max={20} einheit="Einheiten" onChange={setEinheiten} />
          )}
          <Regler
            label="Weitere eigene PV-Anlagen"
            wert={weitere}
            min={0}
            max={100}
            einheit="kWp"
            onChange={setWeitere}
            hilfe="Leistung aller anderen Anlagen, die Sie (oder Ihre Gesellschaft) betreiben."
          />
          <Regler label="Kosten der Anlage (netto)" wert={kosten} min={2000} max={120000} step={500} einheit="€" onChange={setKosten} />

          <fieldset>
            <legend className="text-[14.5px] font-semibold text-ink-800">Inbetriebnahme</legend>
            <div className="mt-3 inline-flex rounded-full bg-ink-100 p-1">
              {[
                { v: true, l: "ab 2025" },
                { v: false, l: "2022–2024" },
              ].map((o) => (
                <label key={o.l} className={`inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-[14px] font-semibold transition-all focus-within:ring-2 focus-within:ring-ov-500 ${ab2025 === o.v ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}>
                  <input type="radio" name="inbetriebnahme" checked={ab2025 === o.v} onChange={() => setAb2025(o.v)} className="sr-only" />
                  {o.l}
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        {/* Ergebnis */}
        <div className="flex flex-col gap-4 bg-sand-50/60 p-6 sm:p-8 md:p-10" aria-live="polite">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">Ihr Ergebnis</p>

          <Ergebnis
            ok={ergebnis.ustNull}
            titel="Umsatzsteuer beim Kauf"
            wert={ergebnis.ustNull ? "0 %" : "19 %"}
            text={ergebnis.ustGrund}
            extra={ergebnis.ustNull ? `Sie sparen rund ${euro(ergebnis.ersparnis)} gegenüber 19 % Umsatzsteuer.` : null}
            norm="§ 12 Abs. 3 UStG"
          />
          <Ergebnis
            ok={ergebnis.estFrei}
            titel="Einkommensteuer auf Erträge"
            wert={ergebnis.estFrei ? "steuerfrei" : "steuerpflichtig"}
            text={ergebnis.estGrund}
            norm="§ 3 Nr. 72 EStG"
          />
          <Ergebnis
            ok={ergebnis.estFrei}
            titel="Gewerbesteuer"
            wert={ergebnis.estFrei ? "befreit" : "prüfen"}
            text={ergebnis.estFrei ? "Die Befreiung folgt automatisch der Einkommensteuer." : "Ohne Einkommensteuerbefreiung kann Gewerbesteuer anfallen – der Freibetrag von 24.500 € deckt kleinere Anlagen meist ab."}
            norm="§ 3 Nr. 32 GewStG"
          />

          <p className="mt-auto pt-2 text-[12.5px] leading-relaxed text-ink-500">
            Vereinfachte Orientierung nach Rechtsstand 2026, keine Steuerberatung. Sonderfälle (Vermietung der Anlage, Leasing, Mitunternehmerschaften) bitte mit Steuerberatung klären.
          </p>
        </div>
      </div>
    </div>
  );
}

function Ergebnis({ ok, titel, wert, text, extra, norm }) {
  const Icon = ok ? CircleCheck : CircleAlert;
  return (
    <div className={`rounded-3xl bg-white p-5 ring-1 transition-colors ${ok ? "ring-ov-200" : "ring-sun-400/60"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Icon aria-hidden="true" className={`h-5 w-5 shrink-0 ${ok ? "text-ov-600" : "text-sun-500"}`} />
          <p className="font-semibold text-ink-900">{titel}</p>
        </div>
        <p className={`font-display text-[20px] font-extrabold leading-none ${ok ? "text-ov-700" : "text-ink-900"}`}>{wert}</p>
      </div>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-600">{text}</p>
      {extra && <p className="mt-2 text-[14.5px] font-semibold text-ov-700">{extra}</p>}
      <p className="mt-2 text-[12px] font-medium uppercase tracking-wider text-ink-400">{norm}</p>
    </div>
  );
}
