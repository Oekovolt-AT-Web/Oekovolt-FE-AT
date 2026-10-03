"use client";

// src/components/Startseite/s04-Spot.js
//
// Lichtkegel, der dem Mauszeiger über den Rechner-Karten folgt (Linear-/Stripe-Stil).
// Ein einziger Pointer-Listener auf dem Raster setzt zwei CSS-Variablen auf der Karte unter
// dem Zeiger; das Licht selbst wird per transform verschoben (kein Layout, kein Repaint der Fläche).
// Touch-Geräte: kein Effekt (nur pointerType "mouse").

export default function S04Spot({ as: Tag = "div", className, children }) {
  const bewegen = (e) => {
    if (e.pointerType !== "mouse") return;
    const karte = e.target.closest?.("[data-s04-karte]");
    if (!karte) return;
    const r = karte.getBoundingClientRect();
    karte.style.setProperty("--s04-mx", `${Math.round(e.clientX - r.left)}px`);
    karte.style.setProperty("--s04-my", `${Math.round(e.clientY - r.top)}px`);
  };
  return (
    <Tag className={className} onPointerMove={bewegen}>
      {children}
    </Tag>
  );
}
