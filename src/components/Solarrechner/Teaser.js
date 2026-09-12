import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

/**
 * Kompakter Hinweis auf den Solarrechner fuer Produkt- und Serviceseiten.
 *
 * Zweck ist doppelt: Der Besucher bekommt an der Stelle, an der die Frage
 * "was bringt mir das?" aufkommt, ein Werkzeug statt eines Formulars - und
 * die Geldseiten verlinken auf /solarrechner, statt dass nur der Ratgeber
 * nach aussen verlinkt.
 */
export default function SolarrechnerTeaser({
  // Standardziel ist der Rechner; auf der Wallbox-Seite passt der Ratgeber besser.
  href = "/solarrechner",
  cta = "Zum Solarrechner",
  titel = "Was bringt Ihnen eine PV-Anlage?",
  text = "Anlagengröße, Verbrauch und Dach eingeben – Sie sehen sofort Jahresertrag, Ersparnis, Autarkie und Amortisation.",
  className = "",
}) {
  return (
    <section className={`mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16 ${className}`}>
      <div className="flex flex-col items-start gap-6 rounded-2xl bg-[#f0f7e6] p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="hidden shrink-0 rounded-xl bg-white p-3 shadow-sm sm:block"
          >
            <Calculator className="h-6 w-6 text-[#669933]" />
          </span>
          <div>
            <h2 className="mb-1.5 text-[20px] font-semibold text-gray-900 md:text-[24px]">
              {titel}
            </h2>
            <p className="max-w-[60ch] text-[15px] leading-relaxed text-gray-600 md:text-[16px]">
              {text}
            </p>
          </div>
        </div>

        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-2 rounded-md px-6 py-3 text-[14px] font-semibold uppercase text-white transition-colors hover:bg-[#558822]"
          style={{ backgroundColor: "#669933" }}
        >
          {cta}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
