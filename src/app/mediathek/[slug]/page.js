import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock, Play } from "lucide-react";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Teilen from "@/components/ui/Teilen";
import LinkKopieren from "@/components/Reels/LinkKopieren";
import ReelPlayer from "@/components/Reels/ReelPlayer";
import { datumText, dauerIso, dauerText, FACEBOOK_REELS, reelNachSlug, reelPfad, reelsSortiert, REELS } from "@/data/reels";
import { BASE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return REELS.map((r) => ({ slug: r.slug }));
}

const abs = (pfad) => `${BASE_URL}${pfad}`;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = reelNachSlug(slug);
  if (!r) return { title: "Video nicht gefunden | Ökovolt", robots: { index: false } };
  const url = abs(reelPfad(r.slug));
  const beschreibung = (r.beschreibung || `${r.titel} – Kurzvideo von Ökovolt Österreich.`).slice(0, 160);
  return {
    title: `${r.titel} | Video | Ökovolt`,
    description: beschreibung,
    alternates: { canonical: url },
    openGraph: {
      type: "video.other",
      locale: "de_AT",
      url,
      siteName: "Ökovolt Österreich",
      title: r.titel,
      description: beschreibung,
      images: [{ url: abs(r.poster), width: 720, height: 1280, alt: r.titel }],
      videos: [{ url: abs(r.datei), secureUrl: abs(r.datei), type: "video/mp4", width: 720, height: 1280 }],
    },
    twitter: { card: "summary_large_image", title: r.titel, description: beschreibung, images: [abs(r.poster)] },
  };
}

export default async function ReelSeite({ params }) {
  const { slug } = await params;
  const r = reelNachSlug(slug);
  if (!r) notFound();

  const url = abs(reelPfad(r.slug));
  const alle = reelsSortiert();
  const verwandt = [...alle.filter((x) => x.slug !== r.slug && x.kategorie === r.kategorie), ...alle.filter((x) => x.slug !== r.slug && x.kategorie !== r.kategorie)].slice(0, 4);

  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${url}#video`,
    name: r.titel,
    description: r.beschreibung || r.titel,
    thumbnailUrl: [abs(r.poster)],
    uploadDate: r.datum,
    ...(r.dauerSek ? { duration: dauerIso(r.dauerSek) } : {}),
    contentUrl: abs(r.datei),
    inLanguage: "de-AT",
    ...(r.kategorie ? { genre: r.kategorie } : {}),
    publisher: { "@id": `${BASE_URL}/#organization` },
    mainEntityOfPage: url,
    isPartOf: { "@id": `${BASE_URL}/mediathek#webpage` },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="ov-noise relative isolate overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -left-32 top-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-ov-500/25 blur-[120px]" />
        <div aria-hidden="true" className="absolute -right-24 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-navy-400/30 blur-[120px]" />
        <div className="ov-container pb-14 pt-8 md:pb-20 md:pt-12">
          <Breadcrumbs dark items={[{ name: "Mediathek", href: "/mediathek" }, { name: r.titel }]} className="ov-hero-in mb-10" />
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:gap-12 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16">
            <ReelPlayer reel={r} className="ov-hero-in mx-auto w-full max-w-[400px] rounded-[1.75rem] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15" />
            <div className="ov-hero-in" style={{ "--ov-delay": "120ms" }}>
              {r.kategorie && <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">{r.kategorie}</p>}
              <h1 className="ov-h1 mt-4 text-[clamp(2rem,1.5rem+2vw,3.25rem)]">{r.titel}</h1>
              <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[14.5px] text-white/60">
                {r.datum && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="h-4 w-4" />
                    <time dateTime={r.datum}>{datumText(r.datum)}</time>
                  </span>
                )}
                {r.dauerSek ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock aria-hidden="true" className="h-4 w-4" />
                    <span className="ov-num">{dauerText(r.dauerSek)} min</span>
                  </span>
                ) : null}
              </p>
              {r.beschreibung && <p className="ov-lead mt-6 max-w-2xl text-white/75">{r.beschreibung}</p>}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <LinkKopieren pfad={reelPfad(r.slug)} dunkel />
                <Link href="/mediathek" className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold text-white/80 ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/10 hover:text-white">
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Zur Mediathek
                </Link>
              </div>
              <div className="mt-8 rounded-2xl bg-white p-4 text-ink-900">
                <Teilen url={url} titel={r.titel} text={r.beschreibung} netze={["linkedin", "whatsapp", "facebook", "x"]} kampagne="mediathek" kompakt />
              </div>
            </div>
          </div>
        </div>
      </section>

      {verwandt.length > 0 && (
        <Section tone="sand" space="md">
          <div className="mb-8 flex flex-col justify-between gap-5 md:mb-10 md:flex-row md:items-end">
            <SectionHeading eyebrow="Mediathek" title="Weitere Videos" />
            <a href={FACEBOOK_REELS} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Mehr auf Facebook
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only"> (öffnet in neuem Tab)</span>
            </a>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-x-5">
            {verwandt.map((v) => (
              <li key={v.slug}>
                <Link href={reelPfad(v.slug)} className="group block">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-navy-900 ring-1 ring-ink-200/60">
                    <Image src={v.poster} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]" />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                    <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/60 backdrop-blur-md">
                      <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
                    </span>
                    {v.dauerSek ? (
                      <span className="ov-num absolute right-2.5 top-2.5 rounded-full bg-black/45 px-2 py-0.5 text-[11.5px] font-semibold text-white">{dauerText(v.dauerSek)}</span>
                    ) : null}
                  </div>
                  {v.kategorie && <p className="mt-3 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ov-700">{v.kategorie}</p>}
                  <p className="mt-1 font-display text-[15.5px] font-bold leading-snug text-ink-900 transition-colors group-hover:text-ov-700">{v.titel}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
