// src/app/produkte/hersteller/page.js
//
// Herstellerübersicht Österreich. Bewusst statisch: Die Backoffice-Liste der
// deutschen Seite enthielt Marken, mit denen die österreichische Gesellschaft
// keine belegte Partnerschaft hat. Aufgeführt sind nur die Hersteller, deren
// Zusammenarbeit belegt ist (Stand 09/2026): Fronius, Huawei, Solis, BYD,
// Sigenergy, meteocontrol. Keine Markenlogos Dritter (keine Freigabe).
//
// Fronius: Firmensitz Pettenbach (OÖ), gegründet 1945, Hauptproduktion
// Sattledt (OÖ) – Quelle: https://de.wikipedia.org/wiki/Fronius_International

import { BatteryCharging, Car, Cpu, Gauge, Headphones, HousePlug, Layers, Leaf, MapPin, ShieldCheck, Sun, Timer } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import HerstellerFilter from "@/components/Hersteller/HerstellerFilter";
import { herstellerId } from "@/components/Hersteller/ids";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";

const PFAD = "/produkte/hersteller";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "PV-Hersteller: Fronius, Huawei, BYD & mehr | Ökovolt";
const DESCRIPTION =
  "Hersteller, die wir in Österreich verbauen: Wechselrichter von Fronius, Huawei und Solis, Speicher von BYD und Sigenergy, Monitoring von meteocontrol.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Photovoltaik Hersteller", "Fronius Wechselrichter", "Huawei SUN2000", "BYD Battery-Box", "Sigenergy", "Solis Wechselrichter", "meteocontrol"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Photovoltaik-Hersteller bei Ökovolt" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const KATEGORIEN = [
  {
    name: "Wechselrichter",
    hersteller: [
      {
        title: "Fronius",
        tag: "Hersteller aus Österreich",
        bild: "/Images/Dienstleistungen/Smartphone/Fronius-Primo-5.0-1-208-240.webp",
        alt_banner_image: "Fronius-Wechselrichter",
        main_description:
          "Fronius entwickelt und fertigt Wechselrichter in Oberösterreich – vom Hybrid-Wechselrichter für Wohnhaus und Kleinbetrieb bis zu Geräten für Gewerbedächer und Freiflächen. Für uns zählen kurze Wege zum Hersteller, Service in Österreich und eine lange Ersatzteilversorgung.",
        fakten: [
          ["Sitz", "Pettenbach, Oberösterreich"],
          ["Gegründet", "1945"],
          ["Produktion", "u. a. Sattledt, Oberösterreich"],
        ],
      },
      {
        title: "Huawei",
        bild: "/Images/Dienstleistungen/Smartphone/huawei.webp",
        alt_banner_image: "Huawei-Wechselrichter und Speicher",
        main_description:
          "Huawei bietet String-Wechselrichter der Serie SUN2000 vom Wohnhaus bis zum Gewerbe- und Freiflächenbereich sowie die Speicherfamilie LUNA2000. Stark bei großen Dachflächen mit vielen MPP-Trackern und bei integrierter Überwachung.",
        fakten: [
          ["Einsatz", "Wohnhaus bis Freifläche"],
          ["Speicher", "LUNA2000"],
        ],
      },
      {
        title: "Solis",
        bild: "/Images/Dienstleistungen/Photovoltaik/welschelrichter.webp",
        alt_banner_image: "String-Wechselrichter an einer Wand",
        main_description:
          "Solis (Ginlong Technologies) liefert String-Wechselrichter mit breitem Leistungsspektrum, darunter dreiphasige Geräte für Gewerbe- und Hallendächer. Gut geeignet, wenn viele Dachflächen mit unterschiedlicher Ausrichtung zusammenkommen.",
        fakten: [["Einsatz", "Gewerbe- und Hallendächer"]],
      },
    ],
  },
  {
    name: "Stromspeicher",
    hersteller: [
      {
        title: "BYD",
        bild: "/Images/Dienstleistungen/Photovoltaik/BYD.png",
        alt_banner_image: "BYD-Batteriespeicher",
        main_description:
          "BYD fertigt Batteriespeicher mit Lithium-Eisenphosphat-Zellen (LFP). Die modularen Hochvoltspeicher der Battery-Box lassen sich mit zahlreichen Hybrid-Wechselrichtern kombinieren und später erweitern.",
        fakten: [["Zellchemie", "Lithium-Eisenphosphat (LFP)"]],
      },
      {
        title: "Sigenergy",
        bild: "/Images/Dienstleistungen/Smartphone/Stronspeicher.jpg",
        alt_banner_image: "Batteriespeicher im Technikraum",
        main_description:
          "Sigenergy baut modulare Speichersysteme mit integriertem Hybrid-Wechselrichter und Energiemanagement – vom Wohnhaus bis zu Gewerbeanwendungen. Das System lässt sich stapelbar erweitern und bindet Ladeinfrastruktur mit ein.",
        fakten: [["Aufbau", "Speicher und Wechselrichter integriert"]],
      },
    ],
  },
  {
    name: "Monitoring",
    hersteller: [
      {
        title: "meteocontrol",
        bild: "/Images/Ratgeber/energiemanagementsystem.jpg",
        alt_banner_image: "Monitoring-Oberfläche einer Photovoltaikanlage",
        main_description:
          "meteocontrol liefert Datenlogger und Monitoring-Portale für gewerbliche PV-Anlagen und Solarparks. Wir nutzen die Systeme zur herstellerübergreifenden Überwachung – ergänzend zu unseren eigenen Fernwartungs- und SCADA-Systemen.",
        fakten: [["Einsatz", "Gewerbe, Freifläche, Portfolio"]],
      },
    ],
  },
];

