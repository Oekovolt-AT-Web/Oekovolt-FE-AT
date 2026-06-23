import PrivacyPolicy from "@/components/Datenschutz/datenschutz";
import BannerSection from "@/components/Reusable/banner";
import EndSection from "@/components/Reusable/end";

export const metadata = {
  alternates: {
    canonical: "https://www.oekovolt.de/datenschutz",
    languages: {
      "de-DE": "https://www.oekovolt.de/datenschutz",
    },
  },
  title: "Datenschutz",
  description:
    "Erfahren Sie alles über die datenschutzrechtlichen Bestimmungen und Ihre Rechte auf der Website von ÖKOVOLT GmbH. Wir erläutern unsere Datenschutzpraktiken, einschließlich der Nutzung von Cookies, Google Analytics und Google AdWords, sowie der Möglichkeit, Ihre Einwilligung zur Datenverarbeitung jederzeit zu widerrufen. Weitere Informationen zu den Rechten auf Auskunft, Berichtigung und Löschung Ihrer personenbezogenen Daten sowie zur SSL-Verschlüsselung für sichere Kommunikation finden Sie hier.",
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
    title: "Datenschutz | Ökovolt Deutschland",
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
