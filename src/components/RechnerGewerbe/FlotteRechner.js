"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgePercent,
  Building2,
  CalendarClock,
  CarFront,
  Gauge,
  HandCoins,
  HandHeart,
  Leaf,
  PiggyBank,
  PlugZap,
  Receipt,
  Settings2,
  Sun,
  Truck,
  UserRound,
  Wrench,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Schalter, Zahl } from "@/components/Rechner/bausteine";
import { MobilKurz } from "@/components/Rechner/StromspeicherRechner";
import { Aufklapper, ErgebnisLink, Hinweis, NaechsteSchritte, PresetLeiste, Stepper, useGeteilteEingaben } from "./FlotteLadeBausteine";
import FlotteTcoDiagramm, { eurKurz } from "./FlotteTcoDiagramm";
import {
  FLOTTE,
  KLASSEN,
  MAUT,
  PRESETS,
  SACHBEZUG,
  flotteAusParams,
  flotteQuery,
  presetEingaben,
  rechneFlotte,
  sachbezug,
  vorsteuerEPkw,
} from "@/lib/rechner/eflotte";
import { fmt, fmtEur } from "@/lib/rechner/annahmen";

const KLASSEN_ICON = { pkw: CarFront, transporter: Truck, lkw: Truck };
const PRESET_ICON = { handwerk: Wrench, vertrieb: Gauge, logistik: Truck, pflege: HandHeart, gemeinde: Building2 };

const euro = (v) => `${fmt(v)} €`;

