"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, Zap } from "lucide-react";

import { berechne } from "@/lib/solarrechner";
import { ANNAHMEN, SCHICHTEN, zielgruppeGrenzen } from "@/data/solarrechner";
import useEnergyLive, { fmtCt } from "@/components/ui/useEnergyLive";
import { LiveDot } from "@/components/ui/LiveTicker";
import AnimZahl from "./AnimZahl";
import { zahlText } from "@/data/kennzahlen";

/**
 * Live-Mini-Rechner im Startseiten-Hero: „Was bringt Ihr Hallendach?“
 * Drei Eingaben (Dachfläche, Jahresverbrauch, Schichtbetrieb) → Anlagengröße,
 * Ersparnis, Amortisation und CO₂. Rechenkern ist der Solarrechner
 * (`berechne`, Zielgruppe „gewerbe“: stündliche Jahressimulation mit
 * Betriebs-Lastprofil, Preise netto). Annahmen wie im Solarrechner:
 * aufgeständertes Flachdach (Süd, flach), 7 m² Dach je kWp, ohne Speicher und
 * ohne Förderung. Richtwert – die Detailrechnung (/rechner/gewerbe-pv) rechnet
 * mit Standort, Dachart, Speicher, EAG-Zuschuss und IFB.
 */

const GRENZEN = zielgruppeGrenzen("gewerbe");
const FLAECHE = { min: 500, max: 15000, step: 250, start: 4000 };
// Jahresverbrauch in MWh – nichtlineare Stufen, damit 50 MWh und 5 GWh am selben Regler gut greifbar sind
const MWH_STUFEN = [50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1250, 1500, 2000, 2500, 3000, 4000, 5000];
const MWH_START = MWH_STUFEN.indexOf(400);
// Schichtmodell → Betriebstage im Lastprofil (3 Schichten = rund um die Uhr, 7 Tage)
const BETRIEBSTAGE = { 1: 5, 2: 5, 3: 7 };

// Tausenderpunkt ohne Intl – Server und Browser formatieren identisch (keine Hydration-Unterschiede)
const zahl = (n) => zahlText(Math.round(n));
// Eine Nachkommastelle mit Komma (österreichische Schreibweise)
const zahl1 = (n) => {
  const [ganz, rest] = (Math.round(n * 10) / 10).toFixed(1).split(".");
  return `${zahlText(ganz)},${rest}`;
};
// So lange wartet die Ansage nach der letzten Reglerbewegung – Screenreader hören
// eine Zusammenfassung statt jedes Zwischenschritts der Zahlenanimation.
const ANSAGE_VERZOEGERUNG = 1200;

