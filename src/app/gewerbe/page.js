import Link from "next/link";
import {
  BatteryCharging,
  Calculator,
  Car,
  ClipboardList,
  Cog,
  Factory,
  FileSpreadsheet,
  Gauge,
  HandCoins,
  Leaf,
  LineChart,
  Receipt,
  TrendingUp,
  Users,
  Warehouse,
  Wrench,
  Zap,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hebel, Hinweis, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import { nachweise } from "@/components/Loesungen/A/bildnachweise";
import KennzahlenBand from "@/components/Loesungen/A/KennzahlenBand";
import FotoBento from "@/components/Loesungen/A/FotoBento";
import FotoKennzahl from "@/components/Loesungen/A/FotoKennzahl";
import LastprofilExplorer from "@/components/Loesungen/A/LastprofilExplorer";
import TechnikSystem from "@/components/Loesungen/A/TechnikSystem";
import FachTabs from "@/components/Loesungen/A/FachTabs";
import RechnerLeiste from "@/components/Loesungen/A/RechnerLeiste";
import AblaufLeiste from "@/components/Loesungen/A/AblaufLeiste";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/gewerbe";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für Gewerbe & Industrie in Österreich | Ökovolt";
const BESCHREIBUNG =
  "PV für Hallen, Produktion, Logistik und Handel in Österreich: Auslegung nach Lastgang, Netzebene 7 bis 5, IFB 22 %, EAG-Zuschuss, Speicher und Wartung.";
const HERO_BILD = "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
};

const FAQ = [
  {
    q: "Lohnt sich Photovoltaik für einen Gewerbebetrieb in Österreich?",
    a: "Für die meisten Betriebe mit Tagverbrauch ja. Jede selbst genutzte Kilowattstunde spart nicht nur den Energiepreis, sondern auch Netznutzungs- und Netzverlustentgelt sowie die Elektrizitätsabgabe, denn selbst erzeugter und verbrauchter Solarstrom ist davon befreit. In unserer Beispielrechnung für 300 kWp auf Netzebene 6 liegt die statische Amortisation bei rund sechs Jahren – entscheidend ist aber Ihr eigener Lastgang.",
  },
  {
    q: "Welche Unterlagen brauchen Sie für ein belastbares Angebot?",
    a: "Ideal ist der Lastgang der letzten zwölf Monate in Viertelstundenwerten. Betriebe mit Leistungsmessung erhalten ihn beim Netzbetreiber, meist über dessen Kundenportal. Dazu kommen Netzrechnungen (Netzebene, gemessene Leistung), Dachpläne, Statikunterlagen und Betriebszeiten. Ohne Lastgang reichen für eine erste Einschätzung Jahresverbrauch und Rechnungen.",
  },
  {
    q: "Wie wird die PV-Anlage steuerlich behandelt?",
    a: "Die Anlage ist ein abnutzbares Wirtschaftsgut und wird über die Nutzungsdauer abgeschrieben, linear oder degressiv. Für Anschaffungen bis 31. Dezember 2026 beträgt der ökologische Investitionsfreibetrag befristet 22 % (danach 15 %), bei einer Bemessungsgrundlage von höchstens 1 Mio. Euro je Wirtschaftsjahr und einer Behaltedauer von vier Jahren. Die konkrete Gestaltung klären Sie mit Ihrer Steuerberatung.",
  },
  {
    q: "Senkt eine PV-Anlage den Leistungspreis?",
    a: "Teilweise. In Österreich wird bei gemessener Leistung der Mittelwert der zwölf höchsten Monats-Viertelstunden verrechnet. Liegen Ihre Spitzen im Sommer zur Mittagszeit, drückt die PV-Anlage diese Monatswerte. Winterspitzen und Schichtbeginn am frühen Morgen fängt dagegen nur ein Speicher mit Lastmanagement ab – das rechnen wir getrennt aus.",
  },
  {
    q: "Brauchen wir für die PV-Anlage eine gewerberechtliche Genehmigung?",
    a: "Im Regelfall nicht. Nach der bundesweiten Festlegung des Wirtschaftsministeriums (Erlass vom 1. März 2021) sind PV-Anlagen als Teil einer gewerblichen Betriebsanlage meist nicht genehmigungspflichtig, solange keine Sonderfälle wie Fluchtwege, Ex-Bereiche oder Blendung vorliegen. Elektrizitätsrecht und Bauordnung des Bundeslands sowie der Netzzugang beim Netzbetreiber sind trotzdem zu beachten.",
  },
  {
    q: "Was passiert mit dem Überschuss?",
    a: "Überschüsse speisen Sie ins Netz ein und verkaufen sie – an die OeMAG zum Marktpreis, an einen Stromhändler oder über Direktvermarktung und PPA. Alternativ können Sie Strom über eine Energiegemeinschaft an Mitarbeitende, Nachbarbetriebe oder die Gemeinde weitergeben. Welche Variante sich rechnet, hängt von Menge, Einspeiseprofil und Vertragslaufzeit ab.",
  },
  {
    q: "Gibt es 2026 noch eine Förderung für gewerbliche PV-Anlagen?",
    a: "Ja. Der EAG-Investitionszuschuss für Anlagen über 100 kWp (Kategorie D) liegt 2026 bei höchstens 120 € je kWp, für 20 bis 100 kWp (Kategorie C) bei höchstens 130 € je kWp; die Anträge werden nach dem angegebenen Förderbedarf gereiht. Der letzte Fördercall 2026 läuft von 8. bis 22. Oktober. Der Antrag muss vor der Inbetriebnahme gestellt werden, erforderliche Genehmigungen müssen dann bereits vorliegen.",
  },
  {
    q: "Wir sind Mieter der Halle – geht das trotzdem?",
    a: "Ja, mit einer Dachnutzungsvereinbarung des Eigentümers, die zur Laufzeit der Anlage passt, samt Regelungen zu Dachsanierung, Rückbau und Versicherung. Alternativ investiert der Eigentümer und liefert Ihnen den Strom, etwa über eine gemeinschaftliche Erzeugungsanlage. Wir stimmen das Modell mit beiden Seiten ab.",
  },
];

