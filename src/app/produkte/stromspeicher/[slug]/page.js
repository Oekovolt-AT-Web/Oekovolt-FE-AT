// src/app/produkte/stromspeicher/[slug]/page.js

import { notFound } from "next/navigation";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import HerstellerDetail, { istBelegterPartner, kuerzen } from "@/components/Produktdetail/HerstellerDetail";
import { generateSlug } from "@/lib/slugify";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL } from "@/lib/site";


// Use the single shared slug function so URLs match the sitemap exactly.
const createSlug = (title) => generateSlug(title);

// 1. ALLE Stromspeicher Items holen (für generateStaticParams)
async function fetchAllStromspeicherItems() {
  const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.stromspeicher_page.api.get_strom_page_with_keywords`;

  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return [];
  }

  try {
    const headers = getApiHeaders();

    const res = await fetch(DATA_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!res.ok) {
      console.error(`API returned ${res.status}`);
      return [];
    }

    const json = await res.json();
    const data = json.message;
    
    // Die strom_second_card_table ist das Array mit allen Items
    const items = data?.strom_second_card_table || [];
    
    return items;
  } catch (error) {
    console.error("Error fetching stromspeicher items:", error);
    return [];
  }
}

// 2. Hersteller DETAILS holen (für die Seite)
async function fetchManufacturerByName(name) {
  const API_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.hersteller.api.get_hesteller_by_name?name=${encodeURIComponent(name)}`;

  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const res = await fetch(API_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!res.ok) {
      console.error(`API returned ${res.status} for ${name}`);
      return null;
    }

    const data = await res.json();
    const manufacturer = data?.message?.message || data?.message;

    if (!manufacturer) {
      return null;
    }

    return manufacturer;
  } catch (error) {
    console.error(`Error fetching manufacturer ${name}:`, error);
    return null;
  }
}

// generateStaticParams: Holt alle Slugs aus der strom_second_card_table
export async function generateStaticParams() {
  try {
    const items = await fetchAllStromspeicherItems();

    if (!items || items.length === 0) {
      console.warn("⚠️ No stromspeicher items found - returning empty params");
      return [];
    }

    const params = items.map((item) => ({
      slug: createSlug(item.title)
    })).filter(param => param.slug);

    
    return params;
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

// Metadata für SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;

  // Wir müssen den Titel aus dem Slug finden
  const items = await fetchAllStromspeicherItems();
  const item = items.find(i => createSlug(i.title) === slug);

  if (!item) {
    return {
      title: `${slug} | Hersteller nicht gefunden`,
      description: `Informationen zum Hersteller konnten nicht geladen werden.`,
      robots: { index: false, follow: true },
    };
  }

  // Jetzt den Hersteller mit dem Titel holen
  const manufacturer = await fetchManufacturerByName(item.title);
  const name = manufacturer?.title || item.title;
  const url = `${BASE_URL}/produkte/stromspeicher/${slug}`;
  const langerTitel = `${name} Stromspeicher: Planung & Einbau | Ökovolt`;
  const title = langerTitel.length <= 60 ? langerTitel : `${name} Stromspeicher | Ökovolt`;
  const description = kuerzen(
    `${name} Stromspeicher in Österreich – Planung und Einbau durch Ökovolt: ${manufacturer?.main_description || item.main_description || ""}`.trim(),
    155
  );

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangLanguages(url) },
    // Nur Marken mit belegter Zusammenarbeit in Österreich indexieren
    robots: { index: istBelegterPartner(name), follow: true },
    openGraph: {
      type: "website",
      locale: "de_AT",
      url,
      siteName: "Ökovolt Österreich",
      title,
      description,
      images: [{
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${name} Stromspeicher`
      }],
    },
  };
}

// Hauptseite
export default async function HerstellerDetailPage({ params }) {
  const { slug } = await params;

  // 1. Erst alle Items holen um den Titel zu finden
  const items = await fetchAllStromspeicherItems();
  const item = items.find(i => createSlug(i.title) === slug);

  if (!item) {
    notFound();
  }

  // 2. Dann den Hersteller mit dem Titel holen – fällt der Abruf aus,
  //    rendert die Seite mit den Basisdaten aus der Übersicht weiter.
  let hersteller = null;
  try {
    hersteller = await fetchManufacturerByName(item.title);
  } catch (err) {
    console.error("Error fetching data:", err);
  }

  return (
    <HerstellerDetail
      kontext="stromspeicher"
      slug={slug}
      item={item}
      hersteller={hersteller}
      alleItems={items}
    />
  );
}
