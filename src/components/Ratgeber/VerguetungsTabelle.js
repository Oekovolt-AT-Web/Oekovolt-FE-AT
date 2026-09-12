import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

/**
 * Verguetungssaetze als echte <table> - wichtig, weil Google Tabellen fuer
 * Featured Snippets auswertet. Ein Grid aus <div>s wuerde das verschenken.
 *
 * Auf schmalen Displays scrollt nur die Tabelle horizontal, nicht die Seite
 * (overflow-x-auto auf dem Wrapper).
 */
export default function VerguetungsTabelle() {
  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
          <caption className="sr-only">
            Einspeisevergütung in Cent pro Kilowattstunde nach Anlagengröße,
            gültig ab {VERGUETUNG.gueltigAbLabel}
          </caption>
          <thead>
            <tr className="bg-[#003473] text-white">
              <th scope="col" className="px-4 py-3 font-semibold">
                Anlagengröße
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Überschusseinspeisung
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Volleinspeisung
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {VERGUETUNG.saetze.map((s, i) => (
              <tr
                key={s.klasse}
                className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}
              >
                <th
                  scope="row"
                  className="px-4 py-3 font-medium text-gray-900"
                >
                  {s.klasse}
                </th>
                <td className="px-4 py-3 tabular-nums text-gray-700">
                  <span className="font-semibold text-[#669933]">
                    {ct(s.teileinspeisung)}
                  </span>{" "}
                  ct/kWh
                </td>
                <td className="px-4 py-3 tabular-nums text-gray-700">
                  <span className="font-semibold text-[#669933]">
                    {ct(s.volleinspeisung)}
                  </span>{" "}
                  ct/kWh
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-gray-500">
        Sätze gültig für Inbetriebnahmen ab {VERGUETUNG.gueltigAbLabel}. Die
        Staffelung gilt anteilig: Bei einer 15-kWp-Anlage werden die ersten
        10 kWp mit dem höheren Satz vergütet, die restlichen 5 kWp mit dem
        Satz der nächsten Stufe. Quelle:{" "}
        <a
          href={VERGUETUNG.quelle.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors hover:text-[#669933]"
        >
          {VERGUETUNG.quelle.name}
        </a>
        .
      </figcaption>
    </figure>
  );
}
