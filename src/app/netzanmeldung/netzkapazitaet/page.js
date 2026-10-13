// src/app/netzanmeldung/netzkapazitaet/page.js – Kapazitäts-Wegweiser (Welle B, Paket B06)
//
// Was „Netzebene 4“ und „frei“ bedeuten, warum der Trafo vor Ort entscheidet, Links zu den
// Kapazitätsveröffentlichungen der Netzbetreiber (NUR Links – keine Werte kopiert) und ein freies
// Kartenwerkzeug (Luftlinie zum nächsten Umspannwerk, OSM/ODbL). Lead-Gate nur für den individuellen
// Export „Netz-Steckbrief“ (Kennung „netzkapazitaet“), nie für Links oder Erklärungen.
// Daten: src/data/netzkapazitaetQuellen.js, src/lib/flaeche/netz.js, /daten/umspannwerke-at.json.

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, Cable, Download, Factory, Map as KarteIcon, PlugZap, Scale, TriangleAlert } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { Hinweis, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import NetzSteckbrief from "@/components/FlaechenCheck/NetzSteckbrief";
import { OdblHinweis } from "@/components/FlaechenCheck/NetzSchritt";
import { BEGRIFFE, KAPAZITAET_HINWEIS, KAPAZITAET_PFAD, KAPAZITAET_QUELLEN, KAPAZITAET_RECHT, KAPAZITAET_STAND } from "@/data/netzkapazitaetQuellen";
import { DOWNLOAD_PFAD, DOWNLOAD_README, LUFTLINIE_HINWEIS, ODBL_HINWEIS, ODBL_LIZENZ_URL, ODBL_URL } from "@/lib/flaeche/netz";
import { LAENDER } from "@/lib/flaeche/laender";
import { BASE_URL } from "@/lib/site";
import umspannwerke from "@/data/umspannwerke-at.json";

const PAGE_URL = `${BASE_URL}${KAPAZITAET_PFAD}`;
const TITLE = "Freie Netzkapazität prüfen: Umspannwerke & Links | Ökovolt";
const DESCRIPTION =
  "Freie Netzanschlusskapazität für PV prüfen: was Netzebene 4 und „verfügbar“ bedeuten, Links zu ebUtilities & Netzbetreibern, Karte zum nächsten Umspannwerk.";
const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["freie Netzkapazität prüfen", "Netzanschlusskapazität Umspannwerk", "Einspeisekapazität Photovoltaik Österreich", "ebUtilities Netzkapazität", "Trafokarte Netz NÖ", "nächstes Umspannwerk finden"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Freie Netzkapazität prüfen" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const DREI_EBENEN = [
  {
    icon: Factory,
    titel: "Umspannwerk (Netzebene 4)",
    text: "Hier veröffentlichen die Netzbetreiber gebuchte und verfügbare Kapazität. Für Freiflächen- und große Dachanlagen ist das die erste Hürde.",
  },
  {
    icon: Cable,
    titel: "Mittelspannungsleitung",
    text: "Zwischen Umspannwerk und Ihrer Fläche liegt meist eine 20- oder 30-kV-Leitung. Ihre Belastbarkeit taucht in den Umspannwerk-Tabellen nicht auf.",
  },
  {
    icon: PlugZap,
    titel: "Trafostation vor Ort",
    text: "Für kleinere Anlagen entscheidet oft der Ortsnetz-Trafo. Netz NÖ zeigt das in einer eigenen Trafokarte; andere Betreiber beantworten es erst mit der Netzanfrage.",
  },
];

const FAQ = [
  {
    q: "Wo sehe ich die freie Netzkapazität für meine PV-Anlage?",
    a: "Die Netzbetreiber veröffentlichen gebuchte und verfügbare Kapazitäten je Umspannwerk der Netzebene 4 – gesammelt auf der Branchenplattform ebUtilities und zum Teil auf eigenen Seiten, etwa Netz Niederösterreich, LINZ NETZ oder Salzburg Netz. Die Links stehen oben auf dieser Seite. Wir kopieren keine Werte, weil sie sich mit jeder Veröffentlichung ändern.",
  },
  {
    q: "Heißt „frei“, dass meine Anlage angeschlossen wird?",
    a: "Nein. Die Angabe ist eine Momentaufnahme zum Stichtag und gilt nur für das Umspannwerk. LINZ NETZ und Salzburg Netz weisen ausdrücklich darauf hin, dass daraus kein Rechtsanspruch entsteht. Den Anschlusspunkt legt der Netzbetreiber erst nach Prüfung der vollständigen Netzanfrage fest.",
  },
  {
    q: "Warum kann ein Umspannwerk mit freier Kapazität trotzdem Nein sagen?",
    a: "Weil zwischen Umspannwerk und Fläche Mittelspannungsleitung und Trafostation liegen. Sind diese ausgelastet, ist am Wunschpunkt kein Anschluss möglich – oder nur mit Leitungsbau. Umgekehrt kann ein naher Anschluss auch bei knappem Umspannwerk gehen, wenn der Netzbetreiber umschaltet.",
  },
  {
    q: "Wie genau ist die Entfernung zum Umspannwerk auf der Karte?",
    a: `Sie ist eine Luftlinie aus OpenStreetMap-Daten (${ODBL_HINWEIS}). Kabel folgen Wegen, Grundgrenzen und Dienstbarkeiten und sind deshalb länger. OSM ist außerdem nicht vollständig: Name oder Spannung fehlen teils. Die Karte ist eine Orientierung für die Ersteinschätzung, kein Netzanschlusskonzept.`,
  },
  {
    q: "Wie läuft die Netzanfrage über Ökovolt?",
    a: "Sie nennen uns Lage und geplante Größe der Anlage. Wir prüfen Fläche oder Dach, stellen die Netzanfrage beim zuständigen Netzbetreiber und erklären Ihnen die Antwort – auch wenn sie Nein lautet. Ihre Anfrage bei uns ist unverbindlich.",
  },
  {
    q: "Darf ich die Umspannwerk-Daten weiterverwenden?",
    a: "Ja, unter der Open Database License (ODbL) 1.0: mit Namensnennung „© OpenStreetMap-Mitwirkende, ODbL“ und – wenn Sie die Daten verändern – nur unter derselben Lizenz. Den Datensatz samt Beschreibung können Sie auf dieser Seite herunterladen.",
  },
];

export default async function NetzkapazitaetPage({ searchParams }) {
  const sp = await searchParams;
  const startLand = typeof sp?.land === "string" && LAENDER.some((l) => l.slug === sp.land) ? sp.land : "oberoesterreich";
  const anzahl = umspannwerke.anzahl;
  const abruf = umspannwerke.abruf.split("-").reverse().join(".");
  const betreiber = KAPAZITAET_QUELLEN.filter((q) => q.slug !== "alle");
  const plattform = KAPAZITAET_QUELLEN.find((q) => q.slug === "alle");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: "Freie Netzkapazität prüfen – Kapazitäts-Wegweiser",
        description: DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        dateModified: KAPAZITAET_STAND.iso,
      },
      {
        "@type": "Dataset",
        "@id": `${PAGE_URL}/#umspannwerke`,
        name: "Umspannwerke Österreich ab 20 kV (aus OpenStreetMap)",
        description: `Abgeleitete Datenbank aus OpenStreetMap: ${anzahl} Objekte power=substation in Österreich mit Spannung ab 20 kV, Koordinaten auf drei Nachkommastellen gerundet. Keine Kapazitätsangaben.`,
        license: ODBL_LIZENZ_URL,
        creditText: ODBL_HINWEIS,
        isBasedOn: ODBL_URL,
        dateModified: umspannwerke.abruf,
        spatialCoverage: { "@type": "Place", name: "Österreich" },
        creator: { "@id": `${BASE_URL}/#organization` },
        distribution: [{ "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${BASE_URL}${DOWNLOAD_PFAD}` }],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Netzanmeldung", href: "/netzanmeldung" }, { name: "Netzkapazität" }]}
        eyebrow={`Kapazitäts-Wegweiser · Stand ${KAPAZITAET_STAND.label}`}
        title={
          <>
            Freie Netzkapazität <span className="ov-text-gradient-light">prüfen</span> – bevor Sie planen
          </>
        }
        lead="Wo Netzbetreiber ihre freien Kapazitäten veröffentlichen, was „verfügbar“ wirklich heißt und warum am Ende der Trafo vor Ort entscheidet. Dazu eine Karte, die die Luftlinie zum nächsten Umspannwerk zeigt."
        points={["Nur Primärquellen, keine kopierten Werte", "Links je Netzbetreiber", "Karte frei nutzbar", "Unverbindlich"]}
        actions={[
          { label: "Zu den Links", href: "#links", icon: ArrowUpRight },
          { label: "Karte öffnen", href: "#werkzeug", variant: "secondary", icon: KarteIcon },
        ]}
      />

      {/* Links je Betreiber – frei, ohne Gate */}
      <Section tone="sand" space="md" id="links" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Hier veröffentlichen die Netzbetreiber"
            title="Kapazitäten direkt an der Quelle"
            lead="Wir verlinken nur – die Werte ändern sich mit jeder Veröffentlichung und gehören dem Netzbetreiber. Bitte achten Sie auf das Stand-Datum auf der jeweiligen Seite."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Links geprüft am {KAPAZITAET_STAND.label}</StandPille>
        </div>

        {plattform && (
          <a
            href={plattform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-4 flex flex-col gap-4 rounded-3xl bg-navy-950 p-6 text-white transition-colors hover:bg-navy-800 md:flex-row md:items-center md:justify-between md:p-8"
          >
            <div>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">Österreichweit · alle Netzbetreiber</p>
              <p className="mt-1.5 font-display text-[22px] font-bold leading-snug">ebUtilities – {plattform.titel}</p>
              <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-white/70">
                {plattform.ebene}. Format: {plattform.format}; Aktualisierung {plattform.aktualisierung}.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-ov-300 group-hover:text-white">
              Zu ebUtilities
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only"> (externer Link, neues Fenster)</span>
            </span>
          </a>
        )}

        <ul className="grid gap-4 md:grid-cols-3">
          {betreiber.map((q, i) => (
            <Reveal as="li" key={q.slug} delay={i * 80} className="flex">
              <div className="flex w-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">{q.name}</p>
                <p className="mt-1.5 font-display text-[18px] font-bold leading-snug text-ink-900">{q.titel}</p>
                <dl className="mt-3 space-y-1.5 text-[14px] leading-relaxed text-ink-600">
                  <div>
                    <dt className="inline font-semibold text-ink-800">Ebene: </dt>
                    <dd className="inline">{q.ebene}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-ink-800">Aktualisierung: </dt>
                    <dd className="inline">{q.aktualisierung}</dd>
                  </div>
                  <div>
                    <dt className="inline font-semibold text-ink-800">Format: </dt>
                    <dd className="inline">{q.format}</dd>
                  </div>
                </dl>
                <div className="mt-auto space-y-1.5 pt-4">
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 text-[14.5px] ${LINK}`}>
                    Zur Seite von {q.name}
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    <span className="sr-only"> (externer Link, neues Fenster)</span>
                  </a>
                  {(q.weitere || []).map((w) => (
                    <a key={w.url} href={w.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1 text-[14px] ${LINK}`}>
                      {w.titel}
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                      <span className="sr-only"> (externer Link, neues Fenster)</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
        <p className="mt-5 text-[13.5px] leading-relaxed text-ink-600">
          Weitere Netzbetreiber (z. B. Wiener Netze, Netz Oberösterreich, Energienetze Steiermark, KNG-Kärnten Netz, TINETZ, Netz Burgenland, Vorarlberger Energienetze und kleinere Netzbetreiber) finden Sie gesammelt auf ebUtilities. Den Anmeldeweg je Betreiber beschreiben unsere{" "}
          <Link href="/netzanmeldung" className={LINK}>
            Seiten zur Netzanmeldung
          </Link>
          .
        </p>
      </Section>

      {/* Begriffe */}
      <Section tone="white" space="md" id="begriffe" className="scroll-mt-24">
        <SectionHeading eyebrow="So lesen Sie die Tabellen" title={<>Was „Netzebene 4“ und <span className="ov-text-gradient">„frei“</span> bedeuten</>} lead="Vier Begriffe, die in jeder Kapazitätsveröffentlichung vorkommen – und die häufigsten Missverständnisse dazu." />
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BEGRIFFE.map((b, i) => (
            <Reveal key={b.begriff} delay={i * 80} className="flex flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <dt className="font-display text-[18px] font-bold text-ink-900">{b.begriff}</dt>
              <dd className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{b.text}</dd>
            </Reveal>
          ))}
        </dl>
        <Hinweis className="mt-8" ton="warn" titel="Kein Anspruch auf die angezeigte Kapazität">
          {KAPAZITAET_HINWEIS}
        </Hinweis>
      </Section>

      {/* Warum der Trafo entscheidet */}
      <Section tone="navy" space="md" id="trafo" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Warum der Trafo vor Ort entscheidet"
            title="Drei Ebenen zwischen Ihrer Fläche und dem Netz"
            lead="Die Kapazitätstabellen zeigen nur das Umspannwerk. Ob Ihr Anschluss klappt, hängt auch an der Leitung und an der Station dazwischen."
          />
          <ol className="grid gap-3">
            {DREI_EBENEN.map((e, i) => {
              const Icon = e.icon;
              return (
                <Reveal as="li" key={e.titel} delay={i * 80} className="flex gap-4 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-ov-300">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-[17px] font-bold text-white">{e.titel}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-white/70">{e.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* Werkzeug */}
      <Section tone="sand" space="md" id="werkzeug" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Karte · frei nutzbar"
              title="Wie weit ist das nächste Umspannwerk?"
              lead="Markieren Sie Ihre Fläche oder Ihr Dach. Die Karte zeigt die nächste Station ab 20 kV und das nächste Umspannwerk ab 110 kV – als Luftlinie und Orientierung."
            />
            <ul className="mt-6 space-y-2.5 text-[14.5px] leading-relaxed text-ink-700">
              <li className="flex gap-2.5">
                <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
                {LUFTLINIE_HINWEIS}
              </li>
              <li className="flex gap-2.5">
                <Scale aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                Datenbasis: {anzahl.toLocaleString("de-AT")} Stationen ab 20 kV aus OpenStreetMap, Abruf {abruf}. Ihre Eingabe wird nicht gespeichert; die Ortssuche läuft nur auf Knopfdruck.
              </li>
              <li className="flex gap-2.5">
                <Download aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                <span>
                  Datensatz frei unter ODbL:{" "}
                  <a href={DOWNLOAD_PFAD} download className={LINK}>
                    umspannwerke-at.json
                  </a>{" "}
                  ·{" "}
                  <a href={DOWNLOAD_README} className={LINK}>
                    Beschreibung &amp; Lizenz
                  </a>
                </span>
              </li>
            </ul>
            <p className="mt-6 rounded-2xl bg-white p-4 text-[13.5px] leading-relaxed text-ink-600 ring-1 ring-ink-200/70">
              Kostenlos: Karte, Entfernungen und alle Links. Nur den <strong className="text-ink-900">Netz-Steckbrief als Datei</strong> schalten Sie einmalig mit Name und E-Mail frei.
            </p>
          </div>
          <NetzSteckbrief startLand={startLand} />
        </div>
      </Section>

      {/* FAQ + Quellen */}
      <Section tone="white" space="md" id="faq" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Netzkapazität – kurz beantwortet" lead={`Stand ${KAPAZITAET_STAND.label}. Angaben ohne Gewähr, maßgeblich sind die Veröffentlichungen und Unterlagen des Netzbetreibers.`}>
            <Link href="/flaechen-check" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Fläche im Flächen-Check bewerten
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
        <OdblHinweis className="mt-10" />
        <Quellen
          klappbar
          className="mt-6"
          stand={KAPAZITAET_STAND.label}
          quellen={[
            ...KAPAZITAET_QUELLEN.flatMap((q) => [{ label: `${q.name} – ${q.titel}`, url: q.url }, { label: q.quelle.titel, url: q.quelle.url }, ...(q.weitere || []).map((w) => ({ label: `${q.name} – ${w.titel}`, url: w.url }))]),
            ...KAPAZITAET_RECHT.map((r) => ({ label: r.quelle.titel, url: r.quelle.url })),
            { label: `OpenStreetMap – Urheberrecht und Lizenz (${ODBL_HINWEIS})`, url: ODBL_URL },
            { label: "Open Data Commons – Open Database License (ODbL) 1.0", url: ODBL_LIZENZ_URL },
          ]}
          hinweis="Wir verlinken die Veröffentlichungen der Netzbetreiber und übernehmen keine Kapazitätswerte. Entfernungen sind Luftlinien aus OpenStreetMap – Richtwert/Orientierung, keine Trassenplanung. Keine Rechtsberatung."
        />
      </Section>

      <CtaBand
        eyebrow="Unverbindlich"
        title="Wir stellen die Netzanfrage für Sie."
        text="Wir prüfen Fläche oder Dach, klären mit dem zuständigen Netzbetreiber Anschlusspunkt und Kapazität und erklären Ihnen die Antwort – unverbindlich, bis Sie sich für ein Angebot entscheiden."
        primary={{ label: "Netzanfrage anfragen", href: "/kontakt?thema=netzanfrage" }}
        secondary={{ label: "Beratungstermin buchen", href: "/termin?thema=gewerbe", icon: CalendarClock }}
      />
    </div>
  );
}
