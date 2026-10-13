"use client";

// src/components/GewerbeUnikat/K4Insel.js
//
// Winziger Client-Wrapper: lädt die K4-Bühne (motion + domMax, Karte) erst 1,5 Bildschirmhöhen vor dem
// Kapitel. Bis dahin steht der SSR-Platzhalter gleicher Größe (Rechnung im Startzustand, Röntgenbild
// leer, Pult deaktiviert) – kein Layout-Sprung.

import dynamic from "next/dynamic";
import { InselRahmen, PlatzhalterAnzeige } from "./_gestaltung";

const Buehne = dynamic(() => import("./K4Roentgen"), { ssr: false, loading: PlatzhalterAnzeige });

export default function K4Insel({ platzhalter, ...p }) {
  return (
    <InselRahmen platzhalter={platzhalter}>
      <Buehne {...p} />
    </InselRahmen>
  );
}
