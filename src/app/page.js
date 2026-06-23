// src/app/page.js (Home page)

import { cache } from "react";
import dynamic from "next/dynamic";
import VideoBanner from "@/components/Home/banner";
import ServicesBanner from "@/components/Home/about";
import HomeLoader from "@/components/Home/HomeLoader";

import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";

const RotatingCircleSection = dynamic(() => import("@/components/Home/welcome"));
const SolutionsPage = dynamic(() => import("@/components/Home/info"));
const ProjectsSlider = dynamic(() => import("@/components/Home/projekte"));
const Partners = dynamic(() => import("@/components/Home/partners"));
const PVInquiryForm = dynamic(() => import("@/components/Home/form"));
const EndWhite = dynamic(() => import("@/components/Reusable/Endwhite"));

const BASE_URL = "https://www.oekovolt.de";
const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.home_page.api.get_home_page`;

const getHomeData = cache(async () => {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const res = await fetch(DATA_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!res.ok) {
      let errorText = "";
      try {
        const errorData = await res.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await res.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${res.status}: ${errorText}`);
      return null;
    }

    const json = await res.json();
    return json.message;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
});

const FALLBACK_META = {
  title: "Photovoltaik Lösungen für Deutschland | Ökovolt",
  description: "Effiziente Photovoltaiklösungen mit Stromspeicher und smarter Überwachung für Unternehmen und Privatkunden. Jetzt beraten lassen.",
};

export async function generateMetadata() {
  const seoData = await getHomeData();

  const defaultKeywords = ["Photovoltaik kaufen", "Solaranlage Deutschland", "Photovoltaikanlage", "Stromspeicher", "Wärmepumpe", "Wallbox", "Ökovolt", "Solarenergie", "KfW Förderung Photovoltaik", "PV Anlage Kosten"];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: FALLBACK_META.title,
      description: FALLBACK_META.description,
      keywords: defaultKeywords,
      alternates: { canonical: BASE_URL, languages: { "de-DE": BASE_URL } },
      robots: {
        index: true, follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
      },
      openGraph: {
        type: "website", locale: "de_DE", url: BASE_URL, siteName: "Ökovolt Deutschland",
        title: FALLBACK_META.title, description: FALLBACK_META.description,
        images: [{ url: `${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`, width: 1200, height: 630, alt: "Ökovolt Deutschland – Photovoltaik & Solaranlagen", type: "image/webp" }],
      },
      twitter: {
        card: "summary_large_image", site: "@oekovolt", creator: "@oekovolt",
        title: FALLBACK_META.title, description: FALLBACK_META.description,
        images: [`${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`],
      },
    };
  }

  const title = "Photovoltaik-Lösungen | Ökovolt Deutschland";
  const description = seoData?.first_card_description || FALLBACK_META.description;
  const apiKeywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : defaultKeywords;

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: BASE_URL, languages: { "de-DE": BASE_URL } },
    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      type: "website", locale: "de_DE", url: BASE_URL, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: `${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`, width: 1200, height: 630, alt: "Ökovolt Deutschland – Photovoltaik & Solaranlagen", type: "image/webp" }],
    },
    twitter: {
      card: "summary_large_image", site: "@oekovolt", creator: "@oekovolt",
      title, description,
      images: [`${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`],
    },
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  const title = "Photovoltaik-Lösungen | Ökovolt Deutschland";
  const description = data?.first_card_description || FALLBACK_META.description;

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: title,
    description,
    inLanguage: "de-DE",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    datePublished: "2008-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const serviceListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Unsere Leistungen – Ökovolt Deutschland",
    url: BASE_URL,
    numberOfItems: 7,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Photovoltaikanlage", url: `${BASE_URL}/produkte/photovoltaikanlage` },
      { "@type": "ListItem", position: 2, name: "Stromspeicher", url: `${BASE_URL}/produkte/stromspeicher` },
      { "@type": "ListItem", position: 3, name: "Wärmepumpe", url: `${BASE_URL}/produkte/warmepumpe` },
      { "@type": "ListItem", position: 4, name: "Wallbox", url: `${BASE_URL}/produkte/wallbox` },
      { "@type": "ListItem", position: 5, name: "Smart Home", url: `${BASE_URL}/dienstleistungen/smarthome` },
      { "@type": "ListItem", position: 6, name: "Direktvermarktung", url: `${BASE_URL}/service/direktvermaktung` },
      { "@type": "ListItem", position: 7, name: "Photovoltaik Repowering", url: `${BASE_URL}/service/repowering` },
    ],
  };

  const endd = {
    greentitle: "Solaranlage sichern",
    title: "Jetzt Kontakt aufnehmen & Solaranlage sichern",
    description:
      "Interessiert an einer maßgeschneiderten Photovoltaikanlage für Ihr Zuhause oder Unternehmen? Füllen Sie unser Kontaktformular aus oder rufen Sie uns direkt an! Unser Expertenteam berät Sie persönlich und individuell.",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceListSchema) }} />
      <HomeLoader />
      <VideoBanner
        mediaSrc={data?.image ? `/api/image?path=${data.image}` : "/Images/Kontakt/download-2.jpg"}
        mediaAlt={data?.alt_text || "Photovoltaik-Lösungen für Industrie, Gewerbe und Privat"}
        title={data?.title || "Photovoltaik-Lösungen für Industrie, Gewerbe und Privat"}
      />
      <ServicesBanner data={data} />
      <div className="content-section-lazy"><RotatingCircleSection data={data} /></div>
      <div className="content-section-lazy"><SolutionsPage data={data} /></div>
      <div className="content-section-lazy"><ProjectsSlider data={data} /></div>
      <div className="content-section-lazy"><Partners data={data} /></div>
      <div className="content-section-lazy"><PVInquiryForm data={data} /></div>
      <div className="content-section-lazy"><EndWhite data={endd} /></div>
    </div>
  );
}