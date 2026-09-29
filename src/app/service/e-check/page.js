// service/e-check/page.js – Österreich: wiederkehrende Prüfung elektrischer Anlagen / PV (Ziel: Prüfauftrag)

import { BookOpen, ClipboardCheck, FileCheck2, FileSearch, Gauge, HardHat, Hourglass, ListChecks, Scale, ShieldCheck, UserCheck, Zap } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import AntwortBand from "@/components/ServiceAT/A/AntwortBand";
import PruefFristenFinder from "@/components/ServiceAT/A/PruefFristenFinder";
import Tabs from "@/components/ServiceAT/A/Tabs";
import AnfragePremium from "@/components/ServiceAT/A/AnfragePremium";
import FaqPlus from "@/components/ServiceAT/A/FaqPlus";
import QuellenKompakt from "@/components/ServiceAT/A/QuellenKompakt";

const PFAD = "/service/e-check";
const TITEL = "E-Check & Anlagenprüfung nach OVE E 8101 | Ökovolt";
const BESCHREIBUNG =
  "Wiederkehrende Prüfung von PV- und Elektroanlagen in Österreich: Prüfbefund nach OVE E 8101 und EN 62446, Fristen nach ESV 2012, Anlagenbuch für Arbeitgeber.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const REGELN = [
  ["Elektrotechnikgesetz 1992 und ETV 2020", "Erklären elektrotechnische Sicherheitsvorschriften für verbindlich; für Niederspannungsanlagen ist das die OVE E 8101", "Errichter und Betreiber elektrischer Anlagen"],
  ["OVE E 8101, Teil 6", "Erst- und wiederkehrende Prüfung (Besichtigen, Erproben, Messen), Dokumentation mit Prüfbefund und Anlagenbuch; Abschnitt 712 regelt PV-Anlagen", "Elektrofachkraft, die prüft"],
  ["OVE EN 62446-1", "PV-spezifische Prüfungen und Dokumentation: Prüfkategorie 1 für alle Anlagen, Kategorie 2 zusätzlich mit I-U-Kennlinie und Thermografie", "PV-Anlagen jeder Größe"],
  ["Elektroschutzverordnung 2012 (ESV 2012)", "Prüfung vor Inbetriebnahme und nach wesentlichen Änderungen (§ 8), wiederkehrende Prüfung (§ 9), Kontrollen (§ 7), Prüfbefund und Aufbewahrung (§ 11)", "Arbeitgeber – für Anlagen, mit denen Beschäftigte in Berührung kommen"],
  ["OVE-Richtlinie R 11-1", "Zusätzliche Anforderungen zum Schutz von Einsatzkräften bei PV-Anlagen – auch für die wiederkehrende Prüfung", "Betreiber, Feuerwehr, Versicherer"],
  ["Versicherungsbedingungen", "Häufig Obliegenheit, gesetzliche Prüfungen durchführen und Mängel beheben zu lassen – Nachweis über den Prüfbefund", "Versicherungsnehmer"],
];

const FRISTEN = [
  ["Regelfall", "längstens 5 Jahre", "§ 9 Abs. 2 ESV 2012"],
  ["Geringe Beanspruchung (z. B. Büros, Handel und Dienstleistung ohne besondere Einflüsse)", "bis zu 10 Jahre", "§ 9 ESV 2012"],
  ["Explosionsgefährdete Bereiche", "3 Jahre (bei zusätzlicher besonderer Beanspruchung 1 Jahr)", "§ 9 ESV 2012"],
  ["Baustellen", "1 Jahr", "§ 9 ESV 2012"],
  ["Besondere Beanspruchung (Nässe, Temperaturen unter −20 °C oder über 40 °C, Korrosion, Witterung, Staub)", "Behörde kann kürzere Fristen vorschreiben; bei mehreren Einflüssen jährlich", "§ 9 ESV 2012"],
  ["Funktionskontrolle Fehlerstrom-Schutzschalter (Prüftaste)", "Herstellerintervall, sonst mindestens alle 6 Monate", "§ 7 ESV 2012"],
];