const NETZENTGELTE = [
  { ne: "Netzebene 5 (Mittelspannung)", ooe: "57,72 €/kW · 1,29 ct/kWh", sbg: "64,20 €/kW · 1,68 ct/kWh", wien: "55,32 €/kW · 1,31 ct/kWh" },
  { ne: "Netzebene 6 (Umspannung MS/NS)", ooe: "65,88 €/kW · 2,37 ct/kWh", sbg: "66,60 €/kW · 2,86 ct/kWh", wien: "59,52 €/kW · 1,93 ct/kWh" },
  { ne: "Netzebene 7 (Niederspannung, gemessen)", ooe: "52,56 €/kW · 4,68 ct/kWh", sbg: "71,64 €/kW · 3,91 ct/kWh", wien: "82,92 €/kW · 4,21 ct/kWh" },
];

const BEISPIEL = [
  { pos: "Anlage und Jahresertrag", wert: "300 kWp × 1.050 kWh/kWp", ergebnis: "315.000 kWh" },
  { pos: "Eigenverbrauch (70 %)", wert: "Produktion im Zweischichtbetrieb", ergebnis: "220.500 kWh" },
  { pos: "Vermiedene Kosten je kWh", wert: "Energie 11,00 + Netznutzung 2,37 + Netzverlust 0,454 + Elektrizitätsabgabe 0,82 ct", ergebnis: "14,64 ct/kWh" },
  { pos: "Ersparnis Eigenverbrauch", wert: "220.500 kWh × 14,64 ct", ergebnis: "≈ 32.290 €/Jahr" },
  { pos: "Erlös Überschuss (30 %)", wert: "94.500 kWh × 6,0 ct", ergebnis: "≈ 5.670 €/Jahr" },
  { pos: "Betrieb, Wartung, Versicherung", wert: "1,5 % der Investition", ergebnis: "− 3.600 €/Jahr" },
  { pos: "Jährlicher Überschuss", wert: "vor Steuern, ohne Leistungspreiseffekt", ergebnis: "≈ 34.360 €/Jahr", hervorheben: true },
  { pos: "Investition", wert: "Annahme 800 €/kWp netto", ergebnis: "240.000 €" },
  { pos: "EAG-Investitionszuschuss", wert: "Annahme: Zuschlag bei 100 €/kWp (Kategorie D)", ergebnis: "− 30.000 €" },
  { pos: "Statische Amortisation", wert: "210.000 € ÷ 34.360 €/Jahr", ergebnis: "≈ 6,1 Jahre", hervorheben: true },
  { pos: "Öko-IFB 22 % (Anschaffung bis 31.12.2026)", wert: "Freibetrag auf 210.000 €, Körperschaftsteuer 23 %", ergebnis: "≈ 10.600 € Steuerwirkung" },
];

const NETZEBENEN = [
  { ne: "Netzebene 7", ort: "Niederspannung 400 V, Hausanschluss oder eigener Anschlusskasten", groesse: "bis etwa 100–250 kWp, je nach Netzsituation", tor: "Typ A (bis < 250 kW)" },
  { ne: "Netzebene 6", ort: "Anschluss an der Trafostation des Netzbetreibers (Niederspannungsseite)", groesse: "etwa 150 kWp bis 1 MWp", tor: "Typ A oder B" },
  { ne: "Netzebene 5", ort: "Mittelspannung, meist kundeneigene Trafostation mit Mittelspannungsschaltanlage", groesse: "etwa 0,5 bis 10 MWp", tor: "Typ B (250 kW bis < 35 MW)" },
];


