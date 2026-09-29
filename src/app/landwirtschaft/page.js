import Link from "next/link";
import {
  BadgeEuro,
  BatteryCharging,
  CalendarCheck2,
  ClipboardList,
  Cog,
  Egg,
  FileCheck2,
  Flame,
  HandCoins,
  LineChart,
  Milk,
  ShieldAlert,
  Sprout,
  Users,
  Warehouse,
  Wheat,
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
import KennzahlenBand from "@/components/Loesungen/A/KennzahlenBand";
import FotoBento from "@/components/Loesungen/A/FotoBento";
import LastprofilExplorer from "@/components/Loesungen/A/LastprofilExplorer";
import TechnikSystem from "@/components/Loesungen/A/TechnikSystem";
import AblaufLeiste from "@/components/Loesungen/A/AblaufLeiste";
import FachTabs from "@/components/Loesungen/A/FachTabs";
import RechnerLeiste from "@/components/Loesungen/A/RechnerLeiste";
import { nachweise } from "@/components/Loesungen/A/bildnachweise";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/landwirtschaft";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für die Landwirtschaft in Österreich | Ökovolt";
const BESCHREIBUNG =
  "PV auf Stall, Scheune und Maschinenhalle in Österreich: Speicher fürs Melken, Notstrom, Pauschalierung, EAG-Förderung und Agri-PV aus einer Hand.";
const HERO_BILD = "/Images/AT/loesungen-a/lw-hof-stalldaecher.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
};

const FAQ = [
  {
    q: "Wie wird eine PV-Anlage am pauschalierten Hof steuerlich behandelt?",
    a: "Das hängt davon ab, wofür der Strom überwiegend verwendet wird. Wird er überwiegend im eigenen land- und forstwirtschaftlichen Betrieb verbraucht und nur der Überschuss eingespeist, gilt die Anlage in der Regel als land- und forstwirtschaftlicher Nebenbetrieb; die Umsatzsteuerpauschalierung kann dann auch für den Überschuss gelten. Volleinspeiser und Anlagen mit überwiegendem Verkauf sind dagegen ein eigener Gewerbebetrieb. Klären Sie das vorab mit Landwirtschaftskammer und Steuerberatung.",
  },
  {
    q: "Kann ich als pauschalierter Landwirt den Investitionsfreibetrag nutzen?",
    a: "Nein, der Investitionsfreibetrag setzt eine Gewinnermittlung durch Bilanzierung oder Einnahmen-Ausgaben-Rechnung voraus und steht bei pauschaler Gewinnermittlung nicht zu. Wer buchführt, kann für Anschaffungen bis 31. Dezember 2026 den ökologischen IFB von 22 % geltend machen. Ob sich ein Wechsel lohnt, ist eine Frage für Ihre Steuerberatung.",
  },
  {
    q: "Ist der Stromverkauf einkommensteuerfrei?",
    a: "Für natürliche Personen sind Einkünfte aus der Einspeisung von bis zu 12.500 kWh pro Jahr steuerfrei, wenn die Anlage höchstens 35 kWp Engpassleistung und 25 kVA Anschlussleistung hat. Darüber wird nur der übersteigende Teil anteilig besteuert. Bei größeren Hofanlagen gelten die allgemeinen Regeln.",
  },
  {
    q: "Eignet sich ein altes Stall- oder Scheunendach?",
    a: "Oft ja – entscheidend sind Statik, Schneelast, Zustand der Eindeckung und die Restlaufzeit des Dachs. Da eine PV-Anlage 25 Jahre und länger läuft, lohnt es sich häufig, eine Dachsanierung mit der Montage zu verbinden. Asbestzementplatten dürfen nicht bearbeitet werden; sie müssen vorher von befugten Fachbetrieben saniert werden.",
  },
  {
    q: "Was bringt ein Speicher auf dem Hof?",
    a: "Melken am frühen Morgen und am Abend, Milchkühlung und Lüftung laufen zu Zeiten, in denen die Anlage wenig erzeugt. Ein Speicher verschiebt den Mittagsüberschuss dorthin und hebt den Eigenverbrauch deutlich. Mit Notstromfunktion bleiben Melkanlage, Kühlung, Lüftung und Tränke bei einem Stromausfall versorgt – ein Thema für Tierwohl und Blackout-Vorsorge.",
  },
  {
    q: "Wie groß sollte die Anlage auf dem Hof sein?",
    a: "Für die Wirtschaftlichkeit zuerst nach dem eigenen Verbrauch: Melk- und Kühltechnik, Lüftung, Fütterung, Trocknung, Werkstatt und Wohnhaus. Große Dachflächen können zusätzlich bewusst für den Verkauf genutzt werden – an die OeMAG, an einen Stromhändler oder an die Energiegemeinschaft der Gemeinde. Steuerlich kann die Aufteilung zwischen Eigenverbrauch und Einspeisung entscheidend sein.",
  },
  {
    q: "Welche Förderungen gibt es für PV in der Landwirtschaft?",
    a: "Bundesweit den EAG-Investitionszuschuss für PV-Anlagen bis 1.000 kWp und Speicher mit 150 € je kWh (bis 50 kWh, mindestens 0,5 kWh je kWp) – 2026 zuletzt im Fördercall von 8. bis 22. Oktober. Für Agri-PV gibt es 30 % Zuschlag. Dazu kommen je nach Bundesland Landes- und Gemeindeförderungen, die unser Förder-Check zusammenfasst.",
  },
  {
    q: "Stört Stallluft die Technik?",
    a: "Ammoniak und Feuchtigkeit greifen ungeschützte Metallteile und Elektronik an. Wir setzen ammoniakbeständige Module und Unterkonstruktionen ein, montieren Wechselrichter und Speicher außerhalb der Stallluft und achten bei Heu- und Strohlagern besonders auf Brandschutz und Leitungsführung.",
  },
];

