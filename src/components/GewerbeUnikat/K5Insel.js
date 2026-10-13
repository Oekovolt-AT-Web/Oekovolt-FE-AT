"use client";

// src/components/GewerbeUnikat/K5Insel.js
//
// K5 · Insel: lädt die Bühne (K5SpitzenJagd mit motion und d3) erst, wenn das Kapitel in Bildschirmnähe
// kommt (1,5 Bildschirmhöhen vorher). Bis dahin – und während der Chunk lädt – steht der Server-Platzhalter
// (dieselbe Ansicht im Startzustand, gleiche Fläche, kein CLS).

import dynamic from "next/dynamic";
import { InselRahmen, PlatzhalterAnzeige } from "./_gestaltung";

const Buehne = dynamic(() => import("./K5SpitzenJagd"), { ssr: false, loading: PlatzhalterAnzeige });

export default function K5Insel({ platzhalter, ...props }) {
  return (
    <InselRahmen platzhalter={platzhalter}>
      <Buehne {...props} />
    </InselRahmen>
  );
}
