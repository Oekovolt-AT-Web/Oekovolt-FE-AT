"use client";

import { useId, useMemo, useState } from "react";
import { AlertTriangle, Building2, CheckCircle2, CircleHelp, Factory, Gauge, Info, XCircle } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * EEffG-Pflicht-Check: Unternehmensgröße (geltendes Kriterium im EEffG) und
 * Energieverbrauch (Schwellen der Richtlinie (EU) 2023/1791) → Audit-Pflicht ja/nein.
 * Orientierung ohne Rechtsberatung; Partner- und verbundene Unternehmen zählen mit.
 */

const TJ_JE_GWH = 3.6;
const AUDIT_TJ = 10; // > 10 TJ/Jahr Durchschnitt → Energieaudit
const EMS_TJ = 85; // > 85 TJ/Jahr → Energiemanagementsystem

const zahl = (n, s = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });

export default function EeffgCheck() {
  const id = useId();
  const [beschaeftigte, setBeschaeftigte] = useState(180);
  const [umsatz, setUmsatz] = useState(60);
  const [bilanz, setBilanz] = useState(38);
  const [gwh, setGwh] = useState(4.5);

  const r = useMemo(() => {
    const gross = beschaeftigte > 249 || (umsatz > 50 && bilanz > 43);
    const tj = gwh * TJ_JE_GWH;
    const eu = tj > EMS_TJ ? "ems" : tj > AUDIT_TJ ? "audit" : "keine";
    return { gross, tj, eu };
  }, [beschaeftigte, umsatz, bilanz, gwh]);

  const gesamt = r.gross || r.eu !== "keine" ? (r.gross ? "ja" : "kommt") : "nein";

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="p-6 md:p-9">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Interaktiv · EEffG-Pflicht-Check</p>
          <h3 className="ov-h3 mt-1.5 text-ink-900">Muss Ihr Unternehmen ein Energieaudit machen?</h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">Werte der gesamten Unternehmensgruppe eintragen – Partner- und verbundene Unternehmen zählen mit.</p>
          <div className="mt-7 space-y-6">
            <Regler id={`${id}-b`} icon={Building2} label="Beschäftigte" wert={beschaeftigte} anzeige={zahl(beschaeftigte)} min={0} max={1500} step={10} onChange={setBeschaeftigte} markierung={{ wert: 249, text: "> 249" }} />
            <Regler id={`${id}-u`} icon={Factory} label="Jahresumsatz" wert={umsatz} anzeige={`${zahl(umsatz)} Mio. €`} min={0} max={300} step={1} onChange={setUmsatz} markierung={{ wert: 50, text: "> 50" }} />
            <Regler id={`${id}-bi`} icon={Factory} label="Bilanzsumme" wert={bilanz} anzeige={`${zahl(bilanz)} Mio. €`} min={0} max={300} step={1} onChange={setBilanz} markierung={{ wert: 43, text: "> 43" }} />
            <Regler
              id={`${id}-e`}
              icon={Gauge}
              label="Endenergieverbrauch (Strom, Gas, Wärme, Treibstoff)"
              wert={gwh}
              anzeige={`${zahl(gwh, 1)} GWh · ${zahl(r.tj, 1)} TJ`}
              min={0}
              max={40}
              step={0.1}
              onChange={setGwh}
              markierung={{ wert: AUDIT_TJ / TJ_JE_GWH, text: "10 TJ" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ink-100 bg-sand-50 p-6 md:p-9 lg:border-l lg:border-t-0" aria-live="polite">
          <div
            className={cn(
              "rounded-3xl p-6 transition-colors duration-500",
              gesamt === "ja" ? "bg-navy-950 text-white" : gesamt === "kommt" ? "bg-sun-300/25 ring-1 ring-sun-400/60" : "bg-white ring-1 ring-ink-200/70"
            )}
          >
            <p className={cn("text-[12.5px] font-semibold uppercase tracking-[0.14em]", gesamt === "ja" ? "text-ov-300" : "text-ink-500")}>Ergebnis</p>
            <p className={cn("mt-2 flex items-center gap-3 font-display text-[26px] font-extrabold leading-tight tracking-tight md:text-[30px]", gesamt === "ja" ? "text-white" : "text-ink-900")}>
              {gesamt === "ja" ? <CheckCircle2 aria-hidden="true" className="h-8 w-8 shrink-0 text-ov-400" /> : gesamt === "kommt" ? <AlertTriangle aria-hidden="true" className="h-8 w-8 shrink-0 text-sun-500" /> : <XCircle aria-hidden="true" className="h-8 w-8 shrink-0 text-ink-400" />}
              {gesamt === "ja" ? "Audit-Pflicht: ja" : gesamt === "kommt" ? "Heute nein – künftig wahrscheinlich" : "Audit-Pflicht: nein"}
            </p>
            <p className={cn("mt-3 text-[14.5px] leading-relaxed", gesamt === "ja" ? "text-white/70" : "text-ink-600")}>
              {gesamt === "ja"
                ? "Mindestens alle vier Jahre ein Energieaudit durch eine gelistete Person – oder ein zertifiziertes Energie- bzw. Umweltmanagementsystem (z. B. ISO 50001, EMAS)."
                : gesamt === "kommt"
                  ? "Nach dem geltenden Größenkriterium nicht verpflichtet – nach den verbrauchsbasierten Schwellen der EU-Richtlinie 2023/1791 aber schon. Wir prüfen den Umsetzungsstand im EEffG für Sie."
                  : "Weder das Größenkriterium noch die EU-Verbrauchsschwelle ist erreicht. Eine Lastganganalyse lohnt sich trotzdem – freiwillig und förderfähig geplant."}
            </p>
          </div>

          <Kriterium
            titel="Geltendes EEffG: Unternehmensgröße"
            erfuellt={r.gross}
            text={r.gross ? "Großes Unternehmen: mehr als 249 Beschäftigte oder mehr als 50 Mio. € Umsatz und mehr als 43 Mio. € Bilanzsumme." : "Kein großes Unternehmen im Sinne des EEffG."}
          />
          <Kriterium
            titel="EU-Richtlinie 2023/1791: Energieverbrauch"
            erfuellt={r.eu !== "keine"}
            text={
              r.eu === "ems"
                ? `${zahl(r.tj, 0)} TJ liegt über 85 TJ (rund 23,6 GWh): Energiemanagementsystem vorgesehen.`
                : r.eu === "audit"
                  ? `${zahl(r.tj, 1)} TJ liegt über 10 TJ (rund 2,78 GWh): Energieaudit vorgesehen.`
                  : `${zahl(r.tj, 1)} TJ liegt unter der Auditschwelle von 10 TJ (rund 2,78 GWh).`
            }
          />
          <p className="flex gap-2 text-[12.5px] leading-relaxed text-ink-500">
            <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            Orientierung, keine Rechtsberatung. Die EU-Schwellen beziehen sich auf den durchschnittlichen Jahresverbrauch der letzten drei Jahre; Umsetzungsfrist war der 11. Oktober 2025 – den
            aktuellen Stand im EEffG prüfen wir im Einzelfall. Meldungen laufen über die Energieeffizienz-Monitoringstelle.
          </p>
        </div>
      </div>
    </div>
  );
}

function Kriterium({ titel, erfuellt, text }) {
  const Icon = erfuellt ? CheckCircle2 : CircleHelp;
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
      <Icon aria-hidden="true" className={cn("mt-0.5 h-5 w-5 shrink-0", erfuellt ? "text-ov-600" : "text-ink-400")} />
      <div>
        <p className="font-display text-[15px] font-bold text-ink-900">{titel}</p>
        <p className="mt-0.5 text-[14px] leading-snug text-ink-600">{text}</p>
      </div>
    </div>
  );
}

function Regler({ id, icon: Icon, label, wert, anzeige, min, max, step, onChange, markierung }) {
  const fill = ((wert - min) / (max - min)) * 100;
  const mPos = markierung ? ((markierung.wert - min) / (max - min)) * 100 : null;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="flex items-center gap-2 text-[14px] font-medium text-ink-700">
          <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
          {label}
        </label>
        <output htmlFor={id} className="ov-num shrink-0 font-display text-[17px] font-extrabold tracking-tight text-ink-900">
          {anzeige}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={wert}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ov-range mt-4 block cursor-pointer"
        style={{ "--ov-fill": `${fill}%` }}
      />
      {mPos != null && (
        <div aria-hidden="true" className="relative mt-1.5 h-5">
          <span className="absolute top-0 flex -translate-x-1/2 flex-col items-center text-[11px] font-semibold leading-none text-ink-400" style={{ left: `${mPos}%` }}>
            <span className="mb-1 block h-1.5 w-px bg-ink-300" />
            {markierung.text}
          </span>
        </div>
      )}
    </div>
  );
}
