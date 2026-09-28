// src/app/forderungen/landesforderungen/page.js

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeEuro, Banknote, CalendarClock, FileSignature, Landmark, Map, Percent, Receipt, Sun } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Fliesstext from "@/components/Reusable/Fliesstext";
import Querverweise from "@/components/Reusable/Querverweise";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Foerderkarte from "@/components/Forderungen/Landes/Foerderkarte";
import { datumLang, hoeheKurz } from "@/components/Forderungen/Shared/format";
import { alleBundeslaender, FOERDERARTEN, REGIONALSEITEN } from "@/data/bundeslaender";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { generateSlug } from "@/lib/slugify";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { hreflangLanguages } from "@/lib/hreflang";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.forderungen_pages.doctype.forderungen_page.api.get_forderungen_page`;
const LIST_URL = `${API_BASE_URL}oekovoltdeutchland.forderungen_pages.doctype.forderungen_lande.api.get_all_forderung_lande_pages`;
const PAGE_URL = "https://www.oekovolt.com/forderungen/landesforderungen";

async function fetchLandesforderungenData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await response.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

async function fetchAllLandesforderungen() {
  if (!isApiConfigured()) return [];
  try {
    const headers = getApiHeaders();
    const response = await fetch(LIST_URL, {
      method: "GET",
      headers,
      next: { revalidate: 600 }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data?.message || [];
  } catch {
    return [];
  }
}

const TITLE = "Photovoltaik Förderung 2026 nach Bundesland | Ökovolt";
const DESCRIPTION = "PV- und Speicherförderung 2026 in allen 16 Bundesländern: interaktive Karte mit Landes- und Kommunalprogrammen, Solarertrag und Stand. Jetzt Förderung prüfen!";

export async function generateMetadata() {
  const seoData = await fetchLandesforderungenData();

  const defaultKeywords = [
    "Photovoltaik Förderung",
    "Landesförderprogramme",
    "Solarförderung",
    "Bundesländer Förderung",
    "Energie Förderungen",
  ];

  // Keywords aus dem Backoffice mit den Standardbegriffen zusammenführen
  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: apiKeywords,
    alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: PAGE_URL,
      siteName: "Ökovolt Österreich",
      title: TITLE,
      description: DESCRIPTION,
      images: [{ url: "https://www.oekovolt.com/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Photovoltaik Förderungen" }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: ["https://www.oekovolt.com/og-image.jpg"]
    },
  };
}

const img = (p, fallback = "/Images/Jobs/jobs3.jpg") => (p ? `/api/image?path=${p}` : fallback);

const FAQ = [
  {
    q: "Welche Förderung gibt es 2026 für Photovoltaik in jedem Bundesland?",
    a: "Bundesweit gelten vier Instrumente: 0 % Umsatzsteuer auf Anlage und Speicher (§ 12 Abs. 3 UStG), die Einkommensteuerbefreiung nach § 3 Nr. 72 EStG, die EEG-Einspeisevergütung über 20 Jahre und der KfW-Kredit 270. Landeszuschüsse oder Landesdarlehen kommen nur in einigen Ländern hinzu – etwa SolarPLUS in Berlin oder Darlehen in Baden-Württemberg, Hessen und Sachsen.",
  },
  {
    q: "Welches Bundesland fördert Photovoltaik 2026 am stärksten?",
    a: "Mit echten Zuschüssen für private Anlagen sticht Berlin mit SolarPLUS heraus (bis zu 4.750 € für PV mit Speicher). In Flächenländern sind kommunale Programme oft attraktiver als das Land – etwa in Köln, Münster, Stuttgart oder Potsdam. Wirtschaftlich zählt über 20 Jahre aber meist mehr, wie viel Sonne Ihr Dach bekommt und wie viel Strom Sie selbst nutzen.",
  },
  {
    q: "Kann ich Landesförderung, kommunale Förderung und KfW-Kredit kombinieren?",
    a: "In vielen Fällen ja. Zuschüsse von Land oder Kommune lassen sich häufig mit dem KfW-Kredit 270 und immer mit den steuerlichen Vorteilen und der EEG-Vergütung kombinieren. Einzelne Programme schließen eine Doppelförderung derselben Kosten aber aus – maßgeblich ist die jeweilige Förderrichtlinie.",
  },
  {
    q: "Muss ich die Förderung vor dem Kauf beantragen?",
    a: "Bei fast allen Zuschuss- und Kreditprogrammen ja: Der Antrag muss vor Vorhabenbeginn gestellt werden. Als Beginn zählt meist schon der unterschriebene Liefer- oder Montagevertrag. Planung und Angebote einholen ist dagegen unschädlich. Die Steuervorteile und die EEG-Vergütung erhalten Sie ohne Antrag.",
  },
  {
    q: "Warum ändern sich die Förderprogramme so häufig?",
    a: "Kommunale Programme sind freiwillige Leistungen aus dem Haushalt. Ist das Jahresbudget ausgeschöpft, endet die Antragsphase oft ohne Vorankündigung – so zuletzt in Augsburg, Bonn oder Düsseldorf. Wir weisen deshalb bei jedem Bundesland das Datum der letzten Prüfung aus.",
  },
  {
    q: "Gibt es 2026 eine Förderung für Batteriespeicher?",
    a: "Eine bundesweite Speicherförderung gibt es nicht. Speicher profitieren aber vom Nullsteuersatz und sind im KfW-Kredit 270 förderfähig. Zuschüsse zahlen vor allem Berlin (SolarPLUS, nur mit PV-Anlage), einzelne Städte wie Köln sowie Halle und Magdeburg.",
  },
];

export default async function Page() {
  const [data, landesforderungenList] = await Promise.all([
    fetchLandesforderungenData(),
    fetchAllLandesforderungen(),
  ]);

  // Slugs aus dem Backoffice – Links nur auf Seiten, die es auch gibt
  const apiEintraege = (landesforderungenList || []).map((it) => ({ ...it, slug: generateSlug(it.firstcard_title) }));
  const apiNachSlug = Object.fromEntries(apiEintraege.map((it) => [it.slug, it]));

  const laender = alleBundeslaender().map((l) => ({
    key: l.key,
    name: l.name,
    kuerzel: l.kuerzel,
    foerderart: l.foerderart,
    ertrag: l.ertrag,
    kurz: l.landesprogramm.kurz,
    programm: l.programm,
    kommunal: (l.kommunal || []).map((k) => ({ ort: k.ort, programm: k.programm, hoeheKurz: hoeheKurz(k.hoehe) })),
    portal: l.portal?.name,
    stand: datumLang(l.stand),
    standIso: l.stand,
    href: `/forderungen/landesforderungen/${l.slug}`,
    bild: apiNachSlug[l.slug]?.firstcard_image,
    bildAlt: apiNachSlug[l.slug]?.firstcard_alt_image,
  }));

  const regionalseiten = apiEintraege.filter((it) => REGIONALSEITEN[it.slug]);
  const stand = laender.reduce((max, l) => (l.standIso > max ? l.standIso : max), "2026-01-01");
  const zaehlZuschuss = laender.filter((l) => l.foerderart === "zuschuss" || l.foerderart === "darlehen").length;
  const zaehlKommunal = laender.reduce((s, l) => s + l.kommunal.length, 0);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Photovoltaik Förderung 2026 nach Bundesland",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": "https://www.oekovolt.com/#website" },
    about: { "@id": "https://www.oekovolt.com/#organization" },
    datePublished: "2020-01-01",
    dateModified: stand,
    mainEntity: {
      "@type": "ItemList",
      name: "Photovoltaik-Förderung nach Bundesland",
      numberOfItems: laender.length,
      itemListElement: laender.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Förderung in ${l.name}`,
        url: `https://www.oekovolt.com${l.href}`,
      })),
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Förderungen" }, { name: "Landesförderungen" }]}
        eyebrow="Förderung nach Bundesland · Stand 2026"
        title={<>Photovoltaik-Förderung 2026 <span className="ov-text-gradient">nach Bundesland</span></>}
        lead="Welche Zuschüsse, Darlehen und kommunalen Programme gibt es dort, wo Ihr Haus steht? Alle 16 Bundesländer auf einer Karte – geprüft, datiert und verständlich eingeordnet."
        image={{ src: img(data?.image, "/Images/Jobs/jobs3.jpg"), alt: data?.alt_text_for_image || "Hausdach mit Photovoltaikanlage aus der Luft" }}
        points={["Alle 16 Länder mit Prüfdatum", "Landes- und Kommunalprogramme", "Solarertrag je Region", "Bundesförderung inklusive"]}
        actions={[
          { label: "Förder-Check starten", href: "/foerdercheck" },
          { label: "Zur Förderkarte", href: "#foerderkarte", icon: Map },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <CalendarClock aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[20px] font-extrabold leading-none text-ink-900">Geprüft</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Stand {datumLang(stand)}</p>
            </div>
          </div>
        }
      />

      {/* Kennzahlen */}
      <div className="border-y border-ink-200/70 bg-white">
        <dl className="ov-container grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:py-10">
          {[
            { wert: "16", label: "Bundesländer geprüft" },
            { wert: String(zaehlZuschuss), label: "Länder mit Zuschuss oder Darlehen" },
            { wert: String(zaehlKommunal), label: "aktive kommunale Programme erfasst" },
            { wert: "0 %", label: "Umsatzsteuer auf PV & Speicher – bundesweit" },
          ].map((k) => (
            <div key={k.label} className="px-2 md:border-l md:border-ink-200 md:px-6 md:first:border-l-0 md:first:pl-0">
              <dt className="sr-only">{k.label}</dt>
              <dd className="ov-num font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] font-extrabold leading-none tracking-tight text-ink-900">{k.wert}</dd>
              <dd className="mt-2 text-[13.5px] leading-snug text-ink-500">{k.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Interaktive Karte */}
      <Section tone="sand" space="lg" id="foerderkarte" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Interaktive Förderkarte"
          title={<>Wo es 2026 <span className="ov-text-gradient">zusätzlich Geld</span> gibt</>}
          lead="Wählen Sie Ihr Bundesland. Die Karte zeigt, ob das Land über Zuschüsse, Darlehen oder nur die Kommunen fördert – und mit einem Klick, wie viel Sonne Ihre Region im Jahr liefert."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <Foerderkarte laender={laender} startKey="bayern" />
        </Reveal>
        <p className="mx-auto mt-6 max-w-3xl text-center text-[13.5px] leading-relaxed text-ink-500">
          Einordnung aus Sicht privater Eigenheimbesitzer. Kommunale Programme sind freiwillige Leistungen und können bei ausgeschöpftem Budget kurzfristig enden – maßgeblich ist immer die aktuelle Förderrichtlinie.
        </p>
      </Section>

      {/* Bundesförderung */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow="Gilt in allen Bundesländern"
            title="Die Basis: vier Bundesinstrumente, die jede Anlage bekommt"
            lead="Egal ob Kiel oder Kempten – diese Vorteile gelten überall und machen den größten Teil der Wirtschaftlichkeit aus. Landes- und Kommunalprogramme kommen obendrauf."
          >
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/forderungen/steuerlich" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                Steuervorteile im Detail
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SectionHeading>
          <FeatureGrid
            cols={2}
            items={[
              { icon: Percent, title: "0 % Umsatzsteuer", text: "Anlage, Speicher und Montage auf Wohngebäuden ohne Mehrwertsteuer – nach § 12 Abs. 3 UStG, direkt auf der Rechnung.", href: "/forderungen/steuerlich", tag: "Steuer" },
              { icon: Receipt, title: "Einkommensteuerfrei", text: "Erträge bis 30 kWp je Wohn- oder Gewerbeeinheit sind nach § 3 Nr. 72 EStG steuerfrei – ohne Gewinnermittlung.", href: "/forderungen/steuerlich", tag: "Steuer" },
              { icon: Sun, title: `${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct je kWh`, text: `EEG-Vergütung für eingespeisten Strom bei Teileinspeisung bis 10 kWp, garantiert über ${VERGUETUNG.garantieJahre} Jahre (Inbetriebnahme ab ${VERGUETUNG.gueltigAbLabel}).`, href: "/ratgeber/einspeiseverguetung-2026", tag: "EEG" },
              { icon: Banknote, title: "KfW-Kredit 270", text: "Zinsgünstige Finanzierung von bis zu 100 % der Kosten für Anlage und Speicher – Antrag über die Hausbank vor Vertragsabschluss.", href: "/service/finanzierung", tag: "Kredit" },
            ]}
          />
        </div>
      </Section>

      {/* Alle Bundesländer */}
      <Section tone="sand" space="lg" id="bundeslaender">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Alle 16 Bundesländer"
            title="Förderung in Ihrem Bundesland im Detail"
            lead="Landesprogramm, aktive und ausgelaufene kommunale Programme, regionale Anlaufstellen und Solarertrag – je Land auf einer eigenen Seite."
          />
          <ul className="flex flex-wrap gap-2 md:justify-end" aria-label="Legende Förderart">
            {Object.entries(FOERDERARTEN).map(([k, v]) => (
              <li key={k} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-600 ring-1 ring-ink-200">
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${PUNKT[k]}`} />
                {v.label}
              </li>
            ))}
          </ul>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {laender.map((l, i) => (
            <Reveal as="li" key={l.key} delay={(i % 4) * 60} className="flex">
              <Link
                href={l.href}
                className="group ov-card-hover flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-200"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-ink-100">
                  <Image
                    src={img(l.bild, "/Images/Jobs/jobs3.jpg")}
                    alt={l.bildAlt || `Förderung Photovoltaik in ${l.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-navy-950/0 to-transparent" />
                  <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 font-display text-[14px] font-extrabold text-ink-900 shadow">
                    {l.kuerzel}
                  </span>
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11.5px] font-semibold shadow-sm ${CHIP[l.foerderart]}`}>
                    {FOERDERARTEN[l.foerderart].kurz}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[19px] font-bold leading-snug text-ink-900 transition-colors group-hover:text-ov-700">
                    Förderung in {l.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[14.5px] leading-relaxed text-ink-600">{l.kurz}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-[13px] text-ink-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Sun aria-hidden="true" className="h-3.5 w-3.5 text-sun-500" />
                      <span className="ov-num">{l.ertrag[0].toLocaleString("de-DE")}–{l.ertrag[1].toLocaleString("de-DE")} kWh/kWp</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-ov-600 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        {regionalseiten.length > 0 && (
          <div className="mt-14">
            <h3 className="ov-h3 text-ink-900">Regionale Förderseiten im Allgäu und Umland</h3>
            <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-ink-600">
              Rund um unseren Standort Türkheim haben wir die Lage für einzelne Landkreise und Gemeinden gesondert aufbereitet.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {regionalseiten.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/forderungen/landesforderungen/${r.slug}`}
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-white pl-4 pr-5 text-[15px] font-semibold text-ink-800 ring-1 ring-ink-200 transition-all hover:bg-ov-50 hover:text-ov-800 hover:ring-ov-300"
                  >
                    <Landmark aria-hidden="true" className="h-4 w-4 text-ov-600" />
                    {REGIONALSEITEN[r.slug].name}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/* Redaktioneller Überblick + Vorgehen */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
              Überblick
            </p>
            <h2 className="ov-h2 mt-4 text-ink-900">
              {data?.first_card_title || "Photovoltaik-Förderung in Deutschland: Finanzierung, Steuer & Genehmigung"}
            </h2>
            {data?.first_card_description ? (
              <Fliesstext text={data.first_card_description} className="mt-6 space-y-4 text-[16.5px] leading-relaxed text-ink-600" />
            ) : (
              <p className="mt-6 text-[16.5px] leading-relaxed text-ink-600">
                Für Privathaushalte gibt es in Deutschland zahlreiche Fördermöglichkeiten für PV-Anlagen und Stromspeicher: von zinsgünstigen Krediten über direkte Zuschüsse bis hin zu steuerlichen Vorteilen. Die Regelungen unterscheiden sich je nach Bundesland und Kommune – und ändern sich laufend.
              </p>
            )}
          </Reveal>
          <div>
            <h3 className="ov-h3 text-ink-900">In vier Schritten zur maximalen Förderung</h3>
            <ol className="mt-8 space-y-6">
              {[
                { icon: Percent, t: "Bundesvorteile mitnehmen", x: "0 % Umsatzsteuer, Einkommensteuerbefreiung und EEG-Vergütung erhalten Sie automatisch – ohne Antrag." },
                { icon: Map, t: "Land und Kommune prüfen", x: "Bundesland auf der Karte wählen und im Rathaus nach aktuellen kommunalen Töpfen fragen." },
                { icon: FileSignature, t: "Antrag vor dem Vertrag", x: "Zuschüsse und KfW-Kredit vor Unterschrift beantragen – sonst ist die Förderung meist verloren." },
                { icon: BadgeEuro, t: "Anlage in Betrieb nehmen", x: "Nach Montage Marktstammdatenregister (1 Monat Frist) und Verwendungsnachweis – das übernehmen wir für Sie." },
              ].map((s, i) => (
                <Reveal as="li" key={s.t} delay={i * 80} className="flex gap-5">
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700 ring-1 ring-ov-200">
                    <s.icon aria-hidden="true" className="h-5 w-5" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-700 text-[11px] font-bold text-white">{i + 1}</span>
                  </span>
                  <div>
                    <p className="font-display text-[17.5px] font-bold text-ink-900">{s.t}</p>
                    <p className="mt-1 text-[15.5px] leading-relaxed text-ink-600">{s.x}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <SolarrechnerTeaser
        href="/foerdercheck"
        cta="Förder-Check starten"
        titel="Welche Programme passen genau zu Ihrem Vorhaben?"
        text="Bundesland, Vorhaben und Eigentümerrolle wählen – der Förder-Check zeigt Bundes-, Landes- und Kommunalprogramme für PV, Speicher, Wallbox und Wärmepumpe."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Förderung nach Bundesland – kurz beantwortet"
            lead="Sie planen konkret? Wir prüfen die Förderlage für Ihre Adresse im Rahmen der kostenlosen Beratung."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/forderungen/landesforderungen" />
      <CtaBand
        eyebrow="Förderung & Planung aus einer Hand"
        title="Wir holen das Maximum an Förderung aus Ihrem Dach."
        text="Wir prüfen Landes- und Kommunalprogramme für Ihren Standort, stimmen Anträge und Vertrag zeitlich ab und übernehmen Netzanmeldung und Marktstammdatenregister."
        primary={{ label: "Kostenloses Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check starten", href: "/foerdercheck" }}
      />
    </div>
  );
}

const PUNKT = { zuschuss: "bg-ov-600", darlehen: "bg-navy-500", kommunal: "bg-ov-200 ring-1 ring-ov-300", bund: "bg-ink-200 ring-1 ring-ink-300" };
const CHIP = { zuschuss: "bg-ov-600 text-white", darlehen: "bg-navy-500 text-white", kommunal: "bg-ov-100 text-ov-800", bund: "bg-white text-ink-700" };
