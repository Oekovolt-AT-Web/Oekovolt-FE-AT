"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Cable, Coins, Home, Info, LandPlot, Map as KarteIcon, Sun } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Kennzahl, Regler, Zahl } from "@/components/Rechner/bausteine";
import { MobilKurz } from "@/components/Rechner/StromspeicherRechner";
import { fmt } from "@/lib/rechner/annahmen";
import { PACHT, WIDMUNG, rechnePacht } from "@/lib/rechner/pacht";
import { DiagrammKarte, KumuliertDiagramm, PresetLeiste, StandortWahl, eur, useEingeblendet } from "./GewerbePVBausteine";
import useRechnerErgebnis from "@/lib/useRechnerErgebnis";
import RechnerTeilen from "@/components/RechnerTeilen/RechnerTeilen";
import useTeilenStart from "@/components/RechnerTeilen/useTeilenStart";
import { kodiere } from "@/components/RechnerTeilen/kodierung";

export const PACHT_PRESETS = [
  { id: "acker-noe", label: "Acker 10 ha · NÖ", hektar: 10, ort: "st-poelten", konzept: "freiflaeche", abstand: 2 },
  { id: "gruenland-ooe", label: "Grünland 4 ha · OÖ", hektar: 4, ort: "ried-im-innkreis", konzept: "agri-vertikal", abstand: 1 },
  { id: "obst-stmk", label: "Obstbau 3 ha · Stmk.", hektar: 3, ort: "weiz", konzept: "agri-hoch", abstand: 1.5 },
  { id: "deponie-kaernten", label: "Vorbelastet 8 ha · Ktn.", hektar: 8, ort: "villach", konzept: "freiflaeche", abstand: 3 },
];

const STUFE = {
  gut: { label: "kurz", klasse: "bg-ov-500", text: "text-ov-700" },
  pruefen: { label: "prüfen", klasse: "bg-sun-400", text: "text-sun-500" },
  kritisch: { label: "lang", klasse: "bg-[#d9534f]", text: "text-[#b3403c]" },
};

/** Eingaben für geteilte Links (nur Abweichungen vom Start stehen im Link). */
function teilenFelder(orte, startOrt) {
  return [
    { name: "preset", k: "p", typ: "wahl", optionen: [...PACHT_PRESETS.map((p) => p.id), "individuell"], standard: "acker-noe" },
    { name: "hektar", k: "h", typ: "zahl", min: 0.5, max: 50, raster: 0.5, standard: 10 },
    { name: "ort", k: "o", typ: "wahl", optionen: orte.map((o) => o.slug), standard: startOrt },
    { name: "konzept", k: "k", typ: "wahl", optionen: PACHT.konzepte.map((k) => k.id), standard: "freiflaeche" },
    { name: "abstand", k: "a", typ: "zahl", min: 0, max: 15, raster: 0.5, standard: 2 },
    { name: "pacht", k: "pa", typ: "zahl", min: PACHT.pachtMin, max: PACHT.pachtMax, raster: 50, standard: PACHT.pachtStandard },
    { name: "index", k: "i", typ: "zahl", min: 0, max: 4, raster: 0.25, standard: PACHT.indexStandard * 100 },
    { name: "laufzeit", k: "l", typ: "zahl", min: 15, max: 35, raster: 1, standard: PACHT.laufzeitStandard },
  ];
}

