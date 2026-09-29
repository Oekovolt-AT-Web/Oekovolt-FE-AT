import Link from "next/link";
import {
  Cable,
  Calculator,
  ClipboardCheck,
  Cog,
  FileSearch,
  Handshake,
  HardHat,
  History,
  Landmark,
  Leaf,
  LineChart,
  Map as MapIcon,
  MapPin,
  Radio,
  ScrollText,
  Sprout,
  TrendingUp,
  Wrench,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hebel, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import KennzahlenBand from "@/components/Loesungen/A/KennzahlenBand";
import FotoBento from "@/components/Loesungen/A/FotoBento";
import FlaechenRegler from "@/components/Loesungen/A/FlaechenRegler";
import TechnikSystem from "@/components/Loesungen/A/TechnikSystem";
import ZitatBand from "@/components/Loesungen/A/ZitatBand";
import AblaufLeiste from "@/components/Loesungen/A/AblaufLeiste";
import FachTabs from "@/components/Loesungen/A/FachTabs";
import RechnerLeiste from "@/components/Loesungen/A/RechnerLeiste";
import { nachweise } from "@/components/Loesungen/A/bildnachweise";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/freiflaechen-photovoltaik";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Freiflächen-Photovoltaik & Solarparks Österreich | Ökovolt";
const BESCHREIBUNG =
  "Solarparks ab 500 kWp in Österreich: Flächenprüfung, Widmung je Bundesland, Netzanschluss auf Netzebene 5/4, Parkregler, SCADA, PPA und Pacht.";
const HERO_BILD = "/Images/AT/loesungen/freiflaeche-solarpark-duernrohr.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1920, height: 1080 }] },
};

const FAQ = [
  {
    q: "Ab welcher Größe lohnt sich ein Solarpark in Österreich?",
    a: "Wir planen Freiflächenanlagen ab etwa 500 kWp. Darunter fallen die Fixkosten für Netzanschluss, Trafostation, Zaun und Genehmigung zu stark ins Gewicht. Ab rund 1 MWp auf Mittelspannung (Netzebene 5) sinken die spezifischen Kosten deutlich; sehr große Parks schließen wir auf Netzebene 4 direkt am Umspannwerk an.",
  },
  {
    q: "Welche Flächen eignen sich für Freiflächen-Photovoltaik?",
    a: "Bevorzugt vorbelastete Flächen: Deponien, Schottergruben, Gewerbe- und Industriebrachen, Lagerplätze, Flächen entlang von Autobahn und Bahn sowie ertragsschwache Standorte. Wichtig sind eine Neigung nach Süden bis Ost oder West, keine Schutzgebiete oder Hochwasserabflussgebiete und ein erreichbarer Netzanschluss. Hochwertiges Ackerland schließen mehrere Bundesländer über Ausschlusszonen aus.",
  },
  {
    q: "Brauche ich für einen Solarpark eine Umwidmung?",
    a: "In der Regel ja. Freiflächenanlagen im Grünland benötigen eine eigene Widmung oder Sonderausweisung im Flächenwidmungsplan der Gemeinde, in Oberösterreich etwa ab 50 m² Modulfläche. Größere Anlagen müssen in einigen Ländern zusätzlich in einer Landeszone liegen – in Niederösterreich über 2 ha, in der Steiermark über 10 ha. Ab 2026 können in verordneten Beschleunigungsgebieten Vereinfachungen gelten.",
  },
  {
    q: "Wie hoch ist die Pacht für eine Solarpark-Fläche?",
    a: "Das hängt von Lage, Netzanschluss, Einstrahlung und Vermarktung ab. Üblich sind eine feste Pacht je Hektar mit Wertsicherung, eine erlösabhängige Pacht oder eine Kombination, bei Laufzeiten von 25 bis 30 Jahren plus Verlängerungsoption. Wir legen die Kalkulation offen und achten auf Rückbauverpflichtung, Sicherheiten und grundbücherliche Dienstbarkeiten.",
  },
  {
    q: "Gibt es für Freiflächenanlagen eine Förderung?",
    a: "Ja, aber mit Einschränkungen. Anlagen bis 1.000 kWp können den EAG-Investitionszuschuss beantragen, größere Anlagen an den Ausschreibungen für die Marktprämie teilnehmen (Höchstpreis 2026: 7,77 ct/kWh). Auf landwirtschaftlich genutzten Flächen oder im Grünland gilt jeweils ein Abschlag von 25 %; für Deponien, Altlasten, Bergbau- und Infrastrukturstandorte sowie bestimmte Agri-PV-Anlagen entfällt er.",
  },
  {
    q: "Wie wird der Strom eines Solarparks vermarktet?",
    a: "Über Direktvermarktung zum Börsenpreis, über einen Stromliefervertrag (PPA) mit einem Unternehmen oder Versorger, mit Marktprämie aus der EAG-Ausschreibung oder in Kombination. Ein Batteriespeicher am Park kann Erzeugung in teurere Abendstunden verschieben und Abregelung bei negativen Preisen abfedern. Wir rechnen die Varianten für Ihr Projekt durch.",
  },
  {
    q: "Wer betreibt den Solarpark nach der Inbetriebnahme?",
    a: "Auf Wunsch wir: Überwachung über unser eigenes SCADA, Fernwartung, Parkregler-Betrieb gegenüber dem Netzbetreiber, Wartung, Grünpflege und Berichtswesen. Über unsere Beteiligung an der ÖkoInvest GmbH kennen wir den Betrieb von Freiflächen- und Agri-PV auch aus Eigentümersicht.",
  },
  {
    q: "Wie lange dauert ein Solarpark-Projekt von der Idee bis zum Netz?",
    a: "Realistisch ein bis drei Jahre. Den größten Einfluss haben Widmungsverfahren, Netzkapazität am Umspannwerk und naturschutzrechtliche Verfahren. Der Bau selbst dauert bei einigen Megawatt meist nur wenige Monate. Wer früh die Netzanfrage stellt und die Gemeinde einbindet, spart am meisten Zeit.",
  },
];

