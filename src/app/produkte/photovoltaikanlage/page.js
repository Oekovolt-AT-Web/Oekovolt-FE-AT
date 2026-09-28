// src/app/produkte/photovoltaikanlage/page.js
//
// Produktseite Photovoltaikanlage – Österreich, Schwerpunkt Gewerbe, Industrie,
// Landwirtschaft und öffentliche Hand. Privat (Premium-Wohnhaus, Chalet) ist
// als eigener Abschnitt nachgeordnet.
//
// Bewusst ohne Backoffice-Texte: Die bisherige API lieferte Inhalte der
// deutschen Seite (Allgäu, EEG, 0 % USt). Alle Aussagen hier sind statisch und
// auf die österreichische Rechtslage geprüft (Stand 09/2026, Quellen in den
// Kommentaren). Keine Ökovolt-Preise: Die Kostentabelle zeigt Branchen-
// Richtwerte aus @/data/solarrechner (Marktstatistik BMIMI, IEA PVPS).

import Link from "next/link";
import {
  ArrowRight,
  BadgeEuro,
  CalendarCheck2,
  Car,
  Check,
  ClipboardCheck,
  CloudHail,
  Cpu,
  FileCheck2,
  Gauge,
  LayoutGrid,
  LineChart,
  Mountain,
  Receipt,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Sun,
  Sunrise,
  Tractor,
  Warehouse,
  Wind,
  Zap,
} from "lucide-react";
import FeaturedLogos from "@/components/photovoltaikanlage/partners";
import AnlagenExplorer from "@/components/photovoltaikanlage/AnlagenExplorer";
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
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Querverweise from "@/components/Reusable/Querverweise";
import { ANNAHMEN, PREISQUELLEN, preisProKwpNetto } from "@/data/solarrechner";

const PFAD = "/produkte/photovoltaikanlage";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "Photovoltaikanlage für Gewerbe & Industrie | Ökovolt";
const DESCRIPTION =
  "PV-Anlagen für Gewerbe, Industrie und Landwirtschaft in Österreich: Module, Unterkonstruktion, Wechselrichter, Parkregler und Netzanschluss nach TOR.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Photovoltaikanlage Gewerbe", "PV-Anlage Industrie", "Photovoltaik Österreich", "Hallendach Photovoltaik", "Freiflächenanlage", "Glas-Glas-Module"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Photovoltaikanlage auf einem Gewerbedach" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

/* ------------------------------------------------------------------ */
/* Inhalte                                                             */
/* ------------------------------------------------------------------ */

const MODULE = [
  {
    technik: "Glas-Glas-Module",
    kern: "Rückseite aus Glas statt Folie; mechanisch steif, diffusionsdicht, weniger anfällig für Mikrorisse und Feuchte.",
    einsatz: "Standard für Gewerbe, Landwirtschaft (Ammoniak im Stallbereich), alpine Lagen und lange Laufzeiten.",
  },
  {
    technik: "Bifaziale Module",
    kern: "Nutzen zusätzlich das von hinten einfallende Licht. Der Mehrertrag hängt von Albedo, Aufständerungshöhe und Reihenabstand ab.",
    einsatz: "Freifläche, Agri-PV, aufgeständerte Flachdächer mit hellem Untergrund, Schneeflächen im Winter.",
  },
  {
    technik: "TOPCon (n-Typ)",
    kern: "Aktuelle Massentechnologie mit höherem Wirkungsgrad und besserem Temperaturverhalten als ältere PERC-Zellen.",
    einsatz: "Breiter Standard für Dach- und Freiflächenanlagen mit gutem Preis-Leistungs-Verhältnis.",
  },
  {
    technik: "Heterojunction (HJT)",
    kern: "Sehr niedriger Temperaturkoeffizient und hohe Bifazialität; spielt die Stärken bei Hitze und auf reflektierenden Flächen aus.",
    einsatz: "Heiße Dachflächen, bifaziale Freiflächen, Projekte mit hoher Ertragsanforderung je m².",
  },
  {
    technik: "Back-Contact (BC)",
    kern: "Kontakte auf der Rückseite, Vorderseite ohne Busbars; höchster Flächenwirkungsgrad, ruhiges Erscheinungsbild.",
    einsatz: "Begrenzte Dachfläche, repräsentative Gebäude, Hotels und Chalets.",
  },
];

