// src/app/forderungen/landesforderungen/[name]/page.js
//
// Statische Landesseiten für alle neun Bundesländer. Inhalte aus
// @/data/bundeslaender – keine Backend-Abfrage.

import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator, SearchCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import { LandAufEinenBlick, LandesAnlaufstellen, LandesNachbarn, LandesProgramme, LandesRecht, LandesStandort, landesFaq } from "@/components/Forderungen/LandesDetails";
import { Quellen } from "@/components/Forderungen/Shared/Bausteine";
import { Bildnachweis, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { EAG_IZ } from "@/components/Forderungen/Shared/bund";
import { FOERDERARTEN, LAENDER_SLUGS, NACHBARN, STAND, landesPfad, seiteFuerSlug } from "@/data/bundeslaender";
import { BASE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return LAENDER_SLUGS.map((l) => ({ name: l.slug }));
}

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
  const nachbarn = NACHBARN[key] || [];

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
        variant="immersive"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Landesförderungen", href: "/forderungen/landesforderungen" }, { name: land.name }]}
        eyebrow={`Förderung ${land.name} · ${FOERDERARTEN[land.foerderart].label} · Stand ${STAND.kurz}`}
        title={<>Photovoltaik-Förderung <span className="ov-text-gradient-light">{land.name}</span> 2026</>}
        lead={`${land.kurz} Hier finden Sie alle Landesprogramme für Unternehmen, Landwirtschaft, Gemeinden und Private, die Bauordnung in Kurzform und die zuständigen Netzbetreiber.`}
        image={land.bild ? { src: land.bild.src, alt: land.bild.alt, position: land.bild.position } : undefined}
        points={["Landesprogramme mit Status", "EAG-Zuschuss des Bundes", "Bauordnung & Netz", "Quellen und Prüfdatum"]}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Förder-Check", href: `/foerdercheck?land=${key}`, icon: SearchCheck },
        ]}
      />

      <KennzahlenBand
        items={[
          { value: land.programme.length, label: land.programme.length === 1 ? "Landesprogramm erfasst" : "Landesprogramme erfasst" },
          { text: `${land.ertrag[0].toLocaleString("de-DE")}–${land.ertrag[1].toLocaleString("de-DE")}`, label: "kWh je kWp und Jahr (PVGIS)" },
          { value: land.netzbetreiber.length, label: land.netzbetreiber.length === 1 ? "Verteilernetzbetreiber" : "große Verteilernetzbetreiber" },
          { text: EAG_IZ.naechsterCall.zeitraum.replace(".2026", ""), label: "nächster EAG-Fördercall 2026" },
        ]}
      />

      <LandAufEinenBlick keyName={key} land={land} />
      <LandesProgramme land={land} />
      <LandesAnlaufstellen land={land} />
      <LandesRecht land={land} />
      <LandesStandort land={land} />
      <LandesNachbarn keyName={key} nachbarn={nachbarn} />

      <Section tone="sand" space="md">
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
        <Quellen
          klappbar
          className="mt-12"
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
        secondary={{ label: "Zuschuss berechnen", href: "/forderungen/bundesfoerderung#rechner", icon: Calculator }}
      />
      {land.bild && <Bildnachweis items={[{ motiv: land.bild.motiv, urheber: land.bild.urheber, lizenz: land.bild.lizenz, href: land.bild.href }]} />}
    </div>
  );
}
