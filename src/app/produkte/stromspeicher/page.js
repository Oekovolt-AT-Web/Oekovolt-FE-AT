// produkte/stromspeicher/page.js

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Calculator, Moon, Sun, TrendingDown, Zap, Shield } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Fliesstext from "@/components/Reusable/Fliesstext";
import SpeicherTagesverlauf from "@/components/stromspeicher/SpeicherTagesverlauf";
import { generateSlug } from "@/lib/slugify";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import FeaturedLogos from "@/components/photovoltaikanlage/partners";
import { hreflangLanguages } from "@/lib/hreflang";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.stromspeicher_page.api.get_strom_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/stromspeicher";

async function fetchStromspeicherData() {
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
  const seoData = await fetchStromspeicherData();

  const defaultKeywords = ["Stromspeicher", "Batteriespeicher", "Solarstromspeicher", "Energiespeicher", "Photovoltaik Speicher"];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Stromspeicher für Photovoltaik nachrüsten | Ökovolt",
      description: "Batteriespeicher für Ihre Photovoltaikanlage: bis zu 80 % Eigenverbrauch, Notstromfunktion inklusive – Beratung, Installation & Nachrüstung vom Profi!",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",

        url: PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "Stromspeicher für Photovoltaik nachrüsten | Ökovolt",
        description: "Batteriespeicher für Ihre Photovoltaikanlage: bis zu 80 % Eigenverbrauch, Notstromfunktion inklusive – Beratung, Installation & Nachrüstung vom Profi!",
        images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Stromspeicher" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Stromspeicher für Photovoltaik nachrüsten | Ökovolt",
        description: "Batteriespeicher für Ihre Photovoltaikanlage: bis zu 80 % Eigenverbrauch, Notstromfunktion inklusive – Beratung, Installation & Nachrüstung vom Profi!",
        images: ["https://www.oekovolt.de/og-image.jpg"]
      },
    };
  }

  const apiKeywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : defaultKeywords;
  const title = "Stromspeicher für Photovoltaik nachrüsten | Ökovolt";
  const description ="Batteriespeicher für Ihre Photovoltaikanlage: bis zu 80 % Eigenverbrauch, Notstromfunktion inklusive – Beratung, Installation & Nachrüstung vom Profi!";

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
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Stromspeicher" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.oekovolt.de/og-image.jpg"]
    },
  };
}

const img = (p, fallback = "/Images/Dienstleistungen/Smartphone/Stronspeicher.jpg") => (p ? `/api/image?path=${p}` : fallback);

const VORTEIL_ICONS = [Shield, Sun, TrendingDown, Zap];

const FAQ = [
  {
    q: "Lohnt sich ein Stromspeicher 2026 noch?",
    a: "In den meisten Einfamilienhäusern ja. Eingespeister Solarstrom bringt nur noch rund 7–8 Cent je kWh, Netzstrom kostet dagegen über 30 Cent. Jede Kilowattstunde, die der Speicher abends statt des Netzes liefert, spart also die Differenz. Entscheidend ist die richtige Größe – ein überdimensionierter Speicher amortisiert sich deutlich langsamer.",
  },
  {
    q: "Wie groß sollte mein Stromspeicher sein?",
    a: "Als Faustregel gilt etwa 1 kWh Speicherkapazität je 1.000 kWh Jahresverbrauch, begrenzt durch die Anlagengröße. Ein 4-Personen-Haushalt mit 4.500 kWh liegt damit meist bei 5–8 kWh. Mit Wärmepumpe oder E-Auto kann mehr sinnvoll sein. Unser Stromspeicher-Rechner zeigt Ihnen die passende Größe.",
  },
  {
    q: "Kann ich einen Speicher an meine bestehende PV-Anlage nachrüsten?",
    a: "Ja. Je nach Wechselrichter wird der Speicher DC-seitig (Hybridwechselrichter) oder AC-seitig mit eigenem Batteriewechselrichter eingebunden. Wir prüfen Ihre Bestandsanlage und empfehlen die wirtschaftlichste Variante.",
  },
  {
    q: "Wie lange hält ein Batteriespeicher?",
    a: "Moderne Lithium-Eisenphosphat-Speicher (LFP) sind auf 6.000 und mehr Vollzyklen ausgelegt – bei rund 250 Zyklen pro Jahr entspricht das weit über 15 Jahren. Viele Hersteller geben 10 Jahre Garantie auf eine definierte Restkapazität.",
  },
  {
    q: "Habe ich mit Speicher auch bei Stromausfall Strom?",
    a: "Nur, wenn das System notstrom- oder ersatzstromfähig ausgelegt ist. Viele Speicher bieten diese Funktion optional – etwa über eine Notstrombox, die bei Netzausfall ausgewählte Stromkreise oder das ganze Haus versorgt. Das planen wir auf Wunsch direkt mit ein.",
  },
];

