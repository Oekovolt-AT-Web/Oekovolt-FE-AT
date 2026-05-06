import RichtlinenBannerSection from "@/components/Forderungen/Richtlinen/banner";
import RichtlinienPV from "@/components/Forderungen/Richtlinen/second";
import EndSection from "@/components/Reusable/end";
import React from "react";

// Always fetch fresh data at request time (API unavailable at build time)
export const dynamic = "force-dynamic";

// Metadata for SEO and browser tab
export const metadata = {
  title: "Richtlinien - Förderungen | Oekovolt Germany",
  description: "Diese Übersicht fasst die wesentlichen technischen Normen, Sicherheitsrichtlinien und Bauvorschriften für Photovoltaikanlagen in Deutschland zusammen.",
  keywords: "Photovoltaik, Richtlinien, Normen, Deutschland, Förderungen, OVE, Sicherheit",
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
  