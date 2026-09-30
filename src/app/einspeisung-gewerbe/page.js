// src/app/einspeisung-gewerbe/page.js
//
// Einspeisung für Gewerbe (Masterplan #7): Wohin mit dem PV-Überschuss?
// OeMAG-Marktpreis je Monat seit 2024 (Primärquellen, Datenfrische mit Warnung nach 35 Tagen),
// Korridor nach § 41 ÖSG 2012 inkl. Q4/2026, Vergleich OeMAG / Versorger / Direktvermarktung /
// PPA / Marktprämie, Rechner „Erlös pro Jahr“.
//
// Daten: src/data/oemag.js (jede Zahl mit Quelle, geprüft am 30.09.2026) · Logik: src/lib/einspeisung.js
// Neutral: keine Versorger-Namen, kein Ranking; Tarife nur über den E-Control-Tarifkalkulator (Link).
// SEO-Plan (30.09.2026): Title ohne „OeMAG-Marktpreis“ (Zielseite dafür ist /ratgeber/oemag-marktpreis),
// Dataset mit license und Methodik (M12), Presse-Grafik „Einspeise-Verlauf“ (public/presse/grafiken).

import Link from "next/link";
import { ArrowUpRight, Calculator, Scale, TrendingUp } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { Fachdetails, Glow, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import Datenfrische from "@/components/Einspeisung/Datenfrische";
import ErloesRechner from "@/components/Einspeisung/ErloesRechner";
import Verlauf from "@/components/Einspeisung/Verlauf";
import WerteTabelle from "@/components/Einspeisung/WerteTabelle";
import {
  AUSGLEICHSENERGIE_PV,
  AUSGLEICHSENERGIE_WIND_2026,
  MARKTPRAEMIE,
  NAECHSTE_VEROEFFENTLICHUNG,
  OEMAG_MONATE,
  OEMAG_REGELN,
  OEMAG_WIND_2026,
  QUARTALSPREISE,
  QUELLEN,
  REFERENZMARKTWERT_PV,
  STAND,
} from "@/data/oemag";
import {
  ctText,
  datumText,
  dezimal,
  gewichtetesMittel,
  grenzMonate,
  letzterMonat,
  monatLabel,
  neuesterKorridor,
  werteImZeitraum,
} from "@/lib/einspeisung";
import { BASE_URL } from "@/lib/site";

// Datenfrische-Hinweis wird stündlich neu berechnet (ISR)
export const revalidate = 3600;

const PFAD = "/einspeisung-gewerbe";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITLE = "PV-Überschuss verkaufen: Einspeisung für Betriebe | Ökovolt";
const DESCRIPTION =
  "Wohin mit dem PV-Überschuss im Betrieb? OeMAG, Direktvermarktung, PPA und Marktprämie im Vergleich – plus Rechner für den Jahreserlös Ihrer Einspeisung.";
const GRAFIK = { png: "/presse/grafiken/oemag-einspeise-verlauf.png", svg: "/presse/grafiken/oemag-einspeise-verlauf.svg" };

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "PV Überschuss verkaufen Gewerbe",
    "Einspeisung Gewerbe",
    "Direktvermarktung Photovoltaik Österreich",
    "PPA Photovoltaik Österreich",
    "EAG Marktprämie",
    "Einspeisetarif Gewerbe",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Einspeisung für Gewerbe: OeMAG-Marktpreis, Direktvermarktung und PPA" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

// ---------------------------------------------------------------------------
// Abgeleitete Zahlen (alle aus src/data/oemag.js)
// ---------------------------------------------------------------------------

const LETZTER = letzterMonat();
const Q4 = neuesterKorridor();
const Q_VOR = QUARTALSPREISE[QUARTALSPREISE.length - 2];
const AE_2026 = AUSGLEICHSENERGIE_PV[2026];

const JAHRE = [
  { id: "2024", titel: "Jahr 2024" },
  { id: "2025", titel: "Jahr 2025" },
  { id: "12m", titel: "Letzte 12 Monate" },
].map((z) => {
  const om = werteImZeitraum(OEMAG_MONATE, z.id);
  const rm = werteImZeitraum(REFERENZMARKTWERT_PV, z.id);
  return {
    ...z,
    zeitraum: `${monatLabel(om[0].monat, true)} – ${monatLabel(om[om.length - 1].monat, true)}`,
    oemag: gewichtetesMittel(om),
    markt: gewichtetesMittel(rm),
    unten: grenzMonate(om, "untergrenze"),
    oben: grenzMonate(om, "obergrenze"),
  };
});

// ---------------------------------------------------------------------------
// Inhalte
// ---------------------------------------------------------------------------

const SCHRITTE = [
  {
    nr: "01",
    titel: "Quartalspreis als Referenz",
    text: "Die E-Control ermittelt am Ende jedes Quartals den Marktpreis nach § 41 Abs. 1 ÖSG 2012 aus den Grundlast-Futures (Phelix-AT) der folgenden vier Quartale.",
  },
  {
    nr: "02",
    titel: "Korridor 60 bis 100 %",
    text: `Der Monatswert darf 60 % dieses Quartalspreises nicht unter- und 100 % nicht überschreiten – seit 2026 jeweils abzüglich ${ctText(AE_2026)} ct/kWh Ausgleichsenergie.`,
  },
  {
    nr: "03",
    titel: "Day-Ahead-Mittel des Monats",
    text: "Nach Monatsende bildet die OeMAG das mengengewichtete Mittel der Day-Ahead-Preise – gewichtet mit dem, was tatsächlich eingespeist wurde.",
  },
  {
    nr: "04",
    titel: "Vergütung im Nachhinein",
    text: "Der begrenzte Wert wird Anfang des Folgemonats veröffentlicht. Die Gutschrift kommt nach der Ablesung durch den Netzbetreiber.",
  },
];

const VERGLEICH_SPALTEN = [
  { key: "weg", label: "Weg", breite: "w-[15%]" },
  { key: "preis", label: "Preisbildung" },
  { key: "fuer", label: "Für wen" },
  { key: "bindung", label: "Bindung" },
  { key: "risiko", label: "Preisrisiko", breite: "w-[14%]" },
  { key: "technik", label: "Aufwand & Technik" },
];

const VERGLEICH = [
  {
    weg: "OeMAG-Marktpreis",
    preis: `Monatswert im Nachhinein: Day-Ahead-Mittel, begrenzt auf 60–100 % des Quartalspreises${AE_2026 ? `, minus ${ctText(AE_2026)} ct Ausgleichsenergie` : ""}.`,
    fuer: `Anlagen unter ${dezimal(OEMAG_REGELN.grenzeKwp)} kWp ohne Fördertarif-Vertrag.`,
    bindung: `Vertrag längstens bis ${OEMAG_REGELN.vertragBis}; Kündigung ${OEMAG_REGELN.kuendigung}.`,
    risiko: "gering bis mittel – Untergrenze schützt nach unten",
    technik: `Antrag im Ticketsystem der OeMAG, Anmeldung über den Netzbetreiber; Bearbeitung derzeit ${OEMAG_REGELN.bearbeitung}.`,
  },
  {
    weg: "Einspeisetarif eines Energieversorgers",
    preis: "Laut Vertrag: fixer Preis, Staffel oder an einen Marktindex gekoppelt.",
    fuer: "Je nach Anbieter, oft mit Leistungsgrenzen oder nur mit Strombezug.",
    bindung: "Laufzeit und Kündigung laut Vertrag.",
    risiko: "hängt von der Preisformel ab",
    technik: "Vertrag mit dem Versorger; Vergleich über den Tarifkalkulator der E-Control.",
  },
  {
    weg: "Direktvermarktung (Spot)",
    preis: "Day-Ahead-Preis je Viertelstunde × eingespeiste Menge, minus Vermarktungsentgelt; auch Fixpreis- oder Mischmodelle.",
    fuer: `Ab ${dezimal(OEMAG_REGELN.grenzeKwp)} kWp der übliche Weg, darunter wählbar.`,
    bindung: "Laut Vertrag mit dem Direktvermarkter.",
    risiko: "hoch – Marktwert schwankt, negative Preise möglich",
    technik: "Viertelstundenmessung, meist Fernsteuerbarkeit; Prognose und Bilanzgruppe übernimmt der Vermarkter.",
  },
  {
    weg: "PPA (Stromabnahmevertrag)",
    preis: "Mit dem Abnehmer verhandelt: fix, indexiert oder „pay as produced“.",
    fuer: "Größere Mengen, Freiflächen oder mehrere Anlagen.",
    bindung: "Mehrjährig, individuell vereinbart.",
    risiko: "vertraglich verteilt",
    technik: "Vertragsverhandlung, Bonitätsprüfung, meist Herkunftsnachweise; Abwicklung oft über einen Vermarkter.",
  },
  {
    weg: "EAG-Marktprämie",
    preis: "Marktwert plus Prämie bis zum Zuschlagswert (Differenz zum Referenzmarktwert PV), monatlich ausbezahlt.",
    fuer: `Neue oder erweiterte PV-Anlagen über ${MARKTPRAEMIE.mindestKwp} kWp mit Zuschlag in einer Ausschreibung.`,
    bindung: `In der Regel ${MARKTPRAEMIE.jahre} Jahre; Direktvermarktung nötig. Nicht zusammen mit dem Investitionszuschuss.`,
    risiko: "gering bis mittel – Prämie gleicht Marktwert bis zum Zuschlagswert aus",
    technik: `Gebot bei der EAG-Abwicklungsstelle; 2026 Höchstpreis ${dezimal(MARKTPRAEMIE.hoechstpreis2026Ct, 2)} ct/kWh je Gebotstermin.`,
  },
];

const FAQ = [
  {
    q: "Wie hoch ist der OeMAG-Marktpreis aktuell?",
    a: `Für ${monatLabel(LETZTER.monat)} vergütet die OeMAG Photovoltaik mit ${ctText(LETZTER.ct)} ct/kWh netto (Windkraft: ${ctText(OEMAG_WIND_2026[LETZTER.monat] ?? NaN)} ct/kWh). Der Wert steht jeweils erst Anfang des Folgemonats fest; der ${NAECHSTE_VEROEFFENTLICHUNG.was} wird ${NAECHSTE_VEROEFFENTLICHUNG.wann} veröffentlicht. Alle Monatswerte seit Jänner 2024 finden Sie in der Tabelle auf dieser Seite.`,
  },
  {
    q: "Wie berechnet die OeMAG den Marktpreis?",
    a: `Ausgangspunkt ist das mengengewichtete Monatsmittel der Day-Ahead-Preise (§ 41 Abs. 2a ÖSG 2012). Dieser Wert wird auf 60 bis 100 % des Quartalsmarktpreises der E-Control begrenzt. Seit 2026 wird zusätzlich der durchschnittliche Aufwand für Ausgleichsenergie abgezogen: ${ctText(AE_2026)} ct/kWh für Photovoltaik und ${ctText(AUSGLEICHSENERGIE_WIND_2026)} ct/kWh für Windkraft. 2024 und 2025 gab es keinen Abzug.`,
  },
  {
    q: "Was bedeutet der neue Quartalspreis für Oktober bis Dezember 2026?",
    a: `Die E-Control hat den Marktpreis für das ${Q4.nr}. Quartal ${Q4.jahr} mit ${ctText(Q4.quartalCt)} ct/kWh veröffentlicht (Vorquartal: ${ctText(Q_VOR.ct)} ct/kWh). Nach der Formel der OeMAG liegt der Monatswert für Photovoltaik damit von Oktober bis Dezember 2026 rechnerisch zwischen ${ctText(Q4.unter)} und ${ctText(Q4.ober)} ct/kWh. Verbindlich ist der Wert, den die OeMAG jeweils im Folgemonat veröffentlicht.`,
  },
  {
    q: "Ab welcher Anlagengröße nimmt die OeMAG keinen Strom mehr ab?",
    a: `Die Abnahmepflicht zum Marktpreis gilt nur für Anlagen mit einer Engpassleistung unter ${dezimal(OEMAG_REGELN.grenzeKwp)} kW – bei Photovoltaik ist das die Modulspitzenleistung in kWp. Größere Anlagen verkaufen ihren Überschuss über einen Direktvermarkter, einen PPA oder mit EAG-Marktprämie. Ausgenommen sind außerdem Anlagen mit aufrechtem Fördertarif-Vertrag.`,
  },
  {
    q: "Wie lange läuft ein Marktpreisvertrag und wie kann ich kündigen?",
    a: `Die OeMAG stellt Marktpreisverträge längstens bis ${OEMAG_REGELN.vertragBis} aus. Nach einer Mindesteinspeisedauer von ${OEMAG_REGELN.mindestMonate} Monaten können Sie jederzeit schriftlich mit einer Frist von 4 Wochen zum Monatsletzten kündigen. Für neue Anträge nennt die OeMAG derzeit eine Bearbeitungszeit von ${OEMAG_REGELN.bearbeitung}.`,
  },
  {
    q: "Wie finde ich den Einspeisetarif eines Energieversorgers?",
    a: "Im Tarifkalkulator der E-Control können Sie unter „Strom Einspeisung“ mit Postleitzahl, Einspeisemenge und Leistung in kWp die Angebote vergleichen, die für Ihre Anlage in Frage kommen. Wir nennen auf dieser Seite bewusst keine Versorger und erstellen keine Rangliste – Tarife ändern sich laufend, und manche gelten nur zusammen mit einem Strombezugsvertrag.",
  },
  {
    q: "Was ist die EAG-Marktprämie und für wen passt sie?",
    a: `Neu errichtete oder erweiterte PV-Anlagen über ${MARKTPRAEMIE.mindestKwp} kWp können sich in einer Ausschreibung um eine Marktprämie bewerben. Sie gleicht die Differenz zwischen dem Zuschlagswert und dem Referenzmarktwert aus und wird in der Regel ${MARKTPRAEMIE.jahre} Jahre lang monatlich ausbezahlt. 2026 gilt je Gebotstermin ein Höchstpreis von ${dezimal(MARKTPRAEMIE.hoechstpreis2026Ct, 2)} ct/kWh; in der 2. Ausschreibung (Zuschlag am ${MARKTPRAEMIE.zweiteAusschreibung.zuschlag}) wurden Gebote bis ${dezimal(MARKTPRAEMIE.zweiteAusschreibung.bisCt, 2)} ct/kWh berücksichtigt. Nächster Gebotstermin laut Leitfaden: ${MARKTPRAEMIE.gebotstermine2026[3]}. Marktprämie und Investitionszuschuss schließen einander für dieselbe Anlage aus.`,
  },
  {
    q: "Was braucht eine Anlage für die Direktvermarktung?",
    a: "Einen eigenen Einspeisezählpunkt mit viertelstündlicher Messung, weil jede Viertelstunde zum jeweiligen Day-Ahead-Preis abgerechnet wird, und in der Regel eine Fernsteuerbarkeit, über die der Vermarkter die Leistung bei negativen Preisen begrenzen kann. Prognose, Bilanzgruppe und Handel übernimmt der Direktvermarkter gegen ein Entgelt, das im Angebot steht.",
  },
];

const QUELLEN_LISTE = Object.values(QUELLEN).map((q) => ({ label: `${q.label} – abgerufen ${q.abgerufen}`, url: q.url }));

// ---------------------------------------------------------------------------

export default function EinspeisungGewerbe() {
  const jetzt = Date.now();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: "PV-Überschuss verkaufen: Einspeisung für Betriebe – OeMAG, Direktvermarktung, PPA und Marktprämie",
        description: DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        dateModified: STAND.geprueftAm,
        mainEntity: { "@id": `${PAGE_URL}/#oemag-marktpreis` },
      },
      {
        "@type": "Dataset",
        "@id": `${PAGE_URL}/#oemag-marktpreis`,
        name: "OeMAG-Marktpreis Photovoltaik – Monatswerte seit Jänner 2024 (Zusammenstellung Ökovolt)",
        description: `Vergütete Monatswerte der OeMAG für Photovoltaik-Überschussstrom nach § 13 Abs. 3 iVm § 41 ÖSG 2012 von ${monatLabel(OEMAG_MONATE[0].monat)} bis ${monatLabel(LETZTER.monat)} in ct/kWh, mit Grundlage (Day-Ahead-Mittel, Unter- oder Obergrenze), Quartalsmarktpreisen der E-Control und Referenzmarktwert PV. Die Monatswerte sind amtliche Veröffentlichungen der OeMAG; Zusammenstellung, Einordnung und Jahresmittel von Ökovolt.`,
        url: `${PAGE_URL}#verlauf`,
        inLanguage: "de-AT",
        temporalCoverage: `${OEMAG_MONATE[0].monat}/${LETZTER.monat}`,
        spatialCoverage: { "@type": "Country", name: "Österreich" },
        creator: { "@id": `${BASE_URL}/#organization` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        license: "https://creativecommons.org/licenses/by/4.0/",
        creditText: "Ökovolt Solartechnik GmbH; Monatswerte: OeMAG Abwicklungsstelle für Ökostrom AG; Quartalspreise und Referenzmarktwert: E-Control",
        isAccessibleForFree: true,
        measurementTechnique: `Monatswerte unverändert aus den Veröffentlichungen der OeMAG übernommen (Marktpreis-Seite 2026, Marktpreise_2024.pdf, Marktpreise_2025.pdf), Grundlage je Monat aus der Kommentarspalte der OeMAG und mit dem Korridor 60–100 % des E-Control-Quartalspreises abgeglichen (ab 2026 abzüglich ${ctText(AE_2026)} ct/kWh Ausgleichsenergie). Jahresmittel gewichtet mit dem monatlichen PV-Ertrag laut PVGIS (Ostermiething, Süd 35°). Geprüft am ${STAND.label}.`,
        isBasedOn: [QUELLEN.oemag, QUELLEN.oemag2025, QUELLEN.oemag2024, QUELLEN.ecArchiv, QUELLEN.ecRmw].map((q) => ({ "@type": "CreativeWork", name: q.label, url: q.url })),
        distribution: [
          { "@type": "DataDownload", name: "Grafik OeMAG-Marktpreis und Marktwert Solar (PNG)", contentUrl: `${BASE_URL}${GRAFIK.png}`, encodingFormat: "image/png" },
          { "@type": "DataDownload", name: "Grafik OeMAG-Marktpreis und Marktwert Solar (SVG)", contentUrl: `${BASE_URL}${GRAFIK.svg}`, encodingFormat: "image/svg+xml" },
        ],
        variableMeasured: [
          { "@type": "PropertyValue", name: "Marktpreis Photovoltaik (OeMAG)", unitText: "ct/kWh" },
          { "@type": "PropertyValue", name: "Referenzmarktwert Photovoltaik (E-Control, § 13 EAG)", unitText: "ct/kWh" },
        ],
        dateModified: STAND.geprueftAm,
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Gewerbe", href: "/gewerbe" }, { name: "Einspeisung für Gewerbe" }]}
        eyebrow="Einspeisung für Gewerbe"
        title={<>Wohin mit dem PV-Überschuss? <span className="ov-text-gradient-light">Einspeisung für Betriebe</span></>}
        lead="Was Ihr Betrieb nicht selbst verbraucht, wird verkauft – an die OeMAG zum Marktpreis, an einen Energieversorger, über einen Direktvermarkter oder per PPA. Hier finden Sie alle OeMAG-Monatswerte seit 2024 mit Quelle, die Wege im neutralen Vergleich und einen Rechner für Ihren Jahreserlös."
        image={{ src: "/Images/AT/loesungen-b/speicher-industriedach-pv.jpg", alt: "Luftbild eines Industriedachs mit großer Photovoltaikanlage", position: "center 45%" }}
        points={["OeMAG-Marktpreis Monat für Monat", "Direktvermarktung, PPA, Marktprämie", "Erlös-Rechner für Ihre Menge", "Neutral, ohne Versorger-Ranking"]}
        actions={[
          { label: "Erlös berechnen", href: "#rechner", icon: Calculator },
          { label: "Wege vergleichen", href: "#vergleich", icon: Scale },
        ]}
      >
        <Datenfrische jetzt={jetzt} dark kompakt className="ov-hero-in mt-8 max-w-md" />
      </PageHero>

      <KennzahlenBand
        items={[
          { text: `${ctText(LETZTER.ct)} ct`, label: `OeMAG-Marktpreis PV ${monatLabel(LETZTER.monat)}, jüngster Wert` },
          { text: `${ctText(Q4.unter)} ct`, label: "rechnerische Untergrenze Oktober bis Dezember 2026" },
          { text: `< ${dezimal(OEMAG_REGELN.grenzeKwp)} kWp`, label: "nur darunter nimmt die OeMAG ab" },
          { text: OEMAG_REGELN.vertragBis, label: "Marktpreisverträge laufen längstens bis" },
        ]}
      />

      {/* Verlauf */}
      <Section tone="white" space="md" id="verlauf" className="scroll-mt-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-end">
          <SectionHeading
            eyebrow="OeMAG-Marktpreis seit 2024"
            title={<>{OEMAG_MONATE.length} Monatswerte, <span className="ov-text-gradient">jeder belegt</span></>}
            lead="Seit 2024 vergütet die OeMAG Photovoltaik-Überschuss mit einem Monatswert, der erst im Nachhinein feststeht. Im Frühjahr und Sommer greift oft die Untergrenze – dann liegt die Vergütung über dem, was Solarstrom am Markt wert war."
          />
          <Datenfrische jetzt={jetzt} />
        </div>

        <Reveal dir="scale">
          <Verlauf tabelleId="oemag-werte" />
        </Reveal>

        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {JAHRE.map((j, i) => (
            <Reveal as="li" key={j.id} delay={i * 80} className="flex">
              <div className="w-full rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
                <p className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-[16.5px] font-bold text-ink-900">{j.titel}</span>
                  <span className="text-[12.5px] text-ink-500">{j.zeitraum}</span>
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-[12.5px] text-ink-500">OeMAG, PV-gewichtet</dt>
                    <dd className="ov-num mt-0.5 font-display text-[24px] font-extrabold leading-none text-ov-700">{ctText(j.oemag, 2)} ct</dd>
                  </div>
                  <div>
                    <dt className="text-[12.5px] text-ink-500">Marktwert Solar</dt>
                    <dd className="ov-num mt-0.5 font-display text-[24px] font-extrabold leading-none text-ink-900">{ctText(j.markt, 2)} ct</dd>
                  </div>
                </dl>
                <p className="mt-4 text-[13.5px] leading-relaxed text-ink-600">
                  {j.unten} Monate an der Untergrenze, {j.oben} an der Obergrenze.
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
          Gewichtet mit dem monatlichen PV-Ertrag (PVGIS, Ostermiething, Süd 35°), weil im Sommer mehr eingespeist wird. Marktwert Solar = Referenzmarktwert PV der E-Control (§ 13 EAG). Verlauf als Grafik zur
          Weiterverwendung (CC BY 4.0, Quelle „Ökovolt, Daten: OeMAG, E-Control“):{" "}
          <a href={GRAFIK.png} download className={LINK}>
            PNG
          </a>{" "}
          ·{" "}
          <a href={GRAFIK.svg} download className={LINK}>
            SVG
          </a>
          .
        </p>

        <Fachdetails className="mt-8" titel="Alle Monatswerte als Tabelle" untertitel="Mit Korridor, Grundlage laut OeMAG, Referenzmarktwert und Quelle je Monat">
          <WerteTabelle id="oemag-werte" />
          <p className="mt-4 text-[13.5px] leading-relaxed text-ink-600">
            Werte für Photovoltaik und andere Energieträger außer Windkraft, ct/kWh netto. 2024 und 2025 ohne Abzug für Ausgleichsenergie; 2026 abzüglich {ctText(AE_2026)} ct/kWh (Windkraft {ctText(AUSGLEICHSENERGIE_WIND_2026)} ct/kWh).
            Quartalspreise: E-Control-Marktpreis-Archiv. Die Grundlage je Monat stammt aus der Kommentarspalte der OeMAG und stimmt mit dem berechneten Korridor überein.
          </p>
        </Fachdetails>
      </Section>

      {/* Korridor */}
      <Section tone="navy" space="md" id="korridor" className="ov-noise isolate scroll-mt-24 overflow-hidden">
        <Glow />
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="So entsteht der Monatswert"
              title="Markt im Korridor – mit Boden und Deckel"
              lead="Der OeMAG-Marktpreis folgt dem Großhandel, ist aber nach unten und oben begrenzt. Beide Grenzen hängen am Quartalspreis der E-Control."
              className="mb-9"
            />
            <ol className="grid gap-3 sm:grid-cols-2">
              {SCHRITTE.map((s, i) => (
                <Reveal as="li" key={s.nr} delay={i * 70} className="ov-glass flex flex-col rounded-2xl p-5">
                  <span aria-hidden="true" className="font-display text-[13px] font-extrabold text-ov-300">{s.nr}</span>
                  <p className="mt-2 font-semibold text-white">{s.titel}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{s.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal dir="right" className="flex">
            <div className="flex w-full flex-col rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/15 md:p-8">
              <StandPille dark className="self-start">
                E-Control, veröffentlicht {Q4.veroeffentlicht ? datumText(Q4.veroeffentlicht) : STAND.label}
              </StandPille>
              <p className="mt-5 text-[14px] font-semibold uppercase tracking-[0.14em] text-white/55">Quartalspreis {Q4.nr}. Quartal {Q4.jahr}</p>
              <p className="ov-num mt-2 font-display text-[clamp(2.2rem,1.6rem+2vw,3.2rem)] font-extrabold leading-none text-white">
                {ctText(Q4.quartalCt)} <span className="text-[0.5em] font-bold text-white/60">ct/kWh</span>
              </p>
              <p className="mt-2 text-[14px] text-white/60">nach {ctText(Q_VOR.ct)} ct/kWh im Vorquartal</p>

              <div className="mt-7 space-y-4">
                {[
                  { label: "Obergrenze Okt.–Dez. 2026", wert: Q4.ober, farbe: "bg-navy-300" },
                  { label: "Untergrenze Okt.–Dez. 2026", wert: Q4.unter, farbe: "bg-sun-400" },
                  { label: `Zum Vergleich: ${monatLabel(LETZTER.monat)}`, wert: LETZTER.ct, farbe: "bg-ov-400" },
                ].map((z) => (
                  <div key={z.label}>
                    <p className="flex items-baseline justify-between gap-3 text-[14px]">
                      <span className="text-white/75">{z.label}</span>
                      <span className="ov-num font-display text-[18px] font-extrabold text-white">{ctText(z.wert)} ct</span>
                    </p>
                    <span aria-hidden="true" className="mt-1.5 block h-2 overflow-hidden rounded-full bg-white/10">
                      <span className={`block h-full rounded-full ${z.farbe}`} style={{ width: `${(z.wert / Q4.quartalCt) * 100}%` }} />
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-auto pt-7 text-[13px] leading-relaxed text-white/55">
                Rechnerisch nach der Formel der OeMAG: 60 % bzw. 100 % des Quartalspreises minus {ctText(AE_2026)} ct/kWh. Verbindlich ist der Monatswert, den die OeMAG Anfang des Folgemonats veröffentlicht.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Vergleich */}
      <Section tone="sand" space="md" id="vergleich" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Fünf Wege für den Überschuss"
          title={<>OeMAG, Versorger, Direktvermarktung, <span className="ov-text-gradient">PPA und Marktprämie</span></>}
          lead="Welcher Weg passt, hängt von Anlagengröße, Überschussmenge und davon ab, wie viel Preisrisiko Sie tragen wollen. Die Tabelle vergleicht die Modelle – nicht einzelne Anbieter."
          className="mb-10"
        />
        <Reveal>
          <Tabelle caption="Vermarktungswege für PV-Überschuss in Österreich im Vergleich" spalten={VERGLEICH_SPALTEN} zeilen={VERGLEICH} dicht />
        </Reveal>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <a
            href={QUELLEN.ecTarifkalkulator.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group ov-card-hover flex flex-col rounded-3xl bg-navy-950 p-6 text-white outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2 md:p-7"
          >
            <span className="flex items-center justify-between gap-4">
              <span className="font-display text-[18px] font-bold">Einspeisetarife vergleichen: Tarifkalkulator der E-Control</span>
              <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-300 transition-transform group-hover:rotate-45" />
            </span>
            <span className="mt-2 text-[14.5px] leading-relaxed text-white/70">
              Unter „Strom Einspeisung“ Postleitzahl, Einspeisemenge und kWp eingeben – der Rechner zeigt alle Anbieter, die für Ihre Anlage in Frage kommen.
            </span>
            <span className="sr-only">(externer Link, neues Fenster)</span>
          </a>
          <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
            <p className="font-display text-[18px] font-bold text-ink-900">Bewusst ohne Rangliste</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
              Wir nennen keine Versorger und lesen keine Preisblätter aus. Tarife ändern sich laufend, manche gelten nur mit Strombezug. Für Ihre Entscheidung zählen Ihre Zählwerte – die rechnen wir gerne mit Ihnen durch.
            </p>
          </div>
        </div>
      </Section>

      {/* Rechner */}
      <Section tone="white" space="md" id="rechner" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Rechner „Erlös pro Jahr“"
          title={<>Was bringt Ihr Überschuss <span className="ov-text-gradient">pro Jahr?</span></>}
          lead="Menge eingeben, Zeitraum wählen – der Rechner zeigt den Erlös mit dem OeMAG-Marktpreis, einen Richtwert für die Direktvermarktung und auf Wunsch Ihr eigenes Angebot."
          align="center"
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale">
          <ErloesRechner />
        </Reveal>
      </Section>

      {/* Entscheidungshilfe */}
      <Section tone="sand" space="md" id="entscheidung" className="scroll-mt-24">
        <SplitMedia
          eyebrow="Entscheidungshilfe"
          title="Welcher Weg passt zu Ihrer Anlage?"
          text="Die Größe setzt den Rahmen, die Monatsverteilung Ihres Überschusses entscheidet über den Erlös. Liegt der Großteil im Frühjahr und Sommer, bestimmt beim OeMAG-Marktpreis oft die Untergrenze Ihre Vergütung."
          image={{ src: "/Images/AT/home/hero-gewerbedach-luftbild.jpg", alt: "Montage einer Photovoltaikanlage auf dem Flachdach einer Industriehalle, Luftbild" }}
          points={[
            { title: `Unter ${dezimal(OEMAG_REGELN.grenzeKwp)} kWp, wenig Aufwand`, text: "OeMAG-Marktpreis oder Einspeisetarif eines Versorgers; ein Wechsel ist nach 12 Monaten möglich." },
            { title: `Ab ${dezimal(OEMAG_REGELN.grenzeKwp)} kWp`, text: "keine OeMAG-Abnahme – Direktvermarktung oder PPA, bei Neuanlagen auch die Marktprämie." },
            { title: "Neuanlage mit hoher Einspeisung", text: "Marktprämie über die Ausschreibung oder Investitionszuschuss – nur eines von beiden." },
            { title: "Viel Überschuss zu Mittag", text: "jede selbst genutzte kWh spart Energie, Netzentgelte und Abgaben – Speicher und Lastverschiebung prüfen." },
          ]}
        >
          <p className="mt-6 text-[14.5px] leading-relaxed text-ink-600">
            Weiterlesen: <Link href="/service/direktvermarktung" className={LINK}>Direktvermarktung</Link>, <Link href="/ratgeber/oemag-marktpreis" className={LINK}>OeMAG-Marktpreis erklärt</Link>,{" "}
            <Link href="/ratgeber/ppa-oesterreich" className={LINK}>PPA in Österreich</Link> und <Link href="/forderungen/bundesfoerderung" className={LINK}>EAG-Marktprämie</Link>.
          </p>
        </SplitMedia>
      </Section>

      {/* FAQ + Quellen */}
      <Section tone="white" space="md" id="faq" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Einspeisung im Gewerbe – kurz beantwortet" lead={`Stand ${STAND.label}. Verbindlich sind die Veröffentlichungen von OeMAG, E-Control und EAG-Abwicklungsstelle.`}>
            <Link href="/ratgeber/oemag-marktpreis#beispiel" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Ratgeber: OeMAG-Marktpreis mit Rechenbeispiel
              <TrendingUp aria-hidden="true" className="h-4 w-4" />
            </Link>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
        <Quellen
          klappbar
          className="mt-12"
          stand={STAND.label}
          quellen={QUELLEN_LISTE}
          hinweis="Orientierung ohne Gewähr, keine Rechts-, Steuer- oder Anlageberatung. Alle Werte netto; Einspeiseerlöse von Betrieben sind steuerpflichtig. Vergangene Monatswerte sind keine Prognose."
        />
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        eyebrow="Überschuss vermarkten"
        title="Welcher Weg bringt Ihrer Anlage am meisten?"
        text="Wir werten Ihre Einspeise-Zählwerte aus und rechnen OeMAG-Marktpreis, vorliegende Angebote und mehr Eigenverbrauch mit Ihren Zahlen durch – nachvollziehbar und mit Quellen."
        primary={{ label: "Zählwerte prüfen lassen", href: "/angebot?objekt=gewerbe" }}
        secondary={{ label: "Direktvermarktung ansehen", href: "/service/direktvermarktung", icon: TrendingUp }}
      />
      <p className="ov-container -mt-4 pb-6 text-[12px] leading-relaxed text-ink-400">
        Bilder: Kopfbild Industriedach – Giant Asparagus / Pexels · Luftbild Gewerbedach – Ökovolt
      </p>
    </div>
  );
}
