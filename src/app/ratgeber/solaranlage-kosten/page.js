// src/app/ratgeber/solaranlage-kosten/page.js

import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, Clock, Info } from "lucide-react";

import Breadcrumbs from "@/components/Ratgeber/Breadcrumbs";
import FaqAccordion from "@/components/Ratgeber/FaqAccordion";
import ReadingProgress from "@/components/Ratgeber/ReadingProgress";
import TableOfContents from "@/components/Ratgeber/TableOfContents";
import Solarrechner from "@/components/Solarrechner/Rechner";
import EndSection from "@/components/Reusable/end";
import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { artikelNachSlug, artikelPfad, datumLang } from "@/lib/ratgeber";

const BASE_URL = "https://www.oekovolt.de";
const SLUG = "solaranlage-kosten";
const artikel = artikelNachSlug(SLUG);
const PAGE_URL = `${BASE_URL}${artikelPfad(SLUG)}`;

// Preise sind deutschlandspezifisch (Nullsteuersatz, EEG) -> kein hreflang.
export const metadata = {
  title: "Was kostet eine Solaranlage 2026? Preise je kWp | Ökovolt",
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
  { id: "preise", label: "Preise nach Anlagengröße" },
  { id: "bestandteile", label: "Woraus sich der Preis ergibt" },
  { id: "speicher", label: "Was kostet ein Stromspeicher?" },
  { id: "laufend", label: "Laufende Kosten" },
  { id: "steuer", label: "Steuern: der Nullsteuersatz" },
  { id: "rechner", label: "Ihr Fall durchgerechnet" },
  { id: "sparen", label: "Worauf Sie achten sollten" },
  { id: "faq", label: "Häufige Fragen" },
];

// Preistabelle direkt aus derselben Quelle wie der Solarrechner – so kann
// der Artikel nie andere Zahlen zeigen als das Rechenwerkzeug.
const GROESSEN = [5, 8, 10, 15, 20, 30];

const FAQ = [
  {
    frage: "Was kostet eine Solaranlage mit 10 kWp?",
    antwort: `Eine schlüsselfertige 10-kWp-Anlage liegt aktuell bei rund ${Math.round(
      10 * preisProKwp(10)
    ).toLocaleString("de-DE")} € inklusive Montage, Wechselrichter und Anmeldung. Mit einem 8-kWh-Stromspeicher kommen etwa ${(
      8 * ANNAHMEN.speicherPreisProKwh
    ).toLocaleString("de-DE")} € dazu. Der genaue Preis hängt von Dachform, Eindeckung, Zugänglichkeit und Elektroinstallation ab.`,
  },
  {
    frage: "Warum wird der Preis je kWp bei größeren Anlagen günstiger?",
    antwort:
      "Ein erheblicher Teil der Kosten fällt unabhängig von der Anlagengröße an: Gerüst, Anfahrt, Planung, Zählerschrank, Anmeldung beim Netzbetreiber. Diese Fixkosten verteilen sich bei einer größeren Anlage auf mehr Kilowatt-Peak, dadurch sinkt der Preis je kWp spürbar.",
  },
  {
    frage: "Fällt beim Kauf einer PV-Anlage Umsatzsteuer an?",
    antwort:
      "Für Photovoltaikanlagen auf und an Wohngebäuden gilt seit 2023 der Nullsteuersatz: Auf Lieferung und Installation fallen 0 % Umsatzsteuer an. Das gilt auch für den Stromspeicher, wenn er zusammen mit der Anlage angeschafft wird. Die genannten Preise sind damit Endpreise.",
  },
  {
    frage: "Welche laufenden Kosten hat eine Photovoltaikanlage?",
    antwort: `Kalkulieren Sie rund ${ANNAHMEN.betriebskostenProKwp} € je kWp und Jahr für Versicherung, Wartung, Zählermiete und Rücklagen. Bei einer 10-kWp-Anlage sind das etwa ${(
      10 * ANNAHMEN.betriebskostenProKwp
    ).toLocaleString("de-DE")} € im Jahr. Module selbst sind wartungsarm, der Wechselrichter wird typischerweise einmal in der Laufzeit getauscht.`,
  },
  {
    frage: "Lohnt sich die günstigste Anlage?",
    antwort:
      "Selten. Der Unterschied zwischen einem günstigen und einem sehr günstigen Angebot liegt meist nicht bei den Modulen, sondern bei Unterkonstruktion, Kabelquerschnitten, Blitzschutz und der Sorgfalt der Montage. Reparaturen an einem undichten Dach kosten mehr, als beim Angebot gespart wurde.",
  },
  {
    frage: "Wie lange dauert es, bis sich die Anlage rechnet?",
    antwort: `Bei heutigen Einspeisesätzen von ${ct(
      VERGUETUNG.saetze[0].teileinspeisung
    )} ct/kWh liegt die Amortisation typischerweise zwischen 12 und 18 Jahren – abhängig vor allem davon, wie viel Strom Sie selbst verbrauchen. Da die Anlage 25 Jahre und länger läuft, bleibt danach ein deutlicher Überschuss.`,
  },
];

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";

