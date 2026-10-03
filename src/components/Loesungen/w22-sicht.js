"use client";

// src/components/Loesungen/w22-sicht.js
//
// Client-Insel für die Bild- und Zahlen-Bausteine der Lösungsseiten (Präfix w22). Die Inhalte kommen
// fertig vom Server (children) – diese Hülle fügt nur Verhalten hinzu:
//  · Aufbau beim Eintritt: einmalig `data-w22-an`. Der versteckte Ausgangszustand gilt nur mit
//    `data-w22-bereit` (erst nach der Hydrierung gesetzt) – ohne JavaScript, vor der Hydrierung und bei
//    prefers-reduced-motion ist immer der Endzustand zu sehen. Ist der Bereich beim Laden schon sichtbar,
//    bleibt er im Endzustand – außer mit `sofort` (Kennzahlenband direkt unter dem Hero).
//  · `licht`: Lichtkante folgt dem Mauszeiger (CSS-Variablen --w22-mx/--w22-my auf [data-w22-licht]).
//  · `parallaxe` (px): Ebenen mit [data-w22-px] verschieben sich beim Scrollen dezent (nur transform).

import { useEffect, useRef } from "react";

const ruhig = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function W22Sicht({ as: Tag = "div", schwelle = 0.2, rand = "0px 0px -8% 0px", sofort = false, licht = false, parallaxe = 0, children, ...rest }) {
  const ref = useRef(null);

  // 1) Aufbau beim Eintritt
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const an = () => el.setAttribute("data-w22-an", "");
    if (ruhig() || !("IntersectionObserver" in window)) {
      an();
      return undefined;
    }
    const r = el.getBoundingClientRect();
    if (!sofort && r.top < window.innerHeight * 0.88 && r.bottom > 0) {
      an();
      return undefined;
    }
    el.setAttribute("data-w22-bereit", "");
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
  }, [schwelle, rand, sofort]);

  // 2) Licht folgt dem Mauszeiger
  useEffect(() => {
    const el = ref.current;
    if (!el || !licht) return undefined;
    const bewegen = (e) => {
      if (e.pointerType !== "mouse") return;
      const k = e.target.closest?.("[data-w22-licht]");
      if (!k || !el.contains(k)) return;
      const r = k.getBoundingClientRect();
      k.style.setProperty("--w22-mx", `${Math.round(e.clientX - r.left)}px`);
      k.style.setProperty("--w22-my", `${Math.round(e.clientY - r.top)}px`);
    };
    el.addEventListener("pointermove", bewegen, { passive: true });
    return () => el.removeEventListener("pointermove", bewegen);
  }, [licht]);

  // 3) Dezente Parallaxe, nur solange der Bereich im Bild ist
  useEffect(() => {
    const el = ref.current;
    if (!el || !parallaxe || ruhig() || !("IntersectionObserver" in window)) return undefined;
    const schichten = [...el.querySelectorAll("[data-w22-px]")];
    if (!schichten.length) return undefined;
    let sichtbar = false;
    let raf = 0;
    const rechnen = () => {
      raf = 0;
      if (!sichtbar) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)));
      const y = Math.round(-p * parallaxe * 10) / 10;
      schichten.forEach((s) => {
        s.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };
    const planen = () => {
      if (!raf) raf = requestAnimationFrame(rechnen);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        sichtbar = e.isIntersecting;
        planen();
      },
      { rootMargin: "120px 0px" }
    );
    io.observe(el);
    window.addEventListener("scroll", planen, { passive: true });
    window.addEventListener("resize", planen, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", planen);
      window.removeEventListener("resize", planen);
      cancelAnimationFrame(raf);
    };
  }, [parallaxe]);

  return (
    <Tag ref={ref} data-w22-sicht="" {...rest}>
      {children}
    </Tag>
  );
}
