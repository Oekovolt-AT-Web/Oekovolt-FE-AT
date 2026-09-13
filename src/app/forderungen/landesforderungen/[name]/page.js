// src/app/forderungen/landesforderungen/[name]/page.js

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeEuro, Banknote, MapPin, SearchCheck, Sun } from "lucide-react";
import { generateSlug } from "@/lib/slugify";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import LandesDetails, { LandAufEinenBlick, landesFaq } from "@/components/Forderungen/LandesDetails";
import ApiLeitfaden from "@/components/Forderungen/Landes/ApiLeitfaden";
import { datumKurz, kuerzen } from "@/components/Forderungen/Shared/format";
import { BUNDESLAENDER, FOERDERARTEN, LAENDER_PROFIL, NACHBARN, REGIONALSEITEN, seiteFuerSlug } from "@/data/bundeslaender";

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

const PAGE_BASE = "https://www.oekovolt.de/forderungen/landesforderungen";

function findeEintrag(allData, name) {
    return allData.find((item) => {
        const itemTitle = item?.firstcard_title || item.name || '';
        return generateSlug(itemTitle) === name;
    });
}

function ortsnameFuer(seite, item) {
    if (seite) return seite.typ === "region" ? seite.region.name : seite.land.name;
    return (item?.firstcard_title || "").replace(/^Landesförderungen in\s*/, "");
}

