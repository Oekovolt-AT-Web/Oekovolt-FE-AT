// src/app/forderungen/landesforderungen/[name]/page.js
//
// Statische Landesseiten für alle neun Bundesländer. Inhalte aus
// @/data/bundeslaender – keine Backend-Abfrage.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeEuro, SearchCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import { LandAufEinenBlick, LandesAnlaufstellen, LandesProgramme, LandesRecht, LandesStandort, landesFaq } from "@/components/Forderungen/LandesDetails";
import { Quellen } from "@/components/Forderungen/Shared/Bausteine";
import { EAG_IZ } from "@/components/Forderungen/Shared/bund";
import { BUNDESLAENDER, FOERDERARTEN, LAENDER_SLUGS, NACHBARN, STAND, landesPfad, seiteFuerSlug } from "@/data/bundeslaender";
import { BASE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return LAENDER_SLUGS.map((l) => ({ name: l.slug }));
}

const BILDER = ["/Images/Referenzen/Projekte-1.jpg", "/Images/Referenzen/Projekte-2.jpg", "/Images/Referenzen/Projekte-3.jpg", "/Images/Jobs/jobs3.jpg"];

function titelFuer(name) {
  const lang = `Photovoltaik Förderung ${name} 2026 | Ökovolt`;
  return lang.length <= 60 ? lang : `PV-Förderung ${name} 2026 | Ökovolt`;
}

function beschreibungFuer(name) {
  const lang = `PV-Förderung ${name} 2026 für Betriebe, Landwirtschaft und Gemeinden: Landesprogramme, EAG-Zuschuss, Bauordnung und Netzbetreiber – Stand ${STAND.kurz}.`;
  return lang.length <= 160 ? lang : `PV-Förderung ${name} 2026 für Betriebe und Gemeinden: Landesprogramme, EAG-Zuschuss, Bauordnung, Netzbetreiber – Stand ${STAND.kurz}.`;
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const seite = seiteFuerSlug(name);
  if (!seite) notFound();
  const land = seite.land;
  const url = `${BASE_URL}${landesPfad(seite.key)}`;
  const title = titelFuer(land.name);
  const description = beschreibungFuer(land.name);
  return {
    title,
    description,
    keywords: [`Photovoltaik Förderung ${land.name}`, `PV Förderung ${land.name} 2026`, `Stromspeicher Förderung ${land.name}`, `Photovoltaik Unternehmen ${land.name}`, "EAG-Investitionszuschuss", "Landesförderung Photovoltaik"],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url,
      siteName: "Ökovolt Österreich",
      locale: "de_AT",
      title,
      description,
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: `Photovoltaik-Förderung in ${land.name}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${BASE_URL}/og-image.jpg`] },
  };
}

