// src/app/forderungen/landesforderungen/[name]/page.js

import EndSection from "@/components/Reusable/end";
import { notFound } from "next/navigation";
import { generateSlug } from "@/lib/slugify";
import ForderungenSectionClient from "@/components/Forderungen/Landes/second-client";
import LandesBannerItems from "@/components/Forderungen/Landes/bannerItems";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";

// Global cache to prevent refetching
let globalDataCache = null;

// Direct API fetch function inside the page
async function fetchLandesforderungenData() {
    const API_URL = `${API_BASE_URL}oekovoltdeutchland.forderungen_pages.doctype.forderungen_lande.api.get_all_forderung_lande_pages`;

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
            throw new Error(`Failed to fetch data: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching landesforderungen data:", error);
        throw error;
    }
}

async function fetchAllData() {
    if (globalDataCache) return globalDataCache;

    try {
        const json = await fetchLandesforderungenData();
        const data = json?.message;

        let result = [];
        if (Array.isArray(data)) result = data;
        else if (data && typeof data === 'object') result = Object.values(data);

        globalDataCache = result;
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        return globalDataCache || [];
    }
}

export async function generateStaticParams() {
    const allData = await fetchAllData();

    if (allData.length === 0) {
        console.warn("⚠️ No data found - returning empty params");
        return [];
    }

    const params = allData.map((item) => {
        const title = item.firstcard_title || item.name || '';
        const slug = generateSlug(title);
        return { name: slug };
    });

    return params;
}

export async function generateMetadata({ params }) {
    const { name } = await params;
    const allData = await fetchAllData();

    // Find the specific item based on the slug
    const item = allData.find((item) => {
        const itemTitle = item.firstcard_title || item.name || '';
        const itemSlug = generateSlug(itemTitle);
        return itemSlug === name;
    });

    // Fallback if item is not found
    if (!item) {
        return {
            title: "Landesförderung nicht gefunden | Ökovolt",
            description: "Informationen zur gewünschten Landesförderung konnten nicht geladen werden.",
        };
    }

    // Process variables from your dynamic data
    const title = item.firstcard_title || item.name;
    const description = item?.forderungen_text?.[0]?.secondary_paragraph ||
        `Aktuelle Förderprogramme für ${title} im Bereich Photovoltaik und Speicher.`;

    // Convert comma-separated string to array
    const keywords = item.keywords
        ? item.keywords.split(/,\s*/).filter(Boolean)
        : ["Photovoltaik Förderung", "Solarförderung"];

    const imageUrl = `/api/image?path=${item.firstcard_image}` || "/01.png";
    const canonicalUrl = `https://www.oekovolt.de/forderungen/landesforderungen/${name}`;

    return {
        title: title,
        description: description,
        keywords: keywords,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: "website",
            url: canonicalUrl,
            title: title,
            description: description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: item.firstcard_alt_image || title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [imageUrl],
        },
    };
}

export default async function LandesforderungDetailPage({ params }) {
    const { name } = await params;
    const allData = await fetchAllData();

    const currentItem = allData.find((item) => {
        const itemTitle = item?.firstcard_title || item.name || '';
        const itemSlug = generateSlug(itemTitle);
        return itemSlug === name;
    });

    if (!currentItem) notFound();

    return (
        <div>
            <LandesBannerItems data={currentItem} />
            <ForderungenSectionClient initialData={currentItem} allData={allData} />
            <EndSection />
        </div>
    );
}