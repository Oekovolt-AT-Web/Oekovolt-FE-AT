import { Suspense } from "react";
import { ClipboardCheck, Handshake, Ruler, Wrench } from "lucide-react";

import Konfigurator from "@/components/Angebot/Konfigurator";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import FeaturedLogos from "@/components/photovoltaikanlage/partners";

const PAGE_URL = "https://www.oekovolt.com/angebot";
const TITEL = "Photovoltaik Angebot anfragen – in 2 Minuten | Ökovolt";
const BESCHREIBUNG =
  "Solaranlage, Speicher, Wallbox oder Wärmepumpe konfigurieren und sofort eine Ersteinschätzung zu Größe, Ertrag und Ersparnis erhalten. Kostenlos & unverbindlich.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: "https://www.oekovolt.com/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Angebots-Konfigurator" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ökovolt Angebots-Konfigurator",
  url: PAGE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  inLanguage: "de-AT",
  description: BESCHREIBUNG,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  provider: { "@id": "https://www.oekovolt.com/#organization" },
};

const FAQ = [
  { q: "Ist die Anfrage wirklich kostenlos?", a: "Ja. Die Ersteinschätzung, das Beratungsgespräch und das Angebot sind für Sie kostenlos und unverbindlich." },
  { q: "Was passiert nach dem Absenden?", a: "Ein Energieberater von Ökovolt meldet sich persönlich bei Ihnen, klärt offene Fragen zu Dach und Verbrauch und bereitet auf dieser Grundlage ein individuelles Angebot vor." },
  { q: "Wie genau ist die Ersteinschätzung?", a: "Sie beruht auf Erfahrungswerten zu Ertrag, Eigenverbrauch und Preisen je kWp. Verschattung, Dachstatik, Zählerschrank und Ihr Verbrauchsprofil fließen erst in das verbindliche Angebot ein." },
  { q: "Was passiert mit meinen Daten?", a: "Wir nutzen Ihre Angaben ausschließlich zur Bearbeitung Ihrer Anfrage und geben sie nicht an Dritte weiter. Details finden Sie in unserer Datenschutzerklärung." },
];

export default function AngebotPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="ov-noise relative isolate overflow-hidden bg-navy-950 pb-40 pt-8 text-white md:pb-48 md:pt-12">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -left-32 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-ov-500/25 blur-[120px]" />
        <div aria-hidden="true" className="absolute -right-20 -top-24 -z-10 h-[380px] w-[380px] rounded-full bg-sun-400/15 blur-[120px]" />
        <div className="ov-container">
          <Breadcrumbs dark items={[{ name: "Angebot anfragen" }]} className="ov-hero-in mb-10" />
          <div className="max-w-3xl">
            <div className="ov-hero-in" style={{ "--ov-delay": "60ms" }}>
              <Eyebrow dark className="mb-5">Angebots-Konfigurator</Eyebrow>
            </div>
            <h1 className="ov-h1 ov-hero-in" style={{ "--ov-delay": "120ms" }}>
              Ihre Solaranlage in <span className="ov-text-gradient-light whitespace-nowrap">2 Minuten</span> konfiguriert.
            </h1>
            <p className="ov-lead ov-hero-in mt-6 max-w-2xl text-white/70" style={{ "--ov-delay": "200ms" }}>
              Fünf kurze Fragen – und Sie sehen sofort, welche Anlagengröße zu Ihnen passt und was sie Ihnen jedes Jahr bringt. Kostenlos, unverbindlich, persönlich betreut.
            </p>
          </div>
        </div>
      </section>

      <div className="ov-container relative z-10 -mt-32 pb-16 md:-mt-40 md:pb-24">
        <div className="ov-hero-in" style={{ "--ov-delay": "260ms" }}>
          <Suspense fallback={<div className="h-[640px] animate-pulse rounded-[2rem] bg-white shadow-xl" />}>
            <Konfigurator />
          </Suspense>
        </div>
      </div>

      <FeaturedLogos />

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Nach Ihrer Anfrage" title="So geht es weiter" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: Handshake, title: "Persönliches Gespräch", text: "Wir klären Ihre Ziele, Ihren Verbrauch und offene Fragen – telefonisch oder vor Ort." },
            { icon: Ruler, title: "Planung Ihrer Anlage", text: "Dachfläche, Ausrichtung und Verschattung fließen in eine exakte Auslegung ein." },
            { icon: ClipboardCheck, title: "Transparentes Angebot", text: "Sie erhalten ein verbindliches Angebot mit Wirtschaftlichkeitsrechnung." },
            { icon: Wrench, title: "Montage & Anmeldung", text: "Unser Team installiert fachgerecht und übernimmt die Anmeldung beim Netzbetreiber." },
          ]}
        />
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Fragen zur Anfrage" title="Gut zu wissen" />
          <Faq items={FAQ} />
        </div>
      </Section>
    </div>
  );
}
