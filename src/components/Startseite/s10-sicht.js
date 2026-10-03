"use client";

// src/components/Startseite/s10-sicht.js
//
// Kleine Client-Insel für die Abschnitte Projekte, FAQ und Abschluss (Präfix s10):
// Sobald der Bereich ins Bild kommt, bekommt er einmalig `data-s10-an`. Alle Aufbau-Animationen
// hängen per CSS an diesem Attribut (siehe <style> in den Abschnitten).
// Der versteckte Ausgangszustand gilt nur mit `data-s10-bereit` (setzt diese Insel nach der Hydrierung,
// solange der Bereich noch außerhalb des Bildes ist). Ohne JavaScript, vor der Hydrierung und bei
// prefers-reduced-motion ist also immer der Endzustand zu sehen.

import { useEffect, useRef } from "react";

export default function S10Sicht({ as: Tag = "div", schwelle = 0.2, rand = "0px 0px -10% 0px", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const an = () => el.setAttribute("data-s10-an", "");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      an();
      return;
    }
    // Schon sichtbar (z. B. Sprung per Anker, späte Hydrierung): Endzustand ohne Ausblenden.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      an();
      return;
    }
    // Erst jetzt den Ausgangszustand setzen – solange die Insel nicht hydriert ist, bleibt alles sichtbar.
    el.setAttribute("data-s10-bereit", "");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        an();
      },
      { threshold: schwelle, rootMargin: rand }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [schwelle, rand]);

  return (
    <Tag ref={ref} data-s10-sicht="" {...rest}>
      {children}
    </Tag>
  );
}
