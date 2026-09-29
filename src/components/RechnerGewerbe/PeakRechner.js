"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { BatteryCharging, Gauge, PiggyBank, Sparkles, Sun, Timer } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Zahl } from "@/components/Rechner/bausteine";
import { MobilKurz } from "@/components/Rechner/StromspeicherRechner";
import { fmt } from "@/lib/rechner/annahmen";
import { MONATE_LANG } from "@/lib/rechner/profile";
import { angebotUrl } from "@/lib/rechner/angebot";
import {
  NETZBEREICHE,
  PS_ANNAHMEN,
  PS_PRESETS,
  SPITZENARTEN,
  SPITZENFORMEN,
  monatsspitzen,
  netzpreise,
  peakShaving,
  psAusParams,
  psParams,
  psReihen,
} from "@/lib/rechner/peakshaving";
import { DiagrammKarte, GewerbeStil, Hinweis, Karte, LinkTeilen, Liste, LogRegler, Umschalter, Vorlagen, Zahlfeld, euro, menge, useStartAusUrl } from "./GewerbeBausteine";
import { PeakLastkurve, PeakMonate } from "./PeakDiagramme";

const START = PS_PRESETS[0];
const PFAD = "/rechner/peak-shaving";

export default function PeakRechner() {
  const [vorlage, setVorlage] = useState(START.id);
  const [verbrauch, setVerbrauch] = useState(START.verbrauch);
  const [jahresspitze, setJahresspitze] = useState(START.spitze);
  const [form, setForm] = useState(START.form);
  const [eigene, setEigene] = useState(() => monatsspitzen(START.spitze, START.form));
  const [kappung, setKappung] = useState(START.kappung);
  const [schichten, setSchichten] = useState(START.schichten);
  const [art, setArt] = useState(START.art);
  const [bereich, setBereich] = useState(START.bereich);
  const [ne, setNe] = useState(START.ne);
  const [lpEigen, setLpEigen] = useState(null);
  const [kwp, setKwp] = useState(START.kwp);
  const [speicher, setSpeicher] = useState(null); // null = Vorschlag
  const [monatsEditor, setMonatsEditor] = useState(false);
  const [ansicht, setAnsicht] = useState("2026");
  const [monatWahl, setMonatWahl] = useState(null);

  const spitzen = form === "eigen" ? eigene : monatsspitzen(jahresspitze, form);
  const spitzeMax = Math.max(...spitzen);
  const ziel = Math.min(kappung, spitzeMax);

  const ladeVorlage = (v) => {
    setVorlage(v.id);
    setVerbrauch(v.verbrauch);
    setJahresspitze(v.spitze);
    setForm(v.form);
    setEigene(monatsspitzen(v.spitze, v.form));
    setKappung(v.kappung);
    setSchichten(v.schichten);
    setArt(v.art);
    setBereich(v.bereich);
    setNe(v.ne);
    setLpEigen(null);
    setKwp(v.kwp);
    setSpeicher(null);
    setMonatWahl(null);
  };

  useStartAusUrl(psAusParams, (e) => {
    setVorlage(null);
    setVerbrauch(e.verbrauch);
    setForm("eigen");
    setEigene(e.spitzen);
    setJahresspitze(Math.max(...e.spitzen));
    setKappung(e.kappung);
    setSchichten(e.schichten);
    setArt(e.art);
    setBereich(e.bereich);
    setNe(e.ne);
    setLpEigen(e.lp);
    setKwp(e.kwp);
    setSpeicher(e.speicher);
  });

  const eingaben = { verbrauch, spitzen, kappung: ziel, schichten, art, bereich, ne, lp: lpEigen, kwp, speicher };
  const e = useDeferredValue(eingaben);
  const reihen = useMemo(() => psReihen({ verbrauch: e.verbrauch, schichten: e.schichten, kwp: e.kwp }), [e.verbrauch, e.schichten, e.kwp]);
  const spitzenKey = e.spitzen.join("-");
  const r = useMemo(
    () => peakShaving({ ...e, spitzen: spitzenKey.split("-").map(Number) }, reihen),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reihen, spitzenKey, e.kappung, e.art, e.bereich, e.ne, e.lp, e.speicher, e.kwp]
  );

  const netzStandard = netzpreise(bereich, ne);
  const monat = monatWahl ?? r.spitzen.indexOf(Math.max(...r.spitzen));
  const w = r.wirtschaft;
  const kap = r.speicher.kwh;
  const speicherMax = Math.max(1000, Math.ceil((r.vorschlag.kwh * 3) / 100) * 100);
  const href = angebotUrl({ kwp, verbrauch, speicher: kap });

  const setzeSpitze = (v) => {
    setVorlage(null);
    if (form === "eigen") {
      const f = v / Math.max(...eigene);
      setEigene(eigene.map((x) => Math.max(1, Math.round(x * f))));
    }
    setJahresspitze(v);
    // Kappung im gleichen Verhältnis mitführen
    setKappung(Math.max(5, Math.round((ziel * v) / spitzeMax / 5) * 5));
  };
  const setzeMonat = (m, v) => {
    const neu = (form === "eigen" ? eigene : spitzen).slice();
    neu[m] = v;
    setEigene(neu);
    setForm("eigen");
    setJahresspitze(Math.max(...neu));
    setVorlage(null);
  };

  return (
    <Karte>
      <GewerbeStil />
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,410px)_minmax(0,1fr)]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              ["Ersparnis LP/Jahr", <Zahl key="e" wert={Math.round(r.ersparnisLp)} suffix=" €" />],
              ["Speicher", kap > 0 ? <Zahl key="s" wert={kap} suffix=" kWh" /> : "–"],
              ["Amortisation", w.amortisation && w.amortisation <= 25 ? <Zahl key="a" wert={w.amortisation} stellen={1} suffix=" J." /> : kap > 0 ? "> 25 J." : "–"],
            ]}
          />
          <div className="space-y-8">
            <Vorlagen vorlagen={PS_PRESETS} aktiv={vorlage} onWahl={ladeVorlage} />

            <Gruppe titel="Betrieb & Netzanschluss">
              <LogRegler
                label="Jahresstromverbrauch"
                wert={verbrauch}
                min={50000}
                max={10000000}
                format={menge}
                onChange={(v) => {
                  setVerbrauch(v);
                  setVorlage(null);
                }}
              />
              <Auswahl
                legende="Betriebszeit"
                wert={schichten}
                onChange={(v) => {
                  setSchichten(v);
                  setVorlage(null);
                }}
                optionen={[
                  { id: 1, label: "1 Schicht", sub: "7–16 Uhr" },
                  { id: 2, label: "2 Schichten", sub: "6–22 Uhr" },
                  { id: 3, label: "3 Schichten", sub: "24/7" },
                ]}
              />
              <Liste
                label="Netzbereich"
                wert={bereich}
                onChange={(v) => {
                  setBereich(v);
                  setLpEigen(null);
                  setVorlage(null);
                }}
                optionen={NETZBEREICHE.map((b) => ({ id: b.id, label: `${b.label} · ${b.betreiber}` }))}
              />
              <Auswahl
                legende="Netzebene"
                wert={ne}
                onChange={(v) => {
                  setNe(v);
                  setLpEigen(null);
                  setVorlage(null);
                }}
                optionen={[5, 6, 7].map((n) => ({ id: n, label: `NE ${n}`, sub: `${fmt(netzpreise(bereich, n).lp, 2)} €/kW` }))}
              />
              <div className="flex items-end gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-ink-800">Leistungspreis je kW und Jahr</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-ink-500">
                    SNE-V 2026: {fmt(netzStandard.lp, 2)} € · Stand 2026, bitte mit Ihrem Preisblatt prüfen
                  </p>
                </div>
                <Zahlfeld
                  klein
                  ariaLabel="Leistungspreis in Euro je kW und Jahr"
                  className="w-[112px] shrink-0"
                  wert={lpEigen ?? netzStandard.lp}
                  min={0}
                  max={300}
                  step={0.01}
                  einheit="€"
                  onChange={(v) => setLpEigen(Math.abs(v - netzStandard.lp) < 0.005 ? null : v)}
                />
              </div>
            </Gruppe>

            <Gruppe titel="Lastspitzen">
              <Regler
                label="Höchste Viertelstunde im Jahr"
                wert={spitzeMax}
                min={20}
                max={Math.max(2000, spitzeMax)}
                step={5}
                einheit="kW"
                onChange={setzeSpitze}
                hinweis={`Benutzungsdauer ≈ ${fmt(verbrauch / spitzeMax)} h – steht als Monatsmaximum auf der Netzrechnung.`}
              />
              <Auswahl
                legende="Verteilung über das Jahr"
                wert={form}
                klein
                spalten={4}
                onChange={(v) => {
                  setVorlage(null);
                  if (v === "eigen") {
                    setEigene(spitzen);
                    setMonatsEditor(true);
                  }
                  setForm(v);
                }}
                optionen={[...SPITZENFORMEN.map((s) => ({ id: s.id, label: s.kurz })), { id: "eigen", label: "Eigene" }]}
              />
              <div className="rounded-2xl bg-white ring-1 ring-ink-200/70">
                <button
                  type="button"
                  onClick={() => setMonatsEditor(!monatsEditor)}
                  aria-expanded={monatsEditor}
                  className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left text-[13.5px] font-semibold text-ink-800"
                >
                  12 Monatswerte bearbeiten
                  <span className={cn("text-ink-400 transition-transform duration-300", monatsEditor && "rotate-180")} aria-hidden="true">▾</span>
                </button>
                {monatsEditor && (
                  <div className="grid grid-cols-3 gap-2 border-t border-ink-100 p-3">
                    {spitzen.map((s, m) => (
                      <Zahlfeld key={m} klein label={MONATE_LANG[m]} wert={s} min={1} max={20000} step={1} einheit="kW" onChange={(v) => setzeMonat(m, Math.round(v))} />
                    ))}
                  </div>
                )}
              </div>
              <Auswahl
                legende="Form der Spitze"
                wert={art}
                onChange={(v) => {
                  setArt(v);
                  setVorlage(null);
                }}
                optionen={SPITZENARTEN.map((a) => ({ id: a.id, label: a.label, sub: a.sub }))}
              />
            </Gruppe>

            <Gruppe titel="Ziel & Speicher">
              <Regler
                label="Spitze kappen auf"
                wert={ziel}
                min={Math.max(5, Math.round((spitzeMax * 0.4) / 5) * 5)}
                max={spitzeMax}
                step={5}
                einheit="kW"
                onChange={(v) => {
                  setKappung(v);
                  setVorlage(null);
                }}
                hinweis={`−${fmt(spitzeMax - ziel)} kW gegenüber der Jahresspitze (${fmt(((spitzeMax - ziel) / spitzeMax) * 100)} %)`}
              />
              <Regler
                label="PV-Anlage am Standort"
                wert={kwp}
                min={0}
                max={1000}
                step={10}
                format={(v) => (v === 0 ? "keine" : `${fmt(v)} kWp`)}
                minLabel="0"
                maxLabel="1.000 kWp"
                onChange={(v) => {
                  setKwp(v);
                  setVorlage(null);
                }}
              />
              <Regler
                label="Speicher (nutzbar)"
                wert={Math.min(kap, speicherMax)}
                min={0}
                max={speicherMax}
                step={5}
                format={(v) => (v === 0 ? "ohne" : `${fmt(v)} kWh`)}
                minLabel="0"
                maxLabel={`${fmt(speicherMax)} kWh`}
                onChange={(v) => {
                  setSpeicher(v);
                  setVorlage(null);
                }}
              />
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-sun-300/70">
                <p className="flex items-center gap-2 text-[13.5px] leading-snug text-ink-700">
                  <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-sun-500" />
                  <span>
                    Vorschlag für {fmt(ziel)} kW: <strong className="text-ink-900">{fmt(r.vorschlag.kw)} kW / {fmt(r.vorschlag.kwh)} kWh</strong>
                  </span>
                </p>
                {speicher != null && speicher !== r.vorschlag.kwh && (
                  <button type="button" onClick={() => setSpeicher(null)} className="h-9 shrink-0 rounded-full bg-ink-900 px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-ov-600">
                    Übernehmen
                  </button>
                )}
              </div>
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="min-w-0 p-5 sm:p-6 md:p-8">
          <p className="sr-only" aria-live="polite">
            {`Ersparnis Leistungspreis ${Math.round(r.ersparnisLp)} Euro pro Jahr, Speicher ${r.speicher.kw} Kilowatt und ${kap} Kilowattstunden${w.amortisation ? `, Amortisation ${fmt(w.amortisation, 1)} Jahre` : ""}`}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Ihr Ergebnis</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-ov-50 px-3 py-1 text-[12.5px] font-semibold text-ov-700 ring-1 ring-ov-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ov-500 motion-reduce:animate-none" aria-hidden="true" />
              {r.netz.bereich.label} · NE {ne} · {fmt(r.lp, 2)} €/kW
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kennzahl ton="gruen" icon={PiggyBank} label="Ersparnis/Jahr" zusatz={`Leistungspreis, −${fmt(r.senkung, r.senkung < 10 ? 1 : 0)} kW im Mittel`}>
              <Zahl wert={Math.round(r.ersparnisLp)} suffix=" €" />
            </Kennzahl>
            <Kennzahl ton="navy" icon={BatteryCharging} label="Speicher" zusatz={kap > 0 ? `${fmt(r.speicher.kw)} kW Entladeleistung` : "Speicher wählen"}>
              <Zahl wert={kap} suffix=" kWh" />
            </Kennzahl>
            <Kennzahl icon={Sun} label="Mehr PV-Eigenverbrauch" zusatz={r.pv && r.pv.zusaetzlich > 0 ? `≈ ${euro(r.pv.nutzen)} Nutzen/Jahr` : kwp > 0 ? "Speicher wählen" : "keine PV-Anlage"}>
              {r.pv && r.pv.zusaetzlich > 0 ? <Zahl wert={r.pv.zusaetzlich / 1000} stellen={1} suffix=" MWh" /> : "–"}
            </Kennzahl>
            <Kennzahl icon={Timer} label="Amortisation" zusatz={kap > 0 ? `Richtinvest ≈ ${euro(w.invest)}` : "–"}>
              {w.amortisation && w.amortisation <= 25 ? <Zahl wert={w.amortisation} stellen={1} suffix=" Jahre" /> : kap > 0 ? "> 25 Jahre" : "–"}
            </Kennzahl>
          </div>

          {!r.gemessen && (
            <Hinweis ton="warn" titel="Heute wahrscheinlich noch kein Leistungspreis" className="mt-4">
              Auf Netzebene 7 wird die Leistung bis Ende 2026 erst ab mehr als 100.000 kWh Jahresverbrauch oder mehr als 50 kW gemessen; darunter gilt eine Pauschale von {PS_ANNAHMEN.pauschaleNe7} € im Jahr. Die Ersparnis greift mit dem Leistungspreis für alle ab 2027 (Tarifwerte noch offen).
            </Hinweis>
          )}
          {kap > 0 && !r.zielErreicht && (
            <Hinweis ton="warn" titel="Ziel wird nicht in jedem Monat erreicht" className="mt-4">
              Mit {fmt(kap)} kWh bleibt die Spitze im ungünstigsten Monat bei {fmt(Math.max(...r.gekappt))} kW. Eine verpasste Spitze zählt voll – der Vorschlag ({fmt(r.vorschlag.kwh)} kWh) hält das Ziel mit Reserve.
            </Hinweis>
          )}

          <DiagrammKarte
            className="mt-6"
            titel={`Spitzentag im ${MONATE_LANG[monat]}`}
            unter="Modellierter Lastgang in Viertelstunden – antippen für Details"
            rechts={
              <div className="ov-no-scrollbar -mx-1 flex max-w-full gap-1 overflow-x-auto px-1">
                {MONATE_LANG.map((n, m) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setMonatWahl(m)}
                    aria-pressed={m === monat}
                    className={cn("h-8 shrink-0 rounded-full px-2.5 text-[12px] font-semibold transition-colors", m === monat ? "bg-ink-900 text-white" : "text-ink-500 hover:bg-ink-100 hover:text-ink-900")}
                  >
                    {n.slice(0, 3)}
                  </button>
                ))}
              </div>
            }
          >
            <PeakLastkurve kurve={r.tage[monat]} schwelle={ziel} erreicht={r.gekappt[monat]} leistung={r.speicher.kw} monat={monat} />
          </DiagrammKarte>

          <DiagrammKarte
            className="mt-5"
            titel={ansicht === "2026" ? "Monatsspitzen vorher und nachher" : "Struktur ab 2027: jeder Monat einzeln"}
            unter={
              ansicht === "2026"
                ? `2026: Ø der 12 Monatsmaxima × ${fmt(r.lp, 2)} €/kW → ${fmt(r.ohneMittel)} kW statt ${fmt(r.mitMittel)} kW`
                : "Monatsmaximum × Monatsleistungspreis (ElWG, SNE-G-V-Entwurf) – Tarifwerte 2027 stehen aus"
            }
            rechts={<Umschalter label="Abrechnung" wert={ansicht} onChange={setAnsicht} optionen={[{ id: "2026", label: "2026" }, { id: "2027", label: "ab 2027" }]} />}
          >
            <PeakMonate spitzen={r.spitzen} gekappt={r.gekappt} ziel={ziel} lp={r.lp} ansicht={ansicht} monat={monat} onMonat={setMonatWahl} />
          </DiagrammKarte>

          <div className="mt-5 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl bg-ink-50 p-5 md:p-6">
              <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                <Gauge aria-hidden="true" className="h-4 w-4 text-ov-600" /> Wirtschaftlichkeit pro Jahr
              </h3>
              <dl className="mt-3 divide-y divide-ink-200/70 text-[14px]">
                <Zeile k="Ersparnis Leistungspreis" v={euro(r.ersparnisLp)} />
                <Zeile k="PV-Überschuss selbst genutzt" v={kwp > 0 ? euro(w.pvNutzen) : "–"} />
                <Zeile k="Ladeverluste Peak Shaving" v={`−${euro(w.verlustPs)}`} leise />
                <Zeile k="Wartung, Versicherung, Software" v={`−${euro(w.betrieb)}`} leise />
                <Zeile k="Nettonutzen" v={euro(w.netto)} stark />
              </dl>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
                Bezug {fmt(w.bezug * 100, 1)} ct/kWh netto (vermeidbar), Einspeisung {fmt(w.einspeisung * 100, 1)} ct/kWh, Wirkungsgrad {fmt(PS_ANNAHMEN.eta * 100)} %.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-3xl bg-navy-950 p-5 text-white md:p-6">
                <p className="flex items-center justify-between gap-2 text-[12.5px] font-medium text-white/70">
                  Richtinvest Speicher
                  <span className="rounded-full bg-sun-400 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-navy-950">Richtwert</span>
                </p>
                <p className="mt-1 font-display text-[28px] font-extrabold tracking-tight">
                  <Zahl wert={w.invest} suffix=" €" />
                </p>
                <p className="text-[12.5px] leading-snug text-white/70">
                  {kap > 0 ? `${fmt(kap)} kWh × ${fmt(r.speicher.preisKwh)} €/kWh netto, schlüsselfertig` : "kein Speicher gewählt"}
                </p>
              </div>
              <Hinweis ton="gruen" titel="EAG-Investitionszuschuss">
                {w.foerderung > 0 ? (
                  <>
                    Speicher mit PV: 150 €/kWh bis 50 kWh – hier bis zu <strong>{euro(w.foerderung)}</strong>
                    {w.amortisationFoerderung && w.amortisationFoerderung <= 25 ? `, Amortisation dann ≈ ${fmt(w.amortisationFoerderung, 1)} Jahre` : ""}. Nur im Fördercall, kein Rechtsanspruch.
                  </>
                ) : (
                  <>Speicher werden nur gemeinsam mit einer PV-Anlage gefördert (150 €/kWh bis 50 kWh, Fördercall 8.–22. Oktober 2026).</>
                )}
              </Hinweis>
            </div>
          </div>

          <Hinweis ton="recht" titel="Ab 1. Jänner 2027: Leistungspreis jeden Monat – auch auf Netzebene 7" className="mt-5">
            Laut ElWG und SNE-G-V-Entwurf wird das Monatsmaximum mit einem Monatsleistungspreis verrechnet, auf NE 7 mit zwei Preisstufen (bis 10 kW und darüber), mindestens 20 % der vereinbarten Leistung. Dargestellt ist nur die Struktur; die Tarifwerte 2027 folgen mit der SNE-T-V.
          </Hinweis>

          <div className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] leading-relaxed text-ink-500">
              Modellierter Lastgang, Richtwerte – kein Angebot. Mit Ihren 35.040 Viertelstundenwerten rechnen wir exakt.
            </p>
            <Button href={href} size="lg" pfeil className="shrink-0">
              Lastgang prüfen lassen
            </Button>
          </div>
          <div className="mt-4">
            <LinkTeilen
              pfad={PFAD}
              query={psParams(eingaben)}
              titel="Peak-Shaving-Rechner: Leistungspreis senken"
              text="So viel Leistungspreis spart Peak Shaving bei diesen Werten – gerechnet mit dem Ökovolt Peak-Shaving-Rechner."
              kampagne="rechner_peak_shaving"
            />
          </div>
        </div>
      </div>
    </Karte>
  );
}

function Zeile({ k, v, stark, leise }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className={cn(stark ? "font-semibold text-ink-900" : "text-ink-600")}>{k}</dt>
      <dd className={cn("ov-num shrink-0 text-right", stark ? "font-display text-[17px] font-extrabold text-ov-700" : leise ? "text-ink-500" : "font-semibold text-ink-900")}>{v}</dd>
    </div>
  );
}
