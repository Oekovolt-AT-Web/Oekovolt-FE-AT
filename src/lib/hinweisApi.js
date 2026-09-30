// src/lib/hinweisApi.js
//
// Serverseitige Anbindung des Hinweisgebersystems an das Frappe-Backend.
//
// Sicherheit:
//  - Eigene, eingeschränkte Zugangsdaten (HINWEIS_API_KEY/SECRET). Der API-User
//    darf NUR die whitelisted Methoden aufrufen, aber keine Hinweise lesen.
//    Fehlen die Variablen, wird der allgemeine Website-Zugang genutzt –
//    für den Produktivbetrieb ausdrücklich NICHT empfohlen.
//  - Es werden keine IP-Adressen, User-Agents oder sonstigen Metadaten
//    weitergereicht und nichts vom Inhalt geloggt.

import { HINWEIS_INTERN } from "@/data/hinweisgeber";

const SERVER = process.env.SERVER;
const KEY = process.env.HINWEIS_API_KEY || process.env.API_KEY;
const SECRET = process.env.HINWEIS_API_SECRET || process.env.API_SECRET;
const BASIS = `${SERVER}/api/method/oekovoltdeutchland.oekovoltdeutchland.doctype.hinweis.api.`;

// Eigenes Hinweisgebersystem erst nach Freigabe aktiv (HINWEIS_INTERN=1, zentraler Schalter in
// src/data/hinweisgeber.js). Bis dahin läuft der Meldekanal über IntegrityLine und die API lehnt
// Meldungen ab (503), damit nichts in einem Kanal landet, der noch nicht betreut wird.
// Die API-Routen sind force-dynamic → hier gilt der Wert zur LAUFZEIT; Seiten und Redirects
// übernehmen ihn erst mit dem nächsten Build. Deshalb nach jeder Änderung neu bauen UND neu starten.
export function hinweisKonfiguriert() {
  return Boolean(HINWEIS_INTERN && SERVER && KEY && SECRET);
}

/** Ruft eine whitelisted Frappe-Methode auf. Wirft bei Fehlern ohne Inhaltsdetails. */
export async function frappeHinweis(methode, daten) {
  const res = await fetch(BASIS + methode, {
    method: "POST",
    headers: {
      Authorization: `token ${KEY}:${SECRET}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(daten),
    cache: "no-store",
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    // Antwort ohne JSON
  }

  if (!res.ok) {
    // Nur Status loggen – niemals den Inhalt der Meldung.
    console.error(`Hinweis-API ${methode}: HTTP ${res.status}`);
    const fehler = new Error("backend");
    fehler.status = res.status;
    throw fehler;
  }
  return json?.message ?? null;
}

// Einfache, globale Drosselung gegen Missbrauch – bewusst OHNE IP-Bezug,
// damit keine Rückschlüsse auf meldende Personen möglich sind.
const fenster = new Map();
export function gedrosselt(schluessel, max, ms) {
  const jetzt = Date.now();
  const liste = (fenster.get(schluessel) || []).filter((t) => jetzt - t < ms);
  if (liste.length >= max) {
    fenster.set(schluessel, liste);
    return true;
  }
  liste.push(jetzt);
  fenster.set(schluessel, liste);
  return false;
}

/** Text kürzen und Steuerzeichen entfernen (Zeilenumbruch und Tab bleiben). */
export function sauber(wert, max) {
  if (wert == null) return "";
  let aus = "";
  for (const zeichen of String(wert)) {
    const code = zeichen.codePointAt(0);
    const steuer = (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127;
    if (!steuer) aus += zeichen;
  }
  return aus.trim().slice(0, max);
}

export const HEADERS_PRIVAT = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};
