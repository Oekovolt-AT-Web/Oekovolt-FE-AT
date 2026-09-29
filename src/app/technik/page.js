import { CalendarCheck2, Check, Clock, Cpu, Handshake, Minus, ShieldCheck, SlidersHorizontal, Unlock, Wrench } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import SystemverbundLive from "@/components/Technik/SystemverbundLive";
import { Verweise } from "@/components/Technik/Bausteine";
import QuellenKompakt from "@/components/ServiceAT/A/QuellenKompakt";
import { JsonLd, seitenMeta, seitenSchema } from "@/components/Technik/seite";
import AntwortBand from "@/components/ServiceAT/A/AntwortBand";
import FotoBento from "@/components/ServiceAT/A/FotoBento";
import { SOLENSA } from "@/lib/site";

const PFAD = "/technik";
const TITEL = "Eigene PV-Technik: Parkregler, SCADA, Fernwartung | Ökovolt";
const BESCHREIBUNG =
  "Ökovolt entwickelt eigene Technik für Österreich: Parkregler (EZA-Regler) nach TOR Erzeuger, SCADA-Leitwarte und sichere Fernwartung mit Solensa.";

const BILD = {
  hero: "/Images/AT/technik-service/umspannwerk-nacht.jpg",
  parkregler: "/Images/AT/technik-service/trafostation-solarpark.jpg",
  scada: "/Images/AT/technik-service/leitwarte-monitoring.jpg",
  fernwartung: "/Images/AT/technik-service/netzwerk-sicherheit.jpg",
  solensa: "/Images/AT/technik-service/solarpark-luftbild.jpg",
};

