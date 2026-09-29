"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Calculator, CircleAlert, Info, User } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * IFB-Rechner: Investitionsfreibetrag, Steuerwirkung und AfA für PV,
 * Speicher und Ladestationen (Österreich, Rechtsstand 09/2026).
 *
 * Grundlagen: § 11 EStG (IFB 10/15 %, befristet 20/22 % für Anschaffungen
 * 01.11.2025–31.12.2026, max. 1 Mio. € Bemessungsgrundlage je Wirtschaftsjahr),
 * § 7 EStG (Nutzungsdauer PV 20 Jahre, degressiv max. 30 %, Halbjahres-AfA).
 * Vereinfachte Orientierung – keine Steuerberatung.
 */

const eur = (n) => `${Math.round(n).toLocaleString("de-DE")} €`;

const STEUERSAETZE = [
  { id: "koest", label: "GmbH / AG", sub: "KöSt 23 %", satz: 0.23, icon: Building2 },
  { id: "est40", label: "Einzelunternehmen", sub: "Grenzsteuersatz 40 %", satz: 0.4, icon: User },
  { id: "est48", label: "Einzelunternehmen", sub: "Grenzsteuersatz 48 %", satz: 0.48, icon: User },
  { id: "est50", label: "Einzelunternehmen", sub: "Grenzsteuersatz 50 %", satz: 0.5, icon: User },
];

