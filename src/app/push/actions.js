"use server";

import { kanal, kanalKonfiguriert } from "@/lib/kanaele/frappe";
import { PUSH_THEMEN_IDS, pushEndpointErlaubt } from "@/lib/kanaele/pushThemen";

/** Öffentlicher VAPID-Schlüssel (für pushManager.subscribe). */
export async function pushSchluessel() {
  const key = process.env.VAPID_PUBLIC_KEY || null;
  return { key, aktiv: Boolean(key && process.env.VAPID_PRIVATE_KEY && kanalKonfiguriert()) };
}

function pruefen(abo) {
  const endpoint = String(abo?.endpoint || "");
  const p256dh = String(abo?.keys?.p256dh || "");
  const auth = String(abo?.keys?.auth || "");
  if (!pushEndpointErlaubt(endpoint) || endpoint.length > 1000) return null;
  if (!/^[A-Za-z0-9_-]{40,200}$/.test(p256dh) || !/^[A-Za-z0-9_-]{10,60}$/.test(auth)) return null;
  return { endpoint, p256dh, auth };
}

/** Speichert oder aktualisiert ein Abo mit Themen. */
export async function pushAbonnieren(abo, themen = []) {
  const daten = pruefen(abo);
  if (!daten) return { ok: false, fehler: "abo" };
  const auswahl = (Array.isArray(themen) ? themen : []).filter((t) => PUSH_THEMEN_IDS.includes(t));
  if (!auswahl.length) return { ok: false, fehler: "themen" };
  try {
    await kanal("push_abo_speichern", { ...daten, themen: auswahl.join(",") });
    return { ok: true, themen: auswahl };
  } catch {
    return { ok: false, fehler: "backend" };
  }
}

export async function pushAbbestellen(endpoint) {
  if (!pushEndpointErlaubt(endpoint)) return { ok: false };
  try {
    await kanal("push_abo_loeschen", { endpoint });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