export default async function LandesforderungDetailPage({ params }) {
  const { name } = await params;
  const seite = seiteFuerSlug(name);
  if (!seite) notFound();
  const { key, land } = seite;
  const pageUrl = `${BASE_URL}${landesPfad(key)}`;
  const faq = landesFaq(land);
  const bildIndex = LAENDER_SLUGS.findIndex((l) => l.key === key) % BILDER.length;
  const nachbarn = (NACHBARN[key] || []).map((k) => ({ key: k, name: BUNDESLAENDER[k].name, kuerzel: BUNDESLAENDER[k].kuerzel, href: landesPfad(k) }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: `Photovoltaik-Förderung in ${land.name} 2026`,
    description: beschreibungFuer(land.name),
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: [
      { "@type": "Thing", name: "Photovoltaik-Förderung" },
      { "@type": "State", name: land.name, containedInPlace: { "@type": "Country", name: "Österreich" } },
    ],
    publisher: { "@id": `${BASE_URL}/#organization` },
    dateModified: land.stand,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Landesförderungen", href: "/forderungen/landesforderungen" }, { name: land.name }]}
        eyebrow={`Förderung ${land.name} · Stand ${STAND.kurz}`}
        title={<>Photovoltaik-Förderung <span className="ov-text-gradient">{land.name}</span> 2026</>}
        lead={`${land.kurz} Hier finden Sie alle Landesprogramme für Unternehmen, Landwirtschaft, Gemeinden und Private, die Bauordnung in Kurzform und die zuständigen Netzbetreiber.`}
        image={{ src: BILDER[bildIndex], alt: `Photovoltaikanlage auf einem Betriebsgebäude – Förderung in ${land.name}` }}
        points={["Landesprogramme mit Status", "EAG-Zuschuss des Bundes", "Bauordnung & Netz", "Quellen und Prüfdatum"]}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Förder-Check", href: `/foerdercheck?land=${key}`, icon: SearchCheck },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <BadgeEuro aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">{FOERDERARTEN[land.foerderart].label}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Nächster EAG-Call: {EAG_IZ.naechsterCall.zeitraum}</p>
            </div>
          </div>
        }
      />

      <LandAufEinenBlick keyName={key} land={land} />
      <LandesProgramme land={land} />
      <LandesAnlaufstellen land={land} />
      <LandesRecht land={land} />
      <LandesStandort land={land} />

      <Section tone="sand" space="sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <h2 className="ov-h3 shrink-0 text-ink-900">Förderung in den Nachbarländern</h2>
          <ul className="flex flex-wrap gap-2.5 lg:justify-end">
            {nachbarn.map((n) => (
              <li key={n.key}>
                <Link href={n.href} className="group inline-flex h-11 items-center gap-2 rounded-full bg-white pl-2 pr-4 text-[14.5px] font-semibold text-ink-800 ring-1 ring-ink-200 transition-all hover:text-ov-800 hover:ring-ov-300">
                  <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-ov-50 px-1.5 text-[11.5px] font-bold text-ov-700">{n.kuerzel}</span>
                  Förderung {n.name}
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-ov-600" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <SolarrechnerTeaser
        href={`/foerdercheck?land=${key}`}
        cta="Förder-Check starten"
        titel={`Welche Programme passen in ${land.name} zu Ihrem Vorhaben?`}
        text="Zielgruppe und Vorhaben wählen – der Förder-Check stellt Bundes- und Landesprogramme für PV, Freifläche, Agri-PV, Speicher, Ladeinfrastruktur und Wärmepumpe mit Links zusammen."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title={`Förderung in ${land.name} – kurz beantwortet`}
            lead={
              <>
                Stand {STAND.label}. Weiterführend:{" "}
                <Link href="/ratgeber/eag-investitionszuschuss" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">EAG-Investitionszuschuss Schritt für Schritt</Link> und{" "}
                <Link href="/ratgeber/investitionsfreibetrag-photovoltaik" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Investitionsfreibetrag für PV</Link>.
              </>
            }
          />
          <Faq items={faq} />
        </div>
      </Section>

      <Section tone="sand" space="md">
        <Quellen
          stand={STAND.label}
          quellen={[...land.quellen, ...land.recht.quellen, ...EAG_IZ.quellen.slice(0, 2)]}
          hinweis="Werte mit dem Vermerk „bitte bei der Förderstelle prüfen“ ließen sich zum Prüfdatum nur über Sekundärquellen belegen. Landesbudgets können ohne Vorankündigung ausgeschöpft sein – verbindlich sind die Richtlinien der Förderstellen."
        />
      </Section>

      <Querverweise pfad="/forderungen/landesforderungen" />
      <CtaBand
        eyebrow="Förderung & Planung aus einer Hand"
        title={`Ihre PV-Anlage in ${land.name} – mit allen Förderungen.`}
        text="Wir prüfen Landes- und Bundesprogramme für Ihren Standort, stimmen EAG-Antrag, Netzzugang und Inbetriebnahme zeitlich ab und übernehmen die Anmeldung beim Netzbetreiber."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check starten", href: `/foerdercheck?land=${key}` }}
      />
    </div>
  );
}
