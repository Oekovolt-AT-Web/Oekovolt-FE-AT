import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import EndSection from "@/components/Reusable/end";
import BannerSection from "@/components/Direktvermaktung/banner";
import HeroEnergy from "@/components/Direktvermaktung/second";
import SecondCardSection from "@/components/Direktvermaktung/third";
import ThirdCardSection from "@/components/Direktvermaktung/fourth";
import FifthCardSection from "@/components/Direktvermaktung/fifth";
import SixCardSection from "@/components/Direktvermaktung/six";
import DirektvermaktungFAQ from "@/components/Direktvermaktung/eight";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.direktvermarktung_service_page.api.get_photovoltaik_repowering_page_with_keywords`;

export async function generateMetadata() {
  // Fetch data for metadata
  let seoData = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    const json = await res.json();
    seoData = json.message;
  } catch (error) {
    console.error("Failed to fetch SEO data", error);
    // Fallback metadata if API fails
    return {
      title: "Direktvermarktung von Solarstrom | Ökovolt Solartechnik",
      description:
        "Professionelle Direktvermarktung Ihres Solarstroms. Maximieren Sie Ihre Erträge durch optimale Vermarktung Ihrer PV-Überschüsse.",
      keywords: [
        "Solarstrom Direktvermarktung",
        "Stromvermarktung PV-Anlage",
        "EEG-Vergütung",
        "Energie Direktvermarktung",
        "Solarstrom verkaufen",
      ],
      // openGraph: {
      //   title: "Direktvermarktung von Solarstrom | Ökovolt Solartechnik",
      //   description: "Professionelle Direktvermarktung Ihres Solarstroms.",
      //   images: [{ url: "/images/direktvermarktung-og.jpg" }],
      // },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Solarstrom Direktvermarktung",
        "Stromvermarktung PV-Anlage",
        "EEG-Vergütung",
        "Energie Direktvermarktung",
        "Solarstrom verkaufen",
      ];

  return {
    title:
      seoData?.title ||
      "Direktvermarktung von Solarstrom | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Professionelle Direktvermarktung Ihres Solarstroms. Maximieren Sie Ihre Erträge durch optimale Vermarktung Ihrer PV-Überschüsse.",
    keywords: apiKeywords,
  };
}

export default async function DirektvermarktungPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 60 } });
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch direktvermarktung data", error);
  }

  return (
    <div>
      <BannerSection data={data} />
      <HeroEnergy data={data} />
      <SecondCardSection data={data} />
      <ThirdCardSection data={data} />
      <FifthCardSection data={data} />
      <SixCardSection data={data} />
      <DirektvermaktungFAQ data={data} />
      <EndSection />
    </div>
  );
}
