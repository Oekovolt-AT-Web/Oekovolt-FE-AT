// service/direktvermarktung/page.js

import React from "react";
import Image from "next/image";
import {
  AlertTriangle, BadgeEuro, Ban, Calculator, CalendarClock, Check, FileSignature, Gauge, Plug, Radio, Receipt, ShieldCheck, SlidersHorizontal, TrendingUp, Undo2,
} from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid, { FeatureCard } from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Fliesstext from "@/components/Reusable/Fliesstext";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import ErloesVergleich from "@/components/Direktvermaktung/ErloesVergleich";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.direktvermarktung_service_page.api.get_photovoltaik_repowering_page_with_keywords`;
const DV_PAGE_URL = "https://www.oekovolt.com/service/direktvermarktung";

async function fetchDirektvermarktungData() {
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

const TITLE = "Direktvermarktung Solarstrom – Marktprämie | Ökovolt";
const DESCRIPTION = "Direktvermarktung von Solarstrom einfach erklärt: Marktprämienmodell, Pflicht ab 100 kWp, Solarspitzengesetz – mit Erlösvergleich. Jetzt beraten lassen!";

export async function generateMetadata() {
  const seoData = await fetchDirektvermarktungData();
  const defaultKeywords = ["Solarstrom Direktvermarktung", "Marktprämienmodell", "anzulegender Wert", "Direktvermarktung Pflicht 100 kW", "Solarspitzengesetz"];
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : defaultKeywords;

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords,
    alternates: { canonical: DV_PAGE_URL, languages: hreflangLanguages(DV_PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: DV_PAGE_URL,
      siteName: "Ökovolt Österreich",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: "https://www.oekovolt.com/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Direktvermarktung Solarstrom" }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ["https://www.oekovolt.com/og-image.jpg"],
    },
  };
}

const img = (p, fallback = "/Images/Dienstleistungen/Service/solar-panel-7518786_1280.jpg") => (p ? `/api/image?path=${p}` : fallback);

const FAQ_ZUSATZ = [
  {
    q: "Ab wann ist die Direktvermarktung Pflicht?",
    a: "Neue Photovoltaikanlagen mit mehr als 100 kW installierter Leistung müssen ihren Strom direkt vermarkten – eine feste Einspeisevergütung gibt es für sie nicht. Die im Entwurf des Solarspitzengesetzes diskutierte Absenkung der Grenze auf 25 kW wurde nicht umgesetzt. Für kleinere Anlagen ist die Direktvermarktung freiwillig (Stand September 2026).",
  },
  {
    q: "Was hat das Solarspitzengesetz geändert?",
    a: "Seit dem 25. Februar 2025 gilt für neue Anlagen: In Stunden mit negativen Börsenpreisen gibt es keine Vergütung – diese Zeit wird am Ende des Förderzeitraums angehängt. Neue Anlagen ohne intelligentes Messsystem und Steuerbox dürfen zunächst höchstens 60 % ihrer Leistung einspeisen. Für die Direktvermarktung ist ohnehin ein intelligentes Messsystem nötig, und die Einspeisung kann gezielt in Zeiten mit guten Preisen gelegt werden.",
  },
];

export default async function DirektvermarktungPage() {
  const data = await fetchDirektvermarktungData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${DV_PAGE_URL}/#webpage`,
    url: DV_PAGE_URL,
    name: data?.title || "Solarstrom Direktvermarktung | Ökovolt Österreich",
    description: DESCRIPTION,
    isPartOf: { "@id": "https://www.oekovolt.com/#website" },
    about: { "@id": "https://www.oekovolt.com/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Direktvermarktung von Solarstrom",
    serviceType: "Direktvermarktung im Marktprämienmodell",
    description: "Vermarktung von überschüssigem Solarstrom an der Strombörse mit Absicherung über die gleitende Marktprämie für Photovoltaikanlagen bis 100 kWp.",
    provider: { "@id": "https://www.oekovolt.com/#organization" },
    areaServed: { "@type": "Country", name: "Deutschland" },
    url: DV_PAGE_URL,
  };

  const erklaerung = (data?.second_card_description_table || []).map((o) => o.option);
  const vorteile = (data?.fourth_card_1st_description || []).map((o, i) => ({ icon: [TrendingUp, ShieldCheck][i % 2], title: o.primary_paragraph, text: o.secondary_paragraph }));
  const herausforderungen = (data?.fourth_card_2nd_description || []).map((o, i) => ({ icon: [AlertTriangle, Gauge][i % 2], title: o.primary_paragraph, text: o.secondary_paragraph }));
  const warum = (data?.fifth_card_description || []).map((o) => o.option);
  const voraussetzungen = (data?.sixth_card_second_table_description || []).map((o) => o.option.trim());
  const faq = [...(data?.seventh_card_table || []).map((f) => ({ q: f.question.trim(), a: f.answer.trim() })), ...FAQ_ZUSATZ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Direktvermarktung" }]}
        eyebrow={data?.subtitle || "Für PV-Anlagen bis 100 kWp"}
        title={<>Solarstrom <span className="ov-text-gradient">direkt vermarkten</span></>}
        lead={data?.first_card_subtitle ? `${data.first_card_subtitle}: Ihr überschüssiger Solarstrom wird an der Strombörse verkauft – abgesichert durch die gleitende Marktprämie.` : "Die clevere Alternative zur festen EEG-Vergütung: Ihr überschüssiger Solarstrom wird an der Strombörse verkauft – abgesichert durch die gleitende Marktprämie."}
        image={{ src: img(data?.image), alt: data?.direkt_image_alt_text || "Solarmodule unter blauem Himmel" }}
        points={["Abgesichert über die Marktprämie", "Mehrerlös bei hohen Marktwerten", "Klare, monatliche Abrechnung", "Rückwechsel monatlich möglich"]}
        actions={[
          { label: "Direktvermarktung anfragen", href: "/angebot" },
          { label: "Erlös vergleichen", href: "#erloes", icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <BadgeEuro aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                +0,4 ct <span className="text-[14px] font-semibold text-ink-500">je kWh</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">anzulegender Wert über der festen Vergütung</p>
            </div>
          </div>
        }
      />

      {/* Fakten auf einen Blick */}
      <section className="border-b border-ink-200/70 bg-white">
        <dl className="ov-container grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:py-12">
          {[
            { icon: Ban, wert: "> 100 kWp", label: "Direktvermarktung Pflicht für neue Anlagen" },
            { icon: BadgeEuro, wert: "8,10 ct", label: "anzulegender Wert bis 10 kWp (ab 01.08.2026)" },
            { icon: Radio, wert: "iMSys", label: "intelligentes Messsystem ist Voraussetzung" },
            { icon: Undo2, wert: "monatlich", label: "Wechsel zurück zur EEG-Vergütung möglich" },
          ].map((k, i) => (
            <Reveal key={k.label} delay={i * 70} className="flex items-start gap-3 px-2 md:border-l md:border-ink-200 md:px-6 md:first:border-l-0 md:first:pl-0">
              <k.icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-ov-600" />
              <div>
                <dt className="sr-only">{k.label}</dt>
                <dd className="font-display text-[20px] font-extrabold leading-tight tracking-tight text-ink-900 md:text-[24px]">{k.wert}</dd>
                <dd className="mt-1 text-[13px] leading-snug text-ink-500">{k.label}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow={data?.first_card_subtitle || "Alternative zur EEG-Vergütung"}
          title={data?.first_card_title || "Eigenen Solarstrom direkt vermarkten"}
          image={{ src: img(data?.first_card_image), alt: data?.first_card_alt_text || "" }}
        >
          <Fliesstext text={data?.first_card_description} className="mt-5 text-[16.5px] leading-relaxed text-ink-600" />
        </SplitMedia>
      </Section>

      {erklaerung.length > 0 && (
        <Section tone="sand" space="lg">
          <SplitMedia
            reverse
            eyebrow="Grundlagen"
            title={data?.second_card_title || "Was bedeutet Direktvermarktung von Solarstrom?"}
            image={{ src: img(data?.second_card_image), alt: data?.second_card_alt_text || "" }}
          >
            <div className="mt-5 space-y-4 text-[16.5px] leading-relaxed text-ink-600">
              {erklaerung.map((t) => (
                <p key={t.slice(0, 40)}>{t}</p>
              ))}
            </div>
          </SplitMedia>
        </Section>
      )}

      {/* Marktprämie + Erlösvergleich */}
      <Section tone="white" space="lg" id="erloes" className="scroll-mt-24">
        <div className="mb-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow={data?.third_card_subtitle || "Marktprämienmodell"}
            title={data?.third_card_title || "Das Marktprämienmodell einfach erklärt"}
            lead={data?.first_section_description_field || "Die Marktprämie gleicht die Differenz zwischen dem anzulegenden Wert und dem Börsenpreis für Solarstrom aus – für stabile Einnahmen trotz Preisschwankungen."}
          />
          <Reveal delay={100}>
            <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-7">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">Die Formel</p>
              <p className="mt-3 font-display text-[18px] font-bold leading-snug text-ink-900 md:text-[20px]">
                Ihr Erlös = <span className="text-ov-700">Börsenerlös</span> + <span className="text-ov-600">Marktprämie</span> − Vermarktungsentgelt
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
                Marktprämie = anzulegender Wert − Monatsmarktwert Solar (nie negativ). Liegt der Marktwert darüber, entfällt die Prämie – und der höhere Börsenerlös gehört Ihnen.
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal dir="scale">
          <ErloesVergleich />
        </Reveal>
        {data?.third_card_description && (
          <p className="mx-auto mt-8 max-w-3xl text-center text-[15px] leading-relaxed text-ink-500">{data.third_card_description}</p>
        )}
      </Section>

      {/* Vorteile & Herausforderungen */}
      {(vorteile.length > 0 || herausforderungen.length > 0) && (
        <Section tone="navy" space="lg" className="overflow-hidden">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
          <SectionHeading dark eyebrow="Ehrlich abgewogen" title="Chancen und Pflichten der Direktvermarktung" align="center" className="relative mb-14" />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="mb-5 flex items-center gap-2 font-display text-[18px] font-bold text-white">
                <Check aria-hidden="true" className="h-5 w-5 text-ov-300" strokeWidth={3} />
                {data?.fourth_card_1st_title || "Die Vorteile"}
              </p>
              <div className="grid gap-4">{vorteile.map((v, i) => (<Reveal key={v.title} delay={i * 80}><FeatureCard {...v} tone="dark" /></Reveal>))}</div>
            </div>
            <div>
              <p className="mb-5 flex items-center gap-2 font-display text-[18px] font-bold text-white">
                <AlertTriangle aria-hidden="true" className="h-5 w-5 text-sun-300" />
                {data?.fourth_card_2nd_title || "Mögliche Herausforderungen"}
              </p>
              <div className="grid gap-4">{herausforderungen.map((v, i) => (<Reveal key={v.title} delay={i * 80}><FeatureCard {...v} tone="dark" /></Reveal>))}</div>
            </div>
          </div>
        </Section>
      )}

      {/* Solarspitzengesetz */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Rechtlicher Rahmen · Stand September 2026"
          title="Solarspitzengesetz: Was sich für neue Anlagen geändert hat"
          lead="Seit dem 25. Februar 2025 gelten neue Regeln, damit Solarspitzen das Netz nicht überlasten. Für die Direktvermarktung sind sie eher Rückenwind als Hürde."
          className="mb-12"
        />
        <FeatureGrid
          cols={4}
          items={[
            { icon: Ban, title: "Keine Vergütung bei negativen Preisen", text: "Für neue Anlagen entfällt die Förderung in Stunden mit negativen Börsenpreisen. Die Zeit wird an den 20-jährigen Förderzeitraum angehängt." },
            { icon: SlidersHorizontal, title: "60 % Einspeisegrenze", text: "Neue Anlagen ohne intelligentes Messsystem und Steuerbox speisen zunächst höchstens 60 % ihrer Leistung ein – bis die Technik installiert ist." },
            { icon: Plug, title: "Pflichtgrenze bleibt 100 kW", text: "Die diskutierte Absenkung der Direktvermarktungspflicht auf 25 kW wurde nicht umgesetzt. Darunter bleibt die Direktvermarktung freiwillig." },
            { icon: Gauge, title: "Steuerbarkeit wird Standard", text: "Mit iMSys und Steuerung lässt sich Einspeisung gezielt in Stunden mit guten Preisen legen – genau das nutzt die Direktvermarktung." },
          ]}
        />
      </Section>

      {warum.length > 0 && (
        <Section tone="sand" space="lg">
          <SplitMedia
            eyebrow="Auch für kleinere Anlagen"
            title={data?.fifth_card_title || "Warum sich die Direktvermarktung auch für kleinere PV-Anlagen lohnt"}
            image={{ src: img(data?.fourth_card_1st_image), alt: data?.fourth_card_1st_alt_image || "" }}
          >
            <div className="mt-5 space-y-4 text-[16.5px] leading-relaxed text-ink-600">
              {warum.map((t) => (
                <p key={t.slice(0, 40)}>{t}</p>
              ))}
            </div>
          </SplitMedia>
        </Section>
      )}

      <Section tone="white" space="lg">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal dir="left" className="relative">
            <div aria-hidden="true" className="absolute -inset-3 -rotate-2 rounded-[2.25rem] bg-ov-100/60 md:-inset-4" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-ink-100 shadow-xl">
              <Image src={img(data?.sixth_card_image)} alt={data?.sixth_card_alt_text_image || ""} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
              {data?.sixth_card_subtitle || "Für Photovoltaikanlagen bis 100 kWp"}
            </p>
            <h2 className="ov-h2 mt-4 text-ink-900">{(data?.sixth_card_title || "Ökovolt – Ihr Direktvermarktungs-Partner").replace("ÖKOVOLT", "Ökovolt").replace("Dein", "Ihr")}</h2>
            <p className="mt-5 text-[16.5px] leading-relaxed text-ink-600">
              Mit Ökovolt haben Sie einen Partner an Ihrer Seite, der die Direktvermarktung Ihres Solarstroms komplett für Sie organisiert. Sie müssen sich um nichts kümmern – wir sorgen für eine reibungslose Abwicklung, und Sie profitieren von Ihren Stromerlösen.
            </p>
            <div className="mt-8 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <p className="font-display text-[17px] font-bold text-ink-900">{data?.sixth_card_second_subtitle || "Voraussetzungen für den Einstieg"}</p>
              <ul className="mt-4 space-y-3">
                {(voraussetzungen.length ? voraussetzungen : ["Eine geeignete PV-Anlage", "Intelligentes Messsystem (iMSys)"]).concat(["Ab 25 kWp: Fernsteuerbarkeit der Anlage"]).map((v) => (
                  <li key={v} className="flex gap-3 text-[15.5px] text-ink-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-100 text-ov-700">
                      <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Ablauf"
          title={data?.seventh_card_title || "So funktioniert die Direktvermarktung mit Ökovolt"}
          align="center"
          className="mb-14"
        />
        <Steps
          items={[
            { icon: Calculator, title: "Anlage prüfen", text: "Wir prüfen Größe, Eigenverbrauch und Messtechnik und rechnen, ob sich der Wechsel für Ihre Anlage lohnt." },
            { icon: Radio, title: "Technik vorbereiten", text: "Intelligentes Messsystem und – ab 25 kWp – Fernsteuerbarkeit. Falls nötig, rechnen Sie mit 6–8 Wochen Vorlauf." },
            { icon: FileSignature, title: "Wechsel anmelden", text: "Vertrag mit dem Direktvermarkter und Meldung beim Netzbetreiber – der Wechsel erfolgt zum 1. eines Folgemonats." },
            { icon: Receipt, title: "Monatlich abrechnen", text: "Sie erhalten eine transparente Monatsabrechnung aus Börsenerlös und Marktprämie." },
          ]}
        />
      </Section>

      <SolarrechnerTeaser
        titel={data?.second_section_title || "Bereit für die Direktvermarktung?"}
        text="Wie viel Überschuss erzeugt Ihre Anlage? Der Solarrechner zeigt Ertrag, Eigenverbrauch und Einspeisung – die Basis für Ihren Erlösvergleich."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow={data?.seventh_card_subtitle || "Häufig gestellte Fragen"}
            title="Direktvermarktung – kurz & ehrlich beantwortet"
            lead="Ihre Frage ist nicht dabei? Rufen Sie uns an – wir erklären Ihnen das Modell gern an Ihrer Anlage."
          />
          <Faq items={faq} />
        </div>
      </Section>

      <Querverweise pfad="/service/direktvermarktung" />
      <CtaBand
        title="Mehr aus jeder eingespeisten Kilowattstunde holen."
        text="Wir prüfen, ob sich die Direktvermarktung für Ihre Anlage lohnt, bereiten die Technik vor und übernehmen den Wechsel – als Fachbetrieb aus Türkheim."
        primary={{ label: "Direktvermarktung anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
