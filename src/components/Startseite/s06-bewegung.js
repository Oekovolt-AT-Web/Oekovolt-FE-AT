"use client";

// src/components/Startseite/s06-bewegung.js
//
// Bewegungs-Hilfen für die Startseiten-Abschnitte S06 (Strommarkt) und S07 (Energie nutzen).
//
// Prinzip „Phase“ (data-phase am Wurzelelement):
//   ruhe   – Server-HTML und erster Client-Render: ruhender Endzustand, alles sichtbar (SEO, ohne JS)
//   wartet – Abschnitt liegt beim Mounten noch unterhalb des Fensters: Auftritts-Animationen stehen
//            pausiert auf ihrem Startbild (unsichtbar für den Nutzer, weil außerhalb des Fensters)
//   laeuft – Abschnitt kommt ins Bild: Choreografie läuft einmal ab
// Liegt der Abschnitt beim Mounten schon im Bild (oder darüber) oder ist reduzierte Bewegung
// gewünscht, bleibt es bei „ruhe“ – kein Aufblitzen, kein Springen.

import { useEffect, useRef, useState } from "react";

export const ruhig = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Phase der Auftritts-Choreografie und ob der Abschnitt gerade im Bild ist (für Ambient-Bewegung). */
export function useEintritt(ref) {
  const [phase, setPhase] = useState("ruhe");
  const [sichtbar, setSichtbar] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const bewegung = !ruhig();
    if (bewegung && el.getBoundingClientRect().top > window.innerHeight * 0.92) setPhase("wartet");

    // Auslösen, sobald die Oberkante ins untere Fünftel des Fensters kommt
    const start = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setPhase((p) => (p === "wartet" ? "laeuft" : p));
        start.disconnect();
      },
      { rootMargin: "0px 0px -18% 0px" }
    );
    // Ambient-Bewegung nur, solange der Abschnitt sichtbar ist
    const sicht = new IntersectionObserver(([e]) => setSichtbar(e.isIntersecting), { rootMargin: "120px 0px" });
    if (bewegung) start.observe(el);
    sicht.observe(el);
    return () => {
      start.disconnect();
      sicht.disconnect();
    };
  }, [ref]);

  return { phase, sichtbar };
}

/**
 * Fortschritt 0 → 1 (ease-out) für Count-ups.
 * ruhe → 1 (exakter Live-Wert), wartet → 0, laeuft → zählt nach `verzoegerung` in `dauer` ms hoch.
 */
export function useFortschritt(phase, verzoegerung = 0, dauer = 1500) {
  const [p, setP] = useState(1);
  useEffect(() => {
    if (phase === "wartet") {
      setP(0);
      return undefined;
    }
    if (phase !== "laeuft") return undefined;
    setP(0);
    let raf = 0;
    const start = performance.now() + verzoegerung;
    const schritt = (t) => {
      const q = Math.min(1, Math.max(0, (t - start) / dauer));
      setP(1 - (1 - q) ** 4);
      if (q < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [phase, verzoegerung, dauer]);
  return p;
}

/**
 * Größe eines Elements in px (für pixelgenaue SVG-Grafiken ohne Verzerrung).
 * Server und erster Client-Render nutzen `standard`; die Höhe des Elements kommt aus CSS,
 * deshalb verschiebt das Nachmessen kein Layout.
 */
export function useGroesse(standard) {
  const ref = useRef(null);
  const [groesse, setGroesse] = useState(standard);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      const h = Math.round(e.contentRect.height);
      if (w > 0 && h > 0) setGroesse((g) => (g.w === w && g.h === h ? g : { w, h, gemessen: true }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, groesse];
}

/** Props für ein Element mit Auftritts-Animation: Klasse + Verzögerung (wirkt nur in Phase wartet/laeuft). */
export const auftritt = (klasse, ms = 0, basis = "", extra) => ({
  className: `${basis} s06-a ${klasse}`.trim(),
  style: { animationDelay: `${ms}ms`, ...extra },
});
