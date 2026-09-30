import { cn } from "@/components/ui/cn";
import { GRUNDLAGE_TEXT, OEMAG_MONATE, QUELLEN, REFERENZMARKTWERT_PV } from "@/data/oemag";
import { ctText, korridorFuer, monatLabel } from "@/lib/einspeisung";

/**
 * Alle belegten OeMAG-Monatswerte PV mit Korridor, Grundlage und Referenzmarktwert (neueste zuerst).
 * Scrollt auf schmalen Bildschirmen innerhalb des Rahmens, nie die ganze Seite.
 */
export default function WerteTabelle({ id, className }) {
  const rmw = Object.fromEntries(REFERENZMARKTWERT_PV.map((r) => [r.monat, r.ct]));
  const zeilen = [...OEMAG_MONATE].reverse();
  return (
    <div className={cn("overflow-x-auto rounded-2xl ring-1 ring-ink-200/70", className)} tabIndex={0} role="region" aria-labelledby={`${id}-titel`}>
      <table id={id} className="w-full min-w-[640px] border-collapse text-left text-[14px]">
        <caption id={`${id}-titel`} className="sr-only">
          OeMAG-Marktpreis Photovoltaik je Monat seit Jänner 2024 mit Korridor laut § 41 ÖSG 2012 und Referenzmarktwert PV der E-Control, ct/kWh netto
        </caption>
        <thead>
          <tr className="bg-navy-950 text-white">
            {["Monat", "OeMAG PV", "Grundlage laut OeMAG", "Korridor (unten – oben)", "Referenzmarktwert PV", "Quelle"].map((h) => (
              <th key={h} scope="col" className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 bg-white">
          {zeilen.map((m) => {
            const k = korridorFuer(m.monat);
            const q = QUELLEN[m.quelle];
            return (
              <tr key={m.monat} className="hover:bg-ov-50/40">
                <th scope="row" className="whitespace-nowrap px-4 py-2.5 font-semibold text-ink-900">{monatLabel(m.monat)}</th>
                <td className="ov-num whitespace-nowrap px-4 py-2.5 font-semibold text-ink-900">{ctText(m.ct)} ct</td>
                <td className="whitespace-nowrap px-4 py-2.5 text-ink-700">{GRUNDLAGE_TEXT[m.grundlage]}</td>
                <td className="ov-num whitespace-nowrap px-4 py-2.5 text-ink-600">{k ? `${ctText(k.unter)} – ${ctText(k.ober)} ct` : "–"}</td>
                <td className="ov-num whitespace-nowrap px-4 py-2.5 text-ink-600">{Number.isFinite(rmw[m.monat]) ? `${ctText(rmw[m.monat], 2)} ct` : "–"}</td>
                <td className="whitespace-nowrap px-4 py-2.5">
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                    {m.quelle === "oemag" ? "oem-ag.at" : `PDF ${m.monat.slice(0, 4)}`}
                    <span className="sr-only"> (externer Link, neues Fenster)</span>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
