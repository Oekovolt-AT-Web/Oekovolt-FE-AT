"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Building2, CircleAlert, Fence, Globe2, Info, Sparkles, Sprout, Sun } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * EAG-Zuschuss-Rechner (Investitionszuschuss PV & Speicher, Anträge 2026).
 *
 * Regeln laut EAG-IZV idF BGBl. II Nr. 12/2026 (Fassung vom 19.01.2026):
 *  - Kategorie nach Engpassleistung: A ≤ 10 kWp 150 €/kWp fix, B ≤ 20 kWp 140 €/kWp fix,
 *    C ≤ 100 kWp max. 130 €/kWp (Gebot), D ≤ 1.000 kWp max. 120 €/kWp (Gebot)
 *  - Speicher 150 €/kWh, mind. 0,5 kWh je kWp, max. 50 kWh je Anlage
 *  - § 6: zuerst Innovationszuschlag (+30 %) bzw. Flächenabschlag (−25 %), auf das Ergebnis
 *    Made in Europe (+10 % Module, +10 % Wechselrichter; Speicher +10 % auf den Speicherzuschuss)
 *  - § 11: max. 30 % der förderfähigen Nettokosten; mit Zuschlag PV 65/55/45 %,
 *    Speicher mit Zuschlag 50/40/30 % (kleine/mittlere/große Unternehmen)
 * Orientierung – verbindlich ist der Fördervertrag der Abwicklungsstelle.
 */

const KAT = [
  { id: "A", bis: 10, satz: 150, fix: true, leistung: "bis 10 kWp" },
  { id: "B", bis: 20, satz: 140, fix: true, leistung: "über 10 bis 20 kWp" },
  { id: "C", bis: 100, satz: 130, fix: false, leistung: "über 20 bis 100 kWp" },
  { id: "D", bis: 1000, satz: 120, fix: false, leistung: "über 100 bis 1.000 kWp" },
];

// Schieberegler: stückweise linear, damit kleine und große Anlagen gleich gut einstellbar sind
const KNOTEN = [
  [0, 1],
  [200, 10],
  [350, 20],
  [600, 100],
  [1000, 1000],
];
function posZuKwp(pos) {
  for (let i = 1; i < KNOTEN.length; i++) {
    const [p0, k0] = KNOTEN[i - 1];
    const [p1, k1] = KNOTEN[i];
    if (pos <= p1) {
      const v = k0 + ((pos - p0) / (p1 - p0)) * (k1 - k0);
      return v < 20 ? Math.round(v * 2) / 2 : v < 100 ? Math.round(v) : Math.round(v / 5) * 5;
    }
  }
  return 1000;
}
function kwpZuPos(kwp) {
  const k = Math.min(1000, Math.max(1, kwp));
  for (let i = 1; i < KNOTEN.length; i++) {
    const [p0, k0] = KNOTEN[i - 1];
    const [p1, k1] = KNOTEN[i];
    if (k <= k1) return p0 + ((k - k0) / (k1 - k0)) * (p1 - p0);
  }
  return 1000;
}

const FLAECHEN = [
  { id: "gebaeude", label: "Gebäude & versiegelte Fläche", sub: "kein Abschlag", faktor: 1, icon: Building2 },
  { id: "gruen", label: "Agrarfläche / Grünland", sub: "−25 % Abschlag", faktor: 0.75, icon: Fence },
  { id: "agri", label: "Agri-PV, ≥ 75 % Landwirtschaft", sub: "kein Abschlag", faktor: 1, icon: Sprout },
  { id: "innovativ", label: "Innovative Anlage", sub: "+30 % Zuschlag", faktor: 1.3, icon: Sparkles },
];

const GROESSEN = [
  { id: "klein", label: "klein", pv: 0.65, sp: 0.5 },
  { id: "mittel", label: "mittel", pv: 0.55, sp: 0.4 },
  { id: "gross", label: "groß", pv: 0.45, sp: 0.3 },
];

const eur = (n) => `${Math.round(n).toLocaleString("de-DE")} €`;
const zahl = (s) => Number(String(s).replace(/[^\d,]/g, "").replace(",", ".")) || 0;

