// src/app/solarrechner/page.js

import { BatteryCharging, Calculator, Compass, Euro, Gauge, PlugZap, Sun, Thermometer, TrendingDown, Wrench, Zap } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import Solarrechner from "@/components/Solarrechner/Rechner";
import { ANNAHMEN, AUSRICHTUNGEN, preisProKwp } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

const BASE_URL = "https://www.oekovolt.com";
const PAGE_URL = `${BASE_URL}/solarrechner`;

const TITLE = "Solarrechner 2026: Ertrag & Amortisation | Ökovolt";
const DESCRIPTION =
  "Kostenloser PV-Rechner: Ertrag, Ersparnis, Autarkie und 20-Jahres-Cashflow Ihrer Solaranlage mit EEG-Sätzen 2026 berechnen – und direkt ein Angebot anfragen.";

// Deutschlandspezifisch (EEG-Vergütung, deutscher Strompreis) -> kein hreflang.
export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Solarrechner",
    "Photovoltaik Rechner",
    "PV Rechner",
    "Solaranlage Kosten berechnen",
    "Photovoltaik Ertrag berechnen",
    "Amortisation Photovoltaik",
    "Autarkie berechnen",
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: "Solarrechner: Was bringt Ihnen eine PV-Anlage?",
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Solarrechner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solarrechner: Was bringt Ihnen eine PV-Anlage?",
    description: DESCRIPTION,
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

const satz10 = ct(VERGUETUNG.saetze[0].teileinspeisung);
const strompreisCt = String(Math.round(ANNAHMEN.strompreis * 100));

const FAQ = [
  {
    q: "Wie genau ist der Solarrechner?",
    a: "Der Rechner liefert eine belastbare erste Orientierung auf Basis von Erfahrungswerten für Süddeutschland. Verschattung durch Bäume oder Nachbargebäude, der konkrete Dachaufbau und Ihr Verbrauchsverhalten über den Tag können das Ergebnis um 10–20 % verschieben. Für eine verbindliche Aussage schauen wir uns Ihr Dach an.",
  },
  {
    q: "Welche Anlagengröße passt zu meinem Verbrauch?",
    a: "Als Faustregel gilt mindestens 1 kWp je 1.000 kWh Jahresverbrauch; mit Blick auf E-Auto oder Wärmepumpe darf es heute gern das 1,5-Fache sein, weil Module günstig sind. Deutlich größere Anlagen erzeugen vor allem Strom, der zum niedrigen Einspeisesatz ins Netz geht – das rechnet sich langsamer. Der Rechner weist Sie darauf hin.",
  },
  {
    q: "Wie berechnet der Rechner die Autarkie?",
    a: "Die Autarkie hängt vom Verhältnis zwischen Jahresertrag und Verbrauch sowie zwischen Speichergröße und Verbrauch ab. Der Rechner nutzt dafür Sättigungskurven, die sich an Simulationen typischer Haushaltslastprofile orientieren: Ohne Speicher sind meist 25–38 % möglich, mit passendem Speicher 55–75 %. 100 % Autarkie sind im Winter praktisch nicht erreichbar.",
  },
  {
    q: "Lohnt sich ein Stromspeicher?",
    a: `Ein Speicher hebt die Autarkie typischerweise von rund 30 % auf 60 bis 75 %. Jede zusätzlich selbst genutzte Kilowattstunde ersetzt rund ${strompreisCt} Cent Netzstrom, eingespeist brächte sie nur ${satz10} Cent. Gleichzeitig steigt die Investition – schalten Sie den Speicher im Rechner ein und aus, um beide Varianten zu vergleichen.`,
  },
  {
    q: "Warum ist die Amortisation länger als früher?",
    a: `Die Einspeisevergütung ist über die Jahre stark gesunken und liegt für Anlagen bis 10 kWp aktuell bei ${satz10} ct/kWh. Der wirtschaftliche Hebel liegt heute im Eigenverbrauch. Gut auf den Bedarf abgestimmte Anlagen amortisieren sich deshalb weiterhin meist in 10 bis 14 Jahren – bei einer Lebensdauer von 25 Jahren und mehr.`,
  },
  {
    q: "Was bedeutet die Strompreis-Entwicklung im Rechner?",
    a: "Sie legt fest, um wie viel Prozent der Netzstrompreis jährlich steigt, den Ihr Solarstrom ersetzt. „Gleichbleibend“ ist die vorsichtigste Annahme; 2 % liegen unter dem langjährigen Mittel. Die Einspeisevergütung bleibt dagegen 20 Jahre fest.",
  },
  {
    q: "Ändert sich die Einspeisevergütung 2027?",
    a: "Das Bundeskabinett hat am 29. Juli 2026 den Entwurf einer EEG-Novelle beschlossen, nach dem die feste Einspeisevergütung für neue kleine Dachanlagen ab 2027 durch befristete Übergangsmodelle und Direktvermarktung ersetzt werden soll. Das Gesetz ist noch nicht verabschiedet. Wer 2026 in Betrieb geht, behält den heutigen Satz für 20 Jahre.",
  },
];

