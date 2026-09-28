// service/reinigung/page.js – Österreich: PV-Reinigung (Ziel: Reinigungsauftrag nach Befund)

import { Bird, CloudRain, Droplets, Factory, Leaf, LineChart, Tractor, Warehouse } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import Hinweis from "@/components/ServiceAT/Hinweis";
import Weiterlesen from "@/components/ServiceAT/Weiterlesen";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Quellen from "@/components/ServiceAT/Quellen";

const PFAD = "/service/reinigung";
const TITEL = "PV-Reinigung für Gewerbe & Landwirtschaft | Ökovolt";
const BESCHREIBUNG =
  "Photovoltaik-Reinigung in Österreich: wann sie sich lohnt, Osmosewasser statt Hochdruck, Herstellervorgaben, Arbeitssicherheit und realistischer Mehrertrag.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const SITUATIONEN = [
  ["Schrägdach oder Aufständerung ab ca. 15°, ohne besondere Staubquelle", "gering – in gemäßigtem Klima meist unter 1 % pro Jahr", "keine Routine-Reinigung; Sichtprüfung im Rahmen der Wartung"],
  ["Flachdach, dachparallel oder unter 10° Neigung", "höher: Wasser und Schmutz sammeln sich an der unteren Rahmenkante", "jährliche Kontrolle, Reinigung nach Befund"],
  ["Landwirtschaft: Stallabluft, Futtermittel-, Getreide- und Erntestaub", "deutlich höher möglich, oft klebrig und festhaftend", "Reinigung nach Messung, häufig jährlich"],
  ["Vogelkot, Laub, Flechten punktuell", "kleine Fläche, große Wirkung: verschattete Zellen aktivieren Bypassdioden", "zeitnah entfernen; bei Wiederholung Thermografie"],
  ["Industrie- und Verkehrsemissionen (Zement, Holz, Gießerei, Bahn, Schotterwerk)", "hoch, teils mineralisch oder ölig", "Reinigung mit Herstellerfreigabe, Intervall nach Messung"],
];

const METHODEN = [
  ["Osmose- bzw. vollentsalztes Wasser mit weicher Bürste", "Standard für Dach und Freifläche", "Rückstandsfrei, keine Kalkflecken, ohne Reinigungsmittel", true],
  ["Wasserführende rotierende Bürste (Handgerät oder Maschine)", "Große Hallendächer, Freiflächen", "Effizient; Borstenart, Drehzahl und Anpressdruck nach Herstellerfreigabe", true],
  ["Reinigungsroboter", "Sehr große Anlagen mit durchgehenden Reihen", "In Mitteleuropa selten wirtschaftlich", "im Einzelfall"],
  ["Trockenreinigung (Bürste, Gebläse)", "Loser Staub ohne Wasseranschluss", "Kratzgefahr bei mineralischem Staub", "im Einzelfall"],
  ["Hochdruckreiniger", "–", "Kann Dichtungen, Rahmenverklebung und Antireflexschicht schädigen; gefährdet Garantie", false],
  ["Scheuermittel, Lösemittel, Glasreiniger", "–", "Greifen Beschichtungen an; nur mit ausdrücklicher Herstellerfreigabe", false],
];

