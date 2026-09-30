// /energiegemeinschaften/betriebe-gemeinden – Rollen von Betrieben und Gemeinden in EEG, BEG, P2P und GEA nach ElWG.
// Rechtsstand 30.09.2026. Quellen (abgerufen 30.09.2026) stehen unten in QUELLEN und sichtbar auf der Seite.
// Teilnahme-Logik: src/lib/egBetriebe.js (Test: node scripts/eg-betriebe.test.mjs).

import Link from "next/link";
import { ArrowUpRight, Building2, Calculator, ClipboardCheck, FileSignature, Gauge, Handshake, Landmark, Network, Scale, Search, Sun, Users } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hebel, Hinweis, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import KennzahlenBand from "@/components/Loesungen/B/KennzahlenBand";
import FachTabs from "@/components/Loesungen/B/FachTabs";
import DunkelSektion from "@/components/Loesungen/B/DunkelSektion";
import RollenCheck from "@/components/EGBetriebe/RollenCheck";
import Checkliste from "@/components/EGBetriebe/Checkliste";
import NahebereichStufen from "@/components/EGBetriebe/NahebereichStufen";
import { rechnerLink } from "@/lib/egBetriebe";
import { BASE_URL } from "@/lib/site";

const PFAD = "/energiegemeinschaften/betriebe-gemeinden";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Energiegemeinschaft für Unternehmen & Gemeinden | Ökovolt";
const BESCHREIBUNG =
  "Energiegemeinschaft für Unternehmen und Gemeinden nach ElWG: wer in EEG, BEG und P2P darf, 6-MW- und 10-%-Regel, Netzentgelt lokal/regional und Checkliste.";
