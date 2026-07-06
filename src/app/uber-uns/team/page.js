// uber-uns/team/page.js

import TeamSection from "@/components/Team/team";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import BannerSection from "@/components/Team/banner";
import InfoSectionTeam from "@/components/Team/info";
import EndSection from "@/components/Reusable/end";
import TeamBenefitsLayout from "@/components/Team/section";
import TeamAnotherDesign from "@/components/Team/another";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.team_page.api.get_team_page`;
const PAGE_URL = "https://www.oekovolt.de/uber-uns/team";

async function fetchTeamData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await response.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

export async function generateMetadata() {
  const seoData = await fetchTeamData();

  const defaultKeywords = ["Ökovolt Team", "Photovoltaik Experten", "Solar Fachleute", "Energieberater Team", "PV-Installateure"];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Unser Team – die Photovoltaik-Experten | Ökovolt",
      description: "Lernen Sie das Ökovolt-Team kennen: erfahrene Photovoltaik-Experten aus Türkheim – von der Planung bis zur Montage Ihrer Solaranlage mit Leidenschaft dabei.",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL, },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",

        url: PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "Unser Team – die Photovoltaik-Experten | Ökovolt",
        description: "Lernen Sie das Ökovolt-Team kennen: erfahrene Photovoltaik-Experten aus Türkheim – von der Planung bis zur Montage Ihrer Solaranlage mit Leidenschaft dabei.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Team" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Unser Team – die Photovoltaik-Experten | Ökovolt",
        description: "Lernen Sie unser Expertenteam kennen.",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
      },
    };
  }

  const apiKeywords = seoData?.keywords ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])] : defaultKeywords;
  const title = "Unser Team – die Photovoltaik-Experten | Ökovolt";
  const description = "Lernen Sie das Ökovolt-Team kennen: erfahrene Photovoltaik-Experten aus Türkheim – von der Planung bis zur Montage Ihrer Solaranlage mit Leidenschaft dabei.";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: PAGE_URL, },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Team" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
    },
  };
}

export default async function TeamPage() {
  const data = await fetchTeamData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Unser Team | Ökovolt Deutschland",
    description: data?.description || "Lernen Sie unser Expertenteam kennen. Erfahrene Spezialisten für Photovoltaik, die Ihnen maßgeschneiderte Lösungen für nachhaltige Energie bieten.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Über Uns", item: "https://www.oekovolt.de/uber-uns" },
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