import { Info } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { CO2_G_PRO_KWH, ERTRAG_JE_KWP, QUELLEN, fmtCa } from "@/lib/kundenbuehne";

const de = (n, d = 0) => Number(n).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Offengelegter Rechenweg der Schätzung (Jahresertrag und CO₂) mit Quellen */
export default function Rechenweg({ zahlen, className, kompakt = false }) {
  if (!zahlen) return null;
  const ausAnlage = zahlen.quelleErtrag === "anlage";
  return (
    <div className={cn("rounded-3xl bg-ov-50 p-6 ring-1 ring-ov-200/70 md:p-7", className)}>
      <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">
        <Info aria-hidden="true" className="h-4 w-4" />
        So rechnen wir (Schätzung)
      </p>
      <ol className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-ink-700">
        <li>
          <strong className="text-ink-900">Jahresertrag:</strong>{" "}
          {ausAnlage ? (
            <>Wert aus den Anlagendaten: {de(zahlen.ertragKwh)} kWh ≈ {fmtCa(zahlen.mwh)} MWh.</>
          ) : (
            <>
              {de(zahlen.kwp, zahlen.kwp % 1 ? 2 : 0)} kWp × {de(ERTRAG_JE_KWP)} kWh/kWp = {de(zahlen.ertragKwh)} kWh ≈ {fmtCa(zahlen.mwh)} MWh.
            </>
          )}
        </li>
        <li>
          <strong className="text-ink-900">CO₂-Vermeidung:</strong> {de(zahlen.ertragKwh)} kWh × {de(CO2_G_PRO_KWH, 1)} g CO₂äqu/kWh = {de(zahlen.co2Kg)} kg ≈ {fmtCa(zahlen.co2T)} t pro Jahr.
        </li>
      </ol>
      {!kompakt && (
        <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
          {!ausAnlage && (
            <>
              {de(ERTRAG_JE_KWP)} kWh/kWp ist ein vorsichtiger Mittelwert für Österreich ({QUELLEN.ertrag.titel}); je nach Standort, Ausrichtung und Verschattung liegt der tatsächliche Ertrag darüber oder darunter.{" "}
            </>
          )}
          Der CO₂-Faktor ist der Substitutionsfaktor für Photovoltaik-Strom in Österreich ({QUELLEN.co2.titel}) – derselbe Wert wie in unseren Rechnern.
        </p>
      )}
    </div>
  );
}