export default function PachtRechner({ standorte, startOrt = "st-poelten" }) {
  const orte = useMemo(() => standorte.flatMap((g) => g.orte), [standorte]);
  const [preset, setPreset] = useState("acker-noe");
  const [hektar, setHektar] = useState(10);
  const [ortSlug, setOrtSlug] = useState(startOrt);
  const [konzept, setKonzept] = useState("freiflaeche");
  const [abstand, setAbstand] = useState(2);
  const [pacht, setPacht] = useState(PACHT.pachtStandard);
  const [index, setIndex] = useState(PACHT.indexStandard * 100);
  const [laufzeit, setLaufzeit] = useState(PACHT.laufzeitStandard);

  const ort = orte.find((o) => o.slug === ortSlug) || orte[0];
  const m = (fn) => (v) => {
    setPreset(null);
    fn(v);
  };
  const lade = (p) => {
    setPreset(p.id);
    setHektar(p.hektar);
    setOrtSlug(p.ort);
    setKonzept(p.konzept);
    setAbstand(p.abstand);
  };

  // Geteilter Link: Eingaben wiederherstellen
  const felder = useMemo(() => teilenFelder(orte, startOrt), [orte, startOrt]);
  const setzer = {
    preset: (v) => setPreset(v === "individuell" ? null : v),
    hektar: setHektar,
    ort: setOrtSlug,
    konzept: setKonzept,
    abstand: setAbstand,
    pacht: setPacht,
    index: setIndex,
    laufzeit: setLaufzeit,
  };
  useTeilenStart(felder, (w) => Object.entries(w).forEach(([k, v]) => setzer[k]?.(v)));
  const teilenQuery = kodiere(felder, { preset: preset ?? "individuell", hektar, ort: ortSlug, konzept, abstand, pacht, index, laufzeit });

  const schluessel = useDeferredValue(JSON.stringify({ hektar, ort: ort.slug, konzept, abstandKm: abstand, pachtEurHa: pacht, index: index / 100, laufzeit }));
  const r = useMemo(() => {
    const w = JSON.parse(schluessel);
    return rechnePacht({ ...w, standort: orte.find((o) => o.slug === w.ort) || orte[0] });
  }, [schluessel, orte]);
  const stufe = STUFE[r.netz.stufe];
  const widmung = WIDMUNG[ort.land];
  useRechnerErgebnis("freiflaeche-pacht", r);

  // Druckbericht – wird erst beim Klick auf „Als PDF“ berechnet
  const bericht = () => ({
    untertitel: `Photovoltaik auf der Freifläche · ${ort.name}, ${ort.landName}`,
    kennzahlen: [
      ["Leistung", `${fmt(r.kwp / 1000, r.kwp < 10000 ? 1 : 0)} MWp`, `${fmt(r.konzept.kwpProHa)} kWp je Hektar`],
      ["Jahresertrag", `${fmt(r.ertragKwh / 1e6, r.ertragKwh < 1e7 ? 2 : 1)} GWh`, `${fmt(r.mwhProHa)} MWh je Hektar`],
      ["Haushalte versorgt", fmt(Math.round(r.haushalte / 10) * 10), `rechnerisch, je ${fmt(PACHT.haushaltKwh)} kWh`],
      [`Pacht ${r.laufzeit} Jahre`, eur(r.pachtSumme), "mit Ihrer Pacht-Annahme"],
    ],
    eingaben: [
      {
        titel: "Fläche",
        zeilen: [
          ["Flächengröße", `${fmt(hektar, hektar % 1 ? 1 : 0)} ha`],
          ["Lage (PVGIS)", `${ort.name}, ${ort.landName}`],
          ["Nutzungskonzept", r.konzept.label],
          ["Entfernung zum Netzanschluss", `${fmt(abstand, abstand % 1 ? 1 : 0)} km (Luftlinie)`],
        ],
      },
      {
        titel: "Ihre Pacht-Annahme",
        zeilen: [
          ["Pacht je Hektar und Jahr", `${fmt(pacht)} €`, "Ihre Annahme, keine Marktangabe"],
          ["Indexierung pro Jahr", `${fmt(index, 2)} %`],
          ["Laufzeit", `${laufzeit} Jahre`],
        ],
      },
    ],
    ergebnisse: [
      {
        titel: "Anlage",
        zeilen: [
          ["Leistung", `${fmt(r.kwp / 1000, 1)} MWp`],
          ["Jahresertrag", `${fmt(r.ertragKwh / 1e6, 2)} GWh`],
          ["Haushalte (bilanziell)", fmt(Math.round(r.haushalte / 10) * 10)],
          ["TOR-Typ", `Typ ${r.tor}`],
        ],
      },
      {
        titel: "Pacht",
        zeilen: [
          ["Pacht im ersten Jahr", eur(r.pachtJahr1)],
          [`Pacht über ${r.laufzeit} Jahre`, eur(r.pachtSumme)],
        ],
      },
      {
        titel: "Netz & Genehmigung",
        zeilen: [
          ["Netzanschluss", `${fmt(abstand, abstand % 1 ? 1 : 0)} km für ${fmt(r.kwp / 1000, 1)} MWp: ${stufe.label}`, "Faustregel, keine Zusage"],
          ["EAG-Abschlag Grünland", r.eagAbschlag ? "−25 % Investitionszuschuss" : "kein Abschlag (Agri-PV ≥ 75 % Landwirtschaft)"],
          r.eagAnteilig && ["Förderweg über 1 MWp", "Zuschuss anteilig bis 1 MWp oder Marktprämie"],
        ],
      },
    ],
    hinweise: [r.netz.text, `Widmung in ${ort.landName}: ${widmung}`, `Landwirtschaft: ${r.konzept.landwirtschaft}`],
    annahmen: [
      `Leistung je Hektar als Richtwert je Konzept (${PACHT.konzepte.map((k) => `${k.label} ${fmt(k.kwpProHa)} kWp/ha`).join(", ")}); tatsächliche Belegung hängt von Zuschnitt, Hangneigung, Abständen und Trafostation ab.`,
      `Ertrag nach PVGIS für ${ort.name}; Vergleichswerte: BOKU Wien, „The techno-economic potentials of agrivoltaic installations in Austria“ (Renewable Energy, 2026).`,
      `Haushalte: Jahresertrag geteilt durch ${fmt(PACHT.haushaltKwh)} kWh (Referenzverbrauch E-Control) – bilanzielle Größe.`,
      `Pacht ${fmt(pacht)} €/ha mit ${fmt(index, 2)} % Indexierung pro Jahr ist Ihre Annahme – keine Marktangabe und kein Angebot.`,
      "Widmung, Netzkapazität, Naturschutz und Geländeform werden im Flächen-Check geprüft.",
    ],
  });

  return (
    <div className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* ---------------- Eingaben ---------------- */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <MobilKurz
            werte={[
              ["Leistung", <Zahl key="k" wert={r.kwp / 1000} stellen={1} suffix=" MWp" />],
              ["Haushalte", <Zahl key="h" wert={Math.round(r.haushalte / 10) * 10} />],
              ["Pacht gesamt*", <Zahl key="p" wert={r.pachtSumme / 1000} suffix=" T€" />],
            ]}
          />
          <div className="space-y-8">
            <PresetLeiste presets={PACHT_PRESETS} aktiv={preset} onWahl={lade} titel="Beispielfläche laden" />

            <Gruppe titel="Ihre Fläche">
              <Regler label="Flächengröße" wert={hektar} min={0.5} max={50} step={0.5} format={(v) => `${fmt(v, v % 1 ? 1 : 0)} ha`} onChange={m(setHektar)} hinweis={`${fmt(hektar * 10000)} m² Projektfläche inkl. Wege, Abstände und Trafostation`} />
              <StandortWahl gruppen={standorte} wert={ortSlug} onChange={m(setOrtSlug)} label="Lage" hinweis={() => `PVGIS ${ort.name}: Süd ${fmt(ort.sued35)} · Ost-West ${fmt(ort.ostwest15)} kWh/kWp`} />
              <Auswahl legende="Nutzungskonzept" wert={konzept} onChange={m(setKonzept)} klein optionen={PACHT.konzepte.map((k) => ({ id: k.id, label: k.label, sub: k.sub }))} />
              <Regler label="Entfernung zum Netzanschluss" wert={abstand} min={0} max={15} step={0.5} format={(v) => `${fmt(v, v % 1 ? 1 : 0)} km`} onChange={m(setAbstand)} hinweis="Luftlinie bis zum nächsten möglichen Anschlusspunkt (Umspannwerk oder Mittelspannungsleitung)." />
            </Gruppe>

            <div className="rounded-3xl bg-white p-5 ring-1 ring-sun-300/80">
              <p className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-sun-500">
                <Info aria-hidden="true" className="h-3.5 w-3.5" />
                Ihre Annahme – keine Marktangabe
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
                Pachthöhen hängen stark von Region, Netznähe, Konzept und Vertrag ab. Stellen Sie Ihren Wert oder ein vorliegendes Angebot ein.
              </p>
              <div className="mt-5 space-y-6">
                <Regler label="Pacht je Hektar und Jahr" wert={pacht} min={PACHT.pachtMin} max={PACHT.pachtMax} step={50} format={(v) => `${fmt(v)} €`} onChange={setPacht} />
                <Regler label="Indexierung pro Jahr" wert={index} min={0} max={4} step={0.25} format={(v) => `${fmt(v, 2)} %`} onChange={setIndex} />
                <Regler label="Laufzeit" wert={laufzeit} min={15} max={35} step={1} format={(v) => `${v} Jahre`} onChange={setLaufzeit} hinweis="Üblich sind 20 bis 30 Jahre mit Verlängerungsoption und Rückbauverpflichtung." />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Ergebnis ---------------- */}
        <div className="min-w-0 p-5 sm:p-6 md:p-8">
          <p className="sr-only" aria-live="polite">
            {`${fmt(r.kwp / 1000, 1)} Megawatt Peak, ${fmt(r.ertragKwh / 1e6, 1)} Gigawattstunden pro Jahr, rund ${fmt(r.haushalte)} Haushalte, Pacht über ${r.laufzeit} Jahre ${fmt(Math.round(r.pachtSumme))} Euro`}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900 md:text-[26px]">Ihre Fläche kann</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-ov-50 px-3 py-1 text-[12.5px] font-semibold text-ov-700 ring-1 ring-ov-200">
              <KarteIcon aria-hidden="true" className="h-3.5 w-3.5" />
              {ort.name} · {ort.landName}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Kennzahl ton="navy" icon={LandPlot} label="Leistung" zusatz={`${fmt(r.konzept.kwpProHa)} kWp je Hektar`}>
              <Zahl wert={r.kwp / 1000} stellen={r.kwp < 10000 ? 1 : 0} suffix=" MWp" />
            </Kennzahl>
            <Kennzahl icon={Sun} label="Jahresertrag" zusatz={`${fmt(r.mwhProHa)} MWh je Hektar`}>
              <Zahl wert={r.ertragKwh / 1e6} stellen={r.ertragKwh < 1e7 ? 2 : 1} suffix=" GWh" />
            </Kennzahl>
            <Kennzahl icon={Home} label="Haushalte versorgt" zusatz={`rechnerisch, je ${fmt(PACHT.haushaltKwh)} kWh`}>
              <Zahl wert={Math.round(r.haushalte / 10) * 10} />
            </Kennzahl>
            <Kennzahl ton="gruen" icon={Coins} label={`Pacht ${r.laufzeit} Jahre*`} zusatz={`Jahr 1: ${eur(r.pachtJahr1)}`}>
              <Zahl wert={Math.round(r.pachtSumme)} suffix=" €" />
            </Kennzahl>
          </div>

          <DiagrammKarte titel="So sieht Ihre Fläche aus" rechts={<span className="text-[12.5px] text-ink-500">schematisch, {r.konzept.label}</span>}>
            <FlaechenBild konzept={r.konzept.id} />
            <KonzeptVergleich aktiv={r.konzept.id} standort={ort} />
          </DiagrammKarte>

          <DiagrammKarte
            titel="Pachteinnahmen kumuliert"
            rechts={
              <span className="ov-num text-[13px] text-ink-500">
                * Annahme {fmt(pacht)} €/ha, +{fmt(index, 2)} %/Jahr
              </span>
            }
          >
            <KumuliertDiagramm
              reihe={[{ jahr: 0, kumuliert: 0 }, ...r.pachtReihe]}
              startLabel="0"
              ariaLabel={`Kumulierte Pacht über ${r.laufzeit} Jahre: ${eur(r.pachtSumme)}`}
              tooltip={(c) => (c.jahr === 0 ? [["Vertragsbeginn"], ["Stand", "0 €"]] : [[`Nach ${c.jahr} ${c.jahr === 1 ? "Jahr" : "Jahren"}`], ["Pacht im Jahr", eur(c.betrag)], ["Summe", eur(c.kumuliert)]])}
            />
          </DiagrammKarte>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-navy-950 p-5 text-white md:p-6">
              <h3 className="flex items-center gap-2 font-display text-[16px] font-bold">
                <Cable aria-hidden="true" className="h-4 w-4 text-ov-300" />
                Netzanschluss
              </h3>
              <p className="mt-3 flex items-center gap-2 text-[14px]">
                <span aria-hidden="true" className={cn("h-2.5 w-2.5 rounded-full", stufe.klasse)} />
                <span className="font-semibold">
                  {fmt(abstand, abstand % 1 ? 1 : 0)} km für {fmt(r.kwp / 1000, 1)} MWp: {stufe.label}
                </span>
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{r.netz.text}</p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-white/55">
                TOR Typ {r.tor} · Netzebene legt der Netzbetreiber fest, bei Solarparks häufig Mittelspannung (Netzebene 5) oder Umspannwerk (Netzebene 4). Faustregel zur Ersteinschätzung, keine Zusage.
              </p>
            </div>
            <div className="rounded-3xl bg-ink-50 p-5 md:p-6">
              <h3 className="font-display text-[16px] font-bold text-ink-900">Widmung in {ort.landName}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">{widmung}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-600">
                {r.eagAbschlag
                  ? "Förderung: Auf Grünland und landwirtschaftlich genutzten Flächen sinkt der EAG-Investitionszuschuss um 25 %."
                  : "Förderung: Agri-PV mit mindestens 75 % landwirtschaftlicher Nutzung ist vom 25-%-Abschlag des EAG-Investitionszuschusses ausgenommen."}
                {r.eagAnteilig && " Über 1 MWp wird der Investitionszuschuss anteilig bis 1 MWp gewährt; alternativ kommt die Marktprämie in Frage."}
              </p>
              <Link href="/ratgeber/freiflaechen-photovoltaik-widmung" className="mt-3 inline-flex items-center gap-1 text-[13.5px] font-semibold text-ov-700 hover:text-ov-800">
                Widmung in allen Bundesländern <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <p className="mt-4 rounded-2xl bg-sand-50 px-4 py-3 text-[13.5px] leading-relaxed text-ink-600 ring-1 ring-ink-200/70">
            <strong className="text-ink-800">Landwirtschaft:</strong> {r.konzept.landwirtschaft}{" "}
            {r.konzept.id !== "freiflaeche" && (
              <Link href="/agri-pv" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                Agri-PV bei Ökovolt
              </Link>
            )}
          </p>

          <div className="mt-7 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] leading-relaxed text-ink-500">
              * Pacht = Ihre Annahme. Leistung und Ertrag sind Richtwerte je Konzept; Widmung, Netzkapazität, Naturschutz und Geländeform prüfen wir im Flächen-Check.
            </p>
            <Button href="/kontakt" size="lg" pfeil className="shrink-0">
              Fläche prüfen lassen
            </Button>
          </div>
          <RechnerTeilen
            className="mt-4"
            rechner="freiflaeche-pacht"
            name="Freiflächen- & Pacht-Rechner"
            pfad="/rechner/freiflaeche-pacht"
            query={teilenQuery}
            titel="Freiflächen- & Pacht-Rechner: Was kann unsere Fläche?"
            text="So viel Solarstrom und Pacht bringt diese Fläche – gerechnet mit dem Ökovolt Freiflächen- & Pacht-Rechner."
            kampagne="rechner_freiflaeche_pacht"
            bericht={bericht}
          />
        </div>
      </div>
    </div>
  );
}

