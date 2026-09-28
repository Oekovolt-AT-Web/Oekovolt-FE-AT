// src/app/produkte/wallbox/page.js
//
// Produktseite Wallbox – Österreich. Privat und Kleinbetrieb; für Flotten,
// Mitarbeiter- und Kundenparkplätze führt die Seite prominent zu
// /ladeinfrastruktur.
//
// Rechtslage (Stand 09/2026, Quellen in @/data/wallbox):
//   - jede Ladeeinrichtung ist dem Netzbetreiber zu melden
//   - bis 11 kW dreiphasig je Anschluss in der Regel ohne gesonderte Prüfung,
//     darüber Einzelprüfung durch den Netzbetreiber
//   - einphasig max. 3,68 kVA (Schieflastgrenze TAEV)
//   - Smart Meter: kein Opt-out bei meldepflichtiger Wallbox (§ 54 ElWG)
//   - Wohnungseigentum: Zustimmungsfiktion seit 1.1.2022 (WEG-Novelle 2022)
// Keine Backoffice-Texte mehr (die API lieferte die deutsche Rechtslage).

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calculator,
  Car,
  ClipboardCheck,
  FileSignature,
  Gauge,
  Landmark,
  PlugZap,
  Receipt,
  SlidersHorizontal,
  Sun,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
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
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import UeberschussLaden from "@/components/Wallbox/UeberschussLaden";
import Laderechner from "@/components/Wallbox/Laderechner";
import { WALLBOX } from "@/data/wallbox";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";

const PFAD = "/produkte/wallbox";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const NB = WALLBOX.netzbetreiber;
const kva = (n) => n.toLocaleString("de-DE");

const TITLE = "Wallbox & PV-Überschussladen in Österreich | Ökovolt";
const DESCRIPTION =
  "Wallbox mit Photovoltaik: E-Auto mit eigenem Solarstrom laden, Meldung beim Netzbetreiber inklusive. Für Betriebe: Ladeinfrastruktur mit Lastmanagement.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Wallbox", "Wallbox Österreich", "PV-Überschussladen", "Wallbox Photovoltaik", "Wallbox Netzbetreiber Meldung", "Ladestation Betrieb"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Elektroauto lädt an einer Wallbox" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const RECHT = [
  {
    icon: FileSignature,
    title: "Meldung beim Netzbetreiber",
    text: "Jede Ladeeinrichtung ist dem Netzbetreiber zu melden. Die Meldung erstellt der befugte Elektrotechniker – bei uns im Leistungsumfang.",
  },
  {
    icon: Gauge,
    title: `Bis ${NB.ohnePruefungBisKw} kW in der Regel ohne Netzprüfung`,
    text: `Eine dreiphasige Wallbox bis ${NB.ohnePruefungBisKw} kW je Netzanschluss ist üblicherweise ohne gesonderte Prüfung möglich. Bei 22 kW prüft der Netzbetreiber den Anschluss im Einzelfall.`,
  },
  {
    icon: Zap,
    title: `Einphasig max. ${kva(NB.schieflastKva)} kVA`,
    text: `Nach den technischen Anschlussbedingungen darf eine einphasige Last höchstens ${kva(NB.schieflastKva)} kVA (16 A) betragen – deshalb laden Wallboxen einphasig nur mit reduzierter Leistung.`,
  },
  {
    icon: Building2,
    title: "Wohnungseigentum",
    text: `Seit der WEG-Novelle (${WALLBOX.weg.seit}) gilt für Ladestationen zum langsamen Laden eine Zustimmungsfiktion: Widerspricht kein Miteigentümer binnen ${WALLBOX.weg.zustimmungsfiktionMonate} Monaten nach schriftlicher Verständigung, gilt die Zustimmung als erteilt.`,
  },
  {
    icon: SlidersHorizontal,
    title: "Smart Meter mit Viertelstundenwerten",
    text: "Mit einer meldepflichtigen Wallbox ist ein Smart-Meter-Opt-out nach § 54 ElWG nicht möglich. Die Viertelstundenwerte nutzen Sie für Überschussladen und dynamische Tarife.",
    href: "/produkte/smartmeter",
  },
  {
    icon: Landmark,
    title: "Förderung",
    text: "Förderungen für Ladeinfrastruktur ändern sich häufig und unterscheiden sich zwischen Bund und Bundesländern. Wir prüfen den aktuellen Stand vor dem Angebot.",
    href: "/forderungen/landesforderungen",
  },
];

