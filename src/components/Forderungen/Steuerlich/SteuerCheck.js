"use client";

import { useMemo, useState } from "react";
import { Calculator, CircleAlert, Info } from "lucide-react";

/**
 * IFB-Rechner: Investitionsfreibetrag, Steuerwirkung und AfA für PV,
 * Speicher und Ladestationen (Österreich, Rechtsstand 09/2026).
 *
 * Grundlagen: § 11 EStG (IFB 10/15 %, befristet 20/22 % für Anschaffungen
 * 01.11.2025–31.12.2026, max. 1 Mio. € Bemessungsgrundlage je Wirtschaftsjahr),
 * § 7 EStG (Nutzungsdauer PV 20 Jahre, degressiv max. 30 %, Halbjahres-AfA).
 * Vereinfachte Orientierung – keine Steuerberatung.
 */

const eur = (n) => Math.round(n).toLocaleString("de-AT") + " €";

const STEUERSAETZE = [
  { id: "koest", label: "GmbH / AG (KöSt 23 %)", satz: 0.23 },
  { id: "est40", label: "Einzelunternehmen, Grenzsteuersatz 40 %", satz: 0.4 },
  { id: "est48", label: "Einzelunternehmen, Grenzsteuersatz 48 %", satz: 0.48 },
  { id: "est50", label: "Einzelunternehmen, Grenzsteuersatz 50 %", satz: 0.5 },
];

