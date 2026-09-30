import { ArrowUpRight, Clapperboard, Film, Newspaper } from "lucide-react";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Mediathek from "@/components/Reels/Mediathek";
import { dauerIso, FACEBOOK_REELS, reelPfad, reelsSortiert, vorhandeneKategorien } from "@/data/reels";
import { BASE_URL } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/mediathek`;
const TITEL = "Mediathek – Videos von Baustellen & Projekten | Ökovolt";
const BESCHREIBUNG =
  "Kurzvideos von Ökovolt Österreich: Photovoltaik-Montage, Inbetriebnahmen, Technik und Team – Einblicke in Projekte für Gewerbe, Landwirtschaft und Gemeinden.";

export function generateMetadata() {
  const leer = reelsSortiert().length === 0;
  return {
    title: TITEL,
    description: BESCHREIBUNG,
    alternates: { canonical: PAGE_URL },
    // Solange keine Videos vorhanden sind: nicht indexieren, Links aber verfolgen
    robots: leer ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_AT",
      url: PAGE_URL,
      siteName: "Ökovolt Österreich",
      title: TITEL,
      description: BESCHREIBUNG,
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Mediathek" }],
    },
  };
}

export default function MediathekPage() {
  const reels = reelsSortiert();
  const kategorien = vorhandeneKategorien(reels);

  const schema = reels.length
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "Ökovolt Mediathek",
        description: BESCHREIBUNG,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: reels.map((r, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${BASE_URL}${reelPfad(r.slug)}`,
            item: {
              "@type": "VideoObject",
              "@id": `${BASE_URL}${reelPfad(r.slug)}#video`,
              name: r.titel,
              description: r.beschreibung || r.titel,
              thumbnailUrl: [`${BASE_URL}${r.poster}`],
              uploadDate: r.datum,
              ...(r.dauerSek ? { duration: dauerIso(r.dauerSek) } : {}),
              contentUrl: `${BASE_URL}${r.datei}`,
            },
          })),
        },
      }
    : null;

  return (
    <div>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}

      {/* ---------- Kopf ---------- */}
      <section className="ov-noise relative isolate overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -left-32 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-ov-500/25 blur-[120px]" />
        <div aria-hidden="true" className="absolute -right-20 -top-24 -z-10 h-[380px] w-[380px] rounded-full bg-navy-400/30 blur-[120px]" />
        <div className="ov-container pb-14 pt-8 md:pb-20 md:pt-12">
          <Breadcrumbs dark items={[{ name: "Presse & Neuigkeiten", href: "/presse" }, { name: "Mediathek" }]} className="ov-hero-in mb-10" />
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
            <div>
              <div className="ov-hero-in" style={{ "--ov-delay": "60ms" }}>
                <Eyebrow dark>Mediathek</Eyebrow>
              </div>
              <h1 className="ov-h1 ov-hero-in mt-5" style={{ "--ov-delay": "120ms" }}>
                Energiewende <span className="ov-text-gradient-light">zum Anschauen.</span>
              </h1>
              <p className="ov-lead ov-hero-in mt-6 max-w-2xl text-white/70" style={{ "--ov-delay": "200ms" }}>
                Kurzvideos von unseren Baustellen und Projekten: wie Photovoltaik auf Hallendächer, Stallungen und Freiflächen
                kommt – von der Montage bis zur Inbetriebnahme.
              </p>
            </div>
            <div className="ov-hero-in grid grid-cols-2 gap-3" style={{ "--ov-delay": "260ms" }}>
              {reels.length > 0 ? (
                <>
                  <div className="ov-glass rounded-3xl p-5">
                    <Film aria-hidden="true" className="h-5 w-5 text-ov-300" />
                    <p className="ov-num mt-3 font-display text-[2rem] font-extrabold leading-none">{reels.length}</p>
                    <p className="mt-1 text-[13.5px] text-white/65">{reels.length === 1 ? "Video" : "Videos"}</p>
                  </div>
                  <div className="ov-glass rounded-3xl p-5">
                    <Clapperboard aria-hidden="true" className="h-5 w-5 text-ov-300" />
                    <p className="ov-num mt-3 font-display text-[2rem] font-extrabold leading-none">{Math.max(1, kategorien.length)}</p>
                    <p className="mt-1 text-[13.5px] text-white/65">{kategorien.length === 1 ? "Rubrik" : "Rubriken"}</p>
                  </div>
                </>
              ) : (
                <div className="ov-glass col-span-2 rounded-3xl p-5 text-[14.5px] leading-relaxed text-white/75">
                  Die Videos liegen auf unserem eigenen Server – beim Ansehen werden keine Daten an soziale Netzwerke übertragen.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {reels.length > 0 ? (
        <Section tone="sand" space="lg">
          <Mediathek reels={reels} />
          <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-[2rem] bg-white p-6 ring-1 ring-ink-200/60 sm:flex-row sm:items-center md:p-8">
            <p className="max-w-xl text-[15.5px] leading-relaxed text-ink-700">
              Die Videos liegen auf unserem eigenen Server – beim Ansehen werden keine Daten an soziale Netzwerke übertragen.
              Neue Reels erscheinen zuerst auf Facebook.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={FACEBOOK_REELS} variant="secondary" icon={ArrowUpRight}>
                Mehr auf Facebook
              </Button>
              <Button href="/presse" variant="navy" icon={Newspaper}>
                Newsroom
              </Button>
            </div>
          </div>
        </Section>
      ) : (
        <Section tone="sand" space="lg">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink-200/70">
            <div aria-hidden="true" className="grid grid-cols-5 gap-2 bg-navy-950 p-5 md:gap-3 md:p-7">
              {["from-ov-400 to-navy-800", "from-navy-400 to-navy-900", "from-sun-400 to-ov-700", "from-ov-300 to-navy-700", "from-navy-300 to-navy-900"].map((v, i) => (
                <div key={v} className={`aspect-[9/16] rounded-xl bg-gradient-to-b ${v} opacity-80 ring-1 ring-white/15 ${i % 2 ? "translate-y-3" : ""}`}>
                  <div className="flex h-full items-center justify-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 ring-1 ring-white/50 md:h-10 md:w-10">
                      <span className="ml-0.5 h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-7 md:p-10">
              <h2 className="ov-h3 text-ink-900">Die Mediathek wird gerade befüllt.</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-600">
                Hier finden Sie bald Kurzvideos von unseren Baustellen, Projekten und aus dem Team. Bis dahin zeigen wir unsere
                Reels auf Facebook.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={FACEBOOK_REELS} icon={ArrowUpRight}>
                  Reels auf Facebook ansehen
                </Button>
                <Button href="/presse" variant="secondary" icon={Newspaper}>
                  Zum Newsroom
                </Button>
              </div>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