const GEWERBE = [
  { icon: Truck, title: "E-Flotte", text: "Dienstfahrzeuge über Nacht und mit Solarüberschuss laden – mit Lastmanagement statt teurem Netzausbau." },
  { icon: Users, title: "Mitarbeitende", text: "Laden am Arbeitsplatz mit Zugangssteuerung und nachvollziehbarer Abrechnung." },
  { icon: Car, title: "Kundschaft & Gäste", text: "Ladepunkte für Handel, Hotellerie und Tourismus – auch mit Bezahlfunktion." },
  { icon: Receipt, title: "Abrechnung & Lastmanagement", text: "Dynamisches Lastmanagement, Kombination mit PV-Carport und Gewerbespeicher." },
];

const FAQ = [
  {
    q: "Muss ich meine Wallbox in Österreich anmelden?",
    a: "Ja. Jede Ladeeinrichtung ist dem Netzbetreiber zu melden, die Meldung erstellt der befugte Elektrotechniker. Eine dreiphasige Wallbox bis 11 kW je Netzanschluss ist üblicherweise ohne gesonderte Netzprüfung möglich; bei 22 kW prüft der Netzbetreiber den Anschluss im Einzelfall. Die genauen Vorgaben regelt jeder Netzbetreiber in seinen Anschlussbedingungen.",
  },
  {
    q: "11 kW oder 22 kW – was ist sinnvoll?",
    a: "Für zu Hause reichen 11 kW in aller Regel: Die meisten E-Autos laden an Wechselstrom ohnehin mit maximal 11 kW, und 100 km Reichweite sind in rund zwei Stunden nachgeladen. 22 kW lohnen sich nur, wenn das Fahrzeug das unterstützt und der Netzbetreiber den Anschluss freigibt.",
  },
  {
    q: "Wie funktioniert PV-Überschussladen?",
    a: "Ein Energiemanager misst am Netzanschlusspunkt, wie viel Solarstrom gerade übrig ist, und regelt die Wallbox passend nach. Weil E-Autos mindestens etwa 1,4 kW (einphasig, 6 A) benötigen, schaltet eine gute Wallbox bei wenig Sonne auf eine Phase und bei viel Sonne auf drei Phasen um. So fließt überwiegend eigener Solarstrom ins Auto.",
  },
  {
    q: "Darf ich im Wohnungseigentum eine Wallbox montieren?",
    a: "Grundsätzlich braucht es die Zustimmung der übrigen Wohnungseigentümer. Seit der WEG-Novelle mit 1. Jänner 2022 gilt für Ladestationen zum langsamen Laden eine Zustimmungsfiktion: Werden alle Miteigentümer schriftlich verständigt und widerspricht niemand binnen zwei Monaten, gilt die Zustimmung als erteilt. Für Tiefgaragen empfehlen wir ein gemeinsames Konzept mit Lastmanagement.",
  },
  {
    q: "Kann ich die Wallbox an meine bestehende PV-Anlage anbinden?",
    a: "Meist ja. Voraussetzung ist, dass Wallbox und Wechselrichter bzw. Energiemanager miteinander kommunizieren – etwa über einen Energiezähler am Hausanschluss. Wir prüfen die Bestandsanlage und empfehlen eine kompatible Lösung.",
  },
  {
    q: "Wir brauchen Ladepunkte für den Betrieb – ist das eine Wallbox?",
    a: "Technisch ja, planerisch nein: Mehrere Ladepunkte brauchen Lastmanagement, oft eine Prüfung der Anschlussleistung beim Netzbetreiber, Zugangssteuerung und Abrechnung. Das planen wir als Ladeinfrastruktur – auf Wunsch kombiniert mit PV-Carport und Gewerbespeicher.",
  },
];

