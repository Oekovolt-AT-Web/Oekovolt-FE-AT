"use client";

// src/components/Loesungen/w25-Zahl.js
// Zahl, die beim ersten Sichtbarwerden einmal hochzählt. Das Server-HTML enthält den Endwert
// (SEO, kein Layout-Sprung dank tabellarischer Ziffern und fester Mindestbreite).

import { useEffect, useRef, useState } from "react";

const format = (v, stellen) => v.toLocaleString("de-DE", { minimumFractionDigits: stellen, maximumFractionDigits: stellen });

export default function W25Zahl({ wert, von = 0, stellen = 0, dauer = 1400, verzoegerung = 0, className }) {
  const ref = useRef(null);
  const [anzeige, setAnzeige] = useState(wert);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;
    let raf;
    let timer;
    setAnzeige(von);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(() => {
          const start = performance.now();
          const schritt = (t) => {
            const p = Math.min((t - start) / dauer, 1);
            setAnzeige(von + (wert - von) * (1 - Math.pow(1 - p, 4)));
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
  }, [wert, von, dauer, verzoegerung]);

  const end = format(wert, stellen);
  return (
    <span ref={ref} className={`ov-num inline-block${className ? ` ${className}` : ""}`} style={{ minWidth: `${end.length * 0.62}em` }}>
      {format(anzeige, stellen)}
    </span>
  );
}
