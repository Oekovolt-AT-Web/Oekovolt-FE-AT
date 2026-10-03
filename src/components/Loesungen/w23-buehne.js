"use client";

// src/components/Loesungen/w23-buehne.js
//
// Client-Insel für das Systemschema in TechnikSystem: setzt `data-bereit` (Startzustand der
// Aufbau-Animation), beim ersten Eintritt `data-an` (Aufbau läuft per CSS) und hält mit
// `data-sicht` fest, ob das Schema gerade sichtbar ist (Ambient-Bewegung pausiert außerhalb).
// Ohne JavaScript fehlen alle Attribute → das Schema steht im fertigen Endzustand da.

import { useEffect, useRef } from "react";

export default function W23Buehne({ className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) return undefined;
    el.setAttribute("data-bereit", "");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute("data-an", "");
          el.setAttribute("data-sicht", "");
        } else {
          el.removeAttribute("data-sicht");
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
