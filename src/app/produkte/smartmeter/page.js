// produkte/smartmeter/page.js

import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import SmartmeterBanner from "@/components/Smartmeter/banner";
import SmartMeterCardSection from "@/components/Smartmeter/second";
import Smartmeter from "@/components/Smartmeter/third";
import Smartmetersectionfour from "@/components/Smartmeter/fourth";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import SmartMeterCostSection from "@/components/Smartmeter/fifth";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.smart_meter_page.api.get_smart_meter_page_with_keywords`;

async function fetchSmartMeterData() {
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
  const seoData = await fetchSmartMeterData();

  const defaultKeywords = [
    "Smart Meter",
    "Digitaler Zähler",
    "Energiemanagement",
    "Stromzähler",
    "Intelligente Messsysteme",
  ];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Smart Meter & Zähler | Ökovolt Deutschland",
      description: "Moderne Smart Meter für intelligentes Energiemanagement. Optimieren Sie Ihren Energieverbrauch mit digitalen Zählern und Echtzeit-Monitoring.",
      keywords: defaultKeywords,
      alternates: {
        canonical: "https://www.oekovolt.de/produkte/smartmeter",
      },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de/produkte/smartmeter",
        title: "Smart Meter & Zähler | Ökovolt Deutschland",
        description: "Moderne Smart Meter für intelligentes Energiemanagement.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Smart Meter & Zähler | Ökovolt Deutschland",
        description: "Moderne Smart Meter für intelligentes Energiemanagement.",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : defaultKeywords;

  const title = seoData?.title || "Smart Meter & Zähler | Ökovolt Deutschland";
  const description = seoData?.description || "Moderne Smart Meter für intelligentes Energiemanagement. Optimieren Sie Ihren Energieverbrauch mit digitalen Zählern und Echtzeit-Monitoring.";
  const canonical = "https://www.oekovolt.de/produkte/smartmeter";

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

const SMARTMETER_PAGE_URL = "https://www.oekovolt.de/produkte/smartmeter";

export default async function SmartmeterPage() {
  const data = await fetchSmartMeterData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SMARTMETER_PAGE_URL}/#webpage`,
    url: SMARTMETER_PAGE_URL,
    name: data?.title || "Smart Meter & Zähler | Ökovolt Deutschland",
    description: data?.description || "Moderne Smart Meter für intelligentes Energiemanagement. Optimieren Sie Ihren Energieverbrauch mit digitalen Zählern und Echtzeit-Monitoring.",
    
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Produkte", item: "https://www.oekovolt.de/produkte" },
        { "@type": "ListItem", position: 3, name: "Smart Meter", item: SMARTMETER_PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <SmartmeterBanner data={data} />
      <SmartMeterCardSection data={data} />
      <Smartmeter data={data} />
      <Smartmetersectionfour data={data} />
      <SmartMeterCostSection data={data} />
      <EndSection />
    </div>
  );
}