/** Weiches Hochzählen des Ergebnisses. */
function useTween(ziel, dauer = 550) {
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
    const schritt = (t) => {
      const p = Math.min(1, (t - t0) / dauer);
      const e = 1 - Math.pow(1 - p, 3);
      const v = start + (ziel - start) * e;
      setWert(v);
      vorher.current = v;
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [ziel, dauer]);
  return wert;
}

export default function ZuschussRechner({ budgets = {}, callZeitraum = "", naechsterGebotstermin = "" }) {
  const [kwp, setKwp] = useState(80);
  const [kwh, setKwh] = useState(40);
  const [flaeche, setFlaeche] = useState("gebaeude");
  const [mie, setMie] = useState({ module: false, wr: false, speicher: false });
  const [gebot, setGebot] = useState(null); // €/kWp in C/D; null = Höchstsatz
  const [groesse, setGroesse] = useState("mittel");
  const [kostenPv, setKostenPv] = useState("");
  const [kostenSp, setKostenSp] = useState("");

  const r = useMemo(() => {
    const kat = kwp > 1000 ? null : KAT.find((k) => kwp <= k.bis);
    const fl = FLAECHEN.find((f) => f.id === flaeche);
    if (!kat) return { kat: null };
    const satz = kat.fix ? kat.satz : Math.min(kat.satz, gebot ?? kat.satz);
    const pvBasis = kwp * satz;
    const pvFlaeche = pvBasis * fl.faktor;
    const mieFaktor = 1 + (mie.module ? 0.1 : 0) + (mie.wr ? 0.1 : 0);
    let pv = pvFlaeche * mieFaktor;

    const minKwh = Math.ceil(kwp * 0.5 * 10) / 10;
    const spOk = kwh > 0 && kwh >= kwp * 0.5;
    const spKwh = spOk ? Math.min(kwh, 50) : 0;
    const spBasis = spKwh * 150;
    let sp = spBasis * (mie.speicher ? 1.1 : 1);

    const g = GROESSEN.find((x) => x.id === groesse);
    const pvZuschlag = fl.id === "innovativ" || mie.module || mie.wr;
    const pvQuote = pvZuschlag ? g.pv : 0.3;
    const spQuote = mie.speicher ? g.sp : 0.3;
    const kPv = zahl(kostenPv);
    const kSp = zahl(kostenSp);
    const pvVorDeckel = pv;
    const spVorDeckel = sp;
    if (kPv > 0) pv = Math.min(pv, kPv * pvQuote);
    if (kSp > 0) sp = Math.min(sp, kSp * spQuote);

    return {
      kat,
      satz,
      satzEffektiv: kwp > 0 ? pv / kwp : 0,
      pvBasis,
      zuAb: pvFlaeche - pvBasis,
      mieBetrag: pvVorDeckel - pvFlaeche + (spVorDeckel - spBasis),
      spBasis,
      pv,
      sp,
      gesamt: pv + sp,
      gedeckelt: pv < pvVorDeckel - 0.5 || sp < spVorDeckel - 0.5,
      minKwh,
      spOk,
      spKwh,
      spUeber50: spOk && kwh > 50,
      pvQuote,
      spQuote,
      minKostenPv: pvVorDeckel / pvQuote,
      minKostenSp: spVorDeckel > 0 ? spVorDeckel / spQuote : 0,
      kPv,
      kSp,
    };
  }, [kwp, kwh, flaeche, mie, gebot, groesse, kostenPv, kostenSp]);

  const gesamtAnim = useTween(r.kat ? r.gesamt : 0);
  const pos = kwpZuPos(kwp);
  const spMax = Math.max(100, Math.min(600, Math.ceil((kwp * 0.6) / 10) * 10));
  const balkenMax = r.kat ? Math.max(1, r.pvBasis + Math.max(0, r.zuAb) + Math.max(0, r.mieBetrag) + r.spBasis) : 1;

  function preset(k, s, f = "gebaeude") {
    setKwp(k);
    setKwh(s);
    setFlaeche(f);
    setGebot(null);
    setMie({ module: false, wr: false, speicher: false });
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_50px_100px_-60px_rgba(3,18,43,0.6)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* Eingaben */}
        <div className="space-y-7 p-6 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">Schnellwahl</span>
            {[
              { l: "10 kWp", k: 10, s: 5 },
              { l: "Beispiel: 80 kWp + 40 kWh", k: 80, s: 40 },
              { l: "250 kWp", k: 250, s: 125 },
              { l: "Agri-PV vertikal 600 kWp", k: 600, s: 0, f: "innovativ" },
            ].map((p) => (
              <button
                key={p.l}
                type="button"
                onClick={() => preset(p.k, p.s, p.f)}
                className="inline-flex h-8 items-center rounded-full bg-sand-50 px-3 text-[13px] font-semibold text-ink-700 ring-1 ring-ink-200 transition-colors hover:bg-ov-50 hover:text-ov-800 hover:ring-ov-200"
              >
                {p.l}
              </button>
            ))}
          </div>

          {/* Leistung */}
          <div>
            <div className="flex items-end justify-between gap-4">
              <label htmlFor="zr-kwp" className="text-[15px] font-semibold text-ink-900">
                <Sun aria-hidden="true" className="mr-1.5 inline h-4 w-4 -translate-y-px text-sun-500" />
                PV-Leistung (Engpassleistung)
              </label>
              <span className="flex items-baseline gap-1.5">
                <input
                  inputMode="decimal"
                  aria-label="PV-Leistung in kWp"
                  value={String(kwp).replace(".", ",")}
                  onChange={(e) => setKwp(Math.min(5000, zahl(e.target.value)))}
                  className="ov-num w-24 rounded-xl bg-sand-50 px-2 py-1 text-right font-display text-[22px] font-extrabold text-ink-900 ring-1 ring-ink-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ov-500"
                />
                <span className="text-[14px] font-semibold text-ink-500">kWp</span>
              </span>
            </div>
            <div className="relative mt-4">
              {/* Kategorie-Skala */}
              <div aria-hidden="true" className="mb-2 flex h-2 overflow-hidden rounded-full">
                {[
                  { id: "A", w: 20 },
                  { id: "B", w: 15 },
                  { id: "C", w: 25 },
                  { id: "D", w: 40 },
                ].map((s) => (
                  <span key={s.id} className={cn("h-full transition-colors duration-300", r.kat?.id === s.id ? "bg-ov-500" : "bg-ink-200")} style={{ width: `${s.w}%`, marginRight: s.id !== "D" ? 2 : 0 }} />
                ))}
              </div>
              <input
                id="zr-kwp"
                type="range"
                min={0}
                max={1000}
                step={1}
                value={Math.round(pos)}
                onChange={(e) => setKwp(posZuKwp(Number(e.target.value)))}
                aria-valuetext={`${kwp.toLocaleString("de-DE")} kWp`}
                className="w-full accent-ov-600"
              />
              <div aria-hidden="true" className="relative mt-1 h-5 text-[11.5px] font-semibold text-ink-400">
                {[
                  ["A", 10],
                  ["B", 27.5],
                  ["C", 47.5],
                  ["D", 80],
                ].map(([k, l]) => (
                  <span key={k} className={cn("absolute -translate-x-1/2 transition-colors", r.kat?.id === k && "text-ov-700")} style={{ left: `${l}%` }}>
                    Kat. {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Speicher */}
          <div>
            <div className="flex items-end justify-between gap-4">
              <label htmlFor="zr-kwh" className="text-[15px] font-semibold text-ink-900">
                <BatteryCharging aria-hidden="true" className="mr-1.5 inline h-4 w-4 -translate-y-px text-ov-600" />
                Stromspeicher
              </label>
              <span className="flex items-baseline gap-1.5">
                <input
                  inputMode="decimal"
                  aria-label="Speicherkapazität in kWh"
                  value={String(kwh).replace(".", ",")}
                  onChange={(e) => setKwh(Math.min(5000, zahl(e.target.value)))}
                  className="ov-num w-24 rounded-xl bg-sand-50 px-2 py-1 text-right font-display text-[22px] font-extrabold text-ink-900 ring-1 ring-ink-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ov-500"
                />
                <span className="text-[14px] font-semibold text-ink-500">kWh</span>
              </span>
            </div>
            <input
              id="zr-kwh"
              type="range"
              min={0}
              max={spMax}
              step={1}
              value={Math.min(kwh, spMax)}
              onChange={(e) => setKwh(Number(e.target.value))}
              aria-valuetext={`${kwh.toLocaleString("de-DE")} kWh`}
              className="mt-4 w-full accent-ov-600"
            />
            <p className="mt-1 text-[13px] text-ink-500">
              Mindestens {(Math.ceil(kwp * 0.5 * 10) / 10).toLocaleString("de-DE")} kWh (0,5 kWh je kWp), gefördert werden höchstens 50 kWh.
            </p>
          </div>

          {/* Fläche */}
          <fieldset>
            <legend className="text-[15px] font-semibold text-ink-900">Wo steht die Anlage?</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {FLAECHEN.map((f) => {
                const an = flaeche === f.id;
                return (
                  <label key={f.id} className={cn("flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition-all focus-within:ring-2 focus-within:ring-ov-500", an ? "bg-ov-50 ring-2 ring-ov-500" : "bg-sand-50 ring-1 ring-ink-200 hover:bg-white")}>
                    <input type="radio" name="zr-flaeche" className="sr-only" checked={an} onChange={() => setFlaeche(f.id)} />
                    <f.icon aria-hidden="true" className={cn("mt-0.5 h-5 w-5 shrink-0", an ? "text-ov-600" : "text-ink-400")} />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold leading-tight text-ink-900">{f.label}</span>
                      <span className={cn("mt-0.5 block text-[12.5px] font-semibold", f.faktor < 1 ? "text-sun-500" : f.faktor > 1 ? "text-ov-700" : "text-ink-500")}>{f.sub}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {flaeche === "innovativ" && (
              <p className="mt-2.5 text-[13px] leading-relaxed text-ink-500">
                Gebäudeintegriert, schwimmend, Parkplatzüberdachung ab 10 Stellplätzen, Lärmschutzwand, Staumauer oder Agri-PV mit vertikalen Modulen bzw. mind. 2 m Modulunterkante.
              </p>
            )}
          </fieldset>

          {/* Made in Europe */}
          <fieldset>
            <legend className="flex items-center gap-1.5 text-[15px] font-semibold text-ink-900">
              <Globe2 aria-hidden="true" className="h-4 w-4 text-navy-600" />
              Made in Europe <span className="font-medium text-ink-500">(+10 % je Komponente)</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { id: "module", l: "Module" },
                { id: "wr", l: "Wechselrichter" },
                { id: "speicher", l: "Speicher" },
              ].map((m) => {
                const an = mie[m.id];
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={an}
                    onClick={() => setMie((x) => ({ ...x, [m.id]: !x[m.id] }))}
                    className={cn("inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-all", an ? "bg-navy-950 text-white shadow-md" : "bg-sand-50 text-ink-700 ring-1 ring-ink-200 hover:bg-white")}
                  >
                    <span aria-hidden="true" className={cn("flex h-4 w-4 items-center justify-center rounded-full text-[10px]", an ? "bg-ov-400 text-navy-950" : "ring-1 ring-ink-300")}>{an ? "✓" : ""}</span>
                    {m.l}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Deckel */}
          <details className="group rounded-2xl ring-1 ring-ink-200/70 open:bg-sand-50/60">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[14.5px] font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
              30-%-Deckel mit Ihren Kosten prüfen
              <span aria-hidden="true" className="text-ink-400 transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2">
              <label className="block text-[13.5px] font-semibold text-ink-700">
                Förderfähige Nettokosten PV
                <input inputMode="numeric" placeholder="z. B. 80000" value={kostenPv} onChange={(e) => setKostenPv(e.target.value.replace(/\D/g, ""))} className="ov-num mt-1.5 h-11 w-full rounded-xl bg-white px-3 text-[15px] font-semibold text-ink-900 ring-1 ring-ink-200 focus:outline-none focus:ring-2 focus:ring-ov-500" />
              </label>
              <label className="block text-[13.5px] font-semibold text-ink-700">
                Förderfähige Nettokosten Speicher
                <input inputMode="numeric" placeholder="optional" value={kostenSp} onChange={(e) => setKostenSp(e.target.value.replace(/\D/g, ""))} className="ov-num mt-1.5 h-11 w-full rounded-xl bg-white px-3 text-[15px] font-semibold text-ink-900 ring-1 ring-ink-200 focus:outline-none focus:ring-2 focus:ring-ov-500" />
              </label>
              <fieldset className="sm:col-span-2">
                <legend className="text-[13.5px] font-semibold text-ink-700">Unternehmensgröße (Obergrenze bei Zuschlägen)</legend>
                <div className="mt-1.5 inline-flex rounded-full bg-ink-100 p-1">
                  {GROESSEN.map((g) => (
                    <label key={g.id} className={cn("inline-flex h-9 cursor-pointer items-center rounded-full px-4 text-[13.5px] font-semibold transition-all focus-within:ring-2 focus-within:ring-ov-500", groesse === g.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-600")}>
                      <input type="radio" name="zr-groesse" className="sr-only" checked={groesse === g.id} onChange={() => setGroesse(g.id)} />
                      {g.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </details>
        </div>

        {/* Ergebnis */}
        <div className="ov-noise relative isolate flex flex-col overflow-hidden bg-navy-950 p-6 text-white sm:p-8 md:p-10" aria-live="polite">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
          <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-ov-500/30 blur-[100px]" />
          <div aria-hidden="true" className="absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full bg-sun-400/10 blur-[100px]" />

          {r.kat ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">EAG-Investitionszuschuss</p>
                <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Kat.</span>
                  <span className="font-display text-[22px] font-extrabold leading-none text-white">{r.kat.id}</span>
                </span>
              </div>
              <p className="ov-num -mt-2 font-display text-[clamp(2.6rem,1.8rem+3vw,4rem)] font-extrabold leading-none tracking-tight">
                {r.gedeckelt ? "" : "bis "}
                {eur(gesamtAnim)}
              </p>
              <p className="mt-3 text-[14.5px] text-white/65">
                {r.kat.leistung} · {r.kat.fix ? "Fixbetrag, Reihung nach Ticket" : "Gebot, Reihung nach Förderbedarf"} · effektiv {Math.round(r.satzEffektiv).toLocaleString("de-DE")} €/kWp
              </p>

              {/* Gebot */}
              {!r.kat.fix && (
                <div className="mt-6 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                  <div className="flex items-end justify-between gap-4">
                    <label htmlFor="zr-gebot" className="text-[14px] font-semibold text-white">Ihr Gebot (Förderbedarf) in Kategorie {r.kat.id}</label>
                    <span className="ov-num font-display text-[18px] font-extrabold text-white">{r.satz} €/kWp</span>
                  </div>
                  <input
                    id="zr-gebot"
                    type="range"
                    min={40}
                    max={r.kat.satz}
                    step={1}
                    value={Math.min(r.satz, r.kat.satz)}
                    onChange={(e) => setGebot(Number(e.target.value))}
                    className="mt-3 w-full accent-ov-400"
                  />
                  <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">Gereiht wird vom niedrigsten Förderbedarf je kWp an – ein Gebot unter dem Höchstsatz erhöht die Chance auf einen Zuschlag.</p>
                </div>
              )}

              {/* Aufteilung */}
              <div className="mt-8">
                <div aria-hidden="true" className="flex h-3 overflow-hidden rounded-full bg-white/10">
                  <span className="h-full bg-ov-500 transition-[width] duration-500" style={{ width: `${(Math.min(r.pvBasis, r.pvBasis + r.zuAb) / balkenMax) * 100}%` }} />
                  {r.zuAb > 0 && <span className="h-full bg-ov-300 transition-[width] duration-500" style={{ width: `${(r.zuAb / balkenMax) * 100}%` }} />}
                  {r.mieBetrag > 0 && <span className="h-full bg-navy-300 transition-[width] duration-500" style={{ width: `${(r.mieBetrag / balkenMax) * 100}%` }} />}
                  {r.spBasis > 0 && <span className="h-full bg-sun-400 transition-[width] duration-500" style={{ width: `${(r.spBasis / balkenMax) * 100}%` }} />}
                </div>
                <dl className="mt-5 space-y-2.5 text-[14.5px]">
                  <Zeile farbe="bg-ov-500" label={`PV ${kwp.toLocaleString("de-DE")} kWp × ${r.satz} €/kWp`} wert={eur(r.pvBasis)} />
                  {r.zuAb !== 0 && <Zeile farbe={r.zuAb > 0 ? "bg-ov-300" : "bg-white/20"} label={r.zuAb > 0 ? "Innovationszuschlag +30 %" : "Abschlag Agrarfläche/Grünland −25 %"} wert={`${r.zuAb > 0 ? "+" : "−"}${eur(Math.abs(r.zuAb))}`} />}
                  {r.mieBetrag > 0 && <Zeile farbe="bg-navy-300" label="Made in Europe" wert={`+${eur(r.mieBetrag)}`} />}
                  <Zeile farbe="bg-sun-400" label={r.spKwh ? `Speicher ${r.spKwh.toLocaleString("de-DE")} kWh × 150 €/kWh` : "Speicher"} wert={r.spKwh ? eur(r.spBasis) : "–"} />
                </dl>
              </div>

              <div className="mt-6 space-y-2.5">
                {kwh > 0 && !r.spOk && (
                  <Warnung>Der Speicher ist mit {kwh.toLocaleString("de-DE")} kWh zu klein: gefördert wird er erst ab 0,5 kWh je kWp ({r.minKwh.toLocaleString("de-DE")} kWh).</Warnung>
                )}
                {r.spUeber50 && <Hinweis>Gefördert werden höchstens 50 kWh je Anlage – die übrige Kapazität trägt keinen Zuschuss.</Hinweis>}
                {r.gedeckelt ? (
                  <Warnung>Der Deckel greift: max. {Math.round(r.pvQuote * 100)} % der PV-Kosten{r.kSp ? ` bzw. ${Math.round(r.spQuote * 100)} % der Speicherkosten` : ""} – der Zuschuss ist entsprechend gekürzt.</Warnung>
                ) : (
                  <Hinweis>
                    Voller Betrag nur bei förderfähigen Nettokosten ab {eur(r.minKostenPv)} (PV){r.minKostenSp ? ` und ${eur(r.minKostenSp)} (Speicher)` : ""} – Deckel {Math.round(r.pvQuote * 100)} %.
                  </Hinweis>
                )}
                <Hinweis>
                  {r.kat.id === "D" ? "Kategorie D: keine Kombination mit Landes- oder Gemeindeförderung." : "Kombinierbar mit Landes- und Gemeindeförderung bis zu den beihilferechtlichen Grenzen."}
                  {budgets[r.kat.id] ? ` Budget im 3. Call (${callZeitraum}): ${budgets[r.kat.id]}.` : ""}
                </Hinweis>
              </div>
            </>
          ) : (
            <div className="my-auto">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Über 1.000 kWp</p>
              <p className="mt-3 font-display text-[28px] font-extrabold leading-tight">Kein Investitionszuschuss – der Weg führt über die Marktprämie.</p>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">Der EAG-Investitionszuschuss endet bei 1.000 kWp. Größere Anlagen bieten in der Ausschreibung der Marktprämie mit. {naechsterGebotstermin ? `Nächster Gebotstermin: ${naechsterGebotstermin}.` : ""}</p>
              <a href="#marktpraemie" className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-300 hover:text-white">
                Zur Marktprämie <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
            <Link href="/angebot" className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700">
              Förderantrag vorbereiten lassen
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-white/45">
            Orientierung nach EAG-IZV idF BGBl. II Nr. 12/2026 – ohne Gewähr. In Kategorie C und D entscheidet das Gebot über den Zuschlag; nicht förderfähig sind u. a. Eigenleistungen, Netzausbau und Finanzierungskosten.
          </p>
        </div>
      </div>
    </div>
  );
}

function Zeile({ farbe, label, wert }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="flex min-w-0 items-center gap-2.5 text-white/70">
        <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-full", farbe)} />
        <span className="min-w-0">{label}</span>
      </dt>
      <dd className="ov-num shrink-0 font-semibold text-white">{wert}</dd>
    </div>
  );
}

function Warnung({ children }) {
  return (
    <p className="flex gap-2.5 rounded-2xl bg-sun-400/15 p-3 text-[13.5px] leading-relaxed text-white/85 ring-1 ring-sun-400/30">
      <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" />
      <span>{children}</span>
    </p>
  );
}

function Hinweis({ children }) {
  return (
    <p className="flex gap-2.5 text-[13.5px] leading-relaxed text-white/65">
      <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
      <span>{children}</span>
    </p>
  );
}
