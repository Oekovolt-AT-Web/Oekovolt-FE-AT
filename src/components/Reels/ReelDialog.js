"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";

import useFokusFalle from "@/components/ui/useFokusFalle";
import { datumText, dauerText, reelPfad } from "@/data/reels";
import LinkKopieren from "./LinkKopieren";
import ReelPlayer from "./ReelPlayer";

/**
 * Player-Dialog (modal): großes Hochformat-Video mit Ton, Titel, Beschreibung, Datum, „Link kopieren“ und
 * „Nächstes Video“. Escape oder „Schließen“ beendet den Dialog, der Fokus kehrt zur Kachel zurück.
 *
 * liste: angezeigte Videos (z. B. gefiltert), index: aktuelles Video, onIndex(i), onSchliessen()
 */
export default function ReelDialog({ liste, index, onIndex, onSchliessen }) {
  const dialog = useRef(null);
  const titelRef = useRef(null);
  const reel = liste[index];
  const mehrere = liste.length > 1;

  useFokusFalle(Boolean(reel), dialog, { beiEscape: onSchliessen, startRef: titelRef });

  // Seite dahinter nicht mitscrollen
  useEffect(() => {
    const html = document.documentElement;
    const vorher = html.style.overflow;
    html.style.overflow = "hidden";
    // Andere Videos der Seite anhalten, damit nur der Dialog Ton hat
    document.querySelectorAll("video").forEach((v) => {
      if (!dialog.current?.contains(v)) v.pause();
    });
    return () => {
      html.style.overflow = vorher;
    };
  }, []);

  if (!reel) return null;
  const weiter = () => onIndex((index + 1) % liste.length);
  const zurueck = () => onIndex((index - 1 + liste.length) % liste.length);

  return (
    <div className="fixed inset-0 z-[9700] flex items-stretch justify-center md:items-center md:p-6">
      <div aria-hidden="true" className="absolute inset-0 bg-navy-950/85 backdrop-blur-md" onClick={onSchliessen} />
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ov-reel-dialog-titel"
        aria-describedby={reel.beschreibung ? "ov-reel-dialog-text" : undefined}
        className="ov-hero-in relative flex max-h-[100dvh] w-full flex-col overflow-y-auto bg-navy-950 text-white md:max-h-[min(92dvh,880px)] md:w-auto md:max-w-[1040px] md:flex-row md:overflow-hidden md:rounded-[2rem] md:ring-1 md:ring-white/10"
      >
        <div className="relative flex shrink-0 items-center justify-center bg-black md:h-[min(92dvh,880px)]">
          <ReelPlayer
            reel={reel}
            autoPlay
            onEnded={mehrere ? weiter : undefined}
            className="mx-auto h-[min(72dvh,calc(100vw*16/9))] md:h-full"
          />
          <button
            type="button"
            onClick={onSchliessen}
            aria-label="Video schließen"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/25 backdrop-blur-sm md:hidden"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-7 md:w-[360px] md:overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">{reel.kategorie || "Video"}</p>
            <button
              type="button"
              onClick={onSchliessen}
              aria-label="Video schließen"
              className="-mr-2 -mt-2 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 md:flex text-white ring-1 ring-white/15 transition-colors hover:bg-white/20"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          <h2 ref={titelRef} tabIndex={-1} id="ov-reel-dialog-titel" className="mt-2 font-display text-[22px] font-extrabold leading-tight tracking-tight focus:outline-none md:text-[26px]">
            {reel.titel}
          </h2>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-white/60">
            {reel.datum && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
                <time dateTime={reel.datum}>{datumText(reel.datum)}</time>
              </span>
            )}
            {reel.dauerSek ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden="true" className="h-4 w-4" />
                <span className="ov-num">{dauerText(reel.dauerSek)}</span>
              </span>
            ) : null}
          </p>
          {reel.beschreibung && (
            <p id="ov-reel-dialog-text" className="mt-4 text-[15.5px] leading-relaxed text-white/80">
              {reel.beschreibung}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <LinkKopieren pfad={reelPfad(reel.slug)} dunkel />
            <Link
              href={reelPfad(reel.slug)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-[14px] font-semibold text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20"
            >
              Zur Videoseite
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          {mehrere && (
            <div className="mt-auto pt-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Video {index + 1} von {liste.length}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={zurueck}
                  aria-label="Vorheriges Video"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition-colors hover:bg-white/20"
                >
                  <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={weiter}
                  className="flex h-12 min-w-0 flex-1 items-center justify-between gap-3 rounded-full bg-ov-600 pl-5 pr-2 text-left text-[14.5px] font-semibold text-white transition-colors hover:bg-ov-700"
                >
                  <span className="min-w-0 truncate">
                    Nächstes Video<span className="sr-only">: {liste[(index + 1) % liste.length].titel}</span>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <ChevronRight aria-hidden="true" className="h-5 w-5" />
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
