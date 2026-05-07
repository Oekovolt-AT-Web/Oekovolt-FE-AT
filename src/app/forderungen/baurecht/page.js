import BaurechtBannerSection from "@/components/Forderungen/Baurecht/banner";
import BaurechtPV from "@/components/Forderungen/Baurecht/second";
import EndSection from "@/components/Reusable/end";
import React from "react";

export const metadata = {
  title: "Baurecht für Photovoltaik | Ökovolt Deutschland",
  description:
    "Überblick über die baurechtlichen Vorschriften für Photovoltaikanlagen in Deutschland – Genehmigungspflichten, Bauvorschriften und Abstandsregelungen verständlich erklärt.",
  keywords: [
    "Photovoltaik Baurecht",
    "PV-Anlage Genehmigung",
    "Bauvorschriften Photovoltaik",
    "Solaranlage Abstand",
    "Förderungen Baurecht",
  ],
  alternates: {
    canonical: "https://www.oekovolt.de/forderungen/baurecht",
  },
  openGraph: {
    type: "website",
    url: "https://www.oekovolt.de/forderungen/baurecht",
    title: "Baurecht für Photovoltaik | Ökovolt Deutschland",
    description:
      "Baurechtliche Vorschriften für Photovoltaikanlagen in Deutschland – Genehmigungspflichten und Bauvorschriften.",
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

const page = () => {
  return (
    <div>
      <BaurechtBannerSection />
      <BaurechtPV />
      <EndSection />
    </div>
  );
};

export default page;
