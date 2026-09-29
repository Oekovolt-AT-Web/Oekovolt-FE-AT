// src/app/produkte/warmepumpe/page.js
//
// Produktseite Wärmepumpe – Österreich. Schwerpunkt Gewerbe (Hallen,
// Prozesswärme, Hotellerie), Wohngebäude nachgeordnet.
//
// Förderstand 28.09.2026 (bewusst ohne Beträge, Details auf den Förderseiten):
//   - Bund „Raus aus Öl und Gas“ / Kesseltausch (Umweltförderung, KPC): Budget
//     2026 im Juli 2026 ausgeschöpft; registrierte Projekte bleiben gültig; für
//     2027/2028 ist ein geringeres Budget angekündigt.
//     Quelle: https://www.erneuerbare-energie.at/presseaussendungen/2026/7/9/heizungstausch-frdertopf-schon-im-juli-leer-noch-immer-kein-verlsslicher-ausstieg-aus-l-und-gas
//   - Betriebe: Umweltförderung im Inland (UFI) über die KPC
//   - Smart Meter: Opt-out mit meldepflichtiger Wärmepumpe nicht möglich (§ 54 ElWG)
// Keine Backoffice-Texte mehr (die API lieferte die deutsche Förderlage).

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeEuro,
  Building2,
  Calculator,
  ClipboardList,
  Factory,
  FileCheck2,
  Hotel,
  Landmark,
  Recycle,
  Snowflake,
  Sparkles,
  ThermometerSun,
  Warehouse,
  Wrench,
} from "lucide-react";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Querverweise from "@/components/Reusable/Querverweise";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Heizkostenvergleich from "@/components/Warmepumpe/Heizkostenvergleich";
import SonnenJahr from "@/components/Warmepumpe/SonnenJahr";
import TemperaturSkala from "@/components/Warmepumpe/TemperaturSkala";
import Kennzahlenband from "@/components/Produktdetail/Kennzahlenband";
import FachAkkordeon, { FachTabelle } from "@/components/Produktdetail/FachAkkordeon";

const PFAD = "/produkte/warmepumpe";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "Wärmepumpe für Gewerbe, Hotel & Gebäude | Ökovolt";
const DESCRIPTION =
  "Wärmepumpen in Österreich für Hallen, Prozesswärme, Hotels und Wohngebäude – kombiniert mit Photovoltaik, mit Heizlastberechnung und aktuellem Förderstand.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Wärmepumpe Gewerbe", "Wärmepumpe Hotel", "Hallenheizung Wärmepumpe", "Prozesswärme Wärmepumpe", "Wärmepumpe Photovoltaik", "Raus aus Öl und Gas"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Wärmepumpe mit Photovoltaik" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const GEWERBE = [
  { icon: Warehouse, title: "Hallenheizung", text: "Luft-Wasser- oder Sole-Wasser-Wärmepumpen mit Industrieflächenheizung oder Deckenstrahlplatten – niedrige Vorlauftemperaturen, hohe Effizienz." },
  { icon: Factory, title: "Prozesswärme", text: "Reinigung, Trocknung, Lebensmittel: Hochtemperatur-Wärmepumpen liefern Niedertemperatur-Prozesswärme, häufig aus vorhandener Abwärme." },
  { icon: Hotel, title: "Hotellerie & Tourismus", text: "Warmwasser, Wellness, Pools und Kühlung – mit hohem Tagverbrauch passt die Wärmepumpe ideal zur PV-Anlage am Dach.", href: "/hotellerie-tourismus" },
  { icon: Recycle, title: "Abwärmenutzung", text: "Kälteanlagen, Druckluft und Serverräume geben Wärme ab, die eine Wärmepumpe auf Heiz- oder Prozesstemperatur hebt." },
  { icon: Snowflake, title: "Heizen und Kühlen", text: "Reversible Systeme kühlen Büros und Verkaufsflächen im Sommer – genau dann, wenn die PV-Anlage am meisten liefert." },
  { icon: Building2, title: "Gemeinden & Wohnbau", text: "Schulen, Kindergärten, Bauhöfe und gemeinnütziger Wohnbau – oft kombiniert mit Photovoltaik und Energiegemeinschaft.", href: "/kommunen" },
];

