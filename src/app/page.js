import ServicesBanner from "@/components/Home/about";
import VideoBanner from "@/components/Home/banner";
import PVInquiryForm from "@/components/Home/form";
import SolutionsPage from "@/components/Home/info";
import Partners from "@/components/Home/partners";
import ProjectsSlider from "@/components/Home/projekte";
import RotatingCircleSection from "@/components/Home/welcome";
import EndWhite from "@/components/Reusable/Endwhite";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.home_page.api.get_home_page`;

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
      title: "Ökovolt Solartechnik - Photovoltaik Lösungen",
      description: "Ihr Experte für Photovoltaik in Deutschland – seit über 15 Jahren.",
      keywords: ["Photovoltaik", "Solaranlagen", "Energielösungen"],
      // openGraph: {
      //   title: "Ökovolt Solartechnik",
      //   description: "Ihr Experte für Photovoltaik in Deutschland – seit über 15 Jahren.",
      //   images: [{ url: "/images/og-image.jpg" }],
      // },
    };
  }

  // Process keywords from API
  const apiKeywords = seoData?.keywords 
    ? seoData.keywords.split(/,\s*/) 
    : ["Photovoltaik", "Solaranlagen", "Energielösungen"];

  return {
    title: seoData?.title || "Ökovolt Solartechnik - Photovoltaik Lösungen",
    description: seoData?.first_card_description || "Ihr Experte für Photovoltaik in Deutschland – seit über 15 Jahren.",
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
    console.error("Failed to fetch smart energy data", error);
  }

  const endd = {
    greentitle: "Solaranlage sichern",
    title: "Jetzt Kontakt aufnehmen & Solaranlage sichern",
    description:
      "Interessiert an einer maßgeschneiderten Photovoltaikanlage für Ihr Zuhause oder Unternehmen? Füllen Sie unser Kontaktformular aus oder rufen Sie uns direkt an! Unser Expertenteam berät Sie persönlich und individuell.",
  };

  return (
    <div>
      <VideoBanner
        videoSrc={"/Images/Navbar/intro.mp4"}
        title={data?.title || "Photovoltaik-Lösungen für Industrie, Gewerbe und Privat"}
        mobileVideoSrc={"/Images/Navbar/intro.mp4"}
      />
      <ServicesBanner data={data} />
      <RotatingCircleSection data={data} />
      <SolutionsPage data={data} />
      <ProjectsSlider data={data} />
      <Partners data={data} />
      <PVInquiryForm data={data} />
      <EndWhite data={endd} />
    </div>
  );
}