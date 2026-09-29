import Link from "next/link";
import {
  Apple,
  BadgeEuro,
  ClipboardList,
  CloudHail,
  Cog,
  FileCheck2,
  HandCoins,
  Leaf,
  LineChart,
  MapPin,
  Tractor,
  Warehouse,
  Wheat,
  Sprout,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hinweis, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import KennzahlenBand from "@/components/Loesungen/A/KennzahlenBand";
import FotoBento from "@/components/Loesungen/A/FotoBento";
import AgriKonzepte from "@/components/Loesungen/A/AgriKonzepte";
import TechnikSystem from "@/components/Loesungen/A/TechnikSystem";
import AblaufLeiste from "@/components/Loesungen/A/AblaufLeiste";
import FachTabs from "@/components/Loesungen/A/FachTabs";
import RechnerLeiste from "@/components/Loesungen/A/RechnerLeiste";
import { nachweise } from "@/components/Loesungen/A/bildnachweise";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/agri-pv";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Agri-PV in Österreich: Konzepte & Förderung | Ökovolt";
const BESCHREIBUNG =
  "Agri-PV in Österreich: vertikal bifazial, hoch aufgeständert oder nachgeführt – für Obst, Wein, Beeren, Acker und Weide. 30 % EAG-Zuschlag, Widmung und Planung.";
const HERO_BILD = "/Images/AT/loesungen/agri-pv-vertikal-bifazial.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1920, height: 1080 }] },
};

const FAQ = [
  {
    q: "Was unterscheidet Agri-PV von einer normalen Freiflächenanlage?",
    a: "Bei Agri-PV bleibt die landwirtschaftliche Nutzung die Hauptnutzung, der Strom ist ein zusätzlicher Ertrag. Die Module stehen vertikal zwischen bewirtschafteten Streifen, hoch aufgeständert über der Kultur oder nachgeführt. Eine klassische Freiflächenanlage nutzt die Fläche dagegen vorrangig zur Stromerzeugung und wird in der EAG-Förderung auf Agrarflächen mit einem Abschlag von 25 % belegt.",
  },
  {
    q: "Welche Förderung gibt es für Agri-PV in Österreich?",
    a: "Agri-PV-Anlagen, die die Anforderungen nach § 6 Abs. 3 der EAG-Investitionszuschüsseverordnung erfüllen, gelten als innovative Anlagen: Sie erhalten einen Zuschlag von 30 % auf den Investitionszuschuss, und der Abschlag für landwirtschaftliche Flächen entfällt. Gefördert wird bis 1.000 kWp – größere Anlagen anteilig bis 1.000 kWp – oder alternativ über die Ausschreibungen für die Marktprämie.",
  },
  {
    q: "Welche technischen Voraussetzungen gelten für den Förderzuschlag?",
    a: "Die Module müssen vertikal montiert oder so aufgeständert sein, dass die Modultischunterkante mindestens 2 m über ebenem Boden liegt. Dazu kommen ein landwirtschaftliches Nutzungskonzept mit Nutzungsplan, Angaben zu Aufständerung und Flächenverlust sowie eine Verpflichtungserklärung zu Bearbeitbarkeit, Wasserverfügbarkeit und Bodenerosion. Laut klimaaktiv muss die landwirtschaftliche Nutzung mindestens 75 % der Fläche umfassen.",
  },
  {
    q: "Schützt Agri-PV Obstkulturen vor Hagel?",
    a: "Nicht zuverlässig. In der Agri-PV-Versuchsanlage des Landes Steiermark in Haidegg bot die Anlage in keinem der Schadensfälle ausreichenden Hagelschutz; die Bäume wurden deshalb zusätzlich mit Hagelnetzen gesichert. Gute Erfahrungen gibt es beim Schutz vor Starkregen, Sonnenbrand und teils Spätfrost. Wir planen Hagelnetze daher mit und nicht als Ersatz.",
  },
  {
    q: "Brauche ich für Agri-PV eine Umwidmung?",
    a: "Meistens ja, denn auch Agri-PV ist eine Stromerzeugungsanlage im Grünland. Die Regeln sind je Bundesland verschieden: In Oberösterreich etwa brauchen freistehende Anlagen über 50 m² Modulfläche eine Sonderausweisung im Flächenwidmungsplan, ausgenommen Anlagen für den landwirtschaftlichen Eigenbedarf. Wir klären das früh mit Gemeinde und Land.",
  },
  {
    q: "Welche Kulturen eignen sich unter oder zwischen den Modulen?",
    a: "Im Ackerbau haben sich in Wiener Versuchen Winterweizen, Wintergerste, Dinkel und Luzerne gut bewährt, Soja lag knapp darunter. Schattentolerante Sonderkulturen wie Beeren, Kernobst und Salate profitieren von Teilbeschattung und Witterungsschutz. Lichthungrige C4-Pflanzen wie Sorghum oder Mais verlieren dagegen stärker. Grünland und Weide sind besonders unkompliziert.",
  },
  {
    q: "Bekomme ich für die Fläche weiterhin Direktzahlungen?",
    a: "Das hängt von der Ausführung und den aktuellen GAP-Regeln ab. Entscheidend ist, dass die landwirtschaftliche Tätigkeit auf der Fläche nachweisbar erhalten bleibt und der Flächenverlust durch Aufbauten gering ist. Klären Sie die Beihilfefähigkeit vor Baubeginn verbindlich mit der AMA und Ihrer Landwirtschaftskammer – wir liefern dafür die Planunterlagen.",
  },
  {
    q: "Wer baut und betreibt die Agri-PV-Anlage?",
    a: "Sie können selbst investieren, die Fläche an einen Betreiber verpachten oder ein Beteiligungsmodell wählen. Ökovolt plant und errichtet die Anlage samt Netzanschluss und Regelungstechnik; über unsere Beteiligung an der ÖkoInvest GmbH kennen wir Agri-PV auch aus Betreibersicht. Den Betrieb übernehmen wir auf Wunsch mit Wartungsvertrag.",
  },
];

