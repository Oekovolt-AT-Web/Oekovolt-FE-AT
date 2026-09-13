// src/app/produkte/hersteller/page.js

import React from "react";
import Image from "next/image";
import { BatteryCharging, Car, Cpu, Gauge, Headphones, HousePlug, Layers, Leaf, ShieldCheck, Sun, Timer } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import HerstellerFilter from "@/components/Hersteller/HerstellerFilter";
import { herstellerId } from "@/components/Hersteller/ids";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.hersteller_page.api.get_hersteller_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/hersteller";

async function fetchHerstellerData() {
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

const TITLE = "PV-Hersteller: BYD, Fronius, Huawei & Trina | Ökovolt";
const DESCRIPTION =
  "Geprüfte Marken für Ihre Solaranlage: Speicher von BYD & Huawei, Wechselrichter von Fronius & Solis, Module von Trina – nach Kategorie filtern & beraten lassen.";

export async function generateMetadata() {
  const seoData = await fetchHerstellerData();
  const defaultKeywords = ["Photovoltaik Hersteller", "Solarmodule Hersteller", "Stromspeicher Hersteller", "BYD Battery-Box", "Huawei LUNA2000", "Fronius Wechselrichter", "Trina Solar"];
  // Empfehlungsprogramm-Begriffe gehören nicht auf diese Seite
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/).map((k) => k.trim()).filter((k) => k && !/empfehl|prämie|bonus|werben|vorteilswelt/i.test(k))
    : [];
  const keywords = [...new Set([...defaultKeywords, ...apiKeywords])];
  const bild = "https://www.oekovolt.de/og-image.jpg";

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: bild, width: 1200, height: 630, alt: "Ökovolt Photovoltaik Hersteller" }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [bild] },
  };
}

const img = (p, fallback = "/Images/Dienstleistungen/Photovoltaik/montage.png") => (p ? `/api/image?path=${p}` : fallback);

const FAQ = [
  {
    q: "Warum arbeitet Ökovolt nur mit ausgewählten Herstellern?",
    a: "Eine PV-Anlage läuft 25 Jahre und länger. Entscheidend sind deshalb nicht nur Datenblätter, sondern Garantiebedingungen, Ersatzteilversorgung, Service in Deutschland und wie gut Module, Wechselrichter und Speicher zusammenarbeiten. Mit einer überschaubaren Auswahl kennen wir jede Komponente aus der Praxis.",
  },
  {
    q: "Kann ich Hersteller verschiedener Marken kombinieren?",
    a: "Bei Solarmodulen in der Regel problemlos. Wechselrichter und Batteriespeicher müssen dagegen zueinander passen – viele Speicher funktionieren nur mit bestimmten Hybridwechselrichtern. Wir stellen Ihnen ein System zusammen, dessen Komponenten offiziell miteinander kompatibel sind.",
  },
  {
    q: "Welcher Stromspeicher ist der beste?",
    a: "Den einen besten Speicher gibt es nicht. Wichtig sind passende Kapazität, Kompatibilität mit dem Wechselrichter, Erweiterbarkeit, Zellchemie (heute meist Lithium-Eisenphosphat) und Garantiebedingungen. Welche Größe zu Ihrem Verbrauch passt, zeigt unser Stromspeicher-Rechner.",
  },
  {
    q: "Was ist bei der Herstellergarantie wichtig?",
    a: "Achten Sie auf zwei Werte: die Produktgarantie (Material- und Verarbeitungsfehler) und die Leistungsgarantie (garantierte Restleistung von Modulen bzw. Restkapazität von Speichern nach einer bestimmten Zeit). Die genauen Bedingungen unterscheiden sich je Hersteller und Produktserie – wir erläutern sie Ihnen im Angebot.",
  },
  {
    q: "Kann ich eine bestehende Anlage mit anderen Komponenten erweitern?",
    a: "Häufig ja, etwa durch einen AC-gekoppelten Speicher oder einen zusätzlichen Wechselrichter. Wir prüfen Ihre Bestandsanlage und schlagen Komponenten vor, die sich technisch sauber einbinden lassen.",
  },
];

