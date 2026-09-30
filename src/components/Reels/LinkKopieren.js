"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/components/ui/cn";

/** Kopiert die absolute Adresse eines Pfads (z. B. /mediathek/<slug>) in die Zwischenablage. */
export default function LinkKopieren({ pfad, dunkel = false, className }) {
  const [kopiert, setKopiert] = useState(false);

  const kopieren = async () => {
    const url = `${window.location.origin}${pfad}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Link kopieren:", url);
    }
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2200);
  };

  return (
    <>
      <button
        type="button"
        onClick={kopieren}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-colors",
          dunkel
            ? kopiert
              ? "bg-ov-500 text-white"
              : "bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/20"
            : kopiert
              ? "bg-ov-600 text-white"
              : "bg-white text-ink-800 ring-1 ring-inset ring-ink-200 hover:ring-ink-300",
          className
        )}
      >
        {kopiert ? <Check aria-hidden="true" className="h-4 w-4" /> : <Link2 aria-hidden="true" className="h-4 w-4" />}
        {kopiert ? "Link kopiert" : "Link kopieren"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {kopiert ? "Link in die Zwischenablage kopiert" : ""}
      </span>
    </>
  );
}
