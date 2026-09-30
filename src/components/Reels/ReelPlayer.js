"use client";

import { forwardRef } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Hochformat-Player (9:16) für ein selbst gehostetes Reel – native Bedienelemente, lädt erst beim Abspielen
 * (preload="none"), Vorschaubild als poster, optional Untertitel (WebVTT). Keine Verbindung zu Dritten.
 */
const ReelPlayer = forwardRef(function ReelPlayer({ reel, autoPlay = false, className, onEnded }, ref) {
  return (
    <div className={cn("relative aspect-[9/16] overflow-hidden bg-navy-950", className || "w-full rounded-[1.5rem] ring-1 ring-white/10")}>
      <video
        ref={ref}
        key={reel.datei}
        src={reel.datei}
        poster={reel.poster}
        preload="none"
        controls
        playsInline
        autoPlay={autoPlay}
        onEnded={onEnded}
        aria-label={`Video: ${reel.titel}`}
        className="absolute inset-0 h-full w-full bg-navy-950 object-contain"
      >
        {reel.untertitel && <track kind="subtitles" src={reel.untertitel} srcLang="de" label="Deutsch" default />}
        Ihr Browser kann dieses Video nicht abspielen. <a href={reel.datei}>Video herunterladen</a>
      </video>
    </div>
  );
});

export default ReelPlayer;
