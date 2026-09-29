// src/app/produkte/stromspeicher/page.js
//
// Produktseite Stromspeicher – Österreich. Schwerpunkt Gewerbespeicher
// (C&I, Container, Peak Shaving, Ersatzstrom), Heimspeicher nachgeordnet.
//
// Aus dem Backoffice kommt nur noch die Herstellerliste (Karten mit Link auf
// /produkte/stromspeicher/[slug]). Alle Fließtexte sind statisch und auf die
// österreichische Rechtslage geprüft (Stand 09/2026):
//   - EAG-Investitionszuschuss Speicher: max. 50 kWh netto, nur gemeinsam mit
//     dem PV-Antrag (OeMAG, https://www.oem-ag.at/foerderung)
//   - Brandschutz: OVE-Richtlinie R 20, OIB-Richtlinie 2 (Batterieräume)
//   - Smart Meter: Opt-out mit Speicher nicht möglich (§ 54 Abs. 2 ElWG)

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Calculator, Factory, Flame, Gauge, Home, LineChart, Moon, PlugZap, Share2, ShieldAlert, Sun, Table2, TrendingDown } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import SpeicherTagesverlauf from "@/components/stromspeicher/SpeicherTagesverlauf";
import SpeicherMini from "@/components/stromspeicher/SpeicherMini";
import PeakShavingDemo from "@/components/stromspeicher/PeakShavingDemo";
import Umschalter from "@/components/Produktdetail/Umschalter";
import Kennzahlenband from "@/components/Produktdetail/Kennzahlenband";
import FotoBento from "@/components/Produktdetail/FotoBento";
import FachAkkordeon, { FachTabelle } from "@/components/Produktdetail/FachAkkordeon";
import HerstellerWortmarken from "@/components/Hersteller/HerstellerWortmarken";
import { partnerFuer } from "@/components/Hersteller/partner";
import { generateSlug } from "@/lib/slugify";
import { istBelegterPartner } from "@/components/Produktdetail/HerstellerDetail";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.stromspeicher_page.api.get_strom_page_with_keywords`;
const PFAD = "/produkte/stromspeicher";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "Stromspeicher für Gewerbe & Gebäude | Ökovolt";
const DESCRIPTION =
  "Gewerbe- und Heimspeicher in Österreich: Peak Shaving, Eigenverbrauch, Ersatzstrom und Brandschutz nach OVE R 20 – geplant nach Lastgang, fachgerecht errichtet.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Stromspeicher", "Gewerbespeicher", "Batteriespeicher Gewerbe", "Peak Shaving", "Stromspeicher Österreich", "Ersatzstrom"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Stromspeicher" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

/** Herstellerliste aus dem Backoffice – fällt der Abruf aus, entfällt nur dieser Abschnitt. */
async function fetchSpeicherHersteller() {
  if (!isApiConfigured()) return [];
  try {
    const response = await fetch(DATA_URL, { method: "GET", headers: getApiHeaders(), next: { revalidate: 600 } });
    if (!response.ok) {
      console.error(`Stromspeicher-API: HTTP ${response.status}`);
      return [];
    }
    const data = await response.json();
    // Nur Marken mit belegter Zusammenarbeit in Österreich zeigen
    return (data?.message?.strom_second_card_table || []).filter((i) => i?.title && istBelegterPartner(i.title));
  } catch (error) {
    console.error("Stromspeicher-API:", error);
    return [];
  }
}

const img = (p, fallback = "/Images/Dienstleistungen/Smartphone/Stronspeicher.jpg") => (p ? `/api/image?path=${p}` : fallback);

const NUTZEN = [
  { icon: TrendingDown, title: "Peak Shaving", text: "Der Speicher kappt Lastspitzen, etwa bei Schichtbeginn oder beim Anlauf großer Maschinen. Das senkt den leistungsabhängigen Teil des Netzentgelts." },
  { icon: Sun, title: "Eigenverbrauch erhöhen", text: "Mittagsüberschüsse werden in die Abend- und Nachtstunden verschoben, statt sie zum Marktpreis einzuspeisen." },
  { icon: ShieldAlert, title: "Ersatzstrom & Blackout-Vorsorge", text: "Mit netzbildendem Wechselrichter versorgt der Speicher bei Netzausfall kritische Verbraucher – von der Kühlung bis zur IT.", href: "/service/notstrom" },
  { icon: PlugZap, title: "Netzanschluss entlasten", text: "Ladeinfrastruktur oder neue Maschinen trotz begrenzter Anschlussleistung betreiben – der Speicher puffert die Spitzen.", href: "/ladeinfrastruktur" },
  { icon: LineChart, title: "Günstige Stunden nutzen", text: "Mit Spotpreis-Tarif lädt der Speicher bei niedrigen Day-Ahead-Preisen der Gebotszone Österreich und entlädt bei hohen.", href: "/energie-live" },
  { icon: Share2, title: "Energiegemeinschaften", text: "In Erneuerbare-Energie-Gemeinschaften und GEA hält der Speicher mehr Strom im Nahbereich.", href: "/energiegemeinschaften" },
];

const KLASSEN = [
  {
    klasse: "Heimspeicher",
    groesse: "ca. 5–30 kWh",
    aufstellung: "Technikraum, Garage, Keller",
    einsatz: "Premium-Wohnhaus, Chalet, Kleinbetrieb",
  },
  {
    klasse: "Gewerbespeicher (C&I-Schrank)",
    groesse: "ca. 50–500 kWh",
    aufstellung: "Outdoor-Schrank oder eigener Aufstellraum",
    einsatz: "Handwerk, Handel, Hotellerie, Landwirtschaft",
  },
  {
    klasse: "Containerspeicher",
    groesse: "ab ca. 1 MWh",
    aufstellung: "Freiaufstellung mit Fundament, häufig mit Trafo",
    einsatz: "Industrie, Freiflächenanlage, Ladeparks",
  },
];

const FAQ = [
  {
    q: "Lohnt sich ein Gewerbespeicher?",
    a: "Er lohnt sich vor allem dann, wenn er mehrere Aufgaben gleichzeitig erfüllt: Lastspitzen kappen, PV-Überschüsse verschieben und bei Bedarf Ersatzstrom liefern. Ein Speicher nur für den Eigenverbrauch rechnet sich im Gewerbe seltener, weil der Tagverbrauch den Solarstrom oft ohnehin aufnimmt. Wir bewerten das auf Basis Ihres Lastgangs in Viertelstundenwerten.",
  },
  {
    q: "Wie funktioniert Peak Shaving mit einem Speicher?",
    a: "Das Energiemanagement misst laufend den Bezug am Netzanschlusspunkt. Droht eine Viertelstunde über einen festgelegten Schwellwert zu steigen, entlädt der Speicher und hält den Bezug darunter. Weil der leistungsabhängige Teil des Netzentgelts an den höchsten Viertelstundenwerten hängt, sinkt so die Netzrechnung. Entscheidend ist, dass der Speicher vor der Spitze ausreichend geladen ist.",
  },
  {
    q: "Welche Brandschutzvorgaben gelten für Batteriespeicher?",
    a: "Maßgeblich sind die OVE-Richtlinie R 20 für stationäre Energiespeichersysteme und die OIB-Richtlinie 2 in der jeweiligen Landesumsetzung, die Batterieräume als Räume mit erhöhter Brandgefahr behandelt. Je nach Größe sind ein eigener Aufstellraum oder eine Outdoor-Aufstellung mit Abständen nötig. Wir stimmen das Konzept mit Feuerwehr, Behörde und Versicherung ab und kennzeichnen die Anlage für Einsatzkräfte.",
  },
  {
    q: "Gibt es eine Förderung für Stromspeicher in Österreich?",
    a: "Auf Bundesebene wird ein Speicher im Rahmen des EAG-Investitionszuschusses gefördert – bis maximal 50 kWh Nettokapazität und nur gemeinsam mit dem Förderantrag für die Photovoltaikanlage. Die Fördersätze werden je Fördercall festgelegt. Einzelne Bundesländer fördern zusätzlich. Wir prüfen das vor der Bestellung.",
  },
  {
    q: "Versorgt der Speicher den Betrieb bei einem Stromausfall?",
    a: "Nur, wenn er dafür ausgelegt ist. Ersatzstrom braucht einen netzbildenden Wechselrichter, eine Netztrenneinrichtung und eine Aufteilung in versorgte und nicht versorgte Stromkreise. Wir planen das nach einer Liste der kritischen Verbraucher und der gewünschten Überbrückungszeit.",
  },
  {
    q: "Kann ich einen Speicher an eine bestehende PV-Anlage nachrüsten?",
    a: "Ja. Je nach Wechselrichter wird der Speicher DC-seitig über einen Hybrid-Wechselrichter oder AC-seitig mit eigenem Batterie-Wechselrichter eingebunden. Im Gewerbe ist die AC-Kopplung üblich, weil sie unabhängig von den bestehenden PV-Wechselrichtern funktioniert. Der Speicher ist dem Netzbetreiber zu melden.",
  },
  {
    q: "Wie groß sollte ein Heimspeicher sein?",
    a: "Als Faustregel gilt rund 1 kWh Speicherkapazität je 1.000 kWh Jahresverbrauch, begrenzt durch die Größe der PV-Anlage. Mit Wärmepumpe oder E-Auto kann mehr sinnvoll sein. Ein überdimensionierter Speicher wird im Winter selten voll und verlängert die Amortisation.",
  },
];

export default async function StromspeicherPage() {
  const apiProdukte = await fetchSpeicherHersteller();
  // Ohne Backoffice-Daten: belegte Speicher-Partner als statische Karten (Detailseiten existieren auch ohne API)
  const produkte = apiProdukte.length
    ? apiProdukte.map((item) => ({
        title: item.title,
        href: `${PFAD}/${generateSlug(item.title)}`,
        bild: img(item.banner_image),
        alt: item.alt_banner_image || item.title,
        logo: item.logo_image ? img(item.logo_image) : null,
        altLogo: item.alt_logo_image || "",
        text: item.main_description,
        rolle: null,
      }))
    : partnerFuer("stromspeicher").map((p) => ({ title: p.title, href: `${PFAD}/${p.slug}`, bild: p.bild, alt: p.alt_banner_image, logo: null, text: p.main_description, rolle: p.rolle }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${PAGE_URL}/#service` },
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}/#service`,
        name: "Stromspeicher für Gewerbe und Gebäude",
        serviceType: "Planung und Errichtung von Batteriespeichern",
        description: DESCRIPTION,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
        url: PAGE_URL,
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Stromspeicher" }]}
        eyebrow="Stromspeicher · Gewerbe & Gebäude"
        title={
          <>
            Stromspeicher, die <span className="ov-text-gradient-light">mehr als Eigenverbrauch</span> können
          </>
        }
        lead="Ein Gewerbespeicher kappt Lastspitzen, verschiebt Solarstrom in die Abendstunden und hält bei Netzausfall den Betrieb am Laufen. Wir planen Heim-, Gewerbe- und Containerspeicher nach Ihrem Lastgang – mit Brandschutzkonzept und sauberer Einbindung in PV-Anlage und Energiemanagement."
        image={{ src: "/Images/AT/ratgeber/batteriespeicher-anlage.jpg", alt: "Batteriespeicher-Schränke im Freien neben einer Trafostation", position: "60% 50%" }}
        points={["Peak Shaving nach Lastgang", "Ersatzstrom & Blackout-Vorsorge", "Brandschutz nach OVE R 20", "Nachrüstbar für Bestandsanlagen"]}
        actions={[
          { label: "Speicherprojekt anfragen", href: "/angebot" },
          { label: "Größe berechnen", href: "#schnellcheck", icon: Calculator },
        ]}
      />

      <HerstellerWortmarken titel="Speicher- und Wechselrichtersysteme unserer Partner" fokus={["speicher"]} />

      <Kennzahlenband
        items={[
          { value: 15, suffix: " min", label: "Messintervall, nach dem das Leistungsentgelt Ihre Spitze bewertet" },
          { value: 50, suffix: " kWh", label: "max. Speicherkapazität im EAG-Investitionszuschuss" },
          { wert: "LFP", label: "Lithium-Eisenphosphat als Zellchemie-Standard" },
          { wert: "R 20", label: "OVE-Richtlinie – Grundlage unseres Brandschutzkonzepts" },
        ]}
      />

      {/* Nutzen */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Wofür ein Speicher"
          title={
            <>
              Sechs Aufgaben, <span className="ov-text-gradient">ein Batteriesystem</span>
            </>
          }
          lead="Ein Stromspeicher im Betrieb rechnet sich, wenn er mehrere Erlöse gleichzeitig erzielt. Welche davon bei Ihnen zählen, zeigt der Lastgang."
          className="mb-12"
        />
        <FeatureGrid items={NUTZEN} cols={3} />
      </Section>

      {/* Speicherklassen */}
      <Section tone="sand" space="lg" id="speicherklassen">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <SectionHeading
            eyebrow="Heim, Gewerbe, Container"
            title="Welche Speicherklasse passt?"
            lead="Die Größe folgt der Aufgabe: Für Peak Shaving zählt die Entladeleistung in kW, für Lastverschiebung die Kapazität in kWh."
          />
          <p className="text-[15px] leading-relaxed text-ink-600 lg:pb-1">Die Größenordnungen sind typische Werte, keine festen Grenzen – die Detailtabelle finden Sie unter den Bildern.</p>
        </div>
        <FotoBento
          items={[
            {
              bild: "/Images/AT/loesungen/gewerbespeicher-batteriecontainer.jpg",
              alt: "Batteriespeicher-Container an einem Kraftwerksstandort in Niederösterreich",
              eyebrow: KLASSEN[2].groesse,
              titel: "Containerspeicher",
              text: `${KLASSEN[2].einsatz}. ${KLASSEN[2].aufstellung}.`,
              href: "/gewerbespeicher",
            },
            { bild: "/Images/AT/ratgeber/batteriespeicher-anlage.jpg", alt: "Gewerbespeicher-Schränke im Außenbereich", eyebrow: KLASSEN[1].groesse, titel: "Gewerbespeicher (C&I-Schrank)", text: KLASSEN[1].einsatz },
            { bild: "/Images/Dienstleistungen/Smartphone/Stronspeicher.jpg", alt: "Heimspeicher mit Wechselrichter im Technikraum", eyebrow: KLASSEN[0].groesse, titel: "Heimspeicher", text: KLASSEN[0].einsatz, position: "50% 70%" },
          ]}
        />
        <FachAkkordeon
          className="mt-8"
          items={[
            {
              id: "speicherklassen-tabelle",
              icon: Table2,
              titel: "Für Technik & Einkauf: Speicherklassen im Vergleich",
              kurz: "Kapazität, Aufstellung und typischer Einsatz",
              inhalt: (
                <FachTabelle
                  caption="Speicherklassen für Heim, Gewerbe und Industrie"
                  kopf={["Klasse", "Typische Kapazität", "Aufstellung", "Einsatz"]}
                  zeilen={KLASSEN.map((k) => [k.klasse, k.groesse, k.aufstellung, k.einsatz])}
                />
              ),
            },
          ]}
        />
      </Section>

      {/* Interaktiv: Betrieb / Wohnhaus */}
      <Section tone="white" space="lg" id="schnellcheck" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Selbst ausprobieren"
          title={
            <>
              Lastspitze kappen oder <span className="ov-text-gradient">Abendstrom sichern?</span>
            </>
          }
          lead="Im Betrieb entscheidet die Entladeleistung, im Wohnhaus der Eigenverbrauch. Wählen Sie Ihre Situation – die Werte ändern sich live."
          align="center"
          className="mb-10"
        />
        <Umschalter
          label="Einsatz des Speichers"
          ansichten={[
            { id: "betrieb", label: "Betrieb: Peak Shaving", icon: <Factory />, inhalt: <PeakShavingDemo /> },
            { id: "wohnhaus", label: "Wohnhaus: Eigenverbrauch", icon: <Home />, inhalt: <SpeicherMini /> },
          ]}
        />
      </Section>

      {/* Peak Shaving */}
      <Section tone="sand" space="lg" id="peak-shaving">
        <SplitMedia
          eyebrow="Peak Shaving"
          title="Lastspitzen kappen, Netzentgelt senken"
          text={[
            "Betriebe mit Leistungsmessung zahlen neben dem Arbeitspreis ein leistungsabhängiges Netzentgelt, das sich nach den höchsten Viertelstundenwerten im Abrechnungszeitraum richtet. Eine einzige Spitze kann so die Netzrechnung eines ganzen Jahres prägen.",
            "Der Speicher erkennt drohende Spitzen und liefert in diesen Minuten zu. Wir ermitteln aus Ihrem Lastgang, welcher Schwellwert erreichbar ist und welche Entladeleistung dafür nötig ist – bevor Sie investieren.",
          ]}
          points={["Auswertung der Viertelstundenwerte aus dem Netzbetreiber-Portal", "Schwellwert und Entladeleistung nach Lastgang", "Kombination mit PV-Eigenverbrauch und Ersatzstrom"]}
          action={{ label: "Gewerbespeicher im Detail", href: "/gewerbespeicher" }}
          image={{ src: "/Images/AT/technik/leitwarte-netzbetrieb.jpg", alt: "Leitwarte mit Lastgang- und Netzdaten auf mehreren Bildschirmen" }}
        />
      </Section>

      {/* Dunkle Kontrast-Sektion: Tagesverlauf */}
      <Section tone="navy" space="lg" id="heimspeicher" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-24 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-sun-400/10 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Für Privat"
            title={
              <>
                Heimspeicher: tagsüber laden, <span className="ov-text-gradient-light">abends nutzen</span>
              </>
            }
            lead="Im Wohnhaus schließt der Speicher die Lücke zwischen Mittagsüberschuss und Abendverbrauch. Das Beispiel zeigt einen Frühlingstag mit 10-kWp-Anlage, 4.500 kWh Jahresverbrauch und 8-kWh-Speicher – vereinfacht zur Veranschaulichung."
            align="center"
            className="mb-12"
          />
          <Reveal dir="scale">
            <SpeicherTagesverlauf />
          </Reveal>
          <div className="mt-14">
            <Steps
              tone="dark"
              items={[
                { icon: Sun, title: "Mittags: Überschuss", text: "Die Anlage deckt den Verbrauch. Was übrig bleibt, fließt zuerst in den Speicher statt zum Marktpreis ins Netz." },
                { icon: BatteryCharging, title: "Nachmittags: voll geladen", text: "Ist der Speicher voll, geht der restliche Überschuss an Ihren Stromabnehmer – Energielieferant oder OeMAG." },
                { icon: Moon, title: "Abends: eigener Strom", text: "Kochen, Waschen, Licht: Der Speicher liefert Solarstrom bis in die Nacht, Netzbezug wird zur Ausnahme." },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* Brandschutz & Förderung */}
      <Section tone="white" space="lg" id="brandschutz">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-sand-50 ring-1 ring-ink-200/70">
              <div className="relative aspect-[16/7] overflow-hidden">
                <Image src="/Images/AT/ratgeber/photovoltaik-brandschutz.jpg" alt="Feuerwehr-Schlüsselschalter zur Abschaltung einer Anlage" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" style={{ objectPosition: "50% 35%" }} />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sand-50 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-7 pt-2 md:p-9 md:pt-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ov-600 shadow-sm ring-1 ring-ov-200">
                  <Flame aria-hidden="true" className="h-6 w-6" />
                </span>
                <h2 className="ov-h3 mt-6 text-ink-900">Brandschutz und Aufstellung</h2>
                <p className="mt-4 text-[15.5px] leading-relaxed text-ink-600">
                  Für stationäre Batteriespeicher gilt die OVE-Richtlinie R 20; baurechtlich greift die OIB-Richtlinie 2 in der Umsetzung des jeweiligen Bundeslandes, die Batterieräume als Räume mit erhöhter Brandgefahr einordnet. Wir planen Aufstellort, Abstände, Lüftung und Kennzeichnung und stimmen das Konzept mit Feuerwehr, Behörde und Versicherung ab.
                </p>
                <ul className="mt-5 space-y-2 text-[15px] text-ink-700">
                  <li>• LFP-Zellchemie (Lithium-Eisenphosphat) als Standard</li>
                  <li>• Eigener Aufstellraum oder Outdoor-Schrank je nach Größe</li>
                  <li>• Kennzeichnung und Abschaltung für Einsatzkräfte</li>
                </ul>
              </div>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-sand-50 ring-1 ring-ink-200/70">
              <div className="relative aspect-[16/7] overflow-hidden">
                <Image src="/Images/AT/ratgeber/eag-investitionszuschuss.jpg" alt="Photovoltaikanlage – Symbolbild zur EAG-Förderung" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sand-50 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-7 pt-2 md:p-9 md:pt-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ov-600 shadow-sm ring-1 ring-ov-200">
                  <BatteryCharging aria-hidden="true" className="h-6 w-6" />
                </span>
                <h2 className="ov-h3 mt-6 text-ink-900">Förderung für Speicher</h2>
                <p className="mt-4 text-[15.5px] leading-relaxed text-ink-600">
                  Der EAG-Investitionszuschuss fördert Speicher bis maximal 50 kWh Nettokapazität – und nur gemeinsam mit dem Antrag für die Photovoltaikanlage im OeMAG-Fördercall. Die Sätze werden je Call festgelegt. Mehrere Bundesländer haben eigene Programme. Das Förderansuchen muss vor der Bestellung gestellt werden.
                </p>
                <p className="mt-4 text-[15.5px] leading-relaxed text-ink-600">
                  Wichtig für den Betrieb: Ein Speicher ist dem Netzbetreiber zu melden. Mit meldepflichtiger Anlage ist ein Smart-Meter-Opt-out nach § 54 ElWG nicht möglich – die Viertelstundenwerte stehen dann für Energiemanagement und Abrechnung zur Verfügung.
                </p>
                <Link href="/forderungen/bundesfoerderung" className="group mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                  Bundesförderung im Detail
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
      </Section>

      {produkte.length > 0 && (
        <Section tone="sand" space="lg">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Hersteller"
              title="Speichersysteme, die wir verbauen"
              lead="Markenhersteller mit Service in Österreich, sauber integriert in Wechselrichter, Ladeinfrastruktur und Energiemanagement."
            />
            <Link href="/produkte/hersteller" className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Alle Hersteller
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <ul className={`grid gap-5 md:grid-cols-2 ${produkte.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
            {produkte.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 80} className="flex">
                <Link href={item.href} className="group ov-card-hover flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-200">
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-ink-50 to-ink-100">
                    <Image src={item.bild} alt={item.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-6 transition-transform duration-700 group-hover:scale-105" />
                    {item.logo ? (
                      <span className="absolute left-4 top-4 flex h-11 items-center rounded-full bg-white/95 px-3 shadow-md backdrop-blur">
                        <Image src={item.logo} alt={item.altLogo} width={80} height={28} className="h-6 w-auto object-contain" />
                      </span>
                    ) : (
                      item.rolle && <span className="absolute left-4 top-4 rounded-full bg-navy-950/80 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wider text-white backdrop-blur">{item.rolle}</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <h3 className="font-display text-[26px] font-extrabold tracking-tight text-ink-900 transition-colors group-hover:text-ov-700">{item.title}</h3>
                    <p className="mt-3 line-clamp-4 whitespace-pre-line text-[15px] leading-relaxed text-ink-600">{item.text}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold text-ov-700">
                      Details ansehen
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Stromspeicher – fachlich beantwortet" lead="Sie haben eine andere Frage? Rufen Sie uns an – wir beraten herstellerunabhängig." />
            <Reveal delay={100} className="mt-8 grid gap-3">
              {[
                { icon: Gauge, text: "Peak-Shaving-Rechner", href: "/rechner/peak-shaving" },
                { icon: Calculator, text: "Stromspeicher-Rechner", href: "/rechner/stromspeicher" },
              ].map(({ icon: Icon, text, href }) => (
                <Link key={href} href={href} className="group flex min-h-14 items-center gap-3 rounded-2xl bg-sand-50 px-5 text-[15px] font-semibold text-ink-800 ring-1 ring-ink-200/70 transition hover:ring-ov-300">
                  <Icon aria-hidden="true" className="h-5 w-5 text-ov-600" />
                  <span className="flex-1">{text}</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-ov-600 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Speicher, die sich über mehrere Aufgaben rechnen."
        text={`Persönliche Beratung von ${FIRMA.name} aus ${FIRMA.ort} – für Betriebe, Gemeinden und Premium-Wohnhäuser in ganz Österreich, mit Lastganganalyse und festem Ansprechpartner.`}
        primary={{ label: "Speicherprojekt anfragen", href: "/angebot" }}
        secondary={{ label: "Speichergröße berechnen", href: "/rechner/stromspeicher" }}
      />
    </div>
  );
}
