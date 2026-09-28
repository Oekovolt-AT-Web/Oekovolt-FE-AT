// service/direktvermarktung/page.js – Reststromvermarktung & Direktvermarktung in Österreich
//
// Österreich-Fassung: statischer, belegter Inhalt (EAG, ÖSG-Marktpreis, ElWG,
// Gebotszone AT). Die frühere Backend-Anbindung (deutsche Inhalte zu EEG und
// Marktprämienmodell nach deutschem Recht) wird hier bewusst nicht mehr genutzt.

import {
  Ban,
  Building2,
  CalendarCheck2,
  Cable,
  Calculator,
  FileSignature,
  Gauge,
  Handshake,
  Landmark,
  LineChart,
  Receipt,
  Share2,
  SlidersHorizontal,
  Sun,
  TrendingUp,
} from "lucide-react";

import Link from "next/link";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import LivePreisKarte from "@/components/EnergieLive/LivePreisKarte";
import { Hinweis, Kurzantwort, Punkte, Quellen, Tabelle, Verweise } from "@/components/Technik/Bausteine";
import { JsonLd, seitenMeta, seitenSchema } from "@/components/Technik/seite";
import { getEnergySnapshot } from "@/lib/energy";

export const revalidate = 900;

const PFAD = "/service/direktvermarktung";
const TITEL = "Reststromvermarktung & Direktvermarktung AT | Ökovolt";
const BESCHREIBUNG =
  "Reststromvermarktung in Österreich: OeMAG-Marktpreis, Einspeisetarif, Direktvermarkter, EAG-Marktprämie und PPA im Vergleich – mit Spotpreis AT und Parkregler.";

export const metadata = seitenMeta({
  pfad: PFAD,
  titel: TITEL,
  beschreibung: BESCHREIBUNG,
  keywords: ["Reststromvermarktung", "Überschusseinspeisung Österreich", "OeMAG Marktpreis", "Direktvermarktung Österreich", "EAG Marktprämie", "PPA Photovoltaik Österreich", "Einspeisetarif Gewerbe"],
});

const OPTIONEN = [
  [
    "OeMAG-Marktpreis",
    "Anlagen auf Basis erneuerbarer Energie mit Engpassleistung unter 500 kW(p)",
    "Monatlich rückwirkend festgelegt aus mengengewichteten Day-Ahead-Preisen; Obergrenze Quartalsmarktpreis nach § 41 ÖSG 2012, Untergrenze 60 % davon, jeweils abzüglich Ausgleichsenergieaufwand",
    "Vertrag bis längstens 31.12.2030; nach 12 Monaten Mindesteinspeisedauer mit 4 Wochen zum Monatsletzten kündbar",
    "Einspeisezählpunkt; keine Fernsteuerung durch die OeMAG",
  ],
  [
    "Einspeisetarif eines Energieversorgers",
    "Meist kleinere bis mittlere Anlagen; Bedingungen je Anbieter",
    "Fixpreis oder an Börse bzw. OeMAG-Marktpreis gekoppelt; teils an einen Strombezugsvertrag gebunden",
    "Je Vertrag – Kündigungsfristen und Preisanpassung prüfen",
    "Meist wie bei der OeMAG; bei größeren Anlagen teils Fernsteuerbarkeit",
  ],
  [
    "Direktvermarkter / Stromhändler",
    "Alle Größen, ab 500 kW(p) der übliche Weg",
    "Spot- bzw. Marktwert-indexiert minus Vermarktungsentgelt, oder Fixpreise für Teilmengen; Prognose- und Ausgleichsenergiekosten sind eingepreist",
    "Meist 1 bis 3 Jahre, individuell",
    "Viertelstundenmessung, Fernsteuerbarkeit (Abregelung bei negativen Preisen), Datenübergabe",
  ],
  [
    "EAG-Marktprämie",
    "PV-Anlagen mit Zuschlag in einer Ausschreibung der EAG-Förderabwicklungsstelle",
    "Erlös am Markt plus gleitende Prämie: anzulegender Wert (Gebotswert) minus Referenzmarktwert; bei negativen Preisen über 6 aufeinanderfolgende Stunden entfällt die Prämie für diesen Zeitraum",
    "20 Jahre ab Inbetriebnahme",
    "Vermarktung über einen Stromhändler; Fernsteuerbarkeit praktisch notwendig",
  ],
  [
    "PPA vor Ort (Direktleitung)",
    "Strom an Nachbarbetrieb, Mieter oder Tochtergesellschaft ohne Weg über das öffentliche Netz",
    "Vertraglich fixierter Preis, meist unter dem Bezugspreis des Abnehmers",
    "Langfristig, typischerweise an die Nutzungsdauer gekoppelt",
    "Messkonzept und Direktleitung nach § 64 ElWG; Regelung am Netzanschlusspunkt",
  ],
  [
    "PPA über das Netz (bilanziell)",
    "Größere Anlagen und Portfolios; Abnehmer mit Nachhaltigkeitszielen",
    "Fixpreis oder Preisformel, Profil „wie erzeugt“ oder strukturiert; Herkunftsnachweise inklusive",
    "Mehrjährig",
    "Viertelstundenwerte, Prognose, Bilanzgruppenzuordnung, oft Fernsteuerbarkeit",
  ],
  [
    "Energiegemeinschaft / gemeinsame Energienutzung",
    "Betriebe, Gemeinden, Landwirte und Private in räumlicher Nähe (EEG) oder österreichweit (BEG)",
    "Intern vereinbarter Preis je kWh; bei lokalen und regionalen EEG reduzierte Netzentgelte für die Teilnehmer",
    "Nach Statuten bzw. Vertrag",
    "Smart Meter mit Viertelstundenwerten; Datenaustausch über die Netzbetreiber",
  ],
];

