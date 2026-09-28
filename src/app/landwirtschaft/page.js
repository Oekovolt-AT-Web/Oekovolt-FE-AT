import { BatteryCharging, CalendarCheck2, ClipboardList, CloudHail, Cog, FileCheck2, HandCoins, Home, LineChart, Milk, Sprout, Tractor, Warehouse, Zap } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import { zielgruppenVariante } from "@/data/zielgruppen";

const PAGE_URL = "https://www.oekovolt.com/landwirtschaft";
const TITEL = "Photovoltaik für Landwirtschaft & Agri-PV | Ökovolt";
const BESCHREIBUNG =
  "PV auf Stall, Scheune und Maschinenhalle, Agri-PV nach DIN SPEC 91434, Speicher für Melk- und Kühltechnik: Planung, Genehmigung und Montage für landwirtschaftliche Betriebe.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: "https://www.oekovolt.com/og-image.jpg", width: 1200, height: 630 }] },
};

const FAQ = [
  {
    q: "Was ist Agri-PV und worin unterscheidet sie sich vom Solarpark?",
    a: "Bei Agri-PV bleibt die Fläche vorrangig landwirtschaftlich genutzt: Die Module stehen hoch aufgeständert über den Kulturen (Kategorie I nach DIN SPEC 91434) oder bodennah in Reihen, zwischen denen weiter bewirtschaftet wird (Kategorie II). Die Norm begrenzt den Flächenverlust durch Aufbauten und verlangt, dass ein wesentlicher Teil des landwirtschaftlichen Ertrags erhalten bleibt. Ein klassischer Solarpark nutzt die Fläche dagegen überwiegend zur Stromerzeugung.",
  },
  {
    q: "Brauche ich für Agri-PV einen Bebauungsplan?",
    a: "Nicht immer. Seit 2023 sind Agri-PV-Anlagen im Außenbereich unter bestimmten Voraussetzungen baurechtlich privilegiert – unter anderem mit begrenzter Grundfläche und im räumlich-funktionalen Zusammenhang mit einem landwirtschaftlichen Betrieb (§ 35 BauGB). Größere Anlagen brauchen in der Regel einen Bebauungsplan der Gemeinde. Wir klären das im Einzelfall frühzeitig mit Bauamt und Landratsamt.",
  },
  {
    q: "Bekomme ich für Flächen mit Agri-PV weiter Direktzahlungen?",
    a: "Flächen mit Agri-PV-Anlagen, die die Anforderungen der DIN SPEC 91434 erfüllen, können unter Voraussetzungen weiter beihilfefähig sein – in der Regel mit einem Abschlag für die durch die Anlage nicht nutzbare Fläche. Maßgeblich sind die aktuellen GAP-Regeln und Ihr Landwirtschaftsamt; klären Sie das vor Baubeginn verbindlich.",
  },
  {
    q: "Eignet sich ein altes Stall- oder Scheunendach?",
    a: "Oft ja – entscheidend sind Statik, Dachzustand und Restlaufzeit der Eindeckung. Da eine PV-Anlage 25 Jahre und länger läuft, lohnt es sich häufig, eine anstehende Dachsanierung mit der Montage zu verbinden. Alte Faserzementplatten, die Asbest enthalten können, dürfen nicht mit Modulen belegt werden; deren Sanierung übernehmen zugelassene Fachbetriebe.",
  },
  {
    q: "Wie wird Photovoltaik auf dem Hof steuerlich behandelt?",
    a: "Die Stromerzeugung zählt steuerlich in der Regel nicht zur Land- und Forstwirtschaft, sondern ist ein eigener Gewerbebetrieb – mit Folgen für Abschreibung, Umsatzsteuer und gegebenenfalls Gewerbesteuer. Kleinere Anlagen können nach § 3 Nr. 72 EStG steuerfrei sein. Stimmen Sie die passende Gestaltung mit Ihrer Steuerberatung ab.",
  },
  {
    q: "Wie groß sollte die Anlage sein?",
    a: "Für hohe Wirtschaftlichkeit richtet sich die Größe zuerst nach dem eigenen Verbrauch – Melk- und Kühltechnik, Lüftung, Trocknung, Werkstatt und Wohnhaus. Überschüsse werden eingespeist; bis 100 kW gibt es eine feste Vergütung, darüber ist Direktvermarktung Pflicht. Große Dächer lassen sich auch bewusst für die Einspeisung nutzen.",
  },
];