const FAQ = [
  {
    q: "Warum arbeitet Ökovolt nur mit ausgewählten Herstellern?",
    a: "Eine PV-Anlage läuft 25 Jahre und länger. Entscheidend sind deshalb nicht nur Datenblätter, sondern Garantiebedingungen, Ersatzteilversorgung, Service in Österreich und wie gut Module, Wechselrichter, Speicher und Regelung zusammenarbeiten. Mit einer überschaubaren Auswahl kennen wir jede Komponente aus der Praxis.",
  },
  {
    q: "Warum Fronius als österreichischer Hersteller?",
    a: "Fronius hat seinen Sitz in Pettenbach und fertigt Wechselrichter in Oberösterreich. Das bedeutet kurze Wege bei Service und Ersatzteilen und einen Hersteller, der die Anforderungen der österreichischen Netzbetreiber kennt. Welcher Wechselrichter am besten passt, entscheiden trotzdem Anlagengröße, Dachgeometrie und Speicherkonzept.",
  },
  {
    q: "Kann ich Komponenten verschiedener Marken kombinieren?",
    a: "Bei Solarmodulen in der Regel problemlos. Wechselrichter und Batteriespeicher müssen dagegen zueinander passen – viele Speicher funktionieren nur mit bestimmten Hybrid-Wechselrichtern. Am Netzanschlusspunkt regelt bei größeren Anlagen unser Parkregler Wechselrichter verschiedener Hersteller gemeinsam.",
  },
  {
    q: "Welche Module verbauen Sie?",
    a: "Die Modulwahl treffen wir projektbezogen nach Technologie, Format, geprüfter Schneelast und Garantiebedingungen – für Gewerbe und alpine Standorte überwiegend Glas-Glas-Module. Konkrete Modultypen nennen wir im Angebot mit Datenblatt.",
  },
  {
    q: "Was ist bei der Herstellergarantie wichtig?",
    a: "Achten Sie auf zwei Werte: die Produktgarantie für Material- und Verarbeitungsfehler und die Leistungsgarantie, also die garantierte Restleistung von Modulen bzw. Restkapazität von Speichern nach einer bestimmten Zeit. Die Bedingungen unterscheiden sich je Hersteller und Produktserie – wir erläutern sie im Angebot.",
  },
];