const MESSUNGEN = [
  ["Sichtprüfung", "Module, Unterkonstruktion, Kabelführung, Steckverbinder, Kennzeichnung, Brandabschnitte, Freischaltstelle", "OVE E 8101 Teil 6, OVE R 11-1"],
  ["Schutzleiter & Potentialausgleich", "Durchgängigkeit, Verbindung der Gestelle, Blitzschutz-Trennungsabstände", "OVE E 8101, OVE EN 62446-1"],
  ["DC-Strang", "Polarität, Leerlaufspannung, Kurzschluss- oder Betriebsstrom je Strang, Vergleich der Stränge", "OVE EN 62446-1 (Kategorie 1)"],
  ["Isolationswiderstand", "DC- und AC-seitig gegen Erde", "OVE EN 62446-1, OVE E 8101"],
  ["AC-Seite", "Schleifenimpedanz/Abschaltbedingungen, Fehlerstrom-Schutzschalter, Überspannungsschutz", "OVE E 8101"],
  ["Erweitert (Kategorie 2)", "I-U-Kennlinien je Strang, Infrarot-Thermografie des Generators", "OVE EN 62446-1, IEC TS 62446-3"],
];

const FAQ = [
  {
    q: "Was ist ein E-Check in Österreich?",
    a: "„E-Check“ ist ein Begriff aus Deutschland. In Österreich meint man damit die wiederkehrende Überprüfung einer elektrischen Anlage durch eine Elektrofachkraft nach OVE E 8101. Das Ergebnis ist ein Prüfbefund, der im Anlagenbuch abgelegt wird. Für PV-Anlagen kommen die Prüfungen nach OVE EN 62446-1 dazu.",
  },
  {
    q: "Wie oft müssen Unternehmen ihre elektrischen Anlagen prüfen lassen?",
    a: "Nach § 9 ESV 2012 in der Regel längstens alle fünf Jahre. Bei geringer Beanspruchung, etwa in Büros, sind bis zu zehn Jahre möglich, in explosionsgefährdeten Bereichen drei Jahre, auf Baustellen ein Jahr. Bei besonderer Beanspruchung durch Nässe, Temperatur, Staub oder Witterung kann die Behörde kürzere Fristen vorschreiben.",
  },
  {
    q: "Gilt die ESV 2012 auch für die PV-Anlage auf dem Hallendach?",
    a: "Die ESV 2012 gilt für elektrische Anlagen und Betriebsmittel in Arbeitsstätten und auf Baustellen – also auch für eine PV-Anlage, die zur elektrischen Anlage des Betriebs gehört. Die PV-Anlage ist Wind, Wetter und Temperaturwechseln ausgesetzt; wir empfehlen deshalb, die Höchstfrist nicht auszureizen und das Intervall mit Versicherer und Wartung abzustimmen.",
  },
  {
    q: "Was steht in einem Prüfbefund?",
    a: "Nach § 11 ESV 2012 mindestens Prüfdatum, Name und Unterschrift der prüfenden Person sowie Umfang und Ergebnis der Prüfung. Unsere Prüfberichte enthalten zusätzlich alle Messwerte, eine Mängelliste mit Dringlichkeit, Fotos und die empfohlene nächste Prüffrist.",
  },
  {
    q: "Wie lange müssen Prüfbefunde aufbewahrt werden?",
    a: "Schaltpläne, Unterlagen und die Befunde der Prüfung vor Inbetriebnahme bis zur Stilllegung der Anlage, von wiederkehrenden Prüfungen zumindest die letzten beiden Befunde (§ 11 ESV 2012). Praktisch gehört alles ins Anlagenbuch – digital oder in Papierform.",
  },
  {
    q: "Wer darf die Prüfung durchführen?",
    a: "Die Prüfung muss eine Elektrofachkraft durchführen, die über die nötigen Kenntnisse verfügt und vergleichbare Anlagen geprüft hat. Ökovolt ist im Gewerbe Elektrotechnik eingetragen. Die Verantwortung für die Umsetzung der Maßnahmen bleibt auch bei externer Prüfung beim Arbeitgeber.",
  },
  {
    q: "Was kostet die Prüfung einer Gewerbe-PV-Anlage?",
    a: "Der Aufwand hängt von der Anlagengröße, der Anzahl der Stränge und Wechselrichter, der Zugänglichkeit und dem Prüfumfang (Kategorie 1 oder 2, mit oder ohne Thermografie) ab. Senden Sie uns die Eckdaten – Sie erhalten ein Angebot. In den Wartungspaketen Plus und Premium ist die Prüfung im vereinbarten Intervall enthalten.",
  },
  {
    q: "Was passiert, wenn bei der Prüfung Mängel gefunden werden?",
    a: "Mängel werden im Prüfbefund nach Dringlichkeit eingestuft. Gefährliche Mängel müssen sofort behoben oder der betroffene Anlagenteil außer Betrieb genommen werden. Wir bieten die Behebung aus einer Hand an und dokumentieren sie mit einer Nachprüfung.",
  },
];

