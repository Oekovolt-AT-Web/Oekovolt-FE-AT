import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
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
      title: "Dynamischer Stromtarif ",
      alternates: { canonical: "https://www.oekovolt.de/service/stromtarif" },
      openGraph: { type: "website", url: "https://www.oekovolt.de/service/stromtarif", title: "Dynamischer Stromtarif ", description: "Flexible Stromtarife für Photovoltaik-Besitzer.", images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }] },
      description:
        "Flexible Stromtarife für Photovoltaik-Besitzer. Nutzen Sie dynamische Strompreise und optimieren Sie Ihre Energiekosten mit intelligenten Tarifen.",
      keywords: [
        "Dynamischer Stromtarif",
        "Flexibler Strompreis",
        "Stromtarif für PV-Anlagen",
        "Intelligenter Stromtarif",
        "Energiekosten optimieren",
      ],
    
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Dynamischer Stromtarif",
        "Flexibler Strompreis",
        "Stromtarif für PV-Anlagen",
        "Intelligenter Stromtarif",
        "Energiekosten optimieren",
      ];

  return {
    title: seoData?.title || "Dynamischer Stromtarif ",
    description:
      seoData?.description ||
      "Flexible Stromtarife für Photovoltaik-Besitzer. Nutzen Sie dynamische Strompreise und optimieren Sie Ihre Energiekosten mit intelligenten Tarifen.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/service/stromtarif",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/service/stromtarif",
      title: seoData?.title || "Dynamischer Stromtarif ",
      description:
        seoData?.description ||
        "Flexible Stromtarife für Photovoltaik-Besitzer. Nutzen Sie dynamische Strompreise und optimieren Sie Ihre Energiekosten mit intelligenten Tarifen.",
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

export default async function StromtarifPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch stromtarif data", error);
  }

  return (
    <div>
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