export async function generateMetadata({ params }) {
    const { name } = await params;
    const allData = await fetchAllData();

    // Find the specific item based on the slug
    const item = findeEintrag(allData, name);

    // Fallback if item is not found
    if (!item) {
        notFound();
    }

    const seite = seiteFuerSlug(name);
    const ort = ortsnameFuer(seite, item);

    // Titel: Keyword vorn, Jahr, Marke – möglichst ≤ 60 Zeichen
    const langTitel = `Photovoltaik Förderung ${ort} 2026 | Ökovolt`;
    const title = langTitel.length <= 60 ? langTitel : `PV-Förderung ${ort} 2026 | Ökovolt`;
    const description = seite
        ? kuerzen(`PV- & Speicherförderung ${ort} 2026: ${seite.land.landesprogramm.kurz} Programme, Anlaufstellen & Solarertrag – jetzt prüfen.`, 160)
        : kuerzen(item?.forderungen_text?.[0]?.secondary_paragraph || `Photovoltaik-Förderung in ${ort} 2026 – Programme, Voraussetzungen und Tipps.`, 158);

    // Convert comma-separated string to array
    const keywords = item.keywords
        ? item.keywords.split(/,\s*/).filter(Boolean)
        : ["Photovoltaik Förderung", "Solarförderung"];

    const imageUrl = item.firstcard_image ? `/api/image?path=${item.firstcard_image}` : "/og-image.jpg";
    const canonicalUrl = `${PAGE_BASE}/${name}`;

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: canonicalUrl,
            languages: hreflangLanguages(canonicalUrl),
        },
        robots: { index: true, follow: true },
        openGraph: {
            type: "article",
            url: canonicalUrl,
            siteName: "Ökovolt Deutschland",
            title,
            description,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: item.firstcard_alt_image || title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

const img = (p) => (p ? `/api/image?path=${p}` : "/Images/Jobs/download.jpg");

export default async function LandesforderungDetailPage({ params }) {
    const { name } = await params;
    const allData = await fetchAllData();

    const currentItem = findeEintrag(allData, name);

    if (!currentItem) notFound();

    const seite = seiteFuerSlug(name);
    const ort = ortsnameFuer(seite, currentItem);
    const intro = currentItem?.forderungen_text?.[0];
    const faq = landesFaq(name);
    const pageUrl = `${PAGE_BASE}/${name}`;

    // Weitere Seiten: Nachbarländer (bei Regionalseiten: Landesseite + Nachbarregionen)
    const vorhandeneSlugs = new Set(allData.map((it) => generateSlug(it.firstcard_title || it.name || "")));
    const weitere = [];
    const regionen = (ohne) =>
        Object.entries(REGIONALSEITEN).forEach(([slug, r]) => {
            if (slug !== ohne && vorhandeneSlugs.has(slug)) weitere.push({ href: `/forderungen/landesforderungen/${slug}`, name: r.name });
        });
    if (seite?.typ === "region") {
        weitere.push({ href: `/forderungen/landesforderungen/${seite.land.slugs[0]}`, name: seite.land.name, kuerzel: seite.profil.kuerzel });
        regionen(name);
    } else if (seite) {
        (NACHBARN[seite.key] || []).forEach((k) => {
            const l = BUNDESLAENDER[k];
            if (l && vorhandeneSlugs.has(l.slugs[0])) weitere.push({ href: `/forderungen/landesforderungen/${l.slugs[0]}`, name: l.name, kuerzel: LAENDER_PROFIL[k].kuerzel });
        });
        if (seite.key === "bayern") regionen(null);
    }

    const breadcrumbs = [
        { name: "Förderungen" },
        { name: "Landesförderungen", href: "/forderungen/landesforderungen" },
        ...(seite?.typ === "region" ? [{ name: seite.land.name, href: `/forderungen/landesforderungen/${seite.land.slugs[0]}` }] : []),
        { name: ort },
    ];

    const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: `Photovoltaik-Förderung in ${ort} 2026`,
        description: intro?.secondary_paragraph,
        inLanguage: "de-DE",
        isPartOf: { "@id": "https://www.oekovolt.de/#website" },
        about: [
            { "@type": "Thing", name: "Photovoltaik-Förderung" },
            seite?.typ === "region"
                ? { "@type": "Place", name: ort, containedInPlace: { "@type": "State", name: seite.land.name } }
                : { "@type": "State", name: ort },
        ],
        publisher: { "@id": "https://www.oekovolt.de/#organization" },
        ...(seite ? { dateModified: seite.land.stand } : {}),
    };

    const foerderart = seite?.profil.foerderart;
    const FoerderIcon = foerderart === "zuschuss" ? BadgeEuro : foerderart === "darlehen" ? Banknote : Sun;
    const checkHref = `/foerdercheck${seite ? `?land=${seite.key}` : ""}`;

    return (
        <div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <PageHero
                breadcrumbs={breadcrumbs}
                eyebrow={seite ? `Förderung ${ort} · Stand ${datumKurz(seite.land.stand)}` : "Förderung 2026"}
                title={currentItem.firstcard_title}
                lead={intro?.secondary_paragraph || `Welche Förderung es 2026 für Photovoltaik und Speicher in ${ort} gibt – kompakt und geprüft.`}
                image={{ src: img(currentItem.firstcard_image), alt: currentItem.firstcard_alt_image || `Photovoltaik-Förderung in ${ort}` }}
                points={["0 % USt. & steuerfreie Erträge", "Landes- & Kommunalprogramme", "Regionale Anlaufstellen", "Datiert und geprüft"]}
                actions={[
                    { label: "Angebot mit Förderprüfung", href: "/angebot" },
                    { label: "Förder-Check", href: checkHref, icon: SearchCheck },
                ]}
                badge={seite && (
                    <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
                            <FoerderIcon aria-hidden="true" className="h-6 w-6" />
                        </span>
                        <div>
                            <p className="font-display text-[19px] font-extrabold leading-tight text-ink-900">{FOERDERARTEN[foerderart].label}</p>
                            <p className="mt-1 text-[12.5px] leading-snug text-ink-500">
                                {seite.land.name} · {seite.profil.ertrag[0].toLocaleString("de-DE")}–{seite.profil.ertrag[1].toLocaleString("de-DE")} kWh/kWp
                            </p>
                        </div>
                    </div>
                )}
            />

            <LandAufEinenBlick slug={name} />
            <LandesDetails slug={name} />
            <ApiLeitfaden item={currentItem} ortsname={ort} />

            {weitere.length > 0 && (
                <Section tone="sand" space="sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                        <h2 className="ov-h3 shrink-0 text-ink-900">
                            {seite?.typ === "region" ? "Förderung in der Umgebung" : `Förderung in den Nachbarländern`}
                        </h2>
                        <ul className="flex flex-wrap gap-2.5 lg:justify-end">
                            {weitere.map((w) => (
                                <li key={w.href}>
                                    <Link href={w.href} className="group inline-flex h-11 items-center gap-2 rounded-full bg-white pl-2 pr-4 text-[14.5px] font-semibold text-ink-800 ring-1 ring-ink-200 transition-all hover:text-ov-800 hover:ring-ov-300">
                                        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-ov-50 px-1.5 text-[11.5px] font-bold text-ov-700">
                                            {w.kuerzel || <MapPin aria-hidden="true" className="h-3.5 w-3.5" />}
                                        </span>
                                        {w.name}
                                        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-ov-600" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Section>
            )}

            <SolarrechnerTeaser
                href={checkHref}
                cta="Förder-Check starten"
                titel={`Welche Programme passen in ${ort} zu Ihrem Vorhaben?`}
                text="PV, Speicher, Wallbox oder Wärmepumpe wählen – der Förder-Check stellt Bundes-, Landes- und Kommunalprogramme mit Links zusammen."
            />

            {faq.length > 0 && (
                <Section tone="white" space="lg">
                    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                        <SectionHeading
                            eyebrow="Häufige Fragen"
                            title={`Förderung in ${ort} – kurz beantwortet`}
                            lead="Die Antworten beruhen auf unserem letzten Prüfstand. Für Ihre Adresse prüfen wir die Förderlage im Rahmen der kostenlosen Beratung."
                        />
                        <Faq items={faq} />
                    </div>
                </Section>
            )}

            <Querverweise pfad="/forderungen/landesforderungen" />
            <CtaBand
                eyebrow="Förderung & Planung aus einer Hand"
                title={`Ihre Photovoltaikanlage in ${ort} – mit allen Förderungen.`}
                text="Wir prüfen die Programme für Ihren Standort, stimmen Förderantrag und Vertrag zeitlich ab und übernehmen Netzanmeldung sowie Marktstammdatenregister."
                primary={{ label: "Kostenloses Angebot anfragen", href: "/angebot" }}
                secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
            />
        </div>
    );
}
