// produkte/smartenergyhome/page.js

import SmartBanner from "@/components/smartenergyhome/banner";
import HeroEnergy from "@/components/smartenergyhome/hero";
import SmartEnergySection from "@/components/smartenergyhome/smartenergy";
import ThirdPart from "@/components/smartenergyhome/third";
import EnergyOfferSection from "@/components/smartenergyhome/fourth";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.smart_energy_home_page.api.get_smart_energy_page_with_keywords`;

async function fetchSmartEnergyData() {
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
  const seoData = await fetchSmartEnergyData();

  const defaultKeywords = [
    "Smart Energy",
    "Energiemanagement",
    "Energieeffizienz",
    "Intelligente Stromnutzung",
    "Nachhaltige Energie",
  ];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Smart Energy Lösungen | Ökovolt Deutschland",
      description: "Innovative Smart Energy Lösungen für intelligentes Energiemanagement in Ihrem Zuhause. Energieeffizienz, Nachhaltigkeit und Kosteneinsparung durch moderne Technologie.",
      keywords: defaultKeywords,
      alternates: {
        canonical: "https://www.oekovolt.de/produkte/smartenergyhome",
        languages: { "de-DE": "https://www.oekovolt.de/produkte/smartenergyhome" },
      },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de/produkte/smartenergyhome",
        title: "Smart Energy Lösungen | Ökovolt Deutschland",
        description: "Innovative Smart Energy Lösungen für intelligentes Energiemanagement.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Smart Energy Lösungen | Ökovolt Deutschland",
        description: "Innovative Smart Energy Lösungen für intelligentes Energiemanagement.",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : defaultKeywords;

  const title = "Smart Energy Lösungen | Ökovolt Deutschland";
  const description = seoData?.description || "Innovative Smart Energy Lösungen für intelligentes Energiemanagement in Ihrem Zuhause. Energieeffizienz, Nachhaltigkeit und Kosteneinsparung durch moderne Technologie.";
  const canonical = "https://www.oekovolt.de/produkte/smartenergyhome";

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
      images: [
        {
          url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp",
          width: 1200,
          height: 630,
          alt: "Ökovolt Deutschland",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
    },
  };
}

const SMART_ENERGY_PAGE_URL = "https://www.oekovolt.de/produkte/smartenergyhome";

export default async function SmartEnergyPage() {
  const data = await fetchSmartEnergyData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SMART_ENERGY_PAGE_URL}/#webpage`,
    url: SMART_ENERGY_PAGE_URL,
    name: data?.title || "Smart Energy Lösungen | Ökovolt Deutschland",
    description: data?.description || "Innovative Smart Energy Lösungen für intelligentes Energiemanagement in Ihrem Zuhause. Energieeffizienz, Nachhaltigkeit und Kosteneinsparung durch moderne Technologie.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Produkte", item: "https://www.oekovolt.de/produkte" },
        { "@type": "ListItem", position: 3, name: "Smart Energy Home", item: SMART_ENERGY_PAGE_URL },
      ],
    },
  };

  return (
    <div className="relative w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <SmartBanner data={data} />
      <HeroEnergy data={data} />
      <SmartEnergySection data={data} />
      <EnergyOfferSection data={data} />
      <ThirdPart data={data} />
      <EndSection />
    </div>
  );
}