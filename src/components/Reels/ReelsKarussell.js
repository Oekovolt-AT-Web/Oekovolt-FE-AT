"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ReelDialog from "./ReelDialog";
import ReelKachel, { ohneAutoplay } from "./ReelKachel";

/**
 * Horizontales Reels-Karussell (Scroll-Snap, Tastatur: Pfeiltasten bzw. Vor/Zurück-Knöpfe).
 * Stumm abgespielt wird nur EINE Kachel: die erste, die zu mindestens 60 % sichtbar ist
 * (bzw. die, auf der die Maus/der Fokus liegt) – nie bei prefers-reduced-motion oder Datensparmodus.
 * Klick öffnet den Player-Dialog mit Ton.
 */
export default function ReelsKarussell({ reels }) {
  const spur = useRef(null);
  const [sichtbar, setSichtbar] = useState(() => new Set());
  const [vorschau, setVorschau] = useState(null);
  const [rand, setRand] = useState({ links: true, rechts: reels.length <= 1 });
  const [offen, setOffen] = useState(null);
  const [autoplayErlaubt, setAutoplayErlaubt] = useState(false);

  useEffect(() => {
    setAutoplayErlaubt(!ohneAutoplay());
  }, []);

  // Sichtbarkeit je Kachel (für stummes Autoplay nur im Sichtbereich)
  useEffect(() => {
    const el = spur.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const beob = new IntersectionObserver(
      (eintraege) => {
        setSichtbar((alt) => {
          const neu = new Set(alt);
          for (const e of eintraege) {
            const i = Number(e.target.dataset.index);
            if (e.intersectionRatio >= 0.6) neu.add(i);
            else neu.delete(i);
          }
          return neu;
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    el.querySelectorAll("[data-index]").forEach((li) => beob.observe(li));
    return () => beob.disconnect();
  }, [reels.length]);

  const pruefen = useCallback(() => {
    const el = spur.current;
    if (!el) return;
    setRand({ links: el.scrollLeft <= 4, rechts: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    pruefen();
    window.addEventListener("resize", pruefen);
    return () => window.removeEventListener("resize", pruefen);
  }, [pruefen]);

  const blaettern = (richtung) => {
    const el = spur.current;
    if (!el) return;
    const breite = el.querySelector("li")?.getBoundingClientRect().width || 260;
    el.scrollBy({ left: richtung * (breite + 16), behavior: ohneAutoplay() ? "auto" : "smooth" });
  };

  const taste = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      blaettern(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      blaettern(-1);
    }
  };

  const erstesSichtbares = sichtbar.size ? Math.min(...sichtbar) : null;
  const aktiv = offen !== null ? null : vorschau ?? erstesSichtbares;

  return (
    <div role="region" aria-roledescription="Karussell" aria-label="Kurzvideos von Ökovolt">
      {reels.length > 1 && (
        <div className="mb-4 flex justify-end gap-2">
          {[
            { r: -1, label: "Vorherige Videos", Icon: ChevronLeft, aus: rand.links },
            { r: 1, label: "Weitere Videos", Icon: ChevronRight, aus: rand.rechts },
          ].map(({ r, label, Icon, aus }) => (
            <button
              key={r}
              type="button"
              onClick={() => blaettern(r)}
              disabled={aus}
              aria-label={label}
              aria-controls="ov-reels-spur"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-800 ring-1 ring-inset ring-ink-200 transition-colors hover:bg-ink-50 hover:ring-ink-300 disabled:cursor-default disabled:opacity-40"
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
            </button>
          ))}
        </div>
      )}
      <ul
        id="ov-reels-spur"
        ref={spur}
        onScroll={pruefen}
        onKeyDown={taste}
        tabIndex={0}
        aria-label="Videos – mit den Pfeiltasten blättern"
        className="ov-no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 pt-1 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ov-600 sm:-mx-1 sm:scroll-px-1 sm:px-1"
      >
        {reels.map((r, i) => (
          <li key={r.slug} data-index={i} className="w-[min(64vw,250px)] shrink-0 snap-start md:w-[260px]">
            <ReelKachel
              reel={r}
              abspielen={autoplayErlaubt && aktiv === i}
              onVorschau={(an) => setVorschau(an ? i : null)}
              onOeffnen={() => setOffen(i)}
            />
          </li>
        ))}
      </ul>
      {offen !== null && <ReelDialog liste={reels} index={offen} onIndex={setOffen} onSchliessen={() => setOffen(null)} />}
    </div>
  );
}
