// produkte/warmepumpe/page.js

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  ClipboardList,
  FileCheck2,
  Leaf,
  MapPin,
  Settings2,
  Snowflake,
  Sparkles,
  Sun,
  ThermometerSun,
  TrendingDown,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import { generateSlug } from "@/lib/slugify";
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
import Querverweise from "@/components/Reusable/Querverweise";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Heizkostenvergleich from "@/components/Warmepumpe/Heizkostenvergleich";
import SonnenJahr from "@/components/Warmepumpe/SonnenJahr";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.waermepumpe_page.api.get_waermepumpe_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/warmepumpe";

async function fetchWaermepumpeData() {
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

const TITLE = "Wärmepumpe mit Photovoltaik – Kosten & Förderung | Ökovolt";
const DESCRIPTION =
  "Wärmepumpe mit Solaranlage kombinieren: Heizkosten senken und bis zu 70 % KfW-Zuschuss nutzen. Planung, Installation & Förderservice vom Fachbetrieb.";
const DEFAULT_KEYWORDS = ["Wärmepumpe", "Wärmepumpe mit Photovoltaik", "Wärmepumpe Förderung", "Heizkosten senken", "Luft-Wasser-Wärmepumpe"];

export async function generateMetadata() {
  const seoData = await fetchWaermepumpeData();
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : DEFAULT_KEYWORDS;

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
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Wärmepumpe" }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ["https://www.oekovolt.de/og-image.jpg"],
    },
  };
}

const img = (p, fallback = "/Images/Jobs/renewable-energy-eco-technology-electric-power-fl-2025-01-29-12-30-39-utc.jpg") => (p ? `/api/image?path=${p}` : fallback);
const VORTEIL_ICONS = [Wrench, TrendingDown, Leaf, Snowflake];
const PARTNER_ICONS = [Zap, BadgeCheck, Sun, Users, MapPin, Settings2];

// KfW-Heizungsförderung (BEG EM, Programm 458) – Stand 2026, Orientierung
const FOERDERUNG = [
  // Richtlinie seit 21.07.2026 (Quelle: ADAC, Stand 09/2026). Effizienzbonus entfallen.
  { label: "Grundförderung", prozent: 30, text: "für alle Antragsteller (laut Planung ab 2027 nur noch 15 %)", farbe: "bg-ov-600" },
  { label: "Klimageschwindigkeitsbonus", prozent: 16, text: "Tausch alter Öl-, Gas-, Kohle- oder Nachtspeicherheizung im selbst genutzten Eigentum; sinkt halbjährlich um 4 Punkte", farbe: "bg-ov-400" },
  { label: "Einkommensbonus", prozent: 40, text: "40 % bis 30.000 €, 30 % bis 40.000 €, 10 % bis 50.000 € zu versteuerndes Haushaltseinkommen (Selbstnutzer)", farbe: "bg-navy-500" },
];

