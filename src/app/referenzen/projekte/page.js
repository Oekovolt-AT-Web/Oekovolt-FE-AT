import ProjekteBannerSection from "@/components/Project/banner";
import ProjekteAnotherDesign from "@/components/Project/endsection";
import ProjectsHero from "@/components/Project/info";
import ProjekteTechnologySection from "@/components/Project/newsection";
import ProjekteBenefitsLayout from "@/components/Project/second";
import Vorteil from "@/components/Project/vorteile";
import EndSection from "@/components/Reusable/end";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.referenzen_page.api.get_referenzen`;

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
      title: "Referenzen ",
      alternates: { canonical: "https://www.oekovolt.de/referenzen/projekte" },
      openGraph: { type: "website", url: "https://www.oekovolt.de/referenzen/projekte", title: "Referenzen ", description: "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte.", images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }] },
      description:
        "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte. Entdecken Sie Referenzen unserer nachhaltigen Energielösungen.",
      keywords: [
        "Photovoltaik Referenzen",
        "Solarprojekte",
        "PV-Anlagen Beispiele",
        "Ökovolt Projekte",
        "Energielösungen Referenzen",
      ],
   
    };
  }

  // Process keywords - combine API keywords with defaults if available
  const defaultKeywords = [
    "Photovoltaik Referenzen",
    "Solarprojekte",
    "PV-Anlagen Beispiele",
    "Ökovolt Projekte",
    "Energielösungen Referenzen",
  ];

  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  return {
    title: seoData?.title || "Referenzen ",
    description:
      seoData?.description ||
      "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte. Entdecken Sie Referenzen unserer nachhaltigen Energielösungen.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/referenzen/projekte",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/referenzen/projekte",
      title: seoData?.title || "Referenzen ",
      description:
        seoData?.description ||
        "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte. Entdecken Sie Referenzen unserer nachhaltigen Energielösungen.",
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

export default async function ProjektePage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch projects data", error);
  }

  return (
    <div>
      <ProjekteBannerSection data={data} />
      <ProjectsHero data={data} />
      <ProjekteTechnologySection data={data} />
      <ProjekteBenefitsLayout data={data} />
      <Vorteil data={data} />
      <ProjekteAnotherDesign data={data} />
      <EndSection />
    </div>
  );
}
