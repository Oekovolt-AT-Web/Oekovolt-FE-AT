"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BatteryCharging,
  Building2,
  CarFront,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  Gauge,
  Hotel,
  Info,
  Landmark,
  PlugZap,
  ShoppingBag,
  Sun,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Schalter, Zahl } from "@/components/Rechner/bausteine";
import { MobilKurz } from "@/components/Rechner/StromspeicherRechner";
import { NaechsteSchritte, PresetLeiste, Stepper, useGeteilteEingaben } from "./FlotteLadeBausteine";
import RechnerTeilen from "@/components/RechnerTeilen/RechnerTeilen";
import LadeKurve, { LADE_FARBEN } from "./LadeKurve";
import {
  GEBAEUDE,
  JAHRESZEITEN,
  KUNDEN_LADEN,
  LADE_PRESETS,
  STANDZEITEN,
  ladeAusParams,
  ladePresetEingaben,
  ladeQuery,
  rechneLadeinfrastruktur,
} from "@/lib/rechner/ladeinfrastruktur";
import { SOLAR, fmt, fmtEur } from "@/lib/rechner/annahmen";
import useRechnerErgebnis from "@/lib/useRechnerErgebnis";

const PRESET_ICON = { gewerbe: Factory, handel: ShoppingBag, logistik: Truck, hotel: Hotel, gemeinde: Landmark };
const FAHRZEUGTYP = [
  { id: "pkw", label: "Pkw", sub: "20 kWh/100 km", kwh: 20 },
  { id: "transporter", label: "Transporter", sub: "30 kWh", kwh: 30 },
  { id: "lkw", label: "Lkw", sub: "130 kWh", kwh: 130 },
];
const typVon = (kwh) => (kwh >= 80 ? "lkw" : kwh >= 26 ? "transporter" : "pkw");
const tausend = (v) => (v >= 10000 ? `${fmt(Math.round(v / 1000))} T€` : fmtEur(v));

