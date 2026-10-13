// energie-live/speicher-index/page.js – Ökovolt Speicher-Spread-Index Österreich (B10)
//
// Eigener Marktindex aus offenen Day-Ahead-Preisen (Bundesnetzagentur | SMARD.de, CC BY 4.0):
// theoretischer Spread-Erlös eines 1-MWh/0,5-MW-Speichers – Obergrenze, keine Erlöszusage.
// Daten: data/marktindizes/speicher-spread-index.json (scripts/marktindizes.mjs, monatlich manuell).

import { BatteryCharging, Calculator, CalendarClock, LineChart, TrendingDown } from "lucide-react";
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
import { CSV_SPEICHER, EC_URL, SMARD_URL, SPEICHER_INDEX, URL_SPEICHER, datumText, eur, eur2, herkunft, monatLabel, prozent, summeLetzte, zahl0, zahl1 } from "../_marktindizes/daten";

const J = SPEICHER_INDEX;
const MONATE = J.monate;
const LETZTER = MONATE[MONATE.length - 1];
const VORJAHR = MONATE.find((m) => m.monat === `${Number(LETZTER.monat.slice(0, 4)) - 1}${LETZTER.monat.slice(4)}`);
const SUMME_12 = summeLetzte(MONATE, "spreadErloesEur", 12);
const NEGATIV_12 = summeLetzte(MONATE, "negativ", 12);
const RT = Math.round(J.annahmen.roundTrip * 100);
/** Round-Trip als Energiemenge je geladener MWh, zwei Nachkommastellen (0,88 – nicht auf 0,9 gerundet) */
const RT_MWH = J.annahmen.roundTrip.toLocaleString("de-AT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const STAND = datumText(J.stand);
const OG_BILD = "https://www.oekovolt.com/og-image.jpg";

const TITEL = "Speicher-Spread-Index Österreich: Batterie-Erlös am Day-Ahead-Markt | Ökovolt";
const BESCHREIBUNG = `Eigener Marktindex: theoretischer Spread-Erlös eines 1-MWh-Batteriespeichers am Day-Ahead-Markt Österreich – ${monatLabel(LETZTER.monat)} höchstens ${eur(LETZTER.spreadErloesEur)}. Monatswerte seit 2024, Methodik offen, CSV (CC BY 4.0).`;

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["Speicher-Spread-Index", "Batteriespeicher Erlös Österreich", "Day-Ahead Spread Österreich", "Arbitrage Batteriespeicher", "negative Strompreise Österreich", "Großspeicher Wirtschaftlichkeit"],
  alternates: { canonical: URL_SPEICHER },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: URL_SPEICHER,
    siteName: "Ökovolt Österreich",
    title: "Ökovolt Speicher-Spread-Index Österreich",
    description: BESCHREIBUNG,
    images: [{ url: OG_BILD, width: 1200, height: 630, alt: "Ökovolt – Speicher-Spread-Index Österreich" }],
  },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHREIBUNG, images: [OG_BILD] },
};

