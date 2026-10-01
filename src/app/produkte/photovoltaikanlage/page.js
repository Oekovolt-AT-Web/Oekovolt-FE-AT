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

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeEuro,
  Building2,
  CalendarCheck2,
  Calculator,
  Car,
  Check,
  ClipboardCheck,
  CloudHail,
  Cpu,
  FileCheck2,
  Gauge,
  Home,
  LayoutGrid,
  LineChart,
  Mountain,
  Receipt,
  ShieldCheck,
  Snowflake,
  Sun,
  Sunrise,
  Table2,
  Tractor,
  Warehouse,
  Wind,
  Zap,
} from "lucide-react";
import AnlagenExplorer from "@/components/photovoltaikanlage/AnlagenExplorer";
import GewerbePvMini from "@/components/photovoltaikanlage/GewerbePvMini";
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
import Umschalter from "@/components/Produktdetail/Umschalter";
import Kennzahlenband from "@/components/Produktdetail/Kennzahlenband";
import FotoBento from "@/components/Produktdetail/FotoBento";
import FachAkkordeon, { FachTabelle } from "@/components/Produktdetail/FachAkkordeon";
import HerstellerWortmarken from "@/components/Hersteller/HerstellerWortmarken";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";
import { regionenNachLand } from "@/lib/regionen";
import Querverweise from "@/components/Reusable/Querverweise";
import { ANNAHMEN, PREISQUELLEN, preisProKwpNetto } from "@/data/solarrechner";

const PFAD = "/produkte/photovoltaikanlage";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "Gewerbe-PV-Komponenten: Module & Wechselrichter | Ökovolt";
const DESCRIPTION =
  "Module, Unterkonstruktion, Wechselrichter und Parkregler, die wir in Gewerbe-PV-Anlagen in Österreich verbauen – ausgewählt nach Dach, Statik und TOR Erzeuger.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Photovoltaikanlage Gewerbe", "PV-Anlage Industrie", "Photovoltaik Österreich", "Hallendach Photovoltaik", "Freiflächenanlage", "Glas-Glas-Module"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
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
    a: "Wir ermitteln die charakteristische Schneelast des Standorts über die eHORA-Rasterkarte und legen Unterkonstruktion und Klemmbereiche danach aus. In schneereichen Lagen verwenden wir Module mit höherer geprüfter Last und Glas-Glas-Aufbau. Für Hagel achten wir auf die Hagelwiderstandsklasse der Module und beraten zur Versicherung. Den ersten Überblick liefert der Standort-Check.",
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

// Fotos zu den Montagesystemen (Symbolbilder aus public/Images)
const UK_BILDER = {
  "Hallendach mit Ballast": { bild: "/Images/Home/download-2.jpg", alt: "Aufgeständerte PV-Module mit Ballastschienen auf einem Flachdach", position: "50% 60%" },
  "Trapezblech & Sandwichpaneel": { bild: "/Images/AT/service/pv-wartung-techniker.jpg", alt: "Monteur trägt ein Solarmodul über ein Trapezblechdach" },
  "Ost-West-Aufständerung": { bild: "/Images/Jobs/renewable-energy-eco-technology-electric-power-fl-2025-01-29-12-30-39-utc.jpg", alt: "Luftaufnahme von Modulreihen auf einem Flachdach" },
  "Freifläche mit Rammprofil": { bild: "/Images/AT/loesungen/freiflaeche-solarpark-duernrohr.jpg", alt: "Photovoltaik-Freiflächenanlage in Niederösterreich, Luftbild" },
  "PV-Carport": { bild: "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg", alt: "Solar-Carports über einem Parkplatz, Luftbild" },
  "Schrägdach, Indach & alpin": { bild: "/Images/Home/download-1.jpg", alt: "Wohnhaus mit schwarzen Solarmodulen auf dem Satteldach" },
};

