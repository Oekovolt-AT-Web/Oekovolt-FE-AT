// faqs/page.js
//
// FAQ Österreich: rein redaktionell aus @/data/faqs (keine Backoffice-Fragen
// der deutschen Website – andere Rechtslage). Das FAQPage-Schema entspricht
// exakt den sichtbaren Fragen und Antworten.
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import CtaBand from "@/components/ui/CtaBand";
import FaqExplorer from "@/components/Faqs/FaqExplorer";
import { FAQ_KATEGORIEN, FAQ_STAND } from "@/data/faqs";
import { BASE_URL } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const PAGE_URL = `${BASE_URL}/faqs`;
const TITEL = "Photovoltaik FAQ Österreich: Gewerbe & Förderung | Ökovolt";
const BESCHREIBUNG =
  "Photovoltaik in Österreich: Antworten zu Wirtschaftlichkeit, EAG-Förderung, IFB, ElWG, Netzanschluss, Energiegemeinschaften, Speicher und Wartung – Stand 2026.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["Photovoltaik FAQ Österreich", "PV Gewerbe Österreich", "EAG Investitionszuschuss", "Investitionsfreibetrag Photovoltaik", "ElWG Photovoltaik", "Energiegemeinschaft", "TOR Erzeuger"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt FAQ Photovoltaik Österreich" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

export default function FaqsPage() {
  const gruppen = FAQ_KATEGORIEN.filter((g) => g.items.length > 0);
  const alle = gruppen.flatMap((g) => g.items);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PAGE_URL}/#faqpage`,
    url: PAGE_URL,
    name: "Häufige Fragen zu Photovoltaik in Österreich",
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    mainEntity: alle.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  // Escape "<" so injected JSON can never break out of the script tag
  const toJsonLd = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqSchema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Wissen", href: "/ratgeber" }, { name: "FAQs" }]}
        eyebrow="Hilfe & Antworten"
        title={
          <>
            Photovoltaik in Österreich: <span className="ov-text-gradient-light">Fragen & Antworten</span>
          </>
        }
        lead={`Wirtschaftlichkeit, Förderung und Steuern, Netzanschluss und ElWG, Energiegemeinschaften, Speicher und Wartung: die Fragen, die uns Betriebe, Landwirtschaft und Gemeinden am häufigsten stellen – präzise beantwortet, Stand ${FAQ_STAND}.`}
        stats={[
          { value: alle.length, label: "Antworten" },
          { value: gruppen.length, label: "Themen" },
          { value: 9, label: "Bundesländer" },
        ]}
      >
        <nav
          aria-label="Themen der häufigen Fragen"
          className="ov-hero-in absolute top-[200px] hidden w-[360px] xl:block"
          style={{ "--ov-delay": "300ms", right: "max(2rem, calc((100vw - 80rem) / 2 + 2rem))" }}
        >
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-ov-500/20 blur-3xl" />
          <div className="ov-glass relative rounded-[2rem] p-3">
            <p className="px-4 pb-2 pt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">Direkt zum Thema</p>
            <ul>
              {gruppen.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`} className="group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white">
                    {g.label}
                    <span className="ov-num flex h-7 min-w-7 items-center justify-center rounded-full bg-white/10 px-2 text-[12px] text-white/70 group-hover:bg-ov-500 group-hover:text-white">{g.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </PageHero>

      <Section tone="sand" space="md" className="md:pt-16">
        <FaqExplorer gruppen={gruppen} />
      </Section>

      <Querverweise pfad="/faqs" />
      <CtaBand
        title="Ihre Frage war nicht dabei? Wir nehmen uns Zeit dafür."
        text="Im persönlichen Gespräch klären wir Fläche, Lastgang, Netzanschluss, Förderung und Technik für Ihr Projekt – kostenlos und unverbindlich, in ganz Österreich."
        primary={{ label: "Beratung anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check starten", href: "/foerdercheck" }}
      />
    </div>
  );
}
