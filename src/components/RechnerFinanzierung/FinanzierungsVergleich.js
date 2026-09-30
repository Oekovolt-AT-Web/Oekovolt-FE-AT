"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { BadgeEuro, Landmark, Receipt, Scale, Sun } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Schalter } from "@/components/Rechner/bausteine";
import { MobilKurz } from "@/components/Rechner/StromspeicherRechner";
import { Hinweis } from "@/components/RechnerGewerbe/GewerbeBausteine";
import { DiagrammKarte, Umschalter } from "@/components/RechnerGewerbe/GewerbePVBausteine";
import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";
import { einspeiseSatzCt } from "@/lib/rechner/gewerbepv";
import { angebotUrl } from "@/lib/rechner/angebot";
import useRechnerErgebnis from "@/lib/useRechnerErgebnis";
import { FINANZIERUNG as S, MODELLE, amortText, euro, euroKurz, prozent, rechneFinanzierung, zahl } from "@/lib/rechner/finanzierung";
import CashflowKurven from "./CashflowKurven";

const ct = (v) => `${zahl(v, 1)} ct/kWh`;
const pz = (v, st = 1) => `${zahl(v, st)} %`;
const jahreText = (v) => `${v} Jahre`;
const preisStandard = (kwp) => Math.round(preisProKwp(kwp, "gewerbe") / 10) * 10;

const MODELL_TABS = [
  { id: "kredit", label: "Kredit" },
  { id: "leasing", label: "Leasing" },
  { id: "contracting", label: "Contracting" },
  { id: "ppa", label: "PPA" },
];

