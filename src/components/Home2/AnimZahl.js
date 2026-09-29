"use client";

import { useEffect, useRef, useState } from "react";

const format = (n, stellen) => n.toLocaleString("de-DE", { minimumFractionDigits: stellen, maximumFractionDigits: stellen });

/**
 * Zahl, die bei jeder Änderung weich zum neuen Wert gleitet (Rechner-Ergebnisse).
 * Erster Render = Zielwert (Server und Client identisch, kein Hydration-Unterschied).
 * Bei reduzierter Bewegung springt der Wert ohne Animation.
 */
export default function AnimZahl({ wert, stellen = 0, dauer = 650 }) {
  const ziel = Number.isFinite(wert) ? wert : 0;
  const [anzeige, setAnzeige] = useState(ziel);
  const aktuell = useRef(ziel);

  useEffect(() => {
    const start = aktuell.current;
    if (start === ziel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      aktuell.current = ziel;
      setAnzeige(ziel);
      return;
    }
    let raf;
    const t0 = performance.now();
    const schritt = (t) => {
      const p = Math.min((t - t0) / dauer, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = start + (ziel - start) * eased;
      aktuell.current = v;
      setAnzeige(v);
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [ziel, dauer]);

  return <>{format(anzeige, stellen)}</>;
}
