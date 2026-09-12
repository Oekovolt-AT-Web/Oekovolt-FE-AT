// dienstleistungen/smarthome/page.js
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import EndSection from "@/components/Reusable/end";
import TeamBanner from "@/components/Reusable/teamBanner";
import SmarthomeBannerSection from "@/components/Smarthome/banner";
import VorteileSection from "@/components/Smarthome/Smarthomeloesung";
import Tabs from "@/components/Smarthome/Tabs";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.smarthome_page.api.get_smarthome_page`;

async function fetchSmarthomeData() {
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
  const seoData = await fetchSmarthomeData();

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Smarthome-Lösungen: Speicher, Wallbox & Smartmeter | Ökovolt",
      alternates: { canonical: "https://www.oekovolt.de/dienstleistungen/smarthome", languages: hreflangLanguages("https://www.oekovolt.de/dienstleistungen/smarthome") },
      openGraph: {
        type: "website",

        url: "https://www.oekovolt.de/dienstleistungen/smarthome",
        siteName: "Ökovolt Deutschland",
        title: "Smart Home Lösungen | Ökovolt Deutschland",
        description: "Smarthome-Lösungen von Ökovolt: Stromspeicher, Wallbox, Notstrombox & Smartmeter – Solarstrom intelligent nutzen und Eigenverbrauch auf bis zu 80 % steigern.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Smart Home" }]
      },
      twitter: {
        card: "summary_large_image",
        title: "Smart Home Lösungen | Ökovolt Deutschland",
        description: "Smarthome-Lösungen von Ökovolt: Stromspeicher, Wallbox, Notstrombox & Smartmeter – Solarstrom intelligent nutzen und Eigenverbrauch auf bis zu 80 % steigern.",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
      },
      description: "Smarthome-Lösungen von Ökovolt: Stromspeicher, Wallbox, Notstrombox & Smartmeter – Solarstrom intelligent nutzen und Eigenverbrauch auf bis zu 80 % steigern.",
      keywords: [
        "Smarthome",
        "Smart Home",
        "Hausautomation",
        "Energieeffizienz",
        "Vernetztes Wohnen",
      ],
      robots: { index: true, follow: true },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
      "Smarthome",
      "Smart Home",
      "Hausautomation",
      "Energieeffizienz",
      "Vernetztes Wohnen",
    ];

  const title = "Smarthome-Lösungen: Speicher, Wallbox & Smartmeter | Ökovolt";
  const description = "Smarthome-Lösungen von Ökovolt: Stromspeicher, Wallbox, Notstrombox & Smartmeter – Solarstrom intelligent nutzen und Eigenverbrauch auf bis zu 80 % steigern.";
  const canonical = "https://www.oekovolt.de/dienstleistungen/smarthome";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical, languages: hreflangLanguages(canonical) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",

      url: canonical,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Smart Home" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
    },
  };
}

const SMARTHOME_PAGE_URL = "https://www.oekovolt.de/dienstleistungen/smarthome";

export default async function SmarthomePage() {
  const data = await fetchSmarthomeData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SMARTHOME_PAGE_URL}/#webpage`,
    url: SMARTHOME_PAGE_URL,
    name: data?.title || "Smart Home Lösungen | Ökovolt Deutschland",
    description: data?.description || "Intelligente Smart Home-Lösungen für mehr Komfort, Sicherheit und Energieeffizienz in Ihrem Zuhause. Vernetzte Technologie für modernes Wohnen.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Dienstleistungen", item: "https://www.oekovolt.de/dienstleistungen" },
        { "@type": "ListItem", position: 3, name: "Smart Home", item: SMARTHOME_PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <SmarthomeBannerSection data={data} />
      <Tabs data={data} />
      <VorteileSection data={data} />
      <Querverweise pfad="/dienstleistungen/smarthome" />
      <EndSection />
    </div>
  );
}