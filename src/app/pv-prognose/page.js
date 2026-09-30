// src/app/pv-prognose/page.js
//
// PV-Prognose (Masterplan #14): stündliche Ertragsprognose für rund 60 Stunden aus offenen
// Vorhersagedaten von GeoSphere Austria (C-LAEF AlpeAdria, nwp-v2 und ensemble-v2, CC BY 4.0),
// kombiniert mit den Day-Ahead-Preisen der Gebotszone AT („Goldene Stunden“).
// Werkzeug: src/components/Prognose/PvPrognose.js · Daten: /api/pv-prognose · Modell: src/lib/prognose/*
// SEO-Plan M12 (30.09.2026): Datensätze im Schema mit description, license und Methodik.

import Link from "next/link";
import { ArrowUpRight, BatteryCharging, Calculator, CloudSun, Cpu, Database, Info, PlugZap, Snowflake, Sun, Thermometer, Wind } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { Bildnachweis } from "@/components/Loesungen/Bausteine";
import FachTabs from "@/components/Loesungen/B/FachTabs";
import DunkelSektion from "@/components/Loesungen/B/DunkelSektion";
import PvPrognose from "@/components/Prognose/PvPrognose";
import { BASE_URL } from "@/lib/site";

const PFAD = "/pv-prognose";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "PV-Prognose Österreich: Solarertrag stündlich | Ökovolt";
const BESCHREIBUNG =
  "Stündliche PV-Prognose für rund 60 Stunden an Ihrer Adresse in Österreich: Wetterdaten von GeoSphere Austria, Unsicherheitsband und günstigste Börsenstunden.";
const BILD = "/Images/AT/loesungen-b/speicher-industriedach-pv.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["PV-Prognose", "Photovoltaik Ertragsprognose", "Solarprognose Österreich", "PV Vorhersage morgen", "Solarstrom Prognose", "GeoSphere Austria Globalstrahlung"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}${BILD}`, width: 1920, height: 1440, alt: "Luftbild eines Industriedachs mit Photovoltaikanlage" }],
  },
};

const DATENSAETZE = [
  {
    name: "C-LAEF AlpeAdria deterministisch (nwp-v2-1h-1km)",
    url: "https://data.hub.geosphere.at/dataset/nwp-v2-1h-1km",
    doi: "https://doi.org/10.60669/rv80-9d61",
    beschreibung: "Deterministische Wettervorhersage des Modells C-LAEF AlpeAdria von GeoSphere Austria im 1-km-Raster, stündlich, rund 60 Stunden voraus, alle drei Stunden neu gerechnet – u. a. Globalstrahlung und Lufttemperatur.",
  },
  {
    name: "C-LAEF AlpeAdria Ensemble (ensemble-v2-1h-1km)",
    url: "https://data.hub.geosphere.at/dataset/ensemble-v2-1h-1km",
    doi: "https://doi.org/10.60669/f21y-5007",
    beschreibung: "Ensemblevorhersage C-LAEF AlpeAdria von GeoSphere Austria (16 Member und ein Kontrolllauf) im 1-km-Raster, stündlich; verwendet als Perzentile 10, 50 und 90 für das Unsicherheitsband.",
  },
];