const GROESSEN = [
  [
    "bis ca. 20 kWp Überschuss",
    "Eigenverbrauch maximieren; Überschuss über OeMAG-Marktpreis oder Einspeisetarif eines Energieversorgers",
    "Aufwand für Direktvermarktung meist höher als der Mehrerlös",
  ],
  [
    "20 bis 500 kWp",
    "OeMAG-Marktpreis als Basis, Angebote von Energieversorgern und Direktvermarktern vergleichen; Speicher und Energiegemeinschaft prüfen",
    "Ab hier lohnen sich Viertelstundendaten und ein Parkregler, der bei negativen Preisen abregeln kann",
  ],
  [
    "ab 500 kWp",
    "Direktvermarkter, PPA oder EAG-Marktprämie über Ausschreibung – die OeMAG-Marktpreis-Abnahme steht nicht offen",
    "Fernsteuerbarkeit, Prognose und saubere Datenübergabe sind Voraussetzung; Parkregler und SCADA gehören zur Grundausstattung",
  ],
];

const FAQ = [
  {
    q: "Was bedeutet Reststromvermarktung?",
    a: "Reststromvermarktung ist der Verkauf des Solarstroms, den ein Betrieb nicht selbst verbraucht – also der Überschuss, der ins öffentliche Netz fließt. In Österreich stehen dafür vor allem die Abnahme durch die OeMAG zum Marktpreis, Einspeisetarife von Energieversorgern, Direktvermarkter, Stromlieferverträge (PPA), die EAG-Marktprämie und Energiegemeinschaften zur Wahl.",
  },
  {
    q: "Wer kann an die OeMAG zum Marktpreis verkaufen?",
    a: "Laut OeMAG steht die Marktpreis-Abnahme allen Anlagen auf Basis erneuerbarer Energie mit einer Engpassleistung unter 500 kW(p) offen, bei Photovoltaik bezogen auf die Modulspitzenleistung. Voraussetzung sind unter anderem eine Netzzusage mit Einspeisezählpunkt und die nötigen Anzeigen und Bewilligungen. Verträge laufen bis längstens 31.12.2030 und können nach 12 Monaten Mindesteinspeisedauer mit vier Wochen Frist zum Monatsletzten gekündigt werden.",
  },
  {
    q: "Wie wird der OeMAG-Marktpreis berechnet?",
    a: "Die OeMAG legt den Preis monatlich rückwirkend fest, auf Basis der mengengewichteten Day-Ahead-Preise. Er liegt höchstens beim Quartalsmarktpreis nach § 41 ÖSG 2012 und mindestens bei 60 % davon, jeweils abzüglich der durchschnittlichen Aufwendungen für Ausgleichsenergie. Die aktuellen Monatswerte veröffentlicht die OeMAG auf ihrer Website.",
  },
  {
    q: "Was passiert bei negativen Strompreisen?",
    a: "An der Börse zahlt, wer in Stunden mit negativem Preis einspeist. Bei der EAG-Marktprämie entfällt die Prämie für den gesamten Zeitraum, wenn der Preis sechs oder mehr aufeinanderfolgende Stunden negativ ist. Direktvermarkter regeln deshalb in solchen Stunden ab – das setzt eine fernsteuerbare Anlage voraus. Auch der OeMAG-Marktpreis sinkt, weil er sich aus den Börsenpreisen ableitet. Eigenverbrauch und Speicher sind in diesen Stunden die wirtschaftlichste Verwendung.",
  },
  {
    q: "Brauche ich für die Direktvermarktung einen Parkregler?",
    a: "Direktvermarkter verlangen in der Regel, dass sie die Einspeisung reduzieren können – etwa bei negativen Preisen. Bei einer einzelnen kleinen Anlage kann das über den Wechselrichter gehen. Sobald mehrere Wechselrichter, ein Speicher oder ein Einspeiselimit des Netzbetreibers im Spiel sind, braucht es einen Parkregler, der alle Vorgaben am Netzanschlusspunkt zusammenführt. Vorgaben des Netzbetreibers haben dabei immer Vorrang.",
  },
  {
    q: "Was ist der Unterschied zwischen Marktprämie und Investitionszuschuss?",
    a: "Der EAG-Investitionszuschuss fördert die Errichtung einmalig; der Strom wird danach frei vermarktet. Die EAG-Marktprämie fördert dagegen die eingespeiste Energie über 20 Jahre: Sie gleicht die Differenz zwischen dem im Zuschlag festgelegten anzulegenden Wert und dem Referenzmarktwert aus. Für Photovoltaik wird die Marktprämie über Ausschreibungen vergeben; die Termine veröffentlicht die EAG-Förderabwicklungsstelle.",
  },
  {
    q: "Wie verändert das ElWG die Vermarktung?",
    a: "Das Elektrizitätswirtschaftsgesetz ist am 24. Dezember 2025 in Kraft getreten; viele Details gelten stufenweise. Für die Vermarktung wichtig sind unter anderem das Recht auf einen Abnahme- und einen Aggregierungsvertrag, Direktleitungen nach § 64 für Stromlieferungen ohne öffentliches Netz, die erweiterte gemeinsame Energienutzung ab 1. Oktober 2026 und die Spitzenkappung nach § 101 für neue PV-Anlagen. Ab 2027 kommt zudem ein kleiner Beitrag je eingespeister Kilowattstunde für Anlagen über 20 kW hinzu.",
  },
];