const UNTERKONSTRUKTIONEN = [
  {
    icon: Warehouse,
    title: "Hallendach mit Ballast",
    text: "Aufgeständerte Systeme auf Foliendächern und Bitumen – ohne Durchdringung der Dachhaut. Entscheidend ist die Tragwerksreserve: Ballast, Schnee und Wind werden statisch nachgewiesen.",
  },
  {
    icon: LayoutGrid,
    title: "Trapezblech & Sandwichpaneel",
    text: "Kurzschienen oder Klemmsysteme direkt auf dem Blechprofil, leicht und schnell montiert. Wir prüfen Blechstärke, Befestigung und Dachzustand, bevor wir 25 Jahre darauf bauen.",
  },
  {
    icon: Sunrise,
    title: "Ost-West-Aufständerung",
    text: "Flache Neigung, dichte Belegung, breitere Erzeugungskurve von morgens bis abends. Passt zu Betrieben mit durchgehendem Tagverbrauch und senkt die Mittagsspitze.",
  },
  {
    icon: Sun,
    title: "Freifläche mit Rammprofil",
    text: "Gerammte Stahlprofile ohne Betonfundament, rückbaubar. Voraussetzung sind Widmung bzw. Zonierung nach dem Raumordnungsrecht des Bundeslandes und ein Baugrundgutachten.",
    href: "/freiflaechen-photovoltaik",
  },
  {
    icon: Car,
    title: "PV-Carport",
    text: "Überdachte Stellplätze für Mitarbeitende, Kundschaft und Flotte – Erzeugung und Ladeinfrastruktur an einem Ort. Statik, Baubewilligung und Brandschutz planen wir mit.",
    href: "/ladeinfrastruktur",
  },
  {
    icon: Mountain,
    title: "Schrägdach, Indach & alpin",
    text: "Für Hotels, Chalets und Bauernhöfe in Schneelagen: verstärkte Schienen, zusätzliche Dachhaken, Schneefang und Module mit geprüfter Schneelast.",
    href: "/chalets",
  },
];

const WECHSELRICHTER = [
  {
    topologie: "String-Wechselrichter (dezentral)",
    staerke: "Mehrere MPP-Tracker, gute Anpassung an Ost-West- und Teilverschattung, einfacher Tausch einzelner Geräte.",
    typisch: "Dächer von ca. 30 kWp bis in den MW-Bereich",
  },
  {
    topologie: "Zentralwechselrichter",
    staerke: "Wenige große Einheiten, niedrige spezifische Kosten, meist mit eigener Trafostation.",
    typisch: "Große Freiflächenanlagen",
  },
  {
    topologie: "Hybrid-Wechselrichter",
    staerke: "Speicher DC-seitig integriert, Ersatzstrom möglich, ein Gerät für PV und Batterie.",
    typisch: "Kleingewerbe, Landwirtschaft, Premium-Wohnhaus",
  },
  {
    topologie: "Batterie-Wechselrichter (AC-gekoppelt)",
    staerke: "Speicher unabhängig vom PV-Wechselrichter nachrüstbar; typisch für Gewerbespeicher und Peak Shaving.",
    typisch: "Bestandsanlagen, C&I-Speicher",
  },
];

const eur = (n) => `${(Math.round(n / 1000) * 1000).toLocaleString("de-DE")} €`;
const KOSTEN_GROESSEN = [30, 100, 250, 500, 1000];

const PAKET = [
  "Lastganganalyse aus Viertelstundenwerten des Netzbetreibers",
  "Dachbegehung, Statik-Vorprüfung und Belegungsplan",
  "Ertragsprognose und Wirtschaftlichkeitsrechnung",
  "Netzzugangsantrag und Abstimmung mit dem Netzbetreiber",
  "Module, Unterkonstruktion, Wechselrichter und Verkabelung",
  "Montage inklusive Absturzsicherung und Brandschutzkonzept",
  "Fertigstellungsmeldung durch unseren Elektrotechniker",
  "Parkregler, Monitoring und Anlagendokumentation",
  "Unterstützung beim Förderansuchen (EAG, Land)",
  "Wartungsvertrag und Fernüberwachung auf Wunsch",
];

