"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CircleAlert, CircleCheck, FileSignature, Fence, Home, LayoutPanelTop, Sprout, Warehouse } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { KARTE_PFADE, KARTE_VIEWBOX } from "@/components/Forderungen/Shared/kartePfade";

/**
 * Genehmigungs-Check Österreich: Welche Verfahren braucht eine PV-Anlage je
 * Bundesland? Drei Rechtsgebiete – Baurecht, Elektrizitätsrecht, Raumordnung/
 * Naturschutz – plus Denkmal- und Ortsbildschutz.
 *
 * Schwellen laut Landesrecht (RIS, Landesleitfäden), Stand 09/2026. Die
 * Modulfläche wird mit 5 m² je kWp angenähert. Ergebnis = Orientierung,
 * keine Rechtsauskunft.
 */

export const LAENDER = [
  { key: "burgenland", name: "Burgenland" },
  { key: "kaernten", name: "Kärnten" },
  { key: "niederoesterreich", name: "Niederösterreich" },
  { key: "oberoesterreich", name: "Oberösterreich" },
  { key: "salzburg", name: "Salzburg" },
  { key: "steiermark", name: "Steiermark" },
  { key: "tirol", name: "Tirol" },
  { key: "vorarlberg", name: "Vorarlberg" },
  { key: "wien", name: "Wien" },
];

const ARTEN = [
  { id: "dach", label: "Dach / Fassade", sub: "parallel oder integriert", icon: Home },
  { id: "flachdach", label: "Flachdach", sub: "aufgeständert", icon: Warehouse },
  { id: "parkplatz", label: "Carport / Parkplatz", sub: "Überdachung", icon: LayoutPanelTop },
  { id: "freiflaeche", label: "Freifläche", sub: "Grünland", icon: Fence },
  { id: "agri", label: "Agri-PV", sub: "mit Landwirtschaft", icon: Sprout },
];

const STATUS = {
  frei: { label: "frei", ton: "bg-ov-600 text-white", icon: CircleCheck, farbe: "text-ov-600" },
  anzeige: { label: "Anzeige", ton: "bg-sun-400 text-ink-900", icon: CircleAlert, farbe: "text-sun-500" },
  bewilligung: { label: "Bewilligung / Widmung", ton: "bg-navy-700 text-white", icon: FileSignature, farbe: "text-navy-700" },
  pruefen: { label: "im Einzelfall klären", ton: "bg-ink-200 text-ink-800", icon: CircleAlert, farbe: "text-ink-500" },
};
const RANG = { frei: 0, pruefen: 1, anzeige: 2, bewilligung: 3 };

function elektrizitaet(land, kw, art) {
  const aufBau = art === "dach" || art === "flachdach" || art === "parkplatz";
  switch (land) {
    case "wien":
      if (kw <= 15) return ["frei", "Wiener ElWG 2005: bis 15 kW frei."];
      if (kw <= 50) return ["anzeige", "Wiener ElWG 2005 § 6a: über 15 bis 50 kW Anzeige bei der MA 64."];
      return ["bewilligung", `Wiener ElWG 2005 § 5: über 50 kW Genehmigung der MA 64${kw <= 250 ? " (vereinfachtes Verfahren bis 250 kW)" : ""}.`];
    case "niederoesterreich":
      return kw <= 1000 ? ["frei", "NÖ ElWG 2005 § 5 Abs. 2 Z 3: bis 1 MWp samt Speicher genehmigungsfrei, wenn ein befugtes Unternehmen errichtet."] : ["bewilligung", "NÖ ElWG 2005: über 1 MWp elektrizitätsrechtliche Genehmigung."];
    case "oberoesterreich":
      if (aufBau) return ["frei", "Oö. ElWOG 2006 § 6 Abs. 2 Z 1a: auf Dächern und künstlichen Strukturen wie Parkplätzen unabhängig von der Leistung bewilligungsfrei."];
      return kw <= 1000 ? ["frei", "Oö. ElWOG 2006: bis 1.000 kW bewilligungsfrei."] : ["bewilligung", "Oö. ElWOG 2006 § 6: über 1.000 kW Bewilligung der Landesregierung."];
    case "salzburg":
      return ["frei", "LEG 1999 § 45 Abs. 3: unabhängig von der Leistung frei, wenn ein befugtes Unternehmen errichtet."];
    case "tirol":
      if (kw <= 100) return ["frei", "TEG 2012: bis 100 kW keine Anzeige."];
      if (kw <= 250) return ["anzeige", "TEG 2012 § 7: über 100 bis 250 kW Anzeige."];
      return ["bewilligung", "TEG 2012 § 6: über 250 kW Bewilligung."];
    case "vorarlberg":
      return kw <= 500 ? ["frei", "Vbg. ElWG § 5: bis 500 kWp keine elektrizitätsrechtliche Bewilligung."] : ["bewilligung", "Vbg. ElWG § 5: über 500 kWp Bewilligung."];
    case "kaernten":
      if (art === "dach" || art === "flachdach") return ["frei", "K-ElWOG 2011 § 6: PV auf bestehenden baulichen Anlagen ausgenommen."];
      return kw <= 500 ? ["frei", "K-ElWOG 2011: bis 500 kW keine Genehmigung."] : ["bewilligung", `K-ElWOG 2011 § 6: über 500 kW Genehmigung${kw <= 1000 ? " (vereinfachtes Verfahren bis 1.000 kW)" : ""}.`];
    case "steiermark":
      return kw <= 1000 ? ["frei", "Stmk. ElWOG 2005 § 5 Abs. 2 Z 5: bis 1.000 kW samt Speicher genehmigungsfrei."] : ["bewilligung", "Stmk. ElWOG 2005: über 1.000 kW Genehmigung."];
    case "burgenland":
      if (kw < 100) return ["frei", "Bgld. ElWG 2006: unter 100 kWp frei."];
      if (kw <= 500) return ["anzeige", "Bgld. ElWG 2006 § 7: 100 bis 500 kWp Anzeige."];
      return ["bewilligung", "Bgld. ElWG 2006 § 5: über 500 kWp Genehmigung."];
    default:
      return ["pruefen", ""];
  }
}

