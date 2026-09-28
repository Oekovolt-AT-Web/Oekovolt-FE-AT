import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";

/**
 * FAQ-Abschnitt. Die Faq-Komponente liefert das FAQPage-Schema selbst –
 * Antworten daher als reinen Text führen, damit Schema und sichtbarer
 * Inhalt exakt übereinstimmen.
 */
export default function FaqSektion({ items, titel = "Häufige Fragen", lead, eyebrow = "FAQ", tone = "white" }) {
  return (
    <Section tone={tone} space="lg">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading eyebrow={eyebrow} title={titel} lead={lead} />
        <Faq items={items} />
      </div>
    </Section>
  );
}