const ABLAUF = [
  { icon: LineChart, title: "Lastgang & Ziel", text: "Wir werten Ihren Lastgang aus und klären das Ziel: maximaler Eigenverbrauch, Volleinspeisung, Peak Shaving oder Nachhaltigkeitsbericht." },
  { icon: ClipboardCheck, title: "Planung & Statik", text: "Belegungsplan, Tragwerksprüfung, Schnee- und Windlast, Brandschutz nach OVE R 11-1 und Stringplanung." },
  { icon: FileCheck2, title: "Netz & Förderung", text: "Netzzugangsantrag beim Netzbetreiber, Klärung der Anschlussleistung und – falls gewünscht – Förderansuchen im OeMAG-Fördercall." },
  { icon: Zap, title: "Montage & Inbetriebnahme", text: "Montage, Prüfung nach ÖVE/ÖNORM E 8101 und EN 62446, Fertigstellungsmeldung, Inbetriebnahme mit Parkregler und Monitoring." },
];

const RAHMEN = [
  {
    icon: BadgeEuro,
    wert: "EAG",
    titel: "Investitionszuschuss",
    text: "Bundesförderung nach § 56 EAG über OeMAG-Fördercalls in den Kategorien A bis D (bis 1.000 kWp). Beantragung vor Bestellung – die Sätze ändern sich je Call.",
    href: "/forderungen/bundesfoerderung",
  },
  {
    icon: Receipt,
    wert: "20 %",
    titel: "Umsatzsteuer",
    text: "Der befristete Nullsteuersatz für kleine PV-Anlagen endete mit 31. März 2025. Für vorsteuerabzugsberechtigte Betriebe ist die Umsatzsteuer kein Kostenfaktor.",
    href: "/forderungen/steuerlich",
  },
  {
    icon: ShieldCheck,
    wert: "0 €",
    titel: "Elektrizitätsabgabe",
    text: "Selbst erzeugter und selbst verbrauchter PV-Strom ist von der Elektrizitätsabgabe befreit – ein Vorteil jeder Kilowattstunde Eigenverbrauch.",
    href: "/forderungen/steuerlich",
  },
  {
    icon: Gauge,
    wert: "Markt",
    titel: "Überschuss verkaufen",
    text: "Einspeisung an einen Stromhändler, an die OeMAG zum Marktpreis oder per PPA. Eine gesetzlich garantierte, fixe Einspeisevergütung über 20 Jahre gibt es in Österreich nicht.",
    href: "/service/direktvermarktung",
  },
];

