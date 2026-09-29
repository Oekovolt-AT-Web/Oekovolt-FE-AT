// src/app/standort-check/page.js
//
// Standort-Check Photovoltaik: Schneelast (eHORA), Wind, Hagel und Ertrag (PVGIS) für einen
// Punkt in Österreich. Das Werkzeug ist eine Client-Komponente; diese Seite liefert Rahmen,
// Erklärtexte (SEO/GEO), FAQ und strukturierte Daten.

import Link from "next/link";
import { ArrowUpRight, Calculator, Info, MapPin, Mountain, Snowflake, Wind } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import StandortCheck from "@/components/StandortCheck/StandortCheck";
import { Bildnachweis } from "@/components/Loesungen/Bausteine";
import FotoBento from "@/components/Loesungen/B/FotoBento";
import FachTabs from "@/components/Loesungen/B/FachTabs";
import DunkelSektion from "@/components/Loesungen/B/DunkelSektion";
import { BASE_URL } from "@/lib/site";

const PFAD = "/standort-check";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Standort-Check PV: Schneelast, Hagel & Ertrag | Ökovolt";
const BESCHREIBUNG =
  "Schneelast nach ÖNORM B 1991-1-3 aus eHORA, Wind, Hagel und PV-Ertrag (PVGIS) für Ihre Adresse in Österreich – mit Bewertung von Modulen und Unterkonstruktion.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/Images/AT/loesungen-b/standort-berghuette-pv.jpg`, width: 1920, height: 1279, alt: "Berghütte mit Photovoltaik in verschneiter Alpenlandschaft" }],
  },
};

const FAQ = [
  {
    q: "Woher stammt die Schneelast im Standort-Check?",
    a: "Die charakteristische Schneelast sₖ lesen Sie selbst in eHORA (hora.gv.at) ab – der Check öffnet die Schneelastkarte genau an Ihrem Standort. HORA ist die Naturgefahrenplattform des Landwirtschaftsministeriums (BMLUK) und enthält die Schneelastkarte der ÖNORM B 1991-1-3:2022. Eine automatische Abfrage bieten wir bewusst nicht an, weil HORA das automatisierte Herunterladen seiner Daten untersagt.",
  },
  {
    q: "Gibt es in Österreich noch Schneelastzonen?",
    a: "Nein. Seit der ÖNORM B 1991-1-3 vom 15. Mai 2022 gibt es keine Schneelastzonen und keine Zonenformel mehr. Die Schneelast wird für jeden Punkt aus einer Karte im Raster von 50 × 50 m abgelesen, die bis 2.000 m Seehöhe gilt. Die frühere Einteilung in die Zonen 2*, 2, 3 und 4 mit Seehöhenformel findet man nur noch in älteren Einreichunterlagen.",
  },
  {
    q: "Was bedeutet eine Modul-Prüflast von 5400 Pa?",
    a: "Das Modul hat im Labor nach IEC 61215 eine Drucklast von 5400 Pa (5,4 kN/m²) ohne Schaden überstanden. Die Norm verlangt zwischen Prüf- und Bemessungslast einen Sicherheitsfaktor von mindestens 1,5 – für die Planung stehen also 3600 Pa zur Verfügung. Diesen Wert vergleichen wir mit der Schneelast je Modulfläche, multipliziert mit dem Sicherheitsbeiwert 1,5.",
  },
  {
    q: "Ersetzt der Standort-Check eine Statik?",
    a: "Nein. Der Check ist eine Vorabschätzung für die Planung. Ob Dachstuhl, Unterkonstruktion, Module und Schneefang die Lasten sicher tragen, bestätigt eine befugte Tragwerksplanung auf Basis der Normen-Standortabfrage aus HORA und der Herstellerangaben.",
  },
  {
    q: "Wie genau ist der berechnete Solarertrag?",
    a: "Der Ertrag stammt aus PVGIS 5.3 der EU-Kommission mit Strahlungsdaten der Jahre 2005 bis 2023, gerechnet für 1 kWp mit 14 % Systemverlusten und dem Geländehorizont am Standort. Nicht enthalten sind Schneebedeckung der Module und Verschattung durch Nachbargebäude oder Bäume. Für ein Angebot rechnen wir mit Ihrem Dach, Ihren Modulen und Ihrem Verbrauch.",
  },
  {
    q: "Was gilt für Standorte über 2.000 m Seehöhe?",
    a: "Die Schneelastkarte der ÖNORM B 1991-1-3:2022 reicht bis 2.000 m Seehöhe. Darüber steigt die Unsicherheit deutlich – für Hütten und Gebäude im Hochgebirge ist ein eigenes Schneelastgutachten sinnvoll, das wir mit einem Tragwerksplaner abstimmen.",
  },
  {
    q: "Welche Hagelwiderstandsklasse brauchen PV-Module?",
    a: "Das hängt von der Hagelgefährdung am Standort ab, die HORA als Hagelkorngröße für Wiederkehrperioden von 10, 20 und 30 Jahren zeigt. Im österreichischen Hagelregister sind Bauteile in die Klassen HW 1 bis HW 5 eingestuft – geprüft mit Eiskugeln von 1 bis 5 cm Durchmesser. Wir empfehlen mindestens die Klasse, die der 30-jährlichen Korngröße entspricht.",
  },
];

