import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { FiGlobe, FiMail, FiPhone, FiCheckCircle } from "react-icons/fi";

const slugToTitle = (slug) =>
  slug
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "-")
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9-]/g, "");

export async function generateMetadata(props) {
  const { slug } = await props.params;
  const title = slugToTitle(slug);
  try {
    const apiUrl = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.hersteller.api.get_hesteller_by_name?name=${encodeURIComponent(title)}`;
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    const json = await res.json();
    const hersteller = json.message?.message;
    if (hersteller) {
      return {
        title: `${hersteller.title} Wärmepumpen | Ökovolt Solartechnik`,
        description: hersteller.company_description || `${hersteller.title} Wärmepumpen bei Ökovolt Solartechnik – hochwertige und effiziente Heizlösungen.`,
        alternates: { canonical: `https://www.oekovolt.de/produkte/warmepumpe/${slug}` },
        openGraph: {
          type: "website",
          url: `https://www.oekovolt.de/produkte/warmepumpe/${slug}`,
          title: `${hersteller.title} Wärmepumpen | Ökovolt Solartechnik`,
          description: hersteller.company_description || `${hersteller.title} Wärmepumpen bei Ökovolt Solartechnik – hochwertige und effiziente Heizlösungen.`,
          images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: `${hersteller.title} Wärmepumpen` }],
        },
        twitter: {
          card: "summary_large_image",
          title: `${hersteller.title} Wärmepumpen | Ökovolt Solartechnik`,
          description: hersteller.company_description || `${hersteller.title} Wärmepumpen bei Ökovolt Solartechnik.`,
          images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
        },
      };
    }
  } catch {}
  return {
    title: "Wärmepumpen Hersteller | Ökovolt Solartechnik",
    description: "Entdecken Sie hochwertige Wärmepumpen von führenden Herstellern bei Ökovolt Solartechnik.",
    alternates: { canonical: `https://www.oekovolt.de/produkte/warmepumpe/${slug}` },
    openGraph: {
      type: "website",
      url: `https://www.oekovolt.de/produkte/warmepumpe/${slug}`,
      title: "Wärmepumpen Hersteller | Ökovolt Solartechnik",
      description: "Entdecken Sie hochwertige Wärmepumpen von führenden Herstellern bei Ökovolt Solartechnik.",
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Wärmepumpen" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Wärmepumpen Hersteller | Ökovolt Solartechnik",
      description: "Entdecken Sie hochwertige Wärmepumpen von führenden Herstellern bei Ökovolt Solartechnik.",
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
    },
  };
}


export default async function HerstellerDetailPage({ params }) {
  const { slug } = params;
  const title = slugToTitle(slug);
  const apiUrl = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.hersteller.api.get_hesteller_by_name?name=${encodeURIComponent(title)}`;

  let hersteller = null;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    const json = await res.json();
    hersteller = json.message.message;
  } catch (err) {
    console.error("Error fetching data:", err);
  }

  if (!hersteller || hersteller.hersteller_category !== "Stromspeicher") {
    return <div className="p-6 text-center text-gray-500">Keine Daten gefunden.</div>;
  }

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
].filter(
  (p) => p.status === "Aktiv" 
);


  return (
    <section>
      {/* Banner */}
      <div className="relative bg-gray-900 text-white px-6">
        {hersteller.banner_image && (
          <div className="absolute inset-0 bg-black opacity-50">
            <Image
              src={`${API_IMG_URL}${hersteller.banner_image}`}
              alt={hersteller.alt_banner_image || hersteller.title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto py-10 md:py-16">
          <div className="flex md:flex-row items-center gap-6 h-60">
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
                          src={`${API_IMG_URL}${product.image}`}
                          alt={product.alt || product.name}
                          fill
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
                              <FiCheckCircle className="mt-1 text-[#669933] shrink-0" />
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
          <div className="lg:w-1/3 bg-gray-100 p-6 rounded-xl shadow-md space-y-4 max-w-xl">
            {hersteller.logo_image && (
              <div className="shrink-0">
                <Image
                  src={`${API_IMG_URL}${hersteller.logo_image}`}
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
                  <FiGlobe className="text-blue-600" />
                  <Link
                    href={hersteller.website_url}
                    className="underline hover:text-blue-800 transition"
                    target="_blank"
                  >
                    {hersteller.website_url}
                  </Link>
                </p>
              )}
              {hersteller.email && (
                <p className="flex items-center gap-2">
                  <FiMail className="text-red-500" />
                  <a href={`mailto:${hersteller.email}`} className="hover:underline">
                    {hersteller.email}
                  </a>
                </p>
              )}
              {hersteller.phone_number && (
                <p className="flex items-center gap-2">
                  <FiPhone className="text-green-600" />
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
