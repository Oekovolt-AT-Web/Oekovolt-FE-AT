// service/wartung/page.js – Österreich: PV-Wartung und Wartungsvertrag (Ziel: Wartungsvertrag)

import { BadgeCheck, ClipboardCheck, FileText, Gauge, HardHat, LineChart, SlidersHorizontal } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Hinweis from "@/components/ServiceAT/Hinweis";
import AntwortBand from "@/components/ServiceAT/A/AntwortBand";
import FotoBento from "@/components/ServiceAT/A/FotoBento";
import PaketVergleich from "@/components/ServiceAT/A/PaketVergleich";
import Akkordeon from "@/components/ServiceAT/A/Akkordeon";
import AnfragePremium from "@/components/ServiceAT/A/AnfragePremium";
import FaqPlus from "@/components/ServiceAT/A/FaqPlus";
import QuellenKompakt from "@/components/ServiceAT/A/QuellenKompakt";

const PFAD = "/service/wartung";
const TITEL = "PV-Wartung & Wartungsvertrag für Gewerbe | Ökovolt";
const BESCHREIBUNG =
  "Wartungsvertrag für PV-Anlagen in Österreich: Prüfung nach OVE E 8101, Thermografie, Monitoring, EZA-Regler-Check und Berichte – Pakete nach Anlagengröße.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const BILD = {
  hero: { src: "/Images/Jobs/download.jpg", alt: "Drei Techniker mit Helm und Warnweste prüfen PV-Module auf einem Flachdach bei Abendlicht" },
  sicherheit: { src: "/Images/Referenzen/referenzkarte3.jpg", alt: "Techniker mit Helm arbeitet mit Akkuschrauber an einer PV-Unterkonstruktion" },
  werterhalt: { src: "/Images/Jobs/jobs4.jpg", alt: "Ingenieur mit Schutzhelm prüft Anlagendaten auf einem Tablet vor PV-Modulen" },
  versicherung: { src: "/Images/AT/service/pv-wartung-techniker.jpg", alt: "Monteur mit Auffanggurt und Seilsicherung trägt ein Solarmodul über ein Blechdach" },
};

const PAKETE_KOPF = ["Leistung", "Basis", "Plus", "Premium"];
const EIGNUNG = ["Dachanlagen mit einfacher Struktur", "Gewerbe- und Hallendächer", "Große Dach- und Freiflächenanlagen, Speicher, EZA-Regler"];
const PAKETE = [
  ["Geeignet für", ...EIGNUNG],
  ["Inspektionen vor Ort", "1× jährlich", "1× jährlich + Störungseinsätze", "2× jährlich (Frühjahr/Herbst) + Störungseinsätze"],
  ["Sichtprüfung Module, Unterkonstruktion, Kabelwege, Dachdurchdringungen", true, true, true],
  ["Wechselrichter: Fehlerspeicher, Lüfter/Filter, Firmware-Stand", true, true, true],
  ["Elektrische Prüfung DC/AC (Isolationswiderstand, Leerlaufspannung, Strangströme) nach OVE EN 62446-1", "auf Anfrage", true, true],
  ["Wiederkehrende Prüfung mit Prüfbefund nach OVE E 8101", "auf Anfrage", "im vereinbarten Intervall", "im vereinbarten Intervall"],
  ["Thermografie (IEC TS 62446-3)", false, "Verteiler, Wechselrichter, Anschlusspunkte", "zusätzlich Drohnen-Thermografie des PV-Generators"],
  ["Modulreinigung", "optional", "optional", "nach Bedarf, Intervall im Vertrag"],
  ["Monitoring", "Datencheck beim Termin", "laufende Überwachung mit Alarmierung", "laufende Überwachung über Ökovolt-Fernwartung/SCADA"],
  ["Reaktionszeit-Ziel", "nach Verfügbarkeit", "im Vertrag vereinbart (SLA)", "priorisiert, SLA mit Eskalationsstufen"],
  ["Ersatzteilmanagement", false, "Beschaffung im Störfall", "abgestimmter Vorrat kritischer Teile"],
  ["EZA-Regler/Parkregler-Check (Sollwerte, Kommunikation Netzbetreiber)", false, true, "inkl. Funktionsnachweis"],
  ["Berichte", "Kurzprotokoll", "Prüfbericht mit Fotodokumentation", "Jahresbericht mit KPIs und Maßnahmenplan"],
  ["Preis", "nach Anlagengröße", "nach Anlagengröße", "nach Anlagengröße"],
];
// Vergleichsansicht: ohne „Geeignet für“ (steht im Paketkopf) und ohne „Preis“ (Fußzeile)
const PAKETE_KARTEN = PAKETE.slice(1, -1);

