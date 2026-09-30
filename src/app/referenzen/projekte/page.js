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
import { fmtKwp, kennzahlen } from "@/components/Project/projektDaten";
import { ladeProjekte } from "@/components/Project/ladeProjekte";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";
import Querverweise from "@/components/Reusable/Querverweise";
import { ReferenzNamenBand, ReferenzWand } from "@/components/Project/ReferenzNamen";
import Kennzahlenband from "@/components/Produktdetail/Kennzahlenband";
import { KERNFAKTEN, REFERENZ_UNTERNEHMEN } from "@/data/hero";
import { KENNZAHLEN } from "@/data/kennzahlen";

// Projekte aus der API (oekovolt_app), sonst aus src/data/projekte.js (ladeProjekte).
// Seitentexte sind statisch: Die frühere Backoffice-Seite (primary_page) lieferte Texte
// der deutschen Website.
const PFAD = "/referenzen/projekte";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "Photovoltaik-Projekte in Österreich | Ökovolt";
const DESCRIPTION =
  "Referenzen von Ökovolt: Photovoltaikanlagen für Gewerbe, Landwirtschaft, Gemeinden und Privat in Österreich – mit Leistung, Dachart und Ort je Projekt.";

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
  const projekte = await ladeProjekte();

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

  // Gesamtzahlen Ökovolt Österreich (src/data/kennzahlen.js) – die Online-Referenzen sind nur ein Ausschnitt
  const [kzAnlagen, kzLeistung] = KENNZAHLEN;
  const gesamt = [
    { value: kzAnlagen.zahl, suffix: kzAnlagen.suffix, label: kzAnlagen.label },
    { value: kzLeistung.zahl, suffix: kzLeistung.suffix, label: kzLeistung.label },
  ];
  const heroStats = [
    ...gesamt,
    projekte.length
      ? { value: k.anzahl, label: "Referenzen hier online dokumentiert" }
      : { value: REFERENZ_UNTERNEHMEN.length, label: "öffentlich gelistete Referenzunternehmen" },
  ];

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

      <ReferenzNamenBand />

      {/* Portfolio */}
      <Section tone="sand" space="lg" id="projekte">
        <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {projekte.length > 0 ? (
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
          ) : (
            <SectionHeading
              eyebrow="Referenzen nach Branche"
              title={
                <>
                  Unternehmen, die mit uns{" "}
                  <span className="ov-text-gradient">Strom erzeugen</span>
                </>
              }
              lead="Industrie, Holz, Handel, Logistik, Tourismus und Landwirtschaft – eine Auswahl unserer öffentlich gelisteten Referenzen in Österreich."
            />
          )}
          <p className="hidden text-[16px] leading-relaxed text-ink-600 lg:block lg:pb-1">
            Gezeigt werden Anlagen, die wir geplant und errichtet haben. Kundennamen nennen wir nur mit Zustimmung.
          </p>
        </div>
        {projekte.length > 0 ? (
          <ProjektPortfolio projekte={projekte} />
        ) : (
          <>
            <ReferenzWand vorhandeneSlugs={new Set(projekte.map((p) => p.slug))} telefon={FIRMA.telefon} telefonHref={FIRMA.telefonHref} />
            <p className="mt-6 text-center text-[14.5px] text-ink-600">
              Wie wir solche Anlagen planen, lesen Sie unter{" "}
              <Link href="/gewerbe" className="font-semibold text-ov-700 hover:text-ov-800">
                Photovoltaik für Gewerbe &amp; Industrie
              </Link>{" "}
              – oder sehen Sie sich die{" "}
              <Link href="/referenzen/referenzkarte" className="font-semibold text-ov-700 hover:text-ov-800">
                Referenzkarte
              </Link>{" "}
              an.
            </p>
          </>
        )}
      </Section>

      {/* Kennzahlen */}
      {projekte.length < 3 && (
        <Kennzahlenband tone="light" items={KERNFAKTEN.map((f) => ({ wert: f.wert, label: f.label }))} />
      )}
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
