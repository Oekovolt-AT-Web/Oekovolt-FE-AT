"use client";

// src/components/Technik/HybridKonfigurator.js – Hybridpark-Konfigurator (Welle C, Paket C03)
//
// PV-Park + Batteriespeicher (BESS) an einem gemeinsamen Netzanschluss: Eingaben PV-AC, DC/AC,
// BESS-Leistung und -Energie, netzwirksame Leistung und Speicherbezug. Ausgaben: TOR-Typ nach
// Summenregel (torTypen.js), abgeregelte Energie ohne/mit BESS aus der Stundensimulation
// (src/lib/rechner/profile.js, Rechenkern hybridpark.js), Vollzyklen und Monatsverlauf.
//
// Lead-Gate-Regel des Inhabers (11.10.2026), Stufe 1: Das Bildschirm-Ergebnis bleibt frei; CSV-Export
// und Druck/PDF erst nach bestätigtem Gate (Double-Opt-in). Kennung „hybrid-konfigurator“ (Eintrag in
// src/data/leadRechner.js durch C12). Das Gate läuft über useLeadGate/LeadGateDialog (A09): Kopfzeile und
// Bestätigungstext passen zur Aktion (download = CSV, pdf = Druck), Einwilligung „zu diesem Ergebnis“.
// Zahlen im Format der Website (1.234,5) über fmt aus src/lib/rechner/annahmen.js.

