"use client";

import { useSyncExternalStore } from "react";

import { experiment, laeuft, vorschauVariante, zuweisen } from "@/lib/experimente";

// Zuweisungen ändern sich während eines Seitenaufrufs nicht – kein Abo nötig.
const abonnieren = () => () => {};

/**
 * Variante eines clientseitigen A/B-Tests (siehe src/lib/experimente.js).
 *
 * - Server-Render und Hydration liefern immer die Kontrolle (varianten[0]) → keine
 *   Hydration-Unterschiede; direkt danach rendert React mit der ausgelosten Variante.
 *   Deshalb nur für Elemente, die beim ersten Bild nicht sichtbar sind.
 * - Keine Cookies, kein Browserspeicher: Die Variante lebt im Arbeitsspeicher bis zum Neuladen.
 * - Vorschau: `?ov-exp=k1:b` erzwingt eine Variante (auch bei inaktivem Test), ohne sie zu zählen.
 *
 * @returns {{ variante: string|null, laeuft: boolean, vorschau: boolean }}
 */
export function useExperiment(id) {
  const exp = experiment(id);
  const kontrolle = exp ? exp.varianten[0] : null;
  const vorschau = useSyncExternalStore(
    abonnieren,
    () => vorschauVariante(window.location.search, id),
    () => null
  );
  const zugewiesen = useSyncExternalStore(
    abonnieren,
    () => zuweisen(id, { pfad: window.location.pathname }),
    () => kontrolle
  );
  return { variante: vorschau || zugewiesen, laeuft: !!vorschau || (!!exp && laeuft(exp)), vorschau: !!vorschau };
}

export default useExperiment;
