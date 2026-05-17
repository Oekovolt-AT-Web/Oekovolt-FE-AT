import BannerSection from "@/components/Faqs/banner";
import SolarInfoAccordion from "@/components/Faqs/faqs";
import FAQInfoSection from "@/components/Faqs/info";
import EndSection from "@/components/Reusable/end";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.faqs_page.api.get_faqs_page`;
const PAGE_URL = "https://www.oekovolt.de/faqs";

export async function generateMetadata() {
  let seoData = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    const json = await res.json();
    seoData = json.message;
  } catch {
    return {
      title: "FAQ Photovoltaik | Häufige Fragen – Ökovolt",
      description: "Antworten auf Ihre wichtigsten Fragen zu Photovoltaik, Solaranlagen und Förderungen. Unser FAQ-Bereich klärt alle Themen rund um Solarenergie.",
      keywords: ["Photovoltaik FAQ", "Solaranlagen Fragen", "PV-Anlage Antworten", "Solarenergie Fragen", "Solar Förderung FAQ"],
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
        title: "FAQ Photovoltaik | Häufige Fragen – Ökovolt",
        description: "Antworten auf Ihre wichtigsten Fragen zu Photovoltaik, Solaranlagen und Förderungen.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt FAQ" }],
      },
      twitter: { card: "summary_large_image", title: "FAQ Photovoltaik | Häufige Fragen – Ökovolt", description: "Antworten auf Ihre wichtigsten Fragen zu Photovoltaik.", images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
    };
  }

  const defaultKeywords = ["Photovoltaik FAQ", "Solaranlagen Fragen", "PV-Anlage Antworten", "Solarenergie Fragen", "Solar Förderung FAQ"];
  const apiKeywords = seoData?.keywords ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])] : defaultKeywords;
  const title = seoData?.title || "FAQ Photovoltaik | Häufige Fragen – Ökovolt";
  const description = seoData?.description || "Antworten auf Ihre wichtigsten Fragen zu Photovoltaik, Solaranlagen und Förderungen. Unser FAQ-Bereich klärt alle Themen rund um Solarenergie.";

  return {
    title, description, keywords: apiKeywords,
    alternates: { canonical: PAGE_URL },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt FAQ" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
  };
}

export default async function FaqsPage() {
  let data = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 60 } });
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch FAQs data", error);
  }

  // Collect all FAQ items across all sections for FAQPage schema
  const allQuestions = [
    ...(data?.table_first_question || []),
    ...(data?.table_second_question || []),
    ...(data?.table_third_question || []),
    ...(data?.table_fourth_question || []),
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PAGE_URL}/#faqpage`,
    url: PAGE_URL,
    name: data?.title || "FAQ – Häufige Fragen zu Photovoltaik & Solaranlagen",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    mainEntity: allQuestions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
      { "@type": "ListItem", position: 2, name: "FAQs", item: PAGE_URL },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BannerSection data={data} />
      <FAQInfoSection data={data} />
      <SolarInfoAccordion data={data} />
      <EndSection />
    </div>
  );
}