"use client";

import { useEffect, useRef } from "react";

import { aktiveZuweisungen, expKennung } from "@/lib/experimente";
import { ereignis } from "@/lib/statistik";

// Einmal je Experiment und Seitenaufruf (Arbeitsspeicher, kein Browserspeicher)
const GESEHEN = new Set();

/**
 * Meldet `exp_gesehen`, sobald das getestete Element zu mindestens `schwelle` sichtbar ist.
 * Ereignisdaten: { exp: "k1:b", test: "k1", variante: "b" } – nichts Personenbezogenes.
 * Läuft das Experiment nicht (oder ist noch nicht zugewiesen), wird nichts gemeldet.
 */
export default function ExperimentSichtbar({ id, variante, schwelle = 0.5, as: Tag = "div", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || GESEHEN.has(id)) return undefined;
    const zugewiesen = aktiveZuweisungen()[id];
    if (!zugewiesen || zugewiesen !== variante) return undefined;

    const melden = () => {
      if (GESEHEN.has(id)) return;
      GESEHEN.add(id);
      ereignis("exp_gesehen", { exp: expKennung({ [id]: zugewiesen }), test: id, variante: zugewiesen });
    };

    if (typeof IntersectionObserver === "undefined") {
      melden();
      return undefined;
    }
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) {
          melden();
          beobachter.disconnect();
        }
      },
      { threshold: schwelle }
    );
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, [id, variante, schwelle]);

  return (
    <Tag ref={ref} data-exp={id} {...rest}>
      {children}
    </Tag>
  );
}
