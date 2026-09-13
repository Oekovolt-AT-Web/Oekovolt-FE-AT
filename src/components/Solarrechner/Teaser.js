import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/**
 * Kompakter Hinweis auf einen Rechner fuer Produkt- und Serviceseiten.
 *
 * Zweck ist doppelt: Der Besucher bekommt an der Stelle, an der die Frage
 * "was bringt mir das?" aufkommt, ein Werkzeug statt eines Formulars - und
 * die Geldseiten verlinken auf die Rechner.
 */
export default function SolarrechnerTeaser({
  href = "/solarrechner",
  cta = "Zum Solarrechner",
  titel = "Was bringt Ihnen eine PV-Anlage?",
  text = "Anlagengröße, Verbrauch und Dach eingeben – Sie sehen sofort Jahresertrag, Ersparnis, Autarkie und Amortisation.",
  className = "",
}) {
  return (
    <section className={`ov-container py-12 md:py-16 ${className}`}>
      <Reveal dir="scale">
        <Link
          href={href}
          className="group relative flex flex-col gap-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-ov-500 to-ov-700 p-7 text-white shadow-[0_30px_60px_-30px_rgba(67,102,33,0.7)] md:flex-row md:items-center md:justify-between md:p-10"
        >
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-70" />
          <div aria-hidden="true" className="absolute -right-10 -top-24 h-72 w-72 rounded-full bg-sun-300/25 blur-3xl transition-transform duration-700 group-hover:scale-125" />
          <div className="relative flex items-start gap-5">
            <span aria-hidden="true" className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 sm:flex">
              <Calculator className="h-7 w-7" />
            </span>
            <div>
              <h2 className="font-display text-[22px] font-extrabold leading-tight tracking-tight md:text-[28px]">{titel}</h2>
              <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-white/85 md:text-[16.5px]">{text}</p>
            </div>
          </div>
          <span className="relative inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-ov-800 shadow-lg transition-transform group-hover:scale-[1.03] md:self-auto">
            {cta}
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