const WARTUNGSARTEN = [
  ["Präventiv (vorbeugend)", "Geplante Inspektionen, Prüfungen und Reinigungen in festen Intervallen", "Fehler finden, bevor sie Ertrag oder Sicherheit kosten; Nachweis für Versicherung und Garantie"],
  ["Korrektiv (instandsetzend)", "Störungsbehebung nach Alarm: Wechselrichtertausch, defekte Steckverbinder, ausgelöste Schutzorgane", "Ausfallzeit kurz halten – entscheidend sind Reaktions- und Wiederherstellzeit"],
  ["Zustandsbasiert (vorausschauend)", "Auswertung von Monitoring-Daten: Strangvergleich, Performance Ratio, Temperatur- und Isolationsverläufe", "Eingriffe dann, wenn Daten eine Verschlechterung zeigen – nicht erst beim Totalausfall"],
];

const KPIS = [
  ["Performance Ratio (PR)", "Verhältnis von tatsächlichem zu theoretisch möglichem Ertrag bei gemessener Einstrahlung (IEC 61724-1)", "Zeigt Verluste unabhängig vom Wetter – Basis jedes O&M-Berichts"],
  ["Technische Verfügbarkeit", "Anteil der Zeit, in der die Anlage bei ausreichender Einstrahlung einspeisebereit war (Begriffe nach IEC TS 63019)", "Misst, wie schnell Störungen behoben werden"],
  ["Energetische Verfügbarkeit", "Anteil der erzeugten an der ohne Störung möglichen Energie", "Gewichtet Ausfälle nach Einstrahlung – ein Ausfall im Juni zählt mehr als im Dezember"],
  ["Spezifischer Ertrag", "kWh je kWp und Jahr", "Vergleich mit Prognose und mit anderen Anlagen im Portfolio"],
  ["Reaktions- und Wiederherstellzeit", "Zeit von der Alarmierung bis zum Eingriff bzw. bis zum Normalbetrieb", "Vertragliche Kennzahl im SLA"],
];

