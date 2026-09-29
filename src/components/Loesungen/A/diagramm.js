"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hilfen für die SVG-Diagramme der Lösungsseiten (nur Client).
 */

/** Weicher Pfad (Catmull-Rom → Bézier) durch Punkte [[x,y], …]. */
export function glatterPfad(punkte) {
  if (!punkte.length) return "";
  let d = `M${punkte[0][0].toFixed(1)},${punkte[0][1].toFixed(1)}`;
  for (let i = 0; i < punkte.length - 1; i++) {
    const p0 = punkte[i - 1] || punkte[i];
    const p1 = punkte[i];
    const p2 = punkte[i + 1];
    const p3 = punkte[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Fläche unter einem Pfad bis zur Grundlinie y0. */
export function flaeche(punkte, y0) {
  if (!punkte.length) return "";
  const erster = punkte[0];
  const letzter = punkte[punkte.length - 1];
  return `${glatterPfad(punkte)} L${letzter[0].toFixed(1)},${y0} L${erster[0].toFixed(1)},${y0} Z`;
}

/** Glockenkurve der PV-Erzeugung über 24 Stunden (Stundenmittel), Summe = 1. */
export function pvKurve(breite = 3, mitte = 12.9, stunden = 24) {
  const roh = Array.from({ length: stunden }, (_, h) => {
    const x = (h + 0.5 - mitte) / breite;
    const v = Math.exp(-0.5 * x * x);
    return v < 0.02 ? 0 : v;
  });
  const s = roh.reduce((a, b) => a + b, 0);
  return roh.map((v) => v / s);
}

/**
 * Werte weich auf Zielwerte überblenden (Array von Zahlen oder Arrays).
 * Startet erst, wenn `aktiv` true ist (z. B. sichtbar). Respektiert reduzierte Bewegung.
 */
export function useUeberblendung(ziel, aktiv = true, dauer = 650) {
  const [wert, setWert] = useState(ziel);
  const vorher = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!aktiv) return;
    const reduziert = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = vorher.current ?? ziel.map((z) => (Array.isArray(z) ? z.map(() => 0) : 0));
    vorher.current = ziel;
    if (reduziert) {
      setWert(ziel);
      return;
    }
    const t0 = performance.now();
    cancelAnimationFrame(raf.current);
    const schritt = (t) => {
      const p = Math.min((t - t0) / dauer, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setWert(ziel.map((z, i) => (Array.isArray(z) ? z.map((v, j) => (start[i]?.[j] ?? 0) + (v - (start[i]?.[j] ?? 0)) * e) : (start[i] ?? 0) + (z - (start[i] ?? 0)) * e)));
      if (p < 1) raf.current = requestAnimationFrame(schritt);
    };
    raf.current = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ziel), aktiv]);

  return wert;
}

/** true, sobald das Element (einmal) sichtbar war. */
export function useSichtbar(ref, schwelle = 0.25) {
  const [sichtbar, setSichtbar] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || sichtbar) return;
    if (!("IntersectionObserver" in window)) {
      setSichtbar(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSichtbar(true);
          io.disconnect();
        }
      },
      { threshold: schwelle }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, schwelle, sichtbar]);
  return sichtbar;
}

/** Zahl im österreichischen Format (Tausenderpunkt, Dezimalkomma) – ohne Intl, damit Server und Browser identisch rendern. */
export function fmtZahl(v, stellen = 0) {
  const [ganz, rest] = Math.abs(v).toFixed(stellen).split(".");
  const tausend = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (v < 0 ? "−" : "") + tausend + (rest ? "," + rest : "");
}
export const fmtProzent = (v) => `${fmtZahl(Math.round(v * 100))} %`;
