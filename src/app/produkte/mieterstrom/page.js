// src/app/produkte/mieterstrom/page.js

import React from "react";
import {
  BadgeEuro, Building, Building2, Calculator, ClipboardCheck, FileText, Gauge, Home, Leaf, LineChart, Handshake, Scale, Store, Sun, TrendingUp, Users, Wrench,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import ModellVergleich from "@/components/Mieterstrom/ModellVergleich";
import Rechenbeispiel from "@/components/Mieterstrom/Rechenbeispiel";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.mieterstrom_page.api.get_mieterstrom_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.com/produkte/mieterstrom";

async function fetchMieterstromData() {
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

const TITLE = "Mieterstrom & Gebäudeversorgung fürs MFH | Ökovolt";
const DESCRIPTION =
  "Mieterstrom oder gemeinschaftliche Gebäudeversorgung (§ 42b EnWG): PV-Anlage, Messkonzept & Abrechnung für Vermieter, WEG und Gewerbe. Jetzt Projekt anfragen!";

export async function generateMetadata() {
  const seoData = await fetchMieterstromData();
  const defaultKeywords = ["Mieterstrom", "Gemeinschaftliche Gebäudeversorgung", "Mieterstrom Photovoltaik", "PV Mehrfamilienhaus", "Solarstrom für Mieter"];
  // Nur mieterstrom-relevante Begriffe aus dem Backoffice übernehmen
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/).filter((k) => /mieter|mehrfamilien|wohnung|pv|photovoltaik|solar/i.test(k) && !/finanzier|kredit/i.test(k))
    : [];
  const keywords = [...new Set([...defaultKeywords, ...apiKeywords])];
  const bild = "https://www.oekovolt.com/og-image.jpg";

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: PAGE_URL,
      siteName: "Ökovolt Österreich",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: bild, width: 1200, height: 630, alt: "Ökovolt Mieterstrom" }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [bild] },
  };
}

const img = (p, fallback = "/Images/Referenzen/Projekte-2.jpg") => (p ? `/api/image?path=${p}` : fallback);

const SERVICE_ICONS = [Wrench, Gauge, LineChart, FileText];
const VORTEIL_ICONS = [Building2, TrendingUp, BadgeEuro, Leaf];
const DETAIL_ICONS = [Home, Gauge];

const FALLBACK_SERVICE = [
  { primary_paragraph: "Individuelle Komplettlösungen", description: "Von der Planung bis zur fachgerechten Montage Ihrer Mieterstrom-PV-Anlage." },
  { primary_paragraph: "Modernes Messsystem", description: "Alle Komponenten für eine zuverlässige und rechtskonforme Stromerfassung." },
  { primary_paragraph: "Intuitive Abrechnungssoftware", description: "Mieterstrom-Abrechnungen einfach über ein Online-Portal verwalten." },
  { primary_paragraph: "Abrechnungsservice auf Wunsch", description: "Auf Wunsch übernehmen wir die komplette Abwicklung für Sie." },
];

const FALLBACK_VORTEILE = [
  { title: "Mehr Wert für Ihre Immobilie", description: "Eine PV-Anlage mit Mieterstrom steigert Attraktivität und Marktwert Ihres Mehrfamilienhauses." },
  { title: "Langfristige Kostenvorteile", description: "Die Anlage erzeugt über Jahrzehnte günstigen Solarstrom." },
  { title: "Attraktive Zusatz-Einnahmen", description: "Regelmäßige Einnahmen durch die Stromversorgung Ihrer Mieter." },
  { title: "Aktiver Klimaschutz", description: "Weniger fossile Energie, mehr Nachhaltigkeit – direkt auf Ihrem Dach." },
];

