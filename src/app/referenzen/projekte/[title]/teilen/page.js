// Social-Media-Kit: fertige Bilder (LinkedIn, Instagram, Story) + Vorschlagstexte zum Kopieren.
// noindex,follow; Canonical auf die Projektseite. LinkedIn-Teilen als reiner Link (kein Tracking-Skript).

import { notFound, permanentRedirect } from "next/navigation";
import { AtSign, Download, Linkedin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import KitNavigation from "@/components/Kundenbuehne/KitNavigation";
import KopierFeld from "@/components/Kundenbuehne/KopierFeld";
import Rechenweg from "@/components/Kundenbuehne/Rechenweg";
import { kitMetadata, ladeKundenbuehne } from "@/lib/kundenbuehneServer";
import { linkedinShareUrl, postVorschlaege } from "@/lib/kundenbuehne";
import { BASE_URL } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { title } = await params;
  const d = await ladeKundenbuehne(title);
  return kitMetadata(d, {
    titel: "Social-Media-Kit",
    beschreibung: d ? `Fertige Bilder und Textvorschläge für LinkedIn und Instagram zur Photovoltaikanlage von ${d.firma}.` : "",
  });
}

const BILDER = [
  { id: "linkedin", titel: "LinkedIn-Beitrag", masse: "1200 × 627", w: 1200, h: 627, klasse: "sm:col-span-2 lg:col-span-2" },
  { id: "instagram", titel: "Instagram-Beitrag", masse: "1080 × 1080", w: 1080, h: 1080, klasse: "" },
  { id: "story", titel: "Instagram-Story", masse: "1080 × 1920", w: 1080, h: 1920, klasse: "" },
];

export default async function TeilenSeite({ params }) {
  const { title } = await params;
  const d = await ladeKundenbuehne(title);
  if (!d) notFound();
  if (d.veraltet) permanentRedirect(`/referenzen/projekte/${d.projekt.slug}/teilen`);
  const { projekt, firma, zahlen, ort, jahr } = d;
  const slug = projekt.slug;
  const projektUrl = `${BASE_URL}/referenzen/projekte/${slug}`;
  const texte = postVorschlaege({ firma, ort, jahr, zahlen, url: projektUrl });

  return (
    <div>
      <PageHero
        variant="dark"
        breadcrumbs={[
          { name: "Referenzen", href: "/referenzen/projekte" },
          { name: projekt.titel, href: `/referenzen/projekte/${slug}` },
          { name: "Social-Media-Kit" },
        ]}
        eyebrow="Solar-Kit · Teilen"
        title={
          <>
            Social-Media-Kit für <span className="ov-text-gradient-light">{firma}</span>
          </>
        }
        lead="Fertige Bilder im richtigen Format und Texte zum Kopieren – damit Ihre Solaranlage in Ihren Kanälen sichtbar wird. Frei verwendbar für Ihre eigenen Beiträge."
        className="pb-4"
      />
      <KitNavigation slug={slug} aktiv="teilen" titel={projekt.titel} />

      <Section tone="white" space="md">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Bilder" title="Drei Formate, sofort einsatzbereit" />
          <a
            href={linkedinShareUrl(projektUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0A66C2] px-6 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Linkedin aria-hidden="true" className="h-4 w-4" />
            Projekt auf LinkedIn teilen
          </a>
        </div>
        <ul className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BILDER.map((b, i) => {
            const src = `/referenzen/projekte/${slug}/bild/${b.id}`;
            return (
              <Reveal as="li" key={b.id} delay={i * 90} className={b.klasse}>
                <figure className="overflow-hidden rounded-3xl bg-sand-50 ring-1 ring-ink-200/70">
                  <div className="bg-navy-950">
                    {/* Bild aus eigener ImageResponse-Route */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${b.titel}: ${firma} erzeugt Sonnenstrom – Bild zum Teilen`}
                      width={b.w}
                      height={b.h}
                      loading="lazy"
                      className={b.id === "story" ? "mx-auto h-auto w-full max-w-[300px] lg:max-w-none" : "h-auto w-full"}
                    />
                  </div>
                  <figcaption className="flex flex-wrap items-center justify-between gap-3 p-5">
                    <span>
                      <span className="block font-display text-[17px] font-bold text-ink-900">{b.titel}</span>
                      <span className="text-[13px] text-ink-500">{b.masse} Pixel · PNG</span>
                    </span>
                    <a
                      href={src}
                      download={`oekovolt-${slug}-${b.id}.png`}
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-ov-600 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-ov-700"
                    >
                      <Download aria-hidden="true" className="h-4 w-4" />
                      Herunterladen
                    </a>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <div>
            <SectionHeading eyebrow="Texte" title="Vorschläge für Ihren Beitrag" lead="Übernehmen Sie einen Text oder passen Sie ihn an – die Zahlen sind Schätzungen und entsprechend formuliert." />
            <ul className="mt-8 space-y-5">
              {texte.map((t, i) => (
                <Reveal as="li" key={t.titel} delay={i * 80} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-7">
                  <h3 className="mb-3 font-display text-[18px] font-bold text-ink-900">{t.titel}</h3>
                  <KopierFeld text={t.text} label="Text kopieren" />
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="space-y-5 lg:pt-24">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 md:p-7">
              <p className="flex items-center gap-2 font-display text-[18px] font-bold text-ink-900">
                <AtSign aria-hidden="true" className="h-5 w-5 text-ov-600" />
                Ökovolt markieren
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
                „@Ökovolt“ ist ein Platzhalter: Tippen Sie beim Posten <strong>@Ökovolt</strong> und wählen Sie unsere Seite aus der Vorschlagsliste – so wird Ökovolt über Ihren Beitrag benachrichtigt.
              </p>
            </div>
            <Rechenweg zahlen={zahlen} kompakt />
          </div>
        </div>
      </Section>
    </div>
  );
}
