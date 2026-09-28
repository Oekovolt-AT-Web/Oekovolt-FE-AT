// src/app/ratgeber/page.js

import Link from "next/link";
import { ArrowUpRight, BatteryCharging, BookOpen, Calculator, Car, Cpu, Euro, HelpCircle, Network, Scale } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { ArtikelKarte } from "@/components/Ratgeber/Bausteine";
import RatgeberListe from "@/components/Ratgeber/RatgeberListe";
import FolgenBox from "@/components/Kanaele/FolgenBox";
import { KATEGORIEN, alleArtikel, artikelPfad } from "@/lib/ratgeber";
import { BEGRIFFE } from "@/data/lexikon";
import { BASE_URL, SITE_NAME, LOCALE } from "@/lib/site";

const KATEGORIE_ICONS = {
  "Kosten & Wirtschaftlichkeit": Euro,
  "Technik & Planung": Cpu,
  "Speicher & Eigenverbrauch": BatteryCharging,
  "E-Mobilität & Sektorkopplung": Car,
  "Förderung, Steuern & Recht": Scale,
  "Netz, Energiegemeinschaften & Markt": Network,
};

const PAGE_URL = `${BASE_URL}/ratgeber`;

const DESCRIPTION =
  "Photovoltaik-Ratgeber für Österreich: Wirtschaftlichkeit, EAG-Förderung, Steuern, Netzanschluss, Speicher und Energiegemeinschaften für Betriebe und Gemeinden.";

// Österreichspezifischer Content -> kein hreflang, nur Canonical.
export const metadata = {
  title: "PV-Ratgeber Österreich 2026: Gewerbe & Förderung | Ökovolt",
  description: DESCRIPTION,
  keywords: [
    "Photovoltaik Ratgeber Österreich",
    "Photovoltaik Gewerbe",
    "EAG Investitionszuschuss",
    "Investitionsfreibetrag Photovoltaik",
    "Photovoltaik Kosten Österreich",
    "Energiegemeinschaft",
    "OeMAG Marktpreis",
  ],
  alternates: {
    canonical: PAGE_URL,
    types: {
      "application/rss+xml": [{ url: "/ratgeber/rss.xml", title: "Ökovolt Ratgeber" }],
      "application/activity+json": [{ url: `${BASE_URL}/api/ap/users/ratgeber`, title: "@ratgeber@oekovolt.com" }],
    },
  },
  other: { "fediverse:creator": "@ratgeber@oekovolt.com" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: LOCALE,
    title: "Photovoltaik-Ratgeber Österreich | Ökovolt",
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Photovoltaik-Ratgeber Österreich" }],
  },
};

