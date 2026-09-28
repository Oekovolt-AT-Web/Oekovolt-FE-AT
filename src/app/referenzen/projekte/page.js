// referenzen/projekte/page.js

import Link from "next/link";
import {
  ClipboardCheck,
  Compass,
  HardHat,
  Leaf,
  LineChart,
  Map as MapIcon,
  PiggyBank,
  ShieldCheck,
  Zap,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Reveal from "@/components/ui/Reveal";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Fliesstext from "@/components/Reusable/Fliesstext";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import ProjektPortfolio from "@/components/Project/ProjektPortfolio";
import ReferenzStatistik from "@/components/Project/ReferenzStatistik";
import {
  fmtKwp,
  kennzahlen,
  normalisiereApiProjekt,
} from "@/components/Project/projektDaten";
import {
  API_BASE_URL,
  getApiHeaders,
  isApiConfigured,
} from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";
import Querverweise from "@/components/Reusable/Querverweise";

// Projekte aus der API (oekovolt_app). Seitentexte sind statisch: Die frühere
// Backoffice-Seite (primary_page) lieferte Texte der deutschen Website.
const PROJECTS_API = `${API_BASE_URL}oekovolt_app.website_api.projekte.get_projekte`;
const PFAD = "/referenzen/projekte";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "Photovoltaik-Projekte in Österreich | Ökovolt";
const DESCRIPTION =
  "Referenzen von Ökovolt: Photovoltaikanlagen für Gewerbe, Landwirtschaft, Gemeinden und Privat in Österreich – mit Leistung, Dachart und Ort je Projekt.";

async function fetchProjectsList() {
  if (!isApiConfigured()) return [];

  try {
    const response = await fetch(PROJECTS_API, {
      method: "GET",
      headers: getApiHeaders(),
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      console.error(
        `Projects API returned ${response.status}:`,
        await response.text(),
      );
      return [];
    }

    const data = await response.json();

    const msg = data?.message;
    const liste = Array.isArray(msg)
      ? msg
      : (msg?.projekte ?? msg?.projects ?? msg?.data);

    return Array.isArray(liste) ? liste : [];
  } catch (error) {
    console.error("Error fetching projects list:", error);
    return [];
  }
}

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Photovoltaik Referenzen Österreich",
    "PV-Anlage Gewerbe Referenz",
    "Photovoltaik Projekte",
    "Ökovolt Projekte",
    "Solaranlage Landwirtschaft",
  ],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ökovolt Referenzprojekte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

const VORTEILE = [
  { icon: PiggyBank, title: "Energiekosten senken", text: "Jede selbst genutzte Kilowattstunde spart Energiepreis, Netzentgelte und Abgaben." },
  { icon: Leaf, title: "Nachhaltigkeit belegen", text: "Erzeugung vor Ort verbessert die CO₂-Bilanz – belastbar für Nachhaltigkeitsberichte." },
  { icon: ShieldCheck, title: "Versorgung absichern", text: "Mit Speicher und Ersatzstrom bleibt der Betrieb auch bei Netzausfall handlungsfähig." },
  { icon: LineChart, title: "Planbare Kosten", text: "Solarstrom vom eigenen Dach macht einen Teil der Energiekosten über Jahrzehnte kalkulierbar." },
];

const ABLAUF = [
  {
    icon: Compass,
    title: "Analyse",
    text: "Lastgang, Dach, Tragwerk und Verschattung – die Grundlage jeder guten Anlage.",
  },
  {
    icon: ClipboardCheck,
    title: "Planung",
    text: "Belegungsplan, Statik, Wechselrichter-Topologie und eine ehrliche Wirtschaftlichkeitsrechnung.",
  },
  {
    icon: HardHat,
    title: "Montage",
    text: "Montage und Elektroinstallation nach ÖVE/ÖNORM E 8101 – sauber und sicher.",
  },
  {
    icon: Zap,
    title: "Inbetriebnahme",
    text: "Netzzugangsantrag, Fertigstellungsmeldung, Parkregler und Monitoring.",
  },
];

function faqFuer(k) {
  const spanne =
    k.kleinste && k.groesste
      ? `von ${fmtKwp(k.kleinste.kwp)} kWp bis ${fmtKwp(k.groesste.kwp)} kWp`
      : "vom Wohnhaus bis zum Gewerbedach";
  return [
    {
      q: "Welche Anlagengrößen setzt Ökovolt um?",
      a: `Die hier gezeigten Referenzen reichen ${spanne}. Gewerbe-, Industrie- und Landwirtschaftsdächer liegen meist deutlich über Wohnhäusern. Die richtige Größe ergibt sich aus Lastgang, Dachfläche, Tragwerk und Netzanschluss – nicht aus der maximal möglichen Belegung.`,
    },
    {
      q: "Was bedeutet die Angabe kWp?",
      a: "Kilowatt-Peak (kWp) ist die Nennleistung der Module unter genormten Testbedingungen. Sie macht Anlagen vergleichbar. Als Orientierung erzeugt 1 kWp in Österreich nach Süden mit 35° Neigung laut PVGIS rund 1.100 bis 1.350 kWh Strom pro Jahr, je nach Standort.",
    },
    {
      q: "Eignet sich auch mein Dach – Flachdach, Ziegel oder Trapezblech?",
      a: "In den meisten Fällen ja. Unsere Referenzen umfassen Ziegel- und Satteldächer, Flachdächer mit Ost-West-Aufständerung, Trapez- und Sandwichdächer sowie Fassadenanlagen. Entscheidend sind Statik, Verschattung und der Zustand der Dachhaut – das prüfen wir vor dem Angebot.",
    },
    {
      q: "Plant Ökovolt auch Gewerbe- und Landwirtschaftsanlagen?",
      a: "Ja, das ist unser Schwerpunkt: Hallen, Betriebsgebäude, landwirtschaftliche Dächer und Anlagen für Gemeinden. Bei größeren Anlagen gewinnen Lastgang, Netzanschluss nach TOR und Parkregler an Bedeutung – das übernehmen wir aus einer Hand.",
    },
    {
      q: "Wie läuft ein Projekt von der Anfrage bis zur Inbetriebnahme ab?",
      a: "Nach Ihrer Anfrage analysieren wir Lastgang und Dach, erstellen Planung, Statik-Vorprüfung, Wirtschaftlichkeitsrechnung und Angebot. Nach Auftrag folgen Netzzugangsantrag, Montage, Fertigstellungsmeldung durch unseren Elektrotechniker und Inbetriebnahme. Bei Dachanlagen bis rund 250 kWp dauert das meist drei bis sechs Monate.",
    },
    {
      q: "Kann ich mir Anlagen in meiner Nähe ansehen?",
      a: `Auf unserer Referenzkarte sehen Sie, wo wir bereits Anlagen realisiert haben. Von unserem Firmensitz in ${FIRMA.ort} aus bauen wir in allen neun Bundesländern. Sprechen Sie uns gern auf vergleichbare Projekte in Ihrer Umgebung an.`,
    },
  ];
}

export default async function ProjektePage() {
  const projectsList = await fetchProjectsList();

  const projekte = projectsList.map(normalisiereApiProjekt).filter((p) => p.slug);

  const k = kennzahlen(projekte);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#collectionpage`,
    url: PAGE_URL,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    ...(projekte.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projekte.length,
        itemListElement: projekte.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.titel,
          url: `${PAGE_URL}/${p.slug}`,
        })),
      },
    }),
  };

  const vorteile = VORTEILE;

  const heroStats = projekte.length
    ? [
        { value: k.anzahl, label: "Referenzprojekte" },
        {
          value: Math.round(k.summeKwp),
          suffix: " kWp",
          label: "dokumentierte Leistung",
        },
        { value: k.orte, label: "Orte" },
      ]
    : [];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[
          { name: "Referenzen", href: "/referenzen/projekte" },
          { name: "Projekte" },
        ]}
        eyebrow="Referenzen Österreich"
        title={
          <>
            Photovoltaik-Projekte in Österreich, die{" "}
            <span className="ov-text-gradient-light">heute Strom liefern</span>
          </>
        }
        lead="Photovoltaikanlagen für Gewerbe, Industrie, Landwirtschaft und Gemeinden – und ausgewählte Premium-Wohnhäuser. Jede Referenz mit Leistung, Dachart und Ort."
        image={
          k.groesste?.bilder?.length
            ? {
                src: k.groesste.bild,
                alt: `Photovoltaikanlage ${k.groesste.titel} mit ${k.groesste.leistungText}`,
              }
            : {
                src: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg",
                alt: "Luftaufnahme eines Gebäudes am Seeufer mit Photovoltaik auf mehreren Dachflächen",
              }
        }
        actions={[
          { label: "Eigene Anlage anfragen", href: "/angebot" },
          {
            label: "Referenzkarte öffnen",
            href: "/referenzen/referenzkarte",
            icon: MapIcon,
          },
        ]}
        stats={heroStats}
      />

      {/* Portfolio */}
      <Section tone="sand" space="lg" id="projekte">
        <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Projekte"
            title={
              <>
                Echte Anlagen,{" "}
                <span className="ov-text-gradient">echte Kennzahlen</span>
              </>
            }
            lead="Filtern Sie nach Objektart, Leistung, Dach oder Ort und finden Sie Anlagen, die Ihrem Vorhaben ähneln."
          />
          <p className="hidden text-[16px] leading-relaxed text-ink-600 lg:block lg:pb-1">
            Gezeigt werden Anlagen, die wir geplant und errichtet haben. Kundennamen nennen wir nur mit Zustimmung.
          </p>
        </div>
        {projekte.length > 0 ? (
          <ProjektPortfolio projekte={projekte} />
        ) : (
          <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-ink-200">
            <p className="font-display text-[20px] font-bold text-ink-900">
              Wir ergänzen die Projektübersicht laufend.
            </p>
            <p className="mt-2 text-ink-600">
              Rufen Sie uns an – wir nennen Ihnen gern vergleichbare Referenzen in Ihrer Nähe:{" "}
              <a href={FIRMA.telefonHref} className="font-semibold text-ov-700 hover:text-ov-800">
                {FIRMA.telefon}
              </a>
              . Oder lesen Sie, wie wir{" "}
              <Link href="/gewerbe" className="font-semibold text-ov-700 hover:text-ov-800">
                Photovoltaik für Gewerbe &amp; Industrie
              </Link>{" "}
              planen.
            </p>
          </div>
        )}
      </Section>

      {/* Kennzahlen */}
      {projekte.length >= 3 && (
        <Section tone="navy" space="lg" className="overflow-hidden">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div
            aria-hidden="true"
            className="absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]"
          />
          <ReferenzStatistik projekte={projekte} />
        </Section>
      )}

      {/* Technik */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Technik, die mitdenkt"
          title="Eigene Regelungs- und Leittechnik in jedem Projekt"
          text="Parkregler, Fernwartung und SCADA entwickeln wir selbst. So regeln wir Einspeiselimit und Blindleistung nach den Vorgaben des Netzbetreibers und überwachen jede Anlage über ihre gesamte Laufzeit."
          points={[
            "Parkregler (EZA-Regler) für den TOR-konformen Netzanschluss",
            "Fernwartung und Monitoring über die gesamte Laufzeit",
            "Einbindung von Speicher, Ladeinfrastruktur und Wärmepumpe",
          ]}
          image={{
            src: "/Images/Referenzen/Projekte-2.jpg",
            alt: "Solarmodule auf einem Dach",
          }}
          action={{
            label: "Photovoltaik-Leistungen ansehen",
            href: "/dienstleistungen/photovoltaik",
            variant: "secondary",
          }}
        />
      </Section>

      {/* Vorteile */}
      {vorteile.length > 0 && (
        <Section tone="sand" space="lg">
          <SectionHeading
            eyebrow="Warum Photovoltaik"
            title="Vorteile einer eigenen Energieversorgung"
            lead="Was unsere Kunden aus Gewerbe, Landwirtschaft und öffentlicher Hand mit ihrer Anlage erreichen wollen."
            align="center"
            className="mb-12"
          />
          <FeatureGrid items={vorteile} cols={4} />
        </Section>
      )}

      {/* Ablauf */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="So entsteht jede Referenz"
              title="Ganzheitliche Planung und Umsetzung"
            />
            <Fliesstext
              text="Jede Referenz durchläuft denselben Ablauf – von der Lastganganalyse bis zur Fertigstellungsmeldung. Ein Ansprechpartner begleitet das Projekt, unser eigenes Elektrotechnik-Team errichtet und prüft die Anlage."
              className="mt-5 space-y-4 text-[16.5px] leading-relaxed text-ink-600"
            />
          </div>
          <ol className="relative grid gap-4 sm:grid-cols-2">
            {ABLAUF.map((s, i) => (
              <Reveal
                as="li"
                key={s.title}
                delay={i * 90}
                className="relative rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ov-600 shadow-sm ring-1 ring-ov-200">
                    <s.icon
                      aria-hidden="true"
                      className="h-6 w-6"
                      strokeWidth={1.8}
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="ov-num font-display text-[34px] font-extrabold leading-none text-ink-200"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="ov-h3 mt-5 text-ink-900">{s.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">
                  {s.text}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <SolarrechnerTeaser
        href="/solarrechner"
        cta="Ertrag berechnen"
        titel="Wie viel kWp passen auf Ihr Dach?"
        text="Dachfläche, Ausrichtung und Verbrauch eingeben – der Solarrechner zeigt eine erste Einschätzung zu Anlagengröße, Jahresertrag und Amortisation."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Referenzen & Anlagenplanung"
            lead={`Ihre Frage ist nicht dabei? Rufen Sie uns an: ${FIRMA.telefon} (${FIRMA.oeffnungszeiten.map((o) => `${o.tage} ${o.zeit}`).join(", ")}).`}
          />
          <Faq items={faqFuer(k)} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        eyebrow="Ihr Projekt als nächste Referenz"
        title="Eine Anlage wie diese – für Ihren Standort?"
        text={`Wir planen Ihre Photovoltaikanlage so sorgfältig wie jede Referenz auf dieser Seite: mit Lastganganalyse, ehrlicher Wirtschaftlichkeitsrechnung und festem Ansprechpartner von ${FIRMA.name} aus ${FIRMA.ort}.`}
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
