"use client";

import { Schalter } from "@/components/Rechner/bausteine";
import { Zahlfeld } from "@/components/RechnerGewerbe/GewerbeBausteine";
import { ereignis } from "@/lib/statistik";
import { gateKopfzeilen } from "./LeadGateSchlank";
import { gateKennung } from "@/lib/dossier/rechnung";

/**
 * Eingabefelder der Dossier-Rechnung (Stufe 2: Eingaben sind frei, die Auswertung startet erst
 * nach dem Lead-Gate). Werte bleiben im Browser; keine Personendaten.
 */
export default function DossierEingaben({ e, onChange, mitCo2 = false, dunkel = false, richtwertInvestition = null }) {
  const set = (k, v) => onChange({ ...e, [k]: v });
  const label = dunkel ? "text-white/80" : "text-ink-700";
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Zahlfeld label="Anlagenleistung" wert={e.kwp} onChange={(v) => set("kwp", v)} einheit="kWp" min={5} max={5000} step={5} />
      <div>
        <Zahlfeld label={e.investition == null ? "Investition netto (Richtwert aktiv)" : "Investition netto (Ihre Eingabe)"} wert={e.investition ?? richtwertInvestition ?? NaN} onChange={(v) => set("investition", v)} einheit="€" min={1000} max={20000000} step={1000} />
        {e.investition != null && (
          <button type="button" onClick={() => set("investition", null)} className="mt-1 inline-flex min-h-11 items-center text-[12.5px] font-semibold text-ov-700 underline underline-offset-2 hover:text-ov-800">
            Richtwert aus der Marktstatistik verwenden
          </button>
        )}
      </div>
      <Zahlfeld label="Spezifischer Ertrag" wert={e.ertragProKwp} onChange={(v) => set("ertragProKwp", v)} einheit="kWh/kWp" min={500} max={1500} step={10} />
      <Zahlfeld label="Eigenverbrauchsquote" wert={Math.round(e.eigenverbrauchsquote * 100)} onChange={(v) => set("eigenverbrauchsquote", v / 100)} einheit="%" min={0} max={100} step={1} />
      <Zahlfeld label="Vermiedener Strompreis" wert={e.strompreisCt} onChange={(v) => set("strompreisCt", v)} einheit="ct/kWh" min={3} max={60} step={0.5} />
      <Zahlfeld label="Kalkulationszins (WACC)" wert={Math.round(e.kalkulationszins * 1000) / 10} onChange={(v) => set("kalkulationszins", v / 100)} einheit="%" min={0} max={15} step={0.5} />
      <Zahlfeld label="Fremdkapitalanteil (0 = ohne Kredit)" wert={Math.round(e.fremdkapitalAnteil * 100)} onChange={(v) => set("fremdkapitalAnteil", v / 100)} einheit="%" min={0} max={100} step={5} />
      <Zahlfeld label="Kreditzins (Beispiel)" wert={Math.round(e.kreditZins * 10000) / 100} onChange={(v) => set("kreditZins", v / 100)} einheit="% p. a." min={0} max={15} step={0.25} />
      <Zahlfeld label="Kreditlaufzeit" wert={e.kreditJahre} onChange={(v) => set("kreditJahre", v)} einheit="Jahre" min={1} max={25} step={1} />
      {mitCo2 && (
        <>
          <Zahlfeld label="Stromverbrauch des Betriebs" wert={e.strombezugKwh} onChange={(v) => set("strombezugKwh", v)} einheit="kWh/a" min={0} max={50000000} step={1000} />
          <Zahlfeld label="Berichtsjahr (CO₂-Text)" wert={e.berichtsjahr} onChange={(v) => set("berichtsjahr", v)} einheit="" min={2024} max={2060} step={1} />
        </>
      )}
      <div className={`sm:col-span-2 lg:col-span-3 ${label}`}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Schalter label="Investitionsfreibetrag (22 % bis 31.12.2026)" beschreibung="Steuereffekt mit 23 % KöSt im Jahr 1 – nur beim Kauf" an={!!e.ifb} onChange={(v) => set("ifb", v)} />
          <Schalter label="EAG-Investitionszuschuss ansetzen" beschreibung="Nur im Fördercall, kein Rechtsanspruch" an={!!e.eag} onChange={(v) => set("eag", v)} />
        </div>
      </div>
    </div>
  );
}

/** PDF über das Lead-Gate (Kennung „dossier“ bzw. „investitionsantrag“, Aktion „pdf“) anfordern und als Datei speichern. */
export async function pdfHerunterladen({ variante, eingaben, eintraege = [], kontakt = null }) {
  const res = await fetch("/api/dossier/pdf", {
    method: "POST",
    headers: gateKopfzeilen(gateKennung(variante)),
    body: JSON.stringify({ variante, eingaben, eintraege, kontakt }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.fehler || String(res.status));
  }
  const blob = await res.blob();
  const name = (res.headers.get("Content-Disposition") || "").match(/filename="([^"]+)"/)?.[1] || "Oekovolt-Dossier.pdf";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  ereignis("dossier_pdf", { variante });
  return name;
}