const FAQ = [
  {
    q: "Was ist Mieterstrom?",
    a: "Mieterstrom ist Solarstrom, der auf dem Dach eines Gebäudes erzeugt und ohne Umweg über das öffentliche Netz direkt an die Bewohner geliefert wird. Weil Netzentgelte und einige Umlagen entfallen, kann der Strom günstiger angeboten werden als ein üblicher Haushaltstarif. Der Anbieter liefert zusätzlich den Reststrom und erhält dafür den Mieterstromzuschlag nach § 21 EEG.",
  },
  {
    q: "Was ist die gemeinschaftliche Gebäudeversorgung nach § 42b EnWG?",
    a: "Seit dem Solarpaket I (2024) können Gebäudeeigentümer den Solarstrom nach einem vereinbarten Aufteilungsschlüssel an die Bewohner weitergeben, ohne selbst Stromlieferant mit Vollversorgungspflicht zu werden. Jeder Haushalt behält seinen eigenen Stromvertrag für den Reststrom. Es gibt keinen Mieterstromzuschlag, dafür deutlich weniger Bürokratie. Voraussetzung ist eine viertelstündliche Messung.",
  },
  {
    q: "Welches Modell passt zu meinem Gebäude?",
    a: "Für kleinere Mehrfamilienhäuser, Eigentümergemeinschaften und Gewerbeobjekte ist die gemeinschaftliche Gebäudeversorgung oft die einfachere Wahl. Klassischer Mieterstrom lohnt sich eher bei größeren Objekten oder wenn ein Dienstleister Lieferung und Abrechnung vollständig übernimmt. Wir rechnen beide Varianten für Ihr Objekt durch.",
  },
  {
    q: "Wie hoch ist der Mieterstromzuschlag 2026?",
    a: "Für Anlagen, die ab dem 1. August 2026 in Betrieb gehen, beträgt der Zuschlag 2,51 ct/kWh bis 10 kWp, 2,33 ct/kWh bis 40 kWp und 1,57 ct/kWh bis 1 MW (anteilig je Leistungsstufe). Er wird für den im Gebäude gelieferten Solarstrom gezahlt und sinkt halbjährlich leicht.",
  },
  {
    q: "Müssen alle Mieter mitmachen?",
    a: "Nein. Die Teilnahme ist freiwillig, jeder Haushalt kann seinen Stromanbieter frei wählen. Beim klassischen Mieterstrom darf der Stromvertrag außerdem nicht an den Mietvertrag gekoppelt werden. In der Praxis machen die meisten Haushalte mit, weil der Solarstrom günstiger ist.",
  },
  {
    q: "Funktioniert das auch für WEG und Gewerbeimmobilien?",
    a: "Ja. Eine Wohnungseigentümergemeinschaft kann die Anlage per Beschluss betreiben und die Gebäudeversorgung für Eigentümer und Mieter nutzen. Seit dem Solarpaket I gilt der Mieterstromzuschlag auch für Gewerbegebäude und Nebenanlagen wie Garagen, wenn der Strom ohne Netzdurchleitung verbraucht wird.",
  },
  {
    q: "Was muss ich steuerlich beachten?",
    a: "Das hängt von Ihrer Rechtsform ab. Wohnungsunternehmen mit erweiterter Gewerbesteuerkürzung dürfen Einnahmen aus Stromlieferungen bis zu 10 % der Mieteinnahmen erzielen, ohne die Kürzung zu verlieren. Lassen Sie die Konstellation vorab von Ihrer Steuerberatung prüfen – wir liefern die technischen und wirtschaftlichen Zahlen dazu.",
  },
];

