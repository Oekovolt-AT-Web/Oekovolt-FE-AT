"use client";

// src/components/ui/w21-sicht.js
//
// Kleine Client-Insel für die seitenweiten Rahmen-Bausteine (Präfix w21): CtaBand und Faq.
// Sobald der Bereich ins Bild kommt, bekommt er einmalig `data-w21-an`; alle Aufbau-Animationen
// hängen per CSS an diesem Attribut. Den versteckten Ausgangszustand gibt es nur mit
// `data-w21-bereit` – das setzt diese Insel erst nach der Hydrierung und nur, solange der Bereich
// noch außerhalb des Bildes liegt. Ohne JavaScript, vor der Hydrierung, bei Sprung per Anker und bei
// prefers-reduced-motion ist also immer der fertige Endzustand zu sehen.

import { useEffect, useRef } from "react";

export default function W21Sicht({ as: Tag = "div", schwelle = 0.2, rand = "0px 0px -10% 0px", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const an = () => {
      el.removeAttribute("data-w21-bereit");
      el.setAttribute("data-w21-an", "");
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      an();
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      an();
      return;
    }
    el.setAttribute("data-w21-bereit", "");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // ein Frame Abstand, damit der Ausgangszustand sicher gemalt ist und die Übergänge laufen
        requestAnimationFrame(an);
      },
      { threshold: schwelle, rootMargin: rand }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [schwelle, rand]);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