const FAQ = [
  {
    q: "Wie genau ist die PV-Prognose?",
    a: "So genau wie die Wettervorhersage für Ihren Standort – und die schwankt mit der Wetterlage. Bei stabilem Hochdruck liegen Prognose und Ertrag meist nah beieinander, bei Hochnebel im Alpenvorland, Föhn oder Gewittern im Sommer deutlich weniger. Deshalb zeigen wir zusätzlich das Unsicherheitsband aus der Ensemblevorhersage von GeoSphere Austria: Ist es breit, sind sich die 17 Modellläufe uneinig. Die Rechnung ist eine Prognose ohne Gewähr und ersetzt keine Anlagensimulation.",
  },
  {
    q: "Woher stammen die Wetterdaten?",
    a: "Aus dem Data Hub von GeoSphere Austria, der Bundesanstalt für Geologie, Geophysik, Klimatologie und Meteorologie. Wir verwenden das Wettermodell C-LAEF AlpeAdria im 1-km-Raster: den deterministischen Kontrolllauf (Datensatz nwp-v2-1h-1km) für die Hauptprognose und die Ensemblevorhersage (ensemble-v2-1h-1km, 16 Member und ein Kontrolllauf, Perzentile 10, 50 und 90) für das Unsicherheitsband. Beide Datensätze stehen unter der Lizenz CC BY 4.0. Datenquelle: GeoSphere Austria - https://data.hub.geosphere.at",
  },
  {
    q: "Was sind Goldene Stunden?",
    a: "Unter den Stunden, in denen Ihre Anlage mindestens 60 % ihrer Tagesspitze liefert, markieren wir die drei mit dem niedrigsten Day-Ahead-Preis der Gebotszone AT. In diesen Stunden bringt eingespeister Strom am wenigsten – es lohnt sich am meisten, ihn selbst zu nutzen: Kühlung und Druckluft vorziehen, Fahrzeuge laden, Warmwasser bereiten oder den Speicher füllen. Ist der Börsenpreis für einen Tag noch nicht veröffentlicht, wählen wir nur nach der Menge an Sonnenstrom.",
  },
  {
    q: "Wie oft wird die Prognose aktualisiert?",
    a: "GeoSphere Austria rechnet das Modell alle drei Stunden neu, die Vorhersage reicht jeweils 60 Stunden voraus. Wir holen für jede Rasterzelle höchstens einmal je Modelllauf neue Daten. Die Day-Ahead-Preise für den Folgetag stehen nach der Auktion zu Mittag fest – vormittags zeigt die Prognose deshalb für morgen noch keine Preise.",
  },
  {
    q: "Warum weicht die Prognose von meinem Monitoring ab?",
    a: "Weil das Modell nur Wetter, Sonnenstand, Neigung, Ausrichtung und pauschale Verluste kennt. Nicht enthalten sind Verschattung durch Nachbargebäude, Bäume oder Berge, Schnee und Verschmutzung auf den Modulen, Abregelung durch den Netzbetreiber oder bei negativen Preisen, die Wechselrichtergrenze und die Eigenschaften Ihrer Module. Außerdem rechnen wir mit dem Wetter einer Rasterzelle von 0,05 Grad – im Gebirge können wenige Kilometer viel ausmachen.",
  },
  {
    q: "Warum rechnen Sie mit einer Rasterzelle statt mit der genauen Adresse?",
    a: "Damit wir die Nutzungsgrenzen des Data Hub einhalten: Die Schnittstelle erlaubt höchstens 240 Abfragen pro Stunde. Wir fassen deshalb Standorte in Zellen von 0,05 Grad (etwa 5,5 × 3,7 km) zusammen und speichern die Vorhersage je Zelle und Modelllauf zwischen. Den Sonnenstand rechnen wir trotzdem für Ihren genauen Punkt. Ihre Adresse selbst wird dabei nicht an GeoSphere übermittelt.",
  },
  {
    q: "Welche Ausrichtung liefert wann den meisten Strom?",
    a: "Süddächer haben die höchste Mittagsspitze. Ost-West-Anlagen, wie sie auf flachen Hallendächern häufig sind, liefern eine breitere Kurve mit mehr Strom am Morgen und am späten Nachmittag – oft passend zum Verbrauch im Betrieb. Stellen Sie im Werkzeug beide Varianten ein und vergleichen Sie die Kurven und die Goldenen Stunden.",
  },
  {
    q: "Kann ich die Prognose für mein Energiemanagement nutzen?",
    a: "Die Seite ist als Orientierung für Planung und Betrieb gedacht; eine Schnittstelle oder Benachrichtigungen bieten wir derzeit nicht an. Energiemanagementsysteme und Speichersteuerungen arbeiten mit eigenen Prognosen. Welches System zu Ihrem Betrieb passt, klären wir gerne im Gespräch.",
  },
];

