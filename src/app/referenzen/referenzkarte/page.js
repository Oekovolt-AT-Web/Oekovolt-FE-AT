// referenzen/referenzkarte/page.js

import BannerSection from "@/components/Reusable/banner";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import ProjectsSection from "@/components/Referenzkarte/referenzInfo";
import BenefitsLayout from "@/components/Reusable/benefitsSection";
import MapContainer from "@/components/Referenzkarte/map";
import TechnologySection from "@/components/Reusable/TechnologySection";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import ReferenzkarteBannerSection from "@/components/Referenzkarte/banner";
import EndSection from "@/components/Reusable/end";
import ReferenzkarteBenefitsLayout from "@/components/Referenzkarte/newsection";
import ReferenzkarteTechnologySection from "@/components/Referenzkarte/endsection";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.referenzstandorde_page.api.get_referenzstandorde_page`;
const RK_PAGE_URL = "https://www.oekovolt.de/referenzen/referenzkarte";

async function fetchReferenzkarteData() {
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
  const seoData = await fetchReferenzkarteData();

  const defaultKeywords = [
    "Photovoltaik Referenzkarte",
    "Solarprojekte Karte",
    "PV-Anlagen Standorte",
    "Ökovolt Referenzen",
    "Energielösungen Standorte",
  ];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Referenzkarte Photovoltaik Standorte | Ökovolt Deutschland",
      description: "Unsere Photovoltaik-Projekte auf der Karte. Entdecken Sie unsere Referenzstandorte in ganz Deutschland.",
      keywords: defaultKeywords,
      alternates: { canonical: RK_PAGE_URL,},
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", 
         
        url: RK_PAGE_URL, 
        siteName: "Ökovolt Deutschland",
        title: "Referenzkarte Photovoltaik Standorte | Ökovolt Deutschland",
        description: "Unsere Photovoltaik-Projekte auf der Karte. Entdecken Sie unsere Referenzstandorte in ganz Deutschland.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
      },
      twitter: { 
        card: "summary_large_image", 
        title: "Referenzkarte Photovoltaik Standorte | Ökovolt Deutschland", 
        description: "Unsere Photovoltaik-Projekte auf der Karte.", 
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] 
      },
    };
  }

  // Process keywords - combine API keywords with defaults if available
  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  const title = "Referenzkarte Photovoltaik Standorte | Ökovolt Deutschland";
  const description = seoData?.description || "Unsere Photovoltaik-Projekte auf der Karte. Entdecken Sie unsere Referenzstandorte in ganz Deutschland.";
  const canonical = RK_PAGE_URL;

  return {
    title, 
    description, 
    keywords: apiKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", 
       
      url: canonical, 
      siteName: "Ökovolt Deutschland",
      title, 
      description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Referenzkarte – Photovoltaik Standorte Deutschland" }],
    },
    twitter: { 
      card: "summary_large_image", 
      title, 
      description, 
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] 
    },
  };
}

export default async function ReferenzkarteSeite() {
  const data = await fetchReferenzkarteData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${RK_PAGE_URL}/#webpage`,
    url: RK_PAGE_URL,
    name: data?.title || "Referenzkarte – Ökovolt Photovoltaik Standorte",
    description: data?.description || "Unsere Photovoltaik-Projekte auf der Karte. Entdecken Sie unsere Referenzstandorte in ganz Deutschland.",
    
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
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