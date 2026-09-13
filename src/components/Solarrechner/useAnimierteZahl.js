"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Laesst eine Zahl weich auf den neuen Zielwert gleiten (z. B. beim Ziehen
 * eines Reglers). Erster Render = Zielwert, damit Server- und Client-HTML
 * uebereinstimmen. Respektiert prefers-reduced-motion.
 */
export default function useAnimierteZahl(ziel, dauer = 450) {
  const [wert, setWert] = useState(ziel);
  const aktuell = useRef(ziel);

  useEffect(() => {
    if (!Number.isFinite(ziel)) {
      aktuell.current = ziel;
      setWert(ziel);
      return;
    }
    const reduziert = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = Number.isFinite(aktuell.current) ? aktuell.current : ziel;
    if (reduziert || start === ziel) {
      aktuell.current = ziel;
      setWert(ziel);
      return;
    }
    let raf;
    const t0 = performance.now();
    const schritt = (t) => {
      const p = Math.min((t - t0) / dauer, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = start + (ziel - start) * e;
      aktuell.current = v;
      setWert(v);
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [ziel, dauer]);

  return wert;
}