const QUELLEN = [
  { name: "GeoSphere Austria: C-LAEF AlpeAdria deterministisch, nwp-v2-1h-1km (CC BY 4.0)", url: DATENSAETZE[0].url },
  { name: "GeoSphere Austria: C-LAEF AlpeAdria Ensemble, ensemble-v2-1h-1km (CC BY 4.0)", url: DATENSAETZE[1].url },
  { name: "GeoSphere Austria Data Hub: Nutzungsbedingungen und Quellenangabe", url: "https://data.hub.geosphere.at/legal" },
  { name: "GeoSphere Dataset-API: Dokumentation", url: "https://dataset.api.hub.geosphere.at/v1/docs/" },
  { name: "Energy-Charts (Fraunhofer ISE): Day-Ahead-Preise Gebotszone AT (CC BY 4.0)", url: "https://www.energy-charts.info/" },
  { name: "NOAA: General Solar Position Calculations", url: "https://gml.noaa.gov/grad/solcalc/solareqns.PDF" },
  { name: "OpenStreetMap Nominatim (ODbL) – Adresssuche", url: "https://nominatim.org/" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${PAGE_URL}/#app`,
      name: "Ökovolt PV-Prognose",
      url: PAGE_URL,
      description:
        "Stündliche Ertragsprognose für Photovoltaikanlagen in Österreich über rund 60 Stunden aus der Wettervorhersage C-LAEF AlpeAdria von GeoSphere Austria, mit Unsicherheitsband aus der Ensemblevorhersage und Goldenen Stunden nach Day-Ahead-Preis der Gebotszone AT.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      inLanguage: "de-AT",
      isAccessibleForFree: true,
      featureList: [
        "Adresssuche oder Koordinateneingabe in Österreich",
        "Stündliche PV-Leistung für rund 60 Stunden",
        "Transposition auf Modulebene (Hay-Davies oder isotrop)",
        "Modultemperatur und Systemverluste",
        "Unsicherheitsband aus Ensemble-Perzentilen P10 und P90",
        "Goldene Stunden nach Day-Ahead-Preis der Gebotszone AT",
        "Ost-West-Anlagen",
      ],
      isBasedOn: DATENSAETZE.map((d) => ({
        "@type": "Dataset",
        name: d.name,
        description: d.beschreibung,
        url: d.url,
        identifier: d.doi,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: { "@type": "Organization", name: "GeoSphere Austria", url: "https://www.geosphere.at/" },
      })),
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}/#webpage`,
      url: PAGE_URL,
      name: TITEL,
      description: BESCHREIBUNG,
      inLanguage: "de-AT",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": `${BASE_URL}/#organization` },
      mainEntity: { "@id": `${PAGE_URL}/#app` },
    },
  ],
};

const NUTZUNG = [
  { icon: Thermometer, titel: "Kühlung & Prozesswärme", text: "Kühlhäuser vorkühlen, Warmwasser und Prozesswärme in die Sonnenstunden legen – Masse speichert Energie." },
  { icon: Wind, titel: "Druckluft & Maschinen", text: "Kompressoren, Pumpen und verschiebbare Fertigungsschritte in die Stunden mit dem meisten Solarstrom planen." },
  { icon: PlugZap, titel: "Ladepunkte", text: "Firmenfahrzeuge mittags laden statt abends – mit Lastmanagement ohne neue Spitze am Netzanschluss." },
  { icon: BatteryCharging, titel: "Speicher", text: "Den Speicher gezielt in günstigen Stunden füllen und für die teuren Abendstunden bereithalten." },
];

