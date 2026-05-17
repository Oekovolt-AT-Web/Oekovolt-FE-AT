import ContactSection from "@/components/Kontakt/address";
import ContactForm from "@/components/Kontakt/contactForm";
import Map from "@/components/Kontakt/map";
import TeamBanner from "@/components/Reusable/teamBanner";

export const metadata = {
  title: "Kontakt | Ökovolt Deutschland",
  description:
    "Kontaktieren Sie ÖKOVOLT Deutschland für professionelle Beratung und Unterstützung rund um Photovoltaik-Lösungen. Erreichen Sie uns per Telefon, E-Mail oder über unser Kontaktformular. Wir sind Montag bis Freitag für Sie da.",
  keywords: [
    "Kontakt ÖKOVOLT",
    "ÖKOVOLT Anfrage",
    "Photovoltaik Beratung",
    "Solaranlagen Kontakt",
    "ÖKOVOLT Deutschland",
  ],
  alternates: { canonical: "https://www.oekovolt.de/kontakt" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.oekovolt.de/kontakt",
    siteName: "Ökovolt Deutschland",
    title: "Kontakt | Ökovolt Deutschland",
    description:
      "Kontaktieren Sie ÖKOVOLT Deutschland für professionelle Beratung rund um Photovoltaik-Lösungen. Wir sind Montag bis Freitag für Sie da.",
    images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt | Ökovolt Deutschland",
    description: "Kontaktieren Sie ÖKOVOLT Deutschland für professionelle Beratung rund um Photovoltaik-Lösungen.",
    images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://www.oekovolt.de/kontakt/#webpage",
  url: "https://www.oekovolt.de/kontakt",
  name: "Kontakt | Ökovolt Deutschland",
  description: "Kontaktieren Sie ÖKOVOLT Deutschland für professionelle Beratung rund um Photovoltaik-Lösungen.",
  inLanguage: "de-DE",
  isPartOf: { "@id": "https://www.oekovolt.de/#website" },
  about: { "@id": "https://www.oekovolt.de/#organization" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
    { "@type": "ListItem", position: 2, name: "Kontakt", item: "https://www.oekovolt.de/kontakt" },
  ],
};

export default function KontaktPage() {
  const data = {
    title: "Kontaktieren Sie uns",
    img: "/Images/Kontakt/download.jpg",
    description: "Wir freuen uns darauf, von Ihnen zu hören – Ihr direkter Draht zu unseren Experten.",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <TeamBanner data={data} />
      <ContactSection /> 
      <Map />
      <ContactForm />
    </div>
  );
}