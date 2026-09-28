// produkte/smartenergyhome/page.js

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BatteryCharging, Calculator, Car, Check, Cpu, Gauge, Layers, Network, PlugZap, Sun, Thermometer, TrendingDown, Zap,
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
import Fliesstext from "@/components/Reusable/Fliesstext";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import Energiefluss from "@/components/smartenergyhome/Energiefluss";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.smart_energy_home_page.api.get_smart_energy_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.com/produkte/smartenergyhome";

async function fetchSmartEnergyData() {
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

const TITLE = "Smart Energy Home: Energiemanagement mit PV | Ökovolt";
const DESCRIPTION =
  "Photovoltaik, Speicher, Wallbox und Wärmepumpe intelligent vernetzt: So nutzt Ihr Energiemanagementsystem jede Kilowattstunde optimal. Jetzt beraten lassen!";

export async function generateMetadata() {
  const seoData = await fetchSmartEnergyData();
  const defaultKeywords = ["Smart Energy Home", "Energiemanagementsystem", "Energiemanagement Photovoltaik", "HEMS", "Eigenverbrauch optimieren"];
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : defaultKeywords;
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
      images: [{ url: bild, width: 1200, height: 630, alt: "Ökovolt Smart Energy Home" }],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [bild] },
  };
}

const img = (p, fallback = "/Images/Dienstleistungen/Smartphone/smart-home-3920905_1280.jpg") => (p ? `/api/image?path=${p}` : fallback);

/** Absätze aus dem Backoffice zusammenführen und doppelte Sätze/Zeilen entfernen. */
function absaetze(liste) {
  const gesehen = new Set();
  return (liste || [])
    .flatMap((d) => String(d.description || "").split(/\n+/))
    .map((t) => t.trim())
    .filter((t) => t && !gesehen.has(t.slice(0, 80)) && gesehen.add(t.slice(0, 80)));
}

const FAQ = [
  {
    q: "Was ist ein Smart Energy Home?",
    a: "Ein Smart Energy Home verbindet Photovoltaikanlage, Stromspeicher, Wallbox, Wärmepumpe und Stromzähler über ein Energiemanagementsystem (EMS). Das EMS entscheidet laufend, welches Gerät wann wie viel Strom bekommt – mit dem Ziel, möglichst viel eigenen Solarstrom zu nutzen und teuren Netzstrom zu vermeiden.",
  },
  {
    q: "Was bringt ein Energiemanagementsystem konkret?",
    a: "Ohne Steuerung laufen E-Auto und Wärmepumpe dann, wenn sie eingeschaltet werden – oft abends mit Netzstrom. Ein EMS verschiebt diese großen Verbraucher gezielt in die Sonnenstunden oder in günstige Börsenstunden. So steigen Eigenverbrauch und Autarkie deutlich, ohne dass Sie etwas tun müssen.",
  },
  {
    q: "Kann ich ein Energiemanagement in eine bestehende PV-Anlage nachrüsten?",
    a: "Ja, in den meisten Fällen. Entscheidend ist, dass Wechselrichter, Speicher, Wallbox und Wärmepumpe über offene Schnittstellen (z. B. Modbus, EEBus oder SG Ready) kommunizieren können. Wir prüfen Ihre vorhandenen Komponenten und empfehlen, was sich einbinden lässt.",
  },
  {
    q: "Brauche ich für ein Smart Energy Home einen Smart Meter?",
    a: "Für die Regelung im Haus misst ein Energiezähler am Netzanschlusspunkt, wie viel Strom gerade fließt. Für dynamische Stromtarife und die Netzentgelt-Vorteile nach § 14a EnWG ist zusätzlich ein intelligentes Messsystem des Messstellenbetreibers nötig. Ab 7 kW PV-Leistung ist es ohnehin Pflicht.",
  },
  {
    q: "Worauf sollte ich beim Kauf achten?",
    a: "Achten Sie weniger auf einzelne Datenblätter als auf die Kompatibilität: Alle Komponenten sollten mit einem gemeinsamen Energiemanagement zusammenarbeiten – heute und bei späteren Erweiterungen wie E-Auto oder Wärmepumpe. Wer von Anfang an das Gesamtkonzept plant, vermeidet teure Insellösungen.",
  },
  {
    q: "Muss ich alles auf einmal kaufen?",
    a: "Nein. Viele Kunden starten mit der PV-Anlage und ergänzen Speicher, Wallbox oder Wärmepumpe später. Wichtig ist nur, dass die erste Planung Platz, Zählerschrank und Schnittstellen für die nächsten Schritte mitdenkt.",
  },
];

