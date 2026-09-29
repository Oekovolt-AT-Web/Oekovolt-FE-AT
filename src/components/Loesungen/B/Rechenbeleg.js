import { cn } from "@/components/ui/cn";

/**
 * Beispielrechnung als „Beleg“: Position links, Rechenweg klein darunter,
 * Ergebnis rechtsbündig. Hervorgehobene Zeilen (Summen) mit grünem Grund.
 * Mobil ohne Tabellen-Scrollen lesbar. Semantisch eine Tabelle (Screenreader).
 *
 * zeilen: [{ pos, wert, ergebnis, hervorheben? }]
 */
export default function Rechenbeleg({ caption, titel, zeilen = [], fuss, className }) {
  return (
    <figure className={cn("overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70", className)}>
      {titel && (
        <div className="flex items-center justify-between gap-4 border-b border-dashed border-ink-200 px-6 py-5 md:px-8">
          <p className="font-display text-[17px] font-bold text-ink-900">{titel}</p>
          <span className="rounded-full bg-sand-100 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">Beispiel</span>
        </div>
      )}
      <table className="w-full border-collapse text-left">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="sr-only">
          <tr>
            <th scope="col">Position</th>
            <th scope="col">Ergebnis</th>
          </tr>
        </thead>
        <tbody>
          {zeilen.map((z, i) => (
            <tr key={i} className={cn("align-top", z.hervorheben ? "bg-ov-50" : i > 0 && "border-t border-ink-100")}>
              <th scope="row" className="px-6 py-4 font-normal md:px-8">
                <span className={cn("block text-[15px] leading-snug", z.hervorheben ? "font-bold text-ink-900" : "font-semibold text-ink-800")}>{z.pos}</span>
                {z.wert && z.wert !== "–" && <span className="ov-num mt-1 block text-[13.5px] leading-relaxed text-ink-500">{z.wert}</span>}
                {z.ergebnis !== "–" && <span className={cn("ov-num mt-2 block font-display md:hidden", z.hervorheben ? "text-[18px] font-extrabold text-ov-800" : "text-[15.5px] font-bold text-ink-900")}>{z.ergebnis}</span>}
              </th>
              <td className={cn("ov-num hidden whitespace-nowrap px-6 py-4 text-right font-display md:table-cell md:px-8", z.hervorheben ? "text-[18px] font-extrabold text-ov-800 md:text-[20px]" : "text-[15.5px] font-bold text-ink-900")}>
                {z.ergebnis}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {fuss && <figcaption className="border-t border-ink-100 bg-sand-50 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">{fuss}</figcaption>}
    </figure>
  );
}