const KULTUREN = [
  { kultur: "Grünland & Weide", konzept: "Vertikal bifazial, Reihenabstand für Mähwerk bzw. Weidetiere", hinweis: "Robuste Pfosten und Kabelschutz bei Rindern; Schafe unkompliziert. Sehr einfache Bewirtschaftung." },
  { kultur: "Ackerbau (Getreide, Luzerne, Soja)", konzept: "Vertikal bifazial, Gassen passend zur Arbeitsbreite (z. B. 10 m)", hinweis: "In Wiener Versuchen Flächennutzungseffizienz 0,94 (Soja) bis 1,19 (Wintergerste). Randstreifen an den Pfosten bleiben unbewirtschaftet." },
  { kultur: "Kernobst (Apfel, Birne)", konzept: "Hoch aufgeständert, teiltransparente Module über den Baumreihen", hinweis: "Schutz vor Sonnenbrand und Starkregen; Hagelnetz zusätzlich einplanen. Durchfahrtshöhe für Obstbaumaschinen beachten." },
  { kultur: "Beeren & Steinobst", konzept: "Hoch aufgeständert als Überdachung, teils mit Seitenschutz", hinweis: "Kann Folientunnel teilweise ersetzen; Licht- und Wassermanagement (Regenwasser von den Modulen) gezielt planen." },
  { kultur: "Wein", konzept: "Hoch aufgeständert über den Zeilen oder vertikal in breiteren Zeilen", hinweis: "Wenig Praxiserfahrung in Österreich; Maschinenbefahrbarkeit und Mikroklima (Fäulnis, Reife) vorab mit Weinbauberatung prüfen." },
  { kultur: "Geflügel-Auslauf", konzept: "Aufgeständert oder vertikal als Deckung im Freilandauslauf", hinweis: "Module bieten Schatten und Schutz vor Greifvögeln; AMA-Leitfaden für Legehennenbetriebe mit Gütesiegel beachten." },
];

