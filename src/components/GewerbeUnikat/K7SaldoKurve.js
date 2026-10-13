"use client";

// src/components/GewerbeUnikat/K7SaldoKurve.js
//
// K7 · Saldo-Kurve in der Bühne (Teil von K7Pult, ohne eigene Bibliothek): misst die Breite (viewBox = Pixel,
// Schrift wird nie skaliert) und lässt Investition, Jahresüberschuss, Warte-Verschiebung und y-Domäne
// gemeinsam gleiten – 420 ms, dieselbe Kurve wie die gleitenden Zahlen (Zahl/useZahlGleiten), damit Ziffern
// und Linie im selben Takt ankommen. Reduzierte Bewegung: sofort Endzustand.

import { useEffect, useRef, useState } from "react";
import { KURVE_HOEHE, KurveSvg, kurveGeo, kurveGleich, kurveLabel, kurveZiel } from "./K7Kurve.js";

const FELDER = ["I", "J", "d", "lo", "hi"];
const DAUER = 420;

/** Mehrere Werte gemeinsam gleiten lassen (ease-out-quart wie useZahlGleiten). */
function useGleitWerte(ziel, ruhig) {
  const [wert, setWert] = useState(ziel);
  const vonRef = useRef(ziel);
  const zielRef = useRef(ziel);
  zielRef.current = ziel;
  const rafRef = useRef(0);
  const schluessel = FELDER.map((k) => Math.round(ziel[k] * 100)).join("|");
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const z = zielRef.current;
    const von = vonRef.current;
    if (ruhig || FELDER.every((k) => Math.abs(von[k] - z[k]) < 1e-6)) {
      vonRef.current = z;
      setWert(z);
      return undefined;
    }
    const start = performance.now();
    const schritt = (jetzt) => {
      const p = Math.min(1, (jetzt - start) / DAUER);
      const e = 1 - Math.pow(1 - p, 4);
      const n = Object.fromEntries(FELDER.map((k) => [k, von[k] + (z[k] - von[k]) * e]));
      vonRef.current = n;
      setWert(n);
      if (p < 1) rafRef.current = requestAnimationFrame(schritt);
    };
    rafRef.current = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(rafRef.current);
  }, [schluessel, ruhig]);
  return wert;
}

/**
 * @param {object} p
 * @param {object} p.r   aktuelles Ergebnis von pultRechnen()
 * @param {object} p.r0  Rechenbeispiel (Geisterlinie)
 * @param {number} [p.monate] Warte-Regler (verschiebt den Kauf)
 * @param {boolean} [p.ruhig] reduzierte Bewegung
 * @param {number} [p.hoehe]  feste Höhe in px
 */
export default function K7SaldoKurve({ r, r0, monate = 0, ruhig = false, hoehe = KURVE_HOEHE, className, testid }) {
  const boxRef = useRef(null);
  const [breite, setBreite] = useState(0);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    setBreite(Math.round(el.getBoundingClientRect().width));
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(([e]) => setBreite(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ziel = kurveZiel(r, r0, monate);
  const v = useGleitWerte(ziel, ruhig);
  const gleich = kurveGleich(ziel, r0);
  const w = breite > 0 ? breite : 304;
  const geo = kurveGeo(v, r0, w, hoehe);
  const label = kurveLabel(kurveGeo(ziel, r0, w, hoehe), gleich);

  return (
    <div ref={boxRef} className={className} style={{ height: hoehe }} data-testid={testid}>
      {breite > 0 && <KurveSvg geo={geo} gleich={gleich} label={label} />}
    </div>
  );
}