function baurecht(land, kw, art, m2, schutz) {
  const gebaeude = art === "dach" || art === "flachdach";
  if (art === "parkplatz") return ["bewilligung", "Die Überdachung selbst ist ein Bauwerk – je nach Land und Größe bewilligungs- oder anzeigepflichtig. Statik, Anfahrschutz und Brandschutz einplanen."];
  switch (land) {
    case "wien":
      if (!gebaeude) return ["bewilligung", "BO für Wien § 60 Abs. 1 lit. j: Bewilligung je nach Lage und Widmung."];
      if (schutz) return ["bewilligung", "BO für Wien § 60 Abs. 1 lit. j: in Schutzzonen bzw. Grünland-Schutzgebiet bewilligungspflichtig."];
      return ["frei", "BO für Wien § 62a Abs. 1 Z 24a: bewilligungsfrei (über 15 kW nur, wenn ein elektrizitätsrechtliches Verfahren läuft)."];
    case "niederoesterreich":
      if (gebaeude) return schutz ? ["anzeige", "NÖ BO 2014 § 15 Abs. 1 Z 13 lit. b: in Schutzzonen bzw. zum Ortsbildschutz anzeigepflichtig."] : ["frei", "NÖ BO 2014 § 17 Z 14: bewilligungs- und anzeigefrei."];
      return kw > 100 ? ["anzeige", "NÖ BO 2014 § 15 Abs. 1 Z 8: im Grünland über 100 kW Bauanzeige."] : ["frei", "NÖ BO 2014 § 17 Z 14: bis 100 kW im Grünland anzeigefrei – Widmung ab 50 kW beachten."];
    case "oberoesterreich":
      return ["frei", "Oö. BauO 1994 § 26 Z 15: bewilligungs- und anzeigefrei; bau- und raumordnungsrechtliche Vorgaben gelten trotzdem."];
    case "salzburg":
      if (schutz) return ["bewilligung", "BauPolG § 2 Abs. 4: Freistellung gilt nicht in Altstadt- und Ortsbildschutzgebieten."];
      if (art === "dach") return ["frei", "BauPolG § 2 Abs. 4: frei, wenn integriert oder max. 30 cm über der Dachhaut."];
      if (art === "flachdach") return ["frei", "BauPolG § 2 Abs. 4: frei, wenn mind. 1 m vom Rand zurückversetzt und max. 1 m hoch – sonst Bewilligung."];
      return m2 <= 200 ? ["frei", "BauPolG § 2 Abs. 4: freistehend bis 200 m² Kollektorfläche frei (45°-Linie ab 1 m zur Grenze)."] : ["bewilligung", "BauPolG: über 200 m² nur frei mit Kennzeichnung bzw. Widmung, sonst Bewilligung."];
    case "tirol":
      if (m2 <= 100) return ["frei", "TBO 2022 § 52c Abs. 3: bis 100 m² frei (max. 30 cm Abstand bzw. Flachdach max. 15°)."];
      return ["anzeige", "TBO 2022 § 52c Abs. 2: über 100 m² Bauanzeige; Bewilligung, wenn bautechnische Erfordernisse wesentlich berührt sind. Fertigstellung melden."];
    case "vorarlberg":
      if (gebaeude) return schutz ? ["pruefen", "Baugesetz § 17: Gemeinden können die Freistellung per Verordnung ausschließen."] : ["frei", "Baugesetz § 20 Abs. 2: an bestehenden Bauwerken frei (max. 0,30 m parallel, Abstandsflächen eingehalten)."];
      return ["pruefen", "Freistehende Anlagen: Bauanzeige oder Bewilligung je nach Größe – bei der Gemeinde klären."];
    case "kaernten":
      return ["pruefen", "Die K-BO 1996 kennt keinen eigenen PV-Tatbestand; Einordnung durch die Baubehörde (Bürgermeister) klären."];
    case "steiermark":
      if (gebaeude) return ["frei", "Stmk. BauG § 21 Abs. 1 Z 2 lit. o: auf Dach und Fassade bewilligungsfrei (Höhe max. 3,50 m)."];
      if (kw <= 100) return ["frei", "Stmk. BauG § 21: Freifläche bis 100 kWp bewilligungsfrei."];
      if (kw <= 500) return ["anzeige", "Stmk. BauG § 20: Freifläche über 100 kWp Anzeigeverfahren."];
      return ["bewilligung", "Stmk. BauG § 19 Z 5: Freifläche über 500 kWp Baubewilligung."];
    case "burgenland":
      if (gebaeude && kw <= 20) return ["frei", "Bgld. BauG § 1 Abs. 3 Z 7: bis 20 kWp an Gebäuden der Klassen 1–3 (parallel bzw. max. 15°, max. 30 cm) ausgenommen."];
      return ["bewilligung", `Bgld. BauG: Bauverfahren${kw <= 100 ? "; bis 100 kWp Entscheidung binnen einem Monat, sonst gilt die Genehmigung als erteilt (§ 18b Abs. 4)" : ""}.`];
    default:
      return ["pruefen", ""];
  }
}