export default function LadeRechner() {
  const [e, setE] = useState(() => ladePresetEingaben("gewerbe"));
  const [szenario, setSzenario] = useState("lm");
  const r = useMemo(() => rechneLadeinfrastruktur(e), [e]);

  useGeteilteEingaben(ladeAusParams, setE);

  const setze = (k, v) => setE((x) => ({ ...x, [k]: v, preset: "individuell" }));
  const setzeGruppe = (g, k, v) => setE((x) => ({ ...x, [g]: { ...x[g], [k]: v }, preset: "individuell" }));
  const waehlePreset = (id) => {
    const neu = ladePresetEingaben(id);
    setE(neu);
    setSzenario(neu.speicherKwh > 0 ? "speicher" : "lm");
  };

  const aktivSzenario = szenario === "speicher" && !r.kurven.speicher ? "lm" : szenario;
  const kurve = r.kurven[aktivSzenario] || r.kurven.lm;
  // Speicherleistung (+ laden / − entladen) als Differenz der Netzbezüge mit und ohne Speicher
  const speicherReihe = aktivSzenario === "speicher" ? r.kurven.speicher.netz.map((v, i) => v - r.kurven.lm.netz[i]) : new Array(r.kurven.lm.netz.length).fill(0);
  const spitzeAnzeige = { ohne: r.spitze.ohne, lm: r.spitze.lm, speicher: r.spitze.speicher };
  const auslastung = r.auslegung / r.anschluss;
  const leer = r.punkteGesamt === 0;
  const acPunkte = r.punkte.ac11 + r.punkte.ac22;
  const dcPunkte = r.punkte.dc50 + r.punkte.dc150;

  const STATUS = {
    ok: { ton: "from-ov-500 to-ov-700", icon: CheckCircle2, titel: "Der Anschluss reicht – mit Lastmanagement.", text: `Auch an einem trüben Tag bleiben ${fmt(Math.round(r.anschluss - r.auslegung))} kW Reserve.` },
    knapp: { ton: "from-navy-700 to-navy-950", icon: AlertTriangle, titel: "Es wird knapp am Netzanschluss.", text: "Mit Lastmanagement passt es, aber mit weniger als 10 % Reserve. Früh mit dem Netzbetreiber sprechen." },
    erhoehen: { ton: "from-navy-800 to-navy-950", icon: AlertTriangle, titel: `Anschlusserhöhung um rund ${fmt(r.erhoehungKw)} kW nötig.`, text: e.speicherKwh > 0 ? "Auch mit Lastmanagement und Speicher reicht der Anschluss an einem trüben Tag nicht." : "Auch mit Lastmanagement reicht der Anschluss nicht – ein Speicher kann die Spitze kappen." },
  };
  const s = STATUS[r.status];
  const StatusIcon = s.icon;
  useRechnerErgebnis("ladeinfrastruktur", r);

  // Druckbericht – wird erst beim Klick auf „Als PDF“ berechnet
  const bericht = () => {
    const sz = (liste, id) => liste.find((x) => x.id === id);
    const art = (a) => (a === "dc50" ? "DC 50" : a === "dc150" ? "DC 150" : a === "ac22" ? "AC 22" : "AC 11");
    const js = JAHRESZEITEN[e.jahreszeit];
    return {
      untertitel: `Ladepunkte, Spitzenlast und Netzanschluss · ${fmt(Math.round(r.energieTag))} kWh je Tag`,
      kennzahlen: leer
        ? []
        : [
            ["Ladepunkte", fmt(r.punkteGesamt), [acPunkte ? `${acPunkte} × AC` : null, r.punkte.dc50 ? `${r.punkte.dc50} × DC 50` : null, r.punkte.dc150 ? `${r.punkte.dc150} × DC 150` : null].filter(Boolean).join(" · ")],
            ["Spitze ungesteuert", `${fmt(Math.round(r.spitze.ohne))} kW`, `installiert ${fmt(r.installiert)} kW`],
            [e.speicherKwh > 0 ? "Spitze mit Speicher" : "Spitze gesteuert", `${fmt(Math.round(r.auslegung))} kW`, `${fmt(Math.round(r.spitze.ohne - r.auslegung))} kW weniger`],
            ["Netzanschluss", r.status === "ok" ? "reicht" : r.status === "knapp" ? "knapp" : `+${fmt(r.erhoehungKw)} kW`, `Auslastung ${fmt(Math.round(auslastung * 100))} % am trüben Tag`],
          ],
      eingaben: [
        {
          titel: "Wer lädt am Standort?",
          zeilen: [
            ["Firmenflotte", e.flotte.an ? `${fmt(e.flotte.n)} Fahrzeuge` : "nein", e.flotte.an ? `${fmt(e.flotte.km)} km/Tag · ${fmt(e.flotte.verbrauch)} kWh/100 km · ${sz(STANDZEITEN.flotte, e.flotte.standzeit)?.label} (${sz(STANDZEITEN.flotte, e.flotte.standzeit)?.sub})` : ""],
            ["Mitarbeitende", e.mitarbeitende.an ? `${fmt(e.mitarbeitende.n)} E-Autos` : "nein", e.mitarbeitende.an ? `Arbeitsweg ${fmt(e.mitarbeitende.km)} km · ${sz(STANDZEITEN.mitarbeitende, e.mitarbeitende.standzeit)?.label}` : ""],
            ["Kundschaft & Gäste", e.kunden.an ? `${fmt(e.kunden.vorgaenge)} Ladevorgänge/Tag` : "nein", e.kunden.an ? `${KUNDEN_LADEN[e.kunden.laden]?.label} · ${sz(STANDZEITEN.kunden, e.kunden.oeffnung)?.label}` : ""],
          ],
        },
        {
          titel: "Ladepunkte & Standort",
          zeilen: [
            ["AC-Ladeleistung Flotte & Mitarbeitende", `${e.acKw} kW`],
            ["Vereinbarte Anschlussleistung", `${fmt(e.anschlussKw)} kW`],
            ["Spitzenlast Gebäude", `${fmt(e.gebaeudeKw)} kW`, `Betriebszeiten: ${GEBAEUDE[e.gebaeude]?.label} (${GEBAEUDE[e.gebaeude]?.sub})`],
            ["PV-Anlage am Standort", e.kwp > 0 ? `${fmt(e.kwp)} kWp` : "keine"],
            ["Speicher zur Spitzenkappung", e.speicherKwh > 0 ? `${fmt(e.speicherKwh)} kWh · ${fmt(r.speicherKw)} kW` : "nein"],
          ],
        },
      ],
      ergebnisse: leer
        ? []
        : [
            {
              titel: "Netzanschluss",
              zeilen: [
                ["Status", s.titel],
                ["Auslegung (trüber Tag)", `${fmt(Math.round(r.auslegung))} kW von ${fmt(r.anschluss)} kW`],
                r.vermieden.kw > 0 && ["Vermiedene Anschlusserhöhung", `${fmt(r.vermieden.kw)} kW`, `${tausend(r.vermieden.min)} – ${tausend(r.vermieden.max)} Netzbereitstellungsentgelt`],
                e.kwp > 0 && ["Solar im Auto", `${Math.round(r.pvAnteil * 100)} %`, `${js?.label}stag, ${fmt(Math.round(r.pvInsAuto))} kWh`],
              ],
            },
            {
              titel: "Ladepunkte je Gruppe",
              zeilen: r.gruppen.map((g) => [g.label, `${g.punkte} × ${art(g.art)} kW`, `${fmt(Math.round(g.kwhTag))} kWh/Tag · ${g.id === "kunden" ? `${g.n} Vorgänge` : `${g.n} Fahrzeuge`}`]),
            },
            {
              titel: "Richtkosten netto",
              zeilen: [...r.kosten.posten.map((p) => [p.label, `${tausend(p.min)} – ${tausend(p.max)}`]), ["Summe", `${tausend(r.kosten.min)} – ${tausend(r.kosten.max)}`, "Richtwert"]],
            },
          ],
      hinweise: r.hinweise.map((h) => h.text),
      annahmen: [
        "Tageslastkurve in 96 Viertelstunden aus Standzeiten, Fahrleistung und Gebäudeprofil; Auslegung auf einen trüben Tag – kein gemessener Lastgang.",
        "Lastmanagement verteilt die Ladeleistung dynamisch über die Standzeit.",
        "Richtkosten netto aus der Marktbeobachtung 09/2026 zur Größenordnung – ohne Tiefbau, Trafostation und Netzzutrittsentgelt, keine Ökovolt-Preise.",
        "Netzbereitstellungsentgelt nach Systemnutzungsentgelte-Verordnung (SNE-V) 2026.",
        "Öko-Investitionsfreibetrag 22 % für Ladestationen bei Anschaffung bis 31.12.2026.",
        "Überschlägige Planung – ersetzt keine Netzanfrage und keine Elektroplanung.",
      ],
    };
  };

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="border-b border-ink-100 bg-white px-5 pb-5 pt-5 sm:px-6 md:px-8 md:pt-7">
        <PresetLeiste presets={LADE_PRESETS} aktiv={e.preset} onWahl={waehlePreset} icons={PRESET_ICON} titel="Ihr Standort – Beispiel wählen, dann anpassen" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              ["Ladepunkte", <Zahl key="p" wert={r.punkteGesamt} />],
              ["Spitze mit LM", <Zahl key="s" wert={Math.round(r.auslegung)} suffix=" kW" />],
              ["Anschluss", <span key="a" className={r.status === "ok" ? "text-ov-300" : "text-sun-300"}>{r.status === "ok" ? "reicht" : r.status === "knapp" ? "knapp" : `+${fmt(r.erhoehungKw)} kW`}</span>],
            ]}
          />

          <div className="space-y-8">
            <Gruppe titel="Wer lädt am Standort?">
              <Schalter icon={Truck} label="Firmenflotte" beschreibung={e.flotte.an ? `${e.flotte.n} Fahrzeuge · ${STANDZEITEN.flotte.find((x) => x.id === e.flotte.standzeit)?.sub}` : "Fahrzeuge laden am Betrieb"} an={e.flotte.an} onChange={(v) => setzeGruppe("flotte", "an", v)}>
                <div className="space-y-5">
                  <Stepper label="Fahrzeuge" wert={e.flotte.n} min={0} max={200} onChange={(v) => setzeGruppe("flotte", "n", v)} klein />
                  <Auswahl legende="Fahrzeugtyp" wert={typVon(e.flotte.verbrauch)} onChange={(id) => setzeGruppe("flotte", "verbrauch", FAHRZEUGTYP.find((t) => t.id === id).kwh)} optionen={FAHRZEUGTYP} klein />
                  <Regler label="Kilometer je Fahrzeug/Tag" wert={e.flotte.km} min={10} max={400} step={10} format={(v) => `${fmt(v)} km`} minLabel="10" maxLabel="400 km" onChange={(v) => setzeGruppe("flotte", "km", v)} />
                  <Auswahl legende="Standzeit am Betrieb" wert={e.flotte.standzeit} onChange={(v) => setzeGruppe("flotte", "standzeit", v)} optionen={STANDZEITEN.flotte} klein />
                </div>
              </Schalter>

              <Schalter icon={Users} label="Mitarbeitende" beschreibung={e.mitarbeitende.an ? `${e.mitarbeitende.n} E-Autos · ${STANDZEITEN.mitarbeitende.find((x) => x.id === e.mitarbeitende.standzeit)?.label}` : "Laden während der Arbeitszeit"} an={e.mitarbeitende.an} onChange={(v) => setzeGruppe("mitarbeitende", "an", v)}>
                <div className="space-y-5">
                  <Stepper label="E-Autos der Belegschaft" wert={e.mitarbeitende.n} min={0} max={300} onChange={(v) => setzeGruppe("mitarbeitende", "n", v)} klein />
                  <Regler label="Arbeitsweg hin & zurück" wert={e.mitarbeitende.km} min={5} max={150} step={5} format={(v) => `${fmt(v)} km`} minLabel="5" maxLabel="150 km" onChange={(v) => setzeGruppe("mitarbeitende", "km", v)} />
                  <Auswahl legende="Arbeitszeit" wert={e.mitarbeitende.standzeit} onChange={(v) => setzeGruppe("mitarbeitende", "standzeit", v)} optionen={STANDZEITEN.mitarbeitende} spalten={3} klein />
                </div>
              </Schalter>

              <Schalter icon={ShoppingBag} label="Kundschaft & Gäste" beschreibung={e.kunden.an ? `${e.kunden.vorgaenge} Ladevorgänge/Tag · ${KUNDEN_LADEN[e.kunden.laden].label}` : "Kundenparkplatz, Hotel, öffentlich"} an={e.kunden.an} onChange={(v) => setzeGruppe("kunden", "an", v)}>
                <div className="space-y-5">
                  <Regler label="Ladevorgänge pro Tag" wert={e.kunden.vorgaenge} min={1} max={200} step={1} onChange={(v) => setzeGruppe("kunden", "vorgaenge", v)} minLabel="1" maxLabel="200" />
                  <Auswahl legende="Ladeleistung" wert={e.kunden.laden} onChange={(v) => setzeGruppe("kunden", "laden", v)} optionen={Object.values(KUNDEN_LADEN).map((k) => ({ id: k.id, label: k.label, sub: `≈ ${k.kwh} kWh/Vorgang` }))} klein />
                  <Auswahl legende="Öffnungszeit" wert={e.kunden.oeffnung} onChange={(v) => setzeGruppe("kunden", "oeffnung", v)} optionen={STANDZEITEN.kunden} klein />
                </div>
              </Schalter>
            </Gruppe>

            <Gruppe titel="Ladepunkte">
              <Auswahl
                legende="AC-Ladeleistung für Flotte & Mitarbeitende"
                wert={String(e.acKw)}
                onChange={(v) => setze("acKw", Number(v))}
                optionen={[
                  { id: "11", label: "11 kW", sub: "Standard, netzschonend" },
                  { id: "22", label: "22 kW", sub: "kurze Standzeiten" },
                ]}
              />
            </Gruppe>

            <Gruppe titel="Standort & Netz">
              <Regler label="Vereinbarte Anschlussleistung" wert={e.anschlussKw} min={20} max={1500} step={5} format={(v) => `${fmt(v)} kW`} minLabel="20" maxLabel="1.500 kW" onChange={(v) => setze("anschlussKw", v)} hinweis="Steht im Netzzugangsvertrag bzw. auf der Netzrechnung." />
              <Regler label="Spitzenlast Gebäude" wert={e.gebaeudeKw} min={0} max={1500} step={5} format={(v) => `${fmt(v)} kW`} minLabel="0" maxLabel="1.500 kW" onChange={(v) => setze("gebaeudeKw", v)} hinweis="Höchste Viertelstunde laut Lastgang oder Netzrechnung (Leistungsmessung)." />
              <Auswahl legende="Betriebszeiten Gebäude" wert={e.gebaeude} onChange={(v) => setze("gebaeude", v)} optionen={Object.values(GEBAEUDE)} klein />
              <Regler label="PV-Anlage am Standort" wert={e.kwp} min={0} max={1000} step={10} format={(v) => (v === 0 ? "keine" : `${fmt(v)} kWp`)} minLabel="0" maxLabel="1.000 kWp" onChange={(v) => setze("kwp", v)} />
              <Schalter icon={BatteryCharging} label="Speicher zur Spitzenkappung" beschreibung={e.speicherKwh > 0 ? `${fmt(e.speicherKwh)} kWh · ${fmt(r.speicherKw)} kW` : "Optional, puffert Ladespitzen"} an={e.speicherKwh > 0} onChange={(v) => { setze("speicherKwh", v ? 100 : 0); setSzenario(v ? "speicher" : "lm"); }}>
                <Regler label="Speichergröße" wert={e.speicherKwh} min={10} max={1000} step={10} format={(v) => `${fmt(v)} kWh`} minLabel="10" maxLabel="1.000 kWh" onChange={(v) => setze("speicherKwh", v)} hinweis={`Lade-/Entladeleistung ${fmt(SOLAR.gewerbeSpeicherCRate * 100)} % der Kapazität je Stunde.`} />
              </Schalter>
            </Gruppe>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="p-5 sm:p-6 md:p-8">
          <p className="sr-only" aria-live="polite">
            {leer ? "Bitte mindestens eine Nutzergruppe mit Fahrzeugen anlegen." : `${r.punkteGesamt} Ladepunkte, Spitzenlast ohne Lastmanagement ${Math.round(r.spitze.ohne)} kW, mit Lastmanagement ${Math.round(r.auslegung)} kW, Anschlussleistung ${Math.round(r.anschluss)} kW.`}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Ihr Ladekonzept</p>
            <span className="ov-num inline-flex items-center gap-2 rounded-full bg-ov-50 px-3 py-1 text-[12.5px] font-semibold text-ov-700 ring-1 ring-ov-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ov-500 motion-reduce:animate-none" aria-hidden="true" />
              {fmt(Math.round(r.energieTag))} kWh/Tag · 96 Viertelstunden simuliert
            </span>
          </div>

          {leer ? (
            <div className="mt-4 rounded-3xl bg-ink-50 p-8 text-center text-[15px] text-ink-600 ring-1 ring-ink-200/70">Aktivieren Sie links mindestens eine Nutzergruppe – oder wählen Sie oben ein Beispiel.</div>
          ) : (
            <>
              <div className={cn("ov-noise relative mt-3 overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white transition-colors duration-500 md:p-7", s.ton)}>
                <div aria-hidden="true" className={cn("absolute -right-12 -top-16 h-48 w-48 rounded-full blur-3xl", r.status === "ok" ? "bg-sun-300/30" : "bg-sun-400/25")} />
                <div className="relative grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
                  <div>
                    <p className="flex items-center gap-2 text-[13.5px] font-medium text-white/85">
                      <StatusIcon aria-hidden="true" className={cn("h-4 w-4", r.status !== "ok" && "text-sun-300")} />
                      Netzanschluss {fmt(r.anschluss)} kW
                    </p>
                    <p className="mt-1.5 max-w-xl font-display text-[24px] font-extrabold leading-tight tracking-tight md:text-[30px]">{s.titel}</p>
                    <p className="mt-2 max-w-xl text-[13.5px] text-white/80">{s.text}</p>
                  </div>
                  <div className="min-w-[220px]">
                    <p className="text-[12px] text-white/70">Auslastung am trüben Tag</p>
                    <p className="ov-num font-display text-[34px] font-extrabold leading-none">
                      <Zahl wert={Math.round(auslastung * 100)} suffix=" %" />
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                      <div className={cn("h-full rounded-full motion-safe:transition-[width] motion-safe:duration-700", auslastung > 1 ? "bg-sun-400" : auslastung > 0.9 ? "bg-sun-300" : "bg-white")} style={{ width: `${Math.min(100, auslastung * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <Kennzahl icon={PlugZap} label="Ladepunkte" zusatz={[acPunkte ? `${acPunkte} × AC` : null, r.punkte.dc50 ? `${r.punkte.dc50} × DC 50` : null, r.punkte.dc150 ? `${r.punkte.dc150} × DC 150` : null].filter(Boolean).join(" · ")}>
                  <Zahl wert={r.punkteGesamt} />
                </Kennzahl>
                <Kennzahl ton="sand" icon={Zap} label="Ungesteuert" zusatz={`Spitze · installiert ${fmt(r.installiert)} kW`}>
                  <Zahl wert={Math.round(r.spitze.ohne)} suffix=" kW" />
                </Kennzahl>
                <Kennzahl ton="gruen" icon={Gauge} label={e.speicherKwh > 0 ? "Mit Speicher" : "Gesteuert"} zusatz={`Spitze · ${fmt(Math.round(r.spitze.ohne - r.auslegung))} kW weniger`}>
                  <Zahl wert={Math.round(r.auslegung)} suffix=" kW" />
                </Kennzahl>
                <Kennzahl ton="navy" icon={Sun} label="Solar im Auto" zusatz={e.kwp > 0 ? `${JAHRESZEITEN[e.jahreszeit].label}stag, ${fmt(Math.round(r.pvInsAuto))} kWh` : "ohne PV-Anlage"}>
                  <Zahl wert={Math.round(r.pvAnteil * 100)} suffix=" %" />
                </Kennzahl>
              </div>

              {/* Tageslastkurve */}
              <div className="mt-7 rounded-3xl ring-1 ring-ink-200/70">
                <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 md:px-6">
                  <div>
                    <h3 className="font-display text-[17px] font-bold text-ink-900">Tageslastkurve am Netzanschluss</h3>
                    <p className="text-[12.5px] text-ink-500">Spitze im Bild: {fmt(Math.round(Math.max(...kurve.netz)))} kW · Auslegung auf trüben Tag: {fmt(Math.round(spitzeAnzeige[aktivSzenario] ?? r.auslegung))} kW</p>
                  </div>
                  <div className="inline-flex rounded-full bg-ink-100 p-1" role="group" aria-label="Jahreszeit für PV">
                    {Object.values(JAHRESZEITEN).map((j) => (
                      <button key={j.id} type="button" aria-pressed={e.jahreszeit === j.id} onClick={() => setE((x) => ({ ...x, jahreszeit: j.id }))} className={cn("h-8 rounded-full px-3 text-[12.5px] font-semibold transition-all", e.jahreszeit === j.id ? "bg-white text-ink-900 shadow-[0_2px_8px_-2px_rgba(21,26,36,0.18)]" : "text-ink-600 hover:text-ink-900")}>
                        {j.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="px-5 pt-4 md:px-6" role="tablist" aria-label="Szenario">
                  <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-ink-100/80 p-1.5">
                    {[
                      ["ohne", "Ohne", "Lastmanagement", r.spitze.ohneTag],
                      ["lm", "Mit", "Lastmanagement", r.spitze.lmTag],
                      ["speicher", "Mit LM", "+ Speicher", r.spitze.speicherTag],
                    ].map(([id, a, b, w]) => {
                      const aus = id === "speicher" && !r.kurven.speicher;
                      const an = aktivSzenario === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          role="tab"
                          aria-selected={an}
                          aria-label={`${a} ${b}`}
                          disabled={aus}
                          onClick={() => setSzenario(id)}
                          className={cn(
                            "flex min-h-12 flex-col items-center justify-center rounded-xl px-2 py-1.5 text-center leading-tight transition-all duration-200",
                            an ? "bg-white text-ink-900 shadow-[0_2px_8px_-2px_rgba(21,26,36,0.18)] ring-1 ring-ink-200/70" : "text-ink-600 hover:text-ink-900",
                            aus && "cursor-not-allowed opacity-45 hover:text-ink-600"
                          )}
                        >
                          <span className="text-[13px] font-semibold">
                            {a} <span className="hidden sm:inline">{b}</span>
                          </span>
                          <span className={cn("ov-num text-[12px]", an ? "text-ov-700" : "text-ink-500")}>{aus ? "Speicher wählen" : `${fmt(Math.round(w))} kW`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <LadeKurve
                  gebaeude={r.kurven.gebaeude}
                  laden={kurve.laden}
                  speicher={speicherReihe}
                  pv={r.kurven.pv}
                  anschluss={r.anschluss}
                  gruppen={r.gruppen}
                  label={`Tageslastkurve ${aktivSzenario === "ohne" ? "ohne Lastmanagement" : aktivSzenario === "speicher" ? "mit Lastmanagement und Speicher" : "mit Lastmanagement"}`}
                />
              </div>

              {/* Gruppen */}
              <div className={cn("mt-5 grid gap-3", r.gruppen.length === 3 ? "sm:grid-cols-3" : r.gruppen.length === 2 ? "sm:grid-cols-2" : "")}>
                {r.gruppen.map((g) => (
                  <div key={g.id} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/70">
                    <p className="flex items-center gap-2 text-[13px] font-semibold text-ink-800">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: LADE_FARBEN[g.id] }} aria-hidden="true" />
                      {g.label}
                    </p>
                    <p className="ov-num mt-1.5 font-display text-[20px] font-extrabold text-ink-900">
                      {g.punkte} × {g.art === "dc50" ? "DC 50" : g.art === "dc150" ? "DC 150" : g.art === "ac22" ? "AC 22" : "AC 11"} kW
                    </p>
                    <p className="ov-num mt-0.5 text-[12.5px] leading-snug text-ink-500">
                      {fmt(Math.round(g.kwhTag))} kWh/Tag · {g.standzeit.sub}
                      {g.id === "kunden" ? ` · ${g.n} Vorgänge` : ` · ${g.n} Fahrzeuge`}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <KostenKarte r={r} />
                <HinweisListe hinweise={r.hinweise} />
              </div>
            </>
          )}

          {!leer && (
            <NaechsteSchritte
              schritte={[
                  ["Lastgang auswerten", "Ihre Viertelstundenwerte vom Netzbetreiber oder Smart Meter ersetzen die Annahmen des Planers."],
                  ["Planung & Netzanfrage", "Ladepunkte, Leitungswege, Lastmanagement und Speicher – wir melden beim Netzbetreiber an."],
                  ["Umsetzung & Betrieb", "Montage, Inbetriebnahme, OCPP-Backend und Wartung aus einer Hand, in ganz Österreich."],
                ]}
            />
          )}

          <div className="mt-7 space-y-4 border-t border-ink-100 pt-6">
            <RechnerTeilen
              rechner="ladeinfrastruktur"
              name="Ladeinfrastruktur-Planer"
              bericht={bericht}
              pfad="/rechner/ladeinfrastruktur"
              query={ladeQuery(e)}
              titel="Ladeinfrastruktur-Planer – unser Standort"
              text="Ladepunkte, Spitzenlast und Netzanschluss für unseren Standort – gerechnet mit dem Ökovolt Ladeinfrastruktur-Planer."
              kampagne="rechner_ladeinfrastruktur"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-[13px] leading-relaxed text-ink-500">Überschlägige Planung mit Richtwerten – ersetzt keine Netzanfrage und keine Elektroplanung.</p>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button href="/termin?art=video" variant="secondary" size="lg">
                  Beratung
                </Button>
                <Button href={`/angebot?objekt=gewerbe&wallbox=1${e.kwp > 0 ? `&kwp=${Math.round(e.kwp)}` : ""}`} size="lg" pfeil>
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

function KostenKarte({ r }) {
  const k = r.kosten;
  return (
    <div className="rounded-3xl bg-navy-950 p-5 text-white md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">
          <Building2 aria-hidden="true" className="h-4 w-4" />
          Richtkosten netto
        </p>
        <span className="rounded-full bg-sun-400/15 px-2.5 py-0.5 text-[11.5px] font-semibold text-sun-300 ring-1 ring-sun-400/30">Richtwert</span>
      </div>
      <p className="ov-num mt-2 font-display text-[26px] font-extrabold leading-tight tracking-tight">
        {tausend(k.min)} – {tausend(k.max)}
      </p>
      <ul className="mt-3 divide-y divide-white/10 text-[13px]">
        {k.posten.map((p) => (
          <li key={p.id} className="flex items-baseline justify-between gap-3 py-2">
            <span className="text-white/75">{p.label}</span>
            <span className="ov-num shrink-0 font-semibold">
              {tausend(p.min)} – {tausend(p.max)}
            </span>
          </li>
        ))}
      </ul>
      {r.vermieden.kw > 0 && (
        <p className="mt-3 rounded-2xl bg-ov-500/15 px-3.5 py-2.5 text-[13px] leading-relaxed text-white/85 ring-1 ring-ov-400/30">
          Lastmanagement vermeidet rund <strong className="text-ov-300">{fmt(r.vermieden.kw)} kW</strong> Anschlusserhöhung – das sind {tausend(r.vermieden.min)} bis {tausend(r.vermieden.max)} Netzbereitstellungsentgelt.
        </p>
      )}
      <p className="mt-3 text-[12px] leading-relaxed text-white/50">Ohne Tiefbau, Trafostation und Netzzutrittsentgelt. Keine Ökovolt-Preise – das konkrete Angebot hängt von Leitungswegen und Hardware ab. Öko-IFB 22 % für Ladestationen bis 31.12.2026.</p>
    </div>
  );
}

function HinweisListe({ hinweise }) {
  const ICON = { pflicht: ClipboardCheck, warnung: AlertTriangle, info: Info };
  const TON = { pflicht: "text-navy-600 bg-navy-50", warnung: "text-sun-500 bg-sun-300/20", info: "text-ov-700 bg-ov-50" };
  return (
    <div className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70 md:p-6">
      <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">
        <CarFront aria-hidden="true" className="h-4 w-4" />
        Was Sie beachten müssen
      </p>
      <ul className="mt-3 space-y-3">
        {hinweise.map((h, i) => {
          const Icon = ICON[h.ton] || Info;
          return (
            <li key={i} className="flex gap-3 text-[13px] leading-relaxed text-ink-700">
              <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", TON[h.ton] || TON.info)}>
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
              <span>{h.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