export default async function LandwirtschaftPage({ searchParams }) {
  const v = zielgruppenVariante("landwirtschaft", await searchParams);

  return (
    <div data-variante={v.id}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Service", name: "Photovoltaik und Agri-PV für landwirtschaftliche Betriebe", provider: { "@id": "https://www.oekovolt.com/#organization" }, areaServed: "DE", audience: { "@type": "Audience", audienceType: "Landwirtschaftliche Betriebe" }, url: PAGE_URL, description: BESCHREIBUNG },
              { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
            ],
          }),
        }}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Landwirtschaft & Agri-PV" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: "/Images/Referenzen/projekteBanner.jpg", alt: "Aufgeständerte Photovoltaikmodule auf einer Grünfläche unter blauem Himmel", position: "center 85%" }}
        actions={[
          { label: v.cta, href: "/termin?art=vor-ort" },
          { label: "Erst telefonisch sprechen", href: "/termin?art=telefon", icon: CalendarCheck2 },
        ]}
        points={["Hofdach, Agri-PV & Speicher aus einer Hand", "Wir begleiten Genehmigung & Netzanschluss", "Über 15 Jahre Erfahrung"]}
      />

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Einsatzfelder" title="Wo Photovoltaik auf dem Hof am meisten bringt" className="mb-12" />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Warehouse, title: "Stall, Scheune & Maschinenhalle", text: "Große, meist unverschattete Dächer – ideal für Eigenverbrauch und Einspeisung. Statik und Dachzustand prüfen wir vor Ort." },
            { icon: Sprout, title: "Agri-PV über Sonderkulturen", text: "Hoch aufgeständerte Anlagen über Obst, Beeren oder Wein schützen vor Hagel, Starkregen und Sonnenbrand – bei weiterer Bewirtschaftung." },
            { icon: Tractor, title: "Agri-PV auf Acker & Weide", text: "Bodennahe, vertikale oder nachgeführte Reihen mit Bewirtschaftungsgassen – abgestimmt auf Maschinenbreiten und Weidetiere." },
            { icon: Milk, title: "Melk- & Kühltechnik", text: "Melkroboter, Milchkühlung, Lüftung und Fütterung laufen täglich – der Solarstrom wird direkt im Betrieb verbraucht." },
            { icon: BatteryCharging, title: "Speicher & Notstrom", text: "Überschüsse vom Mittag für Abendmelken und Nacht nutzen; mit Notstromfunktion bleiben wichtige Verbraucher bei Netzausfall versorgt." },
            { icon: Home, title: "Hof und Wohnhaus gemeinsam", text: "Wohnhaus, Wärmepumpe, Werkstatt und Hofladen sinnvoll einbinden – mit Energiemanagement statt Insellösungen." },
          ]}
        />
      </Section>

      <Section tone="green" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Agri-PV nach DIN SPEC 91434"
            title="Zwei Kategorien – eine Voraussetzung: Die Landwirtschaft bleibt vorn."
            lead="Die DIN SPEC 91434 legt fest, wann eine Anlage als Agri-PV gilt. Sie ist Grundlage für Baurecht, Förderfähigkeit in der GAP und das eigene Segment in den EEG-Ausschreibungen – deshalb planen wir von Beginn an normgerecht."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: CloudHail, titel: "Kategorie I – hoch aufgeständert", text: "Bewirtschaftung unter den Modulen, z. B. Obst, Beeren, Gemüse. Die Module ersetzen teilweise Hagelnetz oder Folientunnel." },
              { icon: Tractor, titel: "Kategorie II – bodennah", text: "Bewirtschaftung zwischen den Modulreihen, z. B. Ackerbau oder Grünland. Vertikale Ost-West-Module erzeugen morgens und abends." },
            ].map((k) => (
              <div key={k.titel} className="rounded-2xl border border-ov-100 bg-white p-6">
                <k.icon aria-hidden="true" className="h-6 w-6 text-ov-600" />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{k.titel}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{k.text}</p>
              </div>
            ))}
            <p className="text-sm leading-relaxed text-ink-600 sm:col-span-2">
              Anforderungen an Flächenverlust und landwirtschaftlichen Ertrag, Baurecht (§ 35 BauGB) und Direktzahlungen hängen vom Einzelfall ab. Wir prüfen sie gemeinsam mit Ihnen, Ihrer Gemeinde und dem Landwirtschaftsamt – keine Rechts- oder Steuerberatung.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Vorgehen" title="Vom Hofbesuch zur laufenden Anlage" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: ClipboardList, title: "Hofbesuch & Potenzial", text: "Dächer, Flächen, Verbrauch und Netzanschluss aufnehmen – mit erster Ertrags- und Eigenverbrauchsschätzung." },
            { icon: HandCoins, title: "Wirtschaftlichkeit & Steuern", text: "Eigenverbrauch, Einspeisung oder Direktvermarktung, Speicher und Finanzierung transparent verglichen – als Grundlage für Ihre Steuerberatung." },
            { icon: FileCheck2, title: "Genehmigung & Netz", text: "Statik, Baurecht, Netzverträglichkeit und Anmeldung – abgestimmt mit Gemeinde, Landratsamt und Netzbetreiber." },
            { icon: LineChart, title: "Montage & Monitoring", text: "Montage mit Rücksicht auf Erntezeiten und Stallbetrieb, danach laufende Überwachung und Service." },
          ]}
        />
      </Section>

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Vorbereitung" title="Diese Unterlagen beschleunigen die Planung" className="mb-8" />
        <ul className="grid gap-3 text-[15.5px] text-ink-700 md:grid-cols-2">
          {[
            "Stromrechnungen der letzten 12 Monate (Betrieb und Wohnhaus)",
            "Fotos oder Pläne der Dächer, Baujahr und Art der Eindeckung",
            "Lage des Hausanschlusses bzw. der Trafostation",
            "Flurstücke und aktuelle Nutzung bei Agri-PV-Flächen",
            "Geplante Verbraucher: Melkroboter, Wärmepumpe, E-Hoflader, Trocknung",
            "Bestehende PV-Anlagen und deren Inbetriebnahmejahr",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <Zap aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
              {t}
            </li>
          ))}
        </ul>
      </Section>

      <Querverweise pfad="/landwirtschaft" ueberschrift="Passende Themen für Ihren Betrieb" />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen vor der Planung" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        title="Wir kommen auf Ihren Hof."
        text="Kostenlose Erstbewertung vor Ort oder per Video – mit ersten Zahlen zu Dach, Fläche, Eigenverbrauch und Wirtschaftlichkeit."
        primary={{ label: v.cta, href: "/termin?art=vor-ort" }}
        secondary={{ label: "Anlage konfigurieren", href: "/angebot", icon: Cog }}
      />
    </div>
  );
}