const FAQ = [
  {
    q: "Muss man PV-Anlagen in Österreich überhaupt reinigen?",
    a: "Nicht routinemäßig. Bei geneigten Modulen reinigt der Regen einen Großteil selbst; eine europaweite Auswertung (DLR, 2025) nennt für gemäßigtes Klima und Wohngebiete meist unter 1 % Verlust pro Jahr. Anders ist es bei flacher Neigung, Landwirtschaft, Vogelkot und Industrieemissionen – dort lohnt sich Reinigung oft. Wir entscheiden nach Befund, nicht nach Kalender.",
  },
  {
    q: "Wie viel Mehrertrag bringt eine Reinigung?",
    a: "Das hängt von der Verschmutzung ab und lässt sich vorab messen: durch Vergleich verschmutzter und sauberer Stränge, der Performance Ratio vor und nach der Reinigung oder eines Referenzmoduls. Bei normal geneigten Dächern ohne Staubquelle ist der Effekt klein, bei Stall- oder Industriestaub und flachen Modulen deutlich größer. Wir nennen keine pauschalen Prozentwerte.",
  },
  {
    q: "Warum keine Hochdruckreiniger?",
    a: "Hoher Wasserdruck kann Rahmenabdichtungen, Anschlussdosen und die Antireflexbeschichtung schädigen und Wasser in das Modul drücken. Viele Hersteller schließen das in ihren Installationshandbüchern aus – ein Schaden durch falsche Reinigung ist dann kein Garantiefall.",
  },
  {
    q: "Welches Wasser wird verwendet?",
    a: "Vollentsalztes Wasser aus einer Osmose- oder Ionentauscher-Anlage. Es trocknet ohne Kalkflecken und braucht keine Reinigungsmittel. Normales Leitungswasser hinterlässt in vielen Regionen Kalkränder, die selbst wieder Licht kosten.",
  },
  {
    q: "Wann ist der beste Zeitpunkt für die Reinigung?",
    a: "Früh am Morgen, bei bedecktem Himmel oder am Abend, wenn die Module kühl sind – kaltes Wasser auf heißem Glas erzeugt Spannungen. Bei Frost reinigen wir nicht. In der Landwirtschaft bietet sich die Zeit nach der Ernte an, wenn der meiste Staub gefallen ist.",
  },
  {
    q: "Soll man Schnee von den Modulen entfernen?",
    a: "In der Regel nein. Kratzen und Schieben beschädigt Glas und Rahmen, und das Betreten des Daches im Winter ist gefährlich. Maßgeblich ist, dass Modul und Unterkonstruktion für die Schneelast am Standort ausgelegt sind (ÖNORM B 1991-1-3). Bei Sonderlagen beraten wir zu Schneeräumung durch Fachfirmen.",
  },
  {
    q: "Können Sie Reinigung und Wartung kombinieren?",
    a: "Ja. Im Wartungspaket Premium ist die Reinigung nach Bedarf mit vereinbartem Intervall vorgesehen, in Basis und Plus optional. Die Kombination spart Anfahrt und Absturzsicherung – und die Inspektion zeigt, ob überhaupt gereinigt werden muss.",
  },
];

