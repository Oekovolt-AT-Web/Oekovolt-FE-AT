// src/app/solarrechner/page.js

import { BatteryCharging, Building2, Calculator, Compass, Euro, Gauge, PlugZap, Sun, Thermometer, TrendingDown, Wrench, Zap } from "lucide-react";

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
import { ANNAHMEN, AUSRICHTUNGEN, preisProKwp, strompreisGewerbe } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { BASE_URL, FIRMA, SITE_NAME } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/solarrechner`;

const TITLE = "Solarrechner Österreich: Gewerbe & Privat | Ökovolt";
const DESCRIPTION =
  "Kostenloser PV-Rechner für Österreich: Ertrag, Eigenverbrauch und Amortisation für Betrieb, Landwirtschaft oder Haus – mit OeMAG-Marktpreis und IFB-Hinweis.";

// Österreichspezifisch (OeMAG, EAG, österreichische Strompreise) -> kein hreflang.
export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Solarrechner Österreich",
    "PV-Rechner Gewerbe",
    "Photovoltaik Rechner Österreich",
    "Photovoltaik Amortisation berechnen",
    "PV Eigenverbrauch Gewerbe",
    "Photovoltaik Landwirtschaft Rechner",
    "OeMAG Marktpreis",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: SITE_NAME,
    title: "Solarrechner Österreich: Was bringt Ihnen eine PV-Anlage?",
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Solarrechner Österreich" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solarrechner Österreich: Was bringt Ihnen eine PV-Anlage?",
    description: DESCRIPTION,
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

const de = (n, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const satz = ct(VERGUETUNG.saetze[0].teileinspeisung).replace(/,00$/, ",0");
const strompreisCt = de(ANNAHMEN.strompreis * 100);
const marktpreis = de(VERGUETUNG.marktpreis.aktuell.ct, 3);
const gewerbeVon = de(strompreisGewerbe(5000000) * 100, 1);
const gewerbeBis = de(strompreisGewerbe(20000) * 100, 1);
const ifbProzent = de(ANNAHMEN.ifb.satzOeko * 100);
const EAG = ANNAHMEN.eagInvestitionszuschuss;

const FAQ = [
  {
    q: "Wie genau ist der Solarrechner?",
    a: `Der Rechner liefert eine belastbare erste Orientierung für Österreich: Der Ertrag stützt sich auf PVGIS-Werte der neun Landeshauptstädte (im Mittel rund 1.160 kWh je kWp bei Süd, gerechnet mit vorsichtigen ${de(ANNAHMEN.ertragProKwpSued)}), die Preise auf die österreichische Marktstatistik. Standort und Seehöhe, Verschattung, Dachaufbau und Ihr tatsächlicher Lastgang können das Ergebnis um 10 bis 20 Prozent verschieben. Eine verbindliche Aussage treffen wir nach Prüfung vor Ort und mit Ihren Verbrauchsdaten.`,
  },
  {
    q: "Wie rechnet der Solarrechner für Gewerbe und Landwirtschaft?",
    a: `Für Betriebe simuliert der Rechner ein ganzes Jahr in Stundenschritten: Das Lastprofil ergibt sich aus Betriebstagen und Schichtmodell (bzw. einem landwirtschaftlichen Profil mit Melken und Kühlung), die PV-Erzeugung aus Monat, Tageszeit und wechselndem Wetter. Gerechnet wird netto mit dem vermeidbaren Arbeitspreis nach Verbrauchsklasse – von rund ${gewerbeBis} ct/kWh bei kleinen Betrieben bis ${gewerbeVon} ct/kWh bei mehreren Gigawattstunden. Der Leistungspreis ist nicht enthalten, weil eine PV-Anlage allein Lastspitzen kaum senkt.`,
  },
  {
    q: "Welche Anlagengröße passt zu meinem Verbrauch?",
    a: "Im Haushalt gilt als Faustregel rund 1 kWp je 1.000 kWh Jahresverbrauch, mit Blick auf E-Auto oder Wärmepumpe auch mehr. Im Betrieb entscheidet der Lastgang: Eine Anlage, deren Mittagserzeugung die Grundlast an Betriebstagen nicht dauerhaft übersteigt, erreicht Eigenverbrauchsquoten von 70 Prozent und mehr. Der Rechner weist Sie darauf hin, wenn zu viel Strom ins Netz geht.",
  },
  {
    q: "Welcher Einspeisetarif wird angesetzt?",
    a: `In Österreich gibt es keine gesetzlich garantierte Einspeisevergütung über 20 Jahre. Überschussstrom wird an die OeMAG zum Marktpreis (für Photovoltaik zuletzt ${marktpreis} ct/kWh im ${VERGUETUNG.marktpreis.aktuell.zeitraum}), an einen Energieversorger oder an einen Direktvermarkter verkauft. Weil sich diese Preise monatlich ändern, rechnen wir vorsichtig mit ${satz} ct/kWh, ab 500 kWp mit ${ct(VERGUETUNG.saetze[2].teileinspeisung).replace(/0$/, "")} ct/kWh, und halten den Wert über 20 Jahre konstant.`,
  },
  {
    q: "Lohnt sich ein Stromspeicher?",
    a: `Im Haushalt hebt ein Speicher die Autarkie typischerweise von rund 30 auf 60 bis 75 Prozent. Jede zusätzlich selbst genutzte Kilowattstunde spart rund ${strompreisCt} Cent, eingespeist brächte sie nur etwa ${satz} Cent – dem steht der Speicherpreis gegenüber. Im Gewerbe ist der größere Hebel oft das Kappen von Leistungsspitzen (Peak Shaving), das wir mit Ihrem Lastgang gesondert bewerten. Schalten Sie den Speicher im Rechner ein und aus, um beide Varianten zu vergleichen.`,
  },
  {
    q: "Welche Förderungen und Steuervorteile berücksichtigt der Rechner?",
    a: `Auf Wunsch zieht der Rechner den EAG-Investitionszuschuss mit den Höchstsätzen 2026 ab (von ${EAG.kategorien[0].eurProKwp} €/kWp in Kategorie A bis ${EAG.kategorien[3].eurProKwp} €/kWp in Kategorie D, Speicher ${EAG.speicherEurProKwh} €/kWh) – vergeben wird er nur in Fördercalls, der nächste läuft von ${EAG.naechsterCall}. Für Betriebe zeigt er zusätzlich den Investitionsfreibetrag von ${ifbProzent} Prozent für Öko-Investitionen bei Anschaffung bis Ende 2026 als Hinweis. Private Anlagen rechnen wir mit 20 Prozent Umsatzsteuer, weil der befristete Nullsteuersatz ausgelaufen ist.`,
  },
  {
    q: "Was bedeutet die Strompreis-Entwicklung im Rechner?",
    a: "Sie legt fest, um wie viel Prozent der Strompreis jährlich steigt, den Ihr Solarstrom ersetzt. „Gleichbleibend“ ist die vorsichtigste Annahme; 2 Prozent entsprechen etwa der Inflation. Eine offizielle Prognose gibt es nicht – zur Einordnung: Der Day-Ahead-Mittelwert in Österreich stieg von 81,9 €/MWh (2024) auf 99,0 €/MWh (2025). Den Einspeiseerlös halten wir dagegen konstant.",
  },
];

export default function SolarrechnerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${PAGE_URL}/#app`,
        name: "Ökovolt Solarrechner Österreich",
        url: PAGE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        inLanguage: "de-AT",
        isAccessibleForFree: true,
        description:
          "Berechnet Ertrag, Eigenverbrauch, Autarkie, Ersparnis, Amortisation und den 20-Jahres-Cashflow einer Photovoltaikanlage in Österreich – für Haushalte sowie Gewerbe- und Landwirtschaftsbetriebe mit stündlichem Lastprofil.",
        featureList: [
          "Zielgruppen Privat, Gewerbe (bis 5 GWh Verbrauch, bis 1 MWp) und Landwirtschaft",
          "Lastprofil nach Betriebstagen und Schichtbetrieb, stündlich simuliert",
          "Eigenverbrauchsquote und Autarkie mit und ohne Batteriespeicher",
          "Einspeiserlös auf Basis OeMAG-Marktpreis und Einspeisetarifen",
          "Optional EAG-Investitionszuschuss, Hinweis zum Investitionsfreibetrag",
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
        dateModified: "2026-09-29",
      },
    ],
  };

  const annahmen = [
    {
      icon: Sun,
      title: `${ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh je kWp`,
      text: "Spezifischer Ertrag bei Süd und 35° Neigung – vorsichtig unter dem PVGIS-Mittel der neun Landeshauptstädte (1.055 kWh in Salzburg bis 1.242 kWh in Innsbruck). Ihren Standort prüft der Standort-Check.",
      href: "/standort-check",
    },
    {
      icon: Compass,
      title: "Ausrichtung & Neigung",
      text: `Ost/West bringt je kWp rund ${Math.round((1 - AUSRICHTUNGEN.find((a) => a.id === "ost-west").faktor) * 100)} % weniger als Süd, verteilt den Ertrag aber über den ganzen Arbeitstag. Aufgeständerte Flachdächer rechnen wir mit 9 % Abschlag (PVGIS Wien).`,
    },
    {
      icon: Zap,
      title: `${strompreisCt} ct/kWh privat · ${gewerbeVon}–${gewerbeBis} ct netto im Betrieb`,
      text: "Vermeidbarer Arbeitspreis nach E-Control-Preismonitor und Eurostat – ohne Grundpauschalen und ohne Leistungspreis, die PV nicht senkt.",
    },
    {
      icon: TrendingDown,
      title: `${satz} ct/kWh Einspeisung`,
      text: `Vorsichtiger Rechensatz: OeMAG-Marktpreis PV zuletzt ${marktpreis} ct/kWh, Einspeisetarife der Versorger 2026 meist ${VERGUETUNG.tarife.min}–${VERGUETUNG.tarife.max} ct/kWh – beides monatlich schwankend und nicht garantiert.`,
      href: "/ratgeber/einspeiseverguetung-2026",
    },
    {
      icon: Euro,
      title: `${Math.round(preisProKwp(1000, "gewerbe")).toLocaleString("de-DE")}–${Math.round(preisProKwp(5, "gewerbe")).toLocaleString("de-DE")} € je kWp netto`,
      text: `Marktstatistik 2024 und IEA-Länderbericht Österreich, von 5 kWp bis 1 MWp. Privat inkl. 20 % USt. Speicher ab ${ANNAHMEN.speicherPreise[ANNAHMEN.speicherPreise.length - 1].eur} €/kWh netto (Großspeicher) bis ${ANNAHMEN.speicherPreisProKwh} €/kWh brutto (Heimspeicher).`,
      href: "/ratgeber/solaranlage-kosten",
    },
    {
      icon: Wrench,
      title: `${ANNAHMEN.betriebskostenGewerbe[ANNAHMEN.betriebskostenGewerbe.length - 1].eur}–${ANNAHMEN.betriebskostenProKwp} € je kWp im Jahr`,
      text: "Versicherung, Wartung und Prüfung, Monitoring und Rücklage für den Wechselrichtertausch – je größer die Anlage, desto günstiger je kWp. Steigt im Rechner mit 2 % Inflation.",
      href: "/service/wartung",
    },
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
            Solarrechner Österreich: Was bringt Ihnen eine <span className="ov-text-gradient-light">PV-Anlage</span>?
          </>
        }
        lead="Für Betrieb, Landwirtschaft oder Haus: Größe, Verbrauch, Betriebszeiten und Dach einstellen – Sie sehen sofort Ertrag, Eigenverbrauch, Ersparnis und den Cashflow über 20 Jahre, gerechnet mit österreichischen Preisen und dem OeMAG-Marktpreis."
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
          lead="Keine Blackbox: Alle Werte stammen aus einer zentralen Datei mit Quellenangabe – PVGIS, österreichische Marktstatistik, E-Control, Eurostat und OeMAG. Stand: September 2026."
          className="mb-12"
        />
        <FeatureGrid items={annahmen} cols={3} />
      </Section>

      <Section tone="sand" space="lg">
        <SplitMedia
          eyebrow="Der wichtigste Hebel"
          title="Warum der Eigenverbrauch entscheidet"
          text={[
            `Eine selbst verbrauchte Kilowattstunde spart den vollen Arbeitspreis – im Haushalt rund ${strompreisCt} Cent, im Betrieb je nach Verbrauch ${gewerbeVon} bis ${gewerbeBis} Cent netto, und sie ist von der Elektrizitätsabgabe befreit. Dieselbe Kilowattstunde ins Netz gespeist bringt nur den Marktpreis.`,
            "Darum rechnet sich die Anlage am besten, die zu Ihrem Lastgang passt: Betriebe mit Tagesbetrieb und Grundlast nutzen einen Großteil direkt; Speicher, Ladeinfrastruktur und Wärmepumpen verschieben den Rest in die eigene Nutzung.",
          ]}
          points={[
            { title: "Lastgang", text: "zeigt, wie viel Solarstrom Ihr Betrieb direkt aufnimmt" },
            { title: "Speicher", text: "verschiebt Überschuss und kappt Leistungsspitzen" },
            { title: "Energiemanagement", text: "startet Verbraucher und Ladepunkte, wenn die Sonne scheint" },
          ]}
          action={{ label: "Einspeisetarif Österreich 2026", href: "/ratgeber/einspeiseverguetung-2026", variant: "secondary" }}
          aside={
            <div className="rounded-[2rem] bg-white p-7 shadow-xl ring-1 ring-ink-200/70 md:p-10">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Wert einer Kilowattstunde</p>
              <div className="mt-8 space-y-7">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[15px] font-semibold text-ink-800">Selbst genutzt (Haushalt)</span>
                    <span className="ov-num font-display text-[34px] font-extrabold text-ov-600">~{strompreisCt} ct</span>
                  </div>
                  <div className="mt-2 h-4 rounded-full bg-gradient-to-r from-ov-400 to-ov-600" />
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[15px] font-semibold text-ink-800">Eingespeist</span>
                    <span className="ov-num font-display text-[34px] font-extrabold text-ink-500">~{satz} ct</span>
                  </div>
                  <div className="mt-2 h-4 rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-ink-300" style={{ width: `${(VERGUETUNG.saetze[0].teileinspeisung / (ANNAHMEN.strompreis * 100)) * 100}%` }} />
                  </div>
                </div>
              </div>
              <p className="mt-8 border-t border-ink-100 pt-5 text-[13.5px] leading-relaxed text-ink-500">
                Vermeidbarer Haushalts-Arbeitspreis 2026 gegenüber dem vorsichtigen Einspeise-Rechensatz; OeMAG-Marktpreis PV zuletzt {marktpreis} ct/kWh ({VERGUETUNG.marktpreis.aktuell.zeitraum}).
              </p>
            </div>
          }
        />
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Vom Ergebnis zur Anlage" title="In drei Schritten zu Ihrer Photovoltaikanlage" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: Calculator, title: "Durchrechnen", text: "Mit dem Rechner die sinnvolle Größe finden – für Haus, Betrieb oder Hof, mit oder ohne Speicher." },
            { icon: Gauge, title: "Lastgang & Angebot", text: "Ihre Werte werden übernommen. Wir analysieren Lastgang, Dach, Statik und Netzanschluss und rechnen exakt nach." },
            { icon: Sun, title: "Planung bis Inbetriebnahme", text: `Netzzugangsantrag, Montage, Fertigstellungsmeldung und Abnahmevertrag aus einer Hand – vom Elektrotechnik-Fachbetrieb aus ${FIRMA.ort}, in ganz Österreich.` },
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
            cols={4}
            items={[
              { icon: Building2, title: "Standort-Check", text: "Ertrag, Schneelast und Naturgefahren für Ihren Standort in Österreich.", href: "/standort-check" },
              { icon: BatteryCharging, title: "Stromspeicher-Rechner", text: "Welche Kapazität sich für Ihren Verbrauch rechnet – stündlich simuliert.", href: "/rechner/stromspeicher" },
              { icon: PlugZap, title: "E-Auto-Laderechner", text: "Was Laden mit eigenem Solarstrom gegenüber Netzstrom und Tankstelle spart.", href: "/rechner/wallbox" },
              { icon: Thermometer, title: "Wärmepumpen-Rechner", text: "Heizkosten mit Wärmepumpe und PV im Vergleich zu Gas und Heizöl.", href: "/rechner/waermepumpe" },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Solarrechner – kurz & ehrlich erklärt"
            lead="Fachbegriffe wie Eigenverbrauchsquote, Leistungspreis oder OeMAG-Marktpreis erklären wir im Photovoltaik-Lexikon."
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
        title="Ihre Zahlen stehen. Jetzt prüfen wir Dach und Lastgang."
        text={`Wir übernehmen die Werte aus dem Rechner, analysieren Lastgang, Dach, Statik und Netzanschluss und machen daraus ein verbindliches Angebot mit ehrlicher Wirtschaftlichkeitsrechnung – persönlich aus ${FIRMA.ort}, für ganz Österreich.`}
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Photovoltaik für Betriebe", href: "/gewerbe" }}
      />
    </>
  );
}
