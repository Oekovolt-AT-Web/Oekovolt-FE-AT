"use client";

// src/components/GewerbeUnikat/K6Insel.js
//
// K6 · Insel: lädt die Bühne (K6Lineal mit motion und d3-scale) erst, wenn das Kapitel in Bildschirmnähe
// kommt (1,5 Bildschirmhöhen vorher). Bis dahin – und während der Chunk lädt – steht der Server-Platzhalter
// (dieselbe Ansicht im Startzustand, gleiche Fläche, kein CLS).

import dynamic from "next/dynamic";
import { InselRahmen, PlatzhalterAnzeige } from "./_gestaltung";

const Buehne = dynamic(() => import("./K6Lineal"), { ssr: false, loading: PlatzhalterAnzeige });

export default function K6Insel({ platzhalter, ...props }) {
  return (
    <InselRahmen platzhalter={platzhalter}>
      <Buehne {...props} />
    </InselRahmen>
  );
}
