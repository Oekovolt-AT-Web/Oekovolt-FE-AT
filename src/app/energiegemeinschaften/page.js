import Link from "next/link";
import {
  ClipboardList,
  Cog,
  FileSignature,
  Gauge,
  Landmark,
  LineChart,
  Network,
  Receipt,
  Scale,
  Sun,
  Table2,
  Users,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hebel, Hinweis, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import KennzahlenBand from "@/components/Loesungen/B/KennzahlenBand";
import FotoBento from "@/components/Loesungen/B/FotoBento";
import FachTabs from "@/components/Loesungen/B/FachTabs";
import Rechenbeleg from "@/components/Loesungen/B/Rechenbeleg";
import DunkelSektion from "@/components/Loesungen/B/DunkelSektion";
import EnergieFluss from "@/components/Loesungen/B/EnergieFluss";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/energiegemeinschaften";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Energiegemeinschaften EEG, BEG & GEA in Österreich | Ökovolt";
const BESCHREIBUNG =
  "Energiegemeinschaften in Österreich nach ElWG: EEG, BEG und GEA im Vergleich, Netzentgelt-Rabatt, Rechtsform und Ablauf – mit PV-Anlage von Ökovolt.";
const HERO_BILD = "/Images/AT/loesungen-b/eg-daecher-pv.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1920, height: 1258 }] },
};

