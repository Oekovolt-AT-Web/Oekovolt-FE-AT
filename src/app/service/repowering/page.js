// service/repowering/page.js

import React from "react";
import Image from "next/image";
import {
  ArrowRight, BatteryCharging, Calculator, CalendarClock, Check, ClipboardCheck, Cpu, Gauge, Home, LayoutGrid, Minus, Plug, Recycle, Sun, Wrench,
} from "lucide-react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
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
import VorherNachher from "@/components/Repowering/VorherNachher";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.photovoltaik_repowering_service_page.api.get_photovoltaik_repowering_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/service/repowering";

async function fetchRepoweringData() {
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

const TITLE = "Repowering Photovoltaik – alte PV-Anlage erneuern | Ökovolt";
const DESCRIPTION = "Ü20- oder ältere PV-Anlage? Module und Wechselrichter tauschen, Anlage erweitern, Speicher nachrüsten – bis zu doppelte Leistung vom selben Dach. Jetzt prüfen!";

export async function generateMetadata() {
  const seoData = await fetchRepoweringData();
  const defaultKeywords = ["Photovoltaik Repowering", "Ü20 PV-Anlage", "Solaranlage modernisieren", "Wechselrichter tauschen", "PV-Anlage erweitern"];
  const keywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : defaultKeywords;

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
      images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Photovoltaik Repowering" }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ["https://www.oekovolt.de/og-image.jpg"],
    },
  };
}

const img = (p, fallback = "/Images/Dienstleistungen/Photovoltaik/house.png") => (p ? `/api/image?path=${p}` : fallback);

const KARTEN_ICONS = [Wrench, LayoutGrid, Home, BatteryCharging];
const KARTEN_FALLBACK = [
  { title: "Defekte Komponenten ersetzen", description: "Beschädigte oder veraltete Anlagenteile tauschen – für wieder volle Erträge." },
  { title: "PV-Anlage erweitern", description: "Mehr Module, mehr Strom und ein höherer Eigenversorgungsgrad." },
  { title: "Umstellung auf Eigenverbrauch", description: "Solarstrom selbst nutzen statt komplett einzuspeisen." },
  { title: "Stromspeicher nachrüsten", description: "Solarstrom auch abends und nachts nutzen." },
];

const FAQ = [
  {
    q: "Wann lohnt sich ein Repowering meiner PV-Anlage?",
    a: "Typische Anlässe sind das Ende der EEG-Vergütung nach 20 Jahren, ein defekter oder veralteter Wechselrichter, deutlich sinkende Erträge oder ein gestiegener Strombedarf durch Wärmepumpe oder E-Auto. Weil moderne Module auf gleicher Fläche etwa doppelt so viel Leistung bringen wie Module aus den frühen 2000ern, rechnet sich der Tausch häufig schnell – vor allem, wenn der Strom selbst genutzt wird.",
  },
  {
    q: "Was tun mit einer Ü20-Anlage nach Ende der EEG-Vergütung?",
    a: "Sie haben drei Wege: Die Anlage weiter einspeisen lassen (dann gibt es statt der festen Vergütung nur noch den Marktwert abzüglich einer Vermarktungspauschale), auf Eigenverbrauch umstellen (mit Zweirichtungszähler und optional Speicher) oder die Anlage komplett erneuern. Eine neue Anlage erhält ab Inbetriebnahme wieder für 20 Jahre die dann gültige Einspeisevergütung – ab 1. August 2026 7,70 ct/kWh für Teileinspeisung bis 10 kWp.",
  },
  {
    q: "Verliere ich meine EEG-Vergütung, wenn ich Module tausche?",
    a: "Werden Module wegen eines Defekts, einer Beschädigung oder eines Diebstahls ersetzt, bleibt der ursprüngliche Vergütungsanspruch nach § 38b EEG grundsätzlich bis zur bisher installierten Leistung erhalten. Zusätzliche Leistung wird wie eine neue Anlage behandelt und braucht ein passendes Messkonzept. Wir klären die Details für Ihre Anlage vor dem Umbau mit dem Netzbetreiber.",
  },
  {
    q: "Wie lange hält ein Wechselrichter?",
    a: "Wechselrichter sind in der Regel das erste Bauteil, das getauscht werden muss – typisch nach 10 bis 15 Jahren. Neue Geräte arbeiten effizienter, bieten Monitoring per App und sind oft schon für einen Batteriespeicher vorbereitet (Hybridwechselrichter).",
  },
  {
    q: "Kann ich an eine alte Anlage einen Speicher nachrüsten?",
    a: "Ja. Bleibt der alte Wechselrichter in Betrieb, wird der Speicher meist AC-seitig mit eigenem Batteriewechselrichter angeschlossen. Steht ohnehin ein Wechselrichtertausch an, ist ein Hybridwechselrichter mit DC-gekoppeltem Speicher oft die elegantere Lösung.",
  },
  {
    q: "Was passiert mit den alten Modulen?",
    a: "Photovoltaikmodule fallen unter das Elektro- und Elektronikgerätegesetz (ElektroG) und werden über die dafür vorgesehenen Rücknahmesysteme fachgerecht recycelt. Glas, Aluminium und Silizium lassen sich zu einem großen Teil wiederverwerten. Den Rückbau und die Entsorgung organisieren wir für Sie.",
  },
];

