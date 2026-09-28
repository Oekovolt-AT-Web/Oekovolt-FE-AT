"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Coins, LayoutGrid, Sun, Wrench } from "lucide-react";
import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";
import { VERGUETUNG } from "@/data/einspeiseverguetung";

/**
 * Kostenaufschlüsselung je Anlagengröße.
 * Gesamtpreise kommen aus DERSELBEN Quelle wie Solarrechner und Ratgeber
 * „Solaranlage Kosten“ (@/data/solarrechner) – die Seiten zeigen nie
 * unterschiedliche Zahlen. Die Aufteilung auf Kostenblöcke ist ein
 * vereinfachtes Modell (Fixkosten + größenabhängige Anteile) zur Orientierung.
 */

// Größenunabhängige Kosten (€): Gerüst/Anfahrt, Planung/Anmeldung, Grundanteil Elektro
const FIX = { geruest: 1200, planung: 600, elektro: 700 };
const FIX_SUMME = FIX.geruest + FIX.planung + FIX.elektro;
// Größenabhängiger Rest wird so aufgeteilt
const VARIABEL = { module: 0.4, wechselrichter: 0.16, unterkonstruktion: 0.13, montage: 0.19, elektro: 0.12 };

const BLOECKE = [
  { k: "module", label: "Solarmodule", farbe: "#003473" },
  { k: "wechselrichter", label: "Wechselrichter", farbe: "#1f5aa1" },
  { k: "unterkonstruktion", label: "Unterkonstruktion", farbe: "#7fa7d6" },
  { k: "montage", label: "Montage", farbe: "#669933" },
  { k: "elektro", label: "Elektroinstallation", farbe: "#8cba58" },
  { k: "geruest", label: "Gerüst & Anfahrt", farbe: "#cde3b1" },
  { k: "planung", label: "Planung & Anmeldung", farbe: "#c4cad5" },
];
const SPEICHER_FARBE = "#ffc53d";

const SPEICHER_OPTIONEN = [0, 5, 8, 10, 15];
const SCHNELLWAHL = [5, 8, 10, 15, 20, 30];

const eur = (n) => `${(Math.round(n / 10) * 10).toLocaleString("de-DE")} €`;
const zahl = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

/** Gewichteter Einspeise-Rechensatz (OeMAG-Marktpreis) über die Größenklassen */
function mischsatz(kwp) {
  let rest = kwp;
  let summe = 0;
  for (const s of VERGUETUNG.saetze) {
    const anteil = Math.max(0, Math.min(rest, s.bis - s.von));
    summe += anteil * s.teileinspeisung;
    rest -= anteil;
    if (rest <= 0) break;
  }
  return summe / kwp;
}

function aufteilung(kwp) {
  const gesamt = kwp * preisProKwp(kwp);
  const variabel = Math.max(gesamt - FIX_SUMME, 0);
  return {
    gesamt,
    module: variabel * VARIABEL.module,
    wechselrichter: variabel * VARIABEL.wechselrichter,
    unterkonstruktion: variabel * VARIABEL.unterkonstruktion,
    montage: variabel * VARIABEL.montage,
    elektro: variabel * VARIABEL.elektro + FIX.elektro,
    geruest: FIX.geruest,
    planung: FIX.planung,
  };
}

