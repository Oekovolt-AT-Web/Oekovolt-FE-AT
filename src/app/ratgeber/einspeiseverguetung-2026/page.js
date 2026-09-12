// src/app/ratgeber/einspeiseverguetung-2026/page.js

import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, Clock, TrendingDown } from "lucide-react";

import Breadcrumbs from "@/components/Ratgeber/Breadcrumbs";
import FaqAccordion from "@/components/Ratgeber/FaqAccordion";
import ReadingProgress from "@/components/Ratgeber/ReadingProgress";
import TableOfContents from "@/components/Ratgeber/TableOfContents";
import VerguetungsTabelle from "@/components/Ratgeber/VerguetungsTabelle";
import Solarrechner from "@/components/Solarrechner/Rechner";
import EndSection from "@/components/Reusable/end";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { ANNAHMEN } from "@/data/solarrechner";
import { artikelNachSlug, artikelPfad, datumLang } from "@/lib/ratgeber";

const BASE_URL = "https://www.oekovolt.de";
const SLUG = "einspeiseverguetung-2026";
const artikel = artikelNachSlug(SLUG);
const PAGE_URL = `${BASE_URL}${artikelPfad(SLUG)}`;

// Ratgeber-Inhalte sind deutschlandspezifisch (EEG) und existieren nicht auf
// oekovolt.com -> bewusst KEIN hreflang, nur der Canonical.
export const metadata = {
  title: `${artikel.title} | Ökovolt`,
  description: artikel.description,
  keywords: artikel.keywords,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Deutschland",
    title: artikel.title,
    description: artikel.description,
    publishedTime: artikel.veroeffentlicht,
    modifiedTime: artikel.aktualisiert,
    images: [
      {
        url: `${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`,
        width: 1200,
        height: 630,
        alt: artikel.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: artikel.title,
    description: artikel.description,
    images: [`${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`],
  },
};

const TOC = [
  { id: "kurz", label: "Das Wichtigste in Kürze" },
  { id: "saetze", label: "Aktuelle Sätze 2026" },
  { id: "modelle", label: "Überschuss- oder Volleinspeisung?" },
  { id: "dauer", label: "Wie lange gilt mein Satz?" },
  { id: "degression", label: "Warum die Vergütung sinkt" },
  { id: "rechnung", label: "Beispielrechnung 10 kWp" },
  { id: "rechner", label: "Selbst durchrechnen" },
  { id: "aenderung-2027", label: "Was sich 2027 ändert" },
  { id: "faq", label: "Häufige Fragen" },
];

const FAQ = [
  {
    frage: "Wie hoch ist die Einspeisevergütung 2026?",
    antwort: `Für Anlagen bis 10 kWp, die ab dem ${VERGUETUNG.gueltigAbLabel} in Betrieb gehen, liegt die Einspeisevergütung bei ${ct(
      VERGUETUNG.saetze[0].teileinspeisung
    )} ct/kWh bei Überschusseinspeisung und ${ct(
      VERGUETUNG.saetze[0].volleinspeisung
    )} ct/kWh bei Volleinspeisung. Größere Anlagenteile werden gestaffelt niedriger vergütet.`,
  },
  {
    frage: "Wie lange bekomme ich die Einspeisevergütung?",
    antwort: `Der bei Inbetriebnahme gültige Satz ist für ${VERGUETUNG.garantieJahre} volle Kalenderjahre plus den Rest des Inbetriebnahmejahres garantiert. Eine Anlage, die im September 2026 ans Netz geht, wird also bis Ende 2046 mit dem heutigen Satz vergütet – unabhängig davon, wie sich die Sätze für Neuanlagen entwickeln.`,
  },
  {
    frage: "Lohnt sich Volleinspeisung oder Überschusseinspeisung mehr?",
    antwort:
      "Für Privathaushalte lohnt sich in aller Regel die Überschusseinspeisung, weil jede selbst verbrauchte Kilowattstunde rund 30 bis 35 Cent Netzbezug ersetzt – deutlich mehr als die Einspeisevergütung einbringt. Volleinspeisung ist vor allem dann interessant, wenn kaum Eigenverbrauch möglich ist, etwa bei einem zweiten Dach ohne nennenswerten Stromverbrauch.",
  },
  {
    frage: "Sinkt meine Einspeisevergütung nachträglich?",
    antwort:
      "Nein. Die halbjährliche Degression betrifft ausschließlich Anlagen, die nach dem jeweiligen Stichtag neu in Betrieb gehen. Bestehende Anlagen behalten ihren Satz über die gesamte Vergütungsdauer.",
  },
  {
    frage: "Muss ich die Einspeisevergütung versteuern?",
    antwort:
      "Seit 2023 sind Photovoltaikanlagen bis 30 kWp auf Einfamilienhäusern von der Einkommensteuer befreit, und beim Kauf fällt keine Umsatzsteuer an (Nullsteuersatz). Für größere Anlagen oder gewerbliche Konstellationen gelten abweichende Regeln – das sollten Sie steuerlich prüfen lassen.",
  },
  {
    frage: "Was passiert nach 20 Jahren?",
    antwort:
      "Nach dem Ende der EEG-Vergütung kann die Anlage weiterlaufen. Üblich sind dann die sogenannte Anschlussvergütung zum Marktwert, ein Wechsel in die Direktvermarktung oder ein Repowering, bei dem alte Module gegen leistungsstärkere getauscht werden.",
  },
];

// Beispielrechnung – Annahmen bewusst offengelegt, damit die Zahl
// nachvollziehbar bleibt. Ertrag und Strompreis kommen aus @/data/solarrechner,
// damit dieser Artikel nie andere Werte zeigt als der Rechner weiter unten
// auf derselben Seite.
const BEISPIEL = {
  kwp: 10,
  ertragProKwp: ANNAHMEN.ertragProKwpSued,
  eigenverbrauchsquote: 0.3,
  strompreis: ANNAHMEN.strompreis,
};
const jahresertrag = BEISPIEL.kwp * BEISPIEL.ertragProKwp;
const eigenverbrauch = jahresertrag * BEISPIEL.eigenverbrauchsquote;
const eingespeist = jahresertrag - eigenverbrauch;
const satz = VERGUETUNG.saetze[0].teileinspeisung / 100;
const einspeiseErloes = eingespeist * satz;
const eigenverbrauchsErsparnis = eigenverbrauch * BEISPIEL.strompreis;

const eur = (n) =>
  n.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + " €";
const kwh = (n) => n.toLocaleString("de-DE", { maximumFractionDigits: 0 });

export default function EinspeiseverguetungPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}/#article`,
        headline: artikel.title,
        description: artikel.description,
        inLanguage: "de-DE",
        datePublished: artikel.veroeffentlicht,
        dateModified: artikel.aktualisiert,
        author: { "@id": `${BASE_URL}/#organization` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
        image: `${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`,
        articleSection: artikel.kategorie,
        keywords: artikel.keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Ratgeber", item: `${BASE_URL}/ratgeber` },
          { "@type": "ListItem", position: 3, name: artikel.kurzTitel, item: PAGE_URL },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}/#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.frage,
          acceptedAnswer: { "@type": "Answer", text: f.antwort },
        })),
      },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------- Kopfbereich ---------- */}
      <header className="border-b border-gray-200 bg-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-14">
          <Breadcrumbs
            className="mb-6"
            items={[
              { name: "Startseite", href: "/" },
              { name: "Ratgeber", href: "/ratgeber" },
              { name: artikel.kurzTitel },
            ]}
          />

          <p className="mb-3 inline-block text-[13px] font-semibold uppercase tracking-wide text-[#669933]">
            {artikel.kategorie}
          </p>

          <h1 className="max-w-[20ch] text-[30px] font-semibold leading-tight text-gray-900 md:text-[44px]">
            Einspeisevergütung 2026: aktuelle Sätze in ct/kWh
          </h1>

          <p className="mt-5 max-w-[65ch] text-[18px] leading-relaxed text-gray-600">
            {artikel.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-gray-500">
            <span className="flex items-center gap-2">
              <CalendarClock aria-hidden="true" className="h-4 w-4 text-[#669933]" />
              Aktualisiert am{" "}
              <time dateTime={artikel.aktualisiert}>
                {datumLang(artikel.aktualisiert)}
              </time>
            </span>
            <span className="flex items-center gap-2">
              <Clock aria-hidden="true" className="h-4 w-4 text-[#669933]" />
              {artikel.lesezeit} Min. Lesezeit
            </span>
          </div>
        </div>
      </header>

      {/* ---------- Inhalt ---------- */}
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <article className="min-w-0 flex-1">
            <TableOfContents items={TOC} variant="mobile" />

            {/* Kurzfassung – gezielt fuer Featured Snippets */}
            <section aria-labelledby="kurz-heading" className="scroll-mt-28" id="kurz">
              <h2
                id="kurz-heading"
                className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]"
              >
                Das Wichtigste in Kürze
              </h2>
              <ul className="space-y-3 rounded-xl bg-[#f0f7e6] p-6">
                {[
                  `Seit dem ${VERGUETUNG.gueltigAbLabel} gibt es für Anlagen bis 10 kWp ${ct(
                    VERGUETUNG.saetze[0].teileinspeisung
                  )} ct/kWh bei Überschusseinspeisung.`,
                  `Bei Volleinspeisung sind es ${ct(
                    VERGUETUNG.saetze[0].volleinspeisung
                  )} ct/kWh – dafür entfällt der Eigenverbrauch.`,
                  `Der Satz ist ab Inbetriebnahme ${VERGUETUNG.garantieJahre} Jahre plus Restjahr garantiert und sinkt nachträglich nicht.`,
                  `Die nächste Absenkung um ${VERGUETUNG.degressionProHalbjahr} % erfolgt am ${VERGUETUNG.naechsteAnpassungLabel}.`,
                  "Für Privathaushalte ist der Eigenverbrauch fast immer wertvoller als die Einspeisung.",
                ].map((punkt) => (
                  <li key={punkt} className="flex gap-3">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#669933]"
                    />
                    <span className="text-[16px] leading-relaxed text-gray-700">
                      {punkt}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Sätze */}
            <section className="mt-12 scroll-mt-28" id="saetze">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Aktuelle Einspeisevergütung 2026 im Überblick
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Die Einspeisevergütung ist der Betrag, den Ihr Netzbetreiber
                Ihnen für jede Kilowattstunde zahlt, die Sie nicht selbst
                verbrauchen, sondern ins öffentliche Netz abgeben. Wie hoch sie
                ausfällt, hängt von zwei Dingen ab: von der Größe Ihrer Anlage
                und davon, ob Sie überschüssigen Strom einspeisen oder die
                gesamte Erzeugung.
              </p>

              <VerguetungsTabelle />

              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Die Staffelung wirkt anteilig, nicht nach dem
                Alles-oder-nichts-Prinzip. Eine 20-kWp-Anlage bekommt für die
                ersten 10 kWp den höheren Satz und erst für die zweiten 10 kWp
                den niedrigeren – der Mischsatz liegt also dazwischen.
              </p>
            </section>

            {/* Modelle */}
            <section className="mt-12 scroll-mt-28" id="modelle">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Überschusseinspeisung oder Volleinspeisung?
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Auf den ersten Blick wirkt die Volleinspeisung attraktiver – der
                Satz ist deutlich höher. Der Haken: Sie verzichten damit
                vollständig auf den Eigenverbrauch. Und genau der ist für
                Privathaushalte der eigentliche Hebel.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
                  <h3 className="mb-2 text-[18px] font-semibold text-gray-900">
                    Überschusseinspeisung
                  </h3>
                  <p className="mb-4 text-[15px] leading-relaxed text-gray-600">
                    Sie verbrauchen so viel Solarstrom wie möglich selbst und
                    speisen nur den Rest ein. Jede selbst genutzte Kilowattstunde
                    spart den vollen Netzstrompreis.
                  </p>
                  <p className="text-[14px] font-medium text-[#669933]">
                    Der Standard für Ein- und Zweifamilienhäuser.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
                  <h3 className="mb-2 text-[18px] font-semibold text-gray-900">
                    Volleinspeisung
                  </h3>
                  <p className="mb-4 text-[15px] leading-relaxed text-gray-600">
                    Der gesamte Ertrag geht ins Netz, dafür gibt es den höheren
                    Satz. Sinnvoll, wenn am Standort kaum Strom verbraucht wird
                    oder ein zweites Dach separat belegt werden soll.
                  </p>
                  <p className="text-[14px] font-medium text-[#669933]">
                    Muss vor Inbetriebnahme gemeldet werden.
                  </p>
                </div>
              </div>
            </section>

            {/* Dauer */}
            <section className="mt-12 scroll-mt-28" id="dauer">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Wie lange gilt mein Vergütungssatz?
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Entscheidend ist das Datum der Inbetriebnahme. Der an diesem Tag
                gültige Satz wird Ihnen für {VERGUETUNG.garantieJahre} volle
                Kalenderjahre plus den Rest des Inbetriebnahmejahres garantiert.
                Eine Anlage, die im September 2026 ans Netz geht, erhält den
                heutigen Satz also bis Ende 2046.
              </p>
              <div className="mt-6 rounded-xl border-l-4 border-[#669933] bg-gray-50 p-5">
                <p className="text-[15px] leading-relaxed text-gray-700">
                  <strong className="font-semibold text-gray-900">
                    Wichtig:
                  </strong>{" "}
                  Spätere Absenkungen wirken sich nicht rückwirkend aus. Wer
                  heute baut, ist von der Degression im Februar 2027 nicht
                  betroffen.
                </p>
              </div>
            </section>

            {/* Degression */}
            <section className="mt-12 scroll-mt-28" id="degression">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Warum die Einspeisevergütung immer weiter sinkt
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Das EEG sieht eine feste Degression vor: Alle sechs Monate –
                jeweils zum 1. Februar und zum 1. August – sinken die Sätze für
                Neuanlagen um {VERGUETUNG.degressionProHalbjahr} %. Der Gedanke
                dahinter ist, dass Photovoltaik über die Jahre günstiger
                geworden ist und die Förderung entsprechend mitwandern soll.
              </p>
              <div className="mt-6 flex items-start gap-4 rounded-xl bg-[#003473] p-6 text-white">
                <TrendingDown aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" />
                <div>
                  <p className="mb-1 text-[17px] font-semibold">
                    Nächste Absenkung: {VERGUETUNG.naechsteAnpassungLabel}
                  </p>
                  <p className="text-[15px] leading-relaxed text-white/80">
                    Wer die Inbetriebnahme bis dahin abschließt, sichert sich
                    noch die aktuellen {ct(VERGUETUNG.saetze[0].teileinspeisung)}{" "}
                    ct/kWh für die volle Laufzeit.
                  </p>
                </div>
              </div>
            </section>

            {/* Beispielrechnung */}
            <section className="mt-12 scroll-mt-28" id="rechnung">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Beispielrechnung: 10-kWp-Anlage im Allgäu
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Die folgende Rechnung zeigt, warum der Eigenverbrauch für
                Privathaushalte so viel schwerer wiegt als die Einspeisung.
                Angenommen ist eine {BEISPIEL.kwp}-kWp-Anlage mit{" "}
                {kwh(BEISPIEL.ertragProKwp)} kWh Ertrag je kWp – ein realistischer
                Wert für Süddeutschland – und einer Eigenverbrauchsquote von{" "}
                {BEISPIEL.eigenverbrauchsquote * 100} %.
              </p>

              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-white">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                        Jahresertrag
                      </th>
                      <td className="px-4 py-3 tabular-nums text-gray-700">
                        {kwh(jahresertrag)} kWh
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                        davon selbst verbraucht
                      </th>
                      <td className="px-4 py-3 tabular-nums text-gray-700">
                        {kwh(eigenverbrauch)} kWh
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                        davon eingespeist
                      </th>
                      <td className="px-4 py-3 tabular-nums text-gray-700">
                        {kwh(eingespeist)} kWh
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                        Einspeiseerlös ({ct(VERGUETUNG.saetze[0].teileinspeisung)} ct/kWh)
                      </th>
                      <td className="px-4 py-3 tabular-nums font-semibold text-gray-900">
                        {eur(einspeiseErloes)} / Jahr
                      </td>
                    </tr>
                    <tr className="bg-[#f0f7e6]">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                        Ersparnis Eigenverbrauch ({(BEISPIEL.strompreis * 100).toFixed(0)} ct/kWh)
                      </th>
                      <td className="px-4 py-3 tabular-nums font-semibold text-[#669933]">
                        {eur(eigenverbrauchsErsparnis)} / Jahr
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Der selbst verbrauchte Strom bringt in diesem Beispiel rund{" "}
                {eur(eigenverbrauchsErsparnis)} im Jahr, die Einspeisung dagegen
                nur etwa {eur(einspeiseErloes)} – und das bei weniger als der
                Hälfte der Strommenge. Genau deshalb rechnet sich ein{" "}
                <Link
                  href="/produkte/stromspeicher"
                  className="font-medium text-[#669933] underline underline-offset-2 hover:no-underline"
                >
                  Stromspeicher
                </Link>{" "}
                für die meisten Haushalte: Er verschiebt Kilowattstunden von der
                schlecht vergüteten Einspeisung in den gut bezahlten
                Eigenverbrauch.
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
                Beispielrechnung mit gerundeten Werten. Der tatsächliche Ertrag
                hängt von Dachneigung, Ausrichtung, Verschattung und
                Verbrauchsverhalten ab.
              </p>
            </section>

            {/* Rechner */}
            <section className="mt-12 scroll-mt-28" id="rechner">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Rechnen Sie es für Ihr Dach durch
              </h2>
              <p className="mb-6 max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Die Beispielrechnung oben passt selten exakt. Im Rechner setzen
                Sie Ihre eigene Anlagengröße, Ihren Verbrauch und Ihr Dach ein –
                die Einspeisesätze sind dieselben wie in der Tabelle.
              </p>
              <Solarrechner />
            </section>

            {/* 2027 */}
            <section className="mt-12 scroll-mt-28" id="aenderung-2027">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Was sich 2027 ändern soll
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Ende Juli 2026 hat das Bundeskabinett den Entwurf einer
                EEG-Novelle beschlossen. Vorgesehen ist, die feste
                Einspeisevergütung für neue Anlagen auslaufen zu lassen und
                stärker auf marktnahe Modelle wie die Direktvermarktung zu
                setzen. Das Gesetzgebungsverfahren ist noch nicht abgeschlossen,
                Details können sich also ändern.
              </p>
              <p className="mt-4 max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Für Sie heißt das vor allem eines: Wer ohnehin bauen möchte,
                sollte die Inbetriebnahme nicht unnötig aufschieben. Der heute
                geltende Satz bleibt über die gesamte Laufzeit bestehen – auch
                wenn es ihn für Neuanlagen später nicht mehr gibt. Wie die{" "}
                <Link
                  href="/service/direktvermarktung"
                  className="font-medium text-[#669933] underline underline-offset-2 hover:no-underline"
                >
                  Direktvermarktung
                </Link>{" "}
                funktioniert und wann sie sich lohnt, erklären wir separat.
              </p>
            </section>

            {/* FAQ */}
            <section className="mt-12 scroll-mt-28" id="faq">
              <h2 className="mb-6 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Häufige Fragen zur Einspeisevergütung
              </h2>
              <FaqAccordion items={FAQ} />
            </section>

            {/* Weiterführend */}
            <section className="mt-12">
              <h2 className="mb-5 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Passend dazu
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    href: "/produkte/stromspeicher",
                    titel: "Stromspeicher nachrüsten",
                    text: "Mehr Eigenverbrauch statt schlecht vergüteter Einspeisung.",
                  },
                  {
                    href: "/forderungen/landesforderungen",
                    titel: "Förderung nach Bundesland",
                    text: "Welche Zuschüsse es zusätzlich zur EEG-Vergütung gibt.",
                  },
                  {
                    href: "/service/repowering",
                    titel: "Repowering nach 20 Jahren",
                    text: "Was mit der Anlage passiert, wenn die Vergütung ausläuft.",
                  },
                  {
                    href: "/produkte/photovoltaikanlage",
                    titel: "PV-Anlage im Allgäu",
                    text: "Planung, Montage und Anmeldung aus einer Hand.",
                  },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group rounded-xl border border-gray-100 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <p className="mb-1 flex items-center gap-2 text-[17px] font-semibold text-gray-900 transition-colors group-hover:text-[#669933]">
                      {l.titel}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      />
                    </p>
                    <p className="text-[15px] leading-relaxed text-gray-600">
                      {l.text}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </article>

          {/* Sidebar – nur ab lg, mobil uebernimmt das <details> im Artikel */}
          <aside className="hidden shrink-0 lg:block lg:w-[260px]">
            <TableOfContents items={TOC} variant="desktop" />
          </aside>
        </div>
      </div>

      <EndSection />
    </>
  );
}
