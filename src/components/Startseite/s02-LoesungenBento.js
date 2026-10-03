"use client";

// src/components/Startseite/s02-LoesungenBento.js
//
// Client-Insel für das Lösungs-Bento (S03Loesungen). Die Karten selbst kommen fertig vom Server
// (children) – diese Hülle fügt nur Verhalten hinzu:
//  · Aufdecken beim Scrollen: Vorhang mit Lichtkante fährt nach oben, Foto setzt sich (Skalierung),
//    Linien-Motiv zeichnet sich, Text blendet ein – gestaffelt je Eintritt (Klasse s02b-an).
//  · Dezente Parallaxe der Fotos (nur transform, rAF, nur sichtbare Karten).
//  · Licht, das dem Mauszeiger folgt (Lichtkante + Schein, nur transform über CSS-Variablen).
// Bei prefers-reduced-motion bleibt alles im Endzustand; ohne JavaScript ist alles sichtbar.

import { useEffect, useRef } from "react";

export default function LoesungenBento({ className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const raster = ref.current;
    if (!raster) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const karten = [...raster.querySelectorAll("[data-s02-karte]")];
    raster.classList.add("s02b-js");

    // 1) Aufdecken – gestaffelt innerhalb eines gemeinsamen Eintritts
    const aufdecken = new IntersectionObserver(
      (eintraege) => {
        const neu = eintraege.filter((e) => e.isIntersecting).map((e) => e.target);
        neu.sort((a, b) => Number(a.dataset.s02Karte) - Number(b.dataset.s02Karte));
        neu.forEach((el, i) => {
          el.style.setProperty("--s02b-d", `${i * 110}ms`);
          el.classList.add("s02b-an");
          aufdecken.unobserve(el);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    karten.forEach((k) => aufdecken.observe(k));

    // 2) Parallaxe nur für Karten im Sichtfeld
    const sichtbar = new Set();
    const imBild = new IntersectionObserver(
      (eintraege) => {
        eintraege.forEach((e) => (e.isIntersecting ? sichtbar.add(e.target) : sichtbar.delete(e.target)));
        planen();
      },
      { rootMargin: "80px 0px" }
    );
    karten.forEach((k) => imBild.observe(k));

    let raf = 0;
    const rechnen = () => {
      raf = 0;
      const vh = window.innerHeight;
      sichtbar.forEach((k) => {
        const schicht = k.querySelector(".s02b-parallax");
        if (!schicht) return;
        const r = k.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
        const weite = r.height > 260 ? 22 : 14;
        schicht.style.transform = `translate3d(0, ${Math.round(-p * weite * 10) / 10}px, 0)`;
      });
    };
    function planen() {
      if (!raf) raf = requestAnimationFrame(rechnen);
    }
    window.addEventListener("scroll", planen, { passive: true });
    window.addEventListener("resize", planen, { passive: true });
    planen();

    // 3) Licht folgt dem Mauszeiger
    const bewegen = (e) => {
      if (e.pointerType !== "mouse") return;
      const k = e.target.closest?.("[data-s02-karte]");
      if (!k) return;
      const r = k.getBoundingClientRect();
      k.style.setProperty("--s02b-mx", `${Math.round(e.clientX - r.left)}px`);
      k.style.setProperty("--s02b-my", `${Math.round(e.clientY - r.top)}px`);
    };
    raster.addEventListener("pointermove", bewegen, { passive: true });

    return () => {
      aufdecken.disconnect();
      imBild.disconnect();
      window.removeEventListener("scroll", planen);
      window.removeEventListener("resize", planen);
      raster.removeEventListener("pointermove", bewegen);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
