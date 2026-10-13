"use client";

// src/components/GewerbeUnikat/K5Ausgang.js
//
// K5 · Kapitel-Ausgang (klein, ohne Bibliothek): genau ein primärer und höchstens ein sekundärer CTA.
//  - primär: HAUPT_CTA („Ersteinschätzung anfragen“, seitenweit gleich) mit thema=speicher → /angebot?objekt=gewerbe;
//    mit eigenen Daten → anfrageUrl(Steckbrief) mit kWp, Verbrauch und Speicher.
//  - sekundär: Peak-Shaving-Rechner mit 12 Monatsspitzen, Deckel und Speicher (psParams) – nur bei
//    12 vollen Monaten. Den Link rechnet die Bühne (K5SpitzenJagd, lädt psParams im eigenen Chunk) und
//    legt ihn über k5LinksSetzen() hier ab; bis dahin gilt der Server-Link des Beispiels.

import { useSyncExternalStore } from "react";
import { KapitelAusgang } from "./_bausteine";
import { HAUPT_CTA, HAUPT_HREF, mitThema } from "./_cta";
import { anfrageUrl, useSteckbrief } from "./_steckbrief";
import { useGewerbeDaten } from "./_daten";

let links = null; // { sekundaer: string | null }
const hoerer = new Set();

/** Von der Bühne aufgerufen (Ereignis/Effekt), nie während des Renderns. */
export function k5LinksSetzen(neu) {
  if (links && neu && links.sekundaer === neu.sekundaer) return;
  links = neu;
  for (const h of hoerer) h();
}
const abonnieren = (cb) => {
  hoerer.add(cb);
  return () => hoerer.delete(cb);
};
const lesen = () => links;
const lesenServer = () => null;

export default function K5Ausgang({ sekundaerStart }) {
  const l = useSyncExternalStore(abonnieren, lesen, lesenServer);
  const quelle = useGewerbeDaten((s) => (s.status === "bereit" && s.last ? s.last.quelle : "beispiel"));
  const sb = useSteckbrief();
  const eigen = quelle === "eigen";
  const sekundaer = l ? l.sekundaer : sekundaerStart;
  return (
    <KapitelAusgang
      dunkel
      primaer={{ label: HAUPT_CTA, href: mitThema(eigen ? anfrageUrl(sb) : HAUPT_HREF, "speicher") }}
      sekundaer={sekundaer ? { label: "Im Peak-Shaving-Rechner weiterrechnen", href: sekundaer } : null}
      hinweis={
        eigen
          ? "Die Anfrage übernimmt kWp, Jahresverbrauch und Speichergröße aus Ihrem Steckbrief – keine Lastgang-Datei, keine personenbezogenen Daten."
          : "Mit Ihren Viertelstundenwerten finden wir Ihre teuerste Viertelstunde – und den Deckel, der sich für Sie rechnet."
      }
    />
  );
}