export const metadata = seitenMeta({
  pfad: PFAD,
  titel: TITEL,
  beschreibung: BESCHREIBUNG,
  bild: BILD.hero,
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

const WARUM = [
  { icon: Unlock, title: "Unabhängigkeit", text: "Keine Bindung an eine Wechselrichtermarke. Geräte lassen sich tauschen, ohne die Regelung neu zu erfinden." },
  { icon: Clock, title: "Tempo", text: "Neue Vorgaben von Netzbetreiber oder Direktvermarkter setzen wir selbst um – ohne auf Dritte zu warten." },
  { icon: ShieldCheck, title: "Security", text: "Ein Zugriffskonzept für Regler, Leitwarte und Wartung – mit Solensa als Partnerin für IT-Security." },
  { icon: Wrench, title: "Betriebserfahrung", text: "Wir bauen, was wir selbst betreiben würden: Anforderungen aus dem eigenen Anlagenbetrieb fließen direkt ein." },
];

export default function TechnikPage() {
  return (
    <div className="bg-navy-950">
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
        image={{ src: BILD.hero, alt: "Umspannwerk mit Hochspannungsleitungen zur blauen Stunde", position: "70% 60%" }}
        actions={[
          { label: "Technik kennenlernen", href: "/termin?art=video" },
          { label: "Zum Parkregler", href: "/technik/parkregler", icon: SlidersHorizontal },
        ]}
        points={["Parkregler nach TOR Erzeuger", "SCADA & Leitwarte", "Sichere Fernwartung", "Herstellerunabhängig"]}
      />

      <AntwortBand
        dunkel
        frage="Was gehört zur eigenen Technik von Ökovolt?"
        zahlen={[
          { value: 3, label: "eigene Systeme", text: "Parkregler, SCADA-Leitwarte, Fernwartung" },
          { value: "A–D", label: "TOR-Anlagentypen", text: "Regelung nach TOR Stromerzeugungsanlagen" },
          { value: "2012", label: "eigene Solarparks seit", text: "Die Gründer betreiben selbst" },
          { value: 30, suffix: " MWp", label: "errichtet im Jahr 2021", text: "Ökovolt Solartechnik GmbH, Österreich" },
        ]}
      >
        <p>
          Drei Systeme, die zusammenarbeiten: der <strong>Parkregler</strong> (EZA-Regler) regelt die Anlage am Netzanschlusspunkt nach den Vorgaben des
          Netzbetreibers, die <strong>SCADA-Leitwarte</strong> überwacht Anlagen und Portfolios mit Kennzahlen und Alarmen, und die <strong>Fernwartung</strong>{" "}
          erlaubt gesicherte Eingriffe aus der Ferne. Alle drei sind herstellerunabhängig und für den österreichischen Netzanschluss nach TOR Erzeuger ausgelegt.
        </p>
      </AntwortBand>

      {/* Systemverbund – animiertes Schaltbild */}
      <section id="systemverbund" className="ov-noise relative scroll-mt-24 overflow-hidden border-t border-white/10 bg-navy-950 py-20 text-white md:py-24">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-40 h-[560px] w-[560px] rounded-full bg-ov-500/15 blur-[140px]" />
        <div aria-hidden="true" className="absolute -left-40 bottom-0 h-[460px] w-[460px] rounded-full bg-navy-400/20 blur-[130px]" />
        <div className="ov-container relative">
          <SectionHeading
            dark
            eyebrow="Systemverbund"
            title="Von der Leitwarte bis zum Netzanschlusspunkt"
            lead="PV-Generator, Wechselrichter, Speicher und Ladepunkte liefern Energie; der Parkregler sorgt dafür, dass am Netzanschlusspunkt ankommt, was Netzbetreiber und Vertrag erlauben; Leitwarte und Fernwartung halten alles im Blick."
            className="mb-12"
          />
          <SystemverbundLive />
        </div>
      </section>

      {/* Drei Systeme als Foto-Bento */}
      <Section tone="white" space="md" id="systeme" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Unsere Systeme"
          title="Drei Bausteine, eine Verantwortung"
          lead="Jeder Baustein funktioniert für sich – seine Stärke entfaltet er im Verbund mit den anderen beiden."
          className="mb-12"
        />
        <FotoBento
          zeile={260}
          items={[
            {
              form: "gross",
              bild: BILD.parkregler,
              alt: "Transformatorstation und Zentralwechselrichter in einem Solarpark bei Sonnenaufgang",
              tag: "Regelebene",
              titel: "Parkregler (EZA-Regler)",
              text: "Wirkleistung, Blindleistung nach Q(U) oder cos φ, Einspeiselimit und Fernabschaltung am Netzanschlusspunkt – nach TOR Stromerzeugungsanlagen Typ A bis D.",
              href: "/technik/parkregler",
            },
            {
              bild: BILD.scada,
              alt: "Symbolbild: Leitstand mit Monitorwand und Bedienpult",
              tag: "Leitebene",
              titel: "SCADA & Leitwarte",
              text: "Performance Ratio und Verfügbarkeit nach IEC 61724, Alarme, Berichte für Banken und ESG.",
              href: "/technik/scada",
            },
            {
              bild: BILD.fernwartung,
              alt: "Netzwerkstecker vor dunkelblauem Hintergrund – Symbol für gesicherte Datenverbindungen",
              tag: "Zugriff & Security",
              titel: "Fernwartung & IT-Security",
              text: "Verschlüsselte Zugriffe mit MFA und Protokoll, 24/7-Alarmierung, Firmware-Management – mit Blick auf NISG 2026 und IEC 62443.",
              href: "/technik/fernwartung",
            },
          ]}
        />
      </Section>

      {/* Warum eigene Technik */}
      <Section tone="sand" space="md" id="warum">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <SectionHeading
            eyebrow="Warum eigene Technik"
            title="Unabhängig, schnell, sicher – und aus dem eigenen Betrieb gelernt"
            lead="Wer eigene Solarparks betreibt, merkt schnell, wo Standardlösungen haken: bei gemischten Wechselrichterflotten, bei neuen Netzvorgaben, bei Störungen am Wochenende."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {WARUM.map((w, i) => (
              <Reveal as="li" key={w.title} delay={i * 70} className="ov-card-hover rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-950 text-ov-300">
                  <w.icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-bold text-ink-900">{w.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{w.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Vergleich */}
      <section id="vergleich" className="relative scroll-mt-24 overflow-hidden bg-navy-950 py-20 text-white md:py-24">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="ov-container relative">
          <SectionHeading
            dark
            eyebrow="Einordnung"
            title="Eigene Systemtechnik oder Herstellerportal?"
            lead="Herstellerlösungen sind für einfache Anlagen oft völlig ausreichend. Sobald mehrere Marken, Speicher, Ladepunkte, Einspeiselimits oder Portfolios im Spiel sind, zeigt sich der Unterschied."
            className="mb-12"
          />
          <Reveal as="figure" className="overflow-hidden rounded-[2rem] ring-1 ring-white/12">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Typische Unterschiede in der Praxis: Ökovolt-Systemverbund und reine Herstellerlösung</caption>
              <thead className="hidden md:table-header-group">
                <tr>
                  <th scope="col" className="w-[30%] bg-white/[0.03] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/50">Situation</th>
                  <th scope="col" className="w-[35%] bg-ov-600 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-white">Ökovolt-Systemverbund</th>
                  <th scope="col" className="w-[35%] bg-white/[0.03] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/50">Reine Herstellerlösung</th>
                </tr>
              </thead>
              <tbody>
                {VERGLEICH.map(([s, o, h]) => (
                  <tr key={s} className="grid border-t border-white/10 md:table-row">
                    <th scope="row" className="px-5 pb-1 pt-5 font-display text-[16px] font-bold leading-snug text-white md:px-6 md:py-5">
                      {s}
                    </th>
                    <td className="px-5 py-1.5 md:bg-ov-500/10 md:px-6 md:py-5">
                      <span className="flex gap-2.5 text-[15px] leading-snug text-white/90">
                        <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" strokeWidth={3} />
                        <span>
                          <span className="sr-only md:hidden">Ökovolt-Systemverbund: </span>
                          {o}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 pb-5 pt-1.5 md:px-6 md:py-5">
                      <span className="flex gap-2.5 text-[15px] leading-snug text-white/55">
                        <Minus aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white/35" strokeWidth={3} />
                        <span>
                          <span className="sr-only md:hidden">Reine Herstellerlösung: </span>
                          {h}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* Solensa */}
      <Section tone="white" space="md" id="solensa" className="scroll-mt-24">
        <SplitMedia
          eyebrow="Internet of Energy"
          title="Digitalisierung und IT-Security gemeinsam mit Solensa"
          text={`Die ${SOLENSA.name} ist unsere Partnerin für Digitalisierung und IT-Security. Gemeinsam vernetzen wir Anlagen, Regelung, Leitwarte und Fernwartung zu einem „Internet of Energy“ – mit einer Architektur, bei der Sicherheit von Anfang an mitgeplant ist.`}
          image={{ src: BILD.solensa, alt: "Senkrechte Drohnenaufnahme eines großen Solarparks mit Modulreihen und Wechselrichterstationen" }}
          points={[
            { title: "Regelung in der Anlage", text: "Parkregler und Gateways arbeiten auch ohne Internetverbindung sicher weiter." },
            { title: "Klare Rollen", text: "Ökovolt verantwortet Elektrotechnik, Regelung und Betrieb, Solensa Digitalisierung und IT-Security." },
            { title: "Security by Design", text: "Zonen, verschlüsselte Verbindungen, Multi-Faktor-Authentifizierung und Protokollierung als Grundausstattung." },
          ]}
        >
          <a
            href={SOLENSA.web}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current"
          >
            <Handshake aria-hidden="true" className="h-4 w-4" />
            Zur Website der {SOLENSA.name}
          </a>
        </SplitMedia>
      </Section>

      {/* FAQ dunkel */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white md:py-24">
        <div aria-hidden="true" className="absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-ov-500/15 blur-[130px]" />
        <div className="ov-container relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            dark
            eyebrow="Häufige Fragen"
            title="Eigene Technik – kurz beantwortet"
            lead="Detailfragen zu Regelung, Schnittstellen oder Security beantworten wir gern im Fachgespräch mit Ihrer Technik oder Ihrem Planer."
          >
            <p className="mt-8 flex items-center gap-3 text-[14px] text-white/55">
              <Cpu aria-hidden="true" className="h-5 w-5 text-ov-300" />
              Parkregler · SCADA · Fernwartung – ein Ansprechpartner
            </p>
          </SectionHeading>
          <Faq items={FAQ} tone="dark" />
        </div>
      </section>

      <div className="bg-white">
        <Verweise
          ueberschrift="Komponenten im Systemverbund"
          items={[
            { href: "/produkte/photovoltaikanlage", titel: "Photovoltaikanlage", text: "Module, Wechselrichter und Unterkonstruktion für Dach, Freifläche und Agri-PV." },
            { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Gewerbespeicher für Eigenverbrauch, Peak Shaving und Notstrom – im selben Regelkreis." },
            { href: "/produkte/wallbox", titel: "Ladeinfrastruktur", text: "Ladepunkte mit Lastmanagement, abgestimmt auf Netzanschluss und PV-Überschuss." },
            { href: "/produkte/smartmeter", titel: "Smart Meter & Energiemanagement", text: "Messung und Steuerung als Grundlage für Tarife, Energiegemeinschaften und Regelung." },
          ]}
        />

        <QuellenKompakt
          items={[
            { titel: "E-Control: TOR Stromerzeugungsanlagen Typ A, V1.4", href: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+(7).pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735" },
            { titel: "E-Control: TOR Stromerzeugungsanlagen Typ B, V1.3", href: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128" },
            { titel: "IEC 61724-1:2021", hinweis: "Monitoring der Leistungsfähigkeit von PV-Systemen" },
            { titel: "WKO: NISG 2026 – Übersicht", href: "https://www.wko.at/it-sicherheit/nis2-uebersicht" },
          ]}
          bildnachweis="Umspannwerk zur blauen Stunde: Patrick Finnegan, CC BY 2.0 · Solarpark mit Trafostation: Ken Oltmann/CoServ, U.S. Department of Energy, gemeinfrei · Leitstand (Symbolbild): Larry D. Moore, CC BY 4.0 · Netzwerkstecker: Yuri Samoilov, CC BY 2.0 · Solarpark-Luftbild: Md shameem ul islam, CC BY 4.0 – alle via Wikimedia Commons."
        />

        <CtaBand
          eyebrow="Technik, die mitdenkt"
          title="Sprechen Sie mit unserer Technik – nicht mit einem Prospekt."
          text="Wir zeigen Ihnen Parkregler, Leitwarte und Fernwartung an echten Beispielen und klären, was Ihre Anlage oder Ihr Portfolio am Netzanschlusspunkt braucht."
          primary={{ label: "Fachgespräch vereinbaren", href: "/termin?art=video" }}
          secondary={{ label: "Anfrage senden", href: "/kontakt", icon: CalendarCheck2 }}
        />
      </div>
    </div>
  );
}
