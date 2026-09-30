import Link from "next/link";
import {
  BatteryCharging,
  CarFront,
  ClipboardList,
  Cog,
  CreditCard,
  FileSpreadsheet,
  Gauge,
  HandCoins,
  LineChart,
  PlugZap,
  Receipt,
  Scale,
  Users,
  Wrench,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hebel, Hinweis, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import KennzahlenBand from "@/components/Loesungen/B/KennzahlenBand";
import FotoBento from "@/components/Loesungen/B/FotoBento";
import FachTabs from "@/components/Loesungen/B/FachTabs";
import Rechenbeleg from "@/components/Loesungen/B/Rechenbeleg";
import DunkelSektion, { SystemKarten } from "@/components/Loesungen/B/DunkelSektion";
import FlottenRegler from "@/components/Loesungen/B/FlottenRegler";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/ladeinfrastruktur";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Ladeinfrastruktur für Unternehmen & E-Flotte | Ökovolt";
const BESCHREIBUNG =
  "Ladeinfrastruktur für Flotte, Mitarbeiter- und Kundenparkplatz in Österreich: AC/DC, Lastmanagement, PV-Überschussladen, Eichrecht und Förderung.";
const HERO_BILD = "/Images/AT/loesungen-b/laden-dc-ladesaeule.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1920, height: 1280 }] },
};

const FAQ = [
  {
    q: "Ist das Laden beim Arbeitgeber für Mitarbeitende steuerfrei?",
    a: "Ja. Lädt eine Mitarbeiterin oder ein Mitarbeiter ein E-Fahrzeug unentgeltlich beim Arbeitgeber, entsteht kein Sachbezug – das gilt für Firmenwagen ebenso wie für private E-Autos der Belegschaft. Werden Kosten für das Laden zu Hause ersetzt, ist das 2026 nur nach tatsächlich geladenen Kilowattstunden steuerfrei, mit einem Strompreis von 32,806 Cent je kWh; die frühere Pauschale ist seit 1. Jänner 2026 entfallen.",
  },
  {
    q: "Bleibt der Sachbezug für E-Firmenwagen bei null?",
    a: "Bis 31. Dezember 2026 ja, für Fahrzeuge mit 0 g CO₂-Emission. Der Nationalrat hat im Juli 2026 eine Neuregelung beschlossen: ab 2027 ein Sachbezug von 0,375 % der Anschaffungskosten (höchstens 180 € im Monat), ab 2028 von 0,625 % (höchstens 300 €). Für Verbrenner gelten weiterhin 1,5 bzw. 2 %. Prüfen Sie die Auswirkungen auf Ihre Car Policy mit der Lohnverrechnung.",
  },
  {
    q: "Müssen unsere Ladepunkte geeicht sein?",
    a: "Wenn Sie Dritten das Laden nach Kilowattstunden verrechnen, ja: Nach dem Maß- und Eichgesetz müssen Zähler und Ladetarifgeräte eichrechtskonform sein; seit 1. Jänner 2026 dürfen nur noch Geräte geeicht werden, die den Eichvorschriften des BEV für Ladeeinrichtungen entsprechen. Für kostenloses Laden oder rein interne Flottennutzung ohne Verrechnung gilt das nicht – ein MID-Zähler für die interne Kostenzuordnung ist trotzdem sinnvoll.",
  },
  {
    q: "AC oder DC – was brauchen wir?",
    a: "Das entscheidet die Standzeit. Fahrzeuge, die mehrere Stunden stehen – Mitarbeitende, Hotelgäste, Flotte über Nacht –, laden an AC-Ladepunkten mit 11 oder 22 kW günstig und netzschonend. Kurze Standzeiten bei Kundschaft, Zwischenladen von Transportern oder Lkw brauchen DC mit 50 bis 400 kW. Meist ist die Mischung aus vielen AC- und wenigen DC-Punkten die wirtschaftlichste Lösung.",
  },
  {
    q: "Reicht unser Netzanschluss für viele Ladepunkte?",
    a: "Oft ja – mit Lastmanagement. Es verteilt die verfügbare Leistung dynamisch auf alle Fahrzeuge, berücksichtigt den aktuellen Verbrauch des Gebäudes und nutzt PV-Überschuss zuerst. Wo das nicht reicht, puffert ein Speicher die Spitzen, bevor eine teure Erhöhung der Anschlussleistung nötig wird. Ohne Lastmanagement steigen zudem Monatsspitzen und Leistungspreis.",
  },
  {
    q: "Welche Förderung gibt es 2026 für betriebliche Ladeinfrastruktur?",
    a: "Das Bundesprogramm E-Mobilität für Betriebe, Gebietskörperschaften und Vereine (eMove Austria) mit bis zu 22.500 € wurde vorzeitig geschlossen, weil das Budget ausgeschöpft war. Weiter nutzbar sind der ökologische Investitionsfreibetrag von 22 % für E-Ladestationen (bis Ende 2026), 30 % Zuschlag im EAG-Investitionszuschuss für PV-Parkplatzüberdachungen ab 10 Stellplätzen sowie Landesprogramme. Neue Bundescalls prüfen wir tagesaktuell.",
  },
  {
    q: "Was müssen öffentlich zugängliche Ladepunkte können?",
    a: "Nach der EU-Verordnung über Infrastruktur für alternative Kraftstoffe (AFIR) müssen neue öffentliche Ladepunkte ab 50 kW Ad-hoc-Zahlung per Bankkarte ermöglichen, und Preise müssen vorab klar angezeigt werden. Für kWh-Abrechnung gilt das Eichrecht. Wir planen Hardware, Backend und Abrechnung so, dass diese Anforderungen erfüllt sind.",
  },
  {
    q: "Wann lohnt sich Ladeinfrastruktur für Lkw?",
    a: "Sobald elektrische Lkw in der Flotte geplant sind, sollte der Netzanschluss mitgedacht werden: Depotladen über Nacht braucht je Fahrzeug einige zehn bis rund 150 kW, Schnellladen und künftig das Megawatt Charging System (MCS) ein Vielfaches. Solche Standorte hängen meist an der Mittelspannung. Wir planen Trafostation, Speicher und Ausbaustufen so, dass Sie schrittweise wachsen können.",
  },
];