export default function HeroGewerbeRechner() {
  const [flaeche, setFlaeche] = useState(FLAECHE.start);
  const [stufe, setStufe] = useState(MWH_START);
  const [schichten, setSchichten] = useState(2);
  const live = useEnergyLive();

  const mwh = MWH_STUFEN[stufe];
  const kwpRoh = flaeche / ANNAHMEN.qmProKwpFlachdach;
  const kwp = Math.min(Math.max(Math.round(kwpRoh / 5) * 5, GRENZEN.kwp.min), GRENZEN.kwp.max);
  const gedeckelt = kwpRoh > GRENZEN.kwp.max;

  // Regler bleiben flüssig: die Jahressimulation läuft mit zurückgestellter Eingabe
  const eingabe = useDeferredValue(`${kwp}|${mwh}|${schichten}`);
  const r = useMemo(() => {
    const [k, m, s] = eingabe.split("|").map(Number);
    return berechne({
      kwp: k,
      ausrichtung: "sued",
      neigung: "flach",
      verbrauch: m * 1000,
      speicherKwh: 0,
      zielgruppe: "gewerbe",
      betriebstage: BETRIEBSTAGE[s],
      schichten: s,
    });
  }, [eingabe]);

  const fillFlaeche = ((flaeche - FLAECHE.min) / (FLAECHE.max - FLAECHE.min)) * 100;
  const fillMwh = (stufe / (MWH_STUFEN.length - 1)) * 100;
  const schicht = SCHICHTEN.find((s) => s.id === schichten);
  const angebot = `/angebot?objekt=gewerbe&verbrauch=${mwh * 1000}&kwp=${kwp}`;
  const detail = `/rechner/gewerbe-pv?flaeche=${flaeche}&verbrauch=${mwh}&schichten=${schichten}`;
  const eigen = Math.round(r.eigenverbrauchsquote * 100);
  const ersparnis = Math.round(r.nutzenProJahr / 100) * 100;

  // Ruhige Live-Region: nur eine Ansage, wenn die Eingaben zur Ruhe gekommen sind;
  // der erste Stand wird nicht angesagt (steht ohnehin sichtbar da).
  const zusammenfassung = `Richtwert: Anlage ${zahl(kwp)} kWp, Ersparnis ca. ${zahl(ersparnis)} Euro pro Jahr, ${
    r.amortisationJahre ? `Amortisation ca. ${zahl1(r.amortisationJahre)} Jahre, ` : ""
  }Eigenverbrauch ${eigen} Prozent.`;
  const [ansage, setAnsage] = useState("");
  const [erstAnsage, setErstAnsage] = useState(zusammenfassung);
  useEffect(() => {
    if (zusammenfassung === erstAnsage) return undefined;
    const t = setTimeout(() => {
      setAnsage(zusammenfassung);
      setErstAnsage(null);
    }, ANSAGE_VERZOEGERUNG);
    return () => clearTimeout(t);
  }, [zusammenfassung, erstAnsage]);

  return (
    <div className="ov-glass relative overflow-hidden rounded-[2rem] p-5 text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.65)] sm:p-6 md:p-8">
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ov-400/30 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-sun-400/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-[19px] font-bold leading-tight">Was bringt Ihr Hallendach?</h2>
          {live?.preis?.aktuell && (
            <Link
              href="/energie-live"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[12px] text-white/80 hover:bg-white/15"
              title="Börsenstrompreis Gebotszone AT, jetzt"
            >
              <LiveDot />
              <Zap aria-hidden="true" className="h-3 w-3 text-sun-400" />
              <span className="ov-num">{fmtCt(live.preis.aktuell.eurMwh)} ct</span>
            </Link>
          )}
        </div>

        {/* Dachfläche */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="hero-flaeche" className="text-[13.5px] text-white/70">Nutzbare Dachfläche</label>
            <output htmlFor="hero-flaeche" aria-live="off" className="ov-num font-display text-[21px] font-extrabold">
              {zahl(flaeche)} <span className="text-[13.5px] font-bold text-white/60">m²</span>
            </output>
          </div>
          <input
            id="hero-flaeche"
            type="range"
            min={FLAECHE.min}
            max={FLAECHE.max}
            step={FLAECHE.step}
            value={flaeche}
            onChange={(e) => setFlaeche(Number(e.target.value))}
            aria-valuetext={`${zahl(flaeche)} Quadratmeter`}
            className="ov-range mt-3"
            style={{ "--ov-fill": `${fillFlaeche}%` }}
          />
        </div>

        {/* Jahresverbrauch */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="hero-verbrauch" className="text-[13.5px] text-white/70">Stromverbrauch pro Jahr</label>
            <output htmlFor="hero-verbrauch" aria-live="off" className="ov-num font-display text-[21px] font-extrabold">
              {zahl(mwh)} <span className="text-[13.5px] font-bold text-white/60">MWh</span>
            </output>
          </div>
          <input
            id="hero-verbrauch"
            type="range"
            min={0}
            max={MWH_STUFEN.length - 1}
            step={1}
            value={stufe}
            onChange={(e) => setStufe(Number(e.target.value))}
            aria-valuetext={`${zahl(mwh)} Megawattstunden`}
            className="ov-range mt-3"
            style={{ "--ov-fill": `${fillMwh}%` }}
          />
        </div>

        {/* Schichtbetrieb */}
        <fieldset className="mt-5">
          <legend className="flex w-full items-baseline justify-between gap-3 text-[13.5px] text-white/70">
            <span>Schichtbetrieb</span>
            <span className="text-[12px] text-white/50">{schichten === 3 ? "7 Tage, rund um die Uhr" : `Mo–Fr, ${schicht?.zeit}`}</span>
          </legend>
          <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-full bg-white/10 p-1">
            {SCHICHTEN.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={schichten === s.id}
                onClick={() => setSchichten(s.id)}
                className={`h-9 rounded-full text-[13px] font-semibold transition-all ${schichten === s.id ? "bg-white text-navy-950 shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Ergebnis – bewusst ohne aria-live: die animierten Zahlen würden sonst bei jedem Zwischenwert angesagt */}
        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {ansage}
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl bg-navy-950/45 ring-1 ring-white/10">
          <div className="flex items-end justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <p className="text-[12.5px] text-white/60">Ersparnis pro Jahr, ca.</p>
              <p className="ov-num whitespace-nowrap font-display text-[34px] font-extrabold leading-none tracking-tight text-ov-300 sm:text-[40px]">
                <AnimZahl wert={ersparnis} /> €
              </p>
            </div>
            <div className="text-right">
              <p className="text-[12.5px] text-white/60">Anlage</p>
              <p className="ov-num whitespace-nowrap font-display text-[22px] font-extrabold leading-none">
                <AnimZahl wert={kwp} /> <span className="text-[14px] text-white/60">kWp</span>
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-3 divide-x divide-white/10">
            <div className="px-3 py-3 sm:px-4">
              <dt className="text-[11.5px] text-white/55">Amortisation</dt>
              <dd className="ov-num mt-0.5 font-display text-[17px] font-extrabold">
                {r.amortisationJahre ? <>~<AnimZahl wert={r.amortisationJahre} stellen={1} /> J.</> : "–"}
              </dd>
            </div>
            <div className="px-3 py-3 sm:px-4">
              <dt className="text-[11.5px] text-white/55">CO₂ / Jahr</dt>
              <dd className="ov-num mt-0.5 font-display text-[17px] font-extrabold">
                <AnimZahl wert={r.co2ProJahr / 1000} /> t
              </dd>
            </div>
            <div className="px-3 py-3 sm:px-4">
              <dt className="text-[11.5px] text-white/55">Eigenverbrauch</dt>
              <dd className="ov-num mt-0.5 font-display text-[17px] font-extrabold">
                <AnimZahl wert={eigen} /> %
              </dd>
            </div>
          </dl>
          <div className="px-4 pb-4 sm:px-5" aria-hidden="true">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-ov-500 to-ov-300 transition-[width] duration-700" style={{ width: `${eigen}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-[1.35fr_1fr]">
          <Link
            href={angebot}
            className="group flex min-h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 py-3 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(102,153,51,0.9)] transition-all hover:bg-ov-500"
          >
            Angebot mit diesen Werten
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={detail}
            className="flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/10 hover:ring-white/50"
          >
            <Calculator aria-hidden="true" className="h-4 w-4 text-ov-300" />
            Detailrechnung
          </Link>
        </div>
        <p className="mt-3.5 text-[11.5px] leading-snug text-white/45">
          Richtwert, netto: aufgeständertes Flachdach ({zahl(ANNAHMEN.qmProKwpFlachdach)} m²/kWp{gedeckelt ? `, gedeckelt bei ${zahl(GRENZEN.kwp.max)} kWp` : ""}), ohne Speicher und Förderung.
        </p>
      </div>
    </div>
  );
}
