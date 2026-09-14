"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import PdfAnalyse from "@/components/Analyse/PdfAnalyse";
import ScanHandshake from "@/components/Scan/ScanHandshake";
import {
  ArrowRight,
  BatteryCharging,
  Calculator,
  Clock,
  Compass,
  Home,
  Info,
  Leaf,
  Phone,
  PiggyBank,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";

import { AUSRICHTUNGEN, NEIGUNGEN, ANNAHMEN } from "@/data/solarrechner";
import { berechne, empfohlenerSpeicher } from "@/lib/solarrechner";
import { STANDARD } from "@/lib/rechnerTeilen";
import CashflowChart from "./CashflowChart";
import ErgebnisTeilen from "./ErgebnisTeilen";
import useAnimierteZahl from "./useAnimierteZahl";

const zahl = (n, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const eur = (n) => `${n < 0 ? "−" : ""}${zahl(Math.abs(Math.round(n)))} €`;
const pctTxt = (n) => `${Math.round(n * 100)} %`;

/** Zahl, die weich auf den neuen Wert gleitet. */
function Animiert({ wert, format = (v) => zahl(Math.round(v)), className }) {
  const v = useAnimierteZahl(wert);
  return <span className={className ? `ov-num ${className}` : "ov-num"}>{format(v)}</span>;
}

/** Beschrifteter Schieberegler im Markenstil (`ov-range`). */
function Regler({ label, wert, min, max, step, einheit, onChange, hinweis, children }) {
  const id = useId();
  const fill = ((wert - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[14.5px] font-semibold text-ink-800">
          {label}
        </label>
        <output htmlFor={id} className="ov-num font-display text-[24px] font-extrabold leading-none tracking-tight text-ink-900">
          {zahl(wert, step < 1 && wert % 1 !== 0 ? 1 : 0)}
          <span className="ml-1 text-[14px] font-bold text-ink-500">{einheit}</span>
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
        className="ov-range h-[26px] cursor-pointer bg-transparent"
        style={{ "--ov-fill": `${fill}%` }}
      />
      {hinweis && <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{hinweis}</p>}
      {children}
    </div>
  );
}

/** Segmentierte Auswahl – zugänglich über echte Radio-Inputs. */
function Segmente({ legende, optionen, wert, onChange, name, icon: Icon }) {
  return (
    <fieldset>
      <legend className="mb-2.5 flex items-center gap-2 text-[14.5px] font-semibold text-ink-800">
        {Icon && <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" />}
        {legende}
      </legend>
      <div className="flex flex-wrap gap-2">
        {optionen.map((o) => {
          const aktiv = wert === o.id;
          return (
            <label
              key={o.id}
              className={`flex min-h-[44px] cursor-pointer items-center rounded-full px-4 text-[14px] font-semibold transition-all duration-200 focus-within:ring-2 focus-within:ring-ov-500 focus-within:ring-offset-2 ${
                aktiv ? "bg-ink-900 text-white shadow-md" : "bg-ink-100 text-ink-600 hover:bg-ink-200 hover:text-ink-900"
              }`}
            >
              <input type="radio" name={name} value={o.id} checked={aktiv} onChange={() => onChange(o.id)} className="sr-only" />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Schalter({ an, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={an}
      onClick={() => onChange(!an)}
      className="flex min-h-[44px] w-full items-center justify-between gap-4 text-left"
    >
      <span className="flex items-center gap-2 text-[14.5px] font-semibold text-ink-800">
        <BatteryCharging aria-hidden="true" className="h-4 w-4 text-ov-600" />
        {label}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${an ? "bg-ov-500" : "bg-ink-200"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${an ? "translate-x-6" : "translate-x-1"}`} />
      </span>
    </button>
  );
}

function Kachel({ icon: Icon, label, children, zusatz }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 @md:p-5">
      <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500">
        <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
        {label}
      </p>
      <p className="mt-1.5 font-display text-[22px] font-extrabold leading-tight tracking-tight text-ink-900 @md:text-[26px]">{children}</p>
      {zusatz && <p className="mt-1 text-[12.5px] leading-snug text-ink-500">{zusatz}</p>}
    </div>
  );
}

/** Zwei gestapelte Anteilsbalken: Wohin geht der Solarstrom, woher kommt der Strom? */
function Energiefluss({ r }) {
  const reihen = [
    {
      titel: "Ihr Solarstrom",
      gesamt: r.jahresertrag,
      teile: [
        { l: "Selbst genutzt", v: r.eigenverbrauch, c: "bg-ov-500" },
        { l: "Eingespeist", v: r.eingespeist, c: "bg-ov-200" },
      ],
    },
    {
      titel: "Ihr Stromverbrauch",
      gesamt: r.eigenverbrauch + r.netzbezug,
      teile: [
        { l: "Aus der Anlage", v: r.eigenverbrauch, c: "bg-ov-500" },
        { l: "Aus dem Netz", v: r.netzbezug, c: "bg-ink-300" },
      ],
    },
  ];
  return (
    <div className="space-y-5 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 @md:p-5">
      {reihen.map((reihe) => (
        <div key={reihe.titel}>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="text-[13.5px] font-semibold text-ink-800">{reihe.titel}</span>
            <span className="ov-num text-[13px] text-ink-500">{zahl(Math.round(reihe.gesamt))} kWh/Jahr</span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-ink-100" role="img" aria-label={`${reihe.titel}: ${reihe.teile.map((t) => `${t.l} ${pctTxt(t.v / (reihe.gesamt || 1))}`).join(", ")}`}>
            {reihe.teile.map((t) => (
              <span key={t.l} className={`${t.c} h-full motion-safe:transition-[width] motion-safe:duration-500`} style={{ width: `${(t.v / (reihe.gesamt || 1)) * 100}%` }} />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-600">
            {reihe.teile.map((t) => (
              <li key={t.l} className="flex items-center gap-1.5">
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${t.c}`} />
                {t.l} <span className="ov-num font-semibold text-ink-900">{pctTxt(t.v / (reihe.gesamt || 1))}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Solarrechner: Ertrag, Eigenverbrauch, Autarkie, Ersparnis, Amortisation
 * und 20-Jahres-Cashflow. Passt sich über Container-Queries an die
 * verfügbare Breite an (Hero der Rechnerseite oder schmale Artikelspalte).
 */
export default function Solarrechner({ className = "", start = STANDARD }) {
  const [kwp, setKwp] = useState(start.kwp);
  const [ausrichtung, setAusrichtung] = useState(start.ausrichtung);
  const [neigung, setNeigung] = useState(start.neigung);
  const [verbrauch, setVerbrauch] = useState(start.verbrauch);
  const [mitSpeicher, setMitSpeicher] = useState(start.speicher > 0);
  const [speicherKwh, setSpeicherKwh] = useState(start.speicher || STANDARD.speicher);
  const [steigerung, setSteigerung] = useState(start.steigerung);

  const speicher = mitSpeicher ? speicherKwh : 0;
  const r = useMemo(
    () => berechne({ kwp, ausrichtung, neigung, verbrauch, speicherKwh: speicher, preissteigerung: steigerung }),
    [kwp, ausrichtung, neigung, verbrauch, speicher, steigerung]
  );

  const empfehlung = empfohlenerSpeicher(verbrauch);
  // Faustregel: rund 1 kWp je 1.000 kWh Jahresverbrauch deckt den Bedarf gut ab.
  const passendeGroesse = Math.max(3, Math.round(verbrauch / 1000));
  const deutlichZuGross = kwp > passendeGroesse * 2.5;

  const angebotHref = `/angebot?${new URLSearchParams({
    kwp: String(kwp),
    verbrauch: String(verbrauch),
    speicher: String(speicher),
  }).toString()}`;

  return (
    <div className={`@container/karte overflow-hidden rounded-[2rem] bg-white text-ink-900 shadow-[0_40px_80px_-30px_rgba(0,20,50,0.55)] ring-1 ring-ink-200/60 ${className}`}>
      <div className="grid @5xl/karte:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* ---------- Eingaben ---------- */}
        <div className="@container flex flex-col border-b border-ink-100 p-5 @md:p-8 @5xl/karte:border-b-0 @5xl/karte:border-r">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ov-50 text-ov-600">
              <Calculator aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-[17px] font-extrabold leading-tight text-ink-900">Ihre Angaben</p>
              <p className="text-[12.5px] text-ink-500">Ergebnis aktualisiert sich sofort</p>
            </div>
          </div>

          <div className="grid gap-7 @3xl:grid-cols-2 @3xl:gap-x-10">
            <Regler
              label="Anlagengröße"
              wert={kwp}
              min={3}
              max={30}
              step={0.5}
              einheit="kWp"
              onChange={setKwp}
              hinweis={`Benötigt etwa ${Math.round(r.benoetigteFlaeche)} m² Dachfläche · ca. ${Math.ceil((kwp * 1000) / 440)} Module à 440 W`}
            />

            <Regler
              label="Jahresstromverbrauch"
              wert={verbrauch}
              min={1500}
              max={20000}
              step={250}
              einheit="kWh"
              onChange={setVerbrauch}
            >
              <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Typische Verbräuche">
                {[
                  { l: "2 Pers.", v: 2500 },
                  { l: "4 Pers.", v: 4500 },
                  { l: "+ E-Auto", v: 7000 },
                  { l: "+ Wärmepumpe", v: 10000 },
                ].map((p) => (
                  <button
                    key={p.l}
                    type="button"
                    onClick={() => setVerbrauch(p.v)}
                    aria-pressed={verbrauch === p.v}
                    className={`min-h-[36px] rounded-full px-3 text-[12.5px] font-semibold transition-colors ${
                      verbrauch === p.v ? "bg-ov-600 text-white" : "bg-ov-50 text-ov-800 hover:bg-ov-100"
                    }`}
                  >
                    {p.l} · {zahl(p.v / 1000, p.v % 1000 ? 1 : 0)} MWh
                  </button>
                ))}
              </div>
            </Regler>

            <Segmente legende="Dachausrichtung" name="ausrichtung" optionen={AUSRICHTUNGEN} wert={ausrichtung} onChange={setAusrichtung} icon={Compass} />
            <Segmente legende="Dachneigung" name="neigung" optionen={NEIGUNGEN} wert={neigung} onChange={setNeigung} icon={Home} />

            <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-100 @md:p-5">
              <Schalter an={mitSpeicher} onChange={setMitSpeicher} label="Mit Stromspeicher rechnen" />
              {mitSpeicher && (
                <div className="mt-4">
                  <Regler label="Speichergröße" wert={speicherKwh} min={3} max={20} step={1} einheit="kWh" onChange={setSpeicherKwh}>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[13px] leading-relaxed text-ink-500">
                      Faustregel für {zahl(verbrauch)} kWh: rund {empfehlung} kWh.
                      {speicherKwh !== empfehlung && empfehlung <= 20 && (
                        <button type="button" onClick={() => setSpeicherKwh(empfehlung)} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                          Übernehmen
                        </button>
                      )}
                    </p>
                  </Regler>
                </div>
              )}
            </div>

            <fieldset>
              <legend className="mb-2.5 flex items-center gap-2 text-[14.5px] font-semibold text-ink-800">
                <TrendingUp aria-hidden="true" className="h-4 w-4 text-ov-600" />
                Strompreis-Entwicklung pro Jahr
              </legend>
              <div className="inline-flex rounded-full bg-ink-100 p-1">
                {ANNAHMEN.strompreisSteigerungOptionen.map((o) => (
                  <label
                    key={o}
                    className={`flex min-h-[40px] cursor-pointer items-center rounded-full px-4 text-[14px] font-semibold transition-all focus-within:ring-2 focus-within:ring-ov-500 ${
                      steigerung === o ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"
                    }`}
                  >
                    <input type="radio" name="steigerung" checked={steigerung === o} onChange={() => setSteigerung(o)} className="sr-only" />
                    {o === 0 ? "gleichbleibend" : `+${zahl(o * 100)} %`}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {deutlichZuGross && (
            <p className="mt-6 flex gap-3 rounded-2xl bg-sun-300/25 p-4 text-[13.5px] leading-relaxed text-ink-800">
              <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ink-700" />
              <span>
                Bei {zahl(verbrauch)} kWh Verbrauch ist {zahl(kwp, kwp % 1 ? 1 : 0)} kWp sehr groß. Der Überschuss bringt nur {zahl(r.satzCt, 2)} ct/kWh –
                prüfen Sie auch rund {passendeGroesse * 1.5 > 30 ? 30 : Math.round(passendeGroesse * 1.5)} kWp.
              </span>
            </p>
          )}

          <div className="mt-auto hidden pt-8 @5xl/karte:block"><div className="rounded-2xl bg-navy-950 p-5 text-white">
            <p className="text-[13px] text-white/60">Werte unsicher? Wir rechnen gern mit Ihnen.</p>
            <a href="tel:+498245967880" className="mt-1.5 flex items-center gap-3 font-display text-[20px] font-extrabold tracking-tight hover:text-ov-300">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ov-500">
                <Phone aria-hidden="true" className="h-4 w-4 text-white" />
              </span>
              08245 96 788 0
            </a>
            <p className="mt-2 text-[12.5px] text-white/55">Mo–Do 8–16 Uhr · Fr 8–13 Uhr</p>
          </div></div>
        </div>

        {/* ---------- Ergebnis ---------- */}
        <div className="@container bg-sand-50/70 p-5 @md:p-8" aria-live="polite">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Ihr Ergebnis</p>

          <div className="ov-noise relative mt-3 overflow-hidden rounded-3xl bg-gradient-to-br from-ov-500 to-ov-700 p-5 text-white @md:p-7">
            <div aria-hidden="true" className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-sun-300/30 blur-3xl" />
            <div className="relative flex flex-col gap-5 @2xl:flex-row @2xl:items-end @2xl:justify-between">
              <div>
                <p className="flex items-center gap-2 whitespace-nowrap text-[13.5px] font-medium text-white/85">
                  <PiggyBank aria-hidden="true" className="h-4 w-4" />
                  Ersparnis & Erlös im ersten Jahr
                </p>
                <p className="mt-1 font-display text-[44px] font-extrabold leading-none tracking-tight @md:text-[56px]">
                  <Animiert wert={r.nutzenProJahr} format={(v) => eur(v)} />
                </p>
              </div>
              <dl className="grid grid-cols-3 gap-2 text-[12px] @md:gap-3 @2xl:w-[330px]">
                {[
                  { l: "Eigenverbrauch", v: r.ersparnis },
                  { l: "Einspeisung", v: r.einspeiseErloes },
                  { l: "Betrieb", v: -r.betriebskosten },
                ].map((t) => (
                  <div key={t.l} className="rounded-xl bg-white/12 px-3 py-2 ring-1 ring-white/20">
                    <dt className="text-white/75">{t.l}</dt>
                    <dd className="ov-num mt-0.5 text-[15px] font-bold">
                      {t.v >= 0 ? "+" : ""}
                      <Animiert wert={t.v} format={(v) => eur(v)} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 @3xl:grid-cols-4">
            <Kachel icon={Clock} label="Amortisation" zusatz={`Investition ${eur(r.investition)}`}>
              {r.amortisationJahre != null ? (
                <>
                  <Animiert wert={r.amortisationJahre} format={(v) => zahl(v, 1)} /> <span className="text-[15px] font-bold text-ink-500">Jahre</span>
                </>
              ) : (
                <span className="text-[18px]">über 20 Jahre</span>
              )}
            </Kachel>
            <Kachel icon={TrendingUp} label="Plus nach 20 Jahren" zusatz="nach Abzug der Investition">
              <Animiert wert={r.ertrag20Jahre} format={(v) => eur(v)} />
            </Kachel>
            <Kachel icon={Zap} label="Autarkie" zusatz={`Eigenverbrauch ${pctTxt(r.eigenverbrauchsquote)}`}>
              <Animiert wert={r.autarkie * 100} format={(v) => `${Math.round(v)} %`} />
            </Kachel>
            <Kachel icon={Sun} label="Jahresertrag" zusatz={`${zahl(Math.round(r.spezifischerErtrag))} kWh je kWp`}>
              <Animiert wert={r.jahresertrag} /> <span className="text-[15px] font-bold text-ink-500">kWh</span>
            </Kachel>
          </div>

          <div className="mt-3">
            <Energiefluss r={r} />
          </div>

          <div className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 @md:p-5">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-[13.5px] font-semibold text-ink-800">Kumulierter Cashflow über 20 Jahre</p>
              <p className="flex items-center gap-3 text-[12px] text-ink-500">
                <span className="flex items-center gap-1.5"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-[#b9c2d0]" />noch im Minus</span>
                <span className="flex items-center gap-1.5"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-[#7fae4a]" />im Plus</span>
              </p>
            </div>
            <CashflowChart cashflow={r.cashflow} amortisationJahre={r.amortisationJahre} />
          </div>

          <div className="mt-6 flex flex-col gap-3 @xl:flex-row @xl:items-center">
            <ScanHandshake
              rechner={{ kwp, verbrauch, speicherKwh: speicher, ausrichtung, neigung }}
              quelle="Solarrechner"
              beiKiErgebnis={(ki) => ki.jahresverbrauch && setVerbrauch(Math.min(20000, Math.max(1500, Math.round(ki.jahresverbrauch / 250) * 250)))}
              knopfKlasse="h-14 bg-ov-600 px-7 text-[15.5px] text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] hover:bg-ov-700"
            />
            <PdfAnalyse eingaben={{ kwp, ausrichtung, neigung, verbrauch, speicherKwh: speicher, preissteigerung: steigerung }} className="h-14 px-6" />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <Link href={angebotHref} className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
              Oder ohne Fotos mit diesen Werten anfragen
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="flex items-center gap-2 text-[13px] text-ink-500">
              <Leaf aria-hidden="true" className="h-4 w-4 text-ov-600" />
              spart rund <Animiert wert={r.co2ProJahr / 1000} format={(v) => zahl(v, 1)} className="font-semibold text-ink-800" /> t CO₂ pro Jahr
            </p>
          </div>

          <ErgebnisTeilen
            eingaben={{ kwp, verbrauch, ausrichtung, neigung, speicher, steigerung }}
            titel={`${zahl(kwp, kwp % 1 ? 1 : 0)} kWp Solaranlage: ${eur(r.nutzenProJahr)} Vorteil im 1. Jahr, ${pctTxt(r.autarkie)} Autarkie`}
          />

          <p className="mt-5 text-[12px] leading-relaxed text-ink-500">
            Orientierung, kein Angebot. Annahmen: {zahl(ANNAHMEN.ertragProKwpSued)} kWh/kWp bei Süd, Netzstrom {zahl(ANNAHMEN.strompreis * 100)} ct/kWh im ersten
            Jahr, Einspeisevergütung {zahl(r.satzCt, 2)} ct/kWh (anteilig nach EEG, Inbetriebnahme bis 31.01.2027) fest für 20 Jahre,{" "}
            {zahl(ANNAHMEN.degradationProJahr * 100, 1)} % Moduldegradation und {zahl(ANNAHMEN.betriebskostenSteigerung * 100)} % Kostensteigerung
            pro Jahr, Betrieb {ANNAHMEN.betriebskostenProKwp} €/kWp. Anlagenpreise inkl. Montage, 0 % USt. Verschattung, Dachaufbau und Ihr
            Lastprofil prüfen wir im persönlichen Angebot.
          </p>
        </div>
      </div>
    </div>
  );
}