export default function SolarrechnerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${PAGE_URL}/#app`,
        name: "Ökovolt Solarrechner",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        inLanguage: "de-AT",
        isAccessibleForFree: true,
        description:
          "Berechnet Ertrag, Eigenverbrauch, Autarkie, Ersparnis, Amortisation und den 20-Jahres-Cashflow einer Photovoltaikanlage mit den EEG-Sätzen 2026.",
        featureList: [
          "Jahresertrag nach Ausrichtung und Dachneigung",
          "Autarkie und Eigenverbrauchsquote mit und ohne Stromspeicher",
          "Einspeisevergütung anteilig nach EEG",
          "Amortisation und kumulierter Cashflow über 20 Jahre",
        ],
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        mainEntity: { "@id": `${PAGE_URL}/#app` },
        dateModified: VERGUETUNG.gueltigAb,
      },
    ],
  };

  const annahmen = [
    { icon: Sun, title: `${ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh je kWp`, text: "Spezifischer Jahresertrag bei Südausrichtung – belastbar für das Allgäu und Schwaben. Norddeutschland liegt eher bei 900 kWh." },
    { icon: Compass, title: "Ausrichtung & Neigung", text: `Ost/West bringt rund ${Math.round((1 - AUSRICHTUNGEN.find((a) => a.id === "ost-west").faktor) * 100)} % weniger Ertrag als Süd, verteilt ihn aber besser über den Tag. Flachdächer rechnen wir mit 10 % Abschlag.` },
    { icon: Zap, title: `${strompreisCt} ct/kWh Netzstrom`, text: "Bewusst vorsichtiger Mittelwert zwischen Neukunden- und Bestandstarifen 2026. Jede selbst genutzte kWh spart diesen Betrag." },
    { icon: TrendingDown, title: `${satz10} ct/kWh Einspeisung`, text: `Vergütung nach EEG für Inbetriebnahmen ab ${VERGUETUNG.gueltigAbLabel}, über 10 kWp anteilig mit ${ct(VERGUETUNG.saetze[1].teileinspeisung)} ct – 20 Jahre fest.` },
    { icon: Euro, title: `${Math.round(preisProKwp(30)).toLocaleString("de-DE")}–${Math.round(preisProKwp(5)).toLocaleString("de-DE")} € je kWp`, text: `Schlüsselfertig inkl. Montage und Anmeldung, 0 % USt. Speicher mit ${ANNAHMEN.speicherPreisProKwh} € je kWh, gemeinsam installiert.` },
    { icon: Wrench, title: `${ANNAHMEN.betriebskostenProKwp} € je kWp im Jahr`, text: "Versicherung, Wartung, Zählermiete und Rücklage für den Wechselrichtertausch – steigt im Rechner mit 2 % Inflation." },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Rechner & Tools", href: "/rechner" }, { name: "Solarrechner" }]}
        eyebrow="Kostenlos · ohne Anmeldung · Stand September 2026"
        title={
          <>
            Solarrechner: Was bringt Ihnen eine <span className="ov-text-gradient-light">PV-Anlage</span>?
          </>
        }
        lead={`Größe, Verbrauch und Dach einstellen – Sie sehen sofort Ertrag, Autarkie, Ersparnis und den Cashflow über 20 Jahre. Gerechnet wird mit den Einspeisesätzen ab dem ${VERGUETUNG.gueltigAbLabel}.`}
      >
        <Reveal dir="scale" className="relative mt-12 md:mt-14">
          <div aria-hidden="true" className="absolute -inset-2 rounded-[2.4rem] bg-gradient-to-br from-white/15 via-white/5 to-ov-400/20 blur-[1px] md:-inset-3" />
          <div className="ov-glass relative rounded-[2.25rem] p-1.5 md:p-2.5">
            <Solarrechner />
          </div>
        </Reveal>
      </PageHero>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Transparente Annahmen"
          title={<>Womit der Rechner <span className="ov-text-gradient">rechnet</span></>}
          lead="Keine Blackbox: Alle Werte stammen aus einer zentralen Datei und werden bei jeder Änderung von EEG-Sätzen oder Marktpreisen aktualisiert. Stand: September 2026."
          className="mb-12"
        />
        <FeatureGrid items={annahmen} cols={3} />
      </Section>

      <Section tone="sand" space="lg">
        <SplitMedia
          eyebrow="Der wichtigste Hebel"
          title="Warum der Eigenverbrauch entscheidet"
          text={[
            `Eine selbst verbrauchte Kilowattstunde spart Ihnen rund ${strompreisCt} Cent Netzstrom. Dieselbe Kilowattstunde ins Netz gespeist bringt ${satz10} Cent – also etwa ein Viertel.`,
            "Darum rechnet sich heute die Anlage am besten, die zu Ihrem Verbrauch passt: mit Speicher, der den Mittagsüberschuss in den Abend verschiebt, und mit Wallbox oder Wärmepumpe, die Solarstrom direkt nutzen.",
          ]}
          points={[
            { title: "Speicher", text: "hebt die Autarkie typischerweise auf 60–75 %" },
            { title: "Überschussladen", text: "macht aus Einspeisung Fahrstrom für wenige Cent" },
            { title: "Energiemanagement", text: "startet Verbraucher, wenn die Sonne scheint" },
          ]}
          action={{ label: "Ratgeber Einspeisevergütung 2026", href: "/ratgeber/einspeiseverguetung-2026", variant: "secondary" }}
          aside={
            <div className="rounded-[2rem] bg-white p-7 shadow-xl ring-1 ring-ink-200/70 md:p-10">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Wert einer Kilowattstunde</p>
              <div className="mt-8 space-y-7">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[15px] font-semibold text-ink-800">Selbst genutzt</span>
                    <span className="ov-num font-display text-[34px] font-extrabold text-ov-600">~{strompreisCt} ct</span>
                  </div>
                  <div className="mt-2 h-4 rounded-full bg-gradient-to-r from-ov-400 to-ov-600" />
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[15px] font-semibold text-ink-800">Eingespeist</span>
                    <span className="ov-num font-display text-[34px] font-extrabold text-ink-500">{satz10} ct</span>
                  </div>
                  <div className="mt-2 h-4 rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-ink-300" style={{ width: `${(VERGUETUNG.saetze[0].teileinspeisung / (ANNAHMEN.strompreis * 100)) * 100}%` }} />
                  </div>
                </div>
              </div>
              <p className="mt-8 border-t border-ink-100 pt-5 text-[13.5px] leading-relaxed text-ink-500">
                Netzstrom-Mittelwert 2026 gegenüber EEG-Satz für Anlagen bis 10 kWp, Inbetriebnahme ab {VERGUETUNG.gueltigAbLabel}.
              </p>
            </div>
          }
        />
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Vom Ergebnis zur Anlage"
          title="In drei Schritten zu Ihrer Solaranlage"
          align="center"
          className="mb-14"
        />
        <Steps
          items={[
            { icon: Calculator, title: "Durchrechnen", text: "Mit dem Rechner die sinnvolle Größe finden – mit oder ohne Speicher, mit Ihrem echten Verbrauch." },
            { icon: Gauge, title: "Angebot anfragen", text: "Ihre Werte werden direkt übernommen. Wir prüfen Dach, Zählerschrank und Verschattung und rechnen exakt nach." },
            { icon: Sun, title: "Planung & Montage", text: "Planung, Montage, Netzanmeldung und Marktstammdatenregister aus einer Hand – vom Fachbetrieb aus Türkheim." },
          ]}
        />
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading dark eyebrow="Weitere Rechner" title="Einzelne Fragen genauer beantworten" className="mb-12" />
          <FeatureGrid
            tone="dark"
            cols={3}
            items={[
              { icon: BatteryCharging, title: "Stromspeicher-Rechner", text: "Welche Kapazität sich für Ihren Haushalt wirklich rechnet – inklusive Wallbox und Wärmepumpe.", href: "/rechner/stromspeicher" },
              { icon: PlugZap, title: "E-Auto-Laderechner", text: "Was Laden mit eigenem Solarstrom gegenüber Netzstrom und Tankstelle spart.", href: "/rechner/wallbox" },
              { icon: Thermometer, title: "Wärmepumpen-Rechner", text: "Heizkosten mit Wärmepumpe und PV im Vergleich zu Gas und Öl.", href: "/rechner/waermepumpe" },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Solarrechner – kurz & ehrlich erklärt"
            lead="Fachbegriffe wie Autarkie, kWp oder Amortisation erklären wir ausführlich im Photovoltaik-Lexikon."
          >
            <a href="/wissen/lexikon" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
              Zum Photovoltaik-Lexikon
            </a>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/solarrechner" />
      <CtaBand
        title="Ihre Zahlen stehen. Jetzt prüfen wir Ihr Dach."
        text="Wir übernehmen die Werte aus dem Rechner, sehen uns Dach, Zählerschrank und Verschattung an und machen daraus ein verbindliches Angebot – mit ehrlicher Wirtschaftlichkeitsrechnung."
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Speichergröße berechnen", href: "/rechner/stromspeicher" }}
      />
    </>
  );
}
