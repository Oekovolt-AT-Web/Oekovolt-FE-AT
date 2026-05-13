import AGComponent from "@/components/Agb/agb";
import BannerSection from "@/components/Reusable/banner";
import GreenFeatureSection from "@/components/Reusable/contactInfo";

export const metadata = {
  title: "Allgemeine Geschäfts­bedingungen",
  description:
    "Erfahren Sie mehr über die Allgemeinen Geschäftsbedingungen (AGB) von ÖKOVOLT GmbH, einem führenden Anbieter von Solarenergie-Lösungen. Unsere detaillierten AGB regeln die Bedingungen für Verträge, einschließlich des Verkaufs von Photovoltaikanlagen, Installationsdiensten, Zahlungsmodalitäten, Garantieleistungen und Haftung. Diese Bedingungen gelten sowohl für Privat- als auch Geschäftskunden. Lesen Sie unsere vollständigen AGB, um Ihre Rechte und Pflichten im Umgang mit ÖKOVOLT zu verstehen.",
  keywords: [
    "AGB",
    "ÖKOVOLT GmbH",
    "Solarenergie Lösungen",
    "Photovoltaikanlagen",
    "Installationsdienstleistungen",
  ],
  alternates: {
    canonical: "https://www.oekovolt.de/agb",
  },
  openGraph: {
    type: "website",
    url: "https://www.oekovolt.de/agb",
    title: "Allgemeine Geschäftsbedingungen | Ökovolt Deutschland",
    description: "AGB der ÖKOVOLT GmbH für Photovoltaikanlagen und Solarenergie-Lösungen.",
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
    title: "Allgemeine Geschäfts­bedingungen",
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