export default function FinanzierungsVergleich() {
  // Anlage & Strom
  const [kwp, setKwp] = useState(S.kwp);
  const [eurProKwpManuell, setEurProKwp] = useState(null);
  const [ertrag, setErtrag] = useState(S.ertragProKwp);
  const [evQuote, setEvQuote] = useState(S.eigenverbrauchsquote * 100);
  const [strompreis, setStrompreis] = useState(S.strompreisCt);
  const [steigerung, setSteigerung] = useState(S.strompreisSteigerung * 100);
  const [degradation, setDegradation] = useState(S.degradation * 100);
  const [einspeiseManuell, setEinspeise] = useState(null);
  const [kalkZins, setKalkZins] = useState(S.kalkulationszins * 100);
  const [eag, setEag] = useState(S.eag);
  const [ifb, setIfb] = useState(S.ifb);
  // Modelle
  const [tab, setTab] = useState("kredit");
  const [ekAnteil, setEkAnteil] = useState(S.kredit.eigenkapitalAnteil * 100);
  const [kreditZins, setKreditZins] = useState(S.kredit.zins * 100);
  const [kreditJahre, setKreditJahre] = useState(S.kredit.jahre);
  const [leasingFaktor, setLeasingFaktor] = useState(S.leasing.faktor);
  const [leasingJahre, setLeasingJahre] = useState(S.leasing.jahre);
  const [leasingRest, setLeasingRest] = useState(S.leasing.restwert * 100);
  const [coPreis, setCoPreis] = useState(S.contracting.preisCt);
  const [coIndex, setCoIndex] = useState(S.contracting.index * 100);
  const [coJahre, setCoJahre] = useState(S.contracting.jahre);
  const [coUebernahme, setCoUebernahme] = useState(S.contracting.uebernahme * 100);
  const [ppaPreis, setPpaPreis] = useState(S.ppa.preisCt);
  const [ppaIndex, setPpaIndex] = useState(S.ppa.index * 100);
  const [ppaAbnahme, setPpaAbnahme] = useState(S.ppa.abnahme);
  // Diagramm
  const [ansicht, setAnsicht] = useState("kumuliert");
  const [sichtbar, setSichtbar] = useState(() => Object.fromEntries(MODELLE.map((m) => [m.id, true])));

  const eurProKwp = eurProKwpManuell ?? preisStandard(kwp);
  const einspeiseCt = einspeiseManuell ?? einspeiseSatzCt(kwp);

  const eingabe = {
    kwp,
    investition: kwp * eurProKwp,
    ertragProKwp: ertrag,
    eigenverbrauchsquote: evQuote / 100,
    strompreisCt: strompreis,
    einspeiseCt,
    strompreisSteigerung: steigerung / 100,
    degradation: degradation / 100,
    kalkulationszins: kalkZins / 100,
    eag,
    ifb,
    kredit: { eigenkapitalAnteil: ekAnteil / 100, zins: kreditZins / 100, jahre: kreditJahre },
    leasing: { faktor: leasingFaktor, jahre: leasingJahre, restwert: leasingRest / 100 },
    contracting: { preisCt: coPreis, index: coIndex / 100, jahre: coJahre, uebernahme: coUebernahme / 100 },
    ppa: { preisCt: ppaPreis, index: ppaIndex / 100, abnahme: ppaAbnahme },
  };
  // Regler bleiben flüssig: Rechnung mit zurückgestellter Eingabe
  const schluessel = useDeferredValue(JSON.stringify(eingabe));
  const r = useMemo(() => rechneFinanzierung(JSON.parse(schluessel)), [schluessel]);
  useRechnerErgebnis("finanzierungsvergleich", r);

  const b = r.basis;
  const bester = r.modelle.find((m) => m.id === r.besterId);
  const beste = r.modelle.filter((m) => r.besteIds.includes(m.id));
  const kaufGleich = beste.length === 2 && r.besteIds.includes("eigenkapital") && r.besteIds.includes("kredit");
  const besteName = kaufGleich ? "Kauf – Eigenkapital oder Kredit" : beste.map((m) => m.name).join(" / ");
  const besteKurz = kaufGleich ? "Kauf" : beste.map((m) => m.kurz).join(" / ");
  const maxBw = Math.max(...r.modelle.map((m) => Math.abs(m.barwert)), 1);
  const href = angebotUrl({ objekt: "gewerbe", kwp });

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              ["Anlage", `${zahl(kwp)} kWp`],
              ["Investition", euroKurz(b.investition)],
              ["Höchster Barwert", besteKurz],
            ]}
          />

          <div className="space-y-8">
            <Gruppe titel="Anlage & Strom">
              <Regler label="Anlagengröße" wert={kwp} min={30} max={1000} step={10} format={(v) => `${zahl(v)} kWp`} onChange={setKwp} />
              <Regler
                label="Anlagenpreis netto"
                wert={eurProKwp}
                min={500}
                max={1600}
                step={10}
                format={(v) => `${zahl(v)} €/kWp`}
                onChange={setEurProKwp}
                hinweis={
                  eurProKwpManuell == null ? (
                    `Richtwert für ${zahl(kwp)} kWp aus der Marktstatistik – Ihr Angebot ersetzt ihn.`
                  ) : (
                    <button type="button" className="font-semibold text-ov-700 underline underline-offset-2 hover:text-ov-800" onClick={() => setEurProKwp(null)}>
                      Richtwert {zahl(preisStandard(kwp))} €/kWp wiederherstellen
                    </button>
                  )
                }
              />
              <Regler label="Jahresertrag" wert={ertrag} min={700} max={1300} step={10} format={(v) => `${zahl(v)} kWh/kWp`} onChange={setErtrag} />
              <Regler
                label="Eigenverbrauchsquote"
                wert={evQuote}
                min={20}
                max={100}
                step={5}
                format={(v) => pz(v, 0)}
                onChange={setEvQuote}
                hinweis="Anteil des Solarstroms, den Ihr Betrieb selbst nutzt. Stündlich simuliert im Gewerbe-PV-Rechner."
              />
              <Regler label="Strompreis, den PV ersetzt (netto)" wert={strompreis} min={10} max={35} step={0.5} format={ct} onChange={setStrompreis} />
            </Gruppe>

            <details className="group rounded-2xl bg-white ring-1 ring-ink-200">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[14.5px] font-semibold text-ink-800 [&::-webkit-details-marker]:hidden">
                Weitere Annahmen
                <span aria-hidden="true" className="text-ink-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="space-y-6 border-t border-ink-100 px-4 pb-5 pt-4">
                <Regler label="Strompreis-Steigerung" wert={steigerung} min={0} max={5} step={0.5} format={(v) => `${pz(v)} / Jahr`} onChange={setSteigerung} />
                <Regler
                  label="Einspeiseerlös Überschuss"
                  wert={einspeiseCt}
                  min={0}
                  max={12}
                  step={0.1}
                  format={ct}
                  onChange={setEinspeise}
                  hinweis="Marktabhängig, nicht garantiert – Rechensatz auf Basis OeMAG-Marktpreis."
                />
                <Regler label="Leistungsverlust Module" wert={degradation} min={0} max={1} step={0.1} format={(v) => `${pz(v)} / Jahr`} onChange={setDegradation} />
                <Regler
                  label="Kalkulationszins (Barwert)"
                  wert={kalkZins}
                  min={0}
                  max={10}
                  step={0.5}
                  format={(v) => pz(v)}
                  onChange={setKalkZins}
                  hinweis="Ihre Kapitalkosten bzw. Mindestrendite. Damit werden künftige Beträge auf heute abgezinst."
                />
              </div>
            </details>

            <Gruppe titel="Förderung & Steuer (nur Kauf)">
              <Schalter
                icon={BadgeEuro}
                label="EAG-Investitionszuschuss"
                beschreibung={`Höchstsätze 2026, nur in Fördercalls – nächster: ${ANNAHMEN.eagInvestitionszuschuss.naechsterCall}`}
                an={eag}
                onChange={setEag}
              />
              <Schalter
                icon={Receipt}
                label={`Investitionsfreibetrag ${zahl(ANNAHMEN.ifb.satzOeko * 100)} %`}
                beschreibung={`Steuereffekt bei ${zahl(ANNAHMEN.ifb.koest * 100)} % KöSt, Anschaffung bis 31.12.2026`}
                an={ifb}
                onChange={setIfb}
              />
            </Gruppe>

            <Gruppe titel="Annahmen je Modell">
              <Auswahl legende="Modell" optionen={MODELL_TABS} wert={tab} onChange={setTab} klein />
              {tab === "kredit" && (
                <div className="space-y-6">
                  <Regler label="Eigenkapitalanteil" wert={ekAnteil} min={0} max={100} step={5} format={(v) => pz(v, 0)} onChange={setEkAnteil} />
                  <Regler label="Kreditzins (Beispiel)" wert={kreditZins} min={1} max={10} step={0.1} format={(v) => `${pz(v)} p. a.`} onChange={setKreditZins} />
                  <Regler label="Kreditlaufzeit" wert={kreditJahre} min={5} max={20} step={1} format={jahreText} onChange={setKreditJahre} />
                  <p className="text-[13px] leading-relaxed text-ink-500">
                    Rate <strong className="ov-num text-ink-800">{euro(b.kredit.rate)}</strong> je Jahr, Zinsen gesamt{" "}
                    <strong className="ov-num text-ink-800">{euro(b.kredit.zinsen)}</strong>. Kein Angebot – Zinsen hängen von Bank, Bonität und Sicherheiten ab.
                  </p>
                </div>
              )}
              {tab === "leasing" && (
                <div className="space-y-6">
                  <Regler label="Leasingfaktor je Monat" wert={leasingFaktor} min={0.7} max={1.6} step={0.01} format={(v) => `${zahl(v, 2)} %`} onChange={setLeasingFaktor} />
                  <Regler label="Leasinglaufzeit" wert={leasingJahre} min={5} max={15} step={1} format={jahreText} onChange={setLeasingJahre} />
                  <Regler label="Restwert / Kaufoption am Ende" wert={leasingRest} min={0} max={20} step={1} format={(v) => pz(v, 0)} onChange={setLeasingRest} />
                  <p className="text-[13px] leading-relaxed text-ink-500">
                    Rate <strong className="ov-num text-ink-800">{euro(b.leasing.rate / 12)}</strong> je Monat
                    {b.leasing.effektivzins != null && (
                      <>
                        {" "}– entspricht rechnerisch <strong className="ov-num text-ink-800">{pz(b.leasing.effektivzins * 100)}</strong> pro Jahr
                      </>
                    )}
                    . Betrieb und Versicherung trägt hier Ihr Betrieb; den IFB nutzt in der Regel der Leasinggeber.
                  </p>
                </div>
              )}
              {tab === "contracting" && (
                <div className="space-y-6">
                  <Regler label="Contracting-Preis (Beispiel)" wert={coPreis} min={5} max={30} step={0.5} format={ct} onChange={setCoPreis} />
                  <Regler label="Preisindexierung" wert={coIndex} min={0} max={4} step={0.5} format={(v) => `${pz(v)} / Jahr`} onChange={setCoIndex} />
                  <Regler label="Vertragslaufzeit" wert={coJahre} min={10} max={20} step={1} format={jahreText} onChange={setCoJahre} />
                  {coJahre < 20 && (
                    <Regler
                      label="Übernahme am Ende"
                      wert={coUebernahme}
                      min={0}
                      max={30}
                      step={1}
                      format={(v) => `${pz(v, 0)} der Investition`}
                      onChange={setCoUebernahme}
                    />
                  )}
                  <p className="text-[13px] leading-relaxed text-ink-500">
                    Sie zahlen je selbst genutzter kWh; den Überschuss vermarktet der Contractor. Betrieb und Wartung liegen beim Contractor
                    {coJahre < 20 ? `, ab Jahr ${coJahre + 1} gehört die Anlage Ihnen.` : "."}
                  </p>
                </div>
              )}
              {tab === "ppa" && (
                <div className="space-y-6">
                  <Regler label="PPA-Preis (Beispiel)" wert={ppaPreis} min={5} max={25} step={0.5} format={ct} onChange={setPpaPreis} />
                  <Regler label="Preisindexierung" wert={ppaIndex} min={0} max={3} step={0.5} format={(v) => `${pz(v)} / Jahr`} onChange={setPpaIndex} />
                  <Auswahl
                    legende="Abnahme"
                    wert={ppaAbnahme}
                    onChange={setPpaAbnahme}
                    optionen={[
                      { id: "gesamt", label: "Gesamte Erzeugung", sub: "Take-or-pay" },
                      { id: "eigenverbrauch", label: "Nur Eigenverbrauch", sub: "Überschuss beim Anbieter" },
                    ]}
                    klein
                  />
                  <p className="text-[13px] leading-relaxed text-ink-500">Laufzeit 20 Jahre ohne Übernahme – die Anlage bleibt beim Investor.</p>
                </div>
              )}
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnisse ---------------- */}
        <div className="min-w-0 p-5 sm:p-6 md:p-8" aria-live="polite" aria-atomic="false">
          <div className="grid gap-3 sm:grid-cols-3">
            <Kennzahl ton="gruen" icon={Scale} label="Höchster Barwert" zusatz={`${euro(bester.barwert)} bei ${pz(b.kalkulationszins * 100)} Kalkulationszins`}>
              <span className="block whitespace-normal text-[0.78em] leading-tight">{besteName}</span>
            </Kennzahl>
            <Kennzahl icon={Landmark} label="Investition netto" zusatz={b.zuschuss > 0 ? `nach EAG-Zuschuss ${euro(b.zuschuss)}` : `${zahl(eurProKwp)} €/kWp`}>
              {euro(b.investition)}
            </Kennzahl>
            <Kennzahl icon={Sun} label="Stromgestehungskosten" zusatz="bei Kauf, über 20 Jahre abgezinst">
              {b.lcoeCt != null ? ct(b.lcoeCt) : "–"}
            </Kennzahl>
          </div>

          {/* Vergleich je Modell */}
          <div className="mt-6 rounded-3xl ring-1 ring-ink-200/70">
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 md:px-6">
              <h3 className="font-display text-[17px] font-bold text-ink-900">Barwert über 20 Jahre</h3>
              <p className="text-[12.5px] text-ink-500">Vorteil gegenüber Strombezug ohne PV, abgezinst</p>
            </div>
            <ul className="divide-y divide-ink-100 px-5 pb-2 pt-3 md:px-6">
              {r.modelle.map((m) => {
                const anteil = Math.min(Math.abs(m.barwert) / maxBw, 1) * 50;
                const plus = m.barwert >= 0;
                return (
                  <li key={m.id} className="py-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="flex min-w-0 items-center gap-2 text-[14.5px] font-semibold text-ink-900">
                        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.farbe }} />
                        <span className="truncate">{m.name}</span>
                        {r.besteIds.includes(m.id) && <span className="shrink-0 rounded-full bg-ov-50 px-2 py-0.5 text-[11px] font-semibold text-ov-700 ring-1 ring-ov-200">höchster Barwert</span>}
                      </p>
                      <p className={cn("ov-num shrink-0 font-display text-[17px] font-extrabold tracking-tight", plus ? "text-ink-900" : "text-red-700")}>{euro(m.barwert)}</p>
                    </div>
                    {/* Balken um die Nulllinie */}
                    <div aria-hidden="true" className="relative mt-2 h-2.5 rounded-full bg-ink-100">
                      <span className="absolute inset-y-[-3px] left-1/2 w-px bg-ink-300" />
                      <span
                        className="absolute inset-y-0 rounded-full motion-safe:transition-all motion-safe:duration-500"
                        style={{ background: plus ? m.farbe : "#b91c1c", width: `${anteil}%`, ...(plus ? { left: "50%" } : { right: "50%" }) }}
                      />
                    </div>
                    <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[12.5px] sm:grid-cols-4">
                      {[
                        ["Kapital zu Beginn", euro(m.eigenkapital)],
                        ["Jahr 1", euro(m.jahr1)],
                        ["Amortisation", amortText(m.amortisation)],
                        ["Summe 20 J.", euroKurz(m.summe)],
                      ].map(([k, v]) => (
                        <div key={k} className="min-w-0">
                          <dt className="text-ink-500">{k}</dt>
                          <dd className="ov-num whitespace-nowrap font-semibold text-ink-800">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                );
              })}
            </ul>
          </div>

          <DiagrammKarte
            titel="Cashflow-Kurven"
            rechts={
              <Umschalter
                label="Ansicht des Diagramms"
                wert={ansicht}
                onChange={setAnsicht}
                optionen={[
                  { id: "kumuliert", label: "Kumuliert" },
                  { id: "jahr", label: "Je Jahr" },
                ]}
              />
            }
          >
            <CashflowKurven modelle={r.modelle} ansicht={ansicht} sichtbar={sichtbar} onSichtbar={setSichtbar} />
          </DiagrammKarte>

          <Hinweis ton="info" titel="Neutral gerechnet – Modelle am Markt" className="mt-6">
            Alle Preise für Kredit, Leasing, Contracting und PPA sind Beispielwerte, keine Konditionen eines Anbieters. Nicht enthalten: Ertragsteuern außer
            IFB (Abschreibung, Absetzbarkeit von Raten), Bilanzwirkung, Weiterbetrieb nach Jahr 20 – er spricht für Modelle, bei denen die Anlage Ihnen gehört.
          </Hinweis>

          <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-navy-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between md:p-6">
            <p className="max-w-md text-[14.5px] leading-relaxed text-white/80">
              <strong className="text-white">Belastbare Zahlen statt Richtwerten:</strong> Ertrag, Eigenverbrauch und Investition Ihrer Anlage ermitteln wir im
              Angebot – damit vergleichen Sie Finanzierungsangebote auf gleicher Basis.
            </p>
            <Button href={href} variant="primary" pfeil className="shrink-0">
              Angebot mit {zahl(kwp)} kWp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