const TEMPERATUREN = [
  { anwendung: "Flächenheizung (Fußboden, Industrieboden)", von: 30, bis: 40, temp: "ca. 30–40 °C", hinweis: "Beste Effizienz, Standard im Neubau und in Hallen" },
  { anwendung: "Heizkörper im Bestand", von: 50, bis: 60, temp: "ca. 50–60 °C", hinweis: "Mit Heizlastberechnung und ggf. Tausch einzelner Heizkörper" },
  { anwendung: "Deckenstrahlplatten Halle", von: 40, bis: 60, temp: "ca. 40–60 °C", hinweis: "Abhängig von Hallenhöhe und Auslegung" },
  { anwendung: "Warmwasser Hotel, Pflege, Sport", von: 60, bis: 68, temp: "≥ 60 °C", hinweis: "Legionellenschutz nach ÖNORM B 5019 beachten" },
  { anwendung: "Niedertemperatur-Prozesswärme", von: 60, bis: 90, temp: "bis ca. 90 °C", hinweis: "Hochtemperatur-Wärmepumpe, idealerweise mit Abwärme als Quelle" },
];

const FOERDERUNG = [
  {
    icon: Landmark,
    titel: "Bund: Raus aus Öl und Gas",
    text: "Die Bundesförderung für den Tausch fossiler Heizungen war 2026 bereits im Juli ausgeschöpft. Bereits registrierte Projekte bleiben gültig; für 2027 ist ein neues, geringeres Budget angekündigt.",
    href: "/forderungen/bundesfoerderung",
    link: "Bundesförderung aktuell",
  },
  {
    icon: BadgeEuro,
    titel: "Neun Bundesländer",
    text: "Die Länder fördern Heizungstausch und Wärmepumpen mit eigenen Programmen, teils über die Wohnbauförderung. Konditionen und Fristen unterscheiden sich stark.",
    href: "/forderungen/landesforderungen",
    link: "Landesförderungen",
  },
  {
    icon: Factory,
    titel: "Betriebe: Umweltförderung",
    text: "Unternehmen können Wärmepumpen und Abwärmenutzung über die betriebliche Umweltförderung im Inland (UFI) der KPC einreichen – vor der Bestellung.",
    href: "/forderungen/bundesfoerderung",
    link: "Förderung für Betriebe",
  },
];

const FAQ = [
  {
    q: "Eignet sich eine Wärmepumpe für die Beheizung einer Halle?",
    a: "Ja, wenn das Wärmeabgabesystem zur Wärmepumpe passt. Mit Industrieflächenheizung oder Deckenstrahlplatten reichen niedrige Vorlauftemperaturen, und die Wärmepumpe arbeitet effizient. Entscheidend sind Heizlast, Hallenhöhe, Torbereiche und Nutzungszeiten. Wir berechnen die Heizlast und prüfen, ob eine Kombination mit bestehender Heizung sinnvoll ist.",
  },
  {
    q: "Kann eine Wärmepumpe Prozesswärme liefern?",
    a: "Für Niedertemperatur-Prozesse bis rund 90 °C ja – etwa für Reinigung, Trocknung oder Lebensmittelverarbeitung. Am wirtschaftlichsten ist das, wenn eine Abwärmequelle wie eine Kälteanlage oder Druckluft zur Verfügung steht. Für höhere Temperaturen gibt es Industrie-Wärmepumpen, die wir projektbezogen mit Fachplanern bewerten.",
  },
  {
    q: "Welche Förderung gibt es aktuell für Wärmepumpen in Österreich?",
    a: "Die Bundesförderung „Raus aus Öl und Gas“ war 2026 bereits im Juli ausgeschöpft; bereits registrierte Projekte bleiben gültig, für 2027 ist ein neues, geringeres Budget angekündigt. Unabhängig davon fördern die Bundesländer mit eigenen Programmen, und Betriebe können die Umweltförderung im Inland der KPC nutzen. Den aktuellen Stand prüfen wir vor jedem Angebot.",
  },
  {
    q: "Wie viel Solarstrom kann die Wärmepumpe nutzen?",
    a: "In Wohngebäuden sind rund 20 bis 35 % des Wärmepumpenstroms aus der eigenen PV-Anlage realistisch, weil im Winter wenig Solarstrom anfällt. In Hotels und Betrieben mit hohem Warmwasser- oder Kühlbedarf im Sommer liegt der Anteil oft deutlich höher. Mit Pufferspeicher, SG-Ready-Steuerung und Energiemanagement lässt er sich weiter steigern.",
  },
  {
    q: "Muss die Wärmepumpe beim Netzbetreiber gemeldet werden?",
    a: "Ja. Wärmepumpen sind dem Netzbetreiber zu melden; bei größeren Leistungen prüft er den Anschluss. Die Meldung übernimmt unser Elektrotechniker. Mit einer meldepflichtigen Anlage ist ein Smart-Meter-Opt-out nach § 54 ElWG nicht möglich – die Viertelstundenwerte stehen dafür für Energiemanagement und dynamische Tarife zur Verfügung.",
  },
  {
    q: "Wie laut ist eine Luft-Wärmepumpe?",
    a: "Moderne Außengeräte sind im Normalbetrieb leise. Entscheidend sind Aufstellort, Abstand zur Nachbarschaft und schallreflektierende Wände. Wir planen die Position nach den Vorgaben der jeweiligen Bauordnung und orientieren uns bei der Beurteilung an der ÖAL-Richtlinie Nr. 3 für Schallimmissionen im Nachbarschaftsbereich.",
  },
  {
    q: "Lohnt sich eine Wärmepumpe im Altbau?",
    a: "Oft ja. Entscheidend ist nicht das Baujahr, sondern die nötige Vorlauftemperatur. Kommt das Gebäude an kalten Tagen mit rund 55 °C aus, arbeitet eine moderne Luft-Wasser-Wärmepumpe meist wirtschaftlich – häufig reicht der Tausch einzelner Heizkörper. Wir prüfen das mit einer Heizlastberechnung vor Ort.",
  },
];