const FAQ = [
  {
    q: "Was ist der Unterschied zwischen EEG, BEG und GEA?",
    a: "Eine Erneuerbare-Energie-Gemeinschaft (EEG) teilt erneuerbare Energie im lokalen oder regionalen Nahbereich und bringt ihren Mitgliedern reduzierte Netzentgelte sowie den Entfall von Elektrizitätsabgabe und Erneuerbaren-Förderbeitrag. Eine Bürgerenergiegemeinschaft (BEG) darf Strom aus beliebigen Quellen österreichweit teilen und steht auch großen Unternehmen offen, hat aber diese Abgabenvorteile nicht. Eine gemeinschaftliche Erzeugungsanlage (GEA) versorgt mehrere Teilnehmer im selben Gebäude oder an derselben Hauptleitung.",
  },
  {
    q: "Wie viel sparen Mitglieder bei den Netzentgelten?",
    a: "Für Strom, der innerhalb einer EEG erzeugt und zugeordnet wird, reduziert sich der Arbeitspreis des Netznutzungsentgelts im Lokalbereich um 57 %, im Regionalbereich auf Netzebene 6 und 7 um 28 % und auf Netzebene 4 und 5 um 64 %. Die Reduktion gilt nur für die zugeordnete Menge. Ab 1. Jänner 2027 stellt eine neue Netzentgeltverordnung das System um; die künftigen Prozentsätze legt die E-Control fest.",
  },
  {
    q: "Was ändert sich mit dem Elektrizitätswirtschaftsgesetz (ElWG)?",
    a: "Das ElWG (BGBl. I Nr. 91/2025) ordnet die gemeinsame Energienutzung neu. Die Bestimmungen gelten ab 1. Oktober 2026; bestehende EEG, BEG und GEA werden automatisch übergeleitet. Neu sind unter anderem Peer-to-Peer-Verträge und Eigenversorgungsanlagen über mehrere Standorte, Lieferantenpflichten ab bestimmten Anlagengrößen und Regeln für Gemeinden und große Unternehmen. Ab 5. Oktober 2026 starten die neuen Modelle innerhalb eines Netzbetreibers, netzübergreifend ab April 2027.",
  },
  {
    q: "Dürfen Unternehmen an einer Energiegemeinschaft teilnehmen?",
    a: "Kleine und mittlere Unternehmen dürfen an EEG und BEG teilnehmen, als Erzeuger und als Abnehmer. Große Unternehmen (ab 250 Beschäftigten bzw. über 50 Mio. € Umsatz) dürfen nach ElWG nur an Bürgerenergiegemeinschaften und Peer-to-Peer-Verträgen teilnehmen, nicht an EEG. Für Erzeugungsanlagen von großen Unternehmen und Dritten gilt in der gemeinsamen Nutzung eine Leistungsgrenze von 6 MW.",
  },
  {
    q: "Welche Rechtsform braucht eine Energiegemeinschaft?",
    a: "EEG und BEG brauchen eine eigene Rechtspersönlichkeit, meist einen Verein oder eine Genossenschaft, teils auch eine GmbH. Gewinnerzielung darf nicht im Vordergrund stehen, das muss sich aus Statuten oder Organisationsform ergeben. Eine GEA kommt auch mit einem Vertrag zwischen den Teilnehmern aus. Welche Form passt, hängt von Größe, Mitgliederkreis und Investitionsvolumen ab.",
  },
  {
    q: "Welche Voraussetzungen brauchen die Mitglieder?",
    a: "Jedes Mitglied braucht einen Smart Meter mit Viertelstundenwerten und muss der Datenübermittlung zustimmen. Für EEG gilt zusätzlich der Nahbereich: Lokal hängen alle am selben Trafo (Netzebene 6/7), regional am selben Umspannwerk (Netzebene 4/5) desselben Netzbetreibers. Welche Zählpunkte in Frage kommen, kann der Netzbetreiber beantworten.",
  },
  {
    q: "Was müssen Gemeinden beachten?",
    a: "Gemeinden dürfen als Mitglied, Gründerin oder Anlagenbetreiberin auftreten. Betreibt eine Gebietskörperschaft Erzeugungsanlagen in der gemeinsamen Nutzung, muss sie nach ElWG schutzbedürftigen Haushalten den Zugang zu mindestens 10 % der jährlich erzeugten Energie ermöglichen; Preise und Bedingungen legt sie selbst fest. Dazu kommen Vergaberecht und Gemeindeordnung bei Investitionen.",
  },
  {
    q: "Welche Rolle übernimmt Ökovolt?",
    a: "Wir planen und bauen die Erzeugungsanlagen, klären mit Ihnen das passende Modell und den Nahbereich, stimmen Netzanschluss und Messkonzept mit dem Netzbetreiber ab und binden ein Abrechnungssystem über spezialisierte Partner an. Die Gründung selbst begleiten wir fachlich; Rechts- und Steuerberatung leisten wir nicht. Für Wartung und Monitoring sind wir über die gesamte Laufzeit da.",
  },
  {
    q: "Wo gibt es unabhängige Informationen?",
    a: "Die Österreichische Koordinationsstelle für Energiegemeinschaften bietet unter energiegemeinschaften.gv.at Leitfäden, Musterverträge und FAQ zum ElWG. Jedes Bundesland hat zusätzlich eine Anlaufstelle, in Oberösterreich zum Beispiel den OÖ Energiesparverband.",
  },
];

const VERGLEICH = [
  { kriterium: "Rechtsgrundlage", eeg: "EAG / ab 1.10.2026 ElWG", beg: "ElWOG / ab 1.10.2026 ElWG", gea: "ElWOG / ab 1.10.2026 ElWG" },
  { kriterium: "Teilnehmer", eeg: "Private, Gemeinden, KMU – keine großen Unternehmen", beg: "alle, auch große Unternehmen", gea: "Teilnehmer an derselben Hauptleitung (z. B. Mehrparteienhaus, Gewerbepark)" },
  { kriterium: "Energie", eeg: "nur erneuerbar – Strom, Wärme, Gas", beg: "nur Strom, jede Quelle", gea: "Strom aus der gemeinsamen Anlage" },
  { kriterium: "Räumlich", eeg: "lokal (Trafo, NE 6/7) oder regional (Umspannwerk, NE 4/5)", beg: "österreichweit", gea: "Gebäude bzw. Hauptleitung" },
  { kriterium: "Netzentgelt (Arbeitspreis)", eeg: "lokal − 57 %; regional − 28 % (NE 6/7) bzw. − 64 % (NE 4/5)", beg: "bis Ende 2026 keine Reduktion; ab 2027 nach neuer Verordnung im Nahbereich", gea: "zugeordneter Strom nutzt das öffentliche Netz nicht" },
  { kriterium: "Elektrizitätsabgabe & Erneuerbaren-Förderbeitrag", eeg: "entfallen für den Gemeinschaftsstrom", beg: "fallen an", gea: "Elektrizitätsabgabe befreit (Eigenerzeugung aus Erneuerbaren)" },
  { kriterium: "Organisation", eeg: "Verein, Genossenschaft, GmbH u. a.; kein Gewinnzweck im Vordergrund", beg: "wie EEG", gea: "Vertrag oder juristische Person" },
  { kriterium: "Typischer Einsatz", eeg: "Gemeinde mit Haushalten und Betrieben im Ort", beg: "Unternehmensverbund, landesweite Initiativen", gea: "Mehrparteienhaus, Bürogebäude, Einkaufszentrum" },
];

