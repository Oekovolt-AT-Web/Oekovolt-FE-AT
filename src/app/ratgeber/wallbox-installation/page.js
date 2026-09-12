// src/app/ratgeber/wallbox-installation/page.js

import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, Clock, Zap } from "lucide-react";

import Breadcrumbs from "@/components/Ratgeber/Breadcrumbs";
import FaqAccordion from "@/components/Ratgeber/FaqAccordion";
import ReadingProgress from "@/components/Ratgeber/ReadingProgress";
import TableOfContents from "@/components/Ratgeber/TableOfContents";
import EndSection from "@/components/Reusable/end";
import { WALLBOX, spanne } from "@/data/wallbox";
import { ANNAHMEN } from "@/data/solarrechner";
import { artikelNachSlug, artikelPfad, datumLang } from "@/lib/ratgeber";

const BASE_URL = "https://www.oekovolt.de";
const SLUG = "wallbox-installation";
const artikel = artikelNachSlug(SLUG);
const PAGE_URL = `${BASE_URL}${artikelPfad(SLUG)}`;

// Deutschlandspezifisch (§ 14a EnWG, VDE-AR-N 4100) -> kein hreflang.
export const metadata = {
  title: "Wallbox Installation: Kosten & Voraussetzungen | Ökovolt",
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
  { id: "kosten", label: "Was kostet die Installation?" },
  { id: "gebaeude", label: "Kosten nach Gebäudetyp" },
  { id: "leistung", label: "11 oder 22 kW?" },
  { id: "voraussetzungen", label: "Technische Voraussetzungen" },
  { id: "anmeldung", label: "Anmeldung & § 14a EnWG" },
  { id: "pv", label: "Mit eigenem Solarstrom laden" },
  { id: "foerderung", label: "Förderung 2026" },
  { id: "ablauf", label: "Ablauf in 5 Schritten" },
  { id: "faq", label: "Häufige Fragen" },
];

// Ladekosten-Vergleich: Netzstrom gegen eigenen Solarstrom.
// Strompreis kommt aus derselben Quelle wie der Solarrechner.
const KM_PRO_JAHR = 15000;
const SOLAR_CT = 0.06; // Gestehungskosten eigener Solarstrom, EUR/kWh
const kwhProJahr = (KM_PRO_JAHR / 100) * WALLBOX.verbrauchProHundert;
const kostenNetz = kwhProJahr * ANNAHMEN.strompreis;
const kostenSolar = kwhProJahr * SOLAR_CT;

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";

const FAQ = [
  {
    frage: "Was kostet eine 11-kW-Wallbox inklusive Installation?",
    antwort: `Zwischen ${WALLBOX.gesamtVon.toLocaleString("de-DE")} und ${WALLBOX.gesamtBis.toLocaleString(
      "de-DE"
    )} € bei einem typischen Einfamilienhaus. Bei kurzem Kabelweg und modernem Zählerschrank liegt man am unteren Ende, bei Altbau, langen Wegen oder Erdarbeiten deutlich darüber. Der größte Kostentreiber ist die Installation, nicht das Gerät.`,
  },
  {
    frage: "Brauche ich eine Genehmigung für eine Wallbox?",
    antwort:
      "Für eine 11-kW-Wallbox genügt die Anmeldung beim Netzbetreiber – die kann er nicht verweigern, die Inbetriebnahme ist sofort möglich. Ab 22 kW ist eine Genehmigung erforderlich, die der Netzbetreiber erteilen oder begründet ablehnen kann. Das dauert bis zu zwei Monate.",
  },
  {
    frage: "Kann ich eine Wallbox selbst installieren?",
    antwort:
      "Nein. Die Installation darf ausschließlich ein Elektrofachbetrieb durchführen, der im Installateurverzeichnis des Netzbetreibers eingetragen ist. Eine Eigeninstallation ist nach VDE-AR-N 4100 unzulässig und gefährdet Ihren Versicherungsschutz.",
  },
  {
    frage: "Wird die Installation einer Wallbox gefördert?",
    antwort: `Für Einfamilienhäuser gibt es 2026 keine Bundesförderung mehr. Nutzbar sind der Handwerkerbonus nach § 35a EStG (${
      WALLBOX.handwerkerbonus.anteil * 100
    } % der Arbeitskosten, maximal ${WALLBOX.handwerkerbonus.maxProJahr.toLocaleString(
      "de-DE"
    )} € im Jahr) und der Netzentgelt-Rabatt nach § 14a EnWG. Für Mehrparteienhäuser läuft vom ${
      WALLBOX.mfhProgramm.von
    } bis ${WALLBOX.mfhProgramm.bis} das Bundesprogramm „Laden im Mehrparteienhaus".`,
  },
  {
    frage: "Lohnt sich eine 22-kW-Wallbox?",
    antwort:
      "Für die meisten Privatnutzer nicht. Die gängigen Elektroautos laden am Wechselstrom ohnehin nur mit maximal 11 kW – an einer 22-kW-Box laden sie deshalb nicht schneller. Sinnvoll wird 22 kW erst, wenn das Fahrzeug einen entsprechenden Onboardlader hat, kurze Ladezeiten nötig sind und der Hausanschluss die Last verkraftet.",
  },
  {
    frage: "Kann ich die Wallbox mit meiner Solaranlage kombinieren?",
    antwort: `Ja, über das sogenannte Überschussladen. Die Wallbox lädt dann vorrangig, wenn die PV-Anlage mehr produziert als das Haus verbraucht. Bei ${KM_PRO_JAHR.toLocaleString(
      "de-DE"
    )} km im Jahr kostet Sie das Laden mit Netzstrom rund ${eur(
      kostenNetz
    )}, mit eigenem Solarstrom etwa ${eur(
      kostenSolar
    )}. Voraussetzung ist eine steuerbare Wallbox und ein Energiemanagementsystem.`,
  },
];

