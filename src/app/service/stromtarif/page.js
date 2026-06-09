// service/stromtarif/page.js

import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import BannerSection from "@/components/Stromtarif/banner";
import DynamicGreenEnergy from "@/components/Stromtarif/second";
import DynamicInfoSection from "@/components/Stromtarif/third";
import FlexiblePowerSection from "@/components/Stromtarif/fourth";
import DynamicSteps from "@/components/Stromtarif/fifth";
import FlexibleBenefitsSection from "@/components/Stromtarif/sixth";
import RequirementsSection from "@/components/Stromtarif/seventh";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.dynamischer_stromtarif_service_page.api.get_dynamischer_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/service/stromtarif";

async function fetchStromtarifData() {
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
  const seoData = await fetchStromtarifData();

  const defaultKeywords = [
    "Dynamischer Stromtarif",
    "Flexibler Strompreis",
    "Stromtarif für PV-Anlagen",
    "Intelligenter Stromtarif",
    "Energiekosten optimieren",
  ];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Dynamischer Stromtarif für PV-Anlagen ",
      description: "Flexible Stromtarife für Photovoltaik-Besitzer. Nutzen Sie dynamische Strompreise und optimieren Sie Ihre Energiekosten mit intelligenten Tarifen.",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        locale: "de_DE",
        url: PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "Dynamischer Stromtarif für PV-Anlagen ",
        description: "Flexible Stromtarife für Photovoltaik-Besitzer.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Stromtarif" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Dynamischer Stromtarif für PV-Anlagen ",
        description: "Flexible Stromtarife für Photovoltaik-Besitzer.",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : defaultKeywords;

  const title = seoData?.dynami_title || "Dynamischer Stromtarif für PV-Anlagen ";
  const description = seoData?.dynami_description || "Flexible Stromtarife für Photovoltaik-Besitzer. Nutzen Sie dynamische Strompreise und optimieren Sie Ihre Energiekosten mit intelligenten Tarifen.";
  const canonical = PAGE_URL;

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: canonical,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Dynamischer Stromtarif" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
    },
  };
}

export default async function StromtarifPage() {
  const data = await fetchStromtarifData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Dynamischer Stromtarif für PV-Anlagen ",
    description: data?.description || "Flexible Stromtarife für Photovoltaik-Besitzer. Nutzen Sie dynamische Strompreise und optimieren Sie Ihre Energiekosten mit intelligenten Tarifen.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Service", item: "https://www.oekovolt.de/service" },
        { "@type": "ListItem", position: 3, name: "Stromtarif", item: PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <BannerSection data={data} />
      <FlexiblePowerSection data={data} />
      <DynamicInfoSection data={data} />
      <DynamicGreenEnergy data={data} />
      <DynamicSteps data={data} />
      <FlexibleBenefitsSection data={data} />
      <RequirementsSection data={data} />
      <EndSection />
    </div>
  );
}