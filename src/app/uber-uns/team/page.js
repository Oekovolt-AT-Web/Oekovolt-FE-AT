import TeamSection from "@/components/Team/team";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import BannerSection from "@/components/Team/banner";
import InfoSectionTeam from "@/components/Team/info";
import EndSection from "@/components/Reusable/end";
import TeamBenefitsLayout from "@/components/Team/section";
import TeamAnotherDesign from "@/components/Team/another";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.team_page.api.get_team_page`;

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
      title: "Unser Team ",
      alternates: { canonical: "https://www.oekovolt.de/uber-uns/team" },
      openGraph: { type: "website", url: "https://www.oekovolt.de/uber-uns/team", title: "Unser Team ", description: "Lernen Sie unser Expertenteam kennen. Erfahrene Spezialisten für Photovoltaik.", images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }] },
      description:
        "Lernen Sie unser Expertenteam kennen. Erfahrene Spezialisten für Photovoltaik, die Ihnen maßgeschneiderte Lösungen für nachhaltige Energie bieten.",
      keywords: [
        "Ökovolt Team",
        "Photovoltaik Experten",
        "Solar Fachleute",
        "Energieberater Team",
        "PV-Installateure",
      ],
    
    };
  }

  // Process keywords - combine API keywords with defaults if available
  const defaultKeywords = [
    "Ökovolt Team",
    "Photovoltaik Experten",
    "Solar Fachleute",
    "Energieberater Team",
    "PV-Installateure",
  ];

  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  return {
    title: seoData?.title || "Unser Team ",
    description:
      seoData?.description ||
      "Lernen Sie unser Expertenteam kennen. Erfahrene Spezialisten für Photovoltaik, die Ihnen maßgeschneiderte Lösungen für nachhaltige Energie bieten.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/uber-uns/team",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/uber-uns/team",
      title: seoData?.title || "Unser Team ",
      description:
        seoData?.description ||
        "Lernen Sie unser Expertenteam kennen. Erfahrene Spezialisten für Photovoltaik, die Ihnen maßgeschneiderte Lösungen für nachhaltige Energie bieten.",
      images: [
        {
          url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp",
          width: 1200,
          height: 630,
          alt: "Ökovolt Deutschland",
        },
      ],
    },
  };
}

export default async function TeamPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch team data", error);
  }

  return (
    <div>
      <BannerSection data={data} />
      <InfoSectionTeam data={data} />
      <TeamSection data={data} />
      <TeamBenefitsLayout data={data} />
      <TeamAnotherDesign data={data} />
      <EndSection />
    </div>
  );
}
