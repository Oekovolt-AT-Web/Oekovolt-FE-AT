import ContactSection from "@/components/Kontakt/address";
import ContactForm from "@/components/Kontakt/contactForm";
import Map from "@/components/Kontakt/map";
import TeamBanner from "@/components/Reusable/teamBanner";

export const metadata = {
  title: "Kontaktieren Sie uns",
  description:
    "Kontaktieren Sie ÖKOVOLT Deutschland für professionelle Beratung und Unterstützung rund um Photovoltaik-Lösungen. Erreichen Sie uns per Telefon, E-Mail oder über unser Kontaktformular. Wir sind Montag bis Freitag für Sie da, um Ihre Fragen zu beantworten.",
  keywords: [
    "Kontakt ÖKOVOLT",
    "ÖKOVOLT Anfrage",
    "Photovoltaik Beratung",
    "Solaranlagen Kontakt",
    "ÖKOVOLT Deutschland",
  ],
  alternates: {
    canonical: "https://www.oekovolt.de/kontakt",
  },
  openGraph: {
    type: "website",
    url: "https://www.oekovolt.de/kontakt",
    title: "Kontaktieren Sie uns | Ökovolt Deutschland",
    description:
      "Kontaktieren Sie ÖKOVOLT Deutschland für professionelle Beratung rund um Photovoltaik-Lösungen. Wir sind Montag bis Freitag für Sie da.",
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

export default function KontaktPage() {
  const data = {
    title: "Kontaktieren Sie uns",
    img: "/Images/Kontakt/download.jpg",
    description: "Wir freuen uns darauf, von Ihnen zu hören – Ihr direkter Draht zu unseren Experten.",
  };

  return (
    <div>
      <TeamBanner data={data} />
      <ContactSection /> 
      <Map />
      <ContactForm />
     
    </div>
  );
}