const FAQ = [
  {
    q: "Was misst der Speicher-Spread-Index?",
    a: `Er zeigt, wie viel ein Batteriespeicher mit 1 MWh nutzbarer Kapazität und 0,5 MW Leistung in einem Monat höchstens hätte verdienen können, wenn er jeden Tag einmal in den günstigsten Viertelstunden lädt und in den teuersten entlädt – gerechnet mit den Day-Ahead-Preisen der Gebotszone Österreich und ${RT} % Round-Trip-Wirkungsgrad. Der Index macht sichtbar, wie stark die Tagesschwankung der Strompreise ist und wie sie sich über die Monate entwickelt.`,
  },
  {
    q: "Warum ist das eine Obergrenze und keine Erlösprognose?",
    a: "Weil der Index mit perfekter Voraussicht rechnet: Er kennt die Preise des ganzen Tages und wählt die besten Viertelstunden, ohne darauf zu achten, ob das Laden zeitlich vor dem Entladen liegt. Netzentgelte, Abgaben, Vermarktungsentgelte, Alterung der Zellen, Ausfallzeiten und Prognosefehler sind nicht abgezogen. Ein realer Speicher erzielt am Day-Ahead-Markt deshalb weniger – und kann zusätzlich Erlöse aus Intraday-Handel, Regelenergie oder Spitzenkappung haben, die hier nicht enthalten sind.",
  },
  {
    q: "Ist der Index ein amtlicher Wert?",
    a: "Nein. Es ist eine eigene Berechnung von Ökovolt Österreich aus offenen Daten der Bundesnetzagentur (SMARD.de, Lizenz CC BY 4.0). Rechenweg, Skript und Testfälle sind offengelegt, damit jede Zahl nachvollziehbar ist. Für Förderentscheidungen, Verträge oder Bankunterlagen ist eine projektbezogene Wirtschaftlichkeitsrechnung nötig.",
  },
  {
    q: "Warum steigt der Index seit Oktober 2025?",
    a: "Unter anderem, weil der Day-Ahead-Markt seit 1. Oktober 2025 in Viertelstunden statt in Stunden handelt. Ein Speicher kann damit gezielter in die extremsten Viertelstunden laden und entladen. Bis September 2025 rechnet der Index mit Stundenpreisen (je vier gleiche Viertelstunden). Daneben wirken mehr Solarstrom zu Mittag, mehr negative Preise im Frühjahr und hohe Abendpreise im Herbst.",
  },
  {
    q: "Was bedeuten die negativen Viertelstunden?",
    a: "Das ist die Zahl der Viertelstunden im Monat, in denen der Day-Ahead-Preis der Gebotszone AT unter null lag. In diesen Zeiten wird man fürs Laden bezahlt – sie heben den Spread deutlich. Für PV-Anlagen ohne Speicher bedeuten sie dagegen, dass eingespeister Strom an der Börse nichts wert ist.",
  },
  {
    q: "Wie oft wird der Index aktualisiert?",
    a: `Einmal im Monat, sobald der Vormonat vollständig veröffentlicht ist. Der aktuelle Stand ist der ${STAND}, der Zeitraum reicht von ${monatLabel(J.zeitraum.von)} bis ${monatLabel(J.zeitraum.bis)}.`,
  },
];

const tabellenSpalten = [
  { key: "monat", label: "Monat", format: (m) => monatLabel(m) },
  { key: "spreadErloesEur", label: "Spread-Erlös / Monat", format: eur, rechts: true },
  { key: "spreadProTag", label: "je Tag", format: eur2, rechts: true },
  { key: "mittel", label: "Ø Preis €/MWh", format: (v) => zahl1(v), rechts: true },
  { key: "min", label: "Min €/MWh", format: (v) => zahl1(v), rechts: true },
  { key: "max", label: "Max €/MWh", format: (v) => zahl1(v), rechts: true },
  { key: "negativ", label: "neg. Viertelstd.", format: zahl0, rechts: true },
  { key: "abdeckung", label: "Daten", format: prozent, rechts: true },
];

