import Impressum from "@/components/Impressum/impressum";
import BannerSection from "@/components/Reusable/banner";
import EndSection from "@/components/Reusable/end";

export const metadata = {
  title: "Impressum | Ökovolt Deutschland",
  description: "Das Impressum der ÖKOVOLT GmbH Solartechnik enthält alle wichtigen rechtlichen Informationen wie Kontaktadresse, Unternehmensgegenstand, Haftungshinweise und Urheberrechte.",
  keywords: ["Impressum ÖKOVOLT GmbH", "Photovoltaik GmbH Impressum", "Rechtsform ÖKOVOLT", "Kontakt ÖKOVOLT", "Haftungshinweise ÖKOVOLT"],
  alternates: { canonical: "https://www.oekovolt.de/impressum" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", locale: "de_DE",
    url: "https://www.oekovolt.de/impressum",
    siteName: "Ökovolt Deutschland",
    title: "Impressum | Ökovolt Deutschland",
    description: "Rechtliche Informationen der ÖKOVOLT GmbH Solartechnik.",
    images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
  },
};

export default function ImpressumPage() {
  const data = {
    title: "Impressum",
    img: "/Images/Kontakt/download-2.jpg",
  };

  return (
    <div>
      <BannerSection data={data} />
      <Impressum />
      <EndSection />
    </div>
  );
}