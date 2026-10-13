"use client";

// src/components/GewerbeUnikat/K3Insel.js
//
// Kapitel 03: lädt die Bühne „Sonne trifft Schicht“ (K3SonneSchicht – motion, d3) erst 1,5 Bildschirmhöhen
// vor dem Kapitel. Bis dahin steht der SSR-Platzhalter (K3Ansicht im Startzustand, gleiche Höhe).

import dynamic from "next/dynamic";
import { InselRahmen, PlatzhalterAnzeige } from "./_gestaltung";

const Buehne = dynamic(() => import("./K3SonneSchicht"), { ssr: false, loading: PlatzhalterAnzeige });

export default function K3Insel({ platzhalter, ...props }) {
  return (
    <InselRahmen platzhalter={platzhalter}>
      <Buehne {...props} />
    </InselRahmen>
  );
}