export default function ReinigungPage() {
  return (
    <div>
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Reinigung von Photovoltaikanlagen", beschreibung: BESCHREIBUNG, serviceType: "PV-Modulreinigung", zielgruppe: "Gewerbe, Landwirtschaft, Gemeinden" })} />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "PV-Reinigung" }]}
        eyebrow="PV-Reinigung · nach Befund"
        title={<>Photovoltaik reinigen – <span className="ov-text-gradient">wo es sich lohnt</span></>}
        lead="In Österreich reinigt der Regen geneigte Module weitgehend selbst. Bei flachen Hallendächern, Stall- und Erntestaub, Vogelkot oder Industrieemissionen kostet Schmutz aber messbar Ertrag. Wir reinigen schonend mit vollentsalztem Wasser – nach Herstellervorgaben und mit Absturzsicherung."
        image={{ src: "/Images/AT/service/pv-reinigung.jpg", alt: "Techniker reinigt ein Solarmodul auf einem Flachdach von Hand" }}
        points={["Osmosewasser, keine Hochdruckreiniger", "Herstellerfreigaben beachtet", "Vorher-/Nachher-Nachweis", "Absturzsicherung nach BauV"]}
        actions={[
          { label: "Reinigung anfragen", href: "#anfrage" },
          { label: "Lohnt sich das?", href: "#wann", icon: LineChart },
        ]}
      />

      <Section tone="white" space="lg" id="wann" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Wann sinnvoll"
          title="Wann sich eine PV-Reinigung lohnt"
          lead="Eine Reinigung lohnt sich dort, wo Regen den Schmutz nicht mehr abwäscht: bei flacher Neigung, klebrigen oder mineralischen Ablagerungen und punktueller Verschattung durch Vogelkot oder Laub."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Tractor, title: "Landwirtschaft", text: "Stallabluft, Futtermittel- und Erntestaub bilden auf Stall- und Maschinenhallendächern festhaftende Schichten." },
            { icon: Warehouse, title: "Flachdach & geringe Neigung", text: "Unter etwa 10° läuft Wasser schlecht ab; an der unteren Rahmenkante bildet sich ein Schmutzrand, der die unterste Zellreihe verschattet." },
            { icon: Bird, title: "Vogelkot", text: "Schon kleine Flecken verschatten einzelne Zellen. Die Bypassdiode schaltet dann einen ganzen Modulabschnitt ab – und es droht ein Hotspot." },
            { icon: Factory, title: "Industrieemissionen", text: "Zement-, Holz-, Metall- oder Bremsstaub von Bahn und Straße haften stärker als Blütenstaub und werden vom Regen kaum gelöst." },
            { icon: Leaf, title: "Laub, Moos, Flechten", text: "Unter Bäumen und an schattigen Rändern wachsen organische Beläge, die sich mit der Zeit festsetzen." },
            { icon: CloudRain, title: "Und wann nicht?", text: "Bei geneigten Modulen ohne besondere Staubquelle ist der Verlust klein – dort reicht die Sichtprüfung bei der jährlichen Wartung." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Realistischer Mehrertrag"
              title="Was Verschmutzung wirklich kostet"
              lead="Verschmutzungsverluste („Soiling“) hängen stark vom Standort ab. Für Europa ergab eine Auswertung des DLR im Mittel 0,9 % pro Jahr, wenn Regen perfekt reinigt – und bis zu 5,3 %, wenn Regen nur wenig wirkt. In gemäßigtem Klima und Wohngebieten ist der Verlust meist unter 1 %."
            />
            <Hinweis ton="info" titel="Erst messen, dann reinigen" className="mt-8">
              <p>
                Wir vergleichen verschmutzte und saubere Stränge, prüfen die Performance Ratio im Monitoring und dokumentieren nach der Reinigung den Effekt. So sehen Sie, ob sich die
                Reinigung bezahlt macht – und in welchem Intervall.
              </p>
            </Hinweis>
          </div>
          <Tabelle
            kopf={["Situation", "Typischer Verlust", "Empfehlung"]}
            zeilen={SITUATIONEN}
            kompakt
            quelle="Einordnung nach DLR (Renewable Energy, 2025: „Photovoltaic soiling loss in Europe“) und IEA PVPS Task 13 (Soiling Losses, 2022). Werte je Anlage verschieden – Richtwerte, keine Zusage."
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Methoden"
          title="Wie wir reinigen – und was wir nie tun"
          lead="Maßgeblich ist das Installationshandbuch Ihres Modulherstellers. Die folgenden Methoden prüfen wir gegen diese Vorgaben, bevor wir ein Angebot machen."
          className="mb-10"
        />
        <Tabelle kopf={["Methode", "Einsatz", "Bewertung", "Bei Ökovolt"]} zeilen={METHODEN} kompakt />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Hinweis ton="recht" titel="Herstellervorgaben und Garantie">
            <p>
              Modulhersteller legen in ihren Installationshandbüchern fest, womit gereinigt werden darf – typischerweise weiche Materialien, Wasser ohne Zusätze, kein Hochdruck, keine
              Scheuermittel, nicht auf die Module steigen. Schäden durch unsachgemäße Reinigung sind in der Regel keine Garantiefälle. Wir dokumentieren Methode und Mittel im Reinigungsprotokoll.
            </p>
          </Hinweis>
          <Hinweis ton="achtung" titel="Arbeitssicherheit">
            <p>
              Nach § 7 Bauarbeiterschutzverordnung sind bei Dacharbeiten ab 2 m Absturzhöhe Schutzmaßnahmen nötig, Lichtkuppeln sind eigene Absturzstellen. Nasse Module sind rutschig,
              beschädigte Module oder Kabel können unter Spannung stehen. Als Auftraggeber koordinieren Sie mit uns nach § 8 ASchG die Sicherheit auf Ihrem Gelände.
            </p>
          </Hinweis>
        </div>
      </Section>

      <Section tone="green" space="lg">
        <SplitMedia
          eyebrow="Ablauf"
          title="Reinigung mit Nachweis"
          image={{ src: "/Images/Jobs/jobs2.jpg", alt: "Techniker zeigt auf die Oberfläche eines Solarmoduls auf einem Hallendach" }}
          text="Eine Reinigung ist nur so gut wie ihr Nachweis. Deshalb beginnt sie bei uns mit einem Befund und endet mit einem Vergleich."
          points={[
            { title: "Befund", text: "Monitoring-Auswertung, Fotos und Sichtprüfung – ist Reinigung nötig, und wo?" },
            { title: "Angebot", text: "Methode nach Herstellervorgabe, Wasseraufbereitung, Zugang und Absturzsicherung" },
            { title: "Reinigung", text: "Vollentsalztes Wasser, weiche Bürsten, kühle Module – ohne Chemie" },
            { title: "Nachweis", text: "Fotodokumentation und Ertragsvergleich vor und nach der Reinigung" },
          ]}
        />
      </Section>

      <AnfrageSektion
        titel="PV-Reinigung anfragen"
        lead="Beschreiben Sie Anlage und Verschmutzung – wir sagen Ihnen ehrlich, ob sich eine Reinigung lohnt, und machen ein Angebot mit Methode und Termin."
        schritte={["Sie senden Anlagendaten und am besten danach per E-Mail ein Foto der Verschmutzung.", "Wir prüfen Monitoring-Daten und Herstellervorgaben.", "Sie erhalten ein Angebot – oder den Rat, noch zu warten."]}
        formular={{
          betreff: "PV-Reinigung",
          thema: "Service & Wartung",
          titel: "Anfrage PV-Reinigung",
          absenden: "Reinigung anfragen",
          felder: [
            { name: "anlagengroesse", label: "Anlagengröße", typ: "zahl", einheit: "kWp", pflicht: true, placeholder: "z. B. 120" },
            { name: "anlagentyp", label: "Anlagentyp", typ: "auswahl", pflicht: true, optionen: ["Flachdach / Hallendach", "Schrägdach", "Stall / Maschinenhalle", "Freifläche", "Agri-PV", "Carport"] },
            { name: "neigung", label: "Modulneigung", typ: "auswahl", optionen: ["unter 10°", "10–20°", "über 20°", "unbekannt"] },
            { name: "verschmutzung", label: "Art der Verschmutzung", typ: "auswahl", optionen: ["Stall- oder Erntestaub", "Vogelkot", "Industrie- oder Verkehrsstaub", "Laub, Moos, Flechten", "Schmutzrand an der Rahmenkante", "Unklar – bitte prüfen"] },
            { name: "wasser", label: "Wasseranschluss am Dach / in der Nähe", typ: "auswahl", optionen: ["Ja", "Nein", "Unbekannt"] },
            { name: "zugang", label: "Zugang", typ: "auswahl", optionen: ["Innen- oder Außensteigleiter", "Hubsteiger nötig", "Freifläche befahrbar", "Unbekannt"] },
          ],
        }}
      />

      <Section tone="white" space="md">
        <Weiterlesen
          items={[
            { href: "/service/wartung", art: "Service", titel: "Wartungsvertrag", text: "Reinigung nach Bedarf im Paket Premium, optional in Basis und Plus." },
            { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie", text: "Hotspots durch Vogelkot und Verschattung sichtbar machen." },
            { href: "/technik/fernwartung", art: "Technik", titel: "Fernwartung & Monitoring", text: "Strangvergleich zeigt, ob Verschmutzung Ertrag kostet." },
            { href: "/ratgeber/photovoltaik-reinigung-wartung", art: "Ratgeber", titel: "Reinigung & Wartung", text: "Was wirklich nötig ist – und was nicht." },
            { href: "/ratgeber/schneelast-photovoltaik", art: "Ratgeber", titel: "Schneelast & Photovoltaik", text: "ÖNORM B 1991-1-3, Zonen und Modul-Prüflasten." },
            { href: "/landwirtschaft", art: "Lösung", titel: "Photovoltaik für die Landwirtschaft", text: "Stall, Scheune und Maschinenhalle richtig planen." },
          ]}
        />
      </Section>

      <FaqSektion items={FAQ} titel="PV-Reinigung – häufige Fragen" tone="sand" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Betrieb und Ertrag" />

      <Quellen
        items={[
          { titel: "DLR: Photovoltaic soiling loss in Europe – Geographical distribution and cleaning recommendations (Renewable Energy, 2025)", href: "https://elib.dlr.de/210457/1/Published_Paper_Photovoltaic%20soiling%20loss%20in%20Europe_Geographical%20distribution%20and%20cleaning%20recommendations.pdf" },
          { titel: "pv magazine: Researchers complete Europe's first PV soiling loss assessment (2024)", href: "https://www.pv-magazine.com/2024/12/11/researchers-complete-europes-first-pv-soiling-loss-assessment/" },
          { titel: "IEA PVPS Task 13: Soiling Losses – Impact on the Performance of Photovoltaic Power Plants (2022)", href: "https://iea-pvps.org/key-topics/soiling-losses-impact-on-the-performance-of-photovoltaic-power-plants/" },
          { titel: "Bauarbeiterschutzverordnung § 7 – Absturzgefahr", href: "https://www.jusline.at/gesetz/bauv/paragraf/7" },
          { titel: "ArbeitnehmerInnenschutzgesetz § 8 – Koordination", href: "https://www.jusline.at/gesetz/aschg/paragraf/8" },
        ]}
      />

      <CtaBand
        eyebrow="PV-Reinigung"
        title="Schmutz kostet Ertrag – aber nicht überall. Wir prüfen, wo."
        text="Befund, schonende Reinigung mit vollentsalztem Wasser und Nachweis des Effekts – für Hallendächer, Landwirtschaft und Freiflächen in ganz Österreich."
        primary={{ label: "Reinigung anfragen", href: "#anfrage" }}
        secondary={{ label: "Mit Wartung kombinieren", href: "/service/wartung", icon: Droplets }}
      />
    </div>
  );
}

