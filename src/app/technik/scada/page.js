import {
  BarChart3,
  Bell,
  Building2,
  CalendarCheck2,
  CloudSun,
  Database,
  FileBarChart,
  FileDown,
  Gauge,
  Landmark,
  Layers,
  LayoutDashboard,
  Leaf,
  Share2,
  Thermometer,
  TrendingUp,
  Users,
} from "lucide-react";

import Link from "next/link";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { Hinweis, Kurzantwort, Punkte, Quellen, Tabelle, UnterlagenAufAnfrage, Verweise } from "@/components/Technik/Bausteine";
import { JsonLd, seitenMeta, seitenSchema } from "@/components/Technik/seite";

const PFAD = "/technik/scada";
const TITEL = "SCADA & Leitwarte für PV-Portfolios | Ökovolt";
const BESCHREIBUNG =
  "SCADA für PV-Anlagen in Österreich: Leitwarte, Performance Ratio und Verfügbarkeit nach IEC 61724, Alarmmanagement, Reporting für Banken und Direktvermarkter.";

export const metadata = seitenMeta({
  pfad: PFAD,
  titel: TITEL,
  beschreibung: BESCHREIBUNG,
  bild: "/Images/AT/technik/leitwarte-netzbetrieb.jpg",
  keywords: ["SCADA Photovoltaik", "PV Monitoring Österreich", "Performance Ratio IEC 61724", "Leitwarte Solarpark", "Asset Management PV", "PV Reporting Bank"],
});

const KPI = [
  [
    "Performance Ratio (PR)",
    "PR = Yf / Yr mit Yf = E_AC / P0 (kWh/kWp) und Yr = H_POA / 1 kW/m²",
    "Wie gut die Anlage die eingestrahlte Energie umsetzt – unabhängig vom Wetter. Temperaturkorrigierte PR für Vergleiche über Jahreszeiten.",
    "IEC 61724-1",
  ],
  [
    "Spezifischer Ertrag",
    "Yf = eingespeiste bzw. erzeugte AC-Energie / installierte DC-Leistung (kWh/kWp)",
    "Vergleich von Anlagen unterschiedlicher Größe; Grundlage für Soll-Ist-Abgleich und Prognose.",
    "IEC 61724-1",
  ],
  [
    "Technische Verfügbarkeit",
    "zeitbasiert: verfügbare Zeit / Betriebszeit mit Einstrahlung; energiebasiert: erzeugte / (erzeugte + entgangene) Energie",
    "Grundlage für Verfügbarkeitsgarantien in O&M-Verträgen. Wichtig: vorher festlegen, wie Netzabregelungen und höhere Gewalt zählen.",
    "IEC TS 63019",
  ],
  [
    "Soll-Ist-Ertrag (Energy Performance Index)",
    "EPI = gemessene Energie / erwartete Energie aus Modell mit gemessener Einstrahlung und Temperatur",
    "Zeigt Minderleistung, die in der PR untergeht – etwa Verschmutzung, Degradation oder Stringausfälle.",
    "IEC 61724-3 (Konzept)",
  ],
  [
    "Abregelung & Netzvorgaben",
    "entgangene Energie durch Sollwerte von Netzbetreiber, Direktvermarkter oder Einspeiselimit",
    "Trennt technische Verluste von vertraglich bzw. netzbedingt gewollten Einschränkungen – für faire Verfügbarkeits- und Erlösrechnung.",
    "Parkregler-Ereignisse",
  ],
];

