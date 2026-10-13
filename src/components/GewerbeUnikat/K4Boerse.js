// src/components/GewerbeUnikat/K4Boerse.js
//
// K4 · „Börse jetzt“ – ASYNC SERVER-KOMPONENTE, in <Suspense fallback={null}> eingebunden: streamt nach,
// blockiert die Seite nie. Day-Ahead-Preis der Gebotszone AT (getSpotPrices aus src/lib/energy.js,
// SMARD/Bundesnetzagentur, CC BY 4.0) mit Zeitlimit 1,5 s: aktuelle Viertelstunde in ct/kWh netto,
// Mittel heute 12–14 Uhr, Tagesverlauf. Die Anzeige rechnet K4BoerseLive (Client) mit den Werten aus dem
// Röntgen weiter: Börse + Netz und Abgabe = Wert einer selbst genutzten kWh bei börsenindiziertem Bezug.
// Ohne Daten (Zeitlimit, Ausfall) wird NICHTS angezeigt.

import { connection } from "next/server";
import { ctKwh, getSpotPrices, SMARD_ATTRIBUTION, SMARD_LIZENZ, ZEITZONE } from "@/lib/energy";
import K4BoerseLive from "./K4BoerseLive.js";

const ZEITLIMIT_MS = 1500;
const UHR = new Intl.DateTimeFormat("de-AT", { timeZone: ZEITZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const TAG = new Intl.DateTimeFormat("sv-SE", { timeZone: ZEITZONE });

const uhr = (t) => UHR.format(new Date(t));
const tag = (t) => TAG.format(new Date(t));
/** Stunde als Dezimalzahl in Wiener Zeit (13:45 → 13,75). */
function stunde(t) {
  const [h, mi] = uhr(t).split(":").map(Number);
  return h + mi / 60;
}

async function mitZeitlimit(versprechen, ms) {
  let uhrId;
  const limit = new Promise((res) => {
    uhrId = setTimeout(() => res(null), ms);
  });
  try {
    return await Promise.race([versprechen.catch(() => null), limit]);
  } finally {
    clearTimeout(uhrId);
  }
}

/** Rohdaten → Anzeige (rein, testbar, serialisierbar). null, wenn die aktuelle Viertelstunde oder der Tag fehlt. */
export function boerseAuswerten(daten, jetzt) {
  const punkte = daten?.punkte;
  if (!Array.isArray(punkte) || punkte.length < 4) return null;
  const schritt = (daten.aufloesungMin === 60 ? 60 : 15) * 60000;
  const heute = tag(jetzt);
  const tagesPunkte = punkte.filter((p) => Number.isFinite(p.eurMwh) && tag(p.t) === heute);
  const aktuell = punkte.find((p) => p.t <= jetzt && jetzt < p.t + schritt && Number.isFinite(p.eurMwh));
  if (!aktuell || tagesPunkte.length < 4) return null;
  const mittag = tagesPunkte.filter((p) => {
    const h = stunde(p.t);
    return h >= 12 && h < 14;
  });
  const mittagEur = mittag.length ? mittag.reduce((s, p) => s + p.eurMwh, 0) / mittag.length : null;
  return {
    aktuellCt: ctKwh(aktuell.eurMwh),
    von: uhr(aktuell.t),
    bis: uhr(aktuell.t + schritt),
    mittagCt: mittagEur == null ? null : ctKwh(mittagEur),
    einheit: schritt === 3600000 ? "Stunde" : "Viertelstunde",
    kurve: tagesPunkte.map((p) => ({ h: Math.round(stunde(p.t) * 100) / 100, ct: Math.round(ctKwh(p.eurMwh) * 1000) / 1000 })),
    schrittH: schritt / 3600000,
    jetztH: stunde(jetzt),
    stand: uhr(jetzt),
    quelle: daten.quelle || SMARD_ATTRIBUTION,
    lizenz: SMARD_LIZENZ,
  };
}

/**
 * start: { energieCt, nebenCt } – Energiepreis und Netz + Abgabe des Rechenbeispiels (bis der Besucher im
 * Röntgen etwas wählt).
 */
export default async function K4Boerse({ start }) {
  await connection(); // „jetzt“ gehört zur Anfrage, nicht zum Build
  const jetzt = Date.now();
  const daten = await mitZeitlimit(getSpotPrices(), ZEITLIMIT_MS);
  const b = boerseAuswerten(daten, jetzt);
  if (!b) return null;
  return <K4BoerseLive b={b} start={start} />;
}