const FAQ = [
  {
    q: "Ist die Wartung einer PV-Anlage in Österreich Pflicht?",
    a: "Eine eigene „Wartungspflicht“ gibt es nicht, wohl aber Prüfpflichten: Arbeitgeber müssen elektrische Anlagen nach der Elektroschutzverordnung 2012 wiederkehrend prüfen lassen – in der Regel längstens alle fünf Jahre. Dazu kommen Auflagen aus Versicherungsverträgen, Herstellergarantien und – bei größeren Anlagen – aus dem Netzzugangsvertrag. Ein Wartungsvertrag bündelt diese Pflichten.",
  },
  {
    q: "Was kostet ein Wartungsvertrag für eine Gewerbeanlage?",
    a: "Der Preis hängt vor allem von Anlagengröße, Anzahl der Wechselrichter, Zugänglichkeit des Dachs, gewünschtem Paket und Reaktionszeit ab. Wir nennen deshalb keine Pauschalpreise, sondern erstellen nach Ihren Anlagendaten ein Angebot. Senden Sie uns dazu Leistung in kWp, Baujahr und Wechselrichtertyp über das Formular.",
  },
  {
    q: "Warten Sie auch Anlagen, die nicht von Ökovolt gebaut wurden?",
    a: "Ja. Vor Vertragsbeginn machen wir eine Erstinspektion und prüfen Dokumentation, Prüfbefunde und Monitoring-Zugang. Mängel aus der Errichtung dokumentieren wir getrennt, damit klar ist, was in die laufende Wartung fällt und was vorab behoben werden sollte.",
  },
  {
    q: "Wie oft sollte eine Gewerbeanlage gewartet werden?",
    a: "Für Gewerbe- und Hallendächer ist eine Inspektion pro Jahr üblich, bei großen Anlagen, Freiflächen oder hoher Belastung durch Staub, Schnee oder Tiere zwei. Die wiederkehrende elektrische Prüfung mit Prüfbefund richtet sich nach den Fristen der ESV 2012 und den Vorgaben von Versicherer und Errichter. Laufendes Monitoring ersetzt keine Vor-Ort-Prüfung, macht sie aber gezielter.",
  },
  {
    q: "Was ist der Unterschied zwischen Wartung und E-Check?",
    a: "Die wiederkehrende Prüfung (oft „E-Check“ genannt) stellt fest, ob die elektrische Anlage sicher ist, und endet mit einem Prüfbefund. Die Wartung umfasst mehr: Inspektion, Reinigung, Monitoring, Störungsbehebung, Ersatzteile und Berichte über Ertrag und Verfügbarkeit. In den Paketen Plus und Premium ist die Prüfung im vereinbarten Intervall enthalten.",
  },
  {
    q: "Welche Kennzahlen bekommen wir im Bericht?",
    a: "Je nach Paket Performance Ratio, technische und energetische Verfügbarkeit, spezifischen Ertrag im Vergleich zur Prognose, Störungsliste mit Reaktions- und Behebungszeiten sowie einen Maßnahmenplan. Die Kennzahlen eignen sich auch für Controlling und Nachhaltigkeitsbericht.",
  },
  {
    q: "Brauchen wir einen Zugang zu unserem Monitoring?",
    a: "Für laufende Überwachung ja. Wir benötigen einen Lese- oder Service-Zugang zum Wechselrichterportal oder binden die Anlage in unsere eigene Fernwartung und SCADA ein. Der Zugriff erfolgt verschlüsselt und nur in dem Umfang, der für die Wartung nötig ist.",
  },
  {
    q: "Gehört der EZA-Regler zur Wartung?",
    a: "Bei Anlagen mit Parkregler (EZA-Regler) sollte er es. Der Regler setzt die Vorgaben des Netzbetreibers zu Blindleistung und Wirkleistungsbegrenzung um. Fällt die Kommunikation aus oder stimmen Sollwerte nicht mehr, drohen Abregelung oder Konflikte mit dem Netzbetreiber. Wir prüfen Sollwerte, Messung und Kommunikationswege.",
  },
];

