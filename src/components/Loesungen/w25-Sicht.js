"use client";

// src/components/Loesungen/w25-Sicht.js
// Client-Insel: setzt beim ersten Eintritt `data-w25-an` (siehe useW25Sicht in w25-hooks.js).
// Alle Aufbau-Animationen der umschlossenen Server-Grafik hängen per CSS an diesem Attribut.

import { useRef } from "react";
import { useW25Sicht } from "./w25-hooks";

export default function W25Sicht({ as: Tag = "div", schwelle = 0.2, children, ...rest }) {
  const ref = useRef(null);
  useW25Sicht(ref, { schwelle });
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
