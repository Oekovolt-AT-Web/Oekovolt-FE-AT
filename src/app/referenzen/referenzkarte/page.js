import BannerSection from "@/components/Reusable/banner";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import ProjectsSection from "@/components/Referenzkarte/referenzInfo";
import BenefitsLayout from "@/components/Reusable/benefitsSection";
import MapContainer from "@/components/Referenzkarte/map";
import TechnologySection from "@/components/Reusable/TechnologySection";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import ReferenzkarteBannerSection from "@/components/Referenzkarte/banner";
import EndSection from "@/components/Reusable/end";
import ReferenzkarteBenefitsLayout from "@/components/Referenzkarte/newsection";
import ReferenzkarteTechnologySection from "@/components/Referenzkarte/endsection";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.referenzstandorde_page.api.get_referenzstandorde_page`;

export async function generateMetadata() {
  // Fetch data for metadata
  let seoData = null;
  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 3600 } }) ;
    const json = await res.json();
    seoData = json.message;
  } catch (error) {
    console.error("Failed to fetch SEO data", error);
    // Fallback metadata if API fails
    return {
      title: "Referenzkarte Photovoltaik Standorte | Ökovolt Deutschland",
      alternates: { canonical: "https://www.oekovolt.de/referenzen/referenzkarte" },
      openGraph: { type: "website", url: "https://www.oekovolt.de/referenzen/referenzkarte", title: "Referenzkarte ", description: "Unsere Photovoltaik-Projekte auf der Karte. Entdecken Sie unsere Referenzstandorte in ganz Deutschland.", images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }] },
      description:
        "Unsere Photovoltaik-Projekte auf der Karte. Entdecken Sie unsere Referenzstandorte in ganz Deutschland.",
      keywords: [
        "Photovoltaik Referenzkarte",
        "Solarprojekte Karte",
        "PV-Anlagen Standorte",
        "Ökovolt Referenzen",
        "Energielösungen Standorte",
      ],
    
    };
  }

  // Process keywords - combine API keywords with defaults if available
  const defaultKeywords = [
    "Photovoltaik Referenzkarte",
    "Solarprojekte Karte",
    "PV-Anlagen Standorte",
    "Ökovolt Referenzen",
    "Energielösungen Standorte",
  ];

  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  const title = seoData?.title?.trim() || "Referenzkarte Photovoltaik Standorte | Ökovolt Deutschland";
  const description = seoData?.description || "Unsere Photovoltaik-Projekte auf der Karte. Entdecken Sie unsere Referenzstandorte in ganz Deutschland.";
  const canonical = "https://www.oekovolt.de/referenzen/referenzkarte";

  return {
    title, description, keywords: apiKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", locale: "de_DE", url: canonical, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Referenzkarte – Photovoltaik Standorte Deutschland" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
  };
}

const RK_PAGE_URL = "https://www.oekovolt.de/referenzen/referenzkarte";

export default async function ReferenzkarteSeite() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch reference map data", error);
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${RK_PAGE_URL}/#webpage`,
    url: RK_PAGE_URL,
    name: data?.title || "Referenzkarte – Ökovolt Photovoltaik Standorte",
    description: data?.description || "Unsere Photovoltaik-Projekte auf der Karte. Entdecken Sie unsere Referenzstandorte in ganz Deutschland.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Referenzen", item: "https://www.oekovolt.de/referenzen/referenzkarte" },
        { "@type": "ListItem", position: 3, name: "Referenzkarte", item: RK_PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <ReferenzkarteBannerSection data={data} />
      <ProjectsSection data={data} />
      <MapContainer data={data} />
      <ReferenzkarteBenefitsLayout data={data} />
      <ReferenzkarteTechnologySection data={data} />
      <EndSection />
    </div>
  );
}