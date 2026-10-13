"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, FileText, Info, Scale } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { DC_AC_VORSCHLAG, TYPEN, acSumme, liesZahlDe, torTyp } from "./torTypen";

/**
 * TOR-Typ-Finder: AC-Maximalkapazität (Wechselrichter PV, optional Speicher-AC und
 * bestehende Erzeugung am selben Netzanschlusspunkt) und Netzanschluss ≥ 110 kV eingeben →
 * Anlagentyp A/B/C/D mit Regelwerk und wesentlichen Anforderungen. Die Einstufung kommt aus
 * der gemeinsamen Funktion torTyp() (torTypen.js) – dieselbe wie in den Rechnern.
 * Grenzen nach RfG-Schwellenwert-V der E-Control; Texte aus der Übersicht der
 * Seite (TOR Typ A V1.4, Typ B V1.3, Typ C/D). Vereinfachte Orientierung.
 */

const BEISPIELE = [
  { l: "Gewerbedach 180 kW", kw: 180 },
  { l: "Hallendach 750 kW", kw: 750 },
  { l: "Solarpark 8 MW", kw: 8000 },
  { l: "Großpark 60 MW", kw: 60000 },
];

// Logarithmischer Regler: 0,5 kW … 100 MW
const LMIN = Math.log10(0.5);
const LMAX = Math.log10(100000);
const zuKw = (s) => Math.pow(10, LMIN + (s / 1000) * (LMAX - LMIN));
const zuSchritt = (kw) => Math.round(((Math.log10(Math.max(0.5, kw)) - LMIN) / (LMAX - LMIN)) * 1000);

// Zahlformat ohne Intl – Server und Browser formatieren identisch
const zahl = (n, stellen = 0) => {
  const f = Math.pow(10, stellen);
  const [ganz, dez] = (Math.round(n * f) / f).toFixed(stellen).split(".");
  const text = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dez && Number(dez) !== 0 ? `${text},${dez}` : text;
};
const fmt = (kw) => (kw >= 1000 ? `${zahl(kw / 1000, kw >= 10000 ? 0 : 1)} MW` : `${zahl(kw, kw < 10 ? 1 : 0)} kW`);
const lies = (t) => {
  const n = liesZahlDe(t);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 100000) : 0;
};

