// referenzen/projekte/page.js

import { ClipboardCheck, Compass, HardHat, Leaf, LineChart, Map as MapIcon, PiggyBank, ShieldCheck, Zap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Reveal from "@/components/ui/Reveal";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Fliesstext from "@/components/Reusable/Fliesstext";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import ProjektPortfolio from "@/components/Project/ProjektPortfolio";
import ReferenzStatistik from "@/components/Project/ReferenzStatistik";
import { bildUrl, fmtKwp, kennzahlen, normalisiereProjekt } from "@/components/Project/projektDaten";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { generateSlug } from "@/lib/slugify";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.referenzen_page.api.get_referenzen`;
const PROJECTS_API = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`;
const PAGE_URL = "https://www.oekovolt.de/referenzen/projekte";

async function fetchProjekteData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
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

async function fetchProjectsList() {
  if (!isApiConfigured()) {
    return [];
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(PROJECTS_API, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      console.error(`Projects API returned ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (Array.isArray(data?.message)) {
      return data.message;
    }
    return [];
  } catch (error) {
    console.error("Error fetching projects list:", error);
    return [];
  }
}

export async function generateMetadata() {
  const seoData = await fetchProjekteData();

  const defaultKeywords = ["Photovoltaik Referenzen", "Solarprojekte", "PV-Anlagen Beispiele", "Ökovolt Projekte", "Energielösungen Referenzen"];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Photovoltaik-Referenzen aus Bayern & Allgäu | Ökovolt",
      description: "Echte Ökovolt-Projekte aus ganz Deutschland: Photovoltaikanlagen auf Einfamilienhäusern und Eigenheimen – sehen Sie selbst, was wir umsetzen. Jetzt ansehen!",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",

        url: PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "Photovoltaik-Referenzen aus Bayern & Allgäu | Ökovolt ",
        description: "Echte Ökovolt-Projekte aus ganz Deutschland: Photovoltaikanlagen auf Einfamilienhäusern und Eigenheimen – sehen Sie selbst, was wir umsetzen. Jetzt ansehen!",
        images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Referenzprojekte" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Photovoltaik-Referenzen aus Bayern & Allgäu | Ökovolt ",
        description: "Echte Ökovolt-Projekte aus ganz Deutschland: Photovoltaikanlagen auf Einfamilienhäusern und Eigenheimen – sehen Sie selbst, was wir umsetzen. Jetzt ansehen!",
        images: ["https://www.oekovolt.de/og-image.jpg"]
      },
    };
  }

  const apiKeywords = seoData?.keywords ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])] : defaultKeywords;
  const title = "Photovoltaik-Referenzen aus Bayern & Allgäu | Ökovolt";
  const description = "Echte Ökovolt-Projekte aus ganz Deutschland: Photovoltaikanlagen auf Einfamilienhäusern und Eigenheimen – sehen Sie selbst, was wir umsetzen. Jetzt ansehen!";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",

      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Referenzprojekte" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.oekovolt.de/og-image.jpg"]
    },
  };
}

const VORTEIL_ICONS = [PiggyBank, Leaf, ShieldCheck, LineChart];

const ABLAUF = [
  { icon: Compass, title: "Analyse", text: "Dach, Verschattung, Stromverbrauch und Ihre Pläne – die Grundlage jeder guten Anlage." },
  { icon: ClipboardCheck, title: "Planung", text: "Modulbelegung, Wechselrichter, Speicher und eine ehrliche Wirtschaftlichkeitsrechnung." },
  { icon: HardHat, title: "Montage", text: "Fachgerechte Installation durch unser Montageteam – sauber und sicher." },
  { icon: Zap, title: "Inbetriebnahme", text: "Anschluss, Anmeldung beim Netzbetreiber und im Marktstammdatenregister." },
];

function faqFuer(k) {
  const spanne = k.kleinste && k.groesste ? `von ${fmtKwp(k.kleinste.kwp)} kWp bis ${fmtKwp(k.groesste.kwp)} kWp` : "vom Einfamilienhaus bis zum Gewerbedach";
  return [
    {
      q: "Welche Anlagengrößen setzt Ökovolt um?",
      a: `Die hier gezeigten Referenzen reichen ${spanne}. Typische Einfamilienhäuser liegen bei etwa 7 bis 16 kWp, Gewerbe- und Landwirtschaftsdächer oft deutlich darüber. Die richtige Größe ergibt sich aus Dachfläche, Stromverbrauch und Ihren Plänen – etwa E-Auto oder Wärmepumpe.`,
    },
    {
      q: "Was bedeutet die Angabe kWp?",
      a: "Kilowatt-Peak (kWp) ist die Nennleistung der Module unter genormten Testbedingungen. Sie macht Anlagen vergleichbar. Als Orientierung erzeugt 1 kWp in Süddeutschland je nach Ausrichtung und Neigung rund 950 bis 1.150 kWh Strom pro Jahr.",
    },
    {
      q: "Eignet sich auch mein Dach – Flachdach, Ziegel oder Trapezblech?",
      a: "In den meisten Fällen ja. Unsere Referenzen umfassen Ziegel- und Satteldächer, Flachdächer mit Ost-West-Aufständerung, Trapez- und Sandwichdächer sowie Fassadenanlagen. Entscheidend sind Statik, Verschattung und der Zustand der Dachhaut – das prüfen wir vor dem Angebot.",
    },
    {
      q: "Plant Ökovolt auch Gewerbe- und Landwirtschaftsanlagen?",
      a: "Ja. Neben Einfamilienhäusern zeigen die Referenzen Hallen, Betriebsgebäude und landwirtschaftliche Dächer. Bei größeren Anlagen gewinnen Eigenverbrauchsprofil, Netzanschluss und die Anmeldung beim Netzbetreiber an Bedeutung – das übernehmen wir aus einer Hand.",
    },
    {
      q: "Wie läuft ein Projekt von der Anfrage bis zur Inbetriebnahme ab?",
      a: "Nach Ihrer Anfrage analysieren wir Dach und Verbrauch, erstellen eine Planung mit Wirtschaftlichkeitsrechnung und ein Angebot. Nach Auftrag folgen Montage, elektrischer Anschluss sowie Anmeldung im Marktstammdatenregister und beim Netzbetreiber. Die Montage selbst dauert beim Einfamilienhaus meist nur wenige Tage.",
    },
    {
      q: "Kann ich mir Anlagen in meiner Nähe ansehen?",
      a: "Auf unserer Referenzkarte sehen Sie, wo wir bereits Anlagen realisiert haben. Viele Projekte liegen im Allgäu, in Schwaben und in Oberbayern rund um unseren Firmensitz in Türkheim. Sprechen Sie uns gern auf vergleichbare Projekte in Ihrer Umgebung an.",
    },
  ];
}

export default async function ProjektePage() {
  const [data, projectsList] = await Promise.all([
    fetchProjekteData(),
    fetchProjectsList(),
  ]);

  const projekte = projectsList.map(normalisiereProjekt).filter((p) => p.slug);
  const k = kennzahlen(projekte);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#collectionpage`,
    url: PAGE_URL,
    name: data?.title || "Referenzprojekte – Ökovolt Deutschland",
    description: data?.description || "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    ...(projectsList.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projectsList.length,
        itemListElement: projectsList.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title || p.name,
          url: `${PAGE_URL}/${(generateSlug(p.title) || generateSlug(p.name))}`,
        })),
      },
    }),
  };

  const vorteile = (data?.third_card_table || []).map((v, i) => ({
    icon: VORTEIL_ICONS[i % VORTEIL_ICONS.length],
    title: v.primary_paragraph,
    text: v.secondary_paragraph,
  }));

  const heroStats = projekte.length
    ? [
        { value: k.anzahl, label: "Referenzprojekte" },
        { value: Math.round(k.summeKwp), suffix: " kWp", label: "dokumentierte Leistung" },
        { value: k.orte, label: "Orte" },
      ]
    : [];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Referenzen", href: "/referenzen/projekte" }, { name: "Projekte" }]}
        eyebrow={data?.title || "Referenzen"}
        title={<>Photovoltaik-Projekte, die <span className="ov-text-gradient-light">heute Strom liefern</span></>}
        lead={data?.description?.trim() || "Erfolgreiche Photovoltaik-Projekte – maßgeschneidert für Privathaushalte, Gewerbe und Landwirtschaft."}
        image={k.groesste?.bilder?.length ? { src: k.groesste.bild, alt: `Photovoltaikanlage ${k.groesste.titel} mit ${k.groesste.leistungText}` } : { src: bildUrl(data?.image, "/Images/Referenzen/projekteBanner.jpg"), alt: data?.alt_image || "Photovoltaikanlage von Ökovolt" }}
        actions={[
          { label: "Eigene Anlage anfragen", href: "/angebot" },
          { label: "Referenzkarte öffnen", href: "/referenzen/referenzkarte", icon: MapIcon },
        ]}
        stats={heroStats}
      />

      {/* Portfolio */}
      <Section tone="sand" space="lg" id="projekte">
        <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Projekte"
            title={<>Echte Anlagen, <span className="ov-text-gradient">echte Kennzahlen</span></>}
            lead="Filtern Sie nach Objektart, Leistung, Dach oder Ort und finden Sie Anlagen, die Ihrem Vorhaben ähneln."
          />
          {data?.first_card_table?.[0]?.option && (
            <p className="hidden text-[16px] leading-relaxed text-ink-600 lg:block lg:pb-1">{data.first_card_table[0].option}</p>
          )}
        </div>
        {projekte.length > 0 ? (
          <ProjektPortfolio projekte={projekte} />
        ) : (
          <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-ink-200">
            <p className="font-display text-[20px] font-bold text-ink-900">Die Projektübersicht wird gerade aktualisiert.</p>
            <p className="mt-2 text-ink-600">Rufen Sie uns an – wir nennen Ihnen gern Referenzen in Ihrer Nähe: 08245 96 788 0.</p>
          </div>
        )}
      </Section>

      {/* Kennzahlen */}
      {projekte.length >= 3 && (
        <Section tone="navy" space="lg" className="overflow-hidden">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div aria-hidden="true" className="absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
          <ReferenzStatistik projekte={projekte} />
        </Section>
      )}

      {/* Technik */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow={data?.second_card_title || "Intelligente Energielösungen"}
          title={data?.second_card_subtitle || "Technik, die mitdenkt"}
          text={data?.second_card_description || "Moderne Systeme steuern Energieflüsse intelligent, erhöhen den Eigenverbrauch und binden Speicher, Wallbox und Wärmepumpe ein."}
          points={(data?.second_card_table || []).map((o) => o.option.replace("Öekovolt", "Ökovolt").replace(/\.$/, ""))}
          image={{
            src: bildUrl(data?.second_card_second_image, "/Images/Referenzen/Projekte-2.jpg"),
            alt: data?.second_card_second_alt_text || "Solarmodule auf einem Dach",
          }}
          action={{ label: "Photovoltaik-Leistungen ansehen", href: "/dienstleistungen/photovoltaik", variant: "secondary" }}
        />
      </Section>

      {/* Vorteile */}
      {vorteile.length > 0 && (
        <Section tone="sand" space="lg">
          <SectionHeading
            eyebrow="Warum Photovoltaik"
            title={data?.third_card_title || "Vorteile einer nachhaltigen Energieversorgung"}
            lead={data?.third_card_description?.trim()}
            align="center"
            className="mb-12"
          />
          <FeatureGrid items={vorteile} cols={4} />
        </Section>
      )}

      {/* Ablauf */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="So entsteht jede Referenz"
              title={data?.fifth_card_title || "Ganzheitliche Planung und Umsetzung"}
            />
            <Fliesstext text={data?.fifth_card_description} className="mt-5 space-y-4 text-[16.5px] leading-relaxed text-ink-600" />
          </div>
          <ol className="relative grid gap-4 sm:grid-cols-2">
            {ABLAUF.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 90} className="relative rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ov-600 shadow-sm ring-1 ring-ov-200">
                    <s.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <span className="ov-num font-display text-[34px] font-extrabold leading-none text-ink-200">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="ov-h3 mt-5 text-ink-900">{s.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <SolarrechnerTeaser
        href="/solarrechner"
        cta="Ertrag berechnen"
        titel="Wie viel kWp passen auf Ihr Dach?"
        text="Dachfläche, Ausrichtung und Verbrauch eingeben – der Solarrechner zeigt Anlagengröße, Jahresertrag, Ersparnis und Amortisation."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Referenzen & Anlagenplanung"
            lead="Ihre Frage ist nicht dabei? Rufen Sie uns an – Mo–Do 8–16 Uhr, Fr 8–13 Uhr."
          />
          <Faq items={faqFuer(k)} />
        </div>
      </Section>

      <Querverweise pfad="/referenzen/projekte" />
      <CtaBand
        eyebrow="Ihr Projekt als nächste Referenz"
        title="Eine Anlage wie diese – für Ihr Dach?"
        text="Wir planen Ihre Photovoltaikanlage so sorgfältig wie jede Referenz auf dieser Seite: mit Vor-Ort-Analyse, ehrlicher Wirtschaftlichkeitsrechnung und festem Ansprechpartner aus Türkheim."
        primary={{ label: "Kostenloses Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
