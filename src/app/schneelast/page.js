// src/app/schneelast/page.js
//
// Schneelast-Karte Österreich: Ortssuche, Karte und Ergebnis des Schneelast-RICHTWERTS aus eigener
// Auswertung offener GeoSphere-Daten (SNOWGRID-CL v2.1, CC BY 4.0), Dach-Schneelast-Beispiel und
// Einordnung der Modulklassen. Werte der Übersicht werden zur Build-Zeit aus dem Raster gelesen
// (src/lib/schneelast/richtwerte.js). HORA wird NIE abgefragt – der Normwert steht in eHORA.
//
// Hinweis Deployment: next.config.mjs enthielt einen Redirect /schneelast → /standort-check; der
// muss für diese Seite entfallen (Snippet im Auftragsbericht).

import Link from "next/link";
import { ArrowUpRight, Calculator, Database, LineChart, Map as MapIcon } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { Bildnachweis } from "@/components/Loesungen/Bausteine";
import DunkelSektion from "@/components/Loesungen/B/DunkelSektion";
import SchneelastWerkzeug from "@/components/Schneelast/SchneelastWerkzeug";
import Pflichthinweis from "@/components/Schneelast/Pflichthinweis";
import { LaenderKarten, ModulTabelle, QuellenBlock, SCHNEELAST_QUELLEN } from "@/components/Schneelast/Bausteine";
import { BASE_URL } from "@/lib/site";
import { ORTE } from "@/lib/schneelast/orte";
import { modulGrenzen, zahl } from "@/lib/schneelast/einordnung";
import { laenderUeberblick, rasterMeta, richtwertFuerPunkt } from "@/lib/schneelast/richtwerte";

const PFAD = "/schneelast";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Schneelast Österreich: Karte & Richtwert je Ort | Ökovolt";
const BESCHREIBUNG =
  "Schneelast-Richtwert für jeden Ort in Österreich: Karte aus GeoSphere-Daten (SNOWGRID-CL), Dachschneelast-Beispiel und Einordnung der PV-Modulklassen. Normwert in eHORA.";
const BILD = { src: "/Images/AT/chalets/chalets-schneelast-luftbild.jpg", alt: "Luftbild tief verschneiter Chalets mit hohen Schneedecken auf den Dächern" };

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
    images: [{ url: `${BASE_URL}${BILD.src}`, alt: BILD.alt }],
  },
};

// Landeshauptstädte als Schnellwahl in der Karte (Koordinaten und Seehöhe aus src/lib/schneelast/orte.js)
const HAUPTSTAEDTE = [
  { land: "burgenland", ort: "Eisenstadt" },
  { land: "kaernten", ort: "Klagenfurt am Wörthersee", kurz: "Klagenfurt" },
  { land: "niederoesterreich", ort: "St. Pölten", labelLinks: true },
  { land: "oberoesterreich", ort: "Linz" },
  { land: "salzburg", ort: "Salzburg" },
  { land: "steiermark", ort: "Graz" },
  { land: "tirol", ort: "Innsbruck" },
  { land: "vorarlberg", ort: "Bregenz" },
  { land: "wien", ort: "Innere Stadt", anzeige: "Wien" },
];

function schnellwahl() {
  return HAUPTSTAEDTE.map((h) => {
    const o = ORTE[h.land].find((x) => x.ort === h.ort);
    if (!o) return null;
    const r = richtwertFuerPunkt(o.lat, o.lon, o.hoehe);
    return { ort: h.anzeige || o.ort, kurz: h.kurz || h.anzeige || null, labelLinks: Boolean(h.labelLinks), lat: o.lat, lon: o.lon, hoehe: o.hoehe, sk: r.sk, grund: r.grund };
  }).filter(Boolean);
}

function startpunkt() {
  const o = ORTE.oberoesterreich.find((x) => x.ort === "Ostermiething");
  const r = richtwertFuerPunkt(o.lat, o.lon, o.hoehe);
  return { lat: o.lat, lon: o.lon, label: "Beispiel: Ostermiething (Firmensitz Ökovolt)", hoehe: o.hoehe, sk: r.sk, grund: r.grund, quelle: "start", laedt: false, fehler: "" };
}

