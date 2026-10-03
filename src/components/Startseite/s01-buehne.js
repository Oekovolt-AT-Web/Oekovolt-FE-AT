"use client";

import { useEffect, useRef } from "react";

/**
 * Dezente Tiefen-Parallaxe des Heros (Präfix s01): Elemente mit `data-s01-tiefe="0.25"`
 * wandern beim Scrollen um diesen Bruchteil der Scrollstrecke mit (nur transform, ein rAF
 * pro Frame, passiver Listener). Läuft nur, solange der Hero im Bild ist; bei reduzierter
 * Bewegung aus. Rendert selbst nichts Sichtbares.
 */
export default function S01Buehne() {
  const ref = useRef(null);

  useEffect(() => {
    const sektion = ref.current?.closest("[data-start]");
    if (!sektion) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let imBild = true;

    const setzen = () => {
      raf = 0;
      const oben = sektion.getBoundingClientRect().top;
      const y = Math.max(0, Math.min(-oben, sektion.offsetHeight));
      sektion.querySelectorAll("[data-s01-tiefe]").forEach((el) => {
        el.style.transform = mq.matches || y === 0 ? "" : `translate3d(0, ${(y * Number(el.dataset.s01Tiefe)).toFixed(1)}px, 0)`;
      });
    };
    const scroll = () => {
      if (imBild && !raf) raf = requestAnimationFrame(setzen);
    };
    const io = new IntersectionObserver(([e]) => {
      imBild = e.isIntersecting;
      if (imBild) scroll();
    });
    io.observe(sektion);
    window.addEventListener("scroll", scroll, { passive: true });
    mq.addEventListener?.("change", scroll);
    scroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", scroll);
      mq.removeEventListener?.("change", scroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <span ref={ref} hidden />;
}
