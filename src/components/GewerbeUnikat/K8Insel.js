"use client";

// src/components/GewerbeUnikat/K8Insel.js
//
// K8 · Inseln: Fahrplan (K8FahrplanLinie) und Projektsteckbrief (K8Steckbrief) laden erst, wenn sie in
// Bildschirmnähe kommen (1,5 Bildschirmhöhen vorher, motion im eigenen Chunk). Bis dahin – und während der
// Chunk lädt – steht dieselbe Ansicht im Startzustand als Platzhalter (reine Komponenten, gleiche Fläche,
// kein CLS). Die Karten-Inhalte kommen fertig gerendert vom Server und werden nur einmal übertragen.

import dynamic from "next/dynamic";
import { InselRahmen, PlatzhalterAnzeige } from "./_gestaltung";
import { STECKBRIEF_START } from "./_steckbrief";
import K8FahrplanAnsicht from "./K8FahrplanAnsicht";
import K8SteckbriefBlatt from "./K8SteckbriefBlatt";

const Fahrplan = dynamic(() => import("./K8FahrplanLinie"), { ssr: false, loading: PlatzhalterAnzeige });
const Steckbrief = dynamic(() => import("./K8Steckbrief"), { ssr: false, loading: PlatzhalterAnzeige });

/** Fahrplan: stationen, spuren, karten, montage, fenster, schlossText (vom Server). */
export default function K8Insel(props) {
  return (
    <InselRahmen
      platzhalter={
        <div inert>
          <K8FahrplanAnsicht {...props} />
        </div>
      }
    >
      <Fahrplan {...props} />
    </InselRahmen>
  );
}

/** Projektsteckbrief: orte, bereiche (Namen je Kennung), beispiel (Beispiel-Dossier) – alles vom Server. */
export function K8SteckbriefInsel(props) {
  return (
    <InselRahmen
      platzhalter={
        <div inert>
          <K8SteckbriefBlatt sb={STECKBRIEF_START} start={STECKBRIEF_START} bsp={props.beispiel} orte={props.orte} bereiche={props.bereiche} />
        </div>
      }
    >
      <Steckbrief {...props} />
    </InselRahmen>
  );
}
