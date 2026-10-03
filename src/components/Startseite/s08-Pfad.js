"use client";

// src/components/Startseite/s08-Pfad.js
//
// Client-Insel für den Ablauf in S09Prozess: Die Linie zeichnet sich beim Scrollen
// (quer ab lg, hochkant darunter), jeder Schritt leuchtet auf, sobald die Linie seinen Knoten
// erreicht. Fortschritt läuft nur vorwärts (kein „Zurückspulen“ beim Hochscrollen).
// Ohne JS bzw. bei reduzierter Bewegung: alles sofort im Endzustand.
//
// Erwartete Kinder-Attribute: [data-spur="x"|"y"] (Linie), darin [data-fill] und [data-spitze];
// [data-schritt] mit [data-knoten]; optional [data-ziel] (Endmarke).

import { useEffect, useRef } from "react";

const klemmen = (v) => Math.min(1, Math.max(0, v));

export default function S08Pfad({ className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const quer = window.matchMedia("(min-width: 1024px)");
    el.setAttribute("data-bereit", "");

    let p = ruhig ? 1 : 0;
    let raf = 0;

    const zeichnen = () => {
      raf = 0;
      const achse = quer.matches ? "x" : "y";
      const spur = el.querySelector(`[data-spur="${achse}"]`);
      if (!spur) return;
      const r = spur.getBoundingClientRect();
      const vh = window.innerHeight;
      const laenge = achse === "x" ? r.width : r.height;
      if (!ruhig) {
        const roh = achse === "x" ? (vh * 0.97 - r.top) / (vh * 0.25) : (vh * 0.8 - r.top) / Math.max(1, r.height);
        p = Math.max(p, klemmen(roh));
      }
      const fill = spur.querySelector("[data-fill]");
      const spitze = spur.querySelector("[data-spitze]");
      if (fill) fill.style.transform = achse === "x" ? `scaleX(${p})` : `scaleY(${p})`;
      if (spitze) {
        spitze.style.transform = achse === "x" ? `translate3d(${p * laenge}px,0,0)` : `translate3d(0,${p * laenge}px,0)`;
        spitze.style.opacity = p > 0.002 && p < 0.998 ? "1" : "0";
      }
      const weg = p * laenge;
      el.querySelectorAll("[data-schritt]").forEach((s) => {
        const k = s.querySelector("[data-knoten]");
        if (!k) return;
        const kr = k.getBoundingClientRect();
        const pos = achse === "x" ? kr.left + kr.width / 2 - r.left : kr.top + kr.height / 2 - r.top;
        if (weg >= pos - 4) s.setAttribute("data-an", "");
      });
      if (p >= 0.995) el.querySelectorAll("[data-ziel]").forEach((z) => z.setAttribute("data-an", ""));
    };

    const planen = () => {
      if (!raf) raf = requestAnimationFrame(zeichnen);
    };

    // Erst rechnen, wenn der Abschnitt wirklich in Sichtweite ist (Layout stabil) – sonst könnten
    // nachladende Abschnitte darüber den Fortschritt beim Laden zu früh „vorspulen“.
    let aktiv = false;
    const io = new IntersectionObserver(
      ([e]) => {
        aktiv = e.isIntersecting;
        if (aktiv) planen();
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    const beimScrollen = () => {
      if (aktiv) planen();
    };
    // Startzustand (Linie leer) sofort setzen, ohne Fortschritt zu berechnen
    el.querySelectorAll("[data-fill]").forEach((f) => (f.style.transform = ruhig ? "" : f.closest('[data-spur="x"]') ? "scaleX(0)" : "scaleY(0)"));
    if (ruhig) planen();
    window.addEventListener("scroll", beimScrollen, { passive: true });
    window.addEventListener("resize", beimScrollen);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", beimScrollen);
      window.removeEventListener("resize", beimScrollen);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
