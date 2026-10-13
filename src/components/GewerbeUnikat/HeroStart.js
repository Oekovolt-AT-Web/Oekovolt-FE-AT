// src/components/GewerbeUnikat/HeroStart.js
//
// Start der Aufbau-Animation des Wochen-Pulses erst, wenn die Grafik zu etwa 35 % sichtbar ist.
// REIN und in sich geschlossen (keine Importe, keine äußeren Namen), weil Hero.js die Funktion per
// toString() als kleines Inline-Skript direkt hinter der Grafik ausliefert: Es läuft beim Parsen des HTML,
// also vor der Hydrierung, und setzt data-warten (Grafik wartet leer) bzw. data-laeuft (Animation läuft).
// HeroPuls ruft dieselbe Funktion nach einer Client-Navigation auf, wenn das Inline-Skript nicht lief.
//
// Ohne JS, ohne IntersectionObserver und bei reduzierter Bewegung setzt sie nichts – dann steht sofort das
// Endbild, denn die Regeln in Hero.module.css greifen nur mit diesen Attributen.

export function pulsStarten(f) {
  try {
    if (!f || f.hasAttribute("data-warten") || f.hasAttribute("data-laeuft")) return;
    const g = f.querySelector("[data-puls-flaeche]");
    if (!g || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    f.setAttribute("data-warten", "");
    const io = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) {
          if (e.isIntersecting && e.intersectionRatio >= 0.34) {
            f.setAttribute("data-laeuft", "");
            io.disconnect();
            return;
          }
        }
      },
      { threshold: [0, 0.35, 0.6, 1] }
    );
    io.observe(g);
  } catch {
    if (f) f.removeAttribute("data-warten");
  }
}
