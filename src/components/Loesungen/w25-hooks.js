"use client";

// src/components/Loesungen/w25-hooks.js
//
// Kleine Client-Helfer für die Freiflächen- und Agri-PV-Grafiken (Präfix w25).
//
// useW25Sicht(ref): Sobald das Element ins Bild kommt, bekommt es einmalig `data-w25-an`.
//   Der versteckte Ausgangszustand hängt an `data-w25-bereit` – das setzt der Hook erst nach der
//   Hydrierung und nur, wenn das Element noch außerhalb des Bildes liegt. Ohne JavaScript, vor
//   der Hydrierung und bei prefers-reduced-motion ist also immer der Endzustand zu sehen.
//   Rückgabe: "fertig" (Endzustand ohne Aufbau) | "warten" (versteckt, außerhalb) | "an" (Aufbau läuft).
// useW25ImBild(ref): true, solange das Element (teilweise) sichtbar ist – für Dauerbewegung, die
//   außerhalb des Bildes pausieren soll.
// useW25Gleiten(ziel): weich gleitender Zahlenwert (Count-up / Übergang), bei reduzierter
//   Bewegung sofort am Ziel.
// useW25Ruhig(): true bei prefers-reduced-motion (nach der Hydrierung).

import { useEffect, useRef, useState } from "react";

const ruhigAbfragen = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useW25Sicht(ref, { schwelle = 0.2, rand = "0px 0px -8% 0px" } = {}) {
  const [phase, setPhase] = useState("fertig");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ein = () => {
      el.setAttribute("data-w25-an", "");
      setPhase("an");
    };
    if (ruhigAbfragen() || !("IntersectionObserver" in window)) {
      el.setAttribute("data-w25-an", "");
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
      // Schon sichtbar (Anker, späte Hydrierung): Endzustand ohne Ausblenden.
      el.setAttribute("data-w25-an", "");
      return;
    }
    el.setAttribute("data-w25-bereit", "");
    setPhase("warten");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        ein();
      },
      { threshold: schwelle, rootMargin: rand }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, schwelle, rand]);
  return phase;
}

export function useW25ImBild(ref) {
  const [sichtbar, setSichtbar] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setSichtbar(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return sichtbar;
}

export function useW25Ruhig() {
  const [ruhig, setRuhig] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setRuhig(mq.matches);
    set();
    mq.addEventListener?.("change", set);
    return () => mq.removeEventListener?.("change", set);
  }, []);
  return ruhig;
}

export function useW25Gleiten(ziel, dauer = 420) {
  const [wert, setWert] = useState(ziel);
  const aktuell = useRef(ziel);
  useEffect(() => {
    if (ruhigAbfragen() || aktuell.current === ziel) {
      aktuell.current = ziel;
      setWert(ziel);
      return;
    }
    const von = aktuell.current;
    const start = performance.now();
    let raf;
    const schritt = (t) => {
      const p = Math.min((t - start) / dauer, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = von + (ziel - von) * e;
      aktuell.current = v;
      setWert(v);
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
  }, [ziel, dauer]);
  return wert;
}
