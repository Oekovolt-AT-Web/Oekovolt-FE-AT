// src/components/LeadGate/freigabe.js
//
// Browser-Hilfen des Lead-Gates 2.0 (Welle A, Paket A09). Die Freischaltung selbst steckt im HttpOnly-Cookie
// „ov-lead-frei“ (Server, src/lib/leadGateServer.js) – der Browser fragt nur /api/lead-gate/status ab und kann
// die Freischaltung über DELETE entfernen. Im Browserspeicher liegt NICHTS Personenbezogenes.

/** URL-Parameter, mit dem /freischalten auf die Werkzeugseite zurückführt (?lead-frei=<kennung>). */
export const FREI_PARAM = "lead-frei";

/** Ereignis im Fenster, wenn eine Kennung frei wurde (mehrere Knöpfe derselben Seite gleichziehen). */
export const FREI_EREIGNIS = "ov:lead-frei";

/** Alte Schlüssel der Übergangs-Gates (B05, B07, B08, B09, C05, C07) – werden beim Entfernen mit gelöscht. */
const ALTE_SCHLUESSEL = /^(ov_gate_|ov-gate-|ov_lead_|ov-lead-)/;

export const statusUrl = (kennung) => `/api/lead-gate/status?${new URLSearchParams({ kennung })}`;

/** Fragt den Freischalt-Zustand ab: { frei, bis } oder null (Netzfehler). */
export async function statusAbfragen(kennung) {
  try {
    const r = await fetch(statusUrl(kennung), { cache: "no-store", credentials: "same-origin" });
    if (!r.ok) return r.status === 422 ? { frei: false, bis: null } : null;
    const j = await r.json();
    return { frei: Boolean(j?.frei ?? j?.freigegeben), bis: j?.bis || null };
  } catch {
    return null;
  }
}

/** Meldet allen Gates der Seite, dass eine Kennung frei ist. */
export function freiMelden(kennung) {
  try {
    window.dispatchEvent(new CustomEvent(FREI_EREIGNIS, { detail: { kennung } }));
  } catch {
    /* alter Browser – die Statusabfrage holt es nach */
  }
}

/**
 * Liest ?lead-frei=<kennung> (Rückkehr vom Bestätigungslink) und entfernt den Parameter aus der Adresse.
 * @returns {boolean} true, wenn genau diese Kennung gerade bestätigt wurde
 */
export function bestaetigtAusUrl(kennung) {
  try {
    const url = new URL(window.location.href);
    const wert = url.searchParams.get(FREI_PARAM);
    if (!wert) return false;
    if (wert !== kennung) return false;
    url.searchParams.delete(FREI_PARAM);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * „Freischaltung auf diesem Gerät entfernen“: Cookie löschen (Server) und Merker der Übergangs-Gates
 * aus localStorage/sessionStorage entfernen.
 */
export async function freigabeEntfernen() {
  for (const speicher of ["localStorage", "sessionStorage"]) {
    try {
      const s = window[speicher];
      for (let i = s.length - 1; i >= 0; i -= 1) {
        const k = s.key(i);
        if (k && ALTE_SCHLUESSEL.test(k)) s.removeItem(k);
      }
    } catch {
      /* Speicher gesperrt – nichts zu entfernen */
    }
  }
  try {
    const r = await fetch("/api/lead-gate/status", { method: "DELETE", credentials: "same-origin" });
    return r.ok;
  } catch {
    return false;
  }
}
