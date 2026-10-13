// src/app/api/termin/route.js
//
// Terminbuchung (/termin, eingebettet im Konfigurator-Erfolg) an das Backoffice:
// oekovolt_app.website_api.termin.buche_termin. Seit Welle A (A08) reicht die Route das Feld
// `bezug` (Website-Referenz der Angebotsanfrage, z. B. „AK-20261011-7F3K“) und die Kennung des
// angezeigten Hinweistexts (einwilligung_id/-version) geprüft durch; alles andere wie bisher.

import { NextResponse } from "next/server";
import { ipAdresse } from "@/lib/ipAdresse";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { backendFehler, NICHT_ERREICHBAR } from "@/lib/backendFehler";
import { herkunftAnNachricht } from "@/lib/herkunftServer";
import { gedrosselt, leseJson } from "@/lib/api/uber-uns/anfrageWeiterleiten";
import { einwilligung, einwilligungPruefen } from "@/lib/einwilligungen";
import { textKurz } from "@/lib/api/contact/create_contact";

const API_URL = `${API_BASE_URL}oekovolt_app.website_api.termin.buche_termin`;
const BEZUG_MUSTER = /^[A-Z]{1,3}-\d{4,8}-[A-Z0-9]{4,8}$/;

/** `bezug` nur in bekannter Form (Website-Referenz oder Frappe-Referenz wie „AA-2026-00042“), sonst weg. */
function bezugPruefen(wert) {
  const b = textKurz(wert, 24).toUpperCase();
  return BEZUG_MUSTER.test(b) ? b : "";
}

export async function POST(request) {
  const drossel = gedrosselt(request, "termin");
  if (drossel) return drossel;

  // Diese Frappe-Methode ist als Gast erreichbar (kein API-Key nötig) – ein
  // Authorization-Header führt hier sogar zu 401, wenn der Token nicht exakt
  // zu diesem Server passt. Deshalb bewusst ohne Auth, nur Content-Type.
  if (!API_BASE_URL) {
    console.error("API not configured: Missing NEW_SERVER environment variable");
    return NextResponse.json({ error: "API not configured" }, { status: 500 });
  }

  try {
    // Herkunft (Kanal, UTM, Einstieg) als Textblock an `nachricht` – buche_termin kennt kein eigenes Feld dafür
    const { daten, antwort } = await leseJson(request);
    if (antwort) return antwort;

    const { bezug: bezugRoh, einwilligung_id: eId, einwilligung_version: eV, ...rest } = daten;
    const bezug = bezugPruefen(bezugRoh);
    const einw = einwilligungPruefen(eId, eV);
    const body = herkunftAnNachricht(rest);
    if (bezug) {
      body.bezug = bezug;
      // Bis das Backend das Feld kennt (A11), steht die Referenz auch in der Nachricht
      const alt = typeof body.nachricht === "string" ? body.nachricht.trim() : "";
      body.nachricht = alt ? `${alt}\n\nBezug: ${bezug}` : `Bezug: ${bezug}`;
    }
    if (einw.einwilligung_id) Object.assign(body, einw);
    // Hinweistext (lit. b) statt Pflicht-Checkbox: buche_termin verlangt heute `einwilligung` = 1 –
    // ein angezeigter Hinweistext gilt als erfüllt, bis A11 die Pflicht im Backend löst.
    if (einwilligung(einw.einwilligung_id)?.art === "info") body.einwilligung = 1;

    // Forward the data to the external API (no auth – guest-accessible method)
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, ip_adresse: ipAdresse(request) }),
    });

    if (!response.ok) {
      const { status, body: fehler } = await backendFehler(response, "Termin API");
      return NextResponse.json(fehler, { status });
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in termin API:", error);
    return NextResponse.json({ error: NICHT_ERREICHBAR, code: "backend" }, { status: 502 });
  }
}
