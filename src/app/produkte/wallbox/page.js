// produkte/wallbox/page.js

import WallboxBanner from "@/components/Wallbox/banner";
import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import WallboxFeatures2 from "@/components/Wallbox/third";
import WallboxSecondCard2 from "@/components/Wallbox/second";
import WallboxThirdCard from "@/components/Wallbox/fourth";
import EndSection from "@/components/Reusable/end";
import { hreflangLanguages } from "@/lib/hreflang";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.wallbox_page.api.get_wallbox_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/wallbox";

async function fetchWallboxData() {
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
  const seoData = await fetchWallboxData();

  const defaultKeywords = ["Wallbox", "Ladestation", "E-Auto laden", "Elektroauto Ladestation", "Wallbox Installation"];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Wallbox kaufen & Installation vom Profi | Ökovolt",
      description: "Wallbox Installation für Ihr Zuhause: E-Auto günstig mit eigenem Solarstrom laden – Beratung, Montage & smarte Steuerung aus einer Hand. Jetzt anfragen!",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",

        url: PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "Wallbox kaufen & Installation vom Profi | Ökovolt",
        description: "Wallbox Installation für Ihr Zuhause: E-Auto günstig mit eigenem Solarstrom laden – Beratung, Montage & smarte Steuerung aus einer Hand. Jetzt anfragen!",
        images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Wallbox" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Wallbox kaufen & Installation vom Profi | Ökovolt",
        description: "Wallbox Installation für Ihr Zuhause: E-Auto günstig mit eigenem Solarstrom laden – Beratung, Montage & smarte Steuerung aus einer Hand. Jetzt anfragen!",
        images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
      },
    };
  }

  const apiKeywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : defaultKeywords;
  const title = "Wallbox kaufen & Installation vom Profi | Ökovolt";
  const description = "Wallbox Installation für Ihr Zuhause: E-Auto günstig mit eigenem Solarstrom laden – Beratung, Montage & smarte Steuerung aus einer Hand. Jetzt anfragen!";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",

      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Wallbox" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
    },
  };
}

export default async function WallboxPage() {
  const data = await fetchWallboxData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Wallbox & Ladestationen | Ökovolt Deutschland",
    description: data?.description || "Hochwertige Wallboxen und Ladestationen für Elektrofahrzeuge. Schnelles und sicheres Laden mit intelligenten Ladelösungen für Zuhause und Gewerbe.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Produkte", item: "https://www.oekovolt.de/produkte" },
        { "@type": "ListItem", position: 3, name: "Wallbox", item: PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <WallboxBanner data={data} />
      <WallboxSecondCard2 data={data} />
      <WallboxFeatures2 data={data} />
      <WallboxThirdCard data={data} />
      <SolarrechnerTeaser
        href="/ratgeber/wallbox-installation"
        cta="Zum Ratgeber"
        titel="Wallbox installieren lassen"
        text="Kosten, Voraussetzungen und Ablauf – im Ratgeber Schritt für Schritt erklärt."
      />
      <Querverweise pfad="/produkte/wallbox" />
      <EndSection />
    </div>
  );
}