import { useDeferredValue, useId, useMemo, useState } from "react";
import { Battery, Download, Lock, Printer, SlidersHorizontal, Sun, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";
import { fmt } from "@/lib/rechner/annahmen";
import useLeadGate from "@/components/LeadGate/useLeadGate";
import { ANNAHMEN, GRENZEN, STAND, STANDARD, hybridparkCsv, simuliereHybridpark } from "@/components/Technik/hybridpark";

export const KENNUNG = "hybrid-konfigurator";

const DRUCK_CSS = `
@media print {
  body * { visibility: hidden !important; }
  .hk-druck, .hk-druck * { visibility: visible !important; }
  .hk-druck { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
  .hk-nicht-drucken { display: none !important; }
}`;

const de = (n, st = 0) => fmt(n, st);

// Eingabefelder als Text (Dezimalkomma wie im Hinweistext); Rohtext bleibt beim Tippen erhalten („1,“).
const alsText = (n) => (n === "" || n == null ? "" : String(n).replace(".", ","));
// ganzzahlig: Punkt ist Tausendertrenner („5.000“); sonst Komma oder Punkt als Dezimalzeichen („1,2“ / „1.2“)
const alsZahl = (t, ganzzahlig) => {
  let s = String(t ?? "").replace(/\s/g, "");
  s = ganzzahlig || s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  if (s === "") return "";
  const n = Number(s);
  return Number.isFinite(n) ? n : "";
};
const textAusStandard = () => Object.fromEntries(FELDER.map((f) => [f.key, f.step >= 1 ? de(STANDARD[f.key]) : alsText(STANDARD[f.key])]));
const mwh = (kwh, st = 0) => `${de(kwh / 1000, st)} MWh`;
const prozent = (x, st = 1) => `${de(x * 100, st)} %`;

const FELDER = [
  { key: "pvAcKw", label: "PV-Wechselrichterleistung (AC)", einheit: "kW", step: 100, icon: Sun, hinweis: "Summe der PV-Wechselrichter am Netzanschlusspunkt." },
  { key: "dcAc", label: "DC/AC-Verhältnis", einheit: "", step: 0.05, icon: Sun, hinweis: "Modulleistung (kWp) je kW Wechselrichter – Freifläche meist 1,1 bis 1,4." },
  { key: "bessKw", label: "BESS-Leistung", einheit: "kW", step: 100, icon: Battery, hinweis: "Lade-/Entladeleistung der Speicher-Umrichter (PCS)." },
  { key: "bessKwh", label: "BESS-Energie (Nennkapazität)", einheit: "kWh", step: 500, icon: Battery, hinweis: `Davon nutzbar ${de(ANNAHMEN.nutzbarAnteil * 100)} % (Annahme).` },
  { key: "netzKw", label: "Netzwirksame Leistung (Einspeisegrenze)", einheit: "kW", step: 100, icon: Zap, hinweis: "Vereinbarte bzw. zugesagte maximale Einspeiseleistung am Netzanschlusspunkt." },
  { key: "bezugKw", label: "Speicherbezug aus dem Netz", einheit: "kW", step: 100, icon: Zap, hinweis: "0 = Speicher lädt nur PV-Überschuss. Sonst Netzladung nachts (0–6 Uhr), vereinfachter Fahrplan." },
];

function Kennzahl({ label, wert, unter, hervorheben }) {
  return (
    <div className={cn("rounded-2xl p-4", hervorheben ? "bg-navy-950 text-white" : "bg-sand-50/80")}>
      <p className={cn("text-[12.5px] font-semibold uppercase tracking-[0.12em]", hervorheben ? "text-white/70" : "text-ink-500")}>{label}</p>
      <p className={cn("ov-num mt-1 font-display text-[24px] font-extrabold leading-tight", hervorheben ? "text-white" : "text-ink-900")}>{wert}</p>
      {unter && <p className={cn("mt-1 text-[12.5px] leading-snug", hervorheben ? "text-white/70" : "text-ink-600")}>{unter}</p>}
    </div>
  );
}

export default function HybridKonfigurator() {
  const id = useId();
  const [roh, setRoh] = useState(textAusStandard);
  const eingabe = useMemo(() => ({ ...STANDARD, ...Object.fromEntries(Object.entries(roh).map(([k, v]) => [k, alsZahl(v, FELDER.find((f) => f.key === k)?.step >= 1)])) }), [roh]);
  const verzoegert = useDeferredValue(eingabe);

  const erg = useMemo(() => simuliereHybridpark(verzoegert), [verzoegert]);
  const veraltet = verzoegert !== eingabe;

  const setze = (key, wert) => setRoh((alt) => ({ ...alt, [key]: wert.replace(/[^\d.,\s]/g, "") }));

  const csvLaden = () => {
    const blob = new Blob(["﻿" + hybridparkCsv(erg)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hybridpark-${erg.eingabe.pvAcKw}kW-${erg.eingabe.bessKw}kW-${erg.eingabe.bessKwh}kWh.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    ereignis("hybridpark_export", { kennung: KENNUNG, art: "csv" });
  };
  const drucken = () => {
    ereignis("hybridpark_export", { kennung: KENNUNG, art: "druck" });
    window.print();
  };

  const tor = erg.tor;
  const gateKontext = useMemo(
    () => ({
      titel: "Export des Hybridpark-Ergebnisses",
      einleitung: "Das Ergebnis am Bildschirm bleibt frei. Rückfragen zu diesem Ergebnis beantworten wir per E-Mail. Kein Newsletter.",
      segment: "gewerbe",
      rueckkehr: "/grossspeicher-epc#hybrid-konfigurator",
      ergebnis: {
        "PV-AC": `${de(erg.eingabe.pvAcKw)} kW`,
        BESS: `${de(erg.eingabe.bessKw)} kW / ${de(erg.eingabe.bessKwh)} kWh`,
        Netz: `${de(erg.eingabe.netzKw)} kW`,
        "TOR-Typ": tor.typ ?? "–",
        "Abregelung ohne/mit BESS": `${prozent(erg.anteilOhne)} / ${prozent(erg.anteilMit)}`,
      },
    }),
    [erg, tor.typ],
  );
  const gate = useLeadGate({ kennung: KENNUNG, modus: "download", kontext: gateKontext });
  const frei = gate.freigegeben;
  const exportieren = (art) => {
    if (art === "csv") gate.ausfuehren("download", csvLaden, { weiterLabel: "CSV jetzt herunterladen" });
    else gate.ausfuehren("pdf", drucken, { weiterLabel: "Jetzt drucken / als PDF" });
  };

  const maxMonat = Math.max(1, ...erg.monate.map((m) => m.abrOhne));
  // auf 2 Nachkommastellen runden – sonst weicht der Style-String zwischen Server und Browser ab (Hydration)
  const hoehe = (wert) => Math.round((wert / maxMonat) * 10000) / 100;
  const feldKlasse = "h-11 w-full rounded-xl bg-white px-3 pr-14 text-[15px] text-ink-900 ring-1 ring-inset ring-ink-200 focus:outline-none focus:ring-2 focus:ring-ov-500";

  return (
    <div id="hybrid-konfigurator" className="scroll-mt-24">
      <style dangerouslySetInnerHTML={{ __html: DRUCK_CSS }} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <form className="hk-nicht-drucken flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-8" onSubmit={(e) => e.preventDefault()}>
          <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
            Hybridpark-Konfigurator
          </p>
          {FELDER.map((f) => {
            const Icon = f.icon;
            const [min, max] = GRENZEN[f.key];
            return (
              <div key={f.key}>
                <label htmlFor={`${id}-${f.key}`} className="mb-1.5 flex items-center gap-2 text-[14px] font-medium text-ink-700">
                  <Icon aria-hidden="true" className="h-4 w-4 text-ink-500" />
                  {f.label}
                </label>
                <div className="relative">
                  <input
                    id={`${id}-${f.key}`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={roh[f.key]}
                    onChange={(e) => setze(f.key, e.target.value)}
                    aria-describedby={`${id}-${f.key}-h`}
                    className={feldKlasse}
                  />
                  {f.einheit && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[13px] text-ink-500">{f.einheit}</span>}
                </div>
                <p id={`${id}-${f.key}-h`} className="mt-1 text-[12.5px] leading-relaxed text-ink-500">
                  {f.hinweis} Bereich {de(min, f.step < 1 ? 1 : 0)} bis {de(max, f.step < 1 ? 1 : 0)}{f.einheit ? ` ${f.einheit}` : ""}.
                </p>
              </div>
            );
          })}
          <button type="button" onClick={() => setRoh(textAusStandard())} className="inline-flex min-h-11 items-center self-start text-[13.5px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:text-ov-800">
            Beispielwerte wiederherstellen
          </button>
        </form>

        <section aria-labelledby={`${id}-titel`} aria-live="polite" className={cn("hk-druck rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-ink-200/70 transition-opacity md:p-8", veraltet && "opacity-70")}>
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Ergebnis · Richtwert/Orientierung</p>
          <h3 id={`${id}-titel`} className="mt-1.5 font-display text-[21px] font-extrabold leading-tight text-ink-900">
            {de(erg.eingabe.pvAcKw)} kW PV-AC ({de(erg.kwp)} kWp) · BESS {de(erg.eingabe.bessKw)} kW / {de(erg.eingabe.bessKwh)} kWh · Netz {de(erg.eingabe.netzKw)} kW
          </h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Kennzahl label="Abregelung ohne BESS" wert={mwh(erg.abregelungOhne)} unter={`${prozent(erg.anteilOhne)} der PV-Erzeugung · ${de(erg.stundenMitAbregelung)} Stunden im Jahr betroffen`} />
            <Kennzahl label="Abregelung mit BESS" wert={mwh(erg.abregelungMit)} unter={`${prozent(erg.anteilMit)} der PV-Erzeugung · ${mwh(erg.vermieden)} in den Speicher verschoben`} hervorheben />
            <Kennzahl label="Vollzyklen pro Jahr" wert={erg.eingabe.bessKwh > 0 ? de(erg.vollzyklen) : "–"} unter={erg.eingabe.bessKwh > 0 ? `Entladung ${mwh(erg.entladen)} ÷ Nennkapazität${erg.ladenNetz > 0 ? ` · davon Netzladung ${mwh(erg.ladenNetz)}` : ""}` : "ohne Speicher"} />
            <Kennzahl
              label="TOR-Typ (Summenregel)"
              wert={tor.typ ? `Typ ${tor.typ}` : "–"}
              unter={`PV-AC + BESS = ${de(tor.summeKw)} kW · ${tor.grenze ?? ""}${tor.abweichung ? ` · bei Begrenzung auf ${de(erg.eingabe.netzKw)} kW ggf. Typ ${tor.typBegrenzt} – mit dem Netzbetreiber zu prüfen` : ""}`}
            />
          </div>

          {/* Monatsverlauf: Abregelung ohne/mit BESS (Balken), Tabelle als Alternative darunter */}
          <figure className="mt-6">
            <figcaption className="text-[13.5px] font-semibold text-ink-800">Abgeregelte Energie je Monat</figcaption>
            <div className="mt-2 flex items-center gap-4 text-[12.5px] text-ink-600" aria-hidden="true">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ink-300" />ohne BESS</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-ov-600" />mit BESS</span>
            </div>
            <div className="mt-3 flex h-36 items-end gap-1 sm:gap-1.5" aria-hidden="true">
              {erg.monate.map((m) => (
                <div key={m.name} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                  <div className="relative flex h-full w-full items-end justify-center">
                    <div className="w-full rounded-t-md bg-ink-200" style={{ height: `${hoehe(m.abrOhne)}%` }} />
                    <div className="absolute bottom-0 w-1/2 rounded-t-md bg-ov-600" style={{ height: `${hoehe(m.abrMit)}%` }} />
                  </div>
                  <span className="text-[11px] text-ink-500">{m.name}</span>
                </div>
              ))}
            </div>
            <details className="mt-3 text-[13px] text-ink-700">
              <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-ov-700">Monatswerte als Tabelle</summary>
              <div className="mt-2 overflow-x-auto" role="region" aria-label="Monatswerte Hybridpark" tabIndex={0}>
                <table className="w-full min-w-[480px] text-left text-[13px]">
                  <thead className="text-ink-500">
                    <tr>
                      <th className="py-1.5 pr-3 font-semibold">Monat</th>
                      <th className="py-1.5 pr-3 font-semibold">PV-AC</th>
                      <th className="py-1.5 pr-3 font-semibold">Abregelung ohne</th>
                      <th className="py-1.5 pr-3 font-semibold">mit BESS</th>
                      <th className="py-1.5 font-semibold">Entladung</th>
                    </tr>
                  </thead>
                  <tbody className="ov-num">
                    {erg.monate.map((m) => (
                      <tr key={m.name} className="border-t border-ink-100">
                        <td className="py-1.5 pr-3">{m.name}</td>
                        <td className="py-1.5 pr-3">{mwh(m.pvAc)}</td>
                        <td className="py-1.5 pr-3">{mwh(m.abrOhne, 1)}</td>
                        <td className="py-1.5 pr-3">{mwh(m.abrMit, 1)}</td>
                        <td className="py-1.5">{mwh(m.entladen, 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </figure>

          {tor.typ && (
            <div className="mt-5 rounded-2xl bg-sand-50/80 p-4 text-[13.5px] leading-relaxed text-ink-700">
              <p className="font-semibold text-ink-900">{tor.regelwerk}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {tor.anforderungen.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-5 text-[12.5px] leading-relaxed text-ink-500">
            Richtwert/Orientierung · vereinfachte Stundensimulation (wechselhafte Stunden in Halbstunden), typisches Wetterjahr, {de(ANNAHMEN.ertragProKwp)} kWh/kWp, Wirkungsgrad je Richtung {de(ANNAHMEN.wirkungsgrad * 100)} % (Round-Trip ≈ {de(erg.roundTrip * 100)} %), AC-gekoppelter Speicher, ohne Eigenverbrauch am Standort, ohne Regelreserve und Alterung. Viertelstunden-Spitzen liegen höher – die Abregelung wird eher unterschätzt. Keine Ertrags- oder Erlöszusage; verbindlich sind Netzberechnung und Zusage des Netzbetreibers. TOR-Einordnung nach E-Control, TOR Stromerzeugungsanlagen Typ A V1.4 / Typ B V1.3, RfG-Schwellenwert-V. Stand {STAND.split("-").reverse().join(".")} · Ökovolt Österreich.
          </p>

          <div className="hk-nicht-drucken mt-6 flex flex-col gap-3">
            <p className="flex items-center gap-2 text-[13px] text-ink-600">
              {!frei && <Lock aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-500" />}
              {frei ? "Export freigeschaltet." : "Am Bildschirm frei – CSV und PDF nach kurzer Bestätigung per E-Mail."}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => exportieren("csv")} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700">
                <Download aria-hidden="true" className="h-4 w-4" />
                Monatswerte als CSV
              </button>
              <button type="button" onClick={() => exportieren("druck")} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy-950 px-6 text-[15px] font-semibold text-white hover:bg-navy-900">
                <Printer aria-hidden="true" className="h-4 w-4" />
                Drucken / als PDF
              </button>
            </div>
          </div>
        </section>
      </div>

      {gate.dialog}
    </div>
  );
}