export default async function HerstellerPage() {
  const data = await fetchHerstellerData();

  const kategorien = (data?.hersteller_data_table || [])
    .map((k) => ({
      name: k.hersteller_category,
      hersteller: (k.hersteller_list || []).filter((h) => h?.title && (!h.status || h.status === "Aktiv")),
    }))
    .filter((k) => k.name && k.hersteller.length > 0);
  const alle = kategorien.flatMap((k) => k.hersteller);

  const beschreibung =
    data?.hersteller_description ||
    "Bei Ökovolt steht Qualität an erster Stelle. Wir wählen ausschließlich erprobte, hochwertige Solarprodukte renommierter Marken aus.";
  const saetze = beschreibung.split(/(?<=[.!?])\s+/);
  const lead = saetze.slice(0, 2).join(" ");
  const rest = saetze.slice(2).join(" ");

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.hersteller_title || "Photovoltaik Hersteller & Partner | Ökovolt",
    description: DESCRIPTION,
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    ...(alle.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            name: "Hersteller, die Ökovolt verbaut",
            numberOfItems: alle.length,
            itemListElement: alle.map((h, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: { "@type": "Brand", name: h.title, url: `${PAGE_URL}#${herstellerId(h.title)}` },
            })),
          },
        }
      : {}),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Hersteller" }]}
        eyebrow="Hersteller & Marken"
        title={
          data?.hersteller_title?.replace(" – ", " – ") || (
            <>
              Komponenten führender Marken – <span className="ov-text-gradient">geprüft im Einsatz</span>
            </>
          )
        }
        lead={lead}
        image={{ src: img(data?.hersteller_image), alt: data?.hersteller_alt_image || "Montage von Solarmodulen" }}
        actions={[
          { label: "Angebot mit Markenkomponenten", href: "/angebot" },
          { label: "Marken ansehen", href: "#marken", icon: Layers },
        ]}
        stats={[
          ...(alle.length ? [{ value: alle.length, label: "ausgewählte Marken" }] : []),
          ...(kategorien.length ? [{ value: kategorien.length, label: "Produktkategorien" }] : []),
          { value: 15, suffix: "+", label: "Jahre Erfahrung in der Montage" },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <ShieldCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">Ein System, das zusammenpasst</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Module, Wechselrichter & Speicher aufeinander abgestimmt</p>
            </div>
          </div>
        }
      />

      {alle.length > 0 && (
        <nav aria-label="Marken-Schnellzugriff" className="border-b border-ink-100 bg-white">
          <ul className="ov-container flex flex-wrap items-center justify-center gap-x-2 gap-y-2 py-6 md:justify-between">
            {alle.map((h) => (
              <li key={h.title}>
                <a
                  href={`#${herstellerId(h.title)}`}
                  className="flex h-14 w-[104px] items-center justify-center rounded-xl px-3 opacity-60 grayscale transition-all duration-300 hover:bg-ink-50 hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0 md:w-[120px]"
                >
                  {h.logo_image ? (
                    <Image src={img(h.logo_image)} alt={`${h.title} – zur Markenbeschreibung`} width={110} height={40} className="max-h-9 w-auto object-contain" />
                  ) : (
                    <span className="font-display text-[16px] font-bold text-ink-700">{h.title}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <Section tone="sand" space="lg" id="marken" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Unsere Marken" title={<>Hersteller, die wir <span className="ov-text-gradient">selbst verbauen</span></>} />
          {rest && (
            <Reveal delay={80}>
              <p className="text-[16px] leading-relaxed text-ink-600">{rest}</p>
            </Reveal>
          )}
        </div>
        {kategorien.length > 0 ? (
          <HerstellerFilter kategorien={kategorien} />
        ) : (
          <p className="rounded-3xl bg-white p-8 text-[16px] text-ink-600 ring-1 ring-ink-200/70">
            Die Herstellerübersicht wird gerade aktualisiert. Gern nennen wir Ihnen die passenden Marken für Ihr Projekt persönlich – rufen Sie uns an unter 08245 96 788 0.
          </p>
        )}
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Unsere Auswahlkriterien"
            title="Worauf wir bei jeder Marke achten"
            lead="Ein günstiges Datenblatt nützt wenig, wenn nach acht Jahren kein Ersatzteil mehr lieferbar ist. Deshalb prüfen wir Hersteller nach diesen Kriterien."
            className="mb-12"
          />
          <FeatureGrid
            cols={3}
            tone="dark"
            items={[
              { icon: Timer, title: "Langlebigkeit", text: "Belastbare Produkt- und Leistungsgarantien und Technik, die sich über viele Jahre im Feld bewährt hat." },
              { icon: Cpu, title: "Systemkompatibilität", text: "Module, Wechselrichter, Speicher, Wallbox und Energiemanagement müssen sauber zusammenarbeiten." },
              { icon: ShieldCheck, title: "Sicherheit", text: "Geprüfte Normkonformität, sichere Zellchemie bei Speichern und durchdachter Brandschutz." },
              { icon: Headphones, title: "Service & Ersatzteile", text: "Erreichbarer Herstellersupport und verlässliche Ersatzteilversorgung – auch Jahre nach dem Kauf." },
              { icon: Gauge, title: "Effizienz", text: "Hohe Wirkungsgrade und geringe Verluste, damit aus jedem Sonnenstrahl möglichst viel Strom wird." },
              { icon: Leaf, title: "Preis-Leistung", text: "Wir empfehlen, was sich über die Lebensdauer rechnet – nicht das teuerste oder billigste Produkt." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Vom Produkt zum System"
          title="Wofür wir diese Komponenten einsetzen"
          lead="Die richtige Marke ist nur die halbe Miete – entscheidend ist, wie Module, Speicher und Verbraucher in Ihrem Haus zusammenspielen."
          className="mb-12"
        />
        <FeatureGrid
          cols={4}
          items={[
            { icon: Sun, title: "Photovoltaikanlage", text: "Module und Wechselrichter, geplant für Ihr Dach und Ihren Verbrauch.", href: "/produkte/photovoltaikanlage" },
            { icon: BatteryCharging, title: "Stromspeicher", text: "Solarstrom für Abend und Nacht – in der passenden Größe.", href: "/produkte/stromspeicher" },
            { icon: Car, title: "Wallbox", text: "E-Auto mit Solarüberschuss laden, sauber eingebunden.", href: "/produkte/wallbox" },
            { icon: HousePlug, title: "Smart Energy Home", text: "Alle Komponenten über ein Energiemanagement vernetzt.", href: "/produkte/smartenergyhome" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Hersteller & Komponenten – ehrlich beantwortet"
            lead="Sie haben eine bestimmte Marke im Blick? Sprechen Sie uns an – wir sagen Ihnen offen, ob sie zu Ihrem Projekt passt."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/produkte/hersteller" />
      <CtaBand
        title="Markenqualität, sauber montiert."
        text="Wir stellen Ihnen aus bewährten Herstellern ein System zusammen, das zu Dach, Verbrauch und Budget passt – mit Planung, Montage und Anmeldung aus einer Hand."
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Speichergröße berechnen", href: "/rechner/stromspeicher" }}
      />
    </div>
  );
}
