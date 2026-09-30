"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleAlert, Info } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { Auswahl, Regler } from "@/components/Rechner/bausteine";
import { OEMAG_MONATE, OEMAG_REGELN } from "@/data/oemag";
import { ctText, dezimal, erloesSzenarien, euroText, monatLabel, werteImZeitraum, zahlAusText } from "@/lib/einspeisung";

/**
 * Rechner „Erlös pro Jahr“: Überschussmenge × Preis je Vermarktungsweg, auf Basis der
 * veröffentlichten Monatswerte (OeMAG-Marktpreis, Referenzmarktwert PV der E-Control),
 * gewichtet mit dem PV-Profil. Rechenkern: erloesSzenarien in @/lib/einspeisung.
 * Keine Prognose, kein Anbieter-Ranking.
 */

const BEISPIELE = [25000, 100000, 400000, 1000000];
const LETZTE12 = werteImZeitraum(OEMAG_MONATE, "12m");
const ZEITRAEUME = [
  { id: "12m", label: "Letzte 12 Monate", sub: `${monatLabel(LETZTE12[0].monat, true)} – ${monatLabel(LETZTE12[LETZTE12.length - 1].monat, true)}` },
  { id: "2025", label: "Jahr 2025", sub: "Jän – Dez" },
  { id: "2024", label: "Jahr 2024", sub: "Jän – Dez" },
];

const TITEL = {
  oemag: "OeMAG-Marktpreis",
  spot: "Direktvermarktung Spot",
  eigen: "Ihr Vergleichswert",
};
const UNTER = {
  oemag: "Monatswerte mit PV-Profil gewichtet",
  spot: "Referenzmarktwert PV minus Entgelt – Richtwert",
  eigen: "Angebot eines Versorgers, Vermarkters oder PPA",
};

function Feld({ label, hinweis, einheit, wert, onChange, placeholder }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14.5px] font-semibold text-ink-800">
        {label}
      </label>
      <div className="flex items-center overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200 focus-within:ring-2 focus-within:ring-ov-500">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={wert}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hinweis ? `${id}-h` : undefined}
          className="ov-num min-w-0 flex-1 bg-transparent px-4 py-3 font-display text-[18px] font-bold text-ink-900 outline-none placeholder:font-sans placeholder:text-[15px] placeholder:font-normal placeholder:text-ink-400"
        />
        <span className="shrink-0 pr-4 text-[14px] font-semibold text-ink-500">{einheit}</span>
      </div>
      {hinweis && (
        <p id={`${id}-h`} className="mt-1.5 text-[12.5px] leading-snug text-ink-500">
          {hinweis}
        </p>
      )}
    </div>
  );
}

