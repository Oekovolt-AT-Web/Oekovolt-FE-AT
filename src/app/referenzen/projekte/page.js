// referenzen/projekte/page.js

import ProjekteBannerSection from "@/components/Project/banner";
import ProjekteAnotherDesign from "@/components/Project/endsection";
import ProjectsHero from "@/components/Project/info";
import ProjekteTechnologySection from "@/components/Project/newsection";
import ProjekteBenefitsLayout from "@/components/Project/second";
import Vorteil from "@/components/Project/vorteile";
import EndSection from "@/components/Reusable/end";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { generateSlug } from "@/lib/slugify";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.referenzen_page.api.get_referenzen`;
const PROJECTS_API = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`;
const PAGE_URL = "https://www.oekovolt.de/referenzen/projekte";

async function fetchProjekteData() {
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

async function fetchProjectsList() {
  if (!isApiConfigured()) {
    return [];
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(PROJECTS_API, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      console.error(`Projects API returned ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (Array.isArray(data?.message)) {
      return data.message;
    }
    return [];
  } catch (error) {
    console.error("Error fetching projects list:", error);
    return [];
  }
}

export async function generateMetadata() {
  const seoData = await fetchProjekteData();

  const defaultKeywords = ["Photovoltaik Referenzen", "Solarprojekte", "PV-Anlagen Beispiele", "Ökovolt Projekte", "Energielösungen Referenzen"];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Referenzprojekte",
      description: "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte. Entdecken Sie Referenzen unserer nachhaltigen Energielösungen.",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", 
        locale: "de_DE", 
        url: PAGE_URL, 
        siteName: "Ökovolt Deutschland",
        title: "Referenzprojekte ",
        description: "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Referenzprojekte" }],
      },
      twitter: { 
        card: "summary_large_image", 
        title: "Referenzprojekte ", 
        description: "Unsere erfolgreichen Photovoltaik-Projekte.", 
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] 
      },
    };
  }

  const apiKeywords = seoData?.keywords ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])] : defaultKeywords;
  const title = seoData?.title || "Referenzprojekte ";
  const description = seoData?.description || "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte. Entdecken Sie Referenzen unserer nachhaltigen Energielösungen.";

  return {
    title, 
    description, 
    keywords: apiKeywords,
    alternates: { canonical: PAGE_URL },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", 
      locale: "de_DE", 
      url: PAGE_URL, 
      siteName: "Ökovolt Deutschland",
      title, 
      description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Referenzprojekte" }],
    },
    twitter: { 
      card: "summary_large_image", 
      title, 
      description, 
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] 
    },
  };
}

export default async function ProjektePage() {
  const [data, projectsList] = await Promise.all([
    fetchProjekteData(),
    fetchProjectsList(),
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#collectionpage`,
    url: PAGE_URL,
    name: data?.title || "Referenzprojekte – Ökovolt Deutschland",
    description: data?.description || "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    ...(projectsList.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projectsList.length,
        itemListElement: projectsList.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title || p.name,
          url: `${PAGE_URL}/${(generateSlug(p.title)  || generateSlug(p.name))}`,
        })),
      },
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
      { "@type": "ListItem", position: 3, name: "Projekte", item: PAGE_URL },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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