// Typisierte Beispielprofile (relativ, Stundenwerte) – Veranschaulichung, keine Messwerte.
const BRANCHEN = [
  {
    id: "produktion",
    label: "Produktion",
    icon: "Factory",
    titel: "Produktion im Zweischichtbetrieb",
    last: [0.3, 0.28, 0.28, 0.28, 0.3, 0.45, 0.85, 0.95, 0.98, 1, 0.98, 0.92, 0.95, 1, 0.98, 0.95, 0.92, 0.9, 0.88, 0.85, 0.8, 0.7, 0.45, 0.32],
    pvFaktor: 0.6,
    text: "Hohe Tages-Grundlast aus Druckluft, Lüftung, Absaugung und Maschinen – oft 60–90 % Eigenverbrauch möglich.",
    punkte: ["Spitzen beim Anfahren von Pressen, Öfen und Kompressoren", "Frühe Schicht- und Winterspitzen fängt nur ein Speicher ab"],
    link: { label: "Gewerbe-PV-Rechner", href: "/rechner/gewerbe-pv" },
  },
  {
    id: "logistik",
    label: "Logistik & Lager",
    icon: "Warehouse",
    titel: "Logistik, Lager & Hallen",
    last: [0.2, 0.2, 0.2, 0.2, 0.22, 0.3, 0.45, 0.55, 0.55, 0.55, 0.55, 0.5, 0.52, 0.55, 0.55, 0.52, 0.48, 0.4, 0.32, 0.28, 0.25, 0.22, 0.2, 0.2],
    pvFaktor: 1.6,
    text: "Große Dächer, eher geringe Last: Der Überschuss ist hoch – Vermarktung, Energiegemeinschaft und Ladeinfrastruktur werden wichtig.",
    punkte: ["Flurförderzeuge und E-Transporter mittags laden", "Überschuss an OeMAG, Händler oder PPA"],
    link: { label: "E-Flotten-Rechner", href: "/rechner/e-flotte" },
  },
  {
    id: "kuehlung",
    label: "Handel & Kühlung",
    icon: "Snowflake",
    titel: "Lebensmittelhandel & Kühlhäuser",
    last: [0.5, 0.48, 0.47, 0.47, 0.48, 0.55, 0.7, 0.82, 0.88, 0.92, 0.95, 0.98, 1, 1, 1, 0.98, 0.95, 0.92, 0.88, 0.8, 0.65, 0.55, 0.52, 0.5],
    lastSaison: {
      uebergang: [0.45, 0.43, 0.42, 0.42, 0.43, 0.5, 0.64, 0.75, 0.8, 0.83, 0.85, 0.87, 0.88, 0.88, 0.88, 0.86, 0.84, 0.82, 0.8, 0.72, 0.58, 0.5, 0.47, 0.45],
      winter: [0.42, 0.4, 0.4, 0.4, 0.41, 0.48, 0.62, 0.72, 0.76, 0.78, 0.79, 0.8, 0.8, 0.8, 0.8, 0.79, 0.8, 0.82, 0.8, 0.7, 0.55, 0.47, 0.44, 0.42],
    },
    pvFaktor: 0.5,
    text: "Kälte, Beleuchtung und Backstationen laufen tagsüber und im Sommer auf Hochlast – sehr hohe Gleichzeitigkeit mit der Solarkurve.",
    punkte: ["Kälteanlagen auf Hochlast, wenn die Sonne am stärksten scheint", "Kältespeicher verschiebt zusätzlichen Eigenverbrauch"],
    link: { label: "Peak-Shaving-Rechner", href: "/rechner/peak-shaving" },
  },
  {
    id: "handwerk",
    label: "Handwerk & KMU",
    icon: "Wrench",
    titel: "Handwerk & kleine Betriebe",
    last: [0.1, 0.1, 0.1, 0.1, 0.1, 0.12, 0.35, 0.8, 0.9, 0.95, 0.92, 0.7, 0.65, 0.9, 0.92, 0.85, 0.6, 0.3, 0.18, 0.15, 0.12, 0.1, 0.1, 0.1],
    pvFaktor: 0.9,
    text: "Werkstatt, Büro und Fuhrpark – kleiner, aber mit hohem Eigenverbrauch, oft auf Netzebene 7.",
    punkte: ["Mittagspause und Wochenende erzeugen Überschuss", "Speicher oder E-Fuhrpark heben den Eigenverbrauch"],
    link: { label: "Gewerbe-PV-Rechner", href: "/rechner/gewerbe-pv" },
  },
];