export default function SolaranlageKostenPage() {
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
            Was kostet eine Solaranlage 2026?
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

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <article className="min-w-0 flex-1">
            <TableOfContents items={TOC} variant="mobile" />

            <section aria-labelledby="kurz-heading" className="scroll-mt-28" id="kurz">
              <h2
                id="kurz-heading"
                className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]"
              >
                Das Wichtigste in Kürze
              </h2>
              <ul className="space-y-3 rounded-xl bg-[#f0f7e6] p-6">
                {[
                  `Eine schlüsselfertige Anlage kostet je nach Größe rund ${Math.round(
                    preisProKwp(30)
                  ).toLocaleString("de-DE")} bis ${Math.round(
                    preisProKwp(5)
                  ).toLocaleString("de-DE")} € je kWp.`,
                  `Für eine typische 10-kWp-Anlage sind das etwa ${eur(
                    10 * preisProKwp(10)
                  )} inklusive Montage und Anmeldung.`,
                  `Ein Stromspeicher schlägt mit rund ${ANNAHMEN.speicherPreisProKwh.toLocaleString(
                    "de-DE"
                  )} € je kWh Kapazität zu Buche.`,
                  "Auf Wohngebäuden fällt seit 2023 keine Umsatzsteuer an – der genannte Preis ist der Endpreis.",
                  `Laufend kommen etwa ${ANNAHMEN.betriebskostenProKwp} € je kWp und Jahr für Versicherung, Wartung und Zähler dazu.`,
                ].map((p) => (
                  <li key={p} className="flex gap-3">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#669933]"
                    />
                    <span className="text-[16px] leading-relaxed text-gray-700">{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 scroll-mt-28" id="preise">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Was kostet eine Photovoltaikanlage nach Größe?
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Der Preis je Kilowatt-Peak sinkt mit der Anlagengröße, weil sich
                die Fixkosten auf mehr Leistung verteilen. Die folgenden Werte
                sind Richtwerte für eine schlüsselfertige Anlage auf einem
                Schrägdach mit normaler Zugänglichkeit.
              </p>

              <figure className="my-8">
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
                    <caption className="sr-only">
                      Richtpreise für Photovoltaikanlagen nach Anlagengröße
                    </caption>
                    <thead>
                      <tr className="bg-[#003473] text-white">
                        <th scope="col" className="px-4 py-3 font-semibold">Anlagengröße</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Preis je kWp</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Gesamtpreis</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Dachfläche</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {GROESSEN.map((g, i) => (
                        <tr key={g} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                          <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                            {g} kWp
                          </th>
                          <td className="px-4 py-3 tabular-nums text-gray-700">
                            {eur(preisProKwp(g))}
                          </td>
                          <td className="px-4 py-3 tabular-nums">
                            <span className="font-semibold text-[#669933]">
                              {eur(g * preisProKwp(g))}
                            </span>
                          </td>
                          <td className="px-4 py-3 tabular-nums text-gray-700">
                            ca. {g * ANNAHMEN.qmProKwp} m²
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <figcaption className="mt-3 text-[13px] leading-relaxed text-gray-500">
                  Richtwerte ohne Stromspeicher, inklusive Montage,
                  Wechselrichter, Unterkonstruktion und Anmeldung. Endpreise –
                  auf Wohngebäuden fällt keine Umsatzsteuer an.
                </figcaption>
              </figure>
            </section>

            <section className="mt-12 scroll-mt-28" id="bestandteile">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Woraus sich der Preis zusammensetzt
              </h2>
              <p className="mb-6 max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Viele rechnen mit dem Modulpreis und wundern sich über das
                Angebot. Tatsächlich machen die Module nur etwa ein Drittel aus –
                der Rest ist Technik rundherum und Arbeit auf dem Dach.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Module", "Rund ein Drittel der Kosten. Unterschiede liegen in Wirkungsgrad, Garantiedauer und Degradationsverhalten."],
                  ["Wechselrichter", "Wandelt Gleich- in Wechselstrom. Wird meist einmal in der Laufzeit getauscht – Qualität zahlt sich hier aus."],
                  ["Unterkonstruktion", "Muss zur Eindeckung und zur Dachstatik passen. Der Posten, an dem am wenigsten gespart werden sollte."],
                  ["Montage & Gerüst", "Arbeitszeit auf dem Dach, Gerüst und Anfahrt. Weitgehend unabhängig von der Anlagengröße."],
                  ["Elektroinstallation", "Verkabelung, Überspannungsschutz, oft ein neuer Zählerschrank."],
                  ["Planung & Anmeldung", "Auslegung, Netzanmeldung, Marktstammdatenregister, Inbetriebnahmeprotokoll."],
                ].map(([t, d]) => (
                  <div
                    key={t}
                    className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                  >
                    <h3 className="mb-1.5 text-[17px] font-semibold text-gray-900">{t}</h3>
                    <p className="text-[15px] leading-relaxed text-gray-600">{d}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 scroll-mt-28" id="speicher">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Was kostet ein Stromspeicher?
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Rechnen Sie mit rund{" "}
                {ANNAHMEN.speicherPreisProKwh.toLocaleString("de-DE")} € je
                Kilowattstunde Kapazität, inklusive Einbau. Ein 8-kWh-Speicher
                kostet damit etwa {eur(8 * ANNAHMEN.speicherPreisProKwh)}. Als
                Faustregel genügt rund 1 kWh Speicher je 1.000 kWh
                Jahresverbrauch – ein größerer Speicher steht im Winter meist
                ungenutzt herum.
              </p>
              <div className="mt-6 flex items-start gap-4 rounded-xl border-l-4 border-[#669933] bg-gray-50 p-5">
                <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#669933]" />
                <p className="text-[15px] leading-relaxed text-gray-700">
                  Der Speicher rechnet sich nicht über die Einspeisung, sondern
                  über den Eigenverbrauch: Er verschiebt Kilowattstunden von{" "}
                  {ct(VERGUETUNG.saetze[0].teileinspeisung)} ct Einspeisevergütung
                  auf rund {String(ANNAHMEN.strompreis * 100).replace(".", ",")} ct
                  gesparten Netzstrom. Details im{" "}
                  <Link
                    href="/ratgeber/einspeiseverguetung-2026"
                    className="font-medium text-[#669933] underline underline-offset-2 hover:no-underline"
                  >
                    Ratgeber zur Einspeisevergütung
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section className="mt-12 scroll-mt-28" id="laufend">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Laufende Kosten nicht vergessen
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Eine PV-Anlage ist wartungsarm, aber nicht kostenlos im Betrieb.
                Realistisch sind etwa {ANNAHMEN.betriebskostenProKwp} € je kWp und
                Jahr – bei 10 kWp also rund{" "}
                {eur(10 * ANNAHMEN.betriebskostenProKwp)} jährlich. Darin stecken
                die Photovoltaikversicherung, Zählermiete, gelegentliche Wartung
                und eine Rücklage für den Wechselrichtertausch. In unserem
                Solarrechner sind diese Kosten bereits abgezogen.
              </p>
            </section>

            <section className="mt-12 scroll-mt-28" id="steuer">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Steuern: der Nullsteuersatz
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Seit 2023 gilt für Photovoltaikanlagen auf und an Wohngebäuden
                ein Umsatzsteuersatz von 0 %. Das betrifft Module,
                Wechselrichter, Montage und den Speicher, sofern er gemeinsam
                angeschafft wird. Anlagen bis 30 kWp auf Einfamilienhäusern sind
                zudem von der Einkommensteuer befreit. Was das konkret bedeutet,
                haben wir unter{" "}
                <Link
                  href="/forderungen/steuerlich"
                  className="font-medium text-[#669933] underline underline-offset-2 hover:no-underline"
                >
                  steuerliche Vorteile
                </Link>{" "}
                zusammengefasst.
              </p>
            </section>

            <section className="mt-12 scroll-mt-28" id="rechner">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Rechnen Sie Ihren Fall durch
              </h2>
              <p className="mb-6 max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Die Tabelle zeigt den Preis. Ob sich die Anlage rechnet, hängt
                aber an Ihrem Verbrauch und Ihrem Dach. Der Rechner nutzt exakt
                dieselben Preise wie oben.
              </p>
              <Solarrechner />
            </section>

            <section className="mt-12 scroll-mt-28" id="sparen">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Worauf Sie beim Angebot achten sollten
              </h2>
              <ul className="space-y-3">
                {[
                  "Ist die Anlage auf Ihren Verbrauch ausgelegt – oder einfach auf jedes freie Stück Dach?",
                  "Sind Gerüst, Zählerschrank und Netzanmeldung im Preis enthalten oder tauchen sie später auf?",
                  "Welche Garantien gelten auf Module, Wechselrichter und Montage – und wer ist im Schadensfall Ansprechpartner?",
                  "Wird die Dachstatik geprüft, bevor montiert wird?",
                  "Gibt es einen festen Termin für die Inbetriebnahme? Der Vergütungssatz hängt am Inbetriebnahmedatum.",
                ].map((p) => (
                  <li key={p} className="flex gap-3">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#669933]"
                    />
                    <span className="text-[16px] leading-relaxed text-gray-700">{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 scroll-mt-28" id="faq">
              <h2 className="mb-6 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Häufige Fragen zu den Kosten
              </h2>
              <FaqAccordion items={FAQ} />
            </section>

            <section className="mt-12">
              <h2 className="mb-5 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Passend dazu
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { href: "/solarrechner", titel: "Solarrechner", text: "Ertrag, Ersparnis und Amortisation für Ihr Dach." },
                  { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Was Sie pro eingespeister Kilowattstunde bekommen." },
                  { href: "/service/finanzierung", titel: "Finanzierung", text: "PV-Anlage ohne Eigenkapital finanzieren." },
                  { href: "/forderungen/landesforderungen", titel: "Förderung nach Bundesland", text: "Welche Zuschüsse zusätzlich möglich sind." },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group rounded-xl border border-gray-100 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <p className="mb-1 flex items-center gap-2 text-[17px] font-semibold text-gray-900 transition-colors group-hover:text-[#669933]">
                      {l.titel}
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </p>
                    <p className="text-[15px] leading-relaxed text-gray-600">{l.text}</p>
                  </Link>
                ))}
              </div>
            </section>
          </article>

          <aside className="hidden shrink-0 lg:block lg:w-[260px]">
            <TableOfContents items={TOC} variant="desktop" />
          </aside>
        </div>
      </div>

      <EndSection />
    </>
  );
}