export default function RatgeberPage() {
  const artikel = alleArtikel();
  // Redaktionell empfohlene Artikel (suchstärkste Themen); Fallback: neueste
  const EMPFOHLEN = ["photovoltaik-gewerbe", "eag-investitionszuschuss", "investitionsfreibetrag-photovoltaik"];
  const empfohlen = EMPFOHLEN.map((s) => artikel.find((a) => a.slug === s)).filter(Boolean);
  const [top, ...rest] = empfohlen.length === EMPFOHLEN.length ? empfohlen : artikel;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}/#collection`,
        name: "Photovoltaik-Ratgeber Österreich",
        description: DESCRIPTION,
        inLanguage: "de-AT",
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

  // Zitierfähige Kennzahlen – Stand 09/2026, Quellen jeweils im verlinkten Ratgeber.
  const fakten = [
    { wert: "22 %", text: "Öko-Investitionsfreibetrag auf PV-Anlagen und Speicher, die bis 31. Dezember 2026 angeschafft werden (§ 11 EStG)", href: "/ratgeber/investitionsfreibetrag-photovoltaik" },
    { wert: "8.–22.10.", text: "letzter EAG-Fördercall 2026 für Photovoltaik und Stromspeicher – bis 130 €/kWp (C) bzw. 120 €/kWp (D)", href: "/ratgeber/eag-investitionszuschuss" },
    { wert: "806 €", text: "je kWp netto kostete eine schlüsselfertige 30–50-kWp-Anlage in Österreich laut BMWET-Marktstatistik 2024", href: "/ratgeber/solaranlage-kosten" },
    { wert: "0 ct", text: "Elektrizitätsabgabe auf selbst erzeugten und selbst verbrauchten Solarstrom – ohne Mengengrenze", href: "/ratgeber/photovoltaik-steuern" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Ratgeber" }]}
        eyebrow="Fachwissen für Österreich · Stand September 2026"
        title={
          <>
            Photovoltaik-<span className="ov-text-gradient-light">Ratgeber</span>
          </>
        }
        lead="Rechnet sich PV für Ihren Betrieb, welche Förderung und welcher Freibetrag gelten, was verlangt der Netzbetreiber? Wir beantworten die Fragen von Geschäftsführung, Technik und Einkauf – nach österreichischer Rechtslage, mit Zahlen und Quellen."
        stats={[
          { value: artikel.length, label: "ausführliche Ratgeber" },
          { value: BEGRIFFE.length, label: "Begriffe im Lexikon" },
          { value: new Date().getFullYear() - 2012, label: "Jahre PV-Praxis in Österreich (seit 2012)" },
        ]}
      />

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Themenbereiche" title="Wählen Sie Ihr Thema" className="mb-10" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KATEGORIEN.map((k, i) => {
            const liste = artikel.filter((a) => a.kategorie === k);
            const Icon = KATEGORIE_ICONS[k] || BookOpen;
            return (
              <Reveal as="li" key={k} delay={i * 60} className="flex">
                <div className="flex w-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[17px] font-bold leading-snug text-ink-900">{k}</h3>
                  <p className="mt-1 text-[13.5px] text-ink-500">{liste.length} {liste.length === 1 ? "Artikel" : "Artikel"}</p>
                  <ul className="mt-4 space-y-2 text-[14px]">
                    {liste.slice(0, 4).map((a) => (
                      <li key={a.slug}>
                        <Link href={artikelPfad(a.slug)} className="text-ink-700 underline-offset-2 hover:text-ov-700 hover:underline">
                          {a.kurzTitel || a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </ul>

        {top && (
          <div className="mt-14">
            <SectionHeading eyebrow="Neu & aktualisiert" title="Empfohlener Artikel" className="mb-8" />
            <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
              <ArtikelKarte artikel={top} gross />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {rest.slice(0, 2).map((a, i) => (
                  <ArtikelKarte key={a.slug} artikel={a} delay={(i + 1) * 90} />
                ))}
              </div>
            </div>
          </div>
        )}
      </Section>

      <Section tone="white" space="lg" id="alle-artikel">
        <SectionHeading eyebrow="Alle Ratgeber" title="Alle Artikel durchsuchen" className="mb-10" />
        <RatgeberListe
          kategorien={KATEGORIEN}
          artikel={artikel.map(({ slug, title, excerpt, kategorie, bild, bildAlt, lesezeit, keywords }) => ({ slug, title, excerpt, kategorie, bild, bildAlt, lesezeit, keywords: keywords || [] }))}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_440px] lg:gap-16">
          <SectionHeading
            eyebrow="Nichts verpassen"
            title="Neue Fachartikel direkt in Ihren Feed"
            lead="Folgen Sie dem Ratgeber im Fediverse – zum Beispiel über Mastodon oder Threads, auch mit dem Konto Ihrer Gemeinde oder Ihres Energieversorgers –, abonnieren Sie den RSS-Feed oder aktivieren Sie Push-Benachrichtigungen. Ohne Algorithmus, ohne Werbung."
          />
          <FolgenBox konten={["ratgeber"]} pushThema="ratgeber" />
        </div>
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
              { icon: Calculator, title: "Rechner", text: "Ertrag, Eigenverbrauch, Speicher und Amortisation für Ihr Dach – als erste Orientierung vor dem Angebot.", href: "/rechner" },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Auf einen Blick"
            title="Zahlen, die Sie 2026 kennen sollten"
            lead="Die wichtigsten Werte zur österreichischen Rechts- und Förderlage – regelmäßig geprüft und mit der ausführlichen Erklärung und den Quellen verlinkt."
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
        text="Aus Richtwerten wird ein Angebot: Wir werten Ihren Lastgang aus, prüfen Dach, Statik und Netzanschluss und planen die Anlage, die zu Ihrem Betrieb passt – Ökovolt aus Ostermiething, seit 2012 in ganz Österreich."
      />
    </>
  );
}
