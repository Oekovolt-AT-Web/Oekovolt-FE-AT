// service/reinigung/page.js – Österreich: PV-Reinigung (Ziel: Reinigungsauftrag nach Befund)

import { AlertTriangle, Bird, Check, Droplets, Factory, Leaf, LineChart, ListChecks, Minus, Scale, Tractor, X } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import AntwortBand from "@/components/ServiceAT/A/AntwortBand";
import FotoBento from "@/components/ServiceAT/A/FotoBento";
import VerschmutzungsRegler from "@/components/ServiceAT/A/VerschmutzungsRegler";
import Akkordeon from "@/components/ServiceAT/A/Akkordeon";
import AnfragePremium from "@/components/ServiceAT/A/AnfragePremium";
import FaqPlus from "@/components/ServiceAT/A/FaqPlus";
import QuellenKompakt from "@/components/ServiceAT/A/QuellenKompakt";

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

function MethodeStatus({ wert }) {
  if (wert === true)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-ov-500/20 px-2.5 py-1 text-[12px] font-semibold text-ov-200 ring-1 ring-ov-400/30">
        <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
        Bei Ökovolt: ja
      </span>
    );
  if (wert === false)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-[12px] font-semibold text-red-300 ring-1 ring-red-400/30">
        <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
        Bei Ökovolt: nie
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-2.5 py-1 text-[12px] font-semibold text-white/75 ring-1 ring-white/15">
      <Minus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
      Bei Ökovolt: {wert}
    </span>
  );
}