export default function KostenAufschluesselung() {
  const [kwp, setKwp] = useState(10);
  const [speicher, setSpeicher] = useState(8);
  const sliderId = useId();

  const a = useMemo(() => aufteilung(kwp), [kwp]);
  const speicherKosten = speicher * ANNAHMEN.speicherPreisProKwh;
  const summe = a.gesamt + speicherKosten;
  const teile = [...BLOECKE.map((b) => ({ ...b, wert: a[b.k] })), ...(speicher ? [{ k: "speicher", label: `Speicher ${speicher} kWh`, farbe: SPEICHER_FARBE, wert: speicherKosten }] : [])];

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      {/* Steuerung */}
      <div className="grid grid-cols-1 gap-8 border-b border-ink-100 p-6 md:p-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={sliderId} className="text-[15px] font-semibold text-ink-900">
              Anlagengröße
            </label>
            <p className="font-display text-[26px] font-extrabold tracking-tight text-ink-900">
              <span className="ov-num">{kwp}</span> <span className="text-[16px] font-semibold text-ink-500">kWp</span>
            </p>
          </div>
          <input
            id={sliderId}
            type="range"
            min={4}
            max={30}
            step={1}
            value={kwp}
            onChange={(e) => setKwp(Number(e.target.value))}
            aria-valuetext={`${kwp} Kilowatt-Peak`}
            className="mt-2 h-11 w-full cursor-pointer accent-ov-500"
          />
          <div className="flex justify-between text-[12px] text-ink-500" aria-hidden="true">
            <span>4 kWp</span>
            <span>30 kWp</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Schnellauswahl Anlagengröße">
            {SCHNELLWAHL.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setKwp(g)}
                aria-pressed={kwp === g}
                className={`h-11 min-w-[4.25rem] rounded-full px-3 text-[14px] font-semibold transition-all ${
                  kwp === g ? "bg-ink-900 text-white" : "bg-ink-50 text-ink-700 ring-1 ring-ink-200 hover:ring-ov-300"
                }`}
              >
                {g} kWp
              </button>
            ))}
          </div>
        </div>

        <div>
          <p id={`${sliderId}-sp`} className="text-[15px] font-semibold text-ink-900">Stromspeicher</p>
          <div role="group" aria-labelledby={`${sliderId}-sp`} className="mt-3 grid grid-cols-5 gap-1 rounded-2xl bg-ink-100 p-1">
            {SPEICHER_OPTIONEN.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={speicher === s}
                onClick={() => setSpeicher(s)}
                className={`h-11 whitespace-nowrap rounded-xl px-0.5 text-[13px] font-semibold sm:text-[13.5px] transition-all duration-300 ${
                  speicher === s ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"
                }`}
              >
                {s === 0 ? "ohne" : `${s} kWh`}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-500">
            Faustregel: rund 1 kWh Speicher je 1.000 kWh Jahresverbrauch. Richtwert {zahl(ANNAHMEN.speicherPreisProKwh)} € je kWh bei gemeinsamer Installation.
          </p>
        </div>
      </div>

      {/* Ergebnis */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr]">
        <div className="p-6 md:p-8">
          <p className="text-[13px] font-medium text-ink-500">Richtpreis schlüsselfertig (brutto inkl. 20 % USt.)</p>
          <p className="mt-1 font-display text-[clamp(2.4rem,1.8rem+2.4vw,3.6rem)] font-extrabold leading-none tracking-tight text-ink-900" aria-live="polite">
            <span className="ov-num">≈ {eur(summe)}</span>
          </p>
          <p className="mt-3 text-[14.5px] text-ink-600">
            <span className="ov-num font-semibold text-ink-800">{eur(preisProKwp(kwp))}</span> je kWp für die Anlage
            {speicher > 0 && (
              <>
                {" "}· Speicher <span className="ov-num font-semibold text-ink-800">{eur(speicherKosten)}</span>
              </>
            )}
          </p>

          {/* Gestapelter Balken */}
          <div className="mt-7 flex h-5 w-full overflow-hidden rounded-full bg-ink-100" role="img" aria-label={`Kostenaufteilung: ${teile.map((t) => `${t.label} ${Math.round((t.wert / summe) * 100)} Prozent`).join(", ")}`}>
            {teile.map((t) => (
              <div
                key={t.k}
                className="h-full border-r-2 border-white last:border-r-0"
                style={{ width: `${(t.wert / summe) * 100}%`, background: t.farbe, transition: "width 500ms cubic-bezier(.22,1,.36,1)" }}
              />
            ))}
          </div>

          <ul className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {teile.map((t) => (
              <li key={t.k} className="flex items-center gap-3 border-b border-ink-100 py-2.5 text-[14.5px]">
                <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[4px]" style={{ background: t.farbe }} />
                <span className="min-w-0 flex-1 leading-snug text-ink-700">{t.label}</span>
                <span className="ov-num w-9 shrink-0 text-right text-[13px] text-ink-500">{Math.round((t.wert / summe) * 100)} %</span>
                <span className="ov-num w-[4.6rem] shrink-0 text-right font-semibold text-ink-900">{eur(t.wert)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-px border-t border-ink-100 bg-ink-100 lg:border-l lg:border-t-0">
          <Kachel icon={LayoutGrid} label="Dachfläche" wert={`ca. ${zahl(kwp * ANNAHMEN.qmProKwp)} m²`} />
          <Kachel icon={Sun} label="Jahresertrag (Süd)" wert={`ca. ${zahl(kwp * ANNAHMEN.ertragProKwpSued)} kWh`} />
          <Kachel icon={Coins} label="Einspeiseerlös (Marktpreis)" wert={`${zahl(mischsatz(kwp), 2)} ct/kWh`} hinweis={`Stand ${VERGUETUNG.gueltigAbLabel}`} />
          <Kachel icon={Wrench} label="Laufende Kosten" wert={`ca. ${zahl(kwp * ANNAHMEN.betriebskostenProKwp)} €/Jahr`} hinweis="Versicherung, Wartung, Zähler" />
          <div className="col-span-2 flex flex-col justify-center gap-3 bg-sand-50 p-5 md:p-6">
            <p className="text-[14px] leading-relaxed text-ink-600">Was bringt Ihnen diese Größe konkret? Ersparnis und Amortisation rechnen Sie im Solarrechner durch.</p>
            <Link href="/solarrechner" className="group inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Ertrag & Ersparnis berechnen
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <p className="border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        Orientierung, kein Angebot. Richtwerte Stand 2026 für ein Schrägdach mit normaler Zugänglichkeit; die Aufteilung auf Kostenblöcke ist vereinfacht modelliert.
        Dachform, Eindeckung, Zählerschrank und Komponentenwahl verändern den Preis. Mehr dazu im Ratgeber{" "}
        <Link href="/ratgeber/solaranlage-kosten" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
          Was kostet eine Solaranlage?
        </Link>
      </p>
    </div>
  );
}

function Kachel({ icon: Icon, label, wert, hinweis }) {
  return (
    <div className="bg-white p-5 md:p-6">
      <p className="flex items-center gap-2 text-[13px] text-ink-500">
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600" />
        {label}
      </p>
      <p className="ov-num mt-1.5 font-display text-[19px] font-extrabold leading-tight tracking-tight text-ink-900 md:text-[22px]">{wert}</p>
      {hinweis && <p className="mt-1 text-[12px] text-ink-500">{hinweis}</p>}
    </div>
  );
}
