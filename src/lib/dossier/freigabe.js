// src/lib/dossier/freigabe.js
//
// Serverseitige Prüfung der Lead-Gate-Freischaltung für Downloads der Stufe 2 (Dossier-PDF).
// Seit der Integration Welle A zentral über freigabePruefen() aus src/lib/leadGateServer.js (A09):
// gleiches Cookie „ov-lead-frei“, gleiches Geheimnis (LEAD_GATE_SECRET bzw. Entwicklungs-Geheimnis
// außerhalb von production), Stufe-2-Kennungen brauchen ihre eigene Bestätigung.
// Außerhalb von production zusätzlich: Kopfzeile x-ov-gate-dev: 1 (Entwicklungs-Fallback des schlanken Gates).
// Nur Node-Laufzeit (crypto).

import { FREISCHALT_COOKIE, freigabePruefen } from "@/lib/leadGateServer";

export { FREISCHALT_COOKIE };

/**
 * Ist dieser Besucher für die Kennung freigeschaltet?
 * @param {Request} request
 * @param {string} kennung  z. B. "dossier"
 * @returns {{ frei: boolean, grund: string }}
 */
export function freigabeGeprueft(request, kennung = "dossier") {
  const c = freigabePruefen(request, kennung);
  if (c.frei) return { frei: true, grund: "cookie" };
  if (process.env.NODE_ENV !== "production" && request.headers.get("x-ov-gate-dev") === "1") return { frei: true, grund: "entwicklung" };
  return { frei: false, grund: c.grund };
}