const FAQ = [
  {
    q: "Was ist ein SCADA-System bei Photovoltaik?",
    a: "SCADA (Supervisory Control and Data Acquisition) ist die Leitebene einer PV-Anlage oder eines ganzen Portfolios: Es erfasst Messwerte von Wechselrichtern, Zählern, Wetterstation und Parkregler, zeigt den Zustand in einer Leitwarte, löst Alarme aus und stellt Daten für Berichte und Schnittstellen bereit. Steuerbefehle – etwa Sollwerte – laufen über das SCADA an den Parkregler, nicht direkt an einzelne Wechselrichter.",
  },
  {
    q: "Wie wird die Performance Ratio berechnet?",
    a: "Nach IEC 61724-1 ist die Performance Ratio das Verhältnis aus spezifischem Ertrag (erzeugte AC-Energie je kWp installierter Leistung) und Referenzertrag (Einstrahlung in Modulebene geteilt durch 1 kW/m²). Weil die Modultemperatur die PR jahreszeitlich schwanken lässt, verwenden wir für Vergleiche zusätzlich die temperaturkorrigierte PR. Voraussetzung ist eine gut gewartete Einstrahlungsmessung in Modulebene.",
  },
  {
    q: "Welche Messtechnik braucht eine aussagekräftige Leitwarte?",
    a: "Mindestens die Daten der Wechselrichter und des Einspeisezählers. Für Performance Ratio und Soll-Ist-Vergleich kommen eine Einstrahlungsmessung in Modulebene (Pyranometer oder Referenzzelle), Modul- und Umgebungstemperatur und – bei größeren Anlagen – Wind dazu. Welche Messgenauigkeit angemessen ist, beschreibt IEC 61724-1 mit den Monitoring-Klassen A, B und C; die Güte der Pyranometer ist in ISO 9060 klassifiziert.",
  },
  {
    q: "Welche Berichte erhalten Investoren und Banken?",
    a: "Typisch sind Monats- und Jahresberichte mit Energie, Performance Ratio, Verfügbarkeit, Soll-Ist-Vergleich gegen Planung oder Prognose, Störungen mit Ursache und Dauer sowie Abregelungen durch Netzbetreiber oder Direktvermarkter. Inhalt, Definitionen und Zeitpunkt stimmen wir mit Ihren Finanzierungs- oder Fondsvorgaben ab.",
  },
  {
    q: "Kann das SCADA Daten an unser eigenes System übergeben?",
    a: "Ja. Daten lassen sich über eine Programmierschnittstelle abrufen oder als Datei exportieren, etwa für Controlling, ESG-Berichte oder das Energiemanagement. Die Daten gehören Ihnen; Format, Auflösung und Übergabeweg legen wir projektbezogen fest.",
  },
  {
    q: "Wie hängt das SCADA mit Direktvermarkter und Netzbetreiber zusammen?",
    a: "Sollwerte des Netzbetreibers kommen über die Fernwirkschnittstelle an den Parkregler; Direktvermarkter senden Abregelsignale – etwa bei negativen Preisen – und erhalten Ist-Werte der Einspeisung. Das SCADA protokolliert alle Vorgaben und die Reaktion der Anlage, damit Erlös, Verfügbarkeit und Abregelung sauber nachvollziehbar sind.",
  },
  {
    q: "Funktioniert das auch für Energiegemeinschaften?",
    a: "Ja. Bei Erneuerbare-Energie-Gemeinschaften und Bürgerenergiegemeinschaften kommen die Viertelstundenwerte der Teilnehmer über die Smart Meter und den Datenaustausch der Netzbetreiber. Das SCADA zeigt Erzeugung, Eigendeckung und Einspeisung der Gemeinschaftsanlage und hilft, Verteilschlüssel und Erzeugung zu plausibilisieren. Personenbezogene Verbrauchsdaten werden nur im vereinbarten Umfang verarbeitet.",
  },
];

