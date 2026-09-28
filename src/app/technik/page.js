import { CalendarCheck2, Clock, Cpu, Handshake, MonitorDot, ShieldCheck, SlidersHorizontal, Unlock, Wrench } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Systemverbund from "@/components/Technik/Systemverbund";
import { Kurzantwort, Quellen, Tabelle, Verweise } from "@/components/Technik/Bausteine";
import { JsonLd, seitenMeta, seitenSchema } from "@/components/Technik/seite";
import { SOLENSA } from "@/lib/site";

const PFAD = "/technik";
const TITEL = "Eigene PV-Technik: Parkregler, SCADA, Fernwartung | Ökovolt";
const BESCHREIBUNG =
  "Ökovolt entwickelt eigene Technik für Österreich: Parkregler (EZA-Regler) nach TOR Erzeuger, SCADA-Leitwarte und sichere Fernwartung mit Solensa.";

export const metadata = seitenMeta({
  pfad: PFAD,
  titel: TITEL,
  beschreibung: BESCHREIBUNG,
  bild: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg",
  keywords: ["Parkregler Österreich", "EZA-Regler", "SCADA Photovoltaik", "Fernwartung PV", "Internet of Energy", "TOR Erzeuger"],
});

const FAQ = [
  {
    q: "Warum entwickelt ein PV-Errichter eigene Regelungs- und Leittechnik?",
    a: "Weil Netzanschluss, Einspeiselimits und Direktvermarktung heute über die Wirtschaftlichkeit einer Anlage mitentscheiden – und weil herstellergebundene Lösungen bei gemischten Anlagen, Erweiterungen und neuen Vorgaben der Netzbetreiber an Grenzen stoßen. Mit eigenem Parkregler, eigener Leitwarte und eigener Fernwartung können wir Anlagen herstellerunabhängig regeln, schnell an neue Vorgaben anpassen und Sicherheit aus einer Hand verantworten.",
  },
  {
    q: "Funktioniert die Ökovolt-Technik mit Wechselrichtern verschiedener Hersteller?",
    a: "Ja, Herstellerunabhängigkeit ist ein Grundprinzip. Wechselrichter, Speicher und Ladepunkte werden über offene Schnittstellen wie Modbus TCP, SunSpec-Informationsmodelle oder OCPP bzw. über dokumentierte Herstellerprotokolle angebunden. Die Funktion wird bei jeder Inbetriebnahme mit Sollwertsprüngen nachgewiesen.",
  },
  {
    q: "Für welche Anlagen ist das relevant?",
    a: "Vor allem für Gewerbe- und Industrieanlagen, Freiflächen- und Agri-PV-Anlagen, Anlagen von Gemeinden und Stadtwerken sowie für alle Anlagen mit Speicher, Ladeinfrastruktur, Einspeiselimit oder Direktvermarktung. Ab Typ B (250 kW Maximalkapazität) verlangen die TOR Erzeuger ausdrücklich Wirkleistungsvorgaben durch den Netzbetreiber und ein vorgegebenes Blindleistungsverfahren am Netzanschlusspunkt.",
  },
  {
    q: "Welche Rolle spielt die Solensa GmbH?",
    a: "Die Solensa GmbH ist unsere Partnerin für Digitalisierung und IT-Security. Gemeinsam bauen wir das „Internet of Energy“: die sichere Vernetzung von Anlagen, Regelung, Leitwarte und Fernwartung. Solensa verantwortet dabei insbesondere die IT-Architektur und Security-Konzepte.",
  },
  {
    q: "Kann ich bestehende Anlagen einbinden?",
    a: "Meist ja. Bestandsanlagen lassen sich an Leitwarte und Fernwartung anbinden und mit einem Parkregler nachrüsten, wenn Wechselrichter kommunikationsfähig sind und am Netzanschlusspunkt gemessen werden kann. Wir beginnen mit einer Bestandsaufnahme von Geräten, Messung und Netzvorgaben.",
  },
];

const VERGLEICH = [
  ["Mehrere Wechselrichter-Hersteller in einer Anlage", "Ein Regelkreis über alle Geräte", "Oft nur innerhalb einer Marke vollständig"],
  ["Neue Vorgabe des Netzbetreibers", "Parametrierung und Test durch uns, abgestimmt mit dem Netzbetreiber", "Abhängig von Update-Zyklen des Herstellers"],
  ["Speicher und Ladepunkte nachrüsten", "Einbindung in denselben Regler am Netzanschlusspunkt", "Häufig Insellösungen mit eigener Logik"],
  ["Security-Verantwortung", "Eine Architektur, ein Zugriffskonzept, ein Protokoll", "Mehrere Herstellerportale mit eigenen Zugängen"],
  ["Daten für Bank und Controlling", "Einheitliche Kennzahlen über das ganze Portfolio", "Unterschiedliche Definitionen je Portal"],
];