const BEISPIEL = [
  { pos: "Betrieb", wert: "Milchviehbetrieb, Verbrauch 60.000 kWh/Jahr, Netzebene 7", ergebnis: "–" },
  { pos: "Anlage und Jahresertrag", wert: "50 kWp Stalldach Süd × 1.100 kWh/kWp", ergebnis: "55.000 kWh" },
  { pos: "Eigenverbrauch mit 30-kWh-Speicher (60 %)", wert: "33.000 kWh × 20 ct (Energie, Netz, Abgaben)", ergebnis: "≈ 6.600 €/Jahr" },
  { pos: "Einspeisung (40 %)", wert: "22.000 kWh × 6 ct", ergebnis: "≈ 1.320 €/Jahr" },
  { pos: "Wartung, Versicherung", wert: "Annahme 1.000 €/Jahr", ergebnis: "− 1.000 €/Jahr" },
  { pos: "Jährlicher Vorteil", wert: "vor Steuern", ergebnis: "≈ 6.920 €/Jahr", hervorheben: true },
  { pos: "Investition", wert: "Annahme 50 kWp × 1.100 € + 30 kWh × 600 € (netto)", ergebnis: "73.000 €" },
  { pos: "EAG-Investitionszuschuss", wert: "Annahme 110 €/kWp (Kat. C) + 150 €/kWh Speicher", ergebnis: "− 10.000 €" },
  { pos: "Statische Amortisation", wert: "63.000 € ÷ 6.920 €/Jahr", ergebnis: "≈ 9 Jahre", hervorheben: true },
];


