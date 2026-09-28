// service/stromtarif/page.js – Dynamische Stromtarife in Österreich (Gewerbe-Fokus)
//
// Österreich-Fassung: statischer, belegter Inhalt (ElWG § 22, Smart Meter,
// Preisbestandteile AT). Keine Anbieterwerbung – für den Marktüberblick wird
// neutral auf den Tarifkalkulator der E-Control verwiesen.

import {
  Activity,
  BatteryCharging,
  Calculator,
  CalendarCheck2,
  Car,
  Check,
  Factory,
  Gauge,
  PiggyBank,
  Plug,
  ShieldAlert,
  Snowflake,
  ThermometerSun,
  X,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import BoersenpreisChart from "@/components/Stromtarif/BoersenpreisChart";
import LivePreisBadge from "@/components/Stromtarif/LivePreisBadge";
import { Hinweis, Kurzantwort, Punkte, Quellen, Tabelle, Verweise } from "@/components/Technik/Bausteine";
import { JsonLd, seitenMeta, seitenSchema } from "@/components/Technik/seite";
import { getEnergySnapshot } from "@/lib/energy";

export const revalidate = 900;

const PFAD = "/service/stromtarif";
const TITEL = "Dynamischer Stromtarif Österreich (Spot AT) | Ökovolt";
const BESCHREIBUNG =
  "Dynamische Stromtarife in Österreich: Spotpreis AT, Pflicht nach § 22 ElWG, Smart Meter, Preisbestandteile und Lastverschiebung für Gewerbe mit PV und Speicher.";

export const metadata = seitenMeta({
  pfad: PFAD,
  titel: TITEL,
  beschreibung: BESCHREIBUNG,
  bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg",
  keywords: ["dynamischer Stromtarif Österreich", "Spotpreis Strom Österreich", "Floater Stromtarif Gewerbe", "EPEX Day-Ahead AT", "Smart Meter Viertelstundenwerte", "Lastverschiebung Gewerbe"],
});

const BESTANDTEILE = [
  ["Energiepreis", "Ja – Börsenpreis je Stunde oder Viertelstunde plus Aufschlag des Lieferanten", "Nur dieser Teil folgt dem Spotpreis der Gebotszone AT"],
  ["Grundpauschale des Lieferanten", "Nein", "Fixer Betrag pro Monat oder Jahr – bei kleinem Verbrauch spürbar"],
  ["Netznutzungsentgelt", "Nein (derzeit)", "Arbeitspreis je kWh; bei Leistungsmessung zusätzlich Leistungspreis. Das ElWG schafft die Grundlage für zeitvariable Netzentgelte"],
  ["Netzverlust- und Messentgelt", "Nein", "Vom Netzbetreiber verrechnet, je Netzgebiet unterschiedlich"],
  ["Erneuerbaren-Förderpauschale und -beitrag", "Nein", "2026 wieder eingehoben; Höhe per Verordnung"],
  ["Elektrizitätsabgabe", "Nein", "2026 für Haushalte befristet auf 0,1 ct/kWh gesenkt; für Unternehmen gelten eigene Regeln"],
  ["Gebrauchsabgabe", "Nein", "Je nach Bundesland bzw. Gemeinde"],
  ["Umsatzsteuer", "–", "20 %; für vorsteuerabzugsberechtigte Betriebe kein Kostenfaktor"],
];

const FAQ = [
  {
    q: "Was ist ein dynamischer Stromtarif?",
    a: "Bei einem dynamischen Stromtarif folgt der Energiepreis dem Day-Ahead-Börsenpreis – abgerechnet je Stunde oder Viertelstunde. Das ElWG definiert ihn als Liefervertrag, der die Preise an den Spotmärkten, mindestens am Day-Ahead-Markt, in Intervallen widerspiegelt, die den Abrechnungsintervallen dieses Markts entsprechen. Netzentgelte, Abgaben und Steuern bleiben unabhängig davon.",
  },
  {
    q: "Muss jeder Lieferant in Österreich einen dynamischen Tarif anbieten?",
    a: "Nach § 22 ElWG müssen Lieferanten mit mehr als 25.000 Zählpunkten seit 1. April 2026 Verträge mit dynamischen Energiepreisen anbieten; dazu kommen erweiterte Informationspflichten. Kleinere Lieferanten können, müssen aber nicht. Welche dynamischen Produkte es für Ihre Postleitzahl gibt, zeigt der Tarifkalkulator der E-Control.",
  },
  {
    q: "Welcher Börsenpreis gilt in Österreich?",
    a: "Maßgeblich ist der Day-Ahead-Preis der Gebotszone Österreich (AT), die seit 1. Oktober 2018 von Deutschland getrennt ist. Seit 1. Oktober 2025 wird der europäisch gekoppelte Day-Ahead-Markt in Viertelstunden gehandelt. Neben der EPEX SPOT führt in Österreich auch die EXAA eine eigene Day-Ahead-Auktion durch; welche Preisquelle gilt, steht im Tarifvertrag.",
  },
  {
    q: "Brauche ich dafür ein Smart Meter?",
    a: "Ja. Für die zeitgenaue Abrechnung müssen Viertelstundenwerte gemessen und übermittelt werden. Laut E-Control stehen Viertelstundenwerte ab 1. Jänner 2027 ab 1.500 kWh Jahresverbrauch zur Verfügung, darunter per Opt-in. Betriebe mit Lastprofilzähler haben die Viertelstundenwerte ohnehin.",
  },
  {
    q: "Lohnt sich ein dynamischer Tarif für Gewerbebetriebe?",
    a: "Dort, wo Verbrauch verschoben werden kann: Kühlung, Wärmepumpen, Druckluft mit Speicher, Ladevorgänge der E-Flotte oder ein Batteriespeicher. Wichtig ist, den Leistungspreis mitzurechnen – wer alle Lasten in die billigste Viertelstunde legt, erzeugt womöglich eine neue Leistungsspitze. Ohne verschiebbare Lasten trägt der Betrieb nur das Preisrisiko.",
  },
  {
    q: "Wie passt ein dynamischer Tarif zu einer PV-Anlage?",
    a: "Sehr gut: Tagsüber deckt die PV-Anlage den Verbrauch, der Reststrom – nachts, im Winter, bei Schlechtwetter – kommt zu Börsenpreisen. Mit einem Speicher, der bei niedrigen Preisen auch aus dem Netz laden darf, und einem Energiemanagement, das Preise und PV-Prognose kennt, wird daraus ein echter Hebel. Die Regelung am Netzanschluss übernimmt bei größeren Anlagen der Parkregler.",
  },
  {
    q: "Verkauft Ökovolt Stromtarife?",
    a: "Nein. Wir sind Elektrotechnik- und PV-Fachbetrieb, kein Stromlieferant, und empfehlen keinen bestimmten Anbieter. Wir helfen bei der Einordnung, rechnen Lastverschiebung und Speicher durch und bauen die Messtechnik und Steuerung, die ein dynamischer Tarif braucht.",
  },
];

const QUELLEN = [
  { titel: "Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", href: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", hinweis: "§ 22 dynamische und feste Energiepreise" },
  { titel: "E-Control: Das neue ElWG und Konsument:innen (28.01.2026)", href: "https://www.e-control.at/documents/1785851/1811582/20260128_Webinar+ElWG+und+Konsumenten_V2.pdf/21dd7e4e-e4aa-dcc4-9e81-0d00766c2ca6?t=1769600935909", hinweis: "§ 22 ab 1.4.2026, > 25.000 Zählpunkte; Smart-Meter-Viertelstundenwerte" },
  { titel: "E-Control: Tarifkalkulator", href: "https://www.e-control.at/tarifkalkulator", hinweis: "neutraler Überblick über Strom- und Gasprodukte inkl. dynamischer Tarife" },
  { titel: "Parlament, Budgetdienst: Senkung der Elektrizitätsabgabe 2026", href: "https://www.parlament.gv.at/fachinfos/budgetdienst/Senkung-der-Elektrizitaetsabgabe-2026" },
  { titel: "klimaaktiv: Das neue ElWG – Auswirkungen auf Unternehmen", href: "https://www.klimaaktiv.at/unternehmen/strategie/das-neue-elektrizitaetswirtschaftsgesetz-elwg-auswirkungen-auf-unternehmen", hinweis: "zeitvariable Netzentgelte" },
  { titel: "Energy-Charts (Fraunhofer ISE): Day-Ahead-Preise Gebotszone AT", href: "https://www.energy-charts.info/?l=de&c=AT", hinweis: "Datenquelle der Live-Grafik, CC BY 4.0" },
];

export default async function StromtarifPage() {
  const snapshot = await getEnergySnapshot().catch((e) => {
    console.error("energy snapshot:", e?.message);
    return null;
  });

  const chartStart = snapshot
    ? { quelle: snapshot.preis.quelle, aufloesungMin: snapshot.preis.aufloesungMin, punkte: snapshot.preis.punkte, stand: snapshot.stand }
    : { quelle: null, aufloesungMin: 15, punkte: [], stand: null };

  return (
    <div>
      <JsonLd
        daten={seitenSchema({
          pfad: PFAD,
          name: "Dynamische Stromtarife in Österreich – Spotpreis AT für Gewerbe und Betriebe mit PV",
          beschreibung: BESCHREIBUNG,
          service: {
            name: "Beratung und Technik für dynamische Stromtarife",
            serviceType: "Lastverschiebung, Messtechnik und Energiemanagement",
            beschreibung: "Einordnung dynamischer Stromtarife in Österreich, Berechnung von Lastverschiebung und Speicher sowie Umsetzung von Messung und Steuerung – ohne Stromvertrieb.",
            audience: "Gewerbe, Industrie, Landwirtschaft, Gemeinden",
          },
        })}
      />
      <JsonLd
        daten={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "Day-Ahead-Börsenstrompreis Österreich (Gebotszone AT) – heute und morgen",
          description: "Day-Ahead-Strompreis der Gebotszone Österreich, stündlich gemittelt, live aktualisiert.",
          url: `https://www.oekovolt.com${PFAD}#boersenpreis`,
          isAccessibleForFree: true,
          license: "https://creativecommons.org/licenses/by/4.0/",
          creator: { "@type": "Organization", name: "Fraunhofer ISE – Energy-Charts", url: "https://www.energy-charts.info" },
          spatialCoverage: { "@type": "Place", name: "Österreich" },
          temporalCoverage: snapshot?.stand ? snapshot.stand.split("T")[0] : undefined,
          variableMeasured: "Strompreis in ct/kWh",
        }}
      />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Dynamischer Stromtarif" }]}
        eyebrow="Dynamischer Stromtarif · Österreich"
        title={
          <>
            Strom beziehen, wenn er <span className="ov-text-gradient">günstig</span> ist
          </>
        }
        lead="Dynamische Tarife geben den Day-Ahead-Preis der Gebotszone Österreich viertelstündlich weiter. Für Betriebe mit PV-Anlage, Speicher und verschiebbaren Lasten ist das ein Hebel – ohne diese Voraussetzungen vor allem ein Preisrisiko."
        image={{ src: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg", alt: "Luftaufnahme eines Gewerbegebäudes mit Photovoltaikanlagen auf den Flachdächern" }}
        points={["Spotpreis AT live", "§ 22 ElWG verständlich", "Lastverschiebung & Leistungspreis", "Neutral, ohne Tarifverkauf"]}
        actions={[
          { label: "Lastverschiebung prüfen", href: "/termin?art=video" },
          { label: "Tarif-Rechner", href: "/rechner/dynamischer-stromtarif", icon: Calculator },
        ]}
        badge={<LivePreisBadge startwert={snapshot?.preis?.aktuell?.eurMwh ?? null} />}
      />

      <Kurzantwort frage="Was bringt ein dynamischer Stromtarif einem Betrieb in Österreich?">
        <p>
          Ein dynamischer Tarif rechnet den Energieanteil zum Börsenpreis der jeweiligen Viertelstunde oder Stunde ab. Er lohnt sich, wenn ein
          Betrieb Verbrauch in günstige Zeiten legen kann – mit Speicher, Kühlung, Wärmepumpe oder E-Flotte – und die eigene PV-Anlage den
          Tagesbedarf ohnehin deckt. Netzentgelte, Abgaben und Leistungspreis bleiben dabei fix und gehören in jede Rechnung.
        </p>
      </Kurzantwort>

      {/* Live-Chart */}
      <Section tone="sand" space="lg" id="boersenpreis" className="scroll-mt-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SectionHeading
            eyebrow="Live-Daten Gebotszone AT"
            title={
              <>
                So schwankt der Börsenpreis – <span className="ov-text-gradient">heute</span>
              </>
            }
            lead="Die Day-Ahead-Auktion legt für jede Viertelstunde des Folgetags einen Preis fest. Die Grafik zeigt Stundenmittel; grün markiert ist das günstigste 3-Stunden-Fenster."
          />
          <Reveal delay={120} className="lg:justify-self-end">
            <ul className="space-y-3 text-[15px] text-ink-700">
              {["Preise netto in ct/kWh (1 €/MWh = 0,1 ct/kWh)", "Österreich: eigene Gebotszone seit 1.10.2018", "Viertelstundenprodukte seit 1.10.2025"].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-100 text-ov-700">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal dir="scale">
          <BoersenpreisChart initial={chartStart} />
        </Reveal>
      </Section>

      {/* Recht */}
      <Section tone="white" space="lg" id="recht" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Rechtslage 2026"
            title="Was das ElWG zu dynamischen Tarifen regelt"
            lead="Seit dem Inkrafttreten des Elektrizitätswirtschaftsgesetzes am 24. Dezember 2025 sind dynamische Energiepreise gesetzlich definiert – mit Angebotspflicht für größere Lieferanten."
          />
          <Punkte
            spalten={1}
            items={[
              { titel: "Angebotspflicht", tag: "§ 22 ElWG · ab 1.4.2026", text: "Lieferanten mit mehr als 25.000 Zählpunkten müssen Verträge mit dynamischen Energiepreisen anbieten – mit erweiterten Informationspflichten; die Regulierungsbehörde berichtet über die Marktentwicklung." },
              { titel: "Infoblatt vor Vertragsabschluss", tag: "Transparenz", text: "Für dynamische und feste Preise gibt es ein zusammenfassendes Informationsblatt – vorvertraglich und laufend, etwa wenn ein günstigeres Produkt verfügbar ist." },
              { titel: "Smart Meter & Viertelstundenwerte", tag: "§§ 53 ff. ElWG", text: "Laut E-Control ab 1. Jänner 2027 standardmäßig ab 1.500 kWh Jahresverbrauch, darunter per Opt-in; kein Opt-out etwa bei Einspeisung, Energiegemeinschaften oder Speichern." },
              { titel: "Zeitvariable Netzentgelte", tag: "Ausblick", text: "Das ElWG schafft die Grundlage für Netzentgelte, die nach Tageszeit oder Auslastung variieren – ein zusätzlicher Anreiz, Lasten zu verschieben." },
            ]}
          />
        </div>
      </Section>

      {/* Preisbestandteile */}
      <Section tone="sand" space="lg" id="preisbestandteile" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Preisbestandteile"
          title="Nur der Energiepreis ist dynamisch – der Rest bleibt fix"
          lead="Auch bei negativen Börsenpreisen bleibt die Stromrechnung meist positiv, weil Netzentgelte, Abgaben und Pauschalen weiterlaufen. Für die Wirtschaftlichkeit zählt deshalb die Differenz im Energiepreis, nicht der Börsenpreis allein."
          className="mb-10"
        />
        <Tabelle caption="Bestandteile des Strompreises in Österreich" kopf={["Bestandteil", "Dynamisch?", "Hinweis"]} zeilen={BESTANDTEILE} minBreite={720} quelle="Stand 2026; Höhe der Netzentgelte je Netzgebiet und Netzebene nach Verordnung der E-Control. Keine Steuer- oder Rechtsberatung." />
      </Section>

      {/* Gewerbe */}
      <Section tone="white" space="lg" id="gewerbe" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Gewerbe & Industrie"
          title="Wo Betriebe Last verschieben können – und wo die Falle liegt"
          lead="Große Verbraucher mit Lastprofilzähler kaufen häufig bereits spotindexiert oder in Tranchen ein. Dynamisch wird es erst dann wirtschaftlich, wenn die Anlage auch reagieren kann."
          className="mb-12"
        />
        <FeatureGrid
          cols={4}
          items={[
            { icon: Snowflake, title: "Kühlung & Kälte", text: "Kühlhäuser und Prozesskälte nutzen thermische Trägheit – vorkühlen in günstigen Stunden." },
            { icon: ThermometerSun, title: "Wärmepumpen & Puffer", text: "Heizen und Warmwasser mit Pufferspeicher in Zeiten mit viel PV oder niedrigem Preis." },
            { icon: Car, title: "E-Flotte", text: "Fahrzeuge laden, wenn Solarstrom oder Börsenstrom günstig ist – mit Lastmanagement." },
            { icon: BatteryCharging, title: "Batteriespeicher", text: "Günstig laden, teure Abendstunden decken, Lastspitzen kappen – ein Speicher, drei Nutzen." },
          ]}
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Hinweis ton="achtung" titel="Die Leistungspreis-Falle">
            <p>
              Betriebe mit Leistungsmessung zahlen einen Leistungspreis für die höchste Viertelstundenleistung. Wer alle Ladepunkte, Speicher und
              Wärmepumpen in dieselbe billige Viertelstunde legt, spart beim Energiepreis und zahlt beim Leistungspreis drauf. Energiemanagement und
              Parkregler begrenzen deshalb auch die Bezugsleistung.
            </p>
          </Hinweis>
          <Hinweis ton="info" titel="Mit PV-Anlage gerechnet">
            <p>
              Zu Mittag deckt die PV-Anlage oft den Verbrauch, die Börse ist dann ohnehin günstig. Der Tarif wirkt vor allem nachts, im Winter und
              an trüben Tagen – dort, wo ein Speicher die teuren Abendstunden überbrücken kann.
            </p>
          </Hinweis>
        </div>
      </Section>

      {/* Passt / passt nicht */}
      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ehrlich eingeordnet" title="Für wen sich ein dynamischer Tarif eignet" align="center" className="mb-12" />
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal dir="left">
            <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-ov-200 md:p-9">
              <p className="flex items-center gap-3 font-display text-[20px] font-extrabold text-ink-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ov-500 text-white">
                  <Check aria-hidden="true" className="h-5 w-5" strokeWidth={3} />
                </span>
                Passt gut, wenn …
              </p>
              <ul className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-ink-700">
                <li className="flex gap-3"><Factory aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />der Betrieb verschiebbare Lasten hat (Kälte, Wärme, Druckluft, Laden).</li>
                <li className="flex gap-3"><BatteryCharging aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />ein Speicher bei niedrigen Preisen nachladen darf.</li>
                <li className="flex gap-3"><Activity aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />ein Energiemanagement Preise, PV-Prognose und Leistungsgrenzen kennt.</li>
                <li className="flex gap-3"><Gauge aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />Viertelstundenwerte vorliegen und ausgewertet werden.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal dir="right">
            <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-ink-200/70 md:p-9">
              <p className="flex items-center gap-3 font-display text-[20px] font-extrabold text-ink-900">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-200 text-ink-700">
                  <X aria-hidden="true" className="h-5 w-5" strokeWidth={3} />
                </span>
                Weniger geeignet, wenn …
              </p>
              <ul className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-ink-700">
                <li className="flex gap-3"><ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />der Verbrauch fast nur in den teuren Abendstunden anfällt.</li>
                <li className="flex gap-3"><PiggyBank aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />das Budget absolute Planbarkeit wie beim Fixpreis verlangt.</li>
                <li className="flex gap-3"><Plug aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />keine Last steuerbar ist – dann bleibt nur das Preisrisiko.</li>
                <li className="flex gap-3"><Gauge aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ink-400" />noch keine Viertelstundenwerte verfügbar sind.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Vertrag & Markt */}
      <Section tone="white" space="lg" id="vertrag" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Vertrag prüfen"
              title="Worauf es beim Tarifvergleich ankommt"
              lead="Anbieter unterscheiden sich weniger im Börsenpreis – der ist für alle gleich – als in Aufschlag, Pauschalen und Vertragsdetails."
            />
            <div className="mt-8">
              <Hinweis ton="norm" titel="Neutraler Marktüberblick">
                <p>
                  Wir empfehlen keinen bestimmten Lieferanten. Welche dynamischen Produkte für Ihre Postleitzahl verfügbar sind, zeigt der{" "}
                  <a href="https://www.e-control.at/tarifkalkulator" target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                    Tarifkalkulator der E-Control
                  </a>
                  .
                </p>
              </Hinweis>
            </div>
          </div>
          <Punkte
            spalten={2}
            items={[
              { titel: "Aufschlag je kWh", text: "Der Zuschlag auf den Börsenpreis – oft der wichtigste Unterschied zwischen Anbietern." },
              { titel: "Grundpauschale", text: "Fixe Monats- oder Jahresgebühr; bei geringem Verbrauch entscheidend." },
              { titel: "Preisquelle & Intervall", text: "EPEX SPOT oder EXAA, Stunde oder Viertelstunde – und ob mit Viertelstundenwerten abgerechnet wird." },
              { titel: "Kündigung & Preisgrenzen", text: "Kündigungsfrist, allfällige Preisober- oder -untergrenzen und Regeln bei negativen Preisen." },
            ]}
          />
        </div>
        <Reveal className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="max-w-xl text-[15px] text-ink-600">Mit Ihren Verbrauchsdaten zeigt der Tarif-Rechner eine erste Größenordnung – für Betriebe rechnen wir mit Ihrem Lastgang.</p>
          <Button href="/rechner/dynamischer-stromtarif" variant="navy" icon={Calculator}>
            Zum Tarif-Rechner
          </Button>
        </Reveal>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Dynamischer Stromtarif in Österreich – kurz beantwortet"
            lead="Stand September 2026. Wir verkaufen keine Stromtarife – wir helfen, die richtige Technik dafür zu haben."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Verweise
        ueberschrift="Weiterlesen"
        items={[
          { href: "/energie-live", titel: "Strommarkt Österreich live", text: "Day-Ahead-Preis der Gebotszone AT, Strommix und negative Preise." },
          { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Günstig laden, Abendspitzen decken, Leistungspreis senken." },
          { href: "/service/direktvermarktung", titel: "Reststromvermarktung", text: "Die andere Seite des Börsenpreises: Überschuss verkaufen." },
          { href: "/produkte/smartmeter", titel: "Smart Meter & Energiemanagement", text: "Viertelstundenwerte und Steuerung als Grundlage." },
        ]}
      />

      <Quellen items={QUELLEN} />

      <CtaBand
        eyebrow="Lastverschiebung & Speicher"
        title="Solarstrom am Tag, Börsenstrom zur günstigsten Viertelstunde."
        text="Wir werten Ihren Lastgang aus, rechnen Speicher und steuerbare Verbraucher durch und bauen Messung und Energiemanagement – den Tarif wählen Sie unabhängig von uns."
        primary={{ label: "Lastgang prüfen lassen", href: "/termin?art=video" }}
        secondary={{ label: "Anfrage senden", href: "/kontakt", icon: CalendarCheck2 }}
      />
    </div>
  );
}