export default function ECheckPage() {
  return (
    <div>
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "E-Check und wiederkehrende Prüfung von PV- und Elektroanlagen", beschreibung: BESCHREIBUNG, serviceType: "Wiederkehrende Prüfung elektrischer Anlagen" })} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Service" }, { name: "E-Check & Anlagenprüfung" }]}
        eyebrow="E-Check · Wiederkehrende Prüfung"
        title={
          <>
            E-Check für PV-Anlagen – <span className="ov-text-gradient-light">Prüfbefund nach OVE E 8101</span>
          </>
        }
        lead="In Österreich heißt der E-Check „wiederkehrende Überprüfung“: Eine Elektrofachkraft besichtigt, erprobt und misst die Anlage und hält das Ergebnis im Prüfbefund fest. Für Arbeitgeber ist das Pflicht – für Versicherung, Garantie und Sicherheit ohnehin sinnvoll."
        image={{ src: "/Images/AT/technik-service/techniker-messung-schaltschrank.jpg", alt: "Elektrofachkraft prüft die Verdrahtung eines Schaltschranks mit Messgerät", position: "30% 40%" }}
        points={["Prüfung nach OVE E 8101 & OVE EN 62446-1", "Fristen nach ESV 2012", "Prüfbefund & Anlagenbuch", "Mängelbehebung aus einer Hand"]}
        actions={[
          { label: "Prüfung beauftragen", href: "#anfrage" },
          { label: "Prüffrist ermitteln", href: "#fristen", icon: Hourglass },
        ]}
      />

      <AntwortBand
        frage="Was ist ein E-Check in Österreich?"
        zahlen={[
          { value: 5, suffix: " Jahre", label: "längste Frist im Regelfall", text: "wiederkehrende Prüfung, § 9 Abs. 2 ESV 2012" },
          { value: 10, suffix: " Jahre", label: "bei geringer Beanspruchung", text: "z. B. Büros ohne besondere Einflüsse" },
          { value: 6, suffix: " Monate", label: "FI-Prüftaste spätestens", text: "sofern der Hersteller nichts anderes vorgibt (§ 7)" },
          { value: 2, label: "letzte Prüfbefunde aufbewahren", text: "Erstprüfung bis zur Stilllegung (§ 11)" },
        ]}
      >
        <p>
          <strong>„E-Check“ ist ein Begriff aus Deutschland; in Österreich spricht man von der wiederkehrenden Überprüfung elektrischer Anlagen nach OVE E 8101.</strong> Sie wird von
          einer Elektrofachkraft durchgeführt und mit einem Prüfbefund abgeschlossen, der im Anlagenbuch abgelegt wird. Für PV-Anlagen kommen die Prüfungen nach OVE EN 62446-1 dazu.
        </p>
      </AntwortBand>

      {/* Prüffristen-Finder */}
      <Section tone="sand" space="md" id="fristen" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
          <SectionHeading eyebrow="Prüfintervalle" title="Prüffristen nach ESV 2012 – in zwei Klicks" />
          <p className="ov-lead text-ink-600 lg:pb-1">
            Arbeitgeber müssen elektrische Anlagen wiederkehrend prüfen lassen – im Regelfall längstens alle fünf Jahre. Kürzere Fristen können sich aus Beanspruchung, Bescheid,
            Versicherung oder Herstellervorgaben ergeben.
          </p>
        </div>
        <PruefFristenFinder />
      </Section>

      {/* Begriff mit Foto */}
      <Section tone="white" space="md">
        <SplitMedia
          eyebrow="Begriff"
          title="Was „E-Check“ in Österreich bedeutet"
          image={{ src: "/Images/AT/technik-service/messung-isolation.jpg", alt: "Nahaufnahme: Digitalmultimeter in der Hand bei einer Messung" }}
          text={[
            "Das Anlagenbuch ist die Dokumentation der Anlage: Schaltpläne, Stromlaufpläne, Datenblätter, Erstprüfung, alle wiederkehrenden Prüfbefunde und Änderungen. Die OVE E 8101 beschreibt in Teil 6 die Mindestinhalte. Für PV-Anlagen gehören Stringplan, Modul- und Wechselrichterdaten sowie die Messprotokolle nach OVE EN 62446-1 dazu.",
            "Die Prüfung vor Inbetriebnahme stellt fest, dass die Anlage richtig errichtet wurde. Die wiederkehrende Prüfung stellt fest, dass sie es noch ist – trotz UV-Strahlung, Temperaturwechseln, Schnee, Marderbiss oder nachträglicher Umbauten.",
          ]}
        >
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              { icon: FileCheck2, t: "Prüfbefund", x: "Datum, Prüfer, Unterschrift, Umfang und Ergebnis – plus Messwerte und Mängelliste." },
              { icon: BookOpen, t: "Anlagenbuch", x: "Alle Pläne und Befunde von der Errichtung bis zur Stilllegung an einem Ort." },
              { icon: Gauge, t: "Messungen", x: "Isolationswiderstand, Schutzleiter, Strangwerte, Abschaltbedingungen, FI-Schutz." },
              { icon: ShieldCheck, t: "Sicherheit", x: "Schutz vor elektrischem Schlag und Brand – für Beschäftigte und Einsatzkräfte." },
            ].map((k) => (
              <li key={k.t} className="flex gap-3 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
                <k.icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                <span className="text-[14.5px] leading-snug text-ink-700">
                  <strong className="block text-ink-900">{k.t}</strong>
                  {k.x}
                </span>
              </li>
            ))}
          </ul>
        </SplitMedia>
      </Section>

      {/* Pflichten dunkel */}
      <section className="ov-noise relative overflow-hidden bg-navy-950 py-20 text-white md:py-24">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="ov-container relative">
          <SectionHeading dark eyebrow="Pflichten" title="Was Arbeitgeber konkret tun müssen" className="mb-12" />
          <FeatureGrid
            cols={3}
            tone="dark"
            items={[
              { icon: UserCheck, title: "Prüfen lassen", text: "Vor Inbetriebnahme, nach wesentlichen Änderungen oder Instandsetzung und wiederkehrend – durch eine fachkundige Elektrofachkraft." },
              { icon: ListChecks, title: "Kontrollen organisieren", text: "Regelmäßige Kontrollen durch eine elektrotechnisch unterwiesene Person, z. B. Test der FI-Schutzschalter mindestens alle sechs Monate, mit Vormerk." },
              { icon: HardHat, title: "Mängel beheben", text: "Festgestellte Mängel beseitigen lassen. Die Verantwortung bleibt beim Arbeitgeber, auch wenn extern geprüft wird." },
              { icon: BookOpen, title: "Dokumente aufbewahren", text: "Pläne und Erstprüfbefund bis zur Stilllegung, wiederkehrende Befunde zumindest die letzten beiden." },
              { icon: FileSearch, title: "Bei Kontrolle vorlegen", text: "Die Arbeitsinspektion kann Prüfbefunde verlangen – ebenso Versicherer im Schadenfall." },
              { icon: Zap, title: "Änderungen melden", text: "Erweiterungen, Speicher oder Ladepunkte sind wesentliche Änderungen: neue Prüfung, aktualisiertes Anlagenbuch, ggf. Meldung an den Netzbetreiber." },
            ]}
          />
        </div>
      </section>

      {/* Prüfumfang + Rechtsgrundlagen in Tabs */}
      <Section tone="white" space="md" id="pruefumfang" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
          <SectionHeading eyebrow="Prüfumfang & Rechtsgrundlagen" title="Was wir bei einer PV-Anlage prüfen und messen" />
          <p className="ov-lead text-ink-600 lg:pb-1">Die Prüfung verbindet die allgemeinen Anforderungen der OVE E 8101 mit den PV-spezifischen Prüfungen der OVE EN 62446-1.</p>
        </div>
        <Tabs
          label="Prüfumfang und Rechtsgrundlagen"
          tabs={[
            { label: "Prüfschritte & Messungen", icon: <Gauge /> },
            { label: "Welche Regeln die Prüfung verlangen", icon: <Scale /> },
            { label: "Alle Fristen als Tabelle", icon: <Hourglass /> },
          ]}
        >
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MESSUNGEN.map(([schritt, inhalt, grundlage], i) => (
              <Reveal as="li" key={schritt} delay={(i % 3) * 70} className="ov-card-hover flex flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                <span className="font-display text-[13px] font-bold text-ov-700">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-[18px] font-bold text-ink-900">{schritt}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-600">{inhalt}</p>
                <p className="mt-4 inline-flex self-start rounded-full bg-white px-2.5 py-1 text-[11.5px] font-semibold text-ink-600 ring-1 ring-ink-200">{grundlage}</p>
              </Reveal>
            ))}
          </ol>
          <div>
            <p className="mb-5 max-w-3xl text-[16px] leading-relaxed text-ink-600">
              Die Pflicht zur Prüfung ergibt sich in Österreich aus mehreren Regelwerken – für Unternehmen ist die Elektroschutzverordnung der wichtigste Hebel.
            </p>
            <Tabelle kopf={["Regelwerk", "Was es verlangt", "Adressat"]} zeilen={REGELN} kompakt quelle="Überblick, keine Rechtsberatung. Stand September 2026." />
          </div>
          <Tabelle
            caption="Prüffristen nach ESV 2012"
            kopf={["Situation", "Frist", "Grundlage"]}
            zeilen={FRISTEN}
            kompakt
            quelle="Quelle: Elektroschutzverordnung 2012, BGBl. II Nr. 33/2012 in der geltenden Fassung (RIS). Unsere Empfehlung für PV-Anlagen: Intervall mit Versicherer und Wartungsvertrag abstimmen und zwischen den Prüfungen jährlich eine Sichtprüfung mit Monitoring-Auswertung."
          />
        </Tabs>
      </Section>

      <AnfragePremium
        eyebrow="Anfrage"
        titel="Prüfung für Ihre Anlage beauftragen"
        lead="Teilen Sie uns die Eckdaten mit – wir melden uns mit Prüfumfang, Termin und Angebot. Auf Wunsch kombinieren wir die Prüfung mit Thermografie oder einem Wartungsvertrag."
        schritteTitel="So läuft die Prüfung ab"
        schritte={[
          { titel: "Unterlagen", text: "Anlagenbuch, Schaltpläne, Stringplan und letzter Prüfbefund – fehlt etwas, rekonstruieren wir es." },
          { titel: "Besichtigen", text: "Sichtprüfung von Generator, Kabelwegen, Verteilern, Wechselrichtern und Kennzeichnung." },
          { titel: "Erproben & Messen", text: "Messungen DC und AC mit kalibrierten Geräten, Funktionsprüfung der Schutzeinrichtungen." },
          { titel: "Prüfbefund", text: "Befund mit Messwerten, Mängelliste nach Dringlichkeit und empfohlener nächster Frist." },
        ]}
        formular={{
          betreff: "E-Check / wiederkehrende Prüfung",
          thema: "Service & Wartung",
          titel: "Anfrage Anlagenprüfung",
          absenden: "Prüfung anfragen",
          felder: [
            { name: "anlagengroesse", label: "PV-Leistung", typ: "zahl", einheit: "kWp", pflicht: true, placeholder: "z. B. 180" },
            { name: "baujahr", label: "Baujahr / Inbetriebnahme", typ: "zahl", placeholder: "z. B. 2016" },
            { name: "wechselrichter", label: "Wechselrichter (Hersteller, Anzahl)", placeholder: "z. B. 4× SMA Sunny Tripower", breit: true },
            { name: "letzte_pruefung", label: "Letzter Prüfbefund", typ: "auswahl", optionen: ["Innerhalb der letzten 2 Jahre", "Vor 3–5 Jahren", "Vor mehr als 5 Jahren", "Nur Erstprüfung vorhanden", "Unbekannt"] },
            { name: "anlass", label: "Anlass", typ: "auswahl", pflicht: true, optionen: ["Wiederkehrende Prüfung (ESV 2012)", "Auflage der Versicherung", "Nach Erweiterung / Speicher / Ladepunkten", "Kauf oder Übernahme der Anlage", "Nach Schaden (Sturm, Hagel, Marder)", "Sonstiges"] },
            { name: "umfang", label: "Gewünschter Umfang", typ: "auswahl", optionen: ["Prüfung nach OVE E 8101 + EN 62446-1 Kategorie 1", "Zusätzlich Kategorie 2 (I-U-Kennlinien, Thermografie)", "Bitte beraten"] },
          ],
        }}
      />

      <FaqPlus
        items={FAQ}
        titel="E-Check & Anlagenprüfung – häufige Fragen"
        links={[
          { href: "/service/wartung", art: "Service", titel: "Wartungsvertrag" },
          { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie" },
          { href: "/service/versicherung", art: "Service", titel: "PV-Versicherung" },
          { href: "/ratgeber/e-check-photovoltaik", art: "Ratgeber", titel: "E-Check Photovoltaik" },
          { href: "/ratgeber/photovoltaik-brandschutz", art: "Ratgeber", titel: "Brandschutz bei PV-Anlagen" },
          { href: "/forderungen/richtlinien", art: "Recht", titel: "Richtlinien & Netzanschluss" },
          { href: "/technik/fernwartung", art: "Technik", titel: "Fernwartung" },
          { href: "/gewerbe", art: "Lösung", titel: "Photovoltaik für Gewerbe & Industrie" },
        ]}
      />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Prüfung, Sicherheit und Betrieb" />

      <QuellenKompakt
        titel="Quellen & Rechtsgrundlagen"
        bildnachweis="Techniker am Schaltschrank: AndGra (Pixabay), CC0 · Multimeter: Lance Cpl. Trent A. Henry, U.S. Marine Corps, gemeinfrei – beide via Wikimedia Commons."
        items={[
          { titel: "Elektroschutzverordnung 2012 (ESV 2012), RIS", href: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007682", hinweis: "§ 7 Kontrollen, § 8 Prüfung vor Inbetriebnahme, § 9 wiederkehrende Prüfungen, § 11 Prüfbefunde" },
          { titel: "Kommentierte ESV 2012 – Arbeitsinspektion", href: "https://www.arbeitsinspektion.gv.at/Arbeitsstaetten-_Arbeitsplaetze/Elektrische_Anlagen/Kommentierte_Elektroschutzverordnung_2012.html" },
          { titel: "OVE E 8101 – Normenseite des OVE", href: "https://www.ove.at/ove-standardization/normen-produkte/ove-e-8101/" },
          { titel: "KFE-Empfehlung ET 100-4:2020 – Anwendung der OVE E 8101", href: "https://kfe.at/medien/empfehlungen/349-kfe-empfehlung-et100-4_2020-anwendung-ove-e-8101/file.html" },
          { titel: "OVE-Richtlinie R 11-1 (Ausgabe 2022) – Schutz von Einsatzkräften bei PV-Anlagen", href: "https://www.ove.at/ove-news/details/normen-und-richtlinien-fuer-photovoltaik-anlagen/" },
          { titel: "OVE EN 62446-1 – Prüfung, Dokumentation und Instandhaltung von PV-Systemen", hinweis: "Prüfkategorien 1 und 2" },
        ]}
      />

      <CtaBand
        eyebrow="Anlagenprüfung"
        title="Prüfbefund fällig? Wir prüfen Ihre PV- und Elektroanlage."
        text="Prüfung nach OVE E 8101 und OVE EN 62446-1, Messprotokolle, Mängelliste und Behebung aus einer Hand – für Anlagen von Ökovolt und anderen Errichtern in ganz Österreich."
        primary={{ label: "Prüfung beauftragen", href: "#anfrage" }}
        secondary={{ label: "Wartungsvertrag ansehen", href: "/service/wartung", icon: ClipboardCheck }}
      />
    </div>
  );
}
