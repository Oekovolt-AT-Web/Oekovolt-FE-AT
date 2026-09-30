"use client";

import { useEffect, useRef } from "react";
import { dekodiere } from "./kodierung";

/**
 * Stellt beim ersten Laden die Eingaben aus einem geteilten Link wieder her.
 * Erst nach dem Laden gelesen (nicht beim Server-Rendern) – die Seite bleibt statisch
 * und hydriert ohne Unterschiede. Die Übernahme fällt in die Anlaufphase von
 * useRechnerErgebnis und zählt daher nicht als Eingabe des Besuchers.
 *
 * @param {Array} felder        Feldbeschreibungen (siehe kodierung.js)
 * @param {(werte: Object) => void} uebernehmen  bekommt nur die Felder, die im Link stehen
 */
export default function useTeilenStart(felder, uebernehmen) {
  const erledigt = useRef(false);
  useEffect(() => {
    if (erledigt.current) return;
    erledigt.current = true;
    try {
      const p = new URLSearchParams(window.location.search);
      const werte = dekodiere(felder, (k) => p.get(k));
      if (werte) uebernehmen(werte);
    } catch {
      /* ungültiger Link – Startwerte bleiben */
    }
    // nur beim ersten Laden
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