export default async function SmartEnergyPage() {
  const data = await fetchSmartEnergyData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Smart Energy Home – Energiemanagementsystem für Photovoltaik | Ökovolt",
    description: DESCRIPTION,
    isPartOf: { "@id": "https://www.oekovolt.com/#website" },
    about: { "@id": "https://www.oekovolt.com/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const einstieg = absaetze(data?.first_card_text);
  const konzept = absaetze(data?.second_card_text);
  const kaufpunkte = (data?.third_card_text || []).map((d) => d.description).filter(Boolean);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Smart Energy Home" }]}
        eyebrow="Smart Energy Home"
        title={
          data?.title ? (
            data.title
          ) : (
            <>
              Ein Zuhause, das seine Energie <span className="ov-text-gradient">selbst managt</span>
            </>
          )
        }
        lead={
          data?.subtitle
            ? `${data.subtitle}. Photovoltaik, Speicher, Wallbox und Wärmepumpe arbeiten als ein System – gesteuert von einem Energiemanager, der jede Kilowattstunde dorthin schickt, wo sie am meisten bringt.`
            : "Photovoltaik, Speicher, Wallbox und Wärmepumpe arbeiten als ein System – gesteuert von einem Energiemanager, der jede Kilowattstunde dorthin schickt, wo sie am meisten bringt."
        }
        image={{ src: img(data?.banner_image), alt: data?.banner_alt_text || "Smart Energy Home mit Photovoltaik" }}
        points={["Mehr Eigenverbrauch, weniger Netzstrom", "Nachrüstbar in Bestandsanlagen", "Bereit für dynamische Tarife", "Herstellerübergreifend geplant"]}
        actions={[
          { label: "Smart Energy Home planen", href: "/angebot" },
          { label: "Autarkie berechnen", href: "/solarrechner", icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-white">
              <Cpu aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[20px] font-extrabold leading-none text-ink-900">1 System</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">statt fünf Apps: PV, Speicher, Wallbox, Wärmepumpe, Zähler</p>
            </div>
          </div>
        }
      />

      <Section tone="navy" space="lg" className="overflow-hidden" id="energiefluss">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-32 -top-20 h-[380px] w-[380px] rounded-full bg-navy-400/25 blur-[120px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="So denkt Ihr Energiemanager"
            title={<>Jede Kilowattstunde <span className="ov-text-gradient-light">am richtigen Ort</span></>}
            lead="Mittags Sonne im Überfluss, abends Bedarf, nachts günstiger Börsenstrom: Schalten Sie durch den Tag und sehen Sie, wie das System den Strom verteilt."
            align="center"
            className="mb-12"
          />
          <Reveal dir="scale">
            <Energiefluss />
          </Reveal>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Der Einstieg"
          title={data?.first_title || "Energiemanagement für Ihr Zuhause leicht gemacht"}
          image={{ src: img(data?.first_card_image), alt: data?.first_image_alt_txt || "Planung eines Smart Energy Home" }}
        >
          {einstieg.length > 0 ? (
            <div className="mt-5 space-y-4 text-[16.5px] leading-relaxed text-ink-600">
              {einstieg.map((t) => (
                <p key={t.slice(0, 40)} className="ov-measure">{t}</p>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-[16.5px] leading-relaxed text-ink-600">
              Der Weg zum Smart Energy Home beginnt meist mit einer Photovoltaikanlage, einer Wärmepumpe oder einem E-Auto – und lässt sich Schritt für Schritt erweitern.
            </p>
          )}
          {data?.first_card_image_description && (
            <p className="mt-6 flex gap-3 rounded-2xl bg-ov-50 p-4 text-[15px] font-medium text-ink-700">
              <Sun aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
              {data.first_card_image_description}
            </p>
          )}
        </SplitMedia>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow={data?.second_title || "Das Konzept"} title={data?.second_subtitle || "Komfort, Effizienz und erneuerbare Energie verbunden"} />
            {konzept.length > 0 && (
              <Reveal delay={80} className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink-600">
                {konzept.map((t) => (
                  <p key={t.slice(0, 40)} className="ov-measure">{t}</p>
                ))}
              </Reveal>
            )}
          </div>
          <div>
            <FeatureGrid
              cols={2}
              items={[
                { icon: Sun, title: "Photovoltaik", text: "Die Quelle: Solarstrom vom eigenen Dach, der zuerst im Haus bleiben soll.", href: "/produkte/photovoltaikanlage" },
                { icon: BatteryCharging, title: "Stromspeicher", text: "Verschiebt Mittagssonne in den Abend – der größte Hebel für Autarkie.", href: "/produkte/stromspeicher" },
                { icon: Car, title: "Wallbox", text: "Lädt das E-Auto bevorzugt mit Solarüberschuss statt mit Netzstrom.", href: "/produkte/wallbox" },
                { icon: Thermometer, title: "Wärmepumpe", text: "Heizt und erwärmt Wasser vor, wenn Sonnenstrom übrig ist.", href: "/produkte/warmepumpe" },
                { icon: Gauge, title: "Smart Meter", text: "Misst viertelstündlich und macht dynamische Tarife und § 14a nutzbar.", href: "/produkte/smartmeter" },
                { icon: Zap, title: "Dynamischer Tarif", text: "Den Rest aus dem Netz dann beziehen, wenn die Börse günstig ist.", href: "/service/stromtarif" },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SplitMedia
          reverse
          eyebrow="Einfach erklärt"
          title={data?.third_title || "Energiemanagementsystem für Photovoltaik einfach erklärt"}
          image={{ src: img(data?.third_card_image), alt: data?.third_image_alt_txt || "Vernetzte Energiekomponenten im Eigenheim" }}
        >
          <Fliesstext
            text={
              data?.third_card_image_description ||
              "Ein Smart Energy Home entsteht durch die intelligente Vernetzung von Photovoltaikanlage, Wärmepumpe, E-Auto und Stromspeicher."
            }
            className="mt-5 text-[16.5px] leading-relaxed text-ink-600"
          />
          <ul className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { i: TrendingDown, t: "Geringere Energiekosten" },
              { i: Layers, t: "Weniger CO₂" },
              { i: Network, t: "Mehr Unabhängigkeit" },
            ].map((k) => (
              <li key={k.t} className="flex items-center gap-2.5 rounded-2xl bg-sand-50 px-4 py-3 text-[14.5px] font-semibold text-ink-800 ring-1 ring-ink-200/70">
                <k.i aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-600" />
                {k.t}
              </li>
            ))}
          </ul>
        </SplitMedia>

        <div className="mt-24">
          <SectionHeading
            eyebrow="Schritt für Schritt"
            title="Ihr Weg zum Smart Energy Home"
            lead="Nicht alles muss auf einmal passieren. Entscheidend ist, dass jeder Schritt zum nächsten passt."
            align="center"
            className="mb-14"
          />
          <Steps
            items={[
              { icon: Sun, title: "PV-Anlage", text: "Das Fundament: richtig dimensioniert, mit Wechselrichter und Zählerschrank, die spätere Erweiterungen mitmachen." },
              { icon: BatteryCharging, title: "Speicher", text: "Hebt den Eigenverbrauch deutlich und macht Solarstrom auch abends und nachts nutzbar." },
              { icon: PlugZap, title: "Wallbox & Wärmepumpe", text: "Die großen Verbraucher kommen dazu – und laufen gezielt dann, wenn Sonne da ist." },
              { icon: Cpu, title: "Energiemanagement", text: "Ein EMS verbindet alles, nutzt Wetterprognose und Börsenpreis und steuert automatisch." },
            ]}
          />
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal dir="left" className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-ink-100 shadow-xl">
              <Image
                src={img(data?.fourth_card_image)}
                alt={data?.fourth_image_alt_txt || "Montage einer Photovoltaikanlage"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {data?.fourth_card_image_description && (
                <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 text-[14px] leading-snug text-ink-700 shadow-lg backdrop-blur md:inset-x-6 md:bottom-6">
                  {data.fourth_card_image_description}
                </div>
              )}
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Kaufberatung"
              title={data?.fourth_title || "Worauf Sie beim Kauf achten sollten"}
              lead={
                data?.fourth_card_description ||
                "Achten Sie nicht nur auf den Preis, sondern vor allem auf die Kompatibilität der Systeme – heute und in Zukunft."
              }
            />
            <ul className="mt-8 space-y-3">
              {(kaufpunkte.length
                ? kaufpunkte
                : ["Nur mit intelligenter Vernetzung holen Sie das Maximum aus Ihrem Solarstrom heraus.", "Nur wenn alle Systeme reibungslos kommunizieren, senken Sie dauerhaft Ihre Energieausgaben."]
              ).map((p, i) => (
                <Reveal as="li" key={p} delay={i * 70} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-500 text-white">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-[15.5px] leading-relaxed text-ink-700">{p}</span>
                </Reveal>
              ))}
            </ul>
            <Link href="/produkte/hersteller" className="group mt-7 inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Hersteller, mit denen wir planen
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Section>

      <SolarrechnerTeaser
        href="/solarrechner"
        cta="Zum Solarrechner"
        titel="Wie unabhängig kann Ihr Zuhause werden?"
        text="Anlagengröße, Verbrauch, Speicher und E-Auto eingeben – der Solarrechner zeigt Autarkie, Ersparnis und Amortisation für Ihr Dach."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Smart Energy Home – kurz & ehrlich beantwortet"
            lead="Sie haben schon Komponenten im Haus? Wir prüfen herstellerübergreifend, was sich sinnvoll vernetzen lässt."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/produkte/smartenergyhome" />
      <CtaBand
        title="Lassen Sie Ihr Zuhause mitdenken."
        text="Wir planen PV, Speicher, Wallbox, Wärmepumpe und Energiemanagement als ein System – mit ehrlicher Wirtschaftlichkeitsrechnung und festem Ansprechpartner vom Fachbetrieb aus Türkheim."
        primary={{ label: "Smart Energy Home planen", href: "/angebot" }}
        secondary={{ label: "Autarkie berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
