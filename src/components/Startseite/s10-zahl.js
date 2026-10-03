"use client";

// src/components/Startseite/s10-zahl.js
//
// kWp-Zähler für die Projektkarten. Das Server-HTML enthält bereits den Endwert (SEO, kein
// Layout-Sprung – Breite über tabellarische Ziffern stabil). Sobald die Zahl sichtbar wird,
// zählt sie einmal von 0 hoch; bei prefers-reduced-motion bleibt sie stehen.

import { useEffect, useRef, useState } from "react";

const format = (v, stellen) =>
  v.toLocaleString("de-DE", { minimumFractionDigits: stellen, maximumFractionDigits: stellen });

export default function S10Zahl({ wert, stellen = 0, dauer = 1500, verzoegerung = 0, fest = true, className }) {
  const ref = useRef(null);
  const ziel = Number(wert) || 0;
  const [anzeige, setAnzeige] = useState(ziel);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ziel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf;
    let timer;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setAnzeige(0);
        timer = setTimeout(() => {
          const start = performance.now();
          const schritt = (t) => {
            const p = Math.min((t - start) / dauer, 1);
            setAnzeige(ziel * (1 - Math.pow(1 - p, 4)));
            if (p < 1) raf = requestAnimationFrame(schritt);
          };
          raf = requestAnimationFrame(schritt);
        }, verzoegerung);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [ziel, dauer, verzoegerung]);

  // Feste Mindestbreite (Ziffern ≈ 1ch, Trennzeichen ≈ 0,32ch): die Kapsel wächst beim Zählen nicht mit
  const end = format(ziel, stellen);
  const ziffern = end.replace(/\D/g, "").length;
  const breite = `${(ziffern + (end.length - ziffern) * 0.32).toFixed(2)}ch`;

  return (
    <span
      ref={ref}
      className={`ov-num${fest ? " inline-block text-right" : ""}${className ? ` ${className}` : ""}`}
      style={fest ? { minWidth: breite } : undefined}
    >
      {format(anzeige, stellen)}
    </span>
  );
}
