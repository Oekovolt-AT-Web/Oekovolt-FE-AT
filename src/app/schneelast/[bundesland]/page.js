// src/app/schneelast/[bundesland]/page.js
//
// Schneelast-Richtwerte je Bundesland: Tabelle der Bezirkshauptorte (in Wien: Gemeindebezirke),
// Werte zur BUILD-Zeit aus dem Raster data/schneelast/sk50-at.bin gelesen (serverseitig, fs;
// eigene Auswertung GeoSphere Austria SNOWGRID-CL v2.1, CC BY 4.0). Kurze Einordnung wird
// ausschließlich aus diesen Werten erzeugt. HORA wird NICHT abgefragt; der Normwert steht in eHORA.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator, MapPin, Mountain } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { Bildnachweis } from "@/components/Loesungen/Bausteine";
import Pflichthinweis from "@/components/Schneelast/Pflichthinweis";
import { LaenderKarten, LandTabelle, ModulTabelle, QuellenBlock, SCHNEELAST_QUELLEN } from "@/components/Schneelast/Bausteine";
import { BASE_URL } from "@/lib/site";
import { BUNDESLAENDER, landesPfad } from "@/data/bundeslaender";
import { LAENDER, landFuerSlug, schneelastPfad } from "@/lib/schneelast/laender";
import { laenderUeberblick, rasterMeta, richtwerteFuerLand } from "@/lib/schneelast/richtwerte";
import { spanne, zahl } from "@/lib/schneelast/einordnung";

export const dynamicParams = false;

export function generateStaticParams() {
  return LAENDER.map((l) => ({ bundesland: l.slug }));
}

function texte(land, zeilen) {
  const wien = land.slug === "wien";
  const s = spanne(zeilen);
  const einheit = wien ? "Gemeindebezirke" : "Orte";
  const titel = wien ? "Schneelast Wien: Richtwerte für alle 23 Bezirke" : `Schneelast ${land.name}: Richtwerte für ${zeilen.length} Orte`;
  const beschreibung = s
    ? `Schneelast-Richtwerte ${land.imLand}: ${zahl(s.min.sk, 1)} bis ${zahl(s.max.sk, 1)} kN/m² in ${zeilen.length} ${einheit} – aus GeoSphere-Daten (SNOWGRID-CL), mit Dachlast und Modulklasse. Normwert in eHORA.`
    : `Schneelast-Richtwerte ${land.imLand} aus GeoSphere-Daten (SNOWGRID-CL). Normwert in eHORA.`;
  return { wien, s, einheit, titel, beschreibung };
}

export async function generateMetadata({ params }) {
  const { bundesland } = await params;
  const land = landFuerSlug(bundesland);
  if (!land) return {};
  const zeilen = richtwerteFuerLand(land.slug);
  const { titel, beschreibung } = texte(land, zeilen);
  const url = `${BASE_URL}${schneelastPfad(land.slug)}`;
  const bild = BUNDESLAENDER[land.slug]?.bild;
  return {
    title: `${titel} | Ökovolt`,
    description: beschreibung,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_AT",
      url,
      siteName: "Ökovolt Österreich",
      title: titel,
      description: beschreibung,
      ...(bild ? { images: [{ url: `${BASE_URL}${bild.src}`, alt: bild.alt }] } : {}),
    },
  };
}

/** Kurze Einordnung – nur aus den gelesenen Werten, keine freien Behauptungen. */
function einordnungSaetze(land, zeilen, s, wien) {
  if (!s) return [];
  const mit = zeilen.filter((z) => z.sk != null);
  const zaehle = (stufe) => mit.filter((z) => z.modul?.stufe === stufe).length;
  const standard = zaehle("standard");
  const erhoeht = zaehle("erhoeht");
  const hoch = zaehle("hoch") + zaehle("sonder");
  const hoechster = [...zeilen].sort((a, b) => b.hoehe - a.hoehe)[0];
  const tiefster = [...zeilen].sort((a, b) => a.hoehe - b.hoehe)[0];
  const wer = wien ? "der 23 Gemeindebezirke" : `der ${zeilen.length} Orte`;

  const saetze = [
    `${land.imLand.charAt(0).toUpperCase()}${land.imLand.slice(1)} liegen die Schneelast-Richtwerte ${wer} zwischen ${zahl(s.min.sk, 1)} kN/m² (${s.min.ort}) und ${zahl(s.max.sk, 1)} kN/m² (${s.max.ort}); der Median beträgt ${zahl(s.median, 1)} kN/m².`,
  ];
  if (hoechster && tiefster && hoechster !== tiefster) {
    saetze.push(
      `${wien ? "Der höchstgelegene Bezirkspunkt" : "Der höchstgelegene Ort"} ist ${hoechster.ort} mit ${zahl(hoechster.hoehe)} m (${hoechster.sk != null ? `${zahl(hoechster.sk, 1)} kN/m²` : "kein Wert"}), der tiefste ${tiefster.ort} mit ${zahl(tiefster.hoehe)} m (${tiefster.sk != null ? `${zahl(tiefster.sk, 1)} kN/m²` : "kein Wert"}).`
    );
  }
  const teile = [];
  if (standard) teile.push(`${standard} mit Standardmodulen (2400 Pa)`);
  if (erhoeht) teile.push(`${erhoeht} mit Schneelastmodulen (5400 Pa)`);
  if (hoch) teile.push(`${hoch} erst mit Hochlastmodulen oder Sonderlösung`);
  if (teile.length) {
    saetze.push(`Bei einem Satteldach mit 30° ohne Schneefang kommen rechnerisch ${teile.join(", ")} aus – bezogen auf den Richtwert am ${wien ? "Bezirkspunkt" : "Ortspunkt"}.`);
  }
  return saetze;
}

