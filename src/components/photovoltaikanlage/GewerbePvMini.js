"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, Gauge, Info, PiggyBank, Sun, Timer } from "lucide-react";
import { Auswahl, Regler, Zahl } from "@/components/Rechner/bausteine";
import { fmt } from "@/lib/rechner/annahmen";
import { GEWERBE_PV, kwpAusFlaeche, rechneGewerbePv } from "@/lib/rechner/gewerbepv";
import { cn } from "@/components/ui/cn";

const DACHARTEN = GEWERBE_PV.dacharten.filter((d) => d.id !== "shed").map((d) => ({ id: d.id, label: d.label.replace("Flachdach ", "Flach "), sub: d.sub }));

/**
 * Mini-Rechner „Was bringt Ihr Hallendach?“ – dieselbe Rechenlogik wie
 * /rechner/gewerbe-pv (stündliche Jahressimulation, Netto-Richtpreise),
 * nur mit vier Eingaben. Standorte: PVGIS-Werte der Landeshauptstädte (Props).
 *
 * props: standorte [{ slug, name, sued35, ostwest15, flach10 }]
 */
export default function GewerbePvMini({ standorte = [] }) {
  const [flaeche, setFlaeche] = useState(3000);
  const [dachart, setDachart] = useState("ost-west");
  const [verbrauch, setVerbrauch] = useState(400000);
  const [ort, setOrt] = useState(standorte.find((s) => s.slug === "linz")?.slug || standorte[0]?.slug);

  const eingabe = useDeferredValue({ flaeche, dachart, verbrauch, ort });
  const r = useMemo(() => {
    const s = standorte.find((x) => x.slug === eingabe.ort) || standorte[0];
    const kwp = Math.max(10, Math.round(kwpAusFlaeche(eingabe.flaeche, eingabe.dachart)));
    return rechneGewerbePv({ kwp, dachart: eingabe.dachart, standort: s, verbrauchKwh: eingabe.verbrauch, typ: "gewerbe", betriebstage: 5, schichten: 1, profil: false });
  }, [eingabe, standorte]);

  const quote = Math.round(r.eigenverbrauchsquote * 100);
  const autarkie = Math.round(r.autarkie * 100);

  return (
    <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70 lg:grid-cols-[1fr_1.05fr]">
      {/* Eingaben */}
      <div className="space-y-7 p-6 md:p-9">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
            <Calculator aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">Ihr Hallendach in Zahlen</p>
            <p className="text-[13px] text-ink-500">Vier Angaben, Richtwerte in Echtzeit</p>
          </div>
        </div>
        <Regler label="Nutzbare Dachfläche" wert={flaeche} min={500} max={20000} step={250} einheit="m²" onChange={setFlaeche} />
        <Auswahl legende="Dach" optionen={DACHARTEN} wert={dachart} onChange={setDachart} klein />
        <Regler
          label="Stromverbrauch pro Jahr"
          wert={verbrauch}
          min={50000}
          max={3000000}
          step={10000}
          onChange={setVerbrauch}
          format={(v) => (v >= 1000000 ? `${fmt(v / 1000000, 2)} GWh` : `${fmt(v / 1000)} MWh`)}
        />
        <div>
          <label htmlFor="gpv-ort" className="mb-2.5 block text-[14.5px] font-semibold text-ink-800">
            Standort (PVGIS)
          </label>
          <select
            id="gpv-ort"
            value={ort}
            onChange={(e) => setOrt(e.target.value)}
            className="h-12 w-full cursor-pointer rounded-2xl bg-ink-100/80 px-4 text-[15px] font-medium text-ink-900 ring-1 ring-inset ring-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
          >
            {standorte.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ergebnis */}
      <div className="ov-noise relative isolate overflow-hidden bg-navy-950 p-6 text-white md:p-9">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-60" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-ov-500/25 blur-[110px]" />
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">Richtwert für Ihr Dach</p>
        <p className="mt-3 font-display text-[clamp(2.6rem,2rem+2.4vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">
          <Zahl wert={r.kwp} /> <span className="text-[0.45em] font-bold text-white/70">kWp</span>
        </p>
        <p className="mt-2 text-[14px] text-white/60">
          rund <Zahl wert={r.flaecheQm} /> m² belegt · TOR Typ {r.tor.typ}
          {r.eag.id ? ` · EAG-Kategorie ${r.eag.id}` : ""}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-3">
          <Wert icon={Sun} label="Jahresertrag">
            <Zahl wert={r.jahresertrag / 1000} /> MWh
          </Wert>
          <Wert icon={Gauge} label="Eigenverbrauch">
            <Zahl wert={quote} /> %
          </Wert>
          <Wert icon={PiggyBank} label="Investition netto">
            <Zahl wert={Math.round(r.investition / 1000)} /> Tsd. €
          </Wert>
          <Wert icon={Timer} label="Amortisation">
            {r.amortisation != null ? (
              <>
                <Zahl wert={r.amortisation} stellen={1} /> J.
              </>
            ) : (
              "> 25 J."
            )}
          </Wert>
        </dl>

        {/* Deckungsbalken */}
        <div className="mt-6">
          <div className="flex justify-between text-[12.5px] text-white/60">
            <span>Anteil Ihres Verbrauchs aus PV</span>
            <span className="ov-num font-semibold text-white">{autarkie} %</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-ov-500 to-ov-300 transition-[width] duration-500" style={{ width: `${autarkie}%` }} />
          </div>
        </div>

        <Link
          href="/rechner/gewerbe-pv"
          className="group mt-8 flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-white px-5 text-[15px] font-semibold text-navy-950 transition-colors hover:bg-ov-50"
        >
          Ausführlich rechnen: Speicher, Leasing, IFB
          <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>
        <p className="mt-4 flex gap-2 text-[12px] leading-relaxed text-white/50">
          <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Branchen-Richtwerte, netto, ohne Förderung; Betrieb 5 Tage, 1 Schicht. Keine Ökovolt-Preise – das Angebot rechnen wir mit Ihrem Lastgang.
        </p>
      </div>
    </div>
  );
}

function Wert({ icon: Icon, label, children, className }) {
  return (
    <div className={cn("rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10", className)}>
      <dt className="flex items-center gap-1.5 text-[12.5px] text-white/60">
        <Icon aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
        {label}
      </dt>
      <dd className="mt-1 whitespace-nowrap font-display text-[22px] font-extrabold tracking-tight md:text-[24px]">{children}</dd>
    </div>
  );
}