const GRENZEN = modulGrenzen(30, false);

const FAQ = [
  {
    q: "Wie hoch ist die Schneelast in Österreich?",
    a: "Das hängt stark vom Ort ab. In Wien, im Burgenland und im Osten Niederösterreichs liegen die 50-jährlichen Richtwerte der Bezirkshauptorte meist unter 1 kN/m², im Alpenvorland und in den Alpentälern meist zwischen 1 und 3 kN/m², in Hochlagen deutlich darüber. Seit der ÖNORM B 1991-1-3:2022 gibt es keine Schneelastzonen mehr – maßgeblich ist der Kartenwert für das Grundstück, den eHORA zeigt.",
  },
  {
    q: "Ist der Wert auf dieser Seite ein Normwert?",
    a: "Nein. Es ist ein Richtwert aus unserer eigenen Auswertung offener Schneedaten von GeoSphere Austria (SNOWGRID-CL v2.1, Lizenz CC BY 4.0). Er ist kein Normwert nach ÖNORM B 1991-1-3 und ersetzt keine Statik. Den Normwert sₖ lesen Sie in eHORA (hora.gv.at) ab; für Einreichung und Tragwerksplanung zählt nur dieser.",
  },
  {
    q: "Wie entsteht der Richtwert?",
    a: "Für jede Rasterzelle von 1 × 1 km nehmen wir die höchste Schneelast (Schneewasseräquivalent) jedes Winters seit 1961/62, passen daran eine Extremwertverteilung (GEV über L-Momente) an und lesen den Wert ab, der im Mittel einmal in 50 Jahren erreicht wird. Das Ergebnis runden wir auf 0,1 kN/m².",
  },
  {
    q: "Warum gibt es über 2.000 m keinen Wert?",
    a: "Die Schneelastkarte der ÖNORM B 1991-1-3:2022 gilt bis 2.000 m Seehöhe. Darüber fasst eine 1-km-Rasterzelle Grate, Kare und Gletscher zusammen – der Rasterwert sagt dann für ein Dach nichts Verlässliches aus. Für Gebäude in dieser Höhe braucht es ein Schneelastgutachten.",
  },
  {
    q: "Wie viel Schnee sind 1 kN/m²?",
    a: "1 kN/m² entspricht rund 100 kg je Quadratmeter Grundfläche. Wie hoch der Schnee dafür liegt, hängt von seiner Dichte ab: Pulverschnee ist leicht, nasser oder gesetzter Schnee und Eis sind um ein Vielfaches schwerer. Deshalb rechnet die Norm mit dem Gewicht, nicht mit der Schneehöhe.",
  },
  {
    q: "Welche PV-Module brauche ich bei hoher Schneelast?",
    a: `Maßgeblich ist die Prüflast laut Datenblatt, geteilt durch den Sicherheitsfaktor 1,5 (IEC 61215). Standardmodule mit 2400 Pa Prüflast haben also 1600 Pa Bemessungslast. Bei 30° Dachneigung ohne Schneefang reicht das rechnerisch bis zu einem Richtwert von rund ${zahl(GRENZEN[0].knappBis, 1)} kN/m², Module mit 5400 Pa bis rund ${zahl(GRENZEN[1].knappBis, 1)} kN/m². Darüber sind Hochlastmodule und eine verstärkte Unterkonstruktion mit Einzelnachweis nötig.`,
  },
  {
    q: "Werden hier Daten aus HORA abgefragt?",
    a: "Nein. HORA untersagt das automatisierte Herunterladen seiner Daten, deshalb fragen wir HORA nie ab. Der Richtwert kommt ausschließlich aus einer lokalen Rasterdatei mit unserer Auswertung der GeoSphere-Daten. Zu HORA führt nur ein Link, der die Schneelastkarte an Ihrem Punkt öffnet.",
  },
];

