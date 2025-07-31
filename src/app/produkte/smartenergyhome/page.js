import SmartBanner from "@/components/smartenergyhome/banner";
import HeroEnergy from "@/components/smartenergyhome/hero";
import SmartEnergySection from "@/components/smartenergyhome/smartenergy";
import ThirdPart from "@/components/smartenergyhome/third";
import EnergyOfferSection from "@/components/smartenergyhome/fourth";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import EndSection from "@/components/Reusable/end";


const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.smart_energy_home_page.api.get_smart_energy_page_with_keywords`;

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
      title: "Smart Energy Lösungen | Ökovolt Solartechnik",
      description:
        "Innovative Smart Energy Lösungen für intelligentes Energiemanagement in Ihrem Zuhause. Energieeffizienz, Nachhaltigkeit und Kosteneinsparung durch moderne Technologie.",
      keywords: [
        "Smart Energy",
        "Energiemanagement",
        "Energieeffizienz",
        "Intelligente Stromnutzung",
        "Nachhaltige Energie",
      ],
      openGraph: {
        title: "Smart Energy Lösungen | Ökovolt Solartechnik",
        description:
          "Innovative Smart Energy Lösungen für intelligentes Energiemanagement.",
        images: [{ url: "/images/smart-energy-og.jpg" }],
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Smart Energy",
        "Energiemanagement",
        "Energieeffizienz",
        "Intelligente Stromnutzung",
        "Nachhaltige Energie",
      ];

  return {
    title: seoData?.title || "Smart Energy Lösungen | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Innovative Smart Energy Lösungen für intelligentes Energiemanagement in Ihrem Zuhause. Energieeffizienz, Nachhaltigkeit und Kosteneinsparung durch moderne Technologie.",
    keywords: apiKeywords,
    
  };
}

export default async function SmartEnergyPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch smart energy data", error);
  }

  return (
    <div className="relative w-full">
      <SmartBanner data={data} />
      <HeroEnergy data={data} />
      <SmartEnergySection data={data} />
      <EnergyOfferSection data={data} />
      <ThirdPart data={data} />
      <EndSection />
    </div>
  );
}