const LAENDER = [
  { land: "Niederösterreich", regel: "Widmung „Grünland-Photovoltaikanlagen“ durch die Gemeinde; Anlagen über 2 ha nur auf Standorten des Sektoralen Raumordnungsprogramms über PV-Anlagen im Grünland (LGBl. Nr. 94/2022)." },
  { land: "Oberösterreich", regel: "Freistehende Anlagen über 50 m² Modulfläche im Grünland nur mit Sonderausweisung (§ 30a Abs. 3 Oö. ROG); Kriterienkatalog der Oö. PV-Strategie 2030; über 1.000 kW elektrizitätsrechtliche Bewilligung; Beschleunigungsgebiete ab 2026 widmungsneutral." },
  { land: "Steiermark", regel: "Entwicklungsprogramm Erneuerbare Energie – Solarenergie (1. Änderung LGBl. Nr. 12/2026): über 10 ha nur in Vorrangzonen, Ausschlusszonen für hochwertige Böden und Landschaft." },
  { land: "Burgenland", regel: "Freiflächenanlagen über den Bagatellgrenzen nur in per Verordnung festgelegten Eignungszonen (Burgenländische Eignungszonenverordnung für PV- und Solar-Freiflächenanlagen)." },
  { land: "Kärnten, Salzburg, Tirol, Vorarlberg, Wien", regel: "Grundsatz: eigene Widmung oder Sonderfläche im Flächenwidmungsplan, Landesvorgaben zu Standortkriterien und Landschaftsbild; Verfahren und Grenzwerte unterscheiden sich – wir prüfen sie je Standort." },
];

const BEISPIEL = [
  { pos: "Anlage und Jahresertrag", wert: "5 MWp × 1.150 kWh/kWp (Ost-Österreich, Süd)", ergebnis: "5.750 MWh" },
  { pos: "Erlös über PPA", wert: "Annahme 6,5 ct/kWh, pay-as-produced", ergebnis: "≈ 373.750 €/Jahr" },
  { pos: "Betrieb & Wartung, Versicherung, Netz", wert: "Annahme 12 €/kWp und Jahr", ergebnis: "− 60.000 €/Jahr" },
  { pos: "Pacht", wert: "Annahme 6 ha × 2.500 €/ha", ergebnis: "− 15.000 €/Jahr" },
  { pos: "Jährlicher Überschuss (vor Steuern)", wert: "ohne Degradation und Preisindexierung", ergebnis: "≈ 298.750 €/Jahr", hervorheben: true },
  { pos: "Investition inkl. Netzanschluss NE 5", wert: "Annahme 550 €/kWp netto", ergebnis: "2,75 Mio. €" },
  { pos: "Statische Amortisation", wert: "2,75 Mio. € ÷ 298.750 €/Jahr", ergebnis: "≈ 9,2 Jahre", hervorheben: true },
  { pos: "Zum Vergleich: Marktprämie", wert: "Höchstpreis 7,77 ct/kWh; auf Agrar- oder Grünland − 25 % → max. 5,83 ct/kWh anzulegender Wert", ergebnis: "Standort entscheidet" },
];