// Für den interaktiven Energiefluss: dieselben Aussagen wie in der Vergleichstabelle
const FLUSS_KRITERIEN = ["Teilnehmer", "Räumlich", "Netzentgelt (Arbeitspreis)", "Elektrizitätsabgabe & Erneuerbaren-Förderbeitrag", "Typischer Einsatz"];
const FLUSS_LABEL = { "Netzentgelt (Arbeitspreis)": "Netzentgelt", "Elektrizitätsabgabe & Erneuerbaren-Förderbeitrag": "Abgaben" };
const FAKTEN = Object.fromEntries(
  ["eeg", "beg", "gea"].map((m) => [m, VERGLEICH.filter((z) => FLUSS_KRITERIEN.includes(z.kriterium)).map((z) => ({ label: FLUSS_LABEL[z.kriterium] || z.kriterium, wert: z[m] }))])
);

const ERSPARNIS = [
  { pos: "Bezug aus der EEG", wert: "Haushalt, Netzebene 7 nicht gemessen, Netzbereich Oberösterreich", ergebnis: "3.000 kWh/Jahr" },
  { pos: "Arbeitspreis Netznutzung", wert: "6,29 ct/kWh laut SNE-V 2026", ergebnis: "–" },
  { pos: "Reduktion lokal (57 %)", wert: "6,29 ct × 57 % ≈ 3,59 ct/kWh × 3.000 kWh", ergebnis: "≈ 107,55 €/Jahr", hervorheben: true },
  { pos: "Reduktion regional (28 %)", wert: "6,29 ct × 28 % ≈ 1,76 ct/kWh × 3.000 kWh", ergebnis: "≈ 52,85 €/Jahr" },
  { pos: "Entfall Elektrizitätsabgabe", wert: "2026 für Haushalte 0,1 ct/kWh, regulär 1,5 ct/kWh", ergebnis: "3 bis 45 €/Jahr" },
  { pos: "Energiepreis", wert: "vereinbart die EEG selbst – oft zwischen Einspeise- und Lieferpreis", ergebnis: "je nach EEG" },
];

const ZEITPLAN = [
  { d: "24.12.2025", t: "ElWG teilweise in Kraft (Günstiger-Strom-Gesetz)" },
  { d: "1.10.2026", t: "Neue Regeln zur gemeinsamen Energienutzung gelten" },
  { d: "5.10.2026", t: "Neue Modelle starten – vorerst innerhalb eines Netzbetreibers" },
  { d: "1.1.2027", t: "Neue Netzentgeltverordnung mit Reduktionen je Nahbereich" },
  { d: "April 2027", t: "Umsetzung über mehrere Netzgebiete bzw. österreichweit" },
];

