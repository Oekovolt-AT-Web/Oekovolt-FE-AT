import { Activity, BatteryCharging, Building2, CalendarCheck2, Car, ClipboardList, Cog, FileSpreadsheet, Flame, HandCoins, LineChart, Receipt, ShieldCheck, Warehouse, Zap } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import { zielgruppenVariante } from "@/data/zielgruppen";

const PAGE_URL = "https://www.oekovolt.de/gewerbe";
const TITEL = "Photovoltaik für Gewerbe & Industrie | Ökovolt";
const BESCHREIBUNG =
  "PV-Anlagen für Hallen, Produktion und Büro nach Lastgang geplant – mit Gewerbespeicher, Ladeinfrastruktur für die E-Flotte, Direktvermarktung und Monitoring. Abschreibung und IAB inklusive Überblick.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland", title: TITEL, description: BESCHREIBUNG, images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630 }] },
};

const FAQ = [
  {
    q: "Lohnt sich Photovoltaik für unseren Betrieb?",
    a: "Für die meisten Betriebe mit Tagverbrauch ja – oft schneller als im Eigenheim, weil Produktion, Kühlung und Büro dann Strom brauchen, wenn die Anlage erzeugt. Entscheidend ist der Abgleich von Erzeugung und Lastgang. Eine Beispielrechnung für 100 kWp finden Sie im Ratgeber Photovoltaik Gewerbe.",
  },
  {
    q: "Welche Unterlagen brauchen Sie für ein Angebot?",
    a: "Ideal ist der Lastgang der letzten 12 Monate in Viertelstundenwerten – Betriebe mit registrierender Leistungsmessung (RLM) erhalten ihn vom Netz- oder Messstellenbetreiber. Ohne Lastgang reichen für eine erste Einschätzung Stromrechnungen, Betriebszeiten und Dachpläne.",
  },
  {
    q: "Wie wird die Anlage steuerlich behandelt?",
    a: "Die PV-Anlage ist ein bewegliches Wirtschaftsgut mit 20 Jahren Nutzungsdauer. Für Anschaffungen bis Ende 2027 ist auch die degressive AfA möglich; kleinere Betriebe können zusätzlich Investitionsabzugsbetrag und Sonderabschreibung nach § 7g EStG nutzen. Die konkrete Gestaltung klären Sie mit Ihrer Steuerberatung.",
  },
  {
    q: "Was ändert sich ab 100 kW und ab 750 kW?",
    a: "Bis 100 kW gibt es eine feste Einspeisevergütung. Größere Anlagen müssen ihren Überschuss direkt vermarkten und erhalten die Marktprämie. Für Dachanlagen über 750 kW gibt es eine Förderung nur mit Zuschlag in der Ausschreibung der Bundesnetzagentur – ohne Förderung kann die Anlage aber auch für reinen Eigenverbrauch oder Stromlieferverträge ausgelegt werden.",
  },
  {
    q: "Senkt eine PV-Anlage unseren Leistungspreis?",
    a: "Allein selten: Die Jahreshöchstlast tritt oft an Wintermorgen oder bei Schichtbeginn auf, wenn die Anlage wenig erzeugt. Mit einem Gewerbespeicher und Lastmanagement lassen sich Spitzen gezielt kappen. Wir rechnen diesen Nutzen auf Basis Ihres Lastgangs getrennt aus.",
  },
  {
    q: "Wir sind Mieter der Halle – geht das trotzdem?",
    a: "Ja, mit einem Gestattungsvertrag des Eigentümers und einer Mietdauer, die zur Laufzeit der Anlage passt. Alternativ kann der Eigentümer investieren und Ihnen den Solarstrom liefern – dann gelten Pflichten für die Stromlieferung, die wir bei der Planung berücksichtigen.",
  },
];