export default async function GewerbePage({ searchParams }) {
  const v = zielgruppenVariante("gewerbe", await searchParams);

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Photovoltaik für Gewerbe und Industrie in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Gewerbe, Industrie, Handel, Logistik"
        bild={HERO_BILD}
        leistungen={["Lastganganalyse und Anlagenauslegung", "PV-Anlagen auf Hallen- und Flachdächern", "Netzanschluss Netzebene 7 bis 5 inkl. Parkregler", "Gewerbespeicher und Peak Shaving", "Ladeinfrastruktur", "Wartung und Reststromvermarktung"]}
      />

      <PageHero
        variant="immersive"
        className="pb-4 md:pb-6"
        breadcrumbs={[{ name: "Gewerbe & Industrie" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Luftaufnahme eines Gewerbegebäudes mit Photovoltaikanlagen auf den Flachdächern" }}
        actions={[
          { label: v.cta, href: "/termin?art=video&thema=gewerbe" },
          { label: "Anfrage mit Lastgang", href: "/angebot?objekt=gewerbe", icon: FileSpreadsheet },
        ]}
        points={["Auslegung nach Viertelstundenwerten", "Netzebene 7 bis 5 inkl. Parkregler", "Förderung, IFB & Netzzugang geklärt", "Wartung & Vermarktung aus einer Hand"]}
      />

      <KennzahlenBand
        items={[
          { wert: 22, nach: " %", label: "Öko-Investitionsfreibetrag für PV, Speicher & Ladestationen (Anschaffung bis 31.12.2026)" },
          { wert: 120, nach: " €/kWp", label: "höchstzulässiger EAG-Investitionszuschuss 2026, Kategorie D (100–1.000 kWp)" },
          { wert: 0, nach: " ct", label: "Elektrizitätsabgabe auf selbst erzeugten und verbrauchten Solarstrom" },
          { wert: 12, label: "Monatsspitzen bilden den Leistungspreis bei gemessener Leistung" },
        ]}
        quelle="Quellen: WKO (Investitionsfreibetrag), EAG-Investitionszuschüsseverordnung-Strom 2026 laut Leitfaden Land Oberösterreich (Stand 06/2026), § 2 Elektrizitätsabgabegesetz, § 52 ElWOG 2010 / SNE-V 2018."
      />

      <Section tone="white" space="md">
        <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Lösungen" title="Photovoltaik, die in den Betrieb passt – nicht nur aufs Dach" />
          <p className="ov-lead text-ink-600">
            Gewerbliche Photovoltaik in Österreich ist ein Energieprojekt: Anlage, Netzanschluss, Speicher, Ladepunkte und Vermarktung müssen zum
            Lastgang passen. Diese Bausteine planen und bauen wir aus einer Hand.
          </p>
        </div>
        <FotoBento
          items={[
            { format: "gross", icon: Warehouse, titel: "Hallen- & Flachdächer", text: "Aufgeständert Ost-West oder Süd, ballastiert oder mechanisch befestigt – nach Statik, Schneelast, Dachhaut und Brandabschnitten.", bild: "/Images/AT/ratgeber/photovoltaik-flachdach.jpg", position: "center 70%", alt: "Photovoltaikanlage auf dem Flachdach einer Gewerbehalle in Dornbirn mit Bergpanorama" },
            { icon: Factory, titel: "Produktion & Kühlung", text: "Grundlast aus Druckluft, Lüftung und Kälte deckt sich gut mit der Solarkurve.", bild: "/Images/Home/download-2.jpg", alt: "Aufgeständerte Photovoltaikmodule mit Ballastierung auf einem Flachdach" },
            { icon: BatteryCharging, titel: "Gewerbespeicher & Peak Shaving", text: "Lastspitzen kappen, Überschüsse in Abend- und Nachtstunden verschieben.", bild: "/Images/AT/loesungen/gewerbespeicher-batteriecontainer.jpg", alt: "Batteriespeicher-Container an einem Kraftwerksstandort in Niederösterreich", href: "/gewerbespeicher" },
            { icon: Car, titel: "E-Flotte & Ladeinfrastruktur", text: "Flotte mit Solarstrom laden – mit Lastmanagement passend zum Anschluss.", bild: "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg", alt: "Solar-Carports mit Ladepunkten auf einem Parkplatz, Luftbild (Symbolbild)", href: "/ladeinfrastruktur" },
            { icon: TrendingUp, titel: "Reststromvermarktung", text: "OeMAG-Marktpreis, Stromhändler, Direktvermarktung, PPA oder Energiegemeinschaft.", bild: "/Images/AT/ratgeber/hochspannungsleitung-weitendorf.jpg", alt: "Hochspannungsleitung über einem Feld in der Steiermark", href: "/service/direktvermarktung" },
          ]}
        />
      </Section>

      <Section tone="sand" space="md" id="branchen">
        <LastprofilExplorer
          ueberschrift="h2"
          eyebrow="Branchen · interaktiv"
          titel="Jede Branche hat ihren eigenen Lastgang"
          lead="Die richtige Anlagengröße ergibt sich nicht aus der Dachfläche, sondern aus der Deckung von Solarkurve und Verbrauch. Deshalb werten wir zuerst Ihre Viertelstundenwerte aus: Grundlast am Wochenende, Anlaufspitzen bei Schichtbeginn, Sommer- und Winterprofil."
          profile={BRANCHEN}
        />
      </Section>

      <Section tone="white" space="md" id="wirtschaftlichkeit-kurz">
        <SplitMedia
          reverse
          eyebrow="Wirtschaftlichkeit in Österreich"
          title="Jede selbst genutzte kWh spart mehr als den Energiepreis."
          text="Eine gewerbliche PV-Anlage rechnet sich in Österreich über fünf Hebel – der Überschusserlös ist nur der sechste:"
          points={[
            { title: "Energiepreis", text: "aus Ihrem Liefervertrag entfällt für jede selbst genutzte kWh." },
            { title: "Netzentgelte", text: "Netznutzungs- und Netzverlustentgelt fallen für Eigenverbrauch nicht an." },
            { title: "Elektrizitätsabgabe", text: "Eigenverbrauch aus Erneuerbaren ist nach § 2 ElAbgG befreit." },
            { title: "Leistungspreis", text: "Mittagsspitzen im Sommer sinken – jeder Monat zählt." },
            { title: "Steuer", text: "Öko-IFB 22 % bis Ende 2026, dazu lineare oder degressive AfA." },
          ]}
          aside={
            <FotoKennzahl
              seite="links"
              bild={{ src: "/Images/Referenzen/referenzkarte1.jpg", alt: "Techniker prüft eine Photovoltaikanlage auf einem Gewerbedach" }}
              titel="Beispiel · 300 kWp · Netzebene 6 · OÖ"
              werte={[
                { wert: "≈ 6,1 J.", label: "statische Amortisation" },
                { wert: "≈ 34.360 €", label: "Überschuss pro Jahr" },
                { wert: "14,64 ct", label: "vermiedene Kosten je kWh" },
              ]}
              fuss="Annahmen und Rechenweg unter „Für Technik & Einkauf“ – kein Angebot."
            />
          }
          action={{ label: "Eigene Zahlen rechnen", href: "/rechner/gewerbe-pv" }}
        />
      </Section>

      <TechnikSystem
        id="technik"
        eyebrow="Netzanschluss & Technik"
        title="Netzebene 7, 6 oder 5 – der Anschluss bestimmt die Technik."
        lead="Auf welcher Netzebene Ihre Anlage einspeist, legt der Netzbetreiber nach einer Netzverträglichkeitsprüfung fest. Davon hängen Trafostation, Schutztechnik, Regler und Kosten ab – ab Typ B übernimmt am Netzverknüpfungspunkt ein Parkregler."
        fakten={[
          { wert: "NE 7–5", label: "Niederspannung bis Mittelspannung" },
          { wert: "Typ A/B", label: "TOR Erzeuger, ab 250 kW Typ B" },
          { wert: "R 11-1", label: "OVE-Richtlinie Brandschutz" },
        ]}
        knoten={{
          erzeugung: { titel: "PV-Hallendach", text: "Module, Strings, Wechselrichter" },
          zusatz: { titel: "Speicher & Ladepunkte", text: "Peak Shaving, E-Flotte, Betrieb" },
          netz: { titel: "Netzbetreiber", text: "Netzebene 7, 6 oder 5" },
        }}
        texte={{
          parkregler: "Für Anlagen auf Netzebene 5: Blindleistung Q(U) oder cos φ, Einspeiselimit und Fernsteuerbefehle des Netzbetreibers – TOR-konform nachgewiesen.",
          fernwartung: "Gesicherter Zugriff auf Wechselrichter, Zähler und Schutz – Störungen erkennen, bevor sie Ertrag kosten.",
          scada: "Erzeugung, Lastgang, Speicher und Ladepunkte in einer Oberfläche – mit Kennzahlen für Controlling und Nachhaltigkeitsbericht.",
        }}
        bild={{ src: "/Images/AT/technik/leitwarte-netzbetrieb.jpg", alt: "" }}
      />

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Ablauf" title="Vom Lastgang zur laufenden Anlage" className="mb-12" />
        <AblaufLeiste
          items={[
            { icon: FileSpreadsheet, title: "Lastgang & Dach", text: "Viertelstundenwerte, Netzrechnung, Dachpläne und Statik auswerten – daraus ergeben sich Grundlast, Anlagengröße und Netzebene." },
            { icon: HandCoins, title: "Wirtschaftlichkeit & Förderung", text: "Varianten mit und ohne Speicher, Überschussvermarktung, EAG-Zuschuss, IFB und Finanzierung nebeneinander." },
            { icon: ClipboardList, title: "Netz & Genehmigung", text: "Netzzugangsantrag, Förderantrag vor Inbetriebnahme, Abstimmung mit Behörde, Versicherung und Feuerwehr." },
            { icon: Wrench, title: "Montage im laufenden Betrieb", text: "Baustelleneinrichtung nach Ihren Schichtplänen, Inbetriebnahme mit Prüfprotokoll und Anlagenbuch." },
            { icon: LineChart, title: "Betrieb & Service", text: "Monitoring über unser SCADA, Wartungsvertrag, E-Check und Reststromvermarktung – über die gesamte Laufzeit." },
            { icon: Zap, title: "Ausbau", text: "Speicher, Ladepunkte, Wärmepumpe oder Energiegemeinschaft später ergänzen – die Anlage ist dafür vorbereitet." },
          ]}
        />
      </Section>

      <Section tone="sand" space="md" id="fachdetails">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Für Technik & Einkauf" title="Netz, Rechenweg und Recht im Detail" />
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <StandPille>Werte Stand 09/2026 – SNE-V 2018 Novelle 2026</StandPille>
          </div>
        </div>
        <FachTabs
          tabs={[
            { id: "netzebenen", label: "Netzebenen & Dach" },
            { id: "beispielrechnung", label: "Beispielrechnung" },
            { id: "wirtschaftlichkeit", label: "Wirtschaftlichkeit & Netzentgelte" },
            { id: "recht", label: "Genehmigung & Recht" },
          ]}
        >
          <div>
            <h3 className="ov-h3 text-ink-900">Netzebenen für gewerbliche PV-Anlagen in Österreich</h3>
            <Tabelle
              className="mt-6"
              dicht
              caption="Netzebenen für gewerbliche PV-Anlagen in Österreich"
              spalten={[
                { key: "ne", label: "Netzebene", breite: "w-[18%]" },
                { key: "ort", label: "Anschlusspunkt" },
                { key: "groesse", label: "Typische Anlagengröße" },
                { key: "tor", label: "TOR Erzeuger" },
              ]}
              zeilen={NETZEBENEN}
              fuss="Richtwerte – die Netzebene legt der Netzbetreiber fest. Typen nach TOR Erzeuger (E-Control): Typ A ≥ 0,8 kW bis < 250 kW, Typ B 250 kW bis < 35 MW, Typ C 35 bis < 50 MW, Typ D ≥ 50 MW oder Anschluss ≥ 110 kV."
            />
            <Prosa className="mt-8 grid gap-6 xl:grid-cols-2 xl:gap-10 [&>*+*]:mt-0">
              <p>
                <strong>Ab Typ B verlangt der Netzbetreiber zusätzliche Nachweise</strong> – unter anderem zur Blindleistungsbereitstellung, zur
                Wirkleistungsreduktion auf Vorgabe und zur Fernwirkanbindung. Auf Mittelspannung übernimmt das ein Parkregler (EZA-Regler) am
                Netzverknüpfungspunkt. Den entwickeln wir selbst, ebenso Fernwartung und SCADA – damit bleibt die Verantwortung für das
                Zusammenspiel bei einem Ansprechpartner. Hintergründe im Ratgeber{" "}
                <Link href="/ratgeber/tor-erzeuger-netzanschluss">TOR Erzeuger und Netzanschluss</Link>.
              </p>
              <p>
                <strong>Beim Dach zählen Statik und Schnee.</strong> Wir bemessen nach ÖNORM B 1991-1-3 (Schneelast) und B 1991-1-4 (Wind) und
                prüfen die Schneelast Ihres Standorts – schnell vorab mit dem <Link href="/standort-check">Standort-Check</Link>. Den
                Brandschutz planen wir nach OVE-Richtlinie R 11-1 mit Freihaltezonen, Abschaltkonzept und Feuerwehrplan.
              </p>
            </Prosa>
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">300 kWp auf einer Produktionshalle in Oberösterreich</h3>
            <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Ein nachvollziehbares Rechenbeispiel mit offengelegten Annahmen – kein Angebot. Ihre Zahlen hängen von Lastgang, Dach, Liefervertrag und
              Förderzuschlag ab.
            </p>
            <Tabelle
              className="mt-6"
              dicht
              caption="Beispielrechnung Wirtschaftlichkeit einer 300-kWp-PV-Anlage auf Netzebene 6"
              spalten={[
                { key: "pos", label: "Position", breite: "w-[30%]" },
                { key: "wert", label: "Annahme / Rechnung" },
                { key: "ergebnis", label: "Ergebnis", breite: "w-[20%]", className: "font-semibold text-ink-900" },
              ]}
              zeilen={BEISPIEL}
              fuss="Beispiel, Stand 09/2026. Annahmen: Standort Innviertel (spezifischer Ertrag 1.050 kWh/kWp, Richtwert nach PVGIS), Netzebene 6 im Netzbereich Oberösterreich, Energiepreis 11 ct/kWh netto, Überschusserlös 6 ct/kWh, Investition 800 €/kWp netto (Marktannahme, kein Ökovolt-Preis), EAG-Zuschuss nur bei Zuschlag. Nicht enthalten: Leistungspreiseffekt, Degradation, Preissteigerungen, Finanzierung. Förderungen können die Bemessungsgrundlage des IFB mindern – bitte mit der Steuerberatung abstimmen."
            />
          </div>

          <div className="grid gap-10 xl:grid-cols-[1fr_1fr] xl:gap-14">
            <Prosa>
              <p>
                <strong>Der Arbeitspreis, den ein Betrieb für Netzstrom zahlt, besteht aus mehreren Teilen</strong> – und fast alle entfallen für
                Solarstrom, den Sie selbst verbrauchen: der Energiepreis aus Ihrem Liefervertrag, das Netznutzungsentgelt (Arbeitspreis), das
                Netzverlustentgelt, verbrauchsabhängige Förderbeiträge und die Elektrizitätsabgabe. Selbst erzeugter und verbrauchter Strom aus
                erneuerbaren Quellen ist nach § 2 Elektrizitätsabgabegesetz ohne Mengengrenze von der Abgabe befreit. 2026 beträgt die Abgabe für
                Unternehmen befristet 0,82 ct/kWh, regulär 1,5 ct/kWh.
              </p>
              <p>
                <strong>Der Leistungspreis folgt in Österreich einer eigenen Logik.</strong> Bei gemessener Leistung verrechnet der Netzbetreiber
                den Mittelwert der höchsten Viertelstundenleistung jedes Monats (§ 52 ElWOG 2010). Anders als bei einer einzigen Jahresspitze
                zählt also jeder Monat – eine PV-Anlage, die Sommerspitzen zur Mittagszeit senkt, wirkt anteilig. Mehr dazu auf der Seite{" "}
                <Link href="/gewerbespeicher">Gewerbespeicher und Peak Shaving</Link> und im Ratgeber{" "}
                <Link href="/ratgeber/peak-shaving-leistungspreis">Leistungspreis in Österreich senken</Link>.
              </p>
              <p>
                <strong>Steuerlich</strong> gilt die Anlage als abnutzbares Wirtschaftsgut mit linearer oder degressiver Abschreibung. Für
                Anschaffungen von November 2025 bis 31. Dezember 2026 ist der ökologische Investitionsfreibetrag auf 22 % erhöht (ab 2027 wieder
                15 %); begünstigt sind neben PV-Anlagen auch Stromspeicher, E-Ladestationen und emissionsfreie Fahrzeuge. Details im Ratgeber{" "}
                <Link href="/ratgeber/investitionsfreibetrag-photovoltaik">Investitionsfreibetrag für Photovoltaik</Link> und unter{" "}
                <Link href="/forderungen/steuerlich">steuerliche Vorteile</Link>.
              </p>
              <p>
                <strong>Förderung:</strong> Der <Link href="/ratgeber/eag-investitionszuschuss">EAG-Investitionszuschuss</Link> fördert 2026 Anlagen
                bis 1.000 kWp; in den Kategorien C und D wird nach dem beantragten Fördersatz gereiht, maximal 130 bzw. 120 € je kWp. Anlagen über
                10 kWp können alternativ an den Ausschreibungen für die Marktprämie teilnehmen (Höchstpreis 2026: 7,77 ct/kWh).
              </p>
            </Prosa>
            <div>
              <h3 className="ov-h3 text-ink-900">Netznutzungsentgelte 2026 im Vergleich</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-600">
                Leistungspreis je kW und Jahr sowie Arbeitspreis je kWh, jeweils netto. Die Netzebene steht auf Ihrer Netzrechnung.
              </p>
              <Tabelle
                className="mt-6"
                dicht
                caption="Netznutzungsentgelte 2026 für Netzebene 5, 6 und 7 in Oberösterreich, Salzburg und Wien"
                spalten={[
                  { key: "ne", label: "Netzebene", breite: "w-[31%]" },
                  { key: "ooe", label: "Oberösterreich" },
                  { key: "sbg", label: "Salzburg" },
                  { key: "wien", label: "Wien" },
                ]}
                zeilen={NETZENTGELTE}
                fuss="Quelle: Systemnutzungsentgelte-Verordnung 2018 – Novelle 2026, BGBl. II Nr. 305/2025 (E-Control), § 5. Zusätzlich fällt das Netzverlustentgelt an, z. B. Netzebene 6 Oberösterreich 0,454 ct/kWh. Werte für alle Netzbereiche in der Verordnung."
              />
            </div>
            <Hebel
              className="xl:col-span-2"
              cols={3}
              items={[
                { icon: Receipt, titel: "Steuer", text: "Öko-IFB 22 % bis Ende 2026, danach 15 %. Dazu Abschreibung – linear oder degressiv." },
                { icon: HandCoins, titel: "Förderung", text: "EAG-Investitionszuschuss bis 1.000 kWp, Speicher mit 150 €/kWh bis 50 kWh, Made-in-Europe-Bonus möglich." },
                { icon: Gauge, titel: "Planbarkeit", text: "Ein großer Teil der Stromkosten ist für 25 Jahre und mehr kalkulierbar – unabhängig vom Spotpreis." },
              ]}
            />
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">Was ein Gewerbeprojekt rechtlich braucht</h3>
            <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Für eine Dachanlage im Betrieb sind in Österreich meist wenige Verfahren nötig – aber die richtigen, in der richtigen Reihenfolge.
            </p>
            <Prosa className="mt-6">
              <ul className="grid gap-x-10 gap-y-3 xl:grid-cols-2">
                <li>
                  <strong>Netzzugang:</strong> Antrag beim Netzbetreiber (z. B. Netz Oberösterreich, Salzburg Netz, Wiener Netze, Netz Niederösterreich), Netzverträglichkeitsprüfung, Netzzugangsvertrag und Einspeisezählpunkt. Rechtsgrundlage ist seit 2025/2026 schrittweise das Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025).
                </li>
                <li>
                  <strong>Gewerberecht:</strong> Überschusseinspeiser sind Teil der Betriebsanlage; laut Erlass des Wirtschaftsministeriums vom 1. März 2021 im Regelfall ohne eigene Genehmigung – außer bei Sonderfällen wie Fluchtwegen, Ex-Zonen oder Blendung.
                </li>
                <li>
                  <strong>Elektrizitätsrecht des Landes:</strong> Dach- und Parkplatzanlagen sind vielfach bewilligungsfrei – in Oberösterreich etwa auf künstlichen Strukturen unabhängig von der Leistung. Volleinspeiser und Freiflächen können eine Anzeige oder Bewilligung brauchen.
                </li>
                <li>
                  <strong>Bauordnung:</strong> je Bundesland unterschiedlich – auf Dächern meist bewilligungs- und anzeigefrei, aber Orts- und Landschaftsbild, Statik und Brandschutz gelten immer. Überblick unter <Link href="/forderungen/baurecht">Baurecht der Bundesländer</Link>.
                </li>
                <li>
                  <strong>Förderung:</strong> EAG-Antrag vor der Inbetriebnahme; alle Anzeigen und Genehmigungen müssen zu diesem Zeitpunkt in erster Instanz vorliegen.
                </li>
                <li>
                  <strong>Versicherung & Brandschutz:</strong> Abstimmung mit Betriebsversicherung und Feuerwehr, Errichtung nach ÖVE/ÖNORM E 8101 und Erstprüfung nach ÖVE/ÖNORM EN 62446-1.
                </li>
              </ul>
              <p>
                Ausführlich im Ratgeber <Link href="/ratgeber/photovoltaik-genehmigung">Photovoltaik-Genehmigung in Österreich</Link> und unter{" "}
                <Link href="/forderungen/richtlinien">Richtlinien &amp; Netzanschluss</Link>.
              </p>
            </Prosa>
            <Hinweis titel="Orientierung, keine Rechts- oder Steuerberatung" className="mt-8">
              Die Angaben geben den Stand 09/2026 wieder. Landesrecht, Förderbedingungen und Netzentgelte ändern sich regelmäßig – wir prüfen
              sie für Ihr Projekt tagesaktuell.
            </Hinweis>
          </div>
        </FachTabs>
      </Section>

      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Geschäftsführung, Technik und Einkauf" />
            <p className="mt-10 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Selbst rechnen & weiterlesen</p>
            <RechnerLeiste
              className="mt-4"
              kompakt
              mini
              spaltenKlasse="grid-cols-1 sm:grid-cols-2 lg:grid-cols-1"
              items={[
              { icon: Calculator, tag: "Rechner", titel: "Gewerbe-PV-Rechner", text: "Anlagengröße, Eigenverbrauch und Amortisation nach Ihrem Verbrauch.", href: "/rechner/gewerbe-pv" },
              { icon: Gauge, tag: "Rechner", titel: "Peak-Shaving-Rechner", text: "Was ein Speicher am Leistungspreis der zwölf Monatsspitzen spart.", href: "/rechner/peak-shaving" },
              { icon: Car, tag: "Rechner", titel: "E-Flotten-Rechner", text: "Ladebedarf der Flotte gegen Solarstrom vom eigenen Dach.", href: "/rechner/e-flotte" },
              { icon: Leaf, tag: "Rechner", titel: "CO₂- & ESG-Rechner", text: "Scope-2-Wirkung Ihrer Anlage für den Nachhaltigkeitsbericht.", href: "/rechner/co2-esg" },
              { icon: Wrench, tag: "Service", titel: "Wartungsvertrag", text: "Service-Level nach Anlagengröße: Inspektion, Thermografie, Reinigung, Störungsbehebung.", href: "/service/wartung" },
              { icon: Users, tag: "Service", titel: "Energiegemeinschaft", text: "Überschuss an Mitarbeitende, Nachbarbetriebe oder die Gemeinde weitergeben.", href: "/energiegemeinschaften" },
            ]}
            />
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Wirtschaftlichkeit, Technik & Recht" />

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Schicken Sie uns Ihren Lastgang – wir zeigen, was Ihr Dach leisten kann."
        text="Erstgespräch per Video oder vor Ort, mit erster Einschätzung zu Anlagengröße, Netzebene, Eigenverbrauch, Förderung und Wirtschaftlichkeit."
        primary={{ label: v.cta, href: "/termin?art=video&thema=gewerbe" }}
        secondary={{ label: "Anfrage starten", href: "/angebot?objekt=gewerbe", icon: Cog }}
      />

      <Bildnachweis items={nachweise("flachdachDornbirn", "batteriecontainer", "carport", "weitendorf", "leitwarte")} />
    </div>
  );
}