const FAQ = [
  {
    q: "Was kostet eine Photovoltaikanlage für einen Betrieb?",
    a: `Als Branchen-Richtwert kostet eine schlüsselfertige Dachanlage mit 100 kWp rund ${Math.round(preisProKwpNetto(100) / 10) * 10} € je kWp netto, mit 500 kWp rund ${Math.round(preisProKwpNetto(500) / 10) * 10} € je kWp (Marktstatistik und IEA PVPS Austria, fortgeschrieben). Der Preis je kWp sinkt mit der Größe; Statik, Kran, Trafo- oder Zählerumbau und Brandschutz können ihn erhöhen. Ein belastbares Angebot erstellen wir nach Lastganganalyse und Dachbegehung.`,
  },
  {
    q: "Welche Module verbauen Sie auf Gewerbedächern?",
    a: "Überwiegend Glas-Glas-Module in TOPCon-, HJT- oder Back-Contact-Technologie. Glas-Glas ist mechanisch steifer und unempfindlicher gegen Feuchte, Ammoniak und Mikrorisse – wichtig bei Laufzeiten von 25 Jahren und mehr. Auf Freiflächen und aufgeständerten Dächern setzen wir bifaziale Module ein, wenn der Untergrund genug Licht zurückwirft.",
  },
  {
    q: "Trägt unser Hallendach eine Photovoltaikanlage?",
    a: "Das klärt die Statik-Vorprüfung. Eine aufgeständerte Anlage mit Ballast bringt je nach System rund 15 bis 30 kg je m² zusätzlich auf das Dach, eine Montage direkt auf Trapezblech deutlich weniger. Maßgeblich sind die Tragwerksreserve, die Schneelast nach ÖNORM B 1991-1-3 und die Windlast nach ÖNORM B 1991-1-4. Bei knapper Reserve planen wir leichtere Systeme oder eine Ost-West-Belegung.",
  },
  {
    q: "Wie berücksichtigen Sie Schnee und Hagel?",
    a: "Wir ermitteln Schneelastzone und Seehöhe des Standorts über eHORA und legen Unterkonstruktion und Klemmbereiche danach aus. In schneereichen Lagen verwenden wir Module mit höherer geprüfter Last und Glas-Glas-Aufbau. Für Hagel achten wir auf die Hagelwiderstandsklasse der Module und beraten zur Versicherung. Den ersten Überblick liefert der Standort-Check.",
  },
  {
    q: "Wann braucht eine Anlage einen Parkregler?",
    a: "Sobald der Netzbetreiber Vorgaben zu Wirkleistungsbegrenzung, Blindleistung oder Fernsteuerung am Netzanschlusspunkt macht – spätestens bei Anlagen vom Typ B nach TOR Stromerzeugungsanlagen ab 250 kW, häufig auch darunter. Der Parkregler misst am Netzanschlusspunkt und regelt alle Wechselrichter gemeinsam. Wir setzen dafür unseren eigenen EZA-Regler ein.",
  },
  {
    q: "Wie läuft der Netzanschluss in Österreich ab?",
    a: "Zuerst stellen wir den Netzzugangsantrag beim zuständigen Netzbetreiber, der die Anschlussleistung prüft und einen Netzzugangsvertrag anbietet. Nach der Montage übermittelt unser Elektrotechniker die Fertigstellungsmeldung, und Sie geben den Stromabnehmer für den Überschuss bekannt – einen Stromhändler oder die OeMAG. Danach wird der Zählpunkt für die Einspeisung aktiviert.",
  },
  {
    q: "Welche Förderung gibt es für Photovoltaik im Betrieb?",
    a: "Auf Bundesebene den EAG-Investitionszuschuss, der in Fördercalls der OeMAG vergeben wird, dazu steuerliche Instrumente wie Investitionsfreibetrag und Abschreibung. Einige Bundesländer fördern zusätzlich. Weil sich Sätze und Termine je Call ändern, prüfen wir die Förderfähigkeit vor der Bestellung – das Förderansuchen muss vorher gestellt werden.",
  },
  {
    q: "Wie lange dauert ein Gewerbeprojekt?",
    a: "Das hängt vor allem vom Netzbetreiber und von der Anlagengröße ab. Bei Dachanlagen bis rund 250 kWp sind drei bis sechs Monate von der Lastganganalyse bis zur Inbetriebnahme üblich, die Montage selbst dauert meist wenige Tage bis Wochen. Bei Anlagen mit Trafostation oder Mittelspannungsanschluss bestimmen Netzprüfung und Lieferzeiten den Zeitplan.",
  },
  {
    q: "Bauen Sie auch Anlagen für Privathäuser?",
    a: "Ja, vor allem für Premium-Wohnhäuser und Chalets, bei denen Planung, Optik und Schneelast besondere Sorgfalt verlangen. Speicher, Wallbox, Wärmepumpe und Energiemanagement planen wir dann als ein System.",
  },
];

/* ------------------------------------------------------------------ */