const FAQ = [
  {
    q: "Lohnt sich eine Wärmepumpe auch im Altbau?",
    a: "Oft ja. Entscheidend ist nicht das Baujahr, sondern die nötige Vorlauftemperatur. Kommt das Haus an kalten Tagen mit rund 55 °C aus, arbeitet eine moderne Luft-Wasser-Wärmepumpe meist wirtschaftlich – häufig reicht der Tausch einzelner Heizkörper. Wir prüfen das mit einer Heizlastberechnung vor Ort, statt zu schätzen.",
  },
  {
    q: "Was kostet eine Wärmepumpe 2026?",
    a: "Eine Luft-Wasser-Wärmepumpe für ein Einfamilienhaus kostet inklusive Installation als Orientierung meist rund 25.000 bis 40.000 € vor Förderung, Erdwärmepumpen wegen der Bohrung deutlich mehr. Mit dem KfW-Zuschuss von in der Regel bis zu 70 % der förderfähigen Kosten sinkt der Eigenanteil erheblich. Den genauen Preis nennen wir nach dem Vor-Ort-Termin.",
  },
  {
    q: "Welche Förderung gibt es 2026 für Wärmepumpen?",
    a: "Die KfW fördert den Heizungstausch (Programm 458) seit dem 21. Juli 2026 mit 30 % Grundförderung, 16 % Klimageschwindigkeitsbonus beim Tausch einer alten fossilen Heizung und einem einkommensabhängigen Bonus von 40, 30 oder 10 %. Zusammen sind in der Regel maximal 70 % möglich, bei zu versteuerndem Haushaltseinkommen bis 30.000 € bis 80 % – bezogen auf höchstens 28.000 € förderfähige Kosten für die erste Wohneinheit, also bis zu 22.400 €. Der frühere Effizienzbonus ist entfallen. Wichtig: Der Antrag muss vor Vorhabenbeginn gestellt werden; der Vertrag mit dem Fachbetrieb enthält dafür eine aufschiebende Bedingung. Konditionen ändern sich – wir prüfen den aktuellen Stand für Sie.",
  },
  {
    q: "Wie viel Solarstrom kann meine Wärmepumpe nutzen?",
    a: "Realistisch sind rund 20 bis 35 % des Wärmepumpenstroms aus der eigenen PV-Anlage. Im Sommer, in der Übergangszeit und bei der Warmwasserbereitung passt das sehr gut, im Winter liefert das Dach wenig. Mit Speicher, SG-Ready-Steuerung und einem Pufferspeicher lässt sich der Anteil steigern.",
  },
  {
    q: "Brauche ich einen speziellen Stromtarif für die Wärmepumpe?",
    a: "Nicht zwingend, aber es lohnt sich meist. Als steuerbare Verbrauchseinrichtung nach § 14a EnWG erhalten Sie reduzierte Netzentgelte – pauschal oder über einen separat gemessenen, günstigeren Wärmepumpenstrom. Im Gegenzug darf der Netzbetreiber die Leistung in seltenen Engpässen vorübergehend drosseln, eine Mindestleistung bleibt immer garantiert.",
  },
  {
    q: "Wie laut ist eine Luft-Wärmepumpe?",
    a: "Moderne Außengeräte sind im Normalbetrieb leise, vergleichbar mit einem Kühlschrank in einigen Metern Abstand. Entscheidend sind Aufstellort und Abstand zum Nachbarn: Wir planen die Position so, dass die Grenzwerte der TA Lärm eingehalten werden, und achten auf schallreflektierende Wände.",
  },
  {
    q: "Kann eine Wärmepumpe im Sommer auch kühlen?",
    a: "Viele Luft-Wasser-Wärmepumpen sind reversibel und können über die Fußbodenheizung oder Gebläsekonvektoren leicht kühlen. Mit Solarstrom vom Dach ist das besonders günstig, weil der Kühlbedarf genau dann entsteht, wenn die Anlage am meisten liefert.",
  },
];