const QUELLEN = [
  { titel: "OeMAG: Marktpreis – Ermittlung, Bedingungen und Monatswerte", href: "https://www.oem-ag.at/marktpreis", hinweis: "§ 13 Abs. 3 iVm § 41 ÖSG 2012" },
  { titel: "EAG-Förderabwicklungsstelle: Förderkalender", href: "https://www.eag-abwicklungsstelle.at/foerderkalender/" },
  { titel: "EAG-Förderabwicklungsstelle: 2. Ausschreibung Marktprämie PV 2026 bezuschlagt", href: "https://www.eag-abwicklungsstelle.at/artikel/die-2-ausschreibung-zur-marktpraemie-fuer-pv-anlagen-wurde-mit-10-juli-2026-bezuschlagt/", hinweis: "Volumen 179.033 kWp, Höchstpreis 6,69 ct/kWh" },
  { titel: "Next Kraftwerke: Marktprämie in Österreich (EAG)", href: "https://www.next-kraftwerke.at/wissen/marktpraemie", hinweis: "Berechnung, 6-Stunden-Regel, Laufzeit" },
  { titel: "Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", href: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html" },
  { titel: "klimaaktiv: Das neue ElWG – Auswirkungen auf Unternehmen", href: "https://www.klimaaktiv.at/unternehmen/strategie/das-neue-elektrizitaetswirtschaftsgesetz-elwg-auswirkungen-auf-unternehmen" },
  { titel: "E-Control: Das neue ElWG und Konsument:innen (28.01.2026)", href: "https://www.e-control.at/documents/1785851/1811582/20260128_Webinar+ElWG+und+Konsumenten_V2.pdf/21dd7e4e-e4aa-dcc4-9e81-0d00766c2ca6?t=1769600935909", hinweis: "Abnahme- und Aggregierungsvertrag, gemeinsame Energienutzung" },
  { titel: "Energy-Charts (Fraunhofer ISE): Day-Ahead-Preise Gebotszone AT und Nettostromerzeugung Österreich", href: "https://www.energy-charts.info/?l=de&c=AT", hinweis: "CC BY 4.0; Grundlage der eigenen Auswertung 2025" },
];

function Fakt({ wert, label, icon: Icon, delay }) {
  return (
    <Reveal delay={delay} className="flex items-start gap-3 px-2 md:border-l md:border-ink-200 md:px-6 md:first:border-l-0 md:first:pl-0">
      <Icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-ov-600" />
      <div>
        <dt className="sr-only">{label}</dt>
        <dd className="font-display text-[20px] font-extrabold leading-tight tracking-tight text-ink-900 md:text-[24px]">{wert}</dd>
        <dd className="mt-1 text-[13px] leading-snug text-ink-500">{label}</dd>
      </div>
    </Reveal>
  );
}

export default async function ReststromvermarktungPage() {
  const snapshot = await getEnergySnapshot().catch(() => null);
  const kompakt = snapshot
    ? { stand: snapshot.stand, preis: { quelle: snapshot.preis.quelle, aufloesungMin: snapshot.preis.aufloesungMin, punkte: snapshot.preis.punkte } }
    : null;

  return (
    <div>
      <JsonLd
        daten={seitenSchema({
          pfad: PFAD,
          name: "Reststromvermarktung und Direktvermarktung von PV-Strom in Österreich",
          beschreibung: BESCHREIBUNG,
          service: {
            name: "Reststromvermarktung: Beratung, Technik und Umsetzung",
            serviceType: "Vermarktung von Überschussstrom aus Photovoltaik",
            beschreibung: "Vergleich von OeMAG-Marktpreis, Einspeisetarifen, Direktvermarktung, EAG-Marktprämie und PPA sowie technische Umsetzung mit Parkregler, Messung und SCADA.",
            audience: "Gewerbe, Industrie, Landwirtschaft, Gemeinden, Anlagenbetreiber",
          },
        })}
      />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Service" }, { name: "Reststromvermarktung" }]}
        eyebrow="Reststromvermarktung & Direktvermarktung · Österreich"
        title={
          <>
            Reststromvermarktung: <span className="ov-text-gradient-light">mehr aus jedem Überschuss</span>
          </>
        }
        lead="Was Ihr Betrieb nicht selbst verbraucht, lässt sich in Österreich auf mehreren Wegen verkaufen – an die OeMAG, an Energieversorger, über Direktvermarkter, per PPA oder in einer Energiegemeinschaft. Wir vergleichen die Optionen und bauen die Technik, die sie verlangen."
        actions={[
          { label: "Vermarktung prüfen lassen", href: "/termin?art=video" },
          { label: "Optionen vergleichen", href: "#vergleich", icon: Calculator },
        ]}
        points={["OeMAG, Energieversorger, Direktvermarkter", "EAG-Marktprämie & PPA", "Spotpreis AT live", "Parkregler für Abregelung"]}
      >
        <div className="ov-hero-in mt-12 max-w-md" style={{ "--ov-delay": "300ms" }}>
          <LivePreisKarte tone="dark" initial={kompakt} />
        </div>
      </PageHero>

      <Kurzantwort frage="Wie verkaufe ich überschüssigen PV-Strom in Österreich am besten?">
        <p>
          Für Anlagen unter 500 kWp ist die Abnahme durch die OeMAG zum Marktpreis die einfache Basis: kein Vermarktungsaufwand, monatlich
          kündbar nach einem Jahr. Größere Anlagen und Betriebe, die ihre Einspeisung steuern können, erzielen über Direktvermarkter, PPA oder
          die EAG-Marktprämie oft planbarere oder höhere Erlöse.
        </p>
        <p>
          Entscheidend ist fast immer dasselbe: möglichst viel selbst nutzen, in Stunden mit negativen Preisen nicht einspeisen – und dafür die
          Technik haben, die das automatisch regelt.
        </p>
      </Kurzantwort>

      {/* Fakten */}
      <section aria-label="Fakten zur Reststromvermarktung" className="border-b border-ink-200/70 bg-white">
        <dl className="ov-container grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:py-12">
          <Fakt icon={Receipt} wert="< 500 kWp" label="Grenze für die OeMAG-Marktpreis-Abnahme" delay={0} />
          <Fakt icon={Landmark} wert="seit 1.10.2018" label="eigene Gebotszone Österreich (AT)" delay={70} />
          <Fakt icon={Ban} wert="378 h" label="negative Day-Ahead-Stunden in AT 2025*" delay={140} />
          <Fakt icon={Sun} wert="≈ 50 %" label="Marktwert Solar 2025 im Verhältnis zum Durchschnittspreis*" delay={210} />
        </dl>
        <p className="ov-container -mt-4 pb-8 text-[12.5px] leading-relaxed text-ink-500">
          * Eigene Auswertung der Day-Ahead-Preise der Gebotszone AT und der österreichischen PV-Erzeugung 2025 (Energy-Charts, Fraunhofer ISE,
          CC BY 4.0): Stundenmittel unter null; solargewichteter Preis rund 49 €/MWh gegenüber einem Durchschnitt von rund 99 €/MWh. Rund ein
          Fünftel der PV-Erzeugung fiel in Stunden mit negativem Preis.
        </p>
      </section>

      {/* Optionen */}
      <Section tone="white" space="lg" id="optionen" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Optionen in Österreich"
          title="Sieben Wege, Reststrom zu verkaufen"
          lead="Die Wege schließen sich nicht immer aus: Ein Betrieb kann zum Beispiel einen Teil über eine Energiegemeinschaft abgeben und den Rest über die OeMAG oder einen Direktvermarkter vermarkten. Welche Kombination passt, hängt von Größe, Lastgang und Risikobereitschaft ab."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Receipt, title: "OeMAG-Marktpreis", text: "Abnahme für Anlagen unter 500 kWp zum monatlichen Marktpreis nach ÖSG 2012 – ohne Prognose- und Vermarktungsaufwand." },
            { icon: Building2, title: "Einspeisetarif eines Energieversorgers", text: "Fix- oder indexierte Tarife von Landesversorgern und Stromhändlern, teils an den Strombezug gekoppelt." },
            { icon: TrendingUp, title: "Direktvermarkter", text: "Verkauf am Spotmarkt über einen Stromhändler – mit Vermarktungsentgelt, Prognose und Abregelung bei negativen Preisen." },
            { icon: Landmark, title: "EAG-Marktprämie", text: "Gleitende Prämie über 20 Jahre für PV-Anlagen mit Zuschlag in der Ausschreibung." },
            { icon: Handshake, title: "PPA vor Ort und über das Netz", text: "Langfristiger Liefervertrag mit einem Abnehmer – über eine Direktleitung nach § 64 ElWG oder bilanziell über das Netz." },
            { icon: Share2, title: "Energiegemeinschaft", text: "Strom an Mitglieder einer EEG oder BEG abgeben; ab 1. Oktober 2026 erweitert das ElWG die gemeinsame Energienutzung." },
          ]}
        />
      </Section>

      {/* Vergleichstabelle */}
      <Section tone="sand" space="lg" id="vergleich" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Vergleich"
          title="Reststromvermarktung im Vergleich: Preislogik, Bindung, Technik"
          lead="Die Tabelle zeigt die Mechanik der Optionen, keine Preise – die ändern sich monatlich. Konkrete Angebote vergleichen wir für Ihre Anlage auf Basis von Erzeugungsprofil und Eigenverbrauch."
          className="mb-10"
        />
        <Tabelle
          caption="Optionen für die Vermarktung von PV-Überschussstrom in Österreich"
          kopf={["Option", "Für wen", "Preislogik", "Laufzeit & Bindung", "Technik"]}
          zeilen={OPTIONEN}
          kompakt
          minBreite={1040}
          quelle="Stand September 2026. Quellen: OeMAG (Marktpreis), EAG-Förderabwicklungsstelle, ElWG. Bedingungen von Energieversorgern und Direktvermarktern unterscheiden sich im Detail – Vertragsprüfung im Einzelfall."
        />
      </Section>

      {/* Spotpreis AT */}
      <Section tone="white" space="lg" id="spotpreis" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Spotpreis Gebotszone AT"
              title="Der Börsenpreis bestimmt fast jeden Erlös – auch indirekt"
              lead="Ob OeMAG-Marktpreis, indexierter Einspeisetarif oder Direktvermarktung: am Ende hängt der Erlös am Day-Ahead-Preis der Gebotszone Österreich."
            />
            <div className="mt-8 space-y-4 text-[16px] leading-relaxed text-ink-600">
              <p>
                Österreich bildet seit 1. Oktober 2018 eine eigene Gebotszone; davor gab es eine gemeinsame Preiszone mit Deutschland und
                Luxemburg. Seit 1. Oktober 2025 wird der europäisch gekoppelte Day-Ahead-Markt in Viertelstunden gehandelt. Die Preise für den
                Folgetag stehen nach der Auktion zu Mittag fest.
              </p>
              <p>
                Für Photovoltaik entscheidend ist nicht der Durchschnittspreis, sondern der Preis zu den Stunden, in denen sie einspeist. Weil
                viele Anlagen gleichzeitig erzeugen, liegt der solargewichtete Preis deutlich unter dem Mittel – in unserer Auswertung für 2025
                bei etwa der Hälfte.
              </p>
            </div>
          </div>
          <Reveal dir="right" className="space-y-4">
            <LivePreisKarte initial={kompakt} />
            <Hinweis ton="achtung" titel="Negative Preise sind kein Randthema mehr">
              <p>
                2025 lag der Day-Ahead-Preis in Österreich in 378 Stunden im Stundenmittel unter null, 2026 bis Ende September bereits in rund 260
                Stunden (eigene Auswertung, Energy-Charts). Wer in diesen Stunden einspeist, verschenkt Strom oder zahlt drauf.
              </p>
            </Hinweis>
          </Reveal>
        </div>
      </Section>

      {/* Technik */}
      <Section tone="navy" space="lg" className="overflow-hidden" id="technik">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-10 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Fernsteuerbarkeit, Parkregler, SCADA"
            title="Vermarktung ist heute auch eine Regelungsaufgabe"
            lead="Direktvermarkter wollen abregeln können, Netzbetreiber setzen Einspeiselimits, der Betrieb will Eigenverbrauch und Speicher optimieren. Der Parkregler bringt alle Vorgaben am Netzanschlusspunkt in eine feste Reihenfolge."
          />
          <Punkte
            dunkel
            spalten={2}
            items={[
              { titel: "Klare Priorität", tag: "Regelkern", text: "Schutz und Netzbetreiber zuerst, dann Vermarktung, dann Eigenoptimierung – so sind Signale nie widersprüchlich." },
              { titel: "Abregelung bei negativen Preisen", tag: "Direktvermarkter", text: "Das Signal des Direktvermarkters senkt die Einspeisung am Netzanschlusspunkt – Eigenverbrauch und Speicherladung laufen weiter." },
              { titel: "Spitzenkappung", tag: "§ 101 ElWG", text: "Bei neuen oder erweiterten PV-Anlagen darf der Netzbetreiber die Einspeisung auf 70 % der Modulspitzenleistung begrenzen; der Regler verschiebt Spitzen in Speicher und Verbraucher." },
              { titel: "Daten für Abrechnung", tag: "SCADA", text: "Viertelstundenwerte, Abregelzeiten und Verfügbarkeit werden protokolliert – Basis für Prognose, Erlösabrechnung und Nachweise." },
            ]}
          />
        </div>
        <div className="relative mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/technik/parkregler" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
            Parkregler im Detail
          </Link>
          <Link href="/technik/scada" className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/35 transition-colors hover:bg-white/10">
            <LineChart aria-hidden="true" className="h-4 w-4" />
            SCADA & Reporting
          </Link>
        </div>
      </Section>

      {/* Entscheidungshilfe nach Größe */}
      <Section tone="white" space="lg" id="entscheidung" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Entscheidungshilfe"
          title="Welche Vermarktung passt zu welcher Anlagengröße?"
          lead="Faustregeln aus der Praxis – keine starren Grenzen. Den Ausschlag geben Überschussmenge, Lastgang, Speicher und wie viel Preisrisiko Sie tragen wollen."
          className="mb-10"
        />
        <Tabelle caption="Orientierung nach Überschuss bzw. Anlagengröße" kopf={["Größe", "Naheliegende Wege", "Worauf es ankommt"]} zeilen={GROESSEN} minBreite={720} />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Hinweis ton="info" titel="EAG-Marktprämie 2026">
            <p>
              Die zweite Ausschreibung für PV wurde am 10. Juli 2026 bezuschlagt – bei einem Volumen von 179.033 kWp wurden Gebote bis 6,69 ct/kWh
              berücksichtigt. Weitere Termine stehen im Förderkalender der EAG-Förderabwicklungsstelle.
            </p>
          </Hinweis>
          <Hinweis ton="norm" titel="Einspeisen kostet künftig einen kleinen Beitrag">
            <p>
              Mit dem ElWG kommt ab 1. Jänner 2027 ein Beitrag je eingespeister Kilowattstunde, nach oben mit 0,05 Cent gedeckelt; Anlagen bis 20
              kW sind ausgenommen. Für neue Einspeiser gelten gestaffelte Netzanschlusspauschalen je kW.
            </p>
          </Hinweis>
        </div>
      </Section>

      {/* Ablauf */}
      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ablauf" title="So setzen wir die Reststromvermarktung mit Ihnen um" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: Gauge, title: "Profil verstehen", text: "Erzeugung, Lastgang und Überschuss in Viertelstunden auswerten – inklusive Speicher- und Eigenverbrauchspotenzial." },
            { icon: Calculator, title: "Optionen rechnen", text: "OeMAG-Marktpreis, Angebote von Versorgern und Direktvermarktern, PPA oder Marktprämie nebeneinander – mit ehrlichem Preisrisiko." },
            { icon: Cable, title: "Technik herstellen", text: "Messung, Parkregler, Fernwirk- und Datenanbindung für Netzbetreiber und Vermarkter – dokumentiert und getestet." },
            { icon: FileSignature, title: "Wechsel & Betrieb", text: "Verträge abstimmen, Wechsel organisieren, Abregelungen und Erlöse im SCADA nachvollziehbar machen." },
          ]}
        />
        <p className="mx-auto mt-10 max-w-3xl text-center text-[14px] leading-relaxed text-ink-500">
          Wir sind kein Stromhändler und vermitteln keine Finanzprodukte. Wir beraten herstellerunabhängig, stellen die Technik bereit und begleiten
          den Vertragsabschluss mit dem Vermarktungspartner Ihrer Wahl.
        </p>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Reststromvermarktung in Österreich – kurz & belegt"
            lead="Rechts- und Förderlage Stand September 2026. Bei Ausschreibungen und Verträgen zählen die jeweils aktuellen Bedingungen."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Verweise
        ueberschrift="Weiterlesen"
        items={[
          { href: "/energie-live", titel: "Strompreis Österreich live", text: "Day-Ahead-Preis der Gebotszone AT, negative Preise und Erzeugungsmix." },
          { href: "/technik/parkregler", titel: "Parkregler (EZA-Regler)", text: "Abregelung, Einspeiselimit und Fernwirkanbindung am Netzanschlusspunkt." },
          { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Überschüsse speichern statt zu negativen Preisen einspeisen." },
          { href: "/energiegemeinschaften", titel: "Energiegemeinschaften", text: "EEG, BEG und gemeinsame Energienutzung nach ElWG." },
        ]}
      />

      <Quellen items={QUELLEN} />

      <CtaBand
        eyebrow="Reststromvermarktung"
        title="Welcher Weg bringt für Ihren Überschuss am meisten?"
        text="Schicken Sie uns Erzeugungs- und Lastgangdaten – wir vergleichen die Optionen für Ihre Anlage und sagen Ihnen, welche Technik dafür nötig ist."
        primary={{ label: "Vermarktung prüfen lassen", href: "/termin?art=video" }}
        secondary={{ label: "Anfrage senden", href: "/kontakt", icon: CalendarCheck2 }}
      />
    </div>
  );
}
