"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { BadgeEuro, BatteryCharging, Factory, Gauge, Leaf, PiggyBank, Receipt, Sun, Timer, TrendingUp, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Schalter, Zahl } from "@/components/Rechner/bausteine";
import { MobilKurz } from "@/components/Rechner/StromspeicherRechner";
import { fmt } from "@/lib/rechner/annahmen";
import { angebotUrl } from "@/lib/rechner/angebot";
import { GEWERBE_PV, GEWERBE_PRESETS, arbeitspreisRichtwertCt, einspeiseSatzCt, kwpAusFlaeche, rechneGewerbePv } from "@/lib/rechner/gewerbepv";
import { VERGUETUNG } from "@/data/einspeiseverguetung";
import { ANNAHMEN } from "@/data/solarrechner";
import { DiagrammKarte, KumuliertDiagramm, Posten, PresetLeiste, StandortWahl, eur } from "./GewerbePVBausteine";
import GewerbePVTagesprofil from "./GewerbePVTagesprofil";

const pct = (v) => Math.round(v * 100);
const mwh = (kwh) => (kwh >= 10000 ? fmt(kwh / 1000) : fmt(kwh / 1000, 1));

export default function GewerbePVRechner({ standorte, startOrt = "linz" }) {
  const orte = useMemo(() => standorte.flatMap((g) => g.orte), [standorte]);
  const [preset, setPreset] = useState("logistik");
  const [modus, setModus] = useState("flaeche");
  const [flaeche, setFlaeche] = useState(6000);
  const [kwpDirekt, setKwpDirekt] = useState(500);
  const [dachart, setDachart] = useState("ost-west");
  const [ortSlug, setOrtSlug] = useState(startOrt);
  const [typ, setTyp] = useState("gewerbe");
  const [verbrauchMwh, setVerbrauchMwh] = useState(450);
  const [tage, setTage] = useState(6);
  const [schichten, setSchichten] = useState(2);
  const [preisManuell, setPreisManuell] = useState(null);
  const [speicherAn, setSpeicherAn] = useState(false);
  const [speicher, setSpeicher] = useState(200);
  const [finanzierung, setFinanzierung] = useState("kauf");
  const [leasingJahre, setLeasingJahre] = useState(GEWERBE_PV.leasingLaufzeitStandard);
  const [leasingZins, setLeasingZins] = useState(GEWERBE_PV.leasingZinsStandard * 100);
  const [eag, setEag] = useState(true);
  const [ifb, setIfb] = useState(true);
  const [einspeiseManuell, setEinspeiseManuell] = useState(null);

  // Werte aus dem Mini-Rechner der Startseite übernehmen (?flaeche=m²&verbrauch=MWh&schichten=1–3).
  // Erst nach dem Laden gelesen, damit die Seite statisch bleibt und nichts falsch hydriert.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const zahl = (k, min, max) => {
      const v = Number(q.get(k));
      return Number.isFinite(v) && v >= min && v <= max ? v : null;
    };
    const f = zahl("flaeche", 100, 50000);
    const v = zahl("verbrauch", 10, 20000);
    const sch = zahl("schichten", 1, 3);
    if (f == null && v == null && sch == null) return;
    setPreset(null);
    if (f != null) { setModus("flaeche"); setFlaeche(Math.round(f)); }
    if (v != null) setVerbrauchMwh(Math.round(v));
    if (sch != null) setSchichten(Math.round(sch));
  }, []);

  const ort = orte.find((o) => o.slug === ortSlug) || orte[0];
  const kwpRoh = modus === "flaeche" ? kwpAusFlaeche(flaeche, dachart) : kwpDirekt;
  const kwp = Math.max(5, Math.round(kwpRoh / 5) * 5);
  const verbrauch = verbrauchMwh * 1000;
  const richtpreis = arbeitspreisRichtwertCt(verbrauch);
  const preisCt = preisManuell ?? richtpreis;
  const satzStandard = einspeiseSatzCt(kwp);
  const einspeiseCt = einspeiseManuell ?? satzStandard;

  const eingabe = {
    kwp,
    dachart,
    standort: ort,
    verbrauchKwh: verbrauch,
    typ,
    betriebstage: tage,
    schichten,
    arbeitspreisCt: preisCt,
    einspeiseCt,
    speicherKwh: speicherAn ? speicher : 0,
    finanzierung,
    leasingJahre,
    leasingZins: leasingZins / 100,
    eag,
    ifb,
  };
  // Ziehen am Regler bleibt flüssig: Simulation mit zurückgestellter Eingabe
  const schluessel = useDeferredValue(JSON.stringify({ ...eingabe, standort: ort.slug }));
  const r = useMemo(() => {
    const w = JSON.parse(schluessel);
    return rechneGewerbePv({ ...w, standort: orte.find((o) => o.slug === w.standort) || orte[0] });
  }, [schluessel, orte]);

  const ladePreset = (p) => {
    setPreset(p.id);
    setModus("flaeche");
    setFlaeche(p.flaeche);
    setDachart(p.dachart);
    setTyp(p.typ);
    setVerbrauchMwh(p.verbrauch / 1000);
    setTage(p.betriebstage);
    setSchichten(p.schichten);
    setSpeicherAn(p.speicher > 0);
    if (p.speicher > 0) setSpeicher(p.speicher);
    setPreisManuell(null);
    setEinspeiseManuell(null);
  };
  const manuell = (fn) => (v) => {
    setPreset(null);
    fn(v);
  };

  // Ergebnis-Anzeige folgt dem (zurückgestellten) Ergebnis, Eingaben dem Zustand
  const leasing = r.leasing != null;
  const leasingEingabe = finanzierung === "leasing";
  const href = angebotUrl({ kwp, verbrauch, speicher: speicherAn ? speicher : 0 });
  const amortText = r.amortisation != null ? `${fmt(r.amortisation, 1).replace(",0", "")} J.` : "–";
  const irrAnzeige = r.irr == null ? "–" : r.irr < 0 ? "< 0 %" : null;

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              ["Anlage", <Zahl key="k" wert={r.kwp} suffix=" kWp" />],
              [leasing ? "Überschuss J. 1" : "Ersparnis/Jahr", <Zahl key="e" wert={Math.round(leasing ? r.cashflow[1].netto : r.nutzenJahr1)} suffix=" €" />],
              [leasing ? "Summe 25 J." : "Amortisation", leasing ? <Zahl key="s" wert={Math.round(r.summe / 1000)} suffix=" T€" /> : amortText],
            ]}
          />

          <div className="space-y-8">
            <PresetLeiste presets={GEWERBE_PRESETS} aktiv={preset} onWahl={ladePreset} />

            <Gruppe titel="Dach & Standort">
              <Auswahl
                legende="Anlagengröße festlegen über"
                wert={modus}
                onChange={setModus}
                optionen={[
                  { id: "flaeche", label: "Dachfläche" },
                  { id: "kwp", label: "kWp direkt" },
                ]}
              />
              {modus === "flaeche" ? (
                <Regler
                  label="Nutzbare Dachfläche"
                  wert={flaeche}
                  min={200}
                  max={20000}
                  step={100}
                  format={(v) => `${fmt(v)} m²`}
                  onChange={manuell(setFlaeche)}
                  hinweis={`ergibt rund ${fmt(kwp)} kWp bei ${fmt(r.qmProKwp)} m² je kWp (${r.dachartLabel})`}
                />
              ) : (
                <Regler label="Anlagengröße" wert={kwpDirekt} min={20} max={2000} step={10} format={(v) => `${fmt(v)} kWp`} onChange={manuell(setKwpDirekt)} hinweis={`Flächenbedarf rund ${fmt(Math.round(r.flaecheQm / 10) * 10)} m²`} />
              )}
              <Auswahl
                legende="Dachart"
                wert={dachart}
                onChange={manuell(setDachart)}
                spalten={2}
                klein
                optionen={GEWERBE_PV.dacharten.map((d) => ({ id: d.id, label: d.label, sub: d.sub }))}
              />
              <StandortWahl
                gruppen={standorte}
                wert={ortSlug}
                onChange={setOrtSlug}
                hinweis={() => `PVGIS für ${ort.name}: ${fmt(r.spezifischerErtrag)} kWh/kWp bei dieser Dachart (Süd 35°: ${fmt(ort.sued35)} kWh/kWp)`}
              />
            </Gruppe>

            <Gruppe titel="Betrieb & Strompreis">
              <Auswahl
                legende="Lastprofil"
                wert={typ}
                onChange={manuell(setTyp)}
                optionen={[
                  { id: "gewerbe", label: "Gewerbe / Industrie" },
                  { id: "landwirtschaft", label: "Landwirtschaft" },
                ]}
              />
              <Regler
                label="Jahresverbrauch"
                wert={verbrauchMwh}
                min={20}
                max={3000}
                step={10}
                format={(v) => `${fmt(v)} MWh`}
                onChange={manuell(setVerbrauchMwh)}
                hinweis="Steht auf der Jahresabrechnung oder im Lastgang Ihres Netzbetreibers."
              />
              {typ === "gewerbe" ? (
                <>
                  <Auswahl
                    legende="Betriebstage"
                    wert={tage}
                    onChange={manuell(setTage)}
                    optionen={[
                      { id: 5, label: "Mo–Fr" },
                      { id: 6, label: "Mo–Sa" },
                      { id: 7, label: "täglich" },
                    ]}
                  />
                  <Auswahl
                    legende="Schichtmodell"
                    wert={schichten}
                    onChange={manuell(setSchichten)}
                    klein
                    optionen={[
                      { id: 1, label: "1 Schicht", sub: "7–16 Uhr" },
                      { id: 2, label: "2 Schichten", sub: "6–22 Uhr" },
                      { id: 3, label: "3 Schichten", sub: "24 h" },
                    ]}
                  />
                </>
              ) : (
                <p className="rounded-2xl bg-white px-4 py-3 text-[13.5px] leading-relaxed text-ink-600 ring-1 ring-ink-200">
                  Profil Milchvieh-/Mischbetrieb: Melken und Milchkühlung morgens und abends, Fütterung tagsüber, sieben Tage – im Sommer mehr Verbrauch durch Heubelüftung und Kühlung.
                </p>
              )}
              <div>
                <Regler
                  label="Arbeitspreis netto (vermeidbar)"
                  wert={preisCt}
                  min={8}
                  max={35}
                  step={0.5}
                  format={(v) => `${fmt(v, 1)} ct/kWh`}
                  onChange={(v) => {
                    setPreset(null);
                    setPreisManuell(v);
                  }}
                  hinweis={`Energie + Netz-Arbeitspreis + Abgaben je kWh, ohne Leistungspreis. Richtwert für ${fmt(verbrauchMwh)} MWh: ${fmt(richtpreis, 1)} ct (Eurostat, 2. Hj. 2025).`}
                />
                {preisManuell != null && Math.abs(preisManuell - richtpreis) > 0.05 && (
                  <button type="button" onClick={() => setPreisManuell(null)} className="mt-2 text-[13px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                    Richtwert übernehmen
                  </button>
                )}
              </div>
            </Gruppe>

            <Gruppe titel="Speicher, Förderung & Finanzierung">
              <Schalter icon={BatteryCharging} label="Gewerbespeicher" beschreibung="Überschuss für Abend und Nacht" an={speicherAn} onChange={manuell(setSpeicherAn)}>
                <Regler label="Kapazität" wert={speicher} min={20} max={1000} step={10} format={(v) => `${fmt(v)} kWh`} onChange={manuell(setSpeicher)} />
              </Schalter>
              <Auswahl
                legende="Finanzierung"
                wert={finanzierung}
                onChange={setFinanzierung}
                optionen={[
                  { id: "kauf", label: "Kauf", sub: "Eigenmittel/Kredit" },
                  { id: "leasing", label: "Leasing", sub: "Rate statt Investition" },
                ]}
              />
              {leasingEingabe && (
                <div className="space-y-5 rounded-2xl bg-white p-4 ring-1 ring-ink-200">
                  <Regler label="Laufzeit" wert={leasingJahre} min={5} max={15} step={1} format={(v) => `${v} Jahre`} onChange={setLeasingJahre} />
                  <Regler
                    label="Zinssatz (Beispielwert)"
                    wert={leasingZins}
                    min={2}
                    max={9}
                    step={0.25}
                    format={(v) => `${fmt(v, 2)} %`}
                    onChange={setLeasingZins}
                    hinweis="Keine Kondition eines Finanzierungspartners – Rate als Annuität ohne Restwert. Konkrete Angebote über unsere Finanzierung."
                  />
                </div>
              )}
              <Schalter
                icon={BadgeEuro}
                label="EAG-Investitionszuschuss"
                beschreibung={r.eag.id ? `Kategorie ${r.eag.id}: ${r.eag.id === "C" || r.eag.id === "D" ? "höchstens " : ""}${r.eag.eurProKwp} €/kWp – nur mit Zuschlag im Fördercall` : "über 1.000 kWp kein Investitionszuschuss"}
                an={eag}
                onChange={setEag}
              />
              <Schalter
                icon={Receipt}
                label={`Investitionsfreibetrag ${pct(ANNAHMEN.ifb.satzOeko)} %`}
                beschreibung={leasingEingabe ? "Bei Leasing steht der IFB meist dem Leasinggeber zu" : `Steuereffekt bei ${pct(ANNAHMEN.ifb.koest)} % KöSt, Anschaffung bis 31.12.2026`}
                an={ifb && !leasingEingabe}
                onChange={(v) => !leasingEingabe && setIfb(v)}
              />
              <div>
                <Regler
                  label="Einspeiseerlös"
                  wert={einspeiseCt}
                  min={0}
                  max={12}
                  step={0.25}
                  format={(v) => `${fmt(v, 2)} ct/kWh`}
                  onChange={(v) => setEinspeiseManuell(v)}
                  hinweis={`Rechensatz ${fmt(satzStandard, 2)} ct, konstant über 25 Jahre. OeMAG-Marktpreis PV zuletzt ${fmt(VERGUETUNG.marktpreis.aktuell.ct, 2)} ct (${VERGUETUNG.marktpreis.aktuell.zeitraum})${r.oemagMoeglich ? "" : " – ab 500 kWp keine OeMAG-Abnahme, Direktvermarktung"}.`}
                />
                {einspeiseManuell != null && Math.abs(einspeiseManuell - satzStandard) > 0.01 && (
                  <button type="button" onClick={() => setEinspeiseManuell(null)} className="mt-2 text-[13px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                    Rechensatz übernehmen
                  </button>
                )}
              </div>
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="min-w-0 p-5 sm:p-6 md:p-8">
          <p className="sr-only" aria-live="polite">
            {`${fmt(r.kwp)} kWp, Eigenverbrauch ${pct(r.eigenverbrauchsquote)} Prozent, Ersparnis im ersten Jahr ${fmt(Math.round(r.nutzenJahr1))} Euro${r.amortisation != null ? `, Amortisation ${fmt(r.amortisation, 1)} Jahre` : ""}`}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Ihr Hallendach bringt</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-ov-50 px-3 py-1 text-[12.5px] font-semibold text-ov-700 ring-1 ring-ov-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ov-500 motion-reduce:animate-none" aria-hidden="true" />
              8.760 h simuliert · PVGIS {ort.name}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kennzahl ton="navy" icon={Factory} label="Anlagengröße" zusatz={`≈ ${fmt(Math.round(r.flaecheQm / 10) * 10)} m² Dach`}>
              <Zahl wert={r.kwp} suffix=" kWp" />
            </Kennzahl>
            <Kennzahl icon={Sun} label="Jahresertrag" zusatz={`${fmt(r.spezifischerErtrag)} kWh je kWp`}>
              <Zahl wert={r.jahresertrag / 1000} stellen={r.jahresertrag < 10000 ? 1 : 0} suffix=" MWh" />
            </Kennzahl>
            <Kennzahl icon={Zap} label="Eigenverbrauch" zusatz={speicherAn ? `ohne Speicher ${pct(r.ohneSpeicher.eigenverbrauchsquote)} %` : `${mwh(r.eigenverbrauch)} MWh selbst genutzt`}>
              <Zahl wert={pct(r.eigenverbrauchsquote)} suffix=" %" />
            </Kennzahl>
            <Kennzahl icon={Gauge} label="Autarkie" zusatz={`Netzbezug ${mwh(r.netzbezug)} MWh`}>
              <Zahl wert={pct(r.autarkie)} suffix=" %" />
            </Kennzahl>
            <Kennzahl ton="gruen" icon={PiggyBank} label={leasing ? "Überschuss Jahr 1" : "Vorteil Jahr 1"} zusatz={leasing ? `nach Leasingrate ${eur(r.leasing.rate)}` : `Ersparnis + Einspeisung − Betrieb`}>
              <Zahl wert={Math.round(leasing ? r.cashflow[1].netto : r.nutzenJahr1)} suffix=" €" />
            </Kennzahl>
            <Kennzahl icon={Timer} label={leasing ? "Laufzeit Leasing" : "Amortisation"} zusatz={leasing ? `danach voller Vorteil` : `Investition ${eur(r.investition)}`}>
              {leasing ? <Zahl wert={r.leasing.jahre} suffix=" Jahre" /> : r.amortisation != null ? <Zahl wert={r.amortisation} stellen={1} suffix=" Jahre" /> : "> 25 J."}
            </Kennzahl>
            <Kennzahl icon={TrendingUp} label="Rendite (IRR)" zusatz={leasing ? "bei Leasing ohne Eigenkapital nicht sinnvoll" : r.ifb.aktiv ? `ohne IFB ${r.irrOhneIfb != null ? `${fmt(r.irrOhneIfb * 100, 1)} %` : "–"}` : "über 25 Jahre, vor Steuern"}>
              {irrAnzeige ?? <Zahl wert={r.irr * 100} stellen={1} suffix=" %" />}
            </Kennzahl>
            <Kennzahl icon={Leaf} label="CO₂ vermieden" zusatz="pro Jahr (Substitution)">
              <Zahl wert={r.co2Tonnen} stellen={r.co2Tonnen < 100 ? 1 : 0} suffix=" t" />
            </Kennzahl>
          </div>

          <DiagrammKarte
            titel={`Kumulierter Cashflow über ${r.jahre} Jahre`}
            rechts={
              <span className="ov-num text-[13px] text-ink-500">
                nach {r.jahre} Jahren <strong className={cn("font-display text-[15px]", r.summe >= 0 ? "text-ov-700" : "text-ink-900")}>{eur(r.summe)}</strong>
              </span>
            }
            fuss={
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-ink-600">
                <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-[#b9c2d0]" />noch im Minus</li>
                <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-[3px] bg-[#7fae4a]" />im Plus</li>
                {r.ifb.aktiv && <li className="ov-num">inkl. IFB-Steuereffekt {eur(r.ifb.steuereffekt)} im Jahr 1</li>}
                {leasing && <li className="ov-num">Leasingrate {eur(r.leasing.rate)}/Jahr bis Jahr {r.leasing.jahre}</li>}
              </ul>
            }
          >
            <KumuliertDiagramm
              reihe={r.cashflow}
              marke={leasing ? null : r.amortisation}
              markeLabel={`Amortisiert · ${amortText}`}
              startLabel={leasing ? "0" : "Start"}
              ariaLabel={`Kumulierter Cashflow über ${r.jahre} Jahre: Start ${eur(r.cashflow[0].kumuliert)}, Ende ${eur(r.summe)}`}
              tooltip={(c) => {
                if (c.jahr === 0) return [[leasing ? "Start Leasing" : "Investition"], ["Stand", eur(c.kumuliert)]];
                const z = [[`Nach ${c.jahr} ${c.jahr === 1 ? "Jahr" : "Jahren"}`], ["Stand", eur(c.kumuliert)], ["Ersparnis", eur(c.ersparnis)], ["Einspeisung", eur(c.einspeisung)], ["Betrieb", eur(-c.betrieb)]];
                if (c.ifb) z.push(["IFB-Effekt", eur(c.ifb)]);
                if (c.rate) z.push(["Leasingrate", eur(-c.rate)]);
                return z;
              }}
            />
          </DiagrammKarte>

          <DiagrammKarte titel="Erzeugung und Last im Tagesverlauf">
            <GewerbePVTagesprofil profil={r.tagesprofil} />
          </DiagrammKarte>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-ink-50 p-5 md:p-6">
              <h3 className="font-display text-[16px] font-bold text-ink-900">Investition {leasing ? "(finanziert)" : ""} netto</h3>
              <dl className="mt-2 divide-y divide-ink-200/70">
                <Posten label={`PV-Anlage ${fmt(r.kwp)} kWp`} wert={eur(r.anlagenpreis)} />
                {r.speicherpreis > 0 && <Posten label={`Speicher ${fmt(speicher)} kWh`} wert={eur(r.speicherpreis)} />}
                {r.zuschuss.summe > 0 && <Posten label={`EAG-Zuschuss Kat. ${r.zuschuss.kategorie}`} wert={eur(-r.zuschuss.summe)} ton="gruen" />}
                <Posten label="Investition" wert={eur(r.investition)} stark />
                {r.ifb.aktiv && <Posten label={`IFB ${pct(r.ifb.satz)} % → Steuereffekt (${pct(r.ifb.koest)} % KöSt)`} wert={eur(r.ifb.steuereffekt)} ton="sonne" />}
              </dl>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
                Richtwerte schlüsselfertig aus der österreichischen Marktstatistik, keine Ökovolt-Preise. {r.ifb.aktiv ? `Der IFB von ${eur(r.ifb.betrag)} wirkt wie eine zusätzliche Betriebsausgabe; die Steuerersparnis ist separat ausgewiesen.` : ""}
              </p>
            </div>
            <div className="rounded-3xl bg-navy-950 p-5 text-white md:p-6">
              <h3 className="font-display text-[16px] font-bold">Technik & Förderung automatisch</h3>
              <dl className="mt-3 space-y-3 text-[14px]">
                <Einordnung label="TOR Stromerzeugungsanlagen" wert={`Typ ${r.tor.typ}`} text={r.tor.text} />
                <Einordnung label="EAG-Investitionszuschuss" wert={r.eag.id ? `Kat. ${r.eag.id}` : "–"} text={r.eag.text} />
                <Einordnung label="Flächenbedarf" wert={`${fmt(Math.round(r.flaecheQm / 10) * 10)} m²`} text={`${fmt(r.qmProKwp)} m² je kWp · ${r.dachartLabel}`} />
                <Einordnung label="Überschuss-Vermarktung" wert={r.oemagMoeglich ? "OeMAG" : "Direktverm."} text={r.oemagMoeglich ? "Marktpreis-Abnahme unter 500 kWp möglich" : "ab 500 kWp Direktvermarktung / PPA"} />
              </dl>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] leading-relaxed text-ink-500">
              Orientierung aus stündlicher Jahressimulation mit typischem Lastprofil – kein Angebot. Mit Ihrem echten Lastgang (Smart Meter / Netzbetreiber) rechnen wir exakt.
            </p>
            <Button href={href} size="lg" pfeil className="shrink-0">
              Angebot mit diesen Werten
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Einordnung({ label, wert, text }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <div className="min-w-0">
        <dt className="text-white/60">{label}</dt>
        <p className="mt-0.5 text-[12.5px] leading-snug text-white/55">{text}</p>
      </div>
      <dd className="ov-num shrink-0 rounded-full bg-white/10 px-3 py-1 font-display text-[14px] font-bold text-ov-300">{wert}</dd>
    </div>
  );
}