export default function WartungPage() {
  return (
    <div>
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Wartung und Wartungsvertrag für Photovoltaikanlagen", beschreibung: BESCHREIBUNG, serviceType: "Betriebsführung und Wartung (O&M) von PV-Anlagen" })} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Service" }, { name: "Wartung & Wartungsvertrag" }]}
        eyebrow="Wartung · Betriebsführung (O&M)"
        title={
          <>
            PV-Wartung mit <span className="ov-text-gradient-light">Wartungsvertrag</span>
          </>
        }
        lead="Eine Photovoltaikanlage ist wartungsarm, aber nicht wartungsfrei. Mit einem Wartungsvertrag sind Sicherheit, Ertrag, Garantie- und Versicherungsauflagen in einer Hand – geprüft nach österreichischen Normen und dokumentiert für Geschäftsführung, Versicherer und Netzbetreiber."
        image={BILD.hero}
        points={["Prüfung nach OVE E 8101 & EN 62446", "Thermografie & Monitoring", "EZA-Regler-Check", "Berichte mit KPIs"]}
        actions={[
          { label: "Wartungsvertrag anfragen", href: "#anfrage" },
          { label: "Pakete vergleichen", href: "#pakete", icon: ClipboardCheck },
        ]}
      />

      <AntwortBand
        frage="Ist die Wartung einer PV-Anlage in Österreich Pflicht?"
        zahlen={[
          { value: 5, suffix: " Jahre", label: "längste Prüffrist im Regelfall", text: "wiederkehrende Prüfung nach § 9 ESV 2012" },
          { value: 3, label: "Pakete", text: "Basis, Plus und Premium – kombinierbar" },
          { value: "1–2×", label: "Inspektionen pro Jahr", text: "je nach Paket, dazu Störungseinsätze" },
          { value: "PR", label: "Kennzahlen im Bericht", text: "Performance Ratio und Verfügbarkeit (IEC 61724-1, IEC TS 63019)" },
        ]}
      >
        <p>
          Eine eigene <strong>„Wartungspflicht“ gibt es nicht, wohl aber Prüfpflichten</strong>: Arbeitgeber müssen elektrische Anlagen nach der Elektroschutzverordnung 2012
          wiederkehrend prüfen lassen – in der Regel längstens alle fünf Jahre. Dazu kommen Auflagen aus Versicherungsverträgen, Herstellergarantien und bei größeren Anlagen aus dem
          Netzzugangsvertrag. Ein Wartungsvertrag bündelt diese Pflichten.
        </p>
      </AntwortBand>

      {/* Sechs Gründe als Foto-Bento */}
      <Section tone="white" space="md" id="gruende">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
          <SectionHeading eyebrow="Warum Wartung" title="Sechs Gründe, warum Gewerbeanlagen einen Wartungsvertrag brauchen" />
          <p className="ov-lead text-ink-600 lg:pb-1">
            Wartung ist bei einer Gewerbeanlage keine Kür: Sie sichert Personen, Ertrag und Ansprüche. Ein Ausfall eines Wechselrichters im Sommer kostet schnell mehr als ein Jahr Wartung.
          </p>
        </div>
        <FotoBento
          spalten={4}
          zeile={240}
          items={[
            {
              form: "hoch",
              bild: BILD.sicherheit.src,
              alt: BILD.sicherheit.alt,
              tag: "Pflicht",
              titel: "Sicherheit & Prüfpflicht",
              text: "Arbeitgeber müssen elektrische Anlagen nach ESV 2012 wiederkehrend prüfen lassen. Die Prüfung nach OVE E 8101 mit Prüfbefund ist Teil der Pakete Plus und Premium.",
            },
            { ton: "sand", icon: <Gauge />, titel: "Ertrag & Verfügbarkeit", text: "Ausgefallene Strings, verschmutzte Module oder ein abgeregelter Wechselrichter fallen ohne Überwachung oft monatelang nicht auf." },
            { ton: "sand", icon: <BadgeCheck />, titel: "Herstellergarantien", text: "Produkt- und Leistungsgarantien setzen Installation und Betrieb nach Herstellerhandbuch voraus. Dokumentierte Wartung erleichtert Garantiefälle deutlich." },
            {
              form: "hoch",
              bild: BILD.werterhalt.src,
              alt: BILD.werterhalt.alt,
              tag: "Nachweise",
              titel: "Werterhalt & Nachweise",
              text: "Anlagenbuch, Prüfbefunde und Ertragsberichte sind bei Verkauf, Refinanzierung, Förderprüfung oder Nachhaltigkeitsbericht gefragt.",
            },
            { ton: "sand", icon: <FileText />, titel: "Versicherungsauflagen", text: "Versicherer verlangen einen ordnungsgemäßen Zustand der Anlage. Wer Obliegenheiten verletzt, riskiert Leistungskürzungen im Schadenfall." },
            { ton: "navy", icon: <SlidersHorizontal />, titel: "Netzkonformität", text: "Parkregler und Wechselrichter müssen die Vorgaben des Netzbetreibers nach TOR Erzeuger dauerhaft einhalten – auch nach Firmware-Updates." },
          ]}
        />
      </Section>

      {/* Pakete */}
      <Section tone="sand" space="md" id="pakete" className="scroll-mt-24">
        <SectionHeading
          align="center"
          eyebrow="Leistungspakete"
          title="Basis, Plus oder Premium – der Leistungsumfang im Vergleich"
          lead="Die Pakete sind eine Orientierung. Den genauen Umfang, Intervalle und Reaktionszeit-Ziele legen wir im Wartungsvertrag je Anlage fest. Der Preis richtet sich nach Anlagengröße, Anzahl der Wechselrichter und Zugänglichkeit."
          className="mb-10"
        />
        <PaketVergleich pakete={PAKETE_KOPF.slice(1)} eignung={EIGNUNG} zeilen={PAKETE_KARTEN} fuss="Preis nach Anlagengröße – Angebot anfordern" />
        <p className="mt-6 text-center text-[13px] leading-relaxed text-ink-500">
          Beispielhafte Paketstruktur, keine Preis- oder Reaktionszeitzusage. Die Pakete lassen sich kombinieren, z. B. Plus mit Drohnen-Thermografie.
        </p>
      </Section>

      {/* O&M-Fachwissen dunkel */}
      <section className="ov-noise relative overflow-hidden bg-navy-950 py-20 text-white md:py-24">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="ov-container relative">
          <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
            <SectionHeading dark eyebrow="O&M-Fachwissen" title="Präventiv, korrektiv, zustandsbasiert" />
            <p className="ov-lead text-white/70 lg:pb-1">
              Betriebsführung und Wartung (Operation & Maintenance, O&M) kennt drei Arten von Eingriffen. Ein guter Wartungsvertrag kombiniert alle drei – die Norm OVE EN 62446-2
              beschreibt dafür Mindestinhalte für Wartung und Instandhaltung netzgekoppelter PV-Anlagen.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {WARTUNGSARTEN.map(([art, bsp, nutzen], i) => (
              <Reveal key={art} delay={i * 80} className="ov-card-hover rounded-3xl bg-white/[0.05] p-6 ring-1 ring-white/10 md:p-7">
                <span className="font-display text-[13px] font-bold text-ov-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-[20px] font-extrabold tracking-tight">{art}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">
                  <strong className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-white/45">Beispiele</strong>
                  {bsp}
                </p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/80">
                  <strong className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-white/45">Nutzen</strong>
                  {nutzen}
                </p>
              </Reveal>
            ))}
          </div>

          <Akkordeon
            dunkel
            className="mt-12"
            items={[
              {
                icon: <LineChart />,
                titel: "Woran Sie gute Wartung messen",
                kurz: "Fünf Kennzahlen für Bericht und SLA – angelehnt an IEC 61724-1 und IEC TS 63019",
                inhalt: (
                  <>
                    <dl className="grid gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 md:grid-cols-2 lg:grid-cols-5">
                    {KPIS.map(([k, d, w]) => (
                      <div key={k} className="bg-navy-950/90 p-5">
                        <dt className="flex items-center gap-2 font-display text-[15.5px] font-bold text-white">
                          <LineChart aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-300" />
                          {k}
                        </dt>
                        <dd className="mt-2 text-[13.5px] leading-relaxed text-white/60">{d}</dd>
                        <dd className="mt-2 text-[13px] font-medium leading-snug text-ov-200">{w}</dd>
                      </div>
                    ))}
                  </dl>
                    <p className="mt-4 text-[12.5px] text-white/45">Definitionen angelehnt an IEC 61724-1 (Performance Monitoring) und IEC TS 63019 (Verfügbarkeit von PV-Systemen).</p>
                  </>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Versicherung & Garantie */}
      <Section tone="white" space="md">
        <SplitMedia
          eyebrow="Versicherung & Garantie"
          title="Warum Versicherer und Hersteller auf Wartung bestehen"
          image={BILD.versicherung}
          text={[
            "Versicherungsverträge enthalten Obliegenheiten: Der Betreiber muss die Anlage in ordnungsgemäßem Zustand halten, Mängel beheben lassen und gesetzliche Prüfungen durchführen. Werden Obliegenheiten verletzt, kann der Versicherer – abhängig von Verschulden und Auswirkung auf den Schaden – nach § 6 Versicherungsvertragsgesetz (VersVG) ganz oder teilweise leistungsfrei werden.",
            "Hersteller knüpfen Garantien an Installation und Betrieb nach Handbuch. Kommt es zum Garantiefall, fragen sie nach Seriennummern, Fehlerspeicher, Messwerten und Fotos – genau das liefert ein Wartungsprotokoll.",
          ]}
          points={[
            { title: "Prüfbefund", text: "Nachweis der sicheren elektrischen Anlage nach OVE E 8101" },
            { title: "Messprotokolle", text: "Isolationswiderstand, Strangströme und -spannungen nach OVE EN 62446-1" },
            { title: "Thermografie", text: "Nachweis thermischer Auffälligkeiten nach IEC TS 62446-3" },
            { title: "Anlagenbuch", text: "Alle Befunde, Pläne und Änderungen an einem Ort" },
          ]}
        >
          <Hinweis ton="achtung" titel="Arbeitssicherheit auf dem Dach" className="mt-8">
            <p>
              Arbeiten auf Hallendächern sind Arbeiten mit Absturzgefahr. Unsere Teams arbeiten mit Absturzsicherung nach Bauarbeiterschutzverordnung und ASchG und nur nach Freischaltung
              bzw. mit geeigneten Schutzmaßnahmen an spannungsführenden DC-Teilen. Bitte informieren Sie uns vorab über Anschlagpunkte, Lichtkuppeln und Zugangsregeln auf Ihrem Gelände.
            </p>
          </Hinweis>
        </SplitMedia>
      </Section>

      <AnfragePremium
        eyebrow="Wartungsvertrag anfragen"
        titel="Angebot für Ihre Anlage – ohne Pauschalpreise aus der Schublade"
        lead="Mit wenigen Angaben zu Ihrer Anlage erstellen wir ein Angebot passend zu Größe und Paket. Unverbindlich – für Anlagen von Ökovolt und anderen Errichtern."
        schritteTitel="In vier Schritten zum Wartungsvertrag"
        schritte={[
          { titel: "Anlagendaten", text: "Leistung, Baujahr, Wechselrichter, Pläne und vorhandene Prüfbefunde – über das Formular oder per E-Mail." },
          { titel: "Erstinspektion", text: "Bestandsaufnahme vor Ort als Ausgangswert: Zustand, Messwerte, offene Mängel, Monitoring-Zugang." },
          { titel: "Vertrag & SLA", text: "Paket, Intervalle, Reaktionszeit-Ziel, Ersatzteile und Berichtswesen – schriftlich und nachvollziehbar." },
          { titel: "Laufender Betrieb", text: "Überwachung, Inspektionen, Störungsbehebung und Berichte – mit festem Ansprechpartner." },
        ]}
        formular={{
          betreff: "Wartungsvertrag",
          thema: "Service & Wartung",
          titel: "Angebot für Ihren Wartungsvertrag",
          absenden: "Angebot anfordern",
          felder: [
            { name: "anlagengroesse", label: "Anlagengröße", typ: "zahl", einheit: "kWp", pflicht: true, placeholder: "z. B. 250" },
            { name: "baujahr", label: "Baujahr / Inbetriebnahme", typ: "zahl", placeholder: "z. B. 2019" },
            { name: "wechselrichter", label: "Wechselrichter (Hersteller, Typ, Anzahl)", placeholder: "z. B. 3× Fronius Tauro 100", breit: true },
            { name: "anlagentyp", label: "Anlagentyp", typ: "auswahl", optionen: ["Dachanlage Gewerbe/Halle", "Freifläche", "Agri-PV", "Carport", "Landwirtschaft (Stall, Maschinenhalle)", "Gemeinde / öffentliches Gebäude"] },
            { name: "paket", label: "Gewünschtes Paket", typ: "auswahl", pflicht: true, optionen: ["Basis", "Plus", "Premium", "Noch offen – bitte beraten"] },
            { name: "extras", label: "Weitere Komponenten", typ: "auswahl", optionen: ["Keine", "Stromspeicher", "EZA-Regler / Parkregler", "Speicher und EZA-Regler", "Ladeinfrastruktur"] },
            { name: "errichter", label: "Errichtet durch", typ: "auswahl", optionen: ["Ökovolt", "Anderer Errichter", "Unbekannt"] },
          ],
        }}
      />

      <FaqPlus
        items={FAQ}
        titel="Wartung & Wartungsvertrag – gut zu wissen"
        lead="Fragen aus Geschäftsführung, Technik und Einkauf."
        links={[
          { href: "/technik/fernwartung", art: "Technik", titel: "Fernwartung", text: "Sichere Fernzugriffe und Alarmierung – Grundlage der laufenden Überwachung." },
          { href: "/technik/scada", art: "Technik", titel: "SCADA & Leitwarte", text: "Portfolio-Monitoring und KPI-Reporting für mehrere Standorte." },
          { href: "/technik/parkregler", art: "Technik", titel: "Parkregler (EZA-Regler)", text: "Blindleistung und Einspeiselimit nach TOR Erzeuger dauerhaft einhalten." },
          { href: "/service/e-check", art: "Service", titel: "E-Check & Anlagenprüfung", text: "Wiederkehrende Prüfung nach OVE E 8101 mit Prüfbefund." },
          { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie", text: "Hotspots und defekte Strings großflächig finden." },
          { href: "/ratgeber/photovoltaik-wartungsvertrag", art: "Ratgeber", titel: "Wartungsvertrag: Leistungen, Kosten, SLA", text: "Worauf Sie beim Vertrag achten sollten." },
          { href: "/ratgeber/photovoltaik-reinigung-wartung", art: "Ratgeber", titel: "Reinigung & Wartung im Überblick", text: "Was wirklich nötig ist – und was nicht." },
          { href: "/gewerbe", art: "Lösung", titel: "Photovoltaik für Gewerbe & Industrie", text: "Von der Planung nach Lastgang bis zum Betrieb." },
        ]}
      />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Betrieb und Sicherheit" />

      <QuellenKompakt
        titel="Quellen & Rechtsgrundlagen"
        items={[
          { titel: "Elektroschutzverordnung 2012 (ESV 2012), RIS", href: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007682", hinweis: "§§ 7–11: Kontrollen, Prüfungen, Prüfbefunde" },
          { titel: "Kommentierte ESV 2012 – Arbeitsinspektion", href: "https://www.arbeitsinspektion.gv.at/Arbeitsstaetten-_Arbeitsplaetze/Elektrische_Anlagen/Kommentierte_Elektroschutzverordnung_2012.html" },
          { titel: "OVE E 8101 – Elektrische Niederspannungsanlagen", href: "https://www.ove.at/ove-standardization/normen-produkte/ove-e-8101/", hinweis: "Teil 6: Prüfungen, Abschnitt 712: PV" },
          { titel: "OVE EN 62446-1 / -2 und IEC TS 62446-3", hinweis: "Prüfung, Dokumentation, Wartung und Thermografie von PV-Systemen" },
          { titel: "IEC 61724-1 und IEC TS 63019", hinweis: "Performance Monitoring und Verfügbarkeit von PV-Systemen" },
          { titel: "Versicherungsvertragsgesetz (VersVG) § 6 – Obliegenheiten", href: "https://www.jusline.at/gesetz/versvg/paragraf/6" },
        ]}
      />

      <CtaBand
        eyebrow="Wartungsvertrag"
        title="Ihre Anlage in guten Händen – geprüft, überwacht, dokumentiert."
        text="Senden Sie uns Anlagengröße und Baujahr. Sie erhalten ein Angebot mit Leistungsumfang, Intervallen und Reaktionszeit-Ziel – für Anlagen von Ökovolt und anderen Errichtern."
        primary={{ label: "Wartungsvertrag anfragen", href: "#anfrage" }}
        secondary={{ label: "Anlagenprüfung (E-Check)", href: "/service/e-check", icon: HardHat }}
      />
    </div>
  );
}
