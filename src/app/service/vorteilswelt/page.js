// service/vorteilswelt/page.js

import React from "react";
import { Calculator, Gift, Handshake, Link2, Send, UserPlus } from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Fliesstext from "@/components/Reusable/Fliesstext";
import Querverweise from "@/components/Reusable/Querverweise";
import PraemienRechner from "@/components/Vorteilswelt/PraemienRechner";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.oekovolt_vorteilswelt_service_page.api.get_vorteilswelt_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.com/service/vorteilswelt";

async function fetchVorteilsweltData() {
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

const META_TITLE = "Vorteilswelt: 250 € Prämie für Ihre Empfehlung | Ökovolt";
const META_DESCRIPTION =
  "Ökovolt weiterempfehlen und profitieren: 250 € Prämie für Sie und 250 € für die empfohlene Person – in 4 einfachen Schritten. Jetzt registrieren!";
const DEFAULT_KEYWORDS = ["Ökovolt Vorteilswelt", "Empfehlungsprogramm", "Prämie für Empfehlung", "Kunden werben Kunden", "Solaranlage empfehlen"];

export async function generateMetadata() {
  const seoData = await fetchVorteilsweltData();

  // Keywords aus der API, sonst Fallback
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : DEFAULT_KEYWORDS;

  return {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_AT",
      url: PAGE_URL,
      siteName: "Ökovolt Österreich",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [{ url: "https://www.oekovolt.com/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Österreich" }],
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: ["https://www.oekovolt.com/og-image.jpg"],
    },
  };
}

const img = (p, fallback) => (p ? `/api/image?path=${p}` : fallback);

const SCHRITT_ICONS = [UserPlus, Send, Link2, Handshake];

const SCHRITTE_FALLBACK = [
  { title: "Registrieren & Empfehlungslink sichern", description: "Melden Sie sich für unser Empfehlungsprogramm an und erhalten Sie Ihren persönlichen Empfehlungslink." },
  { title: "Link ganz einfach teilen", description: "Senden Sie den Link per E-Mail, WhatsApp oder SMS an Freunde, Familie oder Bekannte. Nutzen Sie gerne unseren Textvorschlag." },
  { title: "Empfehlung wird zugeordnet", description: "Sobald jemand über Ihren Link Kontakt mit uns aufnimmt, wird die Anfrage automatisch Ihrer Empfehlung zugeordnet." },
  { title: "Prämie erhalten", description: "Wenn daraus ein Vertrag mit Ökovolt entsteht, erhalten Sie Ihre 250 € Prämie als Dankeschön. Wir informieren Sie, sobald Ihr Bonus gutgeschrieben ist." },
];

const KARTEN_FALLBACK = [
  {
    title: "Empfehlen Sie uns weiter – gemeinsam für eine nachhaltige Zukunft!",
    description: "Als überzeugter Ökovolt-Kunde können Sie auch andere für die Vorteile erneuerbarer Energien begeistern. Für jede erfolgreiche Weiterempfehlung bedanken wir uns mit 250 € für Sie – und zusätzlich 250 € für die empfohlene Person.",
    image: null,
    alt_text: "Ingenieur prüft eine Solaranlage auf dem Hausdach",
  },
  {
    title: "Echte Erfahrungen. Ehrliche Empfehlungen",
    description: "Zufriedene Ökovolt-Kunden sind gleichzeitig Botschafter für erneuerbare Energien. Besonders geschätzt werden die persönliche Beratung, die zuverlässige Installation und die spürbare Reduktion der Stromkosten.",
    image: null,
    alt_text: "Fachkräfte überprüfen Solarmodule",
  },
];
const KARTEN_BILDER = [
  "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg",
  "/Images/Jobs/jobs1.jpg",
  "/Images/Jobs/jobs2.jpg",
];

const FAQ = [
  {
    q: "Wer kann am Empfehlungsprogramm teilnehmen?",
    a: "Das Programm richtet sich an alle, die Ökovolt aus eigener Erfahrung weiterempfehlen möchten – etwa Kundinnen und Kunden mit einer Solaranlage, einem Stromspeicher oder nach einer Beratung. Details zu den Teilnahmebedingungen erhalten Sie bei der Registrierung.",
  },
  {
    q: "Wann gilt eine Empfehlung als erfolgreich?",
    a: "Eine Empfehlung ist erfolgreich, wenn die empfohlene Person über Ihren persönlichen Empfehlungslink Kontakt mit uns aufnimmt und daraus ein Vertrag mit Ökovolt entsteht. Dann erhalten Sie 250 € und die empfohlene Person ebenfalls 250 €.",
  },
  {
    q: "Wie melde ich mich an und bekomme meinen Empfehlungslink?",
    a: "Melden Sie sich über unser Kontaktformular oder telefonisch unter 08245 96 788 0 als Empfehlungsgeber. Ihren persönlichen Empfehlungslink erhalten Sie nach der Registrierung.",
  },
  {
    q: "Wie erfahre ich, ob meine Prämie gutgeschrieben wurde?",
    a: "Wir informieren Sie, sobald Ihr Bonus gutgeschrieben ist. Wie und wann die Auszahlung im Einzelnen erfolgt, erfahren Sie mit den Teilnahmebedingungen bei der Registrierung.",
  },
  {
    q: "Kann ich mehrere Personen empfehlen?",
    a: "Ja, die Prämie gilt für jede erfolgreiche Empfehlung. Ob es dabei Obergrenzen oder weitere Voraussetzungen gibt, regeln die Teilnahmebedingungen, die Sie bei der Registrierung erhalten.",
  },
];