const BEISPIEL = [
  { pos: "Anlage und Jahresertrag", wert: "1.000 kWp vertikal bifazial Ost-West × 1.000 kWh/kWp", ergebnis: "1.000.000 kWh" },
  { pos: "Eigenverbrauch am Hof (20 %)", wert: "200.000 kWh × 14 ct (Energie, Netz, Abgaben)", ergebnis: "≈ 28.000 €/Jahr" },
  { pos: "Verkauf Überschuss (80 %)", wert: "800.000 kWh × 7 ct (Morgen-/Abendprofil, PPA oder Direktvermarktung)", ergebnis: "≈ 56.000 €/Jahr" },
  { pos: "Betrieb, Wartung, Versicherung", wert: "Annahme 15 €/kWp und Jahr", ergebnis: "− 15.000 €/Jahr" },
  { pos: "Jährlicher Überschuss (vor Steuern)", wert: "landwirtschaftlicher Ertrag nicht eingerechnet", ergebnis: "≈ 69.000 €/Jahr", hervorheben: true },
  { pos: "Investition", wert: "Annahme 750 €/kWp netto inkl. Netzanschluss", ergebnis: "750.000 €" },
  { pos: "EAG-Investitionszuschuss mit Agri-PV-Zuschlag", wert: "Annahme Zuschlag 100 €/kWp + 30 % = 130 €/kWp", ergebnis: "− 130.000 €" },
  { pos: "Statische Amortisation", wert: "620.000 € ÷ 69.000 €/Jahr", ergebnis: "≈ 9 Jahre", hervorheben: true },
];


const KONZEPTE = [
  {
    id: "vertikal",
    label: "Vertikal bifazial",
    kurz: "Beidseitig aktive Module in Ost-West-Ausrichtung, Reihenabstände für Mähwerk, Drillmaschine oder Weide. Erzeugt morgens und abends, wenn Strom oft mehr wert ist.",
    profil: "zwei Spitzen am Morgen und am Abend, Delle zu Mittag.",
    bild: { src: "/Images/AT/loesungen-a/agri-vertikal-getreide.jpg", alt: "Vertikale bifaziale Modulreihen in einem Getreidefeld" },
    werte: [
      { label: "Montage", wert: "vertikal, Ost-West – erfüllt das Technik-Kriterium der EAG-IZV" },
      { label: "Bewirtschaftung", wert: "Gassen passend zur Arbeitsbreite, z. B. 10 m" },
      { label: "Kulturen", wert: "Grünland & Weide, Getreide, Luzerne, Soja" },
      { label: "Praxis Wien", wert: "Flächennutzungseffizienz 0,94 (Soja) bis 1,19 (Wintergerste)" },
    ],
    hinweis: "Randstreifen an den Pfosten bleiben unbewirtschaftet; bei Rindern robuste Pfosten und Kabelschutz.",
  },
  {
    id: "hoch",
    label: "Hoch aufgeständert",
    kurz: "Modultische ab 2 m Unterkante über Obst, Beeren oder Wein – mit teiltransparenten Modulen, Regenwasserführung und Anschlagschutz für Maschinen.",
    profil: "klassische Mittagsspitze wie bei geneigten Modulen.",
    bild: { src: "/Images/AT/loesungen/agri-pv-obstbau.jpg", alt: "Hoch aufgeständerte Agri-PV-Module über einer Apfelanlage" },
    werte: [
      { label: "Montage", wert: "Modultischunterkante mindestens 2 m über ebenem Boden" },
      { label: "Bewirtschaftung", wert: "Durchfahrtshöhe für Obstbaumaschinen beachten" },
      { label: "Kulturen", wert: "Kernobst, Beeren & Steinobst, Wein" },
      { label: "Wirkung", wert: "Schutz vor Sonnenbrand und Starkregen – Hagelnetz zusätzlich" },
    ],
    hinweis: "Bei Beeren kann die Überdachung Folientunnel teilweise ersetzen; Licht- und Wassermanagement gezielt planen.",
  },
  {
    id: "tracker",
    label: "Nachgeführt",
    kurz: "Einachsig nachgeführte Reihen, die bei Bedarf auf Schatten oder Licht für die Kultur gestellt werden können – mehr Ertrag, mehr Technik.",
    profil: "breiter Verlauf über den Tag, weil die Module der Sonne folgen.",
    bild: { src: "/Images/AT/loesungen-a/agri-tracker-feld.jpg", alt: "Nachgeführte Photovoltaikanlage auf einer Wiese (Symbolbild)", position: "center 35%" },
    werte: [
      { label: "Montage", wert: "einachsig nachgeführt, Stellung steuerbar" },
      { label: "Bewirtschaftung", wert: "Schatten oder Licht je nach Bedarf der Kultur" },
      { label: "Förderung", wert: "Zuschlag nur bei Erfüllung von § 6 Abs. 3 EAG-IZV" },
      { label: "Aufwand", wert: "mehr Ertrag, mehr Technik und Wartung" },
    ],
    hinweis: "Nachgeführte Anlagen sind von den Mindestabständen (80 cm, 2 m Reihenabstand) des Investitionszuschusses ausgenommen.",
  },
];

