// energie-live/solar-marktwert/page.js – Ökovolt Solar-Marktwert Österreich (B10)
//
// PV-gewichteter Day-Ahead-Monatspreis der Gebotszone AT – eigene Schätzung von Ökovolt aus
// Bundesnetzagentur | SMARD.de (Preise) und Energy-Charts/Fraunhofer ISE (Solarerzeugung), beide CC BY 4.0.
// Klar abgegrenzt vom amtlichen Referenzmarktwert der E-Control (src/data/oemag.js).
// Daten: data/marktindizes/solar-marktwert.json (scripts/marktindizes.mjs, monatlich manuell).

import { Landmark, Scale, Sigma, Sun } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Kennzahlen from "@/components/ServiceAT/B/Kennzahlen";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import { DownloadKarte, Kennzeichnung, MonatsBalken, MonatsTabelle } from "../_marktindizes/Bausteine";
import {
  CSV_SOLAR,
  EC_URL,
  RMW_JE_MONAT,
  RMW_QUELLE,
  RMW_STAND,
  SMARD_URL,
  SOLAR_INDEX,
  URL_SOLAR,
  ctAusMwh,
  ctText,
  datumText,
  monatLabel,
  prozent,
  zahl0,
} from "../_marktindizes/daten";

const J = SOLAR_INDEX;
// Für Diagramm und Tabelle in ct/kWh (wie OeMAG und E-Control)
const MONATE = J.monate.map((m) => ({
  ...m,
  smwCt: m.solarMarktwert == null ? null : m.solarMarktwert / 10,
  mittelCt: m.mittel == null ? null : m.mittel / 10,
  rmwCt: RMW_JE_MONAT[m.monat] ?? null,
}));
const LETZTER = MONATE[MONATE.length - 1];
const MIT_RMW = MONATE.filter((m) => m.rmwCt != null && m.smwCt != null);
const LETZTER_MIT_RMW = MIT_RMW[MIT_RMW.length - 1];
const MITTLERE_ABWEICHUNG = MIT_RMW.length ? MIT_RMW.reduce((s, m) => s + Math.abs(m.smwCt - m.rmwCt), 0) / MIT_RMW.length : null;
const LETZTE_12 = MONATE.slice(-12).filter((m) => m.marktwertfaktor != null);
const TIEFSTER = LETZTE_12.reduce((a, b) => (a == null || b.marktwertfaktor < a.marktwertfaktor ? b : a), null);
const STAND = datumText(J.stand);
const OG_BILD = "https://www.oekovolt.com/og-image.jpg";

const herkunftSolar = `Eigene Berechnung Ökovolt Österreich · Daten: Bundesnetzagentur | SMARD.de und Energy-Charts (Fraunhofer ISE), CC BY 4.0 · Stand ${STAND} · Richtwert/Orientierung`;

const TITEL = "Solar-Marktwert Österreich: PV-gewichteter Strompreis je Monat | Ökovolt";
const BESCHREIBUNG = `Was Solarstrom an der Börse wert ist: PV-gewichteter Day-Ahead-Preis Österreich, ${monatLabel(LETZTER.monat)} ${ctAusMwh(LETZTER.solarMarktwert)} bei ${ctAusMwh(LETZTER.mittel)} Monatsmittel. Ökovolt-Schätzung, nicht amtlich – CSV (CC BY 4.0).`;

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["Solar-Marktwert Österreich", "Marktwert Solarstrom", "PV Marktwert Day-Ahead", "Marktwertfaktor Photovoltaik", "Referenzmarktwert PV", "Kannibalisierung Photovoltaik"],
  alternates: { canonical: URL_SOLAR },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: URL_SOLAR,
    siteName: "Ökovolt Österreich",
    title: "Ökovolt Solar-Marktwert Österreich",
    description: BESCHREIBUNG,
    images: [{ url: OG_BILD, width: 1200, height: 630, alt: "Ökovolt – Solar-Marktwert Österreich" }],
  },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHREIBUNG, images: [OG_BILD] },
};

