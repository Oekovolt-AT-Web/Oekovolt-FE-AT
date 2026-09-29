// service/direktvermarktung/page.js – Reststromvermarktung & Direktvermarktung in Österreich
//
// Österreich-Fassung: statischer, belegter Inhalt (EAG, ÖSG-Marktpreis, ElWG,
// Gebotszone AT). Die frühere Backend-Anbindung (deutsche Inhalte zu EEG und
// Marktprämienmodell nach deutschem Recht) wird hier bewusst nicht mehr genutzt.

import { Ban, Building2, Cable, Calculator, CalendarCheck2, FileSignature, Gauge, Landmark, LineChart, Receipt, Scale, Share2, SlidersHorizontal, Sun, TrendingUp } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import LivePreisKarte from "@/components/EnergieLive/LivePreisKarte";
import { Hinweis, Tabelle } from "@/components/Technik/Bausteine";
import { JsonLd, seitenMeta, seitenSchema } from "@/components/Technik/seite";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Kennzahlen from "@/components/ServiceAT/B/Kennzahlen";
import Dunkel from "@/components/ServiceAT/B/Dunkel";
import FotoBento from "@/components/ServiceAT/B/FotoBento";
import Bildband from "@/components/ServiceAT/B/Bildband";
import Fachdetails from "@/components/ServiceAT/B/Fachdetails";
import Tabs from "@/components/ServiceAT/B/Tabs";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import ErloesVergleich from "@/components/ServiceAT/B/ErloesVergleich";
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
  {
    id: "klein",
    label: "bis ca. 20 kWp Überschuss",
    wege: "Eigenverbrauch maximieren; Überschuss über OeMAG-Marktpreis oder Einspeisetarif eines Energieversorgers",
    worauf: "Aufwand für Direktvermarktung meist höher als der Mehrerlös",
  },
  {
    id: "mittel",
    label: "20 bis 500 kWp",
    wege: "OeMAG-Marktpreis als Basis, Angebote von Energieversorgern und Direktvermarktern vergleichen; Speicher und Energiegemeinschaft prüfen",
    worauf: "Ab hier lohnen sich Viertelstundendaten und ein Parkregler, der bei negativen Preisen abregeln kann",
  },
  {
    id: "gross",
    label: "ab 500 kWp",
    wege: "Direktvermarkter, PPA oder EAG-Marktprämie über Ausschreibung – die OeMAG-Marktpreis-Abnahme steht nicht offen",
    worauf: "Fernsteuerbarkeit, Prognose und saubere Datenübergabe sind Voraussetzung; Parkregler und SCADA gehören zur Grundausstattung",
  },
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

