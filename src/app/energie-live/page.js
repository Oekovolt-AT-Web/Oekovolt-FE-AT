// energie-live/page.js – Strommarkt Österreich live (Gebotszone AT)

import { Activity, AlertTriangle, BatteryCharging, Clock, Database, ExternalLink, Scale, Sun } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import LiveKennzahlen from "@/components/EnergieLive/LiveKennzahlen";
import PreisChart from "@/components/EnergieLive/PreisChart";
import ErzeugungChart from "@/components/EnergieLive/ErzeugungChart";
import MeritOrder from "@/components/EnergieLive/MeritOrder";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import StundenRanking from "@/components/ServiceAT/B/StundenRanking";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import Button from "@/components/ui/Button";
import { getEnergySnapshot } from "@/lib/energy";
import { preisTage, zeitfenster, ct, gw, uhr, spanne, tagLang } from "@/components/EnergieLive/berechnung";

export const revalidate = 900;

const PAGE_URL = "https://www.oekovolt.com/energie-live";
const OG_BILD = "https://www.oekovolt.com/og-image.jpg";

export async function generateMetadata() {
  const title = "Strompreis Börse Österreich live: Day-Ahead AT | Ökovolt";
  let description =
    "Börsenstrompreis Österreich aktuell: Day-Ahead-Preis der Gebotszone AT heute und morgen in 15-Minuten-Werten, günstigste Stunden und Strommix – live.";
  try {
    const s = await getEnergySnapshot();
    const a = s.preis.aktuell;
    if (a) {
      description = `Börsenstrompreis Österreich jetzt ${ct(a.eurMwh)} ct/kWh: Day-Ahead-Preis der Gebotszone AT in 15-Minuten-Werten, günstigste Stunden und Strommix live.`;
    }
  } catch {
    // statische Beschreibung genügt
  }
  return {
    title,
    description,
    keywords: [
      "Strompreis Börse Österreich",
      "Day-Ahead Preis Österreich",
      "Börsenstrompreis AT",
      "Strompreis live Österreich",
      "negative Strompreise Österreich",
      "EPEX Spot Austria",
      "Strommix Österreich",
      "dynamischer Stromtarif Österreich",
    ],
    alternates: { canonical: PAGE_URL },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_AT",
      url: PAGE_URL,
      siteName: "Ökovolt Österreich",
      title: "Strommarkt Österreich live – Börsenstrompreis & Strommix",
      description,
      images: [{ url: OG_BILD, width: 1200, height: 630, alt: "Ökovolt – Strommarkt Österreich live" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_BILD] },
  };
}

