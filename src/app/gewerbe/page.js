import Link from "next/link";
import {
  BatteryCharging,
  Car,
  ClipboardList,
  Cog,
  Factory,
  FileSpreadsheet,
  Gauge,
  HandCoins,
  LineChart,
  Receipt,
  Snowflake,
  TrendingUp,
  Users,
  Warehouse,
  Wrench,
  Zap,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import SplitMedia from "@/components/ui/SplitMedia";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import TechnikVerbund from "@/components/Loesungen/TechnikVerbund";
import { Fachabschnitt, Hebel, Hinweis, Kennzahlen, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
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
        breadcrumbs={[{ name: "Gewerbe & Industrie" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Luftaufnahme eines Gewerbegebäudes mit Photovoltaikanlagen auf den Flachdächern" }}
        actions={[
          { label: v.cta, href: "/termin?art=video" },
          { label: "Anfrage mit Lastgang", href: "/angebot", icon: FileSpreadsheet },
        ]}
        points={["Auslegung nach Viertelstundenwerten", "Netzebene 7 bis 5 inkl. Parkregler", "Förderung, IFB & Netzzugang geklärt", "Wartung & Vermarktung aus einer Hand"]}
      />

      <Kennzahlen
        items={[
          { wert: "22 %", label: "Öko-Investitionsfreibetrag für PV, Speicher & Ladestationen (Anschaffung bis 31.12.2026)" },
          { wert: "120 €/kWp", label: "höchstzulässiger EAG-Investitionszuschuss 2026, Kategorie D (100–1.000 kWp)" },
          { wert: "0 ct", label: "Elektrizitätsabgabe auf selbst erzeugten und verbrauchten Solarstrom" },
          { wert: "12", label: "Monatsspitzen bilden den Leistungspreis bei gemessener Leistung" },
        ]}
        quelle="Quellen: WKO (Investitionsfreibetrag), EAG-Investitionszuschüsseverordnung-Strom 2026 laut Leitfaden Land Oberösterreich (Stand 06/2026), § 2 Elektrizitätsabgabegesetz, § 52 ElWOG 2010 / SNE-V 2018."
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Lösungen"
          title="Photovoltaik, die in den Betrieb passt – nicht nur aufs Dach"
          lead="Gewerbliche Photovoltaik in Österreich ist ein Energieprojekt: Anlage, Netzanschluss, Speicher, Ladepunkte und Vermarktung müssen zum Lastgang passen. Diese Bausteine planen und bauen wir aus einer Hand."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Warehouse, title: "Hallen- & Flachdächer", text: "Aufgeständert Ost-West oder Süd, ballastiert oder mechanisch befestigt – nach Statik, Schneelastzone, Dachhaut und Brandabschnitten." },
            { icon: Factory, title: "Produktion & Prozess", text: "Grundlast aus Druckluft, Lüftung, Absaugung und Maschinen deckt sich gut mit der Solarkurve – im Ein- wie im Mehrschichtbetrieb." },
            { icon: Snowflake, title: "Kühlung & Kühlhäuser", text: "Kälteanlagen laufen genau dann auf Hochlast, wenn die Sonne am stärksten scheint. Mit Kältespeicher lässt sich Eigenverbrauch zusätzlich verschieben." },
            { icon: BatteryCharging, title: "Gewerbespeicher & Peak Shaving", text: "Lastspitzen kappen, die den Leistungspreis treiben, und Überschüsse in Abend- und Nachtstunden verschieben.", href: "/gewerbespeicher" },
            { icon: Car, title: "E-Flotte & Ladeinfrastruktur", text: "Dienstwagen, Transporter und Mitarbeiterfahrzeuge mit Solarstrom laden – mit Lastmanagement passend zum Netzanschluss.", href: "/ladeinfrastruktur" },
            { icon: TrendingUp, title: "Reststromvermarktung", text: "Überschüsse zum OeMAG-Marktpreis, über Stromhändler, Direktvermarktung oder PPA verkaufen – oder in die Energiegemeinschaft geben.", href: "/service/direktvermarktung" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <SplitMedia
          eyebrow="Branchen"
          title="Jede Branche hat ihren eigenen Lastgang"
          text={[
            "Die richtige Anlagengröße ergibt sich nicht aus der Dachfläche, sondern aus der Deckung von Solarkurve und Verbrauch. Deshalb werten wir zuerst Ihre Viertelstundenwerte aus: Grundlast am Wochenende, Anlaufspitzen bei Schichtbeginn, Sommer- und Winterprofil.",
            "Typische Profile, die wir in Österreich häufig sehen – und was das für die Auslegung bedeutet:",
          ]}
          points={[
            { title: "Produktion", text: "hohe Tages-Grundlast, oft 60–90 % Eigenverbrauch möglich; Spitzen beim Anfahren von Pressen, Öfen und Kompressoren." },
            { title: "Logistik & Lager", text: "große Dächer, eher geringe Last – Überschussvermarktung, Energiegemeinschaft und Ladeinfrastruktur werden wichtig." },
            { title: "Lebensmittelhandel & Kühlhäuser", text: "Kälte, Beleuchtung und Backstationen laufen tagsüber und im Sommer auf Hochlast – sehr hohe Gleichzeitigkeit." },
            { title: "Handwerk & KMU", text: "Werkstatt, Büro und Fuhrpark – kleiner, aber mit hohem Eigenverbrauch, oft auf Netzebene 7." },
          ]}
          image={{ src: "/Images/Home/download-2.jpg", alt: "Aufgeständerte Photovoltaikmodule mit Ballastierung auf einem Flachdach" }}
          action={{ label: "Lastgang auswerten lassen", href: "/angebot" }}
        />
      </Section>

      <Section tone="white" space="lg" id="wirtschaftlichkeit">
        <Fachabschnitt
          eyebrow="Wirtschaftlichkeit in Österreich"
          title="Jede selbst genutzte Kilowattstunde spart mehr als den Energiepreis."
          lead="Eine gewerbliche PV-Anlage rechnet sich in Österreich über fünf Hebel: vermiedener Energiepreis, Netzentgelte, Elektrizitätsabgabe, Leistungspreis und Steuer. Der Überschusserlös ist nur der sechste."
          aside={<StandPille>Werte Stand 09/2026 – SNE-V 2018 Novelle 2026</StandPille>}
        >
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

          <h3 className="ov-h3 mt-12 text-ink-900">Netznutzungsentgelte 2026 im Vergleich</h3>
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
        </Fachabschnitt>
      </Section>

      <Section tone="green" space="lg">
        <SectionHeading
          eyebrow="Beispielrechnung"
          title="300 kWp auf einer Produktionshalle in Oberösterreich"
          lead="Ein nachvollziehbares Rechenbeispiel mit offengelegten Annahmen – kein Angebot. Ihre Zahlen hängen von Lastgang, Dach, Liefervertrag und Förderzuschlag ab."
          className="mb-10"
        />
        <Tabelle
          caption="Beispielrechnung Wirtschaftlichkeit einer 300-kWp-PV-Anlage auf Netzebene 6"
          spalten={[
            { key: "pos", label: "Position", breite: "w-[30%]" },
            { key: "wert", label: "Annahme / Rechnung" },
            { key: "ergebnis", label: "Ergebnis", breite: "w-[20%]", className: "font-semibold text-ink-900" },
          ]}
          zeilen={BEISPIEL}
          fuss="Beispiel, Stand 09/2026. Annahmen: Standort Innviertel (spezifischer Ertrag 1.050 kWh/kWp, Richtwert nach PVGIS), Netzebene 6 im Netzbereich Oberösterreich, Energiepreis 11 ct/kWh netto, Überschusserlös 6 ct/kWh, Investition 800 €/kWp netto (Marktannahme, kein Ökovolt-Preis), EAG-Zuschuss nur bei Zuschlag. Nicht enthalten: Leistungspreiseffekt, Degradation, Preissteigerungen, Finanzierung. Förderungen können die Bemessungsgrundlage des IFB mindern – bitte mit der Steuerberatung abstimmen."
        />
        <div className="mt-10">
          <Hebel
            cols={3}
            items={[
              { icon: Receipt, titel: "Steuer", text: "Öko-IFB 22 % bis Ende 2026, danach 15 %. Dazu Abschreibung – linear oder degressiv." },
              { icon: HandCoins, titel: "Förderung", text: "EAG-Investitionszuschuss bis 1.000 kWp, Speicher mit 150 €/kWh bis 50 kWh, Made-in-Europe-Bonus möglich." },
              { icon: Gauge, titel: "Planbarkeit", text: "Ein großer Teil der Stromkosten ist für 25 Jahre und mehr kalkulierbar – unabhängig vom Spotpreis." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg" id="technik">
        <Fachabschnitt
          eyebrow="Netzanschluss & Technik"
          title="Netzebene 7, 6 oder 5 – der Anschluss bestimmt die Technik."
          lead="Auf welcher Netzebene Ihre Anlage einspeist, legt der Netzbetreiber nach einer Netzverträglichkeitsprüfung fest. Davon hängen Trafostation, Schutztechnik, Regler und Kosten ab."
        >
          <Tabelle
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
          <Prosa className="mt-8">
            <p>
              <strong>Ab Typ B verlangt der Netzbetreiber zusätzliche Nachweise</strong> – unter anderem zur Blindleistungsbereitstellung, zur
              Wirkleistungsreduktion auf Vorgabe und zur Fernwirkanbindung. Auf Mittelspannung übernimmt das ein Parkregler (EZA-Regler) am
              Netzverknüpfungspunkt. Den entwickeln wir selbst, ebenso Fernwartung und SCADA – damit bleibt die Verantwortung für das
              Zusammenspiel bei einem Ansprechpartner. Hintergründe im Ratgeber{" "}
              <Link href="/ratgeber/tor-erzeuger-netzanschluss">TOR Erzeuger und Netzanschluss</Link>.
            </p>
            <p>
              <strong>Beim Dach zählen Statik und Schnee.</strong> Wir bemessen nach ÖNORM B 1991-1-3 (Schneelast) und B 1991-1-4 (Wind) und
              prüfen die Schneelastzone Ihres Standorts – schnell vorab mit dem <Link href="/standort-check">Standort-Check</Link>. Den
              Brandschutz planen wir nach OVE-Richtlinie R 11-1 mit Freihaltezonen, Abschaltkonzept und Feuerwehrplan.
            </p>
          </Prosa>
        </Fachabschnitt>
        <div className="mt-14">
          <TechnikVerbund
            texte={{
              parkregler: "Für Anlagen auf Netzebene 5: Blindleistung Q(U) oder cos φ, Einspeiselimit und Fernsteuerbefehle des Netzbetreibers – TOR-konform nachgewiesen.",
              fernwartung: "Gesicherter Zugriff auf Wechselrichter, Zähler und Schutz – Störungen erkennen, bevor sie Ertrag kosten.",
              scada: "Erzeugung, Lastgang, Speicher und Ladepunkte in einer Oberfläche – mit Kennzahlen für Controlling und Nachhaltigkeitsbericht.",
            }}
          />
        </div>
      </Section>

      <Section tone="sand" space="lg" id="recht">
        <Fachabschnitt
          eyebrow="Genehmigung & Recht in Österreich"
          title="Was ein Gewerbeprojekt rechtlich braucht"
          lead="Für eine Dachanlage im Betrieb sind in Österreich meist wenige Verfahren nötig – aber die richtigen, in der richtigen Reihenfolge."
        >
          <Prosa>
            <ul>
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
        </Fachabschnitt>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Vom Lastgang zur laufenden Anlage" align="center" className="mb-14" />
        <Steps
          cols={3}
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

      <Section tone="sand" space="md">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Wrench, titel: "Wartungsvertrag", text: "Service-Level nach Anlagengröße: Inspektion, Thermografie, Reinigung, Störungsbehebung.", href: "/service/wartung" },
            { icon: TrendingUp, titel: "Reststromvermarktung", text: "OeMAG-Marktpreis, Stromhändler, Direktvermarktung oder PPA – wir vergleichen für Ihr Einspeiseprofil.", href: "/service/direktvermarktung" },
            { icon: Users, titel: "Energiegemeinschaft", text: "Überschuss an Mitarbeitende, Nachbarbetriebe oder die Gemeinde weitergeben.", href: "/energiegemeinschaften" },
          ].map((k) => (
            <Link key={k.titel} href={k.href} className="group ov-card-hover flex flex-col rounded-3xl bg-white p-7 ring-1 ring-ink-200/70 hover:ring-ov-200">
              <k.icon aria-hidden="true" className="h-6 w-6 text-ov-600" />
              <h3 className="ov-h3 mt-5 text-ink-900">{k.titel}</h3>
              <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">{k.text}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Wirtschaftlichkeit, Technik & Recht" />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Geschäftsführung, Technik und Einkauf" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Schicken Sie uns Ihren Lastgang – wir zeigen, was Ihr Dach leisten kann."
        text="Erstgespräch per Video oder vor Ort, mit erster Einschätzung zu Anlagengröße, Netzebene, Eigenverbrauch, Förderung und Wirtschaftlichkeit."
        primary={{ label: v.cta, href: "/termin?art=video" }}
        secondary={{ label: "Anfrage starten", href: "/angebot", icon: Cog }}
      />
    </div>
  );
}