export default function WarmepumpePage() {
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
        name: "Wärmepumpen für Gewerbe, Hotellerie und Gebäude",
        serviceType: "Planung, Installation und Einbindung von Wärmepumpen in Photovoltaikanlagen",
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
        breadcrumbs={[{ name: "Produkte" }, { name: "Wärmepumpe" }]}
        eyebrow="Wärmepumpe + Photovoltaik"
        title={
          <>
            Wärme für Betrieb und Gebäude – <span className="ov-text-gradient-light">mit eigenem Sonnenstrom</span>
          </>
        }
        lead="Eine Wärmepumpe macht aus einer Kilowattstunde Strom drei bis vier Kilowattstunden Wärme. Kombiniert mit Photovoltaik heizen, kühlen und erzeugen Betriebe, Hotels und Gebäude ihr Warmwasser zu einem guten Teil mit Strom vom eigenen Dach. Wir planen und binden die Wärmepumpe in PV-Anlage und Energiemanagement ein."
        image={{ src: "/Images/Ratgeber/waermepumpe-mit-photovoltaik.jpg", alt: "Wärmepumpe und Photovoltaikanlage an einem Gebäude" }}
        points={["Hallen, Prozesswärme, Hotellerie", "Heizlastberechnung statt Schätzung", "Einbindung in PV & Energiemanagement", "Förderstand geprüft"]}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Heizkosten vergleichen", href: "#heizkosten", icon: Calculator },
        ]}
      />

      <Kennzahlenband
        items={[
          { wert: "3–4", label: "kWh Wärme aus einer Kilowattstunde Strom" },
          { value: 90, prefix: "bis ", suffix: " °C", label: "Niedertemperatur-Prozesswärme mit Hochtemperatur-Wärmepumpe" },
          { wert: "20–35 %", label: "des Wärmepumpenstroms im Wohngebäude aus eigener PV realistisch" },
          { value: 60, prefix: "≥ ", suffix: " °C", label: "Warmwasser in Hotel und Pflege – Legionellenschutz nach ÖNORM B 5019" },
        ]}
      />

      {/* Gewerbe */}
      <Section tone="white" space="lg" id="gewerbe">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Für Betriebe"
              title={
                <>
                  Wärmepumpen im Gewerbe: <span className="ov-text-gradient">Halle, Prozess, Hotel</span>
                </>
              }
              lead="Im Gewerbe rechnet sich die Wärmepumpe besonders dort, wo Wärme oder Kälte tagsüber gebraucht wird und eine PV-Anlage am Dach sitzt. Entscheidend ist das Temperaturniveau – je niedriger, desto effizienter."
            />
            <Reveal dir="scale" delay={100} className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl lg:block">
              <Image src="/Images/AT/produkte-regionen/waermepumpe-ventilator-detail.jpg" alt="Ventilator einer Luft-Wasser-Wärmepumpe, Nahaufnahme" fill sizes="40vw" className="object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
              <p className="ov-glass absolute bottom-5 left-5 right-5 rounded-2xl px-5 py-4 text-[15px] font-semibold text-white">Heizlastberechnung statt Schätzung – für Halle, Hotel und Prozess.</p>
            </Reveal>
          </div>
          <FeatureGrid items={GEWERBE} cols={2} />
        </div>
      </Section>

      {/* Temperaturniveaus */}
      <Section tone="sand" space="lg">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <SectionHeading
            eyebrow="Temperaturniveau"
            title="Welche Temperatur braucht Ihre Anwendung?"
            lead="Die Jahresarbeitszahl sinkt, je höher die Vorlauftemperatur ist. Deshalb beginnt jede Planung mit der Frage, welche Temperatur wirklich gebraucht wird – und ob sich das Wärmeabgabesystem anpassen lässt."
          />
          <div>
            <TemperaturSkala items={TEMPERATUREN} />
            <p className="mt-3 text-[13px] text-ink-500">Typische Richtwerte; die Auslegung erfolgt nach Heizlastberechnung und Herstellerdaten.</p>
          </div>
        </div>
        <FachAkkordeon
          className="mt-10"
          items={[
            {
              id: "temperaturen-tabelle",
              icon: ThermometerSun,
              titel: "Für Technik & Einkauf: Vorlauftemperaturen als Tabelle",
              kurz: "Anwendung, Vorlauf, Hinweis",
              inhalt: <FachTabelle caption="Typische Vorlauftemperaturen nach Anwendung" minBreite={560} kopf={["Anwendung", "Vorlauf", "Hinweis"]} zeilen={TEMPERATUREN.map((t) => [t.anwendung, t.temp, t.hinweis])} />,
            },
          ]}
        />
      </Section>

      {/* Heizen mit Sonne */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Heizen mit Sonne"
          title="Was Photovoltaik für die Wärmepumpe wirklich leistet"
          text={[
            "Photovoltaik und Wärmepumpe sind ein starkes Team – aber nicht, weil das Dach im Winter die Heizung allein betreibt. Der Vorteil entsteht über das ganze Jahr: Warmwasser und Kühlung im Sommer, Heizen in Frühjahr und Herbst.",
            "Mit intelligenter Steuerung heizt die Wärmepumpe bevorzugt dann vor, wenn die Sonne scheint, und nutzt Pufferspeicher und Gebäudemasse als Wärmespeicher.",
          ]}
          points={[
            { title: "SG-Ready-Steuerung", text: "Die Wärmepumpe läuft bei Solarüberschuss bevorzugt." },
            { title: "Warmwasser mit Sonne", text: "Im Sommer oft fast vollständig solar." },
            { title: "Viertelstundenwerte", text: "Smart Meter und Energiemanagement steuern nach Erzeugung und Tarif." },
          ]}
          aside={<SonnenJahr />}
          reverse
        />
      </Section>

      {/* Heizkostenvergleich */}
      <Section tone="sand" space="lg" id="heizkosten">
        <SectionHeading
          eyebrow="Heizkostenvergleich"
          title={
            <>
              Öl, Gas oder Wärmepumpe – <span className="ov-text-gradient">was kostet Heizen?</span>
            </>
          }
          lead="Eine Wärmepumpe mit Jahresarbeitszahl 3,3 braucht für 18.000 kWh Wärme rund 5.500 kWh Strom. Kommt ein Teil davon vom eigenen Dach, sinken die Energiekosten weiter. Passen Sie die Werte an Ihr Gebäude an – alle Annahmen sind offengelegt."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <Heizkostenvergleich />
        </Reveal>
      </Section>

      {/* Förderung */}
      <Section tone="navy" space="lg" id="foerderung" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-16 h-[440px] w-[440px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-sun-400/10 blur-[130px]" />
        <SectionHeading
          dark
          eyebrow="Förderung in Österreich"
          title="Förderstand 2026 – ehrlich eingeordnet"
          lead="Die Förderlandschaft für Wärmepumpen hat sich 2026 stark verändert. Beträge nennen wir hier bewusst nicht, weil sie sich laufend ändern – wir prüfen den aktuellen Stand vor jedem Angebot."
          className="relative mb-12"
        />
        <div className="relative grid gap-5 md:grid-cols-3">
          {FOERDERUNG.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.titel} delay={i * 80}>
                <article className="ov-glass flex h-full flex-col rounded-3xl p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-500/20 text-ov-300">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-display text-[18px] font-bold text-white">{f.titel}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-white/70">{f.text}</p>
                  <Link href={f.href} className="group mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-300 hover:text-ov-200">
                    {f.link}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="relative mt-8 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-ov-600 to-ov-700 p-7 text-white shadow-xl md:flex-row md:items-center md:justify-between md:p-9">
          <div>
            <p className="font-display text-[19px] font-bold">Finanzierung und Leasing</p>
            <p className="mt-1 text-[15px] text-white/70">Für Betriebe organisieren wir auf Wunsch Leasing oder vermitteln Finanzierungspartner.</p>
          </div>
          <Button href="/service/finanzierung" variant="white" pfeil>
            Finanzierung ansehen
          </Button>
        </Reveal>
        <p className="relative mt-5 flex gap-2 text-[13px] leading-relaxed text-white/55">
          <FileCheck2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
          Stand September 2026. Förderansuchen bzw. Registrierung müssen in der Regel vor der Bestellung erfolgen. Keine Rechts- oder Förderberatung im Einzelfall.
        </p>
      </Section>

      {/* Ablauf */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Ablauf"
          title="In vier Schritten zur Wärmepumpe"
          lead="Von der Heizlastberechnung bis zur Inbetriebnahme – mit einem Ansprechpartner und der Förderung im Blick."
          align="center"
          className="mb-14"
        />
        <Steps
          items={[
            { icon: ClipboardList, title: "Bestand & Heizlast", text: "Begehung, Heizlastberechnung, Temperaturniveaus, Abwärmequellen und Prüfung des Stromanschlusses." },
            { icon: FileCheck2, title: "Konzept & Förderung", text: "Systemwahl, Wirtschaftlichkeit mit PV-Anteil und Prüfung von Bundes-, Landes- und Betriebsförderung vor der Bestellung." },
            { icon: Wrench, title: "Installation", text: "Montage durch befugte Fachbetriebe für Heizungs- und Elektrotechnik, hydraulischer Abgleich und Meldung beim Netzbetreiber." },
            { icon: ThermometerSun, title: "Inbetriebnahme & PV", text: "Einregulierung, Einbindung in PV-Anlage und Energiemanagement, Einweisung und Monitoring." },
          ]}
        />
      </Section>

      <SolarrechnerTeaser
        href="/rechner/waermepumpe"
        cta="Zum Wärmepumpen-Rechner"
        titel="Was spart eine Wärmepumpe in Ihrem Gebäude?"
        text="Wärmebedarf, Heizsystem und PV-Anlage eingeben – der Rechner zeigt eine erste Einschätzung der Heizkosten im Vergleich zur bisherigen Heizung."
      />

      <Section tone="sand" space="lg">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Häufige Fragen"
              title="Wärmepumpe – fachlich beantwortet"
              lead="Sie haben eine andere Frage? Rufen Sie uns an – wir beraten persönlich und herstellerunabhängig."
            />
            <Reveal delay={100} className="mt-8 flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
                <Sparkles aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-[16px] font-bold text-ink-900">PV-Anlage schon geplant?</p>
                <Link href="/produkte/photovoltaikanlage" className="group mt-0.5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                  Photovoltaik & Wärmepumpe kombinieren
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Heizen und kühlen Sie künftig mit Ihrer eigenen Sonne."
        text={`Persönliche Beratung von ${FIRMA.name} aus ${FIRMA.ort} – mit Heizlastberechnung, ehrlicher Wirtschaftlichkeitsrechnung und aktuellem Förderstand, für Betriebe und Gebäude in ganz Österreich.`}
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Ersparnis berechnen", href: "/rechner/waermepumpe" }}
      />
    </div>
  );
}
