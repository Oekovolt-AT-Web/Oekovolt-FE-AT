// src/app/api/anfrage/route.js (or wherever this file is located)

import { NextResponse } from "next/server";
import { ipAdresse } from "@/lib/ipAdresse";
import { getApiHeaders, isApiConfigured, API_BASE_URL } from "@/lib/apiBaseUrl";
import { backendFehler, NICHT_ERREICHBAR } from "@/lib/backendFehler";
import { herkunftAnNachricht, herkunftZeile } from "@/lib/herkunftServer";
import { gedrosselt, leseJson } from "@/lib/api/uber-uns/anfrageWeiterleiten";

const API_URL = `${API_BASE_URL}oekovolt_app.website_api.angebot.submit_angebot`;

export async function POST(request) {
  const drossel = gedrosselt(request, "angebot");
  if (drossel) return drossel;

    // Check if API is configured
    if (!isApiConfigured()) {
        console.error("API not configured: Missing NEW_API_KEY or NEW_API_SECRET in environment variables");
        return NextResponse.json(
            { error: "API not configured" },
            { status: 500 }
        );
    }

    try {
        // Herkunft (Kanal, UTM, Einstieg) als Textblock an `nachricht` und `ergebnis.angaben` –
        // submit_angebot kennt dafür kein eigenes Feld, `angaben` wird mit dem Ergebnis gespeichert
        const { daten: roh, antwort } = await leseJson(request);
        if (antwort) return antwort;
        const body = herkunftAnNachricht(roh);
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
        return NextResponse.json(
            { error: NICHT_ERREICHBAR, code: "backend" },
            { status: 502 }
        );
    }
}