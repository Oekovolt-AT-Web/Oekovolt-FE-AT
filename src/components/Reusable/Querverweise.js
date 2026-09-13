import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { querverweiseFuer } from "@/data/verlinkung";

/**
 * Thematische Querverweise am Ende einer Seite.
 *
 * Zweck ist nicht Dekoration, sondern Struktur: Vor dieser Komponente hatte
 * praktisch keine Seite einen redaktionellen Eingangslink – jede war nur
 * ueber das Menue erreichbar. Die Verweise stehen kuratiert in
 * @/data/verlinkung und nutzen sprechende Ankertexte.
 *
 * Rendert nichts, wenn fuer den Pfad nichts hinterlegt ist.
 */
export default function Querverweise({ pfad, ueberschrift = "Das könnte Sie auch interessieren" }) {
  const verweise = querverweiseFuer(pfad);
  if (verweise.length === 0) return null;

  return (
    <section
      aria-labelledby="querverweise-titel"
      className="border-t border-gray-100 bg-[#f7f9f4]"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
        <h2
          id="querverweise-titel"
          className="mb-7 text-[22px] font-semibold text-gray-900 md:text-[26px]"
        >
          {ueberschrift}
        </h2>

        {/* Spalten nach Anzahl: bei vier Verweisen stand sonst eine Karte
            allein in der zweiten Reihe. */}
        <ul
          className={`grid gap-4 sm:grid-cols-2 ${
            verweise.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {verweise.map((v) => (
            <li key={v.href} className="contents">
              <article className="group relative flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-within:ring-2 focus-within:ring-[#669933] focus-within:ring-offset-2">
                <h3 className="mb-1.5 text-[17px] font-semibold leading-snug text-gray-900 transition-colors group-hover:text-[#669933]">
                  {/* Stretched Link: genau EIN Link je Karte auf die Ziel-URL. */}
                  <Link
                    href={v.href}
                    className="outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    {v.titel}
                  </Link>
                  {/* Inline statt Flex: bricht der Titel um, bleibt der Pfeil
                      am letzten Wort statt am rechten Kartenrand zu stehen. */}
                  <ArrowRight
                    aria-hidden="true"
                    className="ml-1.5 inline-block h-4 w-4 align-[-2px] transition-transform group-hover:translate-x-1"
                  />
                </h3>
                <p className="text-[15px] leading-relaxed text-gray-600 [hyphens:manual]">{v.text}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
