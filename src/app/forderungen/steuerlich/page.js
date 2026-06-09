// src/app/forderungen/steuerlich/page.js

import SteuerlichBannerSection from "@/components/Forderungen/Steuerlich/banner";
import TaxTreatmentPV from "@/components/Forderungen/Steuerlich/second";
import EndSection from "@/components/Reusable/end";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import React from "react";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.steuerlich.api.get_steuerlich_data`;

async function fetchSteuerlichData() {
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
    return data;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

export async function generateMetadata() {
  const data = await fetchSteuerlichData();
  const bannerData = data?.message?.banner;

  if (!data) {
    // Fallback metadata if API fails
    return {
      title: "Steuerliche Förderungen für Photovoltaik | Ökovolt Deutschland",
      description: "Aktuelle steuerrechtliche Bestimmungen für Photovoltaikanlagen in Deutschland – Einkommensteuer, Umsatzsteuer und steuerliche Vorteile für private und gewerbliche Betreiber.",
      keywords: [
        "Photovoltaik Steuer",
        "Solaranlage Steuervorteile",
        "Einkommensteuer Photovoltaik",
        "Umsatzsteuer PV-Anlage",
        "Steuerliche Förderung Solar",
      ],
      alternates: {
        canonical: "https://www.oekovolt.de/forderungen/steuerlich",
      },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de/forderungen/steuerlich",
        title: "Steuerliche Förderungen für Photovoltaik | Ökovolt Deutschland",
        description: "Aktuelle steuerrechtliche Bestimmungen für Photovoltaikanlagen in Deutschland.",
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

  const title = bannerData?.title || "Steuerliche Förderungen für Photovoltaik | Ökovolt Deutschland";
  const description = bannerData?.description ||
    "Aktuelle steuerrechtliche Bestimmungen für Photovoltaikanlagen in Deutschland – Einkommensteuer, Umsatzsteuer und steuerliche Vorteile für private und gewerbliche Betreiber.";

  return {
    title: title,
    description: description,
    keywords: [
      "Photovoltaik Steuer",
      "Solaranlage Steuervorteile",
      "Einkommensteuer Photovoltaik",
      "Umsatzsteuer PV-Anlage",
      "Steuerliche Förderung Solar",
    ],
    alternates: {
      canonical: "https://www.oekovolt.de/forderungen/steuerlich",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/forderungen/steuerlich",
      title: title,
      description: description,
      images: [
        {
          url: bannerData?.image || "/Logo-Oekovolt-Gruen-mit-Weiss.webp",
          width: 1200,
          height: 630,
          alt: bannerData?.alt_image || "Ökovolt Deutschland",
        },
      ],
    },
  };
}

const STEUERLICH_PAGE_URL = "https://www.oekovolt.de/forderungen/steuerlich";

export default async function Steuerlich() {
  const response = await fetchSteuerlichData();
  const data = response?.message;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${STEUERLICH_PAGE_URL}/#webpage`,
    url: STEUERLICH_PAGE_URL,
    name: data?.banner?.title || "Steuerliche Förderungen für Photovoltaik | Ökovolt Deutschland",
    description: data?.banner?.description || "Aktuelle steuerrechtliche Bestimmungen für Photovoltaikanlagen in Deutschland – Einkommensteuer, Umsatzsteuer und steuerliche Vorteile für private und gewerbliche Betreiber.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Förderungen", item: "https://www.oekovolt.de/forderungen" },
        { "@type": "ListItem", position: 3, name: "Steuerlich", item: STEUERLICH_PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <SteuerlichBannerSection data={data?.banner} />
      <TaxTreatmentPV data={data?.body} />
      <EndSection />
    </div>
  );
}