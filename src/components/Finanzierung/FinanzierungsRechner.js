"use client";

import { useMemo, useState } from "react";
import { Info, Landmark, PiggyBank, Receipt, Wallet } from "lucide-react";

/**
 * Finanzierungsrechner Gewerbe (Österreich): Kredit-Annuität gegen jährlichen
 * Vorteil der PV-Anlage, mit optionalem Effekt des Öko-Investitionsfreibetrags.
 *
 * Alle Eingaben stellt der Nutzer ein – Zinssatz und Vorteil sind Beispielwerte,
 * keine Konditionen und kein Angebot. IFB vereinfacht: Bemessungsgrundlage =
 * Investition abzüglich Zuschuss, gedeckelt bei 1 Mio. €, Steuerwirkung mit
 * 23 % Körperschaftsteuer (GmbH).
 */

const KOEST = 0.23;
const IFB_DECKEL = 1_000_000;
const IFB_SAETZE = [
  { wert: 0.22, label: "22 % – Öko-IFB, Anschaffung 11/2025 bis 12/2026 (befristet)" },
  { wert: 0.15, label: "15 % – Öko-IFB, Regelsatz" },
  { wert: 0, label: "Kein IFB (z. B. Leasing, Contracting)" },
];

const eur = (n) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function annuitaet(betrag, zinsProzent, jahre) {
  const i = zinsProzent / 100;
  if (betrag <= 0) return 0;
  if (i === 0) return betrag / jahre;
  return (betrag * i) / (1 - Math.pow(1 + i, -jahre));
}

function Regler({ id, label, wert, anzeige, min, max, step, onChange, hinweis }) {
  const fill = max > min ? ((wert - min) / (max - min)) * 100 : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14px] font-medium text-ink-700">
          {label}
        </label>
        <output htmlFor={id} className="ov-num font-display text-[18px] font-extrabold tracking-tight text-ink-900">
          {anzeige}
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
        className="ov-range my-4 block cursor-pointer"
        style={{ "--ov-fill": `${fill}%` }}
      />
      {hinweis && <p className="text-[12.5px] text-ink-500">{hinweis}</p>}
    </div>
  );
}

