"use client";

// src/components/Startseite/s04-Zahl.js
//
// Zählt eine Kennzahl hoch, sobald sie sichtbar wird. Das Server-HTML enthält den Endwert
// (SEO, kein Layout-Sprung: tabellarische Ziffern, feste Breite über den Endwert).
// Formatierung ohne Intl (gleich auf Server und Browser → keine Hydration-Abweichung).

import { useEffect, useRef, useState } from "react";
import { zahlText } from "@/data/kennzahlen";

export default function S04Zahl({ wert, dauer = 1800, verzoegerung = 0, className }) {
  const ref = useRef(null);
  const ziel = Number(wert) || 0;
  const [anzeige, setAnzeige] = useState(ziel);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf;
    let start;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setAnzeige(0);
        const schritt = (t) => {
          if (start === undefined) start = t + verzoegerung;
          const p = Math.min(Math.max((t - start) / dauer, 0), 1);
          setAnzeige(Math.round(ziel * (1 - Math.pow(1 - p, 4))));
          if (p < 1) raf = requestAnimationFrame(schritt);
        };
        raf = requestAnimationFrame(schritt);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ziel, dauer, verzoegerung]);

  return (
    <span ref={ref} className={`relative inline-block ov-num ${className || ""}`}>
      {/* Platzhalter mit Endwert hält die Breite stabil */}
      <span aria-hidden="true" className="invisible">{zahlText(ziel)}</span>
      <span className="absolute inset-0">{zahlText(anzeige)}</span>
    </span>
  );
}