function raumordnung(land, kw, art, m2) {
  if (art === "dach" || art === "flachdach") return ["frei", "Auf Gebäuden ist keine gesonderte Widmung nötig."];
  if (art === "parkplatz") return land === "kaernten" ? ["frei", "K-PhV 2024 § 4: Parkplatzüberdachungen brauchen keine gesonderte Widmung."] : ["frei", "Auf versiegelten Flächen im Bauland meist keine gesonderte Widmung – Bebauungsplan beachten."];
  const agri = art === "agri";
  switch (land) {
    case "wien":
      return ["bewilligung", "Freiflächen nur mit passender Widmung (Flächenwidmungs- und Bebauungsplan)."];
    case "niederoesterreich":
      return kw > 50 ? ["bewilligung", "NÖ ROG 2014 § 20 Abs. 2 Z 21: über 50 kW Widmung „Grünland-Photovoltaikanlagen“; außerhalb der PV-Zonen max. 2 ha, in Zonen bis 5 + 5 ha."] : ["frei", "Bis 50 kW keine Widmung „Grünland-Photovoltaikanlagen“ nötig."];
    case "oberoesterreich":
      if (m2 <= 50) return ["frei", "Oö. ROG 1994: freistehend bis 50 m² Modulfläche im Grünland zulässig."];
      return ["bewilligung", `Oö. ROG 1994 § 30a Abs. 3: über 50 m² Sonderwidmung im Grünland (außer landwirtschaftlicher Eigenbedarf). Naturschutz: ${m2 > 500 ? "über 500 m² Bewilligung" : "2–500 m² Anzeige"} außerhalb geschlossener Ortschaften.`];
    case "salzburg":
      return m2 <= 200 ? ["frei", "ROG 2009 § 36 Abs. 7: bis 200 m² Kollektorfläche ohne Kennzeichnung."] : ["bewilligung", "ROG 2009 § 36 Abs. 7: über 200 m² nur mit Kennzeichnung nach § 39b; Bodenpunkte laut Photovoltaik-Kennzeichnungsverordnung."];
    case "tirol":
      return m2 > 2500 ? ["bewilligung", "TNSchG 2005: außerhalb geschlossener Ortschaften über 2.500 m² Naturschutzbewilligung; Sonderfläche für Solarenergieanlagen (TROG 2022 § 43)."] : ["bewilligung", "TROG 2022 § 43: Sonderfläche für Solarenergieanlagen; Freiflächen werden restriktiv gewidmet."];
    case "vorarlberg":
      return ["bewilligung", "Raumplanungsgesetz: Widmung nötig; in der Landesgrünzone restriktiv."];
    case "kaernten":
      if (agri) return ["pruefen", "K-PhV 2024: Agri-PV im Obstbau, bei Geflügelhaltung oder Fischzucht ohne Widmung; Weide-Agri-PV braucht „Grünland – Agri-Photovoltaikanlage“."];
      return ["bewilligung", "K-PhV 2024 § 5: Widmung „Grünland – Photovoltaikanlage“, max. 4 ha zusammenhängend (vorbelastet bis 10 ha), 1.000 m Abstand."];
    case "steiermark":
      return ["bewilligung", `Sachprogramm Solarenergie: Eignungszone bzw. Sondernutzung im Freiland bis 2 ha, in bestimmten Bereichen bis 10 ha; darüber nur in Vorrangzonen${agri ? " – Agri-PV auch in landwirtschaftlichen Vorrangzonen zulässig" : ""}.`];
    case "burgenland":
      return m2 <= 35 ? ["frei", "Bgld. RPG 2019 § 22d: als Hausgartenanlage bis 35 m² ohne Eignungszone."] : ["bewilligung", "Bgld. RPG 2019 § 22d: nur in Eignungszonen mit Widmung; Photovoltaikabgabe 1.400 € je MW und Jahr."];
    default:
      return ["pruefen", ""];
  }
}

