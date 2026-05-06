import SteuerlichBannerSection from "@/components/Forderungen/Steuerlich/banner";
import TaxTreatmentPV from "@/components/Forderungen/Steuerlich/second";
import EndSection from "@/components/Reusable/end";
import React from "react";

// Always fetch fresh data at request time (API unavailable at build time)
export const dynamic = "force-dynamic";

// Metadata for SEO and browser tab
export const metadata = {
  title: "Steuerlich - Förderungen | Oekovolt Germany",
  description: "Diese Übersicht erläutert die aktuellen steuerrechtlichen Bestimmungen für Photovoltaikanlagen in Deutschland, differenziert nach privaten Betreibern und Unternehmen.",
  keywords: "Photovoltaik, Steuer, Deutschland, Förderungen, Einkommensteuer, Umsatzsteuer",
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