const WEITER = [
  { href: "/standort-check", titel: "Standort-Check Photovoltaik", text: "Schneelast, Wind, Hagel und Ertrag für Ihre Adresse – mit Modul- und Unterkonstruktions-Check." },
  { href: "/ratgeber/schneelast-photovoltaik", titel: "Ratgeber Schneelast & Photovoltaik", text: "ÖNORM B 1991-1-3, eHORA und Modul-Prüflasten ausführlich erklärt." },
  { href: "/chalets", titel: "Photovoltaik für alpine Chalets", text: "Hochlastmodule, Schneefang und Indach-Lösungen für schneereiche Lagen." },
  { href: "/rechner", titel: "Alle Rechner & Tools", text: "Solarrechner, Speicher, Gewerbe-Rechner und Standort-Check im Überblick." },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${PAGE_URL}/#app`,
      name: "Ökovolt Schneelast-Karte Österreich",
      url: PAGE_URL,
      description:
        "Zeigt für jeden Punkt in Österreich bis 2.000 m Seehöhe einen Schneelast-Richtwert (50-jährlich) aus eigener Auswertung offener GeoSphere-Daten (SNOWGRID-CL), rechnet die Dachschneelast nach ÖNORM EN 1991-1-3 und vergleicht sie mit den Bemessungslasten von PV-Modulen. Kein Normwert; der Normwert nach ÖNORM B 1991-1-3 steht in eHORA.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      inLanguage: "de-AT",
      isAccessibleForFree: true,
      featureList: [
        "Ortssuche in Österreich",
        "Karte der Schneelast-Richtwerte im 1-km-Raster",
        "Dachschneelast s = μ1 · Ce · Ct · sk",
        "Vergleich mit Modul-Prüflasten 2400, 5400 und 8100 Pa",
        "Richtwerte der Bezirkshauptorte je Bundesland",
        "Direktlink auf die eHORA-Schneelastkarte am Standort",
      ],
      isBasedOn: {
        "@type": "Dataset",
        name: "SNOWGRID Klima v2.1 (SNOWGRID-CL), 1 km, täglich",
        url: "https://data.hub.geosphere.at/dataset/snowgrid_cl-v2-1d-1km",
        identifier: "https://doi.org/10.60669/fsxx-6977",
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: { "@type": "Organization", name: "GeoSphere Austria", url: "https://www.geosphere.at/" },
      },
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
      primaryImageOfPage: `${BASE_URL}${BILD.src}`,
    },
  ],
};