export default async function AgriPvPage({ searchParams }) {
  const v = zielgruppenVariante("agripv", await searchParams);

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Agri-Photovoltaik in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Landwirtschaftliche Betriebe, Obst- und Weinbau, Grundeigentümer"
        bild={HERO_BILD}
        leistungen={["Agri-PV-Konzept und Nutzungsplan", "Vertikale bifaziale Agri-PV", "Hoch aufgeständerte Agri-PV für Sonderkulturen", "Förderantrag EAG mit Agri-PV-Zuschlag", "Netzanschluss und Parkregler", "Betrieb und Wartung"]}
      />

      <PageHero
        variant="immersive"
        className="pb-4 md:pb-6"
        breadcrumbs={[{ name: "Landwirtschaft", href: "/landwirtschaft" }, { name: "Agri-PV" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Luftbild einer Agri-PV-Anlage mit vertikalen bifazialen Modulreihen auf Grünland" }}
        actions={[
          { label: v.cta, href: "/termin?art=vor-ort&thema=freiflaeche" },
          { label: "Per Video beraten lassen", href: "/termin?art=video&thema=freiflaeche", icon: ClipboardList },
        ]}
        points={["30 % Förderzuschlag nach EAG-IZV", "Vertikal, hoch aufgeständert, nachgeführt", "Nutzungskonzept & Widmung", "Netzanschluss & Parkregler"]}
      />

      <KennzahlenBand
        items={[
          { wert: 30, vor: "+ ", nach: " %", label: "Zuschlag auf den EAG-Investitionszuschuss für innovative Agri-PV" },
          { wert: 2, nach: " m", label: "Mindesthöhe der Modultischunterkante – oder vertikale Montage" },
          { wert: 75, nach: " %", label: "der Fläche müssen landwirtschaftlich genutzt bleiben (klimaaktiv)" },
          { wert: 0, nach: " %", label: "Abschlag – der 25-%-Abschlag für Agrarflächen entfällt bei Agri-PV" },
        ]}
        quelle="Quellen: EAG-Investitionszuschüsseverordnung-Strom § 6 laut Leitfaden Land Oberösterreich 2026 und WKO; klimaaktiv, Agri-PV: Landwirtschaft trifft Energiewende."
      />

      <Section tone="white" space="md" id="kulturen-ueberblick">
        <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Kulturen in Österreich" title="Was unter und zwischen den Modulen wächst" />
          <p className="ov-lead text-ink-600">
            Ob Agri-PV funktioniert, hängt stark von Standort und Kultur ab. Für Grünland, Getreide und schattentolerante Sonderkulturen gibt es in
            Österreich inzwischen belastbare Erfahrungen.
          </p>
        </div>
        <FotoBento
          items={[
            { format: "gross", icon: Wheat, titel: "Ackerbau: Getreide, Luzerne, Soja", text: "Vertikal bifazial mit Gassen passend zur Arbeitsbreite – in Wiener Versuchen mit einer Flächennutzungseffizienz von 0,94 (Soja) bis 1,19 (Wintergerste).", bild: "/Images/AT/loesungen-a/agri-vertikal-getreide.jpg", alt: "Vertikale bifaziale Modulreihen in einem Getreidefeld" },
            { icon: Apple, titel: "Kernobst & Beeren", text: "Hoch aufgeständert, teiltransparent – Schutz vor Sonnenbrand und Starkregen.", bild: "/Images/AT/loesungen/agri-pv-obstbau.jpg", alt: "Hoch aufgeständerte Agri-PV-Module über einer Apfelanlage mit Hagelnetz" },
            { icon: Sprout, titel: "Grünland & Weide", text: "Schafe unkompliziert, bei Rindern robuste Pfosten und Kabelschutz.", bild: "/Images/AT/loesungen-a/ff-schafe-solarpark.jpg", alt: "Schafe weiden zwischen Photovoltaik-Modulreihen (Symbolbild)" },
            { format: "breit", icon: CloudHail, titel: "Hagel – ehrlich betrachtet", text: "Module sind kein Hagelnetz: Agri-PV mindert Schäden, ersetzt den Hagelschutz aber nicht.", bild: "/Images/AT/loesungen-a/agri-obst-hagelnetz.jpg", alt: "Apfelanlage mit gespannten Hagelnetzen", href: "#hagel" },
          ]}
        />
      </Section>

      <Section tone="sand" space="md" id="konzepte">
        <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Konzepte · interaktiv" title="Drei Bauweisen – die Kultur entscheidet" />
          <p className="text-[16.5px] leading-relaxed text-ink-600">
            Agri-PV ist kein Produkt, sondern eine Planungsaufgabe: Reihenabstand, Höhe, Modultyp und Ausrichtung folgen der Bewirtschaftung, nicht
            umgekehrt. Wählen Sie ein Konzept.
          </p>
        </div>
        <AgriKonzepte konzepte={KONZEPTE} link={{ label: "Fläche und Konzept besprechen", href: "/termin?art=vor-ort&thema=freiflaeche" }} />
      </Section>

      <Section tone="white" space="md" id="forschung">
        <SplitMedia
          eyebrow="Forschung & Praxis"
          title="Was österreichische Versuchsanlagen zeigen"
          text={[
            "Seit 2019 erforscht Wien Energie gemeinsam mit der Universität für Bodenkultur (BOKU) an der Schafflerhofstraße in Wien vertikale Agri-PV: sechs Modulreihen mit 10 m Abstand, dazwischen Ackerbau. Im Projektjahr 2022 lag die Flächennutzungseffizienz – Strom und Ernte zusammen im Vergleich zu getrennter Nutzung – zwischen 0,94 bei Soja und 1,19 bei Wintergerste; vier von fünf Kulturen erreichten Werte über 1.",
            "In der Versuchsstation Haidegg des Landes Steiermark stehen auf rund 2.800 m² teiltransparente Module über Apfel, Birne, Kirsche, Marille und weiteren Obstarten. Die Anlage schützt vor Starkregen, Sonnenbrand und Blütenfrost – vor Hagel jedoch nicht zuverlässig, weshalb zusätzlich Hagelnetze montiert wurden.",
          ]}
          image={{ src: "/Images/AT/loesungen-a/agri-hoch-acker-luftbild.jpg", alt: "Luftbild einer hoch aufgeständerten Agri-PV-Forschungsanlage über einem Getreidefeld (Deutschland)" }}
        />
      </Section>

      <TechnikSystem
        eyebrow="Technik"
        title="Netzanschluss und Regelung wie bei jedem Solarpark"
        lead="Agri-PV-Anlagen ab einigen hundert kWp speisen meist auf Netzebene 6 oder 5 ein und fallen ab 250 kW unter TOR Erzeuger Typ B. Parkregler, Fernwartung und Leitwarte kommen bei uns aus eigener Entwicklung."
        fakten={[
          { wert: "NE 6/5", label: "typische Netzebene" },
          { wert: "Typ B", label: "TOR Erzeuger ab 250 kW" },
          { wert: "+ 30 %", label: "Förderzuschlag Agri-PV" },
        ]}
        knoten={{
          erzeugung: { titel: "Agri-PV-Feld", text: "vertikal, hoch oder nachgeführt" },
          zusatz: { titel: "Hof & Speicher", text: "Eigenverbrauch, Kühlung, Bewässerung" },
          netz: { titel: "Netzbetreiber", text: "meist Netzebene 6 oder 5" },
          leitwarte: { titel: "SCADA-Leitwarte", text: "Ertrag, Wetter, Nachweise" },
        }}
        texte={{
          parkregler: "Setzt Blindleistung und Einspeiselimits des Netzbetreibers am Netzverknüpfungspunkt um – wichtig bei knapper Netzkapazität im ländlichen Raum.",
          fernwartung: "Störungen erkennen und beheben, ohne dass jemand über das Feld fahren muss – auch während Ernte und Weidezeit.",
          scada: "Stromertrag, Verfügbarkeit und Wetterdaten neben Ihren Bewirtschaftungsdaten – als Nachweis für Förderstelle und Betrieb.",
        }}
        bild={{ src: "/Images/AT/technik/leitwarte-netzbetrieb.jpg", alt: "" }}
      />

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Ablauf" title="Vom Feldbesuch zur Doppelernte" className="mb-12" />
        <AblaufLeiste
          items={[
            { icon: MapPin, title: "Feldbesuch", text: "Fläche, Kultur, Maschinenbreiten, Bodenverhältnisse und Netzanschluss aufnehmen – mit erster Einschätzung zu Konzept und Ertrag." },
            { icon: Tractor, title: "Nutzungskonzept", text: "Reihenabstand, Höhe und Modultyp nach Ihrer Bewirtschaftung – mit Nutzungsplan und Flächenverlust für die Förderstelle." },
            { icon: FileCheck2, title: "Widmung & Netz", text: "Gespräch mit Gemeinde und Land, Netzanfrage, naturschutzrechtliche Prüfung, Abstimmung mit AMA und Landwirtschaftskammer." },
            { icon: HandCoins, title: "Förderung & Finanzierung", text: "Antrag im Fördercall mit Agri-PV-Zuschlag oder Gebot für die Marktprämie; Eigeninvestition, Pacht oder Beteiligung." },
            { icon: Cog, title: "Bau im Rhythmus des Feldes", text: "Bauzeiten außerhalb von Aussaat und Ernte, Bodenschutz bei der Montage, Inbetriebnahme mit dem Netzbetreiber." },
            { icon: LineChart, title: "Betrieb & Monitoring", text: "Leitwarte, Wartung und Dokumentation der landwirtschaftlichen Nutzung über die gesamte Laufzeit." },
          ]}
        />
      </Section>

      <Section tone="sand" space="md" id="fachdetails">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Für Technik, Förderung & Betrieb" title="Kulturen, Förderkriterien, Hagel und Rechenweg" />
          <div className="flex lg:justify-end">
            <StandPille>Stand 09/2026</StandPille>
          </div>
        </div>
        <FachTabs
          tabs={[
            { id: "kulturen", label: "Kulturen" },
            { id: "foerderung", label: "Förderung & Normen" },
            { id: "hagel", label: "Hagelschutz" },
            { id: "wirtschaftlichkeit", label: "Beispielrechnung" },
          ]}
        >
          <div>
            <h3 className="ov-h3 text-ink-900">Eignung von Kulturen für Agri-PV</h3>
            <Tabelle
              className="mt-6"
              dicht
              caption="Eignung von Kulturen für Agri-PV in Österreich"
              spalten={[
                { key: "kultur", label: "Kultur", breite: "w-[22%]" },
                { key: "konzept", label: "Passendes Konzept", breite: "w-[30%]" },
                { key: "hinweis", label: "Praxis-Hinweis" },
              ]}
              zeilen={KULTUREN}
              fuss="Quellen: ÖKL, Zwischenbericht Forschungsprojekt Agriphotovoltaik Schafflerhofstraße (Wien Energie, BOKU), Projektjahr 2022; Land Steiermark, Versuchsstation Haidegg; AMA-Leitfaden Agri-PV bei Legehennenbetrieben laut klimaaktiv."
            />
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">30 % Zuschlag – wenn die Landwirtschaft nachweislich vorn bleibt.</h3>
            <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Österreich fördert Agri-PV über das Erneuerbaren-Ausbau-Gesetz (EAG) gezielt besser als Freiflächen auf Agrarland. Voraussetzung sind
              die Kriterien des § 6 Abs. 3 der EAG-Investitionszuschüsseverordnung-Strom.
            </p>
            <Prosa className="mt-6 grid gap-8 xl:grid-cols-2 xl:gap-12 [&>*+*]:mt-0">
              <ul>
                <li><strong>Zuschlag 30 %</strong> auf den Investitionszuschuss für innovative Agri-PV-Anlagen; der 25-%-Abschlag für landwirtschaftlich genutzte Flächen und Grünland entfällt.</li>
                <li><strong>Technik:</strong> vertikal montierte Module oder Modultischunterkante mindestens 2 m über ebenem Boden.</li>
                <li><strong>Nachweise:</strong> landwirtschaftliches Nutzungskonzept, Nutzungsplan mit der Hauptnutzung, Angaben zu Aufständerung und Flächenverlust, Verpflichtungserklärung zu Bearbeitbarkeit, Wasserverfügbarkeit und Bodenerosion.</li>
                <li><strong>Größe:</strong> Investitionszuschuss bis 1.000 kWp; 2026 in Kategorie D höchstens 120 €/kWp vor Zuschlag. Bei innovativen Anlagen ist der Zuschuss mit 65 % (kleine), 55 % (mittlere) bzw. 45 % (große Unternehmen) der förderfähigen Kosten gedeckelt.</li>
                <li><strong>Marktprämie:</strong> Anlagen über 10 kWp können alternativ an den EAG-Ausschreibungen teilnehmen; auch dort entfällt der Abschlag für bestimmte Agri-PV-Anlagen.</li>
                <li><strong>Fördercall:</strong> Der letzte Call 2026 läuft von 8. bis 22. Oktober; der Antrag ist vor der Inbetriebnahme und mit allen Genehmigungen in erster Instanz zu stellen.</li>
              </ul>
              <p>
                <strong>Normen:</strong> Maßgeblich für die Förderung sind die Kriterien der EAG-IZV, nicht eine Norm. Als technischer
                Planungsrahmen hat sich die deutsche DIN SPEC 91434 etabliert, die Kategorien, Flächenverlust und Nutzungskonzept beschreibt – wir
                nutzen sie ergänzend. Statik und Elektrotechnik planen wir nach ÖNORM B 1991-1-3 und B 1991-1-4 sowie ÖVE/ÖNORM E 8101. Der
                klimaaktiv-Leitfaden Agri-PV (2023) und der Leitfaden der FH OÖ für Widmungsverfahren sind gute Grundlagen für Gespräche mit
                Gemeinde und Land. Mehr im Ratgeber <Link href="/ratgeber/agri-pv-oesterreich">Agri-PV in Österreich</Link> und unter{" "}
                <Link href="/forderungen/bundesfoerderung">Bundesförderung (EAG & KPC)</Link>.
              </p>
            </Prosa>
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">Module sind kein Hagelnetz.</h3>
            <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Hagel ist in Österreich eines der größten Risiken für Obst- und Weinbau – und für PV-Anlagen. Agri-PV kann den Schaden an der Kultur
              mindern, ersetzt aber den Hagelschutz nicht.
            </p>
            <Prosa className="mt-6 grid gap-6 xl:grid-cols-2 xl:gap-10 [&>*+*]:mt-0">
              <p>
                <strong>Die Kultur:</strong> Zwischen den Modulreihen bleiben Spalten, durch die Hagel fällt; teiltransparente Module mit
                Abdeckungen verringern das nur. In Haidegg wurden deshalb Hagelnetze ergänzt. Wir planen die Unterkonstruktion so, dass Netze
                integriert oder nachgerüstet werden können.
              </p>
              <p>
                <strong>Die Module:</strong> Glas-Glas-Module mit höherer Hagelwiderstandsklasse, passende Neigung und eine Versicherung, die
                Hagel ausdrücklich einschließt, gehören zur Planung. Hintergründe im Ratgeber{" "}
                <Link href="/ratgeber/hagel-photovoltaik">Hagel und Photovoltaik</Link>; das Hagel- und Schneelastrisiko Ihres Standorts zeigt
                der <Link href="/standort-check">Standort-Check</Link>.
              </p>
            </Prosa>
            <Hinweis className="mt-8" titel="Unsere Empfehlung">
              Bei Obst und Wein: Agri-PV plus Hagelnetz plus Versicherung – und eine Kalkulation, die auch ein Hageljahr aushält.
            </Hinweis>
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">1 MWp vertikale Agri-PV auf Grünland mit Hofanschluss</h3>
            <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Ein Rechenbeispiel mit offengelegten Annahmen – kein Angebot. Der landwirtschaftliche Ertrag der Fläche bleibt zusätzlich erhalten.
            </p>
            <Tabelle
              className="mt-6"
              dicht
              caption="Beispielrechnung Agri-PV 1 MWp vertikal bifazial"
              spalten={[
                { key: "pos", label: "Position", breite: "w-[30%]" },
                { key: "wert", label: "Annahme / Rechnung" },
                { key: "ergebnis", label: "Ergebnis", breite: "w-[20%]", className: "font-semibold text-ink-900" },
              ]}
              zeilen={BEISPIEL}
              fuss="Beispiel, Stand 09/2026. Annahmen: spezifischer Ertrag 1.000 kWh/kWp (vertikal Ost-West, Richtwert), Hofverbrauch mit Netzebene 6/7, Verkaufspreis 7 ct/kWh, Investition 750 €/kWp (Marktannahme, kein Ökovolt-Preis), Förderzuschuss nur bei Zuschlag im Fördercall. Nicht enthalten: Steuern, Finanzierung, Degradation, Pacht, Änderungen bei Direktzahlungen."
            />
          </div>
        </FachTabs>
      </Section>

      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen vor der Agri-PV-Planung" />
            <p className="mt-10 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Weiter rechnen & vergleichen</p>
            <RechnerLeiste
              className="mt-4"
              kompakt
              mini
              spaltenKlasse="grid-cols-1 sm:grid-cols-2 lg:grid-cols-1"
              items={[
                { icon: BadgeEuro, titel: "Förder-Check", text: "", href: "/foerdercheck" },
                { icon: Leaf, titel: "CO₂- & ESG-Rechner", text: "", href: "/rechner/co2-esg" },
                { icon: Warehouse, titel: "Lieber Dächer: PV für die Landwirtschaft", text: "", href: "/landwirtschaft" },
                { icon: MapPin, titel: "Reiner Solarpark: Freiflächen-PV", text: "", href: "/freiflaechen-photovoltaik" },
              ]}
            />
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Förderung, Widmung und Technik" />

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Wir kommen aufs Feld – und sagen Ihnen ehrlich, was geht."
        text="Erstbewertung vor Ort oder per Video: Kultur, Konzept, Widmung, Netzanschluss und Förderung mit Agri-PV-Zuschlag."
        primary={{ label: v.cta, href: "/termin?art=vor-ort&thema=freiflaeche" }}
        secondary={{ label: "Anfrage starten", href: "/angebot?objekt=agri", icon: Cog }}
      />

      <Bildnachweis items={nachweise("aasen", "foulum", "kressbronn", "schafe", "hagelnetz", "heggelbach", "tracker", "leitwarte")} />
    </div>
  );
}
