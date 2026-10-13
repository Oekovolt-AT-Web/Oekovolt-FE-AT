// src/app/forderungen/landesforderungen/[name]/page.js
//
// Statische Landesseiten für alle neun Bundesländer. Inhalte aus
// @/data/bundeslaender – keine Backend-Abfrage.

//
// Welle C, Paket C08: Title/H1 „Photovoltaik-Förderung <Land> 2026/2027 für Betriebe, Landwirtschaft
// und Gemeinden“ (Title ≤ 60 Zeichen, siehe ./antwort.js), sichtbarer Stand, Antwortblock als
// Tabelle oben, Sektion „Förderung für Gemeinden in <Land>“, Links zu Hub, Förder-Check und Ticker.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator, CalendarDays, Landmark, MapPin, Newspaper, SearchCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { LandAufEinenBlick, LandesAnlaufstellen, LandesNachbarn, LandesProgramme, LandesRecht, LandesStandort, LandesTicker, landesFaq, programmAmpel } from "@/components/Forderungen/LandesDetails";
import { Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import { Bildnachweis, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { EAG_IZ } from "@/components/Forderungen/Shared/bund";
import { datumLang } from "@/components/Forderungen/Shared/format";
import { FOERDERARTEN, LAENDER_SLUGS, NACHBARN, STAND, landesPfad, seiteFuerSlug } from "@/data/bundeslaender";
import { landPfad } from "@/lib/bundesland/auswertung";
import { BASE_URL } from "@/lib/site";
import Antwortblock from "./Antwortblock";
import { antwortZeilen, beschreibungFuer, gemeindeProgramme, h1Fuer, titelFuer } from "./antwort";

export const dynamicParams = false;

export function generateStaticParams() {
  return LAENDER_SLUGS.map((l) => ({ name: l.slug }));
}

// Förder-Ticker und Fristen-Kalender aus Paket C01.
const TICKER = "/forderungen/aktuell";
const FRISTEN = "/forderungen/fristen";

const LINK = "inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current";

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
    keywords: [`Photovoltaik Förderung ${land.name}`, `PV Förderung ${land.name} 2026`, `PV Förderung ${land.name} 2027`, `Photovoltaik Förderung Gemeinden ${land.name}`, `Stromspeicher Förderung ${land.name}`, `Photovoltaik Unternehmen ${land.name}`, "EAG-Investitionszuschuss", "Landesförderung Photovoltaik"],
    alternates: { canonical: url },
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
  const zeilen = antwortZeilen(land);
  const relevanteProgramme = land.programme.filter((p) => zeilen.some((z) => z.id === p.name));
  const gemeinde = gemeindeProgramme(land);
  const hub = landPfad(key);
  const foerderCheck = `/foerdercheck?land=${key}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: h1Fuer(land.name),
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
        eyebrow={`Förderung ${land.name} · ${FOERDERARTEN[land.foerderart].label} · Stand ${datumLang(land.stand)}`}
        title={
          <>
            Photovoltaik-Förderung <span className="ov-text-gradient-light">{land.name}</span> 2026/2027 für Betriebe, Landwirtschaft und Gemeinden
          </>
        }
        lead={`${land.kurz} Hier finden Sie alle Landesprogramme für Unternehmen, Landwirtschaft, Gemeinden und Private mit Status, die Bauordnung in Kurzform und die zuständigen Netzbetreiber.`}
        image={land.bild ? { src: land.bild.src, alt: land.bild.alt, position: land.bild.position } : undefined}
        points={["Landesprogramme mit Status", "EAG-Zuschuss des Bundes", "Bauordnung & Netz", `Stand ${STAND.kurz}, Quellen je Programm`]}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Förder-Check", href: foerderCheck, icon: SearchCheck },
        ]}
      />

      {/* Antwortblock: Programm, Zielgruppe, Höhe, Frist, Quelle – Status im Browser berechnet */}
      <Section tone="sand" space="md" id="antwort" aria-labelledby="antwort-titel">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
              Kurzantwort
            </p>
            <h2 id="antwort-titel" className="ov-h2 mt-4 text-ink-900">
              Landesprogramme {land.name} für Betriebe, Landwirtschaft und Gemeinden
            </h2>
            <p className="ov-lead mt-4 text-ink-600">
              {zeilen.length
                ? `${zeilen.length === 1 ? "Ein Landesprogramm" : `${zeilen.length} Landesprogramme`} zum Prüfdatum erfasst – dazu kommt in ${land.name} immer der EAG-Investitionszuschuss des Bundes (nächster Call ${EAG_IZ.naechsterCall.zeitraum}).`
                : `Kein offenes Landesprogramm für Betriebe zum Prüfdatum – in ${land.name} trägt der EAG-Investitionszuschuss des Bundes (nächster Call ${EAG_IZ.naechsterCall.zeitraum}).`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StandPille>
              Stand <time dateTime={land.stand}>{datumLang(land.stand)}</time>
            </StandPille>
          </div>
        </div>
        <Antwortblock landName={land.name} zeilen={zeilen} programme={relevanteProgramme} stand={STAND.label} />
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-1">
          <Link href={foerderCheck} className={LINK}>
            <SearchCheck aria-hidden="true" className="h-4 w-4" />
            Förder-Check für Ihr Vorhaben in {land.name}
          </Link>
          <Link href={hub} className={LINK}>
            <MapPin aria-hidden="true" className="h-4 w-4" />
            Photovoltaik {land.name}: Ertrag, Netz, Schneelast
          </Link>
          <Link href={TICKER} className={LINK}>
            <Newspaper aria-hidden="true" className="h-4 w-4" />
            Förder-Ticker: Änderungen und Fristen
          </Link>
          <Link href={FRISTEN} className={LINK}>
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            Fristen-Kalender
          </Link>
        </div>
      </Section>

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
      <LandesTicker keyName={key} land={land} />

      {/* Förderung für Gemeinden – eigene Sektion (Suchintention „Photovoltaik Förderung Gemeinde <Land>“) */}
      <Section tone="sand" space="md" id="gemeinden" aria-labelledby="gemeinden-titel">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
              Öffentliche Hand
            </p>
            <h2 id="gemeinden-titel" className="ov-h2 mt-4 text-ink-900">
              Förderung für Gemeinden in {land.name}
            </h2>
            <p className="ov-lead mt-4 text-ink-600">{land.ueberblick.gemeinde && land.ueberblick.gemeinde !== "–" ? `Landesebene: ${land.ueberblick.gemeinde}.` : `Zum Prüfdatum ist kein eigenes Landesprogramm für Gemeinden in ${land.name} erfasst.`}</p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-700">{land.gemeinden}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
              Für Gemeindegebäude, Bauhöfe, Kläranlagen und Schulen gilt zusätzlich der EAG-Investitionszuschuss des Bundes. Gemeinden rechnen netto (Vorsteuerabzug je nach Tätigkeit prüfen), die Vergabe läuft nach BVergG.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-1">
              <Link href={`${foerderCheck}&zielgruppe=gemeinde`} className={LINK}>
                <SearchCheck aria-hidden="true" className="h-4 w-4" />
                Förder-Check für Gemeinden
              </Link>
              <Link href="/kommunen/vergabe-foerderung" className={LINK}>
                <Landmark aria-hidden="true" className="h-4 w-4" />
                Vergabe und Förderweg für Gemeinden
              </Link>
              <Link href="/kommunen" className={LINK}>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                PV für Gemeinden und öffentliche Hand
              </Link>
            </div>
          </div>
          <ul className="grid content-start gap-4">
            {gemeinde.length ? (
              gemeinde.map((p, i) => {
                const a = programmAmpel(p);
                return (
                  <Reveal as="li" key={p.name} delay={i * 80} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[12.5px] font-medium text-ink-500">{p.traeger}</p>
                      <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ${a.flaeche} ${a.ring} ${a.text}`}>
                        <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${a.punkt}`} />
                        {a.label}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-[19px] font-bold leading-snug text-ink-900">{p.name}</h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-ink-800">{p.hoehe}</p>
                    {p.was && <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{p.was}</p>}
                    <p className="mt-3 text-[13px] text-ink-600">
                      <span className="font-semibold text-ink-800">Status:</span> {p.status}
                    </p>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[13.5px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                        Quelle: {p.quelle || "Förderstelle"}
                        <span className="sr-only">(externer Link, neues Fenster)</span>
                      </a>
                    )}
                  </Reveal>
                );
              })
            ) : (
              <li className="rounded-3xl bg-white p-6 text-[15px] leading-relaxed text-ink-700 ring-1 ring-ink-200/60 md:p-7">
                <p className="font-display text-[18px] font-bold text-ink-900">Kein Landesprogramm nur für Gemeinden</p>
                <p className="mt-2">
                  Gemeinden in {land.name} nutzen den EAG-Investitionszuschuss (Antrag vor der Inbetriebnahme, Fördercall {EAG_IZ.naechsterCall.zeitraum}) und – je nach Programm – die oben genannten Landesprogramme, soweit sie juristische Personen zulassen. Energiegemeinschaften mit Gemeindebeteiligung beraten die Landesstellen.
                </p>
                <p className="mt-3 text-[13px] text-ink-500">Stand {STAND.label} – Angaben zur Orientierung, verbindlich sind die Richtlinien der Förderstellen.</p>
              </li>
            )}
          </ul>
        </div>
      </Section>

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
        text="Wir prüfen Landes- und Bundesprogramme für Ihren Standort, stimmen EAG-Antrag, Netzzugang und Inbetriebnahme zeitlich ab und übernehmen die Anmeldung beim Netzbetreiber. Förderbeträge sind Richtwerte zur Orientierung – verbindlich ist der Bescheid der Förderstelle."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Zuschuss berechnen", href: "/forderungen/bundesfoerderung#rechner", icon: Calculator }}
      />
      {land.bild && <Bildnachweis items={[{ motiv: land.bild.motiv, urheber: land.bild.urheber, lizenz: land.bild.lizenz, href: land.bild.href }]} />}
    </div>
  );
}
