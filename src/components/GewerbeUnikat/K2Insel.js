"use client";

// src/components/GewerbeUnikat/K2Insel.js
//
// K2 · Dach-Labor: Insel-Hülle. Lädt die Bühne (K2DachLabor) erst 1,5 Bildschirmhöhen vor dem Kapitel;
// bis dahin steht der SSR-Platzhalter (K2Pult mit Iso-SVG und allen Startwerten) in gleicher Größe.
// three.js lädt K2DachLabor erst danach – und nur bei WebGL und nicht auf schwachen Geräten.

import dynamic from "next/dynamic";
import { InselRahmen, PlatzhalterAnzeige } from "./_gestaltung";

const Buehne = dynamic(() => import("./K2DachLabor"), { ssr: false, loading: PlatzhalterAnzeige });

export default function K2Insel({ platzhalter, ...p }) {
  return (
    <InselRahmen platzhalter={platzhalter}>
      <Buehne {...p} />
    </InselRahmen>
  );
}
