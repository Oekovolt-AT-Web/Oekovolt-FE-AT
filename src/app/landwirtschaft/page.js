import Link from "next/link";
import {
  BadgeEuro,
  BatteryCharging,
  CalendarCheck2,
  ClipboardList,
  Cog,
  FileCheck2,
  Flame,
  HandCoins,
  Egg,
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
import FeatureGrid from "@/components/ui/FeatureGrid";
import SplitMedia from "@/components/ui/SplitMedia";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Fachabschnitt, Hebel, Hinweis, Kennzahlen, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/landwirtschaft";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für die Landwirtschaft in Österreich | Ökovolt";
const BESCHREIBUNG =
  "PV auf Stall, Scheune und Maschinenhalle in Österreich: Speicher fürs Melken, Notstrom, Pauschalierung, EAG-Förderung und Agri-PV aus einer Hand.";
const HERO_BILD = "/Images/Referenzen/projekteBanner.jpg";

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
        breadcrumbs={[{ name: "Landwirtschaft" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Aufgeständerte Photovoltaikmodule auf einer Grünfläche unter blauem Himmel", position: "center 85%" }}
        actions={[
          { label: v.cta, href: "/termin?art=vor-ort" },
          { label: "Per Video beraten lassen", href: "/termin?art=video", icon: CalendarCheck2 },
        ]}
        points={["Stall, Scheune & Maschinenhalle", "Speicher & Notstrom fürs Melken", "Pauschalierung & Förderung geklärt", "Agri-PV mit 30 % Zuschlag"]}
      />

      <Kennzahlen
        items={[
          { wert: "150 €/kWh", label: "EAG-Zuschuss für Stromspeicher bis 50 kWh, gemeinsam mit PV (2026)" },
          { wert: "12.500 kWh", label: "Einspeisung pro Jahr einkommensteuerfrei (natürliche Personen, bis 35 kWp)" },
          { wert: "+ 30 %", label: "Förderzuschlag für Agri-PV nach EAG-Investitionszuschüsseverordnung" },
          { wert: "22 %", label: "Öko-IFB bis Ende 2026 – nur bei Buchführung oder Einnahmen-Ausgaben-Rechnung" },
        ]}
        quelle="Quellen: EAG-IZV 2026 laut Leitfaden Land Oberösterreich (Stand 06/2026); § 3 Abs. 1 Z 39 EStG; WKO (Investitionsfreibetrag)."
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Einsatzfelder"
          title="Wo Photovoltaik auf dem Hof am meisten bringt"
          lead="Ein landwirtschaftlicher Betrieb verbraucht Strom zu anderen Zeiten als ein Büro: früh und spät beim Melken, rund um die Uhr in Kühlung und Lüftung, saisonal bei Trocknung und Lagerung. Die Anlage muss dazu passen."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Warehouse, title: "Stall, Scheune & Maschinenhalle", text: "Große, meist unverschattete Dächer. Statik, Schneelast und Eindeckung prüfen wir vor Ort – bei Bedarf mit Dachsanierung." },
            { icon: Milk, title: "Milchvieh: Melken & Kühlen", text: "Melkroboter, Milchkühlung, Vakuumpumpen und Warmwasser laufen täglich – mit Speicher auch morgens und abends solar." },
            { icon: Egg, title: "Schweine & Geflügel", text: "Lüftung, Heizung und Fütterung erzeugen eine hohe Grundlast – ideal für hohen Eigenverbrauch über das ganze Jahr." },
            { icon: Wheat, title: "Trocknung & Lager", text: "Getreide- und Heutrocknung, Obstlager und Kühlräume verbrauchen saisonal viel Strom, oft genau im Sommer." },
            { icon: BatteryCharging, title: "Speicher & Notstrom", text: "Bei Netzausfall bleiben Melkanlage, Kühlung, Lüftung und Tränke versorgt – Tierwohl und Blackout-Vorsorge.", href: "/service/notstrom" },
            { icon: Sprout, title: "Agri-PV auf der Fläche", text: "Vertikal zwischen Grünland- und Ackerstreifen oder hoch über Obst und Beeren – mit 30 % Förderzuschlag.", href: "/agri-pv" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg" id="dach">
        <Fachabschnitt
          eyebrow="Dach-Check"
          title="Stalldächer sind besondere Dächer."
          lead="Holzdachstühle, Stallklima und Heulager stellen andere Anforderungen als eine Gewerbehalle. Diese Punkte prüfen wir vor jedem Hofprojekt."
        >
          <Prosa>
            <ul>
              <li><strong>Statik und Schneelast:</strong> Nachweis nach ÖNORM B 1991-1-3 für die Schneelastzone des Hofes; ältere Dachstühle brauchen oft eine Verstärkung. Die Zone zeigt vorab der <Link href="/standort-check">Standort-Check</Link>.</li>
              <li><strong>Eindeckung:</strong> Restlaufzeit von Trapezblech, Sandwichpaneel oder Ziegel; Asbestzement darf nicht bearbeitet werden und muss vorher saniert werden.</li>
              <li><strong>Stallklima:</strong> ammoniakbeständige Module und Unterkonstruktion, Wechselrichter und Speicher außerhalb der Stallluft.</li>
              <li><strong>Brandschutz:</strong> Leitungsführung abseits von Heu- und Strohlagern, Abschaltkonzept und Feuerwehrplan nach OVE-Richtlinie R 11-1 – Details im Ratgeber <Link href="/ratgeber/photovoltaik-brandschutz">Photovoltaik und Brandschutz</Link>.</li>
              <li><strong>Netzanschluss:</strong> Viele Höfe hängen an einem Niederspannungsstrang am Ortsrand. Der Netzbetreiber prüft, wie viel eingespeist werden darf; bis 20 kW genügt nach ElWG in der Regel eine Anzeige.</li>
            </ul>
          </Prosa>
        </Fachabschnitt>
      </Section>

      <Section tone="white" space="lg" id="steuer">
        <Fachabschnitt
          eyebrow="Steuer & Pauschalierung"
          title="Nebenbetrieb oder Gewerbebetrieb – die Verwendung entscheidet."
          lead="Wie eine PV-Anlage am Hof steuerlich behandelt wird, hängt davon ab, ob der Strom überwiegend im eigenen land- und forstwirtschaftlichen Betrieb verbraucht oder überwiegend verkauft wird."
          aside={<StandPille>Stand 09/2026</StandPille>}
        >
          <Prosa>
            <ul>
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
        </Fachabschnitt>
      </Section>

      <Section tone="green" space="lg" id="wirtschaftlichkeit">
        <SectionHeading
          eyebrow="Beispielrechnung"
          title="50 kWp mit Speicher auf einem Milchviehbetrieb"
          lead="Ein Rechenbeispiel mit offengelegten Annahmen – kein Angebot. Entscheidend sind Ihr Verbrauchsprofil und die steuerliche Einordnung."
          className="mb-10"
        />
        <Tabelle
          caption="Beispielrechnung Photovoltaik mit Speicher auf einem Milchviehbetrieb"
          spalten={[
            { key: "pos", label: "Position", breite: "w-[30%]" },
            { key: "wert", label: "Annahme / Rechnung" },
            { key: "ergebnis", label: "Ergebnis", breite: "w-[20%]", className: "font-semibold text-ink-900" },
          ]}
          zeilen={BEISPIEL}
          fuss="Beispiel, Stand 09/2026. Annahmen: Standort Alpenvorland, 1.100 kWh/kWp (Richtwert), vermiedene Bezugskosten 20 ct/kWh netto inkl. Netzentgelten Netzebene 7 und Abgaben, Einspeisung 6 ct/kWh, Investitionskosten als Marktannahme (kein Ökovolt-Preis), EAG-Zuschuss nur bei Zuschlag. Nicht enthalten: Steuerwirkung, Dachsanierung, Finanzierung, Preissteigerungen."
        />
        <div className="mt-10">
          <Hebel
            cols={3}
            items={[
              { icon: Zap, titel: "Eigenverbrauch", text: "Jede selbst genutzte kWh spart Energiepreis, Netzentgelte und Abgaben – mehr als dreimal so viel wie die Einspeisung bringt." },
              { icon: Users, titel: "Energiegemeinschaft", text: "Überschuss an Nachbarn oder die Gemeinde weitergeben – mit reduzierten Netzentgelten für die Abnehmer.", },
              { icon: HandCoins, titel: "Förderung", text: "EAG-Zuschuss für PV und Speicher, Landes- und Gemeindeförderungen – im Förder-Check auf einen Blick." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
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

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Vom Hofbesuch zur laufenden Anlage" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: ClipboardList, title: "Hofbesuch & Potenzial", text: "Dächer, Verbrauch, Zählpunkte und Netzanschluss aufnehmen – mit erster Ertrags- und Eigenverbrauchsschätzung." },
            { icon: HandCoins, title: "Wirtschaftlichkeit & Steuer", text: "Eigenverbrauch, Speicher und Einspeisung transparent verglichen – als Grundlage für Kammer und Steuerberatung." },
            { icon: FileCheck2, title: "Förderung, Genehmigung & Netz", text: "Förderantrag vor Inbetriebnahme, Anzeige oder Netzzugangsantrag, Abstimmung mit Gemeinde und Versicherung." },
            { icon: LineChart, title: "Montage & Monitoring", text: "Montage mit Rücksicht auf Stallbetrieb und Erntezeiten, danach Überwachung und Wartung." },
          ]}
        />
      </Section>

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Vorbereitung" title="Diese Unterlagen beschleunigen die Planung" className="mb-8" />
        <ul className="grid gap-3 text-[15.5px] text-ink-700 md:grid-cols-2">
          {[
            "Stromrechnungen der letzten 12 Monate (Betrieb, Wohnhaus, weitere Zählpunkte)",
            "Lastgang aus dem Smart-Meter-Portal des Netzbetreibers, falls vorhanden",
            "Fotos oder Pläne der Dächer, Baujahr und Art der Eindeckung",
            "Lage des Hausanschlusses bzw. der nächsten Trafostation",
            "Geplante Verbraucher: Melkroboter, Wärmepumpe, E-Hoflader, Trocknung",
            "Angaben zur Gewinnermittlung (pauschaliert oder buchführend)",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <Zap aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: ShieldAlert, t: "Blackout-Vorsorge", h: "/ratgeber/blackout-vorsorge-unternehmen" },
            { icon: Flame, t: "Brandschutz", h: "/ratgeber/photovoltaik-brandschutz" },
            { icon: BadgeEuro, t: "Förder-Check", h: "/foerdercheck" },
          ].map((k) => (
            <Link key={k.t} href={k.h} className="group ov-card-hover flex items-center gap-4 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60 hover:bg-white">
              <k.icon aria-hidden="true" className="h-6 w-6 text-ov-600" />
              <span className="font-display text-[17px] font-bold text-ink-900">{k.t}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Passende Themen für Ihren Betrieb" />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen vor der Planung" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Wir kommen auf Ihren Hof."
        text="Erstbewertung vor Ort oder per Video – mit ersten Zahlen zu Dach, Speicher, Eigenverbrauch, Förderung und Wirtschaftlichkeit."
        primary={{ label: v.cta, href: "/termin?art=vor-ort" }}
        secondary={{ label: "Anfrage starten", href: "/angebot", icon: Cog }}
      />

      <Bildnachweis
        items={[{ motiv: "Agri-PV-Anlage Kressbronn (Obstbau)", urheber: "Lisamiri", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Agri-PV-Anlage_Kressbronn.jpg" }]}
      />
    </div>
  );
}