const LADEARTEN = [
  { art: "AC 11–22 kW", standzeit: "ab ca. 3–4 Stunden", einsatz: "Mitarbeitende, Flotte über Nacht, Hotelgäste, Wohnanlagen", netz: "Niederspannung, mit Lastmanagement sehr netzschonend" },
  { art: "DC 50–150 kW", standzeit: "30–90 Minuten", einsatz: "Kundenparkplatz, Handel, Gastronomie, Zwischenladen von Transportern", netz: "meist Netzebene 7 oder 6, oft mit Speicherpuffer" },
  { art: "DC 150–400 kW (HPC)", standzeit: "15–45 Minuten", einsatz: "Transit, Logistik, Lkw-Schnellladen, Ladeparks", netz: "Netzebene 6 oder 5, eigene Trafostation" },
  { art: "MCS (Megawatt Charging)", standzeit: "Lenkpausen", einsatz: "Schwere Lkw im Fernverkehr – Zukunft", netz: "Mittelspannung, Netzebene 5 oder höher" },
];

const BEISPIEL = [
  { pos: "Flotte", wert: "20 E-Transporter × 20.000 km/Jahr × 25 kWh/100 km", ergebnis: "100.000 kWh/Jahr" },
  { pos: "Strom aus PV-Überschuss (60 %)", wert: "60.000 kWh × 6 ct (entgangene Einspeisung)", ergebnis: "3.600 €/Jahr" },
  { pos: "Strom aus dem Netz (40 %)", wert: "40.000 kWh × 16 ct (Energie, Netz, Abgaben)", ergebnis: "6.400 €/Jahr" },
  { pos: "Energiekosten elektrisch", wert: "≈ 10 ct/kWh im Mittel", ergebnis: "10.000 €/Jahr", hervorheben: true },
  { pos: "Vergleich Diesel", wert: "400.000 km × 9 l/100 km × 1,40 €/l netto", ergebnis: "50.400 €/Jahr" },
  { pos: "Differenz Energiekosten", wert: "ohne Fahrzeug-, Wartungs- und Mautkosten", ergebnis: "≈ 40.400 €/Jahr", hervorheben: true },
  { pos: "Ladeinfrastruktur", wert: "Annahme 20 AC-Ladepunkte inkl. Lastmanagement, 2.500 €/Punkt netto", ergebnis: "50.000 €" },
  { pos: "Öko-IFB 22 % (bis 31.12.2026)", wert: "Freibetrag auf 50.000 €, Körperschaftsteuer 23 %", ergebnis: "≈ 2.500 € Steuerwirkung" },
];

