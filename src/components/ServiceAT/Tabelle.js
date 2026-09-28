import { Check, Minus } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * Datentabelle im Corporate Design – zitierfähig für Suchmaschinen und KI.
 *
 * props:
 *  caption     sichtbare Überschrift der Tabelle (auch als <caption>)
 *  kopf        ["Spalte 1", "Spalte 2", …]
 *  zeilen      [[zelle, zelle, …], …] – Zelle: String, JSX, true (✓), false (–)
 *  hervor      Index einer Spalte, die farblich hervorgehoben wird (z. B. empfohlenes Paket)
 *  quelle      Fußnote (String oder JSX)
 *  kompakt     kleinere Schrift für breite Tabellen
 */
export default function Tabelle({ caption, kopf = [], zeilen = [], hervor, quelle, kompakt = false, className }) {
  return (
    <Reveal className={cn("min-w-0", className)}>
      <figure className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70">
        <div className="overflow-x-auto">
          <table className={cn("w-full min-w-[640px] border-collapse text-left", kompakt ? "text-[14px]" : "text-[15px]")}>
            {caption && (
              <caption className="border-b border-ink-200/70 bg-sand-50 px-5 py-4 text-left font-display text-[16.5px] font-bold text-ink-900 md:px-6">
                {caption}
              </caption>
            )}
            {kopf.length > 0 && (
              <thead>
                <tr className="border-b border-ink-200/70">
                  {kopf.map((k, i) => (
                    <th
                      key={`${k}-${i}`}
                      scope="col"
                      className={cn(
                        "px-5 py-4 align-bottom text-[12.5px] font-semibold uppercase tracking-[0.1em] md:px-6",
                        i === hervor ? "bg-ov-600 text-white" : "text-ink-500"
                      )}
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {zeilen.map((z, zi) => (
                <tr key={zi} className="border-b border-ink-100 last:border-0">
                  {z.map((zelle, si) => {
                    const Tag = si === 0 ? "th" : "td";
                    return (
                      <Tag
                        key={si}
                        {...(si === 0 ? { scope: "row" } : {})}
                        className={cn(
                          "px-5 py-3.5 align-top leading-relaxed md:px-6",
                          si === 0 ? "font-semibold text-ink-900" : "text-ink-700",
                          si === hervor && "bg-ov-50/70"
                        )}
                      >
                        <Zelle wert={zelle} />
                      </Tag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {quelle && <figcaption className="border-t border-ink-200/70 px-5 py-3.5 text-[13px] leading-relaxed text-ink-500 md:px-6">{quelle}</figcaption>}
      </figure>
    </Reveal>
  );
}

function Zelle({ wert }) {
  if (wert === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ov-100 text-ov-700">
        <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
        <span className="sr-only">enthalten</span>
      </span>
    );
  }
  if (wert === false) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <Minus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
        <span className="sr-only">nicht enthalten</span>
      </span>
    );
  }
  return wert;
}