export default async function StromspeicherPage() {
  const data = await fetchStromspeicherData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Stromspeicher kaufen | Ökovolt Deutschland",
    description: data?.description || "Hochwertige Stromspeicher für Photovoltaikanlagen. Maximieren Sie Ihren Eigenverbrauch und werden Sie energieunabhängig mit unseren intelligenten Speicherlösungen.",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const produkte = data?.strom_second_card_table || [];
  const vorteile = (data?.storm_third_card_options || []).map((o, i) => ({
    icon: VORTEIL_ICONS[i % VORTEIL_ICONS.length],
    title: o.subtitle,
    text: o.paragraph,
  }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Stromspeicher" }]}
        eyebrow={data?.strom_title || "Stromspeicher"}
        title={data?.strom_subtitle || "Solarstrom speichern – und abends selbst nutzen"}
        lead={data?.strom_description || "Mit einem Batteriespeicher nutzen Sie den Strom Ihrer Photovoltaikanlage auch dann, wenn die Sonne nicht scheint."}
        image={{ src: img(data?.strom_banner_image), alt: data?.strom_banner_image_alt || "Stromspeicher im Hausanschlussraum" }}
        points={["Eigenverbrauch deutlich steigern", "Nachrüstbar für Bestandsanlagen", "Optional mit Notstromfunktion", "Markenspeicher mit Herstellergarantie"]}
        actions={[
          { label: "Speicher-Angebot anfragen", href: "/angebot" },
          { label: "Größe berechnen", href: "/rechner/stromspeicher", icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <BatteryCharging aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                ~ 25 ct <span className="text-[14px] font-semibold text-ink-500">Vorteil</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">je selbst genutzter statt eingespeister kWh</p>
            </div>
          </div>
        }
      />

      <FeaturedLogos />

      {data?.strom_first_card_title && (
        <Section tone="white" space="lg">
          <SplitMedia
            eyebrow="Warum ein Speicher"
            title={data.strom_first_card_title}
            image={{ src: img(data.strom_first_card_image), alt: data.strom_first_card_image_alt }}
          >
            <Fliesstext text={data.strom_first_card_description} className="mt-5 text-[16.5px] leading-relaxed text-ink-600" />
          </SplitMedia>
        </Section>
      )}

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="So funktioniert es"
          title={<>Tagsüber laden, <span className="ov-text-gradient">abends sparen</span></>}
          lead="Mittags erzeugt Ihre Anlage mehr, als Sie verbrauchen – abends ist es umgekehrt. Der Speicher schließt genau diese Lücke. Schalten Sie um und sehen Sie den Unterschied."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <SpeicherTagesverlauf />
        </Reveal>
        <div className="mt-16">
          <Steps
            items={[
              { icon: Sun, title: "Mittags: Überschuss", text: "Die Anlage deckt Ihren Verbrauch komplett. Was übrig bleibt, fließt zuerst in den Speicher statt für wenige Cent ins Netz." },
              { icon: BatteryCharging, title: "Nachmittags: voll geladen", text: "Ist der Speicher voll, wird der restliche Überschuss eingespeist und nach EEG vergütet." },
              { icon: Moon, title: "Abends: Ihr eigener Strom", text: "Kochen, Waschen, Licht: Der Speicher liefert Solarstrom bis in die Nacht – Netzstrom wird zur Ausnahme." },
            ]}
          />
        </div>
      </Section>

      {produkte.length > 0 && (
        <Section tone="white" space="lg">
          <SectionHeading
            eyebrow="Unsere Speicher"
            title="Speichersysteme, die wir empfehlen"
            lead="Geprüfte Markenhersteller, sauber integriert in Wechselrichter, Wallbox und Energiemanagement."
            className="mb-12"
          />
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {produkte.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 80} className="flex">
                <Link
                  href={`/produkte/stromspeicher/${generateSlug(item.title)}`}
                  className="group ov-card-hover flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-200"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                    <Image src={img(item.banner_image)} alt={item.alt_banner_image || item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    {item.logo_image && (
                      <span className="absolute left-4 top-4 flex h-11 items-center rounded-full bg-white/95 px-3 shadow-md backdrop-blur">
                        <Image src={img(item.logo_image)} alt={item.alt_logo_image || ""} width={80} height={28} className="h-6 w-auto object-contain" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <h3 className="ov-h3 text-ink-900 transition-colors group-hover:text-ov-700">{item.title}</h3>
                    <p className="mt-3 line-clamp-4 whitespace-pre-line text-[15px] leading-relaxed text-ink-600">{item.main_description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold text-ov-700">
                      Details ansehen
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {vorteile.length > 0 && (
        <Section tone="navy" space="lg" className="overflow-hidden">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
          <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeading dark eyebrow="Ihre Vorteile" title={data?.strom_third_card_title || "Was ein Speicher für Sie leistet"} />
              {data?.strom_third_card_image && (
                <Reveal dir="left" className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[2rem] lg:block">
                  <Image src={img(data.strom_third_card_image)} alt={data.strom_third_card_image_alt || ""} fill sizes="40vw" className="object-cover" />
                </Reveal>
              )}
            </div>
            <FeatureGrid items={vorteile} cols={2} tone="dark" />
          </div>
        </Section>
      )}

      <SolarrechnerTeaser
        href="/rechner/stromspeicher"
        cta="Zum Stromspeicher-Rechner"
        titel="Welche Speichergröße passt zu Ihnen?"
        text="Verbrauch, Anlagengröße und E-Auto oder Wärmepumpe eingeben – der Rechner zeigt Autarkie, Ersparnis und die wirtschaftlich sinnvolle Kapazität."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Stromspeicher – kurz & ehrlich beantwortet"
            lead="Sie haben eine andere Frage? Rufen Sie uns an – wir beraten herstellerunabhängig."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/produkte/stromspeicher" />
      <CtaBand
        title="Machen Sie Ihren Solarstrom rund um die Uhr nutzbar."
        primary={{ label: "Speicher-Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Speichergröße berechnen", href: "/rechner/stromspeicher" }}
      />
    </div>
  );
}