export default function FinanzierungsRechner() {
  const [investition, setInvestition] = useState(250000);
  const [foerderung, setFoerderung] = useState(0);
  const [eigenmittel, setEigenmittel] = useState(20);
  const [zins, setZins] = useState(5);
  const [laufzeit, setLaufzeit] = useState(10);
  const [vorteil, setVorteil] = useState(40000);
  const [ifb, setIfb] = useState(0.22);

  const maxFoerderung = Math.round(investition * 0.3);
  const foerderungWirksam = Math.min(foerderung, maxFoerderung);

  const r = useMemo(() => {
    const netto = Math.max(investition - foerderungWirksam, 0);
    const eigen = netto * (eigenmittel / 100);
    const kredit = netto - eigen;
    const rate = annuitaet(kredit, zins, laufzeit);
    const zinsen = rate * laufzeit - kredit;
    const cashflow = vorteil - rate;
    const ifbSteuer = Math.min(netto, IFB_DECKEL) * ifb * KOEST;
    return { kredit, rate, zinsen, cashflow, ifbSteuer };
  }, [investition, foerderungWirksam, eigenmittel, zins, laufzeit, vorteil, ifb]);

  const positiv = r.cashflow >= 0;

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="min-w-0 p-6 md:p-10">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Beispielrechnung · Gewerbe</p>
        <h3 className="ov-h3 mt-2 text-ink-900">Trägt der Kredit sich aus der Anlage?</h3>
        <div className="mt-8 space-y-6">
          <Regler id="fr-inv" label="Investition (netto)" wert={investition} anzeige={eur(investition)} min={20000} max={2000000} step={10000} onChange={setInvestition} />
          <Regler
            id="fr-foe"
            label="Investitionszuschuss (falls zugesagt)"
            wert={foerderungWirksam}
            anzeige={eur(foerderungWirksam)}
            min={0}
            max={maxFoerderung}
            step={1000}
            onChange={setFoerderung}
            hinweis="Einen EAG-Zuschuss nur einplanen, wenn er aus einem Fördercall zugesagt ist."
          />
          <Regler id="fr-eig" label="Eigenmittelanteil" wert={eigenmittel} anzeige={`${eigenmittel} %`} min={0} max={100} step={5} onChange={setEigenmittel} />
          <Regler
            id="fr-zins"
            label="Zinssatz (Ihr Beispielwert)"
            wert={zins}
            anzeige={`${zins.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`}
            min={0}
            max={10}
            step={0.1}
            onChange={setZins}
            hinweis="Kein Angebot – der Zinssatz hängt von Bank, Bonität, Laufzeit und Sicherheiten ab."
          />
          <Regler id="fr-lz" label="Laufzeit" wert={laufzeit} anzeige={`${laufzeit} Jahre`} min={3} max={20} step={1} onChange={setLaufzeit} />
          <Regler
            id="fr-vt"
            label="Jährlicher Vorteil der Anlage"
            wert={vorteil}
            anzeige={eur(vorteil)}
            min={0}
            max={400000}
            step={1000}
            onChange={setVorteil}
            hinweis="Eingesparte Strombezugskosten plus Erlöse aus Überschusseinspeisung – aus Ihrer Wirtschaftlichkeitsrechnung."
          />
          <div>
            <label htmlFor="fr-ifb" className="text-[14px] font-medium text-ink-700">
              Investitionsfreibetrag
            </label>
            <select
              id="fr-ifb"
              value={ifb}
              onChange={(e) => setIfb(Number(e.target.value))}
              className="mt-2 h-12 w-full cursor-pointer rounded-2xl bg-white px-4 text-[15px] text-ink-900 outline-none ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-ov-500"
            >
              {IFB_SAETZE.map((s) => (
                <option key={s.wert} value={s.wert}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col bg-navy-950 p-6 text-white md:p-10">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Ergebnis pro Jahr</p>
        <div aria-live="polite" className="mt-6 space-y-4">
          <Zeile icon={Landmark} label="Kreditbetrag" wert={eur(r.kredit)} />
          <Zeile icon={Wallet} label="Jahresrate (Annuität)" wert={eur(r.rate)} />
          <Zeile icon={PiggyBank} label="Vorteil der Anlage" wert={eur(vorteil)} />
          <div className={`rounded-2xl p-5 ${positiv ? "bg-ov-500/20 ring-1 ring-ov-400/40" : "bg-white/5 ring-1 ring-white/15"}`}>
            <p className="text-[13px] text-white/70">Überschuss nach Rate</p>
            <p className="ov-num mt-1 font-display text-[32px] font-extrabold leading-none tracking-tight">{eur(r.cashflow)}</p>
            <p className="mt-2 text-[13px] leading-snug text-white/60">
              {positiv ? "Die Anlage trägt die Rate aus dem laufenden Vorteil." : "Die Rate übersteigt den Vorteil – längere Laufzeit oder mehr Eigenmittel prüfen."}
            </p>
          </div>
          <Zeile icon={Receipt} label="Zinsen über die Laufzeit" wert={eur(r.zinsen)} />
          {ifb > 0 && <Zeile icon={Receipt} label={`IFB ${Math.round(ifb * 100)} %: einmalige Steuerwirkung (23 % KöSt)`} wert={eur(r.ifbSteuer)} />}
        </div>
        <p className="mt-auto flex gap-2 pt-8 text-[12.5px] leading-relaxed text-white/55">
          <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          Vereinfachte Beispielrechnung ohne Steuern auf den Vorteil, Wartung, Versicherung und Degradation. IFB-Bemessung vereinfacht als Investition abzüglich Zuschuss, höchstens 1 Mio. €.
          Keine Steuer-, Rechts- oder Finanzierungsberatung.
        </p>
      </div>
    </div>
  );
}

function Zeile({ icon: Icon, label, wert }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
      <span className="flex items-center gap-2.5 text-[14.5px] text-white/75">
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-300" />
        {label}
      </span>
      <span className="ov-num shrink-0 font-display text-[18px] font-bold">{wert}</span>
    </div>
  );
}
