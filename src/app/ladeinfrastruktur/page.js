import Link from "next/link";
import {
  BatteryCharging,
  Building2,
  CarFront,
  ClipboardList,
  Cog,
  CreditCard,
  FileSpreadsheet,
  Gauge,
  HandCoins,
  Home,
  LineChart,
  ParkingSquare,
  PlugZap,
  Receipt,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import TechnikVerbund from "@/components/Loesungen/TechnikVerbund";
import { Bildnachweis, Fachabschnitt, Hebel, Hinweis, Kennzahlen, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/ladeinfrastruktur";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Ladeinfrastruktur für Unternehmen in Österreich | Ökovolt";
const BESCHREIBUNG =
  "Ladeinfrastruktur für Flotte, Mitarbeiter- und Kundenparkplatz in Österreich: AC/DC, Lastmanagement, PV-Überschussladen, Eichrecht und Förderung.";
const HERO_BILD = "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1920, height: 1180 }] },
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
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Luftbild eines Parkplatzes mit Solar-Carports und Ladestationen für Elektroautos (Symbolbild)" }}
        actions={[
          { label: v.cta, href: "/termin?art=video" },
          { label: "Anfrage starten", href: "/angebot", icon: ClipboardList },
        ]}
        points={["AC & DC mit Lastmanagement", "PV-Überschussladen & Carport", "Eichrecht & AFIR-konform", "Sachbezug & Förderung geklärt"]}
      />

      <Kennzahlen
        items={[
          { wert: "0 €", label: "Sachbezug für E-Firmenwagen mit 0 g CO₂ bis Ende 2026 – Laden beim Arbeitgeber steuerfrei" },
          { wert: "32,806 ct", label: "je kWh: steuerfreier Kostenersatz für das Laden zu Hause 2026" },
          { wert: "+ 30 %", label: "EAG-Zuschlag für PV-Parkplatzüberdachungen ab 10 Stellplätzen" },
          { wert: "22 %", label: "Öko-Investitionsfreibetrag für E-Ladestationen bis 31.12.2026" },
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
        <FeatureGrid
          cols={3}
          items={[
            { icon: Truck, title: "Firmenflotte & Transporter", text: "Depotladen über Nacht und Zwischenladen am Tag – mit Priorisierung nach Einsatzplan und Ladestand." },
            { icon: Users, title: "Mitarbeiterparkplatz", text: "Steuerfreies Laden für die Belegschaft, tagsüber mit Solarstrom – ein Argument im Recruiting." },
            { icon: ParkingSquare, title: "Kunden- & Gästeparkplatz", text: "Handel, Gastronomie, Hotellerie: Ladeangebot mit Kartenzahlung, Preisauszeichnung und Roaming." },
            { icon: Building2, title: "Solarcarport", text: "Parkplatz als Kraftwerk: Beschattung, Ladepunkte und 30 % EAG-Zuschlag ab 10 Stellplätzen." },
            { icon: Home, title: "Laden zu Hause", text: "Wallboxen für Dienstwagen bei Mitarbeitenden, mit kWh-genauer Erfassung für den steuerfreien Kostenersatz.", href: "/produkte/wallbox" },
            { icon: PlugZap, title: "Lkw & Megawatt-Laden", text: "Depot- und Schnellladen für E-Lkw, vorbereitet auf das Megawatt Charging System – mit Trafostation und Speicher." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg" id="technik">
        <Fachabschnitt
          eyebrow="AC, DC & Netz"
          title="Die Standzeit bestimmt die Ladeleistung."
          lead="Je länger ein Fahrzeug steht, desto weniger Leistung braucht es – und desto günstiger wird der Ladepunkt. Für den Netzanschluss zählt nicht die Summe der Ladepunkte, sondern das Lastmanagement."
        >
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
          <Prosa className="mt-8">
            <p>
              <strong>Lastmanagement ist Pflicht, nicht Kür.</strong> Es verteilt die Leistung dynamisch, berücksichtigt den übrigen
              Verbrauch im Gebäude und hält den Netzanschluss ein. Ohne Steuerung steigen die Monatsspitzen – und damit der Leistungspreis, der
              in Österreich auf den Mittelwert der Monatsspitzen verrechnet wird. Ein{" "}
              <Link href="/gewerbespeicher">Gewerbespeicher</Link> kann DC-Lader zusätzlich puffern.
            </p>
            <p>
              <strong>PV-Überschussladen:</strong> Das Energiemanagement lädt zuerst mit Solarstrom, der sonst für wenige Cent eingespeist würde,
              und erst dann aus dem Netz. Für Flotten mit Tagstandzeiten ist das der wirksamste Hebel für den Eigenverbrauch – mehr im Ratgeber{" "}
              <Link href="/ratgeber/e-flotte-laden-photovoltaik">E-Flotte mit Photovoltaik laden</Link> und{" "}
              <Link href="/ratgeber/pv-ueberschussladen">PV-Überschussladen</Link>.
            </p>
            <p>
              <strong>Offene Standards:</strong> Ladepunkte mit OCPP-Anbindung bleiben herstellerunabhängig; das Backend wählen Sie nach
              Abrechnungsbedarf. Bidirektionales Laden (V2B) bereiten wir vor, wo Fahrzeuge und Normen es erlauben – siehe{" "}
              <Link href="/ratgeber/bidirektionales-laden">bidirektionales Laden</Link>.
            </p>
          </Prosa>
        </Fachabschnitt>
      </Section>

      <Section tone="white" space="lg" id="abrechnung">
        <Fachabschnitt
          eyebrow="Eichrecht & Abrechnung"
          title="Wer nach kWh verrechnet, braucht geeichte Technik."
          lead="Sobald Dritte für Ladestrom nach Kilowattstunden bezahlen, gelten in Österreich das Maß- und Eichgesetz und – bei öffentlichen Ladepunkten – die EU-Verordnung AFIR."
          aside={<StandPille>Stand 09/2026</StandPille>}
        >
          <Prosa>
            <ul>
              <li><strong>Maß- und Eichgesetz (MEG):</strong> Elektrizitätszähler und Tarifgeräte, die der Verrechnung dienen, sind eichpflichtig. Seit 1. Jänner 2026 dürfen nur noch Ladetarifgeräte geeicht werden, die den Eichvorschriften des Bundesamts für Eich- und Vermessungswesen (BEV) entsprechen.</li>
              <li><strong>Interne Nutzung:</strong> Kostenloses Laden und rein interne Flottennutzung ohne Verrechnung sind nicht eichpflichtig; für Kostenstellen und Sachbezugsnachweise empfehlen wir dennoch MID-Zähler.</li>
              <li><strong>AFIR:</strong> Neue öffentlich zugängliche Ladepunkte ab 50 kW brauchen Ad-hoc-Zahlung per Bankkarte; Preise müssen vorab transparent sein. Förderprogramme verlangten zuletzt eine weithin sichtbare Preisauszeichnung bei großen Ladeparks.</li>
              <li><strong>Heimladen:</strong> Für steuerfreien Kostenersatz müssen die geladenen kWh je Fahrzeug nachgewiesen werden – über eine Wallbox mit Zähler und Backend.</li>
            </ul>
          </Prosa>
        </Fachabschnitt>
      </Section>

      <Section tone="green" space="lg" id="steuer">
        <Fachabschnitt
          eyebrow="Steuer & Förderung"
          title="Sachbezug, IFB und Zuschläge – was 2026 gilt"
          lead="Für E-Mobilität im Unternehmen sind in Österreich derzeit weniger die direkten Zuschüsse entscheidend als Steuerregeln und Förderzuschläge bei der Photovoltaik."
        >
          <Hebel
            cols={2}
            items={[
              { icon: Receipt, titel: "Sachbezug", text: "2026: null für E-Firmenwagen mit 0 g CO₂. Ab 2027 laut Beschluss des Nationalrats 0,375 % der Anschaffungskosten (max. 180 €/Monat), ab 2028 0,625 % (max. 300 €/Monat)." },
              { icon: Users, titel: "Laden für Mitarbeitende", text: "Kostenloses Laden beim Arbeitgeber ist kein Sachbezug – auch für private E-Autos der Belegschaft. Heimladen: Ersatz nach kWh, 2026 mit 32,806 ct/kWh." },
              { icon: HandCoins, titel: "Investitionsfreibetrag", text: "E-Ladestationen und emissionsfreie Fahrzeuge sind ökologische Investitionen: 22 % IFB für Anschaffungen bis 31.12.2026, danach 15 %." },
              { icon: CreditCard, titel: "Zuschüsse", text: "eMove Austria (bis 22.500 € für Betriebe) ist ausgeschöpft; ENIN für E-Lkw und Infrastruktur sowie Landesprogramme laufen in Calls. PV-Carports ab 10 Stellplätzen: 30 % EAG-Zuschlag." },
            ]}
          />
          <Hinweis className="mt-8" titel="Förderungen ändern sich schnell">
            Bundes- und Landesprogramme für E-Mobilität werden 2026 in einzelnen Calls vergeben und sind oft rasch ausgeschöpft. Wir prüfen den
            aktuellen Stand für Ihr Projekt – ein Überblick steht im <Link href="/foerdercheck" className="text-ov-700 underline">Förder-Check</Link>.
            Keine Steuerberatung.
          </Hinweis>
        </Fachabschnitt>
      </Section>

      <Section tone="white" space="lg" id="beispiel">
        <SectionHeading
          eyebrow="Beispielrechnung"
          title="20 E-Transporter mit PV-Überschussladen"
          lead="Ein Energiekosten-Vergleich mit offengelegten Annahmen – kein Angebot. Fahrzeugkosten, Wartung und Maut sind nicht enthalten."
          className="mb-10"
        />
        <Tabelle
          caption="Beispielrechnung Energiekosten einer E-Transporter-Flotte mit PV-Überschussladen"
          spalten={[
            { key: "pos", label: "Position", breite: "w-[28%]" },
            { key: "wert", label: "Annahme / Rechnung" },
            { key: "ergebnis", label: "Ergebnis", breite: "w-[20%]", className: "font-semibold text-ink-900" },
          ]}
          zeilen={BEISPIEL}
          fuss="Beispiel, Stand 09/2026. Annahmen: Verbrauch 25 kWh/100 km, Dieselverbrauch 9 l/100 km, Dieselpreis 1,40 €/l netto, Netzstrom 16 ct/kWh netto inkl. Netzentgelten und Abgaben, PV-Anteil 60 % bei Tagstandzeiten, Ladepunktkosten als Marktannahme (kein Ökovolt-Preis). Förderungen können die IFB-Bemessungsgrundlage mindern."
        />
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Technik"
          title="Ladepunkte, PV und Speicher in einem System"
          lead="Unsere eigenen Systeme verbinden Ladepunkte mit Erzeugung, Gebäudeverbrauch und Netzvorgaben – statt einer Insellösung pro Hersteller."
          className="mb-12"
        />
        <TechnikVerbund
          texte={{
            parkregler: "Bei großen Ladeparks mit PV auf Mittelspannung: Einhaltung von Bezugs- und Einspeisegrenzen am Netzverknüpfungspunkt.",
            fernwartung: "Ladepunkte, Zähler und Lastmanagement aus der Ferne überwachen und Störungen beheben – oft ohne Einsatz vor Ort.",
            scada: "Ladevorgänge, PV-Anteil, Monatsspitzen und Kosten je Fahrzeug oder Kostenstelle – als Basis für Abrechnung und Nachhaltigkeitsbericht.",
          }}
        />
      </Section>

      <Section tone="white" space="lg">
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
        <div className="mt-12 flex flex-wrap gap-3 text-[15px]">
          <Link href="/ratgeber/solarcarport" className="rounded-full bg-sand-50 px-4 py-2 text-ink-700 ring-1 ring-ink-200 hover:text-ov-700">Ratgeber Solarcarport</Link>
          <Link href="/ratgeber/wallbox-installation" className="rounded-full bg-sand-50 px-4 py-2 text-ink-700 ring-1 ring-ink-200 hover:text-ov-700">Wallbox-Installation in Österreich</Link>
          <Link href="/gewerbespeicher" className="rounded-full bg-sand-50 px-4 py-2 text-ink-700 ring-1 ring-ink-200 hover:text-ov-700">
            <BatteryCharging aria-hidden="true" className="mr-1.5 inline h-4 w-4 text-ov-600" />
            Speicher als Ladepuffer
          </Link>
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Flotte, Carport und Abrechnung" />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Fuhrpark, Technik und Personal" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Planen wir Ladepunkte, die zu Ihrem Netzanschluss passen."
        text="Erstgespräch per Video: Fahrprofile, Parkplätze, Anschlussleistung, PV-Überschuss, Abrechnung und Förderung."
        primary={{ label: v.cta, href: "/termin?art=video" }}
        secondary={{ label: "Anfrage starten", href: "/angebot", icon: Cog }}
      />

      <Bildnachweis
        items={[{ motiv: "Solar-Carports mit Ladestationen (Symbolbild, USA)", urheber: "pedrik", lizenz: "CC BY 2.0", href: "https://commons.wikimedia.org/wiki/File:Parking_under_Solar_Canopy_(52937580768).jpg" }]}
      />
    </div>
  );
}