const QUELLEN = [
  { titel: "IEC 61724-1:2021 – Photovoltaic system performance, Part 1: Monitoring", hinweis: "Performance Ratio, Monitoring-Klassen A/B/C" },
  { titel: "IEC TS 61724-2 und IEC TS 61724-3", hinweis: "Kapazitäts- und Energieauswertung von PV-Anlagen" },
  { titel: "IEC TS 63019", hinweis: "Informationsmodell für die Verfügbarkeit von PV-Kraftwerken" },
  { titel: "ISO 9060:2018", hinweis: "Klassifizierung von Pyranometern" },
  { titel: "IEC 62682", hinweis: "Management von Alarmsystemen" },
  { titel: "ÖVE/ÖNORM EN 62446-1", hinweis: "Dokumentation und Prüfung netzgekoppelter PV-Systeme" },
  { titel: "IEC 60870-5-104 und IEC 61850-7-420", hinweis: "Fernwirkprotokoll bzw. Datenmodell für dezentrale Erzeugung" },
  { titel: "E-Control: TOR Stromerzeugungsanlagen Typ B, V1.3, Kap. 5.6 und 6.2", href: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128", hinweis: "Datenaustausch, Fernwirkschnittstelle" },
  { titel: "E-Control: Präsentation „Das neue ElWG und Konsument:innen“ (28.01.2026)", href: "https://www.e-control.at/documents/1785851/1811582/20260128_Webinar+ElWG+und+Konsumenten_V2.pdf/21dd7e4e-e4aa-dcc4-9e81-0d00766c2ca6?t=1769600935909", hinweis: "Smart-Meter-Daten, gemeinsame Energienutzung" },
];

export default function ScadaPage() {
  return (
    <div>
      <JsonLd
        daten={seitenSchema({
          pfad: PFAD,
          name: "SCADA und Leitwarte für PV-Anlagen und -Portfolios in Österreich",
          beschreibung: BESCHREIBUNG,
          service: {
            name: "SCADA, Monitoring und Reporting für Photovoltaik",
            serviceType: "Anlagenüberwachung und Portfolio-Monitoring",
            beschreibung: "Eigene SCADA-Systeme mit Leitwarte, Kennzahlen nach IEC 61724, Alarmmanagement, Reporting und Schnittstellen zu Netzbetreiber, Direktvermarkter und Kundensystemen.",
            audience: "Asset Manager, Investoren, Gewerbe, Stadtwerke, Energiegemeinschaften",
          },
        })}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Technik", href: "/technik" }, { name: "SCADA & Leitwarte" }]}
        eyebrow="Eigene Technik · SCADA & Leitwarte"
        title={
          <>
            Ein Blick auf jede Anlage – <span className="ov-text-gradient-light">und aufs ganze Portfolio</span>
          </>
        }
        lead="Unsere eigenen SCADA-Systeme bündeln Wechselrichter, Zähler, Wetterstation und Parkregler in einer Leitwarte: mit Kennzahlen nach IEC 61724, Alarmmanagement und Berichten, die Geschäftsführung, Bank und Direktvermarkter verstehen."
        image={{ src: "/Images/Jobs/renewable-energy-eco-technology-electric-power-fl-2025-01-29-12-30-39-utc.jpg", alt: "Luftaufnahme einer großen PV-Anlage mit zwei Technikern bei der Kontrolle" }}
        actions={[
          { label: "Leitwarte vorstellen lassen", href: "/termin?art=video" },
          { label: "Anfrage senden", href: "/kontakt", icon: CalendarCheck2 },
        ]}
        points={["Performance Ratio & Verfügbarkeit", "Mandantenfähig", "API & Datenexport", "Integration Direktvermarkter"]}
      />

      <Kurzantwort frage="Wofür braucht eine PV-Anlage ein SCADA-System?">
        <p>
          Ein SCADA-System macht aus vielen Einzeldaten eine Aussage: Liefert die Anlage, was sie bei der gemessenen Einstrahlung liefern müsste?
          Es sammelt Messwerte von Wechselrichtern, Zählern, Wetterstation und Parkregler, berechnet Kennzahlen wie Performance Ratio und
          Verfügbarkeit, meldet Abweichungen und dokumentiert, was Netzbetreiber und Direktvermarkter vorgegeben haben.
        </p>
      </Kurzantwort>

      {/* Leitwarte */}
      <Section tone="white" space="lg" id="leitwarte" className="scroll-mt-24">
        <SplitMedia
          eyebrow="Leitwarte & Portfolio"
          title="Von der Einzelanlage bis zum Portfolio in einer Oberfläche"
          text={[
            "In der Leitwarte sehen wir – und auf Wunsch Sie – den Zustand jeder Anlage: Leistung, Energie, Kennzahlen, aktive Alarme, Sollwerte des Netzbetreibers und den Zustand der Kommunikation.",
            "Für Portfolios mit Dach-, Freiflächen- und Agri-PV-Anlagen in mehreren Bundesländern werden Anlagen gruppiert, verglichen und nach Handlungsbedarf sortiert – nicht nach Alphabet.",
          ]}
          points={[
            { title: "Portfolio-Ansicht", text: "Energie, PR und Verfügbarkeit aller Anlagen auf einen Blick, mit Ampel nach Abweichung vom Soll." },
            { title: "Anlagen-Ansicht", text: "Wechselrichter, Strings, Speicher, Ladepunkte, Parkregler und Wetterdaten im Zusammenhang." },
            { title: "Ereignis-Ansicht", text: "Alarme, Abregelungen und Eingriffe mit Zeitstempel – nachvollziehbar für Audit und Abrechnung." },
          ]}
          image={{ src: "/Images/AT/technik/leitwarte-netzbetrieb.jpg", alt: "Symbolbild: Arbeitsplatz in einer Netzleitwarte mit Bildschirmen und Großbildwand" }}
        />
      </Section>

      {/* KPIs */}
      <Section tone="sand" space="lg" id="kennzahlen" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Kennzahlen"
          title="Performance Ratio, Verfügbarkeit, spezifischer Ertrag – sauber definiert"
          lead="Kennzahlen sind nur so gut wie ihre Definition. Wir rechnen nach den einschlägigen IEC-Normen und legen im Vertrag fest, wie Sonderfälle wie Netzabregelung oder Schneebedeckung zählen."
          className="mb-10"
        />
        <Tabelle caption="Kennzahlen im PV-Monitoring" kopf={["Kennzahl", "Definition", "Wofür sie gut ist", "Bezug"]} zeilen={KPI} kompakt minBreite={900} />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Hinweis ton="info" titel="Soll-Ist mit Einstrahlung statt mit Vorjahr">
            <p>
              Ein schwacher Mai ist kein Fehler, wenn die Sonne nicht geschienen hat. Deshalb vergleichen wir den gemessenen Ertrag mit dem
              Ertrag, den ein Modell der Anlage bei der tatsächlich gemessenen Einstrahlung und Temperatur erwartet – und erst in zweiter Linie
              mit Planwerten oder Vorjahr.
            </p>
          </Hinweis>
          <Hinweis ton="achtung" titel="Schnee und Nebel in Österreich">
            <p>
              Schneebedeckte Module, Raureif und Inversionsnebel prägen den Winter in vielen Regionen. Die Leitwarte kennzeichnet solche Zeiträume,
              damit Verfügbarkeit und PR nicht durch Wetterereignisse verzerrt werden, die keine technische Störung sind.
            </p>
          </Hinweis>
        </div>
      </Section>

      {/* Datenerfassung */}
      <Section tone="white" space="lg" id="datenerfassung" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Datenerfassung"
          title="Datenlogger, Wetterstation, Zähler: die Messkette hinter jeder Kennzahl"
          lead="Die Aussagekraft einer Leitwarte hängt an der Messtechnik in der Anlage. IEC 61724-1 unterscheidet dafür die Monitoring-Klassen A (hohe Genauigkeit, typisch für große Kraftwerke), B (mittlere) und C (Basis)."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Database, title: "Datenlogger & Gateway", text: "Sammelt Daten von Wechselrichtern, Zählern und Sensoren, puffert bei Verbindungsausfall und überträgt verschlüsselt. Zeitsynchron, damit alle Werte zusammenpassen." },
            { icon: CloudSun, title: "Einstrahlung in Modulebene", text: "Pyranometer oder Referenzzelle in Modulneigung; bei größeren Anlagen zusätzlich horizontal. Pyranometer-Güte nach ISO 9060, Reinigung und Kalibrierung im Wartungsplan." },
            { icon: Thermometer, title: "Temperatur & Wind", text: "Modulrückseitentemperatur und Umgebungstemperatur für Temperaturkorrektur und Ertragsmodell; Wind für Kühlung und Sturmereignisse." },
            { icon: Gauge, title: "Zähler & Netzanschluss", text: "Einspeise- und Bezugszähler bzw. Smart Meter sowie die Messung des Parkreglers am Netzanschlusspunkt – mit Plausibilisierung gegen die Wechselrichterdaten." },
            { icon: Layers, title: "Datenqualität", text: "Lücken, eingefrorene Werte und Ausreißer werden erkannt und gekennzeichnet, nicht stillschweigend geglättet. Nachgeladene Daten werden neu berechnet." },
            { icon: TrendingUp, title: "Auflösung & Historie", text: "Hochaufgelöste Rohdaten für Diagnose, verdichtete Werte für Berichte. Aufbewahrung nach Vereinbarung – typischerweise über die Lebensdauer der Anlage." },
          ]}
        />
      </Section>

      {/* Alarmmanagement */}
      <Section tone="navy" space="lg" className="overflow-hidden" id="alarme">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-10 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Alarmmanagement"
            title="Weniger Alarme, die mehr bedeuten"
            lead="Eine Leitwarte, die bei jeder Wolke blinkt, wird ignoriert. Wir arbeiten nach den Grundsätzen des Alarmmanagements aus IEC 62682: jeder Alarm hat eine Ursache, eine Priorität und eine erwartete Reaktion."
          />
          <Punkte
            dunkel
            spalten={2}
            items={[
              { titel: "Priorisierung", text: "Nach Ertragsverlust, Sicherheitsrelevanz und Netzvorgaben – nicht nach Gerätetyp." },
              { titel: "Unterdrückung & Bündelung", text: "Nachts keine Ertragsalarme; ein Kommunikationsausfall erzeugt einen Alarm, nicht hundert Folgemeldungen." },
              { titel: "Eskalation", text: "Festgelegte Kette von der Leitwarte über Technik bis zum Betreiber, mit Quittierung und Zeitstempel." },
              { titel: "Auswertung", text: "Häufige Alarme werden regelmäßig analysiert – oft steckt ein Parametrier- oder Hardwareproblem dahinter." },
            ]}
          />
        </div>
      </Section>

      {/* Reporting & Schnittstellen */}
      <Section tone="white" space="lg" id="reporting" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Reporting & Schnittstellen"
          title="Berichte für Investoren, Banken und ESG – Daten für Ihre Systeme"
          lead="Wer finanziert, will Zahlen in gleichbleibender Definition. Wer steuert, will Daten im eigenen System. Beides kommt aus derselben Datenbasis."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: FileBarChart, title: "Investoren & Banken", text: "Monats- und Jahresberichte mit Energie, PR, Verfügbarkeit, Soll-Ist gegen Planung (z. B. P50/P90) und Störungen mit Ursache – abgestimmt auf Kreditvertrag oder Fondsvorgaben." },
            { icon: Leaf, title: "ESG & Nachhaltigkeitsbericht", text: "Erzeugte und selbst genutzte Energie sowie vermiedene Emissionen mit offengelegtem Emissionsfaktor – als Datengrundlage für CSRD/ESRS-Berichte." },
            { icon: FileDown, title: "API & Export", text: "Programmierschnittstelle und Dateiexport für Controlling, Energiemanagement oder Data Warehouse. Die Daten gehören Ihnen." },
            { icon: TrendingUp, title: "Direktvermarkter", text: "Ist-Einspeisung und Verfügbarkeit für Prognose und Bilanzierung; Abregelsignale laufen über den Parkregler und werden protokolliert." },
            { icon: Building2, title: "Netzbetreiber", text: "Echtzeitdaten und Sollwertrückmeldung nach den Vorgaben im Netzanschlussvertrag, z. B. über IEC 60870-5-104." },
            { icon: BarChart3, title: "Kundenportal", text: "Lesender Zugang für Geschäftsführung, Technik oder Gemeinde – mit den Kennzahlen, die für die jeweilige Rolle relevant sind." },
          ]}
        />
      </Section>

      {/* Energiegemeinschaften & Mandanten */}
      <Section tone="sand" space="lg" id="mandanten" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
              <Share2 aria-hidden="true" className="h-4 w-4" />
              Energiegemeinschaften
            </p>
            <h2 className="ov-h2 mt-4 text-ink-900">EEG, BEG und gemeinsame Energienutzung</h2>
            <p className="mt-5 text-[16.5px] leading-relaxed text-ink-600">
              Bei Erneuerbare-Energie-Gemeinschaften, Bürgerenergiegemeinschaften und gemeinschaftlichen Erzeugungsanlagen zählt jede
              Viertelstunde: Erzeugung und Verbrauch der Teilnehmer werden über Smart Meter und den Datenaustausch der Netzbetreiber zugeordnet.
              Das ElWG erweitert die gemeinsame Energienutzung – die Bestimmungen dazu gelten großteils ab 1. Oktober 2026.
            </p>
            <p className="mt-4 text-[16.5px] leading-relaxed text-ink-600">
              Das SCADA zeigt Erzeugung, Einspeisung und Verfügbarkeit der Gemeinschaftsanlage und hilft, Aufteilung und Abrechnung zu
              plausibilisieren. Mehr dazu auf unserer Seite zu{" "}
              <Link href="/energiegemeinschaften" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                Energiegemeinschaften
              </Link>
              .
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
              <Users aria-hidden="true" className="h-4 w-4" />
              Mandantenfähigkeit
            </p>
            <h2 className="ov-h2 mt-4 text-ink-900">Viele Beteiligte, klare Rechte</h2>
            <ul className="mt-6 space-y-3">
              {[
                { icon: Landmark, t: "Eigentümer & Investoren", x: "Portfolio-Kennzahlen und Berichte, ohne Eingriffsrechte." },
                { icon: LayoutDashboard, t: "Betriebsführung & Wartung", x: "Anlagendetails, Alarme, Diagnose – schreibend nur mit begründeter Freigabe." },
                { icon: Building2, t: "Gemeinden & Stadtwerke", x: "Mehrere Anlagen und Energiegemeinschaften getrennt, aber in einer Übersicht." },
                { icon: Bell, t: "Dienstleister", x: "Zeitlich und auf Anlagen begrenzter Zugang, vollständig protokolliert." },
              ].map((r) => (
                <li key={r.t} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                  <r.icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                  <span className="text-[15px] leading-snug text-ink-700">
                    <strong className="block text-ink-900">{r.t}</strong>
                    {r.x}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="mt-10">
          <UnterlagenAufAnfrage
            titel="Leistungsbeschreibung und Beispielbericht auf Anfrage"
            text="Welche Kennzahlen, Schnittstellen und Berichte für Ihr Portfolio sinnvoll sind, zeigen wir an einem anonymisierten Beispiel."
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="SCADA und Monitoring – für Technik und Asset Management"
            lead="Sie betreiben bereits ein Monitoring? Wir prüfen gern, ob es sich anbinden lässt, statt alles neu aufzubauen."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Verweise
        ueberschrift="Technik im Verbund"
        items={[
          { href: "/technik/parkregler", titel: "Parkregler (EZA-Regler)", text: "Die Regelung am Netzanschlusspunkt, deren Sollwerte und Ereignisse im SCADA landen." },
          { href: "/technik/fernwartung", titel: "Fernwartung & IT-Security", text: "Wie aus einem Alarm in der Leitwarte eine schnelle, sichere Behebung wird." },
          { href: "/service/direktvermarktung", titel: "Reststromvermarktung", text: "OeMAG, Direktvermarkter und PPA – und welche Daten dafür gebraucht werden." },
          { href: "/energie-live", titel: "Strommarkt Österreich live", text: "Day-Ahead-Preis der Gebotszone AT und Erzeugungsmix in Viertelstunden." },
        ]}
      />

      <Quellen
        items={QUELLEN}
        bildnachweis="Leitwarte (Symbolbild, Netzleitwarte in den USA): Dpysh w, CC BY 3.0, via Wikimedia Commons."
      />

      <CtaBand
        eyebrow="Für Asset Manager, Stadtwerke und Betriebe"
        title="Wie gut arbeiten Ihre Anlagen wirklich?"
        text="Wir zeigen Ihnen die Leitwarte an einem Beispielportfolio und prüfen, welche Messtechnik und Berichte Ihre Anlagen und Finanzierungspartner brauchen."
        primary={{ label: "Leitwarte vorstellen lassen", href: "/termin?art=video" }}
        secondary={{ label: "Anfrage senden", href: "/kontakt", icon: CalendarCheck2 }}
      />
    </div>
  );
}
