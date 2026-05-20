// photovoltaikanlage/page.js
import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import SolvixBanner from "@/components/photovoltaikanlage/bannertwo";
import FeaturedLogos from "@/components/photovoltaikanlage/partners";
import PhotovoltaikIntroSection from "@/components/photovoltaikanlage/firstcard";
import PhotovoltaikStepsSection from "@/components/photovoltaikanlage/steps";
import PhotovoltaikRegionalNetzSection from "@/components/photovoltaikanlage/fourthcard";
import PhotovoltaikOverviewSection from "@/components/photovoltaikanlage/fifthcard";
import PhotovoltaikSixthCardSection from "@/components/photovoltaikanlage/sixthcard";
import PhotovoltaikComponentSection from "@/components/photovoltaikanlage/seventhcard";
import FaqSection from "@/components/photovoltaikanlage/eightcard";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.photovoltaikanlage_page.api.get_photovoltaik_page_with_keywords`;

async function fetchPhotovoltaikData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 3600 }
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
  const seoData = await fetchPhotovoltaikData();

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Photovoltaikanlagen kaufen | Ökovolt Deutschland",
      description: "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe. Senken Sie Ihre Energiekosten und werden Sie unabhängig mit maßgeschneiderten Solar-Lösungen.",
      keywords: ["Photovoltaikanlage", "Solaranlage", "Photovoltaik", "Solarenergie", "PV-Anlage"],
      alternates: { canonical: "https://www.oekovolt.de/produkte/photovoltaikanlage" },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        locale: "de_DE",
        url: "https://www.oekovolt.de/produkte/photovoltaikanlage",
        siteName: "Ökovolt Deutschland",
        title: "Photovoltaikanlagen kaufen | Ökovolt Deutschland",
        description: "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe.",
        images: [{
          url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp",
          width: 1200,
          height: 630,
          alt: "Ökovolt Photovoltaikanlagen",
        }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Photovoltaikanlagen kaufen | Ökovolt Deutschland",
        description: "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe.",
        images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
      },
    };
  }

  const title = seoData?.photovoltaik_title || "Photovoltaikanlagen kaufen | Ökovolt Deutschland";
  const description = seoData?.photovoltaik_description || "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe.";
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : ["Photovoltaikanlage", "Solaranlage", "Photovoltaik", "Solarenergie", "PV-Anlage"];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: "https://www.oekovolt.de/produkte/photovoltaikanlage" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: "https://www.oekovolt.de/produkte/photovoltaikanlage",
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{
        url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp",
        width: 1200,
        height: 630,
        alt: "Ökovolt Photovoltaikanlagen",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
    },
  };
}

const PAGE_URL = "https://www.oekovolt.de/produkte/photovoltaikanlage";

export default async function PhotovoltaikanlagePage() {
  const data = await fetchPhotovoltaikData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.photovoltaik_title || "Photovoltaikanlagen kaufen | Ökovolt Deutschland",
    description: data?.photovoltaik_description || "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Produkte", item: "https://www.oekovolt.de/produkte" },
        { "@type": "ListItem", position: 3, name: "Photovoltaikanlage", item: PAGE_URL },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was kostet eine Photovoltaikanlage?",
        acceptedAnswer: { "@type": "Answer", text: "Die Kosten einer Photovoltaikanlage hängen von der Größe und dem gewählten System ab. Eine typische Anlage für Privathaushalte kostet zwischen 8.000 und 20.000 Euro. Kontaktieren Sie uns für ein individuelles Angebot." },
      },
      {
        "@type": "Question",
        name: "Wie lange dauert die Installation einer Photovoltaikanlage?",
        acceptedAnswer: { "@type": "Answer", text: "Die Installation einer Photovoltaikanlage dauert in der Regel 1–3 Tage, abhängig von der Anlagengröße und den Gegebenheiten vor Ort." },
      },
      {
        "@type": "Question",
        name: "Welche Förderungen gibt es für Photovoltaikanlagen?",
        acceptedAnswer: { "@type": "Answer", text: "In Deutschland gibt es verschiedene Förderungen: KfW-Kredite, Einspeisevergütung nach EEG sowie regionale Landesförderungen. Unser Team berät Sie gerne zu den aktuell verfügbaren Fördermöglichkeiten." },
      },
      {
        "@type": "Question",
        name: "Wie lange hält eine Photovoltaikanlage?",
        acceptedAnswer: { "@type": "Answer", text: "Moderne Photovoltaikanlagen sind auf eine Lebensdauer von 25–30 Jahren ausgelegt. Die meisten Hersteller geben eine Leistungsgarantie von 25 Jahren." },
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SolvixBanner data={data} />
      <FeaturedLogos data={data} />
      <PhotovoltaikIntroSection data={data} />
      <PhotovoltaikStepsSection data={data} />
      <PhotovoltaikRegionalNetzSection data={data} />
      <PhotovoltaikOverviewSection data={data} />
      <PhotovoltaikSixthCardSection data={data} />
      <PhotovoltaikComponentSection data={data} />
      <FaqSection data={data} />
    </div>
  );
}