export default async function RepoweringPage() {
  const data = await fetchRepoweringData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.photovoltaik_title || "Photovoltaik Repowering",
    description: DESCRIPTION,
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Repowering und Erweiterung von Photovoltaikanlagen",
    serviceType: "PV-Repowering",
    description: "Modul- und Wechselrichtertausch, Erweiterung, Umstellung auf Eigenverbrauch und Speichernachrüstung für bestehende Photovoltaikanlagen.",
    provider: { "@id": "https://www.oekovolt.de/#organization" },
    areaServed: { "@type": "Country", name: "Deutschland" },
    url: PAGE_URL,
  };

  const karten = (data?.cards?.length ? data.cards : KARTEN_FALLBACK).map((k, i) => ({
    icon: KARTEN_ICONS[i % KARTEN_ICONS.length],
    title: k.title,
    // CMS-Texte teils in Du-Form – auf der Website einheitlich Sie-Form
    text: k.description.replace("erreichst du", "erreichen Sie").replace("nutzt deinen", "nutzen Ihren"),
  }));
  const optionen = (data?.second_card_options || []).map((o) => ({ title: o.primary_paragraph, text: o.secondary_paragraph }));
  const modulPunkte = (data?.fourth_card_options || []).map((o) => o.option);
  const vorher = (data?.third_sec_2nd_card_first_table || []).map((o) => o.option);
  const nachher = (data?.third_sec_2nd_card_second_table || []).map((o) => o.option);
  const vorher2 = (data?.third_sec_3rd_card_first_options_table || []).map((o) => o.option);
  const nachher2 = (data?.third_sec_3rd_card_second_options_table || []).map((o) => o.option);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Repowering" }]}
        eyebrow={data?.photovoltaik_subtitle || "Repowering & Erweiterung"}
        title={<>Alte PV-Anlage, <span className="ov-text-gradient">neue Leistung</span></>}
        lead={data?.photovoltaik_description || "Durch den Austausch älterer Wechselrichter oder Module und die Integration eines Stromspeichers steigern Sie die Effizienz Ihrer bestehenden Solaranlage deutlich."}
        image={{ src: img(data?.photovoltaik_image), alt: data?.photovoltaik_image_alt_text || "Techniker prüft Solarmodule einer bestehenden PV-Anlage" }}
        points={["Ü20-Anlagen sinnvoll weiter nutzen", "Module & Wechselrichter tauschen", "Anlage erweitern", "Speicher nachrüsten"]}
        actions={[
          { label: "Repowering-Check anfragen", href: "/angebot" },
          { label: "Leistung vergleichen", href: "#vergleich", icon: Gauge },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Sun aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                bis ×2 <span className="text-[14px] font-semibold text-ink-500">Leistung</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">vom selben Dach mit neuen Modulen</p>
            </div>
          </div>
        }
      />

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Anlagen-Optimierung"
          title={data?.second_card_title || "Photovoltaik-Optimierung mit Ökovolt"}
          image={{ src: img(data?.second_card_image), alt: data?.second_card_alt_text || "" }}
          points={optionen}
        >
          <Fliesstext text={data?.second_card_description} className="mt-5 text-[16.5px] leading-relaxed text-ink-600" />
        </SplitMedia>
      </Section>

      <Section tone="sand" space="lg" id="vergleich" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Vorher / Nachher"
          title={<>Was steckt noch in <span className="ov-text-gradient">Ihrem Dach</span>?</>}
          lead="Moderne Module holen auf derselben Fläche ein Vielfaches aus der Sonne. Wählen Sie Baujahr und Fläche Ihrer Anlage und ziehen Sie den Regler über das Dach."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <VorherNachher />
        </Reveal>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Leistungen"
          title={data?.photovoltaik_second_card_title || "Was Repowering bei Ökovolt umfasst"}
          lead="Vom einzelnen Bauteil bis zur komplett neuen Anlage – wir empfehlen, was sich für Ihr Dach wirklich rechnet."
          className="mb-12"
        />
        <FeatureGrid items={karten} cols={4} />
      </Section>

      {/* Ü20 */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-24 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading dark eyebrow="Ü20-Anlagen" title={data?.third_sec_title || "Was tun mit Ü20-PV-Anlagen?"} />
            <Reveal delay={80}>
              <h3 className="mt-8 font-display text-[20px] font-bold text-white">{data?.third_sec_1st_card_first_title || "Photovoltaikanlagen nach 20 Jahren sinnvoll weiter nutzen"}</h3>
              <Fliesstext text={data?.third_sec_1st_card_first_description} className="mt-3 text-[16px] leading-relaxed text-white/70" />
              <h3 className="mt-7 font-display text-[20px] font-bold text-white">{data?.third_sec_1st_card_second_title || "Was bedeutet das für Betreiber?"}</h3>
              <Fliesstext text={data?.third_sec_1st_card_second_description} className="mt-3 text-[16px] leading-relaxed text-white/70" />
              {(data?.third_sec_1st_card_table_options || []).length > 0 && (
                <ul className="mt-5 space-y-3">
                  {data.third_sec_1st_card_table_options.map((o) => (
                    <li key={o.option} className="flex gap-3 text-[15.5px] text-white/85">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-500/20 text-ov-300">
                        <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {o.option}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>
          <div className="flex flex-col gap-4">
            <Reveal dir="right" className="mb-2">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">Ihre drei Optionen nach dem EEG-Ende</p>
            </Reveal>
            {[
              { icon: Plug, titel: "Weiter einspeisen", text: "Die Anlage bleibt am Netz. Statt der festen Vergütung gibt es nur noch den Marktwert Solar abzüglich einer Vermarktungspauschale – meist nur wenige Cent je kWh.", tag: "Minimaler Aufwand" },
              { icon: Home, titel: "Auf Eigenverbrauch umstellen", text: "Zweirichtungszähler statt Einspeisezähler: Jede selbst genutzte kWh ersetzt Netzstrom für über 30 Cent. Mit Speicher steigt der Anteil deutlich.", tag: "Oft sinnvoll" },
              { icon: Recycle, titel: "Komplett erneuern", text: "Neue Module und Wechselrichter auf demselben Dach: rund doppelte Leistung, neue Herstellergarantien und für 20 Jahre die dann gültige Einspeisevergütung.", tag: "Maximaler Ertrag", hervor: true },
            ].map((o, i) => (
              <Reveal key={o.titel} dir="right" delay={i * 90}>
                <div className={`rounded-3xl p-6 ring-1 ${o.hervor ? "bg-ov-500/15 ring-ov-400/40" : "bg-white/[0.04] ring-white/10"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${o.hervor ? "bg-ov-500 text-white" : "bg-white/10 text-ov-300"}`}>
                      <o.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wider text-white/75">{o.tag}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[19px] font-bold text-white">
                    <span className="mr-2 text-ov-300">{i + 1}.</span>
                    {o.titel}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">{o.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Wechselrichter & Module */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Wechselrichter"
          title={data?.third_card_title || "Austausch des Wechselrichters"}
          image={{ src: img(data?.third_card_image), alt: data?.third_card_alt_text || "" }}
          points={[
            "Höherer Wirkungsgrad der neuesten Gerätegeneration",
            "Monitoring per App – Störungen fallen sofort auf",
            "Als Hybridwechselrichter bereit für einen Speicher",
          ]}
        >
          <Fliesstext text={data?.third_card_description?.replace(/\bdir\b/g, "Ihnen").replace(/\bdeines\b/g, "Ihres").replace(/\bprofitierst du\b/g, "profitieren Sie")} className="mt-5 text-[16.5px] leading-relaxed text-ink-600" />
        </SplitMedia>
        <div className="mt-20 md:mt-28">
          <SplitMedia
            reverse
            eyebrow="Module"
            title={data?.fourth_card_title || "Photovoltaik-Module erneuern"}
            image={{ src: img(data?.fourth_card_image), alt: data?.fourth_card_alt_text || "" }}
            points={modulPunkte}
          >
            <Fliesstext text={data?.fourth_card_description?.replace(/Ihre Vorteile mit Ökovolt:\s*$/, "")} className="mt-5 text-[16.5px] leading-relaxed text-ink-600" />
          </SplitMedia>
        </div>
      </Section>

      {/* Erweiterung */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Erweitern"
          title={data?.second_section_title || "Solaranlage erweitern – mehr Sonnenenergie für Ihren Bedarf"}
          className="mb-12"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            {
              titel: data?.second_sec_1st_card_title || "Ungenutzte Dachflächen belegen",
              bild: data?.second_sec_1st_card_image,
              alt: data?.second_sec_1st_card_alt_image,
              text: data?.second_sec_1st_card_description,
              link: { href: "/solarrechner", label: "Ertrag der Erweiterung berechnen" },
            },
            {
              titel: data?.second_sec_2nd_card_title || "Mehr Autarkie mit einem Stromspeicher",
              bild: data?.second_sec_2nd_card_image,
              alt: data?.second_sec_2nd_card_alt_text,
              text: data?.second_sec_2nd_card_description,
              wichtig: data?.second_sec_2nd_card_important_description,
              fett: data?.second_sec_2nd_card_bold_description,
              link: { href: "/rechner/stromspeicher", label: "Speichergröße berechnen" },
            },
          ].map((k, i) => (
            <Reveal key={k.titel} delay={i * 90} className="flex">
              <article className="flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70">
                <div className="relative aspect-[16/9] bg-ink-100">
                  <Image src={img(k.bild)} alt={k.alt || ""} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="ov-h3 text-ink-900">{k.titel}</h3>
                  <Fliesstext text={k.text} className="mt-3 text-[15.5px] leading-relaxed text-ink-600" />
                  {k.wichtig && <p className="mt-4 text-[15.5px] leading-relaxed text-ink-600">{k.wichtig}</p>}
                  {k.fett && (
                    <p className="mt-5 flex gap-3 rounded-2xl bg-ov-50 p-4 text-[15px] font-medium leading-relaxed text-ink-800 ring-1 ring-ov-200/70">
                      <CalendarClock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                      {k.fett}
                    </p>
                  )}
                  <a href={k.link.href} className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                    {k.link.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Praxisbeispiele */}
      {(vorher.length > 0 || vorher2.length > 0) && (
        <Section tone="white" space="lg">
          <SectionHeading
            eyebrow="Aus der Praxis"
            title={data?.third_sec_2nd_card_title || "Beispiel: Repowering mit Ökovolt"}
            lead={data?.third_sec_2nd_card_description}
            className="mb-12"
          />
          {vorher.length > 0 && (
            <Fallbeispiel
              bildVorher={{ src: img(data?.third_sec_2nd_card_first_image), alt: data?.third_sec_2nd_card_first_alt_text }}
              bildNachher={{ src: img(data?.third_sec_2nd_card_second_image), alt: data?.third_sec_2nd_card_second_alt_image }}
              titelVorher={data?.third_sec_2nd_card_first_table_title || "Vor dem Repowering"}
              titelNachher={data?.third_sec_2nd_card_second_table_title || "Nach dem Repowering"}
              vorher={vorher}
              nachher={nachher}
              kennzahlen={[
                { l: "Leistung", v: "6,5 → 15 kWp" },
                { l: "Jahresertrag", v: "≈ 5.000 → 14.000 kWh" },
                { l: "Speicher", v: "0 → 20 kWh" },
              ]}
            />
          )}
          {vorher2.length > 0 && (
            <div className="mt-8">
              <Fallbeispiel
                bildVorher={{ src: img(data?.third_sec_3rd_card_first_image), alt: data?.third_sec_3rd_card_first_alt_text }}
                bildNachher={{ src: img(data?.third_sec_3rd_card_second_card), alt: data?.third_sec_3rd_card_second_alt_text }}
                titelVorher={data?.third_sec_3rd_card_first_title || "Ausgangszustand"}
                titelNachher={data?.third_sec_3rd_card_second_title || "Nach der Modernisierung"}
                vorher={vorher2}
                nachher={nachher2}
                kennzahlen={[
                  { l: "Hauptdach", v: "5,44 → 24,44 kWp" },
                  { l: "Speicher", v: "0 → 22 kWh" },
                ]}
              />
            </div>
          )}
        </Section>
      )}

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Ablauf"
          title="So läuft Ihr Repowering ab"
          lead="Erst messen, dann entscheiden: Grundlage jeder Empfehlung ist ein ehrlicher Blick auf Ihre Bestandsanlage."
          align="center"
          className="mb-14"
        />
        <Steps
          items={[
            { icon: ClipboardCheck, title: "Anlagencheck", text: "Wir prüfen Ertragsdaten, Module, Wechselrichter, Dach, Unterkonstruktion und Zählerschrank vor Ort." },
            { icon: Calculator, title: "Konzept & Rechnung", text: "Tausch, Erweiterung oder Neubau: Sie erhalten Varianten mit Wirtschaftlichkeitsrechnung und klarer Empfehlung." },
            { icon: Wrench, title: "Umbau", text: "Unser Montageteam baut zurück, installiert neu und kümmert sich um die fachgerechte Entsorgung der Altmodule." },
            { icon: Cpu, title: "Anmeldung & Betrieb", text: "Netzbetreiber, Marktstammdatenregister und Inbetriebnahme – danach überwachen Sie Ihre Erträge per App." },
          ]}
        />
      </Section>

      <SolarrechnerTeaser
        titel="Wie viel bringt Ihr Dach mit neuen Modulen?"
        text="Anlagengröße, Verbrauch und Speicher eingeben – der Solarrechner zeigt Ertrag, Ersparnis und Amortisation der erneuerten Anlage."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Repowering – kurz & ehrlich beantwortet"
            lead="Ihre Anlage ist ein Sonderfall? Rufen Sie uns an – wir sehen sie uns gern an."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/service/repowering" />
      <CtaBand
        title="Holen Sie aus Ihrem Dach wieder das Maximum heraus."
        text="Wir prüfen Ihre Bestandsanlage, rechnen Tausch, Erweiterung und Neubau ehrlich durch und setzen die beste Variante aus einer Hand um."
        primary={{ label: "Repowering-Check anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}

function Fallbeispiel({ bildVorher, bildNachher, titelVorher, titelNachher, vorher, nachher, kennzahlen = [] }) {
  return (
    <Reveal>
      <div className="overflow-hidden rounded-[2rem] bg-sand-50 ring-1 ring-ink-200/70">
        <div className="grid lg:grid-cols-2">
          <Seite bild={bildVorher} titel={titelVorher} punkte={vorher} icon={Minus} ton="alt" />
          <Seite bild={bildNachher} titel={titelNachher} punkte={nachher} icon={Check} ton="neu" />
        </div>
        {kennzahlen.length > 0 && (
          <dl className="grid grid-cols-1 gap-px border-t border-ink-200/70 bg-ink-200/70 sm:grid-cols-3">
            {kennzahlen.map((k) => (
              <div key={k.l} className="bg-white px-6 py-5">
                <dt className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">{k.l}</dt>
                <dd className="ov-num mt-1 font-display text-[20px] font-extrabold tracking-tight text-ink-900">{k.v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Reveal>
  );
}

function Seite({ bild, titel, punkte, icon: Icon, ton }) {
  const neu = ton === "neu";
  return (
    <div className={`flex flex-col ${neu ? "border-t-4 border-white lg:border-l-4 lg:border-t-0" : ""}`}>
      <div className="relative">
        <div className="relative aspect-video overflow-hidden bg-ink-100">
          <Image src={bild.src} alt={bild.alt || ""} fill sizes="(max-width: 1024px) 100vw, 45vw" className={`object-cover ${neu ? "" : "grayscale-35"}`} />
          <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wider shadow ${neu ? "bg-ov-600 text-white" : "bg-white/95 text-ink-700"}`}>
            {neu ? "Nachher" : "Vorher"}
          </span>
        </div>
        {neu && (
          <span aria-hidden="true" className="absolute left-1/2 top-0 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 rotate-90 items-center justify-center rounded-full bg-ov-500 text-white shadow-lg ring-4 ring-white lg:left-0 lg:top-1/2 lg:rotate-0">
            <ArrowRight className="h-5 w-5" />
          </span>
        )}
      </div>
      <div className="p-6 md:p-8">
        <h3 className="font-display text-[19px] font-bold text-ink-900">{titel.replace(/:\s*$/, "")}</h3>
        <ul className="mt-4 space-y-3">
          {punkte.map((p) => (
            <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-ink-700">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${neu ? "bg-ov-100 text-ov-700" : "bg-ink-200 text-ink-500"}`}>
                <Icon aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
