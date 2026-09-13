// dienstleistungen/photovoltaik/page.js
import React from "react";
import {
  Activity,
  BatteryCharging,
  Calculator,
  Car,
  ClipboardCheck,
  FileCheck,
  HandCoins,
  HardHat,
  Layers,
  Leaf,
  MessageSquareText,
  PencilRuler,
  Wrench,
} from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
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
import RegionAllgaeu from "@/components/Photovoltaik/RegionAllgaeu";
import Rahmen2026 from "@/components/Photovoltaik/Rahmen2026";
import { PV_FAQ } from "@/data/photovoltaik-seite";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.photovoltaikanlagen_primary_page.api.get_photovoltaikanlagen`;
const PV_PAGE_URL = "https://www.oekovolt.de/dienstleistungen/photovoltaik";

async function fetchPhotovoltaikData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await response.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

const META_TITLE = "PV-Anlage kaufen im Allgäu – Komplettpaket | Ökovolt";
const META_DESCRIPTION =
  "PV-Anlage für Ihr Zuhause: Planung, Lieferung & Montage aus einer Hand – Ihr Komplettpaket vom erfahrenen Installateur. Jetzt kostenloses Angebot anfordern!";
const DEFAULT_KEYWORDS = ["Photovoltaikanlage", "Solarenergie", "Energiekosten senken", "Photovoltaik Förderung", "Solaranlage"];

export async function generateMetadata() {
  const seoData = await fetchPhotovoltaikData();
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/).filter(Boolean) : DEFAULT_KEYWORDS;

  return {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords,
    alternates: { canonical: PV_PAGE_URL, languages: hreflangLanguages(PV_PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: PV_PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Photovoltaik" }],
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: ["https://www.oekovolt.de/og-image.jpg"],
    },
  };
}

const img = (p, fallback = "/Images/Dienstleistungen/Photovoltaik/house.png") => (p ? `/api/image?path=${p}` : fallback);

// Backoffice-Texte stehen teils in Anführungszeichen – auf der Seite wirkt das wie ein Tippfehler.
const ohneAnfuehrung = (text = "") => text.trim().replace(/^["„“”']+/, "").replace(/["„“”']+$/, "").trim();

// Vorteile aus dem Backoffice: Icon je Titel. Zwei Texte im Backoffice passen
// nicht zum Titel (Fahrrad-/Klimatext unter „Fördermöglichkeiten", Großanlage
// unter „CO₂") – dafür gibt es hier einen korrekten Ersatztext.
const VORTEIL_META = {
  energiekostenreduzieren: { icon: BatteryCharging },
  mobilitätskostenreduzieren: { icon: Car },
  fördermöglichkeiten: {
    icon: HandCoins,
    text: "0 % Umsatzsteuer auf Anlage und Montage, feste Einspeisevergütung über 20 Jahre und regionale Programme – wir zeigen Ihnen im Angebot, was für Sie gilt.",
  },
  "co₂-emissionenreduzieren": {
    icon: Leaf,
    text: "Jede selbst erzeugte Kilowattstunde Solarstrom ersetzt Netzstrom – so leisten Sie jeden Tag einen messbaren Beitrag zum Klimaschutz.",
  },
};
const VORTEILE_FALLBACK = [
  { title: "Energiekosten reduzieren", description: "Ihre PV-Anlage senkt Ihre Stromkosten deutlich – mit einem Speicher nutzen Sie einen großen Teil Ihres Solarstroms selbst." },
  { title: "Mobilitätskosten reduzieren", description: "Mit eigenem Solarstrom laden Sie Ihr E-Auto zuhause günstig und umweltfreundlich." },
  { title: "Fördermöglichkeiten", description: "" },
  { title: "CO₂-Emissionen reduzieren", description: "" },
];

const LEISTUNGEN = [
  { icon: MessageSquareText, title: "Beratung vor Ort", text: "Persönlicher Termin bei Ihnen: Dach, Zählerschrank und Ihre Pläne für Speicher, Wallbox oder Wärmepumpe." },
  { icon: PencilRuler, title: "Planung & Ertragsprognose", text: "Modulbelegung, Anlagengröße und eine transparente Wirtschaftlichkeitsrechnung als Grundlage Ihres Angebots." },
  { icon: Layers, title: "Markenkomponenten", text: "Module, Wechselrichter und Speicher führender Hersteller – sauber aufeinander abgestimmt." },
  { icon: HardHat, title: "Montage durch eigenes Team", text: "Unsere eigenen Monteure setzen die Anlage um – beim Einfamilienhaus meist in ein bis zwei Tagen." },
  { icon: FileCheck, title: "Netzanmeldung", text: "Wir stellen die Netzanfrage beim Netzbetreiber und klären alle Rückfragen für Sie." },
  { icon: ClipboardCheck, title: "Inbetriebnahme & MaStR", text: "Inbetriebnahmeprotokoll, Fertigmeldung und Eintrag ins Marktstammdatenregister gehören dazu." },
  { icon: Activity, title: "Monitoring", text: "Mit Ökosys überwachen wir Ihre Anlage laufend und erkennen Leistungsabfälle frühzeitig." },
  { icon: Wrench, title: "Service & Erweiterung", text: "Wartung und Störungen übernimmt unser eigenes Serviceteam – ebenso spätere Erweiterungen." },
];

export default async function PhotovoltaikPage() {
  const data = await fetchPhotovoltaikData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PV_PAGE_URL}/#webpage`,
    url: PV_PAGE_URL,
    name: data?.title || "Photovoltaik aus einer Hand | Ökovolt Deutschland",
    description: data?.description?.trim() || META_DESCRIPTION,
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    mainEntity: { "@id": `${PV_PAGE_URL}/#service` },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${PV_PAGE_URL}/#service`,
    name: "Photovoltaik aus einer Hand – Planung, Montage, Anmeldung und Service",
    serviceType: "Planung und Installation von Photovoltaikanlagen",
    url: PV_PAGE_URL,
    description:
      "Komplettpaket für Photovoltaikanlagen: Beratung vor Ort, Planung mit Ertragsprognose, Netzanmeldung, Montage durch eigenes Team, Inbetriebnahme mit Eintrag ins Marktstammdatenregister sowie Monitoring und Service.",
    provider: { "@id": "https://www.oekovolt.de/#organization" },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Allgäu" },
      { "@type": "AdministrativeArea", name: "Schwaben" },
      { "@type": "State", name: "Bayern" },
    ],
    audience: [
      { "@type": "Audience", audienceType: "Privathaushalte" },
      { "@type": "Audience", audienceType: "Mehrfamilienhäuser" },
      { "@type": "Audience", audienceType: "Landwirtschaft" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Leistungen im Photovoltaik-Komplettpaket",
      itemListElement: LEISTUNGEN.map((l) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: l.title, description: l.text },
      })),
    },
  };

  const vorteile = (data?.second_card_table?.length ? data.second_card_table : VORTEILE_FALLBACK)
    .map((v) => {
      const meta = VORTEIL_META[(v.title || "").toLowerCase().replace(/\s+/g, "")] || {};
      return { icon: meta.icon || Leaf, title: v.title, text: meta.text || ohneAnfuehrung(v.description) };
    })
    .filter((v) => v.title && v.text);

  const faqItems = PV_FAQ.map((f) => ({ q: f.frage, a: f.antwort }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Dienstleistungen" }, { name: "Photovoltaik", href: "/dienstleistungen/photovoltaik" }]}
        eyebrow="PV-Anlage vom Fachbetrieb aus Türkheim"
        title={
          <>
            Photovoltaik aus einer Hand – <span className="ov-text-gradient">geplant, montiert, angemeldet</span>
          </>
        }
        lead={
          data?.description?.trim() ||
          "Sie möchten eine PV-Anlage kaufen? Wir planen und montieren Ihre Photovoltaikanlage individuell abgestimmt – und kümmern uns um Anmeldung und Service. Ein Ansprechpartner, vom ersten Gespräch bis zum eigenen Solarstrom."
        }
        image={{ src: img(data?.image), alt: data?.alt_image || "Einfamilienhaus mit installierter PV-Anlage auf dem Dach" }}
        points={["Planung mit Ertragsprognose", "Montage durch eigenes Team", "Netzanmeldung & Marktstammdatenregister", "Monitoring & Service"]}
        actions={[
          { label: "Kostenloses Angebot", href: "/angebot" },
          { label: "Ertrag berechnen", href: "/solarrechner", icon: Calculator },
        ]}
        badge={
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-600">Ein Ansprechpartner</p>
            <ol className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13.5px] font-semibold text-ink-800">
              {["Planung", "Montage", "Anmeldung", "Service"].map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ov-600 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[12.5px] leading-snug text-ink-500">Über 15 Jahre Erfahrung · Montage beim EFH meist in 1–2 Tagen</p>
          </div>
        }
      />

      <FeaturedLogos />

      {/* Zielgruppen + Vorteile */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Für wen wir bauen"
          title={
            <>
              Die passende Anlage <span className="ov-text-gradient">für jedes Gebäude</span>
            </>
          }
          lead="Ob Einfamilienhaus, Mehrfamilienhaus oder Hof: Wir planen jede PV-Anlage nach Dach, Verbrauch und Zielen – nicht nach Schema F."
          align="center"
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale">
          <ZielgruppenWahl gruppen={data?.first_card_table} />
        </Reveal>

        {vorteile.length > 0 && (
          <div className="mt-20 md:mt-24">
            <Reveal className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">{data?.second_card_title || "Ihre Vorteile"}</p>
                <h3 className="mt-3 font-display text-[26px] font-extrabold leading-tight tracking-tight text-ink-900 md:text-[32px]">
                  PV-Anlage kaufen und langfristig profitieren
                </h3>
              </div>
            </Reveal>
            <FeatureGrid items={vorteile} cols={4} />
          </div>
        )}
      </Section>

      {/* WOW: Prozess-Timeline */}
      <Section tone="navy" space="lg" className="ov-noise overflow-clip">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-24 h-[520px] w-[520px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-32 bottom-10 h-[420px] w-[420px] rounded-full bg-navy-400/25 blur-[130px]" />
        <div className="relative">
          <ProzessTimeline schritte={data?.fourth_card_information_table || []} />
        </div>
      </Section>

      {/* Leistungsumfang */}
      <Section tone="white" space="lg">
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
              Bei Ökovolt bekommen Sie Beratung, Planung, Montage, Netzanmeldung, Inbetriebnahme und Service von einem
              Fachbetrieb – ohne Subunternehmer-Kette und ohne Behördengänge für Sie.
            </p>
          </Reveal>
        </div>
        <FeatureGrid items={LEISTUNGEN} cols={4} />
        <div className="mt-14 md:mt-16">
          <Rahmen2026 />
        </div>
      </Section>

      {/* Komponenten */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow={data?.third_card_title ? data.third_card_title.charAt(0) + data.third_card_title.slice(1).toLowerCase() : "Komponenten"}
          title={data?.third_card_subtitle || "Woraus eine hochwertige PV-Anlage besteht"}
          lead="Vom Dach bis in die Steckdose – in der Reihenfolge, in der der Strom fließt. Wir kombinieren nur Komponenten, die technisch sauber zusammenarbeiten."
          align="center"
          className="mb-12 md:mb-14"
        />
        <KomponentenUebersicht komponenten={data?.third_card_component_table} />
      </Section>

      {/* Region */}
      <Section tone="white" space="none" className="pb-4 pt-20 md:pb-8 md:pt-32">
        <RegionAllgaeu />
      </Section>

      <SolarrechnerTeaser
        titel="Erst rechnen, dann beraten lassen"
        text="Verschaffen Sie sich in einer Minute Klarheit über Ertrag, Ersparnis und Amortisation für Ihr Dach – als Orientierung vor dem Vor-Ort-Termin."
      />

      {/* FAQ */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Photovoltaik – kurz & ehrlich beantwortet"
            lead="Ihre Frage ist nicht dabei? Rufen Sie uns an: 08245 96 788 0 (Mo–Do 8–16 Uhr, Fr 8–13 Uhr)."
          />
          <Faq items={faqItems} />
        </div>
      </Section>

      <Querverweise pfad="/dienstleistungen/photovoltaik" />
      <CtaBand
        title="Ihre PV-Anlage – geplant, montiert und angemeldet aus einer Hand."
        primary={{ label: "Kostenloses Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