export default async function SchneelastLandPage({ params }) {
  const { bundesland } = await params;
  const land = landFuerSlug(bundesland);
  if (!land) notFound();

  const zeilen = richtwerteFuerLand(land.slug);
  const { wien, s, titel, beschreibung, einheit } = texte(land, zeilen);
  const bild = BUNDESLAENDER[land.slug]?.bild;
  const laender = laenderUeberblick();
  const meta = rasterMeta();
  const url = `${BASE_URL}${schneelastPfad(land.slug)}`;
  const saetze = einordnungSaetze(land, zeilen, s, wien);

  const faq = [
    {
      q: `Wie hoch ist die Schneelast ${land.imLand}?`,
      a: s
        ? `Die 50-jährlichen Schneelast-Richtwerte ${wien ? "der Wiener Gemeindebezirke" : `der Bezirkshauptorte ${land.imLand}`} reichen von ${zahl(s.min.sk, 1)} kN/m² (${s.min.ort}) bis ${zahl(s.max.sk, 1)} kN/m² (${s.max.ort}). Das sind Richtwerte aus GeoSphere-Daten (SNOWGRID-CL, CC BY 4.0) für eine 1-km-Zelle – kein Normwert nach ÖNORM B 1991-1-3. Für ein bestimmtes Grundstück zählt der Normwert aus eHORA.`
        : "Für dieses Bundesland liegen derzeit keine Richtwerte vor. Den Normwert zeigt eHORA.",
    },
    {
      q: `Gibt es ${land.imLand} Schneelastzonen?`,
      a: "Nein. Seit der ÖNORM B 1991-1-3 vom 15. Mai 2022 gibt es in ganz Österreich keine Schneelastzonen mehr. Die Schneelast wird für jeden Punkt aus einer Karte im 50-m-Raster bis 2.000 m Seehöhe abgelesen, die über eHORA (hora.gv.at) öffentlich zugänglich ist.",
    },
    {
      q: "Reicht der Richtwert für die Statik meiner PV-Anlage?",
      a: "Nein. Der Richtwert ist eine erste Orientierung für die Planung. Für Einreichung, Unterkonstruktion und den Nachweis des Dachstuhls braucht es den Normwert aus eHORA und eine befugte Tragwerksplanung. Wir bereiten die Normen-Standortabfrage für Sie vor.",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}/#webpage`,
    url,
    name: titel,
    description: beschreibung,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@type": "AdministrativeArea", name: land.name, containedInPlace: { "@type": "Country", name: "Österreich" } },
    mainEntity: {
      "@type": "Table",
      about: `Schneelast-Richtwerte ${land.imLand}`,
    },
    isBasedOn: {
      "@type": "Dataset",
      name: "SNOWGRID Klima v2.1 (SNOWGRID-CL), 1 km, täglich",
      url: "https://data.hub.geosphere.at/dataset/snowgrid_cl-v2-1d-1km",
      license: "https://creativecommons.org/licenses/by/4.0/",
      creator: { "@type": "Organization", name: "GeoSphere Austria", url: "https://www.geosphere.at/" },
    },
    publisher: { "@id": `${BASE_URL}/#organization` },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Rechner & Tools", href: "/rechner" }, { name: "Schneelast-Karte", href: "/schneelast" }, { name: land.name }]}
        eyebrow={`Schneelast ${land.name}`}
        title={
          wien ? (
            <>
              Schneelast Wien: <span className="ov-text-gradient-light">Richtwerte für alle 23 Bezirke</span>
            </>
          ) : (
            <>
              Schneelast {land.name}: <span className="ov-text-gradient-light">Richtwerte für {zeilen.length} Orte</span>
            </>
          )
        }
        lead={`50-jährliche Schneelast-Richtwerte ${wien ? "der Wiener Gemeindebezirke" : `der Bezirkshauptorte ${land.imLand}`} aus offenen GeoSphere-Daten – mit Dachschneelast bei 30° und der Modulklasse, die rechnerisch passt.`}
        image={bild ? { src: bild.src, alt: bild.alt, position: bild.position } : undefined}
        points={["Richtwert aus SNOWGRID-CL", "Stand 09/2026", "Normwert in eHORA"]}
        className="[&>div.ov-container]:pb-24 md:[&>div.ov-container]:pb-32"
      />

      {s && (
        <section aria-label="Kennzahlen" className="relative z-10 -mt-14 md:-mt-20">
          <div className="ov-container">
            <dl className="grid grid-cols-2 gap-3 rounded-[2rem] bg-white p-3 shadow-[0_30px_80px_-30px_rgba(21,26,36,0.35)] ring-1 ring-ink-200/70 md:grid-cols-4 md:p-4">
              <Kennzahl label={`${einheit} ausgewertet`} wert={zahl(zeilen.length)} />
              <Kennzahl label={`Niedrigster Wert · ${s.min.ort}`} wert={`${zahl(s.min.sk, 1)} kN/m²`} />
              <Kennzahl label={`Höchster Wert · ${s.max.ort}`} wert={`${zahl(s.max.sk, 1)} kN/m²`} />
              <Kennzahl label="Median" wert={`${zahl(s.median, 1)} kN/m²`} betont />
            </dl>
          </div>
        </section>
      )}

      <Section tone="white" space="md" id="tabelle" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Einordnung" title={`Schneelast ${land.imLand} auf einen Blick`} />
            <Reveal className="mt-6 space-y-4 text-[16px] leading-[1.75] text-ink-600">
              {saetze.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </Reveal>
            <Pflichthinweis className="mt-6" />
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/schneelast#werkzeug" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ov-600 px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-ov-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2">
                <MapPin aria-hidden="true" className="h-4 w-4" /> Eigenen Ort prüfen
              </Link>
              <Link href="/standort-check" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-[14.5px] font-semibold text-ink-900 ring-1 ring-ink-200 transition-colors hover:ring-ov-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500">
                Zum Standort-Check <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <Reveal delay={100}>
            <h2 className="mb-4 font-display text-[20px] font-bold text-ink-900">{wien ? "Richtwerte der 23 Wiener Gemeindebezirke" : `Richtwerte der Bezirkshauptorte ${land.imLand}`}</h2>
            <LandTabelle zeilen={zeilen} wien={wien} />
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Modulklassen"
              title="Bis wohin Standard-, Schneelast- und Hochlastmodule reichen"
              lead="Die Grenzwerte gelten für den Richtwert sₖ am Boden. Flach geneigte Hallendächer sind strenger als steile Satteldächer, weil kaum Schnee abrutscht und die Last fast senkrecht auf das Modul wirkt."
            />
            <p className="mt-6 flex gap-2 text-[14px] leading-relaxed text-ink-600">
              <Mountain aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-navy-600" />
              Über 2.000 m Seehöhe geben wir keinen Richtwert aus – dort ist ein Schneelastgutachten sinnvoll.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-600">
              Förderungen und Baurecht {land.imLand}:{" "}
              <Link href={landesPfad(land.slug)} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-ov-600">
                Landesförderung {land.name}
              </Link>
              .
            </p>
          </div>
          <ModulTabelle hell />
        </div>
      </Section>

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Alle Bundesländer" title="Schneelast in den anderen Bundesländern" className="mb-10" />
        <LaenderKarten laender={laender} aktiv={land.slug} />
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title={`Schneelast ${land.name}: Fragen & Antworten`} />
          <Faq items={faq} />
        </div>
      </Section>

      <Section tone="white" space="sm">
        <QuellenBlock quellen={SCHNEELAST_QUELLEN} stand={meta?.stand} />
      </Section>

      <CtaBand
        eyebrow={`Photovoltaik ${land.imLand}`}
        title="Wir klären die Schneelast Ihres Dachs – mit Normwert und Statik."
        text="Normen-Standortabfrage aus eHORA, Dachstuhl und Unterkonstruktion geprüft, Module passend zur Last gewählt – für Gewerbe, Landwirtschaft und Gemeinden in ganz Österreich."
        primary={{ label: "Standort prüfen lassen", href: "/angebot" }}
        secondary={{ label: "Schneelast-Karte öffnen", href: "/schneelast", icon: Calculator }}
      />

      {bild && <Bildnachweis items={[{ motiv: bild.motiv, urheber: bild.urheber, lizenz: bild.lizenz, href: bild.href }]} />}
    </div>
  );
}

function Kennzahl({ label, wert, betont = false }) {
  return (
    <div className={betont ? "rounded-2xl bg-ov-600 p-4 text-white md:p-5" : "rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60 md:p-5"}>
      <dt className={betont ? "text-[12.5px] font-medium text-white" : "text-[12.5px] font-medium text-ink-500"}>{label}</dt>
      <dd className="ov-num mt-1 font-display text-[clamp(1.25rem,1.05rem+0.7vw,1.75rem)] font-extrabold leading-tight tracking-tight">{wert}</dd>
    </div>
  );
}
