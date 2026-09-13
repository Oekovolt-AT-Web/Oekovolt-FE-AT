// service/stromtarif/page.js

import React from "react";
import Image from "next/image";
import { Activity, BatteryCharging, Calculator, Car, Check, FileSignature, Gauge, Leaf, PiggyBank, Plug, ShieldAlert, ThermometerSun, TrendingDown, Wifi, X } from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import { getEnergySnapshot } from "@/lib/energy";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Fliesstext from "@/components/Reusable/Fliesstext";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import BoersenpreisChart from "@/components/Stromtarif/BoersenpreisChart";
import LivePreisBadge from "@/components/Stromtarif/LivePreisBadge";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.dynamischer_stromtarif_service_page.api.get_dynamischer_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/service/stromtarif";

async function fetchStromtarifData() {
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

const TITLE = "Dynamischer Stromtarif – live Börsenpreis | Ökovolt";
const DESCRIPTION = "Dynamischer Stromtarif mit Live-Börsenpreis: günstige Stunden erkennen, E-Auto, Speicher & Wärmepumpe smart laden. Jetzt Tarif prüfen & Angebot anfordern!";

export async function generateMetadata() {
  const seoData = await fetchStromtarifData();
  const defaultKeywords = ["Dynamischer Stromtarif", "Flexibler Strompreis", "Stromtarif für PV-Anlagen", "Börsenstrompreis heute", "Energiekosten optimieren"];
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/).filter((k, i, a) => a.indexOf(k) === i) : defaultKeywords;

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Dynamischer Stromtarif" }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ["https://www.oekovolt.de/og-image.jpg"],
    },
  };
}

const img = (p, fallback = "/Images/Dienstleistungen/Service/solar-panel-7518786_1280.jpg") => (p ? `/api/image?path=${p}` : fallback);

const VORTEIL_ICONS = [TrendingDown, Car, Leaf, BatteryCharging];

const VORTEILE_FALLBACK = [
  { title: "Stromkosten senken", description: "Verbrauch gezielt in günstige Stunden legen." },
  { title: "E-Auto günstig laden", description: "Laden, wenn Strom an der Börse wenig kostet." },
  { title: "Solarstrom plus Ökostrom", description: "Eigener Solarstrom, ergänzt durch zertifizierten Ökostrom." },
  { title: "Nachhaltig und zukunftssicher", description: "Strom dann nutzen, wenn viel erneuerbare Energie im Netz ist." },
];

const FAQ = [
  {
    q: "Was ist ein dynamischer Stromtarif?",
    a: "Bei einem dynamischen Stromtarif zahlen Sie für den Energieanteil den Preis der Strombörse (Day-Ahead-Auktion) – abgerechnet je Stunde oder Viertelstunde. Scheint viel Sonne oder weht viel Wind, ist Strom günstig; in Abendspitzen mit wenig erneuerbarer Erzeugung ist er teurer. Die Preise für den Folgetag stehen jeweils ab etwa 13 Uhr fest.",
  },
  {
    q: "Wie setzt sich der Endpreis zusammen?",
    a: "Nur der Energieanteil schwankt. Hinzu kommen Netzentgelte, Steuern, Abgaben und Umlagen, die Marge des Anbieters sowie 19 % Mehrwertsteuer. Diese Bestandteile machen einen großen Teil des Preises aus – deshalb bleibt der Endpreis auch bei negativen Börsenpreisen meist positiv, liegt dann aber deutlich unter einem Festpreis.",
  },
  {
    q: "Brauche ich einen Smart Meter?",
    a: "Ja. Für die stunden- bzw. viertelstundengenaue Abrechnung ist ein intelligentes Messsystem (Smart Meter mit Gateway) nötig. Ohne es kann der Versorger nicht erfassen, wann Sie wie viel Strom verbraucht haben. Wir beraten Sie gern zum Einbau.",
  },
  {
    q: "Für wen lohnt sich ein dynamischer Tarif?",
    a: "Vor allem für Haushalte mit großen, zeitlich flexiblen Verbrauchern: E-Auto mit Wallbox, Wärmepumpe oder Stromspeicher, idealerweise mit Energiemanagement, das automatisch in günstigen Stunden lädt. Ein Haushalt ohne solche Verbraucher, der vor allem abends Strom braucht, profitiert dagegen oft kaum.",
  },
  {
    q: "Welche Risiken gibt es?",
    a: "Die Preise können – besonders an windarmen Winterabenden – deutlich über einem Festpreis liegen. Wer seinen Verbrauch nicht verschieben kann, zahlt dann mehr. Ein Energiemanagement, das Preisspitzen meidet, und ein Blick auf die Kündigungsfrist des Tarifs senken dieses Risiko.",
  },
  {
    q: "Muss jeder Stromanbieter einen dynamischen Tarif anbieten?",
    a: "Ja. Seit dem 1. Januar 2025 sind alle Stromlieferanten nach § 41a EnWG verpflichtet, Kunden mit intelligentem Messsystem einen dynamischen Stromtarif anzubieten. Die Tarife unterscheiden sich aber deutlich bei Grundgebühr und Aufschlag – ein Vergleich lohnt sich.",
  },
  {
    q: "Passt ein dynamischer Tarif zu meiner PV-Anlage?",
    a: "Sehr gut sogar: Tagsüber nutzen Sie Ihren eigenen Solarstrom, für den Reststrom – etwa im Winter oder nachts – greifen Sie auf günstige Börsenstunden zurück. Mit einem Speicher, der bei niedrigen Preisen auch aus dem Netz nachladen darf, holen Sie zusätzlich mehr heraus.",
  },
];

