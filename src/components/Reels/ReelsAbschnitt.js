import { ArrowUpRight, Clapperboard } from "lucide-react";

import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { FACEBOOK_REELS, reelsSortiert } from "@/data/reels";
import ReelsKarussell from "./ReelsKarussell";

const MAX = 8;

/**
 * Abschnitt „Presse & News“ mit selbst gehosteten Kurzvideos (Server-Komponente).
 * Einsatz: Startseite und /presse. Keine Verbindung zu Facebook/Meta – Facebook nur als normaler Link.
 *
 * Ohne Videos in src/data/reels.js: schlanke Hinweiskarte „auf Facebook ansehen“.
 *
 * Props:
 *   tone        Hintergrund (white | sand | ink | green), Standard „white“
 *   space       Abstand oben/unten (sm | md | lg), Standard „lg“
 *   presseLink  Link „Zum Newsroom“ anzeigen (auf /presse selbst ausschalten)
 *   id          Anker, Standard „videos“
 */
export default function ReelsAbschnitt({ tone = "white", space = "lg", presseLink = true, id = "videos", className }) {
  const reels = reelsSortiert().slice(0, MAX);
  const klassen = className ? `scroll-mt-20 ${className}` : "scroll-mt-20";

  if (reels.length === 0) {
    return (
      <Section tone={tone} space="sm" id={id} className={klassen}>
        <div className="flex flex-col gap-5 rounded-[2rem] bg-sand-50 p-6 ring-1 ring-ink-200/60 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-950 text-ov-300">
              <Clapperboard aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-700">Presse &amp; News</p>
              <p className="mt-1 font-display text-[19px] font-bold leading-snug text-ink-900 md:text-[21px]">Kurzvideos von unseren Baustellen</p>
              <p className="mt-1 text-[14.5px] text-ink-600">Montage, Inbetriebnahme und Teamalltag – als Reels auf unserer Facebook-Seite.</p>
            </div>
          </div>
          <a
            href={FACEBOOK_REELS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-5 text-[15px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 transition-colors hover:ring-ink-300 sm:self-auto"
          >
            Auf Facebook ansehen
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only"> (öffnet in neuem Tab)</span>
          </a>
        </div>
      </Section>
    );
  }

  return (
    <Section tone={tone} space={space} id={id} className={klassen}>
      <div className="mb-8 flex flex-col justify-between gap-6 md:mb-10 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow="Presse & News"
          title={
            <>
              Ökovolt in Bewegung – <span className="ov-text-gradient">direkt von der Baustelle.</span>
            </>
          }
          lead="Wie aus Dächern und Freiflächen Kraftwerke werden: kurze Einblicke in Montage, Inbetriebnahme und den Alltag unserer Teams in ganz Österreich."
        />
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Button href="/mediathek" pfeil>
            Alle Videos in der Mediathek
          </Button>
          {presseLink && (
            <Button href="/presse" variant="secondary">
              Zum Newsroom
            </Button>
          )}
        </div>
      </div>
      <ReelsKarussell reels={reels} />
      <p className="mt-6 text-[14px] text-ink-500">
        Noch mehr Reels auf{" "}
        <a href={FACEBOOK_REELS} target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline underline-offset-2 hover:text-ov-800">
          unserer Facebook-Seite
          <span className="sr-only"> (öffnet in neuem Tab)</span>
        </a>
        .
      </p>
    </Section>
  );
}