export default async function GewerbePage({ searchParams }) {
  const v = zielgruppenVariante("gewerbe", await searchParams);

  return (
    <div data-variante={v.id}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Service", name: "Photovoltaik für Gewerbe und Industrie", provider: { "@id": "https://www.oekovolt.de/#organization" }, areaServed: "DE", audience: { "@type": "BusinessAudience", audienceType: "Gewerbe, Handwerk, Industrie" }, url: PAGE_URL, description: BESCHREIBUNG },
              { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
            ],
          }),
        }}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Gewerbe & Industrie" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg", alt: "Luftaufnahme eines Gewerbegebäudes mit Photovoltaikanlagen auf den Flachdächern" }}
        actions={[
          { label: v.cta, href: "/termin?art=video" },
          { label: "Vor-Ort-Termin", href: "/termin?art=vor-ort", icon: CalendarCheck2 },
        ]}
        points={["Auslegung nach Lastgang", "Speicher, Ladepunkte & Energiemanagement", "Planung, Montage & Monitoring aus einer Hand"]}
      />

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Lösungen" title="Mehr als Module auf dem Dach" className="mb-12" />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Warehouse, title: "Hallen- & Flachdächer", text: "Aufständerung oder dachparallel, Ballast oder mechanisch befestigt – nach Statik, Brandschutz und Dachzustand." },
            { icon: BatteryCharging, title: "Gewerbespeicher & Peak Shaving", text: "Solarüberschüsse in Abend- und Nachtschicht verschieben und Lastspitzen kappen, die den Leistungspreis treiben." },
            { icon: Car, title: "E-Flotte & Ladeinfrastruktur", text: "Dienstwagen und Transporter tagsüber mit Solarstrom laden – mit Lastmanagement passend zum Netzanschluss." },
            { icon: Activity, title: "Energiemanagement & Monitoring", text: "Erzeugung, Verbrauch, Speicher und Ladepunkte in einem System steuern und überwachen – mit Kennzahlen für Controlling und Nachhaltigkeitsbericht." },
            { icon: Zap, title: "Direktvermarktung", text: "Über 100 kW Pflicht, darunter optional: Überschüsse über einen Direktvermarkter an der Börse verkaufen." },
            { icon: Building2, title: "Mieterstrom & Stromlieferung", text: "Solarstrom an gewerbliche Mieter oder Wohnungen im selben Gebäude liefern – mit sauberem Messkonzept." },
          ]}
        />
      </Section>

      <Section tone="green" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Wirtschaftlichkeit"
            title="Drei Hebel, die im Betrieb stärker wirken als im Eigenheim."
            lead="Wer tagsüber Strom braucht, spart mit jeder selbst genutzten Kilowattstunde den vollen Arbeitspreis. Dazu kommen steuerliche Effekte und Planbarkeit bei den Energiekosten."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Flame, titel: "Eigenverbrauch", text: "Hohe Gleichzeitigkeit von Erzeugung und Verbrauch – die wichtigste Stellschraube der Rendite." },
              { icon: Receipt, titel: "Abschreibung", text: "Lineare oder degressive AfA, bei kleineren Betrieben IAB und Sonderabschreibung nach § 7g EStG." },
              { icon: ShieldCheck, titel: "Planbarkeit", text: "Ein Teil der Stromkosten ist für 20 Jahre und mehr kalkulierbar – unabhängig von Börsenpreisen." },
            ].map((k) => (
              <div key={k.titel} className="rounded-2xl border border-ov-100 bg-white p-6">
                <k.icon aria-hidden="true" className="h-6 w-6 text-ov-600" />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{k.titel}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{k.text}</p>
              </div>
            ))}
            <p className="text-sm leading-relaxed text-ink-600 sm:col-span-3">Orientierung, keine Steuer- oder Rechtsberatung. Die Beispielrechnung für eine 100-kWp-Anlage steht im Ratgeber Photovoltaik Gewerbe.</p>
          </div>
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Vorgehen" title="Vom Lastgang zur laufenden Anlage" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: FileSpreadsheet, title: "Lastgang & Dach", text: "Viertelstundenwerte, Betriebszeiten und Dachflächen auswerten – daraus ergeben sich Grundlast und sinnvolle Anlagengröße." },
            { icon: HandCoins, title: "Wirtschaftlichkeit", text: "Eigenverbrauch, Einspeisung oder Direktvermarktung, Speicher und Finanzierung als Varianten nebeneinander." },
            { icon: ClipboardList, title: "Planung & Netz", text: "Statik, Brandschutz, Netzverträglichkeit und Anmeldung – abgestimmt mit Netzbetreiber und Versicherung." },
            { icon: LineChart, title: "Montage & Betrieb", text: "Montage im laufenden Betrieb, danach Monitoring, Wartung und Berichte." },
          ]}
        />
      </Section>

      <Querverweise pfad="/gewerbe" ueberschrift="Vertiefen: Wirtschaftlichkeit, Technik & Recht" />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Geschäftsführung und Technik" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        title="Schicken Sie uns Ihren Lastgang – wir zeigen, was Ihr Dach leisten kann."
        text="Kostenloses Erstgespräch per Video oder vor Ort, mit erster Einschätzung zu Anlagengröße, Eigenverbrauch und Wirtschaftlichkeit."
        primary={{ label: v.cta, href: "/termin?art=video" }}
        secondary={{ label: "Anfrage starten", href: "/angebot", icon: Cog }}
      />
    </div>
  );
}
