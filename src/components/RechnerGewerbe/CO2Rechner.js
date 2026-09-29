"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Car, Check, ClipboardCopy, Factory, Leaf, Sun, TrendingDown, Truck } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Gruppe, Kennzahl, Regler, Schalter, Zahl } from "@/components/Rechner/bausteine";
import { MobilKurz } from "@/components/Rechner/StromspeicherRechner";
import { fmt } from "@/lib/rechner/annahmen";
import { CO2, rechneCo2, textbaustein } from "@/lib/rechner/co2";
import { DiagrammKarte, PresetLeiste, Umschalter, useEingeblendet } from "./GewerbePVBausteine";

const t1 = (kg) => kg / 1000;
const pct = (v) => Math.round(v * 100);

export const CO2_PRESETS = [
  { id: "produktion", label: "Produktion 1,5 GWh", verbrauch: 1500, pv: true, kwp: 800, ev: 70, oeko: 0, flotte: true, fahrzeuge: 12, km: 25000, liter: 8, anteilE: 50 },
  { id: "handel", label: "Handel & Kühlung", verbrauch: 600, pv: true, kwp: 300, ev: 85, oeko: 50, flotte: false, fahrzeuge: 4, km: 20000, liter: 7, anteilE: 50 },
  { id: "buero", label: "Bürogebäude", verbrauch: 180, pv: true, kwp: 80, ev: 75, oeko: 100, flotte: true, fahrzeuge: 8, km: 22000, liter: 6.5, anteilE: 75 },
  { id: "gemeinde", label: "Gemeinde", verbrauch: 900, pv: true, kwp: 400, ev: 60, oeko: 100, flotte: true, fahrzeuge: 10, km: 15000, liter: 9, anteilE: 40 },
];

