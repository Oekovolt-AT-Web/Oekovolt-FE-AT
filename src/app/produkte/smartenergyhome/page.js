// src/app/produkte/smartenergyhome/page.js
//
// Smart Energy Home – Österreich. Zielgruppe: Premium-Wohnhaus, Chalet,
// Landsitz; mit Hinweis auf Energiemanagement für Betriebe.
// Keine Backoffice-Texte mehr (die API lieferte Inhalte der deutschen Seite
// inkl. § 14a EnWG). Smart-Meter-Aussagen nach ElWG § 54 (Stand 09/2026).

import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Calculator,
  Car,
  Check,
  Cpu,
  Gauge,
  Layers,
  Mountain,
  Network,
  PlugZap,
  Share2,
  ShieldAlert,
  Sun,
  Thermometer,
  TrendingDown,
  Warehouse,
  Zap,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import HerstellerWortmarken from "@/components/Hersteller/HerstellerWortmarken";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import Energiefluss from "@/components/smartenergyhome/Energiefluss";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";

const PFAD = "/produkte/smartenergyhome";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "Smart Energy Home: Energiemanagement mit PV | Ökovolt";
const DESCRIPTION =
  "Photovoltaik, Speicher, Wallbox, Wärmepumpe und Notstrom als ein System: Energiemanagement für Wohnhaus und Chalet in Österreich, herstellerübergreifend.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Smart Energy Home", "Energiemanagementsystem", "HEMS Österreich", "Photovoltaik Chalet", "Notstrom Photovoltaik", "Eigenverbrauch optimieren"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Smart Energy Home mit Photovoltaik" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const KAUFPUNKTE = [
  "Alle Komponenten arbeiten mit einem gemeinsamen Energiemanagement – heute und bei späteren Erweiterungen.",
  "Offene Schnittstellen wie Modbus, EEBus oder SG Ready statt geschlossener Insellösungen.",
  "Zählerschrank und Leitungswege sind für Speicher, Wallbox und Wärmepumpe vorbereitet.",
  "Ersatzstrom ist von Anfang an mitgedacht, wenn Blackout-Vorsorge ein Thema ist.",
];

const FAQ = [
  {
    q: "Was ist ein Smart Energy Home?",
    a: "Ein Smart Energy Home verbindet Photovoltaikanlage, Stromspeicher, Wallbox, Wärmepumpe und Stromzähler über ein Energiemanagementsystem (EMS). Das EMS entscheidet laufend, welches Gerät wann wie viel Strom bekommt – mit dem Ziel, möglichst viel eigenen Solarstrom zu nutzen und teuren Netzstrom zu vermeiden.",
  },
  {
    q: "Was bringt ein Energiemanagementsystem konkret?",
    a: "Ohne Steuerung laufen E-Auto und Wärmepumpe dann, wenn sie eingeschaltet werden – oft abends mit Netzstrom. Ein EMS verschiebt diese großen Verbraucher gezielt in die Sonnenstunden oder in günstige Viertelstunden eines Spotpreis-Tarifs. So steigen Eigenverbrauch und Autarkie deutlich, ohne dass Sie etwas tun müssen.",
  },
  {
    q: "Brauche ich für ein Smart Energy Home einen Smart Meter?",
    a: "Den Smart Meter stellt ohnehin Ihr Netzbetreiber. Mit PV-Anlage, Wallbox, Wärmepumpe oder Speicher misst er in Viertelstundenwerten, ein Opt-out ist dann nach § 54 ElWG nicht möglich. Für die Regelung im Haus misst zusätzlich ein Energiezähler am Hausanschluss in Echtzeit – oder das EMS liest die Kundenschnittstelle des Smart Meters aus.",
  },
  {
    q: "Versorgt das System mein Haus bei einem Blackout?",
    a: "Nur, wenn es dafür ausgelegt ist. Ersatzstrom braucht einen netzbildenden Wechselrichter mit Speicher und eine automatische Netztrennung. Wir planen, welche Stromkreise – etwa Heizung, Kühlung, Licht und Kommunikation – bei einem Netzausfall weiterlaufen sollen.",
  },
  {
    q: "Kann ich ein Energiemanagement in eine bestehende PV-Anlage nachrüsten?",
    a: "Ja, in den meisten Fällen. Entscheidend ist, dass Wechselrichter, Speicher, Wallbox und Wärmepumpe über offene Schnittstellen kommunizieren können. Wir prüfen Ihre vorhandenen Komponenten und empfehlen, was sich einbinden lässt.",
  },
  {
    q: "Muss ich alles auf einmal kaufen?",
    a: "Nein. Viele starten mit der PV-Anlage und ergänzen Speicher, Wallbox oder Wärmepumpe später. Wichtig ist nur, dass die erste Planung Platz, Zählerschrank und Schnittstellen für die nächsten Schritte mitdenkt.",
  },
];

