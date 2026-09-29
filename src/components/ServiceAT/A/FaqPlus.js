import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";

/**
 * FAQ mit redaktionellen Weiterlesen-Links in der linken Spalte (spart einen
 * eigenen Link-Abschnitt). Faq liefert das FAQPage-Schema aus dem sichtbaren Text.
 *
 * props: items [{ q, a }], titel, lead, eyebrow, links [{ href, titel, text?, art? }], tone
 */
export default function FaqPlus({ items = [], titel = "Häufige Fragen", lead, eyebrow = "FAQ", links = [], tone = "sand", linkTitel = "Weiterführend" }) {
  return (
    <Section tone={tone} space="md">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="min-w-0">
          <SectionHeading eyebrow={eyebrow} title={titel} lead={lead} />
          {links.length > 0 && (
            <nav aria-label={linkTitel} className="mt-10">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">{linkTitel}</p>
              <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
                {links.map((l) => (
                  <li key={l.href} className="border-b border-ink-200/80">
                    <Link href={l.href} className="group flex min-h-12 items-center gap-3 py-2.5 text-left">
                      <span className="min-w-0 flex-1">
                        {l.art && <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-400">{l.art}</span>}
                        <span className="block font-display text-[14.5px] font-bold leading-snug text-ink-900 group-hover:text-ov-700">{l.titel}</span>
                      </span>
                      <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ov-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
        <Faq items={items} />
      </div>
    </Section>
  );
}
