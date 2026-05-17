import TeamSection from "@/components/Team/team";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import BannerSection from "@/components/Team/banner";
import InfoSectionTeam from "@/components/Team/info";
import EndSection from "@/components/Reusable/end";
import TeamBenefitsLayout from "@/components/Team/section";
import TeamAnotherDesign from "@/components/Team/another";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.team_page.api.get_team_page`;
const PAGE_URL = "https://www.oekovolt.de/uber-uns/team";

export async function generateMetadata() {
  let seoData = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    const json = await res.json();
    seoData = json.message;
  } catch {
    return {
      title: "Unser Team | Ökovolt Deutschland",
      description: "Lernen Sie unser Expertenteam kennen. Erfahrene Spezialisten für Photovoltaik, die Ihnen maßgeschneiderte Lösungen für nachhaltige Energie bieten.",
      keywords: ["Ökovolt Team", "Photovoltaik Experten", "Solar Fachleute", "Energieberater Team", "PV-Installateure"],
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
        title: "Unser Team | Ökovolt Deutschland",
        description: "Lernen Sie unser Expertenteam kennen. Erfahrene Spezialisten für Photovoltaik.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Team" }],
      },
      twitter: { card: "summary_large_image", title: "Unser Team | Ökovolt Deutschland", description: "Lernen Sie unser Expertenteam kennen.", images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
    };
  }

  const defaultKeywords = ["Ökovolt Team", "Photovoltaik Experten", "Solar Fachleute", "Energieberater Team", "PV-Installateure"];
  const apiKeywords = seoData?.keywords ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])] : defaultKeywords;
  const title = seoData?.title || "Unser Team | Ökovolt Deutschland";
  const description = seoData?.description || "Lernen Sie unser Expertenteam kennen. Erfahrene Spezialisten für Photovoltaik, die Ihnen maßgeschneiderte Lösungen für nachhaltige Energie bieten.";

  return {
    title, description, keywords: apiKeywords,
    alternates: { canonical: PAGE_URL },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Team" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
  };
}

export default async function TeamPage() {
  let data = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 60 } });
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch team data", error);
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Unser Team | Ökovolt Deutschland",
    description: data?.description || "Lernen Sie unser Expertenteam kennen. Erfahrene Spezialisten für Photovoltaik.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Über Uns", item: "https://www.oekovolt.de/uber-uns/team" },
        { "@type": "ListItem", position: 3, name: "Team", item: PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <BannerSection data={data} />
      <InfoSectionTeam data={data} />
      <TeamSection data={data} />
      <TeamBenefitsLayout data={data} />
      <TeamAnotherDesign data={data} />
      <EndSection />
    </div>
  );
}