function Feld({ label, hilfe, children }) {
  return (
    <label className="block">
      <span className="text-[14.5px] font-semibold text-ink-800">{label}</span>
      {hilfe && <span className="mt-0.5 block text-[13px] text-ink-500">{hilfe}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

const eingabe = "ov-num h-12 w-full rounded-2xl bg-sand-50 px-4 text-[16px] font-semibold text-ink-900 ring-1 ring-ink-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ov-500";

export default function SteuerCheck() {
  const [kosten, setKosten] = useState("150000");
  const [zuschuss, setZuschuss] = useState("0");
  const [zeitpunkt, setZeitpunkt] = useState("2026");
  const [halbjahr, setHalbjahr] = useState("zweites");
  const [steuer, setSteuer] = useState("koest");
  const [gewinn, setGewinn] = useState("bilanz");

  const e = useMemo(() => {
    const k = Math.max(0, Number(String(kosten).replace(/\D/g, "")) || 0);
    const z = Math.min(k, Math.max(0, Number(String(zuschuss).replace(/\D/g, "")) || 0));
    const ak = k - z; // steuerfreie Zuschüsse kürzen die Anschaffungskosten
    const satzIfb = gewinn === "pauschal" ? 0 : zeitpunkt === "2026" ? 0.22 : 0.15;
    const basis = Math.min(ak, 1_000_000);
    const ifb = basis * satzIfb;
    const s = STEUERSAETZE.find((x) => x.id === steuer)?.satz ?? 0.23;
    const faktor = halbjahr === "zweites" ? 0.5 : 1;
    const afaLinear = (ak / 20) * faktor;
    const afaDegressiv = ak * 0.3 * faktor;
    return {
      ak,
      satzIfb,
      ifb,
      ersparnisIfb: ifb * s,
      afaLinear,
      afaDegressiv,
      ersparnisJahr1: (ifb + afaDegressiv) * s,
      gedeckelt: ak > 1_000_000,
      pauschal: gewinn === "pauschal",
    };
  }, [kosten, zuschuss, zeitpunkt, halbjahr, steuer, gewinn]);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-50px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6 border-b border-ink-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            <Calculator aria-hidden="true" className="h-4 w-4 text-ov-600" /> Ihre Investition
          </p>
          <Feld label="Anschaffungskosten netto" hilfe="PV-Anlage, Speicher und Ladestationen inkl. Montage">
            <input inputMode="numeric" value={kosten} onChange={(ev) => setKosten(ev.target.value.replace(/\D/g, ""))} className={eingabe} aria-describedby="hinweis-kosten" />
          </Feld>
          <Feld label="EAG-Zuschuss bzw. andere steuerfreie Förderung" hilfe="kürzt die Anschaffungskosten für AfA und IFB">
            <input inputMode="numeric" value={zuschuss} onChange={(ev) => setZuschuss(ev.target.value.replace(/\D/g, ""))} className={eingabe} />
          </Feld>
          <fieldset>
            <legend className="text-[14.5px] font-semibold text-ink-800">Anschaffung bzw. Fertigstellung</legend>
            <div className="mt-2 inline-flex flex-wrap gap-1 rounded-full bg-ink-100 p-1">
              {[
                { id: "2026", label: "01.11.2025 – 31.12.2026" },
                { id: "2027", label: "ab 2027" },
              ].map((o) => (
                <label key={o.id} className={`inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-[14px] font-semibold transition-all focus-within:ring-2 focus-within:ring-ov-500 ${zeitpunkt === o.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-600"}`}>
                  <input type="radio" name="zeitpunkt" className="sr-only" checked={zeitpunkt === o.id} onChange={() => setZeitpunkt(o.id)} />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-[14.5px] font-semibold text-ink-800">Inbetriebnahme im Wirtschaftsjahr</legend>
            <div className="mt-2 inline-flex flex-wrap gap-1 rounded-full bg-ink-100 p-1">
              {[
                { id: "erstes", label: "1. Halbjahr" },
                { id: "zweites", label: "2. Halbjahr" },
              ].map((o) => (
                <label key={o.id} className={`inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-[14px] font-semibold transition-all focus-within:ring-2 focus-within:ring-ov-500 ${halbjahr === o.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-600"}`}>
                  <input type="radio" name="halbjahr" className="sr-only" checked={halbjahr === o.id} onChange={() => setHalbjahr(o.id)} />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>
          <Feld label="Rechtsform und Steuersatz">
            <select value={steuer} onChange={(ev) => setSteuer(ev.target.value)} className={eingabe}>
              {STEUERSAETZE.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </Feld>
          <Feld label="Gewinnermittlung">
            <select value={gewinn} onChange={(ev) => setGewinn(ev.target.value)} className={eingabe}>
              <option value="bilanz">Bilanz oder Einnahmen-Ausgaben-Rechnung</option>
              <option value="pauschal">Pauschalierung (z. B. Kleinunternehmer- oder LuF-Pauschalierung)</option>
            </select>
          </Feld>
        </div>

        <div className="flex flex-col bg-sand-50/60 p-6 sm:p-8" aria-live="polite">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">Ergebnis – Orientierung</p>
          <dl className="mt-5 space-y-4">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/70">
              <dt className="text-[13.5px] text-ink-500">Investitionsfreibetrag ({Math.round(e.satzIfb * 100)} %)</dt>
              <dd className="ov-num mt-1 font-display text-[30px] font-extrabold leading-none tracking-tight text-ov-700">{eur(e.ifb)}</dd>
              <dd className="mt-2 text-[14px] text-ink-600">Steuerwirkung: <strong className="text-ink-900">{eur(e.ersparnisIfb)}</strong> – zusätzlich zur Abschreibung</dd>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                <dt className="text-[13px] text-ink-500">AfA linear, 1. Jahr (20 Jahre)</dt>
                <dd className="ov-num mt-1 font-display text-[20px] font-bold text-ink-900">{eur(e.afaLinear)}</dd>
              </div>
              <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                <dt className="text-[13px] text-ink-500">AfA degressiv 30 %, 1. Jahr</dt>
                <dd className="ov-num mt-1 font-display text-[20px] font-bold text-ink-900">{eur(e.afaDegressiv)}</dd>
              </div>
            </div>
            <div className="rounded-2xl bg-navy-950 p-5 text-white">
              <dt className="text-[13.5px] text-white/70">Steuerwirkung im 1. Jahr (IFB + degressive AfA)</dt>
              <dd className="ov-num mt-1 font-display text-[26px] font-extrabold">{eur(e.ersparnisJahr1)}</dd>
            </div>
          </dl>
          {e.pauschal && (
            <p className="mt-4 flex gap-2 rounded-2xl bg-sun-300/25 p-4 text-[14px] leading-relaxed text-ink-800 ring-1 ring-sun-400/50">
              <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
              Bei pauschaler Gewinnermittlung steht kein Investitionsfreibetrag zu. Ob eine PV-Anlage im land- und forstwirtschaftlichen Betrieb als Nebenbetrieb oder eigener Gewerbebetrieb gilt, entscheidet die Verwendung des Stroms.
            </p>
          )}
          {e.gedeckelt && (
            <p className="mt-4 flex gap-2 text-[13.5px] leading-relaxed text-ink-600">
              <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
              Die Bemessungsgrundlage des IFB ist auf 1 Mio. € je Wirtschaftsjahr begrenzt.
            </p>
          )}
          <p id="hinweis-kosten" className="mt-auto pt-6 text-[12.5px] leading-relaxed text-ink-500">
            Vereinfachte Berechnung ohne Gewinnfreibetrag, Verlustvorträge und Mindest-KöSt. Degressive und lineare AfA sind Alternativen. Der IFB setzt eine Behaltedauer von 4 Jahren voraus und schließt den investitionsbedingten Gewinnfreibetrag für dasselbe Wirtschaftsgut aus. Keine Steuerberatung.
          </p>
        </div>
      </div>
    </div>
  );
}
