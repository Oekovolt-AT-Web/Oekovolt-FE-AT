// src/app/produkte/stromspeicher/[slug]/page.js

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { Globe, Mail, Phone, CheckCircle } from "lucide-react";
import { generateSlug } from "@/lib/slugify";


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
    };
  }

  // Jetzt den Hersteller mit dem Titel holen
  const manufacturer = await fetchManufacturerByName(item.title);

  if (!manufacturer) {
    return {
      title: `${item.title} Stromspeicher`,
      description: `Informationen über ${item.title} als Hersteller von Stromspeichern.`,
    };
  }

  return {
    title: `${manufacturer.title} Stromspeicher`,
    description: manufacturer.company_description || `${manufacturer.title} `,
    alternates: { 
      canonical: `https://www.oekovolt.de/produkte/stromspeicher/${slug}` 
    },
    openGraph: {
      type: "website",
      url: `https://www.oekovolt.de/produkte/stromspeicher/${slug}`,
      title: `${manufacturer.title} Stromspeicher`,
      description: manufacturer.company_description || `${manufacturer.title}`,
      images: [{ 
        url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", 
        width: 1200, 
        height: 630, 
        alt: `${manufacturer.title} Stromspeicher` 
      }],
    },
  };
}

// Hauptseite
export default async function HerstellerDetailPage({ params }) {
  const { slug } = await params;
  
  // 1. Erst alle Items holen um den Titel zu finden
  const items = await fetchAllStromspeicherItems();
  const stromspeicherItem = items.find(i => createSlug(i.title) === slug);
  
  if (!stromspeicherItem) {
    notFound();
  }
  
  // 2. Dann den Hersteller mit dem Titel holen
  let hersteller = null;
  
  try {
    hersteller = await fetchManufacturerByName(stromspeicherItem.title);
  } catch (err) {
    console.error("Error fetching data:", err);
  }

  if (!hersteller) {
    notFound();
  }

  // Produkte Array aus den Hersteller-Daten
  const products = [
    {
      status: hersteller.first_product_status,
      name: hersteller.first_product_name,
      image: hersteller.first_product_image,
      alt: hersteller.first_product_image_alt,
      description: hersteller.first_product_description,
      options: hersteller.first_product_options,
      hersteller_category: hersteller.first_product_category,
    },
    {
      status: hersteller.second_product_status,
      name: hersteller.second_product_name,
      image: hersteller.second_product_image,
      alt: hersteller.second_product_image_alt,
      description: hersteller.second_product_description,
      options: hersteller.second_product_options,
      hersteller_category: hersteller.second_product_category,
    },
    {
      status: hersteller.third_product_status,
      name: hersteller.third_product_name,
      image: hersteller.third_product_image,
      alt: hersteller.third_product_image_alt,
      description: hersteller.third_product_description,
      options: hersteller.third_product_options,
      hersteller_category: hersteller.third_product_category,
    },
    {
      status: hersteller.fourth_product_status,
      name: hersteller.fourth_product_name,
      image: hersteller.fourth_product_image,
      alt: hersteller.fourth_product_image_alt,
      description: hersteller.fourth_product_description,
      options: hersteller.fourth_product_options,
      hersteller_category: hersteller.fourth_product_category,
    },
    {
      status: hersteller.fifth_product_status,
      name: hersteller.fifth_product_name,
      image: hersteller.fifth_product_image,
      alt: hersteller.fifth_product_image_alt,
      description: hersteller.fifth_product_description,
      options: hersteller.fifth_product_options,
      hersteller_category: hersteller.fifth_product_category,
    },
  ].filter((p) => p.status === "Aktiv");

  // Render
  return (
    <section>
      {/* Banner */}
      <div className="relative bg-gray-900 text-white px-6 min-h-[300px]">
        {hersteller.banner_image && (
          <>
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <Image
              src={`/api/image?path=${hersteller.banner_image}`}
              alt={hersteller.alt_banner_image || hersteller.title}
              fill
              sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, 50vw"
              className="object-cover object-center"
              loading="eager"
            />
          </>
        )}
        <div className="relative z-20 max-w-7xl mx-auto py-10 md:py-16">
          <div className="flex md:flex-row items-center gap-6 min-h-[240px]">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{hersteller.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:gap-10 pt-9 md:pt-15 items-start">
          {/* Main Description */}
          <div className="lg:w-2/3 flex-grow text-lg text-gray-800 leading-relaxed rounded-xl whitespace-pre-line">
            {hersteller.main_description}

            {products.length > 0 && (
              <div className="mt-6 space-y-10">
                {products.map((product, idx) => (
                  <div key={idx}>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                      {product.name}
                    </h2>

                    <p className="text-gray-700 text-md leading-relaxed mb-6 whitespace-pre-line">
                      {product.description}
                    </p>

                    {product.image && (
                      <div className="relative w-full max-w-xl h-[300px] md:h-[400px] mb-6">
                        <Image
                          src={`/api/image?path=${product.image}`}
                          alt={product.alt || product.name}
                          fill
                          sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, 50vw"
                          className="object-contain rounded-xl shadow-md"
                        />
                      </div>
                    )}

                    {product.options?.length > 0 && (
                      <div className="mb-10">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Leistungsmerkmale {product.name}
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          {product.options.map((opt, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="mt-1 text-[#669933] shrink-0" />
                              <span>{opt.options}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <hr className="my-10 border-t border-gray-200" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Info Card */}
          <div className="lg:w-1/3 bg-gray-100 p-6 rounded-xl shadow-md space-y-4 max-w-xl sticky top-6">
            {hersteller.logo_image && (
              <div className="shrink-0">
                <Image
                  src={`/api/image?path=${hersteller.logo_image}`}
                  alt={hersteller.alt_logo_image || hersteller.title}
                  width={120}
                  height={120}
                  className="rounded-xl object-contain p-2"
                />
              </div>
            )}

            <p className="text-lg">{hersteller.company_description}</p>
            <h2 className="text-xl font-semibold text-gray-800">Kontaktinformationen</h2>
            <div className="space-y-2 text-gray-700">
              {hersteller.website_url && (
                <p className="flex items-center gap-2">
                  <Globe className="text-blue-600 shrink-0" />
                  <Link
                    href={hersteller.website_url}
                    className="underline hover:text-blue-800 transition break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Offizielle Website von {hersteller.title}
                  </Link>
                </p>
              )}
              {hersteller.email && (
                <p className="flex items-center gap-2">
                  <Mail className="text-red-500 shrink-0" />
                  <a href={`mailto:${hersteller.email}`} className="hover:underline break-all">
                    {hersteller.email}
                  </a>
                </p>
              )}
              {hersteller.phone_number && (
                <p className="flex items-center gap-2">
                  <Phone className="text-green-600 shrink-0" />
                  <a href={`tel:${hersteller.phone_number}`} className="hover:underline">
                    {hersteller.phone_number}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}