const QUELLEN = [
  { name: "HORA – Natural Hazard Overview & Risk Assessment Austria (BMLUK)", url: "https://hora.gv.at/" },
  { name: "Holzbau Austria: Neue Schneelastnorm veröffentlicht (2022)", url: "https://www.holzbauaustria.at/technik/2022/07/neue-schneelastnorm-veroeffentlicht.html" },
  { name: "Holzbau Austria: Im Schnitt 80 Kilo weniger (2021)", url: "https://www.holzbauaustria.at/technik/2021/11/im-schnitt-80-kilo-weniger-.html" },
  { name: "Hagelregister (Elementarschaden Präventionszentrum)", url: "https://www.hagelregister.at/" },
  { name: "PVGIS 5.3 – Joint Research Centre der EU-Kommission", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/" },
  { name: "basemap.at – Verwaltungsgrundkarte Österreich (CC BY 4.0)", url: "https://www.basemap.at/" },
  { name: "OpenStreetMap Nominatim (ODbL)", url: "https://nominatim.org/" },
  { name: "Open Topo Data, EU-DEM 25 m (Copernicus)", url: "https://www.opentopodata.org/datasets/eudem/" },
  { name: "ÖNORM EN 1991-1-3, ÖNORM B 1991-1-3:2022, ÖNORM B 1991-1-4, IEC 61215-2:2021", url: "https://www.austrian-standards.at/" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${PAGE_URL}/#app`,
      name: "Ökovolt Standort-Check Photovoltaik",
      url: PAGE_URL,
      description:
        "Ermittelt für einen Standort in Österreich Seehöhe und spezifischen PV-Ertrag (PVGIS), verlinkt die eHORA-Karten für Schneelast, Wind, Hagel und Erdbeben und bewertet die Schneelast nach ÖNORM B 1991-1-3 gegen die Prüflasten von PV-Modulen.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      inLanguage: "de-AT",
      isAccessibleForFree: true,
      featureList: [
        "Adresssuche und Kartenauswahl in Österreich",
        "Direktlink auf die eHORA-Schneelastkarte am Standort",
        "Dachschneelast s = μ1 · Ce · Ct · sk",
        "Vergleich mit Modul-Prüflasten 2400, 5400 und 8100 Pa",
        "Kraft auf den Schneefang",
        "Basisgeschwindigkeitsdruck Wind",
        "Hagelwiderstandsklasse",
        "Spezifischer Ertrag mit PVGIS",
      ],
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

const MU_TABELLE = [
  ["0° bis 30°", "0,8", "Schnee bleibt liegen – volle Last"],
  ["45°", "0,4", "Schnee rutscht teilweise ab"],
  ["60° und steiler", "0", "Schnee rutscht ab"],
  ["mit Schneefang, jede Neigung", "mind. 0,8", "Schnee wird zurückgehalten"],
];

const NORMSTAND = [
  ["ÖNORM B 4013 (1983)", "Lastzonen A–D, Formel mit Seehöhe", "historisch"],
  ["ÖNORM B 1991-1-3 (2006/2018)", "Zonen 2*, 2, 3, 4 · sₖ = (0,642 · Z + 0,009) · [1 + (A/728)²] · bis 1.500 m", "ersetzt"],
  ["ÖNORM B 1991-1-3:2022-05-15", "Schneelastkarte im 50-m-Raster, sₖ direkt je Standort · bis 2.000 m · in HORA", "gültig"],
];

const WEITER = [
  { href: "/chalets", titel: "Photovoltaik für Luxus-Chalets", text: "Indach, Hochlastmodule, Schneefang und Concierge-Wartung für alpine Premium-Immobilien." },
  { href: "/ratgeber/schneelast-photovoltaik", titel: "Ratgeber Schneelast & Photovoltaik", text: "ÖNORM B 1991-1-3, eHORA und Modul-Prüflasten ausführlich erklärt." },
  { href: "/ratgeber/hagel-photovoltaik", titel: "Ratgeber Hagel & Photovoltaik", text: "Hagelwiderstandsklassen, Hagelregister und Versicherung." },
  { href: "/gewerbe", titel: "Photovoltaik für Gewerbe & Industrie", text: "Hallendächer mit großen Spannweiten – Schneelast und Statik früh klären." },
  { href: "/freiflaechen-photovoltaik", titel: "Freiflächen-Photovoltaik", text: "Solarparks mit Unterkonstruktion für Schnee- und Windlasten am Standort." },
];

function NormTabellen() {
  return (
    <div className="grid gap-6">
      <div className="overflow-hidden rounded-3xl bg-white/[0.05] ring-1 ring-white/10">
        <table className="w-full text-left text-[14.5px]">
          <caption className="px-5 pt-5 text-left font-display text-[17px] font-bold text-white">Formbeiwert μ₁ nach Dachneigung</caption>
          <thead>
            <tr className="border-b border-white/10 text-[12.5px] uppercase tracking-wider text-white/50">
              <th scope="col" className="px-5 py-3 font-semibold">Neigung</th>
              <th scope="col" className="px-3 py-3 font-semibold">μ₁</th>
              <th scope="col" className="px-5 py-3 font-semibold">Bedeutung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {MU_TABELLE.map(([n, m, b]) => (
              <tr key={n}>
                <th scope="row" className="px-5 py-3 font-semibold text-white">{n}</th>
                <td className="ov-num px-3 py-3 font-display text-[16px] font-bold text-ov-300">{m}</td>
                <td className="px-5 py-3 text-white/65">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-5 pb-5 pt-2 text-[12.5px] text-white/45">Zwischen 30° und 60° linear: μ₁ = 0,8 · (60° − α) / 30°. Quelle: ÖNORM EN 1991-1-3, Tabelle 5.2.</p>
      </div>
      <div className="overflow-hidden rounded-3xl bg-white/[0.05] ring-1 ring-white/10">
        <table className="w-full text-left text-[14px]">
          <caption className="px-5 pt-5 text-left font-display text-[17px] font-bold text-white">Schneelastnormen in Österreich</caption>
          <tbody className="divide-y divide-white/10">
            {NORMSTAND.map(([n, i, s]) => (
              <tr key={n}>
                <th scope="row" className="w-[36%] px-5 py-3.5 align-top font-semibold text-white">{n}</th>
                <td className="px-3 py-3.5 align-top text-white/65">{i}</td>
                <td className="px-5 py-3.5 align-top">
                  <span className={s === "gültig" ? "rounded-full bg-ov-500/20 px-2 py-0.5 text-[12px] font-semibold text-ov-300 ring-1 ring-ov-400/40" : "rounded-full bg-white/10 px-2 py-0.5 text-[12px] font-semibold text-white/60"}>{s}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function StandortCheckPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Rechner & Tools", href: "/rechner" }, { name: "Standort-Check" }]}
        eyebrow="Standort-Check mit eHORA"
        title={
          <>
            Standort-Check Photovoltaik: <span className="ov-text-gradient-light">Schneelast, Wind, Hagel & Ertrag</span>
          </>
        }
        lead="Für jede Adresse in Österreich: Seehöhe und Solarertrag automatisch, die Normwerte aus eHORA per Direktlink – und eine klare Bewertung, welche Module, welche Unterkonstruktion und welcher Schneefang zu Ihrem Dach passen."
        image={{ src: "/Images/AT/loesungen-b/standort-berghuette-pv.jpg", alt: "Berghütte mit Photovoltaikmodulen an der Fassade in verschneiter Alpenlandschaft", position: "60% 60%" }}
        points={["Kostenlos & ohne Anmeldung", "ÖNORM B 1991-1-3:2022", "Ertrag mit PVGIS"]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-40"
      />

      <section aria-label="Standort-Check" id="werkzeug" className="relative z-10 -mt-20 scroll-mt-24 pb-6 md:-mt-28 md:pb-10">
        <div className="ov-container">
          <StandortCheck />
        </div>
      </section>

      <Section tone="white" space="md">
        <SectionHeading
          eyebrow="So funktioniert der Check"
          title="In drei Schritten von der Adresse zur Modulempfehlung"
          lead="Der Standort-Check verbindet frei verfügbare Daten mit den Normwerten aus eHORA. Rechnen, was sich sicher rechnen lässt – und für den Rest direkt auf die amtliche Quelle verweisen."
          className="mb-12"
        />
        <Steps
          cols={3}
          items={[
            { icon: MapPin, title: "Standort wählen", text: "Adresse suchen oder das Dach im Orthofoto anklicken. Wir ermitteln die Seehöhe (EU-DEM 25 m) und rechnen den Ertrag mit PVGIS – optimal und für Ihre Dachneigung." },
            { icon: Mountain, title: "eHORA-Werte übernehmen", text: "Der Link öffnet die HORA-Karte am Punkt samt Info-Fenster. Dort stehen die Schneelast sₖ, die Basiswindgeschwindigkeit und die Hagelkorngröße." },
            { icon: Snowflake, title: "Bewertung lesen", text: "Dachschneelast, Last je Modul und Auslastung von Modulen mit 2400, 5400 und 8100 Pa Prüflast – dazu Empfehlungen für Unterkonstruktion und Schneefang." },
          ]}
        />
        <FotoBento
          className="mt-16 md:mt-20"
          items={[
            { bild: "/Images/AT/chalets/chalets-schneelast-luftbild.jpg", alt: "Luftbild tief verschneiter Chalets mit hohen Schneedecken auf den Dächern", tag: "Schnee", titel: "Schneelast je Grundstück", text: "Seit 2022 gilt eine Karte im 50-m-Raster statt Schneelastzonen – der Wert für Ihre Adresse steht in eHORA.", href: "#schneelast" },
            { bild: "/Images/AT/loesungen-b/standort-schneedach-pv.jpg", alt: "Schneebedecktes Hausdach mit Photovoltaikmodulen bei starkem Schneefall", titel: "Module & Unterkonstruktion", text: "Prüflast laut Datenblatt geteilt durch 1,5 – verglichen mit der Last je Modulfläche." },
            { bild: "/Images/AT/loesungen/tourismus-seilbahn-pv-fassade.jpg", alt: "Bergstation einer Seilbahn mit Photovoltaik-Fassade", titel: "Wind & Hagel", text: "Basisgeschwindigkeitsdruck nach ÖNORM B 1991-1-4 und Hagelwiderstandsklasse HW 1–5.", href: "#fachwissen" },
          ]}
        />
      </Section>

      <DunkelSektion
        id="schneelast"
        eyebrow="Schneelast Österreich"
        title="Schneelastzonen in Österreich – was seit 2022 gilt"
      >
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal className="space-y-5 text-[16px] leading-[1.75] text-white/70">
            <p>
              <strong className="text-white">Österreich hat seit der ÖNORM B 1991-1-3 vom 15. Mai 2022 keine Schneelastzonen mehr.</strong> Die charakteristische Schneelast s<sub>k</sub> wird für jeden Standort aus einer
              Schneelastkarte im Raster von 50 × 50 m abgelesen. Grundlage sind Auswertungen von über 900 Messstationen; die Karte gilt bis 2.000 m Seehöhe und ist über HORA öffentlich zugänglich.
            </p>
            <p>
              Vorher bestimmten Zone und Seehöhe den Wert: s<sub>k</sub> = (0,642 · Z + 0,009) · [1 + (A/728)²] mit Z = 1,6 (Zone 2*), 2, 3 oder 4,5 (Zone 4). Diese Formel war nur bis 1.500 m anwendbar und ergab laut Holzbau
              Austria im Mittel rund 1,16 kN/m² zu hohe Werte. Mit der neuen Karte sinkt die Schneelast an vielen Orten – in einzelnen Lagen steigt sie aber auch. Bestehende Gebäude wurden oft nach dem alten Wert bemessen; für eine
              PV-Nachrüstung zählt die Reserve des Dachstuhls, nicht der neue Kartenwert allein.
            </p>
            <p>
              Aus s<sub>k</sub> wird die <strong className="text-white">Dachschneelast s = μ₁ · Cₑ · Cₜ · s<sub>k</sub></strong> (ÖNORM EN 1991-1-3). Der Formbeiwert μ₁ hängt von der Dachneigung ab; Cₑ und Cₜ sind im Normalfall
              1,0. Wo ein Schneefang das Abrutschen verhindert, bleibt μ₁ bei mindestens 0,8.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <NormTabellen />
          </Reveal>
        </div>
      </DunkelSektion>

      <Section tone="white" space="md" id="fachwissen" className="scroll-mt-24">
        <SectionHeading eyebrow="Fachwissen" title="eHORA, Wind und Hagel – kompakt erklärt" className="mb-10" />
        <FachTabs
          tabs={[
            {
              id: "hora",
              label: "eHORA erklärt",
              icon: <Mountain />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                  <div>
                    <h3 className="ov-h3 text-ink-900">Was HORA zeigt – und wie Sie die Werte richtig ablesen</h3>
                    <Link href="#werkzeug" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                      <MapPin aria-hidden="true" className="h-4 w-4" /> Zurück zum Check
                    </Link>
                  </div>
                  <div className="ov-prose">
                    <p>
                      <strong>HORA (Natural Hazard Overview & Risk Assessment Austria) ist die Naturgefahrenplattform des Bundesministeriums für Land- und Forstwirtschaft, Klima- und Umweltschutz, Regionen und Wasserwirtschaft.</strong>{" "}
                      Neben Hochwasser, Rutschungen und Wetterwarnungen enthält sie Normen-Standortabfragen für Schneelast (ÖNORM B 1991-1-3:2022), Basiswindgeschwindigkeit (ÖNORM B 1991-1-4), Erdbeben (ÖNORM B 1998-1) und Hagel.
                    </p>
                    <p>
                      Klickt man in der Schneelastkarte auf einen Punkt, zeigt das Info-Fenster die Seehöhe, den Normwert <strong>s<sub>k</sub></strong> (50-jährliches Ereignis) sowie s<sub>25</sub> und s<sub>100</sub>. Über dasselbe
                      Fenster lässt sich die Standortabfrage als PDF herunterladen – dieses Dokument braucht auch Ihr Tragwerksplaner.
                    </p>
                    <p>
                      HORA weist ausdrücklich darauf hin, dass die Karten Informationsmaterial und keine amtliche Auskunft sind. Verbindliche Auskünfte erteilt die Baubehörde, meist die Gemeinde. Das automatisierte Herunterladen von
                      HORA-Daten ist untersagt – deshalb verlinkt unser Check die Karte, statt sie im Hintergrund abzufragen.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              id: "wind-hagel",
              label: "Wind & Hagel",
              icon: <Wind />,
              inhalt: (
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                  <div>
                    <h3 className="ov-h3 text-ink-900">Zwei weitere Lasten, die in den Alpen und im Alpenvorland zählen</h3>
                  </div>
                  <div className="ov-prose">
                    <p>
                      <strong>Wind:</strong> Die Basiswindgeschwindigkeit v<sub>b,0</sub> nach ÖNORM B 1991-1-4 ist für jeden Ort in HORA ausgewiesen (mit zugehörigem Referenzort). Daraus folgt der Basisgeschwindigkeitsdruck q
                      <sub>b,0</sub> = ½ · ρ · v<sub>b,0</sub>² mit ρ = 1,25 kg/m³. Auf die Anlage wirken vor allem Sogkräfte an Dachrändern und Ecken; die Unterkonstruktion wird dafür mit der Herstellerstatik bemessen.
                    </p>
                    <p>
                      <strong>Hagel:</strong> HORA zeigt die zu erwartende Hagelkorngröße für 10, 20 und 30 Jahre. Das Hagelregister stuft Bauteile in die Hagelwiderstandsklassen HW 1 bis HW 5 ein, geprüft mit Eiskugeln von 1 bis 5 cm
                      Durchmesser. Die Typprüfung von PV-Modulen nach IEC 61215 verwendet dagegen nur 25-mm-Eiskugeln – für hagelgefährdete Lagen ist die HW-Klasse der bessere Maßstab.
                    </p>
                    <p>
                      Tiefer ins Thema gehen die Ratgeber <Link href="/ratgeber/schneelast-photovoltaik">Schneelast und Photovoltaik</Link> und <Link href="/ratgeber/hagel-photovoltaik">Hagel und Photovoltaik</Link>.
                    </p>
                  </div>
                </div>
              ),
            },
            {
              id: "quellen",
              label: "Quellen & Grenzen",
              icon: <Info />,
              inhalt: (
                <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/70 md:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200">
                      <Info aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-[19px] font-bold text-ink-900">Quellen, Daten & Grenzen</h3>
                      <p className="text-[12.5px] text-ink-500">Stand September 2026 · Vorabschätzung, keine Statik</p>
                    </div>
                  </div>
                  <ul className="mt-5 grid gap-x-8 gap-y-2 text-[13.5px] leading-relaxed text-ink-600 md:grid-cols-2">
                    {QUELLEN.map((q) => (
                      <li key={q.name}>
                        <a href={q.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
                          {q.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-[12.5px] leading-relaxed text-ink-500">
                    Kartendarstellung: Datenquelle basemap.at (CC BY 4.0). Adresssuche: © OpenStreetMap-Mitwirkende (ODbL). Ertrag: PVGIS © Europäische Union. Seehöhe: EU-DEM v1.1, Copernicus Land Monitoring Service.
                    HORA-Inhalte © BMLUK – keine amtliche Auskunft.
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
            <SectionHeading eyebrow="Häufige Fragen" title="Standort-Check: Fragen & Antworten" lead="Ihre Frage ist nicht dabei? Wir prüfen Ihren Standort gerne persönlich." />
            <nav aria-labelledby="weiter-titel" className="mt-10">
              <h2 id="weiter-titel" className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Weiterlesen: Schnee, Hagel & Anlagenplanung</h2>
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
        eyebrow="Standortprüfung durch Ökovolt"
        title="Wir prüfen Ihren Standort – mit Normen-Standortabfrage und Statik."
        text="Schneelast, Wind und Hagel aus HORA, Dachstuhl und Unterkonstruktion geprüft, Module passend zur Last gewählt: Wir bereiten alles so vor, dass Ihr Tragwerksplaner und die Baubehörde damit arbeiten können."
        primary={{ label: "Standort prüfen lassen", href: "/angebot" }}
        secondary={{ label: "Solarertrag rechnen", href: "/solarrechner", icon: Calculator }}
      />

      <Bildnachweis
        items={[
          { motiv: "Berghütte mit PV", urheber: "Jean-Paul Wettstein", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/sunny-alpine-landscape-with-mountain-retreat-35486171/" },
          { motiv: "Schneedach mit PV", urheber: "Budget Bizar", lizenz: "Pexels-Lizenz", href: "https://www.pexels.com/photo/close-up-of-a-roof-of-a-house-covered-in-snow-during-a-heavy-snowfall-15922991/" },
          { motiv: "Verschneite Chalets", urheber: "Daniel Reust", lizenz: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Chalets_im_Winter.jpg" },
          { motiv: "Panoramabahn Bürserberg, Bergstation", urheber: "Asurnipal", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Buerserberg-Panoramabahn-top_station-photovoltaic_system-01ASD.jpg" },
        ]}
      />
    </div>
  );
}
