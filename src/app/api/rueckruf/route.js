// src/app/api/rueckruf/route.js
import { NextResponse } from "next/server";
import { ipAdresse } from "@/lib/ipAdresse";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { backendFehler, NICHT_ERREICHBAR } from "@/lib/backendFehler";
import { herkunftAnNachricht } from "@/lib/herkunftServer";
import { gedrosselt, leseJson } from "@/lib/api/uber-uns/anfrageWeiterleiten";

const API_URL = `${API_BASE_URL}oekovolt_app.website_api.termin.buche_termin`;

export async function POST(request) {
  const drossel = gedrosselt(request, "rueckruf");
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
    const body = herkunftAnNachricht(daten);

    // Forward the data to the external API (no auth – guest-accessible method)
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, ip_adresse: ipAdresse(request) }),
    });

    if (!response.ok) {
      const { status, body: fehler } = await backendFehler(response, "Rueckruf API");
      return NextResponse.json(fehler, { status });
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in rueckruf API:", error);
    return NextResponse.json(
      { error: NICHT_ERREICHBAR, code: "backend" },
      { status: 502 }
    );
  }
}
