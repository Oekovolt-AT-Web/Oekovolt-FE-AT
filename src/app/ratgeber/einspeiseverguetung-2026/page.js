// src/app/ratgeber/einspeiseverguetung-2026/page.js
//
// Handgebauter Ratgeber „Einspeisetarif Österreich 2026“ (Pfad bleibt aus
// historischen Gründen einspeiseverguetung-2026). Alle Zahlen stehen als
// Konstanten in dieser Datei – bewusst KEINE Imports aus @/data/einspeiseverguetung
// oder @/data/solarrechner (dort liegen deutsche EEG-Werte).
// Quellen: OeMAG (Marktpreis), E-Control (Quartalsmarktpreis § 41 ÖSG 2012),
// Energy-Charts (Day-Ahead AT, eigene Auswertung), ElWG BGBl. I Nr. 91/2025,
// SNE-V 2018 idF BGBl. II Nr. 305/2025.

import { CalendarClock, Gauge } from "lucide-react";

import ArtikelLayout from "@/components/Ratgeber/ArtikelLayout";
import {
  Abschnitt,
  Ablauf,
  Checkliste,
  KartenRaster,
  Kennzahlband,
  KurzFazit,
  LinkKarten,
  Merkkasten,
  Prosa,
  Tabelle,
  TextLink,
  Zwischentitel,
} from "@/components/Ratgeber/Bausteine";
import Faq from "@/components/ui/Faq";
import { artikelNachSlug, artikelPfad } from "@/lib/ratgeber";

const BASE_URL = "https://www.oekovolt.com";
const SLUG = "einspeiseverguetung-2026";
const PAGE_URL = `${BASE_URL}${artikelPfad(SLUG)}`;

// ---------------------------------------------------------------------------
// Artikel-Stammdaten lokal, damit Titel/Beschreibung unabhängig vom zentralen
// Register (src/lib/ratgeber.js) stimmen.
// ---------------------------------------------------------------------------
const ARTIKEL = {
  ...(artikelNachSlug(SLUG) || {}),
  slug: SLUG,
  title: "Einspeisetarif Österreich 2026: OeMAG, Versorger & Direktvermarktung",
  kurzTitel: "Einspeisetarif 2026",
  description:
    "Einspeisetarif Österreich 2026: OeMAG-Marktpreis je Monat und Quartal, Tarife der Energieversorger, Überschusseinspeisung, Direktvermarktung und PPA im Gewerbe.",
  excerpt:
    "Was bringt eingespeister Solarstrom 2026 in Österreich? OeMAG-Marktpreis mit allen Monats- und Quartalswerten, Modelle der Energieversorger und was für Gewerbeanlagen gilt.",
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-30",
  lesezeit: 12,
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg",
  bildAlt: "Photovoltaikanlage auf mehreren Dachflächen – Luftaufnahme",
  keywords: [
    "Einspeisetarif Österreich 2026",
    "OeMAG Marktpreis 2026",
    "Einspeisevergütung Österreich",
    "Überschusseinspeisung",
    "Einspeisetarif Photovoltaik",
    "Direktvermarktung Photovoltaik Österreich",
    "Marktpreis § 41 ÖSG",
  ],
};

