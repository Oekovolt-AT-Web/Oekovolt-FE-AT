"use client";

// src/components/Technik/w26-Buehne.js
//
// Kleine Client-Insel für die Technik-Grafiken (/technik): setzt beim ersten Eintritt in den
// Sichtbereich `data-an` (startet die Aufbau-Animation per CSS) und hält mit `data-sicht` fest,
// ob die Grafik gerade sichtbar ist (Dauerbewegung pausiert außerhalb).
// `data-bereit` wird erst nach der Hydration gesetzt → ohne JavaScript steht der Endzustand da.

import { useEffect, useRef } from "react";

export default function W26Buehne({ as: Tag = "div", className, children, schwelle = 0.15, ...rest }) {
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
      { threshold: schwelle }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [schwelle]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