const WEITER = [
  { href: "/energie-live", titel: "Strommarkt Österreich live", text: "Day-Ahead-Preis der Gebotszone AT und Strommix in Echtzeit." },
  { href: "/standort-check", titel: "Standort-Check", text: "Jahresertrag mit PVGIS, Schneelast und Hagel für Ihre Adresse." },
  { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Überschüsse vom Mittag in Abend und Nachtschicht verschieben." },
  { href: "/rechner/dynamischer-stromtarif", titel: "Rechner dynamischer Stromtarif", text: "Ob sich ein Börsentarif für Ihren Verbrauch lohnt." },
];

function Formel({ children }) {
  return <p className="ov-num overflow-x-auto rounded-xl bg-sand-50 px-4 py-3 font-mono text-[13.5px] text-ink-800 ring-1 ring-ink-200/70">{children}</p>;
}

export default function PvPrognosePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Rechner & Tools", href: "/rechner" }, { name: "PV-Prognose" }]}
        eyebrow="PV-Prognose mit Daten von GeoSphere Austria"
        title={
          <>
            PV-Prognose: <span className="ov-text-gradient-light">Ihr Solarstrom der nächsten 60 Stunden</span>
          </>
        }
        lead="Stunde für Stunde, für Ihre Adresse in Österreich: wie viel Ihre Photovoltaikanlage voraussichtlich liefert, wie sicher die Vorhersage ist – und in welchen Stunden sich Eigenverbrauch am meisten lohnt."
        image={{ src: BILD, alt: "Luftbild eines Industriedachs mit großer Photovoltaikanlage", position: "50% 50%" }}
        points={["Wettermodell im 1-km-Raster", "Unsicherheitsband aus 17 Modellläufen", "Mit Börsenpreisen der Gebotszone AT"]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-40"
      />

      <section aria-label="PV-Prognose" id="werkzeug" className="relative z-10 -mt-20 scroll-mt-24 pb-6 md:-mt-28 md:pb-10">
        <div className="ov-container">
          <PvPrognose />
          <p className="mt-4 px-2 text-[12.5px] leading-relaxed text-ink-500">
            <strong className="text-ink-700">Prognose ohne Gewähr.</strong> Datenquelle: GeoSphere Austria - https://data.hub.geosphere.at (CC BY 4.0), Leistung eigene Berechnung. Day-Ahead-Preise:
            Energy-Charts (Fraunhofer ISE, CC BY 4.0), ersatzweise aWATTar Österreich.
          </p>
        </div>
      </section>

      <Section tone="white" space="md">
        <SectionHeading
          eyebrow="So entsteht die Prognose"
          title="Vom Wettermodell zur Leistung auf Ihrem Dach"
          lead="Die Vorhersage liefert Globalstrahlung und Temperatur je Stunde. Daraus rechnen wir in vier Schritten, was auf Ihren Modulen ankommt – direkt im Browser, damit jede Änderung an Leistung, Neigung und Ausrichtung sofort sichtbar ist."
          className="mb-12"
        />
        <Steps
          cols={4}
          items={[
            { icon: CloudSun, title: "Wettervorhersage", text: "C-LAEF AlpeAdria von GeoSphere Austria: Globalstrahlung und Temperatur im 1-km-Raster, alle drei Stunden neu, 60 Stunden voraus." },
            { icon: Sun, title: "Sonnenstand & Aufteilung", text: "Sonnenstand für jede Minute der Stunde, Aufteilung der Strahlung in direkt und diffus nach Erbs." },
            { icon: Calculator, title: "Modulebene", text: "Umrechnung auf Neigung und Ausrichtung – wahlweise isotrop oder mit Zirkumsolaranteil nach Hay-Davies, plus Bodenreflexion." },
            { icon: Cpu, title: "Leistung", text: "Modultemperatur je Montageart, Temperaturverlust, Systemverluste – ergibt die mittlere Leistung jeder Stunde." },
          ]}
        />
      </Section>

      <DunkelSektion
        id="goldene-stunden"
        eyebrow="Goldene Stunden"
        title="Solarstrom dann nutzen, wenn er am wenigsten wert ist"
        lead="An sonnigen Tagen fällt der Börsenpreis zur Mittagszeit oft stark, an manchen Tagen unter null. Wer dann selbst verbraucht, statt einzuspeisen, holt aus jeder Kilowattstunde am meisten heraus. Die Prognose zeigt, wann das bei Ihnen der Fall sein wird."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NUTZUNG.map((n, i) => (
            <Reveal as="li" key={n.titel} delay={i * 90} className="ov-glass rounded-3xl p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sun-400/15 text-sun-300 ring-1 ring-sun-400/30">
                <n.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-[18px] font-bold text-white">{n.titel}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{n.text}</p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-[14.5px] leading-relaxed text-white/60">
          Börsenpreise sind Nettopreise für die Energie; auf der Stromrechnung kommen Netzentgelte, Abgaben und Umsatzsteuer hinzu. Den aktuellen Verlauf zeigt{" "}
          <Link href="/energie-live" className="font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-2 hover:text-white">
            Strommarkt Österreich live
          </Link>
          .
        </p>
      </DunkelSektion>

      <Section tone="white" space="md" id="fachwissen" className="scroll-mt-24">
        <SectionHeading eyebrow="Für Technik & Einkauf" title="Modell, Daten und Grenzen" className="mb-10" />
        <FachTabs
          tabs={[
            {
              id: "modell",
              label: "Rechenmodell",
              icon: <Calculator />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                  <div>
                    <h3 className="ov-h3 text-ink-900">Die Formeln hinter der Kurve</h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
                      Alle Schritte sind einfache, veröffentlichte Standardmodelle. Wir haben sie mit Handrechnungen und bekannten Sonnenständen getestet.
                    </p>
                  </div>
                  <div className="space-y-4 text-[15px] leading-relaxed text-ink-700">
                    <p>
                      <strong className="text-ink-900">Zeitbezug:</strong> Die Strahlungswerte von GeoSphere sind Mittelwerte über die Stunde vor dem Zeitstempel. Den Sonnenstand mitteln wir deshalb über zwölf Zeitpunkte
                      innerhalb dieser Stunde (Verfahren der NOAA).
                    </p>
                    <p>
                      <strong className="text-ink-900">Aufteilung (Erbs):</strong> Aus dem Klarheitsindex k<sub>t</sub> = G<sub>h</sub> / G<sub>0h</sub> folgt der Diffusanteil k<sub>d</sub>; direkt horizontal ist
                      B<sub>h</sub> = G<sub>h</sub> − D<sub>h</sub>.
                    </p>
                    <Formel>G_Modul = B_h · R_b + D_h · [A_i · R_b + (1 − A_i) · (1 + cos β) / 2] + G_h · ρ · (1 − cos β) / 2</Formel>
                    <p>
                      Hay-Davies mit Anisotropie-Index A<sub>i</sub> = B<sub>h</sub> / G<sub>0h</sub>; beim isotropen Modell ist A<sub>i</sub> = 0. Bodenreflexion ρ = 0,2.
                    </p>
                    <Formel>T_Modul = T_Luft + k · G_Modul</Formel>
                    <Formel>P = kWp · G_Modul / 1000 · (1 + γ · (T_Modul − 25 °C)) · (1 − Verluste)</Formel>
                    <p>
                      Ross-Koeffizient k = 0,0208 (Freifläche), 0,026 (Aufdach) oder 0,0342 K·m²/W (Indach) nach Skoplaki & Palyvos (2009); γ = −0,35 %/K als typischer Wert kristalliner Module; Systemverluste
                      standardmäßig 14 % wie bei PVGIS. Die Leistung ist auf die Modulleistung begrenzt. Ost-West-Anlagen rechnen wir als zwei Hälften.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              id: "daten",
              label: "Daten & Lizenz",
              icon: <Database />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                  <div>
                    <h3 className="ov-h3 text-ink-900">Offene Daten, sparsam abgefragt</h3>
                  </div>
                  <div className="ov-prose">
                    <p>
                      Die Wetterdaten stammen aus dem Modell <strong>C-LAEF AlpeAdria</strong> (Convection-Permitting Limited-Area Ensemble Forecasting) von GeoSphere Austria: 1-km-Raster, stündliche Werte, neuer Lauf
                      alle drei Stunden, 60 Stunden Vorhersage. Für das Unsicherheitsband nutzen wir die Ensemble-Statistik aus 16 Membern und einem Kontrolllauf – über die Schnittstelle sind die Perzentile 10, 50 und 90
                      abrufbar. Die älteren Datensätze im 2,5-km-Raster stellt GeoSphere am 4. November 2026 ein; wir verwenden bereits die Version 2.
                    </p>
                    <p>
                      Beide Datensätze stehen unter <a href="https://creativecommons.org/licenses/by/4.0/deed.de" target="_blank" rel="noopener noreferrer license">CC BY 4.0</a>. Die Schnittstelle erlaubt höchstens
                      5 Abfragen pro Sekunde und 240 pro Stunde. Wir bleiben mit einem zentralen Zähler darunter, speichern jede Rasterzelle je Modelllauf zwischen und antworten im Zweifel aus dem Zwischenspeicher.
                    </p>
                    <ul>
                      {DATENSAETZE.map((d) => (
                        <li key={d.url}>
                          <a href={d.url} target="_blank" rel="noopener noreferrer">
                            {d.name}
                          </a>{" "}
                          · DOI{" "}
                          <a href={d.doi} target="_blank" rel="noopener noreferrer">
                            {d.doi.replace("https://doi.org/", "")}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p>
                      <strong>Datenquelle: GeoSphere Austria - https://data.hub.geosphere.at</strong> · Stand der Angaben: 30.09.2026, geprüft über die Metadaten der Schnittstelle.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              id: "grenzen",
              label: "Grenzen & Quellen",
              icon: <Info />,
              inhalt: (
                <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/70 md:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200">
                      <Snowflake aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-[19px] font-bold text-ink-900">Was die Prognose nicht weiß</h3>
                      <p className="text-[12.5px] text-ink-500">Stand September 2026 · Prognose ohne Gewähr</p>
                    </div>
                  </div>
                  <ul className="mt-5 grid gap-x-8 gap-y-2 text-[14px] leading-relaxed text-ink-700 md:grid-cols-2">
                    <li>Verschattung durch Gebäude, Bäume und Gelände</li>
                    <li>Schnee, Reif und Verschmutzung auf den Modulen</li>
                    <li>Abregelung durch Netzbetreiber, Direktvermarkter oder bei negativen Preisen</li>
                    <li>Wechselrichtergrenze, Moduldaten und Alterung Ihrer Anlage</li>
                    <li>Wetter innerhalb der Rasterzelle von 0,05° (Gebirge, Talnebel)</li>
                    <li>Die Spanne P10–P90 gilt je Stunde, nicht für die Tagessumme</li>
                  </ul>
                  <h4 className="mt-7 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Quellen</h4>
                  <ul className="mt-3 grid gap-x-8 gap-y-2 text-[13.5px] leading-relaxed text-ink-600 md:grid-cols-2">
                    {QUELLEN.map((q) => (
                      <li key={q.url}>
                        <a href={q.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
                          {q.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-[12.5px] leading-relaxed text-ink-500">
                    Modelle: Erbs, Klein & Duffie (1982), Solar Energy 28; Hay & Davies (1980); Liu & Jordan (1963), Solar Energy 7; Skoplaki & Palyvos (2009), Renewable Energy 34. Adresssuche: © OpenStreetMap-Mitwirkende
                    (ODbL). Abgerufen am 30.09.2026.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="PV-Prognose: Fragen & Antworten" lead="Ihre Frage ist nicht dabei? Wir rechnen Ihre Anlage gerne mit Ihrem Lastprofil durch." />
            <nav aria-labelledby="prognose-weiter-titel" className="mt-10">
              <h2 id="prognose-weiter-titel" className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">
                Weiterlesen: Ertrag, Preise & Speicher
              </h2>
              <ul className="mt-4 divide-y divide-ink-200 border-y border-ink-200">
                {WEITER.map((v) => (
                  <li key={v.href}>
                    <Link href={v.href} className="group flex items-start justify-between gap-4 py-4">
                      <span>
                        <span className="block font-display text-[16px] font-bold text-ink-900 transition-colors group-hover:text-ov-700">{v.titel}</span>
                        <span className="mt-0.5 block text-[13.5px] leading-relaxed text-ink-500">{v.text}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ink-300 transition-all duration-300 group-hover:rotate-45 group-hover:text-ov-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />

      <CtaBand
        eyebrow="Eigenverbrauch planen"
        title="Aus der Prognose wird ein Plan für Ihren Betrieb."
        text="Anlage, Speicher und Lastmanagement passend zu Ihrem Lastprofil: Wir rechnen mit Ihren Verbrauchsdaten, nicht mit Durchschnittswerten – vom Hallendach bis zur Freifläche."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Standort prüfen", href: "/standort-check", icon: Sun }}
      />

      <Bildnachweis items={[{ motiv: "Industriedach mit PV", urheber: "Giant Asparagus", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/aerial-view-of-rooftop-solar-panel-installation-35691079/" }]} />
    </div>
  );
}