const FAQ = [
  {
    q: "Was ist der Solar-Marktwert?",
    a: "Der durchschnittliche Börsenpreis, den Solarstrom in einem Monat erzielt hätte: Jede Viertelstunde wird mit der Menge Solarstrom gewichtet, die in Österreich gerade erzeugt wurde. Weil Photovoltaik vor allem zu Mittag liefert – und dann viele Anlagen gleichzeitig –, liegt dieser Wert meist unter dem einfachen Monatsmittel aller Viertelstunden.",
  },
  {
    q: "Was ist der Unterschied zum Referenzmarktwert der E-Control?",
    a: "Der Referenzmarktwert nach § 13 EAG ist der amtliche Wert, auf dem die EAG-Marktprämie beruht; ihn berechnet die E-Control mit der tatsächlich abgerechneten PV-Einspeisung. Der Ökovolt-Solar-Marktwert ist eine eigene Schätzung mit der öffentlichen Netto-Solarerzeugung laut Energy-Charts als Gewicht. Er ist früher verfügbar und offen nachrechenbar, aber nicht amtlich – für Abrechnungen und Förderungen gilt immer der Wert der E-Control.",
  },
  {
    q: "Was sagt der Marktwertfaktor?",
    a: "Er teilt den Solar-Marktwert durch das ungewichtete Monatsmittel. Ein Faktor von 0,5 heißt: Solarstrom war an der Börse nur halb so viel wert wie Strom im Monatsdurchschnitt. Je mehr Photovoltaik im Netz ist, desto tiefer fällt der Faktor im Frühjahr und Sommer – Fachleute sprechen von Kannibalisierung.",
  },
  {
    q: "Was bedeutet das für meine PV-Anlage?",
    a: "Eingespeister Mittagsstrom bringt an der Börse oft wenig. Je mehr Solarstrom Sie selbst verbrauchen, in einem Speicher in den Abend verschieben oder in steuerbare Verbraucher lenken, desto weniger hängt Ihr Ertrag vom Solar-Marktwert ab. Wie viel Ihre Anlage konkret erlöst, hängt vom Vermarktungsweg ab (OeMAG, Lieferant, Direktvermarktung) – der Index ist dafür eine Orientierung, keine Zusage.",
  },
  {
    q: "Wie oft wird der Wert aktualisiert?",
    a: `Einmal im Monat, sobald Preise und Erzeugung des Vormonats vollständig vorliegen. Aktueller Stand: ${STAND}, Zeitraum ${monatLabel(J.zeitraum.von)} bis ${monatLabel(J.zeitraum.bis)}.`,
  },
];