export default function SmartEnergyPage() {
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
        name: "Smart Energy Home – Energiemanagement mit Photovoltaik",
        serviceType: "Planung und Einbindung von Energiemanagementsystemen",
        description: DESCRIPTION,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
        url: PAGE_URL,
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Smart Energy Home" }]}
        eyebrow="Smart Energy Home"
        title={
          <>
            Ein Gebäude, das seine Energie <span className="ov-text-gradient-light">selbst managt</span>
          </>
        }
        lead="Photovoltaik, Speicher, Wallbox und Wärmepumpe arbeiten als ein System – gesteuert von einem Energiemanager, der jede Kilowattstunde dorthin schickt, wo sie am meisten bringt. Auf Wunsch mit Ersatzstrom für den Fall eines Blackouts."
        image={{ src: "/Images/Home/download-1.jpg", alt: "Wohnhaus mit schwarzen Solarmodulen auf dem Satteldach", position: "60% 40%" }}
        points={["Mehr Eigenverbrauch, weniger Netzstrom", "Ersatzstrom & Blackout-Vorsorge", "Bereit für Spotpreis-Tarife", "Herstellerübergreifend geplant"]}
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

      <HerstellerWortmarken titel="Wechselrichter, Speicher und Monitoring unserer Partner" />

      <Section tone="navy" space="lg" className="overflow-hidden" id="energiefluss">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-32 -top-20 h-[380px] w-[380px] rounded-full bg-navy-400/25 blur-[120px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="So denkt Ihr Energiemanager"
            title={
              <>
                Jede Kilowattstunde <span className="ov-text-gradient-light">am richtigen Ort</span>
              </>
            }
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
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Die Bausteine"
            title="Komfort, Effizienz und erneuerbare Energie verbunden"
            lead="Ein Smart Energy Home ist kein Produkt, sondern ein abgestimmtes System. Jeder Baustein bringt mehr, wenn er mit den anderen spricht."
          />
          <FeatureGrid
            cols={2}
            items={[
              { icon: Sun, title: "Photovoltaik", text: "Die Quelle: Solarstrom vom eigenen Dach, der zuerst im Gebäude bleiben soll.", href: "/produkte/photovoltaikanlage" },
              { icon: BatteryCharging, title: "Stromspeicher", text: "Verschiebt Mittagssonne in den Abend – der größte Hebel für Autarkie.", href: "/produkte/stromspeicher" },
              { icon: Car, title: "Wallbox", text: "Lädt das E-Auto bevorzugt mit Solarüberschuss statt mit Netzstrom.", href: "/produkte/wallbox" },
              { icon: Thermometer, title: "Wärmepumpe", text: "Heizt und erwärmt Wasser vor, wenn Sonnenstrom übrig ist.", href: "/produkte/warmepumpe" },
              { icon: Gauge, title: "Smart Meter", text: "Viertelstundenwerte des Netzbetreibers als Grundlage für Tarif und Energiegemeinschaft.", href: "/produkte/smartmeter" },
              { icon: ShieldAlert, title: "Ersatzstrom", text: "Wichtige Stromkreise laufen bei einem Netzausfall weiter.", href: "/service/notstrom" },
            ]}
          />
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <SplitMedia
          reverse
          eyebrow="Premium & alpin"
          title="Für Premium-Wohnhaus, Chalet und Landsitz"
          text={[
            "Gerade in alpinen Lagen spielt ein Smart Energy Home seine Stärken aus: hohe Schneelasten erfordern eine durchdachte Anlage, lange Heizperioden machen die Wärmepumpe zum größten Verbraucher, und abgelegene Standorte profitieren von Ersatzstrom.",
            "Wir planen Photovoltaik, Speicher und Steuerung als Gesamtkonzept – mit Fernüberwachung und Wartung, damit das System auch bei Abwesenheit zuverlässig läuft.",
          ]}
          action={{ label: "Luxus-Chalets & Alpin", href: "/chalets", variant: "navy" }}
          image={{ src: "/Images/Ratgeber/photovoltaik-im-winter.jpg", alt: "Photovoltaikanlage auf einem verschneiten Dach" }}
        >
          <ul className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { i: TrendingDown, t: "Geringere Energiekosten" },
              { i: Layers, t: "Weniger CO₂" },
              { i: Network, t: "Mehr Unabhängigkeit" },
            ].map((k) => (
              <li key={k.t} className="flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-[14.5px] font-semibold text-ink-800 ring-1 ring-ink-200/70">
                <k.i aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-600" />
                {k.t}
              </li>
            ))}
          </ul>
        </SplitMedia>
      </Section>

      <Section tone="white" space="lg">
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
            { icon: BatteryCharging, title: "Speicher", text: "Hebt den Eigenverbrauch deutlich und macht Solarstrom auch abends und bei Netzausfall nutzbar." },
            { icon: PlugZap, title: "Wallbox & Wärmepumpe", text: "Die großen Verbraucher kommen dazu – und laufen gezielt dann, wenn Sonne da ist." },
            { icon: Cpu, title: "Energiemanagement", text: "Ein EMS verbindet alles, nutzt Wetterprognose und Börsenpreis und steuert automatisch." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Kaufberatung"
              title="Worauf Sie achten sollten"
              lead="Achten Sie weniger auf einzelne Datenblätter als auf die Kompatibilität der Systeme – heute und in Zukunft."
            />
            <ul className="mt-8 space-y-3">
              {KAUFPUNKTE.map((p, i) => (
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
          <div className="grid gap-4 self-start">
            <Reveal>
              <article className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/70">
                <Share2 aria-hidden="true" className="h-6 w-6 text-ov-600" />
                <h3 className="mt-4 font-display text-[18px] font-bold text-ink-900">Überschuss in die Energiegemeinschaft</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                  Was das Gebäude nicht selbst braucht, kann über eine Erneuerbare-Energie-Gemeinschaft in der Nachbarschaft genutzt werden – statt nur zum Marktpreis eingespeist.
                </p>
                <Link href="/energiegemeinschaften" className="group mt-3 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                  Energiegemeinschaften
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="rounded-3xl bg-navy-950 p-7 text-white">
                <Warehouse aria-hidden="true" className="h-6 w-6 text-ov-300" />
                <h3 className="mt-4 font-display text-[18px] font-bold">Energiemanagement für Betriebe</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                  Im Gewerbe steuert das EMS zusätzlich Lastspitzen, Ladeinfrastruktur und Einspeiselimits – mit Lastgang, Gewerbespeicher und unserem Parkregler.
                </p>
                <Link href="/produkte/smartmeter" className="group mt-3 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-white hover:text-ov-300">
                  Smart Meter & EMS für Betriebe
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            </Reveal>
            <Reveal delay={160}>
              <p className="flex items-center gap-2 text-[14px] text-ink-500">
                <Mountain aria-hidden="true" className="h-4 w-4 text-ov-600" />
                <Zap aria-hidden="true" className="h-4 w-4 text-ov-600" />
                Planung und Errichtung in allen neun Bundesländern.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <SolarrechnerTeaser
        href="/solarrechner"
        cta="Zum Solarrechner"
        titel="Wie unabhängig kann Ihr Gebäude werden?"
        text="Anlagengröße, Verbrauch, Speicher und E-Auto eingeben – der Solarrechner zeigt eine erste Einschätzung zu Autarkie und Ersparnis."
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

      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Lassen Sie Ihr Gebäude mitdenken."
        text={`${FIRMA.name} aus ${FIRMA.ort} plant PV, Speicher, Wallbox, Wärmepumpe, Ersatzstrom und Energiemanagement als ein System – mit festem Ansprechpartner in ganz Österreich.`}
        primary={{ label: "Smart Energy Home planen", href: "/angebot" }}
        secondary={{ label: "Autarkie berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
