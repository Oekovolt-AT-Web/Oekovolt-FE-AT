import {
  BellRing,
  CalendarCheck2,
  ClipboardList,
  Cpu,
  FileLock2,
  Fingerprint,
  History,
  KeyRound,
  Network,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Siren,
  Stethoscope,
  Truck,
  Wrench,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { Hinweis, Kurzantwort, Punkte, Quellen, Tabelle, Verweise } from "@/components/Technik/Bausteine";
import { JsonLd, seitenMeta, seitenSchema } from "@/components/Technik/seite";
import { SOLENSA } from "@/lib/site";

const PFAD = "/technik/fernwartung";
const TITEL = "PV-Fernwartung & IT-Security nach NISG 2026 | Ökovolt";
const BESCHREIBUNG =
  "Fernwartung für PV-Anlagen in Österreich: sichere Zugriffe mit VPN, MFA und Protokoll, 24/7-Alarmierung, Firmware-Management und IT-Security nach NISG 2026.";

export const metadata = seitenMeta({
  pfad: PFAD,
  titel: TITEL,
  beschreibung: BESCHREIBUNG,
  bild: "/Images/AT/technik/serverraum-racks.jpg",
  keywords: ["PV Fernwartung", "Fernüberwachung Photovoltaik", "NISG 2026 Photovoltaik", "IEC 62443", "OT-Security PV", "Firmware-Management Wechselrichter"],
});

const ZUGRIFF = [
  { icon: Network, title: "Keine offenen Ports an der Anlage", text: "Das Gateway in der Anlage baut die verschlüsselte Verbindung von innen nach außen auf. Von außen erreichbare Modbus- oder Webschnittstellen gibt es nicht." },
  { icon: Fingerprint, title: "Mehr-Faktor-Authentifizierung", text: "Jeder Zugriff auf Regler, Wechselrichter oder Datenlogger erfordert eine persönliche Kennung mit zweitem Faktor – keine geteilten Sammelkonten." },
  { icon: KeyRound, title: "Zero Trust & minimale Rechte", text: "Jede Sitzung wird einzeln geprüft und nur für die benötigten Geräte freigeschaltet. Lesender Zugriff ist die Regel, schreibender die begründete Ausnahme." },
  { icon: History, title: "Lückenloses Protokoll", text: "Wer wann worauf zugegriffen und was geändert hat, wird zeitgestempelt protokolliert – inklusive Parameteränderungen an netzrelevanten Einstellungen." },
  { icon: FileLock2, title: "Zonen & Übergänge", text: "Anlagennetz, Fernwirkanbindung des Netzbetreibers und Büro-IT sind getrennte Zonen mit definierten Übergängen nach dem Zonen-Conduit-Modell der IEC 62443." },
  { icon: ShieldCheck, title: "Gesicherte Protokolle", text: "Modbus TCP und IEC 60870-5-104 bringen keine eigene Authentifizierung mit. Sie bleiben im Anlagennetz; wo Geräte es unterstützen, nutzen wir gesicherte Varianten nach IEC 62351." },
];

const NORMEN = [
  [
    "NISG 2026 (Umsetzung NIS2)",
    "Österreichisches Gesetz, in Kraft ab 01.10.2026; betrifft mittlere und große Einrichtungen in 18 Sektoren, darunter Energie",
    "Risikomanagement, Lieferkettensicherheit, Multi-Faktor-Authentifizierung, Meldepflichten (24 h / 72 h / 1 Monat), Verantwortung der Geschäftsleitung",
  ],
  [
    "IEC 62443",
    "Normenreihe zur Security industrieller Automatisierungs- und Steuerungssysteme (OT)",
    "Teil 2-4: Anforderungen an Dienstleister; 3-2: Risikobewertung, Zonen und Conduits; 3-3: Systemanforderungen und Security-Level; 4-1/4-2: sichere Produktentwicklung und Komponenten",
  ],
  [
    "ISO/IEC 27001:2022",
    "Managementsystem für Informationssicherheit (ISMS)",
    "Organisatorischer Rahmen: Risiken, Rollen, Zugriffskontrolle, Lieferanten, Vorfallbehandlung, laufende Verbesserung",
  ],
  [
    "Cyber Resilience Act, VO (EU) 2024/2847",
    "EU-Anforderungen an Produkte mit digitalen Elementen, stufenweise anwendbar",
    "Sicherheitsupdates und Schwachstellenmanagement durch Hersteller – relevant bei Auswahl von Wechselrichtern, Loggern und Gateways",
  ],
  [
    "Netzkodex Cybersicherheit, Del. VO (EU) 2024/1366",
    "Sektorspezifische Vorgaben für grenzüberschreitende Stromflüsse",
    "Wird von der TOR Typ A ausdrücklich für die digitale Schnittstelle zur Ansteuerung von Erzeugungsanlagen genannt",
  ],
  [
    "DSGVO",
    "Datenschutz-Grundverordnung",
    "Zugriffsprotokolle, Benutzerkonten und Verbrauchsdaten sind personenbezogen: Auftragsverarbeitung nach Art. 28, Datenminimierung, Speicherdauer",
  ],
];

const FAQ = [
  {
    q: "Wie greift Ökovolt sicher auf meine PV-Anlage zu?",
    a: "Über eine verschlüsselte Verbindung, die das Gateway in Ihrer Anlage von innen nach außen aufbaut – an der Anlage sind keine Ports aus dem Internet erreichbar. Jeder Zugriff erfolgt mit persönlicher Kennung und zweitem Faktor, wird nur für die benötigten Geräte freigeschaltet und zeitgestempelt protokolliert. Anlagennetz, Fernwirkanbindung und Büro-IT sind getrennte Zonen.",
  },
  {
    q: "Fällt mein Betrieb unter das NISG 2026?",
    a: "Das NISG 2026 tritt am 1. Oktober 2026 in Kraft und gilt grundsätzlich für mittlere und große Einrichtungen – ab 50 Beschäftigten oder, bei weniger Beschäftigten, mit mehr als 10 Mio. € Jahresumsatz und mehr als 10 Mio. € Bilanzsumme – in 18 Sektoren, darunter Energie. Ob Ihr Unternehmen erfasst ist, hängt vom Sektor und der konkreten Tätigkeit ab; das klären Sie am besten mit Ihrer Rechts- oder IT-Security-Beratung. Betroffene Einrichtungen müssen sich binnen drei Monaten registrieren und auch die Sicherheit ihrer Lieferkette – also etwa ihrer Fernwartungsdienstleister – bewerten.",
  },
  {
    q: "Was bedeutet das NISG 2026 für die Fernwartung meiner PV-Anlage?",
    a: "Wenn Ihr Unternehmen unter das Gesetz fällt, gehört die Fernwartung Ihrer Anlagen zur Lieferkette, deren Sicherheit Sie bewerten müssen. Praktisch heißt das: dokumentierte Zugriffswege, Multi-Faktor-Authentifizierung, Protokollierung, Regeln für Updates und ein abgestimmter Meldeweg bei Sicherheitsvorfällen. Diese Punkte legen wir im Wartungsvertrag fest und stellen Ihnen die Beschreibung unserer Maßnahmen für Ihre Lieferantenbewertung zur Verfügung.",
  },
  {
    q: "Setzt Ökovolt Anlagen aus der Ferne zurück?",
    a: "Ja, wenn die Diagnose das rechtfertigt – etwa bei einem hängenden Kommunikationsmodul oder einem Wechselrichter nach einem Softwarefehler. Auslösungen des Netzentkupplungs- oder Anlagenschutzes quittieren wir nicht blind: Zuerst wird die Ursache geklärt, bei Bedarf vor Ort. Jeder Reset wird protokolliert und im Störungsbericht dokumentiert.",
  },
  {
    q: "Wie werden Firmware-Updates gehandhabt?",
    a: "Updates werden nicht automatisch eingespielt, sondern bewertet, zuerst an einzelnen Geräten getestet und dann gestaffelt ausgerollt – mit Rückfallmöglichkeit. Vor und nach dem Update sichern wir die netzrelevanten Parameter, denn nach TOR dürfen Softwareupdates die Einstellungen nach Ländereinstellung „Österreich“ nicht verändern.",
  },
  {
    q: "Welche Reaktionszeiten gelten?",
    a: "Reaktions- und Entstörzeiten vereinbaren wir im Wartungsvertrag passend zu Anlagengröße und Bedeutung für Ihren Betrieb. Die Fernwartung sorgt dafür, dass viele Störungen ohne Anfahrt behoben werden und der Einsatz vor Ort – wenn er nötig ist – mit Diagnose und passendem Ersatzteil startet.",
  },
  {
    q: "Wem gehören die Daten meiner Anlage?",
    a: "Ihnen. Wir verarbeiten Betriebs- und Zugriffsdaten im Auftrag, soweit sie personenbezogen sind auf Grundlage eines Auftragsverarbeitungsvertrags nach Art. 28 DSGVO. Speicherort, Speicherdauer und Exportmöglichkeiten legen wir vertraglich fest.",
  },
];

const QUELLEN = [
  { titel: "WKO: NISG 2026 – neue Pflichten zur Cybersicherheit", href: "https://www.wko.at/it-sicherheit/nis2-uebersicht", hinweis: "Inkrafttreten, Fristen, Schwellenwerte, Meldepflichten" },
  { titel: "Richtlinie (EU) 2022/2555 (NIS2)", href: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj" },
  { titel: "Verordnung (EU) 2024/2847 (Cyber Resilience Act)", href: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj" },
  { titel: "Delegierte Verordnung (EU) 2024/1366 (Netzkodex Cybersicherheit)", href: "https://eur-lex.europa.eu/eli/reg_del/2024/1366/oj" },
  { titel: "E-Control: TOR Stromerzeugungsanlagen Typ A, V1.4, Kap. 5.4.1.2 und 6.2.3", href: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+(7).pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735", hinweis: "Cybersicherheit der Schnittstelle, Schutz der Einstellungen" },
  { titel: "E-Control: TOR Stromerzeugungsanlagen Typ B, V1.3, Kap. 6.2", href: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128", hinweis: "Fernwirkschnittstelle, Backup-Systeme" },
  { titel: "IEC 62443 (Reihe)", hinweis: "Security for industrial automation and control systems" },
  { titel: "IEC 62351 (Reihe)", hinweis: "Datensicherheit für Kommunikationsprotokolle der Energietechnik" },
  { titel: "ISO/IEC 27001:2022", hinweis: "Informationssicherheits-Managementsysteme" },
  { titel: "NIST SP 800-207: Zero Trust Architecture", href: "https://csrc.nist.gov/pubs/sp/800/207/final" },
  { titel: "Datenschutz-Grundverordnung (EU) 2016/679, Art. 28", href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj" },
];

export default function FernwartungPage() {
  return (
    <div>
      <JsonLd
        daten={seitenSchema({
          pfad: PFAD,
          name: "Fernwartung und IT-Security für PV-Anlagen in Österreich",
          beschreibung: BESCHREIBUNG,
          service: {
            name: "Fernwartung und Fernüberwachung von Photovoltaikanlagen",
            serviceType: "Fernwartung, Störungsmanagement und OT-Security",
            beschreibung: "Sichere Fernzugriffe, 24/7-Alarmierung, Fehlerdiagnose, Firmware-Management und Reaktionskonzept für PV-Anlagen, Speicher und Ladeinfrastruktur – digitalisiert gemeinsam mit der Solensa GmbH.",
            audience: "Gewerbe, Industrie, Landwirtschaft, öffentliche Hand, Asset Manager",
          },
        })}
      />

      <PageHero
        breadcrumbs={[{ name: "Technik", href: "/technik" }, { name: "Fernwartung" }]}
        eyebrow="Eigene Technik · Fernwartung"
        title={
          <>
            Fernwartung, die Ausfälle verkürzt – <span className="ov-text-gradient">und sicher bleibt</span>
          </>
        }
        lead="Mit eigenen Fernwartungssystemen erkennen wir Störungen an PV-Anlagen, Speichern und Parkreglern früh, beheben viele aus der Ferne und schicken Technikerinnen und Techniker nur dann, wenn es nötig ist – mit Diagnose und passendem Ersatzteil."
        image={{ src: "/Images/AT/technik/serverraum-racks.jpg", alt: "Serverraum mit Netzwerk-Racks und verkabelten Patchfeldern" }}
        actions={[
          { label: "Fernwartung anfragen", href: "/service/wartung" },
          { label: "Termin vereinbaren", href: "/termin?art=video", icon: CalendarCheck2 },
        ]}
        points={["VPN, MFA & Protokollierung", "24/7-Alarmierung", "Firmware-Management", "Architektur nach IEC-62443-Prinzipien"]}
      />

      <Kurzantwort frage="Was leistet die Fernwartung einer PV-Anlage?">
        <p>
          Fernwartung heißt: Die Anlage wird rund um die Uhr überwacht, Störungen lösen automatisch einen Alarm aus, und Fachleute können
          Wechselrichter, Datenlogger und Parkregler über einen gesicherten Zugang analysieren, neu starten oder umparametrieren. Das verkürzt
          Ausfallzeiten, weil die Ursache oft feststeht, bevor jemand zur Anlage fährt.
        </p>
        <p>
          Weil jeder Fernzugang auch ein Angriffsweg ist, gehört IT-Security dazu: Verbindungen nur von innen nach außen, Multi-Faktor-
          Authentifizierung, minimale Rechte und ein lückenloses Protokoll.
        </p>
      </Kurzantwort>

      {/* Sicherer Zugriff */}
      <Section tone="white" space="lg" id="zugriff" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Sicherer Fernzugriff"
          title="Sechs Grundsätze für jeden Zugriff auf Ihre Anlage"
          lead="Unsere Fernwartungssysteme sind gemeinsam mit der Solensa GmbH entstanden, die für Digitalisierung und IT-Security unseres „Internet of Energy“ verantwortlich ist. Die Architektur folgt dem Zonen-Conduit-Modell der IEC 62443 und den Prinzipien von Zero Trust."
          className="mb-12"
        />
        <FeatureGrid cols={3} items={ZUGRIFF} />
      </Section>

      {/* Alarmierung & Diagnose */}
      <Section tone="sand" space="lg" id="alarmierung" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="24/7-Alarmierung & Fehlerdiagnose"
            title="Nicht jeder Alarm ist eine Störung – aber jede Störung wird ein Alarm"
            lead="Die Überwachung läuft rund um die Uhr. Entscheidend ist, was danach passiert: Alarme werden klassifiziert, gebündelt und mit Messdaten angereichert, damit die richtige Person mit der richtigen Information reagiert."
          />
          <Punkte
            spalten={2}
            items={[
              { titel: "Alarmklassen", text: "Anlagenstillstand, Teilausfall, Kommunikationsverlust, Minderertrag und Schutzauslösung werden unterschiedlich priorisiert und eskaliert." },
              { titel: "Plausibilisierung", text: "Minderertrag wird gegen die gemessene Einstrahlung geprüft – ein bewölkter Tag erzeugt keinen Fehlalarm, ein ausgefallener String schon." },
              { titel: "Diagnose aus der Ferne", text: "Fehlerspeicher, Isolationswerte, String- und MPP-Daten sowie Ereignisprotokolle werden ausgelesen, bevor jemand losfährt." },
              { titel: "Parkregler im Blick", text: "Sollwerte des Netzbetreibers, Rückfallbetrieb und Abregelungen werden als eigene Ereignisse geführt – wichtig für Ertragsnachweis und Abrechnung." },
            ]}
          />
        </div>
      </Section>

      {/* Firmware & Reset */}
      <Section tone="white" space="lg" id="firmware" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
              Firmware-Management
            </p>
            <h2 className="ov-h2 mt-4 text-ink-900">Updates mit Plan statt auf Zuruf</h2>
            <p className="mt-5 text-[16.5px] leading-relaxed text-ink-600">
              Firmware schließt Sicherheitslücken und behebt Fehler – kann aber auch Einstellungen oder Kommunikationsverhalten verändern. Nach TOR
              dürfen Softwareupdates die netzrelevanten Einstellungen nicht verändern; verantwortlich dafür ist der Betreiber.
            </p>
            <ul className="mt-6 space-y-3 text-[15.5px] leading-relaxed text-ink-700">
              {[
                "Geräteinventar mit Typ, Seriennummer und Firmwarestand je Anlage",
                "Bewertung von Hersteller-Hinweisen und Sicherheitsmeldungen",
                "Test an einzelnen Geräten, danach gestaffelter Rollout",
                "Parameterauszug vor und nach dem Update, Rückfallplan",
                "Abstimmung mit dem Netzbetreiber, wenn Regelfunktionen betroffen sind",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Cpu aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ov-600" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
              Remote-Reset
            </p>
            <h2 className="ov-h2 mt-4 text-ink-900">Neustart ja – aber nicht blind</h2>
            <p className="mt-5 text-[16.5px] leading-relaxed text-ink-600">
              Viele Stillstände lassen sich mit einem kontrollierten Neustart beheben: hängende Kommunikationsmodule, Datenlogger nach Stromausfall,
              Wechselrichter nach einem Softwarefehler. Schutzauslösungen sind anders – sie haben eine Ursache, die zuerst geklärt wird.
            </p>
            <div className="mt-6">
              <Hinweis ton="achtung" titel="Was wir nicht aus der Ferne quittieren">
                <p>
                  Auslösungen des Netzentkupplungsschutzes, Isolationsfehler und Lichtbogen- oder Brandschutzmeldungen werden erst nach
                  Ursachenklärung zurückgesetzt – bei Bedarf vor Ort durch eine Elektrofachkraft.
                </p>
              </Hinweis>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Reaktionskonzept */}
      <Section tone="navy" space="lg" className="overflow-hidden" id="reaktionskonzept">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <SectionHeading
          dark
          eyebrow="Reaktionskonzept"
          title="Vom Alarm bis zum Störungsbericht"
          lead="Jede Störung durchläuft dieselben Stufen. Welche Fristen gelten, legen wir im Wartungsvertrag fest – abhängig von Anlagengröße und Bedeutung für Ihren Betrieb."
          align="center"
          className="relative mb-14"
        />
        <Steps
          tone="dark"
          cols={3}
          className="relative"
          items={[
            { icon: BellRing, title: "Erkennen", text: "Automatischer Alarm aus Wechselrichter, Datenlogger, Zähler oder Parkregler – plausibilisiert gegen Einstrahlung und Sollwerte." },
            { icon: Siren, title: "Einstufen", text: "Priorität nach Ertragsverlust, Sicherheitsrelevanz und Netzvorgaben; Eskalation nach festgelegter Kette." },
            { icon: Stethoscope, title: "Diagnose", text: "Fehlerspeicher, Messwerte und Ereignisprotokolle auswerten; Ursache und benötigte Teile festlegen." },
            { icon: RotateCcw, title: "Fern beheben", text: "Neustart, Parameterkorrektur oder Kommunikationswiederherstellung – protokolliert und bestätigt." },
            { icon: Truck, title: "Einsatz vor Ort", text: "Wenn nötig: Techniker mit Diagnose und Ersatzteil, Arbeiten nach ÖVE/ÖNORM EN 50110-1." },
            { icon: ClipboardList, title: "Bericht", text: "Ursache, Maßnahmen, Ausfallzeit und Ertragsverlust dokumentiert – für Versicherung, Bank und Ihr Controlling." },
          ]}
        />
      </Section>

      {/* IT-Security & Recht */}
      <Section tone="white" space="lg" id="it-security" className="scroll-mt-24">
        <SectionHeading
          eyebrow="IT-Security & Datenschutz"
          title="NISG 2026, IEC 62443 und DSGVO: was für Fernwartung gilt"
          lead="Am 1. Oktober 2026 tritt das NISG 2026 in Kraft. Für betroffene Einrichtungen im Energiesektor wird die Fernwartung Teil der Lieferkette, deren Sicherheit sie nachweisen müssen."
          className="mb-10"
        />
        <Tabelle
          caption="Regelwerke für sichere Fernwartung von PV-Anlagen"
          kopf={["Regelwerk", "Worum es geht", "Bedeutung für die Fernwartung"]}
          zeilen={NORMEN}
          minBreite={820}
          quelle="Stand September 2026. Ob und in welcher Rolle Ihr Unternehmen unter das NISG 2026 fällt, ist eine Rechtsfrage des Einzelfalls – keine Rechtsberatung."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Hinweis ton="norm" titel="NISG 2026: die wichtigsten Fristen">
            <p>
              Inkrafttreten am 1. Oktober 2026, ohne Übergangsfrist für die Sicherheitsmaßnahmen. Registrierung betroffener Einrichtungen binnen drei
              Monaten, also bis Jahresende 2026. Erhebliche Sicherheitsvorfälle: Frühwarnung binnen 24 Stunden, Meldung binnen 72 Stunden,
              Abschlussbericht binnen eines Monats.
            </p>
          </Hinweis>
          <Hinweis ton="info" titel="Datenschutz in der Fernwartung">
            <p>
              Reine Anlagendaten sind meist nicht personenbezogen – Benutzerkonten, Zugriffsprotokolle und Verbrauchsdaten von Mietern oder
              Mitgliedern einer Energiegemeinschaft sehr wohl. Dafür gibt es einen Auftragsverarbeitungsvertrag nach Art. 28 DSGVO, klare
              Speicherfristen und Datenminimierung.
            </p>
          </Hinweis>
        </div>
      </Section>

      {/* Ergebnis & Wartungsvertrag */}
      <Section tone="sand" space="lg" id="ergebnis" className="scroll-mt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Ergebnis für Sie"
              title="Weniger Stillstand, schnellere Behebung, saubere Nachweise"
              lead="Fernwartung ist kein Selbstzweck. Sie zahlt sich dort aus, wo jede Stunde Stillstand Ertrag kostet – und wo Bank, Versicherung oder Netzbetreiber Nachweise sehen wollen."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { icon: ScanSearch, t: "Störungen früher erkennen", x: "auch schleichende Minderleistung" },
                { icon: Wrench, t: "Weniger Anfahrten", x: "viele Fehler ohne Einsatz vor Ort lösbar" },
                { icon: ClipboardList, t: "Dokumentierte Verfügbarkeit", x: "für Reporting, Garantie und Versicherung" },
                { icon: ShieldCheck, t: "Nachvollziehbare Security", x: "für Ihre Lieferantenbewertung" },
              ].map((k) => (
                <li key={k.t} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                  <k.icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                  <span className="text-[15px] leading-snug text-ink-700">
                    <strong className="block text-ink-900">{k.t}</strong>
                    {k.x}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="rounded-3xl bg-navy-950 p-7 text-white md:p-9">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Wartungsvertrag</p>
            <h3 className="ov-h3 mt-3 text-white">Fernwartung ist Teil unseres Wartungsvertrags</h3>
            <p className="mt-4 text-[15.5px] leading-relaxed text-white/70">
              Service-Level, Reaktionszeiten, Prüfintervalle nach ESV 2012 und ÖVE/ÖNORM EN 62446-1 sowie Berichte legen wir passend zu Ihrer
              Anlage fest. Die Fernwartung ist die Basis dafür.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/service/wartung" pfeil>
                Wartungsvertrag ansehen
              </Button>
              <Button href="/technik/scada" variant="outlineLight">
                Zur Leitwarte
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Fernwartung und IT-Security – kurz beantwortet"
            lead={`Digitalisierung und IT-Security entwickeln wir gemeinsam mit der ${SOLENSA.name}.`}
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Verweise
        ueberschrift="Technik im Verbund"
        items={[
          { href: "/technik/parkregler", titel: "Parkregler (EZA-Regler)", text: "Regelung am Netzanschlusspunkt nach TOR – das wichtigste Gerät hinter der Fernwartung." },
          { href: "/technik/scada", titel: "SCADA & Leitwarte", text: "Portfolio-Übersicht, Kennzahlen und Reporting für Investoren und Banken." },
          { href: "/service/wartung", titel: "Wartung & Wartungsvertrag", text: "Service-Level nach Anlagengröße – mit Fernwartung als Grundlage." },
        ]}
      />

      <Quellen items={QUELLEN} bildnachweis="Serverraum: Carl Lender, CC BY 2.0, via Wikimedia Commons (Symbolbild)." />

      <CtaBand
        eyebrow="Fernwartung & Wartungsvertrag"
        title="Wie schnell erfahren Sie heute von einer Störung?"
        text="Wir prüfen, wie Ihre Anlagen derzeit überwacht werden, und zeigen, wie Fernwartung, Alarmierung und IT-Security in einem Wartungsvertrag zusammenkommen."
        primary={{ label: "Wartungsvertrag anfragen", href: "/service/wartung" }}
        secondary={{ label: "Termin vereinbaren", href: "/termin?art=video", icon: CalendarCheck2 }}
      />
    </div>
  );
}