export default function HerstellerPage() {
  const alle = KATEGORIEN.flatMap((k) => k.hersteller);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      name: "Hersteller, die Ökovolt in Österreich verbaut",
      numberOfItems: alle.length,
      itemListElement: alle.map((h, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Brand", name: h.title, url: `${PAGE_URL}#${herstellerId(h.title)}` },
      })),
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Hersteller" }]}
        eyebrow="Hersteller & Marken"
        title={
          <>
            Komponenten, die wir kennen – <span className="ov-text-gradient">geprüft im Einsatz</span>
          </>
        }
        lead="Wir verbauen Wechselrichter, Speicher und Monitoring von Herstellern, mit denen wir seit Jahren zusammenarbeiten – allen voran Fronius aus Oberösterreich. Die Auswahl folgt Langlebigkeit, Service in Österreich und Netzkonformität, nicht dem Datenblatt allein."
        image={{ src: "/Images/Dienstleistungen/Photovoltaik/montage.png", alt: "Montage von Solarmodulen" }}
        actions={[
          { label: "Angebot anfragen", href: "/angebot" },
          { label: "Marken ansehen", href: "#marken", icon: Layers },
        ]}
        stats={[
          { value: alle.length, label: "Hersteller im Portfolio" },
          { value: KATEGORIEN.length, label: "Produktkategorien" },
          { value: 9, label: "Bundesländer im Einzugsgebiet" },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <ShieldCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">Ein System, das zusammenpasst</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Wechselrichter, Speicher & Regelung abgestimmt</p>
            </div>
          </div>
        }
      />

      <nav aria-label="Marken-Schnellzugriff" className="border-b border-ink-100 bg-white">
        <ul className="ov-container flex flex-wrap items-center justify-center gap-x-2 gap-y-2 py-6 md:justify-between">
          {alle.map((h) => (
            <li key={h.title}>
              <a
                href={`#${herstellerId(h.title)}`}
                className="flex h-14 min-w-[104px] items-center justify-center rounded-xl px-4 text-ink-600 transition-colors duration-300 hover:bg-ink-50 hover:text-ink-900 md:min-w-[120px]"
              >
                <span className="font-display text-[16px] font-bold">{h.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Fronius hervorheben */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Aus Oberösterreich"
          title="Fronius: Wechselrichter aus Österreich"
          text={[
            "Fronius wurde 1945 in Pettenbach gegründet und fertigt seine Wechselrichter bis heute in Oberösterreich, unter anderem in Sattledt – im selben Bundesland wie unser Firmensitz in Ostermiething.",
            "Für Gewerbeanlagen bedeutet das: Service und Ersatzteile aus dem Inland, ein Hersteller, der die österreichischen Netzanschlussregeln kennt, und Wertschöpfung, die im Land bleibt – ein Argument auch für Nachhaltigkeitsberichte.",
          ]}
          points={["Hybrid-Wechselrichter für Wohnhaus und Kleinbetrieb", "Geräte für Gewerbedächer und Freiflächen", "Service und Ersatzteile in Österreich"]}
          image={{ src: "/Images/Dienstleistungen/Smartphone/Fronius-Primo-5.0-1-208-240.webp", alt: "Fronius-Wechselrichter" }}
        >
          <p className="mt-6 flex items-center gap-2 text-[15px] font-medium text-ink-700">
            <MapPin aria-hidden="true" className="h-4 w-4 text-ov-600" />
            Pettenbach · Sattledt · Oberösterreich
          </p>
        </SplitMedia>
      </Section>

      <Section tone="sand" space="lg" id="marken" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Unsere Marken"
          title={
            <>
              Hersteller, die wir <span className="ov-text-gradient">selbst verbauen</span>
            </>
          }
          lead="Module wählen wir projektbezogen nach Technologie, Schneelast und Garantie; bei Wechselrichtern, Speichern und Monitoring setzen wir auf diese Partner."
          className="mb-10"
        />
        <HerstellerFilter kategorien={KATEGORIEN} />
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Unsere Auswahlkriterien"
            title="Worauf wir bei jeder Marke achten"
            lead="Ein günstiges Datenblatt nützt wenig, wenn nach acht Jahren kein Ersatzteil mehr lieferbar ist. Deshalb prüfen wir Hersteller nach diesen Kriterien."
            className="mb-12"
          />
          <FeatureGrid
            cols={3}
            tone="dark"
            items={[
              { icon: Timer, title: "Langlebigkeit", text: "Belastbare Produkt- und Leistungsgarantien und Technik, die sich über viele Jahre im Feld bewährt hat." },
              { icon: Cpu, title: "Netzkonformität", text: "Konformität mit den TOR Stromerzeugungsanlagen und saubere Regelbarkeit über unseren Parkregler." },
              { icon: ShieldCheck, title: "Sicherheit", text: "Geprüfte Normkonformität, sichere Zellchemie bei Speichern und Brandschutz nach OVE-Richtlinien." },
              { icon: Headphones, title: "Service in Österreich", text: "Erreichbarer Herstellersupport und verlässliche Ersatzteilversorgung – auch Jahre nach dem Kauf." },
              { icon: Gauge, title: "Effizienz", text: "Hohe Wirkungsgrade und geringe Verluste, damit aus jedem Sonnenstrahl möglichst viel Strom wird." },
              { icon: Leaf, title: "Preis-Leistung", text: "Wir empfehlen, was sich über die Lebensdauer rechnet – nicht das teuerste oder billigste Produkt." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Vom Produkt zum System"
          title="Wofür wir diese Komponenten einsetzen"
          lead="Die richtige Marke ist nur die halbe Miete – entscheidend ist, wie Erzeugung, Speicher und Verbraucher am Standort zusammenspielen."
          className="mb-12"
        />
        <FeatureGrid
          cols={4}
          items={[
            { icon: Sun, title: "Photovoltaikanlage", text: "Module, Unterkonstruktion und Wechselrichter für Dach und Freifläche.", href: "/produkte/photovoltaikanlage" },
            { icon: BatteryCharging, title: "Stromspeicher", text: "Heim- und Gewerbespeicher für Eigenverbrauch und Peak Shaving.", href: "/produkte/stromspeicher" },
            { icon: Car, title: "Ladeinfrastruktur", text: "Laden für Flotte, Mitarbeitende und Kundschaft.", href: "/ladeinfrastruktur" },
            { icon: HousePlug, title: "Parkregler", text: "Alle Wechselrichter am Netzanschlusspunkt gemeinsam geregelt.", href: "/technik/parkregler" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Hersteller & Komponenten – ehrlich beantwortet"
            lead="Sie haben eine bestimmte Marke im Blick? Sprechen Sie uns an – wir sagen Ihnen offen, ob sie zu Ihrem Projekt passt."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Markenqualität, sauber errichtet."
        text={`${FIRMA.name} aus ${FIRMA.ort} stellt aus bewährten Herstellern ein System zusammen, das zu Standort, Lastgang und Budget passt – mit Planung, Errichtung und Netzanschluss aus einer Hand.`}
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Speichergröße berechnen", href: "/rechner/stromspeicher" }}
      />
    </div>
  );
}