export default function ErloesRechner() {
  const [kwhText, setKwhText] = useState("100.000");
  const [kwpText, setKwpText] = useState("250");
  const [zeitraum, setZeitraum] = useState("12m");
  const [entgelt, setEntgelt] = useState(0.5);
  const [eigenText, setEigenText] = useState("");

  const kwh = Math.min(50_000_000, Math.max(0, zahlAusText(kwhText) || 0));
  const kwp = Math.max(0, zahlAusText(kwpText) || 0);
  const eigenCt = zahlAusText(eigenText);

  const szenarien = useMemo(
    () => erloesSzenarien({ kwh, kwp, zeitraum, entgelt, eigenCt: Number.isFinite(eigenCt) ? eigenCt : null }),
    [kwh, kwp, zeitraum, entgelt, eigenCt]
  );
  const maxEur = Math.max(1, ...szenarien.filter((s) => s.moeglich).map((s) => Math.max(s.eur, s.bis || 0)));
  const oemag = szenarien.find((s) => s.id === "oemag");

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_50px_100px_-60px_rgba(3,18,43,0.6)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Eingaben */}
        <div className="space-y-7 p-6 sm:p-8 md:p-10">
          <div>
            <Feld
              label="Überschuss, der pro Jahr eingespeist wird"
              einheit="kWh"
              wert={kwhText}
              onChange={setKwhText}
              placeholder="z. B. 100.000"
              hinweis="Aus der Jahresabrechnung des Netzbetreibers oder dem Smart-Meter-Portal (Einspeisezählpunkt)."
            />
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Beispielmengen">
              {BEISPIELE.map((b) => {
                const aktiv = kwh === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setKwhText(dezimal(b))}
                    aria-pressed={aktiv}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-[13px] font-semibold ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500",
                      aktiv ? "bg-navy-950 text-white ring-navy-950" : "bg-sand-50 text-ink-700 ring-ink-200 hover:bg-white"
                    )}
                  >
                    {dezimal(b)} kWh
                  </button>
                );
              })}
            </div>
          </div>

          <Feld
            label="Leistung der PV-Anlage"
            einheit="kWp"
            wert={kwpText}
            onChange={setKwpText}
            placeholder="z. B. 250"
            hinweis={`Die OeMAG nimmt nur Anlagen unter ${dezimal(OEMAG_REGELN.grenzeKwp)} kWp ab.`}
          />

          <Auswahl legende="Preisbasis (veröffentlichte Monatswerte)" optionen={ZEITRAEUME} wert={zeitraum} onChange={setZeitraum} klein />

          <Regler
            label="Vermarktungsentgelt Direktvermarktung (Annahme)"
            wert={entgelt}
            min={0}
            max={2}
            step={0.1}
            onChange={setEntgelt}
            format={(v) => `${dezimal(v, 1)} ct/kWh`}
            hinweis="Zum Durchspielen – das tatsächliche Entgelt steht im Angebot des Direktvermarkters."
          />

          <Feld
            label="Eigener Vergleichswert (optional)"
            einheit="ct/kWh"
            wert={eigenText}
            onChange={setEigenText}
            placeholder="z. B. Angebot Ihres Versorgers"
            hinweis="Netto-Preis aus einem Angebot eintragen – etwa Einspeisetarif, Fixpreis oder PPA."
          />
        </div>

        {/* Ergebnis */}
        <div className="relative flex flex-col bg-navy-950 p-6 text-white sm:p-8 md:p-10">
          <div aria-hidden="true" className="ov-grid-bg pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-ov-500/25 blur-[100px]" />
          <div className="relative">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Erlös pro Jahr, netto</p>
            <p className="mt-2 text-[14px] text-white/65">
              für <strong className="ov-num text-white">{dezimal(kwh)} kWh</strong> Überschuss ·{" "}
              {ZEITRAEUME.find((z) => z.id === zeitraum)?.label}
            </p>

            <ul className="mt-6 space-y-3" aria-live="polite">
              {szenarien.map((s) => (
                <li key={s.id} className={cn("rounded-2xl p-4 ring-1 md:p-5", s.moeglich ? "bg-white/[0.06] ring-white/10" : "bg-white/[0.03] ring-white/5")}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="font-display text-[16.5px] font-bold">{TITEL[s.id]}</p>
                    {s.moeglich ? (
                      <p className="ov-num font-display text-[24px] font-extrabold leading-none tracking-tight md:text-[28px]">{euroText(s.eur)}</p>
                    ) : (
                      <p className="text-[13.5px] font-semibold text-sun-300">nicht möglich</p>
                    )}
                  </div>
                  <p className="mt-1 text-[12.5px] text-white/55">{UNTER[s.id]}</p>
                  {s.moeglich ? (
                    <>
                      <span aria-hidden="true" className="mt-3 block h-2 overflow-hidden rounded-full bg-white/10">
                        <span
                          className={cn("block h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", s.id === "oemag" ? "bg-gradient-to-r from-ov-300 to-ov-500" : s.id === "spot" ? "bg-navy-300" : "bg-sun-400")}
                          style={{ width: `${Math.max(2, (Math.max(0, s.eur) / maxEur) * 100)}%` }}
                        />
                      </span>
                      <p className="mt-2 text-[13px] text-white/70">
                        <span className="ov-num font-semibold text-white">{ctText(s.ct, 2)} ct/kWh</span>
                        {s.id === "oemag" && s.min && (
                          <>
                            {" "}
                            · Monatswerte {ctText(s.min.ct, 2)} ({monatLabel(s.min.monat, true)}) bis {ctText(s.max.ct, 2)} ct ({monatLabel(s.max.monat, true)})
                          </>
                        )}
                        {s.id === "spot" && <> · Markt {ctText(s.brutto, 2)} ct minus {dezimal(entgelt, 1)} ct</>}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 flex gap-2 text-[13px] leading-relaxed text-white/70">
                      <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" />
                      Ab {dezimal(OEMAG_REGELN.grenzeKwp)} kWp besteht keine Abnahmepflicht der OeMAG – Direktvermarktung, PPA oder Marktprämie prüfen.
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {oemag?.moeglich && kwh > 0 && (
              <p className="mt-4 text-[13px] leading-relaxed text-white/60">
                Gleiche Menge nur mit dem schwächsten bzw. stärksten Monatswert: {euroText(oemag.von)} bis {euroText(oemag.bis)} pro Jahr.
              </p>
            )}
          </div>

          <div className="relative mt-auto pt-7">
            <p className="flex gap-2 rounded-2xl bg-white/[0.05] p-4 text-[12.5px] leading-relaxed text-white/60 ring-1 ring-white/10">
              <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
              Rückblick mit veröffentlichten Werten, keine Prognose. Die Monatsgewichtung folgt dem PV-Ertragsprofil (PVGIS, Ostermiething). Der
              Referenzmarktwert ist ein österreichweiter Durchschnitt; Direktvermarkter rechnen mit Ihrem Viertelstundenprofil ab.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/angebot?objekt=gewerbe"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-500 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Zählwerte prüfen lassen
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/rechner/gewerbe-pv"
                className="inline-flex h-12 items-center justify-center rounded-full px-5 text-[15px] font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Überschuss schätzen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
