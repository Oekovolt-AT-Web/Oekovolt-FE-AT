// src/app/wissen/lexikon/page.js

import Link from "next/link";
import { ArrowDown, BookOpen, Calculator, HelpCircle } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LexikonExplorer from "@/components/Lexikon/LexikonExplorer";
import { BEGRIFFE, KATEGORIEN, LEXIKON_STAND, begriffeNachBuchstabe, buchstabeVon } from "@/data/lexikon";
import { BASE_URL, FIRMA, SITE_NAME } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/wissen/lexikon`;
const ANZAHL = BEGRIFFE.length;

const TITLE = `PV-Lexikon Österreich: ${ANZAHL} Fachbegriffe | Ökovolt`;
const DESCRIPTION = `Photovoltaik in Österreich erklärt: ${ANZAHL} Begriffe von EAG, OeMAG und TOR Erzeuger über Leistungspreis und EZA-Regler bis Schneelast – präzise, Stand 2026.`;

// Österreichspezifische Rechtsbegriffe (EAG, ElWOG/ElWG, TOR) -> kein hreflang.
export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Photovoltaik Lexikon", "PV Glossar Österreich", "Erneuerbare-Energie-Gemeinschaft", "OeMAG Marktpreis", "TOR Erzeuger", "EZA-Regler", "Leistungspreis", "Investitionsfreibetrag Photovoltaik"],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: "de_AT",
    title: `Photovoltaik-Lexikon Österreich: ${ANZAHL} Fachbegriffe von A bis Z`,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Photovoltaik-Lexikon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Photovoltaik-Lexikon Österreich: ${ANZAHL} Fachbegriffe von A bis Z`,
    description: DESCRIPTION,
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

const BELIEBT = ["eeg", "marktpreis-oemag", "tor-erzeuger", "eza-regler", "leistungspreis", "ifb", "schneelastzone"];

export default function LexikonPage() {
  const gruppen = begriffeNachBuchstabe();
  const namen = Object.fromEntries(BEGRIFFE.map((b) => [b.id, b.begriff]));
  // Begriff im Fokus: die Doppeldeutigkeit von „EEG“ (AT: Energiegemeinschaft, DE: Fördergesetz)
  const fokus = BEGRIFFE.find((b) => b.id === "eeg");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        dateModified: LEXIKON_STAND,
        mainEntity: { "@id": `${PAGE_URL}/#termset` },
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${PAGE_URL}/#termset`,
        name: "Ökovolt Photovoltaik-Lexikon",
        description: "Fachbegriffe rund um Photovoltaik, Stromspeicher, E-Mobilität, Netzanschluss, Strommarkt, Förderung und Steuern in Österreich – für Gewerbe, Landwirtschaft, Gemeinden und Private.",
        url: PAGE_URL,
        inLanguage: "de-AT",
        publisher: { "@id": `${BASE_URL}/#organization` },
        hasDefinedTerm: BEGRIFFE.map((b) => ({
          "@type": "DefinedTerm",
          "@id": `${PAGE_URL}#${b.id}`,
          name: b.begriff,
          description: b.kurz,
          url: `${PAGE_URL}#${b.id}`,
          termCode: b.id,
          ...(b.synonyme?.length ? { alternateName: b.synonyme } : {}),
          inDefinedTermSet: { "@id": `${PAGE_URL}/#termset` },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Wissen", href: "/ratgeber" }, { name: "Photovoltaik-Lexikon" }]}
        eyebrow="Wissen · Stand September 2026"
        title={
          <>
            Photovoltaik-Lexikon: <span className="ov-text-gradient-light">Fachbegriffe</span> von A bis Z
          </>
        }
        lead="Von EAG und OeMAG über TOR Erzeuger, Leistungspreis und EZA-Regler bis Schneelastzone: jeder Begriff mit einer Definition in einem Satz, der österreichischen Rechtslage und dem Weg zum passenden Rechner – geschrieben vom Fachbetrieb, nicht vom Werbetexter."
        stats={[
          { value: ANZAHL, label: "Fachbegriffe erklärt" },
          { value: KATEGORIEN.length, label: "Themenfelder" },
          { value: new Set(BEGRIFFE.filter((b) => b.link).map((b) => b.link.href.split("#")[0])).size, label: "verlinkte Rechner & Seiten" },
        ]}
      >
        {fokus && (
          <aside
            aria-label="Begriff im Fokus"
            className="ov-hero-in absolute top-[200px] hidden w-[380px] xl:block"
            style={{ "--ov-delay": "300ms", right: "max(2rem, calc((100vw - 80rem) / 2 + 2rem))" }}
          >
            <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-ov-500/20 blur-3xl" />
            <div className="ov-glass relative rounded-[2rem] p-7">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">Begriff im Fokus</p>
                <span aria-hidden="true" className="font-display text-[56px] font-extrabold leading-none text-white/10">{buchstabeVon(fokus)}</span>
              </div>
              <p className="-mt-3 font-display text-[26px] font-extrabold tracking-tight text-white">{fokus.begriff}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">{fokus.kurz}</p>
              <a href={`#${fokus.id}`} className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-ov-300 hover:text-white">
                Ganze Erklärung lesen
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </aside>
        )}
        <div className="ov-hero-in mt-10" style={{ "--ov-delay": "460ms" }}>
          <p className="text-[13px] font-medium text-white/55">Oft gesucht:</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {BELIEBT.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="ov-glass inline-flex min-h-[40px] items-center rounded-full px-4 text-[14px] font-medium text-white/90 transition-colors hover:bg-white/15 hover:text-white">
                  {namen[id]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </PageHero>

      <Section tone="sand" space="md" className="md:pt-16">
        <LexikonExplorer gruppen={gruppen} kategorien={KATEGORIEN} namen={namen} />
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Vom Begriff zur Entscheidung"
          title="Verstanden – und jetzt?"
          lead="Das Lexikon erklärt die Begriffe. Was sie für Ihren Betrieb, Ihre Gemeinde oder Ihr Haus bedeuten, zeigen Rechner, Ratgeber und unsere Antworten auf die häufigsten Fragen."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Calculator, title: "Solarrechner", text: "Ertrag, Eigenverbrauch und Amortisation für Privat, Gewerbe und Landwirtschaft – mit Betriebstagen, Schichten und 20-Jahres-Cashflow.", href: "/solarrechner" },
            { icon: BookOpen, title: "Ratgeber", text: "OeMAG-Marktpreis, EAG-Förderung, TOR Erzeuger, Energiegemeinschaften und Kosten ausführlich mit Stand 2026 erklärt.", href: "/ratgeber" },
            { icon: HelpCircle, title: "Häufige Fragen", text: "Kurze, ehrliche Antworten zu Planung, Förderung, Montage und Service.", href: "/faqs" },
          ]}
        />
        <p className="mt-10 text-[14px] leading-relaxed text-ink-500">
          Fehlt ein Begriff oder hat sich eine Regel geändert?{" "}
          <Link href="/kontakt" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
            Schreiben Sie uns
          </Link>{" "}
          – wir pflegen das Lexikon laufend.
        </p>
      </Section>

      <Querverweise pfad="/wissen/lexikon" />
      <CtaBand
        title="Genug Theorie? Wir rechnen Ihr Dach durch."
        text={`Persönliche Beratung vom Elektrotechnik-Fachbetrieb aus ${FIRMA.ort} – wir erklären jeden Begriff, der in Ihrem Angebot steht, und planen die Anlage, die zu Ihrem Lastgang passt.`}
      />
    </>
  );
}
