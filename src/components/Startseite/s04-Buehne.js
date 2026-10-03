"use client";

// src/components/Startseite/s04-Buehne.js
//
// Kleine Client-Insel für die Abschnitte Mannschaft, Rechner & Tools und Warum Ökovolt:
// schaltet einmal pro Eintritt die Klasse `s04-an` auf ihrem Wurzelelement. Alle Aufbau-
// Animationen hängen per CSS an dieser Klasse (Verzögerungen über --s04-d).
//
// - Ohne JavaScript: Klasse `s04-bereit` fehlt → alles steht im Endzustand (SEO, kein Flackern).
// - prefers-reduced-motion: sofort `s04-an`, Endzustand ohne Bewegung.
// - Bereits vorbeigescrollte Elemente (z. B. Sprung per Anker) bekommen sofort den Endzustand.

import { useEffect, useRef } from "react";

export default function S04Buehne({ as: Tag = "div", className, rand = "0px 0px -16% 0px", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (ruhig || !("IntersectionObserver" in window) || el.getBoundingClientRect().bottom < 0) {
      el.classList.add("s04-an");
      return;
    }
    el.classList.add("s04-bereit");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        // Ein Frame Abstand, damit der verborgene Ausgangszustand sicher gemalt ist.
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("s04-an")));
        io.disconnect();
      },
      { threshold: 0, rootMargin: rand }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rand]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
