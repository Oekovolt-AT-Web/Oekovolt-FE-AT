import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import BannerSection from "@/components/Finanzierung/banner";
import FinancingSection from "@/components/Finanzierung/second";
import FinancingBenefitsSection from "@/components/Finanzierung/third";
import FinanzierungPartnerSection from "@/components/Finanzierung/fourth";
import FinanzierungFAQ from "@/components/Finanzierung/fifth";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.finanzierung_service_page.api.get_finanzierung_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/service/finanzierung";

export async function generateMetadata() {
  let seoData = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    const json = await res.json();
    seoData = json.message;
  } catch {
    return {
      title: "Photovoltaik Finanzierung & Förderungen | Ökovolt",
      description: "Attraktive Finanzierungsmöglichkeiten und Förderprogramme für Ihre Photovoltaikanlage. Finden Sie die passende Lösung für Ihre Solarinvestition.",
      keywords: ["Photovoltaik Finanzierung", "Solar Förderungen", "PV-Anlage Finanzierung", "KfW Förderung", "Solarfinanzierung"],
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
        title: "Photovoltaik Finanzierung & Förderungen | Ökovolt",
        description: "Attraktive Finanzierungsmöglichkeiten und Förderprogramme für Ihre Photovoltaikanlage.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Finanzierung" }],
      },
      twitter: { card: "summary_large_image", title: "Photovoltaik Finanzierung & Förderungen | Ökovolt", description: "Attraktive Finanzierungsmöglichkeiten für Photovoltaik.", images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
    };
  }

  const apiKeywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : ["Photovoltaik Finanzierung", "Solar Förderungen", "PV-Anlage Finanzierung", "KfW Förderung", "Solarfinanzierung"];
  const title = seoData?.title || "Photovoltaik Finanzierung & Förderungen | Ökovolt";
  const description = seoData?.description || "Attraktive Finanzierungsmöglichkeiten und Förderprogramme für Ihre Photovoltaikanlage. Finden Sie die passende Lösung für Ihre Solarinvestition.";

  return {
    title, description, keywords: apiKeywords,
    alternates: { canonical: PAGE_URL },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Finanzierung" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
  };
}

export default async function FinanzierungPage() {
  let data = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 60 } });
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