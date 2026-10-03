"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, Zap } from "lucide-react";

import { berechne } from "@/lib/solarrechner";
import { ANNAHMEN, SCHICHTEN, zielgruppeGrenzen } from "@/data/solarrechner";
import useEnergyLive, { fmtCt } from "@/components/ui/useEnergyLive";
import { LiveDot } from "@/components/ui/LiveTicker";
import S01Zahl from "@/components/Startseite/s01-zahl";
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
 *
 * Gestaltung (Startseiten-Hero, Präfix s01 – Stile in Startseite/S01Hero.js):
 * Die Glaskarte setzt sich beim Laden zusammen (.s01-teil gestaffelt), die Ergebnisse
 * zählen einmal hoch, ein Lichtfleck folgt dem Zeiger, die Schichtwahl hat einen
 * gleitenden Schieber. Rechenlogik unverändert.
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
// Auftakt der Ergebniszahlen: zählen einmal hoch, sobald sich die Karte zusammengesetzt hat –
// nur bei frisch geladener Seite (spaetestens = ms seit Seitenaufruf), sonst kein Aufblitzen.
const AUFTAKT = { auftakt: true, verzoegerung: 250, auftaktDauer: 1300, spaetestens: 1100 };

export default function HeroGewerbeRechner() {
  const [flaeche, setFlaeche] = useState(FLAECHE.start);
  const [stufe, setStufe] = useState(MWH_START);
  const [schichten, setSchichten] = useState(2);
  const live = useEnergyLive();
  const karte = useRef(null);

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
  const schichtIndex = Math.max(0, SCHICHTEN.findIndex((s) => s.id === schichten));
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

  // Lichtfleck folgt dem Zeiger – nur CSS-Variablen, kein Re-Render
  const zeiger = (e) => {
    const el = karte.current;
    if (!el || e.pointerType === "touch") return;
    const b = el.getBoundingClientRect();
    el.style.setProperty("--s01-mx", `${Math.round(e.clientX - b.left)}px`);
    el.style.setProperty("--s01-my", `${Math.round(e.clientY - b.top)}px`);
  };

  return (
    <div ref={karte} onPointerMove={zeiger} className="s01-glas s01-karte relative overflow-hidden rounded-[28px] p-5 text-white sm:p-7">
      <div aria-hidden="true" className="s01-glanz pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="s01-kante pointer-events-none absolute inset-x-10 top-0 h-px" />
      <div className="relative">
        <div className="s01-teil flex items-start justify-between gap-3" style={{ "--i": 0 }}>
          <div>
            <p className="text-[13px] font-semibold text-ov-300">Richtwert-Rechner</p>
            <h2 className="mt-1.5 font-display text-[21px] font-bold leading-tight tracking-[-0.02em] sm:text-[23px]">Was bringt Ihr Hallendach?</h2>
          </div>
          {live?.preis?.aktuell && (
            <Link
              href="/energie-live"
              className="mt-0.5 flex min-h-8 shrink-0 items-center gap-1.5 rounded-full bg-white/[0.07] px-2.5 py-1 text-[12px] text-white/80 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/15"
              title="Börsenstrompreis Gebotszone AT, jetzt"
            >
              <LiveDot />
              <Zap aria-hidden="true" className="h-3 w-3 text-sun-400" />
              <span className="ov-num">{fmtCt(live.preis.aktuell.eurMwh)} ct</span>
            </Link>
          )}
        </div>

        {/* Dachfläche */}
        <div className="s01-teil mt-6" style={{ "--i": 1 }}>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="hero-flaeche" className="text-[13.5px] text-white/70">Nutzbare Dachfläche</label>
            <output htmlFor="hero-flaeche" aria-live="off" className="ov-num font-display text-[20px] font-extrabold tracking-[-0.02em]">
              {zahl(flaeche)} <span className="text-[13px] font-bold text-white/55">m²</span>
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
            className="ov-range s01-range mt-3"
            style={{ "--ov-fill": `${fillFlaeche}%` }}
          />
        </div>

        {/* Jahresverbrauch */}
        <div className="s01-teil mt-5" style={{ "--i": 2 }}>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="hero-verbrauch" className="text-[13.5px] text-white/70">Stromverbrauch pro Jahr</label>
            <output htmlFor="hero-verbrauch" aria-live="off" className="ov-num font-display text-[20px] font-extrabold tracking-[-0.02em]">
              {zahl(mwh)} <span className="text-[13px] font-bold text-white/55">MWh</span>
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
            className="ov-range s01-range mt-3"
            style={{ "--ov-fill": `${fillMwh}%` }}
          />
        </div>

        {/* Schichtbetrieb */}
        <fieldset className="s01-teil mt-5" style={{ "--i": 3 }}>
          <legend className="flex w-full items-baseline justify-between gap-3 text-[13.5px] text-white/70">
            <span>Schichtbetrieb</span>
            <span className="text-[12px] text-white/50">{schichten === 3 ? "7 Tage, rund um die Uhr" : `Mo–Fr, ${schicht?.zeit}`}</span>
          </legend>
          <div className="relative mt-2.5 grid grid-cols-3 rounded-full bg-white/[0.07] p-1 ring-1 ring-inset ring-white/10">
            <span
              aria-hidden="true"
              className="s01-schieber absolute bottom-1 left-1 top-1 rounded-full bg-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)]"
              style={{ transform: `translateX(${schichtIndex * 100}%)` }}
            />
            {SCHICHTEN.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={schichten === s.id}
                onClick={() => setSchichten(s.id)}
                className={`relative h-10 rounded-full text-[13px] font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ov-300 ${schichten === s.id ? "text-navy-950" : "text-white/75 hover:text-white"}`}
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
        <div className="s01-teil s01-ergebnis relative mt-6 overflow-hidden rounded-[20px] ring-1 ring-inset ring-white/10" style={{ "--i": 4 }}>
          <div className="flex items-end justify-between gap-4 px-4 pb-4 pt-4 sm:px-5">
            <div className="min-w-0">
              <p className="text-[12.5px] text-white/60">Ersparnis pro Jahr, ca.</p>
              <p className="ov-num mt-2 whitespace-nowrap font-display text-[36px] font-extrabold leading-none tracking-[-0.035em] sm:text-[44px]">
                <span className="s01-ergebnis-zahl">
                  <S01Zahl wert={ersparnis} {...AUFTAKT} />
                </span>
                <span className="ml-1.5 text-[0.6em] text-ov-300">€</span>
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[12.5px] text-white/60">Anlage</p>
              <p className="ov-num mt-2 whitespace-nowrap font-display text-[22px] font-extrabold leading-none tracking-[-0.02em]">
                <S01Zahl wert={kwp} {...AUFTAKT} /> <span className="text-[13px] font-bold text-white/55">kWp</span>
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-3 border-t border-white/10">
            <div className="px-3 py-3.5 sm:px-5">
              <dt className="text-[11.5px] text-white/55">Amortisation</dt>
              <dd className="ov-num mt-1 whitespace-nowrap font-display text-[17px] font-extrabold">
                {r.amortisationJahre ? (
                  <>
                    ~<S01Zahl wert={r.amortisationJahre} stellen={1} {...AUFTAKT} /> J.
                  </>
                ) : (
                  "–"
                )}
              </dd>
            </div>
            <div className="border-l border-white/10 px-3 py-3.5 sm:px-5">
              <dt className="text-[11.5px] text-white/55">CO₂ / Jahr</dt>
              <dd className="ov-num mt-1 whitespace-nowrap font-display text-[17px] font-extrabold">
                <S01Zahl wert={r.co2ProJahr / 1000} {...AUFTAKT} /> t
              </dd>
            </div>
            <div className="border-l border-white/10 px-3 py-3.5 sm:px-5">
              <dt className="text-[11.5px] text-white/55">Eigenverbrauch</dt>
              <dd className="ov-num mt-1 whitespace-nowrap font-display text-[17px] font-extrabold">
                <S01Zahl wert={eigen} {...AUFTAKT} /> %
              </dd>
              <div aria-hidden="true" className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div className="s01-eigen h-full origin-left rounded-full bg-gradient-to-r from-ov-500 to-ov-300" style={{ transform: `scaleX(${eigen / 100})` }} />
              </div>
            </div>
          </dl>
        </div>

        <div className="s01-teil mt-5 grid gap-2.5 sm:grid-cols-[1.35fr_1fr]" style={{ "--i": 5 }}>
          <Link
            href={angebot}
            className="group flex min-h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 py-3 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(102,153,51,0.9)] transition-all hover:bg-ov-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ov-300"
          >
            Angebot mit diesen Werten
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={detail}
            className="flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/10 hover:ring-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ov-300"
          >
            <Calculator aria-hidden="true" className="h-4 w-4 text-ov-300" />
            Detailrechnung
          </Link>
        </div>
        <p className="s01-teil mt-4 text-[11.5px] leading-snug text-white/45" style={{ "--i": 6 }}>
          Richtwert, netto: aufgeständertes Flachdach ({zahl(ANNAHMEN.qmProKwpFlachdach)} m²/kWp{gedeckelt ? `, gedeckelt bei ${zahl(GRENZEN.kwp.max)} kWp` : ""}), ohne Speicher und Förderung.
        </p>
      </div>
    </div>
  );
}