export default async function WarmepumpePage() {
  const data = await fetchWaermepumpeData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de-DE",
        isPartOf: { "@id": "https://www.oekovolt.de/#website" },
        about: { "@id": `${PAGE_URL}/#service` },
        datePublished: "2020-01-01",
        dateModified: new Date().toISOString().split("T")[0],
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}/#service`,
        name: "Wärmepumpe mit Photovoltaik",
        serviceType: "Planung, Installation und Förderservice für Wärmepumpen",
        description: "Beratung, Heizlastberechnung, Installation und Inbetriebnahme von Wärmepumpen inklusive Einbindung in die Photovoltaikanlage und Unterstützung beim KfW-Förderantrag.",
        provider: { "@id": "https://www.oekovolt.de/#organization" },
        areaServed: { "@type": "Country", name: "Deutschland" },
        url: PAGE_URL,
      },
    ],
  };

  const vorteile = (data?.warmepumpe_first_table || []).map((o, i) => ({
    icon: VORTEIL_ICONS[i % VORTEIL_ICONS.length],
    title: o.title,
    text: o.description,
  }));
  const marken = (data?.warmepumpe_third_card_options_table || []).filter((m) => m.title && m.status !== "Passiv");
  const finanzOptionen = data?.warmepumpe_fourth_card_options_table || [];
  const partnerPunkte = (data?.waermepumpe_fifth_card_options_table || []).map((o, i) => ({
    icon: PARTNER_ICONS[i % PARTNER_ICONS.length],
    title: (o.primary_text || "").trim(),
    text: o.secondary_text,
  }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Produkte" }, { name: "Wärmepumpe" }]}
        eyebrow="Wärmepumpe + Photovoltaik"
        title={
          <>
            Heizen mit <span className="ov-text-gradient">eigenem Sonnenstrom</span>
          </>
        }
        lead={
          data?.warmepumpe_subtitle
            ? `${data.warmepumpe_subtitle}. Wir planen, installieren und binden Ihre Wärmepumpe in die PV-Anlage ein – inklusive Förderservice.`
            : "Mit einer Wärmepumpe machen Sie sich unabhängig von Öl und Gas – mit Ihrer PV-Anlage heizen Sie zu einem guten Teil mit eigenem Strom. Planung, Installation und Förderservice aus einer Hand."
        }
        image={{ src: img(data?.warmepumpe_banner_image), alt: data?.warmepumpe_alt_text_image_banner || "Luft-Wärmepumpe vor einem Einfamilienhaus" }}
        points={["Bis zu 70 % KfW-Zuschuss", "Heizlastberechnung vor Ort", "Einbindung in Ihre PV-Anlage", "Markengeräte"]}
        actions={[
          { label: "Wärmepumpen-Angebot anfragen", href: "/angebot" },
          { label: "Ersparnis berechnen", href: "/rechner/waermepumpe", icon: Calculator },
        ]}
      />

      {/* Einführung */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="So funktioniert es"
          title={data?.warmepumpe_second_card_title || "Wärmepumpe – komfortabel und effizient heizen"}
          image={{ src: img(data?.warmepumpe_second_card_image), alt: data?.warmepumpe_second_card_image_alt_text || "Wärmepumpe und Photovoltaik am Einfamilienhaus" }}
          points={(data?.warmepumpe_second_card_options_table || []).map((o) => o.options).filter(Boolean)}
        >
          <Fliesstext
            text={
              data?.warmepumpe_second_card_description ||
              "Wärmepumpen gewinnen Wärme aus Luft, Erdreich oder Grundwasser und heben sie mit Strom auf Heiztemperatur. Aus einer Kilowattstunde Strom werden so drei bis vier Kilowattstunden Wärme."
            }
            className="mt-5 text-[16.5px] leading-relaxed text-ink-600"
          />
        </SplitMedia>
      </Section>

      {/* Heizkostenvergleich */}
      <Section tone="sand" space="lg" id="heizkosten">
        <SectionHeading
          eyebrow="Heizkostenvergleich 2026"
          title={
            <>
              Öl, Gas oder Wärmepumpe – <span className="ov-text-gradient">was kostet Heizen?</span>
            </>
          }
          lead="Eine Wärmepumpe mit Jahresarbeitszahl 3,3 braucht für 18.000 kWh Wärme rund 5.500 kWh Strom. Kommt ein Teil davon vom eigenen Dach, sinken die Energiekosten weiter. Passen Sie die Werte an Ihr Haus an – alle Annahmen sind offen gelegt."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <Heizkostenvergleich />
        </Reveal>
      </Section>

      {/* Heizen mit Sonne */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Heizen mit Sonne"
          title="Was Photovoltaik für die Wärmepumpe wirklich leistet"
          text={[
            "Photovoltaik und Wärmepumpe sind ein starkes Team – aber nicht, weil das Dach im Winter die Heizung allein betreibt. Der Vorteil entsteht über das ganze Jahr: Warmwasser im Sommer, Heizen in Frühjahr und Herbst, günstige Kühlung an heißen Tagen.",
            "Mit intelligenter Steuerung heizt die Wärmepumpe bevorzugt dann vor, wenn die Sonne scheint, und nutzt das Haus als Wärmespeicher.",
          ]}
          points={[
            { title: "SG-Ready-Steuerung", text: "Die Wärmepumpe läuft bei Solarüberschuss bevorzugt." },
            { title: "Warmwasser mit Sonne", text: "Im Sommer oft fast vollständig solar." },
            { title: "§ 14a EnWG", text: "Reduzierte Netzentgelte für den Netzstrom." },
          ]}
          aside={<SonnenJahr />}
          reverse
        />
      </Section>

      {/* Vorteile */}
      {vorteile.length > 0 && (
        <Section tone="navy" space="lg" className="overflow-hidden">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
          <div className="relative">
            <SectionHeading
              dark
              eyebrow="Ihre Vorteile"
              title={data?.warmepumpe_second_card_options_title?.replace(/:\s*$/, "") || "Warum sich eine Wärmepumpe lohnt"}
              lead="Unabhängig von Öl- und Gaspreisen, klimafreundlich und mit eigener Energie vom Dach – das ganze Jahr über."
              className="mb-12"
            />
            <FeatureGrid items={vorteile} cols={4} tone="dark" />
          </div>
        </Section>
      )}

      {/* Förderung & Finanzierung */}
      <Section tone="white" space="lg" id="foerderung">
        <SectionHeading
          eyebrow="Förderung & Finanzierung"
          title={
            <>
              Bis zu <span className="ov-text-gradient">70 % Zuschuss</span> für Ihre neue Heizung
            </>
          }
          lead="Die KfW fördert den Umstieg auf eine Wärmepumpe in der Regel mit bis zu 70 % der förderfähigen Kosten (bei niedrigem Einkommen bis 80 %) – maximal 28.000 € förderfähig für die erste Wohneinheit. Die Boni lassen sich kombinieren."
          className="mb-12"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
          <Reveal dir="left">
            <div className="h-full rounded-[2rem] bg-sand-50 p-6 ring-1 ring-ink-200/70 md:p-9">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="ov-h3 text-ink-900">Förderbausteine KfW 458</h3>
                <p className="text-[12.5px] text-ink-500">Stand seit 21.07.2026</p>
              </div>
              <div className="mt-6 flex h-4 w-full overflow-hidden rounded-full bg-ink-200" role="img" aria-label="Förderbausteine: 30 Prozent Grundförderung, 16 Prozent Klimageschwindigkeitsbonus, bis 40 Prozent Einkommensbonus, gedeckelt auf 70 Prozent, bei niedrigem Einkommen 80 Prozent">
                {FOERDERUNG.map((f) => (
                  <div key={f.label} className={`${f.farbe} h-full border-r-2 border-sand-50 last:border-r-0`} style={{ width: `${f.prozent}%` }} />
                ))}
              </div>
              <div className="relative mt-1 h-5 text-[11.5px] text-ink-500" aria-hidden="true">
                <span className="absolute -translate-x-1/2" style={{ left: "70%" }}>▲ 70 %</span>
                <span className="absolute -translate-x-1/2" style={{ left: "80%" }}>▲ 80 %*</span>
              </div>
              <ul className="mt-4 divide-y divide-ink-200/70">
                {FOERDERUNG.map((f) => (
                  <li key={f.label} className="flex items-start gap-4 py-4">
                    <span aria-hidden="true" className={`mt-1.5 h-3 w-3 shrink-0 rounded-[4px] ${f.farbe}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[16px] font-bold text-ink-900">{f.label}</p>
                      <p className="mt-0.5 text-[14px] leading-relaxed text-ink-600">{f.text}</p>
                    </div>
                    <p className="ov-num font-display text-[22px] font-extrabold text-ink-900">{f.prozent} %</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                  <p className="text-[12.5px] text-ink-500">Förderfähige Kosten</p>
                  <p className="ov-num mt-1 font-display text-[20px] font-extrabold text-ink-900">bis 28.000 €</p>
                </div>
                <div className="rounded-2xl bg-ov-500 p-4 text-white">
                  <p className="text-[12.5px] text-white/80">Maximaler Zuschuss</p>
                  <p className="ov-num mt-1 font-display text-[20px] font-extrabold">22.400 €*</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200/70">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Rechenbeispiel</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-600">Alte Ölheizung wird ersetzt, Kosten 32.000 €, Grundförderung + Klimageschwindigkeitsbonus:</p>
                <dl className="mt-3 divide-y divide-ink-100 text-[14.5px]">
                  {[
                    ["Förderfähige Kosten (gedeckelt)", "28.000 €"],
                    ["Zuschuss 46 %", "− 12.880 €"],
                    ["Ihr Eigenanteil", "19.120 €"],
                  ].map(([a, b], i) => (
                    <div key={a} className="flex items-baseline justify-between gap-4 py-2">
                      <dt className={i === 2 ? "font-semibold text-ink-900" : "text-ink-600"}>{a}</dt>
                      <dd className={`ov-num ${i === 1 ? "font-semibold text-ov-700" : i === 2 ? "font-display text-[18px] font-extrabold text-ink-900" : "font-semibold text-ink-900"}`}>{b}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="mt-5 flex gap-2 text-[13px] leading-relaxed text-ink-500">
                <FileCheck2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                * 80 % bzw. 22.400 € nur mit 40 % Einkommensbonus. Antrag vor Vorhabenbeginn stellen – der Vertrag mit uns enthält dafür eine aufschiebende Bedingung. Förderbedingungen können sich ändern; wir prüfen den aktuellen Stand.
              </p>
            </div>
          </Reveal>

          <Reveal dir="right" delay={100}>
            <div className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-navy-950 text-white">
              {data?.warmepumpe_fourth_card_image && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={img(data.warmepumpe_fourth_card_image)} alt={data.warmepumpe_fourth_card_image_alt || ""} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6 md:p-9">
                <h3 className="ov-h3 text-white">{data?.warmepumpe_fourth_card_title || "Wärmepumpe clever finanzieren"}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-white/70">
                  {data?.warmepumpe_fourth_card_first_description ||
                    "Trotz Förderung bleibt oft eine Finanzierungslücke. Mit unserem Finanzierungsservice verteilen Sie den offenen Betrag planbar auf monatliche Raten."}
                </p>
                {finanzOptionen.length > 0 && (
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {finanzOptionen.map((o) => (
                      <li key={o.primary_text} className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                        <p className="font-display text-[15.5px] font-bold text-white">{(o.primary_text || "").trim()}</p>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-white/60">{o.secondary_text}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {data?.warmepumpe_fourth_card_second_description && (
                  <p className="mt-5 text-[12.5px] leading-relaxed text-white/45">Beispiel: {data.warmepumpe_fourth_card_second_description}</p>
                )}
                <div className="mt-auto pt-7">
                  <Button href="/service/finanzierung" variant="white" pfeil>
                    Finanzierung ansehen
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Marken */}
      {marken.length > 0 && (
        <Section tone="sand" space="lg">
          <SectionHeading
            eyebrow="Unsere Partner"
            title={data?.warmepumpe_third_card_title || "Starke Marken, mit denen wir arbeiten"}
            lead="Geprüfte Hersteller, deren Technik wir kennen – sauber integriert in Photovoltaik, Speicher und Energiemanagement."
            className="mb-12"
          />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {marken.map((m, i) => (
              <Reveal as="li" key={m.title} delay={i * 80} className="flex">
                <Link
                  href={`/produkte/warmepumpe/${generateSlug(m.title)}`}
                  className="group ov-card-hover flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-200"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                    <Image src={img(m.banner_image)} alt={m.alt_banner_image || m.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    {m.logo_image && (
                      <span className="absolute left-4 top-4 flex h-11 items-center rounded-full bg-white/95 px-3 shadow-md backdrop-blur">
                        <Image src={img(m.logo_image)} alt={m.alt_logo_image || ""} width={80} height={28} className="h-6 w-auto object-contain" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="ov-h3 text-ink-900 transition-colors group-hover:text-ov-700">{m.title}</h3>
                    <p className="mt-3 line-clamp-4 text-[14.5px] leading-relaxed text-ink-600">{m.main_description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[15px] font-semibold text-ov-700">
                      Details ansehen
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* Ablauf */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Ablauf"
          title="In vier Schritten zur Wärmepumpe"
          lead="Von der Heizlastberechnung bis zur Inbetriebnahme – mit einem Ansprechpartner und dem Förderantrag im Blick."
          align="center"
          className="mb-14"
        />
        <Steps
          items={[
            { icon: ClipboardList, title: "Beratung & Heizlast", text: "Vor-Ort-Termin, Heizlastberechnung und Prüfung von Heizkörpern, Aufstellort und Stromanschluss." },
            { icon: FileCheck2, title: "Angebot & Förderantrag", text: "Verbindliches Angebot mit aufschiebender Bedingung – so stellen Sie den KfW-Antrag rechtzeitig vor Beginn." },
            { icon: Wrench, title: "Installation", text: "Montage von Außen- und Inneneinheit, Speicher und hydraulischer Abgleich durch unser Fachteam." },
            { icon: ThermometerSun, title: "Inbetriebnahme & PV", text: "Einregulierung, Einbindung in PV-Anlage und Energiemanagement, Einweisung und Anmeldung nach § 14a." },
          ]}
        />
      </Section>

      {/* Warum Ökovolt */}
      {partnerPunkte.length > 0 && (
        <Section tone="green" space="lg">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Ihr Partner"
                title={data?.waermepumpe_fifth_card_title || "Warum Ökovolt Ihr Partner für die Wärmepumpen-Umstellung ist"}
              />
              {data?.waermepumpe_fifth_card_image && (
                <Reveal dir="left" className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
                  <Image src={img(data.waermepumpe_fifth_card_image)} alt={data.waermepumpe_fifth_card_image_alt || ""} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                </Reveal>
              )}
            </div>
            <FeatureGrid items={partnerPunkte} cols={2} />
          </div>
        </Section>
      )}

      <SolarrechnerTeaser
        href="/rechner/waermepumpe"
        cta="Zum Wärmepumpen-Rechner"
        titel="Was spart eine Wärmepumpe in Ihrem Haus?"
        text="Wärmebedarf, Heizsystem und PV-Anlage eingeben – der Rechner zeigt Heizkosten, Förderung und Amortisation im Vergleich zu Ihrer bisherigen Heizung."
      />

      <Section tone="white" space="lg">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Häufige Fragen"
              title="Wärmepumpe – kurz & ehrlich beantwortet"
              lead="Sie haben eine andere Frage? Rufen Sie uns an – wir beraten persönlich und herstellerunabhängig."
            />
            <Reveal delay={100} className="mt-8 flex items-center gap-4 rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/70">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
                <Sparkles aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-[16px] font-bold text-ink-900">PV-Anlage schon geplant?</p>
                <Link href="/produkte/photovoltaikanlage" className="group mt-0.5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                  Photovoltaik & Wärmepumpe kombinieren
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/produkte/warmepumpe" />
      <CtaBand
        title="Heizen Sie künftig mit Ihrer eigenen Sonne."
        text="Persönliche Beratung vom Fachbetrieb aus Türkheim – mit Heizlastberechnung, ehrlicher Wirtschaftlichkeitsrechnung und Unterstützung beim Förderantrag."
        primary={{ label: "Wärmepumpen-Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Ersparnis berechnen", href: "/rechner/waermepumpe" }}
      />
    </div>
  );
}
