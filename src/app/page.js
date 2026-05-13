import { cache } from "react";
import dynamic from "next/dynamic";
import VideoBanner from "@/components/Home/banner";
import ServicesBanner from "@/components/Home/about";
import HomeLoader from "@/components/Home/HomeLoader";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";

const RotatingCircleSection = dynamic(
  () => import("@/components/Home/welcome"),
);
const SolutionsPage = dynamic(() => import("@/components/Home/info"));
const ProjectsSlider = dynamic(() => import("@/components/Home/projekte"));
const Partners = dynamic(() => import("@/components/Home/partners"));
const PVInquiryForm = dynamic(() => import("@/components/Home/form"));
const EndWhite = dynamic(() => import("@/components/Reusable/Endwhite"));

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.home_page.api.get_home_page`;

const getHomeData = cache(async () => {
  const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
  const json = await res.json();
  return json.message;
});

export async function generateMetadata() {
  // Fetch data for metadata
  let seoData = null;
  try {
    seoData = await getHomeData();
  } catch (error) {
    console.error("Failed to fetch SEO data", error);
    // Fallback metadata if API fails
    return {
      title: "Ökovolt Solartechnik - Photovoltaik Lösungen",
      alternates: { canonical: "https://www.oekovolt.de" },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de",
        title: "Ökovolt Solartechnik - Photovoltaik Lösungen",
        description:
          "Ihr Experte für Photovoltaik in Deutschland – seit über 15 Jahren.",
        images: [
          {
            url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp",
            width: 1200,
            height: 630,
            alt: "Ökovolt Deutschland",
          },
        ],
      },
      description:
        "Ihr Experte für Photovoltaik in Deutschland – seit über 15 Jahren.",
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
    description:
      seoData?.first_card_description ||
      "Ihr Experte für Photovoltaik in Deutschland – seit über 15 Jahren.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de",
      title: seoData?.title || "Ökovolt Solartechnik - Photovoltaik Lösungen",
      description:
        seoData?.first_card_description ||
        "Ihr Experte für Photovoltaik in Deutschland – seit über 15 Jahren.",
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

export default async function HomePage() {
  let data = null;

  try {
    data = await getHomeData();
  } catch (error) {
    console.error("Failed to fetch home page data", error);
  }

  const endd = {
    greentitle: "Solaranlage sichern",
    title: "Jetzt Kontakt aufnehmen & Solaranlage sichern",
    description:
      "Interessiert an einer maßgeschneiderten Photovoltaikanlage für Ihr Zuhause oder Unternehmen? Füllen Sie unser Kontaktformular aus oder rufen Sie uns direkt an! Unser Expertenteam berät Sie persönlich und individuell.",
  };

  return (
    <div>
      <HomeLoader />
      <VideoBanner
        mediaSrc={
          data?.image
            ? `${API_IMG_URL}${data.image}`
            : "/Images/Navbar/intro.mp4"
        }
        mediaAlt={
          data?.alt_text ||
          "Photovoltaik-Lösungen für Industrie, Gewerbe und Privat"
        }
        title={
          data?.title ||
          "Photovoltaik-Lösungen für Industrie, Gewerbe und Privat"
        }
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
