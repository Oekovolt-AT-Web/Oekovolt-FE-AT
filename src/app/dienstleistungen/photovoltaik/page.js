// src/app/dienstleistungen/photovoltaik/page.js
//
// Dienstleistung Photovoltaik – Österreich: Planung, Montage, Netzanschluss
// (Netzzugangsantrag, TOR, Fertigstellungsmeldung, Stromabnehmer/OeMAG) und
// Gewerbe-Projektablauf. Keine Backoffice-Texte mehr (die API lieferte die
// deutsche Seite: Allgäu, Marktstammdatenregister, 0 % USt).

import {
  Activity,
  Calculator,
  ClipboardCheck,
  FileCheck,
  HardHat,
  Layers,
  LineChart,
  PencilRuler,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import FeaturedLogos from "@/components/photovoltaikanlage/partners";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import ZielgruppenWahl from "@/components/Photovoltaik/ZielgruppenWahl";
import ProzessTimeline from "@/components/Photovoltaik/ProzessTimeline";
import KomponentenUebersicht from "@/components/Photovoltaik/KomponentenUebersicht";
import RegionOesterreich from "@/components/Photovoltaik/RegionOesterreich";
import Rahmen2026 from "@/components/Photovoltaik/Rahmen2026";
import { PV_FAQ } from "@/data/photovoltaik-seite";

const PFAD = "/dienstleistungen/photovoltaik";
const PV_PAGE_URL = `${BASE_URL}${PFAD}`;

const META_TITLE = "Photovoltaik planen, errichten, anschließen | Ökovolt";
const META_DESCRIPTION =
  "PV-Anlagen für Betriebe in Österreich: Lastganganalyse, Planung, Montage, Netzzugangsantrag, TOR-konformer Anschluss und Wartung – aus einer Hand.";

export const metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  keywords: ["Photovoltaik Österreich", "PV-Anlage Gewerbe", "Netzzugangsantrag Photovoltaik", "Fertigstellungsmeldung", "TOR Stromerzeugungsanlagen", "Photovoltaik Montage"],
  alternates: { canonical: PV_PAGE_URL, languages: hreflangLanguages(PFAD) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PV_PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Photovoltaik" }],
  },
  twitter: { card: "summary_large_image", title: META_TITLE, description: META_DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const LEISTUNGEN = [
  { icon: LineChart, title: "Lastganganalyse", text: "Auswertung Ihrer Viertelstundenwerte als Grundlage für Anlagengröße, Speicher und Wirtschaftlichkeit." },
  { icon: PencilRuler, title: "Planung & Statik", text: "Belegungsplan, Stringplanung, Tragwerksprüfung sowie Schnee- und Windlast nach ÖNORM B 1991." },
  { icon: FileCheck, title: "Netzzugangsantrag", text: "Antrag beim Netzbetreiber, Klärung von Anschlusspunkt und -leistung, Anforderungen nach TOR." },
  { icon: Layers, title: "Markenkomponenten", text: "Module, Wechselrichter und Speicher von Herstellern mit Service in Österreich – aufeinander abgestimmt." },
  { icon: HardHat, title: "Montage & Elektrotechnik", text: "Montage mit Absturzsicherung, Elektroinstallation nach ÖVE/ÖNORM E 8101 durch unser Elektrotechnik-Gewerbe." },
  { icon: ClipboardCheck, title: "Fertigstellungsmeldung", text: "Prüfung nach ÖVE/ÖNORM EN 62446, Fertigstellungsmeldung, Stromabnehmer und Herkunftsnachweise." },
  { icon: SlidersHorizontal, title: "Parkregler", text: "Eigener EZA-Regler für Einspeiselimit, Blindleistung und Fernsteuerung am Netzanschlusspunkt." },
  { icon: Activity, title: "Monitoring & Wartung", text: "Eigene Fernwartungs- und SCADA-Systeme, Wartungsverträge nach Anlagengröße." },
];

const NETZ = [
  { icon: FileCheck, title: "1 · Netzzugangsantrag", text: "Antrag im Portal des Netzbetreibers mit Datenblättern, Schaltplan und Anschlussleistung. Der Netzbetreiber prüft und bietet einen Netzzugangsvertrag an." },
  { icon: Zap, title: "2 · TOR & Netzebene", text: "Typ A (ab 0,8 kW) oder Typ B (ab 250 kW) nach TOR Stromerzeugungsanlagen; Anschluss je nach Größe auf Netzebene 7, 6 oder 5." },
  { icon: ClipboardCheck, title: "3 · Fertigstellungsmeldung", text: "Nach Errichtung und Prüfung meldet unser Elektrotechniker die Anlage über das Partnerportal des Netzbetreibers fertig." },
  { icon: ShieldCheck, title: "4 · Stromabnehmer & Freigabe", text: "Sie geben den Abnehmer für den Überschuss bekannt – Händler, OeMAG oder PPA. Danach wird die Einspeisung freigegeben." },
];

export default function PhotovoltaikPage() {
  const faqItems = PV_FAQ.map((f) => ({ q: f.frage, a: f.antwort }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PV_PAGE_URL}/#webpage`,
        url: PV_PAGE_URL,
        name: META_TITLE,
        description: META_DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        mainEntity: { "@id": `${PV_PAGE_URL}/#service` },
      },
      {
        "@type": "Service",
        "@id": `${PV_PAGE_URL}/#service`,
        name: "Photovoltaik aus einer Hand – Planung, Montage, Netzanschluss und Service",
        serviceType: "Planung und Errichtung von Photovoltaikanlagen",
        url: PV_PAGE_URL,
        description: META_DESCRIPTION,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
        audience: [
          { "@type": "BusinessAudience", audienceType: "Gewerbe und Industrie" },
          { "@type": "BusinessAudience", audienceType: "Landwirtschaft" },
          { "@type": "Audience", audienceType: "Gemeinden und öffentliche Hand" },
          { "@type": "Audience", audienceType: "Privat (Premium-Wohnhaus, Chalet)" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Leistungen im Photovoltaik-Komplettpaket",
          itemListElement: LEISTUNGEN.map((l) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: l.title, description: l.text },
          })),
        },
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ name: "Dienstleistungen" }, { name: "Photovoltaik", href: PFAD }]}
        eyebrow={`Photovoltaik vom Elektrotechnik-Fachbetrieb aus ${FIRMA.ort}`}
        title={
          <>
            Photovoltaik aus einer Hand – <span className="ov-text-gradient">geplant, errichtet, am Netz</span>
          </>
        }
        lead="Wir planen Photovoltaikanlagen für Betriebe, Landwirtschaft und Gemeinden nach Lastgang, errichten sie mit eigenem Elektrotechnik-Gewerbe und übernehmen den Netzanschluss vom Netzzugangsantrag bis zur Fertigstellungsmeldung. Ein Ansprechpartner, vom ersten Gespräch bis zum laufenden Betrieb."
        image={{ src: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg", alt: "Gewerbegebäude mit Photovoltaikanlagen auf den Flachdächern" }}
        points={["Planung nach Lastgang", "Netzzugangsantrag & TOR", "Fertigstellungsmeldung inklusive", "Monitoring & Wartung"]}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Ertrag berechnen", href: "/solarrechner", icon: Calculator },
        ]}
        badge={
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-600">Ein Ansprechpartner</p>
            <ol className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13.5px] font-semibold text-ink-800">
              {["Planung", "Netz", "Montage", "Betrieb"].map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ov-600 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[12.5px] leading-snug text-ink-500">Seit {FIRMA.gegruendet} in Österreich · alle neun Bundesländer</p>
          </div>
        }
      />

      <FeaturedLogos />

      {/* Zielgruppen */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Für wen wir bauen"
          title={
            <>
              Die passende Anlage <span className="ov-text-gradient">für jeden Standort</span>
            </>
          }
          lead="Gewerbe, Landwirtschaft und Gemeinden stehen im Mittelpunkt – Premium-Wohnhäuser und Chalets planen wir mit derselben Sorgfalt. Jede Anlage folgt dem Verbrauch, nicht einem Schema."
          align="center"
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale">
          <ZielgruppenWahl />
        </Reveal>
      </Section>

      {/* Prozess-Timeline */}
      <Section tone="navy" space="lg" className="ov-noise overflow-clip">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-24 h-[520px] w-[520px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-32 bottom-10 h-[420px] w-[420px] rounded-full bg-navy-400/25 blur-[130px]" />
        <div className="relative">
          <ProzessTimeline />
        </div>
      </Section>

      {/* Netzanschluss */}
      <Section tone="white" space="lg" id="netzanschluss">
        <SectionHeading
          eyebrow="Netzanschluss in Österreich"
          title="Vom Netzzugangsantrag bis zur Einspeisung"
          lead="Der Netzanschluss ist in vielen Projekten der längste Einzelschritt. Wir übernehmen ihn vollständig – von der Antragstellung beim Netzbetreiber bis zur Freigabe der Einspeisung."
          className="mb-12"
        />
        <FeatureGrid items={NETZ} cols={4} />
      </Section>

      {/* Leistungsumfang */}
      <Section tone="sand" space="lg">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Leistungsumfang"
            title={
              <>
                Was im <span className="ov-text-gradient">Komplettpaket</span> enthalten ist
              </>
            }
            className="max-w-2xl"
          />
          <Reveal delay={100}>
            <p className="ov-lead text-ink-600">
              Bei {FIRMA.name} erhalten Sie Analyse, Planung, Montage, Netzanschluss, Inbetriebnahme und Betrieb von einem Elektrotechnik-Fachbetrieb – mit eigenem
              Parkregler und eigener Leittechnik.
            </p>
          </Reveal>
        </div>
        <FeatureGrid items={LEISTUNGEN} cols={4} />
        <div className="mt-14 md:mt-16">
          <Rahmen2026 />
        </div>
      </Section>

      {/* Komponenten */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Komponenten"
          title="Woraus eine hochwertige PV-Anlage besteht"
          lead="Vom Modul bis zum Netzanschlusspunkt – in der Reihenfolge, in der der Strom fließt. Wir kombinieren nur Komponenten, die technisch sauber zusammenarbeiten."
          align="center"
          className="mb-12 md:mb-14"
        />
        <KomponentenUebersicht />
        <Reveal className="mt-10 flex justify-center">
          <Link href="/produkte/photovoltaikanlage" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
            <Wrench aria-hidden="true" className="h-4 w-4" />
            Module, Unterkonstruktion und Wechselrichter im Detail
          </Link>
        </Reveal>
      </Section>

      {/* Region */}
      <Section tone="sand" space="none" className="pb-4 pt-20 md:pb-8 md:pt-32">
        <RegionOesterreich />
      </Section>

      <SolarrechnerTeaser
        titel="Erst rechnen, dann beraten lassen"
        text="Verschaffen Sie sich in einer Minute einen Überblick über Ertrag, Eigenverbrauch und Amortisation – als Orientierung vor dem Projektgespräch."
      />

      {/* FAQ */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Photovoltaik – kurz & ehrlich beantwortet"
            lead={`Ihre Frage ist nicht dabei? Rufen Sie uns an: ${FIRMA.telefon} (${FIRMA.oeffnungszeiten.map((o) => `${o.tage} ${o.zeit}`).join(", ")}).`}
          />
          <Faq items={faqItems} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Ihre PV-Anlage – geplant, errichtet und am Netz aus einer Hand."
        text={`Persönliche Beratung von ${FIRMA.name} aus ${FIRMA.ort} für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich – mit Lastganganalyse und festem Ansprechpartner bis zur Inbetriebnahme.`}
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
