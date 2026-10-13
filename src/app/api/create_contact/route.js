// src/app/api/create_contact/route.js
//
// Kontaktanfrage (/kontakt, Service-Anfragen, Rückfall der Rechner-Leads) an das Backoffice:
// oekovolt_app.website_api.kontakt.submit_kontakt. Seit Welle A (A08) reicht die Route die
// strukturierten Zusatzfelder des Kontaktformulars durch – nur nach Whitelist und mit Längenlimits
// (src/lib/api/contact/create_contact.js). Fehlen sie, bleibt der Body wie bisher (Frappe-Fallback).

import { NextResponse } from "next/server";
import { ipAdresse } from "@/lib/ipAdresse";
import { getApiHeaders, isApiConfigured, API_BASE_URL } from "@/lib/apiBaseUrl";
import { backendFehler, NICHT_ERREICHBAR } from "@/lib/backendFehler";
import { gedrosselt, leseJson } from "@/lib/api/uber-uns/anfrageWeiterleiten";
import { einwilligung } from "@/lib/einwilligungen";
import { kontaktZusatzfelder, HONEYPOT_FELD } from "@/lib/api/contact/create_contact";

const API_URL = `${API_BASE_URL}oekovolt_app.website_api.kontakt.submit_kontakt`;

// Schlüssel, die das Kontaktformular zusätzlich sendet und die hier NUR geprüft (nie roh) weitergehen
const ZUSATZ = ["firma", "zeitplan", "jahresverbrauch", "rueckruf_ok", "einwilligung_id", "einwilligung_version"];

export async function POST(request) {
  const drossel = gedrosselt(request, "kontakt");
  if (drossel) return drossel;

  // Check if API is configured
  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return NextResponse.json({ error: "API not configured" }, { status: 500 });
  }

  try {
    const { daten: roh, antwort } = await leseJson(request);
    if (antwort) return antwort;

    // Honeypot: das Formular nennt das Feld nicht mehr „website“ – das Backend kennt nur `website`
    const { [HONEYPOT_FELD]: honig, ...body } = roh;
    if (honig && !body.website) body.website = String(honig).slice(0, 200);

    // Strukturierte Felder: Rohwerte entfernen, geprüfte Werte (Whitelist, Längen) einsetzen
    for (const k of ZUSATZ) delete body[k];
    Object.assign(body, kontaktZusatzfelder(roh));

    // Hinweistext (lit. b) statt Pflicht-Checkbox: Das heutige Backend verlangt `einwilligung` = 1
    // („Datenschutzhinweise bestätigt“). Wurde ein bekannter Hinweistext angezeigt, gilt das als erfüllt –
    // Kennung und Version stehen daneben (einwilligung_id/-version), bis A11 die Pflicht im Backend löst.
    if (einwilligung(body.einwilligung_id)?.art === "info") body.einwilligung = 1;

    // Get authenticated headers
    const headers = getApiHeaders();

    // Forward the data to the external API with authentication
    const response = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ ...body, ip_adresse: ipAdresse(request) }),
    });

    if (!response.ok) {
      const { status, body: fehler } = await backendFehler(response, "Kontakt API");
      return NextResponse.json(fehler, { status });
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json({ error: NICHT_ERREICHBAR, code: "backend" }, { status: 502 });
  }
}
