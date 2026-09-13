// referenzen/referenzkarte/page.js

import { BatteryCharging, Building2, Images, MapPin, PlugZap, Thermometer } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import ReferenzKarte from "@/components/Referenzkarte/ReferenzKarte";
import { STANDORTE } from "@/components/Referenzkarte/standorte";
import ProjektKarte from "@/components/Project/ProjektKarte";
import { ladeProjekte } from "@/components/Project/ladeProjekte";
import { bildUrl, kennzahlen, normalisiereProjekt } from "@/components/Project/projektDaten";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.referenzstandorde_page.api.get_referenzstandorde_page`;
const RK_PAGE_URL = "https://www.oekovolt.de/referenzen/referenzkarte";

async function fetchReferenzkarteData() {
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

const META_TITLE = "Referenzkarte: PV-Anlagen in Ihrer Nähe | Ökovolt";
const META_DESCRIPTION = "Photovoltaik-Referenzen auf der Karte: Anlagen im Allgäu, in Bayern & Österreich mit Entfernung zu Türkheim. Jetzt Anlage in Ihrer Nähe entdecken & anfragen.";

export async function generateMetadata() {
  const seoData = await fetchReferenzkarteData();

  const defaultKeywords = [
    "Photovoltaik Referenzkarte",
    "Solarprojekte Karte",
    "PV-Anlagen Standorte",
    "Ökovolt Referenzen",
    "Energielösungen Standorte",
  ];

  // Process keywords - combine API keywords with defaults if available
  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  const canonical = RK_PAGE_URL;

  return {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords: apiKeywords,
    alternates: { canonical, languages: hreflangLanguages(canonical) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Ökovolt Deutschland",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Referenzkarte – Photovoltaik Standorte Deutschland" }],
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: ["https://www.oekovolt.de/og-image.jpg"]
    },
  };
}

const SZENARIO_ICONS = [BatteryCharging, Thermometer, PlugZap, Building2];

const FAQ = [
  {
    q: "Baut Ökovolt auch in meiner Region?",
    a: "Unser Firmensitz ist in Türkheim im Unterallgäu. Die meisten Referenzen liegen im Allgäu, in Schwaben und Oberbayern, dazu kommen Anlagen am Bodensee, im Salzburger Land, in Vorarlberg und Tirol. Liegt Ihr Ort nicht auf der Karte, fragen Sie trotzdem – wir sagen Ihnen ehrlich, ob wir Ihr Projekt gut betreuen können.",
  },
  {
    q: "Warum ist ein Fachbetrieb aus der Nähe von Vorteil?",
    a: "Kurze Wege erleichtern Vor-Ort-Termine, Montage und spätere Service-Einsätze. Außerdem kennen regionale Betriebe die Anforderungen der örtlichen Netzbetreiber, typische Dachformen und Schneelastzonen – im Voralpenland ein wichtiger Punkt für die Unterkonstruktion.",
  },
  {
    q: "Wie genau sind die Standorte auf der Karte?",
    a: "Die Karte zeigt Orte, keine genauen Adressen – die Privatsphäre unserer Kundinnen und Kunden bleibt gewahrt. Die angegebenen Entfernungen sind Luftlinie ab Türkheim.",
  },
  {
    q: "Warum wird die Karte erst nach einem Klick geladen?",
    a: "Die interaktive Karte bezieht Kartenmaterial von OpenStreetMap. Dabei wird Ihre IP-Adresse an deren Server übertragen. Deshalb sehen Sie zunächst eine datensparsame Vorschau und entscheiden selbst, ob Sie die Detailkarte laden.",
  },
];

export default async function ReferenzkarteSeite() {
  const [data, rohProjekte] = await Promise.all([fetchReferenzkarteData(), ladeProjekte()]);

  const projekte = rohProjekte.map(normalisiereProjekt).filter((p) => p.slug);
  const k = kennzahlen(projekte);
  const projekteJeOrt = projekte.reduce((m, p) => (p.ort ? { ...m, [p.ort]: (m[p.ort] || 0) + 1 } : m), {});
  const neueste = [...projekte].sort((a, b) => (b.jahr || 0) - (a.jahr || 0) || (b.kwp || 0) - (a.kwp || 0)).slice(0, 3);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${RK_PAGE_URL}/#webpage`,
    url: RK_PAGE_URL,
    name: data?.title || "Referenzkarte – Ökovolt Photovoltaik Standorte",
    description: data?.description?.trim() || "Unsere Photovoltaik-Projekte auf der Karte. Entdecken Sie unsere Referenzstandorte in ganz Deutschland.",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntity: {
      "@type": "ItemList",
      name: "Referenzstandorte von Ökovolt",
      numberOfItems: STANDORTE.length,
      itemListElement: STANDORTE.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Place", name: s.label, geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng }, address: { "@type": "PostalAddress", addressLocality: s.label, addressCountry: s.land === "Österreich" ? "AT" : "DE" } },
      })),
    },
  };

  const szenarien = (data?.second_card_table || []).map((s, i) => ({
    icon: SZENARIO_ICONS[i % SZENARIO_ICONS.length],
    title: s.primary_paragraph,
    text: s.secondary_paragraph,
  }));

  const umkreis100 = STANDORTE.filter((s) => s.km <= 100).length;

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Referenzen", href: "/referenzen/projekte" }, { name: "Referenzkarte" }]}
        eyebrow={data?.title || "Referenzstandorte"}
        title={<>Solaranlagen <span className="ov-text-gradient">in Ihrer Nähe</span></>}
        lead="Von Türkheim aus planen und bauen wir Photovoltaikanlagen im Allgäu, in ganz Bayern und darüber hinaus. Die Karte zeigt, wo unsere Anlagen bereits Strom erzeugen – mit Entfernung zu unserem Firmensitz."
        image={{ src: bildUrl(data?.image, "/Images/Referenzen/referenzkarte1.jpg"), alt: data?.alt_image || "Fachkraft kontrolliert Photovoltaik-Modul auf Dach" }}
        actions={[
          { label: "Anlage in Ihrer Nähe anfragen", href: "/angebot" },
          { label: "Zur Karte", href: "#karte", icon: MapPin },
        ]}
        stats={[
          { value: STANDORTE.length, label: "Referenzstandorte" },
          { value: umkreis100, label: "im Umkreis von 100 km" },
          { value: 15, suffix: "+", label: "Jahre Erfahrung" },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-white">
              <MapPin aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[19px] font-extrabold leading-tight text-ink-900">Türkheim</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-500">Firmensitz im Unterallgäu – Planung, Montage & Service</p>
            </div>
          </div>
        }
      />

      {/* Karte */}
      <section id="karte" className="relative scroll-mt-20 overflow-hidden bg-navy-950 py-16 text-white md:py-24">
        <div aria-hidden="true" className="absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-ov-500/15 blur-[130px]" />
        <div className="ov-container relative mb-10 grid items-end gap-6 lg:grid-cols-[1.3fr_1fr]">
          <SectionHeading
            dark
            eyebrow={data?.maps_card_title ? data.maps_card_title.charAt(0) + data.maps_card_title.slice(1).toLowerCase() : "Unsere Standorte"}
            title={data?.maps_card_subtitle || "Regional präsent, überregional aktiv"}
          />
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-white/65 lg:justify-end lg:pb-2">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full border-2 border-white bg-navy-700" /> Firmensitz
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-white bg-ov-500" /> Referenzstandort
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-5 rounded-full border border-dashed border-white/50" /> Umkreis ab Türkheim
            </li>
          </ul>
        </div>
        <div className="relative mx-auto max-w-[92rem] px-3 md:px-6">
          <Reveal dir="scale">
            <ReferenzKarte projekteJeOrt={projekteJeOrt} />
          </Reveal>
        </div>
      </section>

      {/* Einführung */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow={data?.first_card_title ? "Unsere Projekte" : "Referenzen"}
          title={data?.first_card_subtitle || "Unsere Referenzkarte – erfolgreiche Projekte auf einen Blick"}
          text={(data?.first_card_table || []).map((o) => o.option)}
          image={{ src: bildUrl(data?.third_card_first_image, "/Images/Referenzen/referenzkarte2.jpg"), alt: data?.third_card_first_alt_text || "Arbeiter überprüft Solarpanels auf Dach" }}
          action={{ label: "Alle Projekte ansehen", href: "/referenzen/projekte" }}
        />
      </Section>

      {/* Szenarien */}
      {szenarien.length > 0 && (
        <Section tone="sand" space="lg">
          <SectionHeading
            eyebrow="Eigenverbrauch"
            title={data?.second_card_title || "Eigenverbrauch maximieren mit der eigenen PV-Anlage"}
            lead={data?.second_card_description?.trim()}
            align="center"
            className="mb-12"
          />
          <FeatureGrid items={szenarien} cols={4} />
        </Section>
      )}

      {/* Neueste Projekte */}
      {neueste.length > 0 && (
        <Section tone="white" space="lg">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Projekte im Detail"
              title={<>Zuletzt <span className="ov-text-gradient">realisiert</span></>}
              lead={projekte.length ? `${k.anzahl} dokumentierte Projekte mit Bildern, Leistung und Baujahr.` : undefined}
            />
            <Button href="/referenzen/projekte" variant="secondary" icon={Images}>
              Alle Projekte
            </Button>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {neueste.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 90}>
                <ProjektKarte projekt={p} />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* Lösungen */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
        <SplitMedia
          dark
          reverse
          eyebrow={data?.third_card_title || "Solarlösungen"}
          title={data?.third_card_subtitle || "Solarlösungen für Privathaushalte"}
          text={data?.third_card_description}
          points={(data?.third_card_table || []).map((o) => o.option.replace(/\.$/, ""))}
          image={{ src: bildUrl(data?.third_card_second_image, "/Images/Referenzen/referenzkarte3.jpg"), alt: data?.third_card_second_alt_text || "Arbeiter bereitet Solarmodul für Montage vor" }}
          action={{ label: "Anlage in Ihrer Nähe anfragen", href: "/angebot" }}
        />
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Referenzen in Ihrer Region" lead="Sie möchten wissen, ob wir auch bei Ihnen bauen? Rufen Sie uns an: 08245 96 788 0." />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/referenzen/referenzkarte" />
      <CtaBand
        eyebrow="Anlage in Ihrer Nähe"
        title="Ihr Ort fehlt noch auf der Karte? Das ändern wir."
        text="Wir prüfen Ihr Dach, rechnen Ertrag und Wirtschaftlichkeit ehrlich durch und bauen Ihre Anlage mit festem Ansprechpartner aus Türkheim."
        primary={{ label: "Anlage in Ihrer Nähe anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