function Auswahl({ legend, name, optionen, wert, onChange }) {
  return (
    <fieldset>
      <legend className="text-[14.5px] font-semibold text-ink-800">{legend}</legend>
      <div className="mt-3 inline-flex flex-wrap gap-1 rounded-full bg-ink-100 p-1">
        {optionen.map((o) => (
          <label key={o.id} className={cn("inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-[14px] font-semibold transition-all focus-within:ring-2 focus-within:ring-ov-500", wert === o.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-600 hover:text-ink-800")}>
            <input type="radio" name={name} value={o.id} checked={wert === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const SCHRITTE = [
  { id: "land", label: "Bundesland" },
  { id: "art", label: "Anlagenart" },
  { id: "groesse", label: "Größe & Lage" },
];

export default function GenehmigungsCheck({ laenderPfade = {} }) {
  const [schritt, setSchritt] = useState(0);
  const [richtung, setRichtung] = useState("vor");
  const [land, setLand] = useState("oberoesterreich");
  const [art, setArt] = useState("dach");
  const [kw, setKw] = useState(100);
  const [schutz, setSchutz] = useState("nein");
  const [denkmal, setDenkmal] = useState("nein");
  const [hoverLand, setHoverLand] = useState(null);

  const e = useMemo(() => {
    const m2 = kw * 5;
    const zeilen = [
      { titel: "Baurecht", r: baurecht(land, kw, art, m2, schutz === "ja") },
      { titel: "Elektrizitätsrecht", r: elektrizitaet(land, kw, art) },
      { titel: "Raumordnung / Naturschutz", r: raumordnung(land, kw, art, m2) },
    ];
    if (denkmal === "ja") zeilen.push({ titel: "Denkmalschutz", r: ["bewilligung", "Jede Veränderung eines Denkmals braucht eine Bewilligung des Bundesdenkmalamts (§ 5 DMSG) – vor der Bestellung einholen."] });
    const gesamt = zeilen.reduce((max, z) => (RANG[z.r[0]] > RANG[max] ? z.r[0] : max), "frei");
    return { m2, zeilen, gesamt };
  }, [land, art, kw, schutz, denkmal]);

  const G = STATUS[e.gesamt];
  const landName = LAENDER.find((l) => l.key === land)?.name;
  const artLabel = ARTEN.find((a) => a.id === art)?.label;

  function gehe(i) {
    setRichtung(i >= schritt ? "vor" : "zurueck");
    setSchritt(Math.max(0, Math.min(SCHRITTE.length - 1, i)));
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_50px_100px_-60px_rgba(3,18,43,0.6)] ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* Stepper */}
        <div className="flex flex-col p-6 sm:p-8 md:p-10">
          <ol className="grid grid-cols-3 gap-2" aria-label="Schritte">
            {SCHRITTE.map((s, i) => {
              const aktiv = i === schritt;
              const fertig = i < schritt;
              return (
                <li key={s.id}>
                  <button type="button" onClick={() => gehe(i)} aria-current={aktiv ? "step" : undefined} className="group w-full text-left">
                    <span aria-hidden="true" className="block h-1.5 overflow-hidden rounded-full bg-ink-100">
                      <span className={cn("block h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600 transition-[width] duration-500", aktiv || fertig ? "w-full" : "w-0")} />
                    </span>
                    <span className={cn("mt-2.5 flex items-center gap-2 text-[13px] font-semibold", aktiv ? "text-ink-900" : fertig ? "text-ov-700" : "text-ink-400")}>
                      <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold", aktiv ? "bg-navy-950 text-white" : fertig ? "bg-ov-600 text-white" : "bg-ink-100 text-ink-500")}>
                        {fertig ? <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                      </span>
                      <span className="truncate">{s.label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div key={schritt} className={cn("mt-8 flex-1", richtung === "vor" ? "ov-step-vor" : "ov-step-zurueck")}>
            {schritt === 0 && (
              <fieldset>
                <legend className="font-display text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] font-extrabold tracking-tight text-ink-900">Wo steht die Anlage?</legend>
                <p className="mt-1.5 text-[15px] text-ink-600">Bundesland auf der Karte oder in der Liste wählen.</p>
                <div className="relative mx-auto mt-5 max-w-[520px]">
                  <svg viewBox={KARTE_VIEWBOX} className="h-auto w-full" aria-hidden="true" onMouseLeave={() => setHoverLand(null)}>
                    {Object.keys(KARTE_PFADE)
                      .sort((a, b) => (a === land ? 1 : b === land ? -1 : a === "wien" ? 1 : b === "wien" ? -1 : 0))
                      .map((k) => (
                        <path
                          key={k}
                          d={KARTE_PFADE[k].d}
                          fillRule="evenodd"
                          strokeLinejoin="round"
                          onClick={() => setLand(k)}
                          onMouseEnter={() => setHoverLand(k)}
                          className={cn("cursor-pointer transition-colors duration-300", k === land ? "fill-ov-500 stroke-white" : k === hoverLand ? "fill-ov-200 stroke-white" : "fill-ink-200 stroke-white")}
                          strokeWidth={k === land ? 1.8 : 1}
                        />
                      ))}
                  </svg>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {LAENDER.map((l) => {
                    const an = land === l.key;
                    return (
                      <label key={l.key} onMouseEnter={() => setHoverLand(l.key)} onMouseLeave={() => setHoverLand(null)} className={cn("flex min-h-[44px] cursor-pointer items-center rounded-xl px-3 text-[14px] font-semibold transition-all focus-within:ring-2 focus-within:ring-ov-500", an ? "bg-ov-50 text-ov-800 ring-2 ring-ov-500" : "bg-sand-50 text-ink-700 ring-1 ring-ink-200 hover:bg-white")}>
                        <input type="radio" name="gc-land" className="sr-only" checked={an} onChange={() => setLand(l.key)} />
                        {l.name}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {schritt === 1 && (
              <fieldset>
                <legend className="font-display text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] font-extrabold tracking-tight text-ink-900">Welche Art von Anlage?</legend>
                <p className="mt-1.5 text-[15px] text-ink-600">Auf Gebäuden gelten meist andere Regeln als auf Freiflächen.</p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {ARTEN.map((a) => {
                    const an = art === a.id;
                    return (
                      <label key={a.id} className={cn("group flex cursor-pointer flex-col gap-3 rounded-2xl p-4 transition-all focus-within:ring-2 focus-within:ring-ov-500", an ? "bg-navy-950 text-white shadow-[0_18px_36px_-20px_rgba(3,18,43,0.8)]" : "bg-sand-50 ring-1 ring-ink-200 hover:-translate-y-0.5 hover:bg-white")}>
                        <input type="radio" name="gc-art" className="sr-only" checked={an} onChange={() => setArt(a.id)} />
                        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", an ? "bg-ov-500 text-white" : "bg-white text-ov-600 ring-1 ring-ink-200")}>
                          <a.icon aria-hidden="true" className="h-5 w-5" />
                        </span>
                        <span>
                          <span className={cn("block text-[15px] font-semibold leading-tight", an ? "text-white" : "text-ink-900")}>{a.label}</span>
                          <span className={cn("mt-0.5 block text-[12.5px] leading-tight", an ? "text-white/60" : "text-ink-500")}>{a.sub}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {schritt === 2 && (
              <div className="space-y-7">
                <div>
                  <p className="font-display text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] font-extrabold tracking-tight text-ink-900">Wie groß, und wo genau?</p>
                  <p className="mt-1.5 text-[15px] text-ink-600">Die Schwellen der Länder hängen an Leistung oder Modulfläche.</p>
                </div>
                <label className="block">
                  <span className="flex items-baseline justify-between text-[14.5px] font-semibold text-ink-800">
                    Leistung
                    <span className="ov-num font-display text-[24px] font-extrabold text-ink-900">{kw.toLocaleString("de-DE")} kWp</span>
                  </span>
                  <input type="range" min={5} max={2000} step={5} value={kw} onChange={(ev) => setKw(Number(ev.target.value))} className="mt-3 w-full accent-ov-600" aria-describedby="flaeche-hinweis" />
                  <span id="flaeche-hinweis" className="mt-1 block text-[13px] text-ink-500">entspricht rund {e.m2.toLocaleString("de-DE")} m² Modulfläche (Annahme 5 m² je kWp)</span>
                </label>
                <Auswahl legend="Schutzzone, Altstadt- oder Ortsbildschutzgebiet?" name="schutz" optionen={[{ id: "nein", label: "Nein" }, { id: "ja", label: "Ja / weiß nicht" }]} wert={schutz} onChange={setSchutz} />
                <Auswahl legend="Denkmalgeschütztes Gebäude?" name="denkmal" optionen={[{ id: "nein", label: "Nein" }, { id: "ja", label: "Ja" }]} wert={denkmal} onChange={setDenkmal} />
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink-100 pt-6">
            <button type="button" onClick={() => gehe(schritt - 1)} disabled={schritt === 0} className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14.5px] font-semibold text-ink-700 transition-colors hover:bg-ink-100 disabled:invisible">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Zurück
            </button>
            {schritt < SCHRITTE.length - 1 ? (
              <button type="button" onClick={() => gehe(schritt + 1)} className="group inline-flex h-12 items-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700">
                Weiter: {SCHRITTE[schritt + 1].label}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <span className="text-[13.5px] font-semibold text-ov-700">Ergebnis steht rechts – live aktualisiert</span>
            )}
          </div>
        </div>

        {/* Ergebnis */}
        <div className="ov-noise relative isolate flex flex-col overflow-hidden bg-navy-950 p-6 text-white sm:p-8 md:p-10" aria-live="polite">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
          <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-ov-500/25 blur-[100px]" />
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Ergebnis – Orientierung</p>
          <p className="mt-2 text-[14px] text-white/60">
            {landName} · {artLabel} · <span className="ov-num">{kw.toLocaleString("de-DE")} kWp</span>
          </p>
          <p className={cn("mt-4 inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-[15px] font-bold", G.ton)}>
            <G.icon aria-hidden="true" className="h-4 w-4" />
            {e.gesamt === "frei" ? "Keine Verfahren nötig" : e.gesamt === "anzeige" ? "Anzeige nötig" : e.gesamt === "bewilligung" ? "Bewilligung oder Widmung nötig" : "Im Einzelfall klären"}
          </p>
          <ul className="mt-6 space-y-3">
            {e.zeilen.map((z) => {
              const S = STATUS[z.r[0]];
              return (
                <li key={z.titel} className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10 transition-colors">
                  <p className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-white">{z.titel}</span>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[12px] font-semibold", S.ton)}>{S.label}</span>
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/65">{z.r[1]}</p>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">Für den EAG-Investitionszuschuss müssen alle Anzeigen und Genehmigungen schon beim Förderantrag vorliegen.</p>
          {laenderPfade[land] && (
            <Link href={laenderPfade[land]} className="group mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-300 hover:text-white">
              Förderung und Recht in {landName}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
          <p className="mt-auto pt-6 text-[12px] leading-relaxed text-white/45">
            Orientierung ohne Gewähr. Zusätzlich können Gewerbe-, Wasser-, Forst-, Straßen- und Luftfahrtrecht betroffen sein. Verbindlich ist die Auskunft der Behörde bzw. der Anlaufstelle für erneuerbare Energie Ihres Landes.
          </p>
        </div>
      </div>
    </div>
  );
}