export default function FlotteRechner() {
  const [e, setE] = useState(() => presetEingaben("handwerk"));
  const r = useMemo(() => rechneFlotte(e), [e]);

  useGeteilteEingaben(flotteAusParams, setE);

  const setze = (k, v) => setE((x) => ({ ...x, [k]: v, preset: "individuell" }));
  const setzeKlasse = (id, k, v) => setE((x) => ({ ...x, [id]: { ...x[id], [k]: v }, preset: "individuell" }));
  const waehlePreset = (id) => setE(presetEingaben(id));

  const vorteil = r.tcoErsparnis >= 0;
  const leer = r.summe.n === 0;
  const pkw = e.pkw;
  const bruttoE = pkw.preis + pkw.mehrpreis;
  const vst = vorsteuerEPkw(bruttoE);
  const sb = sachbezug(bruttoE, pkw.preis);
  const angebotHref = `/angebot?objekt=gewerbe&wallbox=1${e.pv && e.kwp > 0 ? `&kwp=${Math.round(e.kwp)}` : ""}`;
  // Übergabe an den Ladeinfrastruktur-Planer: Pkw + Transporter als Depotflotte (Lkw laden an DC)
  const depot = ["pkw", "transporter"].map((id) => r.klassen[id]).filter((k) => k && k.n > 0);
  const depotN = depot.reduce((a, k) => a + k.n, 0);
  const depotKm = depot.reduce((a, k) => a + k.km, 0);
  const depotKwh = depot.reduce((a, k) => a + k.kwh, 0);
  const ladeHref = `/rechner/ladeinfrastruktur?${new URLSearchParams({
    z: "individuell",
    fa: depotN > 0 ? "1" : "0",
    fn: String(depotN),
    fk: String(Math.max(10, Math.round(depotKm / Math.max(1, depotN) / FLOTTE.betriebstage / 10) * 10)),
    fv: String(Math.round((depotKwh / Math.max(1, depotKm)) * 100) || 20),
    pv: String(e.pv ? e.kwp : 0),
  }).toString()}`;

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      {/* ---------------- Presets ---------------- */}
      <div className="border-b border-ink-100 bg-white px-5 pb-5 pt-5 sm:px-6 md:px-8 md:pt-7">
        <PresetLeiste presets={PRESETS} aktiv={e.preset} onWahl={waehlePreset} icons={PRESET_ICON} titel="Ihr Betrieb – Beispiel wählen, dann anpassen" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              [vorteil ? `Vorteil ${r.jahre} J.` : `Mehrkosten ${r.jahre} J.`, <span key="t">{eurKurz(Math.abs(r.tcoErsparnis))}</span>],
              ["Ersparnis/Jahr", <span key="j">{eurKurz(r.ersparnisJahr)}</span>],
              ["CO₂ weniger", <Zahl key="c" wert={r.co2Ersparnis / 1000} stellen={1} suffix=" t" />],
            ]}
          />

          <div className="space-y-8">
            <Gruppe titel="Fuhrpark">
              {["pkw", "transporter", "lkw"].map((id) => (
                <FahrzeugKarte key={id} id={id} f={e[id]} e={e} setzeKlasse={setzeKlasse} setze={setze} />
              ))}
            </Gruppe>

            <Gruppe titel="Energie & Laden">
              <Regler
                label="Dieselpreis (Tankstelle, brutto)"
                wert={e.diesel}
                min={1.4}
                max={2.8}
                step={0.01}
                format={(v) => `${fmt(v, 2)} €/l`}
                minLabel="1,40 €"
                maxLabel="2,80 €"
                onChange={(v) => setze("diesel", v)}
              />
              <Regler
                label="Strompreis im Betrieb (netto)"
                wert={e.stromCt}
                min={10}
                max={35}
                step={0.5}
                format={(v) => `${fmt(v, v % 1 ? 1 : 0)} ct/kWh`}
                minLabel="10 ct"
                maxLabel="35 ct"
                onChange={(v) => setze("stromCt", v)}
                hinweis="Inkl. Netz und Abgaben, ohne USt. – typisch 17–26 ct."
              />
              <Regler
                label="Anteil geladen am Betrieb"
                wert={e.ladeanteil}
                min={0}
                max={100}
                step={5}
                format={(v) => `${v} %`}
                onChange={(v) => setze("ladeanteil", v)}
                hinweis={`Rest öffentlich zu ${fmt(e.oeffentlichCt)} ct/kWh netto.`}
              />
              <Aufklapper icon={Settings2} titel="Weitere Preise" zusatz={`Benzin ${fmt(e.benzin, 2)} €/l · öffentlich ${fmt(e.oeffentlichCt)} ct/kWh`}>
                <Regler label="Benzinpreis (brutto)" wert={e.benzin} min={1.4} max={2.8} step={0.01} format={(v) => `${fmt(v, 2)} €/l`} minLabel="1,40 €" maxLabel="2,80 €" onChange={(v) => setze("benzin", v)} />
                <Regler label="Öffentlich laden (netto)" wert={e.oeffentlichCt} min={25} max={70} step={1} format={(v) => `${v} ct/kWh`} minLabel="25 ct" maxLabel="70 ct" onChange={(v) => setze("oeffentlichCt", v)} />
              </Aufklapper>
            </Gruppe>

            <Gruppe titel="Photovoltaik">
              <Schalter
                icon={Sun}
                label="Eigene PV-Anlage am Standort"
                beschreibung={e.pv ? `≈ ${fmt(Math.round((e.kwp * FLOTTE.ertragProKwp) / 1000))} MWh Solarstrom pro Jahr` : "Vorhanden oder geplant"}
                an={e.pv}
                onChange={(v) => setze("pv", v)}
              >
                <div className="space-y-6">
                  <Regler label="Anlagengröße" wert={e.kwp} min={10} max={1000} step={10} format={(v) => `${fmt(v)} kWp`} minLabel="10" maxLabel="1.000 kWp" onChange={(v) => setze("kwp", v)} />
                  <Regler
                    label="Solaranteil am Laden im Betrieb"
                    wert={e.pvAnteil}
                    min={0}
                    max={70}
                    step={5}
                    format={(v) => `${v} %`}
                    onChange={(v) => setze("pvAnteil", v)}
                    hinweis={
                      r.pvMax * 100 < e.pvAnteil
                        ? `Mit ${fmt(e.kwp)} kWp realistisch höchstens ${Math.round(r.pvMax * 100)} % – gerechnet wird mit diesem Wert.`
                        : "Hoch, wenn Fahrzeuge tagsüber am Standort stehen (Überschussladen)."
                    }
                  />
                </div>
              </Schalter>
            </Gruppe>

            <Gruppe titel="Wirtschaftlichkeit & Steuern">
              <Regler label="Nutzungsdauer" wert={e.jahre} min={3} max={12} step={1} format={(v) => `${v} Jahre`} minLabel="3" maxLabel="12 Jahre" onChange={(v) => setze("jahre", v)} />
              <Aufklapper icon={HandCoins} titel="Förderung je E-Fahrzeug" zusatz={e.foerderung > 0 ? `${euro(e.foerderung)} eingetragen` : "Bundesprogramm derzeit ausgeschöpft – 0 €"}>
                <Regler
                  label="Zugesagte Förderung"
                  wert={e.foerderung}
                  min={0}
                  max={20000}
                  step={500}
                  format={(v) => (v === 0 ? "keine" : euro(v))}
                  minLabel="0 €"
                  maxLabel="20.000 €"
                  onChange={(v) => setze("foerderung", v)}
                  hinweis="„E-Mobilität für Betriebe“ (eMove Austria) ist ausgeschöpft – nur mit Zusage eintragen, z. B. aus einem Landesprogramm."
                />
              </Aufklapper>
              <Schalter
                icon={BadgePercent}
                label="Öko-Investitionsfreibetrag"
                beschreibung={`${fmt(FLOTTE.ifbSatz * 100)} % für E-Fahrzeuge und Ladestationen bis 31.12.2026`}
                an={e.ifb}
                onChange={(v) => setze("ifb", v)}
              >
                <Auswahl
                  legende="Steuersatz"
                  wert={String(e.steuersatz)}
                  onChange={(v) => setze("steuersatz", Number(v))}
                  klein
                  optionen={[
                    { id: "23", label: "23 %", sub: "GmbH (KöSt)" },
                    { id: "40", label: "40 %", sub: "ESt" },
                    { id: "50", label: "50 %", sub: "ESt" },
                  ]}
                />
              </Schalter>
              <Schalter icon={PlugZap} label="Ladeinfrastruktur mitrechnen" beschreibung={`Richtwert ≈ ${fmtEur(r.lade.kosten)} netto für ${r.lade.punkte} Ladepunkte`} an={e.infra} onChange={(v) => setze("infra", v)} />
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="p-5 sm:p-6 md:p-8">
          <p className="sr-only" aria-live="polite">
            {leer
              ? "Bitte Fahrzeuge eingeben."
              : `${vorteil ? "Vorteil" : "Mehrkosten"} der E-Flotte über ${r.jahre} Jahre ${Math.round(Math.abs(r.tcoErsparnis))} Euro, laufende Ersparnis ${Math.round(r.ersparnisJahr)} Euro pro Jahr, ${fmt(r.co2Ersparnis / 1000, 1)} Tonnen CO2 weniger pro Jahr.`}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Ihr Ergebnis · netto</p>
            <span className="ov-num inline-flex items-center gap-2 rounded-full bg-ink-100 px-3 py-1 text-[12.5px] font-semibold text-ink-600">
              {r.summe.n} Fahrzeuge · {fmt(Math.round(r.summe.km / 1000) * 1000)} km/Jahr
            </span>
          </div>

          {leer ? (
            <div className="mt-4 rounded-3xl bg-ink-50 p-8 text-center text-[15px] text-ink-600 ring-1 ring-ink-200/70">
              Legen Sie links mindestens ein Fahrzeug an – oder wählen Sie oben ein Beispiel.
            </div>
          ) : (
            <>
              {/* Hauptergebnis */}
              <div
                className={cn(
                  "ov-noise relative mt-3 overflow-hidden rounded-3xl p-5 text-white transition-colors duration-500 md:p-7",
                  vorteil ? "bg-gradient-to-br from-ov-500 to-ov-700" : "bg-gradient-to-br from-navy-800 to-navy-950"
                )}
              >
                <div aria-hidden="true" className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-sun-300/30 blur-3xl" />
                <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-[13.5px] font-medium text-white/85">
                      <PiggyBank aria-hidden="true" className="h-4 w-4" />
                      {vorteil ? `Vorteil der E-Flotte über ${r.jahre} Jahre` : `Mehrkosten der E-Flotte über ${r.jahre} Jahre`}
                    </p>
                    <p className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight md:text-[54px]">
                      <Zahl wert={Math.abs(r.tcoErsparnis)} suffix=" €" dauer={700} />
                    </p>
                    <p className="mt-2 text-[13.5px] text-white/80">
                      {r.breakEven === 0
                        ? "Schon ab dem ersten Tag günstiger – vor allem durch Vorsteuerabzug und NoVA-Befreiung."
                        : r.breakEven != null
                          ? `Kostengleichheit nach ${fmt(r.breakEven, 1)} Jahren, danach spart jedes Jahr ${eurKurz(r.ersparnisJahr)}.`
                          : r.amortisation
                            ? `Kostengleichheit erst nach rund ${fmt(r.amortisation, 1)} Jahren – längere Nutzung oder mehr Kilometer verbessern das Ergebnis.`
                            : "Bei diesen Werten spart die E-Flotte im Betrieb nicht."}
                    </p>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-[12px] xl:w-[300px]">
                    {[
                      ["Verbrenner", r.tcoV],
                      ["E-Flotte", r.tcoE],
                    ].map(([l, w]) => (
                      <div key={l} className="rounded-xl bg-white/12 px-3 py-2 ring-1 ring-white/20">
                        <dt className="text-white/75">{l} gesamt</dt>
                        <dd className="ov-num mt-0.5 text-[15px] font-bold">{eurKurz(w)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Kennzahl ton="sand" icon={Receipt} label={r.ersparnisJahr >= 0 ? "Ersparnis/Jahr" : "Mehrkosten/Jahr"} zusatz={`laufend: Energie, Wartung${r.summe.v.maut > 0 ? ", Maut" : ""}`}>
                  <Zahl wert={Math.abs(r.ersparnisJahr)} suffix=" €" />
                </Kennzahl>
                <Kennzahl ton="navy" icon={Leaf} label="CO₂ weniger" zusatz="pro Jahr, inkl. Vorkette">
                  <Zahl wert={r.co2Ersparnis / 1000} stellen={1} suffix=" t" />
                </Kennzahl>
                <Kennzahl icon={Zap} label="Ladeenergie" zusatz={r.summe.kwhPv > 0 ? `davon ${fmt(r.summe.kwhPv / 1000, 1)} MWh Solar` : "pro Jahr"}>
                  <Zahl wert={r.summe.kwh / 1000} stellen={r.summe.kwh < 100000 ? 1 : 0} suffix=" MWh" />
                </Kennzahl>
                <Kennzahl icon={CalendarClock} label="Kosten je 100 km" zusatz={`Verbrenner ${fmt(r.je100.v, 2)} €`}>
                  <Zahl wert={r.je100.e} stellen={2} suffix=" €" />
                </Kennzahl>
              </div>

              <EnergieBalken r={r} />

              <FlotteTcoDiagramm r={r} />

              {!e.pv && r.pvVorschlag && r.pvVorschlag.ersparnis > 200 && (
                <Hinweis ton="gruen" icon={Sun} className="mt-4">
                  Mit einer eigenen PV-Anlage von rund <strong>{fmt(r.pvVorschlag.kwp)} kWp</strong> könnten etwa {Math.round(r.pvVorschlag.anteil * 100)} % des Ladestroms im Betrieb vom Dach kommen – rund{" "}
                  <strong>{fmtEur(r.pvVorschlag.ersparnis)}</strong> weniger Stromkosten pro Jahr.{" "}
                  <button type="button" onClick={() => setE((x) => ({ ...x, pv: true, kwp: r.pvVorschlag.kwp, pvAnteil: Math.floor(r.pvVorschlag.anteil * 20) * 5, preset: "individuell" }))} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                    Übernehmen
                  </button>
                </Hinweis>
              )}

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                <LadeKarte r={r} ladeHref={ladeHref} />
                {pkw.n > 0 ? <MitarbeiterKarte sb={sb} vst={vst} bruttoE={bruttoE} /> : <SteuerKarte r={r} />}
              </div>
            </>
          )}

          {!leer && (
            <NaechsteSchritte
              schritte={[
                  ["Fahrprofile auswerten", "Fahrtenbuch, Standzeiten und Ihr Viertelstunden-Lastgang zeigen, welche Fahrzeuge zuerst umsteigen."],
                  ["Konzept & Netzanfrage", "Ladepunkte, Lastmanagement, PV und Speicher – inklusive Meldung beim Netzbetreiber."],
                  ["Umsetzung & Betrieb", "Montage, Inbetriebnahme, Backend und Wartung aus einer Hand, in ganz Österreich."],
                ]}
            />
          )}

          <div className="mt-7 space-y-4 border-t border-ink-100 pt-6">
            <ErgebnisLink
              pfad="/rechner/e-flotte"
              query={flotteQuery(e)}
              titel="E-Flotte-Rechner – Ergebnis für unseren Fuhrpark"
              text="So viel spart die Umstellung unserer Firmenflotte auf Elektro – gerechnet mit dem Ökovolt E-Flotte-Rechner."
              kampagne="rechner_e_flotte"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-[13px] leading-relaxed text-ink-500">Orientierung mit Richtwerten, netto, ohne Restwert und Finanzierung – kein Angebot und keine Steuerberatung.</p>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button href="/termin?art=video" variant="secondary" size="lg">
                  Beratung
                </Button>
                <Button href={angebotHref} size="lg" pfeil>
                  Konzept anfragen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FahrzeugKarte({ id, f, e, setzeKlasse, setze }) {
  const k = KLASSEN[id];
  const Icon = KLASSEN_ICON[id];
  const g = k.grenzen;
  const an = f.n > 0;
  const pkw = id === "pkw";
  const kraftstoff = pkw ? e.pkwKraftstoff : "diesel";
  const set = (feld) => (v) => setzeKlasse(id, feld, v);
  return (
    <div className={cn("rounded-2xl ring-1 transition-colors duration-300", an ? "bg-white ring-ov-300" : "bg-white/60 ring-ink-200")}>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors", an ? "bg-ov-500 text-white" : "bg-ink-100 text-ink-500")}>
          <Icon aria-hidden="true" className={cn("h-[18px] w-[18px]", id === "lkw" && "scale-x-[-1]")} />
        </span>
        <div className="min-w-0 flex-1">
          <Stepper label={k.label} sub={k.sub} wert={f.n} min={0} max={500} onChange={set("n")} klein />
        </div>
      </div>
      {an && (
        <div className="space-y-5 border-t border-ink-100 px-4 pb-4 pt-4">
          <Regler
            label="Kilometer je Fahrzeug/Jahr"
            wert={f.km}
            min={g.km[0]}
            max={g.km[1]}
            step={g.km[2]}
            format={(v) => `${fmt(v)} km`}
            minLabel={fmt(g.km[0])}
            maxLabel={`${fmt(g.km[1])} km`}
            onChange={set("km")}
          />
          <Aufklapper
            icon={Settings2}
            titel="Verbrauch, Preise & Wartung"
            zusatz={`${fmt(f.liter, 1)} l → ${fmt(f.kwh, f.kwh % 1 ? 1 : 0)} kWh/100 km · Mehrpreis ${fmt(f.mehrpreis)} €`}
          >
            {pkw && (
              <Auswahl
                legende="Verbrenner zum Vergleich"
                wert={kraftstoff}
                onChange={(v) => {
                  setze("pkwKraftstoff", v);
                  setzeKlasse("pkw", "liter", k.liter[v]);
                }}
                klein
                optionen={[
                  { id: "diesel", label: "Diesel" },
                  { id: "benzin", label: "Benzin" },
                ]}
              />
            )}
            <Regler label={`Verbrauch ${kraftstoff === "benzin" ? "Benzin" : "Diesel"}`} wert={f.liter} min={g.liter[0]} max={g.liter[1]} step={g.liter[2]} format={(v) => `${fmt(v, 1)} l/100 km`} minLabel={fmt(g.liter[0], 1)} maxLabel={`${fmt(g.liter[1])} l`} onChange={set("liter")} />
            <Regler
              label="Verbrauch elektrisch"
              wert={f.kwh}
              min={g.kwh[0]}
              max={g.kwh[1]}
              step={g.kwh[2]}
              format={(v) => `${fmt(v, v % 1 ? 1 : 0)} kWh/100 km`}
              minLabel={fmt(g.kwh[0])}
              maxLabel={`${fmt(g.kwh[1])} kWh`}
              onChange={set("kwh")}
              hinweis="Inkl. Ladeverluste (ADAC Ecotest)."
            />
            <Regler
              label={pkw ? "Preis Verbrenner (brutto inkl. NoVA)" : "Preis Verbrenner (netto)"}
              wert={f.preis}
              min={g.preis[0]}
              max={g.preis[1]}
              step={g.preis[2]}
              format={euro}
              minLabel={eurKurz(g.preis[0])}
              maxLabel={eurKurz(g.preis[1])}
              onChange={set("preis")}
            />
            <Regler
              label={pkw ? "Mehrpreis E-Variante (brutto)" : "Mehrpreis E-Variante (netto)"}
              wert={f.mehrpreis}
              min={g.mehrpreis[0]}
              max={g.mehrpreis[1]}
              step={g.mehrpreis[2]}
              format={(v) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${fmt(Math.abs(v))} €`}
              minLabel={eurKurz(g.mehrpreis[0])}
              maxLabel={eurKurz(g.mehrpreis[1])}
              onChange={set("mehrpreis")}
              hinweis={pkw ? "E-Pkw sind NoVA-frei – die Mehrkosten sind oft gering." : undefined}
            />
            <div className="grid grid-cols-2 gap-4">
              <Regler label="Wartung Verbr." wert={f.wartungV} min={0} max={id === "lkw" ? 20000 : 4000} step={id === "lkw" ? 250 : 50} format={(v) => `${fmt(v)} €`} minLabel="0" maxLabel={id === "lkw" ? "20 T€" : "4 T€"} onChange={set("wartungV")} />
              <Regler label="Wartung E" wert={f.wartungE} min={0} max={id === "lkw" ? 20000 : 4000} step={id === "lkw" ? 250 : 50} format={(v) => `${fmt(v)} €`} minLabel="0" maxLabel={id === "lkw" ? "20 T€" : "4 T€"} onChange={set("wartungE")} />
            </div>
            {id === "lkw" && (
              <>
                <Regler
                  label="Anteil mautpflichtige Strecken"
                  wert={f.mautAnteil}
                  min={0}
                  max={100}
                  step={5}
                  format={(v) => `${v} %`}
                  onChange={set("mautAnteil")}
                  hinweis={`GO-Maut 2026: Diesel EURO VI ${fmt(MAUT[f.achsen]?.diesel ?? 0, 3)} €/km, emissionsfrei ${fmt(MAUT[f.achsen]?.e ?? 0, 3)} €/km.`}
                />
                <Auswahl
                  legende="Achsen"
                  wert={String(f.achsen)}
                  onChange={(v) => setzeKlasse("lkw", "achsen", Number(v))}
                  klein
                  optionen={[2, 3, 4].map((a) => ({ id: String(a), label: MAUT[a].label }))}
                />
              </>
            )}
          </Aufklapper>
        </div>
      )}
    </div>
  );
}

function EnergieBalken({ r }) {
  const s = r.summe;
  const teile = [
    ["Netz im Betrieb", s.kwhNetz, "bg-navy-400"],
    ["Solar vom Dach", s.kwhPv, "bg-ov-500"],
    ["Öffentlich", s.kwhOeffentlich, "bg-navy-200"],
  ];
  const gesamt = Math.max(s.kwh, 1);
  return (
    <div className="mt-5 rounded-3xl bg-ink-50 p-5 md:p-6">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[13.5px] font-semibold text-ink-800">Woher der Ladestrom kommt</span>
        <span className="ov-num text-[13px] text-ink-500">{fmt(Math.round(s.kwh / 100) * 100)} kWh/Jahr</span>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-ink-100" role="img" aria-label={teile.map(([l, v]) => `${l} ${Math.round((v / gesamt) * 100)} Prozent`).join(", ")}>
        {teile.map(([l, v, c]) => (
          <div key={l} className={cn("h-full motion-safe:transition-[width] motion-safe:duration-700", c)} style={{ width: `${(v / gesamt) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-ink-600">
        {teile.map(([l, v, c]) => (
          <li key={l} className="flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-full", c)} aria-hidden="true" />
            {l} <span className="ov-num font-semibold text-ink-900">{Math.round((v / gesamt) * 100)} %</span>
          </li>
        ))}
        <li className="ov-num text-ink-500">Solarstrom bewertet mit {fmt(r.pvKostenCt, 1)} ct (entgangene Einspeisung)</li>
      </ul>
    </div>
  );
}

function LadeKarte({ r, ladeHref }) {
  const l = r.lade;
  const zeilen = [
    [l.ac11, "AC 11 kW"],
    [l.ac22, "AC 22 kW"],
    [l.dc50, "DC 50 kW"],
    [l.dc150, "DC 150 kW"],
  ].filter(([n]) => n > 0);
  return (
    <div className="rounded-3xl bg-navy-950 p-5 text-white md:p-6">
      <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">
        <PlugZap aria-hidden="true" className="h-4 w-4" />
        Ladepunkte am Standort
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {zeilen.map(([n, t]) => (
          <span key={t} className="ov-num rounded-full bg-white/10 px-3 py-1.5 text-[14px] font-semibold ring-1 ring-white/15">
            {n} × {t}
          </span>
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
        <div>
          <dt className="text-white/60">Ohne Lastmanagement</dt>
          <dd className="ov-num font-display text-[20px] font-extrabold">{fmt(l.installiert)} kW</dd>
        </div>
        <div>
          <dt className="text-white/60">Mit Lastmanagement</dt>
          <dd className="ov-num font-display text-[20px] font-extrabold text-ov-300">≈ {fmt(l.mitLm)} kW</dd>
        </div>
      </dl>
      <p className="mt-3 text-[13px] leading-relaxed text-white/70">
        Rund {fmt(Math.round(l.energieTag))} kWh je Betriebstag. Dynamisches Lastmanagement verteilt die Leistung über die Standzeit – das spart Anschlussleistung und Leistungspreis.
      </p>
      <Link href={ladeHref} className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:decoration-current">
        Im Ladeinfrastruktur-Planer genau rechnen →
      </Link>
    </div>
  );
}

function MitarbeiterKarte({ sb, vst, bruttoE }) {
  const zeilen = [
    ["2026", sb.e2026, "0 € – steuerfrei"],
    ["2027", sb.e2027, `0,375 %, max. ${SACHBEZUG.e2027.max} €`],
    ["ab 2028", sb.e2028, `0,625 %, max. ${SACHBEZUG.e2028.max} €`],
  ];
  const maxW = Math.max(sb.verbrenner, 1);
  return (
    <div className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 md:p-6">
      <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">
        <UserRound aria-hidden="true" className="h-4 w-4" />
        Sachbezug je Mitarbeiter/Monat
      </p>
      <div className="mt-3 space-y-2.5">
        {zeilen.map(([j, w, t]) => (
          <div key={j}>
            <div className="flex items-baseline justify-between gap-2 text-[13px]">
              <span className="font-semibold text-ink-800">E-Pkw {j}</span>
              <span className="ov-num font-bold text-ink-900">
                {fmtEur(w)} <span className="font-normal text-ink-500">· {t}</span>
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-ov-500 motion-safe:transition-[width] motion-safe:duration-700" style={{ width: `${(w / maxW) * 100}%` }} />
            </div>
          </div>
        ))}
        <div>
          <div className="flex items-baseline justify-between gap-2 text-[13px]">
            <span className="font-semibold text-ink-800">Verbrenner</span>
            <span className="ov-num font-bold text-ink-900">
              {fmtEur(sb.verbrenner)} <span className="font-normal text-ink-500">· 2 %</span>
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full w-full rounded-full bg-ink-400" />
          </div>
        </div>
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
        Vorsteuer E-Pkw ({fmtEur(bruttoE)} brutto):{" "}
        <strong className="text-ink-800">{vst.stufe === "voll" ? "voll abziehbar" : vst.stufe === "teilweise" ? `max. ${fmtEur(vst.vorsteuer)} (40.000–80.000 €)` : "kein Abzug (über 80.000 €)"}</strong>. Verbrenner-Pkw: kein Vorsteuerabzug.
      </p>
    </div>
  );
}

function SteuerKarte({ r }) {
  return (
    <div className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 md:p-6">
      <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">
        <BadgePercent aria-hidden="true" className="h-4 w-4" />
        Steuern & Förderung
      </p>
      <dl className="mt-3 divide-y divide-ink-200/70 text-[13.5px]">
        <div className="flex justify-between gap-3 py-2">
          <dt className="text-ink-600">Öko-IFB (Steuerwirkung)</dt>
          <dd className="ov-num font-semibold text-ink-900">{fmtEur(r.summe.el.ifb)}</dd>
        </div>
        <div className="flex justify-between gap-3 py-2">
          <dt className="text-ink-600">Förderung</dt>
          <dd className="ov-num font-semibold text-ink-900">{fmtEur(r.summe.el.foerderung)}</dd>
        </div>
        {r.summe.v.maut > 0 && (
          <div className="flex justify-between gap-3 py-2">
            <dt className="text-ink-600">GO-Maut weniger/Jahr</dt>
            <dd className="ov-num font-semibold text-ov-700">{fmtEur(r.summe.v.maut - r.summe.el.maut)}</dd>
          </div>
        )}
      </dl>
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">Transporter der Fiskal-Lkw-Liste und Lkw: Vorsteuerabzug für Verbrenner und E-Fahrzeug – beide netto gerechnet.</p>
    </div>
  );
}