const FAQ = [
  {
    q: "Was ist der Day-Ahead-Preis in Österreich?",
    a: "Der Day-Ahead-Preis ist der Großhandelspreis für Strom, der am Vortag in einer europaweit gekoppelten Auktion für jede Viertelstunde des Folgetags ermittelt wird. Österreich bildet dabei seit 1. Oktober 2018 eine eigene Gebotszone (AT), getrennt von Deutschland und Luxemburg. Seit 1. Oktober 2025 wird in Viertelstunden gehandelt; die Ergebnisse stehen nach der Auktion zu Mittag fest. Zusätzlich führt die Energiebörse EXAA in Wien eine eigene Day-Ahead-Auktion durch.",
  },
  {
    q: "Warum ist der Strompreis in Österreich anders als in Deutschland?",
    a: "Weil die Übertragungskapazität zwischen den Ländern begrenzt ist: Seit der Trennung der gemeinsamen Preiszone 2018 bildet sich in Österreich ein eigener Preis, sobald die Leitungen zwischen den Gebotszonen ausgelastet sind. Im Jahresmittel lag der Day-Ahead-Preis 2025 in Österreich bei rund 99 €/MWh, in der Zone Deutschland-Luxemburg bei rund 89 €/MWh (eigene Auswertung, Stundenmittel).",
  },
  {
    q: "Zahle ich als Betrieb oder Haushalt den Börsenstrompreis?",
    a: "Nicht direkt. Der Börsenpreis ist ein Nettopreis für die Energie. Auf der Rechnung kommen Netznutzungs-, Netzverlust- und Messentgelt, Erneuerbaren-Förderpauschale und -beitrag, Elektrizitätsabgabe, gegebenenfalls Gebrauchsabgabe, der Aufschlag des Lieferanten und 20 % Umsatzsteuer hinzu. Nur dynamische Tarife geben den Börsenpreis zeitgenau weiter; Lieferanten mit mehr als 25.000 Zählpunkten müssen sie seit 1. April 2026 nach § 22 ElWG anbieten.",
  },
  {
    q: "Wie oft gibt es in Österreich negative Strompreise?",
    a: "Immer öfter. Nach unserer Auswertung der Energy-Charts-Daten lag der Day-Ahead-Preis der Gebotszone AT 2024 in 307 Stunden und 2025 in 378 Stunden im Stundenmittel unter null, 2026 bis Ende September in rund 260 Stunden. Negative Preise treten vor allem an sonnigen Wochenenden und Feiertagen im Frühjahr zur Mittagszeit auf, wenn Photovoltaik, Laufwasser und Importe den Bedarf übersteigen.",
  },
  {
    q: "Wann ist Strom am günstigsten?",
    a: "Im Frühjahr und Sommer meist zu Mittag zwischen etwa 11 und 16 Uhr, wenn Photovoltaikanlagen am meisten liefern. Am teuersten ist Strom in der Regel am frühen Abend zwischen 18 und 21 Uhr und an windarmen Winterabenden. Die günstigsten Stunden des Tages zeigt das Diagramm oben.",
  },
  {
    q: "Was bedeutet der Anteil Erneuerbarer an der Last?",
    a: "Der angezeigte Anteil bezieht die Erzeugung aus Wasserkraft, Sonne, Wind und Biomasse auf den aktuellen Stromverbrauch in Österreich. Liegt er über 100 %, erzeugen Erneuerbare in diesem Moment mehr, als verbraucht wird – der Überschuss wird exportiert oder in Pumpspeicherkraftwerke geladen. Österreich ist eng mit seinen Nachbarländern vernetzt; Import und Export schwanken deshalb stark über den Tag.",
  },
  {
    q: "Was bedeuten negative Preise für meine Photovoltaikanlage?",
    a: "Das hängt vom Vermarktungsweg ab. Der OeMAG-Marktpreis leitet sich aus den Börsenpreisen ab und sinkt, wenn viele Stunden negativ sind. Bei der EAG-Marktprämie entfällt die Prämie für den gesamten Zeitraum, wenn der Preis sechs oder mehr Stunden in Folge negativ ist. Direktvermarkter regeln in solchen Stunden ab. In jedem Fall gilt: Eigenverbrauch, Speicher und steuerbare Verbraucher sind dann die beste Verwendung für Solarstrom.",
  },
  {
    q: "Woher stammen die Daten und wie aktuell sind sie?",
    a: "Börsenpreise und Stromerzeugung stammen von Energy-Charts des Fraunhofer-Instituts für Solare Energiesysteme ISE; die Preisdaten gibt Energy-Charts mit Bundesnetzagentur und SMARD.de als Quelle an, Lizenz jeweils CC BY 4.0. Fällt diese Quelle aus, nutzen wir für die Preise ersatzweise die stündlichen Day-Ahead-Werte von aWATTar Österreich. Die Seite aktualisiert sich alle fünf Minuten; Erzeugungsdaten laufen mit etwas Verzögerung ein. Alle Angaben ohne Gewähr.",
  },
];

