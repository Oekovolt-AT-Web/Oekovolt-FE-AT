"use client";

// src/components/GewerbeUnikat/K2Ausgang.js
//
// K2 · Ausgang: genau ein primärer CTA (HAUPT_CTA → Anfrage) und ein sekundärer Textlink (Luftbild-Werkzeug im
// Gewerbe-PV-Rechner, dort Lead-Gate „hallendach-planer“, Stufe 2). Der Standort-Check steht bei der FAQ.
//
// Ehrliche Übergabe:
//  - Anfrage: Jahresverbrauch nur, wenn der Besucher ihn wirklich festgelegt hat (eigener Lastgang, Kapitel 01
//    oder Steckbrief) – der Startwert ist der des SYNTHETISCHEN Beispielbetriebs und darf nicht als „aus dem
//    Rechner übernommen“ in einer echten Anfrage landen (gleiche Regel wie K8). kWp/Speicher nur, wenn gesetzt.
//  - Rechner: die Halle aus dem Dach-Labor – NUTZFLÄCHE (der Rechner teilt sie direkt durch m²/kWp, so kommt
//    dort dieselbe kWp-Zahl heraus), Dachart und Ort. Die Bühne meldet die Nutzfläche über k2AusgangSetzen();
//    bis dahin gilt der Startwert vom Server.

import { useSyncExternalStore } from "react";
import { ereignis } from "@/lib/statistik";
import { KapitelAusgang } from "./_bausteine";
import { HAUPT_CTA } from "./_cta";
import { STECKBRIEF_START, anfrageUrl, rechnerUrl, useSteckbrief } from "./_steckbrief";

let werte = null; // { netto: number }
const hoerer = new Set();

/** Von der Bühne (K2DachLabor) aus einem Effekt aufgerufen, nie während des Renderns. */
export function k2AusgangSetzen(neu) {
  if (werte && neu && werte.netto === neu.netto) return;
  werte = neu;
  for (const h of hoerer) h();
}
const abonnieren = (cb) => {
  hoerer.add(cb);
  return () => hoerer.delete(cb);
};
const lesen = () => werte;
const lesenServer = () => null;

/** Nur Werte, die der Besucher festgelegt hat – nie die des synthetischen Beispielbetriebs. */
function festgelegt(sb) {
  const fest = sb.quelle === "eigen" || sb.bausteine.includes("k1") || sb.jahresverbrauchKwh !== STECKBRIEF_START.jahresverbrauchKwh;
  return { ...sb, jahresverbrauchKwh: fest ? sb.jahresverbrauchKwh : null, schichten: fest ? sb.schichten : null };
}

export default function K2Ausgang({ startNetto }) {
  const sb = useSteckbrief();
  const live = useSyncExternalStore(abonnieren, lesen, lesenServer);
  const eigen = festgelegt(sb);
  const netto = live?.netto ?? startNetto;
  const planer = `${rechnerUrl({ ...eigen, flaecheQm: netto > 0 ? netto : null })}#dach-einzeichnen`;
  return (
    <KapitelAusgang
      className="max-md:mt-7"
      primaer={{
        label: HAUPT_CTA,
        href: anfrageUrl(eigen),
        onClick: () => ereignis("kapitel_cta", { kapitel: "k2", ziel: "anfrage" }),
      }}
      sekundaer={{
        label: "Dach auf dem Luftbild einzeichnen",
        href: planer,
        onClick: () => ereignis("kapitel_cta", { kapitel: "k2", ziel: "hallendach_planer" }),
      }}
      hinweis="Wir prüfen Dachart, Statik und Belegung Ihrer Halle. Das Luftbild-Werkzeug übernimmt Nutzfläche, Dachart und Standort; sein Datenblatt gibt es nach Bestätigung Ihrer E-Mail-Adresse."
    />
  );
}