function useTween(ziel, dauer = 500) {
  const [wert, setWert] = useState(ziel);
  const vorher = useRef(ziel);
  useEffect(() => {
    const start = vorher.current;
    if (start === ziel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      vorher.current = ziel;
      setWert(ziel);
      return;
    }
    let raf;
    const t0 = performance.now();
    const f = (t) => {
      const p = Math.min(1, (t - t0) / dauer);
      const v = start + (ziel - start) * (1 - Math.pow(1 - p, 3));
      setWert(v);
      vorher.current = v;
      if (p < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [ziel, dauer]);
  return wert;
}

function Segment({ legend, name, optionen, wert, onChange }) {
  return (
    <fieldset>
      <legend className="text-[14.5px] font-semibold text-ink-900">{legend}</legend>
      <div className="mt-2 inline-flex flex-wrap gap-1 rounded-full bg-ink-100 p-1">
        {optionen.map((o) => (
          <label key={o.id} className={cn("inline-flex h-10 cursor-pointer items-center whitespace-nowrap rounded-full px-3.5 text-[14px] font-semibold transition-all focus-within:ring-2 focus-within:ring-ov-500", wert === o.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-600 hover:text-ink-800")}>
            <input type="radio" name={name} className="sr-only" checked={wert === o.id} onChange={() => onChange(o.id)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function rechne({ ak, satzIfb, s, faktor, afa }) {
  const ifb = Math.min(ak, 1_000_000) * satzIfb;
  const afaLinear = (ak / 20) * faktor;
  const afaDegressiv = ak * 0.3 * faktor;
  const afaJahr1 = afa === "linear" ? afaLinear : afaDegressiv;
  return { ifb, afaLinear, afaDegressiv, afaJahr1, steuerIfb: ifb * s, steuerAfa: afaJahr1 * s, steuerJahr1: (ifb + afaJahr1) * s };
}

export default function SteuerCheck() {
  const [kosten, setKosten] = useState(150000);
  const [zuschuss, setZuschuss] = useState(0);
  const [zeitpunkt, setZeitpunkt] = useState("2026");
  const [halbjahr, setHalbjahr] = useState("zweites");
  const [steuer, setSteuer] = useState("koest");
  const [gewinn, setGewinn] = useState("bilanz");
  const [afa, setAfa] = useState("degressiv");

  const e = useMemo(() => {
    const k = Math.max(0, kosten || 0);
    const z = Math.min(k, Math.max(0, zuschuss || 0));
    const ak = k - z; // steuerfreie Zuschüsse kürzen die Anschaffungskosten
    const s = STEUERSAETZE.find((x) => x.id === steuer)?.satz ?? 0.23;
    const faktor = halbjahr === "zweites" ? 0.5 : 1;
    const pauschal = gewinn === "pauschal";
    const a26 = rechne({ ak, satzIfb: pauschal ? 0 : 0.22, s, faktor, afa });
    const a27 = rechne({ ak, satzIfb: pauschal ? 0 : 0.15, s, faktor, afa });
    const aktiv = zeitpunkt === "2026" ? a26 : a27;
    return { k, z, ak, s, a26, a27, aktiv, satzIfb: pauschal ? 0 : zeitpunkt === "2026" ? 0.22 : 0.15, gedeckelt: ak > 1_000_000, pauschal, netto: Math.max(0, k - z - aktiv.steuerJahr1) };
  }, [kosten, zuschuss, zeitpunkt, halbjahr, steuer, gewinn, afa]);

  const anim = useTween(e.aktiv.steuerJahr1);
  const maxBalken = Math.max(1, e.a26.steuerJahr1, e.a27.steuerJahr1);

  function beispiel() {
    setKosten(200000);
    setZuschuss(0);
    setZeitpunkt("2026");
    setHalbjahr("zweites");
    setSteuer("koest");
    setGewinn("bilanz");
    setAfa("linear");
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_50px_100px_-60px_rgba(3,18,43,0.6)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Eingaben */}
        <div className="space-y-6 p-6 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              <Calculator aria-hidden="true" className="h-4 w-4 text-ov-600" /> Ihre Investition
            </p>
            <button type="button" onClick={beispiel} className="inline-flex h-8 items-center rounded-full bg-sand-50 px-3 text-[13px] font-semibold text-ink-700 ring-1 ring-ink-200 transition-colors hover:bg-ov-50 hover:text-ov-800 hover:ring-ov-200">
              Beispiel: GmbH, 200.000 €
            </button>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <label htmlFor="ifb-kosten" className="text-[14.5px] font-semibold text-ink-900">
                Anschaffungskosten netto
                <span className="block text-[13px] font-normal text-ink-500">PV-Anlage, Speicher und Ladestationen inkl. Montage</span>
              </label>
              <span className="flex items-baseline gap-1">
                <input
                  inputMode="numeric"
                  aria-label="Anschaffungskosten netto in Euro"
                  value={kosten.toLocaleString("de-DE")}
                  onChange={(ev) => setKosten(Math.min(5_000_000, Number(ev.target.value.replace(/\D/g, "")) || 0))}
                  className="ov-num w-32 rounded-xl bg-sand-50 px-2 py-1 text-right font-display text-[19px] font-extrabold text-ink-900 ring-1 ring-ink-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ov-500 sm:w-36"
                />
                <span className="text-[14px] font-semibold text-ink-500">€</span>
              </span>
            </div>
            <input id="ifb-kosten" type="range" min={10000} max={1500000} step={5000} value={Math.min(1500000, Math.max(10000, kosten))} onChange={(ev) => setKosten(Number(ev.target.value))} aria-valuetext={eur(kosten)} className="mt-3 w-full accent-ov-600" />
          </div>

          <div className="flex items-end justify-between gap-4">
            <label htmlFor="ifb-zuschuss" className="text-[14.5px] font-semibold text-ink-900">
              EAG-Zuschuss bzw. andere steuerfreie Förderung
              <span className="block text-[13px] font-normal text-ink-500">kürzt die Anschaffungskosten für AfA und IFB</span>
            </label>
            <span className="flex items-baseline gap-1">
              <input
                id="ifb-zuschuss"
                inputMode="numeric"
                value={zuschuss.toLocaleString("de-DE")}
                onChange={(ev) => setZuschuss(Number(ev.target.value.replace(/\D/g, "")) || 0)}
                className="ov-num w-32 rounded-xl bg-sand-50 px-2 py-1 text-right font-display text-[19px] font-extrabold text-ink-900 ring-1 ring-ink-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ov-500 sm:w-36"
              />
              <span className="text-[14px] font-semibold text-ink-500">€</span>
            </span>
          </div>

          <fieldset>
            <legend className="text-[14.5px] font-semibold text-ink-900">Rechtsform und Steuersatz</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {STEUERSAETZE.map((o) => {
                const an = steuer === o.id;
                return (
                  <label key={o.id} className={cn("flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all focus-within:ring-2 focus-within:ring-ov-500", an ? "bg-ov-50 ring-2 ring-ov-500" : "bg-sand-50 ring-1 ring-ink-200 hover:bg-white")}>
                    <input type="radio" name="ifb-steuer" className="sr-only" checked={an} onChange={() => setSteuer(o.id)} />
                    <o.icon aria-hidden="true" className={cn("h-5 w-5 shrink-0", an ? "text-ov-600" : "text-ink-400")} />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold leading-tight text-ink-900">{o.label}</span>
                      <span className="block text-[12.5px] text-ink-500">{o.sub}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <Segment legend="Anschaffung bzw. Fertigstellung" name="ifb-zeit" wert={zeitpunkt} onChange={setZeitpunkt} optionen={[{ id: "2026", label: "bis 31.12.2026" }, { id: "2027", label: "ab 2027" }]} />
            <Segment legend="Inbetriebnahme im Wirtschaftsjahr" name="ifb-hj" wert={halbjahr} onChange={setHalbjahr} optionen={[{ id: "erstes", label: "1. Halbjahr" }, { id: "zweites", label: "2. Halbjahr" }]} />
            <Segment legend="AfA (20 J. linear / 30 % degressiv)" name="ifb-afa" wert={afa} onChange={setAfa} optionen={[{ id: "linear", label: "linear" }, { id: "degressiv", label: "degressiv" }]} />
            <Segment legend="Gewinnermittlung" name="ifb-gewinn" wert={gewinn} onChange={setGewinn} optionen={[{ id: "bilanz", label: "Bilanz / EAR" }, { id: "pauschal", label: "pauschal" }]} />
          </div>
        </div>

        {/* Ergebnis */}
        <div className="ov-noise relative isolate flex flex-col overflow-hidden bg-navy-950 p-6 text-white sm:p-8 md:p-10" aria-live="polite">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
          <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-ov-500/30 blur-[100px]" />

          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Steuerwirkung im 1. Jahr</p>
          <p className="ov-num mt-2 font-display text-[clamp(2.6rem,1.8rem+3vw,4rem)] font-extrabold leading-none tracking-tight">{eur(anim)}</p>
          <p className="mt-3 text-[14.5px] text-white/65">
            IFB {Math.round(e.satzIfb * 100)} % ({eur(e.aktiv.ifb)}) + AfA {afa === "linear" ? "linear" : "degressiv"} ({eur(e.aktiv.afaJahr1)}) × Steuersatz {Math.round(e.s * 100)} %
          </p>

          {/* Vergleich 2026 / 2027 */}
          <div className="mt-8 space-y-4">
            {[
              { id: "2026", label: "Anschaffung bis 31.12.2026", d: e.a26 },
              { id: "2027", label: "Anschaffung ab 2027", d: e.a27 },
            ].map((z) => (
              <div key={z.id}>
                <div className="flex items-baseline justify-between gap-3 text-[14px]">
                  <span className={cn("font-semibold", zeitpunkt === z.id ? "text-white" : "text-white/60")}>{z.label}</span>
                  <span className="ov-num font-display font-bold text-white">{eur(z.d.steuerJahr1)}</span>
                </div>
                <div aria-hidden="true" className="mt-2 flex h-3.5 overflow-hidden rounded-full bg-white/10">
                  <span className={cn("h-full transition-[width] duration-500", z.id === "2026" ? "bg-ov-400" : "bg-ov-400/50")} style={{ width: `${(z.d.steuerIfb / maxBalken) * 100}%` }} />
                  <span className={cn("h-full transition-[width] duration-500", z.id === "2026" ? "bg-sun-400" : "bg-sun-400/50")} style={{ width: `${(z.d.steuerAfa / maxBalken) * 100}%` }} />
                </div>
              </div>
            ))}
            <p className="flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-white/55">
              <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ov-400" /> Steuerwirkung IFB</span>
              <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-sun-400" /> Steuerwirkung AfA</span>
            </p>
            {!e.pauschal && e.a26.steuerJahr1 > e.a27.steuerJahr1 && (
              <p className="rounded-2xl bg-ov-500/15 p-4 text-[14.5px] leading-relaxed text-white/85 ring-1 ring-ov-400/30">
                Vorteil bei Anschaffung bis 31.12.2026: <strong className="ov-num text-ov-300">+{eur(e.a26.steuerJahr1 - e.a27.steuerJahr1)}</strong> im ersten Jahr.
              </p>
            )}
          </div>

          {/* Netto-Investition */}
          <div className="mt-6 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
            <p className="text-[13px] font-semibold text-white/70">Investition nach Zuschuss und Steuerwirkung im 1. Jahr</p>
            <div aria-hidden="true" className="mt-3 flex h-3 overflow-hidden rounded-full bg-white/10">
              <span className="h-full bg-white/80 transition-[width] duration-500" style={{ width: `${e.k ? (e.netto / e.k) * 100 : 0}%` }} />
              <span className="h-full bg-ov-400 transition-[width] duration-500" style={{ width: `${e.k ? (Math.min(e.aktiv.steuerJahr1, e.k - e.z) / e.k) * 100 : 0}%` }} />
              <span className="h-full bg-navy-300 transition-[width] duration-500" style={{ width: `${e.k ? (e.z / e.k) * 100 : 0}%` }} />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-[12.5px]">
              <div><dt className="text-white/50">verbleibt</dt><dd className="ov-num font-semibold text-white">{eur(e.netto)}</dd></div>
              <div><dt className="text-white/50">Steuer Jahr 1</dt><dd className="ov-num font-semibold text-ov-300">{eur(e.aktiv.steuerJahr1)}</dd></div>
              <div><dt className="text-white/50">Zuschuss</dt><dd className="ov-num font-semibold text-navy-200">{eur(e.z)}</dd></div>
            </dl>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
            <div className="rounded-2xl bg-white/[0.05] p-3 ring-1 ring-white/10">
              <dt className="text-white/55">AfA linear, 1. Jahr (20 Jahre)</dt>
              <dd className="ov-num mt-0.5 font-display text-[16px] font-bold">{eur(e.aktiv.afaLinear)}</dd>
            </div>
            <div className="rounded-2xl bg-white/[0.05] p-3 ring-1 ring-white/10">
              <dt className="text-white/55">AfA degressiv 30 %, 1. Jahr</dt>
              <dd className="ov-num mt-0.5 font-display text-[16px] font-bold">{eur(e.aktiv.afaDegressiv)}</dd>
            </div>
          </dl>

          {e.pauschal && (
            <p className="mt-4 flex gap-2 rounded-2xl bg-sun-400/15 p-4 text-[13.5px] leading-relaxed text-white/85 ring-1 ring-sun-400/30">
              <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" />
              Bei pauschaler Gewinnermittlung steht kein Investitionsfreibetrag zu. Ob eine PV-Anlage im land- und forstwirtschaftlichen Betrieb als Nebenbetrieb oder eigener Gewerbebetrieb gilt, entscheidet die Verwendung des Stroms.
            </p>
          )}
          {e.gedeckelt && (
            <p className="mt-4 flex gap-2 text-[13px] leading-relaxed text-white/65">
              <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
              Die Bemessungsgrundlage des IFB ist auf 1 Mio. € je Wirtschaftsjahr begrenzt.
            </p>
          )}

          <Link href="/angebot" className="group mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700">
            Bauzeitplan für 2026 anfragen
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 text-[12px] leading-relaxed text-white/45">
            Vereinfachte Berechnung ohne Gewinnfreibetrag, Verlustvorträge und Mindest-KöSt. Degressive und lineare AfA sind Alternativen. Der IFB setzt eine Behaltedauer von 4 Jahren voraus und schließt den investitionsbedingten Gewinnfreibetrag für dasselbe Wirtschaftsgut aus. Keine Steuerberatung.
          </p>
        </div>
      </div>
    </div>
  );
}