export default function PhotovoltaikanlagePage() {
  // PVGIS-Werte der Landeshauptstädte für den Mini-Rechner
  const standorte = regionenNachLand()
    .map((g) => g.hauptstadt)
    .filter(Boolean)
    .map((h) => ({ slug: h.slug, name: `${h.kurzname || h.name} (${h.pvgis.sued35_kwh_kwp.toLocaleString("de-DE")} kWh/kWp)`, sued35: h.pvgis.sued35_kwh_kwp, ostwest15: h.pvgis.ostwest15_kwh_kwp, flach10: h.pvgis.flach10_kwh_kwp }));

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
        variant="immersive"
        breadcrumbs={[{ name: "Produkte" }, { name: "Photovoltaikanlage" }]}
        eyebrow="Photovoltaikanlage · Gewerbe & Industrie"
        title={
          <>
            Komponenten für Ihre Gewerbe-PV: <span className="ov-text-gradient-light">Module, Unterkonstruktion, Wechselrichter</span>
          </>
        }
        lead={<><span className="block font-display text-[1.15em] font-bold leading-snug text-white">Photovoltaikanlagen für Betriebe in ganz Österreich</span><span className="mt-3 block">Eine Photovoltaikanlage für Gewerbe und Industrie ist ein Kraftwerk am eigenen Standort: geplant nach Ihrem Lastgang, statisch nachgewiesen für österreichische Schnee- und Windlasten und nach TOR Stromerzeugungsanlagen an das Netz angeschlossen. Wir liefern Planung, Errichtung und Netzanschluss aus einer Hand.</span></>}
        image={{ src: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", alt: "Luftaufnahme: Monteur zwischen Modulreihen auf einem großen Flachdach" }}
        points={["Seit 2012 in Österreich", "Hallendach, Freifläche, Carport", "Eigener Parkregler (EZA-Regler)", "Alle neun Bundesländer"]}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Hallendach berechnen", href: "#rechner", icon: Calculator },
        ]}
      />

      <HerstellerWortmarken />

      <Kennzahlenband
        items={[
          { wert: "2012", label: "in Österreich tätig – aus Ostermiething (OÖ)" },
          { value: 30, suffix: " MWp", label: "PV-Leistung errichtet allein im Jahr 2021" },
          { wert: "TOP 3", label: "der EPC-Errichter Österreichs 2021" },
          { value: 9, label: "Bundesländer – Planung, Bau und Betrieb" },
        ]}
      />

      {/* Montagesysteme als Foto-Karten */}
      <Section tone="white" space="lg" id="unterkonstruktion">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <SectionHeading
            eyebrow="Unterkonstruktion"
            title={
              <>
                Das richtige Montagesystem <span className="ov-text-gradient">für jede Fläche</span>
              </>
            }
            lead="Die Unterkonstruktion entscheidet über Statik, Dichtheit und Lebensdauer der Anlage. Wir wählen das System nach Dachaufbau, Tragwerksreserve und Standortlasten – nicht nach Lagerbestand."
          />
          <p className="text-[14px] leading-relaxed text-ink-500 lg:pb-1">Symbolbilder. Welche Lösung für Ihr Dach passt, klären Statik-Vorprüfung und Begehung.</p>
        </div>
        <FotoBento
          layout="reihe"
          items={UNTERKONSTRUKTIONEN.map((u) => ({ ...UK_BILDER[u.title], titel: u.title, text: u.text, href: u.href }))}

        />
      </Section>

      {/* Interaktiv */}
      <Section tone="sand" space="lg" id="rechner" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Selbst ausprobieren"
          title={
            <>
              Was bringt <span className="ov-text-gradient">Ihr Dach?</span>
            </>
          }
          lead="Für Betriebe rechnet der Hallendach-Rechner mit Standort, Dachart und Verbrauch; für Wohnhaus und Chalet zeigt der Anlagen-Explorer, wie Module, Speicher, Wallbox und Wärmepumpe zusammenspielen."
          align="center"
          className="mb-10"
        />
        <Umschalter
          label="Betrieb oder Wohnhaus"
          ansichten={[
            { id: "betrieb", label: "Betrieb: Hallendach-Rechner", icon: <Building2 />, inhalt: <GewerbePvMini standorte={standorte} /> },
            {
              id: "privat",
              label: "Wohnhaus & Chalet",
              icon: <Home />,
              inhalt: (
                <>
                  <p className="mx-auto mb-8 max-w-2xl text-center text-[16px] leading-relaxed text-ink-600">
                    Auch für private Bauherren planen wir Photovoltaikanlagen – bevorzugt dort, wo Optik, Schneelast und Systemintegration besondere Sorgfalt verlangen: Premium-Wohnhäuser, Chalets und
                    Landsitze.{" "}
                    <Link href="/chalets" className="font-semibold text-ov-700 hover:text-ov-800">
                      Luxus-Chalets &amp; Alpin
                    </Link>
                  </p>
                  <AnlagenExplorer />
                </>
              ),
            },
          ]}
        />
      </Section>

      {/* Module */}
      <Section tone="white" space="lg" id="module">
        <SplitMedia
          eyebrow="Solarmodule"
          title="Welche Module passen auf Gewerbedächer?"
          text={[
            "Für Gewerbe, Landwirtschaft und alpine Standorte sind Glas-Glas-Module mit n-Typ-Zellen heute der Standard. Welche Zelltechnologie am besten passt, entscheiden Dachfläche, Temperatur, Aufständerung und Ertragsziel.",
            "Datenblattwerte wie Wirkungsgrad, Temperaturkoeffizient und geprüfte Last vergleichen wir im Angebot je Modul.",
          ]}
          points={MODULE.slice(0, 4).map((m) => `${m.technik}: ${m.einsatz.split(",")[0].replace(/\.$/, "")}`)}
          action={{ label: "Unsere Hersteller im Überblick", href: "/produkte/hersteller", variant: "secondary" }}
          image={{ src: "/Images/AT/wissen/pv-modul-pruefung.jpg", alt: "Fachkraft prüft ein Solarmodul auf dem Dach" }}
        />
        <FachAkkordeon
          className="mt-12"
          items={[
            {
              id: "modultechnologien",
              icon: Table2,
              titel: "Für Technik & Einkauf: Modultechnologien im Vergleich",
              kurz: "Glas-Glas, bifazial, TOPCon, HJT, Back-Contact",
              inhalt: <FachTabelle caption="Modultechnologien für Photovoltaikanlagen im Vergleich" minBreite={720} kopf={["Technologie", "Was sie auszeichnet", "Typischer Einsatz"]} zeilen={MODULE.map((m) => [m.technik, m.kern, m.einsatz])} />,
            },
          ]}
        />
      </Section>

      {/* Schnee, Wind, Hagel */}
      <Section tone="sand" space="lg" id="schneelast">
        <SplitMedia
          reverse
          eyebrow="Schneelast, Wind & Hagel"
          title="Ausgelegt für österreichische Standorte"
          text={[
            "Die Schneelast in Österreich reicht vom Flachland bis in hochalpine Lagen über ein Vielfaches – maßgeblich ist die charakteristische Schneelast je Grundstück nach ÖNORM B 1991-1-3 (Rasterkarte in eHORA). Wind wird nach ÖNORM B 1991-1-4 angesetzt, bei Gebäudekanten und Randbereichen mit erhöhten Sogkräften.",
            "Wir ermitteln diese Werte für jede Adresse über die Naturgefahrenplattform eHORA und legen Unterkonstruktion, Klemmbereiche und Modulwahl darauf aus. Für Hagel berücksichtigen wir die Hagelwiderstandsklasse der Module.",
          ]}
          points={["Schneelast je Grundstück laut eHORA", "Wind- und Sogkräfte an Dachrand und Ecken", "Module mit geprüfter Last und Hagelwiderstand", "Schneefang und Abrutschschutz bei Schrägdächern"]}
          action={{ label: "Standort-Check starten", href: "/standort-check" }}
          image={{ src: "/Images/AT/ratgeber/schneelast-photovoltaik.jpg", alt: "Verschneite Photovoltaikanlage auf einem Hallendach" }}
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
                <div className="flex h-full items-start gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
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

      {/* Wechselrichter & Netzanschluss – dunkle Kontrast-Sektion */}
      <Section tone="navy" space="lg" id="wechselrichter" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Wechselrichter & Netzanschluss"
              title="Die richtige Topologie – und ein Regler, der mit dem Netz spricht"
              lead="Die Wechselrichter-Topologie folgt der Dachgeometrie, der Anlagengröße und dem Speicherkonzept. Am Netzanschlusspunkt gelten die TOR Stromerzeugungsanlagen: Anlagen ab 0,8 kW sind Typ A, ab 250 kW Typ B – mit Anforderungen an Blindleistung, Wirkleistungsbegrenzung und Fernsteuerbarkeit."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {WECHSELRICHTER.map((w, i) => (
                <Reveal as="li" key={w.topologie} delay={i * 70} className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
                  <p className="font-display text-[15.5px] font-bold text-white">{w.topologie}</p>
                  <p className="mt-1 text-[13px] leading-snug text-white/60">{w.typisch}</p>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal delay={100} dir="scale" className="flex">
            <article className="flex w-full flex-col overflow-hidden rounded-[2rem] bg-white/[0.06] ring-1 ring-white/15 backdrop-blur">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src="/Images/AT/ratgeber/eza-regler-parkregler.jpg" alt="Regelungstechnik unter den Modulreihen einer Photovoltaikanlage" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-ov-500 px-3.5 py-1.5 text-[12.5px] font-bold text-white shadow-lg">
                  <Cpu aria-hidden="true" className="h-4 w-4" />
                  Eigene Entwicklung
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <h3 className="font-display text-[24px] font-extrabold text-white">Parkregler (EZA-Regler)</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-white/75">
                  Unser EZA-Regler misst am Netzanschlusspunkt und regelt alle Wechselrichter gemeinsam: Einspeiselimit, Blindleistung nach Q(U) oder cos φ, Fernsteuerbefehle des Netzbetreibers.
                </p>
                <Link href="/technik/parkregler" className="group mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-[15px] font-semibold text-ov-300 hover:text-ov-200">
                  Parkregler im Detail
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
        <FachAkkordeon
          dunkel
          className="relative mt-12"
          items={[
            {
              id: "wechselrichter-topologien",
              icon: Table2,
              titel: "Für Technik & Einkauf: Wechselrichter-Topologien und TOR-Typen",
              kurz: "Stärken, typischer Einsatz, Grenzen Typ A/B",
              inhalt: (
                <>
                  <FachTabelle caption="Wechselrichter-Topologien für Photovoltaikanlagen" minBreite={560} kopf={["Topologie", "Stärke", "Typisch für"]} zeilen={WECHSELRICHTER.map((w) => [w.topologie, w.staerke, w.typisch])} />
                  <p className="mt-3 text-[13px] text-white/55">Typ A: ≥ 0,8 kW bis &lt; 250 kW · Typ B: ≥ 250 kW bis &lt; 35 MW (TOR Stromerzeugungsanlagen, E-Control).</p>
                </>
              ),
            },
          ]}
        />
      </Section>

      {/* Komplettpaket & Ablauf */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Projektablauf"
          title="In vier Etappen zur Anlage am Netz"
          lead="Bei Dachanlagen bis rund 250 kWp vergehen meist drei bis sechs Monate von der Lastganganalyse bis zur Inbetriebnahme. Den Takt geben Netzbetreiber, Förderfristen und Lieferzeiten vor – nicht die Montage."
          align="center"
          className="mb-14"
        />
        <Steps items={ABLAUF} />
        <Reveal className="mt-14">
          <div className="grid gap-8 rounded-[2rem] bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Komplettpaket</p>
              <h3 className="ov-h3 mt-3 text-ink-900">Von der Lastganganalyse bis zur Fertigstellungsmeldung</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600">Ein Ansprechpartner, ein Angebot, ein Team – mit eigenem Elektrotechnik-Gewerbe.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button href="/angebot" pfeil>
                  Komplettangebot anfordern
                </Button>
                <Button href="/dienstleistungen/photovoltaik" variant="secondary">
                  Leistungen im Detail
                </Button>
              </div>
            </div>
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {PAKET.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] leading-snug text-ink-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-500 text-white">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* Rahmenbedingungen & Kosten */}
      <Section tone="sand" space="lg" id="kosten">
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
                <div className="ov-card-hover flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-ink-200/70">
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
        <FachAkkordeon
          className="mt-8"
          items={[
            {
              id: "kosten-tabelle",
              icon: BadgeEuro,
              titel: "Für Technik & Einkauf: Was kostet eine Gewerbeanlage je kWp?",
              kurz: "Branchen-Richtwerte netto, 30 bis 1.000 kWp",
              inhalt: (
                <>
                  <p className="mb-4 max-w-3xl text-[15px] leading-relaxed text-ink-600">
                    Der Preis je kWp sinkt mit der Anlagengröße, weil Planung, Netzanschluss und Baustelleneinrichtung nur einmal anfallen. Die Tabelle zeigt Branchen-Richtwerte für schlüsselfertige Dachanlagen in
                    Österreich – netto, ohne Speicher.
                  </p>
                  <FachTabelle
                    caption="Richtwerte für Photovoltaik-Gewerbeanlagen nach Anlagengröße, netto, Stand 2026"
                    minBreite={560}
                    kopf={["Anlagengröße", "€ je kWp netto", "Gesamt netto", "Ertrag / Jahr"]}
                    zeilen={KOSTEN_GROESSEN.map((g) => [
                      `${g.toLocaleString("de-DE")} kWp`,
                      `ca. ${(Math.round(preisProKwpNetto(g) / 10) * 10).toLocaleString("de-DE")} €`,
                      `ca. ${eur(g * preisProKwpNetto(g))}`,
                      `ca. ${(Math.round((g * ANNAHMEN.ertragProKwpSued) / 1000) * 1000).toLocaleString("de-DE")} kWh`,
                    ])}
                  />
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
                    Richtwerte, keine Angebotspreise. Quellen: {PREISQUELLEN.slice(0, 2).map((q) => q.name).join("; ")} – fortgeschrieben auf 2026. Ertrag mit {ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh je kWp (PVGIS,
                    vorsichtig gerundet); Ost-West-Belegung liefert je kWp weniger.
                  </p>
                </>
              ),
            },
          ]}
        />
        <p className="mt-6 text-[14px] text-ink-500">Stand September 2026. Keine Steuer- oder Rechtsberatung – die steuerliche Gestaltung klären Sie mit Ihrer Steuerberatung.</p>
      </Section>

      {/* Zielgruppen */}
      <Section tone="white" space="md">
        <SectionHeading eyebrow="Für wen wir bauen" title="Gewerbe, Landwirtschaft und öffentliche Hand zuerst" className="mb-10" />
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
        secondary={{ label: "Beratungstermin buchen", href: "/termin", icon: CalendarCheck2 }}
      />
    </div>
  );
}