export default async function ReststromvermarktungPage() {
  const snapshot = await getEnergySnapshot().catch(() => null);
  const kompakt = snapshot
    ? { stand: snapshot.stand, preis: { quelle: snapshot.preis.quelle, aufloesungMin: snapshot.preis.aufloesungMin, punkte: snapshot.preis.punkte } }
    : null;

  return (
    <div>
      <Stil />
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

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "Reststromvermarktung" }]}
        eyebrow="Reststromvermarktung & Direktvermarktung · Österreich"
        title={
          <>
            Reststromvermarktung: <span className="ov-text-gradient-light">mehr aus jedem Überschuss</span>
          </>
        }
        lead="Was Ihr Betrieb nicht selbst verbraucht, lässt sich in Österreich auf mehreren Wegen verkaufen – an die OeMAG, an Energieversorger, über Direktvermarkter, per PPA oder in einer Energiegemeinschaft. Wir vergleichen die Optionen und bauen die Technik, die sie verlangen."
        image={{ src: "/Images/AT/service-b/hochspannung-abendrot.jpg", alt: "Hochspannungsmasten im Abendrot" }}
        ton="tief"
        points={["OeMAG, Energieversorger, Direktvermarkter", "EAG-Marktprämie & PPA", "Spotpreis AT live", "Parkregler für Abregelung"]}
        actions={[
          { label: "Vermarktung prüfen lassen", href: "/termin?art=video" },
          { label: "Erlöse vergleichen", href: "#erloese", icon: Calculator },
        ]}
        aside={<LivePreisKarte tone="dark" initial={kompakt} className="lg:ml-auto lg:max-w-sm" />}
      />

      <Kennzahlen
        frage="Wie verkaufe ich überschüssigen PV-Strom in Österreich am besten?"
        zahlen={[
          { text: "< 500 kWp", label: "Grenze für die OeMAG-Marktpreis-Abnahme" },
          { text: "1.10.2018", label: "seit dann eigene Gebotszone Österreich (AT)" },
          { value: 378, suffix: " h", label: "negative Day-Ahead-Stunden in AT 2025*" },
          { text: "≈ 50 %", label: "Marktwert Solar 2025 im Verhältnis zum Durchschnittspreis*" },
        ]}
        fussnote="* Eigene Auswertung der Day-Ahead-Preise der Gebotszone AT und der österreichischen PV-Erzeugung 2025 (Energy-Charts, Fraunhofer ISE, CC BY 4.0): Stundenmittel unter null; solargewichteter Preis rund 49 €/MWh gegenüber einem Durchschnitt von rund 99 €/MWh. Rund ein Fünftel der PV-Erzeugung fiel in Stunden mit negativem Preis."
      >
        <p>
          Für Anlagen unter 500 kWp ist die Abnahme durch die OeMAG zum Marktpreis die einfache Basis: kein Vermarktungsaufwand, monatlich kündbar nach einem Jahr. Größere Anlagen und
          Betriebe, die ihre Einspeisung steuern können, erzielen über Direktvermarkter, PPA oder die EAG-Marktprämie oft planbarere oder höhere Erlöse.
        </p>
        <p>
          <strong>Entscheidend ist fast immer dasselbe:</strong> möglichst viel selbst nutzen, in Stunden mit negativen Preisen nicht einspeisen – und dafür die Technik haben, die das
          automatisch regelt.
        </p>
      </Kennzahlen>

      {/* Erlösvergleich live */}
      <Dunkel id="erloese">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Spotpreis Gebotszone AT · live"
            title={
              <>
                Der Börsenpreis bestimmt fast jeden Erlös – <span className="ov-text-gradient-light">auch indirekt</span>
              </>
            }
          />
          <Reveal delay={100} className="space-y-4 text-[16px] leading-relaxed text-white/70">
            <p>
              Ob OeMAG-Marktpreis, indexierter Einspeisetarif oder Direktvermarktung: am Ende hängt der Erlös am Day-Ahead-Preis der Gebotszone Österreich. Seit 1. Oktober 2025 wird der
              europäisch gekoppelte Day-Ahead-Markt in Viertelstunden gehandelt; die Preise für den Folgetag stehen nach der Auktion zu Mittag fest.
            </p>
          </Reveal>
        </div>
        <Reveal dir="scale" className="mt-12">
          <ErloesVergleich initial={kompakt} />
        </Reveal>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Hinweis ton="dunkel" titel="Negative Preise sind kein Randthema mehr">
            <p>
              2025 lag der Day-Ahead-Preis in Österreich in 378 Stunden im Stundenmittel unter null, 2026 bis Ende September bereits in rund 260 Stunden (eigene Auswertung, Energy-Charts). Wer
              in diesen Stunden einspeist, verschenkt Strom oder zahlt drauf.
            </p>
          </Hinweis>
          <Hinweis ton="dunkel" titel="Solarwert statt Durchschnittspreis">
            <p>
              Für Photovoltaik zählt der Preis zu den Stunden, in denen sie einspeist. Weil viele Anlagen gleichzeitig erzeugen, liegt der solargewichtete Preis deutlich unter dem Mittel – in
              unserer Auswertung für 2025 bei etwa der Hälfte. Österreich bildet seit 1. Oktober 2018 eine eigene Gebotszone; davor gab es eine gemeinsame Preiszone mit Deutschland und
              Luxemburg.
            </p>
          </Hinweis>
        </div>
      </Dunkel>

      {/* Optionen */}
      <Section tone="white" space="lg" id="optionen" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Optionen in Österreich"
          title="Sieben Wege, Reststrom zu verkaufen"
          lead="Die Wege schließen sich nicht immer aus: Ein Betrieb kann zum Beispiel einen Teil über eine Energiegemeinschaft abgeben und den Rest über die OeMAG oder einen Direktvermarkter vermarkten."
          className="mb-12"
        />
        <FotoBento
          items={[
            {
              bild: { src: "/Images/AT/ratgeber/gemeinschaftliche-erzeugungsanlage.jpg", alt: "Photovoltaikanlage einer gemeinschaftlichen Erzeugungsanlage" },
              icon: TrendingUp,
              tag: "ab 500 kWp üblich",
              titel: "Direktvermarkter",
              text: "Verkauf am Spotmarkt über einen Stromhändler – mit Vermarktungsentgelt, Prognose und Abregelung bei negativen Preisen.",
            },
            { bild: { src: "/Images/AT/ratgeber/pv-gewerbe-dornbirn.jpg", alt: "Gewerbebetrieb mit Photovoltaik" }, icon: Receipt, titel: "OeMAG-Marktpreis", text: "Für Anlagen unter 500 kWp – ohne Prognose- und Vermarktungsaufwand." },
            { bild: { src: "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg", alt: "Solarcarport eines Betriebs" }, icon: Building2, titel: "Einspeisetarif eines Versorgers", text: "Fix oder indexiert, teils an den Strombezug gekoppelt." },
            { bild: { src: "/Images/AT/loesungen/freiflaeche-spitalberg-kaernten.jpg", alt: "Photovoltaik-Freiflächenanlage" }, icon: Landmark, titel: "EAG-Marktprämie", text: "Gleitende Prämie über 20 Jahre nach Zuschlag in der Ausschreibung." },
            { bild: { src: "/Images/AT/ratgeber/photovoltaik-gemeinde.jpg", alt: "Photovoltaik in einer Gemeinde" }, icon: Share2, titel: "PPA & Energiegemeinschaft", text: "Direktleitung nach § 64 ElWG, bilanzielles PPA oder EEG/BEG." },
          ]}
        />
      </Section>

      {/* Technik */}
      <Bildband
        rechts
        bild={{ src: "/Images/AT/ratgeber/eza-regler-parkregler.jpg", alt: "Schaltschrank mit Regelungstechnik für eine PV-Anlage" }}
        eyebrow="Fernsteuerbarkeit, Parkregler, SCADA"
        titel="Vermarktung ist heute auch eine Regelungsaufgabe"
        text="Direktvermarkter wollen abregeln können, Netzbetreiber setzen Einspeiselimits, der Betrieb will Eigenverbrauch und Speicher optimieren. Der Parkregler bringt alle Vorgaben am Netzanschlusspunkt in eine feste Reihenfolge."
        punkte={[
          { icon: SlidersHorizontal, titel: "Klare Priorität", text: "Schutz und Netzbetreiber zuerst, dann Vermarktung, dann Eigenoptimierung." },
          { icon: Ban, titel: "Abregelung bei negativen Preisen", text: "Das Signal des Direktvermarkters senkt die Einspeisung – Eigenverbrauch und Speicherladung laufen weiter." },
          { icon: Gauge, titel: "Spitzenkappung § 101 ElWG", text: "Begrenzung auf 70 % der Modulspitzenleistung möglich; Spitzen wandern in Speicher und Verbraucher." },
          { icon: LineChart, titel: "Daten für Abrechnung", text: "Viertelstundenwerte, Abregelzeiten und Verfügbarkeit im SCADA protokolliert." },
        ]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Button href="/technik/parkregler" icon={SlidersHorizontal}>
            Parkregler im Detail
          </Button>
          <Button href="/technik/scada" variant="outlineLight" icon={LineChart}>
            SCADA & Reporting
          </Button>
        </div>
      </Bildband>

      {/* Entscheidungshilfe */}
      <Section tone="sand" space="lg" id="entscheidung" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Entscheidungshilfe" title="Welche Vermarktung passt zu welcher Anlagengröße?" />
          <Reveal delay={100}>
            <p className="ov-lead text-ink-600">Faustregeln aus der Praxis – keine starren Grenzen. Den Ausschlag geben Überschussmenge, Lastgang, Speicher und wie viel Preisrisiko Sie tragen wollen.</p>
          </Reveal>
        </div>
        <Tabs
          label="Anlagengröße wählen"
          tabs={GROESSEN.map((g) => ({
            id: g.id,
            label: g.label,
            icon: <Sun />,
            inhalt: (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-navy-950 p-7 text-white md:p-8">
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Naheliegende Wege</p>
                  <p className="mt-3 font-display text-[20px] font-bold leading-snug md:text-[22px]">{g.wege}</p>
                </div>
                <div className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/70 md:p-8">
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Worauf es ankommt</p>
                  <p className="mt-3 text-[17px] leading-relaxed text-ink-700">{g.worauf}</p>
                </div>
              </div>
            ),
          }))}
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Hinweis ton="info" titel="EAG-Marktprämie 2026">
            <p>
              Die zweite Ausschreibung für PV wurde am 10. Juli 2026 bezuschlagt – bei einem Volumen von 179.033 kWp wurden Gebote bis 6,69 ct/kWh berücksichtigt. Weitere Termine stehen im
              Förderkalender der EAG-Förderabwicklungsstelle.
            </p>
          </Hinweis>
          <Hinweis ton="norm" titel="Einspeisen kostet künftig einen kleinen Beitrag">
            <p>
              Mit dem ElWG kommt ab 1. Jänner 2027 ein Beitrag je eingespeister Kilowattstunde, nach oben mit 0,05 Cent gedeckelt; Anlagen bis 20 kW sind ausgenommen. Für neue Einspeiser
              gelten gestaffelte Netzanschlusspauschalen je kW.
            </p>
          </Hinweis>
        </div>
      </Section>

      {/* Ablauf */}
      <Section tone="white" space="lg">
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
          Wir sind kein Stromhändler und vermitteln keine Finanzprodukte. Wir beraten herstellerunabhängig, stellen die Technik bereit und begleiten den Vertragsabschluss mit dem
          Vermarktungspartner Ihrer Wahl.
        </p>
      </Section>

      {/* Fachdetails + FAQ */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Häufige Fragen"
              title="Reststromvermarktung in Österreich – kurz & belegt"
              lead="Rechts- und Förderlage Stand September 2026. Bei Ausschreibungen und Verträgen zählen die jeweils aktuellen Bedingungen."
            />
            <Fachdetails
              className="mt-8"
              items={[
                {
                  titel: "Vergleichstabelle: Preislogik, Bindung, Technik",
                  kurz: "Sieben Optionen im Detail",
                  icon: Scale,
                  inhalt: (
                    <Tabelle
                      caption="Optionen für die Vermarktung von PV-Überschussstrom in Österreich"
                      kopf={["Option", "Für wen", "Preislogik", "Laufzeit & Bindung", "Technik"]}
                      zeilen={OPTIONEN}
                      kompakt
                      minBreite={1040}
                      quelle="Stand September 2026. Quellen: OeMAG (Marktpreis), EAG-Förderabwicklungsstelle, ElWG. Bedingungen von Energieversorgern und Direktvermarktern unterscheiden sich im Detail – Vertragsprüfung im Einzelfall."
                    />
                  ),
                },
              ]}
            />
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Abschluss
        links={[
          { href: "/energie-live", art: "Live", titel: "Strompreis Österreich live" },
          { href: "/technik/parkregler", art: "Technik", titel: "Parkregler (EZA-Regler)" },
          { href: "/gewerbespeicher", art: "Lösung", titel: "Gewerbespeicher" },
          { href: "/energiegemeinschaften", art: "Lösung", titel: "Energiegemeinschaften" },
          { href: "/service/stromtarif", art: "Service", titel: "Dynamischer Stromtarif" },
        ]}
        quellen={QUELLEN}
      />

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