export const metadata = {
  title: "Einspeisetarif Österreich 2026: OeMAG & Versorger | Ökovolt",
  description: ARTIKEL.description,
  keywords: ARTIKEL.keywords,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: ARTIKEL.title,
    description: ARTIKEL.description,
    publishedTime: ARTIKEL.veroeffentlicht,
    modifiedTime: ARTIKEL.aktualisiert,
    section: ARTIKEL.kategorie,
    images: [{ url: `${BASE_URL}/og/ratgeber/einspeiseverguetung-2026.jpg`, width: 1200, height: 630, alt: ARTIKEL.bildAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: ARTIKEL.title,
    description: ARTIKEL.description,
    images: [`${BASE_URL}/og/ratgeber/einspeiseverguetung-2026.jpg`],
  },
};

// ---------------------------------------------------------------------------
// Daten (Stand 28.09.2026; Q4/2026 ergänzt am 30.09.2026 nach E-Control „Aktueller Marktpreis“,
// 152,82 €/MWh, veröffentlicht 29.09.2026 – SEO-Plan P6/M27)
// ---------------------------------------------------------------------------

/** OeMAG-Marktpreis PV (und alle Technologien außer Wind), ct/kWh, rückwirkend je Monat. Quelle: OeMAG. */
const OEMAG_2026 = [
  { monat: "Jänner", wert: 8.842, hinweis: "am Deckel (Q1)" },
  { monat: "Februar", wert: 8.457, hinweis: "Day-Ahead-Mittel" },
  { monat: "März", wert: 5.72, hinweis: "Day-Ahead-Mittel" },
  { monat: "April", wert: 6.772, hinweis: "Untergrenze (Q2)" },
  { monat: "Mai", wert: 6.772, hinweis: "Untergrenze (Q2)" },
  { monat: "Juni", wert: 6.772, hinweis: "Untergrenze (Q2)" },
  { monat: "Juli", wert: 6.146, hinweis: "Untergrenze (Q3)" },
  { monat: "August", wert: 8.997, hinweis: "Day-Ahead-Mittel" },
];

/** Quartalsmarktpreis nach § 41 Abs. 1 ÖSG 2012 (E-Control), ct/kWh. */
const QUARTALE = [
  ["2024", 9.626, 7.758, 8.899, 8.7],
  ["2025", 9.73, 9.759, 9.82, 9.167],
  ["2026", 9.25, 11.967, 10.923, 15.282],
];

/** Abzug für Ausgleichsenergie PV seit 2026, ct/kWh (§ 41 Abs. 2a ÖSG 2012). */
const AE_ABZUG_PV = 0.408;
const Q3_2026 = 10.923;
const q3Boden = Q3_2026 * 0.6 - AE_ABZUG_PV;
const q3Deckel = Q3_2026 - AE_ABZUG_PV;
const Q4_2026 = 15.282;
const q4Boden = Q4_2026 * 0.6 - AE_ABZUG_PV;
const q4Deckel = Q4_2026 - AE_ABZUG_PV;

/** Day-Ahead Gebotszone AT – eigene Auswertung Energy-Charts (Fraunhofer ISE). €/MWh bzw. Stunden. */
const MARKT = {
  base2025: 99.0,
  solar2025: 49.3,
  solar2026: 62.1,
  negStunden2024: 307,
  negStunden2025: 378,
  negStunden2026: 259,
};

// Beispielrechnung Gewerbedach – Annahmen offengelegt
const B = {
  kwp: 100,
  ertragProKwp: 1050, // kWh/kWp, Annahme Standort Oberösterreich
  eigenverbrauch: 0.6,
  energiepreis: 12.0, // ct/kWh netto, Annahme Energiepreis des Betriebs
  netzArbeitspreis: 2.37, // ct/kWh, NE 6 Netzbereich Oberösterreich 2026
  netzverlust: 0.454, // ct/kWh, NE 6 Oberösterreich 2026
  elektrizitaetsabgabe: 1.5, // ct/kWh, Regelsatz
  haendlerTarif: 5.0, // ct/kWh, Annahme Fixtarif eines Stromhändlers
  vermarktungsEntgelt: 0.3, // ct/kWh, Annahme Direktvermarktung
};
// typische Monatsanteile am PV-Jahresertrag (Annahme) für Jänner–August
const PV_ANTEIL = [0.025, 0.045, 0.08, 0.11, 0.125, 0.13, 0.135, 0.12];

const ertrag = B.kwp * B.ertragProKwp;
const evKwh = ertrag * B.eigenverbrauch;
const einspeisungKwh = ertrag - evKwh;
const ersparnisCt = B.energiepreis + B.netzArbeitspreis + B.netzverlust + B.elektrizitaetsabgabe;
const oemagGewichtet =
  OEMAG_2026.reduce((s, m, i) => s + m.wert * PV_ANTEIL[i], 0) / PV_ANTEIL.reduce((s, x) => s + x, 0);
const oemagSchnitt = OEMAG_2026.reduce((s, m) => s + m.wert, 0) / OEMAG_2026.length;
const spot2025 = MARKT.solar2025 / 10 - B.vermarktungsEntgelt;
const spot2026 = MARKT.solar2026 / 10 - B.vermarktungsEntgelt;

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";
const ct = (n, st = 2) => n.toLocaleString("de-DE", { minimumFractionDigits: st, maximumFractionDigits: st });
const ct3 = (n) => (n == null ? "noch offen" : ct(n, 3));

const TOC = [
  { id: "kurz", label: "Das Wichtigste in Kürze" },
  { id: "ueberblick", label: "Wie Einspeisung vergütet wird" },
  { id: "oemag", label: "OeMAG-Marktpreis 2026" },
  { id: "berechnung", label: "So wird der Marktpreis berechnet" },
  { id: "versorger", label: "Tarife der Energieversorger" },
  { id: "ueberschuss", label: "Überschuss- oder Volleinspeisung" },
  { id: "rechnung", label: "Beispielrechnung 100 kWp" },
  { id: "gewerbe", label: "Gewerbe: Direktvermarktung & PPA" },
  { id: "negativ", label: "Negative Preise" },
  { id: "ausblick", label: "Was sich 2027 ändert" },
  { id: "faq", label: "Häufige Fragen" },
];

const FAQ = [
  {
    q: "Wie hoch ist der Einspeisetarif in Österreich 2026?",
    a: `Einen gesetzlich fixen Einspeisetarif für neue PV-Anlagen gibt es in Österreich nicht. Der Referenzwert ist der OeMAG-Marktpreis: Er lag 2026 zwischen ${ct(5.72, 3)} ct/kWh (März) und ${ct(8.997, 3)} ct/kWh (August), im Schnitt Jänner bis August bei rund ${ct(oemagSchnitt, 1)} ct/kWh. Energieversorger zahlen je nach Tarifmodell meist zwischen etwa 2 und 11 ct/kWh.`,
  },
  {
    q: "Was ist der Unterschied zwischen OeMAG-Marktpreis und Quartalsmarktpreis?",
    a: "Den Quartalsmarktpreis veröffentlicht die E-Control am Quartalsende auf Basis der Terminmarktpreise (§ 41 Abs. 1 ÖSG 2012). Die OeMAG zahlt PV-Anlagen seit 2024 einen monatlich rückwirkend berechneten Wert aus den Day-Ahead-Preisen, der zwischen 60 und 100 Prozent des Quartalsmarktpreises liegen muss; seit 2026 wird zusätzlich ein Ausgleichsenergie-Abzug von 0,408 ct/kWh berücksichtigt.",
  },
  {
    q: "Welche Anlagen können an die OeMAG verkaufen?",
    a: "Die Abnahme zum Marktpreis über die OeMAG steht Ökostromanlagen mit weniger als 500 kW offen, bei Photovoltaik gemessen an der Modulspitzenleistung in kWp. Voraussetzung ist ein Netzzugang mit eigenem Zählpunkt; ein Strombezugsvertrag ist nicht nötig. Die Verträge laufen längstens bis 31. Dezember 2030.",
  },
  {
    q: "Lohnt sich Überschusseinspeisung oder Volleinspeisung?",
    a: "Für Betriebe mit Tagverbrauch fast immer die Überschusseinspeisung: Jede selbst genutzte Kilowattstunde spart Energiepreis, Netz-Arbeitspreis und Abgaben – im Beispiel dieses Artikels rund 16 ct/kWh netto – während eingespeister Strom 2026 im Mittel etwa 5 bis 7 ct/kWh bringt. Volleinspeisung ist nur sinnvoll, wenn am Standort kaum Verbrauch besteht.",
  },
  {
    q: "Kann ich zwischen OeMAG und Stromhändler wechseln?",
    a: "Ja. Der OeMAG-Vertrag ist mit mindestens vier Wochen Frist zu einem Stichtag kündbar. Wer zu einem Händler oder Direktvermarkter wechselt, kann frühestens nach zwölf Monaten zur OeMAG zurückkehren – der Wechsel sollte also bewusst entschieden werden.",
  },
  {
    q: "Was passiert mit dem Einspeisetarif bei negativen Strompreisen?",
    a: "Beim OeMAG-Marktpreis wirken negative Stunden nur über den Monatsdurchschnitt, nach unten begrenzt durch die 60-Prozent-Untergrenze. Bei Händlertarifen entscheidet der Vertrag; in der Direktvermarktung sollte die Anlage in negativen Viertelstunden abgeregelt werden. Die EAG-Marktprämie entfällt, wenn der Day-Ahead-Preis sechs Stunden in Folge negativ ist.",
  },
  {
    q: "Wie hoch ist der Marktpreis für das vierte Quartal 2026?",
    a: `${ct(Q4_2026, 3)} ct/kWh (152,82 €/MWh) – so hat die E-Control am 29.09.2026 den Quartalsmarktpreis für Oktober bis Dezember 2026 veröffentlicht, berechnet aus den letzten fünf Handelstagen im September. Für Photovoltaik liegt der OeMAG-Monatswert damit rechnerisch zwischen ${ct(q4Boden, 3)} und ${ct(q4Deckel, 3)} ct/kWh; verbindlich ist der Wert, den die OeMAG jeweils Anfang des Folgemonats veröffentlicht.`,
  },
];

export default function EinspeisetarifPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}/#article`,
        headline: ARTIKEL.title,
        description: ARTIKEL.description,
        inLanguage: "de-AT",
        datePublished: ARTIKEL.veroeffentlicht,
        dateModified: ARTIKEL.aktualisiert,
        author: { "@id": `${BASE_URL}/#organization` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
        image: `${BASE_URL}${ARTIKEL.bild}`,
        articleSection: ARTIKEL.kategorie,
        keywords: ARTIKEL.keywords.join(", "),
        timeRequired: `PT${ARTIKEL.lesezeit}M`,
        citation: QUELLEN.map((q) => ({ "@type": "CreativeWork", name: q.titel, url: q.url })),
      },
      // BreadcrumbList kommt aus der sichtbaren Brotkrumen-Navigation (src/components/ui/Breadcrumbs.js) – hier nicht doppelt (QA N3)
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ArtikelLayout
        artikel={ARTIKEL}
        toc={TOC}
        titel={
          <>
            Einspeisetarif Österreich 2026: <span className="ov-text-gradient">OeMAG, Versorger</span> & Direktvermarktung
          </>
        }
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <CalendarClock aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="ov-num font-display text-[22px] font-extrabold leading-none text-ink-900">
                {ct(8.997, 3)} ct <span className="text-[14px] font-semibold text-ink-500">/ kWh</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">OeMAG-Marktpreis PV, August 2026</p>
            </div>
          </div>
        }
        seitenCta={{
          titel: "Überschuss besser verwerten?",
          text: "Wir prüfen OeMAG, Händlertarif und Direktvermarktung für Ihre Anlage.",
          href: "/service/direktvermarktung",
          label: "Zur Direktvermarktung",
        }}
        cta={{
          title: "Mehr aus jeder eingespeisten Kilowattstunde.",
          text: "Wir planen Gewerbeanlagen auf hohen Eigenverbrauch, übernehmen Netzzugang und Zählpunkt und organisieren die passende Vermarktung des Überschusses – von der OeMAG bis zur Direktvermarktung.",
          primary: { label: "Anfrage starten", href: "/angebot" },
          secondary: { label: "Direktvermarktung", href: "/service/direktvermarktung" },
        }}
      >
        <KurzFazit
          punkte={[
            "In Österreich gibt es für neue PV-Anlagen keinen gesetzlich fixen Einspeisetarif. Eingespeister Strom wird zum Marktwert verkauft – an die OeMAG, einen Energieversorger oder einen Direktvermarkter.",
            `Der OeMAG-Marktpreis für PV lag 2026 zwischen ${ct(5.72, 3)} ct/kWh (März) und ${ct(8.997, 3)} ct/kWh (August); von April bis Juli griff die Untergrenze von 60 % des Quartalsmarktpreises.`,
            `Der Quartalsmarktpreis der E-Control beträgt für Oktober bis Dezember 2026 ${ct(Q4_2026, 3)} ct/kWh (Juli bis September: ${ct(Q3_2026, 3)} ct); daraus ergibt sich für PV ein Korridor von ${ct(q4Boden, 3)} bis ${ct(q4Deckel, 3)} ct/kWh.`,
            `Eigenverbrauch schlägt Einspeisung deutlich: Im Beispiel spart eine selbst genutzte Kilowattstunde rund ${ct(ersparnisCt, 1)} ct netto, eine eingespeiste bringt 2026 etwa ${ct(oemagGewichtet, 1)} ct (OeMAG, ertragsgewichtet).`,
            "Ab 1. Jänner 2027 zahlen Einspeiser über 20 kW einen Versorgungsinfrastrukturbeitrag von höchstens 0,05 ct/kWh (§ 75a ElWG).",
          ]}
        />

        <Abschnitt id="ueberblick" titel="Wie wird eingespeister Solarstrom in Österreich vergütet?">
          <Prosa>
            <p>
              <strong>
                Eingespeister Solarstrom wird in Österreich zum Marktwert verkauft – einen staatlich garantierten Fixtarif pro Kilowattstunde wie in
                Deutschland gibt es für neue Anlagen nicht.
              </strong>{" "}
              Die Förderung erfolgt stattdessen über Investitionszuschüsse und – für größere Anlagen – über die Marktprämie nach dem
              Erneuerbaren-Ausbau-Gesetz (EAG). Den Erlös für die Überschusseinspeisung bestimmt der gewählte Abnehmer.
            </p>
            <p>
              Für Betreiberinnen und Betreiber stehen fünf Wege offen. Welcher passt, hängt von Anlagengröße, Überschussmenge und Risikobereitschaft ab.
              Einen ausführlichen Vergleich für Betriebe finden Sie auf der Seite <TextLink href="/einspeisung-gewerbe">Einspeisung für Gewerbe</TextLink>;
              die Förderseite erklärt der Ratgeber <TextLink href="/ratgeber/eag-investitionszuschuss">EAG-Investitionszuschuss</TextLink>.
            </p>
          </Prosa>
          <Tabelle
            caption="Wege, eingespeisten PV-Strom in Österreich zu verkaufen, Stand September 2026"
            kopf={["Abnehmer / Modell", "Preisbasis", "Für wen", "Bindung"]}
            zeilen={[
              ["OeMAG (Marktpreis)", "Monatswert aus Day-Ahead-Preisen, 60–100 % des Quartalsmarktpreises", "Anlagen unter 500 kWp", "kündbar, Rückkehr erst nach 12 Monaten"],
              ["Energieversorger / Stromhändler", "Fixpreis, Staffel oder an Marktindex gekoppelt", "oft kleinere Anlagen, teils mit Bezugsvertrag", "laut Vertrag"],
              ["Direktvermarktung", "Viertelstunden-Spotpreis bzw. Marktwert minus Entgelt", "ab ca. 100 kWp sinnvoll, ab 500 kWp üblich", "laut Vertrag, oft 1–3 Jahre"],
              ["EAG-Marktprämie", "Marktwert + Prämie bis zum Zuschlagswert", "Anlagen mit Zuschlag in der Ausschreibung", "bis zu 20 Jahre"],
              ["Energiegemeinschaft / PPA", "frei vereinbarter Preis", "Nachbarbetriebe, Gemeinden, Großabnehmer", "laut Vertrag, PPA meist mehrjährig"],
            ]}
            minBreite={720}
            fussnote="Vereinfachte Übersicht, typische Werte. Details zu Voraussetzungen und Vertragsklauseln in den verlinkten Ratgebern; keine Rechtsberatung."
          />
        </Abschnitt>

        <Abschnitt id="oemag" titel="OeMAG-Marktpreis 2026: alle Monatswerte">
          <Prosa>
            <p>
              <strong>
                Der OeMAG-Marktpreis für Photovoltaik lag von Jänner bis August 2026 zwischen {ct(5.72, 3)} und {ct(8.997, 3)} ct/kWh, im einfachen
                Durchschnitt bei rund {ct(oemagSchnitt, 2)} ct/kWh.
              </strong>{" "}
              Die OeMAG Abwicklungsstelle für Ökostrom AG legt den Wert jeweils rückwirkend nach Monatsende fest. Er gilt für PV und alle anderen
              Technologien außer Wind (Wind August 2026: 8,951 ct/kWh).
            </p>
          </Prosa>
          <Tabelle
            caption="OeMAG-Marktpreis Photovoltaik 2026 je Monat in ct/kWh, Stand September 2026"
            kopf={["Monat 2026", "Marktpreis PV", "Einordnung"]}
            zeilen={OEMAG_2026.map((m) => [m.monat, `${ct(m.wert, 3)} ct/kWh`, m.hinweis])}
            hervorheben={1}
            markierteZeile={7}
            minBreite={480}
            fussnote="Quelle: OeMAG. Werte netto, rückwirkend festgelegt. „Untergrenze“ = 60 % des Quartalsmarktpreises abzüglich Ausgleichsenergie-Abzug, „Deckel“ = 100 % des Quartalsmarktpreises abzüglich Abzug."
          />
          <Zwischentitel>Quartalsmarktpreise der E-Control seit 2024</Zwischentitel>
          <Prosa>
            <p>
              Der Quartalsmarktpreis nach § 41 Abs. 1 Ökostromgesetz 2012 bildet den Rahmen für die Monatswerte. Er spiegelt die Terminmarktpreise für
              Grundlaststrom wider – nicht den Wert von Solarstrom, der mittags deutlich günstiger gehandelt wird.
            </p>
          </Prosa>
          <Tabelle
            caption="Marktpreis gemäß § 41 ÖSG 2012 je Quartal in ct/kWh, Stand September 2026"
            kopf={["Jahr", "Q1", "Q2", "Q3", "Q4"]}
            zeilen={QUARTALE.map(([j, ...q]) => [j, ...q.map(ct3)])}
            markierteZeile={2}
            minBreite={480}
            fussnote="Quelle: E-Control, Marktpreis-Archiv und „Aktueller Marktpreis“ (Q4/2026: 152,82 €/MWh, veröffentlicht am 29.09.2026). Zum Vergleich: 2022 lagen die Quartalswerte wegen der Energiekrise bei 25,69 bis 51,45 ct/kWh, 2020 bei 3,23 bis 4,51 ct/kWh."
          />
          <Kennzahlband
            icon={Gauge}
            wert={`${ct(q4Boden, 2)}–${ct(q4Deckel, 2)}`}
            titel="Korridor für PV im vierten Quartal 2026 (ct/kWh)"
            text={`Liegt das mengengewichtete Day-Ahead-Mittel eines Monats von Oktober bis Dezember unter ${ct(q4Boden, 3)} ct, zahlt die OeMAG die Untergrenze; liegt es darüber, den tatsächlichen Wert bis maximal ${ct(q4Deckel, 3)} ct/kWh. Im dritten Quartal lag der Korridor bei ${ct(q3Boden, 3)} bis ${ct(q3Deckel, 3)} ct/kWh.`}
          />
        </Abschnitt>

        <Abschnitt id="berechnung" titel="So wird der OeMAG-Marktpreis berechnet">
          <Prosa>
            <p>
              <strong>
                Der OeMAG-Monatswert ist der mit den Einspeisemengen gewichtete Durchschnitt der Day-Ahead-Preise des Monats, begrenzt auf 60 bis 100 %
                des Quartalsmarktpreises und seit 2026 vermindert um einen Ausgleichsenergie-Abzug.
              </strong>{" "}
              Rechtsgrundlage ist § 41 Abs. 2a ÖSG 2012. Die Berechnung erfolgt in vier Schritten:
            </p>
          </Prosa>
          <Ablauf
            schritte={[
              ["Quartalsmarktpreis festlegen", "Die E-Control bildet am Quartalsende das Mittel der EEX-Preise der vier folgenden Base-Quartalsfutures für Österreich aus den letzten fünf Handelstagen. Für Q3/2026 ergab das 10,923 ct/kWh."],
              ["Monatswert aus der Börse", "Nach Monatsende berechnet die OeMAG den mengengewichteten Durchschnitt der Day-Ahead-Preise. Seit 1. Oktober 2025 wird der Day-Ahead-Markt in Viertelstunden gehandelt."],
              ["Korridor anwenden", "Der Monatswert darf höchstens 100 % und muss mindestens 60 % des Quartalsmarktpreises betragen. Diese Untergrenze schützt Betreiber in sonnenreichen Monaten mit sehr niedrigen Mittagspreisen."],
              ["Ausgleichsenergie abziehen", `Seit 2026 wird der durchschnittliche Ausgleichsenergieaufwand des Vorjahres abgezogen – für PV ${ct(AE_ABZUG_PV, 3)} ct/kWh, für Wind 0,454 ct/kWh. Beispiel Q3/2026: 0,6 × 10,923 − 0,408 = ${ct(q3Boden, 3)} ct/kWh.`],
            ]}
          />
          <Merkkasten variant="info" titel="Warum der Sommer am Boden liegt">
            Nach unserer Auswertung der Day-Ahead-Daten (Energy-Charts) erzielte Solarstrom 2025 in der Gebotszone Österreich im Mittel nur{" "}
            {ct(MARKT.solar2025 / 10, 2)} ct/kWh – rund die Hälfte des durchschnittlichen Börsenpreises von {ct(MARKT.base2025 / 10, 2)} ct/kWh. Im Mai
            und Juni 2025 lag der Solar-Marktwert sogar unter 2 ct/kWh. Deshalb landete der OeMAG-Wert 2025 wie 2026 in den Frühjahrs- und
            Sommermonaten an der Untergrenze. Mehr dazu im Ratgeber <TextLink href="/ratgeber/oemag-marktpreis">OeMAG-Marktpreis</TextLink>.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="versorger" titel="Einspeisetarife der Energieversorger: Modelle und Spannen">
          <Prosa>
            <p>
              <strong>
                Energieversorger und Stromhändler zahlen 2026 je nach Tarifmodell überwiegend zwischen rund 2 und 11 ct/kWh für eingespeisten Solarstrom.
              </strong>{" "}
              Die Spanne ist groß, weil sich die Modelle grundlegend unterscheiden. Viele Angebote sind an den Bezug von Strom beim selben Unternehmen
              gebunden und auf kleinere Anlagen begrenzt – für Gewerbeanlagen kommen oft nur Direktvermarktung oder individuelle Verträge in Frage.
            </p>
          </Prosa>
          <KartenRaster
            cols={3}
            items={[
              { titel: "Monatlich schwimmend", text: "Preis folgt einem Referenzmarktwert, etwa dem Österreichischen Strompreisindex oder dem OeMAG-Wert, mit Auf- oder Abschlag. Transparent, aber schwankend." },
              { titel: "Fix oder gestaffelt", text: "Fester Cent-Betrag für eine Vertragsperiode, teils gestaffelt nach Menge (höherer Satz für die ersten kWh). Planbar, dafür oft Mengen- und Größengrenzen." },
              { titel: "Spot je Viertelstunde", text: "Abrechnung zum Day-Ahead-Preis der jeweiligen Stunde bzw. Viertelstunde, meist mit prozentualem Abschlag. Mittags oft sehr niedrig, bei negativen Preisen vertragsabhängig." },
            ]}
          />
          <Checkliste
            punkte={[
              "Ist ein Strombezugsvertrag beim selben Anbieter Pflicht – und passt dessen Bezugspreis?",
              "Bis zu welcher Anlagengröße (kWp) oder Einspeisemenge gilt der Tarif?",
              "Gibt es Grund- oder Messgebühren, die bei kleinen Mengen den Erlös aufzehren?",
              "Wie wird bei negativen Börsenpreisen abgerechnet – null, negativ oder weiter positiv?",
              "Wie lange gilt der Preis, und mit welcher Frist ändert der Anbieter ihn?",
              "Welche Kündigungsfristen gelten, und was bedeutet ein Wechsel für eine spätere Rückkehr zur OeMAG?",
            ]}
          />
          <Merkkasten variant="tipp" titel="Tarife vergleichen">
            Einspeisetarife ändern sich häufig, teils monatlich. Rechnen Sie Angebote immer mit Ihrer erwarteten Einspeisemenge je Monat durch – ein
            hoher Fixpreis mit Mengendeckel kann weniger bringen als ein Marktpreismodell. Für Anlagen ab etwa 100 kWp lohnt ein Blick auf die{" "}
            <TextLink href="/service/direktvermarktung">Direktvermarktung</TextLink>.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="ueberschuss" titel="Überschusseinspeisung oder Volleinspeisung?">
          <Prosa>
            <p>
              <strong>
                Für Betriebe, Landwirtschaft und Gemeinden mit Tagverbrauch ist die Überschusseinspeisung fast immer die wirtschaftlichere Wahl.
              </strong>{" "}
              Selbst genutzter Solarstrom ersetzt Netzbezug und spart damit den Energiepreis, den Netz-Arbeitspreis, das Netzverlustentgelt und die
              Elektrizitätsabgabe – selbst erzeugter und selbst verbrauchter PV-Strom ist von der Elektrizitätsabgabe befreit. Eingespeister Strom
              bringt dagegen nur den Marktwert.
            </p>
            <p>
              Volleinspeisung kommt vor allem bei Flächen ohne nennenswerten Verbrauch in Frage – etwa Scheunen, Lagerhallen oder Freiflächen – oder
              wenn eine Anlage mit Marktprämie bewusst als reine Erzeugungsanlage betrieben wird. Wie Sie den Eigenverbrauch steigern, zeigt der
              Ratgeber <TextLink href="/ratgeber/eigenverbrauch-erhoehen">Eigenverbrauch erhöhen</TextLink>; die Rolle von Batteriespeichern erklärt{" "}
              <TextLink href="/ratgeber/gewerbespeicher-kosten">Gewerbespeicher: Kosten und Nutzen</TextLink>.
            </p>
          </Prosa>
          <Merkkasten variant="wichtig" titel="Leistungspreis bleibt">
            Eigenverbrauch senkt die bezogene Energiemenge, aber kaum die Leistungsspitze: Die höchste Viertelstunde eines Monats tritt in vielen
            Betrieben morgens oder im Winter auf, wenn die PV-Anlage wenig liefert. Wie Sie den Leistungspreis gezielt senken, lesen Sie unter{" "}
            <TextLink href="/ratgeber/peak-shaving-leistungspreis">Peak Shaving und Leistungspreis</TextLink>.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="rechnung" titel="Beispielrechnung: 100 kWp auf dem Betriebsdach">
          <Prosa>
            <p>
              <strong>
                Bei einer 100-kWp-Anlage mit 60 % Eigenverbrauch bringt der selbst genutzte Strom im Beispiel rund {eur((evKwh * ersparnisCt) / 100)} im
                Jahr, die Einspeisung je nach Abnehmer nur rund {eur((einspeisungKwh * spot2025) / 100)} bis{" "}
                {eur((einspeisungKwh * oemagGewichtet) / 100)}.
              </strong>{" "}
              Annahmen: Standort Oberösterreich, {B.ertragProKwp.toLocaleString("de-DE")} kWh Ertrag je kWp, Anschluss auf Netzebene 6 im Netzbereich
              Oberösterreich, Energiepreis {ct(B.energiepreis, 0)} ct/kWh netto.
            </p>
          </Prosa>
          <Tabelle
            caption="Beispiel 100 kWp Gewerbedach: Wert von Eigenverbrauch und Einspeisung pro Jahr, Stand September 2026"
            kopf={["Position", "Menge", "Satz (netto)", "Wert pro Jahr"]}
            zeilen={[
              ["Jahresertrag", kwh(ertrag), "–", "–"],
              ["Eigenverbrauch (60 %)", kwh(evKwh), `${ct(ersparnisCt, 2)} ct/kWh gespart`, eur((evKwh * ersparnisCt) / 100)],
              ["Einspeisung an OeMAG (Werte 2026, ertragsgewichtet)", kwh(einspeisungKwh), `${ct(oemagGewichtet, 2)} ct/kWh`, eur((einspeisungKwh * oemagGewichtet) / 100)],
              ["Einspeisung zu Händler-Fixtarif (Annahme)", kwh(einspeisungKwh), `${ct(B.haendlerTarif, 2)} ct/kWh`, eur((einspeisungKwh * B.haendlerTarif) / 100)],
              ["Direktvermarktung, Solar-Marktwert 2025", kwh(einspeisungKwh), `${ct(spot2025, 2)} ct/kWh`, eur((einspeisungKwh * spot2025) / 100)],
              ["Direktvermarktung, Solar-Marktwert 2026 (bis Sept.)", kwh(einspeisungKwh), `${ct(spot2026, 2)} ct/kWh`, eur((einspeisungKwh * spot2026) / 100)],
            ]}
            hervorheben={3}
            markierteZeile={1}
            minBreite={720}
            fussnote={`Annahmen: Ersparnis je kWh = Energiepreis ${ct(B.energiepreis, 2)} ct (Annahme) + Netz-Arbeitspreis NE 6 Oberösterreich ${ct(B.netzArbeitspreis, 2)} ct + Netzverlustentgelt ${ct(B.netzverlust, 3)} ct (beide SNE-V 2018 idF BGBl. II Nr. 305/2025) + Elektrizitätsabgabe ${ct(B.elektrizitaetsabgabe, 1)} ct. OeMAG: Monatswerte Jänner–August 2026, gewichtet mit typischen Monatsanteilen am PV-Ertrag (Annahme). Solar-Marktwert: eigene Auswertung Energy-Charts (Day-Ahead AT) abzüglich ${ct(B.vermarktungsEntgelt, 1)} ct Vermarktungsentgelt (Annahme). Ohne Leistungspreis, Betriebskosten und Steuern.`}
          />
          <Prosa>
            <p>
              Zwei Dinge fallen auf: Erstens ist jede zusätzlich selbst genutzte Kilowattstunde im Beispiel etwa zwei- bis dreieinhalbmal so viel wert wie eine eingespeiste.
              Zweitens hat die OeMAG-Untergrenze 2026 besser bezahlt als die reine Börse – in einem Jahr mit höheren Quartalspreisen schützt der Korridor
              kleinere Anlagen. Für Anlagen ab 500 kWp steht dieser Weg allerdings nicht offen. Für Betriebe empfehlen wir eine Auslegung nach Lastgang;
              wie das geht, zeigt der Ratgeber <TextLink href="/ratgeber/pv-anlage-groesse-berechnen">PV-Anlage richtig dimensionieren</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="gewerbe" titel="Gewerbe und Industrie: Direktvermarktung, Marktprämie und PPA">
          <Prosa>
            <p>
              <strong>
                Gewerbeanlagen ab 500 kWp können nicht an die OeMAG verkaufen und vermarkten ihren Überschuss über einen Direktvermarkter, mit Marktprämie
                oder über einen Liefervertrag (PPA).
              </strong>{" "}
              Auch darunter kann die Direktvermarktung sinnvoll sein, wenn die Überschussmenge groß ist und die Anlage technisch steuerbar ist.
            </p>
          </Prosa>
          <KartenRaster
            cols={2}
            items={[
              { titel: "Direktvermarktung", text: "Ein Händler übernimmt Prognose, Bilanzgruppe und Verkauf an der Börse und zahlt den Marktwert je Viertelstunde abzüglich eines Entgelts. Voraussetzung: Viertelstundenmessung und Fernsteuerbarkeit, bei größeren Anlagen über einen Parkregler." },
              { titel: "EAG-Marktprämie", text: "Für Anlagen mit Zuschlag in einer Ausschreibung wird die Differenz zwischen Marktwert und Zuschlagswert als Prämie bezahlt. Die zweite PV-Ausschreibung 2026 umfasste 179.033 kWp mit einem Höchstpreis von 6,69 ct/kWh; Einreichung bis 11. Juni, Zuschlag am 10. Juli 2026." },
              { titel: "PPA (Power Purchase Agreement)", text: "Langfristiger Liefervertrag mit einem Abnehmer – vor Ort (On-site) oder über das Netz (Off-site). Preismodelle reichen von Pay-as-produced bis Baseload; üblich sind mehrjährige Laufzeiten." },
              { titel: "Energiegemeinschaft", text: "Überschuss an Mitglieder einer Erneuerbare-Energie-Gemeinschaft oder Bürgerenergiegemeinschaft liefern – mit reduzierten Netzentgelten im Nahebereich. Geeignet für Gemeinden, Gewerbeparks und Nachbarbetriebe." },
            ]}
          />
          <Prosa>
            <p>
              Details finden Sie in den Ratgebern <TextLink href="/ratgeber/ppa-oesterreich">PPA in Österreich</TextLink> und{" "}
              <TextLink href="/ratgeber/energiegemeinschaft-gewerbe">Energiegemeinschaften für Unternehmen</TextLink>. Für die technische Seite –
              Wirkleistungsvorgaben des Netzbetreibers, Fernsteuerung durch den Direktvermarkter – setzen wir eigene{" "}
              <TextLink href="/technik/parkregler">Parkregler</TextLink> und <TextLink href="/technik/scada">SCADA-Systeme</TextLink> ein. Begriffe wie{" "}
              <TextLink href="/wissen/lexikon#direktvermarktung">Direktvermarktung</TextLink> erklärt unser Lexikon.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="negativ" titel="Negative Strompreise: Was sie für den Einspeisetarif bedeuten">
          <Prosa>
            <p>
              <strong>
                In der Gebotszone Österreich gab es 2025 nach unserer Auswertung {MARKT.negStunden2025} Stunden mit negativem Day-Ahead-Preis, 2026 bis
                Ende September bereits {MARKT.negStunden2026}.
              </strong>{" "}
              2024 waren es {MARKT.negStunden2024}. Die meisten fallen auf sonnige Mittage von April bis August – also genau dann, wenn PV-Anlagen am
              meisten einspeisen.
            </p>
          </Prosa>
          <Tabelle
            caption="Auswirkung negativer Day-Ahead-Preise je Vermarktungsweg, Stand September 2026"
            kopf={["Vermarktungsweg", "Wirkung negativer Preise"]}
            zeilen={[
              ["OeMAG-Marktpreis", "senkt den Monatsdurchschnitt; nach unten durch 60 % des Quartalsmarktpreises begrenzt"],
              ["Händlertarif (fix)", "kein direkter Effekt, aber Anbieter passen Preise und Bedingungen an"],
              ["Händlertarif (Spot)", "vertragsabhängig: Vergütung null oder negativ möglich"],
              ["Direktvermarktung", "Einspeisung kostet Geld – Anlage wird abgeregelt, Erlös entfällt in diesen Viertelstunden"],
              ["EAG-Marktprämie", "keine Prämie, wenn der Preis sechs Stunden in Folge negativ ist"],
              ["Eigenverbrauch", "nicht betroffen – Eigenverbrauch hat immer Vorrang"],
            ]}
            minBreite={560}
            fussnote="Quelle Stunden: eigene Auswertung auf Basis Energy-Charts (Day-Ahead AT, Stundenmittel unter 0 €/MWh). Regeln zur Marktprämie nach EAG in der geltenden Fassung; Vertragsdetails beim jeweiligen Abnehmer prüfen."
          />
          <Prosa>
            <p>
              Mehr zu Ursachen, Häufigkeit und Gegenstrategien lesen Sie im Ratgeber{" "}
              <TextLink href="/ratgeber/negative-strompreise">Negative Strompreise in Österreich</TextLink>. Wer flexible Verbraucher hat, kann umgekehrt
              profitieren – etwa über einen <TextLink href="/ratgeber/dynamischer-stromtarif-lohnt-sich">dynamischen Stromtarif</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="ausblick" titel="Was sich 2027 für Einspeiser ändert">
          <Prosa>
            <p>
              <strong>
                Mit dem Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025) kommen ab 2027 ein Versorgungsinfrastrukturbeitrag für Einspeiser und
                ein neues Netzentgeltsystem mit Leistungspreis auf allen Netzebenen.
              </strong>{" "}
              Der Nationalrat hat das ElWG am 11. Dezember 2025 beschlossen; es löst das ElWOG 2010 ab. Was sich im Detail ändert, fasst der Ratgeber{" "}
              <TextLink href="/ratgeber/elwg-elektrizitaetswirtschaftsgesetz">ElWG für PV-Betreiber</TextLink> zusammen.
            </p>
          </Prosa>
          <Checkliste
            punkte={[
              "Versorgungsinfrastrukturbeitrag (§ 75a ElWG) ab 1. Jänner 2027: jährlich per Verordnung festgelegt, gedeckelt auf 0,05 ct je eingespeister kWh; Einspeiser bis 20 kW sind befreit.",
              "Spitzenkappung: Netzbetreiber dürfen die Einspeisung begrenzen, jedoch nicht unter 70 % der Modulspitzenleistung.",
              "Netzentgelte für den Strombezug werden ab 2027 stärker leistungsabhängig – laut Entwurf der E-Control mit monatlichem Leistungspreis auch auf Netzebene 7.",
              `Der Quartalsmarktpreis für Q4/2026 beträgt ${ct(Q4_2026, 3)} ct/kWh (Korridor PV ${ct(q4Boden, 3)} bis ${ct(q4Deckel, 3)} ct/kWh); die OeMAG-Werte ab September 2026 stehen noch aus – wir ergänzen sie nach Veröffentlichung.`,
            ]}
          />
          <Merkkasten variant="recht" titel="Rechtsstand">
            Dieser Artikel gibt den Stand vom 28. September 2026 wieder. Verordnungen zum ElWG (Systemnutzungsentgelte, Beitragshöhe) waren zu diesem
            Zeitpunkt teils noch im Entwurf. Die Angaben ersetzen keine Rechts- oder Steuerberatung; zur steuerlichen Behandlung von Einspeiseerlösen
            siehe <TextLink href="/ratgeber/photovoltaik-steuern">Photovoltaik und Steuern</TextLink>.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="faq" titel="Häufige Fragen zum Einspeisetarif in Österreich">
          <Faq items={FAQ} />
        </Abschnitt>

        <Abschnitt id="passend" titel="Passend dazu">
          <LinkKarten
            links={[
              { href: "/service/direktvermarktung", titel: "Direktvermarktung", text: "Überschuss professionell vermarkten – ab etwa 100 kWp." },
              { href: "/ratgeber/oemag-marktpreis", titel: "OeMAG-Marktpreis erklärt", text: "Rechenweg, Historie und Quartalswerte im Detail." },
              { href: "/einspeisung-gewerbe", titel: "Einspeisung für Betriebe", text: "Alle Wege, PV-Überschuss zu verkaufen, im Vergleich." },
              { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Eigenverbrauch erhöhen statt billig einspeisen." },
            ]}
          />
        </Abschnitt>

        <Abschnitt id="quellen" titel="Quellen">
          <Prosa>
            <ul>
              {QUELLEN.map((q) => (
                <li key={q.url}>
                  <a href={q.url} rel="noopener noreferrer" target="_blank">
                    {q.titel}
                  </a>
                  , Stand {q.stand}
                </li>
              ))}
            </ul>
          </Prosa>
        </Abschnitt>
      </ArtikelLayout>
    </>
  );
}

const QUELLEN = [
  { titel: "OeMAG – Marktpreis (Monatswerte 2026, Berechnung, Abnahme unter 500 kWp)", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
  { titel: "E-Control – Marktpreis gemäß § 41 Ökostromgesetz 2012, Archiv", url: "https://www.e-control.at/marktteilnehmer/oeko-energie/marktpreis-archiv", stand: "09/2026" },
  { titel: "Energy-Charts (Fraunhofer ISE) – Day-Ahead-Preise und Erzeugung Österreich, eigene Auswertung", url: "https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=de&c=AT", stand: "27.09.2026" },
  { titel: "Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", stand: "09/2026" },
  { titel: "SNE-V 2018 – Novelle 2026, BGBl. II Nr. 305/2025 (Netzentgelte 2026)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html", stand: "09/2026" },
  { titel: "EAG-Abwicklungsstelle – Förderkalender 2026", url: "https://www.eag-abwicklungsstelle.at/foerderkalender/", stand: "09/2026" },
  { titel: "Stromliste – Einspeisetarife Österreich (Tarifübersicht)", url: "https://stromliste.at/umwelt/pv-anlagen/einspeisetarife", stand: "15.09.2026" },
];
