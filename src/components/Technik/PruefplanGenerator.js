"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { ClipboardCheck, Lock, Printer } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";
import { PRUEFPLAN_STUFEN, Q_VERFAHREN, pruefplan } from "@/data/parkreglerDatenblatt";
import FachplanerGate, { useGateFreigabe } from "@/components/Technik/FachplanerGate";

/**
 * Inbetriebnahme-Prüfplan-Generator (Paket B04): Sollwertsprünge 100/60/30/0 %, Test des
 * Q-Verfahrens und Rückfallwert – allein aus TOR-Standardwerten, keine Produktdaten.
 * Lead-Gate-Regel Stufe 1: Der Plan bleibt am Bildschirm frei; Druck/PDF erst nach dem Gate
 * (Kennung „fachplaner-paket“, Double-Opt-in).
 */

const KENNUNG = "fachplaner-paket";

const DRUCK_CSS = `
@media print {
  body * { visibility: hidden !important; }
  .pp-druck, .pp-druck * { visibility: visible !important; }
  .pp-druck { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
  .pp-nicht-drucken { display: none !important; }
}`;

const zahl = (n) => n.toLocaleString("de-AT");

export default function PruefplanGenerator() {
  const id = useId();
  const [pmaxKw, setPmaxKw] = useState(800);
  const [typ, setTyp] = useState("B");
  const [qVerfahren, setQVerfahren] = useState("qu");
  const [rueckfall, setRueckfall] = useState(70);
  const [umrichter, setUmrichter] = useState(true);
  const [gateOffen, setGateOffen] = useState(false);
  const [frei, freischalten] = useGateFreigabe(KENNUNG);

  const plan = useMemo(() => {
    try {
      return pruefplan({ pmaxKw, qVerfahren, rueckfallProzent: rueckfall, typ, umrichter });
    } catch {
      return null;
    }
  }, [pmaxKw, qVerfahren, rueckfall, typ, umrichter]);

  const schliessen = useCallback(() => setGateOffen(false), []);

  const drucken = () => {
    if (!frei) {
      ereignis("lead_gate_geoeffnet", { kennung: KENNUNG, aktion: "pdf" });
      setGateOffen(true);
      return;
    }
    ereignis("pruefplan_druck", { kennung: KENNUNG });
    window.print();
  };

  const feldKlasse = "h-11 w-full rounded-xl bg-white px-3 text-[15px] text-ink-900 ring-1 ring-inset ring-ink-200 focus:outline-none focus:ring-2 focus:ring-ov-500";

  return (
    <div id="pruefplan" className="scroll-mt-24">
      <style dangerouslySetInnerHTML={{ __html: DRUCK_CSS }} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <form className="pp-nicht-drucken flex flex-col gap-5 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-8" onSubmit={(e) => e.preventDefault()}>
          <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
            <ClipboardCheck aria-hidden="true" className="h-4 w-4" />
            Prüfplan-Generator
          </p>
          <div>
            <label htmlFor={`${id}-p`} className="mb-1.5 block text-[14px] font-medium text-ink-700">
              Maximalkapazität Pmax (kW)
            </label>
            <input id={`${id}-p`} type="number" inputMode="numeric" min={1} max={100000} step={1} value={pmaxKw} onChange={(e) => setPmaxKw(Math.max(0, Number(e.target.value) || 0))} className={feldKlasse} />
          </div>
          <fieldset>
            <legend className="mb-1.5 text-[14px] font-medium text-ink-700">Anlagentyp nach TOR</legend>
            <div className="inline-flex gap-1 rounded-full bg-sand-50 p-1">
              {["A", "B"].map((t) => (
                <button key={t} type="button" aria-pressed={typ === t} onClick={() => setTyp(t)} className={cn("min-h-10 rounded-full px-4 text-[13.5px] font-semibold transition-colors", typ === t ? "bg-navy-950 text-white" : "text-ink-700 hover:text-ink-900")}>
                  Typ {t}
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor={`${id}-q`} className="mb-1.5 block text-[14px] font-medium text-ink-700">
              Blindleistungsverfahren laut Netzanschlussvertrag
            </label>
            <select id={`${id}-q`} value={qVerfahren} onChange={(e) => setQVerfahren(e.target.value)} className={feldKlasse}>
              {Object.entries(Q_VERFAHREN).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-r`} className="mb-1.5 block text-[14px] font-medium text-ink-700">
              Rückfallwert bei Kommunikationsausfall (% Pmax)
            </label>
            <input id={`${id}-r`} type="number" inputMode="numeric" min={0} max={100} step={5} value={rueckfall} onChange={(e) => setRueckfall(Math.min(100, Math.max(0, Number(e.target.value) || 0)))} className={feldKlasse} />
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-500">Den Wert gibt Ihr Netzbetreiber vor; 70 % ist nur ein Platzhalter.</p>
          </div>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={umrichter} onChange={(e) => setUmrichter(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600" />
            <span className="text-[14px] leading-relaxed text-ink-700">Umrichter-Anlage (PV, Speicher) – Sollwert binnen 1 min</span>
          </label>
        </form>

        <section aria-labelledby={`${id}-titel`} aria-live="polite" className="pp-druck rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-ink-200/70 md:p-8">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Inbetriebnahme-Prüfplan · Parkregler</p>
          <h3 id={`${id}-titel`} className="mt-1.5 font-display text-[22px] font-extrabold leading-tight text-ink-900">
            {plan ? `${zahl(plan.pmaxKw)} kW · Typ ${plan.typ} · ${plan.qVerfahren} · Rückfall ${plan.rueckfallProzent} %` : "Bitte Pmax angeben"}
          </h3>
          {plan && (
            <ol className="mt-5 grid gap-3">
              {plan.schritte.map((s) => (
                <li key={s.nr} className="flex gap-4 rounded-2xl bg-sand-50/70 p-4">
                  <span className="ov-num flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[13px] font-bold text-white">{s.nr}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900">{s.titel}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-ink-700">{s.text}</p>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-500">
                      {s.frist && <>Frist: {s.frist} · </>}Nachweis: {s.nachweis}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-5 text-[12.5px] leading-relaxed text-ink-500">
            {plan?.hinweis} Sollwertstufen {PRUEFPLAN_STUFEN.join("/")} % als Beispiel nach TOR Typ B V1.3 Kap. 5.1.4. Stand {plan?.stand ?? "10/2026"} · Ökovolt Österreich.
          </p>
          <div className="pp-nicht-drucken mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-[13px] text-ink-600">
              {!frei && <Lock aria-hidden="true" className="h-4 w-4 text-ink-500" />}
              {frei ? "Druck freigeschaltet." : "Am Bildschirm frei – Druck/PDF nach kurzer Bestätigung per E-Mail."}
            </p>
            <button type="button" onClick={drucken} disabled={!plan} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700 disabled:opacity-60">
              <Printer aria-hidden="true" className="h-4 w-4" />
              Prüfplan drucken / als PDF
            </button>
          </div>
        </section>
      </div>

      {gateOffen && (
        <FachplanerGate
          aktion="pdf"
          kennung={KENNUNG}
          rueckkehrHash="#pruefplan"
          zusammenfassung={plan ? { Pmax: `${plan.pmaxKw} kW`, Typ: plan.typ, "Q-Verfahren": plan.qVerfahren, Rueckfallwert: `${plan.rueckfallProzent} %` } : {}}
          onFrei={() => {
            freischalten();
            setGateOffen(false);
          }}
          onSchliessen={schliessen}
        />
      )}
    </div>
  );
}
