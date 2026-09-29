// src/app/produkte/mieterstrom/page.js
//
// Pfad bleibt aus SEO-Gründen /produkte/mieterstrom (hreflang-Pendant zur
// deutschen Seite). Inhalt nach österreichischem Recht: gemeinschaftliche
// Erzeugungsanlagen (GEA) im Mehrparteienhaus und Gewerbepark.
//
// Rechtsstand 28.09.2026:
//   - bis 30.09.2026: § 16a ElWOG 2010
//   - ab 01.10.2026: ElWG (BGBl. I Nr. 91/2025, in Kraft seit 24.12.2025),
//     Definition GEA § 6 Abs. 1 Z 58, Nahe-/Standortbereich § 70 Abs. 6 Z 1 und 2,
//     Peer-to-Peer § 68, Lieferantenpflichten § 69
// Quellen: https://energiegemeinschaften.gv.at/faqs-zum-elwg/ ,
//          https://energiegemeinschaften.gv.at/rechtliche-grundlagen-elwg/ ,
//          https://cms.law/de/aut/legal-updates/gemeinsame-energienutzung-welche-moeglichkeiten-schafft-das-elwg
// Keine Backoffice-Texte mehr: Die bisherige API lieferte das deutsche
// Mieterstrom-Modell (EnWG/EEG), das in Österreich nicht gilt.

import {
  BadgeEuro,
  Building,
  Building2,
  Calculator,
  ClipboardCheck,
  FileText,
  Gauge,
  Handshake,
  LineChart,
  Scale,
  Share2,
  Store,
  Sun,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Kennzahlenband from "@/components/Produktdetail/Kennzahlenband";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import ModellVergleich from "@/components/Mieterstrom/ModellVergleich";
import Rechenbeispiel from "@/components/Mieterstrom/Rechenbeispiel";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";

const PFAD = "/produkte/mieterstrom";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "Gemeinschaftliche Erzeugungsanlage (GEA) | Ökovolt";
const DESCRIPTION =
  "Gemeinschaftliche Erzeugungsanlage nach ElWG: PV-Strom im Mehrparteienhaus und Gewerbepark teilen – Anlage, Messung, Schlüssel und Vertrag aus einer Hand.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Gemeinschaftliche Erzeugungsanlage", "GEA Photovoltaik", "PV Mehrparteienhaus", "Photovoltaik Wohnanlage", "Gewerbepark Photovoltaik", "ElWG"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Photovoltaik auf einem Mehrparteienhaus" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const LEISTUNGEN = [
  { icon: Wrench, title: "PV-Anlage & Hauptleitung", text: "Planung und Errichtung der Anlage, Anbindung an die gemeinsame Hauptleitung und Anpassung des Zählerschranks." },
  { icon: Gauge, title: "Messung & Netzbetreiber", text: "Meldung der GEA beim Netzbetreiber, Zuordnung der Zählpunkte, Viertelstundenmessung aller Teilnehmer." },
  { icon: FileText, title: "Vertrag & Schlüssel", text: "Vorlage für den Errichtungs- und Betriebsvertrag mit statischem oder dynamischem Aufteilungsschlüssel – abgestimmt mit Ihrer Rechtsberatung." },
  { icon: LineChart, title: "Überschuss & Betrieb", text: "Abnahmevertrag für den Überschuss, Monitoring, Wartung und auf Wunsch Unterstützung bei der Abrechnung." },
];