export default function CO2Rechner() {
  const [preset, setPreset] = useState("produktion");
  const [verbrauchMwh, setVerbrauchMwh] = useState(1500);
  const [lokG, setLokG] = useState(CO2.lokFaktorG);
  const [marktG, setMarktG] = useState(CO2.marktFaktorBeispielG);
  const [pvAn, setPvAn] = useState(true);
  const [kwp, setKwp] = useState(800);
  const [ev, setEv] = useState(70);
  const [oeko, setOeko] = useState(0);
  const [flotteAn, setFlotteAn] = useState(true);
  const [fahrzeuge, setFahrzeuge] = useState(12);
  const [km, setKm] = useState(25000);
  const [liter, setLiter] = useState(8);
  const [anteilE, setAnteilE] = useState(50);
  const [pvLaden, setPvLaden] = useState(30);
  const [methode, setMethode] = useState("location");
  const [firma, setFirma] = useState("");
  const [jahr, setJahr] = useState("2026");
  const [kopiert, setKopiert] = useState(false);
  const firmaId = useId();
  const jahrId = useId();

  const m = (fn) => (v) => {
    setPreset(null);
    fn(v);
  };
  const lade = (p) => {
    setPreset(p.id);
    setVerbrauchMwh(p.verbrauch);
    setPvAn(p.pv);
    setKwp(p.kwp);
    setEv(p.ev);
    setOeko(p.oeko);
    setFlotteAn(p.flotte);
    setFahrzeuge(p.fahrzeuge);
    setKm(p.km);
    setLiter(p.liter);
    setAnteilE(p.anteilE);
  };

  const eingabe = useDeferredValue(
    JSON.stringify({
      strombezugKwh: verbrauchMwh * 1000,
      lokFaktorG: lokG,
      marktFaktorG: marktG,
      oekoAnteil: oeko / 100,
      pv: pvAn ? { kwp, ertragProKwp: CO2.pvErtragProKwp, eigenverbrauchsquote: ev / 100 } : null,
      flotte: flotteAn ? { fahrzeuge, kmJeFahrzeug: km, literJe100: liter, anteilElektrisch: anteilE / 100, kwhJe100: CO2.eFahrzeugKwhJe100, pvLadeanteil: pvLaden / 100 } : null,
    })
  );
  const r = useMemo(() => rechneCo2(JSON.parse(eingabe)), [eingabe]);
  const s2 = r.scope2[methode];
  const text = textbaustein(r, { jahr, firma: firma.trim() || "Unser Unternehmen" });
  const eingespart = Math.max(r.gesamt.reduktionKg, 0);

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2200);
    } catch {
      setKopiert(false);
    }
  };

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              ["Scope 2 vorher", <Zahl key="v" wert={t1(r.scope2.location.vorher)} stellen={1} suffix=" t" />],
              ["nachher", <Zahl key="n" wert={t1(r.scope2.location.nachher)} stellen={1} suffix=" t" />],
              ["Reduktion", <Zahl key="r" wert={pct(r.scope2.location.reduktion)} suffix=" %" />],
            ]}
          />
          <div className="space-y-8">
            <PresetLeiste presets={CO2_PRESETS} aktiv={preset} onWahl={lade} titel="Beispiel laden" />

            <Gruppe titel="Strombezug & Emissionsfaktoren">
              <Regler label="Strombezug pro Jahr" wert={verbrauchMwh} min={20} max={5000} step={10} format={(v) => `${fmt(v)} MWh`} onChange={m(setVerbrauchMwh)} hinweis="Gesamter Stromverbrauch des Standorts laut Jahresabrechnung." />
              <Regler
                label="Standortbasiert (Netzmix)"
                wert={lokG}
                min={50}
                max={400}
                step={0.1}
                format={(v) => `${fmt(v, 1)} g/kWh`}
                onChange={m(setLokG)}
                hinweis={`Standard ${fmt(CO2.lokFaktorG, 1)} g: mittlere österreichische Stromaufbringung 2024 (Marktentwicklung 2024, BMIMI). Setzen Sie den Faktor Ihres Berichtsjahres ein.`}
              />
              <Regler
                label="Marktbasiert (Ihr Lieferant)"
                wert={marktG}
                min={0}
                max={500}
                step={1}
                format={(v) => `${fmt(v)} g/kWh`}
                onChange={m(setMarktG)}
                hinweis={`Beispielwert – tragen Sie den CO₂-Wert aus der Stromkennzeichnung Ihrer Rechnung ein. Versorgermix Österreich 2025: ${fmt(CO2.versorgermix2025.erneuerbar, 2)} % erneuerbar (E-Control).`}
              />
            </Gruppe>

            <Gruppe titel="Maßnahmen">
              <Schalter icon={Sun} label="Eigene Photovoltaik" beschreibung={`${fmt(CO2.pvErtragProKwp)} kWh je kWp und Jahr`} an={pvAn} onChange={m(setPvAn)}>
                <div className="space-y-5">
                  <Regler label="Anlagengröße" wert={kwp} min={10} max={3000} step={10} format={(v) => `${fmt(v)} kWp`} onChange={m(setKwp)} />
                  <Regler label="Eigenverbrauchsquote" wert={ev} min={10} max={100} step={1} format={(v) => `${v} %`} onChange={m(setEv)} hinweis="Genauer mit dem Gewerbe-PV-Rechner (stündliche Simulation)." />
                </div>
              </Schalter>
              <Regler
                label="Ökostrom mit Herkunftsnachweis"
                wert={oeko}
                min={0}
                max={100}
                step={5}
                format={(v) => `${v} % des Netzbezugs`}
                onChange={m(setOeko)}
                hinweis="Wird marktbasiert mit 0 g/kWh bilanziert; standortbasiert ändert sich nichts."
              />
              <Schalter icon={Truck} label="Fahrzeugflotte (Scope 1)" beschreibung="Diesel-Fahrzeuge teilweise elektrifizieren" an={flotteAn} onChange={m(setFlotteAn)}>
                <div className="space-y-5">
                  <Regler label="Fahrzeuge" wert={fahrzeuge} min={1} max={200} step={1} onChange={m(setFahrzeuge)} />
                  <Regler label="Fahrleistung je Fahrzeug" wert={km} min={5000} max={60000} step={1000} format={(v) => `${fmt(v)} km`} onChange={m(setKm)} />
                  <Regler label="Dieselverbrauch" wert={liter} min={4} max={14} step={0.5} format={(v) => `${fmt(v, 1)} l/100 km`} onChange={m(setLiter)} />
                  <Regler label="Davon elektrisch" wert={anteilE} min={0} max={100} step={5} format={(v) => `${v} %`} onChange={m(setAnteilE)} hinweis={`${fmt(CO2.eFahrzeugKwhJe100)} kWh/100 km inkl. Ladeverluste (Annahme).`} />
                  {pvAn && <Regler label="Laden mit eigenem Solarstrom" wert={pvLaden} min={0} max={100} step={5} format={(v) => `${v} %`} onChange={setPvLaden} hinweis="Nur aus Überschuss, der sonst eingespeist würde." />}
                </div>
              </Schalter>
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="min-w-0 p-5 sm:p-6 md:p-8">
          <p className="sr-only" aria-live="polite">
            {`Scope 2 standortbasiert von ${fmt(t1(r.scope2.location.vorher), 1)} auf ${fmt(t1(r.scope2.location.nachher), 1)} Tonnen, marktbasiert von ${fmt(t1(r.scope2.market.vorher), 1)} auf ${fmt(t1(r.scope2.market.nachher), 1)} Tonnen`}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Ihre Klimabilanz</h2>
            <Umschalter
              label="Methode"
              wert={methode}
              onChange={setMethode}
              optionen={[
                { id: "location", label: "Standortbasiert" },
                { id: "market", label: "Marktbasiert" },
              ]}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kennzahl icon={Factory} label="Scope 2 vorher" zusatz={`${methode === "location" ? fmt(r.faktoren.lokG, 1) : fmt(r.faktoren.marktG)} g/kWh`}>
              <Zahl wert={t1(s2.vorher)} stellen={1} suffix=" t" />
            </Kennzahl>
            <Kennzahl ton="navy" icon={Leaf} label="Scope 2 nachher" zusatz={`Netzbezug ${fmt(r.netz.nachher / 1000)} MWh`}>
              <Zahl wert={t1(s2.nachher)} stellen={1} suffix=" t" />
            </Kennzahl>
            <Kennzahl ton="gruen" icon={TrendingDown} label="Reduktion Scope 2" zusatz={methode === "location" ? "standortbasiert" : "marktbasiert"}>
              {s2.reduktion >= 0 ? <Zahl wert={pct(s2.reduktion)} prefix="−" suffix=" %" /> : <Zahl wert={pct(-s2.reduktion)} prefix="+" suffix=" %" />}
            </Kennzahl>
            <Kennzahl icon={Leaf} label="Eingespart gesamt" zusatz={r.flotte.scope1Vorher > 0 ? "Scope 1 + 2, marktbasiert" : "Scope 2, marktbasiert"}>
              <Zahl wert={t1(eingespart)} stellen={1} suffix=" t/J." />
            </Kennzahl>
          </div>

          <DiagrammKarte titel="Vorher und nachher im Vergleich" rechts={<span className="text-[12.5px] text-ink-500">t CO₂e pro Jahr</span>}>
            <VergleichsBalken r={r} />
          </DiagrammKarte>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-ink-50 p-5 md:p-6">
              <h3 className="font-display text-[16px] font-bold text-ink-900">Was zählt – und was nicht</h3>
              <ul className="mt-3 space-y-2.5 text-[13.5px] leading-relaxed text-ink-600">
                <li className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />Selbst genutzter Solarstrom senkt Scope 2 in beiden Methoden.</li>
                <li className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />Herkunftsnachweise senken nur den marktbasierten Wert.</li>
                <li className="flex gap-2">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                  <span>
                    Eingespeister Solarstrom ({fmt(r.pv.einspeisung / 1000)} MWh) ist nicht anrechenbar – er vermeidet im Stromsystem rund <strong className="ov-num text-ink-800">{fmt(t1(r.vermiedenEinspeisungKg), 1)} t</strong> ({fmt(CO2.substitutionG, 1)} g/kWh Substitution).
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-navy-950 p-5 text-white md:p-6">
              <h3 className="font-display text-[16px] font-bold">Gesamt Scope 1 + 2 (marktbasiert)</h3>
              <p className="mt-3 font-display text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] font-extrabold leading-none tracking-tight">
                <Zahl wert={t1(r.gesamt.vorher)} stellen={1} /> <span className="text-white/40">→</span> <Zahl wert={t1(r.gesamt.nachher)} stellen={1} suffix=" t" className="text-ov-300" />
              </p>
              <p className="mt-2 text-[13px] text-white/65">
                {eingespart > 0 ? `${fmt(t1(eingespart), 1)} t CO₂e weniger pro Jahr` : "keine Reduktion"}
                {r.flotte.scope1Vorher > 0 ? ` · Flotte Scope 1 ${fmt(t1(r.flotte.scope1Vorher), 1)} → ${fmt(t1(r.flotte.scope1Nachher), 1)} t` : ""}
              </p>
              {eingespart > 0 && (
                <p className="mt-5 flex items-start gap-3 rounded-2xl bg-white/5 p-4 text-[13.5px] leading-relaxed text-white/80 ring-1 ring-white/10">
                  <Car aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-300" />
                  <span>
                    Das entspricht rund <strong className="ov-num text-white">{fmt(Math.round(r.aequivalent.pkwKm / 1000) * 1000)} km</strong> mit einem Benziner (7 l/100 km, nur Verbrennung).
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Textbaustein */}
          <div className="mt-6 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-[17px] font-bold text-ink-900">Textbaustein für Ihren Nachhaltigkeitsbericht</h3>
              <button
                type="button"
                onClick={kopieren}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13.5px] font-semibold transition-colors",
                  kopiert ? "bg-ov-600 text-white" : "bg-ink-900 text-white hover:bg-ov-600"
                )}
              >
                {kopiert ? <Check aria-hidden="true" className="h-4 w-4" /> : <ClipboardCopy aria-hidden="true" className="h-4 w-4" />}
                {kopiert ? "Kopiert" : "Text kopieren"}
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px]">
              <div>
                <label htmlFor={firmaId} className="mb-1.5 block text-[12.5px] font-semibold text-ink-600">Firmenname (optional)</label>
                <input id={firmaId} value={firma} onChange={(e) => setFirma(e.target.value)} placeholder="Unser Unternehmen" className="h-11 w-full rounded-xl bg-white px-3.5 text-[15px] text-ink-900 ring-1 ring-ink-200 placeholder:text-ink-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500" />
              </div>
              <div>
                <label htmlFor={jahrId} className="mb-1.5 block text-[12.5px] font-semibold text-ink-600">Berichtsjahr</label>
                <select id={jahrId} value={jahr} onChange={(e) => setJahr(e.target.value)} className="h-11 w-full cursor-pointer rounded-xl bg-white px-3 text-[15px] text-ink-900 ring-1 ring-ink-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500">
                  {["2025", "2026", "2027"].map((j) => (
                    <option key={j}>{j}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-4 rounded-2xl bg-white p-4 text-[14px] leading-relaxed text-ink-700 ring-1 ring-ink-200" aria-live="polite">
              {text}
            </p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
              Passend für VSME (freiwilliger Standard für KMU) und ESRS E1. Einordnung im Ratgeber{" "}
              <Link href="/ratgeber/csrd-esg-photovoltaik" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                CSRD, VSME & Photovoltaik
              </Link>
              .
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/service/nachhaltigkeitsmarketing" className="group inline-flex max-w-md items-center gap-1.5 text-[14px] font-semibold text-ink-700 hover:text-ov-700">
              Klimabilanz sichtbar machen: Nachhaltigkeitsmarketing mit Video und Imagespot
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Button href="/angebot" size="lg" pfeil className="shrink-0">
              PV für Ihren Betrieb planen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VergleichsBalken({ r }) {
  const an = useEingeblendet(120);
  const reihen = [
    { id: "location", label: "Scope 2 standortbasiert", v: r.scope2.location.vorher, n: r.scope2.location.nachher },
    { id: "market", label: "Scope 2 marktbasiert", v: r.scope2.market.vorher, n: r.scope2.market.nachher },
  ];
  if (r.scope1.vorher > 0) reihen.push({ id: "scope1", label: "Scope 1 Flotte", v: r.scope1.vorher, n: r.scope1.nachher });
  const max = Math.max(...reihen.flatMap((x) => [x.v, x.n]), 1);
  const breite = (w) => `${an ? Math.max((w / max) * 100, w > 0 ? 0.8 : 0) : 0}%`;
  return (
    <div className="space-y-5 px-5 pb-5 pt-4 md:px-6">
      {reihen.map((x, i) => (
        <div key={x.id}>
          <div className="mb-2 flex items-baseline justify-between gap-3 text-[13.5px]">
            <span className="font-semibold text-ink-800">{x.label}</span>
            <span className="ov-num text-ink-600">
              {fmt(t1(x.v), 1)} <span aria-hidden="true">→</span> <strong className="text-ink-900">{fmt(t1(x.n), 1)} t</strong>
            </span>
          </div>
          <div className="space-y-1.5" role="img" aria-label={`${x.label}: vorher ${fmt(t1(x.v), 1)} Tonnen, nachher ${fmt(t1(x.n), 1)} Tonnen`}>
            <div className="h-3 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-ink-300 motion-safe:transition-[width] motion-safe:duration-700" style={{ width: breite(x.v), transitionDelay: `${i * 90}ms` }} />
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600 motion-safe:transition-[width] motion-safe:duration-700" style={{ width: breite(x.n), transitionDelay: `${i * 90 + 60}ms` }} />
            </div>
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-ink-600">
        <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ink-300" />vorher</span>
        <span className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ov-500" />nachher</span>
      </div>
    </div>
  );
}
