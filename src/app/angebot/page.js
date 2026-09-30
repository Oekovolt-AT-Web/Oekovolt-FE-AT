import { Suspense } from "react";
import { ClipboardCheck, Handshake, Ruler, Wrench } from "lucide-react";

import Konfigurator from "@/components/Angebot/Konfigurator";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import Kennzahlen from "@/components/Team/Kennzahlen";
import { BASE_URL } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/angebot`;
const TITEL = "PV-Angebot für Betriebe anfragen | Ökovolt";
const BESCHREIBUNG =
  "PV für Gewerbe, Landwirtschaft und Gemeinden in Österreich: Objekt, Fläche, Verbrauch und Netzebene angeben – Ersteinschätzung zu Größe und Ertrag erhalten.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Angebots-Konfigurator" }],
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
  provider: { "@id": `${BASE_URL}/#organization` },
};

const FAQ = [
  { q: "Ist die Anfrage wirklich kostenlos?", a: "Ja. Die Ersteinschätzung, das Beratungsgespräch und das Angebot sind für Sie kostenlos und unverbindlich." },
  { q: "Was passiert nach dem Absenden?", a: "Eine Projektleiterin oder ein Projektleiter von Ökovolt aus Ostermiething meldet sich persönlich, klärt Fläche, Lastgang und Netzanschluss und bereitet auf dieser Grundlage ein individuelles Angebot mit Wirtschaftlichkeitsrechnung und Förderprüfung vor." },
  { q: "Wie genau ist die Ersteinschätzung?", a: "Sie ist ein Richtwert: Für Betriebe legen wir die Anlage eigenverbrauchsorientiert auf etwa 70 % des Jahresverbrauchs aus, begrenzt durch die angegebene Fläche, und rechnen mit dem spezifischen Ertrag je kWp. Verschattung, Statik, Netzanschluss und Ihr Lastgang fließen erst in das verbindliche Angebot ein; Preise nennen wir im Gewerbe erst nach dieser Prüfung." },
  { q: "Welche Unterlagen helfen bei Gewerbeprojekten?", a: "Die letzte Strom- und Netzrechnung (Jahresverbrauch, Netzebene, Leistungspreis), der Lastgang in 15-Minuten-Werten vom Netzbetreiber, Dachpläne oder Fotos sowie Angaben zu Trafo bzw. Zählerplatz. Sie können uns die Unterlagen nach der Anfrage einfach per E-Mail schicken." },
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
              Ihr PV-Projekt in <span className="ov-text-gradient-light whitespace-nowrap">2 Minuten</span> erfasst.
            </h1>
            <p className="ov-lead ov-hero-in mt-6 max-w-2xl text-white/70" style={{ "--ov-delay": "200ms" }}>
              Fünf kurze Fragen zu Vorhaben, Objekt, Fläche, Verbrauch und Netzanschluss – Sie sehen sofort Anlagengröße, Ertrag und Förderkategorie als Richtwert. Für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich; kostenlos und unverbindlich.
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

      {/* Vertrauensband – nur belegte Unternehmensfakten */}
      <section className="border-y border-ink-100 bg-white py-12 md:py-16">
        <div className="ov-container">
          <p className="mb-10 text-center text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Ihr Errichter aus Ostermiething</p>
          <Kennzahlen
            klein
            items={[
              { value: "2012", label: "in Österreich eingetragen", text: "Ökovolt Solartechnik GmbH" },
              { value: 30, suffix: " MWp", label: "allein 2021 errichtet", text: "TOP 3 der IPC-Errichter" },
              { value: 9, label: "Bundesländer", text: "Vor-Ort-Termine in ganz Österreich" },
              { value: 0, suffix: " €", label: "Ersteinschätzung", text: "kostenlos und unverbindlich" },
            ]}
          />
        </div>
      </section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Nach Ihrer Anfrage" title="So geht es weiter" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: Handshake, title: "Persönliches Gespräch", text: "Wir klären Ziele, Lastgang und offene Fragen – telefonisch, per Video oder vor Ort." },
            { icon: Ruler, title: "Standort- & Netzprüfung", text: "Fläche, Statik, Schneelast, Verschattung und Netzanschluss fließen in eine exakte Auslegung ein." },
            { icon: ClipboardCheck, title: "Transparentes Angebot", text: "Verbindliches Angebot mit Wirtschaftlichkeitsrechnung, Förder- und IFB-Prüfung." },
            { icon: Wrench, title: "Bau & Betrieb", text: "Netzantrag, Montage durch den eigenen Fachbetrieb, Inbetriebnahme, Monitoring und Wartung." },
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
