"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

import { cn } from "@/components/ui/cn";
import { datumText, dauerText } from "@/data/reels";

/** true, wenn Bewegung reduziert werden soll oder der Datensparmodus aktiv ist */
export function ohneAutoplay() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  return Boolean(navigator.connection?.saveData);
}

/**
 * Hochformat-Kachel (9:16) für ein selbst gehostetes Reel.
 * Das <video> lädt nichts vorab (preload="none"); es spielt stumm, solange `abspielen` true ist
 * (Karussell: aktive Kachel im Sichtbereich; Raster: Maus darüber / Tastaturfokus) – nie bei
 * prefers-reduced-motion oder Datensparmodus. Klick öffnet den Player (onOeffnen).
 */
export default function ReelKachel({ reel, abspielen = false, onOeffnen, onVorschau, groesse = "md", className }) {
  const video = useRef(null);
  const [laeuft, setLaeuft] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (abspielen && !ohneAutoplay()) {
      v.muted = true;
      const p = v.play();
      if (p && typeof p.then === "function") p.then(() => setLaeuft(true)).catch(() => setLaeuft(false));
    } else {
      v.pause();
      setLaeuft(false);
    }
  }, [abspielen]);

  return (
    <article className={cn("group/reel relative", className)}>
      <button
        type="button"
        onClick={onOeffnen}
        onMouseEnter={() => onVorschau?.(true)}
        onMouseLeave={() => onVorschau?.(false)}
        onFocus={() => onVorschau?.(true)}
        onBlur={() => onVorschau?.(false)}
        aria-label={`Video abspielen: ${reel.titel}${reel.dauerSek ? ` (Dauer ${dauerText(reel.dauerSek)})` : ""}`}
        className="relative block aspect-[9/16] w-full overflow-hidden rounded-2xl bg-navy-900 text-left shadow-[0_24px_50px_-28px_rgba(3,18,43,0.65)] ring-1 ring-ink-200/60 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ov-600"
      >
        <video
          ref={video}
          src={reel.datei}
          poster={reel.poster}
          preload="none"
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover/reel:scale-[1.03]"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-navy-950/25" />
        <span aria-hidden="true" className="absolute left-2.5 right-2.5 top-2.5 flex items-start justify-between gap-2">
          {reel.kategorie ? (
            <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-navy-900 backdrop-blur-sm">{reel.kategorie}</span>
          ) : (
            <span />
          )}
          {reel.dauerSek ? (
            <span className="ov-num rounded-full bg-black/45 px-2 py-0.5 text-[11.5px] font-semibold text-white backdrop-blur-sm">{dauerText(reel.dauerSek)}</span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/60 backdrop-blur-md transition-opacity duration-300",
            groesse === "lg" ? "h-16 w-16" : "h-12 w-12",
            laeuft ? "opacity-0 group-hover/reel:opacity-100" : "opacity-100"
          )}
        >
          <Play className={cn("ml-0.5 fill-white text-white", groesse === "lg" ? "h-7 w-7" : "h-5 w-5")} />
        </span>
        <span className="absolute inset-x-0 bottom-0 p-3 md:p-3.5">
          <span className={cn("block font-display font-bold leading-snug text-white [overflow-wrap:anywhere] hyphens-auto", groesse === "lg" ? "text-[17px]" : "text-[14px] md:text-[15px]")}>{reel.titel}</span>
          {reel.datum && (
            <span className="mt-1 block text-[12px] text-white/70">
              <time dateTime={reel.datum}>{datumText(reel.datum)}</time>
            </span>
          )}
        </span>
      </button>
    </article>
  );
}