export default async function FreiflaechePage({ searchParams }) {
  const v = zielgruppenVariante("freiflaeche", await searchParams);

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Freiflächen-Photovoltaik und Solarparks in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Grundeigentümer, Investoren, Energieversorger, Gemeinden"
        bild={HERO_BILD}
        leistungen={["Flächenprüfung und Due Diligence", "Widmung und Genehmigung", "Netzanschluss Netzebene 5 und 4", "Parkregler, SCADA und Fernwartung", "PPA und Direktvermarktung", "Betriebsführung und Wartung"]}
      />

      <PageHero
        variant="immersive"
        className="pb-4 md:pb-6"
        breadcrumbs={[{ name: "Freiflächen-Photovoltaik" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Luftbild eines Photovoltaik-Parks auf einem ehemaligen Kraftwerksgelände in Niederösterreich" }}
        actions={[
          { label: v.cta, href: "/termin?art=video" },
          { label: "Standort prüfen", href: "/standort-check", icon: MapPin },
        ]}
        points={["500 kWp bis in den MW-Bereich", "Netzebene 5 & 4, Umspannwerk", "Eigener Parkregler & SCADA", "PPA, Direktvermarktung, Betrieb"]}
      />

      <KennzahlenBand
        items={[
          { wert: 7.77, dezimal: 2, nach: " ct", label: "Höchstpreis je kWh in den EAG-Ausschreibungen für die Marktprämie 2026" },
          { wert: 25, vor: "− ", nach: " %", label: "Abschlag auf Investitionszuschuss und Marktprämie auf Agrar- und Grünlandflächen" },
          { wert: 2, nach: " ha", label: "darüber braucht es in Niederösterreich eine Landeszone (Sektorales ROP)" },
          { wert: 1000, nach: " kW", label: "darüber elektrizitätsrechtliche Bewilligung für Freiflächen in Oberösterreich" },
        ]}
        quelle="Quellen: EAG-Marktprämienverordnung und EAG-Investitionszuschüsseverordnung-Strom laut Leitfaden Land Oberösterreich 2026 (Stand 06/2026); Energie- und Umweltagentur NÖ; § 6 Oö. ElWOG 2006."
      />

      <Section tone="white" space="md">
        <div className="mb-10 grid gap-6 md:mb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Leistungsumfang" title="Vom Flächenscreening bis zum laufenden Solarpark" />
          <p className="ov-lead text-ink-600">
            Ein Solarpark scheitert selten an der Technik, sondern an Widmung, Netz oder Vermarktung. Deshalb beginnen wir dort – und bauen erst,
            wenn alle drei tragen.
          </p>
        </div>
        <FotoBento
          spalten={3}
          items={[
            { icon: FileSearch, titel: "Flächenprüfung & Due Diligence", text: "Einstrahlung, Topografie, Naturgefahren (HORA), Schutzgebiete, Bodenbonität, Leitungsrechte und Zufahrt – bevor Kosten entstehen.", bild: "/Images/AT/loesungen-a/ff-solarpark-luftbild.jpg", alt: "Luftbild eines großen Solarparks zwischen Wiesen und Feldern (Symbolbild)" },
            { icon: MapIcon, titel: "Widmung & Genehmigung", text: "Abstimmung mit Gemeinde und Land, Ökologie- und Blendgutachten, elektrizitäts-, naturschutz- und wasserrechtliche Verfahren.", bild: "/Images/AT/ratgeber/freiflaechen-photovoltaik-widmung.jpg", alt: "Aufgeständerte Photovoltaikanlage auf einer Wiese in Dornbirn im Winter" },
            { icon: Cable, titel: "Netzanschluss & Umspannwerk", text: "Netzanfrage, Kabeltrasse, Trafo- und Übergabestationen auf Netzebene 5 oder Anschluss am Umspannwerk auf Netzebene 4.", bild: "/Images/AT/technik/umspannwerk-obersielach.jpg", alt: "Freiluft-Schaltanlage eines Umspannwerks in Kärnten" },
            { icon: HardHat, titel: "Bau & Inbetriebnahme", text: "Rammprofile oder Schraubfundamente, Stringplanung, Blitzschutz, Zaun und Kameras – Prüfung nach ÖVE/ÖNORM EN 62446-1.", bild: "/Images/Referenzen/Referenzekarte-2.jpg", alt: "Monteure an aufgeständerten Modultischen einer Freiflächenanlage" },
            { icon: TrendingUp, titel: "Vermarktung", text: "PPA, Direktvermarktung, Marktprämie und Speicher im Vergleich – als Grundlage für Finanzierung und Investitionsentscheidung.", bild: "/Images/AT/ratgeber/hochspannungsleitung-molln.jpg", alt: "Hochspannungsleitung in einer Voralpenlandschaft in Oberösterreich", href: "/service/direktvermarktung" },
            { icon: Wrench, titel: "Betrieb & Wartung", text: "Leitwarte, Fernwartung, Grünpflege, Thermografie und Reporting über die gesamte Laufzeit.", bild: "/Images/AT/service/pv-wartung-techniker.jpg", alt: "Monteur mit Absturzsicherung trägt ein Photovoltaikmodul", href: "/service/wartung" },
          ]}
        />
      </Section>

      <Section tone="sand" space="md" id="flaechenrechner">
        <FlaechenRegler
          eyebrow="Interaktiv · Fläche & Größe"
          titel="Wie groß wird der Solarpark auf Ihrer Fläche?"
          lead="Schieben Sie den Regler: Leistung, Jahresertrag und Klimawirkung als Richtwert – und ab welcher Größe Landeszonen und Bewilligungen greifen."
        />
      </Section>

      <TechnikSystem
        id="netz"
        eyebrow="Netzanschluss"
        title="Ohne Netzkapazität kein Solarpark – deshalb fragen wir zuerst."
        lead="Solarparks speisen in Österreich meist auf Netzebene 5 (Mittelspannung) oder auf Netzebene 4 direkt am Umspannwerk ein. Die freie Kapazität ist regional knapp und wird nach Eingang der Anfragen vergeben."
        fakten={[
          { wert: "NE 5/4", label: "Mittelspannung oder Umspannwerk" },
          { wert: "Typ B", label: "TOR Erzeuger, 250 kW bis < 35 MW" },
          { wert: "20 J.", label: "Laufzeit der Marktprämie" },
        ]}
        knoten={{
          erzeugung: { titel: "Solarpark", text: "Modultische, Wechselrichter, Stationen" },
          zusatz: { titel: "Parkspeicher (optional)", text: "Verschieben bei negativen Preisen" },
          netz: { titel: "Netzbetreiber", text: "Netzebene 5 oder 4 (Umspannwerk)" },
          leitwarte: { titel: "SCADA-Leitwarte", text: "Verfügbarkeit, PR, Abregelung" },
        }}
        texte={{
          parkregler: "Unser EZA-Regler setzt Blindleistungs- und Wirkleistungsvorgaben des Netzbetreibers am Netzverknüpfungspunkt um – inklusive Einspeiselimit bei Überbauung.",
          fernwartung: "Gesicherter Zugang zu Wechselrichtern, Schutz, Zählern und Kameras – ohne Anfahrt reagieren, wo es möglich ist.",
          scada: "Leitwarte für einen oder viele Parks: Verfügbarkeit, Performance Ratio, Abregelungen und Vermarktungsdaten in einem System.",
        }}
        bild={{ src: "/Images/AT/technik/umspannwerk-obersielach.jpg", alt: "" }}
      />

      <Section tone="white" space="md" id="biodiversitaet">
        <SplitMedia
          reverse
          eyebrow="Biodiversität"
          title="Ein Solarpark kann mehr Artenvielfalt bringen als der Acker davor."
          text="Ökologisch geplante Freiflächenanlagen werden extensiv gepflegt, kommen ohne Dünger und Pflanzenschutzmittel aus und bieten Rückzugsräume. Mehrere Bundesländer verlangen dafür ein Ökologiekonzept."
          image={{ src: "/Images/AT/loesungen-a/ff-schafe-solarpark.jpg", alt: "Schafe weiden zwischen Modulreihen eines Solarparks (Symbolbild)" }}
        >
          <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {[
              { t: "Bodenfreiheit & Reihenabstand", x: "Für den EAG-Investitionszuschuss mindestens 80 cm Modulunterkante und 2 m zwischen den Reihen (ausgenommen innovative und nachgeführte Anlagen)." },
              { t: "Extensive Pflege", x: "Mahd mit Abtransport oder Schafbeweidung, Blühstreifen mit regionalem Saatgut." },
              { t: "Strukturen am Rand", x: "Hecken, Steinhaufen, Totholz und Kleingewässer als Lebensraum und Sichtschutz." },
              { t: "Durchlässige Zäune", x: "Bodenabstand oder Durchlässe für Kleintiere, Wildkorridore bei großen Parks." },
              { t: "Monitoring", x: "Vegetation und Insekten vor und nach dem Bau erheben, dokumentiert für Behörde und Nachhaltigkeitsbericht." },
            ].map((k) => (
              <li key={k.t} className="border-l-2 border-ov-300 pl-4">
                <p className="font-display text-[15.5px] font-bold text-ink-900">{k.t}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{k.x}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl bg-ov-50 px-5 py-4 text-[14.5px] leading-relaxed text-ink-700 ring-1 ring-ov-100">
            <strong className="text-ink-900">Doppelnutzung gewünscht?</strong> Soll die Fläche landwirtschaftlich vorrangig genutzt bleiben, ist{" "}
            <Link href="/agri-pv" className="text-ov-700 underline">Agri-PV</Link> oft die bessere Wahl – mit 30 % Förderzuschlag statt 25 % Abschlag.
          </p>
        </SplitMedia>
      </Section>

      <ZitatBand
        bild={{ src: "/Images/AT/loesungen-a/ff-solarpark-luftbild.jpg", alt: "", position: "center 60%" }}
        eyebrow="Erfahrung aus Eigentümersicht"
        titel="Wir bauen, was wir selbst betreiben würden."
        text="Die Gründer von Ökovolt betreiben seit 2012 eigene Solarparks. Über die Beteiligung an der ÖkoInvest GmbH sind wir an Freiflächen-, Agri-PV-, Contracting- und PPA-Projekten beteiligt. Deshalb planen wir Solarparks mit dem Blick eines Betreibers: auf Verfügbarkeit, Wartbarkeit und Erlöse über die gesamte Laufzeit – nicht nur bis zur Abnahme."
        fakten={[
          { icon: History, titel: "Seit 2012", text: "eigene Solarparks der Gründer – Betrieb aus erster Hand." },
          { icon: Cog, titel: "Eigene Systeme", text: "Parkregler, Fernwartung und SCADA aus eigener Entwicklung." },
        ]}
      >
        <div className="border-t border-white/15 pt-12">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Ablauf</p>
          <h2 className="ov-h3 mt-3 text-white md:text-[28px]">In sechs Schritten zum Solarpark</h2>
          <AblaufLeiste
              tone="dark"
              className="mt-10"
            items={[
              { icon: FileSearch, title: "Screening", text: "Fläche, Netz, Widmungschancen und Ökologie in wenigen Wochen bewerten – mit klarer Empfehlung: weiter oder stopp." },
              { icon: Handshake, title: "Sicherung", text: "Options- oder Pachtvertrag mit dem Grundeigentümer, Netzanfrage beim Netzbetreiber, Gespräch mit der Gemeinde." },
              { icon: Landmark, title: "Widmung & Genehmigung", text: "Umwidmung, Gutachten, elektrizitäts- und naturschutzrechtliche Verfahren, gegebenenfalls Förderantrag oder Gebot." },
              { icon: TrendingUp, title: "Vermarktung & Finanzierung", text: "PPA oder Direktvermarktung, Finanzierungsmodell, finale Wirtschaftlichkeit und Investitionsentscheidung." },
              { icon: HardHat, title: "Bau & Netzanschluss", text: "Unterkonstruktion, Module, Wechselrichter, Stationen, Kabeltrasse, Parkregler – Inbetriebnahme mit dem Netzbetreiber." },
              { icon: LineChart, title: "Betrieb", text: "Leitwarte, Wartung, Grünpflege, Reporting und Vermarktung über 25 Jahre und mehr." },
            ]}
          />
        </div>
      </ZitatBand>

      <Section tone="sand" space="md" id="fachdetails">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Für Technik, Einkauf & Grundeigentümer" title="Widmung, Netz, Erlöse und Pacht im Detail" />
          <div className="flex lg:justify-end">
            <StandPille>Stand 09/2026</StandPille>
          </div>
        </div>
        <FachTabs
          tabs={[
            { id: "flaechen", label: "Flächen" },
            { id: "widmung", label: "Widmung je Land" },
            { id: "wirtschaftlichkeit", label: "Erlöse & Beispiel" },
            { id: "netzanschluss", label: "Netzanschluss" },
            { id: "pacht", label: "Pacht" },
          ]}
        >
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:gap-14">
            <div>
              <h3 className="ov-h3 text-ink-900">Welche Fläche trägt einen Solarpark?</h3>
              <Prosa className="mt-4">
                <p>
                  Eine gute Solarpark-Fläche verbindet drei Dinge: Widmungschance, Netzanschluss in erreichbarer Entfernung und eine Einstrahlung
                  ohne nennenswerte Verschattung. Als Richtwert braucht ein Megawatt heute etwa 1 bis 1,5 Hektar, je nach Reihenabstand und
                  Geländeneigung.
                </p>
                <p>
                  Raumordnung und Förderung bevorzugen vorbelastete Flächen. Auf Deponien, Altlasten, Bergbau- und Infrastrukturstandorten entfällt
                  der 25-%-Abschlag bei Investitionszuschuss und Marktprämie – das verbessert die Wirtschaftlichkeit spürbar.
                </p>
              </Prosa>
              <Link href="/termin?art=video" className="mt-6 inline-flex items-center gap-2 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">Fläche kostenlos bewerten</Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { t: "Vorbelastung", x: "Deponie, Schottergrube, Brache, Lagerplatz, Flächen neben Autobahn oder Bahn." },
                { t: "Netz", x: "Mittelspannungsleitung oder Umspannwerk mit freier Kapazität, möglichst kurze Kabeltrasse." },
                { t: "Gelände", x: "eben bis südgeneigt, tragfähiger Boden, außerhalb von Hochwasserabfluss- und Schutzgebieten." },
                { t: "Umfeld", x: "Abstand zu Straßen (Autobahn 40 m, Schnellstraße 25 m nach Bundesstraßengesetz), Blendung, Landschaftsbild." },
              ].map((k) => (
                <li key={k.t} className="rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                  <p className="font-display text-[17px] font-bold text-ink-900">{k.t}</p>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">{k.x}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">Neun Bundesländer, neun Wege zur Widmung</h3>
            <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Freiflächen-Photovoltaik ist in Österreich Landessache: Ob und wo ein Solarpark entstehen darf, regeln Raumordnungsgesetze und
              Programme der Länder – umgesetzt über den Flächenwidmungsplan der Gemeinde.
            </p>
            <Tabelle
              className="mt-6"
              dicht
              caption="Widmung von PV-Freiflächenanlagen nach Bundesland"
              spalten={[
                { key: "land", label: "Bundesland", breite: "w-[26%]" },
                { key: "regel", label: "Kernregel für Freiflächen" },
              ]}
              zeilen={LAENDER}
              fuss="Quellen: Energie- und Umweltagentur NÖ / Raumordnung NÖ; Leitfaden 2026 für PV-Anlagen, Land Oberösterreich; Land Steiermark, Landesentwicklung; Land Burgenland, RIS. Vereinfachte Darstellung – Details, Ausnahmen und laufende Novellen im Ratgeber."
            />
            <Prosa className="mt-8 grid gap-6 xl:grid-cols-2 xl:gap-10 [&>*+*]:mt-0">
              <p>
                <strong>Neben der Widmung zählen weitere Verfahren:</strong> die elektrizitätsrechtliche Bewilligung des Landes (in
                Oberösterreich für Freiflächen über 1.000 kW), der Naturschutz (in Oberösterreich bewilligungspflichtig ab 500 m²
                Kollektorfläche im Grünland außerhalb geschlossener Ortschaften), das Wasserrecht in Hochwasserabfluss- und Schutzgebieten,
                das Straßenrecht und bei Flugplätzen ein Blendgutachten.
              </p>
              <p>
                <strong>Beschleunigungsgebiete</strong> nach der EU-Erneuerbaren-Richtlinie (RED III) werden 2026 von den Ländern verordnet;
                in Oberösterreich gelten Anlagen dort künftig als widmungsneutral. Wir verfolgen diese Verordnungen laufend. Vertiefung im
                Ratgeber <Link href="/ratgeber/freiflaechen-photovoltaik-widmung">Freiflächen-Photovoltaik: Widmung je Bundesland</Link>.
              </p>
            </Prosa>
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">Der Standort entscheidet über die Förderung, der Vertrag über die Rendite.</h3>
            <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Für Solarparks gibt es in Österreich drei Erlöswege: Marktprämie aus der EAG-Ausschreibung, Stromliefervertrag (PPA) oder freie
              Vermarktung an der Börse – oft kombiniert mit einem Speicher.
            </p>
            <Prosa className="mt-6 grid gap-6 xl:grid-cols-3 xl:gap-8 [&>*+*]:mt-0">
              <p>
                <strong>Marktprämie:</strong> Anlagen über 10 kWp bieten in Ausschreibungen einen anzulegenden Wert. 2026 gibt es vier
                Gebotstermine mit je 175.000 kWp Volumen und einem Höchstpreis von 7,77 ct/kWh; die Prämie läuft 20 Jahre. Auf
                landwirtschaftlich genutzten Flächen und im Grünland verringert sich der Zuschlagswert um 25 %.
              </p>
              <p>
                <strong>PPA:</strong> Ein Abnehmer kauft den Strom über 5 bis 15 Jahre zu einem fixen oder gedeckelten Preis. Das schafft
                Planungssicherheit für die Finanzierung. Mehr im Ratgeber <Link href="/ratgeber/ppa-oesterreich">PPA in Österreich</Link>.
              </p>
              <p>
                <strong>Negative Preise:</strong> In sonnenreichen Mittagsstunden fällt der Day-Ahead-Preis der Gebotszone Österreich
                zunehmend unter null. Parkregler und Direktvermarkter regeln dann ab; ein Speicher verschiebt Energie in den Abend. Die Preise
                sehen Sie live unter <Link href="/energie-live">Strommarkt Österreich live</Link>.
              </p>
            </Prosa>
            <h4 className="mt-10 font-display text-[19px] font-bold text-ink-900">Beispielrechnung: 5 MWp auf einer Konversionsfläche</h4>
            <Tabelle
              className="mt-5"
              dicht
              caption="Beispielrechnung Solarpark 5 MWp mit PPA"
              spalten={[
                { key: "pos", label: "Position", breite: "w-[30%]" },
                { key: "wert", label: "Annahme / Rechnung" },
                { key: "ergebnis", label: "Ergebnis", breite: "w-[22%]", className: "font-semibold text-ink-900" },
              ]}
              zeilen={BEISPIEL}
              fuss="Beispiel, Stand 09/2026 – kein Angebot. Annahmen zu Ertrag, PPA-Preis, Betriebskosten, Pacht und Investition sind Marktannahmen, keine Ökovolt-Preise. Nicht enthalten: Finanzierung, Steuern, Degradation, Abregelung, Speicher, Rückbau."
            />
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">Netzebene, TOR Erzeuger und Leitungsrechte</h3>
            <Prosa className="mt-6">
              <ul className="grid gap-x-10 gap-y-3 xl:grid-cols-2">
                <li><strong>Netzebene 5:</strong> Anschluss an eine Mittelspannungsleitung über eine kundeneigene Übergabestation – typisch für Parks von etwa 0,5 bis 10 MWp.</li>
                <li><strong>Netzebene 4:</strong> Anschluss am Umspannwerk des Netzbetreibers, bei größeren Parks auch mit eigenem Umspannfeld oder Transformator – dafür längere Planungs- und Lieferzeiten.</li>
                <li><strong>TOR Erzeuger Typ B</strong> (250 kW bis unter 35 MW): Blindleistungsbereitstellung, Wirkleistungsreduktion, Fault-Ride-Through, Fernwirkanbindung und Konformitätsnachweise der Einheiten und der Gesamtanlage.</li>
                <li><strong>Überbauung und Einspeiselimit:</strong> Ist die Kapazität begrenzt, kann ein Parkregler die Einspeisung am Netzverknüpfungspunkt dauerhaft deckeln – oft wirtschaftlicher, als auf die Netzverstärkung zu warten.</li>
                <li><strong>Leitungsrechte:</strong> Die Kabeltrasse zum Umspannwerk führt oft über fremde Grundstücke; Dienstbarkeiten sichern wir früh.</li>
              </ul>
              <p>
                Mehr zur Technik im Ratgeber <Link href="/ratgeber/tor-erzeuger-netzanschluss">TOR Erzeuger und Netzanschluss</Link> und zum
                Regler unter <Link href="/ratgeber/eza-regler-parkregler">EZA-Regler und Parkregler</Link>.
              </p>
            </Prosa>
          </div>

          <div>
            <h3 className="ov-h3 text-ink-900">Pacht statt Pflug – worauf es im Vertrag ankommt</h3>
            <p className="mt-2 max-w-3xl text-[15.5px] leading-relaxed text-ink-600">
              Ein Pachtvertrag für einen Solarpark bindet eine Fläche für eine Generation. Er sollte deshalb Erlöse, Sicherheiten und den Rückbau
              so klar regeln wie ein Kaufvertrag.
            </p>
            <Hebel
              className="mt-6"
              cols={2}
              items={[
                { icon: Handshake, titel: "Pachtmodell", text: "Fixpacht je Hektar mit Wertsicherung (VPI), erlösabhängige Pacht oder Mischmodell – Zahlung ab Baubeginn oder ab Inbetriebnahme, Optionsentgelt in der Planungsphase." },
                { icon: ScrollText, titel: "Laufzeit & Grundbuch", text: "25 bis 30 Jahre plus Verlängerungsoption; Dienstbarkeiten für Anlage, Kabeltrasse und Zufahrt werden grundbücherlich gesichert." },
                { icon: ClipboardCheck, titel: "Rückbau & Sicherheit", text: "Rückbauverpflichtung auf den ursprünglichen Zustand, abgesichert durch Bankgarantie oder Rücklage – der Investitionszuschuss verlangt rückstandslos rückbaubare Anlagen." },
                { icon: Sprout, titel: "Landwirtschaft & Steuer", text: "Beweidung oder Mahd unter den Modulen möglich; Folgen für Förderungen, Einheitswert und Einkommensteuer mit Landwirtschaftskammer und Steuerberatung klären." },
              ]}
            />
          </div>
        </FachTabs>
      </Section>

      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Investoren, Grundeigentümer und Gemeinden" />
            <p className="mt-10 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Selbst rechnen & prüfen</p>
            <RechnerLeiste
              className="mt-4"
              kompakt
              mini
              spaltenKlasse="grid-cols-1 sm:grid-cols-2 lg:grid-cols-1"
              items={[
                { icon: Calculator, titel: "Pacht- & Erlösrechner Freifläche", text: "", href: "/rechner/freiflaeche-pacht" },
                { icon: Leaf, titel: "CO₂- & ESG-Rechner", text: "", href: "/rechner/co2-esg" },
                { icon: MapPin, titel: "Standort-Check (eHORA)", text: "", href: "/standort-check" },
                { icon: Radio, titel: "Strommarkt Österreich live", text: "", href: "/energie-live" },
              ]}
            />
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Widmung, Netz und Vermarktung" />

      <CtaBand
        eyebrow="Fläche oder Projekt?"
        title="Lassen Sie uns Ihre Fläche ehrlich bewerten – bevor Sie sich binden."
        text="Erstgespräch per Video mit Einschätzung zu Widmungschancen, Netzanschluss, Vermarktung und Wirtschaftlichkeit."
        primary={{ label: v.cta, href: "/termin?art=video" }}
        secondary={{ label: "Projekt anfragen", href: "/angebot", icon: Cog }}
      />

      <Bildnachweis items={nachweise("duernrohr", "solarparkLuftbild", "widmungDornbirn", "spitalberg", "umspannwerk", "molln", "schafe")} />
    </div>
  );
}