export default async function MieterstromPage() {
  const data = await fetchMieterstromData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Mieterstrom & gemeinschaftliche Gebäudeversorgung | Ökovolt Österreich",
    description: DESCRIPTION,
    isPartOf: { "@id": "https://www.oekovolt.com/#website" },
    about: { "@id": "https://www.oekovolt.com/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${PAGE_URL}/#service`,
    name: "Mieterstrom und gemeinschaftliche Gebäudeversorgung",
    serviceType: "Photovoltaik für Mehrfamilienhäuser mit Messkonzept und Abrechnung",
    provider: { "@id": "https://www.oekovolt.com/#organization" },
    areaServed: { "@type": "Country", name: "Deutschland" },
    audience: { "@type": "BusinessAudience", name: "Vermieter, Wohnungseigentümergemeinschaften und Gewerbeimmobilien" },
  };

  const service = (data?.mieterstorm_first_card_table?.length ? data.mieterstorm_first_card_table : FALLBACK_SERVICE).map((s) => ({
    title: s.primary_paragraph,
    text: s.description,
  }));
  const vorteileVermieter = (data?.mieterstorm_second_card_option_information?.length ? data.mieterstorm_second_card_option_information : FALLBACK_VORTEILE).map(
    (v, i) => ({ icon: VORTEIL_ICONS[i % VORTEIL_ICONS.length], title: v.title, text: v.description })
  );
  const details = data?.mieterstorm_third_card_table || [];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Mieterstrom" }]}
        eyebrow="Für Vermieter, WEG & Gewerbe"
        title={
          data?.mieterstorm_banner_subtitle?.replace(" – ", " – ") || (
            <>
              Solarstrom vom Dach – <span className="ov-text-gradient">direkt an Ihre Mieter</span>
            </>
          )
        }
        lead={
          data?.mieterstorm_banner_description ||
          "Nutzen Sie ungenutzte Dachflächen, steigern Sie die Wirtschaftlichkeit Ihrer Immobilie und bieten Sie Ihren Mietern günstigen Solarstrom."
        }
        image={{ src: img(data?.mieterstorm_first_card_image), alt: data?.mieterstorm_first_card_alt_image || "Mehrfamilienhäuser mit Photovoltaik" }}
        points={["Mieterstrom oder Gebäudeversorgung", "Planung, Montage & Messkonzept", "Abrechnung per Online-Portal", "Für Objekte bis 20 Wohneinheiten"]}
        actions={[
          { label: "Mieterstrom-Projekt anfragen", href: "/angebot" },
          { label: "Modelle vergleichen", href: "#modelle", icon: Scale },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Building2 aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[20px] font-extrabold leading-none text-ink-900">
                bis 20 <span className="text-[14px] font-semibold text-ink-500">Wohneinheiten</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Anlage, Messtechnik & Abrechnung aus einer Hand</p>
            </div>
          </div>
        }
      />

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Für wen" title="Solarstrom teilen – für jede Art von Gebäude" align="center" className="mb-10" />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Building, title: "Vermieter", text: "Zusätzliche Einnahmen aus Ihrem Dach, attraktivere Wohnungen und niedrigere Nebenkosten für Ihre Mieter." },
            { icon: Users, title: "Eigentümergemeinschaften", text: "Die WEG betreibt eine gemeinsame Anlage und verteilt den Solarstrom fair nach Aufteilungsschlüssel." },
            { icon: Store, title: "Gewerbeimmobilien", text: "Büro-, Praxis- oder Ladenflächen mit Solarstrom versorgen – ein echtes Argument bei der Vermietung." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <SplitMedia
          eyebrow={data?.mieterstorm_first_card_title || "Mieterstrom mit Ökovolt"}
          title={data?.mieterstorm_first_card_table_title || "Unser Komplettservice für Ihr Mieterstromvorhaben"}
          image={{ src: img(data?.mieterstorm_banner_image), alt: data?.mieterstorm_banner_alt_image || "Photovoltaikanlage" }}
          text={
            data?.mieterstorm_first_card_description ||
            "Mit dem Mieterstrom-Modell von Ökovolt steigern Sie die Attraktivität Ihrer Immobilie, senken die Nebenkosten Ihrer Mieter und erzielen zusätzliche Einnahmen."
          }
        >
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {service.map((s, i) => {
              const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
              return (
                <li key={s.title} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/70">
                  <Icon aria-hidden="true" className="h-5 w-5 text-ov-600" />
                  <p className="mt-3 font-display text-[16px] font-bold text-ink-900">{s.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{s.text}</p>
                </li>
              );
            })}
          </ul>
        </SplitMedia>
      </Section>

      <Section tone="white" space="lg" id="modelle" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Mieterstrom oder § 42b"
          title={<>Welches Modell passt zu <span className="ov-text-gradient">Ihrem Haus</span>?</>}
          lead="Beim klassischen Mieterstrom werden Sie (oder ein Dienstleister) zum Stromlieferanten. Bei der gemeinschaftlichen Gebäudeversorgung teilen Sie nur den Solarstrom – den Rest liefert weiter der Anbieter jedes Haushalts."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <ModellVergleich />
        </Reveal>
      </Section>

      <Section tone="sand" space="lg" id="rechenbeispiel">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Rechenbeispiel"
            title="Was bringt Solarstrom im eigenen Haus?"
            lead="Im Haus verkaufter Solarstrom bringt ein Vielfaches der Einspeisevergütung – und Ihre Mieter zahlen trotzdem weniger. Spielen Sie mit den Werten."
          />
          <Reveal delay={100} className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
              <p className="text-[12.5px] text-ink-500">Einspeisung 10–40 kWp</p>
              <p className="ov-num mt-1 font-display text-[24px] font-extrabold text-ink-900">6,66 ct</p>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-ov-200">
              <p className="text-[12.5px] text-ov-700">Solarstrom im Haus, z. B.</p>
              <p className="ov-num mt-1 font-display text-[24px] font-extrabold text-ink-900">26 ct</p>
            </div>
          </Reveal>
        </div>
        <Reveal dir="scale">
          <Rechenbeispiel />
        </Reveal>
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Vorteile"
            title={data?.mieterstorm_second_card_title || "Warum eine Mieterstrom-PV-Anlage mit Ökovolt?"}
            lead="Ein Dach, zwei Gewinner: Eigentümer erzielen Erlöse, Bewohner zahlen weniger für ihren Strom."
            className="mb-12"
          />
          <div className="space-y-14">
            <div>
              <p className="mb-5 flex items-center gap-2 font-display text-[18px] font-bold text-white">
                <Building2 aria-hidden="true" className="h-5 w-5 text-ov-300" />
                Für Eigentümer & Vermieter
              </p>
              <FeatureGrid items={vorteileVermieter} cols={4} tone="dark" />
            </div>
            <div>
              <p className="mb-5 flex items-center gap-2 font-display text-[18px] font-bold text-white">
                <Users aria-hidden="true" className="h-5 w-5 text-ov-300" />
                Für Mieter & Bewohner
              </p>
              <FeatureGrid
                cols={4}
                tone="dark"
                items={[
                  { icon: BadgeEuro, title: "Günstiger Strom", text: "Solarstrom vom Dach kostet weniger als ein üblicher Haushaltstarif – beim Mieterstrom gesetzlich gedeckelt." },
                  { icon: Sun, title: "Sonne vom eigenen Haus", text: "Sichtbar erneuerbarer Strom, erzeugt wenige Meter über der eigenen Wohnung." },
                  { icon: Handshake, title: "Freie Wahl", text: "Die Teilnahme ist freiwillig, der Stromvertrag bleibt vom Mietvertrag getrennt." },
                  { icon: ClipboardCheck, title: "Transparente Abrechnung", text: "Klare Verbrauchswerte und nachvollziehbare Abrechnung über das Portal." },
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Vom Dach zur ersten Abrechnung" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: ClipboardCheck, title: "Objekt-Check", text: "Dachfläche, Zählerschrank, Anzahl der Wohneinheiten und Verbrauch – wir prüfen, was Ihr Gebäude hergibt." },
            { icon: Calculator, title: "Modell & Wirtschaftlichkeit", text: "Wir rechnen Mieterstrom und Gebäudeversorgung ehrlich gegeneinander und empfehlen das passende Modell." },
            { icon: Wrench, title: "Planung & Montage", text: "PV-Anlage, Messkonzept und Messtechnik aus einer Hand – inklusive Anmeldung beim Netzbetreiber." },
            { icon: LineChart, title: "Betrieb & Abrechnung", text: "Verbrauchsdaten laufen ins Online-Portal. Die Abrechnung machen Sie selbst – oder wir übernehmen sie." },
          ]}
        />
      </Section>

      {details.length > 0 && (
        <Section tone="sand" space="lg">
          <div className="space-y-24">
            {details.map((d, i) => {
              const Icon = DETAIL_ICONS[i % DETAIL_ICONS.length];
              return (
                <SplitMedia
                  key={d.title}
                  reverse={i % 2 === 1}
                  eyebrow={i === 0 ? "Unsere Lösung" : "Technik"}
                  title={d.title}
                  image={{ src: img(d.image), alt: d.alt_text || d.title }}
                  text={d.description}
                >
                  <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13.5px] font-semibold text-ink-700 ring-1 ring-ink-200/70">
                    <Icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
                    {i === 0 ? "Planung, Umsetzung & Portal" : "Messung in Echtzeit"}
                  </p>
                </SplitMedia>
              );
            })}
          </div>
        </Section>
      )}

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Mieterstrom – kurz & ehrlich beantwortet"
            lead="Rechtliche Details ändern sich regelmäßig. Wir prüfen Ihr Objekt mit Stand 2026 – und rechnen beide Modelle transparent durch."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/produkte/mieterstrom" />
      <CtaBand
        eyebrow="Für Vermieter, WEG & Gewerbe"
        title="Machen Sie Ihr Dach zur Einnahmequelle."
        text="Wir prüfen Ihr Gebäude, vergleichen Mieterstrom und gemeinschaftliche Gebäudeversorgung und setzen Anlage, Messkonzept und Abrechnung um – vom Fachbetrieb aus Türkheim."
        primary={{ label: "Mieterstrom-Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Dachertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
