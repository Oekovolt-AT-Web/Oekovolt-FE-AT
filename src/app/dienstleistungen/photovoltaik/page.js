// dienstleistungen/photovoltaik/page.js
import React from "react";
import Tabs from "@/components/Photovoltaik/Tabs";
import AnlageSection from "@/components/Photovoltaik/Anlage";
import KomponentenSlider from "@/components/Photovoltaik/Slider";
import ProcessSteps from "@/components/Photovoltaik/Cards";
import PhotovoltaikanlageBannerSection from "@/components/Photovoltaik/banner";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import EndSection from "@/components/Reusable/end";
import { hreflangLanguages } from "@/lib/hreflang";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import Sektion from "@/components/Reusable/Sektion";
import Region from "@/components/Photovoltaik/Region";
import FaqBereich from "@/components/Photovoltaik/FaqBereich";
import { PV_FAQ } from "@/data/photovoltaik-seite";
import MobileCta from "@/components/Reusable/MobileCta";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.photovoltaikanlagen_primary_page.api.get_photovoltaikanlagen`;

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
      next: { revalidate: 600 }
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
  // Fetch data for metadata
  let seoData = await fetchPhotovoltaikData();

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "PV-Anlage kaufen im Allgäu – Komplettpaket | Ökovolt",
      description:
        "PV-Anlage für Ihr Zuhause: Planung, Lieferung & Montage aus einer Hand – Ihr Komplettpaket vom erfahrenen Installateur. Jetzt kostenloses Angebot anfordern!",
      keywords: ["Photovoltaikanlage", "Solarenergie", "Energiekosten senken", "Photovoltaik Förderung", "Solaranlage"],
      alternates: { canonical: "https://www.oekovolt.de/dienstleistungen/photovoltaik", languages: hreflangLanguages("https://www.oekovolt.de/dienstleistungen/photovoltaik") },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        locale: "de_DE",
        url: "https://www.oekovolt.de/dienstleistungen/photovoltaik",
        siteName: "Ökovolt Deutschland",
        title: "Photovoltaik Dienstleistungen | Ökovolt Deutschland",
        description: "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft.",
        images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Photovoltaik" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Photovoltaik Dienstleistungen | Ökovolt Deutschland",
        description: "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft.",
        images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
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

  const title = "PV-Anlage kaufen im Allgäu – Komplettpaket | Ökovolt";
  const description = "PV-Anlage für Ihr Zuhause: Planung, Lieferung & Montage aus einer Hand – Ihr Komplettpaket vom erfahrenen Installateur. Jetzt kostenloses Angebot anfordern!";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: "https://www.oekovolt.de/dienstleistungen/photovoltaik", languages: hreflangLanguages("https://www.oekovolt.de/dienstleistungen/photovoltaik") },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: "https://www.oekovolt.de/dienstleistungen/photovoltaik",
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Photovoltaik" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
    },
  };
}

const PV_PAGE_URL = "https://www.oekovolt.de/dienstleistungen/photovoltaik";

export default async function PhotovoltaikPage() {
  let data = await fetchPhotovoltaikData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PV_PAGE_URL}/#webpage`,
    url: PV_PAGE_URL,
    name: data?.title || "Photovoltaik Dienstleistungen | Ökovolt Deutschland",
    description: data?.description || "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Dienstleistungen", item: "https://www.oekovolt.de/dienstleistungen/photovoltaik" },
        { "@type": "ListItem", position: 3, name: "Photovoltaik", item: PV_PAGE_URL },
      ],
    },
  };


  // Muss 1:1 dem sichtbaren FAQ-Block entsprechen (Google-Richtlinie).
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PV_FAQ.map((f) => ({
      "@type": "Question",
      name: f.frage,
      acceptedAnswer: { "@type": "Answer", text: f.antwort },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PhotovoltaikanlageBannerSection data={data} />

      {/* Abwechselnde Flächen gliedern die Seite; vorher lagen die Blöcke
          ohne erkennbare Zäsur untereinander. */}
      <Sektion ton="hell"><Tabs data={data} /></Sektion>
      <Sektion ton="getoent"><AnlageSection data={data} /></Sektion>
      <Sektion ton="hell"><Region /></Sektion>
      <Sektion ton="getoent"><KomponentenSlider data={data} /></Sektion>
      <Sektion ton="hell"><ProcessSteps data={data} /></Sektion>
      <Sektion ton="getoent">
        <SolarrechnerTeaser
          titel="Erst rechnen, dann beraten lassen"
          text="Verschaffen Sie sich in einer Minute Klarheit über Ertrag, Ersparnis und Amortisation für Ihr Dach."
        />
      </Sektion>
      <Sektion ton="hell"><FaqBereich /></Sektion>
      <Querverweise pfad="/dienstleistungen/photovoltaik" />
      <EndSection />
      <MobileCta />
    </div>
  );
}