export default async function EnergiegemeinschaftenPage({ searchParams }) {
  const v = zielgruppenVariante("energiegemeinschaften", await searchParams);

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Energiegemeinschaften in Österreich: Planung und PV-Anlagen"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Gemeinden, Unternehmen, Landwirtschaft, Private"
        bild={HERO_BILD}
        leistungen={["Modellwahl EEG, BEG, GEA", "Planung und Bau der Erzeugungsanlagen", "Messkonzept und Abstimmung mit dem Netzbetreiber", "Anbindung eines Abrechnungssystems über Partner", "Wartung und Monitoring"]}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Energiegemeinschaften" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Mehrere Wohnhäuser mit Photovoltaikanlagen auf den Satteldächern vor blauem Himmel", position: "70% 40%" }}
        actions={[
          { label: v.cta, href: "/termin?art=video&thema=energiegemeinschaft" },
          { label: "Anlage anfragen", href: "/angebot", icon: Sun },
        ]}
        points={["EEG, BEG, GEA & P2P", "Neue Regeln ab 1. Oktober 2026", "Nahbereich & Netzbetreiber geklärt", "Anlage, Messkonzept, Abrechnung"]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-36"
      />

      <KennzahlenBand
        items={[
          { wert: 57, prefix: "− ", suffix: " %", label: "Arbeitspreis Netznutzung für EEG-Strom im Lokalbereich (Netzebene 6/7)" },
          { wert: 28, prefix: "− ", suffix: " %", label: "im Regionalbereich auf Netzebene 6/7 (− 64 % auf Netzebene 4/5)" },
          { text: "1.10.2026", label: "Neue Regeln zur gemeinsamen Energienutzung nach ElWG treten in Kraft" },
          { wert: 10, suffix: " %", label: "der Erzeugung von Gemeinde-Anlagen müssen schutzbedürftigen Haushalten zugänglich sein" },
        ]}
        quelle="Quellen: Österreichische Koordinationsstelle für Energiegemeinschaften (energiegemeinschaften.gv.at, FAQ zum ElWG); Systemnutzungsentgelte-Verordnung (E-Control); Elektrizitätswirtschaftsgesetz, BGBl. I Nr. 91/2025."
      />

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Grundlagen"
          title="Was eine Energiegemeinschaft ist – in einem Satz"
          text={[
            "Eine Energiegemeinschaft ist ein Zusammenschluss von mindestens zwei Teilnehmenden, die Strom gemeinsam erzeugen, speichern, verbrauchen und untereinander verkaufen – über das öffentliche Netz und mit Vorteilen bei Netzentgelten und Abgaben.",
          ]}
          image={{ src: "/Images/AT/loesungen/freiflaeche-spitalberg-kaernten.jpg", alt: "Photovoltaik-Freiflächenanlage am Spitalberg in Kärnten" }}
        >
          <Prosa className="mt-5 text-[16px]">
            <p>
              <strong>Seit 2021</strong> ermöglicht das Erneuerbaren-Ausbau-Gesetz Erneuerbare-Energie-Gemeinschaften (EEG) und Bürgerenergiegemeinschaften (BEG); gemeinschaftliche Erzeugungsanlagen (GEA) in Gebäuden gibt es seit 2017.
              Österreich zählt inzwischen mehrere tausend solcher Gemeinschaften – aktuelle Zahlen veröffentlicht die Koordinationsstelle unter{" "}
              <a href="https://energiegemeinschaften.gv.at" target="_blank" rel="noopener noreferrer">energiegemeinschaften.gv.at</a>.
            </p>
            <p>
              <strong>Mit dem Elektrizitätswirtschaftsgesetz (ElWG)</strong> werden die Regeln neu geordnet: Die Bestimmungen zur gemeinsamen Energienutzung gelten ab 1. Oktober 2026, bestehende Gemeinschaften werden automatisch
              übergeleitet. Neu hinzu kommen Peer-to-Peer-Verträge – Verkauf oder Weitergabe von erneuerbarem Strom zwischen Marktteilnehmern – und Eigenversorgungsanlagen, mit denen sich ein Kunde über mehrere eigene Standorte
              versorgt.
            </p>
          </Prosa>
          <StandPille className="mt-6">Rechtsstand 09/2026</StandPille>
        </SplitMedia>

        {/* Zeitleiste ElWG */}
        <div className="mt-16 md:mt-20">
          <p className="mb-6 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Zeitplan ElWG</p>
          <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            <span aria-hidden="true" className="absolute left-0 right-0 top-[11px] hidden h-px bg-gradient-to-r from-ov-300 via-ov-400 to-ov-200 lg:block" />
            {ZEITPLAN.map((z, i) => (
              <Reveal as="li" key={z.d} delay={i * 90} className="relative lg:pt-9">
                <span aria-hidden="true" className="absolute left-0 top-[5px] hidden h-3.5 w-3.5 rounded-full bg-white ring-4 ring-ov-500 lg:block" />
                <div className="h-full rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                  <p className="font-display text-[19px] font-extrabold tracking-tight text-ink-900">{z.d}</p>
                  <p className="mt-1.5 text-[14.5px] leading-snug text-ink-600">{z.t}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <DunkelSektion
        id="vergleich"
        eyebrow="Vergleich"
        title="EEG, BEG und GEA im direkten Vergleich"
        lead="Die Wahl des Modells entscheidet über Teilnehmerkreis, Reichweite und finanzielle Vorteile. Sie muss vor der Registrierung feststehen, weil je Modell eigene Marktpartner-Kennungen vergeben werden."
      >
        <Reveal dir="scale">
          <EnergieFluss fakten={FAKTEN} />
        </Reveal>
        <p className="mt-5 text-[12.5px] leading-relaxed text-white/45">
          Schematische Darstellung. Netzentgeltreduktionen laut Systemnutzungsentgelte-Verordnung in der bis Ende 2026 geltenden Fassung; ab 2027 legt die E-Control neue Sätze fest. Die vollständige Vergleichstabelle finden Sie in den
          Fachdetails.
        </p>
      </DunkelSektion>

      <Section tone="white" space="lg" id="zielgruppen">
        <SectionHeading eyebrow="Wer mitmacht" title="Gemeinden, Betriebe und Haushalte – jede Rolle hat eigene Regeln" className="mb-12" />
        <FotoBento
          items={[
            { bild: "/Images/AT/ratgeber/photovoltaik-gemeinde.jpg", alt: "Gemeindeamt mit Photovoltaikanlage auf dem Dach", tag: "Initiator", titel: "Gemeinden als Initiatoren", text: "Dächer von Schule, Bauhof und Kläranlage liefern Strom für Bürgerinnen und Betriebe. Bei eigenen Anlagen: mindestens 10 % der Erzeugung für schutzbedürftige Haushalte zugänglich machen.", href: "/kommunen" },
            { bild: "/Images/AT/loesungen-b/speicher-industriedach-pv.jpg", alt: "Luftbild eines Hallendachs mit Photovoltaik", titel: "Betriebe als Erzeuger", text: "Überschüsse vom Hallendach an Mitarbeitende, Nachbarbetriebe oder die Gemeinde verkaufen. KMU in EEG und BEG, große Unternehmen nur in BEG und Peer-to-Peer.", href: "/gewerbe" },
            { bild: "/Images/AT/loesungen-b/speicher-produktionshalle.jpg", alt: "Helle Produktionshalle", titel: "Betriebe als Abnehmer", text: "Regionaler Grünstrom mit reduzierten Netzentgelten – gut für Energiekosten und Nachhaltigkeitsbericht." },
            { bild: "/Images/AT/loesungen/agri-pv-obstbau.jpg", alt: "Hoch aufgeständerte Agri-PV über einer Obstanlage", titel: "Landwirtschaft", text: "Große Hofdächer und Agri-PV als Erzeuger für die Gemeinschaft im Ort.", href: "/landwirtschaft" },
            { bild: "/Images/Home/download-1.jpg", alt: "Einfamilienhaus mit Photovoltaikanlage auf dem Dach", titel: "Haushalte", text: "Mitglieder mit oder ohne eigene Anlage; Smart Meter mit Viertelstundenwerten und Datenfreigabe sind Voraussetzung." },
            { bild: "/Images/AT/ratgeber/gemeinschaftliche-erzeugungsanlage.jpg", alt: "Mehrparteien-Wohnhaus in Wien", titel: "Mehrparteienhaus & Gewerbepark", text: "Gemeinschaftliche Erzeugungsanlage im Gebäude – ohne Nutzung des öffentlichen Netzes für den zugeordneten Strom." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg" id="vorteile">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Wirtschaftliche Vorteile"
              title="Was ein Mitglied konkret spart"
              lead="Mitglieder einer EEG sparen einen Teil der Netzentgelte und Abgaben auf den Strom, den sie aus der Gemeinschaft beziehen. Den Energiepreis selbst legt die Gemeinschaft fest."
            />
            <Prosa className="mt-8 text-[16px]">
              <p>
                <strong>Für Erzeuger</strong> – Betriebe, Landwirte, Gemeinden – liegt der Vorteil im Verkaufspreis: Die Gemeinschaft kann Strom zu einem Preis abnehmen, der über dem Marktpreis für Überschusseinspeisung liegt und
                für die Mitglieder trotzdem unter ihrem Lieferpreis. Nicht zugeordneter Überschuss wird weiter eingespeist und vermarktet, etwa über <Link href="/service/direktvermarktung">Reststromvermarktung</Link>.
              </p>
            </Prosa>
          </div>
          <Reveal delay={120}>
            <Rechenbeleg
              titel="Haushalt in einer EEG, Oberösterreich"
              caption="Beispiel Ersparnis eines Haushalts in einer Erneuerbare-Energie-Gemeinschaft"
              zeilen={ERSPARNIS}
              fuss="Beispiel, Stand 09/2026. Netznutzungsentgelt Netzebene 7 (nicht gemessene Leistung) Netzbereich Oberösterreich laut SNE-V 2018 – Novelle 2026, BGBl. II Nr. 305/2025. Zusätzlich entfällt der Erneuerbaren-Förderbeitrag auf den Gemeinschaftsstrom. Ab 2027 ändern sich Netzentgeltstruktur und Reduktionssätze."
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="white" space="md" id="oekovolt">
        <SectionHeading eyebrow="Unsere Rolle" title="Was Ökovolt für Ihre Energiegemeinschaft übernimmt" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: ClipboardList, title: "Modell & Konzept", text: "Welche Anlagen, welche Mitglieder, welcher Nahbereich – wir rechnen Erzeugung, Verbrauch und Zuordnung durch." },
            { icon: Sun, title: "Anlage & Netz", text: "Planung und Bau der PV-Anlagen, Speicher und Netzanschluss – inklusive Messkonzept mit dem Netzbetreiber." },
            { icon: FileSignature, title: "Abrechnung über Partner", text: "Anbindung eines spezialisierten Abrechnungssystems, das Viertelstundendaten über EDA verarbeitet." },
            { icon: LineChart, title: "Betrieb & Monitoring", text: "Wartung, Leitwarte und Kennzahlen zu Erzeugung und Deckungsgrad für Vorstand und Mitglieder." },
          ]}
        />
        <Hinweis className="mx-auto mt-12 max-w-3xl" titel="Keine Rechts- oder Steuerberatung">
          Statuten, Verträge und steuerliche Fragen klären Sie mit Ihrer Rechts- und Steuerberatung. Musterverträge und kostenlose Beratung bietet die Österreichische Koordinationsstelle für Energiegemeinschaften sowie die Anlaufstelle
          Ihres Bundeslands.
        </Hinweis>
      </Section>

      <Section tone="sand" space="lg" id="gruendung" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Für Vorstand, Gemeinde & Technik"
          title="Die Fachdetails – kompakt nachgeschlagen"
          lead="Die vollständige Vergleichstabelle, Rechtsform und Gründung Schritt für Schritt sowie weiterführende Themen."
          className="mb-10"
        />
        <FachTabs
          tabs={[
            {
              id: "tabelle",
              label: "Vergleichstabelle",
              icon: <Table2 />,
              inhalt: (
                <Tabelle
                  dicht
                  caption="Vergleich Erneuerbare-Energie-Gemeinschaft, Bürgerenergiegemeinschaft und gemeinschaftliche Erzeugungsanlage"
                  spalten={[
                    { key: "kriterium", label: "Kriterium", breite: "w-[19%]" },
                    { key: "eeg", label: "EEG" },
                    { key: "beg", label: "BEG" },
                    { key: "gea", label: "GEA" },
                  ]}
                  zeilen={VERGLEICH}
                  fuss="Quellen: energiegemeinschaften.gv.at (Energiegemeinschaften, FAQ zum ElWG, Detailwissen); Leitfaden 2026 Land Oberösterreich, Kapitel Gemeinsame Energienutzung; USP, Elektrizitätsabgabe. Netzentgeltreduktionen laut Systemnutzungsentgelte-Verordnung in der bis Ende 2026 geltenden Fassung; ab 2027 legt die E-Control neue Sätze fest. Peer-to-Peer-Verträge und Eigenversorgungsanlagen sind nicht dargestellt."
                />
              ),
            },
            {
              id: "gruendung",
              label: "Rechtsform & Gründung",
              icon: <Scale />,
              inhalt: (
                <div>
                  <div className="max-w-3xl">
                    <h3 className="ov-h3 text-ink-900">Von der Idee zur laufenden Gemeinschaft</h3>
                    <p className="mt-4 text-[16px] leading-relaxed text-ink-600">
                      Eine Energiegemeinschaft braucht eine Rechtsform, einen geklärten Nahbereich, eine Registrierung beim Netzbetreiber und eine saubere Abrechnung. Der Datenaustausch mit dem Netzbetreiber läuft elektronisch über
                      die Plattform für den energiewirtschaftlichen Datenaustausch (EDA).
                    </p>
                  </div>
                  <Hebel
                    className="mt-8"
                    cols={3}
                    items={[
                      { icon: Users, titel: "Verein", text: "Am häufigsten: schnell gegründet, geringe Kosten, ideal für Gemeinde- und Nachbarschaftsgemeinschaften." },
                      { icon: Network, titel: "Genossenschaft", text: "Für größere Gemeinschaften mit gemeinsamer Investition; Mitgliedsanteile, Prüfung durch einen Revisionsverband." },
                      { icon: Receipt, titel: "GmbH", text: "Für Gemeinden, Stadtwerke oder Unternehmen als Träger; Gewinnerzielung darf nicht im Vordergrund stehen." },
                    ]}
                  />
                  <Prosa className="mt-8 max-w-4xl">
                    <ol>
                      <li><strong>Modell und Nahbereich klären:</strong> EEG, BEG oder GEA; beim Netzbetreiber erfragen, welche Zählpunkte am selben Trafo oder Umspannwerk hängen.</li>
                      <li><strong>Gründen:</strong> Statuten, Organe, Beitritts- und Stromlieferbedingungen, Aufteilungsschlüssel (statisch oder dynamisch).</li>
                      <li><strong>Registrieren:</strong> Anmeldung beim Netzbetreiber, Marktpartner-Kennung, Anbindung an den Datenaustausch über EDA.</li>
                      <li><strong>Mitglieder aufnehmen:</strong> Smart Meter mit Viertelstundenwerten, Zustimmung zur Datenübermittlung, Zuordnung der Zählpunkte.</li>
                      <li><strong>Abrechnen:</strong> monatlich oder jährlich über ein Abrechnungssystem; ab 30 kW (Haushalte) bzw. 100 kW (andere) Erzeugungsleistung gelten nach § 69 ElWG Lieferantenpflichten wie allgemeine Bedingungen und Informationsblätter.</li>
                    </ol>
                    <p>
                      Details im Ratgeber <Link href="/ratgeber/energiegemeinschaft-gruenden">Energiegemeinschaft gründen</Link>, für Unternehmen im Ratgeber{" "}
                      <Link href="/ratgeber/energiegemeinschaft-gewerbe">Energiegemeinschaften für Gewerbe</Link> und zur GEA im Ratgeber{" "}
                      <Link href="/ratgeber/gemeinschaftliche-erzeugungsanlage">gemeinschaftliche Erzeugungsanlage</Link>.
                    </p>
                  </Prosa>
                </div>
              ),
            },
            {
              id: "weiter",
              label: "Smart Meter, Gemeinden & ElWG",
              icon: <Gauge />,
              inhalt: (
                <div className="grid gap-5 md:grid-cols-3">
                  {[
                    { icon: Gauge, titel: "Smart Meter & Daten", text: "Viertelstundenwerte sind Pflicht – Hintergrund zur Opt-in-Freigabe im Ratgeber.", href: "/ratgeber/smart-meter-pflicht" },
                    { icon: Landmark, titel: "Gemeinden & Länder", text: "Energiegemeinschaft der Gemeinde, Vergabe und Bürgerbeteiligung.", href: "/kommunen" },
                    { icon: Cog, titel: "ElWG im Überblick", text: "Was das neue Elektrizitätswirtschaftsgesetz für Anlagenbetreiber ändert.", href: "/ratgeber/elwg-elektrizitaetswirtschaftsgesetz" },
                  ].map((k) => (
                    <Link key={k.titel} href={k.href} className="group ov-card-hover flex flex-col rounded-3xl bg-white p-7 ring-1 ring-ink-200/70 hover:ring-ov-200">
                      <k.icon aria-hidden="true" className="h-6 w-6 text-ov-600" />
                      <h3 className="ov-h3 mt-5 text-ink-900">{k.titel}</h3>
                      <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">{k.text}</p>
                    </Link>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen vor der Gründung" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Gründung, Gewerbe und Recht" />

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Planen wir die Anlage für Ihre Energiegemeinschaft."
        text="Erstgespräch per Video: Modell, Nahbereich, Anlagengröße, Mitgliederstruktur und Abrechnung – für Gemeinden, Betriebe und Initiativen."
        primary={{ label: v.cta, href: "/termin?art=video&thema=energiegemeinschaft" }}
        secondary={{ label: "Ersparnis berechnen", href: "/rechner/energiegemeinschaft" }}
      />

      <Bildnachweis
        items={[
          { motiv: "Häuser mit PV", urheber: "Budget Bizar", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/solar-panels-on-buildings-roofs-16427010/" },
          { motiv: "Industriedach mit PV", urheber: "Giant Asparagus", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/aerial-view-of-rooftop-solar-panel-installation-35691079/" },
          { motiv: "Produktionshalle", urheber: "Freek Wolsink", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/modern-industrial-warehouse-interior-with-machinery-34207364/" },
          { motiv: "Agri-PV Kressbronn", urheber: "Lisamiri", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Agri-PV-Anlage_Kressbronn.jpg" },
          { motiv: "Gemeindeamt Fresach mit PV", urheber: "Naturpuur", lizenz: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Photovoltaik_Anlage_am_Dach_des_Gemeindeamtes_in_Fresach,_K%C3%A4rnten,_%C3%96sterreich.jpg" },
          { motiv: "PV-Freifläche Spitalberg, Kärnten", urheber: "Naturpuur", lizenz: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Photovoltaik-Anlage_am_Spitalberg_(498_m_%C3%BC.A.),_K%C3%A4rnten_01.jpg" },
          { motiv: "Gemeindebau Wien-Penzing", urheber: "Haeferl", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Wien-Penzing_-_Gemeindebau_H%C3%BCdoStr_252_-_2.jpg" },
        ]}
      />
    </div>
  );
}