export default function ReinigungPage() {
  return (
    <div>
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Reinigung von Photovoltaikanlagen", beschreibung: BESCHREIBUNG, serviceType: "PV-Modulreinigung", zielgruppe: "Gewerbe, Landwirtschaft, Gemeinden" })} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Service" }, { name: "PV-Reinigung" }]}
        eyebrow="PV-Reinigung · nach Befund"
        title={
          <>
            Photovoltaik reinigen – <span className="ov-text-gradient-light">wo es sich lohnt</span>
          </>
        }
        lead="In Österreich reinigt der Regen geneigte Module weitgehend selbst. Bei flachen Hallendächern, Stall- und Erntestaub, Vogelkot oder Industrieemissionen kostet Schmutz aber messbar Ertrag. Wir reinigen schonend mit vollentsalztem Wasser – nach Herstellervorgaben und mit Absturzsicherung."
        image={{ src: "/Images/AT/service/pv-reinigung.jpg", alt: "Techniker reinigt ein Solarmodul auf einem Flachdach von Hand", position: "60% 40%" }}
        points={["Osmosewasser, keine Hochdruckreiniger", "Herstellerfreigaben beachtet", "Vorher-/Nachher-Nachweis", "Absturzsicherung nach BauV"]}
        actions={[
          { label: "Reinigung anfragen", href: "#anfrage" },
          { label: "Lohnt sich das?", href: "#rechner", icon: LineChart },
        ]}
      />

      <AntwortBand
        frage="Muss man PV-Anlagen in Österreich überhaupt reinigen?"
        zahlen={[
          { value: 0.9, decimals: 1, suffix: " %", label: "Verlust pro Jahr im Europa-Mittel", text: "wenn Regen gut reinigt (DLR, 2025)" },
          { value: 5.3, decimals: 1, suffix: " %", label: "bis zu – wenn Regen wenig wirkt", text: "gleiche Auswertung, ungünstige Standorte" },
          { value: "< 1 %", label: "gemäßigtes Klima & Wohngebiete", text: "meist – keine Routine-Reinigung nötig" },
          { value: 2, suffix: " m", label: "Absturzhöhe", text: "ab hier Schutzmaßnahmen am Dach (§ 7 BauV)" },
        ]}
      >
        <p>
          <strong>Nicht routinemäßig.</strong> Bei geneigten Modulen reinigt der Regen einen Großteil selbst; eine europaweite Auswertung des DLR nennt für gemäßigtes Klima und
          Wohngebiete meist unter 1 % Verlust pro Jahr. Anders ist es bei flacher Neigung, Landwirtschaft, Vogelkot und Industrieemissionen – dort lohnt sich Reinigung oft. Wir entscheiden
          nach Befund, nicht nach Kalender.
        </p>
      </AntwortBand>

      {/* Wann sinnvoll */}
      <Section tone="white" space="md" id="wann" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
          <SectionHeading eyebrow="Wann sinnvoll" title="Wann sich eine PV-Reinigung lohnt" />
          <p className="ov-lead text-ink-600 lg:pb-1">
            Eine Reinigung lohnt sich dort, wo Regen den Schmutz nicht mehr abwäscht: bei flacher Neigung, klebrigen oder mineralischen Ablagerungen und punktueller Verschattung durch
            Vogelkot oder Laub.
          </p>
        </div>
        <FotoBento
          spalten={4}
          zeile={240}
          items={[
            {
              form: "hoch",
              bild: "/Images/AT/ratgeber/photovoltaik-flachdach.jpg",
              alt: "Große PV-Anlage auf einem flachen Hallendach im Gewerbegebiet",
              tag: "Häufigster Fall",
              titel: "Flachdach & geringe Neigung",
              text: "Unter etwa 10° läuft Wasser schlecht ab; an der unteren Rahmenkante bildet sich ein Schmutzrand, der die unterste Zellreihe verschattet.",
            },
            { ton: "sand", icon: <Tractor />, titel: "Landwirtschaft", text: "Stallabluft, Futtermittel- und Erntestaub bilden auf Stall- und Maschinenhallendächern festhaftende Schichten." },
            { ton: "sand", icon: <Bird />, titel: "Vogelkot", text: "Schon kleine Flecken verschatten einzelne Zellen. Die Bypassdiode schaltet dann einen ganzen Modulabschnitt ab – und es droht ein Hotspot." },
            {
              form: "hoch",
              bild: "/Images/Jobs/jobs3.jpg",
              alt: "Saubere, geneigte PV-Module unter blauem Himmel",
              tag: "Ehrlich gesagt",
              titel: "Und wann nicht?",
              text: "Bei geneigten Modulen ohne besondere Staubquelle ist der Verlust klein – dort reicht die Sichtprüfung bei der jährlichen Wartung.",
            },
            { ton: "sand", icon: <Factory />, titel: "Industrieemissionen", text: "Zement-, Holz-, Metall- oder Bremsstaub von Bahn und Straße haften stärker als Blütenstaub und werden vom Regen kaum gelöst." },
            { ton: "sand", icon: <Leaf />, titel: "Laub, Moos, Flechten", text: "Unter Bäumen und an schattigen Rändern wachsen organische Beläge, die sich mit der Zeit festsetzen." },
          ]}
        />
      </Section>

      {/* Rechner */}
      <Section tone="sand" space="md" id="rechner" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
          <SectionHeading eyebrow="Realistischer Mehrertrag" title="Was Verschmutzung wirklich kostet" />
          <p className="text-[16px] leading-relaxed text-ink-600 lg:pb-1">
            Verschmutzungsverluste („Soiling“) hängen stark vom Standort ab. Für Europa ergab eine Auswertung des DLR im Mittel 0,9 % pro Jahr, wenn Regen perfekt reinigt – und bis zu
            5,3 %, wenn Regen nur wenig wirkt. <strong className="text-ink-900">Erst messen, dann reinigen:</strong> Wir vergleichen verschmutzte und saubere Stränge, prüfen die
            Performance Ratio im Monitoring und dokumentieren nach der Reinigung den Effekt.
          </p>
        </div>
        <VerschmutzungsRegler />
        <Akkordeon
          className="mt-8"
          items={[
            {
              icon: <ListChecks />,
              titel: "Situationen, typische Verluste und unsere Empfehlung",
              kurz: "Richtwerte nach DLR und IEA PVPS Task 13",
              inhalt: (
                <Tabelle
                  kopf={["Situation", "Typischer Verlust", "Empfehlung"]}
                  zeilen={SITUATIONEN}
                  kompakt
                  quelle="Einordnung nach DLR (Renewable Energy, 2025: „Photovoltaic soiling loss in Europe“) und IEA PVPS Task 13 (Soiling Losses, 2022). Werte je Anlage verschieden – Richtwerte, keine Zusage."
                />
              ),
            },
          ]}
        />
      </Section>

      {/* Methoden dunkel */}
      <section id="methoden" className="ov-noise relative scroll-mt-24 overflow-hidden bg-navy-950 py-20 text-white md:py-24">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="ov-container relative">
          <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
            <SectionHeading dark eyebrow="Methoden" title="Wie wir reinigen – und was wir nie tun" />
            <p className="ov-lead text-white/70 lg:pb-1">
              Maßgeblich ist das Installationshandbuch Ihres Modulherstellers. Die folgenden Methoden prüfen wir gegen diese Vorgaben, bevor wir ein Angebot machen.
            </p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {METHODEN.map(([methode, einsatz, bewertung, status], i) => (
              <Reveal
                as="li"
                key={methode}
                delay={(i % 3) * 70}
                className={cn("flex flex-col rounded-3xl p-6 ring-1", status === false ? "bg-red-500/[0.06] ring-red-400/20" : "bg-white/[0.05] ring-white/10")}
              >
                <MethodeStatus wert={status} />
                <h3 className="mt-4 font-display text-[18px] font-bold leading-snug">{methode}</h3>
                {einsatz !== "–" && <p className="mt-2 text-[13.5px] font-medium text-white/50">Einsatz: {einsatz}</p>}
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{bewertung}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Reveal className="ov-glass flex gap-4 rounded-3xl p-6">
              <Scale aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-300" />
              <div className="text-[14.5px] leading-relaxed text-white/70">
                <p className="font-display text-[16.5px] font-bold text-white">Herstellervorgaben und Garantie</p>
                <p className="mt-1.5">
                  Modulhersteller legen in ihren Installationshandbüchern fest, womit gereinigt werden darf – typischerweise weiche Materialien, Wasser ohne Zusätze, kein Hochdruck, keine
                  Scheuermittel, nicht auf die Module steigen. Schäden durch unsachgemäße Reinigung sind in der Regel keine Garantiefälle. Wir dokumentieren Methode und Mittel im
                  Reinigungsprotokoll.
                </p>
              </div>
            </Reveal>
            <Reveal delay={80} className="ov-glass flex gap-4 rounded-3xl p-6">
              <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sun-300" />
              <div className="text-[14.5px] leading-relaxed text-white/70">
                <p className="font-display text-[16.5px] font-bold text-white">Arbeitssicherheit</p>
                <p className="mt-1.5">
                  Nach § 7 Bauarbeiterschutzverordnung sind bei Dacharbeiten ab 2 m Absturzhöhe Schutzmaßnahmen nötig, Lichtkuppeln sind eigene Absturzstellen. Nasse Module sind rutschig,
                  beschädigte Module oder Kabel können unter Spannung stehen. Als Auftraggeber koordinieren Sie mit uns nach § 8 ASchG die Sicherheit auf Ihrem Gelände.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FaqPlus
        items={FAQ}
        titel="PV-Reinigung – häufige Fragen"
        links={[
          { href: "/service/wartung", art: "Service", titel: "Wartungsvertrag" },
          { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie" },
          { href: "/technik/fernwartung", art: "Technik", titel: "Fernwartung & Monitoring" },
          { href: "/ratgeber/photovoltaik-reinigung-wartung", art: "Ratgeber", titel: "Reinigung & Wartung" },
          { href: "/ratgeber/schneelast-photovoltaik", art: "Ratgeber", titel: "Schneelast & Photovoltaik" },
          { href: "/landwirtschaft", art: "Lösung", titel: "Photovoltaik für die Landwirtschaft" },
        ]}
      />

      <AnfragePremium
        titel="PV-Reinigung anfragen"
        lead="Beschreiben Sie Anlage und Verschmutzung – wir sagen Ihnen ehrlich, ob sich eine Reinigung lohnt, und machen ein Angebot mit Methode und Termin. Eine Reinigung ist nur so gut wie ihr Nachweis: Sie beginnt mit einem Befund und endet mit einem Vergleich."
        schritteTitel="Reinigung mit Nachweis – so läuft es ab"
        schritte={[
          { titel: "Befund", text: "Monitoring-Auswertung, Fotos und Sichtprüfung – ist Reinigung nötig, und wo?" },
          { titel: "Angebot", text: "Methode nach Herstellervorgabe, Wasseraufbereitung, Zugang und Absturzsicherung." },
          { titel: "Reinigung", text: "Vollentsalztes Wasser, weiche Bürsten, kühle Module – ohne Chemie." },
          { titel: "Nachweis", text: "Fotodokumentation und Ertragsvergleich vor und nach der Reinigung." },
        ]}
        formular={{
          betreff: "PV-Reinigung",
          thema: "Service & Wartung",
          titel: "Anfrage PV-Reinigung",
          text: "Am besten senden Sie uns danach per E-Mail ein Foto der Verschmutzung.",
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

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Betrieb und Ertrag" />

      <QuellenKompakt
        titel="Quellen & Rechtsgrundlagen"
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
