// src/app/api/create_anfrage/route.js
//
// Angebotsanfrage (Konfigurator /angebot, Anlagenübernahme, Startseiten-Formular) an das Backoffice:
// oekovolt_app.website_api.angebot.submit_angebot. Seit Welle A (A08) reicht die Route zusätzlich die
// strukturierten Felder des Konfigurators durch – nur nach Whitelist und mit Längenlimits
// (src/lib/api/anfrage/create_anfrage.js). Fehlen sie, bleibt der Body wie bisher (Frappe-Fallback).

import { NextResponse } from "next/server";
import { ipAdresse } from "@/lib/ipAdresse";
import { getApiHeaders, isApiConfigured, API_BASE_URL } from "@/lib/apiBaseUrl";
import { backendFehler, NICHT_ERREICHBAR } from "@/lib/backendFehler";
import { herkunftAnNachricht, herkunftZeile } from "@/lib/herkunftServer";
import { gedrosselt, leseJson } from "@/lib/api/uber-uns/anfrageWeiterleiten";
import { einwilligung } from "@/lib/einwilligungen";
import { anfrageZusatzfelder, HONEYPOT_FELD } from "@/lib/api/anfrage/create_anfrage";

const API_URL = `${API_BASE_URL}oekovolt_app.website_api.angebot.submit_angebot`;

// Schlüssel, die der Konfigurator sendet und die hier NUR geprüft (nie roh) weitergehen
const ZUSATZ = ["objekt", "firma", "netzebene", "lastgang", "flaeche_m2", "kwp_wunsch", "zeitplan", "rolle", "gremium", "rueckruf_ok", "thema", "zweck", "bezug", "einwilligung_id", "einwilligung_version"];

export async function POST(request) {
  const drossel = gedrosselt(request, "angebot");
  if (drossel) return drossel;

  // Check if API is configured
  if (!isApiConfigured()) {
    console.error("API not configured: Missing NEW_API_KEY or NEW_API_SECRET in environment variables");
    return NextResponse.json({ error: "API not configured" }, { status: 500 });
  }

  try {
    // Herkunft (Kanal, UTM, Einstieg) als Textblock an `nachricht` und `ergebnis.angaben` –
    // submit_angebot kennt dafür kein eigenes Feld, `angaben` wird mit dem Ergebnis gespeichert
    const { daten: roh, antwort } = await leseJson(request);
    if (antwort) return antwort;

    // Honeypot: das Formular nennt das Feld nicht mehr „website“ – das Backend kennt nur `website`
    const { [HONEYPOT_FELD]: honig, ...ohneHonig } = roh;
    if (honig && !ohneHonig.website) ohneHonig.website = String(honig).slice(0, 200);

    // Strukturierte Felder: Rohwerte entfernen, geprüfte Werte (Whitelist, Längen) einsetzen
    for (const k of ZUSATZ) delete ohneHonig[k];
    const body = { ...herkunftAnNachricht(ohneHonig), ...anfrageZusatzfelder(roh) };

    // Hinweistext (lit. b) statt Pflicht-Checkbox: Das heutige Backend verlangt `einwilligung` = 1
    // („Datenschutzhinweise bestätigt“). Wurde ein bekannter Hinweistext angezeigt, gilt das als erfüllt –
    // Kennung und Version stehen daneben (einwilligung_id/-version), bis A11 die Pflicht im Backend löst.
    if (einwilligung(body.einwilligung_id)?.art === "info") body.einwilligung = 1;

    const zeile = herkunftZeile(roh?.herkunft);
    if (zeile && body?.ergebnis && typeof body.ergebnis === "object") {
      const angaben = typeof body.ergebnis.angaben === "string" ? body.ergebnis.angaben.trim() : "";
      body.ergebnis = { ...body.ergebnis, angaben: angaben ? `${angaben}\n\n—\n${zeile}` : zeile };
    }

    // Get authenticated headers
    const headers = getApiHeaders();

    // Forward the data to the external API with authentication
    const response = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ ...body, ip_adresse: ipAdresse(request) }),
    });

    if (!response.ok) {
      const { status, body: fehler } = await backendFehler(response, "Angebot API");
      return NextResponse.json(fehler, { status });
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in PV inquiry API:", error);
    return NextResponse.json({ error: NICHT_ERREICHBAR, code: "backend" }, { status: 502 });
  }
}
