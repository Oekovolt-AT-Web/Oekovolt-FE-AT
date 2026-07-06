import AGComponent from "@/components/Agb/agb";
import BannerSection from "@/components/Reusable/banner";
import GreenFeatureSection from "@/components/Reusable/contactInfo";

export const metadata = {
  title: "Allgemeine Geschäftsbedingungen (AGB) | Ökovolt",
  alternates: {
    canonical: "https://www.oekovolt.de/agb",
  },
  description:
    "Die Allgemeinen Geschäftsbedingungen der Ökovolt GmbH Solartechnik – transparent und verständlich. Informieren Sie sich über unsere Vertragsbedingungen.",
  keywords: [
    "AGB",
    "ÖKOVOLT GmbH",
    "Solarenergie Lösungen",
    "Photovoltaikanlagen",
    "Installationsdienstleistungen",
  ],
  openGraph: {
    type: "website",
    url: "https://www.oekovolt.de/agb",
    title: "Allgemeine Geschäftsbedingungen (AGB) | Ökovolt",
    description: "Die Allgemeinen Geschäftsbedingungen der Ökovolt GmbH Solartechnik – transparent und verständlich. Informieren Sie sich über unsere Vertragsbedingungen.",
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

export default function AgbPage() {
  const data = {
    title: "AGB - Photovoltaikanlagen",
    img: "/Images/Kontakt/download-2.jpg",
  };

  const end = {
    greentitle: "Solarenergie",
    title: "Ihr Einstieg in Solarenergie",
    description:
      "Möchten Sie Ihre Energiekosten senken und nachhaltig leben? Füllen Sie unser Kontaktformular aus – wir melden uns bei Ihnen!",
  };

  return (
    <div>
      <BannerSection data={data} />
      <AGComponent />
      <GreenFeatureSection data={end} />
    </div>
  );
}
