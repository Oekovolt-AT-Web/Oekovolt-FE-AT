import RichtlinenBannerSection from "@/components/Forderungen/Richtlinen/banner";
import RichtlinienPV from "@/components/Forderungen/Richtlinen/second";
import EndSection from "@/components/Reusable/end";
import React from "react";

// Revalidate every 1 hour (3600 seconds)
// CMS content doesn't change frequently, so this is optimal
export const revalidate = 3600;

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
  