// Typisierte Beispielprofile (relativ, Stundenwerte) – Veranschaulichung, keine Messwerte.
const BETRIEBE = [
  {
    id: "milchvieh",
    label: "Milchvieh",
    icon: "Milk",
    titel: "Milchvieh: Melken & Kühlen",
    last: [0.32, 0.3, 0.3, 0.3, 0.45, 0.95, 1, 0.8, 0.5, 0.45, 0.45, 0.48, 0.5, 0.5, 0.48, 0.5, 0.7, 0.95, 1, 0.75, 0.5, 0.4, 0.35, 0.33],
    pvFaktor: 0.9,
    text: "Melkroboter, Milchkühlung, Vakuumpumpen und Warmwasser laufen täglich – mit Speicher auch morgens und abends solar.",
    punkte: ["Speicher verschiebt den Mittagsüberschuss in die Melkzeiten", "Notstrom hält Melkanlage, Kühlung, Lüftung und Tränke am Laufen"],
    link: { label: "Blackout-Rechner", href: "/rechner/blackout" },
  },
  {
    id: "veredelung",
    label: "Schwein & Geflügel",
    icon: "Egg",
    titel: "Schweine & Geflügel",
    last: [0.6, 0.58, 0.57, 0.57, 0.58, 0.62, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.98, 1, 1, 0.97, 0.92, 0.85, 0.78, 0.72, 0.68, 0.65, 0.62, 0.6],
    lastSaison: {
      winter: [0.66, 0.65, 0.65, 0.65, 0.66, 0.68, 0.72, 0.74, 0.74, 0.73, 0.72, 0.72, 0.72, 0.72, 0.72, 0.72, 0.73, 0.74, 0.74, 0.72, 0.7, 0.69, 0.68, 0.67],
    },
    pvFaktor: 0.55,
    text: "Lüftung, Heizung und Fütterung erzeugen eine hohe Grundlast – ideal für hohen Eigenverbrauch über das ganze Jahr.",
    punkte: ["Lüftung läuft im Sommer genau zur Solarkurve auf Hochlast", "Stallluft: Technik außerhalb, ammoniakbeständige Module"],
    link: { label: "Eigenverbrauch rechnen", href: "/rechner/gewerbe-pv" },
  },
  {
    id: "ackerbau",
    label: "Ackerbau & Trocknung",
    icon: "Wheat",
    titel: "Ackerbau, Trocknung & Lager",
    last: [0.1, 0.1, 0.1, 0.1, 0.1, 0.12, 0.2, 0.35, 0.6, 0.85, 0.9, 0.92, 0.92, 0.92, 0.92, 0.9, 0.88, 0.85, 0.8, 0.6, 0.35, 0.15, 0.12, 0.1],
    lastSaison: {
      uebergang: [0.1, 0.1, 0.1, 0.1, 0.1, 0.12, 0.18, 0.3, 0.45, 0.55, 0.6, 0.6, 0.6, 0.6, 0.6, 0.58, 0.55, 0.5, 0.4, 0.3, 0.2, 0.14, 0.12, 0.1],
      winter: [0.1, 0.1, 0.1, 0.1, 0.1, 0.12, 0.16, 0.22, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.24, 0.22, 0.2, 0.18, 0.15, 0.12, 0.11, 0.1],
    },
    pvFaktor: 1.2,
    text: "Getreide- und Heutrocknung, Obstlager und Kühlräume verbrauchen saisonal viel Strom, oft genau im Sommer.",
    punkte: ["Große Maschinenhallen: Überschuss an die Energiegemeinschaft", "E-Hoflader mit Überschuss laden statt Diesel"],
    link: { label: "Energiegemeinschafts-Rechner", href: "/rechner/energiegemeinschaft" },
  },
  {
    id: "obst",
    label: "Obst & Kühllager",
    icon: "Apple",
    titel: "Obstbau & Kühllager",
    last: [0.5, 0.49, 0.48, 0.48, 0.49, 0.52, 0.58, 0.64, 0.7, 0.74, 0.78, 0.8, 0.82, 0.84, 0.84, 0.82, 0.78, 0.72, 0.66, 0.6, 0.56, 0.54, 0.52, 0.5],
    lastSaison: {
      uebergang: [0.62, 0.6, 0.6, 0.6, 0.6, 0.64, 0.75, 0.85, 0.92, 0.95, 0.97, 1, 1, 1, 1, 0.98, 0.95, 0.9, 0.82, 0.74, 0.68, 0.66, 0.64, 0.62],
      winter: [0.45, 0.44, 0.44, 0.44, 0.44, 0.45, 0.48, 0.5, 0.52, 0.53, 0.54, 0.54, 0.54, 0.54, 0.54, 0.53, 0.52, 0.5, 0.48, 0.47, 0.46, 0.46, 0.45, 0.45],
    },
    pvFaktor: 0.7,
    text: "Kühlräume und Obstlager brauchen rund um die Uhr Strom – zur Ernte und Einlagerung am meisten.",
    punkte: ["Kühlung verbraucht tagsüber mehr, wenn es warm ist", "Über der Anlage: Agri-PV mit 30 % Förderzuschlag"],
    link: { label: "Agri-PV kennenlernen", href: "/agri-pv" },
  },
];