export default function WallboxInstallationPage() {
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
      {
        // Ökovolt ist der ausführende Betrieb – relevant für "Wallbox
        // Installation in der Nähe" und das lokale Suchergebnis.
        "@type": "Service",
        "@id": `${PAGE_URL}/#service`,
        name: "Wallbox Installation",
        serviceType: "Installation von Ladestationen für Elektrofahrzeuge",
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Place", name: "Allgäu, Schwaben und Bayern" },
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
            Wallbox Installation: Kosten, Voraussetzungen & Ablauf
          </h1>
          <p className="mt-5 max-w-[65ch] text-[18px] leading-relaxed text-gray-600">
            {artikel.excerpt}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-gray-500">
            <span className="flex items-center gap-2">
              <CalendarClock aria-hidden="true" className="h-4 w-4 text-[#669933]" />
              Aktualisiert am{" "}
              <time dateTime={artikel.aktualisiert}>{datumLang(artikel.aktualisiert)}</time>
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
              <h2 id="kurz-heading" className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Das Wichtigste in Kürze
              </h2>
              <ul className="space-y-3 rounded-xl bg-[#f0f7e6] p-6">
                {[
                  `Eine 11-kW-Wallbox kostet mit Installation ${spanne([WALLBOX.gesamtVon, WALLBOX.gesamtBis])}.`,
                  "Die Installation macht meist mehr aus als das Gerät – der Kabelweg ist der größte Kostentreiber.",
                  "Bis 11 kW genügt die Anmeldung beim Netzbetreiber, ab 22 kW braucht es eine Genehmigung.",
                  "Für 95 % der Privatnutzer reicht 11 kW: Die meisten E-Autos laden am Wechselstrom ohnehin nicht schneller.",
                  "Installieren darf nur ein im Installateurverzeichnis eingetragener Elektrofachbetrieb.",
                ].map((p) => (
                  <li key={p} className="flex gap-3">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#669933]" />
                    <span className="text-[16px] leading-relaxed text-gray-700">{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 scroll-mt-28" id="kosten">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Was kostet eine Wallbox mit Installation?
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Der Gesamtpreis besteht aus dem Gerät und der Elektroinstallation.
                Die Installation macht dabei in der Regel den größeren Teil aus –
                ein günstiges Gerät bringt wenig, wenn 20 Meter Kabel durch Keller
                und Außenwand müssen.
              </p>

              <figure className="my-8">
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
                    <caption className="sr-only">Wallbox-Kosten nach Variante</caption>
                    <thead>
                      <tr className="bg-[#003473] text-white">
                        <th scope="col" className="px-4 py-3 font-semibold">Variante</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Gerät</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Installation</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Gesamt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {WALLBOX.varianten.map((v, i) => (
                        <tr key={v.name} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                          <th scope="row" className="px-4 py-3 font-medium text-gray-900">{v.name}</th>
                          <td className="px-4 py-3 tabular-nums text-gray-700">{spanne(v.geraet)}</td>
                          <td className="px-4 py-3 tabular-nums text-gray-700">{spanne(v.montage)}</td>
                          <td className="px-4 py-3 tabular-nums">
                            <span className="font-semibold text-[#669933]">{spanne(v.gesamt)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <figcaption className="mt-3 text-[13px] leading-relaxed text-gray-500">
                  Richtwerte für ein Einfamilienhaus, Stand September 2026. Enthalten
                  sind Gerät, Elektroinstallation, Schutzorgane und die Anmeldung
                  beim Netzbetreiber.
                </figcaption>
              </figure>

              <h3 className="mb-3 mt-8 text-[20px] font-semibold text-gray-900">
                Was den Preis nach oben treibt
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Kabelweg", "Der Abstand zwischen Zählerschrank und Stellplatz ist der größte Einzelposten. Kurz und innen liegend ist günstig, Erdreich und Wanddurchbrüche sind es nicht."],
                  ["FI-Schutzschalter", "Pflicht bei jeder Wallbox. Hat das Gerät keinen DC-Fehlerstromschutz integriert, braucht es den deutlich teureren allstromsensitiven Typ B."],
                  ["Zählerschrank", "Ältere Verteilungen haben oft keinen Platz für den zusätzlichen Stromkreis. Eine Ertüchtigung oder ein Tausch schlägt spürbar zu Buche."],
                  ["Erdung", "In Bestandsgebäuden ohne normgerechte Erdungsanlage muss nachgerüstet werden, bevor die Wallbox ans Netz darf."],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h4 className="mb-1.5 text-[17px] font-semibold text-gray-900">{t}</h4>
                    <p className="text-[15px] leading-relaxed text-gray-600">{d}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 scroll-mt-28" id="gebaeude">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Installationskosten nach Gebäudetyp
              </h2>
              <p className="mb-6 max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Woran Sie ungefähr ablesen können, wo Ihr Projekt landet – die
                Werte betreffen nur die Installation, ohne Gerät.
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
                  <caption className="sr-only">Installationskosten nach Gebäudetyp</caption>
                  <thead>
                    <tr className="bg-[#003473] text-white">
                      <th scope="col" className="px-4 py-3 font-semibold">Gebäudetyp</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Installation</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Typischer Grund</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {WALLBOX.gebaeude.map((g, i) => (
                      <tr key={g.typ} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                        <th scope="row" className="px-4 py-3 font-medium text-gray-900">{g.typ}</th>
                        <td className="px-4 py-3 tabular-nums">
                          <span className="font-semibold text-[#669933]">{spanne(g.kosten)}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{g.grund}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12 scroll-mt-28" id="leistung">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                11 oder 22 kW – was brauchen Sie wirklich?
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Die kurze Antwort: Für die allermeisten Privathaushalte reicht
                11 kW. Der Grund liegt nicht an der Wallbox, sondern am Auto.
              </p>
              <div className="mt-6 flex items-start gap-4 rounded-xl bg-[#003473] p-6 text-white">
                <Zap aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" />
                <div>
                  <p className="mb-1 text-[17px] font-semibold">
                    Die meisten E-Autos laden am Wechselstrom nur mit 11 kW
                  </p>
                  <p className="text-[15px] leading-relaxed text-white/80">
                    Der Onboardlader im Fahrzeug begrenzt die Ladeleistung. An
                    einer 22-kW-Wallbox laden diese Fahrzeuge exakt genauso
                    schnell wie an einer 11-kW-Box – Sie zahlen für Leistung, die
                    nie ankommt.
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                22 kW lohnt sich nur, wenn drei Dinge zusammenkommen: Ihr Fahrzeug
                hat einen 22-kW-Onboardlader, Sie brauchen regelmäßig kurze
                Ladezeiten, und Ihr Hausanschluss verkraftet die Last. Sonst ist
                das Geld in einer guten 11-kW-Box mit Überschussladen besser
                angelegt.
              </p>
            </section>

            <section className="mt-12 scroll-mt-28" id="voraussetzungen">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Technische Voraussetzungen
              </h2>
              <ul className="space-y-3">
                {[
                  "Dreiphasiger Drehstromanschluss mit 400 V. Eine normale Schuko-Steckdose reicht nicht und ist als Dauerlösung nicht zulässig.",
                  "Ein eigener, dedizierter Stromkreis ab Zählerschrank mit eigenem Leitungsschutzschalter.",
                  "Ausreichender Leitungsquerschnitt – bei längeren Kabelwegen entsprechend größer, damit die Spannung nicht abfällt.",
                  "FI-Schutzschalter: Typ A genügt, wenn die Wallbox einen DC-Fehlerstromschutz mitbringt, sonst Typ B.",
                  "Ein trockener, gut zugänglicher Montageort. Bei Außenmontage mindestens Schutzart IP54.",
                  "Ein Hausanschluss, der die zusätzliche Last trägt – kritisch wird es erst bei mehreren Großverbrauchern wie Wärmepumpe plus Wallbox.",
                ].map((p) => (
                  <li key={p} className="flex gap-3">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#669933]" />
                    <span className="text-[16px] leading-relaxed text-gray-700">{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 scroll-mt-28" id="anmeldung">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Anmeldung, Genehmigung und § 14a EnWG
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Jede fest installierte Wallbox muss beim Netzbetreiber angemeldet
                werden. Das übernimmt Ihr Elektrofachbetrieb – nur eingetragene
                Betriebe dürfen das. Bis 11 kW ist es eine reine Mitteilung, die
                der Netzbetreiber nicht ablehnen kann. Ab 22 kW braucht es eine
                echte Genehmigung, und die kann bei angespanntem Netz auch
                verweigert werden.
              </p>
              <div className="mt-6 rounded-xl border-l-4 border-[#669933] bg-gray-50 p-5">
                <p className="mb-2 text-[16px] font-semibold text-gray-900">
                  Netzentgelt-Rabatt nach § 14a EnWG
                </p>
                <p className="text-[15px] leading-relaxed text-gray-700">
                  Wenn Sie dem Netzbetreiber erlauben, die Ladeleistung in
                  Spitzenzeiten auf {String(WALLBOX.paragraf14a.drosselungKw).replace(".", ",")} kW
                  zu drosseln, sparen Sie rund{" "}
                  {WALLBOX.paragraf14a.ersparnisVon}–{WALLBOX.paragraf14a.ersparnisBis} € im Jahr an
                  Netzentgelten. In der Praxis greift die Drosselung selten und
                  überwiegend nachts – auch gedrosselt laden Sie über Nacht
                  genug für den Alltag nach.
                </p>
              </div>
              <p className="mt-6 max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Ins Marktstammdatenregister muss die Wallbox übrigens nicht –
                sie ist keine Erzeugungsanlage. Dort werden nur Ihre{" "}
                <Link
                  href="/dienstleistungen/photovoltaik"
                  className="font-medium text-[#669933] underline underline-offset-2 hover:no-underline"
                >
                  PV-Anlage
                </Link>{" "}
                und der Speicher eingetragen.
              </p>
            </section>

            <section className="mt-12 scroll-mt-28" id="pv">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Mit eigenem Solarstrom laden
              </h2>
              <p className="max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Beim Überschussladen lädt die Wallbox vorrangig dann, wenn Ihre
                PV-Anlage mehr produziert, als das Haus gerade braucht. Ein
                Energiemanagementsystem regelt die Ladeleistung dynamisch mit.
                Der Unterschied ist erheblich:
              </p>

              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
                  <caption className="sr-only">
                    Ladekosten mit Netzstrom gegenüber eigenem Solarstrom
                  </caption>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-white">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                        Laden mit Netzstrom ({(ANNAHMEN.strompreis * 100).toFixed(0)} ct/kWh)
                      </th>
                      <td className="px-4 py-3 tabular-nums font-semibold text-gray-900">
                        {eur(kostenNetz)} / Jahr
                      </td>
                    </tr>
                    <tr className="bg-[#f0f7e6]">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                        Laden mit eigenem Solarstrom ({(SOLAR_CT * 100).toFixed(0)} ct/kWh)
                      </th>
                      <td className="px-4 py-3 tabular-nums font-semibold text-[#669933]">
                        {eur(kostenSolar)} / Jahr
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
                Annahme: {KM_PRO_JAHR.toLocaleString("de-DE")} km im Jahr,{" "}
                {WALLBOX.verbrauchProHundert} kWh je 100 km. In der Praxis liegt
                man dazwischen, weil nicht jede Ladung in eine Sonnenstunde fällt.
              </p>
              <p className="mt-5 max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Wichtig ist eine Wallbox mit offener Schnittstelle. Geschlossene
                Herstellersysteme binden Sie an ein Ökosystem – mit Modbus TCP
                oder OCPP bleiben Sie flexibel. Was eine passende Anlage kostet,
                steht im{" "}
                <Link
                  href="/ratgeber/solaranlage-kosten"
                  className="font-medium text-[#669933] underline underline-offset-2 hover:no-underline"
                >
                  Kostenratgeber
                </Link>
                .
              </p>
            </section>

            <section className="mt-12 scroll-mt-28" id="foerderung">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Förderung 2026
              </h2>
              <div className="mb-6 flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#669933]" />
                <p className="text-[15px] leading-relaxed text-gray-700">
                  <strong className="font-semibold text-gray-900">Einfamilienhaus:</strong>{" "}
                  Für Wallboxen gibt es 2026 keine Bundesförderung mehr. Was
                  bleibt, ist der Handwerkerbonus nach § 35a EStG (
                  {WALLBOX.handwerkerbonus.anteil * 100} % der Arbeitskosten, maximal{" "}
                  {WALLBOX.handwerkerbonus.maxProJahr.toLocaleString("de-DE")} € im Jahr) und der
                  Netzentgelt-Rabatt nach § 14a EnWG. Einzelne Kommunen fördern
                  zusätzlich – das lohnt sich nachzufragen.
                </p>
              </div>

              <h3 className="mb-3 text-[20px] font-semibold text-gray-900">
                Mehrparteienhaus: Bundesprogramm bis {WALLBOX.mfhProgramm.bis}
              </h3>
              <p className="mb-4 max-w-[70ch] text-[16px] leading-relaxed text-gray-600">
                Für Bestandsgebäude mit mehreren Wohnungen läuft vom{" "}
                {WALLBOX.mfhProgramm.von} bis {WALLBOX.mfhProgramm.bis} das
                Bundesprogramm &bdquo;Laden im Mehrparteienhaus&ldquo;:
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full min-w-[440px] border-collapse text-left text-[15px]">
                  <caption className="sr-only">Fördersätze Laden im Mehrparteienhaus</caption>
                  <thead>
                    <tr className="bg-[#003473] text-white">
                      <th scope="col" className="px-4 py-3 font-semibold">Maßnahme</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Zuschuss je Stellplatz</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {WALLBOX.mfhProgramm.saetze.map((s, i) => (
                      <tr key={s.was} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                        <th scope="row" className="px-4 py-3 font-medium text-gray-900">{s.was}</th>
                        <td className="px-4 py-3 tabular-nums">
                          <span className="font-semibold text-[#669933]">
                            bis {s.bis.toLocaleString("de-DE")} €
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12 scroll-mt-28" id="ablauf">
              <h2 className="mb-4 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                So läuft die Installation ab
              </h2>
              <ol className="space-y-4">
                {[
                  ["Beratung & Vor-Ort-Check", "Wir sehen uns Zählerschrank, Kabelweg und Stellplatz an und klären, ob der Hausanschluss reicht. Wenn eine PV-Anlage vorhanden oder geplant ist, stimmen wir die Wallbox darauf ab."],
                  ["Wallbox auswählen", "11 oder 22 kW, festes Kabel oder Steckdose, App-Anbindung und Überschussladen – wir empfehlen Geräte mit offener Schnittstelle und belastbarer Herstellergarantie."],
                  ["Anmeldung beim Netzbetreiber", "Übernehmen wir als eingetragener Elektrofachbetrieb. Bei 11 kW kann sofort installiert werden, bei 22 kW warten wir die Genehmigung ab."],
                  ["Installation", "Kabel verlegen, Schutzorgane setzen, Wallbox montieren und anschließen. In den meisten Fällen an einem Tag erledigt."],
                  ["Inbetriebnahme & Einweisung", "Funktionstest, Konfiguration von App und Ladeprofilen, Einweisung und Übergabe der Dokumentation."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white"
                      style={{ backgroundColor: "#669933" }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="mb-1 text-[17px] font-semibold text-gray-900">{t}</h3>
                      <p className="max-w-[65ch] text-[15px] leading-relaxed text-gray-600">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-12 scroll-mt-28" id="faq">
              <h2 className="mb-6 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Häufige Fragen zur Wallbox-Installation
              </h2>
              <FaqAccordion items={FAQ} />
            </section>

            <section className="mt-12">
              <h2 className="mb-5 text-[24px] font-semibold text-gray-900 md:text-[28px]">
                Passend dazu
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { href: "/produkte/wallbox", titel: "Unsere Wallbox-Lösungen", text: "Geräte, die wir installieren – und warum." },
                  { href: "/solarrechner", titel: "Solarrechner", text: "Was Ihre PV-Anlage bringt, mit der die Wallbox lädt." },
                  { href: "/ratgeber/solaranlage-kosten", titel: "Solaranlage Kosten", text: "Preise je kWp und was im Komplettpreis steckt." },
                  { href: "/dienstleistungen/photovoltaik", titel: "PV-Anlage im Allgäu", text: "Planung, Montage und Anmeldung aus einer Hand." },
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
