"use client";

import { useEffect, useRef } from "react";
import { ereignis } from "@/lib/statistik";

// Anlaufphase: Änderungen direkt nach dem Laden (Werte aus URL oder Entwurf) sind keine Eingabe des Besuchers
const ANLAUF_MS = 1500;
// Erst wenn das Ergebnis so lange unverändert steht, gilt es als „angesehen“
const RUHE_MS = 2500;

/**
 * Misst einmal pro Seitenaufruf das Ereignis `rechner_ergebnis` { rechner }:
 * sobald der Besucher selbst etwas geändert hat und das Ergebnis danach kurz stehen bleibt.
 * Kein Ereignis pro Eingabe, keine Eingabewerte in der Messung.
 *
 * @param {string} rechner  Kennung wie in components/Rechner/tools.js (z. B. "gewerbe-pv")
 * @param {unknown} ergebnis Ergebnis-Objekt aus useMemo (ändert sich nur bei neuen Eingaben)
 */
export default function useRechnerErgebnis(rechner, ergebnis) {
  const start = useRef(0);
  const gesendet = useRef(false);
  const erster = useRef(true);

  useEffect(() => {
    start.current = Date.now();
  }, []);

  useEffect(() => {
    if (erster.current) {
      erster.current = false;
      return undefined;
    }
    if (gesendet.current || Date.now() - start.current < ANLAUF_MS) return undefined;
    const t = setTimeout(() => {
      gesendet.current = true;
      ereignis("rechner_ergebnis", { rechner });
    }, RUHE_MS);
    return () => clearTimeout(t);
  }, [rechner, ergebnis]);
}