export default function PhotovoltaikanlagePage() {
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
        name: "Photovoltaikanlagen für Gewerbe, Industrie und Landwirtschaft",
        serviceType: "Planung, Errichtung und Netzanschluss von Photovoltaikanlagen",
        description: DESCRIPTION,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
        audience: { "@type": "BusinessAudience", audienceType: "Gewerbe, Industrie, Landwirtschaft, öffentliche Hand" },
        url: PAGE_URL,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Bausteine einer Photovoltaikanlage",
          itemListElement: ["Solarmodule", "Unterkonstruktion", "Wechselrichter", "Parkregler", "Netzanschluss", "Monitoring"].map((n) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: n },
          })),
        },
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ name: "Produkte" }, { name: "Photovoltaikanlage" }]}
        eyebrow="Photovoltaikanlage · Gewerbe & Industrie"
        title={
          <>
            Photovoltaikanlagen für <span className="ov-text-gradient">Betriebe in ganz Österreich</span>
          </>
        }
        lead="Eine Photovoltaikanlage für Gewerbe und Industrie ist ein Kraftwerk am eigenen Standort: geplant nach Ihrem Lastgang, statisch nachgewiesen für österreichische Schnee- und Windlasten und nach TOR Stromerzeugungsanlagen an das Netz angeschlossen. Wir liefern Planung, Errichtung und Netzanschluss aus einer Hand."
        image={{ src: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg", alt: "Luftaufnahme eines Gewerbegebäudes mit Photovoltaikanlagen auf den Flachdächern" }}
        points={["Seit 2012 in Österreich", "Hallendach, Freifläche, Carport", "Eigener Parkregler (EZA-Regler)", "Alle neun Bundesländer"]}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Beratungstermin buchen", href: "/termin", icon: CalendarCheck2 },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <SlidersHorizontal aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">TOR-konform</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Netzanschluss mit eigenem Parkregler</p>
            </div>
          </div>
        }
      />

      <FeaturedLogos />

      {/* Module */}
      <Section tone="white" space="lg" id="module">
        <SectionHeading
          eyebrow="Solarmodule"
          title={
            <>
              Welche Module passen auf <span className="ov-text-gradient">Gewerbedächer?</span>
            </>
          }
          lead="Für Gewerbe, Landwirtschaft und alpine Standorte sind Glas-Glas-Module mit n-Typ-Zellen heute der Standard. Welche Zelltechnologie am besten passt, entscheiden Dachfläche, Temperatur, Aufständerung und Ertragsziel."
          className="mb-12"
        />
        <Reveal>
          <div tabIndex={0} role="region" aria-label="Modultechnologien im Vergleich" className="overflow-x-auto rounded-3xl ring-1 ring-ink-200/70">
            <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
              <caption className="sr-only">Modultechnologien für Photovoltaikanlagen im Vergleich</caption>
              <thead>
                <tr className="bg-navy-950 text-white">
                  <th scope="col" className="px-5 py-4 font-semibold">Technologie</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Was sie auszeichnet</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Typischer Einsatz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 bg-white">
                {MODULE.map((m) => (
                  <tr key={m.technik}>
                    <th scope="row" className="whitespace-nowrap px-5 py-4 align-top font-semibold text-ink-900">{m.technik}</th>
                    <td className="px-5 py-4 align-top leading-relaxed text-ink-600">{m.kern}</td>
                    <td className="px-5 py-4 align-top leading-relaxed text-ink-600">{m.einsatz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-ink-500">
            Datenblattwerte wie Wirkungsgrad, Temperaturkoeffizient und geprüfte Last vergleichen wir im Angebot je Modul.{" "}
            <Link href="/produkte/hersteller" className="font-semibold text-ov-700 hover:text-ov-800">
              Unsere Hersteller im Überblick
            </Link>
          </p>
        </Reveal>
      </Section>

      {/* Unterkonstruktion */}
      <Section tone="sand" space="lg" id="unterkonstruktion">
        <SectionHeading
          eyebrow="Unterkonstruktion"
          title="Das richtige Montagesystem für jede Fläche"
          lead="Die Unterkonstruktion entscheidet über Statik, Dichtheit und Lebensdauer der Anlage. Wir wählen das System nach Dachaufbau, Tragwerksreserve und Standortlasten – nicht nach Lagerbestand."
          className="mb-12"
        />
        <FeatureGrid items={UNTERKONSTRUKTIONEN} cols={3} />
      </Section>

      {/* Schnee, Wind, Hagel */}
      <Section tone="white" space="lg" id="schneelast">
        <SplitMedia
          eyebrow="Schneelast, Wind & Hagel"
          title="Ausgelegt für österreichische Standorte"
          text={[
            "Die Schneelast in Österreich reicht vom Flachland bis in hochalpine Lagen über ein Vielfaches – maßgeblich sind Schneelastzone und Seehöhe nach ÖNORM B 1991-1-3. Wind wird nach ÖNORM B 1991-1-4 angesetzt, bei Gebäudekanten und Randbereichen mit erhöhten Sogkräften.",
            "Wir ermitteln diese Werte für jede Adresse über die Naturgefahrenplattform eHORA und legen Unterkonstruktion, Klemmbereiche und Modulwahl darauf aus. Für Hagel berücksichtigen wir die Hagelwiderstandsklasse der Module.",
          ]}
          points={["Schneelastzone und Seehöhe je Adresse", "Wind- und Sogkräfte an Dachrand und Ecken", "Module mit geprüfter Last und Hagelwiderstand", "Schneefang und Abrutschschutz bei Schrägdächern"]}
          action={{ label: "Standort-Check starten", href: "/standort-check" }}
          image={{ src: "/Images/Ratgeber/photovoltaik-im-winter.jpg", alt: "Photovoltaikanlage auf einem verschneiten Dach" }}
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Snowflake, titel: "Schnee", text: "ÖNORM B 1991-1-3, Zone und Seehöhe aus eHORA" },
            { icon: Wind, titel: "Wind", text: "ÖNORM B 1991-1-4, Rand- und Eckbereiche" },
            { icon: CloudHail, titel: "Hagel", text: "Hagelwiderstandsklasse der Module, Versicherung" },
          ].map((k, i) => {
            const Icon = k.icon;
            return (
              <Reveal key={k.titel} delay={i * 80}>
                <div className="flex h-full items-start gap-4 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-[17px] font-bold text-ink-900">{k.titel}</h3>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{k.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Wechselrichter & Netzanschluss */}
      <Section tone="sand" space="lg" id="wechselrichter">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Wechselrichter & Netzanschluss"
              title="Die richtige Topologie – und ein Regler, der mit dem Netz spricht"
              lead="Die Wechselrichter-Topologie folgt der Dachgeometrie, der Anlagengröße und dem Speicherkonzept. Am Netzanschlusspunkt gelten die TOR Stromerzeugungsanlagen: Anlagen ab 0,8 kW sind Typ A, ab 250 kW Typ B – mit Anforderungen an Blindleistung, Wirkleistungsbegrenzung und Fernsteuerbarkeit."
            />
            <Reveal delay={100} className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
                  <Cpu aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-[17px] font-bold text-ink-900">Parkregler aus eigener Entwicklung</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
                    Unser EZA-Regler misst am Netzanschlusspunkt und regelt alle Wechselrichter gemeinsam: Einspeiselimit, Blindleistung nach Q(U) oder cos φ, Fernsteuerbefehle des Netzbetreibers.
                  </p>
                  <Link href="/technik/parkregler" className="group mt-3 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                    Parkregler im Detail
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <div tabIndex={0} role="region" aria-label="Wechselrichter-Topologien" className="overflow-x-auto rounded-3xl ring-1 ring-ink-200/70">
              <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
                <caption className="sr-only">Wechselrichter-Topologien für Photovoltaikanlagen</caption>
                <thead>
                  <tr className="bg-navy-950 text-white">
                    <th scope="col" className="px-5 py-4 font-semibold">Topologie</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Stärke</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Typisch für</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 bg-white">
                  {WECHSELRICHTER.map((w) => (
                    <tr key={w.topologie}>
                      <th scope="row" className="px-5 py-4 align-top font-semibold text-ink-900">{w.topologie}</th>
                      <td className="px-5 py-4 align-top leading-relaxed text-ink-600">{w.staerke}</td>
                      <td className="px-5 py-4 align-top leading-relaxed text-ink-600">{w.typisch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] text-ink-500">
              Typ A: ≥ 0,8 kW bis &lt; 250 kW · Typ B: ≥ 250 kW bis &lt; 35 MW (TOR Stromerzeugungsanlagen, E-Control).
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Komplettpaket */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Komplettpaket"
              title="Von der Lastganganalyse bis zur Fertigstellungsmeldung"
              lead="Ein Ansprechpartner, ein Angebot, ein Team – mit eigenem Elektrotechnik-Gewerbe. Das ist im Komplettpaket enthalten:"
            />
            <div className="mt-10">
              <Button href="/angebot" size="lg" pfeil>
                Komplettangebot anfordern
              </Button>
            </div>
          </div>
          <Reveal delay={100}>
            <ul className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {PAKET.map((p) => (
                <li key={p} className="flex gap-3 text-[15.5px] leading-snug text-white/85">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-500/20 text-ov-300">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Ablauf */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Projektablauf"
          title="In vier Etappen zur Anlage am Netz"
          lead="Bei Dachanlagen bis rund 250 kWp vergehen meist drei bis sechs Monate von der Lastganganalyse bis zur Inbetriebnahme. Den Takt geben Netzbetreiber, Förderfristen und Lieferzeiten vor – nicht die Montage."
          align="center"
          className="mb-14"
        />
        <Steps items={ABLAUF} />
        <Reveal className="mt-12 text-center">
          <Link href="/dienstleistungen/photovoltaik" className="group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
            Planung, Montage und Netzanschluss im Detail
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Section>

      {/* Kosten */}
      <Section tone="sand" space="lg" id="kosten">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow="Kosten"
            title="Was kostet eine Gewerbeanlage je kWp?"
            lead="Der Preis je kWp sinkt mit der Anlagengröße, weil Planung, Netzanschluss und Baustelleneinrichtung nur einmal anfallen. Die Tabelle zeigt Branchen-Richtwerte für schlüsselfertige Dachanlagen in Österreich – netto, ohne Speicher."
          />
          <Reveal delay={100}>
            <div tabIndex={0} role="region" aria-label="Richtwerte Kosten Gewerbeanlagen" className="overflow-x-auto rounded-3xl ring-1 ring-ink-200/70">
              <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
                <caption className="sr-only">Richtwerte für Photovoltaik-Gewerbeanlagen nach Anlagengröße, netto, Stand 2026</caption>
                <thead>
                  <tr className="bg-navy-950 text-white">
                    <th scope="col" className="px-5 py-4 font-semibold">Anlagengröße</th>
                    <th scope="col" className="px-5 py-4 font-semibold">€ je kWp netto</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Gesamt netto</th>
                    <th scope="col" className="px-5 py-4 font-semibold">Ertrag / Jahr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 bg-white">
                  {KOSTEN_GROESSEN.map((g) => (
                    <tr key={g}>
                      <th scope="row" className="whitespace-nowrap px-5 py-3.5 font-semibold text-ink-900">{g.toLocaleString("de-DE")} kWp</th>
                      <td className="ov-num px-5 py-3.5 text-ink-600">ca. {(Math.round(preisProKwpNetto(g) / 10) * 10).toLocaleString("de-DE")} €</td>
                      <td className="ov-num px-5 py-3.5 font-semibold text-ov-700">ca. {eur(g * preisProKwpNetto(g))}</td>
                      <td className="ov-num px-5 py-3.5 text-ink-600">ca. {(Math.round((g * ANNAHMEN.ertragProKwpSued) / 1000) * 1000).toLocaleString("de-DE")} kWh</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
              Richtwerte, keine Angebotspreise. Quellen: {PREISQUELLEN.slice(0, 2).map((q) => q.name).join("; ")} – fortgeschrieben auf 2026. Ertrag mit {ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh je kWp (PVGIS, vorsichtig gerundet); Ost-West-Belegung liefert je kWp weniger.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Rahmenbedingungen Österreich */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Rahmenbedingungen 2026"
          title="Förderung, Steuern und Einspeisung in Österreich"
          lead="Die Wirtschaftlichkeit einer Gewerbeanlage hängt vor allem am Eigenverbrauch: Jede selbst genutzte Kilowattstunde spart Energiepreis, Netzentgelte und Abgaben. Diese Rahmenbedingungen berücksichtigen wir in jeder Rechnung."
          className="mb-12"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RAHMEN.map((k, i) => {
            const Icon = k.icon;
            return (
              <Reveal key={k.titel} delay={i * 80}>
                <div className="ov-card-hover flex h-full flex-col rounded-3xl bg-sand-50 p-7 ring-1 ring-ink-200/70">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <p className="ov-num mt-6 font-display text-[32px] font-extrabold leading-none tracking-tight text-ink-900">{k.wert}</p>
                  <h3 className="mt-3 font-display text-[17px] font-bold text-ink-900">{k.titel}</h3>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-600">{k.text}</p>
                  <Link href={k.href} className="group mt-4 inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                    Mehr zu {k.titel}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-8 text-[14px] text-ink-500">Stand September 2026. Keine Steuer- oder Rechtsberatung – die steuerliche Gestaltung klären Sie mit Ihrer Steuerberatung.</p>
      </Section>

      {/* Zielgruppen */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Für wen wir bauen"
          title="Gewerbe, Landwirtschaft und öffentliche Hand zuerst"
          className="mb-12"
        />
        <FeatureGrid
          cols={4}
          items={[
            { icon: Warehouse, title: "Gewerbe & Industrie", text: "Hallen, Produktion, Logistik, Kühlhäuser – geplant nach Lastgang.", href: "/gewerbe" },
            { icon: Tractor, title: "Landwirtschaft", text: "Stall, Maschinenhalle, Agri-PV und Freifläche.", href: "/landwirtschaft" },
            { icon: Sun, title: "Hotellerie & Tourismus", text: "Hotels, Bergbahnen, Thermen mit hohem Tagverbrauch.", href: "/hotellerie-tourismus" },
            { icon: ShieldCheck, title: "Gemeinden & Länder", text: "Schulen, Bauhöfe, Kläranlagen und Energiegemeinschaften.", href: "/kommunen" },
          ]}
        />
      </Section>

      {/* Privat */}
      <Section tone="white" space="lg" id="privat">
        <SplitMedia
          eyebrow="Für Privat"
          title="Premium-Wohnhaus und Chalet"
          text={[
            "Auch für private Bauherren planen wir Photovoltaikanlagen – bevorzugt dort, wo Optik, Schneelast und Systemintegration besondere Sorgfalt verlangen: Premium-Wohnhäuser, Chalets und Landsitze.",
            "Speicher, Wallbox, Wärmepumpe und Energiemanagement werden dabei als ein System geplant. Den Aufbau zeigt der Anlagen-Explorer unten.",
          ]}
          action={{ label: "Luxus-Chalets & Alpin", href: "/chalets", variant: "navy" }}
          image={{ src: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg", alt: "Photovoltaikanlage auf einem Gebäude am Seeufer in Fuschl am See, Luftaufnahme" }}
          reverse
        />
        <div className="mt-20">
          <SectionHeading
            eyebrow="Systembausteine"
            title={
              <>
                Was gehört zu einer <span className="ov-text-gradient">Photovoltaikanlage?</span>
              </>
            }
            lead="Solarmodule, Unterkonstruktion und Wechselrichter bilden die Anlage. Stromspeicher, Wallbox, Wärmepumpe und Energiemanagement machen daraus ein System, das den Solarstrom möglichst selbst nutzt."
            align="center"
            className="mb-12"
          />
          <Reveal dir="scale">
            <AnlagenExplorer />
          </Reveal>
        </div>
      </Section>

      <SolarrechnerTeaser
        titel="Was bringt die Anlage an Ihrem Standort?"
        text="Anlagengröße, Verbrauch und Dach eingeben – Sie sehen eine erste Einschätzung zu Ertrag, Eigenverbrauch und Amortisation."
      />

      <Section tone="sand" space="lg">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Häufige Fragen"
              title="Photovoltaikanlage – fachlich beantwortet"
              lead="Ihre Frage ist nicht dabei? Rufen Sie uns an – wir beraten persönlich und herstellerunabhängig."
            />
            <Reveal delay={100} className="mt-8 flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white">
                <ClipboardCheck aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-[16px] font-bold text-ink-900">Direkt zum Projektgespräch</p>
                <a href={FIRMA.telefonHref} className="group mt-0.5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                  {FIRMA.telefon}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Ihre Dachfläche ist ein Kraftwerk. Wir rechnen es durch."
        text={`Persönliche Beratung von ${FIRMA.name} aus ${FIRMA.ort} für Betriebe in ganz Österreich – mit Lastganganalyse, ehrlicher Wirtschaftlichkeitsrechnung und festem Ansprechpartner bis zur Inbetriebnahme.`}
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
