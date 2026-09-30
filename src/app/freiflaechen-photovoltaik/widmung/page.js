// src/app/freiflaechen-photovoltaik/widmung/page.js
//
// Übersicht: Widmung und Zonierung für Freiflächen-Photovoltaik in allen neun
// Bundesländern. Daten aus src/lib/flaeche/laender.js (RIS, Stand 30.09.2026).

import Link from "next/link";
import { ClipboardCheck, SearchCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import { Quellen, Hinweis } from "@/components/Forderungen/Shared/Bausteine";
import { Bildnachweis } from "@/components/Loesungen/Bausteine";
import { nachweise } from "@/components/Loesungen/A/bildnachweise";
import { LaenderKacheln, LaenderTabelle } from "@/components/FlaechenCheck/Widmung";
import { ABLAUF } from "@/components/FlaechenCheck/ablauf";
import { BUND_QUELLEN, LAENDER, STAND } from "@/lib/flaeche/laender";
import { BASE_URL } from "@/lib/site";

const PFAD = "/freiflaechen-photovoltaik/widmung";
const SEITE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Freiflächen-PV Widmung: alle 9 Bundesländer | Ökovolt";
const BESCHREIBUNG = `Widmung, Zonen und Schwellen für Solarparks in allen neun Bundesländern – mit Normen aus dem RIS, Stand ${STAND.label}, und markierten offenen Punkten.`;
const HERO_BILD = "/Images/AT/loesungen/freiflaeche-solarpark-duernrohr.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["Freiflächen Photovoltaik Widmung", "PV Freifläche Raumordnung Bundesland", "Grünland Photovoltaik Widmung", "PV-Zonen Österreich", "Sonderausweisung Photovoltaik"],
  alternates: { canonical: SEITE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    locale: "de_AT",
    url: SEITE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1920, height: 1080, alt: "Photovoltaik-Park Dürnrohr in Niederösterreich" }],
  },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHREIBUNG, images: [`${BASE_URL}${HERO_BILD}`] },
};

export default function WidmungUebersichtPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SEITE_URL}/#webpage`,
    url: SEITE_URL,
    name: "Freiflächen-Photovoltaik: Widmung in allen Bundesländern",
    description: BESCHREIBUNG,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND.iso,
    about: { "@type": "Thing", name: "Flächenwidmung für Photovoltaik-Freiflächenanlagen in Österreich" },
    hasPart: LAENDER.map((l) => ({ "@type": "WebPage", name: `Freiflächen-PV Widmung ${l.name}`, url: `${SEITE_URL}/${l.slug}` })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Freiflächen-Photovoltaik", href: "/freiflaechen-photovoltaik" }, { name: "Widmung" }]}
        eyebrow={`Rechtslage · Stand ${STAND.label}`}
        title={
          <>
            Widmung für Solarparks: <span className="ov-text-gradient-light">neun Länder, neun Regeln.</span>
          </>
        }
        lead="Ob auf einer Fläche ein Solarpark entstehen darf, entscheidet die Raumordnung des Landes und der Flächenwidmungsplan der Gemeinde. Hier sind die Regeln aller Bundesländer – mit Norm, Quelle und dem, was noch offen ist."
        image={{ src: HERO_BILD, alt: "Luftbild eines Photovoltaik-Parks auf einem ehemaligen Kraftwerksgelände in Niederösterreich" }}
        points={["Normen aus dem RIS", "Zonen & Schwellen", "Beschleunigungsgebiete", "Unsicheres markiert"]}
        actions={[
          { label: "Fläche prüfen", href: "/flaechen-check", icon: SearchCheck },
          { label: "Pacht-Rechner", href: "/rechner/freiflaeche-pacht" },
        ]}
      />

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Vergleich"
          title="Ab wann Widmung oder Zone nötig ist"
          lead="Grünland ist für Land- und Forstwirtschaft bestimmt. Ein Solarpark braucht darum fast überall eine eigene Widmung – und ab einer bestimmten Größe eine Zone des Landes."
        />
        <LaenderTabelle />
        <Hinweis ton="warn" className="mt-8" titel="Keine Rechtsberatung">
          Vereinfachte Darstellung des konsolidierten Landesrechts im RIS, geprüft am {STAND.label}. Naturschutz, Elektrizitätsrecht, Baurecht und Ortsbild gelten zusätzlich. Die Rechtslage ändert sich laufend – vor Projektstart bei Gemeinde und Landesregierung prüfen.
        </Hinweis>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="EABG"
          title="Beschleunigungsgebiete: Rahmen steht, Karten fehlen oft noch"
          lead="Mit dem Erneuerbaren-Ausbau-Beschleunigungsgesetz (EABG, BGBl. I Nr. 47/2026) setzt Österreich die EU-Richtlinie RED III um. In ausgewiesenen Beschleunigungsgebieten sollen Verfahren deutlich schneller gehen – die Gebiete weisen aber die Länder aus, und das war zum Prüfdatum vielerorts noch offen."
        />
        <ul className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {LAENDER.map((l) => (
            <li key={l.slug} className="rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
              <Link href={`${PFAD}/${l.slug}`} className="font-display text-[16.5px] font-bold text-ink-900 underline decoration-ink-200 underline-offset-4 hover:text-ov-700 hover:decoration-ov-300">
                {l.name}
              </Link>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{l.beschleunigung}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Von der Fläche zur Widmung" />
        <Steps items={ABLAUF} className="mt-12" />
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Bundesländer" title="Die Rechtslage je Land im Detail" />
        <LaenderKacheln className="mt-10" />
        <div className="mt-12 flex flex-col gap-3 rounded-3xl bg-ov-50 p-6 ring-1 ring-ov-100 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="max-w-2xl text-[15.5px] leading-relaxed text-ink-700">
            <strong className="text-ink-900">Sie besitzen eine Fläche?</strong> Der Flächen-Check bewertet Widmung, Größe, Netz und Gelände in einer Ampel und zeigt die belegte Pachtspanne.
          </p>
          <Link href="/flaechen-check" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
            <ClipboardCheck aria-hidden="true" className="h-4 w-4" />
            Zum Flächen-Check
          </Link>
        </div>
        <Quellen
          klappbar
          className="mt-12"
          stand={STAND.label}
          quellen={[...LAENDER.flatMap((l) => l.quellen), ...BUND_QUELLEN]}
          hinweis="Konsolidiertes Landesrecht im RIS (Open Government Data, CC BY 4.0), ergänzt um Unterlagen der Länder. Offene oder unsichere Punkte stehen auf der jeweiligen Landesseite."
        />
      </Section>

      <Querverweise pfad="/freiflaechen-photovoltaik/widmung" />
      <CtaBand
        eyebrow="Widmung, Netz, Bau"
        title="Vom Grundstück zum Solarpark – mit klarer Genehmigungsstrategie."
        text="Wir prüfen Raumordnung, Netzanschluss und Wirtschaftlichkeit Ihrer Fläche und begleiten Widmung, Bewilligungen und Bau."
        primary={{ label: "Projekt anfragen", href: "/kontakt" }}
        secondary={{ label: "Freiflächenanlagen", href: "/freiflaechen-photovoltaik" }}
      />
      <Bildnachweis items={nachweise("duernrohr")} />
    </div>
  );
}
