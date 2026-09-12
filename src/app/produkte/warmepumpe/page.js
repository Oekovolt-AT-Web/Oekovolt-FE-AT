// produkte/warmepumpe/page.js

import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import WarmepumpeBanner from "../../../components/Warmepumpe/banner";
import WarmepumpeVorteileSection from "@/components/Warmepumpe/second";
import WarmepumpeSecondCardSection from "@/components/Warmepumpe/third";
import WarmepumpeManufacturerSection from "@/components/Warmepumpe/fourth";
import KontaktFormular from "@/components/Warmepumpe/fifth";
import WarmepumpeFinancingSection from "@/components/Warmepumpe/six";
import WaermepumpePartnerSection from "@/components/Warmepumpe/seven";
import WarmeBanner from "@/components/Warmepumpe/bannertwo";
import EndSection from "@/components/Reusable/end";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.waermepumpe_page.api.get_waermepumpe_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/warmepumpe";

async function fetchWaermepumpeData() {
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
  const seoData = await fetchWaermepumpeData();

  const defaultKeywords = ["Wärmepumpe", "Heizung", "Wärmepumpenheizung", "Umweltfreundliche Heizung", "Energieeffiziente Heizung"];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Solaranlage mit Wärmepumpe – heizen mit Sonnenstrom | Ökovolt",
      description: "Wärmepumpe mit Photovoltaik kombinieren: Heizkosten senken, unabhängig von Öl und Gas – Beratung, Installation & Förderservice vom Profi. Jetzt anfragen!",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",

        url: PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "Solaranlage mit Wärmepumpe – heizen mit Sonnenstrom | Ökovolt",
        description: "Wärmepumpe mit Photovoltaik kombinieren: Heizkosten senken, unabhängig von Öl und Gas – Beratung, Installation & Förderservice vom Profi. Jetzt anfragen!",
        images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Wärmepumpe" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Solaranlage mit Wärmepumpe – heizen mit Sonnenstrom | Ökovolt",
        description: "Wärmepumpe mit Photovoltaik kombinieren: Heizkosten senken, unabhängig von Öl und Gas – Beratung, Installation & Förderservice vom Profi. Jetzt anfragen!",
        images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
      },
    };
  }

  const apiKeywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : defaultKeywords;
  const title = "Solaranlage mit Wärmepumpe – heizen mit Sonnenstrom | Ökovolt";
  const description = "Wärmepumpe mit Photovoltaik kombinieren: Heizkosten senken, unabhängig von Öl und Gas – Beratung, Installation & Förderservice vom Profi. Jetzt anfragen!";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",

      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Wärmepumpe" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
    },
  };
}

export default async function WarmepumpePage() {
  const data = await fetchWaermepumpeData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Wärmepumpe kaufen | Ökovolt Deutschland",
    description: data?.description || "Effiziente Wärmepumpen für umweltfreundliche Heizlösungen. Senken Sie Ihre Heizkosten und CO₂-Emissionen mit moderner Wärmepumpentechnologie.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Produkte", item: "https://www.oekovolt.de/produkte" },
        { "@type": "ListItem", position: 3, name: "Wärmepumpe", item: PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <WarmeBanner data={data} />
      <WarmepumpeSecondCardSection data={data} />
      <WarmepumpeVorteileSection data={data} />
      <WarmepumpeManufacturerSection data={data} />
      <KontaktFormular />
      <WarmepumpeFinancingSection data={data} />
      <WaermepumpePartnerSection data={data} />
      <Querverweise pfad="/produkte/warmepumpe" />
      <EndSection />
    </div>
  );
}