export default async function EnergieLivePage() {
  const s = await getEnergySnapshot();
  const jetzt = Date.parse(s.stand);
  const tage = preisTage(s.preis, jetzt);
  const fenster = tage.heute ? zeitfenster(tage.heute.punkte, 180, tage.schrittMs).guenstig : null;

  // Kompakte Startwerte für die Client-Bausteine (klein halten: RSC-Payload)
  const kompakt = {
    stand: s.stand,
    preis: { quelle: s.preis.quelle, aufloesungMin: s.preis.aufloesungMin, punkte: s.preis.punkte },
    erzeugung: {
      quelle: s.erzeugung.quelle,
      zeitpunkt: s.erzeugung.zeitpunkt,
      solarMw: s.erzeugung.solarMw,
      windMw: s.erzeugung.windMw,
      wasserMw: s.erzeugung.wasserMw,
      importMw: s.erzeugung.importMw,
      lastMw: s.erzeugung.lastMw,
      eeAnteil: s.erzeugung.eeAnteil,
      solarAnteil: s.erzeugung.solarAnteil,
    },
  };
  const nurErzeugung = { stand: s.stand, preis: null, erzeugung: s.erzeugung };

  // Zitierfähiger Antwortsatz (auch ohne JavaScript im HTML)
  const antwort = tage.heute
    ? `Am ${tagLang(tage.heute.start)} kostet Strom an der Börse in Österreich im Schnitt ${ct(tage.heute.avg)} ct/kWh (netto, Gebotszone AT). Am günstigsten ist er um ${uhr(tage.heute.min.t)} Uhr mit ${ct(tage.heute.min.eurMwh)} ct/kWh, am teuersten um ${uhr(tage.heute.max.t)} Uhr mit ${ct(tage.heute.max.eurMwh)} ct/kWh${fenster ? `; das günstigste 3-Stunden-Fenster liegt zwischen ${spanne(fenster.start, fenster.ende)}` : ""}.`
    : "Der Day-Ahead-Preis der Gebotszone Österreich wird für jede Viertelstunde des Folgetages an der Strombörse ermittelt und zu Mittag veröffentlicht.";

  // Satz zum Strommix – nur mit vorhandenen Werten
  const e = s.erzeugung;
  const mixTeile = [
    e.wasserMw != null ? `${gw(e.wasserMw)} GW Wasserkraft` : null,
    e.solarMw != null && e.solarMw >= 20 ? `${gw(e.solarMw)} GW Solar` : null,
    e.windMw != null ? `${gw(e.windMw)} GW Wind` : null,
  ].filter(Boolean);
  const mixSatz =
    e.eeAnteil != null && e.zeitpunkt
      ? `Zuletzt (${uhr(e.zeitpunkt)} Uhr) deckten erneuerbare Energien ${Math.round(e.eeAnteil)} % des Stromverbrauchs in Österreich${mixTeile.length ? `: ${mixTeile.join(", ")}` : ""}${e.lastMw != null ? ` bei einer Netzlast von ${gw(e.lastMw)} GW` : ""}.`
      : "Wie viel Strom aus Wasserkraft, Sonne, Wind, Biomasse und Gas stammt – und wie sich das über den Tag verschiebt.";

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${PAGE_URL}/#dataset`,
    name: "Strommarkt Österreich live: Day-Ahead-Börsenstrompreis (Gebotszone AT) und Stromerzeugung nach Quelle",
    description:
      "Day-Ahead-Großhandelspreis für Strom in der Gebotszone Österreich in 15-Minuten-Auflösung sowie öffentliche Nettostromerzeugung nach Energieträger und Netzlast für Österreich, fortlaufend aktualisiert.",
    url: PAGE_URL,
    keywords: ["Day-Ahead", "Börsenstrompreis", "Gebotszone AT", "Strommix", "Erneuerbare Energien", "Österreich"],
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: { "@type": "Organization", name: "Fraunhofer-Institut für Solare Energiesysteme ISE – Energy-Charts", url: "https://www.energy-charts.info" },
    publisher: { "@id": "https://www.oekovolt.com/#organization" },
    spatialCoverage: { "@type": "Place", name: "Österreich" },
    temporalCoverage: tage.heute ? new Date(tage.heute.start).toISOString().slice(0, 10) : undefined,
    dateModified: s.stand,
    variableMeasured: [
      { "@type": "PropertyValue", name: "Day-Ahead-Preis Gebotszone AT", unitText: "EUR/MWh" },
      { "@type": "PropertyValue", name: "Nettostromerzeugung je Energieträger", unitText: "MW" },
      { "@type": "PropertyValue", name: "Netzlast", unitText: "MW" },
      { "@type": "PropertyValue", name: "Anteil erneuerbarer Energien an der Last", unitText: "Prozent" },
    ],
    distribution: [{ "@type": "DataDownload", encodingFormat: "application/json", contentUrl: "https://www.oekovolt.com/api/energie/live?voll=1" }],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Strommarkt Österreich live – Börsenstrompreis aktuell & Day-Ahead-Preis heute",
    description: antwort,
    inLanguage: "de-AT",
    isPartOf: { "@id": "https://www.oekovolt.com/#website" },
    about: { "@id": `${PAGE_URL}/#dataset` },
    dateModified: s.stand,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

      <Stil />
      <HeroBild
        breadcrumbs={[{ name: "Wissen", href: "/ratgeber" }, { name: "Strommarkt Österreich live" }]}
        eyebrow="Energie live · Gebotszone Österreich"
        title={
          <>
            Strommarkt Österreich <span className="ov-text-gradient-light">live</span>
          </>
        }
        lead="Börsenstrompreis der Gebotszone AT, Strommix und Anteil erneuerbarer Energien – viertelstündlich aus offenen Daten. Und was das für den Stromverbrauch Ihres Betriebs heute bedeutet."
        image={{ src: "/Images/AT/service-b/wasserkraft-oesterreich.jpg", alt: "Donaukraftwerk Ybbs-Persenbeug in Niederösterreich aus der Luft" }}
        ton="tief"
      >
        <LiveKennzahlen initial={kompakt} />
      </HeroBild>

      {/* Preisverlauf */}
      <Section tone="white" space="lg" id="preisverlauf" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Day-Ahead-Preis heute"
          title={
            <>
              Wann Strom heute <span className="ov-text-gradient">am günstigsten</span> ist
            </>
          }
          lead={antwort}
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale">
          <PreisChart initial={kompakt} />
        </Reveal>
      </Section>

      {/* Günstigste Stunden */}
      <Section tone="sand" space="lg" id="guenstigste-stunden" className="scroll-mt-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16 md:mb-12">
          <SectionHeading
            eyebrow="Was bedeutet das für Sie?"
            title={
              <>
                Die günstigsten Stunden – <span className="ov-text-gradient">auf einen Blick</span>
              </>
            }
          />
          <Reveal delay={100}>
            <p className="ov-lead text-ink-600">
              Wer Verbrauch in günstige Stunden verschiebt, spart mit einem dynamischen Tarif – und nutzt Strom dann, wenn besonders viel Solar-, Wasser- und Windstrom im Netz ist.
            </p>
          </Reveal>
        </div>
        <Reveal dir="scale">
          <StundenRanking initial={kompakt} />
        </Reveal>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-[13px] leading-relaxed text-ink-500">
            Orientierung, keine Beratung: Berechnet aus den veröffentlichten Day-Ahead-Preisen der Gebotszone AT. Ob sich ein dynamischer Tarif lohnt, hängt von Verbrauch, Flexibilität,
            Leistungspreis und Tarifaufbau ab.
          </p>
          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
            <Button href="/rechner/dynamischer-stromtarif" variant="navy" size="md">
              Tarif-Rechner
            </Button>
            <Button href="/gewerbespeicher" variant="secondary" size="md">
              PV & Speicher
            </Button>
          </div>
        </div>
      </Section>

      {/* Strommix */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Stromerzeugung nach Quelle"
          title={
            <>
              Der Strommix der <span className="ov-text-gradient">letzten 24 Stunden</span>
            </>
          }
          lead={mixSatz}
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale">
          <ErzeugungChart initial={nurErzeugung} />
        </Reveal>
      </Section>

      {/* Merit-Order & negative Preise */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Hintergrund"
              title="Warum der Strompreis schwankt – und manchmal negativ wird"
              lead="An der Börse bestimmt das teuerste Angebot, das zur Deckung der Nachfrage gerade noch gebraucht wird, den Preis für alle. Dieses Prinzip heißt Merit-Order – und es wirkt im europäischen Verbund."
            />
            <ul className="mt-10 space-y-6">
              {[
                {
                  icon: Scale,
                  titel: "Merit-Order im Verbund",
                  text: "Angebote werden nach Grenzkosten sortiert. Sonne, Wind und Laufwasser kosten fast nichts, Gaskraftwerke am meisten. Weil Österreich im gekoppelten Markt handelt, setzen oft Kraftwerke in Nachbarländern den Preis.",
                },
                {
                  icon: AlertTriangle,
                  titel: "Negative Preise",
                  text: "Übersteigt das Angebot die Nachfrage, fällt der Preis unter null. Unflexible Kraftwerke und ungesteuerte Einspeisung zahlen dann lieber, als abzuschalten. 2025 war das in Österreich in 378 Stunden der Fall.",
                },
                {
                  icon: Sun,
                  titel: "Was das für PV-Betreiber heißt",
                  text: "Zu Mittag ist Solarstrom an der Börse wenig wert, abends ist Strom teuer. Wer Solarstrom selbst nutzt, speichert und bei negativen Preisen abregeln kann, macht sich von beidem unabhängig.",
                },
              ].map((p, i) => (
                <Reveal as="li" key={p.titel} delay={i * 80} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-ov-300">
                    <p.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-bold text-white">{p.titel}</h3>
                    <p className="mt-1.5 text-[15.5px] leading-relaxed text-white/65">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal dir="right">
            <MeritOrder />
          </Reveal>
        </div>
      </Section>

      {/* FAQ + Quellen */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Häufige Fragen"
              title="Börsenstrompreis Österreich verständlich erklärt"
              lead="Day-Ahead, Gebotszone AT, negative Preise, dynamische Tarife – die wichtigsten Antworten, Stand September 2026."
            />
            <Reveal className="mt-10 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-7">
              <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                <Database aria-hidden="true" className="h-4 w-4 text-ov-600" />
                Quellen & Methodik
              </h3>
              <ul className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-ink-600">
                <li className="flex gap-2.5">
                  <Activity aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ink-400" />
                  <span>
                    Börsenpreise (Gebotszone AT) und Erzeugung Österreich:{" "}
                    <a href="https://www.energy-charts.info/?l=de&c=AT" target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                      Fraunhofer ISE – Energy-Charts
                      <ExternalLink aria-hidden="true" className="ml-1 inline h-3.5 w-3.5" />
                    </a>
                    , Preisdaten laut Energy-Charts von Bundesnetzagentur | SMARD.de, Lizenz{" "}
                    <a href="https://creativecommons.org/licenses/by/4.0/deed.de" target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                      CC BY 4.0
                    </a>
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <BatteryCharging aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ink-400" />
                  <span>Ersatzquelle für Preise: aWATTar Österreich (stündliche Day-Ahead-Werte)</span>
                </li>
                <li className="flex gap-2.5">
                  <Clock aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ink-400" />
                  <span>
                    Datenstand: {tagLang(jetzt)}, {uhr(jetzt)} Uhr · Aktualisierung alle 5 Minuten · Preise netto in ct/kWh (1 €/MWh = 0,1 ct/kWh) ·
                    Jahreswerte (negative Stunden, Durchschnittspreise): eigene Auswertung der Stundenmittel
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-[13px] text-ink-500">Alle Angaben ohne Gewähr. Keine Anlage- oder Tarifberatung.</p>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Abschluss
        links={[
          { href: "/service/stromtarif", art: "Service", titel: "Dynamischer Stromtarif in Österreich" },
          { href: "/service/direktvermarktung", art: "Service", titel: "Reststromvermarktung" },
          { href: "/rechner/dynamischer-stromtarif", art: "Rechner", titel: "Dynamischer-Tarif-Rechner" },
          { href: "/technik/parkregler", art: "Technik", titel: "Parkregler (EZA-Regler)" },
        ]}
      />
      <CtaBand
        eyebrow="Unabhängig vom Börsenpreis"
        title="Machen Sie sich Ihren Strompreis selbst."
        text="Mit Photovoltaik, Speicher und steuerbaren Verbrauchern nutzen Sie eigenen Solarstrom – egal, was die Börse gerade macht. Wir planen Ihre Anlage ehrlich durchgerechnet, in ganz Österreich."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Dynamischen Tarif berechnen", href: "/rechner/dynamischer-stromtarif" }}
      />
    </div>
  );
}
