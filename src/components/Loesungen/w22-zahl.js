"use client";

// src/components/Loesungen/w22-zahl.js
//
// Zählende Zahl für die Lösungsseiten (Präfix w22).
// - Server-HTML und erster Render = Endwert (SEO, ohne JS lesbar, keine Hydration-Unterschiede).
// - Liegt die Zahl in einer <W22Sicht>-Hülle, startet sie mit deren Aufbau (Attribut data-w22-an),
//   aber nur, wenn die Hülle vorher im Ausgangszustand war (data-w22-bereit) – sonst bleibt der Endwert.
//   Ohne Hülle zählt sie, sobald sie selbst sichtbar wird.
// - Breite = Breite des Endwerts (unsichtbarer Platzhalter) → kein Layout-Sprung.
// - prefers-reduced-motion: immer sofort der Endwert.

import { useEffect, useRef, useState } from "react";
import { zahlFormat } from "./w22-zahlen";

export default function W22Zahl({ wert, stellen = 0, gruppieren = true, dauer = 1500, verzoegerung = 0 }) {
  const ref = useRef(null);
  const ziel = Number(wert) || 0;
  const [anzeige, setAnzeige] = useState(ziel);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ziel) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let raf = 0;
    let timer = 0;
    let gestartet = false;
    let mo;
    let io;
    const laufen = () => {
      if (gestartet) return;
      gestartet = true;
      setAnzeige(0);
      timer = window.setTimeout(() => {
        const t0 = performance.now();
        const schritt = (t) => {
          const p = Math.min((t - t0) / dauer, 1);
          setAnzeige(ziel * (1 - Math.pow(1 - p, 4)));
          if (p < 1) raf = requestAnimationFrame(schritt);
        };
        raf = requestAnimationFrame(schritt);
      }, verzoegerung);
    };

    const huelle = el.closest("[data-w22-sicht]");
    if (huelle) {
      const pruefen = () => {
        if (!huelle.hasAttribute("data-w22-an")) return;
        mo.disconnect();
        if (huelle.hasAttribute("data-w22-bereit")) laufen();
      };
      mo = new MutationObserver(pruefen);
      mo.observe(huelle, { attributes: true, attributeFilter: ["data-w22-an", "data-w22-bereit"] });
    } else if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          laufen();
        },
        { threshold: 0.5 }
      );
      io.observe(el);
    }
    return () => {
      mo?.disconnect();
      io?.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [ziel, dauer, verzoegerung]);

  return (
    <span ref={ref} className="ov-num inline-grid">
      <span aria-hidden="true" className="invisible [grid-area:1/1]">
        {zahlFormat(ziel, stellen, gruppieren)}
      </span>
      <span className="[grid-area:1/1]">{zahlFormat(anzeige, stellen, gruppieren)}</span>
    </span>
  );
}
