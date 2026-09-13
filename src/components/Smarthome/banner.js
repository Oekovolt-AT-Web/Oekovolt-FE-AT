import PhotovoltaikanlageBannerSection from "@/components/Photovoltaik/banner";

// Derselbe Hero wie auf der Photovoltaik-Seite – vorher stand hier ein
// älterer Banner ohne Handlungsaufruf, der auf dem Handy den Text abschnitt.
const VERTRAUEN = [
  "Speicher auch nachrüstbar",
  "Wallbox & Smartmeter",
  "Alles aus einer Hand",
];

const SmarthomeBannerSection = ({ data }) => (
  <PhotovoltaikanlageBannerSection
    data={data}
    dachzeile={["Smarthome & Energiemanagement", "Allgäu & Bayern"]}
    titelFallback="Smarthome-Lösungen – Solarstrom intelligent speichern, laden und steuern"
    textFallback="Stromspeicher, Wallbox, Notstrombox und Smartmeter – abgestimmt auf Ihre Photovoltaikanlage."
    cta={{ href: "/kontakt", label: "Beratung anfragen" }}
    zweitCta={{ href: "/solarrechner", label: "Speicher durchrechnen" }}
    vertrauen={VERTRAUEN}
  />
);

export default SmarthomeBannerSection;