export default function SchneelastPage() {
  const meta = rasterMeta();
  const staedte = schnellwahl();
  const start = startpunkt();
  const laender = laenderUeberblick();

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Rechner & Tools", href: "/rechner" }, { name: "Schneelast-Karte" }]}
        eyebrow="Schneelast-Karte Österreich"
        title={
          <>
            Schneelast in Österreich: <span className="ov-text-gradient-light">Richtwert für jeden Ort</span>
          </>
        }
        lead="Ort suchen oder in die Karte klicken: Sie sehen den 50-jährlichen Schneelast-Richtwert aus offenen GeoSphere-Daten, was davon auf Dach und Modul ankommt – und welche Modulklasse rechnerisch passt."
        image={{ ...BILD, position: "50% 55%" }}
        points={["Kostenlos & ohne Anmeldung", "1-km-Raster, 1961–2026", "Alle 9 Bundesländer"]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-40"
      />

      <section aria-label="Schneelast-Werkzeug" id="werkzeug" className="relative z-10 -mt-20 scroll-mt-24 pb-6 md:-mt-28 md:pb-10">
        <div className="ov-container">
          <SchneelastWerkzeug meta={meta} staedte={staedte} start={start} />
        </div>
      </section>

      <Section tone="white" space="md" id="bundeslaender" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Richtwerte nach Bundesland"
          title="Schneelast in allen neun Bundesländern"
          lead="Für jeden Bezirkshauptort – in Wien für jeden Gemeindebezirk – haben wir den Richtwert aus dem Raster gelesen. Die Balken zeigen die Spanne vom niedrigsten bis zum höchsten Wert im Land."
          className="mb-10"
        />
        <LaenderKarten laender={laender} />
        <Pflichthinweis className="mt-8" />
      </Section>

      <DunkelSektion
        id="modulklassen"
        eyebrow="Einordnung Modulklassen"
        title="Welche Module welche Schneelast tragen"
        lead="Aus dem Richtwert wird mit Dachneigung und Schneefang die Last je Modul. Die Tabelle zeigt, bis zu welchem Richtwert eine Modulklasse bei einem typischen Satteldach mit 30° rechnerisch reicht."
      >
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <ModulTabelle />
          </Reveal>
          <Reveal delay={120} className="space-y-5 text-[16px] leading-[1.75] text-white/70">
            <p>
              <strong className="text-white">Prüflast ist nicht Bemessungslast.</strong> Ein Modul mit 5400 Pa Prüflast hat die Laborprüfung nach IEC 61215 bestanden. Für die Planung gilt die Prüflast geteilt durch
              den Sicherheitsfaktor 1,5 – also 3600 Pa.
            </p>
            <p>
              Dem gegenüber steht die Schneelast je m² Modulfläche, multipliziert mit dem Teilsicherheitsbeiwert 1,5. Ab rund 30° rutscht Schnee von glatten Modulen ab, deshalb sinkt der Formbeiwert μ₁ mit steigender
              Neigung – außer ein Schneefang hält den Schnee zurück.
            </p>
            <p>
              Unter 80 % Auslastung werten wir ein Modul als „mit Reserve“, weil sich Schnee am unteren Modulrand anhäuft. Die Unterkonstruktion, die Klemmbereiche und vor allem der Dachstuhl brauchen immer einen eigenen
              Nachweis.
            </p>
            <Pflichthinweis dunkel />
          </Reveal>
        </div>
      </DunkelSektion>

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Datenbasis" title="So entsteht der Richtwert" className="mb-12" />
        <Steps
          cols={3}
          items={[
            { icon: Database, title: "Offene Schneedaten", text: "GeoSphere Austria rechnet mit SNOWGRID-CL für ganz Österreich täglich die Schneedecke im 1-km-Raster zurück – seit dem Winter 1961/62. Lizenz CC BY 4.0." },
            { icon: LineChart, title: "Extremwertstatistik", text: "Je Zelle die höchste Schneelast jedes Winters, daran eine GEV-Verteilung (L-Momente) – daraus der Wert, der im Mittel einmal in 50 Jahren erreicht wird." },
            { icon: MapIcon, title: "Karte & Einordnung", text: "Der Richtwert gilt für die ganze 1-km-Zelle. Den Normwert im 50-m-Raster zeigt eHORA; über 2.000 m geben wir keinen Wert aus." },
          ]}
        />
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Schneelast: Fragen & Antworten" lead="Ihre Frage ist nicht dabei? Wir prüfen Ihren Standort gerne persönlich." />
            <nav aria-labelledby="weiter-titel" className="mt-10">
              <h2 id="weiter-titel" className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Weiterlesen</h2>
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

      <Section tone="white" space="sm">
        <QuellenBlock quellen={SCHNEELAST_QUELLEN} stand={meta?.stand} />
      </Section>

      <Querverweise pfad={PFAD} />

      <CtaBand
        eyebrow="Standortprüfung durch Ökovolt"
        title="Wir klären die Schneelast Ihres Dachs – mit Normwert und Statik."
        text="Normen-Standortabfrage aus eHORA, Dachstuhl und Unterkonstruktion geprüft, Module passend zur Last gewählt: Wir bereiten alles so vor, dass Tragwerksplanung und Baubehörde damit arbeiten können."
        primary={{ label: "Standort prüfen lassen", href: "/angebot" }}
        secondary={{ label: "Standort-Check öffnen", href: "/standort-check", icon: Calculator }}
      />

      <Bildnachweis items={[{ motiv: "Verschneite Chalets", urheber: "Daniel Reust", lizenz: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Chalets_im_Winter.jpg" }]} />
    </div>
  );
}