export default function TorTypFinder() {
  const id = useId();
  const [kw, setKw] = useState(750);
  const [eingabe, setEingabe] = useState("750");
  const [hs, setHs] = useState(false);
  const [speicherText, setSpeicherText] = useState("");
  const [bestandText, setBestandText] = useState("");
  const speicherKva = lies(speicherText);
  const bestandKw = lies(bestandText);
  const summe = acSumme({ wrKva: kw, speicherKva, bestandKw });

  const einstufung = torTyp(summe, { hochspannung: hs });
  const typ = einstufung.typ === "–" ? null : einstufung.typ;
  const t = typ ? TYPEN[typ] : null;

  const hinweise = useMemo(() => {
    const h = [];
    if (summe > 100 && !hs)
      h.push({
        icon: Scale,
        titel: "Park- und Anlagenregler",
        text: "Verlangt der Netzbetreiber bei Netzebene 5 oder 6 die Messung für die Blindleistung auf der Mittelspannungsseite, ist ein Park- und Anlagenregler Pflicht, sobald die Summe der Engpassleistungen über 100 kVA (mit MS-Messung) bzw. 400 kVA (ohne) liegt.",
      });
    if (summe > 7)
      h.push({
        icon: AlertTriangle,
        titel: "Spitzenkappung nach § 101 ElWG",
        text: "Für neu angeschlossene oder erweiterte PV-Anlagen darf der Netzbetreiber die Einspeiseleistung auf bis zu 70 % der Modulspitzenleistung begrenzen – ausgenommen Anlagen bis 7 kW netzwirksamer Leistung.",
      });
    h.push({
      icon: Info,
      titel: "Maximalkapazität zählt",
      text: "Mehrere Einheiten und Speicher an einem Netzanschlusspunkt zählen zusammen. Die netzwirksame Leistung laut Vertrag ist eine andere Größe – genau die hält der Parkregler ein.",
    });
    return h;
  }, [summe, hs]);

  const setzeKw = (wert) => {
    const v = Math.min(100000, Math.max(0.5, wert));
    setKw(v);
    setEingabe(String(Math.round(v * 10) / 10).replace(".", ","));
  };

  const fill = (zuSchritt(kw) / 1000) * 100;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Eingabe */}
        <div className="flex flex-col gap-6 p-6 md:p-9">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Interaktiv · TOR-Typ-Finder</p>
            <h3 className="ov-h3 mt-2 text-ink-900">Welcher Anlagentyp ist Ihre Anlage?</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600">Maßgeblich ist die AC-Maximalkapazität der Gesamtanordnung am Netzanschlusspunkt – Wechselrichter, Speicher und bestehende Erzeugung zusammen, nicht die Modulleistung in kWp.</p>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <label htmlFor={`${id}-kw`} className="text-[14px] font-medium text-ink-700">
                Wechselrichterleistung AC (PV)
              </label>
              <span className="flex items-center gap-2">
                <input
                  aria-label="Wechselrichterleistung AC der PV in Kilowatt"
                  inputMode="decimal"
                  value={eingabe}
                  onChange={(e) => {
                    setEingabe(e.target.value);
                    const n = liesZahlDe(e.target.value);
                    if (Number.isFinite(n) && n > 0) setKw(Math.min(100000, n));
                  }}
                  className="ov-num h-12 w-28 rounded-xl border border-ink-200 bg-white px-3 text-right font-display text-[18px] font-extrabold text-ink-900 focus:border-ov-600 focus:shadow-[0_0_0_1px_#669933] focus:outline-none focus-visible:outline-none"
                />
                <span className="text-[14px] font-semibold text-ink-500">kW</span>
              </span>
            </div>
            <input
              id={`${id}-kw`}
              type="range"
              min={0}
              max={1000}
              value={zuSchritt(kw)}
              onChange={(e) => setzeKw(Math.round(zuKw(Number(e.target.value)) * 10) / 10)}
              aria-valuetext={fmt(kw)}
              className="ov-range mt-5 block cursor-pointer"
              style={{ "--ov-fill": `${fill}%` }}
            />
            <div className="mt-3 flex justify-between text-[11.5px] text-ink-500" aria-hidden="true">
              <span>0,5 kW</span>
              <span>250 kW</span>
              <span>35 MW</span>
              <span>100 MW</span>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
              Nur die Modulleistung bekannt? Als Richtwert kWp ÷ {zahl(DC_AC_VORSCHLAG, 2)} (übliches DC/AC-Verhältnis, Annahme) – maßgeblich ist das Datenblatt der Wechselrichter.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ZusatzFeld id={`${id}-sp`} label="Speicher-Wechselrichter AC" hinweis="optional, kVA" wert={speicherText} onChange={setSpeicherText} />
            <ZusatzFeld id={`${id}-be`} label="Bestehende Erzeugung" hinweis="optional, kW am selben Anschluss" wert={bestandText} onChange={setBestandText} />
          </div>

          <div className="flex flex-wrap gap-2">
            {BEISPIELE.map((b) => (
              <button
                key={b.l}
                type="button"
                onClick={() => setzeKw(b.kw)}
                className={cn(
                  "min-h-11 rounded-full px-3.5 text-[13px] font-semibold ring-1 transition-colors",
                  Math.round(kw) === b.kw ? "bg-navy-950 text-white ring-navy-950" : "bg-white text-ink-700 ring-ink-200 hover:ring-ov-300"
                )}
              >
                {b.l}
              </button>
            ))}
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/70">
            <input type="checkbox" checked={hs} onChange={(e) => setHs(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-ov-600" />
            <span className="text-[14.5px] leading-snug text-ink-700">
              <strong className="block text-ink-900">Netzanschluss auf 110 kV oder höher</strong>
              Dann gilt unabhängig von der Leistung Typ D.
            </span>
          </label>

        </div>

        {/* Ergebnis */}
        <div aria-live="polite" className="relative overflow-hidden bg-navy-950 p-6 text-white md:p-9">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ov-500/30 blur-[90px]" />
          <div className="relative">
            <div className="flex items-center gap-2" aria-hidden="true">
              {["A", "B", "C", "D"].map((k) => (
                <span
                  key={k}
                  className={cn(
                    "flex h-11 flex-1 items-center justify-center rounded-xl font-display text-[16px] font-extrabold transition-all duration-500",
                    k === typ ? "bg-ov-600 text-white shadow-[0_10px_30px_-8px_rgba(102,153,51,0.8)]" : "bg-white/[0.06] text-white/60 ring-1 ring-white/10"
                  )}
                >
                  {k}
                </span>
              ))}
            </div>

            {t ? (
              <div key={typ} className="ov-tab-panel">
                <p className="mt-7 text-[13px] text-white/60">
                  {speicherKva > 0 || bestandKw > 0 ? `AC-Summe ${fmt(summe)} (PV ${fmt(kw)}${speicherKva > 0 ? ` + Speicher ${fmt(speicherKva)}` : ""}${bestandKw > 0 ? ` + Bestand ${fmt(bestandKw)}` : ""})` : fmt(summe)}
                  {hs ? " · Anschluss ≥ 110 kV" : ""} ergibt
                </p>
                <p className="font-display text-[44px] font-extrabold leading-none tracking-tight md:text-[52px]">Typ {typ}</p>
                <p className="mt-2 text-[14px] text-white/65">
                  {t.grenze} · {t.netz}
                </p>
                {einstufung.knapp && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-sun-400/15 px-3.5 py-2.5 text-[13.5px] font-semibold text-sun-300 ring-1 ring-sun-400/30">
                    <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                    {einstufung.hinweis}
                  </p>
                )}
                <p className="mt-4 flex items-start gap-2 rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] text-white/80 ring-1 ring-white/10">
                  <FileText aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
                  {t.regelwerk}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {t.anforderungen.map((a) => (
                    <li key={a} className="flex gap-2.5 text-[14.5px] leading-snug text-white/85">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" strokeWidth={3} />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="ov-tab-panel">
                <p className="mt-7 font-display text-[28px] font-extrabold leading-tight">Unter der Schwelle für Typ A</p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70">Die Typeinteilung beginnt bei 0,8 kW Maximalkapazität. Welche Anforderungen gelten, klären Sie mit Ihrem Netzbetreiber.</p>
              </div>
            )}

            <Link href="/termin?art=video" className="mt-7 inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold text-ov-300 hover:text-ov-200">
              Anforderungen für Ihren Netzanschluss prüfen lassen
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="grid gap-5 border-t border-ink-100 bg-sand-50/60 px-6 py-6 md:grid-cols-3 md:px-9">
        {hinweise.map((h) => (
          <div key={h.titel} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-navy-700 ring-1 ring-ink-200/70">
              <h.icon aria-hidden="true" className="h-4 w-4" />
            </span>
            <p className="text-[13px] leading-relaxed text-ink-600">
              <strong className="block text-ink-900">{h.titel}</strong>
              {h.text}
            </p>
          </div>
        ))}
      </div>
      <p className="border-t border-ink-100 px-6 py-3.5 text-[12.5px] leading-relaxed text-ink-500 md:px-9">
        Quelle: E-Control, TOR Stromerzeugungsanlagen Typ A V1.4 und Typ B V1.3; Typeinteilung nach RfG-Schwellenwert-V. Vereinfachte Darstellung – verbindlich sind TOR, Netzanschlussvertrag und
        Ausführungsbestimmungen Ihres Netzbetreibers.
      </p>
    </div>
  );
}

/** Kleines optionales Zahlenfeld (Speicher-AC, Bestand) */
function ZusatzFeld({ id, label, hinweis, wert, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold leading-snug text-ink-700">
        {label}
        <span className="block text-[12px] font-normal text-ink-500">{hinweis}</span>
      </label>
      <input
        id={id}
        inputMode="decimal"
        placeholder="0"
        value={wert}
        onChange={(e) => onChange(e.target.value)}
        className="ov-num mt-1.5 h-12 w-full rounded-xl border border-ink-200 bg-white px-3 text-right font-display text-[16px] font-bold text-ink-900 focus:border-ov-600 focus:shadow-[0_0_0_1px_#669933] focus:outline-none focus-visible:outline-none"
      />
    </div>
  );
}
