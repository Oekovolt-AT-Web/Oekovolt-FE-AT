"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Bildergalerie mit eigener Lightbox (ohne Zusatzbibliothek).
 * Tastatur: ← → blättern, Esc schließt. Touch: wischen. Fokus bleibt im Dialog.
 * bilder: [{ src, alt }]
 */
export default function ProjektGalerie({ bilder = [], titel = "" }) {
  const [fehler, setFehler] = useState(() => new Set());
  const liste = bilder.filter((b) => !fehler.has(b.src));
  const [offen, setOffen] = useState(null); // Index oder null
  const dialogRef = useRef(null);
  const ausloeserRef = useRef(null);
  const touchX = useRef(null);

  const markiereFehler = (src) => setFehler((f) => new Set(f).add(src));

  const schliessen = useCallback(() => {
    setOffen(null);
    ausloeserRef.current?.focus();
  }, []);
  const blaettern = useCallback((richtung) => setOffen((i) => (i == null ? i : (i + richtung + liste.length) % liste.length)), [liste.length]);

  useEffect(() => {
    if (offen == null) return;
    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") schliessen();
      else if (e.key === "ArrowRight") blaettern(1);
      else if (e.key === "ArrowLeft") blaettern(-1);
      else if (e.key === "Tab") {
        // Fokusfalle
        const fokusierbar = dialogRef.current?.querySelectorAll("button");
        if (!fokusierbar?.length) return;
        const erstes = fokusierbar[0];
        const letztes = fokusierbar[fokusierbar.length - 1];
        if (e.shiftKey && document.activeElement === erstes) {
          e.preventDefault();
          letztes.focus();
        } else if (!e.shiftKey && document.activeElement === letztes) {
          e.preventDefault();
          erstes.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = vorher;
      window.removeEventListener("keydown", onKey);
    };
  }, [offen, schliessen, blaettern]);

  if (!liste.length) return null;

  const oeffnen = (i, e) => {
    ausloeserRef.current = e.currentTarget;
    setOffen(i);
  };

  // Layout je nach Bildanzahl
  const raster =
    liste.length === 1
      ? "grid-cols-1"
      : liste.length === 2
        ? "sm:grid-cols-2"
        : "grid-cols-2 lg:grid-cols-4 lg:grid-rows-2";

  return (
    <>
      <ul className={cn("grid gap-3 md:gap-4", raster)}>
        {liste.map((b, i) => {
          const hauptbild = liste.length >= 3 && i === 0;
          return (
            <li
              key={b.src}
              className={cn(
                "relative",
                hauptbild && "col-span-2 lg:row-span-2",
                liste.length === 3 && i > 0 && "lg:col-span-2",
                liste.length === 4 && i === 3 && "col-span-2",
                liste.length > 5 && i >= 5 && "hidden"
              )}
            >
              <button
                type="button"
                onClick={(e) => oeffnen(i, e)}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-3xl bg-ink-100 text-left",
                  hauptbild ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[520px]" : liste.length <= 2 ? "aspect-[4/3]" : "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[252px]"
                )}
                aria-label={`Bild ${i + 1} von ${liste.length} vergrößern`}
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  sizes={hauptbild || liste.length <= 2 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, 25vw"}
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  onError={() => markiereFehler(b.src)}
                />
                <span aria-hidden="true" className="absolute inset-0 bg-navy-950/0 transition-colors duration-300 group-hover:bg-navy-950/20" />
                <span aria-hidden="true" className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink-900 opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-lg:opacity-100">
                  <Expand className="h-4 w-4" />
                </span>
                {liste.length > 5 && i === 4 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-navy-950/60 font-display text-[22px] font-extrabold text-white">
                    +{liste.length - 5}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {offen != null && liste[offen] && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Bildergalerie ${titel}`}
          tabIndex={-1}
          className="fixed inset-0 z-[2147483000] flex flex-col bg-navy-950/[0.97] text-white outline-none backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && schliessen()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) blaettern(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-5">
            <p className="min-w-0 truncate text-[14px] text-white/70">
              <span className="ov-num font-semibold text-white">
                {offen + 1} / {liste.length}
              </span>
              <span className="ml-3 hidden sm:inline">{titel}</span>
            </p>
            <button
              type="button"
              onClick={schliessen}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="Galerie schließen"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 px-2 md:px-24" onClick={(e) => e.target === e.currentTarget && schliessen()}>
            <div className="relative h-full w-full">
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/15 border-t-ov-400" />
              <Image
                key={liste[offen].src}
                src={liste[offen].src}
                alt={liste[offen].alt}
                fill
                sizes="(max-width: 768px) 100vw, 85vw"
                className="ov-tab-panel object-contain"
                onError={() => markiereFehler(liste[offen].src)}
              />
            </div>
            {liste.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => blaettern(-1)}
                  className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:bg-white/20 md:left-6"
                  aria-label="Vorheriges Bild"
                >
                  <ChevronLeft aria-hidden="true" className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => blaettern(1)}
                  className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:bg-white/20 md:right-6"
                  aria-label="Nächstes Bild"
                >
                  <ChevronRight aria-hidden="true" className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {liste.length > 1 && (
            <div className="ov-no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 py-4 md:py-6">
              {liste.map((b, i) => (
                <button
                  key={b.src}
                  type="button"
                  onClick={() => setOffen(i)}
                  aria-label={`Bild ${i + 1} anzeigen`}
                  aria-current={i === offen}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition md:h-16 md:w-24",
                    i === offen ? "opacity-100 ring-ov-400" : "opacity-50 ring-transparent hover:opacity-90"
                  )}
                >
                  <Image src={b.src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
