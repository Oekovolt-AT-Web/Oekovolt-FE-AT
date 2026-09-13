// src/lib/kanaele/frappe.js
//
// Anbindung der Ausspielkanäle (Veröffentlichungen, Push, Fediverse) an Frappe.
// Alle Methoden liegen in oekovoltdeutchland…doctype.veroeffentlichung.api
// (siehe docs/frappe-kanaele/).
//
// Umgebungsvariablen: SERVER, KANAL_API_KEY/KANAL_API_SECRET (empfohlen) oder API_KEY/API_SECRET.

const SERVER = process.env.SERVER;
const KEY = process.env.KANAL_API_KEY || process.env.API_KEY;
const SECRET = process.env.KANAL_API_SECRET || process.env.API_SECRET;
const BASIS = `${SERVER}/api/method/oekovoltdeutchland.oekovoltdeutchland.doctype.veroeffentlichung.api.`;

export const kanalKonfiguriert = () => Boolean(SERVER && KEY && SECRET);

/**
 * Ruft eine whitelisted Methode auf.
 * revalidate: Sekunden für den Next.js-Datencache (nur lesende Methoden), false = kein Cache
 */
export async function kanal(methode, daten = {}, { revalidate = false, tags } = {}) {
  if (!kanalKonfiguriert()) throw Object.assign(new Error("nicht_konfiguriert"), { status: 503 });
  const res = await fetch(BASIS + methode, {
    method: "POST",
    headers: { Authorization: `token ${KEY}:${SECRET}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(daten),
    ...(revalidate === false ? { cache: "no-store" } : { next: { revalidate, tags } }),
    signal: AbortSignal.timeout(12000),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* keine JSON-Antwort */
  }
  if (!res.ok) {
    console.error(`Kanal-API ${methode}: HTTP ${res.status}`);
    throw Object.assign(new Error(json?.exc_type || "backend"), { status: res.status });
  }
  return json?.message ?? null;
}
