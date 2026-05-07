import RichtlinenBannerSection from "@/components/Forderungen/Richtlinen/banner";
import RichtlinienPV from "@/components/Forderungen/Richtlinen/second";
import EndSection from "@/components/Reusable/end";
import React from "react";

export const metadata = {
  title: "Technische Richtlinien für Photovoltaik | Ökovolt Deutschland",
  description:
    "Wesentliche technische Normen, Sicherheitsrichtlinien und Bauvorschriften für Photovoltaikanlagen in Deutschland – OVE-Normen und aktuelle Sicherheitsanforderungen.",
  keywords: [
    "Photovoltaik Richtlinien",
    "PV-Anlage Normen",
    "Sicherheitsrichtlinien Solar",
    "Technische Normen Photovoltaik",
    "OVE Richtlinien",
  ],
  alternates: {
    canonical: "https://www.oekovolt.de/forderungen/richtlinen",
  },
  openGraph: {
    type: "website",
    url: "https://www.oekovolt.de/forderungen/richtlinen",
    title: "Technische Richtlinien für Photovoltaik | Ökovolt Deutschland",
    description:
      "Technische Normen und Sicherheitsrichtlinien für Photovoltaikanlagen in Deutschland.",
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
      <RichtlinenBannerSection />
      <RichtlinienPV />
      <EndSection />
    </div>
  );
};

export default page;
