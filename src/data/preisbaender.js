// src/data/preisbaender.js
//
// Preisbänder je Anlagenklasse für den Preisanker (Welle A, Paket A03).
// Die Werte liefert die Geschäftsführung – bis dahin bleiben sie leer und freigegeben:false.
// src/components/Verkauf/PreisAnker.js zeigt ausschließlich Bänder mit freigegeben === true und
// vollständigen Werten; sonst nichts. Hauptgröße ist der Preis je erzeugter kWh über 25 Jahre
// (aus €/kWp und dem Ertrags-Richtwert), Bandbreite, kein Angebot.
//
// Pflege: vonEurKwp/bisEurKwp netto, Stand als ISO-Datum, freigegeben nur mit freigegebenVon.

export const PREISBAENDER_STAND = "";

export const PREISBAENDER = [
  { klasse: "100–250 kWp", vonEurKwp: null, bisEurKwp: null, stand: "", freigegeben: false, freigegebenVon: "" },
  { klasse: "250–500 kWp", vonEurKwp: null, bisEurKwp: null, stand: "", freigegeben: false, freigegebenVon: "" },
  { klasse: "500–1.000 kWp", vonEurKwp: null, bisEurKwp: null, stand: "", freigegeben: false, freigegebenVon: "" },
  { klasse: "über 1.000 kWp", vonEurKwp: null, bisEurKwp: null, stand: "", freigegeben: false, freigegebenVon: "" },
];

/** Ertrag je kWp und Jahr (Richtwert Österreich, wie src/components/Project/projektDaten.js). */
export const ERTRAG_JE_KWP = 1050;
export const LAUFZEIT_JAHRE = 25;

/** Nur Einträge mit freigegeben === true (strikt – "true" oder 1 gelten nicht). */
export const nurFreigegeben = (liste, feld = "freigegeben") => (Array.isArray(liste) ? liste.filter((x) => x && x[feld] === true) : []);

/** Ist ein Preisband vollständig und freigegeben? */
export const preisbandGueltig = (b) =>
  Boolean(b && b.freigegeben === true && Number.isFinite(Number(b.vonEurKwp)) && Number.isFinite(Number(b.bisEurKwp)) && Number(b.vonEurKwp) > 0 && Number(b.bisEurKwp) >= Number(b.vonEurKwp));

/** Alle Preisbänder, die gezeigt werden dürfen. */
export const freigegebenePreisbaender = (liste = PREISBAENDER) => nurFreigegeben(liste).filter(preisbandGueltig);

/**
 * Preis je erzeugter kWh über die Laufzeit in Cent: €/kWp ÷ (Ertrag je kWp × Jahre) × 100.
 * Ohne Betriebskosten und Degradation – als Anker, kein Angebot. Auf 0,1 ct gerundet.
 */
export function preisJeKwhCt(eurKwp, { ertragJeKwp = ERTRAG_JE_KWP, jahre = LAUFZEIT_JAHRE } = {}) {
  const e = Number(eurKwp);
  if (!Number.isFinite(e) || e <= 0) return null;
  return Math.round((e / (ertragJeKwp * jahre)) * 1000) / 10;
}
