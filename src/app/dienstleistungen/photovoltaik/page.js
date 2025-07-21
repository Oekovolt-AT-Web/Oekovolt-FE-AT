import React from "react";
import Tabs from "@/components/Photovoltaik/Tabs";
import AnlageSection from "@/components/Photovoltaik/Anlage";
import KomponentenSlider from "@/components/Photovoltaik/Slider";
import ProcessSteps from "@/components/Photovoltaik/Cards";
import PhotovoltaikanlageBannerSection from "@/components/Photovoltaik/banner";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.photovoltaikanlagen_primary_page.api.get_photovoltaikanlagen`;

export async function generateMetadata() {
  // Fetch data for metadata
  let seoData = null;
  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    seoData = json.message;
  } catch (error) {
    console.error("Failed to fetch SEO data", error);
    // Fallback metadata if API fails
    return {
      title: "Photovoltaikanlagen | Ökovolt Solartechnik",
      description:
        "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft. Senken Sie Ihre Energiekosten mit nachhaltiger Solarenergie.",
      keywords: [
        "Photovoltaikanlage",
        "Solarenergie",
        "Energiekosten senken",
        "Photovoltaik Förderung",
        "Solaranlage",
      ],
      openGraph: {
        title: "Photovoltaikanlagen | Ökovolt Solartechnik",
        description:
          "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft.",
        images: [{ url: "/images/photovoltaik-og.jpg" }],
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Photovoltaikanlage",
        "Solarenergie",
        "Energiekosten senken",
        "Photovoltaik Förderung",
        "Solaranlage",
      ];

  return {
    title: seoData?.title || "Photovoltaikanlagen | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft. Senken Sie Ihre Energiekosten mit nachhaltiger Solarenergie.",
    keywords: apiKeywords,
  
  };
}

export default async function Home() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch photovoltaik data", error);
  }

  return (
    <div>
      <PhotovoltaikanlageBannerSection data={data} />
      <Tabs data={data} />
      <AnlageSection data={data} />
      <KomponentenSlider data={data} />
      <ProcessSteps data={data} />
      <EndSection />
    </div>
  );
}
