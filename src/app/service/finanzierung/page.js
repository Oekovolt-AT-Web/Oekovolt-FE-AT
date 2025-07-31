import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import BannerSection from "@/components/Finanzierung/banner";
import FinancingSection from "@/components/Finanzierung/second";
import FinancingBenefitsSection from "@/components/Finanzierung/third";
import FinanzierungPartnerSection from "@/components/Finanzierung/fourth";
import FinanzierungFAQ from "@/components/Finanzierung/fifth";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.finanzierung_service_page.api.get_finanzierung_page_with_keywords`;

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
      title: "Finanzierung & Förderungen | Ökovolt Solartechnik",
      description:
        "Attraktive Finanzierungsmöglichkeiten und Förderprogramme für Ihre Photovoltaikanlage. Finden Sie die passende Lösung für Ihre Solarinvestition.",
      keywords: [
        "Photovoltaik Finanzierung",
        "Solar Förderungen",
        "PV-Anlage Finanzierung",
        "KfW Förderung",
        "Solarfinanzierung",
      ],
     
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Photovoltaik Finanzierung",
        "Solar Förderungen",
        "PV-Anlage Finanzierung",
        "KfW Förderung",
        "Solarfinanzierung",
      ];

  return {
    title:
      seoData?.title || "Finanzierung & Förderungen | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Attraktive Finanzierungsmöglichkeiten und Förderprogramme für Ihre Photovoltaikanlage. Finden Sie die passende Lösung für Ihre Solarinvestition.",
    keywords: apiKeywords,
   
  };
}

export default async function FinanzierungPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch finanzierung data", error);
  }

  return (
    <div>
      <BannerSection data={data} />
      <FinancingSection data={data} />
      <FinancingBenefitsSection data={data} />
      <FinanzierungPartnerSection data={data} />
      <FinanzierungFAQ data={data} />
      <EndSection />
    </div>
  );
}
