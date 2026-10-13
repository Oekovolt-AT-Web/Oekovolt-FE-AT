// src/app/forderungen/aktuell/page.js
//
// Förder-Ticker Österreich: datierte Meldungen zu Förderungen, Fristen und
// Gesetzesänderungen mit amtlicher Quelle (src/data/foerderTicker.js). Filter nach
// Art, Bundesland und Zielgruppe; ItemList-Schema, NewsArticle nur für Einträge mit
// eigenem Text; RSS unter /forderungen/aktuell/rss.xml; Push-Thema „foerderung“.

import Link from "next/link";
import { ArrowRight, BellRing, CalendarClock, SearchCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import PushOptIn from "@/components/Kanaele/PushOptIn";
import FoerderTickerListe from "@/components/Forderungen/FoerderTickerListe";
import { Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import { EAG_2027, EAG_IZ } from "@/components/Forderungen/Shared/bund";
import { LAENDER_SLUGS, STAND } from "@/data/bundeslaender";
import { tickerEintraege, tickerStand } from "@/data/foerderTicker";
import { fristenImFenster, istKommend } from "@/data/foerderFristen";
import { datumKurzIso, heuteWienIso } from "@/lib/programmStatus";
import { BASE_URL } from "@/lib/site";

// Stündlich neu rendern, damit „nächste Fristen“ ohne Deploy wandern (Muster eag-foerdercall).
export const revalidate = 3600;

const PFAD = "/forderungen/aktuell";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITLE = "Förder-Ticker Österreich: PV, Speicher, Fristen | Ökovolt";
const DESCRIPTION = "Aktuelle Förder-Meldungen Österreich mit amtlicher Quelle: EAG-Fördercall, Förderung 2027, Landesprogramme, Klimafonds, ElWG, Marktpreis. Datiert, geprüft, als RSS und Push.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Förderung Photovoltaik aktuell", "PV-Förderung 2027 Österreich", "EAG Fördercall aktuell", "Förder-News Österreich", "Speicherförderung 2027", "Landesförderung aktuell"],
  alternates: { canonical: PAGE_URL, types: { "application/rss+xml": `${PAGE_URL}/rss.xml` } },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Förder-Ticker Österreich – Ökovolt" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

export default function FoerderTickerPage() {
  const eintraege = tickerEintraege();
  const stand = tickerStand();
  const heuteIso = heuteWienIso(); // Kalendertag in Wien, nicht UTC
  const naechste = fristenImFenster({ heuteIso, vor: 0, nach: 3 }).filter((f) => istKommend(f, heuteIso)).slice(0, 4);
  // Prüfdatum der Meldungen (jüngstes geprueftAm) – eine Stand-Angabe für die ganze Seite
  const geprueft = eintraege.reduce((m, e) => (e.geprueftAm > m ? e.geprueftAm : m), "") || stand || STAND.iso;
  const laender = LAENDER_SLUGS.map((l) => ({ key: l.key, name: l.name }));

  const schemaListe = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${PAGE_URL}/#liste`,
    name: "Förder-Ticker Österreich",
    numberOfItems: eintraege.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: eintraege.map((e, i) => ({ "@type": "ListItem", position: i + 1, name: e.titel, url: `${PAGE_URL}#${e.id}` })),
  };
  const schemaArtikel = eintraege
    .filter((e) => e.text)
    .map((e) => ({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "@id": `${PAGE_URL}#${e.id}`,
      headline: e.titel,
      description: e.kurz,
      articleBody: e.text,
      datePublished: e.datum,
      dateModified: e.geprueftAm || e.datum,
      inLanguage: "de-AT",
      mainEntityOfPage: `${PAGE_URL}#${e.id}`,
      isBasedOn: e.quelle.url,
      author: { "@id": `${BASE_URL}/#organization` },
      publisher: { "@id": `${BASE_URL}/#organization` },
    }));

  const faq = [
    { q: "Woher stammen die Meldungen im Förder-Ticker?", a: "Jede Meldung verweist auf eine amtliche Quelle – Ministerium, Förderstelle, Klima- und Energiefonds, OeMAG, Parlament, Land oder Landwirtschaftskammer – und trägt das Datum der Meldung sowie unser Prüfdatum. Was nur angekündigt ist, bleibt als angekündigt gekennzeichnet." },
    { q: "Ist die PV-Förderung 2027 schon beschlossen?", a: `Nein. Das BMWET hat am 06.10.2026 Eckpunkte angekündigt (Speichersystembonus, Energiemanagement als Voraussetzung, laufendes Antragsmodell). ${EAG_2027.offen} Die Novelle braucht eine Zweidrittelmehrheit im Parlament.` },
    { q: "Wie erfahre ich von neuen Fristen?", a: "Per RSS-Feed unter /forderungen/aktuell/rss.xml, per Push-Benachrichtigung zum Thema Förderungen oder über den Fristen-Kalender mit ICS-Datei für Outlook, Google und Apple Kalender." },
    { q: "Wie oft wird der Ticker geprüft?", a: "Ein wöchentlicher Quellen-Monitor vergleicht die amtlichen Seiten auf Änderungen und liefert Entwürfe; veröffentlicht wird ausschließlich redaktionell nach Prüfung der Primärquelle. Einträge mit Prüfdatum älter als 35 Tage lassen unsere Tests fehlschlagen." },
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schemaListe, ...schemaArtikel]) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Aktuell" }]}
        eyebrow={`Förder-Ticker · ${eintraege.length} Meldungen · geprüft ${datumKurzIso(geprueft)}`}
        title={<>Förderung aktuell: <span className="ov-text-gradient-light">was sich gerade ändert</span></>}
        lead="Datierte Meldungen zu EAG-Fördercall, Förderung 2027, Landesprogrammen, Klimafonds, ElWG und Marktpreis – jede mit amtlicher Quelle und Prüfdatum. Angekündigtes bleibt angekündigt, bis es beschlossen ist."
        points={["Nur amtliche Quellen", "Status je Meldung", "RSS und Push", "Fristen als Kalender"]}
        actions={[
          { label: "Fristen-Kalender", href: "/forderungen/fristen", icon: CalendarClock },
          { label: "Förder-Check", href: "/foerdercheck", icon: SearchCheck },
        ]}
      />

      <Section tone="white" space="md">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
          <div className="min-w-0">
            <SectionHeading as="h2" eyebrow="Meldungen" title="Alle Förder-Meldungen, neueste zuerst" lead={<>Filtern nach Art, Bundesland und Zielgruppe. Die Programme selbst mit Status finden Sie im <Link href="/foerdercheck" className={LINK}>Förder-Check</Link> und auf den <Link href="/forderungen/landesforderungen" className={LINK}>Landesseiten</Link>.</>} className="mb-8" />
            <FoerderTickerListe eintraege={eintraege} laender={laender} aktuellerPfad={PFAD} />
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                <CalendarClock aria-hidden="true" className="h-4 w-4 text-ov-600" />
                Nächste Termine
              </p>
              <ol className="mt-4 space-y-3">
                {naechste.map((f) => (
                  <li key={f.id} className="flex gap-3">
                    <span className="ov-num w-14 shrink-0 font-display text-[15px] font-extrabold text-ink-900">{f.datum.slice(8, 10)}.{f.datum.slice(5, 7)}.</span>
                    <span className="text-[14px] leading-snug text-ink-700">
                      {f.titel}
                      {f.voraussichtlich && <span className="ml-1 text-[12px] font-semibold text-ink-500">(voraussichtlich)</span>}
                    </span>
                  </li>
                ))}
              </ol>
              <Link href="/forderungen/fristen" className="group mt-4 inline-flex items-center gap-2 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                Alle Fristen mit Kalenderdatei
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="rounded-3xl bg-navy-950 p-6 text-white">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">
                <BellRing aria-hidden="true" className="h-4 w-4" />
                Benachrichtigung
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">Neue Fristen und Förderänderungen direkt im Browser – Thema „Förderungen & Gesetzesänderungen“.</p>
              <PushOptIn thema="foerderung" dunkel className="mt-4" />
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading as="h2" eyebrow="Häufige Fragen" title="Förder-Ticker – kurz beantwortet" />
            <StandPille className="mt-5">Letzte Meldung {stand ? datumKurzIso(stand) : "–"} · Meldungen geprüft {datumKurzIso(geprueft)}</StandPille>
          </div>
          <Faq items={faq} />
        </div>
        <Quellen
          klappbar
          className="mt-12"
          stand={datumKurzIso(geprueft)}
          quellen={[...eintraege.map((e) => e.quelle), ...eintraege.flatMap((e) => e.quellen || []), ...EAG_IZ.quellen.slice(-2)]}
          hinweis="Alle Meldungen sind Orientierung, keine Rechts- oder Steuerberatung. Verbindlich sind die Richtlinien der Förderstellen und die kundgemachten Gesetze."
        />
      </Section>

      <Querverweise pfad="/forderungen/bundesfoerderung" />
      <CtaBand
        eyebrow="Förderung sichern"
        title="Wir behalten die Fristen im Blick – Sie das Projekt."
        text="Wir prüfen Bundes- und Landesförderung für Ihren Standort, bereiten Anträge vor und stimmen Netzzugang und Inbetriebnahme auf die Fristen ab."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check starten", href: "/foerdercheck", icon: SearchCheck }}
      />
    </div>
  );
}
