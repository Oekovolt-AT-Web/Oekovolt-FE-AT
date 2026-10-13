"use client";

// src/components/GewerbeUnikat/K6Anfrage.js
//
// K6 · Anfrage-Kontext: Die Bühne (K6Lineal) meldet hier den zuletzt eingestellten Netzanschluss
// (kWp, Speicher-WR, AC-Summe, TOR-Typ, Netzebene), der Ausgang (K6Ausgang) baut daraus den Link zur
// Anfrage. Nötig, weil der gemeinsame Steckbrief (_steckbrief.js, nicht änderbar) keinen Speicher-WR in kW
// kennt und anfrageUrl() nur kWp, Verbrauch und Speicher-kWh übergibt.
//
// Übergeben werden nur Anlagenwerte – keine personenbezogenen Daten. Der Angebots-Konfigurator wertet
// heute objekt, kwp, verbrauch, speicher (> 0 = Vorhaben „Speicher“) und thema aus; ne, tor, ac und spwr
// stehen zusätzlich im Link (für die Zuordnung bzw. eine spätere Vorbelegung der Netzebene).

import { useSyncExternalStore } from "react";
import { angebotUrl } from "@/lib/rechner/angebot";

let wert = null;
const hoerer = new Set();

export const k6Anfrage = {
  /** @param {{kwp:number, sp:number, spKwh:number|null, ac:number, typ:string, ne:number}} neu */
  setze(neu) {
    wert = neu;
    for (const h of hoerer) h();
  },
};

const abonnieren = (cb) => {
  hoerer.add(cb);
  return () => hoerer.delete(cb);
};

/** Zuletzt in K6 eingestellter Zustand (null = noch nichts bedient). */
export function useK6Anfrage() {
  return useSyncExternalStore(
    abonnieren,
    () => wert,
    () => null
  );
}

/**
 * Anfrage-Link mit Steckbrief-Werten und dem Netzanschluss aus K6.
 * @param {object} sb  Steckbrief
 * @param {object|null} k6  Zustand aus useK6Anfrage()
 */
export function k6AnfrageUrl(sb, k6) {
  const speicher = sb.speicherKwh > 0 ? sb.speicherKwh : k6?.sp > 0 ? k6.spKwh || k6.sp : undefined;
  const basis = angebotUrl({
    objekt: "gewerbe",
    kwp: (k6?.kwp ?? sb.kwp) || undefined,
    verbrauch: sb.jahresverbrauchKwh || undefined,
    speicher,
  });
  const [pfad, query = ""] = basis.split("?");
  const q = new URLSearchParams(query);
  q.set("thema", "netzanmeldung");
  const ne = k6?.ne ?? sb.ne;
  if ([5, 6, 7].includes(Number(ne))) q.set("ne", String(ne));
  if (k6) {
    if (/^[A-D]$/.test(k6.typ)) q.set("tor", k6.typ.toLowerCase());
    if (k6.ac > 0) q.set("ac", String(Math.round(k6.ac)));
    if (k6.sp > 0) q.set("spwr", String(Math.round(k6.sp)));
  }
  return `${pfad}?${q.toString()}`;
}