export default function TechnikPage() {
  return (
    <div>
      <JsonLd
        daten={seitenSchema({
          pfad: PFAD,
          name: "Eigene Technik von Ökovolt: Parkregler, SCADA und Fernwartung",
          beschreibung: BESCHREIBUNG,
          service: {
            name: "Regelungs-, Leit- und Fernwartungstechnik für Photovoltaikanlagen",
            serviceType: "Parkregler, SCADA und Fernwartung",
            audience: "Gewerbe, Industrie, Landwirtschaft, öffentliche Hand, Asset Manager",
          },
        })}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Technik" }]}
        eyebrow="Eigene Technik · entwickelt für Österreich"
        title={
          <>
            Regelung, Leitwarte, Fernwartung – <span className="ov-text-gradient-light">aus eigener Entwicklung</span>
          </>
        }
        lead="Wir bauen nicht nur PV-Anlagen, wir betreiben sie auch – die Gründer seit 2012 eigene Solarparks. Deshalb haben wir eigene Parkregler, SCADA- und Fernwartungssysteme entwickelt, gemeinsam mit der Solensa GmbH als Partnerin für Digitalisierung und IT-Security."
        image={{ src: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", alt: "Luftaufnahme: zwei Techniker mit Plänen zwischen PV-Modulreihen auf einem Hallendach" }}
        actions={[
          { label: "Technik kennenlernen", href: "/termin?art=video" },
          { label: "Zum Parkregler", href: "/technik/parkregler", icon: SlidersHorizontal },
        ]}
        points={["Parkregler nach TOR Erzeuger", "SCADA & Leitwarte", "Sichere Fernwartung", "Herstellerunabhängig"]}
      />

      <Kurzantwort frage="Was gehört zur eigenen Technik von Ökovolt?">
        <p>
          Drei Systeme, die zusammenarbeiten: der <strong>Parkregler</strong> (EZA-Regler) regelt die Anlage am Netzanschlusspunkt nach den
          Vorgaben des Netzbetreibers, die <strong>SCADA-Leitwarte</strong> überwacht Anlagen und Portfolios mit Kennzahlen und Alarmen, und die{" "}
          <strong>Fernwartung</strong> erlaubt gesicherte Eingriffe aus der Ferne. Alle drei sind herstellerunabhängig und für den
          österreichischen Netzanschluss nach TOR Erzeuger ausgelegt.
        </p>
      </Kurzantwort>

      <Section tone="white" space="lg" id="systemverbund" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Systemverbund"
          title="Von der Leitwarte bis zum Netzanschlusspunkt"
          lead="PV-Generator, Wechselrichter, Speicher und Ladepunkte liefern Energie; der Parkregler sorgt dafür, dass am Netzanschlusspunkt ankommt, was Netzbetreiber und Vertrag erlauben; Leitwarte und Fernwartung halten alles im Blick."
          className="mb-10"
        />
        <Systemverbund />
      </Section>

      <Section tone="sand" space="lg" id="systeme" className="scroll-mt-24">
        <SectionHeading eyebrow="Unsere Systeme" title="Drei Bausteine, eine Verantwortung" align="center" className="mb-12" />
        <FeatureGrid
          cols={3}
          items={[
            {
              icon: SlidersHorizontal,
              title: "Parkregler (EZA-Regler)",
              text: "Wirkleistung, Blindleistung nach Q(U) oder cos φ, Einspeiselimit und Fernabschaltung am Netzanschlusspunkt – nach TOR Stromerzeugungsanlagen Typ A bis D.",
              href: "/technik/parkregler",
            },
            {
              icon: MonitorDot,
              title: "SCADA & Leitwarte",
              text: "Portfolio-Übersicht, Performance Ratio und Verfügbarkeit nach IEC 61724, Alarmmanagement, Berichte für Banken und ESG, Schnittstellen.",
              href: "/technik/scada",
            },
            {
              icon: ShieldCheck,
              title: "Fernwartung & IT-Security",
              text: "Verschlüsselte Zugriffe mit MFA und Protokoll, 24/7-Alarmierung, Firmware-Management – mit Blick auf NISG 2026 und IEC 62443.",
              href: "/technik/fernwartung",
            },
          ]}
        />
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden" id="warum">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <SectionHeading
          dark
          eyebrow="Warum eigene Technik"
          title="Unabhängig, schnell, sicher – und aus dem eigenen Betrieb gelernt"
          lead="Wer eigene Solarparks betreibt, merkt schnell, wo Standardlösungen haken: bei gemischten Wechselrichterflotten, bei neuen Netzvorgaben, bei Störungen am Wochenende."
          className="relative mb-12"
        />
        <FeatureGrid
          cols={4}
          tone="dark"
          className="relative"
          items={[
            { icon: Unlock, title: "Unabhängigkeit", text: "Keine Bindung an eine Wechselrichtermarke. Geräte lassen sich tauschen, ohne die Regelung neu zu erfinden." },
            { icon: Clock, title: "Tempo", text: "Neue Vorgaben von Netzbetreiber oder Direktvermarkter setzen wir selbst um – ohne auf Dritte zu warten." },
            { icon: ShieldCheck, title: "Security", text: "Ein Zugriffskonzept für Regler, Leitwarte und Wartung – mit Solensa als Partnerin für IT-Security." },
            { icon: Wrench, title: "Betriebserfahrung", text: "Wir bauen, was wir selbst betreiben würden: Anforderungen aus dem eigenen Anlagenbetrieb fließen direkt ein." },
          ]}
        />
      </Section>

      <Section tone="white" space="lg" id="vergleich" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Einordnung"
          title="Eigene Systemtechnik oder Herstellerportal?"
          lead="Herstellerlösungen sind für einfache Anlagen oft völlig ausreichend. Sobald mehrere Marken, Speicher, Ladepunkte, Einspeiselimits oder Portfolios im Spiel sind, zeigt sich der Unterschied."
          className="mb-10"
        />
        <Tabelle caption="Typische Unterschiede in der Praxis" kopf={["Situation", "Ökovolt-Systemverbund", "Reine Herstellerlösung"]} zeilen={VERGLEICH} hervor={1} minBreite={720} />
      </Section>

      <Section tone="sand" space="lg" id="solensa" className="scroll-mt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <SectionHeading
            eyebrow="Internet of Energy"
            title="Digitalisierung und IT-Security gemeinsam mit Solensa"
            lead={`Die ${SOLENSA.name} ist unsere Partnerin für Digitalisierung und IT-Security. Gemeinsam vernetzen wir Anlagen, Regelung, Leitwarte und Fernwartung zu einem „Internet of Energy“ – mit einer Architektur, bei der Sicherheit von Anfang an mitgeplant ist.`}
          />
          <Reveal className="grid gap-3">
            {[
              { icon: Cpu, t: "Regelung in der Anlage", x: "Parkregler und Gateways arbeiten auch ohne Internetverbindung sicher weiter." },
              { icon: Handshake, t: "Klare Rollen", x: "Ökovolt verantwortet Elektrotechnik, Regelung und Betrieb, Solensa Digitalisierung und IT-Security." },
              { icon: ShieldCheck, t: "Security by Design", x: "Zonen, verschlüsselte Verbindungen, Multi-Faktor-Authentifizierung und Protokollierung als Grundausstattung." },
            ].map((k) => (
              <div key={k.t} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                <k.icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                <span className="text-[15px] leading-snug text-ink-700">
                  <strong className="block text-ink-900">{k.t}</strong>
                  {k.x}
                </span>
              </div>
            ))}
            <a
              href={SOLENSA.web}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current"
            >
              Zur Website der {SOLENSA.name}
            </a>
          </Reveal>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Eigene Technik – kurz beantwortet"
            lead="Detailfragen zu Regelung, Schnittstellen oder Security beantworten wir gern im Fachgespräch mit Ihrer Technik oder Ihrem Planer."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Verweise
        ueberschrift="Komponenten im Systemverbund"
        items={[
          { href: "/produkte/photovoltaikanlage", titel: "Photovoltaikanlage", text: "Module, Wechselrichter und Unterkonstruktion für Dach, Freifläche und Agri-PV." },
          { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Gewerbespeicher für Eigenverbrauch, Peak Shaving und Notstrom – im selben Regelkreis." },
          { href: "/produkte/wallbox", titel: "Ladeinfrastruktur", text: "Ladepunkte mit Lastmanagement, abgestimmt auf Netzanschluss und PV-Überschuss." },
          { href: "/produkte/smartmeter", titel: "Smart Meter & Energiemanagement", text: "Messung und Steuerung als Grundlage für Tarife, Energiegemeinschaften und Regelung." },
        ]}
      />

      <Quellen
        items={[
          { titel: "E-Control: TOR Stromerzeugungsanlagen Typ A, V1.4", href: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+(7).pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735" },
          { titel: "E-Control: TOR Stromerzeugungsanlagen Typ B, V1.3", href: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128" },
          { titel: "IEC 61724-1:2021", hinweis: "Monitoring der Leistungsfähigkeit von PV-Systemen" },
          { titel: "WKO: NISG 2026 – Übersicht", href: "https://www.wko.at/it-sicherheit/nis2-uebersicht" },
        ]}
      />

      <CtaBand
        eyebrow="Technik, die mitdenkt"
        title="Sprechen Sie mit unserer Technik – nicht mit einem Prospekt."
        text="Wir zeigen Ihnen Parkregler, Leitwarte und Fernwartung an echten Beispielen und klären, was Ihre Anlage oder Ihr Portfolio am Netzanschlusspunkt braucht."
        primary={{ label: "Fachgespräch vereinbaren", href: "/termin?art=video" }}
        secondary={{ label: "Anfrage senden", href: "/kontakt", icon: CalendarCheck2 }}
      />
    </div>
  );
}
