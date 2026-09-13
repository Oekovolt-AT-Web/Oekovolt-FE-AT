"use client";

import { useMemo, useState } from "react";
import { ListChecks, CircleCheck, CircleAlert, FileSignature, Fence, Home, LayoutPanelTop, PanelsTopLeft, Sun, Warehouse } from "lucide-react";

/**
 * Genehmigungs-Check: Braucht die geplante Solaranlage eine Genehmigung?
 *
 * Grundlage ist die Musterbauordnung (§ 61 Abs. 1 Nr. 3 MBO): Solaranlagen in,
 * an und auf Dach- und Außenwandflächen sowie gebäudeunabhängige Anlagen bis
 * 3 m Höhe und 9 m Gesamtlänge sind verfahrensfrei. Die Länder haben das
 * weitgehend übernommen, im Detail aber abweichend geregelt. Denkmalschutz
 * und Bebauungsplan gelten zusätzlich – verfahrensfrei heißt nicht regelfrei.
 * Ergebnis = Orientierung, keine Rechtsauskunft.
 */

const ARTEN = [
  { id: "dach", label: "Schrägdach", sub: "Aufdach oder Indach", icon: Home },
  { id: "flachdach", label: "Flachdach", sub: "aufgeständert", icon: Warehouse },
  { id: "fassade", label: "Fassade", sub: "an der Außenwand", icon: PanelsTopLeft },
  { id: "carport", label: "Solarcarport", sub: "neu gebaut", icon: LayoutPanelTop },
  { id: "garten", label: "Im Garten", sub: "gebäudeunabhängig", icon: Fence },
  { id: "balkon", label: "Balkonkraftwerk", sub: "Steckersolargerät", icon: Sun },
];

const JA_NEIN = [
  { id: "nein", label: "Nein" },
  { id: "ja", label: "Ja" },
  { id: "unklar", label: "Weiß nicht" },
];

const STATUS = {
  frei: { label: "Verfahrensfrei", ton: "bg-ov-500 text-white", ring: "ring-ov-200", icon: CircleCheck, farbe: "text-ov-600" },
  pruefen: { label: "Verfahrensfrei – Vorgaben prüfen", ton: "bg-sun-400 text-ink-900", ring: "ring-sun-400/60", icon: CircleAlert, farbe: "text-sun-500" },
  antrag: { label: "Genehmigung oder Erlaubnis nötig", ton: "bg-navy-700 text-white", ring: "ring-navy-200", icon: FileSignature, farbe: "text-navy-700" },
};

