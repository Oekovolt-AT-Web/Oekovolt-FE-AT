"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const OPTIONEN = { rootMargin: "0px 0px -8% 0px", threshold: 0.08 };

/**
 * Ein einziger IntersectionObserver für alle `.ov-reveal`-Elemente der Seite.
 *
 * Performance:
 * - Beobachtet wird nur der Hauptinhalt (`#main-content`), nicht das ganze
 *   Dokument – Kopf, Fuß, Cookie-Banner und Widgets lösen keine Arbeit aus.
 * - Sobald alle Elemente eingeblendet sind, wird der IntersectionObserver
 *   abgebaut („nach dem Durchlauf“). Kommt später noch Inhalt dazu (Tabs,
 *   nachgeladene Bausteine), legt der schlanke MutationObserver ihn bei Bedarf
 *   neu an – sonst blieben solche Elemente unsichtbar.
 * - Entfernte Elemente werden aus der Warteliste gestrichen, damit der Abbau
 *   nicht an „toten“ Knoten hängen bleibt.
 * Sicherheitsnetz: nach 4 s wird alles sichtbar, was im Sichtfeld liegt.
 */
export default function RevealObserver() {
  const pfad = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    const bereich = document.getElementById("main-content") || document.body;

    const offen = new Set();
    let io = null;

    const abbauen = () => {
      if (offen.size || !io) return;
      io.disconnect();
      io = null;
    };

    const zeigen = (el) => {
      el.classList.add("is-visible");
      io?.unobserve(el);
      offen.delete(el);
    };

    const beobachten = (el) => {
      if (offen.has(el) || el.classList.contains("is-visible")) return;
      if (!io) {
        io = new IntersectionObserver((eintraege) => {
          for (const e of eintraege) if (e.isIntersecting) zeigen(e.target);
          abbauen();
        }, OPTIONEN);
      }
      offen.add(el);
      io.observe(el);
    };

    const erfassen = (knoten) => {
      if (knoten.classList?.contains("ov-reveal")) beobachten(knoten);
      knoten.querySelectorAll?.(".ov-reveal:not(.is-visible)").forEach(beobachten);
    };
    erfassen(bereich);

    const mo = new MutationObserver((mutationen) => {
      let entfernt = false;
      for (const m of mutationen) {
        m.addedNodes.forEach((n) => n.nodeType === 1 && erfassen(n));
        if (m.removedNodes.length) entfernt = true;
      }
      if (entfernt) {
        for (const el of offen) {
          if (!el.isConnected) {
            io?.unobserve(el);
            offen.delete(el);
          }
        }
        abbauen();
      }
    });
    mo.observe(bereich, { childList: true, subtree: true });

    const netz = setTimeout(() => {
      for (const el of offen) {
        if (el.getBoundingClientRect().top < window.innerHeight) zeigen(el);
      }
      abbauen();
    }, 4000);

    return () => {
      io?.disconnect();
      mo.disconnect();
      clearTimeout(netz);
    };
  }, [pfad]);

  return null;
}
