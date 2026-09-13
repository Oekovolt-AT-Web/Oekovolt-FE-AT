// src/app/ratgeber/page.js

import Link from "next/link";
import { ArrowUpRight, BookOpen, Calculator, HelpCircle } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { ArtikelKarte } from "@/components/Ratgeber/Bausteine";
import { alleArtikel, artikelPfad } from "@/lib/ratgeber";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";
import { WALLBOX, spanne } from "@/data/wallbox";
import { BEGRIFFE } from "@/data/lexikon";

const BASE_URL = "https://www.oekovolt.de";
const PAGE_URL = `${BASE_URL}/ratgeber`;

const DESCRIPTION =
  "Photovoltaik verständlich erklärt: Einspeisevergütung 2026, Kosten je kWp, Stromspeicher und Wallbox – fundierte Ratgeber vom Fachbetrieb aus dem Allgäu.";

// Deutschlandspezifischer Content -> kein hreflang, nur Canonical.
export const metadata = {
  title: "PV-Ratgeber 2026: Kosten, Förderung & Technik | Ökovolt",
  description: DESCRIPTION,
  keywords: ["Photovoltaik Ratgeber", "Solaranlage Ratgeber", "Einspeisevergütung", "Photovoltaik Kosten", "Photovoltaik Förderung", "Wallbox Installation"],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Ökovolt Deutschland",
    title: "Photovoltaik-Ratgeber | Ökovolt",
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Photovoltaik-Ratgeber" }],
  },
};

export default function RatgeberPage() {
  const artikel = alleArtikel();
  const [top, ...rest] = artikel;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}/#collection`,
        name: "Photovoltaik-Ratgeber",
        description: DESCRIPTION,
        inLanguage: "de-DE",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntity: { "@id": `${PAGE_URL}/#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}/#list`,
        itemListElement: artikel.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.title,
          url: `${BASE_URL}${artikelPfad(a.slug)}`,
        })),
      },
    ],
  };

  // Zitierfähige Kennzahlen – alle aus den zentralen Datenquellen.
  const fakten = [
    { wert: `${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct`, text: `Einspeisevergütung je kWh für Anlagen bis 10 kWp (Inbetriebnahme ab ${VERGUETUNG.gueltigAbLabel})`, href: "/ratgeber/einspeiseverguetung-2026" },
    { wert: `~${Math.round((10 * preisProKwp(10)) / 1000)}.000 €`, text: "kostet eine schlüsselfertige 10-kWp-Anlage 2026 ohne Speicher", href: "/ratgeber/solaranlage-kosten" },
    { wert: "0 %", text: "Umsatzsteuer auf PV-Anlagen und Speicher an Wohngebäuden (§ 12 Abs. 3 UStG)", href: "/forderungen/steuerlich" },
    { wert: spanne([WALLBOX.gesamtVon, WALLBOX.gesamtBis]).replace(" €", ""), text: "Euro kostet eine 11-kW-Wallbox inklusive Installation im Einfamilienhaus", href: "/ratgeber/wallbox-installation" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Ratgeber" }]}
        eyebrow="Wissen vom Fachbetrieb · Stand September 2026"
        title={
          <>
            Photovoltaik-<span className="ov-text-gradient-light">Ratgeber</span>
          </>
        }
        lead="Was kostet eine Anlage, wie viel bringt die Einspeisung, welche Wallbox passt? Hier beantworten wir die Fragen, die uns in der Beratung am häufigsten gestellt werden – ehrlich, gründlich und ohne Fachchinesisch."
        stats={[
          { value: artikel.length, label: "ausführliche Ratgeber" },
          { value: BEGRIFFE.length, label: "Begriffe im Lexikon" },
          { value: 15, suffix: "+", label: "Jahre Praxiserfahrung" },
        ]}
      />

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Neu & aktualisiert" title="Aktuelle Artikel" className="mb-10" />
        {artikel.length === 0 ? (
          <p className="text-[16px] text-ink-600">Die ersten Beiträge erscheinen in Kürze.</p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
            {top && <ArtikelKarte artikel={top} gross />}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {rest.map((a, i) => (
                <ArtikelKarte key={a.slug} artikel={a} delay={(i + 1) * 90} />
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading dark eyebrow="Mehr Wissen" title="Kurz nachschlagen oder selbst rechnen" className="mb-12" />
          <FeatureGrid
            tone="dark"
            cols={3}
            items={[
              { icon: BookOpen, title: "Photovoltaik-Lexikon", text: `${BEGRIFFE.length} Fachbegriffe von Autarkiegrad bis Zyklenfestigkeit – jeweils mit Definition in einem Satz.`, href: "/wissen/lexikon" },
              { icon: HelpCircle, title: "Häufige Fragen", text: "Kurze Antworten zu Planung, Kosten, Speicher, Anmeldung und Service – mit Suche.", href: "/faqs" },
              { icon: Calculator, title: "Solarrechner", text: `Ertrag, Autarkie und Amortisation mit ${Math.round(ANNAHMEN.strompreis * 100)} ct Strompreis und den EEG-Sätzen 2026.`, href: "/solarrechner" },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Auf einen Blick"
            title="Zahlen, die Sie 2026 kennen sollten"
            lead="Die wichtigsten Richtwerte aus unseren Ratgebern – regelmäßig geprüft und mit der ausführlichen Erklärung verlinkt."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {fakten.map((f, i) => (
              <Reveal as="li" key={f.href} delay={i * 70} className="flex">
                <Link href={f.href} className="group ov-card-hover relative flex w-full flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 hover:bg-white hover:ring-ov-200 md:p-7">
                  <ArrowUpRight aria-hidden="true" className="absolute right-5 top-5 h-5 w-5 text-ink-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ov-600" />
                  <span className="ov-num font-display text-[clamp(1.9rem,1.5rem+1.2vw,2.6rem)] font-extrabold leading-none tracking-tight text-ink-900">{f.wert}</span>
                  <span className="mt-3 text-[15px] leading-relaxed text-ink-600">{f.text}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand
        title="Genug gelesen? Wir rechnen Ihr Projekt konkret durch."
        text="Aus Richtwerten wird ein Angebot: Wir prüfen Dach, Zählerschrank und Verbrauch und planen die Anlage, die zu Ihnen passt – vom Fachbetrieb aus Türkheim."
      />
    </>
  );
}