function Auswahl({ legend, name, optionen, wert, onChange }) {
  return (
    <fieldset>
      <legend className="text-[14.5px] font-semibold text-ink-800">{legend}</legend>
      <div className="mt-3 inline-flex flex-wrap gap-1 rounded-full bg-ink-100 p-1">
        {optionen.map((o) => (
          <label
            key={o.id}
            className={`inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-[14px] font-semibold transition-all focus-within:ring-2 focus-within:ring-ov-500 ${wert === o.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"}`}
          >
            <input type="radio" name={name} value={o.id} checked={wert === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function GenehmigungsCheck() {
  const [art, setArt] = useState("dach");
  const [klein, setKlein] = useState("ja");
  const [denkmal, setDenkmal] = useState("nein");
  const [bplan, setBplan] = useState("nein");
  const [grenze, setGrenze] = useState("nein");

  const e = useMemo(() => {
    let status = "frei";
    const gruende = [];
    const schritte = [];
    const hoch = (s) => {
      const r = { frei: 0, pruefen: 1, antrag: 2 };
      if (r[s] > r[status]) status = s;
    };

    switch (art) {
      case "dach":
        gruende.push("Solaranlagen auf Dachflächen sind nach allen Landesbauordnungen verfahrensfrei – ein Bauantrag entfällt (Ausnahme: Hochhäuser).");
        break;
      case "flachdach":
        hoch("pruefen");
        gruende.push("Auch aufgeständerte Anlagen auf dem Flachdach sind in der Regel verfahrensfrei. Starke Aufständerung kann aber Gebäudehöhe und Abstandsflächen berühren – und die Statik muss die Ballast- und Windlasten tragen.");
        schritte.push("Statik der Dachkonstruktion prüfen lassen (Ballast, Wind- und Schneelast).");
        break;
      case "fassade":
        hoch("pruefen");
        gruende.push("Solaranlagen an Außenwänden sind verfahrensfrei. Bei höheren Gebäuden gelten Brandschutzanforderungen an die Fassade, die der Fachplaner nachweisen muss.");
        break;
      case "carport":
        hoch("pruefen");
        gruende.push("Ein Solarcarport ist baurechtlich eine eigene bauliche Anlage. Kleine Carports/Garagen sind in vielen Ländern bis zu einer Grundfläche von rund 30 m² verfahrensfrei – nicht aber im Außenbereich. Grenzabstand und Bebauungsplan gelten trotzdem.");
        schritte.push("Grundfläche, Höhe und Grenzabstand mit der Landesbauordnung bzw. dem Bauamt abgleichen.");
        break;
      case "garten":
        if (klein === "ja") {
          gruende.push("Gebäudeunabhängige Solaranlagen bis 3 m Höhe und 9 m Gesamtlänge sind nach Musterbauordnung verfahrensfrei.");
          hoch("pruefen");
          gruende.push("Im Außenbereich (außerhalb von Ortschaften) gelten strengere Maßstäbe – dort sollte die Gemeinde vorab gefragt werden.");
        } else {
          hoch("antrag");
          gruende.push("Größere Freiflächenanlagen brauchen eine Baugenehmigung und meist einen Bebauungsplan. Privilegiert sind nur Flächen bis 200 m entlang von Autobahnen und zweigleisigen Schienenwegen (§ 35 Abs. 1 Nr. 8 b BauGB).");
          schritte.push("Früh mit Gemeinde und Bauamt klären, ob ein Bebauungsplan nötig ist.");
        }
        break;
      case "balkon":
        gruende.push("Steckersolargeräte bis 800 W Wechselrichterleistung brauchen keine Baugenehmigung und keine Anmeldung beim Netzbetreiber – nur den Eintrag im Marktstammdatenregister.");
        gruende.push("Mieter und Wohnungseigentümer haben seit Oktober 2024 einen Anspruch auf Zustimmung (privilegierte bauliche Veränderung); Vermieter bzw. Gemeinschaft entscheiden nur über das „Wie“.");
        schritte.push("Gerät im Marktstammdatenregister eintragen (vereinfachtes Verfahren).");
        break;
      default:
        break;
    }

    if (denkmal === "ja") {
      hoch("antrag");
      gruende.push("Am Baudenkmal oder in seiner Nähe ist eine denkmalrechtliche Erlaubnis nötig. Die Chancen sind gut: Seit 2023 liegen erneuerbare Energien im überragenden öffentlichen Interesse, mehrere Länder genehmigen Anlagen inzwischen „in der Regel“ – vor allem, wenn sie farblich angepasst und wenig einsehbar sind.");
      schritte.push("Erlaubnis bei der Unteren Denkmalschutzbehörde beantragen – vor der Bestellung.");
    } else if (denkmal === "unklar") {
      hoch("pruefen");
      gruende.push("Ob das Gebäude oder ein Nachbargebäude unter Denkmalschutz steht oder in einem Ensemble liegt, zeigt die Denkmalliste Ihres Landes.");
      schritte.push("Denkmalliste bzw. Denkmal-Atlas des Landes prüfen oder im Bauamt nachfragen.");
    }

    if (bplan === "ja") {
      hoch("pruefen");
      gruende.push("Bebauungsplan oder Gestaltungssatzung können Vorgaben machen – etwa zu Farbe, Dachüberstand oder Aufständerung. Verfahrensfreiheit entbindet nicht davon; notfalls ist eine Abweichung zu beantragen.");
      schritte.push("Bebauungsplan und örtliche Gestaltungssatzung auf Solarvorgaben durchsehen.");
    } else if (bplan === "unklar") {
      hoch("pruefen");
      schritte.push("Im Geoportal der Gemeinde oder beim Bauamt nachsehen, ob ein Bebauungsplan mit Gestaltungsvorgaben gilt.");
    }

    if (grenze === "ja" && art !== "balkon" && art !== "garten") {
      hoch("pruefen");
      gruende.push("Bei Reihen- und Doppelhäusern verlangen viele Landesbauordnungen einen Brandschutzabstand der Module zur Brand- bzw. Gebäudeabschlusswand (nach Muster bis 1,25 m, bei flach anliegenden Anlagen 0,5 m). Einige Länder haben das für Gebäude geringer Höhe gelockert.");
      schritte.push("Abstand zur Trennwand nach der Landesbauordnung einplanen.");
    }

    if (art !== "balkon") {
      schritte.push("Anlage vor Inbetriebnahme beim Netzbetreiber anmelden und binnen eines Monats im Marktstammdatenregister eintragen.");
    }

    return { status, gruende, schritte };
  }, [art, klein, denkmal, bplan, grenze]);

  const s = STATUS[e.status];

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-50px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <form className="space-y-8 border-b border-ink-100 p-6 sm:p-8 md:p-10 lg:border-b-0 lg:border-r" onSubmit={(ev) => ev.preventDefault()}>
          <fieldset>
            <legend className="text-[14.5px] font-semibold text-ink-800">Was planen Sie?</legend>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {ARTEN.map((o) => {
                const an = art === o.id;
                return (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer flex-col gap-2 rounded-2xl p-3.5 transition-all focus-within:ring-2 focus-within:ring-ov-500 ${an ? "bg-ov-50 ring-2 ring-ov-500" : "bg-sand-50 ring-1 ring-ink-200 hover:ring-ink-300"}`}
                  >
                    <input type="radio" name="art" value={o.id} checked={an} onChange={() => setArt(o.id)} className="sr-only" />
                    <o.icon aria-hidden="true" className={`h-5 w-5 ${an ? "text-ov-600" : "text-ink-400"}`} />
                    <span className={`text-[14px] font-semibold leading-tight ${an ? "text-ov-800" : "text-ink-800"}`}>{o.label}</span>
                    <span className="-mt-1 text-[12.5px] leading-tight text-ink-500">{o.sub}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {art === "garten" && (
            <Auswahl legend="Höchstens 3 m hoch und 9 m lang?" name="klein" optionen={JA_NEIN.slice(0, 2).reverse()} wert={klein} onChange={setKlein} />
          )}
          <Auswahl legend="Steht das Gebäude unter Denkmalschutz oder in einem Ensemble?" name="denkmal" optionen={JA_NEIN} wert={denkmal} onChange={setDenkmal} />
          <Auswahl legend="Gibt es einen Bebauungsplan oder eine Gestaltungssatzung?" name="bplan" optionen={JA_NEIN} wert={bplan} onChange={setBplan} />
          {art !== "balkon" && art !== "garten" && (
            <Auswahl legend="Reihen- oder Doppelhaus mit gemeinsamer Trennwand?" name="grenze" optionen={JA_NEIN.slice(0, 2)} wert={grenze} onChange={setGrenze} />
          )}
        </form>

        <div className="flex flex-col bg-sand-50/60 p-6 sm:p-8 md:p-10" aria-live="polite">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">Einschätzung</p>
          <div className={`mt-4 flex items-center gap-3 rounded-2xl px-4 py-3.5 ${s.ton}`}>
            <s.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
            <p className="font-display text-[20px] font-extrabold leading-tight">{s.label}</p>
          </div>

          <ul className="mt-6 space-y-3">
            {e.gruende.map((g) => (
              <li key={g} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-700">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ov-500" />
                {g}
              </li>
            ))}
          </ul>

          {e.schritte.length > 0 && (
            <div className={`mt-6 rounded-3xl bg-white p-5 ring-1 ${s.ring}`}>
              <p className="flex items-center gap-2 font-semibold text-ink-900">
                <ListChecks aria-hidden="true" className={`h-4.5 w-4.5 ${s.farbe}`} />
                Nächste Schritte
              </p>
              <ol className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-ink-600">
                {e.schritte.map((x, i) => (
                  <li key={x} className="flex gap-3">
                    <span className="ov-num font-display font-bold text-ov-600">{i + 1}.</span>
                    {x}
                  </li>
                ))}
              </ol>
            </div>
          )}

          <p className="mt-auto pt-6 text-[12.5px] leading-relaxed text-ink-500">
            Orientierung nach Musterbauordnung und typischer Landespraxis, Stand 2026 – keine Rechtsauskunft. Maßgeblich sind Ihre Landesbauordnung, der Bebauungsplan und das örtliche Bauamt.
          </p>
        </div>
      </div>
    </div>
  );
}