const HERO_BILD = "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg";
const ABRUF = "30.09.2026";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  keywords: [
    "Energiegemeinschaft Betrieb",
    "Energiegemeinschaft Gemeinde",
    "Energiegemeinschaft Unternehmen ElWG",
    "Bürgerenergiegemeinschaft große Unternehmen",
    "EEG Gemeinde 10 Prozent",
    "Netzentgelt Energiegemeinschaft lokal regional",
  ],
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}${HERO_BILD}` }] },
};

// ---------------------------------------------------------------------------
// Quellen (sichtbar auf der Seite, Abruf 30.09.2026)
// ---------------------------------------------------------------------------
const QUELLEN = [
  { id: "faq", titel: "Österreichische Koordinationsstelle für Energiegemeinschaften – FAQs zum ElWG", url: "https://energiegemeinschaften.gv.at/faqs-zum-elwg/" },
  { id: "detail", titel: "Koordinationsstelle – Detailwissen (große Unternehmen, 6-MW-Grenze, Teilnahmefaktor)", url: "https://energiegemeinschaften.gv.at/detailwissen/" },
  { id: "gebiet", titel: "Koordinationsstelle – Gebietskörperschaften und schutzbedürftige Haushalte (§ 68 Abs. 6 ElWG)", url: "https://energiegemeinschaften.gv.at/gebietskoerperschaften-und-schutzbeduerftige-haushalte/" },
  { id: "liefer", titel: "Koordinationsstelle – Lieferantenverpflichtungen der gemeinsamen Energienutzung (§ 69 ElWG)", url: "https://energiegemeinschaften.gv.at/lieferantenverpflichtungen-der-gemeinsamen-energienutzung/" },
  { id: "org", titel: "Koordinationsstelle – Organisationsformen", url: "https://energiegemeinschaften.gv.at/organisation/" },
  { id: "modelle", titel: "Koordinationsstelle – Bürgerenergie-Modelle (gemeinsame Energienutzung)", url: "https://energiegemeinschaften.gv.at/gemeinsame-energienutzung/" },
  { id: "kmu", titel: "Koordinationsstelle – Ratgeber Erneuerbare-Energie-Gemeinschaften für Unternehmen (12/2022, Rechtslage vor ElWG; Dachpacht für Großunternehmen)", url: "https://energiegemeinschaften.gv.at/wp-content/uploads/sites/19/2022/12/EEG-Ratgeber-KMU_15.12.pdf" },
  { id: "snegv", titel: "E-Control – Systemnutzungsentgelte-Grundsatzverordnung, Begutachtungsentwurf samt Erläuterungen (§ 9), Stand 07/2026", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf" },
  { id: "econtrol", titel: "E-Control – Energiegemeinschaften (Netzentgeltreduktion nach SNE-V)", url: "https://www.e-control.at/energiegemeinschaften" },
  { id: "ris", titel: "RIS – Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025 (beim Abruf nicht erreichbar; Paragrafen laut Koordinationsstelle)", url: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91" },
];

const FAQ = [
  {
    q: "Darf mein Betrieb an einer Erneuerbare-Energie-Gemeinschaft teilnehmen?",
    a: "Ja, wenn er ein kleines oder mittleres Unternehmen ist und die Teilnahme nicht seine gewerbliche oder berufliche Haupttätigkeit ist. Große Unternehmen – ab 250 Beschäftigten und mehr als 50 Mio. € Umsatz oder 43 Mio. € Bilanzsumme – dürfen laut Koordinationsstelle nicht an EEG teilnehmen, wohl aber an Bürgerenergiegemeinschaften und Peer-to-Peer-Verträgen.",
  },
  {
    q: "Was bedeutet die 6-MW-Grenze für große Unternehmen?",
    a: "Macht ein großes Unternehmen bei der gemeinsamen Energienutzung mit, darf die Leistung des jeweiligen Erzeugungs-Zählpunkts 6 MW nicht überschreiten (§ 67 Abs. 3 ElWG laut Koordinationsstelle). Eine größere Anlage kann über einen Teilnahmefaktor anteilig eingebracht werden.",
  },
  {
    q: "Welche Pflichten hat eine Gemeinde, die eine Anlage einbringt?",
    a: "Seit 1. Oktober 2026 müssen Gebietskörperschaften schutzbedürftigen Haushalten zumindest 10 % der Strommenge zugänglich machen, die ihre Anlage jährlich für die gemeinsame Energienutzung erzeugt und einspeist (§ 68 Abs. 6 ElWG). Wie die Gemeinde das sicherstellt und zu welchem Preis, liegt in ihrem Ermessen; ein Preisnachlass ist nicht vorgeschrieben.",
  },
  {
    q: "Ab wann gelten Lieferantenpflichten?",
    a: "Bringen Unternehmen, Gemeinden oder Energiegemeinschaften Anlagen mit zusammen mehr als 100 kW Leistung ein, gelten reduzierte Lieferantenpflichten nach § 69 ElWG: Allgemeine Lieferbedingungen, Informationsblatt, normgerechte Rechnungen und Änderungsmitteilungen mindestens einen Monat im Voraus. Ein Organisator kann diese Pflichten übernehmen.",
  },
  {
    q: "Wie hoch ist der Netzentgeltvorteil lokal und regional?",
    a: "Bis 31. Dezember 2026 sinkt nur für EEG der Arbeitspreis der Netznutzung auf den Gemeinschaftsstrom: lokal um 57 %, regional um 28 % (Netzebene 6/7) bzw. 64 % (Netzebene 4/5). Ab 1. Jänner 2027 erhalten alle Modelle im Nahebereich prozentuelle Abschläge je genutzter Netzinfrastruktur. Die Sätze legt die Tarifverordnung der E-Control fest; sie standen am 30. September 2026 noch nicht fest.",
  },
  {
    q: "Welche Rechtsform braucht eine Energiegemeinschaft mit Betrieben und Gemeinde?",
    a: "EEG und BEG brauchen Rechtspersönlichkeit – etwa Verein, Genossenschaft oder eine Personen- oder Kapitalgesellschaft – und mindestens zwei Mitglieder. Peer-to-Peer-Verträge und gemeinschaftliche Erzeugungsanlagen kommen auch mit einem Vertrag aus. Welche Form passt, klären Sie mit Rechts- und Steuerberatung.",
  },
  {
    q: "Kann ein großes Unternehmen trotzdem eine EEG unterstützen?",
    a: "Ja, indirekt: Der Unternehmens-Ratgeber der Koordinationsstelle (12/2022, noch vor dem ElWG) nennt die Verpachtung von Dachflächen an eine EEG, die darauf eine Anlage betreibt. Nach den aktuellen Organisationsregeln dürfen Anlagen im Eigentum Dritter stehen; die Betriebsführung liegt bei der Gemeinschaft.",
  },
  {
    q: "Was übernimmt Ökovolt?",
    a: "Wir planen und bauen die Erzeugungsanlagen auf Hallen-, Gemeinde- und Freiflächen, klären Netzanschluss und Messkonzept mit dem Netzbetreiber und liefern Erzeugungs- und Lastgangdaten für die Aufteilung. Gründung, Statuten, Steuern und Verträge klären Sie mit Rechts- und Steuerberatung sowie der Anlaufstelle Ihres Bundeslands.",
  },
];

const TEILNAHME = [
  { akteur: "Kleine und mittlere Unternehmen", eeg: "ja, wenn nicht Haupttätigkeit", beg: "ja", p2p: "ja", pflicht: "Lieferantenpflichten ab > 100 kW eingebrachter Leistung" },
  { akteur: "Große Unternehmen (ab 250 Beschäftigte und > 50 Mio. € Umsatz oder > 43 Mio. € Bilanzsumme)", eeg: "nein", beg: "ja, max. 6 MW je Erzeugungs-Zählpunkt", p2p: "ja, max. 6 MW", pflicht: "Teilnahmefaktor bei größeren Anlagen; Lieferantenpflichten ab > 100 kW" },
  { akteur: "Gemeinden und Gebietskörperschaften", eeg: "ja", beg: "ja", p2p: "ja", pflicht: "mind. 10 % der eingebrachten Erzeugung für schutzbedürftige Haushalte; Lieferantenpflichten ab > 100 kW" },
];

const CHECKLISTEN = {
  betrieb: [
    { id: "groesse", titel: "Unternehmensgröße klären", text: "KMU dürfen in EEG und BEG, große Unternehmen nur in BEG und Peer-to-Peer – mit höchstens 6 MW je Erzeugungs-Zählpunkt." },
    { id: "lastgang", titel: "Lastgang auswerten", text: "Wann entsteht Überschuss, wann Bedarf? Geteilt wird nur, was in derselben Viertelstunde verbraucht wird." },
    { id: "nahe", titel: "Nahebereich beim Netzbetreiber erfragen", text: "Hängen die Partner an derselben Trafostation (lokal) oder am selben Umspannwerk (regional)?" },
    { id: "rolle", titel: "Rolle festlegen", text: "Überschuss- oder Volleinspeiser, Abnehmer oder beides – und wer als Organisator die Abwicklung übernimmt." },
    { id: "liefer", titel: "Lieferantenpflichten prüfen", text: "Über 100 kW eingebrachter Leistung gelten Pflichten nach § 69 ElWG – selbst erfüllen oder an Gemeinschaft bzw. Organisator übertragen." },
    { id: "steuer", titel: "Steuern abstimmen", text: "Umsatzsteuer, mögliche Reverse-Charge-Regel und Elektrizitätsabgabe mit der Steuerberatung klären." },
    { id: "vertrag", titel: "Verträge aufsetzen", text: "Preis und Anpassung, Laufzeit, Austritt, Teilnahmefaktor – Mustervorlagen bietet die Koordinationsstelle." },
    { id: "zaehler", titel: "Zähler und Datenfreigabe", text: "Smart Meter mit Viertelstundenwerten bzw. Lastprofilzähler und Zustimmung zur Datenübermittlung für jeden Zählpunkt." },
  ],
  gemeinde: [
    { id: "rolle", titel: "Rolle der Gemeinde bestimmen", text: "Mitglied, Gründerin oder Anlagenbetreiberin – und welche Beschlüsse der Gemeinderat dafür braucht." },
    { id: "liegenschaften", titel: "Liegenschaften erheben", text: "Dächer und Verbrauch von Schule, Bauhof, Kläranlage, Freibad und Amtsgebäude gegenüberstellen." },
    { id: "zehn", titel: "10-%-Regel organisieren", text: "Zugang schutzbedürftiger Haushalte zu mindestens 10 % der eingebrachten Erzeugung in Statuten oder Verträgen regeln (§ 68 Abs. 6 ElWG)." },
    { id: "form", titel: "Rechtsform wählen", text: "Verein, Genossenschaft oder Gesellschaft mit Rechtspersönlichkeit; bei Beteiligung der Bevölkerung Kapitalmarktrecht beachten." },
    { id: "vergabe", titel: "Vergabe planen", text: "Planung, Lieferung und Bau der Anlagen nach Vergaberecht ausschreiben bzw. vergeben." },
    { id: "partner", titel: "Partner im Ort ansprechen", text: "Haushalte, Betriebe und Landwirtschaft im selben Nahebereich – Betriebe mit Dauerlast ergänzen PV besonders gut." },
    { id: "abrechnung", titel: "Abrechnung und Organisator", text: "Wer rechnet ab, wer erfüllt Lieferantenpflichten ab > 100 kW? Abrechnungssystem mit EDA-Anbindung wählen." },
    { id: "beratung", titel: "Beratung nutzen", text: "Koordinationsstelle und Landes-Anlaufstelle (in Oberösterreich der OÖ Energiesparverband) beraten kostenlos." },
  ],
};

export default function BetriebeGemeindenPage() {
  const linkBetrieb = rechnerLink({ akteur: "kmu", rolle: "erzeuger", leistungKw: 250, nahebereich: "lokal" });
  const linkGemeinde = rechnerLink({ akteur: "gemeinde", rolle: "erzeuger", leistungKw: 150, nahebereich: "lokal" });

  return (
    <>
      <LoesungSchema
        pfad={PFAD}
        name="Energiegemeinschaften für Betriebe und Gemeinden"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Unternehmen, Gemeinden, Gebietskörperschaften"
        bild={HERO_BILD}
        leistungen={["Rollen- und Modellwahl EEG, BEG, P2P, GEA", "PV-Anlagen auf Betriebs- und Gemeindeflächen", "Messkonzept und Abstimmung mit dem Netzbetreiber", "Erzeugungs- und Lastgangdaten für die Aufteilung", "Wartung und Monitoring"]}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Energiegemeinschaften", href: "/energiegemeinschaften" }, { name: "Betriebe & Gemeinden" }]}
        eyebrow="Energiegemeinschaften · ElWG"
        title={
          <>
            Energiegemeinschaft für <span className="ov-text-gradient-light">Unternehmen und Gemeinden</span>
          </>
        }
        lead="Hallendach als Kraftwerk, Gemeinde als Initiatorin: Wer seit 1. Oktober 2026 in welchem Modell mitmachen darf, welche Grenzen gelten und wie viel Netzentgelt der Nahebereich spart."
        image={{ src: HERO_BILD, alt: "Luftbild eines Gewerbegebiets mit Photovoltaikanlagen auf mehreren Hallendächern" }}
        actions={[
          { label: "Teilnahme prüfen", href: "#check" },
          { label: "Erstgespräch vereinbaren", href: "/termin?art=video&thema=energiegemeinschaft", icon: Sun },
        ]}
        points={["KMU, Großunternehmen, Gemeinden", "6-MW- und 10-%-Regel", "Netzentgelt lokal & regional", "Checkliste zum Abhaken"]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-36"
      />

      <KennzahlenBand
        items={[
          { wert: 6, suffix: " MW", label: "Höchstleistung je Erzeugungs-Zählpunkt großer Unternehmen in BEG und P2P" },
          { wert: 10, suffix: " %", label: "der eingebrachten Erzeugung von Gemeinde-Anlagen für schutzbedürftige Haushalte" },
          { wert: 100, prefix: "> ", suffix: " kW", label: "eingebrachte Leistung: ab hier gelten Lieferantenpflichten für Betriebe und Gemeinden" },
          { wert: 57, prefix: "− ", suffix: " %", label: "Arbeitspreis Netznutzung in der lokalen EEG bis 31.12.2026" },
        ]}
        quelle={`Quellen: Koordinationsstelle für Energiegemeinschaften (FAQs zum ElWG, Detailwissen, Lieferantenverpflichtungen; §§ 67–69 ElWG), E-Control (SNE-V). Abruf ${ABRUF}.`}
      />

      {/* Wer darf wo */}
      <Section tone="white" space="lg" id="teilnahme">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Wer darf wo mitmachen"
              title="Betriebsgröße und Rolle entscheiden über das Modell"
              lead="Das ElWG fasst Energiegemeinschaften, gemeinschaftliche Erzeugungsanlagen und neue Modelle seit 1. Oktober 2026 als „gemeinsame Energienutzung“ zusammen. Für Betriebe und Gemeinden gelten dabei eigene Regeln."
            />
            <StandPille className="mt-6">Rechtsstand {ABRUF}</StandPille>
          </div>
          <Reveal delay={100}>
            <Tabelle
              dicht
              caption="Teilnahme von Betrieben und Gemeinden an EEG, BEG und Peer-to-Peer, Stand 30. September 2026"
              spalten={[
                { key: "akteur", label: "Wer", breite: "w-[26%]" },
                { key: "eeg", label: "EEG" },
                { key: "beg", label: "BEG" },
                { key: "p2p", label: "P2P" },
                { key: "pflicht", label: "Besonderheit" },
              ]}
              zeilen={TEILNAHME}
              fuss="Quellen: Koordinationsstelle für Energiegemeinschaften – Detailwissen, FAQs zum ElWG, Gebietskörperschaften, Lieferantenverpflichtungen (Abruf 30.09.2026). Gemeinschaftliche Erzeugungsanlagen (GEA) sind auf Teilnehmer an derselben Hauptleitung bzw. im Standortbereich beschränkt."
            />
          </Reveal>
        </div>
      </Section>

      {/* Interaktiver Check */}
      <Section tone="sand" space="lg" id="check" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Teilnahme-Check"
          title="Welche Modelle stehen Ihnen offen?"
          lead="Drei Angaben genügen: wer Sie sind, welche Rolle Sie planen und wo Ihre Partner sitzen. Der Check zeigt die möglichen Modelle, den Netzentgeltvorteil und Ihre Pflichten."
          className="mb-10 md:mb-12"
        />
        <RollenCheck />
      </Section>

      {/* Modelle */}
      <Section tone="white" space="lg" id="modelle">
        <SplitMedia
          eyebrow="Modell 1 · Betrieb als Erzeuger"
          title="Das Hallendach versorgt Nachbarn, Mitarbeitende und die Gemeinde"
          text={[
            "Ein Betrieb nutzt seinen Solarstrom zuerst selbst. Den Überschuss – mittags, am Wochenende, in Betriebsferien – ordnet der Netzbetreiber viertelstündlich den anderen Teilnehmenden zu. Was niemand zeitgleich braucht, geht wie bisher an den Stromhändler.",
          ]}
          points={[
            "Interner Preis zwischen Marktpreis und Lieferpreis – beide Seiten profitieren",
            "KMU in EEG und BEG, große Unternehmen in BEG und Peer-to-Peer",
            "Über 100 kW eingebrachter Leistung: Lieferantenpflichten oder Organisator",
            "Alternative für große Unternehmen: Dachfläche an eine EEG verpachten",
          ]}
          image={{ src: "/Images/AT/loesungen-b/speicher-industriedach-pv.jpg", alt: "Luftbild eines Hallendachs mit großflächiger Photovoltaikanlage" }}
        >
          <Link href={linkBetrieb} className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:text-ov-800">
            <Calculator aria-hidden="true" className="h-4 w-4" />
            Beispiel „Betrieb mit 250 kW“ im Rechner öffnen
          </Link>
        </SplitMedia>

        <SplitMedia
          className="mt-20 md:mt-28"
          reverse
          eyebrow="Modell 2 · Gemeinde als Initiatorin"
          title="Schule, Bauhof und Kläranlage werden zum Ortskraftwerk"
          text={[
            "Gemeinden dürfen Mitglied, Gründerin oder Anlagenbetreiberin einer EEG oder BEG sein. Sie bringen Dachflächen und Verbraucher mit Dauerlast ein und holen Haushalte, Betriebe und Landwirtschaft im Nahebereich an Bord.",
          ]}
          points={[
            "Mindestens 10 % der eingebrachten Erzeugung für schutzbedürftige Haushalte – Preis und Form frei",
            "Beschlüsse nach Gemeindeordnung, Vergabe nach Vergaberecht",
            "Kläranlage, Wasserversorgung und Bauhof als Abnehmer tagsüber",
            "Kostenlose Beratung durch Koordinationsstelle und Landes-Anlaufstelle",
          ]}
          image={{ src: "/Images/AT/loesungen-a/gem-klaeranlage-luftbild.jpg", alt: "Luftbild der Kläranlage Wartberg an der Krems in Oberösterreich" }}
        >
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <Link href={linkGemeinde} className="inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:text-ov-800">
              <Calculator aria-hidden="true" className="h-4 w-4" />
              Beispiel „Gemeinde mit 150 kW“ im Rechner
            </Link>
            <Link href="/kommunen" className="inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:text-ov-800">
              <Landmark aria-hidden="true" className="h-4 w-4" />
              PV für Gemeinden
            </Link>
          </div>
        </SplitMedia>

      </Section>

      {/* Netzentgelt */}
      <DunkelSektion
        id="netzentgelt"
        eyebrow="Netzentgelt lokal & regional"
        title="Je näher die Partner, desto geringer das Netzentgelt"
        lead="Der Vorteil hängt davon ab, wie viel öffentliches Netz der geteilte Strom nutzt. Bis Ende 2026 profitieren nur EEG; ab 2027 bekommen alle Modelle im Nahebereich Abschläge – die genauen Sätze sind noch offen."
      >
        <NahebereichStufen />
        <p className="mt-6 max-w-4xl text-[12.5px] leading-relaxed text-white/45">
          2026: Systemnutzungsentgelte-Verordnung (SNE-V) der E-Control, Reduktion nur für den Gemeinschaftsstrom. Ab 2027: § 9 Abs. 3 Systemnutzungsentgelte-Grundsatzverordnung laut Begutachtungsentwurf 07/2026 – Abschläge je genutzter Infrastruktur nach
          § 70 Abs. 6 ElWG, für alle Netzbereiche einheitlich in der Tarifverordnung; die Angabe „bis zu 90 % bzw. 100 %“ stammt aus den Erläuterungen zum Entwurf. Elektrizitätsabgabe und Erneuerbaren-Förderbeitrag entfallen nur in EEG. Stand{" "}
          {ABRUF}.
        </p>
      </DunkelSektion>

      {/* Ablauf */}
      <Section tone="white" space="lg" id="ablauf">
        <SectionHeading eyebrow="Ablauf" title="Vom ersten Gespräch zur laufenden Gemeinschaft" align="center" className="mb-14" />
        <Steps
          cols={3}
          items={[
            { icon: Search, title: "Rolle & Nahebereich", text: "Betriebsgröße, Rolle und Partner klären; beim Netzbetreiber erfragen, welche Zählpunkte am selben Trafo oder Umspannwerk hängen." },
            { icon: Gauge, title: "Lastgang & Konzept", text: "Erzeugung und Verbrauch viertelstündlich gegenüberstellen, Anlagengröße und Aufteilung festlegen." },
            { icon: Scale, title: "Rechtsform & Verträge", text: "Verein, Genossenschaft oder Gesellschaft gründen – oder P2P- bzw. GEA-Vertrag; Preise, Austritt, 10-%-Regel regeln." },
            { icon: Sun, title: "Anlage & Netz", text: "Planung und Bau der PV-Anlage, Netzanschluss und Messkonzept mit dem Netzbetreiber." },
            { icon: Network, title: "Registrierung", text: "Anmeldung beim Netzbetreiber, Datenaustausch über EDA, Zählpunkte zuordnen – neue Modelle schrittweise ab 5.10.2026." },
            { icon: FileSignature, title: "Abrechnen & Betreiben", text: "Abrechnung über Gemeinschaft oder Organisator, Lieferantenpflichten ab > 100 kW, Wartung und Monitoring." },
          ]}
        />
      </Section>

      {/* Fachdetails */}
      <Section tone="sand" space="lg" id="details" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Für Geschäftsführung, Gemeinderat & Beratung"
          title="Rechtsform, Pflichten und was noch offen ist"
          className="mb-10"
        />
        <FachTabs
          tabs={[
            {
              id: "rechtsform",
              label: "Rechtsform",
              icon: <Scale />,
              inhalt: (
                <div>
                  <Prosa className="max-w-3xl">
                    <p>
                      <strong>EEG und BEG brauchen Rechtspersönlichkeit</strong> und mindestens zwei Mitglieder oder Gesellschafter. Die Koordinationsstelle nennt Verein, Genossenschaft, Personen- oder Kapitalgesellschaft und ähnliche Vereinigungen mit
                      Rechtspersönlichkeit. Peer-to-Peer-Verträge und gemeinschaftliche Erzeugungsanlagen können auch auf vertraglicher Basis laufen. Die Anlagen dürfen im Eigentum Dritter stehen; der Betrieb kann an Dienstleister ausgelagert werden.
                    </p>
                  </Prosa>
                  <Hebel
                    className="mt-8"
                    cols={3}
                    items={[
                      { icon: Users, titel: "Verein", text: "Schnell und günstig gegründet – häufig bei Gemeinde- und Nachbarschaftsgemeinschaften." },
                      { icon: Network, titel: "Genossenschaft", text: "Für gemeinsame Investitionen mit Mitgliedsanteilen, etwa wenn Bürgerinnen und Betriebe mitfinanzieren." },
                      { icon: Building2, titel: "GmbH oder andere Gesellschaft", text: "Wenn Gemeinde, Stadtwerk oder Betrieb Träger ist; Zweck der Gemeinschaft beachten." },
                    ]}
                  />
                  <Hinweis className="mt-8 max-w-3xl" titel="Keine Rechts- oder Steuerberatung">
                    Statuten, Verträge und steuerliche Fragen klären Sie mit Ihrer Rechts- und Steuerberatung. Details zur Wahl im Ratgeber <Link href="/ratgeber/energiegemeinschaft-gruenden">Energiegemeinschaft gründen</Link>.
                  </Hinweis>
                </div>
              ),
            },
            {
              id: "pflichten",
              label: "Pflichten & Organisator",
              icon: <ClipboardCheck />,
              inhalt: (
                <Prosa className="max-w-4xl">
                  <ul>
                    <li>
                      <strong>Lieferantenpflichten (§ 69 ElWG):</strong> Über 100 kW eingebrachter Leistung – maßgeblich ist die Summe der Anlagen je Teilnehmer – gelten Allgemeine Lieferbedingungen, ein Informationsblatt für Haushalte und
                      Kleinunternehmen, Änderungsmitteilungen einen Monat im Voraus, transparente Rechnungen und kostenlose Rechnungslegung mindestens jährlich, auf Wunsch monatlich. Für Haushalte liegt die Schwelle bei 30 kW.
                    </li>
                    <li>
                      <strong>Organisator:</strong> Er kann die Lieferantenpflichten übernehmen und im Namen der Teilnehmenden Verträge schließen; das Recht auf freie Lieferantenwahl bleibt unberührt (§§ 25–26, 68 Abs. 2 ElWG laut
                      Koordinationsstelle).
                    </li>
                    <li>
                      <strong>Große Unternehmen:</strong> höchstens 6 MW je Erzeugungs-Zählpunkt in der gemeinsamen Nutzung (§ 67 Abs. 3 ElWG); größere Anlagen anteilig über den Teilnahmefaktor.
                    </li>
                    <li>
                      <strong>Gemeinden:</strong> mindestens 10 % der jährlich für die gemeinsame Nutzung erzeugten und eingespeisten Menge für schutzbedürftige Haushalte – das sind Haushalte, deren Nettoeinkommen den Ausgleichszulagen-Richtsatz um
                      höchstens 12 % übersteigt (§ 68 Abs. 6 ElWG).
                    </li>
                  </ul>
                  <p>
                    Abrechnung, Steuern und Verträge für Unternehmen vertieft der Ratgeber <Link href="/ratgeber/energiegemeinschaft-gewerbe">Energiegemeinschaft für Unternehmen</Link>.
                  </p>
                </Prosa>
              ),
            },
            {
              id: "offen",
              label: "Noch offen",
              icon: <Search />,
              inhalt: (
                <div>
                  <Prosa className="max-w-4xl">
                    <p>Stand 30. September 2026 sind diese Punkte nicht abschließend geklärt – wir aktualisieren die Seite, sobald Verordnungen und Marktprozesse feststehen:</p>
                    <ul>
                      <li><strong>Abschläge ab 2027:</strong> Die Prozentsätze für lokal, regional, Hauptleitung und Standortbereich legt die Tarifverordnung fest; bekannt ist nur der Begutachtungsentwurf der Grundsatzverordnung (07/2026).</li>
                      <li><strong>Netzübergreifende Modelle:</strong> Umsetzung durch die Netzbetreiber voraussichtlich ab April 2027; bis dahin nur Zählpunkte beim selben Netzbetreiber.</li>
                      <li><strong>Große Unternehmen in der GEA:</strong> Die Teilnahme im Gebäudemodell ist in den Quellen nicht eindeutig beschrieben – im Einzelfall prüfen.</li>
                      <li><strong>Speicher in Energiegemeinschaften:</strong> Messkonzepte sind rechtlich angelegt, die Praxis ist laut Koordinationsstelle noch unklar.</li>
                    </ul>
                  </Prosa>
                  <StandPille className="mt-6">Rechtsstand {ABRUF}</StandPille>
                </div>
              ),
            },
          ]}
        />
      </Section>

      {/* Checkliste */}
      <Section tone="white" space="lg" id="checkliste">
        <SectionHeading eyebrow="Checkliste" title="Vor dem Einstieg: acht Punkte zum Abhaken" lead="Für Betriebe und Gemeinden getrennt – Ihr Fortschritt bleibt in diesem Browser gespeichert." className="mb-10" />
        <Checkliste listen={CHECKLISTEN} />
      </Section>

      {/* FAQ */}
      <Section tone="sand" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Betriebe und Gemeinden in der Energiegemeinschaft" />
          <Faq items={FAQ} />
        </div>
      </Section>

      {/* Weiterlesen */}
      <Section tone="white" space="md" id="weiter">
        <h2 className="ov-h3 border-b border-ink-200 pb-6 text-ink-900 md:text-[28px]">Weiterrechnen und vertiefen</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/rechner/energiegemeinschaft", titel: "Energiegemeinschafts-Rechner", text: "Geteilte Energie, Netzentgelt und Win-win-Preis." },
            { href: "/ratgeber/energiegemeinschaft-gewerbe", titel: "Energiegemeinschaft für Unternehmen", text: "Abrechnung, Steuern und Verträge." },
            { href: "/ratgeber/elwg-elektrizitaetswirtschaftsgesetz", titel: "ElWG im Überblick", text: "Was sich für PV-Betreiber ändert." },
            { href: "/energiegemeinschaften", titel: "EEG, BEG und GEA im Vergleich", text: "Alle Modelle und die Rolle von Ökovolt." },
          ].map((v, i) => (
            <Reveal as="li" key={v.href} delay={i * 70} className="flex">
              <article className="group ov-card-hover relative flex w-full flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 focus-within:ring-2 focus-within:ring-ov-500 hover:bg-white">
                <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-400 ring-1 ring-ink-200 transition-all duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </span>
                <h3 className="font-display text-[18px] font-bold leading-snug text-ink-900">
                  <Link href={v.href} className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-['']">
                    {v.titel}
                  </Link>
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{v.text}</p>
              </article>
            </Reveal>
          ))}
        </ul>

        <details className="group mt-12 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-7">
          <summary className="cursor-pointer list-none font-display text-[16.5px] font-bold text-ink-900 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500">
            Quellen ({QUELLEN.length}) · abgerufen am {ABRUF}
          </summary>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-ink-600">
            {QUELLEN.map((q) => (
              <li key={q.id}>
                <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800 [overflow-wrap:anywhere]">
                  {q.titel}
                </a>
              </li>
            ))}
          </ol>
        </details>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Planen wir die Anlage für Ihre Gemeinschaft."
        text="Erstgespräch per Video für Betriebe und Gemeinden: Rolle, Nahebereich, Anlagengröße, Partner und Abrechnung – mit ersten Zahlen aus Ihrem Lastgang."
        primary={{ label: "Erstgespräch vereinbaren", href: "/termin?art=video&thema=energiegemeinschaft" }}
        secondary={{ label: "Ersparnis berechnen", href: "/rechner/energiegemeinschaft" }}
      />

      <Bildnachweis
        items={[
          { motiv: "Industriedach mit PV", urheber: "Giant Asparagus", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/aerial-view-of-rooftop-solar-panel-installation-35691079/" },
          { motiv: "Kläranlage Wartberg an der Krems", urheber: "Isiwal", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Wartberg_ad_Krems_Kl%C3%A4ranlage_KG_Penzendorf-DJI_20250920134211_0002_D.jpg" },
        ]}
      />
    </>
  );
}