function TabKopf({ titel, text, children }) {
  return (
    <div>
      <h3 className="ov-h3 text-ink-900">{titel}</h3>
      {text && <p className="mt-4 text-[16px] leading-relaxed text-ink-600">{text}</p>}
      {children}
    </div>
  );
}

export default async function LadeinfrastrukturPage({ searchParams }) {
  const v = zielgruppenVariante("laden", await searchParams);

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Ladeinfrastruktur für Unternehmen in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Unternehmen mit Flotte, Handel, Hotellerie, Logistik, Gemeinden"
        bild={HERO_BILD}
        leistungen={["Ladekonzept und Netzanschluss", "AC- und DC-Ladepunkte", "Dynamisches Lastmanagement", "PV-Überschussladen und Solarcarport", "Eichrechtskonforme Abrechnung", "Wartung"]}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Gewerbe & Industrie", href: "/gewerbe" }, { name: "Ladeinfrastruktur" }]}
        eyebrow={v.eyebrow}
        title={<>Ladeinfrastruktur für Unternehmen – <span className="ov-text-gradient-light">Flotte, Belegschaft und Kunden</span></>}
        lead={<><span className="block font-display text-[1.15em] font-bold leading-snug text-white">{v.titel} {v.akzent}</span><span className="mt-3 block">{v.lead}</span></>}
        image={{ src: HERO_BILD, alt: "DC-Schnellladesäule mit drei Ladekabeln auf einem Parkplatz mit Ladeplätzen für Elektrofahrzeuge", position: "62% 50%" }}
        actions={[
          { label: v.cta, href: "/termin?art=video&thema=speicher" },
          { label: "Anfrage starten", href: "/angebot?objekt=gewerbe&wallbox=1", icon: ClipboardList },
        ]}
        points={["AC & DC mit Lastmanagement", "PV-Überschussladen & Carport", "Eichrecht & AFIR-konform", "Sachbezug & Förderung geklärt"]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-36"
      />

      <KennzahlenBand
        items={[
          { text: "0 €", label: "Sachbezug für E-Firmenwagen mit 0 g CO₂ bis Ende 2026 – Laden beim Arbeitgeber steuerfrei" },
          { wert: 32.806, dezimal: 3, suffix: " ct", label: "je kWh: steuerfreier Kostenersatz für das Laden zu Hause 2026" },
          { wert: 30, prefix: "+ ", suffix: " %", label: "EAG-Zuschlag für PV-Parkplatzüberdachungen ab 10 Stellplätzen" },
          { wert: 22, suffix: " %", label: "Öko-Investitionsfreibetrag für E-Ladestationen bis 31.12.2026" },
        ]}
        quelle="Quellen: BMF, Sachbezug Kraftfahrzeug; EY Österreich und ICON Wirtschaftstreuhand (Sachbezug 2026/2027); EAG-IZV § 6 laut Leitfaden Land Oberösterreich 2026; WKO (Investitionsfreibetrag)."
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Anwendungen"
          title="Laden, wo Fahrzeuge ohnehin stehen"
          lead="Die beste Ladeinfrastruktur richtet sich nach Standzeiten und Fahrprofilen – nicht nach dem Datenblatt der Ladesäule. Diese Anwendungen planen wir in Österreich am häufigsten."
          className="mb-12"
        />
        <FotoBento
          items={[
            { bild: "/Images/AT/loesungen-b/laden-tiefgarage.jpg", alt: "Elektrofahrzeuge an Wandladepunkten in einer Tiefgarage", tag: "Depot", titel: "Firmenflotte & Transporter", text: "Depotladen über Nacht und Zwischenladen am Tag – mit Priorisierung nach Einsatzplan und Ladestand." },
            { bild: "/Images/Ratgeber/pv-ueberschussladen.jpg", alt: "Wallbox an einer Holzfassade mit angeschlossenem Ladekabel", titel: "Mitarbeiterparkplatz", text: "Steuerfreies Laden für die Belegschaft, tagsüber mit Solarstrom – ein Argument im Recruiting." },
            { bild: "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg", alt: "Luftbild eines Parkplatzes mit Solar-Carports und Ladestationen (Symbolbild)", titel: "Kunden- & Gästeparkplatz", text: "Handel, Gastronomie, Hotellerie: Ladeangebot mit Kartenzahlung, Preisauszeichnung und Roaming." },
            { bild: "/Images/Ratgeber/solarcarport.jpg", alt: "Solarcarport mit Photovoltaikdach über einem Stellplatz", titel: "Solarcarport", text: "Parkplatz als Kraftwerk: Beschattung, Ladepunkte und 30 % EAG-Zuschlag ab 10 Stellplätzen." },
            { bild: "/Images/Ratgeber/bidirektionales-laden.jpg", alt: "Modernes Wohnhaus mit Photovoltaik und Elektroauto vor der Garage am Abend", titel: "Laden zu Hause", text: "Wallboxen für Dienstwagen bei Mitarbeitenden, mit kWh-genauer Erfassung für den steuerfreien Kostenersatz.", href: "/produkte/wallbox" },
            { bild: "/Images/AT/technik/umspannwerk-transformator.jpg", alt: "Transformator und Schaltgeräte in einem Umspannwerk", titel: "Lkw & Megawatt-Laden", text: "Depot- und Schnellladen für E-Lkw, vorbereitet auf das Megawatt Charging System – mit Trafostation und Speicher." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg" id="flotte">
        <SectionHeading
          eyebrow="Flotten-Check"
          title="Was Ihre E-Flotte an Energiekosten spart"
          lead="Stellen Sie Fahrzeuge, Fahrleistung und Solaranteil ein – die Rechnung folgt denselben Annahmen wie unsere Beispielrechnung. Für ein vollständiges Bild mit Fahrzeugkosten nutzen Sie den E-Flotte-Rechner."
          className="mb-12"
        />
        <FlottenRegler />
      </Section>

      <Section tone="white" space="lg" id="technik">
        <SplitMedia
          eyebrow="AC, DC & Netz"
          title="Die Standzeit bestimmt die Ladeleistung."
          text="Je länger ein Fahrzeug steht, desto weniger Leistung braucht es – und desto günstiger wird der Ladepunkt. Für den Netzanschluss zählt nicht die Summe der Ladepunkte, sondern das Lastmanagement."
          image={{ src: "/Images/Ratgeber/solarcarport.jpg", alt: "Solarcarport mit Photovoltaikmodulen über Stellplätzen" }}
        >
          <Prosa className="mt-6 text-[16px]">
            <p>
              <strong>Lastmanagement ist Pflicht, nicht Kür.</strong> Es verteilt die Leistung dynamisch, berücksichtigt den übrigen Verbrauch im Gebäude und hält den Netzanschluss ein. Ohne Steuerung steigen die Monatsspitzen –
              und damit der Leistungspreis, der in Österreich auf den Mittelwert der Monatsspitzen verrechnet wird. Ein <Link href="/gewerbespeicher">Gewerbespeicher</Link> kann DC-Lader zusätzlich puffern.
            </p>
            <p>
              <strong>PV-Überschussladen:</strong> Das Energiemanagement lädt zuerst mit Solarstrom, der sonst für wenige Cent eingespeist würde, und erst dann aus dem Netz. Für Flotten mit Tagstandzeiten ist das der wirksamste
              Hebel für den Eigenverbrauch – mehr im Ratgeber <Link href="/ratgeber/e-flotte-laden-photovoltaik">E-Flotte mit Photovoltaik laden</Link> und <Link href="/ratgeber/pv-ueberschussladen">PV-Überschussladen</Link>.
            </p>
            <p>
              <strong>Offene Standards:</strong> Ladepunkte mit OCPP-Anbindung bleiben herstellerunabhängig; das Backend wählen Sie nach Abrechnungsbedarf. Bidirektionales Laden (V2B) bereiten wir vor, wo Fahrzeuge und Normen es
              erlauben – siehe <Link href="/ratgeber/bidirektionales-laden">bidirektionales Laden</Link>.
            </p>
          </Prosa>
        </SplitMedia>
      </Section>

      <DunkelSektion
        eyebrow="Technik"
        title="Ladepunkte, PV und Speicher in einem System"
        lead="Unsere eigenen Systeme verbinden Ladepunkte mit Erzeugung, Gebäudeverbrauch und Netzvorgaben – statt einer Insellösung pro Hersteller."
        bild={{
          src: "/Images/Ratgeber/energiemanagementsystem.jpg",
          alt: "Visualisierung eines Energiemanagements: Hausanschluss, Speicher, Wallbox und Verbraucher sind verbunden",
          badge: "PV-Überschuss zuerst, dann Netz – mit Lastmanagement am Netzanschluss.",
        }}
      >
        <SystemKarten
          texte={{
            parkregler: "Bei großen Ladeparks mit PV auf Mittelspannung: Einhaltung von Bezugs- und Einspeisegrenzen am Netzverknüpfungspunkt.",
            fernwartung: "Ladepunkte, Zähler und Lastmanagement aus der Ferne überwachen und Störungen beheben – oft ohne Einsatz vor Ort.",
            scada: "Ladevorgänge, PV-Anteil, Monatsspitzen und Kosten je Fahrzeug oder Kostenstelle – als Basis für Abrechnung und Nachhaltigkeitsbericht.",
          }}
        />
      </DunkelSektion>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Vom Fahrprofil zum laufenden Ladepark" align="center" className="mb-14" />
        <Steps
          cols={3}
          items={[
            { icon: FileSpreadsheet, title: "Bedarf & Fahrprofile", text: "Fahrzeuge, Kilometer, Standzeiten, Parkplätze und Lastgang des Standorts aufnehmen." },
            { icon: Gauge, title: "Netz & Lastmanagement", text: "Verfügbare Anschlussleistung, Ausbaustufen, PV-Überschuss und Speicherbedarf berechnen." },
            { icon: CarFront, title: "Hardware & Abrechnung", text: "AC/DC-Mix, Backend, Eichrecht, Zutritt, Tarife und Kostenstellen festlegen." },
            { icon: HandCoins, title: "Förderung & Steuer", text: "IFB, PV-Zuschläge, Landes- und Bundescalls prüfen und Anträge rechtzeitig stellen." },
            { icon: Wrench, title: "Installation", text: "Tiefbau, Leitungen, Fundamente, Ladepunkte, Inbetriebnahme und Anmeldung beim Netzbetreiber." },
            { icon: LineChart, title: "Betrieb", text: "Monitoring, Wartung, Eichfristen und Erweiterung für die nächsten Fahrzeuge." },
          ]}
        />
        <div className="mt-12 flex flex-wrap justify-center gap-3 text-[15px]">
          <Link href="/ratgeber/solarcarport" className="rounded-full bg-white px-4 py-2 text-ink-700 ring-1 ring-ink-200 transition-colors hover:text-ov-700 hover:ring-ov-300">Ratgeber Solarcarport</Link>
          <Link href="/ratgeber/wallbox-installation" className="rounded-full bg-white px-4 py-2 text-ink-700 ring-1 ring-ink-200 transition-colors hover:text-ov-700 hover:ring-ov-300">Wallbox-Installation in Österreich</Link>
          <Link href="/gewerbespeicher" className="rounded-full bg-white px-4 py-2 text-ink-700 ring-1 ring-ink-200 transition-colors hover:text-ov-700 hover:ring-ov-300">
            <BatteryCharging aria-hidden="true" className="mr-1.5 inline h-4 w-4 text-ov-600" />
            Speicher als Ladepuffer
          </Link>
        </div>
      </Section>

      <Section tone="white" space="lg" id="fachdetails" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Für Fuhrpark, Technik & Personal"
          title="Die Fachdetails – kompakt nachgeschlagen"
          lead="Ladearten im Vergleich, Eichrecht und Abrechnung, Steuer und Förderung 2026 sowie die vollständige Beispielrechnung."
          className="mb-10"
        />
        <FachTabs
          tabs={[
            {
              id: "ladearten",
              label: "Ladearten",
              icon: <PlugZap />,
              inhalt: (
                <Tabelle
                  dicht
                  caption="Ladearten für Unternehmen im Vergleich"
                  spalten={[
                    { key: "art", label: "Ladeart", breite: "w-[20%]" },
                    { key: "standzeit", label: "Typische Standzeit", breite: "w-[18%]" },
                    { key: "einsatz", label: "Einsatz" },
                    { key: "netz", label: "Netz" },
                  ]}
                  zeilen={LADEARTEN}
                  fuss="Richtwerte. Ob ein Ladepark auf Netzebene 7, 6 oder 5 angeschlossen wird, legt der Netzbetreiber fest. Bei Erhöhung der Anschlussleistung fallen einmalige Netzentgelte an."
                />
              ),
            },
            {
              id: "abrechnung",
              label: "Eichrecht & Abrechnung",
              icon: <Scale />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                  <TabKopf
                    titel="Wer nach kWh verrechnet, braucht geeichte Technik."
                    text="Sobald Dritte für Ladestrom nach Kilowattstunden bezahlen, gelten in Österreich das Maß- und Eichgesetz und – bei öffentlichen Ladepunkten – die EU-Verordnung AFIR."
                  >
                    <StandPille className="mt-6">Stand 09/2026</StandPille>
                  </TabKopf>
                  <Prosa>
                    <ul>
                      <li><strong>Maß- und Eichgesetz (MEG):</strong> Elektrizitätszähler und Tarifgeräte, die der Verrechnung dienen, sind eichpflichtig. Seit 1. Jänner 2026 dürfen nur noch Ladetarifgeräte geeicht werden, die den Eichvorschriften des Bundesamts für Eich- und Vermessungswesen (BEV) entsprechen.</li>
                      <li><strong>Interne Nutzung:</strong> Kostenloses Laden und rein interne Flottennutzung ohne Verrechnung sind nicht eichpflichtig; für Kostenstellen und Sachbezugsnachweise empfehlen wir dennoch MID-Zähler.</li>
                      <li><strong>AFIR:</strong> Neue öffentlich zugängliche Ladepunkte ab 50 kW brauchen Ad-hoc-Zahlung per Bankkarte; Preise müssen vorab transparent sein. Förderprogramme verlangten zuletzt eine weithin sichtbare Preisauszeichnung bei großen Ladeparks.</li>
                      <li><strong>Heimladen:</strong> Für steuerfreien Kostenersatz müssen die geladenen kWh je Fahrzeug nachgewiesen werden – über eine Wallbox mit Zähler und Backend.</li>
                    </ul>
                  </Prosa>
                </div>
              ),
            },
            {
              id: "steuer",
              label: "Steuer & Förderung",
              icon: <Receipt />,
              inhalt: (
                <div>
                  <TabKopf
                    titel="Sachbezug, IFB und Zuschläge – was 2026 gilt"
                    text="Für E-Mobilität im Unternehmen sind in Österreich derzeit weniger die direkten Zuschüsse entscheidend als Steuerregeln und Förderzuschläge bei der Photovoltaik."
                  />
                  <Hebel
                    className="mt-8"
                    cols={4}
                    items={[
                      { icon: Receipt, titel: "Sachbezug", text: "2026: null für E-Firmenwagen mit 0 g CO₂. Ab 2027 laut Beschluss des Nationalrats 0,375 % der Anschaffungskosten (max. 180 €/Monat), ab 2028 0,625 % (max. 300 €/Monat)." },
                      { icon: Users, titel: "Laden für Mitarbeitende", text: "Kostenloses Laden beim Arbeitgeber ist kein Sachbezug – auch für private E-Autos der Belegschaft. Heimladen: Ersatz nach kWh, 2026 mit 32,806 ct/kWh." },
                      { icon: HandCoins, titel: "Investitionsfreibetrag", text: "E-Ladestationen und emissionsfreie Fahrzeuge sind ökologische Investitionen: 22 % IFB für Anschaffungen bis 31.12.2026, danach 15 %." },
                      { icon: CreditCard, titel: "Zuschüsse", text: "eMove Austria (bis 22.500 € für Betriebe) ist ausgeschöpft; ENIN für E-Lkw und Infrastruktur sowie Landesprogramme laufen in Calls. PV-Carports ab 10 Stellplätzen: 30 % EAG-Zuschlag." },
                    ]}
                  />
                  <Hinweis className="mt-8" titel="Förderungen ändern sich schnell">
                    Bundes- und Landesprogramme für E-Mobilität werden 2026 in einzelnen Calls vergeben und sind oft rasch ausgeschöpft. Wir prüfen den aktuellen Stand für Ihr Projekt – ein Überblick steht im{" "}
                    <Link href="/foerdercheck" className="text-ov-700 underline">Förder-Check</Link>. Keine Steuerberatung.
                  </Hinweis>
                </div>
              ),
            },
            {
              id: "beispiel",
              label: "Beispielrechnung",
              icon: <HandCoins />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                  <TabKopf
                    titel="20 E-Transporter mit PV-Überschussladen"
                    text="Ein Energiekosten-Vergleich mit offengelegten Annahmen – kein Angebot. Fahrzeugkosten, Wartung und Maut sind nicht enthalten."
                  />
                  <Rechenbeleg
                    titel="Energiekosten E-Transporter-Flotte"
                    caption="Beispielrechnung Energiekosten einer E-Transporter-Flotte mit PV-Überschussladen"
                    zeilen={BEISPIEL}
                    fuss="Beispiel, Stand 09/2026. Annahmen: Verbrauch 25 kWh/100 km, Dieselverbrauch 9 l/100 km, Dieselpreis 1,40 €/l netto, Netzstrom 16 ct/kWh netto inkl. Netzentgelten und Abgaben, PV-Anteil 60 % bei Tagstandzeiten, Ladepunktkosten als Marktannahme (kein Ökovolt-Preis). Förderungen können die IFB-Bemessungsgrundlage mindern."
                  />
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Fuhrpark, Technik und Personal" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Flotte, Carport und Abrechnung" />

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Planen wir Ladepunkte, die zu Ihrem Netzanschluss passen."
        text="Erstgespräch per Video: Fahrprofile, Parkplätze, Anschlussleistung, PV-Überschuss, Abrechnung und Förderung."
        primary={{ label: v.cta, href: "/termin?art=video&thema=speicher" }}
        secondary={{ label: "Anfrage starten", href: "/angebot?objekt=gewerbe&wallbox=1", icon: Cog }}
      />

      <Bildnachweis
        items={[
          { motiv: "DC-Ladesäule", urheber: "Reinhard Bruckner", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/public-charger-for-electric-vehicles-4678065/" },
          { motiv: "Ladepunkte in der Tiefgarage", urheber: "Jakub Zerdzicki", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/eco-friendly-electric-cars-in-underground-parking-28851165/" },
          { motiv: "Solarcarport", urheber: "Kindel Media", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/construction-industry-technology-architecture-9800008/" },
          { motiv: "Solar-Carports mit Ladestationen (Symbolbild, USA)", urheber: "pedrik", lizenz: "CC BY 2.0", href: "https://commons.wikimedia.org/wiki/File:Parking_under_Solar_Canopy_(52937580768).jpg" },
        ]}
      />
    </div>
  );
}
