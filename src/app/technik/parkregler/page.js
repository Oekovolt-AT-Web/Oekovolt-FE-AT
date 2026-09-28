import {
  Activity,
  BatteryCharging,
  CalendarCheck2,
  ClipboardCheck,
  Cable,
  FileCheck2,
  Gauge,
  Power,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  Waves,
  Zap,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Signalkette from "@/components/Technik/Signalkette";
import Kennlinien from "@/components/Technik/Kennlinien";
import { Hinweis, Kennwerte, Kurzantwort, Punkte, Quellen, Tabelle, UnterlagenAufAnfrage, Verweise } from "@/components/Technik/Bausteine";
import { JsonLd, seitenMeta, seitenSchema } from "@/components/Technik/seite";

const PFAD = "/technik/parkregler";
const TITEL = "EZA-Regler & Parkregler nach TOR Erzeuger | Ökovolt";
const BESCHREIBUNG =
  "Parkregler (EZA-Regler) für PV-Anlagen in Österreich: Q(U), cos φ, P(f), Einspeiselimit und Fernwirkschnittstelle zum Netzbetreiber nach TOR Typ A–D.";

export const metadata = seitenMeta({
  pfad: PFAD,
  titel: TITEL,
  beschreibung: BESCHREIBUNG,
  bild: "/Images/AT/technik/umspannwerk-obersielach.jpg",
  keywords: ["Parkregler", "EZA-Regler Österreich", "TOR Erzeuger Typ B", "Q(U)-Regelung", "Blindleistungsregelung PV", "Einspeisebegrenzung", "Spitzenkappung ElWG", "Fernwirktechnik PV"],
});

const TYPEN = [
  [
    "Typ A",
    "≥ 0,8 kW bis < 250 kW",
    "< 110 kV",
    "TOR Stromerzeugungsanlagen Typ A, V1.4 (gültig ab 01.06.2026)",
    "Wirkleistungsbeendigung über Eingangsport binnen 5 s; bei dynamischer Vorgabe nach § 76 ElWG digitale Schnittstelle (OpenADR), Sollwert in 1 min, Rückfallfunktion; Blindleistungsverfahren nach Netzanschlussvertrag; P(U) bei Umrichtern im NS-Netz standardmäßig aktiv.",
  ],
  [
    "Typ B",
    "≥ 250 kW bis < 35 MW",
    "< 110 kV",
    "TOR Stromerzeugungsanlagen Typ B, V1.3 (gültig ab 01.07.2024)",
    "Wirkleistungsvorgabe in bis zu 4 Stufen (< 1 MW), Sollwert bei Umrichtern in 1 min; Blindleistungsbereich II (cos φ 0,925 unter- bis übererregt); ab 1 MW Fernwirkschnittstelle nach Wahl des Netzbetreibers, Online-Sollwerte und Umschaltung des Q-Verfahrens; FRT und – im MS-Netz auf Verlangen – dynamische Blindstromstützung.",
  ],
  [
    "Typ C",
    "≥ 35 MW bis < 50 MW",
    "< 110 kV",
    "TOR Erzeuger Typ C",
    "Zusätzlich u. a. frequenzabhängiger Modus (FSM) und LFSM-U, erweiterte Spannungs- und Blindleistungsregelung, Echtzeit-Datenaustausch mit Netzbetreiber und Übertragungsnetzbetreiber.",
  ],
  [
    "Typ D",
    "≥ 50 MW",
    "oder Netzanschluss ≥ 110 kV",
    "TOR Erzeuger Typ D",
    "Anforderungen wie Typ C, dazu erweiterte Robustheits- und Stabilitätsanforderungen; Abstimmung mit dem Übertragungsnetzbetreiber (APG).",
  ],
];

const FUNKTIONEN = [
  {
    icon: SlidersHorizontal,
    title: "Wirkleistungsbegrenzung",
    text: "Sollwerte des Netzbetreibers in Stufen (z. B. 100/60/30/0 %) oder stufenlos umsetzen. Umrichter-Anlagen müssen den Sollwert nach TOR Typ B innerhalb von 1 Minute erreichen – in jedem Betriebspunkt.",
  },
  {
    icon: Waves,
    title: "Blindleistung: cos φ, cos φ(P), Q(U), Q fix",
    text: "Das Verfahren gibt der Netzbetreiber im Netzanschlussvertrag vor. Standard ohne Vorgabe ist cos φ = 1. Der Regler führt Q am Netzanschlusspunkt, nicht nur an den Wechselrichterklemmen.",
  },
  {
    icon: Gauge,
    title: "Spannungsregelung Q(U) und P(U)",
    text: "Q(U) mit mindestens 4 frei parametrierbaren Stützpunkten, PT1-Dynamik 3–60 s. Spannungsgeführte Wirkleistungsabregelung P(U) greift, bevor der Netzentkupplungsschutz die Anlage ganz abschaltet.",
  },
  {
    icon: Activity,
    title: "Frequenz: P(f) im LFSM-O",
    text: "Die Wechselrichter reduzieren ab 50,2 Hz autonom mit 5 % Statik. Der Parkregler ist so koordiniert, dass er dieser Reaktion nicht entgegenregelt – der LFSM-O-Sollwert hat Vorrang vor allen anderen Wirkleistungsvorgaben.",
  },
  {
    icon: TrendingDown,
    title: "Rampen & Gradienten",
    text: "Sollwertwechsel und Wiederzuschaltung werden rampenbegrenzt ausgeführt. Nach einer Auslösung des Entkupplungsschutzes empfiehlt die TOR höchstens 10 % Pmax pro Minute.",
  },
  {
    icon: Zap,
    title: "Einspeiselimit & Nulleinspeisung",
    text: "Die im Vertrag vereinbarte netzwirksame Leistung am Netzanschlusspunkt wird dynamisch eingehalten – bis hin zur Nulleinspeisung, während Eigenverbrauch, Speicher und Ladepunkte weiterlaufen.",
  },
  {
    icon: Power,
    title: "Fernabschaltung durch den Netzbetreiber",
    text: "Der Netzbetreiber gibt nur das Signal; die Umsetzung liegt in der Verantwortung des Anlagenbetreibers. Kann ein Reduktionssollwert nicht fristgerecht erreicht werden, ist die Anlage abzuschalten.",
  },
  {
    icon: ShieldCheck,
    title: "Netzsicherheitsmanagement & Rückfallwert",
    text: "Fällt die Kommunikation aus, geht der Regler auf einen vereinbarten Rückfallwert. Bei Online-Sollwertvorgabe verlangt die TOR eine Backup-Versorgung der Kommunikation für mindestens 30 Minuten.",
  },
  {
    icon: BatteryCharging,
    title: "Speicher & Ladepunkte im Regelkreis",
    text: "Überschüsse über dem Einspeiselimit fließen zuerst in Speicher und Ladepunkte, bevor Wechselrichter abgeregelt werden. Die Maximalkapazität wird für die Gesamtanordnung betrachtet.",
  },
];

const KONFORMITAET = [
  [
    "Regelwerk",
    "TOR Stromerzeugungsanlagen Typ A–D (E-Control) auf Basis RfG-VO, dazu Netzanschlussvertrag und Ausführungsbestimmungen des Netzbetreibers",
    "VDE-AR-N 4105 (NS), 4110 (MS), 4120 (HS), 4130 (HöS) auf Basis RfG-VO",
  ],
  [
    "Nachweis der Einheit",
    "Auf Anforderung Prüfbericht einer nach EN ISO/IEC 17025 akkreditierten Prüfstelle nach OVE-Richtlinie R 25 (NS); Prüfberichte nach VDE-AR-N 4105 werden anerkannt, wenn Q(U) und P(U) zusätzlich geprüft und die Ländereinstellung „Österreich“ bestätigt sind",
    "NS: Nachweis nach VDE-AR-N 4105; ab Mittelspannung Einheitenzertifikat einer akkreditierten Zertifizierungsstelle (Prüfung nach FGW TR 3, Modellvalidierung TR 4, Zertifizierung TR 8)",
  ],
  [
    "Regler (EZA-/Parkregler)",
    "Kein eigenes Komponentenzertifikat vorgeschrieben; Funktion wird im Konformitätsnachweis der Anlage belegt (Konformitätstests nach RKS-AT, Parameterauszug, Inbetriebnahmeprotokoll)",
    "Komponentenzertifikat für den EZA-Regler, Nachweis im Anlagenzertifikat",
  ],
  [
    "Nachweis der Anlage",
    "Prüfbericht des Netzentkupplungsschutzes und nach Bestandteilen aufgeschlüsselte Konformitätserklärung von Anlagenerrichter und Netzbenutzer; auf Anforderung Simulationsparameter, Konformitätstests/-simulationen nach RKS-AT",
    "Anlagenzertifikat (Planung) und Konformitätserklärung nach Inbetriebnahme – je nach Leistung und Netzebene; die Leistungsgrenzen wurden in den letzten Jahren mehrfach angepasst",
  ],
  [
    "Ersatz durch Zertifikate",
    "Betriebsmittelbescheinigungen einer nach EN ISO/IEC 17065 akkreditierten Zertifizierungsstelle können Prüfungen, Tests und Simulationen ganz oder teilweise ersetzen",
    "Zertifizierung ist der Regelweg",
  ],
  [
    "Im Betrieb",
    "Konformitätsüberwachung: Unterlagen nach Anhang A8 regelmäßig erstellen – in Arbeitsstätten in den Prüfintervallen der ESV 2012, sonst mindestens alle 5 Jahre",
    "Nachweis bei wesentlichen Änderungen; Prüfpflichten nach Betreiber- und Netzbetreiberregeln",
  ],
];

const FAQ = [
  {
    q: "Ab welcher Anlagengröße brauche ich in Österreich einen Parkregler?",
    a: "Es gibt keine einzelne kW-Grenze, die Pflicht ergibt sich aus TOR und Netzanschlussvertrag. Fordert der Netzbetreiber bei Anlagen auf Netzebene 5 oder 6 die Messung für die Blindleistungsbereitstellung auf der Mittelspannungsseite, ist laut TOR Typ A und B ein Park- und Anlagenregler erforderlich, wenn die Summe der Engpassleistungen am Netzanschlusspunkt über 100 kVA (mit Mittelspannungsmessung) bzw. über 400 kVA (ohne) liegt. In der Praxis ist ein Regler außerdem immer dann nötig, wenn mehrere Wechselrichter, Speicher oder Ladepunkte gemeinsam eine Vorgabe am Netzanschlusspunkt einhalten müssen – etwa ein Einspeiselimit.",
  },
  {
    q: "Was ist der Unterschied zwischen EZA-Regler und Parkregler?",
    a: "Fachlich keiner. „EZA-Regler“ (Erzeugungsanlagen-Regler) ist der in Deutschland gebräuchliche Begriff aus der VDE-AR-N 4110, die österreichischen TOR sprechen vom „Park- und Anlagenregler“. Gemeint ist in beiden Fällen die übergeordnete Regelung, die am Netzanschlusspunkt misst und die einzelnen Erzeugungseinheiten so führt, dass die Vorgaben des Netzbetreibers dort eingehalten werden.",
  },
  {
    q: "Brauche ich in Österreich ein Anlagenzertifikat wie in Deutschland?",
    a: "Nein, ein Anlagenzertifikat nach deutschem Muster ist in Österreich nicht vorgeschrieben. Der Netzbenutzer weist die Konformität im Betriebserlaubnisverfahren nach – mindestens mit dem Prüfbericht des Netzentkupplungsschutzes und einer nach Bestandteilen aufgeschlüsselten Konformitätserklärung von Anlagenerrichter und Netzbenutzer. Auf Anforderung kommen Prüfberichte nach OVE-Richtlinie R 25, ein maschinenlesbarer Parameterauszug der Ländereinstellung „Österreich“, Simulationsparameter sowie Konformitätstests nach RKS-AT dazu. Betriebsmittelbescheinigungen akkreditierter Zertifizierungsstellen können Tests ersetzen.",
  },
  {
    q: "Welche Schnittstelle verlangt der Netzbetreiber?",
    a: "Bei Typ-B-Anlagen unter 1 MW sieht die TOR – falls im Netzanschlussvertrag vorgesehen – potentialfreie Kontakte am Fernwirkgerät des Netzbetreibers vor, etwa an einem Funkrundsteuerempfänger oder Gateway. Ab 1 MW wählt der Netzbetreiber einen gängigen Standard wie IEC 60870-5-101 oder -104, Modbus RTU/TCP oder eine Online-Sollwertvorgabe. Für die dynamische Vorgabe der netzwirksamen Leistung nach § 76 ElWG nennt die TOR Typ A das Protokoll OpenADR über die Internetverbindung des Netzbenutzers.",
  },
  {
    q: "Was passiert, wenn die Kommunikation ausfällt?",
    a: "Der Regler fällt auf einen vereinbarten Rückfallwert zurück. Bei dynamischer Vorgabe der netzwirksamen Leistung verlangt die TOR Typ A eine Fall-Back-Funktion; bei Photovoltaik beträgt die Begrenzung in Einspeiserichtung dann 70 % der Modulspitzenleistung gemäß § 101 Abs. 2 ElWG, sofern vertraglich nichts anderes vereinbart ist. Anlagen mit Online-Sollwertvorgabe brauchen zusätzlich eine Backup-Stromversorgung, damit die Kommunikation mindestens 30 Minuten weiterläuft.",
  },
  {
    q: "Kann der Parkregler Wechselrichter verschiedener Hersteller ansteuern?",
    a: "Ja, das ist einer der Hauptgründe für einen herstellerunabhängigen Regler. Die Anbindung erfolgt über Modbus TCP, über SunSpec-Informationsmodelle oder über herstellerspezifische Protokolle. Welche Geräte und Firmwarestände wir im Einsatz geprüft haben, teilen wir projektbezogen mit – die Funktion wird bei jeder Inbetriebnahme mit Sollwertsprüngen nachgewiesen.",
  },
  {
    q: "Lässt sich eine bestehende PV-Anlage nachrüsten?",
    a: "In den meisten Fällen ja. Voraussetzung sind kommunikationsfähige Wechselrichter, eine geeignete Messung am Netzanschlusspunkt und die Abstimmung mit dem Netzbetreiber. Wird die Anlage erweitert oder wesentlich geändert, können neue Anforderungen gelten – etwa die Spitzenkappung nach § 101 ElWG für neu angeschlossene oder erweiterte PV-Anlagen.",
  },
  {
    q: "Wie wirkt die Spitzenkappung nach § 101 ElWG?",
    a: "Bei neu angeschlossenen oder erweiterten PV-Anlagen darf der Netzbetreiber die Einspeiseleistung auf bis zu 70 % der Modulspitzenleistung begrenzen; ausgenommen sind Anlagen bis 7 kW netzwirksamer Leistung. Laut Wirtschaftsministerium gilt die Begrenzung zunächst statisch, ab 2028 ist eine dynamische Variante nach Netzzustand vorgesehen. Ein Parkregler setzt die Grenze am Netzanschlusspunkt um; mit Speicher und gezieltem Eigenverbrauch geht dabei kaum Energie verloren.",
  },
];

const QUELLEN = [
  { titel: "E-Control: TOR Stromerzeugungsanlagen Typ A, Version 1.4", href: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+(7).pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735", hinweis: "gültig ab 01.06.2026" },
  { titel: "E-Control: TOR Stromerzeugungsanlagen Typ B, Version 1.3", href: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128", hinweis: "Kap. 5.1.3, 5.3.3–5.3.4, 5.4.1, 6.2, 8" },
  { titel: "E-Control: TOR Erzeuger Typ C, Version 1.2", href: "https://www.e-control.at/documents/1785851/1811582/TOR+Erzeuger+Typ+C+V1.2.pdf/fc0f4e98-d9d9-f9ee-05fa-5eaca3633927?t=1649704249885" },
  { titel: "Oesterreichs Energie: RKS-AT Typ B, Version 1.1", href: "https://oesterreichsenergie.at/fileadmin/user_upload/Oesterreichs_Energie/Publikationsdatenbank/Diverses/2022/RKS-AT_Typ_B_v1.1.pdf", hinweis: "Richtlinien für den Konformitätsnachweis" },
  { titel: "Oesterreichs Energie: Erläuterungen zur TOR-Umsetzung", href: "https://oesterreichsenergie.at/publikationen/ueberblick/detailseite/erlaeuterungen-zur-tor-umsetzung", hinweis: "Typeinteilung nach RfG-Schwellenwert-V" },
  { titel: "Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", href: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", hinweis: "§§ 76, 101" },
  { titel: "BMWET: Spitzenkappung – Infos zum ElWG", href: "https://www.bmwet.gv.at/Services/Infos-FAQ/elwg-infos/spitzenkappung.html" },
  { titel: "Verordnung (EU) 2016/631 (Netzkodex Requirements for Generators, RfG)", href: "https://eur-lex.europa.eu/eli/reg/2016/631/oj" },
  { titel: "OVE-Richtlinie R 25:2020-03-01", hinweis: "Prüfanforderungen an Erzeugungseinheiten für den Parallelbetrieb am Niederspannungsnetz" },
  { titel: "ÖVE/ÖNORM EN 50549-1 und -2", hinweis: "Anforderungen an Erzeugungsanlagen am Nieder- bzw. Mittelspannungsnetz; verbindlich für den Anschluss in Österreich sind TOR und Netzanschlussvertrag" },
  { titel: "ÖVE/ÖNORM EN 62446-1", hinweis: "Prüfung, Dokumentation und Instandhaltung netzgekoppelter PV-Systeme" },
  { titel: "SunSpec Alliance: Informationsmodelle für DER", href: "https://sunspec.org/" },
];

export default function ParkreglerPage() {
  return (
    <div>
      <JsonLd
        daten={seitenSchema({
          pfad: PFAD,
          name: "Parkregler (EZA-Regler) für PV-Anlagen in Österreich",
          beschreibung: BESCHREIBUNG,
          service: {
            name: "Parkregler / EZA-Regler: Planung, Parametrierung und Inbetriebnahme",
            serviceType: "Regelung von Erzeugungsanlagen am Netzanschlusspunkt",
            beschreibung: "Herstellerunabhängige Regelung von Wirk- und Blindleistung am Netzanschlusspunkt nach TOR Stromerzeugungsanlagen, mit Fernwirkanbindung an Netzbetreiber und Direktvermarkter.",
            audience: "Anlagenbetreiber, Planer, Asset Manager, Netzbetreiber",
          },
        })}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Technik", href: "/technik" }, { name: "Parkregler (EZA-Regler)" }]}
        eyebrow="Eigene Technik · Parkregler für Österreich"
        title={
          <>
            Parkregler für den Netzanschlusspunkt – <span className="ov-text-gradient-light">nach TOR Erzeuger</span>
          </>
        }
        lead="Unser eigener Parkregler (EZA-Regler) misst am Netzanschlusspunkt und führt Wechselrichter, Speicher und Ladepunkte so, dass Wirkleistung, Blindleistung und Einspeiselimit die Vorgaben Ihres Netzbetreibers einhalten – herstellerunabhängig und dokumentiert."
        image={{ src: "/Images/AT/technik/umspannwerk-obersielach.jpg", alt: "Freiluft-Schaltanlage eines Umspannwerks in Kärnten unter blauem Himmel" }}
        actions={[
          { label: "Projekt besprechen", href: "/termin?art=video" },
          { label: "Datenblatt anfragen", href: "/kontakt", icon: ClipboardCheck },
        ]}
        points={["Q(U), cos φ(P), P(f), P(U)", "Fernwirkanbindung an den Netzbetreiber", "Herstellerunabhängig", "Nachrüstung von Bestandsanlagen"]}
      />

      <Kurzantwort frage="Was macht ein Parkregler (EZA-Regler)?">
        <p>
          Ein Parkregler ist die übergeordnete Regelung einer PV-Anlage: Er misst Spannung, Strom, Wirk- und Blindleistung am
          Netzanschlusspunkt und gibt den einzelnen Wechselrichtern, Speichern und Ladepunkten laufend Sollwerte vor. So hält die gesamte
          Anlage dort ein, was der Netzbetreiber verlangt – Einspeiselimit, Blindleistungsverfahren und Fernabschaltung.
        </p>
        <p>
          In Österreich stehen die Anforderungen in den TOR Stromerzeugungsanlagen der E-Control (Typ A bis D) und im Netzanschlussvertrag.
          Wechselrichter allein können das nicht leisten, weil jeder nur seine eigenen Klemmen sieht.
        </p>
      </Kurzantwort>

      {/* Anlagentypen */}
      <Section tone="white" space="lg" id="anlagentypen" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Einordnung"
          title="Anlagentypen A bis D: welche Regeln für Ihre Anlage gelten"
          lead="Österreich teilt Stromerzeugungsanlagen nach der RfG-Schwellenwert-Verordnung der E-Control in vier Typen ein. Maßgeblich ist die Maximalkapazität der Anlage – mehrere Einheiten und Speicher an einem Netzanschlusspunkt zählen zusammen."
          className="mb-10"
        />
        <Tabelle
          caption="Typeinteilung von Stromerzeugungsanlagen in Österreich"
          kopf={["Typ", "Maximalkapazität", "Netzanschluss", "Regelwerk", "Wesentliche Regelungs- und Kommunikationsanforderungen"]}
          zeilen={TYPEN}
          kompakt
          minBreite={900}
          quelle="Quelle: E-Control, TOR Stromerzeugungsanlagen Typ A V1.4 und Typ B V1.3; Typeinteilung nach RfG-Schwellenwert-V. Vereinfachte Darstellung – verbindlich sind TOR, Netzanschlussvertrag und Ausführungsbestimmungen Ihres Netzbetreibers."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Hinweis ton="norm" titel="Wann die TOR ausdrücklich einen Park- und Anlagenregler verlangt">
            <p>
              Fordert der Netzbetreiber bei Anlagen auf Netzebene 5 oder 6 die Messwerte für die Blindleistungsbereitstellung auf der
              Mittelspannungsseite, ist ein Park- und Anlagenregler erforderlich, sobald die Summe der Engpassleistungen am
              Netzanschlusspunkt über <strong>100 kVA</strong> liegt (mit Mittelspannungsmessung) bzw. über <strong>400 kVA</strong> (ohne
              Mittelspannungsmessung).
            </p>
          </Hinweis>
          <Hinweis ton="info" titel="Maximalkapazität ist nicht netzwirksame Leistung">
            <p>
              Für den Typ zählt die Maximalkapazität der Gesamtanordnung. Die netzwirksame Leistung ist die im Vertrag vereinbarte maximale
              Leistung am Netzanschlusspunkt – genau die Größe, die ein Parkregler dynamisch einhält, etwa wenn der Netzanschluss kleiner ist
              als die installierte Leistung.
            </p>
          </Hinweis>
        </div>
      </Section>

      {/* Signalkette */}
      <Section tone="sand" space="lg" id="signalkette" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Funktionsprinzip"
          title="Vom Sollwert des Netzbetreibers bis zum einzelnen Wechselrichter"
          lead="Der Parkregler ist ein geschlossener Regelkreis: Vorgaben kommen von Netzbetreiber, Direktvermarkter und Betreiber, gemessen wird am Netzanschlusspunkt, gestellt wird an jedem Wechselrichter, Speicher und Ladepunkt."
          className="mb-10"
        />
        <Signalkette />
      </Section>

      {/* Regelfunktionen */}
      <Section tone="white" space="lg" id="regelfunktionen" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Regelfunktionen"
          title="Was der Parkregler am Netzanschlusspunkt regelt"
          lead="Die Funktionen entsprechen den Anforderungen, die TOR und Netzanschlussvertrag an die Gesamtanlage stellen. Welche davon aktiv sind und mit welchen Parametern, legt der Netzbetreiber fest."
          className="mb-12"
        />
        <FeatureGrid cols={3} items={FUNKTIONEN} />
      </Section>

      {/* Kennlinien */}
      <Section tone="ink" space="lg" id="kennlinien" className="scroll-mt-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <SectionHeading
            eyebrow="Normwerte"
            title="Standardkennlinien nach TOR – und was der Regler daraus macht"
            lead="Ohne abweichende Vorgabe des Netzbetreibers gelten die Standardeinstellungen der TOR. In der Praxis schreiben viele Netzbetreiber eigene Stützpunkte, Verschiebungsfaktoren oder Zeitkonstanten vor."
          />
          <Kennwerte
            items={[
              { label: "Blindleistungsbereich (Typ B)", wert: "Bereich II: cos φ 0,925", text: "Q/Pmax ±0,411 bei Maximalkapazität; Bereich I oder III nur in begründeten Ausnahmefällen" },
              { label: "Standard ohne Vorgabe", wert: "cos φ = 1, Q fix = 0", text: "cos φ(P) standardmäßig deaktiviert" },
              { label: "Q-Sollwerte ab 1 MW", wert: "an der Messstelle in ≤ 1 min", text: "Online-Vorgabe und Umschaltung der Verfahren über Fernwirkschnittstelle" },
              { label: "Wiederzuschaltung", wert: "≤ 10 % Pmax pro Minute", text: "Wartezeit Standard 60 s, nach Schutzauslösung 300 s (NS, Umrichter)" },
            ]}
          />
        </div>
        <Kennlinien />
        <p className="mt-6 max-w-4xl text-[14px] leading-relaxed text-ink-600">
          Q(U) wird – sofern nicht jede Phase einzeln geregelt wird – auf die höchste Phasenspannung geregelt. Im Arbeitsbereich unter 0,2 Pmax
          darf sich das Blindleistungsverhalten nicht sprunghaft ändern. Wichtig für die Koordination: Regeln Wechselrichter und Parkregler
          beide auf Q(U), müssen Zeitkonstanten und Referenzpunkte aufeinander abgestimmt sein, sonst schwingen die Regelkreise gegeneinander.
        </p>
      </Section>

      {/* Messung am Netzanschlusspunkt */}
      <Section tone="white" space="lg" id="messung" className="scroll-mt-24">
        <SplitMedia
          eyebrow="Messung am Netzanschlusspunkt"
          title="Geregelt wird dort, wo der Netzbetreiber misst"
          text={[
            "Die Vorgaben des Netzbetreibers gelten am Netzanschlusspunkt. Deshalb braucht der Parkregler dort eine eigene, schnelle Messung von Spannung, Strom, Wirk- und Blindleistung sowie Frequenz – über Strom- und Spannungswandler, bei Mittelspannungsanschluss nach Vorgabe des Netzbetreibers auf der Mittelspannungsseite.",
            "Wird auf der Niederspannungsseite gemessen, verlangt die TOR bei Netzebene 5 den Messabgriff in der Niederspannungs-Hauptverteilung und bei Netzebene 6 an der Verrechnungsmessung. Die Stufenstellung des Transformators muss vertraglich festgelegt sein, damit die Einstellwerte auf die Mittelspannung umgerechnet werden können.",
          ]}
          points={[
            { title: "Blindleistungsbedarf der Kabelstrecke", text: "Liegt der Netzanschlusspunkt nicht am Transformator, kann der Netzbetreiber die Kompensation der MS-Leitung verlangen – der Regler berücksichtigt das im Sollwert." },
            { title: "Wandler und Genauigkeit", text: "Wandlerübersetzung, Phasenlage und Messkette prüfen wir bei der Inbetriebnahme gegen die Verrechnungsmessung." },
            { title: "Getrennte Rollen", text: "Die Messung für die Regelung ersetzt nicht den Zähler des Netzbetreibers und nicht den Netzentkupplungsschutz." },
          ]}
          image={{ src: "/Images/AT/technik/umspannwerk-transformator.jpg", alt: "Transformator mit Schaltgeräten in einem Umspannwerk" }}
        />
      </Section>

      {/* Kommunikation zu Wechselrichtern */}
      <Section tone="sand" space="lg" id="kommunikation" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Feldebene"
          title="Wechselrichter verschiedener Hersteller in einem Regelkreis"
          lead="Große Anlagen wachsen über Jahre, Wechselrichter werden getauscht, Speicher kommen dazu. Ein herstellerunabhängiger Regler hält die Anlage trotzdem als Ganzes regelbar."
          className="mb-12"
        />
        <Punkte
          spalten={3}
          items={[
            { titel: "Protokolle", tag: "Modbus TCP · SunSpec", text: "Anbindung über Modbus TCP mit SunSpec-Informationsmodellen oder über dokumentierte Herstellerregister. Jede Gerätefamilie wird mit Sollwertsprüngen im Feld verifiziert." },
            { titel: "Sollwertverteilung", tag: "Regelstrategie", text: "Sollwerte werden nach verfügbarer Leistung verteilt, nicht starr nach Nennleistung. Fällt ein Wechselrichter aus, übernehmen die übrigen – das Ergebnis am Netzanschlusspunkt bleibt gleich." },
            { titel: "Zykluszeiten", tag: "Timing", text: "Messung, Regelung und Kommunikation sind so ausgelegt, dass die TOR-Fristen am Netzanschlusspunkt eingehalten werden – etwa 1 Minute für Wirkleistungssollwerte bei Umrichtern." },
            { titel: "Parametrierschutz", tag: "TOR 6.2.3", text: "Netzrelevante Einstellungen sind gegen unbefugte Änderung geschützt; Softwareupdates dürfen sie nicht verändern. Wir sichern die Parameter vor und nach jedem Update." },
            { titel: "Netzwerk & Security", tag: "Segmentierung", text: "Feldbus und Anlagennetz sind vom Internet getrennt. Modbus und IEC 60870-5-104 haben keine eingebaute Authentifizierung – Zugriffe laufen deshalb ausschließlich über gesicherte Fernwartungswege." },
            { titel: "Dokumentation", tag: "Parameterauszug", text: "Einstellwerte, Registerbelegung und Signalliste werden maschinenlesbar dokumentiert – als Teil des Konformitätsnachweises und für spätere Änderungen." },
          ]}
        />
      </Section>

      {/* Speicher & Ladeinfrastruktur */}
      <Section tone="navy" space="lg" className="overflow-hidden" id="speicher">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-10 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Speicher & Ladeinfrastruktur"
            title="Ein Netzanschlusspunkt, eine Regelung – auch mit Batterie und E-Flotte"
            lead="Sobald Speicher und Ladepunkte hinter demselben Netzanschluss hängen, entscheidet die Regelung, wohin jede Kilowattstunde fließt. Genau hier entsteht der wirtschaftliche Mehrwert."
          />
          <Punkte
            dunkel
            spalten={1}
            items={[
              { titel: "Einspeiselimit ohne Energieverlust", text: "Überschüsse über der netzwirksamen Leistung – etwa bei der Spitzenkappung auf 70 % – lädt der Regler zuerst in den Speicher und in Fahrzeuge, bevor Wechselrichter abgeregelt werden." },
              { titel: "Bezugsseite im Blick", text: "Ladepunkte werden über das Lademanagement (OCPP) so geführt, dass die vereinbarte Bezugsleistung und der Leistungspreis nicht durch gleichzeitiges Laden in die Höhe gehen." },
              { titel: "Speicher als Netzbenutzer", text: "Für elektrische Energiespeicher verweist die TOR auf die TOR Verteilernetzanschluss – inklusive LFSM-U und FRT im Bezugsbetrieb. Maximalkapazität und Regelkonzept werden für die Gesamtanordnung betrachtet." },
              { titel: "Klare Priorität", text: "Schutz und Netzbetreiber-Vorgaben stehen immer über Vermarktung und Eigenoptimierung. Diese Reihenfolge ist im Regler fest hinterlegt und dokumentiert." },
            ]}
          />
        </div>
      </Section>

      {/* Konformität AT vs. DE */}
      <Section tone="white" space="lg" id="konformitaet" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Nachweise & Konformität"
          title="Konformitätsnachweis in Österreich – anders als das deutsche Zertifikatsmodell"
          lead="Wer Anlagen in Deutschland kennt, erwartet Einheiten-, Komponenten- und Anlagenzertifikate. Österreich setzt auf Konformitätserklärung, Prüfberichte und Tests nach RKS-AT – Zertifikate sind möglich, aber nicht der Regelweg."
          className="mb-10"
        />
        <Tabelle
          caption="Nachweislogik für Erzeugungsanlagen und Regler: Österreich und Deutschland im Vergleich"
          kopf={["Thema", "Österreich", "Deutschland (zum Vergleich)"]}
          zeilen={KONFORMITAET}
          hervor={1}
          minBreite={820}
          quelle="Quellen: TOR Stromerzeugungsanlagen Typ B V1.3, Kap. 8; RKS-AT Typ B V1.1; VDE-AR-N 4105/4110. Deutsche Zertifikate gelten in Österreich nicht automatisch, können aber als Nachweis für einzelne Anforderungen dienen."
        />
        <div className="mt-8">
          <UnterlagenAufAnfrage
            text="Funktionsbeschreibung, Schnittstellen- und Signalliste sowie Prüfprotokoll-Vorlagen unseres Parkreglers stellen wir Planern, Netzbetreibern und Gutachtern projektbezogen zur Verfügung."
          />
        </div>
      </Section>

      {/* Inbetriebnahme */}
      <Section tone="sand" space="lg" id="inbetriebnahme" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Inbetriebnahme & Prüfprotokoll"
          title="Von der Parametrierung bis zur Betriebserlaubnis"
          lead="Der Netzbetreiber kann bei der Prüfung anwesend sein – unter anderem bei Schutzprüfung, Zuschaltbedingungen und Blindleistungs- und Spannungsregelung. Wir bereiten die Nachweise so vor, dass sie ohne Nachforderung durchgehen."
          align="center"
          className="mb-14"
        />
        <Steps
          cols={3}
          items={[
            { icon: FileCheck2, title: "Vorgaben übernehmen", text: "Netzanschlussvertrag, Blindleistungsverfahren, Stützpunkte, Signalliste und Rückfallwerte des Netzbetreibers in die Parametrierung übernehmen." },
            { icon: Cable, title: "Signaltest Fernwirk", text: "Stufen oder Online-Sollwerte gemeinsam mit der Leitstelle des Netzbetreibers durchfahren und Rückmeldungen prüfen." },
            { icon: Activity, title: "Sprungantworten messen", text: "Wirk- und Blindleistungssprünge am Netzanschlusspunkt aufzeichnen: Verzögerung, Anschwing- und Einschwingzeit, Toleranzband." },
            { icon: ShieldCheck, title: "Schutz & Zuschaltung", text: "Netzentkupplungsschutz mit analogen Prüfgrößen: Ansprech- und Rückfallwerte, Auslösezeiten und Auslösung des Schaltgeräts protokollieren." },
            { icon: RefreshCw, title: "Ausfall simulieren", text: "Kommunikation trennen und prüfen, ob der Regler den Rückfallwert einnimmt; Backup-Versorgung der Kommunikation testen." },
            { icon: ClipboardCheck, title: "Dokumentation", text: "Prüfprotokoll, maschinenlesbarer Parameterauszug und Unterlagen nach ÖVE/ÖNORM EN 62446-1 an Netzbetreiber und Betreiber übergeben." },
          ]}
        />
      </Section>

      {/* Nachrüstung */}
      <Section tone="white" space="lg" id="nachruestung" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Bestandsanlagen"
            title="Parkregler nachrüsten: wann es sich lohnt und was zu prüfen ist"
            lead="Viele Anlagen der letzten zehn Jahre regeln nur über Rundsteuerempfänger und feste Wechselrichterparameter. Ein Parkregler macht sie fit für Einspeiselimits, Speicher und Direktvermarktung."
          />
          <Punkte
            spalten={2}
            items={[
              { titel: "Anlass", text: "Erweiterung, Speicher-Nachrüstung, neuer Netzzugang mit Einspeiselimit, Wechsel in die Direktvermarktung oder Auflagen des Netzbetreibers." },
              { titel: "Wesentliche Änderung", tag: "TOR Kap. 2.2", text: "Wird eine Anlage wesentlich geändert, können für sie die aktuellen TOR-Anforderungen gelten. Das klären wir vorab mit dem Netzbetreiber." },
              { titel: "Bestandsaufnahme", text: "Wechselrichter-Kommunikation und Firmware, vorhandene Messung und Wandler, Rundsteuer- oder Fernwirkgerät, Netzwerk und Schaltschrankplatz." },
              { titel: "Umbau im Betrieb", text: "Der Regler wird parallel aufgebaut und erst nach erfolgreichem Test scharf geschaltet – die Anlage speist bis dahin mit bisheriger Einstellung weiter." },
            ]}
          />
        </div>
        <div className="mt-10">
          <Hinweis ton="achtung" titel="Spitzenkappung bei Erweiterungen">
            <p>
              Für neu angeschlossene und erweiterte PV-Anlagen darf der Netzbetreiber die Einspeiseleistung nach § 101 ElWG auf bis zu 70 % der
              Modulspitzenleistung begrenzen (ausgenommen Anlagen bis 7 kW netzwirksamer Leistung). Ein Parkregler setzt diese Grenze am
              Netzanschlusspunkt um, statt jeden Wechselrichter pauschal zu drosseln.
            </p>
          </Hinweis>
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Parkregler und EZA-Regler – für Technik, Planung und Asset Management"
            lead="Ihre Frage betrifft einen konkreten Netzanschluss? Schicken Sie uns Netzanschlussvertrag oder Anschlusskonzept – wir sagen Ihnen, was der Regler dort leisten muss."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Verweise
        ueberschrift="Technik im Verbund"
        items={[
          { href: "/technik/scada", titel: "SCADA & Leitwarte", text: "Wie Messwerte, Sollwerte und Alarme aus dem Parkregler im Portfolio-Monitoring landen." },
          { href: "/technik/fernwartung", titel: "Fernwartung & IT-Security", text: "Sichere Zugriffe auf Regler und Wechselrichter nach NISG 2026 und IEC 62443." },
          { href: "/service/direktvermarktung", titel: "Reststromvermarktung", text: "Warum Direktvermarkter Fernsteuerbarkeit verlangen – und wer im Regler Vorrang hat." },
          { href: "/forderungen/richtlinien", titel: "Richtlinien & Netzanschluss", text: "EAG, ElWG, TOR und OVE-Richtlinien im Überblick." },
        ]}
      />

      <Quellen items={QUELLEN} bildnachweis="Umspannwerk Obersielach: Christiankral, CC BY 4.0, via Wikimedia Commons · Transformator im Umspannwerk: PtiBzh, CC0, via Wikimedia Commons." />

      <CtaBand
        eyebrow="Für Planer, Betreiber und Asset Manager"
        title="Netzanschlussvertrag da – und jetzt? Wir setzen ihn regelungstechnisch um."
        text="Wir prüfen Ihre Vorgaben, planen Messung und Fernwirkanbindung und nehmen den Parkregler gemeinsam mit Ihrem Netzbetreiber in Betrieb – auch für Bestandsanlagen."
        primary={{ label: "Projekt besprechen", href: "/termin?art=video" }}
        secondary={{ label: "Anfrage senden", href: "/kontakt", icon: CalendarCheck2 }}
      />
    </div>
  );
}

