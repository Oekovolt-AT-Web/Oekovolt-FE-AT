import SteuerlichBannerSection from "@/components/Forderungen/Steuerlich/banner";
import TaxTreatmentPV from "@/components/Forderungen/Steuerlich/second";
import EndSection from "@/components/Reusable/end";
import React from "react";

export const metadata = {
  title: "Steuerliche Förderungen für Photovoltaik | Ökovolt Deutschland",
  description:
    "Aktuelle steuerrechtliche Bestimmungen für Photovoltaikanlagen in Deutschland – Einkommensteuer, Umsatzsteuer und steuerliche Vorteile für private und gewerbliche Betreiber.",
  keywords: [
    "Photovoltaik Steuer",
    "Solaranlage Steuervorteile",
    "Einkommensteuer Photovoltaik",
    "Umsatzsteuer PV-Anlage",
    "Steuerliche Förderung Solar",
  ],
  alternates: {
    canonical: "https://www.oekovolt.de/forderungen/steuerlich",
  },
  openGraph: {
    type: "website",
    url: "https://www.oekovolt.de/forderungen/steuerlich",
    title: "Steuerliche Förderungen für Photovoltaik | Ökovolt Deutschland",
    description:
      "Steuerrechtliche Bestimmungen für Photovoltaikanlagen – Einkommensteuer und Umsatzsteuer für Betreiber.",
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
      <SteuerlichBannerSection />
      <TaxTreatmentPV />
      <EndSection />
    </div>
  );
};

export default page;
