"use client";

// src/components/GewerbeUnikat/K1Insel.js
//
// K1 · Nachlade-Inseln: Die Teppich-Bühne (motion, Canvas) und das Panel „Eigener Lastgang“ (Lead-Gate)
// laden erst 1,5 Bildschirmhöhen vor dem Kapitel. Bis dahin steht der SSR-Platzhalter gleicher Größe.

import dynamic from "next/dynamic";
import { InselRahmen, PlatzhalterAnzeige } from "./_gestaltung";

const Buehne = dynamic(() => import("./K1Teppich"), { ssr: false, loading: PlatzhalterAnzeige });
const Upload = dynamic(() => import("./K1EigenerLastgang"), { ssr: false, loading: PlatzhalterAnzeige });

export default function K1Insel({ platzhalter, ...p }) {
  return (
    <InselRahmen platzhalter={platzhalter}>
      <Buehne {...p} />
    </InselRahmen>
  );
}

export function K1UploadInsel({ platzhalter, ...p }) {
  return (
    <InselRahmen platzhalter={platzhalter}>
      <Upload {...p} />
    </InselRahmen>
  );
}