export default function WallboxPage() {
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
        name: "Wallbox-Installation mit PV-Überschussladen",
        serviceType: "Installation von Ladeeinrichtungen für Elektrofahrzeuge",
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
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Wallbox" }]}
        eyebrow="Wallbox & E-Mobilität"
        title={
          <>
            E-Auto laden mit <span className="ov-text-gradient">eigenem Solarstrom</span>
          </>
        }
        lead="Mit einer Wallbox laden Sie Ihr Elektroauto sicher und schnell – und mit PV-Überschussladen zu einem großen Teil mit Strom vom eigenen Dach. Wir planen, installieren und melden die Wallbox beim Netzbetreiber. Für Betriebe planen wir Ladeinfrastruktur mit Lastmanagement."
        image={{ src: "/Images/Dienstleistungen/Smartphone/wallbox-scaled.jpg", alt: "Elektroauto lädt an einer Wallbox" }}
        points={["Laden mit PV-Überschuss", "Meldung beim Netzbetreiber inklusive", "11 kW – ideal für zu Hause", "Einbindung ins Energiemanagement"]}
        actions={[
          { label: "Wallbox-Angebot anfragen", href: "/angebot" },
          { label: "Ladekosten berechnen", href: "#ladekosten", icon: Calculator },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <PlugZap aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">Mehrere Ladepunkte?</p>
              <Link href="/ladeinfrastruktur" className="mt-1 inline-block text-[12.5px] font-semibold leading-snug text-ov-700 hover:text-ov-800">
                Zur Ladeinfrastruktur für Betriebe →
              </Link>
            </div>
          </div>
        }
      />

      {/* Kennzahlen-Leiste */}
      <div className="border-b border-ink-100 bg-white">
        <dl className="ov-container grid grid-cols-2 gap-px py-2 md:grid-cols-4">
          {[
            { w: "11 kW", l: "Ladeleistung – 100 km in rund 2 Stunden" },
            { w: `${WALLBOX.verbrauchProHundert} kWh`, l: "Strombedarf je 100 km (Kompaktklasse)" },
            { w: "ab 1,4 kW", l: "Mindestleistung fürs Überschussladen" },
            { w: `${kva(NB.schieflastKva)} kVA`, l: "Grenze für einphasiges Laden" },
          ].map((k, i) => (
            <Reveal key={k.l} delay={i * 70} className="px-2 py-6 md:px-6">
              <dt className="sr-only">{k.l}</dt>
              <dd className="ov-num font-display text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-extrabold leading-none tracking-tight text-ink-900">{k.w}</dd>
              <dd className="mt-2 text-[13px] leading-snug text-ink-500">{k.l}</dd>
            </Reveal>
          ))}
        </dl>
      </div>

      {/* Gewerbe */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Für Betriebe"
              title="Mehr als eine Wallbox: Ladeinfrastruktur"
              lead="Sobald mehrere Fahrzeuge laden, entscheidet nicht die Wallbox, sondern das Konzept: Anschlussleistung, Lastmanagement, Zugang und Abrechnung. Das planen wir für Flotten, Mitarbeitende und Kundschaft – auf Wunsch mit PV-Carport und Gewerbespeicher."
            />
            <div className="mt-8">
              <Button href="/ladeinfrastruktur" size="lg" pfeil>
                Ladeinfrastruktur für Betriebe
              </Button>
            </div>
          </div>
          <FeatureGrid items={GEWERBE} cols={2} tone="dark" />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Warum eine Wallbox?"
          title="Schneller und sicherer laden als an der Steckdose"
          text="Im Gegensatz zur Haushaltssteckdose lädt Ihr E-Auto an einer Wallbox deutlich schneller und ist durch integrierte Schutzeinrichtungen vor Überlastung geschützt. Eine smarte Wallbox lässt sich außerdem in PV-Anlage, Speicher und Energiemanagement einbinden."
          image={{ src: "/Images/Ratgeber/pv-ueberschussladen.jpg", alt: "E-Auto lädt an einer Wallbox in der Garage" }}
        >
          <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
            <div className="rounded-2xl bg-ink-50 p-4 ring-1 ring-ink-200/70">
              <p className="text-[12.5px] text-ink-500">Haushaltssteckdose</p>
              <p className="ov-num mt-1 font-display text-[20px] font-extrabold text-ink-700">~ 2,3 kW</p>
              <p className="text-[12.5px] text-ink-500">100 km in ca. 9 h</p>
            </div>
            <div className="rounded-2xl bg-ov-50 p-4 ring-1 ring-ov-200">
              <p className="text-[12.5px] text-ov-700">Wallbox</p>
              <p className="ov-num mt-1 font-display text-[20px] font-extrabold text-ink-900">11 kW</p>
              <p className="text-[12.5px] text-ink-600">100 km in ca. 2 h</p>
            </div>
          </div>
        </SplitMedia>
      </Section>

      <Section tone="sand" space="lg" id="ueberschussladen">
        <SectionHeading
          eyebrow="PV-Überschussladen"
          title={
            <>
              Ihr Auto lädt, <span className="ov-text-gradient">wenn die Sonne scheint</span>
            </>
          }
          lead="Beim Überschussladen fließt nur der Solarstrom ins Auto, den das Gebäude gerade nicht braucht. Wählen Sie Strecke, Wetter und Lademodus – und sehen Sie, woher der Strom kommt."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <UeberschussLaden />
        </Reveal>
      </Section>

      <Section tone="white" space="lg" id="ladekosten">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Ladekosten im Jahr"
            title={
              <>
                Was kostet Ihr <span className="ov-text-gradient">Kilometer</span>?
              </>
            }
            lead="Mit eigenem Solarstrom zu laden ist die günstigste Art, elektrisch zu fahren. Stellen Sie Ihre Fahrleistung ein und vergleichen Sie direkt."
          />
          <Reveal delay={100}>
            <ul className="space-y-3 text-[15.5px] text-ink-700">
              <li className="flex gap-3">
                <Gauge aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                Solarstrom kostet Sie nur den Marktpreis, den Sie bei Einspeisung erhalten hätten.
              </li>
              <li className="flex gap-3">
                <Zap aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                Mit einem Spotpreis-Tarif laden Sie den Rest in günstigen Viertelstunden.
              </li>
            </ul>
            <Link href="/service/stromtarif" className="group mt-4 inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Dynamischen Stromtarif ansehen
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <Reveal dir="scale">
          <Laderechner />
        </Reveal>
      </Section>

      {/* Recht Österreich */}
      <Section tone="sand" space="lg" id="recht">
        <SectionHeading
          eyebrow="Rechtslage Österreich"
          title="Was für eine Wallbox in Österreich gilt"
          lead="Die wichtigsten Regeln von Netzbetreiber, Wohnungseigentum und Messung – Stand September 2026. Die Details legt jeder Netzbetreiber in seinen Anschlussbedingungen fest."
          className="mb-12"
        />
        <FeatureGrid items={RECHT} cols={3} />
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="So läuft es ab" title="In vier Schritten zur eigenen Wallbox" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: ClipboardCheck, title: "Vor-Ort-Check", text: "Wir prüfen Zählerschrank, Absicherung und Kabelweg und empfehlen die passende Wallbox – auf Wunsch mit PV und Speicher." },
            { icon: FileSignature, title: "Meldung", text: "Unser Elektrotechniker meldet die Ladeeinrichtung beim Netzbetreiber und klärt bei 22 kW die Freigabe." },
            { icon: Wrench, title: "Installation", text: "Leitung, Schutztechnik und Wallbox nach ÖVE/ÖNORM E 8101 – mit Prüfprotokoll und Einweisung." },
            { icon: Sun, title: "Solar laden", text: "Wir verbinden Wallbox, Wechselrichter und Energiemanagement – ab dann lädt das Auto automatisch mit Sonnenstrom." },
          ]}
        />
        <p className="mx-auto mt-10 max-w-2xl text-center text-[14px] leading-relaxed text-ink-500">
          Die Kosten hängen vor allem von Kabelweg und Zählerschrank ab, weniger vom Gerät. Einen Festpreis nennen wir nach dem Vor-Ort-Check.{" "}
          <Link href="/ratgeber/wallbox-installation" className="font-semibold text-ov-700 hover:text-ov-800">
            Kosten & Voraussetzungen im Ratgeber
          </Link>
        </p>
      </Section>

      <SolarrechnerTeaser
        href="/rechner/wallbox"
        cta="Zum E-Auto-Laderechner"
        titel="Wie viel sparen Sie mit Solarstrom im Tank?"
        text="Fahrleistung, Anlagengröße und Ladeverhalten eingeben – der Rechner zeigt eine erste Einschätzung zu Solaranteil und Ladekosten."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Wallbox – kurz & ehrlich beantwortet"
            lead="Mehr Details zu Kosten, Meldung und Technik finden Sie im Ratgeber Wallbox-Installation."
          >
            <Link href="/ratgeber/wallbox-installation" className="group mt-6 inline-flex h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Zum Ratgeber
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Laden Sie mit der Sonne – ab dem ersten Tag."
        text={`Wallbox, Photovoltaik und Energiemanagement aus einer Hand: ${FIRMA.name} aus ${FIRMA.ort} plant, installiert und meldet alles beim Netzbetreiber – in ganz Österreich.`}
        primary={{ label: "Wallbox-Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Ladekosten berechnen", href: "/rechner/wallbox" }}
      />
    </div>
  );
}
