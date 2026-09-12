import PrivacyPolicy from "@/components/Datenschutz/datenschutz";
import BannerSection from "@/components/Reusable/banner";
import EndSection from "@/components/Reusable/end";
import { hreflangLanguages } from "@/lib/hreflang";

export const metadata = {
  alternates: { canonical: "https://www.oekovolt.de/datenschutz", languages: hreflangLanguages("https://www.oekovolt.de/datenschutz") },
  title: "Datenschutzerklärung | Ökovolt GmbH Solartechnik",
  description:
    "Datenschutz bei Ökovolt: Erfahren Sie, wie wir Ihre personenbezogenen Daten schützen, verarbeiten und welche Rechte Ihnen nach DSGVO zustehen.",
  keywords: [
    "Datenschutz",
    "ÖKOVOLT GmbH",
    "DSGVO",
    "Google Analytics",
    "Cookies",
  ],
  openGraph: {
    type: "website",
    url: "https://www.oekovolt.de/datenschutz",
    title: "Datenschutzerklärung | Ökovolt GmbH Solartechnik",
    description: "Datenschutzrechtliche Bestimmungen und Ihre Rechte bei ÖKOVOLT GmbH.",
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

export default function DatenschutzPage() {
  const data = {
    title: "Datenschutz & Sicherheit",
    img: "/Images/Kontakt/download-2.jpg",
  };

  return (
    <div>
      <BannerSection data={data} />
      <PrivacyPolicy />
      <EndSection />
    </div>
  );
}
