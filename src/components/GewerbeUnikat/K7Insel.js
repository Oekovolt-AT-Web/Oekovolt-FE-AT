"use client";

// src/components/GewerbeUnikat/K7Insel.js
//
// Winziger Client-Wrapper: lädt die K7-Bühne (Pult, Saldo-Kurve, Stresstest-Fächer, Entscheider-Mappe;
// motion, d3, Gewerbe-PV-Rechenkern, RechnerTeilen) erst 1,5 Bildschirmhöhen vor dem Kapitel. Bis dahin steht
// der SSR-Platzhalter gleicher Größe (Rechenweg, Saldo, Prüfstand und Fächer im Startzustand) – kein Sprung.
//
// Einzige Zutat über das Insel-Muster hinaus: useK3Kwp() (K7Herkunft) läuft ab dem Hydrieren mit, damit der
// Chip „aus Kapitel 03“ den Wert aus K3 zeigt – nicht den, den K6 oder das Pult selbst später geschrieben haben.

import dynamic from "next/dynamic";
import { InselRahmen, PlatzhalterAnzeige } from "./_gestaltung";
import { useK3Kwp } from "./K7Herkunft";

const Buehne = dynamic(() => import("./K7Pult"), { ssr: false, loading: PlatzhalterAnzeige });

export default function K7Insel({ platzhalter, ...p }) {
  const k3Kwp = useK3Kwp();
  return (
    <InselRahmen platzhalter={platzhalter}>
      <Buehne {...p} k3Kwp={k3Kwp} />
    </InselRahmen>
  );
}
