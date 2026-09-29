import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { AnnahmenBox, WeitereRechner } from "@/components/Rechner/RechnerSeite";
import { BASE_URL } from "@/lib/site";

/**
 * Seitenrahmen der Gewerbe-Rechner (E-Flotte, Ladeinfrastruktur) – gleiche Optik
 * wie RechnerSeite (dunkler Hero, Rechner überlappend, Annahmen, FAQ, weitere
 * Tools, Querverweise, CTA), ergänzt um eine dunkle Fakten-Sektion mit Foto
 * (Recht & Steuern kompakt). Liefert WebApplication- und WebPage-Schema; das
 * FAQPage-Schema kommt aus <Faq/> und entspricht exakt dem sichtbaren Inhalt.
 */
export default function FlotteLadeSeite({
  pfad,
  toolId,
  breadcrumb,
  eyebrow,
  title,
  lead,
  chips = [],
  app,
  rechner,
  fakten,
  erklaerung,
  annahmen = [],
  quellen = [],
  faq = [],
  faqTitel = "Häufige Fragen",
  cta,
}) {
  const url = `${BASE_URL}${pfad}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}/#app`,
        name: app.name,
        url,
        description: app.description,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        inLanguage: "de-AT",
        isAccessibleForFree: true,
        audience: { "@type": "BusinessAudience", audienceType: "Unternehmen, Gemeinden und Fuhrparkverantwortliche in Österreich" },
        featureList: app.featureList,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url,
        name: app.name,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
        mainEntity: { "@id": `${url}/#app` },
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Rechner & Tools", href: "/rechner" }, { name: breadcrumb }]}
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        points={chips}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-36"
      />

      {/* Rechner überlappt den Hero – sofort sichtbar */}
      <section aria-label="Rechner" className="relative z-10 -mt-20 pb-6 md:-mt-28 md:pb-10">
        <div className="ov-container">{rechner}</div>
      </section>

      {fakten && <Fakten {...fakten} />}

      <Section tone="white" space="md">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>{erklaerung}</div>
          <Reveal>
            <AnnahmenBox punkte={annahmen} quellen={quellen} />
          </Reveal>
        </div>
      </Section>

      {faq.length > 0 && (
        <Section tone="sand" space="md">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading eyebrow="Häufige Fragen" title={faqTitel} lead="Ihre Frage ist nicht dabei? Wir beraten Sie persönlich und herstellerunabhängig." />
            <Faq items={faq} />
          </div>
        </Section>
      )}

      <WeitereRechner ohne={toolId} />
      <Querverweise pfad={pfad} />
      <CtaBand {...cta} />
    </div>
  );
}

/** Dunkle Kontrast-Sektion: Foto + Glas-Karten mit den wichtigsten Rahmenbedingungen */
function Fakten({ eyebrow, title, lead, bild, items = [], quelle }) {
  return (
    <section aria-label={eyebrow || "Rahmenbedingungen"} className="ov-noise relative mt-10 overflow-hidden bg-navy-950 py-20 text-white md:mt-16 md:py-28">
      <div aria-hidden="true" className="ov-grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-ov-500/25 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-navy-500/40 blur-[120px]" />
      <div className="ov-container relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} lead={lead} dark as="h2" />
            {bild && (
              <Reveal dir="left" className="relative mt-8 aspect-[16/10] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                <Image src={bild.src} alt={bild.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                {bild.caption && <p className="absolute bottom-4 left-5 right-5 text-[12.5px] text-white/80">{bild.caption}</p>}
              </Reveal>
            )}
          </div>
          <div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map((it, i) => {
                const Icon = it.icon;
                return (
                  <Reveal as="li" key={it.label} delay={i * 80} className="flex">
                    <div className="ov-glass group flex w-full flex-col rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="ov-num font-display text-[30px] font-extrabold leading-none tracking-tight text-white md:text-[34px]">{it.wert}</span>
                        {Icon && (
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-ov-300 ring-1 ring-white/15 transition-colors group-hover:bg-ov-500 group-hover:text-white">
                            <Icon aria-hidden="true" className="h-5 w-5" />
                          </span>
                        )}
                      </div>
                      <p className="mt-3 font-display text-[16.5px] font-bold leading-snug text-white">{it.label}</p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-white/70">{it.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
            {quelle && <p className="mt-5 text-[12.5px] leading-relaxed text-white/50">{quelle}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