/** Schematische Draufsicht der Fläche je Konzept – Reihen wachsen beim Einblenden. */
function FlaechenBild({ konzept }) {
  const an = useEingeblendet(150);
  const W = 640;
  const H = 200;
  const reihen = konzept === "freiflaeche" ? 11 : konzept === "agri-hoch" ? 7 : 5;
  const breite = konzept === "freiflaeche" ? 26 : konzept === "agri-hoch" ? 30 : 5;
  const abstand = (W - 60) / reihen;
  return (
    <div className="px-5 pb-2 pt-4 md:px-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Schematische Draufsicht: ${reihen} Modulreihen, ${konzept === "agri-vertikal" ? "senkrecht mit breiten Bewirtschaftungsstreifen" : konzept === "agri-hoch" ? "hoch aufgeständert über Kulturen" : "dicht aufgeständert"}`}>
        <defs>
          <linearGradient id="pacht-boden" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#e6f1d8" />
            <stop offset="100%" stopColor="#cde3b1" />
          </linearGradient>
          <pattern id="pacht-acker" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="#aed083" strokeWidth="3" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={W} height={H} rx="22" fill="url(#pacht-boden)" />
        {konzept !== "freiflaeche" && <rect x="0" y="0" width={W} height={H} rx="22" fill="url(#pacht-acker)" opacity="0.55" />}
        {Array.from({ length: reihen }, (_, i) => {
          const x = 30 + i * abstand + (abstand - breite) / 2;
          return (
            <g key={`${konzept}-${i}`}>
              {konzept === "agri-hoch" && <rect x={x - 3} y={22} width={breite + 6} height={H - 44} rx="4" fill="#03122b" opacity="0.08" />}
              <rect
                x={x}
                y={22}
                width={breite}
                height={H - 44}
                rx={konzept === "agri-vertikal" ? 2 : 5}
                fill={konzept === "agri-vertikal" ? "#1f5aa1" : "#0b4488"}
                style={{
                  transformOrigin: `${x + breite / 2}px ${H / 2}px`,
                  transform: an ? "scaleY(1)" : "scaleY(0.02)",
                  transition: `transform 700ms cubic-bezier(.22,1,.36,1) ${i * 55}ms`,
                }}
              />
              {konzept !== "agri-vertikal" &&
                Array.from({ length: 6 }, (_, k) => <line key={k} x1={x} x2={x + breite} y1={22 + ((k + 1) * (H - 44)) / 7} y2={22 + ((k + 1) * (H - 44)) / 7} stroke="#4a7cbd" strokeWidth="1" opacity={an ? 0.7 : 0} style={{ transition: `opacity 400ms ${400 + i * 55}ms` }} />)}
            </g>
          );
        })}
        <rect x={W - 58} y={H - 50} width="34" height="28" rx="6" fill="#fff" stroke="#97a0b0" />
        <path d={`M${W - 45} ${H - 44} l-5 9 h7 l-5 9`} fill="none" stroke="#f5a70f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Ertrag je Hektar der drei Konzepte am gewählten Standort (mit BOKU-Referenz). */
function KonzeptVergleich({ aktiv, standort }) {
  const an = useEingeblendet(250);
  const werte = PACHT.konzepte.map((k) => ({ ...k, mwh: (k.kwpProHa * k.ertrag(standort)) / 1000 }));
  const max = Math.max(...werte.map((w) => w.mwh));
  return (
    <div className="space-y-3 px-5 pb-5 pt-2 md:px-6">
      {werte.map((w, i) => (
        <div key={w.id}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
            <span className={cn(w.id === aktiv ? "font-semibold text-ink-900" : "text-ink-600")}>{w.label}</span>
            <span className="ov-num text-ink-600">
              <strong className="text-ink-900">{fmt(w.mwh)} MWh/ha</strong> <span className="hidden text-ink-400 sm:inline">· Studie Ø AT {fmt(PACHT.bokuMwhProHa[w.id])}</span>
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
            <div
              className={cn("h-full rounded-full motion-safe:transition-[width] motion-safe:duration-700", w.id === aktiv ? "bg-gradient-to-r from-ov-400 to-ov-600" : "bg-ink-300")}
              style={{ width: an ? `${(w.mwh / max) * 100}%` : "0%", transitionDelay: `${i * 90}ms` }}
            />
          </div>
        </div>
      ))}
      <p className="text-[12px] leading-relaxed text-ink-500">Ihr Standort nach PVGIS; Studienwerte als österreichweiter Vergleich: BOKU Wien, „The techno-economic potentials of agrivoltaic installations in Austria“ (Renewable Energy, 2026).</p>
    </div>
  );
}