export default async function VorteilsweltPage() {
  const data = await fetchVorteilsweltData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.Title || "Ökovolt Vorteilswelt – 250 € Prämie für Ihre Empfehlung",
    description: data?.description || META_DESCRIPTION,
    isPartOf: { "@id": "https://www.oekovolt.com/#website" },
    about: { "@id": "https://www.oekovolt.com/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data?.second_card_title || "In 4 Schritten zur Ökovolt-Prämie",
    step: (data?.second_card_table?.length ? data.second_card_table : SCHRITTE_FALLBACK).map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };

  const schritte = (data?.second_card_table?.length ? data.second_card_table : SCHRITTE_FALLBACK).map((s, i) => ({
    icon: SCHRITT_ICONS[i % SCHRITT_ICONS.length],
    title: s.title,
    text: s.description,
  }));

  const karten = (data?.first_card_table?.length ? data.first_card_table : KARTEN_FALLBACK).map((k, i) => ({
    // Tippfehler aus dem CMS in der Anzeige korrigieren
    title: (k.title || "").replace(/Empfehlunge$/, "Empfehlungen"),
    text: k.description,
    bild: img(k.image, KARTEN_BILDER[i % KARTEN_BILDER.length]),
    alt: k.alt_text || k.title,
  }));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Vorteilswelt" }]}
        eyebrow="Ökovolt Vorteilswelt · Empfehlungsprogramm"
        title={<>Weiterempfehlen und <span className="ov-text-gradient">250&nbsp;€</span> Prämie sichern</>}
        lead={data?.description || "Sie sind zufrieden mit Ihrer Solaranlage, Ihrem Stromspeicher oder der Beratung durch Ökovolt? Dann teilen Sie Ihre Erfahrungen mit Freunden, Nachbarn oder Kollegen: Für jede erfolgreiche Empfehlung erhalten Sie von uns eine Prämie in Höhe von 250 €."}
        image={{
          src: img(data?.Image, "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg"),
          alt: data?.alt_text || "Ökovolt-Techniker bei der Arbeit",
        }}
        points={["250 € für Sie", "250 € für die empfohlene Person", "In 4 einfachen Schritten", "Teilen per WhatsApp oder E-Mail"]}
        actions={[
          { label: "Als Empfehlungsgeber melden", href: "/kontakt" },
          { label: "Prämie berechnen", href: "#praemienrechner", icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sun-400 text-navy-950">
              <Gift aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="ov-num font-display text-[22px] font-extrabold leading-none text-ink-900">250&nbsp;€ + 250&nbsp;€</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">für Sie und Ihre Empfehlung – sobald ein Vertrag entsteht</p>
            </div>
          </div>
        }
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="So funktioniert es"
          title={data?.second_card_title?.replace(/:\s*$/, "") || "In 4 Schritten zur Ökovolt-Prämie"}
          lead="Registrieren, Link teilen, fertig: Den Rest übernehmen wir – von der Beratung Ihrer Empfehlung bis zur Gutschrift Ihrer Prämie."
          align="center"
          className="mb-14"
        />
        <Steps items={schritte} />
      </Section>

      <Section id="praemienrechner" tone="navy" space="lg" className="scroll-mt-24 overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-24 h-[480px] w-[480px] rounded-full bg-ov-500/25 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-32 bottom-10 h-[400px] w-[400px] rounded-full bg-sun-400/15 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            align="center"
            eyebrow="Prämienrechner"
            title={<>Doppelte Freude, <span className="ov-text-gradient-light">doppelter Vorteil</span></>}
            lead="Jede erfolgreiche Empfehlung bringt 250 € für Sie und 250 € für die empfohlene Person. Schieben Sie den Regler – und teilen Sie direkt unseren Textvorschlag."
            className="mb-12"
          />
          <Reveal dir="scale">
            <PraemienRechner />
          </Reveal>
        </div>
      </Section>

      {karten.map((k, i) => (
        <Section key={k.title || i} tone={i % 2 === 0 ? "white" : "sand"} space="lg">
          <SplitMedia
            eyebrow={i === 0 ? "Gemeinsam für saubere Energie" : "Aus Überzeugung empfohlen"}
            title={k.title}
            image={{ src: k.bild, alt: k.alt }}
            reverse={i % 2 === 1}
            action={i === 0 ? { label: "Jetzt als Empfehlungsgeber melden", href: "/kontakt" } : undefined}
          >
            <Fliesstext text={(k.text || "").replace(/(\d) €/g, "$1 €")} className="mt-5 text-[16.5px] leading-relaxed text-ink-600" />
          </SplitMedia>
        </Section>
      ))}

      <Section tone={karten.length % 2 === 0 ? "white" : "sand"} space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Fragen zum Programm"
              title="Empfehlungsprogramm – kurz erklärt"
              lead="Details zu den Teilnahmebedingungen erhalten Sie bei der Registrierung. Bei Fragen sind wir gerne persönlich für Sie da."
            />
            <Reveal delay={120} className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button href="/kontakt" variant="primary" pfeil>
                Registrieren
              </Button>
              <Button href="tel:+498245967880" variant="secondary">
                08245 96 788 0
              </Button>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/service/vorteilswelt" />
      <CtaBand
        eyebrow="Vorteilswelt"
        title="Empfehlen, teilen, 250 € sichern."
        text="Melden Sie sich als Empfehlungsgeber – Ihren persönlichen Empfehlungslink erhalten Sie nach der Registrierung. Oder rechnen Sie aus, was eine eigene Anlage für Sie bringt."
        primary={{ label: "Als Empfehlungsgeber melden", href: "/kontakt" }}
        secondary={{ label: "Eigenen Solarertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