const FAQ = [
  {
    q: "Was ist eine gemeinschaftliche Erzeugungsanlage?",
    a: "Eine gemeinschaftliche Erzeugungsanlage (GEA) ist eine Photovoltaikanlage, deren Strom mehrere Teilnehmer im selben Gebäude oder am selben Standort nutzen – über die gemeinsame Hauptleitung, ohne das öffentliche Netz. Jeder Teilnehmer behält seinen eigenen Zählpunkt und Stromliefervertrag für den Reststrom. Rechtsgrundlage war bisher § 16a ElWOG 2010, ab 1. Oktober 2026 regelt das ElWG die GEA.",
  },
  {
    q: "Was ändert sich mit dem ElWG ab 1. Oktober 2026?",
    a: "Die GEA bleibt bestehen und wird in das neue System übergeführt; bestehende Verträge sollten geprüft und angepasst werden. Neu ist der Standortbereich: Teilnehmer können auch über mehrere Hauptleitungen verbunden sein, wenn diese an derselben Sammelschiene hängen – etwa in Wohnanlagen mit mehreren Stiegen oder in Gewerbeparks. Zusätzlich führt das ElWG Peer-to-Peer-Verträge und die Eigenversorgungsanlage als neue Modelle ein.",
  },
  {
    q: "Welche Kosten entfallen beim GEA-Strom?",
    a: "Für den Solarstrom, der innerhalb der GEA verteilt wird, fallen keine Netzentgelte an, weil das öffentliche Netz nicht genutzt wird. Laut der Informationsplattform energiegemeinschaften.gv.at ist dieser Strom auch von der Elektrizitätsabgabe befreit. Den Preis für den GEA-Strom vereinbaren Betreiber und Teilnehmer im Vertrag.",
  },
  {
    q: "Wie wird der Solarstrom auf die Teilnehmer aufgeteilt?",
    a: "Über einen Aufteilungsschlüssel im Errichtungs- und Betriebsvertrag. Beim statischen Schlüssel erhält jeder Teilnehmer einen festen Anteil der Erzeugung, beim dynamischen richtet sich der Anteil nach dem jeweiligen Verbrauch in jeder Viertelstunde. Der Netzbetreiber ordnet die Werte anhand der Smart-Meter-Daten zu.",
  },
  {
    q: "Müssen alle Bewohner teilnehmen?",
    a: "Nein. Die Teilnahme ist freiwillig, jeder Haushalt kann seinen Stromlieferanten weiterhin frei wählen. Wer nicht teilnimmt, bezieht wie bisher nur Strom aus dem Netz. In der Praxis steigt die Wirtschaftlichkeit mit der Zahl der Teilnehmer, weil mehr Solarstrom im Haus bleibt.",
  },
  {
    q: "Ab wann gelten für den Betreiber Lieferantenpflichten?",
    a: "Nach dem ElWG treffen Betreiber gemeinsamer Energienutzung erst oberhalb bestimmter Leistungsgrenzen lieferantenähnliche Pflichten wie Vertragsbedingungen, transparente Rechnung und Informationen: bei Haushaltskunden über 30 kW, bei anderen aktiven Kunden und Gemeinschaften über 100 kW Erzeugungsleistung. Wir berücksichtigen das bereits bei der Dimensionierung.",
  },
  {
    q: "Eignet sich eine GEA auch für Gewerbeparks und Betriebe?",
    a: "Ja. Wenn mehrere Mieter eines Gewerbeobjekts oder Gewerbeparks an derselben Hauptleitung oder – ab Oktober 2026 – im selben Standortbereich angeschlossen sind, kann der Eigentümer eine GEA betreiben. Liegen die Verbraucher an verschiedenen Netzanschlüssen, ist eine Erneuerbare-Energie-Gemeinschaft oft die bessere Lösung.",
  },
];

export default function GemeinschaftlicheErzeugungsanlagePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${PAGE_URL}/#service` },
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}/#service`,
        name: "Gemeinschaftliche Erzeugungsanlagen (GEA)",
        serviceType: "Photovoltaik für Mehrparteienhäuser und Gewerbeparks mit Messkonzept und Aufteilung",
        description: DESCRIPTION,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
        audience: { "@type": "BusinessAudience", name: "Hauseigentümer, Wohnungseigentümergemeinschaften, Bauträger, Gemeinden und Gewerbeparks" },
        url: PAGE_URL,
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Gemeinschaftliche Erzeugungsanlage" }]}
        eyebrow="GEA · Mehrparteienhaus & Gewerbepark"
        title={
          <>
            Solarstrom vom Dach – <span className="ov-text-gradient-light">gemeinsam im Gebäude genutzt</span>
          </>
        }
        lead="Mit einer gemeinschaftlichen Erzeugungsanlage teilen Bewohner eines Mehrparteienhauses oder Mieter eines Gewerbeparks den Strom einer Photovoltaikanlage – über die eigene Hauptleitung, ohne Netzentgelte für den intern verteilten Strom. Wir planen Anlage, Messung und Aufteilung nach österreichischem Recht."
        image={{ src: "/Images/AT/produkte-regionen/mieterstrom-mehrfamilienhaus-pv.jpg", alt: "Mehrfamilienhaus mit Photovoltaikanlage auf dem Flachdach (Symbolbild)", position: "50% 35%" }}
        points={["Nach ElWG ab 1. Oktober 2026", "Wohnanlage, WEG, Gewerbepark", "Statischer oder dynamischer Schlüssel", "Anlage, Messung & Vertrag aus einer Hand"]}
        actions={[
          { label: "GEA-Projekt anfragen", href: "/angebot" },
          { label: "Modelle vergleichen", href: "#modelle", icon: Scale },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Building2 aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">0 € Netzentgelt</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">für den im Gebäude verteilten Solarstrom</p>
            </div>
          </div>
        }
      />

      <Kennzahlenband
        tone="light"
        items={[
          { value: 0, suffix: " €", label: "Netzentgelt für den im Gebäude verteilten Solarstrom" },
          { wert: "1.10.2026", label: "GEA nach dem neuen ElWG" },
          { value: 2, label: "Aufteilungsmodelle: statischer oder dynamischer Schlüssel" },
        ]}
      />

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Für wen" title="Solarstrom teilen – vom Wohnbau bis zum Gewerbepark" align="center" className="mb-10" />
        <FeatureGrid
          cols={4}
          items={[
            { icon: Building, title: "Hauseigentümer & Bauträger", text: "Dachfläche nutzen, Wohnungen aufwerten und Bewohnern günstigen Solarstrom anbieten." },
            { icon: Users, title: "Wohnungseigentum", text: "Die Eigentümergemeinschaft beschließt die Anlage und verteilt den Strom fair nach Schlüssel." },
            { icon: Store, title: "Gewerbeparks", text: "Mehrere Mieter am selben Standort mit Solarstrom vom Hallendach versorgen." },
            { icon: Warehouse, title: "Gemeinden & Genossenschaften", text: "Gemeindewohnungen, Seniorenheime oder gemeinnützige Wohnbauten mit PV ausstatten.", href: "/kommunen" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <SplitMedia
          eyebrow="So funktioniert die GEA"
          title="Eine Anlage, viele Zählpunkte"
          image={{ src: "/Images/Referenzen/Projekte-2.jpg", alt: "Photovoltaikmodule im Gegenlicht" }}
          text={[
            "Die PV-Anlage speist in die gemeinsame Hauptleitung des Gebäudes ein. Jeder teilnehmende Haushalt oder Betrieb hat einen Smart Meter, der Verbrauch in Viertelstundenwerten misst. Der Netzbetreiber ordnet jedem Teilnehmer seinen Anteil am Solarstrom zu – was darüber hinaus gebraucht wird, liefert wie bisher der eigene Stromlieferant.",
            "Überschüsse, die im Gebäude niemand nutzt, werden eingespeist und an einen Stromabnehmer verkauft. Betreiber und Teilnehmer regeln Aufteilung, Preis, Kosten, Wartung und Ein- und Austritt im Errichtungs- und Betriebsvertrag.",
          ]}
        >
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {LEISTUNGEN.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/70">
                  <Icon aria-hidden="true" className="h-5 w-5 text-ov-600" />
                  <p className="mt-3 font-display text-[16px] font-bold text-ink-900">{s.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{s.text}</p>
                </li>
              );
            })}
          </ul>
        </SplitMedia>
      </Section>

      <Section tone="white" space="lg" id="modelle" className="scroll-mt-24">
        <SectionHeading
          eyebrow="GEA oder Energiegemeinschaft"
          title={
            <>
              Welches Modell passt zu <span className="ov-text-gradient">Ihrem Objekt</span>?
            </>
          }
          lead="Liegen alle Verbraucher hinter demselben Netzanschluss, ist die GEA meist das einfachere Modell. Sollen Nachbargebäude oder weitere Standorte mitmachen, führt der Weg über eine Erneuerbare-Energie-Gemeinschaft."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <ModellVergleich />
        </Reveal>
      </Section>

      <Section tone="sand" space="lg" id="rechenbeispiel">
        <SectionHeading
          eyebrow="Rechenbeispiel"
          title="Was bringt Solarstrom, der im Haus bleibt?"
          lead="Solarstrom, der im Gebäude verteilt wird, bringt ein Vielfaches des Marktpreises für eingespeisten Überschuss – und die Teilnehmer zahlen trotzdem weniger als für Netzstrom. Spielen Sie mit den Werten."
          className="mb-12"
        />
        <Reveal dir="scale">
          <Rechenbeispiel />
        </Reveal>
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Vorteile"
            title="Ein Dach, zwei Gewinner"
            lead="Eigentümer erzielen Erlöse aus ihrer Dachfläche, Teilnehmer beziehen Solarstrom günstiger als aus dem Netz."
            className="mb-12"
          />
          <FeatureGrid
            cols={4}
            tone="dark"
            items={[
              { icon: BadgeEuro, title: "Günstiger Strom", text: "Keine Netzentgelte für den intern verteilten Solarstrom – der Preis wird im Vertrag vereinbart." },
              { icon: Sun, title: "Sichtbar erneuerbar", text: "Strom, der wenige Meter über der eigenen Wohnung oder Halle erzeugt wird." },
              { icon: Handshake, title: "Freiwillig", text: "Jeder Teilnehmer behält seinen eigenen Stromlieferanten für den Reststrom." },
              { icon: Share2, title: "Ausbaufähig", text: "Mit Speicher, Ladeinfrastruktur oder einer Energiegemeinschaft kombinierbar." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Vom Dach zur ersten Aufteilung" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: ClipboardCheck, title: "Objekt-Check", text: "Dachfläche, Hauptleitung, Zählerschrank, Zahl der Teilnehmer und Verbrauch – wir prüfen, was das Gebäude hergibt." },
            { icon: Calculator, title: "Modell & Wirtschaftlichkeit", text: "GEA, Energiegemeinschaft oder Kombination: Wir rechnen die Varianten und empfehlen das passende Modell." },
            { icon: Wrench, title: "Errichtung & Meldung", text: "PV-Anlage, Anpassung der Messung und Meldung der GEA mit allen Zählpunkten beim Netzbetreiber." },
            { icon: LineChart, title: "Betrieb", text: "Der Netzbetreiber ordnet die Viertelstundenwerte zu, wir überwachen und warten die Anlage." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Gemeinschaftliche Erzeugungsanlage – fachlich beantwortet"
            lead="Die Rechtslage ändert sich mit dem ElWG. Wir prüfen Ihr Objekt mit aktuellem Stand und rechnen die Modelle transparent durch. Keine Rechtsberatung."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        eyebrow="Für Wohnbau, WEG & Gewerbepark"
        title="Machen Sie Ihr Dach zum Kraftwerk für alle im Haus."
        text={`${FIRMA.name} aus ${FIRMA.ort} prüft Ihr Gebäude, vergleicht GEA und Energiegemeinschaft und setzt Anlage, Messung und Aufteilung um – in ganz Österreich.`}
        primary={{ label: "GEA-Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Energiegemeinschaften", href: "/energiegemeinschaften", icon: null }}
      />
    </div>
  );
}
