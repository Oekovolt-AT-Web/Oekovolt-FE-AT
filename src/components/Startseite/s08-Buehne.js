"use client";

// src/components/Startseite/s08-Buehne.js
//
// Kleine Client-Insel für das Systemschema in S08Technik: setzt beim ersten Eintritt in den
// Sichtbereich `data-an` (startet die Aufbau-Animation per CSS) und hält mit `data-sicht` fest,
// ob das Schema gerade sichtbar ist (Ambient-Bewegung pausiert außerhalb).
// Ohne JavaScript fehlen beide Attribute → das Schema steht im fertigen Endzustand da.

import { useEffect, useRef } from "react";

export default function S08Buehne({ className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
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
      { threshold: 0.15 }
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
