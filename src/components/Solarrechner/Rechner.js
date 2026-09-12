"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Battery, Compass, Gauge, Home, Leaf, Sun } from "lucide-react";

import { AUSRICHTUNGEN, NEIGUNGEN, ANNAHMEN } from "@/data/solarrechner";
import { berechne, empfohlenerSpeicher } from "@/lib/solarrechner";

const eur = (n) =>
  n.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + " €";
const kwh = (n) => n.toLocaleString("de-DE", { maximumFractionDigits: 0 });
const pct = (n) => Math.round(n * 100) + " %";

/** Beschrifteter Schieberegler mit sichtbarem Wert. */
function Regler({ label, wert, min, max, step, einheit, onChange, hinweis }) {
  const id = useId();
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[15px] font-medium text-gray-900">
          {label}
        </label>
        <output
          htmlFor={id}
          className="text-[15px] font-semibold tabular-nums text-[#669933]"
        >
          {wert.toLocaleString("de-DE")} {einheit}
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
        className="ov-slider w-full"
      />
      {hinweis && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">{hinweis}</p>
      )}
    </div>
  );
}

/** Auswahl als Pill-Gruppe – zugänglich über echte Radio-Inputs. */
function PillGruppe({ legende, optionen, wert, onChange, name }) {
  return (
    <fieldset>
      <legend className="mb-2 text-[15px] font-medium text-gray-900">
        {legende}
      </legend>
      <div className="flex flex-wrap gap-2">
        {optionen.map((o) => {
          const aktiv = wert === o.id;
          return (
            <label
              key={o.id}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-[14px] transition-colors ${
                aktiv
                  ? "border-[#669933] bg-[#f0f7e6] font-semibold text-[#669933]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={aktiv}
                onChange={() => onChange(o.id)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Kennzahl({ icon: Icon, label, wert, zusatz, hervorgehoben, kompakt }) {
  return (
    <div
      className={`rounded-xl p-5 ${
        hervorgehoben
          ? "bg-[#669933] text-white"
          : "border border-gray-100 bg-white shadow-sm"
      }`}
    >
      <p
        className={`mb-1 flex items-center gap-2 text-[13px] font-medium ${
          hervorgehoben ? "text-white/80" : "text-gray-500"
        }`}
      >
        <Icon aria-hidden="true" className="h-4 w-4" />
        {label}
      </p>
      <p
        className={`font-semibold leading-tight tabular-nums ${
          // In den schmalen Zwei-Spalten-Kacheln wuerden 26px umbrechen
          // ("6.000 kWh") und unten abgeschnitten - dort kleiner setzen.
          kompakt ? "text-[20px] md:text-[22px]" : "text-[26px]"
        } ${hervorgehoben ? "text-white" : "text-gray-900"}`}
      >
        {wert}
      </p>
      {zusatz && (
        <p
          className={`mt-1 text-[13px] ${
            hervorgehoben ? "text-white/80" : "text-gray-500"
          }`}
        >
          {zusatz}
        </p>
      )}
    </div>
  );
}

/** Anteilsbalken für Autarkie / Eigenverbrauch. */
function Balken({ label, anteil, beschriftung }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[14px] text-gray-700">{label}</span>
        <span className="text-[14px] font-semibold tabular-nums text-gray-900">
          {beschriftung}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
        role="img"
        aria-label={`${label}: ${beschriftung}`}
      >
        <div
          className="h-full rounded-full bg-[#669933] motion-safe:transition-[width] motion-safe:duration-300"
          style={{ width: `${Math.min(anteil * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function Solarrechner() {
  const [kwp, setKwp] = useState(10);
  const [ausrichtung, setAusrichtung] = useState("sued");
  const [neigung, setNeigung] = useState("mittel");
  const [verbrauch, setVerbrauch] = useState(4500);
  const [mitSpeicher, setMitSpeicher] = useState(true);
  const [speicherKwh, setSpeicherKwh] = useState(8);

  const r = useMemo(
    () =>
      berechne({
        kwp,
        ausrichtung,
        neigung,
        verbrauch,
        speicherKwh: mitSpeicher ? speicherKwh : 0,
      }),
    [kwp, ausrichtung, neigung, verbrauch, mitSpeicher, speicherKwh]
  );

  const empfehlung = empfohlenerSpeicher(verbrauch);
  // Faustregel: rund 1 kWp je 1.000 kWh Jahresverbrauch deckt den Bedarf gut ab.
  const passendeGroesse = Math.max(3, Math.round(verbrauch / 1000));
  const deutlichZuGross = kwp > passendeGroesse * 2;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
      <style>{`
        .ov-slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 9999px; background: #e5e7eb; outline: none; }
        .ov-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 9999px; background: #669933; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.25); cursor: pointer; }
        .ov-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 9999px; background: #669933; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.25); cursor: pointer; }
        .ov-slider:focus-visible { box-shadow: 0 0 0 3px rgba(102,153,51,.35); }
      `}</style>

      <div className="grid gap-0 lg:grid-cols-[1fr_minmax(320px,420px)]">
        {/* ---------- Eingaben ---------- */}
        <div className="space-y-7 p-6 md:p-8">
          <Regler
            label="Anlagengröße"
            wert={kwp}
            min={3}
            max={30}
            step={0.5}
            einheit="kWp"
            onChange={setKwp}
            hinweis={`Benötigt etwa ${Math.round(r.benoetigteFlaeche)} m² Dachfläche.`}
          />

          <Regler
            label="Jahresstromverbrauch"
            wert={verbrauch}
            min={1500}
            max={20000}
            step={250}
            einheit="kWh"
            onChange={setVerbrauch}
            hinweis="Steht auf Ihrer letzten Stromrechnung. Ein 4-Personen-Haushalt liegt typisch bei 4.000–5.000 kWh."
          />

          <PillGruppe
            legende="Dachausrichtung"
            name="ausrichtung"
            optionen={AUSRICHTUNGEN}
            wert={ausrichtung}
            onChange={setAusrichtung}
          />

          <PillGruppe
            legende="Dachneigung"
            name="neigung"
            optionen={NEIGUNGEN}
            wert={neigung}
            onChange={setNeigung}
          />

          <div>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={mitSpeicher}
                onChange={(e) => setMitSpeicher(e.target.checked)}
                className="h-5 w-5 shrink-0 accent-[#669933]"
              />
              <span className="text-[15px] font-medium text-gray-900">
                Mit Stromspeicher rechnen
              </span>
            </label>

            {mitSpeicher && (
              <div className="mt-4">
                <Regler
                  label="Speichergröße"
                  wert={speicherKwh}
                  min={3}
                  max={20}
                  step={1}
                  einheit="kWh"
                  onChange={setSpeicherKwh}
                  hinweis={`Für ${kwh(verbrauch)} kWh Verbrauch sind rund ${empfehlung} kWh üblich.`}
                />
              </div>
            )}
          </div>

          {deutlichZuGross && (
            <div className="rounded-xl border-l-4 border-[#669933] bg-white p-4">
              <p className="text-[14px] leading-relaxed text-gray-700">
                Bei {kwh(verbrauch)} kWh Verbrauch ist eine Anlage von{" "}
                {kwp} kWp reichlich groß. Der Überschuss wird zum niedrigen
                Einspeisesatz vergütet – etwa {passendeGroesse} kWp rechnet sich
                meist deutlich schneller.
              </p>
            </div>
          )}
        </div>

        {/* ---------- Ergebnis ---------- */}
        <div className="border-t border-gray-200 bg-white p-6 md:p-8 lg:border-l lg:border-t-0">
          <h3 className="mb-5 text-[18px] font-semibold text-gray-900">
            Ihr Ergebnis
          </h3>

          <div className="space-y-3">
            <Kennzahl
              icon={Gauge}
              label="Ersparnis & Erlös pro Jahr"
              wert={eur(r.nutzenProJahr)}
              zusatz={`${eur(r.ersparnis)} Eigenverbrauch + ${eur(
                r.einspeiseErloes
              )} Einspeisung − ${eur(r.betriebskosten)} Betrieb`}
              hervorgehoben
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Kennzahl
                icon={Sun}
                label="Jahresertrag"
                kompakt
                wert={kwh(r.jahresertrag) + " kWh"}
                zusatz={`${Math.round(r.spezifischerErtrag)} kWh je kWp`}
              />
              <Kennzahl
                icon={Home}
                label="Amortisation"
                kompakt
                wert={
                  r.amortisationJahre
                    ? r.amortisationJahre.toFixed(1).replace(".", ",") + " J."
                    : "–"
                }
                zusatz={`Investition ${eur(r.investition)}`}
              />
            </div>

            <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <Balken
                label="Autarkie"
                anteil={r.autarkie}
                beschriftung={pct(r.autarkie)}
              />
              <Balken
                label="Eigenverbrauch der Erzeugung"
                anteil={r.eigenverbrauchsquote}
                beschriftung={`${pct(r.eigenverbrauchsquote)} · ${kwh(
                  r.eigenverbrauch
                )} kWh`}
              />
              <p className="text-[13px] leading-relaxed text-gray-500">
                {kwh(r.eingespeist)} kWh gehen ins Netz und werden mit{" "}
                {String(r.satzCt).replace(".", ",")} ct/kWh vergütet.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Kennzahl
                icon={Battery}
                label="Überschuss in 20 Jahren"
                kompakt
                wert={eur(r.ertrag20Jahre)}
                zusatz="nach Abzug der Investition"
              />
              <Kennzahl
                icon={Leaf}
                label="CO₂ pro Jahr"
                kompakt
                wert={kwh(r.co2ProJahr) + " kg"}
                zusatz="gegenüber Strommix"
              />
            </div>
          </div>

          <Link
            href="/kontakt"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-[14px] font-semibold uppercase text-white transition-colors hover:bg-[#558822]"
            style={{ backgroundColor: "#669933" }}
          >
            Angebot anfordern
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>

          <p className="mt-4 text-[12px] leading-relaxed text-gray-500">
            Unverbindliche Orientierung auf Basis von Erfahrungswerten
            ({ANNAHMEN.ertragProKwpSued} kWh/kWp bei Südausrichtung,
            Strompreis {String(ANNAHMEN.strompreis * 100).replace(".", ",")} ct/kWh).
            Der tatsächliche Ertrag hängt von Verschattung, Dachaufbau und
            Verbrauchsverhalten ab – dafür rechnen wir Ihnen gern ein konkretes
            Angebot.
          </p>
        </div>
      </div>
    </div>
  );
}
