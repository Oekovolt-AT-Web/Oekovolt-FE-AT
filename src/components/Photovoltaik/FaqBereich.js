import FaqAccordion from "@/components/Ratgeber/FaqAccordion";
import { PV_FAQ } from "@/data/photovoltaik-seite";

/** Häufige Fragen – dieselben Einträge stehen als FAQPage-Schema in page.js. */
export default function FaqBereich() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-14 md:px-12 md:py-20">
      <p className="mb-3 text-center text-[13px] font-semibold uppercase tracking-[0.15em] text-[#669933]">
        Häufige Fragen
      </p>
      <h2 className="mb-10 text-balance text-center text-[26px] font-semibold leading-tight text-gray-900 md:text-[34px]">
        Was Sie vor der Planung wissen sollten
      </h2>
      <FaqAccordion items={PV_FAQ} />
    </section>
  );
}