export default function SpeicherIndexPage() {
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${URL_SPEICHER}/#dataset`,
    name: J.name,
    description: J.beschreibung,
    url: URL_SPEICHER,
    keywords: ["Batteriespeicher", "Day-Ahead", "Spread", "Arbitrage", "negative Strompreise", "Gebotszone AT", "Österreich"],
    isAccessibleForFree: true,
    license: J.lizenzUrl,
    creator: { "@id": "https://www.oekovolt.com/#organization" },
    publisher: { "@id": "https://www.oekovolt.com/#organization" },
    isBasedOn: [
      { "@type": "Dataset", name: "Marktpreis Österreich (Day-Ahead) – Bundesnetzagentur | SMARD.de", url: "https://www.smard.de/home/downloadcenter/download-marktdaten/", license: J.lizenzUrl },
    ],
    spatialCoverage: { "@type": "Place", name: "Österreich" },
    temporalCoverage: `${J.zeitraum.von}/${J.zeitraum.bis}`,
    dateModified: J.stand,
    measurementTechnique: `Perfekte Voraussicht, ${J.annahmen.kapazitaetMwh} MWh / ${J.annahmen.leistungMw} MW, 1 Vollzyklus pro Tag, Round-Trip ${RT} %`,
    variableMeasured: [
      { "@type": "PropertyValue", name: "Theoretischer Spread-Erlös je Monat", unitText: "EUR" },
      { "@type": "PropertyValue", name: "Day-Ahead-Monatsmittel Gebotszone AT", unitText: "EUR/MWh" },
      { "@type": "PropertyValue", name: "Negative Viertelstunden", unitText: "Anzahl" },
    ],
    distribution: [{ "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `https://www.oekovolt.com${CSV_SPEICHER}` }],
  };

  const vergleich = VORJAHR?.spreadErloesEur
    ? ` Im ${monatLabel(VORJAHR.monat)} waren es ${eur(VORJAHR.spreadErloesEur)}.`
    : "";

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
      <Stil />
      <HeroBild
        breadcrumbs={[{ name: "Wissen", href: "/ratgeber" }, { name: "Strommarkt live", href: "/energie-live" }, { name: "Speicher-Spread-Index" }]}
        eyebrow="Eigener Marktindex · Gebotszone Österreich"
        title={
          <>
            Speicher-Spread-Index <span className="ov-text-gradient-light">Österreich</span>
          </>
        }
        lead={`Was ein Batteriespeicher mit 1 MWh am Day-Ahead-Markt höchstens hätte verdienen können – Monat für Monat seit ${monatLabel(J.zeitraum.von)}, aus offenen Daten der Bundesnetzagentur, mit offenem Rechenweg.`}
        image={{ src: "/Images/AT/loesungen/gewerbespeicher-batteriecontainer.jpg", alt: "Batteriespeicher-Container auf einem Betriebsgelände", position: "70% 50%" }}
        ton="tief"
        aside={
          <div className="ov-glass rounded-3xl p-6 md:p-7">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">{monatLabel(LETZTER.monat)}</p>
            <p className="ov-num mt-3 font-display text-[clamp(2.2rem,1.6rem+2.4vw,3.4rem)] font-extrabold leading-none">{eur(LETZTER.spreadErloesEur)}</p>
            <p className="mt-2 text-[15px] text-white/80">theoretischer Spread-Erlös je MWh Speicher und Monat</p>
            <p className="mt-4 text-[12.5px] leading-relaxed text-white/60">Obergrenze bei perfekter Voraussicht · Ökovolt-Schätzung, nicht amtlich · Stand {STAND}</p>
          </div>
        }
      />
      <Kennzeichnung punkte={["Theoretische Obergrenze, keine Erlöszusage", "Ökovolt-Schätzung, nicht amtlich", "Ohne Netzentgelte, Abgaben, Alterung", "Richtwert/Orientierung"]} />

      <Kennzahlen
        frage="Was hätte ein Batteriespeicher in Österreich am Day-Ahead-Markt höchstens verdient?"
        zahlen={[
          { text: eur(LETZTER.spreadErloesEur), label: `Spread-Erlös ${monatLabel(LETZTER.monat)}`, hinweis: "1 MWh / 0,5 MW · Obergrenze" },
          { text: SUMME_12 == null ? "–" : eur(SUMME_12), label: "Summe der letzten 12 Monate", hinweis: "Obergrenze, vor Kosten" },
          { text: eur2(LETZTER.spreadProTag), label: "im Schnitt je Tag", hinweis: `${monatLabel(LETZTER.monat)} · 1 Vollzyklus` },
          { text: zahl0(NEGATIV_12), label: "negative Viertelstunden", hinweis: "letzte 12 Monate, Gebotszone AT" },
        ]}
        fussnote={herkunft(J.stand)}
      >
        <p>
          Im <strong>{monatLabel(LETZTER.monat)}</strong> hätte ein Speicher mit 1 MWh nutzbarer Kapazität und 0,5 MW Leistung bei einem Vollzyklus pro Tag und {RT}&nbsp;% Wirkungsgrad
          höchstens <strong>{eur(LETZTER.spreadErloesEur)}</strong> Spread-Erlös am Day-Ahead-Markt erzielt.{vergleich}
        </p>
        <p>
          Das ist eine <strong>theoretische Obergrenze</strong> mit perfekter Voraussicht – reale Erlöse liegen darunter, Kosten sind nicht abgezogen. Keine Erlöszusage.
        </p>
      </Kennzahlen>

      {/* Monatsbalken */}
      <Section tone="white" space="lg" id="verlauf" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Monatswerte"
          title={
            <>
              Spread-Erlös je Monat – <span className="ov-text-gradient">1 MWh Speicher</span>
            </>
          }
          lead="Jeder Balken zeigt die Obergrenze des Day-Ahead-Spread-Erlöses eines Monats. Seit Oktober 2025 handelt der Markt in Viertelstunden – davor in Stunden."
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale" className="rounded-3xl bg-sand-50 p-4 ring-1 ring-ink-200/60 sm:p-6 md:p-8">
          <MonatsBalken
            monate={MONATE}
            reihen={[{ key: "spreadErloesEur", label: "Spread-Erlös", klasse: "bg-ov-500" }]}
            format={(v, achse) => (v == null ? "–" : achse ? `${zahl0(v)} €` : eur(v))}
            titel={`Balkendiagramm: theoretischer Spread-Erlös je Monat von ${monatLabel(J.zeitraum.von)} bis ${monatLabel(J.zeitraum.bis)}`}
          />
          <p className="mt-5 text-[12.5px] leading-relaxed text-ink-500">{herkunft(J.stand)} · theoretische Obergrenze</p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <Reveal className="rounded-3xl bg-white p-4 ring-1 ring-ink-200/60 sm:p-6">
            <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
              <TrendingDown aria-hidden="true" className="h-4 w-4 text-navy-600" />
              Negative Viertelstunden je Monat
            </h3>
            <p className="mb-5 mt-1 text-[14px] text-ink-600">Day-Ahead-Preis der Gebotszone AT unter null – vor allem an sonnigen Frühjahrs- und Sommertagen zu Mittag.</p>
            <MonatsBalken
              monate={MONATE}
              reihen={[{ key: "negativ", label: "negative Viertelstunden", klasse: "bg-navy-600" }]}
              format={(v) => (v == null ? "–" : zahl0(v))}
              titel="Balkendiagramm: Zahl der negativen Viertelstunden je Monat"
              hoehe="h-40 md:h-48"
              markiereLetzten={false}
            />
          </Reveal>
          <Reveal delay={80} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
            <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
              <LineChart aria-hidden="true" className="h-4 w-4 text-ov-600" />
              So lesen Sie den Index
            </h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-600">
              <li>
                <strong className="text-ink-900">Hoher Index</strong> = große Preisunterschiede innerhalb eines Tages: viel Solarstrom zu Mittag, teure Abende, negative Preise.
              </li>
              <li>
                <strong className="text-ink-900">Niedriger Index</strong> = flache Tage, etwa im Winter bei wenig Sonne und gleichmäßig hohen Preisen.
              </li>
              <li>
                <strong className="text-ink-900">Andere Speichergrößen</strong>: grob proportional zur Kapazität bei gleichem Verhältnis von Leistung zu Kapazität (0,5 C). Je kWh nutzbarer
                Kapazität waren es im {monatLabel(LETZTER.monat)} höchstens {eur2(LETZTER.spreadJeKwh)}.
              </li>
              <li>
                <strong className="text-ink-900">Betrieb mit Eigenverbrauch</strong>: Ein Gewerbespeicher verdient vor allem über Spitzenkappung und Eigenverbrauch – der Index zeigt nur den Börsenanteil.
              </li>
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Tabelle */}
      <Section tone="sand" space="md" id="tabelle" className="scroll-mt-24">
        <SectionHeading eyebrow="Tabelle" title="Alle Monatswerte" lead="Die Werte aus den Diagrammen – neueste Monate oben. Preise netto in €/MWh (1 €/MWh = 0,1 ct/kWh)." className="mb-8" />
        <MonatsTabelle monate={MONATE} spalten={tabellenSpalten} beschriftung={`Speicher-Spread-Index Österreich, Monatswerte ${monatLabel(J.zeitraum.von)} bis ${monatLabel(J.zeitraum.bis)}, Stand ${STAND}`} />
        <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500">
          {herkunft(J.stand)}. „Daten“ = Anteil vorhandener Viertelstunden im Monat. Spread-Erlös: Tagesmittel aller vollständigen Tage × Kalendertage.
        </p>
      </Section>

      {/* Methodik + Download */}
      <Section tone="white" space="lg" id="methodik" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Methodik" title="Offener Rechenweg" lead="Jede Zahl lässt sich aus den Rohdaten nachrechnen – Skript und Testfälle liegen im Quellcode der Website." />
            <dl className="mt-8 grid gap-px overflow-hidden rounded-3xl bg-ink-200/70 ring-1 ring-ink-200/70 sm:grid-cols-2">
              {[
                { icon: BatteryCharging, t: "Speicher", d: `${zahl1(J.annahmen.kapazitaetMwh)} MWh nutzbar, ${zahl1(J.annahmen.leistungMw)} MW Lade- und Entladeleistung (8 Viertelstunden für eine volle Ladung).` },
                { icon: CalendarClock, t: "Ein Vollzyklus pro Tag", d: "Je Kalendertag (Wiener Zeit) werden die 8 günstigsten Viertelstunden geladen und die 8 teuersten entladen." },
                { icon: Calculator, t: `Round-Trip ${RT} %`, d: `Geladen wird 1 MWh, zurück ins Netz gehen ${RT_MWH} MWh. Erlös = Entladepreis × ${RT_MWH} MWh − Ladepreis × 1 MWh.` },
                { icon: LineChart, t: "Perfekte Voraussicht", d: "Ohne Bedingung, dass das Laden zeitlich vor dem Entladen liegt, ohne Prognosefehler – deshalb eine Obergrenze." },
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
                <strong className="text-ink-900">Nicht enthalten</strong> sind Netzentgelte für Bezug und Einspeisung, Elektrizitätsabgabe, Vermarktungs- und Bilanzierungsentgelte, Zellalterung,
                Ausfallzeiten, Intraday-Handel, Regelenergie und Spitzenkappung. Für ein konkretes Projekt rechnen wir diese Posten einzeln.
              </p>
              <p>
                <strong className="text-ink-900">Datengrundlage</strong>: Day-Ahead-Preise der Gebotszone Österreich von{" "}
                <a href={SMARD_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                  Bundesnetzagentur | SMARD.de
                </a>{" "}
                (CC BY 4.0), Viertelstundenwerte; bis 30.09.2025 Stundenpreise als je vier gleiche Viertelstunden. Nur Tage mit mindestens 90&nbsp;% der Viertelstunden zählen; der Monatswert ist das
                Tagesmittel × Kalendertage. Die Strommix-Daten auf{" "}
                <a href={EC_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                  Energy-Charts (Fraunhofer ISE)
                </a>{" "}
                fließen in diesen Index nicht ein.
              </p>
              <p className="text-[13.5px] text-ink-500">
                Rechenregeln: <code className="rounded bg-ink-50 px-1.5 py-0.5 text-[12.5px]">src/lib/marktindizes.js</code> · Erzeugung:{" "}
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-[12.5px]">scripts/marktindizes.mjs</code> · Test mit festen Preisreihen:{" "}
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-[12.5px]">scripts/marktindizes.test.mjs</code>
              </p>
            </div>
          </div>
          <Reveal dir="right">
            <DownloadKarte
              href={CSV_SPEICHER}
              dateiname="oekovolt-speicher-spread-index.csv"
              stand={STAND}
              zitat={`„Ökovolt Speicher-Spread-Index Österreich, Stand ${STAND}, oekovolt.com/energie-live/speicher-index – Daten: Bundesnetzagentur | SMARD.de, CC BY 4.0“`}
              quellen={J.quellen.filter((q) => q.url.includes("smard"))}
            />
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Speicher-Spread-Index verständlich erklärt" lead={`Was der Index zeigt – und was nicht. Stand ${STAND}.`} />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Abschluss
        stand={STAND}
        links={[
          { href: "/energie-live", art: "Live", titel: "Strommarkt Österreich live" },
          { href: "/energie-live/solar-marktwert", art: "Index", titel: "Solar-Marktwert Österreich" },
          { href: "/gewerbespeicher", art: "Lösung", titel: "Gewerbespeicher" },
          { href: "/rechner/peak-shaving", art: "Rechner", titel: "Peak-Shaving-Rechner" },
          { href: "/ratgeber/negative-strompreise", art: "Ratgeber", titel: "Negative Strompreise" },
        ]}
        quellen={[
          { titel: "Bundesnetzagentur | SMARD.de – Marktdaten, Großhandelspreise (Marktpreis Österreich)", href: "https://www.smard.de/home/downloadcenter/download-marktdaten/", hinweis: "CC BY 4.0" },
          { titel: "SMARD – Datennutzung: Marktdaten unter CC BY 4.0, Namensnennung „Bundesnetzagentur | SMARD.de“", href: "https://www.smard.de/home/datennutzung" },
          { titel: "Creative Commons Namensnennung 4.0 International", href: "https://creativecommons.org/licenses/by/4.0/deed.de" },
        ]}
        quellenTitel="Quellen & Lizenzen"
      />
      <CtaBand
        eyebrow="Vom Index zum Projekt"
        title="Was verdient ein Speicher in Ihrem Betrieb?"
        text="Der Index zeigt den Börsenanteil. In Ihrem Betrieb zählen Lastspitzen, Eigenverbrauch und Tarif. Wir rechnen Ihren Speicher mit Ihren Lastgangdaten durch – nachvollziehbar und ohne Erlösversprechen."
        primary={{ label: "Speicherprojekt anfragen", href: "/angebot" }}
        secondary={{ label: "Peak-Shaving-Rechner", href: "/rechner/peak-shaving" }}
      />
    </div>
  );
}
