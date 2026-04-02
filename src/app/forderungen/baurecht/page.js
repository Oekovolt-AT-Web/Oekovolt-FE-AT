import BaurechtBannerSection from "@/components/Forderungen/Baurecht/banner";
import BaurechtPV from "@/components/Forderungen/Baurecht/second";
import EndSection from "@/components/Reusable/end";
import React from "react";

// Revalidate every 1 hour (3600 seconds)
// CMS content doesn't change frequently, so this is optimal
export const revalidate = 3600;

// Metadata for SEO and browser tab
export const metadata = {
  title: "Baurecht - Förderungen | Oekovolt Germany",
  description: "Dieser Bereich gibt einen Überblick über die baurechtlichen Vorschriften für Photovoltaikanlagen in Deutschland. Behandelt werden Genehmigungspflichten, Bauvorschriften und Abstandsregelungen.",
  keywords: "Photovoltaik, Baurecht, Deutschland, Förderungen, Genehmigung, Bauvorschriften",
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