export default async function LandwirtschaftPage({ searchParams }) {
  const v = zielgruppenVariante("landwirtschaft", await searchParams);

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Photovoltaik für land- und forstwirtschaftliche Betriebe in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Land- und forstwirtschaftliche Betriebe"
        bild={HERO_BILD}
        leistungen={["PV auf Stall, Scheune und Maschinenhalle", "Speicher und Notstrom für Melk- und Kühltechnik", "Agri-PV", "Förderantrag EAG", "Wartung"]}
      />

      <PageHero
        variant="immersive"
        className="pb-4 md:pb-6"
        breadcrumbs={[{ name: "Landwirtschaft" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Bauernhof mit Photovoltaikanlagen auf den Dächern von Stall und Scheune vor Wald und Wiese", position: "center 60%" }}
        actions={[
          { label: v.cta, href: "/termin?art=vor-ort" },
          { label: "Per Video beraten lassen", href: "/termin?art=video", icon: CalendarCheck2 },
        ]}
        points={["Stall, Scheune & Maschinenhalle", "Speicher & Notstrom fürs Melken", "Pauschalierung & Förderung geklärt", "Agri-PV mit 30 % Zuschlag"]}
      />

      <KennzahlenBand
        items={[
          { wert: 150, nach: " €/kWh", label: "EAG-Zuschuss für Stromspeicher bis 50 kWh, gemeinsam mit PV (2026)" },
          { wert: 12500, nach: " kWh", label: "Einspeisung pro Jahr einkommensteuerfrei (natürliche Personen, bis 35 kWp)" },
          { wert: 30, vor: "+ ", nach: " %", label: "Förderzuschlag für Agri-PV nach EAG-Investitionszuschüsseverordnung" },
          { wert: 22, nach: " %", label: "Öko-IFB bis Ende 2026 – nur bei Buchführung oder Einnahmen-Ausgaben-Rechnung" },
        ]}
        quelle="Quellen: EAG-IZV 2026 laut Leitfaden Land Oberösterreich (Stand 06/2026); § 3 Abs. 1 Z 39 EStG; WKO (Investitionsfreibetrag)."
      />

      <Section tone="white" space="md">
        <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Einsatzfelder" title="Wo Photovoltaik auf dem Hof am meisten bringt" />
          <p className="ov-lead text-ink-600">
            Stall, Scheune und Maschinenhalle bieten große, meist unverschattete Dächer – Melken, Kühlen, Lüften und Trocknen brauchen den Strom
            direkt am Hof.
          </p>
        </div>
        <FotoBento
          spalten={3}
          items={[
            { icon: Warehouse, titel: "Stall, Scheune & Maschinenhalle", text: "Große, meist unverschattete Dächer. Statik, Schneelast und Eindeckung prüfen wir vor Ort – bei Bedarf mit Dachsanierung.", bild: "/Images/AT/loesungen-a/lw-hof-luftbild.jpg", alt: "Luftbild eines Hofes mit großen Photovoltaikanlagen auf Hallendächern" },
            { icon: Milk, titel: "Milchvieh: Melken & Kühlen", text: "Melkroboter, Milchkühlung, Vakuumpumpen und Warmwasser laufen täglich – mit Speicher auch morgens und abends solar.", bild: "/Images/AT/loesungen-a/lw-melkroboter.jpg", alt: "Kuh in einem Melkroboter" },
            { icon: Egg, titel: "Schweine & Geflügel", text: "Lüftung, Heizung und Fütterung erzeugen eine hohe Grundlast – ideal für hohen Eigenverbrauch über das ganze Jahr.", bild: "/Images/AT/loesungen-a/lw-stall-pv.jpg", alt: "Langer Stall mit Photovoltaikmodulen auf dem Dach" },
            { icon: Wheat, titel: "Trocknung & Lager", text: "Getreide- und Heutrocknung, Obstlager und Kühlräume verbrauchen saisonal viel Strom, oft genau im Sommer.", bild: "/Images/AT/loesungen-a/lw-scheune-pv.jpg", alt: "Holzscheune mit Photovoltaikanlage auf dem Dach" },
            { icon: BatteryCharging, titel: "Speicher & Notstrom", text: "Bei Netzausfall bleiben Melkanlage, Kühlung, Lüftung und Tränke versorgt – Tierwohl und Blackout-Vorsorge.", bild: "/Images/AT/ratgeber/batteriespeicher-anlage.jpg", alt: "Batteriespeicher-Anlage mit Containern (Symbolbild)", href: "/service/notstrom" },
            { icon: Sprout, titel: "Agri-PV auf der Fläche", text: "Vertikal zwischen Grünland- und Ackerstreifen oder hoch über Obst und Beeren – mit 30 % Förderzuschlag.", bild: "/Images/AT/loesungen-a/agri-vertikal-getreide.jpg", alt: "Vertikale Agri-PV-Modulreihen in einem Getreidefeld", href: "/agri-pv" },
          ]}
        />
      </Section>

      <Section tone="sand" space="md" id="betriebsarten">
        <LastprofilExplorer
          ueberschrift="h2"
          eyebrow="Betriebsart · interaktiv"
          titel="Jeder Hof hat seinen eigenen Tagesrhythmus"
          lead="Ein landwirtschaftlicher Betrieb verbraucht Strom zu anderen Zeiten als ein Büro: früh und spät beim Melken, rund um die Uhr in Kühlung und Lüftung, saisonal bei Trocknung und Lagerung. Die Anlage muss dazu passen."
          profile={BETRIEBE}
        />
      </Section>

      <Section tone="white" space="md">
        <SplitMedia
          eyebrow="Mehr als ein Dach"
          title="Hof, Wohnhaus und Fläche als ein Energiesystem"
          text={[
            "Viele Höfe haben mehrere Zählpunkte: Betrieb, Wohnhaus, Austragshaus, Hofladen. Wir planen die Anlage so, dass der Strom dort ankommt, wo er gebraucht wird – über die richtige Anschlusslösung, eine gemeinschaftliche Erzeugungsanlage oder die Energiegemeinschaft der Gemeinde.",
            "Wer zusätzlich Fläche hat, kann Agri-PV prüfen: Strom und landwirtschaftlicher Ertrag auf demselben Feld, mit Förderzuschlag statt Abschlag.",
          ]}
          points={[
            { title: "Wärmepumpe & Warmwasser", text: "Heizung und Reinigungswasser mit Solarstrom." },
            { title: "E-Hoflader & Hof-Pkw", text: "Laden mit Überschuss statt Diesel." },
            { title: "Energiegemeinschaft", text: "Überschuss regional verkaufen, Netzentgelte der Abnehmer sinken." },
          ]}
          image={{ src: "/Images/AT/loesungen/agri-pv-obstbau.jpg", alt: "Hoch aufgeständerte Agri-PV-Module über einer Apfelanlage" }}
          action={{ label: "Agri-PV kennenlernen", href: "/agri-pv" }}
        />
      </Section>

      <TechnikSystem
        id="dach"
        eyebrow="Dach-Check & Technik"
        title="Stalldächer sind besondere Dächer."
        lead="Holzdachstühle, Stallklima und Heulager stellen andere Anforderungen als eine Gewerbehalle. Statik, Eindeckung, Brandschutz und Netzanschluss prüfen wir vor jedem Hofprojekt – und binden Speicher und Notstrom so ein, dass der Hof auch bei Netzausfall weiterläuft."
        fakten={[
          { wert: "B 1991-1-3", label: "ÖNORM Schneelast je Zone" },
          { wert: "R 11-1", label: "OVE-Richtlinie Brandschutz" },
          { wert: "20 kW", label: "bis dahin in der Regel nur Anzeige (ElWG)" },
        ]}
        knoten={{
          erzeugung: { titel: "Stall- & Hallendach", text: "ammoniakbeständige Module" },
          zusatz: { titel: "Speicher & Notstrom", text: "Melken, Kühlen, Lüften, Tränke" },
          netz: { titel: "Netzbetreiber", text: "oft Niederspannung am Ortsrand" },
          leitwarte: { titel: "Monitoring", text: "Ertrag, Eigenverbrauch, Störungen" },
        }}
        texte={{
          parkregler: "Für große Hof- und Agri-PV-Anlagen: Einspeiselimit und Blindleistung nach Vorgabe des Netzbetreibers – wichtig bei knapper Netzkapazität im ländlichen Raum.",
          fernwartung: "Störungen erkennen und beheben, oft ohne Anfahrt – auch mitten in der Erntezeit.",
          scada: "Erzeugung, Eigenverbrauch und Speicher im Blick – mit Daten für Kammer, Steuerberatung und Förderstelle.",
        }}
        bild={{ src: "/Images/AT/loesungen-a/lw-scheune-pv.jpg", alt: "" }}
      />

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Ablauf" title="Vom Hofbesuch zur laufenden Anlage" className="mb-12" />
        <AblaufLeiste
          items={[
            { icon: ClipboardList, title: "Hofbesuch & Potenzial", text: "Dächer, Verbrauch, Zählpunkte und Netzanschluss aufnehmen – mit erster Ertrags- und Eigenverbrauchsschätzung." },
            { icon: HandCoins, title: "Wirtschaftlichkeit & Steuer", text: "Eigenverbrauch, Speicher und Einspeisung transparent verglichen – als Grundlage für Kammer und Steuerberatung." },
            { icon: FileCheck2, title: "Förderung, Genehmigung & Netz", text: "Förderantrag vor Inbetriebnahme, Anzeige oder Netzzugangsantrag, Abstimmung mit Gemeinde und Versicherung." },
            { icon: LineChart, title: "Montage & Monitoring", text: "Montage mit Rücksicht auf Stallbetrieb und Erntezeiten, danach Überwachung und Wartung." },
          ]}
        />
      </Section>

      <Section tone="sand" space="md" id="fachdetails">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Für Betrieb, Kammer & Steuerberatung" title="Dach, Steuer, Rechenweg und Unterlagen" />
          <div className="flex lg:justify-end">
            <StandPille>Stand 09/2026</StandPille>
          </div>
        </div>
        <FachTabs
          tabs={[
            { id: "dach-check", label: "Dach-Check" },
            { id: "steuer", label: "Steuer & Pauschalierung" },
            { id: "wirtschaftlichkeit", label: "Beispielrechnung" },
            { id: "unterlagen", label: "Unterlagen" },
          ]}
        >
          <div>
            <h3 className="ov-h3 text-ink-900">Diese Punkte prüfen wir vor jedem Hofprojekt</h3>
            <Prosa className="mt-6">
              <ul className="grid gap-x-10 gap-y-3 xl:grid-cols-2">
                <li><strong>Statik und Schneelast:</strong> Nachweis nach ÖNORM B 1991-1-3 für die Schneelast am Hof; ältere Dachstühle brauchen oft eine Verstärkung. Den Wert zeigt vorab der <Link href="/standort-check">Standort-Check</Link>.</li>
                <li><strong>Eindeckung:</strong> Restlaufzeit von Trapezblech, Sandwichpaneel oder Ziegel; Asbestzement darf nicht bearbeitet werden und muss vorher saniert werden.</li>
                <li><strong>Stallklima:</strong> ammoniakbeständige Module und Unterkonstruktion, Wechselrichter und Speicher außerhalb der Stallluft.</li>
                <li><strong>Brandschutz:</strong> Leitungsführung abseits von Heu- und Strohlagern, Abschaltkonzept und Feuerwehrplan nach OVE-Richtlinie R 11-1 – Details im Ratgeber <Link href="/ratgeber/photovoltaik-brandschutz">Photovoltaik und Brandschutz</Link>.</li>
                <li><strong>Netzanschluss:</strong> Viele Höfe hängen an einem Niederspannungsstrang am Ortsrand. Der Netzbetreiber prüft, wie viel eingespeist werden darf; bis 20 kW genügt nach ElWG in der Regel eine Anzeige.</li>
              </ul>
            </Prosa>
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">Nebenbetrieb oder Gewerbebetrieb – die Verwendung entscheidet.</h3>
            <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Wie eine PV-Anlage am Hof steuerlich behandelt wird, hängt davon ab, ob der Strom überwiegend im eigenen land- und forstwirtschaftlichen
              Betrieb verbraucht oder überwiegend verkauft wird.
            </p>
            <Prosa className="mt-6">
              <ul className="grid gap-x-10 gap-y-3 xl:grid-cols-2">
                <li><strong>Überschusseinspeiser mit überwiegendem Eigenverbrauch im Betrieb:</strong> in der Regel land- und forstwirtschaftlicher Nebenbetrieb; bei Umsatzsteuerpauschalierung kann auch der eingespeiste Überschuss pauschal behandelt werden.</li>
                <li><strong>Volleinspeiser oder überwiegender Verkauf:</strong> eigener Gewerbebetrieb mit eigener Gewinnermittlung und Umsatzsteuer.</li>
                <li><strong>Einkommensteuerbefreiung:</strong> Einspeisung bis 12.500 kWh pro Jahr bei höchstens 35 kWp und 25 kVA (§ 3 Abs. 1 Z 39 EStG) für natürliche Personen.</li>
                <li><strong>Umsatzsteuer:</strong> Der Nullsteuersatz für kleine PV-Anlagen ist mit 31. März 2025 ausgelaufen – der Vorsteuerabzug ist wieder ein Thema der Kalkulation.</li>
                <li><strong>Investitionsfreibetrag:</strong> nur bei Buchführung oder Einnahmen-Ausgaben-Rechnung, nicht bei Pauschalierung.</li>
              </ul>
              <p>
                Die Landwirtschaftskammern informieren laufend zu diesen Fragen, etwa unter{" "}
                <a href="https://www.lko.at" target="_blank" rel="noopener noreferrer">lko.at</a>. Einen Überblick für Unternehmen gibt unser Ratgeber{" "}
                <Link href="/ratgeber/photovoltaik-steuern">Photovoltaik und Steuern in Österreich</Link>.
              </p>
            </Prosa>
            <Hinweis className="mt-8" titel="Keine Steuerberatung">
              Wir liefern Ihnen und Ihrer Steuerberatung die technischen Grundlagen – Verbrauchsaufteilung, Einspeisemengen, Investitions- und
              Förderdaten. Die steuerliche Gestaltung klären Sie bitte vor der Bestellung.
            </Hinweis>
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">50 kWp mit Speicher auf einem Milchviehbetrieb</h3>
            <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Ein Rechenbeispiel mit offengelegten Annahmen – kein Angebot. Entscheidend sind Ihr Verbrauchsprofil und die steuerliche Einordnung.
            </p>
            <Tabelle
              className="mt-6"
              dicht
              caption="Beispielrechnung Photovoltaik mit Speicher auf einem Milchviehbetrieb"
              spalten={[
                { key: "pos", label: "Position", breite: "w-[30%]" },
                { key: "wert", label: "Annahme / Rechnung" },
                { key: "ergebnis", label: "Ergebnis", breite: "w-[20%]", className: "font-semibold text-ink-900" },
              ]}
              zeilen={BEISPIEL}
              fuss="Beispiel, Stand 09/2026. Annahmen: Standort Alpenvorland, 1.100 kWh/kWp (Richtwert), vermiedene Bezugskosten 20 ct/kWh netto inkl. Netzentgelten Netzebene 7 und Abgaben, Einspeisung 6 ct/kWh, Investitionskosten als Marktannahme (kein Ökovolt-Preis), EAG-Zuschuss nur bei Zuschlag. Nicht enthalten: Steuerwirkung, Dachsanierung, Finanzierung, Preissteigerungen."
            />
            <Hebel
              className="mt-8"
              cols={3}
              items={[
                { icon: Zap, titel: "Eigenverbrauch", text: "Jede selbst genutzte kWh spart Energiepreis, Netzentgelte und Abgaben – mehr als dreimal so viel wie die Einspeisung bringt." },
                { icon: Users, titel: "Energiegemeinschaft", text: "Überschuss an Nachbarn oder die Gemeinde weitergeben – mit reduzierten Netzentgelten für die Abnehmer." },
                { icon: HandCoins, titel: "Förderung", text: "EAG-Zuschuss für PV und Speicher, Landes- und Gemeindeförderungen – im Förder-Check auf einen Blick." },
              ]}
            />
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">Diese Unterlagen beschleunigen die Planung</h3>
            <ul className="mt-6 grid gap-3 text-[15.5px] text-ink-700 md:grid-cols-2">
              {[
                "Stromrechnungen der letzten 12 Monate (Betrieb, Wohnhaus, weitere Zählpunkte)",
                "Lastgang aus dem Smart-Meter-Portal des Netzbetreibers, falls vorhanden",
                "Fotos oder Pläne der Dächer, Baujahr und Art der Eindeckung",
                "Lage des Hausanschlusses bzw. der nächsten Trafostation",
                "Geplante Verbraucher: Melkroboter, Wärmepumpe, E-Hoflader, Trocknung",
                "Angaben zur Gewinnermittlung (pauschaliert oder buchführend)",
              ].map((t) => (
                <li key={t} className="flex gap-3 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
                  <Zap aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </FachTabs>
      </Section>

      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen vor der Planung" />
            <p className="mt-10 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Selbst rechnen & vorsorgen</p>
            <RechnerLeiste
              className="mt-4"
              kompakt
              mini
              spaltenKlasse="grid-cols-1 sm:grid-cols-2 lg:grid-cols-1"
              items={[
                { icon: ShieldAlert, titel: "Blackout-Rechner", text: "", href: "/rechner/blackout" },
                { icon: Users, titel: "Energiegemeinschafts-Rechner", text: "", href: "/rechner/energiegemeinschaft" },
                { icon: BadgeEuro, titel: "Förder-Check", text: "", href: "/foerdercheck" },
                { icon: ShieldAlert, titel: "Ratgeber Blackout-Vorsorge", text: "", href: "/ratgeber/blackout-vorsorge-unternehmen" },
                { icon: Flame, titel: "Ratgeber Brandschutz", text: "", href: "/ratgeber/photovoltaik-brandschutz" },
              ]}
            />
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Passende Themen für Ihren Betrieb" />

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Wir kommen auf Ihren Hof."
        text="Erstbewertung vor Ort oder per Video – mit ersten Zahlen zu Dach, Speicher, Eigenverbrauch, Förderung und Wirtschaftlichkeit."
        primary={{ label: v.cta, href: "/termin?art=vor-ort" }}
        secondary={{ label: "Anfrage starten", href: "/angebot", icon: Cog }}
      />

      <Bildnachweis items={nachweise("hofStalldaecher", "hofLuftbild", "stall", "scheune", "batteriespeicher", "foulum", "kressbronn")} />
    </div>
  );
}