const tabellenSpalten = [
  { key: "monat", label: "Monat", format: (m) => monatLabel(m) },
  { key: "smwCt", label: "Solar-Marktwert (Ökovolt)", format: (v) => ctText(v, false), rechts: true },
  { key: "mittelCt", label: "Monatsmittel", format: (v) => ctText(v, false), rechts: true },
  { key: "marktwertfaktor", label: "Faktor", format: (v) => (v == null ? "–" : v.toLocaleString("de-AT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })), rechts: true },
  { key: "rmwCt", label: "Referenzmarktwert E-Control", format: (v) => ctText(v, false), rechts: true },
  { key: "negativ", label: "neg. Viertelstd.", format: zahl0, rechts: true },
  { key: "abdeckung", label: "Daten", format: prozent, rechts: true },
];

const faktorText = (f) => (f == null ? "–" : f.toLocaleString("de-AT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

export default function SolarMarktwertPage() {
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${URL_SOLAR}/#dataset`,
    name: J.name,
    description: J.beschreibung,
    url: URL_SOLAR,
    keywords: ["Solar-Marktwert", "Photovoltaik", "Day-Ahead", "Marktwertfaktor", "Gebotszone AT", "Österreich"],
    isAccessibleForFree: true,
    license: J.lizenzUrl,
    creator: { "@id": "https://www.oekovolt.com/#organization" },
    publisher: { "@id": "https://www.oekovolt.com/#organization" },
    isBasedOn: [
      { "@type": "Dataset", name: "Marktpreis Österreich (Day-Ahead) – Bundesnetzagentur | SMARD.de", url: "https://www.smard.de/home/downloadcenter/download-marktdaten/", license: J.lizenzUrl },
      { "@type": "Dataset", name: "Öffentliche Nettostromerzeugung Österreich – Energy-Charts (Fraunhofer ISE)", url: EC_URL, license: J.lizenzUrl },
    ],
    spatialCoverage: { "@type": "Place", name: "Österreich" },
    temporalCoverage: `${J.zeitraum.von}/${J.zeitraum.bis}`,
    dateModified: J.stand,
    measurementTechnique: J.methode.formel,
    variableMeasured: [
      { "@type": "PropertyValue", name: "Solar-Marktwert (PV-gewichteter Day-Ahead-Preis)", unitText: "EUR/MWh" },
      { "@type": "PropertyValue", name: "Day-Ahead-Monatsmittel Gebotszone AT", unitText: "EUR/MWh" },
      { "@type": "PropertyValue", name: "Marktwertfaktor", unitText: "Verhältnis" },
    ],
    distribution: [{ "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `https://www.oekovolt.com${CSV_SOLAR}` }],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <Stil />
      <HeroBild
        breadcrumbs={[{ name: "Wissen", href: "/ratgeber" }, { name: "Strommarkt live", href: "/energie-live" }, { name: "Solar-Marktwert" }]}
        eyebrow="Eigener Marktindex · Gebotszone Österreich"
        title={
          <>
            Solar-Marktwert <span className="ov-text-gradient-light">Österreich</span>
          </>
        }
        lead="Was Solarstrom an der Börse wert ist: der mit der österreichischen PV-Erzeugung gewichtete Day-Ahead-Preis je Monat – neben dem einfachen Monatsmittel, aus offenen Daten und mit offenem Rechenweg."
        image={{ src: "/Images/AT/service-b/solarpark-abend.jpg", alt: "Photovoltaik-Freiflächenanlage im Abendlicht" }}
        ton="tief"
        aside={
          <div className="ov-glass rounded-3xl p-6 md:p-7">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">{monatLabel(LETZTER.monat)}</p>
            <p className="ov-num mt-3 font-display text-[clamp(2.2rem,1.6rem+2.4vw,3.4rem)] font-extrabold leading-none">{ctAusMwh(LETZTER.solarMarktwert)}</p>
            <p className="mt-2 text-[15px] text-white/80">
              Solar-Marktwert · Monatsmittel {ctAusMwh(LETZTER.mittel)} · Faktor {faktorText(LETZTER.marktwertfaktor)}
            </p>
            <p className="mt-4 text-[12.5px] leading-relaxed text-white/60">Ökovolt-Schätzung, nicht amtlich · netto · Stand {STAND}</p>
          </div>
        }
      />
      <Kennzeichnung punkte={["Ökovolt-Schätzung, nicht amtlich", "Kein Ersatz für den Referenzmarktwert der E-Control", "Netto-Börsenwerte vor Entgelten", "Richtwert/Orientierung"]} />

      <Kennzahlen
        frage="Wie viel ist Solarstrom an der Börse in Österreich wert?"
        zahlen={[
          { text: ctAusMwh(LETZTER.solarMarktwert), label: `Solar-Marktwert ${monatLabel(LETZTER.monat)}`, hinweis: "PV-gewichtet, Ökovolt-Schätzung" },
          { text: ctAusMwh(LETZTER.mittel), label: "Monatsmittel aller Viertelstunden", hinweis: "Day-Ahead, Gebotszone AT" },
          { text: faktorText(LETZTER.marktwertfaktor), label: "Marktwertfaktor", hinweis: "Solar-Marktwert ÷ Monatsmittel" },
          { text: TIEFSTER ? faktorText(TIEFSTER.marktwertfaktor) : "–", label: "tiefster Faktor der letzten 12 Monate", hinweis: TIEFSTER ? monatLabel(TIEFSTER.monat) : "" },
        ]}
        fussnote={herkunftSolar}
      >
        <p>
          Im <strong>{monatLabel(LETZTER.monat)}</strong> war Solarstrom an der Börse rund <strong>{ctAusMwh(LETZTER.solarMarktwert)}</strong> wert (netto), der Durchschnittspreis aller
          Viertelstunden lag bei {ctAusMwh(LETZTER.mittel)}. Solarstrom erzielte damit das {faktorText(LETZTER.marktwertfaktor)}-Fache des Monatsmittels.
        </p>
        <p>
          Eigene Schätzung von Ökovolt aus offenen Daten – <strong>nicht amtlich</strong>. Der amtliche Referenzmarktwert der E-Control kann davon abweichen.
        </p>
      </Kennzahlen>

      {/* Monatsbalken */}
      <Section tone="white" space="lg" id="verlauf" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Monatswerte"
          title={
            <>
              Solar-Marktwert und <span className="ov-text-gradient">Monatsmittel</span>
            </>
          }
          lead="Im Frühjahr und Sommer drückt die Mittagsspitze der Photovoltaik den Marktwert von Solarstrom weit unter den Durchschnittspreis; im Winter liegen beide nah beieinander."
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale" className="rounded-3xl bg-sand-50 p-4 ring-1 ring-ink-200/60 sm:p-6 md:p-8">
          <MonatsBalken
            monate={MONATE}
            reihen={[
              { key: "mittelCt", label: "Monatsmittel (ct/kWh)", klasse: "bg-navy-200" },
              { key: "smwCt", label: "Solar-Marktwert Ökovolt (ct/kWh)", klasse: "bg-ov-500" },
            ]}
            format={(v, achse) => (v == null ? "–" : achse ? `${zahl0(v)} ct` : ctText(v))}
            titel={`Balkendiagramm: Solar-Marktwert und Day-Ahead-Monatsmittel in ct/kWh von ${monatLabel(J.zeitraum.von)} bis ${monatLabel(J.zeitraum.bis)}`}
          />
          <p className="mt-5 text-[12.5px] leading-relaxed text-ink-500">{herkunftSolar}</p>
        </Reveal>
      </Section>

      {/* Abgrenzung zur E-Control */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Abgrenzung"
            title="Ökovolt-Schätzung – nicht der amtliche Referenzmarktwert"
            lead="Für die EAG-Marktprämie und jede Abrechnung zählt ausschließlich der Referenzmarktwert der E-Control nach § 13 EAG. Unser Wert ist eine offene, früher verfügbare Orientierung."
          />
          <div className="grid gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 sm:grid-cols-2">
            <div className="bg-navy-950 p-6">
              <p className="flex items-center gap-2 font-display text-[17px] font-bold text-white">
                <Sun aria-hidden="true" className="h-4 w-4 text-ov-300" />
                Ökovolt-Solar-Marktwert
              </p>
              <ul className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-white/70">
                <li>Gewicht: öffentliche Netto-Solarerzeugung Österreich (Energy-Charts)</li>
                <li>Preise: Day-Ahead AT (Bundesnetzagentur | SMARD.de)</li>
                <li>Eigene Berechnung, nicht amtlich, CC BY 4.0</li>
              </ul>
            </div>
            <div className="bg-navy-950 p-6">
              <p className="flex items-center gap-2 font-display text-[17px] font-bold text-white">
                <Landmark aria-hidden="true" className="h-4 w-4 text-ov-300" />
                Referenzmarktwert E-Control
              </p>
              <ul className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-white/70">
                <li>Gewicht: abgerechnete PV-Einspeisung</li>
                <li>Amtlich nach § 13 EAG, Grundlage der Marktprämie</li>
                <li>
                  {LETZTER_MIT_RMW ? `Zuletzt ${monatLabel(LETZTER_MIT_RMW.monat)}: ${ctText(LETZTER_MIT_RMW.rmwCt)}` : "Monatswerte bei der E-Control"} (Stand {RMW_STAND})
                </li>
              </ul>
            </div>
            <p className="bg-navy-950 p-6 text-[14px] leading-relaxed text-white/70 sm:col-span-2">
              Über {MIT_RMW.length} Monate wich unsere Schätzung im Mittel um {ctText(MITTLERE_ABWEICHUNG)} vom Referenzmarktwert ab
              {LETZTER_MIT_RMW ? ` (${monatLabel(LETZTER_MIT_RMW.monat)}: Ökovolt ${ctText(LETZTER_MIT_RMW.smwCt)}, E-Control ${ctText(LETZTER_MIT_RMW.rmwCt)})` : ""}. Abweichungen sind wegen
              der unterschiedlichen Mengenbasis normal. Quelle Referenzmarktwert:{" "}
              <a href={RMW_QUELLE.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ov-300 underline decoration-ov-300/50 underline-offset-2 hover:text-white">
                {RMW_QUELLE.label}
              </a>
              , abgerufen {RMW_QUELLE.abgerufen}.
            </p>
          </div>
        </div>
      </Section>

      {/* Tabelle */}
      <Section tone="sand" space="md" id="tabelle" className="scroll-mt-24">
        <SectionHeading eyebrow="Tabelle" title="Alle Monatswerte" lead="Die Werte aus dem Diagramm in ct/kWh (netto) – neueste Monate oben, mit dem amtlichen Referenzmarktwert zum Vergleich." className="mb-8" />
        <MonatsTabelle monate={MONATE} spalten={tabellenSpalten} beschriftung={`Solar-Marktwert Österreich, Monatswerte ${monatLabel(J.zeitraum.von)} bis ${monatLabel(J.zeitraum.bis)}, Stand ${STAND}`} />
        <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500">
          {herkunftSolar}. Referenzmarktwert: E-Control, Stand {RMW_STAND} („–“ = noch nicht veröffentlicht). „Daten“ = Anteil vorhandener Preis-Viertelstunden.
        </p>
      </Section>

      {/* Methodik + Download */}
      <Section tone="white" space="lg" id="methodik" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Methodik" title="So rechnen wir" lead="Offener Rechenweg – Skript und Testfälle liegen im Quellcode der Website." />
            <dl className="mt-8 grid gap-px overflow-hidden rounded-3xl bg-ink-200/70 ring-1 ring-ink-200/70 sm:grid-cols-2">
              {[
                { icon: Sigma, t: "Formel", d: "Σ (Preis × Solarerzeugung) ÷ Σ Solarerzeugung über alle Viertelstunden des Monats mit Solarerzeugung über null." },
                { icon: Sun, t: "Gewicht", d: "Öffentliche Netto-Solarerzeugung Österreichs je Viertelstunde (Energy-Charts, Reihe Solar)." },
                { icon: Scale, t: "Marktwertfaktor", d: "Solar-Marktwert ÷ ungewichtetes Monatsmittel aller Day-Ahead-Viertelstunden." },
                { icon: Landmark, t: "Preise", d: "Day-Ahead Gebotszone AT von Bundesnetzagentur | SMARD.de; bis 30.09.2025 Stundenpreise als je vier gleiche Viertelstunden." },
              ].map((p) => (
                <div key={p.t} className="bg-white p-5 md:p-6">
                  <dt className="flex items-center gap-2 font-display text-[16px] font-bold text-ink-900">
                    <p.icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
                    {p.t}
                  </dt>
                  <dd className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">{p.d}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 space-y-3 text-[15px] leading-relaxed text-ink-600">
              <p>
                Alle Werte sind <strong className="text-ink-900">Netto-Börsenwerte</strong> vor Vermarktungsentgelt, Ausgleichsenergie und Steuern. Was eine einzelne Anlage erlöst, hängt von
                Ausrichtung, Eigenverbrauch und Vermarktungsweg ab.
              </p>
              <p>
                Datenquellen:{" "}
                <a href={SMARD_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                  Bundesnetzagentur | SMARD.de
                </a>{" "}
                und{" "}
                <a href={EC_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                  Energy-Charts (Fraunhofer ISE)
                </a>
                , jeweils CC BY 4.0.
              </p>
              <p className="text-[13.5px] text-ink-500">
                Rechenregeln: <code className="rounded bg-ink-50 px-1.5 py-0.5 text-[12.5px]">src/lib/marktindizes.js</code> · Erzeugung:{" "}
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-[12.5px]">scripts/marktindizes.mjs</code> · Test:{" "}
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-[12.5px]">scripts/marktindizes.test.mjs</code>
              </p>
            </div>
          </div>
          <Reveal dir="right">
            <DownloadKarte
              href={CSV_SOLAR}
              dateiname="oekovolt-solar-marktwert.csv"
              stand={STAND}
              zitat={`„Ökovolt Solar-Marktwert Österreich, Stand ${STAND}, oekovolt.com/energie-live/solar-marktwert – Daten: Bundesnetzagentur | SMARD.de und Energy-Charts (Fraunhofer ISE), CC BY 4.0“`}
              quellen={J.quellen}
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Solar-Marktwert verständlich erklärt" lead={`Was der Wert zeigt – und was nicht. Stand ${STAND}.`} />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Abschluss
        stand={STAND}
        links={[
          { href: "/energie-live", art: "Live", titel: "Strommarkt Österreich live" },
          { href: "/energie-live/speicher-index", art: "Index", titel: "Speicher-Spread-Index" },
          { href: "/einspeisung-gewerbe", art: "Ratgeber", titel: "Einspeisung im Gewerbe" },
          { href: "/gewerbespeicher", art: "Lösung", titel: "Gewerbespeicher" },
          { href: "/ratgeber/negative-strompreise", art: "Ratgeber", titel: "Negative Strompreise" },
        ]}
        quellen={[
          { titel: "Bundesnetzagentur | SMARD.de – Marktdaten, Großhandelspreise (Marktpreis Österreich)", href: "https://www.smard.de/home/downloadcenter/download-marktdaten/", hinweis: "CC BY 4.0" },
          { titel: "SMARD – Datennutzung: Marktdaten unter CC BY 4.0, Namensnennung „Bundesnetzagentur | SMARD.de“", href: "https://www.smard.de/home/datennutzung" },
          { titel: "Energy-Charts (Fraunhofer ISE) – öffentliche Nettostromerzeugung Österreich", href: EC_URL, hinweis: "CC BY 4.0" },
          { titel: RMW_QUELLE.label, href: RMW_QUELLE.url, hinweis: `abgerufen ${RMW_QUELLE.abgerufen}` },
          { titel: "Creative Commons Namensnennung 4.0 International", href: "https://creativecommons.org/licenses/by/4.0/deed.de" },
        ]}
        quellenTitel="Quellen & Lizenzen"
      />
      <CtaBand
        eyebrow="Mehr Wert aus Solarstrom"
        title="Solarstrom selbst nutzen statt billig einspeisen."
        text="Je tiefer der Solar-Marktwert, desto mehr zählt Eigenverbrauch. Wir planen PV-Anlage, Speicher und Steuerung für Ihren Betrieb – ehrlich durchgerechnet, in ganz Österreich."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Einspeisung im Gewerbe", href: "/einspeisung-gewerbe" }}
      />
    </div>
  );
}