export default async function StromtarifPage() {
  const [data, snapshot] = await Promise.all([
    fetchStromtarifData(),
    getEnergySnapshot().catch((e) => {
      console.error("energy snapshot:", e?.message);
      return null;
    }),
  ]);

  const chartStart = snapshot
    ? { quelle: snapshot.preis.quelle, aufloesungMin: snapshot.preis.aufloesungMin, punkte: snapshot.preis.punkte, stand: snapshot.stand }
    : { quelle: null, aufloesungMin: 15, punkte: [], stand: null };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.dynami_title || "Dynamischer Stromtarif für PV-Anlagen",
    description: DESCRIPTION,
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Day-Ahead-Börsenstrompreis Deutschland (DE-LU) – heute und morgen",
    description: "Stündlich gemittelter Day-Ahead-Strompreis der Gebotszone Deutschland-Luxemburg, live aktualisiert.",
    url: `${PAGE_URL}#boersenpreis`,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: { "@type": "Organization", name: "Fraunhofer ISE – Energy-Charts", url: "https://www.energy-charts.info" },
    temporalCoverage: snapshot?.stand ? snapshot.stand.split("T")[0] : undefined,
    variableMeasured: "Strompreis in ct/kWh",
  };

  const vorteile = (data?.dynami_first_card_table?.length ? data.dynami_first_card_table : VORTEILE_FALLBACK).map((v, i) => ({
    icon: VORTEIL_ICONS[i % VORTEIL_ICONS.length],
    title: v.title.trim(),
    text: v.description,
  }));
  const vorteileDunkel = (data?.dynami_fifth_card_table || []).map((v, i) => ({
    icon: [PiggyBank, Gauge, Plug, FileSignature][i % 4],
    title: v.title.trim(),
    text: v.description,
  }));
  const schritte = (data?.dynami_fourth_card_options_table || []).map((s) => ({
    title: s.title.replace(/^\d+\.\s*/, "").trim(),
    text: s.description,
  }));
  const voraussetzungen = data?.dynami_sixth_card_table || [
    { title: "Intelligenter Stromzähler (Smart Meter)", description: "Erfasst Ihren Verbrauch viertelstündlich – Grundlage der dynamischen Abrechnung." },
    { title: "Stabile Internetverbindung", description: "Für den sicheren Datenaustausch des Smart Meters." },
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Dynamischer Stromtarif" }]}
        eyebrow="Dynamischer Stromtarif"
        title={<>Strom nutzen, wenn er <span className="ov-text-gradient">günstig</span> ist</>}
        lead={data?.dynami_description || "Mit einem dynamischen Stromtarif profitieren Sie von zeitabhängigen Börsenpreisen – ideal für Zeiten, in denen Ihre Photovoltaikanlage nicht genügend Energie liefert."}
        image={{ src: img(data?.dynami_image), alt: data?.dynami_image_alt_text || "Solarpark aus der Luft" }}
        points={["Stündliche Börsenpreise", "Ideal mit PV, Speicher & E-Auto", "100 % Ökostrom aus dem Netz", "Wechsel übernehmen wir"]}
        actions={[
          { label: "Tarif-Angebot anfragen", href: "/angebot" },
          { label: "Ersparnis berechnen", href: "/rechner/dynamischer-stromtarif", icon: Calculator },
        ]}
        badge={<LivePreisBadge startwert={snapshot?.preis?.aktuell?.eurMwh ?? null} />}
      />

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Einfach erklärt"
          title={data?.dynami_second_card_title || "Dynamischer Strompreis einfach erklärt"}
          image={{ src: img(data?.dynami_second_card_image), alt: data?.dynami_second_card_image_alt_text || "" }}
        >
          <Fliesstext
            text={data?.dynami_second_card_description || "Ein dynamischer Tarif passt den Strompreis an die aktuelle Marktsituation an – abhängig von Angebot und Nachfrage. Ist viel grüner Strom verfügbar, sinkt der Preis."}
            className="mt-5 text-[16.5px] leading-relaxed text-ink-600"
          />
        </SplitMedia>
      </Section>

      <Section tone="sand" space="lg" id="boersenpreis" className="scroll-mt-24">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SectionHeading
            eyebrow="Live-Daten"
            title={<>So schwankt der Strompreis – <span className="ov-text-gradient">heute</span></>}
            lead="Die Day-Ahead-Börse legt für jede Stunde einen eigenen Preis fest. Grüne Balken zeigen das günstigste 3-Stunden-Fenster – genau dann lohnt es sich, das E-Auto zu laden, den Speicher zu füllen oder die Waschmaschine zu starten."
          />
          <Reveal delay={120} className="lg:justify-self-end">
            <ul className="space-y-3 text-[15px] text-ink-700">
              {(data?.dynami_third_card_table || []).slice(0, 3).map((o) => (
                <li key={o.options} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-100 text-ov-700">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed">{o.options.trim()}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal dir="scale">
          <BoersenpreisChart initial={chartStart} />
        </Reveal>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Ihre Vorteile"
          title={data?.dynami_third_card_title || "Nutzen Sie flexible Strompreise mit Ökovolt"}
          lead="Ein dynamischer Tarif ist kein Selbstläufer – aber mit den richtigen Verbrauchern ein echter Hebel."
          className="mb-12"
        />
        <FeatureGrid items={vorteile} cols={4} />
      </Section>

      {/* Ehrliche Einordnung */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Ehrlich eingeordnet"
          title="Lohnt sich ein dynamischer Tarif für Sie?"
          lead="Entscheidend ist, wie viel Verbrauch Sie in günstige Stunden verschieben können."
          align="center"
          className="mb-12"
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal dir="left">
            <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-ov-200 md:p-9">
              <p className="flex items-center gap-3 font-display text-[20px] font-extrabold text-ink-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ov-500 text-white"><Check aria-hidden="true" className="h-5 w-5" strokeWidth={3} /></span>
                Passt gut, wenn …
              </p>
              <ul className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-ink-700">
                <li className="flex gap-3"><Car aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />Sie ein E-Auto zu Hause laden und die Ladezeit flexibel ist.</li>
                <li className="flex gap-3"><ThermometerSun aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />eine Wärmepumpe mit Pufferspeicher im Haus arbeitet.</li>
                <li className="flex gap-3"><BatteryCharging aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />ein Stromspeicher bei niedrigen Preisen nachladen kann.</li>
                <li className="flex gap-3"><Activity aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />ein Energiemanagement die Geräte automatisch steuert.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal dir="right">
            <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-ink-200/70 md:p-9">
              <p className="flex items-center gap-3 font-display text-[20px] font-extrabold text-ink-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-200 text-ink-700"><X aria-hidden="true" className="h-5 w-5" strokeWidth={3} /></span>
                Weniger geeignet, wenn …
              </p>
              <ul className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-ink-700">
                <li className="flex gap-3"><ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />Ihr Verbrauch fast nur in den teuren Abendstunden anfällt.</li>
                <li className="flex gap-3"><Gauge aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />noch kein intelligentes Messsystem eingebaut werden kann.</li>
                <li className="flex gap-3"><PiggyBank aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />Sie absolute Planbarkeit wie beim Festpreis wünschen.</li>
                <li className="flex gap-3"><Plug aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />der Jahresverbrauch sehr gering ist – dann überwiegt oft die Grundgebühr.</li>
              </ul>
            </div>
          </Reveal>
        </div>
        <Reveal className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="max-w-xl text-[15px] text-ink-600">Mit Ihren eigenen Verbrauchsdaten rechnet der Tarif-Rechner in einer Minute durch, was Sie gegenüber Ihrem Festpreis sparen könnten.</p>
          <Button href="/rechner/dynamischer-stromtarif" variant="navy" icon={Calculator}>Zum Tarif-Rechner</Button>
        </Reveal>
      </Section>

      {vorteileDunkel.length > 0 && (
        <Section tone="navy" space="lg" className="overflow-hidden">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
          <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeading dark eyebrow="Mit Ökovolt" title={data?.dynami_fifth_card_title || "Warum ein dynamischer Stromtarif mit Ökovolt Sinn macht"} />
              {data?.dynami_fifth_card_image && (
                <Reveal dir="left" className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[2rem] lg:block">
                  <Image src={img(data.dynami_fifth_card_image)} alt={data.dynami_fifth_card_alt_text || ""} fill sizes="40vw" className="object-cover" />
                </Reveal>
              )}
            </div>
            <FeatureGrid items={vorteileDunkel} cols={2} tone="dark" />
          </div>
        </Section>
      )}

      {schritte.length > 0 && (
        <Section tone="white" space="lg">
          <SectionHeading
            eyebrow="So einfach geht's"
            title={data?.dynami_fourth_card_table || "In drei Schritten zum Ökovolt-Tarif"}
            align="center"
            className="mb-14"
          />
          <Steps items={schritte} />
        </Section>
      )}

      <Section tone="sand" space="lg">
        <SplitMedia
          reverse
          eyebrow="Voraussetzungen"
          title={data?.dynami_sixth_card_title || "Was brauchen Sie für den dynamischen Stromtarif?"}
          image={{ src: img(data?.dynami_sixth_card_image), alt: data?.dynami_sixth_card_alt_image || "" }}
        >
          <ul className="mt-7 space-y-4">
            {voraussetzungen.map((v, i) => {
              const Icon = i === 0 ? Gauge : Wifi;
              return (
                <li key={v.title} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span>
                    <strong className="block font-display text-[17px] text-ink-900">{v.title.trim()}</strong>
                    <span className="mt-1 block text-[15px] leading-relaxed text-ink-600">{v.description}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 text-[14.5px] leading-relaxed text-ink-600">
            Noch kein intelligentes Messsystem? Alles zu Einbau und Kosten lesen Sie auf unserer Seite zum{" "}
            <a href="/produkte/smartmeter" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">Smart Meter</a>.
          </p>
        </SplitMedia>
      </Section>

      <SolarrechnerTeaser
        href="/rechner/dynamischer-stromtarif"
        cta="Zum Tarif-Rechner"
        titel="Was spart ein dynamischer Tarif bei Ihnen?"
        text="Verbrauch, E-Auto, Wärmepumpe und Speicher eingeben – der Rechner vergleicht Ihren Festpreis mit einem dynamischen Tarif."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Dynamischer Stromtarif – kurz & ehrlich beantwortet"
            lead="Sie möchten wissen, ob sich der Tarif mit Ihrer Anlage rechnet? Wir prüfen es gern mit Ihnen."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/service/stromtarif" />
      <CtaBand
        title="Solarstrom am Tag, Börsenstrom zur günstigsten Stunde."
        text="Wir kombinieren Ihre PV-Anlage, Speicher, Wallbox und Wärmepumpe mit dem passenden Tarif – und übernehmen den Anbieterwechsel für Sie."
        primary={{ label: "Tarif-Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Ersparnis berechnen", href: "/rechner/dynamischer-stromtarif" }}
      />
    </div>
  );
}
